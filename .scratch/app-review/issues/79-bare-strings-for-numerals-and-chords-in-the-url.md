# 79. A progression's numerals and the chromatic walk's chords are bare strings in the URL types

Status: wontfix
Severity: P3
Tier: 4
Rule: CODE_STYLE §6 (small domain types over bare strings)
Where: `ProgressionSearch.p`, `ProgressionsView.p`, `ChromaticSearch.chords`

## What is wrong

Keys and roots are branded (`KeyParam`, `NoteParam`); these two are `string`.

## The test that shows it

—

## The fix

None.

## Comments

Each is written only by its validator (`readNumerals`, `chordsParam`) and read only by its source's model, which parses it again; a brand would add a constructor for two readers.
