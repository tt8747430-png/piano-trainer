# R36 — The Player like Flowkey's, with hands at the keys

## Source

- Owner, 2026-11-06: "now continue and implement this in player something like the flowkeys player and improve our
  player and its modes and settings". "This" is the Hands at the keys mock-up (version 2): a real 3D hand posed on
  real-size keys, each finger pressing its key, the hand gliding with the fingering. The owner's answer to the last
  report's question: the 3D hand goes into the app (MIT, © 2019 Amazon, credited).
- The owner's Flowkey screenshots, `piano-data/reference-apps/flowkey/06–09`:
  - the bar: Back · a large Play in the middle · Tempo · Hands · Settings;
  - under it, a video of a pianist's hands on the keys from above, the keys due lit in orange;
  - under that, the music on one line, the playhead fixed, a Loop button on it; the loop's grips ‹ › over the bars;
  - the Hands menu, "Which hand would you like to learn?": Right Hand · Left Hand · Both Hands;
  - the Tempo menu: "Learn at your own pace": Wait Mode; "Listen and play along": 50% Speed · 75% Speed · Original
    Tempo.
- flowkey's help centre has no article on its player (checked 2026-11-06); the screenshots are the spec.
- Standing rulings: nothing reserves a band above the keys; no finger numbers on or under the keys; no piano roll; one
  gear; settings a learner understands, ordered by what matters; each preference one home; nothing floats over the
  music; the keys edge to edge; "how the modes work" was not intuitive (R31 brief).

## Today

- The bar: Close · title · Edit | Sustain · Keyboard · Settings (`ScoreBar`, `KeyboardTools`).
- The music (Page · Vertical · Panorama), the flat keys under it (`LiveKeyboard`, `scoreView.keys`), a divider.
- The transport: Loop · Restart · ‹ · Play · › · ♩ = 92 (`TempoButton`: Play along 50 · 75 · Original, a slider
  50–200 %, Speed training) · Metronome.
- The foot: View · Transpose · Version · Mode · More. Mode opens the Modes sheet, "What would you like to do?": Listen,
  Sight-read (waits for the notes), Practice (one hand, waits; Left · Both · Right and Hear the other hand on its
  card), Interpret (follows the learner's tempo).
- Settings: Score view, Playback (the other hand Show · Dim · Hide among its rows), Staves, Accompaniment, On-screen
  piano.

## Will build

### 1. Hands at the keys (R36-1)

- **Where:** the keys' place, under the music: a 3D piano seen from the pianist's seat, high as Flowkey's camera, the
  keys from their back to just past their front edge, the hands coming in from below. Edge to edge, resized by the
  same divider as the keys.
- **What it shows:** two hands playing the music. Each note is pressed by its finger: the score's fingering, else
  the app's (the passage and chord fingerings it already suggests). Between notes the hand glides along the keys,
  lifting a little as it travels. A key sinks while its note is held and wears its hand's colour, as Flowkey's video
  lights the keys: the right hand's brick, the left's lilac. In Listen the hands play as the music sounds; in Wait mode
  and Interpret they stand on the notes awaited, those keys lit, and play them when the learner does.
- **One hand:** the hand not being learned fades to a third.
- **The view:** the music's whole range fitted to the width, at least two octaves; where that would make the keys too
  small, the camera follows the hands, easing.
- **Reached by:** the bar's Keyboard becomes two toggles side by side: **Hands** (a hand) and **Keys** (a piano). One
  or neither is pressed; tapping the pressed one hides the place, the Keyboard strip brings back the one last shown.
  Sustain stays beside them. Remembered, as the keys are now.
- **Watch only:** the hands are not played by tapping; a piano (MIDI) or the Keys are.
- **States:** loading, the keys drawn and the hands fading in; a device that cannot draw 3D says "This device can't
  draw the hands." with **Show the keys**; offline, the hands are part of the installed app.
- **Settings › Hands (new page):** Skin, four tones (Light · Medium light · Medium dark · Dark).
- **Credit:** the hand model's licence (MIT, © 2019 Amazon.com) in Settings › About › Licences, with three.js's.

### 2. Pace, Flowkey's Tempo menu (R36-2)

- The transport's tempo button opens **Pace**:
  - **At your own pace:** **Wait mode**, "The music waits for the right notes."; **Interpret**, "The music follows
    your tempo."
  - **Listen and play along:** **50 %** · **75 %** · **Original tempo**, the slider (50–200 %, 5 % steps), Speed
    training (below the piece's tempo).
- The button reads **♩ = 92** in Listen, **Wait mode** or **Interpret** otherwise.
- Sight-read is renamed **Wait mode**, the established term (flowkey's; sight-reading is playing on without
  stopping). Practice goes: it was Wait mode for one hand, which the Hands choice now gives in every mode. The Modes
  sheet goes.

### 3. Hands, Flowkey's hands menu (R36-2)

- The foot's Mode becomes **Hands**: its label the hands played (Both · Right · Left), its icon a hand.
- It opens "Which hands do you play?": `HandsSegmented` (Left · Both · Right, in the keys' order), and with one hand
  chosen **Hear the other hand** (its one home).
- It counts in every mode: Wait mode waits for that hand, Interpret follows it, Listen plays the other only when it is
  heard; the music shows the other hand as Settings › Hands says (Show · Dim · Hide); the hands at the keys fade it.

### 4. Settings by what matters (R36-2)

- Score view · Playback · **Hands** (Skin; The other hand Show · Dim · Hide, moved from Playback) · Staves ·
  Accompaniment · On-screen piano.

## Left for the owner (drawn on the canvas)

1. Where the hands stand: A, in the keys' place under the music (recommended: the score on the stand, the hands below
   it, as a pianist sees them); B, Flowkey's: over the music.
2. The modes: A, in Pace with the speeds (recommended, flowkey's); B, a Modes sheet of three cards.
