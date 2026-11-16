# Content model and bundled content (statistics only)

## 1. The 249 SHA-256-named JSON files are a code graph, not songs (exact)
`Resources/<64 hex>.json` × 249. Every file has the same shape:

```
{ "nodes": [ { "id", "label", "file_type", "source_file", "source_location" } ],
  "edges": [ { "source", "target", "relation", "confidence", "source_file", "source_location", "weight" } ] }
```

- One file per Swift source file of the app target (249 files ↔ 249 distinct `source_file` values, all under `Chords/`; the Xcode project folder is called **Chords**).
- Totals: 2,025 unique nodes, 3,348 edges. Relations: imports 449, contains 538, inherits 413, method 998, calls 695, case_of 255. `file_type` always `code`; `confidence` always `EXTRACTED`; `weight` 1.0.
- It is the cache of a code knowledge-graph tool (name not in the files; **inferred**: an AI-assistant "graphify"-style indexer). It was copied into the bundle by mistake. The hash is probably the SHA-256 of each source file (**inferred**, not verified: sources are not available).
- Value for us: it gives the app's real source layout. Folders: Views 19, Views/Compose 17, Views/Components 15, Views/Subviews 13, Views/Theory 13, Views/Theory/BonusActivities 5 (+ Games 23), Views/EarTraining 8, Views/Settings 6(+1), Views/UI Elements 9, Views/Intent 4, Models 45, Services 37, Intents 12, root 14, Helpers 4, Components 2, Protocols 1, Views/Timeline 1.
- Notable files: `ChordDetector.swift`, `Models/TheoryCurriculum+Chapter0…9.swift` (10 chapter files), `Models/CompositionCurriculum.swift`, `Models/EarTrainingLevel.swift`, `Services/CompositionFeedbackEngine.swift`, `Services/MusicTextParser.swift`, `Services/NarrationService.swift`, `Services/ScaleDegreeService.swift`, `Services/SoundFontDownloadManager.swift`, `Services/MIDIToComposeConverter.swift`, `Views/Components/FallingNotesCanvas.swift`, `Views/Components/GrandStaffView.swift`, 11 bonus games (`ClefSortGame`, `FindAllTargetsGame`, `HoldDurationGame`, `KeyboardRoundsGame`, `OctaveMatchGame`, `PulseChallengeGame`, `RhythmSequenceGame`, `SharpOrFlatGame`, `SortRoundsGame`, `StaffSpeedRoundGame`, `StepLadderGame`).
- The graph is older than 2.7.0: newer types (Aria AI chat, Courses, Gamification, Songbook/MusicCharts) do not appear in it (**exact**: absent from node labels).
- Full list of files and per-file symbols: `data/hash_json_code_graph.json`.

## 2. Song JSON (`Resources/Songs/*.json`, 73 files) — app's own melody format (exact)
`Tiny_Instrument.Song` (Codable):

| Key | Type | Notes |
|---|---|---|
| id | String | slug, equals filename |
| title, composer | String | |
| genre | String | free text, inconsistent casing (see stats) |
| tempo | Double | BPM |
| timeSignature | {beats, noteValue} | |
| keySignature | {root, quality: major/minor} | |
| difficultyTier | beginner / intermediate / advanced | |
| bars | [{barNumber, events: [SongEvent]}] | |
| sections | [{name, startBar, endBar}]? | 27 files |
| instrumentProgram | GM program number | |
| instrumentName | String? | |
| trivia | String? | all 73 have one |
| source | publicDomain / easterEgg | |
| relatedLessonId | String? | 15 files, links song → lesson stableId |
| attribution | String? | 3 files ("Mutopia Project") |

`SongEvent {pitches: [MIDI], duration (seconds-like beats), restAfter, velocity, articulation?: staccato/legato/accent/tied, lyric?, fingers?: [Int]}` — time is **relative** (duration + rest after), not absolute; chords = several pitches in one event.

Statistics:
- Source: easterEgg 44, publicDomain 29 (the `pd-*` files).
- Tier: beginner 21, intermediate 44, advanced 8.
- Time signatures: 4/4 60, 3/4 7, 3/8 2, 2/4 2, 12/8 1, 6/8 1.
- Keys: C major 53, A minor 4, D major 3, G major 3, D minor 2, C♯ minor 2, F major 2, B♭ major 1, G minor 1, C minor 1, A major 1.
- Tempo 56–180 BPM; bars 1–83; events 7–319 per song; 2,291 events total; only 4 songs use chord events; lyrics + fingering on 26 events (one beginner song).
- Genres (raw strings): movies 19, classical 11 + Classical 4, Folk 11, pop 7, Christmas_Carols 5, rock 3, Traditional_Gospel 3, videoGames 3, electronic 2, games 1, Patriotic 1, Jazz 1, hip-hop 1, anime 1.
- Instruments: Piano Upright (0) 23, Trumpet 6, Flute 5, Nylon Guitar 4, French Horn 3, others 1–2 each (29 distinct names).
- Lesson links (relatedLessonId): melody-phrases-periods ×2, songs-accompaniment-patterns ×2, scales-three-minor-scales ×2, method-meet-c-d-e, songs-play-in-your-key, songs-more-pop-progressions, melody-passing-neighbor-tones, melody-binary-ternary-form, songs-four-chord-song, keys-why-key-matters, melody-suspensions-appoggiaturas, songs-capstone-play-a-song.
- The 44 easter-egg titles are famous film/game/pop themes (copyrighted melodies); listed only as ids in `data/songs_json_stats.json`. Not exported.

## 3. Bundled MIDI files (33 `.mid`, copyrighted; statistics only, not exported)
Name pattern `Genre_-_Artist_-_Title.mid`. All SMF format 1; PPQ 480/384/192/1024; 1–14 tracks; 108–6,522 note-ons.
Genres: Pop 11, Classical 4, Movies 4, Rock 3, Disney Themes 2, Video Games 2, Alternative Indie 1, Alternative Rock 1, Country 1, Hip Hop 1, Jazz 1, R&B Soul 1, Traditional Gospel 1. Credits in the app: "Piano MIDIs, Discord Community", "Musecord, Discord Community", "Public Domain MIDI Files, Various Creators". Several filenames say "Easy Piano Tutorial", "PianoVision", "on musescore" → transcriptions of copyrighted songs. Per-file numbers: `data/midi_files_stats.json`.

MIDI metadata model `MIDIMetadata` keys: filename, composer, artist, track, tags, category, createdDate, lastPlayed, playCount, difficulty, notes, title, titleIsUserSet, bpm, tracks, channels, usedChannels, trackLabels, channelPrograms. Library categories `MIDICategoryType` (26): favorites, uncategorized, scaleExercises, instruments, disneyThemes, classical, rock, pop, videoGames, movies, christmasCarols, chordProgressions, blues, jazz, metal, alternativeRock, grunge, rnbSoul, alternativeIndie, traditionalGospel, hipHop, electronic, country, folk, patriotic, personalRecordings. Import modes `copy | linked`.

## 4. Scores
- `scores_catalog.json` is an empty array `[]` (exact). Model `ScoreCatalogItem {id, title, composer, filename, category: baroque/classical/romantic/impressionist/other, sourceAttribution}` exists for a future score library.
- `bach-minuet-g.musicxml`: MusicXML 3.0 partwise, MuseScore 2.0.3, 2016-05-01, `<rights>Public Domain (PianoXML typeset)</rights>`, source musescore.com score 2086106; 1 part, 32 measures, 209 notes. Exported (public domain per its own rights tag).
- MusicXML export writer (exact template strings): MusicXML 4.0 partwise, comment `<!-- Exported by Tiny Instrument -->`, `<software>Tiny Instrument</software>`, two staves (G2 / F4 clefs), metronome direction with quarter beat-unit, ties, chords, rests; user picks key (`exportKeyFifths`). Import rejects `score-timewise` ("re-export as score-partwise").

## 5. Chord charts (Songbook, module MusicCharts)
`ChordChart {id, title, artist?, key?: ChartKey{root,isMinor}, keyOverride?, timeSignature, playModeRaw, sections: [ChordSection], source: pasted/manual/imported, tuning, capo, inversions, sourceText, genre, difficulty, createdAt, modified…}`; `ChordSection {id, name, slots: [SongChordSlot], repeatCount, timingEstimated, rawLines}`; `SongChordSlot {id, symbol, beats, lyric?, needsReview, startsNewLine, lyricJoinsPrevious}`. Parser regexes (exact): directive `^(capo|tuning|key)\s*:\s*(.+)$`, repeat `[xX]\s*([0-9]+)\s*$`, chord token `^[A-G][#b]?(maj|min|sus|add|dim|aug|halfDim|m|M|…|\+|b5|#5|-5|b9|#9|-9|b11|#11|-11|b13|-13|[0-9])*(/[A-G][#b]?)?$`. Sections in `[Verse]` brackets, chords on the line above lyrics. `ChordHandSplit.Split {bass, upper, bassMidi, upperMidi}` turns a symbol into a two-hand voicing.

## 6. Saved user content (SwiftData / Codable)
`SavedProgression {id, name, key: ProgressionKey{rootNoteIndex, scaleName}, chords: [ProgressionChordSlot = diatonic(degree) | free(root, type)], inversions?, slashBass?, createdAt, modifiedAt, playMode, isNameCustom, sourceChartID?, sourceSectionID?}`, `TransposeBehavior = transpose | recomputeDiatonic`; `Composition` (Compose: tracks, sections, notes); records `TheoryProgressRecord`, `CourseProgressRecord`, `PlayExploreProgressRecord`, `BonusActivityProgressRecord`, `EarTrainingRecord`, `ChordPracticeRecord`, `ScalePracticeRecord`, `MIDIPracticeRecord`, `FocusSession`, `AppFocusSession`, `XPTransaction`, `AchievementRecord`, `ChallengeRecord`, `BPMGoalRecord`, `ProgressionRecord`.

## 7. Widget theory cards (WidgetShared bundle)
21 `.m4a` clips (`card-001…003`, `101…103`, `201…203`, `301…303`, `401…403`, `501…502`, `601…603`, `welcome-middle-c`) = the "Today's Theory" widget audio. Model `TheoryCard {id, chapterFloor, kind: chord/scale/progression/tip/melody, title, tagline, body, diagram: keyboard/scale/chord, hearIt: {clipName, tokens}}`. Proprietary audio, not exported.
