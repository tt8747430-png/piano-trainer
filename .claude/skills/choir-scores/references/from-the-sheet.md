# Writing a song in from its sheet (a PDF, the book, a photo)

For a song with only a PDF (songs 3 and 5 were the first), a voice the choir's files leave out, or a photo of a sheet.
Every voice is written at the pitch it sounds, in `match.txt`, and the build starts from the template's empty staves.

## 1. Read the whole page first

- Render it: `pdftoppm -r 110 -gray -png <sheet.pdf> <out>` for the page, and the same page of the choir book.
- Note the key (the sharps or flats), the time (`C`, `C|`, or the numbers), the first bar of each line
  (`systems:`), the title, the composer at the right and the words' author at the left, and every verse's words.
- A photo or a scan that tilts: `compare.straighten` levels it; a phone photo is cropped to the page first.

## 2. Measure each staff, bar by bar

- `python3 scripts/choir heads <song> <page> <staff> scan` lists the columns of filled noteheads between the
  barlines, named by pitch against the measured staff lines (staves count from the top: treble 1, bass 2, then the
  next system's 3, 4 …). Stems, flags and accidentals add noise: read it beside the sheet, not alone.
- `… heads <song> <page> <staff> ruler` saves the staff with an x ruler; `… heads <song> <page> <staff> <x> <x> …`
  names the heads at those x. Use it for every chord where the eye is unsure.
- **Hollow heads** (halves, wholes) and **accidentals** are not measured: enlarge the bar (crop the ruler image and
  resize 2–3×) and read them against the lines and ledger lines; the key's sharps or flats apply unless a natural
  stands before the note.
- **Lengths, dots, ties, slurs, triplets and rests** are read from the enlarged image, and each bar's lengths must
  add up to the time signature.

## 3. Check by music

- Each vertical chord should make sense (a triad or seventh of the key); a voice that leaps oddly or makes a
  second against the others is measured again.
- A unison (one head, two stems or one stem) is `u:` in the lower voice.
- The words show the rhythm: one syllable per sung note, held syllables over slurred notes. Count a line's
  syllables against its notes before writing it.

## 4. Write `match.txt`

```
# From <sheet>.pdf (1 page) and the choir book, page N. Every voice is written in from the sheet …
lyricist: …
composer: …
key: A
time: C
systems: 1 6 12 17
slur: Alto 2 +1/2, …          (slurs of voices whose words are printed elsewhere)

[Soprano notes]
1: @1 A4:2 C#5:4. D5:8 @2 …    (pitches with their accidentals as sung: C#5, Bb4)
[Alto notes]
…
[Soprano]
1: @1 1.Mă -- ri -- re Ți _ _ _ _ -- e, …
[Bass italic]
1: @13 * Că l'ai …            (an echo: `*` passes a note not sung to these words)
```

- Notes: `C#5:4.` (pitch, length 1 2 4 8 16 32, dots), `r:4` rest, `u:4` unison, `~` tie on, `t` triplet; `@N`
  starts bar N. Words: `--` hyphen, `_` hold, `*` skip a note, `^` a syllable on a tied note, `|` after a syllable
  no line. Never jump with `@N` in the middle of a verse whose next syllable is not the bar's first note.

## 5. Build and compare

`python3 scripts/choir build <n>` (it says "made from the template") and `python3 scripts/choir compare <n>`; read
every system, sheet above ours, voice by voice, and fix until a full pass finds nothing (the song's `MATCHING.md`
order continues from step 3).
