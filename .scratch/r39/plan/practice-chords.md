# R39-5 · Chords, redesigned

Premium here means standing beside Piano Companion's and musicca's chord pages: the chord readable at a glance (name,
spelling, staff, keys), every choice one tap away in a picker with its whole list, and the chord sounding the moment it
changes.

## The rulings as they stand

- "every chord type, fingering by hand and inversion, voicings to choose. Add, add2, add9 named as chords are": the
  Chord picker lists Triads, Added notes (add2, add9, madd9, 6, m6), Sevenths and Extended (9 to 13), each by its symbol
  on the root chosen and its full name; Voicing is a picker of its own; Fingering is a table by hand.
- "Every Practice page has its own Settings page": the gear opens Chord settings (a page on a phone, a popover on a
  laptop) with Arpeggio (Up · Up and down), Staff (Grand staff · Treble only) and the piano's two rows as link rows to
  their home (Play the chord when it changes, All piano settings).
- "No finger numbers on or under keys": the keys show only the chord's colours (right hand honey, left hand violet)
  and C4; the fingers are in the Fingering table, each over its note.
- "A key or root is one of shared/ui/pickers": Root opens the root grid; "No strip hides options": no chip strips.
- "Every control says what it belongs to": every control has a label above it (Root, Chord, Voicing, Inversion,
  Hands).
- "No setting disables or hides another": a voicing the chord cannot take stays in the list, faded, saying why
  ("Needs a 7th", "Needs a chord of 4 notes", "Suits a minor or suspended chord"); nothing else changes.

## Today

`src/pages/chords/ui/ChordsPage.tsx` → `widgets/chord-explorer` (`ChordHead`, `ChordBuilder`, `VoicingField`,
`TopNote`, `ChordSheet`, `ChordFingering`, `ColourNotes`, `ChordPractice`), strings in `practice.ts` `chords.*`.
Root, Chord and Voicing as selects with ⓘ, a size strip (Triad … 13th), Inversion and Hands, a fingering table, colour
notes, "In the Player" rows, Play and Arpeggio floating over the content, finger numbers on the keys
(`drawings/today-chords-*.png`). There is no Chords settings page.

## Will build (canvas row 2)

Phone, one scroll between the bar and the keys:

1. Bar: Back (to Practice), "Chords", the gear (Chord settings).
2. The chord card: the symbol in serif, its full name (with any tensions added), the inversion and voicing, "Also
   written …", the notes spelled; the grand staff beside it.
3. Root (root grid sheet) · Chord (sheet grouped Triads, Added notes, Sevenths, Extended).
4. Voicing (sheet: Close, Drop 2, Drop 3, Shell, Rootless A, Rootless B, Locked hands, So What, each with its one-line
   formula; those the chord cannot take faded with the reason).
5. Inversion: Root · 1st · 2nd (· 3rd for four notes), each with its stack of dots, the bass dot honey.
6. Hands: Right · Left · Both (Both adds the root and 5th in the left hand to a close chord).
7. Fingering: one row per hand, each finger over its note.
8. Colour notes ⓘ: Chord tones; Tensions (tap to add, again to take off); Avoid (struck through).
9. Practise this chord: Arpeggio, Inversions, Chromatic walk, each opening the Player.
10. Play (Stop while sounding) and Arpeggio in a bar of their own above the keys, covering nothing; the keys at the
    foot.

The size strip goes: the Chord picker holds every size by name. Laptop: three columns (what you build | the chord with
Play and Arpeggio | Colour notes and Practise this chord), the keys across the foot.

## History

- 2026-11-08: drawn (canvas v3); waiting for the owner.

Sources: Piano Companion's chord page (symbol, notes, staff, keys, inversions); musicca's chord pages (root and chord
pickers, the chord on staff and keys); Mark Levine, *The Jazz Piano Book* (rootless A and B, So What, locked hands).
