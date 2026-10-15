const fs = require('fs')
const crypto = require('crypto')
const yargs = require('yargs')

const BinPatcher = require('@sestren/bin-patcher')
const SotnPatcher = require('@sestren/bin-patcher/bins/sotn-us')
const core = require('./core.js')

function getExtractionFromBin(buffer) {
    const bin = new BinPatcher.GameData(buffer)
    const result = SotnPatcher.processBinary(bin).extraction
    return result
}

function generatePPF(extractionData, changesToApply) {
    // Start with a blank patch file
    let patchData = BinPatcher.maskNodes(extractionData, 'data')
    // Apply changes to patch file
    changesToApply
    .forEach((changesData) => {
        for (const changeData of changesData.changes) {
            BinPatcher.applyChange(patchData, changeData)
        }
    })
    // Convert patch file to PPF
    const result = BinPatcher.toPPF(patchData, 'Test')
    return result
}

const argv = yargs(process.argv.slice(2))
    .command({ // make
        command: 'make',
        describe: 'Create a PPF file',
        builder: (yargs) => {
            return yargs
        // Main options
            .option('bin', {
                alias: 'b',
                describe: 'Binary file to extract data from',
                type: 'string',
                normalize: true,
            })
            .option('out', {
                describe: 'Path to the output file to create',
                type: 'string',
                normalize: true,
                default: 'seeds/current-seed.ppf',
            })
            .option('seed', {
                alias: 's',
                describe: 'Seed to provide for randomization',
                type: 'string',
            })
        // Music shuffler options
            .option('musicShuffler.on', {
                describe: 'Whether or not to enable shuffling of in-game music; if disabled, all other options in this category are ignored',
                type: 'boolean',
            })
            .option('musicShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the music shuffler',
                type: 'string',
            })
        // Patcher options
            .option('patcher.on', {
                describe: 'Whether or not to apply the given list of patches',
                type: 'boolean',
            })
            .option('patcher.list', {
                describe: 'A list of filepaths of patches to apply, in order',
                type: 'array',
            })
        // Reward shuffler options
            .option('rewardShuffler.on', {
                describe: 'Whether or not to shuffle quest rewards (aka, items and relics). If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('rewardShuffler.method', {
                describe: 'TODO(sestren): Describe rewardShuffler.method',
                type: 'string',
                default: 'chained',
            })
            .option('rewardShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the reward shuffler',
                type: 'string',
            })
        // Room shuffler options
            .option('roomShuffler.on', {
                describe: 'Whether or not to shuffle how rooms within a stage connect. If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('roomShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the room shuffler',
                type: 'string',
            })
        // Stage shuffler options
            .option('stageShuffler.on', {
                describe: 'Whether or not to shuffle the connections between stages (aka, teleporters). If disabled, all other options in this category are ignored.',
                type: 'boolean',
            })
            .option('stageShuffler.seed', {
                describe: 'If supplied, this seed is always used for supplying randomness to the stage shuffler',
                type: 'string',
            })
        // The following options must be declared
            .demandOption(['bin', 'out'])
        },
        handler: (argv) => {
            // Create extraction file from BIN
            const binFile = fs.openSync(argv.bin, 'r')
            const binFileSize = fs.fstatSync(binFile).size
            const buffer = Buffer.alloc(binFileSize)
            fs.readSync(binFile, buffer, 0, binFileSize)
            fs.closeSync(binFile)
            const digest = crypto.createHash('sha256').update(buffer).digest()
            console.log('Digest of disc image', digest.toString('hex'))
            const extractionData = getExtractionFromBin(buffer)
            // Generate shuffler options from args
            const shufflerOptions = {}
            if ('seed' in argv) {
                shufflerOptions.seed = argv.seed
            }
            if ('patcher' in argv) {
                shufflerOptions.patcher = {}
                if (('on' in argv.patcher)) {
                    shufflerOptions.patcher.on = argv.patcher.on
                }
                if ('list' in argv.patcher) {
                    shufflerOptions.patcher.list = argv.patcher.list
                }
            }
            if ('musicShuffler' in argv) {
                shufflerOptions.musicShuffler = {}
                if (('on' in argv.musicShuffler)) {
                    shufflerOptions.musicShuffler.on = argv.musicShuffler.on
                }
                if ('seed' in argv.musicShuffler) {
                    shufflerOptions.musicShuffler.seed = argv.musicShuffler.seed
                }
            }
            if ('rewardShuffler' in argv) {
                shufflerOptions.rewardShuffler = {}
                if (('on' in argv.rewardShuffler)) {
                    shufflerOptions.rewardShuffler.on = argv.rewardShuffler.on
                }
                if ('seed' in argv.rewardShuffler) {
                    shufflerOptions.rewardShuffler.seed = argv.rewardShuffler.seed
                }
                if ('method' in argv.rewardShuffler) {
                    shufflerOptions.rewardShuffler.method = argv.rewardShuffler.method
                }
            }
            if ('roomShuffler' in argv) {
                shufflerOptions.roomShuffler = {}
                if (('on' in argv.roomShuffler)) {
                    shufflerOptions.roomShuffler.on = argv.roomShuffler.on
                }
                if ('seed' in argv.roomShuffler) {
                    shufflerOptions.roomShuffler.seed = argv.roomShuffler.seed
                }
            }
            if ('stageShuffler' in argv) {
                shufflerOptions.stageShuffler = {}
                if (('on' in argv.stageShuffler)) {
                    shufflerOptions.stageShuffler.on = argv.stageShuffler.on
                }
                if ('seed' in argv.stageShuffler) {
                    shufflerOptions.stageShuffler.seed = argv.stageShuffler.seed
                }
            }
            // Generate PPF from shuffler options
            let changesToApply = core.getChangesFromOptions(shufflerOptions, extractionData)
            changesToApply = changesToApply.concat(SotnPatcher.getDefaultChangeDependencies())
            const ppfData = generatePPF(extractionData, changesToApply)
            fs.writeFileSync(argv.out, ppfData)
            // TODO(sestren): Add debug data to PPF description
            //   - Max description length on a PPF is 50 characters
            //   -          11111111112222222222333333333344444444445
            //   - 12345687901234568790123456879012345687901234568790
            //   - sotn 12345678 12345678 12345678 12345678 12345678 
            //   - aaaa gggggggg rrrrrrrr ssssssss tttttttt vvvvvvvv 
            //   - a=Abbreviation
            //   - g=Hash of game name
            //   - r=Hash of args (excluding initial seed)
            //   - s=Hash of initial seed
            //   - t=Hex of Unix time seed was generated
            //   - v=Hash of generator ID and generator version (e.g., SOTN-Shuffler v1.0.0)
        }
    })
    .demandCommand(1)
    .help()
    .parse()