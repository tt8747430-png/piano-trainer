# ADR 0007 — The visual world comes from the owner's reference apps

- **Status:** accepted · **Date:** 2026-09-25

## Context

Phase 3 builds every screen, so it has to choose how the app looks. The legacy app's navy-and-slate palette was
carried into Phase 1's tokens only as a placeholder. Offered rolled visual directions, the owner chose none and
pinned four reference products instead (recorded in `PRODUCT.md`): Clefs, Flowkey's player, a theory reference app
and a chord trainer. The design follows them, argued in `docs/superpowers/specs/2026-09-25-phase-3-screens-design.md`
§1–§2.

## Decision

- **The sage world.** A sage-tinted ground (never cream), deep-teal actions, mint soft surfaces, in light and dark
  (`src/styles/tokens.css`). Chord roles keep their seven tokens, retuned to sit beside teal; the Player's hands and
  the keys get tokens of their own; `--attention` marks gaps only. The app icon is repainted in the same colours.
- **Type:** Onest, a grotesque designed with Cyrillic first, self-hosted, with Noto Music's symbol subset as the
  fallback for 𝄪 and 𝄫. The scale and radii sit on Tailwind's own names.
- **Taken from the references:** round 44px icon buttons, a floating glass tab bar, full-width pill actions, the
  labelled keyboard as the practice screen's hero, one big round Play, chord symbols over numbered bars with the
  current bar shaded, grouped reference cards with inline text actions, bottom sheets of switches with "Select
  common · Clear all" and Apply, a bounded check with a close button and a progress bar.
- **Refused:** streaks as pressure, mascots, upsells, locked content, stock photos, a kicker label above a heading,
  progress rings standing in for content.
- **One kit** in `shared/ui` over the shadcn primitives (base-nova on Base UI), each primitive added with the CLI and
  then sized for fingers: `PianoKeyboard`, `ScreenHeader`, `RoundButton`/`RoundLink`, `ButtonLink`, `Segmented`,
  `ChipRow`, `Sheet`, `RoleLegend`, `RatingMark`, `LevelMark`.

## Consequences

- The tokens were replaced wholesale, and `THEME_COLORS` with them; no asset in the old palette ships.
- Every screen has one deep-teal action, and colour is never the only cue: a coloured key carries its label.
- A link that looks like a button is a `ButtonLink`, because Base UI's `Button` always sets `role="button"`.
- `DESIGN.md`, written from the shipped screens, records the system; `docs/CODE_STYLE.md` §5 holds its rules.
