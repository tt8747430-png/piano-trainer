# ADR 0010 — The app is a labelled picture book

- **Status:** accepted, amended by ADR 0011 (its colours in use, its line and its lettering) · **Date:** 2026-09-27 ·
  **Supersedes:** ADR 0007's colours, shapes and tab bar

## Context

The owner found the sage world "green" and the keys "very strident and heavy", sent The Ultimate Piano's learn view
as a reference (pale marks on light keys that turn full colour when played), turned down two readings of it in
violet, and asked for better colours with more harmony, a better shape and layout, and screens that use a laptop's
width: every tab screen sat in a 672px column. Offered rolled directions (a stained-glass window, piano felt, a
songbook's cloth, engraved sheet music, a cloud's pastel edge and others), the owner chose the **Busytown
cross-section**: Richard Scarry's labelled cut-away picture books, over its named risk of reading as a children's
book.

## Decision

- **Paper and a line.** A paper ground (dusk brown by night), and a warm brown line round every card, control and
  key, as the book draws every shape.
- **Seven paints at one lightness** (brick, yellow, grass, sky, lilac, sand, teal), so they sit together: that is the
  harmony. Each has a pale wash and its full colour (`src/styles/tokens.css`).
- **What each colour does.** Yellow is the one action; brick red is what is chosen and where you are; grass is
  learned, on and connected; deep sky is a link and focus; amber marks a gap and crimson a wrong key. On the chrome the paints
  (sand, yellow, grass, sky, lilac: never brick) name places and kinds of step (`--paint-*`), never a chord tone.
- **The keys.** Paper keys parted by the brown line, a warm black, a painted wooden rail. A mark is its paint's wash
  while its key is quiet and its full paint while the key sounds (chord tones, the Player's hands, a scale in sky, its
  tonic in yellow); a plain key sounding turns sky. This keeps ADR 0009's rules (spotlight keeps every mark, a hand's
  key is down at least the shortest press) and replaces its tint.
- **Lettering.** Balsamiq Sans Bold (latin and cyrillic, the one weight shipped) for titles, chord symbols, buttons,
  segments and the tabs; Onest stays for reading. (Pangolin was tried first; the finish review found it too thin for
  the book's mass and for chords read from the music stand.) Faux bold is off.
- **Shape.** Soft rounded rectangles in place of pills: buttons 12px, cards 14px, sheets 20px; a card's title may sit
  in a band across its top, as the book boxes things.
- **Layout.** A bar docked along the bottom on phones (content never slides under it); from 1024px a lettered
  sidebar and screens up to 72rem wide: two columns where the content has two parts (Songs, a Piece, Settings, the
  Player), the Path's Continue card across the width with the level's steps in two columns under it, and the
  explorers' keyboard across the full width above their choices; a chart's bars in equal columns.
- **Kept from ADR 0007:** Onest, one kit in `shared/ui`, one primary action per screen, the refusals (streaks,
  mascots, upsells, locked content, stock photos, a kicker above a heading). The world takes the book's colour, line
  and labelling only: no characters or animals.

## Consequences

- The tokens, `THEME_COLORS` and the app icon were replaced; no asset in the sage palette ships.
- `RoleLegend` went: a chord's tone chips carry each tone's paint, degree and note.
- `DESIGN.md` records the system from the built screens; `docs/CODE_STYLE.md` §5 holds its rules.
