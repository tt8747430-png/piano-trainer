# Piano Voice, MIDI Settings, Whole Takes and Free Play Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A key a hand plays sounds while held, under a pedal; the MIDI keyboard's settings; takes named, cut to
their bars and drawn as a piano roll; Free play (live score, Mark); the app's music through the piano's speaker.

**Architecture:** The audio port gains a live voice (`press`/`release`/`pedal`) over a pure damper in
`shared/lib/schedule`; the MIDI port is told the settings (`configure`) by one app provider, which also bridges MIDI
keys and pedals to the voice; takes go to version 2 with a page of their own; Free play is Practice's eighth place
over a pure trail; through the piano, the audio port sends its notes to the MIDI port's output.

**Tech Stack:** React 19, TypeScript 6 strict, zustand (`createSavedStore`), TanStack Router, Vitest 4 + Testing
Library, Base UI / shadcn primitives, VexFlow, Web Audio, Web MIDI, i18next.

**Spec:** `docs/superpowers/specs/2026-10-09-piano-voice-midi-and-free-play-design.md` · **ADR:** 0034

## Global Constraints

- FSD (lint): a slice imports its own layer or below, another slice only through its `index.ts`; the router imports
  no page or widget code (`import type` only); route validators read only what a URL is made of.
- Every UI string in `en` and `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`); Russian typed against English.
- Saved stores: `pt-settings` → version 9 (`midi`, `recorder.tune`); `pt-takes` → version 2. An older save reads
  through the one sanitiser, never a reset.
- Test first; `globals: false` (import `describe/it/expect/vi`); fakes, never module mocks; `npx prettier --write`
  on touched files only, never `npm run format`.
- No legacy: what the live voice replaces (`keySounds`, `useSoundKeys`, `PlayOptions`/`byHand`) is deleted with its
  tests; `MidiInput` becomes `MidiPort` when it gains outputs (Task 22).
- Verify each task: `npm run typecheck && npm run lint && npm run test`; also `npm run build` after Tasks 9, 16, 20,
  22 (providers, routing, startup). Commit on main, one commit per task, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Decisions the spec leaves open (made here)

1. **The live voice is independent of `stop()`.** `audio.stop()` stops scheduled music and recordings only; a key a
   hand holds ends by its release or its pedal. Every hook that presses keys releases them on unmount.
2. **Live keys are in both `sounding()` and `struck()`** (a spotlight screen shows a pedalled key down too):
   `createSoundingKeys` gains `setLive(keys)` and merges them in `look`.
3. **A key held by two presses** (two pointers, two `keyPlays` chords sharing a note) is counted by `useLiveVoice`:
   each press strikes, and the port's `release` comes with the last let-go. What a press played is remembered, so a
   `keyPlays` changed mid-press still lets go of what sounded.
4. **The pedals' state lives in the port** (`pedals()`), so the rail's Pedal button shows the MIDI pedal too.
5. **MIDI → voice** is `useMidiSync()` in `features/connect-midi`, mounted once by `app/providers/MidiSync.tsx`: it
   calls `midi.configure(...)` from the settings, presses and releases MIDI keys (velocity through the Touch) while
   Sound the MIDI keyboard is on, releasing what it pressed when switched off, and forwards every pedal; in Task 22
   it also routes notes through the piano.
6. **The port's choice:** `MidiChoice { device: string | null; octaveShift: number; reversedPedal: boolean }`.
   Configuring lets go of every held key and pedal first. A chosen keyboard that is away is a status of its own,
   `{ state: 'away'; device; devices }`, not connected.
7. **Takes version 2 also keeps `fromBar`** (the caret's bar it was recorded at, from 1; version 1 reads 1): the
   roll numbers its bars from it. `Played.pedal` becomes `pedals`, each press with its `pedal` kind.
8. **A take's bars** are its meter's from its downbeat: `barMs = beatsPerBar(meter) * 60000 / tempo`. Keep bars clips
   a press crossing the first or last bar's edge (a pedal held over the cut still holds the kept notes); its length
   is whole bars, never past the longest take.
9. **The router's context gains the takes store** (`RouterContext.takes`), so a take's page is `notFound()` where the
   take is not there or is another piece's.
10. **Free play's trail** joins a key to the newest chord when struck within 50 ms of that chord's last key (a fast
    roll is one chord). Two keys over an octave apart name the compound interval where the table has one (m9…M13),
    else the simple one.
11. **Mark's two colours** are the hands' tones (`a` → `rh`, `b` → `lh`), named Right hand and Left hand; Colour and
    Finger are component state, the marks the URL's. The marks codec is `shared/lib/diagram-marks.ts`, so the
    validator may read it.
12. **Space is the pedal** only where typing plays, the focus is on nothing interactive, and the screen allows it
    (`LiveKeyboard`'s `spacePedal`; the score editor passes `false` while a take records).
13. **Through the piano:** a note is sent as its on and its off together, timestamped on the page's clock, its gain
    turned back to a velocity (`gainVelocity`); Stop calls the output's `clear()` where it has one and sends
    note-off for every key still sounding.

## Review Focus

1. A key held as its screen goes (unmount mid-press, typing switched off, the window losing focus): released, nothing
   rings on (Tasks 4, 5).
2. The MIDI pedal down, or keys held, while Sound the MIDI keyboard is switched off or the keyboard is unplugged: no
   key stuck sounding or down (Task 9).
3. Octave shift, the reversed pedal or the chosen keyboard changed while keys are held: every held key and pedal let
   go first (Task 7).
4. A version-1 take whose presses run past its length, or a version-2 press of an unknown pedal kind: the press
   dropped, the take kept (Task 11).
5. A `marks` URL with keys off the piano, repeats or garbage: the valid marks only, the URL written back clean, never
   a crash (Task 19).

---

## Part 1: The live voice

### Task 1: One loudness for a velocity, and the Touch

**Files:** Create `src/shared/lib/schedule/velocity.ts`, `velocity.test.ts`; modify `src/shared/lib/schedule/index.ts`,
`src/entities/take/model/sounds.ts` (use `velocityGain`; delete `takeGain` and `LOUDEST`).

**Produces:**
```ts
/** A tap's and a typed key's velocity: today's loudness. */
export const HAND_VELOCITY = 100
export const TOUCHES = ['light', 'normal', 'heavy'] as const
export type Touch = (typeof TOUCHES)[number]
const LOUDEST = 0.3
const TOUCH_EXPONENT: Readonly<Record<Touch, number>> = { light: 0.7, normal: 1, heavy: 1.4 }
const velocityIn = (value: number) => Math.min(127, Math.max(1, Math.round(value)))

/** How loud a key struck at `velocity` (1–127) sounds: as the square of the velocity, as a piano's. */
export const velocityGain = (velocity: number): number => LOUDEST * (velocity / 127) ** 2
/** A velocity as the Touch hears it: Light raises soft ones, Heavy lowers them; 1 and 127 stay. */
export const touchVelocity = (velocity: number, touch: Touch): number =>
  velocityIn(127 * (velocity / 127) ** TOUCH_EXPONENT[touch])
/** The velocity a note's gain was struck at: `velocityGain` turned round. */
export const gainVelocity = (gain: number): number => velocityIn(127 * Math.sqrt(gain / LOUDEST))
```

- [ ] **Step 1: Tests (red)** in `velocity.test.ts`: `velocityGain(127)` is `0.3`; `velocityGain(100)` is close to
  `0.186`; `touchVelocity(64, 'normal')` is `64`; `touchVelocity(32, 'light')` is above 32 and
  `touchVelocity(32, 'heavy')` below; 1 and 127 come back unchanged under every touch;
  `gainVelocity(velocityGain(90))` is `90`; `gainVelocity(1)` is `127`.
- [ ] **Step 2:** `npx vitest run src/shared/lib/schedule/velocity.test.ts` fails (no module).
- [ ] **Step 3:** Implement as above; export all from the barrel; `entities/take/model/sounds.ts` uses
  `velocityGain`.
- [ ] **Step 4:** The new tests and `src/entities/take/model/sounds.test.ts` pass; full verify.
- [ ] **Step 5:** Commit "Schedule: one loudness for a velocity, and the Touch".

### Task 2: The damper

**Files:** Create `src/shared/lib/schedule/damper.ts`, `damper.test.ts`; export from the barrel.

**Produces:**
```ts
export const PEDALS = ['sustain', 'soft', 'sostenuto'] as const
export type PedalKind = (typeof PEDALS)[number]
/** A key struck under the soft pedal sounds at two thirds of its gain. */
export const SOFT_GAIN = 2 / 3

/** Which keys a hand holds, which sound, the pedals, and the keys the sostenuto caught. */
export interface Damper {
  readonly held: ReadonlySet<Midi>
  readonly sounding: ReadonlySet<Midi>
  readonly pedals: Readonly<Record<PedalKind, boolean>>
  readonly caught: ReadonlySet<Midi>
}
export type DamperEvent =
  | { readonly kind: 'press' | 'release'; readonly midi: Midi }
  | { readonly kind: 'pedal'; readonly pedal: PedalKind; readonly down: boolean }
export const QUIET_DAMPER: Damper
/** The damper after `event`, and the keys whose dampers fell: they stop sounding now. */
export function damp(damper: Damper, event: DamperEvent): { damper: Damper; stopped: readonly Midi[] }
```
Rules: press adds to `held` and `sounding`. Release takes the key from `held`; it stops unless the sustain is down
or the sostenuto caught it. The sustain going up stops every sounding key not held and not caught while the
sostenuto is down. The sostenuto going down catches exactly the held keys; going up, it lets them go (each stops
unless held or the sustain is down) and empties `caught`. The soft pedal stops nothing. A field that does not change
keeps its object, so `pedals` is the same object until a pedal changes.

- [ ] **Step 1: Tests (red):** press → held and sounding, nothing stopped; release → `stopped: [k]`; release under
  the sustain → still sounding, nothing stopped; sustain up → stops the let-go keys, keeps the held ones; sostenuto
  down with C held, then E struck and let go → E stops, C does not; C let go → still sounding; sostenuto up → C
  stops; sostenuto up while the sustain is down → nothing stops; soft down and up → nothing stops; a re-press of a
  sounding key keeps it sounding (the adapter re-strikes); `pedals` keeps its object across a press.
- [ ] **Step 2:** It fails. **Step 3:** Implement. **Step 4:** It passes; full verify.
- [ ] **Step 5:** Commit "Schedule: the damper, three pedals over held keys".

### Task 3: The audio port's live voice

**Files:** Create `src/shared/api/audio/live-voice.ts`, `live-voice.test.ts`; modify
`src/shared/api/audio/{types,sounding,web-audio,fake-audio,index}.ts` and their tests.

**Produces:**
```ts
// types.ts
/** What a hand does to the live voice: what the fake audio records. */
export type LiveEvent =
  | { readonly kind: 'press'; readonly midi: Midi; readonly velocity: number }
  | { readonly kind: 'release'; readonly midi: Midi }
  | { readonly kind: 'pedal'; readonly pedal: PedalKind; readonly down: boolean }
// AudioOutput gains:
/** The live voice (spec §2.1): a key struck at `velocity` sounds until it is let go, under the pedals. */
press(key: Midi, velocity: number): void
release(key: Midi): void
pedal(pedal: PedalKind, down: boolean): void
/** The pedals now: the same object until one changes. */
pedals(): Readonly<Record<PedalKind, boolean>>

// sounding.ts: SoundingKeys gains
/** The live voice's keys: sounding and struck with the scheduled ones until they change. */
setLive(keys: ReadonlySet<Midi>): void

// live-voice.ts
export interface LiveVoice {
  press(key: Midi, velocity: number): void
  release(key: Midi): void
  pedal(pedal: PedalKind, down: boolean): void
  pedals(): Readonly<Record<PedalKind, boolean>>
}
/** The damper over an adapter's sound: `strike` a key at a gain, `silence` it; `changed` after each change. */
export function createLiveVoice(render: {
  strike(key: Midi, gain: number): void
  silence(key: Midi): void
  changed(damper: Damper): void
}): LiveVoice
```
`createLiveVoice`: a press of a sounding key silences it first, then strikes at
`velocityGain(velocity) * (pedals.soft ? SOFT_GAIN : 1)`; each step's `stopped` keys are silenced; `changed` runs
after every event. Each adapter's `changed` calls `keys.setLive(damper.sounding)`, which tells the listeners.
`stop()` is untouched by the live voice.

Web audio renders a held key with its own nodes, kept in a `Map<Midi, Voice>` apart from the scheduled `voices` (so
`stop()` never reaches them): the piano's partials and low-pass as `playNote` has them; the envelope rising to the
gain in 8 ms, then `setTargetAtTime(SILENT, at + 0.008, decay)` with
`decay = 1.5 + 4.5 * (108 - midi) / 87` seconds (a lower key longer); no `stop` until silenced. Silencing cancels the
gain's schedule at now and sets `setTargetAtTime(SILENT, now, 0.04)`, then stops the oscillators at `now + 0.25`.
Fake audio: `voice: readonly LiveEvent[]` records each call; its keys follow the same `createLiveVoice`.

- [ ] **Step 1: Tests (red):** `live-voice.test.ts` with a recording render (strike gain from the velocity; release
  silences; release under the sustain does not, the sustain's up does; re-press silences then strikes; the soft
  pedal's strike at two thirds). `web-audio.test.ts` with its stub context: a press starts oscillators with no stop
  scheduled; release ramps the gain down and stops them; `stop()` leaves a pressed key's oscillators running.
  `sounding.test.ts`: `setLive` puts keys in `current()` and `struck()` and calls listeners; the same set comes back
  until they change. `fake-audio.test.ts`: `press`, `release` and `pedal` are recorded in `voice`, `sounding()` keeps
  a key let go under the sustain until it comes up, `onSounding` fires each time.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Audio: a live voice, struck, held and damped under the pedals".

### Task 4: A key let go is reported

**Files:** Modify `src/shared/ui/piano-keyboard/use-key-pointers.ts`, `PianoKeyboard.tsx`, `KeyPointers.test.tsx`;
`src/features/live-keyboard/model/use-typing.ts`, `use-typing.test.tsx`.

**Produces:** `PianoKeyboard` prop `onKeyRelease?: ((key: Midi) => void) | undefined` (held in a latest ref, as
`onKeyPress` is); `useKeyPointers({ swipe, keys, onPress, onRelease })`; `useTyping({ enabled, onKey, onKeyUp,
inView })`.
- Pointers: `moveTo(pointerId, key)` reports the key the pointer leaves (`onRelease(previous)`) before the new one
  plays; `forget` reports the pointer's key; a click with no pointer reports `onPress(key)` then `onRelease(key)`.
- Typing: a `useRef(new Map<string, Midi>())` of code → piano key played; key-up reports that key; Cmd's release,
  blur, the hook switched off and unmount report every key held. `onKeyUp` read through a latest ref.

- [ ] **Step 1: Tests (red):** a touch's lift reports its key once; a pointer cancel reports it; Glissando: a move
  onto the next key reports the old key before pressing the new; leaving the keys reports the key; Scroll: leaving
  reports it; Enter on a focused key reports press then release; a typed key's key-up reports the key it played even
  after Z moved the octave; blur, Cmd's release and `enabled` turned false report every held key.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Keyboard: a key let go is reported, tapped or typed".

### Task 5: The hands play the live voice

**Files:** Create `src/shared/lib/services/use-live-voice.ts`, `use-live-voice.test.tsx`, `use-pedal.ts`,
`use-pedal.test.tsx`; modify `src/shared/lib/services/{index,use-play}.ts`,
`src/features/live-keyboard/ui/LiveKeyboard.tsx`, `LiveKeyboard.test.tsx`, and every test that read a tap through
`audio.played`; delete `keySounds` (`schedule/sounds.ts` and its tests), `useSoundKeys`, `PlayOptions`, `byHand`
(`audio/types.ts`, `sounding.ts`, `fake-audio.ts`, `web-audio.ts` and their tests).

**Produces:**
```ts
export interface HandVoice {
  /** A hand puts `key` down: the keys it plays (itself, or the chord it stands for) strike at `velocity`. */
  down(key: Midi, plays: readonly Midi[], velocity?: number): void
  /** A hand lets `key` go: what its press played is let go where no other press still holds it. */
  up(key: Midi): void
}
/** The live voice for one hand's keys (decision 3); everything still held is let go on unmount. */
export function useLiveVoice(): HandVoice
/** Whether a pedal is down now, the port's (the MIDI pedal's or the rail's). */
export function usePedal(pedal?: PedalKind): boolean
```
`useLiveVoice` keeps `presses: Map<Midi, (readonly Midi[])[]>` (what each hand key's presses played, oldest first)
and `counts: Map<Midi, number>`; `down` unlocks audio, pushes, counts up and calls `audio.press(k, velocity ??
HAND_VELOCITY)` for each key; `up` shifts the oldest press of `key`, counts down and calls `audio.release(k)` at 0.
`usePedal` is `useSyncExternalStore(audio.onSounding, () => audio.pedals()[pedal])`.
`LiveKeyboard`: a tap or typed key calls `voice.down(key, plays(key))` then `onKeyPress?.(key)`; `onKeyRelease` and
`onKeyUp` call `voice.up(key)`.

- [ ] **Step 1: Tests (red):** a tap sounds until lifted (`audio.voice`: press 66 at 100, then release 66); a
  `keyPlays` chord's keys all press and all release; two pointers on one key release at the second lift; a key
  shared by two held chords releases with the last; unmount mid-press releases; a typed key releases on key-up;
  `usePedal` follows `audio.pedal('sustain', …)`. The existing `LiveKeyboard.test.tsx` cases move from
  `audio.played` to `audio.voice`; `grep -rln "\.played" src --include=*.test.tsx` lists the app tests to check for
  taps.
- [ ] **Step 2:** They fail. **Step 3:** Implement and delete the replaced code. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Live keyboard: a key sounds while it is held".

### Task 6: The Pedal button and Space

**Files:** Create `src/features/live-keyboard/ui/PedalToggle.tsx`, `PedalToggle.test.tsx`,
`src/features/live-keyboard/model/use-space-pedal.ts`, `use-space-pedal.test.tsx`; modify `LiveKeyboard.tsx`
(`spacePedal?: boolean`, default `true`; `<PedalToggle />` after `<GlissandoToggle />`),
`src/pages/score-editor/ui/EditorKeyboard.tsx` (`spacePedal={takes.stage === 'idle'}`), locales `common`.

**Produces:**
```ts
/** The rail's sustain pedal: a tap puts it down or up; it shows down while the MIDI pedal is down. */
export function PedalToggle(): JSX.Element // RailButton, icon Footprints, aria-pressed = usePedal()
/** Space holds the sustain while held, where Space has no other job (decision 12). */
export function useSpacePedal({ enabled }: { enabled: boolean }): void
```
`useSpacePedal`: on `keydown` with `code === 'Space'`, no repeat, no modifier, and the target not inside
`a[href], button, input, select, textarea, summary, [contenteditable]:not([contenteditable="false"]), [role="button"],
[role="switch"], [role="slider"], [role="radio"], [role="checkbox"], [role="tab"], [role="menuitem"], [role="option"],
[role="combobox"], [role="listbox"]`: `preventDefault()`, `audio.pedal('sustain', true)` and remember it holds;
`keyup` Space, blur, `enabled` false or unmount: up if it holds. `LiveKeyboard` calls it with
`enabled: typing && spacePedal`.

Strings: `common.rail.pedal`: en 'Pedal', ru 'Педаль'.

- [ ] **Step 1: Tests (red):** the button puts the sustain down then up (`audio.voice`), `aria-pressed` true while
  `audio.pedal('sustain', true)` came from elsewhere; Space down/up is the pedal with the body focused; not in the
  test's text field, not on a focused key or button, not with typing off, not with `spacePedal={false}`; blur while
  held lifts it.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Keyboard: the Pedal button, and Space holds the pedal".

## Part 2: The MIDI keyboard

### Task 7: The MIDI port hears the keyboard chosen, shifted, with its three pedals

**Files:** Modify `src/shared/api/midi/{types,parse-message,web-midi,fake-midi,index}.ts` and their tests;
`src/features/connect-midi/use-midi-connection.ts`, `ui/MidiControl.tsx` (the `away` status reads as not connected,
named in Task 10).

**Produces:**
```ts
export type MidiStatus =
  | { readonly state: 'connected'; readonly devices: readonly string[] }
  | { readonly state: 'away'; readonly device: string; readonly devices: readonly string[] }
  | { readonly state: 'no-device' }
  | { readonly state: 'denied' }
export interface PedalEvent {
  readonly pedal: PedalKind
  readonly down: boolean
  readonly time: number
}
/** Which keyboard is heard (null: any), its keys moved by octaves, and whether its pedals read reversed. */
export interface MidiChoice {
  readonly device: string | null
  readonly octaveShift: number
  readonly reversedPedal: boolean
}
export const ANY_KEYBOARD: MidiChoice = { device: null, octaveShift: 0, reversedPedal: false }
// MidiInput gains:
/** Hears as chosen from now: every key and pedal held is let go first. */
configure(choice: MidiChoice): void
// parse-message.ts
export function parseMidiMessage(data: ArrayLike<number>, time: number, reversedPedal?: boolean): MidiMessage | null
// fake-midi.ts: FakeMidi gains
pedal(down: boolean, at?: At & { readonly pedal?: PedalKind }): void
readonly choices: readonly MidiChoice[]
```
`parseMidiMessage`: CC 64 → `sustain`, 66 → `sostenuto`, 67 → `soft`; down is `value >= 64`, reversed `< 64`.
Web MIDI: `choice` starts as `ANY_KEYBOARD`; `hook` listens only to the connected inputs whose name is the choice's
device (all of them for `null`) and sets `onmidimessage = null` on the rest; a note moves by `12 * octaveShift` and
is dropped off `PIANO`; `held` keeps each input's keys (shifted) and its pedals down (`Set<PedalKind>`); letting an
input go emits a release for each key and an up for each pedal. The status is `away` when a device is chosen and
not connected (`devices`: the connected names), else as today. `configure` with an equal choice does nothing;
otherwise it lets go of every input, keeps the choice, and re-hooks and reports where access was granted.

- [ ] **Step 1: Tests (red):** parse: CC 64/66/67 as their pedals, 63 up and 64 down, reversed the other way round,
  CC 1 null. Web MIDI (its `FakeInput`/`FakeAccess`): `configure({ device: 'Piano', … })` hears Piano and not Pads;
  the chosen keyboard unplugged reports `{ state: 'away', device: 'Piano', devices: ['Pads'] }` and back
  `connected`; a key held when the choice changes is released at once; `octaveShift: 1` turns 60 into 72; 120
  shifted off the piano is not heard; a reversed pedal's 0 is down; the sostenuto and soft held at unplug are let
  go. Fake: `pedal(true, { pedal: 'soft' })` emits the soft pedal; `configure` is recorded.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "MIDI: the keyboard chosen, an octave shift, reversed and three pedals".

### Task 8: Settings version 9

**Files:** Create `src/shared/lib/midi-choices.ts`; modify `src/shared/lib/index.ts`,
`src/entities/settings/model/{types,store,selectors}.ts`, `src/entities/settings/index.ts` and their tests;
create `src/features/set-preference/set-midi.ts`, `set-recorder-tune.ts`; modify its `index.ts` and
`set-preference.test.ts`.

**Produces:**
```ts
// shared/lib/midi-choices.ts
export const OCTAVE_SHIFTS = [-2, -1, 0, 1, 2] as const
export type OctaveShift = (typeof OCTAVE_SHIFTS)[number]
export const PEDAL_WAYS = ['normal', 'reversed'] as const
export type PedalWay = (typeof PEDAL_WAYS)[number]
// entities/settings
export interface MidiSettings {
  /** The keyboard heard, by its name; null: any. */
  readonly device: string | null
  /** The app sounds the keys played on it. */
  readonly sound: boolean
  /** The app's music sounds on its speaker. */
  readonly throughPiano: boolean
  readonly octaveShift: OctaveShift
  readonly touch: Touch
  readonly pedal: PedalWay
}
export const DEFAULT_MIDI: MidiSettings = {
  device: null, sound: false, throughPiano: false, octaveShift: 0, touch: 'normal', pedal: 'normal',
}
export interface RecorderSettings { readonly click: boolean; readonly tune: boolean }
export const DEFAULT_RECORDER: RecorderSettings = { click: true, tune: false }
// SettingsState gains `midi: MidiSettings`; SETTINGS_VERSION = 9
export const selectMidi = (state: SettingsState): MidiSettings => state.midi
export function setMidi(store: SettingsStore, change: Partial<MidiSettings>): void
export function setRecorderTune(store: SettingsStore, on: boolean): void
```
The sanitiser reads `midi` field by field (a device a non-empty string of at most 100 characters, else null; each
other field one of its values, else its default) and `recorder.tune` (a boolean, else false); its comment adds "a
version-8 save no MIDI settings and no tune". `src/app/theme-boot.test.ts` still passes (the theme's shape is
untouched).

- [ ] **Step 1: Tests (red):** a version-8 save (no `midi`, `recorder: { click: false }`) reads with `DEFAULT_MIDI`,
  click false and tune false; each MIDI field kept when valid and defaulted when not (`octaveShift: 3`,
  `touch: 'soft'`, `device: ''`); `setMidi` changes one field and keeps the rest; `setRecorderTune` keeps the click.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Settings: version 9, the MIDI keyboard's settings and the recorder's tune".

### Task 9: MidiSync, and keys held under the pedal

**Files:** Create `src/features/connect-midi/use-midi-sync.ts`, `use-midi-sync.test.tsx`,
`src/app/providers/MidiSync.tsx`, `MidiSync.test.tsx`; modify `src/features/connect-midi/index.ts`,
`use-held-keys.ts`, `use-held-keys.test.tsx`, `use-midi-key-down.ts` (+test), `src/app/App.tsx`, and an app test
beside `src/pages/chords` (`renderApp('/practice/chords')`).

**Produces:**
```ts
/** The MIDI keyboard as the settings say (decision 5): every reader of the port hears the same keys. */
export function useMidiSync(): void
export function MidiSync(): null // app/providers: calls useMidiSync()
/** Calls `onKey` for each key going down on the MIDI keyboard, with when it came (page clock, ms). */
export function useMidiKeyDown(onKey: (key: Midi, time: number) => void): void
```
`useMidiSync`: `midi.configure({ device, octaveShift, reversedPedal: pedal === 'reversed' })` in an effect on those
three; `midi.onPedal((event) => audio.pedal(event.pedal, event.down))` always; `midi.onNote`: with `sound` on, a
note-on presses `audio.press(key, touchVelocity(velocity, touch))` and remembers the key, a note-off releases a
remembered key; `sound` turned off or unmount releases every remembered key. Settings read through
`useSettingsStoreApi()` and `useSettings(selectMidi)`; the handlers read the latest through `useEffectEvent`.
`useHeldKeys`: a note-off while the MIDI sustain is down keeps the key (in a `sustained` set) instead of releasing
it; the sustain's up releases every sustained key; a note-on of a sustained key takes it from the set.

- [ ] **Step 1: Tests (red):** `useMidiSync` with fakes: settings `{ device: 'Piano', octaveShift: -1, pedal:
  'reversed' }` configure the port so; a key on the fake MIDI is not pressed with sound off and is with it on, at
  `touchVelocity(80, 'light')` under Light; switching sound off with a key held releases it; every pedal reaches
  `audio.voice` with sound off too; unmount releases what it pressed. `useHeldKeys`: a key let go under the pedal
  stays until the pedal's up. App (`renderApp('/practice/chords')`): a MIDI key sounds only after `setMidi(…,
  { sound: true })`; with the pedal down a released key stays `data-down` until the pedal is up.
- [ ] **Step 2:** They fail. **Step 3:** Implement; `<MidiSync />` after `<MidiReconnect />` in `App.tsx`.
- [ ] **Step 4:** They pass; full verify and `npm run build`.
- [ ] **Step 5:** Commit "MIDI: the settings heard everywhere, its keys sounded and held under the pedal".

### Task 10: The MIDI settings on screen

**Files:** Create `src/features/connect-midi/ui/MidiSettingsFields.tsx`, `MidiSettingsFields.test.tsx`,
`ui/MidiSoundToggle.tsx`; modify `ui/MidiControl.tsx` (+test), `src/features/connect-midi/index.ts`,
`src/pages/settings/ui/SettingsPage.tsx` (+test: the MIDI group holds `<MidiControl />` then
`<MidiSettingsFields />`), `src/features/live-keyboard/ui/KeyboardRailSettings.tsx` (`<MidiSoundToggle />` last,
only while `isMidiConnected`), locales `common`.

**Produces:** `MidiSettingsFields`: Keyboard (`Dropdown<string>`, value `device ?? ''`: Any keyboard, each connected
name, and the chosen one while away, labelled as not connected); Sound the MIDI keyboard and Play through the piano
(`SwitchRow`s with their notes); Octave shift (`Segmented`, `−2` … `+2`); Touch and Pedal (`Segmented`). Each
writes `setMidi`. `MidiSoundToggle`: a `RailButton` (icon `Volume2`) toggling `sound`. `MidiControl`'s line: the
chosen keyboard's name when one is chosen and connected, "{{device}} is not connected." when away.

Strings, `common` (en / ru):
- `rail.sound`: 'Sound the MIDI keyboard' / 'Звук MIDI-клавиатуры'
- `midi.away`: '{{device}} is not connected.' / '{{device}} не подключена.'
- `midiSettings.device`: `{ label: 'Keyboard', any: 'Any keyboard', away: '{{device}} (not connected)' }` /
  `{ label: 'Клавиатура', any: 'Любая клавиатура', away: '{{device}} (не подключена)' }`
- `midiSettings.sound`: 'Sound the MIDI keyboard' / 'Звук MIDI-клавиатуры'; `soundNote`: 'For a keyboard with no
  speaker' / 'Для клавиатуры без динамика'
- `midiSettings.throughPiano`: 'Play through the piano' / 'Звук через пианино'; `throughPianoNote`: 'The app’s music
  on the keyboard’s own speaker' / 'Музыка приложения — в динамике клавиатуры'
- `midiSettings.octaveShift`: 'Octave shift' / 'Сдвиг октавы'
- `midiSettings.touch`: `{ label: 'Touch', light: 'Light', normal: 'Normal', heavy: 'Heavy' }` /
  `{ label: 'Чувствительность', light: 'Лёгкая', normal: 'Обычная', heavy: 'Тяжёлая' }`
- `midiSettings.pedal`: `{ label: 'Pedal', normal: 'Normal', reversed: 'Reversed' }` /
  `{ label: 'Педаль', normal: 'Обычная', reversed: 'Обратная' }`

- [ ] **Step 1: Tests (red):** Settings (`renderApp('/settings')`) saves each MIDI setting (the store's `midi`
  after each choice); the Keyboard choice lists the fake's devices and keeps a chosen one that is away;
  `MidiControl` names an away keyboard; the rail shows Sound the MIDI keyboard only while connected and toggles
  `sound`; a Russian render has no English (`untranslated.ts`).
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Settings: the MIDI keyboard's group, and its sound in the rail".

## Part 3: Takes

### Task 11: Takes version 2

**Files:** Modify `src/entities/take/model/{types,store}.ts`, `store.test.ts`, `src/entities/take/index.ts`
(export `isTakeId`, `TAKE_NAME_MAX`); `src/features/record-take/model/take-of.ts` (+test), `recorder.ts` (+test);
`src/pages/score-editor/model/use-editor-takes.ts` (saves `fromBar`), every reader of `take.pedal`.

**Produces:**
```ts
export interface PedalPress { readonly pedal: PedalKind; readonly down: number; readonly up: number }
export interface Played {
  readonly notes: readonly TakeNote[]
  readonly pedals: readonly PedalPress[]
  readonly length: number
}
export interface Take extends Played {
  readonly id: TakeId
  readonly pieceId: PieceId
  /** The learner's name for it; none: when it was made. */
  readonly name?: string
  readonly made: number
  readonly tempo: number
  readonly meter: Meter
  /** The piece's bar it was recorded from, from 1. */
  readonly fromBar: number
}
export const TAKE_NAME_MAX = 40
export const TAKES_VERSION = 2
// take-of.ts: Heard's pedal event gains `readonly pedal: PedalKind`
```
Saved form: `pedals` as `[down, up]` for the sustain, `[down, up, 1]` soft, `[down, up, 2]` sostenuto. The
sanitiser reads `pedals`, or a version-1 save's `pedal` (each press the sustain's); a press of any other third value
is dropped; `fromBar` a whole number from 1 (else 1); `name` a string trimmed to 1–40 characters (else none).
`takeOf` keeps a press per pedal kind (each kind down and up on its own); the recorder hands the event's kind on.

- [ ] **Step 1: Tests (red):** a version-1 save reads its presses as the sustain's, `fromBar: 1`, no name; a
  version-2 save round-trips a soft and a sostenuto press and a name; `[0, 100, 7]` is dropped and the take kept; a
  press past the length is dropped; a 41-character name reads as none; `takeOf` keeps the soft and the sustain
  overlapping as two presses; the editor's take is saved with the caret's bar.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Takes: version 2, a name, the bar it starts at and three pedals".

### Task 12: A take heard with its pedals, written, and cut to its bars

**Files:** Create `src/entities/take/model/bars.ts`, `bars.test.ts`; modify `model/sounds.ts` (+test),
`model/midi-file.ts` (+test), `src/entities/take/index.ts`, `src/pages/score-editor/ui/TakeList.tsx` (plays
`takeSounds(take, touch)`, `touch` from `useSettings(selectMidi).touch`).

**Produces:**
```ts
/** A take heard as played: each key's release on to a sustain's up, or a sostenuto's that caught it; under the soft pedal softer; its velocities through the Touch. */
export function takeSounds(take: Take, touch: Touch): NoteSound[]
/** The take heard from `fromMs`: what starts there or later, its time from there. */
export function takeSoundsFrom(take: Take, touch: Touch, fromMs: number): NoteSound[]
export const barMs = (take: Pick<Take, 'meter' | 'tempo'>): number => (beatsPerBar(take.meter) * 60_000) / take.tempo
export const takeBarCount = (take: Take): number => Math.max(1, Math.ceil(take.length / barMs(take)))
/** The take cut to its bars `first`…`last` (from 0) in place (decision 8). */
export function keepBars(take: Take, first: number, last: number): Take
```
```ts
export function keepBars(take: Take, first: number, last: number): Take {
  const count = takeBarCount(take)
  if (!(Number.isInteger(first) && Number.isInteger(last) && 0 <= first && first <= last && last < count))
    throw new RangeError(`Bars ${first}–${last} are not in a take of ${count}`)
  const bar = barMs(take)
  const start = Math.round(first * bar)
  const end = Math.min(Math.round((last + 1) * bar), LONGEST_TAKE_MS)
  return {
    ...take,
    notes: take.notes
      .filter((note) => note.at >= start && note.at < end)
      .map((note) => ({ ...note, at: note.at - start, held: Math.min(note.held, end - note.at) })),
    pedals: take.pedals
      .filter((press) => press.up > start && press.down < end)
      .map((press) => ({
        ...press,
        down: Math.max(press.down, start) - start,
        up: Math.min(press.up, end) - start,
      })),
    length: end - start,
    fromBar: take.fromBar + first,
  }
}
```
`takeSounds`: a note ends at the latest of its release, a sustain press's `up` where `down <= release < up`, and a
sostenuto press's `up` where the note was held as it went down (`at <= down < release`); never past its key's next
strike; its gain `velocityGain(touchVelocity(velocity, touch))`, times `SOFT_GAIN` where a soft press holds its onset.
`midiFile` writes each kind's controller: 64, 66 (sostenuto) and 67 (soft).

- [ ] **Step 1: Tests (red):** a sostenuto press keeps only the note held as it went down; a note struck under the
  soft pedal is two thirds as loud; Heavy makes a soft note softer; `takeSoundsFrom` drops what starts before and
  shifts the rest; `midiFile` bytes hold `B0 42 7F`/`B0 42 00` and `B0 43 7F`/`B0 43 00`; `keepBars` at 120 BPM in
  4/4 (2000 ms bars) keeping bars 1–2 of 4: an onset in bar 0 dropped, one at 2500 moved to 500, one held from 3900
  for 500 cut to 100, a sustain press 1500–2500 clipped to 0–500, length 4000, `fromBar` + 1; a range out of the take
  throws.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Takes: heard with their pedals and the Touch, cut to their bars".

### Task 13: Name a take, keep its bars

**Files:** Create `src/features/manage-takes/rename-take.ts`, `keep-take-bars.ts`; modify `index.ts`,
`manage-takes.test.ts`.

**Produces:**
```ts
/** Names a take: the text trimmed, at most `TAKE_NAME_MAX` characters; empty takes the name away. */
export function renameTake(store: TakesStore, id: TakeId, text: string): void
/** Cuts a take to its bars `first`…`last` (from 0) for good. */
export function keepTakeBars(store: TakesStore, id: TakeId, first: number, last: number): void
```
- [ ] **Step 1: Tests (red):** `renameTake` trims, cuts at 40, takes the name away for `'  '`; an unknown id changes
  nothing; `keepTakeBars` replaces the take with `keepBars`' and keeps the others and `nextTake`.
- [ ] **Step 2:** It fails. **Step 3:** Implement. **Step 4:** It passes; full verify.
- [ ] **Step 5:** Commit "Takes: a name, and keeping a take's bars".

### Task 14: The tune under a take

**Files:** Create `src/pages/score-editor/model/tune.ts`, `tune.test.ts`; modify
`src/features/record-take/model/recorder.ts` (+test), `use-editor-takes.ts`, `ui/RecordPanel.tsx`, the score
editor's page test, locales `editor`.

**Produces:**
```ts
// recorder.ts: RecorderPlan gains
/** What plays under the take from its downbeat (seconds from it): the song's tune, or nothing. */
readonly tune: readonly NoteSound[]
// tune.ts
/** The draft's tune from bar `from` (its index) at its tempo, the hands left out. */
export function tuneOf(draft: Draft, from: number): NoteSound[] {
  const fromTick = barsOf(draft)[from]?.start ?? 0
  const { sounds } = schedule(arrangeDraft(draft), {
    tempo: draft.tempo,
    hands: { rh: false, lh: false, melody: true },
    fromTick,
  })
  return sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
}
```
`startRecorder` plays `plan.tune` at the downbeat after the clicks; Stop's `audio.stop()` ends it. `record()` passes
`tune: settings.recorder.tune && draft.melody.length > 0 ? tuneOf(draft, from) : []`. The Recorder shows a Tune
`SwitchRow` under Click only while the draft has a melody.

Strings, `editor.recorder.tune`: 'Tune' / 'Мелодия'.

- [ ] **Step 1: Tests (red):** `tuneOf` of a draft with a melody from bar 2 starts at 0 s with bar 2's first note and
  holds no hand's notes; the recorder plays the tune at the downbeat (fake audio's `played` at `start + downbeat`)
  and stops it at Stop; the page: Tune shows for a song with a melody, not for one without, and its switch saves
  `recorder.tune`.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Recorder: the song's tune under a take".

### Task 15: The piano roll

**Files:** Create `src/widgets/take-roll/index.ts`, `model/roll.ts`, `model/roll.test.ts`, `ui/TakeRoll.tsx`,
`ui/TakeRoll.test.tsx`, `ui/RollPlayhead.tsx`; locales `editor`.

**Produces:**
```ts
export interface RollNote { readonly midi: Midi; readonly at: number; readonly held: number; readonly shade: 1 | 2 | 3 | 4 }
export interface Roll {
  /** The lanes, highest key first: the take's keys, a key spare above and below (C4–C5 for none). */
  readonly lanes: readonly Midi[]
  readonly length: number
  readonly notes: readonly RollNote[]
  readonly pedals: Readonly<Record<PedalKind, readonly { readonly down: number; readonly up: number }[]>>
  /** Each bar's start (ms) and number, from the take's `fromBar`. */
  readonly bars: readonly { readonly at: number; readonly number: number }[]
  readonly beats: readonly number[]
}
export function rollOf(take: Take): Roll // shade: 1 + min(3, floor(velocity / 32))
export function TakeRoll(props: {
  take: Take
  /** Bars outside, dimmed (Keep bars' choice), from 0. */
  kept?: { readonly first: number; readonly last: number } | undefined
  /** While it plays: when on the audio clock it started, and from where in the take (ms). */
  playing: { readonly at: number; readonly fromMs: number } | null
  onPlayFrom: (bar: number) => void
}): JSX.Element
```
`TakeRoll`: a horizontally scrolling SVG, `takeBarCount(take) * 96` px wide, a lane 8 px high, the notes in the
`foreground` ink at four opacities by shade, a lane each for the sustain, sostenuto and soft under the keys, bar
lines solid and beat lines faint; over it each bar's number is a `<button>` ("Play from bar {{n}}"), which calls
`onPlayFrom(index)`, as does a tap on the roll (its x read against the SVG's box: `stubBox` in tests). `RollPlayhead`
moves a line with a `requestAnimationFrame` loop reading `audio.now()` into a `transform`, no React render a frame;
it stops past the take's end. The roll is `role="img"` with an `aria-label` ("{{notes}} notes over {{bars}} bars").

Strings, `editor.roll`: `{ label: '{{notes}} notes over {{bars}} bars', playFrom: 'Play from bar {{n}}' }` /
`{ label: '{{notes}} нот в {{bars}} тактах', playFrom: 'Играть с такта {{n}}' }`.

- [ ] **Step 1: Tests (red):** `rollOf` lanes for keys 60 and 64 run 65…59; shades for velocities 10, 40, 100,
  127; bars numbered from `fromBar` 3 as 3, 4, 5; a sustain press in its lane; the UI names each bar button and
  calls `onPlayFrom(1)` for bar 2's; a tap at 60 % of a 4-bar roll plays from bar index 2; bars outside `kept` are
  dimmed (`data-dimmed`).
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Take roll: a take drawn by key, loudness, pedal and bar".

### Task 16: The take's page

**Files:** Create `src/pages/score-editor/ui/TakePage.tsx`, `TakePage.test.tsx`, `ui/TakeNameField.tsx`,
`ui/KeepBars.tsx`, `model/use-take-play.ts`; modify `src/pages/score-editor/index.ts`,
`src/app/routes/player-screens.ts` (export `TakePage`), `src/app/router.tsx` (`RouterContext.takes`, the route),
`src/main.tsx`, `src/app/testing/render-app.tsx`, `ui/TakeRow.tsx` (its name a `Link`), `ui/TakeName.tsx` (the name,
else the time), locales `editor`.

**Produces:** the route
```ts
const takeRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/edit/$pieceId/takes/$takeId',
  beforeLoad: async ({ params, context }) => {
    const { editableIn } = await playerScreens()
    const take = isTakeId(params.takeId) ? selectTake(context.takes.getState(), params.takeId) : undefined
    if (!editableIn(context.pieces.getState(), params.pieceId) || take?.pieceId !== params.pieceId)
      throw notFound()
  },
  component: lazyRouteComponent(playerScreens, 'TakePage'),
})
```
`useTakePlay(take)`: `{ playing: { at, fromMs } | null, playFrom(bar), stop() }`: `playFrom` unlocks, stops what
sounds, plays `takeSoundsFrom(take, touch, bar * barMs(take))` at `audio.now() + PLAY_DELAY` and keeps its handle;
`playing` is null once `audio.isPlaying(handle)` is false (`useSyncExternalStore(audio.onSounding, …)`).
`TakePage`: `ScreenHeader` (the take's name; Back to `/edit/$pieceId` with `search: { record: true }`); the name field
(`Input`, `maxLength` 40, the made time as its placeholder, written by `renameTake` on blur and Enter); `TakeRoll`;
Play / Stop from bar 1; Keep bars (First and Last bar `Dropdown`s numbered from `fromBar`, Keep disabled while the
whole take is kept, an `AlertDialog` asking first, then `keepTakeBars`); the `LiveKeyboard` over the take's keys
(`keyboardRange`). A take deleted meanwhile shows `NotFound`.

Strings, `editor.take` (en / ru): `name` 'Name' / 'Название'; `play` 'Play' / 'Сыграть'; `keep` 'Keep bars' /
'Оставить такты'; `first` 'First bar' / 'Первый такт'; `last` 'Last bar' / 'Последний такт'; `keepIt` 'Keep' /
'Оставить'; `keeping` `{ title: 'Keep bars {{first}}–{{last}}?', body: 'The other bars are deleted for good.',
confirm: 'Keep', cancel: 'Cancel' }` / `{ title: 'Оставить такты {{first}}–{{last}}?', body: 'Остальные такты
удалятся навсегда.', confirm: 'Оставить', cancel: 'Отмена' }`; `open` 'Open {{name}}' / 'Открыть {{name}}'.

- [ ] **Step 1: Tests (red):** routing: an unknown take, another piece's take and a bad id are not found; the page
  (`renderApp` with a take saved in its `takesStore`): Play plays the take (fake `played`), a bar's button plays from
  it, the name typed is saved on blur and shown in the list, Keep bars 2–3 asks then cuts the take (its notes and
  `fromBar` in the store); the list's row opens the page; a Russian render has no English.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify and `npm run build`.
- [ ] **Step 5:** Commit "Takes: a page of its own, named, heard on its roll and kept to its bars".

## Part 4: Free play

### Task 17: The live score's model

**Files:** Create `src/widgets/live-score/index.ts`, `model/trail.ts`, `model/trail.test.ts`, `model/live-name.ts`,
`model/live-name.test.ts`.

**Produces:**
```ts
/** A chord of the trail: its keys, lowest first, and when its last key was struck (page clock, ms). */
export interface TrailChord { readonly keys: readonly Midi[]; readonly last: number }
export type Trail = readonly TrailChord[]
export const EMPTY_TRAIL: Trail = []
/** The chord held now and the four before it. */
export const TRAIL_CHORDS = 5
export const CHORD_WINDOW_MS = 50
export function strike(trail: Trail, key: Midi, time: number): Trail {
  const newest = trail.at(-1)
  if (newest && time - newest.last <= CHORD_WINDOW_MS) {
    if (newest.keys.includes(key)) return trail
    const keys = [...newest.keys, key].sort((a, b) => a - b)
    return [...trail.slice(0, -1), { keys, last: time }]
  }
  return [...trail, { keys: [key], last: time }].slice(-TRAIL_CHORDS)
}
/** Chords as whole notes, a bar each in 4/4: the treble from middle C up, spelled in `key`, a name over each. */
export function trailMusic(chords: readonly (readonly Midi[])[], key: Key, names: readonly string[]): TimedMusic
export type LiveName =
  | { readonly kind: 'note'; readonly note: SpelledNote }
  | { readonly kind: 'interval'; readonly interval: ReferenceInterval }
  | { readonly kind: 'chord'; readonly found: FoundChord }
  | { readonly kind: 'none' }
/** One pitch class: its note in `key`; three keys or more that `nameChords` names: the first; two pitch classes: their interval (decision 10). */
export function liveName(keys: readonly Midi[], key: Key): LiveName
```
`trailMusic`: bar `i` starts at `i * 4 * TICKS_PER_BEAT`, `beats: 4`, `blank` the staff with no key in it (both for
an empty trail's one bar); each key `{ midi, spelled: spellInKey(pitchClass(midi), key), hand: midi >= 60 ? 'rh' :
'lh', startTick, durationTicks: 4 * TICKS_PER_BEAT }`; `chords: names.map((symbol, i) => ({ startTick, symbol }))`
for the non-empty names (so the engraver leaves them room). The compound table: `13 → m9, 14 → M9, 15 → A9, 17 →
P11, 18 → A11, 20 → m13, 21 → M13`, else `spanInterval`.

- [ ] **Step 1: Tests (red):** C, E, G struck 20 ms apart are one chord; a key 300 ms later starts the next (the pedal
  changes nothing); the same key twice in the window is one; a sixth chord pushes the first out; `trailMusic` of
  `[[48, 64, 67]]` in D major writes 48 in the bass and 64, 67 in the treble, F♯ spelled `F#` in D major for 66;
  `liveName`: `[60]` C, `[60, 64]` M3, `[60, 74]` M9, `[60, 76]` M3 (no compound 10th), `[60, 64, 67]` C, `[60, 64,
  72]` M3, `[60, 61, 62]` none.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Live score: the trail of chords played, named and written".

### Task 18: The live score on screen

**Files:** Create `src/widgets/live-score/ui/LiveScore.tsx`, `LiveScore.test.tsx`; modify
`src/widgets/chord-finder/index.ts` (export `useChordAbout`), `src/widgets/live-score/index.ts`, locales `practice`.

**Produces:** `LiveScore({ chords, keyParam }: { chords: readonly (readonly Midi[])[]; keyParam: KeyParam })`: each
chord's `liveName` as text (a chord's `symbol`, its left-out tones from `useChordAbout` under it; an interval's
`music:interval.<x>.short`; a note's `noteName`; none: nothing); `notate(trailMusic(...))` in a `useMemo`; a
`LazyScoreView` with `timeBefore={{ count: 4, unit: 4 }}` (no time signature) and, as its children, the names over
each bar at `xAtTick(layout, startTick)` as `SheetLabels` places chord symbols; an `<ol className="sr-only">` of the
names, and the newest in a `role="status"`. With no chords, the empty bar and "Play, and it is written here."

Strings, `practice.freePlay`: `score` 'Live score' / 'Живые ноты'; `empty` 'Play, and it is written here.' /
'Играйте — ноты появятся здесь.'.

- [ ] **Step 1: Tests (red):** C E G then D F A show "C" then "Dm" in order for a screen reader, the newest said;
  `[60, 64, 70]` says its left-out 5th; an empty trail says its empty line; the staff is engraved (`stubFonts`).
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Live score: the chords played on a grand staff, named over each bar".

### Task 19: Teaching diagrams in a URL

**Files:** Create `src/shared/lib/diagram-marks.ts`, `diagram-marks.test.ts`; modify `src/shared/lib/index.ts`.

**Produces:**
```ts
export const DIAGRAM_COLOURS = ['a', 'b'] as const
export type DiagramColour = (typeof DIAGRAM_COLOURS)[number]
export interface DiagramMark { readonly colour: DiagramColour; readonly finger?: Finger }
export type DiagramMarks = ReadonlyMap<Midi, DiagramMark>
const MARK = /^(\d{2,3})([ab])([1-5])?$/
/** `60a3,64a,67b5` read: each mark on the piano kept, a key's last mark standing; anything else left out. */
export function readDiagramMarks(param: string): DiagramMarks
/** The marks written back, lowest key first. */
export function diagramMarksParam(marks: DiagramMarks): string
/** A key tapped: marked as `mark`; tapped again with the same mark, cleared; with another, it takes it. */
export function markKey(marks: DiagramMarks, key: Midi, mark: DiagramMark): DiagramMarks
```
- [ ] **Step 1: Tests (red):** `'60a3,64a,67b5'` reads three marks and writes back the same; `'67b,60a'` writes
  `60a,67b`; `'20a,60z,x,,60b2'` reads only `60b2`; `''` reads none; `markKey` marks, clears with the same mark, and
  changes colour or finger with another.
- [ ] **Step 2:** It fails. **Step 3:** Implement. **Step 4:** It passes; full verify.
- [ ] **Step 5:** Commit "Diagrams: marked keys in a URL".

### Task 20: Free play: Play

**Files:** Create `src/pages/free-play/index.ts`, `model/free-play-view.ts`, `model/use-free-play.ts`,
`ui/FreePlayPage.tsx`, `ui/FreePlayPage.test.tsx`; modify `src/app/routes/practice-search.ts` (+`route-search.test.ts`),
`practice-screens.ts`, `src/app/router.tsx`, `src/pages/practice/ui/PracticePage.tsx` (+test),
`src/shared/ui/page-tiles.ts` (`freePlay: { icon: Piano, paint: 'sky' }`), locales `practice`.

**Produces:**
```ts
export const FREE_PLAY_MODES = ['play', 'mark'] as const
export type FreePlayMode = (typeof FREE_PLAY_MODES)[number]
export interface FreePlayView {
  readonly mode: FreePlayMode
  readonly key: KeyParam
  /** Mark's marks (`diagramMarksParam`). */
  readonly marks: string
}
// practice-search.ts
export const FREE_PLAY_DEFAULTS: FreePlayView = { mode: 'play', key: C_MAJOR_PARAM, marks: '' }
export function readFreePlaySearch(raw: Raw): FreePlayView {
  const key = readKey(raw.key)
  return {
    mode: raw.mode === 'mark' ? 'mark' : 'play',
    key: key ? keyParam(key) : FREE_PLAY_DEFAULTS.key,
    marks: typeof raw.marks === 'string' ? diagramMarksParam(readDiagramMarks(raw.marks)) : '',
  }
}
export const freePlaySearch = routeSearch(readFreePlaySearch, FREE_PLAY_DEFAULTS)
```
The route `/practice/free-play` in the shell, `...freePlaySearch`, `...remembered(readFreePlaySearch, [])`,
`lazyRouteComponent(practiceScreens, 'FreePlayPage')`. `useFreePlay()`: the trail in state; a tap or typed key
(`onKeyPress`) strikes at `performance.now()`, a MIDI key (`useMidiKeyDown`) at its `time`; Clear empties it. The page:
`ScreenHeader` 'Free play' with Back to `/practice`; a bar with Play · Mark (`Segmented`, written with
`useViewChange`), the `KeyChoice` and Clear; `LiveScore`; `ExplorerKeyboard` over C2–C7 (`{ from: midi(36), to:
midi(96) }`). Practice lists Free play as its eighth row.

Strings, `practice` (en / ru): `subjects.freePlay` 'Free play' / 'Свободная игра'; `inside.freePlay` 'Live score ·
Mark' / 'Живые ноты · Отметить'; `freePlay`: `{ title: 'Free play', mode: 'Mode', play: 'Play', mark: 'Mark', clear:
'Clear' }` / `{ title: 'Свободная игра', mode: 'Режим', play: 'Игра', mark: 'Отметить', clear: 'Очистить' }`.

- [ ] **Step 1: Tests (red):** the validator: a bad mode, key or marks read as the defaults or the valid marks;
  `renderApp('/practice/free-play')`: tapping C, E, G at once names C over the staff (fake timers: within 50 ms), a
  key on the fake MIDI is written too, Clear empties the trail, D major spells the bar's F as F♯; Practice's eighth
  row opens it; Russian has no English.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify and `npm run build`.
- [ ] **Step 5:** Commit "Free play: play the piano and see it written and named".

### Task 21: Free play: Mark

**Files:** Modify `src/pages/free-play/model/use-free-play.ts`, `ui/FreePlayPage.tsx` (+test); create
`ui/MarkTools.tsx`; locales `practice`.

**Produces:** in Mark, a tap or a MIDI key calls `markKey(marks, key, { colour, finger })` and writes
`diagramMarksParam` to the URL with `IN_PLACE`; the keyboard's marks are
`{ tone: colour === 'a' ? 'rh' : 'lh', finger }` per key; `MarkTools`: Colour (`NamedSegmented`: Right hand, Left
hand) and Finger (`NamedSegmented`: none, 1–5), component state; Clear empties the marks; the live score shows the
marked keys as one chord (`LiveScore chords={[sortedMarkedKeys]}`, none when there are none).

Strings, `practice.freePlay` (en / ru): `colour` `{ label: 'Colour', a: 'Right hand', b: 'Left hand' }` /
`{ label: 'Цвет', a: 'Правая рука', b: 'Левая рука' }`; `finger` `{ label: 'Finger', none: 'None' }` /
`{ label: 'Палец', none: 'Нет' }`.

- [ ] **Step 1: Tests (red):** in Mark, C tapped with Right hand and 1, then G with Left hand and 5, writes
  `marks=60a1,67b5` and lights both keys with their fingers in the finger row; tapping C again clears it; the score
  names the marked keys; opening `/practice/free-play?mode=mark&marks=60a3,64a,67b5` shows the diagram; Clear empties
  the URL's marks.
- [ ] **Step 2:** They fail. **Step 3:** Implement. **Step 4:** They pass; full verify.
- [ ] **Step 5:** Commit "Free play: Mark, teaching diagrams to send as a link".

## Part 5: Through the piano, and the docs

### Task 22: Play through the piano

**Files:** Create `src/shared/api/audio/midi-sound-output.ts`, `midi-sound-output.test.ts`; modify
`src/shared/api/audio/{types,web-audio,fake-audio,index}.ts` (+tests), `src/shared/api/midi/{types,web-midi,
fake-midi,index}.ts` (+tests), `src/shared/lib/services/types.ts`, `src/app/composition-root.ts` (+test),
`src/features/record-take/model/recorder.ts`, `src/features/connect-midi/use-midi-sync.ts` (+test).

**Produces:**
```ts
// audio/types.ts
/** A keyboard's speaker the app's notes can sound on: times on the page's clock, in ms. */
export interface NoteOutput {
  noteOn(midi: Midi, velocity: number, pageTime: number): void
  noteOff(midi: Midi, pageTime: number): void
  /** Drops what is queued, where the output can. */
  clear(): void
}
// AudioOutput gains
/** The scheduled notes sound on `output` instead of the browser (clicks and recordings stay); null: the browser. */
notesTo(output: NoteOutput | null): void
// midi-sound-output.ts
export function createMidiSoundOutput(output: NoteOutput, pageTimeOf: (audioTime: number) => number): {
  render(note: NoteSound, at: number): void
  stop(): void
}
// midi/types.ts: MidiInput renamed MidiPort (createWebMidiInput → createWebMidi), gaining
/** The names of the keyboards that can sound notes. */
outputs(): readonly string[]
/** The chosen keyboard's speaker, or the first with one under Any keyboard; null where none. */
noteOutput(): NoteOutput | null
```
Web audio: `pageTimeOf(audioTime) = pageNow() + (audioTime - heard()) * 1000`; with an output set, the lookahead's
`render` sends a note to the MIDI sound output (on at its velocity `gainVelocity(note.velocity)`, off at its end) and
a click to the browser as now; `stop()` also stops the MIDI sound output (`clear()`, then note-off now for each key
whose off is still ahead). Web MIDI: `outputs()` from `access.outputs`; `noteOutput()` wraps the matching
`MIDIOutput` (`send([0x90, midi, velocity], time)`, `send([0x80, midi, 64], time)`, `clear` where `'clear' in
output`). `useMidiSync`: with `throughPiano` on and `midi.noteOutput()` there, `audio.notesTo(it)`, re-read on every
status change; off or gone, `audio.notesTo(null)`. Fake MIDI: `noteOutput()` returns a recording output when the test
gives one (`createFakeMidi(status, { output: true })`), its `sent` list readable.

- [ ] **Step 1: Tests (red):** the MIDI sound output sends on and off at the page times of the note's start and end,
  and on `stop()` clears and lets go of a note still sounding; web audio with `notesTo` sends notes and still renders
  clicks; `notesTo(null)` returns notes to the browser; web MIDI lists outputs and sends to the chosen one, timed;
  `useMidiSync` routes with Play through the piano on, and back to the browser when the keyboard goes.
- [ ] **Step 2:** They fail. **Step 3:** Implement, with the rename across its eight files.
- [ ] **Step 4:** They pass; full verify and `npm run build`.
- [ ] **Step 5:** Commit "MIDI: the app's music through the piano's own speaker".

### Task 23: The docs

**Files:** Create `docs/adr/0034-a-key-sounds-while-held-and-free-play-is-the-eighth-place.md`; modify
`docs/adr/0028-a-take-is-kept-as-played-and-written-only-when-asked.md` and
`docs/adr/0030-practice-is-seven-places-one-page-for-each-thing-practised.md` (each: amended by ADR 0034), `docs/UBIQUITOUS_LANGUAGE.md`,
`docs/CODE_STYLE.md`, `PRODUCT.md`, `DESIGN.md`, `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`,
`CLAUDE.md`; mark the spec's status as built.

- [ ] **ADR 0034:** the live voice beside `play()` over the pure damper (and that `stop()` leaves it); the MIDI port
  told the settings by one provider; a take may be named and cut to whole bars (amending ADR 0028); Free play the
  eighth place (amending ADR 0030); through the piano.
- [ ] **Glossary:** Pedal, Velocity, Touch, Sound the MIDI keyboard, Play through the piano, Free play, live score,
  Mark, a take's name (spec §1), with the Russian words.
- [ ] **CODE_STYLE §8:** a hand's key goes through `useLiveVoice`, never `play()`; scheduled music through `play()`.
- [ ] **PRODUCT and DESIGN:** Free play, the take's page and roll, Settings' MIDI group, the rail's Pedal and Sound.
- [ ] **Roadmap:** §5's Live score and Toggle mode built; the "Not for this app" sustain-pedal line removed with a
  pointer to ADR 0034.
- [ ] **CLAUDE.md:** Practice is eight places (Free play `/practice/free-play`); the take's route; `MidiSync`;
  `widgets/take-roll`, `widgets/live-score`, `pages/free-play`; the audio port's live voice, `notesTo`; the MIDI
  port's `configure`, `outputs`, `noteOutput`; `damper.ts`, `velocity.ts`; `diagram-marks.ts`; settings version 9;
  takes version 2.
- [ ] Verify (`npm run typecheck && npm run lint && npm run test && npm run build`); commit "Docs: the piano voice,
  the MIDI keyboard, whole takes and Free play".
