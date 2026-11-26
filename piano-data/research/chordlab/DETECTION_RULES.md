# Chord Detection Rules

Recovered from ChordLab 1.0.6 (macOS, arm64) by decompiling `ChordDetector` with Ghidra 12.2.
`chord_detector.py` is a runnable Python port of these rules.

Notation: intervals are semitones above a candidate root (0–11). "has 4" means the
interval 4 (a major 3rd) is present among the held pitch classes.

| Interval | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Role | root | b9 | 9 | m3 / #9 | M3 | 4 / 11 | b5 / #11 | 5 | #5 / b13 | 6 / 13 | b7 | maj7 |

## Fidelity

| Part | Source function | Confidence |
|---|---|---|
| Quality classification (step 2) | `analyseQuality` @ 0x1004348c0 | Exact translation |
| Plausibility filter (step 3) | `isPlausible` @ 0x100434c80 | Exact translation |
| Quality → chord tones table | `getChordTones` @ 0x100438488 | Exact (read from binary data) |
| Root-search score weights (step 4) | `detect` @ 0x1004334fc | Weights exact; branch order partly inferred |
| Chord name strings | `buildSuffix` @ 0x100435a74 | Approximate (vocabulary known, exact formatting not ported) |

## 1. Input

- Needs at least 2 notes and at least 2 distinct pitch classes; otherwise no chord.
- Notes are sorted; the **lowest note is the bass**.
- Everything else works on the set of pitch classes (octaves and doublings are ignored).

## 2. Classify quality for a candidate root (`analyseQuality`)

Evaluated top to bottom, first match wins:

1. **has 4 (major 3rd)**
   - has 10 → **Dominant 7**
   - has 11 → **Major 7**
   - has 8 and not 7 → **Augmented**
   - else → **Major**
2. **has 3 (minor 3rd)**
   - if has 7 or not 6 (normal fifth):
     has 10 → **Minor 7**; has 11 → **Minor-Major 7**; else → **Minor**
   - else (b5, no 5):
     has 10 → **Half-diminished (m7b5)**; has 11 → **Minor-Major 7**; has 9 → **Diminished 7**; else → **Diminished**
3. **no 3rd, has 5** → has 11 → **Maj7sus4**; has 10 → **7sus4**; else → **sus4**
4. **no 3rd, has 2, no 10/11** → if every interval is in {0,2,7} → **sus2**, else fall to rule 6
5. **no 3rd**: has 10 → **Dominant 7**; has 11 → **Major 7**
6. at most 2 pitch classes and has 7 → **Power chord (5)**; otherwise → **Major**

So the detector only ever returns these base qualities:
Major, Minor, Dim, Aug, 7, maj7, m7, m(maj7), dim7, m7b5, sus2, sus4, 7sus4, maj7sus4, 5.
Extensions (9, 11, 13) and alterations (b9, #9, #11, #5/b13) are added afterwards by the
name builder from the intervals that are present.

## 3. Reject implausible readings (`isPlausible`)

Definitions: *third* = has 3 or 4. *seventh* = has 10 or 11.
*dim family* = Dim, Dim7, m7b5.

A reading is **rejected** if any of the following hold:

1. has 6 (b5/#11), not dim family, no seventh, and no 5.
2. has 8 (b6/#5), quality is not Augmented, and no seventh.
3. has 1 (b9) and no seventh.
4. has 1 (b9) with a minor 3rd but no major 3rd.
5. has 11 (maj7) with no 3rd, no 4th, and no 5th.
6. has 5 and 6 together, not dim family.
7. Quality is Dominant 7 with no third, and no two notes form a tritone.
8. has 11 (maj7) and more than one of these "clashes": b6 (8), b9 (1), both 3rds (3+4), b5 (6).
   For qualities Dim / dim7 / m7b5 / Major 6 the b6 or b5 clash is not counted
   (weight tables `0x1007d5914` = `[1,0,1,1,1,1,1,1,1,1]` and `0x1007d593c` = `[0,1,1,1,1,1,1,1,0,0]`, indexed by quality−2).
9. has 5 (4th/11) with a major 3rd but no b7.
10. has both 3rds (#9) but no b7.
11. minor 3rd only plus b6, not Augmented.
12. has 6 and 8 without the 5: rejected unless it has a major 3rd.
13. No seventh, has 6th (9) + 4th (5) + a third.
14. No third and no seventh: accepted only if all intervals are in {0,2,7} or in {0,5,7}.

Otherwise the reading is accepted.

## 4. Choose the root (`detect`)

1. **Bass as root.** Classify relative to the bass. If plausible (and it has a third or is a sus/power
   shape), that is the chord. Root position wins whenever it makes sense.
2. **Slash chord.** If the notes above the bass are exactly 3 pitch classes forming a
   root-position major or minor triad (rooted on the lowest upper note), name it
   `<triad>/<bass>`.
3. **Inversion search.** Try every other held pitch class as root. Keep plausible readings and
   pick the **lowest score**:

   ```
   score = ((candidate - bass) mod 12)            # tie-break: closer to bass wins
         + 12 * ( 5 * missing_chord_tones          # tones of the quality template not held
                + 3 if no 7th (10/11)
                + 4 if both 5 and b6 present
                + 10 if major 3rd + b7 + natural 11 (5)
                + 6 if bass is an awkward interval above the root:
                      b9; b5 (unless dim family); #5 (unless Aug); m3 when chord has M3
                + length of the chord-suffix string )   # simpler names preferred
   ```
   On equal scores the earlier candidate (lower pitch class) is kept.
4. **Tritone only** (2 pitch classes, 6 semitones apart): read as a rootless dominant-7 shell,
   root a major 3rd below the bass (e.g. B+F → G7).
5. **Fallback:** name it on the bass.

## 5. Naming (`buildSuffix`)

Recovered suffix vocabulary: `m`, `maj`, `(maj…)`, `dim`, `aug`, `6`, `6/9`, `7`, `9`, `11`, `13`,
`sus2`, `sus4`, `add`, `(add…)`, `(omit 3)`, and alterations `b9`, `#9`, `#11`, `#5`
joined with commas inside parentheses, e.g. `C7(#9,#5)`. Quality 34 ("Custom") always gets `?`.
Note names come from `noteNameFromPitchClass`. `chord_detector.py` follows this vocabulary,
but the exact ordering and formatting are approximate.
