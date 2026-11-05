# R32 Player research: score players, web pianos and their pedals

Shots are in `.scratch/r32/shots/` (`ref/` the owner's saved pages, `web/` live sites, `before/` our Player today).
Scripts: `.scratch/r32/ref-shot.mjs`, `web-shot.mjs`, `ra-shot.mjs`.

## The owner's saved pages

### MuseScore.com, Fantaisie-Impromptu (`ref/musescore-laptop.png`, `ref/musescore-phone.png`)
- **One slim toolbar over the score** (laptop): ⏮ ▶ ⟲ loop, time `00:15 / 04:34`, Mixer, Transpose, **BPM − 168 +**,
  then view toggles at the right (dark page, note names, the **piano keyboard on/off**, zoom, full screen).
- **The keyboard is a docked full-width 88-key strip at the very bottom**, flat white and black, the sounding keys
  filled with the accent (violet) whole-key, no labels, **no pedal drawn at all**. The score sits above it and runs
  under it; nothing else sits between score and keys. No empty band.
- A progress line under the toolbar is the seek bar.
- Phone: the same toolbar scrolls sideways; the score and the keys take the screen.

### Songscription player (text and labels of the saved DOM; its CSS was not saved)
- Transport: Go to the start, Play (Space), the time, **Metronome** ("Sound a click on every beat while the score
  plays"), **Mixer**, **Keyboard** ("Show just the keys under the score"), the **tempo `♩ = 87 · 1×`** ("Drag up or
  down to change it"), **Key and pitch** (− F major +, Reset, "Transpose entire score"), More, Settings.
- **View menu, each choice with one line that says what it does:** Page "The pages as they print, side by side",
  Infinite width "One long system, nothing breaks", Infinite height "Fills the window at any size". Zoom − 100% +,
  with 50–400% presets.
- **Hands:** Left hand · Right hand, "Hidden lines are silent too."
- **Keyboard:** Keys shown, Lowest key shown, Highest key shown (A0–C8).
- Lesson: every choice is a plain name plus one short line; the commonest (view, zoom, keys) first.

### Piano Lesson with Warren, MIDI Player (`ref/warren-laptop.png`)
- A dark **keyboard housing**: a "notes display" strip over the keys naming the chord held, the keys, and a
  **sustain pedal drawn as a picture of a real pedal** (`pedal.png` / `pedal-pressed.png`) beside them, swapped for the
  pressed picture while the sustain is down (MIDI CC64 or the on-screen pedal).
- A transport row: Key, Tempo, Bar, Beat, Signature, Time, Metronome − +, Speed, Transpose.
- Settings as raw checkboxes ("Hide elements: Keyboard, Chord Name, Bass Note…") — what not to do.

## Live web pianos

| Site | What we saw | Pedal |
| --- | --- | --- |
| piano.org | Vercel security checkpoint, not reachable from here (`web/piano.org--laptop.png`) | — |
| pianu.com, virtualpiano.net | Cloudflare blocked (`web/pianu.com--laptop.png`, `web/virtualpiano.net--laptop.png`) | known: virtualpiano.net has a **Sustain** toggle in its bar and Space as the pedal |
| recursivearts Virtual Piano (`web/recursivearts-started.png`) | a drawn instrument: a control panel over the keys | **SUSTAIN a latch button with an LED**, lit while on |
| musicca.com/piano (`web/musicca.com-piano-laptop.png`) | flat keys, Settings · Record · Mark over them, note names on every key | none |
| onlinepianist.com (fetched) | 5 octaves on a phone, 88 on a desktop | sustain on by default, half-pedal added 2026 |

Known from the apps (no shot possible here): **Synthesia** lights a pedal indicator and draws the pedal's span as a bar
under the falling notes; **Flowkey** and **Simply Piano** show only the score's "Ped." marks; **Playground Sessions**
draws the sustain under the keyboard at the left; **GarageBand iOS** has a Sustain control at the keyboard's left
edge (hold, or slide to latch); **Pianoteq** draws three pedals in a row, centred, each going down with its depth.

## What we take

1. **The pedals belong to the instrument, centred under the keys**, as on an upright or grand (Pianoteq, the real
   instrument): soft (left), sostenuto (middle, only where shown), sustain (right). Drawn as brass pedals on a dark
   lyre bar, each going down (tilt + darker) while down, the sustain lit in honey. Never a lone lever at the
   bottom-right corner.
2. **Usable by touch**: hold a pedal to press it; a tap latches the sustain (the recursivearts LED / GarageBand latch),
   shown by a small lit dot; tap again to lift. While the music plays the pedals follow the score's pedal and are not
   pressable (they show, they don't fight the score).
3. **The strip over the keys names the chord held** (Warren's notes display), with − + and the piano's ⚙ — the keys
   hold nothing else.
4. **No band between score and keys** (MuseScore): the keys dock straight under the score.
5. **Every setting with a plain name and one line** (Songscription), the commonest first: the View (Page / Vertical /
   Panorama, each with its line), Zoom, then what plays.
6. **Tempo shown as the number of the music** (MuseScore's BPM − 168 +, Songscription's `♩ = 87 · 1×`).
