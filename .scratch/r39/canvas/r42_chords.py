# R42: the Chords page in the Player's shape. Run after r41.py (it replaces the Chords boards r41 writes).
# The keys run edge to edge at the top under a row of glass controls (Back, the views, the gear), the chord is the
# title beneath, the view's content under it, and one floating bar at the foot: Chord ▴, Arpeggio, ‹ Play ›, Hands,
# Keyboard. Each control opens a sheet on a phone and a popover on a laptop, as the Player's do.

COG = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
NOTEI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
LAYERS = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m12 2 10 5-10 5L2 7z"></path><path d="m2 17 10 5 10-5"></path><path d="m2 12 10 5 10-5"></path></svg>'
POINT = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M22 14a8 8 0 0 1-8 8"></path><path d="M18 11v-1a2 2 0 0 0-4 0"></path><path d="M14 10V9a2 2 0 0 0-4 0v1"></path><path d="M10 9.5V4a2 2 0 0 0-4 0v10"></path><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>'
TONESI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><circle cx="7" cy="12" r="3"></circle><circle cx="17" cy="6.5" r="3"></circle><circle cx="17" cy="17.5" r="3"></circle></svg>'
HANDI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>'
ARPI = f'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="currentColor"><ellipse cx="5.5" cy="19" rx="2.8" ry="2.1" transform="rotate(-20 5.5 19)"></ellipse><ellipse cx="12" cy="14" rx="2.8" ry="2.1" transform="rotate(-20 12 14)"></ellipse><ellipse cx="18.5" cy="9" rx="2.8" ry="2.1" transform="rotate(-20 18.5 9)"></ellipse></g><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 18.4V7M14.5 13.4V3.5M21 8.4V2"></path></g></svg>'
BLOCKI = f'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="currentColor"><ellipse cx="10" cy="19" rx="2.8" ry="2.1" transform="rotate(-20 10 19)"></ellipse><ellipse cx="10" cy="14.2" rx="2.8" ry="2.1" transform="rotate(-20 10 14.2)"></ellipse><ellipse cx="10" cy="9.4" rx="2.8" ry="2.1" transform="rotate(-20 10 9.4)"></ellipse></g><path d="M12.6 18.4V2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg>'
SOUNDI = '<sc-if value="{{arpOn}}" hint-placeholder-val="{{false}}">' + ARPI + '</sc-if><sc-if value="{{blockOn}}" hint-placeholder-val="{{true}}">' + BLOCKI + '</sc-if>'
PIANOI = f'<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"></rect><path d="M7.25 12.5V19M12 12.5V19M16.75 12.5V19" stroke="currentColor" stroke-width="1.4"></path><g fill="currentColor"><rect x="5.6" y="5" width="3.3" height="7.5" rx=".6"></rect><rect x="10.35" y="5" width="3.3" height="7.5" rx=".6"></rect><rect x="15.1" y="5" width="3.3" height="7.5" rx=".6"></rect></g></svg>'
LINKI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
CLOSEX = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M18 6 6 18M6 6l12 12"></path></svg>'
CHEV_D2 = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m6 9 6 6 6-6"></path></svg>'
CHEV_U2 = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m18 15-6-6-6 6"></path></svg>'
CHEV_LS = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="m15 18-6-6 6-6"></path></svg>'
CHEV_RS = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="m9 18 6-6-6-6"></path></svg>'

CH_JS = r'''
const CROOTS = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const LET = 'CDEFGAB', NATPC = [0, 2, 4, 5, 7, 9, 11];
const QS = [
  { g: 'Triads', k: '', n: 'major triad', t: [[0, 1], [4, 3], [7, 5]] },
  { g: 'Triads', k: 'm', n: 'minor triad', t: [[0, 1], [3, 3], [7, 5]] },
  { g: 'Triads', k: '°', n: 'diminished triad', t: [[0, 1], [3, 3], [6, 5]], also: 'dim' },
  { g: 'Triads', k: '+', n: 'augmented triad', t: [[0, 1], [4, 3], [8, 5]], also: 'aug' },
  { g: 'Triads', k: 'sus2', n: 'suspended second', t: [[0, 1], [2, 2], [7, 5]] },
  { g: 'Triads', k: 'sus4', n: 'suspended fourth', t: [[0, 1], [5, 4], [7, 5]] },
  { g: 'Added notes', k: 'add2', n: 'major, added second', t: [[0, 1], [2, 2], [4, 3], [7, 5]] },
  { g: 'Added notes', k: 'add9', n: 'major, added ninth', t: [[0, 1], [4, 3], [7, 5], [14, 9]] },
  { g: 'Added notes', k: 'm(add9)', n: 'minor, added ninth', t: [[0, 1], [3, 3], [7, 5], [14, 9]] },
  { g: 'Added notes', k: '6', n: 'major sixth', t: [[0, 1], [4, 3], [7, 5], [9, 6]] },
  { g: 'Added notes', k: 'm6', n: 'minor sixth', t: [[0, 1], [3, 3], [7, 5], [9, 6]] },
  { g: 'Added notes', k: '6/9', n: 'six-nine', t: [[0, 1], [4, 3], [7, 5], [9, 6], [14, 9]] },
  { g: 'Sevenths', k: 'maj7', n: 'major seventh', t: [[0, 1], [4, 3], [7, 5], [11, 7]], also: 'Δ7' },
  { g: 'Sevenths', k: '7', n: 'dominant seventh', t: [[0, 1], [4, 3], [7, 5], [10, 7]] },
  { g: 'Sevenths', k: 'm7', n: 'minor seventh', t: [[0, 1], [3, 3], [7, 5], [10, 7]], also: '−7' },
  { g: 'Sevenths', k: 'm(maj7)', n: 'minor major seventh', t: [[0, 1], [3, 3], [7, 5], [11, 7]] },
  { g: 'Sevenths', k: 'ø7', n: 'half-diminished seventh', t: [[0, 1], [3, 3], [6, 5], [10, 7]], also: 'm7♭5' },
  { g: 'Sevenths', k: '°7', n: 'diminished seventh', t: [[0, 1], [3, 3], [6, 5], [9, 7]], also: 'dim7' },
  { g: 'Sevenths', k: '7sus4', n: 'dominant seventh, suspended fourth', t: [[0, 1], [5, 4], [7, 5], [10, 7]] },
  { g: 'Extended', k: '9', n: 'dominant ninth', t: [[0, 1], [4, 3], [7, 5], [10, 7], [14, 9]] },
  { g: 'Extended', k: 'maj9', n: 'major ninth', t: [[0, 1], [4, 3], [7, 5], [11, 7], [14, 9]] },
  { g: 'Extended', k: 'm9', n: 'minor ninth', t: [[0, 1], [3, 3], [7, 5], [10, 7], [14, 9]] },
  { g: 'Extended', k: '11', n: 'dominant eleventh', t: [[0, 1], [7, 5], [10, 7], [14, 9], [17, 11]] },
  { g: 'Extended', k: 'm11', n: 'minor eleventh', t: [[0, 1], [3, 3], [7, 5], [10, 7], [14, 9], [17, 11]] },
  { g: 'Extended', k: '13', n: 'dominant thirteenth', t: [[0, 1], [4, 3], [10, 7], [14, 9], [21, 13]] },
  { g: 'Extended', k: 'maj13', n: 'major thirteenth', t: [[0, 1], [4, 3], [11, 7], [14, 9], [21, 13]] },
  { g: 'Extended', k: 'm13', n: 'minor thirteenth', t: [[0, 1], [3, 3], [10, 7], [14, 9], [21, 13]] },
];
const VOICINGS = [
  { v: 'Close', f: 'The notes as close as they go', ok: () => '' },
  { v: 'Drop 2', f: 'Second from the top down an octave', ok: (q) => q.t.length === 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Drop 3', f: 'Third from the top down an octave', ok: (q) => q.t.length === 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Shell', f: 'Root, 3rd and 7th', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Rootless A', f: '3rd, 5th, 7th, 9th', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Rootless B', f: '7th, 9th, 3rd, 5th', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
];
const ORD = [1, 2, 3, 4, 5, 6, 7, 9, 11, 13];
const INV = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'];
const INVS = ['Root', '1st', '2nd', '3rd'];
const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };
const TEN = { '♭9': [13, 9], '9': [14, 9], '♯9': [15, 9], '11': [17, 11], '♯11': [18, 11], '♭13': [20, 13], '13': [21, 13] };
const DEGL = { 1: 'R', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 9: '9', 11: '11', 13: '13' };
function spell(root, semi, deg) {
  const rl = LET.indexOf(CROOTS[root][0]); const pc = (root + semi) % 12; const L = LET[(rl + deg - 1) % 7];
  const d = ((pc - NATPC[LET.indexOf(L)] + 18) % 12) - 6; return { L, d, name: L + ACC[String(d)] };
}
function family(q) {
  const s3 = (q.t.find((x) => x[1] === 3) || [4])[0], s5 = (q.t.find((x) => x[1] === 5) || [7])[0], s7 = (q.t.find((x) => x[1] === 7) || [null])[0];
  if (s5 === 6) return 'dim'; if (s3 === 3) return 'minor'; if (s7 === 10) return 'dom'; return 'major';
}
const TENS = { major: ['9', '♯11', '13'], dom: ['♭9', '9', '♯9', '♯11', '♭13', '13'], minor: ['9', '11', '13'], dim: ['9', '11', '♭13'] };
const AVOID = { major: ['11'], dom: ['11'], minor: ['♭13'], dim: [] };
let AC = null;
function sound(ms, arp, dir) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = arp ? (dir === 'Up and down' ? ms.concat(ms.slice(0, -1).reverse()) : ms) : ms;
    const t0 = AC.currentTime + 0.03;
    seq.forEach((m, i) => {
      const t = t0 + (arp ? i * 0.2 : 0); const f = 440 * Math.pow(2, (m - 69) / 12);
      [1, 2, 3].forEach((h, j) => {
        const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f * h;
        const a = [0.2, 0.06, 0.025][j] / Math.max(1, (arp ? 1 : ms.length) / 3);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0008, t + 1.9);
        o.connect(g).connect(AC.destination); o.start(t); o.stop(t + 2);
      });
    });
    return (arp ? seq.length * 200 : 0) + 1500;
  } catch (e) { return 1500; }
}
// the chord as it sounds: [{m, deg, name, L, d, hand}]
function voice(root, q, inv, voicing, hands, tens) {
  const base = (root <= 5 ? 60 : 48) + root;
  const s = (deg) => (q.t.find((x) => x[1] === deg) || [null])[0];
  const third = s(3) ?? s(4) ?? s(2);
  let src;
  if (voicing === 'Shell') src = [[0, 1], [third, s(3) != null ? 3 : (s(4) != null ? 4 : 2)], [s(7), 7]];
  else if (voicing === 'Rootless A') src = [[third, 3], [s(5) ?? 7, 5], [s(7), 7], [s(9) ?? 14, 9]];
  else if (voicing === 'Rootless B') src = [[s(7) - 12, 7], [(s(9) ?? 14) - 12, 9], [third, 3], [s(5) ?? 7, 5]];
  else src = q.t.map((x) => x.slice());
  let ns = src.map(([semi, deg]) => ({ m: base + semi, semi, deg }));
  ns.sort((a, b) => a.m - b.m);
  const n = Math.min(inv, ns.length - 1);
  for (let i = 0; i < n; i++) ns[i].m += 12;
  ns.sort((a, b) => a.m - b.m);
  if (voicing === 'Drop 2' && ns.length === 4) ns[2].m -= 12;
  if (voicing === 'Drop 3' && ns.length === 4) ns[1].m -= 12;
  tens.forEach((t) => { const [semi, deg] = TEN[t]; ns.push({ m: base + semi, semi, deg, ten: true }); });
  ns.sort((a, b) => a.m - b.m);
  ns.forEach((x) => { x.hand = 'R'; });
  if (ns.length > 5) ns.slice(0, ns.length - 5).forEach((x) => { x.hand = 'L'; });
  if (hands === 'Left') ns.forEach((x) => { x.m -= 12; x.hand = 'L'; });
  if (hands === 'Both') {
    const lh = [{ m: base - 12, semi: 0, deg: 1 }]; if (s(5) != null) lh.push({ m: base - 12 + s(5), semi: s(5), deg: 5 });
    lh.forEach((x) => { x.hand = 'L'; }); ns = lh.concat(ns);
  }
  const keep = []; ns.forEach((x) => { if (!keep.some((y) => y.m === x.m)) keep.push(x); });
  return keep.map((x) => Object.assign(x, spell(root, ((x.semi % 12) + 12) % 12, x.deg)));
}
function fingers(list, hand) {
  const n = list.length; if (!n) return [];
  if (hand === 'R') return ({ 1: [1], 2: [1, 5], 3: [1, 3, 5], 4: [1, 2, 3, 5], 5: [1, 2, 3, 4, 5] })[n];
  return ({ 1: [5], 2: [5, 1], 3: [5, 3, 1], 4: [5, 3, 2, 1], 5: [5, 4, 3, 2, 1] })[n];
}
// the grand staff: y of each note, ledger lines, seconds side by side
function staff(notes, treble, W) {
  const cx = W / 2; const out = [], ledg = [];
  const dnOf = (x) => (Math.floor((x.m - x.d) / 12) - 1) * 7 + LET.indexOf(x.L);
  const onT = (x) => treble || x.m >= 60;
  let prev = { T: null, B: null };
  notes.forEach((x) => {
    const dn = dnOf(x), T = onT(x), y = T ? 70 - (dn - 30) * 5 : 150 - (dn - 18) * 5, key = T ? 'T' : 'B';
    const p = prev[key]; const shift = p && dn - p.dn === 1 && !p.shift; const nx = cx + (shift ? 14 : 0);
    out.push({ x: nx, y, ay: y + 5, ax: cx - 22 - (shift ? 0 : 0), acc: ACC[String(x.d)], c: ROLE[x.deg] || C.ink });
    prev[key] = { dn, shift };
    const lo = T ? 28 : 16, hi = T ? 40 : 28;
    if (T) { for (let k = 28; k >= dn; k -= 2) ledg.push({ y: 70 - (k - 30) * 5, x1: cx - 11, x2: nx + 11 }); for (let k = 40; k <= dn; k += 2) ledg.push({ y: 70 - (k - 30) * 5, x1: cx - 11, x2: nx + 11 }); }
    else { for (let k = 16; k >= dn; k -= 2) ledg.push({ y: 150 - (k - 18) * 5, x1: cx - 11, x2: nx + 11 }); for (let k = 28; k <= dn; k += 2) ledg.push({ y: 150 - (k - 18) * 5, x1: cx - 11, x2: nx + 11 }); }
  });
  return { notes: out, ledg };
}
function range(ms, keys, minOct) {
  if (keys === '88') return [21, 108]; if (keys === '61') return [36, 96];
  let lo = Math.floor(Math.min(...ms) / 12) * 12, hi = Math.floor(Math.max(...ms) / 12) * 12 + 11;
  let n = 0; while ((hi - lo + 1) / 12 < minOct) { if (n++ % 2 === 0) hi += 12; else lo -= 12; }
  return [lo, hi];
}
'''

def CH_BODY(D, W, KH, minOct, mini_w):
    return r'''
const root = st.root ?? D.root, qi = st.q ?? D.q, q = QS[qi];
const voicing = VOICINGS.find((v) => v.v === (st.voicing || 'Close')).ok(q) ? 'Close' : (st.voicing || 'Close');
const invN = Math.min(4, voicing === 'Shell' ? 3 : (voicing.startsWith('Rootless') ? 4 : q.t.length));
const inv = Math.min(st.inv ?? 0, invN - 1);
const hands = st.hands || 'Both', view = st.view || 'Staff', keys = st.keys || 'Chord', fam = family(q);
const tens = (st.tens || []).filter((t) => TENS[fam].includes(t));
const playAs = st.playAs || 'Block', arp = playAs !== 'Block', dir = playAs === 'Up and down' ? 'Up and down' : 'Up', names = st.names ?? true, treble = st.staff === 'Treble only', auto = true;
const ns = voice(root, q, inv, voicing, hands, tens);
const ms = ns.map((x) => x.m);
const sym = ROOTS[root] + q.k + (tens.length ? '(' + tens.join(', ') + ')' : '');
const bassName = inv > 0 && q.t[inv] ? spell(root, ((q.t[inv][0] % 12) + 12) % 12, q.t[inv][1]).name : '';
const slash = bassName ? '/' + bassName : '';
const symLen = (sym + slash).length;
const symScale = symLen <= 6 ? 1 : (symLen <= 9 ? 0.78 : 0.6);
const full = ROOTS[root] + ' ' + q.n + (tens.length ? ', add ' + tens.join(', ') : '');
const play = () => { set({ playing: true }); const t = sound(ms, arp, dir); clearTimeout(this._t); this._t = setTimeout(() => set({ playing: false }), t); };
const change = (o) => { set(o); if (auto) { const r = o.root ?? root, qq = QS[o.q ?? qi], iv = o.inv ?? inv; const vv = o.voicing || voicing; const hh = o.hands || hands; sound(voice(r, qq, Math.min(iv, qq.t.length - 1), VOICINGS.find((v) => v.v === vv).ok(qq) ? 'Close' : vv, hh, (o.tens || tens).filter((t) => TENS[family(qq)].includes(t))).map((x) => x.m), false, dir); } };
const [lo, hi] = range(ms, keys, ''' + str(minOct) + r''');
const marks = {}; ns.forEach((x) => { marks[x.m] = [ROLE[x.deg] || C.accent, names ? x.name : '']; });
const kb = calmKeys(lo, hi, marks, ''' + str(W) + ', ' + str(KH) + r''');
const bass = ns[0];
const shape = INV[inv] + (inv ? ' · ' + bass.name + ' in the bass' : '') + ' · ' + voicing;
const sv = staff(ns, treble, 280);
const R = ns.filter((x) => x.hand === 'R'), L = ns.filter((x) => x.hand === 'L');
const fR = fingers(R, 'R'), fL = fingers(L, 'L');
const fing = [['Right hand', R, fR], ['Left hand', L, fL]].filter((h) => h[1].length).map(([h, list, f]) => ({ h, cells: list.map((x, i) => ({ n: x.name, f: f[i], c: ROLE[x.deg] || C.accent })) }));
const invCards = Array.from({ length: invN }, (_, i) => {
  const v = voice(root, q, i, voicing, 'Right', tens); const [a, b] = [Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12, Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12 + 23];
  const mk = {}; v.forEach((x) => { mk[x.m] = [ROLE[x.deg] || C.accent, '']; });
  return { t: INV[i], s: v.map((x) => x.name).join(' · '), kb: calmKeys(a, Math.max(b, Math.max(...v.map((x) => x.m))), mk, ''' + str(mini_w) + r''', 64), ring: i === inv ? '0 0 0 2px ' + C.ink : '0 0 0 1px ' + C.line, pick: () => { change({ inv: i }); } };
});
const tones = ns.filter((x) => !x.ten && x.hand !== 'L' || (hands === 'Left' && !x.ten)).filter((x, i, a) => a.findIndex((y) => y.deg === x.deg) === i).map((x) => ({ n: x.name, d: DEGL[x.deg], c: ROLE[x.deg] || C.accent }));
const tenChips = TENS[fam].filter((t) => !q.t.some((x) => x[1] === TEN[t][1] && x[0] === TEN[t][0])).map((t) => { const on = tens.includes(t); return { l: t, n: spell(root, TEN[t][0] % 12, TEN[t][1]).name, on, bg: on ? C.accent : C.sheet, pick: () => change({ tens: on ? tens.filter((x) => x !== t) : tens.concat([t]) }) }; });
const avoid = AVOID[fam].filter((t) => !q.t.some((x) => x[0] === TEN[t][0])).map((t) => ({ l: t, n: spell(root, TEN[t][0] % 12, TEN[t][1]).name }));
const groups = ['Triads', 'Added notes', 'Sevenths', 'Extended'].map((g) => ({ g, rows: QS.map((x, i) => [x, i]).filter(([x]) => x.g === g).map(([x, i]) => ({ s: ROOTS[root] + x.k, n: ROOTS[root] + ' ' + x.n, on: i === qi, bg: i === qi ? '#F6E3BC' : 'transparent', fw: i === qi ? 700 : 500, pick: () => change({ q: i, sheet: 'chord' }) })) }));
const vlist = VOICINGS.map((v) => { const why = v.ok(q); return { v: v.v, f: why || v.f, op: why ? 0.42 : 1, on: v.v === voicing, mark: v.v === voicing ? '✓' : '', pick: () => { if (!why) change({ voicing: v.v, sheet: 'chord' }); } }; });
const VIEWS = ['Staff', 'Inversions', 'Fingering', 'Tensions'];
const views = VIEWS.map((v) => ({ v, on: v === view, bg: v === view ? C.ink : 'transparent', fg: v === view ? C.sheet : C.ink, sh: v === view ? '0 1px 3px rgba(51,41,33,.18)' : 'none', fw: 600, pick: () => set({ view: v }) }));
const sh = st.sheet || '';
const handsBadge = hands === 'Both' ? '2' : (hands === 'Right' ? 'R' : 'L');
const hB = hands === 'Both', hR = hands === 'Right', hL = hands === 'Left';
return {
  sym, full, shape, kb, sv, fing, invCards, tones, tenChips, avoid, groups, vlist, views, handsBadge, hB, hR, hL, slash, hasSlash: !!slash, symFsP: Math.round(44 * symScale), symFsL: Math.round(64 * symScale), invLine: INV[inv] + (slash ? ', ' + bassName + ' in the bass' : '') + ' · ' + voicing + ' voicing',
  chips: ns.filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i).sort((a, b) => ORD.indexOf(a.deg) - ORD.indexOf(b.deg)).map((x) => ({ n: x.name, c: ROLE[x.deg] || C.accent })),
  hasTens: tenChips.length > 0, hasAvoid: avoid.length > 0,
  isStaff: view === 'Staff', isInv: view === 'Inversions', isFing: view === 'Fingering', isTones: view === 'Tensions',
  rootName: ROOTS[root], qName: q.n[0].toUpperCase() + q.n.slice(1), qSym: ROOTS[root] + q.k, voicing, invLabel: INV[inv], handsLabel: hands === 'Both' ? 'Both hands' : hands + ' hand', soundWord: arp ? 'Arpeggio' : 'Block',
  roots: rootGrid(root, (i) => change({ root: i })),
  playTiles: [['Block', 'Block chord'], ['Up', 'Arpeggio up'], ['Up and down', 'Arpeggio up and down']].map(([v, l]) => ({ l, on: v === playAs, bg: v === playAs ? '#FBF1DD' : '#FEFDFB', ring: v === playAs ? '0 0 0 2px #B07A2A' : '0 0 0 1px ' + C.line, pick: () => { set({ playAs: v }); sound(ms, v !== 'Block', v === 'Up and down' ? 'Up and down' : 'Up'); } })),
  qSymFs: (ROOTS[root] + q.k).length > 7 ? 12 : ((ROOTS[root] + q.k).length > 5 ? 13.5 : 15), blockOn: !arp, soundShort: arp ? 'Arpeggio' : 'Block',
  soundLabel: playAs === 'Block' ? 'Block chord' : (playAs === 'Up' ? 'Arpeggio up' : 'Up and down'),
  staffSeg: seg(['Grand staff', 'Treble only'], treble ? 'Treble only' : 'Grand staff', (l) => set({ staff: l })),
  keysSeg: seg(['Chord', '61', '88'], keys, (l) => set({ keys: l })),
  rhOn: hands !== 'Left', rhOnBg: hands !== 'Left' ? '#7FB685' : C.line, rhOnX: hands !== 'Left' ? 22 : 2,
  lhOn: hands !== 'Right', lhOnBg: hands !== 'Right' ? '#7FB685' : C.line, lhOnX: hands !== 'Right' ? 22 : 2,
  toggleRH: () => change({ hands: hands === 'Left' ? 'Both' : (hands === 'Both' ? 'Left' : 'Left') }),
  toggleLH: () => change({ hands: hands === 'Right' ? 'Both' : (hands === 'Both' ? 'Right' : 'Right') }),
  namesOn: names, namesOnBg: names ? '#7FB685' : C.line, namesOnX: names ? 22 : 2, toggleNames: () => set({ names: !names }),
  arpOn: arp, arpBg: arp ? '#F6E3BC' : 'transparent', arpInk: arp ? '#7A5418' : C.ink, openSound: () => set({ sheet: 'sound' }), isSound: sh === 'sound',
  playing: !!st.playing, notPlaying: !st.playing, playLabel: st.playing ? 'Stop' : 'Play', togglePlay: () => st.playing ? set({ playing: false }) : play(),
  prev: () => change({ inv: (inv + invN - 1) % invN }), next: () => change({ inv: (inv + 1) % invN }),
  closeSheet: () => set({ sheet: null }),
  isChord: sh === 'chord', isList: sh === 'list', isVoicing: sh === 'voicing', isHands: sh === 'hands', isKeys: sh === 'keys', isSet: sh === 'set', isView: sh === 'view', isMore: sh === 'more', isPractise: sh === 'practise',
  openChord: () => set({ sheet: 'chord' }), openList: () => set({ sheet: 'list' }), openVoicing: () => set({ sheet: 'voicing' }), openHands: () => set({ sheet: 'hands' }), openKeys: () => set({ sheet: 'keys' }), openSet: () => set({ sheet: 'set' }), openMore: () => set({ sheet: 'more' }), openPractise: () => set({ sheet: 'practise' }), backChord: () => set({ sheet: 'chord' }), backSet: () => set({ sheet: 'set' }),
};
'''

def KEYBAND(h):
    return f'<div style="position: relative; flex: none; width: 100%; height: {h}px; overflow: hidden; background: {LINE}"><sc-for list="{{{{kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 10px; border-right: 1px solid rgba(51,41,33,.16); background: {{{{k.bg}}}}; color: {{{{k.ink}}}}; font-size: 12px; font-weight: {{{{k.fw}}}}; display: flex; align-items: flex-end; justify-content: center">{{{{k.label}}}}</span></sc-for><sc-for list="{{{{kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 6px; border-radius: 0 0 5px 5px; background: {{{{k.bg}}}}; color: {INK}; font-size: 10px; font-weight: 700; display: flex; align-items: flex-end; justify-content: center">{{{{k.label}}}}</span></sc-for><div style="position: absolute; left: 0; right: 0; top: 0; height: 4px; background: #7C302C"></div><div style="position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: {LINE}"></div></div>'

def MINIKEYS(w):
    return f'<div style="position: relative; width: {w}px; max-width: 100%; height: 64px; border-radius: 4px; overflow: hidden; background: {LINE}; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{c.kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: 64px; box-sizing: border-box; border-right: 1px solid rgba(51,41,33,.14); background: {{{{k.bg}}}}"></span></sc-for><sc-for list="{{{{c.kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}"></span></sc-for></div>'

GLASSBTN = lambda label, svg, act='', href='': (f'<a href="{href}" aria-label="{label}" style="flex: none; width: 44px; height: 44px; box-sizing: border-box; border-radius: 22px; border: 1px solid {LINE}; background: {GLASS}; backdrop-filter: blur(12px); color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none">{svg}</a>' if href else f'<button type="button" aria-label="{label}" onClick="{{{{{act}}}}}" style="flex: none; width: 44px; height: 44px; box-sizing: border-box; border-radius: 22px; border: 1px solid {LINE}; background: {GLASS}; backdrop-filter: blur(12px); color: {INK}; display: flex; align-items: center; justify-content: center">{svg}</button>')

def VIEWPILL(labelled):
    # Apple's segmented control: equal segments, nouns only, the track 40 tall (radius 20), the thumb 3 in (radius 17)
    w = 'width: 112px;' if labelled else 'flex: 1 1 0; min-width: 0;'
    item = f'<button type="button" aria-pressed="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="{w} height: 34px; padding: 0 4px; border: 0; border-radius: 17px; background: {{{{v.bg}}}}; box-shadow: {{{{v.sh}}}}; color: {{{{v.fg}}}}; font: inherit; font-size: 15px; font-weight: {{{{v.fw}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{v.v}}}}</button>'
    box = 'flex: none;' if labelled else 'flex: 1; min-width: 0;'
    return f'<nav aria-label="View" style="{box} display: flex; height: 40px; box-sizing: border-box; padding: 3px; border-radius: 20px; background: {FILL}">{'<sc-for list="{{views}}" as="v" hint-placeholder-count="4">'}{item}</sc-for></nav>'

def TITLEBLOCK(size):
    # the inversion lives in the name: ‹ Cmaj7/E › (the bass after the slash), its words under it
    fs = '{{symFsP}}' if size < 50 else '{{symFsL}}'
    arrow = lambda lab, svg, act: f'<button type="button" aria-label="{lab}" onClick="{{{{{act}}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{svg}</button>'
    return f'''<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center">
<div role="group" aria-label="Inversion" style="{'align-self: stretch; justify-content: space-between; gap: 8px' if size < 50 else 'justify-content: center; gap: 28px'}; display: flex; align-items: center">{arrow('Previous inversion', CHEV_LS, 'prev')}<h1 style="{'flex: 1; min-width: 0;' if size < 50 else 'flex: none;'} margin: 0; font-family: {SERIF}; font-size: {fs}px; line-height: 1.05; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap">{{{{sym}}}}<span style="color: #B07A2A">{{{{slash}}}}</span></h1>{arrow('Next inversion', CHEV_RS, 'next')}</div>
<p style="margin: 0; font-size: 15px; color: {SOFT}">{{{{full}}}}</p>
<p style="margin: 0; font-size: 14px; font-weight: 600; color: {INK}">{{{{invLine}}}}</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; padding-top: 4px"><sc-for list="{{{{chips}}}}" as="c" hint-placeholder-count="4"><span style="height: 28px; min-width: 28px; box-sizing: border-box; padding: 0 10px; border-radius: 14px; background: {{{{c.c}}}}; color: {INK}; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{c.n}}}}</span></sc-for></div>
</div>'''

def STAFFSVG(w):
    return f'''<svg viewBox="0 0 250 172" width="{w}" style="display: block; max-width: 100%; margin: 0 auto" role="img" aria-label="The chord on the staff">
<path d="M14 30H236M14 40H236M14 50H236M14 60H236M14 70H236M14 110H236M14 120H236M14 130H236M14 140H236M14 150H236" stroke="{INK}" stroke-width="0.9"></path>
<path d="M14 30V150M236 30V150" stroke="{INK}" stroke-width="1"></path>
<text x="18" y="69" font-family="Noto Music" font-size="42" fill="{INK}">𝄞</text><text x="18" y="141" font-family="Noto Music" font-size="34" fill="{INK}">𝄢</text>
<sc-for list="{{{{sv.ledg}}}}" as="l" hint-placeholder-count="1"><path d="M{{{{l.x1}}}} {{{{l.y}}}}H{{{{l.x2}}}}" stroke="{INK}" stroke-width="1.1"></path></sc-for>
<sc-for list="{{{{sv.notes}}}}" as="n" hint-placeholder-count="4"><ellipse cx="{{{{n.x}}}}" cy="{{{{n.y}}}}" rx="7.2" ry="5" transform="rotate(-18 {{{{n.x}}}} {{{{n.y}}}})" fill="{{{{n.c}}}}" stroke="{INK}" stroke-width="1.6"></ellipse><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{INK}">{{{{n.acc}}}}</text></sc-for>
</svg>'''

def VIEWBODY(staff_w, inv_cols, mini_w):
    return f'''<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 14px 10px">{STAFFSVG(staff_w)}</div></sc-if>
<sc-if value="{{{{isInv}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: grid; grid-template-columns: repeat({inv_cols}, minmax(0, 1fr)); gap: 10px"><sc-for list="{{{{invCards}}}}" as="c" hint-placeholder-count="4"><button type="button" onClick="{{{{c.pick}}}}" style="min-width: 0; border: 0; border-radius: 16px; background: #FEFDFB; box-shadow: {{{{c.ring}}}}; padding: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; color: {INK}; font: inherit; text-align: left"><span style="font-size: 16px; font-weight: 700">{{{{c.t}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{c.s}}}}</span>{MINIKEYS(mini_w)}</button></sc-for></div></sc-if>
<sc-if value="{{{{isFing}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: flex; flex-direction: column; gap: 10px"><sc-for list="{{{{fing}}}}" as="h" hint-placeholder-count="2"><div style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px"><span style="font-size: 15px; font-weight: 700">{{{{h.h}}}}</span><div style="display: flex; gap: 8px"><sc-for list="{{{{h.cells}}}}" as="x" hint-placeholder-count="3"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 6px"><span style="font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums">{{{{x.f}}}}</span><span style="width: 100%; height: 6px; border-radius: 3px; background: {{{{x.c}}}}"></span><span style="font-size: 14px; color: {SOFT}">{{{{x.n}}}}</span></div></sc-for></div></div></sc-for></div></sc-if>
<sc-if value="{{{{isTones}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: flex; flex-direction: column; gap: 14px">
{CAPS("Chord tones")}<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{tones}}}}" as="t" hint-placeholder-count="4"><span style="height: 44px; padding: 0 14px 0 6px; border-radius: 22px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600"><span style="width: 32px; height: 32px; border-radius: 16px; background: {{{{t.c}}}}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">{{{{t.d}}}}</span>{{{{t.n}}}}</span></sc-for></div>
<sc-if value="{{{{hasTens}}}}" hint-placeholder-val="{{{{true}}}}">{CAPS("Tensions")}<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{tenChips}}}}" as="t" hint-placeholder-count="3"><button type="button" aria-pressed="{{{{t.on}}}}" onClick="{{{{t.pick}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {{{{t.bg}}}}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">{{{{t.l}}}} <span style="font-weight: 500; color: {SOFT}">{{{{t.n}}}}</span></button></sc-for></div></sc-if>
<sc-if value="{{{{hasAvoid}}}}" hint-placeholder-val="{{{{true}}}}">{CAPS("Avoid")}<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{avoid}}}}" as="t" hint-placeholder-count="1"><span style="height: 44px; padding: 0 16px; border-radius: 22px; background: {FILL}; color: {SOFT}; font-size: 15px; font-weight: 600; text-decoration: line-through; display: flex; align-items: center">{{{{t.l}}}} {{{{t.n}}}}</span></sc-for></div></sc-if>
</div></sc-if>'''

HANDL = HANDI.replace('<svg ', '<svg style="transform: scaleX(-1)" ', 1)
HANDS2 = '<span style="display: flex; gap: 0; margin: 0 -3px">' + HANDL.replace('width="22" height="22"', 'width="17" height="17"') + HANDI.replace('width="22" height="22"', 'width="17" height="17"') + '</span>'
HANDSI = '<sc-if value="{{hB}}" hint-placeholder-val="{{true}}">' + HANDS2 + '</sc-if><sc-if value="{{hR}}" hint-placeholder-val="{{false}}">' + HANDI + '</sc-if><sc-if value="{{hL}}" hint-placeholder-val="{{false}}">' + HANDL + '</sc-if>'

# The bar, grouped by what each control changes (proximity, common region): the chord (which chord, which hands
# play it) · its sound (Play, and how it plays: block or arpeggio) · the keyboard. Each group one capsule 68 tall
# (radius 34); items 56, 6 in (radius 28); every item a symbol or the chord's name over its value in words.
GROUP_CSS = f'flex: none; height: 68px; box-sizing: border-box; padding: 6px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 2px'
def TGROUP(label, inner):
    return f'<div role="group" aria-label="{label}" style="{GROUP_CSS}">{inner}</div>'
def TABBTN(label, svg, word, act, pressed='', w=60):
    pr = f'aria-pressed="{{{{{pressed}}}}}" ' if pressed else ''
    bg = 'background: {{arpBg}}; color: {{arpInk}};' if pressed else f'background: transparent; color: {INK};'
    return f'<button type="button" aria-label="{label}" {pr}onClick="{{{{{act}}}}}" style="flex: none; width: {w}px; height: 56px; padding: 0; border: 0; border-radius: 28px; {bg} font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px">{svg}<span style="font-size: 11px; font-weight: 600; line-height: 1; white-space: nowrap">{word}</span></button>'
CHORDITEM_P = f'<button type="button" aria-label="Chord: {{{{qSym}}}}" onClick="{{{{openChord}}}}" style="flex: none; width: 82px; height: 56px; padding: 0 6px; border: 0; border-radius: 28px; background: {FILL}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px"><span style="max-width: 100%; font-size: {{{{qSymFs}}}}px; font-weight: 700; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{qSym}}}}</span><span style="display: flex; align-items: center; gap: 2px; font-size: 11px; font-weight: 600; line-height: 1; color: {SOFT}">Chord{CHEV_U2.replace('width="16" height="16"', 'width="11" height="11"')}</span></button>'

DOCK_PHONE = f'<div role="toolbar" aria-label="Chord" style="position: absolute; left: 12px; right: 12px; bottom: 30px; z-index: 40; display: flex; align-items: center; justify-content: space-between; gap: 4px">' + \
    TGROUP('The chord', CHORDITEM_P + TABBTN('Hands: {{handsLabel}}', HANDSI, '{{handsLabel}}', 'openHands')) + \
    TGROUP('Sound', PLAYBTN(56) + TABBTN('Play as: {{soundLabel}}', SOUNDI, '{{soundWord}}', 'openSound', 'arpOn')) + \
    TGROUP('Keyboard', TABBTN('Keyboard', PIANOI, 'Keyboard', 'openKeys')) + '</div>'

LBTN = lambda label, svg, act, pressed='': f'<button type="button" {("aria-pressed=\"{{" + pressed + "}}\"") if pressed else ""} onClick="{{{{{act}}}}}" style="flex: none; height: 56px; padding: 0 18px 0 14px; border: 0; border-radius: 28px; {"background: {{arpBg}}; color: {{arpInk}};" if pressed else "background: transparent; color: " + INK + ";"} font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; white-space: nowrap">{svg}{label}</button>'
CHORDITEM_L = f'<button type="button" aria-label="Chord: {{{{qSym}}}}" onClick="{{{{openChord}}}}" style="flex: none; height: 56px; padding: 0 14px 0 20px; border: 0; border-radius: 28px; background: {FILL}; color: {INK}; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 6px; white-space: nowrap">{{{{qSym}}}}{CHEV_U2}</button>'
DOCK_LAPTOP = f'<div role="toolbar" aria-label="Chord" style="position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 40; display: flex; align-items: center; gap: 16px">' + \
    TGROUP('The chord', CHORDITEM_L + LBTN('{{handsLabel}}', HANDSI, 'openHands')) + \
    TGROUP('Sound', PLAYBTN(56) + LBTN('{{soundLabel}}', SOUNDI, 'openSound', 'arpOn')) + \
    TGROUP('Keyboard', LBTN('Keyboard', PIANOI, 'openKeys')) + '</div>'

# ── the sheets' bodies, the same on both sizes ──
def BACKHEAD(title, act):
    return f'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 40px"><button type="button" aria-label="Back" onClick="{{{{{act}}}}}" style="position: absolute; left: -8px; width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L}</button><span style="font-size: 17px; font-weight: 600">{title}</span></div>'

B_CHORD = (CAPS('Root') + ROOTGRID('roots') + GROUP(('link', 'Chord', '{{qName}}', 'openList'), ('link', 'Voicing', '{{voicing}}', 'openVoicing'), bg="#FEFDFB"))
B_LIST = (BACKHEAD('Chord', 'backChord') + f'<sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="4"><div style="display: flex; flex-direction: column; gap: 6px"><h3 style="margin: 6px 0 0 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{{{{g.g}}}}</h3><div style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{g.rows}}}}" as="r" hint-placeholder-count="5"><button type="button" aria-pressed="{{{{r.on}}}}" onClick="{{{{r.pick}}}}" style="width: 100%; min-height: 48px; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: {{{{r.bg}}}}; padding: 0 14px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 76px; font-size: 16px; font-weight: {{{{r.fw}}}}">{{{{r.s}}}}</span><span style="flex: 1; min-width: 0; font-size: 15px; color: {SOFT}">{{{{r.n}}}}</span></button></sc-for></div></div></sc-for>')
B_VOICING = (BACKHEAD('Voicing', 'backChord') + f'<div style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{vlist}}}}" as="v" hint-placeholder-count="6"><button type="button" aria-pressed="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="width: 100%; min-height: 56px; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 6px 14px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left; opacity: {{{{v.op}}}}"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{v.v}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{v.f}}}}</span></span><span style="font-size: 18px; font-weight: 700; color: #7A5418">{{{{v.mark}}}}</span></button></sc-for></div>')
B_HANDS = GROUP(('toggle', 'Right hand', 'rhOn', 'toggleRH'), ('toggle', 'Left hand', 'lhOn', 'toggleLH'), bg="#FEFDFB")
B_KEYS = (GROUP(('seg', 'Keys', 'keysSeg', 200), ('toggle', 'Note names', 'namesOn', 'toggleNames'), bg="#FEFDFB")
          + GROUP(('link', 'Connect a piano', '', '#'), ('link', 'All piano settings', '', '#'), bg="#FEFDFB"))
B_SOUND = f'<div role="radiogroup" style="display: flex; flex-direction: column; gap: 8px"><sc-for list="{{{{playTiles}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 60px; border: 0; border-radius: 14px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; padding: 8px 16px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; color: {INK}; font: inherit; text-align: left"><span style="font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for></div>'
def B_SET(player):
    head = f'''<div style="display: flex; align-items: center; gap: 12px"><span style="flex: none; width: 48px; height: 48px; border-radius: 12px; background: {FILL}; display: flex; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 17px; font-weight: 700">{{{{rootName}}}}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 18px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{sym}}}}</span><span style="font-size: 13px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{full}}}}</span></span><button type="button" aria-label="Share link" style="flex: none; width: 40px; height: 40px; border: 0; border-radius: 20px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{LINKI}</button><button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="flex: none; width: 40px; height: 40px; border: 0; border-radius: 20px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div>
<button type="button" onClick="{{{{openPractise}}}}" style="height: 48px; border: 0; border-radius: 14px; background: {INK}; color: #FEFDFB; font: inherit; font-size: 16px; font-weight: 700">Practise in the Player</button>'''
    return head + GROUP(('seg', 'Staff', 'staffSeg', 220), bg="#FEFDFB")
def B_PRACTISE(player):
    return BACKHEAD('Practise in the Player', 'backSet') + GROUP(('link', 'Arpeggio, up and down', '', player), ('link', 'Inversions, one after another', '', player), ('link', 'Chromatic walk, every root', '', player), bg="#FEFDFB")
B_MORE = BACKHEAD('More', 'backSet') + GROUP(('link', 'Add to a progression', '', '#'), ('link', 'Open in the Chord player', '', '#'), ('link', 'Open in the Chord finder', '', '#'), bg="#FEFDFB")

def SHEETS_PHONE(player):
    out = ''
    for cond, title, body in (('isChord', 'Chord', B_CHORD), ('isHands', 'Hands', B_HANDS), ('isKeys', 'Keyboard', B_KEYS), ('isSet', 'Chord settings', B_SET(player)), ('isSound', 'Play the chord', B_SOUND)):
        out += BSHEET(cond, title, body)
    for cond, body in (('isList', B_LIST), ('isVoicing', B_VOICING), ('isPractise', B_PRACTISE(player)), ('isMore', B_MORE)):
        out += f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.28)"></div><section role="dialog" class="nos" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 12px"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>{body}</section></sc-if>'
    return out

def POPS_LAPTOP(player):
    dockpos = 'left: calc(50% - 330px); bottom: 104px'
    out = ''
    for cond, title, body, pos in (('isChord', 'Chord', B_CHORD, dockpos), ('isHands', 'Hands', B_HANDS, 'left: calc(50% + 60px); bottom: 104px'), ('isKeys', 'Keyboard', B_KEYS, 'left: calc(50% + 120px); bottom: 104px'),
                                   ('isSet', 'Chord settings', B_SET(player), 'right: 24px; top: 76px'), ('isSound', 'Play the chord', B_SOUND, 'left: calc(50% - 250px); bottom: 104px')):
        out += POPOVER(cond, title, body, pos, 400)
    for cond, body, pos in (('isList', B_LIST, dockpos), ('isVoicing', B_VOICING, dockpos), ('isPractise', B_PRACTISE(player), 'right: 24px; top: 76px'), ('isMore', B_MORE, 'right: 24px; top: 76px')):
        out += f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" class="nos" style="position: absolute; {pos}; z-index: 61; width: 400px; max-height: 700px; overflow-y: auto; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 12px 16px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">{body}</div></sc-if>'
    return out

def ch_js(D, W, KH, minOct, mini_w):
    return CH_JS + '\n' + js('const D = ' + json.dumps(D) + ';\n' + CH_BODY(D, W, KH, minOct, mini_w))

# ── phone ──
PH_BODY = f'''<div style="flex: none; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px">{GLASSBTN('Back to Practice', CHEV_L, href='Main.dc.html')}<h1 style="margin: 0; font-size: 17px; font-weight: 600">Chords</h1>{GLASSBTN('Chord settings', COG, 'openSet')}</div>
{KEYBAND(168)}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 14px 16px 120px; display: flex; flex-direction: column; gap: 16px"><div style="flex: none; display: flex">{VIEWPILL(False)}</div>{TITLEBLOCK(44)}{VIEWBODY(330, 2, 150)}</main>
{DOCK_PHONE}'''
phone('Chords', 'Chords', PH_BODY, ch_js({'root': 0, 'q': 12}, 402, 168, 2, 150), SHEETS_PHONE('Player.dc.html'))

# ── laptop: the whole screen, as the Player's ──
LP_INNER = f'''<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: {PAGE}; color: {INK}; font-family: {FONT}; display: flex; flex-direction: column">
<div style="flex: none; height: 68px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px"><div style="display: flex; align-items: center; gap: 14px">{GLASSBTN('Back to Practice', CHEV_L, href='Laptop.dc.html')}<h1 style="margin: 0; font-size: 18px; font-weight: 600">Chords</h1></div>{GLASSBTN('Chord settings', COG, 'openSet')}</div>
{KEYBAND(220)}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 26px 40px 130px; display: flex; flex-direction: column; align-items: center; gap: 20px"><div style="width: 820px; max-width: 100%; display: flex; flex-direction: column; gap: 20px"><div style="flex: none; display: flex; justify-content: center">{VIEWPILL(True)}</div>{TITLEBLOCK(56)}{VIEWBODY(440, 4, 170)}</div></main>
{DOCK_LAPTOP}
{POPS_LAPTOP('PlayerLaptop.dc.html')}
</div>'''
open(OUT + 'ChordsLaptop.dc.html', 'w').write(HEAD % 'Chords, laptop' + LAPFRAME_TOP + LP_INNER + f"""
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
{PRE}
{ch_js({'root': 3, 'q': 14}, 1710, 220, 4, 170)}
</script>
</body>
</html>
""")
for f in ('ChordsApp', 'ChordsDesk'):
    if os.path.exists(OUT + f + '.dc.html'): os.remove(OUT + f + '.dc.html')
print('r42 chords ok')
