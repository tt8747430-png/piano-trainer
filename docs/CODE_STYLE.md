# Code Style

How code is written here. [CLAUDE.md](../CLAUDE.md) has the layers and change rules, [DESIGN.md](../DESIGN.md) the look,
and the ADRs (`docs/adr/`) the reasons. Each rule points at code that follows it: match that shape.

## 1. Components

| What                            | Where                                              |
| ------------------------------- | -------------------------------------------------- |
| App-wide, purely presentational | `shared/ui/` (the kit)                             |
| shadcn primitive                | `shared/ui/primitives/`, added with the shadcn CLI |
| Only an entity's own data shown | `entities/<x>/ui/`                                 |
| Composite, tied to screens      | `widgets/<x>/ui/`                                  |
| Screen root                     | `pages/<x>/ui/`                                    |
| Part of one parent              | beside it, in the same `ui/` folder                |

- About 200 lines a file. Past that, extract children or move state into `model/`.
- One exported component per file, named for the file. Private helpers may stay.
- A page composes widgets and the kit, with little markup of its own.
- **Every page earns its place:** no middle page, no redirect the learner did not choose, no "coming soon". A row leading
  to a page is a `RowLink`; a row opening a sheet is a `RowButton`.
- **A thing's page and a tool's are two pages.** An explorer's URL names the thing it shows; a tool's URL holds what the
  learner gave it. A new Practice page is a row in `PRACTICE_PAGES` with its tile in `PAGE_TILES`.
- **Whatever has a name is found by Search** (`indexEntries` in `pages/search`).

## 2. Hooks, state and effects

- Stateful or effectful logic (subscriptions, timers, audio, MIDI, measuring) is a hook: shared ones in `shared/lib`,
  one-offs beside their component.
- Pure domain logic never lives in a component or a hook. It goes in `shared/lib` or `entities/*/model`.
- **Derive during render.** `useEffect` only syncs with the outside world. A child never reports a derived value up
  through an effect.

## 3. Complex state

- Values that change together, or distinct phases, are a pure reducer or a discriminated-union machine with its own tests
  (`features/practice/practice-machine.ts`, `features/trainer/round-machine.ts`). A lone toggle stays `useState`.
- **A page with many acts exposes one hook,** `pages/<x>/model/use-<thing>.ts`, and that hook is its test surface.
- **What is open over a page is one union value,** never a flag each, so "a dialog over a sheet" cannot be reached.

## 4. Composition and variants

- No boolean-prop proliferation. A choice a prop would make is its own component or its `children`.
- **Variants are lookup maps of complete class strings** (`primitives/button.tsx`, `role-classes.ts`). Never
  `` `bg-${x}` ``: Tailwind cannot see it.
- Multi-part UI is a compound component sharing context. `children` over `renderX`; a render prop only when the parent
  injects per-item data.
- **React 19:** `ref` is a normal prop; `use(Context)`; `<Context value>` without `.Provider`.
- A widget whose view a URL holds owns that view's type in `model/`; the route's validator imports it with `import type`.

## 5. The kit, tokens and controls

Read `shared/ui/index.ts` before writing a control. Add to the kit only what is app-wide, presentational and has a second
user. shadcn primitives come from the CLI, and its sizes under 44px are removed.

**Choosing a control:** five or fewer short nouns are a `Segmented`; more, or longer, a `Dropdown`; on or off a
`SwitchRow`; a number a `Stepper`; a pitch a `PitchPicker`; a note as written a `NotePicker`; a key a `KeyPicker`; several
keys a `KeysChecklist`; an explorer's list of words a `MenuPicker` in its `PickerRow`; an inversion its `InversionChoice`;
several on-or-offs on a sheet `ToggleTile`s.

**Tokens** have two layers: primitives (`--p-*`) in `src/styles/tokens.css` and semantic roles over them, exposed as
utilities by `@theme inline` in `src/styles/theme.css`.

- Semantic utilities only (`bg-card`, `text-muted-foreground`): never a primitive, a hex value or `p-[13px]`. A new role
  goes in `tokens.css` for light, dark and `prefers-contrast: more`.
- Values worked out at runtime go in `style`; every fixed value is a token, a utility or a named constant. A layout that
  changes by form factor is one `@utility` placing children by `data-area` (`player-screen`, `score-bar`).
- Compose with `cn()`. A new custom name is registered with `createCn` from `cn/config`, with a test.
- `flex` or `grid` with `gap-*`, not `space-*`. Equal width and height is `size-*`.
- **No `dark:` in app code.** Dark mode is the token remap under `[data-theme='dark']`. Colours CSS cannot reach come from
  `THEME_COLORS`, held by a test to `--background`.

**Controls.**

- **44px targets** (`min-h-11`, `size-11`). A control drawn smaller grows its reach to 44px. Icon-only controls have an
  `aria-label`, a tooltip and a 20px lucide icon.
- **A control has the same name, icon and place at every size.** A row that does not fit wraps; it never loses a control.
- **One focus ring,** from the base layer. No `outline-none`, no ring of a component's own. Inside a scroller or clipped
  box, `focus-visible:-outline-offset-3`. Siblings gap by at least `gap-2`.
- Every interactive element has hover, `focus-visible`, `disabled` and a transition. `hover:` fires only for a mouse or
  trackpad, so a tap leaves no wash behind.
- **A link is a link:** a button-looking link is `ButtonLink` or `RoundLink`, never `<Button render={<Link />}>`.
- **An explanation is an ⓘ** (`InfoTip`, `info` on `SwitchRow`, `SettingField`, `Labelled`, `MenuSection`), never a line
  under a control.
- Compose primitives as shadcn does: a button in a field is `InputGroup` with `InputGroupAddon`; a slider is named by
  `SliderLabel`; a switch by the `<label>` round it.
- **A chord on screen is printed** (`printedSymbol`, `printedChord`) in text, titles and accessible names. What is stored,
  typed, parsed or put in a URL stays ASCII.
- **A screen's keys are `LiveKeyboard`.** Anything that sounds on a screen shows on its keys; a screen never sizes them.
- **A button that plays becomes Stop while it sounds** (`usePlayback`). In a grid the item is a toggle, `aria-pressed`.

## 6. TypeScript, imports and URLs

- `import type` for types. No `any`: take `unknown` and narrow. Small domain types over bare numbers and strings
  (`PitchClass`, `Midi`, `Tick`, `StepId`). The `@/` alias across slices.
- **Search params** are validated in `app/routes/<place>-search.ts`. An invalid value takes its default, silently. Each
  validator writes every param it owns. Defaults leave the URL; a control's change replaces the history entry.
- Validators run as the app opens, so they import only what a URL is made of, never a module that arranges or plays.

## 7. Performance and build

- Subscribe narrowly: `useSettings(selectTheme)`. State a handler reads when it runs comes from
  `useSettingsStoreApi().getState()`.
- Never define a component inside a component. Hoist static JSX and lookup maps to module scope.
- `memo` deliberately: a list row under a busy parent, with stable props.
- A ternary, not `cond && <X />`.
- `startTransition` or `useDeferredValue` for costly, non-urgent updates.
- **Every screen is lazy** (`lazyRouteComponent` over an `app/routes/*-screens.ts` module). Fallback screens stay eager.
  The engraver loads only with a staff (`LazyScoreView`).
- A `VITE_` variable is public. The Vercel config is `vercel.ts`, pinned by `vercel.test.ts`.

## 8. Music code

- **Spell from letter steps plus semitones,** never from a table of names. `note.ts`'s tables are for a pitch with no
  letter context.
- **Transpose by interval, keeping letters** (`transposeNote`): D in G is E♭ in A♭. A root that would need a double
  accidental takes its plain spelling. A root found from an interval goes through `spellBelow` or `spellAbove`, then
  `plainRoot`: the tritone sub of B♭7 is E7.
- **One table each:** chord names in `chord-name.ts`, root spelling in `chordRootSpelling`, tensions in `tensions.ts`,
  numerals through the chord symbols' suffix reading (`numerals.ts`), played keys through `nameChords`.
- **Placing tones:** `placeChord`, `placeScale`, `placeScaleChords`. A chord of `TWO_HANDS_FROM` notes or more takes two
  hands. A row of chords is voiced by `voiceLead`.
- **Time is ticks** (`TICKS_PER_BEAT` = 24). Seconds appear only in `shared/lib/schedule` and the audio adapter. A take
  alone is kept in milliseconds; `quantise` snaps it to ticks.
- **A Performance is what sounds and what is written.** `notate` writes it as a Score; a Score is never played.
- Voice leading, fingering and inversions inside `arrangement` are tested through `arrange`.
- **Audio and MIDI only through `useServices()`.** Scheduled music goes through `play()`, a hand's keys through
  `useLiveVoice`, and what sounds is `useSoundingKeys`'s to know.
- Randomness is injected (`random: () => number`).
- Content is data held by tests ([CONTENT](CONTENT.md)).

## 9. Tests

- **Test first, and watch it fail** (`tdd` skill). A test names behaviour a learner or caller sees.
- Tests sit beside their file. `*.test.ts` runs in node, `*.test.tsx` in jsdom; a `.ts` test needing a DOM starts with
  `// @vitest-environment jsdom`. Import `describe`, `it`, `expect`, `vi` from `vitest`.
- **What to test:** pure logic by unit tests; a page's hook by `renderHook`; a screen through the whole app
  (`await renderApp(path, { locale, storage, webMidi })`), so routing, search params and stores are real; components by
  role and accessible name with `userEvent.setup()`. No snapshots.
- **Fakes, not module mocks:** `createMemoryStorage()`, `createFakeAudio()`, `createFakeMidi()`, `stubMatchMedia`,
  `stubServiceWorker`. Helpers are in `src/app/testing/`: `renderApp`, `renderRouted`, `renderWithSettings`, `testRouter`.
- **Leave nothing behind:** `isolate: false` means workers share modules and the document. A listener a test adds stops
  with it (`untilTestEnds()`). A file needing fresh modules starts with `vi.hoisted(() => vi.resetModules())`.
- **jsdom lays nothing out.** Use `stubBox` and `stubScrolling` where a box or scroll matters. A Base UI slider's thumb
  needs `{ hidden: true }`. Move the fake clock with `audio.setNow(t)`; a released key stays down `SHORTEST_PRESS_MS`, so
  use fake timers. Verovio engraves for real in tests.
- A gesture, layout or keyboard behaviour jsdom cannot show is checked in a browser
  ([testing](../.claude/skills/owner-way/references/testing.md)).

## 10. Copy and i18n

- No sentence that repeats what a label, icon or layout says, and no how-to paragraphs. Empty states and errors get one
  short line. Lessons alone teach in prose.
- Professional musical terms, checked against the method books, Flat and Dorico: "crescendo", never "get louder". A name
  says what a control does.
- Strings are in `src/shared/i18n/locales/{en,ru}/<namespace>.ts`; Russian is typed against English, so a missing key
  fails `tsc`. A namespace is a place's; words every screen shares are `music`'s. One string, one key.
- Content text is `LocalText { en, ru }`, read through `localText`. Credits stay as printed. Note and chord names are the
  same in both languages (B, not H).
- Keys are words, never numbers (`inversion.first`). A count goes after a colon ("Chords to check: 2").

## 11. Layout and mobile

- **Mobile first:** the base style is the phone; layer up with `sm:` and `lg:`. Custom variants in `theme.css`:
  `landscape-phone:`, `small-phone:` (under 390px), `narrow-phone:` (under 360px).
- **Same features, words and layout logic at every size** in the
  [size matrix](../.claude/skills/owner-way/references/testing.md#the-size-matrix). Nothing is clipped or wraps badly at
  320px.
- **A screen takes the width it is given.** No `max-w-*` on a screen. Its gutter is `px-gutter`; lists are `grid-cards`,
  fields `grid-fields`, chord buttons `grid-chords`.
- **Floating things float.** The page gets scroll room under them (`pb-foot-*`, `--float-room`), not an empty row. What
  floats over music steps aside while it is read (`useHiddenWhileReading`).
- **Nothing traps a click.** A transparent or closed layer gets `pointer-events-none` or `inert` when it is not on top.
- **Nothing jumps** between modes or on entering Select: icons stay put, heights stay equal.
- Safe areas through the named utilities (`pt-safe`, `pb-safe`, `px-gutter-safe`, `bottom-safe`). `dvh`, never `vh`.
- A sideways scroller clips both axes: keep room for focus rings inside it, and hide its bar with `scrollbar-none`.
- **The phone's keyboard:** a sheet stands on it (`pb-sheet-keyboard`); the tab bar, toasts and floating actions hide
  while it is up (`data-keyboard`). Focus a sheet's field through `initialFocus`, never `autoFocus`.
- **The installed app is an app:** zoom locked when installed, text unselectable outside fields, no callout, no overscroll,
  no double-tap wait, no magnifier.

## 12. Motion

- Animate `transform` and `opacity` only, on `--ease-out`. Motion shows a change of place or state, or it goes.
- 150–300ms for feedback in the page; a sheet or the keys' fold travels further and takes longer.
- **Reduced motion:** `theme.css` cuts CSS motion. Script-driven motion asks too: `useMediaQuery`, `useReducedMotion`;
  `morph` changes at once; `useScrollMotion` scrolls instantly.
- A view transition goes through `morph`, never `document.startViewTransition`.
- Finger-driven motion follows the finger and can be reversed mid-gesture.
