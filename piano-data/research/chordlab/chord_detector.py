"""
Chord detector — Python reference port of the rules recovered from
ChordLab 1.0.6 (ChordDetector::detect, analyseQuality, isPlausible).

    from chord_detector import detect
    detect([60, 64, 67])        # -> {'name': 'C', ...}
    detect([52, 60, 67])        # -> {'name': 'C/E', ...}

Fidelity (see DETECTION_RULES.md):
  * analyse_quality() and is_plausible() are line-by-line translations (exact).
  * The root-candidate score uses the weights read from the binary, but the
    "suffix length" term uses this file's symbols, not ChordLab's own
    buildSuffix() output, so ties between close candidates may differ.
  * Chord *names* use chord_qualities.json symbols plus simple extensions;
    they are not byte-identical to ChordLab's buildSuffix().
"""
from __future__ import annotations

NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

# ChordQuality ids returned by analyse_quality()
MAJOR, MINOR, DIM, AUG = 0, 1, 2, 3
DOM7, MAJ7, MIN7, MINMAJ7, DIM7, HALFDIM = 6, 7, 8, 9, 10, 11
SUS2, SUS4, SEVEN_SUS4, MAJ7_SUS4, POWER = 32, 33, 38, 40, 41

CHORD_TONES = {
    0: [0, 4, 7], 1: [0, 3, 7], 2: [0, 3, 6], 3: [0, 4, 8],
    4: [0, 4, 7, 9], 5: [0, 3, 7, 9], 6: [0, 4, 7, 10], 7: [0, 4, 7, 11],
    8: [0, 3, 7, 10], 9: [0, 3, 7, 11], 10: [0, 3, 6, 9], 11: [0, 3, 6, 10],
    12: [0, 4, 6, 10], 13: [0, 4, 8, 10], 14: [0, 1, 4, 7, 10], 15: [0, 1, 4, 8, 10],
    16: [0, 3, 4, 7, 10], 17: [0, 1, 3, 4, 8, 10], 18: [0, 2, 4, 7, 10],
    19: [0, 2, 4, 7, 11], 20: [0, 2, 3, 7, 10], 21: [0, 2, 3, 7, 11],
    22: [0, 2, 4, 5, 7, 10], 23: [0, 2, 3, 5, 7, 10], 24: [0, 4, 6, 7, 11],
    25: [0, 2, 4, 7, 9, 10], 26: [0, 2, 4, 7, 9, 11], 27: [0, 2, 3, 7, 9, 10],
    28: [0, 2, 4, 7, 9], 29: [0, 2, 3, 7, 9], 30: [0, 2, 4, 7], 31: [0, 2, 3, 7],
    32: [0, 2, 7], 33: [0, 5, 7], 34: [], 35: [0, 2, 4, 6, 7, 11],
    36: [0, 4, 7, 9, 11], 37: [0, 2, 4, 5, 10], 38: [0, 5, 7, 10],
    39: [0, 2, 5, 7, 10], 40: [0, 5, 7, 11], 41: [0, 7],
}

BASE_SYMBOL = {
    MAJOR: "", MINOR: "m", DIM: "dim", AUG: "aug", DOM7: "7", MAJ7: "maj7",
    MIN7: "m7", MINMAJ7: "m(maj7)", DIM7: "dim7", HALFDIM: "m7b5",
    SUS2: "sus2", SUS4: "sus4", SEVEN_SUS4: "7sus4", MAJ7_SUS4: "maj7sus4", POWER: "5",
}

# isPlausible weight tables (DAT_1007d5914 / DAT_1007d593c), indexed by quality-2
_W_B6 = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1]
_W_B5 = [0, 1, 1, 1, 1, 1, 1, 1, 0, 0]


def _pc(n: int) -> int:
    return n % 12


def analyse_quality(iv: set[int]) -> int:
    """Classify a set of intervals (relative to a candidate root). Exact port."""
    h = iv.__contains__
    if h(4):
        if h(10):
            return DOM7
        if h(11):
            return MAJ7
        return AUG if (not h(7) and h(8)) else MAJOR
    if h(3):
        if not h(6) or h(7):
            if h(10):
                return MIN7
            return MINMAJ7 if h(11) else MINOR
        if h(10):
            return HALFDIM
        if h(11):
            return MINMAJ7
        return DIM7 if h(9) else DIM
    if h(5):
        if h(11):
            return MAJ7_SUS4
        return SEVEN_SUS4 if h(10) else SUS4
    if h(2) and not h(10) and not h(11):
        if iv <= {0, 2, 7}:
            return SUS2
    elif h(10):
        return DOM7
    elif h(11):
        return MAJ7
    return POWER if (len(iv) <= 2 and h(7)) else MAJOR


def is_plausible(q: int, iv: set[int]) -> bool:
    """Reject readings that make no musical sense for this root. Exact port."""
    h = iv.__contains__
    has_third = h(3) or h(4)
    has_seventh = h(10) or h(11)
    not_dim_family = q not in (DIM, DIM7, HALFDIM)
    not_aug = q != AUG

    if h(6) and not_dim_family and not has_seventh and not h(7):
        return False
    if h(8) and not_aug and not has_seventh:
        return False
    if h(1) and not has_seventh:
        return False
    if h(1) and h(3) and not h(4):
        return False
    if h(11) and not (h(3) or h(4) or h(5)) and not h(7):
        return False
    if h(5) and h(6) and not_dim_family:
        return False
    if q == DOM7 and not has_third:
        if not any(((p + 6) % 12) in iv for p in iv):
            return False
    if h(11):
        i = q - 2
        w_b6, w_b5 = (_W_B6[i], _W_B5[i]) if 0 <= i < 10 else (1, 1)
        clashes = (h(8) and w_b6) + h(1) + (h(3) and h(4)) + (h(6) and w_b5)
        if clashes > 1:
            return False
    if h(5) and h(4) and not h(10):
        return False
    if h(3) and h(4) and not h(10):
        return False
    if h(3) and not h(4) and h(8) and not_aug:
        return False
    if h(6) and h(8) and not h(7):
        if not h(4):
            return False
        if has_seventh:
            return True
    elif has_seventh:
        return True
    if not has_seventh:
        if h(9) and h(5) and (h(3) or h(4)):
            return False
    if not has_third and not has_seventh:
        return iv <= {0, 2, 7} or iv <= {0, 5, 7}
    return True


def suffix(q: int, iv: set[int]) -> str:
    """Readable suffix: base quality + extensions/alterations present."""
    base = BASE_SYMBOL.get(q, "")
    h = iv.__contains__
    seventh = h(10) or h(11)
    ext, alt = [], []
    if q in (DOM7, MAJ7, MIN7, MINMAJ7, HALFDIM, SEVEN_SUS4, MAJ7_SUS4):
        if h(9) and q != DIM7:
            ext = ["13"]
        elif h(5) and q not in (SEVEN_SUS4, MAJ7_SUS4):
            ext = ["11"]
        elif h(2):
            ext = ["9"]
        if ext:  # promote 7 -> 9/11/13
            base = base.replace("7", ext[0], 1)
        if h(1):
            alt.append("b9")
        if h(3) and h(4):
            alt.append("#9")
        if h(6) and q not in (HALFDIM,):
            alt.append("#11")
        if h(8) and q != AUG:
            alt.append("b13" if h(7) else "#5")
        if ext and ext[0] in ("11", "13") and not h(2):
            pass
    elif q in (MAJOR, MINOR) and not seventh:
        if h(9) and h(2):
            base += "6/9"
        elif h(9):
            base += "6"
        elif h(2):
            base += "(add9)" if q == MINOR else "add9"
        if h(5):
            alt.append("add11")
    elif q in (SUS2, SUS4) and h(9):
        base = "6" + base
    if q == MAJOR and not h(4) and not h(3) and q != POWER and len(iv) > 1:
        base += "(omit3)" if not alt else ""
    return base + (f"({','.join(alt)})" if alt else "")


def _score(cand: int, bass: int, q: int, iv: set[int], name_len: int) -> int:
    h = iv.__contains__
    missing = sum(1 for t in CHORD_TONES.get(q, []) if t not in iv)
    no_seventh = 0 if (h(10) or h(11)) else 3
    fifth_and_b6 = 4 if (h(7) and h(8)) else 0
    dom11 = 10 if (h(4) and h(10) and h(5)) else 0
    bass_iv = (bass - cand) % 12
    bad_bass = 0
    if bass_iv == 1:
        bad_bass = 6
    elif bass_iv == 6 and q not in (DIM, DIM7, HALFDIM):
        bad_bass = 6
    elif bass_iv == 8 and q != AUG:
        bad_bass = 6
    elif bass_iv == 3 and h(4):
        bad_bass = 6
    penalty = no_seventh + fifth_and_b6 + dom11 + missing * 5 + bad_bass + name_len
    return (cand - bass) % 12 + penalty * 12


def detect(midi_notes: list[int]) -> dict | None:
    """Return {'name', 'root', 'bass', 'quality', 'intervals'} or None."""
    if len(midi_notes) < 2:
        return None
    notes = sorted(midi_notes)
    pcs = sorted({_pc(n) for n in notes})
    if len(pcs) < 2:
        return None
    bass = _pc(notes[0])

    def rel(root: int) -> set[int]:
        return {(p - root) % 12 for p in pcs}

    def result(root: int, q: int, iv: set[int]) -> dict:
        name = NOTE_NAMES[root] + suffix(q, iv)
        if root != bass:
            name += "/" + NOTE_NAMES[bass]
        return {"name": name, "root": root, "bass": bass, "quality": q,
                "intervals": sorted(iv)}

    # 1. bass as root
    iv = rel(bass)
    q = analyse_quality(iv)
    if is_plausible(q, iv) and (3 in iv or 4 in iv or q in (SUS2, SUS4, SEVEN_SUS4, MAJ7_SUS4, POWER)):
        return result(bass, q, iv)

    # 2. slash chord: upper notes form a root-position major/minor triad
    upper = []
    for n in notes[1:]:
        p = _pc(n)
        if p != bass and p not in upper:
            upper.append(p)
    if len(upper) == 3:
        r = upper[0]
        if set(upper) in ({r, (r + 4) % 12, (r + 7) % 12}, {r, (r + 3) % 12, (r + 7) % 12}):
            ivr = rel(r)
            qr = analyse_quality(ivr)
            if is_plausible(qr, ivr):
                return result(r, qr, ivr)

    # 3. score every other pitch class as root (lowest score wins)
    best = None
    for cand in pcs:
        if cand == bass:
            continue
        ivc = rel(cand)
        qc = analyse_quality(ivc)
        if not is_plausible(qc, ivc):
            continue
        s = _score(cand, bass, qc, ivc, len(suffix(qc, ivc)))
        if best is None or s < best[0]:
            best = (s, cand, qc, ivc)
    if best:
        return result(best[1], best[2], best[3])

    # bass reading was plausible but had no third: still use it
    if is_plausible(q, iv):
        return result(bass, q, iv)

    # 4. tritone only -> rootless dominant 7 shell (root a major 3rd below bass)
    if len(pcs) == 2 and (pcs[1] - pcs[0]) % 12 == 6:
        root = (bass - 4) % 12
        return {"name": NOTE_NAMES[root] + "7(no root)", "root": root, "bass": bass,
                "quality": DOM7, "intervals": sorted(rel(root))}

    # 5. fallback: name on the bass
    return result(bass, q, iv)


if __name__ == "__main__":
    tests = {
        "C": [60, 64, 67], "Cm": [60, 63, 67], "Cdim": [60, 63, 66], "Caug": [60, 64, 68],
        "C7": [60, 64, 67, 70], "Cmaj7": [60, 64, 67, 71], "Cm7": [60, 63, 67, 70],
        "Cm7b5": [60, 63, 66, 70], "Cdim7": [60, 63, 66, 69], "Csus4": [60, 65, 67],
        "Csus2": [60, 62, 67], "C5": [60, 67], "C/E": [52, 60, 67, 72],
        "Am7 (C6 shape)": [57, 60, 64, 67], "Dm9": [50, 53, 57, 60, 64],
        "G7 shell (B-F)": [59, 65], "C/G": [55, 60, 64, 67],
    }
    for label, notes in tests.items():
        r = detect(notes)
        print(f"{label:16} {str(notes):24} -> {r['name'] if r else None}")
