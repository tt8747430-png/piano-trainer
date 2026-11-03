# Round 29 compliance: summary and fix order (2026-11-03)

Three read-only audits of the code against `.scratch/r29/prompt.md`: `part-a1.md` (standing rules, Step 0,
A1–A19), `part-a2.md` (A20–A43), `part-b.md` (How to work, D1–D19, B1–B11, Constraints, process).

## Contradictions (built against the prompt): fix first
1. A20 added tones: `addedOf` still leaves the diminished triad, power chord, augmented (add9 only) and sus2
   (add6 only) short, and a test asserts the gaps.
2. A20/A31: Chords' rows that don't apply vanish (7875ffe7), against "rows stay" (A31, 0a9069b4).
3. D16: metronome sounds in `public/sounds/`, no `SOURCES.md`, accent pitched not recorded, clave, rimshot,
   cowbell, classic click, open hat, ride missing.
4. A39: drum grooves were Chordify's (fixed in 884d7115).
5. R5: floating actions a right-edge column where the keys dock; Chords a capsule, Scales a lone circle.
6. R28/A19: Practice on a laptop in fixed uneven columns.
7. A5: editor key and Transpose not the circle of fifths.
8. A10/A12/A14: registry holds no label/control; pages hand-written. A14: "Play melody" still on Sound.
9. R18/B7: "Hear notes" drawn on two pages.
10. R17: removing a lesson from a course/level asks no confirmation.
11. A23: the Player's walk titles keep the old names; Mode on the page, not its Settings.
12. A42/A43: the Key tab's picker offers every scale; interval songs a hand-copied list.
13. D18: a Privacy paragraph reworded with `copy.md` empty.
14. B1: Profile hero shows email and the wrong figures; streak tile opens nothing.
15. Process: rounds out of order (round 1 open), one round report, no impeccable audit, a commit with three tasks.

## Claimed done but not
A2, A8, A9, A15–A17 (screenshots), A22, A24, A31, A32, B7; stale owner to-dos (Freesound, Fantaisie-Impromptu).

## Order
Round 1 closes first (the prompt's order): contradictions 5–10, 13, then A2, A3, A4, A8, A9, A19 and the
screenshots; then round 2's contradictions (1, 2, 3, 11, 12) and its unfinished items; then rounds 3–14 in order,
each round reported and audited (impeccable) before the next.
