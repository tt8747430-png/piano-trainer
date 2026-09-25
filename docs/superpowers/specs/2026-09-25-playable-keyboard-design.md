# The playable keyboard: design

- **Status:** decided 2026-09-25. Sub-project 1 of the roadmap (`2026-09-25-next-features-roadmap-design.md`). The
  owner asked for "a more adaptable keyboard: switch the full mode or not the full mode keyboard, or switch between
  GarageBand's glissando or scroll mode; the keyboard look should be improved". Everything below is Claude's
  decision, argued where it is not obvious.
- **Builds on:** the live-keyboard design (`2026-09-25-live-keyboard-design.md`): the whole piano on every keyboard,
  every key sounding, a key going down while it sounds or is held on MIDI. All of that stands.
- **References:** GarageBand's keyboard (Scroll · Glissando · Pitch; octave down, reset, up; small, medium and large
  keys; one or two rows), Flowkey's keys under a dark rail, the owner's reference trainer (steinway.web.app: every key
  named, the computer keyboard playing an octave with its letters on the keys).

## 1. What the learner sees

### 1.1 The keys look like a piano's

- The keys hang from a dark **rail** across the keyboard's top (`--key-rail`, the piano's fascia), which casts a short
  shadow onto them.
- White keys stand apart by a 1px gap of **key bed** (`--key-bed`) instead of an outline. Each has a faint shade
  under the rail and a **lip** at its front edge (`--key-lip`, the key's thickness, 6px).
- Black keys are shaded toward the player and end in a lighter **front slope** (`--key-black-slope`).
- **Down is physical as well as coloured:** a key going down drops 2px and its lip (a black key's slope) shortens,
  over the colour change the live-keyboard design gave it (`--key-down`, or `--key-down-tint` over a coloured key).
  With `prefers-reduced-motion` the drop is immediate, as every transition is (theme.css).
- Light and dark: the keys stay piano-coloured in both themes (as now), and the rail and bed stay dark.
- **DESIGN.md's No Glow Rule** gains one exception: the keys' shading (the rail's shadow, a key's shade, lip and
  slope) draws a material, never a colour, and appears nowhere but on keys. This is Mindscape's printed-card exception
  in this app's terms: chrome follows the tokens, a material may have depth.

### 1.2 Note names

A saved choice, **Note names**: **C** (default: every C carries its octave, "C4", as GarageBand marks its Cs),
**All** (every key its name, black keys too, as the reference trainer does), **None**. A mark's own label (a degree,
a finger, ✓) always wins over a note name on its key, so a coloured key still carries its meaning. Names sit at the
bottom of a key in `--on-key-white` / `--on-key-black`, smaller than a mark's label.

### 1.3 Key size: the "full mode"

A saved choice, **Keys**:

| Size            | White keys                                           | For                                               |
| --------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **Fit** (default) | The screen's range fills the width, 28–48px each (today) | Every screen as designed                          |
| **Large**       | 56px each; the keyboard scrolls                      | Fingers on a phone: about an octave in view        |
| **Whole piano** | All 52 white keys fill the width; nothing scrolls    | Seeing all 88 keys at once (on a phone, to look, not to tap) |

Whichever size, the keyboard keeps the keys that matter in view (`inView`, the range), as today.

### 1.4 Swipe: Scroll or Glissando

A saved choice, **Swipe**:

- **Scroll** (default, today's behaviour): a swipe moves the keyboard; a tap plays a key when the finger lifts
  without moving.
- **Glissando:** a key plays the moment a finger touches it, and a swipe plays every key it crosses, each once per
  entry, several fingers at once, as GarageBand's glissando does. A swipe that starts on the keys no longer scrolls
  the keyboard or the page (the keys take the finger, `touch-action: none`); the keyboard moves by its navigator strip
  (§1.5), a trackpad or the mouse wheel.
- GarageBand's third mode, Pitch (portamento), is not taken: a piano has none.

### 1.5 The toolbar: navigator, options, full screen

Every keyboard carries one 44px row above its keys:

- **The navigator strip** (flexible width): all 88 keys drawn small, with a frame around the stretch in view; tap or
  drag it to move the keyboard there, or use the arrow keys an octave at a time (it is a slider named "Keys in view",
  its value read as "C3 to B4"). Keys that are marked or down show as dots in the strip, so a note out of sight is
  never lost. With **Whole piano** everything is in view, so the strip is hidden and the row keeps its buttons.
- **Keyboard options** (a round button, a popover): Keys, Swipe, Note names (each a `Segmented`) and **Play from the
  computer keyboard** (a switch, §1.7). They change the saved choices for every keyboard in the app, so the keyboard
  the learner adjusts is the one they meet on the next screen.
- **Full screen** (a round button): the same keyboard fills the screen (§1.6).

### 1.6 Full screen

A full-screen dialog holding the same keyboard, with the same marks, the same keys down and the same meaning of a tap
(a quiz's selection, Your turn's answer), under a header with its name and a close button (Escape closes too). The
keys take all the height the toolbar leaves. The screen underneath keeps going: Listen keeps playing and its keys go
down here. On a phone on its side this is the whole screen of keys.

### 1.7 The computer keyboard is a piano

With **Play from the computer keyboard** on, a computer's keys play the keyboard, GarageBand's Musical Typing layout,
read by physical key (`KeyboardEvent.code`), so ЙЦУКЕН, AZERTY and QWERTY play the same notes:

```
 W E   T Y U   O P          C♯ D♯   F♯ G♯ A♯   C♯ D♯
A S D F G H J K L ; '      C  D  E  F  G  A  B  C  D  E  F
Z X: an octave down, an octave up
```

- Typing starts on middle C's octave; Z and X move it, never past the piano's ends.
- A typed key does exactly what a tap does: it sounds and goes down, then means what the screen makes it mean.
- While typing is on, the keys it plays carry their letters (Latin, as printed on Russian keyboards too), and the
  keyboard scrolls to show the typing octave when it moves.
- Typing is ignored while the focus is in a text field, with Ctrl, Cmd or Alt held (shortcuts stay shortcuts), and on
  a key held down (no auto-repeat).
- **One keyboard types at a time:** the one opened last, so the full-screen keyboard types while it is open and the
  screen's own keyboard types again when it closes.
- The switch defaults to on where the primary pointer is fine (a computer) and off on touch screens; the learner's
  choice then stands.

### 1.8 Settings

Settings gains a **Keyboard** group between Theme and MIDI keyboard: Keys, Swipe, Note names (`Segmented` each) and
Play from the computer keyboard (`Switch`), the same four choices as the options popover.

## 2. Saved state

`pt-settings` goes to **version 3** with a `keyboard` group:

```ts
interface KeyboardPrefs {
  size: 'fit' | 'large' | 'piano'
  swipe: 'scroll' | 'glissando'
  names: 'c' | 'all' | 'none'
  typing: boolean
}
```

Defaults: `fit`, `scroll`, `c`, and `typing` from `(pointer: fine)` when the store is created (as `detectLocale`
reads the browser's languages). The sanitising `merge` keeps each saved field that is still valid and takes the
default otherwise, so a version-2 save gains the group and nothing else changes; `migrate` passes the saved state on,
as it does now. `#theme-boot` reads only `theme`, so it is untouched (its test stays green).

## 3. How it is built

### 3.1 Pure logic (`shared/lib`)

- `keyboard-layout.ts` gains `keyAt(keys, x, y)`: the key under a point given in fractions of the keyboard's width
  and height; a black key wins where it covers a white one. Glissando hit-tests with it from the pointer's position
  and the keyboard's box, so it needs no `elementFromPoint` and is tested without a browser.
- `typing-keys.ts`: `TYPING_KEYS` (physical code → semitones above the typing C, and the letter shown),
  `typedKey(code, typingC)`, `moveTypingOctave(typingC, by)` (bounded by the piano) and `typingLetters(typingC)`.
- `navigator.ts` (beside the keyboard in `shared/ui/piano-keyboard`, pure): the frame from a scroll position and the
  scroll position from a point on the strip, and the value text's range.

### 3.2 The keyboard (`shared/ui/piano-keyboard`, presentational)

- `PianoKeyboard` gains `size`, `swipe`, `names` and `letters` (the typing letters by key), and takes `children`:
  the toolbar's trailing actions, a slot rather than a flag per button (CODE_STYLE §4). It renders the toolbar row
  (`KeyboardNavigator` + children) over the keys, and owns the scroller the navigator moves.
- `KeyboardNavigator`: the strip, a slider over the scroller (reads its scroll position on `scroll`, passive).
- `use-glissando.ts`: pointer handlers on the keys' group for Glissando (a key per pointer, pressed on entry, pointer
  capture so a swipe keeps playing past the edge). In Glissando a click from a pointer is ignored (it already played
  on touch) and a keyboard click (Enter, Space: `detail === 0`) still plays.
- `keyLook` gains the note name and letter under a mark's label; `Key` draws the rail's shadow, lip, slope and the
  drop; the width formula follows `size`.
- New key tokens in `tokens.css`, both themes: `--key-rail`, `--key-bed`, `--key-lip`, `--key-black-slope`,
  `--on-key-white`, `--on-key-black`; exposed in `theme.css`.

### 3.3 `features/live-keyboard`

- `LiveKeyboard` reads the four choices from the settings store, passes them on, and fills the toolbar's slot with
  **KeyboardOptions** (the popover) and **the full-screen button**. It renders `FullScreenKeyboard` (a `Dialog`) with
  its own props when opened.
- `use-typing.ts`: the one-keyboard-types rule (a stack of the mounted keyboards that want to type, the last one
  typing), the `keydown` listener on `window` for the owner only, the typing octave (component state; not saved).
- The popover and the Settings group write through `setKeyboardPrefs` (`features/set-preference`), one command with a
  partial update, as the other preferences have.

### 3.4 Elsewhere

- `entities/settings`: `KeyboardPrefs`, `KEYBOARD_SIZES`, `SWIPES`, `NOTE_NAMES`, `DEFAULT_KEYBOARD`, the sanitiser,
  `selectKeyboard`; `SETTINGS_VERSION` 3.
- `shared/ui/primitives/dialog.tsx`: added with the shadcn CLI (base-nova), then sized as the kit's other
  primitives are.
- Screens keep their keys' heights; the toolbar adds its row above them (the pinned keyboards, the quiz board, the
  Player's keyboard).
- Settings page: the Keyboard group.

## 4. i18n

`common`: the toolbar (Keys in view, Keyboard options, Full screen, Close), the value text ("{{from}} to {{to}}"),
the four choices and their options (Keys: Fit, Large, Whole piano / «По ширине», «Крупные», «Весь рояль»; Swipe:
Scroll, Glissando / «Прокрутка», «Глиссандо»; Note names: C, All, None / C, «Все», «Нет», since note names are the
same in both languages; Play from the computer
keyboard / «Играть с клавиатуры компьютера») and the octave keys' hint ("Z X · octave" / «Z X · октава»), shown as
keys beside the switch. `settings`: the group's title.

## 5. States and edge cases

| Situation                                        | Behaviour                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| Whole piano on a phone                           | Every key shows; taps work but keys are narrow; the strip is hidden        |
| Glissando on a pinned keyboard                   | A swipe on the keys plays; the page scrolls from anywhere but the keys     |
| A swipe leaves the keys and comes back           | Each key it enters plays once per entry                                    |
| Two fingers                                      | Each plays its own keys                                                    |
| Typing while a text field is focused             | Nothing plays; the field types                                             |
| Typing at the piano's ends                       | Z or X past an end does nothing; keys past C8 do not play                  |
| A sheet open over the Player                     | The Player's keyboard still types (the sheet has no keyboard of its own)   |
| Full screen open, then the screen changes route  | The dialog closes with its screen                                          |
| A saved `keyboard` group with an unknown value   | That field takes its default; the others stand                             |

## 6. Accessibility

The keys stay one tab stop with the arrow keys, Home and End (live-keyboard design). The navigator is a slider with a
name and a value text. The options popover's controls are the kit's `Segmented` and `Switch`, named by their labels.
Full screen is a dialog with a title and a close button, trapping focus. Letters and note names are `aria-hidden`:
each key is already named by its note.

## 7. Testing

Test first (CODE_STYLE §9). Unit: `keyAt` (white, black over white, the edges), `typedKey` / `moveTypingOctave` /
`typingLetters` (the layout, the piano's ends), the navigator's math, `keyLook` with names and letters, the settings
sanitiser (a version-2 save, unknown values, the typing default). Components: Glissando (a pointer swipe presses each
key once per entry, two pointers, a pointer click does not press twice, Enter still presses), Scroll (a click
presses), the navigator (arrow keys move an octave; the value text), the options popover (changes the saved choices),
full screen (opens, a tap reaches the screen's meaning, Escape closes, it types while open), typing (a code plays its
key, Z and X move, ignored in a text field, with a modifier or on repeat; only the last keyboard types). Screen:
Settings' Keyboard group. jsdom lays nothing out, so a test gives the keys' group its box (`getBoundingClientRect`)
where a pointer's position matters.

## 8. Records

DESIGN.md (the keys' look, the toolbar, the No Glow Rule's exception), CODE_STYLE §1 (the keyboard's toolbar and
choices) and §5 (the key tokens), the glossary (**Scroll**, **Glissando**, **Navigator strip**, **Typing keys**,
**Full-screen keyboard**), ADR 0009 (the keyboard is an instrument: its look is a material, a swipe scrolls or plays
by the learner's choice, typing reads physical keys), CLAUDE.md's architecture line for `live-keyboard`.
