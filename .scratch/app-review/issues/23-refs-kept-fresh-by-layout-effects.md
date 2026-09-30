# 23. Refs kept fresh by layout effects where an Effect Event is the shape

Status: done
Severity: P3
Tier: 2
Rule: vercel-react-best-practices `advanced-use-latest`, `advanced-event-handler-refs`; `use-keyboard-scroll.ts` already uses `useEffectEvent`
Where: `use-typing.ts`, `use-midi-key-down.ts`, `use-practice.ts`

## What is wrong

Three hooks kept a callback or state fresh in a ref written by an effect on every render, for listeners set up in effects: React 19's `useEffectEvent`, which the repo already uses, is that.

## The test that shows it

The hooks' own tests, unchanged and green.

## The fix

`useEffectEvent` in each; `usePractice`'s moves read the render's state directly.

## Comments
