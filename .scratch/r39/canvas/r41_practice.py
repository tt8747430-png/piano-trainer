# R41 Practice: each page to its own reference, in the calm language, holding R39's rulings (every control labelled,
# a gear for the page's settings, a key or root from the root grid, fingering never on the keys, libraries in the one
# library shape).

def PROW(p, t, s, v='', href='#'):
    return (f'<a href="{href}" style="min-height: 64px; display: flex; align-items: center; gap: 12px; padding: 8px 12px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}">{pic(p)}'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{t}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{s}</span></span>'
            f'<span style="font-size: 14px; color: {SOFT}; white-space: nowrap">{v}</span><span style="display: flex; color: {SOFT}">{CHEV_R}</span></a>')
PLIST = lambda rows: f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">' + ''.join(PROW(*r) for r in rows) + '</div>'
def PCARD(p, t, s, v, href):
    return f'<a href="{href}" style="border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 14px; display: flex; flex-direction: column; gap: 10px; color: {INK}; text-decoration: none">{pic(p, 96)}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">{t}</span><span style="font-size: 14px; color: {SOFT}">{s}</span></span><span style="font-size: 13px; color: {SOFT}">{v}</span></a>'
def L(href, lap):  # a phone board's laptop twin
    return href.replace('.dc.html', 'Laptop.dc.html') if lap and href != '#' else href
def body(top, inner, dock='', pad_bottom=118):
    return f'{top}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px {pad_bottom}px; display: flex; flex-direction: column; gap: 14px">{inner}</main>{DOCK(dock) if dock else ""}'
def lapbody(top, left, right, dock=''):
    return f'{top}<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 40px; padding: 0 40px 28px 56px"><div style="min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 18px">{left}{DOCK_L(dock) if dock else ""}</div><div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-top: 4px">{right}</div></div>'
SPACER = '<span style="flex: 1"></span>'

# ═════ Practice overview (R39-4: relevance first, pictures that show the content) ═════
# canvas 160 (owner, grilled: Q1 "a" — the Chords page studies a chord, then practises it; "remove the quiz page
# completely"; the Chord trainer goes; Q10 "why the accompaniment is not under theory and the chord player is not the same
# as exercises"; Q10c "I dont like that exercises are under technique"): Theory, the pages that explain and are practised
# where they are explained; Exercises, named for what they train; Tools, the instruments, the Chord player first.
THEORY = [('keys', 'Chords', 'Chord types, voicings, inversions', '', 'Chords.dc.html'), ('staff', 'Scales and keys', 'Scales, fingerings, key signatures', '', 'Scales.dc.html'),
          ('arc', 'Intervals', 'Minor 2nd to octave', '', 'Intervals.dc.html'), ('roman', 'Progressions', 'Pop, jazz and classical', '', 'Progressions.dc.html'),
          ('roll', 'Accompaniment', 'Bass and chord patterns', '', 'Accompaniment.dc.html')]
EXERCISES = [('drill', 'Finger technique', 'Hanon, five-finger position', '', 'FingerTechnique.dc.html'), ('swing', 'Jazz vocabulary', 'Barry Harris, Piano With Jonny', '', 'JazzVocabulary.dc.html')]
TOOLS = [('chart', 'Chord player', 'Lead sheets with backing', '', 'ChordPlayer.dc.html'), ('metro', 'Metronome', '120 BPM · 4/4', '', 'Metronome.dc.html'), ('needle', 'Tuner', 'Chromatic tuner', '', 'Tuner.dc.html'),
         ('lens', 'Chord finder', 'Chord identification', '', 'ChordFinder.dc.html'), ('circle', 'Circle of fifths', 'Key signatures, diatonic chords', '', 'CircleOfFifths.dc.html')]
TOOLSBTN = f'<button type="button" onClick="{{{{openTools}}}}" style="height: 44px; padding: 0 14px; border: solid transparent; border-width: 4px 0; background-clip: padding-box; border-radius: 22px; background-color: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">Tools</button>'
MAIN = js(r"    return { ...common(st, set), toolsOn: st.sheet === 'tools', openTools: () => set({ sheet: 'tools' }) };")
ph = f'''{TOP('', '', TOOLSBTN + IB('Search', SEARCH.replace('18', '22'), href='#'))}{LARGE('Practice')}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 130px; display: flex; flex-direction: column; gap: 14px">
{H2('Theory')}{PLIST(THEORY)}{H2('Exercises')}{PLIST(EXERCISES)}{H2('Tools')}{PLIST(TOOLS)}</main>{TABBAR('Practice')}'''
grid = lambda rows: '<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px">' + ''.join(PCARD(p, t, s, v, L(h, True)) for p, t, s, v, h in rows) + '</div>'
lm = f'''{LTOP('', TOOLSBTN + IB('Search', SEARCH.replace('18', '22'), href='#'))}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 40px; display: flex; flex-direction: column; gap: 16px">
<h1 style="margin: 0; font-size: 34px; font-weight: 700">Practice</h1>
{H2('Theory')}{grid(THEORY)}{H2('Exercises')}{grid(EXERCISES)}{H2('Tools')}{grid(TOOLS)}</main>'''
TOOLSHEET = PLIST(TOOLS)
detail('Main', 'Practice', MAIN, ph, lm, '', BSHEET('toolsOn', 'Tools', TOOLSHEET), POPOVER('toolsOn', 'Tools', PLIST([(p, t, s, v, L(h, True)) for p, t, s, v, h in TOOLS]), 'right: 40px; top: 60px', 400))

# ═════ Scales and keys (Piano Companion: the staff, then the chords that fit; R39 rulings) ═════
def scale_staff(w, fingers):
    sp = 7; top = 30; base = top + 4 * sp
    o = ''.join(f'<path d="M4 {top + i * sp}H{w - 4}" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    o += f'<text x="6" y="{base + 6}" font-size="44" font-family="Noto Music, serif" fill="{INK}">𝄞</text><text x="38" y="{top + 2}" font-size="18" font-family="Noto Music, serif" fill="{INK}">♯</text>'
    x0, dx = 68, (w - 84) / 8
    for i in range(8):
        x = x0 + i * dx; y = base - (2 + i) * sp / 2
        o += f'<ellipse cx="{x:.1f}" cy="{y}" rx="5" ry="3.7" transform="rotate(-20 {x:.1f} {y})" fill="{INK}"></ellipse><path d="M{x + 4.6:.1f} {y}V{y - 24}" stroke="{INK}" stroke-width="1.1"></path>'
        o += f'<text x="{x:.1f}" y="{min(top - 10, y - 30)}" text-anchor="middle" font-size="12" font-weight="700" fill="#5A4C8C">{fingers[i]}</text>'
    return f'<svg viewBox="0 0 {w} 96" width="100%" role="img" aria-label="G major, up one octave, right-hand fingering over the notes" style="display: block">{o}</svg>'
def SCALESTAFF(label):
    # the chosen scale up one octave on a treble staff with its own key signature (R42 v68); glyphs as literal text
    o = ''.join(f'<path d="M4 {30 + i * 7}H356" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    o += f'<text x="6" y="64" font-size="44" font-family="Noto Music, serif" fill="{INK}">𝄞</text>'
    gl = lambda key, ch, size=18: f'<sc-if value="{{{{{key}}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{z.ax}}}}" y="{{{{z.ay}}}}" font-size="{size}" font-family="Noto Music, serif" fill="{INK}">{ch}</text></sc-if>'
    o += '<sc-for list="{{ss.sig}}" as="z" hint-placeholder-count="1">' + gl('z.s', '♯') + gl('z.f', '♭') + '</sc-for>'
    o += f'<sc-for list="{{{{ss.led}}}}" as="l" hint-placeholder-count="0"><path d="{{{{l.d}}}}" stroke="{INK}" stroke-width="1"></path></sc-for>'
    o += (f'<sc-for list="{{{{ss.notes}}}}" as="z" hint-placeholder-count="8"><ellipse cx="{{{{z.x}}}}" cy="{{{{z.y}}}}" rx="5" ry="3.7" transform="rotate(-20 {{{{z.x}}}} {{{{z.y}}}})" fill="{INK}"></ellipse><path d="{{{{z.stem}}}}" stroke="{INK}" stroke-width="1.1"></path>'
          + gl('z.a1', '♯', 16) + gl('z.a2', '♭', 16) + gl('z.a3', '♮', 16) + gl('z.a4', '𝄪', 16) + gl('z.a5', '𝄫', 16)
          + ''.join(f'<sc-if value="{{{{z.f{d}}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{z.x}}}}" y="{{{{z.fy}}}}" text-anchor="middle" font-size="12" font-weight="700" fill="#5A4C8C">{d}</text></sc-if>' for d in range(1, 6))
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
    const ivs = IV[kind], marks = {}, lo = 48 + root - (root > 6 ? 12 : 0) + 12;
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
    const nN = ivs.length + 1, x0 = 34 + nS * 8 + 22, dx = (350 - x0) / nN, FG = '12312345', fingOk = ra === 0 && rl !== 3 && kind <= 5;
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
SC_PIC = lambda k, w, kh: f'''<sc-if value="{{{{isScale}}}}" hint-placeholder-val="{{{{true}}}}">{CARD(SCALESTAFF('The scale up one octave on the staff') + f'<div style="height: 10px"></div>' + KEYS(kh).replace('kb.', k + '.'), '12px 12px 12px')}</sc-if>
<sc-if value="{{{{isChords}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{chords}}}}" as="c" hint-placeholder-count="7"><button type="button" style="height: 78px; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: {INK}"><span style="font-size: 22px; font-weight: 700">{{{{c.c}}}}</span><span style="font-family: {SERIF}; font-size: 15px; color: {SOFT}">{{{{c.d}}}}</span></button></sc-for></div></sc-if>
<sc-if value="{{{{isKey}}}}" hint-placeholder-val="{{{{false}}}}">{CARD(SCALESTAFF('The key signature'))}{GROUP(('link', 'Relative minor', 'E minor', 'Scales.dc.html'), ('link', 'On the circle', 'Between C and D', 'CircleOfFifths.dc.html'), bg=SHEET)}</sc-if>'''
SC_ROWS = GROUP(('link', 'Tonic', '{{rootL}}', 'openRoot'), ('link', 'Scale', '{{kindL}}', 'openKind'), ('seg', 'Hands', 'handsSeg', 190), ('step', 'Octaves', 'oct', 'octDn', 'octUp'))
SC_SET = (GROUP(('seg', 'Fingering', 'fingSeg', 200), ('link', 'Rhythm', 'Even', ''), ('link', 'Count-in', '1 bar', '')) + CAPS('On the staff') + GROUP(('toggle', 'Tonic and leading note', 'scTlOn', 'scTlT'), ('toggle', 'Tetrachords', 'scTtOn', 'scTtT'))
          + CAPS('Piano') + GROUP(('link', 'On-screen piano', '', 'Settings.dc.html'), ('link', 'MIDI devices', 'Not connected', 'Settings.dc.html')))
SC = SC.replace("chords: deg.map", "fingSeg: seg(['As the scale', 'From the thumb'], st.fing ?? 'As the scale', (l) => set({ fing: l })), chords: deg.map")
KINDLIST = f'<div style="border-radius: 12px; background: {SHEET}; overflow: hidden"><sc-for list="{{{{kinds}}}}" as="k" hint-placeholder-count="9"><button type="button" onClick="{{{{k.pick}}}}" style="width: 100%; height: 48px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {LINE}; padding: 0 16px; display: flex; align-items: center; color: {INK}; font: inherit; font-size: 16px; text-align: left"><span style="flex: 1">{{{{k.k}}}}</span><span style="color: {LINK}; font-weight: 700">{{{{k.mark}}}}</span></button></sc-for></div>'
SC_SHEETS = BSHEET('rootOn', 'Tonic', NOTEPICK) + BSHEET('kindOn', 'Scale', KINDLIST) + BSHEET('setOn', 'Scale settings', SC_SET)
ph = body(TOP('Main.dc.html', 'Scales and keys', GEAR()), SUBJECT('{{name}}', '{{sub}}', 34) + SEGC('tabs') + SC_PIC('kb', 340, 120) + SC_ROWS,
          BTN('Practise this scale', href='Exercise.dc.html', kind='quiet') + PLAYBTN())
lm = lapbody(LTOP('Laptop.dc.html', GEAR()), SUBJECT('{{name}}', '{{sub}}', 44) + f'<div style="width: 420px">{SEGC("tabs")}</div>' + SC_PIC('kbL', 860, 170),
             SC_ROWS + GROUP(('link', 'Practise this scale', 'Hanon and the tempo ladder', 'ExerciseLaptop.dc.html')), BTN('Practise this scale', href='ExerciseLaptop.dc.html', kind='quiet') + PLAYBTN())
SC_POPS = POPOVER('rootOn', 'Tonic', NOTEPICK, 'right: 40px; top: 70px') + POPOVER('kindOn', 'Scale', KINDLIST, 'right: 40px; top: 120px') + POPOVER('setOn', 'Scale settings', SC_SET)
detail('Scales', 'Scales and keys', SC, ph, lm, '', SC_SHEETS, SC_POPS)

# ═════ Intervals (Tenuto's named answers, Perfect Ear's staff and keys; R39 rulings) ═════
IV = js(r'''
    const AB = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];
    const NAMES = ['Perfect unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave'];
    const SONG = { 7: 'Twinkle, Twinkle, Little Star', 5: 'Here Comes the Bride', 4: 'When the Saints', 3: 'Greensleeves', 12: 'Somewhere over the Rainbow', 2: 'Happy Birthday', 9: 'My Bonnie', 1: 'Jaws', 10: 'Star Trek', 11: 'Take On Me', 6: 'The Simpsons', 8: 'The Entertainer', 0: 'Any repeated note' };
    const n = st.n ?? 7, from = st.from ?? 0, way = st.way ?? 'Ascending', lo = 60 + from, hi = lo + n;
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }),
      name: NAMES[n], sub: n + (n === 1 ? ' semitone' : ' semitones') + ' · ' + NN[lo % 12] + ' up to ' + NN[hi % 12], song: SONG[n],
      ivs: AB.map((a, i) => ({ a, s: String(i), bg: i === n ? '#EDC684' : '#FEFDFB', pick: () => set({ n: i }) })),
      kb: calmKeys(57, 81, { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], NN[hi % 12]] }, 370, 120), kbL: calmKeys(53, 84, { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], NN[hi % 12]] }, 840, 170),
      fromL: NN[from], roots: rootGrid(from, (i) => set({ from: i, sheet: null })), waySeg: seg(['Ascending', 'Descending', 'Harmonic'], way, (l) => set({ way: l })), sizeSeg: seg(['Simple', 'Compound'], st.size ?? 'Simple', (l) => set({ size: l })),
      allSeg: seg(['In order', 'Shuffled'], st.all ?? 'In order', (l) => set({ all: l })), speedSeg: seg(['Slow', 'Medium', 'Fast'], st.speed ?? 'Medium', (l) => set({ speed: l })) };''')
IVGRID = f'<div role="radiogroup" aria-label="Interval" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{ivs}}}}" as="i" hint-placeholder-count="13"><button type="button" onClick="{{{{i.pick}}}}" style="height: 50px; border: 0; border-radius: 11px; background: {{{{i.bg}}}}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0"><span style="font-size: 16px; font-weight: 700">{{{{i.a}}}}</span><span style="font-size: 11px; color: {SOFT}">{{{{i.s}}}}</span></button></sc-for></div>'
IV_PIC = lambda k, kh: CARD(KEYS(kh).replace('kb.', k + '.') + f'<div style="display: flex; align-items: center; gap: 10px; margin-top: 12px"><span style="flex: 1; display: flex; flex-direction: column; gap: 1px"><span style="font-size: 13px; color: {SOFT}">Sounds like</span><span style="font-size: 16px; font-weight: 600">{{{{song}}}}</span></span><button type="button" aria-label="Hear it" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAY.replace("22", "16")}</button></div>', '12px')
IV_ROWS = GROUP(('link', 'From', '{{fromL}}', 'openRoot'), ('seg', 'Play as', 'waySeg', 250), ('seg', 'Intervals', 'sizeSeg', 180))
IV_SET = GROUP(('seg', 'Play all', 'allSeg', 190), ('seg', 'Speed', 'speedSeg', 200), ('link', 'All piano settings', '', ''))
ph = body(TOP('Main.dc.html', 'Intervals', GEAR()), SUBJECT('{{name}}', '{{sub}}', 34) + IV_PIC('kb', 120) + IVGRID + IV_ROWS, PLAYBTN())
lm = lapbody(LTOP('Laptop.dc.html', GEAR()), SUBJECT('{{name}}', '{{sub}}', 44) + IV_PIC('kbL', 190) + IVGRID, IV_ROWS, PLAYBTN())
detail('Intervals', 'Intervals', IV, ph, lm, '', BSHEET('rootOn', 'From', ROOTGRID()) + BSHEET('setOn', 'Interval settings', IV_SET), POPOVER('rootOn', 'From', ROOTGRID()) + POPOVER('setOn', 'Interval settings', IV_SET))

# ═════ The libraries: Progressions, Accompaniment, Exercises (one shape) ═════
def Rw(t, s, v, i, c, href, places=(), tags=(), ic=INK):
    return {'t': t, 's': s, 'v': v, 'i': i, 'c': c, 'ic': ic, 'href': href, 'places': list(places), 'tags': list(tags)}
library('Progressions', 'Progressions', {'places': ['All', 'Favourites', 'Recently played', 'Mine'], 'sorts': ['As arranged', 'Name', 'Recently played'], 'favs': ['Axis of Awesome'], 'open': {},
  'filters': [{'name': 'Key', 'opts': [['Major key', 18], ['Minor key', 8]]}],
  'sections': [{'g': 'Pop', 'rows': [Rw('Axis of Awesome', 'I – V – vi – IV', '', 'I V', HONEY, 'Progression.dc.html', ('Recently played',), ('Major key',)), Rw('50s doo-wop', 'I – vi – IV – V', '', 'I vi', HONEY, 'Progression.dc.html', (), ('Major key',)), Rw('Royal Road', 'IV – V – iii – vi', '', 'IV', HONEY, 'Progression.dc.html', (), ('Major key',))]},
               {'g': 'Jazz', 'rows': [Rw('ii–V–I', 'ii7 – V7 – Imaj7', '', 'ii', SKY, 'Progression.dc.html', ('Recently played',), ('Major key',)), Rw('Rhythm changes', 'I – vi – ii – V', '', 'I vi', SKY, 'Progression.dc.html', (), ('Major key',)), Rw('Cycle of dominants', 'I7 – IV7 – ♭VII7 – ♭III7', '', 'V7', SKY, 'Progression.dc.html', (), ('Major key',))]},
               {'g': 'Blues', 'rows': [Rw('12-bar blues', 'I7 – IV7 – I7 – I7 – IV7 – IV7 – I7 – I7 – V7 – IV7 – I7 – V7', '', 'I7', LILAC, 'Progression.dc.html', (), ('Major key',))]},
               {'g': 'Cadences', 'rows': [Rw('Perfect cadence', 'I – IV – V – I', '', 'V I', SAGE, 'Progression.dc.html', (), ('Major key',)), Rw('Plagal cadence', 'I – IV – I', '', 'IV I', SAGE, 'Progression.dc.html', (), ('Major key',))]},
               {'g': 'Classical', 'rows': [Rw('Pachelbel', 'I – V – vi – iii – IV – I – IV – V', '', 'I V', SAGE, 'Progression.dc.html', (), ('Major key',)), Rw('Andalusian cadence', 'i – ♭VII – ♭VI – V', '', 'i', SAGE, 'Progression.dc.html', (), ('Minor key',))]},
               {'g': 'Mine', 'rows': [Rw('Verse of my song', 'I – iii – IV – V', '', 'I', FILL, 'Progression.dc.html', ('Mine',), ('Major key',))]}]},
  back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Name', 't', 2), ('Numerals', 's', 3), ('', 'v', .4)),
  add_items=(('Type numerals or chords', '#'), ('Build from chords', '#'), ('New folder', '#')))
library('Accompaniment', 'Accompaniment', {'places': ['All', 'Favourites', 'Recently used', 'Mine'], 'sorts': ['As arranged', 'Name', 'Level'], 'favs': ['Broken chords'], 'open': {'Called to Play, level 2': False, '400 Piano Chord Progressions': False, 'Classical': False, 'Rhythm styles': False},
  'filters': [{'name': 'Level', 'opts': [['Level 1', 9], ['Level 2', 6], ['Level 3', 4]]}, {'name': 'Texture', 'opts': [['Block', 5], ['Broken', 7], ['Arpeggio', 4]]}, {'name': 'Feel', 'opts': [['Straight', 12], ['Swing', 3], ['Waltz', 2]]}],
  'sections': [{'g': 'Recently used', 'rows': [Rw('Bass + chords', 'Left: octave held · Right: chord on each beat', 'Level 1', '♩♩', LILAC, 'Pattern.dc.html', ('Recently used',), ('Level 1', 'Block', 'Straight')), Rw('Broken chords', 'Right hand rocks in 8ths', 'Level 1', '♫', LILAC, 'Pattern.dc.html', ('Recently used',), ('Level 1', 'Broken', 'Straight'))]},
               {'g': 'Called to Play', 'rows': [Rw('Waltz', 'Left: root on 1 · Right: chord on 2 and 3', 'Level 1', '♩♪', LILAC, 'Pattern.dc.html', (), ('Level 1', 'Block', 'Waltz')), Rw('Arpeggio 1–5–8', 'One arpeggio through both hands', 'Level 2', '♬', LILAC, 'Pattern.dc.html', (), ('Level 2', 'Arpeggio', 'Straight'))]},
               {'g': 'Called to Play, level 2', 'rows': [Rw('Runs down to the root', 'The 2nd and 5th, then 3–2–1', 'Level 3', '♬', LILAC, 'Pattern.dc.html', (), ('Level 3', 'Broken', 'Straight'))]},
               {'g': '400 Piano Chord Progressions', 'rows': [Rw('Broken chord, 6/8', 'Left: dotted half · Right: eighths', 'Level 2', '♫', LILAC, 'Pattern.dc.html', (), ('Level 2', 'Broken', 'Straight')), Rw('Afterbeats, 6/8', 'Left: on the beat · Right: on the afterbeat', 'Level 2', '♪♩', LILAC, 'Pattern.dc.html', (), ('Level 2', 'Block', 'Straight')), Rw('Bass and chord, 4/4', 'Left: half note · Right: quarter, half', 'Level 1', '♩♩', LILAC, 'Pattern.dc.html', (), ('Level 1', 'Block', 'Straight'))]},
               {'g': 'Classical', 'rows': [Rw('Alberti bass', 'Left: root, 5th, 3rd, 5th', 'Level 2', '♬', LILAC, 'Pattern.dc.html', (), ('Level 2', 'Broken', 'Straight'))]},
               {'g': 'Rhythm styles', 'rows': [Rw('Ballad', 'Root and 5th, chords on 2 and 4', 'Level 1', '♩', LILAC, 'Pattern.dc.html', (), ('Level 1', 'Block', 'Straight')), Rw('Swing comping', 'Short chords off the beat', 'Level 3', '♪', LILAC, 'Pattern.dc.html', (), ('Level 3', 'Block', 'Swing'))]}]},
  back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Pattern', 't', 2), ('Hands', 's', 3.4), ('Level', 'v', .8)),
  add_items=(('New pattern', 'PatternNew.dc.html'), ('New folder', '#')))
library('FingerTechnique', 'Finger technique', {'places': ['All', 'Favourites', 'Recently used', 'Mine'], 'sorts': ['As arranged', 'Name', 'Level'], 'favs': ['Hanon'], 'open': {},
  'filters': [{'name': 'Level', 'opts': [['Beginner', 1], ['Intermediate', 1]]}],
  'sections': [{'g': 'The Virtuoso Pianist', 'rows': [Rw('Hanon', 'Nos. 1 to 20', 'Intermediate', '1–20', SAGE, 'Exercise.dc.html', ('Recently used',), ('Intermediate',))]},
               {'g': 'Five-finger position', 'rows': [Rw('Five-finger position', "A key's first five notes, up and down", 'Beginner', '1–5', SAGE, 'Exercise.dc.html', (), ('Beginner',))]}]},
  back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Exercise', 't', 2), ('', 's', 3), ('Level', 'v', 1)), add_items=(('New exercise', '#'), ('New folder', '#')))
library('JazzVocabulary', 'Jazz vocabulary', {'places': ['All', 'Favourites', 'Recently used', 'Mine'], 'sorts': ['As arranged', 'Name', 'Level'], 'favs': [], 'open': {},
  'filters': [{'name': 'Level', 'opts': [['Beginner', 1], ['Advanced', 1], ['Professional', 2]]}],
  'sections': [{'g': 'Barry Harris', 'rows': [Rw('6th-diminished scale', 'Eight notes to the octave', 'Advanced', '6°', SKY, 'Exercise.dc.html', (), ('Advanced',)), Rw('Drop-2 7ths', "The key's 7th chords up and down", 'Professional', 'D2', SKY, 'Exercise.dc.html', (), ('Professional',))]},
               {'g': 'Piano With Jonny', 'rows': [Rw('2-5-1 scale', 'Swung 8ths over a ii–V–I', 'Beginner', '251', SKY, 'Exercise.dc.html', (), ('Beginner',)), Rw('Rapid switch', 'One line through all twelve keys', 'Professional', '12', SKY, 'Exercise.dc.html', (), ('Professional',))]}]},
  back='Main.dc.html', back_l='Laptop.dc.html', table_cols=(('Exercise', 't', 2), ('', 's', 3), ('Level', 'v', 1)), add_items=(('New exercise', '#'), ('New folder', '#')))

# ═════ A progression (Hooktheory: the chords coloured by function, the moves drawn) ═════
PR = js(r'''
// switches by key: k → kOn, kOnBg, kOnX, kT; segs by key: [key, options, default] → keySeg
const SW = (st, set, keys) => Object.fromEntries(keys.flatMap(([k, d]) => { const on = st[k] ?? d; return [[k + 'On', on], [k + 'OnBg', on ? '#44684A' : '#DAD1C8'], [k + 'OnX', on ? 22 : 2], [k + 'T', () => set({ [k]: !on })]]; }));
const SG = (st, set, list) => Object.fromEntries(list.map(([k, opts, d]) => [k + 'Seg', seg(opts, st[k] ?? d, (l) => set({ [k]: l }))]));
    const P = ['I', 'V', 'vi', 'IV'], DEG = { I: 0, ii: 2, iii: 4, IV: 5, V: 7, vi: 9 };
    const FN = { I: ['Tonic', '#F3D2C8'], vi: ['Tonic', '#F3D2C8'], iii: ['Tonic', '#F3D2C8'], IV: ['Predominant', '#D3E5F2'], ii: ['Predominant', '#D3E5F2'], V: ['Dominant', '#DCE9D6'] };
    const MOVE = ['5th up', '2nd up', '3rd down', '4th down'];
    const key = st.key ?? 0, at = st.at ?? 1, loop = st.loop ?? true;
    const ch = (n) => NN[(key + DEG[n]) % 12] + (n === n.toLowerCase() ? 'm' : '');
    const cur = P[at], r = (key + DEG[cur]) % 12, minor = cur === cur.toLowerCase(), marks = {};
    const KC = { Tonic: '#E3A08E', Predominant: '#85B8DC', Dominant: '#8DBB86' }[FN[cur][0]];
    [0, minor ? 3 : 4, 7].forEach((iv) => { marks[60 + ((r + iv) % 12)] = [KC, NN[(r + iv) % 12]]; }); marks[48 + r] = [KC, NN[r]];
    return { ...common(st, set), ...SG(st, set, [['prW', ['Numerals', 'Nashville', 'Chords'], 'Numerals'], ['prI', ['Root', '1st', '2nd'], 'Root']]), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }),
      tiles: P.map((n, i) => ({ n, c: ch(n), bg: FN[n][1], ring: i === at ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8', move: MOVE[i], pick: () => set({ at: i }) })),
      keyL: NN[key] + ' major', roots: rootGrid(key, (i) => set({ key: i, sheet: null })), voiceSeg: seg(['Voice-led', 'Block'], st.voice ?? 'Voice-led', (l) => set({ voice: l })),
      bpm: (st.bpm ?? 96) + ' BPM', bpmDn: () => set({ bpm: (st.bpm ?? 96) - 4 }), bpmUp: () => set({ bpm: (st.bpm ?? 96) + 4 }),
      kb: calmKeys(48, 76, marks, 370, 110), kbL: calmKeys(41, 84, marks, 860, 160), loop, loopBg: loop ? '#332921' : '#EEE9E2', loopFg: loop ? '#FEFDFB' : '#332921', toggleLoop: () => set({ loop: !loop }) };''')
TILES = (f'<div style="display: flex; align-items: stretch; gap: 0"><sc-for list="{{{{tiles}}}}" as="t" hint-placeholder-count="4"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 6px"><button type="button" onClick="{{{{t.pick}}}}" style="width: calc(100% - 8px); height: 96px; border: 0; border-radius: 14px; background: {{{{t.bg}}}}; box-shadow: {{{{t.ring}}}}; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-family: {SERIF}; font-size: 26px">{{{{t.n}}}}</span><span style="font-size: 15px; font-weight: 700">{{{{t.c}}}}</span></button><span style="font-size: 12px; color: {SOFT}; height: 14px">{{{{t.move}}}} →</span></div></sc-for></div>'
         f'<div style="display: flex; gap: 14px; font-size: 13px; color: {SOFT}">' + ''.join(f'<span style="display: flex; align-items: center; gap: 6px"><span style="width: 10px; height: 10px; border-radius: 5px; background: {c}; box-shadow: 0 0 0 1px {LINE}"></span>{l}</span>' for l, c in (('Tonic', PEACH), ('Predominant', SKY), ('Dominant', SAGE))) + '</div>')
PR_ROWS = GROUP(('link', 'Key', '{{keyL}}', 'openRoot'), ('seg', 'Voicing', 'voiceSeg', 200), ('step', 'Tempo', 'bpm', 'bpmDn', 'bpmUp'))
LOOPB = f'<button type="button" aria-pressed="{{{{loop}}}}" onClick="{{{{toggleLoop}}}}" style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {{{{loopBg}}}}; color: {{{{loopFg}}}}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px">{LOOP.replace("20", "18")} Loop</button>'
PR_MORE = GROUP(('link', 'Edit the progression', 'Editors', 'ProgressionEdit.dc.html'), ('link', 'Edit a copy', '', ''), ('link', 'Open in the Chord player', '', 'ChordPlayer.dc.html'), ('link', 'Songs with it', 'Let It Be, and 11 more', 'Songs.dc.html'))
PR_SET = GROUP(('seg', 'Written as', 'prWSeg', 200), ('seg', 'First chord’s inversion', 'prISeg', 200), ('link', 'All piano settings', '', 'Settings.dc.html'))
ph = body(TOP('Progressions.dc.html', 'Progression', GEAR() + DOTS()), SUBJECT('Axis of Awesome', 'Pop · in {{keyL}}', 34) + TILES + KEYS(110) + PR_ROWS, LOOPB + BTN('Practise', href='PlayProgression.dc.html', kind='quiet', h=44) + PLAYBTN())
lm = lapbody(LTOP('ProgressionsLaptop.dc.html', GEAR() + DOTS()), SUBJECT('Axis of Awesome', 'Pop · in {{keyL}}', 44) + TILES.replace('height: 96px', 'height: 150px').replace('font-size: 26px', 'font-size: 40px') + KEYS(160).replace('kb.', 'kbL.'), PR_ROWS + GROUP(('link', 'Practise in the Player', '', 'PlayProgressionLaptop.dc.html'), ('link', 'Open in the Chord player', '', 'ChordPlayerLaptop.dc.html')), LOOPB + SPACER + PLAYBTN())
detail('Progression', 'A progression', PR, ph, lm, '', BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('moreOn', 'Axis of Awesome', PR_MORE) + BSHEET('setOn', 'Progression settings', PR_SET),
       POPOVER('rootOn', 'Key', ROOTGRID()) + POPOVER('moreOn', 'Axis of Awesome', PR_MORE.replace('ProgressionEdit.dc.html', 'ProgressionEditLaptop.dc.html').replace('ChordPlayer.dc.html', 'ChordPlayerLaptop.dc.html').replace('Songs.dc.html', 'SongsLaptop.dc.html')) + POPOVER('setOn', 'Progression settings', PR_SET))

# ═════ Chord player (iReal Pro: the chart fills the page, the player bar at the foot) ═════
CP = js(r'''
// switches by key: k → kOn, kOnBg, kOnX, kT; segs by key: [key, options, default] → keySeg
const SW = (st, set, keys) => Object.fromEntries(keys.flatMap(([k, d]) => { const on = st[k] ?? d; return [[k + 'On', on], [k + 'OnBg', on ? '#44684A' : '#DAD1C8'], [k + 'OnX', on ? 22 : 2], [k + 'T', () => set({ [k]: !on })]]; }));
const SG = (st, set, list) => Object.fromEntries(list.map(([k, opts, d]) => [k + 'Seg', seg(opts, st[k] ?? d, (l) => set({ [k]: l }))]));
    const SECS = [['A', 'Verse', 2, [['C'], ['G'], ['Am'], ['F'], ['C'], ['G'], ['F', 'G'], ['C']]], ['B', 'Chorus', 1, [['F'], ['G'], ['C', 'C/E'], ['F', 'G7'], ['Am'], ['F'], ['G7'], ['C']]], ['C', 'Bridge', 1, [['Dm7'], ['G7'], ['Em7', 'A7'], ['Dm7', 'G7']]]];
    const play = st.playing ? (st.at ?? [0, 2]) : [-1, -1], STY = ['Pop 1', 'Pop ballad', 'Rock 8ths', 'Worship', 'Swing', 'Bossa nova'], s = st.style ?? 0, bpm = st.bpm ?? 96;
    const secs = SECS.map(([m, name, rep, bars], si) => ({ m, name, rep: '× ' + rep, bars: bars.map((cs, bi) => ({ cs: cs.map((c) => ({ c })), bg: play[0] === si && play[1] === bi ? '#EDC684' : !st.playing && slot.si === si && slot.bi === bi ? '#F6E7C8' : 'transparent', edge: bi % 4 === 3 ? '0' : '1px', pick: () => set({ sheet: 'chord', sel: [si, bi] }) })) }));
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), chordOn: st.sheet === 'chord', styleOn: st.sheet === 'style', openStyle: () => set({ sheet: 'style' }), secs,
      styleL: STY[s], bpmL: String(bpm), wStyle: wheel(STY, s, (i) => set({ style: i })), wRoot: wheel(NN, 0, () => {}), wQual: wheel(['', 'm', '7', 'maj7', 'm7', 'sus4', 'dim'], 0, () => {}), wLen: wheel(['1 beat', '2 beats', '3 beats', '4 beats'], 3, () => {}),
      keyTiles: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°', 'G7'].map((c) => ({ c })) };''')
CHART = (f'<div style="border-radius: 6px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 10px 24px -18px rgba(51,41,33,.45); padding: 16px 14px 18px; display: flex; flex-direction: column; gap: 16px">'
         f'<div style="text-align: center; font-family: {SERIF}; font-size: 20px">My verse and chorus</div>'
         f'<sc-for list="{{{{secs}}}}" as="x" hint-placeholder-count="2"><section style="display: flex; flex-direction: column; gap: 4px"><div style="display: flex; align-items: center; gap: 8px"><span style="width: 22px; height: 22px; box-sizing: border-box; border: 1.5px solid {INK}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">{{{{x.m}}}}</span><span style="font-size: 14px; font-weight: 600">{{{{x.name}}}}</span>{SPACER}<span style="font-size: 13px; color: {SOFT}">{{{{x.rep}}}}</span><span style="display: flex; color: {SOFT}">{GRIP}</span></div>'
         f'<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-left: 2px solid {INK}; border-right: 2px solid {INK}"><sc-for list="{{{{x.bars}}}}" as="b" hint-placeholder-count="8"><button type="button" onClick="{{{{b.pick}}}}" style="height: {{{{CH}}}}px; border: 0; border-right: {{{{b.edge}}}} solid {INK}; background: {{{{b.bg}}}}; padding: 0 6px; display: flex; align-items: center; justify-content: space-around; color: {INK}; font-family: {SERIF}; font-size: {{{{CF}}}}px; font-weight: 700"><sc-for list="{{{{b.cs}}}}" as="c" hint-placeholder-count="1"><span>{{{{c.c}}}}</span></sc-for></button></sc-for></div></section></sc-for>'
         f'<button type="button" style="align-self: flex-start; height: 44px; padding: 0 8px; margin: -4px 0 -4px -8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">+ Add section</button></div>')
def PBTN(label, val, act):
    return f'<button type="button" onClick="{{{{{act}}}}}" style="flex: 1; min-width: 0; height: 52px; border: 0; border-radius: 14px; background: transparent; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; font: inherit"><span style="font-size: 11px; color: {SOFT}">{label}</span><span style="font-size: 16px; font-weight: 700; white-space: nowrap">{val}</span></button>'
CP_DOCK = PBTN('Style', '{{styleL}}', 'openStyle') + PBTN('Key', 'C', 'openStyle') + PBTN('Tempo', '{{bpmL}}', 'openStyle') + PBTN('Repeats', '× 3', 'openStyle') + PLAYBTN()
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
    const sel = st.sel, slot = st.playing ? SLOTS[(st.pos ?? 4) % SLOTS.length] : (sel ? SLOTS.find((x) => x.si === sel[0] && x.bi === sel[1]) : SLOTS[0]);
    const notes = parse(slot.c), all = SLOTS.flatMap((x) => parse(x.c).map((n) => n.m));
    const isW = (m) => [0, 2, 4, 5, 7, 9, 11].includes(m % 12), dn = (m) => { while (!isW(m)) m--; return m; }, up = (m) => { while (!isW(m)) m++; return m; };
    const [lo, hi] = kbRange === '4' ? [36, 83] : kbRange === '88' ? [21, 108] : [dn(Math.min(...all)), up(Math.max(...all))];
    const labOf = (n) => kbLabel === 'names' ? NM[n.m % 12] : kbLabel === 'degrees' ? DEG[n.m % 12] : kbLabel === 'intervals' ? ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♯5', '6', '♭7', '7'][n.iv] : '';
    const lit = new Map(notes.map((n) => [n.m, n]));
    const nW = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter(isW).length, kw = 100 / nW;
    let wi = 0; const whites = [], blacks = [];
    for (let m = lo; m <= hi; m++) { const n = lit.get(m), l = n ? labOf(n) : '';
      if (isW(m)) { whites.push({ left: (wi * kw).toFixed(3) + '%', w: kw.toFixed(3) + '%', bg: n ? ROLEC[n.role] : '#FEFDFB', l: nW <= 30 ? l : '' }); wi++; }
      else blacks.push({ left: (wi * kw - kw * 0.3).toFixed(3) + '%', w: (kw * 0.6).toFixed(3) + '%', bg: n ? ROLEC[n.role] : '#332C28', l: nW <= 22 ? l : '' }); }
    const is3d = kbOnS && kbView !== '2d';
    this._handsIn = !is3d ? null : { notes: kbHands ? notes.map((n) => ({ midi: n.m, spelled: {}, hand: n.hand, finger: undefined, startTick: 0, durationTicks: 1920, velocity: 80 })) : [],
      perSecond: 960, now: () => 1, playing: false, held: new Set(notes.map((n) => n.m)), marks: new Map(notes.map((n) => [n.m, { tone: ROLEN[n.role] }])), wrong: undefined, faded: null, skin: 'light', range: { low: lo, high: hi } };
    this._labels3d = is3d && kbLabel !== 'none' ? notes.map((n) => ({ m: n.m, black: !isW(n.m), t: labOf(n), c: ROLEC[n.role] })) : [];
    const SEGP = ''' + PS.SEG_JS + r''';
    const strip = (() => { const W = 340, w = W / 52; let i = 0, x0 = null, x1 = 0, bl = '';
      for (let m = 21; m <= 108; m++) { if (isW(m)) { if (m >= lo && x0 === null) x0 = i * w; if (m <= hi) x1 = (i + 1) * w; i++; } else bl += 'M' + (i * w - w * 0.3).toFixed(2) + ' 0h' + (w * 0.6).toFixed(2) + 'v15h-' + (w * 0.6).toFixed(2) + 'z'; }
      const nm = (m) => NM[m % 12] + (Math.floor(m / 12) - 1); return { x: x0.toFixed(2), w: (x1 - x0).toFixed(2), bl, cap: nm(lo) + ' – ' + nm(hi) }; })();
    const cpPiano = { cpKb: kbOnS, cpKb2: kbOnS && kbView === '2d', cpKb3: is3d, cpPad: kbOnS ? 16 : 118, kbw: whites, kbb: blacks, nowChord: slot.c,
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
          f'<sc-for list="{{{{kbb}}}}" as="k" hint-placeholder-count="13"><span style="position: absolute; top: 0; height: 60%; left: {{{{k.left}}}}; width: {{{{k.w}}}}; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 4px; box-sizing: border-box; font-size: 10px; font-weight: 700; color: {INK}">{{{{k.l}}}}</span></sc-for></div></sc-if>')
    k3 = (f'<sc-if value="{{{{cpKb3}}}}" hint-placeholder-val="{{{{false}}}}"><figure aria-label="The hands at the keys, playing {{{{nowChord}}}}" style="position: relative; margin: 0; height: {h}px; overflow: hidden; background: #EDE6DC; {PS.STAGE_VARS}">'
          f'<canvas ref="{{{{handsRef}}}}" style="display: block; width: 100%; height: 100%"></canvas><div ref="{{{{labelsRef}}}}" aria-hidden="true" style="position: absolute; inset: 0; pointer-events: none"></div></figure></sc-if>')
    return k2 + k3
CP_SET = (CAPS('Instruments') + GROUP(('toggle', 'Piano', 'cpPiOn', 'cpPiT'), ('toggle', 'Bass', 'cpBaOn', 'cpBaT'), ('toggle', 'Drums', 'cpDrOn', 'cpDrT'))
          + CAPS('Playing') + GROUP(('link', 'Count-in', '1 bar', ''), ('toggle', 'Repeat the sheet', 'cpRepOn', 'cpRepT'), ('link', 'Volume', '80%', ''))
          + CAPS('Music') + GROUP(('link', 'Time signature', '4/4', ''), ('link', 'Transpose', 'C → C', ''), ('seg', 'Written as', 'namesSeg', 200), ('seg', 'Voicing', 'cpVSeg', 200))
          + GROUP(('link', 'On-screen piano', '{{pianoVal}}', 'openPiano'), ('link', 'Connect a piano', 'Not connected', 'Settings.dc.html')))
_BACKP = f'<button type="button" aria-label="Back to Chord player settings" onClick="{{{{backSet}}}}" style="position: absolute; left: -8px; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L}</button>'
_PBODY = PS.PIANO_SHEET(False, 3, 4)
CP_PSHEET = BSHEET('pianoOn', 'Piano', _PBODY).replace('max-height: 86%', 'max-height: calc(100% - 124px)', 1).replace('<span style="font-size: 17px; font-weight: 600">Piano</span>', _BACKP + '<span style="font-size: 17px; font-weight: 600">Piano</span>', 1)
CP_PPOP = POPOVER('pianoOn', 'Piano', _PBODY, 'right: 40px; top: 64px', 400).replace('<span style="font-size: 17px; font-weight: 600">Piano</span>', f'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 44px">{_BACKP}<span style="font-size: 17px; font-weight: 600">Piano</span></div>', 1)

CP = CP.replace("    const play = st.playing ? (st.at ?? [0, 2])", CP_PIANO_JS + "    const play = st.playing ? [slot.si, slot.bi]", 1).replace("styleOn: st.sheet === 'style',", "styleOn: st.sheet === 'style', ...cpPiano,", 1)
CP = 'const PT_BUNDLE = ' + json.dumps(PT_BUNDLE_CP) + ';\n' + CP.replace('class Component extends DCLogic {\n', 'class Component extends DCLogic {' + CP_LIFE, 1)
CP = CP.replace("keyTiles:", "namesSeg: seg(['Chords', 'Numerals', 'Nashville'], st.names ?? 'Chords', (l) => set({ names: l })), ...SW(st, set, [['cpPi', true], ['cpBa', true], ['cpDr', true], ['cpRep', true]]), ...SG(st, set, [['cpV', ['Smooth voice leading', 'Block chords'], 'Smooth voice leading']]), keyTiles:")
UNDOB = IB('Undo', UNDO)
ph = (body(TOP('Main.dc.html', 'Chord player', UNDOB + GEAR() + DOTS()), CHART.replace('{{CH}}', '50').replace('{{CF}}', '17'), CP_DOCK, 118).replace('padding: 4px 16px 118px', 'padding: 4px 16px {{cpPad}}px', 1)
      .replace('</main>', '</main><sc-if value="{{cpKb}}" hint-placeholder-val="{{true}}"><div style="flex: none; margin-bottom: 110px; box-shadow: 0 -1px 0 ' + LINE + '">' + CP_KEYS(112) + '</div></sc-if>', 1))
DRAG = f'{H2("C major chords")}<p style="margin: -8px 4px 0; font-size: 14px; color: {SOFT}">Drag one into a bar.</p><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{keyTiles}}}}" as="k" hint-placeholder-count="8"><span draggable="true" style="height: 56px; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 20px; font-weight: 700; cursor: grab">{{{{k.c}}}}</span></sc-for></div>'
lm = lapbody(LTOP('Laptop.dc.html', UNDOB + GEAR() + DOTS(), 'Chord player'), f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto">{CHART.replace("{{CH}}", "64").replace("{{CF}}", "22")}</div>' + '<sc-if value="{{cpKb}}" hint-placeholder-val="{{true}}"><div style="flex: none; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px ' + LINE + '">' + CP_KEYS(160) + '</div></sc-if>', DRAG + H2('Style') + WHEEL([('wStyle', 1)]), CP_DOCK)
CP_MORE = GROUP(('link', 'Chord sheets', '', ''), ('link', 'Save as my chord sheet', '', ''), ('link', 'Open in Progressions', '', 'Progressions.dc.html'), ('link', 'Share link', '', ''))
detail('ChordPlayer', 'Chord player', CP, ph, lm, '', BSHEET('chordOn', 'Bar 3', CP_CHORD) + BSHEET('styleOn', 'Style', WHEEL([('wStyle', 1)])) + BSHEET('setOn', 'Chord player settings', CP_SET) + CP_PSHEET + BSHEET('moreOn', 'Chord sheet', CP_MORE),
       POPOVER('chordOn', 'Bar 3', CP_CHORD, 'left: 140px; top: 220px', 440) + POPOVER('styleOn', 'Style', WHEEL([('wStyle', 1)]), 'left: 200px; bottom: 110px') + POPOVER('setOn', 'Chord player settings', CP_SET) + CP_PPOP + POPOVER('moreOn', 'Chord sheet', CP_MORE.replace('Progressions.dc.html', 'ProgressionsLaptop.dc.html')))

# ═════ An exercise (Hanon Pro: the page, Listen, a metronome and a target tempo) ═════
_h = open('/home/user/piano-trainer/.scratch/r39/canvas/calm.py').read(); exec('def hanon' + _h.split('def hanon')[1].split('EX_STAGE =')[0])
EX = js(r'''
    const no = st.no ?? 1, key = st.key ?? 0, bpm = st.bpm ?? 60, target = 108;
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), rootOn: st.sheet === 'root', openRoot: () => set({ sheet: 'root' }),
      noL: 'No. ' + no, noDn: () => set({ no: Math.max(1, no - 1) }), noUp: () => set({ no: Math.min(20, no + 1) }), keyL: NN[key] + ' major', roots: rootGrid(key, (i) => set({ key: i, sheet: null })),
      handsSeg: seg(['Left', 'Both', 'Right'], st.hands ?? 'Both', (l) => set({ hands: l })), rhythmSeg: seg(['Even', 'Dotted', 'Reverse dotted'], st.rhythm ?? 'Even', (l) => set({ rhythm: l })),
      bpmL: bpm + ' BPM', bpmDn: () => set({ bpm: bpm - 4 }), bpmUp: () => set({ bpm: bpm + 4 }), pctW: Math.min(100, Math.round(bpm / target * 100)) + '%', ladder: bpm + ' of ' + target + ' BPM',
      fav: st.fav ?? true, heartFill: (st.fav ?? true) ? '#B84A3E' : 'none', heartStroke: (st.fav ?? true) ? '#B84A3E' : '#332921', toggleFav: () => set({ fav: !(st.fav ?? true) }) };''')
LADDER = f'<div style="display: flex; flex-direction: column; gap: 6px; padding: 10px 16px 12px"><div style="display: flex; justify-content: space-between; font-size: 14px"><span>Tempo ladder</span><span style="color: {SOFT}">{{{{ladder}}}}</span></div><div style="height: 6px; border-radius: 3px; background: {SHEET}"><div style="width: {{{{pctW}}}}; height: 6px; border-radius: 3px; background: #44684A"></div></div></div>'
EX_ROWS = GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('link', 'Key', '{{keyL}}', 'openRoot'), ('seg', 'Hands', 'handsSeg', 190), ('seg', 'Rhythm', 'rhythmSeg', 262), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('raw', LADDER))
EX_PIC = lambda w: CARD(hanon(w) + hanon(w).replace('bars 1 and 2', 'bars 3 and 4') + f'<div style="display: flex; justify-content: space-between; font-size: 13px; color: {SOFT}; margin-top: 6px"><span>Bars 1–4 of 28</span><span>The left hand an octave lower</span></div>', '12px')
EX_SET = GROUP(('link', 'Count-in', '1 bar', ''), ('link', 'Wait for the right note', 'On', ''), ('link', 'Next key', 'Circle of fifths', ''), ('link', 'All piano settings', '', ''))
ph = body(TOP('FingerTechnique.dc.html', 'Hanon', HEARTB + GEAR()), SUBJECT('Hanon No. 1', 'The Virtuoso Pianist · finger technique', 32) + EX_PIC(340) + EX_ROWS, BTN(SPEAKER + ' Listen', kind='quiet', grow=False) + BTN(PLAY.replace('22', '18') + ' Start', href='PlayExercise.dc.html'))
lm = lapbody(LTOP('FingerTechniqueLaptop.dc.html', HEARTB + GEAR()), SUBJECT('Hanon No. 1', 'The Virtuoso Pianist · finger technique', 44) + EX_PIC(880), EX_ROWS, BTN(SPEAKER + ' Listen', kind='quiet', grow=False) + BTN(PLAY.replace('22', '18') + ' Start', href='PlayExerciseLaptop.dc.html'))
detail('Exercise', 'An exercise', EX, ph, lm, '', BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('setOn', 'Exercise settings', EX_SET), POPOVER('rootOn', 'Key', ROOTGRID()) + POPOVER('setOn', 'Exercise settings', EX_SET))

# ═════ Metronome (Soundbrenner's accents, the ruling's −10 −1 +1 +10, one Start) ═════
ME = js(r'''
    const MARK = [[60, 'Largo'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [168, 'Allegro'], [999, 'Presto']];
    const bpm = st.bpm ?? 120, meter = st.meter ?? 4, lv = st.lv || ['accent', 'beat', 'beat', 'beat'], cyc = { accent: 'beat', beat: 'silent', silent: 'accent' }, H = { accent: 100, beat: 58, silent: 0 };
    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), subOn: st.sheet === 'sub', openSub: () => set({ sheet: 'sub' }),
      bpm: String(bpm), mark: MARK.find(([t]) => bpm < t)[1], pos: ((bpm - 20) / 280 * 100).toFixed(1) + '%',
      d10: () => set({ bpm: bpm - 10 }), d1: () => set({ bpm: bpm - 1 }), u1: () => set({ bpm: bpm + 1 }), u10: () => set({ bpm: bpm + 10 }),
      beats: Array.from({ length: meter }, (_, i) => { const l = lv[i] || 'beat'; return { n: i + 1, h: H[l] + '%', bg: l === 'accent' ? '#332921' : '#A49A90', ring: st.playing && i === 0 ? '0 0 0 3px #EDC684' : '0 0 0 1px #DAD1C8', pick: () => set({ lv: Array.from({ length: meter }, (_, j) => j === i ? cyc[l] : (lv[j] || 'beat')) }) }; }),
      meterL: meter + '/4', mDn: () => set({ meter: Math.max(1, meter - 1) }), mUp: () => set({ meter: Math.min(12, meter + 1) }), subL: st.sub ?? 'None',
      subs: ['None', 'Eighths', 'Triplets', 'Sixteenths', 'Swung eighths'].map((s) => ({ k: s, mark: (st.sub ?? 'None') === s ? '✓' : '', pick: () => set({ sub: s, sheet: null }) })), startL: st.playing ? 'Stop' : 'Start' };''')
NUDGE = lambda l, a: f'<button type="button" onClick="{{{{{a}}}}}" style="width: 52px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">{l}</button>'
TEMPO = lambda big: (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 2px"><span style="font-size: 15px; color: {SOFT}">{{{{mark}}}} · BPM</span><div style="display: flex; align-items: center; gap: 8px">{NUDGE("−10", "d10")}{NUDGE("−1", "d1")}<span style="min-width: {big * 1.9:.0f}px; text-align: center; font-size: {big}px; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums">{{{{bpm}}}}</span>{NUDGE("+1", "u1")}{NUDGE("+10", "u10")}</div></div>'
                     f'<div role="slider" aria-label="Tempo" style="position: relative; height: 28px; display: flex; align-items: center"><div style="width: 100%; height: 4px; border-radius: 2px; background: {LINE}"></div><div style="position: absolute; left: 0; width: {{{{pos}}}}; height: 4px; border-radius: 2px; background: {INK}"></div><span style="position: absolute; left: calc({{{{pos}}}} - 14px); width: 28px; height: 28px; border-radius: 14px; background: {SHEET}; box-shadow: 0 1px 4px rgba(51,41,33,.3)"></span></div>')
BEATS = lambda h: f'<div role="group" aria-label="Beats: tap one for accent, normal or silent" style="display: flex; gap: 8px; height: {h}px"><sc-for list="{{{{beats}}}}" as="b" hint-placeholder-count="4"><button type="button" aria-label="Beat {{{{b.n}}}}" onClick="{{{{b.pick}}}}" style="position: relative; flex: 1; min-width: 0; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: {{{{b.ring}}}}; overflow: hidden; padding: 0"><span style="position: absolute; left: 0; right: 0; bottom: 0; height: {{{{b.h}}}}; background: {{{{b.bg}}}}"></span><span style="position: absolute; left: 8px; top: 6px; font-size: 12px; color: {SOFT}">{{{{b.n}}}}</span></button></sc-for></div>'
ME_ROWS = GROUP(('step', 'Time signature', 'meterL', 'mDn', 'mUp'), ('link', 'Subdivision', '{{subL}}', 'openSub'), ('link', 'Sound', 'Woodblock', ''), ('link', 'Speed trainer', 'Off', ''), ('link', 'Silent bars', 'Off', ''))
SUBLIST = f'<div style="border-radius: 12px; background: {SHEET}; overflow: hidden"><sc-for list="{{{{subs}}}}" as="k" hint-placeholder-count="5"><button type="button" onClick="{{{{k.pick}}}}" style="width: 100%; height: 48px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {LINE}; padding: 0 16px; display: flex; align-items: center; color: {INK}; font: inherit; font-size: 16px; text-align: left"><span style="flex: 1">{{{{k.k}}}}</span><span style="color: {LINK}; font-weight: 700">{{{{k.mark}}}}</span></button></sc-for></div>'
ME_SET = GROUP(('link', 'Flash on the beat', 'Off', ''), ('link', 'Count-in', '1 bar', ''), ('link', 'Volume', '80%', ''))
STARTB = f'<button type="button" onClick="{{{{togglePlay}}}}" style="flex: 1; height: 52px; border: 0; border-radius: 26px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 17px; font-weight: 700">{{{{startL}}}}</button>'
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
MICOFF = f'<sc-if value="{{{{micOff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="padding: 40px 16px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center"><span style="font-size: 17px; color: {SOFT}">Play a note and the tuner shows how far it is from in tune. It needs the microphone.</span>{BTN("Allow the microphone", "allow", grow=False)}</div></sc-if>'
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
    return { ...common(st, set), ...SW(st, set, [['cfSl', true], ['cfK', true], ['cfSc', false], ['cfH', true]]), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), empty, found: !empty, name: empty ? 'Play a chord' : 'Cmaj7/E', sub: empty ? 'Hold three or more keys, here or on your piano' : 'C major 7th, 1st inversion · Imaj7 in C major',
      notes: [['E', '3rd · bass'], ['C', 'root'], ['G', '5th'], ['B', '7th']].map(([n, d]) => ({ n, d })), alts: ['Em(♭6)', 'G6/E (no 3rd)'].map((a) => ({ a })), played: ['G7', 'Am7', 'Dm7'].map((p) => ({ p })),
      kb: calmKeys(48, 76, marks, 370, 170), kbL: calmKeys(36, 84, marks, 860, 200), clear: () => set({ held: [] }) };''')
CHIPL = lambda lst, k: f'<div style="display: flex; flex-wrap: wrap; gap: 6px"><sc-for list="{{{{{lst}}}}}" as="x" hint-placeholder-count="2"><span style="height: 32px; padding: 0 12px; border-radius: 16px; background: {FILL}; display: flex; align-items: center; font-size: 15px; font-weight: 600">{{{{x.{k}}}}}</span></sc-for></div>'
CF_NOTES = f'<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{notes}}}}" as="n" hint-placeholder-count="4"><span style="height: 64px; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center"><span style="font-size: 22px; font-weight: 700">{{{{n.n}}}}</span><span style="font-size: 12px; color: {SOFT}">{{{{n.d}}}}</span></span></sc-for></div></sc-if>'
CF_ROWS = GROUP(('link', 'Spelled in', 'C major', ''), ('raw', f'<div style="padding: 10px 16px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Also read as</span>{CHIPL("alts", "a")}</div>'), ('raw', f'<div style="padding: 10px 16px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Played</span>{CHIPL("played", "p")}</div>'))
CF_SET = (CAPS('Chord names') + GROUP(('toggle', 'Slash chords for inversions', 'cfSlOn', 'cfSlT'), ('link', 'Spelled in', 'The key they suit', '')) + CAPS('Analysis') + GROUP(('toggle', 'Keys that contain the chord', 'cfKOn', 'cfKT'), ('toggle', 'Key’s scale on the keyboard', 'cfScOn', 'cfScT'))
          + CAPS('History') + GROUP(('toggle', 'Keep chord history', 'cfHOn', 'cfHT'), ('action', 'Forget the chords played', 'closeSheet')) + GROUP(('link', 'Connect a piano', 'Not connected', 'Settings.dc.html')))
ph = body(TOP('Main.dc.html', 'Chord finder', GEAR()), SUBJECT('{{name}}', '{{sub}}', 44) + CF_NOTES + CF_ROWS + '<div style="flex: 1"></div>' + KEYS(170), BTN('Clear the keys', 'clear', kind='quiet', grow=False) + BTN('Open in Chords', href='Chords.dc.html'))
lm = lapbody(LTOP('Laptop.dc.html', GEAR(), 'Chord finder'), SUBJECT('{{name}}', '{{sub}}', 64) + CF_NOTES + '<div style="flex: 1"></div>' + KEYS(200).replace('kb.', 'kbL.'), CF_ROWS, BTN('Clear the keys', 'clear', kind='quiet', grow=False) + BTN('Open in Chords', href='ChordsLaptop.dc.html'))
detail('ChordFinder', 'Chord finder', CF, ph, lm, '', BSHEET('setOn', 'Chord finder settings', CF_SET), POPOVER('setOn', 'Chord finder settings', CF_SET))

# ═════ Circle of fifths (muted.io: the circle, then the key's signature and chords) ═════
_c = open('/home/user/piano-trainer/.scratch/r39/canvas/calm.py').read()
CO_LOGIC = _c.split("CO_JS = RB_JS(r'''")[1].split("''')")[0]
CO = js(CO_LOGIC.replace("return { ...common(st, set),", "const DIA = [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm'], [11, '°']], FIFTH = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], root = FIFTH[sel];\n    return { ...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }), dia: DIA.map(([iv, q], i) => ({ c: NN[(root + iv) % 12] + q, d: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'][i] })), modeSeg: seg(['Major', 'Minor'], st.mode ?? 'Major', (l) => set({ mode: l })),"))
CIRCLE = lambda w: (f'<div style="position: relative; width: {w}px; max-width: 100%; aspect-ratio: 1; margin: 0 auto"><svg viewBox="0 0 400 400" role="radiogroup" aria-label="Keys" style="display: block; width: 100%; height: 100%"><sc-for list="{{{{segs}}}}" as="g" hint-placeholder-count="12"><g onClick="{{{{g.pick}}}}" style="cursor: pointer"><path d="{{{{g.o}}}}" fill="{{{{g.fo}}}}" stroke="{LINE}" stroke-width="1.2"></path><path d="{{{{g.n}}}}" fill="{{{{g.fi}}}}" stroke="{LINE}" stroke-width="1.2"></path></g></sc-for><circle cx="200" cy="200" r="74" fill="{PAGE}" stroke="{LINE}" stroke-width="1.2"></circle></svg>'
    # the key names as HTML over the wheel: a hole inside SVG <text> does not draw in the canvas
    f'<sc-for list="{{{{segs}}}}" as="g" hint-placeholder-count="12"><span aria-hidden="true" style="position: absolute; left: {{{{g.mxp}}}}%; top: {{{{g.myp}}}}%; transform: translate(-50%, -50%); pointer-events: none; font-size: {round(24 * w / 400)}px; font-weight: 700; color: {INK}; white-space: nowrap">{{{{g.m}}}}</span><span aria-hidden="true" style="position: absolute; left: {{{{g.nxp}}}}%; top: {{{{g.nyp}}}}%; transform: translate(-50%, -50%); pointer-events: none; font-size: {round(15 * w / 400)}px; color: {SOFT}; white-space: nowrap">{{{{g.mn}}}}</span></sc-for></div>')
DIA = f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px"><sc-for list="{{{{dia}}}}" as="d" hint-placeholder-count="7"><span style="height: 54px; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px"><span style="font-size: 15px; font-weight: 700">{{{{d.c}}}}</span><span style="font-family: {SERIF}; font-size: 12px; color: {SOFT}">{{{{d.d}}}}</span></span></sc-for></div>'
CO_SET = GROUP(('link', 'Key signatures on the circle', 'On', ''), ('link', 'Minor keys inside', 'On', ''))
ph = body(TOP('Main.dc.html', 'Circle of fifths', GEAR()), CIRCLE(350) + SUBJECT('{{name}}', '{{sub}}', 30) + f'{CAPS("Chords in the key")}' + DIA, SEGC('modeSeg', 36, 14).replace('flex: none;', 'flex: 1;') + BTN('Scales and keys', href='Scales.dc.html', kind='quiet', grow=False, h=44) + PLAYBTN())
lm = lapbody(LTOP('Laptop.dc.html', GEAR(), 'Circle of fifths'), f'<div style="flex: 1; min-height: 0; display: flex; align-items: center">{CIRCLE(600)}</div>', SUBJECT('{{name}}', '{{sub}}', 40) + CARD(scale_staff(360, '        ').replace('aria-label="G major, up one octave, right-hand fingering over the notes"', 'aria-label="The key signature"')) + CAPS('Chords in the key') + DIA + GROUP(('link', 'Relative minor', 'E minor', ''), ('link', 'Open in Scales and keys', '', 'ScalesLaptop.dc.html')), SEGC('modeSeg', 36, 14).replace('flex: none;', 'flex: 1;') + PLAYBTN())
detail('CircleOfFifths', 'Circle of fifths', CO, ph, lm, '', BSHEET('setOn', 'Circle settings', CO_SET), POPOVER('setOn', 'Circle settings', CO_SET))

# ═════ Chords: the calm Chords page itself (the example), unchanged ═════
_cs = _c.split('# The calm Chords page itself')[1].split("print('practice ok')")[0]
exec(_cs.split('\n', 1)[1])
print('practice ok')
