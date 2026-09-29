# The whole app, reviewed: most important first

- **Status:** decided by Claude 2026-09-30 on the owner's request, under the standing rule to decide and continue
  (no approval menus). The plan is [2026-09-30-whole-app-review](../plans/2026-09-30-whole-app-review.md).
- **Builds on:** CLAUDE.md, [CODE_STYLE](../../CODE_STYLE.md), [CONTENT](../../CONTENT.md),
  [UBIQUITOUS_LANGUAGE](../../UBIQUITOUS_LANGUAGE.md), every ADR, and the repo's `code-review` skill.

## 1. What the owner asked

> create a plan for reviewing the whole app from the most important to less important things. /code-review and use
> all the best practicies and skills, and reFActor all that you need. no legacy leftovers, no workarounds, no hacks,
> no backwards compatibility somethings. you can refactor and implement as you need and use best solutions.
> /vercel:react-best-practices /vercel-composition-patterns /superpowers:brainstorming

**Understood as:** review all of `src/` (and the config, `index.html`, the docs that steer code) in order of what
would hurt a learner most if wrong, with the repo's two-axis `code-review` and every best-practice skill that fits
each area; fix what the review finds, refactoring freely, so the code left behind is the final version: no
compatibility shims, no leftovers, no workarounds.

**Decided here (the owner did not say):**

1. **"No backwards compatibility" is about code, not the learner's data.** Re-exports kept for old import paths,
   aliases, deprecated props, old names, old URL forms and fallbacks for removed shapes all go. A learner's saved
   `pt-settings` and `pt-progress` keep loading (CLAUDE.md, "Saved data keeps working"): that is their practice
   history, not legacy code. A shape change still ships a `migrate` and a sanitising `merge`.
2. **The work runs on `main`,** one commit per tier (or per coherent group of fixes inside a big tier), never pushed
   without the owner's word (memory: commit on main).
3. **`legacy/index.html` stays:** it is a reference no code imports, and Phase 4's parity check reads it before the
   roadmap deletes it. It is not a leftover in the code.
4. **Out of scope:** new features, a visual redesign (Phase 3 set the direction; ADR 0007, 0010, 0011), content
   rewrites, and the pinned majors (TypeScript 7, Vitest 5, jsdom 30, jest-dom 7, eslint-plugin-boundaries 7,
   `@vite-pwa/assets-generator` 2): CLAUDE.md makes each bump its own change. Minor and patch updates are in.

## 2. Where the app stands (baseline, 2026-09-30, `9d33544`)

| Measure            | Value                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| Source             | 833 files; 30.3k lines outside tests (shared 11.9k, entities 6.9k, widgets 5.7k, features 2.8k, pages 2.2k, app 1.1k) |
| Tests              | 221 files, 2057 passing, **1 skipped** (`path.test.ts`, "from Phase 4"); 48 s           |
| Gates              | `typecheck` and `lint` clean; `build` passes                                            |
| Test noise         | jsdom prints "Not implemented: Window's scrollTo()" nine times                          |
| Entry chunk        | `index` 354 kB (117 kB gzip): React, the router, i18next and **both locales' every namespace** |
| Other large chunks | `ScoreView` 337 kB (VexFlow, lazy, expected) · `learn-screens` 173 kB · `use-services` 140 kB (a shared chunk named after its first module) · `KeyboardSettingsFields` 105 kB |
| Precache           | 64 entries, 3.28 MB: a 1 MB recording (wanted, ADR 0016) and Onest's Vietnamese, symbols and math subsets (not ignored like Literata's) |
| Hygiene            | no `eslint-disable`, no `@ts-` comment, no `vi.mock`, no non-null `!.`; 24 `as` casts, most in branded constructors (`midi`, `pitchClass`), one in `pt-progress`'s `migrate` |
| Files over ~200 lines (CODE_STYLE §1) | `search.ts` 429 · `arrange.ts` 389 · `engrave.ts` 387 · `chord-parts.ts` 358 · `router.tsx` 326 · `scale.ts` 277 · `chord.ts` 273 · `quiz-machine.ts` 254 · `PianoKeyboard.tsx` 251 · `chord-context.ts` 241 · `fingering.ts` 230 · `vexflow-notes.ts` 229 · `use-practice.ts` 217 |

The code is disciplined: the gates hold the layers, the kernel is fenced and heavily tested. So the review's value is
depth, not a sweep for lint: wrong behaviour under real timing and real saved data, one rule written twice, modules
that grew shallow or wide, a first paint carrying what it does not need, component APIs that grew flags.

## 3. Approaches considered

| Approach | How | Why not / why |
| --- | --- | --- |
| A. Layer by layer | shared → entities → features → widgets → pages → app | Orders by structure, not by harm: a leaking audio voice would wait behind a naming nit in `shared/ui`. |
| C. Findings first | One review of all 30k lines, then one ranked backlog | Thirty thousand lines in one pass yield shallow findings, and the backlog goes stale as the first refactors land. |
| **B. Tiers by harm (chosen)** | Eleven tiers, each one lens set over the whole app where that lens matters, most harmful first; each tier reviews, fixes and commits before the next | Ranks by what a learner would lose. Correctness tiers come before refactoring tiers, so the tests the early tiers add hold the later refactors still. |

## 4. How each tier runs

1. **Review, two axes, in parallel** (the repo's `code-review` skill). There is no feature diff, so the fixed point is
   the empty tree and the diff is the tier's paths:
   `git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904...HEAD -- <paths>`. Two `general-purpose` sub-agents in one
   message:
   - **Standards:** CLAUDE.md, CODE_STYLE, CONTENT, UBIQUITOUS_LANGUAGE, the skill's smell baseline, and the tier's
     best-practice rule sets (named per tier below; the agent reads the rule files it needs from
     `.claude/skills/<skill>/rules/`).
   - **Spec:** the ADRs and spec sections that tier's code implements (named per tier).
   A tier over about 3k lines splits by sub-area, each sub-area still two-axis. Agents report; they do not edit.
2. **Verify every finding in the main session:** read the code; a behavioural finding gets a failing test first
   (`tdd`). A finding that does not survive is dropped with its reason in the tier's issue file.
3. **Record** the survivors as `.scratch/app-review/issues/NN-<slug>.md` (the repo's issue tracker), each with a
   `Status:` line, its severity (§5), the rule it breaks, and the fix.
4. **Fix in severity order,** TDD for behaviour, refactor under green tests for structure. A fix that changes a rule
   written in a doc changes the doc in the same commit (CODE_STYLE, CLAUDE.md, an ADR where a decision moves).
5. **Gate:** `npm run typecheck && npm run lint && npm run test`, and `npm run build` for a tier that touches startup,
   routing, the PWA or config. `npx prettier --write` over the files touched only.
6. **Commit** on `main`, the tier's issues closed (`Status: done`, or `Status: wontfix` with the reason).

## 5. Severity

| Level | Means | Examples |
| --- | --- | --- |
| **P0** | A learner loses something or is taught wrong | saved progress dropped; a crash; a wrong note, spelling or chord name; the app not opening offline |
| **P1** | Wrong behaviour a learner meets | a sound that will not stop; keys stuck down; timing that drifts; a missing Stop; an unreachable control; a missing Russian string |
| **P2** | The code breaks its own rules or costs measurably | a layer or slice rule bent; one rule written twice; a first paint carrying another screen's code; a re-render per audio frame; a flag-driven component API |
| **P3** | Clarity | a mysterious name, a doc that drifted, a file past its size with no second job |

Every P0–P2 finding is fixed. A P3 is fixed when it is in a file the tier already touches or costs minutes; any other
P3 is closed `wontfix` with its reason. There is no "later" list.

## 6. The tiers, most important first

Each tier names its scope, the lenses its review carries, the leads the baseline already shows, and what done means.

### Tier 0. Baseline and gates

- **Scope:** the test run, the build, `package.json`.
- **Leads:** jsdom's `scrollTo` noise (TanStack Router resets the window's scroll on every navigation and jsdom has
  none: the setup gives the window a `scrollTo` as it gives `matchMedia`; never silence the console); the skipped path
  test (levelling the Path is roadmap sub-project 6, so the test moves to that work and ADR 0005 says so; a skipped
  test is a placeholder); minor and patch updates
  (`@tanstack/react-router`, `lucide-react`, `typescript-eslint`, `@types/node` within 24).
- **Done:** zero skipped tests, zero console noise, dependencies current within the pins, `test:cov` thresholds met
  and the coverage of widgets and pages recorded for Tier 9.

### Tier 1. Saved data, startup and offline (P0 ground)

- **Scope:** `entities/settings`, `entities/progress` (store, `mastery`, `changes`, selectors), `shared/lib`
  (`safe-storage`, `saved`, `store-context`), `index.html`'s `#theme-boot` and `#standalone-boot`, `main.tsx`,
  `app/App.tsx`, `app/providers`, `app/update-prompt`, `vite.config.ts`'s PWA block, `vercel.ts`.
- **Lenses:** CLAUDE.md "Saved data keeps working"; `vercel-react-best-practices` `client-localstorage-schema`,
  `js-cache-storage`, `advanced-init-once`; `vite-react-best-practices` §1 (rewrites, caching, build validation);
  ADR 0003.
- **Spec:** rewrite spec §5 (state), ADR 0003, ADR 0006, ADR 0016 (the recording's precache).
- **Verified while planning:** `pt-progress`'s `migrate` is a cast (`persisted as ProgressState`) where
  `pt-settings` sanitises (P2); **nothing listens for the `storage` event**, so with the installed app and a browser
  tab open, each saves its whole in-memory copy and the older one wipes the other's answers and marks (P0).
- **Leads:** the theme-boot script held to the store's shape by test; the update prompt's waiting worker; `/`
  rewritten to `/index.html` and whether its `Cache-Control` applies; precache of Onest's subsets the app never
  draws.
- **Done:** every saved shape since version 1 of each store loads in a test; two tabs never lose an answer; the
  offline app opens from the precache in `npm run build && npm run preview`.

### Tier 2. Sound, MIDI and the practice loop

- **Scope:** `shared/api/audio` (`web-audio`, `lookahead`, `sounding`, `recording-player`, the fake), `shared/api/midi`,
  `shared/lib/services`, `shared/lib/use-presses`, `typing-keys`, `features/practice`, `features/quiz`,
  `features/live-keyboard`, `features/connect-midi`.
- **Lenses:** effects that only sync with the outside world, and clean up under StrictMode's double mount;
  timers, animation frames and listeners released; the audio clock as the only clock; `vercel-react-best-practices`
  `rerender-use-ref-transient-values`, `rerender-dependencies`, `rerender-defer-reads`, `client-event-listeners`,
  `client-passive-event-listeners`, `advanced-effect-event-deps`, `advanced-use-latest` (and React 19.2's
  `useEffectEvent` where a ref only keeps a callback fresh).
- **Spec:** rewrite spec §2.7 and §8, ADR 0004, 0008, 0009, 0013, 0016.
- **Leads:** `usePractice` dispatches during render to reconfigure and keeps `latest` in an effect with no deps
  (`useEffectEvent` may be the honest shape); its Wait-mode effect depends on the whole `state`; `wholeFileMedia`
  makes an object URL it never revokes; `stop()` disconnects gains while oscillators run to their scheduled end;
  sounding keys followed every animation frame (who re-renders per frame?).
- **Done:** every hook's cleanup covered by a test that unmounts mid-sound; no subscription re-renders a screen per
  frame beyond the keys that change; every finding's test in place.

### Tier 3. The music kernel: right notes, one rule each

- **Scope:** `shared/lib/music` (27 modules), `shared/lib/arrangement`, `shared/lib/notation`,
  `shared/lib/schedule`, `shared/ui/score` (`engrave`, `vexflow-notes`).
- **Lenses:** CODE_STYLE §8 (spelling by letters, one table per rule: chord names, tensions, root spelling), the
  kernel fence, `improve-codebase-architecture` and `codebase-design` (deep modules, narrow interfaces),
  `domain-modeling`; `vercel-react-best-practices` `js-*` only where a function runs per note or per frame.
- **Spec:** rewrite spec §4, ADR 0013, 0014, 0017, 0019, 0020.
- **Leads:** `chord.ts`, `chord-parts.ts`, `chord-name.ts`, `chord-symbol.ts`, `scale-chord.ts` and `numerals.ts`
  each name or build chords: is any rule written twice? `music/index.ts` exports 236 lines of names: which are used
  outside the kernel, and which only by a test? `arrange.ts` (389), `chord-parts.ts` (358), `engrave.ts` (387): one
  job each, or two?
- **Done:** each music rule has one home and a test that states it; the barrel exports only what a caller outside
  the kernel imports; files over ~200 lines have one job or are split.

### Tier 4. Routes, URLs and every screen's states

- **Scope:** `app/router.tsx`, `app/routes/*`, `app/RouteError`, `RoutePending`, the layouts, `pages/*`.
- **Lenses:** CODE_STYLE §6 (search params) and §7 (lazy screens); CLAUDE.md "loading, empty, error and offline
  states"; `vercel-react-best-practices` `bundle-preload`, `bundle-dynamic-imports`, `async-suspense-boundaries`,
  `rendering-usetransition-loading`; `vite-react-best-practices` route splitting.
- **Spec:** rewrite spec §3, ADR 0003, 0012, 0020.
- **Leads:** `search.ts` (429 lines, every route's validators in one file: split by owner beside `router.tsx`, or one
  validator shape the widgets' view types drive); `router.tsx` (326); every `notFound()` case in a screen test.
  (Screens already preload on intent: `defaultPreload: 'intent'`.)
- **Done:** every route has a test for its default, an invalid param and its not-found; no screen without its
  loading, empty, error and offline state.

### Tier 5. Architecture and the domain model

- **Scope:** every slice's public API (`index.ts`), `entities/*` (piece, pattern, lesson, path, progression-library),
  the Learn tools' and references' widgets side by side (chord-finder, reharmonise, passing-chords, progressions,
  tension-explorer, key-explorer, interval-explorer, scale-explorer, chord-explorer), `features/play-example`.
- **Lenses:** `improve-codebase-architecture`, `codebase-design`, `domain-modeling`, `ubiquitous-language`
  (UBIQUITOUS_LANGUAGE), FSD rules; the smell baseline's Duplicated Code, Shotgun Surgery, Middle Man, Speculative
  Generality.
- **Spec:** ADR 0001, 0002, 0005, 0017–0021, CONTENT.
- **Leads:** the nine explorer and tool widgets were built in quick succession: shared shapes (a key pop-up, a played
  row, a card of chords) written more than once; exports no other slice imports (dead code); names that drifted from
  the glossary.
- **Done:** no export without an importer outside its own tests; each repeated shape has one home; the glossary and
  the code say the same words.

### Tier 6. Performance and the bundle

- **Scope:** `vite.config.ts` build, the chunk graph, `shared/i18n`, the keyboard and the Player's render paths,
  long lists.
- **Lenses:** `vite-react-best-practices` (all), `vercel-react-best-practices` §2 bundle, §5 re-render, §6
  rendering (`rendering-content-visibility`, `rendering-hoist-jsx`), CODE_STYLE §7.
- **Leads:** the entry chunk carries both locales' every namespace (load the chosen locale, and a screen's
  namespaces with its chunk?); `use-services` (140 kB) is a shared chunk: what in it is needed by the first paint;
  `KeyboardSettingsFields` (105 kB) for a popover; `learn-screens` (173 kB, lessons as content); the Profiler on the
  Player while Listen plays and on the keyboard under a glissando.
- **Done:** a measured before and after for each change (chunk sizes, the Profiler's commits per second); the first
  paint carries only the shell and the chosen locale's shell text.

### Tier 7. Component APIs and composition

- **Scope:** `shared/ui` (the kit, `piano-keyboard`, `score`; `primitives` only as the `shadcn` skill shapes them),
  every widget's and feature's `ui/`.
- **Lenses:** `vercel-composition-patterns` (all), CODE_STYLE §1–§4, the `shadcn` skill for primitives.
- **Leads:** `PianoKeyboard` takes fourteen props with the flags `selectable` and `map`; three pop-ups
  (`Dropdown`, `MultiDropdown`, `KeyDropdown`) over `OptionItems`; components past ~200 lines.
- **Done:** no boolean prop that selects a mode; compound components where a component grew a wide prop list; every
  file one exported component, about 200 lines.

### Tier 8. Accessibility, states, copy and i18n

- **Scope:** every screen, `shared/i18n`, the lessons' text.
- **Lenses:** `web-design-guidelines`, CODE_STYLE §5 (targets, focus, colour never the only cue) and §10 (copy),
  WCAG 2.2 AA.
- **Leads:** the keyboard's roving tab stop and names; focus return from every `Sheet` and popover; the Player's
  controls by keyboard alone; Russian strings for every lesson and state; a sentence that repeats its label.
- **Done:** every screen passes a keyboard-only walk and a screen-reader naming pass in its test; no copy rule broken.

### Tier 9. Tests

- **Scope:** every `*.test.ts(x)`, `src/app/testing`, `src/shared/test`.
- **Lenses:** CODE_STYLE §9, the `tdd` skill: behaviour a learner can observe, fakes over mocks, no timing sleeps.
- **Leads:** widgets have 5.7k source lines and 1.4k test lines (page tests cover them through `renderApp`: the
  coverage report says which branches no test reaches); the setup's 55 s share of a 48 s wall run.
- **Done:** every uncovered branch in a widget or page either tested or deleted; the suite's wall time recorded
  before and after.

### Tier 10. Docs that steer the code

- **Scope:** CLAUDE.md, CODE_STYLE, CONTENT, UBIQUITOUS_LANGUAGE, the ADRs, the roadmap's status.
- **Lenses:** `writing-guidelines`; each rule stated once, in the doc that owns it.
- **Leads:** CLAUDE.md's architecture section lists most exports by name, so every refactor above changes it: it
  keeps the rules and the map a newcomer needs, and the code stays the inventory.
- **Done:** every doc matches the code the tiers left; an ADR records any decision a tier changed.

## 7. Done, for the whole review

All eleven tiers committed; every issue file closed; the gates and `npm run build` green; the baseline table (§2)
measured again and appended to this spec as its outcome.
