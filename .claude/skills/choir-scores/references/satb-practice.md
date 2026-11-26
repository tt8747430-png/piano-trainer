# SATB practice: how the voices are set

What the choir's sheets do and what engraving practice asks (Gould, *Behind Bars*, the vocal chapter; MuseScore's
handbook on parts and voices), as the builder applies it. A song's own sheet decides where it differs.

## The score: a closed score on two staves

- **Mixed choir (SATB):** Soprano and Alto on a treble staff, Tenor and Bass on a bass staff; the upper voice of
  each pair is voice 1 (stems up), the lower voice 2 (stems down). **Men's choir (TTBB):** Tenor 1 and Tenor 2 on a
  treble staff with the 8 below (sounding an octave lower), Baritone and Bass on a bass staff. The staves are
  bracketed; each staff has its own barlines (they do not cross the gap, so the words between stay clear).
- **Unison:** where both voices of a staff sing one note, the sheet prints one notehead (sometimes with two stems).
  The lower voice is not written again: in `match.txt` it is `u:` (hidden in the score, the note in its part).
- **One rest** where both voices of a staff rest together (`mergeMatchingRests`).
- **Pitches as they sound:** every voice is written at its sounding pitch; the builder puts tenors written an octave
  high (many of the choir's files) where they sound, and gives a men's treble staff its 8.
- **Each sung eighth on its own flag** (a triplet keeps its beam), as the choir's sheets print a sung line; beams only
  where the sheet beams (`beams`).

## The words

- **Printed once:** between the staves for the voices that share them, under the lower staff (often in italics)
  for the men's own words. In the score they are written under the voice whose rhythm they fit; never under a voice
  whose notes they do not match.
- **Syllables:** one per sung note; `--` joins a word's syllables (a hyphen), a syllable held over several notes
  draws an extender line to the last note it holds and its notes are slurred; a note that continues a tie takes no
  syllable. No hyphen before a syllable that starts a line.
- **Verses** stacked, numbered at the first syllable ("1.", "2.", "3."); a verse sung where another holds puts its
  syllable on the tied note (`^`), and that tie or slur is dashed where the sheet dashes it.
- **Echo** (the men or the altos repeating after the sopranos, song 1 bars 13–15, song 5 bars 13–18): the echoing
  voices sing their own words in their own rhythm, printed in italics under their staff (`[Bass italic]`), while the
  other voices of the staff may sing with the sopranos.

## The parts (one per voice)

- A part is the score's voice on its own staff, in its own clef: its notes as the score has them (in unison bars the
  shared note), its words (its own, or bar by bar those of the voice it moves with; a word whole from one voice), its
  slurs (its own, and over every syllable it holds), the score's dynamics, hairpins, texts and fermatas, the score's
  title frame with the part's name at the top left, and the score's lines and pages.
- In MuseScore a part must open with **one instrument** showing **only its voice**: it carries its score
  instrument's id, its staff linked to the score's staff, and its voice map as MuseScore reads it (see
  `MATCHING.md`). Check by letting MuseScore open and save the file.

## The page (the house template, `template/house.mss`)

- A4, 15 mm margins, a 6 mm staff (spatium 1.5 mm), words in Arial 11 pt, title 20 pt with the song's number in
  bold, composer at the right and words' author at the left in 10 pt, a bar number at each line's start, the systems
  spread down the page. The sheet's line and page breaks are kept (`systems:`); a song whose sheet cannot keep its
  pages at the house size gets a smaller `spatium:` in `match.txt`, never a smaller word size first.
- No voice names before the staves and no printed tempo unless the sheet prints them (`show-names`, `show-tempo`);
  common time as `C` where the sheet prints it (`time: C`).
- Every instrument plays piano.
