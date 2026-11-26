# Piano Trainer takeaways from Chordio 3.3.0

Each item names where it fits in Piano Trainer. "Adopt" means worth building. "Avoid" means a weakness to steer clear of.

## Practice tools: Chords, Chord finder
1. **Adopt the cost-based chord-name ranker** (THEORY_ENGINE §2, `data/engine_tables.json`). It is a small, deterministic algorithm, about 150 lines of TypeScript:
   - try every sounding pitch class as the root;
   - add a bass penalty (0 / 0.5 / 1.0 for a slash bass);
   - add the cheapest template among the 27 interval templates, with extra-tone penalties;
   - when the best cost is > 1.9, prefer the bass as root.
   Show the best name plus up to 2 alternatives with cost ≤ 3.0 when there are 4 or more pitch classes. Use it in the **Chord finder** and for live chord labels in **Practice ▸ Chords** and the **Player**. Write the values as our own table with our own tests; do not copy their code.
2. **Adopt "alternative names" UX**: show the primary name, with secondary and tertiary names selectable, and store the user's choice (`displayIndex`) with the chord. This fits Chord finder results and chord symbols in the **score editor**.
3. **Adopt per-note role tags in chord data**: Chordio tags chord tones as normal, **coloured bass** (channel 9) or **melody/top** (channel 1), and colours them separately. Fits Piano Trainer's progression/voicing model (**Practice ▸ Progressions**, Chord player) for left-hand bass versus right-hand voicing.
4. **Adopt Krumhansl–Kessler key detection** (duration-weighted, drums excluded, Pearson over 24 keys; profiles in `engine_tables.json`) for **Songs ▸ MIDI import**, so imported files get a key signature. Also adopt "MIDI looks like block chords → convert to chord cells" for importing progressions.
5. **Avoid** relying on an opaque ML suggester. Chordio's 805-class LSTM has no licence and only predicts a next-chord id. For "what next?" in **Practice ▸ Progressions**, rule-based Harmony Explorer lists are explainable to learners: diatonic, borrowed, secondary dominants, tritone subs, and cadences (Authentic V7-I, Plagal IV-I, Half I-V, Deceptive V7-vi, Backdoor ♭VII7-I).

## Player (Wait mode, hands, Listen)
6. **Adopt Chordio's Wait Mode rules exactly as a baseline** (PRACTICE §3). A step is all notes sharing one start time in the active hand(s). Matched notes turn green and accumulate in any order, with no simultaneity window. A wrong note flashes the expected notes red for 0.32 s, with no penalty. The step advances when every expected note has been matched, and note-offs are ignored. This is lenient and beginner-friendly. Fits the **Player ▸ Wait mode**.
   - **Improve on it**: Chordio records nothing, so it has no accuracy and no wrong-note count. Piano Trainer should log wrong notes and time-per-step so Profile and Learn can use them.
7. **Adopt hand selection by MIDI track/channel** (RH = ch 0/track 1, LH = ch 1/track 2), applied to both playback muting and Wait-mode expectations. Fits **Player ▸ hands**, and MusicXML-imported parts mapped to staves.
8. **Adopt count-in that snaps to the bar start**: one bar at the *adjusted* tempo (tempo × speed %), first click immediately, then playback starts on the downbeat. Fits the **Player** and the **Metronome**.
9. **Adopt the "practice mix"** (separate piano / bass / drums volumes) for jazz or pop songs that ship with accompaniment tracks. Fits **Songs** with backing, and **Practice ▸ Accompaniment**.
10. **Adopt the Wait-mode progress pill**: "matched / expected", a progress bar, and a ✓ flash on step success. A cheap, clear feedback element in the **Player**.

## Practice ▸ Accompaniment, Metronome
11. **Adopt the step-string drum format** (`.`/`g`/`o`/`x`/`X`; bars × beatsPerBar × stepsPerBeat; swing 0–0.33; GM notes). It is compact and human-editable, and the editor's tap-to-cycle plus swipe-to-paint grid is a good interaction. Use it for **Accompaniment** styles and a **Metronome** "groove" mode. Write our own pattern content.
12. **Use the exported FluidR3 GM drum WAVs (MIT)** from `export/GM Drum Kits/` for offline drum playback. 7 kits, 61 GM notes each. They are small, and attenuation is baked into the files. Credit Frank Wen.
13. **Adopt the bassline generator design**: 7 styles (Roots, Pulse, Groove, Walking, Bossa, Pop, Funk) and 3 sliders (Complexity, Swing, Humanise), a look-ahead to the next chord root for approach notes, and practice routing Full / Bass Only / Chords Only. Fits **Practice ▸ Accompaniment** ("play the left hand for me").
14. **Adopt named swing presets** (Off 50%, A 54, B 58, C 62, D 66.7 triplet, E 71, F 75 for 1/8 and 1/16, with one-line descriptions). These are friendlier than a raw slider. Fits **Player** and **Accompaniment**.
15. **Adopt tap tempo with outlier reset** (ratio > 1.5 → keep the last 2 taps). Fits the **Metronome**.
16. **Adopt Key Cycle** (play a progression through all 12 keys: 4ths, 5ths, half/whole steps, minor 3rds, random with tonic first, auto-advance after N loops). Fits **Practice ▸ Progressions / Scales and keys**.

## Practice ▸ Circle of fifths, Scales and keys
17. **Adopt the mode ring**: 12 slices, tonic at the top, and the 7 diatonic chords as a contiguous arc coloured by quality (major blue, minor green, diminished red, non-diatonic grey), with Roman numerals on an inner ring. It rotates with the key. One data-driven SVG covers all 7 modes; do not ship 7 PNGs as Chordio does. Fits the **Circle of fifths** tool.
18. **Adopt scale-page content patterns**: each scale has a summary, a "signature" degree with an explanation, step pattern (H/W), degree labels, and an overlay with root in green and other notes in yellow. Fits **Scales and keys**. Write our own prose; theirs is in `data/strings_en.json` for reference.
19. **Adopt notation-name options**: English, German (H/B), French Ut-Ré-Mi, fixed-Do with ♯/♭, and Solfège (Do Di Re Ri…). Interval names can be English or localised. This matters for Russian learners (fixed-Do and German B/H conventions). Fits **Settings**.

## Learn, Profile
20. **Avoid Chordio's lack of any progress model**: no XP, streaks, history or persisted quiz scores ("Score x / y" disappears). Piano Trainer's Profile (badges, streak) is a clear differentiator. Feed it from Wait-mode, quiz and lesson events.
21. **Adopt the four quiz types as Learn exercises**: note identification on the staff (answer on the keyboard), interval by ear (13-button grid), play a named chord in any octave (check by pitch-class set, accept enharmonic roots), and chord by ear plus highlighted keys (name grid). Fits **Learn** lessons and **Practice ▸ Intervals/Chords**.
22. **Adopt lesson markers with a title and description** ("Title\nDescription" in one string, time in beats). The learner can add, rename and delete their own markers. Fits **Songs** and the **Player** (sections and loops).

## Songs, score editor
23. **Adopt a per-score settings record** stored with the song: tempo, transpose, swing preset, clefs, note size, note letters, repeat/loop bars, cursor height, reverb, and bass/drum instrument. Fits the **Songs library** model.
24. **Adopt Markdown study notes per score** ("Brief history" plus numbered "playing directions"), shown in a resizable panel beside the score. Fits **Songs** detail and **Learn**.
25. **Avoid** Chordio's NSKeyedArchiver formats, which are opaque and platform-bound. Keep MusicXML/MIDI + JSON. Chordio's formats are worth reading only to map fields (CONTENT_FORMATS.md).
26. **Avoid** the GPL-lineage score engine trap: Chordio's renderer looks like MidiSheetMusic (GPL) with no notice. Piano Trainer already uses Verovio (LGPL), so keep it.

## Settings, platform
27. **Adopt "Hold Last Chord"** and **sustain-pedal dimming of highlighted keys** (Subtle/Strong). These are small touches for the on-screen keyboard in the **Chord player** and **Player**.
28. **Adopt Launch Quantise** (a chord change waits for the next beat or bar) for tap-to-play chord pads in the **Chord player**.
29. **Adopt British/US spelling layers** as Chordio does (en-GB overrides), only if we ever add en-GB. For Russian, translate key music terms consistently (semitone/tone), as their en-GB layer does.
30. **Avoid** a monolithic home controller (Chordio's `HomeViewController` has 752 methods). Keep workspaces as separate React routes and stores.
