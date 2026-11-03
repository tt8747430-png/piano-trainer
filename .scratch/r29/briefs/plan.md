# Brief: write the exact plan (no code)

The owner wants every remaining item of round 29 described exactly before anything is built, because
generic descriptions led to wrong builds. You write the plan for ONE area (given in your task). Do not
change code, do not commit, do not run tests or a dev server.

Read first:
- `.scratch/r29/prompt.md`: your area's items in full, plus "Decided" (especially **item 20, the owner's
  corrections of 2026-11-03, which win over everything else**) and the standing rules.
- The audit of what exists: `.scratch/r29/compliance/part-a1.md`, `part-a2.md`, `part-b.md`, `summary.md`.
- `.claude/skills/owner-way/SKILL.md` and `references/feedback-log.md` (what the owner already rejected),
  `CLAUDE.md`, `DESIGN.md`, and `docs/UBIQUITOUS_LANGUAGE.md` for names.
- The code each item touches (read only what you need): find what exists today before describing a change.

For each item (every open or partial item and every contradiction in your area; skip what the audit
found DONE unless the owner's corrections change it), write exactly this:

### <ID>: <title>
- **Source:** the prompt's item and bullets (line numbers), and any owner correction that changes it.
- **Today:** what the app does now, with the files (one to four lines; quote a label if it matters).
- **Will build:** concrete, testable. The screen and its route; where it is reached from; each control
  in order with its kind (row, switch, menu, stepper, segmented, button) and its exact English label;
  its values and default; what moves where (from which page/file to which); what is removed. Name the
  professional term a musician or Flat/Dorico/MuseScore/Sibelius uses for each label. No "improve",
  "better", "polish" without saying what changes.
- **Not in this item:** what someone might assume but is not done here.
- **Done when:** checks a reviewer can run: the tests to write (what they assert), screenshots (which
  screen, at 390×844, 844×390, 1280×800), and the behaviour seen.
- **Owner's question** (only if the prompt truly leaves it open; give the default you'd take).

Also, at the top of your file: a short **"Corrections to earlier descriptions"** list: places in
`progress.md`, `audit.md`, the specs under `.scratch/r29/*/spec.md`, the ADRs or DESIGN.md that describe
something wrongly or vaguely in your area (quote and correct each).

Write in plain English, short sentences, no marketing words. Write to the output file in your task.
Report back in under 12 lines: how many items, the open questions for the owner, the biggest surprises.
