# The playable keyboard: design

- **Status:** agreed 2026-09-26. Sub-project 1 of the roadmap (`2026-09-25-next-features-roadmap-design.md`, §3.1
  holds the decisions from the grilling session). What the session left to Claude is decided here and argued.
  Revised the same day after the two-axis review of its plan: spotlight redefined (§2.4), ‹ › in both swipes and the
  map inside the rail (§2.5, §2.7), a two-line finger row (§2.3), Stop on every button that plays (§2.9), the port's
  play handles in place of a shared playback tracker (§4.2), and the names settled (§3, §4).
- **Builds on:** the live keyboard as built (ADR 0008, `DESIGN.md`'s keyboard): the whole piano on every keyboard,
  every key sounding, a key going down while it sounds or is held on MIDI. All of that stands, except that under
  spotlight (§2.4) the keys down are the ones struck last.
- **References:** GarageBand's keyboard (Scroll · Glissando; octave buttons; small, medium and large keys), Flowkey's
  keys under a dark rail, The Ultimate Piano's learn view (a scale's keys coloured whole, labelled "♭3 E♭", finger
  numbers in circles under the keys), the owner's reference trainer (every key named; the computer keyboard playing
  an octave).

## 1. The faults this fixes

Found in the code, behind what the owner saw:

| Seen                                                               | Cause                                                                                                                       |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Touch and click feel late                                          | A key plays on `click`, which fires when the finger lifts, and a tap then waits `PLAY_DELAY` (100 ms) on the audio clock    |
| A scale's keys "half coloured, cut in two"                         | A scale's note is a band over the lower 40% of the key                                                                      |
| An arpeggio shows every key coloured, the sounding one only dimmed | Its notes ring 1.4 s and start 0.22 s apart, so all are sounding at once and all wear the same down tint                    |
| No Stop after Play                                                 | Play buttons only start sound                                                                                               |
| Keys stubby on one screen, tall on another                         | Every screen sets a fixed height (`h-32`, `h-44`) whatever the keys' width                                                  |

## 2. What the learner sees

### 2.1 A piano's keys, in a piano's proportions

- The keys hang from a dark **rail** (`--key-rail`, drawn 28px: the piano's fascia), which casts a short shade onto
  them (`--key-shade`) and holds the keyboard's buttons and map (§2.5). The rail is drawn at the foot of a 44px strip,
  so its buttons have 44px targets without reaching over a key or outside the keyboard.
- White keys stand apart by a 1px line of **key bed** (`--key-bed`) instead of an outline, and end in a **lip** at the
  front edge (`--key-lip`, the key's thickness, 6px). Black keys end in a lighter **front slope** (`--key-sheen`).
- **Proportions:** the keys are 4.2 times as long as a white key is wide, within 96px and 40% of the screen's height,
  so a phone's Fit keys are about 120px long and a laptop's about 200px; no screen sets a fixed height any more. The
  Player's keyboard, which shares a screen with the sheet, takes the height its layout gives it.
- **Down is physical as well as coloured:** a key going down drops 2px and its lip (a black key's slope) shortens to a
  third, over the colour change a key down already has. Both are transforms; under `prefers-reduced-motion`
  they are immediate.
- Light and dark: the keys, their fills and the finger row stay piano-coloured; the rail and bed stay dark.
- DESIGN.md's **No Glow Rule** gains one exception: the keys' shading (the rail's shade, a key's lip, a black key's
  slope) draws a material, never a colour, and appears nowhere but on keys.

### 2.2 A key plays the instant it is touched

- **Scroll** (default): a key sounds and goes down on `pointerdown`. A swipe moves the keyboard; only the key it
  started on sounds (moving never plays a key in Scroll; the browser takes the swipe and cancels the press).
- **Glissando:** every key a finger crosses sounds, each once per entry, several fingers at once. The keys take the
  finger from the page (`touch-action: none`), so the keyboard stays where it is and moves by ‹ › (§2.5), the map, a
  trackpad or the mouse wheel. On a pinned keyboard the page scrolls from anywhere but the keys.
- A touched key goes down on screen at once, before its sound is heard, and its sound starts at the audio clock's
  now, not after `PLAY_DELAY` (a tap is one note: there is nothing to schedule ahead).
- A pointer's own `click` never plays the key a second time; a click with no pointer before it (Enter or Space on
  the focused key, a screen reader's activation) plays it once.
- The keyboard is still one tab stop; the arrow keys, Home and End walk it.
- GarageBand's third mode, Pitch (portamento), is not taken: a piano has none.

### 2.3 What a key carries

- **Note names** (a saved choice): **C** (default: every C, "C4"), **All** (every key: "C4" on a C, "D", "F♯" on the
  others), **None**. A mark's own label (a degree, ✓, a note name the Player spells) always wins on its key.
- **Finger numbers** sit in circles in a **finger row** under the keys, each under its key, in two staggered lines as
  the keys are: a black key's circle in the upper line, light teal (`--key-scale`); a white key's in the lower line,
  white (`--key-white`) with a line of key bed round it (The Ultimate Piano's info bar). Two lines keep neighbouring
  circles apart at the narrowest keys. The row is there only while a mark carries a finger (the Scales page's
  fingering, the Player's Finger numbers switch), so a key keeps its degree or note name on it. Whole piano's keys are
  too narrow for a circle, so it hides the row (the Scales page's fingering table still shows the fingers).
- **A scale's notes colour the whole key**: the tonic deep teal (`--key-tonic`) with a white label, the other notes
  light teal (`--key-scale`) with an ink label, on white and black keys alike, each labelled with its degree. The band
  goes. (Scales are not chord tones, so the palette law keeps role colours off them.)
- **Letters** of the computer keyboard (§2.8) on the keys it plays, above the key's label, while it can play.

### 2.4 Spotlight: the key sounding now stands out

On the explorers' keyboards (Chords, Scales) and the keyboards over Symbols and the Piece's chart, the keys down are
the ones **struck last** while they sound, not every key still ringing: a block chord's keys are struck together,
so all go down; an arpeggio walks key by key; a scale run and a bar walk note by note. On Chords and Scales, whose keys
are marked, the other marked keys go **quiet** meanwhile (their colour at a low strength under a veil of the plain key,
their label kept, in the plain key's ink). When nothing sounds, every mark is full again. A tapped key is struck like
any other: it stands out for as long as it rings, and the marks go quiet.

The Player and the quiz board do not do this: their marks mean "play these" and stay visible while the learner plays
them, and their keys go down while they sound, as before.

### 2.5 The rail: ‹ ›, the map, the settings button

- **‹ ›** at the rail's two ends move the keyboard an octave down or up, whenever the keys scroll (every size but
  Whole piano), in both swipes: a mouse cannot swipe, so every gesture has a visible alternative (roadmap §4.5).
- **The keyboard map** (§2.7) sits in the rail between ‹ and ›, when it is on: no extra row.
- **The settings button** at the rail's right end ("Keyboard settings") opens a popover with the keyboard's four
  choices (Keys, Swipe, Note names, Keyboard map) and **Play from the computer keyboard**. They are saved for every
  keyboard in the app, so the keyboard the learner adjusts is the one they meet on the next screen, and they are also
  in Settings (§2.10).
- The buttons are 44px targets; their icons (20px) sit in the drawn rail.

### 2.6 Key size

A saved choice, **Keys**:

| Size              | White keys                                          | For                                          |
| ----------------- | --------------------------------------------------- | -------------------------------------------- |
| **Fit** (default) | The screen's range fills the width, 28–48px each    | Every screen as designed                     |
| **Large**         | 56px each; the keyboard scrolls                     | Fingers on a phone: about an octave in view  |
| **Whole piano**   | All 52 white keys fill the width; nothing scrolls   | All 88 keys at once (on a phone, to look)    |

The keys that matter stay in view (`inView`, the range) at every size. **Whole piano** hides ‹ ›, the map (nothing
to move) and the finger row (§2.3).

### 2.7 The keyboard map

A saved choice, off by default (**Keyboard map**): a strip in the rail drawing all 88 keys small, with a frame around
the stretch in view; tap or drag it to move there, or step it an octave at a time with the arrow keys (Home and End
go to the ends). It is a slider named "Keys in view", its value read as "C3 to B4" (the white keys at its edges).
Keys marked or down show as dots under the strip, so a note out of sight is not lost. Hidden with **Whole piano**.

### 2.8 The computer keyboard is a piano

With **Play from the computer keyboard** on (default on where the primary pointer is fine, off on touch screens):

```
 W E   T Y U   O P          C♯ D♯   F♯ G♯ A♯   C♯ D♯
A S D F G H J K L ; '      C  D  E  F  G  A  B  C  D  E  F
Z X: an octave down, an octave up
```

- Read by physical key (`KeyboardEvent.code`), so ЙЦУКЕН, AZERTY and QWERTY play the same notes. Typing starts on
  middle C's octave; Z and X move it between C1 and C8, never further.
- A typed key does exactly what a tap does: it sounds and goes down, then means what the screen makes it mean (a
  quiz's selection, Wait mode's answer).
- The keys it plays carry their letters (Latin, as printed on Russian keyboards too), and after Z or X the keyboard
  scrolls to the typing octave, until the screen's own keys in view change.
- Ignored while the focus is in a text field, with Ctrl, Cmd or Alt held, and on auto-repeat. A key it plays is not
  also the browser's (Firefox's ' opens Quick Find): its default is prevented.
- Every screen shows one keyboard, and that keyboard types. A screen with more than one (the lessons of sub-project
  5) decides in its own design which of them types.

### 2.9 Stop on every Play

Every button that plays a sound turns into **Stop** while its sound plays, and back when the sound ends, is stopped,
or is cut off by another sound: Chords' Play and Arpeggio, Scales' Play up and down, each of Symbols' Hear, the quiz's
Play again and Wait mode's Hear these notes. In a grid of items, the Piece's bars and a scale's chords, each is a
toggle instead: pressed while it plays, a second tap stops it. A tapped key plays on top and cuts nothing off. What a screen sounds by
itself (Chords sounding each choice of root, quality, inversion or hands; the quiz sounding a question) has no button,
so it has no Stop; it cuts off whatever played. The Player's Listen keeps its own Play and Stop.

### 2.10 Settings

A **Keyboard** group between Theme and MIDI keyboard: Keys, Swipe, Note names (`Segmented` each), Keyboard map and
Play from the computer keyboard (`Switch` each, named by the label round it; under the second, while it is on, the
hint "Z X · octave"): the popover's five controls, one component in both places.

## 3. Saved state

`pt-settings` goes to **version 3** with a `keyboard` group:

```ts
interface KeyboardSettings {
  keySize: 'fit' | 'large' | 'piano'
  swipe: 'scroll' | 'glissando'
  namedKeys: 'c' | 'all' | 'none'
  map: boolean
  typing: boolean
}
```

The option lists and their types (`KEY_SIZES`, `SWIPES`, `NAMED_KEYS`) live in `shared/lib/keyboard-choices.ts`,
because the presentational keyboard takes them as props and the settings entity saves them. Defaults: `fit`,
`scroll`, `c`, `false`, and `typing` from `(pointer: fine)` when the store is created (as `detectLocale` reads the
browser's languages; `createSettingsStore` takes it as `finePointer`, so tests choose it). The sanitising `merge` keeps
each saved field that is still valid and takes its default otherwise, so a version-2 save gains the group and nothing
else changes; `migrate` hands the saved state to the same sanitiser. `#theme-boot` reads only `theme`, so it is
untouched.

## 4. How it is built

### 4.1 Pure logic (`shared/lib`, under the 90% coverage gate)

- `music/keyboard.ts`: `octaveOf(key)` (C4 is octave 4), which the keys' names and the map's value text share.
- `keyboard-layout.ts`: `PIANO_LAYOUT` (the whole piano laid out once) and `keyAt(keys, x, y)`, the key under a point
  in fractions of the keyboard (a black key wins where it covers a white one). Glissando hit-tests with it from the
  pointer's position and the keys' box, so it needs no `elementFromPoint` and is tested without a browser.
- `keyboard-view.ts`: the view's frame from the scroller's metrics, the scroll that centres a point of the map, the
  scroll an octave on, and the white keys at the view's edges.
- `typing-keys.ts`: `TYPING_KEYS` (physical code → semitones above the typing C, and its letter), `typedKey(code,
  typingC)`, `moveTypingOctave(typingC, by)` (between C1 and C8), `typingLetters(typingC)`.
- `schedule/sounding.ts`: `keysStruckAt(windows, time)`, the sounding keys struck last (the open windows with the
  latest start), beside `keysSoundingAt`.
- `schedule/sounds.ts`: `placedChordSounds(chord, options)`, a chord as the explorers place it (`placeChord`), struck
  or rolled: what `usePlayChord` did, as data, so a Stop button can play it.
- `shared/ui/piano-keyboard/key-look.ts` (pure, beside the keys it draws): the look gains the label as a mark's or a
  note name, the letter, `quiet`, and the scale fills (`tonic`, `scale`) replacing the band.

### 4.2 The audio port and playback

- `AudioOutput.play()` returns a **`PlayHandle`**; `isPlaying(handle)` says whether any note of that play is sounding
  or still to come: false once its last note ends or `stop()` cuts it off, and false from the start where nothing
  could play (no Web Audio). The port knew what sounds (ADR 0008); now it also knows which play still sounds, so a
  Stop button needs no tracker of its own.
- `AudioOutput.struck()` gives the keys struck last (the same set until it changes), from `keysStruckAt` over the same
  log as `sounding()`. `onSounding` notifies whenever the keys sounding or struck change, a play ends, or `stop()`
  runs (even before any note sounded).
- `usePlay()` returns the handle; `useSoundKey()` plays a tap at `audio.now()`; `useSoundingKeys('struck')` reads the
  struck keys.
- `usePlayback<Id>()` (`shared/lib/services`) is a Play button's state, local to the component: `playing` (the id
  it last played, while that play's handle still plays) and `toggle(id, sounds)` (stop what plays under that id, or
  cut off what sounds and play). Two buttons need no shared state: the second's play cuts the first's off, and the
  port says so. `usePlayChord` goes: its callers become Stop buttons over `placedChordSounds`.

### 4.3 The keyboard (`shared/ui/piano-keyboard`, presentational)

- `PianoKeyboard` gains `keySize`, `swipe`, `namedKeys`, `map`, `letters`, `quiet`, `height` (`'proportional'` or
  `'fill'`, the Player's) and `children`: the rail's trailing controls, a slot rather than a flag per button
  (CODE_STYLE §4). It renders the rail (‹ ›, the map, the slot), the keys, and the finger row under them, and keeps a
  set of keys pressed by pointers, drawn down at once.
- `use-key-pointers.ts`: both swipes' pointer handling. It needs no pointer capture: a touch or pen is captured by the
  key it went down on (implicit capture), so its moves and its lift reach the keys' group; a mouse released outside
  the keys is forgotten at its next move (no buttons held).
- `RailButton` (exported, so `LiveKeyboard`'s settings button looks the same), `KeyboardMap`, `FingerRow`,
  `use-scroll-view.ts` (the scroller's view for the map, followed on scroll and resize).
- Height: the keys' box is `clamp(96px, 4.2 × white-key width, 40dvh)`, worked out in container units; the Player
  passes `height="fill"`.

### 4.4 `features/live-keyboard`

- `LiveKeyboard` reads the keyboard settings from the store and passes them on; with `spotlight`, its keys down are
  the struck ones (and the held ones) and its marked keys not struck go quiet while any key is struck. Without, keys
  go down while they sound or are held, as now. It fills the rail's slot with `KeyboardSettingsButton`.
- `use-typing.ts`: the `keydown` listener on `window`, the typing octave (component state, not saved), the letters,
  and the keys in view after Z or X.
- `KeyboardSettingsFields`: the five controls, in the popover and in Settings, writing through `setKeyboard`
  (`features/set-preference`), one command with a partial change.
- `ExplorerKeyboard` passes `spotlight` and loses its fixed height.

### 4.5 Screens

- Chords, Scales, Symbols and the Piece show spotlight; every Play button of §2.9 uses `usePlayback`.
- Scales: keys are labelled by degree, the tonic `tonic` and the others `scale`; its Degrees · RH fingers · LH fingers
  switch becomes **Fingers: None · Right hand · Left hand**, the fingers in the row under the keys. The URL's `view`
  becomes `fingers` (`none` · `rh` · `lh`, default `none`), since `view` no longer names what it holds; an old link's
  `view` is ignored. The switch shows only for a scale with a fingering.
- The Piece: its chart's bars are toggles while their sound plays (`ChordChart`'s `playing`, `BarButton`'s
  `pressed`); the Player's chart keeps `current` for its cursor.
- Player: with Finger numbers on, the keys keep their note names and the fingers go in the row; `height="fill"`.
- Every screen drops its fixed keyboard height (`ExplorerKeyboard`'s `h-44`, the quiz's `h-44`, Symbols' and the
  Piece's `h-32`).
- Settings: the Keyboard group.

## 5. i18n

`common`: `rail` (Octave down / «Октава вниз», Octave up / «Октава вверх», Keys in view / «Клавиши на экране»,
"{{from}} to {{to}}" / «{{from}} – {{to}}», Keyboard settings / «Настройки клавиатуры»); `keyboardSettings` (Keys /
«Клавиши»: Fit, Large, Whole piano / «По ширине», «Крупные», «Весь рояль»; Swipe / «Свайп»: Scroll, Glissando /
«Прокрутка», «Глиссандо»; Note names / «Названия нот»: C, All, None / C, «Все», «Нет»; Keyboard map / «Карта
клавиатуры»; Play from the computer keyboard / «Играть с клавиатуры компьютера»; "Z X · octave" / «Z X · октава»);
`stop` (Stop / «Стоп»). `settings`: `keyboard` (Keyboard / «Клавиатура»). `theory`: `fingers` (Fingers / «Аппликатура»,
None / «Нет»), replacing `view`; Right hand and Left hand are `common:hands`.

## 6. States and edge cases

| Situation                                              | Behaviour                                                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| A swipe in Scroll                                      | The first key sounds; the keyboard scrolls; the press is cancelled; nothing else sounds |
| A pointer's tap                                        | One sound (the `click` after it does not play again)                               |
| Enter or Space on the focused key; a screen reader's activation | One sound                                                                |
| A swipe leaves the keys in Glissando and comes back    | Each key it enters sounds once per entry                                           |
| A mouse released outside the keys in Glissando         | Forgotten at its next move; nothing more sounds                                    |
| Two fingers in Glissando                               | Each plays its own keys                                                            |
| A mouse in Scroll                                      | ‹ ›, the map, the wheel or a trackpad move the keyboard                            |
| Whole piano on a phone                                 | Every key shows; taps work; ‹ ›, the map and the finger row hidden                 |
| Typing while a text field is focused                   | Nothing plays; the field types                                                     |
| Z or X past C1 or C8                                   | Nothing moves                                                                      |
| Play, then Arpeggio                                    | Play turns back; Arpeggio shows Stop                                               |
| Stop pressed before the first note sounds              | Silence; the button turns back                                                     |
| A browser without Web Audio                            | Keys go down on touch; nothing sounds; every Play button stays Play                |
| A tap on a key while the explorer is silent            | The tapped key stands out for as long as it rings; the marks go quiet              |
| A scale with no fingering                              | No Fingers switch; the keys carry their degrees                                    |
| A saved `keyboard` group with an unknown value         | That field takes its default; the others stand                                     |

## 7. Accessibility

The keys stay one tab stop with the arrow keys, Home and End. ‹ ›, the settings button and the map have 44px targets;
‹ › and the settings button are labelled buttons; the map is a slider with a name and a value text. Letters, note
names and finger numbers are `aria-hidden`: each key is already named by its note. A Play button that turns into
Stop changes its name with it; a button in a grid of items (a Piece's bar, a scale's chord) is a toggle instead,
`aria-pressed` while it plays, and keeps its name.

## 8. Testing

Test first. Unit: `octaveOf`; `keyAt` (white, black over white, the edges); the view's math (frame, a point, an
octave step at the ends, the edge keys); the typing keys (the layout, the piano's ends); `keysStruckAt` (a block
chord, an arpeggio, a run, before the first note); `placedChordSounds`; `keyLook` (names, letters, quiet, the scale
fills); the settings sanitiser (a version-2 save, unknown values, the typing default). The port: `struck()` and the
play handles in the log, the fake and the WebAudio adapter (a play's end, `stop()` before any note, no Web Audio).
Hooks: `usePlayback` (Stop until the last note ends, a second tap stops, another sound cuts it off, a tap does not).
Components: Scroll (a pointer press plays at once; its click plays nothing more; moving plays nothing; a cancel lifts
the key), Glissando (a swipe presses each key once per entry, two pointers, a mouse released outside, its click plays
nothing more, Enter still plays), ‹ › (in both swipes, not with Whole piano, a scroll an octave on), the map (its
value text, the arrow keys), the finger row (two lines), the settings popover (changes the saved choices), typing (a
code plays its key, Z and X move, ignored in a text field, with a modifier or on repeat, default prevented), spotlight
(an arpeggio's keys go quiet but the struck one). Screens: Chords' Play becomes Stop and back; Scales' fingers under
the keys; Symbols' Hear; a Piece's bar; the quiz's Play again; Wait mode's Hear these notes; Settings' Keyboard group.
jsdom lays nothing out: `src/shared/test/layout.ts` gives an element its box, and the page scroll metrics with a
`scrollTo` that moves it, where a pointer's position or a scroll matters.

## 9. Records

DESIGN.md (the keys, the rail, the finger row, the scale fills, spotlight, Stop, the No Glow Rule's exception, the
frontmatter's key colours), CODE_STYLE §1 (the keyboard settings, spotlight), §5 (the key tokens; values worked out at
runtime go in `style`), §8 (play handles, `usePlayback`), §9 (the layout stubs), the glossary (**Rail**, **Keyboard
map**, **Typing keys**, **Spotlight** and **Struck**, **Finger row**, **Keyboard settings**, **Key size**, **Note
names**; **Down** revised), ADR 0009 (the keyboard is an instrument: its look is a material, a key plays on touch, a
swipe scrolls or plays by the learner's choice, typing reads physical keys, a play's handle says whether it still
sounds), CLAUDE.md (`live-keyboard`, `services`, `pt-settings` version 3, the new `shared/lib` modules, the test
helpers).
