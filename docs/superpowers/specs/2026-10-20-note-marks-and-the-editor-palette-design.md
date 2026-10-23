# Note marks and the editor's palette — design

The owner asked for the editor to write what a notation app writes: articulations, ornaments, octave lines, slurs,
dynamics and hairpins, grace notes, 32nds and double dots, with ties made by joining notes; each drawn on the staff,
saved, and heard where it changes the sound. And on a phone on its side, the score fills the screen with the palette
a card floating over it.

## The notation: marks after a token

A written hand's token takes an optional list of marks in brackets after its beats and `@beat`:

```
C4+E4+G4/1[acc,stacc]   E5/.5@2[tr]   G4/2[8va,(]   A4/1[)]   C3/4[p,cresc]   F3/1[/hairpin]   D5/1[gr:E5]
```

The marks belong to every note of the token (a chord's notes share them). Words, so a song file reads as music:

| Kind         | Words                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| Articulation | `stacc` · `staccatiss` · `acc` · `ten` · `marc` · `ferm` (several may join) |
| Ornament     | `tr` (trill) · `mord` (upper mordent) · `lmord` (lower) · `turn` · `trem` (tremolo) |
| Rolled chord | `arp`                                                                     |
| Slur         | `(` starts one on this note · `)` ends it                                 |
| Octave line  | `8va` written an octave lower than it sounds · `8vb` an octave higher     |
| Dynamic      | `pp` `p` `mp` `mf` `f` `ff`, from this note on                            |
| Hairpin      | `cresc` or `dim` starts one · `/hairpin` ends it                          |
| Grace notes  | `gr:D5` or `gr:D5+E5`: struck just before the note, taking none of its time |

A note's pitch is always the pitch it sounds: `8va` only changes where it is written.

**Values.** A 32nd is `/.125`; double dots are written as their beats (`/1.75`). The editor writes 32nds and double
dots where they fall on whole ticks (24 to a beat, ADR 0060).

**Ties** are not a mark: two notes of one key joined are one longer note, which the staff ties where its value needs
two. The editor's Tie joins the note at the caret with the next of the same key.

## Where each goes

- **Model** (`entities/piece`): `HandNote` (and the editor's `DraftNote`) carry `marks?: NoteMarks`; `parseHands`
  reads them, `writeHand` writes them in a fixed order, so a song round-trips.
- **Arrangement**: a written note's marks ride onto its `PerformanceNote`.
- **Notation**: `TimedNote` carries them; `notate` puts a note's articulations, ornaments, dynamic and slur start on
  its first written piece and its slur end on its last, and writes an `8va` note an octave lower.
- **Engraving** (`shared/ui/score`): VexFlow's `Articulation`, `Ornament`, `Tremolo`, `Stroke` (rolled), `GraceNoteGroup`,
  `Curve` (slurs, across measures of one line), `TextBracket` (8va / 8vb over the notes it holds), `TextDynamics` and
  `StaveHairpin`.
- **Playback** (`shared/lib/schedule`): staccato half its length, staccatissimo a quarter, tenuto all of it; an
  accent louder, marcato louder and a little shorter; a fermata holds its note half as long again (the beat does not
  wait); dynamics set a hand's loudness until the next, a hairpin moves it evenly to the next dynamic; a rolled chord
  strikes low to high 30 ms apart; grace notes sound 60 ms apart just before the beat; a trill alternates with the
  key's next note up in 32nds, a mordent and a turn play their notes in 32nds at the start.
- **Editor**: the palette gains tabs for Articulations, Ornaments, Lines (slur, octave lines, hairpins, Tie) and
  Dynamics; Notes gains the 32nd and the double dot. Each key toggles its mark on the notes at the caret.

## The palette on a phone on its side

The score takes the whole screen under one thin bar. The palette is a card floating over the score at one side (it
moves to the other with a tap), closing into one ♪ button; the keys start folded. Upright and on a laptop it stays as
ADR 0061 has it.

## Not now

Pedal marks, repeats and voltas, tempo and expression text, lyrics, tablature, cross-staff beaming, more than two
voices a staff.
