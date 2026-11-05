# R34 · The keyboard as Songscription's: slim keys at the foot, every control in the bar

## Source

- **The owner (2026-11-05):** about the rail under the keys with zoom, ⚙ (a sliders icon) and the pedals: "it doesn't
  still look good with these, and this rail at the bottom, look at the songscription piano implementation"; then "i
  don't want finger number under the keyboard and no piano roll yet"; "check after all the onboarding how the
  floating keyboard works".
- **The reference** (`.scratch/r33/ref/songscription-clean-laptop.png`, `-clean-phone.png`, `-keys-laptop.png`,
  `.scratch/r33/songscription2.mjs`): all 88 keys fill the width at the very bottom, slim, never scrolled, nothing
  attached (only C4 named); on a phone the 88 tiny keys sit right above the compact bottom bar; every control is in
  the bar (… Metronome, Mixer, **Keyboard**, Playback speed, the key, More, Download, Settings); a divider ("Resize
  score and piano roll") resizes the score against the keys; nothing about the keyboard floats.
- **Kept from R33** (`.scratch/r33/plan/piano.md`): ivory and ebony keys with felt and depth; the pedals' engine
  (sustain held or latched, soft, sostenuto, MIDI CC64/66/67, Space, the score's pedal); the Player's piano settings in
  the Player's own sheet (the owner's ruling); one home per preference.
- **Not built (the owner):** no falling-note piano roll; no finger numbers on or under the keys.

## Today

- `shared/ui/piano-keyboard/PianoKeyboard.tsx`: the keys, then `FingerRow` (circled finger numbers under the keys
  wherever a mark carries a finger: Chords, Scales' runs, lessons, the Player with Fingering on), then `KeyRail`
  (`bg-key-rail`, 56px: the chord held · the pedals on their lyre (`Pedal`, `PedalLyre`) · ‹ › − + ⚙ · Hide), and
  `use-size-caption` (the rail says "Showing n keys" for a moment).
- `features/live-keyboard/`: `LiveKeyboard` (the rail's contents: `KeyPedals`, `KeyZoom`, ⚙ → `PianoSettingsSheet` or
  the screen's `onSettings`), `PinnedKeyboard` (a page's keys in `Docked`/`Pinned`, inset by the gutter, folded from
  the rail's Hide into a floating **Keys** pill, `FabPill`), `KeyboardSettingsFields` (Settings › On-screen piano,
  the Player's sheet), `useFoldKeys`.
- The Player (`pages/player/ui/PlayerLayout.tsx`): **Piano keys** in its bar (`widgets/practice-player/KeysToggle`),
  the keys over the transport, inset; ⚙ on the rail opens the Player's sheet at On-screen piano.
- The score editor: **Piano keys** in its bar (`KeysToggle`), `EditorKeyboard` with the rail and its own Hide.
- Pages with docked keys: Chord finder, Chords, Scales, Intervals, a progression, the Chord player, a lesson, a shared
  or public song's preview, a pattern, the pattern editor, a take. Each folds from the rail into a floating Keys pill.
- Settings › On-screen piano: Key size (Fit to music · Large · Full keyboard, default Fit), Note names, Volume,
  Pedals, computer keys; Key depth (Full · Compact); Chord symbol; names on highlighted keys; Swipe; Play on
  selection; Position (Bottom · Top); Collapse keyboard (Never · In landscape · Always).

## Will build

### 1. The keys alone (one `PianoKeyboard`, every screen)

- The keyboard is its keys and nothing else: no rail, no chord caption, no − +, no ‹ ›, no ⚙, no pedal paddles, no
  finger row, no size caption. `FingerRow`, `KeyRail`, `RailButton`, `RailGroup`, `Pedal`/`PedalLyre`, `KeyZoom`,
  `use-size-caption`, `PianoSettingsSheet` go; a key mark carries no finger (`KeyMark.finger`, `crossing` go, and the
  marks that set them: Chords' fingered keys, the Player's fingers, a lesson example's crossings). Fingering stays
  where it is read: the score's numbers, Chords' and Scales' hand drawings and tables.
- **Edge to edge** at the foot of the screen (the Player, the editor, a page's docked keys): no gutter, no rounded
  top, a hairline above. Docked at the top (Position: Top), edge to edge under the bar.
- **Height:** a piano's proportion (4.4 × a white key's width, so on a laptop with all 88 keys ≈ 145px, on a 402px
  phone at the 56px floor), never over the screen's share (`--keys-most`), until the learner drags the divider (§4).
- Note names, marks, the computer-key letters, the felt and depth: as R33.

### 2. Key size (Settings › On-screen piano › Key size)

Pictures, in order, default **All keys**:

| Value   | English        | Russian            | Behaviour                                              |
| ------- | -------------- | ------------------ | ------------------------------------------------------ |
| `piano` | All keys       | Все клавиши        | all 88 fit the width, never scrolled (Songscription's) |
| `fit`   | Fit to music   | По музыке          | the music's range fills the width; scrolls to follow   |
| `large` | Large          | Крупные            | about an octave on a phone; scrolls to follow          |

Detail line: "All keys fit the width; a larger size scrolls to follow the music." The saved settings' version goes up
(no users yet), so every learner starts on All keys.

### 3. The bar (every screen with keys)

In the screen's bar, before its gear, in this order (`KeyboardTools`, one implementation):

1. **The chord held** — the chord a hand holds (the live keys and a MIDI keyboard's, three notes or more), as text
   in the bar (`C♯m`), from 40rem wide only; not at all on a phone, nor where the screen names chords itself (the
   Chord finder) or the chord is the question (a round). Screen readers hear "Chord held: C♯m".
2. **Sustain** — a 44px button, the pedal's picture (𝆮 drawn as a pedal), shown only while the keys show. Lit
   (honey fill) while the sustain is down from any source: the finger on it, Space, a MIDI pedal, the score's pedal
   while music plays. Hold it: held. Tap it (under 300 ms): latched, lit, until the next tap. Its name: "Sustain
   pedal — hold, or tap to latch".
3. **More pedals** (with Pedals: All three only) — a ⌄ beside Sustain opening a small menu with **Soft** and
   **Sostenuto**, each a 44px button that holds while pressed and latches on a tap, lit while down; the menu
   closing leaves a latched pedal down (lit dot on ⌄ while either is down).
4. **Keyboard** — the piano icon, a toggle (`aria-pressed`) that shows or hides the keys. In the Player it is the
   Player's own choice (as Piano keys was); elsewhere the saved fold, upright and on its side apart (`folded`,
   `foldedLandscape`). It replaces **Piano keys**; nothing floats when the keys are hidden (the Keys pill goes).

The Player's and the editor's bars hold it at every size. The pages' bars: the Chord finder, Chords, Scales,
Intervals, a progression, the Chord player, a lesson, a song's preview, a take, a pattern, the pattern editor.

### 4. The divider (Songscription's "Resize score and piano roll")

- A slim bar (12px drawn, a 36×4 grip in its middle) on the keys' edge facing the music: above the keys at the foot,
  below them at the top. Its target is 44px tall, reaching over the music's edge, never over the keys.
- Drag (mouse or finger) to make the keys taller or shorter, 56px to half the screen's height; the key widths stay.
  Arrow Up/Down step 16px from the keyboard; Home/End go to the least and most; a double click or Enter goes back to
  the piano's proportion.
- `role="separator"`, `aria-orientation="horizontal"`, named "Resize keyboard", with its value in px.
- **Remembered per screen size**: a phone upright, a phone on its side, a wider screen (`keysHeight.phone`,
  `.side`, `.wide`, kept as the screen was left, not a preference). Every keyboard with a divider uses it.
- Where: the Player, the score editor, every page's docked keys. Not the trainers' or a chord diagram's keys inside a
  card (they are not at the screen's edge).

### 5. Settings

- **The Player's ⚙:** its On-screen piano page keeps `KeyboardSettingsFields` (the owner's ruling).
- **The editor's ⚙:** a new row **On-screen piano** under Settings, opening `KeyboardSettingsFields` in its sheet.
- **Practice pages' ⚙:** their Settings already end with the **On-screen piano** row (link to its one home).
- **Settings › On-screen piano** (`KeyboardSettingsFields`): Keys and sound (Key size, Note names, Volume, Pedals,
  computer keys) · Display (Chord symbol — now "Names the chord you hold in the bar.", names on highlighted keys) ·
  While you play (Swipe, Play on selection) · Placement (Position). **Key depth** goes (the divider sets the height)
  and **Collapse keyboard** goes (the bar's Keyboard is the one way to hide the keys); `keyLength` leaves the saved
  settings, `folded`/`foldedLandscape` become the screen as left.
- Pedals' detail: "Adds the soft and sostenuto pedals to the Sustain button's menu."

### What goes

The rail and everything on it; the floating Keys pill; the finger row; Key depth; Collapse keyboard; the Piano sheet
from the rail; Piano keys (now Keyboard); the size caption.

### Strings (en · ru)

| Key                              | English                                         | Russian                                              |
| -------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| `keyboardTools.keyboard`         | Keyboard                                        | Клавиатура                                           |
| `keyboardTools.chord`            | Chord held                                      | Взятый аккорд                                        |
| `keyboardTools.morePedals`       | Soft and sostenuto pedals                       | Левая и средняя педали                               |
| `keyboardTools.resize`           | Resize keyboard                                 | Изменить высоту клавиатуры                           |
| `keyboardSettings.keySize.piano` | All keys                                        | Все клавиши                                          |
