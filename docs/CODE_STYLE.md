# Code Style

How code is written in Piano Trainer. Builds on [CLAUDE.md](../CLAUDE.md); adapted from Mindscape's
(memory-palaces) style guide, keeping only what applies here. Goal: small, single-responsibility, tested units.

## 1. Compose small components

A container wires data to presentational children. One job each.

| What                            | Where                                                            |
| ------------------------------- | ---------------------------------------------------------------- |
| App-wide, purely presentational | `shared/ui/`                                                     |
| shadcn primitive                | `shared/ui/primitives/` (added with the shadcn CLI, not by hand) |
| Composite, tied to screens      | `widgets/<x>/ui/`                                                |
| Screen root                     | `pages/<x>/ui/`                                                  |
| Subpart of one parent           | beside it, in the same `ui/` folder                              |

- About 200 lines per file. Past it, extract children, or move state into `model/`.
- **One exported component per file, named for the file.** Private helpers may stay.
- A page composes widgets and `shared/ui`, with little markup of its own.
- Promote to `shared/ui` only what is app-wide and presentational.

## 2. Logic into hooks; components render

- Stateful or effectful logic (subscriptions, timers, audio, MIDI, DOM measurement) goes in a hook: reusable ones
  in `shared/lib`, one-offs beside their component.
- **Pure domain logic never lives in a component or a hook.** It goes in `shared/lib` or `entities/*/model`,
  tested without React.

## 3. Complex state → a reducer or a machine

- Several values changing together, or distinct phases → a pure reducer or discriminated-union machine outside the
  component, with its own tests (from Phase 2: `features/practice/practice-machine.ts`,
  `features/quiz/quiz-machine.ts`). The component dispatches.
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
- **Chord-tone colours are role tokens** (`--role-root` … `--role-13th`). A coloured key always also shows its
  degree or finger label, so colour is never the only cue.
- Interactive elements: hover, `focus-visible`, `disabled`, and a transition. Icon-only controls get an
  `aria-label`. Minimum target 44px (`min-h-11`, `size-11`); every `Button` size already meets it, so the CLI's
  smaller sizes are removed from `ui/primitives/button.tsx`.
- Clear the notch and the home indicator with `pt-safe` / `pb-safe` (`theme.css`), not arbitrary values.
- Colours CSS cannot reach (the browser toolbar, the manifest) come from `THEME_COLORS` (`shared/config`), which a
  test holds to `--background`: a repaint changes `tokens.css` and `THEME_COLORS` together.
- Mobile-first: the base style is the phone; layer up with `sm:` and `lg:`.
- Motion animates `transform` and `opacity` only, and must mean something. `prefers-reduced-motion` is honoured
  globally in `theme.css`.

## 6. TypeScript and imports

`import type` for type-only imports · no `any` (take `unknown` and narrow) · small domain types over bare numbers
and strings (`PitchClass`, `Midi`, `StepId`) · another slice only through its `index.ts` · the `@/` alias, never
`../../` across slices.

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
- Domain time is **ticks** (12 per beat). Seconds exist only in `shared/lib/schedule` and the audio adapter.
- Audio and MIDI are reached **only** through `useServices()` (ports in `shared/api`). No component or hook creates
  an `AudioContext` or calls `requestMIDIAccess`.
- Randomness is injected (`random: () => number`), so every quiz test is deterministic.
- Content is data validated by tests: a chart that does not parse, an unknown chord symbol, or a missing Russian
  text fails CI.

## 9. Tests

- **Test first** (`tdd` skill). A test names behaviour a learner or caller can observe ("saves a new language"),
  not an implementation detail.
- Components: Testing Library, by role and accessible name; `userEvent.setup()` for interaction. No snapshots.
- Ports are replaced by **fakes** (`createMemoryStorage()`, `stubMatchMedia`, `stubServiceWorker`; from Phase 2
  `FakeAudio` and `FakeMidi`), not by mocking modules.
- A component under the settings store: `renderWithSettings(ui, { locale, theme })`; whole-app behaviour:
  `renderApp(path, { locale })`; both in `src/app/testing/`.
- `globals: false`: import `describe`, `it`, `expect` and `vi` from `vitest`.

## 10. Copy and i18n

- **No sentence that repeats what a label, icon or layout already says. No how-to paragraphs.** Empty states and
  errors get one short line.
- Every interface string goes through i18next, in **both** `en` and `ru`
  (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`; Russian is typed against English).
- Content text a learner reads is `LocalText { en, ru }` (from Phase 2). Credits stay as printed.
- Note and chord names are the same in both languages (B, not H).

## 11. Build and deploy

- The Vercel config is `vercel.ts` (`@vercel/config`, a `config` export, which is what Vercel's build reads): the
  SPA rewrite for every path but `/assets/`; `/assets/*` immutable; `index.html`, `sw.js` and the manifest
  revalidate. `vercel.test.ts` pins all of it. Read `vercel:knowledge-update` before changing it.
- Check a production build with `npm run build && npm run preview`: it catches lazy-chunk, asset and
  service-worker problems `dev` hides.
- A `VITE_` variable is public. Never put a secret in one.
