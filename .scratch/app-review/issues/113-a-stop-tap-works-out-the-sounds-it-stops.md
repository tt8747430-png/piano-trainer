# 113. A Stop tap works out the sounds it stops

Status: done
Severity: P2
Tier: 7
Rule: CODE_STYLE §7 (no work a learner does not see)
Where: `src/shared/lib/services/use-playback.ts:29-35`; heaviest at `PatternExample.tsx:48`

## What is wrong

`toggle(id, sounds)` took its sounds ready-made, so every Stop tap built them first; a lesson's pattern example
arranged and scheduled its piece only to stop it.

## The test that shows it

```ts
it('works out its sounds only when a play starts, never for a Stop', () => {
  const { result } = setup(() => usePlayback<'chord'>())
  const sounds = vi.fn(() => [NOTE])
  act(() => result.current.toggle('chord', sounds))
  act(() => result.current.toggle('chord', sounds))
  expect(sounds).toHaveBeenCalledOnce()
})
```

## The fix

`toggle(id, sounds: () => readonly Sound[])`, at all 20 calls; the pattern example arranges inside it.

## Comments
