# Report: the Chord player (R29 CP1–CP6)

Branch `worktree-agent-af37b367ecebf3919`, fast-forwarded to `claude/keen-gates-q9bnit` (a2b4e0cd) first.
Commits `2b5d4bee..9a0c6353` (9 commits). Checked per commit: typecheck, lint, the related tests; build after the
routes (passes). The full suite was not run (the merge's job).

## Built, per item

- **Spec and research first:** `.scratch/r29/chord-sheets/spec.md` (store and route), `.scratch/r29/research/musicca-styles.md` (how Musicca builds styles; facts only).
- **CP2 kernel** (`shared/lib/arrangement/chord-sheet.ts`, `chord-sheet-text.ts`; `music/progression-random.ts`): sections ×1–8 with a variation, chords of 1–8 beats end to end across bar lines; resize (the next chord gives or takes), move (the chords move, the lengths stay), insert, delete (beats to the bar), relay meter, transpose, play order with first and fill bars, `sheetToChart`, the text form, `randomProgression` (T→S→D→T, seeded).
- **CP3** `arrange-style.ts`: piano by pattern (per section), bass by degrees (root, 5th, octave, 3rd, approach), changing with every chord struck; drums by a 16-step velocity grid; fill, crash, swing as triplets, block voicing. **37 styles in 13 families** written by us (`entities/pattern/content/styles`), Pop 1 first; Accompaniment's patterns (and the learner's own) as piano-only styles.
- **CP5** `entities/chord-sheet` (`pt-chord-sheets` v1, synced as `chord_sheets`), `features/manage-chord-sheets`; migration `supabase/migrations/20261104100000_chord_sheets.sql` (no drops), `push_documents`, purge list, types.
- **CP4** engine (`widgets/chord-player/model/engine.ts`): a chord queued 0.1 s ahead from the sheet as it stands (edits at the next chord, tempo too), lit box on the audio clock, count-in, repeat or loop a section, last chord rings 3 s, Stop fades over 2 beats, cut off by any other sound, its clock a Worker.
- **CP1/CP2 page** `/practice/chord-player`: head (name → Library, Style sheet with a bar heard, Tempo, key → Settings), sections dragged by handle, boxes typed into / Enter or double tap for choices (symbol, length, bass, passing chords to the next box) / Backspace with Undo / Shift+arrows or edge drag / dragged to reorder; Randomize with Undo; Add section (hidden at 12); ⌘Z ⇧⌘Z; Space plays; ⋯ New (asked) · Save as my chord sheet… · Share link; floating Play · Loop · Practise in the Player. Practice tile (Playing group), Search via Practice's pages, parents, Progressions ↔ Chord player links.
- **CP6** `/practice/chord-player/settings`: Instruments (on/off + level, one stays on, parts the style lacks not drawn), Playing (Count-in, Repeat, Volume), Music (Time signature with Undo, Transpose −5…+6 "C major → D major", Written as, Voicing), On-screen piano ›, Connect a piano ›. Registry home `chord-player`.
- Docs: ADR 0112 amended, glossary rows. Screenshots `.scratch/r29/shots/after/cp-{page,settings}-{320,390,1280}.png` (no horizontal overflow at any width).

## Rulings taken (cost if wrong)

1. Written as / Voicing are new `pt-settings.chordPlayer` preferences (not Progressions'). Cost: one more pair of settings.
2. The sheet in hand is kept in the store (`scratch`), not the URL; `?p=&key=` and `?share=` are read once into it with Undo. Cost: a URL is not the whole state.
3. Transpose is a per-sheet setting applied when showing and playing; typing under a transpose writes back in the sheet's key.
4. Time-signature change: a chord of whole bars stays whole bars (C(4) G(4) → C(3) G(3)); others keep their beats.
5. Choosing a 3/4 style (Waltz, Jazz waltz) lays the sheet into 3/4 with Undo; a style sets the tempo to its own.
6. Classical and Hymn styles are piano-only (Hymn 2 adds bass); the brief's test named only Hymn 1.
7. The tile went into the existing **Playing** group (no Harmony group exists on this branch).
8. Passing chords (P14) live in the chord's choices sheet ("Leading to …"), not a + between boxes; no typed "Your own chord" field beyond the symbol field.
9. Section names are the seven kinds only; no free-typed names.
10. Box reorder is within a section (the kernel's `moveChordAcross` exists, unused by the UI).

## Left, and why

- **Must do before merge:** apply the `chord_sheets` migration to the Supabase project (no tool here); until then that store's sync push fails.
- Export audio (CP4): needs the recorded instruments first (brief ruling 7).
- Practise in the Player opens `/play/progression` with the chords as numerals (lengths and sections lost); shown only when every chord reads as a numeral. A Player route for a whole chord sheet is not built.
- The staff of the piano part under the sheet (P15 `Sheet`), the roles' bass-move arrows between boxes, "Practise in all 12 keys" and "Songs with this progression" on this page: not built (P15 is not on the branch).
- E7 in C reads "III7" from the kernel's `numeralOf` (not V7/vi): an existing kernel limit.
- The Worker clock covers the engine's queueing; the audio output's own look-ahead timer (shared/api/audio, not mine) still uses page timers.
