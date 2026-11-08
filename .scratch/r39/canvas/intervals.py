# Intervals, phone and laptop, on the Practice canvas. Reuses chords.py's helpers. Run: python3 -I intervals.py
G = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/chords.py').read(), G)
OUT, HEAD, STATUS, SIDE, LAPFRAME_TOP, SH, POP = G['OUT'], G['HEAD'], G['STATUS'], G['SIDE'], G['LAPFRAME_TOP'], G['SH'], G['POP']
PICK, SEGBAR, LAB, H2, PROW, SROW, RB, BACK, GEAR, KEYS, sheet_phone, pop = (G[k] for k in 'PICK SEGBAR LAB H2 PROW SROW RB BACK GEAR KEYS sheet_phone pop'.split())
PHONE_FRAME, LAPTOP_FRAME = G['PHONE_FRAME'], G['LAPTOP_FRAME']

JS = r'''
const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const ROOTL = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6];
const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NAT = [0, 2, 4, 5, 7, 9, 11];
const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };
// abbr, name, semitones, letter steps, meaning, up songs, down songs
const IV = [
  ['P1', 'Unison', 0, 0, 'The same note twice.', 'Jingle Bells · Happy Birthday', ''],
  ['m2', 'Minor second', 1, 1, 'A half step: the tightest clash, the leading note to the tonic.', 'Jaws (theme) · White Christmas', 'Für Elise · Joy to the World'],
  ['M2', 'Major second', 2, 1, 'A whole step: one step of the scale.', 'Frère Jacques · Silent Night', 'Mary Had a Little Lamb · Yesterday'],
  ['m3', 'Minor third', 3, 2, 'The 3rd of a minor chord: darker.', 'Greensleeves · Smoke on the Water', 'Hey Jude · The Star-Spangled Banner'],
  ['M3', 'Major third', 4, 2, 'The 3rd of a major chord: brighter.', 'When the Saints Go Marching In', 'Beethoven’s Fifth Symphony'],
  ['P4', 'Perfect fourth', 5, 3, 'Open and stable: the subdominant over the tonic.', 'Here Comes the Bride · Amazing Grace', 'Eine kleine Nachtmusik'],
  ['A4', 'Augmented fourth', 6, 3, 'The tritone: three whole steps, the tension in a dominant 7th.', 'The Simpsons (theme) · Maria', 'Black Sabbath'],
  ['d5', 'Diminished fifth', 6, 4, 'The tritone spelled as a 5th: the 5th of a diminished chord.', 'The Simpsons (theme) · Maria', 'Black Sabbath'],
  ['P5', 'Perfect fifth', 7, 4, 'The most open consonance: the root and 5th of every triad.', 'Twinkle, Twinkle, Little Star · Star Wars', 'The Flintstones · Minuet in G'],
  ['m6', 'Minor sixth', 8, 5, 'Soft and sad: a major 3rd turned upside down.', 'The Entertainer (chorus)', 'Love Story (theme)'],
  ['M6', 'Major sixth', 9, 5, 'Warm and open: a minor 3rd turned upside down.', 'My Bonnie Lies over the Ocean', 'Nobody Knows the Trouble I’ve Seen'],
  ['m7', 'Minor seventh', 10, 6, 'The 7th of a dominant chord: it wants to resolve.', 'Somewhere (West Side Story) · Star Trek', 'Watermelon Man · An American in Paris'],
  ['M7', 'Major seventh', 11, 6, 'A half step under the octave: the 7th of a major 7th chord.', 'Take On Me (chorus) · Bali Ha’i', 'I Love You (Cole Porter)'],
  ['P8', 'Octave', 12, 7, 'The same note an octave higher.', 'Over the Rainbow · Singin’ in the Rain', 'Willow Weep for Me']
];
const IVC = [
  ['m9', 'Minor ninth', 13, 8, 'A minor 2nd an octave higher: the ♭9 of a dominant chord.'],
  ['M9', 'Major ninth', 14, 8, 'A major 2nd an octave higher: the 9th of a chord.'],
  ['A9', 'Augmented ninth', 15, 8, 'An augmented 2nd an octave higher: the ♯9 of a blues dominant.'],
  ['P11', 'Perfect eleventh', 17, 10, 'A 4th an octave higher: the 11th of a chord.'],
  ['A11', 'Augmented eleventh', 18, 10, 'An augmented 4th an octave higher: the ♯11 of a Lydian chord.'],
  ['m13', 'Minor thirteenth', 20, 12, 'A minor 6th an octave higher: the ♭13 of a dominant chord.'],
  ['M13', 'Major thirteenth', 21, 12, 'A major 6th an octave higher: the 13th of a chord.']
].map((x) => x.concat(['', '']));
function spell(m, letter) {
  let best = null;
  for (let o = 1; o < 9; o++) { const n = 12 * (o + 1) + NAT[letter]; if (best === null || Math.abs(m - n) < Math.abs(best.d)) best = { o, d: m - n }; }
  return { letter, oct: best.o, acc: best.d, steps: best.o * 7 + letter, name: LET[letter] + ACC[String(best.d)] };
}
const LO = 48, HI = 84;
function keyboard(a, b, sounding) {
  const whites = [];
  for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) whites.push(m); }
  const W = 100 / whites.length;
  const col = (m) => m === a ? (sounding ? '#C9561A' : '#E8762F') : m === b ? (sounding ? '#E8762F' : '#F7C9A5') : '';
  const ws = whites.map((m, i) => ({ x: (i * W).toFixed(3) + '%', w: W.toFixed(3) + '%', fill: col(m) || '#FFFFFF', lab: m === 60 ? 'C4' : '' }));
  const bs = [];
  for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) continue; const i = whites.indexOf(m - 1); bs.push({ x: ((i + 1) * W - W * 0.3).toFixed(3) + '%', w: (W * 0.6).toFixed(3) + '%', fill: col(m) || '#1A1612' }); }
  return { whites: ws, blacks: bs };
}
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {};
    const set = (o) => this.setState(o);
    const root = st.root ?? 0, way = st.way ?? 'up', set2 = st.set ?? 'simple', sel = st.sel ?? 'P5', sheet = st.sheet || null, page = st.page || null, sounding = st.sounding ?? false, order = st.order ?? 'list', speed = st.speed ?? 'medium';
    const list = set2 === 'simple' ? IV : IVC;
    const cur = list.find((x) => x[0] === sel) || list[0];
    const a = 60 + root, b = a + cur[2];
    const sa = spell(a, ROOTL[root]), sb = spell(b, (ROOTL[root] + cur[3]) % 7);
    if (cur[3] >= 7) sb.steps = sa.steps + cur[3];
    const low = way === 'down' ? sb : sa, high = way === 'down' ? sa : sb;
    // staff: treble, E4 = steps 30 on y 64, 4.5 per step
    const y = (s) => 64 - (s - 30) * 4.5;
    const notesOn = way === 'together' ? [{ s: sa, x: 96 }, { s: sb, x: cur[2] <= 2 && cur[2] > 0 ? 107 : 96 }] : (way === 'up' ? [{ s: sa, x: 82 }, { s: sb, x: 132 }] : [{ s: sb, x: 82 }, { s: sa, x: 132 }]);
    const notes = notesOn.map((n) => ({ x: n.x, y: y(n.s.steps), acc: ACC[String(n.s.acc)], ax: n.x - 15, ay: y(n.s.steps) + 4 }));
    const ledgers = [];
    notesOn.forEach((n) => { for (let q = 28; q >= n.s.steps; q -= 2) ledgers.push({ x1: n.x - 9, x2: n.x + 9, y: y(q) }); for (let q = 40; q <= n.s.steps; q += 2) ledgers.push({ x1: n.x - 9, x2: n.x + 9, y: y(q) }); });
    const kb = keyboard(a, b, sounding);
    const seg = (on) => ({ bg: on ? '#FFFFFF' : 'transparent', sh: on ? '0 0 0 1px rgba(26,22,18,0.06), 0 1px 3px rgba(26,22,18,0.12)' : 'none', w: on ? 700 : 500 });
    const semis = (n) => n + (n === 1 ? ' semitone' : ' semitones');
    return {
      SH, rootLabel: ROOTS[root], name: cur[1], abbr: cur[0], semis: semis(cur[2]), meaning: cur[4], pair: sa.name + ' to ' + sb.name,
      up: cur[5], down: cur[6], hasSongs: !!cur[5], noSongs: !cur[5],
      notes, ledgers,
      rows: list.map((x) => { const on = x[0] === cur[0]; const s2 = spell(a + x[2], (ROOTL[root] + x[3]) % 7); return { abbr: x[0], name: x[1], semis: semis(x[2]), to: ROOTS[root] + '–' + s2.name, on, bg: on ? '#FDF1E8' : '#FFFFFF', ring: on ? 'inset 0 0 0 1.5px #E8762F' : 'inset 0 -1px 0 #F1EBE3', pick: () => set({ sel: x[0], sounding: true }) }; }),
      waySeg: [['up', 'Ascending'], ['down', 'Descending'], ['together', 'Harmonic']].map(([id, l]) => ({ l, on: way === id, ...seg(way === id), pick: () => set({ way: id }) })),
      setSeg: [['simple', 'Simple'], ['compound', 'Compound']].map(([id, l]) => ({ l, on: set2 === id, ...seg(set2 === id), pick: () => set({ set: id, sel: id === 'simple' ? 'P5' : 'M9' }) })),
      whites: kb.whites, blacks: kb.blacks, fullName: cur[1] + ' from ' + ROOTS[root],
      sounding, playLabel: sounding ? 'Stop' : 'Play ' + cur[0], togglePlay: () => set({ sounding: !sounding }),
      rootOn: sheet === 'root', anyOn: !!sheet, openRoot: () => set({ sheet: sheet === 'root' ? null : 'root' }), closeAll: () => set({ sheet: null }),
      roots: ROOTS.map((r, i) => ({ r, on: i === root, bg: i === root ? '#1A1612' : '#FFFFFF', fg: i === root ? '#FFFFFF' : '#1A1612', pick: () => set({ root: i, sheet: null }) })),
      settingsOn: page === 'settings', openSettings: () => set({ page: 'settings', sheet: null }), closeSettings: () => set({ page: null }),
      orderSeg: [['list', 'In order'], ['shuffle', 'Shuffled']].map(([id, l]) => ({ l, on: order === id, ...seg(order === id), pick: () => set({ order: id }) })),
      speedSeg: [['slow', 'Slow'], ['medium', 'Medium'], ['fast', 'Fast']].map(([id, l]) => ({ l, on: speed === id, ...seg(speed === id), pick: () => set({ speed: id }) }))
    };
  }
}
'''

STAFF = lambda w, h: f"""<svg viewBox="0 0 170 110" width="{w}" height="{h}" role="img" aria-label="{{{{name}}}} on the staff" style="flex: none"><path d="M6 28H164M6 37H164M6 46H164M6 55H164M6 64H164M6 28V64M164 28V64" stroke="#1A1612" stroke-width="0.8" fill="none"></path><text x="9" y="72" font-family="Noto Music" font-size="46" fill="#1A1612">𝄞</text><sc-for list="{{{{ledgers}}}}" as="l" hint-placeholder-count="0"><line x1="{{{{l.x1}}}}" x2="{{{{l.x2}}}}" y1="{{{{l.y}}}}" y2="{{{{l.y}}}}" stroke="#1A1612" stroke-width="0.9"></line></sc-for><sc-for list="{{{{notes}}}}" as="n" hint-placeholder-count="2"><ellipse cx="{{{{n.x}}}}" cy="{{{{n.y}}}}" rx="5.6" ry="4" transform="rotate(-20 {{{{n.x}}}} {{{{n.y}}}})" fill="none" stroke="#1A1612" stroke-width="1.6"></ellipse><text x="{{{{n.ax}}}}" y="{{{{n.ay}}}}" font-family="Noto Music" font-size="15" text-anchor="middle" fill="#1A1612">{{{{n.acc}}}}</text></sc-for></svg>"""

HERO = lambda fs, w, h: f"""<div style="border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; padding: 16px 12px 14px 18px; display: flex; flex-direction: column; gap: 10px"><div style="display: flex; align-items: center; gap: 8px"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: {fs}px; line-height: 1">{{{{name}}}}</span><span style="font-size: 15px; font-weight: 600">{{{{abbr}}}} · {{{{semis}}}}</span><span style="font-size: 14px; color: #6B6259">{{{{pair}}}}</span></div>{STAFF(w, h)}</div><span style="font-size: 15px; color: #4A433C">{{{{meaning}}}}</span><sc-if value="{{{{hasSongs}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 6px; padding-top: 10px; box-shadow: inset 0 1px 0 #F1EBE3"><div style="display: flex; gap: 10px; font-size: 14px"><span style="flex: none; width: 46px; font-weight: 700; color: #6B6259">Up</span><span>{{{{up}}}}</span></div><sc-if value="{{{{down}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; gap: 10px; font-size: 14px"><span style="flex: none; width: 46px; font-weight: 700; color: #6B6259">Down</span><span>{{{{down}}}}</span></div></sc-if></div></sc-if></div>"""

ROWS = """<div role="listbox" aria-label="Intervals" style="border-radius: 14px; background: #FFFFFF; box-shadow: SHX; overflow: hidden"><sc-for list="{{rows}}" as="r" hint-placeholder-count="14"><button type="button" role="option" aria-selected="{{r.on}}" onClick="{{r.pick}}" style="width: 100%; min-height: 54px; border: 0; background: {{r.bg}}; box-shadow: {{r.ring}}; display: flex; align-items: center; gap: 12px; padding: 0 14px; color: #1A1612; text-align: left"><span style="flex: none; width: 40px; font-size: 16px; font-weight: 700; color: #4A433C">{{r.abbr}}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column"><span style="font-size: 16px; font-weight: 600">{{r.name}}</span><span style="font-size: 13px; color: #6B6259">{{r.semis}}</span></span><span style="font-size: 14px; color: #4A433C; font-variant-numeric: tabular-nums">{{r.to}}</span></button></sc-for></div>""".replace('SHX', SH)

PICKS = f"""<div style="display: flex; gap: 10px">{PICK('From', 'rootLabel', 'openRoot', 'rootOn', 1, True)}<div style="flex: 3.2; min-width: 0; display: flex">{SEGBAR('Play as', 'waySeg', 48)}</div></div>"""
EAR = f"""<section style="display: flex; flex-direction: column; gap: 8px">{H2('Train your ear')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{PROW('Intervals by ear', 'Hear one, name it · in the Quiz', True)}</div></section>"""
ACTIONS = """<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px"><button type="button" aria-pressed="{{sounding}}" onClick="{{togglePlay}}" style="height: 48px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 700"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>{{playLabel}}</button><button type="button" style="height: 48px; border: 0; border-radius: 12px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; color: #1A1612; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 600"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h10M4 12h10M4 18h7M17 14v6l4-3Z"></path></svg>Play all</button></div>"""
ROOTGRID = """<div role="radiogroup" aria-label="From" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{roots}}" as="r" hint-placeholder-count="12"><button type="button" role="radio" aria-checked="{{r.on}}" onClick="{{r.pick}}" style="height: 52px; border: 0; border-radius: 12px; background: {{r.bg}}; color: {{r.fg}}; box-shadow: 0 0 0 1px #E2DACF; font-family: 'Instrument Serif', Georgia, serif; font-size: 24px">{{r.r}}</button></sc-for></div>"""
BAR = f"""<button type="button" aria-label="Back to Practice" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">Intervals</h1><button type="button" aria-label="Interval settings" onClick="{{{{openSettings}}}}" style="{RB}">{GEAR}</button>"""
SETTINGS_BODY = f"""<div style="display: flex; flex-direction: column; gap: 18px"><div style="display: flex">{SEGBAR('Play all', 'orderSeg', 40)}</div><div style="display: flex">{SEGBAR('Speed', 'speedSeg', 40)}</div><div style="display: flex; flex-direction: column; gap: 6px">{LAB('On-screen piano')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{SROW('All piano settings', '')}</div></div></div>"""
LISTHEAD = f"""<div style="display: flex">{SEGBAR('Intervals', 'setSeg', 40)}</div>"""

phone = HEAD % 'Intervals, phone' + f"""<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
<header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px">{BAR}</header>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 6px 16px 20px; display: flex; flex-direction: column; gap: 14px">
{PICKS}
{HERO(34, 150, 97)}
{LISTHEAD}
{ROWS}
{EAR}
</main>
<div style="flex: none; padding: 10px 16px; background: #F7F3EE; box-shadow: 0 -1px 0 #E9E2D8">{ACTIONS}</div>
<div style="flex: none">{KEYS(108, 10)}</div>
<div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18"></div>
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #FFFFFF; z-index: 90"></div>
{sheet_phone('rootOn', 'From', ROOTGRID)}
<sc-if value="{{{{settingsOn}}}}" hint-placeholder-val="{{{{false}}}}"><section aria-label="Interval settings" style="position: absolute; inset: 0; z-index: 70; background: #F7F3EE; display: flex; flex-direction: column"><div style="flex: none; height: 54px; position: relative">{STATUS}</div><header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px"><button type="button" aria-label="Back to Intervals" onClick="{{{{closeSettings}}}}" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">Interval settings</h1></header><div style="padding: 10px 16px">{SETTINGS_BODY}</div></section></sc-if>
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":450,"height":920}}}}'>
const SH = '{SH}';
{JS}
</script>
</body>
</html>
"""
open(OUT + 'Intervals.dc.html', 'w').write(phone)

laptop = HEAD % 'Intervals, laptop' + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{SIDE}
<div style="position: relative; min-width: 0; display: flex; flex-direction: column">
<header style="flex: none; height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 40px">{BAR}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: 440px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); gap: 32px; padding: 0 40px">
<div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-bottom: 20px">{LISTHEAD}{ROWS}</div>
<div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding-bottom: 20px">{PICKS}{HERO(64, 300, 194)}<div style="width: 420px">{ACTIONS}</div>{EAR}</div>
</div>
<div style="flex: none">{KEYS(200, 13)}</div>
<sc-if value="{{{{anyOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div></sc-if>
{pop('rootOn', 'left: 512px; top: 150px', 320, 'From', ROOTGRID)}
<sc-if value="{{{{settingsOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSettings}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Interval settings" style="position: absolute; right: 40px; top: 66px; z-index: 61; width: 380px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 16px; box-shadow: {POP}; display: flex; flex-direction: column; gap: 12px"><h2 style="margin: 0 2px; font-size: 18px; font-weight: 700">Interval settings</h2>{SETTINGS_BODY}</div></sc-if>
</div>
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
const SH = '{SH}';
{JS}
</script>
</body>
</html>
"""
open(OUT + 'IntervalsLaptop.dc.html', 'w').write(laptop)
print('intervals ok')
