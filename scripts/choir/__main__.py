"""The choir's score builder. Run from the repo root (MuseScore Studio 4 as `mscore`, on a server under xvfb-run):

    python3 scripts/choir build [song folder ...]     make the songs' scores (every song when none is named)
    python3 scripts/choir compare <song> [out folder]  each system of the printed sheet above ours, as images
    python3 scripts/choir notes <song> [staff voice]   a voice's notes bar by bar (every voice when none is named)
    python3 scripts/choir heads <song> <page> <staff> [scan | ruler | x ...]
                                                      the printed sheet's noteheads named by pitch, for writing a
                                                      voice in from the sheet
    python3 scripts/choir parts <song>                 what each part's words get wrong (a note not sung, a slur
                                                      over a new syllable)
    python3 scripts/choir musicxml [song ...]           the MusicXML 4.0 file: the open score, a part per
                                                      voice (Dorico condenses it to SA and TB)
    python3 scripts/choir template                    write the empty SATB and TTBB scores in template/
    python3 scripts/choir index                       write INDEX.md

A song is named by its folder name or its number (`2`; `men 2` for the men's choir). README.md beside this file
says what each module does; MATCHING.md beside the songs says how a song is matched to its sheet.
"""

import os
import sys

import build
import compare
import engrave
import heads
import index
import mxl
import parts
import template


def notes(args):
    path = args[0] if args[0].endswith('.mscz') else compare.song(args[0])[1]
    if len(args) == 3:
        engrave.notes(path, int(args[1]), int(args[2]))
        return
    for staff, voice in ((0, 0), (0, 1), (1, 0), (1, 1)):
        print(f'staff {staff} voice {voice}:')
        engrave.notes(path, staff, voice)


def main(argv):
    if not argv or argv[0] in ('-h', '--help', 'help'):
        print(__doc__)
        return
    command, args = argv[0], argv[1:]
    if command == 'build':
        build.build({os.path.basename(compare.song(a)[0]) for a in args})
    elif command == 'compare':
        compare.compare(*args)
    elif command == 'notes':
        notes(args)
    elif command == 'heads':
        heads.heads(args[0], args[1], args[2], args[3:])
    elif command == 'parts':
        parts.report(compare.song(args[0])[1])
    elif command == 'musicxml':
        mxl.export({os.path.basename(compare.song(a)[0]) for a in args})
    elif command == 'template':
        template.write()
    elif command == 'index':
        index.main()
    else:
        raise SystemExit(f'no command {command}: {__doc__}')


if __name__ == '__main__':
    main(sys.argv[1:])
