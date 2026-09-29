# The whole app, reviewed: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Review all of Piano Trainer in eleven tiers ordered by harm, and fix everything each tier finds, so the code
left is its final version: no compatibility shims, no leftovers, no workarounds.

**Architecture:** Each tier runs the repo's two-axis `code-review` (Standards and Spec sub-agents in parallel) over
its paths, verifies each finding in the main session, records survivors as issue files, fixes them in severity order
with TDD, passes the gates and commits on `main`. Tier 0 and the two findings Tier 1 already verified are written out
as code here; every other fix is written into its issue file when the review finds it, because a review's findings
cannot be known before it runs.

**Tech Stack:** React 19.3, Vite 8, strict TypeScript 6, TanStack Router, zustand 5 `persist`, i18next, Base UI +
shadcn, Tailwind 4, VexFlow 5, Vitest 4 + jsdom 29 + Testing Library, vite-plugin-pwa (Workbox).

**Spec:** [2026-09-30-whole-app-review-design](../specs/2026-09-30-whole-app-review-design.md)

## Global Constraints

- **Code has no backwards compatibility;** a learner's saved data does. No re-export for an old path, no alias, no
  deprecated prop, no old URL form. `pt-settings` and `pt-progress` keep loading every earlier version: a shape change
  ships a `migrate` and a sanitising `merge` (CLAUDE.md, "Saved data keeps working").
- **No workarounds:** no `as` cast outside a branded type's constructor, no `eslint-disable`, no `@ts-` comment, no
  arbitrary Tailwind value, no optional call that exists only for jsdom, no "tidy later" note (memory: no workarounds).
- **Pinned majors stay:** TypeScript 6, Vitest 4, jsdom 29, jest-dom 6, eslint-plugin-boundaries 6,
  `@vite-pwa/assets-generator` 1. Minor and patch updates go in.
- **Out of scope:** new features, a visual redesign, content rewrites, and `legacy/index.html` (the Phase 4 parity
  check reads it; the roadmap deletes it then).
- **Layers:** `app → pages → widgets → features → entities → shared`; another slice only through its `index.ts`; the
  kernel fence (`shared/lib/music` imports only itself; `arrangement` and `notation` only music; none a package).
- **Every UI string in `en` and `ru`;** loading, empty, error and offline states.
- **Tests:** colocated `*.test.ts(x)`, `globals: false`, fakes not module mocks, by role and accessible name, no
  snapshots; a screen's test beside its page through `renderApp`.
- **Format only what you touched:** `npx prettier --write <files>`. Never `npm run format`.
- **Gates:** `npm run typecheck && npm run lint && npm run test`; add `npm run build` after touching startup,
  routing, the PWA or config.
- **Commits** on `main`, never pushed without the owner's word, message in the repo's style (a sentence saying what
  changed, bullets for the parts), ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Docs move with the code:** a fix that changes a rule a doc states changes that doc in the same commit.

## The review procedure (every tier)

Every tier task runs these steps with the values its task gives. They are part of every task's requirements.

**R1. Review, two axes, in parallel.** Send one message with two `Agent` calls (`subagent_type: general-purpose`).
The diff is the tier's paths against the empty tree:

```bash
git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904...HEAD -- <tier paths>
```

Standards prompt (fill the angle brackets from the task):

```text
You are reviewing part of Piano Trainer (React 19 + Vite + strict TS, Feature-Sliced Design) at
/Users/kristianbraila/projectsGIT/School/piano-trainer. Read-only: do not edit any file.

Scope: `git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904...HEAD -- <tier paths>` (the whole of these files).
Commits: `git log --oneline -- <tier paths> | head -40`.

Standards sources, read them first: CLAUDE.md, docs/CODE_STYLE.md, docs/UBIQUITOUS_LANGUAGE.md<, extra docs>.
Best-practice rule sets for this tier (read each rule file you need from .claude/skills/<skill>/rules/):
<rule ids>.

Smell baseline (Fowler, Refactoring ch. 3). The repo overrides: a documented repo standard wins, and where it
endorses something the baseline would flag, suppress the smell. Each smell is a judgement call, never a hard
violation; skip anything tooling (tsc, ESLint, the layer rules) already enforces.
- Mysterious Name: a name that doesn't reveal what it does or holds → rename it.
- Duplicated Code: the same logic shape in more than one place → extract the shared shape.
- Feature Envy: a function reaching into another object's data more than its own → move it to the data.
- Data Clumps: the same few fields or params travelling together → bundle them into one type.
- Primitive Obsession: a primitive standing in for a domain concept → give it its own small type.
- Repeated Switches: the same switch/if-cascade on the same type recurring → one map both sites share.
- Shotgun Surgery: one logical change forcing scattered edits → gather what changes together.
- Divergent Change: one module changed for several unrelated reasons → split it.
- Speculative Generality: abstraction for needs nothing has → delete it, inline back.
- Message Chains: long a.b().c().d() navigation → hide the walk behind one function.
- Middle Man: a function or module that mostly delegates onward → cut it, call the target.
- Refused Bequest: an implementer ignoring most of what it inherits → composition instead.

Focus questions for this tier:
<focus questions>

Report, per file and line: (a) every place the code violates a documented standard or a listed rule: cite the
standard (file + rule) or the rule id; (b) any baseline smell: name it and quote the lines. Mark each hard
violation or judgement call, and give each a severity: P0 a learner loses something or is taught wrong; P1 wrong
behaviour a learner meets; P2 the code breaks its own rules or costs measurably; P3 clarity. Only findings you can
point to in the code; no general advice. Under 600 words.
```

Spec prompt:

```text
You are reviewing part of Piano Trainer at /Users/kristianbraila/projectsGIT/School/piano-trainer against the
decisions it implements. Read-only: do not edit any file.

Scope: `git diff 4b825dc642cb6eb9a060e54bf8d69288fbee4904...HEAD -- <tier paths>`.
Spec sources, read them first: <spec sources>.

Report: (a) requirements the sources state that the code misses or does partly; (b) behaviour in the code that no
source asked for and that a learner would notice; (c) requirements that look implemented but where the code looks
wrong, with the input that shows it. Quote the source line for each finding, cite file and line in the code, and
give each a severity (P0 a learner loses something or is taught wrong; P1 wrong behaviour a learner meets; P2 the
code breaks its own rules or costs measurably; P3 clarity). Under 600 words.
```

A tier whose paths hold more than about 3,000 lines outside tests runs one Standards and one Spec agent per sub-area
the task names, all in one message.

**R2. Verify in the main session.** For each finding: open the code at the cited line. A behavioural claim gets a
failing test before anything else (`tdd`); a finding whose test passes on the current code, or whose code does not
say what the agent claims, is dropped. A structural claim (duplication, a rule written twice, a wide API) is checked
by reading every site it names.

**R3. Record** each surviving finding as `.scratch/app-review/issues/NN-<slug>.md`, numbered on from the last file
(`ls .scratch/app-review/issues | tail -1`):

````markdown
# NN. <The finding in one line>

Status: ready-for-agent
Severity: P1
Tier: <n>
Rule: <doc § or rule id it breaks>
Where: `<path>:<line>`

## What is wrong

<What a learner or caller meets, and why.>

## The test that shows it

```ts
<the failing test, as it will be committed>
```

## The fix

<The change, with its code.>

## Comments
````

Findings dropped in R2 are listed, one line each with the reason, in the tier's commit message, not as files.

**R4. Fix in severity order.** P0, then P1, then P2; a P3 when its file is already touched or it costs minutes, else
`Status: wontfix` with the reason under Comments. For each: the failing test from the issue file → run it, see it
fail → the fix → run it, see it pass → the file's whole test file passes. Structural fixes run under the existing
tests, green before and after. Set `Status: done` when the fix lands.

**R5. Gate:** `npm run typecheck && npm run lint && npm run test` (and `npm run build` where the task says).
`npx prettier --write` over the files changed (`git diff --name-only HEAD`).

**R6. Commit** the tier: code, tests, docs and its issue files.

## Review Focus

The inputs the spec implies but no existing test exercises, most likely to bite first. Each has its test in the task
that owns the code.

1. **Two tabs, or the installed app beside a browser tab,** each saving `pt-progress`: a learner expects no answer
   or mark lost. → Task 2, steps 5–9.
2. **Leaving a screen mid-sound** (the Player in Listen with its recording, a reference's Play, Wait mode's timer):
   the sound stops, every key comes up, no timer fires on an unmounted hook. → Task 3, step 3.
3. **A MIDI device unplugged and plugged in mid-practice:** held keys come up, the status says so, the notes of the
   new connection are heard once each. → Task 3, step 3.
4. **A save written by a newer version** (the owner rolls a deploy back): the app opens with every field it knows,
   never a reset. → Task 2, step 2.
5. **Russian on every screen at phone width:** every string present, nothing cut off or overflowing its control. →
   Task 9, step 3.

---

### Task 1: Tier 0. Baseline and gates

**Files:**
- Modify: `src/shared/test/setup.ts`
- Modify: `src/entities/path/content/path.test.ts:41-44`, `src/entities/path/content/path.ts:9-12`
- Modify: `docs/adr/0005-levels-live-on-the-path.md:14,19`
- Modify: `package.json`, `package-lock.json`
- Modify: `docs/superpowers/specs/2026-09-30-whole-app-review-design.md` (§2, the coverage rows)
- Create: `.scratch/app-review/issues/` (the tracker's folder; the first issue file is Task 2's)

**Interfaces:**
- Consumes: nothing.
- Produces: a silent, skip-free suite and the coverage baseline Task 10 reads.

- [ ] **Step 1: See the noise.**

Run: `npx vitest run src/app/router.test.tsx 2>&1 | grep -c "Not implemented: Window's scrollTo"`
Expected: `42` (TanStack Router resets the window's scroll on every navigation; jsdom has no window scrolling).

- [ ] **Step 2: Give jsdom the window's scroll, as the setup gives it `matchMedia`.** In
  `src/shared/test/setup.ts`, inside `beforeEach`, below `stubServiceWorker`:

```ts
  // jsdom lays nothing out and cannot scroll the window, which the router resets on every navigation.
  if (typeof window !== 'undefined') vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
```

`vi.restoreAllMocks()` in `afterEach` already restores it.

- [ ] **Step 3: See it silent.**

Run: `npx vitest run 2>&1 | grep -ciE "not implemented|warning|error:"`
Expected: `0`. Anything else printed is a finding of this tier: trace it to its test and fix its cause the same way
(a fake for what jsdom lacks in the setup or `src/shared/test/layout.ts`, or the component's real bug), never by
silencing the console.

- [ ] **Step 4: Move the skipped test to the work that turns it on.** Levelling the Path is roadmap sub-project 6
  ("every step levelled 1–4"), not a review. A skipped test is a placeholder, so it goes, and the rule stays written
  where that work reads it. Delete from `src/entities/path/content/path.test.ts`:

```ts
  // ADR 0005: levels live on the path. Phase 4 levels the path for real and turns this on.
  it.skip('puts at least one step on every level (ADR 0005, from Phase 4)', () => {
    for (const level of LEVELS) expect(PATH[level].length, `level ${level}`).toBeGreaterThan(0)
  })
```

and drop `LEVELS` from that file's imports if nothing else there uses it (`grep -n LEVELS
src/entities/path/content/path.test.ts`). In `src/entities/path/content/path.ts` the doc comment becomes:

```ts
/**
 * The one source of levels. This first path puts everything at level 1; the Path as a course
 * (roadmap sub-project 6) orders and levels it (ADR 0005). Adding a piece: one step here, in the
 * place it should be learned.
 */
```

In ADR 0005, line 14's "from Phase 4, every level must hold at least one Step" becomes "once the Path is levelled
(roadmap sub-project 6), every level holds at least one Step, and that work adds the test", and line 19's bullet
becomes "- Until sub-project 6 levels the Path, everything sits at level 1."

- [ ] **Step 5: Minor and patch updates within the pins.**

```bash
npm install @tanstack/react-router@latest lucide-react@latest typescript-eslint@latest @types/node@^24
npm outdated
```

Expected: `npm outdated` lists only the pinned majors (TypeScript 7, Vitest 5, `@vitest/coverage-v8` 5, jsdom 30,
jest-dom 7, eslint-plugin-boundaries 7, `@vite-pwa/assets-generator` 2) and `@types/node` 26 (Node 24 is the
engine).

- [ ] **Step 6: Gate, with the build** (a dependency moved).

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all pass; `Tests  2057 passed (2057)` with no `skipped`.

- [ ] **Step 7: Record coverage.**

Run: `npm run test:cov 2>&1 | grep -E "^ (All files|.*src/(widgets|pages|features)/[a-z-]+ )" | head -60`
Add two rows to the spec's §2 table: `Coverage` (all files: lines and branches) and `Least covered` (the five
widget or page folders with the lowest branch coverage, with their numbers). Task 10 starts from them.

- [ ] **Step 8: Commit.**

```bash
mkdir -p .scratch/app-review/issues
npx prettier --write src/shared/test/setup.ts src/entities/path/content/path.test.ts src/entities/path/content/path.ts docs/adr/0005-levels-live-on-the-path.md docs/superpowers/specs/2026-09-30-whole-app-review-design.md
git add -A src/shared/test/setup.ts src/entities/path docs/adr/0005-levels-live-on-the-path.md docs/superpowers/specs/2026-09-30-whole-app-review-design.md package.json package-lock.json
git commit -m "Review tier 0: a silent suite with no skipped test, dependencies current within the pins" -m "- The setup gives jsdom the window's scrollTo, which the router calls on every navigation.
- The every-level Path test moves to sub-project 6, which levels the Path (ADR 0005).
- The router, lucide-react, typescript-eslint and @types/node updated.
- The coverage baseline recorded in the review's spec." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Tier 1. Saved data, startup and offline

**Files:**
- Create: `src/shared/lib/other-tabs.ts`, `src/shared/lib/other-tabs.test.ts`
- Modify: `src/shared/lib/index.ts` (export `followOtherTabs`)
- Modify: `src/entities/progress/model/store.ts`, `src/entities/progress/model/store.test.ts`
- Modify: `src/entities/settings/model/store.ts`, `src/entities/settings/model/store.test.ts`
- Create: `.scratch/app-review/issues/01-a-cast-migrates-saved-progress.md`,
  `.scratch/app-review/issues/02-two-tabs-write-over-each-other.md`
- Review scope, and whatever its findings touch: `src/entities/settings`, `src/entities/progress`,
  `src/shared/lib/safe-storage.ts`, `src/shared/lib/saved.ts`, `src/shared/lib/store-context.tsx`, `index.html`,
  `src/main.tsx`, `src/app/App.tsx`, `src/app/providers`, `src/app/update-prompt`, `src/app/theme-boot.test.ts`,
  `src/app/standalone-boot.test.ts`, `vite.config.ts`, `vercel.ts`, `vercel.test.ts`

**Interfaces:**
- Consumes: `createMemoryStorage()` (`@/shared/lib`).
- Produces: `followOtherTabs(persist: { rehydrate(): Promise<void> | void }, key: string, tabs: EventTarget): void`
  in `@/shared/lib`; `createProgressStore({ storage?, otherTabs? })` and
  `createSettingsStore({ storage?, languages?, finePointer?, otherTabs? })`, where `otherTabs?: EventTarget`
  defaults to `window`.

- [ ] **Step 1: Record the first finding.** `.scratch/app-review/issues/01-a-cast-migrates-saved-progress.md`, from
  the R3 template: Severity P2, Tier 1, Rule "No workarounds: no `as` cast" and CLAUDE.md "a shape change ships a
  `migrate` and a sanitising `merge`", Where `src/entities/progress/model/store.ts:29`. What is wrong:
  `migrate: (persisted) => persisted as ProgressState` hands an unchecked shape on as typed state and leans on `merge`
  to repair it, while `pt-settings` sanitises in both; the two stores should read alike.

- [ ] **Step 2: Pin the behaviour** a migrated save must keep, from an older version and from a newer one (a deploy
  rolled back). Add to `src/entities/progress/model/store.test.ts`, inside `describe('createProgressStore')`:

```ts
  it.each([0, 2])('reads a version-%i save for what is still valid', (version) => {
    const storage = createMemoryStorage()
    writeSaved(storage, { learned: { 'piece:bz5': DAY, 'lesson:1': DAY }, quiz: 'lost' }, version)
    expect(createProgressStore({ storage }).getState()).toEqual({
      ...EMPTY_PROGRESS,
      learned: { 'piece:bz5': DAY },
    })
  })
```

and to `src/entities/settings/model/store.test.ts`, inside `describe('createSettingsStore')`:

```ts
  it('reads a save from a newer version for the fields it knows', () => {
    expect(restored({ theme: 'dark', locale: 'ru', future: true }, 6)).toEqual({
      theme: 'dark',
      locale: 'ru',
      ...DEFAULTS,
    })
  })
```

Run: `npx vitest run src/entities/progress/model/store.test.ts src/entities/settings/model/store.test.ts -t "version"`
Expected: PASS (zustand calls `migrate` for any version but its own; these pin what the stores do today, and the
next step must keep it). A FAIL here is a P0 finding of its own: record it (R3) and fix it before going on.

- [ ] **Step 3: Migrate by the sanitiser.** In `src/entities/progress/model/store.ts` replace

```ts
      // Every earlier shape is sanitised field by field in `merge`, so migrating is passing it on.
      migrate: (persisted) => persisted as ProgressState,
```

with

```ts
      // Any earlier shape reads as this one: the sanitiser keeps what is still valid.
      migrate: (persisted) => sanitize(persisted),
```

Run: `npx vitest run src/entities/progress/model/store.test.ts`
Expected: PASS.

- [ ] **Step 4: Record the second finding.** `.scratch/app-review/issues/02-two-tabs-write-over-each-other.md`:
  Severity P0, Tier 1, Rule CLAUDE.md "Saved data keeps working", Where `src/entities/progress/model/store.ts:20` and
  `src/entities/settings/model/store.ts:28`. What is wrong: each tab holds the whole store in memory and saves the
  whole of it. With the installed app and a browser tab open, answers recorded in one are wiped by the next mark saved
  in the other, whose copy is older. Nothing listens for the `storage` event.

- [ ] **Step 5: Write the failing tests for the listener.** Create `src/shared/lib/other-tabs.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest'
import { followOtherTabs } from './other-tabs'

const saved = (key: string | null) => new StorageEvent('storage', { key })

describe('followOtherTabs', () => {
  it('reads the save again when another tab saves under its key', () => {
    const tabs = new EventTarget()
    const rehydrate = vi.fn()
    followOtherTabs({ rehydrate }, 'pt-progress', tabs)
    tabs.dispatchEvent(saved('pt-progress'))
    expect(rehydrate).toHaveBeenCalledOnce()
  })

  it('reads it again when another tab clears the storage', () => {
    const tabs = new EventTarget()
    const rehydrate = vi.fn()
    followOtherTabs({ rehydrate }, 'pt-progress', tabs)
    tabs.dispatchEvent(saved(null))
    expect(rehydrate).toHaveBeenCalledOnce()
  })

  it('leaves it alone when another key is saved', () => {
    const tabs = new EventTarget()
    const rehydrate = vi.fn()
    followOtherTabs({ rehydrate }, 'pt-progress', tabs)
    tabs.dispatchEvent(saved('pt-settings'))
    expect(rehydrate).not.toHaveBeenCalled()
  })
})
```

Run: `npx vitest run src/shared/lib/other-tabs.test.ts`
Expected: FAIL, "Failed to resolve import ./other-tabs".

- [ ] **Step 6: Write the listener.** Create `src/shared/lib/other-tabs.ts`:

```ts
/** A persisted store's power to read its save again. */
interface Rehydrates {
  rehydrate(): Promise<void> | void
}

/**
 * Another tab (or the installed app beside a tab) saved under `key`: the store reads the save again,
 * so its own next save carries the other tab's changes instead of writing over them. Storage cleared
 * elsewhere (no key) is read again too. The store lives as long as the app, and so does the listener.
 */
export function followOtherTabs(persist: Rehydrates, key: string, tabs: EventTarget): void {
  tabs.addEventListener('storage', (event) => {
    if (event instanceof StorageEvent && (event.key === key || event.key === null)) {
      void persist.rehydrate()
    }
  })
}
```

Export it from `src/shared/lib/index.ts` beside `safeLocalStorage`:

```ts
export { followOtherTabs } from './other-tabs'
```

Run: `npx vitest run src/shared/lib/other-tabs.test.ts`
Expected: PASS.

- [ ] **Step 7: Write the failing store tests.** Add to `src/entities/progress/model/store.test.ts`:

```ts
  it('keeps what another tab saved when it saves next', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createProgressStore({ storage, otherTabs })
    writeSaved(storage, { ...EMPTY_PROGRESS, practised: { bz5: DAY } })
    otherTabs.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_STORAGE_KEY }))
    store.setState({ learned: { 'piece:bz5': DAY } })
    expect(JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) ?? 'null').state).toEqual({
      ...EMPTY_PROGRESS,
      practised: { bz5: DAY },
      learned: { 'piece:bz5': DAY },
    })
  })
```

and to `src/entities/settings/model/store.test.ts`:

```ts
  it('follows a theme chosen in another tab', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createSettingsStore({ storage, languages: ['en'], otherTabs })
    writeSaved(storage, { ...store.getState(), theme: 'dark' }, 5)
    otherTabs.dispatchEvent(new StorageEvent('storage', { key: SETTINGS_STORAGE_KEY }))
    expect(store.getState().theme).toBe('dark')
  })
```

Run: `npx vitest run src/entities/progress/model/store.test.ts src/entities/settings/model/store.test.ts -t "another tab"`
Expected: FAIL, both: TypeScript's `otherTabs` is not a known option, and at run time the state is unchanged.

- [ ] **Step 8: Follow the other tabs from both stores.** In `src/entities/progress/model/store.ts`, import
  `followOtherTabs` with the other `@/shared/lib` names, and make the factory:

```ts
export function createProgressStore({
  storage = safeLocalStorage(),
  otherTabs = window,
}: { storage?: Storage; otherTabs?: EventTarget } = {}): ProgressStore {
  const store = createStore<ProgressState>()(
    persist(() => EMPTY_PROGRESS, {
      name: PROGRESS_STORAGE_KEY,
      version: PROGRESS_VERSION,
      storage: createJSONStorage(() => storage),
      // Any earlier shape reads as this one: the sanitiser keeps what is still valid.
      migrate: (persisted) => sanitize(persisted),
      merge: (persisted) => sanitize(persisted),
    }),
  )
  followOtherTabs(store.persist, PROGRESS_STORAGE_KEY, otherTabs)
  return store
}
```

In `src/entities/settings/model/store.ts`, the same: add `otherTabs = window` with `otherTabs?: EventTarget` to the
options, bind the `createStore(...)` result to `const store`, then
`followOtherTabs(store.persist, SETTINGS_STORAGE_KEY, otherTabs)` and `return store`.

Run: `npx vitest run src/entities/progress src/entities/settings src/shared/lib`
Expected: PASS.

- [ ] **Step 9: The app follows too.** In `src/app/router.test.tsx`'s `describe('the app shell')`, add:

```ts
  it('shows the theme another tab chose', async () => {
    const storage = createMemoryStorage()
    const { settingsStore } = await renderApp('/', { storage })
    storage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ state: { ...settingsStore.getState(), theme: 'dark' }, version: 5 }),
    )
    act(() => void window.dispatchEvent(new StorageEvent('storage', { key: SETTINGS_STORAGE_KEY })))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
```

(import `act` from `@testing-library/react`, `createMemoryStorage` from `@/shared/lib` and `SETTINGS_STORAGE_KEY`
from `@/entities/settings` if the file does not yet.)

Run: `npx vitest run src/app/router.test.tsx -t "another tab"`
Expected: PASS (`renderApp` leaves `otherTabs` to its default, the window, as `main.tsx` does).

Set both issue files to `Status: done`.

- [ ] **Step 10: Review the rest of the tier (R1).** Tier paths: those under **Files → Review scope** above.
  Standards: extra docs none beyond the three; rule ids `vercel-react-best-practices`: `client-localstorage-schema`,
  `js-cache-storage`, `advanced-init-once`, `rendering-hydration-no-flicker`, `rendering-script-defer-async`;
  `vite-react-best-practices`: `vite-spa-rewrites`, `vite-caching-strategy`, `vite-build-validation`,
  `vite-env-vars`. Focus questions:
  1. Can any saved `pt-settings` (versions 1–5) or `pt-progress` shape throw, or lose a still-valid field, on load?
  2. Does `#theme-boot` read the same key and shape the store writes, for every theme, before first paint?
  3. With `Cache-Control` set per path in `vercel.ts`: does a request for `/` (rewritten to `/index.html`) get
     `must-revalidate`, or only a request for `/index.html` itself?
  4. Does the precache (`globPatterns`, `globIgnores`) hold only what the app draws or plays (each Onest subset:
     which glyphs does the app write: ♯ ♭ 𝄪 𝄫, Cyrillic, the Latin supplement)?
  5. Does the update prompt offer the waiting version without losing a practice in progress?
  6. Does anything at startup do work twice under StrictMode, or before it is needed?
  Spec sources: docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md §5 (state) and §9 (PWA),
  docs/adr/0003-view-state-in-url-saved-state-in-stores.md, docs/adr/0006-gaps-from-quiz-evidence-only.md,
  docs/adr/0016-a-piece-may-carry-a-recording-that-plays-along.md, docs/CODE_STYLE.md §11.

- [ ] **Step 11: R2–R4** for every finding, numbering from `03`.

- [ ] **Step 12: R5, with `npm run build`, then check the offline app:** `npm run preview`, open it once, stop the
  server, reload: the app opens from the precache. Record the check in the commit message.

- [ ] **Step 13: Commit.**

```bash
git add -A src index.html vite.config.ts vercel.ts vercel.test.ts docs .scratch/app-review
git commit -m "Review tier 1: saved data follows other tabs, migrates by its sanitiser, <the tier's other fixes>" -m "<one bullet per issue fixed, with its number; one line per finding dropped, with the reason>" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Tier 2. Sound, MIDI and the practice loop

**Files:** review scope, and whatever its findings touch: `src/shared/api/audio`, `src/shared/api/midi`,
`src/shared/lib/services`, `src/shared/lib/use-presses.ts`, `src/shared/lib/typing-keys.ts`,
`src/features/practice`, `src/features/quiz`, `src/features/live-keyboard`, `src/features/connect-midi`,
`src/app/providers/AudioUnlock.tsx`.

**Interfaces:**
- Consumes: Task 2's store factories (unchanged for callers).
- Produces: whatever the findings change, recorded in their issue files; the ports' interfaces
  (`AudioOutput`, `MidiInput`) change only through an issue that names every caller.

- [ ] **Step 1: R1.** Split into two sub-areas, each two-axis, all four agents in one message:
  - **Ports:** `src/shared/api`, `src/shared/lib/services`, `src/shared/lib/use-presses.ts`,
    `src/shared/lib/typing-keys.ts`, `src/features/connect-midi`, `src/features/live-keyboard`,
    `src/app/providers/AudioUnlock.tsx`.
  - **Machines:** `src/features/practice`, `src/features/quiz`.

  Standards rule ids (both): `vercel-react-best-practices`: `rerender-use-ref-transient-values`,
  `rerender-dependencies`, `rerender-defer-reads`, `rerender-derived-state-no-effect`,
  `rerender-move-effect-to-event`, `rerender-split-combined-hooks`, `client-event-listeners`,
  `client-passive-event-listeners`, `advanced-effect-event-deps`, `advanced-event-handler-refs`,
  `advanced-use-latest`. Focus questions:
  1. Does every effect only sync with the outside world, and undo all it did on cleanup, including under StrictMode's
     mount, unmount, mount?
  2. Is every timer, animation frame, listener, object URL, audio node and MIDI handler released? (Leads:
     `wholeFileMedia` creates an object URL and never revokes it; `stop()` disconnects the envelopes while the
     oscillators run on to their scheduled stop.)
  3. Is the audio clock the only clock for anything heard, and a timer used only for what is not heard?
  4. Does anything re-render a screen once per animation frame when only some keys changed?
  5. Where a ref only keeps a callback or value fresh for an effect, is React 19's `useEffectEvent` the honest
     shape? (Lead: `usePractice` keeps `latest` in an effect with no dependency list and dispatches `configure`
     during render; its Wait-mode effect depends on the whole `state`.)
  6. Does a disconnected MIDI device leave keys down, or a reconnected one deliver notes twice?
  7. Can a quiz or Wait-mode answer be counted twice (a key and a MIDI note at once, a double effect)?
  Spec sources: docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md §2.7 and §8,
  docs/adr/0004-audio-and-midi-behind-ports.md, docs/adr/0008-the-audio-port-knows-what-it-sounds.md,
  docs/adr/0009-the-keyboard-is-an-instrument.md, docs/adr/0013-sheet-music-is-our-score-engraved-by-vexflow.md,
  docs/adr/0016-a-piece-may-carry-a-recording-that-plays-along.md, docs/CODE_STYLE.md §8 (audio and MIDI).

- [ ] **Step 2: R2–R4** for every finding, numbering on.

- [ ] **Step 3: The Review Focus tests this tier owns,** each written first and kept whether or not it fails:
  - In `src/pages/player/ui/PlayerPage.test.tsx`: Listen playing a piece with a recording, then navigate to `/`:
    `audio` reports nothing sounding (`audio.sounding()` empty after `act(() => audio.setNow(t))`), no key is
    `data-down`, and advancing fake timers past the next beat group dispatches nothing (no React warning, no state
    change).
  - In `src/features/practice/use-practice.test.ts`: Wait mode, a correct answer, unmount before
    `CORRECT_PAUSE_MS`: advancing timers plays nothing more on the fake audio.
  - In `src/features/connect-midi` (its hook's test): a note held, the device disconnected on the fake MIDI: the
    held key is up and the status reads disconnected; reconnected, one note-on arrives once.
  Each that fails becomes an issue file (R3) and is fixed (R4).

- [ ] **Step 4: R5** (no build unless a finding touched startup).

- [ ] **Step 5: Commit** as in R6: `Review tier 2: <what the tier fixed, in one sentence>`, bullets per issue, the
  dropped findings, the co-author line.

---

### Task 4: Tier 3. The music kernel: right notes, one rule each

**Files:** review scope, and whatever its findings touch: `src/shared/lib/music`, `src/shared/lib/arrangement`,
`src/shared/lib/notation`, `src/shared/lib/schedule`, `src/shared/ui/score`.

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: the kernel's public names after the barrel is narrowed; every caller outside the kernel updated in the
  same commit (no re-export kept for an old name).

- [ ] **Step 1: R1.** Three sub-areas, each two-axis, all six agents in one message:
  - **Chords:** `chord.ts`, `chord-parts.ts`, `chord-name.ts`, `chord-symbol.ts`, `scale-chord.ts`, `numerals.ts`,
    `tensions.ts`, `chord-finder.ts`, `reharmonise.ts`, `passing-chords.ts`, `voice-lead.ts` (all in
    `src/shared/lib/music`).
  - **Notes, scales, keys and placing:** the rest of `src/shared/lib/music`.
  - **Arrangement, notation, schedule, score:** `src/shared/lib/arrangement`, `src/shared/lib/notation`,
    `src/shared/lib/schedule`, `src/shared/ui/score`.

  Standards: extra docs `docs/CONTENT.md`; rule ids `vercel-react-best-practices`: `js-index-maps`,
  `js-set-map-lookups`, `js-cache-function-results`, `js-hoist-regexp`, `js-combine-iterations`,
  `js-tosorted-immutable` (only where a function runs per note, per key or per frame); plus
  `.claude/skills/improve-codebase-architecture` and `.claude/skills/codebase-design` (deep modules, narrow
  interfaces). Focus questions:
  1. Is any music rule (a chord's name, its root's spelling, what tensions a chord takes, a scale's degrees, a
     numeral's chord) written in two places? CODE_STYLE §8 names the one home of each.
  2. Is every spelling made from letter steps and semitones, never from a sharp or flat name table, outside display
     where no key exists?
  3. Which names does `src/shared/lib/music/index.ts` export that nothing outside `src/shared/lib/music` imports
     (tests excluded)? Run `grep -rn "<name>" src --include='*.ts' --include='*.tsx' | grep -v shared/lib/music` for
     each.
  4. Does each file over ~200 lines (`arrange.ts`, `engrave.ts`, `chord-parts.ts`, `scale.ts`, `chord.ts`,
     `chord-context.ts`, `fingering.ts`, `vexflow-notes.ts`) do one job?
  5. Which inputs could produce a wrong note, spelling or name: a key with a double accidental, a mode in its parent
     key, a 13th chord's omissions, a slash bass below the root, a tie across a bar in compound time, a swing pair?
  Spec sources: docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md §4,
  docs/adr/0013-sheet-music-is-our-score-engraved-by-vexflow.md,
  docs/adr/0014-a-scale-stacks-its-own-chords-and-a-key-is-a-page.md, docs/adr/0017-learn-computes-its-references.md,
  docs/adr/0019-learn-tools-work-out-what-they-are-given.md,
  docs/adr/0020-numerals-read-in-any-key-and-a-progression-player-source.md, docs/CODE_STYLE.md §8.

- [ ] **Step 2: R2–R4.** A wrong-music finding (P0) gets its test in the module's own test file, naming the note or
  chord a learner would see ("spells the 3rd of D♯ major as F𝄪"). A barrel narrowed: remove the export, move a
  test that imported it through the barrel to import the module directly, run `npm run typecheck` to find every
  caller.

- [ ] **Step 3: R5.**

- [ ] **Step 4: Commit** as in R6: `Review tier 3: <one sentence>`.

---

### Task 5: Tier 4. Routes, URLs and every screen's states

**Files:** review scope, and whatever its findings touch: `src/app/router.tsx`, `src/app/routes`,
`src/app/RouteError.tsx`, `src/app/RoutePending.tsx`, `src/app/*Layout*.tsx`, `src/pages`.

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: each route's search validator in the place the findings settle (one file per owner, or one validator
  shape); `router.tsx`'s route tree unchanged for callers (`createAppRouter`, `AppRouter`).

- [ ] **Step 1: R1.** Two sub-areas: **Routing** (`src/app` without `testing`, `providers`, `update-prompt`) and
  **Pages** (`src/pages`). Standards rule ids: `vercel-react-best-practices`: `bundle-dynamic-imports`,
  `bundle-preload`, `async-suspense-boundaries`, `rendering-usetransition-loading`, `rendering-conditional-render`,
  `rerender-derived-state-no-effect`; `vite-react-best-practices`: `react-route-splitting`. Focus questions:
  1. Does every validator follow CODE_STYLE §6 (an invalid value takes its default silently; every param written,
     an invalid optional one as `undefined`; defaults stripped; `replace: true` on a control's change)?
  2. `search.ts` holds every route's validators (429 lines) and `router.tsx` the whole tree (326): does either have
     more than one reason to change? Where would each validator live so that a route's view and its URL change
     together?
  3. Does every screen have its loading, empty, error and offline state? Which has none?
  4. Is every `notFound()` case in CLAUDE.md (an unknown piece, lesson, quiz or check, a piece on the wrong shelf,
     a walk of a scale without chords) covered by a test?
  5. Does a page compose widgets with little markup of its own (CODE_STYLE §1), with one hook in `model/` when it
     has many acts?
  Spec sources: docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md §3,
  docs/adr/0003-view-state-in-url-saved-state-in-stores.md, docs/adr/0012-four-places-and-pop-up-choices.md,
  docs/adr/0020-numerals-read-in-any-key-and-a-progression-player-source.md, CLAUDE.md "app/".

- [ ] **Step 2: R2–R4.**

- [ ] **Step 3: R5, with `npm run build`** (routing).

- [ ] **Step 4: Commit** as in R6: `Review tier 4: <one sentence>`.

---

### Task 6: Tier 5. Architecture and the domain model

**Files:** review scope, and whatever its findings touch: every `src/*/*/index.ts`, `src/entities`,
`src/features/play-example`, and the widgets `chord-finder`, `reharmonise`, `passing-chords`, `progressions`,
`tension-explorer`, `key-explorer`, `interval-explorer`, `scale-explorer`, `chord-explorer`, `lesson-view`.

**Interfaces:**
- Consumes: Task 4's kernel names.
- Produces: each slice's narrowed `index.ts`; any shape extracted into one home (named in its issue file).

- [ ] **Step 1: Find dead exports first** (the agents read the result). For every name exported by a slice's
  `index.ts`:

```bash
for f in $(ls src/{entities,features,widgets,pages}/*/index.ts src/shared/*/index.ts src/shared/lib/*/index.ts); do
  slice=$(dirname "$f")
  grep -oE 'export (\{[^}]*\}|(const|function|type|interface) [A-Za-z0-9_]+)' "$f" \
    | grep -oE '[A-Za-z0-9_]+' | grep -vE '^(export|const|function|type|interface)$' | sort -u \
    | while read -r name; do
        uses=$(grep -rlw "$name" src --include='*.ts' --include='*.tsx' | grep -v "^$slice/" | grep -v '\.test\.' | wc -l)
        [ "$uses" -eq 0 ] && echo "$slice: $name"
      done
done > /private/tmp/claude-501/-Users-kristianbraila-projectsGIT-School-piano-trainer/1613628c-4510-473f-baf6-0c9abe063314/scratchpad/dead-exports.txt
```

Each line is a candidate: a name no other slice imports. It is dead if nothing inside its slice uses it either, or
private if only its own slice does (then it leaves the `index.ts`).

- [ ] **Step 2: R1.** Two sub-areas: **Entities and slice APIs** (`src/entities`, every `index.ts`) and **Learn's
  widgets** (the widgets above and `src/features/play-example`). Standards: extra docs `docs/CONTENT.md`; skills
  `.claude/skills/improve-codebase-architecture`, `.claude/skills/codebase-design`,
  `.claude/skills/domain-modeling`, `.claude/skills/ubiquitous-language`; hand the agents
  `scratchpad/dead-exports.txt`. Focus questions:
  1. Which shapes do the Learn widgets write more than once (a key pop-up, a played row of chords, a card of chords
     with its Play, a tool's input field)? Quote each copy.
  2. Which exports are dead or private (the list)?
  3. Where does a name in code differ from UBIQUITOUS_LANGUAGE's term for it?
  4. Is any module a middle man (a file that only re-exports or forwards)?
  5. Does each entity's `model/types.ts` hold types, guards and validating constructors only (no IO, no React)?
  Spec sources: docs/adr/0001-clean-rewrite.md, docs/adr/0002-content-as-code-one-file-per-piece.md,
  docs/adr/0005-levels-live-on-the-path.md, docs/adr/0017 to docs/adr/0021, docs/CONTENT.md,
  docs/UBIQUITOUS_LANGUAGE.md.

- [ ] **Step 3: R2–R4.** A dead export is deleted with its code and its tests; a private one leaves the `index.ts`
  and its tests import it by path inside the slice.

- [ ] **Step 4: R5.**

- [ ] **Step 5: Commit** as in R6: `Review tier 5: <one sentence>`.

---

### Task 7: Tier 6. Performance and the bundle

**Files:** review scope, and whatever its findings touch: `vite.config.ts`, `src/shared/i18n`, `src/app/routes`,
`src/shared/ui/piano-keyboard`, `src/features/live-keyboard`, `src/widgets/practice-player`, `src/widgets/sheet-music`,
long lists (`src/widgets/piece-list`, `src/widgets/lesson-view`).

**Interfaces:**
- Consumes: Tasks 5 and 6 (the chunks as they now stand).
- Produces: a measured before and after in the commit message.

- [ ] **Step 1: Measure the chunk graph.**

```bash
npm run build 2>&1 | grep -E "\.js " | sort -k2 -h > /private/tmp/claude-501/-Users-kristianbraila-projectsGIT-School-piano-trainer/1613628c-4510-473f-baf6-0c9abe063314/scratchpad/chunks-before.txt
npx vite-bundle-visualizer --template list --output /private/tmp/claude-501/-Users-kristianbraila-projectsGIT-School-piano-trainer/1613628c-4510-473f-baf6-0c9abe063314/scratchpad/bundle.txt
```

(`vite-bundle-visualizer` runs from npx only; it is not added to the project.) Note for each of `index`,
`use-services`, `KeyboardSettingsFields` and `learn-screens` the five largest modules in it.

- [ ] **Step 2: R1.** One sub-area; hand the agents both files. Standards rule ids: `vite-react-best-practices` (all
  rules), `vercel-react-best-practices`: `bundle-barrel-imports`, `bundle-conditional`, `bundle-dynamic-imports`,
  `bundle-preload`, `rerender-memo`, `rerender-derived-state`, `rerender-use-deferred-value`, `rerender-transitions`,
  `rendering-content-visibility`, `rendering-hoist-jsx`, `rendering-svg-precision`, `js-request-idle-callback`.
  Focus questions:
  1. The entry chunk bundles both locales' every namespace: what would the first paint carry if only the chosen
     locale loaded with the shell, and each screen's namespaces with its chunk? What would a language switch then
     wait on, and how does `initAsync: false` change?
  2. What in `use-services` (140 kB) does the first screen need, and what only the Player or Learn needs?
  3. Why is `KeyboardSettingsFields` 105 kB, and does the shell load it before a popover opens?
  4. While Listen plays and while a glissando crosses the keys, which components commit per frame? (Run the React
     Profiler in `npm run dev` on `/play/<a piece>` and on `/learn/chords`; record commits per second.)
  5. Which long list renders every row off screen?
  Spec sources: docs/CODE_STYLE.md §7, docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md §9.

- [ ] **Step 3: R2–R4.** A performance finding survives only with a number: the chunk's size, or the commits per
  second, before; the fix must move it.

- [ ] **Step 4: R5, with `npm run build`;** measure again into `chunks-after.txt`.

- [ ] **Step 5: Commit** as in R6: `Review tier 6: <one sentence>`, the before and after sizes in the body.

---

### Task 8: Tier 7. Component APIs and composition

**Files:** review scope, and whatever its findings touch: `src/shared/ui` (not `primitives`, which the `shadcn`
skill owns), every `src/widgets/*/ui`, `src/features/*/ui`, `src/entities/*/ui`.

**Interfaces:**
- Consumes: Task 6's shared shapes.
- Produces: component APIs the issue files name; every caller updated in the same commit.

- [ ] **Step 1: R1.** Two sub-areas: **The kit** (`src/shared/ui` without `primitives`) and **Screens' parts**
  (`src/widgets/*/ui`, `src/features/*/ui`, `src/entities/*/ui`). Standards rule ids: `vercel-composition-patterns`
  (all: `architecture-avoid-boolean-props`, `architecture-compound-components`, `state-decouple-implementation`,
  `state-context-interface`, `state-lift-state`, `patterns-explicit-variants`, `patterns-children-over-render-props`,
  `react19-no-forwardref`); `vercel-react-best-practices`: `rerender-no-inline-components`,
  `rerender-memo-with-default-value`, `rendering-hoist-jsx`, `rendering-conditional-render`. Focus questions:
  1. Which props select a mode (`selectable`, `map`, `height` on `PianoKeyboard`; any `is*`/`show*`/`compact`)?
     Would explicit variants or children say it better?
  2. `PianoKeyboard` takes fourteen props: which travel together (a data clump), and would a compound shape
     (the keys, the rail, the map) read better?
  3. `Dropdown`, `MultiDropdown` and `KeyDropdown` over `OptionItems`: one shape written three times, or three
     honest variants?
  4. Which component files pass ~200 lines or export more than one component?
  5. Does any component compute domain logic that belongs in `model/` or `shared/lib` (CODE_STYLE §2)?
  Spec sources: docs/CODE_STYLE.md §1–§5, DESIGN.md, docs/adr/0009-the-keyboard-is-an-instrument.md,
  docs/adr/0012-four-places-and-pop-up-choices.md.

- [ ] **Step 2: R2–R4.** An API change updates every caller in the same commit; CODE_STYLE §1's kit list changes
  with it.

- [ ] **Step 3: R5.**

- [ ] **Step 4: Commit** as in R6: `Review tier 7: <one sentence>`.

---

### Task 9: Tier 8. Accessibility, states, copy and i18n

**Files:** review scope, and whatever its findings touch: every screen (`src/pages`, `src/widgets`),
`src/shared/i18n/locales`, `src/entities/lesson/content`.

**Interfaces:**
- Consumes: Task 8's components.
- Produces: tests by role and accessible name for what the findings fix.

- [ ] **Step 1: R1.** Two sub-areas: **Interaction** (`src/shared/ui`, `src/widgets`, `src/pages`) and **Words**
  (`src/shared/i18n/locales`, `src/entities/lesson/content`, every `LocalText`). Standards: extra docs DESIGN.md;
  skill `.claude/skills/web-design-guidelines`; WCAG 2.2 AA. Focus questions:
  1. Can every control be reached and used by keyboard alone, the piano's roving tab stop included; does focus
     return to its trigger when a `Sheet` or popover closes?
  2. Does every icon-only control have a name, every toggle `aria-pressed`, every target 44px?
  3. Is colour ever the only cue (a key's role, a rating, a gap)?
  4. Does any copy repeat what its label, icon or layout says, or explain a button (CODE_STYLE §10)?
  5. Is every Russian string there and natural, with counts after a colon?
  Spec sources: docs/CODE_STYLE.md §5 and §10, PRODUCT.md, docs/adr/0010-the-app-is-a-labelled-picture-book.md.

- [ ] **Step 2: R2–R4.**

- [ ] **Step 3: The Review Focus test this tier owns.** In each page's test that renders a screen with a lot of
  text (`src/pages/learn`, `src/pages/lesson`, `src/pages/player`), render with `{ locale: 'ru' }` and assert no
  element's text is an i18next key (`/^[a-z]+(\.[a-zA-Z]+)+$/`) and no `LocalText` fell back to English. Overflow
  at phone width cannot be measured in jsdom: check it by eye in `npm run dev` at 375 px in Russian, and record each
  overflow as an issue.

- [ ] **Step 4: R5.**

- [ ] **Step 5: Commit** as in R6: `Review tier 8: <one sentence>`.

---

### Task 10: Tier 9. Tests

**Files:** review scope, and whatever its findings touch: every `*.test.ts(x)`, `src/app/testing`,
`src/shared/test`.

**Interfaces:**
- Consumes: Task 1's coverage baseline.
- Produces: coverage and wall time before and after, in the commit message.

- [ ] **Step 1: Measure.** `npm run test:cov` (the uncovered lines of `src/widgets` and `src/pages`), and
  `npx vitest run --reporter=verbose 2>&1 | grep -E "✓ .* [0-9]{4,}ms" | sort -t' ' -k2 -rn | head -20` (the slowest
  tests).

- [ ] **Step 2: R1.** One sub-area; hand the agents both results. Standards: skill `.claude/skills/tdd`, CODE_STYLE
  §9. Focus questions:
  1. Which tests name an implementation detail instead of what a learner or caller observes?
  2. Which uncovered branches in widgets and pages are reachable by a learner (test them through the page) and which
     are unreachable (delete them)?
  3. Which tests wait on real time, or pass by the order they run in?
  4. Where does the setup's time go (`renderApp` loads every chunk for every test): would loading the chunks once per
     file keep a test from waiting on the runner?
  Spec sources: docs/CODE_STYLE.md §9, CLAUDE.md "Conventions".

- [ ] **Step 3: R2–R4.**

- [ ] **Step 4: R5.**

- [ ] **Step 5: Commit** as in R6: `Review tier 9: <one sentence>`.

---

### Task 11: Tier 10. Docs that steer the code

**Files:** `CLAUDE.md`, `docs/CODE_STYLE.md`, `docs/CONTENT.md`, `docs/UBIQUITOUS_LANGUAGE.md`, `docs/adr`,
`DESIGN.md`, `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md` (status), this plan's spec.

**Interfaces:**
- Consumes: every earlier tier's commits.
- Produces: docs that match the code; the spec's outcome.

- [ ] **Step 1: R1, Standards axis only** (the docs are the standard; the Spec axis is the code): one agent with
  skill `.claude/skills/writing-guidelines`. Focus questions:
  1. Which statement in each doc no longer matches the code (a name, a file, a rule a tier changed)?
  2. Which rule is stated in two docs? It stays in the one that owns it (CLAUDE.md: rules and the map; CODE_STYLE:
     how code is written; CONTENT: content; the glossary: words; an ADR: why).
  3. CLAUDE.md's architecture section lists most exports by name, so each refactor above had to edit it: which of
     those lists does a newcomer need to find their way, and which only restate what `index.ts` says?

- [ ] **Step 2: R2–R4.** A decision a tier changed gets an ADR (next number after the last in `docs/adr`).

- [ ] **Step 3: The outcome.** Measure §2's table again (`npm run test`, `npm run build`, the coverage) and append
  it to the spec as `## 8. Outcome`, with the issue count per tier and per severity:
  `grep -h '^Severity' .scratch/app-review/issues/*.md | sort | uniq -c`.

- [ ] **Step 4: R5, with `npm run build`.**

- [ ] **Step 5: Commit** as in R6: `Review tier 10: the docs match the code the review left`.
