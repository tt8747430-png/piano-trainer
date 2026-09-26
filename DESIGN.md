---
name: Piano Trainer
description: A calm, native-feeling practice app where the labelled keyboard is the hero and each screen has one deep-teal action.
colors:
  sage-ground: '#F3F6F3'
  card-white: '#FFFFFF'
  sage-sunken: '#E8EDE9'
  ink: '#131816'
  slate-secondary-text: '#5E6964'
  deep-teal: '#2D6657'
  mint-soft: '#D3E6DE'
  mint-soft-ink: '#1F4D41'
  amber-attention: '#9A5A0B'
  alarm-red: '#B3261E'
  hairline: '#DCE3DE'
  role-root-blue: '#2E5BD0'
  role-third-rose: '#CC3363'
  role-fifth-steel: '#5B6878'
  role-seventh-ochre: '#A86A00'
  role-ninth-green: '#0E8F5B'
  role-eleventh-violet: '#7847C8'
  role-thirteenth-cyan: '#0A83AD'
  hand-right-teal: '#1E7F69'
  hand-left-terracotta: '#C2552B'
  hand-tune-plum: '#7A4FC4'
  key-white: '#FFFFFF'
  key-black: '#1E2321'
  key-down-mint: '#8CCBB8'
  key-rail: '#131816'
  key-tonic: '#2D6657'
  key-scale: '#8CCBB8'
  night-ground: '#0D1210'
  night-card: '#171E1B'
  night-ink: '#E6EDE9'
  night-teal: '#8CCBB8'
typography:
  chord-display:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '64px'
    fontWeight: 800
    lineHeight: 1
    letterSpacing: '-0.035em'
  large-title:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '34px'
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: 'Onest Variable, Noto Music, system-ui, sans-serif'
    fontSize: '22px'
    fontWeight: 700
    lineHeight: 1.2
  headline:
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
    fontWeight: 600
    lineHeight: 1.25
rounded:
  black-key: '6px'
  white-key: '9px'
  primitive: '12px'
  segment: '14px'
  field: '16px'
  button: '18px'
  card: '26px'
  sheet: '28px'
  pill: '9999px'
spacing:
  gutter: '16px'
  stack: '20px'
  section: '32px'
  target: '44px'
components:
  button-primary:
    backgroundColor: '{colors.deep-teal}'
    textColor: '{colors.card-white}'
    rounded: '{rounded.pill}'
    height: '56px'
    padding: '0 24px'
  button-soft:
    backgroundColor: '{colors.mint-soft}'
    textColor: '{colors.mint-soft-ink}'
    rounded: '{rounded.pill}'
    height: '56px'
    padding: '0 24px'
  button-round:
    backgroundColor: '{colors.card-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    size: '44px'
  button-play:
    backgroundColor: '{colors.deep-teal}'
    textColor: '{colors.card-white}'
    rounded: '{rounded.pill}'
    size: '72px'
  chip:
    backgroundColor: '{colors.card-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    height: '44px'
    padding: '0 16px'
  chip-selected:
    backgroundColor: '{colors.deep-teal}'
    textColor: '{colors.card-white}'
    rounded: '{rounded.pill}'
    height: '44px'
    padding: '0 16px'
  segmented-track:
    backgroundColor: '{colors.sage-sunken}'
    rounded: '{rounded.button}'
    padding: '4px'
  segmented-selected:
    backgroundColor: '{colors.card-white}'
    textColor: '{colors.ink}'
    rounded: '{rounded.segment}'
    height: '44px'
  card:
    backgroundColor: '{colors.card-white}'
    rounded: '{rounded.card}'
    padding: '20px'
  continue-card:
    backgroundColor: '{colors.mint-soft}'
    textColor: '{colors.mint-soft-ink}'
    rounded: '{rounded.card}'
    padding: '20px'
  sheet:
    backgroundColor: '{colors.card-white}'
    rounded: '{rounded.sheet}'
    padding: '0 20px 24px'
  key-white:
    backgroundColor: '{colors.key-white}'
    rounded: '{rounded.white-key}'
  key-black:
    backgroundColor: '{colors.key-black}'
    rounded: '{rounded.black-key}'
  key-down:
    backgroundColor: '{colors.key-down-mint}'
  key-tonic:
    backgroundColor: '{colors.key-tonic}'
    textColor: '{colors.card-white}'
  key-scale:
    backgroundColor: '{colors.key-scale}'
    textColor: '{colors.ink}'
---

# Design System: Piano Trainer

## Overview

**Creative North Star: "The Music Stand"**

Everything is designed to be read from a phone propped on a piano's music stand, glanced at between chords with both
hands on the keys. The labelled keyboard is the hero: it is on every screen that sounds anything, it plays when tapped,
and every key the app sounds goes down on it as it sounds. Around it the screens are calm and native-feeling, in the
grammar of the owner's reference apps (Clefs, Flowkey's player, a theory reference app and a chord trainer; see
`PRODUCT.md` and ADR 0007): a sage ground, white raised surfaces, a mint soft surface for what to do next, and one
deep-teal action per screen.

Density is low and targets are large (44px at least). Colour carries meaning, never decoration: roles colour chord
tones, hands colour the Player's notes, amber marks a gap, and nothing else on the chrome is coloured. Light is the
default scene, a room lit by day or by a lamp at the piano; dark follows the setting.

Not taken: streaks as pressure, mascots, upsells, locked content, stock photos, a kicker label above a heading,
progress rings standing in for content.

**Key characteristics:**

- One keyboard component everywhere, the whole piano, scrolling, one tab stop.
- One deep-teal action per screen; everything else is white, mint or sunken sage.
- Chord symbols set heavy and large; numerals that change in place are tabular.
- Round 44px icon buttons, pill segmented controls, chips in a scrolling row, a floating glass tab bar.
- Bottom sheets of switches and lists, never a sheet over a sheet.

## Colors

A sage-tinted neutral world with one deep teal, a mint soft surface, and meaning-only colour on the keys.

### Primary

- **Deep Teal** (#2D6657; night #8CCBB8): the one action on a screen (Continue, Practise, Play, Check, Next), a
  selected chip or segment, learned checks, links, focus rings.

### Secondary

- **Mint Soft** (#D3E6DE, ink #1F4D41; night #1E3A32, ink #BFE3D7): the Continue card and soft buttons (Arpeggio,
  Hear these notes, Clear), the step panel.

### Neutral

- **Sage Ground** (#F3F6F3; night #0D1210): the page. Sage-tinted, never cream.
- **Card White** (#FFFFFF; night #171E1B): raised surfaces: cards, sheets, popovers, round buttons, chips.
- **Sage Sunken** (#E8EDE9; night #1F2824): sunken surfaces: segmented tracks, slider tracks, the current bar.
- **Ink** (#131816; night #E6EDE9): text. **Slate** (#5E6964; night #97A59F): secondary text, AA on ground and sunken.
- **Hairline** (#DCE3DE; night #2A3430): borders and rings.

### Meaning colours

- **Chord roles** (root #2E5BD0, 3rd #CC3363, 5th #5B6878, 7th #A86A00, 9th #0E8F5B, 11th #7847C8, 13th #0A83AD;
  lighter by night): chord tones on keys, the role legend, a chord's tone chips.
- **Hands** (right #1E7F69, left #C2552B, tune #7A4FC4): the Player's keys and note grid only.
- **Attention** (#9A5A0B; night #E7A64B): a gap or "to check" dot, never text.
- **Destructive** (#B3261E; night #FF8A80): reset progress, a wrong key.
- **Keys:** white #FFFFFF (night #E9EEEA) and black #1E2321 (night #050706), hung from a rail of #131816 (night
  #050706) and parted by a 1px line of key bed (#1E2321; night #050706). A scale's notes colour whole keys, white and
  black alike: the tonic deep teal #2D6657 with a white label, the other notes light teal #8CCBB8 with an ink label,
  the same by night. Scales are not chord tones, so the Palette Law keeps role colours off them.

### Named Rules

**The Palette Law.** Role colours appear on chord tones only; hand colours only in the Player; attention only as the dot
of a gap. Chrome is never coloured by a role.

**The Key Goes Down Rule.** A key that sounds goes down, whoever plays it (under spotlight, the key struck last): a plain key turns Key Down mint (#8CCBB8;
night #2D6657); a coloured key keeps its colour under a tint, deeper by day and brighter by night, so its label keeps
its contrast. Colour is never the only cue: every coloured key also carries its degree, finger or note label.

## Typography

**Font:** Onest (variable, 400–800), self-hosted, with Noto Music's music subset as the fallback for 𝄪 and 𝄫.

**Character:** a grotesque drawn Cyrillic-first, so Russian reads as well as English; set heavy for chord symbols and
large titles, plain for everything read in passing.

### Hierarchy

- **Chord display** (800, 64px, 1, −0.035em): the chord now in the Player and the Chords explorer.
- **Large title** (700, 34px, 1.1): each screen's header, the scale's name.
- **Title** (700, 22px, 1.2): section headings, a chord in a chart.
- **Headline** (600, 17px, 1.4): row titles, the Player's title, feedback lines.
- **Body** (400, 16px, 1.5): everything else, prose at most 65ch (the reading notes).
- **Label** (600, 14px): segments, chips' secondary text, beat labels, key labels.

**The Tabular Numbers Rule.** Tempo, bar numbers, counts and key labels are `tabular-nums`, so a number that changes in
place never shifts its neighbours.

## Layout

Phone first. Shell screens sit in a centred column (max 672px) with 16px gutters and clear the notch (`pt-safe`);
content scrolls under a floating tab bar (128px bottom padding), which becomes a 96px left rail from 1024px. The Player
and the Check are full screen (max 1024px) with a close button and no tab bar; on a phone on its side the Player splits
into two columns over the keyboard. Stacks use `gap`: 20px between a screen's parts, 32px between sections, 12px inside
a group. Explorers, Symbols and the Piece chart pin their keyboard to the top while the page scrolls.

## Elevation & Depth

Mostly flat and tonal: raised surfaces are white on sage, sunken ones sage on sage. Shadows are small and only on
things that float or can be pressed.

- **Ring and soft shadow** (Tailwind's `shadow-sm`, `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`,
  with a 1px hairline ring): round buttons, a selected segment.
- **Floating** (`shadow-lg` with a hairline ring and a 24px backdrop blur over `card` at 72%): the tab bar.
- **Popover** (`shadow-md` with a hairline ring): the MIDI popover, the keyboard settings. Bottom sheets rise over a
  dimmed page and need no shadow of their own.

**The No Glow Rule.** No coloured glow, no gradient, no glassmorphism beyond the tab bar. One exception, on keys only:
the keys' material. The rail casts a short shade onto the keys (a gradient of ink, 22% to nothing, 8px), a white key
ends in a 6px lip of ink at 12%, a black key in a lighter front slope of white at 16%. They draw a piano, never a
colour, and appear nowhere but on keys.

## Shapes

Rounded, soft and consistent: chips, pills and round buttons are fully round; buttons 18px; primitives 12–16px; cards
and the Continue card 26px; sheets 28px at the top. Keys are square at the top and rounded only at the bottom (9px
white, 6px black), and black keys stand 62% as wide and 62% as long as the white keys.

## Components

### Buttons

- **Primary** (deep teal, white text, a 56px pill or a 44px rectangle of 18px radius): the screen's one action; hover
  deepens to 80%, press nudges down 1px.
- **Soft** (mint, dark-teal text): the second action beside it (Arpeggio, Clear, Hear these notes).
- **Round** (44px, white, hairline ring, soft shadow, 20px icon): close, back, settings, MIDI, Restart; always labelled.
- **Play** (72px teal circle): Listen's one big Play/Stop.

### Chips and segments

- **Chip** (44px pill, white with a hairline ring; selected deep teal): a scrolling row of roots, families, qualities
  or keys that clears the screen's edge.
- **Segmented** (sunken track, 4px inset; the selected segment white with a soft shadow): one value from a few.

### Cards and sheets

- **Card** (white, 26px, hairline ring): grouped reference rows, the practice card.
- **Continue card** (mint, 26px): the one suggestion on the Path.
- **Sheet** (white, 28px top, swipe handle, title, scrolling body, optional footer): Setup, quiz choice, reading notes.

### Navigation

A floating glass pill of three items (icon over label), the active one in a soft teal pill; a left rail on desktop.

### The keyboard (signature)

The whole piano, A0–C8, hung from a dark **rail** and scrolling sideways with no bar. The rail is drawn 28px at the
foot of a 44px strip, so its buttons have 44px targets without reaching over a key: **‹ ›** at its ends move the keys
an octave (in both swipes: a mouse cannot swipe), the **keyboard map** between them (off by default) draws all 88 keys
small with a frame round the part in view and dots under the keys marked or down, and the **settings button** at its
right end opens the keyboard settings in a popover.

- **Proportions:** the keys are 4.2 times as long as a white key is wide, within 96px and 40% of the screen's height
  (a phone's keys about 120px long, a laptop's about 200px); the Player's keyboard takes the height its layout gives
  it. **Key size:** Fit (the range fills the width, white keys 28–48px), Large (56px, about an octave on a phone) or
  Whole piano (all 52 white keys fill the width; no ‹ ›, no map, no finger row). The keys that matter stay in view at
  every size: it opens centred on them (a chord, a run, the Player's current notes) and centres again when the size
  changes.
- **Material:** white keys stand apart by a 1px line of key bed and end in a lip; black keys end in a lighter slope.
  **Down** is physical as well as coloured: a key going down drops 2px and its lip or slope shortens to a third;
  under reduced motion, at once.
- **Touch:** a key sounds and goes down the instant it is touched. **Scroll** (default): a swipe moves the keyboard and
  only the key it started on sounds. **Glissando:** every key a finger crosses sounds, and the keys take the finger
  from the page.
- **Faces:** plain, a role or hand colour with its label, a scale's whole-key fill (tonic deep, others light) with its
  degree, a quiz's teal selection, Name chord's lit teal, a wrong key red, a missing key outlined; and down, over all
  of them, as a key sounds, is held on MIDI or is pressed. **Note names** (C · All · None) put "C4" on every C, or a
  name on every key, drawn smaller than a mark's label, which always wins. The computer keyboard's letters sit on the
  keys it plays.
- **Finger row:** finger numbers in 20px circles under the keys, in two staggered lines as the keys stand: a black
  key's in the upper line (light teal), a white key's in the lower (white, ringed in key bed). Only while a mark
  carries a finger.
- **Spotlight** (the explorers, Symbols, a Piece's chart): the keys down are the ones struck last, and the other marked
  keys go quiet (their colour at a low strength under a veil of the plain key, their label kept) until nothing sounds.
  The Player and the quiz keep every mark full: their marks mean "play these".
- Keys are buttons named by note ("F sharp 4"), one of them in the tab order, the arrow keys walking the rest; every
  tap sounds. **Every Play becomes Stop** (a square) while its sound plays; in a grid of items (a Piece's bars, a
  scale's chords) the item is pressed instead, and a second tap stops it.

## Do's and Don'ts

### Do:

- **Do** give each screen exactly one deep-teal primary action.
- **Do** show every sound on a keyboard: a key that sounds goes down.
- **Do** label every coloured key with its degree, finger or note.
- **Do** keep targets at 44px and focus rings visible (3px, teal).
- **Do** set numerals that change in place in tabular figures.

### Don't:

- **Don't** colour chrome with a chord role or a hand colour.
- **Don't** draw a key that does nothing: every key sounds.
- **Don't** stack a sheet over a sheet; open a list as a page of the sheet.
- **Don't** write how-to paragraphs; the labelled keyboard and the layout teach.
- **Don't** use cream, gradients or coloured glow.
