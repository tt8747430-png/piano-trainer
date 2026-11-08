# Exercises on the Practice canvas: the library (Accompaniment's, one implementation) and an exercise's page. Run: python3 -I exercises.py
G = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/chords.py').read(), G)
A = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/accompaniment.py').read(), A)
OUT, HEAD, STATUS, SIDE, LAPFRAME_TOP, SH, POP = G['OUT'], G['HEAD'], G['STATUS'], G['SIDE'], G['LAPFRAME_TOP'], G['SH'], G['POP']
PICK, SEGBAR, LAB, RB, BACK, GEAR, KEYS, sheet_phone = (G[k] for k in 'PICK SEGBAR LAB RB BACK GEAR KEYS sheet_phone'.split())
PHONE_FRAME, LAPTOP_FRAME = G['PHONE_FRAME'], G['LAPTOP_FRAME']
HEART, MORE, PLAYI = A['HEART'], A['MORE'], A['PLAYI']

# The library: Accompaniment's JS with the exercises' data
JS = A['JS']
start, end = JS.index('const PAT = ['), JS.index('// a roll:')
EXDATA = r'''const PAT = [
  ['five-finger', 'technique', 'Finger technique', 'Five-finger position', 'One finger on each of a key’s first five notes, up and down', 1, 'Technique', 'Straight', 'runup', 'Keep each finger over its key and play from the knuckle, the wrist still.'],
  ['hanon', 'technique', 'Finger technique', 'Hanon', 'Nos. 1 to 20 of The Virtuoso Pianist: a figure climbs two octaves and comes back', 2, 'Technique', 'Straight', 'arpup', 'Lift each finger high and play it firmly, the hand quiet. Start slowly; raise the tempo only when every note is even.'],
  ['sixth-diminished', 'barryHarris', 'Barry Harris', '6th-diminished scale', 'Eight notes to the octave: the 6th chord’s notes on the beats, the diminished 7th’s between them', 3, 'Scales', 'Swing', 'rundown', 'Play it down from the top in 8ths so the 6th chord’s notes fall on the beats.'],
  ['sixth-diminished-chords', 'barryHarris', 'Barry Harris', '6th-diminished chords', 'Each note of the 6th-diminished scale with a chord under it, in close position or drop 2', 4, 'Chords', 'Straight', 'block', 'Move the four voices together, the 6th chord and the diminished 7th taking turns.'],
  ['dominant-scale', 'barryHarris', 'Barry Harris', 'Dominant scale down', 'The V7’s scale coming down, with one added half step so the chord’s notes land on the beats', 3, 'Scales', 'Swing', 'rundown', 'Add the half step between the root and the ♭7 so the chord’s notes land on the beats.'],
  ['from-third', 'barryHarris', 'Barry Harris', 'Arpeggios from the 3rd', 'Over a ii–V–I: each chord’s 3-5-7-9, then down the scale into the next chord', 4, 'Arpeggios', 'Swing', 'arp2', 'Start each arpeggio on the chord’s 3rd and come down the scale to the next chord’s 3rd.'],
  ['drop-two', 'barryHarris', 'Barry Harris', 'Drop-2 7ths', 'The key’s 7th chords up and down, with the second note from the top moved to the left hand', 4, 'Chords', 'Straight', 'block', 'Drop the second voice from the top an octave into the left hand; keep the top voice singing.'],
  ['two-five-one-scale', 'jonny', 'Piano With Jonny', '2-5-1 scale', 'The right hand plays the scale in swung 8ths over the left hand’s shells of a ii–V–I', 1, 'Scales', 'Swing', 'swing', 'Swing the 8ths, long-short, the left hand’s shells on the beat.'],
  ['inner-voice', 'jonny', 'Piano With Jonny', 'Inner voice', 'The key’s 7th chords, the 3rd held on top while the 7th steps down to the 6th', 2, 'Chords', 'Straight', 'cliche', 'Hold the top note; let the inner voice move by step.'],
  ['modes', 'jonny', 'Piano With Jonny', 'Modes', 'The scale started from each of its notes in turn, Ionian to Locrian, with the scale’s fingering', 3, 'Scales', 'Straight', 'runup', 'Keep the scale’s fingering whichever note it starts on.'],
  ['rapid-switch', 'jonny', 'Piano With Jonny', 'Rapid switch', 'One unbroken line through all twelve keys, moving round the circle of fifths', 4, 'Scales', 'Straight', 'runup', 'Think one key ahead; the line never stops between keys.'],
  ['pattern-shifting', 'jonny', 'Piano With Jonny', 'Pattern shifting', 'A short figure started again on each degree with its shape kept: a melodic sequence', 4, 'Scales', 'Straight', 'sixths', 'Keep the figure’s shape and fingers as it moves up a degree.']
];
const BOOKS = [['technique', 'Finger technique'], ['barryHarris', 'Barry Harris'], ['jonny', 'Piano With Jonny']];
const STAGES = ['', 'Beginner', 'Intermediate', 'Advanced', 'Professional'];
'''
JS = JS[:start] + EXDATA + JS[end:]
rep = [
    ("const recent = ['w1', 'g2', 't2'];", "const recent = ['hanon', 'two-five-one-scale'];"),
    ("hearts = st.hearts ?? ['w2', 'g2']", "hearts = st.hearts ?? ['drop-two']"),
    ("sel = st.sel ?? null", "sel = st.sel ?? 'hanon'"),
    ("const mine = [['my1', 'mine', 'Mine', 'Sunday', 'Left: walking 8ths · Right: jazz chords off the beat', 2, 'Block chords', 'Swing', 'swing', 'Your own: a walking left hand under offbeat chords.']];",
     "const mine = [['my1', 'mine', 'Mine', 'Warm-up in D', 'Five-finger position, then Hanon 1 and 2, in D', 1, 'Technique', 'Straight', 'runup', 'Your own warm-up.']];"),
    ("lv: [1, 2, 3].map((i) =>", "lv: [1, 2, 3, 4].map((i) =>"),
    ("lvl: 'Level ' + p[5]", "lvl: STAGES[p[5]]"),
    ("[['all', 'All'], ['fav', 'Favourites'], ['recent', 'Recently used'], ['ctp', 'Called to Play'], ['ctp2', 'Called to Play 2'], ['styles', 'Rhythm styles'], ['mine', 'Mine']]",
     "[['all', 'All'], ['fav', 'Favourites'], ['recent', 'Recently used'], ['technique', 'Finger technique'], ['barryHarris', 'Barry Harris'], ['jonny', 'Piano With Jonny'], ['mine', 'Mine']]"),
    ("['recent', 'fav', 'ctp', 'ctp2', 'styles', 'mine'].every", "['recent', 'fav', 'technique', 'barryHarris', 'jonny', 'mine'].every"),
    ("open: allOpen ? [] : ['recent', 'fav', 'ctp', 'ctp2', 'styles', 'mine']", "open: allOpen ? [] : ['recent', 'fav', 'technique', 'barryHarris', 'jonny', 'mine']"),
    ("levels.map((l) => ({ l: 'Level ' + l,", "levels.map((l) => ({ l: STAGES[l],"),
    ("lvChips: [1, 2, 3].map((l) => ({ l: 'Level ' + l + ' · '", "lvChips: [1, 2, 3, 4].map((l) => ({ l: STAGES[l] + ' · '"),
    ("txChips: ['Block chords', 'Broken chords', 'Arpeggio', 'Runs', 'Octaves']", "txChips: ['Technique', 'Scales', 'Arpeggios', 'Chords']"),
    ("[['book', 'As in the book'], ['name', 'Name'], ['level', 'Level']]", "[['book', 'As in the book'], ['name', 'Name'], ['level', 'Level']]"),
    ("return {\n      SH, places,", "return {\n      ...exPage(st, set), SH, places,"),
]
for a, b in rep:
    assert a in JS, a
    JS = JS.replace(a, b)

# The exercise's page (Hanon), its own state
JS = JS.replace('class Component extends DCLogic {', r'''const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const NAT = [0, 2, 4, 5, 7, 9, 11];
function exPage(st, set) {
  const seg = (on) => ({ bg: on ? '#FFFFFF' : 'transparent', sh: on ? '0 0 0 1px rgba(26,22,18,0.06), 0 1px 3px rgba(26,22,18,0.12)' : 'none', w: on ? 700 : 500 });
  const hands = st.hands ?? 'both', rhythm = st.rhythm ?? 'even', no = st.no ?? 1, bpm = st.bpm ?? 60, target = st.target ?? 108, playing = st.playing ?? false, xs = st.xs || null, key = st.key ?? 'C', order = st.order ?? 'fifths';
  const lh = [48, 52, 53, 55, 57], rh = [60, 64, 65, 67, 69];
  const lit = (hands === 'l' ? lh : hands === 'r' ? rh : lh.concat(rh));
  const whites = [], blacks = [];
  const LO = 36, HI = 84; const ws = []; for (let m = LO; m <= HI; m++) if (NAT.includes(m % 12)) ws.push(m);
  const W = 100 / ws.length;
  ws.forEach((m, i) => whites.push({ x: (i * W).toFixed(3) + '%', w: W.toFixed(3) + '%', fill: lit.includes(m) ? (m < 60 ? (playing ? '#7E6BB8' : '#D5CCEC') : (playing ? '#E8762F' : '#F7C9A5')) : '#FFFFFF', lab: m === 60 ? 'C4' : '' }));
  for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) continue; const i = ws.indexOf(m - 1); blacks.push({ x: ((i + 1) * W - W * 0.3).toFixed(3) + '%', w: (W * 0.6).toFixed(3) + '%', fill: '#1A1612' }); }
  return {
    whites, blacks, fullName: 'Hanon No. ' + no,
    exNo: 'No. ' + no, exKey: key + ' major', exOrder: order === 'fifths' ? 'Circle of fifths' : 'Chromatic',
    noDown: () => set({ no: Math.max(1, no - 1) }), noUp: () => set({ no: Math.min(20, no + 1) }),
    handSeg: [['l', 'Left hand'], ['both', 'Both'], ['r', 'Right hand']].map(([id, l]) => ({ l, on: hands === id, ...seg(hands === id), pick: () => set({ hands: id }) })),
    rhySeg: [['even', 'Even'], ['dotted', 'Dotted'], ['reverse', 'Reverse dotted']].map(([id, l]) => ({ l, on: rhythm === id, ...seg(rhythm === id), pick: () => set({ rhythm: id }) })),
    bpm: String(bpm), bpmDown: () => set({ bpm: Math.max(30, bpm - 4) }), bpmUp: () => set({ bpm: Math.min(200, bpm + 4) }),
    target: String(target), tDown: () => set({ target: Math.max(40, target - 4) }), tUp: () => set({ target: Math.min(200, target + 4) }),
    tPct: Math.round(bpm / target * 100) + '%', tW: Math.min(100, Math.round(bpm / target * 100)) + '%',
    playing, notPlaying: !playing, playLabel: playing ? 'Stop' : 'Listen', togglePlay: () => set({ playing: !playing }),
    keyOn: xs === 'key', openKey: () => set({ xs: 'key' }), closeXs: () => set({ xs: null }),
    keyRoots: ROOTS.map((r) => ({ r, bg: r === key ? '#1A1612' : '#FFFFFF', fg: r === key ? '#FFFFFF' : '#1A1612', pick: () => set({ key: r }) })),
    orderSeg: [['one', 'This key'], ['fifths', 'Circle of fifths'], ['chromatic', 'Chromatic']].map(([id, l]) => ({ l, on: order === id, ...seg(order === id), pick: () => set({ order: id }) })),
    setOn: xs === 'settings', openSet: () => set({ xs: 'settings' })
  };
}
class Component extends DCLogic {''')

# Hanon No. 1, two bars, right hand, in 16ths, drawn
def staff(w=356):
    notes = [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 4, 5, 6, 5, 4, 3]  # diatonic steps from C4
    x0, dx = 54, (w - 70) / 16
    out = ['<path d="' + ''.join(f'M4 {y}H{w-4}' for y in (26, 34, 42, 50, 58)) + f'M4 26V58M{w-4} 26V58M{x0 + 8*dx - 6:.1f} 26V58" stroke="#1A1612" stroke-width="0.8" fill="none"></path>',
           '<text x="8" y="62" font-size="44" font-family="serif" fill="#1A1612">𝄞</text>']
    heads = []
    for i, s in enumerate(notes):
        x = x0 + i * dx + (6 if i >= 8 else 0)
        y = 58 - (s - 2) * 4 + 8  # E4 on the bottom line (58): C4 is 8 below
        y = 66 - s * 4
        if s == 0: out.append(f'<path d="M{x-7:.1f} 66H{x+7:.1f}" stroke="#1A1612" stroke-width="0.8"></path>')
        out.append(f'<ellipse cx="{x:.1f}" cy="{y}" rx="4.6" ry="3.4" transform="rotate(-20 {x:.1f} {y})" fill="#1A1612"></ellipse>')
        heads.append((x, y))
    for g in range(4):
        grp = heads[g*4:g*4+4]
        top = min(y for _, y in grp) - 26
        for x, y in grp:
            out.append(f'<path d="M{x+4.2:.1f} {y-1}V{top}" stroke="#1A1612" stroke-width="1"></path>')
        out.append(f'<path d="M{grp[0][0]+4.2:.1f} {top}H{grp[-1][0]+4.2:.1f}M{grp[0][0]+4.2:.1f} {top+4}H{grp[-1][0]+4.2:.1f}" stroke="#1A1612" stroke-width="3"></path>')
    return f'<svg viewBox="0 -6 {w} 82" width="100%" aria-label="Hanon No. 1, bars 1 and 2, right hand" style="display: block">' + ''.join(out) + '</svg>'

STEP = lambda label, val, dn, up, unit='': f"""<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">{LAB(label)}<div role="group" aria-label="{label}" style="height: 46px; display: flex; align-items: center; border-radius: 12px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF"><button type="button" aria-label="{label}: less" onClick="{{{{{dn}}}}}" style="width: 46px; height: 46px; border: 0; background: transparent; font-size: 20px; color: #1A1612">−</button><span style="flex: 1; text-align: center; font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums">{{{{{val}}}}}{unit}</span><button type="button" aria-label="{label}: more" onClick="{{{{{up}}}}}" style="width: 46px; height: 46px; border: 0; background: transparent; font-size: 20px; color: #1A1612">+</button></div></div>"""
VAL = lambda label, val, act: f"""<button type="button" onClick="{{{{{act}}}}}" style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; border: 0; background: transparent; padding: 0; text-align: left; color: #1A1612">{LAB(label)}<span style="height: 46px; box-sizing: border-box; width: 100%; display: flex; align-items: center; justify-content: space-between; border-radius: 12px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; padding: 0 12px; font-size: 16px; font-weight: 600">{{{{{val}}}}}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg></span></button>"""
HEAD_EX = f"""<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.04em; color: #6B6259">Finger technique · The Virtuoso Pianist</span><h2 style="margin: 0; font-family: 'Instrument Serif', Georgia, serif; font-size: 40px; font-weight: 400; line-height: 1">Hanon</h2><p style="margin: 2px 0 0; font-size: 15px; line-height: 1.4; color: #4A433C">A figure climbs two octaves and comes back, for even, independent fingers.</p></div>"""
SCORE_ = lambda w: f"""<figure style="margin: 0; border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; padding: 10px 12px 8px">{staff(w)}<figcaption style="display: flex; justify-content: space-between; font-size: 13px; color: #6B6259; padding: 2px 4px 0"><span>{{{{exNo}}}} · bars 1–2 of 28</span><span>{{{{exKey}}}}</span></figcaption></figure>"""
OPTS = f"""<div style="display: flex; flex-direction: column; gap: 14px"><div style="display: flex; gap: 10px">{STEP('Number', 'exNo', 'noDown', 'noUp')}{VAL('Key', 'exKey', 'openKey')}</div><div style="display: flex">{SEGBAR('Hands', 'handSeg', 38)}</div><div style="display: flex">{SEGBAR('Rhythm', 'rhySeg', 38)}</div><div style="display: flex; gap: 10px">{STEP('Tempo', 'bpm', 'bpmDown', 'bpmUp')}{STEP('Target tempo', 'target', 'tDown', 'tUp')}</div><div style="display: flex; align-items: center; gap: 10px"><div style="flex: 1; height: 6px; border-radius: 9999px; background: #EFE8DF"><div style="width: {{{{tW}}}}; height: 6px; border-radius: 9999px; background: #2E7D4F"></div></div><span style="font-size: 13px; color: #4A433C; font-variant-numeric: tabular-nums">{{{{tPct}}}} of the target</span></div></div>"""
TODAY = f"""<div style="display: flex; flex-direction: column; gap: 6px">{LAB('Completed today')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><div style="min-height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 14px; box-shadow: inset 0 -1px 0 #F1EBE3; font-size: 15px"><span style="flex: 1">No. 1 in C, both hands</span><span style="color: #6B6259; font-variant-numeric: tabular-nums">60 BPM · 98%</span></div><div style="min-height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 14px; font-size: 15px"><span style="flex: 1">Next key: G major</span><span style="color: #6B6259">{{{{exOrder}}}}</span></div></div></div>"""
SCORE = SCORE_(356)
HOW = f"""<div style="display: flex; flex-direction: column; gap: 6px">{LAB('Technique')}<p style="margin: 0; font-size: 15px; line-height: 1.5; color: #4A433C">Lift each finger high and play it firmly, the hand quiet. Start slowly; raise the tempo only when every note is even. The left hand plays the same figure an octave lower.</p></div>"""
ACT = f"""<div style="display: flex; gap: 10px"><button type="button" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="flex: 1; height: 50px; border: 0; border-radius: 12px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; color: #1A1612; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; font-weight: 600"><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}"><span style="width: 12px; height: 12px; border-radius: 2px; background: #1A1612"></span></sc-if><sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if>{{{{playLabel}}}}</button><button type="button" style="flex: 2; height: 50px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 700">Start</button></div>"""
KEYBODY = f"""<div style="display: flex; flex-direction: column; gap: 6px">{LAB('Key')}<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{keyRoots}}}}" as="r" hint-placeholder-count="12"><button type="button" onClick="{{{{r.pick}}}}" style="height: 46px; border: 0; border-radius: 10px; background: {{{{r.bg}}}}; color: {{{{r.fg}}}}; box-shadow: 0 0 0 1px #E2DACF; font-family: 'Instrument Serif', Georgia, serif; font-size: 21px">{{{{r.r}}}}</button></sc-for></div></div><div style="display: flex">{SEGBAR('Next key', 'orderSeg', 40)}</div><button type="button" onClick="{{{{closeXs}}}}" style="height: 48px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 700">Done</button>"""
HEARTON = HEART.replace('{{FILL}}', 'none').replace('{{STROKE}}', '#1A1612')
BAR = f"""<button type="button" aria-label="Back to Exercises" style="{RB}">{BACK}</button><div style="flex: 1"></div><button type="button" aria-label="Favourite" style="{RB.replace('#EFE8DF', 'transparent')}">{HEARTON}</button><button type="button" aria-label="Exercise settings" onClick="{{{{openSet}}}}" style="{RB}">{GEAR}</button>"""
SETBODY = f"""<div style="display: flex; flex-direction: column; gap: 18px"><div style="display: flex; flex-direction: column; gap: 6px">{LAB('While you play')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{G['SROW']('Count-in', '1 bar')}{G['SROW']('Metronome sound', 'Woodblock')}{G['SROW']('Wait for the right note', 'On')}</div></div><div style="display: flex; flex-direction: column; gap: 6px">{LAB('More')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{G['SROW']('All piano settings', '')}</div></div></div>"""

phone = HEAD % 'Exercise, phone' + f"""<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
<header style="flex: none; height: 52px; display: flex; align-items: center; gap: 4px; padding: 0 12px">{BAR}</header>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 20px; display: flex; flex-direction: column; gap: 16px">{HEAD_EX}{SCORE}{OPTS}{TODAY}{HOW}</main>
<div style="flex: none; padding: 10px 16px; box-shadow: 0 -1px 0 #E9E2D8">{ACT}</div>
<div style="flex: none">{KEYS(96, 10)}</div>
<div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18"></div>
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #FFFFFF; z-index: 90"></div>
{sheet_phone('keyOn', 'Key', KEYBODY).replace('closeAll', 'closeXs')}
<sc-if value="{{{{setOn}}}}" hint-placeholder-val="{{{{false}}}}"><section aria-label="Exercise settings" style="position: absolute; inset: 0; z-index: 70; background: #F7F3EE; display: flex; flex-direction: column"><div style="flex: none; height: 54px; position: relative">{STATUS}</div><header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px"><button type="button" aria-label="Back to Hanon" onClick="{{{{closeXs}}}}" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">Exercise settings</h1></header><div style="padding: 10px 16px">{SETBODY}</div></section></sc-if>
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
open(OUT + 'Exercise.dc.html', 'w').write(phone)

# Laptop: the library left, the exercise's page right
SEARCHROW = A['SEARCHROW'].replace('Search accompaniment', 'Search exercises')
LBAR = f"""<button type="button" aria-label="Back to Practice" style="{RB}">{BACK}</button><h1 style="flex: none; margin: 0; font-size: 20px; font-weight: 700">Exercises</h1><button type="button" aria-label="More" onClick="{{{{toggleMenu}}}}" style="{RB}">{MORE}</button><div style="flex: 1"></div><button type="button" aria-label="Exercise settings" onClick="{{{{openSet}}}}" style="{RB}">{GEAR}</button>"""
laptop = HEAD % 'Exercises, laptop' + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{SIDE}
<div style="position: relative; min-width: 0; display: flex; flex-direction: column">
<header style="flex: none; height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 40px">{LBAR}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); grid-template-rows: minmax(0, 1fr); gap: 32px; padding: 0 40px">
<main class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 24px">{SEARCHROW}{A['PLACES'].replace('margin: 0 -16px; padding: 0 16px', 'margin: 0; flex-wrap: wrap')}{A['CHIPS']}{A['FOLDROW']}{A['FOLDERS']}</main>
<section class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding-bottom: 24px">{HEAD_EX}{SCORE_(760)}<div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px">{OPTS}<div style="display: flex; flex-direction: column; gap: 18px">{TODAY}{HOW}</div></div></section>
</div>
<div style="flex: none; padding: 10px 40px; box-shadow: 0 -1px 0 #E9E2D8; display: flex; justify-content: flex-end"><div style="width: 420px">{ACT}</div></div>
<div style="flex: none">{KEYS(150, 13)}</div>
<sc-if value="{{{{keyOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeXs}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Key" style="position: absolute; right: 40px; top: 300px; z-index: 61; width: 400px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 14px; box-shadow: {POP}; display: flex; flex-direction: column; gap: 12px">{KEYBODY}</div></sc-if>
<sc-if value="{{{{filtOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeAll}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Sort and filter" style="position: absolute; left: 330px; top: 128px; z-index: 61; width: 380px; box-sizing: border-box; border-radius: 16px; background: #FFFFFF; padding: 14px; box-shadow: {POP}; display: flex; flex-direction: column; gap: 12px">{A['FILTBODY'].replace("LAB('Texture')", "")}</div></sc-if>
<sc-if value="{{{{setOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeXs}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Exercise settings" style="position: absolute; right: 40px; top: 70px; z-index: 61; width: 380px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 14px; box-shadow: {POP}">{SETBODY}</div></sc-if>
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
open(OUT + 'ExercisesLaptop.dc.html', 'w').write(laptop.replace('>Texture<', '>Focus<'))
print('exercises ok')
