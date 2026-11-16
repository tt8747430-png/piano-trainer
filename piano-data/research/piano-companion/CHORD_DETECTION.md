# Chord detection (notes → chord names)

The engine contains **two** recognition algorithms. Both are ported in `chord-detection.ts` and tested in `chord-detection.test.mjs`.

| # | Algorithm | Where | Used by the macOS UI? |
|---|---|---|---|
| A | `ChordService.findChordByFormulaPart` | PianoCompanion.Engine.OSX.dll | **Yes.** It is the "By keys" mode of Chords Dictionary (`ChordsViewController.FillDataSourceWithFilters`), and `SongService` line ~418 uses it to name recorded notes. **exact** |
| B | `ChordNamer.Name` | PianoCompanion.Engine.OSX.dll | **No caller on macOS.** Its static helpers (`NameWithInversion`, `SymbolAfterRoot`, `Label`) are used for labels. Its `Profile` uses onboarding skill keys, so it most likely serves the mobile apps. **exact** (no caller); purpose **inferred** |

A third helper, `ChordNamer.RankReverseResults`, re-ranks reverse-lookup results. It has no caller on macOS either. **exact**

---

## A. Reverse lookup used by macOS (`findChordByFormulaPart`)

### A.1 Input

* Mouse: `PianoKeyboard.SelectedNotes` holds key indexes. Index 0 is the first key, C4 = MIDI 60 (`KeyMouseDownHandler` plays `60 + index`). The list is sorted. Clicking a key toggles it. **exact**
* MIDI: `HandleMidiKey` keeps the held MIDI notes. It subtracts `floor(min/12)*12`, so the lowest note lands in 0–11. **exact**
* A search runs 1.0 s after the last key change (`StartThrottledSearch(1.0)`). **exact**
* Lite gate: with a mouse, a search runs only while ≤ 2 keys are selected. From the 3rd key on, Lite shows the "not available for LITE" alert (`CheckWarnIfLite(ChordsPro)`). MIDI input has no such check (see UI_FLOWS_AND_MENUS.md). **exact**
* Options:
  * `isStrict` = `Settings.IsStrictSearch`. **exact**
  * `includeInversions` = owns ChordsPro AND NOT `Settings.ReverseModeWithoutInversions`. So **Lite never matches inversions.** **exact**
  * `mode` = the chord-type segmented control. **exact**

### A.2 Steps (exact)

1. **SimplifyFormula.** While a pitch class appears more than once:
   * If the lowest note is a duplicate, remove it.
   * Else if the highest note is a duplicate, remove it.
   * If both are duplicates, remove whichever leaves the smaller span. On a tie, remove the highest.
   * Stop when neither edge is a duplicate.

   Then shift everything down by `floor(min/12)*12`. Inner duplicates are kept: `[0,4,16,22]` keeps both E's, because the edge notes 0 and 22 are not duplicates.
2. **Candidates.** `prepareAllChords()` builds every listed chord (89 ids) × inversions 0…min(6, max) × 21 root spellings (`Semitone.Values`, C♭…B♯). Each candidate holds absolute semitones after inversion, normalised so the lowest tone is in 0–11. Order: chord list order, then inversion, then spelling.
3. **Filter.**
   * Skip inversions unless `includeInversions`.
   * With `isStrict`, the candidate must have exactly as many tones as the simplified input.
   * Apply the type filter. In this function, "Sevenths/Ninths/Elevenths/Thirteenths" require a **natural** 7th/9th/11th/13th degree. So dominant and minor 7ths never pass the "Sevenths" filter here: `[0,4,7,10]` with Sevenths gives 0 results.
4. **Match.** Every simplified input value must appear **exactly** (same octave, not just same pitch class) in the candidate's formula (`Chord.matchFormula`).
   * The input is a subset. Supersets match: C E G also returns C6, C7, Cmaj7, Cadd9, C9, C13 and so on.
   * Matching depends on voicing. E G C' (`[4,7,12]`) matches C major only as 1st inversion. Without inversions it finds only chords that contain 4, 7 and 12 in root position (Em7♯5, …).
5. **Rank** with `GetPopularityScore`. Lower is better, and the sort is stable:

| Term | Value |
|---|---|
| Base by chord id | Major 10, Minor 20, Diminished 30, Augmented 40, Seventh 50, Major 7th 60, Minor 7th 70, any other 1000 |
| Inversion | +10 if inversion > 0 |
| Bass = root | −15 if base < 100 and the lowest input pitch class = the root pitch class |
| Exact size | −50 if input note count = candidate note count |
| Spelling | + accidentals in the major key of that root spelling (`GetMajorAccidentals`: C 0, G 1 … C♯ 7, D♭ 5, B♯ 12, F♭ 8 …) |
| Constant | + 20 × input note count |

6. **Display.** The whole list goes to the collection view (150×100 items, see COMPONENTS_LAYOUT_MOTION.md). With "auto select first item" on, the first result is selected and played. **exact** (`ChordsViewController.SelectItem`, `Settings.AutoSelectFirstItem`)

### A.3 Worked examples (from the port; scores verified by hand)

| Input | Options | Top results (score) |
|---|---|---|
| C E G `[0,4,7]` | default | C Major 5 · **B♯ Major 17** · C7 95 · Cmaj7 105 · B♯7 107 · B♯maj7 117 · C6 1060 · C7(13) 1060 … (54 results) |
| C E G | strict | C Major 5 · B♯ Major 17 |
| E G C `[4,7,12]` | default (Lite) | Em7♯5 1064 · Em(maj7,♯5) 1064 · Em9♯5 1064 … — no C major, because inversions are off |
| E G C | inversions on | C Major (1) "C/E" 30 · B♯ Major (1) 42 · C7 (1) 120 · Cmaj7 (1) 130 · B♯7 (1) 132 · B♯maj7 (1) 142 · Am7 (2) 143 … |
| C E♭ G B♭ `[0,3,7,10]` | default | Cm7 85 · B♯m7 97 · Cm9 1080 · Cm7♭9 1080 · Cm11 1080 … |
| D♭ F A♭ `[1,5,8]` | default | D♭ Major 10 · C♯ Major 12 · D♭7 100 · C♯7 102 … |
| C E G B♭ | mode Sevenths | no results (natural-7th rule) |

**Behaviour to copy or avoid:**
* Enharmonic duplicates appear in the list (C and B♯; C♯ and D♭). Only the key-accidental term separates them.
* Because of subset matching, a dyad returns dozens of chords.
* Voicing-exact matching means Lite users who play an inversion get odd answers.

---

## B. `ChordNamer.Name` (shared namer, exact)

`Name(notes, maxCandidates = 3, level = Comfortable)`, where `notes` are MIDI numbers (negatives are ignored).

### B.1 Dictionary entries

* For each listed chord (formula ≥ 2 tones), and each root among the 17 `NotesWithSharpsFlats` spellings:
  * Compute `KeyFifths`. Letter fifths are F −1, C 0, G 1, D 2, A 3, E 4, B 5. Add +7 for ♯ and −7 for ♭. Minor-type chords (have ♭3, no 3) subtract 3.
  * Per root pitch class, keep the spelling with the smallest |KeyFifths|. On a tie, minor-type chords take the flat side and other chords keep the sharp side.
* Each entry stores:
  * a 12-bit pitch-class mask;
  * the tone count;
  * the first interval for each pitch class;
  * the difficulty;
  * the key accidentals (|KeyFifths|).
* Entries with the same (root, mask) are merged. The lowest difficulty wins, then the lowest id.

### B.2 Difficulty (`ChordNamer.Difficulty`)

| Chord | Difficulty |
|---|---|
| Major 10 | 0 |
| Minor 11, Fifth 100 | 1 |
| 7 (19) | 2 |
| m7 20, maj7 22, sus4 15 | 3 |
| sus2 14, dim 12, 6 (17) | 4 |
| aug 13, m6 18, add9 104, m7♭5 2000, dim7 21, 7sus4 1901 | 5 |
| m(add9) 105, 9 (25), maj9 101, m9 26 | 6 |
| m(maj7) 23, 6/9 30 | 7 |
| anything else | 4 + distinct pitch classes, +2 for Alts variants (id ≥ 1000) |

### B.3 Level profiles (`ProfileFor`)

| Level | Difficulty cap (above it +100) | Difficulty weight | Foreign-bass penalty | Skill keys |
|---|---|---|---|---|
| Beginner | 4 | 1.0 | 8 | `just_starting` |
| Basic (default) | 6 | 1.0 | 6 | `know_a_few`, unknown |
| Comfortable | none | 1.0 | 6 | `comfortable`, `comfortable_reading` |
| Advanced | none | 0.5 | 4 | `advanced` |

### B.4 Matching one entry (`Match`)

Notation: `played` = played pitch-class mask; `bass` = pitch class of the lowest note; `base = difficulty × weight (+100 if above cap)`.

| Kind | Condition | Score |
|---|---|---|
| Root | played = entry mask and bass = root | base |
| Inversion | played = entry mask and bass ≠ root | base + 3 |
| Omitted | played ⊂ entry mask, the root is played, and every missing tone is omittable; at most 1 missing (2 for chords with ≥ 6 tones) | base + 3 × missing (+3 if bass ≠ root) |
| ForeignBass | bass is not a chord tone; played minus bass = entry mask; entry has ≥ 3 tones and difficulty ≤ 7 | base + foreign-bass penalty |

Omittable tones:
* the 5th, only if a 3rd (minor or major) is played;
* the 9th, only if the chord also has an 11th, ♯11 or 13th;
* the 11th, only if the chord has a 13th.

`FinalScore = Score + 0.01 × key accidentals`. `RawScore` removes the level shift.

### B.5 Selecting candidates (`Compute`)

1. Keep candidates with RawScore ≤ best RawScore + 7 (`MaxScoreGap`).
2. Sort by FinalScore, then kind (Root < Inversion < Omitted < ForeignBass).
3. Build labels and drop duplicate labels. Once `maxCandidates` are collected, stop at the first candidate with a worse score or kind.
4. Re-sort by Score, then kind, then label (ordinal), and take `maxCandidates`.
5. Results are cached by (mask, bass, max, level). The cache is cleared when the symbol style, notation, academic flag or dictionary size changes.

### B.6 Labels

* Label = `root + gap + symbol`. Omitted tones are added as `(no5)` or `(no5,9)`, merged into an existing parenthesis. A slash bass follows as `/bass`.
* Bass name:
  * a chord tone gets its spelling inside the chord (C6/A);
  * a foreign bass gets flats if the chord's key has flats, sharps otherwise.
* Degree numbers for "no": 1/2/2/3/3/4/5/5/5/6/7/7 for intervals 0–11, then 13–15 → 9, 17–18 → 11, 20–22 → 13.

### B.7 Worked examples (Comfortable unless stated; from the port, cases 1–5 checked by hand)

| Played (MIDI) | Candidates [kind, score] |
|---|---|
| 60 64 67 | C [Root 0] |
| 64 67 72 | C/E [Inversion 3] |
| 57 60 64 67 | Am7 [Root 3] · C/A [ForeignBass 6] · C6/A [Inversion 7] |
| 60 64 70 | C7(no5) [Omitted 5] |
| 62 65 69 72 | Dm7 [3.01] · F/D [6.01] · F6/D [7.01] |
| 61 65 68 | D♭ [0.05] (C♯ would cost 0.07) |
| 66 70 73 | F♯ [0.06] (tie with G♭; major keeps the sharp side) |
| 63 66 70 | E♭m [1.06] (tie with D♯m; minor takes the flat side) |
| 60 63 66 69 | Cdim7 [5.03] · Adim7/C [8.00] · F♯dim7/C [8.03] |
| 60 62 67 | Csus2 [4] · Gsus4/C [6.01] |
| 60 67 | C5 [1] |
| 60 64 67 71 74 | Cmaj9 [6] · Em7/C [9.01] · G6/C [10.01] |
| 55 59 62 65 69 | G9 [6.01] · Dm6/G [11.01] · Bm7♭5/G [11.02] |
| 60 64 67 70 74 77 81, Beginner | C13 [111] (above cap, still shown because nothing else fits) |

---

## C. Porting notes

* `chord-detection.ts` reproduces:
  * the dictionary (`CHORDS`, 113 chords, 89 listed) and all 5 symbol styles;
  * algorithm A (`findChordByFormulaPart`) and algorithm B (`nameChord`);
  * the suggester (`suggestNextChords`), the voicer (`buildVoicing`) and the fingering (`assignFingering`).
* It uses only erasable TypeScript, so Node 22.6+ can run it directly.
* Test: `node --test chord-detection.test.mjs` gives 10 tests, 10 passing. The expected values were worked out by hand from the C#, not copied from the port.
* Not ported:
  * custom user chords (`AddCustomChord`);
  * non-English notations;
  * the `IsAcademicNotation = false` simplification;
  * `RankReverseResults`;
  * the inversion-specific accidental shuffling in `inversionTransform`. It does not change pitches or names for the built-in chords.
* For a trainer, I recommend:
  * use B (pitch-class based, handles inversions, omissions and slash basses) for "what am I playing";
  * use A only if you want the app's "show every chord that contains these keys" browsing behaviour.
