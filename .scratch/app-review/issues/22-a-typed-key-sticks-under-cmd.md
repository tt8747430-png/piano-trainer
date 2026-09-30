# 22. A typed key sticks under Cmd on macOS, and Shift+letter plays

Status: done
Severity: P2
Tier: 2
Rule: ADR 0009 (never with a modifier held)
Where: `src/features/live-keyboard/model/use-typing.ts`

## What is wrong

macOS sends no key-up for a letter released while Cmd is held, so its key stayed down; and Shift was not among the modifiers that keep a letter from playing.

## The test that shows it

`use-typing.test.tsx`: "lets every typed key go when Cmd is let go: macOS sends no key-up for a letter under Cmd", "plays nothing on auto-repeat, with Cmd or Shift held, or into a text field".

## The fix

Letting go of Meta lets go of every typed key; Shift joins Ctrl, Cmd and Alt.

## Comments
