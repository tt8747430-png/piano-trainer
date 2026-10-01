# 115. A key's chord stays pressed after the chord size changes

Status: done
Severity: P3
Tier: 7
Rule: CODE_STYLE §1 (a Play button is pressed while its own sound plays)
Where: `src/widgets/key-explorer/ui/KeyChordsSection.tsx:18-42`

## What is wrong

The Keys page's grid named each chord's play by its place (`d0`), so after Triads → 7ths the new chord on I showed
pressed while the old triad still rang.

## The test that shows it

```ts
it('presses no chord of a new size while the old one still sounds', async () => {
  const user = userEvent.setup()
  await renderApp('/learn/keys')
  await user.click(await screen.findByRole('button', { name: /^C\s*I$/ }))
  await user.click(screen.getByRole('button', { name: '7ths' }))
  expect(screen.getByRole('button', { name: /^CMaj7/ })).toHaveAttribute('aria-pressed', 'false')
})
```

## The fix

`ScaleChordGrid` (features/play-example), one grid for the Scales and Keys references, names a chord's play by its
degree, symbol and keys.

## Comments
