# Quiz on the Practice canvas: the trainers, a trainer's setup, a run. Run: python3 -I quiz.py
G = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/chords.py').read(), G)
OUT, HEAD, STATUS, SIDE, LAPFRAME_TOP, SH, POP = G['OUT'], G['HEAD'], G['STATUS'], G['SIDE'], G['LAPFRAME_TOP'], G['SH'], G['POP']
SEGBAR, LAB, RB, BACK, GEAR, KEYS, SROW = (G[k] for k in 'SEGBAR LAB RB BACK GEAR KEYS SROW'.split())
PHONE_FRAME, LAPTOP_FRAME = G['PHONE_FRAME'], G['LAPTOP_FRAME']
CHEVR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8178" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>'
INFO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6259" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v6M12 7.5v.5" stroke-linecap="round"></path></svg>'
XI = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>'

JS = r'''
const GROUPS = [
  ['Chords and intervals', [['chords', 'Chords', 'Cards, a quiz, on the keys or by ear', 92, 14], ['intervals', 'Intervals', 'Cards, a quiz, on the keys or by ear', 78, 6], ['chord-role', 'Chord roles', 'Say what a chord does in its key', 0, 0]]],
  ['Scales and keys', [['build-scale', 'Scale building', 'Play the scale named, note by note', 85, 3], ['key-signatures', 'Key signatures', 'Name the key from its key signature', 100, 9], ['key-degrees', 'Key degrees', 'Play a key’s degrees, I to VII', 0, 0]]],
  ['By ear', [['scales-by-ear', 'Scales by ear', 'Hear a scale, name its kind', 64, 2], ['progressions-by-ear', 'Progressions by ear', 'Hear a progression, name it', 0, 0], ['cadences', 'Cadences', 'Hear or read how a phrase ends', 70, 1]]],
  ['Reading', [['reading-notes', 'Note reading', 'Read a note on the staff, play it', 88, 11]]]
];
const DRILLS = [['flashcards', 'Flashcards'], ['quiz', 'Name it'], ['entry', 'Play it'], ['ear', 'By ear']];
const HOW = { flashcards: 'A chord is shown by its name, keys or staff. Reveal it to see the rest.', quiz: 'A chord is shown on the keys and the staff. Choose its name from four on the same root.', entry: 'A chord is named. Play it on the keys or a MIDI keyboard, then Check.', ear: 'A chord is played. Choose what you hear from four on the same root.' };
const LEVELS = ['The main chords of C', 'All chords of C', 'All inversions in C', '7th chords of C', 'Major triads', 'Minor triads', 'All 7th chords', 'Custom'];
const NAT = [0, 2, 4, 5, 7, 9, 11];
const ANS = ['F major', 'F minor', 'F diminished', 'F augmented'];
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {};
    const set = (o) => this.setState(o);
    const sel = st.sel ?? 'chords', drill = st.drill ?? 'quiz', level = st.level ?? 0, rounds = st.rounds ?? '10', setup = st.setup ?? false, run = st.run ?? false, picked = st.picked ?? null, auto = st.auto ?? true, inv = st.inv ?? false, infoOn = st.info ?? false;
    const seg = (on) => ({ bg: on ? '#FFFFFF' : 'transparent', sh: on ? '0 0 0 1px rgba(26,22,18,0.06), 0 1px 3px rgba(26,22,18,0.12)' : 'none', w: on ? 700 : 500 });
    const ring = (p) => { const c = 2 * Math.PI * 15; return { dash: (p / 100 * c).toFixed(1) + ' ' + c.toFixed(1), pct: p ? p + '%' : '' }; };
    const groups = GROUPS.map(([g, list]) => ({ g, rows: list.map(([id, name, about, best, runs]) => ({ id, name, about, rec: runs ? 'Best ' + best + '% · ' + runs + (runs === 1 ? ' run' : ' runs') : 'Not tried yet', ...ring(best), fresh: !runs, tried: !!runs, bg: sel === id ? '#FDF1E8' : 'transparent', open: () => set({ sel: id, setup: true }) })) }));
    const T = GROUPS.flatMap((g) => g[1]).find((r) => r[0] === sel);
    // the run: F major in 1st inversion (A C F), asked as Name it
    const lit = [57, 60, 65];
    const LO = 48, HI = 84; const ws = []; for (let m = LO; m <= HI; m++) if (NAT.includes(m % 12)) ws.push(m);
    const W = 100 / ws.length; const whites = ws.map((m, i) => ({ x: (i * W).toFixed(3) + '%', w: W.toFixed(3) + '%', fill: lit.includes(m) ? '#F7C9A5' : '#FFFFFF', lab: m === 60 ? 'C4' : '' }));
    const blacks = []; for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) continue; const i = ws.indexOf(m - 1); blacks.push({ x: ((i + 1) * W - W * 0.3).toFixed(3) + '%', w: (W * 0.6).toFixed(3) + '%', fill: '#1A1612' }); }
    const answered = picked !== null;
    return {
      SH, groups, whites, blacks, fullName: 'F/A',
      tName: T[1], tAbout: T[2], tRec: T[4] ? 'Runs: ' + T[4] + ' · Best: ' + T[3] + '% · Last: 80%' : 'Not tried yet',
      drillSeg: DRILLS.map(([id, l]) => ({ l, on: drill === id, ...seg(drill === id), pick: () => set({ drill: id }) })), how: HOW[drill], infoOn, toggleInfo: () => set({ info: !infoOn }),
      levels: LEVELS.map((l, i) => ({ l, mark: i === level ? '✓' : '', pick: () => set({ level: i }) })), levelName: LEVELS[level],
      roundSeg: [['10', '10'], ['20', '20'], ['inf', 'Until stopped']].map(([id, l]) => ({ l, on: rounds === id, ...seg(rounds === id), pick: () => set({ rounds: id }) })),
      inv, invBg: inv ? '#2E7D4F' : '#D9D1C6', invX: inv ? '20px' : '2px', toggleInv: () => set({ inv: !inv }),
      auto, autoBg: auto ? '#2E7D4F' : '#D9D1C6', autoX: auto ? '20px' : '2px', toggleAuto: () => set({ auto: !auto }),
      setupOn: setup && !run, closeSetup: () => set({ setup: false }), start: () => set({ run: true, setup: false, picked: null }),
      runOn: run, endRun: () => set({ run: false }), noRun: !run,
      answers: ANS.map((a, i) => { const right = i === 0, chosen = picked === i; return { a, pick: () => !answered && set({ picked: i }), bg: answered && right ? '#E3F1E8' : chosen ? '#FBE4E1' : '#FFFFFF', ring: answered && right ? '0 0 0 2px #2E7D4F' : chosen ? '0 0 0 2px #B3261E' : '0 0 0 1px #E2DACF', mark: answered && right ? '✓' : chosen ? '✕' : '', mc: answered && right ? '#2E7D4F' : '#B3261E' }; }),
      answered, notAnswered: !answered, verdict: picked === 0 ? 'Right: F major, 1st inversion' : 'Not quite: it’s F major, with A lowest', vc: picked === 0 ? '#2E7D4F' : '#B3261E',
      next: () => set({ picked: null }), tally: answered && picked === 0 ? '3 right · 0 wrong' : answered ? '2 right · 1 wrong' : '2 right · 0 wrong'
    };
  }
}
'''

ROW = f"""<button type="button" onClick="{{{{r.open}}}}" style="width: 100%; min-height: 68px; border: 0; background: {{{{r.bg}}}}; box-shadow: inset 0 -1px 0 #F1EBE3; display: flex; align-items: center; gap: 12px; padding: 10px 12px 10px 14px; color: #1A1612; text-align: left"><svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style="flex: none"><circle cx="20" cy="20" r="15" fill="none" stroke="#EFE8DF" stroke-width="4"></circle><circle cx="20" cy="20" r="15" fill="none" stroke="#2E7D4F" stroke-width="4" stroke-linecap="round" stroke-dasharray="{{{{r.dash}}}}" transform="rotate(-90 20 20)"></circle><text x="20" y="24" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1A1612" font-family="Instrument Sans, system-ui">{{{{r.pct}}}}</text></svg><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{r.name}}}}</span><span style="font-size: 13px; color: #6B6259; line-height: 1.3">{{{{r.about}}}}</span><span style="font-size: 12.5px; color: #4A433C; font-variant-numeric: tabular-nums">{{{{r.rec}}}}</span></span>{CHEVR}</button>"""
GAPS = f"""<button type="button" style="width: 100%; border: 0; border-radius: 16px; background: #1A1612; color: #FFFFFF; display: flex; align-items: center; gap: 14px; padding: 16px; text-align: left"><span style="flex: none; width: 46px; height: 46px; border-radius: 12px; background: #E8762F; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums">7</span><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">My gaps</span><span style="font-size: 13.5px; color: #D9D1C6">F♯ minor, B♭7, D Dorian and 4 more, asked again</span></span><span style="height: 38px; padding: 0 14px; border-radius: 9999px; background: #FFFFFF; color: #1A1612; display: flex; align-items: center; font-size: 15px; font-weight: 700">Start</span></button>"""
LIST = f"""{GAPS}<sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="4"><section style="display: flex; flex-direction: column; gap: 6px"><h2 style="margin: 4px 4px 0; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; color: #6B6259">{{{{g.g}}}}</h2><div style="border-radius: 16px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><sc-for list="{{{{g.rows}}}}" as="r" hint-placeholder-count="3">{ROW}</sc-for></div></section></sc-for>"""
TOG = lambda label, on, bg, x, act: f"""<div style="min-height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 14px; box-shadow: inset 0 -1px 0 #F1EBE3"><span style="flex: 1; font-size: 15.5px">{label}</span><button type="button" role="switch" aria-checked="{{{{{on}}}}}" aria-label="{label}" onClick="{{{{{act}}}}}" style="position: relative; flex: none; width: 44px; height: 26px; border: 0; border-radius: 9999px; background: {{{{{bg}}}}}"><span style="position: absolute; top: 2px; left: {{{{{x}}}}}; width: 22px; height: 22px; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 1px 2px rgba(0,0,0,0.2)"></span></button></div>"""
SETUP = f"""<div style="display: flex; flex-direction: column; gap: 16px"><div style="display: flex; flex-direction: column; gap: 4px"><h2 style="margin: 0; font-family: 'Instrument Serif', Georgia, serif; font-size: 36px; font-weight: 400; line-height: 1">{{{{tName}}}}</h2><span style="font-size: 13.5px; color: #4A433C; font-variant-numeric: tabular-nums">{{{{tRec}}}}</span></div><div style="display: flex; align-items: flex-end; gap: 6px">{SEGBAR('Drill', 'drillSeg', 40)}<button type="button" aria-label="How this drill asks" aria-expanded="{{{{infoOn}}}}" onClick="{{{{toggleInfo}}}}" style="flex: none; width: 40px; height: 46px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center">{INFO}</button></div><sc-if value="{{{{infoOn}}}}" hint-placeholder-val="{{{{false}}}}"><p style="margin: -6px 0 0; padding: 10px 12px; border-radius: 12px; background: #EFE8DF; font-size: 14px; line-height: 1.45; color: #4A433C">{{{{how}}}}</p></sc-if><div style="display: flex; flex-direction: column; gap: 6px">{LAB('Level')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden"><sc-for list="{{{{levels}}}}" as="l" hint-placeholder-count="8"><button type="button" onClick="{{{{l.pick}}}}" style="width: 100%; height: 44px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 #F1EBE3; display: flex; align-items: center; padding: 0 14px; font-size: 15.5px; color: #1A1612; text-align: left"><span style="flex: 1">{{{{l.l}}}}</span><span style="color: #E8762F; font-weight: 700">{{{{l.mark}}}}</span></button></sc-for></div></div><div style="display: flex; flex-direction: column; gap: 6px">{LAB('Options')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{SROW('Chord qualities', '4 of 16')}{SROW('Keys', 'C')}{TOG('Inversions', 'inv', 'invBg', 'invX', 'toggleInv')}</div></div><div style="display: flex">{SEGBAR('Rounds', 'roundSeg', 38)}</div><div style="display: flex; flex-direction: column; gap: 6px">{LAB('Timing')}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{SROW('Time limit', 'Off')}{TOG('Advance automatically', 'auto', 'autoBg', 'autoX', 'toggleAuto')}</div></div></div>"""
STARTBTN = """<button type="button" onClick="{{start}}" style="width: 100%; height: 52px; border: 0; border-radius: 14px; background: #1A1612; color: #FFFFFF; font-size: 17px; font-weight: 700">Start</button>"""
# F major, 1st inversion (A3 C4 F4) on a grand staff's treble and bass, drawn
def chordstaff(w):
    lines = ''.join(f'M8 {y}H{w-8}' for y in (24, 32, 40, 48, 56)) + ''.join(f'M8 {y}H{w-8}' for y in (88, 96, 104, 112, 120))
    cx = w / 2
    heads = [(cx, 64), (cx, 52)]  # C4 on a ledger below treble (y 64), F4 first space (52)
    bh = [(cx, 84)]  # A3: top space above bass staff? A3 sits in the top space of the bass staff (84 is above top line 88: top space is 84? use 92)
    bh = [(cx, 88)]
    out = f'<path d="{lines}M8 24V120M{w-8} 24V56M{w-8} 88V120" stroke="#1A1612" stroke-width="0.9" fill="none"></path><path d="M{cx-10} 64H{cx+10}" stroke="#1A1612" stroke-width="0.9"></path>'
    out += '<text x="12" y="60" font-size="46" font-family="serif" fill="#1A1612">𝄞</text><text x="14" y="110" font-size="34" font-family="serif" fill="#1A1612">𝄢</text>'
    for x, y in heads + bh:
        out += f'<ellipse cx="{x}" cy="{y}" rx="5.6" ry="4" transform="rotate(-20 {x} {y})" fill="#1A1612"></ellipse>'
    return f'<svg viewBox="0 10 {w} 120" width="{w}" height="120" aria-label="A chord on the grand staff" style="display: block; max-width: 100%">{out}</svg>'
RUN = lambda w: f"""<div style="display: flex; flex-direction: column; gap: 14px"><div style="display: flex; align-items: center; gap: 10px"><span style="font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums">Round 3 of 10</span><span style="flex: 1; font-size: 14px; color: #6B6259; font-variant-numeric: tabular-nums">{{{{tally}}}}</span><span aria-label="Time left" style="font-size: 14px; color: #6B6259">Name it</span></div><div style="height: 6px; border-radius: 9999px; background: #EFE8DF"><div style="width: 25%; height: 6px; border-radius: 9999px; background: #1A1612"></div></div><div style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 0 6px; border-radius: 16px; background: #FFFFFF; box-shadow: {SH}"><span style="font-size: 14px; color: #6B6259">Which chord is this?</span>{chordstaff(w)}</div><div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px"><sc-for list="{{{{answers}}}}" as="a" hint-placeholder-count="4"><button type="button" onClick="{{{{a.pick}}}}" style="height: 60px; border: 0; border-radius: 14px; background: {{{{a.bg}}}}; box-shadow: {{{{a.ring}}}}; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 17px; font-weight: 600; color: #1A1612">{{{{a.a}}}}<span style="color: {{{{a.mc}}}}; font-weight: 800">{{{{a.mark}}}}</span></button></sc-for></div><sc-if value="{{{{answered}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="display: flex; align-items: center; gap: 10px"><span style="flex: 1; font-size: 15.5px; font-weight: 600; color: {{{{vc}}}}">{{{{verdict}}}}</span><button type="button" onClick="{{{{next}}}}" style="height: 46px; padding: 0 22px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 700">Next</button></div></sc-if></div>"""
BAR = f"""<button type="button" aria-label="Back to Practice" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">Quiz</h1><button type="button" aria-label="Quiz settings" style="{RB}">{GEAR}</button>"""
RUNBAR = f"""<button type="button" aria-label="End the run" onClick="{{{{endRun}}}}" style="{RB}">{XI}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">{{{{tName}}}}</h1><button type="button" aria-label="Quiz settings" style="{RB}">{GEAR}</button>"""

phone = HEAD % 'Quiz, phone' + f"""<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
<sc-if value="{{{{noRun}}}}" hint-placeholder-val="{{{{true}}}}"><header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px">{BAR}</header><main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 16px">{LIST}</main></sc-if>
<sc-if value="{{{{runOn}}}}" hint-placeholder-val="{{{{false}}}}"><header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px">{RUNBAR}</header><main style="flex: 1; min-height: 0; padding: 6px 16px 12px">{RUN(300)}</main><div style="flex: none">{KEYS(110, 10)}</div><div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18"></div></sc-if>
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #8A8178; z-index: 90"></div>
<sc-if value="{{{{setupOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSetup}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(26,22,18,0.32)"></div><section role="dialog" aria-label="Set up the drill" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; height: 780px; border-radius: 22px 22px 0 0; background: #F7F3EE; display: flex; flex-direction: column"><div aria-hidden="true" style="flex: none; width: 36px; height: 5px; margin: 8px auto 6px; border-radius: 9999px; background: #D9D1C6"></div><div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 16px">{SETUP}</div><div style="flex: none; padding: 10px 16px 34px; box-shadow: 0 -1px 0 #E9E2D8">{STARTBTN}</div></section></sc-if>
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
open(OUT + 'Quiz.dc.html', 'w').write(phone)

laptop = HEAD % 'Quiz, laptop' + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{SIDE}
<div style="position: relative; min-width: 0; display: flex; flex-direction: column">
<sc-if value="{{{{noRun}}}}" hint-placeholder-val="{{{{true}}}}"><header style="flex: none; height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 40px">{BAR}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 520px; grid-template-rows: minmax(0, 1fr); gap: 32px; padding: 0 40px">
<main class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 30px">{LIST}</main>
<aside style="min-height: 0; display: flex; flex-direction: column; border-radius: 18px; background: #FBF8F3; box-shadow: {SH}; margin-bottom: 24px; overflow: hidden"><div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 20px 20px 10px">{SETUP}</div><div style="flex: none; padding: 12px 20px 16px; box-shadow: 0 -1px 0 #E9E2D8">{STARTBTN}</div></aside>
</div></sc-if>
<sc-if value="{{{{runOn}}}}" hint-placeholder-val="{{{{false}}}}"><header style="flex: none; height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 40px">{RUNBAR}</header><main style="flex: 1; min-height: 0; display: flex; justify-content: center; padding: 0 40px"><div style="width: 640px">{RUN(420)}</div></main><div style="flex: none">{KEYS(170, 13)}</div></sc-if>
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
open(OUT + 'QuizLaptop.dc.html', 'w').write(laptop)
print('quiz ok')
