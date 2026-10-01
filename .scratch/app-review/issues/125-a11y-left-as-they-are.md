# 125. Accessibility findings left as they are

Status: wontfix
Severity: P3
Tier: 8
Rule: WCAG 2.2 (judgement calls)
Where: various

## What is wrong

Judgement calls the review weighed and left.

## The test that shows it

None.

## The fix

None.

## Comments

- A staff whose engraver chunk cannot load offline takes its screen down: the precache holds the chunk, so this
  needs a first visit offline before the service worker installs; a test of it needs a module mock.
- Label in name for symbols named in words (`m7` named "Minor 7th"): the word is the better name for a screen reader.
- Named regions for each card group (Tensions, Reharmonise, Intervals, RowGroup): tests and a screen reader's region
  list find them by name.
- "Sheet music" regions over an `aria-hidden` engraving: the region names the staff; its music is read on the keys.
- A tab stop per bar in a long chart; `transition-all` in the button primitive; announcing a typed field's error as
  it appears (noisy mid-word); a black key under 24px at Whole piano (the essential exception).
- Words: duplicate strings across namespaces (namespaces are per place); copy that explains an option (From the
  chart, speed training) where the option's word alone would not say it.
