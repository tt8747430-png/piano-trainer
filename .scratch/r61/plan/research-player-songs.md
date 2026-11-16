# Research → Player and Songs: what to change (r61)

Sources read: `piano-data/research/` Flat (PLAYER_AND_PIANO, LIBRARIES, UI_SHELL_AND_MOTION), Metronaut (PRACTICE_AND_SCORE_FOLLOWING, METRONOME, SETTINGS, UI_FLOWS_AND_MENUS, COMPONENTS_LAYOUT_MOTION, CATALOG_MODEL, SCORE_RENDERING, PIANO_TRAINER_TAKEAWAYS), Tiny Instrument (03, 04, 06, TAKEAWAYS), Chordio (PRACTICE_LESSON_PLAYER, UI_FLOWS, SETTINGS, ACCOMPANIMENT_SOUND_MIDI, TAKEAWAYS), Scale Runner (GAME_AND_SCORING, TAKEAWAYS), Dorico comparison (PLAYER_AND_PIANO_SETTINGS, SETTINGS_ARCHITECTURE). Checked against the owner's rulings in `.claude/skills/owner-way/references/feedback-log.md` ("Player and editor together", "Player views and settings", "Song page", "Library, adding, publishing").

Each bullet gives: **Research** (file § section, [exact] or [inferred], as the research file marks it), **Today** (file:line under `src/`, exact label or value), **Change** (control, exact English label, values, default, numbers). New strings need `en` and `ru`. A shape change to a saved store bumps its version with no migration (CLAUDE.md).

Ranked by impact. Behaviour and algorithms first.

---

## 1. Player findings that apply

1. **Wait mode matches keys, not pitch classes.**
   - **Research:** Chordio PRACTICE_LESSON_PLAYER §3, Wait Mode algorithm step 3: "Expected pitches = the set of MIDI numbers of all notes starting exactly at that pulse that fall in the active hand" [exact]. Tiny Instrument 03 §2: `registerMatters` decides "octave-sensitive vs pitch-class checking" [exact]. Metronaut PRACTICE §4.4: `ReadingScoreOnsetEvent { beatPosition, pitches: Set }` [exact].
   - **Today:** `features/practice/practice-machine.ts:86-94` (`expectedAt`) gathers `pitchClass(played.midi)`. `:212-227` (`noteOn`) compares `pitchClass(key)`. So C5 passes for a written C4, and an octave doubled in the left hand (C2 + C3) is satisfied by one key. `ahead` and `received` are `PitchClass[]` too (`:25-31`).
   - **Change:**
     - `expected`, `received` and `ahead` become `Midi[]`: the practised hands' keys at the beat group, leaving out `silent` notes.
     - Advance when every expected key has been played (in any order, note-offs ignored, as now).
     - A key with the right pitch class in the wrong octave counts as a slip, with its own line instead of "Not {{note}}": "Play it an octave lower" or "Play it an octave higher".
     - The on-screen keys (`press`) follow the same rule.
     - `WaitLine` "Play {{notes}}" is unchanged; it already names each key by its written spelling.

2. **The end of a song in Wait mode: the ruled summary, with a score and a comparison.**
   - **Ruling:** "Played through, the score with its comparison, each bar's slips, Practise bars n–m, Play again, the next step … At the end of the song only, not after a loop".
   - **Research:** Metronaut PRACTICE §7.2, `computeScore`: `accuracy = 1 − penalities/eventCount`; `s = ceil(max × progress × accuracy)`; "if s > 0.96 × max: s = max" [exact constants]. Per piece it keeps `lastScore` and `maxScore` (SETTINGS §3) [exact]. UI_FLOWS §8.2: "Well done!", "Score played", "Played notes" [exact].
   - **Today:** `widgets/practice-player/ui/WaitLine.tsx:87-100` shows one line, "Finished without a slip" or "Finished · slips: {{count}}", plus "Again" and "Loop bars {{first}}–{{last}}" (`en/player.ts:429-433`). No score is computed and nothing is kept.
   - **Change:**
     - **Score.** A step is a beat group with expected keys in the pass. A step is clean when no slip fell in it. `score = round(100 × clean steps / steps)`, set to 100 when it is ≥ 96.
     - **Keeping it.** Keep `last` and `best` in the progress store per piece + version + hands, then bump `PROGRESS_VERSION` (9 → 10).
     - **Summary rows:** "Played through" (title); "Score {{score}}%"; "Best {{best}}%" or "New best"; a row of bars with their slips; "Practise bars {{first}}–{{last}}" (from item 4); "Play again".
     - **Where it shows:** only when `outcome === 'finished'`, never on a loop lap.

3. **One wrong key counts once per step.**
   - **Research:** Metronaut PRACTICE §4.4 has `readingAudioSuppressedPitch` and a delayed, cancellable `readingAudioPendingWrongFeedback` [exact fields]; "suppress repeat feedback for the same pitch" [inferred]. Chordio §3 step 5: a wrong note only flashes, with "no penalty and no counter" [exact].
   - **Today:** `practice-machine.ts:219-222` adds a slip for every wrong note-on. Pressing the same wrong key twice counts as two slips.
   - **Change:**
     - Add a state field `wrongHere: Midi[]`, reset in `moveTo`.
     - `slips[bar]` goes up only for a key not already in `wrongHere`.
     - The line still says "Not {{note}}" each time.

4. **One "hardest bars" rule for Wait passes and takes.**
   - **Rule:** CLAUDE.md, "One implementation of a thing".
   - **Research:** Metronaut PRACTICE §7.3 practice zones over beat ranges, "one tap sets a loop on that zone" (TAKEAWAYS #16) [inferred]. Scale Runner §4: "WEAKEST", "WORK ON" [exact].
   - **Today:** two rules for the same job:
     - `widgets/practice-player/model/wait-feedback.ts:55-79` (`passReport`) takes the bar with the most slips, plus a neighbour.
     - `entities/take/model/practice-summary.ts:71-83` (`nextStep`) takes the weakest adjacent pair under `WEAK = 0.8`, looped at `LOOP_SPEED = 0.7`.
   - **Change:**
     - A Wait pass gives per-bar shares (clean steps ÷ steps in that bar). Feed them to the same `nextStep`/`weakestBars`.
     - The summary's "Practise bars {{first}}–{{last}}" sets the loop and the tempo to 70% of the score tempo, as the song page's step does.
     - Delete `passReport`.

5. **The exercise tempo ladder climbs by itself, as its ⓘ promises.**
   - **Research:** Tiny Instrument TAKEAWAYS #16: `BPMGoalRecord` with "next rung after a goal" [exact name]. 03 §3: `MasteryRule … cleanRuns(count)` [exact]. Metronaut UI §6.3: "Score above %u%% to validate this step" [exact].
   - **Today:**
     - `entities/exercise/model/ladder.ts:5-17` says "a rung up once four passes in a row are clean, a rung down after a slip", and `en/player.ts:454` tells the learner the same: "Climb one rung once four passes in a row are clean and even. After a slip, step back a rung."
     - But `rungAbove` has no caller (only its export, `entities/exercise/index.ts:29`).
     - `pages/player/model/use-exercise-player.ts:75-87` only keeps the tempo chosen by hand. Nothing climbs.
   - **Change:**
     - In `useExercisePlayer`, on each counted Wait pass (`passes` increments):
       - 0 slips: `cleanRun += 1`. At 4, `setTempo(rungAbove(tempo))` and reset the count.
       - ≥ 1 slip: set the tempo to the rung below `rungOf(tempo)` (not below 60) and reset the count.
     - The machine must report whether the last pass was clean before `moveTo` clears `slips` (add `lastPassClean: boolean`).
     - Wait mode measures no evenness, so the ⓘ becomes: "Climb one rung once four passes in a row are clean. After a slip, step back a rung. The exercise opens at the tempo you last played it at."

6. **Practice time in Wait mode stops while nobody plays.**
   - **Research:** Metronaut PRACTICE §5 step 4: the user counts as playing at activity ≥ 0.6 and as idle below 0.4, "after 5 s" [exact]; on a freeze it shows "Are you there?" [exact].
   - **Today:**
     - `pages/player/model/use-player.ts:132` calls `usePracticeClock(player.practice.state.playing)`. While Wait mode waits, `playing` stays true, so a learner who walks away keeps adding minutes to Profile and to the song page's "{{count}} minutes".
     - `features/record-practised/record-time.ts:50-90` already has `touch()` with `SILENCE_COUNTED_S = 30` (`entities/progress/model/time.ts:4`). The trainers use it (`features/trainer/use-trainer.ts:126`).
   - **Change:**
     - In Wait mode, pass `playing && mode === 'listen'` to the clock and call `touch()` on every key.
     - Time then counts up to 30 s past the last key, the same rule as the trainers.
     - `useSongPlayRecord`'s seconds take the same rule.

7. **In Wait mode, the first right key starts the music.**
   - **Research:**
     - Metronaut PRACTICE §10: "I am listening…" + "Start playing when you are ready." [exact]. The bridge has `startNoteByNoteFromBeatPosition:waitForUser:` [exact].
     - Flat PLAYER §2.5: "Play to start recording — The take starts on your first note" [exact].
     - Chordio §3 step 1: turning Wait Mode on connects the inputs at once [exact].
   - **Today:** `practice-machine.ts:213` drops every note-on while `!state.playing`, so a learner at a MIDI piano must reach for Play first.
   - **Change:**
     - In `wait`, when stopped and not `finished`, a key that is in `expected` dispatches `play` and is then matched as usual.
     - A wrong key while stopped is ignored and counts no slip.
     - The first tip stays "Tap a note to start from there, then press Play" (ruled). Pressing Play still works.

8. **Restart goes back in two steps.**
   - **Research:**
     - Metronaut SCORE_RENDERING §5: "Tap on the rewind button to move the cursor to the previous starting position. Tap again to set the cursor at the beginning." [exact]. TAKEAWAYS #30: "Copy exactly" [inferred].
     - Dorico PLAYER §1.3: ⇧Space "Play from the last start position" [exact].
     - Flat PLAYER §1.1: `resumePlayback`, Shift+Space [exact].
   - **Today:** `features/practice/use-practice.ts:358` (`restart`) always jumps to `state.loop?.first ?? 0`. Its label is "Restart" (`en/player.ts:44`).
   - **Change:**
     - Keep `startedAt`, the beat group where the last Play began.
     - First Restart: back to `startedAt` when the cursor is elsewhere and `startedAt` is not already the start.
     - Next Restart: bar 1, or the loop's first bar.
     - The label stays "Restart", and so does the shortcut "Back to the first bar"; the shortcut keeps going to the start in one step.

9. **The Practice sheet's tempo gets Tap and its tempo word, as ruled.**
   - **Ruling:** "The tempo belongs to the metronome, in BPM with − + Tap and its marking, Score tempo to go back."
   - **Research:** Chordio UI_FLOWS §3: "Tempo label → tempo popover with tap tempo" [exact]. Flat PLAYER §1.3: the tempo word list Grave … Prestissimo, each with its BPM [exact].
   - **Today:** `widgets/practice-player/ui/PracticeSheet.tsx:111` renders `<TempoSteps bpm={tempo} onStep=…/>`. It passes no `mark` (the prop exists, `shared/ui/TempoSteps.tsx:21`) and has no Tap. "Score tempo: {{tempo}} BPM" is there.
   - **Change:**
     - Pass `mark`, the tempo word from `shared/lib/music/tempo-words.ts`, so the face reads "Andante · 80 BPM" as the Metronome's does.
     - Add the Metronome's "Tap" button under the steps, from `features/metronome/use-tap-tempo`. It sets the tempo after 2 taps.
     - Keep −10 −1 +1 +10.

10. **Tap tempo forgets a stray tap.**
    - **Research:** Chordio ACCOMPANIMENT_SOUND_MIDI, Metronome: "If the newest interval differs from the running average by a ratio > 1.5, all but the last two taps are discarded (restart)" [exact].
    - **Today:** `shared/lib/tap-tempo.ts:1-24` starts again only after a 2000 ms pause and averages the last 5 taps. A double-tap or a late tap skews the average.
    - **Change:**
      - Let `mean` be the average of the earlier gaps.
      - When `gap / mean > 1.5` or `< 1/1.5`, keep only `[previous, time]`.
      - `TAPS_KEPT = 5` and `TAP_PAUSE = 2000` stay. Add a unit test beside it.

11. **Remove Interpret (`follow`) from the code.**
    - **Ruling:** "Modes are Wait and Play only, no Follow". CLAUDE.md, "Final code only".
    - **Research:** Metronaut has Interpret (AI Tempo), PRACTICE §4.2 [exact]. It is ruled out here.
    - **Today:** the mode is still reachable through the URL:
      - `features/practice/practice-mode.ts:6`: `PRACTICE_MODES = ['listen', 'wait', 'follow']`
      - `app/routes/player-search.ts:58` accepts `?mode=follow`
      - `practice-machine.ts:226-257` (`followOn`, `FOLLOW_RANGE 0.4–2`, `followTempo`)
      - `use-practice.ts:258-310` (`followed`, `followAlong`)
    - **Change:** `PRACTICE_MODES = ['listen', 'wait']`. Delete the follow code, `onsets`, `matched` and `OWN_PACE_MODES`. Old URLs with `mode=follow` fall back to the default.

12. **Remove the count-in that cannot be chosen.**
    - **Ruling:** "The metronome is Flat's: one Off · Count-in · On choice under the tempo".
    - **Research:** Flat PLAYER §1.2: three modes; new users start Off (`getInitialMetronomeMode` → DISABLED) [exact]. Metronaut METRONOME §4 adds "Visual" [exact]; the ruling does not take it.
    - **Today:** `entities/settings/model/types.ts:84` has `COUNTDOWNS = ['none', 'audible', 'visual']`, but `PracticeSheet.tsx:72-74` only ever writes `'none' | 'audible'`. `'visual'` is reachable from no control. `use-practice-player.ts:181` still reads it.
    - **Change:** `COUNTDOWNS = ['none', 'audible']`. Drop `countInHeard` from `PracticeSetup` (`use-practice.ts:53`) if nothing else sets it. Bump `SETTINGS_VERSION` (50 → 51). The default stays Off (`'none'`, `types.ts:101`), as Flat's.

13. **A wrong key in the other hand's notes is not a slip.** [inferred; no reference does this exactly]
    - **Research:** Chordio §3 step 3: only notes of the active hand are expected; any other key is "wrong" (flash only) [exact]. Metronaut §4.3: "Play the right hand → Metronaut will play the left hand" [exact].
    - **Today:** `practice-machine.ts:219` counts any key outside `expected` as a slip. With Right hand chosen, a learner who also plays the left hand's written notes collects a slip for each.
    - **Change:**
      - A key that the not-practised hand plays at this beat group (`accompanyingHands`) is ignored: no slip, no "Not" line.
      - It still sounds from the learner's piano.

14. **Score the time a step takes, for the summary only.** [inferred from research advice]
    - **Research:** Chordio TAKEAWAYS #6, "Improve on it": "log wrong notes and time-per-step" [inferred advice]. Metronaut §4.4: `readingTargetArmedAt` [exact field].
    - **Today:** the machine keeps no time between arriving at a step and completing it.
    - **Change:**
      - Keep `armedAt` (the audio clock time) in `moveTo`.
      - A step that takes longer than 2 beats at the chosen tempo counts as a "pause" for its bar. It does not change the score.
      - The summary's bar row (item 2) shows pauses beside slips: "Slips {{slips}} · Pauses {{pauses}}".
      - When two bar pairs tie, the one with more pauses wins `weakestBars` (item 4).

15. **A lesson counts as done from a good pass, not any pass.** This contradicts ADR 0111: say so, then amend it.
    - **Research:** Metronaut UI §6.3: "Score above %u%% to validate this step" [exact]. Tiny Instrument 03 §3: `MasteryRule = accuracy(minPercent) | cleanRuns(count) | …` [exact].
    - **Today:** `pages/player/model/use-player.ts:141-147` calls `recordPass` whenever `passes > 0`, even after a pass with 30 slips.
    - **Change:** record the pass only when its score (item 2) is ≥ 80, the same threshold as `WEAK = 0.8` in `practice-summary.ts:71`. Amend ADR 0111 to match.

16. **Loop with nothing chosen: keep it, and check it.**
    - **Research:** Flat PLAYER §1.5: "Without a selection the loop covers the bar at the cursor" [exact]; shortcut L [exact].
    - **Today:** the shortcut "Loop the bar, or remove the loop" (`en/player.ts:409`) matches.
    - **Change:** none. Keep it, and check in the browser that the transport's Loop button without a range loops the bar at the cursor, as the shortcut does.

17. **The count-in and the speed trainer already match the references: keep them.**
    - **Research:**
      - Flat §1.2: count-in is 1 bar, from the start bar's meter, scaled by speed [exact].
      - Dorico §1.1: count-in 1 bar [exact].
      - Chordio §3: 1 bar at "tempo × speed%", playback starting "on downbeat" [exact].
    - **Today:**
      - `shared/lib/schedule/grid.ts:77-88` counts one bar of the meter before `fromTick`, on the first pass only, at the pass tempo.
      - Speed training climbs `speedStep` (2/5/10 %, `types.ts:87`) each pass, up to 100 % (`features/practice/speed.ts:77-81`).
    - **Change:** none. Do not add Metronaut's two-bar count-in (Flat uses 2 bars only for Live MIDI takes).

18. **Wait-mode feedback on the score: matched notes inked, the awaited ones marked.** [cosmetic, lowest]
    - **Research:** Chordio §3 step 6: expected notes blue, matched green, wrong flashes red for 0.32 s [exact]. TAKEAWAYS #10: "matched / expected" pill [inferred].
    - **Today:** the keyboard labels a received key "✓" (`features/practice/marks.ts:36-38`). Whether the score marks received notes was not checked in code. Verify in the browser before changing anything.
    - **Change, if missing:**
      - Received noteheads of the awaited chord take the playing mark's colour, in the existing tokens (no new colour; the rulings fix sky `#85B8DC` for a key down).
      - No red flash on the score: the line "Not {{note}}" already says it.

---

## 2. Songs findings that apply

1. **Continue never offers a learned song.**
   - **Ruling:** loop round 46, "Continue and the table say one progress": Continue "offered Twinkle, Twinkle, which the table calls Learned" was wrong.
   - **Research:** Metronaut UI §6.1 keeps `played` and `favorite` as separate sections [exact].
   - **Today:** `pages/songs/ui/ContinueShelf.tsx:22-29` filters archived songs only. `entities/progress/model/songs.ts:75-83` (`songsToContinue`) keeps any song with `0 < at < bars`, learned or not.
   - **Change:** in `ContinueShelf`, also skip ids in `selectLearned` (the set `library-view` already reads). Better: pass `learned` into `songsToContinue` so the rule has a test beside it.

2. **Continue orders by when a song was last played, read from one clock.**
   - **Research:** Flat LIBRARIES B3: "Recent Scores: the first 8 of `allScores`", sorted by `modificationDate desc` (B6) [exact]. Metronaut CATALOG §5: `/v4/recently_played/` [exact].
   - **Today:**
     - `songsToContinue` orders by the key order of the `songs` record (`songs.ts:65-68` re-inserts the song last, and `.reverse()` at `:82`).
     - The Recent sort and Learning read a different clock, `practised` timestamps (`entities/progress/model/selectors.ts:40-45`, `byLastOpened`).
     - So two orders exist for "latest played", and key order is fragile across sync (`progress` is in `SYNCED_SAVES`, `app/composition-root.ts:138`).
   - **Change:**
     - Add `last: string` (ISO time the stretch ended) to `SongPlay` and write it in `withSongStretch`.
     - `songsToContinue` sorts by `last` desc.
     - Bump `PROGRESS_VERSION`. `SHOWN = 8` stays, matching Flat's 8.

3. **The Level filter reads the learner's own level.**
   - **Research:** Metronaut CATALOG §3.4: filter "Difficulty" [exact]. §4: difficulty "Easy / Intermediate / Advanced", and "Level" is the song-detail label [exact].
   - **Today:**
     - `pages/songs/model/library-view.ts:174` filters by `pieceStage(entry.id)`, the course placement, and `stagesIn` (`:281-284`) offers only those levels.
     - A learner's own song with Details › Level set (`entities/library/model/song-details.ts:31-32`, "Its level as the learner places it") is never found by Level and never offered.
   - **Change:** `levelOf(entry) = details.level ?? pieceStage(entry.id)`, used in `keeps`, `stagesIn` and the sheet's Level section. Labels stay "Level", "Any", "Level: {{stage}}".

4. **Search reads a song's tags, genre and subtitle.**
   - **Research:**
     - Flat LIBRARIES A6.3: the Publish field is "Tags (for search and categorization)" [exact].
     - Flat B9: Spotlight indexes `keywords` from tags, subtitle, composer, arranger and lyricist [exact].
     - Metronaut CATALOG §3: `freeformMatch` search-synonym text on every entity [inferred].
   - **Today:** `entities/piece/model/titles.ts:35-40` (`entryWords`) is title, titleEn, titleRu and credit names. The learner's Details tags and genre (`song-details.ts:33-35`) and the score's `header` subtitle are not searched.
   - **Change:**
     - Library search words = `entryWords(entry)` + `details.tags` + the localised genre name + `header.subtitle`.
     - It is still word by word through `matchesQuery` (`shared/lib/fold-text.ts:22-28`).
     - The empty line stays exactly "Check the spelling, or try a song’s title or its composer." (ruled, loop round 24).

5. **Sort and filter gains Genre.**
   - **Research:** Metronaut UI §6.4 and CATALOG §3.4: filter "Period / Genre" [exact]. Flat A2.1: no genre facet [exact]. So one reference has it and one does not.
   - **Today:** `pages/songs/ui/FilterSheet.tsx:60-61` offers Folder, Key and Level only (`en/songs.ts:22-35`). Genre is set in Details (`SONG_GENRES`, nine values) but cannot be filtered.
   - **Change:**
     - A folding section "Genre" after Level.
     - Its values are the genres the place's songs hold, each with its count ("Hymn · 12", the same pattern as `keyCount`), plus "Any".
     - The chip reads "Genre: {{genre}}". `filtersOn` counts it. It is in the URL, as the others are (`songs-filter.ts`), never remembered.

6. **Sort by Level.**
   - **Research:** Metronaut CATALOG §1.7 and §4: difficulty 1–3, Easy → Advanced [exact]. Metronaut cells carry `showDifficulty` and `level1..3` [exact].
   - **Today:** `entities/library/model/types.ts:88` has `LIBRARY_SORTS = ['manual', 'name', 'recent', 'key']`, labelled "Manual / Name / Recently played / Key" (`en/songs.ts:46-58`).
   - **Change:**
     - Add `'level'`, label "Level", short label "Level".
     - Order: easiest first by the `STAGES` order using `levelOf` (item 3), then title. Songs with no level come last.
     - Bump the library store version for the saved `sort`.

7. **Sort by Recently added.**
   - **Research:** Flat B6: default sort is `modificationDate desc`, kept in `scoreLibrary.sortProperty` [exact]. Flat's edu labels are "Latest creation date" / "Oldest creation date" [exact].
   - **Today:** there is no added date. `SavedFolder.songs` and `layout.home` are id lists (`entities/library/model/types.ts:51-61`).
   - **Change:**
     - Keep `added: Record<PieceId, string>` (ISO) in the library store, written by every add (New song, Import, Add to my library, Duplicate, Record).
     - Sort `'added'`, label "Recently added", short label "Added": newest first. Songs with no date come after, in manual order.
     - Bump the library version.

8. **Explore's search finds what the library's search finds.**
   - **Rule:** CLAUDE.md, "One implementation of a thing".
   - **Research:** Flat LIBRARIES A2.2: one search, "Search for music scores and people", with result groups [exact]. Metronaut CATALOG §3.4: `SearchIndex { pieces, collections, authors }` [exact].
   - **Today:**
     - `shared/api/public-library/supabase.ts:139` does `ilike('title', '%' + q + '%')`: the whole phrase, title only, no ♯/♭ folding. `fake.ts:122` does the same.
     - The library's search is word by word, over title and credits, folded (`fold-text.ts:6-28`).
     - So "Bach minuet" finds a library song but no Explore song titled "Minuet in G (Bach)".
   - **Change:**
     - Split `q` with `WORD_BREAK`, fold each word with `foldText`.
     - For each word, `.or('title.ilike.%w%,author_name.ilike.%w%')`, and the composer credit in `meta` where the schema holds it.
     - The fake follows the same rule, with a contract test in `public-library.contract.test.ts`.
     - The label stays "Search songs and patterns" (ruled).

9. **Publish suggests the song's own genre, from one list of genres.**
   - **Research:** Flat A6.3: the Publish form takes "Tags", "Creation type" and other credits from the score [exact]. Metronaut CATALOG §4: one genre taxonomy shared by the catalogue and the filters [exact].
   - **Today:** there are two lists:
     - `shared/api/public-library/types.ts:10`: `PUBLIC_CATEGORIES = ['classical', 'folk', 'pop', 'studies']`, plus Explore's "Other".
     - `song-details.ts:5-15`: `SONG_GENRES`, nine values.
     - `pages/piece/ui/PublishPage.tsx:58-65` starts the `CategoryPicker` empty (`publishing.category` until chosen), even when the song's Details carry a genre.
   - **Change:**
     - Map each `SongGenre` to a public category: classical → Classical; folk, hymn, worship, christmas, children → Folk; pop, jazz → Pop; study → Studies.
     - Preselect the mapped category on first Publish.
     - Explore's chips stay All · Classical · Folk · Pop · Studies · Patterns. Write the map once, in `entities/library`.

10. **Takes are judged by the beat, not a fixed 80 ms, with a "close" step.**
    - **Research:**
      - Metronaut PRACTICE §7.1 (`PracticeScoreLevel`), windows in beats [exact]: strict perfect ±0.1, early/late to ±0.2, very beyond; lenient ±0.25 / ±0.5.
      - Metronaut penalties, lenient: `.66 .33 0 .33 .66` [exact].
      - Scale Runner §5: Easy / Normal / Strict, "on-beat within X ms, close within Y ms", "Green is on the beat, amber is close, red is off" [exact copy; numbers not recoverable].
    - **Today:**
      - `entities/take/model/feedback.ts:28`: `FEEDBACK_TOLERANCE_MS = 80` at every tempo. At 60 BPM, 80 ms is 0.08 beat; at 160 BPM, 0.21 beat.
      - `:72-73` gives a binary right / early / late.
      - The percent is `right / judged` (`:120-128`).
      - The song page's "Your practice" (`pages/piece/ui/YourPractice.tsx`) shows it.
    - **Change:**
      - **On time:** `|by| ≤ clamp(0.1 beat, 40, 120)` ms.
      - **Early / late:** up to 0.25 beat, penalty 0.33.
      - **Beyond 0.25 beat:** still early / late, penalty 0.66.
      - **Wrong or missed:** penalty 1.
      - **Percent:** `round(100 × (1 − mean penalty))`, set to 100 when ≥ 96.
      - `barShares` uses the same penalties, so `nextStep`'s `WEAK = 0.8` reads them.
      - The Verdict names stay the same.

11. **The song page shows the Wait score beside the takes'.**
    - **Research:** Metronaut SETTINGS §3: `lastScore` / `maxScore` per piece [exact]. UI §7: the piece preview leads into "Start Practicing" [exact].
    - **Today:** `YourPractice.tsx:17-40` shows the last day played and the takes' share, best and next step. Nothing from Wait mode.
    - **Change:**
      - Once a Wait pass has finished (Player item 2), add one row: "Wait mode", value "{{last}}% · best {{best}}%".
      - Its next step is the same `nextStep` (Player item 4), so the card offers one step, not two.
      - "Calm" ruling: one row, no new card.

12. **Learning means a song really started, not just opened.** [inferred]
    - **Ruling:** "Learning is what was started (loop round 17): the songs opened in the Player and not yet learned".
    - **Research:** Metronaut UI §6.1 "Already Played" is fed by `recently_played` [exact].
    - **Today:**
      - `pages/player/model/use-player.ts:109` records `practised` on mount, before any Play.
      - So opening a song's Player for one second moves it to the top of "Recently played" and into "Learning" (`library-view.ts:168-170`).
    - **Change:** record `practised` on the first Play or the first right key (Player item 7), not on open. The ruling's wording ("opened in the Player") stays true of a song played there.

13. **Name sort can run both ways.** [low]
    - **Research:** Flat B6: "Clicking the active field toggles direction. Switching to `title` sets asc" [exact]. Flat edu: "Name A-Z" / "Name Z-A" [exact].
    - **Today:** `sortSongs` (`library-view.ts:124-139`) runs one way only, and the sort sheet has no direction.
    - **Change:**
      - Choosing the chosen sort again reverses it. The row's end shows "A–Z" or "Z–A" for Name, "Newest first" or "Oldest first" for Recently added and Recently played.
      - Key the saved sort as `{ by, reverse }` and bump the library version.

14. **Explore's "Most saved" can be narrowed by time.** [low]
    - **Research:** Flat A1: "Popular" with "All time" | "This past week" | "This past month" [exact]. A2.2: "Publication date: Anytime | This year | This month | This week" [exact].
    - **Today:** `shared/api/public-library/supabase.ts:142-143` orders `saves` desc over all time. Shelves are New · Most saved · Top rated (`en/songs.ts:509`).
    - **Change:** on "See all" of Most saved, add a segmented "All time · This month · This week" that filters `published_at`. Default "All time".

15. **A song saved from Explore remembers where it came from.** [low]
    - **Research:** Flat LIBRARIES A4: "This score is based on the following work" (`sv.forkedFrom`) [exact string; field name inferred]. A5: a fork is POST `/scores/{id}/fork` [exact].
    - **Today:** "Add to my library" makes a copy ("An editable copy of this song is added to your library. The original remains unchanged.", `en/piece.ts:207`). No field on `Piece` or in the library keeps the public item it came from (no match for a source or origin field in `entities/piece/model/types.ts` or `entities/library/model`).
    - **Change:**
      - Keep `from: { publicId, author }` on the copy.
      - The song's Settings › Details gets one read-only row, "From Explore", with the value "{{author}}". It opens the public song, or says "This song is no longer in the Public library." (an existing string) when it is gone.
      - Bump the pieces store version.

---

## 3. Rejected

Research items that conflict with a ruling, with the ruling quoted.

- **Interpret / AI Tempo, Magic Performing, Training / AI Feedback, Listening as separate modes** (Metronaut PRACTICE §4.2, Tiny Instrument "chase the notes / falling notes", Chordio Play with the Band).
  - Ruling: "Modes are Wait and Play only, no Follow, no group titles."
- **Live timing colours (early orange, on time teal, late blue), practice zones over the score, a "How did I play" run in Play mode** (Metronaut §7.1–7.3, Scale Runner "beat indicator").
  - Ruling: "No My recordings, no How did I play, no Voice commands, anywhere."
  - Timing is judged only on takes (Songs item 10), which the song page shows.
- **Cursor modes (None / Beats / Continuous / Detected events), scroll anticipation in beats, page vs continuous scroll** (Metronaut SETTINGS §4.2, SCORE_RENDERING §4–5, TAKEAWAYS #23–24).
  - Ruling: "No cursor or scrolling settings at all, neither a switch nor choices (rejected twice)."
- **Visual or Audible countdown, or Short / Long countdown** (Metronaut METRONOME §4).
  - Ruling: "The metronome is Flat's: one Off · Count-in · On choice under the tempo".
  - Player item 12 removes the dead `'visual'`.
- **Downbeat accent and subdivision settings, beat squares in the Player** (Metronaut TAKEAWAYS #19, Dorico click pitches).
  - Ruling: "The meter and accents come from the score: no beat squares, no subdivision in the Player."
- **Tempo as a percentage slider snapping to 100 %, tortoise and hare** (Metronaut METRONOME §5, TAKEAWAYS #21).
  - Ruling: "The tempo belongs to the metronome, in BPM with − + Tap and its marking, Score tempo to go back."
- **Rhythm game / tap pad, voice commands, audio or video recording, recordings list, Tuner and A4 tuning reference in the Player** (Metronaut §4.5, §12, §13; UI §8.1 `rec`, `tap_rhythm`).
  - Ruling: "The Player keeps Sections, Print and Share link. No My recordings, no How did I play, no Voice commands, anywhere; no Tuner in the Player."
- **Sustain-pedal dimming of keys (Subtle / Strong), "Play repeats" switch, Dorico pedal timings as settings** (Chordio TAKEAWAYS #27, Dorico §3).
  - Ruling: "No pedal setting: 'remove it'. Playback pedals as marked or automatically."
- **Study notes / Markdown panel beside the score, piece info in the Player** (Chordio §3 "Study notes", TAKEAWAYS #24).
  - Ruling: "No Song information and no Song page row in the Player."
- **"Choose your version" sheet before playing** (Metronaut UI §7, piece preview).
  - Ruling: "No ask-on-open, no skin tone (one neutral hand), no resume-following setting."
- **Named swing presets A–F, voicing and swing in the Song gear** (Chordio TAKEAWAYS #14).
  - Ruling: "No Voicing or Swing; the accompaniment is not in Practice."
- **"Hear the other hand", "Play the left hand → app plays the right"** (Metronaut §4.3).
  - Ruling: "Hear the other hand, Player settings › Hands and the other hand's Hide are gone: the volume and Dim say it all, in one home."
- **Latency, metronome volume and MIDI rows in the Player's sheets** (Metronaut SETTINGS §4.2–4.3).
  - Rulings: "One gear per screen … Settings never scattered over four menus". CLAUDE.md: each preference has one home (MIDI devices).
- **Finger numbers or note names under the keys, a piano roll** (Metronaut TAKEAWAYS #27, Tiny Instrument falling notes).
  - Ruling: "i don't want finger number under the keyboard and no piano roll yet".
- **Difficulty dots or level on a library row** (Metronaut `showDifficulty`, `level1..3`).
  - Ruling: a song row is "its small cover (its first notes on a printed staff), 'Composer · Key', a ♡ one tap".
  - Level lives in the filter and sort instead (Songs items 3 and 6).
- **A "Recently played" place chip or section beside Continue** (Metronaut "Already Played", Flat "Recent").
  - Ruling: "the place chips All · Favourites · Learning · Learned (no Recently played)".
- **Filters as chips (Created by Me / Community, privacy, With chords)** (Flat B6).
  - Rulings: "No 'Chords I know' or 'With chords' chips"; the place chips are "never repeated as removable chips or in the button's count".
- **A delete or archive dialog first** (Flat B5 "Delete score?").
  - Ruling: "archiving a song, a folder or what Select chose happens at once with Undo in its toast, never asked first".
- **"Explore the community" / Browse as an empty state's way out, or in the add menu** (Flat B8).
  - Ruling: "The Public library is a place, never an add option."
- **Card style at Home** (Flat playlist covers, Metronaut playlist art).
  - Ruling: "Card style is a folder's alone, from its Settings, as the board draws it."
- **A changed empty-search line naming tags** (Songs item 4).
  - Ruling (loop round 24): the line is "Check the spelling, or try a song’s title or its composer." It stays word for word.
