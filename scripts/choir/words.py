"""Pairing a verse's syllables with the notes a voice sings, in MusicXML and in MuseScore's own file alike."""

from spec import syllables


class Tied:
    """A note that only continues a tie: it takes a syllable only when the words mark it (`^`), as a verse sung
    where another holds (a dashed tie)."""

    def __init__(self, el):
        self.el = el


def place(slots_by_bar, tokens, held=None):
    """Pairs each syllable with its slot (a chord or a MusicXML note), following @bar marks and holds: returns
    [slot, text, syllabic, holds]. The slots a syllable is held onto are added to `held`."""
    order = [(b, s) for b in sorted(slots_by_bar) for s in slots_by_bar[b]]
    pos = 0
    pairs = []
    for t in syllables(tokens):
        if t[0] == 'bar':
            pos = next((k for k, (b, s) in enumerate(order) if b >= t[1]), len(order))
            continue
        on_tie = t[0] == 'word' and t[1].startswith('^')
        # A tied-on note is passed over unless the syllable is marked for it.
        while pos < len(order) and isinstance(order[pos][1], Tied) and not on_tie:
            pos += 1
        if pos >= len(order):
            raise SystemExit(f'more words than notes, at {t}')
        slot = order[pos][1]
        slot = slot.el if isinstance(slot, Tied) else slot
        if t[0] == 'word':
            pairs.append([slot, t[1].lstrip('^'), t[2], 0])
        elif t[0] == 'skip':
            pass
        elif pairs:
            pairs[-1][3] += 1
            if held is not None:
                held.add(id(slot))
        pos += 1
    return pairs
