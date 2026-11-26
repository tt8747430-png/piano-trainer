---
name: choir-scores
description: Use in piano-trainer for any work on the choir's songs in piano-data/scores/hymns/choir/musescore - making, checking or fixing a song's (SATB) or (TTBB) MuseScore score or its voice parts, writing a song in from its PDF, the choir book or a photo of a sheet, the house template, match.txt, or the scripts/choir builder - and whenever the owner says a song, a part, a word, a slur or the layout "is wrong" or "not like the original".
---

# Making the choir's scores

Each song becomes one MuseScore file that prints like the choir's sheet (its two staves, its lines and pages, its
words and marks) in the house look, holds a part per voice that a singer can learn from, and plays on piano. The
owner judges it by opening it in MuseScore Studio beside the printed sheet: every bar, every word, every part.

Read before the first song of a session, in full: this file, [the owner's words](references/owner-words.md),
[SATB practice](references/satb-practice.md), and the songs' `MATCHING.md` (the order of the work and every mistake
made so far). Writing a song from a PDF or image: also [from the sheet](references/from-the-sheet.md). The tool is
`python3 scripts/choir` ([README](../../../scripts/choir/README.md)); the `match.txt` format is in
`scripts/choir/spec.py`.

## The order, one song at a time, in number order

1. **Read the sheet** (the song's PDF) and the same song in the choir book (`Caiet de cor scanat 1-45.pdf`,
   `46-100.pdf`); open the book's page before naming it in `match.txt`.
2. **Write or correct `match.txt`** with only what the sheet has and the files lack: words for every voice and
   verse, notes of any voice missing (every voice, with `key:` and `time:`, for a song that is only a PDF), line
   and page breaks, marks, slurs, ties, texts. What every song shares is the template's, never a line here.
3. **Build** (`python3 scripts/choir build <n>`) and **compare system by system**
   (`python3 scripts/choir compare <n>`), each system voice by voice: notes, rhythm, words under the right notes,
   slurs, ties, lines, dynamics, fermatas, repeats, texts, clefs, key, time, title and credits.
4. **Check the parts**: `python3 scripts/choir parts <n>`, then export them and read each against the sheet, its
   words above all; then let MuseScore open and save the file and confirm each part still maps to its own voice
   (`MATCHING.md`, the last mistake).
5. **Fix, rebuild, look again** at everything changed, until a full pass finds nothing.
6. **Only then** remove the song's old MuseScore files, regenerate `INDEX.md`, commit (one song, one commit) and
   push, and go straight on to the next song. A song is never left half done; difficulty is no reason to skip.

## Rules that sent work back

- **The sheet wins** over the choir's MuseScore files: a voice, word, slur, tie or mark the sheet has and a file
  lacks is written in; one the file has and the sheet lacks goes.
- **Measure, never guess** a pitch from a small view: `python3 scripts/choir heads`, enlarged crops, the harmony as
  a check. Read each voice through the whole song before writing it.
- **Words under the voice they fit**: on a staff of two voices, the words belong to the voice whose rhythm they
  fit; a part sings the words of the voice it moves with, a word whole from one voice.
- **Slurs as printed**: a voice's own held syllables are slurred; any other slur comes from the sheet (`slur:`);
  none is guessed.
- **One look for all**: change the template (`template/house.mss`, `spec.read`'s defaults) or the builder, never one
  song's file by hand; rebuild every song after a builder change (`python3 scripts/choir build`) and check that
  nothing else moved.
- **Each part is the score's**: its lines and pages, title, marks, tempo and words come from the finished score,
  and it opens in MuseScore with one instrument showing only its voice.
- **Every mistake becomes a check**: a new kind of mistake is written into `MATCHING.md` the same turn, with the
  song and bar it was found in.
- **Done is verified**: a song is reported finished only after the compare images, the parts check and the
  re-save check were read, never on the build's word.
