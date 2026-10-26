---
name: Piano Trainer
description: A labelled picture book of the piano, printed quietly. Warm paper, a soft 1px line round every card and control, seven paints faded to one even lightness, titles and chord symbols set in a book serif, and a printed label on every key, chord and control.
colors:
  paper: '#F7F3EE'
  paper-card: '#FEFDFB'
  sand-sunken: '#EEE9E2'
  sand-hairline: '#E5DFD6'
  soft-line: '#DAD1C8'
  control-line: '#908479'
  ink: '#332921'
  ink-soft: '#685E56'
  umber: '#4B4038'
  honey: '#EDC684'
  honey-night: '#D4B176'
  sky-mist: '#E0EFFA'
  sky-mist-ink: '#2A597F'
  sky-deep: '#356890'
  grass-deep: '#44684A'
  ochre: '#A8742A'
  crimson: '#A34243'
  white: '#FFFFFF'
  paint-brick: '#E19E8C'
  paint-yellow: '#E8C67D'
  paint-grass: '#9BC093'
  paint-sky: '#85B8DC'
  paint-lilac: '#B8A8D8'
  paint-sand: '#D3AC8A'
  paint-teal: '#82C2C1'
  wash-yellow: '#F7E8C4'
  wash-grass: '#D9EBD5'
  wash-sky: '#D1E6F7'
  wash-lilac: '#E6DFF6'
  wash-sand: '#F5E0CF'
  yellow-deep: '#7A5B22'
  lilac-deep: '#6A5988'
  sand-deep: '#7D5B40'
  key-bed: '#CBC2B9'
  key-rail: '#DFD8CF'
  key-black: '#332C28'
  dusk-ground: '#191512'
  dusk-card: '#24201C'
  dusk-sunken: '#2E2924'
  dusk-hairline: '#37322D'
  dusk-line: '#453E38'
  dusk-control: '#7D7368'
  dusk-ink: '#EDE9E1'
  dusk-muted: '#BBB3A8'
  dusk-key-white: '#D4D0CB'
  dusk-key-black: '#171310'
  dusk-key-bed: '#787069'
  dusk-key-rail: '#332C27'
  dusk-sand: '#3C3026'
  dusk-yellow: '#3E3420'
  dusk-grass: '#2B3728'
  dusk-sky: '#253541'
  dusk-lilac: '#352F40'
  sand-light: '#DBB697'
  yellow-light: '#E3C383'
  grass-light: '#8FC090'
  sky-light: '#89B7DE'
  lilac-light: '#BDAFD9'
  ochre-light: '#E0B26F'
  crimson-light: '#E18885'
  sky-night: '#1F303E'
  sky-night-ink: '#C2DBF1'
typography:
  chord-display:
    fontFamily: 'Literata Variable, Text Accidentals, Noto Music, Georgia, serif'
    fontSize: '72px'
    fontWeight: 600
    lineHeight: 1
  display:
    fontFamily: 'Literata Variable, Text Accidentals, Noto Music, Georgia, serif'
    fontSize: '44px'
    fontWeight: 600
    lineHeight: 1.1
  large-title:
    fontFamily: 'Literata Variable, Text Accidentals, Noto Music, Georgia, serif'
    fontSize: '34px'
    fontWeight: 600
    lineHeight: 1.15
  title-1:
    fontFamily: 'Literata Variable, Text Accidentals, Noto Music, Georgia, serif'
    fontSize: '28px'
    fontWeight: 600
    lineHeight: 1.2
  title-2:
    fontFamily: 'Literata Variable, Text Accidentals, Noto Music, Georgia, serif'
    fontSize: '22px'
    fontWeight: 600
    lineHeight: 1.3
  title-3:
    fontFamily: 'Literata Variable, Text Accidentals, Noto Music, Georgia, serif'
    fontSize: '20px'
    fontWeight: 600
    lineHeight: 1.25
  headline:
    fontFamily: 'Onest Variable, Text Accidentals, Noto Music, system-ui, sans-serif'
    fontSize: '17px'
    fontWeight: 600
    lineHeight: 1.375
  control:
    fontFamily: 'Onest Variable, Text Accidentals, Noto Music, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: 'Onest Variable, Text Accidentals, Noto Music, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Onest Variable, Text Accidentals, Noto Music, system-ui, sans-serif'
    fontSize: '14px'
    fontWeight: 500
    lineHeight: 1.43
  key-label:
    fontFamily: 'Onest Variable, Text Accidentals, Noto Music, system-ui, sans-serif'
    fontSize: '14px'
    fontWeight: 700
    lineHeight: 1.43
    fontFeature: 'tnum'
rounded:
  black-key: '6px'
  white-key: '9px'
  md: '10px'
  lg: '11px'
  button: '12px'
  control: '12px'
  card: '14px'
  sheet: '20px'
  pill: '9999px'
spacing:
  gutter: '16px'
  stack: '24px'
  section: '32px'
  column-gap: '40px'
  target: '44px'
components:
  button-primary:
    backgroundColor: '{colors.honey}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-primary-pill:
    backgroundColor: '{colors.honey}'
    textColor: '{colors.ink}'
    typography: '{typography.headline}'
    rounded: '{rounded.button}'
    height: '56px'
    padding: '0 24px'
  button-soft:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-secondary:
    backgroundColor: '{colors.sky-mist}'
    textColor: '{colors.sky-mist-ink}'
    typography: '{typography.control}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-destructive:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.crimson}'
    typography: '{typography.control}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-round:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    size: '44px'
  button-play:
    backgroundColor: '{colors.honey}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    size: '72px'
  popup-button:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    height: '44px'
    padding: '0 12px'
  popup-item-selected:
    textColor: '{colors.umber}'
    typography: '{typography.body}'
    height: '44px'
  row-link:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.headline}'
    height: '64px'
  segmented-track:
    backgroundColor: '{colors.sand-sunken}'
    rounded: '{rounded.button}'
    padding: '4px'
  segmented-selected:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.lg}'
    height: '44px'
  card:
    backgroundColor: '{colors.paper-card}'
    rounded: '{rounded.card}'
    padding: '20px'
  fact-card:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.card}'
    padding: '12px 8px'
  beat-cell:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    size: '56px'
  beat-cell-sounding:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    size: '56px'
  chord-chip:
    backgroundColor: '{colors.sand-sunken}'
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
  chord-chip-sounding:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.md}'
  step-tile:
    backgroundColor: '{colors.wash-sand}'
    textColor: '{colors.sand-deep}'
    rounded: '{rounded.button}'
    size: '48px'
  sheet:
    backgroundColor: '{colors.paper-card}'
    rounded: '{rounded.sheet}'
    padding: '12px 20px 24px'
  nav-item:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink-soft}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    height: '56px'
  nav-item-active:
    backgroundColor: '{colors.sand-sunken}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    height: '56px'
  key-white:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.key-label}'
    rounded: '{rounded.white-key}'
  key-black:
    backgroundColor: '{colors.key-black}'
    textColor: '{colors.white}'
    rounded: '{rounded.black-key}'
  key-rail:
    backgroundColor: '{colors.key-rail}'
    textColor: '{colors.ink}'
    height: '28px'
  key-down:
    backgroundColor: '{colors.paint-sky}'
    textColor: '{colors.ink}'
  key-scale:
    backgroundColor: '{colors.wash-sky}'
    textColor: '{colors.ink}'
  key-scale-down:
    backgroundColor: '{colors.paint-sky}'
    textColor: '{colors.ink}'
  key-tonic:
    backgroundColor: '{colors.wash-yellow}'
    textColor: '{colors.ink}'
  key-tonic-down:
    backgroundColor: '{colors.paint-yellow}'
    textColor: '{colors.ink}'
  circle-key:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink-soft}'
    rounded: '{rounded.pill}'
    size: '44px'
  circle-key-current:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    size: '44px'
---

# Design System: Piano Trainer

## Overview

**Creative North Star: "The Labelled Picture Book", printed quietly**

The app is drawn as a Busytown cross-section (ADR 0010): the keyboard and the chart are cut open, and every key,
chord and control wears its printed name. ADR 0011 reprinted the same book quietly: warm paper for the page and a
lighter paper for the cards on it, a soft 1px line round every card and control, and seven paints faded to one even
lightness (OKLCH L 0.76 to 0.84, chroma 0.065 to 0.10), so any two sit together and none shouts. Titles and chord
symbols are typeset in Literata, a book serif drawn for screens; everything read and every control is Onest. By night
the paper turns to dusk and the chrome's paints to dusk tints; the keys keep their paper, a shade softer.

Everything is still read from a phone propped on a piano's music stand, glanced at between chords with both hands on
the keys. The labelled keyboard is the hero: it is on every screen that sounds anything, it plays when tapped, and
every key the app sounds goes down on it (ADR 0009). Density is low and targets are 44px at least. Colour carries
meaning, and so is spent sparingly: honey is the one action, grass is learned, deep sky is a link and focus, ochre is
a gap, crimson is wrong; what is chosen or where you are is neutral, and the other paints name places and kinds of
step as pale washes.

The book lends its colour, line and labelling only. Not taken: characters, animals or mascots; a kicker label above a
heading; streaks as pressure, upsells, locked content, stock photos; the dark neon piano app and the sage wellness app.

**Key Characteristics:**

- Grouped surfaces: the page a shade darker than the cards, so a card parts by its surface and a 1px soft line.
- One honey action per screen, borderless, with the ink on it: the only control filled with a colour.
- What is chosen is neutral: an umber check in a pop-up, a card-paper segment on a muted track, a muted fill for the current place.
- Seven paints at one lightness, each with a pale wash; a key's mark is its wash at rest and its paint when down.
- Literata 600 for titles and chord symbols; Onest for reading and every control.
- One keyboard component everywhere, the whole piano hung from a light wooden rail.

## Colors

Warm paper and a warm ink, one honey action, a neutral for the chosen, and a set of paints at one lightness whose
colours mean something wherever they appear.

### Primary

- **Honey** (`honey`; night `honey-night`, a step lower so it never glares in a dim hall): the one action on a screen
  (Continue, Play, Practise, Check, Next, Apply), borderless, with the ink on it (`dusk-ground` by night). Also a field's text caret, the text selection (22%), a quiz's chosen
  keys and Name chord's lit keys.

### Secondary

- **Umber** (`umber` with card-paper text; night `dusk-muted` with `dusk-ground` text): what is chosen: the check on
  a pop-up's chosen item, a popover's and a Setup list's. Never an action and never a colour.
- **Sky Mist** (`sky-mist`, ink `sky-mist-ink`; night `sky-night`, ink `sky-night-ink`): the playing bar of a
  chart, a pressed chord of a scale, the secondary button. Sky on the chrome is one family, the accent: a link,
  focus, where you are.

### Tertiary: meaning colours

- **Deep Sky** (`sky-deep`; night `sky-light`): links, every focus ring, and what is chosen on a sheet (ADR
  0096): the chosen notes drawn in it, a range's and the loop's band in a 15% wash of it, the caret's and the
  playhead's thin lines and the loop's grips.
- **Grass Deep** (`grass-deep` with white; night `grass-light` with dusk ground): learned, known, on, connected.
- **Ochre** (`ochre`; night `ochre-light`): attention, the dot of a gap or a "to check" count; never text.
- **Crimson** (`crimson`; night `crimson-light`): wrong and destructive (a wrong key, Reset progress).

### The paint set

Seven paints at one lightness (`paint-brick`, `paint-yellow`, `paint-grass`, `paint-sky`, `paint-lilac`,
`paint-sand`, `paint-teal`), each with a pale wash; the chrome's five have a deep shade for the icon on them
(`yellow-deep`, `grass-deep`, `sky-deep`, `lilac-deep`, `sand-deep`). The paints stay the same by night. A chrome wash is a fixed tint
(`wash-*`, L about 0.92; dusk tints by night); a key's wash is mixed from its paint into the key's own paper (below).

- **On keys, as chord roles:** root brick, 3rd sky, 5th grass, 7th yellow, 9th lilac, 11th sand, 13th teal: on chord
  tones only (keys, the role legend, a chord's tone chips).
- **On keys, as the Player's hands:** right brick, left lilac, tune grass; the Player only.
- **On the chrome, as the book's paints:** sand, yellow, grass, sky and lilac name places and kinds of step, always as
  their wash with their deep shade on it for the icon (the on-colour): the step tiles (chords sand, scale sky, study
  grass, song yellow, progression lilac), a course's tile and a song's sections by their kind (an intro, outro or
  ending sand, a verse sky, a chorus grass, a bridge lilac, the rest yellow; its lessons wear it too). By
  night each wash is a dusk tint (`dusk-sand`, `dusk-yellow`, `dusk-grass`, `dusk-sky`, `dusk-lilac`) under its light
  shade (`sand-light`, `yellow-light`, `grass-light`, `sky-light`, `lilac-light`). Brick and teal are never on the
  chrome.

### The keys

- **Plain keys:** white keys are the card paper (`paper-card`; night `dusk-key-white`, softer so they never glare in a
  dim hall), black keys a warm black (`key-black`; night `dusk-key-black`), parted by a 1px line of key bed (`key-bed`;
  night `dusk-key-bed`) and hung from a light wooden rail (`key-rail` with ink icons; night `dusk-key-rail` with
  `dusk-ink` icons).
- **Marks:** a mark (a role, a hand, a scale's note) is its wash at rest and its full paint when its key is down,
  always with the ink on it. The wash is `color-mix(in oklab, <paint> var(--mark-wash), var(--key-white))`: 35% by day,
  50% by night (so a resting mark is a tint of the softer key, never brighter than it), 55% and 62% under increased
  contrast. A scale's notes are sky (wash at rest), its tonic yellow; scales are never role
  coloured.
- **Down:** a plain key down turns sky (`paint-sky`), white and black alike.
- **Other faces:** a quiz's chosen key and Name chord's lit key honey, a wrong key crimson, a missing key outlined in a
  3px deep-sky ring inside its edge.
- **Focus:** a two-tone ring, ink outside and white inside, so it shows on any key's colour.

### Neutral

- **Paper** (`paper`; night `dusk-ground`): the page, a shade darker than the cards.
- **Card Paper** (`paper-card`; night `dusk-card`): cards, sheets, popovers, pop-up buttons, the soft and round
  buttons, the nav, the chosen segment.
- **Sand** (`sand-sunken`; night `dusk-sunken`): hover and pressed fills, segment tracks, the current place in the nav,
  a settings group's header band, slider and switch tracks.
- **Ink** (`ink`; night `dusk-ink`): text. **Soft Ink** (`ink-soft`; night `dusk-muted`): secondary text, the nav's
  icons and labels, a level's pips.
- **Soft Line** (`soft-line`; night `dusk-line`): every card's 1px border, the nav's edge. **Control Line**
  (`control-line`; night `dusk-control`): every control's 1px border and a chart's barlines, at 3:1 against the card.
  **Hairline** (`sand-hairline`; night `dusk-hairline`): dividers between rows inside a card, an unfilled pip.

### Named Rules

**The Palette Law.** Role colours appear on chord tones only; hand colours only in the Player; the book's paints on
the chrome are washes that name a place or a kind of step, never a chord tone. Brick means only the root tone and the
right hand: one colour, one meaning.

**The Wash And Paint Rule.** A mark is its pale wash at rest and its full paint when its key sounds; a plain key down
turns sky. Every mark stays while keys go down, and its label stays on it: colour is never the only cue.

**The One Honey Rule.** Each screen has exactly one honey action, and it is the only control whose fill is a colour.
A second action beside it is card paper in the control line (soft), never a second colour.

**The Neutral Chosen Rule.** What is chosen or where you are is shown in neutrals, never in a paint: a pop-up button
shows its value in ink and checks it in umber in its list, a segment becomes a card-paper thumb in the control line on
a sand track, the current place in the nav fills with sand under a semibold ink label.

**The Increased Contrast Rule.** The quiet default has an answer for the OS's increased-contrast setting: under
`prefers-contrast: more` secondary text steps up to umber (night `dusk-ink`), the card line to the control line, the
control line to ink (night `dusk-muted`), the hairline to the soft line, the key bed to the control line and a
resting mark's wash to 55% of its paint (night 62%). Every calm value ships with its firm one.

## Typography

**Display Font:** Literata Variable (weight and optical-size axes, Latin and Cyrillic), self-hosted, with Text
Accidentals, Noto Music and Georgia behind it; its Greek and Vietnamese subsets stay out of the PWA precache.
**Body Font:** Onest Variable, self-hosted (with Text Accidentals and Noto Music's music subset behind it, then
system-ui).
**Text Accidentals:** neither face has ♭ ♮ ♯ 𝄪 𝄫, and Noto Music draws them for a staff (a sharp low, small and light
beside a letter), so both faces take them from Noto Music's signs set for text: raised to stand by the capitals, a
little larger, their thin stems thickened to weigh as the semibold letters (`scripts/text-accidentals.py`). Every
chord symbol is printed with them (`C♯m7`, `B♭`, `printedSymbol`), at every size it is set in either face.

**Character:** a sans and a serif made to work together, as a system face and its book face are. Literata sets what
names a screen or a chord, at weight 600, and its optical size fits its drawing to each size; Onest carries everything
read and every control. `h1` to `h3` are Literata 600 by default. The scale follows the text styles of a phone's
system, in rem, so it grows with the reader's own text size.

### Hierarchy

- **Chord Display** (Literata 600, 72px, 1): the chord in the Chords explorer and the Chord finder, a Check's score;
  a symbol longer than five characters (`Cm7(add11)`) a step down at 44px, so it stays on a phone's line
  (`ChordHeading`).
- **Display** (Literata 600, 44px, 1.1): each screen's title from 1024px, the scale's name.
- **Large Title** (Literata 600, 34px, 1.15): each screen's title on a phone.
- **Title 1** (Literata 600, 28px, 1.2): a large sheet's title.
- **Title 2** (Literata 600, 22px, 1.3): level and section headings, sheet titles, the sidebar's name, a lesson's
  chord example, a chart's chord from 640px.
- **Title 3** (Literata 600, 20px, 1.25): a settings group's title, a chart's chord on a phone.
- **Headline** (Onest 600, 17px, 1.375): step and piece rows, the pill button's label, Wait mode's line. At this size
  a heading element (a chart's section, the Player's piece title) and a chord symbol on the sheet stay Literata 600.
- **Control** (Onest 600, 16px): buttons, pop-up buttons' values (their labels Onest 400 in soft ink) and segments.
- **Body** (Onest 400, 16px, 1.5): everything else; notes at most 65ch.
- **Label** (Onest 400 to 600, 14px and 12px): row subtitles, bar numbers, method notes; the nav's labels are Onest
  500 at 14px on a phone and 16px in the sidebar, semibold where you are.
- **Key Label** (Onest 700, 14px for a mark, 12px for a note name, tabular): the degree, finger or note on a key.

### Named Rules

**The Two Faces Rule.** Literata names (titles, chord symbols); Onest reads and operates. A control, a tab or a label
on a key is never set in the serif, and a title is never set in the sans.

**The Real Weights Rule.** Both faces are variable and `font-synthesis-weight` is off: ask Literata for 600 and Onest
for what it carries, and never let the browser fake a bold.

**The Tabular Numbers Rule.** Tempo, bar numbers, counts, key labels and finger numbers are tabular, so a number
that changes in place never shifts its neighbours.

## Layout

Phone first, and every screen takes the width it is given (ADR 0029). A shell screen has a gutter that grows with
the width (16px on a phone, 24px from 640px, 40px beside the sidebar), clears the notch, and on a phone scrolls over a
bar docked along the bottom (112px of bottom padding). From 1024px the bar becomes a sidebar: 256px with the app's
name in Literata, the four places and Settings at its foot, or collapsed to 72px of icons by the button at its top
(saved; each place then named in a tooltip). No screen is capped: a list is a grid of row cards, as many columns of
at least 18rem as fit. The Player, the score editor and the Check are full screen with no navigation: the viewport's
height and width, scrolling inside when their content is taller.

**The Player** (Flowkey's shape) is its bar, the tools row under it, the music in the view chosen (the sheet or a
chord view, below), Wait mode's line and the keys, placed by the
`player-screen` grid, the transport floating over the sheet's foot (ADR 0061, 0081, 0085, 0102). The keyboard is as
tall as its keys' proportion makes it (below), at the foot or under the tools row as the keyboard settings dock it;
the View's Keys takes it away.

- **The bar,** one at every size and one row from 320px (ADR 0094, 0099, 0102): ✕ and Practise · Edit at its start;
  MIDI, ⚙ (Setup) and More (…) at its end, each its icon named in a tooltip, 4px apart on a phone held upright. More
  holds a piece's Song information (a sheet: its chords as diagrams, then its key as played, time and tempo as the
  song page's cards, its second title and who wrote it), Export to MIDI and an own song's Share. The title is printed
  on the sheet.
- **The tools row** (ADR 0102, Chordify's toolbar), under the bar at every size, over a hairline: quiet text buttons
  (no fill or line at rest, sand on hover and while open), each its 16px icon in soft ink, then its name in ink (Onest
  600 16px), cut short where the row has no room, 44px tall (40px on a phone on its side). The View comes first,
  named by the view shown with a chevron that turns while its menu is open ("Diagrams ⌄"); the tools after it share
  the row equally on a phone held upright and stand packed at its start from 640px. While Diagrams plays, the bar and
  the tools row fade up out of sight and reach, their room kept; a tap on the free room brings them back with the
  transport, the next sends all of them aside, and the music stopping brings them back.
- **The transport** (`PlayerDock`): one pill floating along the sheet's foot at every size, a phone on its side too:
  the tempo, ‹ ▶ › (Play in honey), the loop (pressed: a muted fill; R) and the hands. Its controls are 48px from
  640px, the 44px target side by side on a phone held upright, and 40px under 360px and on a phone on its side
  (`DOCK_BUTTON`); it may stand into the gutters, so the six fit from 320px in either language. Every view keeps
  its music in the room above it (`--float-room`). It steps aside while the music is read and comes back at a tap
  on a note; a tap on the screen's free room shows or hides it.
- **A phone on its side** (a landscape screen under 500px tall): Wait mode's line stands in the bar's row, between
  its two groups; the sheet takes the height between the bar and the keys.

**The Setup** (the bar's ⚙, a sheet) reads top to bottom as pictures: the key as a note picker (the piece's
mode named over it, a key choice in the piece's mode), the **pattern card** (its name and idea on a row that opens the pattern list; under it its two
hands, left then right, each a row of its own on a phone and side by side where they fit, naming the figure it plays
whole with a chevron to that hand's list; a changed hand has a way back to the pattern's own beside it, and the
pattern's line then reads "Left hand changed", "Right hand changed" or "Both hands changed" in ink in place of its
idea, so a changed pattern never passes for the pattern itself), the inversion as five drawn segments (Nearest, then Root to 3rd as
stacks of noteheads), the chord size as segments, and how it plays as a grid of toggle tiles (Chord positions,
Metronome, Count-in, Swing, and a piece's Tune and Recording). What the sheet shows (finger numbers, named notes,
chord names, the staves, the layout) is the View menu's alone, behind the tools row's View.

A piece with a recording has a **Recording** toggle tile in its Setup, on by default; in another key it is
disabled with "Only in D minor" (the key as `keyOf` writes it) under its name. The recording plays in Listen only;
nothing on the screen marks it beyond the tile.

How each screen uses its width:

- **Songs:** the collections as tabs (All, Your songs once there are any, then the books); the search, then Stage (a
  pop-up of only the stages its shelves hold, absent where none does) and With chords (a labelled toggle), under the
  search on a phone and beside it from 640px; and the songs as row cards in a grid.
- **Piece** (ADR 0100, Learn the song): one column at every width: its bar (Edit, Learned, More), the learning
  card, its facts as three cards, its chords as diagrams, its sections as rows, Play along and its note; Practise
  floats. Only a chord's sheet sounds and shows keys there. A section's page is the same column.
- **Learn:** the journeys as tabs over the shown journey's chapters, each folding under its heading, its lessons a
  zigzag of nodes; or the courses, shelf by shelf, as compact cards (icon tile, name, facts as pictures); Continue
  floats. A lesson's bar floats too: sections ‹ n/m ›, the lessons either side at its ends, its tools.
- **Practice:** seven rows, one for each place (Chords, Scales and keys, Progressions, Intervals, Accompaniment,
  Exercises, Quiz), each saying what is inside it in a line; Quiz and Exercises are titled grids of row cards.
- **A subject's pages** (Chords' Build · Find, Scales' Scale · Chords · Key, Progressions' three, Accompaniment's
  Patterns · Studies) are tabs under the screen's title: links, the page shown in ink over an ink underline.
- **A page that shows a thing on the keys** (ADR 0030) reads top to bottom on every width: the keyboard pinned; what
  it is (its name in the chord display or the display size, its tones or facts, a staff where it has one) with the
  page's one honey Play at the right; its choices, each a field under its name in soft ink, in a grid of as many
  columns of at least 20rem as fit; then its titled sections (available tensions, Practise in the Player). No page
  splits into two columns of unrelated things.
- **Settings:** two equal columns from 1024px.
- **Intervals:** the interval cards as many across as fit.

Stacks use gap: 24px between a screen's parts, 32px between sections, 16–20px inside a group. The explorers, a
lesson and a shared song's chart pin their keyboard to the top while the page scrolls.

**The Equal Columns Rule.** A chart's lines are grids of equal beats (the Grid, ADR 0099), each row as wide as its
beats' share of the longest row, so bars line up down the chart; a bar is parted by a 2px ink barline and each row
closes with one, its beats by a hairline. A beat is at most 4rem wide, so a bar reads at a glance on a laptop, not
across it; a line wraps to rows of two 4-beat bars on a phone held upright, four on a tablet or a phone on its side and
eight on a laptop. The same rule spreads a score's lines,
in the Player and the editor: each line is justified to its bars' share of the longest line's width. On a short
sheet (a phone on its side) both screens draw a line smaller, down to 0.4 of its size, so a whole system is in sight
over the keys (Scroll across's one line as engraved, its notes far over or under its staves anywhere in the piece, its
labels' row smaller with it); Pages open with a page's width fitted beside what floats over its right edge (the
editor's palette) and no larger than shows a whole line, the caret's or the playhead's line kept in sight. The
layouts are named alike wherever they are chosen, by how each reads, never as a view: Pages · Scroll down · Scroll
across (Страницы · Прокрутка вниз · Прокрутка вбок).

## Elevation & Depth

Flat, grouped by surface. Depth is the book's: a card paper on a darker paper, a 1px soft line round it; hover and
press fill with sand or darken a shade (brightness 95%). Shadows appear only on what floats over the page:

- **Popover** (12px corners, `shadow-md` with a 1px ring of ink at 10%): the MIDI, keyboard-settings, tempo and
  hands popovers, and a control's explanation from the ⓘ beside its name (`InfoTip`, a 16px icon in soft ink, ink
  while open; ADR 0096: no line of explanation stands under a control).
- **Floating banner** (`shadow-lg`, over its 1px line): the update banner.
- **Slider thumb** (`shadow-md` with a 1px soft-line ring).
- **Floating controls** (the floating buttons, a dial's card, the floating bar): the raised paper (`bg-raised`,
  a step lighter than a card by night) or honey, and a soft layered shade (`elevation-1` resting second actions and
  rows, `elevation-2` the main action and the bar, `elevation-3` a pointer over them and a dial's card), ink by day
  and a deeper shade by night. The main action is 56px, a second one 48px; pressed, either gives to 96%. A dial
  opens as a card of 48px rows, each its icon and its name, growing from its button over a page dimmed to half.

Bottom sheets rise over a page dimmed to 10% black and need no shadow.

**The Drawn Not Lifted Rule.** A surface separates by its surface and a 1px soft line, never by a shadow or a heavy
outline. One exception, on keys only: the keys' material. The rail casts an 8px shade of ink at 7% onto the keys, a
white key ends in a 6px lip of ink at 5%, a black key in an 8px slope of white at 12%. They draw a piano and appear
nowhere else.

## Shapes

Soft book corners from one 12px base: black keys 6px, white keys 9px, small parts 10–11px (a segment's thumb 11px),
buttons, pop-up buttons, segment tracks and step tiles 12px, cards 14px, sheets 20px at the top. Round buttons, Play, rating
marks, the learned toggle, finger circles and pips are fully round. Keys are square at the top and round only at the
bottom. Every card carries a 1px soft line, every control a 1px control line; list rows inside a card part by a 1px
hairline.

## Components

### Buttons

Plain, clear, one of them coloured.

- **Shape:** 12px corners, Onest 600 16px; 44px tall, 48px large, a 56px pill (17px) for a primary action that stands alone.
- **Primary:** honey, borderless, ink label; hover darkens to 95%, press nudges down 1px.
- **Soft / Outline:** card paper in the 1px control line, ink label: the second action (Arpeggio, the Player's tempo
  with its gauge, Again).
- **Secondary:** sky mist with its ink, no line.
- **Destructive:** card paper with a crimson line and label.
- **Link:** Onest 600, deep sky, underline on hover.
- **Round** (44px, card paper, the control line, 20px icon): close, back and next, settings, MIDI, More; always
  labelled. In the transport a control is the floating bar's (48px, no line): ‹ ›, the loop (pressed: a muted fill),
  the hands (one hand, the other mirrored, or both).
- **Play** (72px circle, honey; 56px on a phone on its side): the Player's one Play/Stop.
- **Focus:** a 3px deep-sky ring, 2px outside: one ring for every control, the base layer's own; inset only where a
  scroller would cut it (a bar of a chart, a key rail's button, a tab).

### Pop-up buttons and segments

**The Choosing Rule** (Apple's Human Interface Guidelines, read for sub-project 2): five or fewer short nouns are a
segmented control (one tap, every choice in sight); more, or longer names, a pop-up button that shows its label and
its value; on or off a switch; settings changed less often a sheet; a popover anchored to its button for a few quick
choices whose effect shows at once (the Player's tempo and hands); a setting is never hidden behind a pop-up when it
fits in sight (the keyboard's in its rail, a trainer's Auto next on its page). **And a choice is drawn where a picture
says it faster** (ADR 0029): a note is a **note choice** in two parts as a notation app chooses one, its seven letters
as segments then ♮ · # · ♭ (drawn large, named Natural, Sharp, Flat), the chosen name over it at the right; what is
chosen is what is written, so D♭ stays D♭ whatever the chord or mode (a root, a melody note); a key is the **key
choice**, its tonic so, then Major · Minor, offering only the accidentals a key signature writes (D♭ major, C♯ minor,
never D♭ minor; the other mode respells only such a tonic); an inversion is its stack of noteheads over its name, the root's in the
root's paint; several on-or-offs together on a sheet are **toggle tiles** (an icon over its name, 72px, soft ink in
the control line; on: the learned paint's wash with its deep shade); the sections of one screen are **tabs** (a strip
on a hairline, 48px, an ink underline under the chosen one, scrolling sideways on a phone). **Several of five to eight
short names are toggle chips**, every one in sight (a chord's added tones and alterations, a trainer's chord families
and how an interval is heard). A pop-up button stays for long lists and beside other controls in a row.

- **Pop-up button** (44px, 12px corners, card paper in the 1px control line): its label in soft ink, its value in ink
  (Onest 600 16px, truncated before it runs past the button), an up-down chevron. Under a field's printed name it is
  `bare`: its value alone, its name kept for a screen reader, so nothing is named twice. Its list is a popover surface
  (12px corners, the popover shadow and ring) of 44px items, the chosen one checked in umber; a grouped list (the
  scale pop-up's families, the chromatic walk's chord types) names each group in soft ink over a hairline. An item may carry a second word in soft
  ink ("Minor 7th m7"). Scale, Rhythm, the Progression, a trainer's Level and the Player's lists are pop-ups.
- **Pop-up button that checks several** (`MultiDropdown`): the Choosing Rule's pop-up for several of many (a
  trainer's Custom scales, intervals and chords, the chromatic walk's chord types). The button shows its label and
  every chosen value in order, or None; its list checks each chosen item, and a tap turns one on or off without
  closing it.
- **Toggle chips** (`ToggleChips`): several of a few, all in sight. A row of 44px chips that wraps, each at least
  56px; off, soft ink on card paper in the control line; on, ink on sand in an ink line (the toggle's pressed face).
  A group named for a screen reader, each chip a pressed button. Added tones read by their number (2 · 4 · 6 · 9 · 11
  · #11 · 13, each named add2 and so on), alterations by their sign (♭5 · ♭9 · #9 · #11 · ♭13).
- **Segmented** (a sand track, 4px inset, 12px corners): one value from a few. Unchosen segments are soft ink with no
  fill; the chosen one is a card-paper thumb (11px) in the 1px control line with ink text, Onest 600 16px. Two
  segmented controls whose words could be mistaken for each other name themselves on screen ("Keys play", the
  Chords explorer's "7th"). Triad, Chord size, Start on (the scale's notes), Fingering, Inversion, Block · Arpeggio
  and the 7th (labelled by degree, ♭7 · 7 · 𝄫7, each named "Minor 7th" and so on for a screen reader) are segments.
- **Only what applies is offered:** a choice the thing shown cannot take is left out, never disabled and never
  explained (the Chords explorer's 7th under a triad, Added tones over an 11th chord, Alterations on a minor chord;
  Fingering for a scale with one). One exception, the Player's Setup lists: a pattern or figure the music cannot play
  stays in its list, closed, with what it needs ("Needs a tune"), so the catalog reads the same over every piece.
- **Switch** (52 by 32px, a sand track in the control line; on: grass): a setting that is on or off.

### Cards and sheets

- **Card** (card paper, 14px, the 1px soft line): grouped rows, the practice card, a settings group (its title on a
  sand band over a 1px line).
- **Fact card** (`FactCard`, ADR 0100; the same card, 12px by 8px inset, its text centred): a 20px icon in soft ink
  over its name (14px, soft ink) over its value (18px, semibold, tabular), a key in Literata as a chord is. A
  piece's Key · Time · Tempo stand three across at every width, Chordify's Capo · Tuning · BPM.
- **Learning card** (ADR 0100; the card, 20px inset): where to go next as one deep-sky link in Onest 600 18px with
  an arrow that moves 2px on hover, over the lessons done: a 6px grass bar on a sand track and "3 of 8" at its end
  in soft ink (said "Lessons done: 3 of 8").
- **Continue** (ADR 0057, 0058): one honey button floating over Learn, 56px and round: its step's icon (read or
  play) alone, named by its tooltip; with names asked, a pill with Continue over the step's title in Literata.
- **Floating buttons** (ADR 0058) stand where Settings says: down the left or right edge in a column, or in a row
  in the middle (the default), each its icon alone unless names are asked.
- **A staff's options** sit on its card as small round toggles drawn as what they show (a hand, `C E`, `C7`),
  sand when on.
- **Step row:** a 48px tile in its kind's wash, no border, with a 20px icon in its deep shade; the title in Onest 600
  17px; the learned toggle at the end.
- **Row link** (64px): a 48px tile in its paint's wash with a 20px icon in its deep shade, or its number in a
  sequence in Literata (a lesson in its module, a song in its book), the title in Onest 600 17px on up to two lines (a
  song's title is never cut short), an optional detail
  of one line, what it carries at its end (a key, a level's mark, the learned badge) and a chevron (the disclosure
  indicator). A titled group of them is a grid of row cards, each its own card and each card the link: its hover
  fills the whole card (sand) and moves the chevron 2px, never a box inside the card. A list of one kind (the Patterns
  page) goes without tiles: every row would wear the same one. A row that opens a sheet over its page (a section's
  chords, each opening its chord's sheet) is the same row without the chevron: a button, not a link.
- **Sheet** (card paper, 20px top, swipe handle, its Literata title at the left with a Close at the right, a scrolling
  body with 20px insets, an optional footer over a hairline): Setup, New song, the takes, Song information, a chord's.
- **Note** (a lesson's callout, a note the learner reads): sand, 14px corners, 16px inset, body text.
- **Interval card** (card paper, 14px, the 1px soft line, 16px inset): the interval's name (Literata 600 20px) with
  its short name at the right in soft ink, its size, consonance and (past the octave) the degree a chord writes, a
  line each in soft ink (14px), so a row's staves stay level; its two notes on the treble staff alone (0.8); and Up ·
  Down · Together as three soft buttons along its foot, each turning into Stop. The Intervals explorer grids them
  one, two or three across.
- **Quiz block** (a lesson's; card paper, 14px, the 1px soft line, 16px inset): its question in Onest 600, then
  Answer on the keys as a soft button; while open, Check in honey (the lesson's one action) and, after a wrong
  answer, Show the answer soft; the verdict a line with a grass check or a crimson cross. Its keys take the Theory
  quiz's faces: chosen honey, extra crimson, missing ringed.
- **Scale example / line of notes** (a lesson's; the same card): a scale's name in Literata 600 20px, its notes as
  chips (the degree on the key's tonic or scale colour, then the note), its run on the treble staff; a line of notes
  on its own clef's staff; Play soft, turning into Stop.
- **Pattern example** (a lesson's; the same card): the pattern's name in Literata 600 20px, its description in body
  text, "Played over" its piece in muted small text, then Play (soft, turning into Stop) and Open in the Player
  (outline). **Progression example:** the Progressions page's row of chord buttons and its Play, soft here (the
  tool's one honey action there), then its row into the tool on a card.
- **The pages that work a thing out.** Chords' Find
  shows its chord in the chord display (72px), its notes from the bass as degree chips, "Also:" the other names, and
  Play (honey), Clear and Open in Chords; Reharmonise sets each group's chords as chord buttons filling a grid (the
  symbol over "as 3 · in the key"); Passing chords sets each way as a card (its name, In the key or Chromatic at the
  right in soft ink, its row of chords as outline buttons, one line of why, Play soft), cards two across from 1024px.
  Progressions sets the row of chord buttons (the symbol over its numeral) first, with Play (honey), Practise in the
  Player and Through the keys (soft) and the progression's note under them; then its fields: the library behind one
  pop-up button grouped by style (it names the progression shown, or the line typed) over the field for numerals or
  chords, the key picker and the chord size. **A row that chooses is never a row that leaves:** a row with a chevron
  is always a link.
- **Patterns** (under Practice's Accompaniment): Favourites, Your patterns, the four groups and Hidden as titled groups of row
  links without tiles, each a name over its idea line; New pattern is the bar's round +. **A pattern's page:** the
  bar's star (pressed: a sand fill and a filled star) toggles a favourite; the idea in 20px, each hand's figure as two
  facts, a card with the pattern over a bar of C major on the grand staff (or over the first line of a song with a
  tune), "Over …" in muted small text and Play (honey, the page's one action), the source's description in body
  text, then outline actions: Practise in the Player, Make your own from it and Hide from the Player (a built-in), or
  Edit and Delete (crimson line; asks first) for the learner's own; Used in lists the music that plays it. **The
  editor:** Name (a 48px field), Right hand and Left hand pop-ups, the same card with Play soft, then Save (honey) and
  Cancel. **The Setup's Pattern page** lists From the chart, Favourites, Your patterns and the groups (the hidden left
  out but for the one playing), each a name over its idea line, and at its foot a row link to Patterns in Learn.
- **Tension chip** (the 44px outline button of a grid item): its degree on its role's colour (an avoid note's on sand,
  so no chord role is spent on it), then its note; pressed (sky mist, a small square) while the chord plays with it on
  top. The chord builder sets them under a 7th chord in four cards, Weak · Strong · Tensions · Avoid, each titled
  with a line of what its notes do.

### Marks

- **Rating mark:** known is a 16px grass disc with a check; a gap a 10px ochre dot; not checked a 10px ring of the
  control line, 1px.
- **Learned toggle:** on a path's row, a 28px ring of the control line in a 44px target, filled grass with a check
  once learned; on a piece's page, a toggle button (a small ring with a check, "Learned") that wears the grass wash
  when on. **Learned badge** (a song's row): a 20px grass disc with a white check.
- **Level mark:** four 4px pips rising 6 to 12px, the first ones soft ink, the rest hairline.

### Navigation

Monochrome, so the content keeps the colour. A bar docked along the bottom on phones (card paper, a 1px soft line
above it): four places, Path · Songs · Learn · Practice (Route, Music, BookOpen, Metronome), a 24px icon over an
Onest 500 14px label, both soft ink; the current place fills with sand in a 1px soft line under a semibold ink label.
From 1024px, a 256px sidebar with a 1px soft line on its right: "Piano Trainer" in Literata 600 22px beside the
collapse button, the places as 44px rows (20px icon, 16px label) and Settings at its foot. Collapsed, it is 72px of
icons, each named in a tooltip. Learn is the lessons; Practice is seven places, one for each thing practised.

**The screen's bar** (a shell screen's title, 36px Literata, 48px from 1024px, with Back before it and actions
after) holds at the top on paper; where the screen is one of a subject's several, the subject's **tabs** are its
second row. It stays until the page has scrolled past it, slides away over 200ms while the page is read downwards
and comes back, tabs and all, the moment the page turns upward; what is pinned under it (the keyboard) slides with
it, never jumping.

**Shortcuts.** `?` opens a sheet of the keys this screen takes: groups under a small soft label (this screen's,
then Piano keys, then Anywhere), each row a line of ink with its **keycaps** at the right, sand chips 28px tall in
Onest 500 14px (`Kbd`): `Space`, `←`, `R`, `⌘` `B`. A control with a key names it to a pointer that rests on it:
"Play (Space)". A screen touched with a finger sees no Shortcuts button.

### The keyboard (signature)

The whole piano, A0–C8, hung from a light wooden **rail** and scrolling sideways with no bar. The rail runs the
piano's length, drawn 28px at the foot of a 44px strip, and a swipe on it scrolls the keys. Its controls stay in view,
every one a picture and none behind a button: 44px targets whose ink icons sit on chips in the drawn rail and never
reach over a key, focused with the deep-sky ring, each naming itself to a pointer that rests on it. Left to right:
the **keyboard map** (all 88 keys small, an ink frame round the part in view, dots under the keys marked or down;
at most 22rem wide, always there where the keys scroll); **‹ ›**, an octave each way; the **zoom**, − and +, over
Whole piano · Fit · Large, the button at an end faded; the **note names**, one button that goes round wearing what the
keys show (`C`, `CDE`, a struck-out `C` and an empty chip for none); **typing** (a keyboard); then, a gap on, how the
keys play: Sound the MIDI keyboard (a speaker) while one is connected, the **glissando toggle** (waves) and the
**Pedal** (a drawn piano pedal, `PedalIcon`), pressed while the sustain is down, the MIDI keyboard's too. A toggle
that is on fills its chip in ink. A pointer that cannot use a control does not see it (‹ › and typing are a fine
pointer's), and a rail too short keeps its buttons: ‹ › go below 28rem, the map below 20rem.

- **Proportions:** a key is 4.4 times as long as a white key is wide on every screen, the Player's too, at least 96px
  and at most 32% of the screen's height. **Key size:** Whole piano (all 52 white keys fill the width; no ‹ ›, no map, no finger row), Fit (the range fills the width, white keys 34–48px) or Large (56px, about an octave on a phone). It opens centred on the keys that matter and centres again when the size changes.
- **Material:** white keys part by a 1px line of key bed and end in a lip; black keys end in a lighter slope. **Down**
  is physical as well as coloured: a key going down drops 2px and its lip or slope shortens to a third, in 80ms;
  under reduced motion, at once.
- **Touch:** a key sounds and goes down the instant it is touched, sounds while it is held (a finger, a typed key, a
  MIDI key) and stays down for at least the shortest press, 150ms, so the lightest tap shows; let go, it is plain
  again and its sound stops, unless the pedal holds it: then it stays down, sounding, until the pedal comes up. The keys hold still under a finger. By default only the key a finger touched sounds
  and the keyboard scrolls from its rail; with the rail's **Glissando** on, every key a finger slides onto sounds.
- **Faces:** plain; a mark's wash with its label; honey for a quiz's chosen or Name chord's lit keys; crimson with ✕ for
  a wrong key; a deep-sky ring inside a missing key; and down over all of them. A wrong key wins over a lit one, a lit
  one over a mark, a mark over a selection. **Note names** (C · All · None) put "C4" on every C, or its name on every
  key, drawn smaller than a mark's label, which always wins. The computer keyboard's letters sit on the keys it plays.
- **Finger row:** finger numbers in 20px circles under the keys, in two staggered lines as the keys stand: a black
  key's in the upper line (sky wash), a white key's in the lower (key paper ringed in key bed). Only while a mark
  carries a finger.
- **A mark's caption:** a second, smaller line over a mark's label: in the Scales explorer's Chords view each
  degree's key carries its numeral over its chord (`ii` over `Dm`), both 12px, wrapping anywhere on a narrow key; in
  an inversion the numeral takes its figure and the chord its bass (`I⁶` over `C/E`).
- **What a key plays:** a key sounds itself unless the screen makes it more: in Chords view a degree's key plays its
  chord, stacked from it, and every key of it is down while the hand holds the key. The keyboard then spans every
  key the walk of the chords plays (C4 to G5 for C major's triads, the tonic's chord an octave up included), so a
  chord a key plays or the walk strikes is in sight on a phone.
- **Spotlight** (the explorers, a lesson, a shared song's chart): the keys the app puts down are the ones struck
  last: an arpeggio's or a run's key alone, a chord's keys together. Every mark stays; the key played stands out by
  going down, never by hiding the rest.
- **Access:** keys are buttons named by note ("F sharp 4"), one in the tab order, the arrow keys, Home and End walking
  the rest. The focused key keeps its place under its neighbours: its two-tone ring outlines the face a finger
  touches (a black key whole, a white key below the black keys).
- **Every Play becomes Stop** (a square) while its sound plays; in a grid of items (a Piece's bars, a scale's chords)
  the item is pressed instead (sky mist), and a second tap stops it.

### The circle of fifths (the Key view)

The chooser of Scales and keys' Key view (a major or minor scale): a square up to 24rem, centred, two rings of twelve wedges (the major keys outside, their
relative minors inside, C at the top and a fifth a twelfth of the turn clockwise) parted by the soft line. The key
shown fills its wedge with the tonic's wash and the places of its six other chords the scale's (the keys' own marks:
the circle is the key's scale drawn round); the rest are card paper. Every key is a 44px round link on its wedge with
its name (Onest 600 14px) over its numeral where it holds one of the key's chords (ink), or its signature's count
("3♭") in soft ink; the key shown is card paper in the control line (`aria-current`). The key's name sits in the middle
in Literata 600 18px. A dice round button in the header takes a random key. Beside it: the signature on a staff, the
key's notes, relative and modes, the chords it borrows, and under them the songs and studies in the key.

### The sheet (the Player and the editor)

The score engraved by Verovio in a worker (ADR 0078), laid out as the View says: Pages, A4 pages at their print size
on a canvas that pans and zooms (ADR 0075, 0087); Scroll down, the chart's lines down the screen, each justified to
its width; Scroll across, one line across as large as its height allows with two bars at least in sight. The title
is printed at its head, the staves' names at its first line's head (ADR 0094).

- **Ink:** notes, rests, clefs, beams and ties in ink; the staff's lines and barlines in the control line
  (`--input`); the staff of the hand not heard or practised in soft ink (hands: right → the bass staff soft). Dark
  mode and increased contrast follow the tokens.
- **Labels over each line** (`LabelRow`, ADR 0087, 0095): the line's first bar's number, a section's name at its
  first bar and a tempo where it is marked, `·` between (Onest 12px, soft ink, tabular); each chord symbol at its
  onset (Literata 600, 17px at full size).
- **The playhead** (ADR 0096): one thin line of the selection colour across the system's staves in sight, just
  before what sounds, the same height wherever it stands. It moves with the audio clock while Listen or the editor's
  Play plays and stands at the notes awaited in Wait mode; it brings its line into sight (a scroller's middle half,
  a page canvas's line). While the loop stands chosen and nothing moves, it is out of sight.
- **What is chosen** is coloured, never boxed (ADR 0088, 0096): a chosen note's head, stem, flag, accidental, dots
  and ledger lines in the selection colour; a range a light band of it over the staves it takes, from its first
  note's left edge to its last's right edge. A click chooses the head under it (one key of a chord) or a chord's
  column; Shift-click or a held finger reaches on; empty staff chooses nothing.
- **Bars:** each bar is a button: a tap jumps to the beat group nearest it, Enter or Space to the bar's first.
- **The loop:** a band of the selection colour over every staff in sight for its bars, its notes coloured, and a
  grip at each end on its barline (at a line's start, between its clef and key and its first notes): a 4px line in
  a 44px slider, dragged over bars or moved by the arrow keys, never past the other end.
- **Finger numbers** (the Finger numbers toggle): a chord's fingers stand in one column on its voice's outer side, a
  staff space apart, the top note's finger on top as printed piano music stacks them: over a lone treble voice or an
  upper voice, under a lone bass voice or a lower voice. The staves move down, apart or the page grows so every
  column stays on the page.
- **Named notes** (the Named notes toggle): each head drawn round with its note's name in it as spelled, as
  notation programs' note-name heads: a filled note's in ink with the letter in the page's colour, a half or whole
  note's open with the letter in ink. The Player's sheet only.
- **Sizes:** Scroll across fills its height, 0.4 to 1.6 of full size; Scroll down's lines are as large as the width allows,
  smaller on a phone on its side so a whole system is in sight; Pages print at 0.6, the canvas zooming them.
- **Loading** keeps the staff's space, its lines faint; if it cannot be engraved, one line says the music can't be
  shown, and the keys, Play and Wait mode still work.
- **Outside the Player** a staff is `LazyScoreView`, the engraver loaded the first time one is on screen: the Scales
  explorer engraves the run from its start note in the scale's key (a mode in its parent's), the other hand's staff
  soft, finger numbers while Fingers shows a hand; the key page engraves its signature with its scale; the Chords
  explorer writes its chord as a bar of whole notes (the left hand's root on the bass staff) with no key signature,
  every accidental on its note; an interval card writes its two notes on the treble staff alone (`staff`), 130 units
  tall: room above for a 13th over B4 with its sharp, below for two ledger lines.

### The chord views (the Player)

The Player shows a piece as **Sheet music** (above), **Chords over lyrics**, **Diagrams** or **Grid** (ADR 0099),
chosen at the top of its View (ADR 0102), under Show the music as and its ⓘ naming each in a line, as four tiles two
by two: each a picture of its view drawn in its own style over its name (Onest 500 14px), on card paper in the
control line, the one shown pressed (sand, an ink line, ink text); one the music cannot show greyed to 40%, what it
needs its tooltip (words, chord symbols), and a saved view it cannot show falling back (Chords over lyrics to
Diagrams, Diagrams or the Grid to the sheet music). Then Ask each time a song opens, a switch; the view shown's own
part under its name (the sheet music's Layout, staves and switches; Diagrams' Mode, Animated · Summary, and Lyrics),
then Every view (the Keys), each group under its heading over a hairline; a field's name in soft ink (Onest 14px),
its ⓘ beside it. The editor's View is the sheet music's part and its Keys alone. On a phone the menu is as wide as
the tools row; from 640px it is 26rem. Each view is one scroller under the bar with the title printed at its head as
the sheet prints it; every chord symbol in them is printed as the sheet prints it (`C♯m7`, `printedSymbol`), and every
one keeps its music in the room above the transport.

- **Beat cells:** a bar counted in its meter's beats, each a cell on card paper, a hairline between a bar's cells and
  a 2px ink barline before each bar; a chord named in the cell it starts in (Literata 600, as large as the cell holds
  it, 12 to 20px, a second chord in the same beat a size down); the beat sounding filled with ink, its name in the
  page's colour; the loop's cells on a 15% deep-sky band.
- **The beat strip:** every cell as played in one row, square cells 56px on a phone (64px from 640px, 40px on a phone
  on its side), sliding in 200ms (at once under reduced motion) so the beat sounding stands a third of the way in,
  never a scroll bar; a cell tapped takes the cursor there. A chord is named only in the beat where it changes, so a
  chord held over bars is named once; where the music turns to no chord its first beat holds a quarter rest (Noto
  Music 28px). A picture of where the music is, hidden from a screen reader.
- **Chords over lyrics:** the title, then the strip across the view, held at its top on the page's paper, then one
  column in the middle at most 42rem wide: the chord summary, then the song by section, each under its name in spaced
  capitals (Literata 600 14px, 0.3em apart, soft ink), each line its chords as **chips** over its words, verse 1 first
  and each verse more under it in soft ink. A chip is its symbol in Literata 600 (16px, 18px from 640px) on a sand
  wash with 10px corners, filled with ink while it sounds, its target reaching past it to a finger's size; a line of
  no words is its chips in a row. The line playing is ink and semibold, the others soft ink; it is kept in the top
  third of the room between the strip and the transport as the music reaches it.
- **Diagrams** (ADR 0101, Chordify's): the title, then the chord sounding and the next side by side, the same size,
  each up to half the room and 28rem at most, never a third: each its diagram over its symbol (Literata 600 28px, 22px
  on a phone on its side), the sounding one's in ink, the next's diagram greyed and its symbol soft ink. The strip
  across the view under them; then, with the View's Lyrics on, the line sung centred (18px, 20px from 640px,
  semibold), each word in ink once the music reaches it and soft ink before, and the next line in soft ink under it.
  Between lines that sing a dash stands in the line's place, 64px by 4px on the sand track, its 10px ink dot running
  along it to the next line's first word, the way behind it in ink. Where no chord sounds yet the next stands alone,
  greyed, "Next: C". All of it stands in the middle of the room above the transport (`diagrams-view`): a short room
  keeps the line sung and leaves out the next (between lines, the next alone, no dash), then the diagrams shrink to
  what is left. On a phone on its side the chords take the left half, its whole height, and the title (one line), the
  strip and the line sung stand beside them.
- **Diagrams' summary:** the title, the strip held at the view's top on the page's paper, the words as above, then
  the song's chords as cards (the card surface, 12px inside) in the order they first sound, two a row on a phone held
  upright, three from 640px, four from 1024px and on a phone on its side: each its diagram over its symbol (Literata
  600 22px) in soft ink; the chord sounding's card outlined in ink, its symbol in ink. A card opens the chord's sheet.
- **Grid:** the chart in beats under the title: each section's name (Literata 600 20px) with its bars in soft ink,
  each line a card-paper row of bars, every beat as wide so bars line up down it, a row wrapping where the screen
  holds no more; cells 48px tall (56px from 640px, 44px on a phone on its side), a bar's number small in its first
  cell's corner, each bar a button.
- **The chord diagram** (`KeyDiagram`, ADR 0101): a chord drawn as the app's keys, white keys key paper parted by the
  key bed and black keys a warm black, always F3 to B4, eleven white keys, so a song's chords stand in one place and
  move by a key or two; each key held a dot near its foot, ink on a white key and white on a black one, and a slash
  chord's bass a ring where the chord has it not (or where it cannot stand lowest). It takes its container's width at
  a key's proportion; one to come is greyed whole (40%). It names its chord and notes for a screen reader.
- **The chord summary:** the chords in the order they first sound, each once: its diagram 40px tall (a wide chord
  wider) over its symbol (Literata 600 18px), a button with 12px corners filling sand on hover; one row, scrolling
  sideways and fading at an edge with more beyond it.
- **A chord's sheet** (from a chip, a diagram, the summary): "C♯m7 chord" as its title, the diagram as wide as the
  sheet allows (at most 28rem); a piece's chord its Inversion under it as the kit's inversion segments (Root · 1st ·
  2nd · 3rd, each its stack of heads), with an ⓘ, an inversion that does not fit the keys greyed (50%) and saying so
  in its tooltip, a slash chord's or a chord of five notes or more all greyed, none chosen; at its foot Close (soft)
  and Play (honey, Stop while it sounds) side by side. On a section's page it asks "Play it on the keys" (Onest 600
  18px) over the diagram's keys, F3 to B4, and once they are held together says "That's it." beside a grass check.

### A piece's page: Learn the song

A song's or a study's page (ADR 0100), one column under its screen bar (Back, the title, then Edit, Learned and More:
Check these chords, an own song's Share, Reset to the original or Delete, asked first): its second title, stage and
who wrote it; the **learning card**; Key · Time · Tempo as **fact cards**; **Chords** (Literata 600 24px) over the
chord summary; **Sections** over its sections as rows in one card, each a row link in its section's paint with a note,
its name and "15 lessons · 3 done", to its page; **Play along** (a row in its own card, in the song's yellow or the
study's grass, "The whole song in the Player"); its note and its key's scale. Practise floats. A piece of one section
has that section's lessons in place of the chords and the rows. A listing's one action is Write the chart (the honey
pill).

**A section's page** ("Learn the Chorus", Practise in its bar looping the section): its card, a 56px tile in the
section's paint beside the piece's title (soft ink), the section's chords in Literata 600 24px, `3 ×` before a run
played round, and its lessons done; then its lessons as titled groups of row cards, each tile in the section's paint,
a check in place of its icon once done: **Chords** ("Learn C♯m", each opening its sheet to learn it), then rows into
the Player looping their bars: **Changes** (Play the chords in time, a row for each chord sequence; One change at a
time, "From C♯m to E" over its bars) and the **Pattern** (its name, on its chord and bars).

### The score editor

The page where a learner writes their version of a piece or a song of their own (ADR 0027), one screen that never
scrolls as a whole, as notation software is (ADR 0089, 0091, 0094): its bar, the sheet (its one scroller) and the
keys, with the dock and the palette floating over the sheet.

- **The bar,** one at every size (ADR 0094): ✕ · Practise | Edit · the edit row (Delete · Undo · Redo · Copy · Cut ·
  Paste, wrapping under the bar on a phone) · View · MIDI, each its icon named by its tooltip. No title in it (the
  sheet prints it) and no caret line in sight: a live region tells a screen reader where the caret is.
- **The sheet** shows the score as the View does (its staves, chord symbols, words and fingers), laid out as the
  Player's (above), and what is printed is edited where it is (ADR 0094, Flat's): a click on the title turns it into
  a field in its place; the tempo mark, a key or time signature, a clef, a section's name and a staff's name each
  open their popover or menu there; a chord symbol, a syllable and a finger are typed in one field floating where
  they print (ADR 0096). Under a mouse each wears a 5% ink wash; a finger leaves none.
- **The caret** (ADR 0096) is a thin line of the selection colour on its staff, just before the notes it stands on,
  which are drawn in it; notes chosen are coloured, a light band on each line they are on. A click on a staff
  chooses it (or Alt ↑ ↓), a double click writes the note there, and the notes at the caret drag by the key's steps.
- **The dock** (`EditorDock`), the Player's transport in shape and place: the tempo · ‹ · Play · › · Record, then
  Takes once the song has any, floating over the sheet's foot in the room the palette beside it leaves; it steps
  aside while the music is read. Record counts in and records at once with a MIDI keyboard, else its popover says it
  needs one and connects it. While a take records, the recording strip stands in its place: a softly pulsing ink
  dot, the count-in's beat or the bar and the time in tabular figures, its settings (the metronome and the tune
  under the take) and Stop in honey.
- **The palette** (`EditorTools`, ADR 0089): one card floating over the sheet, at the foot on a phone held upright
  and a tablet, beside the sheet at its right on a laptop and a phone on its side (open there, folded at the foot
  until the learner chooses), with a grab handle on its top edge. Folded, a quick row of the note values and Dotted
  over a bar of categories as pictures (Notes, Pitch, Articulations, Dynamics & hairpins, Slurs & lines, Bar, Clef,
  Key signature, Time signature, Barlines & repeats, Text & pedal), ending in its fold and a Keys toggle; opened,
  every category's section stacked and scrolling, Notes first with its editing modes (Replace · Insert · Chord, a
  segment of pictures). Each key is a 44px picture or glyph named in its tooltip (`ToolKey`), pressed while on; what
  a section's tools do is the ⓘ beside its name, and a greyed key says why in its tooltip.
- **Pull-downs** (a section's menu, a staff's) are a popover anchored to what they edit, their actions 44px ghost
  rows.
- **Sections** are named as a song's parts: Intro · Verse · Chorus · Bridge · Ending; a songbook's own kinds
  (Practice, Hymn, Part) stay on its pieces and are not offered.
- **The takes** (ADR 0028, 0096): their sheet, from Takes in the dock or by itself on a take just kept, holding no
  Record and no facts the learner cannot change: the piece's takes, the newest first, each a row: Play at its start,
  its name (a link to its page) over its length and tempo in soft ink, and a menu at its end of Write into the score,
  Download and Delete. Write into the score is a page of the sheet (‹ Back; Into as segments, Split at a pop-up
  grouped by octave, Shortest note as glyph segments named on screen, Write in honey); Delete asks in an alert, as
  every deletion does (the take named, Delete in its crimson beside Keep it).
- **A take's page** (its row's name a link; in the shell, under its screen bar): the Name field (the time made as its
  placeholder), Play (soft) beside its length and tempo, the **piano roll** on a card scrolling sideways (96px a bar,
  an 8px lane a key, black keys' lanes in muted paper, notes in ink at four strengths by velocity, the sustain,
  sostenuto and soft a thin lane each underneath, bar lines in the soft line and beats in hairline, a honey playhead,
  each bar a full-height button numbered as the piece numbers it), then **Keep bars**: First and Last bar pop-up
  buttons and Keep (outline) once they cut something, the bars that go dimmed on the roll, asked first in an alert.
  The keyboard over it goes down as the take plays.
- **New song** (Songs' floating +) is a sheet: the Title field, the key choice, the five meters as segments, the
  staves its score starts with (the piano, a staff over it, or a staff alone, its own sheet), and at its foot Make in
  honey with Record (soft, a microphone) beside it, which opens the editor with Record pressed.

### Free play

Practice's eighth place, the screen bar over the keyboard at its widest (C2–C7), then a row of Mode (Play · Mark as
segments), the key choice and Clear (outline, an eraser), then the **live score**: a grand staff with no time
signature, each chord a whole note in a bar of its own, its name over it in Literata 600 18px with its kind and the
tones left out under it in soft 12px ink; before anything is played, one empty bar and "Play, and it is written
here." in soft ink. In Mark, a second row: Colour (Right hand · Left hand) and Finger (None, 1–5) as named
segments; a marked key wears its hand's tone with its letter (R, L), its finger in the finger row.

### Motion

One ease-out, `cubic-bezier(0.22, 1, 0.36, 1)`: 200ms on colour changes, 80ms on keys. Sheets rise on their own
exponential ease-out. Under reduced motion every transition is instant.

## Do's and Don'ts

### Do:

- **Do** give each screen exactly one honey action, borderless, with the ink on it.
- **Do** part cards by surface and a 1px soft line, and draw every control in the 1px control line.
- **Do** show what is chosen in neutrals: an umber check, a card-paper segment, a sand fill for the current place.
- **Do** show every sound on a keyboard: a key that sounds goes down, a mark from its wash to its full paint.
- **Do** label every coloured key with its degree, finger or note.
- **Do** set titles and chord symbols in Literata 600, and everything read or pressed in Onest.
- **Do** give every quiet value an increased-contrast step under `prefers-contrast: more`.
- **Do** keep targets at 44px and focus rings visible (3px, deep sky).
- **Do** set numerals that change in place in tabular figures.

### Don't:

- **Don't** draw characters, animals or mascots: the book lends its colour, line and labelling only.
- **Don't** put a kicker or eyebrow label above a heading; the heading and the labels on the things themselves are
  enough.
- **Don't** fill more than one control on a screen with a colour; a second action is soft.
- **Don't** show what is chosen in a paint; brick means only the root tone and the right hand.
- **Don't** colour the navigation; its icons and labels stay soft ink.
- **Don't** colour chrome with a chord role or a hand colour, or put a chrome paint on a chord tone.
- **Don't** put a chrome paint at full strength on the chrome: a place's tint is its wash, with its deep shade on it.
- **Don't** set a control, a tab or a key label in the serif.
- **Don't** draw a 2px line round a card or control, or lift a surface with a shadow (only popovers, the update
  banner, the slider thumb and the floating controls float).
- **Don't** draw a key that does nothing: every key sounds.
- **Don't** stack a sheet over a sheet; open a list as a page of the sheet.
- **Don't** write how-to paragraphs; the labelled keyboard and the layout teach.
