# Gamification: XP, levels, challenges, achievements, Game Center

Tiny Instrument 2.7.0. All gamification rules live in the SwiftPM module **DesignSystem** (types `XPRules`, `XPCalculator`, `XPSource`, `XPBreakdown`, `LevelCurve`, `ChallengeProvider`, `Challenge`, `ChallengeKind`, `ChallengeProgressInput`, `AchievementCatalog`, `AchievementEngine`, `AchievementBackfill`, `Achievement`, `AchievementCategory`, `AchievementTier`, `AchievementStats`, `GameCenterMapping`, `GameCenterAccess`, `LeaderboardMetric`, `GamifiedType`, `SessionOutcome`). The app side holds `GamificationEngine`, `StreakManager`, `GameCenterManager` and the SwiftData records `XPTransaction`, `AchievementRecord`, `ChallengeRecord`.

Method: Swift metadata gives type and field names (exact). Formulas come from Ghidra decompilation of the arm64 slice (addresses below; exact unless marked inferred). Machine-readable copies: `data/gamification_rules.json`, `data/challenges.json`, `data/game_center.json`.

## 1. Session outcome (input to XP)
`DesignSystem.SessionOutcome` fields, in memory order (exact, from `__swift5_fieldmd` and offsets used by the calculator):

| Field | Type | Offset used |
|---|---|---|
| type | GamifiedType (`lesson`, `earTraining`, `scale`, `chord`, `drills`, `other`) | 0x00 |
| accuracyPercent | Double? | 0x08 (nil flag 0x10) |
| bestCombo | Int? | 0x18 (nil flag 0x20) |
| completedFull | Bool | 0x21 |
| durationSeconds | Double? | 0x28 |
| priorBest | Double? | 0x38 (nil flag 0x40) |
| newValue | Double? | 0x48 (nil flag 0x50) |
| isFirstEverCompletion | Bool | 0x51 |
| isFirstOfTypeToday | Bool | 0x52 |
| dailyGoalMetFirstTimeToday | Bool | 0x53 |
| sameTypeRepeatIndexToday | Int | 0x58 |

## 2. XP formula (exact, `XPCalculator` at 0x1011d50c8)
Repeat multiplier `m` from `sameTypeRepeatIndexToday` (table in `__DATA,__data` at 0x10196e440 = `[1.0, 0.6, 0.3]`):

| Repeat index today | m |
|---|---|
| < 0 | 1.0 |
| 0 (first session of this type today) | 1.0 |
| 1 | 0.6 |
| 2 | 0.3 |
| >= 3 | 0.1 |

Rows appended to `XPBreakdown.rows` (`XPSource` raw order: base 0, accuracy 1, completedFull 2, combo 3, personalBest 4, firstOfTypeToday 5, dailyGoal 6, firstEver 7, challenge 8). All conversions truncate toward zero.

| Source | Condition | Amount |
|---|---|---|
| base | always | trunc(m × 10) |
| accuracy | accuracyPercent present and > 0 | a = trunc(min(acc,100)/100 × 20); row only if a ≥ 1; amount trunc(m × a) |
| completedFull | completedFull | trunc(m × 10) (same as base) |
| combo | bestCombo present and > 0 | trunc(m × min(bestCombo, 25)) |
| firstEver | type ≠ other and isFirstEverCompletion | 30 (not multiplied) |
| personalBest | type ≠ other, not firstEver, priorBest and newValue present, priorBest < newValue | 20 (not multiplied) |
| firstOfTypeToday | type ≠ other and isFirstOfTypeToday | 15 (not multiplied) |
| dailyGoal | dailyGoalMetFirstTimeToday (any type) | 25 (not multiplied) |
| challenge | a challenge completes | that challenge's `xpReward` |

Maximum for one first-ever, first-of-day session at 100 % with a 25+ combo that also meets the daily goal: 10 + 20 + 10 + 25 + 30 + 15 + 25 = **135 XP** (derived).

XP is stored as `XPTransaction {id, amount, sourceRaw, typeRaw, date, refId}` (SwiftData) and summed into settings `lifetimeXP` and `perTypeXP [String:Int]` (exact field names). The session summary shows `SummaryXPBreakdownRow` with an animated bar, sparkle and count-up (fields `__barFraction`, `__showSparkle`, `__displayedTotal`, `__displayedInto`, `__showCheck`). String: " XP toward the next level" (exact).

## 3. Level curve (exact, `LevelCurve` at 0x1011d3a6c / 0x1011d3960)
- Level L (1-based) starts at total XP **50 × (L−1) × L**.
- XP needed from level L to L+1: **100 × L**.
- Function returns (level, xpIntoLevel); progress fraction = clamp(xpInto / xpForNext, 0, 1).

| Level | Total XP at start |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 300 |
| 4 | 600 |
| 5 | 1000 |
| 10 | 4500 |
| 20 | 19000 |
| 30 | 43500 |

Level titles (exact, 0x1011d3998):

| Levels | Title |
|---|---|
| 1–4 | Novice |
| 5–9 | Apprentice |
| 10–14 | Player |
| 15–19 | Musician |
| 20–24 | Performer |
| 25–29 | Virtuoso |
| 30+ | Maestro |

Per-track levels: settings hold `perTypeXP`; achievement text "Reach level 5 in the <Track> track" and help text " sessions to earn XP in that track and raise its level." (exact). That per-track levels use the same curve is **inferred**.

## 4. Daily, weekly and consistency challenges (exact, `ChallengeProvider` 0x1011d1d2c–0x1011d2c50)
`Challenge {id, kind, title, detail, iconSystemName, targetValue, xpReward, progressFn}`; `ChallengeKind = daily | weekly | consistency`. Ids: `daily-%04d-%02d-%02d`, `weekly-%04d-W%02d`, `consistency-%04d-W%02d`. Progress input `ChallengeProgressInput {minutesToday, sessionsToday, distinctTypesToday, distinctTypesThisWeek, bestComboToday, perTypeBeatBestToday, typeSessionsToday, focusHabitDays, daysGoalMetThisWeek, minutesThisWeek}`.

| Kind | Title | Detail | SF Symbol | Target | XP |
|---|---|---|---|---|---|
| daily | Daily Practice | Practice 10 minutes today. | clock.fill | 10 | 30 |
| daily | Triple Play | Complete 3 practice sessions today. | checklist | 3 | 30 |
| daily | Mix It Up | Practice 3 different activity types today. | square.grid.2x2 | 3 | 40 |
| daily | Combo Breaker | Reach a 15-note combo today. | bolt.fill | 15 | 35 |
| daily | Focus: ‹type› | Do a ‹type› … (built at runtime) | target | 1 | 35 |
| daily | Beat Your Best | Set a new personal best in ‹type› | chart.line.uptrend.xyaxis | 1 | 45 |
| weekly | Well-Rounded Week | Practice all 5 activity types this week. | square.grid.2x2.fill | 5 | 120 |
| weekly | Five Hours In | Practice 300 minutes this week. | clock.fill | 300 | 120 |
| weekly | Five-Day Streak | Meet your daily goal 5 days this week. | calendar.badge.checkmark | 5 | 120 |

Selection: the daily pick seeds from `year×10000 + month×100 + day` mixed with splitmix64 constants (0x9e3779b97f4a7c15, 0xbf58476d1ce4e5b9, 0x94d049bb133111eb) and indexes a 4-entry table, with the "Focus" and "Beat Your Best" builders as extra candidates (exact constants; how candidates are weighted is **inferred**). The consistency kind exists in the enum and id format; its title is built at runtime from "Practice ≥5 minutes …" fragments (**inferred**). Notification string: "Daily challenge ending soon" (key `challengeExpiring`). The UI is `ActiveChallengeCard` (progress ring) on the Home progress card.

## 5. Achievements (badges): 50 entries, 540 Game Center points
Catalog `DesignSystem.AchievementCatalog` (0x1011cdf18); entry = {id, title, detail, howTo?, iconSystemName, category, tier, targetValue?, progressFn}. Categories: streak, consistency, accuracy, mastery, improvement, volume, combo, breadth, curriculum, challenge. Tiers bronze/silver/gold map to Game Center points 5/10/20 (exact by correlation over all 50). Game Center id = `ti.ach.` + catalog id with `-` → `_` (exact, 0x1011d3538).

| GC id | Name | Requirement | Tier | Pts |
|---|---|---|---|---|
| first_lesson / first_ear / first_scale / first_chord / first_drill | First Lesson / First Listen / First Scale / First Chord / First Drill | Complete your first Lessons / Ear Training / Scales / Chords / Drills session | bronze | 5 each |
| streak_7 / streak_30 / streak_100 | Week Warrior / Monthly Devotion / Century Streak | 7 / 30 / 100-day streak | bronze/silver/gold | 5/10/20 |
| habit_3 / habit_7 | Getting the Habit / Daily Ritual | Practice ≥5 min, 3 / 7 days in a row | bronze/silver | 5/10 |
| goal_7 / goal_30 | On Target / Goal Getter | Meet daily goal 7 / 30 times | bronze/silver | 5/10 |
| accuracy_90_{lesson,earTraining,scale,chord,drills} | ‹Type› Sharpshooter | 90 % accuracy in that type | silver | 10 each |
| accuracy_100_any | Perfectionist | 100 % in any practice type | gold | 20 |
| mastery_5_{lesson,earTraining,scale,chord,drills} | ‹Type› Adept | Reach level 5 in that track | silver | 10 each |
| pb_10 / pb_50 | On the Up / Relentless | Beat a personal best 10 / 50 times | bronze/gold | 5/20 |
| sessions_10 / sessions_100 | Warming Up / Seasoned | 10 / 100 sessions | bronze/silver | 5/10 |
| minutes_600 | Ten Hours In | 600 minutes total | silver | 10 |
| lessons_25 | Bookworm | 25 lessons | silver | 10 |
| combo_10 / combo_25 / combo_50 | In the Zone / On Fire / Unstoppable | 10 / 25 / 50-note combo | bronze/silver/gold | 5/10/20 |
| breadth_week | Well-Rounded | All 5 activity types in one week | gold | 20 |
| instruments_10 | Sound Explorer | Play 10 different instruments | silver | 10 |
| curriculum_all | Theory Scholar | Unlock every theory chapter | gold | 20 |
| curriculum_chapter_1 / _5 / _all | Chapter Done / Well-Read / Graduate | 1 / 5 / every chapter completed | bronze/silver/gold | 5/10/20 |
| curriculum_explore_1 / _10 / _all | Explorer / Trailblazer / Master Explorer | Play & Explore exercises 1 / 10 / all | bronze/silver/gold | 5/10/20 |
| curriculum_reading_1 / _all | Note Reader / Sight-Reader | Reading & rhythm chapters 1 / all | bronze/gold | 5/20 |
| curriculum_tiers_all | Full Spectrum | A chapter in every learning tier | gold | 20 |
| challenge_5 / _25 / _50 | Challenger / Up to the Task / Challenge Master | Complete 5 / 25 / 50 challenges | bronze/silver/gold | 5/10/20 |
| egg_5 / egg_15 / egg_30 | Egg Hunter / Secret Seeker / Egg Master | Discover 5 / 15 / 30 hidden songs | bronze/silver/gold | 5/10/20 |

All 50: `repeatable=false`, `showBeforeEarned=true`, `archived=false`; one locale en-US; each has a 512-px-class PNG in `GameCenterResources.gamekit/en-US/` (images not exported: proprietary art). Full rows incl. icons, howTo text and before/after descriptions: `data/game_center.json`.

`AchievementStats` (inputs to progress functions, exact field list starts): currentStreak, bestStreak, dailyGoalMetDays, focusHabitDays, perTypeMasteryLevel, perTypeBestAccuracy, perTypeSessions, totalSessions, totalPracticeMinutes, lessonsCompleted, chaptersUnlocked, allChaptersUnlocked, chaptersC… (truncated in dump). `AchievementBackfill.Plan {idsToGrant, newBaseline, summaryIds}` grants badges retroactively on update and shows `AchievementBackfillSummarySheet` (exact names).

## 6. Leaderboards (5)
| Id | Name | Format | Sort | Submission | Suffix |
|---|---|---|---|---|---|
| ti.lb.lifetime_xp | Lifetime XP | INTEGER | DESC | BEST_SCORE | XP |
| ti.lb.best_streak | Best Streak | INTEGER | DESC | BEST_SCORE | day/days |
| ti.lb.practice_minutes | Practice Minutes | INTEGER | DESC | BEST_SCORE | minutes |
| ti.lb.ear_accuracy | Ear Training Accuracy | INTEGER | DESC | BEST_SCORE | % |
| ti.lb.drill_combo | Drill Best Combo | INTEGER | DESC | BEST_SCORE | notes |

All `SHOW_FOR_ALL`. Settings: `gameCenterEnabled`, `gameCenterAgeConfirmed` (an age gate before enabling, exact key; UI inferred). `GameCenterManager {isAvailable, isAuthenticated, leaderboardsAllowed}`.

## 7. Streaks, goals, reminders
- `StreakManager {currentStreak, todayActivityCount, todayMinutes}`; settings `streakBest`.
- Daily goal: settings `dailyGoalKind` (String), `dailyGoalMinutes`; Practice goals in courses use `MusicCharts.PracticeGoalKind = endless | reps | minutes | accuracy | bpm` and `PracticeGoalBar`, `GoalCompleteSheet {onNextRung}` ("next rung" = BPM ladder via `BPMGoalRecord {exerciseKey, milestones}` and `BPMGoalConfig {currentBPM, stepSize}`).
- Notifications (settings): `reminderEnabled/Hour/Minute`, `streakRiskEnabled/Hour/Minute` ("Streak-at-risk alert"), `gapNudgesEnabled`, `milestonesEnabled`, `weeklyDigestEnabled`, `practiceScheduleEnabled`, `practiceReminderHour/Minute`, `practiceWeekdays [Int]`, `practiceModeBudgets [String:Int]`, `practiceCalendarEventID` (writes to Calendar; Info.plist calendar write-only permission).
- Drill tiers: `MusicCharts.DrillTier none/bronze/silver/gold` with `Thresholds {silverBPM, goldBPM}`.
- Ear training: `EarTrainingRecord {date, stage, level, levelStableId, mode, accuracyPercent, points, bestStreak, starsEarned…}`; session has points, streak, bestStreak, lives/maxLives (health bar view `EarTrainingHealthBarView`); level rows show stars and `bestChallengeScore`; modes `practice | challenge`.

## 8. Celebrations and hidden songs
- `CelebrationEvent = levelUp(Int) | achievement | challengeComplete | chapterUnlocked(ChapterUnlockPayload{chapterId, title, subtitle, iconName, iconIsCustomAsset, tint, firstLessonStableId})`, queued in `GamificationEngine.celebrationQueue`; `CelebrationOverlay` animates card offset/scale, background opacity, staged reveal (`revealStep`), badge scale + bounce, sparkle; honours Reduce Motion. Confetti/sparkle sprites come from the Vortex particle package (`VortexBurstConfig.Sprite = circle | sparkle`; Vortex assets `circle`, `confetti`, `sparkle`).
- Easter eggs: 44 `Songs/*.json` with `source: "easterEgg"`. `EasterEggDefinition {id, songId, triggerNotes, triggerSteps?: [TriggerStep = note | chord(Set)], triggerTimeWindow, nudgeText, nudgeIcon, challengeTitle, challengeIcon, description}`; `EasterEggDetector` keeps a rolling note buffer (`maxWindow`, `chordWindow`) and, when the learner plays a song's opening riff anywhere, shows `EasterEggNudgeView` → `EasterEggChallengeView` (phases intro → challenge) and records the best score (`EasterEggPracticeCard`). Settings `easterEggsEnabled`. Achievements egg_5/15/30.
- Rating prompt: `ratingPromptShown/SentimentPicked/Scored/Submitted/Dismissed` analytics, settings `ratingShownCount`, `ratingDismissCount`, `ratingLastScore`.
