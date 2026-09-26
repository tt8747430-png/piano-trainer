# ADR 0011 — The book, printed quietly

- **Status:** accepted · **Date:** 2026-09-27 · **Amends:** ADR 0010's colours in use, its line and its lettering

## Context

The picture book (ADR 0010) read loud once built: brick-red blocks on every chosen chip, segment and tab, a rainbow of
full-paint step tiles, school-bus yellow, a 2px dark-brown line round every shape, a dark wooden rail over the keys,
and Balsamiq Sans (a hand-drawn wireframe face) on titles, buttons and tabs. The owner asked for "more calm colors and
better typography" and sent Apple's guidelines on colour and typography and Material's colour system as references.
From them: don't use one colour to mean two things, colour the background of one control rather than many, keep tab
bars monochrome over colourful content, give every colour light, dark and increased-contrast variants, use few
typefaces (a sans and a serif made to go together, as SF and New York), set text in a fixed set of text styles, size
in units that follow the reader's own text size, and name the colour on a fill (Material's "on" colours).

## Decision

- **The same book, printed quietly.** Paper, a line, the paints at one lightness, the labelled keys and the wash-to-
  paint rule all stay; the ink is lighter everywhere.
- **Paints faded.** The seven paints sit at one lightness with less chroma; each keeps a pale wash, and the chrome's
  have a deep shade for the icon on them (`--on-paint-*`).
- **Grouped surfaces, a soft line.** The page is a shade darker than the cards on it, so a card separates by its
  surface; its line is 1px and soft (`--border`). A control's line is 1px at 3:1 (`--input`), so it is still found.
- **Colour fills one control.** The action is honey (`--primary`), borderless; nothing else is filled with a colour.
  What is chosen is neutral: a chip fills umber (`--selected`), a segment and a Theory tab are a card on a muted track
  (the iOS thumb). Brick is only the root and the right hand now.
- **A monochrome nav.** The bar and the sidebar are ink and soft ink; where you are is a muted fill.
- **Tints for places.** A step's tile is its paint's wash with the deep icon; the Continue card's band is the sky's
  wash.
- **The keys' material, lighter.** The rail is light wood with ink controls; by night the white keys are a shade
  softer, so they never glare in a dim hall.
- **Increased contrast.** Under `prefers-contrast: more`, secondary text, lines and dividers step up in both themes.
- **Typeset, not hand-lettered.** Literata (a book serif drawn for screens; weight and optical-size axes; Latin and
  Cyrillic) sets `h1`–`h3` and chord symbols at 600; Onest sets reading text and every control. Balsamiq Sans is gone.
  The scale is the text styles in rem: 17 headline, 20, 22, 28, 34 large title, 44 display, 72 the chord.

## Consequences

- `tokens.css`, `theme.css`, `THEME_COLORS` and the kit's classes changed together; `DESIGN.md` and
  `docs/CODE_STYLE.md` §5 record the rules.
- `@fontsource-variable/literata` replaces `@fontsource/balsamiq-sans`; its Greek and Vietnamese files stay out of the
  PWA's precache.
- The app icon follows a reference the owner chose (Piano Pro & Drum's): three outlined keys seen from above, tapering
  to the back with their front faces, the black keys raised between them, E played in honey, on a warm charcoal ground with
  a glow behind the keys, a shadow under them and three diamonds (`public/favicon.svg`). It is a rounded tile where
  nothing else shapes it (a tab, a desktop install); for the home screens, which cut their own shape,
  `pwa-assets.config.ts` fills its corners with the ground, where the generator's default framed a small tile in
  white.
