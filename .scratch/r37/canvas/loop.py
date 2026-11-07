import sys
proj = sys.argv[1]

def once(t, a, b, f):
    assert t.count(a) == 1, (f, a[:80], t.count(a))
    return t.replace(a, b)

def every(t, a, b, f, n=None):
    c = t.count(a)
    assert c >= 1 and (n is None or c == n), (f, a[:80], c)
    return t.replace(a, b)

CHEV_L = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>'
CHEV_R = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'
REPEAT = 'M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3'

def grip(end, x, y, w, h, extra=''):
    lab = 'Loop starts at bar {{loopA}}' if end == 'A' else 'Loop ends after bar {{loopB}}'
    return ('<button type="button" aria-label="%s" onPointerDown="{{grip%s}}" onKeyDown="{{key%s}}" style="position: absolute; left: %s; top: %s; width: %dpx; height: %dpx; transform: translate(-50%%, -50%%); touch-action: none; cursor: ew-resize; border: 0; padding: 0; border-radius: 8px; background: #FFFFFF; box-shadow: 0 1px 3px rgba(26,22,18,0.28), 0 0 0 1px rgba(26,22,18,0.08); color: #E8762F; display: flex; align-items: center; justify-content: center; z-index: 2%s">%s</button>'
            % (lab, end, end, x, y, w, h, extra, CHEV_L if end == 'A' else CHEV_R))

SHEET_LOOP = lambda gw, gh: ('<sc-if value="{{loop}}" hint-placeholder-val="{{false}}">\n<sc-for list="{{loopBands}}" as="lb" hint-placeholder-count="1">\n'
    '<div aria-hidden="true" style="position: absolute; left: {{lb.x}}px; top: {{lb.y}}px; width: {{lb.w}}px; height: {{lb.h}}px; box-sizing: border-box; background: rgba(232, 118, 47, 0.12); border-left: {{lb.l}}; border-right: {{lb.r}}; pointer-events: none"></div>\n'
    '</sc-for>\n' + grip('A', '{{sheetGA.x}}px', '{{sheetGA.y}}px', gw, gh) + '\n' + grip('B', '{{sheetGB.x}}px', '{{sheetGB.y}}px', gw, gh) + '\n</sc-if>')

STRIP_GRIPS = ('\n<sc-if value="{{loop}}" hint-placeholder-val="{{false}}">\n'
    + grip('A', '{{stripGA}}px', '50%', 18, 0, '; height: 82%') + '\n'
    + grip('B', '{{stripGB}}px', '50%', 18, 0, '; height: 82%') + '\n</sc-if>')

GRID_GRIP = ('<span aria-hidden="true" onPointerDown="{{c.grip}}" style="display: {{c.gripShow}}; position: absolute; top: 50%; {{c.gripSide}}: {{c.gripOff}}px; transform: translateY(-50%); z-index: 2; width: 17px; height: 64%; border-radius: 6px; background: #FFFFFF; box-shadow: 0 1px 3px rgba(26,22,18,0.28), 0 0 0 1px rgba(26,22,18,0.08); color: #E8762F; align-items: center; justify-content: center; touch-action: none; cursor: ew-resize">'
             '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="{{c.gripD}}"></path></svg></span>\n</button>')

DEVL = {
 'R3Laptop': dict(sys="[{ y: 100, h: 160, x: [150, 530, 909, 1289, 1669] }, { y: 358, h: 165, x: [140, 517, 902, 1286, 1669] }, { y: 630, h: 165, x: [140, 517, 902, 1286, 1669] }, { y: 902, h: 160, x: [140, 517, 902, 1286, 1669] }]",
                  sheetBar=384, sheetRow=298, top='keys ? 44 : 64', gw=26, gh=52, rows=[4, 8]),
 'R3Phone': dict(sys="[{ y: 92, h: 128, x: [92, 160, 233, 306, 385] }, { y: 282, h: 125, x: [75, 150, 228, 306, 385] }, { y: 472, h: 125, x: [75, 150, 228, 306, 385] }, { y: 662, h: 115, x: [75, 150, 228, 306, 385] }]",
                 sheetBar=77, sheetRow=190, top='keys ? 40 : 116', gw=20, gh=40, rows=[2, 4]),
}

JS_PRE = r'''const loopA = s.loopA ?? Number(p.loopa ?? 5);
const loopB = s.loopB ?? Number(p.loopb ?? 8);
const inLoop = (n) => loop && n >= loopA && n <= loopB;
const loopEdge = (n, b) => (inLoop(n) ? 'inset 0 3px 0 #E8762F, inset 0 -3px 0 #E8762F' + (n === loopA && b === 1 ? ', inset 3px 0 0 #E8762F' : '') + (n === loopB && b === 3 ? ', inset -3px 0 0 #E8762F' : '') : 'none');
const perRow = s.perRow ?? DEV.perRow;
const textScale = { s: 0.85, m: 1, l: 1.2 }[s.text ?? 'm'];
const dragLoop = (end, barW, rowH) => (e) => {
e.preventDefault(); e.stopPropagation();
const el = e.currentTarget;
const k = el.getBoundingClientRect().width / (el.offsetWidth || 1) || 1;
const x0 = e.clientX, y0 = e.clientY, a0 = loopA, b0 = loopB;
const move = (ev) => {
const d = Math.round((ev.clientX - x0) / (barW * k)) + (rowH ? Math.round((ev.clientY - y0) / (rowH * k)) * 4 : 0);
if (end === 'a') this.setState({ loopA: Math.max(1, Math.min(b0, a0 + d)) });
else this.setState({ loopB: Math.min(16, Math.max(a0, b0 + d)) });
};
const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
};
const keyLoop = (end) => (e) => {
const d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
if (!d) return;
e.preventDefault();
if (end === 'a') this.setState({ loopA: Math.max(1, Math.min(loopB, loopA + d)) });
else this.setState({ loopB: Math.min(16, Math.max(loopA, loopB + d)) });
};
'''

JS_VALS = r'''const SYS = SYSTEMS;
const sheetTopNow = SHEETTOP;
const bandsOf = (a, b) => SYS.flatMap((sy, si) => {
const f = si * 4 + 1, l = f + 3;
if (b < f || a > l) return [];
const i0 = Math.max(a, f) - f, i1 = Math.min(b, l) - f + 1;
return [{ x: sy.x[i0], y: sheetTopNow + sy.y, w: sy.x[i1] - sy.x[i0], h: sy.h, l: a >= f ? '3px solid #E8762F' : '0', r: b <= l ? '3px solid #E8762F' : '0' }];
});
const gripAt = (n, after) => { const sy = SYS[Math.floor((n - 1) / 4)]; const i = (n - 1) % 4 + (after ? 1 : 0); return { x: sy.x[i], y: sheetTopNow + sy.y + sy.h / 2 }; };
const cellStep = (keys ? DEV.cellWKeys : DEV.cellW) + 3;
const SPEEDS = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
const lopt = (key, cur, list) => list.map(([id, name]) => ({ name, on: id === cur ? 'true' : 'false', ...chip(id === cur), pick: pick({ [key]: id }) }));
const LOOP_VALS = {
loop, loopA, loopB,
loopBands: bandsOf(loopA, loopB), sheetGA: gripAt(loopA, false), sheetGB: gripAt(loopB, true),
gripA: dragLoop('a', SHEETBAR, SHEETROW), gripB: dragLoop('b', SHEETBAR, SHEETROW), keyA: keyLoop('a'), keyB: keyLoop('b'),
stripGA: DEV.padX + (1 + (loopA - 1) * 3) * cellStep - 1.5, stripGB: DEV.padX + (1 + loopB * 3) * cellStep - 1.5,
toggleLoop: () => { if (loop) { this.setState({ loop: false }); return; } const a = Math.floor((bar - 1) / 4) * 4 + 1; this.setState({ loop: true, loopA: a, loopB: Math.min(16, a + 3) }); },
loopBtnLabel: loop ? 'Loop bars ' + loopA + '–' + loopB + ', remove' : 'Loop',
loopText: loop ? (loopA === loopB ? 'Bar ' + loopA : 'Bars ' + loopA + '–' + loopB) : 'Loop',
loopBg: loop ? '#FBE4D4' : 'transparent', loopFg: loop ? '#B4531A' : '#1A1612', loopPressed: loop ? 'true' : 'false',
loopTitle: loop ? (loopA === loopB ? 'Loop bar ' + loopA : 'Loop bars ' + loopA + '–' + loopB) : 'Loop',
loopSw: sw(loop, () => (loop ? this.setState({ loop: false }) : (() => { const a = Math.floor((bar - 1) / 4) * 4 + 1; this.setState({ loop: true, loopA: a, loopB: Math.min(16, a + 3) }); })())),
restOpts: lopt('rest', s.rest ?? 'none', [['none', 'None'], ['count', 'Count-in'], ['bar', 'Rest']]),
rampOpts: lopt('ramp', s.ramp ?? 0, [[0, 'Off'], [2, '+2%'], [5, '+5%'], [10, '+10%']]),
repOpts: lopt('reps', s.reps ?? 'inf', [['inf', '∞'], [3, '3'], [5, '5'], [10, '10']]),
speed, slower: pick({ speed: SPEEDS[Math.max(0, SPEEDS.indexOf(speed) - 1)] ?? 100 }), faster: pick({ speed: SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(speed) + 1)] ?? 100 }),
playOtherSw: sw(s.playOther ?? true, flip('playOther', true)),
otherShowOpts: lopt('otherShow', s.otherShow ?? 'dim', [['show', 'Show'], ['dim', 'Dim'], ['hide', 'Hide']]),
vol: s.vol ?? 80, setVol: (e) => this.setState({ vol: Number(e.target.value) }),
dispBg: open === 'keyboard' ? (DARK ? 'rgba(255, 255, 255, 0.26)' : '#E7E0D6') : (DARK ? 'rgba(26, 22, 18, 0.55)' : 'rgba(255, 255, 255, 0.9)'), dispFg: DARK ? '#FFFFFF' : '#1A1612', kbShowOpts: [['off', 'Off'], ['3d', '3D'], ['2d', '2D']].map(([id, name]) => { const on = id === (keys ? kbStyle : 'off'); return { name, on: on ? 'true' : 'false', ...chip(on), pick: () => this.setState(id === 'off' ? { keys: false } : { keys: true, kbStyle: id }) }; }), layoutOpts: lopt('layout', layout, [['page', 'Page'], ['panorama', 'Line']]), viewName: { sheet: 'Sheet', diagrams: 'Diagrams', grid: 'Grid', lyrics: 'Lyrics' }[view],
dStrip: s.dStrip ?? true, dLine: s.dLine ?? true, lStrip: s.lStrip ?? true, lSum: s.lSum ?? true,
dStripSw: sw(s.dStrip ?? true, flip('dStrip', true)), dLineSw: sw(s.dLine ?? true, flip('dLine', true)),
lStripSw: sw(s.lStrip ?? true, flip('lStrip', true)), lSumSw: sw(s.lSum ?? true, flip('lSum', true)),
perRowOpts: lopt('perRow', perRow, PERROWS.map((n) => [n, String(n)])),
textOpts: lopt('text', s.text ?? 'm', [['s', 'S'], ['m', 'M'], ['l', 'L']]),
};
'''

for f, d in DEVL.items():
    p = f'{proj}/{f}.dc.html'
    t = open(p).read()
    t = once(t, 'const loop = s.loop ?? false;', "const loop = s.loop ?? (p.loop === true || p.loop === 'true');", f)
    # JS before the views' beat cells
    t = once(t, 'const beatCell = (n, b, i) => {', JS_PRE + 'const beatCell = (n, b, i) => {', f)
    t = once(t, "bg: here ? '#1A1612' : '#FFFFFF', fg: here ? '#FFFFFF' : '#1A1612', current: here ? 'true' : 'false', aria: 'Bar ' + n + ', beat ' + b + ', ' + c, pick: seek(n, b) };",
             "bg: here ? '#1A1612' : inLoop(n) ? '#FBE4D4' : '#FFFFFF', mark: here ? 'none' : loopEdge(n, b), fg: here ? '#FFFFFF' : '#1A1612', current: here ? 'true' : 'false', aria: 'Bar ' + n + ', beat ' + b + ', ' + c + (inLoop(n) ? ', looped' : ''), pick: seek(n, b) };", f)
    t = once(t, "const pickupCell = { ...none, line: '0',", "const pickupCell = { ...none, mark: 'none', line: '0',", f)
    # grid
    t = once(t, 'const looped = live && loop;', 'const looped = v === 1 && inLoop(n);', f)
    t = once(t, "mark: looped ? 'inset 0 3px 0 #E8762F, inset 0 -3px 0 #E8762F' : 'none',",
             "mark: here || v !== 1 ? 'none' : loopEdge(n, b), gripShow: looped && ((n === loopA && b === 1) || (n === loopB && b === 3)) ? 'flex' : 'none', gripSide: n === loopA && b === 1 ? 'left' : 'right', gripOff: n === loopB && b === 3 && i === perRow * 3 - 1 ? 2 : -10, gripD: n === loopA && b === 1 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6', grip: dragLoop(n === loopA && b === 1 ? 'a' : 'b', DEV.gridBar, 0),", f)
    t = every(t, 'DEV.perRow', 'perRow', f)
    t = t.replace('const perRow = s.perRow ?? perRow;', 'const perRow = s.perRow ?? DEV.perRow;')
    t = once(t, "const DEV = { padX:", "const DEV = { gridBar: %d, padX:" % (1430 // 4 if f == 'R3Laptop' else 340 // 2), f)
    t = once(t, 'box-shadow: {{c.mark}}; color: {{c.fg}}; display: flex; align-items: center; text-align: left; overflow: hidden">', 'box-shadow: {{c.mark}}; color: {{c.fg}}; display: flex; align-items: center; text-align: left; overflow: visible; position: relative">', f)
    gi = t.index('box-shadow: {{c.mark}}; color: {{c.fg}}')
    ge = t.index('</button>', gi)
    t = t[:ge] + GRID_GRIP + t[ge + len('</button>'):]
    # strip
    t = every(t, 'background: {{b.bg}}; color: {{b.fg}}; overflow: visible">', 'background: {{b.bg}}; box-shadow: {{b.mark}}; color: {{b.fg}}; overflow: visible">', f, 2)
    t = every(t, '<div style="display: flex; gap: 3px; width: max-content; height: 100%; padding: 0 {{padX}}px">', '<div style="position: relative; display: flex; gap: 3px; width: max-content; height: 100%; padding: 0 {{padX}}px">', f, 2)
    out = ''; i = 0
    while True:
        k = t.find('<sc-for list="{{strip}}"', i)
        if k == -1: break
        e = t.index('</sc-for>', k) + len('</sc-for>')
        out += t[i:e] + STRIP_GRIPS; i = e
    t = out + t[i:]
    # the views' own settings: strip and lines on or off
    a = t.index('<sc-if value="{{isDiagrams}}"'); b = t.index('<sc-if value="{{isGrid}}"')
    seg = t[a:b]
    s0 = seg.index('<div ref="{{stripRef}}"'); s1 = seg.index('</sc-if>\n</div>\n</div>', s0) + len('</sc-if>\n</div>\n</div>')
    seg = seg[:s0] + '<sc-if value="{{dStrip}}" hint-placeholder-val="{{true}}">\n' + seg[s0:s1] + '\n</sc-if>' + seg[s1:]
    l0 = seg.index('<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">')
    l1 = seg.index('</div>\n</section>', l0) + len('</div>')
    seg = seg[:l0] + '<sc-if value="{{dLine}}" hint-placeholder-val="{{true}}">\n' + seg[l0:l1] + '\n</sc-if>' + seg[l1:]
    t = t[:a] + seg + t[b:]
    a = t.index('<sc-if value="{{isLyrics}}"'); b = t.index('</section>', a)
    seg = t[a:b]
    s0 = seg.index('<div ref="{{stripRef}}"'); s1 = seg.index('</sc-if>\n</div>\n</div>', s0) + len('</sc-if>\n</div>\n</div>')
    seg = seg[:s0] + '<sc-if value="{{lStrip}}" hint-placeholder-val="{{true}}">\n' + seg[s0:s1] + '\n</sc-if>' + seg[s1:]
    m0 = seg.index('<div role="group" aria-label="Chords in this song"')
    m1 = seg.index('</sc-for>\n</div></div>', m0) + len('</sc-for>\n</div></div>')
    seg = seg[:m0] + '<sc-if value="{{lSum}}" hint-placeholder-val="{{true}}">\n' + seg[m0:m1] + '\n</sc-if>' + seg[m1:]
    t = t[:a] + seg + t[b:]
    t = once(t, "lyricFs: keys ? DEV.lyricFsKeys : DEV.lyricFs,", "lyricFs: Math.round((keys ? DEV.lyricFsKeys : DEV.lyricFs) * textScale),", f)
    # the sheet's loop
    img = t.index('alt="Amazing Grace engraved, the cursor in bar 1"')
    ie = t.index('>', img) + 1
    if f == 'R3Laptop':
        a = t.index('<sc-if value="{{loop}}"', ie); b = t.index('</sc-if>', a) + len('</sc-if>')
        t = t[:a] + SHEET_LOOP(d['gw'], d['gh']) + t[b:]
    else:
        t = t[:ie] + '\n' + SHEET_LOOP(d['gw'], d['gh']) + t[ie:]
    # transport: Loop beside the steps
    sb = t.index('<button type="button" aria-label="A step back"')
    if f == 'R3Laptop':
        btn = ('<button type="button" aria-label="{{loopBtnLabel}}" aria-pressed="{{loopPressed}}" onClick="{{toggleLoop}}" style="height: 48px; padding: 0 14px 0 12px; border: 0; border-radius: 9999px; background: {{loopBg}}; color: {{loopFg}}; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; white-space: nowrap">'
               '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg><span>{{loopText}}</span></button>\n' % REPEAT)
    else:
        btn = ('<button type="button" aria-label="{{loopBtnLabel}}" aria-pressed="{{loopPressed}}" onClick="{{toggleLoop}}" style="width: 44px; height: 48px; border: 0; border-radius: 9999px; background: {{loopBg}}; color: {{loopFg}}; display: flex; align-items: center; justify-content: center">'
               '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg></button>\n' % REPEAT)
    t = t[:sb] + btn + t[sb:]
    # the view tabs, all one size, plain switches: a tab shows its view, the Sheet's icon saying its
    # layout. The view's own settings are its gear, in the view's corner as the keys' is in theirs
    t = once(t, "pick: sheet && on ? pick({ layout: pano ? 'page' : 'panorama' }) : pick({ view: id }) }; }),",
             "pick: pick({ view: id, open: open === 'view' ? 'none' : open }) }; }),", f)
    t = once(t, "const hint = sheet && on ? (pano ? 'Show as pages' : 'Show as one line') : 'Show ' + name;", "const hint = 'Show ' + name;", f)
    t = once(t, "const label = sheet && on ? (pano ? 'Sheet · Panorama' : 'Sheet · Page') : name;", "const label = name;", f)
    if f == 'R3Laptop':
        t = once(t, 'onClick="{{v.pick}}" style="height: 34px; padding: 0 14px; border: 0;', 'onClick="{{v.pick}}" style="width: 112px; height: 34px; padding: 0; box-sizing: border-box; justify-content: center; border: 0;', f)
    else:
        t = once(t, 'style="width: 40px; height: 36px; border: 0;', 'style="width: 44px; height: 36px; border: 0;', f)
    # the toolbar in three groups (HIG): Close; the view switcher; View options and More. View options
    # opens the view's settings, then the keys' (Off, 3D or 2D, and theirs), as an inspector does
    g0 = t.index('<button type="button" aria-label="Keyboard settings"')
    g1 = t.index('</button>', g0) + len('</button>')
    t = t[:g0] + t[g1:]
    SL = 'M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4'
    if f == 'R3Laptop':
        t = once(t, 'aria-pressed="{{keys}}" onClick="{{toggleKeys}}" style="height: 44px; padding: 0 14px; border: 1px solid {{glassLine}}; border-radius: 9999px; background: {{keysBg}}; backdrop-filter: blur(12px); color: {{keysFg}};',
                 'aria-label="View options" title="View options" aria-expanded="{{isKeyboard}}" onClick="{{openKeyboard}}" style="width: 44px; height: 44px; padding: 0; justify-content: center; border: 1px solid {{glassLine}}; border-radius: 9999px; background: {{dispBg}}; backdrop-filter: blur(12px); color: {{dispFg}};', f)
        t = once(t, '<span>{{keysLabel}}</span>\n', '', f)
        # the switcher's segments say their view in words alone (HIG: text or images, not both)
        t = once(t, '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{v.d}}"></path></svg>\n<span>{{v.label}}</span>', '<span>{{v.label}}</span>', f)
    else:
        t = once(t, 'aria-label="{{keysLabel}}" aria-pressed="{{keys}}" onClick="{{toggleKeys}}"', 'aria-label="View options" title="View options" aria-expanded="{{isKeyboard}}" onClick="{{openKeyboard}}"', f)
        t = once(t, 'border-radius: 9999px; background: {{keysBg}}; backdrop-filter: blur(12px); color: {{keysFg}}; display: flex; align-items: center; justify-content: center">', 'border-radius: 9999px; background: {{dispBg}}; backdrop-filter: blur(12px); color: {{dispFg}}; display: flex; align-items: center; justify-content: center">', f)
    k0 = t.index('aria-label="View options"')
    p0 = t.index('<path d="', k0)
    p1 = t.index('"', p0 + len('<path d="'))
    t = t[:p0] + '<path d="' + SL + t[p1:]
    t = once(t, "kb3d: kbStyle === '3d',", "kb3d: keys && kbStyle === '3d',", f)
    t = once(t, "kb2d: kbStyle === '2d',", "kb2d: keys && kbStyle === '2d',", f)
    # the other hand: show, dim or hide
    t = once(t, 'const otherOn = s.other ?? true;', "const otherShow = s.otherShow ?? 'dim';\nconst otherOn = otherShow !== 'hide';", f)
    t = once(t, 'const faint = hand && !mine;', "const faint = hand && !mine && otherShow === 'dim';", f)
    # values
    js = (JS_VALS.replace('SYSTEMS', d['sys']).replace('SHEETTOP', d['top']).replace('SHEETBAR', str(d['sheetBar'])).replace('SHEETROW', str(d['sheetRow'])).replace('PERROWS', str(d['rows'])).replace('DARK', 'glassDark' if f == 'R3Laptop' else 'dark'))
    r = t.index('const VIEWS = [')
    t = t[:r] + js + t[r:]
    t = every(t, 'aria-label="Close the menu" onClick="{{close}}" style="position: absolute;', 'aria-label="Close the menu" onClick="{{close}}" style="z-index: 45; position: absolute;', f) if f == 'R3Laptop' else every(t, 'aria-label="Close the sheet" onClick="{{close}}" style="position: absolute;', 'aria-label="Close the sheet" onClick="{{close}}" style="z-index: 45; position: absolute;', f)
    t = every(t, '<section role="dialog" aria-label="{{sheet.name}} chord" style="', '<section role="dialog" aria-label="{{sheet.name}} chord" style="z-index: 50; ', f)
    t = once(t, '...PANEL_VALS,', '...PANEL_VALS,\n...LOOP_VALS,', f)
    t = once(t, "bar, loop, toggleLoop: flip('loop', false),", 'bar,', f)
    t = t.replace("isMore: open === 'more', anyOpen: open !== 'none',", "isMore: open === 'more', anyOpen: open !== 'none' && open !== 'chord',") if False else t
    open(p, 'w').write(t)
    print(f, 'loop ok')
