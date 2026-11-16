# Piano Trainer takeaways from Tiny Instrument 2.7.0

Each item names where it fits in Piano Trainer. "Adopt" = worth copying in spirit; "Avoid" = learn from their mistake.

## Profile (badges, streak, XP)
1. **Adopt the small, auditable XP formula** (02 §2): base 10, accuracy up to 20, full-completion 10, combo up to 25, then flat bonuses first-ever 30, personal best 20, first-of-type-today 15, daily goal 25; diminishing repeats 1.0 / 0.6 / 0.3 / 0.1 per same type per day. Store each grant as an `XPTransaction {amount, source, type, date, refId}` row so the summary can show a per-source breakdown. Fits Profile + Player results screen.
2. **Adopt the triangular level curve** 50·(L−1)·L total XP (next level costs 100·L) with named ranks (Novice → Apprentice → Player → Musician → Performer → Virtuoso → Maestro every 5 levels). Russian titles needed. Profile.
3. **Adopt a badge catalog as data**: `{id, title, detail, howTo, icon, category, tier, target, progressFn}` with 10 categories (streak, consistency, accuracy, mastery, improvement, volume, combo, breadth, curriculum, challenge) and bronze/silver/gold. The `howTo` line and a progress bar on locked badges are cheap and motivating. Add a **backfill** pass that grants earned badges retroactively after an update. Profile.
4. **Adopt daily + weekly challenges** with deterministic date-seeded selection (works offline, same for the day, no server): e.g. 10 minutes / 3 sessions / 3 activity types / 15-note combo (30–45 XP); weekly 300 minutes / all 5 types / goal 5 days (120 XP). Fits Profile + Learn home.
5. **Adopt "habit day = ≥5 minutes"** as the streak unit and a separate daily goal (minutes) — two simpler concepts than one overloaded streak. Add a streak-at-risk reminder. Profile, Settings.
6. Avoid Game Center lock-in: Piano Trainer is a PWA; keep leaderboards optional/local. Their five metrics (lifetime XP, best streak, practice minutes, ear accuracy, best combo) are a good local "personal records" panel. Profile.

## Learn (levels, courses, lessons)
7. **Adopt the typed lesson-step model**: context / discover / name / exercise (play, multipleChoice, identify, connect, staffRecognition) / staffPlay / readStaff / rhythmTap / drill / listenExample / summary, each with optional note + tip. A `registerMatters` flag on play steps decides octave-exact vs pitch-class checking. Learn.
8. **Adopt inline music tokens in lesson text** (`[note:C4]`, `[chord:Am]`, `[interval:M3]`, `[rhythm:dotted-half]`, `[tempo:120]`, `[cadence:deceptive]`, `[lesson:…]`): one parser renders them as coloured, tappable, audible chips and links. Keeps EN/RU translations clean (tokens are language-neutral). Learn, Songs.
9. **Adopt chapter tiers + prerequisite chapters + `requiredPack`**, and a separate "reading track" (staff, rhythm, meter, accidentals, expression, navigation; 29 lessons). Learn.
10. **Adopt Courses with completion criteria**: `MasteryRule = accuracy(min%) | cleanRuns(n) | reachBPM(target) | oneCleanRun` and `lessonComplete | manualDone`; days made of lesson/practice/song/checklist/reflection items. Fits Learn courses directly.
11. **Adopt song ↔ lesson links** (`relatedLessonId`): a public-domain piece unlocks after the lesson that teaches its concept ("Pieces light up in the Songbook as you unlock them"). Learn + Songs public library.
12. Adopt short warm-up mini-games before lessons (sharp-or-flat, octave match, staff speed round, clef sort, step ladder, pulse challenge with tolerance window). Practice exercises.

## Practice tools / Player
13. **Adopt two game modes for every practice source**: wait-mode ("chase the notes") and falling notes, with the same setup sheet; strictness always / guided / strict; hold-time, note spacing and overlap options. Player (Wait mode) + Practice.
14. Adopt hand assignment for MIDI imports: split by note, by track, or merged. Player hands.
15. Adopt 10 chord play modes (block, arpeggio up/down, strum, random, up-down, down-up, outside-in, Alberti, skip) and drone options (root / fifth / octave below) for Accompaniment and Chord player. Practice.
16. Adopt BPM ladders: `BPMGoalRecord` with step size and "next rung" after a goal. Practice + Metronome.
17. Adopt stuck-note protection (auto-clear after N seconds + banner) and mic-input calibration (amplitude threshold, stability window, silence timeout, octave/semitone/cents offsets). Settings → MIDI/Input.

## Score editor / Songs
18. Adopt their chord-chart paste format (chords-over-lyrics, `[Section]` headers, `xN` repeats, `capo:/key:/tuning:` directives) with a `needsReview` flag on unparsed slots. Songs import.
19. Adopt the MusicXML export details: partwise 4.0, two staves (G2/F4), explicit tempo direction, ties split at barlines, user-chosen key. Score editor export.
20. Fonts: Bravura (SMuFL) is already standard with Verovio; Sebastian is a lighter OFL SMuFL alternative worth offering as an engraving-font setting. Score editor, Settings.

## Settings / design
21. Adopt app-level accessibility overrides (text size steps; reduce motion, bold text, increase contrast, reduce transparency, differentiate-without-colour as system/on/off). Settings.
22. Adopt one colour ramp per mode (learn green, listen magenta, practice red-pink, playback blue, compose amber; 50/300/700/900 steps that invert in dark mode) on warm off-white surfaces. Fits the five Piano Trainer areas.
23. Adopt notation-language settings: letters/solfège (si/ti), scientific/Yamaha octave numbering, accidental spelling auto/sharps/flats, Roman numerals scale-specific vs always-major. Important for Russian users (solfège, C3 vs C4 conventions). Settings.

## Avoid
24. **Avoid shipping build artefacts**: Tiny Instrument ships 249 code-graph cache files (source paths, type names) inside the app. Add a bundle check in Piano Trainer's build (no dev caches in `dist/`).
25. Avoid unclear sample licences: five of eight bundled SoundFonts carry no licence in the file and one (Celesta) contradicts its catalog entry. Keep a licence + source + checksum per sample bank (their catalog schema with `sha256`, `attribution.requiresAttribution` is a good template). Settings → Sound.
26. Avoid copyrighted "easter-egg" melodies and community MIDI transcriptions; use public-domain pieces only. Songs.
27. Avoid English-only: no localisation at all in 2.7.0. Piano Trainer already plans EN/RU; keep lesson text tokenised (item 8) so RU translation does not break music markup.
