"""
Music-theory engine: Python port of rules recovered from GarageBand 10.4.14
MAHarmony.framework (see THEORY_RULES.md for sources and exact/inferred status).

    from theory_engine import spell_note, SCALES, detect_key, roman_numeral, chord_name

No dependencies. Pitch classes: 0=C .. 11=B.
"""
from __future__ import annotations

LETTERS = "CDEFGAB"
LETTER_PC = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
ACC = {-2: "bb", -1: "b", 0: "", 1: "#", 2: "##"}

# ---------------------------------------------------------------- spelling
# MakeSensefulEnhForKeyNrAssumingCMajor default (exact): which accidental each
# black key gets when there is no context.
DEFAULT_SPELLING = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
# MakeSensefulEnhForKeyNrMajorScaleRootWithLeastSigns (exact): key roots.
KEY_ROOT_SPELLING = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
# Key candidates in CHarmCenterWeightAnalysis (exact): flats for pc 1,3,6,8,10.
KEY_CANDIDATE_SPELLING = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

MAJOR = (0, 2, 4, 5, 7, 9, 11)
NAT_MINOR = (0, 2, 3, 5, 7, 8, 10)


def _parse(name: str) -> tuple[str, int]:
    acc = name[1:]
    return name[0], {"bb": -2, "b": -1, "": 0, "#": 1, "##": 2}[acc]


def _spell_degree(root_name: str, degree: int, pc: int) -> str:
    """Spell pitch class `pc` as the letter `degree` steps above `root_name`."""
    letter = LETTERS[(LETTERS.index(root_name[0]) + degree) % 7]
    diff = (pc - LETTER_PC[letter] + 6) % 12 - 6
    return letter + ACC.get(diff, "?")


def scale_spelling(root_name: str, intervals) -> list[str]:
    """Spell a 7-note scale with one letter per degree (as CScaleHeavy does)."""
    r = (LETTER_PC[root_name[0]] + _parse(root_name)[1]) % 12
    return [_spell_degree(root_name, i, (r + iv) % 12) for i, iv in enumerate(intervals)]


def key_signature_count(key: str, mode: str = "major") -> int:
    """Signed accidentals in a key signature (+sharps / -flats)."""
    notes = scale_spelling(key, MAJOR if mode == "major" else NAT_MINOR)
    return sum(n.count("#") for n in notes) - sum(n.count("b") for n in notes)


def spell_note(pc: int, key: str | None = None, mode: str = "major") -> str:
    """Spell a pitch class. In a key: diatonic notes take the key's spelling;
    chromatic notes follow the key's accidental direction. Without a key: GarageBand's
    C-major default (C# Eb F# G# Bb)."""
    pc %= 12
    if key is None:
        return DEFAULT_SPELLING[pc]
    scale = scale_spelling(key, MAJOR if mode == "major" else NAT_MINOR)
    for n in scale:
        if (LETTER_PC[n[0]] + _parse(n)[1]) % 12 == pc:
            return n
    flats = key_signature_count(key, mode) < 0
    sharp = {1: "C#", 3: "D#", 6: "F#", 8: "G#", 10: "A#"}
    flat = {1: "Db", 3: "Eb", 6: "Gb", 8: "Ab", 10: "Bb"}
    if pc in sharp:
        return flat[pc] if flats else sharp[pc]
    # white-key pitch class not in scale (e.g. B natural in F major) -> natural
    return DEFAULT_SPELLING[pc]


# ---------------------------------------------------------------- scales
# CScaleHeavy::mScaleData (exact intervals; type ids are GarageBand's TScaleType)
SCALES = {
    1: ("Major (Ionian)", (0, 2, 4, 5, 7, 9, 11)),
    2: ("Natural Minor (Aeolian)", (0, 2, 3, 5, 7, 8, 10)),
    3: ("Chromatic", tuple(range(12))),
    4: ("Major / Minor", (0, 2, 3, 4, 5, 7, 9, 10, 11)),
    5: ("Bebop Dominant", (0, 2, 4, 5, 7, 9, 10, 11)),
    6: ("Harmonic Minor", (0, 2, 3, 5, 7, 8, 11)),
    7: ("Melodic Minor", (0, 2, 3, 5, 7, 9, 11)),
    8: ("Major Pentatonic", (0, 2, 4, 7, 9)),
    9: ("Minor Pentatonic", (0, 3, 5, 7, 10)),
    10: ("Major Blues", (0, 2, 3, 4, 7, 9)),
    11: ("Minor Blues", (0, 3, 5, 6, 7, 10)),
    12: ("Lydian", (0, 2, 4, 6, 7, 9, 11)),
    13: ("Mixolydian", (0, 2, 4, 5, 7, 9, 10)),
    14: ("Dorian", (0, 2, 3, 5, 7, 9, 10)),
    15: ("Phrygian", (0, 1, 3, 5, 7, 8, 10)),
    16: ("Locrian", (0, 1, 3, 5, 6, 8, 10)),
    17: ("Phrygian Dominant", (0, 1, 4, 5, 7, 8, 10)),
    18: ("Miyako-Bushi (Japanese)", (0, 1, 5, 7, 8)),
    19: ("South-East Asian", (0, 1, 3, 7, 8)),
    21: ("Half-Whole Diminished", (0, 1, 3, 4, 6, 7, 9, 10)),
    22: ("Whole-Half Diminished", (0, 2, 3, 5, 6, 8, 9, 11)),
    23: ("Bebop Major", (0, 2, 4, 5, 7, 8, 9, 11)),
    24: ("Bebop Dominant (alt. entry)", (0, 2, 4, 5, 7, 9, 10, 11)),
    25: ("Bebop Melodic Minor", (0, 2, 3, 5, 7, 8, 9, 11)),
    26: ("Bebop Harmonic Minor", (0, 2, 3, 5, 7, 8, 10, 11)),
    27: ("Mixolydian #11", (0, 2, 4, 6, 7, 9, 10)),
    28: ("Locrian 9", (0, 2, 3, 5, 6, 8, 10)),
    29: ("Super Locrian (Altered)", (0, 1, 3, 4, 6, 8, 10)),
    30: ("Double Harmonic (Byzantine)", (0, 1, 4, 5, 7, 8, 11)),
}


def mode_of(intervals, degree: int) -> tuple:
    """Rotate a scale to start on `degree` (0-based). Used for HM1..HM7 / MM1..MM7 names."""
    iv = list(intervals)
    base = iv[degree]
    return tuple(sorted((x - base) % 12 for x in iv))


# ---------------------------------------------------------------- chord naming
# _BasicChordName_ChordNaming_Normal (exact strings)
BASIC_CHORD_NAMES = {1: "", 2: "m", 3: "aug", 4: "b5", 5: "dim", 6: "sus4", 7: "sus2", 8: "5", 0: "no3"}
# CChordHeavy::_OptionName_ChordNaming_Normal (exact strings; b/# become ♭/♯ unless ASCII pref)
OPTION_NAMES = {0: "b9", 1: "add b9", 2: "9", 3: "add 9", 4: "#9", 5: "b3", 6: "3", 7: "11",
                8: "add 11", 9: "#11", 10: "b5", 11: "5", 12: "b13", 13: "#5", 14: "13",
                15: "7", 16: "6", 17: "ma7", 18: "j7", 19: "maj7"}


def basic_chord(iv: set[int]) -> int:
    """BasicChordForNaming (inferred from the TBasicChord vocabulary)."""
    h = iv.__contains__
    if h(4):
        if h(7):
            return 1
        if h(8):
            return 3
        if h(6):
            return 4
        return 1
    if h(3):
        if h(7):
            return 2
        if h(6):
            return 5
        return 2
    if h(5):
        return 6
    if h(2):
        return 7
    if iv <= {0, 7}:
        return 8
    return 0


def chord_name(root: int, intervals, bass: int | None = None, key: str | None = None,
               unicode: bool = False, maj7_style: str = "maj7") -> str:
    """root pc + basic chord + options (+ /bass). Vocabulary exact; option selection
    and order inferred (sevenths first, then tensions low to high)."""
    iv = {i % 12 for i in intervals} | {0}
    bc = basic_chord(iv)
    h = iv.__contains__
    base = BASIC_CHORD_NAMES[bc]
    opts: list[str] = []
    if bc == 5 and h(9) and not h(10):
        base, bc = "dim", 5
        opts.append("7")                      # dim7
    elif h(10):
        if bc == 5:
            base = "m"
            opts += ["7", "b5"]               # m7b5
        else:
            opts.append("7")
    elif h(11):
        opts.append(maj7_style)
    elif h(9) and bc in (1, 2):
        opts.append("6")
    seventh = h(10) or h(11)
    if h(1):
        opts.append("b9" if seventh else "add b9")
    if h(2) and bc not in (7,):
        opts.append("9" if seventh else "add 9")
    if h(3) and h(4):
        opts.append("#9")
    if h(5) and bc not in (6,):
        opts.append("11" if seventh else "add 11")
    if h(6) and bc in (1, 2) and h(7):
        opts.append("#11")
    if h(8) and bc in (1, 2) and h(7):
        opts.append("b13")
    if h(9) and seventh and not (bc == 5 and not h(10)):
        opts.append("13")
    # collapse 7 + 9/11/13 into the highest extension (common display form)
    exts = [o for o in ("13", "11", "9") if o in opts]
    if exts and bc != 5:
        if "7" in opts:
            opts.remove("7")
            for e in exts:
                opts.remove(e)
            opts.insert(0, exts[0])
        elif maj7_style in opts:
            for e in exts:
                opts.remove(e)
            opts[opts.index(maj7_style)] = maj7_style.replace("7", exts[0])
    if base == "m" and opts and opts[0].startswith(maj7_style[:-1]):
        opts[0] = "(" + opts[0] + ")"
    root_name = spell_note(root, key) if key else KEY_ROOT_SPELLING[root % 12]
    name = root_name + base + ("".join(opts[:1]) + ("(" + ",".join(opts[1:]) + ")" if len(opts) > 1 else "") if opts else "")
    if bass is not None and bass % 12 != root % 12:
        name += "/" + (spell_note(bass, key) if key else DEFAULT_SPELLING[bass % 12])
    if unicode:
        name = name.replace("b", "♭").replace("#", "♯").replace("A♭", "A♭")
    return name


# ---------------------------------------------------------------- roman numerals
# CChordHeavy::HarmFuncIn + HarmFuncName (exact)
ROMAN = {0: "I", 1: "Im", 2: "II", 3: "IIm", 4: "IIdim", 5: "III", 6: "IIIm", 7: "IV", 8: "IVm",
         9: "V", 10: "Vm", 11: "VI", 12: "VIm", 13: "bVII", 14: "VIIdim"}
FUNCTION_THEORY = {0: "T", 1: "t", 2: "DD / SP", 3: "Sp", 5: "TG|P", 6: "Sp|IIIm(in minor)", 7: "S",
                   8: "s", 9: "D", 10: "d", 11: "TP|sP = G", 12: "Tp|sp", 13: "SS|sp", 14: "VIIdim (in minor)"}
# degree -> {basic chord -> function index}
_HARMFUNC = {0: {1: 0, 2: 1}, 1: {1: 2, 2: 3, 5: 4}, 2: {1: 5, 2: 6}, 3: {1: 7, 2: 8},
             4: {1: 9, 2: 10, 6: 9, 7: 9}, 5: {1: 11, 2: 12}, 6: {5: 14}}


def roman_numeral(chord_root: int, chord_intervals, key_root: int, mode: str = "major") -> str:
    """Roman numeral of a chord in a key, GarageBand style (I, IIm, V, VIm, VIIdim...).
    Returns 'undef' for non-diatonic roots or unsupported qualities."""
    scale = MAJOR if mode == "major" else NAT_MINOR
    rel = (chord_root - key_root) % 12
    if rel not in scale:
        return "undef"
    deg = scale.index(rel)
    bc = basic_chord({i % 12 for i in chord_intervals} | {0})
    idx = _HARMFUNC.get(deg, {}).get(bc)
    return ROMAN[idx] if idx is not None else "undef"


# ---------------------------------------------------------------- key detection
# CHarmAnlsProgressions (exact patterns & weights). Chord = (semitones above centre, quality)
TONIC_PROGRESSIONS = [
    (9, "major", [(7, "7"), (0, "maj")]), (8, "major", [(7, "maj"), (0, "maj")]),
    (8, "major", [(0, "maj"), (5, "maj")]), (8, "major", [(11, "dim"), (0, "maj")]),
    (8, "major", [(1, "7"), (0, "maj")]), (8, "major", [(2, "min"), (7, "maj"), (0, "maj")]),
    (6, "major", [(5, "min"), (7, "maj"), (0, "maj")]),
    (8, "major", [(9, "maj"), (2, "min"), (7, "maj"), (0, "maj")]),
    (4, "major", [(5, "maj"), (5, "min"), (0, "maj")]),
    (10, "major", [(5, "maj"), (2, "m7b5"), (0, "maj")]),
    (4, "major", [(5, "maj"), (7, "maj"), (9, "min")]),
    (4, "major", [(0, "maj"), (5, "maj"), (2, "m7b5"), (0, "maj")]),
    (8, "minor", [(2, "min"), (7, "maj"), (0, "min")]), (8, "minor", [(2, "dim"), (7, "maj"), (0, "min")]),
    (4, "minor", [(7, "maj"), (0, "min")]),
]
CADENCE_PROGRESSIONS = [
    (8, "major", [(9, "min"), (2, "min"), (7, "maj"), (0, "maj")]),
    (8, "major", [(2, "min"), (7, "maj"), (0, "maj")]), (4, "major", [(7, "maj"), (0, "maj")]),
    (4, "major", [(7, "maj"), (9, "min")]), (2, "major", [(2, "min"), (7, "maj")]),
    (8, "minor", [(2, "min"), (7, "maj"), (0, "min")]), (8, "minor", [(2, "dim"), (7, "maj"), (0, "min")]),
    (4, "minor", [(7, "maj"), (0, "min")]),
]


def _quality(iv: set[int]) -> str:
    """CSemitonesMatch templates: maj, min, 7 (dominant), dim, m7b5."""
    h = iv.__contains__
    if h(4) and not h(3) and h(10) and not h(11):
        return "7"
    if h(4):
        return "maj"
    if h(3) and h(6) and not h(7):
        return "m7b5" if h(10) else "dim"
    if h(3):
        return "min"
    return "?"


def _matches(spec: str, q: str) -> bool:
    return spec == q or (spec == "maj" and q == "7")   # major template allows a 7th


def detect_key(chords, durations=None, allow_minor: bool = True) -> dict:
    """chords: list of (root_pc, intervals). Returns best key + reasoning.

    Pass 1 (exact patterns): look for tonic/cadence progressions; strongest weight wins.
    Pass 2 (CHarmCenterWeightAnalysis, exact): every key whose scale contains all chord
    tones gets +duration; +10% if the chord root is the key root; another +10% if that
    chord is also first or last. Parallel major/minor: the one whose tonic triad occurs
    wins. Equal score: fewer accidentals preferred."""
    n = len(chords)
    durations = durations or [1.0] * n
    q = [(r % 12, _quality({i % 12 for i in iv} | {0})) for r, iv in chords]

    best_prog = None
    for kind, table in (("tonic", TONIC_PROGRESSIONS), ("cadence", CADENCE_PROGRESSIONS)):
        for weight, mode, pattern in table:
            if mode == "minor" and not allow_minor:
                continue
            L = len(pattern)
            for s in range(n - L + 1):
                centre = (q[s][0] - pattern[0][0]) % 12
                if all((q[s + k][0] - centre) % 12 == pattern[k][0] and _matches(pattern[k][1], q[s + k][1])
                       for k in range(L)):
                    cand = (weight, kind, centre, mode, s)
                    if best_prog is None or cand[0] > best_prog[0]:
                        best_prog = cand

    scores = {}
    modes = ("major", "minor") if allow_minor else ("major",)
    for mode in modes:
        scale = MAJOR if mode == "major" else NAT_MINOR
        for k in range(12):
            w = 0.0
            for i, (r, iv) in enumerate(chords):
                pcs = {(r + x) % 12 for x in iv} | {r % 12}
                if all((p - k) % 12 in scale for p in pcs):
                    w += durations[i]
                    if r % 12 == k:
                        w += 0.1 * durations[i]
                        if i in (0, n - 1):
                            w += 0.1 * durations[i]
            scores[(k, mode)] = w

    def has_tonic(k, mode):
        want = "maj" if mode == "major" else "min"
        return any(r == k and qq == want for r, qq in q)

    best = None
    for (k, mode), w in scores.items():
        if best is None:
            best = (k, mode, w); continue
        bk, bm, bw = best
        parallel_win = (k == bk and mode != bm and has_tonic(k, mode) and not has_tonic(bk, bm))
        if w > bw or parallel_win:
            best = (k, mode, w)
        elif w == bw:
            if abs(key_signature_count(KEY_CANDIDATE_SPELLING[k], mode)) < \
               abs(key_signature_count(KEY_CANDIDATE_SPELLING[bk], bm)):
                best = (k, mode, w)

    result = {"weight_key": f"{KEY_CANDIDATE_SPELLING[best[0]]} {best[1]}", "weight": round(best[2], 2)}
    if best_prog:
        w, kind, centre, mode, at = best_prog
        result["progression_key"] = f"{KEY_CANDIDATE_SPELLING[centre]} {mode}"
        result["progression"] = f"{kind} pattern (weight {w}) at chord {at}"
        result["key"] = result["progression_key"]
    else:
        result["key"] = result["weight_key"]
    return result


# ---------------------------------------------------------------- solfege (exact tables)
SOLFEGE_DEFAULT_TI = ["Do", "Do", "Re", "Mi", "Mi", "Fa", "Fa", "Sol", "Sol", "La", "Ti", "Ti"]  # RomanString3Ti
SOLFEGE_DEFAULT_SI = ["Do", "Do", "Re", "Mi", "Mi", "Fa", "Fa", "Sol", "Sol", "La", "Si", "Si"]  # RomanString3Si


if __name__ == "__main__":
    print("Spelling, no key:", [spell_note(p) for p in range(12)])
    print("Spelling in Eb major:", [spell_note(p, "Eb") for p in (3, 5, 7, 8, 10, 0, 2, 6)])
    print("Key roots (least signs):", KEY_ROOT_SPELLING)
    print("D Dorian:", scale_spelling("D", SCALES[14][1]))
    print("Bb Bebop Dominant intervals:", SCALES[5][1])
    print()
    for root, iv, bass in [(0, [0, 4, 7], None), (9, [0, 3, 7, 10], None), (7, [0, 4, 7, 10, 2], None),
                           (0, [0, 3, 6, 10], None), (0, [0, 3, 6, 9], None), (0, [0, 4, 7], 4),
                           (2, [0, 3, 7, 10, 2], None), (5, [0, 4, 7, 11, 2], None), (7, [0, 5, 7], None)]:
        print(f"chord_name({root}, {iv}, bass={bass}) -> {chord_name(root, iv, bass)}")
    print()
    for r, iv in [(0, [0, 4, 7]), (2, [0, 3, 7]), (7, [0, 4, 7, 10]), (9, [0, 3, 7]), (11, [0, 3, 6])]:
        print(f"roman in C major: root {r} {iv} -> {roman_numeral(r, iv, 0)}")
    print()
    prog = [(2, [0, 3, 7, 10]), (7, [0, 4, 7, 10]), (0, [0, 4, 7, 11])]          # Dm7 G7 Cmaj7
    print("Dm7-G7-Cmaj7:", detect_key(prog))
    prog = [(9, [0, 3, 7]), (5, [0, 4, 7]), (0, [0, 4, 7]), (7, [0, 4, 7])]       # Am F C G
    print("Am-F-C-G:", detect_key(prog))
    prog = [(5, [0, 3, 7]), (10, [0, 3, 7]), (0, [0, 4, 7]), (5, [0, 3, 7])]      # Fm Bbm C Fm
    print("Fm-Bbm-C-Fm:", detect_key(prog))
