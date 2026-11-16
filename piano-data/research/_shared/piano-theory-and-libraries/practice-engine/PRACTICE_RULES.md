# ChordLab Practice Engine Rules

Recovered from **ChordLab 1.0.6** (macOS arm64) by decompiling with Ghidra 12.2 and reading the
binary's constant data. The app was not run. `practice_engine.py` is a runnable reimplementation.

Confidence: **exact** = translated from decompiled code, with constants read from the binary.
**inferred** = behaviour is clear but a helper was not fully decompiled, or labels are guessed.

## 1. Scoring one attempt

| Rule | Value | Source | Confidence |
|---|---|---|---|
| Note match | `matched_target_notes / target_notes − 0.1 × extra_notes`, clamped 0–1 | `PracticePanel::computeProportionalMatch` (alignment via `VoicingLibrary::alignVoicingStructure`) | exact formula; alignment step inferred |
| Wrong-note penalty | −0.25 per wrong note played **before** the right chord ("WRONG NOTE FIRST" / "N WRONG NOTES FIRST") | `updateTimedPractice`, `updateUntimedPractice` | exact |
| Timing tolerance | 80 ms expressed in beats (`0.08 × BPM / 60`). If that exceeds ¼ beat, the tolerance is `min(150 ms, ¼ beat)`, so it never exceeds 0.25 beat | `updateTimedPractice` | exact |
| Lateness | Median lateness (in beats) of the notes in the chord | `updateTimedPractice` | exact (median); unit inferred as beats |
| Timing factor | If late beyond tolerance: `late = clamp((median − tol)/(1 − tol), 0, 1)`, then `factor = 1 − 0.8 × late`. Shown as "LATE" | `updateTimedPractice` | exact |
| Accuracy | Timed: `clamp(factor × match − 0.25 × wrongFirst, 0, 1)`. Untimed: `clamp(match − 0.25 × wrongFirst, 0, 1)` | same | exact |
| Quality | `round(accuracy × 5)`, clamped 0–5. A key is flagged as failed this pass if quality < 3 | same | exact |

## 2. What gets recorded (`SpacedRepetitionEngine::recordAttempt`, exact)

- Records are kept **per item (voicing, progression or melody) per key (0–11)**.
- Each attempt is stored with quality, BPM, timestamp, accuracy, a "counts" flag and an "assisted" flag.
  The assisted flag is set for helper or scale-exercise attempts (`__scaleex__`). The log keeps the last 500 attempts.
- **Legacy SM-2 fields are still maintained:**
  - interval: 1 day on a fail (q < 3), 1 then 6 days on the first two successes, then interval × ease
  - ease: `EF += 0.1 − (5−q)(0.08 + 0.02(5−q))`, minimum 1.3, starting at 2.5
  - the last 100 qualities are kept
- **FSRS scheduling:**
  - The FSRS update runs only if the item is already scheduled (stability > 0), or if the caller asks to start scheduling it.
  - Rating comes from quality: 0–2 → Again, 3 → Hard, 4 → Good, 5 → Easy.
  - Each attempt also goes into a **session card**, which keeps the last 4 accuracies.

## 3. Spaced repetition (`Fsrs::nextState`, `commitSession`, exact)

- The algorithm is **FSRS-6** (21 parameters). The default weights `Fsrs::defaultParams` are the standard published FSRS-6 defaults:
  `[0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542]`.
- **At session end**, each (item, key) gets **one** FSRS review. It is graded from the **average of the best 2 of the last 4** accuracies,
  multiplied by 5 and rounded to a quality, then mapped to a rating. The review is applied to the state the item had **at session start**.
- **Next interval:** `floor((R^(−1/w20) − 1) × S / (0.9^(−1/w20) − 1))` days, clamped to 1–36,500 days. R is the desired retention.
- **Desired retention:** 0.9 by default and can be overridden per folder (`resolvedRetentionFor`). It is clamped to 0.7–0.99 at commit.
- **Due list** (`getReviewItemIds`): an item is due when any of its keys has stability > 0 and its due time ≤ now, and the item isn't snoozed.
  The list is sorted by a comparator (most-overdue order is inferred).

## 4. Mastery

| Rule | Detail | Source | Confidence |
|---|---|---|---|
| Key mastered at a BPM | **2 consecutive most recent** counted, unassisted attempts at that BPM (±0.1) with accuracy **≥ 0.8**, or legacy mastery (next row) | `isKeyMastered`, `refreshDrillKeyState` | exact |
| Legacy mastery | Average of the best 2 of the last 4 attempts at that BPM is ≥ 0.9, or is ≥ 0.8 with a number of attempts other than 2 | `passedLegacyMastery` | exact |
| Best-N-of-last-M | Average of the best **2** of the last **4** accuracies at a BPM (optionally since a time). Returns −1 if there are none | `bestNofLastM` | exact |
| Item best mastered BPM | Highest BPM where the keys that were played average ≥ 0.8, with ≥ 3 attempts in total. Within each key, the last 5 qualities count double | `getBestMasteredBpm` | exact |
| All-keys mastered BPM | Highest BPM at which all 12 keys are mastered | `getAllKeysMasteredBpm` | exact |
| Mastery tier | 0 never attempted; 1 attempted but not yet scheduled; **4** all keys mastered at ≥ target; **3** best mastered ≥ target − 20; **2** mastered below that, or any key's last quality < 2, or its weighted accuracy < 0.5; otherwise 1 | `classifyMasteryTier` | exact logic. Labels (New / Learning / In progress / Close / Mastered) inferred from UI strings `LEARNING`, `In progress`, `Close`, `MASTERED`, `STRUGGLING` |
| Target BPM | The item's own target, default **110**. Rounded **up** to a multiple of 5 and clamped to 30–300 | `classifyMasteryTier`, `checkDrillMastery` | exact |

## 5. 12-key drill and tempo

| Rule | Detail | Source | Confidence |
|---|---|---|---|
| Key retired | A key is "MASTERED – retired from the rotation" once it has ≥ 2 consecutive ≥ 0.8 attempts at the current BPM since the drill started | `checkDrillMastery`, `refreshDrillKeyState` | exact |
| Key needs work | ≥ 3 attempts at the current BPM since the drill started, with best-2-of-last-4 < 0.5 | `keyNeedsWork` | exact |
| Unlocking keys | While ≤ 2 of the active, unretired keys are in good standing, unlock another key ("X UNLOCKED") | `checkDrillMastery` | exact condition; intent inferred |
| Which key unlocks | Default: a locked key a fifth above or below an active key, nearest to the home key on the circle of fifths. With "hard keys first" on, use home-key offsets `[0, 6, 9, 3, 7, 1, 4, 10, 2, 8, 11, 5]` | `pickExpansionKey`, `kHardKeyOffsets` | exact |
| Tempo up | When every key in the drill is retired: new BPM = `min(BPM + step, target)`. Step is a setting, default **10**. The app either prompts or applies it automatically | `checkDrillMastery`, `showBpmIncreasePrompt` | exact |
| Tempo down | Once every active key has ≥ 1 attempt at this BPM, if any key needs work: offer `max(30, BPM − step)`. The setting can be off, prompt, or auto | `maybeOfferTempoDrop`, `showBpmDropPrompt` | exact |
| Raising BPM | Keys already retired stay retired and carry a best accuracy of at least 0.8. The attempt window restarts at the new BPM | `setDrillBpm` | exact |
| Brush-up start BPM | If anything has been mastered: `clamp(max(best mastered, all-keys BPM, saved best), 40, 300)`. Otherwise `max(40, target − 2 × step)` | `brushUpStartBpm` | exact |
| Brush-up target BPM | `clamp(max(target, mastered BPMs), 30, 300)` | `brushUpTargetBpm` | exact |
| Focus-loop pass | A pass succeeds if the loop's average match is ≥ 0.6. It is shown as a percentage | `finishFocusLoopPass` | exact threshold |
| Hint level | Hints only if enabled. Level 1 if any BPM has best-2-of-4 ≥ 0.5; level 2 if the key is mastered (voicing mode) | `hintLevelNow` | exact logic; meaning of the levels inferred |
| Key order modes | `Random`, `Follow`, `Scale`, `Free`, `Chromatic` | string table near `updateTimedPractice` | exact names |

## 6. Metronome click (`TempoEngine::renderClick`, exact)

- The click is a sine burst with a linear fade-out, multiplied by the click volume (default 0.7):
  - **Accent:** 1000 Hz at gain 0.4
  - **Normal beat:** 800 Hz at gain 0.28
- The two click lengths are stored in samples and set elsewhere. Their values weren't resolved; ~10 ms is a reasonable choice.

## Not covered

- Note-to-beat alignment inside `alignVoicingStructure`.
- Melody-specific timing in `advanceMelodyNote`, beyond its 0.1-second grouping window.
- Count-in and prep phases, and the full curriculum seeding (`loadOrSeedCurriculum`).
