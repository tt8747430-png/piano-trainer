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
| Metronome and the time, key, clef pickers    | the owner's screenshots, `piano-data/reference-apps`                           |
| New song, creating things                    | Flat's new score (`flat-score-editor`, IMG_4516–4522)                          |
| Public library, publish, export, Profile     | Noji (`new_app_2`)                                                             |
| Profile, Settings, tab bar, selection bar    | `memory-palaces`: `AppNav`, `BottomDock`, `ProfilePage`, `SettingsPage`        |
| Lesson and course editors                    | Obsidian's live preview, Notion and Craft's floating toolbar                   |

## Rules every change is held to

Each of these sent a round back. Screen-level rules are in [ui-and-mockups](references/ui-and-mockups.md).

- **No half measures.** No legacy, workarounds, duplication or unfinished work. If something is missing, build it. If you
  refuse or defer a part, say why and how it would be built.
- **Fix what you notice.** A flaw you saw is fixed to the obvious right behaviour before you report. Reporting it instead
  is not an option, unless fixing it is the owner's decision (below).
- **One implementation, changed everywhere.** A changed pattern changes in every place it occurs, the score editor too.
- **Check the code, not the claim.** `git log` before calling something missing; the code before trusting a progress
  file; an agent's diff before trusting its report.

## Whose decision is it

| Kind                                                                              | Who          | How                                                     |
| --------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------- |
| How the code is built, internal names, distinctions inside the model              | you          | decide, say nothing                                     |
| Texts, packages, samples, database changes                                        | you          | research the references, decide, log the ruling         |
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
   - **Not in this item.**
   - **Done when:** the tests and the screens.
   - **Owner's question,** only where the brief leaves it open, with the default.
2. **The implementation plan** per subsystem (`writing-plans`), beside the spec, for anything with several tasks.
3. **The owner reads both,** then it is built inline, one task one commit, each commit naming its item ("A39: …").

A small fix skips step 2, and its description is three lines in the report. A direct request is still an item. Before
building, re-read the brief's section and the latest corrections, never your memory of them. In autonomous mode the owner
does not read first: write the spec, build it, and log it.

## How work runs

- **Before starting:** fetch and check the branch is level with `main`.
- **Keep going.** A message is not a stop: take it in and carry on until the owner says "stop". A finished item, a pushed
  commit or a passing suite is not a stopping point; the next item is. End a turn only when every task is done or the rest
  needs the owner, and say which.
- **Answer questions first,** in a line or two, then carry on. Asked to research and say what you will do: stop after
  saying it.
- **"Continue with all" means autonomous mode:** every open task, one round after another, nothing asked, the sensible
  default taken and logged, the gate kept, each round pushed. Stop only when every task is done, or what is left needs
  credentials or an action only the owner can take.
- **Rounds:** a round closes with its items done, its report, an `impeccable` audit and the full gate, before the next
  starts. Keep the brief's order.
- **Work inline.** Each agent costs about a session. Use one only when the work is hours long, splits by files, briefs in
  under a page and parallel running saves the owner real time; two or three at most. Reading saved pages or a mechanical
  edit goes to a small model. An agent that stops is your work: check what it committed, then finish it.
- **Commits:** one per finished task, saying what changed and why, staged by path, ending with the session's attribution.
  The owner's standing rule is to commit each task without being asked.
- **Merge:** code reaches `main` only after the full suite and build pass: `git push -u origin <branch> && git push origin
  HEAD:main`. Docs, skills and settings that touch no code may go at once; say that you did. Ignore Vercel's status and CI.
- **Docs each round:** amend the area's ADR (the decision as it stands, one History line), `DESIGN.md` where the look
  changed, `CLAUDE.md`'s map when something is renamed or deleted.
- **Context:** stay under about 300k tokens: read the part of a file you need, filter output to its summary.
- **Usage limit:** wait for the reset and resume exactly there, never from scratch.
- **Leave nothing running:** list processes before reporting and stop yours by PID.

## Secrets, data and sources

- Never commit `.env`, a key or any account value, even a public one. Never read a learner's saved data.
- `supabase` skills before any database work. The Supabase server is in `.mcp.json`; the owner authenticates it.
- **A page with no licence is all rights reserved:** its code, audio and wording never ship; its facts may be used in our
  own words. Samples and fonts ship only under a licence that allows it, with source and credit recorded.
- **Transcriptions** match the source note for note, checked again before merging. Bobrova's material, and anything marked
  "n.b.", is credited to Bobrova. Music theory is checked in English and Russian, and sites' errors are noted.
- `piano-data/` holds the owner's books, scores and reference screens; the app reads none of it. When it lacks something,
  fetch the rest of the same sites or search. Prefer a good library to hand-written code, and say so before adding one.
- **Never:** a model ID in a commit; Chordify's code; retrying a bot check against chordify.net; copying the owner's saved
  Chordify page into the repo, since it holds their account details.

## Reporting

Short, answer first, in the owner's words for things (screens, controls), not file names:

1. What was built or fixed.
2. What was left and why.
3. The owner's decisions, numbered, each with its drawing's link.
4. The evidence: both test passes, the suite and build results, and the push state.

Never guess at a running agent's results. If something takes long, say where the time goes and how to make it faster.
