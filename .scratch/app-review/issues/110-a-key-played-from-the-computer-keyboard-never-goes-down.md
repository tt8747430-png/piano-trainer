# 110. A key played with Enter, Space or a screen reader never goes down

Status: done
Severity: P2
Tier: 7
Rule: ADR 0009, DESIGN (every key the app sounds goes down on it)
Where: `src/shared/ui/piano-keyboard/use-key-pointers.ts:59`

## What is wrong

A click no pointer made played its key as a hand's play, which the audio port leaves out of what sounds, and nothing
put it among the pressed keys: it sounded and never went down.

## The test that shows it

```ts
it('draws a key played by a click no pointer made down for the shortest press', () => {
  vi.useFakeTimers()
  const { key } = setUp()
  fireEvent.click(key('C4'))
  expect(key('C4')).toHaveAttribute('data-down')
  pastTheShortestPress()
  expect(key('C4')).not.toHaveAttribute('data-down')
})
```

## The fix

The click presses its key under an id no pointer has and lets it go at once: `usePresses` keeps it down for the
shortest press, as a tap's.

## Comments
