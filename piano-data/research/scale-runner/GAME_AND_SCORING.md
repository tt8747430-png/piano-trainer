# Scale Runner: practice modes, rules, scoring, streaks

Source for everything here: the Dart AOT snapshot `Contents/Frameworks/App.framework/Versions/A/App` (arm64 slice), read with `strings` plus a UTF-16 scan. No decompiler was available (no `blutter`), so **numeric constants inside code (timing windows in ms, tier thresholds, score weights, milestone days) are not recoverable**. Each claim is marked:

- **exact**: the string, class or member name is in the snapshot (quoted as it appears)
- **inferred**: my reading of how those exact pieces fit together

Snapshot strings are stored in hash order. Strings that sit next to each other are not necessarily related.

## 1. Source layout (exact, from `package:scale_runner/...` paths)

| Folder | Files |
|---|---|
| runner/ | `scale_run_controller.dart`, `inversion_run_controller.dart`, `jam_mode_controller.dart`, `voicing_run_controller.dart`, `free_play_controller.dart`, `beat_judge.dart`, `beat_debug.dart`, `meter.dart`, `note_latch.dart` |
| quiz/ | `quiz_controller.dart`, `quiz_settings.dart`, `validators.dart` |
| theory/ | `music_theory.dart`, `scale_running.dart`, `inversion_running.dart`, `jam_mode.dart`, `voicings.dart`, `chord_namer.dart`, `fretboard.dart` |
| streak/ | `streak_service.dart` |
| notifications/ | `notification_service.dart` |
| midi/ | `midi_service.dart`, `ble_latency.dart` |
| audio/ | `note_player.dart` |
| purchases/ | `purchase_service.dart`, `paywall_sheet.dart` |
| promo/ | `promo_service.dart`, `groove_promo_sheet.dart`, `groove_promo_tab.dart` |
| social/, sync/ | `social_backend/config/models/service.dart`, `sync_backend/service.dart`, `synced_settings.dart` |
| onboarding/ | `mode_guides.dart` |
| screens/ | home, splash, free_play, quiz, scale_run, inversion_run, jam_mode, voicings, voicing_capture, voicing_drill, stats, settings, social, friends, friend_profile, accept_invite, midi_monitor, latency_calibration |
| widgets/ | piano_keyboard, fretboard_view, fret_box_stepper, instrument_surface, metronome_bar, timing_difficulty_selector, guide_demo, mode_guide_sheet, welcome_sheet, reminder_prompt_sheet, rotate_hint_banner, streak_sheets, avatar_picker_sheet, voicing_thumbnail, social_widgets, plus a settings sheet and a session-summary sheet for each timed mode |

## 2. The eight practice modes (exact names and subtitles)

The home screen headings are "Pick a practice mode", "Scale practice", "Chord practice" and "Timed exercises against the metronome" (exact). Which mode sits under which heading is inferred.

| Mode | Home/guide copy (exact) | Free or Pro |
|---|---|---|
| **Free Play** | "Play anything. Chords and intervals are named as you play them" · "Notes, intervals and chords are named as you play" · "Play anything. Whatever is sounding gets named live." · "Two notes show the interval, three or more the chord." | Free |
| **Scales** (quiz) | "Play scales from a random key, note by note" · "Play the scale, low to high" · "Play it from the root, one note at a time." · "You'll see a name like "G Major" and its formula, e.g. 1-2-3-4-5-6-7. Each number is a scale degree, and they light up as you play the right notes." | Free |
| **Chords** (quiz) | "Build the named chord, note by note or all at once" · "Build the chord" · "Hold it until every note lights up." · "Play all the chord notes together" | Free |
| **Scale Running** | "Hold chords and run their modes in time, key by key" · "Strike the chord, run the mode: one note per beat" · "Hold the chord, run the mode: one note per beat" · "Run the scale: one note per beat" · "Play the chord on beat one, then run its mode." · "Finish the scale to get the next key." | Pro (free trial sessions) |
| **Inversion Running** | "Walk a chord up its inversions an octave and back down" · "Play the chord, then walk it up through its inversions and back." · "Each round picks a random chord and key, then walks its inversions up an octave and back down." · "Each inversion is built from scratch, so lift off between them." | Pro (free trial sessions) |
| **Jam Mode** | "Comp diatonic chords in time, one per bar, in a single key" · "One diatonic chord per bar, all in a single key." · "The whole session plays in one key. Chords are drawn at random from the families below." · "Each chord shows during its count-in; strike it on the downbeat." · "Any voicing counts, and a slightly late hit still scores." | Pro (free trial sessions) |
| **Voicings** (capture + drill) | "Build a voicing, then play it in all 12 keys" · "Capture a chord shape you like by playing it." · "Save it, then drill it through all 12 keys." · "One shape, every key." | Free up to 3 saved voicings, then Pro |
| **MIDI monitor / Test your keyboard** | "Test your keyboard" · "Keyboard working!" · "Play any key on your keyboard in time with the metronome." | Free (utility) |

The guide summary (exact): "Free Play names whatever you play. Scales and Chords quiz you with random prompts. Scale Running is a continuous drill in time with the metronome."

## 3. Scales (quiz and Scale Running)

All names and formula strings are exact. Which name goes with which formula is inferred from standard theory. The full table is in `data/scales.json`.

The Scales settings sheet groups scales under four exact headings: "Major Scale", "Harmonic Minor Scale", "Melodic Minor Scale" and "Other Scales". Membership of each group is inferred.

- **Major Scale (7 modes):** Major (Ionian) `1-2-3-4-5-6-7`, Dorian `1-2-b3-4-5-6-b7`, Phrygian `1-b2-b3-4-5-b6-b7`, Lydian `1-2-3-#4-5-6-7`, Mixolydian `1-2-3-4-5-6-b7`, Aeolian (Natural Minor) `1-2-b3-4-5-b6-b7`, Locrian `1-b2-b3-4-b5-b6-b7`
- **Harmonic Minor Scale (7 modes):** Harmonic Minor `1-2-b3-4-5-b6-7`, Locrian ♮6 `1-b2-b3-4-b5-6-b7`, Ionian #5 (Augmented Major) `1-2-3-4-#5-6-7`, Dorian #4 (Ukrainian Dorian) `1-2-b3-#4-5-6-b7`, Phrygian Dominant `1-b2-3-4-5-b6-b7`, Lydian #2 `1-#2-3-#4-5-6-7`, Ultralocrian (Altered Diminished) `1-b2-b3-b4-b5-b6-bb7`
- **Melodic Minor Scale (7 modes):** Melodic Minor (asc) `1-2-b3-4-5-6-7`, Dorian b2 (Phrygian ♮6) `1-b2-b3-4-5-6-b7`, Lydian Augmented `1-2-3-#4-#5-6-7`, Lydian Dominant `1-2-3-#4-5-6-b7`, Mixolydian b6 `1-2-3-4-5-b6-b7`, Locrian ♮2 (Half-Diminished) `1-2-b3-4-b5-b6-b7`, Altered (Super Locrian) `1-b2-b3-b4-b5-b6-b7`
- **Other Scales:** Major Pentatonic, Minor Pentatonic, Blues, Chromatic. No formula strings exist for these, so they are built in code (inferred).

### Quiz rules

- **exact:** A prompt shows a key and scale with its formula ("A key and scale are named at the top, with its formula.").
- **exact:** The degree numbers light up as you play the right notes.
- **exact:** On-screen answers: "Tap the on-screen keys to answer. Correct notes turn green; wrong ones flash red and you just try again." Also "Correct notes light green, wrong ones flash red. Just try again."
- **exact:** When a prompt is solved: "Correct! Press any key to continue" / "Nailed it!".
- **exact, quiz settings:**
  - per-quiz scale or chord selection ("Keep at least one selected")
  - key selection ("All keys", "<n> of 12 selected")
  - hints: "Show key dots" ("Highlight the keys to press on the keyboard. Turn off for a harder challenge."; for chords: "Highlight the chord tones on the keyboard…")
  - "Show formula" ("The degree formula under the scale/chord name")
  - "Show stats bar" ("The score, streak, and best row at the top")
  - "Beat indicator" ("Flash the metronome BPM green/amber/red with your key timing")
- **exact:** The settings sheet has `_practiceTab` and `_challengeTab` builders, so it has Practice and Challenge tabs.
- **exact:** Stored per quiz: `score_scales/chords` and `best_streak_scales/chords` (`quizBestStreak`, `recordQuizWin`). "Reset stats" says: "<…> score and best streak on this device will go back to zero. This can't be undone."
- **inferred:** Score is +1 per solved prompt and streak counts consecutive solved prompts. The exact rule (for example, whether a wrong note breaks the streak) is not recoverable.
- **exact:** Validation uses `ScaleValidator.fromFormula`, `ChordRule`, `isDegreeSolved`, `StepResult` (with `correct`, `wrong`, `ignored`, `waiting` present) and `NoteResult`.
- **exact:** On-screen chord building is held by `LatchingInput`/`NoteLatch`: "Build chords one note at a time on the on-screen keys. Notes stay lit until the chord completes, a wrong note is played, or 2 seconds pass. MIDI instruments still hold every note." **So the latch timeout is 2 s (exact).**

## 4. Scale Running (`ScaleRunController`, `scale_running.dart`)

- **Concept (exact):** strike or hold a chord on beat one, then run its mode one note per beat, key by key. "Hold each chord while running its mode. Off = plain scale runs."
- **Progression presets (exact, `data/progressions.json`):**
  - Hold C, run C Ionian
  - 2-5-1
  - 2-5-1 (Minor)
  - 2-5-1 (Minor - Jazz)
  - 2-5-1 (Tritone Substitution)
  - 2-5-1-6 (Tritone Substitution - Alternative)
  - 1-6-2-5
  - 1-6-2-5 (Alternative)
  - 1-4-5
  - 1-5-6-4
  - 12-bar blues

  "Follow a chord progression".
- **Key movement (exact):** "How the key advances after each full pass of the progression":
  - "By fifths": "Round the circle of fifths once. <n> keys."
  - "Chromatic": "Up a semitone at a time for an octave, then back down. 25 keys."
- **Other settings (exact):**
  - "Starting key" ("The key the drill begins in when you press Start")
  - "Reps per key"
  - "Use 7th chords" ("Four-note diatonic 7ths instead of triads")
  - "Count in between keys" ("One bar of clicks before each new key so you can reset your hands. Off rolls straight into the next key." / "A one-bar count-in leads into each new key.")
  - target dots
  - "Meter (locked while running)"
- **Run state (exact members):**
  - methods: `_enterKeyCountIn`, `_beginChordWindow`, `_judgeFirstDownbeatPress`, `_judgeGraceDuringCountIn`, `_armGrace`, `_rescueGraceBeat`, `_recordStrike`, `_settleBeat`, `_expectedPcAt`
  - getters: `beatsUntilDownbeat`, `beatsUntilStrike`, `keysCompleted`, `currentStep`, `stepIndex`, `chordHeldCorrectly`, `currentChordMatched`
  - debug logs: "GRACE(count-in) pc=", " rescued beat=", " MISSED (nothing landed) since=", "  SCORE off="
- **Rules (inferred from those names):**
  - Each beat expects one pitch class.
  - A press is judged against the beat time minus the device latency.
  - A press slightly before the downbeat, during the count-in, is "rescued" into the first beat (grace window `graceMs`).
  - A beat with no press is "MISSED".
- **Stats (exact):** `run_attempts`, `run_correct`, `run_key_stats` (per key), `run_mode_stats` (per mode). Stats screen labels: "Weakest key", "Weakest mode", "By mode". Reset copy: "Clear the accuracy you've accumulated by key and mode."
- **Summary sheet (exact):** `ScaleRunSessionSummarySheet`, with labels "WEAKEST", "WORK ON", "NEXT UP", "Run it again", "Start again", "Keep practicing", "% accuracy ".

## 5. Timing, beat judging and difficulty (`beat_judge.dart`, `timing_difficulty_selector.dart`)

- **exact:** Enum `TimingDifficulty`. The labels "Easy", "Normal" and "Strict" and the identifiers `easy`, `normal`, `strict` are present. **inferred:** these are its three values.
- **exact selector copy:** "How tight the timing windows are, in every mode: on-beat within <X>ms, close within <Y>ms". The X and Y values are inserted at runtime from code constants and are **not recoverable** without a decompiler.
- **exact:** Enum `BeatAccuracy`, with `onBeat`, `close`, `off` present. Enum `BeatVerdict`.
- **exact:** UI legend "Green is on the beat, amber is close, red is off." Labels "On time", "Close, a bit off", "Missed".
- **exact:** The metronome BPM readout flashes green, amber or red with each key timing (beat indicator option).
- **exact:** Latency compensation through `resolveInputLatencyMs`, `inputLatencyMs`, `latency_<device>` keys and `ble_latency.dart`. "Calibration complete! Timing offsets for your device will be applied to scoring automatically."

## 6. Inversion Running (`InversionRunController`, `inversion_running.dart`)

- **exact:** Picks a random chord and key, then walks root position, "1st inversion", "2nd inversion", "Root (8va)" and back down ("Back to root").
- **exact:** "Tempo mode": "Advance on the metronome beat (count-in first). Off = self-paced: play each voicing to advance." "In tempo mode, one inversion per beat after the count-in."
- **exact:** Chords are selectable (`inv_chords`, `_chordTile`, `_toggleChord`). Stats are per chord (`inv_chord_stats`, "Weakest chord", "Play an Inversion Running session to see per-chord stats here.").
- **exact:** Enums `InversionPhase`, `InversionCycle`.

## 7. Jam Mode (`JamModeController`, `jam_mode.dart`)

- **exact:** One key per session. Chord families: "Triads", "7th chords", "9th chords", "Sus2 / Sus4" (enum `JamFamily`; identifiers `triad`, `seventh`, `ninth`, `sus` present).
- **exact:** "Prompted shows a specific chord each bar. Freestyle lets you play any diatonic chord, just don't play the same scale degree twice in a row." (`jam_freestyle`, `freestyleForbiddenLabel`, `liveChordIsRepeat`)
- **exact:** "Any chord tones": "Play any voicing of 3 or more notes built on the prompted root: 3rds, 7ths, 9ths, sus tones, doubled freely. The lowest note must be the root. The family picks below are ignored while this is on."
- **exact:** "Session length": "How many chords per session. The drill ends and tallies automatically after the last one." (`jam_session_bars`)
- **exact:** "Count-in display": "Numbers (4 3 2 1)" or "Beat dots" ("How the count toward each chord's strike is shown.").
- **exact UI states:** "Chord ready", "Chord struck", "Chord held", "Chord missed", "The next chord follows straight away.", "Get ready…", "Next chord…"
- **exact:** Controller members `_resolveGrace`, `_resolveGraceTimedOut`, `_scoreCurrent`, `_matcher`, `_picker`, `jamScore`, `JamResult`.
- **exact:** Stats per quality and degree (`jam_quality_stats`, `jam_degree_stats`, "Weakest quality", "Weakest degree", "By quality", "By degree").

## 8. Voicings (`VoicingRunController`, voicing capture and drill)

- **exact capture:**
  - "Play the chord on your keyboard, or tap the keys below. Notes stay put once played. Play one again to remove it."
  - "Which note is the root?" ("Defaults to the lowest note. Pick any of the twelve, since a rootless voicing has no root in it at all.")
  - "What do you call this shape?" (e.g. Maj7 drop 2)
  - "Name it"
  - duplicate check ("You already have this shape", "" is the same voicing: ", ". Save this one as well?", "Save anyway")
- **exact drill:**
  - "Its voicing moves": "By fifths", "Chromatic", "Up the neck", "Toward the nut" (guitar)
  - "Starting key"
  - "Show the shape's spelling (e.g. 7-3-5-1) under the key name."
  - "One shape, every key. Changing either of these restarts the drill."
- **exact library:**
  - folders, tags, search ("Search voicings, tags, folders"), "Ungrouped"
  - reorder, duplicate, move
  - free limit getter `_atFreeLimit`: "Build and drill as many shapes as you want, past the free 3."
- **exact, guitar support:**
  - `fretboard.dart`, `fret_box_stepper.dart`
  - "Label each string above the board — E A D G B E"
  - "Number the first fret shown and the position markers beside it"
  - "Note names on dots only" ("Off names all 30 cells…")
  - twin-dot mode ("Primary only", "Primary + ghost", "All positions"; "A note often lives in more than one place on the neck…")
  - "This voicing does not fit under a hand on guitar"
  - "Its notes are spread wider than six strings can hold in every key of the cycle."
  - left-handed mirror

## 9. Per-mode score and tiers

- **exact:** "A 0–100 score per mode, blending accuracy with how much you've practiced. Shared with friends." Getters `scaleRunningScore`, `inversionScore`, `jamScore`; UI "Mode scores".
- **exact:** Enums `RunTier` and `JamTier`. Identifiers `openingAct`, `localLegend`, `internationalRecordingStar`; labels "Opening Act", "Local Legend", "International Recording Star".
- **inferred:**
  - these are three rank bands shown on the session summary (and maybe the profile)
  - score thresholds and the blend weights are code constants (unknown)
  - the formula blends accuracy (correct/attempts) with a practice-volume term

## 10. Daily streak (`streak_service.dart`, `streak_sheets.dart`)

- **exact keys:** `daily_streak_current`, `daily_streak_best`, `daily_streak_total_days`, `daily_streak_last_date`, `daily_streak_freeze_used_week`. Methods `_evaluateGap`, `_isoWeek`, `_sameDate`, `_parseDate`, `_formatDate`, `recordPractice`, `_markPractice`.
- **exact events:** `StreakUpdate`, `StreakOpenEvent`, `StreakFrozen`, `StreakLost`, and the sheets `StreakFrozenSheet`, `StreakLostSheet`, `StreakMilestoneSheet`.
- **Rules (exact copy):**
  - Pro gets one automatic freeze per ISO week: "One missed day a week is repaired automatically." and "You get one freeze per week".
  - Frozen: "Streak saved" / "You missed a day, but your Pro streak freeze kept your <n>-day streak alive. You get one freeze per week, so practice today to stay safe."
  - Lost: "<n>-day streak ended" / "Life happens. Pro members get a weekly streak freeze that would have saved it, and every practice mode, forever." with the CTA "Protect my next streak". Also "…-day streak once. Five minutes starts the next one."
  - Milestone: "You started a streak!", "<n>-day streak!", "That's serious dedication: <n> days of practice in a row.", " days in a row. Keep it rolling!" Share: "Share your streak", "🔥 I've practiced piano <n> days in a row with Scale Runner! Join me: <link>".
- **inferred:**
  - A day counts once any session is recorded (`recordPractice`); "Five minutes counts" is notification copy, not a measured threshold.
  - A gap of 1 missed day plus an unused freeze this week gives Frozen; a larger gap gives Lost.
  - Milestone day values are unknown.
- **exact, home badge:** `_StreakBadge`. Stats: "Practice streak", "Best streak", "total days", "Days practiced per week", "This week" (`days_mask`, `iso_week`).

## 11. Reminders (`notification_service.dart`, flutter_local_notifications)

- **exact:** Three schedulers, `_scheduleDaily`, `_scheduleAtRisk` and `_scheduleWinBack`, plus `_todayAt`, `_nextInstanceOf` and `_isToday`.
- **exact copy:**
  - Settings tile: "Practice reminders": "A daily nudge at your chosen time, plus a heads-up when your streak is about to break". "Reminder time".
  - Prompt sheet: "Daily practice is how it sticks. Want a reminder at a time that suits you?" with "Remind me daily" / "Maybe later" / "Not now".
  - Denied: "Notifications are blocked. Allow them for Scale Runner in your device settings first." / "Notifications are off. You can enable reminders anytime in Settings."
  - At-risk: "<n>-day streak on the line" / "It ends at midnight. One quick session saves it."
  - Win-back: "Pick up where you left off. Five minutes counts." / "A few minutes at the keys keeps you moving forward."
- **exact:** Keys `reminders_enabled`, `reminder_hour`, `reminder_minute`, `reminder_prompt_seen`. The time zone comes from `flutter_timezone` plus `timezone` (TZDateTime).
- **inferred:**
  - the daily reminder repeats at the chosen time
  - at-risk fires on the evening of a streak day not yet practised
  - win-back fires some days after the streak is lost (delay unknown)

## 12. Stats screen (`stats_screen.dart`)

- **exact:**
  - `_AccuracyBarList`, `_StatBar`, `_weakestBadge`, `_modeScoreTile`, `_quizModeCard`, `_syncCta`
  - labels "Lifetime stats", "Accuracy", "Weakest key/mode/quality/degree/chord", "By mode/quality/degree", "No mode data yet.", "No degree data yet.", "No history yet. A week of practice shows up here."
  - resets "Reset weak-point stats", "Scale Running stats reset", "Jam Mode stats reset"
  - "This clears the per-key and per-mode accuracy recorded on this device. Practice synced from other devices stays. It can't be undone."
- **exact:** Per-device stats are merged across devices (`_mergeStats`, `_mergedCounters`, `_ownCounters`, `_remoteBuckets`, `device_stats`).
