---
name: Piano Trainer
description: A labelled picture book of the piano. Paper, a warm brown line round every shape, seven gouache paints at one lightness, hand-lettered titles and a printed label on every key, chord and control.
colors:
  paper: '#FBF7EF'
  paper-card: '#FFFCF7'
  sand-sunken: '#F3EADB'
  sand-hairline: '#EADCC9'
  brown-ink: '#3F2816'
  brown-ink-soft: '#735F4F'
  brown-line: '#6D4D37'
  school-bus-yellow: '#EEB737'
  brick-deep: '#B94834'
  sky-mist: '#D8EBFB'
  sky-deep: '#0F68A2'
  grass-deep: '#417230'
  ochre-deep: '#976200'
  crimson: '#A82133'
  white: '#FFFFFF'
  paint-brick: '#E17F6C'
  paint-yellow: '#EEB737'
  paint-grass: '#78B065'
  paint-sky: '#5FA5DE'
  paint-lilac: '#A98ED9'
  paint-sand: '#C79263'
  paint-teal: '#50B0B0'
  wash-brick: '#F6C8BE'
  wash-yellow: '#EFD093'
  wash-grass: '#C3DDBA'
  wash-sky: '#B7D9F7'
  wash-lilac: '#D9CDF4'
  wash-sand: '#EFCDB0'
  wash-teal: '#AAE0DF'
  key-bed: '#A88C77'
  key-rail: '#6A4630'
  key-black: '#362820'
  dusk-ground: '#1B150F'
  dusk-card: '#271F18'
  dusk-sunken: '#332921'
  dusk-hairline: '#473A30'
  dusk-ink: '#F2EADD'
  dusk-ink-soft: '#C0AE9A'
  dusk-line: '#9C8067'
  dusk-key-white: '#ECE7DE'
  dusk-key-black: '#1E130E'
  dusk-key-bed: '#755E4D'
  dusk-key-rail: '#482F1F'
  brick-light: '#EA8470'
  sky-light: '#86BEEE'
  grass-light: '#8EC27D'
  ochre-light: '#E4AC59'
  crimson-light: '#EF7E80'
  sky-night: '#1A3B55'
  sky-night-ink: '#C9E2F7'
typography:
  chord-display:
    fontFamily: 'Balsamiq Sans, Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '72px'
    fontWeight: 700
    lineHeight: 1
  large-title:
    fontFamily: 'Balsamiq Sans, Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '34px'
    fontWeight: 700
    lineHeight: 1.1
  card-title:
    fontFamily: 'Balsamiq Sans, Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '30px'
    fontWeight: 700
    lineHeight: 1.2
  section-title:
    fontFamily: 'Balsamiq Sans, Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '24px'
    fontWeight: 700
    lineHeight: 1.33
  button-label:
    fontFamily: 'Balsamiq Sans, Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '17px'
    fontWeight: 700
    lineHeight: 1.4
  row-title:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '17px'
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '14px'
    fontWeight: 400
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
    backgroundColor: '{colors.school-bus-yellow}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-primary-pill:
    backgroundColor: '{colors.school-bus-yellow}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.button}'
    height: '56px'
    padding: '0 24px'
  button-soft:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-destructive:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.crimson}'
    rounded: '{rounded.button}'
    height: '44px'
    padding: '0 16px'
  button-round:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.pill}'
    size: '44px'
  button-play:
    backgroundColor: '{colors.school-bus-yellow}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.pill}'
    size: '72px'
  chip:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.control}'
    height: '44px'
    padding: '0 16px'
  chip-selected:
    backgroundColor: '{colors.brick-deep}'
    textColor: '{colors.white}'
    rounded: '{rounded.control}'
    height: '44px'
    padding: '0 16px'
  segmented-track:
    backgroundColor: '{colors.paper-card}'
    rounded: '{rounded.button}'
    padding: '4px'
  segmented-selected:
    backgroundColor: '{colors.brick-deep}'
    textColor: '{colors.white}'
    rounded: '{rounded.white-key}'
    height: '44px'
  card:
    backgroundColor: '{colors.paper-card}'
    rounded: '{rounded.card}'
    padding: '20px'
  continue-band:
    backgroundColor: '{colors.paint-sky}'
    textColor: '{colors.brown-ink}'
    padding: '12px 20px'
  step-tile:
    backgroundColor: '{colors.paint-sand}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.button}'
    size: '48px'
  sheet:
    backgroundColor: '{colors.paper-card}'
    rounded: '{rounded.sheet}'
    padding: '12px 20px 24px'
  nav-item:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.control}'
    height: '56px'
  nav-item-active:
    backgroundColor: '{colors.brick-deep}'
    textColor: '{colors.white}'
    rounded: '{rounded.control}'
    height: '56px'
  key-white:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.brown-ink}'
    rounded: '{rounded.white-key}'
  key-black:
    backgroundColor: '{colors.key-black}'
    textColor: '{colors.white}'
    rounded: '{rounded.black-key}'
  key-down:
    backgroundColor: '{colors.paint-sky}'
    textColor: '{colors.brown-ink}'
  key-scale:
    backgroundColor: '{colors.wash-sky}'
    textColor: '{colors.brown-ink}'
  key-scale-down:
    backgroundColor: '{colors.paint-sky}'
    textColor: '{colors.brown-ink}'
  key-tonic:
    backgroundColor: '{colors.wash-yellow}'
    textColor: '{colors.brown-ink}'
  key-tonic-down:
    backgroundColor: '{colors.paint-yellow}'
    textColor: '{colors.brown-ink}'
---

# Design System: Piano Trainer

## Overview

**Creative North Star: "The Labelled Picture Book"**

The app is drawn as a Busytown cross-section (ADR 0010): the keyboard and the chart are cut open, and every key,
chord and control wears its printed name. Paper is the ground, a warm brown line runs round every card, control and
key, and colour comes from one set of seven gouache paints at one even lightness, so any two sit together. Titles,
chord symbols, buttons and tabs are hand-lettered in Balsamiq Sans Bold; everything read in passing is Onest. By night
the paper turns to dusk brown and the paints keep their lightness.

Everything is still read from a phone propped on a piano's music stand, glanced at between chords with both hands on
the keys. The labelled keyboard is the hero: it is on every screen that sounds anything, it plays when tapped, and
every key the app sounds goes down on it (ADR 0009). Density is low and targets are 44px at least. Colour carries
meaning: yellow is the one action, brick red is what is chosen or where you are, grass is learned, deep sky is a link
and focus, amber is a gap, crimson is wrong; the other paints name places and kinds of step.

The book lends its colour, line and labelling only. Not taken: characters, animals or mascots; a kicker label above a
heading; streaks as pressure, upsells, locked content, stock photos; the dark neon piano app and the sage wellness app.

**Key Characteristics:**

- Paper ground, a 2px brown line round every card and control, a 1px line of key bed between the keys.
- One school-bus-yellow action per screen, drawn in the brown line with brown lettering on it.
- Brick red fills only what is chosen or where you are: a chip, a segment, the current tab.
- Seven gouache paints at one lightness, each with a pale wash; a key's mark is its wash at rest and its paint when down.
- Balsamiq Sans Bold for titles, chord symbols, buttons and tabs; Onest for reading.
- One keyboard component everywhere, the whole piano on a painted wooden rail.

## Colors

Warm paper and brown ink, one yellow action, one brick red for the chosen, and a gouache set at one lightness whose
paints mean something wherever they appear.

### Primary

- **School-Bus Yellow** (`school-bus-yellow`, the same by night): the one action on a screen (Continue, Play,
  Practise, Check, Next, Apply), drawn with the brown line and brown ink on it (dusk ground by night). Also the caret,
  the text selection (22%), a quiz's chosen keys and Name chord's lit keys.

### Secondary

- **Brick Deep** (`brick-deep`; night `brick-light` with dusk-ground ink): selected and active only: a pressed chip,
  the chosen segment, the current tab in the bar or sidebar. Never an action, never a paint on the chrome.
- **Sky Mist** (`sky-mist`, ink `sky-deep`; night `sky-night`, ink `sky-night-ink`): the current or playing bar of a chart.

### Tertiary: meaning colours

- **Deep Sky** (`sky-deep`; night `sky-light`): links and every focus ring.
- **Grass Deep** (`grass-deep` with white; night `grass-light` with dusk ground): learned, known, on, connected.
- **Ochre Deep** (`ochre-deep`; night `ochre-light`): attention, the dot of a gap or a "to check" count; never text.
- **Crimson** (`crimson`; night `crimson-light`): wrong and destructive (a wrong key, Reset progress).

### The gouache set

Seven paints at one lightness (`paint-brick`, `paint-yellow`, `paint-grass`, `paint-sky`, `paint-lilac`,
`paint-sand`, `paint-teal`), each with a pale wash (`wash-*`). They stay the same by night.

- **On keys, as chord roles:** root brick, 3rd sky, 5th grass, 7th yellow, 9th lilac, 11th sand, 13th teal: on chord
  tones only (keys, the role legend, a chord's tone chips).
- **On keys, as the Player's hands:** right brick, left lilac, tune grass; the Player only. As text in the note grid a
  hand reads in its deep shade (brick deep, lilac mixed 55% into the brown ink, grass deep; lighter by night).
- **On the chrome, as the book's paints:** sand, yellow, grass, sky and lilac name places and kinds of step: the step
  tiles (chords sand, scale sky, study grass, song yellow, progression lilac), the Continue card's sky header band.
  Each is a midtone fill with the brown ink on it. Their deep shades (ochre, grass, sky and lilac deep; lighter by
  night) colour an icon on paper: the nav's icons (Path grass, Songs yellow, Theory sky) and a level's pips (ochre).
  Brick is never a chrome paint, because brick is what is active; teal is never on the chrome at all.

### The keys

- **Plain keys:** white keys are the card paper (`paper-card`; night `dusk-key-white`, a shade softer), black keys a
  warm black (`key-black`; night `dusk-key-black`), parted by a 1px line of key bed (`key-bed`; night `dusk-key-bed`)
  and hung from a painted wooden rail (`key-rail`; night `dusk-key-rail`). The keys stay paper by night.
- **Marks:** a mark (a role, a hand, a scale's note) is its pale wash at rest and its full paint when its key is down,
  always with the brown ink on it. A scale's notes are sky (wash at rest), its tonic yellow; scales are never role
  coloured.
- **Down:** a plain key down turns sky (`paint-sky`), white and black alike.
- **Other faces:** a quiz's chosen key and Name chord's lit key yellow, a wrong key crimson, a missing key outlined
  in a 3px deep-sky ring inside its edge.
- **Focus:** a two-tone ring, brown ink outside and white inside, so it shows on any key's colour.

### Neutral

- **Paper** (`paper`; night `dusk-ground`): the page.
- **Card Paper** (`paper-card`; night `dusk-card`): cards, sheets, popovers, chips, the soft and round buttons, the nav.
- **Sand** (`sand-sunken`; night `dusk-sunken`): hover and pressed fills, the muted surfaces, slider tracks.
- **Brown Ink** (`brown-ink`; night `dusk-ink`): text. **Soft Brown** (`brown-ink-soft`; night `dusk-ink-soft`):
  secondary text.
- **Brown Line** (`brown-line`; night `dusk-line`): every border, the book's line. **Hairline** (`sand-hairline`;
  night `dusk-hairline`): dividers between rows inside a card, an unfilled pip.

### Named Rules

**The Palette Law.** Role colours appear on chord tones only; hand colours only in the Player; the book's paints on
the chrome name a place or a kind of step and are never a chord tone. Brick red on the chrome means chosen, nothing
else.

**The Wash And Paint Rule.** A mark is its pale wash at rest and its full paint when its key sounds; a plain key down
turns sky. Every mark stays while keys go down, and its label stays on it: colour is never the only cue.

**The One Yellow Rule.** Each screen has exactly one yellow action. A second action beside it is paper drawn in the
line (soft), never a second yellow.

## Typography

**Display Font:** Balsamiq Sans, weight 700 only, Latin and Cyrillic, self-hosted (with Onest behind it)
**Body Font:** Onest Variable, self-hosted (with Noto Music's music subset behind it for 𝄪 and 𝄫, then system-ui)

**Character:** the book's hand-lettering for everything that names (titles, chord symbols, buttons, tabs, segments,
sheet titles), a clear Cyrillic-first grotesque for everything read. `h1` to `h3` are Balsamiq Sans Bold by default.

### Hierarchy

- **Chord Display** (Balsamiq 700, 72px, 1): the chord in the Chords explorer and the Player's chord now (48px on a
  phone on its side).
- **Large Title** (Balsamiq 700, 34px, 1.1; 48px from 1024px): each screen's header, the scale's name (48px).
- **Card Title** (Balsamiq 700, 30px): the Continue card's band, the Player's next chord, the sidebar's name.
- **Section Title** (Balsamiq 700, 24px): section headings, sheet titles, a chord in a chart or a scale's chords.
- **Button** (Balsamiq 700, 17px; the 56px pill 22px): buttons, tabs, segments (16px).
- **Row Title** (Onest 600, 17px, 1.4): step and piece rows.
- **Body** (Onest 400, 16px, 1.5): everything else; notes at most 65ch.
- **Label** (Onest 400–600, 14px and 12px): row subtitles, bar numbers, method notes. Chips set Onest 600 at 16px.
- **Key Label** (Onest 700, 14px for a mark, 12px for a note name, tabular): the degree, finger or note on a key.

### Named Rules

**The One Weight Rule.** Balsamiq Sans ships in one weight and `font-synthesis-weight` is off: never ask it for a
lighter or heavier weight, and never let the browser fake one.

**The Tabular Numbers Rule.** Tempo, bar numbers, counts, key labels and finger numbers are tabular, so a number
that changes in place never shifts its neighbours.

## Layout

Phone first. On a phone a shell screen is one column (up to 48rem) with 16px gutters, clears the notch, and scrolls
over a bar docked along the bottom (112px of bottom padding). From 1024px the bar becomes a 240px lettered sidebar
(the app's name in Balsamiq, then the three places) and the screen takes the width it is given, up to 72rem, with
40px side padding. The Player and the Check are full screen (up to 72rem) with no navigation.

From 1024px each screen arranges itself in two columns with a 40px gap, tops aligned:

- **Songs:** the filters in an 18rem column, the list beside it.
- **Piece:** facts and actions (5 parts) beside the chart (7 parts).
- **Player:** the now panel (2 parts) beside the chart (3 parts), the keyboard below; on a phone on its side, two
  columns over the keyboard.
- **Chords and Scales explorers, Settings:** two equal columns; the Path's steps in two columns inside their card.

Stacks use gap: 24px between a screen's parts, 32px between sections, 16–20px inside a group. The explorers, Symbols
and a Piece's chart pin their keyboard to the top while the page scrolls.

**The Equal Columns Rule.** A chart's lines are grids of equal columns, each line as wide as its bars' share of the
longest line, so bars line up down the chart; a bar is parted by a 2px line and each line closes with one.

## Elevation & Depth

Flat, drawn with line. Depth is the book's: a 2px brown outline and a paper card on a paper ground; hover and press
fill with sand or darken a shade (brightness 95%). Shadows appear only on what floats over the page:

- **Popover** (`shadow-md` with a 1px ring of ink at 10%): the MIDI and keyboard-settings popovers.
- **Floating banner** (`shadow-lg`): the update banner.
- **Slider thumb** (`shadow-md` with a 1px line ring).

Bottom sheets rise over a page dimmed to 10% black and need no shadow.

**The Drawn Not Lifted Rule.** A surface separates by its line, never by a shadow. One exception, on keys only: the
keys' material. The rail casts an 8px shade of ink at 10% onto the keys, a white key ends in a 6px lip of ink at 6%,
a black key in an 8px slope of white at 14%. They draw a piano and appear nowhere else.

## Shapes

Soft book corners from one 12px base: black keys 6px, white keys 9px, small parts 10–11px, buttons, chips, segments
and step tiles 12px, cards 14px, sheets 20px at the top. Round buttons, Play, rating marks, finger circles and pips are
fully round. Keys are square at the top and round only at the bottom. Every card and control carries the 2px brown
line; list rows inside a card part by a 2px hairline.

## Components

### Buttons

Lettered, outlined, and sure of themselves.

- **Shape:** 12px corners, a 2px brown line, Balsamiq 17px; 44px tall, 48px large, a 56px pill for the Continue
  card's action.
- **Primary:** yellow, brown lettering; hover darkens to 95%, press nudges down 1px.
- **Soft / Outline:** card paper in the line, brown lettering: the second action (Arpeggio, Hear these notes).
- **Destructive:** paper with a crimson line and lettering.
- **Link:** Onest 600, deep sky, underline on hover.
- **Round** (44px, paper, the line, 20px icon): close, back, settings, MIDI, Restart; always labelled.
- **Play** (72px circle): the Player's one Play/Stop.
- **Focus:** a 3px deep-sky ring, 2px outside.

### Chips and segments

- **Chip** (44px, 12px corners, paper in the 2px line): a row of roots, families, qualities or keys that scrolls past
  the screen's edge on a phone and wraps from 1024px. Chosen: brick deep with white.
- **Segmented** (a paper track in the line, 4px inset; the chosen segment brick deep with white, Balsamiq 16px): one
  value from a few. The Theory tabs use the same track.

### Cards and sheets

- **Card** (card paper, 14px, the 2px line): grouped rows, the practice card.
- **Continue card:** a card whose title is lettered on a sky header band over a 2px line, then the step's detail and
  the yellow pill Continue (beside it from 1024px).
- **Step row:** a 48px tile in its kind's paint with a brown-line outline and an icon, the title in Onest 600, the
  learned toggle at the end.
- **Sheet** (card paper, 20px top, swipe handle, lettered title, scrolling body, optional footer): Setup, quiz choice,
  reading notes.

### Marks

- **Rating mark:** known is a 16px grass disc with a check; a gap a 10px ochre dot; not checked a 10px ring of line.
- **Level mark:** four 4px pips rising 6 to 12px, the first ones ochre, the rest hairline.

### Navigation

A bar docked along the bottom on phones (card paper, a 2px line above it): three places, icon over Balsamiq label, each
icon in its paint's deep shade; the current place is filled brick deep with white. From 1024px, a 240px sidebar with
a 2px line on its right, the app's name lettered at the top, the places as 48px rows.

### The keyboard (signature)

The whole piano, A0–C8, hung from a painted wooden **rail** and scrolling sideways with no bar. The rail runs the
piano's length, drawn 28px at the foot of a 44px strip, and a swipe on it scrolls the keys; its controls stay in view,
44px targets whose icons sit in the drawn rail and never reach over a key: **‹ ›** at its ends move the keys an octave,
the **keyboard map** between them (off by default) draws all 88 keys small with a frame round the part in view and
dots under the keys marked or down, and the **settings button** at its right end opens the keyboard settings in a
popover beside the keyboard, never over it.

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
- **Faces:** plain; a mark's wash with its label; yellow for a quiz's chosen or Name chord's lit keys; crimson for a
  wrong key; a deep-sky ring inside a missing key; and down over all of them. A wrong key wins over a lit one, a lit
  one over a mark, a mark over a selection. **Note names** (C · All · None) put "C4" on every C, or its name on every
  key, drawn smaller than a mark's label, which always wins. The computer keyboard's letters sit on the keys it plays.
- **Finger row:** finger numbers in 20px circles under the keys, in two staggered lines as the keys stand: a black
  key's in the upper line (sky wash), a white key's in the lower (key paper ringed in key bed). Only while a mark
  carries a finger.
- **Spotlight** (the explorers, Symbols, a Piece's chart): the keys the app puts down are the ones struck last: an
  arpeggio's or a run's key alone, a chord's keys together. Every mark stays; the key played stands out by going
  down, never by hiding the rest.
- **Access:** keys are buttons named by note ("F sharp 4"), one in the tab order, the arrow keys, Home and End walking
  the rest. The focused key keeps its place under its neighbours: its two-tone ring outlines the face a finger
  touches (a black key whole, a white key below the black keys).
- **Every Play becomes Stop** (a square) while its sound plays; in a grid of items (a Piece's bars, a scale's chords)
  the item is pressed instead, and a second tap stops it.

### Motion

One ease-out, `cubic-bezier(0.22, 1, 0.36, 1)`: 200ms on colour changes, 80ms on keys. Sheets rise on their own
exponential ease-out. Under reduced motion every transition is instant.

## Do's and Don'ts

### Do:

- **Do** give each screen exactly one yellow action, drawn in the brown line with brown lettering.
- **Do** draw every card and control in the 2px brown line on paper.
- **Do** show every sound on a keyboard: a key that sounds goes down, a mark from its wash to its full paint.
- **Do** label every coloured key with its degree, finger or note.
- **Do** letter titles, chord symbols, buttons and tabs in Balsamiq Sans Bold, and read everything else in Onest.
- **Do** keep targets at 44px and focus rings visible (3px, deep sky).
- **Do** set numerals that change in place in tabular figures.

### Don't:

- **Don't** draw characters, animals or mascots: the book lends its colour, line and labelling only.
- **Don't** put a kicker or eyebrow label above a heading; the heading and the labels on the things themselves are
  enough.
- **Don't** use brick red on the chrome for anything but what is chosen or where you are.
- **Don't** colour chrome with a chord role or a hand colour, or put a chrome paint on a chord tone.
- **Don't** lift a surface with a shadow; draw it with the line (only popovers, the update banner and the slider
  thumb float).
- **Don't** ask Balsamiq Sans for any weight but 700.
- **Don't** draw a key that does nothing: every key sounds.
- **Don't** stack a sheet over a sheet; open a list as a page of the sheet.
- **Don't** write how-to paragraphs; the labelled keyboard and the layout teach.
