import json
from bravura_glyphs import BRAVURA
# R41 Practice: each page to its own reference, in the calm language, holding R39's rulings (every control labelled,
# a gear for the page's settings, a key or root from the root grid, fingering never on the keys, libraries in the one
# library shape).

def PROW(p, t, s, v='', href='#'):
    return (f'<a href="{href}" style="min-height: 64px; display: flex; align-items: center; gap: 12px; padding: 8px 12px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}">{pic(p)}'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{t}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{s}</span></span>'
            f'<span style="font-size: 14px; color: {SOFT}; white-space: nowrap">{v}</span><span style="display: flex; color: {SOFT}">{CHEV_R}</span></a>')
PLIST = lambda rows: f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">' + ''.join(PROW(*r) for r in rows) + '</div>'
def PCARD(p, t, s, v, href):
    return f'<a href="{href}" style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 16px; display: flex; flex-direction: column; gap: 12px; color: {INK}; text-decoration: none">{pic(p, 96)}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">{t}</span><span style="font-size: 14px; color: {SOFT}">{s}</span></span>' + (f'<span style="font-size: 13px; color: {SOFT}">{v}</span>' if v else '') + '</a>'
def L(href, lap):  # a phone board's laptop twin
    return href.replace('.dc.html', 'Laptop.dc.html') if lap and href != '#' else href
def body(top, inner, dock='', pad_bottom=118):
    return f'{top}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px {pad_bottom}px; display: flex; flex-direction: column; gap: 16px">{inner}</main>{DOCK(dock) if dock else ""}'
def lapbody(top, left, right, dock=''):
    return f'{top}<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) min(420px, 40%); gap: 40px; padding: 0 40px 28px 56px"><div style="min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 16px">{left}{DOCK_L(dock) if dock else ""}</div><div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-top: 4px">{right}</div></div>'
SPACER = '<span style="flex: 1"></span>'

# ═════ Practice overview (R39-4: relevance first, pictures that show the content) ═════
# canvas 160 (owner, grilled: Q1 "a" — the Chords page studies a chord, then practises it; "remove the quiz page
# completely"; the Chord trainer goes; Q10 "why the accompaniment is not under theory and the chord player is not the same
# as exercises"; Q10c "I dont like that exercises are under technique"): Theory, the pages that explain and are practised
# where they are explained; Exercises, named for what they train; Tools, the instruments, the Chord player first.
THEORY = [('keys', 'Chords', 'Chord types, voicings, inversions', '', 'Chords.dc.html'), ('staff', 'Scales and keys', 'Scales, fingerings, key signatures', '', 'Scales.dc.html'),
          ('arc', 'Intervals', 'Minor 2nd to octave', '', 'Intervals.dc.html'), ('roman', 'Progressions', 'Pop, jazz and classical', '', 'Progressions.dc.html'),
          ('roll', 'Accompaniment', 'Bass and chord patterns', '', 'Accompaniment.dc.html')]
# one row per page it opens (loop round 58: Barry Harris and Piano With Jonny were two rows onto the one Jazz vocabulary
# page that holds both books)
EXERCISES = [('drill', 'Finger technique', '2 exercises', '', 'FingerTechnique.dc.html'), ('sixdim', 'Jazz vocabulary', '4 exercises', '', 'JazzVocabulary.dc.html')]
TOOLS = [('chart', 'Chord player', 'Lead sheets with backing', '', 'ChordPlayer.dc.html'), ('metro', 'Metronome', '120 BPM · 4/4', '', 'Metronome.dc.html'), ('needle', 'Tuner', 'A4 = 440 Hz', '', 'Tuner.dc.html'),
         ('lens', 'Chord finder', 'Last: Cmaj7', '', 'ChordFinder.dc.html'), ('circle', 'Circle of fifths', 'Every key and its signature', '', 'CircleOfFifths.dc.html')]
MAIN = js(r"    return { ...common(st, set),"
           r" states: [['Theory and Exercises folded', !!(st.folds && st.folds[0] && st.folds[1]), { folds: { 0: true, 1: true } }, { folds: {} }]]"
           r".map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => set(on ? off : o) })) };")
ph = f'''{TITLEBAR('Practice', IB('Search', ICON(SEARCH, 22), href='AppLayers.dc.html'))}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 130px; display: flex; flex-direction: column; gap: 16px">
{SHOWSTATES()}{H2('Theory')}{PLIST(THEORY)}{H2('Exercises')}{PLIST(EXERCISES)}{H2('Tools')}{PLIST(TOOLS)}</main>{TABBAR('Practice')}'''
grid = lambda rows: '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(max(140px, calc((100% - 64px) / 5)), 1fr)); gap: 16px">' + ''.join(PCARD(p, t, s, v, L(h, True)) for p, t, s, v, h in rows) + '</div>'
lm = f'''<header style="flex: none; height: 88px; display: flex; align-items: center; gap: 8px; padding: 0 28px 0 56px"><h1 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.01em">Practice</h1><span style="flex: 1"></span></header><main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 40px; display: flex; flex-direction: column; gap: 16px">
{SHOWSTATES()}{H2('Theory')}{grid(THEORY)}{H2('Exercises')}{grid(EXERCISES)}{H2('Tools')}{grid(TOOLS)}</main>'''
# Practice's own Tools section is the tools' home on this page; the bar's Tools menu, which listed the same five a
# scroll away, is kept for the pages that have no such section (a lesson) (owner, 2026-11-16: "the same act reachable two ways")
detail('Main', 'Practice', MAIN, ph, lm, '', '', '')

# ═════ Scales and keys (Piano Companion: the staff, then the chords that fit; R39 rulings) ═════
def scale_staff(w, fingers):
    sp = 7; top = 30; base = top + 4 * sp
    o = ''.join(f'<path d="M4 {top + i * sp}H{w - 4}" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    o += f'<text x="6" y="{base}" font-size="{4 * sp}" font-family="Noto Music, serif" fill="{INK}">𝄞</text><text x="38" y="{top + 2}" font-size="18" font-family="Noto Music, serif" fill="{INK}">♯</text>'
    x0, dx = 68, (w - 84) / 8
    for i in range(8):
        x = x0 + i * dx; y = base - (2 + i) * sp / 2
        o += f'<ellipse cx="{x:.1f}" cy="{y}" rx="5" ry="3.7" transform="rotate(-20 {x:.1f} {y})" fill="{INK}"></ellipse><path d="M{x + 4.6:.1f} {y}V{y - 24}" stroke="{INK}" stroke-width="1.1"></path>'
        o += f'<text x="{x:.1f}" y="{min(top - 10, y - 30)}" text-anchor="middle" font-size="12" font-weight="700" fill="{INK}">{fingers[i]}</text>'
    return f'<svg viewBox="0 0 {w} 96" width="100%" role="img" aria-label="G major, up one octave, right-hand fingering over the notes" style="display: block">{o}</svg>'
def SCALESTAFF(label):
    # the chosen scale up one octave on a treble staff with its own key signature (R42 v68); glyphs as literal text
    o = ''.join(f'<path d="M4 {30 + i * 7}H356" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    o += f'<text x="6" y="58" font-size="28" font-family="Noto Music, serif" fill="{INK}">𝄞</text>'
    # accidentals in Bravura, the glyphs the engine engraves, a space 7 (each from its line: ay less the text's old drop)
    gl = lambda key, name, dx, dy: f'<sc-if value="{{{{{key}}}}}" hint-placeholder-val="{{{{false}}}}"><path transform="translate({{{{z.ax}}}} {{{{z.ay}}}}) translate({dx} {dy}) scale(.028 -.028)" d="{BRAVURA[name][0]}" fill="{INK}"></path></sc-if>'
    o += '<sc-for list="{{ss.sig}}" as="z" hint-placeholder-count="1">' + gl('z.s', 'sharp', 0, -6) + gl('z.f', 'flat', 0, -4) + '</sc-for>'
    o += f'<sc-for list="{{{{ss.led}}}}" as="l" hint-placeholder-count="0"><path d="{{{{l.d}}}}" stroke="{INK}" stroke-width="1"></path></sc-for>'
    o += (f'<sc-for list="{{{{ss.notes}}}}" as="z" hint-placeholder-count="8"><ellipse cx="{{{{z.x}}}}" cy="{{{{z.y}}}}" rx="5" ry="3.7" transform="rotate(-20 {{{{z.x}}}} {{{{z.y}}}})" fill="{INK}"></ellipse><path d="{{{{z.stem}}}}" stroke="{INK}" stroke-width="1.1"></path>'
          + gl('z.a1', 'sharp', 1, -5) + gl('z.a2', 'flat', 1, -5) + gl('z.a3', 'natural', 2, -5) + gl('z.a4', 'dsharp', 1, -5) + gl('z.a5', 'dflat', -4, -5)
          + ''.join(f'<sc-if value="{{{{z.f{d}}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{z.x}}}}" y="{{{{z.fy}}}}" text-anchor="middle" font-size="12" font-weight="700" fill="{INK}">{d}</text></sc-if>' for d in range(1, 6))
          + '</sc-for>')
    return f'<svg viewBox="0 0 360 96" width="100%" role="img" aria-label="{label}" style="display: block">{o}</svg>'
SC = js(r'''
// switches by key: k → kOn, kOnBg, kOnX, kT; segs by key: [key, options, default] → keySeg
const SW = (st, set, keys) => Object.fromEntries(keys.flatMap(([k, d]) => { const on = st[k] ?? d; return [[k + 'On', on], [k + 'OnBg', on ? '#44684A' : '#DAD1C8'], [k + 'OnX', on ? 22 : 2], [k + 'T', () => set({ [k]: !on })]]; }));
const SG = (st, set, list) => Object.fromEntries(list.map(([k, opts, d]) => [k + 'Seg', seg(opts, st[k] ?? d, (l) => set({ [k]: l }))]));
    const KINDS = ['Major', 'Natural minor', 'Harmonic minor', 'Melodic minor', 'Dorian', 'Mixolydian', 'Major pentatonic', 'Minor pentatonic', 'Blues'];
    const IV = [[0,2,4,5,7,9,11],[0,2,3,5,7,8,10],[0,2,3,5,7,8,11],[0,2,3,5,7,9,11],[0,2,3,5,7,9,10],[0,2,4,5,7,9,10],[0,2,4,7,9],[0,3,5,7,10],[0,3,5,6,7,10]];
    // the tonic is a spelled note, one of the 15 keys of its kind: tap a letter again for its sharp or flat (R42 v68)
    const L7 = 'CDEFGAB', NP = [0, 2, 4, 5, 7, 9, 11], A7 = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };
    const MODE = [0, -3, -3, -3, -2, -1, 0, -3, -3], FIF = [0, 2, 4, -1, 1, 3, 5];
    const sigOf = (l, a, k) => FIF[l] + 7 * a + MODE[k], okFor = (k) => (l, a) => Math.abs(sigOf(l, a, k)) <= 7;
    const DL = [[0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 4, 5], [0, 2, 3, 4, 6], [0, 2, 3, 4, 4, 6]];
    const kind = st.kind ?? 0, rl = st.rl ?? 4, ra = st.ra ?? 0, root = (NP[rl] + ra + 12) % 12;
    const spell = (i) => { const iv = IV[kind][i % IV[kind].length], L = (rl + DL[kind][i % DL[kind].length]) % 7, pc = (root + iv) % 12, d = ((pc - NP[L] + 18) % 12) - 6; return L7[L] + A7[String(d)]; };
    const tonic = L7[rl] + A7[String(ra)], sg = sigOf(rl, ra, kind);
    const SIGW = sg === 0 ? 'no sharps or flats' : (Math.abs(sg) + (sg > 0 ? (sg === 1 ? ' sharp' : ' sharps') : (sg === -1 ? ' flat' : ' flats')));
    const enh = (k) => { if (okFor(k)(rl, ra)) return {}; for (let l = 0; l < 7; l++) for (const a of [0, 1, -1]) if ((NP[l] + a + 12) % 12 === root && okFor(k)(l, a)) return { rl: l, ra: a }; return {}; };
    const tab = st.tab ?? 'Scale', hands = st.hands ?? 'Both', oct = st.oct ?? 1;
    const ivs = IV[kind], marks = {}, lo = 60 + root;
    ivs.concat([12]).forEach((iv, i) => { const m = lo + iv; marks[m] = [i % 7 === 0 ? ROLE[1] : '#F3D9A8', i === ivs.length ? tonic : spell(i)]; });
    // the triads on each degree, from the scale's own notes (a pentatonic or blues takes its parent scale's)
    const PK = [0, 1, 2, 3, 4, 5, 0, 1, 1][kind], PIV = IV[PK], RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const tri = Array.from({ length: 7 }, (_, i) => { const t = (PIV[(i + 2) % 7] - PIV[i] + 12) % 12, f = (PIV[(i + 4) % 7] - PIV[i] + 12) % 12;
      const qq = t === 4 && f === 7 ? '' : (t === 3 && f === 7 ? 'm' : (t === 3 && f === 6 ? '°' : (t === 4 && f === 8 ? '+' : ''))); const low = qq === 'm' || qq === '°';
      const fl = PK < 4 ? '' : (PIV[i] < IV[0][i] ? '♭' : (PIV[i] > IV[0][i] ? '♯' : '')); // minor keys read i ii° III …, modes ♭III ♭VII
      const L = (rl + i) % 7, pc = (root + PIV[i]) % 12, d = ((pc - NP[L] + 18) % 12) - 6;
      return { d: fl + (low ? RN[i].toLowerCase() : RN[i]) + (qq === '°' ? '°' : (qq === '+' ? '+' : '')), c: L7[L] + A7[String(d)] + (qq === '°' ? '°' : (qq === 'm' ? 'm' : (qq === '+' ? '+' : ''))) }; });
    // the staff: the key signature, then the scale up an octave, an accidental only where the key does not give it
    const SHO = [8, 5, 9, 6, 3, 7, 4], FLO = [4, 7, 3, 6, 2, 5, 1], SHL = [3, 0, 4, 1, 5, 2, 6], FLL = [6, 2, 5, 1, 4, 0, 3];
    const nS = Math.abs(sg), Y = (k) => 58 - k * 3.5, keyAcc = (L) => sg > 0 && SHL.slice(0, sg).includes(L) ? 1 : (sg < 0 && FLL.slice(0, -sg).includes(L) ? -1 : 0);
    const sig = Array.from({ length: nS }, (_, i) => ({ s: sg > 0, f: sg < 0, ax: 34 + i * 8, ay: Y(sg > 0 ? SHO[i] : FLO[i]) + (sg > 0 ? 6 : 4) }));
    const nN = ivs.length + 1, x0 = 34 + nS * 8 + 22, dx = (350 - x0) / nN, W5 = ['12312345', '54321321'], MAJF = { 0: W5, 7: W5, 2: W5, 9: W5, 4: W5, 11: ['12312345', '43214321'], 5: ['12341234', '54321321'], 6: ['23412312', '43213214'], 1: ['23123412', '32143213'], 8: ['34123123', '32143213'], 3: ['31234123', '32143213'], 10: ['41231234', '32143213'] };
    // the major keys' standard fingerings (RH up, LH up), as the scale books give them; the modes keep C's on a white tonic
    const FGP = kind === 0 ? MAJF[root] : (ra === 0 && rl !== 3 && kind <= 5 ? W5 : null), FG = FGP ? FGP[0] : '', fingOk = !!FGP;
    const led = [], notesS = Array.from({ length: nN }, (_, i) => { const dl = i === ivs.length ? 7 : DL[kind][i], L = (rl + dl) % 7, k = rl + dl - 2, x = +(x0 + dx * (i + 0.5)).toFixed(1), y = Y(k);
      const pc = (root + (i === ivs.length ? 12 : ivs[i])) % 12, d = ((pc - NP[L] + 18) % 12) - 6, show = d !== keyAcc(L);
      for (let j = -2; j >= k; j -= 2) led.push({ d: 'M' + (x - 9) + ' ' + Y(j) + 'H' + (x + 9) }); for (let j = 10; j <= k; j += 2) led.push({ d: 'M' + (x - 9) + ' ' + Y(j) + 'H' + (x + 9) });
      const up = k < 4, f = fingOk && nN === 8 ? FG[i] : '';
      return { x, y, stem: up ? 'M' + (x + 4.6) + ' ' + y + 'V' + (y - 24) : 'M' + (x - 4.6) + ' ' + y + 'V' + (y + 24), ax: x - 15, ay: y + 5, a1: show && d === 1, a2: show && d === -1, a3: show && d === 0, a4: show && d === 2, a5: show && d === -2,
        fy: 16, f1: f === '1', f2: f === '2', f3: f === '3', f4: f === '4', f5: f === '5' }; });
    return { ...common(st, set), ...SW(st, set, [['scTl', true], ['scTt', false]]), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }), kindOn: st.sheet === 'kind', openKind: () => set({ sheet: 'kind' }),
      name: tonic + ' ' + KINDS[kind].toLowerCase(), sub: KINDS[kind] + ' scale · ' + (kind <= 5 ? SIGW : ivs.length + ' notes'), rootL: tonic, kindL: KINDS[kind],
      ...letterPick(rl, ra, okFor(kind), st.tapUsed, (l, next, more) => set(Object.assign({ rl: l, ra: next }, more ? { tapUsed: true } : {}))), kinds: KINDS.map((k, i) => ({ k, on: i === kind, mark: i === kind ? '✓' : '', pick: () => set(Object.assign({ kind: i, sheet: null }, enh(i))) })),
      tabs: seg(['Scale', 'Chords', 'Key'], tab, (l) => set({ tab: l })), isScale: tab === 'Scale', isChords: tab === 'Chords', isKey: tab === 'Key',
      kb: calmKeys(lo - 5, lo + 19, marks, 370, 120), kbL: calmKeys(lo - 12, lo + 24, marks, 840, 170),
      handsSeg: seg(['Left', 'Both', 'Right'], hands, (l) => set({ hands: l })), oct: oct + (oct === 1 ? ' octave' : ' octaves'), octDn: () => set({ oct: Math.max(1, oct - 1) }), octUp: () => set({ oct: Math.min(4, oct + 1) }),
      chords: tri, ss: { sig, notes: notesS, led } };''')
SC_PIC = lambda k, w, kh: f'''<sc-if value="{{{{isScale}}}}" hint-placeholder-val="{{{{true}}}}">{CARD(SCALESTAFF('The scale up one octave on the staff') + f'<div style="height: 10px"></div>' + KEYS(kh, k), '12px 12px 12px')}</sc-if>
<sc-if value="{{{{isChords}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{chords}}}}" as="c" hint-placeholder-count="7"><button type="button" style="height: 78px; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: {INK}"><span style="font-size: 22px; font-weight: 700">{{{{c.c}}}}</span><span style="font-size: 15px; color: {SOFT}">{{{{c.d}}}}</span></button></sc-for></div></sc-if>
<sc-if value="{{{{isKey}}}}" hint-placeholder-val="{{{{false}}}}">{CARD(SCALESTAFF('The key signature'))}{GROUP(('link', 'Relative minor', 'E minor', 'Scales.dc.html'), ('link', 'On the circle', 'Between C and D', 'CircleOfFifths.dc.html'), bg=SHEET)}</sc-if>'''
SC_ROWS = GROUP(('link', 'Tonic', '{{rootL}}', 'openRoot'), ('link', 'Scale', '{{kindL}}', 'openKind'), ('seg', 'Hands', 'handsSeg', 190), ('step', 'Octaves', 'oct', 'octDn', 'octUp'))
SC_SET = (GROUP(('seg', 'Fingering', 'fingSeg', 200), ('link', 'Start on', '{{tonicL}}', ''), ('link', 'Compare with', 'None', ''), ('link', 'Rhythm', 'Even', '')) + GROUP(('link', 'On the staff', 'Tonic and leading note', 'Settings.dc.html')))
KINDLIST = f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{kinds}}}}" as="k" hint-placeholder-count="9"><button type="button" onClick="{{{{k.pick}}}}" style="width: 100%; height: 48px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {LINE}; padding: 0 16px; display: flex; align-items: center; color: {INK}; font: inherit; font-size: 16px; text-align: left"><span style="flex: 1">{{{{k.k}}}}</span><span style="color: {LINK}; font-weight: 700">{{{{k.mark}}}}</span></button></sc-for></div>'
SC_SHEETS = BSHEET('rootOn', 'Tonic', NOTEPICK) + BSHEET('kindOn', 'Scale', KINDLIST) + BSHEET('setOn', 'Scale settings', SC_SET)
ph = body(TOP('Main.dc.html', 'Scales and keys', GEAR()), SUBJECT('{{name}}', '{{sub}}', 34) + SEGC('tabs') + SC_PIC('kb', 340, 120) + SC_ROWS,
          BTN('Practise this scale', href='Exercise.dc.html', kind='quiet') + PLAYBTN())
lm = lapbody(LTOP('Laptop.dc.html', GEAR()), SUBJECT('{{name}}', '{{sub}}', 44) + f'<div style="width: 420px">{SEGC("tabs")}</div>' + SC_PIC('kbL', 860, 170),
             SC_ROWS + GROUP(('link', 'Practise this scale', 'Hanon and the tempo ladder', 'ExerciseLaptop.dc.html')), BTN('Practise this scale', href='ExerciseLaptop.dc.html', kind='quiet') + PLAYBTN())
SC_POPS = POPOVER('rootOn', 'Tonic', NOTEPICK, 'right: 40px; top: 70px') + POPOVER('kindOn', 'Scale', KINDLIST, 'right: 40px; top: 120px') + POPOVER('setOn', 'Scale settings', SC_SET)
detail('Scales', 'Scales and keys', SC, ph, lm, '', SC_SHEETS, SC_POPS)

# ═════ Intervals (Tenuto's named answers, Perfect Ear's staff and keys; R39 rulings) ═════
IV = js(r'''
    // fourteen tiles: the tritone by each of its spellings, A4 and d5, as they are written differently (loop, canvas 197)
    const TIL = [['P1', 0, 0], ['m2', 1, 1], ['M2', 2, 1], ['m3', 3, 2], ['M3', 4, 2], ['P4', 5, 3], ['A4', 6, 3], ['d5', 6, 4], ['P5', 7, 4], ['m6', 8, 5], ['M6', 9, 5], ['m7', 10, 6], ['M7', 11, 6], ['P8', 12, 7]];
    // Compound: the same fourteen an octave up, the ninth to the double octave (a tab that changes what is shown)
    const comp = st.size === 'Compound', CAB = ['P8', 'm9', 'M9', 'm10', 'M10', 'P11', 'A11', 'd12', 'P12', 'm13', 'M13', 'm14', 'M14', 'P15'];
    const CWORDS = ['Octave', 'Minor ninth', 'Major ninth', 'Minor tenth', 'Major tenth', 'Perfect eleventh', 'Augmented eleventh', 'Diminished twelfth', 'Perfect twelfth', 'Minor thirteenth', 'Major thirteenth', 'Minor fourteenth', 'Major fourteenth', 'Double octave'];
    const TL = comp ? TIL.map((x, i) => [CAB[i], x[1] + 12, x[2] + 7]) : TIL;
    const tile = st.tile ?? 8, AB = TL.map((x) => x[0]), STEP = TL[tile][2];
    const WORDS = ['Unison', 'Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Augmented fourth', 'Diminished fifth', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave'];
    const NAMES = ['Unison', 'Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave'];
    const SONG = { 7: 'Twinkle, Twinkle, Little Star', 5: 'Here Comes the Bride', 4: 'When the Saints', 3: 'Greensleeves', 12: 'Somewhere over the Rainbow', 2: 'Happy Birthday', 9: 'My Bonnie', 1: 'Jaws', 10: 'Star Trek', 11: 'Take On Me', 6: 'The Simpsons', 8: 'The Entertainer', 0: 'Any repeated note' };
    const n = TL[tile][1], nn = n > 12 ? n - 12 : n, from = st.from ?? 0, way = st.way ?? 'Ascending', lo = 60 + from, hi = lo + n;
    const LET = 'CDEFGAB', NATP = [0, 2, 4, 5, 7, 9, 11], l2 = (LET.indexOf(NN[from].charAt(0)) + STEP) % 7, k2 = ((hi - NATP[l2]) % 12 + 12) % 12, HIN = LET[l2] + (k2 === 1 ? '♯' : k2 === 11 ? '♭' : k2 === 2 ? '𝄪' : k2 === 10 ? '𝄫' : '');
    const MEAN = ['The same note twice.', 'A half step: the tightest clash, the leading note to the tonic.', 'A whole step: one step of the scale.', 'The 3rd of a minor chord: darker.', 'The 3rd of a major chord: brighter.', 'Open and stable: the subdominant over the tonic.', 'Three whole steps: the tension in a dominant 7th.', 'The most open consonance: the root and 5th of every triad.', 'Soft and sad: a major 3rd turned upside down.', 'Warm and open: a minor 3rd turned upside down.', 'The 7th of a dominant chord: it wants to resolve.', 'A half step under the octave: the 7th of a major 7th chord.', 'The same note an octave higher.'];
    const UP = ['Jingle Bells', 'Jaws', 'Frère Jacques', 'Greensleeves', 'When the Saints', 'Here Comes the Bride', 'The Simpsons', 'Twinkle, Twinkle, Little Star', 'The Entertainer', 'My Bonnie', 'Star Trek', 'Take On Me', 'Over the Rainbow'];
    const DOWN = ['', 'Für Elise', 'Mary Had a Little Lamb', 'Hey Jude', 'Beethoven’s Fifth', 'Eine kleine Nachtmusik', 'Black Sabbath', 'The Flintstones', 'Love Story', 'Nobody Knows the Trouble', 'Watermelon Man', 'I Love You', 'Willow Weep for Me'];
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }),
      aboutOn: st.sheet === 'about', toggleAbout: () => set({ sheet: st.sheet === 'about' ? null : 'about' }), mean: MEAN[nn], upS: UP[nn], downS: DOWN[nn] || '—', inv: NAMES[12 - nn], name: comp ? CWORDS[tile] : WORDS[tile], sub: n + (n === 1 ? ' semitone' : ' semitones') + ' · ' + NN[lo % 12] + ' up to ' + HIN, song: n > 12 ? (nn === 12 ? 'The same note, two octaves apart' : 'A ' + NAMES[nn].toLowerCase() + ', an octave wider') : SONG[nn],
      ivs: TL.map(([a, semis], i) => ({ a, s: String(semis), bg: i === tile ? '#EDC684' : '#FEFDFB', pick: () => set({ tile: i }) })),
      kb: calmKeys(57, 81, { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], HIN] }, 370, 120), kbL: calmKeys(53, 84, { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], HIN] }, 840, 170),
      fromL: NN[from], roots: rootGrid(from, (i) => set({ from: i, sheet: null })), waySeg: seg(['Ascending', 'Descending', 'Harmonic'], way, (l) => set({ way: l })), sizeSeg: seg(['Simple', 'Compound'], st.size ?? 'Simple', (l) => set({ size: l })),
      allSeg: seg(['In order', 'Shuffled'], st.all ?? 'In order', (l) => set({ all: l })), speedSeg: seg(['Slow', 'Medium', 'Fast'], st.speed ?? 'Medium', (l) => set({ speed: l })) };''')
IVGRID = f'<div role="radiogroup" aria-label="Interval" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{ivs}}}}" as="i" hint-placeholder-count="13"><button type="button" onClick="{{{{i.pick}}}}" style="height: 50px; border: 0; border-radius: 11px; background: {{{{i.bg}}}}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0"><span style="font-size: 16px; font-weight: 700">{{{{i.a}}}}</span><span style="font-size: 12px; color: {SOFT}">{{{{i.s}}}}</span></button></sc-for></div>'
IV_PIC = lambda k, kh: CARD(KEYS(kh, k) + f'<div style="display: flex; align-items: center; gap: 12px; margin-top: 12px"><span style="flex: 1; display: flex; flex-direction: column; gap: 1px"><span style="font-size: 13px; color: {SOFT}">Sounds like</span><span style="font-size: 16px; font-weight: 600">{{{{song}}}}</span></span><button type="button" aria-label="Hear it" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{ICON(PLAY, 16)}</button></div>', '12px')
IV_ABOUT = lambda size: (f'<div style="position: relative; flex: none; display: flex; align-items: flex-start; gap: 4px">{SUBJECT("{{name}}", "{{sub}}", size)}'
    f'<button type="button" aria-label="About the interval" data-tip="About the interval" aria-expanded="{{{{aboutOn}}}}" onClick="{{{{toggleAbout}}}}" style="flex: none; width: 44px; height: 44px; margin-top: {size // 2 - 22}px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{ICON(INFOI, 20)}</button>'
    f'<sc-if value="{{{{aboutOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="dialog" aria-label="{{{{name}}}}" style="position: absolute; left: 0; top: {size + 34}px; z-index: 20; width: 300px; box-sizing: border-box; padding: 16px; border-radius: 14px; background: {SHEET}; box-shadow: {SHADOW}; display: flex; flex-direction: column; gap: 12px">'
    f'<p style="margin: 0; font-size: 15px; line-height: 1.4; text-wrap: pretty">{{{{mean}}}}</p>'
    + ''.join(f'<div style="display: flex; align-items: baseline; gap: 12px; font-size: 15px"><span style="flex: none; width: 84px; color: {SOFT}">{k}</span><span style="font-weight: 600">{{{{{v}}}}}</span></div>' for k, v in (('Up', 'upS'), ('Down', 'downS'), ('Inverts to', 'inv')))
    + '</div></sc-if></div>')
IV_ROWS = GROUP(('link', 'From', '{{fromL}}', 'openRoot'), ('seg', 'Play as', 'waySeg', 250), ('seg', 'Intervals', 'sizeSeg', 180))
IV_SET = GROUP(('seg', 'Play all', 'allSeg', 190), ('seg', 'Speed', 'speedSeg', 200))
ph = body(TOP('Main.dc.html', 'Intervals', GEAR()), IV_ABOUT(34) + IV_PIC('kb', 120) + IVGRID + IV_ROWS, PLAYBTN())
lm = lapbody(LTOP('Laptop.dc.html', GEAR()), IV_ABOUT(44) + IV_PIC('kbL', 190) + IVGRID, IV_ROWS, PLAYBTN())
detail('Intervals', 'Intervals', IV, ph, lm, '', BSHEET('rootOn', 'From', ROOTGRID()) + BSHEET('setOn', 'Interval settings', IV_SET), POPOVER('rootOn', 'From', ROOTGRID()) + POPOVER('setOn', 'Interval settings', IV_SET))

# ═════ The libraries: Progressions, Accompaniment, Exercises (one shape) ═════
# loop round 44: an accompaniment pattern's tile is its own piano roll (left hand low in lilac ink, right hand high in
# ink), timed as its line says, instead of a font's note glyph drawn 10px wide
_CH = (5, 6, 7)
ROLLS = {  # beats in the bar, then (start, length, height 0 low to 7 high) per note
  'Bass + chords': (4, [(0, 4, 0), (0, 4, 2)] + [(b, .8, h) for b in range(4) for h in _CH]),
  'Broken chords': (4, [(0, 4, 0)] + [(i * .5, .4, 5 if i % 2 == 0 else 7) for i in range(8)]),
  'Waltz': (3, [(0, .9, 0)] + [(b, .8, h) for b in (1, 2) for h in _CH]),
  'Arpeggio 1–5–8': (4, [(i * .5, .4, h) for i, h in enumerate((0, 2, 4, 5, 7, 5, 4, 2))]),
  'Runs down to the root': (4, [(0, .9, 6), (1, .9, 4), (2, .6, 3), (2.67, .6, 2), (3.33, .6, 1)]),
  'Broken chord, 6/8': (6, [(0, 6, 0)] + [(i, .8, h) for i, h in enumerate((5, 6, 7, 6, 5, 6))]),
  'Afterbeats, 6/8': (6, [(0, .9, 0), (3, .9, 1)] + [(b, .8, h) for b in (1, 2, 4, 5) for h in (5, 6)]),
  'Bass and chord, 4/4': (4, [(0, 2, 0), (2, 2, 1)] + [(b, d, h) for b, d in ((1, .9), (2, 1.9)) for h in _CH]),
  'Alberti bass': (4, [(i * .5, .4, h) for i, h in enumerate((0, 3, 2, 3, 0, 3, 2, 3))]),
  'Ballad': (4, [(0, 2, 0), (2, 2, 2)] + [(b, .9, h) for b in (1, 3) for h in _CH]),
  'Swing comping': (4, [(b + .67, .3, h) for b in range(4) for h in _CH]),
}
def _rollurl(t):
    beats, notes = ROLLS[t]
    bars = ''.join(f'<rect x="{6 + 32 * a / beats:.1f}" y="{33 - h * 3.5:.1f}" width="{max(1.6, 32 * d / beats - .6):.1f}" height="2.6" rx="1.3" fill="{"%23332921" if h >= 4 else "%237A6BB0"}"/>' for a, d, h in notes)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="{LILAC.replace("#", "%23")}"/><path d="M6 21.5h32" stroke="%23332921" stroke-opacity=".12"/>{bars}</svg>'
    return 'url("data:image/svg+xml,' + svg.replace('"', "'").replace('<', '%3C').replace('>', '%3E').replace(' ', '%20') + '")'
# A progression's picture (loop round 58): its chords as columns in their roles' paints, the page's tiles in small
# (Tonic peach, Predominant sky, Dominant sage), where the tile repeated the numerals the row's line already prints.
def _role(n):
    b = n.replace('♭', '').replace('♯', '').replace('maj7', '').replace('7', '')
    return '#DCE9D6' if b.upper() in ('V', 'VII') and not n.startswith('♭') else '#D3E5F2' if b.upper() in ('II', 'IV') else '#F3D2C8'
def _progurl(s):
    ch = [c.strip() for c in s.split('–')]
    w = (36 - 2 * (len(ch) - 1)) / len(ch)
    cols = ''.join(f'<rect x="{4 + k * (w + 2):.2f}" y="8" width="{w:.2f}" height="28" rx="{min(3, w / 2):.1f}" fill="{_role(c).replace("#", "%23")}" stroke="%23332921" stroke-opacity=".14"/>' for k, c in enumerate(ch))
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="%23FEFDFB"/>{cols}</svg>'
    return 'url("data:image/svg+xml,' + svg.replace('"', "'").replace('<', '%3C').replace('>', '%3E').replace(' ', '%20') + '")'
def Rw(t, s, v, i, c, href, places=(), tags=(), ic=INK):
    r = {'t': t, 's': s, 'v': v, 'i': i, 'c': c, 'ic': ic, 'href': href, 'places': list(places), 'tags': list(tags)}
    if t in ROLLS: r.update(i='', pic=_rollurl(t))
    if href == 'Progression.dc.html': r.update(i='', pic=_progurl(s))
    return r
# The app's own library (src/entities/progression-library/content/library.ts), read at build so the board holds
# what the app holds: its nine styles in their order, each progression's first line spaced as the rows print it
# (the board drew an invented four styles of two or three, Royal Road under Pop, a ii–V–I the library does not have).
import re as _re
_PLIB = open('/home/user/piano-trainer/src/entities/progression-library/content/library.ts', encoding='utf8').read()
_PLIB = _PLIB[_PLIB.index('const LIBRARY = ['):]
_STYLES = {'pop': ('Pop', HONEY), 'rock': ('Rock', PEACH), 'jazz': ('Jazz', SKY), 'blues': ('Blues', LILAC), 'classical': ('Classical', SAGE),
           'soul': ('R&B / Soul', PEACH), 'gospel': ('Gospel', HONEY), 'modal': ('Modal', SKY), 'theory': ('Theory', SAGE)}
_PROGS = []
for _m in _re.finditer(r"entry\(\s*'(\w+)',\s*'([\w-]+)',\s*\{([^}]*)\},\s*'((?:[^'\\]|\\.)*)'", _PLIB):
    _st, _id, _lines, _en = _m.groups()
    _mj = _re.search(r"major: '([^']*)'", _lines); _mn = _re.search(r"minor: '([^']*)'", _lines)
    _line = (_mj or _mn).group(1)
    _PROGS.append((_st, _en.replace("\\'", "'"), ' – '.join(_line.split()), 'Major' if _mj else 'Minor', bool(_mj), bool(_mn)))
_RECENT = ('Axis of Awesome', 'Jazz cadence')
def _prow(st, t, line, key, recent=False):
    return Rw(t, line, key, '', _STYLES[st][1], 'Progression.dc.html', ('Recently used',) if recent else (), ('Major key' if key == 'Major' else 'Minor key',))
_PSECS = [{'g': 'Recently used', 'rows': [_prow(st, t, l, k, True) for r in _RECENT for (st, t, l, k, _, _) in _PROGS if t == r]}]
for _k, (_name, _c) in _STYLES.items():
    _PSECS.append({'g': _name, 'rows': [_prow(st, t, l, k, t in _RECENT) for (st, t, l, k, _, _) in _PROGS if st == _k]})
_PSECS.append({'g': 'Mine', 'rows': [Rw('Verse of my song', 'I – iii – IV – V', 'Major', 'I', FILL, 'Progression.dc.html', ('Mine',), ('Major key',))]})
library('Progressions', 'Progressions', {'places': ['All', 'Favourites', 'Recently used', 'Mine'], 'sorts': ['As arranged', 'Name'], 'favs': ['Axis of Awesome'], 'open': {},
  'filters': [{'name': 'Key', 'opts': [['Major key', sum(1 for p in _PROGS if p[4])], ['Minor key', sum(1 for p in _PROGS if p[5])]]}],
  # at All the last opened lead the page, as in every Practice library (loop, 2026-11-15; round 58)
  'sections': _PSECS},
  back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Name', 't', 2), ('Numerals', 's', 3), ('Key', 'v', .6)),
  add_items=(('New progression', 'ProgressionEdit.dc.html'), ('New folder', 'openFolder')), arrange=True)
# The app's own patterns (data/accompaniment.json, written by app_data.mjs from the app's source), so the board holds
# what the app holds: its five books in their order, each pattern's name, idea, hands and level, and its picture the
# notes PatternTile draws (the board drew twelve invented patterns under four invented books).
_ACC = json.load(open('/home/user/piano-trainer/.scratch/r39/canvas/data/accompaniment.json', encoding='utf8'))
def _tileurl(notes):
    end = max([a + d for a, d, _, _ in notes] or [0])
    def level(part):
        ps = sorted({m for _, _, m, q in notes if q == part})
        return lambda m: 1.5 if len(ps) < 2 else round(ps.index(m) / (len(ps) - 1) * 3)
    lv = {'rh': level('rh'), 'lh': level('lh')}
    bars = ''.join(f'<rect x="{6 + 32 * a / end:.1f}" y="{33 - ((4 if q == "rh" else 0) + lv[q](m)) * 3.5:.1f}" width="{max(1.6, 32 * d / end - .6):.1f}" height="2.6" rx="1.3" fill="{"%23332921" if q == "rh" else "%237A6BB0"}"/>' for a, d, m, q in notes) if end else ''
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="{LILAC.replace("#", "%23")}"/><path d="M6 21.5h32" stroke="%23332921" stroke-opacity=".12"/>{bars}</svg>'
    return 'url("data:image/svg+xml,' + svg.replace('"', "'").replace('<', '%3C').replace('>', '%3E').replace(' ', '%20') + '")'
_ARECENT = ('1 · Bass + chords', '2 · Broken chords')
def _arow(r, recent=False):
    w = Rw(r['name'], r['idea'], r['stage'], '', LILAC, 'Pattern.dc.html', ('Recently used',) if recent else (), (r['stage'],) if r['stage'] else ())
    w.update(pic=_tileurl(r['notes']), x=r['hands'])
    return w
_AROWS = [r for sec in _ACC for r in sec['rows']]
_ASECS = [{'g': 'Recently used', 'rows': [_arow(r, True) for t in _ARECENT for r in _AROWS[:20] if r['name'] == t]}] + [{'g': sec['name'], 'rows': [_arow(r, r['name'] in _ARECENT) for r in sec['rows']]} for sec in _ACC]
library('Accompaniment', 'Accompaniment', {'places': ['All', 'Favourites', 'Recently used', 'Mine'], 'sorts': ['As arranged', 'Name', 'Level'], 'favs': ['2 · Broken chords'], 'open': {},
  'filters': [{'name': 'Level', 'opts': [[st, sum(1 for r in _AROWS if r['stage'] == st)] for st in ('Beginner', 'Intermediate', 'Advanced')]}],
  'sections': _ASECS},
  back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Pattern', 't', 2), ('Hands', 'x', 3.4), ('Level', 'v', .8)),
  add_items=(('New pattern', 'PatternNew.dc.html'), ('New folder', 'openFolder')), arrange=True)
# The app's exercise shelves (data/exercises.json, app_data.mjs), each source's exercises as useExerciseLibrary lists
# them: its mark on its source's paint, its line what it trains, its level its own (Jazz vocabulary drew four invented)
_EX = json.load(open('/home/user/piano-trainer/.scratch/r39/canvas/data/exercises.json', encoding='utf8'))
_EXPAINT = {'grass': SAGE, 'lilac': LILAC, 'sky': SKY, 'sand': FILL}
def _exlib(stem, title, shelf, recent=()):
    rows = lambda g, rec: [Rw(r['name'], r['line'], r['stage'], r['mark'], _EXPAINT[g['paint']], 'Exercise.dc.html', ('Recently used',) if r['name'] in recent else (), (r['stage'],)) for r in g['rows'] if not rec or r['name'] in recent]
    secs = [{'g': g['name'], 'rows': rows(g, False)} for g in _EX[shelf]]  # Recently used a place, as the board drew it
    every = [r for g in _EX[shelf] for r in g['rows']]
    library(stem, title, {'places': ['All', 'Favourites', 'Recently used'], 'sorts': ['As arranged', 'Name', 'Level'], 'favs': list(recent[:1]), 'open': {},
      'filters': [{'name': 'Level', 'opts': [[st, n] for st in ('Beginner', 'Intermediate', 'Advanced', 'Professional') if (n := sum(1 for r in every if r['stage'] == st))]}],
      'sections': secs},
      back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Exercise', 't', 2), ('Focus', 's', 3), ('Level', 'v', 1)), add_items=(('New folder', 'openFolder'),), arrange=True)
_exlib('FingerTechnique', 'Finger technique', 'technique', ('Hanon',))
_exlib('JazzVocabulary', 'Jazz vocabulary', 'jazz')

# ═════ A progression (Hooktheory: the chords coloured by function, the moves drawn) ═════
PR = js(r'''
// switches by key: k → kOn, kOnBg, kOnX, kT; segs by key: [key, options, default] → keySeg
const SW = (st, set, keys) => Object.fromEntries(keys.flatMap(([k, d]) => { const on = st[k] ?? d; return [[k + 'On', on], [k + 'OnBg', on ? '#44684A' : '#DAD1C8'], [k + 'OnX', on ? 22 : 2], [k + 'T', () => set({ [k]: !on })]]; }));
const SG = (st, set, list) => Object.fromEntries(list.map(([k, opts, d]) => [k + 'Seg', seg(opts, st[k] ?? d, (l) => set({ [k]: l }))]));
    const P = ['I', 'V', 'vi', 'IV'], DEG = { I: 0, ii: 2, iii: 4, IV: 5, V: 7, vi: 9 };
    const FN = { I: ['Tonic', '#F3D2C8'], vi: ['Tonic', '#F3D2C8'], iii: ['Tonic', '#F3D2C8'], IV: ['Predominant', '#D3E5F2'], ii: ['Predominant', '#D3E5F2'], V: ['Dominant', '#DCE9D6'] };
    const MOVE = ['5th up', '2nd up', '3rd down', '4th down'];
    const key = st.key ?? 0, at = st.at ?? 1, loop = !!st.loop;
    const ch = (n) => NN[(key + DEG[n]) % 12] + (n === n.toLowerCase() ? 'm' : '');
    const cur = P[at], r = (key + DEG[cur]) % 12, minor = cur === cur.toLowerCase(), marks = {};
    [[0, 1], [minor ? 3 : 4, 3], [7, 5]].forEach(([iv, t]) => { marks[60 + ((r + iv) % 12)] = [ROLE[t], NN[(r + iv) % 12]]; }); marks[48 + r] = [ROLE[1], NN[r]];
    return { ...common(st, set), ...SG(st, set, [['prW', ['Numerals', 'Nashville', 'Chords'], 'Numerals'], ['prI', ['Root', '1st', '2nd'], 'Root']]), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }),
      tiles: P.map((n, i) => ({ n, c: ch(n), bg: FN[n][1], ring: i === at ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8', move: MOVE[i], pick: () => set({ at: i }) })),
      keyL: NN[key] + ' major', roots: rootGrid(key, (i) => set({ key: i, sheet: null })), voiceSeg: seg(['Voice-led', 'Block'], st.voice ?? 'Voice-led', (l) => set({ voice: l })),
      bpm: (st.bpm ?? 96) + ' BPM', bpmDn: () => set({ bpm: (st.bpm ?? 96) - 4 }), bpmUp: () => set({ bpm: (st.bpm ?? 96) + 4 }),
      kb: calmKeys(48, 76, marks, 370, 110), kbL: calmKeys(41, 84, marks, 860, 160), loop, loopBg: loop ? '#332921' : '#EEE9E2', loopFg: loop ? '#FEFDFB' : '#332921', toggleLoop: () => set({ loop: !loop }) };''')
TILES = (f'<div style="display: flex; align-items: stretch; gap: 8px"><sc-for list="{{{{tiles}}}}" as="t" hint-placeholder-count="4"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px"><button type="button" onClick="{{{{t.pick}}}}" style="width: 100%; height: 96px; border: 0; border-radius: 14px; background: {{{{t.bg}}}}; box-shadow: {{{{t.ring}}}}; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-family: {SERIF}; font-size: 26px">{{{{t.n}}}}</span><span style="font-size: 15px; font-weight: 700">{{{{t.c}}}}</span></button><span style="font-size: 12px; color: {SOFT}; height: 14px">{{{{t.move}}}} →</span></div></sc-for></div>'
         f'<div style="display: flex; gap: 16px; font-size: 13px; color: {SOFT}">' + ''.join(f'<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 5px; background: {c}; box-shadow: 0 0 0 1px {LINE}"></span>{l}</span>' for l, c in (('Tonic', PEACH), ('Predominant', SKY), ('Dominant', SAGE))) + '</div>')
PR_ROWS = GROUP(('link', 'Key', '{{keyL}}', 'openRoot'), ('seg', 'Voicing', 'voiceSeg', 200), ('step', 'Tempo', 'bpm', 'bpmDn', 'bpmUp'))
LOOPB = f'<button type="button" aria-pressed="{{{{loop}}}}" onClick="{{{{toggleLoop}}}}" style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {{{{loopBg}}}}; color: {{{{loopFg}}}}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px">{ICON(LOOP, 18)} Loop</button>'
PR_MORE = GROUP(('link', 'Edit the progression', 'Editors', 'ProgressionEdit.dc.html'), ('link', 'Edit a copy', '', ''), ('link', 'Open in the Chord player', '', 'ChordPlayer.dc.html'), ('link', 'Songs with it', 'Let It Be, and 11 more', 'Songs.dc.html'))
PR_SET = GROUP(('seg', 'Written as', 'prWSeg', 200), ('seg', 'First chord’s inversion', 'prISeg', 200), ('link', 'All piano settings', '', 'Settings.dc.html'))
ph = body(TOP('Progressions.dc.html', 'Progression', GEAR() + DOTS()), SUBJECT('Axis of Awesome', 'Pop · in {{keyL}}', 34) + TILES + KEYS(110) + PR_ROWS, LOOPB + BTN('Practise', href='PlayProgression.dc.html', kind='quiet', h=44) + PLAYBTN())
lm = lapbody(LTOP('ProgressionsLaptop.dc.html', GEAR() + DOTS()), SUBJECT('Axis of Awesome', 'Pop · in {{keyL}}', 44) + TILES.replace('height: 96px', 'height: 150px').replace('font-size: 26px', 'font-size: 40px') + KEYS(160, 'kbL'), PR_ROWS + GROUP(('link', 'Practise in the Player', '', 'PlayProgressionLaptop.dc.html'), ('link', 'Open in the Chord player', '', 'ChordPlayerLaptop.dc.html')), LOOPB + SPACER + PLAYBTN())
detail('Progression', 'A progression', PR, ph, lm, '', BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('moreOn', 'Axis of Awesome', PR_MORE) + BSHEET('setOn', 'Progression settings', PR_SET),
       POPOVER('rootOn', 'Key', ROOTGRID()) + POPOVER('moreOn', 'Axis of Awesome', PR_MORE.replace('ProgressionEdit.dc.html', 'ProgressionEditLaptop.dc.html').replace('ChordPlayer.dc.html', 'ChordPlayerLaptop.dc.html').replace('Songs.dc.html', 'SongsLaptop.dc.html')) + POPOVER('setOn', 'Progression settings', PR_SET))

# ═════ Chord player (iReal Pro: the chart fills the page, the player bar at the foot) ═════
CP = js(r'''
// switches by key: k → kOn, kOnBg, kOnX, kT; segs by key: [key, options, default] → keySeg
const SW = (st, set, keys) => Object.fromEntries(keys.flatMap(([k, d]) => { const on = st[k] ?? d; return [[k + 'On', on], [k + 'OnBg', on ? '#44684A' : '#DAD1C8'], [k + 'OnX', on ? 22 : 2], [k + 'T', () => set({ [k]: !on })]]; }));
const SG = (st, set, list) => Object.fromEntries(list.map(([k, opts, d]) => [k + 'Seg', seg(opts, st[k] ?? d, (l) => set({ [k]: l }))]));
    const SECS = [['A', 'Verse', 2, [['C'], ['G'], ['Am'], ['F'], ['C'], ['G'], ['F', 'G'], ['C']]], ['B', 'Chorus', 1, [['F'], ['G'], ['C', 'C/E'], ['F', 'G7'], ['Am'], ['F'], ['G7'], ['C']]], ['C', 'Bridge', 1, [['Dm7'], ['G7'], ['Em7', 'A7'], ['Dm7', 'G7']]]];
    const play = st.playing ? (st.at ?? [0, 2]) : [-1, -1], STY = ['Pop 1', 'Pop ballad', 'Rock 8ths', 'Worship', 'Swing', 'Bossa nova'], s = st.style ?? 0, bpm = st.bpm ?? 96;
    const secs = SECS.map(([m, name, rep, bars], si) => ({ m, name, rep: '× ' + rep, bars: bars.map((cs, bi) => ({ cs: cs.map((c) => ({ c })), bg: play[0] === si && play[1] === bi ? '#EDC684' : !st.playing && (slot || {}).si === si && (slot || {}).bi === bi ? '#F6E7C8' : 'transparent', edge: bi % 4 === 3 ? '0' : '1px', pick: () => set({ sheet: 'chord', sel: [si, bi] }) })) }));
    // the dock's Key rewrites the chart in the new key (each chord's root and bass moved by the same step)
    const KEYS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'], k = st.key ?? 0, reps = st.reps ?? 3, PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const trp1 = (x, d) => { const m = /^([A-G])([♯♭]?)(.*)$/.exec(x); if (!m || !d) return x; return KEYS[((PC[m[1]] + (m[2] === '♯' ? 1 : m[2] === '♭' ? -1 : 0) + d) % 12 + 12) % 12] + m[3]; };
    const trp = (c, d) => c.split('/').map((x) => trp1(x, d)).join('/');
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), chordOn: st.sheet === 'chord', styleOn: st.sheet === 'style', openStyle: () => set({ sheet: 'style' }), secs,
      styleL: STY[s], bpmL: String(bpm), wStyle: wheel(STY, s, (i) => set({ style: i })), wRoot: wheel(NN, 0, () => {}), wQual: wheel(['', 'm', '7', 'maj7', 'm7', 'sus4', 'dim'], 0, () => {}), wLen: wheel(['1 beat', '2 beats', '3 beats', '4 beats'], 3, () => {}),
      keyTiles: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°', 'G7'].map((c) => { const t = trp(c, k), m = t.match(/^([A-G][♭♯]?m?)(\d+)$/); return { c: t, r: m ? m[1] : t, x: m ? m[2] : '', put: () => { const [si, bi, ci] = st.selB59 || [0, 0, 0], c2 = JSON.parse(JSON.stringify(st.secs || SECS)); if (c2[si] && c2[si][3][bi]) c2[si][3][bi][ci] = t; set({ secs: c2, draft: true }); } }; }), keyL: KEYS[k], keyHead: KEYS[k] + ' major chords',
      openKey: () => set({ sheet: 'key' }), keyOn: st.sheet === 'key', wKey: wheel(KEYS, k, (i) => set({ key: i, secs: SECS.map(([m, n, r, bars]) => [m, n, r, bars.map((cs) => cs.map((c) => trp(c, i - k)))]) })),
      openTempo: () => set({ sheet: 'tempo' }), tempoOn: st.sheet === 'tempo', wTempo: wheel(Array.from({ length: 43 }, (_, i) => String(40 + 4 * i)), Math.round((bpm - 40) / 4), (i) => set({ bpm: 40 + 4 * i })),
      openRep: () => set({ sheet: 'rep' }), repOn: st.sheet === 'rep', repL: reps === 0 ? '∞' : '× ' + reps, wRep: wheel(['∞', '× 1', '× 2', '× 3', '× 4', '× 5', '× 6', '× 7', '× 8'], reps, (i) => set({ reps: i })) };''')
CHART = (f'<div style="border-radius: 6px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 10px 24px -18px rgba(51,41,33,.45); padding: 16px 14px 18px; display: flex; flex-direction: column; gap: 16px">'
         f'<div style="text-align: center; font-family: {SERIF}; font-size: 20px">My verse and chorus</div>'
         f'<sc-for list="{{{{secs}}}}" as="x" hint-placeholder-count="2"><section style="display: flex; flex-direction: column; gap: 4px"><div style="display: flex; align-items: center; gap: 8px"><span style="width: 22px; height: 22px; box-sizing: border-box; border: 1.5px solid {INK}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">{{{{x.m}}}}</span><span style="font-size: 14px; font-weight: 600">{{{{x.name}}}}</span>{SPACER}<span style="font-size: 13px; color: {SOFT}">{{{{x.rep}}}}</span><span style="display: flex; color: {SOFT}">{GRIP}</span></div>'
         f'<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-left: 2px solid {INK}; border-right: 2px solid {INK}"><sc-for list="{{{{x.bars}}}}" as="b" hint-placeholder-count="8"><button type="button" onClick="{{{{b.pick}}}}" style="height: {{{{CH}}}}px; border: 0; border-right: {{{{b.edge}}}} solid {INK}; background: {{{{b.bg}}}}; padding: 0 6px; display: flex; align-items: center; justify-content: space-around; color: {INK}; font-family: {SERIF}; font-size: {{{{CF}}}}px; font-weight: 700"><sc-for list="{{{{b.cs}}}}" as="c" hint-placeholder-count="1"><span>{{{{c.c}}}}</span></sc-for></button></sc-for></div></section></sc-for>'
         + ADDCARD('Add section', 'addSec') + '</div>')
def PBTN(label, val, act):
    return f'<button type="button" onClick="{{{{{act}}}}}" style="flex: 1; min-width: 0; height: 52px; border: 0; border-radius: 14px; background: transparent; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; font: inherit"><span style="font-size: 12px; color: {SOFT}">{label}</span><span style="font-size: 16px; font-weight: 700; white-space: nowrap">{val}</span></button>'
CP_DOCK = PBTN('Style', '{{styleL}}', 'openStyle') + PBTN('Key', '{{keyL}}', 'openKey') + PBTN('Tempo', '{{bpmL}}', 'openTempo') + PBTN('Repeats', '{{repL}}', 'openRep') + PLAYBTN()
CP_CHORD = WHEEL([('wRoot', 1), ('wQual', 1), ('wLen', 1.4)]) + f'<button type="button" onClick="{{{{closeSheet}}}}" style="height: 48px; border: 0; border-radius: 12px; background: {SHEET}; color: #B3261E; font: inherit; font-size: 16px; font-weight: 600">Delete chord</button>'
# ── The Chord player's piano (R43 canvas 122; owner: "1. yes", the Chord player gets a piano): the chord sounding
# now, on the keys in its tones' paints, under the chart. 2D keys by default; the one Piano sheet (piano_sheet.py)
# behind Settings › Piano, the same as on the Chords page and in the Player, its range a chart's: Fit the chords ·
# 4 octaves · 88 keys.
import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as PS
CP_PIANO_JS = r'''
    const kbOnS = st.kbOn ?? true, kbView = st.kbView || '2d', kbAngle = st.kbAngle || 'seat', kbHands = st.kbHands ?? true, kbRange = st.kbRange || 'fit', kbLabel = st.kbLabel || 'names';
    const PCN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, NM = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], DEG = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
    const ROLEC = { 1: '#E19E8C', 3: '#85B8DC', 5: '#9BC093', 7: '#E8C67D' }, ROLEN = { 1: 'root', 3: '3rd', 5: '5th', 7: '7th' };
    const pcOf = (t) => (PCN[t[0]] + (t[1] === '♯' ? 1 : t[1] === '♭' ? -1 : 0) + 12) % 12;
    const parse = (sym) => { const [m, bass] = sym.split('/'), acc = m[1] === '♯' || m[1] === '♭', q = m.slice(acc ? 2 : 1), r = pcOf(m);
      const iv = { m: [0, 3, 7], '7': [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], '°': [0, 3, 6], dim: [0, 3, 6], sus4: [0, 5, 7] }[q] || [0, 4, 7];
      const roles = iv.map((v, i) => [1, 3, 5, 7][i]), b = bass ? pcOf(bass) : r, bi = iv.indexOf((b - r + 12) % 12);
      // the left hand plays the bass in the third octave, the right hand the chord in root position from middle C's octave
      return [{ m: 48 + b, role: bi >= 0 ? roles[bi] : 1, iv: bi >= 0 ? iv[bi] : 0, hand: 'lh' }, ...iv.map((v, i) => ({ m: 60 + r + v, role: roles[i], iv: v, hand: 'rh' }))]; };
    const SLOTS = SECS.flatMap(([, , , bars], si) => bars.flatMap((cs, bi) => (cs.length === 1 ? [cs[0], cs[0]] : cs).map((c) => ({ si, bi, c }))));
    const sel = st.sel, slot = st.playing ? SLOTS[(st.pos ?? 4) % SLOTS.length] : (sel ? SLOTS.find((x) => x.si === sel[0] && x.bi === sel[1]) : SLOTS[0]) || null;
    // a sheet with no chord yet (a new sheet's empty Verse) lights nothing over C3 to C5
    const notes = slot ? parse(slot.c) : [], all = SLOTS.length ? SLOTS.flatMap((x) => parse(x.c).map((n) => n.m)) : [48, 72];
    const isW = (m) => [0, 2, 4, 5, 7, 9, 11].includes(m % 12), dn = (m) => { while (!isW(m)) m--; return m; }, up = (m) => { while (!isW(m)) m++; return m; };
    const [lo, hi] = kbRange === '4' ? [36, 83] : kbRange === '88' ? [21, 108] : [dn(Math.min(...all)), up(Math.max(...all))];
    const labOf = (n) => kbLabel === 'names' ? NM[n.m % 12] : kbLabel === 'degrees' ? DEG[n.m % 12] : kbLabel === 'intervals' ? ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♯5', '6', '♭7', '7'][n.iv] : '';
    const lit = new Map(notes.map((n) => [n.m, n]));
    const nW = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter(isW).length, kw = 100 / nW;
    // the keys from lo to hi; a laptop's window, 1462 wide, shows at least C2–C7 so its keys are every board's size
    const mkKeys = (lo, hi) => { const nW = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter(isW).length, kw = 100 / nW;
      let wi = 0; const whites = [], blacks = [];
      for (let m = lo; m <= hi; m++) { const n = lit.get(m), l = n ? labOf(n) : '';
        if (isW(m)) { whites.push({ left: (wi * kw).toFixed(3) + '%', w: kw.toFixed(3) + '%', bg: n ? ROLEC[n.role] : '#FEFDFB', l: nW <= 36 ? l : '' }); wi++; }
        else blacks.push({ left: (wi * kw - kw * 0.3).toFixed(3) + '%', w: (kw * 0.6).toFixed(3) + '%', bg: n ? ROLEC[n.role] : '#332C28', l: nW <= 22 ? l : '' }); }
      return { whites, blacks }; };
    const { whites, blacks } = mkKeys(lo, hi), wide = mkKeys(Math.min(lo, 36), Math.max(hi, 96));
    const is3d = kbOnS && kbView !== '2d';
    this._handsIn = !is3d ? null : { notes: kbHands ? notes.map((n) => ({ midi: n.m, spelled: {}, hand: n.hand, finger: undefined, startTick: 0, durationTicks: 1920, velocity: 80 })) : [],
      perSecond: 960, now: () => 1, playing: false, held: new Set(notes.map((n) => n.m)), marks: new Map(notes.map((n) => [n.m, { tone: ROLEN[n.role] }])), wrong: undefined, faded: null, skin: 'light', range: { low: lo, high: hi } };
    this._labels3d = is3d && kbLabel !== 'none' ? notes.map((n) => ({ m: n.m, black: !isW(n.m), t: labOf(n), c: ROLEC[n.role] })) : [];
    const SEGP = ''' + PS.SEG_JS + r''';
    const strip = (() => { const W = 340, w = W / 52; let i = 0, x0 = null, x1 = 0, bl = '';
      for (let m = 21; m <= 108; m++) { if (isW(m)) { if (m >= lo && x0 === null) x0 = i * w; if (m <= hi) x1 = (i + 1) * w; i++; } else bl += 'M' + (i * w - w * 0.3).toFixed(2) + ' 0h' + (w * 0.6).toFixed(2) + 'v15h-' + (w * 0.6).toFixed(2) + 'z'; }
      const nm = (m) => NM[m % 12] + (Math.floor(m / 12) - 1); return { x: x0.toFixed(2), w: (x1 - x0).toFixed(2), bl, cap: nm(lo) + ' – ' + nm(hi) }; })();
    const cpPiano = { cpKb: kbOnS, cpKb2: kbOnS && kbView === '2d', cpKb3: is3d, cpPad: kbOnS ? 16 : 118, kbw: whites, kbb: blacks, kbwL: wide.whites, kbbL: wide.blacks, nowChord: slot ? slot.c : '',
      handsRef: (el) => { this._cv = el; }, labelsRef: (el) => { this._lb = el; },
      pianoOn: st.sheet === 'piano', openPiano: () => set({ sheet: 'piano' }), backSet: () => set({ sheet: 'set' }), pianoVal: !kbOnS ? 'Hidden' : kbView === '2d' ? '2D keys' : '3D piano',
      pianoSw: ''' + PS.SW_JS('kbOnS', '() => set({ kbOn: !kbOnS })') + r''', kbHandsSw: ''' + PS.SW_JS('kbHands', '() => set({ kbHands: !kbHands })') + r''',
      kb3c: ''' + PS.CARD_JS("kbView !== '2d'", "() => set({ kbView: '3d' })") + r''', kb2c: ''' + PS.CARD_JS("kbView === '2d'", "() => set({ kbView: '2d' })") + r''', kb3d: kbView !== '2d',
      kbAngleSeg: SEGP([['seat', 'Seat'], ['above', 'Above']], kbAngle, (v) => set({ kbAngle: v })),
      kbRangeSeg: SEGP([['fit', 'Fit the chords'], ['4', '4 octaves'], ['88', '88 keys']], kbRange, (v) => set({ kbRange: v })),
      kbLabelSeg: SEGP([['names', 'Note names'], ['degrees', 'Degrees'], ['intervals', 'Intervals'], ['none', 'None']], kbLabel, (v) => set({ kbLabel: v })),
      kbStrip: strip, kbDimOp: kbOnS ? 1 : 0.4, kbPE: kbOnS ? 'auto' : 'none',
      soundSub: '', soundSubOn: false, soundSubVal: 'Grand piano', soundSubValC: '#685E56', midiSub: '', midiSubOn: false, midiSubVal: 'None', midiSubValC: '#685E56' };
'''
# the chart's cursor walks the chart while it plays, half a bar a step (96 BPM in 4/4: 1.25 s)
CP_LIFE = r'''
  componentDidMount() { this._hands3d(); this._tick(); }
  componentDidUpdate() { this._hands3d(); this._tick(); }
  componentWillUnmount() { clearInterval(this._iv); if (this._ro) this._ro.disconnect(); if (this._stage) this._stage.dispose(); this._stage = null; }
  _tick() { const on = !!(this.state || {}).playing; if (on && !this._iv) this._iv = setInterval(() => this.setState((s) => ({ pos: (s.pos ?? 4) + 1 })), 1250); if (!on && this._iv) { clearInterval(this._iv); this._iv = null; } }
''' + PS.HANDS3D
PT_BUNDLE_CP = open('/home/user/piano-trainer/.scratch/r39/canvas/pthands.bundle.js').read()
def CP_KEYS(h):
    """The chord's keys: 2D, or the live 3D stage with the hands."""
    k2 = (f'<sc-if value="{{{{cpKb2}}}}" hint-placeholder-val="{{{{true}}}}"><div role="img" aria-label="The keys of {{{{nowChord}}}}" style="position: relative; height: {h}px; background: #CBC2B9">'
          f'<sc-for list="{{{{kbw}}}}" as="k" hint-placeholder-count="19"><span style="position: absolute; top: 0; bottom: 0; left: {{{{k.left}}}}; width: {{{{k.w}}}}; box-sizing: border-box; border-right: 1px solid rgba(51,41,33,.16); border-radius: 0 0 4px 4px; background: {{{{k.bg}}}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; font-size: 12px; font-weight: 700; color: {INK}">{{{{k.l}}}}</span></sc-for>'
          f'<sc-for list="{{{{kbb}}}}" as="k" hint-placeholder-count="13"><span style="position: absolute; top: 0; height: 60%; left: {{{{k.left}}}}; width: {{{{k.w}}}}; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px; box-sizing: border-box; font-size: 12px; font-weight: 700; color: {INK}">{{{{k.l}}}}</span></sc-for></div></sc-if>')
    k3 = (f'<sc-if value="{{{{cpKb3}}}}" hint-placeholder-val="{{{{false}}}}"><figure aria-label="The hands at the keys, playing {{{{nowChord}}}}" style="position: relative; margin: 0; height: {h}px; overflow: hidden; background: #EDE6DC; {PS.STAGE_VARS}">'
          f'<canvas ref="{{{{handsRef}}}}" style="display: block; width: 100%; height: 100%"></canvas><div ref="{{{{labelsRef}}}}" aria-hidden="true" style="position: absolute; inset: 0; pointer-events: none"></div></figure></sc-if>')
    return k2 + k3
CP_SET = (LABELLED('Instruments', GROUP(('toggle', 'Piano', 'cpPiOn', 'cpPiT'), ('toggle', 'Bass', 'cpBaOn', 'cpBaT'), ('toggle', 'Drums', 'cpDrOn', 'cpDrT')))
          + LABELLED('Playing', GROUP(('link', 'Count-in', '1 bar', ''), ('link', 'Volume', '80%', '')))
          + LABELLED('Music', GROUP(('link', 'Time signature', '4/4', ''), ('seg', 'Written as', 'namesSeg', 200), ('seg', 'Voicing', 'cpVSeg', 200)))
          + GROUP(('link', 'Connect a piano', 'Not connected', 'Settings.dc.html')))
_BACKP = f'<button type="button" aria-label="Back to Chord player settings" onClick="{{{{backSet}}}}" style="position: absolute; left: -8px; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L}</button>'
_PBODY = PS.PIANO_SHEET(False, 3, 4)
CP_PSHEET = BSHEET('pianoOn', 'Piano', _PBODY, back=_BACKP, maxh='calc(100% - 124px)')
CP_PPOP = POPOVER('pianoOn', 'Piano', _PBODY, 'right: 40px; top: 64px', 400, back=_BACKP)

CP = CP.replace("    const play = st.playing ? (st.at ?? [0, 2])", CP_PIANO_JS + "    const play = st.playing ? [(slot || {}).si, (slot || {}).bi]", 1).replace("styleOn: st.sheet === 'style',", "styleOn: st.sheet === 'style', ...cpPiano,", 1)
CP = 'const PT_BUNDLE = ' + json.dumps(PT_BUNDLE_CP) + ';\n' + CP.replace('class Component extends DCLogic {\n', 'class Component extends DCLogic {' + CP_LIFE, 1)
CP = CP.replace("keyTiles:", "namesSeg: seg(['Chords', 'Numerals', 'Nashville'], st.names ?? 'Chords', (l) => set({ names: l })), ...SW(st, set, [['cpPi', true], ['cpBa', true], ['cpDr', true], ['cpRep', true]]), ...SG(st, set, [['cpV', ['Smooth voice leading', 'Block chords'], 'Smooth voice leading']]), keyTiles:")
UNDOB = IB('Undo', UNDO)
ph = (body(TOP('Main.dc.html', 'Chord player', UNDOB + GEAR() + DOTS()), CHART.replace('{{CH}}', '50').replace('{{CF}}', '17'), CP_DOCK, 118).replace('padding: 4px 16px 118px', 'padding: 4px 16px {{cpPad}}px', 1)
      .replace('</main>', '</main><sc-if value="{{cpKb}}" hint-placeholder-val="{{true}}"><div style="flex: none; margin-bottom: 110px; box-shadow: 0 -1px 0 ' + LINE + '">' + CP_KEYS(112) + '</div></sc-if>', 1))
DRAG = f'{H2("{{keyHead}}")}<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{keyTiles}}}}" as="k" hint-placeholder-count="8"><button type="button" draggable="true" onClick="{{{{k.put}}}}" aria-label="Put {{{{k.c}}}} in the chosen place" data-tip="Tap or drag into a bar" style="height: 56px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 600; cursor: grab"><span style="line-height: 1.25">{{{{k.r}}}}<sup style="font-size: max(12px, .6em); vertical-align: .6em; margin-left: 1px">{{{{k.x}}}}</sup></span></button></sc-for></div>'
lm = lapbody(LTOP('Laptop.dc.html', UNDOB + GEAR() + DOTS(), 'Chord player'), f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto">{CHART.replace("{{CH}}", "64").replace("{{CF}}", "22")}</div>' + '<sc-if value="{{cpKb}}" hint-placeholder-val="{{true}}"><div style="flex: none; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px ' + LINE + '">' + CP_KEYS(160) + '</div></sc-if>', DRAG + H2('Style') + WHEEL([('wStyle', 1)]), CP_DOCK)
CP_MORE = GROUP(('link', 'Chord sheets', '', ''), ('link', 'Save as my chord sheet', '', ''), ('link', 'Open in Progressions', '', 'Progressions.dc.html'), ('link', 'Share link', '', ''))
detail('ChordPlayer', 'Chord player', CP, ph, lm, '', BSHEET('chordOn', 'Bar 3', CP_CHORD) + BSHEET('styleOn', 'Style', WHEEL([('wStyle', 1)])) + BSHEET('setOn', 'Chord player settings', CP_SET) + CP_PSHEET + BSHEET('moreOn', 'Chord sheet', CP_MORE),
       POPOVER('chordOn', 'Bar 3', CP_CHORD, 'left: 140px; top: 220px', 440) + POPOVER('styleOn', 'Style', WHEEL([('wStyle', 1)]), 'left: 200px; bottom: 110px') + POPOVER('setOn', 'Chord player settings', CP_SET) + CP_PPOP + POPOVER('moreOn', 'Chord sheet', CP_MORE.replace('Progressions.dc.html', 'ProgressionsLaptop.dc.html')))

# ═════ An exercise (Hanon Pro: the page, Listen, a metronome and a target tempo) ═════
EX = js(r'''
    const no = st.no ?? 1, key = st.key ?? 0, bpm = st.bpm ?? 60, target = 108;
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }),
      noL: 'No. ' + no, noDn: () => set({ no: Math.max(1, no - 1) }), noUp: () => set({ no: Math.min(20, no + 1) }), keyL: NN[key] + ' major', roots: rootGrid(key, (i) => set({ key: i, sheet: null })),
      handsSeg: seg(['Left', 'Both', 'Right'], st.hands ?? 'Both', (l) => set({ hands: l })), rhythmSeg: seg(['Even', 'Dotted', 'Reverse dotted'], st.rhythm ?? 'Even', (l) => set({ rhythm: l })),
      bpmL: bpm + ' BPM', bpmDn: () => set({ bpm: bpm - 4 }), bpmUp: () => set({ bpm: bpm + 4 }), pctW: Math.min(100, Math.round(bpm / target * 100)) + '%', ladder: bpm + ' of ' + target + ' BPM',
      fav: st.fav ?? true, heartFill: (st.fav ?? true) ? '#B84A3E' : 'none', heartStroke: (st.fav ?? true) ? '#B84A3E' : '#332921', toggleFav: () => set({ fav: !(st.fav ?? true) }) };''')
LADDER = f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 12px 16px 12px"><div style="display: flex; justify-content: space-between; font-size: 14px"><span>Tempo ladder</span><span style="color: {SOFT}">{{{{ladder}}}}</span></div><div style="height: 6px; border-radius: 3px; background: {SHEET}"><div style="width: {{{{pctW}}}}; height: 6px; border-radius: 3px; background: #44684A"></div></div></div>'
EX_ROWS = GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('link', 'Key', '{{keyL}}', 'openRoot'), ('seg', 'Hands', 'handsSeg', 190), ('seg', 'Rhythm', 'rhythmSeg', 262), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('raw', LADDER))
EX_PIC = lambda w: CARD(hanon(w) + hanon(w).replace('bars 1 and 2', 'bars 3 and 4') + f'<div style="display: flex; justify-content: space-between; font-size: 13px; color: {SOFT}; margin-top: 6px"><span>Bars 1–4 of 28</span><span>The left hand an octave lower</span></div>', '12px')
EX_SET = GROUP(('link', 'Count-in', '1 bar', ''), ('link', 'Wait for the right note', 'On', ''), ('link', 'Next key', 'Circle of fifths', ''), ('link', 'All piano settings', '', ''))
ph = body(TOP('FingerTechnique.dc.html', 'Hanon', HEARTB + GEAR()), SUBJECT('Hanon No. 1', 'The Virtuoso Pianist · finger technique', 32) + EX_PIC(340) + EX_ROWS, BTN(SPEAKER + ' Listen', kind='quiet', grow=False) + BTN(ICON(PLAY, 18) + ' Start', href='PlayExercise.dc.html'))
lm = lapbody(LTOP('FingerTechniqueLaptop.dc.html', HEARTB + GEAR()), SUBJECT('Hanon No. 1', 'The Virtuoso Pianist · finger technique', 44) + EX_PIC(880), EX_ROWS, BTN(SPEAKER + ' Listen', kind='quiet', grow=False) + BTN(ICON(PLAY, 18) + ' Start', href='PlayExerciseLaptop.dc.html'))
detail('Exercise', 'An exercise', EX, ph, lm, '', BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('setOn', 'Exercise settings', EX_SET), POPOVER('rootOn', 'Key', ROOTGRID()) + POPOVER('setOn', 'Exercise settings', EX_SET))

# ═════ Metronome (Soundbrenner's accents, the ruling's −10 −1 +1 +10, one Start) ═════
ME = js(r'''
    const MARK = [[60, 'Largo'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [168, 'Allegro'], [999, 'Presto']];
    const bpm = st.bpm ?? 120, meter = st.meter ?? 4, lv = st.lv || ['accent', 'beat', 'beat', 'beat'], cyc = { accent: 'beat', beat: 'silent', silent: 'accent' }, H = { accent: 100, beat: 58, silent: 0 };
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), subOn: st.sheet === 'sub', openSub: () => set({ sheet: 'sub' }),
      bpm: String(bpm), mark: MARK.find(([t]) => bpm < t)[1], pos: ((bpm - 20) / 280 * 100).toFixed(1) + '%',
      d10: () => set({ bpm: bpm - 10 }), d1: () => set({ bpm: bpm - 1 }), u1: () => set({ bpm: bpm + 1 }), u10: () => set({ bpm: bpm + 10 }),
      beats: Array.from({ length: meter }, (_, i) => { const l = lv[i] || 'beat'; return { n: i + 1, h: H[l] + '%', bg: l === 'accent' ? '#332921' : '#A49A90', fg: l === 'accent' ? '#FEFDFB' : '#685E56', ring: st.playing && i === 0 ? '0 0 0 3px #EDC684' : '0 0 0 1px #DAD1C8', pick: () => set({ lv: Array.from({ length: meter }, (_, j) => j === i ? cyc[l] : (lv[j] || 'beat')) }) }; }),
      meterL: meter + '/4', mDn: () => set({ meter: Math.max(1, meter - 1) }), mUp: () => set({ meter: Math.min(12, meter + 1) }), subL: st.sub ?? 'None',
      subs: ['None', 'Eighths', 'Triplets', 'Sixteenths', 'Swung eighths'].map((s) => ({ k: s, mark: (st.sub ?? 'None') === s ? '✓' : '', pick: () => set({ sub: s, sheet: null }) })), startL: st.playing ? 'Stop' : 'Start' };''')
NUDGE = lambda l, a: f'<button type="button" onClick="{{{{{a}}}}}" style="width: 52px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">{l}</button>'
TEMPO = lambda big: (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 2px"><span style="font-size: 15px; color: {SOFT}">{{{{mark}}}} · BPM</span><div style="align-self: stretch; display: flex; align-items: center; justify-content: space-between; gap: 8px">{NUDGE("−10", "d10")}{NUDGE("−1", "d1")}<span style="min-width: {big * 1.75:.0f}px; text-align: center; font-size: {big}px; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums">{{{{bpm}}}}</span>{NUDGE("+1", "u1")}{NUDGE("+10", "u10")}</div></div>'
                     f'<div style="display: flex; align-items: center; gap: 12px; font-size: 12px; color: {SOFT}; font-variant-numeric: tabular-nums"><span aria-hidden="true">20</span><div role="slider" aria-label="Tempo" aria-valuemin="20" aria-valuemax="300" style="flex: 1; min-width: 0; position: relative; height: 28px; display: flex; align-items: center"><div style="width: 100%; height: 4px; border-radius: 2px; background: {LINE}"></div><div style="position: absolute; left: 0; width: {{{{pos}}}}; height: 4px; border-radius: 2px; background: {INK}"></div><span style="position: absolute; left: calc({{{{pos}}}} - 14px); width: 28px; height: 28px; border-radius: 14px; background: {SHEET}; box-shadow: 0 1px 4px rgba(51,41,33,.3)"></span></div><span aria-hidden="true">300</span></div>')
BEATS = lambda h: f'<div role="group" aria-label="Beats: tap one for accent, normal or silent" style="display: flex; gap: 8px; height: {h}px"><sc-for list="{{{{beats}}}}" as="b" hint-placeholder-count="4"><button type="button" aria-label="Beat {{{{b.n}}}}" onClick="{{{{b.pick}}}}" style="position: relative; flex: 1; min-width: 0; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: {{{{b.ring}}}}; overflow: hidden; padding: 0"><span style="position: absolute; left: 0; right: 0; bottom: 0; height: {{{{b.h}}}}; background: {{{{b.bg}}}}"></span><span style="position: absolute; left: 8px; top: 6px; font-size: 12px; font-weight: 600; color: {{{{b.fg}}}}">{{{{b.n}}}}</span></button></sc-for></div>'
ME_ROWS = GROUP(('step', 'Time signature', 'meterL', 'mDn', 'mUp'), ('link', 'Subdivision', '{{subL}}', 'openSub'), ('link', 'Sound', 'Woodblock', ''), ('link', 'Speed trainer', 'Off', ''), ('link', 'Silent bars', 'Off', ''), bg=SHEET)
SUBLIST = f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{subs}}}}" as="k" hint-placeholder-count="5"><button type="button" onClick="{{{{k.pick}}}}" style="width: 100%; height: 48px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {LINE}; padding: 0 16px; display: flex; align-items: center; color: {INK}; font: inherit; font-size: 16px; text-align: left"><span style="flex: 1">{{{{k.k}}}}</span><span style="color: {LINK}; font-weight: 700">{{{{k.mark}}}}</span></button></sc-for></div>'
ME_SET = GROUP(('toggle', 'Flash on the beat', 'meFlOn', 'meFlT'), ('step', 'Volume', 'meVolL', 'meVolDn', 'meVolUp', 80))
STARTB = f'<button type="button" onClick="{{{{togglePlay}}}}" style="flex: 1; height: 50px; border: 0; border-radius: 25px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 17px; font-weight: 700">{{{{startL}}}}</button>'
ph = body(TOP('Main.dc.html', 'Metronome', GEAR()), TEMPO(72) + BEATS(110) + ME_ROWS, BTN('Tap tempo', kind='quiet', grow=False) + STARTB)
lm = lapbody(LTOP('Laptop.dc.html', GEAR(), 'Metronome'), '<div style="flex: 1"></div>' + TEMPO(120) + BEATS(220) + '<div style="flex: 1"></div>', ME_ROWS, BTN('Tap tempo', kind='quiet', grow=False) + STARTB)
detail('Metronome', 'Metronome', ME, ph, lm, '', BSHEET('subOn', 'Subdivision', SUBLIST) + BSHEET('setOn', 'Metronome settings', ME_SET), POPOVER('subOn', 'Subdivision', SUBLIST, 'right: 40px; top: 160px') + POPOVER('setOn', 'Metronome settings', ME_SET))

# ═════ Tuner (Cleartune and Pano: the note, the needle, cents and Hz) ═════
TU = js(r'''
    const cents = st.cents ?? -6, a4 = st.a4 ?? 440, mic = st.mic ?? true, ok = Math.abs(cents) <= 3;
    const ticks = Array.from({ length: 21 }, (_, i) => { const c = -50 + i * 5, a = (c / 50) * 60 * Math.PI / 180, l = c % 25 === 0; return { d: 'M' + (160 + Math.sin(a) * (l ? 110 : 120)).toFixed(1) + ' ' + (170 - Math.cos(a) * (l ? 110 : 120)).toFixed(1) + 'L' + (160 + Math.sin(a) * 134).toFixed(1) + ' ' + (170 - Math.cos(a) * 134).toFixed(1) }; });
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), ticks, needle: 'rotate(' + (cents / 50 * 60) + ' 160 170)', nc: ok ? '#44684A' : '#C26A2E',
      state: ok ? 'In tune' : cents < 0 ? Math.abs(cents) + ' cents flat' : cents + ' cents sharp', hz: (a4 * Math.pow(2, cents / 1200)).toFixed(1) + ' Hz', sc: ok ? '#44684A' : '#A8551F',
      micOn: mic, micOff: !mic, allow: () => set({ mic: true }), a4L: a4 + ' Hz', aDn: () => set({ a4: a4 - 1 }), aUp: () => set({ a4: a4 + 1 }) };''')
GAUGE = lambda w: f'<svg viewBox="0 0 320 180" width="{w}" aria-hidden="true" style="display: block; max-width: 100%; margin: 0 auto"><path d="M43.9 104A134 134 0 0 1 276.1 104" fill="none" stroke="{FILL}" stroke-width="22"></path><path d="M149.5 36.4A134 134 0 0 1 170.5 36.4" fill="none" stroke="#9BC093" stroke-width="22"></path><sc-for list="{{{{ticks}}}}" as="t" hint-placeholder-count="21"><path d="{{{{t.d}}}}" stroke="{SOFT}" stroke-width="1.6"></path></sc-for><g transform="{{{{needle}}}}"><path d="M160 170L160 44" stroke="{{{{nc}}}}" stroke-width="4" stroke-linecap="round"></path></g><circle cx="160" cy="170" r="8" fill="{INK}"></circle><text x="36" y="178" font-size="12" fill="{SOFT}">−50</text><text x="266" y="178" font-size="12" fill="{SOFT}">+50</text></svg>'
NOTE = lambda s: f'<div style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="font-size: {s}px; line-height: 1; font-weight: 700">A<sub style="font-size: {s // 3}px; font-weight: 600">4</sub></span><span style="font-size: 18px; font-weight: 600; color: {{{{sc}}}}">{{{{state}}}}</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{hz}}}}</span></div>'
MICOFF = f'<sc-if value="{{{{micOff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="padding: 40px 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center"><span style="font-size: 17px; color: {SOFT}">Play a note and the tuner shows how far it is from in tune. It needs the microphone.</span>{BTN("Allow the microphone", "allow", grow=False)}</div></sc-if>'
TU_ROWS = GROUP(('step', 'A4', 'a4L', 'aDn', 'aUp', 80), ('link', 'Temperament', 'Equal', ''))
TU_SET = GROUP(('link', 'Show', 'Cents and Hz', ''), ('link', 'Note names', 'C D E', ''))
LISTEN = f'<span style="flex: 1; padding-left: 12px; display: flex; align-items: center; gap: 8px; font-size: 15px; color: {SOFT}"><span style="width: 8px; height: 8px; border-radius: 4px; background: #44684A"></span>Listening</span>'
ph = body(TOP('Main.dc.html', 'Tuner', GEAR()), f'<sc-if value="{{{{micOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="height: 30px"></div>{NOTE(96)}<div style="height: 10px"></div>{GAUGE(360)}</sc-if>{MICOFF}<div style="flex: 1"></div>' + TU_ROWS, LISTEN + BTN(SPEAKER + ' Play A4', kind='quiet', grow=False, h=44))
lm = lapbody(LTOP('Laptop.dc.html', GEAR(), 'Tuner'), f'<sc-if value="{{{{micOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: 1"></div>{NOTE(140)}{GAUGE(620)}<div style="flex: 1"></div></sc-if>{MICOFF}', TU_ROWS, LISTEN + BTN(SPEAKER + ' Play A4', kind='quiet', grow=False, h=44))
detail('Tuner', 'Tuner', TU, ph, lm, '', BSHEET('setOn', 'Tuner settings', TU_SET), POPOVER('setOn', 'Tuner settings', TU_SET))

# ═════ Chord finder (you play, it names: the keys are the input) ═════
CF = js(r'''
// switches by key: k → kOn, kOnBg, kOnX, kT; segs by key: [key, options, default] → keySeg
const SW = (st, set, keys) => Object.fromEntries(keys.flatMap(([k, d]) => { const on = st[k] ?? d; return [[k + 'On', on], [k + 'OnBg', on ? '#44684A' : '#DAD1C8'], [k + 'OnX', on ? 22 : 2], [k + 'T', () => set({ [k]: !on })]]; }));
const SG = (st, set, list) => Object.fromEntries(list.map(([k, opts, d]) => [k + 'Seg', seg(opts, st[k] ?? d, (l) => set({ [k]: l }))]));
    const held = st.held ?? [52, 60, 67, 71], empty = held.length === 0;
    const R = { 52: [ROLE[3], 'E'], 60: [ROLE[1], 'C'], 67: [ROLE[5], 'G'], 71: [ROLE[7], 'B'] }, marks = {}; held.forEach((m) => { marks[m] = R[m] || ['#EDC684', NN[m % 12]]; });
    return { ...common(st, set), ...SW(st, set, [['cfSl', true], ['cfK', true], ['cfSc', false], ['cfH', true]]), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), empty, found: !empty, name: empty ? 'Play a chord' : 'Cmaj7/E', sub: empty ? 'Hold three or more keys, here or on your piano' : 'C major 7th, 1st inversion',
      notes: [['E', '3rd · bass'], ['C', 'root'], ['G', '5th'], ['B', '7th']].map(([n, d]) => ({ n, d })), alts: ['Em(♭6)'].map((a) => ({ a })), played: ['G7', 'Am7', 'Dm7'].map((p) => ({ p })),
      kb: calmKeys(48, 76, marks, 370, 170), kbL: calmKeys(36, 84, marks, 860, 200), clear: () => set({ held: [] }) };''')
CHIPL = lambda lst, k: f'<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{{lst}}}}}" as="x" hint-placeholder-count="2"><span style="height: 32px; padding: 0 12px; border-radius: 16px; background: {FILL}; display: flex; align-items: center; font-size: 15px; font-weight: 600">{{{{x.{k}}}}}</span></sc-for></div>'
CF_NOTES = f'<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{notes}}}}" as="n" hint-placeholder-count="4"><span style="height: 64px; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center"><span style="font-size: 22px; font-weight: 700">{{{{n.n}}}}</span><span style="font-size: 12px; color: {SOFT}">{{{{n.d}}}}</span></span></sc-for></div></sc-if>'
CF_ROWS = GROUP(('link', 'Spelled in', 'C major', ''), ('raw', f'<div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Also read as</span>{CHIPL("alts", "a")}</div>'), ('raw', f'<div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Played</span>{CHIPL("played", "p")}</div>'))
CF_SET = (CAPS('Chord names') + GROUP(('toggle', 'Slash chords for inversions', 'cfSlOn', 'cfSlT')) + CAPS('Analysis') + GROUP(('toggle', 'Keys that contain the chord', 'cfKOn', 'cfKT'), ('toggle', 'Key’s scale on the keyboard', 'cfScOn', 'cfScT'))
          + CAPS('History') + GROUP(('toggle', 'Keep chord history', 'cfHOn', 'cfHT'), ('action', 'Forget the chords played', 'closeSheet')) + GROUP(('link', 'Connect a piano', 'Not connected', 'Settings.dc.html')))
ph = body(TOP('Main.dc.html', 'Chord finder', GEAR()), SUBJECT('{{name}}', '{{sub}}', 44) + CF_NOTES + CF_ROWS + '<div style="flex: 1"></div>' + KEYS(170), BTN('Clear the keys', 'clear', kind='quiet', grow=False) + BTN('Open in Chords', href='Chords.dc.html'))
lm = lapbody(LTOP('Laptop.dc.html', GEAR(), 'Chord finder'), SUBJECT('{{name}}', '{{sub}}', 64) + CF_NOTES + '<div style="flex: 1"></div>' + KEYS(200, 'kbL'), CF_ROWS, BTN('Clear the keys', 'clear', kind='quiet', grow=False) + BTN('Open in Chords', href='ChordsLaptop.dc.html'))
detail('ChordFinder', 'Chord finder', CF, ph, lm, '', BSHEET('setOn', 'Chord finder settings', CF_SET), POPOVER('setOn', 'Chord finder settings', CF_SET))

# ═════ Circle of fifths (muted.io: the circle, then the key's signature and chords) ═════
CO = js(CO_LOGIC.replace("return { ...common(st, set),", "const DIA = [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm'], [11, '°']], FIFTH = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], root = FIFTH[sel];\n    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), dia: DIA.map(([iv, q], i) => ({ c: NN[(root + iv) % 12] + q, d: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][i] })), modeSeg: seg(['Major', 'Minor'], st.mode ?? 'Major', (l) => set({ mode: l })),"))
CIRCLE = lambda w: (f'<div style="position: relative; width: {w}px; max-width: 100%; aspect-ratio: 1; margin: 0 auto"><svg viewBox="0 0 400 400" role="radiogroup" aria-label="Keys" style="display: block; width: 100%; height: 100%"><sc-for list="{{{{segs}}}}" as="g" hint-placeholder-count="12"><g onClick="{{{{g.pick}}}}" style="cursor: pointer"><path d="{{{{g.o}}}}" fill="{{{{g.fo}}}}" stroke="{LINE}" stroke-width="1.2"></path><path d="{{{{g.n}}}}" fill="{{{{g.fi}}}}" stroke="{LINE}" stroke-width="1.2"></path></g></sc-for><circle cx="200" cy="200" r="74" fill="{PAGE}" stroke="{LINE}" stroke-width="1.2"></circle></svg>'
    # the key names as HTML over the wheel: a hole inside SVG <text> does not draw in the canvas
    f'<sc-for list="{{{{segs}}}}" as="g" hint-placeholder-count="12"><span aria-hidden="true" style="position: absolute; left: {{{{g.mxp}}}}%; top: {{{{g.myp}}}}%; transform: translate(-50%, -50%); pointer-events: none; font-size: {round(24 * w / 400)}px; font-weight: 700; color: {INK}; white-space: nowrap">{{{{g.m}}}}</span><span aria-hidden="true" style="position: absolute; left: {{{{g.nxp}}}}%; top: {{{{g.nyp}}}}%; transform: translate(-50%, -50%); pointer-events: none; font-size: {round(15 * w / 400)}px; color: {SOFT}; white-space: nowrap">{{{{g.mn}}}}</span></sc-for></div>')
DIA = f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px"><sc-for list="{{{{dia}}}}" as="d" hint-placeholder-count="7"><span style="height: 54px; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px"><span style="font-size: 15px; font-weight: 700">{{{{d.c}}}}</span><span style="font-size: 12px; color: {SOFT}">{{{{d.d}}}}</span></span></sc-for></div>'
CO_SET = GROUP(('link', 'Key signatures on the circle', 'On', ''), ('link', 'Minor keys inside', 'On', ''))
ph = body(TOP('Main.dc.html', 'Circle of fifths', GEAR()), CIRCLE(350) + SUBJECT('{{name}}', '{{sub}}', 30) + f'{CAPS("Chords in the key")}' + DIA, SEGC('modeSeg', 44, 14, fill=True) + BTN('Scales and keys', href='Scales.dc.html', kind='quiet', grow=False, h=44) + PLAYBTN())
lm = lapbody(LTOP('Laptop.dc.html', GEAR(), 'Circle of fifths'), f'<div style="flex: 1; min-height: 0; display: flex; align-items: center">{CIRCLE(600)}</div>', SUBJECT('{{name}}', '{{sub}}', 40) + CARD(scale_staff(360, '        ').replace('aria-label="G major, up one octave, right-hand fingering over the notes"', 'aria-label="The key signature"')) + CAPS('Chords in the key') + DIA + GROUP(('link', 'Relative minor', 'E minor', ''), ('link', 'Open in Scales and keys', '', 'ScalesLaptop.dc.html')), SEGC('modeSeg', 44, 14, fill=True) + PLAYBTN())
detail('CircleOfFifths', 'Circle of fifths', CO, ph, lm, '', BSHEET('setOn', 'Circle settings', CO_SET), POPOVER('setOn', 'Circle settings', CO_SET))

print('practice ok')
