# 124. Left for the owner: design choices and lesson content the review found

Status: needs-triage
Severity: P2
Tier: 8
Rule: CONTENT.md; DESIGN.md; WCAG 1.4.11
Where: the lessons and patterns below; DESIGN's honey and loop fills; the audio port

## What is wrong

Content and design decisions the review does not make. Rechecked 2026-10-27: the lessons' rewrite fixed the chromatic
scale's fingering, the five ways, the intervals and gospel wording and most Russian terms. Still open:

- **Fingering counted two ways:** "1–3–2–3" and "1–3–2–4–3" (`broken-chords.ts`, `figures.ts`, `patterns.ts`) count
  voicing positions beside "1–5–8" counting degrees.
- **Keys that do not show the motion the text describes:** a lesson's `chords` block places every chord from middle
  C, so a line such as "the bass walks down C, B, B♭, A" never shows. Option: voice-lead a block that is a
  progression, leaving galleries of chord kinds as they are.
- **A slash chord's bass outside the chord** (`C/D`, `F/G`) sits plain under the chord: labelling it needs a key face
  DESIGN does not have.
- **Russian:** «Лад от» for "Mode of"; the library's "Stack Your Chords" (`library.ts`) has no Russian.
- **Design:** a chosen or lit key's honey on a white key (about 1.6:1) and the pressed loop's fill fall under 3:1
  (WCAG 1.4.11). Audio that cannot start (iOS after a call) leaves Play on Stop with no line saying there is no sound.

## The test that shows it

Content and design: none until the owner decides.

## The fix

The owner's.

## Comments
