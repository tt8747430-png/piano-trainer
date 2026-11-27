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
- **An echo's holds drawn as lines.** Where a voice sings its own words only now and then (song 9, bars 9-15: the
  basses' "Vi-no", "El să"), the notes between are passed with `*`, never held with `_`: a hold draws a line and a
  slur over notes sung to the other voices' words.
- **A short last bar filled with a rest.** After a pickup the last bar is printed short (song 9, bar 17): `bar-length:`
  leaves out the file's trailing rest.
- **A part's bars counted apart from its score's, its header over its name.** A part counts a pickup the sheet counts
  (song 9: bar 4 at the second line, as the score), and a title frame text keeps the style's alignment (song 9's
  words' author stood over the part's name).
- **A part's borrowed line over its own words.** A syllable a part takes from a voice that holds it ends its line at
  the part's own next syllable (song 9, bar 17: the altos' "cit," then their "ești fe-ri-cit!").
- **The words' author beside the title.** A file's own alignment for its credits ("left,top") put the words' author
  beside the title instead of on the line under it, level with the composer (songs 9 and 10): the house style places
  the credits, never a file.
- **A hold missing after a held word.** In song 10, bars 20, 28 and 44, "vor" is held over two notes; written without
  its `_`, every later syllable fell one note early ("ța" held over "mea"). Count the syllables of each line against
  its notes before building.
- **A part with no words at all.** A voice that never rests (song 11's altos) was one run from the first bar to the
  last, and when no voice fitted the whole run the part was left bare; the run is now tried bar by bar, then note by
  note. The parts check missed it: count each part's words against the score's (a part with none is a failure).
- **The words' author missing.** A credit added for a file that lacked one was written as a "lyricist" text, which
  MuseScore 4 drops: it is the "poet" style (song 11).
- **A dashed tie's syllable missing in a part.** Where one verse holds over a tie and another sings on (song 11, bar
  20: "în-chi-na"), the part's tied note takes the verse's syllable from the voice it moves with.
- **A pitch read a step off a slanted page.** Labels drawn from staff lines measured at the page's middle drift by a
  step at the line's ends when the scan tilts (song 17: bars 53-55, 80-83). Read each head against the staff lines
  drawn in the crop itself, check it with `heads` (which measures each staff), and check the chord it makes.
- **Words under the wrong voice where the sheet changes who leads.** Song 17 prints its first lines under the altos
  (the sopranos' pickup "Îmi ri-dic" above), and its solos (bars 64-79) with the soloist's words above and the
  accompaniment's below: the words go under the voice whose rhythm they fit, and a second voice's words above the
  staff (`[Soprano above]`) so they never collide.
- **A voice drafted, not read.** Song 19's basses (in no file) were read from the sheet to bar 97 and drafted from
  the harmony after: bars 102-121 came out a third off, and bars 122-141, where the men double the women an octave
  below, an octave low. Every bar of a voice is read from the sheet (`heads`, a gridded crop), never drafted.
- **A key change read with the old key's flats.** Song 19 changes to C at bar 90; the files kept E♭ and B♭ there
  (bars 90-95). After a `key-change:` each pitch is read against the new key.
- **Hummed bars beamed.** Song 19's opening (bars 1-8, the choir humming on A) has no words, so the builder beamed it
  as an instrumental bar; the sheet flags each note as sung. `flagged:` names such bars.
- **A bar broken across two lines left whole.** Where the sheet breaks a bar over a line's end (song 19: bars 17-18,
  48-49, 57-58, 80-81) each half is a printed bar, and each gets its `bar-length:`, as does a short last bar (141).
- **A part's held tie given another voice's syllable.** Where a part holds a tied note of its own and another voice
  sings a new syllable there (song 17, bars 64-78: the soloist holds while the others sing on; song 19, bars 20-26),
  the part took that syllable onto its tie. A tie after a part's own syllable now holds it; only a tie in a run the
  part borrows (song 11's dashed tie) takes the voice's verse-on syllable. The same fault doubled a bass's own word on
  its tie (song 20, bars 10 and 12: "Steag Steag").
- **Fermatas in a row dropped.** Fermatas on consecutive eighths (song 20, bar 18: "Dum-ne-zeu") were taken for the
  file's own after the first, and only one was drawn; a chord's own fermata is now looked for only among its own
  marks.
- **A melisma's eighths flagged.** Song 20 beams the eighths sung to one syllable (bars 4 and 8) and flags the rest;
  `beamed:` names those bars.
- **A part's words printed in the score.** Words given to a second voice that moves with the first (song 20's altos,
  bar 9) print twice in the score; the parts take them from the voice they move with, so no block is written.
- **A finished song restyled instead of rebuilt.** Built in the same turn as its old files were removed (song 21),
  the builder found no sources and only restyled the earlier made file, which kept its old slurs and part ids. A song
  whose score comes from files is rebuilt from history after the removal is committed, and that build is compared
  again.
- **A part's own staff-mate's words passed over.** Where no voice moves with a part's whole run, the voice with the
  most words in it was taken, though the part's staff-mate sang its own words in the run's last bar (song 22, bar 9:
  the tenors took the sopranos' held "La" and lost the basses' "Lui,"; song 1, bar 16: the altos took the basses'
  echo "dat." and the tenors the sopranos'). Such a run is now matched bar by bar.
- **An unnumbered pickup in a song written from its sheet.** Song 23's sheet numbers its first full bar 1; the
  template could only count the pickup as bar 1. A pickup is now written as bar 0 (`@0`, `systems: 0 …`).
- **Holds written over tied notes.** A tied note takes no syllable, so a `_` after a syllable that runs on a tie
  shifts every later word (song 23, bars 3, 20, 24). Hold only over notes that are struck again.
- **Shared words in the middle verse.** Song 23 prints "Lu-mi-naţi!" in bars 6-8 only on verse 2's line; written
  under verse 1 it moved to the wrong line. The words stand on the line the sheet prints them on.
- **A voice's corrected bars written before the bar's start.** Entering notes in place of a voice that a file wrote
  second in its bar left the file's backup and added another, so the notes stood before the bar (song 28, bars
  14-15, the basses lost; song 11's altos' bar 7 in their part). The entry now backs up from where the bar's last
  element leaves off.
- **A voice's corrected bars an octave off.** Notes entered into a file that writes a voice an octave up were moved
  down with the rest of the voice (song 28's basses). The entry now writes them where that move brings them to the
  pitch they sound.
- **Four one-voice files read as one voice.** A song whose files are one per voice and whose sheet corrects a few
  bars of one voice started from a single file (song 28); the files are assembled first when they hold every voice.
- **A file of another arrangement.** Song 30's full file is not the sheet's setting (other notes, another bar count);
  only the altos' file matches. Check each file against the sheet before building from it; when the full file
  differs, every voice is written in from the sheet.
