# 124. Left for the owner: design choices and lesson content the review found

Status: needs-triage
Severity: P0
Tier: 8
Rule: CONTENT.md; DESIGN.md; WCAG 1.4.11
Where: the lessons below; DESIGN's honey and loop fills; the audio port

## What is wrong

Content and design decisions the review does not make. Each is a P0 where it teaches something wrong.

- **Taught wrong (P0):** `chromatic-scale.ts:66` gives 1 2 where two white keys meet, true of the right hand only
  (the left hand going up plays 2 1); "1–3–2–3" and "1–3–2–4–3" (`broken-chords.ts:55`, `figures.ts:106,110`,
  `patterns.ts:239`) count voicing positions beside "1–5–8" counting degrees; `five-ways.ts:33` says each way moves a
  little more, but way 5 moves less than way 4; "the bass walks through the chord's notes"
  (`bass-and-chords.ts:77`, `seven-types.ts:47`, `patterns.ts:219`) where `alt` plays root then 5th;
  `intervals.ts:35` "one size only" (true from the tonic, not of F–B); `gospel-progressions.ts:49` "step by step"
  (I to iii is a 3rd); `reading-chord-symbols.ts:101` "4 adds that note" (the kernel has no add4).
- **Keys that do not show the motion the text describes (P0):** a lesson's `chords` block places every chord from
  middle C, so "B rises to C" (`seventh-chords.ts:58`), "the bass walks down C, B, B♭, A" (`passing-chords.ts:77`),
  "the bass climbs F, F♯, G" and the walk-up (`gospel-passing-chords.ts:41,59`) never show. Options: voice-lead a
  block that is a progression (a `progression` block, or a `voiced` row), leaving galleries of chord kinds as they are.
- **A slash chord's bass outside the chord** (`C/D`, `F/G`) sits plain under the chord: labelling it needs a key
  face DESIGN does not have.
- **Repeats of a pattern's own description** in lesson text (CONTENT forbids): `bass-and-chords.ts:51,77,85`,
  `broken-chords.ts:20,33,47,68`, `right-hand-techniques.ts:32,45,58,72,87,102`; Боброва's seven over `amazing`, not
  `otche` (`accompanying-a-hymn.ts:67-68`); `ex3` called a progression; solfège in Russian prose beside lettered keys.
- **Russian terms that differ between screens:** «Доступные опции» / «Напряжения»; «Гармонизация мелодии» for
  Reharmonise; «Вторичная» / «Побочная доминанта»; «Квинтовый круг» / «кварто-квинтовый круг»; «7 типов» / «видов»;
  the half-diminished 7th's name; «Лад от» for "Mode of"; `stacks.ts` "Stack Your Chords" has no Russian.
- **Design:** a chosen or lit key's honey on a white key (about 1.6:1) and the pressed loop's sand fill (about 1.2:1)
  fall under 3:1 (WCAG 1.4.11); DESIGN chose both. Audio that cannot start (iOS after a call) leaves Play on Stop with
  no line saying there is no sound: where that line goes is a design decision.
- **Printed labels:** ADR 0010's "a small printed label on everything" against round buttons named only for a
  screen reader: which reading holds.

## The test that shows it

Content and design: none until the owner decides.

## The fix

The owner's.

## Comments
