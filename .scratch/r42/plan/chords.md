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
  words (Staff · Inversions · Fingering · Tones) as on a laptop; the bar's buttons carry a caption under the icon:
  the chord's symbol over **Chord**, **Block** or **Arpeggio**, **Hands**, **Keyboard**. The icons are redrawn as
  what they show: a block chord is three notes stacked on one stem, an arpeggio three notes rising, the keyboard
  white keys with three black keys. ‹ › and Play stay icons alone, as on every player. A long chord symbol shrinks
  rather than being cut off (C♯m(maj7)).

## Fixed on the way

The kit's sheet function had taken the name of the sheet colour, so every card on the R41 pages was drawn with no
background since v14. The function is now `BSHEET`; the cards are the sheet colour again on every page.

## History

- 2026-11-08: drawn (v16). Replaces the calm Chords page (big symbol, keys card, Change chord bar).
- 2026-11-08: duplicates removed (v17).
- 2026-11-08: words on the views, captions on the bar, clearer icons (v18).
