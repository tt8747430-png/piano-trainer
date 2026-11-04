# Brief: write the Part B plan (B1–B11)

Write `.scratch/r29/plan/part-b.md`: the plan for Part B of round 29, one block per item, before any of it
is built. Write the file's skeleton (every heading) first and save after each item, so an interruption
loses nothing. Read only what each item needs.

## Sources, in this order
- The brief: `.scratch/r29/prompt.md`, section "## Part B: features" (B1–B11, about line 1830) and the
  "Decided" items it cites (D1–D20; D20 and later owner corrections win). The latest owner words win.
- The plan format: `.claude/skills/owner-way/SKILL.md` section "The plan gate" (Source, Today, Will build,
  Not in this item, Done when, Owner's question with the default), and an example in
  `.scratch/r29/plan/rounds-3-4.md` (its A27 and T blocks).
- Where things stand: `.scratch/r29/progress.md` (B1 is partly built; B5 Learner view is built: Settings'
  "View as a learner" switch, `useLearnerView`, `src/app/learner-view/`; B7 partly; the rest open) and the
  rulings there.
- The code, for each item's "Today": read only the files the item touches (use grep). Reference apps are in
  `piano-data/reference-apps/` and the owner's `memory-palaces` repo at `/home/user/memory-palaces` (B1, B9,
  B10 copy its behaviour; read its pages named in the brief).

## What to write per item
- **Source:** the brief's bullets (line numbers) and any later correction.
- **Today:** what the app does now, with file paths (checked in the code, not remembered).
- **Will build:** routes, where each is reached from, each control in order with its kind and exact English
  label (as Flat, Dorico, MuseScore, Noji, Quizlet or memory-palaces name it) and its ru, values and defaults,
  stores and their versions, server changes (a migration without `drop`, its access tests), what moves and
  what is removed. Split a large item into numbered sub-items that can each be built and committed alone.
- **Not in this item.** **Done when:** the tests (file and test names) and screenshots (402, 393, 320, 874×402,
  1280).
- **Owner's question** only where the brief leaves it open, with the default taken.
- A **Build order** at the end (dependencies first: B7 and B5 are done or near; B11 waits on the Chord player
  merge; B1's server parts need the owner's Supabase session, list them as the owner's to-do).

## Rules
Facts only from unlicensed references; no code is changed by you; no secrets or account values in the file.
English, plain and short (the humanizer/writing-guidelines style the repo uses). When done, reply in under
150 words: the file path and the build order.
