# 37. The Chord finder follows MIDI twice

Status: wontfix
Severity: P3
Tier: 2
Rule: vercel-react-best-practices `client-event-listeners`
Where: `src/widgets/chord-finder/ui/ChordFinder.tsx`, `src/features/live-keyboard/ui/LiveKeyboard.tsx`

## What is wrong

The finder and its keyboard each subscribe to MIDI's held keys.

## The test that shows it

None.

## The fix

None. Each owns its own view of the same events; a shared provider would be a middle man over a subscription that costs nothing.

## Comments
