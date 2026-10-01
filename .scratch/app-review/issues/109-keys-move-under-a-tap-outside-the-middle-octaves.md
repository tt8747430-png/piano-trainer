# 109. The keys move under a tap outside the middle octaves (Chord finder, a lesson quiz)

Status: done
Severity: P1
Tier: 7
Rule: ADR 0009 (the keys hold still under a finger)
Where: `src/features/live-keyboard/ui/ExplorerKeyboard.tsx:45`

## What is wrong

`ExplorerKeyboard` grew its range from every key it was handed, the keys a hand chooses included. In the Chord finder
and a lesson quiz, tapping B3 widened the range, the keys resized at Fit, and the keyboard scrolled to centre them
again while the finger was still down.

## The test that shows it

```ts
it('keeps the keys still under a tap outside the middle octaves (ADR 0009)', async () => {
  const user = userEvent.setup()
  const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
  await renderApp('/learn/chord-finder')
  const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
  const before = scrolls.length
  await user.click(within(keyboard).getByRole('button', { name: 'B3' }))
  expect(chordName()).toHaveTextContent('B')
  expect(scrolls).toHaveLength(before)
})
```

## The fix

The range holds the keys the keyboard opened on and the keys the app shows; keys a hand chooses (`selected`) never
move it, and nor do they move what it keeps in view.

## Comments
