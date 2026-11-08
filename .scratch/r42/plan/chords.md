# R42 · Chords in the Player's shape

Canvas: The ideal Piano Trainer, v16 (https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), boards Chords and
ChordsLaptop. Generator: `.scratch/r39/canvas/r42_chords.py` (run by `r41.py`, last).

## The rulings as they stand

- "now refactor the chords page from practice in the style of the songs player" (2026-11-08): the Chords page takes
  the Player's shape, as drawn in R37 and merged in v15:
  - **At the top**, three glass controls: Back (to Practice) · the views · the gear (Chord settings). The views are
    **Staff · Inversions · Fingering · Tones**, icons on a phone and words on a laptop, as the Player's are. Tapping
    Staff again opens its settings (Grand staff · Treble only), as a view's settings open in the Player.
  - **The keys run edge to edge** under them, where the Player's keys are, the chord coloured by its role (root,
    3rd, 5th, 7th, tensions) and named on its keys; no finger numbers on the keys.
  - **The chord is the title**, as the song is: the symbol in serif, its full name, its inversion and voicing, its
    notes as coloured chips. The chosen view's content sits under it.
  - **One floating bar at the foot**, the Player's transport: **Chord ▴** (where the Player has Wait) opens the Chord
    sheet; **Arpeggio** (where Loop is) is pressed on to play it broken; **‹ Play ›** walk the inversions; **Hands**
    (each hand's switch, as the Player's Hands menu); **Keyboard** (Keys Chord · 61 · 88, Note names, Connect a
    piano ›, All piano settings ›).
  - **The Chord sheet**, like the Player's Practice sheet: Root (the root grid), Chord › and Voicing › (each opens its
    list with Back, as Flat's choices do; a voicing the chord can't take stays, faded, with why), Inversion
    (Root · 1st · 2nd · 3rd).
  - **The gear** is the Player's drawer: its head holds the chord with Share link and ··· (Add to a progression, Open
    in the Chord player, Open in the Chord finder), then **Practise in the Player** across the row (Arpeggio,
    Inversions, Chromatic walk), then the settings: Arpeggio Up · Up and down, Play the chord when it changes, All
    piano settings ›.
  - Every chord sounds when it changes and on Play; Arpeggio plays it broken.
  - On a laptop the whole screen is the page, as the Player's, with no sidebar; the sheets are popovers above the bar
    or under the gear.
- Kept from R39-5: every chord type by group (Triads, Added notes with add2 and add9, Sevenths, Extended), voicings
  with their formulas, Fingering by hand, tensions added by a tap, avoid notes struck through, the root grid.

## Fixed on the way

The kit's sheet function had taken the name of the sheet colour, so every card on the R41 pages was drawn with no
background since v14. The function is now `BSHEET`; the cards are the sheet colour again on every page.

## History

- 2026-11-08: drawn (v16). Replaces the calm Chords page (big symbol, keys card, Change chord bar).
