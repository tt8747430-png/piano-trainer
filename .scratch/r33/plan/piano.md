# R33 · A proper piano with proper pedals, everywhere

## Source

- **The owner (2026-11-05):** "can you fetch the piano.org and the musicca.com piano implementations and improve our, i
  need proper pianos with proper pedal and implementations."
- Earlier rulings kept: proper pedals, "not there at the bottom" of the keys' corner (R32: centred beneath the keys on
  the rail); nothing reserved above the keys; the Player's piano settings stay inside the Player's sheet; professional
  wording in en and ru; one home per preference.
- References (`.scratch/r33/ref/`): musicca (clean keys, note names on every key, a small Settings popover: Note names,
  Keyboard shortcuts, Volume, Octave; Record; Mark), OnlinePianist (realistic keys with depth and shadow, a red felt
  strip over them, computer-key labels in little caps, a toolbar with Sustain as a lit toggle), Recursive Arts' A-23
  (an instrument body, a panel with SUSTAIN and its indicator light), Midiano (a transport over a full-width keyboard),
  Piano Playground. piano.org stays behind Vercel's bot checkpoint. musicca's engine (Tone.js samplers): notes struck
  while the pedal is down are flagged `sustainLatched` and all released when it lifts, at a fixed 0.07 s release.

## Today

- **The keys** `shared/ui/piano-keyboard/`: `PianoKeyboard` (88 keys, scroller, Fit · Large · Full), `Key` (flat fills:
  `bg-key-white`/`bg-key-black`, a 6 px lip, a 2 px sink, marks as washes and full paint from `key-look.ts`), `KeyRail`
  (the rail beneath the keys: chord caption · pedals centred · ‹ › − + ⚙ and `end`), `Pedal` (`PedalPaddle`, a brass
  plate on its shank; `PedalLyre`). The keys are flat colour blocks on a bed: no depth, no felt, no bevel.
- **The live keyboard** `features/live-keyboard/`: `LiveKeyboard` (settings, live voice, typing, Space pedal, chord
  caption, `KeyPedals`, `KeyZoom` − +, ⚙ to `/settings/on-screen-piano` or the screen's `onSettings`), `KeyPedals`
  (hold to hold; a tap latches the sustain, a honey dot; lifts on hide), `use-space-pedal.ts`, `PinnedKeyboard` (a
  page's docked keys), `KeyboardSettingsFields` + `TypingSwitch` (Settings › On-screen piano, and the Player's sheet).
- **The engine** `shared/lib/schedule/damper.ts` (sustain, sostenuto, soft over held/sounding/caught keys),
  `shared/api/audio/live-voice.ts` (counts holders of each key and pedal), `web-audio.ts` (live strike/silence),
  `sampler.ts` (`pianoRelease`: 0.6 s at C3 → 0.25 s at C5; a re-struck key cut in 50 ms). MIDI CC64/66/67 reach
  `audio.pedal` (`use-midi-sync.ts`). Faults found:
  1. The live voice hands the sampler its *gain* as the velocity and 1 as the gain: the soft pedal's 2/3 lands inside
     one velocity layer and is barely heard (≈ −1 dB), with no change of tone.
  2. The sostenuto pressed while the sustain is down catches only the keys held, though every damper is raised.
  3. No volume for the piano a learner plays.
- **Where the piano appears:** the Player (`pages/player/ui/PlayerLayout.tsx`, ⚙ → the Player's sheet), the score editor
  (`pages/score-editor/ui/EditorKeyboard.tsx`), every page's docked keys (`PinnedKeyboard`: the Chord finder, Chords,
  Scales, Intervals, Progressions, the Chord player, lessons, songs' preview, the pattern editor, a take's page),
  the trainers (`TrainerBoard`), `ChordLearning`.
- **Faults seen in the browser:** on a 402 px phone the rail's ⚙ is scrolled out of sight (pedal centred, − + Hide
  fill the right half).

## Will build

### 1. The keys (one `Key`, every keyboard)

- **Ivory white keys:** the face lit from the player's side (a light falling to the far end, a soft shade at the
  sides between keys), a front lip that catches the light, a shadow cast under each black key.
- **Ebony black keys:** a raised top face with bevelled sides (a highlight on the left edge, a shade on the right), a
  sloped front catching a sheen, a drop shadow on the whites.
- **A felt strip** (the key slip's red felt, `--key-felt`) along the keys' far end, over the case's shade.
- **Pressed:** the key sinks (2 px), its lip shortens, the far end darkens under the felt, and it lights: the plain key
  in Key down (sky), a mark in its full paint. Marks (hands, roles, wrong key, the pedal-held outline) keep their
  colours; the depth is drawn as light and shade over whatever fill the key has, so every mark stays legible.
- **Labels:** note names (every C · every key · none) and, on a computer, the letter that plays the key, in a small
  key-cap chip (OnlinePianist), ink on ivory and paper on ebony, legible at 22 px keys and up.
- Both themes; crisp at every key size (no images, CSS only); the same on a phone held either way.

### 2. The pedals and the engine

- **Drawn as a piano's pedals**, centred beneath the keys on the rail's lyre (R32, kept: the owner rejected the corner
  lever): soft · sostenuto · sustain, or the sustain alone. A latched sustain shows a lit indicator on the lyre
  (Recursive Arts' light). Mockup option B (a lit Sustain toggle in the strip, OnlinePianist) is drawn for comparison.
- **Sustain:** down while held — pointer, Space where the screen does not use Space, MIDI CC64, the score's pedal while
  music plays (drawn down, not pressable against it) — or latched by a tap and lifted by the next. Every key struck or
  let go under it rings on; on the lift all of them stop together, each with its register's damper release (0.6 s in
  the bass to 0.25 s in the treble). A key re-struck under it retriggers: the old sound fades in 50 ms as the new one
  starts, one voice a key.
- **Soft (una corda):** a key struck under it sounds two thirds as loud *and* darker (a low-pass on that voice, about
  an octave and a half lower).
- **Sostenuto:** holds only the keys down as it is pressed (every raised damper: with the sustain down, every key
  sounding), lets them go as it lifts unless the sustain holds them.
- The engine fixes in `shared/lib/schedule/damper.ts` and `shared/api/audio` (live voice: velocity and gain apart;
  a soft voice's filter; the piano's volume), with tests.

### 3. The rail and the piano's settings

- **The rail** (beneath the keys): the chord held at its start · the pedals centred where they fit · at its end
  ‹ › (an octave, for a mouse) · − + (key size) · ⚙ **Piano settings** · Hide (a page's). The end group never
  scrolls out of sight: the pedals give way left on a narrow phone.
- **⚙ opens a sheet "Piano"** (musicca's Settings popover) over the screen, the controls in order:
  1. **Key size** — pictures: Fit to music · Large · Full keyboard (default Fit to music)
  2. **Note names** — pictures: On every C · On every key · Hidden (default On every C)
  3. **Volume** — slider 0–100 %, default 80 % (new: `keyboard.volume`)
  4. **Pedals** — pictures: Sustain only · All three (default Sustain only)
  5. **Play with computer keyboard** — switch, on a computer only (shows the letters on the keys)
  6. a row **All piano settings** → Settings › On-screen piano (depth, chord symbol, swipe, position…).
  The same fields, one component (`PianoEssentials`), open the On-screen piano page, so every preference keeps one
  home. The Player's ⚙ keeps opening the Player's sheet's On-screen piano page (owner's ruling), which shows the
  same fields.
- **Sound:** the app has one piano (Salamander Grand); a choice of sounds waits for a second set.
- **Record and Mark:** not added. Recording is the score editor's Record (a take into a song); marking keys is the
  Chord finder's (tap keys, the chord is named). Neither is duplicated on the keyboard.

### What goes

- The ⚙ leaving the page for Settings (now the sheet); the flat key faces.
