# The Tools on the Practice canvas: Metronome, Tuner, Chord finder, Circle of fifths. Run: python3 -I tools.py
G = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/chords.py').read(), G)
OUT, HEAD, STATUS, SIDE, LAPFRAME_TOP, SH, POP = G['OUT'], G['HEAD'], G['STATUS'], G['SIDE'], G['LAPFRAME_TOP'], G['SH'], G['POP']
SEGBAR, LAB, RB, BACK, GEAR, KEYS, SROW, PROW = (G[k] for k in 'SEGBAR LAB RB BACK GEAR KEYS SROW PROW'.split())
PHONE_FRAME, LAPTOP_FRAME = G['PHONE_FRAME'], G['LAPTOP_FRAME']
PLAYI = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>'
PLAYS = PLAYI.replace('width="26" height="26"', 'width="15" height="15"')
CHEV = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"></path></svg>'
MIC = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path></svg>'
NAT = "const NAT = [0, 2, 4, 5, 7, 9, 11];"
KB = r'''
function keyboard(LO, HI, lit, fill) {
  const ws = []; for (let m = LO; m <= HI; m++) if (NAT.includes(m % 12)) ws.push(m);
  const W = 100 / ws.length;
  const whites = ws.map((m, i) => ({ x: (i * W).toFixed(3) + '%', w: W.toFixed(3) + '%', fill: lit.includes(m) ? fill : '#FFFFFF', lab: m === 60 ? 'C4' : '' }));
  const blacks = []; for (let m = LO; m <= HI; m++) { if (NAT.includes(m % 12)) continue; const i = ws.indexOf(m - 1); blacks.push({ x: ((i + 1) * W - W * 0.3).toFixed(3) + '%', w: (W * 0.6).toFixed(3) + '%', fill: lit.includes(m) ? '#C9561A' : '#1A1612' }); }
  return { whites, blacks };
}
const SEG = (on) => ({ bg: on ? '#FFFFFF' : 'transparent', sh: on ? '0 0 0 1px rgba(26,22,18,0.06), 0 1px 3px rgba(26,22,18,0.12)' : 'none', w: on ? 700 : 500 });
'''

def phone(fname, title, body, js, tail='', sheets='', back='Back to Practice'):
    bar = f"""<button type="button" aria-label="{back}" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">{title}</h1><button type="button" aria-label="{title} settings" onClick="{{{{openSet}}}}" style="{RB}">{GEAR}</button>"""
    html = HEAD % (title + ', phone') + f"""<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
<header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px">{bar}</header>
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 6px 16px 20px; display: flex; flex-direction: column; gap: 16px">{body}</main>
{tail}
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: #8A8178; z-index: 90"></div>
{sheets}
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":450,"height":920}}}}'>
const SH = '{SH}';
{NAT}{KB}{js}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)

def laptop(fname, title, body, js, tail='', pops=''):
    bar = f"""<button type="button" aria-label="Back to Practice" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">{title}</h1><button type="button" aria-label="{title} settings" onClick="{{{{openSet}}}}" style="{RB}">{GEAR}</button>"""
    html = HEAD % (title + ', laptop') + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{SIDE}
<div style="position: relative; min-width: 0; display: flex; flex-direction: column">
<header style="flex: none; height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 40px">{bar}</header>
<div style="flex: 1; min-height: 0; padding: 0 40px 28px; display: flex; flex-direction: column">{body}</div>
{tail}
{pops}
</div>
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
const SH = '{SH}';
{NAT}{KB}{js}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)

def setpage(title, body):
    return f"""<sc-if value="{{{{setOn}}}}" hint-placeholder-val="{{{{false}}}}"><section aria-label="{title} settings" style="position: absolute; inset: 0; z-index: 70; background: #F7F3EE; display: flex; flex-direction: column"><div style="flex: none; height: 54px; position: relative">{STATUS}</div><header style="flex: none; height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 12px"><button type="button" aria-label="Back to the {title}" onClick="{{{{closeSet}}}}" style="{RB}">{BACK}</button><h1 style="flex: 1; margin: 0; font-size: 20px; font-weight: 700">{title} settings</h1></header><div style="padding: 10px 16px; display: flex; flex-direction: column; gap: 18px">{body}</div></section></sc-if>"""
def setpop(title, body):
    return f"""<sc-if value="{{{{setOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="{title} settings" style="position: absolute; right: 40px; top: 70px; z-index: 61; width: 380px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 14px; box-shadow: {POP}; display: flex; flex-direction: column; gap: 16px">{body}</div></sc-if>"""
CARD = lambda label, rows: f"""<div style="display: flex; flex-direction: column; gap: 6px">{LAB(label)}<div style="border-radius: 14px; background: #FFFFFF; box-shadow: {SH}; overflow: hidden">{rows}</div></div>"""
SETCOMMON = "setOn: st.set ?? false, openSet: () => set({ set: true }), closeSet: () => set({ set: false }),"

# ───────────────────────── Metronome ─────────────────────────
MJS = r'''
const MARK = [[40, 'Grave'], [60, 'Largo'], [66, 'Larghetto'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [168, 'Allegro'], [200, 'Presto'], [999, 'Prestissimo']];
const LV = { accent: ['#1A1612', 100], normal: ['#8A8178', 62], silent: ['transparent', 0] };
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {}; const set = (o) => this.setState(o);
    const bpm = st.bpm ?? 120, playing = st.playing ?? false, beat = st.beat ?? 1, meter = st.meter ?? '4/4', levels = st.levels || ['accent', 'normal', 'normal', 'normal'], sub = st.sub ?? 'none', sheet = st.sheet ?? null;
    const n = parseInt(meter, 10);
    const lv = Array.from({ length: n }, (_, i) => levels[i] || 'normal');
    const cycle = { accent: 'normal', normal: 'silent', silent: 'accent' };
    const step = (d) => () => set({ bpm: Math.max(20, Math.min(300, bpm + d)) });
    return {
      SH, bpm: String(bpm), mark: MARK.find(([t]) => bpm < t)[1], s10d: step(-10), s1d: step(-1), s1u: step(1), s10u: step(10),
      pos: ((bpm - 20) / 280 * 100).toFixed(1) + '%',
      beats: lv.map((l, i) => ({ n: String(i + 1), h: LV[l][1] + '%', fill: LV[l][0], ring: playing && beat === i + 1 ? '0 0 0 3px #E8762F' : '0 0 0 1px #E2DACF', pick: () => set({ levels: lv.map((x, j) => j === i ? cycle[x] : x) }), lab: l === 'accent' ? 'Accent' : l === 'normal' ? 'Beat' : 'Silent' })),
      playing, notPlaying: !playing, playLabel: playing ? 'Stop' : 'Start', toggle: () => set({ playing: !playing }),
      meter, subLabel: { none: 'None', '8ths': 'Eighth notes', triplets: 'Triplets', '16ths': 'Sixteenth notes', swing: 'Swung eighths' }[sub], soundLabel: st.sound ?? 'Woodblock',
      openMeter: () => set({ sheet: 'meter' }), meterOn: sheet === 'meter', closeSheet: () => set({ sheet: null }),
      meters: ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '9/8', '12/8'].map((m) => ({ l: m, bg: m === meter ? '#1A1612' : '#FFFFFF', fg: m === meter ? '#FFFFFF' : '#1A1612', pick: () => set({ meter: m, sheet: null }) })),
      ''' + SETCOMMON + r'''
      subSeg: [['none', 'None'], ['8ths', '8ths'], ['triplets', 'Triplets'], ['16ths', '16ths'], ['swing', 'Swing']].map(([id, l]) => ({ l, on: sub === id, ...SEG(sub === id), pick: () => set({ sub: id }) }))
    };
  }
}
'''
BIG = """<div style="display: flex; flex-direction: column; align-items: center; gap: 2px; padding-top: 6px"><div style="display: flex; align-items: center; gap: 8px"><button type="button" aria-label="Slower by 10" onClick="{{s10d}}" style="width: 52px; height: 44px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600; color: #1A1612; font-variant-numeric: tabular-nums">−10</button><button type="button" aria-label="Slower by 1" onClick="{{s1d}}" style="width: 44px; height: 44px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600; color: #1A1612">−1</button><span style="width: 128px; text-align: center; font-family: 'Instrument Serif', Georgia, serif; font-size: 76px; line-height: 1; font-variant-numeric: tabular-nums">{{bpm}}</span><button type="button" aria-label="Faster by 1" onClick="{{s1u}}" style="width: 44px; height: 44px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600; color: #1A1612">+1</button><button type="button" aria-label="Faster by 10" onClick="{{s10u}}" style="width: 52px; height: 44px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600; color: #1A1612">+10</button></div><span style="font-size: 13px; font-weight: 700; letter-spacing: 0.08em; color: #6B6259">BPM · {{mark}}</span></div>"""
SLIDER = """<div style="display: flex; align-items: center; gap: 12px"><div role="slider" aria-label="Tempo" aria-valuenow="{{bpm}}" style="position: relative; flex: 1; height: 28px; display: flex; align-items: center"><div style="width: 100%; height: 6px; border-radius: 9999px; background: #E2DACF"></div><div style="position: absolute; left: 0; width: {{pos}}; height: 6px; border-radius: 9999px; background: #1A1612"></div><span style="position: absolute; left: calc({{pos}} - 13px); width: 26px; height: 26px; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 1px 4px rgba(26,22,18,0.3)"></span></div><button type="button" style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600; color: #1A1612">Tap tempo</button></div>"""
BEATS = lambda h: f"""<div role="group" aria-label="Beats" style="display: flex; gap: 8px; height: {h}px"><sc-for list="{{{{beats}}}}" as="b" hint-placeholder-count="4"><button type="button" aria-label="Beat {{{{b.n}}}}: {{{{b.lab}}}}" onClick="{{{{b.pick}}}}" style="position: relative; flex: 1; min-width: 0; border: 0; border-radius: 12px; background: #FFFFFF; box-shadow: {{{{b.ring}}}}; overflow: hidden; padding: 0"><span style="position: absolute; left: 0; right: 0; bottom: 0; height: {{{{b.h}}}}; background: {{{{b.fill}}}}"></span><span style="position: absolute; left: 8px; top: 6px; font-size: 12px; font-weight: 700; color: #8A8178">{{{{b.n}}}}</span></button></sc-for></div>"""
MVAL = lambda label, val, act='': f"""<button type="button" {('onClick="{{' + act + '}}"') if act else ''} style="width: 100%; min-height: 52px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 #F1EBE3; display: flex; align-items: center; gap: 10px; padding: 0 14px; color: #1A1612; text-align: left; font-size: 15.5px"><span style="flex: 1">{label}</span><span style="display: flex; align-items: center; gap: 4px; color: #4A433C">{{{{{val}}}}}{CHEV}</span></button>"""
RHYTHM = f"""<div style="display: flex; flex-direction: column; gap: 14px">{CARD('Rhythm', MVAL('Time signature', 'meter', 'openMeter') + MVAL('Sound', 'soundLabel'))}<div style="display: flex">{SEGBAR('Subdivision', 'subSeg', 40)}</div>{CARD('Practice aids', PROW('Speed trainer', 'Off · from 80 to 120 BPM, +4 every 4 bars') + PROW('Silent bars', 'Off · 2 bars played, 2 muted', True))}</div>"""
PLAYBTN = """<button type="button" aria-pressed="{{playing}}" onClick="{{toggle}}" style="width: 100%; height: 60px; border: 0; border-radius: 16px; background: #1A1612; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 18px; font-weight: 700"><sc-if value="{{playing}}" hint-placeholder-val="{{false}}"><span style="width: 16px; height: 16px; border-radius: 3px; background: #FFFFFF"></span></sc-if><sc-if value="{{notPlaying}}" hint-placeholder-val="{{true}}">""" + PLAYI.replace('26', '20') + """</sc-if>{{playLabel}}</button>"""
METERBODY = """<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{meters}}" as="m" hint-placeholder-count="8"><button type="button" onClick="{{m.pick}}" style="height: 52px; border: 0; border-radius: 12px; background: {{m.bg}}; color: {{m.fg}}; box-shadow: 0 0 0 1px #E2DACF; font-family: 'Instrument Serif', Georgia, serif; font-size: 24px">{{m.l}}</button></sc-for></div><button type="button" style="height: 46px; border: 0; border-radius: 12px; background: transparent; box-shadow: inset 0 0 0 1.5px #D9D1C6; font-size: 15px; font-weight: 600; color: #1A1612">Other…</button>"""
MSET = CARD('Sound', SROW('Click', 'Woodblock') + SROW('Volume', '80%')) + CARD('More', SROW('Count-in', '1 bar') + SROW('Flash the screen on the beat', 'Off'))
phone('Metronome', 'Metronome', BIG + SLIDER + BEATS(96) + RHYTHM, MJS,
      tail=f"""<div style="flex: none; padding: 12px 16px 34px; box-shadow: 0 -1px 0 #E9E2D8">{PLAYBTN}</div>""",
      sheets=G['sheet_phone']('meterOn', 'Time signature', METERBODY).replace('closeAll', 'closeSheet') + setpage('Metronome', MSET))
laptop('MetronomeLaptop', 'Metronome', f"""<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px"><div style="display: flex; flex-direction: column; gap: 26px; justify-content: center">{BIG.replace('font-size: 76px', 'font-size: 112px').replace('width: 128px', 'width: 190px')}{SLIDER}{BEATS(170)}<div style="width: 360px; align-self: center">{PLAYBTN}</div></div><div class="nos" style="min-height: 0; overflow-y: auto; padding-top: 8px">{RHYTHM}</div></div>""", MJS,
       pops=setpop('Metronome', MSET) + f"""<sc-if value="{{{{meterOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Time signature" style="position: absolute; right: 40px; top: 170px; z-index: 61; width: 380px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 14px; box-shadow: {POP}; display: flex; flex-direction: column; gap: 12px">{METERBODY}</div></sc-if>""")

# ───────────────────────── Tuner ─────────────────────────
TJS = r'''
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {}; const set = (o) => this.setState(o);
    const mic = st.mic ?? 'on', cents = st.cents ?? -6, a4 = st.a4 ?? 440;
    const freq = (a4 * Math.pow(2, cents / 1200)).toFixed(1);
    const ticks = Array.from({ length: 21 }, (_, i) => { const c = -50 + i * 5, a = (c / 50) * 60 * Math.PI / 180, long = c % 25 === 0; return { d: 'M' + (160 + Math.sin(a) * (long ? 118 : 124)).toFixed(1) + ' ' + (170 - Math.cos(a) * (long ? 118 : 124)).toFixed(1) + 'L' + (160 + Math.sin(a) * 136).toFixed(1) + ' ' + (170 - Math.cos(a) * 136).toFixed(1) }; });
    const ang = (cents / 50) * 60;
    const inTune = Math.abs(cents) <= 3;
    const kb = keyboard(57, 81, mic === 'on' ? [69] : [], inTune ? '#8FD0A8' : '#F7C9A5');
    return {
      SH, whites: kb.whites, blacks: kb.blacks, fullName: 'A4',
      micOn: mic === 'on', micOff: mic !== 'on', allow: () => set({ mic: 'on' }),
      note: 'A', oct: '4', freq: freq + ' Hz', cents: (cents > 0 ? '+' : cents < 0 ? '−' : '') + Math.abs(cents) + ' cents', state: inTune ? 'In tune' : cents < 0 ? 'Flat' : 'Sharp', sc: inTune ? '#2E7D4F' : '#B4561B',
      ticks, needle: 'rotate(' + ang + ' 160 170)', nc: inTune ? '#2E7D4F' : '#E8762F',
      a4: String(a4), aDown: () => set({ a4: Math.max(415, a4 - 1) }), aUp: () => set({ a4: Math.min(446, a4 + 1) }),
      ''' + SETCOMMON + r'''
    };
  }
}
'''
GAUGE = lambda s: f"""<div style="display: flex; flex-direction: column; align-items: center; gap: 4px"><svg viewBox="0 0 320 190" width="{s}" aria-hidden="true" style="max-width: 100%"><path d="M41.8 101.8A136 136 0 0 1 278.2 101.8" fill="none" stroke="#EFE8DF" stroke-width="22"></path><path d="M149.4 34.4A136 136 0 0 1 170.6 34.4" fill="none" stroke="#8FD0A8" stroke-width="22"></path><sc-for list="{{{{ticks}}}}" as="t" hint-placeholder-count="21"><path d="{{{{t.d}}}}" stroke="#8A8178" stroke-width="1.6"></path></sc-for><g transform="{{{{needle}}}}"><path d="M160 170L160 40" stroke="{{{{nc}}}}" stroke-width="4" stroke-linecap="round"></path></g><circle cx="160" cy="170" r="9" fill="#1A1612"></circle><text x="30" y="186" font-size="13" fill="#6B6259" font-family="Instrument Sans, system-ui">−50</text><text x="268" y="186" font-size="13" fill="#6B6259" font-family="Instrument Sans, system-ui">+50</text></svg><div style="display: flex; align-items: baseline; gap: 2px; margin-top: -8px"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 96px; line-height: 0.9">{{{{note}}}}</span><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 36px; color: #6B6259">{{{{oct}}}}</span></div><span style="font-size: 18px; font-weight: 700; color: {{{{sc}}}}">{{{{state}}}}</span><span style="font-size: 15px; color: #4A433C; font-variant-numeric: tabular-nums">{{{{cents}}}} · {{{{freq}}}}</span></div>"""
MICOFF = f"""<div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 0 20px"><span style="width: 64px; height: 64px; border-radius: 9999px; background: #EFE8DF; display: flex; align-items: center; justify-content: center; color: #1A1612">{MIC}</span><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 28px">The Tuner listens</span><span style="font-size: 15px; line-height: 1.45; color: #4A433C">Allow the microphone and play a note: its name, how many cents it is off and its frequency show here.</span><button type="button" onClick="{{{{allow}}}}" style="height: 48px; padding: 0 22px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 700">Allow the microphone</button></div>"""
REF = f"""<div style="display: flex; flex-direction: column; gap: 6px">{LAB('Reference pitch')}<div style="height: 52px; display: flex; align-items: center; border-radius: 14px; background: #FFFFFF; box-shadow: {SH}"><button type="button" aria-label="Lower" onClick="{{{{aDown}}}}" style="width: 52px; height: 52px; border: 0; background: transparent; font-size: 22px; color: #1A1612">−</button><span style="flex: 1; text-align: center; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums">A4 = {{{{a4}}}} Hz</span><button type="button" aria-label="Higher" onClick="{{{{aUp}}}}" style="width: 52px; height: 52px; border: 0; background: transparent; font-size: 22px; color: #1A1612">+</button></div></div>"""
TSET = REF + CARD('More', SROW('Show', 'Cents and Hz') + SROW('Note names', 'C D E'))
TUNEBODY = f"""<sc-if value="{{{{micOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 18px">{GAUGE(340)}</div></sc-if><sc-if value="{{{{micOff}}}}" hint-placeholder-val="{{{{false}}}}">{MICOFF}</sc-if>"""
phone('Tuner', 'Tuner', TUNEBODY + f"""<span style="text-align: center; font-size: 13.5px; color: #6B6259">A4 = {{{{a4}}}} Hz</span>""", TJS,
      tail=f"""<div style="flex: none">{KEYS(96, 10)}</div><div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18"></div>""", sheets=setpage('Tuner', TSET))
laptop('TunerLaptop', 'Tuner', f"""<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 40px"><div style="display: flex; flex-direction: column; justify-content: center">{TUNEBODY.replace(GAUGE(340), GAUGE(520))}</div><div style="padding-top: 8px; display: flex; flex-direction: column; gap: 18px">{REF}</div></div>""", TJS,
       tail=f"""<div style="flex: none">{KEYS(150, 13)}</div>""", pops=setpop('Tuner', TSET))

# ───────────────────────── Chord finder ─────────────────────────
FJS = r'''
const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {}; const set = (o) => this.setState(o);
    const held = st.held ?? [52, 60, 67, 71], key = st.key ?? 'C', sheet = st.sheet ?? null;
    const empty = held.length === 0;
    const kb = keyboard(36, 84, held, '#F7C9A5');
    const tog = (m) => set({ held: held.includes(m) ? held.filter((x) => x !== m) : held.concat([m]).sort((a, b) => a - b) });
    const tryC = (h) => () => set({ held: h });
    return {
      SH, whites: kb.whites.map((w) => w), blacks: kb.blacks, fullName: empty ? '' : 'Cmaj7/E',
      empty, found: !empty, clear: () => set({ held: [] }),
      name: 'Cmaj7/E', long: 'C major 7th, 1st inversion', numeral: 'Imaj7 in ' + key + ' major',
      notes: [['E', '3rd', 'bass'], ['C', 'root', ''], ['G', '5th', ''], ['B', '7th', '']].map(([n, d, b]) => ({ n, d, b })),
      also: ['Em(♭6)', 'G6/E (no 3rd)'],
      inKeys: [['C major', 'Imaj7'], ['G major', 'IVmaj7'], ['E minor', '♭VImaj7'], ['A minor', 'IIImaj7']].map(([k, r]) => ({ k, r })),
      played: [['G7', 'V7'], ['Am7', 'vi7'], ['Dm7', 'ii7']].map(([c, r]) => ({ c, r })),
      tries: [['C major', [60, 64, 67]], ['A minor 7th', [57, 60, 64, 67]], ['D dominant 7th', [62, 66, 69, 72]]].map(([l, h]) => ({ l, pick: tryC(h) })),
      keyLabel: key + ' major', openKey: () => set({ sheet: 'key' }), keyOn: sheet === 'key', closeSheet: () => set({ sheet: null }),
      keyRoots: ROOTS.map((r) => ({ r, bg: r === key ? '#1A1612' : '#FFFFFF', fg: r === key ? '#FFFFFF' : '#1A1612', pick: () => set({ key: r, sheet: null }) })),
      ''' + SETCOMMON + r'''
    };
  }
}
'''
SPELL = f"""<button type="button" onClick="{{{{openKey}}}}" style="align-self: flex-start; height: 40px; padding: 0 12px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; display: flex; align-items: center; gap: 6px; font-size: 15px; color: #1A1612"><span style="color: #6B6259">Spelled in</span><span style="font-weight: 700">{{{{keyLabel}}}}</span>{CHEV}</button>"""
FOUND = f"""<div style="display: flex; flex-direction: column; gap: 4px"><div style="display: flex; align-items: baseline; gap: 12px"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 64px; line-height: 1">{{{{name}}}}</span><button type="button" aria-label="Play it" style="width: 40px; height: 40px; border: 0; border-radius: 9999px; background: #EFE8DF; color: #1A1612; display: flex; align-items: center; justify-content: center">{PLAYS}</button></div><span style="font-size: 16px; color: #1A1612">{{{{long}}}}</span><span style="font-size: 14px; color: #6B6259">{{{{numeral}}}}</span></div><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{notes}}}}" as="n" hint-placeholder-count="4"><div style="height: 62px; border-radius: 12px; background: #FFFFFF; box-shadow: {SH}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 24px; line-height: 1">{{{{n.n}}}}</span><span style="font-size: 12.5px; color: #6B6259">{{{{n.d}}}} <b style="color: #B4561B; font-weight: 700">{{{{n.b}}}}</b></span></div></sc-for></div><div style="display: flex; flex-direction: column; gap: 6px">{LAB('Also read as')}<div style="display: flex; gap: 6px; flex-wrap: wrap"><sc-for list="{{{{also}}}}" as="a" hint-placeholder-count="2"><span style="height: 34px; padding: 0 12px; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; display: flex; align-items: center; font-size: 15px">{{{{a}}}}</span></sc-for></div></div>"""
INKEYS = CARD('In these keys', """<sc-for list="{{inKeys}}" as="k" hint-placeholder-count="4"><div style="min-height: 46px; display: flex; align-items: center; padding: 0 14px; box-shadow: inset 0 -1px 0 #F1EBE3; font-size: 15px"><span style="flex: 1">{{k.k}}</span><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 18px; color: #4A433C">{{k.r}}</span></div></sc-for>""")
PLAYED = f"""<div style="display: flex; flex-direction: column; gap: 6px">{LAB('Played')}<div style="display: flex; gap: 6px"><sc-for list="{{{{played}}}}" as="p" hint-placeholder-count="3"><span style="flex: 1; height: 54px; border-radius: 12px; background: #FFFFFF; box-shadow: {SH}; display: flex; flex-direction: column; align-items: center; justify-content: center"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 20px; line-height: 1">{{{{p.c}}}}</span><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 14px; color: #6B6259">{{{{p.r}}}}</span></span></sc-for></div></div>"""
EMPTYF = """<div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; padding: 20px 0"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 30px">Play or tap a chord</span><span style="font-size: 15px; color: #4A433C">Hold three or more keys; the chord is named as you play.</span><div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 6px"><sc-for list="{{tries}}" as="t" hint-placeholder-count="3"><button type="button" onClick="{{t.pick}}" style="height: 40px; padding: 0 14px; border: 0; border-radius: 9999px; background: #FFFFFF; box-shadow: 0 0 0 1px #E2DACF; font-size: 15px; font-weight: 600; color: #1A1612">{{t.l}}</button></sc-for></div></div>"""
ACTF = """<div style="display: flex; gap: 10px"><button type="button" onClick="{{clear}}" style="flex: 1; height: 48px; border: 0; border-radius: 12px; background: #EFE8DF; color: #1A1612; font-size: 15.5px; font-weight: 600">Clear the keys</button><button type="button" style="flex: 1; height: 48px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 15.5px; font-weight: 700">Open in Chords</button></div>"""
KEYBODY = """<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px"><sc-for list="{{keyRoots}}" as="r" hint-placeholder-count="12"><button type="button" onClick="{{r.pick}}" style="height: 46px; border: 0; border-radius: 10px; background: {{r.bg}}; color: {{r.fg}}; box-shadow: 0 0 0 1px #E2DACF; font-family: 'Instrument Serif', Georgia, serif; font-size: 21px">{{r.r}}</button></sc-for></div>"""
FSET = CARD('Keyboard', SROW('Connect a piano', 'Not connected') + SROW('Remember the chords played', 'On')) + CARD('More', SROW('All piano settings', ''))
FBODY = f"""{SPELL}<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}">{FOUND}{PLAYED}{INKEYS}</sc-if><sc-if value="{{{{empty}}}}" hint-placeholder-val="{{{{false}}}}">{EMPTYF}</sc-if>"""
phone('ChordFinder', 'Chord finder', FBODY, FJS,
      tail=f"""<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; padding: 10px 16px; box-shadow: 0 -1px 0 #E9E2D8">{ACTF}</div></sc-if><div style="flex: none">{KEYS(118, 10)}</div><div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18"></div>""",
      sheets=G['sheet_phone']('keyOn', 'Spelled in', KEYBODY).replace('closeAll', 'closeSheet') + setpage('Chord finder', FSET))
laptop('ChordFinderLaptop', 'Chord finder', f"""<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 40px"><div style="display: flex; flex-direction: column; gap: 18px">{SPELL}{FOUND}<div style="width: 420px">{ACTF}</div></div><div class="nos" style="min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 18px">{PLAYED}{INKEYS}</div></div></sc-if><sc-if value="{{{{empty}}}}" hint-placeholder-val="{{{{false}}}}">{SPELL}{EMPTYF}</sc-if>""", FJS,
       tail=f"""<div style="flex: none">{KEYS(190, 13)}</div>""", pops=setpop('Chord finder', FSET) + f"""<sc-if value="{{{{keyOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="Spelled in" style="position: absolute; left: 40px; top: 118px; z-index: 61; width: 380px; box-sizing: border-box; border-radius: 16px; background: #F7F3EE; padding: 14px; box-shadow: {POP}">{KEYBODY}</div></sc-if>""")

# ───────────────────────── Circle of fifths ─────────────────────────
CJS = r'''
const MAJ = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
const MIN = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
const SIG = ['', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯', '5♭', '4♭', '3♭', '2♭', '1♭'];
const SIGN = ['No sharps or flats', '1 sharp: F♯', '2 sharps: F♯ C♯', '3 sharps: F♯ C♯ G♯', '4 sharps: F♯ C♯ G♯ D♯', '5 sharps: F♯ C♯ G♯ D♯ A♯', '6 sharps: F♯ C♯ G♯ D♯ A♯ E♯', '5 flats: B♭ E♭ A♭ D♭ G♭', '4 flats: B♭ E♭ A♭ D♭', '3 flats: B♭ E♭ A♭', '2 flats: B♭ E♭', '1 flat: B♭'];
const DIA = { C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'], G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F♯dim'], D: ['D', 'Em', 'F♯m', 'G', 'A', 'Bm', 'C♯dim'], F: ['F', 'Gm', 'Am', 'B♭', 'C', 'Dm', 'Edim'] };
const NUMS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const arc = (r1, r2, a0, a1) => { const p = (r, a) => [(200 + r * Math.sin(a)).toFixed(1), (200 - r * Math.cos(a)).toFixed(1)]; const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0); return 'M' + x1 + ' ' + y1 + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + x2 + ' ' + y2 + 'L' + x3 + ' ' + y3 + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + x4 + ' ' + y4 + 'Z'; };
class Component extends DCLogic {
  renderVals() {
    const st = this.state || {}; const set = (o) => this.setState(o);
    const sel = st.sel ?? 1;
    const near = [(sel + 11) % 12, sel, (sel + 1) % 12];
    const segs = MAJ.map((m, i) => { const a0 = (i - 0.5) * Math.PI / 6, a1 = (i + 0.5) * Math.PI / 6, am = i * Math.PI / 6; const on = i === sel, nb = near.includes(i);
      return { outer: arc(118, 196, a0, a1), inner: arc(70, 118, a0, a1), fo: on ? '#1A1612' : nb ? '#FDF1E8' : '#FFFFFF', fi: on ? '#4A433C' : nb ? '#FBE7D8' : '#FBF8F3', co: on ? '#FFFFFF' : '#1A1612', ci: on ? '#FFFFFF' : '#4A433C', m, n: MIN[i], s: SIG[i],
        mx: (200 + 162 * Math.sin(am)).toFixed(1), my: (206 - 162 * Math.cos(am)).toFixed(1), sx: (200 + 140 * Math.sin(am)).toFixed(1), sy: (204 - 140 * Math.cos(am)).toFixed(1), nx: (200 + 94 * Math.sin(am)).toFixed(1), ny: (205 - 94 * Math.cos(am)).toFixed(1), pick: () => set({ sel: i }) }; });
    const k = MAJ[sel], dia = DIA[k] || DIA.C;
    return {
      SH, segs, kName: k + ' major', sig: SIGN[sel], rel: MIN[sel].replace('m', '') + ' minor', near: MAJ[(sel + 11) % 12] + ' major and ' + MAJ[(sel + 1) % 12] + ' major, one note apart',
      dia: dia.map((c, i) => ({ c, n: NUMS[i], role: [0].includes(i) ? '#E8762F' : [3, 1].includes(i) ? '#7E6BB8' : [4, 6].includes(i) ? '#2E7D4F' : '#8A8178' })),
      ''' + SETCOMMON + r'''
    };
  }
}
'''
WHEEL = lambda s: f"""<svg viewBox="0 0 400 400" width="{s}" role="radiogroup" aria-label="Keys" style="display: block; max-width: 100%; margin: 0 auto"><sc-for list="{{{{segs}}}}" as="g" hint-placeholder-count="12"><g onClick="{{{{g.pick}}}}" style="cursor: pointer"><path d="{{{{g.outer}}}}" fill="{{{{g.fo}}}}" stroke="#E2DACF" stroke-width="1.2"></path><path d="{{{{g.inner}}}}" fill="{{{{g.fi}}}}" stroke="#E2DACF" stroke-width="1.2"></path><text x="{{{{g.mx}}}}" y="{{{{g.my}}}}" text-anchor="middle" font-size="22" font-family="Instrument Serif, Georgia, serif" fill="{{{{g.co}}}}">{{{{g.m}}}}</text><text x="{{{{g.sx}}}}" y="{{{{g.sy}}}}" text-anchor="middle" font-size="10.5" font-family="Instrument Sans, system-ui" fill="{{{{g.co}}}}" opacity="0.7">{{{{g.s}}}}</text><text x="{{{{g.nx}}}}" y="{{{{g.ny}}}}" text-anchor="middle" font-size="14" font-family="Instrument Serif, Georgia, serif" fill="{{{{g.ci}}}}">{{{{g.n}}}}</text></g></sc-for><circle cx="200" cy="200" r="70" fill="#F7F3EE" stroke="#E2DACF" stroke-width="1.2"></circle><text x="200" y="196" text-anchor="middle" font-size="12" font-weight="700" letter-spacing="1" font-family="Instrument Sans, system-ui" fill="#6B6259">MAJOR</text><text x="200" y="214" text-anchor="middle" font-size="12" font-family="Instrument Sans, system-ui" fill="#8A8178">minor inside</text></svg>"""
KEYINFO = f"""<div style="display: flex; flex-direction: column; gap: 14px"><div style="display: flex; flex-direction: column; gap: 3px"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 40px; line-height: 1">{{{{kName}}}}</span><span style="font-size: 15px; color: #4A433C">{{{{sig}}}}</span></div>{CARD('Key', SROW('Relative minor', '{{rel}}').replace('<span style="font-size: 15px; color: #6B6259">{{rel}}</span>', '{{rel}}') + '<div style="min-height: 48px; display: flex; align-items: center; padding: 0 14px; font-size: 15px; color: #4A433C">{{near}}</div>')}<div style="display: flex; flex-direction: column; gap: 6px">{LAB('Diatonic chords')}<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px"><sc-for list="{{{{dia}}}}" as="d" hint-placeholder-count="7"><button type="button" aria-label="Play {{{{d.c}}}}" style="height: 60px; border: 0; border-radius: 10px; background: #FFFFFF; box-shadow: inset 0 -3px 0 {{{{d.role}}}}, 0 0 0 1px #E2DACF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: #1A1612; padding: 0"><span style="font-size: 14px; font-weight: 700">{{{{d.c}}}}</span><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: 14px; color: #6B6259">{{{{d.n}}}}</span></button></sc-for></div></div><button type="button" style="height: 48px; border: 0; border-radius: 12px; background: #1A1612; color: #FFFFFF; font-size: 16px; font-weight: 700">Open in Scales and keys</button></div>"""
CSET = CARD('Show', SROW('Key signatures on the circle', 'On') + SROW('Minor keys inside', 'On'))
phone('CircleOfFifths', 'Circle of fifths', WHEEL(370) + KEYINFO, CJS, sheets=setpage('Circle of fifths', CSET))
laptop('CircleOfFifthsLaptop', 'Circle of fifths', f"""<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 440px; gap: 48px; align-items: center"><div>{WHEEL(700)}</div><div>{KEYINFO}</div></div>""", CJS, pops=setpop('Circle of fifths', CSET))
print('tools ok')
