# R42 · Chords in the Player's shape

Canvas: The ideal Piano Trainer, v16 (https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), boards Chords and
ChordsLaptop. Generator: `.scratch/r39/canvas/r42_chords.py` (run by `r41.py`, last).

## The rulings as they stand

- "now refactor the chords page from practice in the style of the songs player" (2026-11-08): the Chords page takes
  the Player's shape, as drawn in R37 and merged in v15:
  - **At the top**, three glass controls: Back (to Practice) · the views · the gear (Chord settings). The views are
    **Staff · Inversions · Fingering · Tones**, words on both sizes (v18). Staff's one setting is in the gear (v17).
  - **The keys run edge to edge** under them, where the Player's keys are, the chord coloured by its role (root,
    3rd, 5th, 7th, tensions) and named on its keys; no finger numbers on the keys.
  - **The chord is the title**, as the song is: the symbol in serif, its full name, its inversion and voicing, its
    notes as coloured chips. The chosen view's content sits under it.
  - **One floating bar at the foot**, the Player's transport: **Chord ▴** (where the Player has Wait) opens the Chord
    sheet; **Play the chord** (where Loop is): Block chord, Arpeggio up or Arpeggio up and down (v17); **‹ Play ›** walk the inversions; **Hands**
    (each hand's switch, as the Player's Hands menu); **Keyboard** (Keys Chord · 61 · 88, Note names, Connect a
    piano ›, All piano settings ›).
  - **The Chord sheet**, like the Player's Practice sheet: Root (the root grid), Chord › and Voicing › (each opens its
    list with Back, as Flat's choices do; a voicing the chord can't take stays, faded, with why), no Inversion (v17).
  - **The gear** is the Player's drawer: its head holds the chord with Share link and ··· (Add to a progression, Open
    in the Chord player, Open in the Chord finder), then **Practise in the Player** across the row (Arpeggio,
    Inversions, Chromatic walk), then Staff (v17).
  - Every chord sounds when it changes and on Play; Arpeggio plays it broken.
  - On a laptop the whole screen is the page, as the Player's, with no sidebar; the sheets are popovers above the bar
    or under the gear.
- Kept from R39-5: every chord type by group (Triads, Added notes with add2 and add9, Sevenths, Extended), voicings
  with their formulas, Fingering by hand, tensions added by a tap, avoid notes struck through, the root grid.

- **One home for each setting** (owner, 2026-11-08: "we have now duplicate settings. research more and refactor").
  The audit of v16 found four: Inversion in three places (the Chord sheet, ‹ › on the bar, the Inversions view);
  Arpeggio split in two (on and off on the bar, its direction in the gear); All piano settings in the gear and in
  Keyboard; Play the chord when it changes in the gear, though the piano's page is its home. Now (v17):
  - **Inversion:** ‹ › on the bar, as the Player's ‹ › step through the bars; the Inversions view shows them all,
    and a tap on one goes to it, as a tap on a chord in the Player's score does. The Chord sheet no longer has it.
  - **Play the chord** is one choice behind the bar's second button: Block chord · Arpeggio up · Arpeggio up and
    down, as cards (the Player's Wait · Play tiles), the button naming the choice. The gear no longer has Arpeggio.
  - **The piano's settings** are only behind Keyboard (Keys, Note names, Connect a piano ›, All piano settings ›).
    Play the chord when it changes stays on the piano's page, its one home.
  - **The gear** holds the chord at its head (Share link, ··· with Add to a progression, Open in the Chord player,
    Open in the Chord finder), Practise in the Player, and the one setting left for the page: Staff, Grand staff ·
    Treble only (it was behind a second tap on the Staff view, which nothing told the learner).
  - Each home, in one table:

    | Choice | Its one home |
    | ------ | ------------ |
    | Root, Chord, Voicing | the bar's Chord ▴ |
    | Block or arpeggio | the bar's second button |
    | Inversion | ‹ › on the bar (the Inversions view shows them) |
    | Hands | the bar's Hands |
    | Keys, Note names, the piano | the bar's Keyboard |
    | Staff | the gear |
    | Tensions | the Tones view |

  - Research: the Player's own rulings (one gear, the transport's buttons each opening their own sheet, the
    piano's settings behind Keyboard, view by view); Piano Companion keeps only display choices (staff and keyboard
    size) in its Settings and the chord's own choices on the chord page (App Store listing); CLAUDE.md, "each
    preference has one home; elsewhere a link row to it, never a second control".

- **Every control says what it is** (owner, 2026-11-08: "not all icons are very clear"). On a phone the views are
  words (Staff · Inversions · Fingering · Tensions, R42 v19) as on a laptop; the bar's buttons carry a caption under the icon:
  the chord's symbol over **Chord**, **Block** or **Arpeggio**, **Hands**, **Keyboard**. The icons are redrawn as
  what they show: a block chord is three notes stacked on one stem, an arpeggio three notes rising, the keyboard
  white keys with three black keys. ‹ › and Play stay icons alone, as on every player. A long chord symbol shrinks
  rather than being cut off (C♯m(maj7)).

- **Corners nest, and the chosen view stands out** (owner, 2026-11-08: "the inner corners doesn't match the
  roundness of the outer corners, and the toolbars names at the top aren't also very clear"). Every inner shape takes
  the outer radius less the inset: the bar is 68 tall with radius 34, so its buttons (56 tall, 6 in) are full pills
  at 28; on a laptop the 48 buttons are pills at 24; an inversion card's piano (12 in from a 16 corner) is 4. The
  views are named for what they show, Staff · Inversions · Fingering · Tensions (Tones read as a sound); the chosen
  one is ink with white text, the others ink on the sheet, so which view is on is seen at a glance.

- **Apple's toolbar and segmented control** (owner, 2026-11-08: "apple guidelines provide more guides to toolbars
  and to corners and their radius and buttons inside the toolbar … names are still not very clear or should they be
  icons instead"). Read: HIG Toolbars, Segmented controls, Buttons, Tab bars, SF Symbols
  (developer.apple.com/design/human-interface-guidelines). Taken, in its words:
  - "Prefer simple, recognizable symbols for items instead of text", "without borders"; "aim for a maximum of three"
    groups; "Only specify one primary action"; "Keep actions with text labels separate"; standard items "have corner
    radii that are concentric with bar corners"; a 44 by 44 hit region; capsules in a row.
  - Segmented: "all segments are usually equal in width", "either text or images — not a mix", "nouns", "no more than
    about five segments on iPhone"; it switches "closely related subviews".
  - So the phone's bar is three capsules (each 56, radius 28; items 44, radius 22, 6 in): the chord's name (text, as
    no symbol says Cmaj7) · ‹ Play › with Play the one tinted action · Play as, Hands, Keyboard as symbols only. Hands
    draws which hands (two, a right, a left) instead of a badge, which Apple keeps for critical news. A laptop shows
    the same three groups with each symbol's name beside it (macOS's Icon and Text). Captions under icons go.
  - The views stay words (no symbol says Inversions or Tensions), as an equal-width segmented control on a track,
    right above what it switches, under the keys; the top bar is Back, the title **Chords**, the gear.

- **Every control says, in words, what it is set to** (owner, 2026-11-08: "research more and refactor. make more
  clear"). Replaces the symbols-only phone bar of v20.
  - Research: NN/g's icon-usability study (Aurora Harley): "text labels are necessary to communicate the meaning and
    reduce ambiguity"; only home, print and search are read the same by everyone. Apple's tab bar: "Supply a symbol
    and a text label for each tab". Material 3's floating toolbar: actions icon-only or icon and label, stadium
    corners, 8 inside. Piano Companion plays a chord as a loop or an arpeggio, a choice beside the chord.
  - The phone's bar: the chord's name over **Chord ⌃**; Play alone, the one filled action; one capsule of three, each
    a symbol over its current value: **Block** or **Arpeggio**, **Both hands**, **Right hand** or **Left hand**,
    **Keyboard**. A laptop puts the value beside the symbol (Block chord, Both hands, Keyboard).
  - ‹ › leave the transport, where they read as previous and next song, and become the chord's own stepper under its
    name, in words: **‹ Root position ›**, then the voicing (Close voicing). The chord is now read top to bottom:
    name, full name, inversion, voicing, notes.
  - Corners: groups 68 tall (radius 34), items 56 inside 6 (radius 28), the stepper 44 (radius 22) with 40-tall
    arrows 2 in (radius 20).

- **The inversion is in the chord's name; the bar is grouped by what it changes** (owner, 2026-11-08: "can you embed
  the inversions in the big chord name … how each element of the toolbar relates to each other is unclear: like the
  block chords or arpeggios change the player but they are in separate groups … research more on laws of proximity
  and other laws of ux ui"). Replaces v21's stepper under the name and its bar.
  - Research (lawsofux.com, after NN/g's Gestalt articles): Proximity, "objects that are near … tend to be grouped
    together … perceived to share similar functionality"; Common Region, "elements … sharing an area with a clearly
    defined boundary" read as a group; Similarity, alike things read as related; Uniform Connectedness, "group
    functions of a similar nature so they are visually connected"; Fitts, big, well-spaced targets; Jakob, the
    musician's slash chord, read everywhere else.
  - The name carries the inversion as a slash chord, the bass after the slash in deep honey: **‹ Cmaj7/E ›**, the
    arrows either side of the name, 44 circles. Under it, in words: "1st inversion, E in the bass · Close voicing".
    Root position has no slash. A long name shrinks rather than wraps (Cmaj9/E, C♯m(maj7)/G♯).
  - The bar is three capsules, each one subject, its items alike inside it: **the chord** (the chord's name ⌃, the
    hands that play it) · **its sound** (Play, and how it plays: Block or Arpeggio, right beside it) · **the
    keyboard**. Play leaves its lone spot and sits with the choice that changes what it plays.

## Fixed on the way

The kit's sheet function had taken the name of the sheet colour, so every card on the R41 pages was drawn with no
background since v14. The function is now `BSHEET`; the cards are the sheet colour again on every page.

## History

- 2026-11-08: drawn (v16). Replaces the calm Chords page (big symbol, keys card, Change chord bar).
- 2026-11-08: duplicates removed (v17).
- 2026-11-08: words on the views, captions on the bar, clearer icons (v18).
- 2026-11-08: concentric corners, Tensions, the chosen view in ink (v19).
- 2026-11-08: Apple's toolbar groups and segmented control (v20).
- 2026-11-08: every control in words, the inversion stepper under the name (v21).
- 2026-11-08: the inversion in the name as a slash chord; the bar grouped by subject (v22).
