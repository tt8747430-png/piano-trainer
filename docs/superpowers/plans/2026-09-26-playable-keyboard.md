# The playable keyboard: plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (the owner's standing choice: inline, on
> `main`). Steps use checkboxes.

**Goal:** every keyboard plays the instant it is touched, scrolls or glides by the learner's choice, looks and is
proportioned like a piano, shows fingers under the keys, a scale's notes on whole keys and the key sounding now on its
own, and every Play can be stopped.

**Architecture:** pure logic first (`keyAt`, typing keys, struck keys, the map's math, `keyLook`), then the audio
port's `struck()` and a playback tracker in `shared/lib/services`, then `PianoKeyboard` (presentational, owns the
pointer handling, the rail, the map and the finger row), then `LiveKeyboard` (the saved choices, spotlight, typing,
the options popover), then the screens.

**Tech stack:** React 19, TypeScript 6, Tailwind v4 tokens, zustand persist, Vitest 4 + Testing Library + jsdom,
Base UI popover and switch (the kit's primitives).

**Spec:** [`2026-09-25-playable-keyboard-design.md`](../specs/2026-09-25-playable-keyboard-design.md); decisions in
the roadmap's §3.1.

## Global constraints

- Test first (`tdd`); each task ends green on `npm run typecheck && npm run lint && npm run test`, tasks 5–7 also
  `npm run build`; one commit per task on `main`; `npx prettier --write` on the files touched.
- Strict TS, no `any`, no casts, no `eslint-disable`, no arbitrary Tailwind values (a value without a token becomes a
  token in `tokens.css` or a named utility in `theme.css`).
- Every string in `en` and `ru`; note names stay international (C, F♯).
- Saved data keeps working: `pt-settings` version 3 with a sanitising `merge`.
- 44px targets (keys excepted); `prefers-reduced-motion` honoured by `theme.css` already.
- No leftovers: the band tokens (`--key-mark*`), `--key-white-edge`, the fixed keyboard heights and the old
  `view` labels go in the task that replaces them.

## Review focus

1. A swipe in Scroll must not play every key it passes: only the first key sounds, then the browser scrolls
   (pointercancel ends the press). Test: a moved pointer plays nothing more.
2. A pointer press followed by its `click` must not play twice (both modes). Test: one pointer tap, one sound.
3. Two Play buttons on one screen: starting the second turns the first back from Stop. Test: Play then Arpeggio.
4. Typing inside the Songs search field plays nothing. Test: typing in a text input.
5. A version-2 save with no `keyboard` group loads with the defaults, keeping theme and language. Test: the store.

---

### Task 1: Saved keyboard choices

**Files:** create `src/shared/ui/piano-keyboard/options.ts` (exported from `shared/ui`); modify
`src/entities/settings/model/{types.ts,store.ts,selectors.ts}`, `src/entities/settings/index.ts`,
`src/features/set-preference/{index.ts,set-keyboard-prefs.ts}`, `src/app/testing/{render-app.tsx,
render-with-settings.tsx}`; tests `store.test.ts`, `types.test.ts`, `selectors.test.ts`, `set-preference.test.ts`.

The keyboard's options are the presentational keyboard's props, so their values live beside it in `shared/ui` and
the settings entity imports them (entities may import shared; shared may not import entities).

**Produces:**

```ts
// shared/ui/piano-keyboard/options.ts
export const KEYBOARD_SIZES = ['fit', 'large', 'piano'] as const
export type KeyboardSize = (typeof KEYBOARD_SIZES)[number]
export const SWIPES = ['scroll', 'glissando'] as const
export type Swipe = (typeof SWIPES)[number]
export const NOTE_NAMES = ['c', 'all', 'none'] as const
export type NoteNames = (typeof NOTE_NAMES)[number]

// entities/settings/model/types.ts
export interface KeyboardPrefs {
  readonly size: KeyboardSize
  readonly swipe: Swipe
  readonly names: NoteNames
  /** The strip of all 88 keys over the rail. */
  readonly map: boolean
  /** The computer keyboard plays the keys. */
  readonly typing: boolean
}
export const defaultKeyboard = (finePointer: boolean): KeyboardPrefs => ({
  size: 'fit', swipe: 'scroll', names: 'c', map: false, typing: finePointer,
})
// SettingsState gains `keyboard: KeyboardPrefs`
// store.ts: SETTINGS_VERSION = 3; createSettingsStore({ storage, languages, finePointer = matchMedia('(pointer: fine)').matches })
// selectors.ts: export const selectKeyboard = (state: SettingsState): KeyboardPrefs => state.keyboard
// set-keyboard-prefs.ts:
export function setKeyboardPrefs(store: SettingsStore, change: Partial<KeyboardPrefs>): void {
  store.setState((state) => ({ keyboard: { ...state.keyboard, ...change } }))
}
```

The sanitiser keeps each field that is still one of its values (`isOneOf`) or a boolean, else the default:

```ts
function keyboardPrefs(value: unknown, fallback: KeyboardPrefs): KeyboardPrefs {
  const saved = savedObject<KeyboardPrefs>(value)
  return {
    size: isKeyboardSize(saved.size) ? saved.size : fallback.size,
    swipe: isSwipe(saved.swipe) ? saved.swipe : fallback.swipe,
    names: isNoteNames(saved.names) ? saved.names : fallback.names,
    map: typeof saved.map === 'boolean' ? saved.map : fallback.map,
    typing: typeof saved.typing === 'boolean' ? saved.typing : fallback.typing,
  }
}
```

- [ ] Tests (red): a new store starts with `defaultKeyboard(finePointer)` (both values of `finePointer`); saves
      `version: 3`; restores a saved group; a version-2 save gains the defaults and keeps theme and language; an
      unknown `size` falls back and the other fields stand; `selectKeyboard`; `setKeyboardPrefs` merges and saves.
      The existing tests that spell out the saved state gain `keyboard`.
- [ ] Implement; `renderWithSettings` and `renderApp` pass `finePointer: false` so tests do not depend on the
      matchMedia stub.
- [ ] Green, commit: "Save the keyboard's choices: size, swipe, note names, map and typing".

### Task 2: Pure keyboard logic

**Files:** `src/shared/lib/keyboard-layout.ts` (+ test), new `src/shared/lib/typing-keys.ts` (+ test),
`src/shared/lib/schedule/sounding.ts` (+ test), `src/shared/lib/index.ts`, `src/shared/lib/schedule/index.ts`.

```ts
// keyboard-layout.ts
/** The key under a point given in fractions (0–1) of the keyboard's width and height; a black key over a white one. */
export function keyAt(keys: readonly KeyGeometry[], x: number, y: number): Midi | null {
  if (x < 0 || x >= 1 || y < 0 || y >= 1) return null
  const left = x * 100
  const top = y * 100
  const inside = (key: KeyGeometry) => left >= key.left && left < key.left + key.width
  const black = keys.find((key) => key.black && top < key.height && inside(key))
  return (black ?? keys.find((key) => !key.black && inside(key)))?.midi ?? null
}

// typing-keys.ts: GarageBand's Musical Typing, by physical key
export const TYPING_KEYS: Readonly<Record<string, { readonly semitones: number; readonly letter: string }>> = {
  KeyA: { semitones: 0, letter: 'A' }, KeyW: { semitones: 1, letter: 'W' }, KeyS: { semitones: 2, letter: 'S' },
  KeyE: { semitones: 3, letter: 'E' }, KeyD: { semitones: 4, letter: 'D' }, KeyF: { semitones: 5, letter: 'F' },
  KeyT: { semitones: 6, letter: 'T' }, KeyG: { semitones: 7, letter: 'G' }, KeyY: { semitones: 8, letter: 'Y' },
  KeyH: { semitones: 9, letter: 'H' }, KeyU: { semitones: 10, letter: 'U' }, KeyJ: { semitones: 11, letter: 'J' },
  KeyK: { semitones: 12, letter: 'K' }, KeyO: { semitones: 13, letter: 'O' }, KeyL: { semitones: 14, letter: 'L' },
  KeyP: { semitones: 15, letter: 'P' }, Semicolon: { semitones: 16, letter: ';' }, Quote: { semitones: 17, letter: "'" },
}
export const OCTAVE_DOWN = 'KeyZ'
export const OCTAVE_UP = 'KeyX'
/** The typing C an octave further, or the same one where that would leave the piano's typed keys off the keyboard. */
export function moveTypingOctave(typingC: Midi, by: -1 | 1): Midi
/** The key a physical code plays from the typing C, if it plays one on the piano. */
export function typedKey(code: string, typingC: Midi): Midi | null
/** Each key the typing keys play, with its letter. */
export function typingLetters(typingC: Midi): Map<Midi, string>

// schedule/sounding.ts
/** The keys sounding at `time` that were struck last: the open windows with the latest start. */
export function keysStruckAt(windows: readonly KeyWindow[], time: number): Set<Midi>
```

`moveTypingOctave` keeps the typing C between C1 (24) and C8 (108); `typedKey` returns null for a key past C8, so at
C8 only A plays.

- [ ] Tests (red): `keyAt` (a white key's middle, a black key's upper part, the white key under a black key's lower
      part, outside → null); `typedKey` (A plays C4 from C4, W C♯4, `'` F5, unknown code → null, past C8 → null);
      `moveTypingOctave` (C4 ± 1, stops at C1 and C8); `typingLetters` (18 keys, letters); `keysStruckAt` (a block
      chord → all; an arpeggio half way → the latest; a finished window is not struck).
- [ ] Implement, green, commit: "Find the key under a point, the typed keys and the keys struck last".

### Task 3: The audio port's struck keys, taps at once, and playback

**Files:** `src/shared/api/audio/{types.ts,sounding.ts,fake-audio.ts,web-audio.ts}` (+ tests),
`src/shared/lib/services/{playback.ts,playback.test.ts,ServicesProvider.tsx,services-context.ts,use-play.ts,
use-play.test.tsx,use-sounding-keys.ts,index.ts}`.

**Produces:**

```ts
// AudioOutput
/** The keys sounding now that were struck last: the same set until it changes, notified with sounding(). */
struck(): ReadonlySet<Midi>

// services
export function useStruckKeys(): ReadonlySet<Midi>          // useSyncExternalStore(audio.onSounding, audio.struck)
export interface Playback {
  /** What plays under an id, until its last note ends or it is stopped: the Stop buttons' one source. */
  readonly playing: string | null
  play(id: string, sounds: readonly Sound[]): void
  stop(): void
}
export function usePlayback(): Playback
```

- `createSoundingKeys` computes `struck` beside `current` in `update()` and notifies when either changes.
- `createPlayback(audio)` (`playback.ts`): `current()`, `subscribe(onChange)` (also subscribes to
  `audio.onSounding` and clears when `audio.now() >= until`), `begin(id: string | null, sounds, at)`, `end()`.
  `ServicesProvider` builds one per audio port (`useMemo`) and provides it with the services; `usePlay` calls
  `begin(null, …)`, so any sound started elsewhere turns a Stop button back; `usePlayback().stop()` calls
  `audio.stop()` and `end()`.
- `useSoundKey` plays `[keySound(key)]` at `audio.now()`.

- [ ] Tests (red): the log's `struck` (arpeggio: one key at a time, the latest; `clear` empties it; one notification
      per change); the fake's and the WebAudio adapter's `struck()`; `useSoundKey` plays at `now()`; `usePlayback`
      (plays → `playing` is the id; after the last note's end → null; `stop` → null and the port stopped; a second
      `play` takes over; a `usePlay` sound turns it back to null); `useStruckKeys` follows the fake's clock.
- [ ] Implement, green, commit: "Let the audio port say which keys were struck last, play taps at once, and track
      what plays".

### Task 4: How a key looks

**Files:** `src/shared/ui/piano-keyboard/{key-look.ts,key-look.test.ts}`, `src/styles/{tokens.css,theme.css}`,
`src/shared/ui/role-classes.ts` if a fill map moves.

**Produces:**

```ts
export type KeyTone = ChordRole | 'rh' | 'lh' | 'melody' | 'tonic' | 'scale'
export interface KeyMark {
  readonly tone: KeyTone
  readonly label?: string
  /** A finger number, drawn in the row under the keys. */
  readonly finger?: Finger
}
export interface KeyStates {
  readonly marks?: ReadonlyMap<Midi, KeyMark>
  readonly lit?: ReadonlySet<Midi>
  readonly selected?: ReadonlySet<Midi>
  readonly outlined?: ReadonlySet<Midi>
  readonly wrong?: ReadonlySet<Midi>
  readonly down?: ReadonlySet<Midi>
  /** Marked keys held back while another is struck (spotlight). */
  readonly quiet?: ReadonlySet<Midi>
}
export interface KeyText {
  readonly names: NoteNames
  /** The typing keys' letters. */
  readonly letters?: ReadonlyMap<Midi, string>
}
export type KeyFill = 'white' | 'black' | 'lit' | 'selected' | 'wrong' | KeyTone
export interface KeyLook {
  readonly fill: KeyFill
  readonly down: boolean
  readonly outlined: boolean
  readonly quiet: boolean
  /** A mark's label, else the note's name as `names` asks ("C4" on a C, "F♯" on others). */
  readonly label?: string
  /** True when the label is a note name, drawn smaller than a mark's. */
  readonly nameOnly: boolean
  readonly letter?: string
}
export function keyLook(key: Midi, states: KeyStates, text: KeyText): KeyLook
```

`NoteNames` is Task 1's, from `options.ts`.

Tokens (`tokens.css`, both themes; utilities through `@theme inline`): `--key-rail`, `--key-bed`, `--key-lip`
(replaces `--key-white-edge`), `--key-black-slope`, `--key-shade`, `--key-tonic`, `--on-key-tonic`, `--key-scale`,
`--on-key-scale` (replace the four `--key-mark*`), `--key-quiet`, `--on-key-white`, `--on-key-black`. Named
utilities in `theme.css`: `shadow-key-rail` (the rail's inset shadow on the keys), `h-key-rail` (28px) if the spacing
scale lacks it (`h-7` is 28px: use it).

- [ ] Tests (red): the fills (`tonic`, `scale` on white and black keys), `quiet` only for a marked key, names
      (`c`: "C4" on C4 only; `all`: "C♯" on C♯4, "C4" on C4; `none`: nothing), a mark's label wins and `nameOnly`
      is false, letters, precedence kept (wrong > lit > mark > selected; down over all).
- [ ] Implement; remove the band's tokens and utilities; green; commit: "Colour a scale's keys whole, hold back quiet
      keys, and name the keys".

### Task 5: The keyboard (`PianoKeyboard`)

**Files:** `src/shared/ui/piano-keyboard/{PianoKeyboard.tsx,Key.tsx,Rail.tsx,FingerRow.tsx,KeyboardMap.tsx,
navigator.ts,use-key-pointers.ts,use-keyboard-scroll.ts,options.ts}` and tests; `src/shared/ui/index.ts`.

**Props** (adds to today's):

```ts
size?: KeyboardSize            // default 'fit'
swipe?: Swipe                  // default 'scroll'
names?: NoteNames              // default 'c'
map?: boolean                  // default false
letters?: ReadonlyMap<Midi, string>
quiet?: ReadonlySet<Midi>
/** 'proportional' (default): the keys 4.2 × a white key's width long, within 96px and 40dvh; 'fill': the height given. */
height?: 'proportional' | 'fill'
children?: ReactNode           // the rail's trailing controls
```

- Layout: `[KeyboardMap?] [Rail: ‹ (glissando) · spacer · › (glissando) · children] [scroller: keys group,
  FingerRow?]`. The keys group sets `--white` by size (`clamp(28px, 100cqw / span, 48px)` · `56px` ·
  `calc(100cqw / 52)`), its width `calc(52 * var(--white))`, and for `proportional` its height
  `clamp(96px, calc(var(--white) * 4.2), 40dvh)`; these are inline `style` values (CODE_STYLE §5: dynamic values go
  in `style`).
- `use-key-pointers.ts`: `pressed` (keys drawn down at once) and the group's pointer handlers. Scroll: `pointerdown`
  on a key presses it; `pointerup`/`pointercancel` releases; a move past 8px releases and presses nothing more.
  Glissando: `pointerdown` presses and captures the pointer; `pointermove` hit-tests with `keyAt` against the group's
  `getBoundingClientRect()` and presses a key the pointer enters; up/cancel forget the pointer. `Key`'s `onClick`
  presses only for a keyboard click (`event.detail === 0`).
- The group's `touch-action`: `manipulation` in Scroll, `none` in Glissando.
- ‹ › scroll the scroller by seven white keys (`scrollBy`, smooth unless reduced motion); hidden in Scroll and with
  Whole piano.
- `FingerRow`: under the keys, a 22px circle under each marked key with a finger (`bg-card ring-1 ring-border` under
  a white key, `bg-secondary` under a black one), `aria-hidden`; only when a mark has a finger.
- `KeyboardMap` + `navigator.ts`: frame from `scrollLeft / scrollWidth`; a point → centre the view there; slider role,
  arrow keys move seven white keys, `aria-valuetext` "C3 to B4" from the keys in view.
- Rail buttons: 28px drawn; a named utility `hit-rail` in `theme.css` gives each an `::after` reaching 16px above
  and 8px to each side, so the target is 44px and never lies over a key.

- [ ] Tests (red): Scroll: `pointerdown` on F♯4 calls `onKeyPress(66)` once and draws it down; the click after it does
      not call again; a pointer that moves 20px presses nothing more; Enter on a focused key presses. Glissando: a
      pointer swiped across C4 → E4 (stubbed box) presses 60, 62, 64 once each; leaving and re-entering D4 presses
      it again; two pointers press their own keys; ‹ › shown only in Glissando and they scroll (jsdom: `scrollBy`
      spy). Finger row: fingers render under their keys. Map: hidden by default; with `map`, a slider named "Keys in
      view". Children render in the rail. Existing tests keep passing (88 keys, one tab stop, arrows).
- [ ] Implement, green (+ `build`), commit: "Play a key on touch, scroll or glide across the keys, and hang the keys
      from a rail".

### Task 6: `LiveKeyboard`: choices, spotlight, typing, options

**Files:** `src/features/live-keyboard/{index.ts,ui/LiveKeyboard.tsx,ui/KeyboardOptions.tsx,
ui/KeyboardChoices.tsx,model/use-typing.ts,model/typing-stack.ts}` and tests; `src/shared/i18n/locales/{en,ru}/
common.ts`.

- `LiveKeyboard` gains `spotlight?: boolean`; reads `selectKeyboard`; `quiet` = the marked keys not struck while a
  struck key is marked (`useStruckKeys`); passes size, swipe, names, map, letters; fills the rail's slot with
  `KeyboardOptions`.
- `KeyboardChoices` (exported): three `Segmented` (Keys, Swipe, Note names) and two switches (Keyboard map, Play from
  the computer keyboard, with the "Z X · octave" hint), writing through `setKeyboardPrefs`. `KeyboardOptions`: a
  rail button (`SlidersHorizontal`, "Keyboard options") opening a `Popover` of `KeyboardChoices`.
- `typing-stack.ts`: a tiny external store of the mounted keyboards that may type (`register(id) → unregister`,
  `top()`, `subscribe`). `use-typing.ts`: `useTyping({ enabled, onKey })` → `{ letters, typingRange }`; its window
  `keydown` listener acts only for the top keyboard; ignores `event.repeat`, Ctrl/Meta/Alt, and a target that is an
  `input`, `textarea`, `select` or `[contenteditable]`; Z/X move the octave; a typed key calls `onKey` (the same path
  as a tap: sound, then the caller's `onKeyPress`).
- In view: after Z or X, the typing octave until the caller's `inView` changes; else the caller's `inView`, else the
  keys down.

- [ ] Tests (red): the popover opens from the rail and changing Keys, Swipe, Note names, the map and typing saves
      them; spotlight: an arpeggio on marked keys leaves the struck one full and the others `data-quiet`; without
      `spotlight`, nothing goes quiet; typing: `KeyA` plays C4 and calls `onKeyPress(60)`, `KeyX` then `KeyA` plays
      C5, a key held (`repeat`) plays once, with Meta held nothing plays, typing in an `<input>` plays nothing, with two
      keyboards mounted only the last types, with typing off nothing plays; letters show on the typed keys.
- [ ] Implement, green (+ `build`), commit: "Keep the keyboard's choices, spotlight the key struck, and play from the
      computer keyboard".

### Task 7: Screens

**Files:** `src/widgets/chord-explorer/ui/ChordExplorer.tsx`, `src/widgets/scale-explorer/ui/{ScaleExplorer.tsx,
FingeringTable.tsx}`, `src/pages/theory-symbols/ui/{TheorySymbolsPage.tsx,QualityRow.tsx}`,
`src/pages/piece/ui/PieceView.tsx`, `src/widgets/chord-chart/ui/{ChordChart.tsx,BarButton.tsx}`,
`src/widgets/quiz-board/ui/QuizBoard.tsx`, `src/pages/player/ui/PlayerPage.tsx`, `src/features/practice/marks.ts`,
`src/pages/settings/ui/SettingsPage.tsx`, i18n `theory`, `settings`, `common`; screen tests beside each page.

- Chords: `spotlight`; Play and Arpeggio through `usePlayback` (`'chord'`, `'arpeggio'`; sounds from
  `chordSounds(midis, { arpeggio })`), each turning into Stop (icon `Square`, name "Stop") while it plays; a change
  of root, family, quality, inversion or hands plays `'chord'`; no fixed height.
- Scales: marks `tonic` for degree 1 and `scale` otherwise, labelled by degree, with `finger` from the chosen hand;
  the switch **Fingers: None · Right hand · Left hand** (`view` keeps `degrees` · `rh` · `lh`); Play up and down
  through `usePlayback('run')` with Stop; `spotlight`; no fixed height.
- Symbols: `spotlight`; each Hear through the page's one `usePlayback` (id = the quality), Stop while it plays.
- Piece: a tapped bar plays through `usePlayback` (id = `bar:<n>`); the playing bar is `current` in the chart (its
  button pressed, named "Stop bar 3" while it plays); tapping it again stops.
- Quiz board: no fixed height.
- Player: `height="fill"` with its layout classes; `practiceMarks` puts `finger` on a mark when Finger numbers is on
  and keeps the note name as its label.
- Settings: a **Keyboard** group (`KeyboardChoices`) between Theme and MIDI keyboard.

- [ ] Screen tests (red): Chords: Play shows Stop while the chord sounds (move the fake clock), back to Play after;
      Play then Arpeggio turns Play back; Stop stops the port. Scales: with Right hand fingers, the finger row shows
      the fingering and the keys keep their degrees; the tonic key is `tonic`. Symbols: Hear → Stop → Hear. Piece: a
      bar plays, shows as playing, a second tap stops. Player: Finger numbers puts fingers in the row. Settings: the
      Keyboard group saves a change.
- [ ] Implement, green, `build`, commit: "Stop every Play, colour a scale's keys whole, put fingers under the keys
      and set the keyboard in Settings".

### Task 8: Records

**Files:** `DESIGN.md`, `docs/CODE_STYLE.md` (§1, §5), `docs/UBIQUITOUS_LANGUAGE.md`, `docs/adr/0009-the-keyboard-is-an-instrument.md`,
`CLAUDE.md`, `PRODUCT.md` (the keyboard line only).

- [ ] DESIGN.md: the keys (rail, bed, lip, slope, proportions), the finger row, the scale fills, spotlight, Stop, the
      No Glow Rule's exception; the frontmatter's colours (`key-rail`, `key-tonic`, `key-scale`) replace the band.
- [ ] CODE_STYLE: §1 the keyboard's choices, `spotlight`, `usePlayback`; §5 the key tokens.
- [ ] Glossary: **Rail**, **Keyboard map**, **Typing keys**, **Spotlight**, **Finger row**.
- [ ] ADR 0009; CLAUDE.md's `live-keyboard` and services lines.
- [ ] Commit: "Record the playable keyboard".

### Task 9: Verify

- [ ] `npm run typecheck && npm run lint && npm run test && npm run build`; read the output; fix what fails in the
      task it belongs to.
- [ ] `npm run dev` and look at Chords, Scales and the Player at phone width (390) and desktop, light and dark: keys'
      proportions, the rail, a Glissando swipe, Stop, the finger row, the scale fills.
