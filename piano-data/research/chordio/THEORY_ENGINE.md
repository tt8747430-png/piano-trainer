# Theory engine: chord detection, chord naming and display, scales, harmony, ML suggester

Sources: arm64 slice of `Contents/MacOS/Chordio`, decompiled with Ghidra 12.2 headless. Function addresses are given, and the tables were read from the binary with Node (`data/engine_tables.json`). Each claim is marked **exact** or **inferred**.

## 1. Pipeline from played notes to chord name (exact)
1. `HomeViewController fetchChordResultsFromChordMidiNumbers:` (0x100118df0) runs every live note set. It converts each MIDI number to a note name (`NoteManager noteNameFromMidiNumber:`), removes `"n"`, and calls `+[NoteManager findChordResultsFromChordNotes:]`.
2. `findChordResultsFromChordNotes:` (0x1002db0a4) joins the names, **strips octave digits** (`-1`, `0`–`3` replaced with ""), and hands a C string to an embedded **C++ chord analyser**. The C++ code is statically linked and stripped (it has a vtable at 0x10061dbc8, std::string, and error texts "At least two notes are required." and "Invalid notes!"). Its errors log as "Unknown C++ exception occurred in findChordResultsFromChordNotes". It returns `{foundChordResults: [names], foundChordIntervalResults: [interval labels]}`. It is called only for **2 or more notes**.
   - The analyser returns **one candidate per distinct note, with that note taken as root**. A non-root bass is shown as a slash: `"Fmin7", "Ab6 / F", "Cmin(11, #5) / F", "Eb6/9sus4 / F"`. This matches the stored `ChordModel.chordResults` (CONTENT_FORMATS.md §3). **exact** from data; that it is "one per distinct note" is **inferred** from the counts (`numberOfChordResults` 3–7 and the ranker's per-pitch-class loop).
   - Interval labels used: `1 2 b3 3 4 b5 5 #5 6 b6 bb7 b7 7 8 b9 9 #9 10 11 #11 b13 13`, plus "Out of Chord Interval Range: %ld". **exact**.
   - Quality vocabulary: 184 strings in the binary, listed in `engine_tables.json → nameVocabulary`. Examples: `( omit3, sus2b9, minMaj9, min6/9(11), dim7(add#5), 9sus4#5, Maj9#11(no3), 7(b9,#5), 13(#11), min(add4/11) …`. Many are pairs of an **analyser spelling and a display spelling** (`min9#11 → m9+11`, `7#11 → 7+11`, `Maj7#5 → M7+5`). These feed `ChordQualityManager chordConversionNameFromContentValues:chordTypeName:` and the ML dictionary format (`quality_to_components.json` keys such as `m9+11`, `7+11`). **inferred** pairing; strings **exact**.
3. `ChordQualityManager chordResults:noteMidiNumbers:isLiveInput:displayIndex:` (0x10012389c) builds a chord dictionary for each candidate. Then:
   - **Live input** (`isLiveInput = YES`): `ChordNameRanker displayedCandidateIndexesForMidiNumbers:candidateNames:` chooses what to show.
   - Stored chord: uses the saved `displayIndex` (clamped into range).
   - Output dictionary keys: `RootNoteString, ChordExtention, FormattedChordName, PrimaryChordName, SecondaryChordName, TertiaryChordName, OriginalOrderedChordNames, DisplayedChordResultIndexes`. **Up to three names** are shown: primary, secondary, tertiary.

## 2. ChordNameRanker scoring (exact; FUN_10012515c @0x10012515c, 1904 bytes)
Input: the MIDI numbers, plus one candidate name per distinct pitch class in **order of first appearance** (the lowest note first, which is the bass).
- Build a 12-bit pitch-class mask. If any MIDI number is negative or a sentinel, return 0 candidates.
- For each candidate root r (each distinct pitch class):
  1. **Bass penalty**, where `bassInt = (bass − r) mod 12`:
     - 0 if the bass is the root.
     - 0.5 by default (an ordinary inversion: 3rd, 5th, 7th in the bass, and so on).
     - **1.0, with the bass removed from the mask** (treated as a slash bass rather than a chord tone) when:
       - bass = ♭9;
       - bass = 9 and the chord has b3, 3 or 4;
       - bass = b3 and the chord has a major 3rd;
       - bass = 4 and the chord has a 3rd;
       - bass = b5 and the chord has a 5th or no 3rd;
       - bass = #5, unless the shape is augmented (3, no 5);
       - bass = 6, unless the shape is dim7/m6 (b3 + b5, no 5/b7/7).
  2. **Template match.** There are 27 templates (table @0x1005b9460). A template matches when all its tones are in the mask. If only the 5th is missing and the template allows it, its `missingFifthPenalty` is added. Cost = `baseCost` + the sum of the **extra-tone penalties** below, plus 0.6 more when the 5th is missing **and** the chord is inverted. The candidate takes the minimum cost over all templates.

| # | Tones | base | missing-5th |
|---|---|---|---|
| 0 | 1 3 5 | 0 | 0.35 |
| 1 | 1 b3 5 | 0 | 0.35 |
| 2 | 1 b3 b5 | 0.45 | — |
| 3 | 1 3 #5 | 0.45 | — |
| 4 | 1 3 b5 | 0.8 | — |
| 5 | 1 4 5 (sus4) | 0.6 | — |
| 6 | 1 2 5 (sus2) | 0.7 | — |
| 7 | 1 3 5 b7 | 0.1 | 0.1 |
| 8 | 1 3 5 7 | 0.1 | 0.1 |
| 9 | 1 b3 5 b7 | 0.1 | 0.1 |
| 10 | 1 b3 b5 b7 | 0.4 | — |
| 11 | 1 b3 b5 bb7 (dim7) | 0.35 | — |
| 12 | 1 b3 5 7 | 0.7 | 0.1 |
| 13 | 1 3 5 6 | 0.25 | 0.9 |
| 14 | 1 b3 5 6 | 0.35 | 0.9 |
| 15 | 1 2 3 5 6 (6/9) | 0.45 | 0.15 |
| 16 | 1 2 b3 5 6 | 0.55 | 0.15 |
| 17 | 1 4 5 b7 | 0.55 | 0.15 |
| 18 | 1 4 5 7 | 0.8 | 0.15 |
| 19 | 1 2 5 b7 | 0.8 | 0.15 |
| 20 | 1 2 5 7 | 0.9 | 0.15 |
| 21 | 1 3 #5 b7 | 0.7 | — |
| 22 | 1 3 #5 7 | 0.9 | — |
| 23 | 1 3 b5 b7 | 0.9 | — |
| 24 | 1 5 b7 | 1.0 | — |
| 25 | 1 5 7 | 1.1 | — |
| 26 | 1 5 | 1.2 | — |

  Extra-tone penalties (tones in the chord but not in the template):

| Extra tone | Penalty |
|---|---|
| ♭9 | 0.5 on a dominant (3 + b7); 1.0 on other 7th chords; 1.4 on triads |
| 9 | 0.3 with a 7th; 0.4 without |
| ♯9 (b3 over a major 3rd) | 0.6 on a dominant; 1.3 otherwise |
| extra 3 | 1.5 |
| 11 / 4 | 0.95 over a major 3rd; 0.45 otherwise |
| ♯11 / b5 | 0.85 |
| extra 5 | 1.1 |
| ♯5 / ♭13 | 1.0 |
| 13 / 6 | 0.4 with a 7th; 0.9 without |
| b7 | 0.9 (1.5 if the template has a maj7) |
| 7 | 1.0 (1.5 if the template has a b7) |
| on the dim7 template only | 9 → 0.8, 11 → 0.9 |

  3. If no template matches: cost = `3.0 + 0.1 × (number of pitch classes)`.
  4. Total = bass penalty + best template cost, plus **10** if the candidate name contains "n.c.".
- Sort by cost, lowest first (qsort; comparator FUN_100125bb0 not decompiled, so ascending order is **inferred** from the best-is-lowest logic, 24-byte records `{index, cost, rootInterval}`). With **3 or more candidates**, if the best cost is **> 1.9**, the candidate whose root is the bass (index 0) moves to the front.
- **Displayed alternatives** (`displayedCandidateIndexes…` @0x1001258cc):
  - Always show the top candidate.
  - Add alternatives only when there are **4 or more distinct pitch classes**: 1 alternative if there are exactly 4, otherwise 2.
  - An alternative must cost **≤ 3.0**, must not be "n.c.", and must differ from names already shown after whitespace is normalised.

## 3. Chord display (exact strings / classes)
- `ChordDisplayView` and `CenterChordSubDisplayView` (pulsing border: `borderWidthPulse`, `borderColorPulse`) show the primary name. `AlternateChordNameView` shows the alternatives with left/right selection. `ChordCapturedDescriptionView` appears when Capture Chords adds a cell.
- The root is drawn italic: `NoteManager mainRootNoteNameFromOriginalItalicRootName`, `updateToItalicAccidentals:`, `convertItalicAccidentalToNormalString:`. `displayFormatAttributedString:scaleFactor:fontName:midiNoteCount:` formats the name, and **Bravura** (SMuFL) draws music glyphs.
- The stored cell `name` uses "Root␣quality" with words: "C min", "G 7", "A♭ Maj", "E♭ 9(13)", "C  Major 6th". Slash chords are shown as "A♭ / C". Chord-pattern cells show "||:" and ":||".
- **Hold Last Chord** (right-click on the foot pedal) pins the last chord and its highlighted keys. **Dim Highlight On Sustain** fades highlighted keys while the sustain pedal is held (levels Subtle / Strong; key `TBKeyboardSustainPedalDimmingOpacityKey`).
- A detached **Chord Display window** is a separate scene (`ChordDisplaySceneDelegate`). It can be set Always on Top and has a visible-count setting (`TBChordDisplayVisibleCountKey`).
- Note-name notation setting (`NotationTypeSettingsViewController`): **English, German, French (Ut Ré Mi Fa Sol La Si), Do Re Mi with ♯ and ♭ (fixed Do), Solfège (Do Di Re Ri Mi…)**. Interval naming: "English (e.g. Perfect 5th)" or "Localized (e.g. Quinta Justa)". Solfège syllables in the binary: `Do Di Re Ri Mi Fa Fi So Si La Li Ti`. **exact**.

## 4. Voicings and transforms (exact names)
- **Chord Types** panel (`CreateChordViewController`): groups `Triads, 7ths, 9ths, 11ths, 13ths, Stacked 3rds`, plus qualities such as `6/9, add9, Maj13, min6, min11, min13, min(Maj7), min7b5, Dominant 7(#9) 7(b5) 7(#5), Sus & Other sus2 sus4`.
- **Chord Voicings** circle (`ModesViewController`/`CodeWheelView`): voicing types `Rootless, Shell, So What, K. Barron, H. Hancock, Open, Closed`. Generated by `ChordTransformerServiceManager` (`generateDiminishedVoicing`, `generateMinMaj9Voicing`, `determineModeTypeForStacked3rdsChord`).
- **Chord Transformer** (5 steps, from the help text) and **Target Voice Motion** (keep the upper voice smooth across the progression).
- **Chord Substitution** pie (`OuterPieChordSubstitutionView`): `ii-V-I`, `Tritone Sub`, `Tonic Sub`, diminished `o`/`o7`.
- Inversions: `NoteManager chordInversionMidiNumbersFromChordMidiNumbers:inversionButtonPressed:numberOfNotesAboveRoot:`.
- `compatibleModalChords` stack thirds within the primary scale: Triad → Thirteenth, 7 degrees each, named like "Minor Diminished Dominant 7th ♭ 9th". Spelling uses ♭/♯, and octave digits are relative to the root. **exact** (data).

## 5. Scales and modes
- `TBModeScale` holds `identifier, name, alsoKnownAs, family, modeNumber, quality, cellTitle, cellSubtitle, origin, characterTags, summary, signatureTitle, signatureText, degreeLabels, semitones, stepPattern, wheelPositions`, with methods `spelledNotesWithRootName:includeOctave:`, `scaleToneChordOnDegreeAt:rootName:` and `keyboardOverlayNoteNamesWithRootName:`. There are two sets: `diatonicModes` and `otherScales`. The prose for each scale (e.g. "Phrygian with a major third. The step-and-a-half leap from ♭2 up to 3 is the signature sound of flamenco…") is in `data/strings_en.json`. **exact**.
- Scale list in the scale browser (36 names, **exact** order): Natural Minor, Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian, Harmonic Minor, Melodic Minor, Bebop Major, Bebop Minor, Bebop, Half Diminished, Diminished, Whole Tone (WT), Diminished WT, Minor Blues, Super Locrian, Romanian Minor, Spanish Gypsy, Double Harmonic, Enigmatic, Pelog, Prometheus, Lydian Minor, Hungarian Major, Hungarian Minor, Ichikosucho, Persian, Flamenco, Hawaiian, Maqam, Oriental, Iwato, Raga Malakosh (more follow in the binary: Balinese, Kafi Raga, Todi Raga, Purvi Raga, In Sen). The help says "over 40 scales".
- Practice view: the overlay shows scale notes in **yellow** and roots in **green circles**. Tapping the upper letters toggles notes ↔ degrees. Tapping between notes shows H/W steps. A treble/bass clef toggle and metronome practice are included. **exact** (help strings).

## 6. Harmony Explorer (Swift `HarmonyExplorer`; strings exact, method bodies not decompiled)
- Static APIs: `diatonicTriads/diatonicSevenths/borrowedChords/secondaryDominants/tritoneSubstitutions/cadences/popularProgressions WithKeyRootName:isMinor:`, `detectedScalesForChordMidiNumbers:limit:` and `chordAnalysesForChordMidiNumbers:keyRootName:isMinor:` (→ `relationship`, `numeral`).
- Sections: **Chords in Key** ("Diatonic triads and sevenths"), **Borrowed Chords** ("Modal interchange from %@ major/minor"), **Secondary Dominants** ("Temporary tension toward each degree"), **Tritone Substitutions** ("Dominants a tritone away, sharing the same tension"), **Cadences** ("Ways to land a section": Authentic (V7-I), Plagal (IV-I), Half (I-V), Deceptive (V7-vi), Backdoor (♭VII7-I)), and **Detected Scales** ("Scales that fit the chords on the canvas", reported as `matchedChordCount/totalChordCount`). Popular-progression nicknames in the string table include Andalusian, Axis, Canon, Doo-Wop and Jazz Turnaround, each with a one-word mood adjective. **inferred** list from the localisation keys.
- Relationship colours on chord-cell borders: **Diatonic, Sec. Dominant, Tritone Sub, Borrowed, Chromatic**, with a Roman-numeral badge. Key source options: song key signature (default), a custom key picker, "Set key from selected chord", and "Match Song Key".

## 7. Key detection for MIDI import (exact; `TBMIDIPerformanceAnalyzer`)
- Builds a duration-weighted pitch-class histogram over the chosen tracks and **ignores channel 9 (drums)**.
- Computes the Pearson correlation against the **Krumhansl–Kessler** profiles for all 12 rotations:
  - major `6.35 2.23 3.48 2.33 4.38 4.09 2.52 5.19 2.39 3.66 2.29 2.88`
  - minor `6.33 2.68 3.52 5.38 2.60 3.53 2.54 4.75 3.98 2.69 3.34 3.17`
- If the best match is minor, it returns the relative major key index (+3 semitones) with `isMinor = YES`.
- The same class turns MIDI into chord cells: `sequenceLooksLikeBlockChords:`, `templatesForOptions:count:`, `cellDurationsForLength:`, `chordModelsFromSequence:trackIndexes:options:keyIndex:isMinor:` and `voicingForRoot:intervals:count:bassPC:`. The import panel has an "Advanced" section (`midiImport.advanced`). The help notes: "MIDI files should only contain block chords and not melodic components", and **Ripchord** file import is supported.

## 8. Progression generator and ML chord suggester
- `GenerateChordViewController` + Swift `Progression chordProgressionWithScaleType:key:accidentalType:musicChordType:musicProgressionType:` create progressions from a drop-down list, with a random (dice) button, a key lock and a transfer-to-canvas button. **exact** (help text).
- **Chord Suggestion AI** (`ChordSuggesterViewController`, Swift `ChordPredictor predictFor:` → `MLChordSuggester`):
  - Core ML model `MLChordSuggester.mlmodelc`, author "Juan Luis García López", "ChordSuggester … trained using an LSTM Neural Network", licence field "--".
  - Architecture (**exact** from `model.mil`): Embedding(805 × 20) → LSTM(50) → LSTM(50) → Dense(50, ReLU) → Dense(805, softmax). Input `embedding_13_input` float [1…N, 20] (a window of 20 chord ids, **inferred**). Output `Identity` is a probability over 805 classes.
  - Vocabulary: `category_to_number.json` = **804 chord classes = 12 roots (C Db D Eb E F F# G Ab A Bb B) × 67 qualities** (`unique_qualities.json`), ids 1–804 (0 = padding, **inferred**). `quality_to_components.json` maps 135 quality spellings to semitone sets (e.g. `"m9": [0,3,7,10,14]`). Swift `ChordDictionary` exposes `NumberOfNotes`, `SequenceLength`, `SuggestedChordNumber`, `ToComponents`, `ToNumber`, `ToNote`.
- **Key Cycle** (`KeyCycleManager`): patterns Cycle 4ths, Cycle 5ths, half ↑/↓, whole ↑/↓, Minor 3rds, Random. Random = a Fisher–Yates shuffle of offsets 1–11 with 0 put first (**exact**, @0x10013752c). With "loops per key", it auto-advances when Loop is on. UI: "Key %ld of 12", "Return to Home Key".

## 9. Circle of fifths: see CIRCLE_OF_FIFTHS.md.
