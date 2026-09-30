# 102. The keyboard names all 88 keys through `t()` on every render

Status: done
Severity: P2
Tier: 6
Rule: CODE_STYLE §7; `rendering-hoist-jsx` (hoist lookups out of render)
Where: `src/shared/ui/piano-keyboard/PianoKeyboard.tsx:159,232`

## What is wrong

A glissando renders the keyboard twice per key crossed (about 60 renders a second at 30 keys a second), and each render made 88 `t()` calls.

## The test that shows it

A benchmark in jsdom, 300 re-renders with one key down: 2.05 ms per render before (1.85, 2.11, 2.20), 1.43 ms after (1.40, 1.46, 1.43), −30%; 88 `t()` calls a render before, none after.

## The fix

The names are a map memoised on `t`: once per language.

## Comments
