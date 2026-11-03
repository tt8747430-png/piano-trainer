# Round 29: the plan (read this first)

Nothing is built before its item is here and the owner has read it (prompt, Decided 20). This file is the entry
point: what each part covers, the order of building, the conflicts between parts and how they are settled, and
every question for the owner in one list. The items themselves are in the three parts.

Map of the round's files: [`README.md`](README.md). The audit these items come from: [`compliance/summary.md`](compliance/summary.md).

## How each item is written

Each item in the parts has the same blocks: **Source** (the prompt's item and lines, and any owner correction),
**Today** (what the app does, with files), **Will build** (the screen and its route, each control in order with its
kind, exact label, values and default, what moves and what goes, the files, new functions with signatures, and the
tests by file and name), **Not in this item**, **Done when** (tests, screenshots at 390×844, 844×390, 1280×800),
and **Owner's question** where the prompt leaves one open. Each part opens with **Corrections to earlier
descriptions** (wrong lines in progress.md, specs, ADRs, DESIGN.md), quoted and corrected.

## The parts

| Part | File | Items |
|---|---|---|
| Round 1: the app as a whole | [`plan/round-1.md`](plan/round-1.md) | **S0–S14, the Settings structure (D20):** each Practice page, the Player, the score editor and Songs get their own Settings page from their own gear, like a lesson's; the app's Settings keeps only app-wide pages; duplicates removed ("Play notes while editing" one home); the registry and its tests. Then R5 floating actions, R17/A9 confirmations, R18 one home, R28/A19 wide screens, A2 app bar, A3 actions, A4 page/sheet/menu, A5 key pickers (not Transpose), A6 words, A8 shapes, A11 Learned, A15–A17 proofs, A38 the pencil |
| Round 2: Practice | [`plan/round-2.md`](plan/round-2.md) | **C1–C9, the contradictions:** added tones, rows that stay, walk names, Mode, the Key tab's picker, the interval songs, the Library as bar cells and Songs with four chords, Chordify's grooves (`grooveOf` on an 8th grid), the metronome's sound set (D16). Then A20–A25, A30 fingering, A31, A32, A33, A39 Metronome (volume, flash, tempo list), A41 Exercises and Quiz, A42, A43 |
| Rounds 3–4: sound, Player, editor | [`plan/rounds-3-4.md`](plan/rounds-3-4.md) | A26 on-screen piano, A27 the sampled grand (Salamander, mono, ~9 MB, loaded on first use, credit in Help), **T: Transpose (D20):** why the Player's is broken (it keeps a fixed key, `?key=B`, so the editor's rewrite is undone and labelled wrongly) and the fix (one popover in both, the Player keeping an offset `transpose=`), A28 own song's page, A29 imports and exports (MIDI key changes, .mxl, PDF), A34/A40 the editor against Flat, A35 staves (Clef), A37 chord views |
| Rounds 5–14: Part B | not written yet | B1 Profile, B2 copy, B3 Explore, B4 Edit in place, B5 Learner view, B6 publishing, B8 practice flow, B9–B11 customisation and Tools: planned after the owner has read rounds 1–4 |

## Order of building

1. **Round 1** (it was skipped: D20 and the audit put it first): S0–S14 (Settings), then R17/A9, R5, R18, R28/A19,
   A2, A3, A4, A5, A6, A8, A11, A38, A15–A17's screenshots. Close: report, impeccable audit, full gate, `main`.
2. **Round 2:** C1–C9, then A20–A43. Close as above.
3. **Rounds 3–4:** T (Transpose) first, then A27, A26, A28, A29, A34/A40, A35, A37. Close as above.
4. **Part B** once planned and read.

Each subsystem gets a `writing-plans` implementation plan (tasks: files, failing test first, command, commit)
before it is built, saved beside its part as `plan/<subsystem>.impl.md`, and is built inline task by task.

## Conflicts between the parts, settled

| Conflict | Settled as | Why |
|---|---|---|
| Fingering: round 1 puts a Fingering switch on Chords' page (`chords.fingering`); round 2 (A30) wants one app-wide | One app-wide **Fingering** switch in General; Scales keeps only its fingering **rule** (Standard · From the thumb), a different setting | D20 and R18: no setting on two pages |
| New song's key: round 1 (A5) the circle of fifths; rounds 3–4 the editor's key as Flat's 15-key grid | **Flat's key-signature grid** for New song and the editor; the circle stays the key picker on the explorers | owner-way names Flat's grid for New song; D20 takes the circle out of the editor's Transpose |

## Questions for the owner (the default is taken unless you say otherwise)

Round 1:
1. Chords: one Play, no separate Arpeggio button (S1)?
2. Scales: Octaves and Hands stay on the page, not on its Settings (S2)?
3. Metronome: its trainers stay on its face (S7)?
4. Exercises and Quiz: a drill's keys stay on its setup (S8)?
5. Songs: a Settings page now, with one row (S11)?
6. The app's "Sound and recording" page kept only if round 3 fills it (S12)?
7. The Player's Play stays a round icon (R5)?
8. On a phone, Scales and keys and Progressions show their views in the bar instead of the title (A2)?

Round 2:
9. Mode moves to Progressions' Settings as "Mode of typed numerals", with a "Read in Dorian ›" row on the page only
   when it isn't the key's own (C4)?
10. The Library: add every distinct loop of musicca's 269 (named by numerals where there's no common name), plus the
    23 "Songs with four chords" (C7)? Earlier I added only the 3 well-known missing ones; this adds many more.
11. Classic click and rimshot have no CC0 source in VCSL, ride only as a suspended cymbal: take them from Freesound's
    CC0 filter, or leave them out (C9)?
12. Fingering hand drawing: our own SVG (A30)?

Rounds 3–4:
13. The Player's Transpose moves what is heard and seen only; rewriting the song stays in Edit (T)?
14. Can you send the Fantaisie-Impromptu exported from MuseScore, Flat, Dorico, Finale and Sibelius for the import
    tests? Otherwise I make them with MuseScore and Flat (A29).
15. Layout templates: Normal and Jazz, plus the learner's own (A40)?

Skills:
16. Commit the superpowers, Understand Anything and Vercel `knowledge-update` skills into `.claude/skills` so every
    session has them (they are only switched on as plugins today)?
