# What the R41 canvas keeps from the R40 boards: the engraved melody (Amazing Grace), the Hanon figure and the
# circle of fifths' logic. The R40 boards themselves are gone; nothing here writes a board.
from bravura_glyphs import BRAVURA
# a notehead as the engine engraves it: Bravura's black, half or whole head at the staff's space sp, centred on its note
def HEADG(kind, x, y, sp, col=None):
    return f'<path transform="translate({x - BRAVURA[kind][1] * sp / 500:.2f} {y:.1f}) scale({sp / 250:.4f} {-sp / 250:.4f})" d="{BRAVURA[kind][0]}" fill="{col or INK}"></path>'
# --- song

# ── the score: Amazing Grace, melody, chords and words ──
MEL = [('D4', 1, 'A-', ''), ('G4', 2, 'ma-', 'G'), ('B4', .5, 'zing', ''), ('G4', .5, '', ''), ('B4', 2, 'grace!', 'G⁷'), ('A4', 1, 'How', ''), ('G4', 2, 'sweet', 'C'), ('E4', 1, 'the', ''),
       ('D4', 2, 'sound,', 'G'), ('D4', 1, 'That', ''), ('G4', 2, 'saved', 'G'), ('B4', .5, 'a', ''), ('G4', .5, '', ''), ('B4', 2, 'wretch', 'G'), ('A4', 1, 'like', ''), ('D5', 3, 'me!', 'D')]
# New Britain as the app's Amazing Grace holds it (Wikipedia's score of the hymn): the slurred eighths take one syllable,
# the chords are the app's chart, bar by bar (G · G7 · C · G · G · G · D)
STEP = {'D4': -1, 'E4': 0, 'G4': 2, 'A4': 3, 'B4': 4, 'D5': 6}
def score_svg(w, sel=None, played=None, size=1.0, cover=False):
    """Two systems of the melody on a treble staff, 3/4, G major, chords over it and words under it. sel: index in honey.
    cover: a song page's first page as the app engraves it (PieceFirstPage, measured 2026-11-20): the first staff 57 down,
    the systems 115 apart, the chord symbols 12.5 bold 28 over the staff (the Player's chord row), the words 15.5 under it."""
    sp = 8 * size; out = []; first8 = True; beam_x = 0; systems = [MEL[:6], MEL[6:13], MEL[13:]]; gy = 23 if cover else 0; idx = 0; H = 0; acc = 2
    for si, sysn in enumerate(systems):
        top = gy + 34 * size; base = top + 4 * sp
        out.append('<path d="' + ''.join(f'M4 {top + i * sp:.1f}H{w - 4}' for i in range(5)) + f'" stroke="{INK}" stroke-width="0.9"></path>')
        out.append(f'<path d="M4 {top:.1f}V{base:.1f}M{w - 4} {top:.1f}V{base:.1f}" stroke="{INK}" stroke-width="1"></path>')
        out.append(f'<text x="8" y="{base:.1f}" font-size="{4 * sp:.0f}" font-family="Noto Music, serif" fill="{INK}">𝄞</text>')
        out.append(f'<text x="{40 * size:.1f}" y="{top + 0.6 * sp:.1f}" font-size="{20 * size:.0f}" font-family="Noto Music, serif" fill="{INK}">♯</text>')
        x0 = 58 * size
        if si == 0:
            out.append(f'<text x="{x0:.1f}" y="{top + 2 * sp - 1:.1f}" font-size="{19 * size:.0f}" font-weight="700" font-family="Georgia, serif" fill="{INK}">3</text><text x="{x0:.1f}" y="{base - 1:.1f}" font-size="{19 * size:.0f}" font-weight="700" font-family="Georgia, serif" fill="{INK}">4</text>')
            x0 += 22 * size
        wt = lambda b: 1 + b * 0.7; beats = sum(wt(b) for _, b, _, _ in sysn); dx = (w - x0 - 20) / (beats + 0.3); x = x0 + 12; last = idx + len(sysn) - 1
        # an engraver widens the spacing so no two words touch: each note's advance is at least half of its word and the
        # next one's, plus a gap; the rest of the line is shared out by duration, as before
        avail = beats * dx; need = [((len(sysn[i][2]) + (len(sysn[i + 1][2]) if i + 1 < len(sysn) else 0)) / 2 * 7.4 + 10) * size for i in range(len(sysn))]
        fixed = set()
        while True:
            free = avail - sum(need[i] for i in fixed); fw = sum(wt(sysn[i][1]) for i in range(len(sysn)) if i not in fixed)
            more = [i for i in range(len(sysn)) if i not in fixed and wt(sysn[i][1]) * free / fw < need[i]]
            if not more: break
            fixed.update(more)
        adv = [need[i] if i in fixed else wt(sysn[i][1]) * free / fw for i in range(len(sysn))]
        for k, (p, b, syl, ch) in enumerate(sysn):
            y = base - STEP[p] * sp / 2; on = idx == sel; past = played is not None and idx < played
            col = '#8C6418' if on else (SOFT if past else INK)
            # the selection is tight to the note, its head and stem, never a column over the chord and the words (feedback-log, Selection; Dorico and Flat colour the note itself)
            if on:
                su = STEP[p] < 4; y1 = (y - 3.5 * sp - 5 * size) if su else (y - 7 * size); y2 = (y + 7 * size) if su else (y + 3.5 * sp + 5 * size)
                out.append(f'<rect x="{x - 10 * size:.1f}" y="{y1:.1f}" width="{(21 if su else 20) * size:.1f}" height="{y2 - y1:.1f}" rx="{6 * size:.1f}" fill="{ACCENT}" opacity=".55"></rect>')
            if STEP[p] < 0: out.append(f'<path d="M{x - 9 * size:.1f} {base + sp:.1f}H{x + 9 * size:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
            hollow = b >= 2
            out.append(HEADG('half' if hollow else 'black', x, y, sp, col))
            eighth = b == .5; up = eighth or STEP[p] < 4
            sx = x + (5.2 if up else -5.2) * size
            if eighth:
                pair = sysn[k - 1:k + 1] if k and sysn[k - 1][1] == .5 and not first8 else sysn[k:k + 2]
                ty = min(base - STEP[q] * sp / 2 for q, _, _, _ in pair) - 3.5 * sp
                out.append(f'<path d="M{sx:.1f} {y:.1f}V{ty:.1f}" stroke="{col}" stroke-width="1.2"></path>')
                if first8: beam_x = sx
                else: out.append(f'<path d="M{beam_x:.1f} {ty + 1.5 * size:.1f}H{sx:.1f}" stroke="{col}" stroke-width="{3.2 * size:.1f}"></path>')
                first8 = not first8
            else:
                out.append(f'<path d="M{sx:.1f} {y:.1f}V{y + (-3.5 if up else 3.5) * sp:.1f}" stroke="{col}" stroke-width="1.2"></path>')
            if b == 3: out.append(f'<circle cx="{x + 10 * size:.1f}" cy="{y - (sp / 2 if STEP[p] % 2 == 0 else 0):.1f}" r="{1.6 * size:.1f}" fill="{col}"></circle>')
            if ch: out.append(f'<text x="{x - 5:.1f}" y="{top - (28 if cover else 10) * size:.1f}" font-size="{(12.5 if cover else 15) * size:.1f}" font-weight="700" font-family="{SERIF}" fill="{INK}">{ch}</text>')
            # the words in the engine's serif, a word's syllables parted by a hyphen midway between them (Verovio's)
            ly = (15.5 if cover else 14) * size
            out.append(f'<text x="{x:.1f}" y="{base + 26 * size:.1f}" text-anchor="middle" font-size="{ly:.1f}" font-family="{SERIF}" fill="{col}">{syl.rstrip("-")}</text>')
            if syl.endswith('-'): out.append(f'<text x="{x + adv[k] / 2:.1f}" y="{base + 26 * size:.1f}" text-anchor="middle" font-size="{ly:.1f}" font-family="{SERIF}" fill="{INK}">-</text>')
            if syl and k + 1 < len(sysn) and not sysn[k + 1][2]:
                out.append(f'<path d="M{x + len(syl) * 3.9 * size + 2:.1f} {base + 27 * size:.1f}H{x + adv[k] + 5 * size:.1f}" stroke="{col}" stroke-width="1"></path>')
            x += adv[k]; acc += b
            if acc % 3 == 0 and idx < last:
                out.append(f'<path d="M{x - adv[k] * 0.5:.1f} {top:.1f}V{base:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
            idx += 1
        gy = base + (49 if cover else 40) * size; H = base + (28 if cover else 40) * size
    return f'<svg viewBox="0 0 {w} {H:.0f}" width="100%" role="img" aria-label="Amazing Grace, bars 1 to 7" style="display: block">' + ''.join(out) + '</svg>'



# ── the score as the app engraves it: Melody with chords and words, then the Piano's treble and bass ──
# Amazing Grace's two staves (its Instruments: Voice, Piano) with the r2 accompaniment the arranger writes under the
# chart: the bass on the beat, the chord on beats two and three, pitch for pitch as Verovio prints them in the editor.
# A melody event: (pitch, beats, syllable, dotted); a piano bar: (right-hand chord or None, bass) — None in the pickup.
GBARS = [
    ('', [('D4', 1, 'A-')], None),
    ('G', [('G4', 2, 'ma-'), ('B4', .5, 'zing_'), ('G4', .5, '')], (['G3', 'B3', 'D4'], 'G1')),
    ('G⁷', [('B4', 2, 'grace!'), ('A4', 1, 'How')], (['G3', 'B3', 'D4', 'F4♮'], 'G1')),
    ('C', [('G4', 2, 'sweet'), ('E4', 1, 'the')], (['G3', 'C4', 'E4'], 'C2')),
    ('G', [('D4', 2, 'sound,'), ('D4', 1, 'That')], (['G3', 'B3', 'D4'], 'G1')),
    ('G', [('G4', 2, 'saved'), ('B4', .5, 'a_'), ('G4', .5, '')], (['G3', 'B3', 'D4'], 'G1')),
    ('G', [('B4', 2, 'wretch'), ('A4', 1, 'like')], (['G3', 'B3', 'D4'], 'G1')),
    ('D', [('D5', 3, 'me!', 'tie')], (['F3', 'A3', 'D4'], 'D2')),
    ('D⁷', [('D5', 1, ''), ('r', 1, ''), ('B4', 1, 'I')], (['F3', 'A3', 'C4', 'D4'], 'D2')),
    ('G', [('D5', 1.5, 'once_'), ('B4', .5, ''), ('D5', .5, 'was_'), ('B4', .5, '')], (['G3', 'B3', 'D4'], 'G1')),
    ('G⁷', [('G4', 2, 'lost,'), ('D4', 1, 'but')], (['G3', 'B3', 'D4', 'F4♮'], 'G1')),
    ('C', [('E4', 1.5, 'now_'), ('G4', .5, ''), ('G4', .5, 'am_'), ('E4', .5, '')], (['G3', 'C4', 'E4'], 'C2')),
    ('G', [('D4', 2, 'found.'), ('D4', 1, 'Was')], (['G3', 'B3', 'D4'], 'G1')),
]
def _step(p, clef):  # staff steps above the bottom line: E4 in the treble, G2 in the bass
    n = 'CDEFGAB'.index(p[0]) + 7 * int(p[1])
    return n - (('CDEFGAB'.index('E') + 28) if clef == 't' else ('CDEFGAB'.index('G') + 14))
GEO = {}
def score_grand(w, systems, sel=None, size=1.0, natural=False, piano=True):
    """The song's systems, each Melody over the Piano's grand staff (piano=False: the melody alone, a lead sheet with its
    chords and words, as a version without an accompaniment prints). systems: lists of bar indexes; sel: (bar, event)."""
    s = size; sp = 8 * s; out = []; gy = 0; H = 0
    # where each bar and chord symbol lies, for a page that lets them be picked (GEO['last'], in the svg's units)
    geo = {'bars': [], 'chords': []}
    ln = lambda d, sw=0.9, c=INK: out.append(f'<path d="{d}" stroke="{c}" stroke-width="{sw}" fill="none"></path>')
    def staff(top, x0, x1): ln(''.join(f'M{x0:.1f} {top + i * sp:.1f}H{x1:.1f}' for i in range(5)))
    def head(x, y, hollow, col):
        out.append(HEADG('half' if hollow else 'black', x, y, sp, col))
    def ledgers(x, st, base, w2=9):
        for k in range(-2, st - 1, -2): ln(f'M{x - w2 * s:.1f} {base - k * sp / 2:.1f}H{x + w2 * s:.1f}')
        for k in range(10, st + 1, 2): ln(f'M{x - w2 * s:.1f} {base - k * sp / 2:.1f}H{x + w2 * s:.1f}')
    def qrest(x, top): out.append(f'<text x="{x - 5 * s:.1f}" y="{top + 2.9 * sp:.1f}" font-size="{30 * s:.0f}" font-family="Noto Music, serif" fill="{INK}">𝄽</text>')
    for si, bars in enumerate(systems):
        first = si == 0
        mtop = gy + 34 * s; mbase = mtop + 4 * sp; ttop = mbase + 46 * s; tbase = ttop + 4 * sp; btop = tbase + 36 * s; bbase = btop + 4 * sp
        if not piano: bbase = mbase  # one staff: the system ends with the melody's
        x0 = (66 if first else 14) * s; x1 = w - 4
        ln(f'M{x0:.1f} {mtop:.1f}V{bbase:.1f}', 1.1)
        # the brace before the piano's two staves
        bx = x0 - 9 * s; my = (ttop + bbase) / 2
        if piano: out.append(f'<path d="M{bx + 6 * s:.1f} {ttop:.1f}C{bx - 1 * s:.1f} {ttop + 10 * s:.1f} {bx + 5 * s:.1f} {my - 14 * s:.1f} {bx - 2 * s:.1f} {my:.1f}C{bx + 5 * s:.1f} {my + 14 * s:.1f} {bx - 1 * s:.1f} {bbase - 10 * s:.1f} {bx + 6 * s:.1f} {bbase:.1f}" stroke="{INK}" stroke-width="{2.2 * s:.1f}" fill="none"></path>')
        if first:
            out.append(f'<text x="{x0 - 8 * s:.1f}" y="{mtop + 2 * sp + 5 * s:.1f}" text-anchor="end" font-size="{14 * s:.0f}" font-style="italic" font-family="{SERIF}" fill="{INK}">Melody</text>')
            if piano: out.append(f'<text x="{x0 - 15 * s:.1f}" y="{my + 5 * s:.1f}" text-anchor="end" font-size="{14 * s:.0f}" font-family="{SERIF}" fill="{INK}">Piano</text>')
        else:
            out.append(f'<text x="{x0:.1f}" y="{mtop - 22 * s:.1f}" font-size="{11 * s:.0f}" fill="{SOFT}">{bars[0]}</text>')
        x = x0 + 4 * s
        for top, clef in (((mtop, 't'), (ttop, 't'), (btop, 'b')) if piano else ((mtop, 't'),)):
            if clef == 't': out.append(f'<text x="{x:.1f}" y="{top + 4 * sp:.1f}" font-size="{4 * sp:.0f}" font-family="Noto Music, serif" fill="{INK}">𝄞</text>')
            else: out.append(f'<text x="{x:.1f}" y="{top + 4 * sp:.1f}" font-size="{4.46 * sp:.0f}" font-family="Noto Music, serif" fill="{INK}">𝄢</text>')
            out.append(f'<text x="{x + 30 * s:.1f}" y="{top + (0.6 if clef == "t" else 1.6) * sp:.1f}" font-size="{20 * s:.0f}" font-family="Noto Music, serif" fill="{INK}">♯</text>')
            if first:
                out.append(f'<text x="{x + 46 * s:.1f}" y="{top + 2 * sp - 1:.1f}" font-size="{19 * s:.0f}" font-weight="700" font-family="Georgia, serif" fill="{INK}">3</text><text x="{x + 46 * s:.1f}" y="{top + 4 * sp - 1:.1f}" font-size="{19 * s:.0f}" font-weight="700" font-family="Georgia, serif" fill="{INK}">4</text>')
        x += (68 if first else 46) * s
        # each bar's width: its beats, widened where its words need the room
        # note spacing as Dorico's and Gould's: each onset's space grows by the square root of the time to the next
        # (a half note 1.41 times a quarter's 3.5 spaces), never under 1.5 spaces, widened where a syllable needs room
        def slots(b):
            ch_, mel_, pno_ = GBARS[b]; nb_ = sum(e[1] for e in mel_); on = {}; t_ = 0
            for e in mel_: on[t_] = max(on.get(t_, 0), (len(e[2].strip('-_')) * 7.4 + 10) * s if e[2].strip('-_') else 0); t_ += e[1]
            if pno_ and piano:
                for tt in (0, 1, 2): on.setdefault(tt, 0)
            ts = sorted(on); sp_ = []
            for i_, t0 in enumerate(ts):
                g = (ts[i_ + 1] if i_ + 1 < len(ts) else nb_) - t0
                sp_.append(max(28 * s * g ** 0.5, 12 * s, on[t0]))
            return ts, sp_, nb_
        lead = 16 * s; trail = 10 * s
        SL = [slots(b) for b in bars]
        nat = [lead + sum(v[1]) + trail for v in SL]
        if natural: x1 = x + sum(nat); w = x1 + 4
        k = (x1 - x - len(bars) * (lead + trail)) / sum(sum(v[1]) for v in SL)  # justified: the room shared by the notes' spaces
        widths = [lead + sum(v[1]) * k + trail for v in SL]
        for bi, b in enumerate(bars):
            ch, mel, pno = GBARS[b]; bw = widths[bi]; ts_, sps, nb = SL[bi]
            cum = [0]
            for v in sps: cum.append(cum[-1] + v * k)
            pts = list(ts_) + [nb]
            def at(t, x=x, pts=pts, cum=cum, lead=lead):
                for j in range(len(pts) - 1):
                    if pts[j] <= t <= pts[j + 1]: return x + lead + cum[j] + (t - pts[j]) / (pts[j + 1] - pts[j]) * (cum[j + 1] - cum[j])
                return x + lead + cum[-1]
            geo['bars'].append((b, x, x + bw, mtop - 26 * s, bbase + 6 * s))
            if ch: geo['chords'].append((b, ch, at(0) - 5 * s, mtop - 10 * s))
            if ch: out.append(f'<text x="{at(0) - 5 * s:.1f}" y="{mtop - 10 * s:.1f}" font-size="{15 * s:.0f}" font-weight="700" font-family="{SERIF}" fill="{INK}">{ch}</text>')
            t = 0; evx = []
            for ei, e in enumerate(mel):
                p, d, syl = e[0], e[1], e[2]; ex = at(t); on = sel == (b, ei); col = '#8C6418' if on else INK
                if p == 'r': qrest(ex, mtop); t += d; evx.append(None); continue
                st = _step(p, 't'); y = mbase - st * sp / 2
                if on:
                    su = st < 4; y1 = (y - 3.5 * sp - 5 * s) if su else (y - 7 * s); y2 = (y + 7 * s) if su else (y + 3.5 * sp + 5 * s)
                    out.append(f'<rect x="{ex - 10 * s:.1f}" y="{y1:.1f}" width="{21 * s:.1f}" height="{y2 - y1:.1f}" rx="{6 * s:.1f}" fill="{ACCENT}" opacity=".55"></rect>')
                ledgers(ex, st, mbase)
                head(ex, y, d >= 2, col)
                if d in (1.5, 3): out.append(f'<circle cx="{ex + 10 * s:.1f}" cy="{y - (sp / 2 if st % 2 == 0 else 0):.1f}" r="{1.6 * s:.1f}" fill="{col}"></circle>')
                evx.append((ex, y, st, d, col))
                if syl.strip('-_'):
                    out.append(f'<text x="{ex:.1f}" y="{mbase + 26 * s:.1f}" text-anchor="middle" font-size="{14 * s:.0f}" font-family="{SERIF}" fill="{col}">{syl.strip("-_")}</text>')
                    nx = at(t + d) if ei + 1 < len(mel) else x + bw + lead
                    half = len(syl.strip('-_')) * 3.9 * s
                    if syl.endswith('-'): out.append(f'<text x="{(ex + nx) / 2:.1f}" y="{mbase + 26 * s:.1f}" text-anchor="middle" font-size="{14 * s:.0f}" font-family="{SERIF}" fill="{INK}">-</text>')
                    if syl.endswith('_'): ln(f'M{ex + half + 2:.1f} {mbase + 27 * s:.1f}H{at(t + d) + 5 * s if ei + 1 < len(mel) else ex + half + 20 * s:.1f}', 1)
                if len(e) > 3 and bi + 1 < len(bars):  # the held "me!" tied over the barline
                    nx2 = x + bw + lead + 16 * s
                    out.append(f'<path d="M{ex + 4 * s:.1f} {y - 7 * s:.1f}Q{(ex + nx2) / 2:.1f} {y - 16 * s:.1f} {nx2 - 4 * s:.1f} {y - 7 * s:.1f}" stroke="{INK}" stroke-width="1.3" fill="none"></path>')
                t += d
            # stems: an eighth pair beamed, a lone eighth flagged, the rest by where the head sits
            i = 0
            while i < len(mel):
                v = evx[i]
                if v is None: i += 1; continue
                ex, y, st, d, col = v
                if d == .5 and i + 1 < len(mel) and mel[i + 1][1] == .5 and (i == 0 or mel[i - 1][1] != .5 or (i >= 2 and mel[i - 2][1] == .5)):
                    a, c = evx[i], evx[i + 1]; up = (a[2] + c[2]) / 2 < 4
                    if up:
                        ty = min(a[1], c[1]) - 3.5 * sp; xs = (a[0] + 5.2 * s, c[0] + 5.2 * s)
                    else:
                        ty = max(a[1], c[1]) + 3.5 * sp; xs = (a[0] - 5.2 * s, c[0] - 5.2 * s)
                    for (hx, hy, *_), sx in zip((a, c), xs): ln(f'M{sx:.1f} {hy:.1f}V{ty:.1f}', 1.2, a[4])
                    out.append(f'<path d="M{xs[0]:.1f} {ty + (1.5 if up else -1.5) * s:.1f}H{xs[1]:.1f}" stroke="{a[4]}" stroke-width="{3.2 * s:.1f}"></path>')
                    i += 2; continue
                if d < 4:
                    up = st < 4; sx = ex + (5.2 if up else -5.2) * s; ty = y + (-3.5 if up else 3.5) * sp
                    ln(f'M{sx:.1f} {y:.1f}V{ty:.1f}', 1.2, col)
                    if d == .5: out.append(f'<path d="M{sx:.1f} {ty:.1f}q{5 * s:.1f} {(6 if up else -6) * s:.1f} {4 * s:.1f} {(14 if up else -14) * s:.1f}" stroke="{col}" stroke-width="{1.6 * s:.1f}" fill="none"></path>')
                i += 1
            if pno and piano:
                rh, bass = pno
                qrest(at(0), ttop)
                for tt in (1, 2):
                    cx = at(tt); steps = []
                    for n in rh:
                        st = _step(n[:2], 't'); steps.append(st)
                        if n.endswith('♮') and tt == 1: out.append(f'<text x="{cx - 15 * s:.1f}" y="{tbase - st * sp / 2 + 5 * s:.1f}" font-size="{15 * s:.0f}" font-family="Noto Music, serif" fill="{INK}">♮</text>')
                    ledgers(cx, min(steps), tbase)
                    for j, st in enumerate(steps):
                        shift = j > 0 and st - steps[j - 1] == 1
                        head(cx + (10.4 * s if shift else 0), tbase - st * sp / 2, False, INK)
                    ln(f'M{cx + 5.2 * s:.1f} {tbase - min(steps) * sp / 2:.1f}V{tbase - max(steps) * sp / 2 - 3.5 * sp:.1f}', 1.2)
                bx2 = at(0); st = _step(bass, 'b'); y = bbase - st * sp / 2
                ledgers(bx2, st, bbase); head(bx2, y, False, INK); ln(f'M{bx2 + 5.2 * s:.1f} {y:.1f}V{y - 3.5 * sp:.1f}', 1.2)
                out.append(f'<rect x="{at(1.5) - 5 * s:.1f}" y="{btop + 1.5 * sp:.1f}" width="{10 * s:.1f}" height="{sp / 2:.1f}" fill="{INK}"></rect>')
            x += bw
            end = bi == len(bars) - 1
            ln(f'M{x:.1f} {mtop:.1f}V{mbase:.1f}' + (f'M{x:.1f} {ttop:.1f}V{bbase:.1f}' if piano else ''), 1.1 if end else 0.9)
        for t in ((mtop, ttop, btop) if piano else (mtop,)): staff(t, x0, x)  # the staves run to the system's last barline
        gy = bbase + 3.6 * sp + 22 * s; H = gy
    geo['w'] = w; geo['h'] = H; GEO['last'] = geo
    return f'<svg viewBox="0 0 {w:.0f} {H:.0f}" width="{"%.0f" % (w * natural) if natural else "100%"}" role="img" aria-label="Amazing Grace, {"Melody and Piano" if piano else "Melody"}" style="display: block">' + ''.join(out) + '</svg>'

# --- hanon
def hanon(w, shift=0):  # shift: the figure's start a step higher, as Hanon's next two bars climb
    notes = [n + shift for n in [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 4, 5, 6, 5, 4, 3]]; x0, dx = 60, (w - 76) / 16; out = []
    out.append('<path d="' + ''.join(f'M4 {y}H{w-4}' for y in (26, 34, 42, 50, 58)) + f'" stroke="{INK}" stroke-width="0.9" fill="none"></path><text x="6" y="58" font-size="32" font-family="Noto Music, serif" fill="{INK}">𝄞</text>')
    hs = []
    for i, s in enumerate(notes):
        x = x0 + i * dx + (6 if i >= 8 else 0); y = 66 - s * 4
        if s == 0: out.append(f'<path d="M{x-7:.1f} 66H{x+7:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
        out.append(HEADG('black', x, y, 8)); hs.append((x, y))
    for g in range(4):
        grp = hs[g*4:g*4+4]; top = min(y for _, y in grp) - 26
        out += [f'<path d="M{x+4.2:.1f} {y-1}V{top}" stroke="{INK}" stroke-width="1"></path>' for x, y in grp]
        out.append(f'<path d="M{grp[0][0]+4.2:.1f} {top}H{grp[-1][0]+4.2:.1f}M{grp[0][0]+4.2:.1f} {top+4}H{grp[-1][0]+4.2:.1f}" stroke="{INK}" stroke-width="3"></path>')
    out.append(f'<path d="M{x0 + 8*dx - 3:.1f} 26V58M{w-4} 26V58" stroke="{INK}" stroke-width="0.9"></path>')
    return f'<svg viewBox="0 -6 {w} 90" width="100%" role="img" aria-label="Hanon No. 1, bars 1 and 2" style="display: block">' + ''.join(out) + '</svg>'

# --- circle
CO_LOGIC = r'''
    const MAJ = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'], MIN = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
    const SIGN = ['No sharps or flats', '1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps', '5 flats', '4 flats', '3 flats', '2 flats', '1 flat'];
    const sel = st.sel ?? 0; const near = [(sel + 11) % 12, sel, (sel + 1) % 12];
    const arc = (r1, r2, a0, a1) => { const p = (r, a) => [(200 + r * Math.sin(a)).toFixed(1), (200 - r * Math.cos(a)).toFixed(1)]; const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0); return 'M' + x1 + ' ' + y1 + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + x2 + ' ' + y2 + 'L' + x3 + ' ' + y3 + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + x4 + ' ' + y4 + 'Z'; };
    const segs = MAJ.map((m, i) => { const a0 = (i - 0.5) * Math.PI / 6, a1 = (i + 0.5) * Math.PI / 6, am = i * Math.PI / 6, on = i === sel, nb = near.includes(i);
      return { o: arc(120, 196, a0, a1), n: arc(74, 120, a0, a1), fo: on ? C.accent : nb ? '#F6E7C8' : C.sheet, fi: on ? '#F3D9A8' : nb ? '#FAF0DC' : C.page, m, mn: MIN[i], mx: (200 + 160 * Math.sin(am)).toFixed(1), my: (208 - 160 * Math.cos(am)).toFixed(1), nx: (200 + 97 * Math.sin(am)).toFixed(1), ny: (205 - 97 * Math.cos(am)).toFixed(1), mxp: ((200 + 160 * Math.sin(am)) / 4).toFixed(2), myp: ((200 - 160 * Math.cos(am)) / 4).toFixed(2), nxp: ((200 + 97 * Math.sin(am)) / 4).toFixed(2), nyp: ((200 - 97 * Math.cos(am)) / 4).toFixed(2), pick: () => set({ sel: i }) }; });
    return { ...common(st, set), name: MAJ[sel] + ' major', sub: SIGN[sel] + ' · relative ' + MIN[sel].replace('m', '') + ' minor', segs,
      prev: () => set({ sel: (sel + 11) % 12 }), next: () => set({ sel: (sel + 1) % 12 }), pillBg: C.fill, wKey: wheel(MAJ.map((m) => m + ' major'), sel, (i) => set({ sel: i })) };'''
