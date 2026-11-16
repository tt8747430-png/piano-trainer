# Theory engine

Source of truth: the decompiled assembly `PianoCompanion.Engine.OSX.dll` (namespace `PianoCompanion.Engine.Services`), plus `PianoCompanion.dll` (`PianoCompanion.Helper`) and `Songtive.Engine.OSX.dll` (`Songtive.Services`: `Semitone`, `NoteService`, `AccidentalPosition`).
Every table below is generated from `data/*.json`, which `scripts` built from the decompiled C# and from `chord-detection.ts` (a line-by-line port).
"exact" = read in code (class / method named). "inferred" = my reading of intent or behaviour not proven by code.

Related files: [CHORD_DETECTION.md](CHORD_DETECTION.md) (recognition algorithms), `data/chords.json`, `data/scales.json`, `data/progressions.json`, `data/circle_of_fifths.json`, `data/localized_theory_names.json` (names in 41 locales, see LOCALISATION.md).

## 1. Architecture

| Item | Fact | Status |
|---|---|---|
| Live theory classes | `PianoCompanion.Engine.Services.ChordService`, `ScaleService`, `ChordSymbols`, `ChordNamer`, `ChordSuccessors`, `ProgressionPatterns`, `AbstractMode` subclasses | exact (`ContainerLoader.Init`, `AppDelegate` line ~505) |
| Legacy duplicate | `Songtive.Services.ChordService` / `ScaleService` (older engine in `Songtive.Engine.OSX.dll`). Registered only by `Songtive.Services.Container.Init`, which the app never calls. Only `Semitone`, `NoteService` (naming), `AccidentalPosition` from that assembly are used. | exact (no caller of `Container.Init` in PianoCompanion.dll) |
| Storage | `ILocalStorage` is registered as `null`, so chords come from `GenerateChords()` and scales from `InitScales()` in memory each launch. Custom chords/scales are therefore not persisted on macOS through this path. | exact (`AppDelegate`: `Register<ILocalStorage>(c => null)`) |
| Recent chords | LRU of 20 (`LruRecentItems<Chord>(20)`), saved in user defaults key `recent_chords` as `id,value,accidental,inversion;…` (accidental = AccidentalType int, -1 = none). | exact (`ChordService.InitRecentChords/SaveRecentChords`) |

## 2. Note model and spelling primitives

| Concept | Definition | Status |
|---|---|---|
| `Semitone` | Spelled pitch class. `Note` = natural pitch class of the letter (0,2,4,5,7,9,11). `Accidental` = null / Sharp / Flat (others possible). `Value` = sounding pitch class. Equality = same `Value` **and** same `Accidental`. | exact (`Semitone.Equals`) |
| `Semitone.Values` (21) | C♭ C C♯ D♭ D D♯ E♭ E E♯ F♭ F F♯ G♭ G G♯ A♭ A A♯ B♭ B B♯ | exact |
| `NotesWithSharpsFlats` (17) | C C♯ D♭ D D♯ E♭ E F F♯ G♭ G G♯ A♭ A A♯ B♭ B | exact |
| `NotesWithSharps` / `NotesWithFlats` | C C♯ D D♯ E F F♯ G G♯ A A♯ B / C D♭ D E♭ E F G♭ G A♭ A B♭ B | exact |
| `ParseNote(n, Sharp)` | naturals stay natural; black keys become sharps | exact |
| `AccidentalType` enum | Default 0, Sharp 1, Flat 2, Natural 4, DoubleFlat 8, DoubleSharp 16, TripleFlat 32, TripleSharp 64, QuadrupleFlat 128, QuadrupleSharp 256 | exact |
| `AccidentalPosition` | (Position = letter steps from C or from the root incl. octave×7, Accidental). `ToSemitone = pos/7*12 + staff[pos%7] + offset` | exact |
| Glyphs | FLAT "♭", SHARP "♯", DOUBLEFLAT "♭♭", DOUBLESHARP "x", triple flat "♭♭♭", triple sharp "♯x". ASCII form: ♭♭→bb, ♭→b, x→x, ♯→# | exact (`NoteService` static ctor, `NotesToAscii`) |
| Interval names | U m2 M2 m3 M3 P4 TT P5 m6 M6 m7 M7 P8 m9 M9 m10 M10 P11 TT8 P12 m13 M13 m14 M14 P15 m16 M16 m17 M18; sharp degrees print "A"+n, double-flat degrees "d"+n | exact (`NoteService.intervalNames`, `ToIntervalName`) |
| Notations | English C D E F G A B; Italian Do Re Mi Fa Sol La Si; French Do Ré Mi Fa Sol La Si; Russian До Ре Ми Фа Соль Ля Си; German C D E F G A H (flats Ces Des Es Fes Ges As B; sharps Cis Dis Eis Fis Gis Ais His); Japanese ハ ニ ホ ヘ ト イ ロ (嬰 sharp, 変 flat); Korean 도 레 미 파 솔 라 시; ChineseNumbers 一…七; Numbers 1…7. Parallel notation: Indian Hindustani (Sa Re Ga ma Pa Dha Ni; altered r g G M d dha n), relative to a user "Sa" position. | exact (`NoteService` static ctor, `Notation` enum) |
| Academic notation | `IsAcademicNotation` default true. When false, E♯→F, B♯→C, C♭→B, F♭→E (and double accidentals step down one). | exact (`TransformAcademicAccidental`) |

## 3. Chord dictionary

### 3.1 How the list is built (exact, `ChordService.GenerateChords`, `AddChord`, `GenerateDegrees`)

1. 51 `AddChord` calls create base chords in the order shown below.
2. A chord defined by a semitone `formula` gets `degrees` from `toNoteOnStaffIndex`: natural semitones map to a letter; altered semitones use the explicit accidental at that formula index (FlatAt / SharpAt).
3. A chord defined by `degrees` (ids 10, 11, 21) gets its formula from `NoteToSemitone`.
4. `MaxInversions = formula.Length - 1`.
5. Some base chords carry `Alts` flags. Each set flag creates a variant with `id = base*100 + n`, `n` counting in this fixed order: sus2 (formula[1]=2), sus4 (formula[1]=5), ♭5 (formula[2]−1, adds FlatAt(2)), ♯5 (formula[2]+1, adds SharpAt(2)), n7 (formula[3]=10, b7), ♭9 (formula[4]−1), ♯9 (formula[4]+1). Name gets " sus2", " sus4", " ⁻5" (plus ", ø" for id 20), " ⁺5", " 7", " ⁻9", " ⁺9"; shortName gets the same suffix without the space.
6. `ChordSymbols.RegisterBuiltIns` marks all generated ids as built-in.
7. Lists shown to the user (`FindChords`, search, reverse lookup) use `Id > 9 && !ChordSymbols.IsAlias(c)`.
8. `IsAlias`: ids 110 and 111, and any variant whose pitch-class set equals its base chord (for example "9 7" = 9). Result: 113 chords generated, **89 listed**.

### 3.2 Base chords (51) — exact

`degrees`: chord degree with accidental relative to the major scale of the root. `difficulty`: `ChordNamer.Difficulty`. Ids 1–9 are scale-function chords (I, IV, V, V7, VIm, IIm, III, III7, VII°7) with a root adjustment along the circle of fifths (`NoteService.getPositionFromCircleOf5ths`, offsets: IV −1, V +1, V7 +1, VIm 0 (minor circle), IIm −1, III +1, III7 +1, VII°7 +5). They are never listed.

| id | shortName | buttonName | English name | group | formula (semitones) | degrees | Intl symbol | difficulty | max inv. | listed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | I | I | Tonic | principal | 0,4,7 | 1 3 5 | — | — | 2 | no (id ≤ 9) |
| 2 | IV | IV | Sub-Dominant | principal | 0,4,7 | 1 3 5 | — | — | 2 | no (id ≤ 9) |
| 3 | V | V | Dominant | principal | 0,4,7 | 1 3 5 | — | — | 2 | no (id ≤ 9) |
| 4 | V7 | V7 | Dominant 7th | principal | 0,4,7,10 | 1 3 5 ♭7 | — | — | 3 | no (id ≤ 9) |
| 5 | VIm | VIm | Tonic | relativeminor | 0,3,7 | 1 ♭3 5 | — | — | 2 | no (id ≤ 9) |
| 6 | IIm | IIm | Sub-Dominant | relativeminor | 0,3,7 | 1 ♭3 5 | — | — | 2 | no (id ≤ 9) |
| 7 | III | III | Mediant | relativeminor | 0,3,7 | 1 ♭3 5 | — | — | 2 | no (id ≤ 9) |
| 8 | III7 | III7 | Mediant 7th | relativeminor | 0,3,7,10 | 1 ♭3 5 ♭7 | — | — | 3 | no (id ≤ 9) |
| 9 | VII°7 | VII°7 | Leading tone 7th | common_chords | 0,3,6,10 | 1 ♭3 ♭5 ♭7 | — | — | 3 | no (id ≤ 9) |
| 10 | M | M | Major | common_chords | 0,4,7 | 1 3 5 | (empty = major) | 0 | 2 | yes |
| 11 | m | m | Minor | common_chords | 0,3,7 | 1 ♭3 5 | m | 1 | 2 | yes |
| 12 | ° | ° | Diminished | common_chords | 0,3,6 | 1 ♭3 ♭5 | dim | 4 | 2 | yes |
| 13 | ⁺ | + | Augmented | common_chords | 0,4,8 | 1 3 ♯5 | + | 5 | 2 | yes |
| 14 | sus2 | sus2 | Suspended 2nd | common_chords | 0,2,7 | 1 2 5 | sus2 | 4 | 2 | yes |
| 15 | sus4 | sus4 | Suspended 4th | common_chords | 0,5,7 | 1 4 5 | sus4 | 3 | 2 | yes |
| 16 | ⁻5 | ⁻5 | Flat Fifth | common_chords | 0,4,6 | 1 3 ♭5 | (♭5) | 7 | 2 | yes |
| 100 | 5 | 5 | Fifth | common_chords | 0,7 | 1 5 | 5 | 1 | 1 | yes |
| 17 | 6 | 6 | Sixth | common_chords | 0,4,7,9 | 1 3 5 6 | 6 | 4 | 3 | yes |
| 18 | m6 | m6 | Minor 6th | common_chords | 0,3,7,9 | 1 ♭3 5 6 | m6 | 5 | 3 | yes |
| 19 | 7 | 7 | Seventh | common_chords | 0,4,7,10 | 1 3 5 ♭7 | 7 | 2 | 3 | yes |
| 20 | m7 | m7 | Minor 7th | common_chords | 0,3,7,10 | 1 ♭3 5 ♭7 | m7 | 3 | 3 | yes |
| 21 | °7 | °7 | Diminished 7th | common_chords | 0,3,6,9 | 1 ♭3 ♭5 ♭♭7 | dim7 | 5 | 3 | yes |
| 22 | M7 | M7 | Major 7th | common_chords | 0,4,7,11 | 1 3 5 7 | maj7 | 3 | 3 | yes |
| 23 | m,M7 | m,M7 | Minor, Major 7th | common_chords | 0,3,7,11 | 1 ♭3 5 7 | m(maj7) | 7 | 3 | yes |
| 24 | 7/6 | 7/6 | Seven-Six | common_chords | 0,4,7,9,10 | 1 3 5 6 ♭7 | 7(13) | 9 | 4 | yes |
| 104 | add9 | add9 | Added 9th | common_chords | 0,4,7,14 | 1 3 5 9 | add9 | 5 | 3 | yes |
| 105 | madd9 | madd9 | Minor Added 9th | common_chords | 0,3,7,14 | 1 ♭3 5 9 | m(add9) | 6 | 3 | yes |
| 25 | 9 | 9 | Ninth | ninths | 0,4,7,10,14 | 1 3 5 ♭7 9 | 9 | 6 | 4 | yes |
| 101 | M9 | M9 | Major Ninth | ninths | 0,4,7,11,14 | 1 3 5 7 9 | maj9 | 6 | 4 | yes |
| 26 | m9 | m9 | Minor Ninth | ninths | 0,3,7,10,14 | 1 ♭3 5 ♭7 9 | m9 | 6 | 4 | yes |
| 27 | ⁻9 | ⁻9 | Flat Ninth | ninths | 0,4,7,10,13 | 1 3 5 ♭7 ♭9 | 7♭9 | 9 | 4 | yes |
| 28 | m⁻9 | m⁻9 | Minor, Flat 9th | ninths | 0,3,7,10,13 | 1 ♭3 5 ♭7 ♭9 | m7♭9 | 9 | 4 | yes |
| 29 | 9⁺ | 9⁺ | Augmented Ninth | ninths | 0,4,7,10,15 | 1 3 5 ♭7 ♯9 | 7♯9 | 9 | 4 | yes |
| 30 | 9/6 | 9/6 | Nine-Six | ninths | 0,4,7,9,14 | 1 3 5 6 9 | 6/9 | 7 | 4 | yes |
| 31 | m9/6 | m9/6 | Minor Nine-Six | ninths | 0,3,7,9,14 | 1 ♭3 5 6 9 | m6/9 | 9 | 4 | yes |
| 106 | add11 | add11 | Added 11th | common_chords | 0,4,7,17 | 1 3 5 11 | add11 | 8 | 3 | yes |
| 107 | madd11 | madd11 | Minor Added 11th | common_chords | 0,3,7,17 | 1 ♭3 5 11 | m(add11) | 8 | 3 | yes |
| 32 | 11 | 11 | Eleventh | elevenths | 0,4,7,10,14,17 | 1 3 5 ♭7 9 11 | 11 | 10 | 5 | yes |
| 102 | M11 | M11 | Major 11th | elevenths | 0,4,7,11,14,17 | 1 3 5 7 9 11 | maj11 | 10 | 5 | yes |
| 33 | m11 | m11 | Minor Eleventh | elevenths | 0,3,7,10,14,17 | 1 ♭3 5 ♭7 9 11 | m11 | 10 | 5 | yes |
| 34 | 11⁺ | 11⁺ | Augmented 11th | elevenths | 0,4,7,10,14,18 | 1 3 5 ♭7 9 ♯11 | 9♯11 | 10 | 5 | yes |
| 35 | m11⁺ | m11⁺ | Minor Augm. 11th | elevenths | 0,3,7,10,14,18 | 1 ♭3 5 ♭7 9 ♯11 | m9♯11 | 10 | 5 | yes |
| 110 | 11sus | 11sus | 11th Suspended, 9sus4 | elevenths | 0,7,10,14,17 | 1 5 ♭7 9 11 | 9sus4 | 9 | 4 | no (alias) |
| 108 | add13 | add13 | Added 13th | common_chords | 0,4,7,21 | 1 3 5 13 | add13 | 8 | 3 | yes |
| 109 | madd13 | madd13 | Minor Added 13th | common_chords | 0,3,7,21 | 1 ♭3 5 13 | m(add13) | 8 | 3 | yes |
| 36 | 13 | 13 | Thirteenth | thirteenths | 0,4,7,10,14,17,21 | 1 3 5 ♭7 9 11 13 | 13 | 11 | 6 | yes |
| 103 | M13 | M13 | Major 13th | thirteenths | 0,4,7,11,14,17,21 | 1 3 5 7 9 11 13 | maj13 | 11 | 6 | yes |
| 37 | m13 | m13 | Minor Thirteenth | thirteenths | 0,3,7,10,14,17,21 | 1 ♭3 5 ♭7 9 11 13 | m13 | 11 | 6 | yes |
| 38 | 13#11 | 13#11 | 13th Augm. 11th | thirteenths | 0,4,7,10,14,18,21 | 1 3 5 ♭7 9 ♯11 13 | 13♯11 | 11 | 6 | yes |
| 39 | m13#11 | m13#11 | Min. 13th Augm. 11th | thirteenths | 0,3,7,10,14,18,21 | 1 ♭3 5 ♭7 9 ♯11 13 | m13♯11 | 11 | 6 | yes |
| 111 | 11sus#13 | 11sus#13 | 11th Suspended, Sharp 13th | thirteenths | 0,7,10,14,17,22 | 1 5 ♭7 9 11 ♯13 | 9sus4 | 9 | 5 | no (alias) |

### 3.3 Generated variants (62) — exact

| id | base | shortName | English name | formula | degrees | Intl | Jazz | difficulty | listed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1900 | 19 | 7sus2 | Seventh sus2 | 0,2,7,10 | 1 2 5 ♭7 | 7sus2 | 7sus2 | 10 | yes |
| 1901 | 19 | 7sus4 | Seventh sus4 | 0,5,7,10 | 1 4 5 ♭7 | 7sus4 | 7sus4 | 5 | yes |
| 1902 | 19 | 7⁻5 | Seventh ⁻5 | 0,4,6,10 | 1 3 ♭5 ♭7 | 7♭5 | 7♭5 | 10 | yes |
| 1903 | 19 | 7⁺5 | Seventh ⁺5 | 0,4,8,10 | 1 3 ♯5 ♭7 | 7♯5 | 7♯5 | 10 | yes |
| 2000 | 20 | m7⁻5 | Minor 7th ⁻5, ø | 0,3,6,10 | 1 ♭3 ♭5 ♭7 | m7♭5 | ø7 | 5 | yes |
| 2001 | 20 | m7⁺5 | Minor 7th ⁺5 | 0,3,8,10 | 1 ♭3 ♯5 ♭7 | m7♯5 | −7♯5 | 10 | yes |
| 2200 | 22 | M7sus2 | Major 7th sus2 | 0,2,7,11 | 1 2 5 7 | maj7sus2 | Δ7sus2 | 10 | yes |
| 2201 | 22 | M7sus4 | Major 7th sus4 | 0,5,7,11 | 1 4 5 7 | maj7sus4 | Δ7sus4 | 10 | yes |
| 2202 | 22 | M7⁻5 | Major 7th ⁻5 | 0,4,6,11 | 1 3 ♭5 7 | maj7♭5 | Δ7♭5 | 10 | yes |
| 2203 | 22 | M7⁺5 | Major 7th ⁺5 | 0,4,8,11 | 1 3 ♯5 7 | maj7♯5 | Δ7♯5 | 10 | yes |
| 2300 | 23 | m,M7⁻5 | Minor, Major 7th ⁻5 | 0,3,6,11 | 1 ♭3 ♭5 7 | m(maj7,♭5) | −Δ7♭5 | 10 | yes |
| 2301 | 23 | m,M7⁺5 | Minor, Major 7th ⁺5 | 0,3,8,11 | 1 ♭3 ♯5 7 | m(maj7,♯5) | −Δ7♯5 | 10 | yes |
| 2500 | 25 | 9sus4 | Ninth sus4 | 0,5,7,10,14 | 1 4 5 ♭7 9 | 9sus4 | 9sus4 | 11 | yes |
| 2501 | 25 | 9⁻5 | Ninth ⁻5 | 0,4,6,10,14 | 1 3 ♭5 ♭7 9 | 9♭5 | 9♭5 | 11 | yes |
| 2502 | 25 | 9⁺5 | Ninth ⁺5 | 0,4,8,10,14 | 1 3 ♯5 ♭7 9 | 9♯5 | 9♯5 | 11 | yes |
| 2503 | 25 | 97 | Ninth 7 | 0,4,7,10,14 | 1 3 5 ♭7 9 | 9 | 9 | 11 | no (alias) |
| 2600 | 26 | m9⁻5 | Minor Ninth ⁻5 | 0,3,6,10,14 | 1 ♭3 ♭5 ♭7 9 | m9♭5 | ø9 | 11 | yes |
| 2601 | 26 | m9⁺5 | Minor Ninth ⁺5 | 0,3,8,10,14 | 1 ♭3 ♯5 ♭7 9 | m9♯5 | −9♯5 | 11 | yes |
| 2602 | 26 | m97 | Minor Ninth 7 | 0,3,7,10,14 | 1 ♭3 5 ♭7 9 | m9 | −9 | 11 | no (alias) |
| 2700 | 27 | ⁻9sus4 | Flat Ninth sus4 | 0,5,7,10,13 | 1 4 5 ♭7 ♭9 | 7sus4(♭9) | 7sus4(♭9) | 11 | yes |
| 2701 | 27 | ⁻9⁻5 | Flat Ninth ⁻5 | 0,4,6,10,13 | 1 3 ♭5 ♭7 ♭9 | 7(♭5,♭9) | 7(♭5,♭9) | 11 | yes |
| 2702 | 27 | ⁻9⁺5 | Flat Ninth ⁺5 | 0,4,8,10,13 | 1 3 ♯5 ♭7 ♭9 | 7(♯5,♭9) | 7(♯5,♭9) | 11 | yes |
| 2703 | 27 | ⁻97 | Flat Ninth 7 | 0,4,7,10,13 | 1 3 5 ♭7 ♭9 | 7♭9 | 7♭9 | 11 | no (alias) |
| 2800 | 28 | m⁻9⁻5 | Minor, Flat 9th ⁻5 | 0,3,6,10,13 | 1 ♭3 ♭5 ♭7 ♭9 | m7(♭5,♭9) | ø7♭9 | 11 | yes |
| 2801 | 28 | m⁻9⁺5 | Minor, Flat 9th ⁺5 | 0,3,8,10,13 | 1 ♭3 ♯5 ♭7 ♭9 | m7(♯5,♭9) | −7(♯5,♭9) | 11 | yes |
| 2802 | 28 | m⁻97 | Minor, Flat 9th 7 | 0,3,7,10,13 | 1 ♭3 5 ♭7 ♭9 | m7♭9 | −7♭9 | 11 | no (alias) |
| 2900 | 29 | 9⁺sus4 | Augmented Ninth sus4 | 0,5,7,10,15 | 1 4 5 ♭7 ♯9 | 7sus4(♯9) | 7sus4(♯9) | 11 | yes |
| 2901 | 29 | 9⁺⁻5 | Augmented Ninth ⁻5 | 0,4,6,10,15 | 1 3 ♭5 ♭7 ♯9 | 7(♭5,♯9) | 7(♭5,♯9) | 11 | yes |
| 2902 | 29 | 9⁺⁺5 | Augmented Ninth ⁺5 | 0,4,8,10,15 | 1 3 ♯5 ♭7 ♯9 | 7(♯5,♯9) | 7(♯5,♯9) | 11 | yes |
| 2903 | 29 | 9⁺7 | Augmented Ninth 7 | 0,4,7,10,15 | 1 3 5 ♭7 ♯9 | 7♯9 | 7♯9 | 11 | no (alias) |
| 3200 | 32 | 11⁻5 | Eleventh ⁻5 | 0,4,6,10,14,17 | 1 3 ♭5 ♭7 9 11 | 11♭5 | 11♭5 | 12 | yes |
| 3201 | 32 | 11⁺5 | Eleventh ⁺5 | 0,4,8,10,14,17 | 1 3 ♯5 ♭7 9 11 | 11♯5 | 11♯5 | 12 | yes |
| 3202 | 32 | 117 | Eleventh 7 | 0,4,7,10,14,17 | 1 3 5 ♭7 9 11 | 11 | 11 | 12 | no (alias) |
| 3203 | 32 | 11⁻9 | Eleventh ⁻9 | 0,4,7,10,13,17 | 1 3 5 ♭7 ♭9 11 | 11♭9 | 11♭9 | 12 | yes |
| 3204 | 32 | 11⁺9 | Eleventh ⁺9 | 0,4,7,10,15,17 | 1 3 5 ♭7 ♯9 11 | 11♯9 | 11♯9 | 12 | yes |
| 3300 | 33 | m11⁻5 | Minor Eleventh ⁻5 | 0,3,6,10,14,17 | 1 ♭3 ♭5 ♭7 9 11 | m11♭5 | ø11 | 12 | yes |
| 3301 | 33 | m11⁺5 | Minor Eleventh ⁺5 | 0,3,8,10,14,17 | 1 ♭3 ♯5 ♭7 9 11 | m11♯5 | −11♯5 | 12 | yes |
| 3302 | 33 | m117 | Minor Eleventh 7 | 0,3,7,10,14,17 | 1 ♭3 5 ♭7 9 11 | m11 | −11 | 12 | no (alias) |
| 3303 | 33 | m11⁻9 | Minor Eleventh ⁻9 | 0,3,7,10,13,17 | 1 ♭3 5 ♭7 ♭9 11 | m11♭9 | −11♭9 | 12 | yes |
| 3400 | 34 | 11⁺⁺5 | Augmented 11th ⁺5 | 0,4,8,10,14,18 | 1 3 ♯5 ♭7 9 ♯11 | 9(♯5,♯11) | 9(♯5,♯11) | 12 | yes |
| 3401 | 34 | 11⁺7 | Augmented 11th 7 | 0,4,7,10,14,18 | 1 3 5 ♭7 9 ♯11 | 9♯11 | 9♯11 | 12 | no (alias) |
| 3402 | 34 | 11⁺⁻9 | Augmented 11th ⁻9 | 0,4,7,10,13,18 | 1 3 5 ♭7 ♭9 ♯11 | 7(♭9,♯11) | 7(♭9,♯11) | 12 | yes |
| 3403 | 34 | 11⁺⁺9 | Augmented 11th ⁺9 | 0,4,7,10,15,18 | 1 3 5 ♭7 ♯9 ♯11 | 7(♯9,♯11) | 7(♯9,♯11) | 12 | yes |
| 3500 | 35 | m11⁺⁺5 | Minor Augm. 11th ⁺5 | 0,3,8,10,14,18 | 1 ♭3 ♯5 ♭7 9 ♯11 | m9(♯5,♯11) | −9(♯5,♯11) | 12 | yes |
| 3501 | 35 | m11⁺7 | Minor Augm. 11th 7 | 0,3,7,10,14,18 | 1 ♭3 5 ♭7 9 ♯11 | m9♯11 | −9♯11 | 12 | no (alias) |
| 3502 | 35 | m11⁺⁻9 | Minor Augm. 11th ⁻9 | 0,3,7,10,13,18 | 1 ♭3 5 ♭7 ♭9 ♯11 | m7(♭9,♯11) | −7(♭9,♯11) | 12 | yes |
| 3600 | 36 | 13⁻5 | Thirteenth ⁻5 | 0,4,6,10,14,17,21 | 1 3 ♭5 ♭7 9 11 13 | 13♭5 | 13♭5 | 13 | yes |
| 3601 | 36 | 13⁺5 | Thirteenth ⁺5 | 0,4,8,10,14,17,21 | 1 3 ♯5 ♭7 9 11 13 | 13♯5 | 13♯5 | 13 | yes |
| 3602 | 36 | 137 | Thirteenth 7 | 0,4,7,10,14,17,21 | 1 3 5 ♭7 9 11 13 | 13 | 13 | 13 | no (alias) |
| 3603 | 36 | 13⁻9 | Thirteenth ⁻9 | 0,4,7,10,13,17,21 | 1 3 5 ♭7 ♭9 11 13 | 13♭9 | 13♭9 | 13 | yes |
| 3604 | 36 | 13⁺9 | Thirteenth ⁺9 | 0,4,7,10,15,17,21 | 1 3 5 ♭7 ♯9 11 13 | 13♯9 | 13♯9 | 13 | yes |
| 3700 | 37 | m13⁻5 | Minor Thirteenth ⁻5 | 0,3,6,10,14,17,21 | 1 ♭3 ♭5 ♭7 9 11 13 | m13♭5 | ø13 | 13 | yes |
| 3701 | 37 | m13⁺5 | Minor Thirteenth ⁺5 | 0,3,8,10,14,17,21 | 1 ♭3 ♯5 ♭7 9 11 13 | m13♯5 | −13♯5 | 13 | yes |
| 3702 | 37 | m137 | Minor Thirteenth 7 | 0,3,7,10,14,17,21 | 1 ♭3 5 ♭7 9 11 13 | m13 | −13 | 13 | no (alias) |
| 3703 | 37 | m13⁻9 | Minor Thirteenth ⁻9 | 0,3,7,10,13,17,21 | 1 ♭3 5 ♭7 ♭9 11 13 | m13♭9 | −13♭9 | 13 | yes |
| 3800 | 38 | 13#11⁺5 | 13th Augm. 11th ⁺5 | 0,4,8,10,14,18,21 | 1 3 ♯5 ♭7 9 ♯11 13 | 13(♯5,♯11) | 13(♯5,♯11) | 13 | yes |
| 3801 | 38 | 13#117 | 13th Augm. 11th 7 | 0,4,7,10,14,18,21 | 1 3 5 ♭7 9 ♯11 13 | 13♯11 | 13♯11 | 13 | no (alias) |
| 3802 | 38 | 13#11⁻9 | 13th Augm. 11th ⁻9 | 0,4,7,10,13,18,21 | 1 3 5 ♭7 ♭9 ♯11 13 | 13(♭9,♯11) | 13(♭9,♯11) | 13 | yes |
| 3803 | 38 | 13#11⁺9 | 13th Augm. 11th ⁺9 | 0,4,7,10,15,18,21 | 1 3 5 ♭7 ♯9 ♯11 13 | 13(♯9,♯11) | 13(♯9,♯11) | 13 | yes |
| 3900 | 39 | m13#11⁻5 | Min. 13th Augm. 11th ⁻5 | 0,3,6,10,14,18,21 | 1 ♭3 ♭5 ♭7 9 ♯11 13 | m13(♭5,♯11) | ø13♯11 | 12 | yes |
| 3901 | 39 | m13#117 | Min. 13th Augm. 11th 7 | 0,3,7,10,14,18,21 | 1 ♭3 5 ♭7 9 ♯11 13 | m13♯11 | −13♯11 | 13 | no (alias) |
| 3902 | 39 | m13#11⁻9 | Min. 13th Augm. 11th ⁻9 | 0,3,7,10,13,18,21 | 1 ♭3 5 ♭7 ♭9 ♯11 13 | m13(♭9,♯11) | −13(♭9,♯11) | 13 | yes |

### 3.4 Groups (exact, `ChordGroup`)

| Name | ShiftLastNotes | Used for |
|---|---|---|
| principal | 0 | ids 1–4 |
| relativeminor | 0 | ids 5–8 |
| common_chords | 0 | triads, 6ths, 7ths, add chords |
| triads | 0 | filter section name |
| sevenths | 1 | scale chord section |
| ninths | 2 | 9th chords |
| elevenths | 3 | 11th chords |
| thirteenths | 4 | 13th chords |
| secondary_dominant, secondary_leading_tone, parallel_mode, other | 0 | sections of chords-in-scale |

### 3.5 Quality tests and filters (exact, `Chord`, `ChordService.IsFilteredChord`, `ChordsFilterMode`)

| Test | Rule (degree positions are 0-based letters: 2 = 3rd, 4 = 5th, 6 = 7th, 8 = 9th, 10 = 11th, 12 = 13th) |
|---|---|
| IsMajor | natural 3rd and natural 5th |
| IsMinor | ♭3 and natural 5th |
| IsDiminished | ♭3 and ♭5 |
| IsAugmented | natural 3rd and ♯5 |
| IsCommon | any of the four above |
| Filter Major/Minor/Diminished/Augmented | same tests |
| Filter Sevenths / Ninths / Elevenths / Thirteenths (dictionary) | has a degree at 6 / 8 / 10 / 12 with any accidental |
| Same filters in reverse lookup (`findChordByFormulaPart`) | has that degree with a **natural** accidental only (so m7, 7, ♭9 chords are excluded from "Sevenths" there) |
| `ChordsFilterMode` values | Major 2, Minor 4, Diminished 8, Augmented 16, Triads 30, Sevenths 32, Ninenths 64, Elevenths 128, Thirteenths 256, All 510 |
| Segmented control order (`ChordsViewController`) | 0 All, 1 Major, 2 Minor, 3 Diminished, 4 Augmented, 5 Sevenths, 6 Ninths, 7 Elevenths, 8 Thirteenths |

## 4. Chord symbols (exact, `ChordSymbols`)

### 4.1 Styles

`ChordSymbolStyle`: Automatic, International, Jazz, French, Asian, Brazilian. `Automatic` resolves (`ChordSymbols.Resolve`): onboarding genres contain "jazz" → Jazz; else app language fr → French; ja, ko, zh → Asian; pt → Brazilian; otherwise International. Default static value `Current = International`.

### 4.2 Rendering rules

1. Look up `Table[id]`; core text for the style plus fixed tensions (16 → "♭5", 27 → "♭9", 28 → "♭9", 29 → "♯9", 34/35/38/39 → "♯11").
2. Variant ids (≥ 1000): compute the alteration against the base row: missing 5 + extra ♭5 → "♭5"; 5→♯5 "♯5"; 3→2 "sus2"; 3→4 "sus4"; 9→♭9 "♭9" (core "…9" becomes "…7"); 9→♯9 "♯9". sus is inserted before any "(". Anything else falls back to the plain shortName (⁻→♭, ⁺→♯).
3. Tensions are sorted by degree number, then ♭ < natural < ♯.
4. Jazz: a core starting "−<digit>" with a ♭5 tension becomes "ø<digit>" and the ♭5 is dropped (m7♭5 → ø7).
5. No tensions → core. Empty core → "(t1,t2)". Core ending ")" merges tensions inside. One tension after a core ending in a digit (not sus) is appended without parentheses in International and Jazz (C7♭9); French, Asian and Brazilian always use parentheses.
6. Full name = root name + gap + symbol. Gap is a space only when root ends in a digit and the symbol starts with one, or when the root has ≥ 2 letters ending in a lower-case letter and the symbol starts with add / sus / dim / aug (solfège names: "Do sus4").
7. Slash: `name + "/" + bass`; "6/9" is rewritten "6(9)" first.
8. Roman quality (`RomanQuality`): {0,3,6} "°", {0,3,6,9} "°7", {0,3,6,10} "ø7", {0,4,8} "+", otherwise the symbol with a leading "m"/"−" removed and the numeral lower-cased for minor-type chords.
9. Long names are cleaned for display (`CleanLongName`): markup removed, ⁻→♭, ⁺→♯, "Augm."→"Augmented", "Min."→"Minor", "-5"→"♭5", "+5"→"♯5" before digits.

### 4.3 Symbol for every listed chord in every style (∅ = empty, i.e. plain major)

| id | International | Jazz | French | Asian | Brazilian |
| --- | --- | --- | --- | --- | --- |
| 10 | ∅ | ∅ | ∅ | ∅ | ∅ |
| 11 | m | − | m | m | m |
| 12 | dim | ° | dim | dim | ° |
| 13 | + | + | 5+ | aug | 5+ |
| 14 | sus2 | sus2 | sus2 | sus2 | sus2 |
| 15 | sus4 | sus4 | sus4 | sus4 | sus4 |
| 16 | (♭5) | (♭5) | (♭5) | (♭5) | (♭5) |
| 100 | 5 | 5 | 5 | 5 | 5 |
| 17 | 6 | 6 | 6 | 6 | 6 |
| 18 | m6 | −6 | m6 | m6 | m6 |
| 19 | 7 | 7 | 7 | 7 | 7 |
| 1900 | 7sus2 | 7sus2 | 7sus2 | 7sus2 | 7sus2 |
| 1901 | 7sus4 | 7sus4 | 7sus4 | 7sus4 | 7sus4 |
| 1902 | 7♭5 | 7♭5 | 7(♭5) | 7(♭5) | 7(♭5) |
| 1903 | 7♯5 | 7♯5 | 7(♯5) | 7(♯5) | 7(♯5) |
| 20 | m7 | −7 | m7 | m7 | m7 |
| 2000 | m7♭5 | ø7 | m7(♭5) | m7(♭5) | m7(♭5) |
| 2001 | m7♯5 | −7♯5 | m7(♯5) | m7(♯5) | m7(♯5) |
| 21 | dim7 | °7 | dim7 | dim7 | °7 |
| 22 | maj7 | Δ7 | 7M | M7 | 7M |
| 2200 | maj7sus2 | Δ7sus2 | 7Msus2 | M7sus2 | 7Msus2 |
| 2201 | maj7sus4 | Δ7sus4 | 7Msus4 | M7sus4 | 7Msus4 |
| 2202 | maj7♭5 | Δ7♭5 | 7M(♭5) | M7(♭5) | 7M(♭5) |
| 2203 | maj7♯5 | Δ7♯5 | 7M(♯5) | M7(♯5) | 7M(♯5) |
| 23 | m(maj7) | −Δ7 | m7M | mM7 | m7M |
| 2300 | m(maj7,♭5) | −Δ7♭5 | m7M(♭5) | mM7(♭5) | m7M(♭5) |
| 2301 | m(maj7,♯5) | −Δ7♯5 | m7M(♯5) | mM7(♯5) | m7M(♯5) |
| 24 | 7(13) | 7(13) | 7(13) | 7(13) | 7(13) |
| 104 | add9 | add9 | add9 | add9 | (9) |
| 105 | m(add9) | −(add9) | m(add9) | madd9 | m(9) |
| 25 | 9 | 9 | 9 | 9 | 7(9) |
| 2500 | 9sus4 | 9sus4 | 9sus4 | 9sus4 | 7sus4(9) |
| 2501 | 9♭5 | 9♭5 | 9(♭5) | 9(♭5) | 7(♭5,9) |
| 2502 | 9♯5 | 9♯5 | 9(♯5) | 9(♯5) | 7(♯5,9) |
| 101 | maj9 | Δ9 | 7M(9) | M9 | 7M(9) |
| 26 | m9 | −9 | m9 | m9 | m7(9) |
| 2600 | m9♭5 | ø9 | m9(♭5) | m9(♭5) | m7(♭5,9) |
| 2601 | m9♯5 | −9♯5 | m9(♯5) | m9(♯5) | m7(♯5,9) |
| 27 | 7♭9 | 7♭9 | 7(♭9) | 7(♭9) | 7(♭9) |
| 2700 | 7sus4(♭9) | 7sus4(♭9) | 7sus4(♭9) | 7sus4(♭9) | 7sus4(♭9) |
| 2701 | 7(♭5,♭9) | 7(♭5,♭9) | 7(♭5,♭9) | 7(♭5,♭9) | 7(♭5,♭9) |
| 2702 | 7(♯5,♭9) | 7(♯5,♭9) | 7(♯5,♭9) | 7(♯5,♭9) | 7(♯5,♭9) |
| 28 | m7♭9 | −7♭9 | m7(♭9) | m7(♭9) | m7(♭9) |
| 2800 | m7(♭5,♭9) | ø7♭9 | m7(♭5,♭9) | m7(♭5,♭9) | m7(♭5,♭9) |
| 2801 | m7(♯5,♭9) | −7(♯5,♭9) | m7(♯5,♭9) | m7(♯5,♭9) | m7(♯5,♭9) |
| 29 | 7♯9 | 7♯9 | 7(♯9) | 7(♯9) | 7(♯9) |
| 2900 | 7sus4(♯9) | 7sus4(♯9) | 7sus4(♯9) | 7sus4(♯9) | 7sus4(♯9) |
| 2901 | 7(♭5,♯9) | 7(♭5,♯9) | 7(♭5,♯9) | 7(♭5,♯9) | 7(♭5,♯9) |
| 2902 | 7(♯5,♯9) | 7(♯5,♯9) | 7(♯5,♯9) | 7(♯5,♯9) | 7(♯5,♯9) |
| 30 | 6/9 | 6/9 | 6/9 | 6(9) | 6(9) |
| 31 | m6/9 | −6/9 | m6/9 | m6(9) | m6(9) |
| 106 | add11 | add11 | add11 | add11 | (11) |
| 107 | m(add11) | −(add11) | m(add11) | madd11 | m(11) |
| 32 | 11 | 11 | 11 | 11 | 7(9,11) |
| 3200 | 11♭5 | 11♭5 | 11(♭5) | 11(♭5) | 7(♭5,9,11) |
| 3201 | 11♯5 | 11♯5 | 11(♯5) | 11(♯5) | 7(♯5,9,11) |
| 3203 | 11♭9 | 11♭9 | 11(♭9) | 11(♭9) | 7(♭9,11) |
| 3204 | 11♯9 | 11♯9 | 11(♯9) | 11(♯9) | 7(♯9,11) |
| 102 | maj11 | Δ11 | 7M(11) | M11 | 7M(9,11) |
| 33 | m11 | −11 | m11 | m11 | m7(9,11) |
| 3300 | m11♭5 | ø11 | m11(♭5) | m11(♭5) | m7(♭5,9,11) |
| 3301 | m11♯5 | −11♯5 | m11(♯5) | m11(♯5) | m7(♯5,9,11) |
| 3303 | m11♭9 | −11♭9 | m11(♭9) | m11(♭9) | m7(♭9,11) |
| 34 | 9♯11 | 9♯11 | 9(♯11) | 9(♯11) | 7(9,♯11) |
| 3400 | 9(♯5,♯11) | 9(♯5,♯11) | 9(♯5,♯11) | 9(♯5,♯11) | 7(♯5,9,♯11) |
| 3402 | 7(♭9,♯11) | 7(♭9,♯11) | 7(♭9,♯11) | 7(♭9,♯11) | 7(♭9,♯11) |
| 3403 | 7(♯9,♯11) | 7(♯9,♯11) | 7(♯9,♯11) | 7(♯9,♯11) | 7(♯9,♯11) |
| 35 | m9♯11 | −9♯11 | m9(♯11) | m9(♯11) | m7(9,♯11) |
| 3500 | m9(♯5,♯11) | −9(♯5,♯11) | m9(♯5,♯11) | m9(♯5,♯11) | m7(♯5,9,♯11) |
| 3502 | m7(♭9,♯11) | −7(♭9,♯11) | m7(♭9,♯11) | m7(♭9,♯11) | m7(♭9,♯11) |
| 108 | add13 | add13 | add13 | add13 | (13) |
| 109 | m(add13) | −(add13) | m(add13) | madd13 | m(13) |
| 36 | 13 | 13 | 13 | 13 | 7(9,13) |
| 3600 | 13♭5 | 13♭5 | 13(♭5) | 13(♭5) | 7(♭5,9,13) |
| 3601 | 13♯5 | 13♯5 | 13(♯5) | 13(♯5) | 7(♯5,9,13) |
| 3603 | 13♭9 | 13♭9 | 13(♭9) | 13(♭9) | 7(♭9,13) |
| 3604 | 13♯9 | 13♯9 | 13(♯9) | 13(♯9) | 7(♯9,13) |
| 103 | maj13 | Δ13 | 7M(13) | M13 | 7M(9,13) |
| 37 | m13 | −13 | m13 | m13 | m7(9,13) |
| 3700 | m13♭5 | ø13 | m13(♭5) | m13(♭5) | m7(♭5,9,13) |
| 3701 | m13♯5 | −13♯5 | m13(♯5) | m13(♯5) | m7(♯5,9,13) |
| 3703 | m13♭9 | −13♭9 | m13(♭9) | m13(♭9) | m7(♭9,13) |
| 38 | 13♯11 | 13♯11 | 13(♯11) | 13(♯11) | 7(9,♯11,13) |
| 3800 | 13(♯5,♯11) | 13(♯5,♯11) | 13(♯5,♯11) | 13(♯5,♯11) | 7(♯5,9,♯11,13) |
| 3802 | 13(♭9,♯11) | 13(♭9,♯11) | 13(♭9,♯11) | 13(♭9,♯11) | 7(♭9,♯11,13) |
| 3803 | 13(♯9,♯11) | 13(♯9,♯11) | 13(♯9,♯11) | 13(♯9,♯11) | 7(♯9,♯11,13) |
| 39 | m13♯11 | −13♯11 | m13(♯11) | m13(♯11) | m7(9,♯11,13) |
| 3900 | m13(♭5,♯11) | ø13♯11 | m13(♭5,♯11) | m13(♭5,♯11) | m7(♭5,9,♯11,13) |
| 3902 | m13(♭9,♯11) | −13(♭9,♯11) | m13(♭9,♯11) | m13(♭9,♯11) | m7(♭9,♯11,13) |

## 5. Inversions and voicing

| Item | Rule | Status |
|---|---|---|
| Transpose | `formateChord`: formula = rootPc + interval for each tone | exact |
| Inversion | repeat n times: lowest tone +12, re-inserted before the first tone ≥ it; degrees and accidentals move with it; finally subtract floor(min/12)*12 | exact (`inversionTransform`) |
| Max inversions | formula length − 1 (so a 13th chord has 6) | exact |
| Display | "C Major (1)" for inversion 1 (`Chord.FullName`); symbol "C/E" (`ChordNamer.NameWithInversion`) | exact |
| Alternate voicings shown | priority inversion first, then inversions 0..min(3, max) | exact (`formateAlternateVoicingChords`) |
| Playing voicing (`ChordVoicer.Build`) | apply inversion; fold tones ≥ 12 (9/11/13) down an octave if that slot is free and above the bass; drop least important tones until ≤ 5 notes and span ≤ 14 semitones. Importance: root 100; 3rds/7ths 95 (never dropped); ♭5/♯5/♭9/♯9/♯11 80; 6/13 70; 9 60; 11 40; 5 20; else 50. Ties: drop the tone whose removal shrinks the span most. | exact |
| Fingering (`FingeringScorer`, algorithm v3) | candidates per note count: RH 2:[1,5][1,4][2,5]; 3:[1,2,5][1,3,5][2,3,5][1,2,4][1,3,4]; 4:[1,2,3,5][1,2,4,5][1,3,4,5][1,2,3,4]; 5:[1,2,3,4,5]. LH mirrored (5…1). Cost = Σ (distance outside ideal span)² + 3 per semitone over an octave + black key (thumb +8, pinky +3, other −1) + 4 for a semitone step with non-adjacent fingers + 3 when fingers 3–4 or 4–5 span ≥ 4. Ideal spans: 1-2 1..3, 2-3 1..3, 3-4 1..2, 4-5 1..3, 1-3 2..5, 2-4 2..5, 3-5 2..5, 1-4 3..7, 2-5 3..7, 1-5 5..12. Lowest cost wins; first candidate wins ties. | exact |

## 6. Scales (exact, `ScaleService.InitScales`, `Scale`)

* 1027 built-in scales. Each is `(id, name, letters[], accidentals[])`: `letters` are scale-step letters from the tonic (0 = tonic letter), accidentals are indexed by position in that array. Example Major 268 = letters 0..6, no accidentals.
* Descending scales: `letters[0] > letters[1]` (ids 51, 53, 69, 71, 232, 273, 389, 408, 936, 1005); marked `ScaleCharacteristic.Descending` and drawn top-down.
* `Formula` length = notes + 1 (octave root appended) when there are ≥ 4 notes.
* Step pattern (`PrepareIntervals`) is computed from pitch-class differences. One data quirk: 550 "Raga Bhankar" sums to 14, not 12.
* Note-count distribution: 2 notes: 3; 3 notes: 11; 4 notes: 19; 5 notes: 217; 6 notes: 177; 7 notes: 472; 8 notes: 92; 9 notes: 26; 10 notes: 6; 12 notes: 4.
* `ScaleType` tags (`Scale.ScaleTypes`): Common = id in PopularScalesIds; Jazz = name contains "jazz" or "bebop"; Blues = "blues"; Arabic = "maqam"; Indian = "raga" or "mela"; else Other. Counts: Other 458, Common 27, Jazz 14, Blues 24, Arabic 26, Indian 480.
* Degree string (`commaSeparatedScaleDegree`): accidental + (1 + letter), with the octave appended ("…, 8"). Step glyphs (`CommaSeparatedScaleDegreeAsCircles`): 1 semitone "◐", 2 "◉", 3 "◉◐", 4 "◉◉".
* Spelling on a tonic (`FormatScale`): letter = tonic letter + step letter; accidental = interval from the previous spelled note minus the natural distance, wrapped to −3..+3. So every scale is spelled one letter per step, with double sharps/flats when needed.
* Parallel modes used for borrowed chords: 268 Ionian, 110 Dorian, 498 Phrygian, 260 Lydian, 434 Mixolydian, 3 Aeolian, 243 Locrian, 172 "Harm. Min.", 388 "Mel. Min.".

### 6.1 Popular scales (PopularScalesIds, 27)

| id | name | notes | step pattern | degrees | in C |
| --- | --- | --- | --- | --- | --- |
| 3 | Aeolian | 7 | 2-1-2-2-1-2-2 | 1, 2, ♭3, 4, 5, ♭6, ♭7, 8 | C D E♭ F G A♭ B♭ |
| 104 | Dorian Bebop | 8 | 2-1-1-1-2-2-1-2 | 1, 2, ♭3, 3, 4, 5, 6, ♭7, 8 | C D E♭ E F G A B♭ |
| 110 | Dorian | 7 | 2-1-2-2-2-1-2 | 1, 2, ♭3, 4, 5, 6, ♭7, 8 | C D E♭ F G A B♭ |
| 112 | Dorian Pentatonic | 5 | 2-3-2-3-2 | 1, 2, 4, 5, ♭7, 8 | C D F G B♭ |
| 115 | Dorico Flamenco | 7 | 1-3-1-2-1-2-2 | 1, ♭2, 3, 4, 5, ♭6, ♭7, 8 | C D♭ E F G A♭ B♭ |
| 172 | Harmonic Minor | 7 | 2-1-2-2-1-3-1 | 1, 2, ♭3, 4, 5, ♭6, 7, 8 | C D E♭ F G A♭ B |
| 207 | Ionian Augmented | 7 | 2-2-1-3-1-2-1 | 1, 2, 3, 4, ♯5, 6, 7, 8 | C D E F G♯ A B |
| 209 | Ionian | 7 | 2-2-1-2-2-2-1 | 1, 2, 3, 4, 5, 6, 7, 8 | C D E F G A B |
| 210 | Ionian Pentatonic | 5 | 2-2-3-2-3 | 1, 2, 3, 5, 6, 8 | C D E G A |
| 243 | Locrian | 7 | 1-2-2-1-2-2-2 | 1, ♭2, ♭3, 4, ♭5, ♭6, ♭7, 8 | C D♭ E♭ F G♭ A♭ B♭ |
| 260 | Lydian | 7 | 2-2-2-1-2-2-1 | 1, 2, 3, ♯4, 5, 6, 7, 8 | C D E F♯ G A B |
| 268 | Major | 7 | 2-2-1-2-2-2-1 | 1, 2, 3, 4, 5, 6, 7, 8 | C D E F G A B |
| 388 | Melodic Minor ▲ | 7 | 2-1-2-2-2-2-1 | 1, 2, ♭3, 4, 5, 6, 7, 8 | C D E♭ F G A B |
| 389 | Melodic Minor ▼ | 7 | 2-2-1-2-2-1-2 | 8, ♭7, ♭6, 5, 4, ♭3, 2, 1 | C B♭ A♭ G F E♭ D |
| 415 | Minor Pentatonic | 5 | 3-2-2-3-2 | 1, ♭3, 4, 5, ♭7, 8 | C E♭ F G B♭ |
| 434 | Mixolydian | 7 | 2-2-1-2-2-1-2 | 1, 2, 3, 4, 5, 6, ♭7, 8 | C D E F G A B♭ |
| 445 | Natural Minor | 7 | 2-1-2-2-1-2-2 | 1, 2, ♭3, 4, 5, ♭6, ♭7, 8 | C D E♭ F G A♭ B♭ |
| 457 | Octatonic (Half-tone, Whole-tone) | 8 | 1-2-1-2-1-2-1-2 | 1, ♭2, ♭3, 3, ♯4, 5, 6, ♭7, 8 | C D♭ E♭ E F♯ G A B♭ |
| 458 | Octatonic (Whole-tone, Half-tone) | 8 | 2-1-2-1-2-1-2-1 | 1, 2, ♭3, 4, ♯4, ♯5, 6, 7, 8 | C D E♭ F F♯ G♯ A B |
| 467 | Pentatonic Blues | 5 | 3-2-1-4-2 | 1, ♭3, 4, ♭5, ♭7, 8 | C E♭ F G♭ B♭ |
| 468 | Pentatonic Major | 5 | 2-2-3-2-3 | 1, 2, 3, 5, 6, 8 | C D E G A |
| 478 | Pentatonic Minor | 5 | 3-2-2-3-2 | 1, ♭3, 4, 5, ♭7, 8 | C E♭ F G B♭ |
| 491 | Phrygian/Aeolian mixed | 8 | 1-1-1-2-2-1-2-2 | 1, ♭2, 2, ♭3, 4, 5, ♭6, ♭7, 8 | C D♭ D E♭ F G A♭ B♭ |
| 498 | Phrygian | 7 | 1-2-2-2-1-2-2 | 1, ♭2, ♭3, 4, 5, ♭6, ♭7, 8 | C D♭ E♭ F G A♭ B♭ |
| 960 | Spanish Gypsy | 7 | 1-3-1-2-1-2-2 | 1, ♭2, 3, 4, 5, ♭6, ♭7, 8 | C D♭ E F G A♭ B♭ |
| 966 | Super Locrian | 7 | 1-2-1-2-2-2-2 | 1, ♭2, ♭3, ♭4, ♭5, ♭6, ♭7, 8 | C D♭ E♭ F♭ G♭ A♭ B♭ |
| 1012 | Whole-tone I | 6 | 2-2-2-2-2-2 | 1, 2, 3, ♯4, ♯5, ♯6, 8 | C D E F♯ G♯ A♯ |

The full list of 1027 scales with step patterns, degrees, C spelling and tags is in `data/scales.json`; names in all locales are in `data/localized_theory_names.json`.

### 6.2 Scale search (exact, `findScaleByFormulaPart`, `GetPopularityScore`, `Scale.isIntersectedWith/isSimilarScale`)

* Candidates: every scale × 17 spellings (`prepareAllScales` uses `NotesWithSharpsFlats`).
* Filters: favourites only, popular only, note-count and tag filters from `Settings.ScaleFilterSettings`, optional root.
* Similar mode: same note count as the played set and at least count−1 shared pitch classes.
* Ranking score (lower first): Major 10, Aeolian 20, Lydian 30, Mixolydian 40, Dorian 50, Phrygian 60, Locrian 70, other popular 80, rest 1000; −100 when the lowest played note is the tonic (only for scores < 100); −50 when played-note count = scale formula length − 1; + key accidentals of the tonic spelling.

## 7. Chords in a scale (exact, `ScaleService.GenerateChordList(scale, chordService)`)

Used by Scales details and by the progression Chord Suggester. Six sections, in order:

| Section | Rule |
|---|---|
| Common chords (triads) | every listed 3-note chord, root position, all tones in the scale, `IsCommon` (maj/min/dim/aug), root spelled exactly as a scale note → Roman numeral |
| Sevenths | same with 4-note chords that have a 7th degree and are `IsCommon` (maj7, 7, m7, mMaj7, m7♭5, °7, 7♯5, maj7♯5, mMaj7♭5) |
| Secondary dominant | for each scale degree i: if a maj/min/dim/aug triad (7th mode: 7, maj7, m7, m7♭5) exists on degree i of the scale rebuilt on the 5th degree, add the major triad (or 7th) there, named "V/ii", "V7/ii"… |
| Secondary leading tone | only for scales with ≥ 7 notes: scale rebuilt a semitone below the tonic; adds dim (or m7♭5) chords named "vii°/x" or "viiø7/x" |
| Parallel mode | for each of the 9 parallel modes on the same tonic (except the current one; Natural Minor 445 counts as Aeolian): chords not already present, root found in the scale or a semitone above a scale note (then prefixed "♭"), tagged with the source mode name |
| Other | every remaining chord whose tones fit the scale and whose root is a scale note, ordered by degree |

All sections are ordered by degree number (`RelativeChord.Number`). Roman numerals: I…XII (`RomeNumbers`), lower-case for minor-type chords, with the quality suffix from `RomanQuality`.

## 8. Modes and progression patterns (exact, `AbstractMode` subclasses, `ProgressionPatterns.InitPatterns`)

Each mode maps degrees 1–7 to Major (id 10), Minor (11) or Diminished (12) at a fixed offset from C. The chord root is `ParseNote((key + offset) % 12, key.Accidental ?? Sharp)`, so in C every black-key root is spelled with a sharp (Phrygian ♭II prints as C♯, Phrygian and Aeolian ♭III as D♯, ♭VI as G♯, ♭VII as A♯).

| mode | I | II | III | IV | V | VI | VII |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ionian | I (C) | ii (Dm) | iii (Em) | IV (F) | V (G) | vi (Am) | vii° (Bdim) |
| Dorian | i (Cm) | ii (Dm) | III (D♯) | IV (F) | v (Gm) | vi° (Adim) | VII (A♯) |
| Phrygian | i (Cm) | II (C♯) | III (D♯) | iv (Fm) | v° (Gdim) | VI (G♯) | vii (A♯m) |
| Lydian | I (C) | II (D) | iii (Em) | iv° (F♯dim) | V (G) | vi (Am) | vii (Bm) |
| Mixolydian | I (C) | ii (Dm) | iii° (Edim) | IV (F) | v (Gm) | vi (Am) | VII (A♯) |
| Aeolian | i (Cm) | ii° (Ddim) | III (D♯) | iv (Fm) | v (Gm) | VI (G♯) | VII (A♯) |
| Locrian | i° (Cdim) | II (C♯) | iii (D♯m) | iv (Fm) | V (F♯) | VI (G♯) | vii (A♯m) |

Mode display names (`AbstractMode.GetName`): "Ionian (Major)", "Aeolian (Natural Minor)", others the enum name.

### 8.1 The 45 built-in patterns

| # | mode | degrees | roman | in C |
| --- | --- | --- | --- | --- |
| 1 | Ionian | 1,5,6,4 | I – V – vi – IV | C – G – Am – F |
| 2 | Ionian | 1,3,4,2 | I – iii – IV – ii | C – Em – F – Dm |
| 3 | Ionian | 1,4,5,1 | I – IV – V – I | C – F – G – C |
| 4 | Ionian | 1,6,2,5 | I – vi – ii – V | C – Am – Dm – G |
| 5 | Ionian | 1,6,2,4 | I – vi – ii – IV | C – Am – Dm – F |
| 6 | Ionian | 1,2,3,4,5 | I – ii – iii – IV – V | C – Dm – Em – F – G |
| 7 | Dorian | 1,3,4,1 | i – III – IV – i | Cm – D♯ – F – Cm |
| 8 | Dorian | 1,3,4,1,7,1 | i – III – IV – i – VII – i | Cm – D♯ – F – Cm – A♯ – Cm |
| 9 | Dorian | 1,4,5,1 | i – IV – v – i | Cm – F – Gm – Cm |
| 10 | Dorian | 1,6,7,1 | i – vi° – VII – i | Cm – Adim – A♯ – Cm |
| 11 | Dorian | 1,2,5,1 | i – ii – v – i | Cm – Dm – Gm – Cm |
| 12 | Dorian | 1,2,4,1 | i – ii – IV – i | Cm – Dm – F – Cm |
| 13 | Phrygian | 1,2,3,1 | i – II – III – i | Cm – C♯ – D♯ – Cm |
| 14 | Phrygian | 1,2,3,6 | i – II – III – VI | Cm – C♯ – D♯ – G♯ |
| 15 | Phrygian | 1,2,6,3 | i – II – VI – III | Cm – C♯ – G♯ – D♯ |
| 16 | Phrygian | 1,3,7,1 | i – III – vii – i | Cm – D♯ – A♯m – Cm |
| 17 | Phrygian | 1,4,1,2,1 | i – iv – i – II – i | Cm – Fm – Cm – C♯ – Cm |
| 18 | Phrygian | 1,5,1,2,1 | i – v° – i – II – i | Cm – Gdim – Cm – C♯ – Cm |
| 19 | Lydian | 1,2,5,1 | I – II – V – I | C – D – G – C |
| 20 | Lydian | 1,4,6,1 | I – iv° – vi – I | C – F♯dim – Am – C |
| 21 | Lydian | 1,5,4,6 | I – V – iv° – vi | C – G – F♯dim – Am |
| 22 | Lydian | 1,2,4,5 | I – II – iv° – V | C – D – F♯dim – G |
| 23 | Lydian | 1,2,6,4 | I – II – vi – iv° | C – D – Am – F♯dim |
| 24 | Lydian | 1,6,2,5 | I – vi – II – V | C – Am – D – G |
| 25 | Mixolydian | 1,7,4,4 | I – VII – IV – IV | C – A♯ – F – F |
| 26 | Mixolydian | 1,2,4,1 | I – ii – IV – I | C – Dm – F – C |
| 27 | Mixolydian | 1,2,4,7 | I – ii – IV – VII | C – Dm – F – A♯ |
| 28 | Mixolydian | 1,2,3,4 | I – ii – iii° – IV | C – Dm – Edim – F |
| 29 | Mixolydian | 1,2,5,7 | I – ii – v – VII | C – Dm – Gm – A♯ |
| 30 | Mixolydian | 1,6,4,5,7,1 | I – vi – IV – v – VII – I | C – Am – F – Gm – A♯ – C |
| 31 | Mixolydian | 1,4,1,7,1 | I – IV – I – VII – I | C – F – C – A♯ – C |
| 32 | Aeolian | 1,2,4,1 | i – ii° – iv – i | Cm – Ddim – Fm – Cm |
| 33 | Aeolian | 1,2,5,1 | i – ii° – v – i | Cm – Ddim – Gm – Cm |
| 34 | Aeolian | 1,4,7,3 | i – iv – VII – III | Cm – Fm – A♯ – D♯ |
| 35 | Aeolian | 1,6,3,7 | i – VI – III – VII | Cm – G♯ – D♯ – A♯ |
| 36 | Aeolian | 1,6,7,5 | i – VI – VII – v | Cm – G♯ – A♯ – Gm |
| 37 | Aeolian | 1,4,7,1 | i – iv – VII – i | Cm – Fm – A♯ – Cm |
| 38 | Aeolian | 1,6,7,1 | i – VI – VII – i | Cm – G♯ – A♯ – Cm |
| 39 | Aeolian | 1,4,5,1 | i – iv – v – i | Cm – Fm – Gm – Cm |
| 40 | Locrian | 1,2,4,7 | i° – II – iv – vii | Cdim – C♯ – Fm – A♯m |
| 41 | Locrian | 1,5,3,2 | i° – V – iii – II | Cdim – F♯ – D♯m – C♯ |
| 42 | Locrian | 1,3,1,2 | i° – iii – i° – II | Cdim – D♯m – Cdim – C♯ |
| 43 | Locrian | 1,3,7,1 | i° – iii – vii – i° | Cdim – D♯m – A♯m – Cdim |
| 44 | Locrian | 1,4,5,1 | i° – iv – V – i° | Cdim – Fm – F♯ – Cdim |
| 45 | Locrian | 1,7,1,7 | i° – vii – i° – vii | Cdim – A♯m – Cdim – A♯m |

`ProgressionPatterns.Random(type, min 3, max 8)`: length = 3 + rnd % 9 (3–11 chords), each degree 1 + rnd % 7. Text import (`ParseFromNotesString`) accepts Roman numerals (I…XII), digits 1–7, or chord names, separated by commas or spaces.

Curated progression library (`CuratedProgressionsLibrary`): the type exists (fields Id, Name, RomanNumerals, Pattern, Mode, DefaultKeyValue, TempoBpm, Category {Pop, Rock, Blues, Jazz, Classical, Latin, Folk, Worship, Film}, FamousSongs, IsFree), but no JSON ships and nothing constructs it on macOS. **exact** (no caller, no resource).

## 9. "What comes next" suggester (exact, `ChordSuccessors`)

Used by `CompanionChordsPanel` ("Sounds great with") and by Chord of the Day. Algorithm:

1. For each of 24 keys (tonic `ParseNote(i, Sharp)`, i = 0..11; Major 268 then Natural Minor 445), build diatonic triads and sevenths (section 7, group Common only). Chords whose root would be a double sharp do not exist, so those degrees are missing in D♯, G♯ and A♯ major (quirk, exact consequence of `Semitone.Values`).
2. Find the first degree k (1..7) whose chords contain one with the same pitch-class set as the current chord. Skip the key if none.
3. For each target degree t in `Function[k]` and each chord c on t with a different pitch-class set: score = weight(k→t) + RootMotion[(root(c) − root(current)) mod 12] + 0.05 × common tones − 0.12 if c has ≥ 4 notes. Sum scores per (root pitch class, pitch-class set) across keys.
4. Sort by total descending (ties: key string, ordinal). Take the best chord per distinct root first, then the remaining chords. Cut to the limit (12; UI default).
5. If nothing matched (chord is not diatonic anywhere), retry with the triad reduction: dim if it has ♭3 and ♭5, minor if ♭3, else major.
6. Each result is voiced inside the octave that starts at the current chord's root (`ProgressionVoicing.Apply(windowBottom)`), and its inversion is read from the bass.
7. Lite shows the first 3 with alpha 1.0, 0.5, 0.25 and an Unlock button; ChordsPro shows all (`CompanionChordsPanel.Update`).

Function weights (from degree → to degree):

| from \ to | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  | 0.7 | 0.4 | 0.9 | 0.9 | 0.7 | 0.3 |
| 2 | 0.3 |  | 0.3 | 0.3 | 1 | 0.3 | 0.6 |
| 3 | 0.3 | 0.4 |  | 0.7 | 0.3 | 0.9 |  |
| 4 | 0.8 | 0.6 | 0.2 |  | 1 | 0.3 | 0.4 |
| 5 | 1 | 0.2 | 0.2 | 0.4 |  | 0.7 |  |
| 6 | 0.3 | 0.9 | 0.4 | 0.8 | 0.7 |  |  |
| 7 | 1 |  | 0.6 |  |  | 0.3 |  |

Root-motion bonus:

| root interval up (semitones) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bonus | -0.5 | 0.04 | 0.2 | 0.1 | 0.08 | 0.35 | 0.02 | 0.05 | 0.06 | 0.2 | 0.15 | 0.04 |

Common-tone bonus 0.05 per shared pitch class; seventh-chord penalty 0.12.

Example output (computed by the port, verified by hand for "after C": F = 0.9+0.35+0.05 (C maj) + 1.0+0.35+0.05 (F maj) + 0.9+0.35+0.05 (A min) + 0.6+0.35+0.05 (D min) = 5.00):

| after | ranked suggestions (score) |
| --- | --- |
| C | F 5, Am 4.1, Dm 3.9, G 2.4, Em 2.02, F♯dim 1.44, B♭ 1, Bm 0.98, Fmaj7 4.72, Am7 3.75, Dm7 3.62, Em7 1.54 |
| Am | Dm 5.3, Em 2.8, F 2.64, C 2.6, G 2.1, F♯dim 1.8, Bm 1.7, B♭ 1.48, Dm7 5.02, Fmaj7 2.36, Em7 2.32, D 2.2 |
| G7 | C 2.4, Am 2.1, F 1.1, Em 0.5, Dm 0.35, Cmaj7 2.26, Am7 1.96, Fmaj7 0.86, Em7 0.43, Dm7 0.23 |
| Dm7 | Gm 4, Am 3, F 2.3, C 2.3, B♭ 2.18, Bdim 1.8, Em 1.7, E♭ 0.74, Gm7 3.79, Am7 2.52, G 2.2, G7 2.06 |

## 10. Circle of fifths and key signatures (exact, `NoteService`, `ScaleService.BuildCircleOfFifths`, `GetMajorAccidentals`, `ChordService.InitScales`)

* Major circle (pitch classes): 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5 (C G D A E B F♯ C♯ A♭ E♭ B♭ F).
* Minor circle: 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 (A E B F♯ C♯ G♯ D♯ B♭ F C G D).
* `BuildCircleOfFifths(scale, priority)`: format the scale on all 21 spellings; the one with no accidentals first; then 1..7 sharps and 4..1 flats when priority is Sharp, or 1..4 sharps and 7..1 flats when priority is Flat. Count = Σ accidental sizes − 1 if the tonic itself has an accidental (the octave copy).
* ChordService key table (used to spell non-scale tones): C none; G F♯; D F♯ C♯; A +G♯; E +D♯; B +A♯; F♯ +F (E♯); F B♭; B♭ +E♭; E♭ +A♭; A♭ +D♭; D♭ (stored as value 1 "C♯" with Flat) +G♭.
* Visual layout, ring radii and colours: see COMPONENTS_LAYOUT_MOTION.md §3.

Key accidentals per spelling (this drives tie-breaks in search ranking):

| tonic | major scale (FormatScale) | sharps | flats | GetMajorAccidentals |
| --- | --- | --- | --- | --- |
| C♭ | C♭ D♭ E♭ F♭ G♭ A♭ B♭ | 0 | 7 | 7 |
| C | C D E F G A B | 0 | 0 | 0 |
| C♯ | C♯ D♯ E♯ F♯ G♯ A♯ B♯ | 7 | 0 | 7 |
| D♭ | D♭ E♭ F G♭ A♭ B♭ C | 0 | 5 | 5 |
| D | D E F♯ G A B C♯ | 2 | 0 | 2 |
| D♯ | D♯ E♯ Fx G♯ A♯ B♯ Cx | 9 | 0 | 9 |
| E♭ | E♭ F G A♭ B♭ C D | 0 | 3 | 3 |
| E | E F♯ G♯ A B C♯ D♯ | 4 | 0 | 4 |
| E♯ | E♯ Fx Gx A♯ B♯ Cx Dx | 11 | 0 | 11 |
| F♭ | F♭ G♭ A♭ B♭♭ C♭ D♭ E♭ | 0 | 8 | 8 |
| F | F G A B♭ C D E | 0 | 1 | 1 |
| F♯ | F♯ G♯ A♯ B C♯ D♯ E♯ | 6 | 0 | 6 |
| G♭ | G♭ A♭ B♭ C♭ D♭ E♭ F | 0 | 6 | 6 |
| G | G A B C D E F♯ | 1 | 0 | 1 |
| G♯ | G♯ A♯ B♯ C♯ D♯ E♯ Fx | 8 | 0 | 8 |
| A♭ | A♭ B♭ C D♭ E♭ F G | 0 | 4 | 4 |
| A | A B C♯ D E F♯ G♯ | 3 | 0 | 3 |
| A♯ | A♯ B♯ Cx D♯ E♯ Fx Gx | 10 | 0 | 10 |
| B♭ | B♭ C D E♭ F G A | 0 | 2 | 2 |
| B | B C♯ D♯ E F♯ G♯ A♯ | 5 | 0 | 5 |
| B♯ | B♯ Cx Dx E♯ Fx Gx Ax | 12 | 0 | 12 |

## 11. Enharmonic spelling rules (summary of all places)

| Where | Rule | Status |
|---|---|---|
| Chord dictionary roots | root picker offers spellings; listed chords are built on the chosen spelling; chord tones are spelled from the major scale of that root plus the degree accidental (so C♯ major = C♯ E♯ G♯) | exact (`ToNotesOnStaff`) |
| Reverse lookup | all 21 spellings compete; ranking adds the number of accidentals of the major key on that spelling, so D♭ (5) beats C♯ (7) and C (0) beats B♯ (12) | exact (`GetPopularityScore`) |
| ChordNamer | per root pitch class keeps the spelling with the fewest key accidentals (`KeyFifths`: letter fifths ±7, minor-type chords −3); tie → flats for minor-type, sharps for others (F♯ beats G♭ for major, E♭m beats D♯m) | exact (`ChordNamer.Entries`) |
| ChordNamer bass outside the chord | flats if the chord's key is on the flat side (KeyFifths < 0), else sharps | exact (`ForeignNoteName`) |
| Reverse-lookup de-dup | `PreferredSpellings`: fewer key accidentals; tie → minor-type prefers flat side | exact |
| Slash bass with double accidental | dropped from reverse results (`RankReverseResults`) | exact |
| Modes / progressions | `ParseNote(..., key accidental or Sharp)` | exact |
| Suggester keys | tonic spelled with sharps (C♯, D♯, F♯, G♯, A♯) | exact |
| Non-academic setting | E♯/B♯/C♭/F♭ simplified for display | exact |

## 12. Chord search by name (exact, `ChordService.FindChordsByName`, `ChordSymbolQuery`, `SlashChordQuery`)

1. Input with "/" (except "6/9") is a slash query: chord part + bass note (bass matched against the 21 ASCII spellings, accent- and case-insensitive). Chords whose formula contains the bass are returned in that inversion (if inversions are allowed) and listed first.
2. Root is parsed from the start (`Semitone.ParseFromInput`); default root = the root picker.
3. Typed symbol variants: spaces removed; ♭→b, ♯→#, Δ/△→M, −→-; "ø7"/"ø" → "m7b5"; whole-word aliases 7#9/7+9→9+, 7b9/7-9→-9, 6/9 and 69→9/6, m6/9 and m69→m9/6, m7b5 and min7b5→m7-5; "maj/Maj/MAJ/ma<digit>"→"M"; leading "min", "mi<digit>", "-<digit or end>"→"m"; "dim"→"o", "aug"→"+"; b/# before a digit → -/+.
4. Score per chord: 0 exact (shortName, buttonName, or any displayed style symbol), 1 prefix of shortName/buttonName, 2 English long name starts with the typed text, −1 no match. Sorted by score.
5. Empty symbol → plain major chords (shortName/buttonName empty or "M").

## 13. Retention features built on the engine (exact, not all wired on macOS)

* Chord of the Day (`ChordOfTheDay.PickFor`): quality ladder [10, 11, 19, 22, 20, 15, 17, 104, 23, 12]; Beginner uses the first 2, "know a few" 5, comfortable 8, advanced 10. Chord = ladder[day % n]; key = [C, G, D, A, E, F][(day / n) % 6]; plus 2 successors from `ChordSuccessors.After`.
* Flashcards (`FlashcardsService`, `DistractorGenerator`): 3 distractors — same root other quality from [10, 11, 12, 13, 14, 15, 19, 22, 20, 21, 23, 17, 18] with equal note count; then same quality on roots −5…+5 (excluding 0, ±1); then the deck; then chromatic fallback; never two with the same pitch-class set or label. No macOS UI references `FlashcardsService` (exact: no caller in PianoCompanion.dll).
