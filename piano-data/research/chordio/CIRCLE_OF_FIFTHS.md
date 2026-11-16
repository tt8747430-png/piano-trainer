# Circle of fifths by mode

Chordio has two circle-of-fifths UIs.

## 1. Modes workspace: rotating "code wheel" over a mode-ring image (`ModesViewController`, `CodeWheelView`)
- `loadWheelWithletters:withFrame:defaultWheelThickness:circleOfFithsImage:` lays a rotatable letter wheel (`CodeWheelView`, 12 letters) over one of seven 800×800 PNG rings: `CircleOfFifth{Ionian,Dorian,Phrygian,Lydian,Mixolydian,Aeolian,Locrian}Mode.png`. The PNG names are **exact** cstrings.
- Turning the wheel changes the key: `codeWheel:beganRotateToOffset:`, `endedRotateToIndex:withSelectedLetter:`, `incrementCodeWheel`/`decrementCodeWheel`, and `CircularGestureRecognizer`. Tapping a letter plays that diatonic chord (`midiNoteNumbersForDepressedChordName:octave:`, `codeWheel:didSelectChordName:withMidiNumbers:`).
- A **spin hint** gives the wheel a quick spin when the workspace opens. It is off under Reduce Motion, and the setting key is `TBModesWheelSpinHintEnabledKey`. The text reads: "Gives the Circle of Fifths wheel a quick spin when you open the Modes workspace … It stays still while Reduce Motion is on." **exact**.
- Other controls: a mode/scale picker (`ModeSelectionCollectionView` with group control and pager), "Tap to select a Mode", a scale overlay on the keyboard (roots shown green), and a play/stop scale button driven by `EatsClock` ticks.

### Ring images (structure and colours)
I viewed the Ionian, Dorian and Locrian rings. The four others follow by the same rule (**inferred**).
- The ring has 12 slices on the circle of fifths, with the tonic at the top. **Clockwise = up a fifth.**
- The 7 diatonic chords form one **contiguous arc**, which is the fifth-chain F–C–G–D–A–E–B shifted so the tonic sits at 12 o'clock. The 5 non-diatonic slices are **grey** (#CCCCCC-like).
- Each diatonic slice has an outer band and an inner band with the Roman numeral (white text, case shows quality, `°` for diminished). The tonic slice is raised and has a drop shadow.
- Colours (sampled visually, approximate): **major = slate blue (~#566B80)**, **minor = olive green (~#93A34B)**, **diminished = brick red (~#A35555)**.

| Mode | Counter-clockwise (far → near) | Tonic (top) | … clockwise |
|---|---|---|---|
| Lydian | — | **I** | V, II, vi, iii, vii, #iv° (**inferred**) |
| Ionian (seen) | IV | **I** | V, ii, vi, iii, vii° |
| Mixolydian | VII, IV | **I** | v, ii, vi, iii° (**inferred**) |
| Dorian (seen) | III, VII, IV | **i** | v, ii, vi° |
| Aeolian | VI, III, VII, iv | **i** | v, ii° (**inferred**) |
| Phrygian | II, VI, III, vii, iv | **i** | v° (**inferred**) |
| Locrian (seen) | V, II, VI, iii, vii, iv | **i°** | — |

(For Locrian, the numerals are drawn without ♭ signs: iv, vii, iii, VI, II, V.) **exact** from the PNGs viewed.

## 2. Chord Voicings panel: two-ring pie (`CircleOfFifthViewController`)
- An outer pie (`OuterPieChartView`, 12 slices) and an inner pie (`InnerPieChartView`), plus an inner circle that sets the octave (`innerCircleView:octaveState:`). Tapping a slice calls `triggerChordForPitchClass:isOuterCircle:`.
- Three buttons: **Chord Type**, **Voicing** (Rootless, Shell, So What, K. Barron, H. Hancock, Open, Closed) and **Mode Type**. The help says "navigate predefined voicings arranged as a circle of fifths. Tap on any chord name within the inner or outer circle to preview".
- The default ring of chord labels (`CircleOfFifthsManager intialCircleOfFifthsIonianChords`, @0x1006696d8, **exact**): `C, G, D𝚖, A𝚖, E𝚖, Bº, F♯, D♭, A♭, E♭, B♭, F`. Minor is the math-monospace 𝚖 (U+1D696), diminished is º.
- `circleOfFifthChordsFromChordProgression:rotationIndex:modeType:circleOfFifthsComponents:` rotates the ring to the mode and key. `updateAccidental:withSelectedKey:modeType:` respells accidentals. `chordTypeForModeType:` and `modeTypeFromString:` map modes; mode type 0x39 is "CircleOfFifthTone". The root vocabulary is `C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B`, and quality tokens are `Aug aug Dim dim Maj maj Min min sus4 sus2 7 6`. **exact** constant arrays.
- `numberOfColouredBassNote` passes the bass-colouring option through to the chosen chord.
