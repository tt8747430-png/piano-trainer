# Progressions: the library and a progression's page, phone and laptop, on the Practice canvas.
# Reuses chords.py's helpers. Run: python3 -I progressions.py
G = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/chords.py').read(), G)
OUT, HEAD, STATUS, SIDE, LAPFRAME_TOP, SH, POP = G['OUT'], G['HEAD'], G['STATUS'], G['SIDE'], G['LAPFRAME_TOP'], G['SH'], G['POP']
PICK, SEGBAR, LAB, H2, PROW, SROW, RB, BACK, GEAR, KEYS, sheet_phone, pop = (G[k] for k in 'PICK SEGBAR LAB H2 PROW SROW RB BACK GEAR KEYS sheet_phone pop'.split())
PHONE_FRAME, LAPTOP_FRAME = G['PHONE_FRAME'], G['LAPTOP_FRAME']

DATA = r'''
const LIB = [
  ['axis', 'pop', 'Axis of Awesome', 'Bright and singable, the sound of a thousand hits', 'I V vi IV', 'i VI III VII', 'The four chords of a thousand hits: the tonic, the dominant, the relative minor and the subdominant, each the key’s own.'],
  ['let-it-be', 'pop', 'Let It Be', 'Calm and hymn-like, it settles home twice', 'I V vi IV I V IV I', '', 'Only the key’s own chords. Most pop songs need no others.'],
  ['yesterday', 'pop', 'Yesterday', 'Wistful, with chords that lean somewhere else', 'I V/vi vi IV V I vi V/V IV I', '', 'Two secondary dominants: chords that act as the V of a chord other than I. In C, E7 pulls to Am, and D7 pulls to G, which never comes.'],
  ['clocks', 'pop', 'Clocks', 'Restless and dark, it never quite lands', 'I v v ii', '', 'The v is borrowed from the parallel minor, the minor key on the same tonic. In C that is Gm, from C minor, and it darkens the sound.'],
  ['doo-wop', 'pop', '50s doo-wop', 'Sweet and nostalgic, the 1950s slow dance', 'I vi IV V', 'i VI VII III', 'Tonic, relative minor, subdominant, dominant: the slow-dance loop of the 1950s.'],
  ['royal-road', 'pop', 'Royal Road', 'Yearning, always about to arrive', 'IV V iii vi', '', 'A favourite of Japanese pop, where it is called the Royal Road.'],
  ['creep', 'pop', 'Creep', 'Bittersweet: a bright turn, then a shadow', 'I III IV iv', '', 'A major III where the key has a minor iii, then IV turning minor: the iv is borrowed from the parallel minor.'],
  ['rock-shuffle', 'rock', 'Rock shuffle', 'Driving and plain, home in three chords', 'I V IV', '', 'Down from the dominant through the subdominant to the tonic. This V–IV–I ending closes rock and gospel songs alike.'],
  ['wild-thing', 'rock', 'Wild Thing', 'Loud and simple, back and forth', 'I IV V IV', '', 'The three primary chords, rocking between IV and V.'],
  ['mixolydian', 'rock', 'Mixolydian rock', 'Open and bluesy, a stadium ending', 'I ♭VII IV I', '', 'The ♭VII is borrowed from the Mixolydian mode: a major chord a whole tone below the tonic.'],
  ['ii-v-i', 'jazz', 'ii–V–I', 'The jazz cadence: tension, then home', 'ii7 V7 Imaj7', 'iiø7 V7 i', 'The predominant, the dominant and the tonic, each a 5th apart: the cadence at the heart of jazz.'],
  ['rhythm', 'jazz', 'Rhythm changes', 'Swinging round and round', 'I vi ii V', 'i VI ii° V', 'Gershwin’s turnaround: the tonic and three chords that circle back by 5ths.'],
  ['backdoor', 'jazz', 'Backdoor ii–V', 'Home from the other side', 'iv7 ♭VII7 Imaj7', '', 'A ii–V that comes home from a whole tone below: iv7 and ♭VII7 are borrowed from the parallel minor.'],
  ['ragtime', 'jazz', 'Ragtime progression', 'Rolling round the circle to home', 'III7 VI7 II7 V7 I', '', 'Dominant 7ths round the circle of fifths, each the V of the next, until the last lands on I.'],
  ['twelve-bar', 'blues', '12-bar blues', 'The blues: three chords, twelve bars', 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7', '', 'Four bars on the tonic, two on the subdominant and back, then the dominant, the subdominant and home, with a turnaround to start again.'],
  ['perfect-cadence', 'classical', 'Perfect cadence', 'The full stop of classical music', 'I IV V I', 'i iv V i', 'The subdominant, the dominant, then the tonic: the cadence that ends a classical phrase.'],
  ['picardy', 'classical', 'Picardy third', 'Minor, ending in light', '', 'i iv V I', 'A minor piece that ends on the major tonic chord: the third of the last chord is raised.'],
  ['neo-soul', 'soul', 'Neo-soul', 'Warm and floating, never landing', 'vi V IV V', 'i VII VI VII', 'Round the relative minor without touching the tonic.'],
  ['gospel', 'gospel', 'Gospel standard', 'Rising and glad, Sunday morning', 'I iii IV V', '', 'Up the key by step from the tonic to the dominant.'],
  ['dorian', 'modal', 'Dorian vamp', 'Cool and minor, with a bright lift', '', 'i IV', 'A minor chord and the major chord a 4th above it: the major IV holds the Dorian mode’s raised 6th.']
];
const STYLES = [['pop', 'Pop'], ['rock', 'Rock'], ['jazz', 'Jazz'], ['blues', 'Blues'], ['classical', 'Classical'], ['soul', 'Soul'], ['gospel', 'Gospel'], ['modal', 'Modal']];
const MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10];
const RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const EXP_MAJ = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'], EXP_MIN = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'];
function parseRN(tok) {
  const m = tok.match(/^([♭♯]?)([iIvV]+)(.*)$/);
  if (!m) return null;
  const up = m[2] === m[2].toUpperCase();
  return { acc: m[1] === '♭' ? -1 : m[1] === '♯' ? 1 : 0, deg: RN.indexOf(m[2].toUpperCase()), up, raw: m[2], suf: m[3] };
}
function role(tok, minor) {
  if (tok.indexOf('/') > 0 && !/\/\d$/.test(tok)) return 'sec';
  const p = parseRN(tok); if (!p) return 'col';
  if (p.acc) return 'bor';
  const exp = (minor ? EXP_MIN : EXP_MAJ)[p.deg];
  const caseOk = exp === p.raw || exp.toLowerCase() === p.raw.toLowerCase() && (exp === exp.toUpperCase()) === p.up || (minor && p.deg === 4 && p.up) || (minor && p.deg === 6 && !p.up) || (p.deg === 6 && !minor && p.raw === 'vii');
  if (!caseOk) return 'bor';
  if (p.deg === 4 || p.deg === 6) return 'dom';
  if (p.deg === 1 || p.deg === 3) return 'pre';
  if (p.deg === 0) return 'ton';
  return minor ? (p.deg === 5 || p.deg === 2 ? 'ton' : 'ton') : 'ton';
}
const ROLE = {
  ton: ['Tonic', '#E3EEDF', '#2E6B3A'], pre: ['Predominant', '#F8E3D0', '#9A4A10'], dom: ['Dominant', '#E6E0F4', '#55468A'],
  bor: ['Borrowed', '#EEE8DF', '#5A5048'], sec: ['Secondary dominant', '#F3DDE3', '#8E2F4A'], col: ['Colour', '#EEE8DF', '#5A5048']
};
'''

LIBJS = DATA + r'''
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {};
    const set = (o) => this.setState(o);
    const place = st.place ?? 'all', q = st.q ?? '', hearts = st.hearts ?? ['axis', 'ii-v-i', 'twelve-bar'], open = st.open ?? ['pop', 'jazz'], sheet = st.sheet || null, menu = st.menu ?? false;
    const recent = ['ii-v-i', 'axis', 'yesterday'];
    const mine = st.mine ?? [['my-verse', 'pop', 'Verse of my song', 'Mine · in G', 'I iii vi IV', '', '']];
    const sort = st.sort ?? 'manual', kinds = st.kinds ?? [], style = st.style ?? null;
    const all = LIB.concat(mine);
    const match = (p) => (!q || p[2].toLowerCase().includes(q.toLowerCase()) || p[4].includes(q)) && (kinds.length === 0 || (kinds.includes('major') && p[4]) || (kinds.includes('minor') && p[5]));
    const chip = (tok, minor) => { const r = ROLE[role(tok, minor)]; return { t: tok, bg: r[1], fg: r[2] }; };
    const row = (p) => ({ id: p[0], name: p[2], line: p[3], chips: (p[4] || p[5]).split(' ').slice(0, 8).map((t) => chip(t, !p[4])), more: (p[4] || p[5]).split(' ').length > 8 ? '+' + ((p[4] || p[5]).split(' ').length - 8) : '', heart: hearts.includes(p[0]), hfill: hearts.includes(p[0]) ? '#E8762F' : 'none', hstroke: hearts.includes(p[0]) ? '#E8762F' : '#8A8178', toggle: () => set({ hearts: hearts.includes(p[0]) ? hearts.filter((h) => h !== p[0]) : hearts.concat([p[0]]) }) });
    let flat = null;
    if (place === 'fav') flat = all.filter((p) => hearts.includes(p[0]));
    if (place === 'recent') flat = recent.map((id) => all.find((p) => p[0] === id));
    if (place === 'mine') flat = mine;
    if (q) flat = all.filter(match);
    if (style && !q) flat = LIB.filter((p) => p[1] === style);
    if (flat) { flat = flat.filter(match); if (sort === 'name') flat = flat.slice().sort((a, b) => a[2].localeCompare(b[2])); }
    const groups = STYLES.map(([id, name]) => { const items = LIB.filter((p) => p[1] === id && match(p)); const isOpen = open.includes(id); return { id, name, count: String(items.length), isOpen, rot: isOpen ? 'rotate(90deg)' : 'none', items: isOpen ? items.map(row) : [], toggle: () => set({ open: isOpen ? open.filter((o) => o !== id) : open.concat([id]) }) }; }).filter((g) => g.count !== '0');
    const places = [['all', 'All'], ['fav', 'Favourites'], ['recent', 'Recently played'], ['mine', 'Mine']].map(([id, l]) => ({ l, on: place === id, bg: place === id ? '#1A1612' : '#FFFFFF', fg: place === id ? '#FFFFFF' : '#1A1612', sh: place === id ? 'none' : '0 0 0 1px #E2DACF', pick: () => set({ place: id, style: null }) }));
    const nFilt = kinds.length + (sort !== 'manual' ? 1 : 0);
    const shown = flat ? flat.length : LIB.filter(match).length;
    return {
      SH, places, isFlat: !!flat, notFlat: !flat, flat: flat ? flat.map(row) : [], groups, empty: !!flat && flat.length === 0, q,
      emptyLine: q ? 'No progressions match “' + q + '”.' : place === 'fav' ? 'Tap the heart on a progression to keep it here.' : 'Progressions you keep are here.',
      setQ: (e) => set({ q: e.target.value }), clearQ: () => set({ q: '' }),
      nFilt: String(nFilt), hasFilt: nFilt > 0, filtOn: sheet === 'filter', openFilt: () => set({ sheet: 'filter', menu: false }), closeAll: () => set({ sheet: null, menu: false }),
      addOn: sheet === 'add', openAdd: () => set({ sheet: sheet === 'add' ? null : 'add', menu: false }), menuOn: menu, toggleMenu: () => set({ menu: !menu, sheet: null }),
      sorts: [['manual', 'As arranged'], ['name', 'Name'], ['recent', 'Recently played']].map(([id, l]) => ({ l, on: sort === id, mark: sort === id ? '✓' : '', pick: () => set({ sort: id }) })),
      kindChips: [['major', 'Major key', LIB.filter((p) => p[4]).length], ['minor', 'Minor key', LIB.filter((p) => p[5]).length]].map(([id, l, n]) => ({ l: l + ' · ' + n, on: kinds.includes(id), bg: kinds.includes(id) ? '#1A1612' : '#FFFFFF', fg: kinds.includes(id) ? '#FFFFFF' : '#1A1612', pick: () => set({ kinds: kinds.includes(id) ? kinds.filter((k) => k !== id) : kinds.concat([id]) }) })),
      showN: 'Show ' + shown, reset: () => set({ kinds: [], sort: 'manual' }),
      tree: [['all', 'All', LIB.length + mine.length], ['fav', 'Favourites', hearts.length], ['recent', 'Recently played', recent.length], ['mine', 'Mine', mine.length]].map(([id, l, n]) => ({ l, n: String(n), bg: !style && place === id ? '#EFE8DF' : 'transparent', w: !style && place === id ? 700 : 500, pick: () => set({ place: id, style: null }) })),
      styles: STYLES.map(([id, l]) => ({ l, n: String(LIB.filter((p) => p[1] === id).length), bg: style === id ? '#EFE8DF' : 'transparent', w: style === id ? 700 : 500, pick: () => set({ style: id, place: 'all' }) })),
      listTitle: style ? STYLES.find((x) => x[0] === style)[1] : ({ all: 'All progressions', fav: 'Favourites', recent: 'Recently played', mine: 'Mine' })[place],
      legend: ['ton', 'pre', 'dom', 'bor', 'sec'].map((k) => ({ l: ROLE[k][0], bg: ROLE[k][1], fg: ROLE[k][2] }))
    };
  }
}
'''

PAGEJS = DATA + r'''
const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const ROOTS_MIN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
const ROOTL = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6], ROOTL_MIN = [0, 0, 1, 2, 2, 3, 3, 4, 4, 5, 6, 6];
const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], NAT = [0, 2, 4, 5, 7, 9, 11];
const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };
const nameOf = (pc, letter) => { let d = ((pc - NAT[letter]) % 12 + 12) % 12; if (d > 6) d -= 12; return LET[letter] + ACC[String(d)]; };
function chordOf(tok, tonic, tl, minor) {
  let target = 0, tLetter = 0, secondary = false, body = tok;
  if (tok.indexOf('/') > 0 && !/\/\d$/.test(tok)) { const [a, b] = tok.split('/'); const pb = parseRN(b); target = (minor ? MIN : MAJ)[pb.deg] + pb.acc; tLetter = pb.deg; body = a; secondary = true; }
  body = body.replace(/\/\d$/, '');
  const p = parseRN(body);
  const scale = minor ? MIN : MAJ;
  let rootPc, letter;
  if (secondary) { rootPc = (tonic + target + scale[p.deg]) % 12; letter = (tl + tLetter + p.deg) % 7; }
  else { rootPc = (tonic + scale[p.deg] + p.acc + 12) % 12; letter = (tl + p.deg) % 7; }
  const s = p.suf;
  let q, suf, ivs;
  if (s.startsWith('ø')) { q = 'm7♭5'; ivs = [0, 3, 6, 10]; }
  else if (s.startsWith('°')) { q = s.includes('7') ? 'dim7' : 'dim'; ivs = s.includes('7') ? [0, 3, 6, 9] : [0, 3, 6]; }
  else if (/maj7|Maj7/.test(s)) { q = p.up ? 'maj7' : 'm(maj7)'; ivs = p.up ? [0, 4, 7, 11] : [0, 3, 7, 11]; }
  else if (s.startsWith('7♭9')) { q = '7♭9'; ivs = [0, 4, 7, 10, 13]; }
  else if (s.startsWith('7')) { q = p.up ? '7' : 'm7'; ivs = p.up ? [0, 4, 7, 10] : [0, 3, 7, 10]; }
  else if (s.startsWith('6')) { q = p.up ? '6' : 'm6'; ivs = p.up ? [0, 4, 7, 9] : [0, 3, 7, 9]; }
  else { q = p.up ? '' : 'm'; ivs = p.up ? [0, 4, 7] : [0, 3, 7]; }
  if (secondary && !s) { q = ''; ivs = [0, 4, 7]; }
  if (secondary && s.startsWith('7')) { q = '7'; ivs = [0, 4, 7, 10]; }
  return { sym: nameOf(rootPc, letter) + q, root: rootPc, ivs };
}
const MOTION = { 0: ['same', 'root'], 1: ['½ step', 'up'], 2: ['step', 'up'], 3: ['3rd', 'up'], 4: ['3rd', 'up'], 5: ['5th', 'down'], 6: ['tritone', ''], 7: ['5th', 'up'], 8: ['3rd', 'down'], 9: ['3rd', 'down'], 10: ['step', 'down'], 11: ['½ step', 'down'] };
const LO = 41, HI = 84;
function keyboard(lh, rh, sounding) {
  const whites = []; for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) whites.push(m); }
  const W = 100 / whites.length;
  const col = (m, black) => rh.includes(m) ? (black ? '#C9561A' : (sounding ? '#E8762F' : '#F7C9A5')) : lh.includes(m) ? (black ? '#55468A' : (sounding ? '#7E6BB8' : '#D5CCEC')) : '';
  const ws = whites.map((m, i) => ({ x: (i * W).toFixed(3) + '%', w: W.toFixed(3) + '%', fill: col(m) || '#FFFFFF', lab: m === 60 ? 'C4' : '' }));
  const bs = []; for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) continue; const i = whites.indexOf(m - 1); bs.push({ x: ((i + 1) * W - W * 0.3).toFixed(3) + '%', w: (W * 0.6).toFixed(3) + '%', fill: col(m, true) || '#1A1612' }); }
  return { whites: ws, blacks: bs };
}
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {};
    const set = (o) => this.setState(o);
    const id = st.id ?? 'yesterday', tonic = st.tonic ?? 0, sheet = st.sheet || null, sounding = st.sounding ?? false, at = st.at ?? 0, bpm = st.bpm ?? 84, voicing = st.voicing ?? 'led', heart = st.heart ?? true, menu = st.menu ?? false;
    const p = LIB.find((x) => x[0] === id);
    const hasMaj = !!p[4], hasMin = !!p[5];
    const minor = st.minor ?? !hasMaj;
    const line = (minor ? p[5] : p[4]) || p[4] || p[5];
    const isMinor = minor && hasMin || !hasMaj;
    const tl = (isMinor ? ROOTL_MIN : ROOTL)[tonic], tName = (isMinor ? ROOTS_MIN : ROOTS)[tonic];
    const toks = line.split(' ');
    const chords = toks.map((t) => ({ t, ...chordOf(t, tonic, tl, isMinor), r: role(t, isMinor) }));
    // voicing: right hand close chord, block from the root above C4, or led to the nearest
    let prev = null;
    const rhs = chords.map((c) => {
      const base = c.ivs.slice(0, 4).map((iv) => ((c.root + iv) % 12));
      if (voicing === 'block' || !prev) { let r = 60 + c.root; if (r > 66) r -= 12; const out = c.ivs.slice(0, 4).map((iv) => r + iv); prev = out; return out; }
      let best = null;
      for (let inv = 0; inv < base.length; inv++) { const rot = base.slice(inv).concat(base.slice(0, inv)); for (let o = 55; o <= 67; o++) { if (rot[0] !== o % 12) continue; let m = o; const out = rot.map((pc) => { while (m % 12 !== pc) m++; const v = m; m++; return v; }); const cost = out.reduce((a, v, i) => a + Math.abs(v - (prev[i] ?? prev[prev.length - 1])), 0); if (!best || cost < best.cost) best = { out, cost }; } }
      prev = best.out; return best.out;
    });
    const cur = chords[Math.min(at, chords.length - 1)];
    const kb = keyboard([48 + cur.root - (cur.root > 7 ? 12 : 0)], rhs[Math.min(at, chords.length - 1)], sounding);
    const cols = Math.min(4, chords.length);
    const tiles = chords.map((c, i) => {
      const R = ROLE[c.r];
      const nx = chords[i + 1];
      const d = nx ? ((nx.root - c.root) % 12 + 12) % 12 : null;
      const rowEnd = (i + 1) % cols === 0 || !nx;
      return { rn: c.t, sym: c.sym, role: R[0], bg: i === at ? R[2] : R[1], fg: i === at ? '#FFFFFF' : '#1A1612', rfg: i === at ? 'rgba(255,255,255,0.8)' : R[2], on: i === at, pick: () => set({ at: i, sounding: true }), arrow: !rowEnd, m1: d === null ? '' : MOTION[d][0], m2: d === null ? '' : MOTION[d][1] };
    });
    const selLine = cur.t + ' · ' + cur.sym + ' · ' + ROLE[cur.r][0];
    const used = [...new Set(chords.map((c) => c.r))].map((k) => ({ l: ROLE[k][0], bg: ROLE[k][1], fg: ROLE[k][2] }));
    const seg = (on) => ({ bg: on ? '#FFFFFF' : 'transparent', sh: on ? '0 0 0 1px rgba(26,22,18,0.06), 0 1px 3px rgba(26,22,18,0.12)' : 'none', w: on ? 700 : 500 });
    const styleName = STYLES.find((s) => s[0] === p[1])[1];
    const similar = LIB.filter((x) => x[1] === p[1] && x[0] !== id).slice(0, 3).concat(LIB.filter((x) => x[1] !== p[1]).slice(0, 1));
    return {
      SH, name: p[2], line: p[3], about: p[6], styleName, keyLabel: tName + (isMinor ? ' minor' : ' major'), numerals: line.replace(/ /g, ' · '),
      selLine, tiles, cols: 'repeat(' + cols + ', minmax(0, 1fr))', used,
      modeSeg: hasMaj && hasMin ? [[false, 'Major'], [true, 'Minor']].map(([v, l]) => ({ l, on: isMinor === v, ...seg(isMinor === v), pick: () => set({ minor: v, at: 0 }) })) : [],
      hasModes: hasMaj && hasMin,
      voiceSeg: [['led', 'Voice-led'], ['block', 'Block']].map(([v, l]) => ({ l, on: voicing === v, ...seg(voicing === v), pick: () => set({ voicing: v }) })),
      whites: kb.whites, blacks: kb.blacks, fullName: cur.sym,
      sounding, playLabel: sounding ? 'Stop' : 'Play', togglePlay: () => set({ sounding: !sounding }),
      bpm: String(bpm), bpmDown: () => set({ bpm: Math.max(40, bpm - 4) }), bpmUp: () => set({ bpm: Math.min(200, bpm + 4) }),
      heart, hfill: heart ? '#E8762F' : 'none', hstroke: heart ? '#E8762F' : '#1A1612', toggleHeart: () => set({ heart: !heart }),
      menuOn: menu, toggleMenu: () => set({ menu: !menu, sheet: null }),
      keyOn: sheet === 'key', anyOn: !!sheet || menu, openKey: () => set({ sheet: sheet === 'key' ? null : 'key', menu: false }), closeAll: () => set({ sheet: null, menu: false }),
      roots: (isMinor ? ROOTS_MIN : ROOTS).map((r, i) => ({ r, on: i === tonic, bg: i === tonic ? '#1A1612' : '#FFFFFF', fg: i === tonic ? '#FFFFFF' : '#1A1612', pick: () => set({ tonic: i, sheet: null }) })),
      similar: similar.map((x) => ({ name: x[2], line: (x[4] || x[5]).replace(/ /g, ' · '), pick: () => set({ id: x[0], at: 0, minor: undefined }) }))
    };
  }
}
'''

HEART = '<svg width="20" height="20" viewBox="0 0 24 24" fill="{{FILL}}" stroke="{{STROKE}}" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"></path></svg>'
MORE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
SEARCH = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6259" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m20 20-4-4"></path></svg>'
FILT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"></path></svg>'
CHEVR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8178" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform: {{g.rot}}"><path d="m9 6 6 6-6 6"></path></svg>'

# ---------- the library ----------
LROW = lambda pfx: f"""<div style="display: flex; align-items: center; gap: 10px; padding: 12px 6px 12px 14px; box-shadow: inset 0 -1px 0 #F1EBE3"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 16px; font-weight: 600">{{{{{pfx}.name}}}}</span><span style="font-size: 13px; color: #6B6259">{{{{{pfx}.line}}}}</span><div style="display: flex; flex-wrap: wrap; gap: 4px"><sc-for list="{{{{{pfx}.chips}}}}" as="c" hint-placeholder-count="4"><span style="height: 24px; min-width: 26px; padding: 0 7px; box-sizing: border-box; border-radius: 7px; background: {{{{c.bg}}}}; color: {{{{c.fg}}}}; display: inline-flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', Georgia, serif; font-size: 16px">{{{{c.t}}}}</span></sc-for><span style="font-size: 13px; color: #6B6259; align-self: center">{{{{{pfx}.more}}}}</span></div></div><button type="button" aria-label="Favourite" aria-pressed="{{{{{pfx}.heart}}}}" onClick="{{{{{pfx}.toggle}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center">{HEART.replace('{{FILL}}', '{{' + pfx + '.hfill}}').replace('{{STROKE}}', '{{' + pfx + '.hstroke}}')}</button></div>"""
SEARCHROW = f"""<div style="display: flex; gap: 8px"><label style="flex: 1; min-width: 0; height: 46px; border-radius: 12px; background: #FFFFFF; box-shadow: {SH}; display: flex; align-items: center; gap: 8px; padding: 0 12px">{SEARCH}<input value="{{{{q}}}}" onInput="{{{{setQ}}}}" placeholder="Search progressions" aria-label="Search progressions" style="flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 16px; color: #1A1612"></label><button type="button" aria-label="Sort and filter" onClick="{{{{openFilt}}}}" style="position: relative; flex: none; width: 46px; height: 46px; border: 0; border-radius: 12px; background: #FFFFFF; box-shadow: {SH}; color: #1A1612; display: flex; align-items: center; justify-content: center">{FILT}<sc-if value="{{{{hasFilt}}}}" hint-placeholder-val="{{{{false}}}}"><span style="position: absolute; top: -5px; right: -5px; min-width: 18px; height: 18px; border-radius: 9999px; background: #E8762F; color: #FFFFFF; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{nFilt}}}}</span></sc-if></button></div>"""
PLACES = """<div class="nos" role="radiogroup" aria-label="Show" style="display: flex; gap: 6px; overflow-x: auto; margin: 0 -16px; padding: 0 16px"><sc-for list="{{places}}" as="p" hint-placeholder-count="4"><button type="button" role="radio" aria-checked="{{p.on}}" onClick="{{p.pick}}" style="flex: none; height: 36px; padding: 0 14px; border: 0; border-radius: 9999px; background: {{p.bg}}; color: {{p.fg}}; box-shadow: {{p.sh}}; font-size: 15px; font-weight: 600">{{p.l}}</button></sc-for></div>"""
LEGEND = """<div aria-label="What the colours mean" style="display: flex; flex-wrap: wrap; gap: 6px 12px; padding: 0 2px"><sc-for list="{{legend}}" as="l" hint-placeholder-count="5"><span style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #4A433C"><span style="width: 12px; height: 12px; border-radius: 4px; background: {{l.bg}}; box-shadow: inset 0 0 0 1px {{l.fg}}"></span>{{l.l}}</span></sc-for></div>"""
GROUPS = f"""<sc-if value="{{{{notFlat}}}}" hint-placeholder-val="{{{{true}}}}"><div style="border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="8"><button type="button" aria-expanded="{{{{g.isOpen}}}}" onClick="{{{{g.toggle}}}}" style="width: 100%; height: 52px; border: 0; background: #FBF8F3; box-shadow: inset 0 -1px 0 #F1EBE3; display: flex; align-items: center; gap: 10px; padding: 0 14px; color: #1A1612; text-align: left">{CHEVR}<span style="flex: 1; font-size: 16px; font-weight: 700">{{{{g.name}}}}</span><span style="font-size: 14px; color: #6B6259; font-variant-numeric: tabular-nums">{{{{g.count}}}}</span></button><sc-for list="{{{{g.items}}}}" as="r" hint-placeholder-count="2">{LROW('r')}</sc-for></sc-for></div></sc-if>"""
FLAT = f"""<sc-if value="{{{{isFlat}}}}" hint-placeholder-val="{{{{false}}}}"><div style="border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><sc-for list="{{{{flat}}}}" as="r" hint-placeholder-count="3">{LROW('r')}</sc-for><sc-if value="{{{{empty}}}}" hint-placeholder-val="{{{{false}}}}"><div style="padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center"><span style="font-size: 16px; font-weight: 600">{{{{emptyLine}}}}</span><button type="button" onClick="{{{{clearQ}}}}" style="height: 40px; padding: 0 16px; border: 0; border-radius: 9999px; background: #EFE8DF; font-size: 15px; font-weight: 600; color: #1A1612">Show all progressions</button></div></sc-if></div></sc-if>"""
FILTBODY = f"""<div style="display: flex; flex-direction: column; gap: 4px">{LAB('Sort by')}<sc-for list="{{{{sorts}}}}" as="s" hint-placeholder-count="3"><button type="button" onClick="{{{{s.pick}}}}" style="height: 48px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; padding: 0 8px; font-size: 16px; color: #1A1612; text-align: left"><span style="flex: 1">{{{{s.l}}}}</span><span style="color: #E8762F; font-weight: 700">{{{{s.mark}}}}</span></button></sc-for></div><div style="display: flex; flex-direction: column; gap: 8px">{LAB('Key')}<div style="display: flex; gap: 8px; flex-wrap: wrap"><sc-for list="{{{{kindChips}}}}" as="k" hint-placeholder-count="2"><button type="button" aria-pressed="{{{{k.on}}}}" onClick="{{{{k.pick}}}}" style="height: 40px; padding: 0 14px; border: 0; border-radius: 9999px; background: {{{{k.bg}}}}; color: {{{{k.fg}}}}; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600">{{{{k.l}}}}</button></sc-for></div></div><div style="display: flex; gap: 10px; padding-top: 6px"><button type="button" onClick="{{{{reset}}}}" style="flex: 1; height: 48px; border: 0; border-radius: 12px; background: #EFE8DF; font-size: 16px; font-weight: 600; color: #1A1612">Reset</button><button type="button" onClick="{{{{closeAll}}}}" style="flex: 2; height: 48px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 700">{{{{showN}}}}</button></div>"""
ADDBODY = f"""<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{PROW('Type numerals or chords', 'I V vi IV, or C G Am F')}{PROW('Build from chords', 'Tap chords in a key, one after another')}{PROW('New folder', 'Arrange your progressions your way', True)}</div>"""
MENUBODY = """<sc-for list="{{['Select', 'Arrange', 'Hidden progressions']}}" as="m" hint-placeholder-count="3"><button type="button" style="height: 44px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; padding: 0 12px; font-size: 16px; color: #1A1612; text-align: left">{{m}}</button></sc-for>"""
LBAR = f"""<button type="button" aria-label="Back to Practice" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">Progressions</h1><button type="button" aria-label="More" aria-expanded="{{{{menuOn}}}}" onClick="{{{{toggleMenu}}}}" style="{RB}">{MORE}</button>"""
FAB = """<button type="button" aria-label="Add a progression" aria-expanded="{{addOn}}" onClick="{{openAdd}}" style="position: absolute; right: 20px; bottom: 34px; z-index: 50; width: 58px; height: 58px; border: 0; border-radius: 9999px; background: #1A1612; color: #FFFFFF; box-shadow: 0 8px 20px -6px rgba(26,22,18,0.45); display: flex; align-items: center; justify-content: center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button>"""

lib_phone = HEAD % 'Progressions, phone' + f"""<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
<header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px">{LBAR}</header>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 6px 16px 110px; display: flex; flex-direction: column; gap: 12px">
{SEARCHROW}{PLACES}{LEGEND}{GROUPS}{FLAT}
</main>
{FAB}
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #1A1612; z-index: 90"></div>
{sheet_phone('filtOn', 'Sort and filter', FILTBODY)}
{sheet_phone('addOn', 'Add', ADDBODY)}
<sc-if value="{{{{menuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" style="position: absolute; right: 12px; top: 104px; z-index: 61; width: 230px; border-radius: 14px; background: #FFFFFF; padding: 6px; box-shadow: {POP}; display: flex; flex-direction: column">{MENUBODY}</div></sc-if>
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":450,"height":920}}}}'>
const SH = '{SH}';
{LIBJS}
</script>
</body>
</html>
"""
open(OUT + 'Progressions.dc.html', 'w').write(lib_phone)


TROW = lambda lst: f"""<sc-for list="{{{{{lst}}}}}" as="t" hint-placeholder-count="4"><button type="button" onClick="{{{{t.pick}}}}" style="height: 40px; border: 0; border-radius: 10px; background: {{{{t.bg}}}}; display: flex; align-items: center; padding: 0 12px; color: #1A1612; font-size: 15px; font-weight: {{{{t.w}}}}; text-align: left"><span style="flex: 1">{{{{t.l}}}}</span><span style="font-size: 13px; color: #6B6259; font-variant-numeric: tabular-nums">{{{{t.n}}}}</span></button></sc-for>"""
TREECOL = f"""<nav aria-label="Progressions library" class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; padding-bottom: 20px">{TROW('tree')}<span style="margin: 14px 12px 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6B6259">Styles</span>{TROW('styles')}<button type="button" onClick="{{{{openAdd}}}}" style="margin-top: 6px; height: 40px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; gap: 8px; padding: 0 12px; color: #6B6259; font-size: 15px; text-align: left">+ New folder</button></nav>"""
TROWL = f"""<div style="display: grid; grid-template-columns: minmax(0, 1fr) 470px 52px; align-items: center; gap: 16px; min-height: 64px; padding: 6px 6px 6px 18px; box-shadow: inset 0 -1px 0 #F1EBE3"><div style="min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{r.name}}}}</span><span style="font-size: 13px; color: #6B6259; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.line}}}}</span></div><div style="display: flex; flex-wrap: wrap; gap: 4px"><sc-for list="{{{{r.chips}}}}" as="c" hint-placeholder-count="4"><span style="height: 26px; min-width: 28px; padding: 0 8px; box-sizing: border-box; border-radius: 7px; background: {{{{c.bg}}}}; color: {{{{c.fg}}}}; display: inline-flex; align-items: center; justify-content: center; font-family: 'Instrument Serif', Georgia, serif; font-size: 17px">{{{{c.t}}}}</span></sc-for><span style="font-size: 13px; color: #6B6259; align-self: center">{{{{r.more}}}}</span></div><button type="button" aria-label="Favourite" aria-pressed="{{{{r.heart}}}}" onClick="{{{{r.toggle}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center">{HEART.replace('{{FILL}}', '{{r.hfill}}').replace('{{STROKE}}', '{{r.hstroke}}')}</button></div>"""
TABLE = f"""<div style="border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><div style="display: grid; grid-template-columns: minmax(0, 1fr) 470px 52px; gap: 16px; padding: 10px 6px 10px 18px; box-shadow: inset 0 -1px 0 #E9E2D8; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6B6259"><span>Name</span><span>Chords</span><span></span></div><sc-if value="{{{{isFlat}}}}" hint-placeholder-val="{{{{false}}}}"><sc-for list="{{{{flat}}}}" as="r" hint-placeholder-count="6">{TROWL}</sc-for><sc-if value="{{{{empty}}}}" hint-placeholder-val="{{{{false}}}}"><div style="padding: 28px; text-align: center; font-size: 16px; font-weight: 600">{{{{emptyLine}}}}</div></sc-if></sc-if><sc-if value="{{{{notFlat}}}}" hint-placeholder-val="{{{{true}}}}"><sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="8"><button type="button" aria-expanded="{{{{g.isOpen}}}}" onClick="{{{{g.toggle}}}}" style="width: 100%; height: 46px; border: 0; background: #FBF8F3; box-shadow: inset 0 -1px 0 #F1EBE3; display: flex; align-items: center; gap: 10px; padding: 0 18px; color: #1A1612; text-align: left">{CHEVR}<span style="flex: 1; font-size: 15px; font-weight: 700">{{{{g.name}}}}</span><span style="font-size: 14px; color: #6B6259">{{{{g.count}}}}</span></button><sc-for list="{{{{g.items}}}}" as="r" hint-placeholder-count="2">{TROWL}</sc-for></sc-for></sc-if></div>"""

lib_laptop = HEAD % 'Progressions, laptop' + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{SIDE}
<div style="position: relative; min-width: 0; display: flex; flex-direction: column">
<header style="flex: none; height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 40px">{LBAR.replace('<h1 style="flex: 1;', '<h1 style="flex: none;')}<div style="flex: 1"></div><button type="button" aria-expanded="{{{{addOn}}}}" onClick="{{{{openAdd}}}}" style="height: 44px; padding: 0 18px; border: 0; border-radius: 9999px; background: #1A1612; color: #FFFFFF; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>Add</button></header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: 240px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); gap: 28px; padding: 4px 40px 0">{TREECOL}<main class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-bottom: 30px"><div style="display: flex; align-items: center; gap: 16px"><h2 style="flex: none; margin: 0; font-size: 20px; font-weight: 700">{{{{listTitle}}}}</h2><div style="flex: 1; min-width: 0">{SEARCHROW}</div></div>{LEGEND}{TABLE}</main></div>
<sc-if value="{{{{filtOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Sort and filter" style="position: absolute; right: 40px; top: 136px; z-index: 61; width: 360px; box-sizing: border-box; border-radius: 16px; background: #FFFFFF; padding: 14px; box-shadow: {POP}; display: flex; flex-direction: column; gap: 12px">{FILTBODY}</div></sc-if>
<sc-if value="{{{{addOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Add" style="position: absolute; right: 40px; top: 74px; z-index: 61; width: 360px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 12px; box-shadow: {POP}">{ADDBODY}</div></sc-if>
<sc-if value="{{{{menuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" style="position: absolute; left: 230px; top: 64px; z-index: 61; width: 230px; border-radius: 14px; background: #FFFFFF; padding: 6px; box-shadow: {POP}; display: flex; flex-direction: column">{MENUBODY}</div></sc-if>
</div>
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
const SH = '{SH}';
{LIBJS}
</script>
</body>
</html>
"""
open(OUT + 'ProgressionsLaptop.dc.html', 'w').write(lib_laptop)

# ---------- a progression's page ----------
TILES = """<div style="display: grid; grid-template-columns: {{cols}}; gap: 16px 22px"><sc-for list="{{tiles}}" as="t" hint-placeholder-count="10"><div style="position: relative; min-width: 0"><button type="button" aria-pressed="{{t.on}}" onClick="{{t.pick}}" style="width: 100%; height: 76px; border: 0; border-radius: 14px; background: {{t.bg}}; color: {{t.fg}}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 26px; line-height: 1">{{t.rn}}</span><span style="font-size: 15px; font-weight: 700">{{t.sym}}</span></button><sc-if value="{{t.arrow}}" hint-placeholder-val="{{true}}"><span aria-hidden="true" style="position: absolute; right: -22px; top: 18px; width: 22px; display: flex; flex-direction: column; align-items: center; font-size: 9.5px; line-height: 1.15; color: #6B6259; font-weight: 600"><svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#8A8178" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h11M8 1.5 12 5 8 8.5"></path></svg><span>{{t.m1}}</span><span>{{t.m2}}</span></span></sc-if></div></sc-for></div>"""
USED = """<div style="display: flex; flex-direction: column; gap: 8px"><span aria-live="polite" style="font-size: 15px; font-weight: 600">{{selLine}}</span><div style="display: flex; flex-wrap: wrap; gap: 6px 12px"><sc-for list="{{used}}" as="l" hint-placeholder-count="3"><span style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #4A433C"><span style="width: 12px; height: 12px; border-radius: 4px; background: {{l.bg}}; box-shadow: inset 0 0 0 1px {{l.fg}}"></span>{{l.l}}</span></sc-for></div></div>"""
PHEAD = lambda fs: f"""<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6B6259">{{{{styleName}}}}</span><h1 style="margin: 0; font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: {fs}px; line-height: 1">{{{{name}}}}</h1><span style="font-size: 16px; color: #4A433C">{{{{line}}}}</span></div>"""
KEYROW = f"""<div style="display: flex; flex-wrap: wrap; gap: 12px 10px; align-items: flex-end"><div style="flex: 1 1 150px; min-width: 0; display: flex">{PICK('Key', 'keyLabel', 'openKey', 'keyOn')}</div><sc-if value="{{{{hasModes}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: 1 1 170px; min-width: 0; display: flex">{SEGBAR('Numerals of', 'modeSeg', 42)}</div></sc-if><div style="flex: 1 1 200px; min-width: 0; display: flex">{SEGBAR('Voicing', 'voiceSeg', 42)}</div></div>"""
ABOUT = f"""<section style="display: flex; flex-direction: column; gap: 8px">{H2('About this progression')}<p style="margin: 0 2px; font-size: 15px; line-height: 1.5; color: #4A433C; max-width: 62ch">{{{{about}}}}</p></section>"""
PPRACT = f"""<section style="display: flex; flex-direction: column; gap: 8px">{H2('Practise it')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{PROW('In all 12 keys', 'Round the circle of fifths, one key at a time')}{PROW('In the Chord player', 'With a band, in any style', True)}</div></section>"""
SIMILAR = f"""<section style="display: flex; flex-direction: column; gap: 8px">{H2('More like it')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><sc-for list="{{{{similar}}}}" as="s" hint-placeholder-count="4"><button type="button" onClick="{{{{s.pick}}}}" style="width: 100%; min-height: 58px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 #F1EBE3; display: flex; align-items: center; gap: 12px; padding: 8px 14px; color: #1A1612; text-align: left"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{s.name}}}}</span><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 16px; color: #6B6259">{{{{s.line}}}}</span></span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8178" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg></button></sc-for></div></section>"""
PACT = """<div style="display: flex; gap: 10px"><button type="button" aria-pressed="{{sounding}}" onClick="{{togglePlay}}" style="flex: 1; min-width: 0; height: 48px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 700"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>{{playLabel}}</button><div role="group" aria-label="Tempo" style="flex: none; height: 48px; display: flex; align-items: center; border-radius: 12px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF"><button type="button" aria-label="Slower" onClick="{{bpmDown}}" style="width: 42px; height: 48px; border: 0; background: transparent; font-size: 20px; color: #1A1612">−</button><span style="width: 62px; text-align: center; display: flex; flex-direction: column; line-height: 1.1"><span style="font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums">{{bpm}}</span><span style="font-size: 11px; color: #6B6259">BPM</span></span><button type="button" aria-label="Faster" onClick="{{bpmUp}}" style="width: 42px; height: 48px; border: 0; background: transparent; font-size: 20px; color: #1A1612">+</button></div></div>"""
PBAR = f"""<button type="button" aria-label="Back to Progressions" style="{RB}">{BACK}</button><div style="flex: 1"></div><button type="button" aria-label="Favourite" aria-pressed="{{{{heart}}}}" onClick="{{{{toggleHeart}}}}" style="{RB}">{HEART.replace('{{FILL}}', '{{hfill}}').replace('{{STROKE}}', '{{hstroke}}')}</button><button type="button" aria-label="More" aria-expanded="{{{{menuOn}}}}" onClick="{{{{toggleMenu}}}}" style="{RB}">{MORE}</button>"""
PMENU = """<sc-for list="{{['Edit a copy', 'Add to folder', 'Share', 'Hide from the library']}}" as="m" hint-placeholder-count="4"><button type="button" style="height: 44px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; padding: 0 12px; font-size: 16px; color: #1A1612; text-align: left">{{m}}</button></sc-for>"""
ROOTGRID = """<div role="radiogroup" aria-label="Key" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{roots}}" as="r" hint-placeholder-count="12"><button type="button" role="radio" aria-checked="{{r.on}}" onClick="{{r.pick}}" style="height: 52px; border: 0; border-radius: 12px; background: {{r.bg}}; color: {{r.fg}}; box-shadow: 0 0 0 1px #E2DACF; font-family: 'Instrument Serif', Georgia, serif; font-size: 24px">{{r.r}}</button></sc-for></div>"""

page_phone = HEAD % 'A progression, phone' + f"""<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
<header style="flex: none; height: 52px; display: flex; align-items: center; gap: 8px; padding: 0 12px">{PBAR}</header>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 20px; display: flex; flex-direction: column; gap: 16px">
{PHEAD(38)}{KEYROW}{TILES}{USED}{ABOUT}{PPRACT}{SIMILAR}
</main>
<div style="flex: none; padding: 10px 16px; background: #F7F3EE; box-shadow: 0 -1px 0 #E9E2D8">{PACT}</div>
<div style="flex: none">{KEYS(108, 10)}</div>
<div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18"></div>
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #FFFFFF; z-index: 90"></div>
{sheet_phone('keyOn', 'Key', ROOTGRID)}
<sc-if value="{{{{menuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" style="position: absolute; right: 12px; top: 104px; z-index: 61; width: 240px; border-radius: 14px; background: #FFFFFF; padding: 6px; box-shadow: {POP}; display: flex; flex-direction: column">{PMENU}</div></sc-if>
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":450,"height":920}}}}'>
const SH = '{SH}';
{PAGEJS}
</script>
</body>
</html>
"""
open(OUT + 'Progression.dc.html', 'w').write(page_phone)

page_laptop = HEAD % 'A progression, laptop' + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{SIDE}
<div style="position: relative; min-width: 0; display: flex; flex-direction: column">
<header style="flex: none; height: 72px; display: flex; align-items: center; gap: 10px; padding: 0 40px">{PBAR}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 380px; grid-template-rows: minmax(0, 1fr); gap: 36px; padding: 0 40px">
<div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding-bottom: 20px">{PHEAD(56)}{KEYROW}{TILES.replace('gap: 16px 22px', 'gap: 18px 44px').replace('right: -22px; top: 18px; width: 22px', 'right: -44px; top: 20px; width: 44px').replace('font-size: 9.5px', 'font-size: 12px')}{USED}<div style="width: 440px">{PACT}</div></div>
<div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; padding-bottom: 20px">{ABOUT}{PPRACT}{SIMILAR}</div>
</div>
<div style="flex: none">{KEYS(190, 13)}</div>
<sc-if value="{{{{anyOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div></sc-if>
{pop('keyOn', 'left: 40px; top: 300px', 320, 'Key', ROOTGRID)}
<sc-if value="{{{{menuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="menu" style="position: absolute; right: 40px; top: 64px; z-index: 61; width: 240px; border-radius: 14px; background: #FFFFFF; padding: 6px; box-shadow: {POP}; display: flex; flex-direction: column">{PMENU}</div></sc-if>
</div>
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
const SH = '{SH}';
{PAGEJS}
</script>
</body>
</html>
"""
open(OUT + 'ProgressionLaptop.dc.html', 'w').write(page_laptop)
print('progressions ok')
