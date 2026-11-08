# R40 Songs in the calm language: the library, a song's page, the score editor. Run through calm.py (it execs this).

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
        for p, b, syl, ch in sysn:
            y = base - STEP[p] * sp / 2; on = idx == sel; past = played is not None and idx < played
            col = '#8C6418' if on else (SOFT if past else INK)
            if on: out.append(f'<rect x="{x - 12 * size:.1f}" y="{top - 22 * size:.1f}" width="{24 * size:.1f}" height="{4 * sp + 44 * size:.1f}" rx="{8 * size:.1f}" fill="{ACCENT}" opacity=".55"></rect>')
            if STEP[p] < 0: out.append(f'<path d="M{x - 9 * size:.1f} {base + sp:.1f}H{x + 9 * size:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
            hollow = b >= 2
            out.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{5.6 * size:.1f}" ry="{4 * size:.1f}" transform="rotate(-20 {x:.1f} {y:.1f})" fill="{"none" if hollow else col}" stroke="{col}" stroke-width="{1.8 if hollow else 0}"></ellipse>')
            up = STEP[p] < 4
            sx = x + (5.2 if up else -5.2) * size
            out.append(f'<path d="M{sx:.1f} {y:.1f}V{y + (-3.5 if up else 3.5) * sp:.1f}" stroke="{col}" stroke-width="1.2"></path>')
            if b == 3: out.append(f'<circle cx="{x + 10 * size:.1f}" cy="{y - (sp / 2 if STEP[p] % 2 == 0 else 0):.1f}" r="{1.6 * size:.1f}" fill="{col}"></circle>')
            if ch: out.append(f'<text x="{x - 5:.1f}" y="{top - 10 * size:.1f}" font-size="{15 * size:.0f}" font-weight="700" fill="{INK}">{ch}</text>')
            out.append(f'<text x="{x:.1f}" y="{base + 26 * size:.1f}" text-anchor="middle" font-size="{14 * size:.0f}" fill="{col}">{syl}</text>')
            x += wt(b) * dx; acc += b
            if acc % 3 == 0 and idx < last:
                out.append(f'<path d="M{x - dx * 0.5:.1f} {top:.1f}V{base:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
            idx += 1
        gy = base + 40 * size; H = gy
    return f'<svg viewBox="0 0 {w} {H:.0f}" width="100%" role="img" aria-label="Amazing Grace, bars 1 to 7" style="display: block">' + ''.join(out) + '</svg>'

LINKPILL = lambda label, href: f'<a href="{href}" style="flex: none; height: 44px; padding: 0 18px; border-radius: 22px; background: {FILL}; color: {INK}; text-decoration: none; font-size: 15px; font-weight: 600; display: flex; align-items: center; white-space: nowrap">{label}</a>'

# ── the library ──
S = lambda t, s, v, i, c, href='Song.dc.html': R(t, s, v, i, c, href)
list_page('Songs', 'My songs', 'Search your songs', {'places': ['All', 'Favourites', 'Learning', 'Learned', 'Archive'], 'groups': [
    {'g': 'Continue', 'rows': [S('Amazing Grace', 'Bar 9 of 16 · Simple · yesterday', '56%', 'G', HONEY)]},
    {'g': 'Folders', 'rows': [R('Hymns', '6 songs', '6', '♪', FILL, '#'), R('For my lessons', '3 songs', '3', '♪', FILL, '#'), R('Shared with me', 'From Maria’s group', '4', '♪', FILL, '#')]},
    {'g': 'Songs', 'rows': [S('Für Elise', 'Beethoven · Study · A minor', 'Learning', 'Am', PEACH), S('Let It Be', 'The Beatles · Pop · C major', 'Learned', 'C', SAGE), S('Clair de lune', 'Debussy · Study · D♭ major', '', 'D♭', SKY),
                            S('Twinkle, Twinkle, Little Star', 'Traditional · C major', 'Learned', 'C', SAGE), S('Ode to Joy', 'Beethoven · D major', '', 'D', LILAC), S('My first song', 'Written by you · F major', '', 'F', HONEY)]}]},
    back='', back_l='', add='Add', root='Songs', section='Songs',
    more_rows=ROWS(('link', 'Explore other people’s songs', ''), ('link', 'Import MusicXML or MIDI', ''), ('link', 'Sort by', 'Last played'), ('link', 'Select', '')))

# ── a song's page ──
SG_JS = RB_JS(r'''
    const tab = st.tab ?? 'Score', ver = st.ver ?? 1, VERS = ['Original', 'Simple', 'Easy'];
    return { ...common(st, set), name: 'Amazing Grace', sub: 'John Newton · Hymn · G major · ' + VERS[ver],
      tabs: tabsOf(['Score', 'Chords', 'Words', 'About'], tab, set), isScore: tab === 'Score', isChords: tab === 'Chords', isWords: tab === 'Words', isAbout: tab === 'About',
      verL: VERS[ver], verDown: () => set({ ver: (ver + 2) % 3 }), verUp: () => set({ ver: (ver + 1) % 3 }),
      chords: ['G', 'G', 'C', 'G', 'G', 'D', 'D', 'G', 'G', 'C', 'G', 'Em', 'D', 'G'].map((c, i) => ({ c, bg: i < 8 ? C.sheet : C.sheet, n: i + 1, ink: i < 8 ? C.soft : C.ink })),
      pillBg: C.fill, wVer: wheel(VERS, ver, (i) => set({ ver: i })) };''')
def SG_STAGE(w, size):
    return f'''<sc-if value="{{{{isScore}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; justify-content: center; padding: 10px 14px; overflow: hidden">{score_svg(w, sel=None, played=7, size=size)}</div></sc-if>
<sc-if value="{{{{isChords}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; align-content: center"><sc-for list="{{{{chords}}}}" as="c" hint-placeholder-count="14"><span style="height: 56px; border-radius: 12px; background: {{{{c.bg}}}}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: {{{{c.ink}}}}">{{{{c.c}}}}</span></sc-for></div></sc-if>
<sc-if value="{{{{isWords}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 0 6px; font-size: 19px; line-height: 1.5"><p style="margin: 0 0 8px; font-size: 13px; color: {SOFT}">Verse 1</p><p style="margin: 0">Amazing grace, how sweet the sound</p><p style="margin: 0">That saved a wretch like me.</p><p style="margin: 0; color: {SOFT}">I once was lost, but now am found,</p><p style="margin: 0; color: {SOFT}">Was blind, but now I see.</p></div></sc-if>
<sc-if value="{{{{isAbout}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 12px">{ROWS(('val', 'Level', 'Beginner'), ('val', 'Time', '3/4 · 80 BPM'), ('val', 'Hands', 'Melody right, chords left'), ('val', 'Added', 'From the library · 12 Oct'))}</div></sc-if>'''
SG_ROWS = ROWS(('step', 'Version', 'verL', 'verDown', 'verUp'), ('val', 'Where you stopped', 'Bar 9 of 16'), ('link', 'Song settings', '', ''))
SG_MIDS = LINKPILL('Edit', 'Editor.dc.html') + '<span style="flex: 1"></span>' + PILL('From bar 9', 'togglePlay')
calm_page('Song', 'A song', SG_JS, SG_STAGE(340, 1.05), SG_STAGE(1000, 1.35), rows=SG_ROWS, change='', mids=SG_MIDS, hero=40,
          back='Songs.dc.html', back_l='SongsLaptop.dc.html', heart=True, section='Songs',
          more=ROWS(('link', 'Edit score', '', 'Editor.dc.html'), ('link', 'Move to folder', ''), ('link', 'Export', 'MusicXML, MIDI, PDF'), ('link', 'Publish', ''), ('link', 'Archive', '')), more_title='Amazing Grace')
for f in ('SongLaptop',):  # the laptop Edit pill points at the laptop editor
    s = open(OUT + f + '.dc.html').read().replace('href="Editor.dc.html"', 'href="EditorLaptop.dc.html"'); open(OUT + f + '.dc.html', 'w').write(s)

# ── the score editor ──
ED_JS = RB_JS(r'''
    const DUR = ['Whole', 'Half', 'Dotted half', 'Quarter', 'Eighth', 'Sixteenth'], d = st.dur ?? 1, sel = st.sel ?? 5, tool = st.tool ?? '';
    const PITCH = ['D4', 'E4', 'F♯4', 'G4', 'A4', 'B4', 'C5', 'D5'], p = st.p ?? 3;
    const marks = { [[62, 64, 66, 67, 69, 71, 72, 74][p]]: ['#EDC684', PITCH[p].replace(/\d/, '')] };
    return { ...common(st, set), name: 'Amazing Grace', sub: 'Bar 3 · beat 1 · G4 half note',
      durL: DUR[d], wDur: wheel(DUR, d, (i) => set({ dur: i })), wPitch: wheel(PITCH, p, (i) => set({ p: i })),
      pitchL: PITCH[p], pDown: () => set({ p: Math.max(0, p - 1) }), pUp: () => set({ p: Math.min(7, p + 1) }),
      kb: calmKeys(55, 79, marks, 370, 120), kbL: calmKeys(48, 84, marks, 890, 170),
      keysOn: !!st.keys, notKeys: !st.keys, toggleKeys: () => set({ keys: !st.keys }), keysBg: st.keys ? C.accent : C.fill,
      tieBg: st.tie ? C.accent : C.fill, toggleTie: () => set({ tie: !st.tie }), restBg: C.fill, rest: () => {}, accBg: C.fill, acc: () => {}, pillBg: C.fill };''')
EB = lambda label, act, bg, extra='': f'<button type="button" onClick="{{{{{act}}}}}" style="flex: none; height: 44px; min-width: 44px; padding: 0 12px; border: 0; border-radius: 22px; background: {{{{{bg}}}}}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; white-space: nowrap" {extra}>{label}</button>'
ED_FLOAT = (f'<div role="toolbar" aria-label="Write" style="position: absolute; left: 16px; right: 16px; bottom: 34px; z-index: 40; height: 68px; box-sizing: border-box; padding: 0 8px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 6px">'
            f'<button type="button" onClick="{{{{openChange}}}}" style="flex: 1; min-width: 0; height: 52px; border: 0; background: transparent; padding: 0 10px; display: flex; align-items: center; gap: 6px; color: {INK}; font: inherit; font-size: 16px; font-weight: 600; white-space: nowrap">{{{{durL}}}}<span style="display: flex">{CHEV_U}</span></button>'
            + EB('Rest', 'rest', 'restBg') + EB('Tie', 'toggleTie', 'tieBg') + EB('♯ ♭', 'acc', 'accBg') + EB('Keys', 'toggleKeys', 'keysBg') + '</div>')
DONE = lambda href: f'<a href="{href}" style="height: 44px; display: flex; align-items: center; color: {LINK}; text-decoration: none; font-size: 17px; font-weight: 600">Done</a>'
def ED_BAR(href):
    return f'<header style="flex: none; height: 44px; display: flex; align-items: center; gap: 4px; padding: 0 10px 0 16px">{DONE(href)}<span style="flex: 1"></span>{ICONBTN("Undo", UNDO)}{ICONBTN("Redo", REDO)}<button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></header>'
ED_MORE = ROWS(('link', 'Title and composer', 'Amazing Grace'), ('link', 'Key and time', 'G major · 3/4'), ('link', 'Instruments and staves', 'Piano'), ('link', 'Add bars', ''), ('link', 'Hear while writing', 'On'))
ed_body = f"""{ED_BAR('Song.dc.html')}
<div style="flex: none; padding: 0 16px; display: flex; flex-direction: column; gap: 2px"><h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.01em">{{{{name}}}}</h1><p style="margin: 0; font-size: 15px; color: {SOFT}">{{{{sub}}}}</p></div>
<div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 14px 16px 118px">
<div style="flex: 1; min-height: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 10px 12px; display: flex; flex-direction: column; justify-content: center; overflow: hidden">{score_svg(340, sel=5, size=1.05)}</div>
<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{false}}}}">{KEYS(120)}</sc-if>
<sc-if value="{{{{notKeys}}}}" hint-placeholder-val="{{{{true}}}}">{ROWS(('step', 'Pitch', 'pitchL', 'pDown', 'pUp'), ('link', 'Words under it', 'sweet'), ('link', 'Chord above it', 'C'))}</sc-if>
</div>
{ED_FLOAT}"""
phone('Editor', 'Score editor, phone', ed_body, ED_JS, SHEET_PHONE('changeOn', 'Note value', WHEEL([('wDur', 1)])) + MORESHEET('Score', ED_MORE))
ed_main = f"""<header style="flex: none; height: 72px; display: flex; align-items: center; gap: 6px; padding: 0 32px 0 40px">{DONE('SongLaptop.dc.html')}<span style="flex: 1"></span>{ICONBTN("Undo", UNDO)}{ICONBTN("Redo", REDO)}<button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></header>
<div style="flex: none; padding: 0 64px; display: flex; flex-direction: column; gap: 4px"><h1 style="margin: 0; font-size: 40px; font-weight: 700; letter-spacing: -0.01em">{{{{name}}}}</h1><p style="margin: 0; font-size: 16px; color: {SOFT}">John Newton · Hymn · G major · 3/4</p></div>
<div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 14px; padding: 18px 64px 24px">
<div style="flex: 1; min-height: 0; border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 18px 28px; display: flex; flex-direction: column; justify-content: center; overflow: hidden">{score_svg(1000, sel=5, size=1.3)}</div>
<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{false}}}}">{KEYS(170).replace('kb.', 'kbL.')}</sc-if>
<div style="flex: none; display: flex; justify-content: center"><div style="position: relative; width: 600px; height: 68px">{ED_FLOAT.replace('position: absolute; left: 16px; right: 16px; bottom: 34px;', 'position: absolute; inset: 0;')}</div></div>
</div>"""
ed_aside = (f'<h2 style="margin: 0; font-size: 20px; font-weight: 700">Note</h2><p style="margin: -10px 0 0; font-size: 15px; color: {SOFT}">{{{{sub}}}}</p>'
            + ROWS(('step', 'Pitch', 'pitchL', 'pDown', 'pUp'), ('link', 'Accidental', 'None'), ('link', 'Tie to the next', 'Off'))
            + f'<h2 style="margin: 8px 0 0; font-size: 17px; font-weight: 700">Note value</h2>' + WHEEL([('wDur', 1)])
            + ROWS(('link', 'Words under it', 'sweet'), ('link', 'Chord above it', 'C')))
laptop('EditorLaptop', 'Score editor, laptop', ed_main, ed_aside, ED_JS, POP_L('moreOn', '<span style="font-size: 16px; font-weight: 600">Score</span>' + ED_MORE, 'right: 40px; top: 64px', 380), 'Songs')
print('songs ok')
