# A piano voice, the MIDI keyboard's settings, takes that are whole, and Free play

- **Status:** built 2026-10-09 (plan `2026-10-09-piano-voice-midi-and-free-play.md`, ADR 0034). The owner asked: "add all the missing piano component
  features like all the left features and the sustain piano and the more feature for the midi keyboard and its
  recording the note pressing higher or lower or softer or louder and all the missing feature for the midi
  recording". Claude wrote back the understanding in four parts (a piano voice; the MIDI keyboard's settings; the
  recording's gaps; the roadmap's planned keyboard features, Toggle mode and Live score), reading "pressing higher or
  lower, softer or louder" as how hard a key is struck (velocity) and "the left features" as the roadmap's planned
  ones; the owner answered "this is correct continue", said their piano "has its own sound through the speaker", and
  asked for "all features together in one spec".
- **Builds on:** ADR 0004 and 0008 (audio and MIDI behind ports), ADR 0003 (the view in the URL, saved state in
  stores), ADR 0028 (a take is kept as played), ADR 0030 (Practice is its places). **Records:** ADR 0034.
- **Reverses:** the roadmap's §5 "Not for this app: … a sustain pedal from a MIDI keyboard (the keyboard sounds
  itself, and the app reads only which keys go down)". The keys the app sounds now have a pedal, and a keyboard
  without a speaker can be sounded by the app.
- **Roadmap §5:** "Live score" and "Toggle mode" are built (§5 below).

## 1. Words

- **Pedal** («Педаль»): the sustain pedal. A key let go while it is down sounds on until it comes up. The **soft**
  («Левая педаль») and **sostenuto** («Средняя педаль») pedals are a MIDI keyboard's others (§3.4).
- **Velocity** («Сила нажатия»): how hard a key is struck, 1–127, as a MIDI keyboard sends it; heard as loudness.
- **Touch** («Чувствительность»): how the app hears a MIDI keyboard's velocities: Light, Normal or Heavy.
- **Sound the MIDI keyboard** («Звук MIDI-клавиатуры»): the app sounds the keys played on a MIDI keyboard, for one
  with no speaker. **Play through the piano** («Звук через пианино»): the app's music sounds on the MIDI keyboard's
  own speaker instead of the browser's.
- **Free play** («Свободная игра»): Practice's place to play the piano freely, with the **live score** («Живые
  ноты»: what is played, written on a grand staff and named) and **Mark** («Отметить»: tapped keys stay lit,
  coloured and fingered: a teaching diagram).
- A take's **name** («Название») is the learner's; until they give one, it is when it was made, as today.

## 2. The piano voice

### 2.1 A key sounds while it is held

Every key a hand plays (a tap, a typed key, a MIDI key the app sounds) sounds from when it goes down until it comes
up, as a piano's does: struck at its velocity, dying away slowly while held (a lower key longer, as a string does),
stopped by its damper a moment after it is let go. Striking a key that still sounds stops the earlier sound first.
Today a tap is a note of a fixed length (1.2 s) that sounds on after the finger is lifted and is cut by nothing.

- **The audio port** gains a live voice beside `play()`: `press(key, velocity)`, `release(key)` and
  `pedal(down)`. The scheduled music (`play()`) is untouched: a piece, an example, a take play as now.
- **The damper is pure** (`shared/lib/schedule`, `damper.ts`): a state over presses, releases and the pedal that
  says which keys sound and which stop at each change. The adapter renders it; the fake audio records it.
- **One loudness for a velocity:** `velocityGain(velocity)` (the gain rising with the square of the velocity, as a
  take's does today) moves from `entities/take` to `shared/lib/schedule`, and both a take's notes and the live voice
  use it. A tap and a typed key play at velocity 100, today's loudness.
- **What the screen shows down:** the keys the live voice sounds are the port's `sounding()`, so a key the pedal
  holds stays down after it is let go, until the pedal comes up. A key a hand still holds is shown by the hand, as
  today.

### 2.2 The hands

- **A tap** sounds while the pointer is down: the keyboard reports a key let go (`onKeyRelease`) as it reports one
  pressed. In Glissando, a key the finger leaves is let go as the next sounds. A key pressed by Enter, Space or a
  screen reader (no pointer) sounds as a tap does today: struck, then let go at once (the pedal may hold it).
- **A typed key** sounds from key-down to key-up (`useTyping` reports the release it already reads).
- **A MIDI key** sounds only with **Sound the MIDI keyboard** on (§3.1), at its velocity heard through the Touch.
  The owner's piano sounds itself, so the switch is off by default and nothing sounds twice.

### 2.3 The pedal

- **The MIDI keyboard's pedal** (CC 64, already read) is the voice's pedal, whatever the MIDI switch says: the
  learner's foot holds the keys the app sounds for taps and typed keys too.
- **The rail's Pedal button** (beside Glissando, the keys' own setting, not saved) puts the pedal down and up on a
  tap, for a touch screen or a mouse; it shows down while the MIDI pedal is down.
- **Space holds the pedal** while typing plays the keys, while held, where Space has no other job: not in a field,
  not on a focused control, not while the Recorder records (its Space stops the take).
- **The MIDI keys the piano sounds itself** stay down on the screen while its pedal holds them (`useHeldKeys` keeps a
  key let go under the pedal until the pedal comes up), so the screen shows what is heard.

## 3. The MIDI keyboard

### 3.1 Its settings

`pt-settings` version 9 adds `midi` (`MidiSettings`); a version-8 save reads with the defaults. Settings' **MIDI**
group holds them all, under the connection; the rail's settings popover shows **Sound the MIDI keyboard** while a
keyboard is connected.

| Setting                    | Values                               | Default | What it does                                                           |
| -------------------------- | ------------------------------------ | ------- | ---------------------------------------------------------------------- |
| **Keyboard**               | Any keyboard, or one by its name     | Any     | Which connected keyboard is heard (§3.2)                               |
| **Sound the MIDI keyboard**| on / off                             | off     | The app sounds the keys played on it (§2.2)                            |
| **Play through the piano** | on / off                             | off     | The app's music sounds on the keyboard's own speaker (§3.3)            |
| **Octave shift**           | −2 … +2 octaves                      | 0       | A small keyboard's keys moved, for the app and for takes               |
| **Touch**                  | Light · Normal · Heavy               | Normal  | How loud the app sounds a velocity (§3.5)                              |
| **Pedal**                  | Normal · Reversed                    | Normal  | A pedal that sends up when pressed is read the right way round         |

### 3.2 The keyboard heard

- The MIDI port is told the settings (`configure({ device, octaveShift, pedal })`), by a provider in `app/providers`
  that follows the store (as `LocaleSync` does), so every reader of the port (the live keys, Wait mode, the Recorder,
  the Chord finder) hears the same keys.
- **One keyboard chosen:** only its messages are read; the others are not listened to. Chosen and unplugged, the MIDI
  control says it is not connected (by name) and nothing is heard until it comes back; Any keyboard hears all, as
  today. The choice lists the keyboards connected now, and the chosen one while it is away.
- **Octave shift:** each key moves by the octaves chosen; a key moved off the piano (below A0, above C8) is not read.
- **Reversed pedal:** CC 64 (and 66, 67) read below 64 as down.

### 3.3 Play through the piano

With it on and an output on the chosen keyboard (Web MIDI's outputs, matched by name; Any keyboard: the first that
has one), the app's notes go to the keyboard as note-ons and note-offs at their velocities, timed on the page's clock
from the audio clock (`audioTimeAt` turned round), instead of the browser's synth. The click and a piece's recording
stay in the browser. Stop sends note-off for every key it sent; a keyboard unplugged falls back to the browser's
sound. The live voice does not go through the piano (the piano already sounds its own keys).

- **The port:** `createMidiSoundOutput` in `shared/api/audio` sends a `NoteSound` as MIDI; `createWebAudioOutput`
  takes it as a sink for notes when on. The MIDI port gains `outputs()` (names) beside the inputs.

### 3.4 The other pedals

The MIDI port reads the **soft pedal** (CC 67) and the **sostenuto** (CC 66) beside the sustain: `PedalEvent` gains
`pedal: 'sustain' | 'soft' | 'sostenuto'`. The live voice plays a key struck under the soft pedal at two thirds of
its gain; sostenuto holds the keys down when it goes down, and only those, until it comes up. A take keeps all three
(§4.1).

### 3.5 Touch

The live voice and a take's sound (both the app's sound of the learner's playing) hear a velocity through the Touch:
Normal as struck; Light raises soft velocities (a light keyboard sounds full), Heavy lowers them, by a curve
(`touchVelocity(velocity, touch)`, exponents 0.7 and 1.4). A take keeps the velocities as played: the Touch is
how they are heard, never what is saved, and the `.mid` file writes them as played.

## 4. Takes

### 4.1 What a take keeps

`pt-takes` version 2: a take gains `name?` (1–40 characters) and its pedal presses their pedal (`soft`,
`sostenuto` beside `sustain`); a version-1 save reads its presses as the sustain's and its takes unnamed. The
compact form writes a press `[down, up]` for the sustain as today and `[down, up, 1]` (soft) or `[down, up, 2]`
(sostenuto). The `.mid` file writes CC 67 and 66 as it writes CC 64; a take is heard with them (§3.4).

### 4.2 Hearing yourself, and the tune

- With **Sound the MIDI keyboard** on, the keys sound while a take records, as everywhere; with it off the piano
  sounds itself, as now.
- **Tune** («Мелодия»), a switch in the Recorder beside Click (saved: `recorder.tune`, off; `pt-settings` version 9),
  shown where the piece has a melody: the piece's tune plays while recording, from the caret's bar at the take's
  tempo, so an accompaniment is recorded against the song it accompanies. It is not part of the take.

### 4.3 A take shown, named and kept to its bars

- **The take's page** opens from its row (its name is the link): the take drawn as a **piano roll** (`TakeRoll`): a
  key's note a bar from its onset for as long as it sounds, on a lane by pitch, its shade by velocity (soft to
  loud); the pedals a lane each underneath; the take's bars and beats as lines, numbered from the caret's bar it was
  recorded at; a playhead while it plays, and the keys going down on the keyboard (they do now). A tap on the roll
  plays from that bar.
- **Name:** a field on the take's page; empty is the time it was made, as now.
- **Keep bars:** the page's **Keep bars** («Оставить такты») sets the first and last bar to keep (two fields over the
  take's bars, the roll dimming what goes); **Keep** cuts the take to them in place: notes and presses before the
  first bar dropped, later ones moved back by the bars cut, a note held past the last bar's end cut there, the length
  whole bars. Whole bars keep the take on the click's beats, so Write into the score works as before. It cannot be
  undone: the button asks first (ADR 0028 amended: a take changes only when the learner keeps fewer bars or names it).
- The page's route: `/edit/$pieceId/takes/$takeId` (the editor's; a take that is not there is `notFound()`).

## 5. Free play

A Practice place (the eighth: ADR 0030 amended by ADR 0034), `/practice/free-play`, a row on Practice's list: the
keyboard at its widest and the score over it.

### 5.1 Play: the live score

- **What is written:** every key played (tapped, typed, on the MIDI keyboard), the keys struck within 50 ms of each
  other one chord, on a grand staff (the treble from middle C up): the chord held now, after the last four played,
  oldest first, each a whole note in a bar of its own with no time signature (the trail). A new chord pushes the
  oldest out; **Clear** empties the trail.
- **Named:** over each bar, three keys or more as the Chord finder names them (`nameChords`, its first name, with
  what is left out); two as their interval (its short name: `m3`, `P5`, `M9`); one as its note.
- **Spelled:** in the key chosen (the bar's `KeyChoice`; the URL's `key`, C major by default), its signature written.
- **Pedal:** the keys the pedal holds are written in the chord they were struck in; a new key struck under the pedal
  starts the next chord.

### 5.2 Mark: teaching diagrams (the roadmap's Toggle mode)

- **Mode:** the bar's **Play · Mark** (`Segmented`; the URL's `mode`). In Mark a tap (or a MIDI key) marks its key, or
  clears it if marked; it sounds as in Play.
- **The marks:** the bar's **Colour** (two of the keyboard's mark tones, `NamedSegmented`) and **Finger** (none, 1–5)
  are put on each key marked; a key marked again with another colour or finger takes them. Marked keys are lit in
  their colour, their finger in the finger row under the keys. **Clear** removes every mark.
- **In the URL:** `marks` (`60a3,64a,67b5`: key, colour, finger), so a diagram is a link to send.
- **The live score in Mark** writes the marked keys as one chord, named.

## 6. Code

| Layer                        | What                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `shared/api/audio`           | `press`, `release`, `pedal` on `AudioOutput`; the voice's render; `createMidiSoundOutput`; the fake's  |
| `shared/api/midi`            | `configure`; one keyboard heard; octave shift; reversed pedals; CC 66 and 67; `outputs()`; `send`       |
| `shared/lib/schedule`        | `damper.ts`; `velocityGain`, `touchVelocity`                                                           |
| `shared/lib/services`        | `useLiveVoice` (press, release, the pedal's state), `usePedal`                                         |
| `shared/ui`                  | `PianoKeyboard`'s `onKeyRelease`; the rail's Pedal button (`RailButton`)                               |
| `entities/settings`          | version 9: `midi`, `recorder.tune`; `selectMidi`                                                       |
| `entities/take`              | version 2: `name`, pedal kinds; `takeSounds` with them and the Touch; `midiFile` CC 66/67; `keepBars`  |
| `features/live-keyboard`     | `LiveKeyboard` plays through the live voice; Space for the pedal; `PedalToggle`                        |
| `features/connect-midi`      | `useHeldKeys` under the pedal; the MIDI settings fields; the control names a chosen keyboard away      |
| `features/set-preference`    | the MIDI settings' and `recorder.tune`'s commands                                                       |
| `features/manage-takes`      | `renameTake`, `keepTakeBars`                                                                           |
| `features/record-take`       | the tune under a take                                                                                  |
| `widgets/take-roll`          | `TakeRoll`                                                                                             |
| `widgets/live-score`         | the trail (`liveTrail`, pure), its score and names                                                     |
| `pages/score-editor`         | the take's page; the row's name a link; Tune in the Recorder                                           |
| `pages/free-play`            | Play and Mark; `marks` read and written                                                                |
| `app`                        | `MidiSync` provider; the routes (`/practice/free-play`, the take's page) and their search validators   |

## 7. Tests

- **Pure:** the damper (press, release, the pedal holding and letting go, a re-strike, sostenuto holding only what
  was down, the soft pedal's gain); `velocityGain`, `touchVelocity`; the settings sanitiser (version 8 → 9); the takes
  sanitiser (version 1 → 2, compact presses); `keepBars` (dropped, moved, cut notes and presses, whole bars);
  `midiFile` (CC 66/67); `liveTrail` (50 ms grouping, the pedal, four kept, Clear); `marks` read and written.
- **Adapters:** web audio's voice (a held note's envelope, release, damper, re-strike); web MIDI (one keyboard heard,
  octave shift, reversed pedal, CC 66/67, outputs, sent notes timed and all let go on Stop); the MIDI sound output.
- **App (`renderApp`):** a tap sounds until lifted, the Pedal button holds it, Space too; a MIDI key sounds only with
  the switch on; its pedal keeps a key down on the screen; Settings' MIDI group saves each setting; a take recorded
  with the tune, named, kept to its bars and played on its page; Free play writes and names a chord played, Clear
  empties it, Mark marks two colours with fingers into the URL and back.

## 8. Docs

ADR 0034 (the pedal and the voice; Free play the eighth place; a take may be named and cut to its bars); the
glossary (§1's words); CONTENT (none); CODE_STYLE (the live voice beside `play()`); PRODUCT and DESIGN (Free play,
the take's page, the MIDI group); the roadmap's §5 rows and "Not for this app" line; CLAUDE.md's architecture.

## 9. Build order

1. The live voice: the damper, the port's press, release and pedal, taps and typed keys through it, the Pedal button
   and Space, `velocityGain` shared.
2. The MIDI settings (version 9), the port's `configure`, Sound the MIDI keyboard, Touch, held keys under the pedal,
   the other pedals.
3. Takes version 2: names, pedal kinds, the take's page and roll, Keep bars, Tune.
4. Free play: Play's live score, then Mark.
5. Play through the piano.

Each is its own commits, each green.

## 10. Not now

A sampled piano (real piano recordings at several velocities: megabytes against the precache's 2 MiB a file); pitch
bend, the modulation wheel and other instruments (a piano has none); recording the on-screen keys or the computer
keyboard (ADR 0028: their timing is the input's lag); takes outside the score editor, or of no piece; importing a
`.mid`; a take's notes edited one by one (Write into the score is where notes are edited); an image of a diagram (the
roadmap's "Not for this app": image export); half-pedalling (a pedal is down or up).
