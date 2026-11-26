# GarageBand Music-Theory Rules (MAHarmony)

Recovered from **GarageBand 10.4.14**, `MAHarmony.framework` (arm64), with Ghidra 12.2 and direct reads
of the binary's data tables. `theory_engine.py` is a dependency-free Python port.
**Exact** means the value or logic was read directly from code or data. **Inferred** means it was reconstructed from names, partial decompilation or standard theory.

## 1. Enharmonic spelling

| Rule | Source | Status |
|---|---|---|
| Default spelling with no key context: **C C# D Eb E F F# G G# A Bb B** | `MakeSensefulEnhForKeyNrAssumingCMajor`; `_SpellEnharm2` table | Exact |
| A requested spelling is kept if it is "senseful" (e.g. Fb, Cb, E#, B# when explicitly asked for double/single accidentals) | same, `IsSensefulEnhForKeyNr` | Exact |
| Key-root spelling (fewest signs): **C Db D Eb E F F# G Ab A Bb B**. F# beats Gb (tie at 6), Db beats C# (5 vs 7), B beats Cb | `MakeSensefulEnhForKeyNrMajorScaleRootWithLeastSigns` | Exact |
| Key candidates during key detection: C **Db** D **Eb** E F **Gb** G **Ab** A **Bb** B (flats for every black key) | `CHarmCenterWeightAnalysis::DetectHarmCentersFromChords` (mask 0x2a5) | Exact |
| Chord root: count accidentals for the default, all-flats and all-sharps spellings and take the fewest. Ties: default > flats > sharps | `CChordHeavy::SetRootNoteEnhWithLeastSigns` | Exact (how `SignsCount` counts is inferred) |
| Chord tones are spelled from a scale built on the chord root, one letter per degree | `CChordHeavy::AdjustEnhOfChordNotesToRootScale` → `CScaleHeavy::ConstructScaleForChord` | Exact flow, inferred detail |
| Other spelling modes available: PreferSharps, PreferFlats, OnBlackKeyPreferGivenTEnh | `MakeSensefulEnhForKeyNr*` | Exact (names) |

Accidental enum (`TEnh`): 0 = bb, 1 = b, 2 = natural, 3 = #, 4 = ##, 7 = undefined.

## 2. Scales (`CScaleHeavy::mScaleData`, static initializer `FUN_000f6004`)

All interval sets are exact. Ids are GarageBand's `TScaleType`.

| Id | Name | Intervals |
|---|---|---|
| 1 | Major (Ionian) | 0 2 4 5 7 9 11 |
| 2 | Natural Minor (Aeolian) | 0 2 3 5 7 8 10 |
| 3 | Chromatic | 0–11 |
| 4 | Major / Minor | 0 2 3 4 5 7 9 10 11 |
| 5 | Bebop Dominant | 0 2 4 5 7 9 10 11 |
| 6 | Harmonic Minor | 0 2 3 5 7 8 11 |
| 7 | Melodic Minor | 0 2 3 5 7 9 11 |
| 8 | Major Pentatonic | 0 2 4 7 9 |
| 9 | Minor Pentatonic | 0 3 5 7 10 |
| 10 | Major Blues | 0 2 3 4 7 9 |
| 11 | Minor Blues | 0 3 5 6 7 10 |
| 12 | Lydian | 0 2 4 6 7 9 11 |
| 13 | Mixolydian | 0 2 4 5 7 9 10 |
| 14 | Dorian | 0 2 3 5 7 9 10 |
| 15 | Phrygian | 0 1 3 5 7 8 10 |
| 16 | Locrian | 0 1 3 5 6 8 10 |
| 17 | Phrygian Dominant | 0 1 4 5 7 8 10 |
| 18 | Miyako-Bushi (Japanese) | 0 1 5 7 8 |
| 19 | South-East Asian | 0 1 3 7 8 |
| 21 | Half-Whole Diminished | 0 1 3 4 6 7 9 10 |
| 22 | Whole-Half Diminished | 0 2 3 5 6 8 9 11 |
| 23 | Bebop Major | 0 2 4 5 7 8 9 11 |
| 24 | (8-note entry, same set as Bebop Dominant; name not resolved) | 0 2 4 5 7 9 10 11 |
| 25 | Bebop Melodic Minor | 0 2 3 5 7 8 9 11 |
| 26 | Bebop Harmonic Minor | 0 2 3 5 7 8 10 11 |
| 27 | Mixolydian #11 | 0 2 4 6 7 9 10 |
| 28 | Locrian 9 | 0 2 3 5 6 8 10 |
| 29 | Super Locrian (Altered) | 0 1 3 4 6 8 10 |
| 30 | Double Harmonic (Byzantine) | 0 1 4 5 7 8 11 |

The UI's localized strings also name the modes of harmonic minor and melodic minor:
Locrian ♮6 (HM2), Ionian ♯5 (HM3), Dorian ♯11 (HM4), Lydian ♯9 (HM6), HM7,
Dorian ♭2 (MM2), Lydian Augmented (MM3), Mixolydian ♯11 (MM4), Mixolydian ♭13 (MM5), Super Locrian (MM7).
They also name Harmonic Major, Whole Tone, Klezmer and Drone. These are rotations of the tables above (use `mode_of()`).
That is inferred: their data comes from a separate scale-alternatives module that was not decoded.

## 3. Chord naming

**Base chord** (`_BasicChordName_ChordNaming_Normal`, exact strings):

| TBasicChord | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | other |
|---|---|---|---|---|---|---|---|---|---|
| Name | (major, empty) | m | aug | b5 | dim | sus4 | sus2 | 5 | no3 |

With the preference "minor chords as lower-case root" set, `m` is dropped and the root is written in lower case.

**Options / tensions** (`_OptionName_ChordNaming_Normal`, exact strings, enum order):

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| b9 | add b9 | 9 | add 9 | #9 | b3 | 3 | 11 | add 11 | #11 | b5 | 5 | b13 | #5 | 13 | 7 | 6 | ma7 | j7 | maj7 |

- `b` and `#` are written as Unicode ♭/♯ by default, or as ASCII depending on a preference (exact).
- The major-seventh symbol is chosen by preference: `ma7`, `j7` or `maj7` (exact).
- Full name = root + base chord + options + `/bass` (`NameWithSlash`). When an accidental could be misread
  (e.g. `Ab9` vs `A b9`), a clarifying separator is inserted (`_BasicChordAndOptionsName_NeedsClarifyingSeparator...`).
- Which interval becomes which option, and their order, is decided in `CChordHeavy::OptionsMap` (5.3 KB of branching).
  That part is inferred in the port: sevenths first, then tensions from low to high, and 7 + 9/11/13 collapses to the highest extension.
- The localized display list matches this vocabulary: Major 6/7/9/11/13, Major add9/add11, maj7/maj9/maj13,
  Major ♭5/♯5/♭9/♯9/♯11/♭13, Minor 6/7/9/11/13, Minor 7♭5, Minor maj7/maj9, Aug/Aug 7, Dim/Dim 7, HalfDim,
  Sus 2/Sus 4, 7 Sus 2/4, Maj7 Sus 2/4, No Chord.

**Chord families used for progression matching** (`CSemitonesMatch` templates, exact).
Requirement per interval class: R, b9, 9, m3, M3, 4, b5, 5, #5, 6, b7, maj7. 1 = required, 0 = forbidden, 2 = don't care.

| Template | R | b9 | 9 | m3 | M3 | 4 | b5 | 5 | #5 | 6 | b7 | M7 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Major | 1 | 2 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 2 | 2 |
| Minor | 1 | 2 | 2 | 1 | 0 | 2 | 2 | 1 | 2 | 2 | 2 | 2 |
| Dominant 7 | 1 | 2 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 1 | 0 |
| Diminished | 1 | 2 | 2 | 1 | 0 | 2 | 1 | 0 | 2 | 2 | 2 | 2 |
| Half-dim | 1 | 2 | 2 | 1 | 0 | 2 | 1 | 0 | 2 | 2 | 1 | 2 |

The parameter order of this table (which slot is which interval) is inferred from the differences between templates. The values themselves are exact.

## 4. Roman numerals / harmonic function

`CChordHeavy::HarmFuncIn(scale)` finds the chord root's scale degree, then picks a function index from the basic chord type (exact):

| Degree | Major chord | Minor chord | Other |
|---|---|---|---|
| 1 | I | Im | — |
| 2 | II | IIm | dim → IIdim |
| 3 | III | IIIm | — |
| 4 | IV | IVm | — |
| 5 | V | Vm | sus4 / sus2 → V |
| 6 | VI | VIm | — |
| 7 | — | — | dim → VIIdim |
| not in scale | undef | | |

`HarmFuncName` prints either Roman numerals (as above, plus `bVII`) or German function theory (Riemann), depending on a preference (exact strings):
T, t, DD / SP, Sp, S, s, D, d, TG or P, TP or sP = G, Tp or sp, SS or sp, VIIdim (in minor).
The variant depends on whether the active scale is major-like or minor-like (bitmask 0x8d4e over scale ids).

Fixed-do solfège tables are also present (`RomanString1–3 Ti/Si`, exact). The default is
Do Do Re Mi Mi Fa Fa Sol Sol La Ti Ti (or Si), with sharp- and flat-side variants per pitch class.

## 5. Key (harmonic centre) detection

Pipeline order, from the calls in `CHarmonicAnalyse::Analyse` (exact):

1. **Tonic progressions.** Search the chord sequence for these patterns, each with a weight (exact data from `CHarmAnlsProgressions::TonicProgressions`):

   | Weight | Key | Pattern (relative to the centre) |
   |---|---|---|
   | 9 | major | V7 → I |
   | 8 | major | V → I · I → IV · VIIdim → I · bII7 → I · IIm → V → I · VI → IIm → V → I |
   | 6 | major | IVm → V → I |
   | 10 | major | IV → IIm7b5 → I |
   | 4 | major | IV → IVm → I · IV → V → VIm · I → IV → IIm7b5 → I |
   | 8 | minor | IIm → V → Im · IIdim → V → Im |
   | 4 | minor | V → Im |

2. **Cadence progressions** (exact data from `CadenceProgressions`):
   8 major: VIm → IIm → V → I and IIm → V → I. 4 major: V → I and V → VIm. 2 major: IIm → V.
   8 minor: IIm → V → Im and IIdim → V → Im. 4 minor: V → Im.
3. **Centre-weight analysis** fills the regions still undecided (`CHarmCenterWeightAnalysis::DetectHarmCentersFromChords`, exact):
   - Candidates: 12 major keys, plus 12 minor keys when minor analysis is enabled.
   - For each chord, its duration is the next chord's start minus its own start; the last chord counts 1.0.
   - A key gets **+duration** if every chord tone lies in that key's scale.
     Major uses 0xab5 = 0 2 4 5 7 9 11. Minor uses 0x5ad = 0 2 3 5 7 8 10, the **natural** minor.
   - It gets **+10%** more if the chord root equals the key root, and another **+10%** if that chord is also the first or last chord.
   - Highest weight wins. Between parallel keys on the same root (C major vs C minor), a key whose plain tonic triad
     actually occurs beats one whose tonic triad doesn't. On equal weight, fewer key-signature accidentals is preferred.
     The final tie handling is partly inferred.
4. Adjacent identical centres are merged, and the overall key is the most frequent centre (`FindMostOccurentHarmCenter`).

How patterns are matched against chords (`_FindAndInsertHarmCentersUsing...`) is inferred in the port:
consecutive chords whose roots and templates match the pattern, with the highest weight winning.

## 6. Not exported

- The neural-network root finder's trained weights (Apple model data).
- Apple's lesson content, audio and video.
