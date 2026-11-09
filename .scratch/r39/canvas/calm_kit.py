# The calm kit: tokens, pieces and the phone and laptop frames, shared by calm.py (R40) and r41.py.
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
// a root as its letter, the spelling stepped by tapping the letter again; ok(l, a) says which spellings exist (R42)
function letterPick(rl, ra, ok, tapUsed, pick) {
  const L7 = 'CDEFGAB', A7 = { '0': '', '1': '♯', '-1': '♭' }, NM = { '0': '', '1': ' sharp', '-1': ' flat' };
  const waysOf = (l) => [0, 1, -1].filter((a) => ok(l, a));
  const w0 = waysOf(rl); let rootHint = { on: false, t: '', box: '', tip: '' };
  if (w0.length > 1 && !tapUsed) { const nx = w0[(w0.indexOf(ra) + 1) % w0.length], c = ((rl + 0.5) / 7 * 100).toFixed(2);
    rootHint = { on: true, t: 'Tap again for ' + L7[rl] + A7[String(nx)], box: rl < 2 ? 'left: 0' : (rl > 4 ? 'right: 0' : 'left: ' + c + '%; transform: translateX(-50%)'), tip: 'left: calc(' + c + '% - 6px)' }; }
  const a = [0, 1, 2, 3, 4, 5, 6].map((l) => { const on = l === rl, ws = waysOf(l), cur = on ? ra : 0, next = on ? ws[(ws.indexOf(ra) + 1) % ws.length] : 0, more = on && ws.length > 1;
    return { l: L7[l] + A7[String(cur)], on, aria: L7[l] + NM[String(cur)] + (more ? '. Tap again for ' + L7[l] + NM[String(next)] : ''), bg: on ? '#FEFDFB' : 'transparent', sh: on ? '0 1px 3px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.12)' : 'none', fw: on ? 700 : 500, pick: () => pick(l, next, more) }; });
  return { roots: { a }, rootHint };
}
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

