# ChordLab Export: chord detection and built-in content

Material recovered from **ChordLab 1.0.6** (macOS), packaged so it can be used in a piano-trainer project.

## Contents

```
chordlab-export/
├── README.md
├── DETECTION_RULES.md           # Spec: how a set of held notes becomes a chord name
├── chord_detector.py            # Runnable Python port of the rules (no dependencies)
├── reference/
│   └── chord_qualities.json     # 42 chord qualities: id, name, symbol, intervals
└── content/
    ├── beginner.json            # 9 voicings, 2 progressions, 5 melodies
    ├── intermediate.json        # 7 voicings, 2 progressions, 6 melodies
    ├── beginner.original.xml    # Raw packs as embedded in the app
    └── intermediate.original.xml
```

## Quick start

```bash
python3 chord_detector.py          # runs the built-in examples
```

```python
from chord_detector import detect
detect([52, 60, 67, 72])   # {'name': 'C/E', 'root': 0, 'bass': 4, 'quality': 0, 'intervals': [0, 4, 7]}
detect([50, 53, 57, 60, 64])  # Dm9
```

Input is a list of MIDI note numbers (60 = middle C). Pitch classes are 0 = C … 11 = B.

## Content JSON format

- **voicings[]**: `name`, `chordlabQualityId` (see `chord_qualities.json`), `rootPitchClass`,
  `intervals` (semitones above the root, may exceed 12 for spread voicings), `velocities`,
  `exampleMidiNotes` (voiced from middle C), `targetBpm`.
- **progressions[]**: `name`, `key`, `mode`, `bpm`, `timeSignature`, `totalBeats`;
  `chords[]` groups notes by start beat (`startBeat`, `durationBeats`, `midiNotes`, `noteNames`);
  `notes[]` is the raw note list with velocities.
- **melodies[]**: `name`, `key`, `bpm`, `timeSignature`, `totalBeats`; `notes[]` with
  `intervalFromKeyRoot` (transposable), `startBeat`, `durationBeats`, `velocity`, `exampleMidiNote`.

Beats are quarter notes.

## Detected names for the bundled progressions (using `chord_detector.py`)

| Progression | Chords |
|---|---|
| The Pop Special (C) | Am → F → C/G → G |
| 2-5-1 (C) | Dm7 → G7/D → Cmaj7 |
| 2-5-1 with 9ths (C) | Dm9 → G13 → Cmaj9 |
| Just the Two of Us (F minor) | Dbmaj9 → C7(#9,#5) → Fm9 → Ebm9 → Ab13 … (18 chords) |

`chord_detector.py` always uses sharps for C#/F#, so Dbmaj9 prints as C#maj9.
If you need flats, spell note names from the key.

## Accuracy

- The quality classification, plausibility filter and chord-tone table are exact translations
  of the original code.
- Root-choice scoring uses the original weights, but the name-length term uses this port's
  names, so close ties may resolve differently from ChordLab.
- Chord-name formatting is approximate (same vocabulary, not byte-identical).

## Licensing note

This content and logic come from a commercial app (© its developer). The music-theory facts
(intervals, scale patterns, the 2-5-1, etc.) are general knowledge. The specific packs
(names, voicings, velocities, the "Just the Two of Us" arrangement) are the developer's
material. Check your rights before shipping them in a distributed product. For a public
project, rewriting the content in your own voicings is the safe route.
