"""R46: the Player boards draw Amazing Grace as the app engraves it (plan/player-score.md, #155).

Reads player/score/<desk|phone>.json (player/capture_score.mjs: the app's own Verovio systems, bar edges, beats,
headings and chord names at 1710 or 402, for all staves, the bass hidden (r) and the treble hidden (l)) and patches the
built PlayerDesk or PlayerApp in place, as r43_player.py's note asks of later passes:
- the page view's systems: one verse, the pickup, the Melody with its words over the Piano's grand staff, pedal marks;
  the app's systems per staff view (four at 1710, seven at 402), each heading and chord name where the app sets it;
- the one-line view: those systems end to end, the first one's clef, key and time held at the left;
- SYS, SYSBARS and BARSYS (which bars each system holds), the beats, the playhead and the loop from the same capture;
  the run ends after bar 16, no second verse;
- Played through says what the app says: the hands, then the mode.
Run: python3 -I player/r46_score.py desk|phone  (from .scratch/r39/canvas); it refuses a board it has already patched."""
import json, re, pathlib, sys as _sys

HERE = pathlib.Path(__file__).resolve().parent
# each board's own layout: its title's top in the score's column (where the capture's origin, the app's title, is), the
# column's top padding, the line's page margin, the line's foot (the floating keys' top), the old line's held width
BOARDS = {
    'desk': {'file': 'PlayerDesk', 'top': 14, 'pad': 105, 'margin': 40, 'foot': 620, 'panoTop': 340, 'held': 172},
    'phone': {'file': 'PlayerApp', 'top': 9, 'pad': 75, 'margin': 16, 'foot': 565, 'panoTop': 376, 'held': 87},
}
WHICH = _sys.argv[1]
B = BOARDS[WHICH]
BOARD = HERE.parent / 'practice' / 'project' / f'{B["file"]}.dc.html'
CAP = json.loads((HERE / 'score' / f'{WHICH}.json').read_text())
TOP = B['top']
CHORD = re.compile(r'^[A-G][♯♭#b]?(m|maj|dim|aug|°|ø|sus)?\d*$')
NOTE = ('<svg aria-hidden="true" width="8" height="13" viewBox="0 0 8 13" style="display: inline-block; vertical-align: -1px; margin: 0 2px">'
        '<ellipse cx="3.4" cy="10.6" rx="3.3" ry="2.3" transform="rotate(-20 3.4 10.6)" fill="currentColor"></ellipse>'
        '<path d="M6.3 10V0.5" stroke="currentColor" stroke-width="1.2"></path></svg>')


def font(c):
    return (f"font-family: {c['family'].replace(chr(34), chr(39))}; font-size: {c['size']}; font-weight: {c['weight']}; "
            f"line-height: 1; color: {c['color']}")


def heading(h):
    """One piece of a system's heading: a chord name (hidden with the chord names) or the bar, section and tempo."""
    html = re.sub(r'<sup[^>]*>', '<sup style="font-size: 0.7em">', h['html'])
    html = re.sub(r'<span class="font-music">[^<]*</span>', NOTE, html)
    b = h['box']
    vis = '; visibility: {{chordVis}}' if CHORD.match(h['text']) else '; font-variant-numeric: tabular-nums; white-space: pre'
    return f'<span style="position: absolute; left: {b["x"]}px; top: {TOP + b["y"]}px; {font(h["css"])}{vis}">{html}</span>'


def staves(svg, view):
    """Each bar's piano staves take the hand's opacity (dimmed or shown), as the board's own staves did."""
    ops = {'both': [None, '{{staffOpR}}', '{{staffOpL}}'], 'r': [None, '{{staffOpR}}'], 'l': [None, '{{staffOpL}}']}[view]
    out, i = [], 0
    for part in re.split(r'(<g [^>]*class="(?:measure|staff)"[^>]*>)', svg):
        if 'class="measure"' in part:
            i = 0
        elif 'class="staff"' in part:
            op = ops[i] if i < len(ops) else None
            i += 1
            if op:
                part = part[:-1] + f' style="opacity: {op}">'
        out.append(part)
    return ''.join(out)


def page(view):
    cap = CAP[view]
    parts, bottom = [], 0
    for sy in cap['systems']:
        parts += [heading(h) for h in sy['head']]
        b = sy['box']
        parts.append(f'<div style="position: absolute; left: {b["x"]}px; top: {TOP + b["y"]}px; width: {b["w"]}px; height: {b["h"]}px">'
                     + staves(sy['svg'], view) + '</div>')
        bottom = max(bottom, TOP + b['y'] + b['h'])
    flag = {'both': 'smBoth', 'r': 'smR', 'l': 'smL'}[view]
    # the column's top padding comes first; this spacer carries it to the last system's foot
    return (f'<sc-if value="{{{{{flag}}}}}" hint-placeholder-val="{{{{{"true" if view == "both" else "false"}}}}}">'
            f'<div data-score="{view}" style="flex: none; height: {bottom - B["pad"]}px"></div>' + ''.join(parts) + '</sc-if>\n')


def beats(view):
    """Each bar's three beats, x by x: the piano's onsets where it has three; else spaced in the bar as the music is."""
    out = []
    for si, sy in enumerate(CAP[view]['systems']):
        row, bars, xs = [], sy['bars'], sy['beats']
        if si == 0:  # the first system opens on the pickup
            bars, xs = bars[1:], xs[1:]
        for bar, got in zip(bars, xs):
            if len(got) < 3:  # a held note: beats 2 and 3 fall on the bar's own spacing
                step = (bar['x'] + bar['w'] - got[0]) / 3
                got = [got[0], round(got[0] + step), round(got[0] + 2 * step)]
            row += got[:3]
        out.append(row)
    return out


def sys(view):
    out = []
    for si, sy in enumerate(CAP[view]['systems']):
        bars = sy['bars'][1:] if si == 0 else sy['bars']
        out.append({'y': TOP + sy['box']['y'], 'h': sy['box']['h'], 'x': [b['x'] for b in bars] + [bars[-1]['x'] + bars[-1]['w']]})
    return out


def pano(view):
    """The one-line view: the systems end to end, the first one's clef, key and time held at the left (as before),
    each system from where its music begins to its last barline; the chord names over their bars."""
    cap = CAP[view]['systems']
    s0 = cap[0]
    def start(sy):  # where a system's music begins: its first beat less a bar's lead-in (the clef, key and time before it)
        lead = sy['beats'][1][0] - sy['bars'][1]['x']
        return sy['beats'][0][0] - lead
    clef = start(s0) - s0['box']['x']  # the first system's labels, brace, clef, key and time, held at the left
    pv, top = s0['box']['h'], s0['box']['y'] - min(h['box']['y'] for h in s0['head'] if CHORD.match(h['text']))
    hold = B['margin'] + clef
    tiles, xs, at = [], [], hold
    for sy in cap:
        left = start(sy)
        w = sy['bars'][-1]['x'] + sy['bars'][-1]['w'] - left
        chords = ''.join(heading(dict(h, box=dict(h['box'], x=h['box']['x'] - left, y=h['box']['y'] - sy['box']['y'] + top - TOP)))
                         for h in sy['head'] if CHORD.match(h['text']))
        tiles.append(f'<div style="position: relative; flex: none; width: {w}px; height: {top + sy["box"]["h"]}px">{chords}'
                     f'<div style="position: absolute; left: 0; top: {top}px; width: {w}px; height: {sy["box"]["h"]}px; overflow: visible; clip-path: inset(-60px 0 -60px 0)">'
                     f'<div style="margin-left: -{left - sy["box"]["x"]}px">{staves(sy["svg"], view)}</div></div></div>')
        xs.append([at + x - left for bar in sy['beats'] for x in bar])
        at += w
    flag = {'both': 'smBoth', 'r': 'smR', 'l': 'smL'}[view]
    held = (f'<div aria-hidden="true" style="position: sticky; left: 0; z-index: 2; flex: none; width: {hold}px; height: {pv}px; margin-top: {top}px; '
            f'background: #F7F3EE; overflow: hidden"><div style="position: absolute; left: {B["margin"]}px; top: 0">{staves(s0["svg"], view)}</div></div>'
            f'<div aria-hidden="true" style="position: sticky; left: {hold}px; z-index: 2; flex: none; width: 12px; height: {pv}px; margin: {top}px -12px 0 0; '
            'background: linear-gradient(90deg, #F7F3EE, rgba(247, 243, 238, 0))"></div>')
    html = (f'<sc-if value="{{{{{flag}}}}}" hint-placeholder-val="{{{{{"true" if view == "both" else "false"}}}}}">'
            f'<div style="display: flex; flex: none">{held}{"".join(tiles)}</div></sc-if>')
    geom = {'pv': pv, 'ph': top + pv, 'pr': top + pv + 40, 'pct': top + 4, 'ch': pv - 8}
    return html, xs, geom


def panox(xs):
    """The beats in the line by system, as the page's: the first system's without its pickup."""
    return [row[1:] if i == 0 else row for i, row in enumerate(xs)]


def once(t, old, new):
    assert t.count(old) == 1, (t.count(old), old[:80])
    return t.replace(old, new)


t = BOARD.read_text()
assert 'data-score="both"' not in t, f'{B["file"]} already carries the app\'s score'
# the page view: the eight systems of two verses go; the app's systems per staff view come
a = t.index('<div data-bars="1-4"')
b = t.index('<sc-if value="{{loop}}"', t.index('<div data-bars="29-32"'))
t = t[:a] + ''.join(page(v) for v in ('both', 'r', 'l')) + t[b:]
# the one-line view: its tiles go; the line of the app's systems comes, one per staff view
P = {v: pano(v) for v in ('both', 'r', 'l')}
a = t.index(f'<div aria-hidden="true" style="position: sticky; left: 0; z-index: 2; flex: none; width: {B["held"]}px')
b = t.index('<div aria-hidden="true" style="position: absolute; z-index: 3; left: {{pcur.x}}px', a)
t = t[:a] + ''.join(P[v][0] for v in ('both', 'r', 'l')) + t[b:]
t = re.sub(r'const PANOX = \[\[.*?\]\];',
           'const PANOX = ' + json.dumps({v: panox(P[v][1]) for v in ('both', 'r', 'l')}) + '; '
           'const PPICK = ' + json.dumps({v: P[v][1][0][0] for v in ('both', 'r', 'l')}) + ';', t, count=1, flags=re.S)
t = once(t, 'pcur: { x: PANOX[sysNow][beatNow] },', 'pcur: { x: atHome ? PPICK[sheetMode] : PANOX[sheetMode][sysNow][beatNow] },')
t = re.sub(r'const SHEET_GEOM = \{.*?\}\};', 'const SHEET_GEOM = ' + json.dumps({v: P[v][2] for v in ('both', 'r', 'l')}) + ';', t, count=1, flags=re.S)
# the line stands with its foot at the floating keys' top, as the old line did
t = once(t, f'panoTop: {B["panoTop"]},', f'panoTop: {B["foot"]} - SHEET_GEOM[sheetMode].pr,')
# the tables the layers read
# which bars each system holds (the pickup apart), the same in every staff view: [first, last] by system, [system, index] by bar
counts = [len(sy['bars']) - (1 if si == 0 else 0) for si, sy in enumerate(CAP['both']['systems'])]
assert all([len(sy['bars']) - (1 if si == 0 else 0) for si, sy in enumerate(CAP[v]['systems'])] == counts for v in ('r', 'l')) and sum(counts) == 16
SYSBARS, BARSYS, n = [], [], 1
for si, c in enumerate(counts):
    SYSBARS.append([n, n + c - 1]); BARSYS += [[si, i] for i in range(c)]; n += c
t = re.sub(r'const SYS = \(\{.*?\}\)\[sheetMode\];',
           'const SYS = (' + json.dumps({v: sys(v) for v in ('both', 'r', 'l')}, separators=(', ', ': ')) + ')[sheetMode]; '
           f'const SYSBARS = {json.dumps(SYSBARS)}; const BARSYS = {json.dumps(BARSYS)};', t, count=1, flags=re.S)
t = once(t, 'const f = si * 4 + 1, l = f + 3;', 'const [f, l] = SYSBARS[si];')
t = once(t, 'const sy = SYS[Math.floor((n - 1) / 4)]; const i = (n - 1) % 4 + (after ? 1 : 0);',
         'const [si, bi] = BARSYS[n - 1]; const sy = SYS[si]; const i = bi + (after ? 1 : 0);')
t = once(t, 'const sysNow = verseNow * 4 + Math.floor(((atHome ? 1 : bar) - 1) / 4);', 'const sysNow = BARSYS[(atHome ? 1 : bar) - 1][0];')
t = once(t, 'const beatNow = ((atHome ? 1 : bar) - 1) % 4 * 3 + ((atHome ? 1 : beat) - 1);',
         'const beatNow = BARSYS[(atHome ? 1 : bar) - 1][1] * 3 + ((atHome ? 1 : beat) - 1);')
t = re.sub(r'const BEATX = \[\[.*?\]\];',
           'const BEATX = ' + json.dumps({v: beats(v) for v in ('both', 'r', 'l')}) + '; '
           'const PICK = ' + json.dumps({v: CAP[v]['systems'][0]['beats'][0][0] for v in ('both', 'r', 'l')}) + ';', t, count=1, flags=re.S)
t = once(t, 'cur: { x: BEATX[sysNow % 4][beatNow],', 'cur: { x: atHome ? PICK[sheetMode] : BEATX[sheetMode][sysNow][beatNow],')
t = once(t, 'sg: SHEET_GEOM[sheetMode],', "sg: SHEET_GEOM[sheetMode], smBoth: sheetMode === 'both', smR: sheetMode === 'r', smL: sheetMode === 'l',")
# one verse: the run ends after bar 16
t = once(t, 'const verseNow = s.verse ?? 0;', '')
t = once(t, 'if (b > 16) { if (verse === 0) { verse = 1; b = 1; } else { engine.setState(',
         'if (b > 16) { { engine.setState(')
# the Lyrics view: the one verse the song has; after its last line nothing comes next
t = re.sub(r"\n\['Verse 2', \[.*?\]\]\],\n", '\n', t, count=1)
t = once(t, 'lineNext: lineText(LYRICS[lineOf === 3 ? 1 : 0][1][(lineOf + 1) % 4]),', 'lineNext: lineOf === 3 ? \'\' : lineText(LYRICS[0][1][lineOf + 1]),')
t = re.sub(r'Both verses · \{\{doneMode\}\} · <span style="font-variant-numeric: tabular-nums">2:24</span>',
           '{{handsLabel}} · {{doneMode}}', t)
BOARD.write_text(t)
print(B['file'], len(t), 'bytes; systems hold', counts)
