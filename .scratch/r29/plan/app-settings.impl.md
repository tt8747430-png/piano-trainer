# The app's Settings and the card style — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The app's Settings holds only app-wide pages (Account; General, Storage and backup; On-screen piano with
Computer keys inside, Connect a piano; Help), and every choice among three or more is a Flat-style card with every
option in sight.

**Architecture:** One new `shared/ui` component, `ChoiceCard`, on shadcn's radio group, replaces `ChoiceRow` +
`Dropdown` for choices of three or more and `PictureChoice` where no picture is needed. `SettingsList` is
regrouped; the Computer keys page folds into On-screen piano; the registry (`SETTING_HOMES`) and the routes follow.
The Player's, the score editor's and Sound and recording's pages leave the list here but keep their routes until
their own plans (`player.impl.md`, `score-editor.impl.md`) give them a new home.

**Tech Stack:** React 19, TanStack Router, shadcn (radio-group, added with the CLI), Vitest 4 + Testing Library,
i18n en/ru.

**Spec:** `.scratch/r29/plan/design.md` (row "Settings, Songs and Practice", screens A1–A5; row "Choices, part 2",
question 2 and 3), the mockups `.scratch/r29/mockups/settings-songs-practice.html` and `choices-part-2.html`,
`plan/settings.md` ST0–ST6 where the mockups do not differ.

## Global Constraints

- Every Settings page's choice among three or more options is a `ChoiceCard`; on/off stays `SwitchRow` (Decided 23).
- Longer help behind ⓘ (`InfoTip`), never a line of text under a control; an option's one-line example is allowed.
- Every UI string in `en` and `ru`; Russian typed against English.
- Every preference has one home in `SETTING_HOMES`; `src/app/settings-pages.test.tsx` fails a `data-setting` drawn
  off its home.
- Computer keys only where the pointer is fine and hovers: `matchMedia('(hover: hover) and (pointer: fine)')`.
- Back goes up (`parents.ts`): a removed route leaves no parent entry; a test fails a route without one.
- No shims: a removed page's file, route, parent, registry id, strings and tests go in the same task.
- Prettier on touched files only; never `npm run format`.

## Review Focus

1. A phone at 320 px: a card's option with a long Russian label wraps inside the card, never overflows. → Task 1
   test "wraps a long label" (class check) and the screenshot step in Task 6.
2. Keyboard use: arrow keys move within a card's options, Tab leaves the card (radio-group semantics). → Task 1
   test "arrow keys choose the next option".
3. A touch laptop (coarse pointer that also hovers): Computer keys must show if a fine pointer exists. → Task 4
   test "shows Computer keys when any fine pointer hovers" with `stubMatchMedia('(any-hover: hover) and (any-pointer: fine)')`.
4. A saved `keyboard.typing: true` on a phone: letters must not play when the section is hidden. → Task 4 test
   "a phone ignores a saved typing setting".
5. A deep link to a removed page (`/settings/computer-keys`) lands on the Settings list, not a blank screen. → Task 4
   test "the old Computer keys link opens On-screen piano".

---

### Task 1: `ChoiceCard`

**Files:**
- Create: `src/shared/ui/primitives/radio-group.tsx` (with `npx shadcn@latest add radio-group`, then moved by the CLI's
  alias to `primitives`)
- Create: `src/shared/ui/ChoiceCard.tsx`
- Modify: `src/shared/ui/index.ts` (export)
- Test: `src/shared/ui/ChoiceCard.test.tsx`

**Interfaces:**
- Produces:
  ```ts
  export interface CardOption<V extends string> { value: V; label: string; example?: string }
  export function ChoiceCard<V extends string>(props: {
    title: string
    setting?: string            // data-setting, as ChoiceRow
    info?: ReactNode            // an InfoTip beside the title
    options: readonly CardOption<V>[]
    value: V
    onChange: (value: V) => void
  }): JSX.Element
  ```
  Look: a `SettingsGroup`-like card (same radius, border, fill as `rowClass`), the title as its heading, each option a
  radio row (label, example under it in `text-muted-foreground text-xs`), the chosen radio filled ink (rule 15's one
  selected look).

- [ ] **Step 1: Write the failing tests** in `ChoiceCard.test.tsx` (`renderWithSettings`):
  - "draws every option with its example": `getAllByRole('radio')` has 3; `getByText('Clicks for one bar')`.
  - "marks the chosen one": the radio named "Audible" is `checked`.
  - "chooses on tap": `user.click(getByRole('radio', { name: 'Visual' }))` → `onChange` called with `'visual'`.
  - "arrow keys choose the next option": focus "None", `user.keyboard('{ArrowDown}')` → `onChange('audible')`.
  - "names its setting": the card's root has `data-setting="playback.countdown"`.
  - "wraps a long label": the label element has class `break-words` (not `truncate`).
- [ ] **Step 2: Run** `npx vitest run src/shared/ui/ChoiceCard.test.tsx` — FAIL (module not found).
- [ ] **Step 3: Add the primitive** with the shadcn CLI (never by hand), then implement `ChoiceCard`.
- [ ] **Step 4: Run** the test file — PASS; `npm run typecheck && npm run lint` clean.
- [ ] **Step 5: Commit** "ChoiceCard: a choice among three or more as a card with every option in sight".

### Task 2: The Settings list, regrouped

**Files:**
- Modify: `src/widgets/settings-screen/ui/SettingsList.tsx`
- Modify: `src/shared/i18n/locales/{en,ru}/settings.ts` (group `piano`; drop `groups.playing`, `groups.practice`
  where unused)
- Test: `src/pages/settings/ui/SettingsPage.test.tsx`

**Interfaces:**
- Consumes: `RowLink`, `SettingsGroup`, `AccountCard` (unchanged).
- Produces: groups in this order: account card; **General** (General · Storage and backup); **Piano** (On-screen
  piano · Connect a piano, its value the MIDI summary); **Help** (How to use · Privacy · Terms · version rows);
  the Admin row for an admin (unchanged).

- [ ] **Step 1: Failing tests** in `SettingsPage.test.tsx`:
  - "holds only the app's own pages": the row names, in order, equal
    `['General', 'Storage and backup', 'On-screen piano', 'Connect a piano', 'How to use', 'Privacy', 'Terms']`
    (plus the version rows, matched by role).
  - "has no Player, Score editor, Sound and recording, Computer keys or Practice rows": `queryByRole('link', { name })`
    is null for each.
  - ru: the same with Russian names (`renderApp('/settings', { locale: 'ru' })`).
- [ ] **Step 2: Run** `npx vitest run src/pages/settings/ui/SettingsPage.test.tsx` — FAIL.
- [ ] **Step 3: Regroup** `SettingsList`; remove the Practice tiles loop and the three Playing rows.
- [ ] **Step 4: Run** the test file and `npm run test:related -- src/widgets/settings-screen/ui/SettingsList.tsx` — PASS.
- [ ] **Step 5: Commit** "Settings holds only the app's own pages".

### Task 3: General as cards; lesson reading leaves it

**Files:**
- Modify: `src/pages/settings/ui/GeneralPage.tsx`
- Modify: `src/entities/settings/model/registry.ts` (`lessonReading: 'lessons'`; add `'lessons'` to `SETTINGS_PAGES`)
- Modify: `src/pages/lesson/ui/LessonSettingsPage.tsx` (draws `lessonReading` with `data-setting`)
- Test: `src/pages/settings/ui/GeneralPage.test.tsx` (create), `LessonSettingsPage.test.tsx`

**Interfaces:**
- Consumes: `ChoiceCard` (Task 1); `useSettings`/`set-theme`, `set-locale` commands (existing).
- Produces: General = `ChoiceCard` "Appearance" (Light · Dark · Same as the device, `setting="theme"`) and
  `ChoiceCard` "Language" (English · Русский, `setting="locale"`). No lesson rows.

- [ ] **Step 1: Failing tests:** General "chooses Dark" (`theme` becomes `'dark'` in the returned store); "has no
  lesson reading" (`queryByText(/read/i)` null); LessonSettingsPage "draws Read as here" (`data-setting="lessonReading"`
  present).
- [ ] **Step 2: Run** both files — FAIL.
- [ ] **Step 3: Implement**; remove `ThemePicture`/`PictureChoice` use from General if unused elsewhere (delete the
  component only if no other import remains).
- [ ] **Step 4: Run** both files, then `npx vitest run src/app/settings-homes.test.ts src/app/settings-pages.test.tsx` — PASS.
- [ ] **Step 5: Commit** "General as cards; lesson reading lives on the lesson's Settings".

### Task 4: On-screen piano holds Computer keys; the Computer keys page goes

**Files:**
- Modify: `src/pages/settings/ui/OnScreenPianoPage.tsx`
- Delete: `src/pages/settings/ui/ComputerKeysPage.tsx`
- Modify: `src/app/router.tsx` (remove `/settings/computer-keys`; add a redirect route to `/settings/on-screen-piano`),
  `src/app/routes/parents.ts`, `src/app/routes/settings-screens.ts`
- Modify: `src/entities/settings/model/registry.ts` (`'keyboard.typing': 'on-screen-piano'`; drop `'computer-keys'`)
- Modify: `src/features/live-keyboard/ui/LiveKeyboard.tsx:74` (and `model/use-typing.ts`): letters play only when `typing && hasFinePointer()`; `ui/TypingToggle.tsx` (the rail's ⌨, a second control) is deleted
- Create: `src/shared/lib/fine-pointer.ts` + test: `export const hasFinePointer = (): boolean` using
  `matchMedia('(any-hover: hover) and (any-pointer: fine)')`
- Test: `src/pages/settings/ui/OnScreenPianoPage.test.tsx`, `src/shared/lib/fine-pointer.test.ts`

**Interfaces:**
- Consumes: `ChoiceCard`, `SwitchRow`, `ShortcutsButton` (becomes a `RowLink` "Keyboard shortcuts").
- Produces: On-screen piano = `ChoiceCard` "Key size", `ChoiceCard` "Labels on keys" (None · Note names · Fingers,
  writing `keyboard.namedKeys` with its existing values mapped), switches "Slide to play (glissando)"
  (`keyboard.swipe`), and on a fine pointer the group "Computer keys": `SwitchRow` "Letters play the piano"
  (`keyboard.typing`), the key picture (`ComputerKeysPicture`, existing), `RowLink` "Keyboard shortcuts".

- [ ] **Step 1: Failing tests:**
  - "shows Computer keys on a computer": `stubMatchMedia` fine+hover → `getByRole('switch', { name: 'Letters play the piano' })`.
  - "hides Computer keys on a phone": coarse → `queryByText('Computer keys')` null.
  - "shows Computer keys when any fine pointer hovers" (Review Focus 3).
  - "a phone ignores a saved typing setting": coarse, store `keyboard.typing: true`, a `keydown` of `a` plays no note
    (fake `audio` records nothing).
  - "the old Computer keys link opens On-screen piano": `renderApp('/settings/computer-keys')` → heading
    "On-screen piano".
  - `fine-pointer.test.ts` (`// @vitest-environment jsdom`): true with the fine stub, false with coarse.
- [ ] **Step 2: Run** the files — FAIL.
- [ ] **Step 3: Implement**; delete the page, its strings (`computerKeys.*` moved under `onScreenPiano.computerKeys`),
  and its tests.
- [ ] **Step 4: Run** `npm run test:related -- <changed files>` and `npx vitest run src/app` — PASS; typecheck, lint.
- [ ] **Step 5: Commit** "Computer keys is part of On-screen piano, on a computer only".

### Task 5: Connect a piano's sound as a card

**Files:**
- Modify: `src/features/connect-midi/ui/MidiSoundToggle.tsx` (becomes the card) and its use in `MidiConnectionFields.tsx`
- Test: `src/features/connect-midi/ui/MidiSoundToggle.test.tsx` (create)

**Interfaces:**
- Consumes: `ChoiceCard`.
- Produces: `ChoiceCard` "Sound" — From the piano ("The app stays silent when you play") · From the app ("The app's
  piano plays what you press"), writing `midi.sound` (false · true). Other rows unchanged.

- [ ] **Step 1: Failing test** "chooses where the sound comes from": tap "From the app" → store `midi.sound === true`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Commit** "Connect a piano: where the sound comes from, as a card".

### Task 6: Gate, screenshots, docs

**Files:**
- Modify: `docs/adr/` (the Settings ADR: the list, the card rule, Computer keys' home; one History line),
  `docs/UBIQUITOUS_LANGUAGE.md` (ChoiceCard), `CLAUDE.md` (Settings' pages list, the row kinds now include
  `ChoiceCard`), `DESIGN.md` (the card's look).

- [ ] **Step 1:** `npm run typecheck && npm run lint` — clean.
- [ ] **Step 2:** `npm run test` once (touches `shared/ui`, `app/`, an entity's model) — all pass.
- [ ] **Step 3:** `npm run build` (routes changed) — succeeds.
- [ ] **Step 4:** Screenshots of `/settings`, `/settings/general`, `/settings/on-screen-piano`,
  `/settings/connect-piano` at 390×844, 320×568, 844×390, 1280×800, light and dark, Russian at 320: no overflow, no
  clipped label; compare with mockups A1–A4.
- [ ] **Step 5:** Docs as listed; commit "Docs: the app's Settings and the card style"; push the branch.

## Not in this plan

- The Player's, the score editor's and Sound and recording's pages and their new homes: `player.impl.md`,
  `score-editor.impl.md` (their list rows go here; their routes stay until those plans).
- Storage's grand-piano row: with the sampled grand (rounds 3–4, A27).
- App-wide note names (letters or syllables, mockup A1): a new feature touching every chord and note label; it gets
  its own spec before a plan.
- Account page changes beyond the list (mockup A5 matches today's page).
