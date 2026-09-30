# 98. Two content rules have no test

Status: ready-for-agent
Severity: P3
Tier: 9
Rule: CONTENT.md:16 and its section markers
Where: `src/entities/piece/content`

## What is wrong

"An id is short and lower-case"; `n` numbers a verse, `label` names a part, `last` marks a last chorus or ending (`use-section-heading.ts:12-21` drops a misplaced one silently). Current content complies.

## The test that shows it

—

## The fix

For Tier 9: a catalogue test for each.

## Comments

Tier 9.
