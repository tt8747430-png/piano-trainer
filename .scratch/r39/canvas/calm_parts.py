# What the R41 canvas keeps from the R40 boards: the engraved melody (Amazing Grace), the Hanon figure and the
# circle of fifths' logic. The R40 boards themselves are gone; nothing here writes a board.
# --- song

# ── the score: Amazing Grace, melody, chords and words ──
MEL = [('D4', 1, 'A', ''), ('G4', 2, 'ma', 'G'), ('B4', 1, 'zing', ''), ('B4', 2, 'grace,', ''), ('A4', 1, 'how', ''), ('G4', 2, 'sweet', 'C'), ('E4', 1, 'the', ''),
       ('D4', 2, 'sound', 'G'), ('D4', 1, 'that', ''), ('G4', 2, 'saved', 'G'), ('B4', 1, 'a', ''), ('B4', 2, 'wretch', ''), ('A4', 1, 'like', 'D'), ('D5', 3, 'me.', 'D')]
STEP = {'D4': -1, 'E4': 0, 'G4': 2, 'A4': 3, 'B4': 4, 'D5': 6}
def score_svg(w, sel=None, played=None, size=1.0):
    """Two systems of the melody on a treble staff, 3/4, G major, chords over it and words under it. sel: index in honey."""
    sp = 8 * size; out = []; systems = [MEL[:5], MEL[5:11], MEL[11:]]; gy = 0; idx = 0; H = 0; acc = 2
    for si, sysn in enumerate(systems):
        top = gy + 34 * size; base = top + 4 * sp
        out.append('<path d="' + ''.join(f'M4 {top + i * sp:.1f}H{w - 4}' for i in range(5)) + f'" stroke="{INK}" stroke-width="0.9"></path>')
        out.append(f'<path d="M4 {top:.1f}V{base:.1f}M{w - 4} {top:.1f}V{base:.1f}" stroke="{INK}" stroke-width="1"></path>')
        out.append(f'<text x="8" y="{base + 7 * size:.1f}" font-size="{50 * size:.0f}" font-family="Noto Music, serif" fill="{INK}">𝄞</text>')
        out.append(f'<text x="{40 * size:.1f}" y="{top + 1.6 * sp:.1f}" font-size="{20 * size:.0f}" font-family="Noto Music, serif" fill="{INK}">♯</text>')
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
            out.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{5.6 * size:.1f}" ry="{4 * size:.1f}" transform="rotate(-20 {x:.1f} {y:.1f})" fill="{"none" if hollow else col}" stroke="{col}" stroke-width="{1.8 if hollow else 0}"></ellipse>')
            up = STEP[p] < 4
            sx = x + (5.2 if up else -5.2) * size
            out.append(f'<path d="M{sx:.1f} {y:.1f}V{y + (-3.5 if up else 3.5) * sp:.1f}" stroke="{col}" stroke-width="1.2"></path>')
            if b == 3: out.append(f'<circle cx="{x + 10 * size:.1f}" cy="{y - (sp / 2 if STEP[p] % 2 == 0 else 0):.1f}" r="{1.6 * size:.1f}" fill="{col}"></circle>')
            if ch: out.append(f'<text x="{x - 5:.1f}" y="{top - 10 * size:.1f}" font-size="{15 * size:.0f}" font-weight="700" fill="{INK}">{ch}</text>')
            out.append(f'<text x="{x:.1f}" y="{base + 26 * size:.1f}" text-anchor="middle" font-size="{14 * size:.0f}" fill="{col}">{syl}</text>')
            x += adv[k]; acc += b
            if acc % 3 == 0 and idx < last:
                out.append(f'<path d="M{x - adv[k] * 0.5:.1f} {top:.1f}V{base:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
            idx += 1
        gy = base + 40 * size; H = gy
    return f'<svg viewBox="0 0 {w} {H:.0f}" width="100%" role="img" aria-label="Amazing Grace, bars 1 to 7" style="display: block">' + ''.join(out) + '</svg>'


# --- hanon
def hanon(w):
    notes = [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 4, 5, 6, 5, 4, 3]; x0, dx = 60, (w - 76) / 16; out = []
    out.append('<path d="' + ''.join(f'M4 {y}H{w-4}' for y in (26, 34, 42, 50, 58)) + f'" stroke="{INK}" stroke-width="0.9" fill="none"></path><text x="6" y="62" font-size="46" font-family="Noto Music, serif" fill="{INK}">𝄞</text>')
    hs = []
    for i, s in enumerate(notes):
        x = x0 + i * dx + (6 if i >= 8 else 0); y = 66 - s * 4
        if s == 0: out.append(f'<path d="M{x-7:.1f} 66H{x+7:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
        out.append(f'<ellipse cx="{x:.1f}" cy="{y}" rx="4.6" ry="3.4" transform="rotate(-20 {x:.1f} {y})" fill="{INK}"></ellipse>'); hs.append((x, y))
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
    const sel = st.sel ?? 1; const near = [(sel + 11) % 12, sel, (sel + 1) % 12];
    const arc = (r1, r2, a0, a1) => { const p = (r, a) => [(200 + r * Math.sin(a)).toFixed(1), (200 - r * Math.cos(a)).toFixed(1)]; const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0); return 'M' + x1 + ' ' + y1 + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + x2 + ' ' + y2 + 'L' + x3 + ' ' + y3 + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + x4 + ' ' + y4 + 'Z'; };
    const segs = MAJ.map((m, i) => { const a0 = (i - 0.5) * Math.PI / 6, a1 = (i + 0.5) * Math.PI / 6, am = i * Math.PI / 6, on = i === sel, nb = near.includes(i);
      return { o: arc(120, 196, a0, a1), n: arc(74, 120, a0, a1), fo: on ? C.accent : nb ? '#F6E7C8' : C.sheet, fi: on ? '#F3D9A8' : nb ? '#FAF0DC' : C.page, m, mn: MIN[i], mx: (200 + 160 * Math.sin(am)).toFixed(1), my: (208 - 160 * Math.cos(am)).toFixed(1), nx: (200 + 97 * Math.sin(am)).toFixed(1), ny: (205 - 97 * Math.cos(am)).toFixed(1), mxp: ((200 + 160 * Math.sin(am)) / 4).toFixed(2), myp: ((200 - 160 * Math.cos(am)) / 4).toFixed(2), nxp: ((200 + 97 * Math.sin(am)) / 4).toFixed(2), nyp: ((200 - 97 * Math.cos(am)) / 4).toFixed(2), pick: () => set({ sel: i }) }; });
    return { ...common(st, set), name: MAJ[sel] + ' major', sub: SIGN[sel] + ' · relative ' + MIN[sel].replace('m', '') + ' minor', segs,
      prev: () => set({ sel: (sel + 11) % 12 }), next: () => set({ sel: (sel + 1) % 12 }), pillBg: C.fill, wKey: wheel(MAJ.map((m) => m + ' major'), sel, (i) => set({ sel: i })) };'''
