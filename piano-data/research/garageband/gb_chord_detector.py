"""
GarageBand-style chord root detection — Python reference port.

Recovered from GarageBand 10.4.14, MAHarmony.framework:
  CChordHeavy::SetRootNoteAndEnh_ToLikeliestRegardingNoteSet(algo = 0)
  CChordHeavy::ProbThatNoteIsRootNote
This is the algorithm GarageBand's control-bar chord display uses
(-[TransportDisplayController updateElement:] calls it with algo 0).

    from gb_chord_detector import detect
    detect([52, 60, 67])   # {'name': 'C/E', 'root': 0, 'bass': 4, ...}

Fidelity: root voting tables, special cases and 7+-note weighting are exact.
Tie-breaking is closely approximated. Chord *naming* (suffix text) is this
file's own — GarageBand's CChordHeavy::Name was not ported.
"""
from __future__ import annotations

NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

# Root-vote tables (MAHarmony __TEXT,__const). Index = interval of a sounding
# pitch class ABOVE the candidate root. Chosen by number of distinct pitch classes.
VOTES_1_2 = [3, 0, 0, 2, 2, 0, 0, 1, 0, 0, 2, 2]          # 0xfe94c
VOTES_3   = [18, 0, 2, 12, 12, 2, 2, 14, 1, 2, 5, 5]      # 0xfe97c
VOTES_4_6 = [18, 0, 3, 12, 12, 3, 3, 14, 0, 3, 3, 3]      # 0xfe9ac
VOTES_7P  = [18, 8, 8, 12, 12, 6, 5, 14, 4, 4, 10, 10]    # 0xfe9dc (lowest 3 intervals x4)


def root_probability(candidate: int, bass: int, intervals: list[int], note_count: int) -> int:
    """ProbThatNoteIsRootNote. `intervals` = sorted distinct pitch classes relative to the bass."""
    s = set(intervals)
    # Special cases (exact interval sets above the bass). Note: GarageBand compares
    # with bass+2 without wrapping, so these never fire when the bass is Bb or B.
    if s == {0, 6, 11} and candidate == bass + 2:
        return 33                       # e.g. C F# B -> D (D13 shell over C)
    if s == {0, 4, 9, 10} and candidate == bass:
        return 45                       # C E A Bb -> C13 shell
    if s == {0, 2, 6, 11} and candidate == bass + 2:
        return 45                       # C D F# B -> D13 shell over C
    if s == {0, 3, 6, 10} and candidate == bass:
        return 48                       # m7b5 stays on the bass (not m6 inversion)
    if len(s) == 2 and note_count == 3 and s == {0, 7} and candidate == bass:
        return 5                        # doubled power chord

    n = len(intervals)
    table = VOTES_1_2 if n <= 2 else VOTES_3 if n == 3 else VOTES_4_6 if n <= 6 else VOTES_7P
    score = 0
    for idx, iv in enumerate(intervals):
        pc = (bass + iv) % 12
        w = table[(pc - candidate) % 12]
        if n >= 7 and idx < 3:
            w <<= 2                     # lowest three pitch classes count 4x
        score += w
    return score


def find_root(midi_notes: list[int]) -> tuple[int, int] | None:
    """Return (root_pc, bass_pc) like SetRootNoteAndEnh_ToLikeliestRegardingNoteSet(algo 0)."""
    if not midi_notes:
        return None
    notes = sorted(set(midi_notes))
    bass = notes[0] % 12
    intervals = sorted({(n - notes[0]) % 12 for n in notes})
    pcs = {(bass + i) % 12 for i in intervals}

    def dist(a: int, b: int) -> int:
        d = abs(a - b) % 12
        return min(d, 12 - d)

    best_pc, best = -1, 0
    for cand in range(12):
        p = root_probability(cand, bass, intervals, len(notes))
        if p > best:
            best_pc, best = cand, p
        elif p == best and best_pc >= 0 and cand in pcs and dist(cand, bass) < dist(best_pc, bass):
            best_pc = cand              # tie -> sounding note closer to the bass wins
    return (best_pc if best_pc >= 0 else bass), bass


# ---- naming (not GarageBand's formatter; readable symbols from intervals) ----
def _suffix(iv: set[int]) -> str:
    h = iv.__contains__
    if h(4):
        q = "aug" if (h(8) and not h(7)) else ""
    elif h(3):
        q = "dim" if (h(6) and not h(7)) else "m"
    elif h(5):
        q = "sus4"
    elif h(2):
        q = "sus2"
    else:
        q = "5" if iv <= {0, 7} else "(no3)"
    sev = "maj7" if h(11) else ("7" if h(10) else "")
    if q == "dim" and h(10):
        return "m7b5" + _tensions(iv, {0, 3, 6, 10})
    if q == "dim" and h(9) and not sev:
        return "dim7"
    ext = ""
    if sev:
        top = "13" if h(9) else "11" if (h(5) and q not in ("sus4",)) else "9" if h(2) else "7"
        sev = sev.replace("7", top) if top != "7" else sev
        if q == "m" and sev.startswith("maj"):
            return "m(" + sev + ")" + _tensions(iv, None)
        ext = sev
    elif h(9) and q in ("", "m"):
        ext = "6/9" if h(2) else "6"
    elif h(2) and q in ("", "m"):
        ext = "add9"
    return q + ext + _tensions(iv, None)


def _tensions(iv: set[int], skip) -> str:
    h = iv.__contains__
    t = []
    if h(1):
        t.append("b9")
    if h(3) and h(4):
        t.append("#9")
    if h(6) and h(7) or (h(6) and h(4)):
        t.append("#11" if h(7) else "b5")
    if h(8) and (h(7) or h(10) or h(11)) and not (h(4) and not h(7)):
        t.append("b13")
    if h(8) and h(4) and not h(7) and (h(10) or h(11)):
        t.append("#5")
    if skip:
        t = [x for x in t if x != "b5"]
    return f"({','.join(t)})" if t else ""


def detect(midi_notes: list[int]) -> dict | None:
    r = find_root(midi_notes)
    if r is None:
        return None
    root, bass = r
    iv = {(n - root) % 12 for n in midi_notes}
    name = NOTE_NAMES[root] + _suffix(iv)
    if bass != root:
        name += "/" + NOTE_NAMES[bass]
    return {"name": name, "root": root, "bass": bass, "intervals_from_root": sorted(iv)}


if __name__ == "__main__":
    tests = {
        "C": [60, 64, 67], "C/E": [52, 60, 67, 72], "C/G": [55, 60, 64, 67],
        "Am7 (C6 shape)": [57, 60, 64, 67], "C6": [60, 64, 67, 69],
        "Cm7b5": [60, 63, 66, 70], "C7": [60, 64, 67, 70], "Cmaj7": [60, 64, 67, 71],
        "Dm9": [50, 53, 57, 60, 64], "Csus4": [60, 65, 67], "C5 (C G C)": [48, 55, 60],
        "C13 shell": [48, 52, 57, 58], "D/C shell": [48, 54, 59],
    }
    for label, notes in tests.items():
        print(f"{label:16} {str(notes):24} -> {detect(notes)['name']}")
