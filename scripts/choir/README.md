# The choir's score builder

Makes each choir song's MuseScore score in `piano-data/scores/hymns/choir/musescore/`: one file per song with the
two staves of the printed sheet, a part per voice tied to its voice, piano as the sound, and one house look. Run from
the repo root, with MuseScore Studio 4 as `mscore` (on a server, under `xvfb-run`):

```bash
python3 scripts/choir build [song ...]    # every song when none is named
python3 scripts/choir compare 2           # each system of song 2's sheet above ours, as images
python3 scripts/choir notes 2 [1 0]       # song 2's voices (or staff 1, voice 0) bar by bar
python3 scripts/choir heads 3 1 1 scan    # song 3's sheet, page 1, staff 1: its noteheads by pitch, bar by bar
python3 scripts/choir parts 1             # what song 1's parts' words get wrong
python3 scripts/choir musicxml [song ...] # the MusicXML 4.0 file: an open score, a part per voice
python3 scripts/choir template            # template/Choir SATB.mscz and Choir TTBB.mscz
python3 scripts/choir index               # INDEX.md
```

A song is named by its folder's name or its number (`2`; `men 2` for the men's choir). How a song is matched to its sheet, the order of the work and the mistakes to avoid are in
the songs' [`MATCHING.md`](../../piano-data/scores/hymns/choir/musescore/MATCHING.md); the `match.txt` format is in
`spec.py`.

## The template

Every made score and each of its parts takes the house template, so no song needs its look set by hand:

- **`template/house.mss`**, the style: a 6 mm staff, A4 with 15 mm margins, words in Arial 11 pt, title 20 pt,
  credits 10 pt, a bar number at each line's start, the staves spread down the page (each value's reason is in the
  file). A song's `match.txt` changes only what its sheet needs (`spatium`, `lyrics-size`, `bar-numbers`, `footer`,
  `hide-empty-staves`).
- **The defaults** (`spec.read`): the title from the folder's name with its number in bold (`002. Glas de trâmbiți a
  sunat` is **2** Glas de trâmbiți a sunat), no voice names before the staves, the tempo set but not printed, each
  sung eighth on its own flag. A `match.txt` says only where its sheet differs (`title:` for punctuation,
  `show-tempo`, `show-names`, `beams`).
- **`template/Choir SATB.mscz`, `Choir TTBB.mscz`**: empty scores made the same way, for writing a song in
  MuseScore by hand: Soprano and Alto on a treble staff, Tenor and Bass on a bass staff (Tenor 1 and 2 on a tenor
  staff, Baritone and Bass on a bass staff), the upper voice of each pair as voice 1, the lower as voice 2, bracketed,
  and a part per voice tied to it.

## How a song is built

1. `build.py` reads every MuseScore file of the song through MuseScore as MusicXML and takes the fullest as the full
   score (or puts one together from one-voice files).
2. `sheet.py` corrects the MusicXML from `match.txt`: the notes of voices the files lack (`[Voice notes]`), repeats
   and tempo, and the words under each voice.
3. `voices.py` splits it into a part per voice: each voice in its octave and clef, unison bars given to both voices,
   words shared with voices that sing the same rhythm.
4. MuseScore saves the main score and each part; `compose.py` puts them into one file: octaves and clefs fixed, each
   staff named for its voices, piano, and, for a matched song, `engrave.py` (words, title, breaks, marks, hidden
   staves, ties) and `slurs.py` (held syllables slurred, the sheet's own slurs, each part's slurs from its voice);
   then `house.py` gives the score and every part the house style.
5. Each part is then made from the finished main score (`parts.py`): its lines and pages are the score's, its
   title frame (with the part's name), marks and tempo too, its slurs its voice's, and its words the ones its voice sings: its own, or, run by run, those of the voice it moves
   with (the tenors with the sopranos, the altos with the basses' echo), a word whole from one voice, a syllable it
   holds over several notes slurred. `parts` lists what is still wrong.
6. A song whose old files are removed is final: a build makes it again from them as git keeps them, so a rule
   fixed in the builder reaches every finished song.

A song that exists only as a PDF is written in whole from its sheet: its `match.txt` gives `key:`, `time:` and a
`[Voice notes]` block for every voice, and the build starts from the template's two empty staves
(`template.skeleton`), then runs as above. `heads` reads the sheet's noteheads for it: `ruler` saves a staff with
an x ruler, `scan` lists every column of heads between the barlines, and x values name the heads there.

| Module      | Holds                                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| `common.py` | paths, the choirs and their voices, note values, MuseScore and its files      |
| `spec.py`   | `match.txt` and the template's defaults                                       |
| `words.py`  | pairing syllables with the notes a voice sings                                |
| `sheet.py`  | corrections to the MusicXML before the split                                  |
| `voices.py` | the split into a part per voice                                               |
| `compose.py`| the made file: main score, parts, octaves, piano                              |
| `engrave.py`| corrections in MuseScore's own file                                           |
| `slurs.py`  | slurs                                                                         |
| `house.py`  | the house style from `template/house.mss`                                     |
| `parts.py`  | each part from the main score: layout, title, marks, words, slurs; their check |
| `template.py` | the empty template scores, and the two empty staves a sheet-only song starts on |
| `mxl.py`    | the MusicXML 4.0 file (`<song> (SATB).mxl`): the open score, a part per voice |
| `compare.py`| the sheet and ours, system by system                                          |
| `heads.py`  | the printed sheet's noteheads named by pitch                                  |
| `index.py`  | `INDEX.md`                                                                    |

## The MusicXML file

`<song> (SATB).mxl` is MusicXML 4.0, valid against its schema, written by `python3 scripts/choir musicxml <song>`:
the open score, a part per voice (Soprano, Alto, Tenor, Bass), each declared as that voice and holding its notes,
words and marks as the made score's part, under the score's title, credits and page; each held syllable's line ends
on its last note, the words in Arial 11. Dorico imports a player per voice with its own part and condenses them to the
closed score (SA and TB) with condensing on; MuseScore shows the four staves. The `.mscz` stays the closed score.
