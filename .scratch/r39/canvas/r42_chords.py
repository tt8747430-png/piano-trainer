# R42: the Chords page. Run after r41.py (it replaces the Chords boards r41 writes).
# The keys run edge to edge at the top under Back and the Keyboard button (show or hide, Keys, Note names, Connect a
# piano), the chord is the title beneath with ‹ › stepping the inversion, the staff with its fingering under it, Practise
# in the Player, and one floating bar at the foot: the chord, Arpeggio, Play.

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
// the root as written: a letter and an accidental, so D♭ and C♯ are two roots on one key
let RL = 0;
const rootPc = (l, a) => (NATPC[l] + a + 12) % 12;
// no chord chart writes these as a root
const SKIP = ['C-1', 'F-1', 'E1', 'B1'];
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
  { g: 'Extended', k: 'maj7♯11', n: 'major seventh, sharp eleventh', t: [[0, 1], [4, 3], [7, 5], [11, 7], [18, 11]] },
  { g: 'Altered', k: '7♭9', n: 'dominant seventh, flat ninth', t: [[0, 1], [4, 3], [7, 5], [10, 7], [13, 9]] },
  { g: 'Altered', k: '7♯9', n: 'dominant seventh, sharp ninth', t: [[0, 1], [4, 3], [7, 5], [10, 7], [15, 9]] },
  { g: 'Altered', k: '7♯11', n: 'dominant seventh, sharp eleventh', t: [[0, 1], [4, 3], [7, 5], [10, 7], [18, 11]] },
  { g: 'Altered', k: '7♭13', n: 'dominant seventh, flat thirteenth', t: [[0, 1], [4, 3], [10, 7], [20, 13]] },
];
const isMin7 = (q) => q.t.some((x) => x[0] === 3 && x[1] === 3) && q.t.some((x) => x[0] === 10 && x[1] === 7);
const isDom7 = (q) => q.t.some((x) => x[0] === 4 && x[1] === 3) && q.t.some((x) => x[0] === 10 && x[1] === 7);
const VOICINGS = [
  { v: 'Close', f: 'The notes as close as they go', ok: () => '' },
  { v: 'Drop 2', f: 'Second from the top down an octave', ok: (q) => q.t.length === 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Drop 3', f: 'Third from the top down an octave', ok: (q) => q.t.length === 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Shell', f: 'Root, 3rd and 7th', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Rootless A', f: '3rd, 5th, 7th, 9th', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Rootless B', f: '7th, 9th, 3rd, 5th', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  // two-hand voicings named in the owner's transcripts (R42 v68): the left hand's notes, then the right's
  { v: 'Spread', f: 'Root and 7th low, 3rd, 5th and 9th above', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'So What', f: 'Three 4ths and a 3rd on top', ok: (q) => isMin7(q) ? '' : 'For minor sevenths' },
  { v: 'Kenny Barron', f: '1, 5, 9 under ♭3, ♭7, 11', ok: (q) => isMin7(q) ? '' : 'For minor sevenths' },
  { v: 'Upper structure', f: 'A major triad a tone up over 3rd and 7th', ok: (q) => isDom7(q) ? '' : 'For dominant sevenths' },
];
// how many of a two-hand voicing's notes, from the bottom, the left hand plays
const TWO = { 'Spread': 2, 'So What': 3, 'Kenny Barron': 3, 'Upper structure': 2 };
const ORD = [1, 2, 3, 4, 5, 6, 7, 9, 11, 13];
const INV = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'];
const INVS = ['Root', '1st', '2nd', '3rd'];
const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };
const DEGL = { 1: 'R', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 9: '9', 11: '11', 13: '13' };
function spell(root, semi, deg) {
  const rl = RL; const pc = (root + semi) % 12; const L = LET[(rl + deg - 1) % 7];
  const d = ((pc - NATPC[LET.indexOf(L)] + 18) % 12) - 6; return { L, d, name: L + ACC[String(d)] };
}
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
function voice(root, q, inv, voicing, hands) {
  if (hands === 'Split' && TWO[voicing]) hands = 'Both';
  const base = 60 + root; // every root in the octave from middle C, as a chord chart shows it
  const s = (deg) => (q.t.find((x) => x[1] === deg) || [null])[0];
  const third = s(3) ?? s(4) ?? s(2); const dom = isDom7(q);
  let src;
  if (voicing === 'Shell') src = [[0, 1], [third, s(3) != null ? 3 : (s(4) != null ? 4 : 2)], [s(7), 7]];
  // rootless: 3-5-7-9 and 7-9-3-5; on a dominant the 13th takes the 5th's place (jps-podcast/292 @02:10, exercises/116 @30:16)
  else if (voicing === 'Rootless A') src = [[third, 3], dom ? [9, 13] : [s(5) ?? 7, 5], [s(7), 7], [s(9) ?? 14, 9]];
  else if (voicing === 'Rootless B') src = [[s(7) - 12, 7], [(s(9) ?? 14) - 12, 9], [third, 3], dom ? [9, 13] : [s(5) ?? 7, 5]];
  // spread: LH 1-7, RH 3, 5 (13 on a dominant), 9 (exercises/116 @29:11, jps-podcast/245 @12:32)
  else if (voicing === 'Spread') src = [[-12, 1], [s(7) - 12, 7], [third, 3], dom ? [9, 13] : [s(5) ?? 7, 5], [s(9) ?? 14, 9]];
  // So What: three 4ths from the root, a major 3rd on top (watch-later/008 @07:00)
  else if (voicing === 'So What') src = [[-12, 1], [-7, 11], [-2, 7], [3, 3], [7, 5]];
  // Kenny Barron: 1-5-9 under b3-b7-11 (watch-later/008 @07:00)
  else if (voicing === 'Kenny Barron') src = [[-12, 1], [-5, 5], [2, 9], [3, 3], [10, 7], [17, 11]];
  // upper structure II: the tritone 3-7 low, a major triad a tone up (9, #11, 13) above (exercises/148 @04:14, 069)
  else if (voicing === 'Upper structure') src = [[third - 12, 3], [s(7) - 12, 7], [2, 9], [6, 11], [9, 13]];
  else src = q.t.map((x) => x.slice());
  let ns = src.map(([semi, deg]) => ({ m: base + semi, semi, deg }));
  ns.sort((a, b) => a.m - b.m);
  const n = Math.min(inv, ns.length - 1);
  for (let i = 0; i < n; i++) ns[i].m += 12;
  ns.sort((a, b) => a.m - b.m);
  if (voicing === 'Drop 2' && ns.length === 4) ns[2].m -= 12;
  if (voicing === 'Drop 3' && ns.length === 4) ns[1].m -= 12;
  ns.sort((a, b) => a.m - b.m);
  ns.forEach((x) => { x.hand = 'R'; });
  if (TWO[voicing]) { const k = TWO[voicing]; ns.forEach((x, i) => { x.hand = i < k ? 'L' : 'R'; });
    if (hands === 'Right') ns = ns.slice(k); if (hands === 'Left') ns = ns.slice(0, k);
    const keep2 = []; ns.forEach((x) => { if (!keep2.some((y) => y.m === x.m)) keep2.push(x); }); return keep2.map((x) => Object.assign(x, spell(root, ((x.semi % 12) + 12) % 12, x.deg))); }
  // The hands (R42 v71). One hand plays the whole chord as voiced, five notes at most (the 5th, then the 11th, first
  // out): Right from middle C, Left an octave down; Both plays it in each hand, an octave apart (C3 E3 G3 | C4 E4 G4).
  // Bass + upper chord: the root alone in the left hand and the rest in the right, as Gorshkov sets ninth chords, "с
  // басом в левой и в правой — септаккорд, оставшиеся 4 ноты" (courses/gorshkov/02-ninth-chords/theory.pdf, p. 4):
  // Gm9 = G | B♭maj7, Cmaj7 = C | Em.
  if (hands === 'Split') { const whole = !upperOf(root, q); let up = q.t.filter((x) => whole || x[1] !== 1).map(([semi, deg]) => ({ m: 60 + root + semi, semi, deg, hand: 'R' })).sort((x, y) => x.m - y.m);
    for (let i = 0; i < Math.min(inv, up.length - 1); i++) up[i].m += 12; up.sort((x, y) => x.m - y.m);
    while (up[0].m - 12 >= 57) up.forEach((x) => { x.m -= 12; });
    ns = [{ m: 48 + root, semi: 0, deg: 1, hand: 'L' }].concat(up); }
  else { [5, 11, 13].forEach((d) => { if (ns.length > 5) ns = ns.filter((x) => x.deg !== d); });
    const lh = ns.map((x) => Object.assign({}, x, { m: x.m - 12, hand: 'L' }));
    if (hands === 'Left') ns = lh; if (hands === 'Both') ns = lh.concat(ns); }
  const keep = []; ns.forEach((x) => { if (!keep.some((y) => y.m === x.m)) keep.push(x); });
  return keep.map((x) => Object.assign(x, spell(root, ((x.semi % 12) + 12) % 12, x.deg)));
}
// the chord over its root, named: Gm9 = G | B♭maj7, Cmaj7 = C | Em (R42 v71); '' when the rest is no named chord
function upperOf(root, q) { const up = q.t.filter((x) => x[1] !== 1); if (up.length < 3) return '';
  const b = up[0][0], rel = up.map((x) => x[0] - b); const m = QS.find((x) => x.g !== 'Altered' && x.t.length === rel.length && x.t.every((y, i) => y[0] === rel[i]));
  return m ? spell(root, ((b % 12) + 12) % 12, up[0][1]).name + m.k : ''; }
function fingers(list, hand, inv, close) {
  const n = list.length; if (!n) return [];
  const R = hand === 'R';
  if (n === 3 && close) return R ? [[1, 3, 5], [1, 2, 5], [1, 3, 5]][inv % 3] : [[5, 3, 1], [5, 3, 1], [5, 2, 1]][inv % 3];
  if (n === 4) { const g = [1, 2, 3].map((i) => list[i].m - list[i - 1].m), lo = Math.min(...g), k = lo <= 2 ? g.indexOf(lo) : -1;
    return R ? (k === 2 ? [1, 2, 4, 5] : [1, 2, 3, 5]) : (k === 0 ? [5, 4, 2, 1] : [5, 3, 2, 1]); }
  if (R) return ({ 1: [1], 2: [1, 5], 3: [1, 3, 5], 5: [1, 2, 3, 4, 5] })[n] || [1, 2, 3, 4, 5].slice(0, n);
  return ({ 1: [5], 2: [5, 1], 3: [5, 3, 1], 5: [5, 4, 3, 2, 1] })[n] || [5, 4, 3, 2, 1].slice(0, n);
}
// the grand staff: y of each note, ledger lines, seconds side by side
function staff(notes, treble, W, fm, cx0, vw) {
  const cx = cx0 ?? W / 2; const out = [], ledg = [];
  const dnOf = (x) => (Math.floor((x.m - x.d) / 12) - 1) * 7 + LET.indexOf(x.L);
  const onT = (x) => treble || (x.hand ? x.hand === 'R' : x.m >= 60);
  let prev = { T: null, B: null };
  notes.forEach((x) => {
    const dn = dnOf(x), T = onT(x), y = T ? 70 - (dn - 30) * 5 : 150 - (dn - 18) * 5, key = T ? 'T' : 'B';
    const p = prev[key]; const shift = p && dn - p.dn === 1 && !p.shift; const nx = cx + (shift ? 14 : 0);
    out.push({ T, m: x.m, f: fm[x.m] || '', x: nx, y, ay: y + 5, ax: cx - 22 - (shift ? 0 : 0), acc: ACC[String(x.d)], a1: x.d === -1, a2: x.d === 1, a3: x.d === -2, a4: x.d === 2, c: ROLE[x.deg] || C.ink });
    prev[key] = { dn, shift };
    const lo = T ? 28 : 16, hi = T ? 40 : 28;
    if (T) { for (let k = 28; k >= dn; k -= 2) ledg.push({ y: 70 - (k - 30) * 5, x1: cx - 11, x2: nx + 11 }); for (let k = 40; k <= dn; k += 2) ledg.push({ y: 70 - (k - 30) * 5, x1: cx - 11, x2: nx + 11 }); }
    else { for (let k = 16; k >= dn; k -= 2) ledg.push({ y: 150 - (k - 18) * 5, x1: cx - 11, x2: nx + 11 }); for (let k = 28; k <= dn; k += 2) ledg.push({ y: 150 - (k - 18) * 5, x1: cx - 11, x2: nx + 11 }); }
  });
  // each finger number beside its note, right of the chord, as printed charts set it; seconds pushed apart
  const shifted = out.some((n) => n.x !== cx), fx = cx + (shifted ? 30 : 17); const digits = [];
  [true, false].forEach((k) => { let last = null; out.filter((n) => n.T === k && n.f).sort((a, b) => b.y - a.y).forEach((n) => { let y = n.y + 4; if (last !== null && last - y < 10) y = last - 10; last = y; digits.push({ x: fx, y, f: n.f, f1: n.f === 1, f2: n.f === 2, f3: n.f === 3, f4: n.f === 4, f5: n.f === 5 }); }); });
  const ys = out.map((n) => n.y).concat(digits.map((d) => d.y - 8)), vt = Math.min(4, Math.min(...ys) - 12), vbot = Math.max(168, Math.max(...ys) + 12);
  return { notes: out, ledg, digits, vb: '0 ' + vt + ' ' + (vw || 250) + ' ' + (vbot - vt), vt, vbot };
}
function range(ms, keys, minOct) {
  if (keys === '88') return [21, 108]; if (keys === '76') return [28, 103]; if (keys === '61') return [36, 96];
  let lo = Math.floor(Math.min(...ms) / 12) * 12, hi = Math.floor(Math.max(...ms) / 12) * 12 + 11;
  let n = 0; while ((hi - lo + 1) / 12 < minOct) { if (n++ % 2 === 0) hi += 12; else lo -= 12; }
  return [lo, hi];
}
'''

def CH_BODY(D, W, KH, minOct, mini_w):
    return r'''
const rl0 = LET.indexOf(CROOTS[D.root][0]), ra0 = CROOTS[D.root].length > 1 ? (CROOTS[D.root][1] === '♯' ? 1 : -1) : 0;
const rLet = st.rl ?? rl0, rAcc = st.ra ?? ra0; RL = rLet;
const root = rootPc(rLet, rAcc), RN = LET[rLet] + ACC[String(rAcc)], qi = st.q ?? D.q, q = QS[qi];
const voicing = VOICINGS.find((v) => v.v === (st.voicing || 'Close')).ok(q) ? 'Close' : (st.voicing || 'Close');
const invN = TWO[voicing] ? 1 : Math.min(4, voicing === 'Shell' ? 3 : (voicing.startsWith('Rootless') ? 4 : q.t.length));
const inv = Math.min(st.inv ?? 0, invN - 1);
const upper = (() => { const u = upperOf(root, q); RL = rLet; return u; })(), canSplit = !TWO[st.voicing || 'Close'];
const bassOn = false, hands = st.hand === 'Split' && !canSplit ? 'Both' : (st.hand || 'Right'), fingOn = true, kbShow = st.kbShow ?? true, keys = st.keys || 'Chord';
const playAs = 'Block', arp = false, dir = 'Up', keyLabel = st.keyLabel || 'Names', names = keyLabel === 'Names', fingKeys = false, treble = false, auto = true;
const oct = st.oct || 0; // an added chord may sit an octave lower, to stay under the hand (voice leading)
const ns = voice(root, q, inv, voicing, hands).map((x) => Object.assign(x, { m: x.m + 12 * oct }));
const ms = ns.map((x) => x.m);
const sym = RN + q.k;
const bassName = inv > 0 && q.t[inv] ? spell(root, ((q.t[inv][0] % 12) + 12) % 12, q.t[inv][1]).name : '';
const slash = bassName ? '/' + bassName : '';
const symLen = (sym + slash).length;
const symScale = symLen <= 6 ? 1 : (symLen <= 9 ? 0.78 : 0.6);
const full = RN + ' ' + q.n;
const playMode = st.playMode || 'Block';
const play = (a, d) => { set({ playing: a ? 'arp' : 'chord' }); const t = sound(ms, a, d || 'Up'); clearTimeout(this._t); this._t = setTimeout(() => set({ playing: false }), t); };
const change = (o) => { set(o); if (auto) { const r = o.root ?? root, qq = QS[o.q ?? qi], iv = o.inv ?? inv; const vv = o.voicing || voicing; const hh = o.hand || hands; sound(voice(r, qq, Math.min(iv, qq.t.length - 1), VOICINGS.find((v) => v.v === vv).ok(qq) ? 'Close' : vv, hh).map((x) => x.m), false, dir); } };
const [lo, hi] = range(ms, keys, ''' + str(minOct) + r''');
const Rn = ns.filter((x) => x.hand === 'R'), Ln = ns.filter((x) => x.hand === 'L');
const fm = {}; fingers(Rn, 'R', inv, voicing === 'Close').forEach((f, i) => { fm[Rn[i].m] = f; }); fingers(Ln, 'L', inv, voicing === 'Close').forEach((f, i) => { fm[Ln[i].m] = f; });
const marks = {}; ns.forEach((x) => { marks[x.m] = [ROLE[x.deg] || C.accent, names ? x.name : '']; });
const kb = calmKeys(lo, hi, marks, ''' + str(W) + ', ' + str(KH) + r''');
{ let wi = 0, bi = 0; for (let m = lo; m <= hi; m++) { const k = NAT.includes(m % 12) ? kb.whites[wi++] : kb.blacks[bi++]; if (k) k.fing = fingKeys && fm[m] ? String(fm[m]) : ''; } }
const bass = ns[0];
const shape = INV[inv] + (inv ? ' · ' + bass.name + ' in the bass' : '') + ' · ' + voicing;
const R = Rn, L = Ln; const fR = R.map((x) => fm[x.m]), fL = L.map((x) => fm[x.m]);
// the staff holds the chords the learner has gathered, in order; the current one is the page's chord
const snap = { rl: rLet, ra: rAcc, q: qi, inv, voicing: st.voicing || 'Close', hand: hands, oct };
const cur0 = st.cur ?? 0;
const seq = (st.seq || [snap]).map((c, i) => (i === cur0 ? snap : c));
const cur = Math.min(cur0, seq.length - 1);
const symOf = (c) => { RL = c.rl; const rt = rootPc(c.rl, c.ra), qq = QS[c.q]; const vv = VOICINGS.find((v) => v.v === c.voicing).ok(qq) ? 'Close' : c.voicing; const nI = TWO[vv] ? 1 : Math.min(4, vv === 'Shell' ? 3 : (vv.startsWith('Rootless') ? 4 : qq.t.length)); const iv = Math.min(c.inv, nI - 1); const v = voice(rt, qq, iv, vv, c.hand).map((x) => Object.assign(x, { m: x.m + 12 * (c.oct || 0) })); const bn = iv > 0 && qq.t[iv] ? spell(rt, ((qq.t[iv][0] % 12) + 12) % 12, qq.t[iv][1]).name : ''; const out = { v, iv, vv, s: LET[c.rl] + ACC[String(c.ra)] + qq.k + (bn ? '/' + bn : '') }; RL = rLet; return out; };
const SLOT = 78, X0 = 64, SW = Math.max(250, X0 + seq.length * SLOT + 48);
const sv = (() => { const all = { notes: [], ledg: [], digits: [], cols: [] }, per = []; let vt = 4, vbot = 168;
  seq.forEach((c, i) => { const o = symOf(c); const cx = seq.length === 1 ? 140 : X0 + SLOT * (i + 0.5);
    const R1 = o.v.filter((x) => x.hand === 'R'), L1 = o.v.filter((x) => x.hand === 'L'); const f1 = {};
    fingers(R1, 'R', o.iv, o.vv === 'Close').forEach((f, k) => { f1[R1[k].m] = f; }); fingers(L1, 'L', o.iv, o.vv === 'Close').forEach((f, k) => { f1[L1[k].m] = f; });
    const one = staff(o.v, treble, SW, fingOn && i === cur ? f1 : {}, cx, SW); per.push(one.notes); all.notes.push(...one.notes); all.ledg.push(...one.ledg); all.digits.push(...one.digits);
    vt = Math.min(vt, one.vt); vbot = Math.max(vbot, one.vbot);
    const on = i === cur; all.cols.push({ s: o.s, on, many: seq.length > 1, x: cx, left: (cx / SW * 100) + '%', fw: on ? 700 : 500, tc: on ? C.ink : C.soft, bg: on && seq.length > 1 ? '#F6E3BC' : 'transparent', aria: o.s + (on ? ', shown above' : ', show it'), pick: () => pickChord(i), canRemove: on && seq.length > 1, remove: () => removeChord() }); });
  const hl = seq.length > 1 ? [{ x: X0 + SLOT * cur + 6, w: SLOT - 12, y: vt + 2, h: vbot - vt - 4, f: '#F6E3BC', o: 0.55 }] : [];
  if (st.playing === 'all' && st.sounding != null && st.sounding !== cur) hl.push({ x: X0 + SLOT * st.sounding + 6, w: SLOT - 12, y: vt + 2, h: vbot - vt - 4, f: '#EDC684', o: 0.5 });
  if (st.playing === 'all' && st.sounding === cur) hl[0] = Object.assign({}, hl[0], { f: '#EDC684', o: 0.7 });
  // how the chords connect (R42 v74): a note both chords share is tied, as a held note is written; every other note is
  // traced to the nearest note it moves to. "move as little as possible… whenever there's a common note… keep it"
  // (transcriptions/youtube/watch-later/065 @14:18); "annotate it… by using arrows" (exercises/081 @08:14)
  let held = '', moved = '';
  for (let i = 1; i < per.length; i++) { const A = per[i - 1], B = per[i]; [true, false].forEach((T) => { const a = A.filter((n) => n.T === T), b = B.filter((n) => n.T === T);
    b.forEach((n) => { const same = a.find((p) => p.m === n.m);
      if (same) { held += 'M' + (same.x + 10) + ' ' + (same.y + 3) + 'Q' + ((same.x + n.x) / 2) + ' ' + (same.y + 11) + ' ' + (n.x - 10) + ' ' + (n.y + 3); return; }
      const free = a.filter((p) => !b.some((q) => q.m === p.m)); if (!free.length) return; const from = free.slice().sort((p, q) => Math.abs(p.m - n.m) - Math.abs(q.m - n.m))[0];
      if (Math.abs(from.m - n.m) <= 4) moved += 'M' + (from.x + 11) + ' ' + from.y + 'L' + (n.x - 11) + ' ' + n.y; }); }); }
  let path = ''; [30, 40, 50, 60, 70, 110, 120, 130, 140, 150].forEach((y) => { path += 'M14 ' + y + 'H' + (SW - 14); });
  return { held: held || 'M0 0', moved: moved || 'M0 0', vt, vbot, notes: all.notes, ledg: all.ledg, digits: all.digits, cols: all.cols, hl, path, bars: 'M14 30V150M' + (SW - 14) + ' 30V150', vb: '0 ' + vt + ' ' + SW + ' ' + (vbot - vt), maxw: Math.round(SW * (seq.length === 1 ? 1.32 : 1.18)), minw: seq.length > 3 ? (seq.length * 70 + 80) + 'px' : '0' }; })();
const loadChord = (c) => ({ rl: c.rl, ra: c.ra, q: c.q, inv: c.inv, voicing: c.voicing, hand: c.hand, oct: c.oct || 0 });
const soundOf = (c) => sound(symOf(c).v.map((x) => x.m), false, 'Up');
const pickChord = (i) => { if (i === cur) { soundOf(seq[i]); return; } set(Object.assign({ seq, cur: i, toast: null }, loadChord(seq[i]))); soundOf(seq[i]); };
const addChord = () => { if (seq.length >= 8) return; const s2 = seq.concat([Object.assign({}, snap, { inv: 0 })]); set({ seq: s2, cur: s2.length - 1, inv: 0, sheet: 'chord', toast: null }); };
const removeChord = () => { const gone = symOf(seq[cur]).s; const s2 = seq.filter((_, i) => i !== cur); const c2 = Math.max(0, cur - 1); clearTimeout(this._toast); this._toast = setTimeout(() => set({ toast: null }), 5000); set(Object.assign({ seq: s2, cur: c2, toast: { t: gone + ' removed', undo: { seq, cur } } }, loadChord(s2[c2]))); };
const undoRemove = () => { const u = st.toast && st.toast.undo; if (!u) return; set(Object.assign({ seq: u.seq, cur: u.cur, toast: null }, loadChord(u.seq[u.cur]))); };
const scope = seq.length > 1 ? (st.scope || 'All') : 'One';
const stepMs = (n) => (playMode === 'Block' ? 1100 : (playMode === 'UpDown' ? 2 * n - 1 : n) * 200 + 700);
const stopAll = () => { (this._seqT || []).forEach(clearTimeout); clearTimeout(this._t); set({ playing: false, sounding: null }); };
const playSeq = () => { stopAll(); let t = 0; set({ playing: 'all', sheet: null, sounding: 0 });
  this._seqT = seq.map((c, i) => { const m2 = symOf(c).v.map((x) => x.m), at = t; t += stepMs(m2.length);
    return setTimeout(() => { set({ sounding: i }); sound(m2, playMode !== 'Block', playMode === 'UpDown' ? 'Up and down' : 'Up'); }, at); });
  this._t = setTimeout(() => set({ playing: false, sounding: null }), t + 200); };
const playAll = () => { set({ sheet: null, playing: 'all' }); clearTimeout(this._t); seq.forEach((c, i) => setTimeout(() => soundOf(c), i * 1100)); this._t = setTimeout(() => set({ playing: false }), seq.length * 1100 + 600); };
// + offers the next chord: the key's chords (the first chord's key), the likeliest after the current one first,
// each in the inversion that moves least from it, as a pianist voices a progression (R42 v69)
const tonic = seq[0], tq = QS[tonic.q];
const minorKey = tq.t.some((x) => x[0] === 3 && x[1] === 3), sevKey = tq.t.some((x) => x[1] === 7);
const STEPS = minorKey ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
const KQ = minorKey ? (sevKey ? ['m7', 'ø7', 'maj7', 'm7', '7', 'maj7', '7'] : ['m', '°', '', 'm', '', '', '']) : (sevKey ? ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'ø7'] : ['', 'm', 'm', '', '', 'm', '°']);
const ROM = minorKey ? ['i', 'ii°', 'III', 'iv', 'V', 'VI', 'VII'] : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const NEXT = minorKey ? { 0: [3, 4, 5, 6], 1: [4, 0], 2: [5, 3], 3: [4, 0, 6], 4: [0, 5], 5: [3, 1, 4], 6: [2, 0] } : { 0: [3, 4, 5, 1], 1: [4, 6], 2: [5, 3], 3: [4, 0, 1], 4: [0, 5], 5: [3, 1, 4], 6: [0] };
const tpc = rootPc(tonic.rl, tonic.ra), curDeg = STEPS.indexOf(((rootPc(seq[cur].rl, seq[cur].ra) - tpc) % 12 + 12) % 12);
const order = (NEXT[curDeg] || NEXT[0]).concat([0, 1, 2, 3, 4, 5, 6]).filter((d, i, a) => a.indexOf(d) === i && d !== curDeg);
const keyName = LET[tonic.rl] + ACC[String(tonic.ra)] + (minorKey ? ' minor' : ' major');
const nearest = (c) => { const prev = symOf(seq[seq.length - 1]).v.map((x) => x.m), qq = QS[c.q]; const vv = VOICINGS.find((v) => v.v === c.voicing).ok(qq) ? 'Close' : c.voicing;
  const nI = TWO[vv] ? 1 : Math.min(4, vv === 'Shell' ? 3 : (vv.startsWith('Rootless') ? 4 : qq.t.length)); let best = 0, bd = 1e9;
  let bo = 0; [0, -1, 1].forEach((o) => { for (let i = 0; i < nI; i++) { RL = c.rl; const v = voice(rootPc(c.rl, c.ra), qq, i, vv, c.hand); const d = v.reduce((t, x) => t + Math.min(...prev.map((p) => Math.abs(p - (x.m + 12 * o)))), 0); if (d < bd) { bd = d; best = i; bo = o; } } });
  RL = rLet; c.oct = bo; return best; };
// transpose every chord on the staff at once, to a key or a half step; spelled as the new key spells (R42 v73)
const SERIFF = "'Iowan Old Style', 'Palatino', Georgia, serif";
const KEYSP = minorKey ? ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'] : ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const transposeTo = (pc2) => { const semi = ((pc2 - tpc) % 12 + 12) % 12; if (!semi) return; const dl = (LET.indexOf(KEYSP[pc2][0]) - tonic.rl + 7) % 7;
  const s2 = seq.map((c) => { const pc = (rootPc(c.rl, c.ra) + semi) % 12; let l = (c.rl + dl) % 7, a = ((pc - NATPC[l] + 18) % 12) - 6;
    if (Math.abs(a) > 1) { const o = [0, 1, 2, 3, 4, 5, 6].map((L) => ({ L, a: ((pc - NATPC[L] + 18) % 12) - 6 })).filter((o) => Math.abs(o.a) <= 1).sort((x, y) => Math.abs(x.a) - Math.abs(y.a))[0]; l = o.L; a = o.a; }
    return Object.assign({}, c, { rl: l, ra: a }); });
  set(Object.assign({ seq: s2, toast: null }, loadChord(s2[cur]))); soundOf(s2[cur]); };
const keyTiles = KEYSP.map((n, pc) => ({ s: n + (minorKey ? 'm' : ''), on: pc === tpc, bg: pc === tpc ? '#F6E3BC' : '#FEFDFB', ring: pc === tpc ? 'none' : '0 0 0 1px ' + C.line, fw: pc === tpc ? 800 : 600, aria: 'Transpose to ' + n + (minorKey ? ' minor' : ' major'), pick: () => transposeTo(pc) }));
const addNext = (c) => { const s2 = seq.concat([c]); set(Object.assign({ seq: s2, cur: s2.length - 1, sheet: null, toast: null }, loadChord(c))); soundOf(c); };
const nextList = order.slice(0, 6).map((d, k) => { const pc = (tpc + STEPS[d]) % 12, l = (tonic.rl + d) % 7, a = ((pc - NATPC[l] + 18) % 12) - 6, q2 = QS.findIndex((x) => x.k === KQ[d]);
  const c = { rl: l, ra: a, q: q2, inv: 0, voicing: snap.voicing, hand: hands }; c.inv = nearest(c);
  const r = sevKey ? ROM[d].replace('°', '') + ({ maj7: 'maj7', 'ø7': 'ø7', m7: '7', 7: '7' })[KQ[d]] : ROM[d];
  return { s: LET[l] + ACC[String(a)] + QS[q2].k, r, bg: k === 0 ? '#F6E3BC' : '#FEFDFB', ring: k === 0 ? 'none' : '0 0 0 1px ' + C.line, aria: 'Add ' + LET[l] + ACC[String(a)] + QS[q2].k + ', ' + r, pick: () => addNext(c) }; });
const fing = [['Right hand', R, fR], ['Left hand', L, fL]].filter((h) => h[1].length).map(([h, list, f]) => ({ h, cells: list.map((x, i) => ({ n: x.name, f: f[i], c: ROLE[x.deg] || C.accent })) }));
const invCards = Array.from({ length: invN }, (_, i) => {
  const v = voice(root, q, i, voicing, 'Right'); const [a, b] = [Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12, Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12 + 23];
  const mk = {}; v.forEach((x) => { mk[x.m] = [ROLE[x.deg] || C.accent, '']; });
  return { t: INV[i], s: v.map((x) => x.name).join(' · '), kb: calmKeys(a, Math.max(b, Math.max(...v.map((x) => x.m))), mk, ''' + str(mini_w) + r''', 64), ring: i === inv ? '0 0 0 2px ' + C.ink : '0 0 0 1px ' + C.line, pick: () => { change({ inv: i }); } };
});
const tones = ns.filter((x) => x.hand !== 'L' || hands === 'Left').filter((x, i, a) => a.findIndex((y) => y.deg === x.deg) === i).map((x) => ({ n: x.name, d: DEGL[x.deg], c: ROLE[x.deg] || C.accent }));
const groups = ['Triads', 'Added notes', 'Sevenths', 'Extended', 'Altered'].map((g) => ({ g, rows: QS.map((x, i) => [x, i]).filter(([x]) => x.g === g).map(([x, i]) => ({ s: RN + x.k, n: RN + ' ' + x.n, on: i === qi, bg: i === qi ? '#F6E3BC' : 'transparent', fw: i === qi ? 700 : 500, pick: () => change({ q: i, sheet: 'chord' }),
    inSeq: seq.some((c) => c.q === i && c.rl === rLet && c.ra === rAcc), chk: seq.some((c) => c.q === i && c.rl === rLet && c.ra === rAcc) ? '✓' : '',
    chkBg: seq.some((c) => c.q === i && c.rl === rLet && c.ra === rAcc) ? '#B07A2A' : 'transparent', chkRing: seq.some((c) => c.q === i && c.rl === rLet && c.ra === rAcc) ? 'none' : '0 0 0 2px ' + C.line,
    chkAria: (seq.some((c) => c.q === i && c.rl === rLet && c.ra === rAcc) ? 'On the staff: ' : 'Show on the staff: ') + RN + x.k,
    toggle: () => { const k = seq.findIndex((c) => c.q === i && c.rl === rLet && c.ra === rAcc);
      if (k < 0) { if (seq.length >= 8) return; const c = { rl: rLet, ra: rAcc, q: i, inv: 0, voicing: snap.voicing, hand: hands }; c.inv = nearest(c); set({ seq: seq.concat([c]) }); soundOf(c); return; }
      if (seq.length === 1) return; const s2 = seq.filter((_, j) => j !== k), c2 = k === cur ? Math.max(0, k - 1) : (k < cur ? cur - 1 : cur);
      clearTimeout(this._toast); this._toast = setTimeout(() => set({ toast: null }), 5000);
      set(Object.assign({ seq: s2, cur: c2, toast: { t: symOf(seq[k]).s + ' removed', undo: { seq, cur } } }, loadChord(s2[c2]))); } })) }));
const vlist = VOICINGS.map((v) => { const why = v.ok(q); return { v: v.v, f: why || v.f, op: why ? 0.42 : 1, on: v.v === voicing, mark: v.v === voicing ? '✓' : '', pick: () => { if (!why) change(Object.assign({ voicing: v.v, sheet: 'chord', inv: 0 }, TWO[v.v] ? { hand: 'Both' } : {})); } }; });
const sh = st.sheet || '';
const handsBadge = hands === 'Both' ? '2' : (hands === 'Right' ? 'R' : 'L');
const hB = hands === 'Both', hR = hands === 'Right', hL = hands === 'Left';
return {
  sym, full, shape, kb, sv, fing, invCards, tones, groups, vlist, handsBadge, hB, hR, hL, slash, hasSlash: !!slash, symFsP: Math.round(44 * symScale), symFsL: Math.round(64 * symScale), invLine: INV[inv] + (slash ? ', ' + bassName + ' in the bass' : '') + ' · ' + voicing + ' voicing' + (hands === 'Right' ? '' : (hands === 'Both' ? ' · both hands' : (hands === 'Split' ? ' · ' + RN + ' | ' + upper : ' · left hand'))),
  notes: ns.filter((x) => x.hand !== 'L' || hands === 'Left').filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i).sort((a, b) => ORD.indexOf(a.deg) - ORD.indexOf(b.deg)).map((x) => ({ n: x.name, d: ({ 1: 'root', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 9: '9th', 11: '11th', 13: '13th' })[x.deg], c: ROLE[x.deg] || C.accent })),
  // the chord's notes from the bottom up, as they sound, each with its role: the order changes with the inversion
  stackH: (() => { const seen = []; voice(root, q, 0, voicing, 'Right').forEach((x) => { if (!seen.includes(x.name)) seen.push(x.name); }); RL = rLet; return seen.length * 44 - 8; })() + 'px',
  arcH: (() => { const seen = []; voice(root, q, 0, voicing, 'Right').forEach((x) => { if (!seen.includes(x.name)) seen.push(x.name); }); RL = rLet; return (seen.length - 1) * 44; })() + 'px',
  liftBass: () => change({ inv: (inv + 1) % invN }),
  ringTfUnused: 'rotate(' + (-inv * 360 / Math.max(1, (() => { const seen = []; voice(root, q, 0, voicing, 'Right').forEach((x) => { if (!seen.includes(x.name)) seen.push(x.name); }); RL = rLet; return seen.length; })())) + 'deg)',
  invWord: ['Root', '1st', '2nd', '3rd'][inv], invSub: inv ? 'inversion' : 'position', bassName: (() => { const v = voice(root, q, inv, voicing, 'Right'); RL = rLet; return v[0].name; })(),
  // the chord's notes in chord order (root, 3rd, 5th, 7th); tapping one puts it in the bass: that is the inversion
  noteCols: (() => { const basses = Array.from({ length: invN }, (_, i) => { const v = voice(root, q, i, voicing, hands); RL = rLet; return v[0].name; });
    const seen = []; const tones = (hands === 'Right' ? voice(root, q, 0, voicing, 'Right') : q.t.map(([semi, deg]) => Object.assign({ deg }, spell(root, ((semi % 12) + 12) % 12, deg)))).filter((x) => { if (seen.includes(x.name)) return false; seen.push(x.name); return true; }); RL = rLet;
    const N = tones.length; const R = -inv * 360 / N;
    return tones.map((x, k) => { const pos = (k - inv + N) % N; const j = basses.indexOf(x.name); const on = j === inv; const can = j >= 0;
      return { rw: on ? 700 : 400, rc: on ? C.ink : C.soft, y: ((N - 1 - pos) * 44) + 'px', z: pos === N - 1 ? 2 : 1, fill: on ? (ROLE[x.deg] || C.accent) : '#FEFDFB', bw: on ? '0' : '2.5px', n: x.name, d: ({ 1: 'root', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 9: '9th', 11: '11th', 13: '13th' })[x.deg], c: ROLE[x.deg] || C.accent, on, can,
        aria: x.name + ', the ' + (({ 1: 'root' })[x.deg] || 'chord tone') + (can ? (on ? ', in the bass' : ', put it in the bass') : ''),
        bg: on ? '#FEFDFB' : 'transparent', sh: on ? '0 1px 3px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.12)' : 'none', op: can ? 1 : 0.55,
        pick: () => { if (can) change({ inv: j }); } }; }); })(),
  slashC: (() => { const v = voice(root, q, inv, voicing, 'Right'); RL = rLet; return ROLE[v[0].deg] ? 'color-mix(in srgb, ' + ROLE[v[0].deg] + ' 70%, #332921)' : '#B07A2A'; })(),
  symL: RN[0], symA: RN.slice(1), hasSymA: RN.length > 1, symQ: q.k,
  invName: INV[inv], isInvMenu: sh === 'inv', openInv: () => set({ sheet: sh === 'inv' ? null : 'inv' }),
  invItems: Array.from({ length: invN }, (_, i) => { const v = voice(root, q, i, voicing, 'Right'); RL = rLet; return { t: INV[i], s: v.map((x) => x.name).join(' '), on: i === inv, mark: i === inv ? '✓' : '', pick: () => change({ inv: i, sheet: null }) }; }),
  chips: ns.filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i).sort((a, b) => ORD.indexOf(a.deg) - ORD.indexOf(b.deg)).map((x) => ({ n: x.name, c: ROLE[x.deg] || C.accent })),
  isStaff: true, isInv: false, isFing: false, isTones: false, voicingLabel: voicing,
  kbShow, kbOn: kbShow, kbOnBg: kbShow ? '#7FB685' : C.line, kbOnX: kbShow ? 22 : 2, toggleKb: () => set({ kbShow: !kbShow }),
  bassOnBg: bassOn ? '#7FB685' : C.line, bassOnX: bassOn ? 22 : 2, toggleBass: () => change({ bass: !bassOn }), bassOn,
  fingOnBg: fingOn ? '#7FB685' : C.line, fingOnX: fingOn ? 22 : 2, toggleFing: () => set({ fing: !fingOn }), fingOn,
  fingKeysOn: fingKeys, fingKeysOnBg: fingKeys ? '#7FB685' : C.line, fingKeysOnX: fingKeys ? 22 : 2, toggleFingKeys: () => set({ fingKeys: !fingKeys }),
  handSeg: seg(['Right', 'Left', 'Both'], hands, (l) => change({ hand: l })),
  keyLabelSeg: seg(['Names', 'None'], keyLabel, (l) => set({ keyLabel: l })),
  rootName: RN, qName: q.n[0].toUpperCase() + q.n.slice(1), qSym: RN + q.k, voicing, invLabel: INV[inv], handsLabel: hands === 'Both' ? 'Both hands' : hands + ' hand', soundWord: arp ? 'Arpeggio' : 'Block',
  // one row of letters; tapping the chosen letter again steps through its spellings: C, C♯, C (D, D♯, D♭ …)
  ...letterPick(rLet, rAcc, (l, a) => !SKIP.includes(LET[l] + a), st.tapUsed, (l, next, more) => { RL = l; change(Object.assign({ rl: l, ra: next, root: rootPc(l, next) }, more ? { tapUsed: true } : {})); }),
  playTiles: [['Block', 'Block chord'], ['Up', 'Arpeggio up'], ['Up and down', 'Arpeggio up and down']].map(([v, l]) => ({ l, on: v === playAs, bg: v === playAs ? '#FBF1DD' : '#FEFDFB', ring: v === playAs ? '0 0 0 2px #B07A2A' : '0 0 0 1px ' + C.line, pick: () => { set({ playAs: v }); sound(ms, v !== 'Block', v === 'Up and down' ? 'Up and down' : 'Up'); } })),
  qSymFs: (RN + q.k).length > 7 ? 12 : ((RN + q.k).length > 5 ? 13.5 : 15), blockOn: !arp, soundShort: arp ? 'Arpeggio' : 'Block',
  soundLabel: playAs === 'Block' ? 'Block chord' : (playAs === 'Up' ? 'Arpeggio up' : 'Up and down'),
    keysSeg: seg(['Chord', '61', '76', '88'], keys, (l) => set({ keys: l })),
  kbTiles: [['off', 'Off'], ['2d', '2D']].map(([id, name]) => { const on = id === (kbShow ? '2d' : 'off'); return { name, on, line: on ? '#B07A2A' : 'transparent', bg: on ? '#FBF1DD' : '#FEFDFB', isOff: id === 'off', is2d: id === '2d', pick: () => set({ kbShow: id === '2d' }) }; }),
  rhOn: hands !== 'Left', rhOnBg: hands !== 'Left' ? '#7FB685' : C.line, rhOnX: hands !== 'Left' ? 22 : 2,
  lhOn: hands !== 'Right', lhOnBg: hands !== 'Right' ? '#7FB685' : C.line, lhOnX: hands !== 'Right' ? 22 : 2,
  // the hands sit beside their staves: R.H. by the treble, L.H. by the bass; the last one on only plays
  // the hands drawn as they lie on the keys, each finger lit in the colour of the note it plays, its name on the
  // fingertip and its number below; tap a hand to add or drop it; Bass only leaves the root to the left hand (R42 v72)
  // The hands at the keys (R42 v77), as flowkey and the courses app show them (piano-data/reference-apps/flowkey/08,
  // courses-app/03): each hand lies under the keyboard and every playing finger reaches to its key, its number in a
  // circle on the fingertip in the note's colour; resting fingers stay curled at the palm.
  kh: (() => { const KW = ''' + str(W) + r''', KH = ''' + str(KH) + r'''; const wsN = []; for (let m = lo; m <= hi; m++) if (NAT.includes(m % 12)) wsN.push(m);
    const w = KW / wsN.length, sc = Math.max(1, Math.min(1.6, w / 27)), HS = Math.round(96 * sc), H = KH + HS;
    const keyX = (m) => (NAT.includes(m % 12) ? (wsN.indexOf(m) + 0.5) * w : (wsN.indexOf(m - 1) + 1) * w);
    const keyY = (m) => (NAT.includes(m % 12) ? KH - 44 : Math.round(KH * 0.62) - 32);
    const OFF = [[-46, 4], [-23, -20], [-4, -27], [15, -22], [32, -11]];
    const out = { h: H, hs: HS, vb: '0 0 ' + KW + ' ' + H, edge: '', skin: '', thumbE: '', palms: [], tips: [] };
    ['L', 'R'].forEach((k) => { const on = k === 'L' ? hands !== 'Right' : hands !== 'Left'; if (!on) return;
      const byF = {}; ns.filter((x) => x.hand === k).forEach((x) => { const f = fm[x.m]; if (f && !byF[f]) byF[f] = x; });
      const used = Object.keys(byF).map(Number); if (!used.length) return; const xs = used.map((f) => keyX(byF[f].m)); const sp = Math.max(1, Math.min(1.55, (Math.max(...xs) - Math.min(...xs)) / (120 * sc)));
      const off = OFF.map(([x, y]) => [(k === 'R' ? x : -x) * sc * sp, y * sc]);
      let pcx = used.reduce((t, f) => t + keyX(byF[f].m) - off[f - 1][0], 0) / used.length; pcx = Math.max(52 * sc, Math.min(KW - 52 * sc, pcx)); const pcy = H - 38 * sc;
      for (let f = 1; f <= 5; f++) { const kx = pcx + off[f - 1][0], ky = pcy + off[f - 1][1], x = byF[f];
        const tx = x ? keyX(x.m) : kx + off[f - 1][0] * 0.22, ty = x ? keyY(x.m) : ky - (f === 1 ? 20 : 30) * sc;
        const d = 'M' + kx.toFixed(1) + ' ' + ky.toFixed(1) + 'Q' + (tx + (kx - tx) * 0.22).toFixed(1) + ' ' + ((ky + ty) / 2).toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1);
        out.edge += d; out.skin += d;
        out.tips.push({ x: tx, y: ty, ty: ty + 4.5, r: x ? 10.5 : 0, c: x ? (ROLE[x.deg] || C.accent) : 'transparent', f1: !!x && f === 1, f2: !!x && f === 2, f3: !!x && f === 3, f4: !!x && f === 4, f5: !!x && f === 5 }); }
      out.palms.push({ cx: pcx, cy: pcy + 10 * sc, rx: 46 * sc * sp, ry: 36 * sc, wx: pcx - 30 * sc * sp, ww: 60 * sc * sp, wy: pcy + 22 * sc, wh: 60 * sc, lx: pcx, ly: H - 8, isL: k === 'L', isR: k === 'R' }); });
    out.fw = (19 * sc).toFixed(1); out.ew = (19 * sc + 3).toFixed(1); out.edge = out.edge || 'M0 0'; out.skin = out.skin || 'M0 0';
    return out; })(),
  handPics: ['L', 'R'].map((k) => { const on = k === 'L' ? hands !== 'Right' : hands !== 'Left';
    const byF = {}; ns.filter((x) => x.hand === k).forEach((x) => { const f = fm[x.m]; if (f && !byF[f]) byF[f] = x; });
    // Fingering as the teaching sources draw it (R42 v76): hands from above, thumbs inward; an upright bold numeral in a
    // circle on each fingertip (Hoffman Academy's finger-number sheet; Faber Primer p. 6; pianoscales.org), filled where
    // the finger plays and empty where it rests; the note's name just past the tip (Faber, Pianote put labels there)
    const HW = 140, HP = 14, HT = 20, HH = HW * HART[k].ar;
    const fs = [1, 2, 3, 4, 5].map((f) => { const g = HART[k].f[f], x = byF[f], lit = on && !!x;
      const tx = g.tip[0] / 100 * HW, ty = g.tip[1] / 100 * HH, dx = g.dist[0] / 100 * HW, dy = g.dist[1] / 100 * HH;
      const ux = tx - dx, uy = ty - dy, ul = Math.hypot(ux, uy) || 1;
      const nx = tx * 0.42 + dx * 0.58, ny = ty * 0.42 + dy * 0.58, lx = tx + ux / ul * 19, ly = ty + uy / ul * 17;
      return { f: String(f), n: lit ? x.name : '', lit, bg: lit ? (ROLE[x.deg] || C.accent) : '#FEFDFB', ring: lit ? '0 0 0 1.5px rgba(51,41,33,.7)' : '0 0 0 1.25px rgba(51,41,33,.28)',
        nx: (nx - 10 + HP) + 'px', ny: (ny - 10 + HT) + 'px', lx: (lx - 14 + HP) + 'px', ly: (ly - 8 + HT) + 'px', dw: lit ? 800 : 600, dc: lit ? C.ink : 'rgba(51,41,33,.45)' }; });
    const used = fs.filter((g) => g.n).sort((a, b) => b.f - a.f);
    const sole = on && hands !== 'Both' && hands !== 'Split';
    const pick = () => { if (sole) { play(false); return; } if (on) { change({ hand: k === 'L' ? 'Right' : 'Left' }); return; } change({ hand: st.bassOnly && canSplit ? 'Split' : 'Both' }); };
    const isSplit = hands === 'Split';
    const plays = !on ? 'Not playing' : (isSplit ? (k === 'L' ? RN : (upper || sym)) : sym + slash);
    const lhOpts = k === 'L' && on && hands !== 'Left' && canSplit ? [['Chord', !isSplit], ['Root', isSplit]].map(([l, o]) => ({ l, on: o, bg: o ? '#FEFDFB' : 'transparent', sh: o ? '0 1px 3px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.12)' : 'none', fw: o ? 700 : 500, pick: () => change({ hand: l === 'Root' ? 'Split' : 'Both', bassOnly: l === 'Root' }) })) : [];
    return { t: k === 'L' ? 'Left hand' : 'Right hand', on, fs, pick, op: 1, isL: k === 'L', isR: k === 'R', cbg: on ? '#FBF1DD' : 'transparent', cring: on ? '0 0 0 2px #B07A2A' : '0 0 0 1.5px ' + C.line, pl: k === 'R' ? '22px' : '0px', palm: on ? '#F3ECE1' : '#FEFDFB', pr: '0 0 0 1.5px ' + C.line,
      lw: on ? 700 : 500, lc: on ? C.ink : C.soft, plays, pc: on ? C.ink : C.soft, pf: on ? SERIFF : 'inherit', ps: on ? '18px' : '14px', pw: on ? 700 : 500, lhOpts, hasOpts: lhOpts.length > 0, noOpts: !lhOpts.length, canBass: false, bBg: isSplit ? '#F6E3BC' : 'transparent', bRing: isSplit ? 'none' : '0 0 0 1.5px ' + C.line, bassT: isSplit ? '✓ Bass only' : 'Bass only', bassOn: isSplit,
      bassPick: () => (isSplit ? change({ hand: 'Both', bassOnly: false }) : change({ hand: 'Split', bassOnly: true })),
      aria: (k === 'L' ? 'Left hand' : 'Right hand') + (on ? ', plays ' + fs.filter((g) => g.n).map((g) => g.n + ' with finger ' + g.f).join(', ') : ', not playing; tap to add it') }; }),
  handCards: [['Left', 'L', hands !== 'Right'], ['Right', 'R', hands !== 'Left']].map(([h, k, on]) => {
    const list = ns.filter((x) => x.hand === k).filter((x, i, a) => a.findIndex((y) => y.m === x.m) === i).sort((a, b) => a.m - b.m);
    const notes = on ? list.map((x) => ({ n: x.name, f: String(fm[x.m] || ''), c: ROLE[x.deg] || C.accent })) : [];
    const sole = on && hands !== 'Both';
    return { t: h + ' hand', isL: k === 'L', isR: k === 'R', on, off: !on, notes, bg: on ? '#FBF1DD' : 'transparent', ring: on ? '0 0 0 2px #B07A2A' : '0 0 0 1.5px ' + C.line, fg: on ? C.ink : C.soft,
      aria: h + ' hand, ' + (on ? 'plays ' + notes.map((x) => x.n + ' with finger ' + x.f).join(', ') : 'not playing; tap to add it'),
      pick: () => (sole ? play(false) : change({ hand: on ? (k === 'L' ? 'Right' : 'Left') : 'Both' })) }; }),
  toggleRH: () => (hands === 'Right' ? play(false) : change({ hand: hands === 'Left' ? 'Both' : 'Left' })),
  toggleLH: () => (hands === 'Left' ? play(false) : change({ hand: hands === 'Right' ? 'Both' : 'Right' })),
  rhBg: hands !== 'Left' ? '#F6E3BC' : 'transparent', rhFg: hands !== 'Left' ? '#5E3F10' : C.soft, rhRing: hands !== 'Left' ? 'none' : '0 0 0 1.5px ' + C.line,
  lhBg: hands !== 'Right' ? '#F6E3BC' : 'transparent', lhFg: hands !== 'Right' ? '#5E3F10' : C.soft, lhRing: hands !== 'Right' ? 'none' : '0 0 0 1.5px ' + C.line,
  fgBg: fingOn ? '#F6E3BC' : 'transparent', fgFg: fingOn ? '#5E3F10' : C.soft, fgRing: fingOn ? 'none' : '0 0 0 1.5px ' + C.line,
  hTopT: 'calc(40px + (100% - 40px) * ' + ((50 - sv.vt) / (sv.vbot - sv.vt)).toFixed(4) + ')', hTopB: 'calc(40px + (100% - 40px) * ' + ((130 - sv.vt) / (sv.vbot - sv.vt)).toFixed(4) + ')',
  namesOn: names, namesOnBg: names ? '#7FB685' : C.line, namesOnX: names ? 22 : 2, toggleNames: () => set({ names: !names }),
  arpOn: arp, arpBg: arp ? '#F6E3BC' : 'transparent', arpInk: arp ? '#7A5418' : C.ink, openSound: () => set({ sheet: 'sound' }), isSound: sh === 'sound',
  playing: !!st.playing, notPlaying: !st.playing, playLabel: st.playing ? 'Stop' : 'Play', togglePlay: () => st.playing ? set({ playing: false }) : play(false),
  playing: !!st.playing, notPlaying: !st.playing, playWord: scope === 'All' ? 'Play all' : (playMode === 'Block' ? 'Play chord' : 'Arpeggiate'),
  // what teachers drill (R42 v74): blocked through the inversions, then broken with the metronome, then every key
  // (piano/067 @12:41, @36:21; piano/519 @09:27); with several chords, each change on its own, then the whole
  // progression (reference-apps/chordify IMG_4562 "Individual transitions: From E to C♯m")
  practiseT: seq.length > 1 ? 'Practise these chords in the Player' : 'Practise ' + sym + ' in the Player',
  practise: seq.length > 1
    ? seq.slice(1).map((c, i) => ({ a: 'From ' + symOf(seq[i]).s + ' to ' + symOf(c).s, b: 'the change alone, looped, with a count-in' })).slice(0, 4)
        .concat([{ a: 'All ' + seq.length + ' chords, looped', b: 'with the metronome' }, { a: 'In all 12 keys', b: 'up by half steps, or round the circle of fifths' }])
    : [{ a: 'Blocked, through the inversions', b: (q.t.length > 3 ? 'root, 1st, 2nd, 3rd' : 'root, 1st, 2nd') + ' and back' }, { a: 'Broken, with the metronome', b: 'eighth notes, from 100 beats a minute' }, { a: 'In all 12 keys', b: 'up by half steps, or round the circle of fifths' }],
  addChord, undoRemove, playAll, nextList, keyTiles, tKey: KEYSP[tpc] + (minorKey ? ' minor' : ' major'), openTr: () => set({ sheet: 'tr' }), isTr: sh === 'tr', trDown: () => transposeTo((tpc + 11) % 12), trUp: () => transposeTo((tpc + 1) % 12), keyName, openNext: () => set({ sheet: 'next' }), isNext: sh === 'next', hasSeq: seq.length > 1, canAdd: seq.length < 8, seqCount: seq.length, toastOn: !!st.toast, toastT: st.toast ? st.toast.t : '',
  playMain: () => st.playing ? stopAll() : (scope === 'All' ? playSeq() : play(playMode !== 'Block', playMode === 'UpDown' ? 'Up and down' : 'Up')),
  scopeList: [['All', 'All ' + seq.length + ' chords, in order'], ['One', 'Only ' + sym + slash]].map(([v, l]) => ({ l, on: v === scope, mark: v === scope ? '✓' : '', pick: () => { set({ scope: v, sheet: null }); if (v === 'All') playSeq(); else play(playMode !== 'Block', playMode === 'UpDown' ? 'Up and down' : 'Up'); } })), openPlayAs: () => set({ sheet: st.sheet === 'playAs' ? null : 'playAs' }), isPlayAs: sh === 'playAs',
  playAsList: [['Block', 'Block chord'], ['Arpeggio', 'Arpeggio'], ['UpDown', 'Arpeggio up and down']].map(([v, l]) => ({ l, on: v === playMode, mark: v === playMode ? '✓' : '', pick: () => { set({ playMode: v, sheet: null }); if (scope !== 'All') play(v !== 'Block', v === 'UpDown' ? 'Up and down' : 'Up'); } })),
  invStep: INV[inv] + (slash ? ' · ' + bassName + ' in the bass' : ''), fullLine: full + (inv ? ' · ' + INV[inv] : '') + ' · ' + voicing + ' voicing' + (hands === 'Right' ? '' : (hands === 'Both' ? ' · both hands' : (hands === 'Split' ? ' · ' + RN + ' | ' + upper : ' · left hand'))),
  chordOn: st.playing === 'chord', chordOff: st.playing !== 'chord', arpOnP: st.playing === 'arp', arpOffP: st.playing !== 'arp',
  playChord: () => st.playing === 'chord' ? set({ playing: false }) : play(false), playArp: () => st.playing === 'arp' ? set({ playing: false }) : play(true),
  invSeg: Array.from({ length: invN }, (_, i) => i).map((i) => ({ l: ['Root', '1st', '2nd', '3rd'][i], on: i === inv, bg: i === inv ? C.ink : 'transparent', fg: i === inv ? C.sheet : C.ink, sh: i === inv ? '0 1px 3px rgba(51,41,33,.18)' : 'none', pick: () => change({ inv: i }) })),
  prev: () => change({ inv: (inv + invN - 1) % invN }), next: () => change({ inv: (inv + 1) % invN }),
  closeSheet: () => set({ sheet: null }),
  isChord: sh === 'chord', isList: sh === 'list', isVoicing: sh === 'voicing', isHands: sh === 'hands', isKeys: sh === 'keys', isSet: sh === 'set', isView: sh === 'view', isMore: sh === 'more', isPractise: sh === 'practise',
  openChord: () => set({ sheet: 'chord' }), openList: () => set({ sheet: 'list' }), openVoicing: () => set({ sheet: 'voicing' }), openHands: () => set({ sheet: 'hands' }), openKeys: () => set({ sheet: 'keys' }), openSet: () => set({ sheet: 'set' }), openMore: () => set({ sheet: 'more' }), openPractise: () => set({ sheet: 'practise' }), backChord: () => set({ sheet: 'chord' }), backSet: () => set({ sheet: 'set' }),
};
'''

def KEYBAND(h):
    return f'<div style="position: relative; flex: none; width: 100%; height: {h}px; overflow: hidden; background: {LINE}"><sc-for list="{{{{kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 10px; border-right: 1px solid rgba(51,41,33,.16); background: {{{{k.bg}}}}; color: {{{{k.ink}}}}; font-size: 12px; font-weight: {{{{k.fw}}}}; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px"><span style="font-size: 14px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums">{{{{k.fing}}}}</span>{{{{k.label}}}}</span></sc-for><sc-for list="{{{{kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 6px; border-radius: 0 0 5px 5px; background: {{{{k.bg}}}}; color: {INK}; font-size: 10px; font-weight: 700; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px"><span style="font-size: 12px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums">{{{{k.fing}}}}</span>{{{{k.label}}}}</span></sc-for><div style="position: absolute; left: 0; right: 0; top: 0; height: 4px; background: #7C302C"></div><div style="position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: {LINE}"></div></div>'

def KEYHANDS(h):
    D = lambda n: f'<sc-if value="{{{{t.f{n}}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{t.x}}}}" y="{{{{t.ty}}}}" text-anchor="middle" font-family="Instrument Sans, system-ui, sans-serif" font-size="13" font-weight="800" fill="{INK}">{n}</text></sc-if>'
    return (f'<div style="position: relative; flex: none; width: 100%">{KEYBAND(h)}<div aria-hidden="true" style="height: {{{{kh.hs}}}}px"></div>'
      f'<svg viewBox="{{{{kh.vb}}}}" role="img" aria-label="The hands on the keys" style="position: absolute; left: 0; top: 0; width: 100%; height: {{{{kh.h}}}}px; pointer-events: none; overflow: hidden">'
      f'<sc-for list="{{{{kh.palms}}}}" as="p" hint-placeholder-count="1"><rect x="{{{{p.wx}}}}" y="{{{{p.wy}}}}" width="{{{{p.ww}}}}" height="{{{{p.wh}}}}" fill="#F6ECDF" stroke="{INK}" stroke-width="1.5"></rect></sc-for>'
      f'<path d="{{{{kh.edge}}}}" fill="none" stroke="{INK}" stroke-width="{{{{kh.ew}}}}" stroke-linecap="round"></path>'
      f'<sc-for list="{{{{kh.palms}}}}" as="p" hint-placeholder-count="1"><ellipse cx="{{{{p.cx}}}}" cy="{{{{p.cy}}}}" rx="{{{{p.rx}}}}" ry="{{{{p.ry}}}}" fill="#F6ECDF" stroke="{INK}" stroke-width="1.5"></ellipse></sc-for>'
      f'<path d="{{{{kh.skin}}}}" fill="none" stroke="#F6ECDF" stroke-width="{{{{kh.fw}}}}" stroke-linecap="round"></path>'
      f'<sc-for list="{{{{kh.palms}}}}" as="p" hint-placeholder-count="1"><sc-if value="{{{{p.isL}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{p.lx}}}}" y="{{{{p.ly}}}}" text-anchor="middle" font-family="Instrument Sans, system-ui, sans-serif" font-size="12" font-weight="700" fill="{SOFT}">L.H.</text></sc-if><sc-if value="{{{{p.isR}}}}" hint-placeholder-val="{{{{true}}}}"><text x="{{{{p.lx}}}}" y="{{{{p.ly}}}}" text-anchor="middle" font-family="Instrument Sans, system-ui, sans-serif" font-size="12" font-weight="700" fill="{SOFT}">R.H.</text></sc-if></sc-for>'
      f'<sc-for list="{{{{kh.tips}}}}" as="t" hint-placeholder-count="5"><circle cx="{{{{t.x}}}}" cy="{{{{t.y}}}}" r="{{{{t.r}}}}" fill="{{{{t.c}}}}" stroke="{INK}" stroke-width="1.5"></circle>{D(1)}{D(2)}{D(3)}{D(4)}{D(5)}</sc-for></svg></div>')

def MINIKEYS(w):
    return f'<div style="position: relative; width: {w}px; max-width: 100%; height: 64px; border-radius: 4px; overflow: hidden; background: {LINE}; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{c.kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: 64px; box-sizing: border-box; border-right: 1px solid rgba(51,41,33,.14); background: {{{{k.bg}}}}"></span></sc-for><sc-for list="{{{{c.kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}"></span></sc-for></div>'

GLASSBTN = lambda label, svg, act='', href='': (f'<a href="{href}" aria-label="{label}" style="flex: none; width: 44px; height: 44px; box-sizing: border-box; border-radius: 22px; border: 1px solid {LINE}; background: {GLASS}; backdrop-filter: blur(12px); color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none">{svg}</a>' if href else f'<button type="button" aria-label="{label}" onClick="{{{{{act}}}}}" style="flex: none; width: 44px; height: 44px; box-sizing: border-box; border-radius: 22px; border: 1px solid {LINE}; background: {GLASS}; backdrop-filter: blur(12px); color: {INK}; display: flex; align-items: center; justify-content: center">{svg}</button>')

def VIEWPILL(labelled):
    # Apple's segmented control: equal segments, nouns only, the track 40 tall (radius 20), the thumb 3 in (radius 17)
    w = 'width: 112px;' if labelled else 'flex: 1 1 0; min-width: 0;'
    item = f'<button type="button" aria-pressed="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="{w} height: 34px; padding: 0 4px; border: 0; border-radius: 17px; background: {{{{v.bg}}}}; box-shadow: {{{{v.sh}}}}; color: {{{{v.fg}}}}; font: inherit; font-size: 15px; font-weight: {{{{v.fw}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{v.v}}}}</button>'
    box = 'flex: none;' if labelled else 'flex: 1; min-width: 0;'
    return f'<nav aria-label="View" style="{box} display: flex; height: 40px; box-sizing: border-box; padding: 3px; border-radius: 20px; background: {FILL}">{'<sc-for list="{{views}}" as="v" hint-placeholder-count="4">'}{item}</sc-for></nav>'

def PRACTISE(player):
    # Practise in the Player, on the page: three ways to drill this chord, each opening the Player
    PLAYMINI = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"></path></svg>'
    r = f'<sc-for list="{{{{practise}}}}" as="p" hint-placeholder-count="3"><a href="{player}" style="min-height: 60px; padding: 8px 14px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}"><span style="flex: none; width: 36px; height: 36px; border-radius: 18px; background: {ACCENT}; display: flex; align-items: center; justify-content: center">{PLAYMINI}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{p.a}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{p.b}}}}</span></span>{CHEV_R}</a></sc-for>'
    return f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{CAPS("{{practiseT}}")}<div style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">{r}</div></section>'

def TITLEBLOCK(size):
    # the name as a lead sheet writes it; what it is; its inversions side by side, one tap each (position over the
    # slash chord); its notes from the bottom up, each over its role, as a theory table sets them
    fs = '{{symFsP}}' if size < 50 else '{{symFsL}}'
    w = '100%' if size < 50 else '520px'
    return f'''<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center">
<button type="button" aria-label="Change the chord: {{{{sym}}}}{{{{slash}}}}" onClick="{{{{openChord}}}}" style="max-width: 100%; border: 0; border-radius: 16px; background: transparent; padding: 0 8px; color: {INK}; font: inherit"><span style="font-family: {SERIF}; font-size: {fs}px; line-height: 1.1; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap">{{{{symL}}}}<sc-if value="{{{{hasSymA}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-family: 'Noto Music', serif; font-weight: 400; font-size: 0.78em; vertical-align: 0.22em; margin: 0 0.02em 0 0.04em; -webkit-text-stroke: 0.025em currentColor">{{{{symA}}}}</span></sc-if>{{{{symQ}}}}<span style="color: {{{{slashC}}}}">{{{{slash}}}}</span></span></button>
<p style="margin: 0; font-size: 15px; color: {SOFT}">{{{{fullLine}}}}</p>
<div role="radiogroup" aria-label="Bass note" style="margin-top: 14px; display: flex; justify-content: center; gap: 10px"><sc-for list="{{{{noteCols}}}}" as="c" hint-placeholder-count="4"><div style="display: flex; flex-direction: column; align-items: center; gap: 4px"><button type="button" role="radio" aria-checked="{{{{c.on}}}}" aria-label="{{{{c.aria}}}}" onClick="{{{{c.pick}}}}" style="width: 48px; height: 48px; margin: 0; padding: 0; border-radius: 50%; border: {{{{c.bw}}}} solid {{{{c.c}}}}; background: {{{{c.fill}}}}; opacity: {{{{c.op}}}}; color: {INK}; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{c.n}}}}</button><span aria-hidden="true" style="font-size: 13px; font-weight: {{{{c.rw}}}}; color: {{{{c.rc}}}}">{{{{c.d}}}}</span></div></sc-for></div>

</div>'''

def STAFFSVG(w):
    return f'''<div class="nos" style="overflow-x: auto; margin: 0 -4px"><div style="position: relative; width: 100%; min-width: {{{{sv.minw}}}}; max-width: {{{{sv.maxw}}}}px; margin: 0 auto; padding-top: 40px">
<div style="position: absolute; left: 0; right: 0; top: 0; height: 36px"><sc-for list="{{{{sv.cols}}}}" as="k" hint-placeholder-count="1"><div style="position: absolute; top: 0; left: {{{{k.left}}}}; transform: translateX(-50%); height: 34px; display: flex; align-items: center; border-radius: 17px; background: {{{{k.bg}}}}"><button type="button" aria-label="{{{{k.aria}}}}" onClick="{{{{k.pick}}}}" style="height: 34px; padding: 0 10px; border: 0; background: transparent; color: {{{{k.tc}}}}; font: inherit; font-size: 15px; font-weight: {{{{k.fw}}}}; white-space: nowrap">{{{{k.s}}}}</button><sc-if value="{{{{k.canRemove}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" aria-label="Remove {{{{k.s}}}}" onClick="{{{{k.remove}}}}" style="width: 30px; height: 34px; margin-left: -6px; padding: 0; border: 0; background: transparent; color: #7A5418; display: flex; align-items: center; justify-content: center">{XSM}</button></sc-if></div></sc-for></div>
<svg viewBox="{{{{sv.vb}}}}" style="display: block; width: 100%; height: auto" role="img" aria-label="The chords on the staff">
<sc-for list="{{{{sv.hl}}}}" as="h" hint-placeholder-count="0"><rect x="{{{{h.x}}}}" y="{{{{h.y}}}}" width="{{{{h.w}}}}" height="{{{{h.h}}}}" rx="10" fill="{{{{h.f}}}}" opacity="{{{{h.o}}}}"></rect></sc-for>
<path d="{{{{sv.path}}}}" stroke="{INK}" stroke-width="0.9"></path>
<path d="{{{{sv.bars}}}}" stroke="{INK}" stroke-width="1"></path>
<text x="18" y="69" font-family="Noto Music" font-size="42" fill="{INK}">𝄞</text><text x="18" y="141" font-family="Noto Music" font-size="34" fill="{INK}">𝄢</text>
<path d="{{{{sv.moved}}}}" fill="none" stroke="{SOFT}" stroke-width="1" stroke-dasharray="2 2.5" stroke-linecap="round"></path><path d="{{{{sv.held}}}}" fill="none" stroke="{INK}" stroke-width="1.3" stroke-linecap="round"></path>
<sc-for list="{{{{sv.ledg}}}}" as="l" hint-placeholder-count="1"><path d="M{{{{l.x1}}}} {{{{l.y}}}}H{{{{l.x2}}}}" stroke="{INK}" stroke-width="1.1"></path></sc-for>
<sc-for list="{{{{sv.notes}}}}" as="n" hint-placeholder-count="4"><ellipse cx="{{{{n.x}}}}" cy="{{{{n.y}}}}" rx="7.2" ry="5" transform="rotate(-18 {{{{n.x}}}} {{{{n.y}}}})" fill="{{{{n.c}}}}" stroke="{INK}" stroke-width="1.6"></ellipse><sc-if value="{{{{n.a1}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{INK}">♭</text></sc-if><sc-if value="{{{{n.a2}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{INK}">♯</text></sc-if><sc-if value="{{{{n.a3}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{INK}">𝄫</text></sc-if><sc-if value="{{{{n.a4}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{INK}">𝄪</text></sc-if></sc-for>
<sc-for list="{{{{sv.digits}}}}" as="d" hint-placeholder-count="4"><sc-if value="{{{{d.f1}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">1</text></sc-if><sc-if value="{{{{d.f2}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">2</text></sc-if><sc-if value="{{{{d.f3}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">3</text></sc-if><sc-if value="{{{{d.f4}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">4</text></sc-if><sc-if value="{{{{d.f5}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">5</text></sc-if></sc-for>
</svg></div></div>'''

def VIEWBODY(staff_w, inv_cols, mini_w, side=False):
    inner = (f'<div style="display: flex; align-items: center; gap: 24px"><div style="flex: 1; min-width: 0">{STAFFHEAD}{STAFFSVG(staff_w)}</div>{HANDPICS}</div>' if side else f'{STAFFHEAD}{STAFFSVG(staff_w)}{HANDPICS}')
    return f'''<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 10px 10px 14px; display: flex; flex-direction: column; gap: 10px">{inner}</div></sc-if>
<sc-if value="{{{{isInv}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: grid; grid-template-columns: repeat({inv_cols}, minmax(0, 1fr)); gap: 10px"><sc-for list="{{{{invCards}}}}" as="c" hint-placeholder-count="4"><button type="button" onClick="{{{{c.pick}}}}" style="min-width: 0; border: 0; border-radius: 16px; background: #FEFDFB; box-shadow: {{{{c.ring}}}}; padding: 12px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; color: {INK}; font: inherit; text-align: left"><span style="font-size: 16px; font-weight: 700">{{{{c.t}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{c.s}}}}</span>{MINIKEYS(mini_w)}</button></sc-for></div></sc-if>
<sc-if value="{{{{isFing}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: flex; flex-direction: column; gap: 10px"><sc-for list="{{{{fing}}}}" as="h" hint-placeholder-count="2"><div style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px"><span style="font-size: 15px; font-weight: 700">{{{{h.h}}}}</span><div style="display: flex; gap: 8px"><sc-for list="{{{{h.cells}}}}" as="x" hint-placeholder-count="3"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 6px"><span style="font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums">{{{{x.f}}}}</span><span style="width: 100%; height: 6px; border-radius: 3px; background: {{{{x.c}}}}"></span><span style="font-size: 14px; color: {SOFT}">{{{{x.n}}}}</span></div></sc-for></div></div></sc-for></div></sc-if>
<sc-if value="{{{{isTones}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: flex; flex-direction: column; gap: 14px">
{CAPS("Chord tones")}<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{tones}}}}" as="t" hint-placeholder-count="4"><span style="height: 44px; padding: 0 14px 0 6px; border-radius: 22px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600"><span style="width: 32px; height: 32px; border-radius: 16px; background: {{{{t.c}}}}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">{{{{t.d}}}}</span>{{{{t.n}}}}</span></sc-for></div>
</div></sc-if>'''

HANDL = HANDI.replace('<svg ', '<svg style="transform: scaleX(-1)" ', 1)
HART = json.load(open('/home/user/piano-trainer/.scratch/r39/canvas/hands_art.json'))  # the app's hand models (src/widgets/piano-hands/assets, MIT), rendered from above
HANDPICS = ('<div role="group" aria-label="Hands" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; width: 100%; max-width: 420px; align-self: center; align-items: start"><sc-for list="{{handPics}}" as="h" hint-placeholder-count="2"><div style="display: flex; flex-direction: column; align-items: center; gap: 8px">'
  '<button type="button" aria-pressed="{{h.on}}" aria-label="{{h.aria}}" onClick="{{h.pick}}" style="width: 100%; min-height: 60px; border: 0; border-radius: 14px; background: {{h.cbg}}; box-shadow: {{h.cring}}; padding: 6px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; font: inherit"><span style="font-size: 13px; font-weight: 500; color: ' + SOFT + '">{{h.t}}</span><span style="font-family: {{h.pf}}; font-size: {{h.ps}}; font-weight: {{h.pw}}; color: {{h.pc}}; white-space: nowrap">{{h.plays}}</span></button>'
  '<sc-if value="{{h.hasOpts}}" hint-placeholder-val="{{false}}"><div role="radiogroup" aria-label="The left hand plays" style="display: flex; gap: 2px; padding: 3px; border-radius: 17px; background: ' + FILL + '"><sc-for list="{{h.lhOpts}}" as="o" hint-placeholder-count="2"><button type="button" role="radio" aria-checked="{{o.on}}" onClick="{{o.pick}}" style="height: 30px; padding: 0 14px; border: 0; border-radius: 15px; background: {{o.bg}}; box-shadow: {{o.sh}}; color: ' + INK + '; font: inherit; font-size: 13px; font-weight: {{o.fw}}">{{o.l}}</button></sc-for></div></sc-if>'
  '<sc-if value="{{h.canBass}}" hint-placeholder-val="{{false}}"><button type="button" aria-pressed="{{h.bassOn}}" onClick="{{h.bassPick}}" style="height: 34px; padding: 0 14px; border: 0; border-radius: 17px; background: {{h.bBg}}; box-shadow: {{h.bRing}}; color: ' + INK + '; font: inherit; font-size: 13px; font-weight: 600; white-space: nowrap">{{h.bassT}}</button></sc-if></div></sc-for></div>')
# the hands, a toolbar under the staff: each a symbol over its name; Split shows the two chords it makes (R42 v71)
HANDROW = ''
HANDBAR = ('<div role="radiogroup" aria-label="Hands" style="width: 100%; max-width: 520px; align-self: center; box-sizing: border-box; display: grid; grid-template-columns: repeat({{handN}}, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 16px; background: ' + FILL + '"><sc-for list="{{handBar}}" as="o" hint-placeholder-count="3">'
  '<button type="button" role="radio" aria-checked="{{o.on}}" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="min-width: 0; min-height: 58px; border: 0; border-radius: 12px; background: {{o.bg}}; box-shadow: {{o.sh}}; padding: 4px 2px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: ' + INK + '; font: inherit">'
  '<span style="height: 24px; display: flex; align-items: center"><sc-if value="{{o.isL}}" hint-placeholder-val="{{true}}">' + HANDL + '</sc-if><sc-if value="{{o.isR}}" hint-placeholder-val="{{false}}">' + HANDI + '</sc-if><sc-if value="{{o.isB}}" hint-placeholder-val="{{false}}"><span style="display: flex; gap: 1px">' + HANDL + HANDI + '</span></sc-if><sc-if value="{{o.isS}}" hint-placeholder-val="{{false}}"><span style="font-family: ' + SERIF + '; font-size: 15px; font-weight: 700; white-space: nowrap">{{o.sym}}</span></sc-if></span>'
  '<span style="font-size: 13px; font-weight: {{o.fw}}; white-space: nowrap">{{o.l}}</span></button></sc-for></div>')
HANDS2 = '<span style="display: flex; gap: 0; margin: 0 -3px">' + HANDL.replace('width="22" height="22"', 'width="17" height="17"') + HANDI.replace('width="22" height="22"', 'width="17" height="17"') + '</span>'
HANDSI = '<sc-if value="{{hB}}" hint-placeholder-val="{{true}}">' + HANDS2 + '</sc-if><sc-if value="{{hR}}" hint-placeholder-val="{{false}}">' + HANDI + '</sc-if><sc-if value="{{hL}}" hint-placeholder-val="{{false}}">' + HANDL + '</sc-if>'

# The bar holds only the page's actions (Apple: a toolbar's items "act on content"; "only specify one primary
# action"): hear the chord together, hear it note by note. Everything chosen sits on the chord itself; everything
# shown is behind the gear. One capsule 68 (radius 34), two buttons 56 inside 6 (radius 28), side by side.
XSM = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>'
PLUSI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>'
STAFFHEAD = ('<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px"><button type="button" aria-label="Key {{tKey}}, transpose" onClick="{{openTr}}" style="height: 36px; padding: 0 12px 0 10px; border-radius: 18px; border: 0; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; white-space: nowrap"><span aria-hidden="true" style="font-family: Noto Music, serif; font-size: 15px">♯♭</span>{{tKey}}<span style="color: ' + SOFT + '; font-weight: 500">· Transpose</span></button><sc-if value="{{canAdd}}" hint-placeholder-val="{{true}}"><button type="button" aria-label="Add a chord to the staff" onClick="{{openNext}}" style="height: 36px; padding: 0 14px 0 10px; border-radius: 18px; border: 0; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px; white-space: nowrap">' + PLUSI + 'Chord</button></sc-if></div>')
STOPI = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"></rect></svg>'
PLAYI = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"></path></svg>'
def ACT(label, act, on, off, icon, primary):
    bg = f'flex: 1 1 0; background: {ACCENT}; color: {INK};' if primary else f'flex: none; padding: 0 10px; background: transparent; color: {INK};'
    return (f'<button type="button" onClick="{{{{{act}}}}}" aria-pressed="{{{{{on}}}}}" style="min-width: 0; height: 56px; border: 0; border-radius: 28px; {bg} font: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap">'
            f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><sc-if value="{{{{{off}}}}}" hint-placeholder-val="{{{{true}}}}">{icon}</sc-if>{label}</button>')
BAR_CSS = f'height: 68px; box-sizing: border-box; padding: 6px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 6px'
# Apple's toolbars (iOS 26): items sit on glass in groups; only the one primary action is prominent, tinted glass,
# in its own group on the trailing side. So three shapes, no capsule around them: the keyboard (what the page
# shows) · the chord (what is chosen) · Play (what you hear), the last one tinted honey.
GLASSGRP = f'height: 56px; box-sizing: border-box; border-radius: 28px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}'
TINTGRP = f'height: 56px; box-sizing: border-box; border-radius: 28px; background: rgba(237,198,132,.82); backdrop-filter: blur(24px) saturate(1.8); box-shadow: inset 0 1px 0 rgba(255,255,255,.55), 0 0 0 1px rgba(176,122,42,.28), {SHADOW}'
CHEV_D = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>'
KBROUND = f'<button type="button" aria-label="Keyboard" onClick="{{{{openKeys}}}}" style="flex: none; width: 56px; border: 0; {GLASSGRP}; color: {INK}; display: flex; align-items: center; justify-content: center">{KEYSI}</button>'
CHORDACT = f'<button type="button" aria-label="Chord: {{{{qSym}}}}" onClick="{{{{openChord}}}}" style="pointer-events: auto; flex: none; min-width: 56px; max-width: 100%; padding: 0 10px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; font-size: {{{{qSymFs}}}}px; font-weight: 700; display: flex; align-items: center; gap: 4px; white-space: nowrap"><span style="min-width: 0; overflow: hidden; text-overflow: ellipsis">{{{{qSym}}}}</span></button>'
PLAYSPLIT = (f'<div role="group" aria-label="Play" style="pointer-events: auto; flex: none; width: 176px; {TINTGRP}; display: flex; align-items: center">'
  f'<button type="button" onClick="{{{{playMain}}}}" aria-pressed="{{{{playing}}}}" style="flex: 1; min-width: 0; height: 56px; padding: 0 2px 0 14px; border: 0; border-radius: 28px 0 0 28px; background: transparent; color: {INK}; font: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap"><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if><span style="overflow: hidden; text-overflow: ellipsis">{{{{playWord}}}}</span></button>'
  f'<span aria-hidden="true" style="flex: none; width: 1px; height: 26px; background: rgba(51,41,33,.2)"></span>'
  f'<button type="button" aria-label="Play as: block chord or arpeggio" aria-haspopup="menu" onClick="{{{{openPlayAs}}}}" style="flex: none; width: 40px; height: 56px; border: 0; border-radius: 0 28px 28px 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_D}</button></div>')
def PLAYASMENU(pos):
    return (f'<sc-if value="{{{{isPlayAs}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
      f'<div role="menu" aria-label="Play as" style="position: absolute; {pos}; z-index: 61; width: 248px; white-space: nowrap; box-sizing: border-box; padding: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column">'
      f'<sc-for list="{{{{playAsList}}}}" as="o" hint-placeholder-count="3"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 48px; border: 0; border-radius: 12px; background: transparent; padding: 6px 12px; display: flex; align-items: center; gap: 10px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 18px; font-size: 16px; font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span><span style="flex: 1; font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for>'
      f'<sc-if value="{{{{hasSeq}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="height: 1px; margin: 4px 8px; background: {LINE}"></span><sc-for list="{{{{scopeList}}}}" as="o" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 48px; border: 0; border-radius: 12px; background: transparent; padding: 6px 12px; display: flex; align-items: center; gap: 10px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 18px; font-size: 16px; font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span><span style="flex: 1; font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for></sc-if></div></sc-if>')
# the chord and Play are one group, centred together (R42 v72: "why this is looking so not centered")
DOCK_PHONE = f'<div role="toolbar" aria-label="Chord and sound" style="position: absolute; left: 0; right: 0; bottom: 30px; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 8px; pointer-events: none"><div style="display: contents; pointer-events: auto">{CHORDACT}{PLAYSPLIT}</div></div>'
DOCK_LAPTOP = f'<div role="toolbar" aria-label="Chord and sound" style="position: absolute; left: 0; right: 0; bottom: 24px; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 10px; pointer-events: none">{CHORDACT}{PLAYSPLIT}</div>'

# ── the sheets' bodies, the same on both sizes ──
def BACKHEAD(title, act):
    return f'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 40px"><button type="button" aria-label="Back" onClick="{{{{{act}}}}}" style="position: absolute; left: -8px; width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L}</button><span style="font-size: 17px; font-weight: 600">{title}</span></div>'

B_CHORD = (CAPS('Root') + NOTEPICK + GROUP(('link', 'Chord', '{{qName}}', 'openList'), ('link', 'Voicing', '{{voicingLabel}}', 'openVoicing'), bg="#FEFDFB"))
B_LIST = (BACKHEAD('Chord', 'backChord') + f'<sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="4"><div style="display: flex; flex-direction: column; gap: 6px"><h3 style="margin: 6px 0 0 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{{{{g.g}}}}</h3><div style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{g.rows}}}}" as="r" hint-placeholder-count="5"><div style="display: flex; align-items: stretch; box-shadow: inset 0 -1px 0 {LINE}; background: {{{{r.bg}}}}"><button type="button" aria-pressed="{{{{r.on}}}}" onClick="{{{{r.pick}}}}" style="flex: 1; min-width: 0; min-height: 48px; border: 0; background: transparent; padding: 0 0 0 14px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 76px; font-size: 16px; font-weight: {{{{r.fw}}}}">{{{{r.s}}}}</span><span style="flex: 1; min-width: 0; font-size: 15px; color: {SOFT}">{{{{r.n}}}}</span></button><button type="button" role="checkbox" aria-checked="{{{{r.inSeq}}}}" aria-label="{{{{r.chkAria}}}}" onClick="{{{{r.toggle}}}}" style="flex: none; width: 52px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; justify-content: center"><span style="width: 24px; height: 24px; border-radius: 12px; background: {{{{r.chkBg}}}}; box-shadow: {{{{r.chkRing}}}}; color: #FEFDFB; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center">{{{{r.chk}}}}</span></button></div></sc-for></div></div></sc-for>')
B_VOICING = (BACKHEAD('Voicing', 'backChord') + f'<div style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{vlist}}}}" as="v" hint-placeholder-count="6"><button type="button" aria-pressed="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="width: 100%; min-height: 56px; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 6px 14px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left; opacity: {{{{v.op}}}}"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{v.v}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{v.f}}}}</span></span><span style="font-size: 18px; font-weight: 700; color: #7A5418">{{{{v.mark}}}}</span></button></sc-for></div>')
B_NEXT = (CAPS('In {{keyName}}') + '<div role="group" aria-label="Next chord" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px"><sc-for list="{{nextList}}" as="o" hint-placeholder-count="6"><button type="button" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="height: 72px; border: 0; border-radius: 14px; background: {{o.bg}}; box-shadow: {{o.ring}}; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: ' + INK + '; font: inherit"><span style="font-family: ' + SERIF + '; font-size: 22px; font-weight: 700; white-space: nowrap">{{o.s}}</span><span style="font-size: 14px; color: ' + SOFT + '">{{o.r}}</span></button></sc-for></div>'
          + GROUP(('link', 'Any chord', '', 'addChord'), bg="#FEFDFB"))
B_TR = ('<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px"><button type="button" onClick="{{trDown}}" style="height: 56px; border: 0; border-radius: 14px; background: #FEFDFB; box-shadow: 0 0 0 1px ' + LINE + '; color: ' + INK + '; font: inherit; font-size: 16px; font-weight: 600">− Half step</button><button type="button" onClick="{{trUp}}" style="height: 56px; border: 0; border-radius: 14px; background: #FEFDFB; box-shadow: 0 0 0 1px ' + LINE + '; color: ' + INK + '; font: inherit; font-size: 16px; font-weight: 600">+ Half step</button></div>'
  + CAPS('To the key of') + '<div role="radiogroup" aria-label="Key" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{keyTiles}}" as="o" hint-placeholder-count="12"><button type="button" role="radio" aria-checked="{{o.on}}" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="height: 52px; min-width: 0; border: 0; border-radius: 12px; background: {{o.bg}}; box-shadow: {{o.ring}}; color: ' + INK + '; font-family: ' + SERIF + '; font-size: 18px; font-weight: {{o.fw}}; white-space: nowrap">{{o.s}}</button></sc-for></div>')
B_HANDS = GROUP(('toggle', 'Right hand', 'rhOn', 'toggleRH'), ('toggle', 'Left hand', 'lhOn', 'toggleLH'), bg="#FEFDFB")
KBTILES = ('<div role="group" aria-label="Keyboard" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px"><sc-for list="{{kbTiles}}" as="o" hint-placeholder-count="2"><button type="button" aria-pressed="{{o.on}}" onClick="{{o.pick}}" style="height: 84px; padding: 0; border-radius: 14px; border: 2px solid {{o.line}}; background: {{o.bg}}; box-shadow: 0 0 0 1px ' + LINE + ' ; color: ' + INK + '; font: inherit; font-size: 14px; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px">'
    '<svg width="48" height="28" viewBox="0 0 48 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">'
    '<sc-if value="{{o.is2d}}" hint-placeholder-val="{{false}}"><g><rect x="2" y="4" width="44" height="20" rx="2"></rect><path d="M8.3 4v20M14.6 4v20M20.9 4v20M27.1 4v20M33.4 4v20M39.7 4v20"></path><path d="M6.5 4h3.6v11H6.5zM12.8 4h3.6v11h-3.6zM25.3 4h3.6v11h-3.6zM31.6 4h3.6v11h-3.6zM37.9 4h3.6v11h-3.6z" fill="currentColor"></path></g></sc-if>'
    '<sc-if value="{{o.isOff}}" hint-placeholder-val="{{false}}"><g opacity="0.55"><rect x="2" y="4" width="44" height="20" rx="2"></rect><path d="M14.6 4v20M27.1 4v20M39.7 4v20"></path><path d="M4 26 44 2" stroke-width="2"></path></g></sc-if>'
    '</svg>{{o.name}}</button></sc-for></div>')
B_KEYS = (KBTILES + '<sc-if value="{{kbShow}}" hint-placeholder-val="{{true}}">' + GROUP(('seg', 'Keys', 'keysSeg', 230), ('seg', 'Labels', 'keyLabelSeg', 230), bg="#FEFDFB") + '</sc-if>'
          + GROUP(('link', 'Connect a piano', '', '#'), ('link', 'All piano settings', '', '#'), bg="#FEFDFB"))
B_SOUND = f'<div role="radiogroup" style="display: flex; flex-direction: column; gap: 8px"><sc-for list="{{{{playTiles}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 60px; border: 0; border-radius: 14px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; padding: 8px 16px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; color: {INK}; font: inherit; text-align: left"><span style="font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for></div>'
TOAST = f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 50%; bottom: 100px; transform: translateX(-50%); z-index: 50; height: 48px; padding: 0 6px 0 18px; border-radius: 24px; background: {INK}; color: #FEFDFB; display: flex; align-items: center; gap: 8px; white-space: nowrap; box-shadow: {SHADOW}"><span style="font-size: 15px">{{{{toastT}}}}</span><button type="button" onClick="{{{{undoRemove}}}}" style="height: 40px; padding: 0 14px; border: 0; border-radius: 20px; background: transparent; color: #F2C987; font: inherit; font-size: 15px; font-weight: 700">Undo</button></div></sc-if>'
def SHEETS_PHONE(player):
    out = ''
    out += TOAST + PLAYASMENU('left: 50%; transform: translateX(-50%); bottom: 96px')
    for cond, title, body in (('isChord', 'Chord', B_CHORD), ('isKeys', 'Keyboard', B_KEYS), ('isNext', 'Next chord', B_NEXT), ('isTr', 'Transpose', B_TR)):
        out += BSHEET(cond, title, body)
    for cond, body in (('isList', B_LIST), ('isVoicing', B_VOICING)):
        out += f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.28)"></div><section role="dialog" class="nos" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 12px"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>{body}</section></sc-if>'
    return out

def POPS_LAPTOP(player):
    dockpos = 'left: calc(50% - 200px); top: 424px'
    out = TOAST + PLAYASMENU('left: 50%; transform: translateX(-50%); bottom: 92px')
    for cond, title, body, pos in (('isChord', 'Chord', B_CHORD, dockpos), ('isKeys', 'Keyboard', B_KEYS, 'right: 24px; top: 76px'), ('isNext', 'Next chord', B_NEXT, 'left: calc(50% + 420px); top: 330px'), ('isTr', 'Transpose', B_TR, 'left: calc(50% - 420px); top: 330px')):
        out += POPOVER(cond, title, body, pos, 400)
    for cond, body, pos in (('isList', B_LIST, dockpos), ('isVoicing', B_VOICING, dockpos)):
        out += f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" class="nos" style="position: absolute; {pos}; z-index: 61; width: 400px; max-height: 700px; overflow-y: auto; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 12px 16px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">{body}</div></sc-if>'
    return out

def ch_js(D, W, KH, minOct, mini_w):
    return CH_JS + '\n' + js('const D = ' + json.dumps(D) + ';\nconst HART = ' + json.dumps({k: {'ar': v['ar'], 'f': v['f']} for k, v in HART.items()}) + ';\n' + CH_BODY(D, W, KH, minOct, mini_w))

# ── phone ──
PH_BODY = f'''<div style="flex: none; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px">{GLASSBTN('Back to Practice', CHEV_L, href='Main.dc.html')}<h1 style="margin: 0; font-size: 17px; font-weight: 600">Chords</h1>{GLASSBTN('Keyboard', KEYSI, 'openKeys')}</div>
<sc-if value="{{{{kbShow}}}}" hint-placeholder-val="{{{{true}}}}">{KEYHANDS(168)}</sc-if>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 14px 16px 120px; display: flex; flex-direction: column; gap: 16px">{TITLEBLOCK(44)}{VIEWBODY(330, 2, 150)}{PRACTISE('Player.dc.html')}</main>
{DOCK_PHONE}'''
phone('Chords', 'Chords', PH_BODY, ch_js({'root': 0, 'q': 12}, 402, 168, 2, 150), SHEETS_PHONE('Player.dc.html'))

# ── laptop: the whole screen, as the Player's ──
LP_INNER = f'''<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: {PAGE}; color: {INK}; font-family: {FONT}; display: flex; flex-direction: column">
<div style="flex: none; height: 68px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px"><div style="display: flex; align-items: center; gap: 14px">{GLASSBTN('Back to Practice', CHEV_L, href='Laptop.dc.html')}<h1 style="margin: 0; font-size: 18px; font-weight: 600">Chords</h1></div>{GLASSBTN('Keyboard', KEYSI, 'openKeys')}</div>
<sc-if value="{{{{kbShow}}}}" hint-placeholder-val="{{{{true}}}}">{KEYHANDS(180)}</sc-if>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 26px 40px 130px; display: flex; flex-direction: column; align-items: center; gap: 20px"><div style="width: 820px; max-width: 100%; display: flex; flex-direction: column; gap: 20px">{TITLEBLOCK(56)}{VIEWBODY(440, 4, 170, True)}{PRACTISE('PlayerLaptop.dc.html')}</div></main>
{DOCK_LAPTOP}
{POPS_LAPTOP('PlayerLaptop.dc.html')}
</div>'''
open(OUT + 'ChordsLaptop.dc.html', 'w').write(HEAD % 'Chords, laptop' + LAPFRAME_TOP + LP_INNER + f"""
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
{PRE}
{ch_js({'root': 3, 'q': 14}, 1710, 180, 4, 170)}
</script>
</body>
</html>
""")
for f in ('ChordsApp', 'ChordsDesk'):
    if os.path.exists(OUT + f + '.dc.html'): os.remove(OUT + f + '.dc.html')
print('r42 chords ok')
