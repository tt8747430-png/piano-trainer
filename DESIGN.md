---
name: Piano Trainer
description: A labelled picture book of the piano, printed quietly.
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
    lineHeight: 1
rounded:
  black-key: '6px'
  white-key: '9px'
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
    rounded: '{rounded.control}'
    height: '44px'
    padding: '0 16px'
  button-soft:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    height: '44px'
    padding: '0 16px'
  button-destructive:
    backgroundColor: '{colors.paper-card}'
    textColor: '{colors.crimson}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
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
    backgroundColor: '{colors.soft-line}'
    textColor: '{colors.ink}'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
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

The look of the app: what each colour, face, line and surface means, and how the shared components wear them. Values
live in `src/styles/tokens.css` (colours) and `src/styles/theme.css` (type, corners, utilities); the front matter
mirrors them for design tools. Code rules are in [CODE_STYLE](docs/CODE_STYLE.md), reasons in ADRs 0011 and 0061. Every
piece is shown in the Admin area's Components.

## Overview

**Creative North Star: "A labelled picture book of the piano, printed quietly"**

The keyboard and the music are cut open, and every key, chord and control wears its printed name. Warm paper for the
page, a lighter paper for the cards on it, a soft 1px line round every card and control, and seven paints faded to one
even lightness so any two sit together. Titles and chord symbols are set in a book serif; everything read and every
control is in a sans.

The app is read from a phone on a music stand, glanced at between chords with both hands on the keys, and written in
on a laptop. The labelled keyboard is the hero: on every screen that sounds anything it plays when touched, and every
key the app sounds goes down on it. Density is low, targets are 44px, and colour carries meaning, so it is spent
sparingly. These screens are Operate surfaces (lessons and How to use are Read): precision and restraint, patterns the
learner already knows.

Not this: mascots, kicker labels over headings, the dark neon piano app.

**Key Characteristics:**

- Two papers and a 1px line do the work a shadow does elsewhere.
- One honey control per screen; the chosen is neutral.
- Every paint means one thing, by where it appears.
- A book serif for names, a sans for reading and acting.
- Floating things float, and nothing jumps.

## Colors

Warm neutrals and seven quiet paints. Each role has a day value, a night value and a firmer value under
`prefers-contrast: more`. Components use roles, never primitives.

### Primary

- **Honey** (`primary`): the one action; also the text caret and selection. A step lower by night, so it never glares
  in a dim hall.

### Secondary

- **Sky Mist** (`secondary`): the secondary button, a pressed grid item.
- **Deep Sky** (`link`, `ring`): links, focus, what is chosen on the music.

### Tertiary

- **Grass Deep** (`learned`): learned, known, on, connected.
- **Ochre** (`attention`): a gap or "to check"; a dot, never text.
- **Crimson** (`destructive`): wrong and destructive.

### Neutral

- **Paper** (`background`): the page, a shade darker than the cards on it.
- **Card Paper** (`card`, `popover`, `raised`): cards, sheets, popovers, controls at rest, what floats.
- **Sand** (`muted`, `accent`): hover and pressed fills, tracks.
- **Soft Line** (`border`, `chosen`): 1px round a card, and the one selected fill, a step darker than hover.
- **Control Line** (`input`): 1px round a control, firm enough to find it (3:1).
- **Hairline** (`hairline`): a divider inside a card.
- **Ink, Soft Ink** (`foreground`, `muted-foreground`): text, secondary text, the navigation's icons.
- **Umber** (`selected`): the check on a chosen item; never an action.

### The paints

Brick, yellow, grass, sky, lilac, sand and teal, each with a pale wash; five have a deep shade for an icon on the wash.

- **Chord tones only** (keys, the legend, a chord's chips): root brick, 3rd sky, 5th grass, 7th yellow, 9th lilac, 11th
  sand, 13th teal.
- **The Player's hands only:** right brick, left lilac, a single staff grass.
- **The chrome, always as a wash with its deep shade on it:** steps are chords sand, scale sky, study grass, song yellow,
  progression lilac; a song's sections are intro and ending sand, verse sky, chorus grass, bridge lilac, the rest
  yellow. Brick and teal never appear on the chrome.
- **A progression's roles** (`RoleChips`): home grass, away sand, tension lilac; its wash at rest, full paint with ink
  while its chord sounds. These paints mean a role on that row and its legend alone.

### Named Rules

**The One Honey Rule.** Each screen has exactly one honey control, borderless, ink on it. A second action beside it is
soft: card paper in the control line.

**The Neutral Choice Rule.** What is chosen wears the chosen fill or an umber check, never a paint, so colour keeps
meaning something. The navigation is monochrome for the same reason.

**The Palette Law.** Role colours sit on chord tones, hand colours in the Player, chrome paints as washes naming a place
or a kind. Brick means the root and the right hand, nothing else.

**The Second Cue Rule.** Colour is never the only cue: a coloured key always shows its degree, finger or note.

## Typography

**Display Font:** Literata Variable (with Text Accidentals, Noto Music, Georgia)
**Body Font:** Onest Variable (with Text Accidentals, Noto Music, system-ui)
**Label/Mono Font:** Noto Music, for a music sign that stands alone

**Character:** a book serif for what is named, a clear sans for what is read and pressed, both covering Latin and
Cyrillic. Neither face has ♭ ♮ ♯, so Text Accidentals sits behind both, drawn to stand by the capitals.

### Hierarchy

Sizes are in rem, so they follow the reader's text size. A screen's title steps down with the width.

- **Chord** (600, 72px, 1): the chord shown in Chords and the Chord finder; 44px past five characters.
- **Display** (600, 44px, 1.1): a screen's title from 1024px.
- **Large title** (600, 34px, 1.15): a screen's title from 640px.
- **Title 1** (600, 28px, 1.2): a screen's title on a phone.
- **Title 2** (600, 22px, 1.3): section and sheet titles; a screen's title on a phone on its side.
- **Title 3** (600, 20px, 1.25): a group's title, a card's name.
- **Headline** (Onest 600, 17px, 1.375): a row's title, the pill button.
- **Control** (Onest 600, 16px, 1.5): buttons, values, segments.
- **Body** (Onest 400, 16px, 1.5): everything else; prose at most 65ch.
- **Label** (Onest 500, 14px or 12px): row details, a field's name in soft ink, bar numbers.
- **Key label** (Onest 700, 14px or 12px): a mark's degree or finger; a note name, tabular.

### Named Rules

**The Serif Names Rule.** Literata at 600 sets every `h1`–`h3` and every chord symbol. It never sets a control, a tab or
a key label.

**The Printed Chord Rule.** A chord on screen is printed (`C♯m7`). What is stored, typed or put in a URL stays ASCII.

**The Still Numbers Rule.** Numbers that change in place (tempo, counts, bars, fingers, times) are tabular. Neither face
fakes a bold.

## Layout

Phone first, and every screen takes the width it is given; no screen is capped. The gutter grows with the width: 16px
on a phone, 24px from 640px, 40px beside the sidebar.

- **Grids, not columns:** row cards in as many 18rem columns as fit (`grid-cards`), fields in 20rem (`grid-fields`),
  chord buttons in `grid-chords`, tiles in `grid-tiles`. Rows and grids stay even on wide screens.
- **Rhythm:** 24px between a screen's parts, 32px between sections, 16–20px inside a group, with `gap`.
- **The shell:** four places in a bar docked at the foot of a phone, a rail down the left of a phone on its side, a
  256px sidebar from 1024px (72px collapsed), as Claude's: the name and its toggle, Search as a field, Learn, Songs
  and Practice, Recents (the songs opened last), and under a line the learner (picture and name, opening the
  Profile) with Settings' gear beside it. The phone's bar keeps the Profile as its last tab. The phone's bar shows on the places
  alone; what a place opens has the whole height.
- **Full screens** (the Player, the score editor, the Check) have no navigation: the viewport's height, scrolling
  inside.
- **A page that shows a thing on the keys** reads top to bottom: the keys pinned, what it is with its one Play, its
  choices, then its titled sections. No page splits into two columns of unrelated things.
- **Settings:** one column of grouped cards on a phone, each page pushed with Back; from 64rem the libraries' two
  panes: a sidebar of tree rows (17rem, a painted swatch each, sticky under the bar and scrolling on its own) beside
  the page (44rem), which scrolls with the window. Never two columns of unequal groups.
- **The editor's palette docks:** from 48rem a panel at the sheet's left with the note-entry toolbar over the sheet; on a
  phone held upright a sheet at the foot.
- **Equal columns:** a chart's lines are grids of equal beats; a score's lines are justified to their share of the
  longest line. Layouts are named Page view, Vertical scroll and Panorama.

**The Floating Rule.** The transport, the floating actions and the zoom buttons take no layout room; the page gets
scroll room under them, and over music they step aside while it is read.

**The Still Screen Rule.** Nothing jumps. Controls hold their place between the Player and the editor and on entering
Select; what floats is measured before first paint; a score being engraved keeps its old drawing until the new one is
whole.

## Elevation & Depth

Flat and grouped. A card separates by its lighter paper and a 1px soft line, never by a shadow; hover and press fill
with sand. Shadows belong to what floats over the page, and they are soft, layered and deeper by night.

### Shadow Vocabulary

- **Elevation 1** (`elevation-1`): resting second actions.
- **Elevation 2** (`elevation-2`): the main action and the transport.
- **Elevation 3** (`elevation-3`): under a pointer, or an open dial.
- **Popover** (`shadow-md` with a 1px ring of ink at 10%): popovers and menus.

Sheets rise over a page dimmed to 10% black and need no shadow.

**The Piano Exception Rule.** The keys' light and shade (`key-face-*`), the felt strip, the case's shade, a white key's
lip and a black key's slope draw a piano and appear nowhere else.

## Shapes

One scale of four corners, and a corner is never written any other way (`src/styles/shapes.test.ts`): a control 12px, a
card 14px, a sheet 20px, a pill round. Every line is 1px; only focus rings and the keys' rings are wider.

Something inside a shape takes its holder's shape, so a fill reaches the edges: an item in a capsule is a pill, the first
row of a card takes the card's corner. The keys are drawings, not controls: a black key's foot 6px, a white key's 9px,
square at the top.

**The Whole Card Rule.** Rows inside a rounded card keep its corners; nothing square pokes out.

## Components

### Placement

- **A detail page** reads title, facts, sections; its one primary action floats at the foot.
- **The bar** (`ScreenHeader`) is one row of one height on every screen: Back, the title with its Edit (a quiet pencil;
  Done in its place while editing) right after it, then at its end, in this order whatever the page passes: tools,
  Settings (the gear), More. A place's or a detail page's title is larger
  in the same row and may take two lines. Nothing hangs under the bar: a status goes in it or in its menu, and a page's
  views sit in its content. A place's views (Learn's Lessons · Courses, Songs' My songs · Explore) are its title
  (`TitleTabs`): their words where the title stands, in Onest at the large title's size, the one shown in ink with an
  ink line under it, the other in soft ink; the place's name stays the page's heading, unseen. A pane kept in sight
  under the bar (a style's preview) is `Pinned`: solid, edge to edge, moving with the bar; never a card floating over
  the controls. What is docked at the foot (`Docked`) owns the ground down to the screen's edge. It slides away while reading down and returns as the page turns up.
- **Page, sheet or menu:** a page for settings and many fields; a sheet for creating one thing or one focused choice; a
  menu for one-tap commands. A sheet never holds a second sheet; a menu never holds a setting.
- **An act on an item is a button, never a switch:** Favourite and Learned on the item's card and in its menus. An item's
  Settings holds what it is, not what the learner does with it.
- **Creating** is the floating +, opening a dial of the ways to add. **Every New …** is one `NewSheet`: the name, a few
  properties, one Create pinned at the foot.
- **Score screens have three layers:** the flat bar; the tools of what is shown, floating; what acts on the notes chosen,
  a capsule over the transport only while something is chosen.

### Buttons

- **Shape:** Onest 600 at 16px in the control corner. Sizes are 44px, 48px (`lg`), a 56px pill, and a 72px round Play.
  Icon-only buttons are 44px with a 20px icon.
- **Primary:** `default`, honey with ink on it.
- **Second actions:** `soft` and `outline`, card paper in the control line; `secondary`, sky mist.
- **Quiet:** `ghost`, no fill until hovered; `bar`, a screen bar's round button; `tool`, a toolbar's, no frame until
  hovered, open or pressed; `link`, deep sky.
- **Destructive:** card paper with a crimson line and label.
- **Floating** (`FloatingActions`): the main action a honey 56px circle, a second a raised 48px circle. A dial opens as a
  card of rows; every floating button keeps a gap above the home indicator.
- **Focus:** one 3px deep-sky outline, 2px off, appearing at once (`src/styles/focus.test.ts`); inset where a scroller
  or a card's edge would cut it.
- **Every Play becomes Stop** while it sounds; an item in a grid is pressed instead.

### Choices

- **The control for each choice:** one among many a menu showing its value with ⌃⌄; two to five, all in sight, a
  `Segmented`; on or off a switch; a number a `Stepper`; chips only for a few filters. A picture wherever it says it
  faster. Never a strip hiding options behind ‹ ›, and no strip fades at its edges.
- **One selected style** (the `choice` utility): every chosen thing wears the chosen fill to its own edges, in ink. Hover
  is the lighter muted fill. Line and weight stay as they were, so nothing reflows. Exceptions carry their own meaning:
  a switch's grass, a swatch's ring, what sounds now.
- **Pop-up button** (`Dropdown`): 44px, card paper in the control line, label in soft ink, value in ink.
- **Pickers** (`shared/ui/pickers`) open a popover, or a bottom sheet below 30rem. A pitch or a note is an octave grid
  drawn as keys. A key is the key-signature grid (`KeyPicker`, `KeySignaturePicker`): Major · Minor, sharps over flats,
  the same grid as the score editor's and New song's. Time and tempo are one control each.
- **Picture choice** (`PictureChoice`): a setting that changes how something looks is drawn, a line drawing over a short
  name. A choice with no honest picture stays text.
- **Only what applies is offered.** A row that nothing applies to stays in place, greyed, its tooltip saying why, so
  nothing under it moves.

### Rows, cards and sheets

- **Card** (`card`): card paper, the card corner, the soft line. A group's rows part by hairlines.
- **Five row kinds, one component each:** opens a page (`RowLink`: label, value, ›); picks a value (`ChoiceRow`,
  `ChoiceCard`, `PictureChoice`); on or off (`SwitchRow`); does something (`ActionRow`, link ink, no chevron); ends or
  destroys (`DangerRow`, red, in a `DangerGroup`, last on its page and alone). A row that opens a sheet is a `RowButton`.
- **Navigation marks** (`NavMarks` alone): ‹ for Back, › at a row's edge, ⌃⌄ by a picker's value, ⌄ on a fold. Arrows
  only for movement.
- **Sheet** (`Sheet`): card paper, the sheet corner on top, a grab handle, a Literata title with Close, an optional
  footer. It stands on the phone's keyboard. Never a sheet over a sheet.
- **Properties** (a song's Details): a `RowTrigger` per property, its name and value, the value "Not set" in soft ink
  where empty; a tap opens its editor beside it (a popover on a laptop, a sheet on a phone), titled with its name.
- **A place's card style** (`StyleEditor`): the preview is a pinned pane on the muted fill, of fixed height, never over a
  control; presets lead as a strip of drawn tiles, the chosen ringed in ink. Styles are made of the paints, so the dark
  theme redraws them; Night alone is a dark card in both themes.
- **Popover and ⓘ:** an `InfoTip` is a 16px ⓘ in soft ink beside a name; no line of explanation stands under a control.
- **Toast** (`say`): a card over the screen's foot, clear of all that floats there, with Undo and ✕; gone in five
  seconds.
- **Marks:** learned a grass disc with a check (`LearnedBadge`); a gap a 10px ochre dot; progress a 6px grass bar on a
  sand track (`ProgressMeter`), or an arc round a lesson's number (`ProgressRing`).

### Navigation

Places are a 24px icon over a 14px label in soft ink; the current place wears the chosen fill. One place is current at a
time. The learner is their initial on the yellow paint (`Avatar`).

### The keyboard

The whole piano, A0 to C8, scrolling sideways, nothing above its keys: they follow the music directly.

- **The rail** (R32): the instrument's case beneath the keys, 56px in `--key-rail`. The chord a hand holds at its
  start (Literata), the pedals centred where they fit (on a narrow phone they give way towards the start, so the end
  never scrolls away), ‹ › (a mouse, a long keyboard), − and + for the keys' size and ⚙ at its end. ⚙ opens the
  **Piano** sheet in place (R33, musicca's Settings): Key size, Note names, Volume, Pedals, on a computer Play with
  computer keyboard, then All piano settings; the same rows head the On-screen piano page. The Player's ⚙ opens the
  Player's sheet.
- **The pedals:** centred on a dark lyre (`--pedal-lyre`) as on an upright or a grand: the sustain alone, or soft,
  sostenuto and sustain left to right. Each a brass plate (`--pedal`) on its shank with its name under it
  (`--pedal-name`), 48px to press. Down it sinks 3px under a honey glow; latched (a tap on the sustain) it carries a
  lit honey indicator with its glow, as a stage piano's Sustain light; a second tap lifts it. While music plays, the sustain shows the score's pedal; stopped, nothing is down
  or lit.

- **Proportion:** a key is 4.4 times as long as a white key is wide, at least 96px and at most 32% of the screen's height
  (22% on a phone on its side).
- **Keys** (R33, a real piano's): ivory white keys (card paper, softer by night) lit from the player's side, deeper
  under the felt, an edge in light and one in shade, a front lip, a soft cast shadow; ebony black keys bevelled, a
  sheen towards the player, a sloped front, their shadow on the ivory; a 1px bed parts them; the key slip's red felt
  (`--key-felt`) along their far end. The light and shade lie over each key's fill, so marks keep their colour. A
  computer letter sits on its key as a small key cap.
- **Marks:** a role, a hand or a scale's note is its wash at rest and full paint while it sounds, ink on it. A scale's
  notes are sky, its tonic yellow.
- **Down:** a plain key turns sky, sinks 2px in 80ms (its far end darker under the felt, its shadow gone) and stays down at least 150ms. A quiz's chosen keys are honey, a wrong
  key crimson with ✕, a missing key a deep-sky ring.
- **Focus:** a two-tone ring, ink outside and white inside, so it shows on any key.
- **Access:** keys are buttons named by note, one in the tab order, the arrows walking the rest.

### The music

- **Sheet music** is engraved by Verovio in `currentColor` from the tokens: notes in ink, staff lines in the control line,
  a staff not practised in soft ink.
- **What is chosen is coloured, never boxed:** notes in the selection colour, a range or loop a light band of it, tight
  to the notes. The playhead is one thin line across the staves in sight. Empty staff chooses nothing.
- **Chord views:** beat cells on card paper, the beat sounding filled with ink; a chord diagram (`KeyDiagram`) draws a dot
  on each key held.

### Motion

- **One curve,** `ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`): 200ms for colour, 80ms for keys. Sheets rise on the iOS
  sheet curve in 450ms and follow the finger.
- **Only `transform` and `opacity` move.** Buttons and chips animate colour alone, and pressing one never moves it; the
  floating actions keep their press.
- **Strips and diagrams move on their own;** the page does not. Under reduced motion every transition is instant.

## Do's and Don'ts

### Do:

- **Do** give each screen one honey control and show the chosen in neutrals.
- **Do** part cards by surface and a 1px line.
- **Do** label every coloured key, and give every quiet value a firm one under `prefers-contrast: more`.
- **Do** set titles and chord symbols in Literata 600 and everything else in Onest.
- **Do** keep targets at 44px and focus visible, with a shared component for every kind of thing.

### Don't:

- **Don't** fill a second control with colour, or show the chosen in a paint.
- **Don't** colour the navigation, or put a chord role or hand colour on the chrome.
- **Don't** set a control in the serif.
- **Don't** draw a 2px line round a card or lift a card with a shadow.
- **Don't** draw a key that does nothing, stack a sheet on a sheet, or write how-to paragraphs.
- **Don't** hang anything under a screen's bar, or cut a title that two lines could hold.
