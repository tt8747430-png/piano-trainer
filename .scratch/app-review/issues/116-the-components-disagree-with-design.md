# 116. Popovers, row paints and the Setup's closed choices disagree with DESIGN

Status: done
Severity: P3
Tier: 7
Rule: DESIGN (popover surface 12px; step paints: song yellow, study grass, progression lilac; only what applies is offered)
Where: `MidiButton.tsx:39`, `TempoButton.tsx:67`, `HandsButton.tsx:35`, `primitives/popover.tsx`, `ProgressionLibrary.tsx:32`, `LessonLinkRow.tsx:137`, `SheetLabels.tsx:27`

## What is wrong

Three popovers drew 14px corners and the keyboard settings' 11px; the progression library's rows were grass and a
lesson's link to any piece sand; a bar number's inset was a bare `4`; the Setup's closed choices contradicted
DESIGN's rule without DESIGN saying why.

## The test that shows it

Visual: checked against DESIGN.md.

## The fix

The popover primitive draws 12px and no popover overrides it; `STEP_PAINT` names each kind's paint, which the
library and a lesson's piece link take; `NUMBER_INSET_PX`; DESIGN records the Setup lists as the one exception.

## Comments

Dropped: Chord size as a Dropdown of five in Scales and a Segmented of two or three elsewhere (DESIGN's own count
rule); `ChoiceList` (a sheet's list) against `ChoiceRow` (a popover's), two layouts. The single choices' `aria-pressed`
goes to Tier 8, which owns roles.
