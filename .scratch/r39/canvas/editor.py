# Builds the score editor's two artboards (phone and laptop) on the Songs canvas from the app's own engraving of
# Amazing Grace (Verovio's SVG, measured for the Player canvas). Run: python3 -I editor.py <scratchpad>
import json, re, sys
S = sys.argv[1]
OUT = '/home/user/piano-trainer/.scratch/r39/canvas/songs/project/'
M = json.load(open(S + '/svg/measured.json'))
LINE = '#CFC6BB'
CHORDS = ['G G7 C G', 'G G D D7', 'G G7 C G', 'Em D G G']
SEL = '#2F6DB0'

def clean(svg, suffix):
    svg = re.sub(r'\s+xmlns(:xlink)?="[^"]*"', '', svg)
    svg = re.sub(r'\s+version="[^"]*"', '', svg)
    svg = re.sub(r'<desc>.*?</desc>', '', svg, flags=re.S)
    svg = re.sub(r'>\s+<', '><', svg)
    svg = re.sub(r'\sid="([^"]+)"', lambda m: ' id="%s-%s"' % (m.group(1), suffix), svg)
    svg = re.sub(r'href="#([^"]+)"', lambda m: 'href="#%s-%s"' % (m.group(1), suffix), svg)
    svg = re.sub(r' data-(staff|hand)="[^"]*"', '', svg)
    svg = svg.replace('<svg ', '<svg aria-hidden="true" fill="currentColor" stroke="currentColor" style="display: block; overflow: visible" ', 1)
    svg = re.sub(r'<g([^>]*)class="(barLine|ledgerLines[^"]*)"', r'<g\1class="\2" style="color: %s"' % LINE, svg)
    svg = re.sub(r'<path d="(M\d+ \d+ L\d+ \d+)" stroke-width="13"></path>', r'<path d="\1" stroke-width="13" style="color: %s"></path>' % LINE, svg)
    return svg

def chord(name):
    root, ext = re.match(r'([A-G][#b]?m?)(.*)', name).groups()
    return root + ('<sup style="font-size: 0.62em; vertical-align: 0.6em; margin-left: 1px">%s</sup>' % ext if ext else '')

def systems(mode, width, left, cfs, gap):
    out, y = [], 0
    for i, s in enumerate(M[mode]):
        k = width / s['w']
        h = s['h'] * k
        svg = clean(s['html'], '%s%d' % (mode[0], i))
        svg = re.sub(r'width="[\d.]+" height="[\d.]+"', 'width="%.1f" height="%.1f"' % (width, h), svg, count=1)
        labels = ''.join('<span style="position: absolute; left: %.1fpx; top: 0; font-family: \'Instrument Serif\', Georgia, serif; font-size: %dpx; line-height: 1; font-weight: 700">%s</span>' % (left + m['first'] * k - 3, cfs, chord(c)) for m, c in zip(s['meas'], CHORDS[i].split()))
        num = '<span style="position: absolute; left: %dpx; top: 2px; font-size: 11px; color: #8A8178">%d</span>' % (left - 2, i * 4 + 1) if i else ''
        sel = ''
        if i == 0:
            m = s['meas'][1]
            x, t, b = m['beats'][1] * k, m['tTop'] * k, m['tBot'] * k
            sel = '<span aria-hidden="true" style="position: absolute; left: %.1fpx; top: %.1fpx; width: 20px; height: %.1fpx; border-radius: 5px; background: rgba(47,109,176,0.12); box-shadow: inset 0 0 0 1.5px %s"></span>' % (left + x - 7, cfs + 10 + t - 10, b - t + 26, SEL)
        out.append('<div style="position: relative; height: %.1fpx">%s%s<div style="position: absolute; left: %dpx; top: %dpx">%s</div>%s</div>' % (cfs + 10 + h, num, labels, left, cfs + 10, svg, sel))
        y += h
    return ('<div style="height: %dpx"></div>' % gap).join(out)

TOOLS_JS = r'''
const TABS = [['notes', 'Notes'], ['acc', 'Accidentals'], ['art', 'Articulation'], ['dyn', 'Dynamics'], ['bar', 'Bar'], ['text', 'Text']];
const MU = "'Noto Music', serif", SE = "'Instrument Serif', Georgia, serif", SA = "'Instrument Sans', sans-serif";
const T = (id, g, l, f, size, extra) => ({ id, g, l, f: f || MU, size: size || (f && f !== MU ? 24 : 34), it: (extra && extra.it) || 'normal', w: (extra && extra.w) || 400 });
const TOOLS = {
  notes: [T('rest', '𝄽', 'Rest'), T('w', '𝅝', 'Whole note'), T('h', '𝅗𝅥', 'Half note'), T('q', '𝅘𝅥', 'Quarter note'), T('e', '𝅘𝅥𝅮', 'Eighth note'), T('s', '𝅘𝅥𝅯', '16th note'), T('t', '𝅘𝅥𝅰', '32nd note'), T('dot', '.', 'Dot', SE, 34, { w: 700 }), T('tie', '‿', 'Tie', SA, 26), T('trip', '3', 'Triplet', SE, 22, { it: 'italic' })],
  acc: [T('dfl', '𝄫', 'Double flat'), T('fl', '♭', 'Flat'), T('na', '♮', 'Natural'), T('sh', '♯', 'Sharp'), T('dsh', '𝄪', 'Double sharp')],
  art: [T('stacc', '•', 'Staccato', SA, 12), T('acc', '>', 'Accent', SA, 22, { w: 600 }), T('ten', '–', 'Tenuto', SA, 22, { w: 600 }), T('marc', '^', 'Marcato', SA, 24, { w: 600 }), T('ferm', '𝄐', 'Fermata'), T('slur', '⌒', 'Slur', SA, 22), T('arp', '𝆃', 'Arpeggio')],
  dyn: ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'].map((d) => T(d, d, d, SE, 22, { it: 'italic', w: 700 })).concat([T('cresc', '𝆒', 'Crescendo'), T('dim', '𝆓', 'Diminuendo')]),
  bar: [T('time', '3/4', 'Time signature, 3/4', SE, 18, { w: 700 }), T('key', '♯', 'Key signature, G major', MU, 30), T('clef', '𝄞', 'Clef'), T('rs', '𝄆', 'Start repeat'), T('re', '𝄇', 'End repeat'), T('dbl', '𝄁', 'Double barline'), T('add', '+', 'Add a bar', SA, 24), T('tempo', '♩=80', 'Tempo', SA, 15, { w: 600 })],
  text: [T('chord', 'C⁷', 'Chord symbol', SE, 22, { w: 700 }), T('lyr', 'la', 'Lyrics', SA, 17, { w: 600 }), T('txt', 'Tt', 'Text', SE, 22), T('rn', 'IV', 'Roman numeral', SE, 20), T('reh', 'A', 'Rehearsal mark', SA, 16, { w: 700 })]
};
const ON = { notes: 'q', acc: null, art: null, dyn: null, bar: null, text: null };
const WS = 15, BLK = [1, 2, 4, 5, 6, 8, 9, 11, 12, 13];
'''

VALS_JS = r'''
    const st = this.state || {};
    const set = (o) => this.setState(o);
    const tab = st.tab || 'notes', open = st.open ?? OPEN0, piano = st.piano ?? PIANO0, playing = st.playing ?? false, menu = st.menu ?? false;
    const pick = st.pick || ON;
    const tool = (sec) => (t) => {
      const on = pick[sec] === t.id;
      return { ...t, on, bg: on ? '#1A1612' : 'transparent', fg: on ? '#FFFFFF' : '#1A1612', pick: () => set({ pick: { ...pick, [sec]: on && sec !== 'notes' ? null : t.id } }) };
    };
    const whites = Array.from({ length: WS }, (_, i) => ({ x: (i * 100 / WS).toFixed(3) + '%', w: (100 / WS).toFixed(3) + '%', lab: i === 7 ? 'C4' : '', fill: i === 8 ? '#9DB8D6' : '#FFFFFF' }));
    const blacks = BLK.map((i) => ({ x: (i * 100 / WS - 100 / WS * 0.3).toFixed(3) + '%', w: (100 / WS * 0.6).toFixed(3) + '%' }));
    return {
      tabs: TABS.map(([id, label]) => ({ label, on: tab === id, bg: tab === id ? '#FFFFFF' : 'transparent', sh: tab === id ? '0 0 0 1px rgba(26,22,18,0.06), 0 1px 3px rgba(26,22,18,0.12)' : 'none', w: tab === id ? 700 : 500, pick: () => set({ tab: id }) })),
      tools: TOOLS[tab].map(tool(tab)),
      sections: TABS.map(([id, label]) => ({ label, tools: TOOLS[id].map(tool(id)) })),
      open, folded: !open, toggleOpen: () => set({ open: !open }),
      piano, togglePiano: () => set({ piano: !piano }), pianoBg: piano ? '#1A1612' : 'transparent', pianoFg: piano ? '#FFFFFF' : '#1A1612',
      playing, togglePlay: () => set({ playing: !playing }), notPlaying: !playing, playLabel: playing ? 'Stop' : 'Play',
      menu, toggleMenu: () => set({ menu: !menu }), closeMenu: () => set({ menu: false }),
      whites, blacks,
      menuItems: [
        { label: 'Instruments and staves', d: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { label: 'Page layout', d: 'M6 3h9l5 5v13H6ZM14 3v6h6' },
        { label: 'Playback sound', d: 'M11 5 6 9H3v6h3l5 4ZM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12' },
        { label: 'MIDI keyboard', d: 'M3 6h18v12H3ZM8 6v7M12 6v7M16 6v7' }
      ]
    };
'''

ICON = lambda d, sw='2': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg>' % (sw, d)
UNDO, REDO = 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3', 'M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h3'
PIANO = 'M3 5h18v14H3ZM8 5v8M12 5v8M16 5v8'
DOTS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
PLAY = '<sc-if value="{{notPlaying}}" hint-placeholder-val="{{true}}"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg></sc-if><sc-if value="{{playing}}" hint-placeholder-val="{{false}}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg></sc-if>'
RB = 'flex: none; width: 40px; height: 40px; border: 0; border-radius: 9999px; display: flex; align-items: center; justify-content: center'

def bar(right_extra=''):
    return f'''<button type="button" style="flex: none; height: 40px; padding: 0 12px; border: 0; border-radius: 9999px; background: #EFE8DF; color: #1A1612; font-size: 16px; font-weight: 700">Done</button>
<span style="flex: 1"></span>
<button type="button" aria-label="Undo" style="{RB}; background: transparent; color: #1A1612">{ICON(UNDO)}</button>
<button type="button" aria-label="Redo" style="{RB}; background: transparent; color: #B3A99E">{ICON(REDO)}</button>
<span aria-hidden="true" style="width: 1px; height: 22px; background: #E2DACF; margin: 0 2px"></span>
<button type="button" aria-label="Piano keys" aria-pressed="{{{{piano}}}}" onClick="{{{{togglePiano}}}}" style="{RB}; background: {{{{pianoBg}}}}; color: {{{{pianoFg}}}}">{ICON(PIANO, '1.9')}</button>
<button type="button" aria-label="{{{{playLabel}}}}" onClick="{{{{togglePlay}}}}" style="{RB}; background: #E8762F; color: #FFFFFF">{PLAY}</button>
<button type="button" aria-label="Score settings" aria-expanded="{{{{menu}}}}" onClick="{{{{toggleMenu}}}}" style="{RB}; background: transparent; color: #1A1612">{DOTS}</button>'''

TOOLBTN = '''<sc-for list="{{%s}}" as="t" hint-placeholder-count="8"><button type="button" aria-label="{{t.l}}" aria-pressed="{{t.on}}" onClick="{{t.pick}}" style="flex: none; width: %dpx; height: %dpx; border: 0; border-radius: 10px; background: {{t.bg}}; color: {{t.fg}}; display: flex; align-items: center; justify-content: center; font-family: {{t.f}}; font-size: {{t.size}}px; font-style: {{t.it}}; font-weight: {{t.w}}; line-height: 1">{{t.g}}</button></sc-for>'''

SECTIONS = '''<sc-for list="{{sections}}" as="sec" hint-placeholder-count="6"><section style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6B6259">{{sec.label}}</h3><div style="display: flex; flex-wrap: wrap; gap: 4px">''' + (TOOLBTN % ('sec.tools', 48, 48)) + '''</div></section></sc-for>'''

MENU = lambda pos: '''<sc-if value="{{menu}}" hint-placeholder-val="{{false}}"><div onClick="{{closeMenu}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" aria-label="Score settings" style="position: absolute; %s; z-index: 61; width: 250px; border-radius: 14px; background: #FFFFFF; padding: 6px; box-shadow: 0 0 0 1px rgba(26,22,18,0.05), 0 2px 4px rgba(26,22,18,0.08), 0 18px 40px -12px rgba(26,22,18,0.28)"><sc-for list="{{menuItems}}" as="m" hint-placeholder-count="4"><button type="button" role="menuitem" onClick="{{closeMenu}}" style="width: 100%%; height: 44px; border: 0; border-radius: 9px; background: transparent; display: flex; align-items: center; gap: 12px; padding: 0 10px; color: #1A1612; font-size: 16px; text-align: left"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{{m.d}}"></path></svg>{{m.label}}</button></sc-for></div></sc-if>''' % pos

def piano_strip(h):
    return f'''<sc-if value="{{{{piano}}}}" hint-placeholder-val="{{{{true}}}}"><div role="group" aria-label="Piano keys: tap one to enter its note" style="flex: none; position: relative; height: {h}px; background: #2A1F18; border-top: 4px solid #8E2A22"><sc-for list="{{{{whites}}}}" as="k" hint-placeholder-count="15"><span style="position: absolute; left: {{{{k.x}}}}; width: {{{{k.w}}}}; top: 0; bottom: 0; box-sizing: border-box; border: 1px solid #CFC6BA; border-top: 0; border-radius: 0 0 5px 5px; background: {{{{k.fill}}}}; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px; font-size: 10px; font-weight: 700; color: #6B6259">{{{{k.lab}}}}</span></sc-for><sc-for list="{{{{blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.x}}}}; width: {{{{k.w}}}}; top: 0; height: 60%; border-radius: 0 0 3px 3px; background: #1A1612"></span></sc-for></div></sc-if>'''

HEAD = lambda title: f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&amp;family=Instrument+Serif&amp;family=Noto+Music&amp;display=swap">
<style>
body{{margin:0}}
button{{font:inherit;cursor:pointer}}
.nos{{scrollbar-width:none}}.nos::-webkit-scrollbar{{display:none}}
</style>
</helmet>
'''
SCRIPT = lambda w, h, open0, piano0: f'''</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
{TOOLS_JS}
const OPEN0 = {open0}, PIANO0 = {piano0};
class Component extends DCLogic {{
  renderVals() {{{VALS_JS}  }}
}}
</script>
</body>
</html>
'''
TITLE_BLOCK = lambda fs, sub: f'''<button type="button" aria-label="Title and credits" style="display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; border: 0; background: transparent; padding: 0; color: #1A1612"><span style="font-family: 'Instrument Serif', Georgia, serif; font-size: {fs}px; line-height: 1.1">Amazing Grace</span><span style="align-self: flex-end; font-size: {sub}px; color: #4A433C">Words: John Newton · Music: New Britain</span></button>'''

# ---------- phone ----------
phone = HEAD('Amazing Grace, editing, phone') + f'''<div style="width: 450px; height: 920px; position: relative; font-family: 'Instrument Sans', system-ui, sans-serif">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: #FBF8F3; color: #1A1612; display: flex; flex-direction: column">
<div aria-hidden="true" style="flex: none; height: 54px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 6px 34px 0 50px; font: 600 17px -apple-system, system-ui, sans-serif"><span>9:41</span><span style="display: flex; align-items: center; gap: 6px"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"></rect><rect x="5" y="5.5" width="3" height="6.5" rx="1"></rect><rect x="10" y="3" width="3" height="9" rx="1"></rect><rect x="15" y="0" width="3" height="12" rx="1"></rect></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4"></rect><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"></rect><rect x="25" y="4.5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4"></rect></svg></span></div>
<header style="flex: none; height: 52px; display: flex; align-items: center; gap: 4px; padding: 0 10px 0 14px; box-shadow: 0 1px 0 #E9E2D8">{bar()}</header>
<main class="nos" aria-label="The score" style="flex: 1; min-height: 0; overflow-y: auto; background: #FBF8F3; padding: 18px 0 24px">
<div style="padding: 0 16px 14px">{TITLE_BLOCK(28, 11)}</div>
<p style="margin: 0 0 4px 16px; font-size: 12px; color: #4A433C">Verse · <span style="font-family: 'Noto Music', serif">♩</span> = 80</p>
{systems('phone', 370, 16, 16, 22)}
</main>
<section aria-label="Palette" style="flex: none; background: #FFFFFF; border-radius: 18px 18px 0 0; box-shadow: 0 -1px 0 #E9E2D8, 0 -8px 24px -12px rgba(26,22,18,0.18); display: flex; flex-direction: column; padding: 6px 0 8px; max-height: {{{{openH}}}}">
<button type="button" aria-label="{{{{gripLabel}}}}" aria-expanded="{{{{open}}}}" onClick="{{{{toggleOpen}}}}" style="flex: none; align-self: center; width: 80px; height: 22px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 36px; height: 5px; border-radius: 9999px; background: #D9D1C6"></span></button>
<sc-if value="{{{{folded}}}}" hint-placeholder-val="{{{{true}}}}">
<div class="nos" role="toolbar" aria-label="{{{{tabName}}}}" style="display: flex; gap: 2px; overflow-x: auto; padding: 0 10px 6px">{TOOLBTN % ('tools', 46, 46)}</div>
<div class="nos" role="tablist" aria-label="Palette" style="display: flex; gap: 2px; overflow-x: auto; margin: 0 10px; padding: 3px; border-radius: 12px; background: #F3EEE7"><sc-for list="{{{{tabs}}}}" as="b" hint-placeholder-count="6"><button type="button" role="tab" aria-selected="{{{{b.on}}}}" onClick="{{{{b.pick}}}}" style="flex: none; height: 36px; padding: 0 12px; border: 0; border-radius: 9px; background: {{{{b.bg}}}}; box-shadow: {{{{b.sh}}}}; color: #1A1612; font-size: 14px; font-weight: {{{{b.w}}}}">{{{{b.label}}}}</button></sc-for></div>
</sc-if>
<sc-if value="{{{{open}}}}" hint-placeholder-val="{{{{false}}}}">
<div class="nos" style="overflow-y: auto; padding: 4px 14px 8px; display: flex; flex-direction: column; gap: 16px">{SECTIONS}</div>
</sc-if>
</section>
{piano_strip(104)}
<div aria-hidden="true" style="flex: none; height: 26px; background: #2A1F18; position: relative; display: {{{{homeBand}}}}"></div>
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: {{{{homeInk}}}}; z-index: 90"></div>
{MENU('right: 10px; top: 108px')}
</div>
<img src="/_blob/226691e426444897fbec899a02f37476" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
''' + SCRIPT(450, 920, 'false', 'true')
phone = phone.replace("      whites, blacks,", "      whites, blacks, openH: open ? '430px' : 'none', gripLabel: open ? 'Fold the palette' : 'Open the whole palette', tabName: TABS.find((b) => b[0] === tab)[1], homeBand: piano ? 'block' : 'none', homeInk: piano ? '#FFFFFF' : '#1A1612',")
open(OUT + 'Editor.dc.html', 'w').write(phone)

# ---------- laptop ----------
lap = open(OUT + 'Laptop.dc.html').read()
frame = lap.split('<div style="position: absolute; left: 217.7px; top: 124.6px;')[0].split('<x-dc>', 1)[1].split('</helmet>', 1)[1].lstrip('\n')
laptop = HEAD('Amazing Grace, editing, laptop') + frame + f'''<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: #F7F3EE; color: #1A1612; display: flex; flex-direction: column">
<header style="flex: none; height: 60px; display: flex; align-items: center; gap: 6px; padding: 0 20px; background: #FBF8F3; box-shadow: 0 1px 0 #E9E2D8"><span style="font-size: 15px; color: #6B6259; margin-left: 4px; order: 0"></span>{bar()}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 360px">
<main class="nos" aria-label="The score" style="overflow-y: auto; padding: 28px 0 40px; display: flex; justify-content: center">
<div style="width: 1100px; background: #FFFFFF; box-shadow: 0 0 0 1px rgba(26,22,18,0.05), 0 2px 8px -2px rgba(26,22,18,0.12); padding: 48px 40px 60px; box-sizing: border-box">
<div style="padding: 0 0 20px">{TITLE_BLOCK(40, 14)}</div>
<p style="margin: 0 0 6px; font-size: 13px; color: #4A433C">Verse · <span style="font-family: 'Noto Music', serif">♩</span> = 80</p>
{systems('laptop', 1000, 10, 20, 30)}
</div>
</main>
<aside aria-label="Palette" class="nos" style="overflow-y: auto; background: #FFFFFF; box-shadow: -1px 0 0 #E9E2D8; padding: 20px 18px 28px; display: flex; flex-direction: column; gap: 18px">{SECTIONS}</aside>
</div>
{piano_strip(120)}
{MENU('right: 20px; top: 56px')}
</div>
<img src="/_blob/8f8bed506eb49168259dfa0ab9b04b28" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
''' + SCRIPT(2143, 1299, 'true', 'false')
laptop = laptop.replace("      whites, blacks,", "      whites, blacks, tabName: '',")
open(OUT + 'EditorLaptop.dc.html', 'w').write(laptop)
print('ok', len(phone), len(laptop))
