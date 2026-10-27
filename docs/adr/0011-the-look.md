# ADR 0011 — The look: a labelled picture book, printed quietly

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

The owner pinned reference products rather than choose a rolled direction (Clefs, Flowkey's player, a theory app, a
chord trainer; `PRODUCT.md`). A sage-and-teal world built from them read as "green" and the keys "strident and
heavy". The owner then chose Richard Scarry's labelled cut-away picture books, which read loud once built: brick on
every chosen chip, full-paint tiles, a heavy brown line, a hand-lettered face. Apple's and Material's guidelines on
colour and type were the corrective: one colour, one meaning; colour on one control, not many; a monochrome tab bar
over colourful content; few typefaces in fixed text styles.

## Decision

- **Paper and a soft line.** A paper ground (dusk brown by night); a card separates from the page by its surface, its
  line 1px and soft; a control's line is 1px at 3:1, so it is still found.
- **Seven paints at one lightness** (brick, yellow, grass, sky, lilac, sand, teal), faded, each with a pale wash, its
  full colour and a deep shade for an icon on it (`--on-paint-*`), in `src/styles/tokens.css`.
- **Each colour means one thing.** Honey is the action (`--primary`), one filled button per screen: the One Honey
  Rule. What is chosen is neutral: a segment is a card on a muted track. Brick is the root and the right hand; grass
  is learned, on and connected; sky is a link and focus; amber marks a gap; crimson a wrong key. On the chrome the
  paints name places and kinds of step, never a chord tone. A value shown large (the tempo dial) may fill with the
  accent; nothing else is filled with colour.
- **A monochrome nav.** The bar and the sidebar are ink and soft ink; where you are is a muted fill.
- **The keys** are paper keys parted by the line, a warm black, a light wooden rail. A mark is its paint's wash while
  its key is quiet and its full paint while it sounds; a plain key sounding turns sky. By night the white keys are a
  shade softer.
- **Type:** Literata sets `h1`–`h3` and chord symbols at 600; Onest sets reading text and every control. Text styles
  in rem: 17, 20, 22, 28, 34, 44, and 72 for the chord. ♭ ♮ ♯ come from the Text Accidentals face before Noto Music.
- **Shape:** soft rounded rectangles: buttons 12px, cards 14px, sheets 20px.
- **Increased contrast:** under `prefers-contrast: more`, secondary text, lines and dividers step up in both themes.
- **Colour is never the only cue:** a coloured key carries its label.
- **Refused:** streaks as pressure, mascots, upsells, locked content, stock photos, a kicker over a heading, progress
  rings standing in for content.
- **The app icon:** three outlined keys seen from above, E played in honey, on warm charcoal (`public/favicon.svg`),
  its corners filled with the ground for home screens (`pwa-assets.config.ts`).

## Consequences

`DESIGN.md` records the system from the built screens and `docs/CODE_STYLE.md` §5 holds its rules. A change of
colour changes `tokens.css`, `theme.css` and `THEME_COLORS` together.

## History

- 0007 — The sage world from the reference apps (2026-09-25). Its colours were replaced; its one kit and one action per
  screen stay.
- 0010 — The labelled picture book (2026-09-27): paper, a line, seven paints, labelled keys.
- 0011 — The book, printed quietly (2026-09-27): the paints faded, honey the action, Literata and Onest.
