"""
ChordLab-style practice engine — dependency-free Python reimplementation.

Rules recovered from ChordLab 1.0.6 (SpacedRepetitionEngine, Fsrs, PracticePanel,
TempoEngine). See PRACTICE_RULES.md for sources and confidence per rule.

Units: accuracy 0..1, quality 0..5, BPM, time in seconds (epoch), lateness in beats.
"""
from __future__ import annotations

import math
import time
from dataclasses import dataclass, field

# ---------------------------------------------------------------- constants
FSRS_DEFAULT_W = [0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001,
                  1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014,
                  1.8729, 0.5425, 0.0912, 0.0658, 0.1542]          # Fsrs::defaultParams (FSRS-6)
DEFAULT_RETENTION = 0.9
MAX_INTERVAL_DAYS = 36500
MIN_BPM, MAX_BPM = 30, 300
DEFAULT_TARGET_BPM = 110
DEFAULT_BPM_STEP = 10
MASTERY_ACCURACY = 0.8          # per-attempt "clean" threshold
NEEDS_WORK_ACCURACY = 0.5
HARD_KEY_OFFSETS = [0, 6, 9, 3, 7, 1, 4, 10, 2, 8, 11, 5]  # kHardKeyOffsets
TIERS = {0: "New", 1: "Learning", 2: "In progress", 3: "Close", 4: "Mastered"}


def clamp(x, lo, hi):
    return max(lo, min(hi, x))


# ---------------------------------------------------------------- scoring
def proportional_match(played: list[int], target: list[int]) -> float:
    """computeProportionalMatch (alignment step approximated): matched/target - 0.1*extra."""
    if not target:
        return 0.0
    tp = {n % 12 for n in target}
    pp = {n % 12 for n in played}
    matched = len(tp & pp)
    extra = len(pp - tp)
    return clamp(matched / len(tp) - 0.1 * extra, 0.0, 1.0)


def timing_tolerance_beats(bpm: float) -> float:
    """80 ms expressed in beats, never more than a quarter of a beat."""
    beat = 60.0 / max(bpm, 1.0)
    tol = 0.08 / beat
    if tol > 0.25:
        tol = min(0.15 / beat, 0.25)
    return tol


def timed_accuracy(match: float, median_lateness_beats: float, bpm: float,
                   wrong_notes_first: int) -> float:
    """updateTimedPractice: timing factor x note match, minus 0.25 per wrong-first note."""
    tol = timing_tolerance_beats(bpm)
    timing = 1.0
    if median_lateness_beats > tol:
        late = clamp((median_lateness_beats - tol) / (1.0 - tol), 0.0, 1.0)
        timing = 1.0 - 0.8 * late
    return clamp(timing * match - 0.25 * wrong_notes_first, 0.0, 1.0)


def untimed_accuracy(match: float, wrong_notes_first: int) -> float:
    return clamp(match - 0.25 * wrong_notes_first, 0.0, 1.0)


def quality_from_accuracy(acc: float) -> int:
    return int(clamp(round(acc * 5), 0, 5))


def rating_from_quality(q: int) -> int:
    """0-2 -> Again(1), 3 -> Hard(2), 4 -> Good(3), 5 -> Easy(4)."""
    return 1 if q < 3 else 2 if q == 3 else 3 if q == 4 else 4


# ---------------------------------------------------------------- FSRS-6 (Fsrs::nextState)
def fsrs_next(S: float, D: float, elapsed_days: float, rating: int, w=FSRS_DEFAULT_W):
    G = clamp(rating, 1, 4)
    if S <= 0:
        return w[G - 1], clamp(w[4] - math.exp(w[5] * (G - 1)) + 1, 1, 10)
    d0_easy = clamp(w[4] - math.exp(w[5] * 3) + 1, 1, 10)
    D2 = (1 - w[7]) * (D - w[6] * (G - 3) * (10 - D) / 9) + w[7] * d0_easy
    D2 = clamp(D2, 1, 10)
    decay = w[20]
    if elapsed_days >= 1:
        factor = 0.9 ** (-1 / decay) - 1
        R = (elapsed_days * factor / S + 1) ** (-decay)
        if G == 1:
            S2 = w[11] * D ** (-w[12]) * ((S + 1) ** w[13] - 1) * math.exp((1 - R) * w[14])
            S2 = min(S2, S / math.exp(w[17] * w[18]))
        else:
            hard = w[15] if G == 2 else 1.0
            easy = w[16] if G == 4 else 1.0
            S2 = S * (1 + hard * easy * (11 - D) * math.exp(w[8]) * S ** (-w[9])
                      * (math.exp((1 - R) * w[10]) - 1))
    else:  # same-day review
        f = math.exp(w[17] * (G - 3 + w[18])) * S ** (-w[19])
        S2 = S * (f if (f >= 1 or G < 3) else 1.0)
    return max(S2, 0.01), D2


def interval_days(S: float, retention: float, w=FSRS_DEFAULT_W) -> int:
    decay = w[20]
    retention = min(retention, 0.99)
    ivl = int((retention ** (-1 / decay) - 1) * (S / (0.9 ** (-1 / decay) - 1)))
    return int(clamp(ivl, 1, MAX_INTERVAL_DAYS))


# ---------------------------------------------------------------- records
@dataclass
class Attempt:
    quality: int
    bpm: float
    ts: float
    accuracy: float
    counted: bool = True     # attempt counts toward mastery
    assisted: bool = False   # e.g. scale-exercise / helper attempts are excluded


@dataclass
class KeyRecord:                       # PracticeRecord: one per (item, key 0-11)
    stability: float = 0.0
    difficulty: float = 0.0
    due: float = 0.0
    last_review: float = 0.0
    successes: int = 0
    failures: int = 0
    last_quality: int = -1
    sm2_interval: float = 0.0          # legacy SM-2 fields, still maintained
    sm2_ease: float = 2.5
    quality_history: list[int] = field(default_factory=list)   # last 100
    attempts: list[Attempt] = field(default_factory=list)      # last 500


class PracticeEngine:
    def __init__(self, w=FSRS_DEFAULT_W):
        self.w = w
        self.records: dict[tuple[str, int], KeyRecord] = {}
        self.session: dict[tuple[str, int], dict] = {}

    # recordAttempt
    def record_attempt(self, item: str, key: int, quality: int, accuracy: float, bpm: float,
                       retention: float = DEFAULT_RETENTION, schedule: bool = True,
                       now: float | None = None, assisted: bool = False):
        now = time.time() if now is None else now
        rec = self.records.setdefault((item, key), KeyRecord())
        acc = accuracy if accuracy >= 0 else quality / 5
        if schedule or rec.stability > 0:
            card = self.session.setdefault((item, key), {
                "S": rec.stability, "D": rec.difficulty, "last": rec.last_review,
                "acc": [], "retention": retention})
            card["retention"] = retention
            card["acc"] = (card["acc"] + [acc])[-4:]
            t = (now - rec.last_review) / 86400 if rec.stability > 0 and rec.last_review > 0 else 0.0
            rec.stability, rec.difficulty = fsrs_next(rec.stability, rec.difficulty, t,
                                                      rating_from_quality(quality), self.w)
            rec.due = now + interval_days(rec.stability, retention, self.w) * 86400
        rec.last_review = now
        rec.last_quality = quality
        if quality < 3:                      # SM-2 bookkeeping
            rec.failures += 1
            rec.sm2_interval = 1
        else:
            rec.successes += 1
            rec.sm2_interval = 1 if rec.successes == 1 else 6 if rec.successes == 2 \
                else rec.sm2_interval * rec.sm2_ease
        q = 5 - quality
        rec.sm2_ease = max(1.3, rec.sm2_ease + 0.1 - q * (0.08 + q * 0.02))
        rec.quality_history = (rec.quality_history + [quality])[-100:]
        rec.attempts = (rec.attempts + [Attempt(quality, bpm, now, acc, True, assisted)])[-500:]

    # commitSession: one FSRS review per (item,key) from the best 2 of last 4 accuracies
    def commit_session(self, now: float | None = None):
        now = time.time() if now is None else now
        for (item, key), card in self.session.items():
            rec = self.records.get((item, key))
            if not rec or not card["acc"]:
                continue
            best = sorted(card["acc"], reverse=True)[:2]
            q = int(clamp(round(sum(best) / len(best) * 5), 0, 5))
            t = max(0.0, (now - card["last"]) / 86400) if card["S"] > 0 and card["last"] > 0 else 0.0
            rec.stability, rec.difficulty = fsrs_next(card["S"], card["D"], t,
                                                      rating_from_quality(q), self.w)
            ret = clamp(card["retention"], 0.7, 0.99)
            rec.due = now + interval_days(rec.stability, ret, self.w) * 86400
        self.session.clear()

    # ---------------------------------------------------------- queries
    def _attempts(self, item, key, bpm=None, since=0.0):
        rec = self.records.get((item, key))
        if not rec:
            return []
        return [a for a in rec.attempts
                if (bpm is None or abs(a.bpm - bpm) < 0.1) and a.ts >= since]

    def best_n_of_last_m(self, item, key, bpm, since=0.0, n=2, m=4) -> float:
        accs = [a.accuracy for a in self._attempts(item, key, bpm, since)][-m:]
        if not accs:
            return -1.0
        best = sorted(accs, reverse=True)[:n]
        return sum(best) / len(best)

    def clean_streak(self, item, key, bpm, since=0.0) -> int:
        """Consecutive newest counted, unassisted attempts at this BPM with accuracy >= 0.8."""
        streak = 0
        for a in reversed(self._attempts(item, key, bpm, since)):
            if not a.counted or a.assisted:
                continue
            if a.accuracy < MASTERY_ACCURACY:
                break
            streak += 1
        return streak

    def passed_legacy_mastery(self, item, key, bpm) -> bool:
        accs = [a.accuracy for a in self._attempts(item, key, bpm) if a.assisted is False][-4:]
        if not accs:
            return False
        best = sorted(accs, reverse=True)[:2]
        avg = sum(best) / len(best)
        return avg >= 0.9 or (avg >= 0.8 and len(accs) != 2)

    def distinct_bpms(self, item):
        return sorted({a.bpm for (i, _), r in self.records.items() if i == item for a in r.attempts})

    def is_key_mastered(self, item, key) -> bool:
        return any(self.clean_streak(item, key, b) >= 2 or self.passed_legacy_mastery(item, key, b)
                   for b in self.distinct_bpms(item))

    def all_keys_mastered_bpm(self, item) -> float:
        best = 0.0
        for b in self.distinct_bpms(item):
            if all(self.clean_streak(item, k, b) >= 2 or self.passed_legacy_mastery(item, k, b)
                   for k in range(12)):
                best = b
        return best

    def best_mastered_bpm(self, item) -> float:
        """Highest BPM where the keys played average >= 0.8 (weighted) with >= 3 attempts total."""
        best = 0.0
        for b in self.distinct_bpms(item):
            scores, total = [], 0
            for k in range(12):
                qs = [a.quality for a in self._attempts(item, k, b)]
                if not qs:
                    continue
                n = len(qs)
                wts = [2.0 if i >= n - 5 else 1.0 for i in range(n)]
                scores.append(sum(w * q / 5 for w, q in zip(wts, qs)) / sum(wts))
                total += n
            if scores and total > 2 and sum(scores) / len(scores) >= 0.8:
                best = b
        return best

    def count_keys_mastered(self, item) -> int:
        return sum(self.is_key_mastered(item, k) for k in range(12))

    def mastery_tier(self, item, target_bpm: int | None = None) -> int:
        recs = [r for (i, _), r in self.records.items() if i == item]
        if not any(r.successes + r.failures > 0 for r in recs):
            return 0
        if all(r.stability <= 0 for r in recs):
            return 1
        tgt = DEFAULT_TARGET_BPM if not target_bpm or target_bpm < 1 else target_bpm
        tgt = int(clamp(((tgt + 4) // 5) * 5, MIN_BPM, MAX_BPM))
        if self.all_keys_mastered_bpm(item) >= tgt:
            return 4
        best = self.best_mastered_bpm(item)
        if best >= tgt - 20:
            return 3
        if best > 0:
            return 2
        for r in recs:
            if r.last_quality < 2:
                return 2
            qs = r.quality_history
            if qs:
                n = len(qs)
                wts = [2.0 if i >= n - 5 else 1.0 for i in range(n)]
                if sum(w * q / 5 for w, q in zip(wts, qs)) / sum(wts) < 0.5:
                    return 2
        return 1

    def due_items(self, items, now=None, snoozed_until=None):
        now = time.time() if now is None else now
        snoozed_until = snoozed_until or {}
        due = [i for i in items
               if any(r.stability > 0 and r.due <= now
                      for (it, _), r in self.records.items() if it == i)]
        return [i for i in due if snoozed_until.get(i, 0) <= now]

    # ---------------------------------------------------------- drill helpers
    def key_needs_work(self, item, key, bpm, since) -> bool:
        if len(self._attempts(item, key, bpm, since)) < 3:
            return False
        b = self.best_n_of_last_m(item, key, bpm, since)
        return 0 <= b < NEEDS_WORK_ACCURACY

    def key_retired(self, item, key, bpm, since) -> bool:
        return self.clean_streak(item, key, bpm, since) >= 2


def brush_up_start_bpm(best_mastered: float, all_keys_mastered: float, target: int,
                       step: int = DEFAULT_BPM_STEP) -> int:
    m = int(round(max(best_mastered, all_keys_mastered)))
    if m >= 1:
        return int(clamp(m, 40, MAX_BPM))
    return max(40, target - 2 * (step if step >= 1 else 10))


def brush_up_target_bpm(best_mastered: float, all_keys_mastered: float, target: int) -> int:
    return int(clamp(max(target, int(round(max(best_mastered, all_keys_mastered)))), MIN_BPM, MAX_BPM))


def tempo_up(bpm: int, target: int, step: int = DEFAULT_BPM_STEP) -> int:
    """When every active key is retired: next BPM = min(bpm + step, target rounded to 5)."""
    tgt = int(clamp(((target + 4) // 5) * 5, MIN_BPM, MAX_BPM))
    return min(bpm + step, tgt) if bpm < tgt else bpm


def tempo_drop(bpm: int, step: int = DEFAULT_BPM_STEP) -> int:
    return max(MIN_BPM, bpm - step)


def next_unlock_key(active: set[int], home_key: int, hard_keys_first: bool = False) -> int:
    """pickExpansionKey: grow along the circle of fifths, nearest to the home key."""
    if hard_keys_first:
        for off in HARD_KEY_OFFSETS:
            k = (max(home_key, 0) + off) % 12
            if k not in active:
                return k
        return -1
    home_pos = (max(home_key, 0) * 7) % 12          # position on circle of fifths
    best, best_d = -1, 99
    for k in range(12):
        if k in active:
            continue
        pos = (k * 7) % 12
        neighbours = {(k + 7) % 12, (k + 5) % 12}   # a fifth above / below
        if not (neighbours & active):
            continue
        d = abs(pos - home_pos)
        d = min(d, 12 - d)
        if d < best_d:
            best, best_d = k, d
    return best


def click_samples(sample_rate: int, length: int, accent: bool, volume: float = 0.7):
    """TempoEngine::renderClick: sine 1000 Hz (accent, gain 0.4) or 800 Hz (gain 0.28), linear decay."""
    f, g = (1000.0, 0.4) if accent else (800.0, 0.28)
    return [((length - i) / length) * g * volume * math.sin(2 * math.pi * f * i / sample_rate)
            for i in range(length)]


if __name__ == "__main__":
    eng = PracticeEngine()
    t0 = 1_800_000_000.0
    item = "maj7-voicing"
    print("tolerance @ 60/120/240 BPM (beats):",
          [round(timing_tolerance_beats(b), 3) for b in (60, 120, 240)])
    acc = timed_accuracy(proportional_match([60, 64, 67, 71], [60, 64, 67, 71]), 0.05, 100, 0)
    late = timed_accuracy(1.0, 0.5, 100, 0)
    print("on-time acc:", round(acc, 3), "| half-beat late acc:", round(late, 3),
          "| q:", quality_from_accuracy(late))
    for day in range(3):
        for k in (0, 7, 5):
            for _ in range(2):
                eng.record_attempt(item, k, 5, 0.95, 100, now=t0 + day * 86400)
        eng.commit_session(now=t0 + day * 86400)
    r = eng.records[(item, 0)]
    print(f"C after 3 days: S={r.stability:.2f}d D={r.difficulty:.2f} next in "
          f"{(r.due - (t0 + 2 * 86400)) / 86400:.0f} days")
    print("keys mastered:", eng.count_keys_mastered(item),
          "| tier:", TIERS[eng.mastery_tier(item, 110)])
    print("next key to unlock from {C,G,F}:", next_unlock_key({0, 7, 5}, 0),
          "| hard-first:", next_unlock_key({0}, 0, hard_keys_first=True))
    print("tempo up 100->", tempo_up(100, 110), "| drop 100->", tempo_drop(100),
          "| brush-up start (nothing mastered, target 110):", brush_up_start_bpm(0, 0, 110))
    print("click len:", len(click_samples(44100, 441, True)))
