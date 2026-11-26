# Piano Trainer takeaways from Scale Runner

Each item names where it fits in Piano Trainer. "SR" means Scale Runner.

## Adopt

1. **Practice → Scales and keys: the 21-mode catalogue as data.**
   - SR ships the 7 modes of each of major, harmonic minor and melodic minor, plus pentatonics, blues and chromatic.
   - Each scale carries a degree formula string such as `1-2-b3-4-5-6-b7`, shown under the name and lit up degree by degree as the user plays.
   - Store our scales the same way (name + formula + family), so one validator (`ScaleValidator.fromFormula`) covers every scale.
   - Seed data: `data/scales.json`.

2. **Practice → Scales and keys: "Scale Running" as a timed drill.**
   - Strike the chord on beat 1, then run its mode one note per beat.
   - The key advances after each pass of a progression: by fifths (one lap of the circle) or chromatic (up an octave by semitones and back down, 25 keys).
   - It has an optional one-bar count-in between keys and reps per key.
   - It fits our Scales and Progressions tools together: the progression presets (2-5-1 family, 1-6-2-5, 1-4-5, 1-5-6-4, 12-bar blues) map onto our Progressions list.

3. **Practice → Chords: "Inversion Running".**
   - A random chord and key, walked root → 1st → 2nd → root 8va and back.
   - It has a tempo mode (one inversion per beat after a count-in) or a self-paced mode.
   - Its copy "Each inversion is built from scratch, so lift off between them" makes a good hint line.

4. **Practice → Accompaniment: "Jam Mode".**
   - One key per session; one diatonic chord per bar, struck on the downbeat after a visible 4-3-2-1 count-in.
   - Two variants: **Prompted** (a named chord) and **Freestyle** (any diatonic chord, but never the same degree twice in a row).
   - "Any chord tones" is a voicing-agnostic option (3+ notes on the prompted root, lowest note must be the root).
   - Chord families: triads, 7ths, 9ths, sus.

5. **Player and every timed tool: three-level timing feedback.**
   - On beat = green, close = amber, off = red, plus a missed state.
   - A global Easy / Normal / Strict difficulty sets the two windows, and the selector explains them in ms ("on-beat within X ms, close within Y ms").
   - Put this in Settings and reuse it in Wait mode and Metronome.
   - SR's values were not recoverable. Choose ours and show them the same way.

6. **Settings → MIDI: latency calibration by 8 taps.**
   - The user taps along with the click 8 times; the app stores a per-device offset and warns when the spread is wide ("retry somewhere quieter, or with wired audio").
   - The offset is applied to all scoring.
   - Keep a separate default for Bluetooth MIDI (SR has `ble_latency.dart`).
   - In a PWA, Web MIDI gives no BLE pairing, so the calibration matters even more.

7. **Practice: grace for early presses.** SR "rescues" a press that lands just before the first downbeat, during the count-in, so starting a hair early is not a miss. Good for Wait mode and the Metronome exercises.

8. **Practice tools: on-screen chord entry latch.** On-screen keys latch a note until the chord completes, a wrong note is played, or **2 s** pass. MIDI notes are held normally. This makes chord quizzes playable by mouse or touch.

9. **Profile: weakness analytics.**
   - Per key, per mode, per chord quality and per degree, the app tracks attempts/correct, plus "Weakest key / mode / quality / degree / chord" badges and a "WORK ON" line on each session summary.
   - Each reset is explained ("Practice synced from other devices stays").

10. **Profile: a 0–100 score per mode** that blends accuracy with practice volume, plus three named tiers (Opening Act → Local Legend → International Recording Star). It is a friendlier ladder than raw percentages. Our names and thresholds are our own.

11. **Profile → streak: an honest weekly freeze.**
    - Copy for each event: milestone ("You started a streak!"), frozen ("Streak saved"), lost ("Five minutes starts the next one").
    - Day dots for this week.
    - SR makes the freeze Pro-only. For a free offline PWA, a free weekly freeze is fine.

12. **Settings → Reminders: three notifications, not one.**
    - Daily at a chosen time, an "at risk" nudge on the evening of an unpractised streak day ("It ends at midnight. One quick session saves it."), and a win-back after a lapse.
    - Ask once via a sheet ("Daily practice is how it sticks…") rather than at first launch.

13. **Learn / every Practice mode: a one-time mode guide** with a few seconds of animated keyboard demo ("A few seconds of how it works:"), stored as `guide_seen_<mode>`.

14. **Practice → Chords: a voicing library.**
    - Capture a shape by playing it, pick the root (rootless voicings allowed), name it ("Maj7 drop 2"), then drill it through 12 keys by fifths or chromatically.
    - The library has folders, tags, search and duplicate detection ("You already have this shape").
    - This fits our Chord player and Chord finder.

## Avoid or adapt

- **Hard paywall on core timed drills** (SR: a few trial sessions, then a one-time Pro unlock). Piano Trainer is offline-first and does not need this. If we monetise, gate content volume rather than the timing engine.
- **Pro-only streak protection.** Punishing the free user for a missed day works against the learning goal.
- **No localisation** (SR is English only). Keep our EN/RU string tables from day one; SR's copy is concise and a good model for tone.
- **Hidden numbers.** SR never shows its tier thresholds or score weights. Show ours (Profile tooltip).
- **Account required for friends.** Fine for later. Keep Piano Trainer fully useful without an account, as SR does ("Everything else works without an account").
