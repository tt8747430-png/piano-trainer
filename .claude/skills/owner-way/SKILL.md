---
name: owner-way
description: How the owner of piano-trainer wants work done — their quality bar, UI rules, workflow (rounds, parallel worktree agents, testing, merging to main), reporting style and the reference apps they compare against. Use it at the start of every session in this repo and whenever the owner sends feedback, screenshots, "continue", "improve", "review in a loop", "make it like Flat/Dorico/Chordify/Mindscape", asks for agents or rounds, or asks why something takes long — even when they don't name the skill.
---

# Working for the piano-trainer owner

The owner is building Piano Trainer (React 19, Vite, strict TS, Feature-Sliced Design, en + ru, offline-first PWA) to the standard of real, shipped music apps. They write fast, often with typos, in English (sometimes German), and send phone screenshots of our app and of apps they admire. Read through the typos for the intent; the screenshots are the spec.

`CLAUDE.md` binds every change. This skill adds what the owner has said across sessions that CLAUDE.md doesn't spell out: how they judge the work and how they want it run. `references/feedback-log.md` holds their past feedback by area. Read it before touching an area, so you don't bring back something they already rejected.

## The quality bar

Compare against real apps, never against "good enough for a prototype":

| Area | Reference apps |
|---|---|
| Score editor | Flat, Dorico (iPad/desktop), Sibelius for iPhone, forScore, MuseScore, Soundslice |
| Engraving | LilyPond and abcjs rules, Verovio (the engine we use) |
| Player views, chords, lessons | Chordify (no guitar features) |
| Library, folders, archive, swipe actions, dialogs above the keyboard | Mindscape and the owner's `memory-palaces` repo, whose code you may copy |
| Metronome, time/key/clef/tempo pickers | the owner's screenshots, and the chordify apps and other references from the piano-data|
| New song / new score, creating things | Flat's new score (`piano-data/reference-apps/flat-score-editor`, IMG_4516–4522): one sheet, steppers, a key-signature grid, time tiles, Create pinned |
| Public library, publish, export, a deck's actions, Profile | Noji (`piano-data/reference-apps/new_app_2`) |
| Profile tab, Settings, the tab bar shown and hidden, selection bar | memory-palaces (`/home/user/memory-palaces`: `AppNav`, `BottomDock`, `ProfilePage`, `SettingsPage`), and also other best practices apps.  |
| Lesson and course editors | Obsidian's live preview, Notion/Craft's floating toolbar |

When the owner points at a reference, study how that app actually behaves: its help docs, its layout on a phone and on a desktop, its icons and names. Then come as close as our look allows. "Try to make it as close as possible to this" means the layout, the interaction and the features, not a loose nod to them.

## Rules the owner holds every change to

These come straight from their feedback. Each has burned a round before.

**No half measures**
- No legacy code, backwards compatibility, workarounds, duplication or unfinished work. Saved data need not survive a shape change (CLAUDE.md, Change rules).
- If something is missing, implement it and extend the app rather than leaving it out. When you refuse or defer a part, say why and propose how to build it.
- One implementation of a thing, used everywhere. The same control looks and behaves the same in the Player and the editor (Transpose, selection, header, transport, View).

**Secrets and config**
- Never commit `.env`, a key or any account value, not even one that is public by design (the Supabase URL and
  publishable key). Config lives in the host's environment variables (Vercel's), with a `.env.example` of names
  and placeholders in the repo; `.env*` stays in `.gitignore`.
- Security, secrets, accounts, hosting and what the repo exposes are never decided on the owner's behalf, not even
  in autonomous mode.
- Supabase: the project's MCP server is in `.mcp.json` (the owner authenticates it with `/mcp` on their computer); a
  cloud session uses its connected Supabase tools. The `supabase` skills come before any database work. You are allowed to do any supabase database actions. and in automonomous mode the supabase doesnt ask me to allow but you can directly do what you want and implement with the best practices. 

**Interaction** (rounds 24–25: each of these sent a round back)
- One way to each action: no button that repeats a row, menu item or field beside it. Adding a direct way removes
  the old one.
- Reorder by dragging a handle (mouse and a held finger), never Move up / Move down in a menu.
- Menu items short ("Remove"); the menu's label names the thing.
- A screen's own actions in its bar (Settings, Manage); the floating + only creates.
- One place current in the navigation at a time.
- Creating anything is a proper New sheet (name, a few properties, one Create at the foot), never a bare text
  field or a page with a title alone.
- When you change a pattern, change it everywhere it occurs (the score editor included), not in one place.
- Never ship a flaw you noticed and "report" it: fix it to the obvious right behaviour first.

**Layout**
- Phone and desktop have the same features, text and layout logic. Check an iPhone (402×874 check the real iphone 14 Pro app sizes in PWA Mode and in Safari mode), a phone on its side (check the real iphone 14 Pro app sizes in PWA Mode and in Safari mode) and a laptop (check the real  MacBook Air M3 15 Inch  app sizes. check the real sizes and real safari sizes ). Nothing may be clipped, overflow or wrap badly at check the real iiphone 14 Pro app  sizes. check the real sizes and real safari sizes .
- Floating things float. Palettes, the transport, the zoom controls and the tools reserve no space under them and never push the page. Auto-hide must be reliable.
- Nothing may trap a click meant for something else. After a popover closes, the next tap must reach its target. Test overlapping layers.
- Controls must not jump when switching modes (Player ↔ editor) or entering Select mode. Icons stay put and heights stay equal.
- Nothing hangs under a screen's bar: a status or a language goes in the bar or its menu, never a line of its own under it.
- Rows and grids are even on wide screens, and a card's hover never hides the hover of a button inside it.
- Nothing cut: titles wrap to two lines rather than end in "…"; rows inside a rounded card keep its corners.
- The phone's tab bar shows on the four places alone, hides on every screen they open and while the keyboard is
  up; a selection's bar takes its slot. Floating buttons keep a gap above the home indicator.

**Words and help**
- Explanations go in ⓘ popups (`InfoTip`), never in a line of text under a control. Keep pages calm and avoid "too much information at once".
- Use real musical language: "crescendo", not "get louder". Names must say what a control does and where its music comes from. "Tune" failed that test; so did "First chord" and "Nearest" with no picture.
- No hardcoded text printed on the score, and no labels the learner didn't write ("Your version").
- Menu names and icons fit, align and mean their action. One generic icon for many settings, such as an eye for everything, is wrong.

**The score**
- Everything printed on the score is editable where it prints: title, tempo, key, time, clef, staff names, chords, lyrics and fingering.
- Remove UI the score makes redundant. If a tap on the staff picks the staff, there is no staff selector.
- Selection is tight to the notes, the same in every layout and in both the Player and the editor. It can pick one note of a chord, and it never picks empty space.
- The playhead is one line across the staves in sight. It never jumps between staves.
- Staves are plain staves (add, remove, name, hide). There are no special "melody" options and no hand-split jargon.

**Motion**
- Strips and diagrams animate and swipe on their own. The page itself doesn't move.
- Tapping a chord moves the cursor there; it doesn't open a dialog.
- Transitions are smooth, and there is no flash of the other layout.

## The plan gate: describe, get it read, then build

Every item is built from a written plan the owner has read. Generic descriptions ("improve the settings", "fix
the metronome") produced wrong builds in round 29 and cost a full audit. The gate has three parts, in order:

1. **The item's spec, which the owner reads** (`.scratch/<round>/plan/<part>.md`), one block per item:
   - **Source:** the brief's item and bullets (line numbers), and any later owner correction that changes them.
   - **Today:** what the app does now, with the files.
   - **Will build:** the screen and its route, where it is reached from, each control in order with its kind and
     its exact English label (the term Flat, Dorico, MuseScore or Sibelius uses), values and default, what
     moves from where to where, what is removed.
- everythings must be built and not left. 
2. **The implementation plan, per subsystem** (`superpowers:writing-plans` / `writing-plans`, saved beside the
   spec): Goal, Architecture, Global Constraints copied verbatim from the brief and the owner's corrections,
   Review Focus, then tasks with files, interfaces, a failing test first, the command, the commit; the
   self-review against the spec at the end.
3. **The owner reads both.** Then it is built inline (owner-way 3; writing-plans' "Native" with
   `executing-plans`), one task one commit, each commit naming its brief item ("A39: …").

Before building an item, re-read its section of the brief (not memory, not the progress file) and the owner's
latest corrections; the latest words win. Keep the brief's round order: a round is closed (items done, round
report, impeccable audit, full gate recorded) before the next starts.

| Thought | Reality |
|---|---|
| "The owner asked for it directly, I can just build it" | Plan it, and implement it with the best practices; a direct request is still an item.  |
| "I remember what the brief says" | Re-read the section; the audit found builds against lines that were remembered wrong. |
| "A reference app does it differently, I'll follow that" | The brief and the owner's corrections decide; a reference informs, it does not overrule . |
| "progress.md says done" | It was wrong for 14 items; check the code. |
| "It's only docs or a small fix" | Small fixes skip the implementation plan, not the description. everythings must be built and not left, and everything that is build must be documented in docs.|

## Asking the owner: show it, recommend, or decide

Round 29's questions came back as "I need more context how it will look like", "what do you mean with one row",
"what is hymn 1", "I don't know how it will look like to take this decision". The owner decides by seeing, not by
reading options. So:

- **Decide what is not theirs.** "Use proper decision", "what is the best option", "why do we need this
  distinction", "why do you need them" all mean: research it (the reference apps, the books, the platform's
  guidelines) and decide, then log the ruling. Never ask about how the code is built, a distinction inside the
  model, or a name only the code uses. In autonomous mode ask nothing (rule 2b below).
- **A question the owner must answer is drawn, in context.** Put it in an artifact with a mockup of the whole
  screen or row it changes (bar, toolbar, sheet, Settings page together), each option drawn side by side, at a
  phone's width and a laptop's. Use `impeccable` for the mockups; never ask about a control in isolation.
- **Each question names** where it lives (screen, route), what changes for the learner, the options in the
  learner's words (no jargon, no internal ids: say "the bar's one row: Close, title, Edit, gear", never "one
  row"), and your recommendation with its reason.
- **Numbered, so answers can be numbered.** The owner replies "1. yes 2. … 6. use proper decision". Read every
  answer against its number:
  - "yes" or "yes maybe": build it, refined by best practice;
  - "maybe": recommend and decide;
  - "I don't like neither": come back with new options, drawn;
  - "I need more context" or "I don't understand the question": redraw it with the whole screen and ask again.
- **One artifact per area** (the song page, the Player, the editor), every page and every option in it, with a
  feedback box per page. The owner writes feedback inside it, in the order they scroll. Read all of it, apply it,
  answer each comment there, and keep the artifact current. "Continue without my feedback for other pages" means
  apply the same patterns to the pages they skipped.
- **Their answer becomes the spec.** Write it into the item's plan block (the plan gate below) before building,
  in their words where they gave words.

## Skills: which one, when

Check for a fitting skill before acting (`using-superpowers`), read its current text, then follow it; this file
and CLAUDE.md win where they differ.

| Moment | Skill |
|---|---|
| Start of a session, and after every compaction | this skill, `references/practices.md`, the brief's sections in hand, `progress.md`, the plan |
| Writing the plan | `writing-plans`; `brainstorming` only where the owner's request leaves real choices open |
| Any screen, before shaping or editing it | `impeccable` (setup once a session: `scripts/impeccable context`; `reference/craft-floor.md` right before a UI edit; `audit` at each round's end) |
| Building | `executing-plans` (inline), `tdd` / `test-driven-development` (test first, watch it fail) |
| A bug or a failing test | `systematic-debugging` before any fix |
| Before saying done, fixed or passing | `verification-before-completion`: the command run and its output |
| End of a round | `requesting-code-review`; `receiving-code-review` for what comes back |
| Vercel config | `vercel:knowledge-update` (or `knowledge-update`) before touching `vercel.ts` |
| Database | `supabase`, `supabase-postgres-best-practices` |
| Prose the app shows, docs | `humanizer`, `writing-guidelines` |
| Editing a skill | `writing-skills` |

Superpowers' skills may appear without the `superpowers:` prefix (installed as personal skills). Installing a
skill or plugin from outside the repo is the owner's call: say what it is, its licence and source, and let them
add it.

## Agents that keep their work

A planning or audit agent writes its file at once (a skeleton of every heading) and saves after each item, so an
interruption loses nothing; its brief lives in `.scratch/<round>/briefs/`. An agent stopped by the owner can be
resumed, it also could be stopped by accident, stop only if you receive the word "stop".  when you start a new one, start it from  its saved file, never from scratch.

## Sources: direct implementation 

## How the owner wants work run

1. **Before starting:** fetch and check that the branch is level with `main` (`claude/keen-gates-q9bnit` unless told otherwise).
2. **A message is not a stop.** When the owner writes while work is running, take in what they say and carry on with the tasks in hand; stop only when they say "stop".
2b. **Work in rounds, in a loop.** Keep going round after round without asking. Dont stop at all, until you finish all taks you need to continue. at the end report what you did, with best practices. When the owner says "continue", pick up exactly where the work stopped.
   - **Never end a turn while work is left.** "Why did you stop?" came three times in round 29. A finished item,
     a pushed commit, a passing suite or a report is not a stopping point; the next item is. End only when every
     task is done and nothing must be left.
   - **Agents that stop are your work:** when one stops (usage limit, error), check what it committed and what
     is left, and continue until everytings is finished and nothing is left; never report it as done.
   - **"Continue with all" means autonomous mode.** Work through every open task (the plan's rounds, the review findings) one round after another, without asking anything, and everything must be implemented and nothing left:
     no AskUserQuestion, no "shall I…", no stopping to report between rounds. continue until everything is  implemented and nothing left. Keep the gate (typecheck, lint, the full suite
     and the build before `main`) and push each round. Stop only when every task is done, and everything is implemented and nothing left; then report with best practices.
3. **Do the work yourself; agents are the exception.** The owner pays for every agent's context: each one starts from nothing, rereads CLAUDE.md, the docs and the code, and its report lands back in yours. Five agents cost about five sessions. The rule is the *maximum principle*: the best result for the least usage. So:
   - **By default you work inline**, one task after another, in this session, a command that is more than 10 seconds must be run in background so that you can continue to do other thigns: read only what the task needs, edit, run the tests it reaches, commit. Most rounds, including feature rounds and bug hunts, are done this way.
   - **Use an agent only when all of these hold:** the work is large (hours, not minutes), it splits into parts that touch different files, each part can be briefed in under a page without the chat's history, and running them in parallel saves the owner real time. Two or three agents at most; never more than the parts that are truly independent.
   - **Cheap jobs get a cheap model:** reading saved pages, screenshots or docs to write notes, a mechanical edit with a complete spec, or a search goes to a smaller model (`model: "sonnet"`, or `"haiku"` for pure extraction), read-only, with no worktree. Judgment, design and multi-file code take the strongest model.
   - **Never delegate** a lookup you can do in a few tool calls, a review you could do by reading the diff, or work whose brief would need the conversation's history.
   - **Hand over files, not pastes:** a brief or a report that is long goes in a file; ask for short reports (what changed, the commits, what is left). Everything an agent prints stays in your context.
   - **An agent's "done" is a claim, not evidence:** check its diff and its tests before you merge.
   - When agents do run: split by files (`references/agent-brief.md`), copy the owner's screenshots to `scratchpad/<round>/owner/` with a written description, send mid-round feedback to the running agent with SendMessage, and resume a stopped agent rather than starting a new one.
4. **Testing** follows CLAUDE.md's "Verify before claiming done" and "Parallel agents". The owner repeats it: agents never run the full suite; you run it once on the merged result. Beyond that:
   - Never run two suites at once. Check `ps` before starting one, and never `pkill` with a pattern that matches your own command.
   - **No ghost tasks** (a loop or server left running after its work is done):
     - Wait for a background command by its own completion notice; don't write a waiting loop. If you must poll, poll its PID (`kill -0 <pid>`) or the line its log prints at the end. A loop on `pgrep -f <pattern>` finds itself when its own command holds the pattern and never ends.
     - Give every long background command a limit of about twice what it needs (`timeout 1800 …` for the full suite, up to the tool's 2 hours). The limit is for commands only; an agent or a long task has none, and is bounded by stopping what it started when it reports.
     - Stop processes by PID, never by a pattern; when merging an agent, stop its dev server and loops too.
     - Before reporting a round done, list what is running (`ps -eo pid,etime,args | grep -E 'vitest|vite|sleep|until'`) and stop whatever is yours and finished.
   - **Flaky tests:** a test that fails only under load and passes alone gets made robust (e.g. a longer wait on engraving), and you say so.
5. **Commits:** one proper commit per finished task. The message says what changed and why and ends with the session's attribution lines. Prettier never runs on CLAUDE.md.
6. **Merge and push:** once the merged suite and the build are green, update the docs (see below), then run `git push -u origin <branch> && git push origin HEAD:main`. Remove finished worktrees and their branches.
7. **Context:** keep it under about 450 tokens. Read the part of a file you need (offset and limit, grep), never whole long files; keep tool output short (filter test and build output to the summary lines). When reading a large batch of pages or images is unavoidable, one cheap read-only agent writes notes to a file.
8. **Data and content:**
   - **Transcriptions:** a transcribed score must match the source note for note. Check it again before merging.
   - **Bobrova:** material from Bobrova's books is credited to Bobrova, as is everything marked "n.b.".
   - **Music theory:** check theory content in English and Russian, and rewrite AI-sounding text plainly.

9. **Sources and research:**
   - **The owner's reference material** is in `piano-data/` (books, scores, screenshots of other apps, saved web pages in `piano-data/web-references/`). Read what the task needs; the app reads none of it at runtime.
   - **Saved pages are a starting point, not the whole source.** When they lack something the work needs (more fingerings, chord types, scales, progressions, terms), fetch the rest of the same sites (piano.org, musicca.com, vitapiano.com, the chord-chart sites, Flat's and Dorico's help) with WebFetch or curl, and search the web where no saved site covers it.
   - **Facts and behaviour only:** check every fact against music theory (sites have errors: note any you find), never copy wording, code or assets.
   - **Open-source references** (LilyPond, abcjs, Verovio, memory-palaces) may be read for how they solve a problem and, ported to TypeScript.
   - **Prefer an existing library** to hand-written code when one does the job well.
10. **Merging to `main`:**
    - Code reaches `main` only after the full suite and the build pass on the merged branch. such  command that is more than 10 seconds must be run in background so that you can continue to do other thigns
    - Docs, skills, prompts and settings that touch no code may go to `main` at once (picked onto it), so the next session has them; say that you did.
    - Ignore Vercel's deployment status and CI; the local checks are the gate.
11. **When the usage limit stops the work:** wait for the reset, then resume each stopped agent with SendMessage from where it stopped (its work is saved), never start it again from scratch.
12. **A question to answer, not a task to do:** when the owner asks something ("why …", "have you …", "what about …"), answer it first, in a line or two, before doing anything else; when they ask you to research and then say what you will do, stop after saying it.

## How to work well (the best practices this skill adopts)

`references/ux-principles.md` holds the UX and UI principles the owner asks every screen to follow (hierarchy, progressive disclosure, consistency, contrast, proximity, alignment, context, user control, feedback, accessibility; the Laws of UX), with a checklist per screen: apply it when shaping, refactoring or reviewing any screen. `references/practices.md` holds the practices taken from superpowers (brainstorming, plans, TDD, debugging, verification, code review) and from impeccable (design), each in a line or two, with when to call which skill. Read it once a session, before the first task.

## Reporting

Keep reports short, answer first, no preamble or recap:
- what was built or fixed, in the owner's words for things (screens, controls), not file names;
- what was left and why;
- the decisions that are the owner's, as direct questions;
- the push state: branch, `main`, and whether tests and the build passed.

IN a review loop everything must be implemented and nothing left.

## Repo facts the work depends on

- **Commands:**
  - **Dev server:** `npx vite --port <port> --strictPort`, run in the background.
  - **Playwright:** `require('/opt/node-tools/node_modules/playwright-core')` with `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`, deviceScaleFactor 2.
  - **Worktrees:** symlink `node_modules`, never `npm install` there.
- **Saved stores and their versions:** each entity's `model/store.ts`.
- **Docs to update each round:**
  - **ADRs:** amend the area's ADR (`docs/adr/README.md`), styled like 0105: the decision as it stands now, one line in its History. A new ADR only for a new area, added to the README's index. `DESIGN.md` where the look changed.
  - **Glossary:** rows in `docs/UBIQUITOUS_LANGUAGE.md`.
  - **CLAUDE.md:** its rules and short map, kept current: rename what was renamed and drop what was deleted. It stays a map, never a list of components; detail goes in the ADR.
- **Never:** a model ID in a commit. 
