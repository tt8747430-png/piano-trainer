# Code Style

How code is written in Piano Trainer. Builds on [CLAUDE.md](../CLAUDE.md); adapted from Mindscape's
(memory-palaces) style guide, keeping only what applies here. Goal: small, single-responsibility, tested units.

## 1. Compose small components

A container wires data to presentational children. One job each.

| What                            | Where                                                            |
| ------------------------------- | ---------------------------------------------------------------- |
| App-wide, purely presentational | `shared/ui/`                                                     |
| shadcn primitive                | `shared/ui/primitives/` (added with the shadcn CLI, not by hand) |
| Only an entity's own data shown | `entities/<x>/ui/` (a piece's credits, a step's title)           |
| Composite, tied to screens      | `widgets/<x>/ui/`                                                |
| Screen root                     | `pages/<x>/ui/`                                                  |
| Subpart of one parent           | beside it, in the same `ui/` folder                              |

- About 200 lines per file. Past it, extract children, or move state into `model/`.
- **One exported component per file, named for the file.** Private helpers may stay.
- A page composes widgets and `shared/ui`, with little markup of its own.
- Promote to `shared/ui` only what is app-wide and presentational. The kit: `PianoKeyboard` (the one keyboard) with
  `RailButton` (a button in its rail, filling its `children` slot), `Pinned`, `ScreenHeader`, `RoundButton` /
  `RoundLink`, `ButtonLink`, `Segmented`, `ChipRow`, `Sheet` / `SheetTrigger` / `SheetContent` / `SheetClose`,
  `RatingMark`, `LevelMark`.
- **A screen shows a keyboard as `LiveKeyboard`** (`features/live-keyboard`): every key sounds when touched, typed or
  clicked. A key goes down while the app sounds it or a hand holds it (a finger, a typed key, MIDI): a tap is a hand's
  play (`useSoundKey`), so its key is down while pressed, not while it rings, and for at least the shortest press
  (`usePresses` in `shared/lib`, which every hand's keys go through). It follows the **keyboard settings**
  (key size, swipe, note names, the map, typing), saved for every keyboard and set from the rail's settings button or
  Settings (`KeyboardSettingsFields`, one component in both places); a screen never passes them itself. The
  explorers, Symbols and a Piece's chart pass `spotlight`: the keys the app puts down are the ones struck last (an
  arpeggio's key alone, a chord's together), every mark kept; the Player and the quiz do not, and every key sounding
  is down there.
  `PianoKeyboard` itself requires an `onKeyPress`, so no key is a dead end. Anything that plays sound on a screen shows
  it on that screen's keyboard (pin it when the page scrolls away from it).
- **Every button that plays turns into Stop while its sound plays** (`usePlayback`, §8); in a grid of items (a Piece's
  bars, a scale's chords) the item is a toggle instead, `aria-pressed` while it plays. A sound a screen makes by itself
  (a choice sounding, a quiz's question) has no button and no Stop.
- A widget whose view a route's URL holds owns that view's type in its `model/` (`ChordView`, `ScaleView`,
  `SetupParams`); `app/routes/search.ts` imports it with `import type`.

## 2. Logic into hooks; components render

- Stateful or effectful logic (subscriptions, timers, audio, MIDI, DOM measurement) goes in a hook: reusable ones
  in `shared/lib`, one-offs beside their component.
- **Pure domain logic never lives in a component or a hook.** It goes in `shared/lib` or `entities/*/model`,
  tested without React.

## 3. Complex state → a reducer or a machine

- Several values changing together, or distinct phases → a pure reducer or discriminated-union machine outside the
  component, with its own tests (`features/practice/practice-machine.ts`, `features/quiz/quiz-machine.ts`). The
  component dispatches.
- A page with many acts exposes **one** hook, `pages/<x>/model/use-<thing>.ts`. That hook is the test surface
  (`renderHook`), not the page.
- **A confirmation or multi-step flow is one union value, never a flag each**
  (`stage: 'idle' | 'confirm' | 'working'`).
- A lone toggle stays `useState`.

## 4. Composition over configuration

- No boolean-prop proliferation (`isPrimary`, `isCompact`): use variants or `children` slots.
- **Variants are lookup maps of complete static class strings.** Never `` `bg-${x}` ``: Tailwind cannot see it.
- Multi-part UI → compound components sharing context, not a wide list of props.
- `children` over `renderX`; a render prop only when the parent injects per-item data.
- **React 19:** `ref` is a normal prop (no `forwardRef`); `use(Context)`; `<Context value>` without `.Provider`.

## 5. Tailwind and tokens

Tailwind v4 with two layers: primitives (`--p-*`) → semantic roles (`--primary`, `--card`, `--role-root`, …) in
`src/styles/tokens.css`, exposed as utilities by `@theme inline` in `src/styles/theme.css`.

- **Semantic utilities only** (`bg-card`, `text-muted-foreground`, `bg-role-3rd`): never a raw colour, never a
  primitive, never `p-[13px]`. No role yet → add one to `tokens.css`, in both themes.
- **Compose with `cn()`** (`shared/lib/cn.ts`, which re-exports shadcn's `cn` package; shadcn primitives import the
  package directly). A custom theme name its default tables do not know (a new text size, radius or shadow) must be
  registered with `createCn` from `cn/config`, with a test, or `cn()` drops classes.
- **Stack with `flex`/`grid` and `gap-*`,** not `space-x-*`/`space-y-*`. Equal width and height → `size-*`.
- **Dark mode is the token remap under `[data-theme='dark']`.** App code writes no `dark:` classes. `dark:` is bound
  to `data-theme` only so shadcn primitives follow the app's setting rather than the OS.
- **The world is a labelled picture book, printed quietly** (ADR 0010, ADR 0011): seven faded paints at one
  lightness, each with a pale wash. What each colour does is a token: `--primary` (honey) the one action and the only
  control filled with a colour, `--selected` (umber, neutral) a chosen chip, `--learned` learned, on and connected,
  `--link` links and `--ring` focus, `--attention` a gap, `--destructive` a wrong key or a reset, `--border` the soft
  1px line round a card, `--input` the 1px line round a control (3:1), `--hairline` a divider. A chosen segment or
  Theory tab is `bg-card` with `border-input` on a `bg-muted` track; the nav's place is `bg-muted`. Every line is 1px
  (`border`, `divide-y`); only focus rings and the keys' own rings are wider. `tokens.css` holds light, dark and a
  `prefers-contrast: more` layer: a new role gets all three where it is a line or a secondary ink.
- **Chord-tone colours are role tokens** (`--role-root` … `--role-13th`, each with its `-wash`). A coloured key always
  also shows its degree or finger label, so colour is never the only cue. **Palette law:** role colours only on chord
  tones (keys, a chord's tone chips); hand colours (`--hand-rh`, `--hand-lh`, `--hand-melody`, each with its `-wash`)
  only in the Player; `--attention` only for a gap or "to check" (the dot, never the text beside it); the chrome's
  paints (`--paint-*`, each paint's wash, with `--on-paint-*` its deep shade for the icon on it) name places and kinds
  of step, never a chord tone; a hand's colour as text is `--hand-*-ink`. The keys have their own
  roles: a mark is its wash while its key is quiet and its full colour while it sounds (`--key-scale` and
  `--key-scale-down`, `--key-tonic` and `--key-tonic-down`, a role or hand and its `-wash`), a plain key sounding is
  `--key-down`; the inks are `--on-key-*` and `--on-role`; their material is `--key-rail` (with `--on-key-rail`), `--key-bed`, `--key-shade`,
  `--key-lip`, `--key-sheen` (the No Glow Rule's one exception, on keys only); a slider's thumb is `--thumb`.
- **Two faces:** Onest for reading and every control (buttons, chips, segments, tabs, the nav); Literata
  (`font-display`, variable in weight and optical size) for titles (every `h1`–`h3`, at 600 from the base layer) and
  chord symbols. Both faces are variable, so a `font-display` element that is not a heading sets its weight
  (`font-semibold`); never a serif on a control. Faux bold is off.
- **Values worked out at runtime** (a key's place, the keys' width and length) go in `style`; every fixed value is a
  token, a utility or a named constant.
- **Scales on Tailwind's own names,** so `cn()` already knows them: radii `rounded-xs` 6 · `sm` 9 · `md` 10 · `lg` 11
  · `xl` 12 · `2xl` 12 · `3xl` 14 · `4xl` 20 (black keys, white keys, primitives, chips, buttons, cards, sheets); type
  one size per text style, in rem so it follows the reader's text size: `text-lg` 17 · `xl` 20 · `2xl` 22 · `3xl` 28
  · `4xl` 34 · `5xl` 44 (headline, title 3, title 2, title 1, large title, display), Tailwind's `7xl` 72 for the
  chord display; `ease-out` is the one
  curve. Numerals that change in place are `tabular-nums`.
- Interactive elements: hover, `focus-visible`, `disabled`, and a transition. Icon-only controls get an
  `aria-label`, and their icons are 20px. Minimum target 44px (`min-h-11`, `size-11`); every size of `Button`,
  `Toggle`, `Input`, `InputGroup`, `Switch` and `Slider` already meets it, so the CLI's smaller sizes are removed.
- **A link is a link.** Base UI's `Button` always sets `role="button"`, so a link that looks like a button is the
  kit's `ButtonLink` (or `RoundLink`) rendering the router's `Link`, never `<Button render={<Link />}>`. A control
  that acts (plays, closes, confirms) stays a `Button`.
- **Compose the primitives as shadcn does:** a button inside a field is `InputGroup` + `InputGroupAddon`; a slider is
  named by its `SliderLabel`; a sheet's switch is named by the `<label>` around it, with no second `aria-label`.
- Clear the notch and the home indicator with `pt-safe` / `pb-safe` / `bottom-safe` (`theme.css`), not arbitrary
  values. A row that scrolls sideways hides its bar with Tailwind's `scrollbar-none`. A phone on its side is the
  `landscape-phone:` variant (the Player's two columns).
- Colours CSS cannot reach (the browser toolbar, the manifest) come from `THEME_COLORS` (`shared/config`), which a
  test holds to `--background`: a repaint changes `tokens.css` and `THEME_COLORS` together.
- Mobile-first: the base style is the phone; layer up with `sm:` and `lg:`.
- Motion animates `transform` and `opacity` only, and must mean something. `prefers-reduced-motion` is honoured
  globally in `theme.css`.

## 6. TypeScript and imports

`import type` for type-only imports · no `any` (take `unknown` and narrow) · small domain types over bare numbers
and strings (`PitchClass`, `Midi`, `StepId`) · another slice only through its `index.ts` · the `@/` alias, never
`../../` across slices.

**Search params** are validated in `app/routes/search.ts`: an invalid value takes its default, silently (no
clamping). Each validator writes every one of its params, an invalid optional one as `undefined`, because the router
lays a route's search over the raw one and a param left out would let the stale value through. Defaults leave the
URL (`stripSearchParams`), and a control's change replaces the history entry (`replace: true`).

## 7. Performance

- **Subscribe narrowly:** `useSettings(selectTheme)`, never the whole state. State a handler needs only when it runs
  → `useSettingsStoreApi().getState()` at call time.
- **Derive during render. `useEffect` only syncs with the outside world** (DOM attributes, audio, MIDI,
  `matchMedia`).
- Never define a component inside a component. Hoist static JSX and lookup maps to module scope.
- `memo` deliberately: a list row under a busy parent, with stable props.
- Every route's screen is lazy (`lazyRouteComponent` over an `app/routes/*-screens.ts` module; each module is one
  chunk of the screens that load together), so the first paint carries only the shell. The fallback screens (not
  found, `RouteError`) stay eager: they must render even when a chunk fails to load.
- A ternary, not `cond && <X />` (a `0` renders).
- `startTransition` or `useDeferredValue` for expensive, non-urgent updates (search, filters).

## 8. Music code

- **Spelling comes from letter steps + semitones,** never from a table of sharp or flat names. That is what keeps
  C♭, E♯, F𝄪 and 𝄫7 right. Name tables are for display only where no key exists.
- **Transpose by interval, keeping letters:** `transposeNote(note, fromTonic, toTonic)` applies the interval from
  the old tonic to the note to the new tonic, so D in G is E♭ in A♭. A root that would need a double accidental
  takes its plain spelling; chord tones and slash basses are then spelled from the root. Never move by semitones and
  then choose sharps or flats.
- **The kernel is fenced:** `shared/lib/music` imports nothing outside itself, `shared/lib/arrangement` only music,
  and neither imports a package (lint).
- **`arrangement` exports only `arrange`** (plus `parseFigure`, `TICKS_PER_BEAT` and the types). Voice leading, the
  chord context and fingering are internal and tested through `arrange`.
- Domain time is **ticks** (12 per beat). Seconds are worked out only in `shared/lib/schedule` and the audio adapter:
  Listen's transport reads the audio clock and hands it to the loop (`advanceLoop`, `beatGroupAt`).
- Audio and MIDI are reached **only** through `useServices()` (ports in `shared/api`). No component or hook creates an
  `AudioContext` or calls `requestMIDIAccess`. `usePlay` cuts off what sounds (a chord, a run, a bar) and returns the
  play's handle; `useSoundKey` adds a tap on top, at the audio clock's now, as a hand's play (`{ byHand: true }`: the
  port sounds it but leaves it to the key's press to show); what sounds, and which keys were struck last, is the port's
  to know (`useSoundingKeys()`, `useSoundingKeys('struck')`). The port also says whether a play still sounds
  (`isPlaying(handle)`), so **a Play button is `usePlayback`**: component state over the port, `playing` (the id last
  played, while it plays) and `toggle(id, sounds)`, with no tracker, no provider and no shared state; another button's
  sound cuts it off and the port says so. A chord as the explorers place it is `placedChordSounds`.
- Randomness is injected (`random: () => number`), so every quiz test is deterministic.
- **The explorers place tones with `placeChord` / `placeScale`,** and a chord's inversions are `lastInversion`'s:
  the validator, the segments and the keyboard all ask it.
- Content is data validated by tests: a chart that does not parse, an unknown chord symbol, or a missing Russian
  text fails CI.

## 9. Tests

- **Test first** (`tdd` skill). A test names behaviour a learner or caller can observe ("saves a new language"),
  not an implementation detail.
- Components: Testing Library, by role and accessible name; `userEvent.setup()` for interaction. No snapshots.
- Ports are replaced by **fakes** (`createMemoryStorage()`, `stubMatchMedia`, `stubServiceWorker`,
  `createFakeAudio()`, `createFakeMidi()`), not by mocking modules.
- A component under the settings store: `renderWithSettings(ui, { locale, theme })`; whole-app behaviour:
  `renderApp(path, { locale })`; both in `src/app/testing/`.
- **A screen's test sits beside its page** (`pages/<x>/ui/<X>Page.test.tsx`) and runs the whole app through
  `renderApp`, so routing, search params and stores are real. Test files are outside the layer rules.
- jsdom lays nothing out: Base UI keeps a slider's thumb hidden until it measures the track (query it with
  `{ hidden: true }`), and scrolling code checks `scrollWidth` before it scrolls, so it does nothing there. Where a
  pointer's position or a scroll matters, `src/shared/test/layout.ts` lays out what the test needs: `stubBox(element,
box)` gives an element its box, and `stubScrolling({ clientWidth, scrollWidth })` gives every element scroll metrics
  and a `scrollTo` that moves and fires `scroll`, returning each position scrolled to.
- Keys that sound: move the fake audio's clock (`act(() => audio.setNow(t))`) and read the key's `data-down`. A pointer
  on the keys: `fireEvent.pointerDown` on a key and `pointerMove` on the keys' group, whose box `stubBox` gives. A key a
  hand let go stays down for the shortest press: a test that reads it up again uses fake timers and moves them on by
  `SHORTEST_PRESS_MS`.
- `globals: false`: import `describe`, `it`, `expect` and `vi` from `vitest`.

## 10. Copy and i18n

- **No sentence that repeats what a label, icon or layout already says. No how-to paragraphs.** Empty states and
  errors get one short line. The one exception is Theory → Symbols' reading notes (master spec §5): reference text
  about chord symbols behind one row, not instructions for the app.
- Every interface string goes through i18next, in **both** `en` and `ru`
  (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`; Russian is typed against English).
- Content text a learner reads is `LocalText { en, ru }`, read through `localText(text, locale)`. Credits stay as
  printed ([CONTENT](CONTENT.md)).
- Note and chord names are the same in both languages (B, not H).
- **String keys are words,** never numbers (`inversion.first`, `levelName.beginner`): i18next's typed keys cannot
  address `inversion.1`. A table beside the code maps a number to its key.
- A count goes after a colon ("Chords to check: 2"): plural forms cannot be typed against English, and the colon
  reads right for any number in both languages.

## 11. Build and deploy

- The Vercel config is `vercel.ts` (`@vercel/config`, a `config` export, which is what Vercel's build reads): the
  SPA rewrite for every path but `/assets/`; `/assets/*` immutable; `index.html`, `sw.js` and the manifest
  revalidate. `vercel.test.ts` pins all of it. Read `vercel:knowledge-update` before changing it.
- Check a production build with `npm run build && npm run preview`: it catches lazy-chunk, asset and
  service-worker problems `dev` hides.
- A `VITE_` variable is public. Never put a secret in one.
- **The installed app is an app:** `index.html`'s `#standalone-boot` locks zoom only when installed (a browser tab
  keeps its zoom, for accessibility), and `theme.css`'s base layer keeps text unselectable and callout-free outside
  fields, the page from overscrolling, and controls from waiting on a double tap. A new text field needs nothing:
  `input`, `textarea` and `[contenteditable]` select again.
