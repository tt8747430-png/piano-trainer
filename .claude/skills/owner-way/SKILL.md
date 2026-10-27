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
- No legacy code, backwards compatibility, workarounds, duplication or unfinished work. Saved user data need not survive; bump the store version (ADR 0038). Built-in content must keep working.
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
3. **Parallel agents for big rounds.** Use worktree agents (`isolation: "worktree"`), each with a brief built from `references/agent-brief.md`.
   - **Scope:** split by files so no two agents edit the same component. Keep a round small enough to finish in well under an hour; split it rather than letting it grow.
   - **Screenshots:** copy the owner's screenshots into `scratchpad/<round>/owner/` with descriptive names, and describe each one in the brief, because agents can't see the chat.
   - **Mid-round feedback:** if the owner adds to a running agent's area, send it to that agent with SendMessage rather than starting another.
   - **Small fixes:** do them yourself; an agent needs the whole context re-explained.
4. **Testing (the owner was explicit, and repeats it):**
   - **Agents** run `typecheck`, `lint` and only the tests their changes reach (`npm run test:changed` / `test:related`). They never run the full suite. They run `build` only after touching startup, routing, the PWA or config.
   - **You** merge every agent's branch into the session branch, then run the full `npm run test` and `npm run build` once on the merged result. Never run two suites at once. Check `ps` before starting one, and never `pkill` with a pattern that matches your own command.
   - **CI** runs by hand only; the local checks are the gate.
   - **Flaky tests:** a test that fails only under load and passes alone gets made robust (e.g. a longer wait on engraving), and you say so.
5. **Commits:** one proper commit per finished task. The message says what changed and why and ends with the session's attribution lines. Never run `npm run format`; run prettier only on the files you touched, and never on CLAUDE.md.
6. **Merge and push:** once the merged suite and the build are green, update CLAUDE.md and the docs (ADR per round, glossary rows, DESIGN.md), then run `git push -u origin <branch> && git push origin HEAD:main`. Remove finished worktrees and their branches.
7. **Context:** keep it under about 300k tokens. Delegate file-heavy reading to agents and summarise.
8. **Data and content:**
   - **Transcriptions:** a transcribed score must match the source note for note. Check it again before merging.
   - **Bobrova:** material from Bobrova's books is credited to Bobrova, as is everything marked "n.b.".
   - **Music theory:** check theory content in English and Russian, and rewrite AI-sounding text plainly.

## Reporting

Keep reports short, answer first, no preamble or recap:
- what was built or fixed, in the owner's words for things (screens, controls), not file names;
- what was left and why;
- the decisions that are the owner's, as direct questions;
- the push state: branch, `main`, and whether tests and the build passed.

If agents are running and the owner asks, say so; never guess their results. If something takes long, explain where the time goes and how to make it faster.

## Repo facts the work depends on

- **Commands:**
  - **Dev server:** `npx vite --port <port> --strictPort`, run in the background.
  - **Playwright:** `require('/opt/node-tools/node_modules/playwright-core')` with `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`, deviceScaleFactor 2.
  - **Worktrees:** symlink `node_modules`, never `npm install` there.
- **Saved stores and their versions:** see CLAUDE.md's entities section. A shape change bumps the version, with no migration.
- **Docs to update each round:**
  - **ADRs:** amend the area's ADR (`docs/adr/README.md`), styled like 0105: the decision as it stands now, one line in its History. A new ADR only for a new area.
  - **Glossary:** rows in `docs/UBIQUITOUS_LANGUAGE.md`.
  - **CLAUDE.md:** its architecture map, kept current: rename what was renamed and drop what was deleted.
- **Never:** `git checkout`, `restore`, `stash` or `reset` the owner's work; a model ID in a commit; copying Chordify's code; retrying bot-check circumvention against chordify.net. The owner's saved Chordify page holds their account details, so never copy it into the repo.
