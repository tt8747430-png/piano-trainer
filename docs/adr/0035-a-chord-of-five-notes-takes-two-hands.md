# ADR 0035 — A chord of five notes takes two hands, and its right hand starts from the 3rd or the 7th

- **Status:** accepted · **Date:** 2026-10-09 · **Amends:** ADR 0014 (how the explorers place a chord), ADR 0032 (a
  row's hands) · **Builds on:** ADR 0023 (the Player's 3-5-7-9 and 7-9-3-5) · **Research:**
  `.scratch/chord-hands/research.md`

## Context

The Chords explorer stacked every tone of a chord in the right hand from its root and, for Both hands, added only the
root an octave below. A C9 was five keys in one hand over a doubled root; a Cm13 seven keys a 13th wide, which no hand
plays, and its "1st inversion" put the 9th a second above the root. A row (`voiceLead`, ADR 0032) already left a big
chord's root to the bass but stacked the rest, so a 13th's hand was an 11th wide. The owner asked for the correct
choice to be researched rather than left.

The sources agree on the parts (the research file quotes each): a stack of thirds is a spelling, not something to
play, and the root goes in the left hand (Open Music Theory, "Jazz Voicings"); the 5th is the tone that leaves the
hand first (OMT; Dubovsky et al., _Учебник гармонии_; Berklee: "9 for 1, and 13 for 5"); from a 9th up a chord stays
in root position, and what turns over is the hand above the bass, from the 3rd or from the 7th (jazz's A and B; the
owner's course, «Нонаккорды»: 3-5-7-9 and 7-9-3-5, which the ii–V–I lesson and the Player already teach). No source
names an inversion of an 11th or a 13th.

## Decision

- **From five notes a chord takes two hands** (`TWO_HANDS_FROM`, `placeChord` with `bothHands`). The left hand has the
  root and, from six notes, the perfect 5th over it; the right hand has the rest, held close inside an octave
  (`closeFrom`). C9 is C3 · E4 G4 B♭4 D5; Cm11 is C3 G3 · E♭4 F4 B♭4 D5; C13 is C3 G3 · E4 A4 B♭4 D5.
- **Every tone stays on the keys**: the page shows what a chord is made of, so nothing is left out as a player would.
  Where the right hand would still hold more than five keys (twelve altered dominants), the left hand takes the 7th
  too, its shell, then an altered 5th. A test holds every chord the builder makes to it: each tone once, five keys and
  a major 7th at most in the right hand, the hands not crossed.
- **Its root stays in the bass, so it is not inverted.** `chordInversions(tones)` gives a chord of five notes or more
  root position (the right hand from its lowest tone, the 3rd) and, where that hand has a 7th or a 6th, the 3rd
  inversion's number for the hand turned to start from it, an octave down (`?inversion=3`: 7-9-3-5). The 1st and 2nd
  are not offered; `fitChordInversion` takes the nearest a chord has under the one asked, so a 7th chord in its 3rd
  inversion grown to a 9th keeps its hand from the 7th.
- **The Chords explorer says so.** From five notes Hands shows Both hands and cannot be changed (the `hands` param
  stays the learner's choice for the chords one hand holds); in the Inversion field's place is **Right hand from**
  («Правая рука от»), each start named as the keys name it, its degree and its note (`3 E`, `♭7 B♭`), shown only where
  there are two.
- **One hand still spells a chord.** `placeChord` with one hand is the whole stack in an inversion, as before: the
  trainers, a lesson's and a piece's chords, Reharmonise and the tensions panel ask for a chord spelled out, not held.
- **A row holds its big chord close too.** `voiceLead` takes the hand from each of its tones held close (`closeFrom`)
  in place of the stack's inversions: the same for a triad, a 7th chord and a 9th chord's four notes, and a 13th's
  hand is its 3rd, 5th, 13th, 7th and 9th inside an octave. A row's bass stays one note.

## Consequences

- A link to a 9th chord in its 1st or 2nd inversion opens in root position; a remembered view is read the same way,
  with no store version.
- Scales' Chords view keeps its stacks and their inversions (`lastInversion`): there a degree's chord is the scale's
  notes in thirds, shown as a stack.
- The Player's voicings are unchanged (ADR 0023): four notes, the root and 5th left out.
- Not decided here, the owner's to say: whether a dominant 11th keeps its major 3rd under the 11th as the builder
  stacks it (players leave the 3rd out: C9sus4), and whether Scales' Chords view should hold its big chords in two
  hands as well.
