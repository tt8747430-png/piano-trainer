# The playable keyboard: plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (the owner's standing choice: inline, on
> `main`). Steps use checkboxes.

**Goal:** every keyboard plays the instant it is touched, scrolls or plays a glissando by the learner's choice, looks
and is proportioned like a piano, shows fingers under the keys, a scale's notes on whole keys and the key struck last
on its own, plays from the computer keyboard, and every button that plays can stop what it plays.

**Architecture:** pure logic first (`shared/lib`: `octaveOf`, `keyAt`, the view's math, the typing keys, the struck
keys, placed chord sounds), then the audio port's play handles and struck keys with the hooks over them
(`usePlayback`, local to each component: the port is the one source), then how a key looks, then `PianoKeyboard`
(presentational: sizes, the rail, pointers, the map, the finger row), then `LiveKeyboard` (the saved settings,
spotlight, typing, the settings popover), then the screens.

**Tech stack:** React 19, TypeScript 6, Tailwind v4 tokens, zustand persist, Vitest 4 + Testing Library + jsdom 29,
Base UI popover and switch (the kit's primitives).

**Spec:** [`2026-09-25-playable-keyboard-design.md`](../specs/2026-09-25-playable-keyboard-design.md) (revised after
this plan's first review); decisions in the roadmap's §3.1.

## Global constraints

- Test first (`tdd`): each step's tests fail before its code exists. Each task ends green on
  `npm run typecheck && npm run lint && npm run test`; tasks 5–8 also `npm run build`. One commit per task on `main`;
  `npx prettier --write` on the files touched, never the whole repo.
- Each task leaves the tree compiling: a string a task renders is added to `en` and `ru` in that task; a prop or type
  a task removes has no user left after it.
- Strict TS, no `any`, no casts, no non-null assertions, no `eslint-disable`, no arbitrary Tailwind values: a value
  without a token becomes a token in `tokens.css` (both themes) and an `@theme inline` colour in `theme.css`; a fixed
  number in code is a named constant. Values worked out at runtime (a key's place, the keys' width and length) go in
  `style`, as `Key.tsx` already places keys (Task 9 writes this into CODE_STYLE §5).
- No custom shadow, radius or text-size names: `cn()` would drop them (CODE_STYLE §5). The rail's shade is a colour
  gradient (`from-key-shade`), not a shadow.
- Every string in `en` and `ru`; note names stay international (C, F♯).
- Saved data keeps working: `pt-settings` version 3, `migrate` and `merge` through one sanitiser.
- 44px targets (keys excepted); motion is `transform` and `opacity` only; `prefers-reduced-motion` is honoured by
  `theme.css` already.
- No leftovers: the band's tokens (`--key-mark*`), `--key-white-edge`, `usePlayChord`, the Scales `view` param and
  its strings, and every fixed keyboard height go in the task that replaces them.
- The words are the glossary's: **Scroll** and **Glissando** (never "glide" or "slide"), **Keyboard settings**,
  **Spotlight**, **Struck**, **Rail**, **Finger row**.

## Review focus

The inputs most likely to bite a learner that no happy-path test meets. Each has its test in the task named.

1. **A swipe in Scroll** starts on a key: that key sounds, moving plays nothing more, and the browser's
   `pointercancel` lifts it. Task 5.
2. **A pointer tap is one sound**, its own `click` ignored, in both swipes; Enter, Space and a click no pointer made (a
   screen reader) still play once. Task 5.
3. **A Stop that never turns back:** Stop pressed before the first note sounds, a browser without Web Audio, a play
   cut off by another button's. Tasks 3 and 7.
4. **Typing where it must not play:** in the Songs search field, with Cmd held, on auto-repeat; and a key that plays
   is not also the browser's (Firefox's `'` Quick Find). Task 6.
5. **A version-2 save** loads with the keyboard's defaults, theme and language kept; an unknown saved value falls
   back alone. Task 1.

## Files

| File                                                                     | Responsibility                                                          | Task |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ---- |
| `src/shared/lib/keyboard-choices.ts`                                     | The keyboard settings' option lists and types                           | 1    |
| `src/entities/settings/model/{types,store,selectors}.ts`                 | `KeyboardSettings`, version 3, the sanitiser, `selectKeyboard`          | 1    |
| `src/features/set-preference/set-keyboard.ts`                            | `setKeyboard(store, change)`                                            | 1    |
| `src/shared/lib/music/keyboard.ts`                                       | `octaveOf`, `printedKeyName`                                            | 2    |
| `src/shared/lib/keyboard-layout.ts`                                      | `PIANO_LAYOUT`, `keyAt`                                                 | 2    |
| `src/shared/lib/keyboard-view.ts`                                        | The view's frame, a point's scroll, an octave's scroll, the edge keys   | 2    |
| `src/shared/lib/typing-keys.ts`                                          | The computer keyboard as a piano                                        | 2    |
| `src/shared/lib/schedule/{sounding,sounds}.ts`                           | `keysStruckAt`; `placedChordSounds`                                     | 2    |
| `src/shared/api/audio/{types,sounding,fake-audio,web-audio}.ts`          | Play handles, `isPlaying`, `struck()`                                   | 3    |
| `src/shared/lib/services/{use-play,use-playback,use-sounding-keys}.ts`   | `usePlay` returns the handle; taps at now; `usePlayback`; struck keys   | 3    |
| `src/shared/ui/piano-keyboard/{key-look.ts,Key.tsx}`                     | A key's face: fills, names, letters, quiet, lip, drop                   | 4    |
| `src/styles/{tokens,theme}.css`                                          | The key tokens                                                          | 4, 5 |
| `src/shared/ui/piano-keyboard/PianoKeyboard.tsx`                         | Sizes, height, the rail, the keys, the finger row                       | 4, 5 |
| `src/shared/ui/piano-keyboard/{RailButton,KeyboardMap,FingerRow}.tsx`    | The rail's buttons, the map, the fingers                                | 5    |
| `src/shared/ui/piano-keyboard/{use-key-pointers,use-scroll-view}.ts`     | Both swipes' pointers; the scroller's view                              | 5    |
| `src/shared/test/layout.ts`                                              | jsdom boxes and scrolling for tests                                     | 5    |
| The screens' keyboards                                                   | No fixed height; the Player's fills its layout                          | 5    |
| `src/features/live-keyboard/ui/{LiveKeyboard,KeyboardSettingsButton,KeyboardSettingsFields}.tsx` | Settings, spotlight, typing, the popover | 6 |
| `src/features/live-keyboard/model/use-typing.ts`                         | The typing keys' listener, octave, letters, view                        | 6    |
| Chords, Scales, Symbols (and `ExplorerKeyboard`)                         | Stop buttons, spotlight, whole-key scales, the finger row, `fingers`    | 7    |
| Piece, quiz, Player, Settings                                            | Bar toggles and spotlight, Play again, Hear these notes, the Player's fingers, the Keyboard group | 8 |

---

### Task 1: The keyboard settings, saved

**Files:**

- Create: `src/shared/lib/keyboard-choices.ts`, `src/features/set-preference/set-keyboard.ts`
- Modify: `src/shared/lib/index.ts`, `src/entities/settings/model/{types.ts,store.ts,selectors.ts}`,
  `src/entities/settings/index.ts`, `src/features/set-preference/index.ts`,
  `src/app/testing/{render-app.tsx,render-with-settings.tsx}`
- Test: `src/entities/settings/model/{store.test.ts,selectors.test.ts}`,
  `src/features/set-preference/set-preference.test.ts`

**Produces:** `KEY_SIZES`, `KeySize`, `SWIPES`, `Swipe`, `NAMED_KEYS`, `NamedKeys` (`@/shared/lib`);
`KeyboardSettings`, `defaultKeyboard(finePointer)`, `selectKeyboard`, `SettingsState.keyboard`
(`@/entities/settings`); `setKeyboard(store, change)` (`@/features/set-preference`); `createSettingsStore({ …,
finePointer })`.

The option lists live in `shared/lib`: the presentational keyboard (Task 5) takes them as props and the entity saves
them, and shared may not import an entity. The guards stay in the entity, beside `isTheme`.

- [ ] **Step 1: Write the failing tests.** In `store.test.ts`, the defaults gain the keyboard, the version is 3, and
      three tests join:

```ts
import { createSettingsStore, SETTINGS_STORAGE_KEY } from './store'
import { DEFAULT_PRACTICE, DEFAULT_QUIZ_CHOICE, defaultKeyboard } from './types'

// The test setup's matchMedia answers false: no fine pointer, so no typing by default.
const DEFAULTS = {
  practice: DEFAULT_PRACTICE,
  quiz: DEFAULT_QUIZ_CHOICE,
  keyboard: defaultKeyboard(false),
}

// in 'saves under pt-settings with its version': `version: 3`

it('plays from the computer keyboard by default only where the pointer is fine', () => {
  const keyboard = (finePointer: boolean) =>
    createSettingsStore({ storage: createMemoryStorage(), languages: ['en'], finePointer }).getState()
      .keyboard
  expect(keyboard(true)).toEqual({
    keySize: 'fit',
    swipe: 'scroll',
    namedKeys: 'c',
    map: false,
    typing: true,
  })
  expect(keyboard(false).typing).toBe(false)
})

it('gives a version-2 save the keyboard’s defaults and keeps the rest', () => {
  const saved = { theme: 'dark', locale: 'ru', practice: DEFAULT_PRACTICE, quiz: DEFAULT_QUIZ_CHOICE }
  expect(restored(saved)).toEqual({ theme: 'dark', locale: 'ru', ...DEFAULTS })
})

it('restores the keyboard settings, an unknown value taking its default alone', () => {
  const keyboard = { keySize: 'huge', swipe: 'glissando', namedKeys: 'all', map: 'yes', typing: true }
  expect(restored({ theme: 'light', locale: 'en', keyboard }, 3).keyboard).toEqual({
    keySize: 'fit',
    swipe: 'glissando',
    namedKeys: 'all',
    map: false,
    typing: true,
  })
})
```

`selectors.test.ts`: the state gains `keyboard: defaultKeyboard(false)` and
`expect(selectKeyboard(state)).toBe(state.keyboard)`. `set-preference.test.ts`:

```ts
it('setKeyboard changes the keyboard settings it is given and saves them, the others kept', () => {
  const { storage, store } = setUp()
  setKeyboard(store, { swipe: 'glissando', map: true })
  expect(store.getState().keyboard).toEqual({ ...defaultKeyboard(false), swipe: 'glissando', map: true })
  expect(saved(storage).keyboard).toEqual(store.getState().keyboard)
})
```

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/entities/settings src/features/set-preference`
      (`defaultKeyboard` and `setKeyboard` do not exist).
- [ ] **Step 3: Write the code.** `src/shared/lib/keyboard-choices.ts`, exported from `src/shared/lib/index.ts`:

```ts
/** The keyboard settings' choices, as the presentational keyboard takes them; the settings entity saves them. */
export const KEY_SIZES = ['fit', 'large', 'piano'] as const
/** How wide the white keys are: the range fills the width, large keys, or the whole piano fills it. */
export type KeySize = (typeof KEY_SIZES)[number]

export const SWIPES = ['scroll', 'glissando'] as const
/** What a finger sliding over the keys does: scroll the keyboard, or play each key it crosses. */
export type Swipe = (typeof SWIPES)[number]

export const NAMED_KEYS = ['c', 'all', 'none'] as const
/** Which keys carry their note's name: every C, every key, or none. */
export type NamedKeys = (typeof NAMED_KEYS)[number]
```

`entities/settings/model/types.ts`:

```ts
import { isOneOf, KEY_SIZES, NAMED_KEYS, SWIPES, type KeySize, type NamedKeys, type Swipe } from '@/shared/lib'

/** The keyboard settings: the same on every screen, set in Settings or from the keys' rail. */
export interface KeyboardSettings {
  readonly keySize: KeySize
  readonly swipe: Swipe
  readonly namedKeys: NamedKeys
  /** The strip of all 88 keys in the rail. */
  readonly map: boolean
  /** The computer keyboard plays the keys. */
  readonly typing: boolean
}

export interface SettingsState {
  theme: Theme
  locale: Locale
  practice: PracticeToggles
  quiz: QuizChoice
  keyboard: KeyboardSettings
}

/** A new keyboard's settings: the computer keyboard plays where the pointer is fine (a mouse, a trackpad). */
export const defaultKeyboard = (finePointer: boolean): KeyboardSettings => ({
  keySize: 'fit',
  swipe: 'scroll',
  namedKeys: 'c',
  map: false,
  typing: finePointer,
})

export const isKeySize = isOneOf(KEY_SIZES)
export const isSwipe = isOneOf(SWIPES)
export const isNamedKeys = isOneOf(NAMED_KEYS)
```

`store.ts`: `SETTINGS_VERSION = 3`; `createSettingsStore` takes `finePointer = matchMedia('(pointer:
fine)').matches` and sets `keyboard: defaultKeyboard(finePointer)` in `initial`; `migrate` becomes
`(persisted) => sanitize(persisted, initial)` (no cast: the sanitiser turns any earlier shape into this one, and
`merge` then keeps the current fields); `sanitize` gains `keyboard: keyboardSettings(saved.keyboard,
current.keyboard)`, its comment "A version-1 save has no practice or quiz fields, a version-2 save no keyboard: each
gains its defaults here.", and:

```ts
/** Each saved choice that is still one of its values stands; anything else takes the current one. */
function keyboardSettings(value: unknown, current: KeyboardSettings): KeyboardSettings {
  const saved = savedObject<KeyboardSettings>(value)
  return {
    keySize: isKeySize(saved.keySize) ? saved.keySize : current.keySize,
    swipe: isSwipe(saved.swipe) ? saved.swipe : current.swipe,
    namedKeys: isNamedKeys(saved.namedKeys) ? saved.namedKeys : current.namedKeys,
    map: typeof saved.map === 'boolean' ? saved.map : current.map,
    typing: typeof saved.typing === 'boolean' ? saved.typing : current.typing,
  }
}
```

`selectors.ts`: `export const selectKeyboard = (state: SettingsState): KeyboardSettings => state.keyboard`. The
entity's `index.ts` exports `defaultKeyboard`, `selectKeyboard` and `type KeyboardSettings`.
`features/set-preference/set-keyboard.ts`, exported from its `index.ts`:

```ts
import type { KeyboardSettings, SettingsStore } from '@/entities/settings'

/** Changes the keyboard settings it is given and keeps the rest: the rail's popover and Settings write here. */
export function setKeyboard(store: SettingsStore, change: Partial<KeyboardSettings>): void {
  store.setState((state) => ({ keyboard: { ...state.keyboard, ...change } }))
}
```

`renderWithSettings` and `renderApp` pass `finePointer: false` to `createSettingsStore`, so no test depends on what
the matchMedia stub answers.

- [ ] **Step 4: Run them and see them pass**, then the whole check: `npm run typecheck && npm run lint && npm run test`.
- [ ] **Step 5: Commit:** "Save the keyboard settings: key size, swipe, note names, map and typing".

### Task 2: Pure keyboard logic

**Files:**

- Create: `src/shared/lib/keyboard-view.ts`, `src/shared/lib/typing-keys.ts` (+ tests)
- Modify: `src/shared/lib/music/{keyboard.ts,index.ts}`, `src/shared/lib/keyboard-layout.ts`,
  `src/shared/lib/index.ts`, `src/shared/lib/schedule/{sounding.ts,sounds.ts,index.ts}`,
  `src/shared/lib/services/{use-play.ts,index.ts}`, `src/shared/ui/piano-keyboard/PianoKeyboard.tsx`
- Test: `src/shared/lib/music/keyboard.test.ts`, `src/shared/lib/keyboard-layout.test.ts`,
  `src/shared/lib/schedule/{sounding.test.ts,sounds.test.ts}`

**Produces:** `octaveOf(key): number`, `printedKeyName(key): string` (`@/shared/lib/music`); `PIANO_LAYOUT`,
`keyAt(keys, x, y): Midi | null`, `ScrollMetrics`, `ViewFrame`, `viewFrame(metrics)`, `scrollToCentre(metrics,
point)`, `scrollByOctave(metrics, whites, by)`, `keysInView(keys, frame): KeyRange | null`, `TYPING_KEYS`,
`OCTAVE_DOWN`, `OCTAVE_UP`, `TYPING_START`, `typedKey(code, typingC)`, `moveTypingOctave(typingC, by)`,
`typingLetters(typingC)` (`@/shared/lib`); `keysStruckAt(windows, time)`, `ChordPlaying`,
`placedChordSounds(chord, options)` (`@/shared/lib/schedule`).

- [ ] **Step 1: Write the failing tests.**

```ts
// music/keyboard.test.ts
it('names a key’s octave and prints its name, sharp on a black key', () => {
  expect([midi(21), midi(59), midi(60), midi(108)].map(octaveOf)).toEqual([0, 3, 4, 8])
  expect(printedKeyName(midi(61))).toBe('C♯4')
  expect(printedKeyName(midi(48))).toBe('C3')
})

// keyboard-layout.test.ts: the whole piano's 52 white keys, 10% of the width each ×100/52
const whiteMiddle = (index: number) => (index + 0.5) / 52 // C4 is white key 23
it('lays the whole piano out once', () => {
  expect(PIANO_LAYOUT.keys).toHaveLength(88)
  expect(PIANO_LAYOUT.whites).toBe(52)
})
it('finds the key under a point: a black key over a white one, a white key below it, nothing outside', () => {
  expect(keyAt(PIANO_LAYOUT.keys, whiteMiddle(23), 0.9)).toBe(60)
  expect(keyAt(PIANO_LAYOUT.keys, 24 / 52, 0.3)).toBe(61)
  expect(keyAt(PIANO_LAYOUT.keys, 24.1 / 52, 0.9)).toBe(62)
  for (const [x, y] of [[-0.01, 0.5], [1, 0.5], [0.5, 1], [Number.NaN, 0.5]])
    expect(keyAt(PIANO_LAYOUT.keys, x, y)).toBeNull()
})

// keyboard-view.test.ts: 52 white keys 100px wide, 1300px in view
const at = (scrollLeft: number) => ({ scrollLeft, clientWidth: 1300, scrollWidth: 5200 })
it('frames the stretch in view, or all of it where nothing scrolls', () => {
  expect(viewFrame(at(520))).toEqual({ left: 0.1, width: 0.25 })
  expect(viewFrame({ scrollLeft: 0, clientWidth: 400, scrollWidth: 400 })).toEqual({ left: 0, width: 1 })
})
it('centres the view on a point, within the keyboard', () => {
  expect(scrollToCentre(at(0), 0.5)).toBe(1950)
  expect(scrollToCentre(at(0), 0.01)).toBe(0)
  expect(scrollToCentre(at(0), 0.99)).toBe(3900)
})
it('moves the view an octave, within the keyboard', () => {
  expect(scrollByOctave(at(1000), 52, 1)).toBe(1700)
  expect(scrollByOctave(at(300), 52, -1)).toBe(0)
  expect(scrollByOctave(at(3500), 52, 1)).toBe(3900)
})
it('names the white keys wholly in view', () => {
  expect(keysInView(PIANO_LAYOUT.keys, { left: 23 / 52, width: 14 / 52 })).toEqual({ from: 60, to: 83 })
  expect(keysInView(PIANO_LAYOUT.keys, { left: 23.2 / 52, width: 0.5 / 52 })).toBeNull()
})

// typing-keys.test.ts
it('plays the keys A to ’ from the typing C, black keys on the row above', () => {
  const c4 = midi(60)
  expect(['KeyA', 'KeyW', 'KeyJ', 'KeyK', 'Quote'].map((code) => typedKey(code, c4))).toEqual([60, 61, 71, 72, 77])
  expect(typedKey('KeyQ', c4)).toBeNull()
})
it('plays nothing past the piano’s top', () => {
  expect(typedKey('KeyA', midi(108))).toBe(108)
  expect(typedKey('KeyW', midi(108))).toBeNull()
})
it('moves the typing octave between C1 and C8', () => {
  expect(moveTypingOctave(midi(60), 1)).toBe(72)
  expect(moveTypingOctave(midi(24), -1)).toBe(24)
  expect(moveTypingOctave(midi(108), 1)).toBe(108)
})
it('letters each key it plays', () => {
  const letters = typingLetters(TYPING_START)
  expect(letters.size).toBe(18)
  expect([letters.get(midi(60)), letters.get(midi(61)), letters.get(midi(77))]).toEqual(['A', 'W', "'"])
})

// schedule/sounding.test.ts
it('finds the keys struck last: a chord’s together, an arpeggio’s one by one', () => {
  const block = keyWindows(chordSounds(C_MAJOR, { arpeggio: false }), 0)
  expect([...keysStruckAt(block, 0.5)]).toEqual([60, 64, 67])
  const rolled = keyWindows(chordSounds(C_MAJOR, { arpeggio: true }), 0)
  expect([...keysStruckAt(rolled, -0.1)]).toEqual([])
  expect([...keysStruckAt(rolled, 0.3)]).toEqual([64])
  expect([...keysStruckAt(rolled, 0.5)]).toEqual([67])
  // C has ended, E and G ring: G was struck last.
  expect([...keysStruckAt(rolled, 1.5)]).toEqual([67])
  expect([...keysStruckAt(rolled, 3)]).toEqual([])
})

// schedule/sounds.test.ts
it('sounds a chord as the explorers place it, struck or rolled', () => {
  const c = { root: note('C'), quality: 'maj' } as const
  expect(placedChordSounds(c).map((s) => [s.midi, s.at])).toEqual([[60, 0], [64, 0], [67, 0]])
  expect(placedChordSounds(c, { arpeggio: true }).map((s) => s.at)).toEqual([0, 0.22, 0.44])
  expect(placedChordSounds(c, { bothHands: true }).some((s) => s.midi < 60)).toBe(true)
})
```

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/shared/lib`.
- [ ] **Step 3: Write the code.**

```ts
// music/keyboard.ts (exported from music/index.ts)
/** A key's octave in scientific pitch: C4 is middle C, B3 the key below it. */
export const octaveOf = (key: Midi): number => Math.floor(key / 12) - 1

/** A key's name as printed: its note, sharp on a black key, and its octave ("C♯4"). */
export const printedKeyName = (key: Midi): string =>
  `${noteName(plainSpelling(pitchClass(key), true))}${octaveOf(key)}`

// keyboard-layout.ts
/** The whole piano laid out once: every keyboard holds all of it and scrolls. */
export const PIANO_LAYOUT = keyboardLayout(PIANO)

/**
 * The key under a point given in fractions (0–1) of the keyboard's width and height: a black key
 * where it covers a white one; nothing outside the keyboard.
 */
export function keyAt(keys: readonly KeyGeometry[], x: number, y: number): Midi | null {
  if (!(x >= 0 && x < 1 && y >= 0 && y < 1)) return null
  const left = x * 100
  const top = y * 100
  const under = (key: KeyGeometry) => left >= key.left && left < key.left + key.width
  const black = keys.find((key) => key.black && top < key.height && under(key))
  return (black ?? keys.find((key) => !key.black && under(key)))?.midi ?? null
}
```

```ts
// keyboard-view.ts
import type { KeyRange } from '@/shared/lib/music'
import type { KeyGeometry } from './keyboard-layout'

/** What a scroller shows: where it is scrolled to, the width it shows, and the width of all it holds. */
export interface ScrollMetrics {
  readonly scrollLeft: number
  readonly clientWidth: number
  readonly scrollWidth: number
}

/** The stretch in view, in fractions (0–1) of the whole keyboard. */
export interface ViewFrame {
  readonly left: number
  readonly width: number
}

/** A key's edge a hair outside the view still counts as in it: percentages do not add up exactly. */
const EDGE = 1e-6

/** The stretch in view; all of the keyboard where nothing scrolls. */
export function viewFrame({ scrollLeft, clientWidth, scrollWidth }: ScrollMetrics): ViewFrame {
  if (scrollWidth <= clientWidth) return { left: 0, width: 1 }
  return { left: scrollLeft / scrollWidth, width: clientWidth / scrollWidth }
}

const within = ({ clientWidth, scrollWidth }: ScrollMetrics, left: number) =>
  Math.min(Math.max(0, scrollWidth - clientWidth), Math.max(0, left))

/** The scroll position that centres the view on a point of the keyboard (a fraction of its width). */
export const scrollToCentre = (metrics: ScrollMetrics, point: number): number =>
  within(metrics, point * metrics.scrollWidth - metrics.clientWidth / 2)

/** The scroll position an octave (seven of the keyboard's `whites` white keys) down or up. */
export const scrollByOctave = (metrics: ScrollMetrics, whites: number, by: -1 | 1): number =>
  within(metrics, metrics.scrollLeft + (by * 7 * metrics.scrollWidth) / whites)

/** The first and last white keys wholly in view; none where the view is narrower than a key. */
export function keysInView(keys: readonly KeyGeometry[], frame: ViewFrame): KeyRange | null {
  const from = frame.left * 100 - EDGE
  const to = (frame.left + frame.width) * 100 + EDGE
  const whites = keys.filter((key) => !key.black && key.left >= from && key.left + key.width <= to)
  const first = whites[0]
  const last = whites.at(-1)
  return first && last ? { from: first.midi, to: last.midi } : null
}
```

```ts
// typing-keys.ts
import { MIDDLE_C, midi, PIANO, type Midi } from '@/shared/lib/music'

/** A key of the computer keyboard as a piano key: semitones above the typing C, and its printed letter. */
export interface TypingKey {
  readonly semitones: number
  readonly letter: string
}

/** GarageBand's Musical Typing by physical key (`KeyboardEvent.code`), so every layout plays the same notes. */
export const TYPING_KEYS: ReadonlyMap<string, TypingKey> = new Map([
  ['KeyA', { semitones: 0, letter: 'A' }],
  ['KeyW', { semitones: 1, letter: 'W' }],
  ['KeyS', { semitones: 2, letter: 'S' }],
  ['KeyE', { semitones: 3, letter: 'E' }],
  ['KeyD', { semitones: 4, letter: 'D' }],
  ['KeyF', { semitones: 5, letter: 'F' }],
  ['KeyT', { semitones: 6, letter: 'T' }],
  ['KeyG', { semitones: 7, letter: 'G' }],
  ['KeyY', { semitones: 8, letter: 'Y' }],
  ['KeyH', { semitones: 9, letter: 'H' }],
  ['KeyU', { semitones: 10, letter: 'U' }],
  ['KeyJ', { semitones: 11, letter: 'J' }],
  ['KeyK', { semitones: 12, letter: 'K' }],
  ['KeyO', { semitones: 13, letter: 'O' }],
  ['KeyL', { semitones: 14, letter: 'L' }],
  ['KeyP', { semitones: 15, letter: 'P' }],
  ['Semicolon', { semitones: 16, letter: ';' }],
  ['Quote', { semitones: 17, letter: "'" }],
])
export const OCTAVE_DOWN = 'KeyZ'
export const OCTAVE_UP = 'KeyX'
/** Typing starts on middle C's octave… */
export const TYPING_START = MIDDLE_C
/** …and moves between C1 and C8. */
const LOWEST_C = midi(24)
const HIGHEST_C = midi(108)

/** The typing C an octave further, or the same one at C1 or C8. */
export function moveTypingOctave(typingC: Midi, by: -1 | 1): Midi {
  const next = typingC + 12 * by
  return next < LOWEST_C || next > HIGHEST_C ? typingC : midi(next)
}

/** The piano key a physical key plays from the typing C, if it plays one. */
export function typedKey(code: string, typingC: Midi): Midi | null {
  const typing = TYPING_KEYS.get(code)
  if (!typing) return null
  const key = typingC + typing.semitones
  return key <= PIANO.to ? midi(key) : null
}

/** Each piano key the typing keys play, with its letter. */
export function typingLetters(typingC: Midi): Map<Midi, string> {
  const letters = new Map<Midi, string>()
  for (const [code, { letter }] of TYPING_KEYS) {
    const key = typedKey(code, typingC)
    if (key !== null) letters.set(key, letter)
  }
  return letters
}
```

```ts
// schedule/sounding.ts
/** The keys sounding at `time` that were struck last: the open windows with the latest start. */
export function keysStruckAt(windows: readonly KeyWindow[], time: number): Set<Midi> {
  const open = windows.filter((window) => window.from <= time && time < window.to)
  const latest = Math.max(...open.map((window) => window.from))
  const keys = open.filter((window) => window.from === latest).map((window) => window.midi)
  return new Set(keys.sort((a, b) => a - b))
}

// schedule/sounds.ts
/** How the explorers sound a chord: its inversion, one hand or two, struck at once or rolled. */
export interface ChordPlaying {
  readonly inversion?: number
  readonly bothHands?: boolean
  readonly arpeggio?: boolean
}

/** A chord as the explorers place it (`placeChord`), struck at once or rolled upwards. */
export function placedChordSounds(
  chord: Chord,
  { inversion = 0, bothHands = false, arpeggio = false }: ChordPlaying = {},
): NoteSound[] {
  const placed = placeChord(chord.root, chord.quality, { inversion, bothHands })
  return chordSounds(
    [...placed.lh, ...placed.rh].map((tone) => tone.midi),
    { arpeggio },
  )
}
```

Export everything above from `shared/lib/index.ts` and `schedule/index.ts`. `usePlayChord` now plays
`placedChordSounds(chord, options)` and takes `ChordPlaying` from `@/shared/lib/schedule`; `services/index.ts` stops
exporting `ChordPlaying` (nothing imports it from there). `PianoKeyboard.tsx` drops its own `PIANO_KEYS` for
`PIANO_LAYOUT` and names a key's octave with `octaveOf`.

- [ ] **Step 4: Run them and see them pass**, then the whole check.
- [ ] **Step 5: Commit:** "Find the key under a point, the view's keys, the typed keys and the keys struck last".

### Task 3: Play handles, struck keys, taps at once, and Stop buttons

**Files:**

- Create: `src/shared/lib/services/use-playback.ts` (+ `use-playback.test.tsx`),
  `src/shared/lib/services/use-sounding-keys.test.tsx`
- Modify: `src/shared/api/audio/{types.ts,sounding.ts,fake-audio.ts,web-audio.ts,index.ts}`,
  `src/shared/lib/services/{use-play.ts,use-sounding-keys.ts,index.ts}`
- Test: `src/shared/api/audio/{sounding.test.ts,fake-audio.test.ts,web-audio.test.ts}`,
  `src/shared/lib/services/use-play.test.tsx`

**Consumes:** `keysStruckAt` (Task 2). **Produces:** `PlayHandle`; `AudioOutput.play(): PlayHandle`,
`isPlaying(handle)`, `struck()`; `usePlay(): (sounds) => PlayHandle`; `useSoundingKeys(which?: 'sounding' |
'struck')`; `Playback<Id>`, `usePlayback<Id extends string | number>(): { playing: Id | null; toggle(id, sounds) }`.

The port already knows what sounds (ADR 0008); it now also knows which play still sounds, so a Stop button reads
the port and needs no tracker, no provider and no shared state: another button's sound cuts its play off, and the
port says so.

- [ ] **Step 1: Write the failing tests.**

```ts
// sounding.test.ts
it('says which keys were struck last, the same set until they change', () => {
  const { keys, at } = setUp()
  keys.add(chordSounds(C_MAJOR, { arpeggio: true }), 1)
  at(1.3)
  expect([...keys.struck()]).toEqual([64])
  const struck = keys.struck()
  at(1.35)
  expect(keys.struck()).toBe(struck)
  at(2.45)
  expect([...keys.struck()]).toEqual([67])
})

it('plays a play until its last note ends', () => {
  const { keys, at } = setUp()
  const onChange = vi.fn()
  keys.subscribe(onChange)
  const play = keys.add(chordSounds(C_MAJOR, { arpeggio: true }), 1)
  expect(keys.isPlaying(play)).toBe(true)
  at(2.8)
  expect(keys.isPlaying(play)).toBe(true)
  onChange.mockClear()
  at(2.85)
  expect(keys.isPlaying(play)).toBe(false)
  expect(onChange).toHaveBeenCalledOnce()
})

it('cuts every play off on clear, and says so before any note sounded', () => {
  const { keys } = setUp()
  const onChange = vi.fn()
  keys.subscribe(onChange)
  const play = keys.add(chordSounds(C_MAJOR, { arpeggio: false }), 1)
  keys.clear()
  expect(keys.isPlaying(play)).toBe(false)
  expect(onChange).toHaveBeenCalledOnce()
})

it('never plays a play with no notes', () => {
  const { keys } = setUp()
  expect(keys.isPlaying(keys.add([{ kind: 'click', at: 0, accent: true }], 0))).toBe(false)
})

// fake-audio.test.ts
it('hands back each play, playing until its end or a stop, and the keys struck last', () => {
  const audio = createFakeAudio()
  const play = audio.play(chordSounds(C_MAJOR, { arpeggio: true }), 0)
  audio.setNow(0.3)
  expect([...audio.struck()]).toEqual([64])
  expect(audio.isPlaying(play)).toBe(true)
  audio.stop()
  expect(audio.isPlaying(play)).toBe(false)
})

// web-audio.test.ts
it('hands back a play that plays until it is stopped', () => {
  const { audio } = setUp()
  const play = audio.play([A4], 0)
  expect(audio.isPlaying(play)).toBe(true)
  audio.stop()
  expect(audio.isPlaying(play)).toBe(false)
})
// and in 'does nothing, and throws nothing, where the browser has no audio':
expect(audio.isPlaying(audio.play([A4]))).toBe(false)
expect(audio.struck().size).toBe(0)

// use-play.test.tsx: 'unlocks audio and plays from just after now' becomes
const handle = play([NOTE])
expect(audio.unlocks).toBe(1)
expect(audio.played[0]?.at).toBeCloseTo(2.1)
expect(audio.isPlaying(handle)).toBe(true)
// and a new test
it('sounds a tap at once, from the audio clock’s now', () => {
  const { audio, current: soundKey } = setup(useSoundKey)
  audio.setNow(3)
  soundKey(midi(60))
  expect(audio.played.at(-1)?.at).toBe(3)
})

// use-sounding-keys.test.tsx
it('reads the keys sounding, or only the ones struck last', () => {
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  const { result } = renderHook(() => [useSoundingKeys(), useSoundingKeys('struck')], { wrapper })
  act(() => void audio.play(chordSounds(C_MAJOR, { arpeggio: true }), 0))
  act(() => audio.setNow(0.3))
  expect(result.current.map((keys) => [...keys])).toEqual([[60, 64], [64]])
})
```

```tsx
// use-playback.test.tsx
const NOTE: Sound = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 0.2 }

function setup<T>(hook: () => T, audio: AudioOutput = createFakeAudio()) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  return { audio, result: renderHook(hook, { wrapper }).result }
}

describe('usePlayback', () => {
  it('is playing its id from the tap until the last note ends', () => {
    const audio = createFakeAudio()
    const { result } = setup(() => usePlayback<'chord'>(), audio)
    act(() => result.current.toggle('chord', [NOTE]))
    expect(result.current.playing).toBe('chord')
    act(() => audio.setNow(1.05))
    expect(result.current.playing).toBe('chord')
    act(() => audio.setNow(1.2))
    expect(result.current.playing).toBeNull()
  })

  it('stops on a second tap, even before the first note sounded', () => {
    const audio = createFakeAudio()
    const { result } = setup(() => usePlayback<'chord'>(), audio)
    act(() => result.current.toggle('chord', [NOTE]))
    act(() => result.current.toggle('chord', [NOTE]))
    expect(result.current.playing).toBeNull()
    expect(audio.stops).toBe(2)
  })

  it('turns back when another sound cuts it off, but not under a tapped key', () => {
    const audio = createFakeAudio()
    const { result } = setup(
      () => ({ a: usePlayback<'a'>(), b: usePlayback<'b'>(), tap: useSoundKey() }),
      audio,
    )
    act(() => result.current.a.toggle('a', [NOTE]))
    act(() => result.current.tap(midi(64)))
    expect(result.current.a.playing).toBe('a')
    act(() => result.current.b.toggle('b', [NOTE]))
    expect(result.current.a.playing).toBeNull()
    expect(result.current.b.playing).toBe('b')
  })

  it('never turns into Stop where nothing can sound', () => {
    const silent = createWebAudioOutput({ createContext: () => null, frame: () => {} })
    const { result } = setup(() => usePlayback<'chord'>(), silent)
    act(() => result.current.toggle('chord', [NOTE]))
    expect(result.current.playing).toBeNull()
  })
})
```

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/shared/api/audio src/shared/lib/services`.
- [ ] **Step 3: Write the code.** `types.ts`:

```ts
/** One call to `play()`: the port says whether it still sounds (`isPlaying`). */
export interface PlayHandle {
  /** When its last note ends on the audio clock. */
  readonly until: number
}

export interface AudioOutput {
  unlock(): Promise<void>
  /** Plays sounds whose `at` counts from `at` on the audio clock (by default just after now); returns their play. */
  play(sounds: readonly Sound[], at?: number): PlayHandle
  /** Silences what sounds and drops what is queued: every play stops playing. */
  stop(): void
  now(): number
  /** The keys sounding now, whatever played them: the same set until they change. */
  sounding(): ReadonlySet<Midi>
  /** The keys sounding now that were struck last (spotlight): the same set until they change. */
  struck(): ReadonlySet<Midi>
  /** Whether a play has a note sounding or still to come: false once its last note ends or stop() cuts it off. */
  isPlaying(play: PlayHandle): boolean
  /** Calls `onChange` whenever the keys sounding or struck change, a play ends, or stop() runs; returns what stops it. */
  onSounding(onChange: () => void): () => void
}
```

`sounding.ts`: the log keeps the plays still playing beside its windows, and one look at the clock updates all of
it:

```ts
/** The play of sounds with no notes, or of sounds nothing could play: it never plays. */
export const NOTHING_PLAYED: PlayHandle = { until: 0 }

// SoundingKeys gains: add(…): PlayHandle; struck(): ReadonlySet<Midi>; isPlaying(play): boolean

export function createSoundingKeys({ now, frame }: { … }): SoundingKeys {
  let windows: readonly KeyWindow[] = []
  let current = NONE
  let struck = NONE
  const playing = new Set<PlayHandle>()
  let looking = false
  const listeners = new Set<() => void>()

  /** Looks at the clock; tells the listeners when anything they read changed, or when `stopped`. */
  const look = (stopped: boolean) => {
    const time = now()
    windows = windows.filter((window) => window.to > time)
    const ended = [...playing].filter((play) => play.until <= time)
    for (const play of ended) playing.delete(play)
    const sounding = keysSoundingAt(windows, time)
    const soundingChanged = !sameKeys(sounding, current)
    if (soundingChanged) current = sounding.size === 0 ? NONE : sounding
    const last = keysStruckAt(windows, time)
    const struckChanged = !sameKeys(last, struck)
    if (struckChanged) struck = last.size === 0 ? NONE : last
    if (stopped || ended.length > 0 || soundingChanged || struckChanged)
      for (const listener of listeners) listener()
  }
  const update = () => look(false)
  // `follow` as now

  return {
    add(sounds, at) {
      const added = keyWindows(sounds, at)
      if (added.length === 0) return NOTHING_PLAYED
      const play: PlayHandle = { until: Math.max(...added.map((window) => window.to)) }
      windows = [...windows, ...added]
      playing.add(play)
      update()
      follow()
      return play
    },
    clear() {
      windows = []
      const stopped = playing.size > 0
      playing.clear()
      look(stopped)
    },
    current: () => current,
    struck: () => struck,
    isPlaying: (play) => playing.has(play),
    subscribe, // as now
    update,
  }
}
```

The fake: `play` returns `keys.add(sounds, start)`; `struck: keys.struck`, `isPlaying: keys.isPlaying`. The WebAudio
adapter: `if (!audio) return NOTHING_PLAYED`, then `return keys.add(sounds, start)`; the same two readers.
`audio/index.ts` exports `type PlayHandle`. `use-play.ts`:

```ts
/** Sounds something now, cutting off what was sounding: a chord, a bar, a scale run. Returns its play. */
export function usePlay(): (sounds: readonly Sound[]) => PlayHandle {
  const { audio } = useServices()
  return useCallback(
    (sounds) => {
      void audio.unlock()
      audio.stop()
      return audio.play(sounds, audio.now() + PLAY_DELAY)
    },
    [audio],
  )
}

/** Sounds one key now, on top of whatever sounds: a tap is one note, with nothing to schedule ahead. */
export function useSoundKey(): (key: Midi) => void {
  const { audio } = useServices()
  return useCallback(
    (key) => {
      void audio.unlock()
      audio.play([keySound(key)], audio.now())
    },
    [audio],
  )
}
```

`use-sounding-keys.ts`:

```ts
/** The keys the app is sounding now, whatever played them; `'struck'`: only the ones struck last. */
export function useSoundingKeys(which: 'sounding' | 'struck' = 'sounding'): ReadonlySet<Midi> {
  const { audio } = useServices()
  return useSyncExternalStore(audio.onSounding, which === 'struck' ? audio.struck : audio.sounding)
}
```

`use-playback.ts`, exported with `type Playback` from `services/index.ts`:

```ts
import { useCallback, useState, useSyncExternalStore } from 'react'
import type { PlayHandle } from '@/shared/api/audio'
import type { Sound } from '@/shared/lib/schedule'
import { usePlay } from './use-play'
import { useServices } from './use-services'

/** A component's Play buttons, one id each, each turning into Stop while its sound plays. */
export interface Playback<Id extends string | number> {
  /** The id last played, while it plays: until its last note ends, it is stopped, or another sound cuts it off. */
  readonly playing: Id | null
  /** A Play button's tap: stops `id`'s sound while it plays; else cuts off what sounds and plays `sounds` as `id`. */
  toggle(id: Id, sounds: readonly Sound[]): void
}

/**
 * The state of a component's Play buttons, read from the audio port: nothing is shared between
 * components, because a sound started anywhere else cuts this one's play off and the port says so.
 */
export function usePlayback<Id extends string | number>(): Playback<Id> {
  const { audio } = useServices()
  const play = usePlay()
  const [started, setStarted] = useState<{ readonly id: Id; readonly play: PlayHandle } | null>(null)
  const playing = useSyncExternalStore(audio.onSounding, () =>
    started !== null && audio.isPlaying(started.play) ? started.id : null,
  )
  const toggle = useCallback(
    (id: Id, sounds: readonly Sound[]) => {
      if (playing === id) {
        audio.stop()
        setStarted(null)
      } else {
        setStarted({ id, play: play(sounds) })
      }
    },
    [audio, play, playing],
  )
  return { playing, toggle }
}
```

- [ ] **Step 4: Run them and see them pass**, then the whole check (the practice transport ignores `play`'s new
      return value; nothing else implements `AudioOutput`).
- [ ] **Step 5: Commit:** "Let the audio port say which play still sounds and which keys were struck last, play taps
      at once, and give Play buttons their Stop".

### Task 4: How a key looks

**Files:**

- Modify: `src/shared/ui/piano-keyboard/{key-look.ts,Key.tsx,PianoKeyboard.tsx}`, `src/styles/{tokens.css,theme.css}`
- Test: `src/shared/ui/piano-keyboard/{key-look.test.ts,PianoKeyboard.test.tsx}`

**Consumes:** `NamedKeys` (Task 1), `octaveOf`, `printedKeyName` (Task 2). **Produces:** `KeyTone` with `'tonic'` and
`'scale'`; `KeyMark.finger?: Finger`; `KeyStates.quiet`; `KeyText`; `KeyLabel`; `KeyLook` (`fill`, `down`,
`outlined`, `quiet`, `label?`, `letter?`); `keyLook(key, states, text)`; `PianoKeyboard`'s `namedKeys` and `letters`
props (Task 5 adds the rest).

- [ ] **Step 1: Write the failing tests.** `key-look.test.ts`, every call now passing a `KeyText`:

```ts
const UNNAMED: KeyText = { namedKeys: 'none' }

it('leaves a key with nothing on it white or black', () => {
  expect(keyLook(C4, {}, UNNAMED)).toEqual({ fill: 'white', down: false, outlined: false, quiet: false })
  expect(keyLook(CS4, {}, UNNAMED).fill).toBe('black')
})

it('colours a scale’s keys whole: the tonic deep, the other notes light, black keys too', () => {
  const scale = new Map<Midi, KeyMark>([
    [C4, { tone: 'tonic', label: '1' }],
    [CS4, { tone: 'scale', label: '♭2' }],
  ])
  expect(keyLook(C4, { marks: scale }, UNNAMED)).toMatchObject({ fill: 'tonic', label: { kind: 'mark', text: '1' } })
  expect(keyLook(CS4, { marks: scale }, UNNAMED)).toMatchObject({ fill: 'scale', label: { kind: 'mark', text: '♭2' } })
})

it('names every C, every key, or none, and a mark’s label wins', () => {
  const name = (key: Midi, namedKeys: NamedKeys) => keyLook(key, {}, { namedKeys }).label
  expect(name(C4, 'c')).toEqual({ kind: 'name', text: 'C4' })
  expect(name(midi(62), 'c')).toBeUndefined()
  expect([name(C4, 'all'), name(CS4, 'all')]).toEqual([
    { kind: 'name', text: 'C4' },
    { kind: 'name', text: 'C♯' },
  ])
  expect(name(C4, 'none')).toBeUndefined()
  expect(keyLook(C4, { marks: root }, { namedKeys: 'all' }).label).toEqual({ kind: 'mark', text: '1' })
})

it('carries a typing key’s letter', () => {
  expect(keyLook(C4, {}, { namedKeys: 'none', letters: new Map([[C4, 'A']]) }).letter).toBe('A')
})

it('holds back only a marked key', () => {
  const quiet = new Set([C4, midi(62)])
  expect(keyLook(C4, { marks: root, quiet }, UNNAMED).quiet).toBe(true)
  expect(keyLook(midi(62), { marks: root, quiet }, UNNAMED).quiet).toBe(false)
})
```

The precedence, down and outline tests stay, with `UNNAMED`. `PianoKeyboard.test.tsx`: the band test becomes

```tsx
it('colours a scale’s keys whole, black keys too, each with its degree', () => {
  renderKeyboard({
    marks: new Map<Midi, KeyMark>([
      [C4, { tone: 'tonic', label: '1' }],
      [midi(63), { tone: 'scale', label: '♭3' }],
    ]),
  })
  expect(screen.getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
  const eFlat = screen.getByRole('button', { name: 'D sharp 4' })
  expect(eFlat).toHaveClass('bg-key-scale')
  expect(eFlat).toHaveTextContent('♭3')
})

it('names every C by default, all keys or none when asked', () => {
  const { rerender } = renderKeyboard()
  expect(screen.getByRole('button', { name: 'C4' })).toHaveTextContent('C4')
  expect(screen.getByRole('button', { name: 'D4' }).textContent).toBe('')
  rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} namedKeys="all" />)
  expect(screen.getByRole('button', { name: 'C sharp 4' })).toHaveTextContent('C♯')
  rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} namedKeys="none" />)
  expect(screen.getByRole('button', { name: 'C4' }).textContent).toBe('')
})

it('shows the typing letters on their keys, and a quiet key held back', () => {
  renderKeyboard({
    letters: new Map([[C4, 'A']]),
    marks: new Map<Midi, KeyMark>([[midi(62), { tone: 'root', label: '1' }]]),
    quiet: new Set([midi(62)]),
  })
  expect(screen.getByRole('button', { name: 'C4' })).toHaveTextContent('A')
  expect(screen.getByRole('button', { name: 'D4' })).toHaveAttribute('data-quiet')
})
```

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/shared/ui/piano-keyboard`.
- [ ] **Step 3: Write the code.** `key-look.ts`:

```ts
import type { NamedKeys } from '@/shared/lib'
import {
  isBlackKey,
  noteName,
  pitchClass,
  plainSpelling,
  printedKeyName,
  type ChordRole,
  type Finger,
  type Midi,
} from '@/shared/lib/music'

/** A chord tone's role, a hand in the Player, or a scale's note: its tonic or another (roles stay on chord tones). */
export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody' | 'tonic' | 'scale'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
  /** A finger number, drawn in the finger row under the keys. */
  readonly finger?: Finger
}

// KeyStates as now, plus:
//   /** Marked keys held back while others are struck (spotlight). */
//   readonly quiet?: ReadonlySet<Midi>

/** What a key may carry besides its marks: its note's name, and a letter of the computer keyboard. */
export interface KeyText {
  readonly namedKeys: NamedKeys
  readonly letters?: ReadonlyMap<Midi, string> | undefined
}

export type KeyFill = 'white' | 'black' | 'lit' | 'selected' | 'wrong' | KeyTone

/** A key's label: a mark's own (a degree, ✓, a note the Player spells), or its note's name, drawn smaller. */
export interface KeyLabel {
  readonly kind: 'mark' | 'name'
  readonly text: string
}

/** One key's face: its fill, whether it is down, outlined or quiet, its label and its letter. */
export interface KeyLook {
  readonly fill: KeyFill
  readonly down: boolean
  readonly outlined: boolean
  readonly quiet: boolean
  readonly label?: KeyLabel
  readonly letter?: string
}

function fillOf(key: Midi, states: KeyStates, mark: KeyMark | undefined): KeyFill {
  if (states.wrong?.has(key)) return 'wrong'
  if (states.lit?.has(key)) return 'lit'
  if (mark) return mark.tone
  if (states.selected?.has(key)) return 'selected'
  return isBlackKey(key) ? 'black' : 'white'
}

/** "C4" on every C unless no key is named; the note alone ("F♯") on the other keys when all are. */
function nameOf(key: Midi, namedKeys: NamedKeys): string | undefined {
  if (namedKeys === 'none') return undefined
  const pc = pitchClass(key)
  if (pc === 0) return printedKeyName(key)
  return namedKeys === 'all' ? noteName(plainSpelling(pc, true)) : undefined
}

function labelOf(key: Midi, mark: KeyMark | undefined, namedKeys: NamedKeys): KeyLabel | undefined {
  if (mark?.label) return { kind: 'mark', text: mark.label }
  const name = nameOf(key, namedKeys)
  return name === undefined ? undefined : { kind: 'name', text: name }
}

/** How a key looks: a wrong key over a lit one, a lit one over a mark, a mark over a selection; down over all. */
export function keyLook(key: Midi, states: KeyStates, text: KeyText): KeyLook {
  const mark = states.marks?.get(key)
  const label = labelOf(key, mark, text.namedKeys)
  const letter = text.letters?.get(key)
  return {
    fill: fillOf(key, states, mark),
    down: states.down?.has(key) ?? false,
    outlined: states.outlined?.has(key) ?? false,
    quiet: mark !== undefined && (states.quiet?.has(key) ?? false),
    ...(label ? { label } : {}),
    ...(letter ? { letter } : {}),
  }
}

/** Whether two looks draw the same key: `Key`'s memo compares every field a key shows. */
export const sameLook = (a: KeyLook, b: KeyLook): boolean =>
  a.fill === b.fill &&
  a.down === b.down &&
  a.outlined === b.outlined &&
  a.quiet === b.quiet &&
  a.label?.kind === b.label?.kind &&
  a.label?.text === b.label?.text &&
  a.letter === b.letter
```

`Key.tsx`: each fill carries its label's ink, the band goes, and the key gains the veil, the lip and the drop:

```tsx
const FILL: Readonly<Record<KeyFill, string>> = {
  white: 'bg-key-white text-on-key-white',
  black: 'bg-key-black text-on-key-black',
  lit: 'bg-primary text-primary-foreground',
  selected: 'bg-primary text-primary-foreground',
  wrong: 'bg-destructive text-on-role',
  // root … 13th, rh, lh, melody as now
  tonic: 'bg-key-tonic text-on-key-tonic',
  scale: 'bg-key-scale text-on-key-scale',
}

function KeyButton({ geometry, name, look, chosen, tabStop, onPress, onFocusKey }: KeyProps) {
  const { black } = geometry
  const plain = look.fill === 'white' || look.fill === 'black'
  return (
    <button
      type="button"
      data-midi={geometry.midi}
      data-down={look.down ? '' : undefined}
      data-quiet={look.quiet ? '' : undefined}
      aria-label={name}
      aria-pressed={chosen}
      tabIndex={tabStop ? 0 : -1}
      onClick={() => onPress(geometry.midi)}
      onFocus={() => onFocusKey(geometry.midi)}
      className={cn(
        'absolute top-0 flex flex-col items-center justify-end overflow-hidden pb-2.5 transition duration-80 ease-out outline-none hover:brightness-95 active:brightness-90 focus-visible:z-30 focus-visible:ring-3 focus-visible:ring-ring',
        black ? 'z-10 rounded-b-xs' : 'rounded-b-sm border-r border-key-bed',
        look.down && plain ? 'bg-key-down text-on-key-down' : FILL[look.fill],
        look.quiet ? (black ? 'text-on-key-black' : 'text-on-key-white') : null,
        look.down ? 'translate-y-0.5' : null,
        look.outlined ? 'ring-3 ring-primary ring-inset' : null,
      )}
      style={{ left: `${geometry.left}%`, width: `${geometry.width}%`, height: `${geometry.height}%` }}
    >
      {/* Quiet: the key's colour at a low strength, under a veil of the plain key. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-80 ease-out',
          black ? 'bg-key-black' : 'bg-key-white',
          look.quiet ? 'opacity-70' : null,
        )}
      />
      {/* A coloured key going down keeps its colour under a tint. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 bg-key-down-tint opacity-0 transition-opacity duration-80 ease-out',
          look.down && !plain ? 'opacity-100' : null,
        )}
      />
      {/* The key's front: a white key's lip, a black key's slope, shortened while the key is down. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 origin-bottom transition duration-80 ease-out',
          black ? 'h-2 bg-key-sheen' : 'h-1.5 bg-key-lip',
          look.down ? 'scale-y-33' : null,
        )}
      />
      {look.letter ? (
        <span aria-hidden className="relative text-xs font-semibold opacity-70">
          {look.letter}
        </span>
      ) : null}
      {look.label ? (
        <span
          aria-hidden
          className={cn(
            'relative font-bold tabular-nums',
            look.label.kind === 'name' ? 'text-xs' : 'text-sm',
          )}
        >
          {look.label.text}
        </span>
      ) : null}
    </button>
  )
}
```

`PianoKeyboard.tsx` takes `namedKeys?: NamedKeys` (default `'c'`) and `letters?: ReadonlyMap<Midi, string> |
undefined`, passes `keyLook(key.midi, states, { namedKeys, letters })` (`quiet` rides in `states`), gives the keys'
group `bg-key-bed`, and draws the rail's shade over the keys, last in the group:

```tsx
<span
  aria-hidden
  className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2 bg-linear-to-b from-key-shade to-transparent"
/>
```

`tokens.css` (`:root`; the keys stay piano-coloured by night, so only the bed, the down key and its ink change
under `[data-theme='dark']`): remove `--key-white-edge` and the four `--key-mark*`, add

```css
  /*
   * The keys' material (DESIGN.md's No Glow Rule's one exception): the bed between the white keys,
   * the rail's shade on them, a white key's lip and a black key's sheen.
   */
  --key-bed: var(--p-ink-900);
  --key-shade: color-mix(in oklab, var(--p-ink-950) 22%, transparent);
  --key-lip: color-mix(in oklab, var(--p-ink-950) 12%, transparent);
  --key-sheen: color-mix(in oklab, var(--p-white) 16%, transparent);
  /* A label's ink on a plain key, and on a plain key down. */
  --on-key-white: var(--p-ink-950);
  --on-key-black: var(--p-white);
  --on-key-down: var(--p-ink-950);
  /* A scale's notes colour whole keys: the tonic deep, the others light; the same by night, as the keys. */
  --key-tonic: var(--p-teal-800);
  --on-key-tonic: var(--p-white);
  --key-scale: var(--p-teal-300);
  --on-key-scale: var(--p-ink-950);
```

and under `[data-theme='dark']` `--key-bed: var(--p-night-990);` and `--on-key-down: var(--p-mist-50);`. `theme.css`'s
`@theme inline` swaps `--color-key-white-edge` and the four `--color-*key-mark*` for `--color-key-bed`,
`--color-key-shade`, `--color-key-lip`, `--color-key-sheen`, `--color-on-key-white`, `--color-on-key-black`,
`--color-on-key-down`, `--color-key-tonic`, `--color-on-key-tonic`, `--color-key-scale`, `--color-on-key-scale`.
`grep -rn "key-mark\|key-white-edge" src` finds nothing after this step.

- [ ] **Step 4: Run them and see them pass**, then the whole check.
- [ ] **Step 5: Commit:** "Colour a scale's keys whole, name the keys, hold quiet keys back, and give the keys a lip
      and a drop".

### Task 5: The keyboard: key sizes, the rail, touch, the map, the finger row

**Files:**

- Create: `src/shared/ui/piano-keyboard/{RailButton.tsx,KeyboardMap.tsx,FingerRow.tsx,use-key-pointers.ts,
  use-scroll-view.ts}`, `src/shared/test/layout.ts`
- Modify: `src/shared/ui/piano-keyboard/{PianoKeyboard.tsx,Key.tsx,index.ts}`, `src/shared/ui/index.ts`,
  `src/styles/{tokens.css,theme.css}`, `src/shared/i18n/locales/{en,ru}/common.ts`; the fixed heights the keys'
  proportions replace: `src/features/live-keyboard/ui/ExplorerKeyboard.tsx`, `src/widgets/quiz-board/ui/QuizBoard.tsx`,
  `src/pages/theory-symbols/ui/TheorySymbolsPage.tsx`, `src/pages/piece/ui/PieceView.tsx`,
  `src/pages/player/ui/PlayerPage.tsx`
- Test: `src/shared/ui/piano-keyboard/{PianoKeyboard.test.tsx,KeyPointers.test.tsx,KeyboardMap.test.tsx}`

**Consumes:** Tasks 1, 2 and 4. **Produces:** `PianoKeyboard` props `keySize`, `swipe`, `map`, `height`
(`'proportional' | 'fill'`) and `children` (the rail's trailing controls); `RailButton({ label, icon, …button })`
(exported from `@/shared/ui`); `stubBox(element, box)` and `stubScrolling({ clientWidth, scrollWidth })`
(`@/shared/test/layout`).

The keyboard becomes a column: the rail (a 44px strip, the dark rail drawn along its foot, holding ‹, the map, › and
the slot), then the scroller holding the keys' group and the finger row. The rail sits outside the scroller, so its
buttons never scroll away. ‹ › and the map show at every size but Whole piano, in both swipes.

- [ ] **Step 1: Write the test helpers**, `src/shared/test/layout.ts` (jsdom 29 has no layout, no `scrollTo` and no
      pointer capture; the keyboard needs no capture, and these lay out what a test needs):

```ts
import { onTestFinished, vi } from 'vitest'

/** jsdom lays nothing out: gives an element the box a pointer's position is read against. */
export function stubBox(
  element: Element,
  { left = 0, top = 0, width, height }: { left?: number; top?: number; width: number; height: number },
) {
  const box: DOMRect = {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({ left, top, width, height }),
  }
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(box)
}

/**
 * jsdom lays nothing out: for this test every element is `clientWidth` wide and holds
 * `scrollWidth`, keeps the scroll position it is given, and scrolls with a `scrollTo` that fires
 * `scroll`. Returns each position scrolled to.
 */
export function stubScrolling({ clientWidth, scrollWidth }: { clientWidth: number; scrollWidth: number }) {
  const positions = new WeakMap<Element, number>()
  const scrolls: number[] = []
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth)
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth)
  vi.spyOn(Element.prototype, 'scrollLeft', 'get').mockImplementation(function (this: Element) {
    return positions.get(this) ?? 0
  })
  vi.spyOn(Element.prototype, 'scrollLeft', 'set').mockImplementation(function (this: Element, left: number) {
    positions.set(this, left)
  })
  Object.defineProperty(Element.prototype, 'scrollTo', {
    configurable: true,
    value(this: Element, options: ScrollToOptions) {
      const left = options.left ?? 0
      scrolls.push(left)
      positions.set(this, left)
      this.dispatchEvent(new Event('scroll'))
    },
  })
  onTestFinished(() => void Reflect.deleteProperty(Element.prototype, 'scrollTo'))
  return { scrolls }
}
```

- [ ] **Step 2: Write the failing tests.** `KeyPointers.test.tsx` (the group's box: 520 × 100, so each white key is
      10px wide and C4, white key 23, spans 230–240):

```tsx
const C4 = midi(60)
const ONE_OCTAVE = { from: C4, to: midi(71) }
const x = (whiteIndex: number) => whiteIndex * 10 + 5
const touch = (pointerId: number, clientX: number, clientY = 90) => ({ pointerId, pointerType: 'touch', clientX, clientY })

function setUp(props: Partial<ComponentProps<typeof PianoKeyboard>> = {}) {
  const onKeyPress = vi.fn()
  render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={onKeyPress} {...props} />)
  const keys = screen.getByRole('group', { name: 'Keyboard' })
  stubBox(keys, { width: 520, height: 100 })
  const key = (name: string) => screen.getByRole('button', { name })
  return { onKeyPress, keys, key }
}

describe('touching the keys', () => {
  it('plays a key the instant a pointer touches it, and draws it down until it lifts', () => {
    const { onKeyPress, key } = setUp()
    fireEvent.pointerDown(key('F sharp 4'), touch(1, 270, 30))
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(66)
    expect(key('F sharp 4')).toHaveAttribute('data-down')
    fireEvent.pointerUp(key('F sharp 4'), touch(1, 270, 30))
    expect(key('F sharp 4')).not.toHaveAttribute('data-down')
  })

  it.each(['scroll', 'glissando'] as const)('plays a tap once, its click included (%s)', async (swipe) => {
    const user = userEvent.setup()
    const { onKeyPress, key } = setUp({ swipe })
    await user.click(key('G4'))
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(67)
  })

  it('plays the focused key on Enter and Space, and a click no pointer made', async () => {
    const user = userEvent.setup()
    const { onKeyPress, key } = setUp({ swipe: 'glissando' })
    key('C4').focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    fireEvent.click(key('D4'))
    expect(onKeyPress.mock.calls).toEqual([[60], [60], [62]])
  })

  it('in Scroll, plays nothing more as the pointer moves, and lifts a press the browser cancels', () => {
    const { onKeyPress, keys, key } = setUp()
    fireEvent.pointerDown(key('C4'), touch(1, x(23)))
    fireEvent.pointerMove(keys, touch(1, x(25)))
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(60)
    fireEvent.pointerCancel(keys, touch(1, x(25)))
    expect(key('C4')).not.toHaveAttribute('data-down')
  })

  it('in Glissando, plays each key a swipe enters, once per entry', () => {
    const { onKeyPress, keys, key } = setUp({ swipe: 'glissando' })
    fireEvent.pointerDown(key('C4'), touch(1, x(23)))
    for (const white of [23, 24, 24, 25, 24]) fireEvent.pointerMove(keys, touch(1, x(white)))
    expect(onKeyPress.mock.calls).toEqual([[60], [62], [64], [62]])
    expect(key('D4')).toHaveAttribute('data-down')
  })

  it('in Glissando, plays each pointer’s own keys', () => {
    const { onKeyPress, keys, key } = setUp({ swipe: 'glissando' })
    fireEvent.pointerDown(key('C4'), touch(1, x(23)))
    fireEvent.pointerDown(key('G4'), touch(2, x(27)))
    fireEvent.pointerMove(keys, touch(1, x(24)))
    fireEvent.pointerMove(keys, touch(2, x(28)))
    expect(onKeyPress.mock.calls).toEqual([[60], [67], [62], [69]])
  })

  it('in Glissando, forgets a mouse released outside the keys', () => {
    const { onKeyPress, keys, key } = setUp({ swipe: 'glissando' })
    fireEvent.pointerDown(key('C4'), { pointerId: 1, pointerType: 'mouse', button: 0, buttons: 1, clientX: x(23), clientY: 90 })
    fireEvent.pointerMove(keys, { pointerId: 1, pointerType: 'mouse', buttons: 0, clientX: x(24), clientY: 90 })
    expect(onKeyPress).toHaveBeenCalledExactlyOnceWith(60)
    expect(key('C4')).not.toHaveAttribute('data-down')
  })
})
```

`PianoKeyboard.test.tsx` gains:

```tsx
it('has ‹ › that move it an octave, in both swipes', async () => {
  const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
  const user = userEvent.setup()
  renderKeyboard({ swipe: 'scroll' })
  const opened = scrolls.at(-1) ?? 0
  await user.click(screen.getByRole('button', { name: 'Octave up' }))
  expect(scrolls.at(-1)).toBe(opened + 7 * 28)
  await user.click(screen.getByRole('button', { name: 'Octave down' }))
  expect(scrolls.at(-1)).toBe(opened)
})

it('shows the whole piano with nothing to move: no ‹ ›, no map, no finger row', () => {
  renderKeyboard({
    keySize: 'piano',
    map: true,
    marks: new Map<Midi, KeyMark>([[C4, { tone: 'tonic', label: '1', finger: 1 }]]),
  })
  expect(screen.queryByRole('button', { name: 'Octave up' })).not.toBeInTheDocument()
  expect(screen.queryByRole('slider', { name: 'Keys in view' })).not.toBeInTheDocument()
  expect(document.querySelector('[data-slot="finger-row"]')).not.toBeInTheDocument()
})

it('holds the controls it is given in its rail', () => {
  renderKeyboard({ children: <button type="button">Settings</button> })
  expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
})

it('puts fingers in circles under their keys, a black key’s above a white key’s', () => {
  renderKeyboard({
    marks: new Map<Midi, KeyMark>([
      [C4, { tone: 'scale', label: 'x', finger: 3 }],
      [midi(61), { tone: 'scale', label: 'y', finger: 4 }],
    ]),
  })
  const row = document.querySelector('[data-slot="finger-row"]')
  expect(row).toHaveTextContent('34')
  expect(screen.getByText('3')).toHaveClass('bottom-0')
  expect(screen.getByText('4')).toHaveClass('top-0')
})
```

The tab-stop test starts from the rail: `screen.getByRole('button', { name: 'Octave up' }).focus()`, then `await
user.tab()` reaches C4 (the rail's buttons come before the keys, as they stand above them). `KeyboardMap.test.tsx`:

```tsx
it('is a slider of the keys in view, stepped an octave by the arrow keys', async () => {
  const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
  const user = userEvent.setup()
  render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} map />)
  const map = screen.getByRole('slider', { name: 'Keys in view' })
  // Opened centred on C4–B4: 547px scrolled, G3 to E5 wholly in view.
  expect(map).toHaveAttribute('aria-valuetext', 'G3 to E5')
  map.focus()
  await user.keyboard('{ArrowRight}')
  expect(scrolls.at(-1)).toBe(547 + 7 * 28)
  await user.keyboard('{Home}')
  expect(scrolls.at(-1)).toBe(0)
})

it('moves the view to the point tapped on it', () => {
  const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
  render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} map />)
  const map = screen.getByRole('slider', { name: 'Keys in view' })
  stubBox(map, { width: 520, height: 44 })
  fireEvent.pointerDown(map, { pointerId: 1, pointerType: 'touch', clientX: 260, clientY: 20 })
  expect(scrolls.at(-1)).toBe(0.5 * 52 * 28 - 195)
})

it('is hidden unless asked for', () => {
  render(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} />)
  expect(screen.queryByRole('slider')).not.toBeInTheDocument()
})
```

- [ ] **Step 3: Run them and see them fail:** `npx vitest run src/shared/ui/piano-keyboard`.
- [ ] **Step 4: Write the code.** `use-key-pointers.ts`:

```ts
import { useCallback, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { keyAt, PIANO_LAYOUT, type Swipe } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'

const NONE: ReadonlySet<Midi> = new Set()

/**
 * A key plays the instant a pointer touches it. Scroll: that key only; the browser takes a swipe
 * and cancels the press. Glissando: every key a pointer enters plays, once per entry, each pointer
 * on its own. No capture is needed: a touch or pen is captured by the key it went down on, so its
 * moves and its lift reach the group; a mouse released outside is forgotten at its next move. A
 * pointer's own click never plays again; any other click (Enter, Space, a screen reader) plays once.
 */
export function useKeyPointers({
  swipe,
  keys,
  onPress,
}: {
  swipe: Swipe
  /** The keys' group, whose box a pointer's position is read against. */
  keys: RefObject<HTMLElement | null>
  onPress: (key: Midi) => void
}) {
  /** Each pointer down on the keys, and the key it is on (null between keys, in Glissando). */
  const pointers = useRef(new Map<number, Midi | null>())
  const [pressed, setPressed] = useState<ReadonlySet<Midi>>(NONE)
  /** The key a pointer went down on: the click that follows belongs to that press. */
  const pointerKey = useRef<Midi | null>(null)

  const show = useCallback(() => {
    const down = [...pointers.current.values()].filter((key) => key !== null)
    setPressed(down.length === 0 ? NONE : new Set(down))
  }, [])

  const forget = (pointerId: number) => {
    if (pointers.current.delete(pointerId)) show()
  }

  const pointerDown = useCallback(
    (key: Midi, event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      pointerKey.current = key
      pointers.current.set(event.pointerId, key)
      show()
      onPress(key)
    },
    [onPress, show],
  )

  const click = useCallback(
    (key: Midi) => {
      if (pointerKey.current !== key) onPress(key)
    },
    [onPress],
  )

  const group = {
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (!pointers.current.has(event.pointerId)) return
      if (event.pointerType === 'mouse' && event.buttons === 0) {
        forget(event.pointerId)
        return
      }
      const box = keys.current?.getBoundingClientRect()
      if (swipe === 'scroll' || !box) return
      const key = keyAt(
        PIANO_LAYOUT.keys,
        (event.clientX - box.left) / box.width,
        (event.clientY - box.top) / box.height,
      )
      if (key === pointers.current.get(event.pointerId)) return
      pointers.current.set(event.pointerId, key)
      show()
      if (key !== null) onPress(key)
    },
    onPointerLeave(event: PointerEvent<HTMLElement>) {
      if (!pointers.current.has(event.pointerId)) return
      if (swipe === 'scroll') {
        forget(event.pointerId)
        return
      }
      // A mouse between the keys and the page: coming back, the key it enters plays.
      pointers.current.set(event.pointerId, null)
      show()
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => forget(event.pointerId),
    onPointerCancel(event: PointerEvent<HTMLElement>) {
      pointerKey.current = null
      forget(event.pointerId)
    },
    // After a key's own click handler: the next click on a key is a new press.
    onClick() {
      pointerKey.current = null
    },
    onKeyDownCapture() {
      pointerKey.current = null
    },
  }

  return { pressed, pointerDown, click, group }
}
```

`Key.tsx` swaps `onPress` for `onPointerPress: (key: Midi, event: PointerEvent<HTMLElement>) => void` and
`onClickPress: (key: Midi) => void`: `onPointerDown={(event) => onPointerPress(geometry.midi, event)}`,
`onClick={() => onClickPress(geometry.midi)}`, and the memo compares both. `use-scroll-view.ts`:

```ts
import { useCallback, useLayoutEffect, useState, type RefObject } from 'react'
import type { ScrollMetrics } from '@/shared/lib'

const NOT_LAID_OUT: ScrollMetrics = { scrollLeft: 0, clientWidth: 0, scrollWidth: 0 }

const same = (a: ScrollMetrics, b: ScrollMetrics) =>
  a.scrollLeft === b.scrollLeft && a.clientWidth === b.clientWidth && a.scrollWidth === b.scrollWidth

/**
 * Where the scroller is and what it holds, followed as it scrolls and as the window resizes. Its
 * listeners are set up in a layout effect, before the keyboard's own layout effect scrolls to the
 * keys that matter, so the map hears that first scroll too.
 */
export function useScrollView(scroller: RefObject<HTMLElement | null>): ScrollMetrics {
  const [metrics, setMetrics] = useState(NOT_LAID_OUT)
  const read = useCallback(() => {
    const element = scroller.current
    if (!element) return
    const next = {
      scrollLeft: element.scrollLeft,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }
    setMetrics((last) => (same(last, next) ? last : next))
  }, [scroller])
  // A new key size re-renders the map: read the scroller again after every render.
  useLayoutEffect(() => read())
  useLayoutEffect(() => {
    const element = scroller.current
    if (!element) return
    element.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      element.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [scroller, read])
  return metrics
}
```

`RailButton.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

/** A button in the keyboard's rail: a 44px target whose icon sits in the drawn rail at its foot. */
export function RailButton({
  label,
  icon: Icon,
  className,
  ...props
}: { label: string; icon: LucideIcon } & Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'relative flex size-11 shrink-0 items-end justify-center rounded-sm pb-1 text-on-key-black transition-opacity duration-80 ease-out outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}
```

`FingerRow.tsx`:

```tsx
import { cn, PIANO_LAYOUT } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from './key-look'

/**
 * The finger row: a circle under each key a mark gives a finger, a black key's in the upper line
 * and a white key's in the lower, as the keys stand, so neighbours never overlap.
 */
export function FingerRow({ marks }: { marks: ReadonlyMap<Midi, KeyMark> | undefined }) {
  const fingered = PIANO_LAYOUT.keys.flatMap((key) => {
    const finger = marks?.get(key.midi)?.finger
    return finger === undefined ? [] : [{ key, finger }]
  })
  if (fingered.length === 0) return null
  return (
    <div aria-hidden data-slot="finger-row" className="relative h-9 shrink-0">
      {fingered.map(({ key, finger }) => (
        <span
          key={key.midi}
          className={cn(
            'absolute grid size-5 -translate-x-1/2 place-items-center rounded-full text-xs font-bold tabular-nums',
            key.black
              ? 'top-0 bg-key-scale text-on-key-scale'
              : 'bottom-0 bg-key-white text-on-key-white ring-1 ring-key-bed',
          )}
          style={{ left: `${key.left + key.width / 2}%` }}
        >
          {finger}
        </span>
      ))}
    </div>
  )
}
```

`KeyboardMap.tsx`:

```tsx
import { useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import {
  keysInView,
  PIANO_LAYOUT,
  scrollByOctave,
  scrollToCentre,
  useMediaQuery,
  viewFrame,
  type ScrollMetrics,
} from '@/shared/lib'
import { printedKeyName, type Midi } from '@/shared/lib/music'
import { useScrollView } from './use-scroll-view'

/** The map's black keys never change: drawn once. */
const BLACK_KEYS = PIANO_LAYOUT.keys
  .filter((key) => key.black)
  .map((key) => (
    <span
      key={key.midi}
      className="absolute top-0 h-3/5 bg-key-black"
      style={{ left: `${key.left}%`, width: `${key.width}%` }}
    />
  ))

/** Where each key takes the view: an octave either way, or an end. */
const MOVES: Readonly<Partial<Record<string, (metrics: ScrollMetrics) => number>>> = {
  ArrowLeft: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, -1),
  ArrowDown: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, -1),
  ArrowRight: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, 1),
  ArrowUp: (metrics) => scrollByOctave(metrics, PIANO_LAYOUT.whites, 1),
  Home: () => 0,
  End: ({ clientWidth, scrollWidth }) => Math.max(0, scrollWidth - clientWidth),
}

/**
 * The keyboard map: all 88 keys small in the rail, a frame round the stretch in view, dots on the
 * keys marked or down. A slider: tap or drag it to move there, the arrow keys step an octave.
 */
export function KeyboardMap({
  scroller,
  dots,
}: {
  scroller: RefObject<HTMLElement | null>
  dots: ReadonlySet<Midi>
}) {
  const { t } = useTranslation('common')
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const dragging = useRef<number | null>(null)
  const metrics = useScrollView(scroller)
  const frame = viewFrame(metrics)
  const edges = keysInView(PIANO_LAYOUT.keys, frame)
  const room = Math.max(0, metrics.scrollWidth - metrics.clientWidth)

  const moveView = (left: number, smooth: boolean) =>
    scroller.current?.scrollTo({ left, behavior: smooth && !reduceMotion ? 'smooth' : 'instant' })

  const moveToPoint = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    if (box.width > 0) moveView(scrollToCentre(metrics, (event.clientX - box.left) / box.width), false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = MOVES[event.key]
    if (!move) return
    event.preventDefault()
    moveView(move(metrics), true)
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={t('rail.map')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={room === 0 ? 0 : Math.round((metrics.scrollLeft / room) * 100)}
      aria-valuetext={
        edges
          ? t('rail.mapRange', { from: printedKeyName(edges.from), to: printedKeyName(edges.to) })
          : undefined
      }
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        dragging.current = event.pointerId
        moveToPoint(event)
      }}
      onPointerMove={(event) => {
        if (dragging.current === event.pointerId && event.buttons !== 0) moveToPoint(event)
      }}
      onPointerUp={() => {
        dragging.current = null
      }}
      onPointerCancel={() => {
        dragging.current = null
      }}
      className="relative flex h-11 w-full touch-none items-end rounded-sm px-1 pb-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      {/* The strip and its dots share one box, so a key's place is a share of the strip's width. */}
      <div aria-hidden className="relative h-6 w-full">
        <div className="absolute inset-x-0 top-0 h-4 overflow-hidden rounded-xs bg-key-white">
          {BLACK_KEYS}
          <span
            className="absolute inset-y-0 rounded-xs ring-2 ring-primary ring-inset"
            style={{ left: `${frame.left * 100}%`, width: `${frame.width * 100}%` }}
          />
        </div>
        {PIANO_LAYOUT.keys
          .filter((key) => dots.has(key.midi))
          .map((key) => (
            <span
              key={key.midi}
              className="absolute bottom-0 size-1 -translate-x-1/2 rounded-full bg-key-scale"
              style={{ left: `${key.left + key.width / 2}%` }}
            />
          ))}
      </div>
    </div>
  )
}
```

`PianoKeyboard.tsx`, whole:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  cn,
  PIANO_LAYOUT,
  scrollByOctave,
  spanOf,
  useMediaQuery,
  type KeySize,
  type NamedKeys,
  type Swipe,
} from '@/shared/lib'
import { isBlackKey, midi, octaveOf, PIANO, pitchClass, plainSpelling, type KeyRange, type Midi } from '@/shared/lib/music'
import { FingerRow } from './FingerRow'
import { Key } from './Key'
import { KeyboardMap } from './KeyboardMap'
import { keyLook, type KeyStates } from './key-look'
import { RailButton } from './RailButton'
import { useKeyPointers } from './use-key-pointers'
import { useKeyboardScroll } from './use-keyboard-scroll'

/** Fit's white keys: never narrower than this, so they stay tappable; past it the keyboard scrolls… */
const MIN_WHITE_PX = 28
/** …nor wider than this: a wide screen shows the neighbouring keys instead. */
const MAX_WHITE_PX = 48
/** Large keys: about an octave in view on a phone. */
const LARGE_WHITE_PX = 56
/** A key is this many times as long as a white key is wide (a piano's proportion)… */
const KEY_LENGTH = 4.2
/** …never shorter than this… */
const MIN_KEYS_PX = 96
/** …nor taller than this share of the screen's height. */
const MAX_KEYS_DVH = 40

/** A white key's width for each key size, as CSS in the scroller's container units. */
const WHITE_WIDTH: Readonly<Record<KeySize, (whitesInRange: number) => string>> = {
  fit: (whites) => `clamp(${MIN_WHITE_PX}px, 100cqw / ${whites}, ${MAX_WHITE_PX}px)`,
  large: () => `${LARGE_WHITE_PX}px`,
  piano: () => `calc(100cqw / ${PIANO_LAYOUT.whites})`,
}

// MOVES as now

/**
 * The one keyboard (spec §8): the whole piano hung from its rail, scrolling sideways, its `range`
 * filling the width at Fit. A group named "Keyboard" whose keys are buttons named by note, one of
 * them in the tab order; the arrow keys walk the rest. A key plays the instant it is touched; a
 * swipe scrolls or plays a glissando.
 */
export function PianoKeyboard({
  range,
  inView,
  selectable = false,
  keySize = 'fit',
  swipe = 'scroll',
  namedKeys = 'c',
  map = false,
  letters,
  height = 'proportional',
  onKeyPress,
  className,
  children,
  ...states
}: KeyStates & {
  /** The keys that fill the keyboard's width at Fit; the rest of the piano scrolls in beside them. */
  range: KeyRange
  /** Keys to keep in sight: it opens centred on them (else on its range) and scrolls to them when out of sight. */
  inView?: KeyRange | undefined
  /** The keys are toggles (a quiz's keys to choose), and say whether they are chosen. */
  selectable?: boolean
  keySize?: KeySize
  swipe?: Swipe
  namedKeys?: NamedKeys
  /** The keyboard map in the rail. */
  map?: boolean
  /** The computer keyboard's letters on the keys it plays. */
  letters?: ReadonlyMap<Midi, string> | undefined
  /** 'proportional': the keys a piano's length for their width; 'fill': the height it is given (the Player). */
  height?: 'proportional' | 'fill'
  /** Every key does something: a key that did nothing would be a dead end. */
  onKeyPress: (key: Midi) => void
  className?: string
  /** The rail's trailing controls: `RailButton`s. */
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  const scroller = useRef<HTMLDivElement>(null)
  const keys = useRef<HTMLDivElement>(null)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [tabStop, setTabStop] = useState<Midi>(range.from)
  const { from, to } = range
  const span = useMemo(() => spanOf(PIANO_LAYOUT.keys, { from, to }), [from, to])
  useKeyboardScroll(scroller, PIANO_LAYOUT.keys, span, inView)

  // Keys hold one handler for good, so they re-render only when their own look changes.
  const latestPress = useRef(onKeyPress)
  useLayoutEffect(() => {
    latestPress.current = onKeyPress
  })
  const press = useCallback((key: Midi) => latestPress.current(key), [])
  const pointers = useKeyPointers({ swipe, keys, onPress: press })

  const down = useMemo(
    () =>
      pointers.pressed.size === 0
        ? states.down
        : new Set([...(states.down ?? []), ...pointers.pressed]),
    [states.down, pointers.pressed],
  )
  const dots = useMemo(
    () => new Set([...(states.marks?.keys() ?? []), ...(down ?? [])]),
    [states.marks, down],
  )
  const scrolls = keySize !== 'piano'
  const white = WHITE_WIDTH[keySize](span.whites)

  const step = (by: -1 | 1) => {
    const element = scroller.current
    if (!element || element.scrollWidth <= element.clientWidth) return
    element.scrollTo({
      left: scrollByOctave(element, PIANO_LAYOUT.whites, by),
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  const nameOf = (key: Midi) => {
    const spelled = plainSpelling(pitchClass(key), true)
    return t(isBlackKey(key) ? 'note.sharp' : 'note.natural', {
      letter: spelled.letter,
      octave: octaveOf(key),
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = MOVES[event.key]?.(tabStop)
    if (next === undefined) return
    event.preventDefault()
    setTabStop(next)
    scroller.current?.querySelector<HTMLButtonElement>(`[data-midi="${next}"]`)?.focus()
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="relative flex h-11 shrink-0 items-end">
        {/* The rail itself, drawn along the strip's foot: the buttons' targets reach above it. */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-7 rounded-t-sm bg-key-rail" />
        {scrolls ? (
          <RailButton label={t('rail.octaveDown')} icon={ChevronLeft} onClick={() => step(-1)} />
        ) : null}
        <div className="relative flex min-w-0 flex-1">
          {map && scrolls ? <KeyboardMap scroller={scroller} dots={dots} /> : null}
        </div>
        {scrolls ? (
          <RailButton label={t('rail.octaveUp')} icon={ChevronRight} onClick={() => step(1)} />
        ) : null}
        {children}
      </div>
      <div
        ref={scroller}
        className={cn(
          '@container flex overflow-x-auto overscroll-x-contain scrollbar-none',
          height === 'fill' ? 'min-h-0 flex-1' : null,
        )}
      >
        <div
          className="flex shrink-0 flex-col"
          style={{ width: `calc(${PIANO_LAYOUT.whites} * ${white})` }}
        >
          <div
            ref={keys}
            role="group"
            aria-label={t('keyboard')}
            onKeyDown={onKeyDown}
            {...pointers.group}
            className={cn(
              'relative bg-key-bed select-none',
              swipe === 'glissando' ? 'touch-none' : 'touch-manipulation',
              height === 'fill' ? 'min-h-0 flex-1' : 'shrink-0',
            )}
            style={
              height === 'proportional'
                ? { height: `clamp(${MIN_KEYS_PX}px, calc(${white} * ${KEY_LENGTH}), ${MAX_KEYS_DVH}dvh)` }
                : undefined
            }
          >
            {PIANO_LAYOUT.keys.map((key) => (
              <Key
                key={key.midi}
                geometry={key}
                name={nameOf(key.midi)}
                look={keyLook(key.midi, { ...states, down }, { namedKeys, letters })}
                chosen={selectable ? (states.selected?.has(key.midi) ?? false) : undefined}
                tabStop={key.midi === tabStop}
                onPointerPress={pointers.pointerDown}
                onClickPress={pointers.click}
                onFocusKey={setTabStop}
              />
            ))}
            {/* The rail's shade on the keys. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2 bg-linear-to-b from-key-shade to-transparent"
            />
          </div>
          {scrolls ? <FingerRow marks={states.marks} /> : null}
        </div>
      </div>
    </div>
  )
}
```

`tokens.css` adds `--key-rail: var(--p-ink-950);` (`:root`) and `--key-rail: var(--p-night-990);` (dark), and
`theme.css` `--color-key-rail`. `piano-keyboard/index.ts` and `shared/ui/index.ts` export `RailButton`. `common`:

```ts
  keyboard: 'Keyboard',
  // The keyboard's rail: its buttons and its map.
  rail: {
    octaveDown: 'Octave down',
    octaveUp: 'Octave up',
    map: 'Keys in view',
    mapRange: '{{from}} to {{to}}',
  },
```

and in Russian `rail: { octaveDown: 'Октава вниз', octaveUp: 'Октава вверх', map: 'Клавиши на экране', mapRange:
'{{from}} – {{to}}' }`.

The keys now take a piano's length for their width, so every screen drops its fixed height: `ExplorerKeyboard`'s
and the quiz board's `className="h-44"`, Symbols' and the Piece's `className="h-32"`. The Player's keyboard, which
shares its screen, passes `height="fill"` and keeps its layout classes. `grep -rn "h-32\|h-44" src/pages src/widgets
src/features` finds nothing.

- [ ] **Step 5: Run them and see them pass**, then the whole check and `npm run build`. Every screen's tests pass
      unchanged: they tap keys with `user.click`, which is one press.
- [ ] **Step 6: Commit:** "Play a key on touch, scroll or play a glissando, size the keys like a piano, and hang them
      from a rail with ‹ ›, the map and the fingers".

### Task 6: `LiveKeyboard`: the settings, spotlight, typing, the settings popover

**Files:**

- Create: `src/features/live-keyboard/ui/{KeyboardSettingsFields.tsx,KeyboardSettingsButton.tsx}`,
  `src/features/live-keyboard/model/use-typing.ts`
- Modify: `src/features/live-keyboard/{index.ts,ui/LiveKeyboard.tsx}`, `src/shared/i18n/locales/{en,ru}/common.ts`
- Create (tests' set-up): `src/features/live-keyboard/testing/render-live-keyboard.tsx`
- Test: `src/features/live-keyboard/ui/{LiveKeyboard.test.tsx,KeyboardSettingsButton.test.tsx}`,
  `src/features/live-keyboard/model/use-typing.test.tsx`, `src/widgets/quiz-board/ui/QuizBoard.test.tsx`

**Consumes:** Tasks 1–5. **Produces:** `LiveKeyboard`'s `spotlight` prop (and its props without `down`, `quiet`,
`keySize`, `swipe`, `namedKeys`, `map`, `letters`, `children`); `KeyboardSettingsFields` (exported).

`LiveKeyboard` now reads the settings store, so every test that renders it outside `renderApp` gains one:
`QuizBoard.test.tsx` renders through `renderWithSettings`, and the live keyboard's own three test files share one
set-up, which builds its store from the entity (a slice's `testing/` module imports nothing from `app/`, as
`entities/piece/testing` does not).

- [ ] **Step 1: Write the failing tests.** `testing/render-live-keyboard.tsx`:

```tsx
import { render } from '@testing-library/react'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { KeyMark } from '@/shared/ui'
import { LiveKeyboard } from '../ui/LiveKeyboard'

export const ONE_OCTAVE = { from: midi(60), to: midi(71) }

/** A live keyboard over C4–B4 with fake audio and MIDI, a fresh settings store, and a text field beside it. */
export function renderLiveKeyboard({
  onKeyPress,
  spotlight = false,
  marks,
}: { onKeyPress?: (key: Midi) => void; spotlight?: boolean; marks?: ReadonlyMap<Midi, KeyMark> } = {}) {
  const audio = createFakeAudio()
  const midiKeyboard = createFakeMidi()
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  render(
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio, midi: midiKeyboard }}>
        <LiveKeyboard
          range={ONE_OCTAVE}
          spotlight={spotlight}
          marks={marks}
          {...(onKeyPress ? { onKeyPress } : {})}
        />
        <input aria-label="Search" />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { audio, midiKeyboard, settingsStore }
}
```

`LiveKeyboard.test.tsx` uses it as `setUp` (with `const C_MAJOR = new Map<Midi, KeyMark>([60, 64, 67].map((key) =>
[midi(key), { tone: 'root', label: '1' }]))`):

The three tests stay, and these join:

```tsx
it('sounds a tapped key at once, from the audio clock’s now', async () => {
  const user = userEvent.setup()
  const { audio } = setUp()
  audio.setNow(2)
  await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
  expect(audio.played.at(-1)?.at).toBe(2)
})

it('is set up as the keyboard settings say', () => {
  const { settingsStore } = setUp()
  act(() => setKeyboard(settingsStore, { keySize: 'piano', namedKeys: 'none' }))
  expect(screen.queryByRole('button', { name: 'Octave up' })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'C4' }).textContent).toBe('')
})

it('with spotlight, puts down only the key struck last and holds the other marks back', () => {
  const { audio } = setUp({ spotlight: true, marks: C_MAJOR })
  act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: true }), 0))
  act(() => audio.setNow(0.5))
  const [c, e, g] = ['C4', 'E4', 'G4'].map((name) => screen.getByRole('button', { name }))
  expect(g).toHaveAttribute('data-down')
  expect(g).not.toHaveAttribute('data-quiet')
  for (const key of [c, e]) {
    expect(key).not.toHaveAttribute('data-down')
    expect(key).toHaveAttribute('data-quiet')
  }
  act(() => audio.setNow(3))
  expect(c).not.toHaveAttribute('data-quiet')
})

it('without spotlight, puts every sounding key down and holds nothing back', () => {
  const { audio } = setUp({ marks: C_MAJOR })
  act(() => void audio.play(chordSounds([60, 64, 67].map(midi), { arpeggio: true }), 0))
  act(() => audio.setNow(0.5))
  expect(screen.getByRole('button', { name: 'E4' })).toHaveAttribute('data-down')
  expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-quiet')
})
```

`use-typing.test.tsx`, through the keyboard (the hook's surface is what the learner meets):

```tsx
function typingKeyboard(onKeyPress = vi.fn()) {
  const set = setUp({ onKeyPress })
  act(() => setKeyboard(set.settingsStore, { typing: true }))
  return { ...set, onKeyPress }
}

it('plays the key a letter stands for, as a tap does, and letters the keys it plays', async () => {
  const user = userEvent.setup()
  const { audio, onKeyPress } = typingKeyboard()
  await user.keyboard('a')
  expect(audio.played.at(-1)?.sounds).toMatchObject([{ kind: 'note', midi: 60 }])
  expect(onKeyPress).toHaveBeenCalledWith(60)
  expect(screen.getByRole('button', { name: 'C4' })).toHaveTextContent('A')
})

it('moves an octave up with X', async () => {
  const user = userEvent.setup()
  const { onKeyPress } = typingKeyboard()
  await user.keyboard('xa')
  expect(onKeyPress).toHaveBeenCalledWith(72)
})

it('plays nothing on auto-repeat, with Cmd held, or into a text field', async () => {
  const user = userEvent.setup()
  const { onKeyPress } = typingKeyboard()
  fireEvent.keyDown(window, { code: 'KeyA', key: 'a', repeat: true })
  await user.keyboard('{Meta>}a{/Meta}')
  await user.click(screen.getByRole('textbox', { name: 'Search' }))
  await user.keyboard('a')
  expect(onKeyPress).not.toHaveBeenCalled()
  expect(screen.getByRole('textbox', { name: 'Search' })).toHaveValue('a')
})

it('keeps a key it plays from the browser (Firefox’s Quick Find on ’)', () => {
  typingKeyboard()
  const quote = createEvent.keyDown(window, { code: 'Quote', key: "'" })
  fireEvent(window, quote)
  expect(quote.defaultPrevented).toBe(true)
})

it('shows the typing octave after X, until the screen’s own keys in view change', async () => {
  const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
  const user = userEvent.setup()
  typingKeyboard()
  const opened = scrolls.length
  await user.keyboard('x')
  // C5–F6 was out of sight: the keyboard scrolls to it.
  expect(scrolls.length).toBeGreaterThan(opened)
})

it('plays nothing while typing is off', async () => {
  const user = userEvent.setup()
  const onKeyPress = vi.fn()
  setUp({ onKeyPress })
  await user.keyboard('a')
  expect(onKeyPress).not.toHaveBeenCalled()
})
```

`KeyboardSettingsButton.test.tsx`:

```tsx
it('opens the keyboard settings from the rail and saves each change', async () => {
  const user = userEvent.setup()
  const { settingsStore } = setUp()
  await user.click(screen.getByRole('button', { name: 'Keyboard settings' }))
  const popover = await screen.findByRole('dialog', { name: 'Keyboard settings' })
  await user.click(within(popover).getByRole('button', { name: 'Large' }))
  await user.click(within(popover).getByRole('button', { name: 'Glissando' }))
  await user.click(within(popover).getByRole('button', { name: 'All' }))
  await user.click(within(popover).getByRole('switch', { name: 'Keyboard map' }))
  await user.click(within(popover).getByRole('switch', { name: /Play from the computer keyboard/ }))
  expect(settingsStore.getState().keyboard).toEqual({
    keySize: 'large',
    swipe: 'glissando',
    namedKeys: 'all',
    map: true,
    typing: true,
  })
  expect(within(popover).getByText('Z X · octave')).toBeInTheDocument()
  expect(screen.getByRole('slider', { name: 'Keys in view' })).toBeInTheDocument()
})
```

(`setUp` is `renderLiveKeyboard` in all three files). `QuizBoard.test.tsx`'s `renderBoard` renders through
`renderWithSettings`.

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/features/live-keyboard src/widgets/quiz-board`.
- [ ] **Step 3: Write the code.** `model/use-typing.ts`:

```ts
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  moveTypingOctave,
  OCTAVE_DOWN,
  OCTAVE_UP,
  TYPING_START,
  typedKey,
  typingLetters,
} from '@/shared/lib'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'

/** Where a key typed goes into a field: nothing plays there. */
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

const sameRange = (a: KeyRange | undefined, b: KeyRange | undefined) =>
  a?.from === b?.from && a?.to === b?.to

/**
 * The computer keyboard as a piano, read by physical key (GarageBand's Musical Typing). A typed key
 * calls `onKey`, as a tap does; Z and X move the typing octave, and the keyboard shows it until the
 * screen's own keys in view change. Nothing plays from a text field, with Ctrl, Cmd or Alt held, or
 * on auto-repeat; a key that plays is not also the browser's.
 */
export function useTyping({
  enabled,
  onKey,
  inView,
}: {
  enabled: boolean
  onKey: (key: Midi) => void
  inView: KeyRange | undefined
}): { letters: ReadonlyMap<Midi, string> | undefined; inView: KeyRange | undefined } {
  const [typingC, setTypingC] = useState(TYPING_START)
  /** The screen's keys in view when Z or X last moved the octave: the octave shows until they change. */
  const [movedOver, setMovedOver] = useState<{ readonly view: KeyRange | undefined } | null>(null)
  const latest = useRef({ onKey, inView, typingC })
  useLayoutEffect(() => {
    latest.current = { onKey, inView, typingC }
  })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return
      if (event.code === OCTAVE_DOWN || event.code === OCTAVE_UP) {
        event.preventDefault()
        const by = event.code === OCTAVE_UP ? 1 : -1
        setTypingC((c) => moveTypingOctave(c, by))
        setMovedOver({ view: latest.current.inView })
        return
      }
      const key = typedKey(event.code, latest.current.typingC)
      if (key === null) return
      event.preventDefault()
      latest.current.onKey(key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])

  const letters = useMemo(() => typingLetters(typingC), [typingC])
  const followsTyping = enabled && movedOver !== null && sameRange(movedOver.view, inView)
  return {
    letters: enabled ? letters : undefined,
    inView: followsTyping ? rangeOf([...letters.keys()]) : inView,
  }
}
```

`ui/LiveKeyboard.tsx`:

```tsx
import { useMemo, type ComponentProps } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { rangeOf, type Midi } from '@/shared/lib/music'
import { useSoundingKeys, useSoundKey } from '@/shared/lib/services'
import { PianoKeyboard } from '@/shared/ui'
import { useTyping } from '../model/use-typing'
import { KeyboardSettingsButton } from './KeyboardSettingsButton'

const NONE: ReadonlySet<Midi> = new Set()

/**
 * The keyboard every screen shows, set up as the learner chose (the keyboard settings): a key goes
 * down while the app sounds it or a MIDI keyboard holds it, and a tapped or typed key sounds before
 * it does whatever else the screen makes it mean. Unless the screen says which keys to keep in
 * sight, it follows the keys that are down. With `spotlight`, the keys down are the ones struck
 * last, and the other marked keys go quiet while any key is struck.
 */
export function LiveKeyboard({
  onKeyPress,
  inView,
  spotlight = false,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  'down' | 'quiet' | 'keySize' | 'swipe' | 'namedKeys' | 'map' | 'letters' | 'children' | 'onKeyPress'
> & {
  /** What a tap means besides its sound: a quiz's choice, Wait mode's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** The explorers' keyboards: the key struck last stands out alone. */
  spotlight?: boolean
}) {
  const { typing, ...settings } = useSettings(selectKeyboard)
  const sounding = useSoundingKeys(spotlight ? 'struck' : 'sounding')
  const held = useHeldKeys()
  const soundKey = useSoundKey()
  const down = useMemo(
    () => (held.size === 0 ? sounding : new Set([...sounding, ...held])),
    [sounding, held],
  )
  const { marks } = keyboard
  const quiet = useMemo(
    () =>
      spotlight && sounding.size > 0 && marks
        ? new Set([...marks.keys()].filter((key) => !sounding.has(key)))
        : NONE,
    [spotlight, sounding, marks],
  )
  const downRange = useMemo(() => rangeOf([...down]), [down])
  const play = (key: Midi) => {
    soundKey(key)
    onKeyPress?.(key)
  }
  const typed = useTyping({ enabled: typing, onKey: play, inView: inView ?? downRange })
  return (
    <PianoKeyboard
      {...keyboard}
      {...settings}
      inView={typed.inView}
      down={down}
      quiet={quiet}
      letters={typed.letters}
      onKeyPress={play}
    >
      <KeyboardSettingsButton />
    </PianoKeyboard>
  )
}
```

`ui/KeyboardSettingsFields.tsx` (exported from the slice's `index.ts` for Settings):

```tsx
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_SIZES, NAMED_KEYS, SWIPES } from '@/shared/lib'
import { Segmented } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

/** The keyboard settings, saved for every keyboard: in the rail's popover and in Settings. */
export function KeyboardSettingsFields() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <div className="flex flex-col gap-4">
      <Field label={t('keyboardSettings.keySize.label')}>
        <Segmented
          label={t('keyboardSettings.keySize.label')}
          value={keyboard.keySize}
          options={KEY_SIZES.map((value) => ({ value, label: t(`keyboardSettings.keySize.${value}`) }))}
          onChange={(keySize) => setKeyboard(store, { keySize })}
        />
      </Field>
      <Field label={t('keyboardSettings.swipe.label')}>
        <Segmented
          label={t('keyboardSettings.swipe.label')}
          value={keyboard.swipe}
          options={SWIPES.map((value) => ({ value, label: t(`keyboardSettings.swipe.${value}`) }))}
          onChange={(swipe) => setKeyboard(store, { swipe })}
        />
      </Field>
      <Field label={t('keyboardSettings.namedKeys.label')}>
        <Segmented
          label={t('keyboardSettings.namedKeys.label')}
          value={keyboard.namedKeys}
          options={NAMED_KEYS.map((value) => ({ value, label: t(`keyboardSettings.namedKeys.${value}`) }))}
          onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
        />
      </Field>
      <div>
        <label className="flex min-h-14 items-center justify-between gap-4 border-b border-border">
          {t('keyboardSettings.map')}
          <Switch checked={keyboard.map} onCheckedChange={(map) => setKeyboard(store, { map })} />
        </label>
        <label className="flex min-h-14 items-center justify-between gap-4">
          <span className="flex flex-col">
            {t('keyboardSettings.typing')}
            {keyboard.typing ? (
              <span className="text-sm text-muted-foreground">{t('keyboardSettings.typingHint')}</span>
            ) : null}
          </span>
          <Switch
            checked={keyboard.typing}
            onCheckedChange={(typing) => setKeyboard(store, { typing })}
          />
        </label>
      </div>
    </div>
  )
}
```

`ui/KeyboardSettingsButton.tsx`:

```tsx
import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RailButton } from '@/shared/ui'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { KeyboardSettingsFields } from './KeyboardSettingsFields'

/** The rail's settings button: the keyboard settings in a popover, over the keys being played. */
export function KeyboardSettingsButton() {
  const { t } = useTranslation('common')
  return (
    <Popover>
      <PopoverTrigger render={<RailButton label={t('rail.settings')} icon={SlidersHorizontal} />} />
      <PopoverContent className="w-80 p-4">
        <PopoverHeader>
          <PopoverTitle>{t('rail.settings')}</PopoverTitle>
        </PopoverHeader>
        <KeyboardSettingsFields />
      </PopoverContent>
    </Popover>
  )
}
```

`common` gains `rail.settings: 'Keyboard settings'` / «Настройки клавиатуры» and:

```ts
  keyboardSettings: {
    keySize: { label: 'Keys', fit: 'Fit', large: 'Large', piano: 'Whole piano' },
    swipe: { label: 'Swipe', scroll: 'Scroll', glissando: 'Glissando' },
    namedKeys: { label: 'Note names', c: 'C', all: 'All', none: 'None' },
    map: 'Keyboard map',
    typing: 'Play from the computer keyboard',
    typingHint: 'Z X · octave',
  },
```

In Russian: `keySize: { label: 'Клавиши', fit: 'По ширине', large: 'Крупные', piano: 'Весь рояль' }`, `swipe: {
label: 'Свайп', scroll: 'Прокрутка', glissando: 'Глиссандо' }`, `namedKeys: { label: 'Названия нот', c: 'C', all:
'Все', none: 'Нет' }`, `map: 'Карта клавиатуры'`, `typing: 'Играть с клавиатуры компьютера'`, `typingHint: 'Z X ·
октава'`.

- [ ] **Step 4: Run them and see them pass**, then the whole check and `npm run build`.
- [ ] **Step 5: Commit:** "Keep the keyboard settings, spotlight the key struck last, and play from the computer
      keyboard".

### Task 7: Stop on every Play: Chords, Scales, Symbols

**Files:**

- Modify: `src/features/live-keyboard/ui/ExplorerKeyboard.tsx`, `src/widgets/chord-explorer/ui/ChordExplorer.tsx`,
  `src/widgets/scale-explorer/{model/scale-view.ts,ui/ScaleExplorer.tsx,ui/ScaleChords.tsx}`,
  `src/app/routes/search.ts`, `src/pages/theory-symbols/ui/{TheorySymbolsPage.tsx,QualityRow.tsx}`,
  `src/shared/lib/services/{use-play.ts,index.ts}`, `src/shared/i18n/locales/{en,ru}/{common.ts,theory.ts}`
- Test: `src/pages/theory-chords/ui/TheoryChordsPage.test.tsx`, `src/pages/theory-scales/ui/TheoryScalesPage.test.tsx`,
  `src/pages/theory-symbols/ui/TheorySymbolsPage.test.tsx`, `src/app/routes/search.test.ts`,
  `src/shared/lib/services/use-play.test.tsx`

**Consumes:** `usePlayback`, `placedChordSounds`, `LiveKeyboard`'s `spotlight`, `KeyMark.finger`.

A single action's button changes its name to **Stop** (with the `Square` icon) while its sound plays. A button in a
grid of items (a scale's chords here, a Piece's bars in Task 8) is a toggle instead: `aria-pressed` while it plays,
its name kept.

- [ ] **Step 1: Write the failing tests.** Chords:

```tsx
it('turns Play into Stop while the chord sounds, and back when it ends', async () => {
  const user = userEvent.setup()
  const { audio } = await renderApp('/theory/chords')
  await user.click(await screen.findByRole('button', { name: 'Play' }))
  const start = audio.played.at(-1)?.at ?? 0
  expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  act(() => audio.setNow(start + 1.7))
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
})

it('stops the chord on Stop, and Arpeggio takes over from Play', async () => {
  const user = userEvent.setup()
  const { audio } = await renderApp('/theory/chords')
  await user.click(await screen.findByRole('button', { name: 'Play' }))
  await user.click(screen.getByRole('button', { name: 'Arpeggio' }))
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  const stops = audio.stops
  await user.click(screen.getByRole('button', { name: 'Stop' }))
  expect(audio.stops).toBe(stops + 1)
  expect(screen.getByRole('button', { name: 'Arpeggio' })).toBeInTheDocument()
})
```

'rolls an arpeggio, its keys going down one by one' becomes "…the key struck last down alone, the others quiet": at
`start + 0.5` G4 is down, E4 and C4 are not down and are `data-quiet`; at `start + 3` nothing is quiet. Scales:

```tsx
it('colours the scale’s keys whole: the tonic deep, the others light', async () => {
  await renderApp('/theory/scales')
  const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
  expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
  expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveClass('bg-key-scale')
})

it('puts a hand’s fingers under the keys, which keep their degrees', async () => {
  const user = userEvent.setup()
  const { router } = await renderApp('/theory/scales')
  await user.click(await screen.findByRole('button', { name: 'Right hand' }))
  expect(router.state.location.search).toMatchObject({ fingers: 'rh' })
  const keyboard = screen.getByRole('group', { name: 'Keyboard' })
  expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('4')
  expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
})

it('stops the run on Stop', async () => {
  const user = userEvent.setup()
  const { audio } = await renderApp('/theory/scales')
  await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
  await user.click(screen.getByRole('button', { name: 'Stop' }))
  expect(audio.stops).toBeGreaterThan(0)
  expect(screen.getByRole('button', { name: 'Play up and down' })).toBeInTheDocument()
})

it('presses a chord of the scale while it sounds', async () => {
  const user = userEvent.setup()
  const { audio } = await renderApp('/theory/scales')
  const dm = await screen.findByRole('button', { name: /^Dm/ })
  await user.click(dm)
  expect(dm).toHaveAttribute('aria-pressed', 'true')
  act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2))
  expect(dm).toHaveAttribute('aria-pressed', 'false')
})
```

The fingers test replaces 'labels the keys with right-hand fingers when asked'. Symbols:

```tsx
it('turns Hear into Stop while the chord sounds', async () => {
  const user = userEvent.setup()
  const { audio } = await renderApp('/theory/symbols')
  const minor = within(await screen.findByRole('region', { name: 'Triads' })).getByRole('listitem', {
    name: 'Minor triad',
  })
  await user.click(within(minor).getByRole('button', { name: 'Hear' }))
  expect(within(minor).getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2))
  expect(within(minor).getByRole('button', { name: 'Hear' })).toBeInTheDocument()
})
```

`search.test.ts`: the Scales defaults and validation read `fingers` (`'none'`, `'rh'` kept, `'x'` → `'none'`, and an
old link's `view=rh` leaves `fingers` at `'none'`). `use-play.test.tsx` drops its `usePlayChord` tests.

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/pages/theory-chords src/pages/theory-scales
      src/pages/theory-symbols src/app/routes`.
- [ ] **Step 3: Write the code.** `ChordExplorer.tsx`: a choice sounds by itself (no button, so no Stop); the two
      buttons are Stop buttons:

```tsx
const play = usePlay()
const playback = usePlayback<'chord' | 'arpeggio'>()
const soundsOf = (view: ChordView, arpeggio: boolean) =>
  placedChordSounds(
    { root: noteFromParam(view.root), quality: view.quality },
    { inversion: view.inversion, bothHands: view.hands === 'both', arpeggio },
  )
const change = (next: Partial<ChordView>) => {
  onChange(next)
  play(soundsOf({ ...chord, ...next }, false))
}
// …
<div className="flex gap-3">
  <Button size="pill" className="flex-1" onClick={() => playback.toggle('chord', soundsOf(chord, false))}>
    {playback.playing === 'chord' ? (
      <>
        <Square data-icon="inline-start" />
        {t('common:stop')}
      </>
    ) : (
      t('theory:play')
    )}
  </Button>
  <Button
    size="pill"
    variant="soft"
    className="flex-1"
    onClick={() => playback.toggle('arpeggio', soundsOf(chord, true))}
  >
    {playback.playing === 'arpeggio' ? (
      <>
        <Square data-icon="inline-start" />
        {t('common:stop')}
      </>
    ) : (
      t('theory:arpeggio')
    )}
  </Button>
</div>
```

`scale-view.ts`: `/** The fingers under the keys: none, or one hand's. */ readonly fingers: 'none' | 'rh' | 'lh'` in
place of `view`. `search.ts`: `SCALES_DEFAULTS.fingers = 'none'`, `const isScaleFingers =
isOneOf<ScaleView['fingers']>(['none', 'rh', 'lh'])`, `fingers: valueOr(isScaleFingers, raw.fingers,
SCALES_DEFAULTS.fingers)`. `ScaleExplorer.tsx`:

```tsx
/** The Fingers choice: none, or a hand's, with the name each has on screen. */
const FINGERS = [
  { value: 'none', label: 'theory:fingers.none' },
  { value: 'rh', label: 'common:hands.rh' },
  { value: 'lh', label: 'common:hands.lh' },
] as const

// in the component
const playback = usePlayback<'run'>()
const fingering = scale.fingers === 'rh' ? rh : scale.fingers === 'lh' ? lh : null
const marks = new Map<Midi, KeyMark>(
  placed.map((key, i) => {
    const finger = fingering?.[i]
    return [
      key.midi,
      {
        tone: key.tone.role === 'root' ? 'tonic' : 'scale',
        label: key.tone.degree,
        ...(finger === undefined ? {} : { finger }),
      },
    ]
  }),
)
// the switch shows only for a scale with a fingering
{rh && lh ? (
  <Segmented
    label={t('theory:fingers.label')}
    value={scale.fingers}
    options={FINGERS.map(({ value, label }) => ({ value, label: t(label) }))}
    onChange={(fingers) => onChange({ fingers })}
  />
) : null}
// Play up and down
<Button size="pill" onClick={() => playback.toggle('run', run)}>
  {playback.playing === 'run' ? (
    <>
      <Square data-icon="inline-start" />
      {t('common:stop')}
    </>
  ) : (
    t('theory:playUpDown')
  )}
</Button>
```

`ScaleChords.tsx`: `const playback = usePlayback<string>()`; each chord button is a toggle:

```tsx
<Button
  key={roman}
  variant="outline"
  aria-pressed={playback.playing === roman}
  className="relative h-16 flex-col gap-0 aria-pressed:bg-muted aria-pressed:text-primary"
  onClick={() => playback.toggle(roman, placedChordSounds(chord))}
>
  {playback.playing === roman ? (
    <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" />
  ) : null}
  <span className="text-lg font-bold">{chordSymbol(chord)}</span>
  <span className="text-sm text-muted-foreground">{roman}</span>
</Button>
```

`QualityRow.tsx`: `const playback = usePlayback<'hear'>()`; Hear is `playback.toggle('hear', placedChordSounds({
root: C, quality }))`, named `t('common:stop')` while `playback.playing === 'hear'`, else `t('theory:symbols.hear')`
(`useTranslation(['theory', 'common'])`). `TheorySymbolsPage.tsx`: `<LiveKeyboard range={MIDDLE_OCTAVES} spotlight
/>`. `ExplorerKeyboard` passes `spotlight` (Chords and Scales). `use-play.ts` loses `usePlayChord` (its last callers are gone), and `services/index.ts` its
export. `common` gains `stop: 'Stop'` / `'Стоп'`; `theory`'s `view` becomes `fingers: { label: 'Fingers', none: 'None'
}` / `{ label: 'Аппликатура', none: 'Нет' }`.

- [ ] **Step 4: Run them and see them pass**, then the whole check and `npm run build`. `grep -rn "usePlayChord\|view:
      'degrees'\|theory:view" src` finds nothing.
- [ ] **Step 5: Commit:** "Stop every Play on Chords, Scales and Symbols, colour a scale's keys whole and put its
      fingers under the keys".

### Task 8: The Piece, the quiz, the Player and Settings

**Files:**

- Modify: `src/widgets/chord-chart/ui/{ChordChart.tsx,BarButton.tsx}`, `src/pages/piece/ui/PieceView.tsx`,
  `src/features/quiz/use-quiz.ts`, `src/widgets/quiz-board/ui/QuizBoard.tsx`, `src/pages/player/model/use-player.ts`,
  `src/pages/player/ui/{PlayerPage.tsx,Transport.tsx}`, `src/features/practice/marks.ts`,
  `src/pages/settings/ui/SettingsPage.tsx`, `src/shared/i18n/locales/{en,ru}/settings.ts`
- Test: `src/widgets/chord-chart/ui/ChordChart.test.tsx`, `src/pages/piece/ui/PiecePage.test.tsx`,
  `src/features/quiz/use-quiz.test.tsx`, `src/widgets/quiz-board/ui/QuizBoard.test.tsx`,
  `src/pages/player/{model/use-player.test.tsx,ui/PlayerPage.test.tsx}`, `src/features/practice/marks.test.ts`,
  `src/pages/settings/ui/SettingsPage.test.tsx`

**Consumes:** `usePlayback`, `LiveKeyboard`'s `spotlight`, `KeyboardSettingsFields`, `KeyMark.finger`.
**Produces:** `ChordChart`'s `playing?: number | null`; `BarButton`'s `pressed?: boolean`; `Quiz.hearing`;
`Player.hearing`.

- [ ] **Step 1: Write the failing tests.**

```tsx
// PiecePage.test.tsx
it('plays a bar as a toggle: pressed while it plays, a second tap stops it', async () => {
  const user = userEvent.setup()
  const { audio } = await renderApp('/songs/bz5')
  const bar = await screen.findByRole('button', { name: /^Bar 1: G$/ })
  await user.click(bar)
  expect(bar).toHaveAttribute('aria-pressed', 'true')
  const stops = audio.stops
  await user.click(bar)
  expect(audio.stops).toBe(stops + 1)
  expect(bar).toHaveAttribute('aria-pressed', 'false')
})

// ChordChart.test.tsx
it('makes its bars toggles where a bar plays, and leaves the Player’s bars plain', () => {
  const { rerender } = render(<ChordChart {...props} layout="lines" playing={0} onBar={() => {}} />)
  expect(screen.getByRole('button', { name: /^Bar 1/ })).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('button', { name: /^Bar 2/ })).toHaveAttribute('aria-pressed', 'false')
  rerender(<ChordChart {...props} layout="strip" current={0} onBar={() => {}} />)
  expect(screen.getByRole('button', { name: /^Bar 1/ })).not.toHaveAttribute('aria-pressed')
})

// QuizBoard.test.tsx
it('turns Play again into Stop while the question sounds', async () => {
  const user = userEvent.setup()
  renderBoard({ chordMode: 'name-chord', scope: { skills: ['chord:maj'], roots: C } })
  await user.click(screen.getByRole('button', { name: 'Play again' }))
  expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Stop' }))
  expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument()
})

// PlayerPage.test.tsx
it('turns Hear these notes into Stop while they sound, in Wait mode', async () => {
  const user = userEvent.setup()
  await renderApp('/play/bz5?mode=wait')
  await user.click(await screen.findByRole('button', { name: 'Hear these notes' }))
  expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
})

it('puts the fingers under the keys with Finger numbers, the keys keeping their notes', async () => {
  const { settingsStore } = await renderApp('/play/bz5?mode=step')
  await screen.findByRole('group', { name: 'Keyboard' })
  expect(document.querySelector('[data-slot="finger-row"]')).not.toBeInTheDocument()
  act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
  expect(document.querySelector('[data-slot="finger-row"]')).toBeInTheDocument()
})

// SettingsPage.test.tsx
it('sets up the keyboard, and saves each change', async () => {
  const user = userEvent.setup()
  const { settingsStore } = await renderApp('/settings')
  const keys = await screen.findByRole('group', { name: 'Keys' })
  await user.click(within(keys).getByRole('button', { name: 'Large' }))
  await user.click(screen.getByRole('switch', { name: 'Keyboard map' }))
  expect(settingsStore.getState().keyboard).toMatchObject({ keySize: 'large', map: true })
})
```

(The Finger numbers test drives the saved switch through its command; `arrange` fingers every note, so the first
beat group has fingers.) `marks.test.ts`:
with `fingers: true`, a mark keeps its note name as `label` and carries `finger`; without, no `finger`.
`use-quiz.test.tsx` and `use-player.test.tsx`: `hear` twice stops, and `hearing` follows. 'groups each choice under
its own heading' also finds the Keyboard group between Theme and MIDI keyboard.

- [ ] **Step 2: Run them and see them fail:** `npx vitest run src/widgets src/pages src/features/quiz
      src/features/practice`.
- [ ] **Step 3: Write the code.** `ChordChart.tsx`:

```tsx
  /**
   * The bar sounding, where a tap plays a bar (the Piece): every bar is then a toggle, pressed while
   * it plays. Left out where a tap moves the cursor (the Player).
   */
  playing?: number | null
// in barOf:
        pressed={playing === undefined ? undefined : playing === index}
```

`BarButton.tsx`: `pressed?: boolean | undefined` → `aria-pressed={pressed}`, styled as `current` (`bg-muted
text-primary`) while pressed, with `<Square aria-hidden className="absolute top-1.5 right-2 size-3" />`.
`PieceView.tsx`:

```tsx
const playback = usePlayback<number>()
const toggleBar = (bar: number) =>
  playback.toggle(bar, barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }))
// …
<LiveKeyboard range={playerRange(performance)} spotlight />
<ChordChart … onBar={toggleBar} playing={playback.playing} />
```

`use-quiz.ts`: `Quiz` gains `/** Play again's sound is playing. */ readonly hearing: boolean`; `hear()` ("Name
chord's Play again: sounds the question's chord, or stops it while it sounds") is
`playback.toggle('question', questionSounds(current))` over `const playback = usePlayback<'question'>()`; `hearing:
playback.playing === 'question'`. The question's own sounding stays `usePlay` (no button). `QuizBoard.tsx`:
`<RoundButton label={quiz.hearing ? t('common:stop') : t('quiz:playAgain')} icon={quiz.hearing ? Square : Volume2}
onClick={quiz.hear} />`, `useTranslation(['quiz', 'theory', 'common'])`.
`use-player.ts`: the same shape (`hearing`, `hear()` toggling `'hear'`). `Transport.tsx` takes `hearing: boolean`:

```tsx
<Button size="pill" variant="soft" className="flex-1" onClick={onHear}>
  {hearing ? <Square data-icon="inline-start" /> : <Volume2 data-icon="inline-start" />}
  {hearing ? t('stop') : t('hear')}
</Button>
```

`PlayerPage.tsx`: `<Transport practice={practice} hearing={player.hearing} onHear={player.hear} />`. `marks.ts`:

```ts
    const label = options.received?.includes(pitchClass(played.midi))
      ? '✓'
      : spellPerformedNote(performance, played).name
    marks.set(played.midi, {
      tone: played.hand,
      label,
      ...(options.fingers && played.finger ? { finger: played.finger } : {}),
    })
```

`SettingsPage.tsx`: `<Group title={t('settings:keyboard')}><KeyboardSettingsFields /></Group>` between Theme and MIDI
keyboard. `settings` gains `keyboard: 'Keyboard'` / `'Клавиатура'`.

- [ ] **Step 4: Run them and see them pass**, then the whole check and `npm run build`.
- [ ] **Step 5: Commit:** "Stop a bar, Play again and Hear these notes, put the Player's fingers under the keys, and
      set the keyboard up in Settings".

### Task 9: Records

**Files:** `DESIGN.md`, `docs/CODE_STYLE.md`, `docs/UBIQUITOUS_LANGUAGE.md`,
`docs/adr/0009-the-keyboard-is-an-instrument.md`, `CLAUDE.md`.

- [ ] **DESIGN.md:** the frontmatter's colours gain `key-rail: '#131816'`, `key-tonic: '#2D6657'`, `key-scale:
      '#8CCBB8'`, and its components `key-tonic` and `key-scale`; "The keyboard (signature)" describes the rail (‹ ›,
      the map, the settings button), the bed, lip and slope, the drop, the proportions and key sizes, the whole-key
      scale fills in place of the band, the finger row's two lines, spotlight, Stop; the No Glow Rule gains its one
      exception (the keys' material).
- [ ] **CODE_STYLE:** §1 the kit gains `RailButton`, and the `LiveKeyboard` bullet says it follows the keyboard
      settings, types, and takes `spotlight` on the explorers; §5 the key tokens replace the band's and
      `--key-white-edge`, and a new rule: "Values worked out at runtime (a key's place, the keys' width and length) go
      in `style`; every fixed value is a token, a utility or a named constant"; §8 `usePlay` returns the play's
      handle, `useSoundKey` plays at now, a Play button is `usePlayback` (no `usePlayChord`), the port says whether a
      play still sounds; §9 `stubBox` and `stubScrolling` (`src/shared/test/layout.ts`) where a pointer's position or
      a scroll matters.
- [ ] **Glossary** (Practice table): **Rail** (the dark fascia the keys hang from, holding ‹ ›, the map and the
      settings button), **Keyboard map** (the rail's strip of all 88 keys, framing the part in view), **Keyboard
      settings** (Keys, Swipe, Note names, Keyboard map, Play from the computer keyboard; `KeyboardSettings`; avoid
      keyboard prefs, options), **Key size** (Fit · Large · Whole piano), **Note names** (`NamedKeys`: C · All ·
      None), **Typing keys** (the computer keyboard as a piano, by physical key), **Spotlight** (on the explorers'
      keyboards only the keys struck last are down and the other marks go quiet), **Struck** (the sounding keys
      struck last), **Finger row** (the fingers in circles under the keys); **Down** becomes "A key sounding now
      (under spotlight, struck last), held on a MIDI keyboard, or pressed by a pointer, drawn pressed".
- [ ] **ADR 0009, "The keyboard is an instrument":** its look is a material (the No Glow Rule's exception); a key plays
      on touch and at the audio clock's now; a swipe scrolls or plays by the learner's choice, with ‹ › for every
      swipe; typing reads physical keys; the audio port hands back a play's handle and says whether it still sounds,
      so a Stop button is local state over the port (extends ADR 0008).
- [ ] **CLAUDE.md:** `settings` (`pt-settings`, version 3); the `shared/lib` list gains `keyboard-choices`,
      `keyboard-view`, `typing-keys`, `PIANO_LAYOUT` and `keyAt`; `services` lists `usePlay`, `usePlayback`,
      `useSoundKey`, `useSoundingKeys` (no `usePlayChord`); `live-keyboard` names `KeyboardSettingsFields`, the
      settings button and typing; the kit gains `RailButton`; Conventions name `stubBox` and `stubScrolling`.
- [ ] `npx prettier --write` on the five files; commit: "Record the playable keyboard".

### Task 10: Verify

- [ ] `npm run typecheck && npm run lint && npm run test && npm run build`; read the output; fix a failure in the task
      it belongs to, as its own commit.
- [ ] `npm run dev`, and at phone width (390) and on a desktop, light and dark: Chords (the rail, ‹ ›, Play → Stop, an
      arpeggio walking with the other keys quiet), Scales (whole-key fills, the finger row's two lines), Symbols (a
      Hear's keys down), a Piece (a bar pressed while it plays), the Player (fill height, fingers in the row), Settings
      (the Keyboard group); a Glissando swipe on a touch screen (DevTools' device mode) and the computer keyboard on a
      desktop; the popover at every key size; `prefers-reduced-motion` (the drop immediate).
