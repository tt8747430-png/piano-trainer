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
| Settings, redesigned (Decided 21) | [`plan/settings.md`](plan/settings.md) (being written) | Replaces round 1's S0–S14: what the app's Settings holds, each page's own Settings (Practice pages, Player, editor, Songs, a folder, a song), the Metronome as a tool, every duplicate and its one home, from research |
| Practice, redesigned (Decided 21) | [`plan/practice-redesign.md`](plan/practice-redesign.md) (being written) | Replaces round 2 where Decided 21 differs: Chords (size, 7th, right hand, Play/Arpeggio, hands, the top), Scales and keys (tabs, root, octaves, settings by what they affect), Intervals' icons, Progressions (tabs, passing chords), tabs out of the bar, key pickers (no circle) and enharmonic names, one sheet everywhere, selection by the bar's beats, no overlapping cards |
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

## Questions for the owner

**Answered 2026-11-03 (prompt Decided 21):** round 1's 1–8 and the skills (committed). One shared confirmation;
one icon one meaning; no duplicates anywhere; proper Settings pages from research (the Metronome a tool with its
own Settings; the app's Settings restructured); Chords' Play and Arpeggio together but distinct; the sheets one
everywhere; no tabs that make a bar taller; no circle of fifths for picking a key; selection by the bar's beats;
the Practice pages redesigned (see the redesign part).

**Answered too:** the Library becomes a chord player like Musicca's (one page with Progressions and
Accompaniment); proper sound libraries for everything, the missing metronome sounds from Freesound CC0; Transpose
as above; import tests from the public MusicXML suites; layout templates Normal and Jazz plus the learner's own.

**Still open:** the questions the two redesign parts raise, added here when they're written.
