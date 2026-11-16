# GarageBand chord detection: recovered rules

How GarageBand 10.4.14 decides which chord you're playing, written up and ported to Python
for use in a piano-trainer project.

| File | Contents |
|---|---|
| `DETECTION_RULES.md` | The full spec: algorithms, vote tables, special cases, and where each is used |
| `gb_chord_detector.py` | Python port of the rule-based detector (no dependencies) |

```bash
python3 gb_chord_detector.py
```
```python
from gb_chord_detector import detect, find_root
detect([52, 60, 67, 72])   # {'name': 'C/E', 'root': 0, 'bass': 4, ...}
```

## Compared with ChordLab's detector (`../chordlab-export/chord_detector.py`)

On the 44 chords in ChordLab's built-in packs, both detectors agree on root and bass for **34**.
The 10 differences are all extended jazz voicings:

| Notes | ChordLab | GarageBand |
|---|---|---|
| G F A B E | G13 | Em(b9)/G |
| C E G# Bb D# | C7(#9,#5) | Abadd9(b13)/C |
| Ab F# Bb C F | Ab13 | Fm(b9)/Ab |
| C E Bb D F# A | C13(#11) | D9(b13)/C |

The root and bass in the GarageBand column follow GarageBand's algorithm. The suffix text comes from this port's own namer.

ChordLab is rule-based and dominant-aware: it prefers the bass as root when that makes musical sense.
GarageBand votes for the root that completes the strongest triad.
For a piano trainer, ChordLab's behaviour is usually what students expect for jazz voicings.
GarageBand's is simpler and steadier for pop triads and inversions. You can run both and compare.

## Notes

- Exact: vote tables, special cases, the 7+-note weighting, and which algorithm GarageBand's chord display uses.
  Approximate: tie-breaking and chord-name formatting.
- GarageBand's neural-network root finder is described in the spec, but Apple's trained
  weights are not included.
- This describes how Apple's software works. The Python is an independent reimplementation.
  Apple's licence for GarageBand restricts reverse engineering, so check with your project or employer before
  shipping anything derived from it commercially.
