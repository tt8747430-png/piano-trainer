# 95. The 14 rhythm styles have no description

Status: needs-triage
Severity: P2
Tier: 5
Rule: spec §4.2 (each style has a name and a description)
Where: `src/entities/pattern/content/patterns.ts:285-328`, `model/types.ts:152`

## What is wrong

The type makes the description optional; the gospel lesson writes one itself for want of it.

## The test that shows it

`patterns.test.ts` counts texts but not each style's description.

## The fix

The owner writes 14 descriptions in both languages; then the field is required and the test asks for it.

## Comments

Content, which the review does not write.
