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
4. Fix, rebuild, and look again at every system changed, until a full pass finds nothing.
5. Only then remove the song's old MuseScore files, commit, and go on to the next song.

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
