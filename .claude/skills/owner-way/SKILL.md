---
name: owner-way
description: Use at the start of every session in the piano-trainer repo, and whenever the owner sends feedback, screenshots, "continue", "improve", "review in a loop", "make it like Flat/Dorico/Chordify/Mindscape", asks for agents, rounds or mockups, asks why something takes long, or any screen is built or changed, even when they don't name the skill.
---

# Working for the piano-trainer owner

The owner builds Piano Trainer to the standard of real, shipped music apps. They write fast, with typos, in English and
sometimes German, and send phone screenshots of our app and of apps they admire. Read through the typos for the intent.
**The screenshots are the spec, and the latest words win.**

`CLAUDE.md` binds every change. This skill says how the owner judges the work and how they want it run.

## What to read, and when

| Moment                                | Read                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------- |
| Session start, and after a compaction | this file, [practices](references/practices.md)                        |
| Before touching any area              | that area's section of [feedback-log](references/feedback-log.md)      |
| Any screen, or a question to draw     | [ui-and-mockups](references/ui-and-mockups.md), `impeccable`           |
| Refactoring a whole screen or its settings | `redesigning-a-screen`                                            |
| Before saying a screen is done        | [testing](references/testing.md)                                       |
| Reviewing a screen                    | [ux-principles](references/ux-principles.md)                           |
| Starting an agent                     | [agent-brief](references/agent-brief.md)                               |

## The quality bar

Compare against real apps, never "good enough for a prototype". When the owner points at a reference, study how that app
behaves (its help docs, phone and desktop layouts, icons, names), then match the layout, interaction and features. A
reference shows what to add as well as what to copy. The brief and the owner's corrections still decide over it.

| Area                                         | Reference                                                                      |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Score editor                                 | Flat, Dorico, Sibelius for iPhone, forScore, MuseScore, Soundslice             |
| Engraving                                    | LilyPond and abcjs rules; Verovio, the engine                                  |
| Player views, chords, song lessons           | Chordify, without guitar features                                              |
| Library, folders, swipe actions              | Mindscape and the owner's `memory-palaces` repo, whose code may be copied      |
| Metronome and the time, key, clef pickers    | the owner's screenshots, the Chordify apps, other references in `piano-data`   |
| New song, creating things                    | Flat's new score (`flat-score-editor`, IMG_4516–4522)                          |
| Public library, publish, export, Profile     | Noji (`new_app_2`)                                                             |
| Profile, Settings, tab bar, selection bar    | `memory-palaces` (`AppNav`, `BottomDock`, `ProfilePage`, `SettingsPage`), and other best-practice apps |
| Lesson and course editors                    | Obsidian's live preview, Notion and Craft's floating toolbar                   |

## Rules every change is held to

Each of these sent a round back. Screen-level rules are in [ui-and-mockups](references/ui-and-mockups.md).

- **No half measures.** No legacy, workarounds, duplication or unfinished work. Everything must be built and nothing left.
  If something is missing, build it.
- **Everything built is documented in the docs,** small fixes included.
- **Fix what you notice.** A flaw you saw is fixed to the obvious right behaviour before you report. Reporting it instead
  is not an option, unless fixing it is the owner's decision (below).
- **One implementation, changed everywhere.** A changed pattern changes in every place it occurs, the score editor too.
- **Check the code, not the claim.** `git log` before calling something missing; the code before trusting a progress
  file; an agent's diff before trusting its report.

## Whose decision is it

| Kind                                                                              | Who          | How                                                     |
| --------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| How the code is built, internal names, distinctions inside the model              | you          | decide, say nothing                                     |
| Texts, packages, samples                                                          | you          | research the references, decide, log the ruling         |
| Any Supabase database action                                                      | you          | do it directly, with best practices; no need to ask     |
| What a screen looks like, where the owner is unsure or two ways are both fair     | the owner    | build your recommendation, then draw both and ask       |
| Security, secrets, keys, accounts, roles, hosting, what the repo exposes          | the owner    | never decided for them, even in autonomous mode         |
| Installing a skill or plugin from outside the repo                                | the owner    | say what it is, its licence and source                  |

An unanswered question never stops the work: take your recommendation, build it, and put the question at the end of the
report, drawn. The drawing is made in the same turn, even when the owner has gone to bed. When the owner says "use proper decision" or "what is the best option", research and decide.

## Plan before building

Generic descriptions produced wrong builds and cost a full audit. Every item is built from a written description.

1. **The item's spec** (`.scratch/<round>/plan/<part>.md`), with these parts in order:
   - **Source:** the brief's lines, and later corrections.
   - **Today:** what the app does now, with the files.
   - **Will build:** the route, how it is reached, each control in order with its kind, exact English label, values and
     default; what moves; what goes.
2. **The implementation plan** per subsystem (`writing-plans`), beside the spec, for anything with several tasks.
3. **The owner reads both,** then it is built inline, one task one commit, each commit naming its item ("A39: …").

Everything must be built and nothing left. A small fix skips step 2, not the description, which is three lines in the
report. A direct request is still an item: plan it and implement it with best practices. Before building, re-read the brief's section and the latest corrections, never your memory of them. In autonomous mode the owner
does not read first: write the spec, build it, and log it.

## How work runs

- **Before starting:** fetch and check the branch is level with `main`.
- **Don't stop at all until every task is finished.** A message is not a stop: take it in and carry on; stop only on the
  word "stop". A finished item, a pushed commit or a passing suite is not a stopping point; the next item is. End a turn
  only when every task is done and nothing is left, then report what you did. On "continue", pick up exactly where the work
  stopped.
- **Answer questions first,** in a line or two, then carry on. Asked to research and say what you will do: stop after
  saying it.
- **"Continue with all" means autonomous mode:** every open task (the plan's rounds, the review findings), one round after
  another, without asking anything: no AskUserQuestion, no "shall I…", no stopping to report between rounds. Keep the gate
  and push each round. Stop only when everything is implemented and nothing is left, then report.
- **A command over 10 seconds runs in the background,** so other work continues. That includes the suite and the build.
- **Rounds:** a round closes with its items done, its report, an `impeccable` audit and the full gate, before the next
  starts. Keep the brief's order.
- **Work inline.** Each agent costs about a session. Use one only when the work is hours long, splits by files, briefs in
  under a page and parallel running saves the owner real time; two or three at most. Reading saved pages or a mechanical
  edit goes to a small model. An agent that stops is your work: check what it committed and continue until nothing is left.
  A stopped agent can be resumed, since it may have stopped by accident. A new one starts from its saved file, never from
  scratch.
- **Commits:** one per finished task, saying what changed and why, staged by path, ending with the session's attribution.
  The owner's standing rule is to commit each task without being asked.
- **Merge:** code reaches `main` only after the full suite and build pass: `git push -u origin <branch> && git push origin
  HEAD:main`. Docs, skills and settings that touch no code may go at once; say that you did. Ignore Vercel's status and CI.
- **Docs each round:** amend the area's ADR (the decision as it stands, one History line), `DESIGN.md` where the look
  changed, `CLAUDE.md`'s map when something is renamed or deleted.
- **Context:** stay under about 450k tokens: read the part of a file you need, filter output to its summary.
- **Usage limit:** wait for the reset, then resume each stopped agent with SendMessage from where it stopped, never from
  scratch.
- **Leave nothing running:** list processes before reporting and stop yours by PID.

## Secrets and data

- Never commit `.env`, a key or any account value, even a public one. Never read a learner's saved data.
- Security, secrets, accounts and hosting are never decided on the owner's behalf, not even in autonomous mode.
- `supabase` skills come before any database work. The Supabase server is in `.mcp.json`; the owner authenticates it. In
  autonomous mode Supabase does not ask the owner to allow an action: do it directly, with best practices.
- **Transcriptions** match the source note for note, checked again before merging. Bobrova's material, and anything marked
  "n.b.", is credited to Bobrova. Music theory is checked in English and Russian, and sites' errors are noted.
- **Never** a model ID in a commit.

## Sources: direct implementation

- `piano-data/` holds the owner's books, scores and reference screens; the app reads none of it. When it lacks something,
  fetch the rest of the same sites or search.
- Open-source references (LilyPond, abcjs, Verovio, memory-palaces) may be read for how they solve a problem and ported to
  TypeScript.
- Prefer an existing library to hand-written code when one does the job well.

## Reporting

Short, answer first, in the owner's words for things (screens, controls), not file names:

1. What was built or fixed.
2. What was left and why.
3. Any decisions that are the owner's, numbered, each with its drawing's link.
4. The evidence: both test passes, the suite and build results, and the push state.

In a review loop everything must be implemented and nothing left.
