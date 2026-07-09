# SotN Randomizer

This is a romhacking tool to randomize some things about `Castlevania:
Symphony of the Night`.

## Browser

https://sotn.io

## CLI

```shell
$ git clone https://github.com/sotnrando/sotnrando
$ cd sotnrando
$ npm install
```

### Basic usage

To randomize your disc image, just pass in the path to your vanilla .bin file
using the `--in-bin` option and an output path using the `--out` option.
This will use the current time as the seed:

```shell
$ node randomize -i sotn.bin -o rando.bin
```

You can print the seed used with the `--verbose` flag:

```shell
$ node randomize -v -i sotn.bin -o rando.bin
```

The more `--verbose` flags you include, the more information about the
randomization gets printed:

```shell
$ node randomize -vvv -i rando.bin
```

If you omit the `--out` option, the randomizations will be applied to the
.bin in-place. This is not recommended unless you are randomizing a fresh copy
of your vanilla bin:

```shell
$ cp sotn.bin rando.bin
$ node randomize -i rando.bin
```

### PPF mode

If you omit the `--in-bin` option, the randomizer will create a PPF patch file.

```shell
$ node randomize -o rando.ppf
```

You can then use your choice of PPF patcher utilities. *Note:* After applying
the patch, you must perform ECC/EDC recalculation.

Useful links:
* [ppf.sotn.io](https://ppf.sotn.io) (Browser)
* [ppfdev](https://github.com/meunierd/ppf) (Source)
* [PPF-O-Matic](https://www.romhacking.net/utilities/356/) (Windows binary)
* [error_recalc](https://www.romhacking.net/utilities/1264/) (Windows binary
  and source)
* [ECCRegen](https://consolecopyworld.com/psx/psx_utils_misc.shtml#ECCRegen)
  (Windows binary)

### Seed URLs

If you plan on sharing a seed with others, the easiest way to use CLI is with
the `--race` option or seed URLs. To use the current time as a seed and print
its URL and starting equipment:

```shell
$ node randomize -r -i rando.bin
```

To use a custom seed and print its URL and starting equipment:

```shell
$ node randomize -r -i rando.bin -s myseed
```

To use a copied seed URL, paste in the URL as an argument. The `--race` option
will be automatically enabled:

```shell
$ node randomize -i rando.bin https://sotn.io/?myseed
```

The `--race` option has an inherent verbosity level of 2. You can override this
behavior by supplying your own `--verbose` flag(s):

```shell
$ node randomize -vr -i rando.bin -s myseed                 # Less verbose
$ node randomize -v -i rando.bin https://sotn.io/?myseed    # Less verbose
$ node randomize -vvvr -i rando.bin -s myseed               # More verbose
$ node randomize -vvv -i rando.bin https://sotn.io/?myseed  # More verbose
```

### Dry running

You can omit the `--in-bin` and `--out` options to perform a dry run.

To print starting equipment and relic locations for a URL without actually
writing the randomizations to your disc image or PPF patch file:

```shell
$ node randomize -vvv https://sotn.io/?myseed
```

### Presets

Presets are settings that generate different randomizations from those found in
the default mode. The randomizer includes several built-in presets that can be
described using the help system:

```shell
$ node randomize --help preset
```

To create your own preset, save a copy of `presets/sample.json` and modify its
content with your own customizations. For example, you have created your preset
and named it `presets/mypreset.json`. To randomize a bin using your preset:

```shell
$ node randomize -i sotn.bin -o rando.bin -f presets/mypreset
```

To create a URL that allows others to use your preset:

```shell
$ node randomize -rn -f presets/mypreset
```

### PSP EBOOT mode

You can generate a PSP EBOOT.PBP file directly from a randomized disc image. This
allows you to play the randomized game on PSP via the built-in PS1 Classics (POPS)
emulator:

```shell
$ node randomize -i sotn.bin -o randomized.bin --psp-eboot EBOOT.PBP
```

This will create an EBOOT.PBP file that can be placed on a PSP with PS1 emulation
support. You will need a `DATA.PSP` payload file in your project root, or you can
specify a custom path:

```shell
$ node randomize -i sotn.bin -o randomized.bin --psp-eboot EBOOT.PBP --data-psp /path/to/DATA.PSP
```

#### Compression

By default, the EBOOT is created without ISO compression. You can enable zlib
compression using the `--compression-level` option (0-9, where 0 is no compression
and 9 is maximum compression):

```shell
$ node randomize -i sotn.bin -o randomized.bin --psp-eboot EBOOT.PBP --compression-level 6
```

Higher compression levels result in smaller EBOOT files but take longer to compress.
Level 6 is a good balance between compression and speed. Compression is implemented
identically to [popstationr](https://github.com/pseiler/popstationr) — each
0x9300-byte sector is compressed independently with raw deflate, and sectors that
don't compress smaller are stored uncompressed.

## Console

Randomized disc images can be played on all consoles that run game backups.
This includes hardmodded PlayStations and softmodded PS2s. The latter approach
is more accessible and will be outlined in this section.

### Hardware needed

**PS2 console compatible with FreeMcBoot**

Check the compatibility list [here](https://www.ps2-home.com/forum/app.php/page/fmcb-compatible-ps2-models-chart).

**PS2 memcard with FreeMcBoot and uLaunchELF**

You can find these on Amazon or make one yourself.

**USB thumb drive**

This will store your randomized disc image.

### Software needed

**POPStarter r13 WIP 06 Beta 17**

Download from [here](https://www.ps2-home.com/forum/viewtopic.php?p=13938#p13938).
*Note:* This version is known to cause random crashes on some PS2 revisions.
Unfortunately, other recent POPStarter versions do not load the castle map
corretly. Your mileage may vary.

**POPS_IOX.PAK**

You will need to locate this yourself. MD5: `a625d0b3036823cdbf04a3c0e1648901`

**CUE2POPS**

* Windows version [here](https://www.ps2-home.com/forum/viewtopic.php?t=2148).
* Mac version [here](https://github.com/suicvne/cue2pops-gui-mac).
* Linux version [here](https://github.com/makefu/cue2pops-linux).

### Process

It is important to note that the file names and capitalization in this
section must be matched. POPStarter is very strict and this will not work if
your files are named differently.

1) Create a directory on your USB drive named `POPS` and copy `POPS_IOX.PAK`
   into it.

2) Rename `POPSTARTER.ELF` to `XX.SOTN.ELF` and copy it your USB drive.

3) Using a text editor, create a file named `SOTN.CUE` with this content:

```
FILE "SOTN.BIN" BINARY
  TRACK 01 MODE2/2352
    INDEX 01 00:00:00
```

4) Randomize your bin and rename the output to `SOTN.BIN`. Put this file in the
   same directory as `SOTN.CUE`.

5) Use CUE2POPS to convert `SOTN.CUE` to a VCD. Save the output to the `POPS`
   directory on your USB drive. It should be named `SOTN.VCD`.

At this point the file layout on your USB drive should look like this:

```
POPS/POPS_IOX.PAK
POPS/SOTN.VCD
XX.SOTN.ELF
```

6) Remove any game disc from your PS2 and insert your FreeMcBoot memcard and
   USB drive.

7) Start your PS2 and on the FreeMcBoot system menu, select uLaunchELF.

8) Once uLaunchELF has started, select `mass0` and then `XX.SOTN.ELF`.

Whenever you randomize a new disc image, you will need to follow the above
directions starting at step 4.
