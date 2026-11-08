# R40: every Songs and Practice page in the calm language of the Chords page (the other session's "Calm Chords page"):
# a bare bar, the subject large, one big picture, a quiet switcher, two or three rows, one floating bar with the main
# action and Play; changes in a wheel; nothing to scroll. Run: python3 -I calm.py
import json, re, shutil
G = {}
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/chords.py').read(), G)
OUT, HEAD, STATUS, SIDE, LAPFRAME_TOP = G['OUT'], G['HEAD'], G['STATUS'], G['SIDE'], G['LAPFRAME_TOP']
PHONE_FRAME, LAPTOP_FRAME = G['PHONE_FRAME'], G['LAPTOP_FRAME']
CALM = '/home/user/piano-trainer/.scratch/chords-calm/calm/project/'

# ── tokens (the calm Chords page's, light) ──
PAGE, SHEET, INK, SOFT, FILL, LINE, LINK, ACCENT = '#F7F3EE', '#FEFDFB', '#332921', '#685E56', '#EEE9E2', '#DAD1C8', '#356890', '#EDC684'
GLASS = 'rgba(254,253,251,.86)'
SHADOW = '0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)'
FONT = "'Instrument Sans', -apple-system, 'Helvetica Neue', sans-serif"
I = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
CHEV_L = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="m15 18-6-6 6-6"></path></svg>'
CHEV_R = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="m9 18 6-6-6-6"></path></svg>'
CHEV_U = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="m18 15-6-6-6 6"></path></svg>'
MORE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M7 4.8a1.6 1.6 0 0 1 2.4-1.4l11 6.8a2.1 2.1 0 0 1 0 3.6l-11 6.8A1.6 1.6 0 0 1 7 19.2z"></path></svg>'
STOP = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5"></rect></svg>'
HEART = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"></path></svg>'
SEARCH = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><circle cx="11" cy="11" r="6.5"></circle><path d="m20 20-4-4"></path></svg>'
PLUS = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="M12 5v14M5 12h14"></path></svg>'
UNDO = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M9 14 4 9l5-5"></path><path d="M4 9h11a5 5 0 0 1 0 10h-3"></path></svg>'
REDO = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="m15 14 5-5-5-5"></path><path d="M20 9H9a5 5 0 0 0 0 10h3"></path></svg>'
LOOP = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M17 2l3 3-3 3"></path><path d="M4 11V9a4 4 0 0 1 4-4h12"></path><path d="M7 22l-3-3 3-3"></path><path d="M20 13v2a4 4 0 0 1-4 4H4"></path></svg>'

PRE = r'''
const C = { page: '#F7F3EE', sheet: '#FEFDFB', ink: '#332921', soft: '#685E56', fill: '#EEE9E2', line: '#DAD1C8', link: '#356890', accent: '#EDC684' };
const ROLE = { 1: '#E19E8C', 3: '#85B8DC', 5: '#9BC093', 7: '#E8C67D', 2: '#B8A8D8', 9: '#B8A8D8', 4: '#D3AC8A', 11: '#D3AC8A', 6: '#82C2C1', 13: '#82C2C1' };
const NAT = [0, 2, 4, 5, 7, 9, 11];
const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
// a keyboard from lo to hi, W×H px; marks: midi -> [colour, label]
function calmKeys(lo, hi, marks, W, H) {
  const ws = []; for (let m = lo; m <= hi; m++) if (NAT.includes(m % 12)) ws.push(m);
  const w = W / ws.length, bw = w * 0.6;
  const whites = ws.map((m, i) => { const k = marks[m]; return { left: (i * w).toFixed(1), w: w.toFixed(1), h: H, bg: k ? k[0] : '#FEFDFB', label: k ? k[1] : (m % 12 === 0 ? 'C' + (Math.floor(m / 12) - 1) : ''), ink: k ? '#332921' : '#8A8178', fw: k ? 700 : 500 }; });
  const blacks = []; for (let m = lo; m <= hi; m++) { if (NAT.includes(m % 12)) continue; const i = ws.indexOf(m - 1); const k = marks[m]; blacks.push({ left: ((i + 1) * w - bw / 2).toFixed(1), w: bw.toFixed(1), h: Math.round(H * 0.62), bg: k ? k[0] : '#332C28', label: k ? k[1] : '' }); }
  return { whites, blacks };
}
// a wheel column: seven rows around the chosen one
function wheel(items, sel, pick) {
  const out = []; for (let d = -3; d <= 3; d++) { const i = sel + d; const it = items[i]; out.push({ l: it === undefined ? '' : it, on: d === 0, op: [0.22, 0.42, 0.7, 1, 0.7, 0.42, 0.22][d + 3], fw: d === 0 ? 700 : 450, pick: () => it !== undefined && pick(i) }); }
  return out;
}
const tabsOf = (list, cur, set) => list.map((t) => ({ l: t, ink: t === cur ? C.ink : C.soft, fw: t === cur ? 700 : 500, line: t === cur ? C.ink : 'transparent', pick: () => set({ tab: t }) }));
const common = (st, set) => ({ sheetOn: !!st.sheet, closeSheet: () => set({ sheet: null }), changeOn: st.sheet === 'change', moreOn: st.sheet === 'more', openChange: () => set({ sheet: 'change' }), openMore: () => set({ sheet: 'more' }),
  playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), playLabel: st.playing ? 'Stop' : 'Play' });
'''

# ── pieces ──
def BAR(back, right='', backlabel='Back'):
    b = f'<a href="{back}" aria-label="{backlabel}" style="width: 44px; height: 44px; margin-left: -6px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>' if back else '<span style="width: 44px"></span>'
    return f'<header style="flex: none; height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px">{b}<div style="display: flex; align-items: center; gap: 4px">{right}<button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="width: 44px; height: 44px; margin-right: -6px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div></header>'
ICONBTN = lambda label, svg, act='': f'<button type="button" aria-label="{label}" {("onClick=\"{{" + act + "}}\"") if act else ""} style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{svg}</button>'
def HERO(size=60, gap=6):
    return f'<div style="flex: none; display: flex; flex-direction: column; align-items: center; gap: {gap}px; padding: 4px 16px 0; text-align: center"><h1 style="margin: 0; font-size: {size}px; line-height: 1; font-weight: 700; letter-spacing: -0.02em; color: {INK}; white-space: nowrap">{{{{name}}}}</h1><p style="margin: 0; font-size: 15px; color: {SOFT}">{{{{sub}}}}</p></div>'
def KEYS(h):
    return f'<div style="position: relative; flex: none; width: 100%; height: {h}px; border-radius: 14px; overflow: hidden; background: {LINE}; box-shadow: 0 0 0 1px {LINE}"><sc-for list="{{{{kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 10px; border-right: 1px solid rgba(51,41,33,.16); background: {{{{k.bg}}}}; color: {{{{k.ink}}}}; font-size: 12px; font-weight: {{{{k.fw}}}}; display: flex; align-items: flex-end; justify-content: center">{{{{k.label}}}}</span></sc-for><sc-for list="{{{{kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 6px; border-radius: 0 0 5px 5px; background: {{{{k.bg}}}}; color: {INK}; font-size: 10px; font-weight: 700; display: flex; align-items: flex-end; justify-content: center">{{{{k.label}}}}</span></sc-for><div style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: #7C302C"></div></div>'
def TABS(lst='tabs'):
    return f'<div role="tablist" style="flex: none; display: flex; justify-content: center; gap: 22px"><sc-for list="{{{{{lst}}}}}" as="t" hint-placeholder-count="4"><button type="button" role="tab" onClick="{{{{t.pick}}}}" style="height: 36px; border: 0; background: transparent; padding: 0 2px; color: {{{{t.ink}}}}; font: inherit; font-size: 15px; font-weight: {{{{t.fw}}}}; box-shadow: inset 0 -2px 0 {{{{t.line}}}}">{{{{t.l}}}}</button></sc-for></div>'
def ROWS(*rows):
    out = []
    for i, r in enumerate(rows):
        sep = f'box-shadow: inset 0 -1px 0 {LINE};' if i < len(rows) - 1 else ''
        kind, label = r[0], r[1]
        if kind == 'step':
            out.append(f'<div style="min-height: 48px; display: flex; align-items: center; padding: 0 6px 0 16px; {sep}"><span style="flex: 1; font-size: 16px; color: {INK}">{label}</span><button type="button" aria-label="{label}: before" onClick="{{{{{r[3]}}}}}" style="width: 40px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L.replace("24", "20")}</button><span style="min-width: 70px; text-align: center; font-size: 16px; font-weight: 600; color: {INK}; font-variant-numeric: tabular-nums">{{{{{r[2]}}}}}</span><button type="button" aria-label="{label}: after" onClick="{{{{{r[4]}}}}}" style="width: 40px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_R.replace("18", "20")}</button></div>')
        elif kind == 'link':
            val = f'<span style="font-size: 16px; color: {SOFT}">{r[2]}</span>' if len(r) > 2 and r[2] else ''
            href = r[3] if len(r) > 3 else ''
            tag, close = (f'<a href="{href}"', '</a>') if href else ('<button type="button"' + (f' onClick="{{{{{r[4]}}}}}"' if len(r) > 4 else ''), '</button>')
            out.append(f'{tag} style="width: 100%; min-height: 48px; box-sizing: border-box; border: 0; background: transparent; display: flex; align-items: center; gap: 8px; padding: 0 12px 0 16px; color: {INK}; text-decoration: none; font: inherit; text-align: left; {sep}"><span style="flex: 1; font-size: 16px">{label}</span>{val}<span style="color: {SOFT}; display: flex">{CHEV_R}</span>{close}')
        elif kind == 'val':
            out.append(f'<div style="min-height: 48px; display: flex; align-items: center; gap: 8px; padding: 0 16px; {sep}"><span style="flex: 1; font-size: 16px; color: {INK}">{label}</span><span style="font-size: 16px; color: {SOFT}; font-variant-numeric: tabular-nums">{r[2]}</span></div>')
        elif kind == 'raw':
            out.append(label)
    return f'<div style="flex: none; border-radius: 12px; background: {FILL}; overflow: hidden">{"".join(out)}</div>'
def FLOAT(change, mids='', play=True, bottom=34, sticky=True):
    ch = f'<button type="button" onClick="{{{{openChange}}}}" style="flex: 1; min-width: 0; height: 52px; border: 0; background: transparent; padding: 0 12px; display: flex; align-items: center; gap: 6px; color: {INK}; font: inherit; font-size: 16px; font-weight: 600; white-space: nowrap">{change}<span style="display: flex">{CHEV_U}</span></button>' if change else '<span style="flex: 1"></span>'
    pl = f'<button type="button" aria-label="{{{{playLabel}}}}" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="flex: none; width: 52px; height: 52px; border: 0; border-radius: 26px; background: {ACCENT}; color: {INK}; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOP}</sc-if><sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAY}</sc-if></button>' if play else ''
    pos = f'position: absolute; left: 16px; right: 16px; bottom: {bottom}px; z-index: 40;' if sticky else 'position: relative;'
    return f'<div role="toolbar" style="{pos} height: 68px; box-sizing: border-box; padding: 0 8px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 8px">{ch}{mids}{pl}</div>'
PILL = lambda label, act, on='': f'<button type="button" onClick="{{{{{act}}}}}" {("aria-pressed=\"{{" + on + "}}\"") if on else ""} style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {{{{{(on + "Bg") if on else "pillBg"}}}}}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; white-space: nowrap">{label}</button>'
def WHEEL(cols):
    colsh = ''.join(f'<div style="flex: {flex}; min-width: 0; display: flex; flex-direction: column"><sc-for list="{{{{{lst}}}}}" as="w" hint-placeholder-count="7"><button type="button" onClick="{{{{w.pick}}}}" style="height: 44px; border: 0; background: transparent; color: {INK}; opacity: {{{{w.op}}}}; font: inherit; font-size: 18px; font-weight: {{{{w.fw}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{w.l}}}}</button></sc-for></div>' for lst, flex in cols)
    return f'<div style="position: relative; display: flex; gap: 4px"><div aria-hidden="true" style="position: absolute; left: 0; right: 0; top: 132px; height: 44px; border-radius: 10px; background: {FILL}"></div><div style="position: relative; flex: 1; display: flex; gap: 4px">{colsh}</div></div>'
def SHEET_PHONE(cond, head_left, body, foot=''):
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.28)"></div><section role="dialog" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; border-radius: 22px 22px 0 0; background: {SHEET}; padding: 8px 16px 40px; display: flex; flex-direction: column; gap: 12px"><div style="display: flex; align-items: center; justify-content: space-between; min-height: 44px"><span style="font-size: 16px; font-weight: 600; color: {INK}">{head_left}</span><button type="button" onClick="{{{{closeSheet}}}}" style="height: 44px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 17px; font-weight: 600">Done</button></div>{body}{foot}</section></sc-if>'
def MORESHEET(title, rows, foot=''):
    return SHEET_PHONE('moreOn', title, rows, f'<p style="margin: 0; font-size: 13px; color: {SOFT}">{foot}</p>' if foot else '')

def phone(fname, title, body, js, sheets='', bg=PAGE):
    html = HEAD % title + f"""<div style="width: 450px; height: 920px; position: relative; font-family: {FONT}">
<div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: {bg}; color: {INK}; display: flex; flex-direction: column">
<div style="flex: none; height: 54px; position: relative">{STATUS}</div>
{body}
{sheets}
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: {INK}; z-index: 90"></div>
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":450,"height":920}}}}'>
{PRE}
{js}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)

def laptop(fname, title, main, aside, js, pops='', section='Practice'):
    side = SIDE
    for word, href in (('Learn', '#'), ('Songs', 'SongsLaptop.dc.html'), ('Practice', 'Laptop.dc.html')):
        on = word == section
        st = ('background: #EAE2D7; color: #1A1612; text-decoration: none; font-size: 16px; font-weight: 600' if on else 'background: transparent; color: #4A433C; text-decoration: none; font-size: 16px; font-weight: 500')
        side = re.sub(r'<a href="[^"]*"( aria-current="page")? style="(height: 44px; border-radius: 10px; display: flex; align-items: center; gap: 12px; padding: 0 12px; )[^"]*">((?:(?!</a>).)*?)' + word + '</a>',
                      lambda m: f'<a href="{href}"' + (' aria-current="page"' if on else '') + f' style="{m.group(2)}{st}">{m.group(3)}{word}</a>', side, count=1, flags=re.S)
    asidehtml = f'<aside class="nos" style="min-height: 0; overflow-y: auto; background: {SHEET}; box-shadow: -1px 0 0 {LINE}; padding: 28px 28px 28px; display: flex; flex-direction: column; gap: 18px">{aside}</aside>' if aside else ''
    cols = 'minmax(0, 1fr) 440px' if aside else 'minmax(0, 1fr)'
    html = HEAD % title + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: {PAGE}; color: {INK}; font-family: {FONT}; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{side}
<div style="position: relative; min-width: 0; display: grid; grid-template-columns: {cols}; grid-template-rows: minmax(0, 1fr)">
<div style="position: relative; min-width: 0; min-height: 0; display: flex; flex-direction: column">{main}</div>
{asidehtml}
{pops}
</div>
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
{PRE}
{js}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)

def POP_L(cond, body, pos='right: 470px; bottom: 120px', w=420):
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" style="position: absolute; {pos}; z-index: 61; width: {w}px; box-sizing: border-box; border-radius: 16px; background: {SHEET}; padding: 14px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">{body}</div></sc-if>'

# A page in the calm shape: phone and laptop from one description
def calm_page(stem, title, js, stage_phone, stage_laptop, tabs=True, rows='', change='', mids='', more='', more_title='', more_foot='', wheel_cols=None, wheel_head='', back='Main.dc.html', back_l='Laptop.dc.html', hero=60, aside_extra='', play=True, section='Practice', heart=False):
    right = ICONBTN('Favourite', HEART) if heart else ''
    wheel_body = WHEEL(wheel_cols) if wheel_cols else ''
    body = f"""{BAR(back, right)}
{HERO(hero)}
<div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 16px 16px 118px">
<div style="flex: 1; min-height: 0; position: relative">{stage_phone}</div>
{TABS() if tabs else ''}
{rows}
</div>
{FLOAT(change, mids, play)}"""
    sheets = (SHEET_PHONE('changeOn', wheel_head, wheel_body) if wheel_cols else '') + (MORESHEET(more_title, more, more_foot) if more else '')
    phone(stem, title + ', phone', body, js, sheets)
    main = f"""<header style="flex: none; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px"><a href="{back_l}" aria-label="Back" style="width: 44px; height: 44px; margin-left: -10px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a><div style="display: flex; gap: 4px">{right}<button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div></header>
{HERO(hero + 28, 8)}
<div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 14px; padding: 22px 64px 28px">
<div style="flex: 1; min-height: 0; position: relative">{stage_laptop}</div>
{TABS() if tabs else ''}
<div style="flex: none; display: flex; justify-content: center"><div style="width: 560px">{FLOAT('', mids, play, sticky=False)}</div></div>
</div>"""
    aside = (f'<div style="display: flex; align-items: center; justify-content: space-between"><h2 style="margin: 0; font-size: 20px; font-weight: 700">{change}</h2></div>' + (WHEEL(wheel_cols) if wheel_cols else '') if change else '') + rows + aside_extra
    pops = POP_L('moreOn', f'<span style="font-size: 16px; font-weight: 600">{more_title}</span>' + more, 'right: 40px; top: 64px', 380) if more else ''
    laptop(stem + 'Laptop' if stem != 'Main' else 'Laptop', title + ', laptop', main, aside, js, pops, section)

def RB_JS(extra):
    return 'class Component extends DCLogic {\n  renderVals() {\n    const st = this.state || {}; const set = (o) => this.setState(o);\n' + extra + '\n  }\n}\n'

# ═════════════════════════ PRACTICE ═════════════════════════
# Scales and keys
SC_JS = RB_JS(r'''
    const KINDS = ['Major', 'Natural minor', 'Harmonic minor', 'Melodic minor', 'Dorian', 'Mixolydian', 'Major pentatonic', 'Minor pentatonic', 'Blues'];
    const IV = [[0,2,4,5,7,9,11],[0,2,3,5,7,8,10],[0,2,3,5,7,8,11],[0,2,3,5,7,9,11],[0,2,3,5,7,9,10],[0,2,4,5,7,9,10],[0,2,4,7,9],[0,3,5,7,10],[0,3,5,6,7,10]];
    const SIG = ['No sharps or flats', '5 flats', '2 sharps', '3 flats', '4 sharps', '1 flat', '6 sharps', '1 sharp', '4 flats', '3 sharps', '2 flats', '5 sharps'];
    const root = st.root ?? 7, kind = st.kind ?? 0, tab = st.tab ?? 'Keys', oct = st.oct ?? 2;
    const ivs = IV[kind]; const deg = ['1','2','3','4','5','6','7'];
    const marks = {}; const base = 48 + root;
    for (let o = 0; o < 2; o++) ivs.forEach((iv, i) => { marks[base + o * 12 + iv] = [i === 0 ? ROLE[1] : i === 2 ? ROLE[3] : i === 4 ? ROLE[5] : '#E9DFD3', NN[(root + iv) % 12]]; });
    marks[base + 24] = [ROLE[1], NN[root]];
    return { ...common(st, set), name: NN[root] + ' ' + KINDS[kind].toLowerCase().replace('major', 'major'), sub: KINDS[kind] + ' scale · ' + (kind === 0 ? SIG[root] : ivs.length + ' notes'),
      kb: calmKeys(48 + (root > 4 ? 5 : 0), 48 + (root > 4 ? 5 : 0) + 30, marks, st.W ?? 370, st.H ?? 230), kbL: calmKeys(48 + (root > 4 ? 5 : 0), 48 + (root > 4 ? 5 : 0) + 30, marks, 890, 330),
      tabs: tabsOf(['Keys', 'Staff', 'Fingering', 'Chords'], tab, set), isKeys: tab === 'Keys', isStaff: tab === 'Staff', isFing: tab === 'Fingering', isChords: tab === 'Chords',
      oct: oct + (oct === 1 ? ' octave' : ' octaves'), octDown: () => set({ oct: Math.max(1, oct - 1) }), octUp: () => set({ oct: Math.min(4, oct + 1) }),
      wRoot: wheel(NN, root, (i) => set({ root: i })), wKind: wheel(KINDS, kind, (i) => set({ kind: i })),
      chords: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'].map((n, i) => ({ n, c: [NN[root], NN[(root + 2) % 12] + 'm', NN[(root + 4) % 12] + 'm', NN[(root + 5) % 12], NN[(root + 7) % 12], NN[(root + 9) % 12] + 'm', NN[(root + 11) % 12] + '°'][i] })),
      fing: [['Right hand', '1 2 3 1 2 3 4 · 1 2 3 1 2 3 4 5'], ['Left hand', '5 4 3 2 1 3 2 · 1 4 3 2 1 3 2 1']].map(([h, f]) => ({ h, f })),
      handsBg: C.fill, pillBg: C.fill, hands: st.hands ?? 'Both', cycleHands: () => set({ hands: { Both: 'Right', Right: 'Left', Left: 'Both' }[st.hands ?? 'Both'] }) };''')
STAFFIMG = lambda w, h: f'<svg viewBox="0 0 360 120" width="{w}" height="{h}" role="img" aria-label="The scale on the staff" style="display: block; max-width: 100%"><path d="M8 34H352M8 46H352M8 58H352M8 70H352M8 82H352" stroke="{INK}" stroke-width="0.9"></path><text x="10" y="86" font-size="58" font-family="Noto Music, serif" fill="{INK}">𝄞</text><text x="54" y="52" font-size="22" font-family="Noto Music, serif" fill="{INK}">♯</text>' + ''.join(f'<ellipse cx="{86 + i*33}" cy="{88 - i*6}" rx="6.4" ry="4.6" transform="rotate(-20 {86 + i*33} {88 - i*6})" fill="{INK}"></ellipse><path d="M{92.2 + i*33} {86 - i*6}V{60 - i*6}" stroke="{INK}" stroke-width="1.2"></path>' for i in range(8)) + f'<path d="M78 94H96" stroke="{INK}" stroke-width="0.9"></path></svg>'
def SC_STAGE(k):
    return f'''<sc-if value="{{{{isKeys}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; display: flex; align-items: center">{KEYS(230 if k == 'kb' else 330).replace('kb.', k + '.')}</div></sc-if>
<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center; padding: 12px">{STAFFIMG('100%', 160 if k == 'kb' else 260)}</div></sc-if>
<sc-if value="{{{{isFing}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 10px"><sc-for list="{{{{fing}}}}" as="f" hint-placeholder-count="2"><div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 13px; color: {SOFT}">{{{{f.h}}}}</span><span style="font-size: 22px; font-weight: 600; letter-spacing: 0.08em; font-variant-numeric: tabular-nums">{{{{f.f}}}}</span></div></sc-for></div></sc-if>
<sc-if value="{{{{isChords}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-content: center"><sc-for list="{{{{chords}}}}" as="c" hint-placeholder-count="7"><button type="button" style="height: 84px; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: {INK}"><span style="font-size: 24px; font-weight: 700">{{{{c.c}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{c.n}}}}</span></button></sc-for></div></sc-if>'''
calm_page('Scales', 'Scales and keys', SC_JS, SC_STAGE('kb'), SC_STAGE('kbL'),
          rows=ROWS(('step', 'Octaves', 'oct', 'octDown', 'octUp'), ('link', 'Practise', '', 'ExercisesLaptop.dc.html')).replace('ExercisesLaptop.dc.html', 'Exercise.dc.html'),
          change='Change scale', mids=PILL('{{hands}} hands', 'cycleHands'), wheel_cols=[('wRoot', 1), ('wKind', 2.2)], wheel_head='Show flats',
          more=ROWS(('link', 'Keyboard', ''), ('link', 'Staff', ''), ('link', 'Key signature and the circle', '', 'CircleOfFifths.dc.html')), more_title='Scale')

# Intervals
IV_JS = RB_JS(r'''
    const NAMES = ['Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave', 'Minor 9th', 'Major 9th'];
    const SONGS = { 7: 'Twinkle, Twinkle, Little Star', 5: 'Here Comes the Bride', 4: 'When the Saints', 3: 'Greensleeves', 12: 'Somewhere over the Rainbow', 2: 'Happy Birthday', 9: 'My Bonnie', 1: 'Jaws', 10: 'Star Trek', 11: 'Take On Me', 6: 'The Simpsons', 8: 'The Entertainer' };
    const n = st.n ?? 7, from = st.from ?? 0, tab = st.tab ?? 'Keys', way = st.way ?? 'Up';
    const lo = 60 + from, hi = lo + n;
    const marks = { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], NN[hi % 12]] };
    return { ...common(st, set), name: NAMES[n], sub: n + (n === 1 ? ' semitone' : ' semitones') + ' · ' + NN[lo % 12] + ' to ' + NN[hi % 12],
      kb: calmKeys(57, 81, marks, st.W ?? 370, 230), kbL: calmKeys(53, 84, marks, 890, 330),
      tabs: tabsOf(['Keys', 'Staff', 'Songs'], tab, set), isKeys: tab === 'Keys', isStaff: tab === 'Staff', isSongs: tab === 'Songs',
      fromL: NN[from], fromDown: () => set({ from: (from + 11) % 12 }), fromUp: () => set({ from: (from + 1) % 12 }),
      song: SONGS[n] || '—', songs: [[SONGS[n] || '—', 'Up, its first two notes'], ['Amazing Grace', 'Up, bars 2 to 3']].map(([s, l]) => ({ s, l })),
      wName: wheel(NAMES, n, (i) => set({ n: i })), way, wayBg: C.fill, pillBg: C.fill, cycleWay: () => set({ way: { Up: 'Down', Down: 'Together', Together: 'Up' }[way] }) };''')
IV_STAGE = lambda k: f'''<sc-if value="{{{{isKeys}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; display: flex; align-items: center">{KEYS(230 if k == 'kb' else 330).replace('kb.', k + '.')}</div></sc-if>
<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 200 120" width="{'300' if k == 'kb' else '520'}" role="img" aria-label="The interval on the staff"><path d="M8 34H192M8 46H192M8 58H192M8 70H192M8 82H192" stroke="{INK}" stroke-width="0.9"></path><text x="10" y="86" font-size="58" font-family="Noto Music, serif" fill="{INK}">𝄞</text><path d="M86 94H110" stroke="{INK}" stroke-width="0.9"></path><ellipse cx="98" cy="94" rx="6.4" ry="4.6" transform="rotate(-20 98 94)" fill="{INK}"></ellipse><ellipse cx="150" cy="70" rx="6.4" ry="4.6" transform="rotate(-20 150 70)" fill="{INK}"></ellipse></svg></div></sc-if>
<sc-if value="{{{{isSongs}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 10px"><sc-for list="{{{{songs}}}}" as="s" hint-placeholder-count="2"><div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 14px 16px; display: flex; align-items: center; gap: 12px"><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 18px; font-weight: 600">{{{{s.s}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{s.l}}}}</span></span><span style="width: 44px; height: 44px; border-radius: 22px; background: {FILL}; display: flex; align-items: center; justify-content: center">{PLAY.replace('22', '18')}</span></div></sc-for></div></sc-if>'''
calm_page('Intervals', 'Intervals', IV_JS, IV_STAGE('kb'), IV_STAGE('kbL'),
          rows=ROWS(('step', 'From', 'fromL', 'fromDown', 'fromUp'), ('val', 'Sounds like', '{{song}}'), ('link', 'Train your ear', '', 'Quiz.dc.html')),
          change='Change interval', mids=PILL('{{way}}', 'cycleWay'), wheel_cols=[('wName', 1)], wheel_head='Past the octave',
          more=ROWS(('link', 'Keyboard', ''), ('link', 'Staff', ''), ('link', 'Note names', 'C D E')), more_title='Interval')

# A progression's page
PR_JS = RB_JS(r'''
    const PROGS = [['Axis of Awesome', ['I', 'V', 'vi', 'IV']], ['50s doo-wop', ['I', 'vi', 'IV', 'V']], ['Pachelbel', ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V']], ['Royal Road', ['IV', 'V', 'iii', 'vi']], ['ii–V–I', ['ii', 'V', 'I']], ['Blues', ['I', 'IV', 'I', 'V']]];
    const DEG = { I: 0, ii: 2, iii: 4, IV: 5, V: 7, vi: 9 }; const ROLEC = { I: '#E19E8C', vi: '#E19E8C', iii: '#E19E8C', IV: '#85B8DC', ii: '#85B8DC', V: '#9BC093' };
    const p = st.p ?? 0, key = st.key ?? 0, at = st.at ?? 1, tab = st.tab ?? 'Chords';
    const [title, nums] = PROGS[p];
    const chord = (n) => NN[(key + DEG[n]) % 12] + (n === n.toLowerCase() ? 'm' : '');
    const cur = nums[at % nums.length]; const r = (key + DEG[cur]) % 12; const minor = cur === cur.toLowerCase();
    const marks = {}; [0, minor ? 3 : 4, 7].forEach((iv, i) => { const m = 60 + ((r + iv) % 12) + (r + iv >= 12 && r > 4 ? 0 : 0); marks[m] = [[ROLE[1], ROLE[3], ROLE[5]][i], NN[(r + iv) % 12]]; });
    marks[48 + r] = [ROLE[1], NN[r]];
    return { ...common(st, set), name: nums.join(' – '), sub: title + ' · ' + NN[key] + ' major',
      tiles: nums.map((n, i) => ({ n, c: chord(n), bg: i === at ? C.accent : C.sheet, ring: i === at ? 'none' : '0 0 0 1px ' + C.line, role: ROLEC[n], pick: () => set({ at: i }) })),
      kb: calmKeys(48, 76, marks, st.W ?? 370, 150), kbL: calmKeys(48, 84, marks, 890, 230),
      tabs: tabsOf(['Chords', 'Keys', 'Staff'], tab, set), isChords: tab === 'Chords', isKeys: tab === 'Keys', isStaff: tab === 'Staff',
      keyL: NN[key] + ' major', keyDown: () => set({ key: (key + 11) % 12 }), keyUp: () => set({ key: (key + 1) % 12 }),
      wProg: wheel(PROGS.map((x) => x[0]), p, (i) => set({ p: i, at: 0 })), wKey: wheel(NN, key, (i) => set({ key: i })),
      loopBg: st.loop ? C.accent : C.fill, loop: !!st.loop, pillBg: C.fill, toggleLoop: () => set({ loop: !st.loop }) };''')
PR_STAGE = lambda k, th: f'''<sc-if value="{{{{isChords}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 14px"><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{tiles}}}}" as="t" hint-placeholder-count="4"><button type="button" onClick="{{{{t.pick}}}}" style="height: {th}px; border: 0; border-radius: 14px; background: {{{{t.bg}}}}; box-shadow: {{{{t.ring}}}}, inset 0 -4px 0 {{{{t.role}}}}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: {INK}"><span style="font-size: {th // 3}px; font-weight: 700; line-height: 1">{{{{t.c}}}}</span><span style="font-size: 15px; color: {SOFT}">{{{{t.n}}}}</span></button></sc-for></div>{KEYS(150 if k == 'kb' else 230).replace('kb.', k + '.')}</div></sc-if>
<sc-if value="{{{{isKeys}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; align-items: center">{KEYS(230 if k == 'kb' else 330).replace('kb.', k + '.')}</div></sc-if>
<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center; padding: 12px">{STAFFIMG('100%', 160)}</div></sc-if>'''
calm_page('Progression', 'A progression', PR_JS, PR_STAGE('kb', 96), PR_STAGE('kbL', 150), back='Progressions.dc.html', back_l='ProgressionsLaptop.dc.html', hero=48,
          rows=ROWS(('step', 'Key', 'keyL', 'keyDown', 'keyUp'), ('link', 'Voicing', 'Voice-led'), ('link', 'Practise in the Player', '')),
          change='Change progression', mids=PILL('Loop', 'toggleLoop', 'loop'), wheel_cols=[('wProg', 2), ('wKey', 1)], wheel_head='Progressions',
          more=ROWS(('link', 'Add to favourites', ''), ('link', 'Open in the Chord player', '', 'ChordPlayer.dc.html'), ('link', 'More like it', '')), more_title='Progression', heart=True)

# The Chord player: the sheet is the stage
CP_JS = RB_JS(r'''
    const SECS = [['Verse', 2, [['C', 4], ['G', 4], ['Am', 4], ['F', 4]]], ['Chorus', 1, [['F', 4], ['G', 4], ['C', 2], ['C/E', 2], ['F', 2], ['G7', 2], ['C', 4]]]];
    const at = st.at ?? [0, 1], styles = ['Pop 1 · straight 8ths', 'Pop ballad', 'Rock 8ths', 'Worship', 'Swing', 'Bossa nova', 'Broken chords'], s = st.style ?? 0, bpm = st.bpm ?? 96;
    const secs = SECS.map(([name, rep, ch], si) => { const bars = []; let cur = [], b = 0; ch.forEach(([c, n], ci) => { cur.push({ c, grow: n, bg: st.playing && at[0] === si && at[1] === ci ? C.accent : C.sheet, pick: () => set({ at: [si, ci], sheet: 'chord' }) }); b += n; if (b >= 4) { bars.push({ n: bars.length + 1, tiles: cur }); cur = []; b = 0; } }); return { name, rep: '× ' + rep, bars }; });
    const ch = SECS[at[0]][2][at[1]][0]; const m = ch.match(/^([A-G][♭♯]?)(m?)/); const r = NN.indexOf(m[1]);
    const marks = {}; [0, m[2] ? 3 : 4, 7].forEach((iv, i) => { marks[60 + ((r + iv) % 12)] = [[ROLE[1], ROLE[3], ROLE[5]][i], NN[(r + iv) % 12]]; }); marks[36 + r + 12] = [ROLE[1], NN[r]];
    return { ...common(st, set), name: 'My verse and chorus', sub: styles[s] + ' · C major · ' + bpm + ' BPM', secs,
      kb: calmKeys(48, 76, marks, st.W ?? 370, 110), kbL: calmKeys(41, 84, marks, 890, 170),
      chordOn: st.sheet === 'chord', wStyle: wheel(styles, s, (i) => set({ style: i })),
      wRoot: wheel(NN, r, () => {}), wQual: wheel(['', 'm', '7', 'maj7', 'm7', 'sus4', 'dim'], m[2] ? 1 : 0, () => {}), wLen: wheel(['1 beat', '2 beats', '3 beats', '4 beats', '8 beats'], 3, () => {}),
      bpm: bpm + ' BPM', bpmDown: () => set({ bpm: bpm - 2 }), bpmUp: () => set({ bpm: bpm + 2 }), loop: !!st.loop, loopBg: st.loop ? C.accent : C.fill, toggleLoop: () => set({ loop: !st.loop }), pillBg: C.fill };''')
CP_STAGE = lambda k, th: f'''<div class="nos" style="position: absolute; inset: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 14px"><sc-for list="{{{{secs}}}}" as="x" hint-placeholder-count="2"><section style="display: flex; flex-direction: column; gap: 6px"><div style="display: flex; align-items: baseline; justify-content: space-between; padding: 0 4px"><span style="font-size: 17px; font-weight: 700">{{{{x.name}}}}</span><span style="font-size: 15px; color: {SOFT}">{{{{x.rep}}}}</span></div><div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{x.bars}}}}" as="b" hint-placeholder-count="4"><div style="height: {th}px; border-radius: 12px; background: {FILL}; padding: 3px; display: flex; gap: 3px; box-sizing: border-box"><sc-for list="{{{{b.tiles}}}}" as="t" hint-placeholder-count="1"><button type="button" onClick="{{{{t.pick}}}}" style="flex: {{{{t.grow}}}} 1 0; min-width: 0; border: 0; border-radius: 9px; background: {{{{t.bg}}}}; color: {INK}; font: inherit; font-size: {th // 3}px; font-weight: 700">{{{{t.c}}}}</button></sc-for></div></sc-for></div></section></sc-for><button type="button" style="height: 48px; border: 0; border-radius: 12px; background: transparent; box-shadow: inset 0 0 0 1.5px {LINE}; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600">Add section</button></div>'''
CP_ROWS = ROWS(('step', 'Tempo', 'bpm', 'bpmDown', 'bpmUp'), ('link', 'Instruments', 'Piano, bass, drums'))
CP_CHORD = WHEEL([('wRoot', 1), ('wQual', 1), ('wLen', 1.4)])
calm_page('ChordPlayer', 'Chord player', CP_JS, CP_STAGE('kb', 60), CP_STAGE('kbL', 84), tabs=False, hero=30, rows=CP_ROWS,
          change='Style', mids=PILL('Loop', 'toggleLoop', 'loop'), wheel_cols=[('wStyle', 1)], wheel_head='Style',
          more=ROWS(('link', 'Chord sheets', ''), ('link', 'Save as my chord sheet', ''), ('link', 'Randomize chords', ''), ('link', 'Open in Progressions', '', 'Progressions.dc.html'), ('link', 'Share link', '')), more_title='Chord sheet')
for f in ('ChordPlayer', 'ChordPlayerLaptop'):
    s = open(OUT + f + '.dc.html').read()
    sheet = SHEET_PHONE('chordOn', 'Chord · its length', CP_CHORD, f'<button type="button" onClick="{{{{closeSheet}}}}" style="height: 48px; border: 0; border-radius: 12px; background: {FILL}; color: #B3261E; font: inherit; font-size: 16px; font-weight: 600">Delete chord</button>') if f == 'ChordPlayer' else POP_L('chordOn', f'<span style="font-size: 16px; font-weight: 600">Chord · its length</span>{CP_CHORD}', 'left: 120px; top: 260px', 460)
    s = s.replace('<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px', sheet + '\n<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px') if f == 'ChordPlayer' else s.replace('\n</div>\n</div>\n<img src="' + LAPTOP_FRAME, sheet + '\n</div>\n</div>\n<img src="' + LAPTOP_FRAME)
    open(OUT + f + '.dc.html', 'w').write(s)

# An exercise
EX_JS = RB_JS(r'''
    const EXS = ['Hanon No. 1', 'Hanon No. 2', 'Five-finger position', '6th-diminished scale', 'Drop-2 7ths', '2-5-1 scale', 'Rapid switch'];
    const e = st.e ?? 0, tab = st.tab ?? 'Staff', bpm = st.bpm ?? 60, key = st.key ?? 0;
    const marks = {}; [0, 2, 4, 5, 7].forEach((iv, i) => { marks[60 + key + iv] = [i === 0 ? ROLE[1] : '#F3D9A8', NN[(key + iv) % 12]]; marks[48 + key + iv] = [i === 0 ? ROLE[1] : '#D9CEEA', NN[(key + iv) % 12]]; });
    return { ...common(st, set), name: EXS[e], sub: 'Finger technique · ' + NN[key] + ' major · target 108 BPM',
      tabs: tabsOf(['Staff', 'Keys', 'Technique'], tab, set), isStaff: tab === 'Staff', isKeys: tab === 'Keys', isTech: tab === 'Technique',
      kb: calmKeys(48, 76, marks, st.W ?? 370, 200), kbL: calmKeys(41, 84, marks, 890, 300),
      bpmL: bpm + ' BPM', bpmDown: () => set({ bpm: bpm - 4 }), bpmUp: () => set({ bpm: bpm + 4 }), keyL: NN[key] + ' major', keyDown: () => set({ key: (key + 7) % 12 }), keyUp: () => set({ key: (key + 5) % 12 }),
      wEx: wheel(EXS, e, (i) => set({ e: i })), pct: Math.round(bpm / 108 * 100) + '%', pctW: Math.min(100, Math.round(bpm / 108 * 100)) + '%', pillBg: C.fill, hands: st.hands ?? 'Both', cycleHands: () => set({ hands: { Both: 'Right', Right: 'Left', Left: 'Both' }[st.hands ?? 'Both'] }) };''')
def hanon(w):
    notes = [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 4, 5, 6, 5, 4, 3]; x0, dx = 60, (w - 76) / 16; out = []
    out.append('<path d="' + ''.join(f'M4 {y}H{w-4}' for y in (26, 34, 42, 50, 58)) + f'" stroke="{INK}" stroke-width="0.9" fill="none"></path><text x="6" y="62" font-size="46" font-family="Noto Music, serif" fill="{INK}">𝄞</text>')
    hs = []
    for i, s in enumerate(notes):
        x = x0 + i * dx + (6 if i >= 8 else 0); y = 66 - s * 4
        if s == 0: out.append(f'<path d="M{x-7:.1f} 66H{x+7:.1f}" stroke="{INK}" stroke-width="0.9"></path>')
        out.append(f'<ellipse cx="{x:.1f}" cy="{y}" rx="4.6" ry="3.4" transform="rotate(-20 {x:.1f} {y})" fill="{INK}"></ellipse>'); hs.append((x, y))
    for g in range(4):
        grp = hs[g*4:g*4+4]; top = min(y for _, y in grp) - 26
        out += [f'<path d="M{x+4.2:.1f} {y-1}V{top}" stroke="{INK}" stroke-width="1"></path>' for x, y in grp]
        out.append(f'<path d="M{grp[0][0]+4.2:.1f} {top}H{grp[-1][0]+4.2:.1f}M{grp[0][0]+4.2:.1f} {top+4}H{grp[-1][0]+4.2:.1f}" stroke="{INK}" stroke-width="3"></path>')
    out.append(f'<path d="M{x0 + 8*dx - 3:.1f} 26V58M{w-4} 26V58" stroke="{INK}" stroke-width="0.9"></path>')
    return f'<svg viewBox="0 -6 {w} 82" width="100%" role="img" aria-label="Hanon No. 1, bars 1 and 2" style="display: block">' + ''.join(out) + '</svg>'
EX_STAGE = lambda k, w, kh: f'''<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 14px">{hanon(w)}{hanon(w).replace('bars 1 and 2', 'bars 3 and 4')}<div style="display: flex; justify-content: space-between; font-size: 13px; color: {SOFT}"><span>Bars 1–4 of 28</span><span>Right hand · the left an octave lower</span></div></div></sc-if>
<sc-if value="{{{{isKeys}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; align-items: center">{KEYS(kh).replace('kb.', k + '.')}</div></sc-if>
<sc-if value="{{{{isTech}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 0 6px"><p style="margin: 0; font-size: 19px; line-height: 1.5">Lift each finger high and play it firmly, the hand quiet. Start slowly; raise the tempo only when every note is even.</p><div style="display: flex; align-items: center; gap: 10px"><div style="flex: 1; height: 6px; border-radius: 3px; background: {FILL}"><div style="width: {{{{pctW}}}}; height: 6px; border-radius: 3px; background: #44684A"></div></div><span style="font-size: 14px; color: {SOFT}">{{{{pct}}}} of the target</span></div></div></sc-if>'''
calm_page('Exercise', 'An exercise', EX_JS, EX_STAGE('kb', 340, 200), EX_STAGE('kbL', 900, 300), hero=46, back='Exercises.dc.html', back_l='ExercisesLaptop.dc.html',
          rows=ROWS(('step', 'Tempo', 'bpmL', 'bpmDown', 'bpmUp'), ('step', 'Key', 'keyL', 'keyDown', 'keyUp'), ('link', 'Rhythm', 'Even')),
          change='Change exercise', mids=PILL('{{hands}} hands', 'cycleHands'), wheel_cols=[('wEx', 1)], wheel_head='Exercises',
          more=ROWS(('link', 'Next key', 'Circle of fifths'), ('link', 'Count-in', '1 bar'), ('link', 'Wait for the right note', 'On')), more_title='Exercise', heart=True)

# Metronome: the tempo is the subject
ME_JS = RB_JS(r'''
    const MARK = [[60, 'Largo'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [168, 'Allegro'], [999, 'Presto']];
    const bpm = st.bpm ?? 120, meter = st.meter ?? 4, lv = st.lv || ['accent', 'beat', 'beat', 'beat'], at = st.at ?? 1;
    const cyc = { accent: 'beat', beat: 'silent', silent: 'accent' }; const H = { accent: 100, beat: 60, silent: 0 };
    return { ...common(st, set), name: String(bpm), sub: MARK.find(([t]) => bpm < t)[1] + ' · ' + meter + '/4 · Woodblock',
      beats: Array.from({ length: meter }, (_, i) => { const l = lv[i] || 'beat'; return { n: i + 1, h: H[l] + '%', bg: l === 'accent' ? C.ink : '#A49A90', ring: st.playing && at === i + 1 ? '0 0 0 3px ' + C.accent : '0 0 0 1px ' + C.line, pick: () => set({ lv: Array.from({ length: meter }, (_, j) => j === i ? cyc[l] : (lv[j] || 'beat')) }) }; }),
      down: () => set({ bpm: bpm - 1 }), up: () => set({ bpm: bpm + 1 }), down10: () => set({ bpm: bpm - 10 }), up10: () => set({ bpm: bpm + 10 }), pos: ((bpm - 20) / 280 * 100).toFixed(1) + '%',
      meterL: meter + '/4', mDown: () => set({ meter: Math.max(2, meter - 1) }), mUp: () => set({ meter: Math.min(7, meter + 1) }),
      wBpm: wheel(Array.from({ length: 281 }, (_, i) => String(i + 20)), bpm - 20, (i) => set({ bpm: i + 20 })), wSub: wheel(['None', 'Eighth notes', 'Triplets', 'Sixteenth notes', 'Swung eighths'], st.sub ?? 0, (i) => set({ sub: i })), pillBg: C.fill, tap: () => {} };''')
ME_STAGE = lambda h: f'''<div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 22px"><div style="display: flex; align-items: center; justify-content: center; gap: 10px"><button type="button" onClick="{{{{down10}}}}" style="width: 64px; height: 48px; border: 0; border-radius: 24px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600">−10</button><button type="button" onClick="{{{{down}}}}" style="width: 56px; height: 48px; border: 0; border-radius: 24px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600">−1</button><button type="button" onClick="{{{{up}}}}" style="width: 56px; height: 48px; border: 0; border-radius: 24px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600">+1</button><button type="button" onClick="{{{{up10}}}}" style="width: 64px; height: 48px; border: 0; border-radius: 24px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600">+10</button></div><div role="slider" aria-label="Tempo" style="position: relative; height: 28px; display: flex; align-items: center"><div style="width: 100%; height: 4px; border-radius: 2px; background: {LINE}"></div><div style="position: absolute; left: 0; width: {{{{pos}}}}; height: 4px; border-radius: 2px; background: {INK}"></div><span style="position: absolute; left: calc({{{{pos}}}} - 14px); width: 28px; height: 28px; border-radius: 14px; background: {SHEET}; box-shadow: 0 1px 4px rgba(51,41,33,.3)"></span></div><div role="group" aria-label="Beats" style="display: flex; gap: 8px; height: {h}px"><sc-for list="{{{{beats}}}}" as="b" hint-placeholder-count="4"><button type="button" aria-label="Beat {{{{b.n}}}}" onClick="{{{{b.pick}}}}" style="position: relative; flex: 1; min-width: 0; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: {{{{b.ring}}}}; overflow: hidden; padding: 0"><span style="position: absolute; left: 0; right: 0; bottom: 0; height: {{{{b.h}}}}; background: {{{{b.bg}}}}"></span></button></sc-for></div></div>'''
calm_page('Metronome', 'Metronome', ME_JS, ME_STAGE(120), ME_STAGE(220), tabs=False, hero=96,
          rows=ROWS(('step', 'Time signature', 'meterL', 'mDown', 'mUp'), ('link', 'Subdivision', 'None'), ('link', 'Speed trainer', 'Off')),
          change='Tempo', mids=PILL('Tap tempo', 'tap'), wheel_cols=[('wBpm', 1), ('wSub', 2)], wheel_head='Tempo · subdivision',
          more=ROWS(('link', 'Sound', 'Woodblock'), ('link', 'Silent bars', 'Off'), ('link', 'Count-in', '1 bar'), ('link', 'Flash on the beat', 'Off')), more_title='Metronome')

# Tuner: the note is the subject
TU_JS = RB_JS(r'''
    const cents = st.cents ?? -6, a4 = st.a4 ?? 440, mic = st.mic ?? true, ok = Math.abs(cents) <= 3;
    const ticks = Array.from({ length: 21 }, (_, i) => { const c = -50 + i * 5, a = (c / 50) * 60 * Math.PI / 180, l = c % 25 === 0; return { d: 'M' + (160 + Math.sin(a) * (l ? 112 : 120)).toFixed(1) + ' ' + (170 - Math.cos(a) * (l ? 112 : 120)).toFixed(1) + 'L' + (160 + Math.sin(a) * 134).toFixed(1) + ' ' + (170 - Math.cos(a) * 134).toFixed(1) }; });
    return { ...common(st, set), name: mic ? 'A4' : 'Tuner', sub: mic ? (ok ? 'In tune' : cents < 0 ? 'Flat by ' + -cents + ' cents' : 'Sharp by ' + cents + ' cents') + ' · ' + (a4 * Math.pow(2, cents / 1200)).toFixed(1) + ' Hz' : 'Listens while open',
      ticks, needle: 'rotate(' + (cents / 50 * 60) + ' 160 170)', nc: ok ? '#44684A' : '#C26A2E', micOn: mic, micOff: !mic, allow: () => set({ mic: true }),
      a4L: 'A4 = ' + a4 + ' Hz', aDown: () => set({ a4: a4 - 1 }), aUp: () => set({ a4: a4 + 1 }), pillBg: C.fill, ref: () => {} };''')
TU_STAGE = lambda w: f'''<sc-if value="{{{{micOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 320 190" width="{w}" aria-hidden="true" style="max-width: 100%"><path d="M43.9 104A134 134 0 0 1 276.1 104" fill="none" stroke="{FILL}" stroke-width="24"></path><path d="M149.5 36.4A134 134 0 0 1 170.5 36.4" fill="none" stroke="#9BC093" stroke-width="24"></path><sc-for list="{{{{ticks}}}}" as="t" hint-placeholder-count="21"><path d="{{{{t.d}}}}" stroke="{SOFT}" stroke-width="1.6"></path></sc-for><g transform="{{{{needle}}}}"><path d="M160 170L160 44" stroke="{{{{nc}}}}" stroke-width="4" stroke-linecap="round"></path></g><circle cx="160" cy="170" r="9" fill="{INK}"></circle><text x="34" y="188" font-size="13" fill="{SOFT}">−50</text><text x="268" y="188" font-size="13" fill="{SOFT}">+50</text></svg></div></sc-if><sc-if value="{{{{micOff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center"><p style="margin: 0; font-size: 17px; line-height: 1.45; color: {SOFT}">Allow the microphone and play a note: how far it is from in tune shows here.</p><button type="button" onClick="{{{{allow}}}}" style="height: 48px; padding: 0 22px; border: 0; border-radius: 24px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Allow the microphone</button></div></sc-if>'''
calm_page('Tuner', 'Tuner', TU_JS, TU_STAGE(360), TU_STAGE(640), tabs=False, hero=72,
          rows=ROWS(('step', 'Reference pitch', 'a4L', 'aDown', 'aUp'), ('link', 'Note names', 'C D E')),
          change='', mids=f'<span style="flex: 1; padding-left: 14px; font-size: 15px; color: {SOFT}">Listening</span>' + PILL('Play A4', 'ref'), play=False, more=ROWS(('link', 'Show', 'Cents and Hz'), ('link', 'Note names', 'C D E')), more_title='Tuner')

# Chord finder: the chord found is the subject
CF_JS = RB_JS(r'''
    const held = st.held ?? [52, 60, 67, 71], tab = st.tab ?? 'Keys'; const empty = held.length === 0;
    const roles = { 52: [ROLE[3], 'E'], 60: [ROLE[1], 'C'], 67: [ROLE[5], 'G'], 71: [ROLE[7], 'B'] };
    const marks = {}; held.forEach((m) => { marks[m] = roles[m] || [C.accent, NN[m % 12]]; });
    return { ...common(st, set), name: empty ? 'Play a chord' : 'Cmaj7/E', sub: empty ? 'Hold three or more keys' : 'C major 7th, 1st inversion · Imaj7 in C major',
      kb: calmKeys(48, 76, marks, st.W ?? 370, 230), kbL: calmKeys(41, 84, marks, 890, 330),
      tabs: tabsOf(['Keys', 'Staff', 'Notes'], tab, set), isKeys: tab === 'Keys', isStaff: tab === 'Staff', isNotes: tab === 'Notes',
      notes: [['E', '3rd', 'in the bass'], ['C', 'root', ''], ['G', '5th', ''], ['B', '7th', '']].map(([n, d, b]) => ({ n, d, b })),
      clear: () => set({ held: [] }), pillBg: C.fill, wKey: wheel(NN, 0, () => {}) };''')
CF_STAGE = lambda k, kh: f'''<sc-if value="{{{{isKeys}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; display: flex; align-items: center">{KEYS(kh).replace('kb.', k + '.')}</div></sc-if>
<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 200 120" width="{300 if k == 'kb' else 520}" role="img" aria-label="Cmaj7/E on the staff"><path d="M8 34H192M8 46H192M8 58H192M8 70H192M8 82H192" stroke="{INK}" stroke-width="0.9"></path><text x="10" y="86" font-size="58" font-family="Noto Music, serif" fill="{INK}">𝄞</text><ellipse cx="110" cy="82" rx="6.4" ry="4.6" fill="{INK}"></ellipse><ellipse cx="122" cy="76" rx="6.4" ry="4.6" fill="{INK}"></ellipse><ellipse cx="110" cy="64" rx="6.4" ry="4.6" fill="{INK}"></ellipse><ellipse cx="110" cy="52" rx="6.4" ry="4.6" fill="{INK}"></ellipse></svg></div></sc-if>
<sc-if value="{{{{isNotes}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; align-content: center"><sc-for list="{{{{notes}}}}" as="n" hint-placeholder-count="4"><div style="height: 84px; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-size: 28px; font-weight: 700">{{{{n.n}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{n.d}}}} {{{{n.b}}}}</span></div></sc-for></div></sc-if>'''
calm_page('ChordFinder', 'Chord finder', CF_JS, CF_STAGE('kb', 230), CF_STAGE('kbL', 330), hero=56,
          rows=ROWS(('link', 'Spelled in', 'C major'), ('link', 'Also read as', 'Em(♭6)'), ('link', 'Open in Chords', '', 'Chords.dc.html')),
          change='', mids=PILL('Clear the keys', 'clear') + '<span style="flex: 1"></span>' + PILL('Arpeggio', 'clear'), more=ROWS(('link', 'Connect a piano', 'Not connected'), ('link', 'Chords played', '3'), ('link', 'In these keys', '4')), more_title='Chord finder')

# Circle of fifths: the key is the subject
CO_JS = RB_JS(r'''
    const MAJ = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F'], MIN = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
    const SIGN = ['No sharps or flats', '1 sharp', '2 sharps', '3 sharps', '4 sharps', '5 sharps', '6 sharps', '5 flats', '4 flats', '3 flats', '2 flats', '1 flat'];
    const sel = st.sel ?? 1; const near = [(sel + 11) % 12, sel, (sel + 1) % 12];
    const arc = (r1, r2, a0, a1) => { const p = (r, a) => [(200 + r * Math.sin(a)).toFixed(1), (200 - r * Math.cos(a)).toFixed(1)]; const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0); return 'M' + x1 + ' ' + y1 + 'A' + r2 + ' ' + r2 + ' 0 0 1 ' + x2 + ' ' + y2 + 'L' + x3 + ' ' + y3 + 'A' + r1 + ' ' + r1 + ' 0 0 0 ' + x4 + ' ' + y4 + 'Z'; };
    const segs = MAJ.map((m, i) => { const a0 = (i - 0.5) * Math.PI / 6, a1 = (i + 0.5) * Math.PI / 6, am = i * Math.PI / 6, on = i === sel, nb = near.includes(i);
      return { o: arc(120, 196, a0, a1), n: arc(74, 120, a0, a1), fo: on ? C.accent : nb ? '#F6E7C8' : C.sheet, fi: on ? '#F3D9A8' : nb ? '#FAF0DC' : C.page, m, mn: MIN[i], mx: (200 + 160 * Math.sin(am)).toFixed(1), my: (208 - 160 * Math.cos(am)).toFixed(1), nx: (200 + 97 * Math.sin(am)).toFixed(1), ny: (205 - 97 * Math.cos(am)).toFixed(1), pick: () => set({ sel: i }) }; });
    return { ...common(st, set), name: MAJ[sel] + ' major', sub: SIGN[sel] + ' · relative ' + MIN[sel].replace('m', '') + ' minor', segs,
      prev: () => set({ sel: (sel + 11) % 12 }), next: () => set({ sel: (sel + 1) % 12 }), pillBg: C.fill, wKey: wheel(MAJ.map((m) => m + ' major'), sel, (i) => set({ sel: i })) };''')
CO_STAGE = lambda w: f'''<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 400 400" width="{w}" height="{w}" role="radiogroup" aria-label="Keys" style="max-width: 100%; max-height: 100%"><sc-for list="{{{{segs}}}}" as="g" hint-placeholder-count="12"><g onClick="{{{{g.pick}}}}" style="cursor: pointer"><path d="{{{{g.o}}}}" fill="{{{{g.fo}}}}" stroke="{LINE}" stroke-width="1.2"></path><path d="{{{{g.n}}}}" fill="{{{{g.fi}}}}" stroke="{LINE}" stroke-width="1.2"></path><text x="{{{{g.mx}}}}" y="{{{{g.my}}}}" text-anchor="middle" font-size="24" font-weight="700" fill="{INK}">{{{{g.m}}}}</text><text x="{{{{g.nx}}}}" y="{{{{g.ny}}}}" text-anchor="middle" font-size="15" fill="{SOFT}">{{{{g.mn}}}}</text></g></sc-for><circle cx="200" cy="200" r="74" fill="{PAGE}" stroke="{LINE}" stroke-width="1.2"></circle></svg></div>'''
CO_DIA = f'<div style="flex: none; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px">' + ''.join(f'<span style="height: 50px; border-radius: 10px; background: {FILL}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; font-weight: 700">{c}<span style="font-size: 12px; font-weight: 500; color: {SOFT}">{n}</span></span>' for c, n in zip(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F♯°'], ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'])) + '</div>'
calm_page('CircleOfFifths', 'Circle of fifths', CO_JS, CO_STAGE(370), CO_STAGE(560), tabs=False, hero=52,
          rows=CO_DIA + ROWS(('link', 'Open in Scales and keys', '', 'Scales.dc.html')),
          change='Change key', mids=PILL('‹', 'prev') + PILL('›', 'next'), wheel_cols=[('wKey', 1)], wheel_head='Keys', play=True,
          more=ROWS(('link', 'Key signatures on the circle', 'On'), ('link', 'Minor keys inside', 'On')), more_title='Circle of fifths')

# ── calm lists: the libraries and hubs ──
LIST_JS = lambda data: RB_JS('    const D = ' + json.dumps(data, ensure_ascii=False) + r''';
    const q = st.q ?? '', place = st.place ?? 0;
    return { ...common(st, set), q, setQ: (e) => set({ q: e.target.value }),
      places: D.places.map((l, i) => ({ l, bg: i === place ? C.ink : C.fill, fg: i === place ? C.sheet : C.ink, pick: () => set({ place: i }) })),
      groups: D.groups.map((g) => ({ ...g, rows: g.rows.filter((r) => !q || r.t.toLowerCase().includes(q.toLowerCase())) })) };''')
ROWL = f'<a href="{{{{r.href}}}}" style="min-height: 60px; display: flex; align-items: center; gap: 12px; padding: 8px 12px 8px 14px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}"><span style="flex: none; width: 44px; height: 44px; border-radius: 10px; background: {{{{r.c}}}}; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: {INK}">{{{{r.i}}}}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{r.t}}}}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.s}}}}</span></span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{r.v}}}}</span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>'
def LISTBODY(title, search, cols=1):
    grid = 'display: flex; flex-direction: column; gap: 22px' if cols == 1 else 'display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 28px; align-items: start'
    return f'''<div style="display: flex; flex-direction: column; gap: 14px"><h1 style="margin: 0; font-size: 34px; font-weight: 700; letter-spacing: -0.01em">{title}</h1><label style="height: 40px; border-radius: 10px; background: {FILL}; display: flex; align-items: center; gap: 8px; padding: 0 12px; color: {SOFT}">{SEARCH}<input value="{{{{q}}}}" onInput="{{{{setQ}}}}" placeholder="{search}" aria-label="{search}" style="flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}"></label><div class="nos" role="radiogroup" style="display: flex; gap: 6px; overflow-x: auto"><sc-for list="{{{{places}}}}" as="p" hint-placeholder-count="4"><button type="button" onClick="{{{{p.pick}}}}" style="flex: none; height: 34px; padding: 0 14px; border: 0; border-radius: 17px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 14px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div></div><div style="{grid}"><sc-for list="{{{{groups}}}}" as="g" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 6px"><h2 style="margin: 0 0 0 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{{{{g.g}}}}</h2><div style="border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{g.rows}}}}" as="r" hint-placeholder-count="3">{ROWL}</sc-for></div></section></sc-for></div>'''
def TABBAR(cur):
    items = [('Learn', '#'), ('Songs', 'Songs.dc.html'), ('Practice', 'Main.dc.html'), ('Profile', '#')]
    a = ''.join(f'<a href="{h}" {("aria-current=\"page\"") if l == cur else ""} style="flex: 1; height: 52px; border-radius: 26px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 15px; font-weight: {700 if l == cur else 500}; color: {INK if l == cur else SOFT}; background: {FILL if l == cur else "transparent"}">{l}</a>' for l, h in items)
    return f'<nav aria-label="Main" style="position: absolute; left: 16px; right: 16px; bottom: 30px; z-index: 40; height: 64px; box-sizing: border-box; padding: 6px; border-radius: 32px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; gap: 4px">{a}</nav>'
def list_page(stem, title, search, data, back='Main.dc.html', back_l='Laptop.dc.html', add='', more_rows='', root='', section='Practice'):
    js = LIST_JS(data)
    right = ICONBTN('Add', PLUS) if add else ''
    phone(stem, title + ', phone', f'{BAR(back, right)}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px {120 if root else 40}px; display: flex; flex-direction: column; gap: 20px">{LISTBODY(title, search)}</main>' + (TABBAR(root) if root else ''), js, MORESHEET(title, more_rows) if more_rows else '')
    datal = json.loads(json.dumps(data)); [r.update(href=r['href'].replace('.dc.html', 'Laptop.dc.html')) for g in datal['groups'] for r in g['rows'] if r['href'] != '#']
    bk = f'<a href="{back_l}" aria-label="Back" style="width: 44px; height: 44px; margin-left: -10px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>' if back_l else '<span></span>'
    main = f'<header style="flex: none; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px">{bk}<div style="display: flex">{right}<button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div></header><main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 64px 40px; display: flex; flex-direction: column; gap: 22px">{LISTBODY(title, search, 2)}</main>'
    laptop('Laptop' if stem == 'Main' else stem + 'Laptop', title + ', laptop', main, '', LIST_JS(datal), POP_L('moreOn', f'<span style="font-size: 16px; font-weight: 600">{title}</span>' + more_rows, 'right: 40px; top: 64px', 380) if more_rows else '', section)

R = lambda t, s, v, i, c, href='#': {'t': t, 's': s, 'v': v, 'i': i, 'c': c, 'href': href}
PEACH, SKY, SAGE, HONEY, LILAC = '#F3D2C8', '#D3E5F2', '#DCE9D6', '#F6E7C8', '#E4DCF1'
list_page('Main', 'Practice', 'Search Practice', {'places': ['All', 'Harmony', 'Technique', 'Ear', 'Tools'], 'groups': [
    {'g': 'Up next', 'rows': [R('D7 and its inversions', 'From Amazing Grace · the chord before bar 12', '5 min', 'D7', PEACH, 'Chords.dc.html'), R('G major scale, hands together', 'Step 3 of the tempo ladder · 72 BPM', '', 'G', SKY, 'Scales.dc.html')]},
    {'g': 'Harmony', 'rows': [R('Chords', 'Every chord, its inversions and fingering', '12 of 48', 'C', PEACH, 'Chords.dc.html'), R('Scales and keys', 'Scales as the books finger them', '5 of 24', 'G', SKY, 'Scales.dc.html'), R('Intervals', 'Every interval, seen and heard', '', 'P5', SAGE, 'Intervals.dc.html'), R('Progressions', 'Known progressions in any key', '', 'I V', HONEY, 'Progressions.dc.html'), R('Accompaniment', 'Left-hand and right-hand patterns', '', '♩♫', LILAC, 'Accompaniment.dc.html'), R('Chord player', 'Your chord sheet, played by a band', '', 'C G', HONEY, 'ChordPlayer.dc.html')]},
    {'g': 'Technique and ear', 'rows': [R('Exercises', 'Hanon, Barry Harris, Piano With Jonny', '', '1 2', SAGE, 'Exercises.dc.html'), R('Quiz', 'Chords, keys and intervals by ear and eye', '7 to check', '?', PEACH, 'Quiz.dc.html')]},
    {'g': 'Tools', 'rows': [R('Metronome', '120 BPM · 4/4', '', '♩', FILL, 'Metronome.dc.html'), R('Tuner', 'How in tune a note is', '', 'A4', FILL, 'Tuner.dc.html'), R('Chord finder', 'Names any chord you play', '', 'C?', FILL, 'ChordFinder.dc.html'), R('Circle of fifths', 'Every key and its chords', '', 'C G', FILL, 'CircleOfFifths.dc.html')]}]},
    back='', back_l='', root='Practice')
list_page('Progressions', 'Progressions', 'Search progressions', {'places': ['All', 'Favourites', 'Pop', 'Jazz', 'Classical', 'Mine'], 'groups': [
    {'g': 'Favourites', 'rows': [R('Axis of Awesome', 'I – V – vi – IV · bright and singable', '♥', 'I V', HONEY, 'Progression.dc.html')]},
    {'g': 'Pop', 'rows': [R('50s doo-wop', 'I – vi – IV – V', '', 'I vi', HONEY, 'Progression.dc.html'), R('Royal Road', 'IV – V – iii – vi', '', 'IV', HONEY, 'Progression.dc.html'), R('Let It Be', 'I – V – vi – IV – I – V – IV – I', '', 'I V', HONEY, 'Progression.dc.html')]},
    {'g': 'Jazz', 'rows': [R('ii–V–I', 'ii7 – V7 – Imaj7', '', 'ii', SKY, 'Progression.dc.html'), R('Rhythm changes', 'I – vi – ii – V', '', 'I vi', SKY, 'Progression.dc.html')]},
    {'g': 'Classical', 'rows': [R('Pachelbel', 'I – V – vi – iii – IV – I – IV – V', '', 'I V', SAGE, 'Progression.dc.html'), R('Andalusian cadence', 'i – ♭VII – ♭VI – V', '', 'i', SAGE, 'Progression.dc.html')]}]},
    add='Add', more_rows=ROWS(('link', 'Select', ''), ('link', 'Arrange', ''), ('link', 'Sort by', 'Style')))
list_page('Accompaniment', 'Accompaniment', 'Search patterns', {'places': ['All', 'Favourites', 'Recently used', 'Called to Play', 'Rhythm styles', 'Mine'], 'groups': [
    {'g': 'Recently used', 'rows': [R('Bass + chords', 'Left: an octave, held · Right: the chord on every beat', 'Level 1', '♩♩', LILAC, 'Pattern.dc.html'), R('Waltz', 'Left: the root on 1 · Right: the chord on 2 and 3', 'Level 1', '♩♪', LILAC, 'Pattern.dc.html')]},
    {'g': 'Called to Play', 'rows': [R('Broken chords', 'Right hand rocks in 8ths', 'Level 1', '♫', LILAC, 'Pattern.dc.html'), R('Arpeggio 1–5–8 · 3–5–8–5–3', 'One arpeggio through both hands', 'Level 2', '♬', LILAC, 'Pattern.dc.html'), R('Runs down to the root', 'The 2nd and 5th, then 3–2–1', 'Level 3', '♬', LILAC, 'Pattern.dc.html')]},
    {'g': 'Rhythm styles', 'rows': [R('Ballad', 'Root and 5th, chords on 2 and 4', 'Level 1', '♩', LILAC, 'Pattern.dc.html'), R('Swing comping', 'Short chords off the beat', 'Level 3', '♪', LILAC, 'Pattern.dc.html')]}]},
    add='Add', more_rows=ROWS(('link', 'Select', ''), ('link', 'Arrange', ''), ('link', 'Hidden patterns', '')))
list_page('Exercises', 'Exercises', 'Search exercises', {'places': ['All', 'Favourites', 'Finger technique', 'Barry Harris', 'Piano With Jonny', 'Mine'], 'groups': [
    {'g': 'Finger technique', 'rows': [R('Hanon', 'Nos. 1 to 20 of The Virtuoso Pianist', 'Intermediate', '1–20', SAGE, 'Exercise.dc.html'), R('Five-finger position', "A key's first five notes, up and down", 'Beginner', '1–5', SAGE, 'Exercise.dc.html')]},
    {'g': 'Barry Harris', 'rows': [R('6th-diminished scale', 'Eight notes to the octave', 'Advanced', '6°', SKY, 'Exercise.dc.html'), R('Drop-2 7ths', "The key's 7th chords up and down", 'Professional', 'D2', SKY, 'Exercise.dc.html')]},
    {'g': 'Piano With Jonny', 'rows': [R('2-5-1 scale', 'Swung 8ths over a ii–V–I', 'Beginner', '251', HONEY, 'Exercise.dc.html'), R('Rapid switch', 'One line through all twelve keys', 'Professional', '12', HONEY, 'Exercise.dc.html')]}]},
    add='Add', more_rows=ROWS(('link', 'Select', ''), ('link', 'Arrange', '')))
list_page('Quiz', 'Quiz', 'Search the Quiz', {'places': ['All', 'Chords', 'Keys', 'By ear', 'Reading'], 'groups': [
    {'g': 'To check', 'rows': [R('My gaps', 'F♯ minor, B♭7, D Dorian and 4 more', '7', '7', ACCENT, 'QuizRun.dc.html')]},
    {'g': 'Chords and intervals', 'rows': [R('Chords', 'Best 92% · 14 runs', '92%', 'C', PEACH, 'QuizRun.dc.html'), R('Intervals', 'Best 78% · 6 runs', '78%', 'P5', SAGE, 'QuizRun.dc.html'), R('Chord roles', 'Not tried yet', '', 'IV', HONEY, 'QuizRun.dc.html')]},
    {'g': 'Scales and keys', 'rows': [R('Scale building', 'Best 85% · 3 runs', '85%', 'G', SKY, 'QuizRun.dc.html'), R('Key signatures', 'Best 100% · 9 runs', '100%', '♯', SKY, 'QuizRun.dc.html')]},
    {'g': 'By ear', 'rows': [R('Scales by ear', 'Best 64% · 2 runs', '64%', '♪', LILAC, 'QuizRun.dc.html'), R('Cadences', 'Best 70% · 1 run', '70%', 'V I', LILAC, 'QuizRun.dc.html')]}]},
    more_rows=ROWS(('link', 'Advance automatically', 'On'), ('link', 'Time limit', 'Off')))

# Accompaniment: a pattern
PA_JS = RB_JS(r'''
    const PATS = ['Bass + chords', 'Broken chords', 'Arpeggio 1–5–8', 'Waltz', 'Ballad', 'Swing comping'];
    const p = st.p ?? 1, tab = st.tab ?? 'Roll';
    const roll = []; const add = (s, pi, l, h) => roll.push({ x: (s / 8 * 100).toFixed(2) + '%', y: (100 - pi / 24 * 92 - 6).toFixed(1) + '%', w: (l / 8 * 100 - 0.8).toFixed(2) + '%', c: h === 'l' ? '#B8A8D8' : '#E8C67D' });
    add(0, 0, 8, 'l'); add(0, 12, 8, 'l'); [0, 2, 4, 6].forEach((s) => { add(s, 19, 1, 'r'); add(s, 24, 1, 'r'); add(s + 1, 16, 1, 'r'); });
    return { ...common(st, set), name: PATS[p], sub: 'Called to Play · Level 1 · straight 8ths', roll,
      tabs: tabsOf(['Roll', 'Staff', 'Hands'], tab, set), isRoll: tab === 'Roll', isStaff: tab === 'Staff', isHands: tab === 'Hands',
      hands: [['Left hand', 'An octave on the root, held through the bar'], ['Right hand', 'Keeps the chord under the fingers and rocks in 8ths: the upper notes together, then the lowest']].map(([h, t]) => ({ h, t })),
      wPat: wheel(PATS, p, (i) => set({ p: i })), pillBg: C.fill, tempo: '80 BPM', tDown: () => {}, tUp: () => {} };''')
PA_STAGE = f'''<sc-if value="{{{{isRoll}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><div style="position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0 calc(25% - 1px), {FILL} calc(25% - 1px) 25%)"></div><sc-for list="{{{{roll}}}}" as="n" hint-placeholder-count="14"><span style="position: absolute; left: {{{{n.x}}}}; top: {{{{n.y}}}}; width: {{{{n.w}}}}; height: 12px; border-radius: 4px; background: {{{{n.c}}}}"></span></sc-for></div></sc-if>
<sc-if value="{{{{isStaff}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; padding: 12px">{STAFFIMG('100%', 160)}</div></sc-if>
<sc-if value="{{{{isHands}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 10px"><sc-for list="{{{{hands}}}}" as="h" hint-placeholder-count="2"><div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; color: {SOFT}">{{{{h.h}}}}</span><span style="font-size: 17px; line-height: 1.4">{{{{h.t}}}}</span></div></sc-for></div></sc-if>'''
calm_page('Pattern', 'A pattern', PA_JS, PA_STAGE, PA_STAGE, hero=44, back='Accompaniment.dc.html', back_l='AccompanimentLaptop.dc.html',
          rows=ROWS(('step', 'Tempo', 'tempo', 'tDown', 'tUp'), ('link', 'Over a progression', 'Axis of Awesome', 'Progression.dc.html'), ('link', 'Practise in the Player', '')),
          change='Change pattern', wheel_cols=[('wPat', 1)], wheel_head='Patterns', heart=True,
          more=ROWS(('link', 'In a song', 'Amazing Grace'), ('link', 'Edit pattern', ''), ('link', 'Duplicate', '')), more_title='Pattern')

# Quiz: a run, the question is the subject
QR_JS = RB_JS(r'''
    const picked = st.picked ?? null; const ANS = ['F major', 'F minor', 'F diminished', 'F augmented'];
    const marks = { 57: [ROLE[3], 'A'], 60: [ROLE[5], 'C'], 65: [ROLE[1], 'F'] };
    return { ...common(st, set), name: 'Which chord?', sub: 'Chords · Name it · round 3 of 10', kb: calmKeys(48, 76, marks, st.W ?? 370, 180), kbL: calmKeys(36, 84, marks, 1330, 260),
      answers: ANS.map((a, i) => ({ a, pick: () => picked === null && set({ picked: i }), bg: picked !== null && i === 0 ? '#DCE9D6' : picked === i ? '#F5D6D0' : C.sheet, mark: picked !== null && i === 0 ? '✓' : picked === i ? '✕' : '' })),
      answered: picked !== null, verdict: picked === 0 ? 'Right: F major, 1st inversion' : 'Not quite: it’s F major, with A lowest', next: () => set({ picked: null }), pillBg: C.fill, progress: '25%' };''')
QR_STAGE = lambda k, kh: f'''<div style="position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 14px"><div style="height: 4px; border-radius: 2px; background: {FILL}"><div style="width: {{{{progress}}}}; height: 4px; border-radius: 2px; background: {INK}"></div></div>{KEYS(kh).replace('kb.', k + '.')}<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{answers}}}}" as="a" hint-placeholder-count="4"><button type="button" onClick="{{{{a.pick}}}}" style="height: 56px; border: 0; border-radius: 14px; background: {{{{a.bg}}}}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 17px; font-weight: 600">{{{{a.a}}}} {{{{a.mark}}}}</button></sc-for></div><sc-if value="{{{{answered}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; align-items: center; gap: 10px"><span style="flex: 1; font-size: 15px; font-weight: 600">{{{{verdict}}}}</span><button type="button" onClick="{{{{next}}}}" style="height: 44px; padding: 0 20px; border: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Next</button></div></sc-if></div>'''
calm_page('QuizRun', 'A quiz run', QR_JS, QR_STAGE('kb', 180), QR_STAGE('kbL', 240), tabs=False, hero=40, back='Quiz.dc.html', back_l='QuizLaptop.dc.html',
          change='', mids=PILL('Hear it again', 'next') + '<span style="flex: 1"></span>' + PILL('End the run', 'next'), play=False,
          more=ROWS(('link', 'Drill', 'Name it'), ('link', 'Level', 'The main chords of C'), ('link', 'Rounds', '10'), ('link', 'Time limit', 'Off')), more_title='This run')

# The calm Chords page itself, from the other session, in this canvas's frames
for src, dst in (('App.dc.html', 'ChordsApp.dc.html'), ('DeskApp.dc.html', 'ChordsDesk.dc.html')):
    s = open(CALM + src).read()
    open(OUT + dst, 'w').write(s)
for f, imp, size in (('Chords', 'ChordsApp', (450, 920)), ('ChordsLaptop', 'ChordsDesk', (2143, 1299))):
    if f == 'Chords':
        inner = f'<div style="position: relative; width: 450px; height: 920px; overflow: hidden"><div style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; border-radius: 62px; overflow: hidden; background: {PAGE}"><dc-import name="ChordsApp" hint-size="402px,874px"></dc-import></div><a href="Main.dc.html" aria-label="Back to Practice" style="position: absolute; left: 36px; top: 79px; width: 48px; height: 48px; z-index: 5"></a><img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none"></div>'
    else:
        inner = LAPFRAME_TOP + f'<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35)"><dc-import name="ChordsDesk" root="3" flats="true" chord="m7" hint-size="1710px,904px"></dc-import><a href="Laptop.dc.html" aria-label="Back to Practice" style="position: absolute; left: 20px; top: 20px; width: 52px; height: 52px; z-index: 5"></a></div></div><img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">'
    open(OUT + f + '.dc.html', 'w').write(HEAD % 'Chords' + inner + f"""
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{size[0]},"height":{size[1]}}}}}'>
class Component extends DCLogic {{ renderVals() {{ return {{}}; }} }}
</script>
</body>
</html>
""")
print('practice ok')
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/calm_songs.py').read())
