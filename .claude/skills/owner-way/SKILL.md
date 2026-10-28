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
| Metronome, time/key/clef/tempo pickers | the owner's screenshots |

When the owner points at a reference, study how that app actually behaves: its help docs, its layout on a phone and on a desktop, its icons and names. Then come as close as our look allows. "Try to make it as close as possible to this" means the layout, the interaction and the features, not a loose nod to them.

## Rules the owner holds every change to

These come straight from their feedback. Each has burned a round before.

**No half measures**
- No legacy code, backwards compatibility, workarounds, duplication or unfinished work. Saved data need not survive a shape change (CLAUDE.md, Change rules).
- If something is missing, implement it and extend the app rather than leaving it out. When you refuse or defer a part, say why and propose how to build it.
- One implementation of a thing, used everywhere. The same control looks and behaves the same in the Player and the editor (Transpose, selection, header, transport, View).

**Layout**
- Phone and desktop have the same features, text and layout logic. Check an iPhone (390×844 and 320×568), a phone on its side (844×390) and a laptop (1280×800). Nothing may be clipped, overflow or wrap badly at 320px.
- Floating things float. Palettes, the transport, the zoom controls and the tools reserve no space under them and never push the page. Auto-hide must be reliable.
- Nothing may trap a click meant for something else. After a popover closes, the next tap must reach its target. Test overlapping layers.
- Controls must not jump when switching modes (Player ↔ editor) or entering Select mode. Icons stay put and heights stay equal.
- Rows and grids are even on wide screens, and a card's hover never hides the hover of a button inside it.

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

## How the owner wants work run

1. **Before starting:** fetch and check that the branch is level with `main` (`claude/keen-gates-q9bnit` unless told otherwise).
2. **Work in rounds, in a loop.** Keep going round after round without asking. Stop only for decisions that are genuinely the owner's, and put those as clear questions at the end of the report. When the owner says "continue", pick up exactly where the work stopped.
3. **Do the work yourself; agents are the exception.** The owner pays for every agent's context: each one starts from nothing, rereads CLAUDE.md, the docs and the code, and its report lands back in yours. Five agents cost about five sessions. The rule is the *maximum principle*: the best result for the least usage. So:
   - **By default you work inline**, one task after another, in this session: read only what the task needs, edit, run the tests it reaches, commit. Most rounds, including feature rounds and bug hunts, are done this way.
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
     - Give every long background command a limit (`timeout 1800 …`).
     - Stop processes by PID, never by a pattern; when merging an agent, stop its dev server and loops too.
     - Before reporting a round done, list what is running (`ps -eo pid,etime,args | grep -E 'vitest|vite|sleep|until'`) and stop whatever is yours and finished.
   - **Flaky tests:** a test that fails only under load and passes alone gets made robust (e.g. a longer wait on engraving), and you say so.
5. **Commits:** one proper commit per finished task. The message says what changed and why and ends with the session's attribution lines. Prettier never runs on CLAUDE.md.
6. **Merge and push:** once the merged suite and the build are green, update the docs (see below), then run `git push -u origin <branch> && git push origin HEAD:main`. Remove finished worktrees and their branches.
7. **Context:** keep it under about 300k tokens. Read the part of a file you need (offset and limit, grep), never whole long files; keep tool output short (filter test and build output to the summary lines). When reading a large batch of pages or images is unavoidable, one cheap read-only agent writes notes to a file.
8. **Data and content:**
   - **Transcriptions:** a transcribed score must match the source note for note. Check it again before merging.
   - **Bobrova:** material from Bobrova's books is credited to Bobrova, as is everything marked "n.b.".
   - **Music theory:** check theory content in English and Russian, and rewrite AI-sounding text plainly.

9. **Sources and research:**
   - **The owner's reference material** is in `piano-data/` (books, scores, screenshots of other apps, saved web pages in `piano-data/web-references/`). Read what the task needs; the app reads none of it at runtime.
   - **Saved pages are a starting point, not the whole source.** When they lack something the work needs (more fingerings, chord types, scales, progressions, terms), fetch the rest of the same sites (piano.org, musicca.com, vitapiano.com, the chord-chart sites, Flat's and Dorico's help) with WebFetch or curl, and search the web where no saved site covers it.
   - **Facts and behaviour only:** check every fact against music theory (sites have errors: note any you find), never copy wording, code or assets.
   - **Open-source references** (LilyPond, abcjs, Verovio, memory-palaces) may be read for how they solve a problem and, where licences allow, ported to TypeScript.
   - **Prefer an existing library** to hand-written code when one does the job well; say so before adding a package, and never `npm install` in a worktree.
10. **Merging to `main`:**
    - Code reaches `main` only after the full suite and the build pass on the merged branch.
    - Docs, skills, prompts and settings that touch no code may go to `main` at once (picked onto it), so the next session has them; say that you did.
    - Ignore Vercel's deployment status and CI; the local checks are the gate.
11. **When the usage limit stops the work:** wait for the reset, then resume each stopped agent with SendMessage from where it stopped (its work is saved), never start it again from scratch. When the owner says "continue", pick up exactly there.
12. **A question to answer, not a task to do:** when the owner asks something ("why …", "have you …", "what about …"), answer it first, in a line or two, before doing anything else; when they ask you to research and then say what you will do, stop after saying it.

## How to work well (the best practices this skill adopts)

`references/practices.md` holds the practices taken from superpowers (brainstorming, plans, TDD, debugging, verification, code review) and from impeccable (design), each in a line or two, with when to call which skill. Read it once a session, before the first task.

## Reporting

Keep reports short, answer first, no preamble or recap:
- what was built or fixed, in the owner's words for things (screens, controls), not file names;
- what was left and why;
- the decisions that are the owner's, as direct questions;
- the push state: branch, `main`, and whether tests and the build passed.

In a review loop, keep a running list of areas reviewed and areas left, and give it in each round's report.

If agents are running and the owner asks, say so; never guess their results. If something takes long, explain where the time goes and how to make it faster.

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
- **Never:** a model ID in a commit; copying Chordify's code; retrying bot-check circumvention against chordify.net. The owner's saved Chordify page holds their account details, so never copy it into the repo.
