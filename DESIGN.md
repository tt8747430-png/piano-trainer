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
  button-soft:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
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
  row-link:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.headline}'
    height: '64px'
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
  sheet:
    backgroundColor: '{colors.paper-card}'
    rounded: '{rounded.sheet}'
    padding: '12px 20px 24px'
  key-white:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.key-label}'
    rounded: '{rounded.white-key}'
  key-black:
    backgroundColor: '{colors.key-black}'
    textColor: '{colors.white}'
    rounded: '{rounded.black-key}'
---

# Design System: Piano Trainer

The look of the app: what each colour, face, line and surface means, and how the shared components wear them. The
values live in `src/styles/tokens.css` (colours) and `src/styles/theme.css` (type, radii, utilities); the front
matter above mirrors them for design tools. How code uses them is [CODE_STYLE](docs/CODE_STYLE.md) §5, §11 and §12.
Why the look is this way is in the ADRs (`docs/adr/`, index in its README).

## Overview

**North star: a labelled picture book of the piano, printed quietly.** The keyboard and the music are cut open and
every key, chord and control wears its printed name. Warm paper for the page, a lighter paper for the cards on it, a
soft 1px line round every card and control, and seven paints faded to one even lightness so any two sit together.
Titles and chord symbols are set in a book serif; everything read and every control in a sans.

The app is read from a phone on a piano's music stand, glanced at between chords with both hands on the keys. The
labelled keyboard is the hero: on every screen that sounds anything, it plays when tapped, and every key the app
sounds goes down on it. Density is low and targets are 44px. Colour carries meaning, so it is spent sparingly.

Not this: mascots, kicker labels over headings, streaks as pressure, upsells, the dark neon piano app.

## Colour

Each colour is a semantic token with a light and a dark value, and a firmer value under `prefers-contrast: more`.

| Token                             | Day → night              | Means                                                                     |
| --------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `background`                      | paper → dusk ground      | the page, a shade darker than the cards                                   |
| `card`, `popover`                 | card paper → dusk card   | cards, sheets, popovers, controls at rest                                 |
| `raised`                          | card paper → a step up   | what floats over the page (floating buttons, the transport)               |
| `muted`, `accent`                 | sand → dusk sunken       | hover and pressed fills, segment tracks, the current place, slider tracks |
| `foreground` / `muted-foreground` | ink / soft ink           | text / secondary text, the nav's icons                                    |
| `primary`                         | honey → a step lower     | **the one action**; also the text caret and selection                     |
| `selected`                        | umber → dusk muted       | the check on a chosen item; never an action                               |
| `chosen`                          | card paper → dusk line   | the chosen segment on its muted track                                     |
| `secondary`                       | sky mist → sky night     | the secondary button, a pressed grid item                                 |
| `link`, `ring`                    | deep sky → light sky     | links, focus, what is chosen on the music                                 |
| `learned`                         | grass deep → grass light | learned, known, on, connected                                             |
| `attention`                       | ochre                    | a gap or "to check": a dot, never text                                    |
| `destructive`                     | crimson                  | wrong and destructive                                                     |
| `border` / `input` / `hairline`   | soft / control / sand    | 1px round a card / 1px round a control (3:1) / a divider inside a card    |
| `paint-*` / `on-paint-*`          | wash / deep shade        | the chrome's paints: a place's or a kind's tint and the icon on it        |
| `role-*`, `hand-*`, `key-*`       | below                    | the keys                                                                  |

### The paints

Seven paints at one lightness: brick, yellow, grass, sky, lilac, sand, teal. Each has a pale wash; five have a deep
shade for an icon on their wash. They mean one thing each, by where they appear:

- **Chord roles, on chord tones only** (keys, the role legend, a chord's tone chips): root brick, 3rd sky, 5th
  grass, 7th yellow, 9th lilac, 11th sand, 13th teal.
- **The Player's hands, in the Player only:** right brick, left lilac, a single staff grass.
- **The chrome, as washes:** sand, yellow, grass, sky and lilac name places and kinds of step, always as the wash
  with the deep shade on it. Steps: chords sand, scale sky, study grass, song yellow, progression lilac. A song's
  sections: intro and ending sand, verse sky, chorus grass, bridge lilac, the rest yellow. Brick and teal never
  appear on the chrome.

### Harmony

A progression's chips say what each chord does, in three of the chrome's paints, each its wash with its deep shade at
rest and its full paint with ink on it while its chord sounds (`--paint-full-*`, `--on-paint-full`), as a mark's key
does:

- **Function:** tonic grass, subdominant sand, dominant lilac; the line under the numeral `T`, `S`, `D`.
- **Root motion:** a 5th down lilac, a 3rd down sand, a 2nd up grass (the strong moves, as the theory book colours
  them); the moves the other way (`↑5 ↑3 ↓2`) sand-neutral. A legend card names the four.

A chip is a 56px tile in one even grid: one row, or two rows of half where one would crowd (more than six on a phone,
more than eight wider). These paints mean a function or a move only on a progression's chips and their legend.

### The keys

- White keys are card paper (softer by night, never glaring in a dim hall), black keys a warm black, parted by a 1px
  key bed and hung from a light wooden rail.
- **A mark** (a role, a hand, a scale's note) is its wash at rest and its full paint while its key sounds, with ink
  on it. The wash is mixed into the key's own paper (`--mark-wash`: 35% by day, 50% by night, stronger under
  increased contrast). A scale's notes are sky, its tonic yellow.
- **Down:** a plain key down turns sky. A quiz's chosen keys are honey, a wrong key crimson with ✕, a missing key a
  deep-sky ring inside its edge. A wrong key beats a lit one, a lit one a mark.
- **Focus:** a two-tone ring, ink outside and white inside, so it shows on any key.
- **Voices:** a four-voice chord's keys carry S A T B in their chord tone's colour; the key a voice left keeps its
  letter at 40%, the key plain.

### Colour rules

- **One honey.** Each screen has exactly one honey action, borderless, ink on it: the only control filled with a
  colour. A second action beside it is soft (card paper in the control line).
- **Chosen is neutral.** A pop-up checks its value in umber; a segment is a card-paper thumb on a sand track; the
  current place fills with sand. Never a paint.
- **The palette law.** Role colours only on chord tones, hand colours only in the Player, chrome paints only as
  washes naming a place or a kind. Brick means the root and the right hand, nothing else.
- **Colour is never the only cue.** A coloured key always shows its degree, finger or note; a mark stays while keys
  go down.
- **Every quiet value has a firm one** under `prefers-contrast: more`: secondary text, lines, the key bed and the
  marks' wash step up.
- **The navigation is monochrome**, so the content keeps the colour.

## Type

Two variable faces, self-hosted, neither faking a bold (`font-synthesis-weight: none`):

- **Literata** (`font-display`), a book serif, at 600: every `h1`–`h3` and every chord symbol. Never on a control, a
  tab or a key label.
- **Onest** (`font-sans`): everything read and every control.
- **Text Accidentals** sits behind both for ♭ ♮ ♯ 𝄪 𝄫, set to stand by the capitals and weigh like the semibold
  letters. Every chord symbol on screen is printed with them (`C♯m7`).

The scale follows a phone's text styles in rem, so it grows with the reader's text size. It uses Tailwind's names:

| Style       | Size    | Class       | Used for                                                                 |
| ----------- | ------- | ----------- | ------------------------------------------------------------------------ |
| Chord       | 72      | `text-7xl`  | the chord shown in Chords and the Chord finder (44 past five characters) |
| Display     | 44      | `text-5xl`  | a screen's title from 1024px                                             |
| Large title | 34      | `text-4xl`  | a screen's title from 640px                                              |
| Title 1     | 28      | `text-3xl`  | a screen's title on a phone                                              |
| Title 2     | 22      | `text-2xl`  | section and sheet titles; a screen's title on a phone on its side        |
| Title 3     | 20      | `text-xl`   | a group's title, a card's name                                           |
| Headline    | 17      | `text-lg`   | a row's title (Onest 600), the pill button                               |
| Control     | 16      | `text-base` | buttons, values, segments (Onest 600)                                    |
| Body        | 16      | `text-base` | everything else; prose at most 65ch                                      |
| Label       | 14 / 12 | `text-sm`   | row details, a field's name in soft ink, bar numbers                     |
| Key label   | 14 / 12 |             | a mark's degree or finger (700) / a note name, tabular                   |

Numbers that change in place (tempo, counts, bar numbers, fingers, times) are `tabular-nums`. Settings can make
every screen's title smaller (`data-titles='small'`).

## Layout

- **Phone first; every screen takes the width it is given.** No screen is capped. The gutter grows with the width:
  16px on a phone, 24px from 640px, 40px beside the sidebar (`px-gutter`).
- **Grids, not columns:** lists are row cards, as many 18rem columns as fit (`grid-cards`); a page's fields as many
  20rem columns as fit (`grid-fields`); chord buttons `grid-chords`. Rows and grids stay even on wide screens.
- **Stacks use gap:** 24px between a screen's parts, 32px between sections, 16–20px inside a group.
- **The shell:** on a phone the places are a bar docked along the bottom; on a phone on its side a rail down the
  left; from 1024px a 256px sidebar (72px of icons collapsed, each named in a tooltip). Learn, Songs and Practice,
  with Search and Settings.
- **Full screens** (the Player, the score editor, the Check) have no navigation: the viewport's height, scrolling
  inside.
- **A page that shows a thing on the keys** reads top to bottom: the keys pinned (top or foot, as the keyboard
  settings say), what it is with its one honey Play, its choices as fields, then its titled sections. No page splits
  into two columns of unrelated things.
- **Floating things float.** The transport, the floating buttons and the zoom buttons take no layout room; the page
  gets scroll room under them. Over music they step aside while it is read and come back at a tap.
- **The editor's palette docks, as Flat's.** From 48rem across a panel at the sheet's left (card paper, a hairline at
  its right, reaching the screen's edge), its sections an accordion of 48px rows parted by hairlines, and over the
  sheet the note-entry toolbar, its keys 40px glyphs in a sand pill. On a phone held upright a sheet at the foot,
  card paper with 24px top corners and a soft upward shade, its grab handle 40×4, its category tabs glyphs in a sand
  pill, the chosen on a card-paper thumb. Keys are square cells of a bordered table (a 12px outer radius, hairlines
  between cells, 44px at the least); pressed, a sky glyph on a sky wash; greyed at 35%. A key draws the sign the
  score prints: a tuplet its bracket round the count, a bar repeat its slash between dots, a multi-bar rest its
  H-bar, a line its dashed bracket with `15ma` or a wavy glissando; a group of keys whose effect needs a word says it
  in the ⓘ beside the group's name, never on the key.
- **Equal columns.** A chart's lines are grids of equal beats so bars line up down the page; a score's lines are
  justified to their share of the longest line. Layouts are named as notation apps name them: Page view, Vertical
  scroll, Panorama.

## Surfaces and depth

Flat and grouped. A card separates by its lighter paper and a 1px soft line (`card` utility), never by a shadow.
Hover and press fill with sand or darken a shade.

Shadows only on what floats over the page:

- **Popovers:** `shadow-md` with a 1px ring of ink at 10%.
- **Floating controls** (the floating buttons, the transport, a dial's card): `bg-raised` with a layered shade,
  `elevation-1` for resting second actions, `elevation-2` for the main action and the transport, `elevation-3` under a
  pointer or for an open dial. Deeper by night.
- **Sheets** rise over a page dimmed to 10% black and need no shadow.

The keys' material is the one exception: the rail casts an 8px shade onto the keys, a white key ends in a lip, a
black key in a lighter slope. They draw a piano and appear nowhere else.

## Shapes

One 12px base (`--radius`): black keys 6px (`rounded-xs`), white keys 9px (`sm`), small parts 10–11px (`md`, `lg`; a
segment's thumb), buttons, controls and tiles 12px (`xl`, `2xl`), cards 14px (`3xl`), sheets 20px at the top (`4xl`).
Round buttons, Play, marks and pips are full circles. Keys are square at the top, round at the foot. Every line is
1px; only focus rings and the keys' rings are wider.

## Components

### Buttons

- **Sizes:** 44px (default), 48px (`lg`), a 56px pill for a primary action that stands alone, a 72px round Play.
  12px corners, Onest 600 16px. Icon-only buttons are 44px with a 20px icon.
- **Variants** (`primitives/button.tsx`): `default` honey; `soft` / `outline` card paper in the control line (the
  second action); `secondary` sky mist; `ghost` no fill until hovered; `destructive` card paper with a crimson line
  and label; `link` deep sky; `tool` a toolbar's button, no frame until hovered, open or pressed.
- **Round** (`RoundButton`, `RoundLink`): 44px circles for close, back, settings, More.
- **Floating** (`Fab`, `SpeedDial`): the main action 56px, a second 48px, each its icon alone unless the learner asks
  for names. A dial opens as a card of 48px rows over a page dimmed to half.
- **Every Play becomes Stop** (a square) while it sounds; an item in a grid is pressed instead (sky mist).
- **Focus:** one ring for every control, 3px deep sky, 2px outside, inset only where a scroller would cut it.

### Choices

Five or fewer short nouns are a segmented control; more, or longer, a pop-up button; on or off a switch; a picture
where it says it faster. A setting is never hidden behind a pop-up when it fits in sight.

- **Segmented** (`Segmented`): a sand track, 4px inset; unchosen segments soft ink, the chosen a card-paper thumb in
  the control line. Two that could be mistaken for each other name themselves on screen (`NamedSegmented`).
- **Pop-up button** (`Dropdown`): 44px, card paper in the control line, its label in soft ink and its value in ink,
  an up-down chevron. Its list is a popover of 44px items, the chosen checked in umber; groups named in soft ink over
  a hairline. `MultiDropdown` checks several. Under a field's printed name it is `bare`, its value alone.
- **Toggle chips** (`ToggleChips`): several of a few, all in sight; on is ink on sand in an ink line.
- **Toggle tiles** (`ToggleTile`, `PictureTiles`): an icon or a drawing over its name; on, the learned wash.
- **Strip** (`StepStrip`): one of many in a row that scrolls inside a sand track, ‹ and › at its ends, the chosen a
  card-paper thumb kept in the middle, the edges fading; a greyed option stays in the row. A chord's quality and a
  scale's kind are strips.
- **Note, key and inversion choices** (`NoteChoice`, `KeyChoice`, `InversionChoice`): a strip of spellings, C C♯ D♭
  D … B, both names of a black key side by side; the tonic's strip, only keys a signature writes, then Major ·
  Minor; an inversion as its stack of noteheads.
- **Switch:** a sand track in the control line; on, grass.
- **Only what applies is offered.** A choice the thing cannot take is left out. A greyed choice says why in its
  tooltip.
- **Chord names in text** (`ChordText`): the root in soft ink, the quality strong, its numbers raised (`C maj⁷`), a
  bass after a slash soft again: a library card's chips, the key's chords linked to Chords.
- **Tabs** (`tab-strip`, `tab`): the views of one thing under the screen's title, 48px, the chosen in ink over an ink
  underline, scrolling sideways with faded edges.

### Rows, cards and sheets

- **Card** (`card`): card paper, 14px, the soft line. A settings group's rows part by hairlines (`SettingRows`).
- **Row link** (`RowLink`, 64px): a 48px tile in its paint's wash with a 20px icon in the deep shade (or a number in
  Literata), the title in Onest 600 17px on up to two lines, a one-line detail, what it carries at its end and a
  chevron. Each row card is the link: hover fills the whole card and nudges the chevron. A row that opens a sheet
  (`RowButton`) has no chevron. A list of one kind goes without tiles. A row that opens a setting's own screen
  shows the setting's value at its right before the chevron (`value`, muted, cut short before the title is):
  Settings' "MIDI keyboard Off ›".
- **Settings group** (`SettingsGroup`): a card with its title in a muted band across the top and its ⓘ beside it;
  a list of choices or a row link inside it runs to the card's edges (`flush`). A switch greyed for a reason says it
  in a muted line under its label ("Needs MIDI input"), never hidden.
- **Fact card** (`FactCard`): an icon over a fact's name over its value; three across (Key · Time · Tempo).
- **Library card** (Progressions): its numerals as the title, name · chord count in soft ink, its character in a
  line, chips of the numeral (small, soft) over the chord; a round paper Play at its top right. While it plays its
  line turns honey and the sounding chip takes the selected wash; the card shown wears a darker line.
- **Interval row** (Intervals): the short name in soft ink, the name over its semitones, a small `KeyDiagram` at its
  end; two columns from 48rem. The row playing takes the selected wash.
- **Hand drawing** (`HandDiagram`): a hand palm down in sand, each finger numbered in an ink dot, thumb 1 to little
  finger 5, the right hand's thumb at the left; beside it the run's notes over that hand's fingers.
- **Sheet** (`Sheet`): card paper, 20px top corners, a grab handle, its Literata title with Close, a scrolling body,
  an optional footer over a hairline. It stands on the phone's keyboard. Never a sheet over a sheet: open a list as a
  page of the sheet.
- **Drop zone** (`SongDrop`, a laptop's): while a file is dragged over the library, a panel inset 16px over the page,
  its 2px dashed honey border on the page's paper at 90%, an upload icon over one line of what dropping does.
- **A trainer's setup** (`TrainerSetup`, at most 672px wide): the drill as a segmented control of pictures over
  their names, then titled cards of `SettingRows` (Options, Timing): a pop-up button at a row's right, a list as a
  row with "2 of 41 ›" opening a sheet of check rows by group, switches; a muted card with an ⓘ saying the drill in a
  sentence; one full-width Start pill (its own width from 640px).
- **A round** (`TrainerBoard`): the prompt, a time limit as a thin primary bar running down with its seconds, the
  staff (a muted card with a "?" while hidden, the same size, so nothing moves on Reveal), the keys, the answers, and
  one primary pill in one place from the round's start to its Next: Reveal on a card, Check on a build, Next greyed
  until answered. Clear and Show answer are link-ink words beside it.
- **A lesson's cards:** a note on sand; a rule on a card (`card`), its name in Literata 600 over soft ink; a
  section's takeaway on the lilac wash, "In short" in the deep shade over one Literata 600 sentence. Variants are
  `ChoiceChips` (one of a few, wrapping, the chosen ink on sand in an ink line), or a segmented switch for two.
- **A lesson on a phone** reads a page a section: the floating bar holds ‹, the pages' dots (the one read a 20px
  capsule, the rest 8px dots in the line colour; tapping them opens the contents) and Next, honey, Done on the last.
- **Progress ring** (`ProgressRing`): an arc in the stage paint's deep shade round a lesson's node or number, over a
  hairline track, as its sections are read; none once learned or where Continue's honey ring stands.
- **Popover:** 12px corners, the popover shade. An `InfoTip` is a 16px ⓘ in soft ink beside a name, opening a
  popover; no line of explanation stands under a control.
- **Toast** (`say`): a card with the highest shade over the screen's foot, clear of all that floats there: its line,
  Undo in link ink and ✕; gone in five seconds.

### Marks

- **Rating:** known a 16px grass disc with a check; a gap a 10px ochre dot; not checked a 10px ring.
- **Learned:** a 20px grass disc with a white check (`LearnedBadge`); the learned toggle a ring that fills grass.
- **Stage:** four pips rising 6 to 12px, the reached ones soft ink, the rest hairline (`RankMark`).
- **Progress:** a 6px grass bar on a sand track, its count in soft ink (`ProgressMeter`).

### Navigation and the screen's bar

- **Places** (tab bar, rail, sidebar): a 24px icon over an Onest 500 14px label in soft ink (a 20px icon beside a
  16px label in the sidebar); the current place sand in a soft line under a semibold ink label.
- **The screen's bar** (`ScreenHeader`): Back, the title in Literata, the actions; a page's tabs its second row. It
  stays until the page scrolls past it, slides away while reading down and returns the moment the page turns up;
  what is pinned under it slides with it. With three or more actions on a phone, the title goes under them.

### The keyboard

The whole piano, A0–C8, hung from a wooden **rail** and scrolling sideways with no bar.

- **Proportion:** a key is 4.4 times as long as a white key is wide on every screen, at least 96px and at most 32%
  of the screen's height (22% on a phone on its side). **Key size:** Whole piano, Fit or Large.
- **The rail's controls** are pictures, none behind a button, each a 44px target named in its tooltip: the keyboard
  map, ‹ ›, zoom, note names, typing, then the MIDI sound, glissando and pedal. A toggle on fills its chip in ink. A
  rail too short drops ‹ › and then the map.
- **Down is physical:** a key drops 2px and its lip shortens in 80ms (at once under reduced motion). It sounds the
  instant it is touched, holds while held, and stays down at least 150ms so the lightest tap shows.
- **Access:** keys are buttons named by note ("F sharp 4"), one in the tab order, the arrows walking the rest.

### The music

- **Sheet music** is engraved by Verovio, every colour `currentColor` from the tokens: notes in ink, staff lines and
  barlines in the control line, a staff not practised in soft ink. Over each line a row of labels (bar number,
  section, tempo in Onest 12px soft ink; chord symbols in Literata 600).
- **What is chosen is coloured, never boxed:** notes in the selection colour, a range or the loop a light band of
  it. The playhead and the caret are one thin line of it across the staves in sight. Empty staff chooses nothing.
- **Chord views:** beat cells on card paper (a hairline between beats, a 2px ink barline before a bar, the beat
  sounding filled with ink); chips of a symbol on a sand wash, ink while they sound; a chord diagram (`KeyDiagram`)
  drawn on F3–B4 as the app's keys, a dot on each key held. The line playing is ink and semibold, the rest soft ink.

## Motion

- One curve, `ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`): 200ms for colour, 80ms for keys. Sheets rise on the iOS
  sheet curve (`cubic-bezier(0.32, 0.72, 0, 1)`, 450ms) and follow the finger mid-swipe.
- The keys fold into their button and back through a view transition (`morph`, 340ms).
- Strips and diagrams move on their own; the page does not. Only `transform` and `opacity` animate.
- Under reduced motion every transition is instant.

## Do and don't

- **Do** give each screen one honey action; part cards by surface and a 1px line; show the chosen in neutrals;
  label every coloured key; set titles and chord symbols in Literata 600 and everything else in Onest; keep targets
  44px and focus visible; give every quiet value a firm one.
- **Don't** fill a second control with colour; show the chosen in a paint; colour the navigation; put a chord role
  or a hand colour on the chrome; put a chrome paint at full strength on the chrome; set a control in the serif;
  draw a 2px line round a card or lift a card with a shadow; draw a key that does nothing; stack a sheet on a sheet;
  write how-to paragraphs.
