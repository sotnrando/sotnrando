'use strict'
/**
 * psx_to_psp_eboot.js
 *
 * Converts a raw PSX .bin image into a PSP EBOOT.PBP that runs under the
 * PSP's built-in PS1 Classics (POPS) emulator.
 *
 * Ported from popstationr (DarkAlex / Coldbird)
 * Binary blobs are generated
 */

const fs   = require('fs')
const path = require('path')
const zlib = require('zlib')

const {
  data1,
  data2,
  parambody,
  startdatheader,
  startdatfooter,
  logo_buffer,
} = require('./psx_psp_blobs')

// ─── constants ────────────────────────────────────────────────────────────────

const SECTOR_SIZE   = 0x9300    // PSX CD sector block size used by POPS
const PSAR_ISO_OFF  = 0x100000  // ISO data starts 1 MB into DATA.PSAR

function resolveDataPsp(options) {
  const opts = options || {}

  if (Buffer.isBuffer(opts.dataPspBuffer)) {
    if (opts.dataPspBuffer.length === 0) throw new Error('dataPspBuffer must not be empty')
    return opts.dataPspBuffer
  }

  const candidatePaths = []
  if (opts.dataPspPath) {
    candidatePaths.push(path.resolve(opts.dataPspPath))
  }
  candidatePaths.push(path.resolve(__dirname, '..', 'DATA.PSP'))

  for (const resolved of candidatePaths) {
    if (!fs.existsSync(resolved)) continue
    const fileBuf = fs.readFileSync(resolved)
    if (fileBuf.length === 0) throw new Error(`DATA.PSP file is empty: ${resolved}`)
    return fileBuf
  }

  throw new Error(
    'DATA.PSP not found. Provide options.dataPspPath, or place DATA.PSP at project root (DATA.PSP).',
  )
}

// ─── PARAM.SFO helpers ────────────────────────────────────────────────────────

/**
 * Reads a null-terminated ASCII string from buf starting at offset.
 */
function readCString(buf, offset) {
  let end = offset
  while (end < buf.length && buf[end] !== 0) end++
  return buf.toString('ascii', offset, end)
}

/**
 * Patches the TITLE field inside a pre-baked PARAM.SFO buffer (in-place).
 * Mirrors the C SetSFOTitle() function from popstationr.
 *
 * SFO header layout (all uint32 LE):
 *   0x00  magic "\x00PSF"
 *   0x04  version
 *   0x08  fields_table_offs  (key table base)
 *   0x0C  values_table_offs  (data table base)
 *   0x10  nitems
 *
 * Each SFODir entry (16 bytes, starting at sfo+0x14):
 *   0x00  field_offs  uint16
 *   0x02  unk         uint8
 *   0x03  type        uint8
 *   0x04  length      uint32  actual data length (incl. null)
 *   0x08  size        uint32  max field capacity
 *   0x0C  val_offs    uint16  relative offset into values table
 *   0x0E  unk4        uint16
 */
function patchSfoTitle(sfo, title) {
  const fieldsTableOffs = sfo.readUInt32LE(8)
  const valuesTableOffs = sfo.readUInt32LE(12)
  const nitems          = sfo.readUInt32LE(16)

  for (let i = 0; i < nitems; i++) {
    const entryBase = 0x14 + i * 16
    const fieldOffs = sfo.readUInt16LE(entryBase)
    const size      = sfo.readUInt32LE(entryBase + 8)
    const valOffs   = sfo.readUInt16LE(entryBase + 12)

    if (readCString(sfo, fieldsTableOffs + fieldOffs) !== 'TITLE') continue

    const dest = valuesTableOffs + valOffs
    sfo.fill(0, dest, dest + size)
    sfo.write(title.slice(0, size - 1), dest, 'ascii')
    sfo.writeUInt32LE(Math.min(title.length + 1, size), entryBase + 4)
    break
  }
}

// ─── DATA.PSAR builder ────────────────────────────────────────────────────────

/**
 * Builds the complete DATA.PSAR archive that embeds a raw PSX ISO.
 *
 * Layout (offsets relative to DATA.PSAR start):
 *   0x0000  "PSISOIMG0000"           12 bytes
 *   0x000C  uint32 p1                4 bytes  (see below)
 *   0x0010  0xFC × uint32 zeros      pad to 0x0400
 *   0x0400  data1[] game-code patched (3616 bytes)
 *   0x1220  uint32 p2 = p1+0x2D31
 *   0x1224  data2[] title patched at +8 (11740 bytes)
 *   0x4010  IsoIndex[] numSectors×32 bytes
 *           uncompressed: each [uint32 offset, uint32 SECTOR_SIZE, 6×uint32 zero]
 *           compressed:   each [uint32 offset, uint32 compressedLen, 6×uint32 zero]
 *   …       zero pad to 0x100000
 *   0x100000 ISO sector data
 *            uncompressed: raw ISO, sector-aligned
 *            compressed:   raw-deflate blocks, variable length; padded to 0x10 boundary
 *   +…      startdatheader + logo_buffer + startdatfooter
 *
 * p1 (at 0x000C):
 *   uncompressed: isoSize + PSAR_ISO_OFF
 *   compressed:   PSAR_ISO_OFF + alignedCompressedSize  (actual data end within PSAR)
 *
 * @param {Buffer} isoBuffer
 * @param {string} title
 * @param {string} gameCode        9-char PSX ID e.g. "SLUS00067"
 * @param {number} [compressionLevel=0]  0 = store (no compression), 1–9 = zlib level
 * @returns {Buffer}
 */
function buildDataPsar(isoBuffer, title, gameCode, compressionLevel = 0) {
  const isoRealSize = isoBuffer.length
  const isoSize = (isoRealSize % SECTOR_SIZE === 0)
    ? isoRealSize
    : isoRealSize + (SECTOR_SIZE - (isoRealSize % SECTOR_SIZE))
  const numSectors = isoSize / SECTOR_SIZE

  // ── shared header builder ──────────────────────────────────────────────────
  function writeCommonHeader(psar, p1Value) {
    let pos = 0
    psar.write('PSISOIMG0000', pos, 'ascii'); pos += 12
    psar.writeUInt32LE(p1Value, pos); pos += 4
    pos += 0xFC * 4   // zero-filled padding to 0x0400

    const d1 = Buffer.from(data1)
    d1.write(gameCode.slice(0, 4), 1, 'ascii')
    d1.write(gameCode.slice(4),    6, 'ascii')
    d1.copy(psar, pos); pos += d1.length   // pos = 0x1220

    psar.writeUInt32LE(p1Value + 0x2D31, pos); pos += 4  // pos = 0x1224

    const d2 = Buffer.from(data2)
    d2.fill(0, 8, 8 + 256)
    d2.write(title, 8, 'ascii')
    d2.copy(psar, pos); pos += d2.length   // pos = 0x4010

    return pos  // = 0x4010, ready for IsoIndex table
  }

  // ── compressed path ────────────────────────────────────────────────────────
  if (compressionLevel > 0) {
    // Pass 1: compress every sector and collect chunks + index entries
    const chunks  = []
    const indexes = []
    let rawOffset = 0

    for (let i = 0; i < numSectors; i++) {
      const srcStart = i * SECTOR_SIZE
      const sector   = Buffer.alloc(SECTOR_SIZE, 0)
      isoBuffer.copy(sector, 0, srcStart, Math.min(srcStart + SECTOR_SIZE, isoRealSize))

      const compressed = zlib.deflateRawSync(sector, { level: compressionLevel })
      const useRaw     = compressed.length >= SECTOR_SIZE
      const chunk      = useRaw ? sector : compressed

      indexes.push({ offset: rawOffset, length: chunk.length })
      chunks.push(chunk)
      rawOffset += chunk.length
    }

    // Align compressed data region to 0x10 (mirrors popstationr end_offset logic)
    const compressedDataSize = rawOffset
    const alignedSize = compressedDataSize % 0x10 !== 0
      ? compressedDataSize + (0x10 - (compressedDataSize % 0x10))
      : compressedDataSize

    const endOffset = PSAR_ISO_OFF + alignedSize   // p1 value
    const psarSize  = endOffset
      + startdatheader.length
      + logo_buffer.length
      + startdatfooter.length

    const psar = Buffer.alloc(psarSize, 0)

    // Common header (p1 = endOffset)
    let pos = writeCommonHeader(psar, endOffset)

    // IsoIndex table — variable offsets and lengths
    for (let i = 0; i < numSectors; i++) {
      psar.writeUInt32LE(indexes[i].offset, pos)
      psar.writeUInt32LE(indexes[i].length, pos + 4)
      pos += 32
    }

    // Compressed sector data at 0x100000
    pos = PSAR_ISO_OFF
    for (const chunk of chunks) {
      chunk.copy(psar, pos)
      pos += chunk.length
    }

    // Jump past alignment padding (buffer already zero-filled)
    pos = endOffset

    // STARTDAT chain
    startdatheader.copy(psar, pos); pos += startdatheader.length
    logo_buffer.copy(psar,    pos); pos += logo_buffer.length
    startdatfooter.copy(psar, pos)

    return psar
  }

  // ── uncompressed path (original behaviour) ────────────────────────────────
  const psarSize = PSAR_ISO_OFF + isoSize
    + startdatheader.length
    + logo_buffer.length
    + startdatfooter.length

  const psar = Buffer.alloc(psarSize, 0)

  let pos = writeCommonHeader(psar, isoSize + PSAR_ISO_OFF)

  // IsoIndex table (fixed SECTOR_SIZE offsets)
  let sectorOffset = 0
  for (let i = 0; i < numSectors; i++) {
    psar.writeUInt32LE(sectorOffset, pos)
    psar.writeUInt32LE(SECTOR_SIZE,  pos + 4)
    pos += 32
    sectorOffset += SECTOR_SIZE
  }

  // ISO data at fixed 0x100000 offset
  pos = PSAR_ISO_OFF
  isoBuffer.copy(psar, pos); pos += isoSize

  // STARTDAT chain
  startdatheader.copy(psar, pos); pos += startdatheader.length
  logo_buffer.copy(psar,    pos); pos += logo_buffer.length
  startdatfooter.copy(psar, pos)

  return psar
}

// ─── PBP assembler ────────────────────────────────────────────────────────────

/**
 * Builds and writes a PSP EBOOT.PBP from a raw PSX ISO buffer.
 *
 * PBP section order:
 *   PARAM.SFO  (944 bytes — parambody template, title+code patched)
 *   ICON0.PNG  (empty)
 *   ICON1.PMF  (empty)
 *   PIC0.PNG   (empty)
 *   PIC1.PNG   (empty)
 *   SND0.AT3   (empty)
 *   DATA.PSP   (external file content)
 *   <zero pad to next 0x10000 boundary>
 *   DATA.PSAR  (full archive built by buildDataPsar)
 *
 * @param {Buffer} isoBuffer   Raw PSX disc image (.bin)
 * @param {string} outputPath  Destination path (e.g. "EBOOT.PBP")
 * @param {string} [title]
 * @param {string} [gameCode]  9-char PSX ID
 * @param {Object} [options]
 * @param {Buffer} [options.dataPspBuffer]     Optional external DATA.PSP payload
 * @param {string} [options.dataPspPath]       Optional external DATA.PSP path
 * @param {number} [options.compressionLevel=0]  0 = store, 1–9 = zlib deflate level
 * @returns {Buffer}
 */
function createEboot(
  isoBuffer,
  outputPath,
  title    = 'Castlevania: Symphony of the Night',
  gameCode = 'SLUS00067',
  options = {},
) {
  const compressionLevel = (options.compressionLevel !== undefined)
    ? options.compressionLevel
    : 0

  // PARAM.SFO
  const sfo = Buffer.from(parambody)
  patchSfoTitle(sfo, title)
  sfo.fill(0, 0x108, 0x108 + 12)
  sfo.write(gameCode, 0x108, 'ascii')

  // DATA.PSAR
  const psarBuf    = buildDataPsar(isoBuffer, title, gameCode, compressionLevel)
  const dataPspBuf = resolveDataPsp(options)

  // Compute PBP section offsets
  const PBP_HEADER_SIZE = 0x28

  let cur = PBP_HEADER_SIZE
  const offSfo  = cur; cur += sfo.length
  const offIcon0 = cur  // all empty sections share the same offset
  const offIcon1 = cur
  const offPic0  = cur
  const offPic1  = cur
  const offSnd   = cur
  const offDpsp  = cur; cur += dataPspBuf.length

  // Align DATA.PSAR to next 0x10000 boundary
  if (cur % 0x10000 !== 0) cur += 0x10000 - (cur % 0x10000)
  const offPsar = cur

  // PBP header
  const header = Buffer.alloc(PBP_HEADER_SIZE)
  header.writeUInt32LE(0x50425000, 0)   // magic "\x00PBP"
  header.writeUInt32LE(0x00010000, 4)   // version
  header.writeUInt32LE(offSfo,    8)
  header.writeUInt32LE(offIcon0, 12)
  header.writeUInt32LE(offIcon1, 16)
  header.writeUInt32LE(offPic0,  20)
  header.writeUInt32LE(offPic1,  24)
  header.writeUInt32LE(offSnd,   28)
  header.writeUInt32LE(offDpsp,  32)
  header.writeUInt32LE(offPsar,  36)

  // Padding between DATA.PSP end and DATA.PSAR start
  const padSize = offPsar - (offDpsp + dataPspBuf.length)
  const padding = Buffer.alloc(padSize, 0)

  // Assemble
  const eboot = Buffer.concat([header, sfo, dataPspBuf, padding, psarBuf])

  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true })
    fs.writeFileSync(outputPath, eboot)
    console.log(
      `EBOOT.PBP written → ${outputPath}  (${(eboot.length / 1024 / 1024).toFixed(1)} MB)`,
    )
  }

  return eboot
}

// ─── exports ──────────────────────────────────────────────────────────────────

module.exports = { createEboot, buildDataPsar, patchSfoTitle }

