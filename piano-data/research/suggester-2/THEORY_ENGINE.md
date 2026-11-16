# Theory engine

This file documents the music-theory engine of Suggester 2 (v6.2.1, build 153).

The engine is not Swift. It is a Kotlin Multiplatform library compiled with Kotlin/Native into `Suggester 2.app/Contents/Frameworks/MRMusicSuite.framework` (29 MB, arm64 + x86_64). Its Objective-C class prefix is `MR` (for example `MRChord`, `MRScale`). The SwiftUI front end in `DocumentEditor.framework` calls it through that Objective-C API.

Kotlin package names (exact, from symbols):

| Package | What it holds |
|---|---|
| `com.mathieurouthier.music2.interval` | `Interval` (46 entries), `GenericInterval` (Number1–Number13), `IntervalCache` |
| `com.mathieurouthier.music2.note` | `Note` (12 pitch classes), `NoteEx` (spelled notes, up to triple flats/sharps), `CastNote`, `CastNoteEx`, `NotationSystem` |
| `com.mathieurouthier.music2.chord` | `Chord`, `ChordType` (64), `ChordFormula`, `ChordRole`, `ChordClass`, `ChordCore`, `ChordSeventh`, `ChordSignature`, `ChordModifiers`, `ChordFormulaNameComponents` |
| `com.mathieurouthier.music2.chord.voicing` | `Voicing`, `ClosedVoicing`, `OpenVoicing`, `VoicingSettings` |
| `com.mathieurouthier.music2.chord.alteration` | `ChordAlterations` + sub groups (qualities, voicings, alt bass) |
| `com.mathieurouthier.music2.chord.reverselookup` | `KeyboardChordReverseLookup`, `GuitarChordReverseLookup` (chord detection) |
| `com.mathieurouthier.music2.scale` | `Scale`, `ScaleType` (31), `ScaleFormula`, `ScaleDegree` (36), `ChordPalette`, `ScalePalette`, `ScaleDetector`, `ScaleReverseLookup` |
| `com.mathieurouthier.music2.pattern` | `ClassicPattern`, `Degree`, `DegreeOfMajor`, `DiatonicTriad`, `DiatonicSeventh`, `Semitones`, `Diatonic` |
| `com.mathieurouthier.music2.formatter` | `ChordFormatter`, `RomanNumeralsFormatter`, `NoteFormatter`, `ScaleFormatter`, `FormulaFormatter`, … |
| `com.mathieurouthier.music2.reader` | `ChordReader`, `ScaleReader` (text input) |
| `com.mathieurouthier.music2.guitar` | tunings, chord-shape generator and scoring |
| `com.mathieurouthier.music2.arpeggio`, `.phrase`, `.midi` | playback phrase building, arpeggiator, humanisation, MIDI file writer |

How the data below was read (exact): the enum initialisers (`…$init_global#internal`) were decompiled with Ghidra 12.2 headless. Interval references are loads from the enum's `VALUES` array. Kotlin/Native sorts that array by entry name, so an offset `0x10 + 8·i` maps to the i-th name in alphabetical order. This mapping was checked against the Interval initialiser itself (for example `Perfect1` is stored at sorted index 40). All JSON tables live in `data/`.

## 1. Intervals

Source: `Interval.$init_global` (exact). 46 entries. `symbol` is the label the UI shows for that chord or scale member. `semitones` can be −1 (`Diminished1`). File: `data/intervals.json`.

| # | Name | Semitones | Generic | Symbol |
|---|---|---|---|---|
| 0 | Diminished1 | -1 | Number1 | ♭1 |
| 1 | Perfect1 | 0 | Number1 | 1 |
| 2 | Augmented1 | 1 | Number1 | ♯1 |
| 3 | Diminished2 | 0 | Number2 | ♭♭2 |
| 4 | Minor2 | 1 | Number2 | ♭2 |
| 5 | Major2 | 2 | Number2 | 2 |
| 6 | Augmented2 | 3 | Number2 | ♯2 |
| 7 | Diminished3 | 2 | Number3 | ♭♭3 |
| 8 | Minor3 | 3 | Number3 | ♭3 |
| 9 | Major3 | 4 | Number3 | 3 |
| 10 | Augmented3 | 5 | Number3 | ♯3 |
| 11 | Diminished4 | 4 | Number4 | ♭4 |
| 12 | Perfect4 | 5 | Number4 | 4 |
| 13 | Augmented4 | 6 | Number4 | ♯4 |
| 14 | Diminished5 | 6 | Number5 | ♭5 |
| 15 | Perfect5 | 7 | Number5 | 5 |
| 16 | Augmented5 | 8 | Number5 | ♯5 |
| 17 | Diminished6 | 7 | Number6 | ♭♭6 |
| 18 | Minor6 | 8 | Number6 | ♭6 |
| 19 | Major6 | 9 | Number6 | 6 |
| 20 | Augmented6 | 10 | Number6 | ♯6 |
| 21 | Diminished7 | 9 | Number7 | ♭♭7 |
| 22 | Minor7 | 10 | Number7 | ♭7 |
| 23 | Major7 | 11 | Number7 | 7 |
| 24 | Augmented7 | 12 | Number7 | ♯7 |
| 25 | Diminished8 | 11 | Number8 | ♭8 |
| 26 | Perfect8 | 12 | Number8 | 8 |
| 27 | Augmented8 | 13 | Number8 | ♯8 |
| 28 | Diminished9 | 12 | Number9 | ♭♭9 |
| 29 | Minor9 | 13 | Number9 | ♭9 |
| 30 | Major9 | 14 | Number9 | 9 |
| 31 | Augmented9 | 15 | Number9 | ♯9 |
| 32 | Diminished10 | 14 | Number10 | ♭♭10 |
| 33 | Minor10 | 15 | Number10 | ♭10 |
| 34 | Major10 | 16 | Number10 | 10 |
| 35 | Augmented10 | 17 | Number10 | ♯10 |
| 36 | Diminished11 | 16 | Number11 | ♭11 |
| 37 | Perfect11 | 17 | Number11 | 11 |
| 38 | Augmented11 | 18 | Number11 | ♯11 |
| 39 | Diminished12 | 18 | Number12 | ♭12 |
| 40 | Perfect12 | 19 | Number12 | 12 |
| 41 | Augmented12 | 20 | Number12 | ♯12 |
| 42 | Diminished13 | 19 | Number13 | ♭♭13 |
| 43 | Minor13 | 20 | Number13 | ♭13 |
| 44 | Major13 | 21 | Number13 | 13 |
| 45 | Augmented13 | 22 | Number13 | ♯13 |

## 2. Chord types (64)

Source: `ChordType.$init_global` (exact). Each entry is built as `ChordFormula(intervals, omittable)`. Perfect1 (the root) is implicit and never listed. `Omittable` lists intervals the engine may drop when it matches or voices the chord (exact second constructor argument; only 11th and 13th chords set it). Entries 61–63 are not chords: the same enum is used to tag song items (rest, section, text). File: `data/chords.json`.

The class column is inferred: the binary has a `ChordClass` enum with the names Triad, SuspendedTriad, Seventh, SuspendedSeventh, AddedNote, Extended, Dyad, Monad, Special (exact, with labels Triad/Triade, Suspended Triad, Seventh, Suspended Seventh, Added Note, Extended, Dyad, Monad, Special), but the per-type mapping getter was not decompiled.

| # | Enum name | Class (inferred) | Degrees | Semitones | Omittable |
|---|---|---|---|---|---|
| 0 | Major | Triad | 1 3 5 | 0 4 7 | — |
| 1 | Minor | Triad | 1 ♭3 5 | 0 3 7 | — |
| 2 | Diminished | Triad | 1 ♭3 ♭5 | 0 3 6 | — |
| 3 | Augmented | Triad | 1 3 ♯5 | 0 4 8 | — |
| 4 | Sus2 | SuspendedTriad | 1 2 5 | 0 2 7 | — |
| 5 | Sus4 | SuspendedTriad | 1 4 5 | 0 5 7 | — |
| 6 | Seventh | Seventh | 1 3 5 ♭7 | 0 4 7 10 | — |
| 7 | Minor7 | Seventh | 1 ♭3 5 ♭7 | 0 3 7 10 | — |
| 8 | Major7 | Seventh | 1 3 5 7 | 0 4 7 11 | — |
| 9 | MinorMajor7 | Seventh | 1 ♭3 5 7 | 0 3 7 11 | — |
| 10 | SeventhFlat5 | Seventh | 1 3 ♭5 ♭7 | 0 4 6 10 | — |
| 11 | HalfDiminished7 | Seventh | 1 ♭3 ♭5 ♭7 | 0 3 6 10 | — |
| 12 | Major7Flat5 | Seventh | 1 3 ♭5 7 | 0 4 6 11 | — |
| 13 | MinorMajor7Flat5 | Seventh | 1 ♭3 ♭5 7 | 0 3 6 11 | — |
| 14 | Diminished7 | Seventh | 1 ♭3 ♭5 ♭♭7 | 0 3 6 9 | — |
| 15 | Augmented7 | Seventh | 1 3 ♯5 ♭7 | 0 4 8 10 | — |
| 16 | AugmentedMajor7 | Seventh | 1 3 ♯5 7 | 0 4 8 11 | — |
| 17 | SeventhSus2 | SuspendedSeventh | 1 2 5 ♭7 | 0 2 7 10 | — |
| 18 | SeventhSus4 | SuspendedSeventh | 1 4 5 ♭7 | 0 5 7 10 | — |
| 19 | Major7sus2 | SuspendedSeventh | 1 2 5 7 | 0 2 7 11 | — |
| 20 | Major7sus4 | SuspendedSeventh | 1 4 5 7 | 0 5 7 11 | — |
| 21 | Ninth | Extended | 1 3 5 ♭7 9 | 0 4 7 10 14 | — |
| 22 | Minor9 | Extended | 1 ♭3 5 ♭7 9 | 0 3 7 10 14 | — |
| 23 | Major9 | Extended | 1 3 5 7 9 | 0 4 7 11 14 | — |
| 24 | MinorMajor9 | Extended | 1 ♭3 5 7 9 | 0 3 7 11 14 | — |
| 25 | SeventhFlat9 | Extended | 1 3 5 ♭7 ♭9 | 0 4 7 10 13 | — |
| 26 | MinorSeventhFlat9 | Extended | 1 ♭3 5 ♭7 ♭9 | 0 3 7 10 13 | — |
| 27 | MajorSeventhFlat9 | Extended | 1 3 5 7 ♭9 | 0 4 7 11 13 | — |
| 28 | MinorMajorSeventhFlat9 | Extended | 1 ♭3 5 7 ♭9 | 0 3 7 11 13 | — |
| 29 | SeventhSharp9 | Extended | 1 3 5 ♭7 ♯9 | 0 4 7 10 15 | — |
| 30 | MajorSeventhSharp9 | Extended | 1 3 5 7 ♯9 | 0 4 7 11 15 | — |
| 31 | SeventhFlat5Flat9 | Extended | 1 3 ♭5 ♭7 ♭9 | 0 4 6 10 13 | — |
| 32 | SeventhFlat5Sharp9 | Extended | 1 3 ♭5 ♭7 ♯9 | 0 4 6 10 15 | — |
| 33 | Augmented7Flat9 | Extended | 1 3 ♯5 ♭7 ♭9 | 0 4 8 10 13 | — |
| 34 | Augmented7Sharp9 | Extended | 1 3 ♯5 ♭7 ♯9 | 0 4 8 10 15 | — |
| 35 | Eleventh | Extended | 1 3 5 ♭7 9 11 | 0 4 7 10 14 17 | Perfect5, Major9 |
| 36 | Minor11 | Extended | 1 ♭3 5 ♭7 9 11 | 0 3 7 10 14 17 | Perfect5, Major9 |
| 37 | Major11 | Extended | 1 3 5 7 9 11 | 0 4 7 11 14 17 | Perfect5, Major9 |
| 38 | MinorMajor11 | Extended | 1 ♭3 5 7 9 11 | 0 3 7 11 14 17 | Perfect5, Major9 |
| 39 | NinthSharp11 | Extended | 1 3 5 ♭7 9 ♯11 | 0 4 7 10 14 18 | — |
| 40 | NinthFlat11 | Extended | 1 3 5 ♭7 9 ♭11 | 0 4 7 10 14 16 | — |
| 41 | Thirteenth | Extended | 1 3 5 ♭7 9 11 13 | 0 4 7 10 14 17 21 | Perfect5, Major9, Perfect11 |
| 42 | Minor13 | Extended | 1 ♭3 5 ♭7 9 11 13 | 0 3 7 10 14 17 21 | Perfect5, Major9, Perfect11 |
| 43 | Major13 | Extended | 1 3 5 7 9 11 13 | 0 4 7 11 14 17 21 | Perfect5, Major9, Perfect11 |
| 44 | MinorMajor13 | Extended | 1 ♭3 5 7 9 11 13 | 0 3 7 11 14 17 21 | Perfect5, Major9, Perfect11 |
| 45 | Add2 | AddedNote | 1 2 3 5 | 0 2 4 7 | — |
| 46 | MinorAdd2 | AddedNote | 1 2 ♭3 5 | 0 2 3 7 | — |
| 47 | Add4 | AddedNote | 1 3 4 5 | 0 4 5 7 | — |
| 48 | MinorAdd4 | AddedNote | 1 ♭3 4 5 | 0 3 5 7 | — |
| 49 | Sixth | AddedNote | 1 3 5 6 | 0 4 7 9 | — |
| 50 | Minor6 | AddedNote | 1 ♭3 5 6 | 0 3 7 9 | — |
| 51 | Add9 | AddedNote | 1 3 5 9 | 0 4 7 14 | — |
| 52 | MinorAdd9 | AddedNote | 1 ♭3 5 9 | 0 3 7 14 | — |
| 53 | Sixth9 | AddedNote | 1 3 5 6 9 | 0 4 7 9 14 | — |
| 54 | MinorSixth9 | AddedNote | 1 ♭3 5 6 9 | 0 3 7 9 14 | — |
| 55 | ItalianAugmented6 | Special | 1 3 ♯6 | 0 4 10 | — |
| 56 | FrenchAugmented6 | Special | 1 3 ♯4 ♯6 | 0 4 6 10 | — |
| 57 | GermanAugmented6 | Special | 1 3 5 ♯6 | 0 4 7 10 | — |
| 58 | Fifth | Dyad | 1 5 | 0 7 | — |
| 59 | Fourth | Dyad | 1 4 | 0 5 | — |
| 60 | Monad | Monad | 1 | 0 | — |
| 61 | Rest | (non-chord song item) | — | — | — |
| 62 | SongSection | (non-chord song item) | — | — | — |
| 63 | Text | (non-chord song item) | — | — | — |

### 2.1 Chord naming (symbols)

The UI name is built by `ChordFormatter` from `ChordFormulaNameComponents(coreName, coreSuperscriptName, extension, alterations, coreNameVerbose)` (exact class and field names). The name pieces found as string literals (exact):

| Piece | Literal(s) |
|---|---|
| Core symbols | `°` (diminished), `+` (augmented), `ø` (half-diminished), `sus`, `5`, `4`, `M7`, `add`, `no` |
| Extensions | `6`, `7`, `9`, `11`, `13`, `M9`, `M11`, `M13` |
| Alterations | `♭9`, `♯9`, and the interval symbols of table 1 (`♭5`, `♯5`, `♯11`, `♭11`, `♭13`, …) |
| Augmented sixths | `It`, `Fr`, `Gr` |
| Omission | `" (no1)"` for rootless chords |
| Verbose core names (used in the chord builder) | `major`/`majeur`, `minor`/`mineur`, `° / dim`, `+ / aug`, `single note`/`note seule`, `ø7 / m7♭5`, `°7 / dim7`, `+7 / aug7`, `+7♯9 / aug7♯9`, `+7♭9 / aug7♭9`, `+M7 / augM7` |
| Group headings in the chord builder | `Majeur`/`Major`, `Mineur`/`Minor`, `Dominant Seventh`/`Dominante septième`, `Minor Seventh`/`Mineur septième`, `Major Seventh`/`Majeur septième` |
| Bass | slash form `" / "` (alt bass, labelled `Alt. Bass` / `Basse alt.`) |

Other naming classes (exact names): `ChordSignature(chordCore, chordSeventh, coreNumber)` with `ChordCore` = Minor, Major, Suspended, Augmented, Diminished and `ChordSeventh` = Diminished, Minor, Major. `ChordSignature.appendAlterationStringForInterval` appends one alteration per interval that differs from the core.

Inferred: the suffix per chord type therefore follows common lead-sheet style: `C`, `Cm`, `C°`, `C+`, `Csus2`, `Csus4`, `C7`, `Cm7`, `CM7`, `CmM7`, `C7♭5`, `Cø` / `Cm7♭5`, `C°7`, `C+7`, `C+M7`, `C9`, `C7♭9`, `C7♯9`, `C11`, `C13`, `Cadd2`, `Cadd4`, `C6`, `Cm6`, `Cadd9`, `C6/9`, `C5`, `C4`, `It+6`/`Fr+6`/`Gr+6`. The exact concatenation order was not fully decoded.

### 2.2 Inversions, voicings, octave shift, rootless

Exact names and labels:

| Concept | Names / labels (en / fr) |
|---|---|
| Inversion labels | `Root position`/`position de base`, `1st inversion (b)` … `13th inversion (n)` (fr: `1ère inversion (b)` … `13ème inversion (m)`; note the French letters lag one step from the 7th inversion on — a bug in the strings). Short forms `1st`…`13th`. |
| Inversion arrows | `" ⇊"`, `" ↓"`, `" ↑"`, `" ⇈"`, `"↑"`, `"↓"` (octave/inversion shift badges) |
| Voicing | `Voicing` with `ClosedVoicing(signature, bassPosition)` and `OpenVoicing(signature)`; labels `Closed Voicing`/`Voicing fermé`, `Open Voicing`/`Voicing ouvert`, `Root Position`/`État fondamental`, `Default`/`Défaut` |
| Rootless | `Rootless`/`Sans racine`, `With root`/`Avec racine` |
| Octave shift | `Octave Shift`/`Décallage d'octave`, `OctaveValue(value)` |
| Inversion shift | `Inversion Shift`/`Décallage de renversement`, `InversionShift(value)` |
| Chord modifiers (global, applied to every suggested chord) | `ChordModifiers(octaveShift, inversionShift, arpeggiationOverride, rootless)`; panel title `Modifiers`/`Modificateurs` |
| Voicing settings | `extendTriads` = "Double the Root of Triads", `haveBass` = "Play Bass" (both default true) |

`ChordFormula.semitonePatternFor(Voicing)` returns `SemitonePattern(offsets, semitoneOffsetFromBassToRoot)` (exact). `ChordFormula.ComparisonType` = Strict, TolerateOmittedIntervals (exact): chord matching can ignore the omittable intervals.

### 2.3 Roman numerals

`RomanNumeralsFormatter` (exact functions: `romanNumeralComponentsFor`, `romanNumeralComponentsForSecondary`, `romanNumeralsComponentsForStandard`, `romanNumeralsForBasicTriadWith`, `romanNumeralExtensionFor`, output `RomanNumeralComponents(core, bottom, …)`). Rules read from the decompile (exact literals, logic summarised):

- Upper case for major-third triads, lower case otherwise (`romanNumeralsForBasicTriadWith` tests for a Major3).
- `°` is appended for diminished, `+` for augmented.
- The extension is the chord-name extension with a leading `M` removed (`removePrefix("M")`).
- Neapolitan → `N`.
- Augmented sixths → `It` `+` `6`, `Fr` `+` `6`, `Gr` `+` `6`.
- Secondary chords → `<numeral>/<target>` with `/` (the target is measured against the Ionian scale of the target root: `ScaleType.Ionian` appears in `romanNumeralComponentsForSecondary`).
- Tritone substitutes → prefix `sub`.
- Degree numerals come from `ScaleDegree` (table 4): `I`, `ii`, `♭VII`, `♯iv`, etc. Caret forms (`1̂`…`1̂2̂`) are used when showing a note's scale degree.

### 2.4 Note spelling

- `Note` = 12 pitch classes `C, CsDb, D, DsEb, E, F, FsGb, G, GsAb, A, AsBb, B` (exact).
- `NoteEx` = 49 spelled notes from `Cbbb` to `Bsss` (exact list in `data/enums.json`), each with a `Convenience` rating `Good, Acceptable, Bad, VeryBad` (exact enum).
- `Letter` = C D E F G A B; `Accidental` = Natural, Flat `♭`, Sharp `♯`, DoubleFlat `♭♭`, DoubleSharp `♯♯`, TripleFlat `♭♭♭`, TripleSharp `♯♯♯` (exact, with names "flat/bémol" etc.).
- `NotationSystem` = English (C D E…) or FixedDo (Do Re Mi Fa Sol La Si). Default English (exact).
- `Scale.mostConvenientScaleFor(note)` (exact control flow): for C, D, E, F, G, A, B the natural spelling is used. For the five black keys it builds the scale twice (flat-hinted and sharp-hinted spelling, `asNoteExHintFlat` / `asNoteExHintSharp`) and keeps the one with the lower convenience cost (a Double score; the score formula itself was not decoded).
- Setting `hideInconvenientEnharmonicScales` (default true) hides the worse enharmonic spelling in scale pickers; `simplifyAccidentals` simplifies double accidentals in display.


## 3. Scale types (31)

Source: `ScaleType.$init_global` (exact). Each entry is `Formula(intervals)` plus a localised title (`LocalizedString(en, fr)`). French titles are the literal stored right after each English title (exact strings; pairing by position). `Steps` is computed here from the semitones (derived). Custom scales are possible (`ScaleFormula(formula, title)`, labels `Custom`/`Personnalisé`, `Scale Name`/`Nom de la gamme`). File: `data/scales.json`.

Notes on specific entries (exact data, comments inferred):
- `Diminished` is the whole–half octatonic scale written as 1 2 ♭3 4 ♭5 ♭6 6 7.
- `Augmented` is the hexatonic 1 ♭3 3 5 ♯5 7.
- `AlteredDominant` is spelled 1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7 (the classic "super-locrian" spelling with ♭4 for the major third).
- `JazzMinor` = melodic minor ascending.
- The French title for Mixolydian is spelled `myxolydien` in the binary.

| # | Enum name | Title en | Title fr | Degrees | Semitones | Steps |
|---|---|---|---|---|---|---|
| 0 | Ionian | major | majeur | 1 2 3 4 5 6 7 | 0 2 4 5 7 9 11 | 2-2-1-2-2-2-1 |
| 1 | Aeolian | natural minor | mineur naturel | 1 2 ♭3 4 5 ♭6 ♭7 | 0 2 3 5 7 8 10 | 2-1-2-2-1-2-2 |
| 2 | Dorian | dorian | dorien | 1 2 ♭3 4 5 6 ♭7 | 0 2 3 5 7 9 10 | 2-1-2-2-2-1-2 |
| 3 | Phrygian | phrygian | phrygien | 1 ♭2 ♭3 4 5 ♭6 ♭7 | 0 1 3 5 7 8 10 | 1-2-2-2-1-2-2 |
| 4 | Lydian | lydian | lydien | 1 2 3 ♯4 5 6 7 | 0 2 4 6 7 9 11 | 2-2-2-1-2-2-1 |
| 5 | Mixolydian | mixolydian | myxolydien | 1 2 3 4 5 6 ♭7 | 0 2 4 5 7 9 10 | 2-2-1-2-2-1-2 |
| 6 | Locrian | locrian | locrien | 1 ♭2 ♭3 4 ♭5 ♭6 ♭7 | 0 1 3 5 6 8 10 | 1-2-2-1-2-2-2 |
| 7 | WholeTone | whole tone | unitonique | 1 2 3 ♯4 ♯5 ♭7 | 0 2 4 6 8 10 | 2-2-2-2-2-2 |
| 8 | HarmonicMinor | harmonic minor | mineur harmonique | 1 2 ♭3 4 5 ♭6 7 | 0 2 3 5 7 8 11 | 2-1-2-2-1-3-1 |
| 9 | JazzMinor | jazz minor | mineur jazz | 1 2 ♭3 4 5 6 7 | 0 2 3 5 7 9 11 | 2-1-2-2-2-2-1 |
| 10 | MinorBluesFlat5 | minor blues (♭5) | mineur blues (♭5) | 1 ♭3 4 ♭5 5 ♭7 | 0 3 5 6 7 10 | 3-2-1-1-3-2 |
| 11 | Prometheus | Prometheus | de Prométhée | 1 2 3 ♭5 6 ♭7 | 0 2 4 6 9 10 | 2-2-2-3-1-2 |
| 12 | Augmented | augmented | augmenté | 1 ♭3 3 5 ♯5 7 | 0 3 4 7 8 11 | 3-1-3-1-3-1 |
| 13 | Diminished | diminished | diminué | 1 2 ♭3 4 ♭5 ♭6 6 7 | 0 2 3 5 6 8 9 11 | 2-1-2-1-2-1-2-1 |
| 14 | HarmonicMajor | harmonic major | majeur harmonique | 1 2 3 4 5 ♭6 7 | 0 2 4 5 7 8 11 | 2-2-1-2-1-3-1 |
| 15 | HungarianMinor | hungarian minor | mineur hongrois | 1 2 ♭3 ♯4 5 ♭6 7 | 0 2 3 6 7 8 11 | 2-1-3-1-1-3-1 |
| 16 | PhrygianDominant | phrygian dominant | dominant phrygien | 1 ♭2 3 4 5 ♭6 ♭7 | 0 1 4 5 7 8 10 | 1-3-1-2-1-2-2 |
| 17 | NeapolitanMinor | neapolitan minor | mineur napolitain | 1 ♭2 ♭3 4 5 ♭6 7 | 0 1 3 5 7 8 11 | 1-2-2-2-1-3-1 |
| 18 | NeapolitanMajor | neapolitan major | majeur napolitain | 1 ♭2 ♭3 4 5 6 7 | 0 1 3 5 7 9 11 | 1-2-2-2-2-2-1 |
| 19 | Persian | persian | persien | 1 ♭2 3 4 ♭5 ♭6 7 | 0 1 4 5 6 8 11 | 1-3-1-1-2-3-1 |
| 20 | DoubleHarmonicMajor | double harmonic major | majeur harmonique double | 1 ♭2 3 4 5 ♭6 7 | 0 1 4 5 7 8 11 | 1-3-1-2-1-3-1 |
| 21 | AlteredDominant | altered dominant | dominant altéré | 1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7 | 0 1 3 4 6 8 10 | 1-2-1-2-2-2-2 |
| 22 | MajorBluesFlat3 | major blues (♭3) | majeur blues (♭3) | 1 2 ♭3 3 5 6 | 0 2 3 4 7 9 | 2-1-1-3-2-3 |
| 23 | MajorPentatonic | major pentatonic | pentatonique majeur | 1 2 3 5 6 | 0 2 4 7 9 | 2-2-3-2-3 |
| 24 | MinorPentatonic | minor pentatonic | pentatonique mineur | 1 ♭3 4 5 ♭7 | 0 3 5 7 10 | 3-2-2-3-2 |
| 25 | MajorBluesSharp2 | major blues (♯2) | majeur blues (♯2) | 1 2 ♯2 3 5 6 | 0 2 3 4 7 9 | 2-1-1-3-2-3 |
| 26 | MinorBluesSharp4 | minor blues (♯4) | mineur blues (♯4) | 1 ♭3 4 ♯4 5 ♭7 | 0 3 5 6 7 10 | 3-2-1-1-3-2 |
| 27 | AeolianDominant | aeolian dominant | dominant éolien | 1 2 3 4 5 ♭6 ♭7 | 0 2 4 5 7 8 10 | 2-2-1-2-1-2-2 |
| 28 | LocrianSharp2 | locrian (♯2) | locrien (♯2) | 1 2 ♭3 4 ♭5 ♭6 ♭7 | 0 2 3 5 6 8 10 | 2-1-2-1-2-2-2 |
| 29 | DorianSharp4 | dorian (♯4) | dorien (♯4) | 1 2 ♭3 ♯4 5 6 ♭7 | 0 2 3 6 7 9 10 | 2-1-3-1-2-1-2 |
| 30 | NeutralPentatonic | neutral pentatonic | pentatonique neutre | 1 2 4 5 ♭7 | 0 2 5 7 10 | 2-3-2-3-2 |

## 4. Scale degrees (36)

`ScaleDegree` (exact order): Tonic, SuperTonic, Mediant, SubDominant, Dominant, SubMediant, Leading, Eighth, Ninth, Tenth, Eleventh, Twelfth, then the same twelve with `Flat` prefix (FlatTonic … FlatTwelfth), then with `Sharp` prefix (SharpTonic … SharpTwelfth). Each has three display strings: caret form (`1̂`, `♭2̂`, …), upper-case numeral (`I`, `♭II`, …) and lower-case numeral (`i`, `♭ii`, …). File: `data/scale_degrees.json`. Note: the binary stores `♯12̂̂` (double combining caret) for SharpTwelfth — a typo in the data (exact).

## 5. Chord functions (roles)

`ChordRole` (exact order) with the exact construction rule found in the getters of `Chord` (`Chord#<get-secondaryDominant>` etc.) and in `Scale.ChromaticChords`. File: `data/chord_roles.json`.

| Role | en / fr label | Built from a target chord X (exact) |
|---|---|---|
| (none) | `None / Diatonic` / `Aucune / Diatonique` | — |
| SecondaryDominant | Secondary Dominant / Dominante secondaire — help `V/x` | root of X + Perfect5, type `Seventh` |
| SecondaryLeadingTone | Secondary Leading Tone / Sensible secondaire — help `vii°/x` | root of X + Major7, type `Diminished7` |
| Naepolitan (sic) | Naepolitan chord / Accord de sixte napolitaine | scale degree ♭II, type `Major` |
| Italian | Italian Sixth / Sixte italienne | degree ♭VI, type `ItalianAugmented6` |
| French | French Sixth / Sixte française | degree ♭VI, type `FrenchAugmented6` |
| German | German Sixth / Sixte allemande | degree ♭VI, type `GermanAugmented6` |
| TritoneSubstitution | Tritone Substitute / Substitut tritonique | only when X's type equals `Seventh` (else null): root moved by the semitones of one fixed `Interval` constant (a tritone, inferred); all other chord fields copied. If X already has role TritoneSubstitution (ordinal 6) the copy gets no role, otherwise it gets TritoneSubstitution — applying it twice toggles back (exact control flow). |
| TertiaryDominant | Tertiary Dominant / Dominante tertiaire — help `V/V/x` | root of X + Perfect5 + Perfect5, type `Seventh` |
| SecondarySupertonic | Secondary Supertonic / Sus-tonique secondaire — help `ii/x` | root of X + Major2, type `Minor7`; if X's chord type is `Minor` the code uses `Diminished7` instead (exact as decoded; musically one would expect half-diminished) |

The role is stored on the chord (`ChordV2.role`) and can be set by hand ("Set Function", label `Fonction`).

## 6. Chord suggestions (`ChordPalette`)

Entry point: `ChordPalette(scale)` (exact). It fills a `HashMap<Category, Group>`; the UI shows the groups in `Category` order. `Category` (exact order):

1. Triad
2. SuspendedTriad
3. Seventh
4. SuspendedSeventh
5. SecondaryDominant
6. TertiaryDominant
7. SecondarySupertonic
8. SecondaryLeadingTone
9. TritoneSubstitution
10. AddedNote
11. Extended
12. OtherChromatic
13. Dyad
14. Monad
15. Special

How each group is filled (exact control flow, details summarised):

- Diatonic groups (Triad … Monad except the chromatic ones): `ChordPalette.Companion.sequenceOfDiatonicChordsIn(scale)` yields every chord type rooted on every scale note whose notes all belong to the scale (`Scale#containsExactly(chord)`). Each chord goes into the group of its `ChordClass` (`Category.categoryFor(ChordClass)`). The code only accepts class ordinals 0–8 here.
- Chromatic groups come from `Scale.ChromaticChords(scale)`:
  - For each diatonic chord it computes `secondaryDominant`, `tertiaryDominant`, `secondarySupertonic`, `secondaryLeadingTone` (rules in §5) and adds each to the matching group.
  - It adds the Neapolitan (♭II Major, role Naepolitan) and the three augmented sixths on ♭VI.
  - For every note it takes `Note#<get-seventhChord>` (a `Seventh` chord on that note) and its `tritoneSubstitute`; those go to TritoneSubstitution.
  - `isSecondaryMember`, `isTertiaryMember`, `isChromaticMember` and `areAlike` deduplicate chords already present (same notes, ignoring voicing).
  - Neapolitan + augmented sixths + leftovers form `OtherChromatic` (label `Other Chromatic` / `Autre chromatique`).
- `Special` holds three fixed chord constants read from the `Chord` companion (offsets +8, +0x10, +0x18). Which chords they are was not resolved (inferred: the augmented-sixth family or the song-item pseudo chords).
- Groups are sorted with `ChordPalette.Group.sortedBy(…sortedByDescending)`; the sort key was not decoded.

UI-side (Swift, exact names): `SuggestionsState(includeSpecials, collectionState, dependencies{scale, chordModifiers, accessControl})`, `ChordCollectionSectionState(id, chordGroup, collapsed, collapsible)`. So each group is a collapsible section, `includeSpecials` toggles the Special group, and the global `ChordModifiers` are applied to every displayed chord. Locked chords are shown with a lock and the purchase invitation (`unlockCondition: (Int) -> Bool`).

Empty states (exact): "Suggestions are shown here when a scale is selected in the song." / "Not applicable for this scale".

### 6.1 Diatonic sets used by progressions

`pattern.Diatonic` (exact) is an object with 14 fields: `DiatonicTriad` on degrees I–VII (fields 1–7) and `DiatonicSeventh` on degrees I–VII (fields 8–14). `Scale#triadAt(degree, voicing, octave)` and `Scale#seventhChordWith(note, voicing, octave)` build them by stacking scale thirds, so quality follows the scale.

## 7. Alterations panel (`ChordAlterations`)

`ChordAlterations.Context(showCurrentChord, originalChord, scaleContext, precedingChord, instrumentClass, tuning, guitarDiagramSize, chordModifiers, accessControl)` (exact field list from `toString`). Tabs (exact `AlterationsState.AlterationTab`): **Qualities**, **Voicings**, **AltBass**, **Intervals**.

| Super group (exact class) | Sub groups (exact class → label) |
|---|---|
| `QualitiesAlterationSuperGroup` (`Qualities`/`Qualités`) | `CurrentChordAlterationSubGroup` → Current Chord; `DiatonicQualitiesAlterationSubGroup` → Diatonic; `SecondaryAndTertiaryQualitiesAlterationSubGroup` → Secondary and Tertiary; `TritoneSubstitutionQualitiesAlterationSubGroup` → Tritone Substitution; `ChromaticQualitiesAlterationSubGroup` → Chromatic |
| `VoicingsAlterationSuperGroup` (`Voicings`) | `ClosestVoicingToPrecedingChordAlterationSubGroup` → Closest Voicing to Preceding Chord; `ClosedVoicingsAlterationSubGroup` → Octave Shifts and Inversions / Closed Voicing; `OpenVoicingsAlterationSubGroup` → Open Voicings; `GuitarVoicingsAlterationSubGroup` → Other Chord Shapes |
| `AltBassAlterationSuperGroup` | `AltBassAlterationSubGroup` → Alternate Bass (`Basse alternative`) |

Each sub group has `title`, `items` and `isForReference` (exact getters).

Qualities: the root stays, the chord type changes (diatonic types that fit the scale, then secondary/tertiary, tritone, chromatic). Intervals tab: the user adds or removes single intervals (`Formula#copyByReplacingInterval`, `ChordIntervalsFormSections`). Error strings (exact): "don't specify Perfect1, it is implicit", "All slots are taken", "bonus intervals cannot be edited".

### 7.1 Voice leading ("Closest Voicing to Preceding Chord")

`ClosestVoicingToPrecedingChordAlterationSubGroup$1.invoke` (exact flow, summarised): it gathers candidates from the closed-voicing group (all inversions and octave shifts) plus `OpenVoicingsAlterationSubGroup`, renders each candidate (`CastNote.fromMIDI`, `semitonesUntil`) and measures the semitone distance to the preceding chord's notes (`getClosestVoicingAmongst.Candidate`). Candidates whose distance is below 20 (`0x14`) are kept and sorted closest first. Inferred: distance = sum of absolute semitone moves between matched voices.

## 8. Scale suggestions, borrowing and modulation

Swift side: `BorrowState(hostScaleDetermined, hostScale, scalePalette, suggestionsState)` and `ModulationState(destinationScale, scalePickerPresented, scalePalette, dependencies{sourceScale, settings})`. Engine side: `Scale#generateScalePaletteForBorrowing()` and `Scale#generateScalePaletteForModulation(ScaleSettings)` return `ScalePalette(contextScale, groups: [ScaleGroup])` (exact names; bodies are inlined into the Objective-C bridge and were not decompiled).

Group titles (exact en/fr): `Parallel Scale`/`Gamme parallèle`, `Relative Scale`/`Gamme relative`, `Dominant Scale`/`Gamme dominante`, `Subdominant Scale`/`Gamme sous-dominante`, `Parallel Modes`/`Modes parallèles`, `Parallel Scales`/`Gammes parallèles`, `Other Closely Related Scales`/`Autres gammes apparentées`.

Exact pieces: `Scale#getOtherCloselyRelatedScales(Boolean)` returns `[relativeScale, dominantScale, subdominantScale]` minus nulls; `Scale#isCloselyRelatedTo(Scale)` exists. Inferred meaning: parallel = same tonic, other type; relative = same notes, other tonic; dominant/subdominant = same type a fifth up/down.

Borrowing flow (UI): pick a host scale (`BorrowHostScaleSelectionView`), then the panel shows chord suggestions of the borrowed scale (`BorrowSuggestionsView`) — label `Borrowed Chord`. Modulation flow: `Pick the Source Scale` → `Pick the Destination Scale` → `Modulate`; when a new scale is set for the whole song the alert says "Would you like to set this new scale for the whole song? This will replace the song scale and delete all modulations." with buttons `Cancel` / `Replace Scale For Whole Song` (exact).

## 9. Detection

| Tool | Engine (exact) | Behaviour |
|---|---|---|
| Chord detector (keyboard) | `player2.detector.KeyboardChordDetector` → `KeyboardChordReverseLookup.internal_detectedChordsFrom`, `octaveShiftCorrectedFor` | Pressed keys (screen piano or MIDI in) → list of chords. Callbacks `keyboardChordDetectorDidDetect`, `…DidBecomeIdle`, `…DidFailToRecognizeInputWith(Int)`. Error text "This chord could not be identified." |
| Chord detector (guitar) | `GuitarChordReverseLookup.chordsFor(shape, tuning)`, `intervalCombinations`, `findMatchingChords`, results sorted "considering bass" then "disregarding bass" | Draw a shape on the fretboard → chords. |
| Melody scale detector | `KeyboardScaleDetector` → `ScaleReverseLookup.detectedScalesFrom(Set<MidiKeyValue>)` | Notes → every scale that contains them. "No scales were found." |
| Scale detector (from song chords) | `ScaleDetector.Companion.detectScalesWith(chords, show)`; `MatchedScale(scale, chords)` with `matchingRatio`; groups `Best Matches`/`Meilleurs résultats` and `All Results`/`Tous les résultats`; `Show` = Best, All | Sorted by matching ratio descending (exact comparator `sortByDescending`). |

Keyboard detection matches chord formulas with `ComparisonType.TolerateOmittedIntervals`, so a C13 without 5th/9th/11th is still found (inferred from the omittable lists).

## 10. Text input (Chord Reader / Scale Reader)

`ChordReader` returns `Result(chords, messages)`; `ScaleReader` returns `Result(scale, message)` (exact). Prompt (exact): "Type the name of the chords you want to add (A, Bm, G7, etc). Roman numerals will work too (I, ii, iii7, etc)." Recognised aliases (exact literals): `min`, `m7b5`, `hdim7`, `min7b5`, `Maj`, `mMaj`, `mM`, `minMaj`, `minM`, `aug`, `dim`, `hdim`, `7b5`, `#`, `b`, `N` (Neapolitan), `sub`, `/` (slash bass / secondary). Messages: `Unsupported`, `Unrecognized`, `Could not recognize "…"`, "roman numerals require a selected scale" (fr: "Les chiffres romains nécessitent qu'une gamme soit selectionnée").

## 11. Classic progressions

`ClassicPattern(title, items: List<ChordProvider>)`, `ClassicPatternGroup(title, items)` (exact). `ClassicPattern#generateChordsFor(scale, chordModifiers)` realises the steps in the current scale; a step that cannot be built in that scale returns null and the pattern is hidden or shown as not applicable (inferred). Step kinds: `DiatonicTriad`, `DiatonicSeventh`, `Degree(ScaleDegree, ChordType, voicing?, octave, role?, semitoneShift)`, `DegreeOfMajor(...)` (degree measured on the parallel major — used for modal mixture), `Semitones(n, ChordType)`. Full exact list: `data/classic_progressions.json`.

| Group | Progression | Steps (Roman, readable) |
|---|---|---|
| Basic Cadences / Cadences de base | Perfect Authentic Cadence | V – I |
| | Plagal Cadence | IV – I |
| | Minor Plagal Cadence | IV – iv – I |
| Popular / Populaire | 50's Progression | I – vi – IV – V |
| | Pop-Punk Progression | I – V – vi – IV |
| | Royal Road Progression | IV7 – V7 – iii7 – vi (diatonic sevenths) |
| | II–V–I Turnaround | ii – V – I |
| | V–IV-I Turnaround | V – IV – I |
| | I-VI-II-V | I – vi – ii – V |
| | 12 Bar Blues | I I I I IV IV I I V IV I I |
| Jazz | Jazz 251 | ii7 – V7 – I7 |
| | Jazz 251 Tritone Substitution | ii7 – subV7 – I7 |
| | Jazz I-VI-II-V | I7 – vi7 – ii7 – V7 |
| | Jazz III-VI-II-V | iii7 – vi7 – ii7 – V7 |
| | Jazz I-II-III-IV | I7 – ii7 – iii7 – vi7 (as decoded) |
| Andalusian / Andalous | Andalusian Cadence | i – ♭VII – ♭VI – V |
| | Retrograde Andalusian Cadence | V – ♭VI – ♭VII – i |
| | Super Mario Cadence | V – ♭VI – ♭VII – I |
| Augmented Sixth Resolution | Italian … Resolution | IV – It+6 – V |
| | French … Resolution | IV – Fr+6 – I – V |
| | German … Resolution | IV – Gr+6 – I – V |
| Others / Autres | Ragtime Progression | VI7 – II7 – V7 – I (semitone steps; values inferred) |
| | Backdoor Progression A | ii7 – ♭VII7 – I |
| | Backdoor Progression B | IV7 – ♭VII7 – I |
| | Root Movement Hotline | I7 – IV7 – vii7 – iii7 – vi7 – ii7 – V7 – I7 |
| Classical / Classique | Circle Progression | I – IV – vii – iii – vi – ii – V – I (vii, vi, V one octave down) |
| | Pachelbel's Canon | I – V – vi – iii – IV – I – IV – V |
| | Neapolitan Harmony | N (♭II) – V – I |

Empty state: "Classic chord progressions are shown here when a scale is selected in the song." The UI row (`ClassicProgressionRowView(pattern, isPlaying)`) previews the whole pattern and adds it to the song.

## 12. Transposition

`music2.transpose.Transposer` (exact). UI: `Transpose…`, `Transpose Section…`, `Transpose Song` with a semitone stepper (`TransposeSemitonesView(semitones, formatAccordingToSelectedScale, validRange)`), and per-item `Semitone Shift Up/Down`, `Octave Shift Up/Down`, `Invert Upward/Downward`.

## 13. Guitar and ukulele engine

- `GuitarChordShapeGenerator` explores fret positions (`Exploration.explore`, `considerCandidate`) and scores each `CastShape` with these score components (exact names, from `Scores.toString`): `badDroppedStringScore`, `acceptableDroppedStringScore`, `heightScore`, `fingerScore`, `pressedFretSpanScore`, `failedBarreScore`, `eleganceScore`, `voiceLeadingScore`, `monadScore`, `unisonScore`, `bestStandardBiasScore`, `global`. `bestChordShapeFor(chord)` returns the top shape; `chordShapesFor` returns all, sorted by score descending. Weights not decoded.
- `GuitarChordShapeStandards` biases toward standard open shapes (`bestStandardBiasScore`).
- `GuitarChordShapeFingering` with `Finger`, `Barre`, `Touch`; label `(BARRE …)`; `autoBarre` flag.
- `GuitarDiagramSize` = FourFrets, FiveFrets (default FourFrets).
- `GuitarStringType` = Steel, Nylon.
- Tunings (exact titles; string notes not decoded): Standard Tuning, Nashville Tuning, High-Strung Tuning, Half Step Down, Whole Step Down, Three Half Steps Down, Two Whole Steps Down, Capo 1–7, Drop D, Double Drop D, Drop C♯, Drop C, Drop B, Drop A♯, Drop A, Open A/B/C/D/E/F/G, Open Am/Bm/Cm/Dm/Em/Fm/Gm, Major Thirds, All Fourths, Lowered All Fourths, All Fifths, DADGAD, New Standard Tuning, Standard Ukulele, Ukulele D, Ukulele A♯, Baritone Ukulele, Ukulele Bass, Cigar Box Guitar G/E/D, Baroque, Bass, 5 Strings Bass, 7 Strings Guitar. Palette sections: Standard, Lowered, Capo, Dropped, Open, Open Minor, Regular, Others, 3 strings, 7 Strings. Custom tunings: "Custom Tuning"/"Accordage personnalisé".

## 14. What could not be read

- The chord-name concatenation order and the `ChordClass` mapping per type (inferred above).
- The scoring weights for guitar shapes and the convenience score for enharmonic spelling.
- The bodies of `generateScalePaletteForBorrowing/Modulation` and `detectScalesWith` (inlined into Objective-C bridge functions that were not decompiled).
- Tuning string notes (built in lazies not decompiled).
