# The playable keyboard: design

- **Status:** agreed 2026-09-26. Sub-project 1 of the roadmap (`2026-09-25-next-features-roadmap-design.md`, §3.1
  holds the decisions from the grilling session). What the session left to Claude is decided here and argued.
- **Builds on:** the live-keyboard design (`2026-09-25-live-keyboard-design.md`): the whole piano on every keyboard,
  every key sounding, a key going down while it sounds or is held on MIDI. All of that stands.
- **References:** GarageBand's keyboard (Scroll · Glissando; octave buttons; small, medium and large keys), Flowkey's
  keys under a dark rail, The Ultimate Piano's learn view (a scale's keys coloured whole, labelled "♭3 E♭", finger
  numbers in circles under the keys), the owner's reference trainer (every key named; the computer keyboard playing
  an octave).

## 1. The faults this fixes

Found in the code, behind what the owner saw:

| Seen                                         | Cause                                                                                              |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Touch and click feel late                    | A key plays on `click`, which fires when the finger lifts, and a tap then waits `PLAY_DELAY` (100 ms) on the audio clock |
| A scale's keys "half coloured, cut in two"   | A scale's note is a band over the lower 40% of the key                                             |
| An arpeggio shows every key coloured, the sounding one only dimmed | Its notes ring 1.4 s and start 0.22 s apart, so all are sounding at once and all wear the same down tint |
| No Stop after Play                           | Play buttons only start sound                                                                      |
| Keys stubby on one screen, tall on another   | Every screen sets a fixed height (`h-32`, `h-44`) whatever the keys' width                         |

## 2. What the learner sees

### 2.1 A piano's keys, in a piano's proportions

- The keys hang from a dark **rail** (`--key-rail`, 28px, the piano's fascia), which casts a short shadow onto them
  and holds the keyboard's buttons (§2.5).
- White keys stand apart by a 1px gap of **key bed** (`--key-bed`) instead of an outline, with a faint shade under
  the rail and a **lip** at the front edge (`--key-lip`, the key's thickness, 6px). Black keys are shaded toward the
  player and end in a lighter **front slope** (`--key-black-slope`).
- **Proportions:** the keys are 4.2 times as long as a white key is wide, within 96px and 40% of the screen's height,
  so a phone's Fit keys are about 120px long and a laptop's about 200px; no screen sets a fixed height any more. The
  Player's keyboard, which shares a screen with the sheet, takes the height its layout gives it.
- **Down is physical as well as coloured:** a key going down drops 2px and its lip (a black key's slope) shortens,
  over the colour change the live-keyboard design gave it. Under `prefers-reduced-motion` the drop is immediate.
- Light and dark: the keys stay piano-coloured, the rail and bed stay dark.
- DESIGN.md's **No Glow Rule** gains one exception: the keys' shading (the rail's shadow, a key's shade, lip and
  slope) draws a material, never a colour, and appears nowhere but on keys.

### 2.2 A key plays the instant it is touched

- **Scroll** (default): a key sounds and goes down on `pointerdown`. A swipe moves the keyboard; only the key it
  started on sounds (a finger that moves past a small slop is scrolling, and no later key plays).
- **Glissando:** every key a finger crosses sounds, each once per entry, several fingers at once. The keys take the
  finger from the page (`touch-action: none`), so the keyboard stays where it is and moves by ‹ › (§2.5), a trackpad
  or the mouse wheel. On a pinned keyboard the page scrolls from anywhere but the keys.
- A touched key goes down on screen at once, before its sound is heard, and its sound starts at the audio clock's
  now, not after `PLAY_DELAY` (a tap is one note: there is nothing to schedule ahead).
- The keyboard is still one tab stop; Enter and Space play the focused key.
- GarageBand's third mode, Pitch (portamento), is not taken: a piano has none.

### 2.3 What a key carries

- **Note names** (a saved choice): **C** (default: every C, "C4"), **All** (every key, black keys too), **None**.
  A mark's own label (a degree, ✓) always wins on its key.
- **Finger numbers** sit in circles in a row under the keys, each under its key: a white circle under a white key,
  a light-teal one under a black key (The Ultimate Piano's info bar). The row is there only while fingers are shown
  (the Scales page's fingering, the Player's Finger numbers switch), so a key keeps its degree or note name on it.
- **A scale's notes colour the whole key**: the tonic deep teal (`--key-tonic`) with a white label, the other notes
  light teal (`--key-scale`) with an ink label, on white and black keys alike, each labelled with its degree. The band
  goes. (Scales are not chord tones, so the palette law keeps role colours off them.)
- **Letters** of the computer keyboard (§2.6) on the keys it plays, while it can play.

### 2.4 The key sounding now stands out

On the explorers' keyboards (Chords, Scales, Symbols, the Piece's chart), while the app plays, the key struck last
stands out: it keeps its full colour and is down, and the other marked keys, still ringing or not yet played, go
**quiet** (their colour at a low strength, their label kept). A block chord's keys are struck together, so all stand
out; an arpeggio walks key by key; a scale run walks note by note. When nothing sounds, every mark is full again. The
Player and the quiz board do not do this: their marks mean "play these", and must stay visible while the learner
plays them.

### 2.5 The rail: ‹ ›, the options button

- **‹ ›** at the rail's two ends move the keyboard an octave down or up. They show only in **Glissando**, where a swipe
  plays instead of scrolling.
- **The options button** at the rail's right end opens a popover with the keyboard's four choices (Keys, Swipe, Note
  names, Keyboard map) and **Play from the computer keyboard**. They are saved for every keyboard in the app, so the
  keyboard the learner adjusts is the one they meet on the next screen, and they are also in Settings (§2.8).
- The buttons are drawn 28px within the rail and answer to 44px, the extra reaching upward outside the keyboard,
  never over a key.

### 2.6 Key size

A saved choice, **Keys**:

| Size              | White keys                                          | For                                          |
| ----------------- | --------------------------------------------------- | -------------------------------------------- |
| **Fit** (default) | The screen's range fills the width, 28–48px each    | Every screen as designed                     |
| **Large**         | 56px each; the keyboard scrolls                     | Fingers on a phone: about an octave in view  |
| **Whole piano**   | All 52 white keys fill the width; nothing scrolls   | All 88 keys at once (on a phone, to look)    |

The keys that matter stay in view (`inView`, the range) at every size. **Whole piano** hides ‹ › (nothing to move).

### 2.7 The keyboard map

A saved choice, off by default (**Keyboard map**): a thin strip over the rail drawing all 88 keys small, with a frame
around the stretch in view; tap or drag it to move there, or step it an octave at a time with the arrow keys (a slider
named "Keys in view", its value read as "C3 to B4"). Keys marked or down show as dots, so a note out of sight is not
lost. Hidden with **Whole piano**.

### 2.8 The computer keyboard is a piano

With **Play from the computer keyboard** on (default on where the primary pointer is fine, off on touch screens):

```
 W E   T Y U   O P          C♯ D♯   F♯ G♯ A♯   C♯ D♯
A S D F G H J K L ; '      C  D  E  F  G  A  B  C  D  E  F
Z X: an octave down, an octave up
```

- Read by physical key (`KeyboardEvent.code`), so ЙЦУКЕН, AZERTY and QWERTY play the same notes. Typing starts on
  middle C's octave; Z and X move it, never past the piano's ends.
- A typed key does exactly what a tap does: it sounds and goes down, then means what the screen makes it mean (a
  quiz's selection, Wait mode's answer).
- The keys it plays carry their letters (Latin, as printed on Russian keyboards too), and the keyboard scrolls to the
  typing octave when it moves.
- Ignored while the focus is in a text field, with Ctrl, Cmd or Alt held, and on auto-repeat.
- One keyboard types at a time: the one mounted last.

### 2.9 Stop on every Play

A button that plays turns into **Stop** while its sound plays, and back when it ends or is stopped: Chords' Play and
Arpeggio, Scales' Play up and down, Symbols' Hear, the Piece's tapped bar (the playing bar shows as playing; tapping
it again stops it). Starting another sound turns the first button back, since the second cuts the first off.

### 2.10 Settings

A **Keyboard** group between Theme and MIDI keyboard: Keys, Swipe, Note names (`Segmented` each), Keyboard map and
Play from the computer keyboard (`Switch` each), the popover's five controls.

## 3. Saved state

`pt-settings` goes to **version 3** with a `keyboard` group:

```ts
interface KeyboardPrefs {
  size: 'fit' | 'large' | 'piano'
  swipe: 'scroll' | 'glissando'
  names: 'c' | 'all' | 'none'
  map: boolean
  typing: boolean
}
```

Defaults: `fit`, `scroll`, `c`, `false`, and `typing` from `(pointer: fine)` when the store is created (as
`detectLocale` reads the browser's languages; `createSettingsStore` takes it as an argument, so tests choose it). The
sanitising `merge` keeps each saved field that is still valid and takes its default otherwise, so a version-2 save
gains the group and nothing else changes; `migrate` passes the saved state on, as now. `#theme-boot` reads only
`theme`, so it is untouched.

## 4. How it is built

### 4.1 Pure logic

- `shared/lib/keyboard-layout.ts`: `keyAt(keys, x, y)`, the key under a point in fractions of the keyboard (a black
  key wins where it covers a white one). Glissando hit-tests with it from the pointer's position and the keys' box,
  so it needs no `elementFromPoint` and is tested without a browser.
- `shared/lib/typing-keys.ts`: `TYPING_KEYS` (physical code → semitones above the typing C, and its letter),
  `typedKey(code, typingC)`, `moveTypingOctave(typingC, by)` (bounded by the piano), `typingLetters(typingC)`.
- `shared/lib/schedule/sounding.ts`: `keysStruckAt(windows, time)`, the sounding keys struck last (the open windows
  with the latest start), beside `keysSoundingAt`.
- `shared/ui/piano-keyboard/key-look.ts`: the look gains the note name, the letter, the finger, `quiet`, and the scale
  fills (`tonic`, `scale`) replacing the band.
- `shared/ui/piano-keyboard/navigator.ts`: the map's frame from a scroll position, a scroll position from a point on
  it, and its value text's range.

### 4.2 The audio port

`AudioOutput` gains `struck(): ReadonlySet<Midi>` (the same set until it changes, notified through `onSounding`),
from `keysStruckAt` over the same log as `sounding()`; both adapters implement it. `useSoundKey` plays a tap at
`audio.now()`. A new `usePlayback()` (`shared/lib/services`) plays a sound under an id and says which id is playing
until its last note ends or `stop()` is called, reading the port's clock when its sounding keys change: the Stop
buttons' one source.

### 4.3 The keyboard (`shared/ui/piano-keyboard`, presentational)

- `PianoKeyboard` gains `size`, `swipe`, `names`, `letters`, `quiet`, and `children`: the rail's trailing controls, a
  slot rather than a flag per button (CODE_STYLE §4). It renders the map (when asked), the rail with ‹ › in Glissando,
  the keys, and the finger row under them. It keeps a local set of keys pressed by pointers, drawn down at once.
- `use-glissando.ts` and `use-scroll-press.ts`: pointer handling for each swipe; `KeyboardMap` (the strip);
  `FingerRow`.
- Height: the keys' box is `clamp(96px, 4.2 × white-key width, 40dvh)` in container units; the Player overrides it.

### 4.4 `features/live-keyboard`

- `LiveKeyboard` reads the keyboard's choices from the settings store, adds `down` (sounding and held) and `quiet`
  (with `spotlight`, from the port's struck keys), and fills the rail's slot with `KeyboardOptions` (the popover).
- `use-typing.ts`: one keyboard types at a time (a stack of the mounted keyboards that may type; the last one types),
  the `keydown` listener on `window` for that one only, the typing octave (component state, not saved).
- The popover and the Settings group write through `setKeyboardPrefs` (`features/set-preference`), one command with
  a partial update.

### 4.5 Screens

- Chords, Scales, Symbols and the Piece pass `spotlight`; their Play buttons use `usePlayback`.
- Scales: keys are labelled by degree; its Degrees · RH fingers · LH fingers switch becomes **Fingers: None · Right
  hand · Left hand**, the fingers in the row under the keys (the URL's `view` keeps its values `degrees`, `rh`,
  `lh`).
- Player: with Finger numbers on, the keys keep their note names and the fingers go in the row.
- Every screen drops its fixed keyboard height.
- Settings: the Keyboard group.

## 5. i18n

`common`: the rail and map (Octave down, Octave up, Keyboard options, Keys in view, "{{from}} to {{to}}"), the five
choices and their options (Keys: Fit, Large, Whole piano / «По ширине», «Крупные», «Весь рояль»; Swipe: Scroll,
Glissando / «Прокрутка», «Глиссандо»; Note names: C, All, None / C, «Все», «Нет»; Keyboard map / «Карта клавиатуры»;
Play from the computer keyboard / «Играть с клавиатуры компьютера») and the octave keys' hint ("Z X · octave" /
«Z X · октава»), Stop. `settings`: the group's title. `theory`: Fingers, None.

## 6. States and edge cases

| Situation                                           | Behaviour                                                                    |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| A swipe in Scroll                                   | The first key sounds; the keyboard scrolls; no other key sounds              |
| A swipe leaves the keys in Glissando and comes back | Each key it enters sounds once per entry                                     |
| Two fingers in Glissando                            | Each plays its own keys                                                      |
| Whole piano on a phone                              | Every key shows; taps work; ‹ › and the map hidden                           |
| Typing while a text field is focused                | Nothing plays; the field types                                               |
| Z or X past the piano's end                         | Nothing moves                                                                |
| Play, then Arpeggio                                 | Play turns back; Arpeggio shows Stop                                         |
| A tap on a marked key while the explorer is silent  | The tapped key stands out for as long as it rings                            |
| A saved `keyboard` group with an unknown value      | That field takes its default; the others stand                               |

## 7. Accessibility

The keys stay one tab stop with the arrow keys, Home and End. ‹ › and the options button are labelled buttons with
44px targets. The map is a slider with a name and a value text. Letters, note names and finger numbers are
`aria-hidden`: each key is already named by its note. A Play button that turns into Stop changes its name with it.

## 8. Testing

Test first. Unit: `keyAt` (white, black over white, the edges), the typing keys (the layout, the piano's ends),
`keysStruckAt` (a block chord, an arpeggio, a run), the navigator's math, `keyLook` (names, letters, fingers, quiet,
the scale fills), the settings sanitiser (a version-2 save, unknown values, the typing default). Adapters: `struck()`
in the fake and the WebAudio adapter. Hooks: `usePlayback` (playing until the last note ends, `stop`, a second sound
takes over). Components: Scroll (a pointer press plays at once; a moved pointer plays nothing more), Glissando (a swipe
presses each key once per entry, two pointers, a pointer's click does not play twice, Enter still plays), ‹ ›, the
map, the options popover (changes the saved choices), typing (a code plays its key, Z and X move, ignored in a text
field, with a modifier or on repeat; only the last keyboard types), the finger row, spotlight (an arpeggio's keys go
quiet but the struck one). Screens: Chords' Play becomes Stop and back; Scales' fingers under the keys; Settings'
Keyboard group. jsdom lays nothing out, so a test gives the keys' group its box where a pointer's position matters.

## 9. Records

DESIGN.md (the keys, the rail, the finger row, the scale fills, spotlight, the No Glow Rule's exception), CODE_STYLE
§1 (the keyboard's choices, spotlight, `usePlayback`) and §5 (the key tokens), the glossary (**Rail**, **Keyboard
map**, **Typing keys**, **Spotlight**, **Finger row**), ADR 0009 (the keyboard is an instrument: its look is a
material, a key plays on touch, a swipe scrolls or plays by the learner's choice, typing reads physical keys),
CLAUDE.md's `live-keyboard` line.
