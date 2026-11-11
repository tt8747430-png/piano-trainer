import re
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
// The octave picker for moving to a key (Transpose, Random chords' key; R42 v107). Owner on v106: "it is interesting
// for transpose but not for picking a chords. and I dont like the split note between the C sharp and d flat". Each
// black key carries one name, the one its key is written with (D♭ major, C♯ minor); when a black key is chosen, its
// other spelling is offered under the keys ("Written as C♯ | D♭").
const KEYPICK = (curL, curA, pick, pre, ok) => {
  // owner, v115: "the selects flat or sharp or natural only change the current key and not all of them". The letters
  // are always plain; the chosen one wears its accidental. ♭ ♮ ♯ changes the chosen letter alone; one that makes no
  // root or key for it (E♯, F♭, D♯ major) is dimmed in place. A new letter starts natural.
  return { lets: [0, 1, 2, 3, 4, 5, 6].map((l) => { const on = l === curL, a2 = on ? curA : 0;
      return { s: LET[l] + ACC[String(a2)], on, dis: false, op: 1, bg: on ? '#F6E3BC' : '#FEFDFB', ring: on ? 'none' : '0 0 0 1px ' + C.line, fw: on ? 800 : 600, aria: (pre || '') + LET[l] + (a2 ? (a2 > 0 ? ' sharp' : ' flat') : ''), pick: () => { if (!on) pick(l, 0); } }; }),
    accs: [[-1, '♭', 'Flat'], [0, '♮', 'Natural'], [1, '♯', 'Sharp']].map(([a, g, w]) => { const on = a === curA, good = ok(curL, a);
      return { l: g, aria: w + ' ' + LET[curL], on, dis: !good, op: good ? 1 : 0.35, bg: on ? '#FEFDFB' : 'transparent', sh: on ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', pick: () => { if (good && !on) pick(curL, a); } }; }) };
};
// a pitch spelled the way it moves (owner, v115: "why when transposing from c i go to d flat and not to c sharp"):
// a white key by its letter; a black key as a sharp going up and a flat going down, the other way when that spelling
// makes no key (D♯ major is E♭ major); never E♯, B♯, F♭ or C♭ as a root
const spellPc = (pc, dir, ok) => { const n = NATPC.indexOf(pc); if (n >= 0) return [n, 0];
  const sh = [NATPC.indexOf((pc + 11) % 12), 1], fl = [NATPC.indexOf((pc + 1) % 12), -1], o = dir > 0 ? [sh, fl] : [fl, sh];
  return o.find(([l, a]) => !ok || ok(l, a)) || o[0]; };
const plainRoot = (l, a) => (SKIP.includes(LET[l] + a) ? [NATPC.indexOf((NATPC[l] + a + 12) % 12), 0] : [l, a]);
// a ♭ or ♯ names a black key only: C♭, F♭, E♯ and B♯ are never offered for a key, as for a root
const keyOk = (minorish) => (l, a) => !SKIP.includes(LET[l] + a) && Math.abs([0, 2, 4, -1, 1, 3, 5][l] + 7 * a - (minorish ? 3 : 0)) <= 7;

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
// the voicings in three groups by where they come from (R42 v103, owner: "what are my voicing or what are from the
// music theory and what from other cources"): music theory, jazz piano (Levine's The Jazz Piano Book and the jazz
// transcripts), and Gorshkov's course, which is in Learn
const isM11 = (q) => q.k === 'm11', isHalfDim = (q) => q.k === 'ø7';
const VOICINGS = [
  { v: 'Close', l: 'Close position', g: 'Music theory', ok: () => '' },
  { v: 'Drop 2', l: 'Drop 2', g: 'Music theory', ok: (q) => q.t.length === 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Drop 3', l: 'Drop 3', g: 'Music theory', ok: (q) => q.t.length === 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Shell', l: 'Shell', g: 'Jazz piano', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Rootless A', l: 'Rootless A', g: 'Jazz piano', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Rootless B', l: 'Rootless B', g: 'Jazz piano', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'Spread', l: 'Spread', g: 'Jazz piano', ok: (q) => q.t.some((x) => x[1] === 7) ? '' : 'Needs a 7th' },
  { v: 'So What', l: 'So What', g: 'Jazz piano', ok: (q) => isMin7(q) ? '' : 'For minor sevenths' },
  { v: 'Kenny Barron', l: 'Kenny Barron', g: 'Jazz piano', ok: (q) => isMin7(q) ? '' : 'For minor sevenths' },
  { v: 'Upper structure', l: 'Upper structure', g: 'Jazz piano', ok: (q) => isDom7(q) ? '' : 'For dominant sevenths' },
  // Gorshkov: "с басом в левой и в правой — септаккорд, оставшиеся 4 ноты" (02-ninth-chords/theory.pdf, p. 4);
  // Cm7♭5 "бас + минорное трезвучие в правой", C + E♭m; Cm11 "состоит из двух простых — до минорного и си♭
  // мажорного трезвучий" (extra-jazz-voicings.pdf, pp. 3–4)
  { v: 'Bass and chord', l: 'Bass and chord', g: 'Gorshkov’s course', ok: (q) => q.t.length >= 4 ? '' : 'Needs a chord of 4 notes' },
  { v: 'Two triads', l: 'Two triads', g: 'Gorshkov’s course', ok: (q) => isM11(q) ? '' : 'For minor elevenths' },
];
const VNAME = Object.fromEntries(VOICINGS.map((v) => [v.v, v.l]));
// how many of a two-hand voicing's notes, from the bottom, the left hand plays; Drop 2 and Drop 3 leave a gap a hand
// cannot span, so the dropped note is the left hand's
const TWO = { 'Drop 2': 1, 'Drop 3': 1, 'Bass and chord': 1, 'Spread': 2, 'So What': 3, 'Kenny Barron': 3, 'Upper structure': 2, 'Two triads': 3 };
// voicings that keep the root at the bottom name a different bass as a slash chord; the rootless ones never do
const ROOTED = { Close: 1, Shell: 1 };
// the chord in one hand (R42 v103): every note inside a ninth, the reach of a hand. Past four notes the perfect 5th
// goes first ("the fifth (G) is often omitted", musicca.com, Cm11), then the 9th under an 11th or a 13th
// (Cm11(no9), pianochord.org), and a note still out of reach comes down an octave: Cm11 is C E♭ F B♭, as
// pianochord.org prints it; C13 is C E A B♭
function handForm(q) {
  let t = q.t.map((x) => x.slice()); const has = (d) => t.some((x) => x[1] === d);
  if (t.length > 4) t = t.filter((x) => !(x[1] === 5 && x[0] === 7));
  if (t.length > 4 && (has(11) || has(13))) t = t.filter((x) => x[1] !== 9);
  t.sort((a, b) => a[0] - b[0]);
  while (t[t.length - 1][0] - t[0][0] > 14) { const top = t.pop(); top[0] -= 12; t.push(top); t.sort((a, b) => a[0] - b[0]); }
  return t;
}
// the left hand's root sits from C2 to B2: "left hand playing root–5th… in the low–mid register (about C2–A2)"
// (pianochord.org, Chord Progression Explorer, "How should I play these on piano?")
const lhM = (pc) => 36 + (((pc % 12) + 12) % 12);
// a hand's notes from a first note, each next one the nearest above: the first one placed where the right hand sits,
// nearest D4 and clear of the left hand
function stack(root, list, floor, hand) { const pc0 = ((root + list[0][0]) % 12 + 12) % 12; let m0 = pc0 + 36; while (m0 < floor) m0 += 12; if (Math.abs(m0 + 12 - 62) < Math.abs(m0 - 62) && hand === 'R') m0 += 12;
  const out = [{ m: m0, semi: list[0][0], deg: list[0][1], hand }]; list.slice(1).forEach(([semi, deg]) => { const pc = ((root + semi) % 12 + 12) % 12; let m = out[0].m + ((pc - pc0 + 12) % 12 || 12); out.push({ m, semi, deg, hand }); });
  return out.sort((a, b) => a.m - b.m); }
// both hands (R42 v103): the left hand the bass, the right the chord above it.
// a triad: root and 5th below, the triad above: C2 G2 | C4 E4 G4
// four notes: the right hand leaves the root to the left, "close voicings that feature the 3rd and 7th": Cmaj7 C2 G2 |
// E4 G4 B4 (pianochord.org, Chord Progression Explorer); more: Cm11 C2 G2 | E♭4 F4 B♭4 D5; C9 C2 G2 | E4 B♭4 D5;
// with a 13th the 7th goes below: C13 C2 B♭2 | E4 A4 D5. The right hand's notes may start on any of them (rot), so a
// chord added to the staff takes the one nearest the last ("Cmaj7 – Am7 – Dm7 – G7: right hand stacks [B E G],
// [G C E], [C F A], [B F G]; left hand plays roots and fifths") (Levine, The Jazz Piano Book, "two-handed voicings")
// another bass: the left hand plays it alone, the right the chord's other notes over it: C/E is E3 | G4 C5 E5
function twoHands(root, q, inv, rot) {
  const T = q.t.map((x) => x.slice()), get = (d) => T.find((x) => x[1] === d), r0 = lhM(root);
  let L, up;
  if (inv > 0) { const hf = handForm(q), b = hf[Math.min(inv, hf.length - 1)], rot = hf.slice(inv).concat(hf.slice(0, inv));
    L = [{ m: lhM(root + b[0]), semi: b[0], deg: b[1], hand: 'L' }]; up = rot.length > 3 ? rot.slice(1) : rot; }
  else { const second = T.length > 4 && get(13) ? get(7) : (get(5) || get(7));
    L = [{ m: r0, semi: 0, deg: 1, hand: 'L' }].concat(second ? [{ m: r0 + (((second[0] % 12) + 12) % 12), semi: second[0], deg: second[1], hand: 'L' }] : []);
    up = T.length <= 3 ? T : T.length === 4 ? T.filter((x) => x !== get(1)) : T.filter((x) => x !== get(1) && x !== second); }
  const k = (rot || 0) % up.length; up = up.slice(k).concat(up.slice(0, k));
  return L.concat(stack(root, up, Math.max(...L.map((x) => x.m)) + 2, 'R')); }
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
function voice(root, q, inv, voicing, hands, rot) {
  if (hands === 'Split') hands = 'Both';
  if (voicing === 'Close' && hands === 'Both') { const ns2 = twoHands(root, q, inv, rot); return ns2.map((x) => Object.assign(x, spell(root, ((x.semi % 12) + 12) % 12, x.deg))); }
  const base = 60 + root; // every root in the octave from middle C, as a chord chart shows it
  const s = (deg) => (q.t.find((x) => x[1] === deg) || [null])[0];
  const third = s(3) ?? s(4) ?? s(2); const dom = isDom7(q);
  let src;
  if (voicing === 'Shell') src = [[0, 1], [third, s(3) != null ? 3 : (s(4) != null ? 4 : 2)], [s(7), 7]];
  // rootless: 3-5-7-9 and 7-9-3-5; on a dominant the 13th takes the 5th's place (jps-podcast/292 @02:10, exercises/116 @30:16)
  else if (voicing === 'Rootless A') src = [[third, 3], dom ? [9, 13] : [s(5) ?? 7, 5], [s(7), 7], [s(9) ?? 14, 9]];
  else if (voicing === 'Rootless B') src = [[s(7) - 12, 7], [(s(9) ?? 14) - 12, 9], [third, 3], dom ? [9, 13] : [s(5) ?? 7, 5]];
  // spread: LH 1-7, RH 3, 5 (13 on a dominant), 9 (exercises/116 @29:11, jps-podcast/245 @12:32)
  // root and chord: the bass alone under the rest (Gorshkov, 02-ninth-chords p. 4); a triad stays whole above its root
  else if (voicing === 'Bass and chord') src = [[-12, 1]].concat(q.t.filter((x) => x[1] !== 1));
  else if (voicing === 'Two triads') src = [[-12, 1], [-9, 3], [-5, 5], [-2, 7], [2, 9], [5, 11]];
  else if (voicing === 'Spread') src = [[-12, 1], [s(7) - 12, 7], [third, 3], dom ? [9, 13] : [s(5) ?? 7, 5], [s(9) ?? 14, 9]];
  // So What: three 4ths from the root, a major 3rd on top (watch-later/008 @07:00)
  else if (voicing === 'So What') src = [[-12, 1], [-7, 11], [-2, 7], [3, 3], [7, 5]];
  // Kenny Barron: 1-5-9 under b3-b7-11 (watch-later/008 @07:00)
  else if (voicing === 'Kenny Barron') src = [[-12, 1], [-5, 5], [2, 9], [3, 3], [10, 7], [17, 11]];
  // upper structure II: the tritone 3-7 low, a major triad a tone up (9, #11, 13) above (exercises/148 @04:14, 069)
  else if (voicing === 'Upper structure') src = [[third - 12, 3], [s(7) - 12, 7], [2, 9], [6, 11], [9, 13]];
  else src = handForm(q);
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
  // the one-hand voicings: Left plays them an octave down; Both puts the root alone under them (Shell gives its root
  // to the left hand), as a pianist plays a rootless voicing over the bass
  if (hands === 'Left') ns = ns.map((x) => Object.assign({}, x, { m: x.m - 12, hand: 'L' }));
  if (hands === 'Both') ns = [{ m: lhM(root), semi: 0, deg: 1, hand: 'L' }].concat(ns.filter((x) => x.deg !== 1));
  const keep = []; ns.forEach((x) => { if (!keep.some((y) => y.m === x.m)) keep.push(x); });
  return keep.map((x) => Object.assign(x, spell(root, ((x.semi % 12) + 12) % 12, x.deg)));
}
// how many inversions a voicing has, and the bass a slash chord names: the note at the bottom when the voicing keeps
// its root there; a rootless voicing names none
const invCount = (q, vv) => (TWO[vv] && !vv.startsWith('Drop') ? 1 : Math.min(4, vv === 'Shell' ? 3 : vv.startsWith('Rootless') ? 4 : vv.startsWith('Drop') ? q.t.length : handForm(q).length));
function bassOf(root, q, inv, vv, v) { if (!inv || vv.startsWith('Rootless')) return ''; if (vv.startsWith('Drop')) { const t = q.t[inv]; return t ? spell(root, ((t[0] % 12) + 12) % 12, t[1]).name : ''; }
  const lo = v.slice().sort((a, b) => a.m - b.m)[0]; return lo && lo.deg !== 1 ? lo.name : ''; }
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
    out.push({ T, m: x.m, L: x.L, dn, d: x.d, a5: false, f: fm[x.m] || '', x: nx, y, ay: y + 5, ax: cx - 22 - (shift ? 0 : 0), acc: ACC[String(x.d)], a1: x.d === -1, a2: x.d === 1, a3: x.d === -2, a4: x.d === 2, c: ROLE[x.deg] || C.ink });
    prev[key] = { dn, shift };
    const lo = T ? 28 : 16, hi = T ? 40 : 28;
    if (T) { for (let k = 28; k >= dn; k -= 2) ledg.push({ y: 70 - (k - 30) * 5, x1: cx - 11, x2: nx + 11 }); for (let k = 40; k <= dn; k += 2) ledg.push({ y: 70 - (k - 30) * 5, x1: cx - 11, x2: nx + 11 }); }
    else { for (let k = 16; k >= dn; k -= 2) ledg.push({ y: 150 - (k - 18) * 5, x1: cx - 11, x2: nx + 11 }); for (let k = 28; k <= dn; k += 2) ledg.push({ y: 150 - (k - 18) * 5, x1: cx - 11, x2: nx + 11 }); }
  });
  // each finger number beside its note, right of the chord, as printed charts set it; seconds pushed apart
  const shifted = out.some((n) => n.x !== cx), fx = cx + (shifted ? 30 : 17); const digits = [];
  [true, false].forEach((k) => { let last = null; out.filter((n) => n.T === k && n.f).sort((a, b) => b.y - a.y).forEach((n) => { let y = n.y + 4; if (last !== null && last - y < 10) y = last - 10; last = y; digits.push({ x: fx, y, f: n.f, f1: n.f === 1, f2: n.f === 2, f3: n.f === 3, f4: n.f === 4, f5: n.f === 5 }); }); });
  const ys = out.map((n) => n.y).concat(digits.map((d) => d.y - 8)), vt = Math.min(18, Math.min(...ys) - 12), vbot = Math.max(168, Math.max(...ys) + 12);
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
const vKey = VNAME[st.voicing] ? st.voicing : 'Close', voicing = VOICINGS.find((v) => v.v === vKey).ok(q) ? 'Close' : vKey;
const invN = invCount(q, voicing);
const inv = Math.min(st.inv ?? 0, invN - 1);
const upper = (() => { const u = upperOf(root, q); RL = rLet; return u; })(), canSplit = false;
const bassOn = false, hands = st.hand === 'Split' ? 'Both' : (st.hand || 'Right'), fingOn = true, kbOnS = st.kbOn !== false, kbView = st.kbView || '3d', kbHands = st.kbHands !== false, kbAngle = st.kbAngle || 'seat', kbMode = !kbOnS ? 'off' : (kbView === '2d' ? '2d' : (kbHands ? 'hands' : '3d')), kbShow = kbOnS, is3d = kbMode === 'hands' || kbMode === '3d', keys = st.keys || 'Chord';
const playAs = 'Block', arp = false, dir = 'Up', keyLabel = st.keyLabel || 'Note names', names = keyLabel === 'Note names', fingKeys = false, treble = false, auto = true;
const oct = st.oct || 0; // an added chord may sit an octave lower, to stay under the hand (voice leading)
const rot = hands === 'Both' && voicing === 'Close' ? (st.rot || 0) : 0;
const ns = voice(root, q, inv, voicing, hands, rot).map((x) => Object.assign(x, { m: x.m + 12 * oct }));
const ms = ns.map((x) => x.m);
const sym = RN + q.k;
const bassName = (() => { const b = bassOf(root, q, inv, voicing, ns); RL = rLet; return b; })();
const slash = bassName ? '/' + bassName : '';
const symLen = (sym + slash).length;
const symScale = symLen <= 6 ? 1 : (symLen <= 9 ? 0.78 : 0.6);
const full = RN + ' ' + q.n;
const playMode = st.playMode || 'Block';
const play = (a, d) => { set({ playing: a ? 'arp' : 'chord' }); const t = sound(ms, a, d || 'Up'); clearTimeout(this._t); this._t = setTimeout(() => set({ playing: false }), t); };
const change = (o) => { o = Object.assign({ rot: 0 }, o); set(o); if (auto) { const r = o.root ?? root, qq = QS[o.q ?? qi], iv = o.inv ?? inv; const vv = o.voicing || voicing; const hh = o.hand || hands; sound(voice(r, qq, Math.min(iv, qq.t.length - 1), (VOICINGS.find((v) => v.v === vv) || VOICINGS[0]).ok(qq) ? 'Close' : vv, hh).map((x) => x.m), false, dir); } };
// the range: around the chord, or two or four octaves the learner moves along the 88 by dragging the strip (v108)
const WH88 = []; for (let m = 21; m <= 108; m++) if ([0, 2, 4, 5, 7, 9, 11].includes(m % 12)) WH88.push(m);
const fixedN = keys === '24' || keys === '48' ? +keys : 0;
const [lo, hi] = fixedN ? (() => { const l0 = st.rangeLo ?? (Math.floor(Math.min(...ms) / 12) * 12 - (fixedN > 24 ? 12 : 0)); const nW = fixedN === 24 ? 14 : 28, i0 = WH88.findIndex((m) => m >= l0), i = Math.max(0, Math.min(52 - nW, i0 < 0 ? 52 - nW : i0)); return [WH88[i], WH88[i + nW - 1]]; })() : range(ms, keys, ''' + str(minOct) + r''');
const Rn = ns.filter((x) => x.hand === 'R'), Ln = ns.filter((x) => x.hand === 'L');
const fm = {}; fingers(Rn, 'R', inv, voicing === 'Close').forEach((f, i) => { fm[Rn[i].m] = f; }); fingers(Ln, 'L', inv, voicing === 'Close').forEach((f, i) => { fm[Ln[i].m] = f; });
const tonesL = keyLabel === 'Degrees';
// a chord tone as its degree of the major scale, as chord symbols count them: 1 ♭3 5 ♭7 9 (Gorshkov, 01-seventh-chords)
const MAJ = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 9: 14, 11: 17, 13: 21 };
const degOf = (x) => { const d = ((((x.semi - MAJ[x.deg]) % 12) + 18) % 12) - 6; return (d === -1 ? '♭' : d === 1 ? '♯' : d === -2 ? '𝄫' : '') + x.deg; };
// an interval as musicians write it, from the notes' spelling: C to E♭ is m3, C to D♯ is A2
const ivl = (a, b) => { const dn = (x) => (Math.floor((x.m - x.d) / 12) - 1) * 7 + LET.indexOf(x.L); const sd = dn(b) - dn(a), s7 = ((sd % 7) + 7) % 7, diff = b.m - a.m - [0, 2, 4, 5, 7, 9, 11][s7] - 12 * Math.floor(sd / 7);
  return ([0, 3, 4].includes(s7) ? { '-1': 'd', 0: 'P', 1: 'A' } : { '-2': 'd', '-1': 'm', 0: 'M', 1: 'A' })[diff] + (sd + 1); };
// Labels · Intervals: each hand's lowest note by name, every other note by its interval from the note under it
const ivOn = keyLabel === 'Intervals', ivLab = {}; ['R', 'L'].forEach((h) => { ns.filter((x) => x.hand === h).sort((a, b) => a.m - b.m).forEach((x, i, a) => { ivLab[x.m] = i ? ivl(a[i - 1], x) : x.name; }); });
const labOf = (x) => (names ? x.name : (ivOn ? ivLab[x.m] : degOf(x)));
const marks = {}; ns.forEach((x) => { marks[x.m] = [ROLE[x.deg] || C.accent, keyLabel === 'None' ? '' : labOf(x)]; });
const kb = calmKeys(lo, hi, marks, ''' + str(W) + ', ' + str(KH) + r''');
{ let wi = 0, bi = 0; for (let m = lo; m <= hi; m++) { const k = NAT.includes(m % 12) ? kb.whites[wi++] : kb.blacks[bi++]; if (k) k.fing = fingKeys && fm[m] ? String(fm[m]) : ''; } }
const bass = ns[0];
const shape = INV[inv] + (inv ? ' · ' + bass.name + ' in the bass' : '') + ' · ' + voicing;
const R = Rn, L = Ln; const fR = R.map((x) => fm[x.m]), fL = L.map((x) => fm[x.m]);
// the staff holds the chords the learner has gathered, in order; the current one is the page's chord
const snap = { rl: rLet, ra: rAcc, q: qi, inv, voicing: st.voicing || 'Close', hand: hands, oct, rot };
const cur0 = st.cur ?? 0;
const seq = (st.seq || [snap]).map((c, i) => (i === cur0 ? snap : c));
const cur = Math.min(cur0, seq.length - 1);
const symOf = (c) => { RL = c.rl; const rt = rootPc(c.rl, c.ra), qq = QS[c.q]; const vv = (VOICINGS.find((v) => v.v === c.voicing) || VOICINGS[0]).ok(qq) ? 'Close' : c.voicing; const nI = invCount(qq, vv); const iv = Math.min(c.inv, nI - 1); const v = voice(rt, qq, iv, vv, c.hand, c.rot || 0).map((x) => Object.assign(x, { m: x.m + 12 * (c.oct || 0) })); const bn = bassOf(rt, qq, iv, vv, v); const out = { v, iv, vv, s: LET[c.rl] + ACC[String(c.ra)] + qq.k + (bn ? '/' + bn : '') }; RL = rLet; return out; };
// several chords are written in their key (the first chord's): its signature after the clef, and only the notes
// that leave it carry an accidental, which holds to the end of the bar as in print (owner, canvas 89)
// the staff is written in C, every accidental beside its note; a key signature is the learner's setting (owner, v105:
// "the staf is always in c and there will be a setting to change the staff key in the settings")
const SIGS = [[0, 'C'], [1, 'G'], [2, 'D'], [3, 'A'], [4, 'E'], [5, 'B'], [6, 'F♯'], [7, 'C♯'], [-1, 'F'], [-2, 'B♭'], [-3, 'E♭'], [-4, 'A♭'], [-5, 'D♭'], [-6, 'G♭'], [-7, 'C♭']];
const KFIF = [0, 2, 4, -1, 1, 3, 5];
// the key is its own (owner, v112: "this is a transpose for the key so it should transpose naturally the key"): it
// starts in C major, the staff in C (v105), its signature always drawn, and changes only in the Key drawer
const KEY = st.key || { l: 0, a: 0, mi: false };
const kMinor = KEY.mi;
const keyF = KFIF[KEY.l] + 7 * KEY.a - (kMinor ? 3 : 0);
const sigF = Math.abs(keyF) <= 7 ? keyF : 0;
const sigOf = {}; (sigF > 0 ? [3, 0, 4, 1, 5, 2, 6] : [6, 2, 5, 1, 4, 0, 3]).slice(0, Math.abs(sigF)).forEach((l) => { sigOf[LET[l]] = sigF > 0 ? 1 : -1; });
const sigW = sigF ? Math.abs(sigF) * 9 + 4 : 0;
// Play as Arpeggio writes one chord as it is played: its notes in a row, up, or up and down (owner, canvas 90)
const arpOn = seq.length === 1 && playMode !== 'Block', arpN = Math.max(ns.filter((x) => x.hand === 'R').length, ns.filter((x) => x.hand === 'L').length);
const arpIdx = Array.from({ length: playMode === 'UpDown' ? 2 * arpN - 1 : arpN }, (_, k) => (k < arpN ? k : 2 * arpN - 2 - k)), ARP = 40;
// the next chord's place is drawn on the staff, empty, with a + in it (R42 v103): adding happens where the chord will stand
const addOn = !arpOn && seq.length < 8;
const KS = ''' + ('1.75' if W > 600 else '1.5') + r'''; // one staff size: more chords scroll, never shrink (R42 v106)
// one chord and many are drawn alike (owner, v111: "it seams that it uses different controls with different features"): each in its own bar
// a lone chord's bar keeps room for its note names (they are shown for one chord only); the staff runs the card's width
const LW = seq.length === 1 && !arpOn && keyLabel !== 'None' ? 16 : 0, MINSW = ''' + ('454' if W > 600 else '228') + r''';
const SLOT = 86, X0 = 64 + sigW + 4, AX = X0 + 26, SW = arpOn ? Math.max(MINSW, AX + (arpIdx.length - 1) * ARP + 40) : Math.max(MINSW, X0 + LW + seq.length * SLOT + (addOn ? 56 : 20)), addX = X0 + LW + SLOT * seq.length + 28;
const sv = (() => { const all = { notes: [], ledg: [], digits: [], cols: [] }, per = [], alt = {}; let vt = 12, vbot = 168;
  seq.forEach((c, i) => { const o = symOf(c); const cx = X0 + LW + SLOT * (i + 0.5);
    const R1 = o.v.filter((x) => x.hand === 'R'), L1 = o.v.filter((x) => x.hand === 'L'); const f1 = {};
    fingers(R1, 'R', o.iv, o.vv === 'Close').forEach((f, k) => { f1[R1[k].m] = f; }); fingers(L1, 'L', o.iv, o.vv === 'Close').forEach((f, k) => { f1[L1[k].m] = f; });
    const one = arpOn ? (() => { const a = { notes: [], ledg: [], digits: [], vt: 4, vbot: 168 };
      ['R', 'L'].forEach((h) => { const hn = o.v.filter((x) => x.hand === h).sort((p, q) => p.m - q.m); arpIdx.forEach((j, k) => { if (!hn[j]) return; const r = staff([hn[j]], treble, SW, {}, AX + k * ARP, SW); r.notes.forEach((n) => { n.k = k; const f = f1[n.m];
        if (fingOn && f) a.digits.push({ x: n.x - 3, y: n.T ? n.y - 11 : n.y + 20, f, f1: f === 1, f2: f === 2, f3: f === 3, f4: f === 4, f5: f === 5 }); }); a.notes.push(...r.notes); a.ledg.push(...r.ledg); a.vt = Math.min(a.vt, r.vt - 10); a.vbot = Math.max(a.vbot, r.vbot); }); });
      return a; })() : staff(o.v, treble, SW, fingOn ? f1 : {}, cx, SW);
    if (seq.length > 1 || sigF) one.notes.forEach((n) => { const k = (n.T ? 'T' : 'B') + n.dn, was = alt[k] ?? (sigOf[n.L] || 0), show = n.d !== was; alt[k] = n.d;
      n.a1 = show && n.d === -1; n.a2 = show && n.d === 1; n.a3 = show && n.d === -2; n.a4 = show && n.d === 2; n.a5 = show && n.d === 0; });
    one.notes.forEach((n) => { n.st = i === cur && !arpOn ? '#356890' : C.ink; n.sw = i === cur && !arpOn ? 2.2 : 1.6; n.ac = i === cur && !arpOn ? '#356890' : C.ink; });
    per.push(one.notes); all.notes.push(...one.notes); all.ledg.push(...one.ledg); all.digits.push(...one.digits);
    vt = Math.min(vt, one.vt); vbot = Math.max(vbot, one.vbot);
    const on = i === cur; const bl = arpOn ? X0 + 3 : cx - SLOT / 2 + 3, bw = arpOn ? AX + (arpIdx.length - 1) * ARP + 26 - X0 - 6 : SLOT - 6; all.cols.push({ s: o.s, on, l0: (bl / SW * 100) + '%', w: (bw / SW * 100) + '%', many: seq.length > 1, fs: seq.length > 1 ? 13 : 16, px: seq.length > 1 ? 8 : 12, x: cx, left: ((arpOn ? SW / 2 : cx) / SW * 100) + '%', fw: on ? 700 : 600, tc: on ? '#356890' : C.soft, aria: on ? 'Play ' + o.s : 'Show and play ' + o.s, edit: () => editChord(i), pick: () => pickChord(i) }); });
  // only the staves in use are drawn (R42, canvas 87): a right-hand chord needs the treble staff alone, so the staff
  // fits the first screen; both staves come back as soon as a left hand or a low note needs them
  const hasT = all.notes.some((n) => n.T), hasB = all.notes.some((n) => !n.T), ysN = all.notes.map((n) => n.y).concat(all.digits.map((d) => d.y - 6));
  if (!hasB) vbot = Math.max(84, Math.max(...ysN) + (arpOn && keyLabel !== 'None' ? 30 : 14)); else if (arpOn) vbot = Math.max(vbot, Math.max(...ysN) + (keyLabel !== 'None' ? 44 : 32)); if (!hasT) vt = Math.min(96, Math.min(...ysN) - 14);
  // the Labels setting also names the current chord's notes on the staff, left of each notehead
  const sigY = sigF > 0 ? [30, 45, 25, 40, 55, 35, 50] : [50, 35, 55, 40, 60, 45, 65];
  const sig = []; [hasT ? 0 : null, hasB ? 90 : null].filter((v) => v !== null).forEach((dy) => { for (let k = 0; k < Math.abs(sigF); k++) sig.push({ x: 46 + k * 9, y: sigY[k] + dy + 5, sharp: sigF > 0, flat: sigF < 0 }); });
  // Intervals sit between the two notes they measure
  const pairs = (per[cur] || []).slice().sort((a, b) => a.m - b.m);
  const pct = (x, y) => ({ left: (x / SW * 100).toFixed(2) + '%', top: ((y - vt) / (vbot - vt) * 100).toFixed(2) + '%' });
  // in an arpeggio each label sits under its note, an interval under the step between two notes
  const arpLabs = () => (per[cur] || []).map((n, i, a) => { const x = ns.find((y) => y.m === n.m); if (!x) return null; if (!ivOn) return Object.assign({ t: names ? x.name : degOf(x), c: C.ink, tf: 'translate(-50%, -50%)' }, pct(n.x, n.y + (n.T ? 17 : 31)));
    const p = a.find((z) => z.T === n.T && z.k === n.k - 1), b = p && ns.find((y) => y.m === p.m); if (!b) return null; const up = n.m >= p.m;
    return Object.assign({ t: ivl(up ? b : x, up ? x : b), c: C.soft, tf: 'translate(-50%, -50%)' }, pct((n.x + p.x) / 2, Math.max(n.y, p.y) + (n.T ? 17 : 31))); }).filter(Boolean);
  // a note sounds when tapped where the notes stand apart (an arpeggio); stacked in a chord they are 17px apart,
  // too close for a finger, so there the chord's name plays it
  const taps = !arpOn ? [] : (per[cur] || []).map((n) => { const x = ns.find((y) => y.m === n.m); if (!x) return null; const nm = x.name + (Math.floor((x.m - x.d) / 12) - 1);
    return Object.assign({ aria: 'Play ' + nm, play: () => sound([n.m], false, 'Up') }, pct(n.x, n.y)); }).filter(Boolean);
  const labs = keyLabel === 'None' || seq.length > 1 ? [] : arpOn ? arpLabs() : ivOn ? pairs.map((n, i) => { const p = pairs[i - 1]; if (!p || p.T !== n.T) return null; const a = ns.find((y) => y.m === p.m), b = ns.find((y) => y.m === n.m); if (!a || !b) return null; const acc = [p, n].some((z) => z.a1 || z.a2 || z.a3 || z.a4 || z.a5);
    return { t: ivl(a, b), left: ((n.x - (n.x !== p.x ? 14 : 0) - (acc ? 30 : 15)) / SW * 100).toFixed(2) + '%', top: (((n.y + p.y) / 2 - vt) / (vbot - vt) * 100).toFixed(2) + '%', c: C.soft, tf: 'translate(-100%, -50%)' }; }).filter(Boolean) : (per[cur] || []).map((n) => { const x = ns.find((y) => y.m === n.m); if (!x) return null; const acc = (per[cur] || []).some((z) => z.a1 || z.a2 || z.a3 || z.a4 || z.a5); // one column of names, clear of every accidental
    return { t: names ? x.name : degOf(x), left: ((n.x - (acc ? 30 : 15)) / SW * 100).toFixed(2) + '%', top: ((n.y - vt) / (vbot - vt) * 100).toFixed(2) + '%', c: C.ink, tf: 'translate(-100%, -50%)' }; }).filter(Boolean);
  const hl = [];
  if (st.playing === 'all' && st.sounding != null) hl.push({ x: X0 + LW + SLOT * st.sounding + 10, w: 1.5, y: (hasT ? 30 : 110) - 6, h: (hasB ? 150 : 70) - (hasT ? 30 : 110) + 12, f: '#356890', o: 1 });
  // how the chords connect (R42 v74): a note both chords share is tied, as a held note is written; every other note is
  // traced to the nearest note it moves to. "move as little as possible… whenever there's a common note… keep it"
  // (transcriptions/youtube/watch-later/065 @14:18); "annotate it… by using arrows" (exercises/081 @08:14)
  let held = '', moved = '';
  for (let i = 1; i < per.length; i++) { const A = per[i - 1], B = per[i]; [true, false].forEach((T) => { const a = A.filter((n) => n.T === T), b = B.filter((n) => n.T === T);
    b.forEach((n) => { const same = a.find((p) => p.m === n.m);
      if (same) { held += 'M' + (same.x + 10) + ' ' + (same.y + 3) + 'Q' + ((same.x + n.x) / 2) + ' ' + (same.y + 11) + ' ' + (n.x - 10) + ' ' + (n.y + 3); return; }
      const free = a.filter((p) => !b.some((q) => q.m === p.m)); if (!free.length) return; const from = free.slice().sort((p, q) => Math.abs(p.m - n.m) - Math.abs(q.m - n.m))[0];
      if (Math.abs(from.m - n.m) <= 4) moved += 'M' + (from.x + 11) + ' ' + from.y + 'L' + (n.x - 11) + ' ' + n.y; }); }); }
  let path = ''; (hasT ? [30, 40, 50, 60, 70] : []).concat(hasB ? [110, 120, 130, 140, 150] : []).forEach((y) => { path += 'M14 ' + y + 'H' + (SW - 14); });
  // no ties or lines between the chords (owner, v105: "I dont like this ties that tie the chords")
  return { held: 'M0 0', moved: 'M0 0', vt, vbot, notes: all.notes, ledg: all.ledg, digits: all.digits, cols: all.cols, hl, path, sig, taps, bars: [14, SW - 14].concat(!arpOn ? seq.map((_, i) => X0 + LW + SLOT * (i + 1)) : [X0, AX + (arpIdx.length - 1) * ARP + 26]).map((x) => 'M' + x + ' ' + (hasT ? 30 : 110) + 'V' + (hasB ? 150 : 70)).join(''), hasT, hasB, labs, vb: '0 ' + vt + ' ' + SW + ' ' + (vbot - vt), w: Math.round(SW * KS) + 'px', clefW: Math.round(X0 * KS) + 'px', canAdd: addOn, addL: (addX / SW * 100).toFixed(2) + '%', addT: ((((hasT && hasB) ? 90 : (hasT ? 50 : 130)) - vt) / (vbot - vt) * 100).toFixed(2) + '%' }; })();
const loadChord = (c) => ({ rl: c.rl, ra: c.ra, q: c.q, inv: c.inv, voicing: c.voicing, hand: c.hand, oct: c.oct || 0, rot: c.rot || 0 });
const soundOf = (c) => sound(symOf(c).v.map((x) => x.m), false, 'Up');
const editChord = (i) => set(Object.assign({ seq, cur: i, sheet: 'next', editAt: i, toast: null }, loadChord(seq[i])));
const pickChord = (i) => { if (i === cur) { soundOf(seq[i]); return; } set(Object.assign({ seq, cur: i, toast: null }, loadChord(seq[i]))); soundOf(seq[i]); };
const addChord = () => { if (editAt != null) { set({ sheet: 'mType', editAt: null }); return; } if (seq.length >= 8) return; const s2 = seq.concat([Object.assign({}, snap, { inv: 0 })]); set({ seq: s2, cur: s2.length - 1, inv: 0, sheet: 'mType', toast: null }); };
const removeChord = () => { if (seq.length < 2) return; const gone = symOf(seq[cur]).s; const s2 = seq.filter((_, i) => i !== cur); const c2 = Math.max(0, cur - 1); clearTimeout(this._toast); this._toast = setTimeout(() => set({ toast: null }), 5000); set(Object.assign({ seq: s2, cur: c2, sheet: null, editAt: null, trOff: [], toast: { t: gone + ' removed', undo: { seq, cur } } }, loadChord(s2[c2]))); };
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
const minorKey = kMinor, sevKey = q.t.some((x) => x[1] === 7);
const STEPS = minorKey ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
const KQ = minorKey ? (sevKey ? ['m7', 'ø7', 'maj7', 'm7', '7', 'maj7', '7'] : ['m', '°', '', 'm', '', '', '']) : (sevKey ? ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'ø7'] : ['', 'm', 'm', '', '', 'm', '°']);
const ROM = minorKey ? ['i', 'ii°', 'III', 'iv', 'V', 'VI', 'VII'] : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const NEXT = minorKey ? { 0: [3, 4, 5, 6], 1: [4, 0], 2: [5, 3], 3: [4, 0, 6], 4: [0, 5], 5: [3, 1, 4], 6: [2, 0] } : { 0: [3, 4, 5, 1], 1: [4, 6], 2: [5, 3], 3: [4, 0, 1], 4: [0, 5], 5: [3, 1, 4], 6: [0] };
const tpc = rootPc(KEY.l, KEY.a), curDeg = STEPS.indexOf(((rootPc(seq[cur].rl, seq[cur].ra) - tpc) % 12 + 12) % 12);
const order = (NEXT[curDeg] || NEXT[0]).concat([0, 1, 2, 3, 4, 5, 6]).filter((d, i, a) => a.indexOf(d) === i && d !== curDeg);
const KEYSP = minorKey ? ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'] : ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
// the key as the learner spelled it (C♯ major or D♭ major); one past seven sharps or flats takes its usual name (v106)
const keySp = LET[KEY.l] + ACC[String(KEY.a)];
const kl0 = LET.indexOf(keySp[0]);
const keyName = keySp + (minorKey ? ' minor' : ' major');
const nearest = (c) => { const prev = symOf(seq[seq.length - 1]).v.map((x) => x.m), qq = QS[c.q]; const vv = (VOICINGS.find((v) => v.v === c.voicing) || VOICINGS[0]).ok(qq) ? 'Close' : c.voicing;
  const nI = invCount(qq, vv); let best = 0, bd = 1e9;
  let bo = 0; [0, -1, 1].forEach((o) => { for (let i = 0; i < nI; i++) { RL = c.rl; const v = voice(rootPc(c.rl, c.ra), qq, i, vv, c.hand); const d = v.reduce((t, x) => t + Math.min(...prev.map((p) => Math.abs(p - (x.m + 12 * o)))), 0); if (d < bd) { bd = d; best = i; bo = o; } } });
  RL = rLet; c.oct = bo; c.rot = 0;
  // both hands: the left keeps the root; the right hand starts on whichever note moves least (R42 v104)
  if (c.hand === 'Both' && vv === 'Close') { let br = 0, bdd = 1e9; for (let r = 0; r < 4; r++) { RL = c.rl; const v = voice(rootPc(c.rl, c.ra), qq, 0, vv, 'Both', r).filter((x) => x.hand === 'R'); const pr = prev.filter((p) => p >= 57); const d = v.reduce((t, x) => t + Math.min(...(pr.length ? pr : prev).map((p) => Math.abs(p - x.m))), 0); if (d < bdd) { bdd = d; br = r; } }
    RL = rLet; c.oct = 0; c.rot = br; return 0; }
  return best; };
// transpose every chord on the staff at once, to a key or a half step; spelled as the new key spells (R42 v73)
const SERIFF = "'Iowan Old Style', 'Palatino', Georgia, serif";
// Transpose moves every chord (owner, v105: "the transpose is means to transpose the chords"). The first chord's new
// root is picked on the octave picker, so C♯ and D♭ are both there (v106); the others keep their letter distance.
// owner, v112: "we need to find a way to take the chords as well, like a select section in this drawer". As MuseScore's
// Transpose (To key, "Transpose chord symbols"): the chords chosen in the drawer move with the key, the others stay
// and are written against the new signature; with none chosen only the key changes
const trOff = (st.trOff || []).filter((i) => i < seq.length);
// a chord moved into a key is spelled from that key's scale (C♯m7 in D major is F♯m7, not G♭m7); a chord outside the
// scale takes the key's side (sharps in a sharp key) and the enharmonic root when its own spelling would need a double
// sharp or flat (A♭maj7 in G♯ minor, not G♯maj7 with F𝄪), except on the fifth degree (D♯7 in G♯ minor, as written)
const dbl = (l, a, q) => QS[q].t.some(([sx, d]) => { const L = (l + d - 1) % 7; return Math.abs(((NATPC[l] + a + sx - NATPC[L]) % 12 + 18) % 12 - 6) > 1; });
const fitRoot = (l, a, q) => { if (!dbl(l, a, q)) return [l, a]; const o = a > 0 ? [(l + 1) % 7, -1] : a < 0 ? [(l + 6) % 7, 1] : null;
  return o && rootPc(o[0], o[1]) === rootPc(l, a) && !SKIP.includes(LET[o[0]] + o[1]) && !dbl(o[0], o[1], q) ? o : [l, a]; };
const inKey = (pc, l2, a2, q, dir) => { const k = STEPS.indexOf((pc - rootPc(l2, a2) + 12) % 12);
  if (k >= 0) { const l = (l2 + k) % 7; const [L, A] = plainRoot(l, ((pc - NATPC[l] + 18) % 12) - 6); return k === 4 ? [L, A] : fitRoot(L, A, q); }
  const f = KFIF[l2] + 7 * a2 - (kMinor ? 3 : 0); return fitRoot(...spellPc(pc, f > 0 ? 1 : f < 0 ? -1 : dir || 1, (L, A) => !SKIP.includes(LET[L] + A)), q); };
const transposeTo = (l2, a2) => { const semi = ((rootPc(l2, a2) - tpc) % 12 + 12) % 12; if (!semi && l2 === KEY.l && a2 === KEY.a) return; const dir = semi && semi <= 6 ? 1 : -1;
  const s2 = seq.map((c, i) => { if (trOff.includes(i)) return c; const [l, a] = inKey((rootPc(c.rl, c.ra) + semi) % 12, l2, a2, c.q, dir); return Object.assign({}, c, { rl: l, ra: a }); });
  set(Object.assign({ seq: s2, key: { l: l2, a: a2, mi: kMinor }, toast: null }, loadChord(s2[cur]))); if (!trOff.includes(cur)) soundOf(s2[cur]); };
const stepTo = (dir) => { const [l, a] = spellPc((tpc + dir + 12) % 12, dir, keyOk(minorKey)); transposeTo(l, a); };
// adding keeps the sheet open, so a progression is built tap by tap; Done closes it (R42 v105)
const editAt = st.sheet === 'next' && st.editAt != null && st.editAt < seq.length ? st.editAt : null;
// from a chord's name the drawer changes that chord in place; from + it adds the next one (owner, v111)
const addNext = (c) => { const s2 = editAt != null ? seq.map((x, i) => (i === editAt ? c : x)) : seq.concat([c]); set(Object.assign({ seq: s2, cur: editAt != null ? editAt : s2.length - 1, toast: null }, loadChord(c))); soundOf(c); };
const nextMode = st.nextMode || 'key';
const CHN = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], IVN = ['', 'half step', 'whole step', 'minor 3rd', 'major 3rd', '4th', 'tritone', '5th', 'minor 6th', 'major 6th', 'minor 7th', 'major 7th'];
const usedCh = seq.map((c) => rootPc(c.rl, c.ra) + ':' + c.q);
const chromList = [1, -1, 2, -2, 3, -3].map((d) => { const pc = (root + d + 12) % 12, [l, a] = fitRoot(...spellPc(pc, d), qi), n = LET[l] + ACC[String(a)];
  const c = { rl: l, ra: a, q: qi, inv: 0, voicing: snap.voicing, hand: hands }; c.inv = nearest(c); const r = IVN[Math.abs(d)] + (d > 0 ? ' up' : ' down');
  return { id: pc + ':' + qi, s: n + q.k, r, bg: '#FEFDFB', ring: '0 0 0 1px ' + C.line, aria: (editAt != null ? 'Change to ' : 'Add ') + n + q.k + ', a ' + r, pick: () => addNext(c) }; }).filter((o) => !usedCh.includes(o.id));
const nextList = order.slice(0, 6).sort((a, b) => a - b).map((d, k) => { const pc = (tpc + STEPS[d]) % 12, [l, a] = plainRoot((kl0 + d) % 7, ((pc - NATPC[(kl0 + d) % 7] + 18) % 12) - 6), q2 = QS.findIndex((x) => x.k === KQ[d]);
  const c = { rl: l, ra: a, q: q2, inv: 0, voicing: snap.voicing, hand: hands }; c.inv = nearest(c);
  const r = sevKey ? ROM[d].replace('°', '') + ({ maj7: 'maj7', 'ø7': 'ø7', m7: '7', 7: '7' })[KQ[d]] : ROM[d];
  return { id: pc + ':' + q2, s: LET[l] + ACC[String(a)] + QS[q2].k, r, bg: '#FEFDFB', ring: '0 0 0 1px ' + C.line, aria: (editAt != null ? 'Change to ' : 'Add ') + LET[l] + ACC[String(a)] + QS[q2].k + ', ' + r, pick: () => addNext(c) }; }).filter((o) => !usedCh.includes(o.id));
const fing = [['Right hand', R, fR], ['Left hand', L, fL]].filter((h) => h[1].length).map(([h, list, f]) => ({ h, cells: list.map((x, i) => ({ n: x.name, f: f[i], c: ROLE[x.deg] || C.accent })) }));
const invCards = Array.from({ length: invN }, (_, i) => {
  const v = voice(root, q, i, voicing, 'Right'); const [a, b] = [Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12, Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12 + 23];
  const mk = {}; v.forEach((x) => { mk[x.m] = [ROLE[x.deg] || C.accent, '']; });
  return { t: INV[i], s: v.map((x) => x.name).join(' · '), kb: calmKeys(a, Math.max(b, Math.max(...v.map((x) => x.m))), mk, ''' + str(mini_w) + r''', 64), ring: i === inv ? '0 0 0 2px ' + C.ink : '0 0 0 1px ' + C.line, pick: () => { change({ inv: i }); } };
});
const tones = ns.filter((x) => x.hand !== 'L' || hands === 'Left').filter((x, i, a) => a.findIndex((y) => y.deg === x.deg) === i).map((x) => ({ n: x.name, d: DEGL[x.deg], c: ROLE[x.deg] || C.accent }));
const groups = ['Triads', 'Added notes', 'Sevenths', 'Extended', 'Altered'].map((g) => ({ g, rows: QS.map((x, i) => [x, i]).filter(([x]) => x.g === g).map(([x, i]) => ({ s: RN + x.k, n: RN + ' ' + x.n, on: i === qi, bg: i === qi ? '#F6E3BC' : 'transparent', fw: i === qi ? 700 : 500, pick: () => change({ q: i }),
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
  sym, full, shape, kb, sv, fing, invCards, tones, groups, vlist, handsBadge, hB, hR, hL, slash, hasSlash: !!slash, symFsP: Math.round(44 * symScale), symFsL: Math.round(64 * symScale), invLine: INV[inv] + (slash ? ', ' + bassName + ' in the bass' : '') + ' · ' + (voicing === 'Bass and chord' && upper && hands === 'Both' ? RN + ' | ' + upper : voicing + ' voicing') + (hands === 'Right' ? '' : (hands === 'Both' ? ' · both hands' : ' · left hand')),
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
  kbShow, kbOn: kbShow, kbOnBg: kbShow ? '#7FB685' : C.line, kbOnX: kbShow ? 22 : 2, toggleKb: () => set({ kbOn: !kbOnS }), kbDimOp: kbShow ? 1 : 0.4, kbPE: kbShow ? 'auto' : 'none', kbOffA: !kbShow,
  // Piano settings (R42, canvas 85): a switch turns the piano on or off (Apple HIG, toggles: a switch for a pair of
  // opposing states, in a list row); View is two radio cards, 3D holding its own Hands switch (the owner's radio-card rule)
  kbHandsOn: kbHands, kbHandsOnBg: kbHands ? '#7FB685' : C.line, kbHandsOnX: kbHands ? 22 : 2, toggleKbHands: () => set({ kbHands: !kbHands }),
  viewCards: [['3d', '3D piano'], ['2d', '2D keys']].map(([id, name]) => { const on = id === kbView; return { name, on, is3d: id === '3d', is2d: id === '2d', hasHands: id === '3d' && on, fw: on ? 700 : 500,
    bg: on ? '#FBF1DD' : '#FEFDFB', ring: on ? '0 0 0 2px #B07A2A' : '0 0 0 1px ' + C.line, dotBg: on ? '#B07A2A' : 'transparent', dotRing: on ? 'none' : 'inset 0 0 0 2px ' + C.line, mark: on ? '✓' : '', pick: () => set({ kbView: id }) }; }),
  bassOnBg: bassOn ? '#7FB685' : C.line, bassOnX: bassOn ? 22 : 2, toggleBass: () => change({ bass: !bassOn }), bassOn,
  fingOnBg: fingOn ? '#7FB685' : C.line, fingOnX: fingOn ? 22 : 2, toggleFing: () => set({ fing: !fingOn }), fingOn,
  fingKeysOn: fingKeys, fingKeysOnBg: fingKeys ? '#7FB685' : C.line, fingKeysOnX: fingKeys ? 22 : 2, toggleFingKeys: () => set({ fingKeys: !fingKeys }),
  handSeg: seg(['Right', 'Left', 'Both'], hands, (l) => change({ hand: l })),
  kbAngleSeg: seg(['Seat', 'Above'], kbAngle === 'above' ? 'Above' : 'Seat', (l) => set({ kbAngle: l === 'Above' ? 'above' : 'seat' })),
  pianoSw: ''' + PS.SW_JS('kbOnS', '() => set({ kbOn: !kbOnS })') + ''', kbHandsSw: ''' + PS.SW_JS('kbHands', '() => set({ kbHands: !kbHands })') + r''',
  kb3c: ''' + PS.CARD_JS("kbView !== '2d'", "() => set({ kbView: '3d' })") + ''', kb2c: ''' + PS.CARD_JS("kbView === '2d'", "() => set({ kbView: '2d' })") + r''', kb3d: kbView !== '2d',
  kbLabelSeg: seg(['Note names', 'Degrees', 'Intervals', 'None'], keyLabel, (l) => set({ keyLabel: l })),
  rootName: RN, qName: q.n[0].toUpperCase() + q.n.slice(1), qSym: RN + q.k, voicing, invLabel: INV[inv], handsLabel: hands === 'Both' ? 'Both hands' : hands + ' hand', soundWord: arp ? 'Arpeggio' : 'Block',
  // one row of letters; tapping the chosen letter again steps through its spellings: C, C♯, C (D, D♯, D♭ …)
  ...letterPick(rLet, rAcc, (l, a) => !SKIP.includes(LET[l] + a), st.tapUsed, (l, next, more) => { RL = l; change(Object.assign({ rl: l, ra: next, root: rootPc(l, next) }, more ? { tapUsed: true } : {})); }),
  playTiles: [['Block', 'Block chord'], ['Up', 'Arpeggio up'], ['Up and down', 'Arpeggio up and down']].map(([v, l]) => ({ l, on: v === playAs, bg: v === playAs ? '#FBF1DD' : '#FEFDFB', ring: v === playAs ? '0 0 0 2px #B07A2A' : '0 0 0 1px ' + C.line, pick: () => { set({ playAs: v }); sound(ms, v !== 'Block', v === 'Up and down' ? 'Up and down' : 'Up'); } })),
  qSymFs: (RN + q.k).length > 7 ? 12 : ((RN + q.k).length > 5 ? 13.5 : 15), blockOn: !arp, soundShort: arp ? 'Arpeggio' : 'Block',
  soundLabel: playAs === 'Block' ? 'Block chord' : (playAs === 'Up' ? 'Arpeggio up' : 'Up and down'),
    kbRangeSeg: seg(['Fit the chord', '2 octaves', '4 octaves'], fixedN ? (fixedN === 24 ? '2 octaves' : '4 octaves') : 'Fit the chord', (l) => set({ keys: l === 'Fit the chord' ? 'Chord' : (l === '2 octaves' ? '24' : '48'), rangeLo: l === 'Fit the chord' ? null : st.rangeLo })),
  rangeAt: (e) => { if (e.type === 'pointermove' && !e.buttons) return; if (e.type === 'pointerdown' && e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect(), n = fixedN || 24, nW = Math.round(n * 7 / 12), wi = Math.max(0, Math.min(52 - nW, Math.round((e.clientX - r.left) / r.width * 52 - nW / 2)));
    if (WH88[wi] !== lo || !fixedN) set({ keys: String(n), rangeLo: WH88[wi] }); },
  rangeKey: (e) => { const d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0; if (!d) return; e.preventDefault(); const n = fixedN || 24, i = WH88.indexOf(lo) >= 0 ? WH88.indexOf(lo) : WH88.findIndex((m) => m > lo);
    set({ keys: String(n), rangeLo: WH88[Math.max(0, Math.min(52 - Math.round(n * 7 / 12), i + d))] }); },
  // the range as a strip of all 88 keys, the part shown lit (Ultimate Piano's Settings; "Showing 36 keys (C3 – B5)")
  kbStrip: (() => { const W = 340, n = 52, w = W / n; let i = 0, x0 = null, x1 = 0, bl = ''; const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    for (let m = 21; m <= 108; m++) { if (NAT.includes(m % 12)) { if (m >= lo && m <= hi) { if (x0 === null) x0 = i * w; x1 = (i + 1) * w; } i++; } else bl += 'M' + (i * w - w * 0.3).toFixed(1) + ' 0h' + (w * 0.6).toFixed(1) + 'v15h-' + (w * 0.6).toFixed(1) + 'z'; }
    const nm = (m) => NN[m % 12] + (Math.floor(m / 12) - 1);
    return { bl, x: (x0 || 0).toFixed(1), w: (x1 - (x0 || 0)).toFixed(1), cap: nm(lo) + ' – ' + nm(hi) }; })(),
  kbTiles: [['hands', '3D with hands'], ['3d', '3D keys'], ['2d', '2D keys'], ['off', 'Off']].map(([id, name]) => { const on = id === kbMode; return { name, on, line: on ? '#B07A2A' : 'transparent', bg: on ? '#FBF1DD' : '#FEFDFB', isOff: id === 'off', is2d: id === '2d', is3d: id === '3d' || id === 'hands', isHands: id === 'hands', pick: () => set({ kbMode: id }) }; }),
  rhOn: hands !== 'Left', rhOnBg: hands !== 'Left' ? '#7FB685' : C.line, rhOnX: hands !== 'Left' ? 22 : 2,
  lhOn: hands !== 'Right', lhOnBg: hands !== 'Right' ? '#7FB685' : C.line, lhOnX: hands !== 'Right' ? 22 : 2,
  // the hands sit beside their staves: R.H. by the treble, L.H. by the bass; the last one on only plays
  // the hands drawn as they lie on the keys, each finger lit in the colour of the note it plays, its name on the
  // fingertip and its number below; tap a hand to add or drop it; Bass only leaves the root to the left hand (R42 v72)
  // The hands at the keys (R42 v77), as flowkey and the courses app show them (piano-data/reference-apps/flowkey/08,
  // courses-app/03): each hand lies under the keyboard and every playing finger reaches to its key, its number in a
  // circle on the fingertip in the note's colour; resting fingers stay curled at the palm.
  handsRef: (el) => { this._cv = el; },
  // ── the redesign's two concepts (R42 v80) share these ──
  // the name as three parts, each a pop-up button: root, chord type, the note in the bass
  nmType: q.k || 'major', nmTypeFs: q.k ? '1em' : '0.5em', nmTypeC: q.k ? C.ink : C.soft, nmBass: slash || 'root position', nmBassFs: slash ? '1em' : '16px', nmBassC: slash ? (ROLE[ns.length ? voice(root, q, inv, voicing, 'Right')[0].deg : 1] || C.ink) : C.soft,
  isMRoot: sh === 'mRoot', isMType: sh === 'mType', isMBass: sh === 'mBass', isVMenu: sh === 'vMenu',
  openMRoot: () => set({ sheet: sh === 'mRoot' ? null : 'mRoot' }), openMType: () => set({ sheet: sh === 'mType' ? null : 'mType' }), openMBass: () => set({ sheet: sh === 'mBass' ? null : 'mBass' }), openVMenu: () => set({ sheet: 'vMenu' }),
  // the chord's root as a chart is written: its letter, then ♭ ♮ ♯ (R42 v107); E♯, F♭, B♯ and C♭ are never roots
  rootPick: KEYPICK(rLet, rAcc, (l, a) => { RL = l; change({ rl: l, ra: a, root: rootPc(l, a), oct: 0 }); }, '', (l, a) => !SKIP.includes(LET[l] + a)),
  rootTiles: [[0, 0], [0, 1], [1, -1], [1, 0], [1, 1], [2, -1], [2, 0], [3, 0], [3, 1], [4, -1], [4, 0], [4, 1], [5, -1], [5, 0], [5, 1], [6, -1], [6, 0]].map(([l, a]) => { const on = l === rLet && a === rAcc;
    return { s: LET[l] + ACC[String(a)], on, bg: on ? '#F6E3BC' : '#FEFDFB', ring: on ? 'none' : '0 0 0 1px ' + C.line, fw: on ? 800 : 600, aria: 'Root ' + LET[l] + (a ? (a > 0 ? ' sharp' : ' flat') : ''), pick: () => { RL = l; change({ rl: l, ra: a, root: rootPc(l, a), oct: 0 }); } }; }),
  typeGroups: [['Triads', ['', 'm', '°', '+', 'sus2', 'sus4']], ['Sevenths', ['maj7', '7', 'm7', 'ø7', '°7']]].map(([g, ks]) => ({ g, rows: ks.map((k) => { const i = QS.findIndex((x) => x.k === k), on = i === qi; return { s: RN + k, n: QS[i].n[0].toUpperCase() + QS[i].n.slice(1), on, mark: on ? '✓' : '', fw: on ? 700 : 500, pick: () => change({ q: i, sheet: null }) }; }) })),
  typeTiles: QS.map((x, i) => ({ s: RN + x.k, n: x.n, on: i === qi, bg: i === qi ? '#F6E3BC' : '#FEFDFB', ring: i === qi ? 'none' : '0 0 0 1px ' + C.line, fw: i === qi ? 800 : 600, pick: () => change({ q: i }) })),
  bassItems: Array.from({ length: invN }, (_, i) => { const v = voice(root, q, i, voicing, 'Right'); RL = rLet; const on = i === inv; return { l: i ? INV[i] + ' · ' + v[0].name + ' in the bass' : 'Root position', on, mark: on ? '✓' : '', fw: on ? 700 : 500, pick: () => change({ inv: i }) }; }),
  invThumbs: Array.from({ length: invN }, (_, i) => { const v = voice(root, q, i, voicing, 'Right'); RL = rLet; const a = Math.floor(Math.min(...v.map((x) => x.m)) / 12) * 12; const mk = {}; v.forEach((x) => { mk[x.m] = [ROLE[x.deg] || C.accent, '']; }); const on = i === inv;
    return { s: sym + (i ? '/' + v[0].name : ''), kb: calmKeys(a, Math.max(a + 23, Math.max(...v.map((x) => x.m))), mk, 112, 44), ring: on ? '0 0 0 2px #B07A2A' : '0 0 0 1px ' + C.line, bg: on ? '#FBF1DD' : '#FEFDFB', fw: on ? 800 : 600, aria: i ? INV[i] : 'Root position', pick: () => change({ inv: i }) }; }),
  vGroups: (() => { const gs = []; VOICINGS.forEach((v) => { if (v.ok(q)) return; let g = gs.find((x) => x.h === v.g); if (!g) gs.push(g = { h: v.g, items: [] });
    const on = v.v === voicing, vn = voice(root, q, 0, v.v, TWO[v.v] ? 'Both' : hands).sort((a, b) => a.m - b.m); RL = rLet;
    const L = vn.filter((x) => x.hand === 'L').map(degOf).join(' '), R = vn.filter((x) => x.hand === 'R').map(degOf).join(' ');
    g.items.push({ l: v.l, f: L && R ? L + '  |  ' + R : (L || R), on, mark: on ? '✓' : '', fw: on ? 700 : 600, bg: on ? '#FBF1DD' : 'transparent', aria: v.l + ', ' + (L && R ? 'left hand ' + L + ', right hand ' + R : (L || R)),
      pick: () => change(Object.assign({ voicing: v.v, inv: 0, sheet: sh === 'voicing' ? 'chord' : (sh === 'vMenu' ? null : sh) }, TWO[v.v] ? { hand: 'Both' } : {})) }); }); return gs; })(),
  voicingName: VNAME[voicing],
  // the Voicing button's picture: the chord's notes as dots, each at its line or space, so a gap shows where it opens
  vDots: (() => { const dn = (x) => (Math.floor((x.m - x.d) / 12) - 1) * 7 + LET.indexOf(x.L); const a = ns.slice().sort((x, y) => x.m - y.m), lo = dn(a[0]), hi = dn(a[a.length - 1]), k = Math.min(2, 16 / Math.max(1, hi - lo));
    let px = null; return a.map((x) => { const d = dn(x), side = px !== null && d - px.d === 1 && !px.s; const o = { cx: side ? 15 : 10, cy: (19.5 - (d - lo) * k).toFixed(1), s: side, d }; px = o; return o; }); })(),
  voiceChips: VOICINGS.filter((v) => !v.ok(q)).map((v) => { const on = v.v === voicing; return { l: v.v, on, bg: on ? '#F6E3BC' : '#FEFDFB', ring: on ? 'none' : '0 0 0 1px ' + C.line, fw: on ? 700 : 500, mark: on ? '✓' : '', f: v.f, pick: () => change(Object.assign({ voicing: v.v, inv: 0, sheet: sh === 'vMenu' ? null : sh }, TWO[v.v] ? { hand: 'Both' } : {})) }; }),
  // fingering in words, each hand's notes and fingers low to high (pianochord.org: "Left hand: 5-3-1")
  facts: [{ k: 'Notes', v: ns.filter((x, i, a) => a.findIndex((y) => y.name === x.name) === i).sort((a, b) => ORD.indexOf(a.deg) - ORD.indexOf(b.deg)).map((x) => x.name).join('  ') }]
    .concat(Rn.length ? [{ k: 'Right hand', v: Rn.slice().sort((a, b) => a.m - b.m).map((x) => fm[x.m]).join('  ') }] : [])
    .concat(Ln.length ? [{ k: 'Left hand', v: Ln.slice().sort((a, b) => a.m - b.m).map((x) => fm[x.m]).join('  ') }] : []),
  handFacts: (Rn.length ? [{ k: 'Right hand', v: Rn.slice().sort((a, b) => a.m - b.m).map((x) => fm[x.m]).join(' ') }] : []).concat(Ln.length ? [{ k: 'Left hand', v: Ln.slice().sort((a, b) => a.m - b.m).map((x) => fm[x.m]).join(' ') }] : []),
  shelfOpen: st.shelf !== false, shelfShut: st.shelf === false, toggleShelf: () => set({ shelf: st.shelf === false }), shelfAria: st.shelf === false ? 'Open the chord shelf' : 'Close the chord shelf',
  symFull: sym + slash,
  handsList: [['Both', 'Both hands'], ['Right', 'Right hand'], ['Left', 'Left hand']].map(([v, l]) => ({ l, on: v === hands, mark: v === hands ? '✓' : '', isB: v === 'Both', isR: v === 'Right', isL: v === 'Left', pick: () => change({ hand: v, sheet: null }) })),
  openHandsMenu: () => set({ sheet: sh === 'hands' ? null : 'hands' }),
  handSeg3: seg(['Left hand', 'Both hands', 'Right hand'], hands === 'Split' || hands === 'Both' ? 'Both hands' : hands + ' hand', (l) => change({ hand: l === 'Both hands' ? (st.bassOnly && canSplit ? 'Split' : 'Both') : l.split(' ')[0] })),
  lhSeg: seg(['Chord', 'Root'], hands === 'Split' ? 'Root' : 'Chord', (l) => change({ hand: l === 'Root' ? 'Split' : 'Both', bassOnly: l === 'Root' })),
  lhChoice: (hands === 'Both' || hands === 'Split') && canSplit,
  lhPlays: hands === 'Split' ? RN + ' + ' + (upper || sym) : sym + slash + ' in each hand',
  h3d: (() => { const RN3 = { 1: 'root', 3: '3rd', 5: '5th', 7: '7th', 9: '9th', 2: '9th', 11: '11th', 4: '11th', 13: '13th', 6: '13th' };
    this._handsIn = !is3d ? null : { notes: kbMode === '3d' ? [] : ns.map((x) => ({ midi: x.m, spelled: {}, hand: x.hand === 'L' ? 'lh' : 'rh', finger: fm[x.m], startTick: 0, durationTicks: 1920, velocity: 80 })),
      perSecond: 960, now: () => 1, playing: false, held: new Set(ms), marks: new Map(ns.map((x) => [x.m, { tone: RN3[x.deg] || 'root' }])), wrong: undefined, faded: null, skin: 'light',
      range: keys === 'Chord' ? { low: Math.min(...ms), high: Math.max(...ms) } : { low: lo, high: hi } };
    // labels over the 3D keys: one over each sounding key's far end, where no hand covers it
    this._labels3d = is3d && keyLabel !== 'None' ? ns.filter((x, i, a) => a.findIndex((y) => y.m === x.m) === i).map((x) => ({ m: x.m, black: !NAT.includes(((x.m % 12) + 12) % 12), t: labOf(x), c: ROLE[x.deg] || C.accent })) : [];
    return is3d; })(),
  labelsRef: (el) => { this._lb = el; },
  is2dKb: kbMode === '2d',
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
  // ── Random chords (R42 v105): a session set up here and played in the Player, the next chord at random from a key or
  // from the types the learner picks, in the voicings and hands they pick. Structured practice (pianochord.org,
  // "Practice in piano playing", after Ericsson): a clear goal, feedback on every chord, the missed ones asked again.
  ...(() => {
    const kL = st.rpKL ?? 0, kA = st.rpKA ?? 0, rk = rootPc(kL, kA), mn = !!st.rpMinor, sv = st.rpSev ?? true, fromKey = st.rpFrom !== 'types';
    const ST = mn ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
    const KQ2 = mn ? (sv ? ['m7', 'ø7', 'maj7', 'm7', '7', 'maj7', '7'] : ['m', '°', '', 'm', '', '', '']) : (sv ? ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'ø7'] : ['', 'm', 'm', '', '', 'm', '°']);
    const RM = mn ? ['i', 'ii', 'III', 'iv', 'V', 'VI', 'VII'] : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
    const KQ2v = (d, sev) => (mn ? (sev ? ['m7', 'ø7', 'maj7', 'm7', '7', 'maj7', '7'] : ['m', '°', '', 'm', '', '', '']) : (sev ? ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'ø7'] : ['', 'm', 'm', '', '', 'm', '°']))[d];
    const kl = kL; const degs = st.rpDegs || [0, 1, 2, 3, 4, 5, 6];
    const keyChords = ST.map((semi, d) => { const pc = (rk + semi) % 12, l = (kl + d) % 7, a = ((pc - NATPC[l] + 18) % 12) - 6; return { rl: l, ra: a, q: QS.findIndex((x) => x.k === KQ2[d]), d }; });
    const types = st.rpTypes || [0, 1, 12, 13, 14], roots12 = st.rpRoots === 'white' ? [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]] : CROOTS.map((n) => [LET.indexOf(n[0]), n.length > 1 ? (n[1] === '♯' ? 1 : -1) : 0]);
    // v139 (owner: "make proper chords choosing… make me able to select all the chords and also filter them by type like
    // these scrollable chips on top of the drawer"): one list of every chord, each one chosen or not; chips filter it
    const MINQ = (q) => q.t.some((x) => x[0] === 3 && x[1] === 3);
    const RN12 = (q) => (MINQ(q) ? ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'] : ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']);
    const LA = (n) => [LET.indexOf(n[0]), n.length > 1 ? (n[1] === '♯' ? 1 : -1) : 0];
    const QI = (k) => QS.findIndex((x) => x.k === k);
    const sel = st.rpSel || [[0, 'maj7'], [2, 'm7'], [4, 'm7'], [5, 'maj7'], [7, '7'], [9, 'm7'], [11, 'ø7']].map(([pc, k]) => pc + ':' + QI(k));
    const has = (id) => sel.includes(id), flip = (ids, on) => set({ rpSel: on ? sel.filter((x) => !ids.includes(x)) : sel.concat(ids.filter((x) => !sel.includes(x))) });
    const symId = (id) => { const [pc, qi] = id.split(':').map(Number); return RN12(QS[qi])[pc] + QS[qi].k; };
    // v141 (owner: "I dont like this selected. look at the examples of the chords choosing"): as musictheory.net,
    // ToneDear and pianochord.org do, the chord types are a checklist and the roots are chosen apart, on a keyboard;
    // the drill draws every type on every root
    const ty = st.rpTy || [QI(''), QI('m')], rt = st.rpRt || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const pool = rt.flatMap((pc) => ty.map((qi) => { const [l, a] = LA(RN12(QS[qi])[pc]); return { rl: l, ra: a, q: qi }; }));
    const GR = ['Triads', 'Added notes', 'Sevenths', 'Extended', 'Altered'], tflt = st.rpTf || 'All';
    const capn = (q) => q.n[0].toUpperCase() + q.n.slice(1);
    const togSet = (arr, ids, allOn) => (allOn ? arr.filter((x) => !ids.includes(x)) : arr.concat(ids.filter((x) => !arr.includes(x))));
    const WH = [0, 2, 4, 5, 7, 9, 11], BL = [[1, 1], [3, 2], [6, 4], [8, 5], [10, 6]], PCN = ['C', 'C♯ D♭', 'D', 'D♯ E♭', 'E', 'F', 'F♯ G♭', 'G', 'G♯ A♭', 'A', 'A♯ B♭', 'B'], PC1 = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    const flt = st.rpFlt || 'all';
    const FL = [['all', 'All', () => true], ['chosen', 'Selected · ' + sel.length, () => true], ['maj', 'Major', (q) => q.k === ''], ['min', 'Minor', (q) => q.k === 'm'],
      ['dim', 'Diminished', (q) => ['°', 'ø7', '°7'].includes(q.k)], ['aug', 'Augmented', (q) => q.k === '+'], ['sus', 'Suspended', (q) => q.k.includes('sus')], ['add', 'Added notes', (q) => q.g === 'Added notes'],
      ['sev', 'Sevenths', (q) => q.g === 'Sevenths'], ['ext', 'Extended', (q) => q.g === 'Extended'], ['alt', 'Altered', (q) => q.g === 'Altered']];
    const fpred = (FL.find((f) => f[0] === flt) || FL[0])[2];
    const BOX = (st3) => ({ boxBg: st3 ? C.ink : '#FEFDFB', boxRing: st3 ? 'none' : 'inset 0 0 0 1.5px #A99E93', boxMark: st3 === 2 ? '✓' : st3 === 1 ? '–' : '' });
    const tile = (id, s, sub) => { const on = has(id); return Object.assign({ s, sub: sub || '', hasSub: !!sub, on, fw: on ? 700 : 500, aria: s, pick: () => flip([id], on) }, BOX(on ? 2 : 0)); };
    const sect = (title, ids, mk) => { const n = ids.filter(has).length, all = n === ids.length; return Object.assign({ title, count: n + ' of ' + ids.length, allOn: all, allPick: () => flip(ids, all), tiles: ids.map(mk) }, BOX(all ? 2 : n ? 1 : 0)); };
    const KQT = mn ? ['m', '°', '', 'm', '', '', ''] : ['', 'm', 'm', '', '', 'm', '°'], KQS = mn ? ['m7', 'ø7', 'maj7', 'm7', '7', 'maj7', '7'] : ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'ø7'];
    const keyName = LET[kL] + ACC[String(kA)] + (mn ? ' minor' : ' major');
    const keySect = (title, KQx) => { const items = ST.map((semi, d) => { const pc = (rk + semi) % 12, l = (kL + d) % 7, a = ((pc - NATPC[l] + 18) % 12) - 6; return { id: pc + ':' + QI(KQx[d]), s: LET[l] + ACC[String(a)] + KQx[d], r: RM[d] }; });
      return sect(title, items.map((x) => x.id), (id) => { const x = items.find((y) => y.id === id); return tile(id, x.s, x.r); }); };
    const rpSects = QS.map((q, qi) => [q, qi]).filter(([q]) => fpred(q)).map(([q, qi]) => { const ids = Array.from({ length: 12 }, (_, pc) => pc + ':' + qi).filter((id) => flt !== 'chosen' || has(id));
        return ids.length ? sect(q.n[0].toUpperCase() + q.n.slice(1), ids, (id) => tile(id, symId(id))) : null; }).filter(Boolean);
    const invs = st.rpInvs || [0];
    const INVR = [['Root position', 'C  E  G', 'C', 'the root at the bottom'], ['1st inversion', 'E  G  C', 'E', 'the 3rd at the bottom'], ['2nd inversion', 'G  C  E', 'G', 'the 5th at the bottom'], ['3rd inversion', 'B♭  C  E  G', 'B♭', 'the 7th at the bottom; chords with a 7th only']];
    const vs = st.rpVoic || ['Close'], inv = st.rpInv === 'all', hh = st.rpHands || 'Right';
    const tog = (arr, x) => (arr.includes(x) ? (arr.length > 1 ? arr.filter((y) => y !== x) : arr) : arr.concat([x]));
    const chip = (on) => ({ on, bg: on ? '#F6E3BC' : '#FEFDFB', ring: on ? 'none' : '0 0 0 1px ' + C.line, fw: on ? 700 : 500, mark: on ? '✓ ' : '' });
    const tryOne = () => { const c = pool[Math.floor(Math.random() * pool.length)]; if (!c) return; const qq = QS[c.q]; const ok = vs.filter((v) => !(VOICINGS.find((x) => x.v === v) || VOICINGS[0]).ok(qq)); const v = ok.length ? ok[Math.floor(Math.random() * ok.length)] : 'Close';
      const n = invCount(qq, v), iv = invs.filter((i) => i < n); change({ root: rootPc(c.rl, c.ra), rl: c.rl, ra: c.ra, q: c.q, voicing: v, hand: TWO[v] ? 'Both' : hh, inv: iv.length ? iv[Math.floor(Math.random() * iv.length)] : 0 }); };
    const goal = st.rpGoal || '16 chords';
    return {
      rpFromSeg: seg(['A key', 'Chord types'], fromKey ? 'A key' : 'Chord types', (l) => set({ rpFrom: l === 'A key' ? 'key' : 'types' })), rpIsKey: fromKey, rpIsTypes: !fromKey,
      rpKeyPick: KEYPICK(kL, kA, (l, a) => set({ rpKL: l, rpKA: a }), 'Key of ', keyOk(mn)),
      rpModeSeg: seg(['Major', 'Minor'], mn ? 'Minor' : 'Major', (l) => set({ rpMinor: l === 'Minor' })),
      rpSevSeg: seg(['Triads', 'Sevenths'], sv ? 'Sevenths' : 'Triads', (l) => set({ rpSev: l === 'Sevenths' })),
      rpKeyChords: keyChords.map((c) => { RL = c.rl; const o = Object.assign({ s: LET[c.rl] + ACC[String(c.ra)] + QS[c.q].k, r: RM[c.d], aria: 'Practise ' + LET[c.rl] + ACC[String(c.ra)] + QS[c.q].k + ', ' + RM[c.d], pick: () => set({ rpDegs: tog(degs, c.d) }) }, chip(degs.includes(c.d))); RL = rLet; return o; }),
      rpTypeGroups: ['Triads', 'Added notes', 'Sevenths', 'Extended', 'Altered'].map((g) => ({ g, items: QS.map((x, i) => [x, i]).filter(([x]) => x.g === g).map(([x, i]) => Object.assign({ s: 'C' + x.k, aria: x.n, pick: () => set({ rpTypes: tog(types, i) }) }, chip(types.includes(i)))) })),
      rpRootSeg: seg(['All 12 roots', 'White keys'], st.rpRoots === 'white' ? 'White keys' : 'All 12 roots', (l) => set({ rpRoots: l === 'White keys' ? 'white' : 'all' })),
      rpVoicChips: VOICINGS.map((v) => Object.assign({ s: v.l, aria: v.l + ', ' + v.g, pick: () => set({ rpVoic: tog(vs, v.v) }) }, chip(vs.includes(v.v)))),
      rpInvSeg: seg(['Root position', 'All inversions'], inv ? 'All inversions' : 'Root position', (l) => set({ rpInv: l === 'All inversions' ? 'all' : 'root' })),
      rpHandSeg: seg(['Right hand', 'Left hand', 'Both hands'], hh === 'Both' ? 'Both hands' : hh + ' hand', (l) => set({ rpHands: l.split(' ')[0] })),
      rpGoalSeg: seg(['16 chords', '5 minutes', 'No end'], goal, (l) => set({ rpGoal: l })),
      rpBackOn: st.rpBack !== false, rpBackOnBg: st.rpBack !== false ? '#7FB685' : C.line, rpBackOnX: st.rpBack !== false ? 22 : 2, toggleRpBack: () => set({ rpBack: st.rpBack === false }),
      rpPool: pool.length + (pool.length === 1 ? ' chord' : ' chords') + ' to draw from', rpTry: tryOne,
      rpStart: 'Start · ' + (goal === 'No end' ? 'until I stop' : goal),
      rpNow: sym + slash, rpNowSub: VNAME[voicing] + ' · ' + (hands === 'Both' ? 'both hands' : hands.toLowerCase() + ' hand'),
      // the page in the Chords page's shape (R42, canvas 137): three pickers, the draw as a lead sheet, sessions as rows
      rpFromName: fromKey ? LET[kL] + ACC[String(kA)] + (mn ? ' minor' : ' major') : (st.rpRoots === 'white' ? 'White keys' : 'All 12 roots'),
      rpSetName: fromKey ? (sv ? 'Sevenths' : 'Triads') : (types.length === 1 ? QS[types[0]].n.replace(/^\w/, (c) => c.toUpperCase()) : types.length + ' chord types'),
      rpLine: pool.length + (pool.length === 1 ? ' chord' : ' chords') + ' in the draw · ' + (vs.length === 1 ? (VOICINGS.find((x) => x.v === vs[0]) || VOICINGS[0]).l : vs.length + ' voicings') + ' · ' + (hh === 'Both' ? 'both hands' : hh.toLowerCase() + ' hand'),
      rpCount: pool.length + (pool.length === 1 ? ' chord' : ' chords'),
      rpBars: fromKey
        ? keyChords.map((c) => { const on = degs.includes(c.d), s0 = LET[c.rl] + ACC[String(c.ra)] + QS[c.q].k; return { s: s0, r: RM[c.d], on, op: on ? 1 : 0.42, bg: on ? '#FEFDFB' : 'transparent', ring: on ? '0 0 0 1px ' + C.line : 'inset 0 0 0 1.5px ' + C.line, deco: on ? 'none' : 'line-through', aria: (on ? 'Leave out ' : 'Put back ') + s0, pick: () => set({ rpDegs: tog(degs, c.d) }) }; })
        : types.map((i) => ({ s: 'C' + QS[i].k, r: QS[i].n, on: true, op: 1, bg: '#FEFDFB', ring: '0 0 0 1px ' + C.line, deco: 'none', aria: 'Leave out ' + QS[i].n, pick: () => set({ rpTypes: tog(types, i) }) })),
      rpMin: fromKey ? '76px' : '116px',
      rpBarsNote: fromKey ? 'Tap a chord to leave it out of the draw.' : 'On every root. Tap a type to leave it out; add types from the second picker.',
      rpSessions: [['16 chords', '16 chords', 'scored at the end'], ['5 minutes', 'For 5 minutes', 'as many as you play right'], ['No end', 'Until I stop', 'no count and no clock']].map(([g, a, b]) => ({ a, b, on: goal === g, mark: goal === g ? '✓' : '', pick: () => set({ rpGoal: g }) })),
      openRpFrom: () => set({ sheet: 'rpFrom' }), openRpSet: () => set({ sheet: 'rpSet' }), openRpInv: () => set({ sheet: 'rpInv' }), openRpVoic: () => set({ sheet: 'rpVoic' }), openRpHands: () => set({ sheet: 'rpHands' }),
      isRpFrom: st.sheet === 'rpFrom', isRpSet: st.sheet === 'rpSet', isRpInv: st.sheet === 'rpInv', isRpVoic: st.sheet === 'rpVoic', isRpHands: st.sheet === 'rpHands',
      rpSetRows: [['Triads', false], ['Sevenths', true]].map(([l, v]) => ({ l, sub: keyChords.map((c) => LET[c.rl] + ACC[String(c.ra)] + (v ? KQ2v(c.d, true) : KQ2v(c.d, false))).join('  '), mark: sv === v ? '✓' : '', fw: sv === v ? 700 : 500, pick: () => set({ rpSev: v }) })),
      rpTypeRows: ['Triads', 'Added notes', 'Sevenths', 'Extended', 'Altered'].map((g) => ({ g, items: QS.map((x, i) => [x, i]).filter(([x]) => x.g === g).map(([x, i]) => ({ s: 'C' + x.k, n: x.n, mark: types.includes(i) ? '✓' : '', fw: types.includes(i) ? 700 : 500, pick: () => set({ rpTypes: tog(types, i) }) })) })).filter((g) => g.items.length),
      rpInvRows: [['Root position', 'root'], ['All inversions', 'all']].map(([l, v]) => ({ l, sub: v === 'all' ? 'root, 1st, 2nd and, with a 7th, 3rd, at random' : 'the root in the bass', mark: (inv ? 'all' : 'root') === v ? '✓' : '', fw: (inv ? 'all' : 'root') === v ? 700 : 500, pick: () => set({ rpInv: v }) })),
      rpHandRows: [['Right hand', 'Right'], ['Left hand', 'Left'], ['Both hands', 'Both']].map(([l, v]) => ({ l, sub: v === 'Both' ? 'the root and 5th below, the chord above' : '', mark: hh === v ? '✓' : '', fw: hh === v ? 700 : 500, pick: () => set({ rpHands: v }) })),
      rpVoicGroups: [...new Set(VOICINGS.map((v) => v.g))].map((g) => ({ g, items: VOICINGS.filter((v) => v.g === g).map((v) => { const why = pool.length && pool.every((c) => v.ok(QS[c.q])) ? v.ok(QS[pool[0].q]) : ''; const VD = { 'Close': 'the notes as close together as they go', 'Drop 2': 'the 2nd note from the top an octave lower', 'Drop 3': 'the 3rd note from the top an octave lower', 'Shell': 'root, 3rd and 7th only', 'Rootless A': 'no root; the 3rd at the bottom', 'Rootless B': 'no root; the 7th at the bottom', 'Spread': 'over both hands, wide', 'So What': 'stacked 4ths, a 3rd on top', 'Kenny Barron': 'two stacked 5ths, both hands', 'Upper structure': 'a triad over the 3rd and 7th', 'Bass and chord': 'the root below, the chord above', 'Two triads': 'one triad in each hand' };
        return { l: v.l, why: why || VD[v.v] || '', hasWhy: true, op: why ? 0.55 : 1, mark: vs.includes(v.v) ? '✓' : '', fw: vs.includes(v.v) ? 700 : 500, pick: () => set({ rpVoic: tog(vs, v.v) }) }; }) })),
      rpHandsLong: hh === 'Both' ? 'Both hands' : hh + ' hand', rpGoalName: goal === 'No end' ? 'Until I stop' : (goal === '5 minutes' ? 'For 5 minutes' : '16 chords'),
      rpStartT: 'Start · ' + (goal === 'No end' ? 'until I stop' : goal),
      isRpGoal: st.sheet === 'rpGoal', openRpGoal: () => set({ sheet: 'rpGoal' }),
      rpGoalRows: [['16 chords', '16 chords', 'a set of 16, scored at the end'], ['5 minutes', 'For 5 minutes', 'as many as you play right'], ['No end', 'Until I stop', 'no count and no clock']].map(([g, l, sub]) => ({ l, sub, mark: goal === g ? '✓' : '', fw: goal === g ? 700 : 500, pick: () => set({ rpGoal: g }) })),
      rpTyChips: ['All'].concat(GR).map((v) => ({ l: v, on: v === tflt, bg: v === tflt ? C.ink : '#FEFDFB', fg: v === tflt ? '#FEFDFB' : C.ink, ring: v === tflt ? 'none' : '0 0 0 1px ' + C.line, pick: () => set({ rpTf: v }) })),
      rpTyGroups: GR.filter((g) => tflt === 'All' || tflt === g).map((g) => { const ids = QS.map((q, i) => [q, i]).filter(([q]) => q.g === g).map(([, i]) => i), n = ids.filter((i) => ty.includes(i)).length, all = n === ids.length;
        return Object.assign({ g, count: n + ' of ' + ids.length, allOn: all, allPick: () => set({ rpTy: togSet(ty, ids, all) }),
          items: ids.map((i) => { const on = ty.includes(i); return Object.assign({ s: 'C' + QS[i].k, n: capn(QS[i]), on, fw: on ? 700 : 500, pick: () => set({ rpTy: on ? ty.filter((x) => x !== i) : ty.concat([i]) }) }, BOX(on ? 2 : 0)); }) }, BOX(all ? 2 : n ? 1 : 0)); }),
      rpTyCount: ty.length + (ty.length === 1 ? ' type' : ' types') + ' · ' + pool.length + (pool.length === 1 ? ' chord' : ' chords') + ' in all', rpTyClear: () => set({ rpTy: [] }), rpTyCan: ty.length > 0,
      rpTyVal: ty.length ? ty.slice(0, 2).map((i) => capn(QS[i]).replace(/ triad$/, '')).join(', ') + (ty.length > 2 ? ' +' + (ty.length - 2) : '') : 'None',
      rpWhite: WH.map((pc, i) => { const on = rt.includes(pc); return { l: PCN[pc], on, bg: on ? '#F6E3BC' : '#FEFDFB', fg: on ? '#7A5418' : C.soft, fw: on ? 700 : 500, left: (i * 100 / 7) + '%', aria: PCN[pc], pick: () => set({ rpRt: on ? rt.filter((x) => x !== pc) : rt.concat([pc]) }) }; }),
      rpBlack: BL.map(([pc, at]) => { const on = rt.includes(pc); return { l: PCN[pc].replace(' ', '\n'), on, bg: on ? '#C99A45' : C.ink, fg: on ? C.ink : '#FEFDFB', left: 'calc(' + (at * 100 / 7) + '% - 6%)', aria: PCN[pc], pick: () => set({ rpRt: on ? rt.filter((x) => x !== pc) : rt.concat([pc]) }) }; }),
      rpRtQuick: [['All 12', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]], ['White keys', WH], ['Black keys', [1, 3, 6, 8, 10]]].map(([l, v]) => { const on = v.length === rt.length && v.every((x) => rt.includes(x)); return { l, on, bg: on ? C.ink : '#FEFDFB', fg: on ? '#FEFDFB' : C.ink, ring: on ? 'none' : '0 0 0 1px ' + C.line, pick: () => set({ rpRt: v }) }; }),
      rpRtCount: rt.length + (rt.length === 1 ? ' root' : ' roots'),
      rpRtVal: rt.length === 12 ? 'All 12' : rt.length === 7 && WH.every((x) => rt.includes(x)) ? 'White keys' : rt.length ? rt.slice().sort((a, b) => a - b).map((x) => PC1[x]).join(' ') : 'None',
      isRpRoots: st.sheet === 'rpRoots', openRpRoots: () => set({ sheet: 'rpRoots' }),
      rpChips: FL.map(([v, l]) => ({ l, on: v === flt, bg: v === flt ? C.ink : '#FEFDFB', fg: v === flt ? '#FEFDFB' : C.ink, ring: v === flt ? 'none' : '0 0 0 1px ' + C.line, pick: () => set({ rpFlt: v }) })),
      rpSects, rpNoSects: !rpSects.length, rpHasSects: !!rpSects.length, 
      rpChosenT: sel.length + ' selected', rpClearAll: () => set({ rpSel: [] }), rpCanClear: sel.length > 0,
      rpSetVal: sel.length ? sel.slice(0, 3).map(symId).join(', ') + (sel.length > 3 ? ' +' + (sel.length - 3) : '') : 'None yet',
      rpInvRows2: INVR.map(([l, stack, low, sub], i) => { const on = invs.includes(i); return { l, pre: stack.slice(low.length), low, sub, mark: on ? '✓' : '', fw: on ? 700 : 500, pick: () => set({ rpInvs: on ? (invs.length > 1 ? invs.filter((x) => x !== i) : invs) : invs.concat([i]).sort() }) }; }),
      rpInvName: invs.length === 1 ? INVR[invs[0]][0] : invs.length === 4 ? 'Any inversion' : invs.map((i) => ['Root', '1st', '2nd', '3rd'][i]).join(', '),
      rpEx: sym + slash, rpExSub: '',
      rpVoicName: vs.length === 1 ? (VOICINGS.find((x) => x.v === vs[0]) || VOICINGS[0]).l : vs.length + ' voicings',
      rpHandsName: hh === 'Both' ? 'Both' : hh };
  })(),
  nextModeSeg: seg(['Diatonic', 'Chromatic'], nextMode === 'key' ? 'Diatonic' : 'Chromatic', (l) => set({ nextMode: l === 'Diatonic' ? 'key' : 'chrom' })), isNextKey: nextMode === 'key', isNextChrom: nextMode !== 'key', chromList, chromNone: !chromList.length, chromHas: !!chromList.length, keyNone: !nextList.length, keyHas: !!nextList.length, toChrom: () => set({ nextMode: 'chrom' }), toKey: () => set({ nextMode: 'key' }), chromCap: 'From ' + sym,
  firstSym: symOf(seq[0]).s, sigName: keyName, openSig: () => set({ sheet: 'tr' }),
  keyModeSeg: seg(['Major', 'Minor'], minorKey ? 'Minor' : 'Major', (l) => { const mi = l === 'Minor'; if (mi === minorKey) return; const [kl, ka] = keyOk(mi)(KEY.l, KEY.a) ? [KEY.l, KEY.a] : spellPc(tpc, -KEY.a, keyOk(mi)); set({ key: { l: kl, a: ka, mi } }); }),
  trChords: seq.map((c, i) => { const on = !trOff.includes(i), s = symOf(c).s; return { s, on, kept: !on, tc: on ? C.ink : C.soft, bg: on ? '#FEFDFB' : 'transparent', ring: on ? '0 0 0 1px ' + C.line : 'inset 0 0 0 1.5px ' + C.line, aria: 'Transpose ' + s, tip: on ? 'Keep ' + s + ' as it is' : 'Transpose ' + s, pick: () => set({ trOff: on ? trOff.concat([i]) : trOff.filter((x) => x !== i) }) }; }),
  keyMini: Array.from({ length: Math.abs(sigF) }, (_, k) => ({ x: 52 + k * 11, y: (sigF > 0 ? [30, 45, 25, 40, 55, 35, 50] : [50, 35, 55, 40, 60, 45, 65])[k] + 5, sharp: sigF > 0, flat: sigF < 0 })),
  trAllLab: trOff.length ? 'Transpose all' : 'Keep all', trAll: () => set({ trOff: trOff.length ? [] : seq.map((_, i) => i) }),
  addChord, undoRemove, playAll, nextList, tKey: KEYSP[tpc] + (minorKey ? ' minor' : ' major'), openTr: () => set({ sheet: 'tr' }), isTr: sh === 'tr', trDown: () => stepTo(-1), trUp: () => stepTo(1), trPick: KEYPICK(KEY.l, KEY.a, (l, a) => transposeTo(l, a), 'Key of ', keyOk(minorKey)),
  keyName, openNext: () => set({ sheet: 'next', editAt: null }), nextTitle: editAt != null ? 'Change ' + sym : 'Next chord', isEdit: editAt != null, canRmEdit: editAt != null && seq.length > 1, rmEdit: () => removeChord(), rmEditLab: 'Remove ' + sym, isNext: sh === 'next', hasSeq: seq.length > 1, canAdd: seq.length < 8, seqCount: seq.length, toastOn: !!st.toast, toastT: st.toast ? st.toast.t : '', toastUndo: !!(st.toast && st.toast.undo), toastPad: st.toast && st.toast.undo ? '0' : '12px',
  ...(() => { const demo = st.demo || '';
    const eight = () => [0, 3, 4, 5, 1, 4, 0, 3].map((d) => { const pc = (tpc + STEPS[d]) % 12, [l, a] = plainRoot((kl0 + d) % 7, ((pc - NATPC[(kl0 + d) % 7] + 18) % 12) - 6); return { rl: l, ra: a, q: QS.findIndex((x) => x.k === KQ[d]), inv: 0, voicing: snap.voicing, hand: hands, oct: 0 }; });
    const go = (v) => { if (v === 'eight') { const e = eight(); set(Object.assign({ demo: v, statesOpen: false, seq: e, cur: 7, sheet: null, toast: null }, loadChord(e[7]))); return; }
      if (v === 'midiLost') { set({ demo: v, statesOpen: false, sheet: null, toast: { t: 'Roland FP-30X is not connected.' } }); return; }
      set({ demo: v, statesOpen: false, toast: null, kbOn: true, kbView: v.startsWith('hands') ? '3d' : kbView, sheet: v.startsWith('midi') || v === 'offline' ? 'keys' : null }); };
    const MSG = { handsLoading: 'Getting the hands ready…', handsFailed: 'The hands didn’t load.', handsUnsupported: 'This device can’t draw the hands.' };
    const MIDI = { midiNone: 'No MIDI keyboard found.', midiOn: 'Connected: Roland FP-30X', midiUnsupported: 'This browser can’t connect a MIDI keyboard.', midiLost: 'Roland FP-30X is not connected.' };
    return { statesOpen: !!st.statesOpen, toggleStates: () => set({ statesOpen: !st.statesOpen }),
      stateList: [['', 'As designed'], ['handsLoading', 'Hands: loading'], ['handsFailed', 'Hands: did not load'], ['handsUnsupported', 'Hands: this device cannot draw them'], ['midiNone', 'MIDI keyboard: none found'], ['midiOn', 'MIDI keyboard: connected'], ['midiUnsupported', 'MIDI keyboard: this browser has none'], ['midiLost', 'MIDI keyboard: unplugged while playing'], ['large', 'Text: larger (130%)'], ['offline', 'Offline: the lighter piano'], ['eight', 'Staff: eight chords, the most']].map(([v, l]) => ({ l, mark: v === demo ? '✓' : '', fw: v === demo ? 700 : 500, pick: () => go(v) })),
      stageMsgOn: !!MSG[demo] && is3d, stageMsg: MSG[demo] || '', stageRetry: demo === 'handsFailed', stageKeys: demo === 'handsFailed' || demo === 'handsUnsupported',
      retryHands: () => set({ demo: 'handsLoading' }), showKeys: () => set({ demo: '', kbView: '2d' }),
      midiSub: MIDI[demo] || '', midiSubOn: !!MIDI[demo] && demo !== 'midiOn', midiSubVal: demo === 'midiOn' ? 'Roland FP-30X' : 'None', midiSubValC: demo === 'midiOn' ? C.ink : C.soft,
      soundSubVal: demo === 'offline' ? 'Lighter piano' : 'Grand piano', soundSubValC: demo === 'offline' ? C.ink : C.soft, soundSub: demo === 'offline' ? 'Offline: a lighter sampled piano plays' : '', soundSubOn: demo === 'offline',
      textZoom: demo === 'large' ? 1.3 : 1, barZoom: demo === 'large' ? 1.1 : 1,
      atMost: seq.length >= 8, mostWord: seq.length + ' of 8 chords', sayMost: () => set({ toast: { t: 'The staff holds 8 chords. Remove one to add another.' } }) }; })(),
  playMain: () => st.playing ? stopAll() : (scope === 'All' ? playSeq() : play(playMode !== 'Block', playMode === 'UpDown' ? 'Up and down' : 'Up')),
  scopeList: [['All', 'All ' + seq.length + ' chords, in order'], ['One', 'Only ' + sym + slash]].map(([v, l]) => ({ l, on: v === scope, mark: v === scope ? '✓' : '', pick: () => { set({ scope: v, sheet: null }); if (v === 'All') playSeq(); else play(playMode !== 'Block', playMode === 'UpDown' ? 'Up and down' : 'Up'); } })), openPlayAs: () => set({ sheet: st.sheet === 'playAs' ? null : 'playAs' }), isPlayAs: sh === 'playAs',
  playAsList: [['Block', 'Block chord'], ['Arpeggio', 'Arpeggio'], ['UpDown', 'Arpeggio up and down']].map(([v, l]) => ({ l, on: v === playMode, mark: v === playMode ? '✓' : '', pick: () => { set({ playMode: v, sheet: null }); if (scope !== 'All') play(v !== 'Block', v === 'UpDown' ? 'Up and down' : 'Up'); } })),
  invStep: INV[inv] + (slash ? ' · ' + bassName + ' in the bass' : ''), fullName: full, fullLine: full + (inv ? ' · ' + INV[inv] : '') + ' · ' + (voicing === 'Bass and chord' && upper && hands === 'Both' ? RN + ' | ' + upper : voicing + ' voicing') + (hands === 'Right' ? '' : (hands === 'Both' ? ' · both hands' : ' · left hand')),
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

def STAGE3D(h):
    vars3 = PS.STAGE_VARS
    return (f'<sc-if value="{{{{h3d}}}}" hint-placeholder-val="{{{{true}}}}"><figure aria-label="The hands at the keys, playing this chord" style="position: relative; flex: none; margin: 0; width: 100%; height: {h}px; overflow: hidden; background: #EDE6DC; {vars3}"><canvas ref="{{{{handsRef}}}}" style="display: block; width: 100%; height: 100%"></canvas><div ref="{{{{labelsRef}}}}" aria-hidden="true" style="position: absolute; inset: 0; pointer-events: none"></div>'
            f'<sc-if value="{{{{stageMsgOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; inset: 0; background: #EDE6DC; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 16px; text-align: center"><p style="margin: 0; font-size: 16px; color: {INK}">{{{{stageMsg}}}}</p><div style="display: flex; gap: 12px"><sc-if value="{{{{stageRetry}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{retryHands}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600">Try again</button></sc-if><sc-if value="{{{{stageKeys}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{showKeys}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600">Show the keys</button></sc-if></div></div></sc-if></figure></sc-if>'
            f'<sc-if value="{{{{is2dKb}}}}" hint-placeholder-val="{{{{false}}}}">{KEYBAND(168)}</sc-if>')

def HANDSROW(w):
    return (f'<div style="flex: none; width: 100%; box-sizing: border-box; padding: 10px 16px 0; display: flex; flex-direction: column; align-items: center; gap: 8px"><div style="width: 100%; max-width: {w}px" aria-label="Hands">{SEGC("handSeg3", 38, 14)}</div>'
            f'<sc-if value="{{{{lhChoice}}}}" hint-placeholder-val="{{{{false}}}}"><div style="width: 100%; max-width: {w}px; display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="min-width: 0; font-size: 14px; color: {SOFT}">Left hand plays the</span><div style="width: 150px">{SEGC("lhSeg", 32, 13)}</div></div></sc-if></div>')

def KEYHANDS(h):
    D = lambda n: f'<sc-if value="{{{{t.f{n}}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{t.x}}}}" y="{{{{t.ty}}}}" text-anchor="middle" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="13" font-weight="800" fill="{INK}">{n}</text></sc-if>'
    return (f'<div style="position: relative; flex: none; width: 100%">{KEYBAND(h)}<div aria-hidden="true" style="height: {{{{kh.hs}}}}px"></div>'
      f'<svg viewBox="{{{{kh.vb}}}}" role="img" aria-label="The hands on the keys" style="position: absolute; left: 0; top: 0; width: 100%; height: {{{{kh.h}}}}px; pointer-events: none; overflow: hidden">'
      f'<sc-for list="{{{{kh.palms}}}}" as="p" hint-placeholder-count="1"><rect x="{{{{p.wx}}}}" y="{{{{p.wy}}}}" width="{{{{p.ww}}}}" height="{{{{p.wh}}}}" fill="#F6ECDF" stroke="{INK}" stroke-width="1.5"></rect></sc-for>'
      f'<path d="{{{{kh.edge}}}}" fill="none" stroke="{INK}" stroke-width="{{{{kh.ew}}}}" stroke-linecap="round"></path>'
      f'<sc-for list="{{{{kh.palms}}}}" as="p" hint-placeholder-count="1"><ellipse cx="{{{{p.cx}}}}" cy="{{{{p.cy}}}}" rx="{{{{p.rx}}}}" ry="{{{{p.ry}}}}" fill="#F6ECDF" stroke="{INK}" stroke-width="1.5"></ellipse></sc-for>'
      f'<path d="{{{{kh.skin}}}}" fill="none" stroke="#F6ECDF" stroke-width="{{{{kh.fw}}}}" stroke-linecap="round"></path>'
      f'<sc-for list="{{{{kh.palms}}}}" as="p" hint-placeholder-count="1"><sc-if value="{{{{p.isL}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{p.lx}}}}" y="{{{{p.ly}}}}" text-anchor="middle" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="12" font-weight="700" fill="{SOFT}">L.H.</text></sc-if><sc-if value="{{{{p.isR}}}}" hint-placeholder-val="{{{{true}}}}"><text x="{{{{p.lx}}}}" y="{{{{p.ly}}}}" text-anchor="middle" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="12" font-weight="700" fill="{SOFT}">R.H.</text></sc-if></sc-for>'
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
    return f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{{{{practiseT}}}}</h3><div style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">{r}</div></section>'

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
    return f'''<div class="nos" data-staff style="position: relative; z-index: 0; isolation: isolate; overflow-x: auto; overflow-y: hidden; margin: 0 -12px; padding: 4px 12px"><div style="position: relative; flex: none; width: {{{{sv.w}}}}; padding-top: 40px">
<div style="position: absolute; inset: 0"><sc-for list="{{{{sv.cols}}}}" as="k" hint-placeholder-count="2"><div style="position: absolute; top: 0; bottom: 0; left: {{{{k.l0}}}}; width: {{{{k.w}}}}"><button type="button" class="cname" aria-label="Change {{{{k.s}}}}" data-tip="Change chord" onClick="{{{{k.edit}}}}" style="position: absolute; left: 0; right: 0; top: 0; height: 44px; margin: 0; padding: 0; border: 0; border-radius: 10px; background: transparent; color: {{{{k.tc}}}}; font-family: {SERIF}; font-size: 17px; font-weight: {{{{k.fw}}}}; display: flex; justify-content: center; align-items: center; white-space: nowrap; cursor: pointer"><span>{{{{k.s}}}}</span></button><button type="button" aria-pressed="{{{{k.on}}}}" aria-label="{{{{k.aria}}}}" onClick="{{{{k.pick}}}}" style="position: absolute; left: 0; right: 0; top: 40px; bottom: 0; margin: 0; padding: 0; border: 0; border-radius: 10px; background: transparent; cursor: pointer"></button></div></sc-for></div><svg viewBox="{{{{sv.vb}}}}" style="position: relative; display: block; width: 100%; height: auto; overflow: visible; pointer-events: none" role="img" aria-label="The chords on the staff">
<sc-for list="{{{{sv.hl}}}}" as="h" hint-placeholder-count="0"><rect x="{{{{h.x}}}}" y="{{{{h.y}}}}" width="{{{{h.w}}}}" height="{{{{h.h}}}}" rx="10" fill="{{{{h.f}}}}" opacity="{{{{h.o}}}}"></rect></sc-for>
<path d="{{{{sv.path}}}}" stroke="{INK}" stroke-width="0.9"></path>
<path d="{{{{sv.bars}}}}" stroke="{INK}" stroke-width="1"></path>
<sc-if value="{{{{sv.hasT}}}}" hint-placeholder-val="{{{{true}}}}"><text x="18" y="69" font-family="Noto Music" font-size="42" fill="{INK}">𝄞</text></sc-if><sc-if value="{{{{sv.hasB}}}}" hint-placeholder-val="{{{{false}}}}"><text x="18" y="141" font-family="Noto Music" font-size="34" fill="{INK}">𝄢</text></sc-if>
<sc-for list="{{{{sv.sig}}}}" as="g" hint-placeholder-count="0"><sc-if value="{{{{g.sharp}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{g.x}}}}" y="{{{{g.y}}}}" font-family="Noto Music" font-size="22" fill="{INK}">♯</text></sc-if><sc-if value="{{{{g.flat}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{g.x}}}}" y="{{{{g.y}}}}" font-family="Noto Music" font-size="22" fill="{INK}">♭</text></sc-if></sc-for>
<path d="{{{{sv.moved}}}}" fill="none" stroke="{SOFT}" stroke-width="1" stroke-dasharray="2 2.5" stroke-linecap="round"></path><path d="{{{{sv.held}}}}" fill="none" stroke="{INK}" stroke-width="1.3" stroke-linecap="round"></path>
<sc-for list="{{{{sv.ledg}}}}" as="l" hint-placeholder-count="1"><path d="M{{{{l.x1}}}} {{{{l.y}}}}H{{{{l.x2}}}}" stroke="{INK}" stroke-width="1.1"></path></sc-for>
<sc-for list="{{{{sv.notes}}}}" as="n" hint-placeholder-count="4"><ellipse cx="{{{{n.x}}}}" cy="{{{{n.y}}}}" rx="7.2" ry="5" transform="rotate(-18 {{{{n.x}}}} {{{{n.y}}}})" fill="{{{{n.c}}}}" stroke="{{{{n.st}}}}" stroke-width="{{{{n.sw}}}}"></ellipse><sc-if value="{{{{n.a1}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{{{{n.ac}}}}">♭</text></sc-if><sc-if value="{{{{n.a2}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{{{{n.ac}}}}">♯</text></sc-if><sc-if value="{{{{n.a3}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{{{{n.ac}}}}">𝄫</text></sc-if><sc-if value="{{{{n.a4}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{{{{n.ac}}}}">𝄪</text></sc-if><sc-if value="{{{{n.a5}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="22" fill="{{{{n.ac}}}}">♮</text></sc-if></sc-for>
<sc-for list="{{{{sv.digits}}}}" as="d" hint-placeholder-count="4"><sc-if value="{{{{d.f1}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">1</text></sc-if><sc-if value="{{{{d.f2}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">2</text></sc-if><sc-if value="{{{{d.f3}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">3</text></sc-if><sc-if value="{{{{d.f4}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">4</text></sc-if><sc-if value="{{{{d.f5}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{d.x}}}}" y="{{{{d.y}}}}" font-family="Text Accidentals, Instrument Sans, system-ui, sans-serif" font-size="11" font-weight="700" font-style="italic" fill="{INK}" text-anchor="start">5</text></sc-if></sc-for>
</svg><button type="button" aria-label="Key: {{{{sigName}}}}" data-tip="Key: {{{{sigName}}}}" onClick="{{{{openSig}}}}" style="position: absolute; left: 0; top: 40px; bottom: 0; width: {{{{sv.clefW}}}}; margin: 0; padding: 0; border: 0; border-radius: 10px; background: transparent; cursor: pointer"></button><div aria-hidden="true" style="position: absolute; left: 0; right: 0; top: 40px; bottom: 0; pointer-events: none"><sc-for list="{{{{sv.labs}}}}" as="l" hint-placeholder-count="0"><span style="position: absolute; left: {{{{l.left}}}}; top: {{{{l.top}}}}; transform: {{{{l.tf}}}}; font-size: 13px; line-height: 1; font-weight: 700; color: {{{{l.c}}}}; white-space: nowrap">{{{{l.t}}}}</span></sc-for></div>
<div style="position: absolute; left: 0; right: 0; top: 40px; bottom: 0; pointer-events: none"><sc-if value="{{{{sv.canAdd}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" aria-label="Add a chord" data-tip="Add a chord" onClick="{{{{openNext}}}}" style="position: absolute; left: {{{{sv.addL}}}}; top: {{{{sv.addT}}}}; width: 44px; height: 44px; transform: translate(-50%, -50%); margin: 0; padding: 0; border: 0; background: transparent; pointer-events: auto; display: flex; align-items: center; justify-content: center; color: #7A5418"><span style="width: 36px; height: 36px; box-sizing: border-box; border-radius: 18px; border: 1.5px dashed rgba(122,84,24,.55); background: #FEFDFB; display: flex; align-items: center; justify-content: center">{PLUSI}</span></button></sc-if><sc-for list="{{{{sv.taps}}}}" as="t" hint-placeholder-count="0"><button type="button" aria-label="{{{{t.aria}}}}" onClick="{{{{t.play}}}}" style="position: absolute; left: {{{{t.left}}}}; top: {{{{t.top}}}}; width: 44px; height: 44px; transform: translate(-50%, -50%); margin: 0; padding: 0; border: 0; border-radius: 7px; background: transparent; pointer-events: auto; cursor: pointer"></button></sc-for></div></div></div>'''

def VIEWBODY(staff_w, inv_cols, mini_w, side=False):
    inner = (f'<div style="display: flex; align-items: center; gap: 24px"><div style="flex: 1; min-width: 0">{STAFFHEAD}{STAFFSVG(staff_w)}</div></div>' if side else f'{STAFFHEAD}{STAFFSVG(staff_w)}')
    return f'''<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: relative; flex: none; border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 16px 12px; display: flex; flex-direction: column; gap: 12px">{inner}</div></sc-if>
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
STAFFHEAD = ''  # R42 v103: Transpose is the key over the clef, Add a chord the empty place on the staff
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
KBROUND = f'<button type="button" aria-label="Piano" data-tip="Piano" onClick="{{{{openKeys}}}}" style="flex: none; width: 56px; border: 0; {GLASSGRP}; color: {INK}; display: flex; align-items: center; justify-content: center">{KEYSI}</button>'
CHORDACT = f'<button type="button" aria-label="Chord: {{{{qSym}}}}" onClick="{{{{openChord}}}}" style="pointer-events: auto; justify-self: end; flex: none; min-width: 56px; max-width: 100%; padding: 0 10px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; font-size: {{{{qSymFs}}}}px; font-weight: 700; display: flex; align-items: center; gap: 4px; white-space: nowrap"><span style="min-width: 0; overflow: hidden; text-overflow: ellipsis">{{{{qSym}}}}</span></button>'
PLAYSPLIT = (f'<div role="group" aria-label="Play" style="pointer-events: auto; flex: none; width: 176px; {TINTGRP}; display: flex; align-items: center">'
  f'<button type="button" onClick="{{{{playMain}}}}" aria-pressed="{{{{playing}}}}" style="flex: 1; min-width: 0; height: 56px; padding: 0 2px 0 14px; border: 0; border-radius: 28px 0 0 28px; background: transparent; color: {INK}; font: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap"><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if><span style="overflow: hidden; text-overflow: ellipsis">{{{{playWord}}}}</span></button>'
  f'<span aria-hidden="true" style="flex: none; width: 1px; height: 26px; background: rgba(51,41,33,.2)"></span>'
  f'<button type="button" aria-label="Play as: block chord or arpeggio" aria-haspopup="menu" onClick="{{{{openPlayAs}}}}" style="flex: none; width: 44px; height: 56px; padding: 0; border: 0; border-radius: 0 28px 28px 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_D}</button></div>')
def PLAYASMENU(pos):
    return (f'<sc-if value="{{{{isPlayAs}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
      f'<div role="menu" aria-label="Play as" style="position: absolute; {pos}; z-index: 61; width: 248px; white-space: nowrap; box-sizing: border-box; padding: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column">'
      f'<sc-for list="{{{{playAsList}}}}" as="o" hint-placeholder-count="3"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 48px; border: 0; border-radius: 12px; background: transparent; padding: 6px 12px; display: flex; align-items: center; gap: 10px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 18px; font-size: 16px; font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span><span style="flex: 1; font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for>'
      f'<sc-if value="{{{{hasSeq}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="height: 1px; margin: 4px 8px; background: {LINE}"></span><sc-for list="{{{{scopeList}}}}" as="o" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 48px; border: 0; border-radius: 12px; background: transparent; padding: 6px 12px; display: flex; align-items: center; gap: 10px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 18px; font-size: 16px; font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span><span style="flex: 1; font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for></sc-if></div></sc-if>')
# the chord and Play are one group, centred together (R42 v72: "why this is looking so not centered")
HANDSBTN = f'<button type="button" aria-label="Hands: {{{{handsLabel}}}}" aria-haspopup="menu" onClick="{{{{openHandsMenu}}}}" style="pointer-events: auto; justify-self: start; flex: none; width: 56px; padding: 0; border: 0; {GLASSGRP}; color: {INK}; display: flex; align-items: center; justify-content: center">{HANDSI}</button>'
def HANDSMENU(pos):
    ic = '<sc-if value="{{o.isB}}" hint-placeholder-val="{{false}}">' + HANDS2 + '</sc-if><sc-if value="{{o.isR}}" hint-placeholder-val="{{false}}">' + HANDI + '</sc-if><sc-if value="{{o.isL}}" hint-placeholder-val="{{false}}">' + HANDL + '</sc-if>'
    return (f'<sc-if value="{{{{isHands}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
      f'<div role="menu" aria-label="Hands" style="position: absolute; {pos}; z-index: 61; width: 216px; box-sizing: border-box; padding: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column">'
      f'<sc-for list="{{{{handsList}}}}" as="o" hint-placeholder-count="3"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 48px; border: 0; border-radius: 12px; background: transparent; padding: 6px 12px; display: flex; align-items: center; gap: 10px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 36px; display: flex; justify-content: center">' + ic + f'</span><span style="flex: 1; font-size: 16px; font-weight: 600; white-space: nowrap">{{{{o.l}}}}</span><span style="flex: none; width: 18px; font-size: 16px; font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span></button></sc-for></div></sc-if>')
# the chord, Play and the hands: Play at the centre, one button each side (R42 v79)
DOCK_PHONE = f'<div role="toolbar" aria-label="Chord, sound and hands" style="position: absolute; left: 12px; right: 12px; bottom: 30px; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{CHORDACT}{PLAYSPLIT}{HANDSBTN}</div>'
DOCK_LAPTOP = f'<div role="toolbar" aria-label="Chord, sound and hands" style="position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 40; width: 560px; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 10px; pointer-events: none">{CHORDACT}{PLAYSPLIT}{HANDSBTN}</div>'

# ── the sheets' bodies, the same on both sizes ──
def BACKHEAD(title, act):
    return f'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 40px"><button type="button" aria-label="Back" onClick="{{{{{act}}}}}" style="position: absolute; left: -8px; width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L}</button><span style="font-size: 17px; font-weight: 600">{title}</span></div>'

B_CHORD = (CAPS('Root') + NOTEPICK + GROUP(('link', 'Chord', '{{qName}}', 'openList'), ('link', 'Voicing', '{{voicingLabel}}', 'openVoicing'), bg="#FEFDFB"))
B_LIST = (BACKHEAD('Chord', 'backChord') + f'<sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="4"><div style="display: flex; flex-direction: column; gap: 6px"><h3 style="margin: 6px 0 0 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{{{{g.g}}}}</h3><div style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{g.rows}}}}" as="r" hint-placeholder-count="5"><div style="display: flex; align-items: stretch; box-shadow: inset 0 -1px 0 {LINE}; background: {{{{r.bg}}}}"><button type="button" aria-pressed="{{{{r.on}}}}" onClick="{{{{r.pick}}}}" style="flex: 1; min-width: 0; min-height: 48px; border: 0; background: transparent; padding: 0 0 0 14px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left"><span style="flex: none; width: 96px; font-size: 16px; font-weight: {{{{r.fw}}}}; white-space: nowrap">{{{{r.s}}}}</span><span style="flex: 1; min-width: 0; font-size: 15px; color: {SOFT}">{{{{r.n}}}}</span></button><button type="button" role="checkbox" aria-checked="{{{{r.inSeq}}}}" aria-label="{{{{r.chkAria}}}}" onClick="{{{{r.toggle}}}}" style="flex: none; width: 52px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; justify-content: center"><span style="width: 24px; height: 24px; border-radius: 12px; background: {{{{r.chkBg}}}}; box-shadow: {{{{r.chkRing}}}}; color: #FEFDFB; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center">{{{{r.chk}}}}</span></button></div></sc-for></div></div></sc-for>')
VLIST = f'''<div style="display: flex; flex-direction: column; gap: 16px"><sc-for list="{{{{vGroups}}}}" as="g" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 8px"><h4 style="margin: 0 0 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{{{{g.h}}}}</h4><div role="radiogroup" aria-label="{{{{g.h}}}}" style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{g.items}}}}" as="v" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{v.on}}}}" aria-label="{{{{v.aria}}}}" onClick="{{{{v.pick}}}}" style="width: 100%; min-height: 56px; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: {{{{v.bg}}}}; padding: 8px 14px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: {{{{v.fw}}}}">{{{{v.l}}}}</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums; white-space: pre">{{{{v.f}}}}</span></span><span style="font-size: 18px; font-weight: 700; color: #7A5418">{{{{v.mark}}}}</span></button></sc-for></div></section></sc-for></div>'''
B_VOICING = BACKHEAD('Voicing', 'backChord') + VLIST
def _segbtn(flex): return ('<button type="button" role="radio" aria-checked="{{o.on}}" onClick="{{o.pick}}" style="' + flex + ' min-width: 0; height: 44px; padding: 0 10px; border: 0; border-radius: 9px; background: {{o.bg}}; box-shadow: {{o.sh}}; color: ' + INK + '; font: inherit; font-size: 14px; font-weight: {{o.fw}}; white-space: nowrap">{{o.l}}</button>')
def SEGGRID(lst): return '<div role="radiogroup" style="display: grid; grid-auto-flow: column; grid-auto-columns: minmax(max-content, 1fr); gap: 2px; padding: 2px; border-radius: 11px; background: ' + FILL + '"><sc-for list="{{' + lst + '}}" as="o" hint-placeholder-count="4">' + _segbtn('') + '</sc-for></div>'
B_NEXT = (SEGGRID('nextModeSeg') + '<div style="display: flex; flex-direction: column"><sc-if value="{{isNextKey}}" hint-placeholder-val="{{true}}"><div style="display: flex; flex-direction: column; gap: 12px">' + '<p style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: ' + SOFT + '">In {{keyName}}</p>' + '<sc-if value="{{keyNone}}" hint-placeholder-val="{{false}}"><div style="height: 232px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center"><p style="margin: 0; font-size: 15px; color: ' + SOFT + '"><span>Every chord of {{keyName}} is on the staff</span></p><button type="button" onClick="{{toChrom}}" style="height: 44px; padding: 0 18px; border: 0; border-radius: 22px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 15px; font-weight: 600">Chromatic chords</button></div></sc-if>' + '<sc-if value="{{keyHas}}" hint-placeholder-val="{{true}}"><div role="group" aria-label="Next chord" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 72px; align-content: start; gap: 8px; min-height: 232px"><sc-for list="{{nextList}}" as="o" hint-placeholder-count="6"><button type="button" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="height: 72px; border: 0; border-radius: 14px; background: {{o.bg}}; box-shadow: {{o.ring}}; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: ' + INK + '; font: inherit"><span style="font-family: ' + SERIF + '; font-size: 22px; font-weight: 700; white-space: nowrap">{{o.s}}</span><span style="font-size: 14px; color: ' + SOFT + '">{{o.r}}</span></button></sc-for></div></sc-if>' + '</div></sc-if>'
          + '<sc-if value="{{isNextChrom}}" hint-placeholder-val="{{false}}"><div style="display: flex; flex-direction: column; gap: 12px">' + '<p style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: ' + SOFT + '">{{chromCap}}</p>' + '<sc-if value="{{chromNone}}" hint-placeholder-val="{{false}}"><div style="height: 232px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center"><p style="margin: 0; font-size: 15px; color: ' + SOFT + '"><span>Each of these is on the staff already</span></p><button type="button" onClick="{{toKey}}" style="height: 44px; padding: 0 18px; border: 0; border-radius: 22px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 15px; font-weight: 600">Diatonic chords</button></div></sc-if>' + '<sc-if value="{{chromHas}}" hint-placeholder-val="{{true}}"><div role="group" aria-label="Next chord" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 72px; align-content: start; gap: 8px; min-height: 232px"><sc-for list="{{chromList}}" as="o" hint-placeholder-count="6"><button type="button" aria-label="{{o.aria}}" onClick="{{o.pick}}" style="height: 72px; border: 0; border-radius: 14px; background: {{o.bg}}; box-shadow: {{o.ring}}; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: ' + INK + '; font: inherit"><span style="font-family: ' + SERIF + '; font-size: 20px; font-weight: 700; white-space: nowrap">{{o.s}}</span><span style="font-size: 14px; color: ' + SOFT + '">{{o.r}}</span></button></sc-for></div></sc-if>' + '</div></sc-if>'
          + '</div>' + GROUP(('link', 'All chords', '', 'addChord'), bg="#FEFDFB") + '<sc-if value="{{canRmEdit}}" hint-placeholder-val="{{false}}"><button type="button" onClick="{{rmEdit}}" style="height: 48px; border: 0; border-radius: 14px; background: #FEFDFB; box-shadow: 0 0 0 1px ' + LINE + '; padding: 0 16px; display: flex; align-items: center; gap: 10px; color: #B3261E; font: inherit; font-size: 16px; font-weight: 600"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"></path></svg>{{rmEditLab}}</button></sc-if>')
def KEYPICK_HTML(v, label, beside=''):
    # one picker for a root and a key (R42 v111): the letters, then ♭ ♮ ♯
    return (f'<div style="display: flex; flex-direction: column; gap: 12px"><div role="radiogroup" aria-label="{label}" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{{v}.lets}}}}" as="o" hint-placeholder-count="7">'
            f'<button type="button" role="radio" aria-checked="{{{{o.on}}}}" aria-disabled="{{{{o.dis}}}}" aria-label="{{{{o.aria}}}}" onClick="{{{{o.pick}}}}" style="height: 56px; min-width: 0; padding: 0; border: 0; border-radius: 12px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; opacity: {{{{o.op}}}}; color: {INK}; font-family: {SERIF}; font-size: 22px; font-weight: {{{{o.fw}}}}">{{{{o.s}}}}</button></sc-for></div>'
            + (f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">' if beside else '') + f'<div role="radiogroup" aria-label="Accidental" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; padding: 2px; border-radius: 12px; background: {FILL}"><sc-for list="{{{{{v}.accs}}}}" as="o" hint-placeholder-count="3">'
            f'<button type="button" role="radio" aria-checked="{{{{o.on}}}}" aria-disabled="{{{{o.dis}}}}" aria-label="{{{{o.aria}}}}" onClick="{{{{o.pick}}}}" style="height: 44px; min-width: 0; padding: 0; border: 0; border-radius: 10px; background: {{{{o.bg}}}}; box-shadow: {{{{o.sh}}}}; opacity: {{{{o.op}}}}; color: {INK}; font-family: {SERIF}; font-size: 26px; line-height: 1">{{{{o.l}}}}</button></sc-for></div>' + (beside + '</div>' if beside else '') + '</div>')

B_TR = ('<div style="display: flex; align-items: center; gap: 12px"><button type="button" aria-label="Down a half step" data-tip="Down a half step" onClick="{{trDown}}" style="flex: none; width: 52px; height: 52px; padding: 0; border: 0; border-radius: 26px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 26px; font-weight: 500; line-height: 1">−</button><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px"><div role="img" aria-label="{{keyName}}" style="display: flex; align-items: center; gap: 10px"><svg viewBox="0 12 136 72" aria-hidden="true" style="display: block; height: 52px; width: auto; overflow: visible"><path d="M2 30H134M2 40H134M2 50H134M2 60H134M2 70H134" stroke="' + INK + '" stroke-width="1"></path><text x="6" y="69" font-family="Noto Music" font-size="42" fill="' + INK + '">𝄞</text><sc-for list="{{keyMini}}" as="g" hint-placeholder-count="0"><sc-if value="{{g.sharp}}" hint-placeholder-val="{{false}}"><text x="{{g.x}}" y="{{g.y}}" font-family="Noto Music" font-size="22" fill="' + INK + '">♯</text></sc-if><sc-if value="{{g.flat}}" hint-placeholder-val="{{false}}"><text x="{{g.x}}" y="{{g.y}}" font-family="Noto Music" font-size="22" fill="' + INK + '">♭</text></sc-if></sc-for></svg><span style="font-family: ' + SERIF + '; font-size: 24px; font-weight: 700; line-height: 1.1; white-space: nowrap">{{keyName}}</span></div></div><button type="button" aria-label="Up a half step" data-tip="Up a half step" onClick="{{trUp}}" style="flex: none; width: 52px; height: 52px; padding: 0; border: 0; border-radius: 26px; background: ' + FILL + '; color: ' + INK + '; font: inherit; font-size: 26px; font-weight: 500; line-height: 1">+</button></div>'
  + KEYPICK_HTML('trPick', 'Key', SEGGRID('keyModeSeg'))
  + '<section aria-label="Chords to transpose" style="display: flex; flex-direction: column; gap: 8px"><div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 32px"><h4 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: ' + SOFT + '">Transpose with the key</h4><button type="button" onClick="{{trAll}}" style="height: 44px; margin: -6px 0; padding: 0 4px; border: 0; background: transparent; color: #356890; font: inherit; font-size: 15px; font-weight: 600; white-space: nowrap">{{trAllLab}}</button></div>'
  + '<div role="group" aria-label="Transpose with the key" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{trChords}}" as="o" hint-placeholder-count="2"><button type="button" role="checkbox" aria-checked="{{o.on}}" aria-label="{{o.aria}}" data-tip="{{o.tip}}" onClick="{{o.pick}}" style="height: 56px; min-width: 0; padding: 0 6px; border: 0; border-radius: 12px; background: {{o.bg}}; box-shadow: {{o.ring}}; color: {{o.tc}}; font: inherit; white-space: nowrap; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px"><span style="font-family: ' + SERIF + '; font-size: 17px; font-weight: 700">{{o.s}}</span><sc-if value="{{o.kept}}" hint-placeholder-val="{{false}}"><span style="font-size: 12px; font-weight: 600; color: ' + SOFT + '">Stays</span></sc-if></button></sc-for></div></section>'
  )
B_HANDS = GROUP(('toggle', 'Right hand', 'rhOn', 'toggleRH'), ('toggle', 'Left hand', 'lhOn', 'toggleLH'), bg="#FEFDFB")
KBTILES = ('<div role="group" aria-label="Keyboard" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px"><sc-for list="{{kbTiles}}" as="o" hint-placeholder-count="2"><button type="button" aria-pressed="{{o.on}}" onClick="{{o.pick}}" style="height: 84px; padding: 0; border-radius: 14px; border: 2px solid {{o.line}}; background: {{o.bg}}; box-shadow: 0 0 0 1px ' + LINE + ' ; color: ' + INK + '; font: inherit; font-size: 12.5px; font-weight: 600; line-height: 1.15; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px">'
    '<svg width="48" height="28" viewBox="0 0 48 28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">'
    '<sc-if value="{{o.is2d}}" hint-placeholder-val="{{false}}"><g><rect x="2" y="4" width="44" height="20" rx="2"></rect><path d="M8.3 4v20M14.6 4v20M20.9 4v20M27.1 4v20M33.4 4v20M39.7 4v20"></path><path d="M6.5 4h3.6v11H6.5zM12.8 4h3.6v11h-3.6zM25.3 4h3.6v11h-3.6zM31.6 4h3.6v11h-3.6zM37.9 4h3.6v11h-3.6z" fill="currentColor"></path></g></sc-if>'
    '<sc-if value="{{o.is3d}}" hint-placeholder-val="{{false}}"><g><path d="M9 6h30l7 18H2z"></path><path d="M14.5 6 11 24M20 6l-2 18M26 6v18M31.500 6l3 18M37 6l5 18"></path><path d="M12.6 6h3l-1.200 9h-3.400zM18.300 6h3l-.700 9h-3.300zM27.600 6h3l1 9h-3.300zM33.300 6h3l1.900 9h-3.400z" fill="currentColor"></path></g></sc-if>'
    '<sc-if value="{{o.isHands}}" hint-placeholder-val="{{false}}"><path d="M17 27c-2.500-3-3.500-6-3-9.500l1.200-5.500c.400-1.600 2.600-1.300 2.500.400l-.200 4.600 1.500-8c.400-1.700 2.700-1.400 2.600.400l-.400 7.600 2-8.400c.500-1.700 2.800-1.300 2.700.500l-1 8.400 2.700-6.400c.700-1.600 2.900-.800 2.400 1l-2.600 8.900 3.300-2.700c1.400-1.100 3 .700 1.800 2l-6 6.700z" fill="#F6ECDF" stroke="currentColor" stroke-width="1.400"></path></sc-if>'
    '<sc-if value="{{o.isOff}}" hint-placeholder-val="{{false}}"><g opacity="0.55"><rect x="2" y="4" width="44" height="20" rx="2"></rect><path d="M14.6 4v20M27.1 4v20M39.7 4v20"></path><path d="M4 26 44 2" stroke-width="2"></path></g></sc-if>'
    '</svg>{{o.name}}</button></sc-for></div>')
B_KEYS = (KBTILES + '<sc-if value="{{is2dKb}}" hint-placeholder-val="{{false}}">' + GROUP(('seg', 'Keys', 'keysSeg', 230), ('seg', 'Labels', 'kbLabelSeg', 230), bg="#FEFDFB") + '</sc-if>'
          + GROUP(('link', 'Connect a piano', '', '#'), ('link', 'All piano settings', '', '#'), bg="#FEFDFB"))
B_SOUND = f'<div role="radiogroup" style="display: flex; flex-direction: column; gap: 8px"><sc-for list="{{{{playTiles}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 60px; border: 0; border-radius: 14px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; padding: 8px 16px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; color: {INK}; font: inherit; text-align: left"><span style="font-size: 16px; font-weight: 600">{{{{o.l}}}}</span></button></sc-for></div>'
TOAST = f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 16px; right: 16px; margin: 0 auto; width: fit-content; bottom: 100px; z-index: 50; min-height: 48px; padding: 4px 6px 4px 18px; border-radius: 24px; background: {INK}; color: #FEFDFB; display: flex; align-items: center; gap: 8px; max-width: calc(100% - 32px); box-sizing: border-box; box-shadow: {SHADOW}"><span style="font-size: 15px; white-space: normal; line-height: 1.25; padding-right: {{{{toastPad}}}}">{{{{toastT}}}}</span><sc-if value="{{{{toastUndo}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{undoRemove}}}}" style="height: 40px; padding: 0 14px; border: 0; border-radius: 20px; background: transparent; color: #F2C987; font: inherit; font-size: 15px; font-weight: 700">Undo</button></sc-if></div></sc-if>'
def SHEETS_PHONE(player):
    out = ''
    out += TOAST + PLAYASMENU('left: 50%; transform: translateX(-50%); bottom: 96px') + HANDSMENU('right: 12px; bottom: 96px')
    for cond, title, body in (('isChord', 'Chord', B_CHORD), ('isKeys', 'Piano', B_KEYS), ('isNext', 'Next chord', B_NEXT), ('isTr', 'Transpose', B_TR)):
        out += BSHEET(cond, title, body)
    for cond, body in (('isList', B_LIST), ('isVoicing', B_VOICING)):
        out += f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.28)"></div><section role="dialog" class="nos" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 12px"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>{body}</section></sc-if>'
    return out

def POPS_LAPTOP(player):
    dockpos = 'left: calc(50% - 200px); top: 424px'
    out = TOAST + PLAYASMENU('left: 50%; transform: translateX(-50%); bottom: 92px') + HANDSMENU('left: calc(50% + 60px); bottom: 92px')
    for cond, title, body, pos in (('isChord', 'Chord', B_CHORD, dockpos), ('isKeys', 'Piano', B_KEYS, 'right: 24px; top: 76px'), ('isNext', 'Next chord', B_NEXT, 'left: calc(50% + 420px); top: 330px'), ('isTr', 'Transpose', B_TR, 'left: calc(50% - 420px); top: 330px')):
        out += POPOVER(cond, title, body, pos, 400)
    for cond, body, pos in (('isList', B_LIST, dockpos), ('isVoicing', B_VOICING, dockpos)):
        out += f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" class="nos" style="position: absolute; {pos}; z-index: 61; width: 400px; max-height: 700px; overflow-y: auto; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 12px 16px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">{body}</div></sc-if>'
    return out

# The app's own 3D hands (src/widgets/piano-hands, createStage), bundled by pthands_vite.config.mjs, run live in the
# board: the same rig, poses and keyboard the Player draws (R42 v78)
PT_BUNDLE = open('/home/user/piano-trainer/.scratch/r39/canvas/pthands.bundle.js').read()
assert '</script' not in PT_BUNDLE
import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as PS
PT_LIFE = r'''
  componentDidMount() { this._hands3d();
    this._key = (e) => { const d = document.querySelector('[role=dialog], [role=menu]'); if (!d) return;
      if (e.key === 'Escape') { e.preventDefault(); this.setState({ sheet: null, statesOpen: false }); return; }
      if (e.key !== 'Tab') return; const f = [...d.querySelectorAll('button, a[href], [tabindex="0"]')].filter((x) => x.offsetParent); if (!f.length) return;
      const at = f.indexOf(document.activeElement); if (e.shiftKey ? at <= 0 : at === f.length - 1 || at < 0) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); } };
    document.addEventListener('keydown', this._key); }
  componentDidUpdate() { this._hands3d();
    { const d = document.querySelector('[role=dialog], [role=menu]');
      if (d && d !== this._dlg) { if (!this._dlg) this._ret = document.activeElement; d.setAttribute('aria-modal', 'true'); d.style.overscrollBehavior = 'contain'; const f = d.querySelector('[aria-checked="true"], button'); if (f) f.focus({ preventScroll: true }); }
      if (!d && this._dlg && this._ret && this._ret.isConnected) this._ret.focus({ preventScroll: true }); this._dlg = d; }
    // a long staff scrolls sideways: the chord being shown is always brought into view
    const sf = document.querySelector('[data-staff]'), n = (this.state.seq || []).length, pl = this.state.playing === 'all' ? this.state.sounding : null;
    const shut = this._sh && !this.state.sheet, moved = (this.state.cur ?? 0) !== this._cur;
    if (sf && (n !== this._n || shut || moved || (pl != null && pl !== this._pl))) { const on = pl != null ? sf.querySelectorAll('[aria-pressed]')[pl] : sf.querySelector('[aria-pressed="true"]'), last = on && on === [...sf.querySelectorAll('[aria-pressed]')].pop();
      if (on) { const r = on.getBoundingClientRect(), b = sf.getBoundingClientRect(), add = sf.querySelector('[aria-label="Add a chord"]'), ra = add && last ? add.getBoundingClientRect() : r;
        if (ra.right > b.right - 8) sf.scrollLeft += ra.right - b.right + 16; else if (r.left < b.left + 8) sf.scrollLeft -= b.left + 8 - r.left; } }
    this._n = n; this._pl = pl; this._sh = this.state.sheet; this._cur = this.state.cur ?? 0; }
  componentWillUnmount() { document.removeEventListener('keydown', this._key); if (this._ro) this._ro.disconnect(); if (this._stage) this._stage.dispose(); this._stage = null; }
''' + PS.HANDS3D + r''''''
def ch_js(D, W, KH, minOct, mini_w):
    out = 'const PT_BUNDLE = ' + json.dumps(PT_BUNDLE) + ';\n' + CH_JS + '\n' + js('const D = ' + json.dumps(D) + ';\nconst HART = ' + json.dumps({k: {'ar': v['ar'], 'f': v['f']} for k, v in HART.items()}) + ';\n' + CH_BODY(D, W, KH, minOct, mini_w))
    return out.replace('class Component extends DCLogic {\n', 'class Component extends DCLogic {' + PT_LIFE, 1)

# ══ The redesign, two concepts side by side (R42 v80; research: .scratch/r42/plan/chords-research.md) ══
CHEV_UD = '<svg viewBox="0 0 12 18" width="10" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; align-self: center; opacity: .55"><path d="m2.500 6.500 3.500-3.500 3.500 3.500M2.500 11.500l3.500 3.500 3.500-3.500"></path></svg>'
# each part is a pop-up button and looks like one: a filled pill with the up-down chevrons (Apple HIG, pop-up buttons)
PART = f'border: 0; background: {FILL}; margin: 0; min-height: 48px; padding: 2px 9px 4px 12px; border-radius: 14px; color: {INK}; font: inherit; white-space: nowrap; display: inline-flex; align-items: baseline; gap: 6px'
# A: the name is the control: three pop-up buttons read as one chord symbol (chord-trainer's row; Apple's pop-up button)
def NAME_A(fs):
    return (f'<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">'
      f'<div role="group" aria-label="Chord: {{{{symFull}}}}" style="display: flex; flex-wrap: wrap; align-items: stretch; justify-content: center; gap: 6px; font-family: {SERIF}; font-size: {fs}px; font-weight: 700; line-height: 1.1">'
      f'<button type="button" aria-haspopup="dialog" aria-label="Root: {{{{rootName}}}}" onClick="{{{{openMRoot}}}}" style="{PART}">{{{{rootName}}}}{CHEV_UD}</button>'
      f'<button type="button" aria-haspopup="dialog" aria-label="Chord type: {{{{qName}}}}, {{{{fullName}}}}" data-tip="{{{{fullName}}}}" onClick="{{{{openMType}}}}" style="{PART}"><span style="font-size: {{{{nmTypeFs}}}}; color: {{{{nmTypeC}}}}; align-self: center">{{{{nmType}}}}</span>{CHEV_UD}</button>'
      f'<button type="button" aria-haspopup="dialog" aria-label="In the bass: {{{{invLabel}}}}" onClick="{{{{openMBass}}}}" style="{PART}"><span style="font-size: {{{{nmBassFs}}}}; color: {{{{nmBassC}}}}; align-self: center">{{{{nmBass}}}}</span>{CHEV_UD}</button></div>'
      f'</div>')
FACTS = (f'<dl style="flex: none; margin: 0; border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{facts}}}}" as="f" hint-placeholder-count="3">'
         f'<div style="min-height: 46px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: inset 0 -1px 0 {LINE}"><dt style="font-size: 15px; color: {SOFT}">{{{{f.k}}}}</dt><dd style="margin: 0; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: pre">{{{{f.v}}}}</dd></div></sc-for></dl>')
MROW = f'width: 100%; min-height: 46px; border: 0; border-radius: 12px; background: transparent; padding: 4px 12px; display: flex; align-items: center; gap: 10px; color: {INK}; font: inherit; text-align: left'
MCHK = '<span style="flex: none; width: 18px; font-size: 16px; font-weight: 700; color: #7A5418">'
# The chord's three edit options open real drawers (R42, canvas 86): a bottom sheet on a phone with its grabber, title
# and Done, a titled popover on a laptop; a pick applies at once and the drawer stays until Done.
D_ROOT = KEYPICK_HTML('rootPick', 'Root')
D_TYPE = B_LIST[len(BACKHEAD('Chord', 'backChord')):]
D_BASS = (f'<div role="radiogroup" aria-label="In the bass" style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{bassItems}}}}" as="r" hint-placeholder-count="3">'
          f'<button type="button" role="radio" aria-checked="{{{{r.on}}}}" onClick="{{{{r.pick}}}}" style="width: 100%; min-height: 52px; box-sizing: border-box; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 6px 14px 6px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left"><span style="flex: 1; min-width: 0; font-size: 16px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</span><span style="flex: none; width: 18px; font-size: 17px; font-weight: 700; color: #7A5418">{{{{r.mark}}}}</span></button></sc-for></div>')
def DRAWERS(phone_like):
    if phone_like:
        return BSHEET('isMRoot', 'Root', D_ROOT) + BSHEET('isMType', 'Chord type', D_TYPE) + BSHEET('isMBass', 'In the bass', D_BASS)
    return (POPOVER('isMRoot', 'Root', D_ROOT, 'left: calc(50% - 210px); top: 500px', 420) + POPOVER('isMBass', 'In the bass', D_BASS, 'left: calc(50% - 210px); top: 500px', 420)
            + POPOVER('isMType', 'Chord type', D_TYPE, 'left: calc(50% - 210px); top: 150px', 420).replace('max-height: 760px', 'max-height: 620px'))
# The bar (R42 v82): Play at the centre, one button each side of equal width, each a symbol over its name, so the
# group is symmetric and fits a phone with its margins; v81's wide "Voicing" pill overflowed the left edge.
def SIDEBTN(label, aria, act, icon):
    return (f'<button type="button" aria-label="{aria}" aria-haspopup="true" onClick="{{{{{act}}}}}" style="pointer-events: auto; flex: none; width: 68px; padding: 0; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px">'
            f'<span style="height: 22px; display: flex; align-items: center">{icon}</span><span style="font-size: 11px; font-weight: 600; line-height: 1">{label}</span></button>')
VOICEBTN = SIDEBTN('{{voicingName}}', 'Voicing: {{voicingName}}', 'openVMenu', '<svg viewBox="0 0 24 22" width="24" height="22" aria-hidden="true"><path d="M2 3.5H22M2 7.5H22M2 11.5H22M2 15.5H22M2 19.5H22" stroke="currentColor" stroke-opacity=".28" stroke-width="1"></path><sc-for list="{{vDots}}" as="d" hint-placeholder-count="4"><ellipse cx="{{d.cx}}" cy="{{d.cy}}" rx="2.9" ry="2.05" transform="rotate(-18 {{d.cx}} {{d.cy}})" fill="currentColor"></ellipse></sc-for></svg>').replace('width: 68px; padding: 0;', 'width: 72px; padding: 0 4px;', 1).replace('<span style="height: 22px; display: flex; align-items: center">', '<span style="height: 22px; display: flex; align-items: center">', 1).replace('font-size: 11px; font-weight: 600; line-height: 1">', 'font-size: 11px; font-weight: 600; line-height: 1.05; text-align: center; max-width: 64px">', 1)
HANDSBTN_A = SIDEBTN('Hands', 'Hands: {{handsLabel}}', 'openHandsMenu', HANDSI).replace('width: 68px;', 'width: 72px;', 1)
# the piano settings: view, range, labels, then links to their one home (Ultimate Piano; OnlinePianist; Yamaha's Utility)
# a segmented row whose segments take their label's width (Fit the chord · 61 · 76 · 88), and one in two rows of two
def SEGA(lst): return '<div role="radiogroup" style="display: flex; gap: 2px; padding: 2px; border-radius: 11px; background: ' + FILL + '"><sc-for list="{{' + lst + '}}" as="o" hint-placeholder-count="4">' + _segbtn('flex: 1 1 auto;') + '</sc-for></div>'
# a switch row is one control: the row is the switch and carries its name
def SWROW(html, on, act):
    a = '<button type="button" onClick="{{' + act + '}}"'; b = '<span role="switch" aria-checked="{{' + on + '}}"'
    assert html.count(a) == 1 and html.count(b) == 1, (on, html.count(a), html.count(b))
    return html.replace(a, '<button type="button" role="switch" aria-checked="{{' + on + '}}" onClick="{{' + act + '}}"').replace(b, '<span aria-hidden="true"')
# a link row that says its state on a second line, in the app's own words (common.midi, settings.piano)
def STATEROW(label, sub): return ('<a href="#" style="min-height: 48px; box-sizing: border-box; padding: 8px 12px 8px 16px; display: flex; align-items: center; gap: 12px; color: ' + INK + '; text-decoration: none"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px">' + label + '</span><sc-if value="{{' + sub + 'On}}" hint-placeholder-val="{{false}}"><span style="font-size: 13px; color: ' + SOFT + '">{{' + sub + '}}</span></sc-if></span><span style="flex: none; font-size: 16px; color: {{' + sub + 'ValC}}">{{' + sub + 'Val}}</span><span style="color: ' + SOFT + '; display: flex">' + CHEV_R + '</span></a>')
B_PIANO = PS.PIANO_SHEET(True, 3, 4)
PIANOBTN = lambda: GLASSBTN('Piano', KEYSI, 'openKeys')
# content never shows through the bar: the page fades out under it (the tab bar's rule, v24)
DOCK_A_PHONE = f'<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 148px; z-index: 39; pointer-events: none; background: linear-gradient(to bottom, rgba(246,243,238,0), {PAGE} 30%)"></div><div role="toolbar" aria-label="Voicing, sound and hands" style="position: absolute; left: 16px; right: 16px; bottom: 30px; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 10px; pointer-events: none">{VOICEBTN}{PLAYSPLIT}{HANDSBTN_A}</div>'
DOCK_A_LAPTOP = f'<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 140px; z-index: 39; pointer-events: none; background: linear-gradient(to bottom, rgba(246,243,238,0), {PAGE} 30%)"></div><div role="toolbar" aria-label="Voicing, sound and hands" style="position: absolute; left: 0; right: 0; bottom: 24px; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none">{VOICEBTN}{PLAYSPLIT}{HANDSBTN_A}</div>'
def LISTSHEET(cond, body, phone_like, pos='', back='closeSheet'):
    b = body.replace('{{backChord}}', '{{' + back + '}}')
    if phone_like:
        return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.28)"></div><section role="dialog" class="nos" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 12px"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>{b}</section></sc-if>'
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" class="nos" style="position: absolute; {pos}; z-index: 61; width: 400px; max-height: 620px; overflow-y: auto; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 12px 16px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">{b}</div></sc-if>'
def LAYERS(phone_like, concept):
    out = TOAST + PLAYASMENU('left: 50%; transform: translateX(-50%); bottom: ' + ('96px' if phone_like else '92px'))
    if phone_like:
        out += HANDSMENU('right: 12px; bottom: 96px' if concept == 'A' else 'right: 12px; bottom: 150px')
        for cond, title, body in (('isKeys', 'Piano', B_PIANO), ('isNext', '{{nextTitle}}', B_NEXT), ('isTr', 'Key', B_TR), ('isVMenu', 'Voicing', VLIST)):
            out += BSHEET(cond, title, body)
        out += DRAWERS(True)
    else:
        out += HANDSMENU('left: calc(50% + 80px); bottom: 92px')
        for cond, title, body, pos in (('isKeys', 'Piano', B_PIANO, 'right: 24px; top: 76px'), ('isNext', '{{nextTitle}}', B_NEXT, 'left: calc(50% + 420px); top: 330px'), ('isTr', 'Key', B_TR, 'right: calc(50% + 426px); top: 300px'), ('isVMenu', 'Voicing', VLIST, 'left: calc(50% - 400px); bottom: 92px')):
            out += POPOVER(cond, title, body, pos, 400)
        out += DRAWERS(False)
    return out
# B: the chord shelf: one docked panel is the chord's home (new-app's root strip; pianochord.org's types and C/E pictures)
STRIP = 'display: flex; gap: 6px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px'
MINI = (f'<div aria-hidden="true" style="position: relative; width: 112px; height: 44px; border-radius: 4px; overflow: hidden; background: {LINE}; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{t.kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: 44px; box-sizing: border-box; border-right: 1px solid rgba(51,41,33,.14); background: {{{{k.bg}}}}"></span></sc-for><sc-for list="{{{{t.kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}"></span></sc-for></div>')
SHELF_BODY = (
  f'<div class="nos" role="radiogroup" aria-label="Root" style="{STRIP}"><sc-for list="{{{{rootTiles}}}}" as="o" hint-placeholder-count="17"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" aria-label="{{{{o.aria}}}}" onClick="{{{{o.pick}}}}" style="flex: none; width: 46px; height: 44px; padding: 0; border: 0; border-radius: 12px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; color: {INK}; font-family: {SERIF}; font-size: 18px; font-weight: {{{{o.fw}}}}">{{{{o.s}}}}</button></sc-for></div>'
  f'<div class="nos" role="radiogroup" aria-label="Chord type" style="display: grid; grid-auto-flow: column; grid-template-rows: repeat(2, 54px); grid-auto-columns: 92px; gap: 6px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px"><sc-for list="{{{{typeTiles}}}}" as="o" hint-placeholder-count="12"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-width: 0; padding: 0 4px; border: 0; border-radius: 12px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px"><span style="font-family: {SERIF}; font-size: 17px; font-weight: {{{{o.fw}}}}; white-space: nowrap">{{{{o.s}}}}</span><span style="max-width: 100%; font-size: 10.5px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{o.n}}}}</span></button></sc-for></div>'
  f'{CAPS("Inversions")}<div class="nos" role="radiogroup" aria-label="Inversions" style="{STRIP}"><sc-for list="{{{{invThumbs}}}}" as="t" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{t.on}}}}" aria-label="{{{{t.aria}}}}" onClick="{{{{t.pick}}}}" style="flex: none; border: 0; border-radius: 14px; background: {{{{t.bg}}}}; box-shadow: {{{{t.ring}}}}; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; color: {INK}; font: inherit">{MINI}<span style="font-family: {SERIF}; font-size: 16px; font-weight: {{{{t.fw}}}}">{{{{t.s}}}}</span></button></sc-for></div>'
  f'{CAPS("Voicing")}<div class="nos" role="radiogroup" aria-label="Voicing" style="{STRIP}"><sc-for list="{{{{voiceChips}}}}" as="v" hint-placeholder-count="6"><button type="button" role="radio" aria-checked="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="flex: none; height: 40px; padding: 0 14px; border: 0; border-radius: 20px; background: {{{{v.bg}}}}; box-shadow: {{{{v.ring}}}}; color: {INK}; font: inherit; font-size: 14px; font-weight: {{{{v.fw}}}}; white-space: nowrap">{{{{v.l}}}}</button></sc-for></div>')
SHELF_HEAD = (f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 8px"><button type="button" aria-expanded="{{{{shelfOpen}}}}" aria-label="{{{{shelfAria}}}}" onClick="{{{{toggleShelf}}}}" style="min-width: 0; min-height: 56px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; gap: 8px; color: {INK}; font: inherit; text-align: left"><span style="font-family: {SERIF}; font-size: 26px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{symFull}}}}</span><span style="flex: none; color: {SOFT}; display: flex">{CHEV_D}</span></button>'
              + PLAYSPLIT.replace('width: 176px;', 'width: 168px;') + HANDSBTN + '</div>')
SHELF_PHONE = (f'<section aria-label="Chord" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 40; border-radius: 24px 24px 0 0; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, 0 -8px 30px rgba(51,41,33,.12); padding: 8px 16px 26px; display: flex; flex-direction: column; gap: 10px"><div aria-hidden="true" style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>{SHELF_HEAD}'
               f'<sc-if value="{{{{shelfOpen}}}}" hint-placeholder-val="{{{{true}}}}"><div class="nos" style="max-height: 300px; overflow-y: auto; overflow-x: hidden; margin: 0 -16px; padding: 0 16px 4px; display: flex; flex-direction: column; gap: 10px">{SHELF_BODY}</div></sc-if></section>')
SHELF_LAPTOP = (f'<aside aria-label="Chord" class="nos" style="flex: none; width: 400px; box-sizing: border-box; overflow-y: auto; overflow-x: hidden; background: {PAGE}; box-shadow: -1px 0 0 {LINE}; padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 12px">{SHELF_HEAD}{SHELF_BODY}</aside>')

def write_laptop(stem, title, inner, D, concept):
    open(OUT + stem + '.dc.html', 'w').write(HEAD % title + LAPFRAME_TOP + f'<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: {PAGE}; color: {INK}; font-family: {FONT}; display: flex; flex-direction: column">{inner}{LAYERS(False, concept)}</div>' + f"""
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
{PRE}
{ch_js(D, 1710, 180, 4, 170)}
</script>
</body>
</html>
""")
def PH_HEAD(title): return f'<div style="flex: none; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px">{GLASSBTN("Back to Practice", CHEV_L, href="Main.dc.html")}<h1 style="margin: 0; font-size: 16px; font-weight: 600">{title}</h1>{PIANOBTN()}</div>'
def LP_HEAD(title): return f'<div style="flex: none; height: 68px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px"><div style="display: flex; align-items: center; gap: 14px">{GLASSBTN("Back to Practice", CHEV_L, href="Laptop.dc.html")}<h1 style="margin: 0; font-size: 18px; font-weight: 600">{title}</h1></div>{PIANOBTN()}</div>'
FINGLINE = f'<p style="margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 18px; font-size: 14px; color: {SOFT}"><sc-for list="{{{{handFacts}}}}" as="f" hint-placeholder-count="1"><span style="white-space: nowrap">{{{{f.k}}}} <b style="margin-left: 6px; color: {INK}; font-weight: 700; font-variant-numeric: tabular-nums; white-space: pre">{{{{f.v}}}}</b></span></sc-for></p>'
STAFFCARD = lambda w: f'<div style="position: relative; flex: none; border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 16px 12px; display: flex; flex-direction: column; gap: 12px">{STAFFHEAD}{STAFFSVG(w)}<div style="display: flex; align-items: center; gap: 12px; min-height: 44px"><div style="flex: 1; min-width: 0">{FINGLINE}</div></div></div>'
# ── A, phone and laptop ──
phone('Chords', 'Chords', PH_HEAD('Chords') + STAGE3D(220) + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 14px 16px 120px; display: flex; flex-direction: column; gap: 16px">{NAME_A(44)}{STAFFCARD(330)}{PRACTISE("Player.dc.html")}</main>' + DOCK_A_PHONE,
      ch_js({'root': 0, 'q': 12}, 402, 168, 2, 150), LAYERS(True, 'A'))
write_laptop('ChordsLaptop', 'Chords, laptop', LP_HEAD('Chords') + STAGE3D(286) + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 22px 40px 130px; display: flex; flex-direction: column; align-items: center; gap: 20px"><div style="width: 820px; max-width: 100%; display: flex; flex-direction: column; gap: 18px">{NAME_A(56)}{STAFFCARD(440)}{PRACTISE("PlayerLaptop.dc.html")}</div></main>' + DOCK_A_LAPTOP, {'root': 3, 'q': 14}, 'A')
# ── Random chords (R42 v105, owner: "I do want a random chord to practice the chords, but maybe in the player or
# somewhere else and not in the chords finder… like in a key or… by selecting what types of chords… and also the
# voicing"). Set up here, played in the Player in Wait mode: one Player for every kind of practice.
H3 = lambda t: f'<h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{t}</h3>'
def CHIPS(lst, label, serif=False, sub=False):
    fam = f'font-family: {SERIF}; font-size: 17px;' if serif else 'font-size: 14px;'
    subl = '<span style="font-size: 12px; font-weight: 500; color: ' + SOFT + '">{{o.r}}</span>' if sub else ''
    h = (f'height: 52px; flex-direction: column; gap: 0; padding: 0 12px;' if sub else 'height: 40px; padding: 0 14px;')
    return (f'<div role="group" aria-label="{label}" style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="6"><button type="button" aria-pressed="{{{{o.on}}}}" aria-label="{{{{o.aria}}}}" onClick="{{{{o.pick}}}}" style="flex: none; {h} min-width: 44px; border: 0; border-radius: 20px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; color: {INK}; font: inherit; {fam} font-weight: {{{{o.fw}}}}; display: flex; align-items: center; justify-content: center; white-space: nowrap">'
            f'<span>{{{{o.s}}}}</span>{subl}</button></sc-for></div>')
SHUF = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path></svg>'
RP_NOW = (f'<div style="display: flex; align-items: center; gap: 12px"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-family: {SERIF}; font-size: 30px; font-weight: 700; line-height: 1.1; white-space: nowrap">{{{{rpNow}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{rpNowSub}}}}</span></div>'
          f'<button type="button" onClick="{{{{rpTry}}}}" style="flex: none; height: 44px; padding: 0 16px 0 12px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px">{SHUF}Try one</button></div>')
SEGWRAP = lambda k: SEGGRID(k)
RP_FROM = (f'<section style="display: flex; flex-direction: column; gap: 12px">{H3("Chords from")}{SEGWRAP("rpFromSeg")}'
  f'<sc-if value="{{{{rpIsKey}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 12px">{KEYPICK_HTML("rpKeyPick", "Key")}<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">{SEGGRID("rpModeSeg")}{SEGGRID("rpSevSeg")}</div>{CHIPS("rpKeyChords", "The key’s chords", serif=True, sub=True)}</div></sc-if>'
  f'<sc-if value="{{{{rpIsTypes}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; gap: 12px"><sc-for list="{{{{rpTypeGroups}}}}" as="g" hint-placeholder-count="5"><div style="display: flex; flex-direction: column; gap: 8px"><h4 style="margin: 0 0 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{{{{g.g}}}}</h4>'
  f'<div role="group" aria-label="{{{{g.g}}}}" style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{g.items}}}}" as="o" hint-placeholder-count="6"><button type="button" aria-pressed="{{{{o.on}}}}" aria-label="{{{{o.aria}}}}" onClick="{{{{o.pick}}}}" style="flex: none; height: 40px; min-width: 44px; padding: 0 14px; border: 0; border-radius: 20px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; color: {INK}; font-family: {SERIF}; font-size: 17px; font-weight: {{{{o.fw}}}}; white-space: nowrap">{{{{o.s}}}}</button></sc-for></div></div></sc-for>{SEGWRAP("rpRootSeg")}</div></sc-if>'
  f'<span style="margin-left: 4px; font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{rpPool}}}}</span></section>')
RP_HOW = (f'<section style="display: flex; flex-direction: column; gap: 12px">{H3("Voicings")}{CHIPS("rpVoicChips", "Voicings")}</section>'
  f'<section style="display: flex; flex-direction: column; gap: 12px">{H3("Inversions")}{SEGWRAP("rpInvSeg")}</section>'
  f'<section style="display: flex; flex-direction: column; gap: 12px">{H3("Hands")}{SEGWRAP("rpHandSeg")}</section>'
  f'<section style="display: flex; flex-direction: column; gap: 12px">{H3("Session")}{SEGWRAP("rpGoalSeg")}{GROUP(("toggle", "Missed chords come back", "rpBackOn", "toggleRpBack"), bg="#FEFDFB")}</section>')
RP_START = lambda href, bottom: (f'<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 140px; z-index: 39; pointer-events: none; background: linear-gradient(to bottom, rgba(246,243,238,0), {PAGE} 32%)"></div>'
  f'<div style="position: absolute; left: 0; right: 0; bottom: {bottom}px; z-index: 40; display: flex; justify-content: center; padding: 0 16px; pointer-events: none"><a href="{href}" style="pointer-events: auto; width: 100%; max-width: 420px; height: 56px; border-radius: 28px; background: {ACCENT}; color: {INK}; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 8px 24px -8px rgba(51,41,33,.35)">'
  f'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4.8a1.6 1.6 0 0 1 2.4-1.4l11 6.8a2.1 2.1 0 0 1 0 3.6l-11 6.8A1.6 1.6 0 0 1 7 19.2z"></path></svg>{{{{rpStart}}}}</a></div>')
# ── Random chords in the Chords page's shape (R42, canvas 137, owner: "refactor this page like we did with the chords
# page. I dont like the chords selection for praticing page"): what is drawn is three pickers in the chord's own type,
# each opening its drawer; the draw is a card of chords, each bar one button; sessions are rows; the bar is the Chords
# page's bar with Start at its centre. No chip walls and no segmented rows on the page.
RC_NAME = lambda fs: (f'<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">'
  f'<div role="group" aria-label="What is drawn" style="display: flex; flex-wrap: wrap; align-items: stretch; justify-content: center; gap: 6px; font-family: {SERIF}; font-size: {fs}px; font-weight: 700; line-height: 1.1">'
  f'<button type="button" aria-haspopup="dialog" aria-label="Chords from: {{{{rpFromName}}}}" onClick="{{{{openRpFrom}}}}" style="{PART}">{{{{rpFromName}}}}{CHEV_UD}</button>'
  f'<button type="button" aria-haspopup="dialog" aria-label="Chords: {{{{rpSetName}}}}" onClick="{{{{openRpSet}}}}" style="{PART}">{{{{rpSetName}}}}{CHEV_UD}</button>'
  f'<button type="button" aria-haspopup="dialog" aria-label="Inversions: {{{{rpInvName}}}}" onClick="{{{{openRpInv}}}}" style="{PART}"><span style="font-size: 0.62em; color: {SOFT}; align-self: center">{{{{rpInvName}}}}</span>{CHEV_UD}</button></div>'
  f'<p style="margin: 0; font-size: 14px; color: {SOFT}">{{{{rpLine}}}}</p></div>')
RC_DRAW = (f'<section aria-label="In the draw" style="flex: none; border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 12px 12px 14px; display: flex; flex-direction: column; gap: 12px">'
  f'<div style="display: flex; align-items: center; gap: 8px; padding-left: 4px"><h3 style="flex: 1; margin: 0; font-size: 14px; font-weight: 600">In the draw <span style="font-weight: 500; color: {SOFT}; font-variant-numeric: tabular-nums">· {{{{rpCount}}}}</span></h3>'
  f'<button type="button" onClick="{{{{rpTry}}}}" style="flex: none; height: 44px; padding: 0 14px 0 12px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px">{SHUF}Try one</button></div>'
  f'<div role="group" aria-label="Chords in the draw" style="display: grid; grid-template-columns: repeat(auto-fill, minmax({{{{rpMin}}}}, 1fr)); gap: 6px"><sc-for list="{{{{rpBars}}}}" as="b" hint-placeholder-count="7">'
  f'<button type="button" aria-pressed="{{{{b.on}}}}" aria-label="{{{{b.aria}}}}" onClick="{{{{b.pick}}}}" style="min-width: 0; height: 64px; border: 0; border-radius: 12px; background: {{{{b.bg}}}}; box-shadow: {{{{b.ring}}}}; opacity: {{{{b.op}}}}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; padding: 0 4px">'
  f'<span style="font-family: {SERIF}; font-size: 20px; font-weight: 700; white-space: nowrap; text-decoration: {{{{b.deco}}}}">{{{{b.s}}}}</span><span style="max-width: 100%; font-family: {SERIF}; font-size: 13px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{b.r}}}}</span></button></sc-for></div>'
  f'<p style="margin: 0; padding: 0 4px; font-size: 13px; color: {SOFT}">{{{{rpBarsNote}}}}</p></section>')
RC_SESS = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">Session</h3>'
  f'<div role="radiogroup" aria-label="Session" style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{rpSessions}}}}" as="p" hint-placeholder-count="3">'
  f'<button type="button" role="radio" aria-checked="{{{{p.on}}}}" onClick="{{{{p.pick}}}}" style="width: 100%; min-height: 60px; border: 0; background: transparent; padding: 8px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left; box-shadow: inset 0 -1px 0 {LINE}"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{p.a}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{p.b}}}}</span></span><span style="flex: none; width: 18px; font-size: 17px; font-weight: 700; color: #7A5418">{{{{p.mark}}}}</span></button></sc-for>'
  + '</div>' + f'<div style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">' + GROUP(("toggle", "Missed chords come back", "rpBackOn", "toggleRpBack"), bg="#FEFDFB") + '</div></section>')
STARTBTN = lambda href: (f'<a href="{href}" style="pointer-events: auto; flex: none; width: 176px; height: 56px; border-radius: 28px; background: {ACCENT}; color: {INK}; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 6px 18px -8px rgba(51,41,33,.45)">'
  f'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4.8a1.6 1.6 0 0 1 2.4-1.4l11 6.8a2.1 2.1 0 0 1 0 3.6l-11 6.8A1.6 1.6 0 0 1 7 19.2z"></path></svg>Start</a>')
RVOICEBTN = VOICEBTN.replace('{{voicingName}}', '{{rpVoicName}}').replace('openVMenu', 'openRpVoic')
RHANDSBTN = HANDSBTN_A.replace('Hands: {{handsLabel}}', 'Hands: {{rpHandsName}}').replace('openHandsMenu', 'openRpHands')
RC_DOCK = lambda href, bottom, gap: (f'<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 148px; z-index: 39; pointer-events: none; background: linear-gradient(to bottom, rgba(246,243,238,0), {PAGE} 30%)"></div>'
  f'<div role="toolbar" aria-label="Voicings, start and hands" style="position: absolute; left: 16px; right: 16px; bottom: {bottom}px; z-index: 40; display: flex; justify-content: center; align-items: center; gap: {gap}px; pointer-events: none">{RVOICEBTN}{STARTBTN(href)}{RHANDSBTN}</div>')
RROWS = lambda lst, sub=True: (f'<div role="radiogroup" style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{{lst}}}}}" as="r" hint-placeholder-count="3">'
  f'<button type="button" role="radio" aria-checked="{{{{r.mark}}}}" onClick="{{{{r.pick}}}}" style="width: 100%; min-height: 52px; box-sizing: border-box; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 8px 14px 8px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left">'
  f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</span>' + (f'<span style="font-family: {SERIF}; font-size: 14px; color: {SOFT}; white-space: pre">{{{{r.sub}}}}</span>' if sub else '') + '</span>'
  f'<span style="flex: none; width: 18px; font-size: 17px; font-weight: 700; color: #7A5418">{{{{r.mark}}}}</span></button></sc-for></div>')
RGROUPS = lambda lst, label, sub: (f'<sc-for list="{{{{{lst}}}}}" as="g" hint-placeholder-count="3"><div style="display: flex; flex-direction: column; gap: 6px"><h4 style="margin: 0 0 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{{{{g.g}}}}</h4>'
  f'<div role="group" aria-label="{{{{g.g}}}}" style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{g.items}}}}" as="r" hint-placeholder-count="4">'
  f'<button type="button" aria-pressed="{{{{r.mark}}}}" onClick="{{{{r.pick}}}}" style="width: 100%; min-height: 48px; box-sizing: border-box; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 6px 14px 6px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left; opacity: {sub[1]}">'
  f'{sub[0]}<span style="flex: none; width: 18px; font-size: 17px; font-weight: 700; color: #7A5418">{{{{r.mark}}}}</span></button></sc-for></div></div></sc-for>')
TYPEROW = (f'<span style="flex: none; width: 64px; font-family: {SERIF}; font-size: 18px; font-weight: {{{{r.fw}}}}">{{{{r.s}}}}</span><span style="flex: 1; min-width: 0; font-size: 15px; color: {SOFT}">{{{{r.n}}}}</span>', '1')
VOICROW = (f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</span><sc-if value="{{{{r.hasWhy}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; color: {SOFT}">{{{{r.why}}}}</span></sc-if></span>', '{{r.op}}')
B_RFROM = (SEGWRAP('rpFromSeg') + f'<sc-if value="{{{{rpIsKey}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 12px">{KEYPICK_HTML("rpKeyPick", "Key")}{SEGGRID("rpModeSeg")}</div></sc-if>'
           f'<sc-if value="{{{{rpIsTypes}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; gap: 8px"><h4 style="margin: 0 0 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Roots</h4>{SEGGRID("rpRootSeg")}</div></sc-if>')
B_RSET = (f'<sc-if value="{{{{rpIsKey}}}}" hint-placeholder-val="{{{{true}}}}">{RROWS("rpSetRows")}</sc-if><sc-if value="{{{{rpIsTypes}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; gap: 12px">{RGROUPS("rpTypeRows", "Chord types", TYPEROW)}</div></sc-if>')
B_RINV = RROWS('rpInvRows')
B_RHANDS = RROWS('rpHandRows')
B_RVOIC = f'<div style="display: flex; flex-direction: column; gap: 12px">{RGROUPS("rpVoicGroups", "Voicings", VOICROW)}</div>'
# v138 (owner: "it is still not very understandable. and it looks like the same page. and I dont understand what this in
# the draw means and how to choose voicing is also not vey understandable and what is the most important on this page"):
# a drill's setup, not a chord page. No hands at the keys (they would give the answer away); first, what the drill is, as
# the card the learner will see; then three plain questions as rows (which chords, how you play them, how long), each
# value said in words and opened in its drawer; Start, the most important thing, full width at the foot.
RC_HERO = (f'<section aria-label="How it works" style="flex: none; border-radius: 20px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; padding: 16px; display: flex; gap: 16px; align-items: center">'
  f'<div aria-hidden="true" style="flex: none; width: 104px; height: 128px; border-radius: 14px; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, 0 8px 18px -10px rgba(51,41,33,.35); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; transform: rotate(-3deg)">'
  f'<span style="font-family: {SERIF}; font-size: 32px; font-weight: 700; white-space: nowrap">{{{{rpEx}}}}</span></div>'
  f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px"><h2 style="margin: 0; font-size: 19px; font-weight: 700">See a chord, play it</h2>'
  f'<p style="margin: 0; font-size: 14px; line-height: 1.45; color: {SOFT}">A chord name appears. Play it on your piano or on the keys on screen. When it is right, the next one comes.</p>'
  f'</div></section>')
RC_SEC = lambda t, rows: f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{t}</h3><div style="border-radius: 16px; background: #FEFDFB; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">{rows}</div></section>'
RC_ROWS = (RC_SEC('Which chords', GROUP(('link', 'Chord types', '{{rpTyVal}}', 'openRpSet'), ('link', 'Roots', '{{rpRtVal}}', 'openRpRoots'), ('link', 'Inversions', '{{rpInvName}}', 'openRpInv'), bg='#FEFDFB'))
  + RC_SEC('How you play them', GROUP(('link', 'Voicing', '{{rpVoicName}}', 'openRpVoic'), ('link', 'Hands', '{{rpHandsLong}}', 'openRpHands'), bg='#FEFDFB'))
  + RC_SEC('How long', GROUP(('link', 'Session', '{{rpGoalName}}', 'openRpGoal'), ('toggle', 'Missed chords come back', 'rpBackOn', 'toggleRpBack'), bg='#FEFDFB')))
RC_GO = lambda href, bottom: (f'<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 140px; z-index: 39; pointer-events: none; background: linear-gradient(to bottom, rgba(246,243,238,0), {PAGE} 32%)"></div>'
  f'<div style="position: absolute; left: 0; right: 0; bottom: {bottom}px; z-index: 40; display: flex; justify-content: center; padding: 0 16px; pointer-events: none"><a href="{href}" style="pointer-events: auto; width: 100%; max-width: 420px; height: 56px; border-radius: 28px; background: {ACCENT}; color: {INK}; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 17px; font-weight: 700; box-shadow: 0 6px 18px -8px rgba(51,41,33,.45)">'
  f'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4.8a1.6 1.6 0 0 1 2.4-1.4l11 6.8a2.1 2.1 0 0 1 0 3.6l-11 6.8A1.6 1.6 0 0 1 7 19.2z"></path></svg>{{{{rpStartT}}}}</a></div>')
# Chord types (v141): a checklist by group, as musictheory.net and ToneDear; chips show one group
B_RSET = (f'<div style="display: flex; flex-direction: column; gap: 16px">'
  f'<div class="nos" role="group" aria-label="Show" style="position: sticky; top: -6px; z-index: 2; background: {PAGE}; display: flex; gap: 8px; overflow-x: auto; margin: 0 -16px; padding: 8px 16px"><sc-for list="{{{{rpTyChips}}}}" as="c" hint-placeholder-count="6">'
  f'<button type="button" aria-pressed="{{{{c.on}}}}" onClick="{{{{c.pick}}}}" style="flex: none; height: 36px; padding: 0 14px; border: 0; border-radius: 18px; background: {{{{c.bg}}}}; color: {{{{c.fg}}}}; box-shadow: {{{{c.ring}}}}; font: inherit; font-size: 14px; font-weight: 600; white-space: nowrap">{{{{c.l}}}}</button></sc-for></div>'
  f'<div style="display: flex; align-items: center; gap: 8px; margin: -4px 4px 0"><span style="flex: 1; font-size: 14px; color: {SOFT}">{{{{rpTyCount}}}}</span><sc-if value="{{{{rpTyCan}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{rpTyClear}}}}" style="height: 36px; padding: 0 4px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 14px; font-weight: 600">Clear all</button></sc-if></div>'
  f'<sc-for list="{{{{rpTyGroups}}}}" as="x" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 8px"><div style="display: flex; align-items: center; gap: 8px; margin-left: 4px">'
  f'<h4 style="flex: 1; min-width: 0; margin: 0; font-size: 14px; font-weight: 600">{{{{x.g}}}}</h4><span style="font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{x.count}}}}</span>'
  f'<button type="button" role="checkbox" aria-checked="{{{{x.allOn}}}}" onClick="{{{{x.allPick}}}}" style="height: 40px; padding: 0 16px 0 8px; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px">Select all<span aria-hidden="true" style="flex: none; width: 20px; height: 20px; border-radius: 6px; background: {{{{x.boxBg}}}}; box-shadow: {{{{x.boxRing}}}}; color: #FEFDFB; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{x.boxMark}}}}</span></button></div>'
  f'<div role="group" aria-label="{{{{x.g}}}}" style="border-radius: 16px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{x.items}}}}" as="b" hint-placeholder-count="6">'
  f'<button type="button" role="checkbox" aria-checked="{{{{b.on}}}}" onClick="{{{{b.pick}}}}" style="width: 100%; min-height: 48px; box-sizing: border-box; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 6px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left">'
  f'<span style="flex: 1; min-width: 0; font-size: 16px; font-weight: {{{{b.fw}}}}">{{{{b.n}}}}</span><span style="flex: none; width: 72px; font-family: {SERIF}; font-size: 16px; color: {SOFT}; white-space: nowrap">{{{{b.s}}}}</span><span aria-hidden="true" style="flex: none; width: 20px; height: 20px; border-radius: 6px; background: {{{{b.boxBg}}}}; box-shadow: {{{{b.boxRing}}}}; color: #FEFDFB; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{b.boxMark}}}}</span></button></sc-for></div></section></sc-for></div>')
# Roots (v141): one octave of the keyboard, each key tapped in or out; three quick sets above it
B_RROOTS = (f'<div style="display: flex; flex-direction: column; gap: 16px"><p style="margin: 0 4px; font-size: 14px; line-height: 1.45; color: {SOFT}">Each chord type you chose comes on these roots. Tap a key to add or remove it.</p>'
  f'<div role="group" aria-label="Quick sets" style="display: flex; gap: 8px; flex-wrap: wrap"><sc-for list="{{{{rpRtQuick}}}}" as="c" hint-placeholder-count="3"><button type="button" aria-pressed="{{{{c.on}}}}" onClick="{{{{c.pick}}}}" style="height: 36px; padding: 0 14px; border: 0; border-radius: 18px; background: {{{{c.bg}}}}; color: {{{{c.fg}}}}; box-shadow: {{{{c.ring}}}}; font: inherit; font-size: 14px; font-weight: 600">{{{{c.l}}}}</button></sc-for></div>'
  f'<div role="group" aria-label="Roots" style="position: relative; height: 168px; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px {LINE}">'
  f'<sc-for list="{{{{rpWhite}}}}" as="k" hint-placeholder-count="7"><button type="button" aria-pressed="{{{{k.on}}}}" aria-label="{{{{k.aria}}}}" onClick="{{{{k.pick}}}}" style="position: absolute; top: 0; bottom: 0; left: {{{{k.left}}}}; width: calc(100% / 7); box-sizing: border-box; border: 0; border-right: 1px solid {LINE}; background: {{{{k.bg}}}}; color: {{{{k.fg}}}}; font: inherit; font-family: {SERIF}; font-size: 16px; font-weight: {{{{k.fw}}}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 12px">{{{{k.l}}}}</button></sc-for>'
  f'<sc-for list="{{{{rpBlack}}}}" as="k" hint-placeholder-count="5"><button type="button" aria-pressed="{{{{k.on}}}}" aria-label="{{{{k.aria}}}}" onClick="{{{{k.pick}}}}" style="position: absolute; top: 0; height: 60%; left: {{{{k.left}}}}; width: 12%; z-index: 1; border: 0; border-radius: 0 0 6px 6px; background: {{{{k.bg}}}}; color: {{{{k.fg}}}}; font: inherit; font-family: {SERIF}; font-size: 11px; line-height: 1.15; white-space: pre; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px">{{{{k.l}}}}</button></sc-for></div>'
  f'<span style="margin: 0 4px; font-size: 14px; color: {SOFT}">{{{{rpRtCount}}}}</span></div>')
# Inversions (v139): which note is at the bottom, shown on C; one or more
B_RINV = (f'<div style="display: flex; flex-direction: column; gap: 12px"><p style="margin: 0 4px; font-size: 14px; line-height: 1.45; color: {SOFT}">Which note of the chord is at the bottom. Choose one or more; each chord comes in one of them.</p>'
  f'<div role="group" aria-label="Inversions" style="border-radius: 16px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{rpInvRows2}}}}" as="r" hint-placeholder-count="4">'
  f'<button type="button" aria-pressed="{{{{r.mark}}}}" onClick="{{{{r.pick}}}}" style="width: 100%; min-height: 60px; box-sizing: border-box; border: 0; box-shadow: inset 0 -1px 0 {LINE}; background: transparent; padding: 8px 14px 8px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; font: inherit; text-align: left">'
  f'<span style="flex: none; width: 92px; font-family: {SERIF}; font-size: 17px; white-space: pre"><b style="color: #9A6A1E">{{{{r.low}}}}</b>{{{{r.pre}}}}</span>'
  f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{r.sub}}}}</span></span>'
  f'<span style="flex: none; width: 18px; font-size: 17px; font-weight: 700; color: #7A5418">{{{{r.mark}}}}</span></button></sc-for></div></div>')
B_RVOIC = f'<div style="display: flex; flex-direction: column; gap: 12px"><p style="margin: 0 4px; font-size: 14px; line-height: 1.45; color: {SOFT}">How each chord’s notes sit on the keys. Pick one, or several to mix them.</p>{RGROUPS("rpVoicGroups", "Voicings", VOICROW)}</div>'
B_RGOAL = RROWS('rpGoalRows', sub=False).replace('<span style="font-size: 16px; font-weight: {{r.fw}}">{{r.l}}</span>', '<span style="font-size: 16px; font-weight: {{r.fw}}">{{r.l}}</span><span style="font-size: 13px; color: ' + SOFT + '">{{r.sub}}</span>')
# the Chords drawer keeps its height while the chips filter it (v139)
RC_FIX = lambda c, h: h.replace('max-height: 86%;', 'height: 86%; box-sizing: border-box;').replace('max-height: 760px;', 'height: 680px;').replace('repeat(auto-fill, minmax(68px, 1fr))', 'repeat(3, minmax(0, 1fr))' if 'max-height: 86%' in h else 'repeat(4, minmax(0, 1fr))') if c == 'isRpSet' else h
RC_SHEETS = lambda phone_like: (''.join(RC_FIX(c, BSHEET(c, t, b)) for c, t, b in (('isRpSet', 'Chord types', B_RSET), ('isRpRoots', 'Roots', B_RROOTS), ('isRpInv', 'Inversions', B_RINV), ('isRpVoic', 'Voicing', B_RVOIC), ('isRpHands', 'Hands', B_RHANDS), ('isRpGoal', 'Session', B_RGOAL)))
  if phone_like else ''.join(RC_FIX(c, POPOVER(c, t, b, 'left: calc(50% + 296px); top: 120px', 420)) for c, t, b in (('isRpSet', 'Chord types', B_RSET), ('isRpRoots', 'Roots', B_RROOTS), ('isRpInv', 'Inversions', B_RINV), ('isRpVoic', 'Voicing', B_RVOIC), ('isRpHands', 'Hands', B_RHANDS), ('isRpGoal', 'Session', B_RGOAL))))
phone('RandomChords', 'Random chords', PH_HEAD('Random chords') + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 120px; display: flex; flex-direction: column; gap: 20px">{RC_HERO}{RC_ROWS}</main>' + RC_GO('PlayerPractice.dc.html', 30),
      ch_js({'root': 2, 'q': 1}, 402, 168, 2, 150), LAYERS(True, 'A') + RC_SHEETS(True))
write_laptop('RandomChordsLaptop', 'Random chords, laptop', LP_HEAD('Random chords') + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 40px 130px; display: flex; flex-direction: column; align-items: center"><div style="width: 560px; max-width: 100%; display: flex; flex-direction: column; gap: 20px">{RC_HERO}{RC_ROWS}</div></main>' + RC_GO('PlayerLaptop.dc.html', 24) + RC_SHEETS(False), {'root': 2, 'q': 1}, 'A')
for f in ('ChordsApp', 'ChordsDesk', 'ChordsB', 'ChordsBLaptop'):  # B, the chord shelf, was drawn in v80 and not chosen
    if os.path.exists(OUT + f + '.dc.html'): os.remove(OUT + f + '.dc.html')
# one type scale on this page (review, canvas 90): 15 and 17, from the shared sheet kit, fold into 14 and 16
for f in ('Chords', 'ChordsLaptop', 'RandomChords', 'RandomChordsLaptop'):
    h = open(OUT + f + '.dc.html').read().replace('font-size: 17px', 'font-size: 16px')
    TOOL = ('<div data-canvas-tool style="position: absolute; left: %s; top: %s; z-index: 300; font-family: ui-monospace, Menlo, monospace"><button type="button" aria-label="Canvas tool: show a state" aria-expanded="{{statesOpen}}" onClick="{{toggleStates}}" style="height: 22px; padding: 0 8px; border: 1px dashed #8A8178; border-radius: 11px; background: #FFF8; color: #685E56; font: inherit; font-size: 11px">States</button>'
            '<sc-if value="{{statesOpen}}" hint-placeholder-val="{{false}}"><div role="menu" aria-label="States" style="position: absolute; left: 0; top: 26px; width: 290px; padding: 4px; border-radius: 12px; background: #FEFDFB; box-shadow: 0 0 0 1px #DAD1C8, 0 14px 28px -8px rgba(51,41,33,.3); display: flex; flex-direction: column"><sc-for list="{{stateList}}" as="o" hint-placeholder-count="9"><button type="button" role="menuitemradio" onClick="{{o.pick}}" style="min-height: 40px; padding: 0 12px; border: 0; border-radius: 8px; background: transparent; color: #332921; font: inherit; font-size: 12px; font-weight: {{o.fw}}; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 8px"><span>{{o.l}}</span><span>{{o.mark}}</span></button></sc-for></div></sc-if></div>')
    a = '<div style="width: 450px; height: 920px; position: relative; font-family: ' if not f.endswith('Laptop') else '<img src="'
    assert a in h, f
    i = h.index(a); j = h.index('>', i) + 1 if not f.endswith('Laptop') else i
    h = h[:j] + TOOL % (('2px', '0px') if not f.endswith('Laptop') else ('24px', '24px')) + h[j:].replace('font-size: 15px', 'font-size: 14px')
    # one system on this page (consistency audit, canvas 91): spacing on 4/8 steps (2 stays, as the hairline inside
    # segmented rows); cards 16 round everywhere; the switch knob on the page's surface and ink shadow; no 800 weight
    STEP = {5: 4, 6: 8, 7: 8, 9: 8, 10: 12, 14: 16, 18: 16, 22: 24}
    def _snap(m):
        return m.group(1) + re.sub(r'(?<![\d.])(-?)(\d+)px', lambda n: n.group(1) + str(STEP.get(int(n.group(2)), int(n.group(2)))) + 'px', m.group(2))
    h = re.sub(r'((?:padding|gap|margin)(?:-[a-z]+)?: )([^;"\'{}]+)', _snap, h)
    h = h.replace('border-radius: 12px; background: #FEFDFB; overflow: hidden', 'border-radius: 16px; background: #FEFDFB; overflow: hidden')
    h = h.replace('background: #FFF; box-shadow: 0 2px 4px rgba(0,0,0,.2)', 'background: #FEFDFB; box-shadow: 0 2px 4px rgba(51,41,33,.2)').replace('font-weight: 800', 'font-weight: 700')
    # motion (seven questions, canvas 95): each layer comes from where it was asked for, short and eased out; it
    # leaves at once. Menus grow from the bar, the phone's sheets rise from the edge, the laptop's popovers from their
    # side, the toast slides up; nothing moves under reduced motion
    # ♭ ♮ ♯ as text from the app's own Text Accidentals (src/styles/fonts), before every face: neither serif nor
    # sans has them, and a browser's fallback set "D ♭maj7" apart (owner, v110)
    h = h.replace("font-family: 'Iowan Old Style'", "font-family: 'Text Accidentals', 'Iowan Old Style'").replace("font-family: 'Instrument Sans'", "font-family: 'Text Accidentals', 'Instrument Sans'")
    MOTION = ('<style data-motion>'
      "@font-face { font-family: 'Text Accidentals'; font-display: block; src: url(data:font/woff2;base64,d09GMgABAAAAAAQkAAsAAAAACUgAAAPWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAAbBEICocEhWwBNgIkAxgLDgAEIAWGbgcgG98HUVQwLih+HsbgHq1EVk6iV8vE6VvJj9qFI2LecD2vMqguq+5BktmA9N3T9kva/Z/L9ID0PR93OGL8TYHSTwPlyJmpEYG3+1U0mGaUhtMoiycSxbGEFe/w3x+q5lt0nY+JQyAgCzxgY768TMvdy9JcKDRpLk2M9tRwJ1ALWCtXq1WbaF5IbdnS9CaYPgC2OJK54IA+NB0gynx5chpNIKCVoyzHUsoCAOXPAQBAWO+7P9NULJ5uMQ/Mjd+AAEBXegGAvhqABTAAYwAWEKyIAIwVCYBgJfoALBYB0yEWI7/5fxEAIA0AzAEAgDLWVHMAQJDPkqwAFECQ3QAEj/PKgGwAcgEAAGtsTxHFNxmuJMu0U+bmWoKQ/615lR4VTV1H/zH383WU0zbW+l1KBjYIk/vUM4ncKlYgyYsIKfWwO0flKsEJC6QVgjDr0GhlDUgzvTQpFL1E1gFZRDS1sUltiyAQEfrXax0kRATh2WT9rAc9Ie1lfu1YQkSvZsMWzLQsX2NpEUfvTimZHHR0Z4Mt86b8pRv/F3D/YHxsvavJMjuTzbFxQQFGV42in47sOr1T3uChgqJHqfDF6CezsUEJRkcNfwNkjYdN/m+26jX/OfZ+/qTB/NNu7n8V2Z+V2Y25T43uRCk8Mb7d3dC3srul547x5Silp0Z3c1pWWa2KUly5nrwMTtu46jkV1XvKrkVF/vJ2yor+EmFWzUf+tqoCK+e3wktuUF45TsmrKIoWFhb56QsVhXvxe8Xi1p/PpajhsQgrkzWb58vZxg6Hz/RmGT55JgYXFbHpxLHX3D59Lzsli+K9STOjgab6RQ0+EQDQDQIg0Oj02SxPzvubpBzzDoAnnhc+AsCzfWHH4SFeTn4y0u4AeBTguLshejBc02PEA/j2aY+pN5Mi85k0oj3wKA4rOABeroqufHpM0KuIzFIA5gGOnND3Jadk7ZMzPP03s6Sckx7IebZJlwsWkVG5jHnU8DvJci0HEITlPikhX8BAo4aNGoXOBQg6xAyGjiksQgQDrbCMAFM01BYwjJw2a8gQX4hj1qtBAksNybTPeVjG0IakLC0kdJwjH/2AeKZDLuLvf5HQThGflXihjBg0/AzMhVeDdgMxXaLxYziaFtSVzj54MMIYGiVhDDyNEGcDyvjNGOo3lsq9UYuW27ik0edgBrKUyuaTFkgw98jFaz2aIALQQMaU5dw9VDsbHDwJGI7Iv7ljhM72j4z3fhg5OEzGTySTMhdt/34SU4AUxTv2oSN5QIm+dV/D+pX2yfZW/rT5Wen3UGZEODi7H/IVAQDEizh6AAAAAA==) format('woff2'); unicode-range: U+266D-266F, U+1D12A-1D12B }"
      '@keyframes pt-pop { from { opacity: 0; scale: .96 } } @keyframes pt-rise { from { translate: 0 100% } }'
      '@keyframes pt-fade { from { opacity: 0 } } @keyframes pt-toast { from { opacity: 0; translate: 0 12px } }'
      'button { -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none }'
      '.cname:hover span { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px }'
      '[role=menu] { animation: pt-pop 160ms cubic-bezier(.22,1,.36,1); transform-origin: bottom center }'
      '[role=menu][aria-label=States] { transform-origin: top left } [role=menu][aria-label=Hands] { transform-origin: bottom right }'
      'section[role=dialog] { animation: pt-rise 280ms cubic-bezier(.32,.72,0,1) }'
      'div[role=dialog] { animation: pt-pop 180ms cubic-bezier(.22,1,.36,1); transform-origin: top center }'
      'div[role=dialog][style*="bottom:"] { transform-origin: bottom center } div[role=dialog][aria-label=Piano] { transform-origin: top right }'
      ':has(+ [role=dialog]) { animation: pt-fade 200ms ease-out }'
      'div[role=status][style*="bottom: 100px"] { animation: pt-toast 220ms cubic-bezier(.22,1,.36,1) }'
      'button, a[href] { transition: scale 120ms ease-out, filter 120ms ease-out }'
      '@media (hover: hover) { button:hover:not([aria-disabled=true]), a[href]:hover { filter: brightness(.96) } }'
      'button:active:not([aria-disabled=true]):not([role=group] > button), a[href]:active { scale: .96 }'
      '[role=group] > button:active { filter: brightness(.9) }'
      ':focus-visible { outline: 2px solid #356890; outline-offset: 2px }'
      # tooltips (dashboard video, canvas 99): an icon-only control names itself on a pointer, after a short wait
      '@media (hover: hover) { [data-tip]::after { content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 8px); z-index: 90;'
      ' translate: -50% 4px; padding: 4px 8px; border-radius: 8px; background: #332921; color: #FEFDFB; font: 500 12px/16px Onest, system-ui, sans-serif;'
      ' white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity 120ms ease-out, translate 120ms ease-out }'
      ' [data-tip-up]::after { top: auto; bottom: calc(100% + 8px); translate: -50% -4px }'
      ' [data-tip-start]::after { left: 0; translate: 0 4px } [data-tip-start][data-tip]:hover::after { translate: 0 0 }'
      ' [data-tip]:hover::after { opacity: 1; translate: -50% 0; transition-delay: 500ms } }'
      '[data-tip]:not([style*="position: absolute"]) { position: relative } [data-tip]:hover { z-index: 95 }'
      '@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important } }</style>')
    h = h.replace('</style>', '</style>' + MOTION, 1)
    # larger text (canvas 95): the reading and the layers scale with the learner's text size, as rem does in the app
    h = h.replace('<main class="nos" style="', '<main class="nos" style="zoom: {{textZoom}}; ')
    h = h.replace('aria-label="Back to Practice"', 'aria-label="Back to Practice" data-tip-start')
    for lab, tip, up in (('Back to Practice', 'Back to Practice', False), ('Settings', 'Settings', False),
                         ('Play as: block chord or arpeggio', 'Play as', True), ('Remove {{k.s}}', 'Remove {{k.s}}', True)):
        h = h.replace('aria-label="%s"' % lab, 'aria-label="%s" data-tip="%s"%s' % (lab, tip, ' data-tip-up' if up else ''))
    h = h.replace('<div role="toolbar" aria-label="Voicing, sound and hands" style="', '<div role="toolbar" aria-label="Voicing, sound and hands" style="zoom: {{barZoom}}; ')
    h = re.sub(r'(<(?:section|div) role="dialog"[^>]*?style=")', r'\1zoom: {{textZoom}}; ', h)
    open(OUT + f + '.dc.html', 'w').write(h)
# Night (canvas 95): each board again in the app's dark roles (src/styles/tokens.css, html[data-theme='dark']); the
# chord paints stay, the keys take the dusk ivory, ink on honey stays dark, shadows deepen
import night as NT; night = NT.night
for f in ('Chords', 'ChordsLaptop'):
    open(OUT + f + 'Night.dc.html', 'w').write(night(open(OUT + f + '.dc.html').read()))
print('r42 chords ok')
