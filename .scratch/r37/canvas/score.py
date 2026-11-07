# The sheet is the app's own engraving (Verovio's SVG, measured by scoremeasure.mjs): a page that
# scrolls, or one line that scrolls sideways; each hand's staff takes its hand's Shown/Dimmed/Hidden.
# Grid and Lyrics run under the floating transport instead of stopping above it.
import json, re, sys, os
proj = sys.argv[1]
S = os.path.dirname(os.path.abspath(__file__)) + '/..'
M = json.load(open(S + '/svg/measured.json'))
CHORDS = ['G G7 C G', 'G G D D7', 'G G7 C G', 'Em D G G']
INK, LINE, RH_INK, LH_INK, CURSOR = '#1A1612', '#CFC6BB', '#B4553E', '#6F5BA7', '#2F6DB0'

QN = '<svg aria-hidden="true" width="8" height="13" viewBox="0 0 8 13" style="display: inline-block; vertical-align: -1px; margin: 0 2px"><ellipse cx="3.4" cy="10.6" rx="3.3" ry="2.3" transform="rotate(-20 3.4 10.6)" fill="currentColor"></ellipse><path d="M6.3 10V0.5" stroke="currentColor" stroke-width="1.2"></path></svg>'

def once(t, a, b, f):
    assert t.count(a) == 1, (f, a[:90], t.count(a))
    return t.replace(a, b)

def chord(name, fs):
    root, ext = re.match(r'([A-G][#b]?m?)(.*)', name).groups()
    sup = '<sup style="font-size: 0.62em; vertical-align: 0.6em; margin-left: 1px">%s</sup>' % ext if ext else ''
    return root + sup

def clean(svg, suffix, hand_hole=True):
    svg = re.sub(r'\s+xmlns(:xlink)?="[^"]*"', '', svg)
    svg = re.sub(r'\s+version="[^"]*"', '', svg)
    svg = re.sub(r'<desc>.*?</desc>', '', svg, flags=re.S)
    svg = re.sub(r'>\s+<', '><', svg)
    svg = re.sub(r'\sid="([^"]+)"', lambda m: ' id="%s-%s"' % (m.group(1), suffix), svg)
    svg = re.sub(r'href="#([^"]+)"', lambda m: 'href="#%s-%s"' % (m.group(1), suffix), svg)
    svg = svg.replace(' data-staff="treble"', '').replace(' data-staff="bass"', '')
    # Verovio sets no fill or stroke: the notes take the ink, the staff's lines and barlines the line colour
    svg = svg.replace('<svg ', '<svg aria-hidden="true" fill="currentColor" stroke="currentColor" style="display: block; overflow: visible" ', 1)
    svg = re.sub(r'<g([^>]*)class="(barLine|ledgerLines[^"]*)"', r'<g\1class="\2" style="color: %s"' % LINE, svg)
    svg = re.sub(r'<path d="(M\d+ \d+ L\d+ \d+)" stroke-width="13"></path>', r'<path d="\1" stroke-width="13" style="color: %s"></path>' % LINE, svg)
    svg = svg.replace('class="note note-sounding"', 'class="note note-sounding" style="color: {{soundInk}}"')
    svg = svg.replace('class="grpSym"', 'class="grpSym" style="opacity: {{braceOp}}"')
    BAR = r'<path d="M(\d+) (\d+) L(\d+) (\d+)" stroke-width="27"></path>'
    ys = [(int(m.group(2)), int(m.group(4))) for m in re.finditer(BAR, svg)]
    mid = (min(y for y, _ in ys) + max(y for _, y in ys)) / 2
    def join(m):
        y1, y2 = sorted((int(m.group(2)), int(m.group(4))))
        hole = '{{braceOp}}' if y1 < mid < y2 else '{{staffOpR}}' if y2 <= mid else '{{staffOpL}}'
        return m.group(0)[:-len('></path>')] + ' style="opacity: %s"></path>' % hole
    svg = re.sub(r'<path d="M(\d+) (\d+) L(\d+) (\d+)" stroke-width="27"></path>', join, svg)
    if hand_hole:
        svg = svg.replace('data-hand="r"', 'style="opacity: {{staffOpR}}; transition: opacity 0.2s"')
        svg = svg.replace('data-hand="l"', 'style="opacity: {{staffOpL}}; transition: opacity 0.2s"')
    return svg

DEVS = {
 'R3Phone': dict(m='phone', left=16, title=26, sub=13, lab=12, cfs=16, row=20, gapAfter=22, titleH=78, pano_cut=8, bottom=132, grip=(20, 40)),
 'R3Laptop': dict(m='laptop', left=40, title=40, sub=15, lab=14, cfs=22, row=28, gapAfter=30, titleH=120, pano_cut=8, bottom=140, grip=(26, 52)),
}

def geom(s, mode):
    ms = s['meas']
    rb = max(m['r'][1] for m in ms); lt = min(m['l'][0] for m in ms)
    if mode == 'r': return 0, round(rb + 6), ms[0]['tTop'], ms[0]['tBot']
    if mode == 'l': sh = round(lt - 6); return sh, round(s['h']) - sh, ms[0]['bTop'], ms[0]['bBot']
    return 0, round(s['h']), ms[0]['tTop'], ms[0]['bBot']

for f, d in DEVS.items():
    p = '%s/%s.dc.html' % (proj, f)
    t = open(p).read()
    sysm = M[d['m']]
    L = d['left']
    R2 = d['row'] * 2
    GEOM, SYSM = {}, {}
    for mode in ('both', 'r', 'l'):
        g, y, sy = {}, d['titleH'], []
        for i, s in enumerate(sysm):
            sh, vh, top, bot = geom(s, mode)
            g['s%d' % i], g['v%d' % i], g['b%d' % i] = sh, vh, R2 + vh
            if i == 0: g['ct'], g['ch'] = R2 + round(top) - sh - 8, round(bot - top) + 16; g['pct'] = d['row'] + round(top) - sh - 8
        pv = max(geom(s, mode)[1] for s in sysm)
        g['pv'], g['ph'], g['pr'] = pv, d['row'] + pv, d['row'] + pv + 40
        for v in range(2):
            for i, s in enumerate(sysm):
                sh, vh, top, bot = geom(s, mode)
                ms = s['meas']
                xs = [L + ms[0]['first'] - 10] + [L + m['x1'] for m in ms]
                sy.append('{ y: %d, h: %d, x: [%s] }' % (y + R2 + top - sh - 10, bot - top + 20, ', '.join(str(round(x)) for x in xs)))
                y += R2 + vh + d['gapAfter']
        GEOM[mode] = g; SYSM[mode] = '[' + ', '.join(sy) + ']'
    # ---- the page: title, then eight systems (two verses), measured
    y = d['titleH']
    blocks, SYS = [], []
    for v in range(2):
        for i, s in enumerate(sysm):
            n = v * 16 + i * 4 + 1
            label = ('%d · Verse %d · ' % (n, v + 1) + QN + '= 80') if i == 0 else str(n)
            ms = s['meas']
            svgY = y + d['row'] * 2
            cells = ''.join('<span style="position: absolute; left: %dpx; top: %dpx; font-family: Georgia, \'Times New Roman\', serif; font-size: %dpx; font-weight: 700; line-height: 1; color: %s; visibility: {{chordVis}}">%s</span>'
                            % (L + ms[k]['first'] - 2, d['row'], d['cfs'], INK, chord(c, d['cfs'])) for k, c in enumerate(CHORDS[i].split()))
            cursor = ''
            if False:
                cx = L + ms[0]['first'] - 4
                cursor = '<div aria-hidden="true" style="position: absolute; left: %dpx; top: {{sg.ct}}px; width: 2px; height: {{sg.ch}}px; border-radius: 1px; background: %s"></div>' % (cx, CURSOR)
            blocks.append('<div data-bars="%d-%d" style="position: relative; flex: none; height: {{sg.b%d}}px; margin-bottom: %dpx">'
                          '<span style="position: absolute; left: %dpx; top: 0; font-size: %dpx; font-variant-numeric: tabular-nums; color: #6B6259">%s</span>%s'
                          '<div style="position: absolute; left: %dpx; top: %dpx; width: %dpx; height: {{sg.v%d}}px"><div style="margin-top: -{{sg.s%d}}px">%s</div></div>%s</div>'
                          % (n, n + 3, i, d['gapAfter'], L + 20, d['lab'], label, cells, L, R2, round(s['w']), i, i, clean(s['html'], 'p%d%d' % (v, i)), cursor))
    gw, gh = d['grip']
    title = ('<h2 style="position: absolute; left: 0; right: 0; top: %dpx; margin: 0; text-align: center; font-family: Georgia, \'Times New Roman\', serif; font-size: %dpx; font-weight: 700; line-height: 1.1; color: %s">Amazing Grace</h2>'
             '<p style="position: absolute; left: 0; right: 0; top: %dpx; margin: 0; text-align: center; font-size: %dpx; color: #6B6259">Words: John Newton · Music: New Britain</p>'
             % (round(d['titleH'] * 0.12), d['title'], INK, round(d['titleH'] * 0.12) + d['title'] + 8, d['sub']))
    # the loop's bands and grips scroll with the page: lift them out of the screen and into it
    a = t.index('<sc-if value="{{isPage}}"')
    b = t.index('<sc-if value="{{isPano}}"', a)
    old = t[a:b]
    lp0 = old.index('<sc-if value="{{loop}}"')
    lp1 = old.rindex('</sc-if>\n</sc-if>')
    loopblk = old[lp0:lp1 + len('</sc-if>')]
    page = ('<sc-if value="{{isPage}}" hint-placeholder-val="{{true}}">\n'
            '<div role="region" aria-label="Amazing Grace, the score" tabindex="0" ref="{{scoreRef}}" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; background: #F7F3EE; color: %s">\n'
            '<div style="position: relative; display: flex; flex-direction: column; margin-top: {{sheetTop}}px; padding: %dpx 0 %dpx">\n%s\n%s\n%s\n<div aria-hidden="true" style="position: absolute; left: {{cur.x}}px; top: {{cur.y}}px; width: 2px; height: {{cur.h}}px; border-radius: 1px; background: %s; pointer-events: none; display: {{curDisp}}; transition: {{curTrans}}"></div>\n</div>\n</div>\n</sc-if>\n'
            % (INK, d['titleH'], d['bottom'], title, '\n'.join(blocks), loopblk, CURSOR))
    t = t[:a] + page + t[b:]
    # ---- one line: the systems end to end, the first's clef and key held at the left
    a = t.index('<sc-if value="{{isPano}}"')
    b = t.index('</sc-if>\n</sc-if>', a)
    s0 = sysm[0]
    hold = round(s0['meas'][0]['first'] - d['pano_cut'])
    h = round(max(s['h'] for s in sysm))
    segs, x = [], 0
    marks = []
    for v in range(2):
        for i, s in enumerate(sysm):
            ms = s['meas']
            cut = round(ms[0]['first'] - d['pano_cut'])
            w = round(s['w']) - cut
            cells = ''.join('<span style="position: absolute; left: %dpx; top: 0; font-family: Georgia, \'Times New Roman\', serif; font-size: %dpx; font-weight: 700; line-height: 1; color: %s; visibility: {{chordVis}}">%s</span>'
                            % (ms[k]['first'] - 2 - cut, d['cfs'], INK, chord(c, d['cfs'])) for k, c in enumerate(CHORDS[i].split()))
            segs.append('<div style="position: relative; flex: none; width: %dpx; height: {{sg.ph}}px">%s<div style="position: absolute; left: 0; top: %dpx; width: %dpx; height: {{sg.pv}}px; overflow: visible; clip-path: inset(-60px 0 -60px 0)"><div style="margin: -{{sg.s%d}}px 0 0 -%dpx">%s</div></div></div>'
                        % (w, cells, d['row'], w, i, cut, clean(s['html'], 'q%d%d' % (v, i))))
    # the clef, key and time stay at the line's left as it scrolls past
    head = ('<div aria-hidden="true" style="position: sticky; left: 0; z-index: 2; flex: none; width: %dpx; height: {{sg.pv}}px; margin-top: %dpx; background: #F7F3EE; overflow: hidden"><div style="position: absolute; left: %dpx; top: -{{sg.s0}}px">%s</div></div>'
            '<div aria-hidden="true" style="position: sticky; left: %dpx; z-index: 2; flex: none; width: 12px; height: {{sg.pv}}px; margin: %dpx -12px 0 0; background: linear-gradient(90deg, #F7F3EE, rgba(247, 243, 238, 0))"></div>'
            % (L + hold, d['row'], L, clean(s0['html'], 'h'), L + hold, d['row']))
    first = s0['meas'][0]['first']
    pano = ('<sc-if value="{{isPano}}" hint-placeholder-val="{{false}}">\n'
            '<div role="region" aria-label="Amazing Grace on one line" tabindex="0" ref="{{panoRef}}" style="position: absolute; left: 0; right: 0; top: {{panoTop}}px; height: {{sg.pr}}px; overflow-x: auto; overflow-y: hidden; overscroll-behavior-x: contain; scrollbar-width: none; background: #F7F3EE; color: %s">\n'
            '<div style="position: relative; display: flex; width: max-content; height: {{sg.pr}}px; padding-right: %dpx">%s%s'
            '<div aria-hidden="true" style="position: absolute; z-index: 3; left: {{pcur.x}}px; top: {{sg.pct}}px; width: 2px; height: {{sg.ch}}px; border-radius: 1px; background: %s; pointer-events: none; display: {{curDisp}}; transition: {{curTrans}}"></div></div>\n</div>\n'
            % (INK, round(L * 6), head, ''.join(segs), CURSOR))
    t = t[:a] + pano + t[b:]
    BEATX = [[round(L + x - 3) for m in s['meas'] for x in m['beats'][:3]] for s in sysm]
    PANOX, off = [], L + hold
    for v in range(2):
        for i, s in enumerate(sysm):
            cut = round(s['meas'][0]['first'] - d['pano_cut'])
            PANOX.append([round(off + x - cut - 3) for m in s['meas'] for x in m['beats'][:3]])
            off += round(s['w']) - cut
    # ---- the loop's bars now from the engraving, in the page's own coordinates
    MODE = "const sheetHide = { rh: (s.showR ?? 'show') === 'hide', lh: (s.showL ?? 'show') === 'hide' };\nconst sheetMode = sheetHide.rh && !sheetHide.lh ? 'l' : sheetHide.lh && !sheetHide.rh ? 'r' : 'both';\n"
    t = re.sub(r'const SYS = \[.*?\];', lambda m: MODE + 'const SHEET_GEOM = %s;\nconst BEATX = %s;\nconst PANOX = %s;\nconst SYS = (%s)[sheetMode];' % (json.dumps(GEOM), json.dumps(BEATX), json.dumps(PANOX), '{ both: %s, r: %s, l: %s }' % (SYSM['both'], SYSM['r'], SYSM['l'])), t, count=1, flags=re.S)
    t = once(t, 'const sheetTopNow = ' + ('keys ? 40 : 116' if f == 'R3Phone' else 'keys ? 44 : 64') + ';', 'const sheetTopNow = 0;', f)
    # the staves' look comes from each hand's Shown / Dimmed / Hidden; the veils go
    t = once(t, 'showL: showTurn(', "staffOpR: sheetMode === 'l' ? 0 : showOf.rh === 'show' ? 1 : 0.32, staffOpL: sheetMode === 'r' ? 0 : showOf.lh === 'show' ? 1 : 0.32,\nbraceOp: sheetMode === 'both' ? 1 : 0, sg: SHEET_GEOM[sheetMode],\nsoundInk: 'currentColor',\nshowL: showTurn(", f)
    # Grid and Lyrics scroll under the floating transport
    t = once(t, 'top: {{viewTop}}px; bottom: {{viewBottom}}px; overflow: hidden; display: flex; flex-direction: column; gap: 3px">',
             'top: {{viewTop}}px; bottom: 0; padding-bottom: {{viewBottom}}px; box-sizing: border-box; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; display: flex; flex-direction: column; gap: 3px">', f)
    t = once(t, 'aria-label="Lyrics and chords" style="position: absolute; left: 0; right: 0; padding: 0 {{padX}}px; box-sizing: border-box; top: {{viewTop}}px; bottom: {{viewBottom}}px;',
             'aria-label="Lyrics and chords" style="position: absolute; left: 0; right: 0; padding: 0 {{padX}}px; box-sizing: border-box; top: {{viewTop}}px; bottom: 0;', f)
    t = once(t, 'overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; padding-bottom: 24px;',
             'overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; padding-bottom: calc({{viewBottom}}px + 24px);', f)
    open(p, 'w').write(t)
    print(f, 'score ok', len(t))
