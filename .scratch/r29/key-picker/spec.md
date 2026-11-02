# Spec: the key picker (A5, R29)

## Problem
Roots and keys are chosen from `StepStrip` strips (`NoteChoice` on 10 screens, `KeyChoice` on 5): 17
spellings with ‹ › arrows, the same black key twice, options hidden behind arrows, edges blurred. Each
explorer stacks several strips.

## Decision
Three controls in `shared/ui/pickers/`, one look (a value with ⌃⌄ that opens a popover; a sheet on a phone
below 30rem):
1. **`PitchPicker`** — a pitch class only (Intervals' root, the Melody note, Start on, the Chord finder's
   bass): an octave of 12 cells drawn as piano keys, a black key's cell named by its usual name
   (C, D♭, D, E♭, E, F, F♯, G, A♭, A, B♭, B). Value: `PitchClass`.
2. **`NotePicker`** — a root that is *spelled* (Chords' root, Scales' start, Progressions' key note):
   the same octave, a black key's cell split "C♯ | D♭", a tap on a half choosing that spelling. No E♯, F♭,
   B♯, C♭ cells. Value: `SpelledNote` (letter + accidental, no octave).
3. **`KeyPicker`** — a key (Scales and keys' Key tab, the editor's key signature, Transpose, a progression's
   key): the circle of fifths (`music/circle.ts`), majors outside and relative minors inside, each wedge
   with its signature drawn small, the enharmonic wedges split (B / C♭, F♯ / G♭, C♯ / D♭ and their minors),
   a "Select: <key>" button confirming. The Key tab's existing circle *is* this picker in place (no popover).
   Value: `Key`.
4. **`KeysChecklist`** — several keys (Quiz and Exercises setup): the 15 signatures as rows
   "C major / A minor" with checkboxes, Select all · Clear all, Apply. Value: `readonly Key[]`.

Usual names (checked against MuseScore 4's key list, Flat's key menu and the circle): majors C G D A E B
F♯/G♭ D♭ A♭ E♭ B♭ F (six sharps or six flats both offered on the split wedge, F♯ shown first); minors A E B
F♯ C♯ G♯ E♭/D♯ B♭ F C G D (E♭m shown first). Pitch-only cells use the major-key names above.

**Feedback at once**: the explorers draw, beside the picker row and from the same value, the facts chips
(`KeyFacts`: "D major · 2 sharps: F♯ C♯"), note chips that play, the staff with the signature and the lit
keys. That is the explorers' work in round 2; the pickers emit only the value.

**One compact row** at the top of an explorer (`PickerRow`, `shared/ui`): `Root C ⌃⌄ · Quality Major ⌃⌄ ·
Inversion Root ⌃⌄`, wrapping onto a second line at 320, the rarely changed ones in a fold. Qualities, scale
kinds, inversions and voicings use the same popover trigger over a plain list (`MenuPicker`).

## Removed
`StepStrip`, `NoteChoice`, `KeyChoice`, `.tab-strip` and `.fade-scroll-x` edge masks (`theme.css`), and the
blur in `BeatStrip` and `ChordPair` (R13). The 17-spelling constant goes where nothing else uses it.

## Tests
- `PitchPicker`: 12 cells, the names above, keyboard: arrows move, Enter chooses, Esc closes.
- `NotePicker`: a tap on the C♯ half returns C♯, on the D♭ half D♭; no impossible spelling is offered.
- `KeyPicker`: a wedge's tap then Select returns the key; F♯/G♭ both reachable; minor inside.
- Each explorer's URL param reads and writes the same spelling as before (route-search tests unchanged).

## ADR
0061 (the Choosing Rule): the control table of A5 and these four pickers; 0052: the strips' paragraph
replaced.
