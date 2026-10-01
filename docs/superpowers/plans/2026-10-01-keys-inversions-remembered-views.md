# Walk the keys, practise an inversion, remember the learner's way, and screens that keep their place — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In-page choices keep the scroll and never become history; the screen's bar hides while reading and returns
on scrolling up; the Player plays any chart in a chosen inversion and walks a progression through the keys; each
screen remembers the learner's way; three lessons from the course's 2-5-1 and degrees PDFs.

**Architecture:** Navigation fixes are one shared options constant (`IN_PLACE`) and router config. The bar is a
`ScreenBarProvider` in `AppShell` that `ScreenHeader` reports to and `Pinned` reads. Inversion and the key walk are
kernel functions (`shared/lib/arrangement`, `shared/lib/music`) reached through `ArrangeOptions` and the Setup.
Remembered views are a new saved entity (`pt-views`) read by remembered routes' `beforeLoad` (router context) and
written on `onResolved`.

**Tech Stack:** React 19, TanStack Router 1.170, zustand `persist` via `createSavedStore`, Vitest 4 + jsdom,
Tailwind 4, Base UI.

**Spec:** `docs/superpowers/specs/2026-10-01-keys-inversions-remembered-views-design.md`

## Global Constraints

- FSD layers (lint-enforced): `app → pages → widgets → features → entities → shared`; `shared/lib/music` imports only
  itself; `shared/lib/arrangement` only music; no package in either.
- Strict TS, no `any`, no casts, no `eslint-disable`, no arbitrary Tailwind values in markup (a named `@utility` in
  `theme.css` instead).
- Every UI string in `en` and `ru` (`ru` typed against `en`).
- Saved stores are `createSavedStore`s with a version and one sanitiser; a shape change is a new version.
- Tests colocated, `globals: false`; whole-app tests through `renderApp`.
- Format only touched files: `npx prettier --write <files>`. Never `npm run format`.
- Each task ends with `npm run typecheck && npm run lint && npm run test` green; Tasks 1, 5 also `npm run build`.
- Do not commit unless the owner asks (then on `main`).

## Review Focus

1. **A remembered route redirecting forever** — a remembered value the validator rejects must not loop: Task 5 test
   "an unreadable remembered value is dropped, one redirect at most".
2. **A link that names a default by leaving it out** (the tool's triads, a walk's default chord size) must not take a
   remembered value: Task 5 test "the tool's triads stay triads".
3. **Back after the redirect** must return where the learner came from (the redirect replaces): Task 5 test.
4. **A triad asked for its 3rd inversion** takes its 2nd; **a 13th chord** plays four notes: Task 3 kernel tests.
5. **The bar hidden while focus is in it** (keyboard user): Task 2 test "stays while focus is inside".

---

### Task 1: Screens keep their place (spec §3.1)

**Files:**
- Create: `src/shared/lib/in-place.ts`
- Modify: `src/shared/lib/index.ts`; the 15 pages and 4 Player pages that call `navigate({ search, replace: true })`
  (`grep -rln "replace: true" src/pages`); `src/widgets/key-explorer/ui/CircleOfFifths.tsx`,
  `src/widgets/key-explorer/ui/KeyFacts.tsx`, `src/widgets/scale-explorer/ui/ScaleFacts.tsx`,
  `src/widgets/progressions/ui/ProgressionLibrary.tsx`; `src/app/router.tsx`
- Test: `src/pages/progressions/ui/ProgressionsPage.test.tsx`, `src/pages/chords/ui/ChordsPage.test.tsx`

**Interfaces:**
- Produces: `IN_PLACE: { readonly replace: true; readonly resetScroll: false }` from `@/shared/lib`.

- [ ] **Step 1: Failing tests.** In `ProgressionsPage.test.tsx`:

```tsx
it('takes a library progression in place: Back then leaves for Learn', async () => {
  const user = userEvent.setup()
  const { router } = await renderApp('/learn')
  await user.click(await screen.findByRole('link', { name: /^Progressions/ }))
  await user.click(await screen.findByRole('link', { name: /^12-bar blues/ }))
  await user.click(screen.getByRole('button', { name: 'Back' }))
  await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
})
```

In `ChordsPage.test.tsx`:

```tsx
it('keeps the scroll when a choice changes the chord', async () => {
  const user = userEvent.setup()
  await renderApp('/learn/chords')
  vi.mocked(window.scrollTo).mockClear()
  await user.click(await screen.findByRole('radio', { name: '1st' }))
  expect(window.scrollTo).not.toHaveBeenCalled()
})
```

- [ ] **Step 2:** `npx vitest run src/pages/progressions src/pages/chords` → both FAIL (Back lands on the first pick;
  `scrollTo` called with `{ top: 0 }`).
- [ ] **Step 3: `IN_PLACE`.**

```ts
// src/shared/lib/in-place.ts
/**
 * A navigation that changes the screen in place: a choice on it, or a link to the view beside it. It
 * replaces the history entry, so Back leaves the screen, and keeps the scroll where the learner is.
 */
export const IN_PLACE = { replace: true, resetScroll: false } as const
```

Export it from `src/shared/lib/index.ts`. In every page, `navigate({ search: (prev) => ({ ...prev, ...x }), replace:
true })` becomes `navigate({ search: (prev) => ({ ...prev, ...x }), ...IN_PLACE })`; `SongsPage`'s `clear` and
`TheoryQuizPage`'s replace of a quiz keep `replace: true` alone (one leaves a filter, the other swaps a screen and
should start at the top). In `CircleOfFifths`, `KeyFacts`, `ScaleFacts` the `replace` prop becomes `{...IN_PLACE}`;
`ProgressionLibrary`'s `<Link to="/learn/progressions" …>` gains `{...IN_PLACE}`.
- [ ] **Step 4: Scroll restoration.** In `createAppRouter`, add `scrollRestoration: true` to `createRouter`.
- [ ] **Step 5:** tests pass; full checks + `npm run build`. In Chrome: Chords scrolled → 1st keeps the scroll;
  Progressions picks → Back → Learn at its scroll.

### Task 2: The screen's bar and the rail (spec §3.2)

**Files:**
- Create: `src/shared/lib/use-shown-on-scroll-up.ts` (+ `.test.ts`), `src/shared/ui/screen-bar.tsx`,
  `src/shared/test/resize.ts`
- Modify: `src/shared/ui/ScreenHeader.tsx`, `src/shared/ui/Pinned.tsx`, `src/shared/ui/index.ts`,
  `src/shared/lib/index.ts`, `src/app/AppShell.tsx`, `src/shared/test/setup.ts`, `src/styles/theme.css`,
  `src/shared/ui/piano-keyboard/KeyRail.tsx`, `src/pages/piece/ui/PieceFacts.tsx`, `src/pages/piece/ui/PieceView.tsx`,
  `src/pages/piece/ui/ListingView.tsx`
- Test: `src/shared/ui/kit.test.tsx` (bar), `src/shared/ui/piano-keyboard/PianoKeyboard.test.tsx` (rail order)

**Interfaces:**
- Produces: `useShownOnScrollUp(): boolean`; `ScreenBarProvider`; `useScreenBar(): { offset: number; shown: boolean;
  report(height: number): void; hold(held: boolean): void }` (`offset` is the bar's row height while it shows, else 0).

- [ ] **Step 1: Failing hook test.**

```ts
// use-shown-on-scroll-up.test.ts
const scrollTo = (y: number) => {
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(y)
  act(() => void window.dispatchEvent(new Event('scroll')))
}
it('shows at the top, hides scrolling down, shows again scrolling up, ignoring a small jitter', () => {
  const { result } = renderHook(() => useShownOnScrollUp())
  expect(result.current).toBe(true)
  scrollTo(120)
  expect(result.current).toBe(false)
  scrollTo(116)
  expect(result.current).toBe(false)
  scrollTo(100)
  expect(result.current).toBe(true)
  scrollTo(0)
  expect(result.current).toBe(true)
})
```

- [ ] **Step 2:** run → FAIL (no module).
- [ ] **Step 3: The hook.**

```ts
// src/shared/lib/use-shown-on-scroll-up.ts
import { useEffect, useState } from 'react'

/** Scrolls shorter than this are a finger's jitter, not a direction. */
const DEAD_ZONE = 8

/**
 * Whether a screen's bar shows: at the top of the page, and from the moment the page scrolls up until
 * it scrolls down again.
 */
export function useShownOnScrollUp(): boolean {
  const [shown, setShown] = useState(true)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y <= 0) {
        last = 0
        setShown(true)
        return
      }
      if (Math.abs(y - last) < DEAD_ZONE) return
      setShown(y < last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return shown
}
```

- [ ] **Step 4: `ResizeObserver` for jsdom** (`src/shared/test/resize.ts`, called in `setup.ts`'s `beforeEach` like
  `stubIntersectionObserver`): a class whose `observe(target)` queues one callback with
  `[{ target, borderBoxSize: [{ blockSize: height, inlineSize: 0 }], contentBoxSize: [...same], contentRect:
  target.getBoundingClientRect(), devicePixelContentBoxSize: [] }]`; `stubResizeObserver({ height = 64 })`.
- [ ] **Step 5: Failing bar test** (`kit.test.tsx`): render `<ScreenBarProvider><ScreenHeader title="Chords"
  back={<button>Back</button>} /><Pinned>keys</Pinned></ScreenBarProvider>`; after the observer reports, the
  header's `data-shown` is `"true"` and the pinned element's `style.top` is `64px`; scroll to 120 → `data-shown`
  `"false"`, `top` `0px`; focus Back, scroll to 300 → still `"true"`.
- [ ] **Step 6: The bar.**

```tsx
// src/shared/ui/screen-bar.tsx
import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import { useShownOnScrollUp } from '@/shared/lib'

interface ScreenBar {
  /** How far what stays at the top sits below the bar: its row's height while it shows, else 0. */
  readonly offset: number
  readonly shown: boolean
  report(height: number): void
  hold(held: boolean): void
}

const NO_BAR: ScreenBar = { offset: 0, shown: true, report: () => {}, hold: () => {} }
const ScreenBarContext = createContext<ScreenBar>(NO_BAR)

/** A screen's bar: shown at the top and on the way back up, hidden while the page is read downwards. */
export function ScreenBarProvider({ children }: { children: ReactNode }) {
  const scrolledUp = useShownOnScrollUp()
  const [height, setHeight] = useState(0)
  const [held, setHeld] = useState(false)
  const shown = scrolledUp || held
  const bar = useMemo(
    () => ({ offset: shown ? height : 0, shown, report: setHeight, hold: setHeld }),
    [shown, height],
  )
  return <ScreenBarContext value={bar}>{children}</ScreenBarContext>
}

/** The screen's bar, for its header and for what stays at the top under it. */
export const useScreenBar = (): ScreenBar => use(ScreenBarContext)
```

`ScreenHeader`: the `<header>` becomes `sticky top-0 z-30 -mx-4 -mt-safe bg-background px-4 pt-safe
motion-safe:transition-transform duration-200 ease-out data-[shown=false]:-translate-y-full lg:mx-0 lg:px-0` with
`data-slot="screen-bar"` and `data-shown={shown}`; its row `<div ref={row} className="flex items-center gap-3 pt-2
pb-4">` holds back, title and actions. A `ResizeObserver` on the row reports `borderBoxSize[0].blockSize`
(`report(0)` on unmount). `onFocus`/`onBlur` on the header call `hold(header.contains(document.activeElement))`.
`Pinned`: reads `useScreenBar()`, `style={{ top: offset }}` and `motion-safe:transition-top duration-200 ease-out`
instead of `top-0`. `theme.css`: `@utility -mt-safe { margin-top: calc(-1 * max(--spacing(4),
env(safe-area-inset-top))); }` and `@utility transition-top { transition-property: top; }`. `AppShell` wraps its
`<main>` in `<ScreenBarProvider>`.
- [ ] **Step 7: The piece page's bar spans the page.** Move `ScreenHeader` out of `PieceFacts` into `PieceView` and
  `ListingView` (first child, above the grid); the laptop column keeps `lg:sticky` with `style={{ top:
  \`calc(${offset}px + 2rem)\` }}` instead of `lg:top-8`.
- [ ] **Step 8: The rail.** Failing test in `PianoKeyboard.test.tsx`: the rail's buttons in order are
  `['Octave down', 'Octave up', 'Keyboard settings']` with the map before them. In `KeyRail`, move the octave-down
  `RailButton` after the map's `flex-1` div, beside octave-up; update the doc comment ("its controls at its end: ‹ ›
  an octave, then the screen's").
- [ ] **Step 9:** checks green; Chrome: Chords scrolled down hides the bar, a flick up shows it above the keys; the
  piece page on a phone width keeps its bar over the chart.

### Task 3: Inversion in every Player (spec §4)

**Files:**
- Modify: `src/shared/lib/arrangement/voice-leading.ts` (+ test), `src/shared/lib/arrangement/chord-context.ts`,
  `src/shared/lib/arrangement/arrange.ts` (+ test), `src/shared/lib/music/place.ts` (`INVERSIONS`, `Inversion`),
  `src/shared/lib/music/index.ts`, `src/entities/pattern/model/accompaniment.ts` (+ test),
  `src/entities/pattern/model/plays-chord.ts` (new, + test), `src/entities/pattern/index.ts`,
  `src/widgets/player-setup/model/setup-params.ts`, `src/widgets/player-setup/ui/{setup-context.ts,PlayerSetup.tsx,
  FigureRows.tsx,InversionField.tsx (new)}`, `src/shared/ui/Segmented.tsx` (`disabled`), `src/app/routes/
  player-search.ts` (`figures` reads `inversion`), `src/pages/player/model/{player-search,walk-search,
  chromatic-search,progression-search}.ts`, `src/pages/player/model/use-*-player.ts`, `src/features/practice/
  {walk,chromatic-choice,progression-choice}.ts`, locales `player.ts` (en, ru)
- Test: `voice-leading.test.ts`, `arrange.test.ts`, `plays-chord.test.ts`, `src/pages/player/ui/
  ProgressionPlayerPage.test.tsx`

**Interfaces:**
- Produces: `INVERSIONS = [0, 1, 2, 3] as const`, `type Inversion` (music); `inversionPitchClasses(tones): PitchClass[]`,
  `voiceInversion(previous, pcs, inversion): Midi[]` (arrangement); `ArrangeOptions.inversion?: Inversion`;
  `Accompaniment.inversion: Inversion | null`; `SetupParams.inversion?: Inversion`; `FigureChange` includes
  `inversion`; `playsChord(figure: Figure): boolean` (pattern).

- [ ] **Step 1: Failing kernel tests** (`voice-leading.test.ts`):

```ts
const pcs = (symbol: string) => inversionPitchClasses(spellChordSymbol(symbol))
it('plays a chord of up to four notes whole, a bigger one rootless with its 9th first', () => {
  expect(pcs('C')).toEqual([0, 4, 7])
  expect(pcs('Dm7')).toEqual([2, 5, 9, 0])
  expect(pcs('Dm9')).toEqual([4, 5, 9, 0]) // E F A C
  expect(pcs('G13')).toEqual([9, 11, 5, 4]) // A B F E: root and 5th out
})
it('stacks from the inversion’s note, lowest E3–E4, nearer the last chord', () => {
  expect(voiceInversion(null, [0, 4, 7], 1)).toEqual([64, 67, 72]) // E4 G4 C5
  expect(voiceInversion(null, [0, 4, 7], 3)).toEqual([55, 60, 64]) // a triad's 3rd → its 2nd
  expect(voiceInversion(null, [4, 5, 9, 0], 3)).toEqual([60, 64, 65, 69]) // Dm9 from its 7th
  expect(voiceInversion([67, 71, 74], [4, 7, 11], 0)).toEqual([64, 67, 71]) // E nearer than E3
})
```

(`spellChordSymbol` = the kernel's chord-from-symbol helper; use `spellChord(parseChordSymbol(s).root,
parseChordSymbol(s).quality)` if no such helper is exported.) Run → FAIL.
- [ ] **Step 2: Kernel.**

```ts
// voice-leading.ts
const TENSIONS = new Set(['9th', '11th', '13th'])

/**
 * What the right hand plays of a chord in an inversion, in the order it stacks: a chord of up to four
 * notes whole (root, 3rd, 5th, 7th); a bigger one leaves its root to the bass and its 5th out, down to
 * four notes, its first tension standing where the root was.
 */
export function inversionPitchClasses(tones: readonly Tone[]): PitchClass[] {
  if (tones.length <= 4) return tones.map((tone) => tone.pitchClass)
  const upper = tones.slice(1)
  const fitted = upper.length > 4 ? upper.filter((tone) => tone.role !== '5th').slice(0, 4) : upper
  const first = fitted.findIndex((tone) => TENSIONS.has(tone.role))
  const ordered = first < 0 ? fitted : [fitted[first], ...fitted.filter((_, i) => i !== first)]
  return ordered.flatMap((tone) => (tone ? [tone.pitchClass] : []))
}

/**
 * The chord stacked close from its note number `inversion` (a smaller chord from its last), the lowest
 * note from E3 to E4, the octave that moves least from `previous` when there are two.
 */
export function voiceInversion(
  previous: readonly Midi[] | null,
  pcs: readonly PitchClass[],
  inversion: number,
): Midi[] {
  const lowest = pcs[Math.min(inversion, pcs.length - 1)] ?? 0
  const before = previous?.length ? [...previous].sort(ascending) : null
  let nearest: number[] = []
  let shortest = Infinity
  for (let base = LOWEST_BASE; base <= HIGHEST_BASE; base++) {
    if (pitchClass(base) !== lowest) continue
    const voicing = voicingFrom(base, pcs)
    const moved = distance(voicing, before)
    if (moved < shortest) {
      shortest = moved
      nearest = voicing
    }
  }
  return nearest.map(midi)
}
```

`chordContext(chord, previous, key, inversion: Inversion | null)`: `voiced = inversion === null ? voiceLead(previous,
rightHandPitchClasses(chord.tones)) : voiceInversion(previous, inversionPitchClasses(chord.tones), inversion)`.
`arrange` passes `options.inversion ?? null`. `INVERSIONS`/`Inversion` live beside `lastInversion` in `place.ts`.
- [ ] **Step 3: An arrange test:** `ii-V-I` sevenths in C with `inversion: 1`: every `rh` chord event's lowest note
  is the chord's 3rd (F, B, E). Run → pass.
- [ ] **Step 4: Pattern.** `Accompaniment` gains `readonly inversion: Inversion | null`; `accompanimentOptions` adds
  `...(inversion === null ? {} : { inversion })`. `playsChord(figure)`: true when any event's tone token is `chord` or
  `voice` (a `MelodyFigure` is false). Test: `b1` true, `inv` false, `flow` false, `jaz` true.
- [ ] **Step 5: URL and choices.** `SetupParams.inversion?: Inversion`; `FigureChange = Pick<SetupChange, 'pattern' |
  'rh' | 'lh' | 'inversion'>`. `figures(raw)` in `player-search.ts` reads `inversion: isInversion(raw.inversion) ?
  raw.inversion : undefined` (`isInversion = isOneOf(INVERSIONS)` in `read-search.ts`). Each resolver adds
  `inversion: search.inversion ?? null` (`resolveChoice`, `walkChoice`, `chromaticChoice`, `progressionChoice`), and
  each `use-*-player` hook memo dependency list gains `inversion`. `ownChoice` and `WALK`/`CHROMATIC`/`PROGRESSION`
  defaults: `inversion: null`.
- [ ] **Step 6: The field.** `Segmented` gains `disabled?: boolean` (passed to `RadioGroup`, segments
  `data-disabled:opacity-50`). `InversionField` (widgets/player-setup), rendered at the end of `FigureRows`, reads
  `figures` and a new `onFigures` from the Setup context:

```tsx
const NEAREST = 'nearest'
export function InversionField() {
  const { t } = useTranslation(['player', 'music'])
  const { figures, onFigures } = useSetup()
  const free = figures.pattern === 'chart' || playsChord(rightFigureOf(figures))
  return (
    <div className="flex flex-col gap-2">
      <Segmented
        label={t('player:inversion.label')}
        disabled={!free}
        value={figures.inversion ?? NEAREST}
        options={[
          { value: NEAREST, label: t('player:inversion.nearest') },
          ...INVERSIONS.map((inversion) => ({ value: inversion, label: t(`music:inversion.${INVERSION_NAMES[inversion]}`) })),
        ]}
        onChange={(value) => onFigures({ inversion: value === NEAREST ? undefined : value })}
      />
      {free ? null : <p className="text-sm text-muted-foreground">{t('player:inversion.own')}</p>}
    </div>
  )
}
```

(`rightFigureOf` = `figures.rh ? RIGHT_FIGURES[figures.rh].figure : PATTERNS[figures.pattern].pattern.rh`, exported
from `entities/pattern` beside `playsChord`; `INVERSION_NAMES` moves from `InversionChoice` to `shared/ui` export.)
Strings: en `inversion: { label: 'Inversion', nearest: 'Nearest', own: 'This pattern plays its own shapes.' }`; ru
`{ label: 'Обращение', nearest: 'Ближайшее', own: 'Эта фактура играет свои фигуры.' }`.
- [ ] **Step 7: Player test:** `/play/progression?p=ii-V-I&key=C&chordSize=sevenths` → Setup → Inversion → 1st: URL
  has `inversion: 1`, the first chord's right hand starts on F. Checks green.

### Task 4: Walk the keys (spec §5)

**Files:**
- Create: `src/shared/lib/music/key-walk.ts` (+ test), `src/shared/lib/arrangement/chart-in-keys.ts` (+ test),
  `src/pages/player/model/walk-headings.ts` (+ test), `src/widgets/player-setup/ui/KeyWalkField.tsx`
- Modify: music and arrangement `index.ts` (export `transposeChord` from `arrange.ts`), `src/features/practice/
  {progression.ts,progression-choice.ts,arrange-piece.ts,choice.ts}`, `src/app/routes/player-search.ts`
  (`walk` read), `src/pages/player/model/{player-search,progression-search,use-player,use-progression-player}.ts`,
  `src/pages/player/ui/{PieceSetup,ProgressionSetup,PlayerPage,ProgressionPlayerPage}.tsx`, locales `player.ts`
- Test: `key-walk.test.ts`, `chart-in-keys.test.ts`, `ProgressionPlayerPage.test.tsx`, `PlayerPage.test.tsx`

**Interfaces:**
- Produces: `KEY_WALKS`, `type KeyWalk`, `walkKeys(key: Key, walk: KeyWalk): Key[]`; `chartInKeys(chart: Chart, keys:
  readonly Key[]): Chart`; `SetupParams.walk?: KeyWalk`; `PracticeChoice.walk` and `ProgressionChoice.walk: KeyWalk |
  null`.

- [ ] **Step 1: Failing tests.**

```ts
// key-walk.test.ts
const names = (keys: Key[]) => keys.map((key) => noteText(key.tonic) + (key.minor ? 'm' : ''))
it('walks up and down by semitones and whole tones, and round the circle, back home', () => {
  const c = { tonic: note('C'), minor: false }
  expect(names(walkKeys(c, 'semitones-up'))).toEqual(['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B', 'C'])
  expect(names(walkKeys(c, 'tones-down'))).toEqual(['C', 'B♭', 'A♭', 'G♭', 'E', 'D', 'C'])
  expect(names(walkKeys(c, 'fifths'))).toEqual(['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'B', 'E', 'A', 'D', 'G', 'C'])
  expect(names(walkKeys({ tonic: note('A'), minor: true }, 'tones-up')).at(1)).toBe('Bm')
})
```

(Expected spellings follow `tonicSpelling`; adjust the literal list to what `tonicSpelling` returns for G♭/F♯ after
reading it — the rule, not the test, decides.)

```ts
// chart-in-keys.test.ts
it('plays a chart once per key, a section each, written in C', () => {
  const chart = progressionChart(parseNumerals('ii V I') ?? [], C_MAJOR, 'sevenths')
  const walked = chartInKeys(chart, [C_MAJOR, { tonic: note('Db'), minor: false }])
  expect(walked.key).toEqual(C_MAJOR)
  expect(walked.sections).toHaveLength(2)
  expect(walked.sections[1]?.lines.flat().map((bar) => chordSymbol(bar.chords[0]!))).toEqual(['E♭m7', 'A♭7', 'D♭Maj7'])
})
```

- [ ] **Step 2: Kernel.**

```ts
// key-walk.ts
export const KEY_WALKS = ['semitones-up', 'semitones-down', 'tones-up', 'tones-down', 'fifths'] as const
export type KeyWalk = (typeof KEY_WALKS)[number]

/** Each walk's step in semitones and its keys before home: round the circle each key a 5th lower. */
const STEPS: Readonly<Record<KeyWalk, { readonly by: number; readonly keys: number }>> = {
  'semitones-up': { by: 1, keys: 12 },
  'semitones-down': { by: -1, keys: 12 },
  'tones-up': { by: 2, keys: 6 },
  'tones-down': { by: -2, keys: 6 },
  fifths: { by: 5, keys: 12 },
}

/** The keys a walk plays a progression in, from `key` back to it, each tonic spelled by the key's rule. */
export function walkKeys(key: Key, walk: KeyWalk): Key[] {
  const { by, keys } = STEPS[walk]
  const from = pitchClassOf(key.tonic)
  return Array.from({ length: keys + 1 }, (_, i) =>
    i % keys === 0
      ? key
      : { tonic: tonicSpelling(pitchClass(from + by * i), key.minor), minor: key.minor },
  )
}
```

```ts
// chart-in-keys.ts
const C_MAJOR: Key = { tonic: note('C'), minor: false }

/** A chart played once in each key, a section per key, written in C so each chord carries its accidentals. */
export function chartInKeys(chart: Chart, keys: readonly Key[]): Chart {
  const bars = chart.sections.flatMap((section) => section.lines)
  return {
    key: C_MAJOR,
    meter: chart.meter,
    sections: keys.map((key) => ({
      lines: bars.map((line) =>
        line.map((bar) => ({
          ...bar,
          chords: bar.chords.map((chord) => ({
            ...chord,
            ...transposeChord(chord, chart.key.tonic, key.tonic),
          })),
        })),
      ),
    })),
  }
}
```

A piece's sections become one section per key (its verse/chorus headings give way to the keys' names).
- [ ] **Step 3: Choices.** `walk(raw)` read in `player-search.ts` for the piece and progression validators
  (`isOneOf(KEY_WALKS)`). `ProgressionChoice.walk`: `progressionChoice` reads `search.walk ?? null`;
  `arrangeProgression`: `walk ? chartInKeys(chart, walkKeys(choice.key, walk)) : chart`, `tonic` the chart's.
  `PracticeChoice.walk`: `resolveChoice` sets it only for `piece.kind === 'progression'`; `arrangePiece` walks
  `chartOf(piece, size)` from `pieceKey(piece)` with the choice's tonic as home. While walking the fit's `key` is false
  (`walkingFit(fit)`) and `use-player` passes no recording.
- [ ] **Step 4: Headings and title.** `walkHeadings(keys, headings, keyName)`: per key, the first section's heading is
  the key's name, the rest keep theirs; `PlayerPage` passes it while walking. The progression title while walking:
  en `progression.walking: '{{numerals}} from {{key}}, {{walk}}'`, ru `'{{numerals}} от {{key}}, {{walk}}'`.
- [ ] **Step 5: The field.** `KeyWalkField` (a `Dropdown`, label "Through the keys"), in `ProgressionSetup` and in
  `PieceSetup` for a progression. Strings: en `walk: { label: 'Through the keys', one: 'One key', 'semitones-up': 'Up
  by semitones', 'semitones-down': 'Down by semitones', 'tones-up': 'Up by whole tones', 'tones-down': 'Down by whole
  tones', fifths: 'Round the circle of fifths' }`; ru `{ label: 'По тональностям', one: 'Одна тональность',
  'semitones-up': 'Вверх по полутонам', 'semitones-down': 'Вниз по полутонам', 'tones-up': 'Вверх по тонам',
  'tones-down': 'Вниз по тонам', fifths: 'По квинтовому кругу' }`.
- [ ] **Step 6: Player tests:** `/play/progression?p=ii-V-I&chordSize=sevenths&walk=semitones-up` → 39 bars, bar 4 is
  `E♭m7`; `/play/twofive?walk=tones-down` → bar 4 is `Cm7`. Checks green.

### Task 5: Remembered views (spec §6)

**Files:**
- Create: `src/entities/views/{index.ts,model/store.ts,model/store.test.ts,model/selectors.ts}`,
  `src/features/remember-view/{index.ts,remember-view.ts,remember-view.test.ts}`, `src/app/routes/remember.ts`
  (+ test), `docs/adr/0022-a-screen-opened-plainly-comes-back-as-it-was-left.md`
- Modify: `src/app/router.tsx` (root with context, routes, subscribe), `src/app/routes/{read-search,learn-search,
  tools-search,player-search}.ts`, `src/main.tsx`, `src/app/testing/render-app.tsx`, `src/app/router.test.tsx`
- Test: `src/app/remembered-views.test.tsx` (whole app)

**Interfaces:**
- Produces: `createViewsStore(saving?): ViewsStore`, `type RememberedView = Readonly<Record<string, string | number
  | boolean>>`, `selectView(state, path): RememberedView | undefined`; `rememberView(store, path, view)`;
  `viewToOpen(url, remembered, kept): Raw`; `routeSearch(validate, defaults, remember?: { kept: readonly (keyof S &
  string)[] })`.

- [ ] **Step 1: Store tests then store.**

```ts
// store.ts
export const VIEWS_STORAGE_KEY = 'pt-views'
export const VIEWS_VERSION = 1
/** The most screens remembered: the ones used last. */
export const MOST_VIEWS = 200
export type ViewParam = string | number | boolean
export type RememberedView = Readonly<Record<string, ViewParam>>
export interface ViewsState {
  readonly views: Readonly<Record<string, RememberedView>>
}
export type ViewsStore = StoreApi<ViewsState>

export const createViewsStore = (saving: SavingOptions = {}): ViewsStore =>
  createSavedStore({ key: VIEWS_STORAGE_KEY, version: VIEWS_VERSION, initial: { views: {} }, read: sanitize }, saving)

const isParam = (value: unknown): value is ViewParam =>
  typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))

/** Stored JSON is untrusted: a path keeps its params that are text, numbers or switches; the last 200 paths stand. */
function sanitize(persisted: unknown): ViewsState {
  const saved = savedObject<ViewsState>(persisted)
  const views = Object.entries(savedObject<Record<string, unknown>>(saved.views))
    .filter(([path]) => path.startsWith('/'))
    .map(([path, view]) => [path, Object.fromEntries(Object.entries(savedObject<Record<string, unknown>>(view)).filter(([, value]) => isParam(value)))] as const)
    .slice(-MOST_VIEWS)
  return { views: Object.fromEntries(views) }
}
```

Tests: a non-object, a non-`/` path, an object value and `NaN` are dropped; 201 paths keep the last 200; a second
store on the same storage follows the first's save (`otherTabs`).
- [ ] **Step 2: The command.** `rememberView(store, path, view)`: drops `loop` and `step`, writes the path last
  (delete, then add), trims to `MOST_VIEWS`; a view equal to the remembered one writes nothing. Test each.
- [ ] **Step 3: The rules** (`src/app/routes/remember.ts`):

```ts
export type Raw = Readonly<Record<string, unknown>>

/** Opened plainly, the remembered view; opened by a link, the link's params and the kept ones it leaves out. */
export function viewToOpen(url: Raw, remembered: RememberedView | undefined, kept: readonly string[]): Raw {
  if (!remembered) return url
  if (Object.keys(url).length === 0) return remembered
  const filled = kept.flatMap((param) =>
    url[param] === undefined && remembered[param] !== undefined ? [[param, remembered[param]] as const] : [],
  )
  return filled.length === 0 ? url : { ...Object.fromEntries(filled), ...url }
}

/** A remembered route's `beforeLoad`: on entering, opens the view by the two rules, once. */
export function restoreView<S extends object>(validate: (input: Raw) => S, kept: readonly string[]) {
  return ({ cause, location, context, search }: {
    cause: 'preload' | 'enter' | 'stay'
    location: { pathname: string; search: Raw }
    context: { views: ViewsStore }
    search: object
  }) => {
    if (cause !== 'enter') return
    const opened = viewToOpen(location.search, selectView(context.views.getState(), location.pathname), kept)
    if (opened === location.search || sameView(validate(opened), search)) return
    throw redirect({ href: `${location.pathname}${defaultStringifySearch(opened)}`, replace: true })
  }
}
```

`sameView` compares the two objects' defined entries. `routeSearch(validate, defaults, remember?)` adds `staticData:
{ remembered: true }` and `beforeLoad: restoreView(validate, remember.kept)` when given. Unit tests for `viewToOpen`
(plain, named, kept filled, nothing to fill returns the same object).
- [ ] **Step 4: Router.** `createRootRouteWithContext<{ views: ViewsStore }>()`; `createAppRouter({ history, views })`
  passes `context: { views }` and subscribes:

```ts
router.subscribe('onResolved', ({ toLocation }) => {
  if (router.state.matches.at(-1)?.staticData.remembered) rememberView(views, toLocation.pathname, toLocation.search)
})
```

`StaticDataRouteOption` gains `remembered?: true`. Kept lists (typed against each search): pieces `key pattern rh lh
chordSize inversion walk tempo hands mode swing speedTraining`; progression `pattern rh lh inversion walk tempo hands
mode swing speedTraining`; walk `pattern rh lh inversion tempo hands mode swing speedTraining`; chromatic `direction
pattern rh lh inversion tempo hands mode swing speedTraining`; scales `fingers rhythm tempo hands`; chords `hands`;
keys, intervals, tensions, chord finder, reharmonise, passing chords, progressions `[]`. Routes with a `beforeLoad` of
their own (piece, walk) run it first, then the restore. `main.tsx` and `renderApp` create `createViewsStore({ storage
})`; `renderApp` returns `viewsStore`.
- [ ] **Step 5: Whole-app tests** (`remembered-views.test.tsx`, one `storage` shared by two `renderApp`s):
  - a piece's key, pattern, inversion and tempo come back when it is opened plainly again; its loop does not;
  - the progression Player opened from the tool keeps the tool's numerals, key and triads, and the remembered pattern
    and walk;
  - a lesson's link to Chords names G minor: G minor shows (no remembered root or quality);
  - Learn → Chords (plain) returns to the remembered chord, and Back from it lands on Learn (the redirect replaced);
  - an unreadable remembered value (`tempo: 'fast'`) opens once with the default, no second redirect.
- [ ] **Step 6:** ADR 0022 (context, decision = §6's two rules and the table, consequences: links stay exact, a
  remembered value is validated like a URL's, amends ADR 0003). Checks + `npm run build` green; Chrome: a piece's G
  major and 1st inversion survive closing and reopening.

### Task 6: Lessons (spec §7)

**Files:**
- Create: `src/entities/lesson/content/{chord-functions,thinking-in-degrees,two-five-one}.ts`
- Modify: `src/entities/lesson/model/types.ts` (`player` link), `src/entities/lesson/content/index.ts` (order),
  `src/entities/lesson/content/catalog.test.ts` (reads the new link), `src/widgets/lesson-view/ui/LessonLinkRow.tsx`
- Test: `catalog.test.ts`, `src/pages/lesson/ui/LessonPage.test.tsx`

**Interfaces:**
- Consumes: `KeyWalk`, `Inversion`; the `/play/progression` search (`p`, `key`, `chordSize`, `walk`, `inversion`).
- Produces: `LessonLink` variant `({ place: 'player' } & LessonProgression & { walk?: KeyWalk; inversion?: Inversion })`.

- [ ] **Step 1: Failing catalog case:** `problemsOf({ kind: 'link', title, target: { place: 'player', numerals: 'ii
  Q', key: C_MAJOR } })` reports the numerals. Add the `'player'` case to `problemsOf` (reads numerals like
  `'progressions'`). Run → FAIL until the type and case exist.
- [ ] **Step 2: The link row.**

```tsx
case 'player': {
  const { numerals, key, size } = readProgression(target)
  return (
    <RowLink
      title={title}
      icon={CirclePlay}
      paint={STEP_PAINT.progression}
      render={
        <Link
          to="/play/progression"
          search={{
            p: numeralsParam(numerals),
            key: keyParam(key),
            ...(size === 'triads' ? {} : { chordSize: size }),
            ...(target.walk ? { walk: target.walk } : {}),
            ...(target.inversion === undefined ? {} : { inversion: target.inversion }),
          }}
        />
      }
    />
  )
}
```

- [ ] **Step 3: Content.** Three lessons as the spec §7 lists, in the house worksheet style (see
  `chord-family.ts`): every text `{ en, ru }`; examples as `chords`/`progression` blocks; quizzes `{ chord }`
  answers; links (`keys`, `piece`, `player`). `two-five-one`'s exercise links: `{ place: 'player', numerals: 'ii V
  I', key: C_MAJOR, size: 'sevenths', walk: 'semitones-up' }`, the same with `walk: 'tones-down'`, and `size:
  'ninths', inversion: 1` then `inversion: 3`. Order in `LESSONS`: `chordFunctions` after `chordFamily`;
  `thinkingInDegrees`, `twoFiveOne` after `commonProgressions`. Levels 2, 2, 3; categories `theory`, `accompaniment`,
  `jazz`; modules `fundamentals`, `accompaniment`, `accompaniment`.
- [ ] **Step 4:** a LessonPage test opens `two-five-one` and finds the walk link's href with `walk=semitones-up`.
  Checks green.

### Task 7: Docs

- [ ] CLAUDE.md: `entities/views` (`pt-views`), `features/remember-view`, `IN_PLACE`, `useShownOnScrollUp`, the
  screen bar (`ScreenBarProvider`), `walkKeys`, `chartInKeys`, `inversionPitchClasses`/`voiceInversion`, the
  `player` lesson link; the State line ("what must be remembered → a persisted entity store; a screen's last view →
  `pt-views`").
- [ ] UBIQUITOUS_LANGUAGE: Inversion (Setup): Nearest · Root · 1st · 2nd · 3rd; **Walk the keys**; **Remembered
  view**; **Screen bar**.
- [ ] CONTENT.md: the `player` link target.
- [ ] ADR 0023 "An inversion and a walk of keys are ways to play any chart" (spec §4–5).
- [ ] `npx prettier --write` the touched files; final `npm run typecheck && npm run lint && npm run test && npm run
  build`.
