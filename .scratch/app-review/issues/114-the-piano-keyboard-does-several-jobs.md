# 114. PianoKeyboard does several jobs, and two of its props say what another already does

Status: done
Severity: P2
Tier: 7
Rule: CODE_STYLE §1 (about 200 lines), `architecture-avoid-boolean-props`; Duplicated Code
Where: `src/shared/ui/piano-keyboard/PianoKeyboard.tsx` (259 lines)

## What is wrong

The keyboard drew its rail, named its 88 keys and stepped its scroll itself; `selectable` always equalled "a
selection is given" (and a selected key without it was honey with no `aria-pressed`); `height="fill"` worked only
with a `className` the caller had to know; the reduced-motion query was written four times.

## The test that shows it

`PianoKeyboard.test.tsx`: "makes keys toggles when it holds a selection…", "keeps its keys plain buttons without a
selection"; `use-scroll-motion.test.ts`.

## The fix

`KeyRail`, `useKeyNames` and `useScrollMotion` (shared/lib, for the keyboard, its map, its scroll and the sheet's
follow); `selectable` and `className` go, `fill` holds its own flex. 195 lines.

## Comments

Left as they are: the keyboard settings' four props (one caller passes the saved settings whole), `map` (the saved
field's name), the two places a hand's keys are widened by `keyPlays` (each hand where it is read), `Key`'s fill
tables (complete class strings, CODE_STYLE §5), and a selected, lit or wrong key's fill when down (already full
paints; down drops the key, as DESIGN says).
