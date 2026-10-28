# Make the memory-palaces docs concise and current

Paste everything below the line into a new Claude Code session on `tt8747430-png/memory-palaces`. It repeats there what was done to piano-trainer's docs on 2026-10-27, adapted to that repo.

---

## Goal

The repo's documentation is short, current and in one place per topic. Every rule that still binds is kept and checked against the code. Nothing stale, duplicated, finished or unused is left: no old specs, bug lists, status notes, prompts lying in `docs/`, or skills the repo never uses.

## Context

- **Branch:** work on the session's branch. First fetch and check that it is level with `main`.
- **Read first:** `CLAUDE.md` and every file in `docs/`.
- **What was found when this prompt was written** (check it again, it may have moved):

  | Where                                   | What is there                                                                                                                                                                                                                                                                            |
  | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `docs/`                                 | `1.Other_DontRead.md` (the owner's raw prompts), `2.Bugs.md`, `3.Fixed_Bugs.md` (38 KB), `CODE_STYLE.md` (49 KB), `DECK_SETTINGS_UI_STATUS.md`, `MOBILE_DESIGN.md`, `NEW_ARCHITECHTURE.md`, `UBIQUITOUS_LANGUAGE.md` (20 KB), `adr/` (7), `agents/`, `superpowers/` (14 specs and plans) |
  | `.scratch/`                             | two finished bug batches (15 files)                                                                                                                                                                                                                                                      |
  | `.claude/skills/` and `.agents/skills/` | about 60 installed skills, listed in `skills-lock.json`                                                                                                                                                                                                                                  |
  | `CLAUDE.md`                             | 13 KB; a good size, but check it is current                                                                                                                                                                                                                                              |

- **The model to follow:** piano-trainer did this already. Read its result for shape, not content:
  - `CLAUDE.md`;
  - `docs/CODE_STYLE.md`;
  - `docs/UBIQUITOUS_LANGUAGE.md`;
  - `docs/adr/README.md` and one ADR;
  - `prompts/`;
  - `.claude/skills/owner-way/`.

  It's at `https://github.com/tt8747430-png/piano-trainer` (public; clone it read-only beside this repo).

- **Skills to use:** `humanizer` and `writing-guidelines` for every doc you write. `codebase-design` and `domain-modeling` where you judge what an ADR or the glossary should hold.

## Task

Run it as parallel worktree agents, split by files so no two edit the same doc. A good split:

- **Agent 1:** the ADRs, the specs, the bug files and `.scratch`.
- **Agent 2:** `CLAUDE.md`, `PRODUCT.md`, a README, and `docs/agents/`.
- **Agent 3:** `CODE_STYLE.md`, the mobile and design docs, and the glossary.
- **You:** the prompts folder and the repo clutter.

1. **ADRs, as one current record per decision area.**
   - Read every ADR and spec. Group them by the area they decide today.
   - Write one concise record per area: context, the decision as it stands now, consequences, and a short History list.
   - Delete what is superseded or folded in.
   - Add `docs/adr/README.md` with one line per record.
   - If ADRs are renumbered or deleted, write an old → new mapping and a small script that rewrites "ADR 0xxx" citations in code comments and docs. Run it, then grep that no citation to a deleted ADR remains.
2. **Specs, plans and status notes.** Fold anything still true from these into the right ADR or doc, then delete them:
   - `docs/superpowers/`;
   - `NEW_ARCHITECHTURE.md`;
   - `DECK_SETTINGS_UI_STATUS.md`.
3. **Bugs.** The local issue tracker is `.scratch/` (see `docs/agents/issue-tracker.md`).
   - Move each still-open bug from `2.Bugs.md` into `.scratch/` as one issue file, then delete `2.Bugs.md`.
   - Delete `3.Fixed_Bugs.md`, after folding any rule it taught into CODE_STYLE or an ADR.
   - In `.scratch/`, delete every issue that is done or obsolete. List what stays open in your report.
4. **CLAUDE.md.** Check every line against `src/`.
   - **Keep:** the rules that bind, the layers and their import fences, what each layer holds with a few examples, a short map of the places and slices, the commands, the test conventions and the read-before-you-touch list.
   - **Drop:** inventories the code already shows, history, and anything stale.
   - **Keep the owner's own rules exactly,** such as "Be extremely concise. Sacrifice grammar for the sake of concision." at the top.
5. **CODE_STYLE.md (49 KB) and MOBILE_DESIGN.md.**
   - Make CODE_STYLE the one place for how code is written: TypeScript, React, the UI kit, layout and mobile, motion, i18n, tests. Aim for well under half its size.
   - Merge MOBILE_DESIGN into it, or keep it separate only if it is truly a different topic. Decide, and say why.
6. **The glossary.**
   - One line per domain term: its meaning in a sentence, the code name where it differs, and the words to avoid. No implementation detail or history.
   - Drop terms of removed features: grep `src/` and the locales.
7. **PRODUCT.md and a README.** Check PRODUCT.md against the app as it is now. Add a short README if there is none: what the app is, how to run it, where the docs are.
8. **Prompts.**
   - Make `prompts/` with an index (`README.md`) and the shape every prompt follows: Goal, Context, Task, Constraints, Done means, Report.
   - Turn each prompt in `1.Other_DontRead.md` into one structured prompt file. Check whether each request is already built; if it is, make it a regression check, not new work, and say so in its file.
   - Delete `1.Other_DontRead.md`.
9. **Unused files and skills.**
   - **Skills:** list every installed skill and remove those this repo never uses, from `.claude/skills`, `.agents/skills` and `skills-lock.json`. Supabase is used here, so its skills stay; judge each skill by this repo, not by piano-trainer.
   - **Tracked clutter:** remove tracked logs, build output and design mockups whose direction is already chosen and recorded.
   - **Ask before deleting** data the app doesn't read but the owner may want: anything like piano-trainer's `piano-data/`, reference screenshots or `.codex/`.
10. **The owner's skill.** Copy piano-trainer's `.claude/skills/owner-way/` into this repo.
    - **Keep** the owner's general rules: the quality bar, no legacy, phone equals desktop, ⓘ popups, no trapped clicks, the workflow, reporting.
    - **Replace** the piano-specific reference apps and the feedback log with this repo's own, gathered from its docs and history.
    - **Point** CLAUDE.md at it. CLAUDE.md holds the repo's rules and the skill holds the owner's preferences, with no repetition between them.

## Constraints

- **Code:** this is a documentation round. No app behaviour changes; only comments change in code.
- **Writing:** plain words and short sentences, with no AI-sounding phrasing. Say each rule once, in the one doc it belongs to, and link instead of repeating.
- **Accuracy:** describe the code as it is now. A claim you can't confirm in `src/` goes, or is marked as an open question.
- **Agents:**
  - Each agent commits each finished task with a clear message.
  - Agents run `typecheck` and `lint` only, never the full suite.
  - Never `npm run format`; run prettier only on the files you touched.

## Done means

- Every doc listed above is rewritten, merged into another, or deleted, and nothing links to a deleted file. Check every Markdown link resolves.
- No code comment cites a deleted ADR or spec.
- On the merged branch, `npm run typecheck && npm run lint`, the full test suite and the build pass once.
- The branch is pushed and merged to `main`.

## Report

- **A size table**, before → after for each doc, and the ADR count.
- **What was deleted** and where anything still true went.
- **The open issues** kept in `.scratch/`.
- **The skills removed.**
- **The questions that are the owner's:** what to do with data the app doesn't read, and any doc you weren't sure about.
