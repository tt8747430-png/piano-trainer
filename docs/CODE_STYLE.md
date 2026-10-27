# Code Style

How code is written here. [CLAUDE.md](../CLAUDE.md) has the layers and the change rules; [DESIGN.md](../DESIGN.md)
has the look; [UBIQUITOUS_LANGUAGE.md](UBIQUITOUS_LANGUAGE.md) has the names. Each rule below points at code that
already follows it: match that shape. Why a rule exists is in the ADRs (`docs/adr/`, index in its README).

## 1. Components

| What                            | Where                                                  |
| ------------------------------- | ------------------------------------------------------ |
| App-wide, purely presentational | `shared/ui/` (the kit)                                 |
| shadcn primitive                | `shared/ui/primitives/`, added with the shadcn CLI     |
| Only an entity's own data shown | `entities/<x>/ui/` (a piece's credits, a step's title) |
| Composite, tied to screens      | `widgets/<x>/ui/`                                      |
| Screen root                     | `pages/<x>/ui/`                                        |
| Part of one parent              | beside it, in the same `ui/` folder                    |

- About 200 lines a file. Past that, extract children or move state into `model/`.
- **One exported component per file, named for the file.** Private helpers may stay.
- A page composes widgets and the kit, with little markup of its own.
- **Every page earns its place.** No middle page, no redirect the learner did not choose, no "coming soon". A row
  that leads to a page is a `RowLink` (chevron); a row that opens a sheet over its page is a `RowButton` (none).
- **A thing's page and a tool's are two pages.** An explorer's URL names the thing it shows; a tool's URL holds what
  the learner gave it. Tabs are views of one thing, never a tool. A new Practice page is a row in `PRACTICE_PAGES`
  with its tile in `PAGE_TILES`.
- **Whatever has a name is found by Search** (`indexEntries` in `pages/search`): a new kind of named thing is a kind
  there, and its test holds the count to its registry.
- **One implementation of a thing, used everywhere.** The Player and the editor share their header, transport, View,
  Transpose and selection. Copy the nearest slice's shape before inventing one.

## 2. Hooks, state and effects

- Stateful or effectful logic (subscriptions, timers, audio, MIDI, measuring) is a hook: shared ones in `shared/lib`,
  one-offs beside their component.
- **Pure domain logic never lives in a component or a hook.** It goes in `shared/lib` or `entities/*/model`, tested
  without React.
- **Where state lives:** what you look at is in the URL; what must be remembered is a saved store
  (`createSavedStore`); a screen's last view is `pt-views`; everything else is component state.
- **Derive during render.** `useEffect` only syncs with the outside world (DOM attributes, audio, MIDI,
  `matchMedia`). A child never reports a derived value up through an effect.

## 3. Complex state

- Values that change together, or distinct phases, are a pure reducer or a discriminated-union machine outside the
  component, with its own tests (`features/practice/practice-machine.ts`, `features/trainer/round-machine.ts`). The
  component dispatches.
- **A page with many acts exposes one hook,** `pages/<x>/model/use-<thing>.ts` (`use-player.ts`,
  `use-library-page.ts`). It composes the stores and acts inside and is the page's test surface (`renderHook`).
- **What is open over a page is one union value, never a flag each** (`use-library-page.ts`'s pending act, `use-editor-takes.ts`'s
  sheet's page). Separate booleans make "a dialog over a sheet" reachable.
- A lone toggle stays `useState`.

## 4. Composition and variants

- No boolean-prop proliferation (`isPrimary`, `isCompact`). A choice a prop would make is its own component or its
  `children`: a Setup sheet composes its first page, `ChordRow` its parts.
- **Variants are lookup maps of complete class strings** (`primitives/button.tsx`, `role-classes.ts`). Never
  `` `bg-${x}` ``: Tailwind cannot see it.
- Multi-part UI is a compound component sharing context, not a wide prop list. `children` over `renderX`; a render
  prop only when the parent injects per-item data.
- **React 19:** `ref` is a normal prop (no `forwardRef`); `use(Context)`; `<Context value>` without `.Provider`.
- A widget whose view a URL holds owns that view's type in its `model/` (`ChordView`, `ScaleView`); the route's
  validator imports it with `import type`.

## 5. The kit, tokens and controls

**Add to `shared/ui`** only what is app-wide and presentational and has a second user. Read its barrel (`index.ts`)
before writing a control: a segmented choice, a dropdown, a row, a sheet, a tooltip, a fold and a toast are there.
shadcn primitives come from the CLI (`shadcn` skill), never by hand; the CLI's sizes under 44px are removed.

**Choosing a control** (Apple's HIG): five or fewer short nouns are a `Segmented`; more, or longer, a `Dropdown`; on
or off a `SwitchRow`; a note a `NoteChoice`, a key a `KeyChoice`, an inversion its drawn stack (`InversionChoice`);
several on-or-offs on a sheet `ToggleTile`s; quick choices whose effect shows at once a popover by their button;
settings changed less often a `Sheet`.

**Tokens.** Tailwind v4 with two layers: primitives (`--p-*`) in `src/styles/tokens.css`, semantic roles over them,
exposed as utilities by `@theme inline` in `src/styles/theme.css`.

- Semantic utilities only (`bg-card`, `text-muted-foreground`, `bg-role-3rd`): never a primitive, a hex value or
  `p-[13px]`. A new role goes in `tokens.css` for light, dark and `prefers-contrast: more`.
- Values worked out at runtime (a key's place) go in `style`; every fixed value is a token, a utility or a named
  constant. A layout that changes by form factor is one `@utility` placing children by `data-area`
  (`player-screen`, `score-bar`), not a wall of arbitrary grid values.
- **Compose with `cn()`** (`shared/lib/cn.ts`). The scales use Tailwind's own names so `cn()` knows them; a new
  custom name is registered with `createCn` from `cn/config`, with a test, or `cn()` drops classes.
- `flex`/`grid` with `gap-*`, not `space-*`. Equal width and height is `size-*`.
- **No `dark:` in app code.** Dark mode is the token remap under `[data-theme='dark']`; `dark:` is bound to that
  attribute only so shadcn primitives follow the app's setting. Colours CSS cannot reach (the browser bar, the
  manifest) come from `THEME_COLORS`, held by a test to `--background`.

**Controls.**

- **44px targets** (`min-h-11`, `size-11`); every `Button` size already meets it. A control drawn smaller grows its
  reach to 44px (`ModeSwitch`). Icon-only controls have an `aria-label` and a tooltip, and 20px icons (lucide).
- **A control has the same name, icon and place at every size.** No label shown on a laptop alone, no option offered
  at one size only. A row that does not fit wraps or shrinks to 44px; it never loses a control.
- **One focus ring,** from the base layer (3px, 2px off). No `outline-none` and no ring of a component's own. Inside
  a scroller or a clipped box, `focus-visible:-outline-offset-3`. Siblings gap by at least `gap-2`, or the ring
  of one covers the next.
- Every interactive element has hover, `focus-visible`, `disabled` and a transition. `hover:` fires only for a mouse
  or a trackpad (`theme.css`), so a tap leaves no wash behind.
- **A link is a link:** a button-looking link is `ButtonLink` or `RoundLink` over the router's `Link`, never
  `<Button render={<Link />}>` (Base UI sets `role="button"`). A control that acts stays a `Button`.
- **An explanation is an ⓘ.** What a control does, where its name does not say, is the `InfoTip` beside its name
  (`info` on `SwitchRow`, `SettingField`, `Labelled`, `MenuSection`). Never a line of text under a control. A term's
  meaning and why a control is greyed go in its tooltip.
- Compose primitives as shadcn does: a button inside a field is `InputGroup` + `InputGroupAddon`; a slider is named by
  its `SliderLabel`; a switch by the `<label>` round it.
- **A chord symbol on screen is printed** (`printedSymbol`, `printedChord`: `C♯m7`, `B♭`), in text, titles and
  accessible names alike. What is stored, typed, parsed, compared or put in a URL stays ASCII (`C#m7`).
- **A screen's keys are `LiveKeyboard`** (`features/live-keyboard`): every key sounds when touched, typed or played
  on MIDI, and follows the saved keyboard settings; a screen never sizes it. Anything that sounds on a screen shows on
  its keys.
- **A button that plays becomes Stop while its sound plays** (`usePlayback`). In a grid of items the item is a
  toggle, `aria-pressed` while it sounds.

## 6. TypeScript, imports and URLs

- `import type` for types · no `any` (take `unknown` and narrow) · small domain types over bare numbers and strings
  (`PitchClass`, `Midi`, `Tick`, `StepId`) · another slice only through its `index.ts` · the `@/` alias across
  slices.
- **Search params** are validated in `app/routes/<place>-search.ts`. An invalid value takes its default, silently.
  Each validator writes every param it owns (an invalid optional one as `undefined`), or a stale value leaks through.
  Defaults leave the URL (`stripSearchParams`); a control's change replaces the history entry.
- Validators run as the app opens, so they import only what a URL is made of (`read-search.ts`, a `*-choice.ts`),
  never a module that arranges or plays.

## 7. Performance and build

- **Subscribe narrowly:** `useSettings(selectTheme)`, never the whole state. State a handler reads only when it runs
  comes from `useSettingsStoreApi().getState()` at call time.
- Never define a component inside a component. Hoist static JSX and lookup maps to module scope.
- `memo` deliberately: a list row under a busy parent, with stable props.
- A ternary, not `cond && <X />` (a `0` renders).
- `startTransition` / `useDeferredValue` for costly, non-urgent updates (search, filters).
- **Every screen is lazy** (`lazyRouteComponent` over an `app/routes/*-screens.ts` module, one chunk per group that
  loads together). Fallback screens (not found, `RouteError`) stay eager. The engraver loads only with a staff
  (`LazyScoreView`); `shared/ui/score` is imported by that path, never through the kit's barrel.
- Check a production build with `npm run build && npm run preview` after touching startup, routing, the PWA or config.
  A `VITE_` variable is public. The Vercel config is `vercel.ts`, pinned by `vercel.test.ts`.

## 8. Music code

- **Spell from letter steps plus semitones,** never from a table of sharp or flat names. Name tables (`note.ts`) are
  for a pitch with no letter context only.
- **Transpose by interval, keeping letters** (`transposeNote`): D in G is E♭ in A♭. A root that would need a double
  accidental takes its plain spelling; chord tones and slash basses are spelled from the root.
- A root found from an interval is spelled by letters, then named plainly (`spellBelow` / `spellAbove`, `plainRoot`):
  the tritone sub of B♭7 is E7, never F♭7.
- **One table each:** chord names in `chord-name.ts` (stacks by `stackSuffix`, built chords by `buildChord`), a
  chord's root spelling in `chordRootSpelling`, available tensions in `tensions.ts`, numerals' qualities through the
  chord symbols' own suffix reading (`numerals.ts`), keys played named by `nameChords`. Never a second table.
- **Placing tones:** `placeChord` / `placeScale` / `placeScaleChords`; a stack's inversions from `lastInversion`. A
  chord of `TWO_HANDS_FROM` (5) notes or more takes two hands; never stack a big chord in one hand to be played. A row
  of chords is voiced by `voiceLead`.
- **Time is ticks** (`TICKS_PER_BEAT` = 24, `shared/lib/music/time.ts`). Seconds appear only in `shared/lib/schedule`
  and the audio adapter. A take is the one thing kept in milliseconds, as played; `quantise` snaps it to ticks.
- **A Performance is what sounds and what is written:** each note keeps its written onset, length and spelling.
  `notate` writes it as a Score; a Score is never played.
- **`arrangement` exports `arrange`** (and a few named helpers). Voice leading, fingering and inversions inside it are
  tested through `arrange`.
- **The kernel is fenced** (lint): `music` imports only itself; `arrangement` and `notation` only `music`; none
  imports a package.
- **Audio and MIDI only through `useServices()`.** No code creates an `AudioContext` or calls `requestMIDIAccess`.
  Scheduled music goes through `play()` (`usePlay`); a hand's keys through the live voice (`useLiveVoice`), never
  `play()`. What sounds is the port's to know (`useSoundingKeys`).
- Randomness is injected (`random: () => number`), so trainers test deterministically.
- Content is data held by tests: an unparsed chart, an unknown chord or a missing Russian text fails
  ([CONTENT](CONTENT.md)).

## 9. Tests

- **Test first** (`tdd` skill). A test names behaviour a learner or a caller sees ("saves a new language").
- Tests sit beside their file. `*.test.ts` runs in node, `*.test.tsx` in jsdom; a `.ts` test that needs a DOM starts
  with `// @vitest-environment jsdom`. Import `describe`, `it`, `expect`, `vi` from `vitest`.
- **What to test:** pure logic in `shared/lib` and `entities/*/model` by unit tests (90% lines enforced there); a
  page's hook by `renderHook`; a screen by its page's test running the whole app (`renderApp(path)`), so routing,
  search params and stores are real. Components by role and accessible name with `userEvent.setup()`. No snapshots.
- **Fakes, not module mocks:** `createMemoryStorage()`, `createFakeAudio()`, `createFakeMidi()`, `stubMatchMedia`,
  `stubServiceWorker`. Helpers in `src/app/testing/` (`renderApp`, `renderRouted`, `renderWithSettings`,
  `testRouter`).
- **Leave nothing behind:** workers share modules and the document (`isolate: false`). Listeners a test adds stop
  with it (`untilTestEnds()` in `src/shared/test/listeners.ts`).
- **jsdom lays nothing out.** Where a box or a scroll matters, `stubBox` and `stubScrolling`
  (`src/shared/test/layout.ts`). A Base UI slider's thumb stays hidden until measured: query it with
  `{ hidden: true }`. Keys that sound: move the fake audio's clock (`audio.setNow(t)`) and read `data-down`; a key let
  go stays down `SHORTEST_PRESS_MS`, so use fake timers. Verovio engraves for real in tests, on the test's thread.
- A gesture, a layout or a keyboard behaviour jsdom cannot show is checked in a browser at the sizes in §11.

## 10. Copy and i18n

- **No sentence that repeats what a label, icon or layout says. No how-to paragraphs.** Empty states and errors get
  one short line. Lessons are the exception: they teach music in prose, never a button.
- Real musical words: "crescendo", not "get louder". A name says what a control does.
- Every UI string is in both `en` and `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`; Russian is typed
  against English, so a missing key fails `tsc`). A namespace is a place's (`learn`, `practice`, `search`); words
  every screen shares are `music`'s. One string, one key.
- Content text is `LocalText { en, ru }`, read through `localText`. Credits stay as printed.
- Note and chord names are the same in both languages (B, not H).
- Keys are words, never numbers (`inversion.first`): typed keys cannot address `inversion.1`.
- A count goes after a colon ("Chords to check: 2"): plurals cannot be typed against English.

## 11. Layout and mobile

- **Mobile first:** the base style is the phone; layer up with `sm:` and `lg:`. Custom variants in `theme.css`:
  `landscape-phone:` (a phone on its side), `small-phone:` (under 390px), `narrow-phone:` (under 360px).
- **Check four sizes:** 390×844 and 320×568 upright, 844×390 on its side, 1280×800 a laptop. Same features, words and
  layout logic at each. Nothing clipped, overflowing or wrapping badly at 320px.
- **A screen takes the width it is given.** No `max-w-*` on a screen. Its gutter is `px-gutter` (bleed with
  `-mx-gutter`); lists are `grid-cards`, fields `grid-fields`, chord buttons `grid-chords`.
- **Floating things float.** The transport, the palette, the floating actions and the zoom buttons take no layout
  room and never push the page. The page gets scroll room under them (`pb-foot-*`, `--float-room`), not an empty
  row. What floats over music steps aside while it is read (`useHiddenWhileReading`).
- **Nothing traps a click.** A transparent or closed layer still takes presses: give it `pointer-events-none` or
  `inert` whenever it is not on top. Test the tap after a popover closes.
- **Nothing jumps.** Switching mode (Player and editor) or entering Select keeps icons in place and heights equal.
- Safe areas through the named utilities (`pt-safe`, `pb-safe`, `px-gutter-safe`, `bottom-safe`), never arbitrary
  values. `dvh`, never `vh`.
- A sideways scroller clips both axes: keep room for focus rings inside it. Hide its bar with `scrollbar-none`.
- **The phone's keyboard:** a sheet stands on it (`pb-sheet-keyboard`); the tab bar, toasts and floating actions
  hide while it is up (`data-keyboard`). Focus a sheet's field through its `initialFocus`, never `autoFocus`.
- **Keys:** a screen's shortcut is one `useShortcuts` call beside what it drives, never a `keydown` listener of its
  own. A letter alone is the piano's (typing), so a shortcut takes a named key or a letter typing leaves free.
- **The installed app is an app:** zoom is locked only when installed; text is unselectable outside fields; no
  callout, no overscroll, no double-tap wait. A new text field needs nothing (`input`, `textarea` select again).

## 12. Motion

- Animate `transform` and `opacity` only, with the one curve, `ease-out` (`--ease-out`). Motion shows a change of
  place or state, or it goes.
- 150–300ms for feedback in the page; a sheet or the keys' fold travel further and take longer.
- **Reduced motion:** `theme.css` cuts CSS animations and transitions to nothing. Script-driven motion asks too:
  `useMediaQuery('(prefers-reduced-motion: reduce)')` or `motion`'s `useReducedMotion`; `morph` changes at once;
  `useScrollMotion` scrolls instantly.
- A view transition goes through `morph` (`shared/lib/morph.ts`), never `document.startViewTransition` directly.
- Strips and diagrams move on their own; the page itself does not move. Finger-driven motion follows the finger and
  can be reversed mid-gesture.
