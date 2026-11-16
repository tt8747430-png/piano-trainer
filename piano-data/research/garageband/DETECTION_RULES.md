# GarageBand Chord Detection Rules

Recovered from **GarageBand 10.4.14** (macOS), `MAHarmony.framework` (Apple's C++ harmony engine),
by decompiling with Ghidra 12.2 and reading the data tables in the binary.
`gb_chord_detector.py` is a runnable Python port.

## Where detection happens

| Piece | Function | Notes |
|---|---|---|
| Collect held notes | `CChordHeavy::SetFromNoteSet` | Lowest note = bass. Stores the pitch-class intervals above the bass. |
| Pick the root | `CChordHeavy::SetRootNoteAndEnh_ToLikeliestRegardingNoteSet(algo)` | Two algorithms (below). |
| Score one candidate root | `CChordHeavy::ProbThatNoteIsRootNote` | Weighted voting, used by algo 0. |
| Spelling (C# vs Db) | `SetRootNoteEnhWithLeastSigns`, `AdjustEnhOfChordNotesToRootScale` | Chooses the spelling with the fewest accidentals. |
| Chord name | `CChordHeavy::Name`, `OptionsName`, `NameWithSlash` | Base chord + "options" (tensions) + `/bass`. |

**Which algorithm is used where:**
- **algo 0: rule-based voting.** Used by GarageBand's control-bar chord display
  (`-[TransportDisplayController updateElement:]`). This is the one documented and ported here.
- **algo 1: neural network.** Used by audio/MIDI note recognition
  (`MADSP CNoteFinderBackplane::GetCurrentChord`) and one other internal caller.

## Algo 0: rule-based root voting (exact)

1. Distinct notes are collected and the lowest is the **bass**. `intervals` = the sorted distinct
   pitch classes, in semitones above the bass. `n` = number of distinct pitch classes.
2. Every pitch class 0–11 is tried as the root candidate, including notes not being played.
   Its score comes from `ProbThatNoteIsRootNote`.
3. Highest score wins. On a tie, a candidate that is actually sounding replaces the current best
   only if it is closer to the bass (circular distance, at most 6 semitones). Tie-breaking is closely approximated.

### Special cases (checked first; interval sets are relative to the bass and must match exactly)

| Intervals above bass | Example (bass C) | Candidate | Score |
|---|---|---|---|
| {0, 6, 11} | C F# B | bass + 2 (D) | 33 |
| {0, 4, 9, 10} | C E A Bb | bass (C) | 45 |
| {0, 2, 6, 11} | C D F# B | bass + 2 (D) | 45 |
| {0, 3, 6, 10} | C Eb Gb Bb | bass (C) | 48 (m7b5 rather than Ebm6/C) |
| {0, 7} with exactly 3 notes | C G C | bass (C) | 5 |

"bass + 2" is compared without wrapping around 12, so those two cases never fire when the bass is Bb or B.
This quirk is in the original code.

### General vote

```
score(candidate) = Σ over each sounding pitch class p:
                     TABLE[n][ (p − candidate) mod 12 ]
                   (when n ≥ 7, the three lowest pitch classes above the bass count ×4)
```

Tables. The column is the interval of a sounding note above the candidate root:

| n (distinct pitch classes) | R | b9 | 9 | m3 | M3 | 4 | b5 | 5 | #5 | 6 | b7 | M7 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1–2 | 3 | 0 | 0 | 2 | 2 | 0 | 0 | 1 | 0 | 0 | 2 | 2 |
| 3 | 18 | 0 | 2 | 12 | 12 | 2 | 2 | 14 | 1 | 2 | 5 | 5 |
| 4–6 | 18 | 0 | 3 | 12 | 12 | 3 | 3 | 14 | 0 | 3 | 3 | 3 |
| 7+ | 18 | 8 | 8 | 12 | 12 | 6 | 5 | 14 | 4 | 4 | 10 | 10 |

In plain terms, a candidate scores high when it is **sounding** (18), has a **fifth** above it (14),
and has a **third** above it (12). Sevenths and tensions add little.
GarageBand therefore favours the root that completes the strongest triad. Rich jazz voicings often come out
as a triad over a different bass: G-F-A-B-E (G13) reads as **Em/G**, because E-G-B is a complete
triad (18+12+14) and outscores G-B with no D (18+12). ChordLab's detector names the same voicing G13.

## Algo 1: neural network (architecture only)

- `NeuronalNet` is a small feed-forward network: **24 inputs → 15 → 15 (2 hidden layers) → 12 outputs**.
  Its definition is the `_ChordAnalysisNeuronalNet` struct, and its trained weights are in `_weight_definitions`.
- Input: 24 values, 1.0 if the interval i (mod 24, i.e. two octaves above the bass) is sounding, else 0.0.
- Output: 12 values. The **winner** (argmax) is the root's interval above the bass.
- The weights are Apple's trained model data and are **not** included in this export.
  To use this approach, train your own 24→15→15→12 network on labelled voicings.

## Naming vocabulary (from MAHarmony strings)

Chord base and options strings found in the binary include: `maj`, `maj7`, `maj9`, `m`, `m6`, `m9`,
`add2`, `add4`, `add9`, `add11`, `addb9`, `b5`, `#5`, `b9`, `#9`, `#11`, `b13`, `no3`, `omit3`, and slash `/` bass.
GarageBand assembles the name as root + base chord + options + `/bass`. The exact formatter was not ported.
`gb_chord_detector.py` uses its own readable naming.
