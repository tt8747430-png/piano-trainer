# Matching a choir song to its printed sheet

How a song's `(SATB).mscz` is made to match its PDF and the choir book, and the mistakes made on the way, so they
are not made again. Read before matching a song; add to it when a new mistake is found. The builder is
`scripts/choir` (its [README](../../../../../scripts/choir/README.md)); `scripts/choir/spec.py` says how `match.txt`
is written.

## The order, one song at a time

1. Rebuild the song (`python3 scripts/choir build 2`) and compare it with its PDF **system by system, at high
   resolution**, never page by page at a glance: `python3 scripts/choir compare 2` writes each system of the sheet
   above the same system of ours.
2. Go through each system **voice by voice**: soprano, alto, tenor, bass. For each: every note, every word under
   it, every slur, tie, hold line, dynamic, hairpin, fermata, repeat and text.
3. Check the PDF against the song's pages in the choir book (`Caiet de cor scanat`): same notes, words and marks.
4. Check the parts: `python3 scripts/choir parts <song>` lists a part's note left unsung or a slur over a new
   syllable; export them (`mscore -j` with `["out.pdf", ["part-", ".pdf"]]`) and read each part against the
   sheet, its words above all.
5. Fix, rebuild, and look again at every system changed, until a full pass finds nothing.
6. Only then remove the song's old MuseScore files, commit, and go on to the next song.

A song with only its PDF (song 3) is written in whole: every voice in `[Voice notes]` at the pitch it sounds, with
`key:` and `time:`, built from the template's empty staves. Each pitch is measured, never guessed from a small view:
`python3 scripts/choir heads <song> <page> <staff> scan` names every column of heads between the barlines, and an x
from its `ruler` names the heads at one note; the lengths, ties, slurs and the key's flats are read from the sheet
enlarged. Where the sheet prints one head for both voices of a staff, the lower writes `u:`.

## The house template (not the scans' sizes)

Set once in `template/house.mss`, from engraving practice, and given to every score and each of its parts: a 6 mm
staff, words in Arial 11 pt, 15 mm margins on A4, title 20 pt, credits 10 pt, a bar number at each line's start. The
template also gives the title (the folder's name, its number in bold), hides the voice names and the tempo mark, and
flags each sung eighth. A song keeps its sheet's line and page breaks, words, marks and notes; `match.txt` says only
where its sheet differs from the template (`title:` for its punctuation, `show-tempo`, `beams`, a smaller `spatium`
to keep its pages). `template/Choir SATB.mscz` and `Choir TTBB.mscz` are the same look, empty, for writing a song
by hand.

## Mistakes made, and the check that prevents each

- **Words under the wrong voice.** On a staff of two voices, the words belong to the voice whose rhythm they fit:
  in song 1 the men's words in bars 13-16 are the basses' (lower stems, a note per syllable), not the tenors'. Before
  writing a voice's words, list its notes for those bars (`python3 scripts/choir notes <song> <staff> <voice>`) and match
  each syllable to a note; if the count or the rhythm does not fit, it is the other voice.
- **A syllable on the wrong note of a slurred group.** A slur on the sheet means one syllable over all its notes:
  write `_` for each note it is held onto (song 1, bar 4: "în" over the slurred triplet's first two notes; bar 40:
  "să" over C-D). Never hold onto a note that is already tied on (the tie holds it).
- **Slurs guessed.** A voice's own held syllables are slurred from its words. A voice that sings words printed under
  another voice or staff gets exactly the slurs the sheet prints, listed in `slur:`, never guessed from the other
  voice's syllables: its rhythm can differ (song 1, bar 13: the altos slur A♭-G only, bar 26 the men none).
- **The file differs from the sheet.** The choir's MuseScore files are not the sheet: they can lack a voice (songs
  10, 16), slurs, words, dynamics (27), or have a tie the sheet has not (song 1, bar 38 bass: `untie:`). The sheet
  wins.
- **Marks on one staff only.** A fermata over the whole choir goes on every voice (`marks: … fermata`).
- **Holds and lines.** A held syllable draws its line to the last note it holds; a voice that does not hold has no
  line (song 1, bars 52-53: the tenors' "Ier-ta" has none).
- **A hold beside a hyphen.** In `ta _ -- re` and `Doam -- _ ne` the syllable is still part of its word (a hyphen,
  not a word's end and its line): the tool looks past `_` for the hyphen (fixed in song 1, bars 52-53).
- **A slur without a line.** Where the sheet slurs a syllable's notes but prints no line after it, give the slur in
  `slur:` and no hold (song 1, bars 52-53 soprano).
- **A unison drawn twice.** Where two voices of a staff sing one note, the sheet prints one notehead: the entered
  voice writes `u:` (song 2, bar 8: alto and bass under the soprano's and tenor's B♭), never the pitch again.
- **A setting repeated in every song.** What every sheet shares belongs to the template (`template/house.mss`,
  `spec.read`'s defaults), never a line copied into each `match.txt`.
- **A source claimed and not opened.** A `match.txt` names the book's page only after the page was opened and seen
  to be the same printing (song 3: page 8).
- **A part with another voice's words.** The sheet prints the words once; a part sings the words of the voice it
  moves with, run by run. Shared note by note, song 1's tenor part had the basses' echo ("De toți") under the
  sopranos' line in bar 13. `partwords.py` now chooses by rhythm, and `parts` checks every part.
- **A syllable held in every voice.** Where both voices of a staff slur two notes, the syllable is held (`_`):
  song 1, bar 58, "cu _ -- tul", not "cu -- tul" a note early.
- **A part laid out apart from its score.** A part keeps the main score's line and page breaks.
- **A part that opens with another voice or instrument.** A part must carry its score instrument's id, its staff
  linked to the score's staff, and its voice map as MuseScore 4.7 reads it (the voice's place within its staff).
  Without them MuseScore added the whole men's staff to song 1's Bass part when it was opened. Check a part by
  letting MuseScore open and save the file (`mscore made.mscz -o check.mscz`) and reading the parts' `Tracklist`:
  the Tenor and Bass parts must come back as `sTrack` 4 and 5.
- **A staff's two voices split into chord notes.** Where a voice divides (song 7: the tenors on C♯4 and E4, the basses
  on A3 and A2), the builder once read every chord note as a voice of its own and gave the men's words to the wrong
  bars of their parts. A staff written as two voices now keeps each voice whole, its chords a voice divided
  (`C#4+E4:2.` in `[Voice notes]`), both notes in its part.
- **A line drawn after a syllable inside a word.** The sheet sometimes draws a hold line after a syllable in the middle
  of a word (song 7, bar 30: "Is-ra____ e-le"). Written `Is -- ra -- e`, the tool takes it for a hyphen and draws no
  line: where the sheet prints a line and no hyphen, the syllable is written as a word's end (`Is -- ra e -- le`).
- **Rests printed or left out.** A voice silent while its staff's other voice sings is printed with its rests where
  the sheet prints them (song 7, bars 15-16, 82-85) and left blank (`x:`) where the sheet leaves the staff blank
  (bars 95-97). Read the sheet's rests, never assume.
- **A fermata over one voice.** Where only some voices hold (song 7, bars 45 and 61), each fermata names its voice
  (`45 fermata/Soprano`), never one over every voice.
- **What the sheet prints and the builder lacked.** Song 7 needed first and second endings, two repeats, a change of
  time (6/8 and back), double barlines and divided voices; each is now a `match.txt` line (`spec.py`), never a hand
  edit.
- **A fermata in one part only.** The sheet prints a fermata once per staff (above the upper voice, below the lower);
  both voices of that staff hold. Each part now takes its staff's fermata over its own staff (song 8, bar 17; song 7,
  bars 45 and 61), never below the notes.
