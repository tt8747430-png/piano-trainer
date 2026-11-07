# The keyboard works: each key, 2D or 3D, sounds and lights when pressed; Play plays the song at the
# Pace's speed and the key chosen, the beat's keys light in their hand's colour, and the cursor walks
# the score note by note, the page and the line scrolling with it. Runs after score.py.
import json, sys, os
proj = sys.argv[1]
S = os.path.dirname(os.path.abspath(__file__)) + '/..'
N = json.load(open(S + '/notes.json'))
BEATS = [[] for _ in range(48)]
for m, h, tick, dur, fin in N['notes']:
    i = round(tick / N['tpb'])
    if i < 48: BEATS[i].append([m, h[0], fin or 0])
K3 = json.load(open(S + '/kbv/keys3d-sizes.json'))
BLOBS = json.load(open(S + '/kbv/sizes-blobs.json'))

def once(t, a, b, f):
    assert t.count(a) == 1, (f, a[:90], t.count(a))
    return t.replace(a, b)

ENGINE = r'''const NOTES = NOTES_DATA;
const semi = key - 4;
const engine = this;
const atHome = atStart;
const posI = atHome ? 0 : (bar - 1) * 3 + (beat - 1);
const audio = () => { const w = window; if (!w.__ptAudio) { const C = w.AudioContext || w.webkitAudioContext; if (!C) return null; w.__ptAudio = new C(); } if (w.__ptAudio.state === 'suspended') w.__ptAudio.resume(); return w.__ptAudio; };
const tone = (m, level, dur) => {
const ac = audio(); if (!ac) return;
const t0 = ac.currentTime, f = 440 * 2 ** ((m - 69) / 12), d = dur ?? Math.max(0.9, 2.6 - (m - 30) * 0.03);
const out = ac.createGain(); out.gain.setValueAtTime(0, t0); out.gain.linearRampToValueAtTime(0.32 * level, t0 + 0.006); out.gain.exponentialRampToValueAtTime(0.1 * level + 0.0001, t0 + 0.25); out.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(Math.min(9000, f * 9), t0); lp.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.6), t0 + d * 0.7);
lp.connect(out); out.connect(ac.destination);
[[1, 1, 'triangle'], [2, 0.42, 'sine'], [3, 0.16, 'sine'], [4, 0.07, 'sine']].forEach(([h, a, type], i) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f * h; o.detune.value = i ? -3 : 2; const g = ac.createGain(); g.gain.value = a; o.connect(g); g.connect(lp); o.start(t0); o.stop(t0 + d + 0.05); });
};
// the metronome's one voice, for its clicks and the count-in alike: its sound and volume are the learner's
const click = (hi) => { const ac = audio(); if (!ac) return; const st = engine.state || {}; const vol = (st.metVol ?? 70) / 100; if (!vol) return; const t0 = ac.currentTime, kind = st.metSound ?? 'wood';
const g = ac.createGain(); g.connect(ac.destination);
if (kind === 'claves') { const n = ac.sampleRate * 0.12, buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3; const src = ac.createBufferSource(); src.buffer = buf; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = hi ? 3000 : 2400; bp.Q.value = 9; src.connect(bp); bp.connect(g); g.gain.setValueAtTime(0.9 * vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12); src.start(t0); return; }
const o = ac.createOscillator(); o.type = kind === 'beep' ? 'sine' : 'triangle'; o.frequency.value = kind === 'beep' ? (hi ? 1046 : 784) : (hi ? 1200 : 900); o.connect(g);
const len = kind === 'beep' ? 0.14 : 0.07; g.gain.setValueAtTime((kind === 'beep' ? 0.35 : 0.5) * vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len); o.start(t0); o.stop(t0 + len + 0.02); };
const handOf = (m) => (m < 60 ? 'l' : 'r');
const LIT = new Map();
// a Hidden hand's keys stay dark; a Dimmed hand's light pale; a key you press always lights
if (playing) for (const [m, h] of NOTES[posI] || []) { const sh = showOf[h === 'r' ? 'rh' : 'lh']; if (sh !== 'hide') LIT.set(m + semi, sh === 'dim' ? h + 'd' : h); }
for (const m of s.held ?? []) LIT.set(m, handOf(m));
const press = (m) => (e) => {
e.preventDefault(); e.stopPropagation();
tone(m, 0.75);
this.setState({ held: [...(this.state?.held ?? []).filter((k) => k !== m), m] });
const up = () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); this.setState({ held: (this.state?.held ?? []).filter((k) => k !== m) }); };
window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
};
const beatMs = () => 60000 / (80 * ((engine.state?.speed ?? 100) / 100));
const sound = (b, bt) => { const st = engine.state || {}; const sm = (st.key ?? 4) - 4; for (const [m, h] of NOTES[(b - 1) * 3 + bt - 1] || []) tone(m + sm, (h === 'r' ? ((st.muteR ?? st.showR === 'hide') ? 0 : st.volR ?? 80) : ((st.muteL ?? st.showL === 'hide') ? 0 : st.volL ?? 60)) / 100); if (st.metro) click(bt === 1); };
const tick = () => {
const st = engine.state || {};
if (!st.playing) return;
if (engine.__count > 0) { click(engine.__count % 3 === 0); engine.__count -= 1; engine.__t = setTimeout(tick, beatMs()); return; }
let b = st.bar ?? 1, bt = st.beat ?? 1, verse = st.verse ?? 0;
const lp = st.loop ?? false, la = st.loopA ?? 5, lb = st.loopB ?? 8;
if (engine.__fresh) { engine.__fresh = false; if (st.start ?? st.bar === undefined) { b = 1; bt = 1; } if (lp && (b < la || b > lb)) { b = la; bt = 1; } }
else { bt += 1; if (bt > 3) { bt = 1; b += 1; } if (lp && b > lb) b = la; if (b > 16) { if (verse === 0) { verse = 1; b = 1; } else { engine.setState({ playing: false, start: true, bar: 1, beat: 1, verse: 0 }); return; } } }
engine.setState({ start: false, bar: b, beat: bt, verse });
sound(b, bt);
engine.__t = setTimeout(tick, beatMs());
};
const togglePlayNow = () => {
clearTimeout(engine.__t);
if (playing) { this.setState({ playing: false }); return; }
audio();
engine.__fresh = true; engine.__count = 3 * (s.countBars ?? 1);
this.setState({ playing: true, open: 'none' });
engine.__t = setTimeout(tick, 20);
};
''' 
VALS = r'''const verseNow = s.verse ?? 0;
const sysNow = verseNow * 4 + Math.floor(((atHome ? 1 : bar) - 1) / 4);
const beatNow = ((atHome ? 1 : bar) - 1) % 4 * 3 + ((atHome ? 1 : beat) - 1);
const k3Names = (g) => { if (!kbNames) return []; const cv = { both: 'b', rh: 'r', lh: 'l', none: 'x' }[handsSeen(false)]; return g.keys.filter((k) => !k.b && k.lx !== undefined).map((k) => { const pl = PLAYED[k.m]; const mine = pl && showOf[pl[0]] !== 'hide'; const c = k.m % 12 === 0; if ((!mine && !c) || k.cov.includes(cv) || (!mine && k.lw < 28)) return null; return { x: k.lx, y: k.ly, t: mine ? NOTE[k.m % 12] : 'C' + (Math.floor(k.m / 12) - 1), fs: Math.round(mine ? Math.max(16, Math.min(30, k.lw * 0.42)) : Math.max(14, Math.min(26, k.lw * 0.32))), fw: mine ? 700 : 500, fg: mine ? '#1A1612' : '#8A8076' }; }).filter(Boolean); };
const k3Of = (view) => { const g = K3G(view); return { W: g.W, H: g.H, names: k3Names(g), keys: g.keys.map((k) => ({ pts: k.p, down: press(k.m) })), lit: g.keys.filter((k) => LIT.has(k.m)).map((k) => { const h = LIT.get(k.m); const dim = h.length > 1; return { pts: k.p, fill: h[0] === 'r' ? '#E8826A' : '#9C86D0', blend: k.b ? 'normal' : 'multiply', op: (k.b ? 0.8 : 0.95) * (dim ? 0.4 : 1) }; }) }; };
const KEY_VALS = {
togglePlay: togglePlayNow,
scoreRef: (el) => { this._score = el; }, panoRef: (el) => { this._pano = el; },
cur: { x: BEATX[sysNow % 4][beatNow], y: SYS[sysNow].y + 4, h: SYS[sysNow].h - 8 },
pcur: { x: PANOX[sysNow][beatNow] },
curKey: [view, layout, sysNow, beatNow].join(':'), sheetTopPx: SHEETTOP_EXPR,
k3: k3Of(kbView),
};
this._vals = Object.assign(this._vals || {}, { curKey: KEY_VALS.curKey, cur: KEY_VALS.cur, pcur: KEY_VALS.pcur, sheetTop: KEY_VALS.sheetTopPx });
'''

FOLLOW = '''if (v && v.curKey !== this._ck) {
this._ck = v.curKey;
const page = false;
const how = smooth ? 'smooth' : 'auto';
if (this._score && v.cur) { const el = this._score; const y = v.cur.y + (v.sheetTop || 0); if (y < el.scrollTop + 60 || y + v.cur.h > el.scrollTop + el.clientHeight - 140) el.scrollTo({ top: Math.max(0, y - (page ? 12 : el.clientHeight * 0.25)), behavior: how }); }
if (this._pano && v.pcur) { const el = this._pano; const x = v.pcur.x; if (x < el.scrollLeft + el.clientWidth * 0.2 || x > el.scrollLeft + el.clientWidth * 0.7) el.scrollTo({ left: Math.max(0, x - (page ? 16 : el.clientWidth / 3)), behavior: how }); }
}
if (!v || v.key === this._key) return;'''

OVER3D = ('\n<svg role="group" aria-label="The keys: press one to hear it" viewBox="0 0 {{k3.W}} {{k3.H}}" preserveAspectRatio="xMidYMid slice" style="position: absolute; left: 0; top: {{kbTop}}px; width: {{kbW}}px; height: {{kbH}}px; display: block; touch-action: none">\n'
          '<sc-for list="{{k3.lit}}" as="k" hint-placeholder-count="0"><polygon points="{{k.pts}}" fill="{{k.fill}}" style="mix-blend-mode: {{k.blend}}; opacity: {{k.op}}; pointer-events: none"></polygon></sc-for>\n'
          '<sc-for list="{{k3.names}}" as="n" hint-placeholder-count="0"><text x="{{n.x}}" y="{{n.y}}" text-anchor="middle" font-size="{{n.fs}}" font-weight="{{n.fw}}" fill="{{n.fg}}" style="pointer-events: none; font-family: inherit">{{n.t}}</text></sc-for>\n'
          '<sc-for list="{{k3.keys}}" as="k" hint-placeholder-count="40"><polygon points="{{k.pts}}" fill="transparent" onPointerDown="{{k.down}}" style="cursor: pointer"></polygon></sc-for>\n'
          '</svg>')

RANGE = {'R3Phone': '[29, 64]', 'R3Laptop': '[24, 84]'}
for f in ('R3Phone', 'R3Laptop'):
    p = '%s/%s.dc.html' % (proj, f)
    t = open(p).read()
    dev = 'phone' if f == 'R3Phone' else 'laptop'
    k3 = {z: {v: dict(K3[z][v][dev]) for v in ('seat', 'above')} for z in K3}
    for z, views in k3.items():
        for vn, v in views.items():
            v.pop('files')
            v['img'] = {h: BLOBS['kb-%s-%s-%s-%s' % (z, vn, h, dev)] for h in ('both', 'rh', 'lh', 'none')}
            v['keys'] = [dict(k) for k in v['keys']]
            for k in v['keys']:
                k['p'] = ' '.join('%g,%g' % (round(x, 1), round(y, 1)) for x, y in k.pop('pts'))
                k['b'] = 1 if k.pop('black') else 0
    js = ENGINE.replace('NOTES_DATA', json.dumps(BEATS))
    r = t.index('const VIEWS = [')
    t = once(t, 'const KB_IMG = {', 'const K3D = K3D_DATA;\nconst K3G = (v) => K3D[kbRange][v];\nconst KB_IMG_OLD = {', f)
    t = once(t, 'const KB_VALS = {', "const KB_IMG = { seat: K3G('seat').img, above: K3G('above').img };\nconst bandH = keys && kbStyle === '3d' ? Math.round(KB.w * K3G(kbView).H / K3G(kbView).W) : KB.h;\nconst KB_VALS = {\nareaTop: keys ? KB.top + bandH : 0,", f)
    t = once(t, 'kbH: KB.h', 'kbH: bandH', f)
    t = t.replace('K3D_DATA', json.dumps(k3, separators=(',', ':')))
    r = t.index('const VIEWS = [')
    t = t[:r] + VALS.replace('SHEETTOP_EXPR', 'keys ? 40 : 116' if f == 'R3Phone' else 'keys ? 44 : 64') + t[r:]
    r = t.index('const PLAYED = {')
    t = t[:r] + js + t[r:]
    t = once(t, '...SET_VALS', '...SET_VALS,\n...KEY_VALS', f)
    t = once(t, "togglePlay: () => this.setState({ playing: !playing, open: 'none' })", 'togglePlay: togglePlayNow', f)
    t = once(t, "if (!v || v.key === this._key) return;", FOLLOW, f)
    PIANO = '<svg width="%d" height="%d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8M2 14h20M6 14v4M10 14v4M14 14v4M18 14v4"></path></svg>'
    a = t.index('onClick="{{openHands}}"'); b = t.index('</button>\n</div>', a) + len('</button>\n')
    btn = ('<button type="button" aria-label="Keyboard" aria-expanded="{{isKeys}}" onClick="{{openKeys}}" style="width: 48px; height: 48px; border: 0; border-radius: 9999px; background: transparent; color: #1A1612; display: flex; align-items: center; justify-content: center">' + (PIANO % (22, 22)) + '</button>\n'
           if f == 'R3Phone' else
           '<button type="button" aria-expanded="{{isKeys}}" onClick="{{openKeys}}" style="height: 48px; padding: 0 14px 0 12px; border: 0; border-radius: 9999px; background: transparent; color: #1A1612; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600">' + (PIANO % (20, 20)) + '<span>Keyboard</span></button>\n')
    t = t[:b] + btn + t[b:]
    t = once(t, 'componentDidUpdate() { this.follow(true); }', 'componentDidUpdate() { this.follow(true); }\ncomponentWillUnmount() { clearTimeout(this.__t); }', f)
    # the 2D keys: the beat's notes marked, the sounding ones lit, each one pressed sounds
    a = t.index('const PLAYED = {'); b = t.index('\n', a)
    t = t[:a] + "const PLAYED = Object.fromEntries((NOTES[posI] || []).map(([m, h, fg]) => [m + semi, [h === 'r' ? 'rh' : 'lh', fg || '']]));" + t[b:]
    t = once(t, "const fill = hand && hand[0] === 'rh' ? (faint ? '#F0D3CA' : '#E19E8C') : null;",
             "const lit = LIT.get(m);\nconst fill = lit ? ({ r: '#D9785F', l: '#9C86D0', rd: '#F0D3CA', ld: '#DDD4EC' })[lit] : hand && hand[0] === 'rh' ? (faint ? '#F0D3CA' : '#E19E8C') : null;", f)
    t = once(t, "const mine = played && (hands === 'both' || played[0] === hands);", "const mine = played && showOf[played[0]] !== 'hide' && (hands === 'both' || played[0] === hands);", f)
    t = once(t, "blacks.push({ x: Math.round(wi * w - w * 0.31)", "blacks.push({ down: press(m), x: Math.round(wi * w - w * 0.31)", f)
    t = once(t, "whites.push({ x: Math.round(wi * w),", "whites.push({ down: press(m), x: Math.round(wi * w),", f)
    t = t.replace('song: [41, 71]', 'song: ' + RANGE[f]).replace('song: [36, 96]', 'song: ' + RANGE[f])
    for kind in ('whites', 'blacks'):
        a = t.index('<sc-for list="{{flat.%s}}" as="k"' % kind)
        d0 = t.index('<div style="position: absolute; left: {{k.x}}px;', a)
        t = t[:d0] + '<div onPointerDown="{{k.down}}" style="cursor: pointer; touch-action: none; position: absolute; left: {{k.x}}px;' + t[d0 + len('<div style="position: absolute; left: {{k.x}}px;'):]
    # the flat keys take presses: the group is no picture
    t = t.replace('<div role="img" aria-label="{{kbAlt}}" style="position: absolute; left: 0; top: {{kbTop}}px;', '<div role="group" aria-label="{{kbAlt}}" style="position: absolute; left: 0; top: {{kbTop}}px;')
    t = t.replace('<div aria-hidden="true" style="position: absolute; left: {{flat.left}}px; bottom: 0;', '<div style="position: absolute; left: {{flat.left}}px; bottom: 0;')
    # the 3D keys: a press finds its key's outline; the sounding keys glow
    g = t.index('<sc-if value="{{kbGhostOn}}"'); ge = t.index('</sc-if>', g) + len('</sc-if>')
    t = t[:ge] + OVER3D + t[ge:]
    open(p, 'w').write(t)
    print(f, 'keys ok')
