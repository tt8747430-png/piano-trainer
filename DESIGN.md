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
  grass-deep: '#4D744E'
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
  yellow-deep: '#8B682B'
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
    fontFamily: 'Literata Variable, Noto Music, Georgia, serif'
    fontSize: '72px'
    fontWeight: 600
    lineHeight: 1
  display:
    fontFamily: 'Literata Variable, Noto Music, Georgia, serif'
    fontSize: '44px'
    fontWeight: 600
    lineHeight: 1.1
  large-title:
    fontFamily: 'Literata Variable, Noto Music, Georgia, serif'
    fontSize: '34px'
    fontWeight: 600
    lineHeight: 1.15
  title-1:
    fontFamily: 'Literata Variable, Noto Music, Georgia, serif'
    fontSize: '28px'
    fontWeight: 600
    lineHeight: 1.2
  title-2:
    fontFamily: 'Literata Variable, Noto Music, Georgia, serif'
    fontSize: '22px'
    fontWeight: 600
    lineHeight: 1.3
  title-3:
    fontFamily: 'Literata Variable, Noto Music, Georgia, serif'
    fontSize: '20px'
    fontWeight: 600
    lineHeight: 1.25
  headline:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '17px'
    fontWeight: 600
    lineHeight: 1.375
  control:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '14px'
    fontWeight: 500
    lineHeight: 1.43
  key-label:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
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
  continue-band:
    backgroundColor: '{colors.wash-yellow}'
    textColor: '{colors.ink}'
    typography: '{typography.title-1}'
    padding: '12px 20px'
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
  (Continue, Play, Practise, Check, Next, Apply), borderless, with the ink on it (`dusk-ground` by night). Also the caret, the text selection (22%), a quiz's chosen
  keys and Name chord's lit keys.

### Secondary

- **Umber** (`umber` with card-paper text; night `dusk-muted` with `dusk-ground` text): what is chosen: the check on
  a pop-up's chosen item, a popover's and a Setup list's, the loop's grips on the sheet. Never an action and never a
  colour.
- **Sky Mist** (`sky-mist`, ink `sky-mist-ink`; night `sky-night`, ink `sky-night-ink`): the playing bar of a
  chart, the cursor on the Player's sheet, a pressed chord of a scale, the secondary button. Sky on the chrome is one family, the accent: a link,
  focus, where you are.

### Tertiary: meaning colours

- **Deep Sky** (`sky-deep`; night `sky-light`): links and every focus ring.
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
  grass, song yellow, progression lilac) and the Continue card's sky header band, which carries the ink title. By
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

**Display Font:** Literata Variable (weight and optical-size axes, Latin and Cyrillic), self-hosted, with Noto Music
and Georgia behind it; its Greek and Vietnamese subsets stay out of the PWA precache.
**Body Font:** Onest Variable, self-hosted (with Noto Music's music subset behind it for 𝄪 and 𝄫, then system-ui).

**Character:** a sans and a serif made to work together, as a system face and its book face are. Literata sets what
names a screen or a chord, at weight 600, and its optical size fits its drawing to each size; Onest carries everything
read and every control. `h1` to `h3` are Literata 600 by default. The scale follows the text styles of a phone's
system, in rem, so it grows with the reader's own text size.

### Hierarchy

- **Chord Display** (Literata 600, 72px, 1): the chord in the Chords explorer, a Check's score.
- **Display** (Literata 600, 44px, 1.1): each screen's title from 1024px, the scale's name.
- **Large Title** (Literata 600, 34px, 1.15): each screen's title on a phone.
- **Title 1** (Literata 600, 28px, 1.2): the Continue card's band.
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

Phone first. On a phone a shell screen is one column (up to 48rem) with 16px gutters, clears the notch, and scrolls
over a bar docked along the bottom (112px of bottom padding). From 1024px the bar becomes a 240px sidebar (the app's
name in Literata, then the four places) and the screen takes the width it is given, up to 72rem, with 40px side
padding. The Player and the Check are full screen (up to 72rem) with no navigation: the viewport's height, scrolling
inside when their content is taller.

**The Player** (Flowkey's shape) is a toolbar, the keyboard, the sheet, Wait mode's line and the transport, placed by
the `player-screen` grid. The keyboard takes the height the rest leave (upright 192–320px, from 640px 224–384px), and
Wait mode's line the height after it, so the transport keeps the bottom:

- **Upright phone:** the toolbar holds ✕, the title (truncated), the loop, MIDI and ⚙ (Setup); the tempo and hands
  buttons flank ‹ ▶ › at the bottom, in the thumb's reach, the transport's buttons 8px apart.
- **A phone on its side** (a landscape screen under 500px tall, judged first): one toolbar with the tempo and hands;
  the keyboard (about 120px on a 390px-tall phone); the sheet at 0.7, with Wait mode's line and ‹ ▶ › in a column at
  its right, where the right thumb is. Play is 56px there.
- **From 640px** (tablet, laptop): as on its side, the transport centred under the sheet, the sheet at 1.

From 1024px each screen arranges itself in two columns with a 40px gap, tops aligned:

- **Songs:** the filters in an 18rem column, the list beside it.
- **Piece:** facts and actions (5 parts) beside the chart (7 parts).
- **Learn and Practice:** two equal columns of grouped rows (Lessons beside References; the Theory quiz beside the
  studies and progressions).
- **The Chords and Scales references, Settings:** two equal columns; the Path's steps in two columns inside their
  card.

Stacks use gap: 24px between a screen's parts, 32px between sections, 16–20px inside a group. The references, a lesson
and a Piece's chart pin their keyboard to the top while the page scrolls.

**The Equal Columns Rule.** A chart's lines are grids of equal columns, each line as wide as its bars' share of the
longest line, so bars line up down the chart; a bar is parted by a 1px control line and each line closes with one.

## Elevation & Depth

Flat, grouped by surface. Depth is the book's: a card paper on a darker paper, a 1px soft line round it; hover and
press fill with sand or darken a shade (brightness 95%). Shadows appear only on what floats over the page:

- **Popover** (`shadow-md` with a 1px ring of ink at 10%): the MIDI, keyboard-settings, tempo and hands popovers.
- **Floating banner** (`shadow-lg`, over its 1px line): the update banner.
- **Slider thumb** (`shadow-md` with a 1px soft-line ring).

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

- **Shape:** 12px corners, Onest 600 16px; 44px tall, 48px large, a 56px pill (17px) for the Continue card's action.
- **Primary:** honey, borderless, ink label; hover darkens to 95%, press nudges down 1px.
- **Soft / Outline:** card paper in the 1px control line, ink label: the second action (Arpeggio, the Player's tempo
  with its gauge, Again).
- **Secondary:** sky mist with its ink, no line.
- **Destructive:** card paper with a crimson line and label.
- **Link:** Onest 600, deep sky, underline on hover.
- **Round** (44px, card paper, the control line, 20px icon): close, back and next, settings, MIDI, the loop (pressed:
  a sand fill), the hands (one hand, the other mirrored, or both); always labelled.
- **Play** (72px circle, honey; 56px on a phone on its side): the Player's one Play/Stop.
- **Focus:** a 3px deep-sky ring, 2px outside.

### Pop-up buttons and segments

**The Choosing Rule** (Apple's Human Interface Guidelines, read for sub-project 2): five or fewer short nouns are a
segmented control (one tap, every choice in sight); more, or longer names, a pop-up button that shows its label and
its value; on or off a switch; settings changed less often a sheet; a popover anchored to its button for a few quick
choices whose effect shows at once (the keyboard settings, which must not cover the keys; the Player's tempo and
hands). Never a row of chips or a wall of tiles.

- **Pop-up button** (44px, 12px corners, card paper in the 1px control line): its label in soft ink, its value in ink
  (Onest 600 16px, truncated before it runs past the button), an up-down chevron. Its list is a popover surface
  (12px corners, the popover shadow and ring) of 44px items, the chosen one checked in umber; a grouped list (the
  Chord pop-up's five families) names each group in soft ink over a hairline. An item may carry a second word in soft
  ink ("Minor 7th m7"). Root, Chord, Scale, Rhythm, Collection, Level and the Player's key are pop-ups.
- **Segmented** (a sand track, 4px inset, 12px corners): one value from a few. Unchosen segments are soft ink with no
  fill; the chosen one is a card-paper thumb (11px) in the 1px control line with ink text, Onest 600 16px. Two
  segmented controls whose words could be mistaken for each other name themselves on screen ("Keys play").
- **Switch** (52 by 32px, a sand track in the control line; on: grass): a setting that is on or off.

### Cards and sheets

- **Card** (card paper, 14px, the 1px soft line): grouped rows, the practice card, a settings group (its title on a
  sand band over a 1px line).
- **Continue card:** a card whose Literata title sits on a header band in its step's wash (a song yellow, a chord
  step sand, a scale sky: the same paint as its tile, `STEP_PAINT` in `entities/path`) over a 1px line, then the step's detail
  and the honey pill Continue (beside it from 1024px).
- **Step row:** a 48px tile in its kind's wash, no border, with a 20px icon in its deep shade; the title in Onest 600
  17px; the learned toggle at the end.
- **Row link** (a list row in a grouped card, 64px): a 48px tile in its paint's wash with a 20px icon in its deep
  shade, the title in Onest 600 17px, an optional detail line, and a chevron (the disclosure indicator): Learn's and
  Practice's rows. A titled group of them is a card parted by hairlines.
- **Sheet** (card paper, 20px top, swipe handle, Literata title, scrolling body, optional footer): Setup, quiz choice.
- **Note** (a lesson's callout, a note the learner reads): sand, 14px corners, 16px inset, body text.

### Marks

- **Rating mark:** known is a 16px grass disc with a check; a gap a 10px ochre dot; not checked a 10px ring of the
  control line, 1px.
- **Learned toggle:** a 28px ring of the control line, 1px, in a 44px target; learned fills it grass with a check.
- **Level mark:** four 4px pips rising 6 to 12px, the first ones soft ink, the rest hairline.

### Navigation

Monochrome, so the content keeps the colour. A bar docked along the bottom on phones (card paper, a 1px soft line
above it): four places, Path · Songs · Learn · Practice (Route, Music, BookOpen, Metronome), a 24px icon over an
Onest 500 14px label, both soft ink; the current place fills with sand
under a semibold ink label. From 1024px, a 240px sidebar with a 1px soft line on its right, "Piano Trainer" in
Literata 600 22px at the top, the places as 44px rows (20px icon, 16px label).

### The keyboard (signature)

The whole piano, A0–C8, hung from a light wooden **rail** and scrolling sideways with no bar. The rail runs the
piano's length, drawn 28px at the foot of a 44px strip, and a swipe on it scrolls the keys; its controls stay in view,
44px targets whose ink icons sit in the drawn rail and never reach over a key, focused with the deep-sky ring: **‹ ›**
at its ends move the keys an octave, the **keyboard map** between them (off by default) draws all 88 keys small with
an ink frame round the part in view and dots under the keys marked or down, and the **settings button** at its right
end opens the keyboard settings in a popover beside the keyboard, never over it.

- **Proportions:** a key is 4.2 times as long as a white key is wide, at least 96px and at most 40% of the screen's
  height; the Player's keyboard takes the height its layout gives it. **Key size:** Fit (the range fills the width,
  white keys 28–48px), Large (56px, about an octave on a phone) or Whole piano (all 52 white keys fill the width; no
  ‹ ›, no map, no finger row). It opens centred on the keys that matter and centres again when the size changes.
- **Material:** white keys part by a 1px line of key bed and end in a lip; black keys end in a lighter slope. **Down**
  is physical as well as coloured: a key going down drops 2px and its lip or slope shortens to a third, in 80ms;
  under reduced motion, at once.
- **Touch:** a key sounds and goes down the instant it is touched, and stays down while it is held (a finger, a typed
  key, a MIDI key) and for at least the shortest press, 150ms, so the lightest tap shows; let go, it is plain again,
  however long its sound rings. The keys hold still under a finger. **Scroll** (the default): only the key a finger
  touched sounds; the keyboard scrolls from its rail. **Glissando:** every key a finger slides onto sounds.
- **Faces:** plain; a mark's wash with its label; honey for a quiz's chosen or Name chord's lit keys; crimson for a
  wrong key; a deep-sky ring inside a missing key; and down over all of them. A wrong key wins over a lit one, a lit
  one over a mark, a mark over a selection. **Note names** (C · All · None) put "C4" on every C, or its name on every
  key, drawn smaller than a mark's label, which always wins. The computer keyboard's letters sit on the keys it plays.
- **Finger row:** finger numbers in 20px circles under the keys, in two staggered lines as the keys stand: a black
  key's in the upper line (sky wash), a white key's in the lower (key paper ringed in key bed). Only while a mark
  carries a finger.
- **A mark's caption:** a second, smaller line over a mark's label: in the Scales reference's Chords view each
  degree's key carries its numeral over its chord (`ii` over `Dm`), both 12px, wrapping anywhere on a narrow key.
- **What a key plays:** a key sounds itself unless the screen makes it more: in Chords view a degree's key plays its
  chord, stacked from it, and every key of it is down while the hand holds the key. The keyboard then spans every
  key the chords play (C4 to F5 for C major's triads), so a chord a key plays is in sight on a phone.
- **Spotlight** (the references, a lesson, a Piece's chart): the keys the app puts down are the ones struck last: an
  arpeggio's or a run's key alone, a chord's keys together. Every mark stays; the key played stands out by going
  down, never by hiding the rest.
- **Access:** keys are buttons named by note ("F sharp 4"), one in the tab order, the arrow keys, Home and End walking
  the rest. The focused key keeps its place under its neighbours: its two-tone ring outlines the face a finger
  touches (a black key whole, a white key below the black keys).
- **Every Play becomes Stop** (a square) while its sound plays; in a grid of items (a Piece's bars, a scale's chords)
  the item is pressed instead (sky mist), and a second tap stops it.

### The sheet (the Player)

The piece as it is played, engraved on a grand staff (VexFlow, the Bravura music font) in one line that scrolls
sideways, as Flowkey shows it: ADR 0013.

- **Ink:** notes, rests, clefs, beams and ties in ink; the staff's lines and barlines in the control line
  (`--input`); the staff of the hand not heard or practised in soft ink (hands: right → the bass staff soft). Dark
  mode and increased contrast follow the tokens.
- **Labels over it** (real text): each bar's number (Onest 12px, soft ink, tabular) at its start, a section's name
  after its first bar's number (1 · Verse); each chord symbol at its onset (Literata 600, 17px).
- **The cursor:** a sky-mist band (28px, 10px corners) behind the notes of the beat group now, moved by transform
  (ease-out 200ms; at once under reduced motion). The sheet scrolls itself to keep it a quarter in from the left once
  it leaves the middle half.
- **Bars:** each bar is a button (a 1px control-line ring on hover): a tap jumps to the beat group nearest it, Enter
  or Space to the bar's first.
- **The loop:** a sand band behind its bars, and an umber grip at each end (a 4px line in a 44px slider) dragged over
  bars or moved by the arrow keys, never past the other end.
- **Sizes:** 1 CSS px a unit, 0.7 on a phone on its side; a bar is as wide as its notes need (VexFlow's least × 1.4)
  and its chord symbols need, never under 80 units.
- **Loading** keeps the staff's space, quiet; if the music font cannot load, one line says the music can't be shown,
  and the keys, Play and Wait mode still work.

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
  banner and the slider thumb float).
- **Don't** draw a key that does nothing: every key sounds.
- **Don't** stack a sheet over a sheet; open a list as a page of the sheet.
- **Don't** write how-to paragraphs; the labelled keyboard and the layout teach.
