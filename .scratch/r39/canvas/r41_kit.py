# R41 kit: the calm tokens (calm_kit.py) plus the pieces every R41 page draws with. Each page keeps its own layout,
# taken from its reference app and its rulings; the kit only makes them speak one quiet language.
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/calm_kit.py').read())

GEARI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M4 7h10M18 7h2M4 17h4M12 17h8"></path><circle cx="16" cy="7" r="2"></circle><circle cx="10" cy="17" r="2"></circle></svg>'
ARCHIVE = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><rect x="3" y="4" width="18" height="5" rx="1.5"></rect><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"></path></svg>'
PENCIL = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="M4 20h4L19 9l-4-4L4 16z"></path></svg>'
CHECK = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m5 12 5 5 9-10"></path></svg>'
CLOSE = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="M6 6l12 12M18 6 6 18"></path></svg>'
CHEV_D = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m6 9 6 6 6-6"></path></svg>'
KEYSI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 5v8M12 5v14M16 5v8"></path></svg>'
SPEAKER = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"></path><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>'
GRIP = f'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' + ''.join(f'<circle cx="{x}" cy="{y}" r="1.5"></circle>' for x in (9, 15) for y in (6, 12, 18)) + '</svg>'
SERIF = "'Iowan Old Style', 'Palatino', Georgia, serif"

R41PRE = r'''
// a segmented control's items
const seg = (opts, cur, pick) => opts.map((l) => ({ l, on: l === cur, bg: l === cur ? '#FEFDFB' : 'transparent', sh: l === cur ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: l === cur ? 600 : 500, pick: () => pick(l) }));
const chipsOf = (opts, cur, pick) => opts.map((l) => ({ l, bg: l === cur ? '#332921' : '#EEE9E2', fg: l === cur ? '#FEFDFB' : '#332921', pick: () => pick(l) }));
const ROOTS = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const rootGrid = (cur, pick) => { const all = ROOTS.map((r, i) => ({ l: r, on: i === cur, bg: i === cur ? '#FEFDFB' : 'transparent', sh: i === cur ? '0 1px 3px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.12)' : 'none', fw: i === cur ? 700 : 500, pick: () => pick(i) })); return { a: all.slice(0, 6), b: all.slice(6) }; };
const sheetOf = (st, set) => ({ sheet: st.sheet || '', closeSheet: () => set({ sheet: null }), open: (n) => () => set({ sheet: n }), isSheet: (n) => st.sheet === n });
'''

# ── the bar ──
def TOP(back='', title='', right='', backlabel='Back', left=''):
    b = left or (f'<a href="{back}" aria-label="{backlabel}" style="width: 44px; height: 44px; margin-left: -4px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>' if back else '')
    t = f'<span style="position: absolute; left: 96px; right: 96px; text-align: center; font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{title}</span>' if title else ''
    return f'<header style="position: relative; flex: none; height: 44px; display: flex; align-items: center; padding: 0 10px 0 16px">{b}{t}<span style="flex: 1"></span><div style="display: flex; align-items: center">{right}</div></header>'
def IB(label, svg, act='', href='', pressed=''):
    st = f'width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none'
    if href: return f'<a href="{href}" aria-label="{label}" style="{st}">{svg}</a>'
    return f'<button type="button" aria-label="{label}" {("onClick=\"{{" + act + "}}\"") if act else ""} {("aria-pressed=\"{{" + pressed + "}}\"") if pressed else ""} style="{st}">{svg}</button>'
GEAR = lambda: IB('Settings', GEARI, 'openSet')
DOTS = lambda: IB('More', MORE, 'openMore')

# ── type ──
def LARGE(title, right='', soft=''):
    s = f'<span style="font-size: 34px; font-weight: 700; letter-spacing: -0.01em; color: {LINE}">{soft}</span>' if soft else ''
    return f'<div style="flex: none; display: flex; align-items: center; gap: 12px; padding: 2px 16px 10px"><h1 style="margin: 0; font-size: 34px; font-weight: 700; letter-spacing: -0.01em">{title}</h1>{s}<span style="flex: 1"></span>{right}</div>'
# A place's bar (owner, 2026-11-13: "I dont like that the header is occupied only by these two buttons no the right and the
# rest is just empty"): the title sits in the bar itself, at its left, the actions at its right; never an empty bar
# over a title on its own line. Back, where there is one, before the title.
def TITLEBAR(title, right='', back='', backlabel='Back', soft=''):
    b = f'<a href="{back}" aria-label="{backlabel}" style="flex: none; width: 44px; height: 44px; margin-left: -10px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>' if back else ''
    fs = 26 if soft else 28  # two titles side by side (My songs · Explore) take a step down so neither is cut
    s = f'<span style="flex: none; font-size: {fs}px; font-weight: 700; letter-spacing: -0.01em; color: {LINE}; white-space: nowrap">{soft}</span>' if soft else ''
    return (f'<header style="flex: none; min-height: 56px; display: flex; align-items: center; gap: 10px; padding: 0 10px 4px 16px">{b}'
            f'<h1 style="margin: 0; min-width: 0; flex: {"none" if soft else "0 1 auto"}; font-size: {fs}px; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{title}</h1>{s}'
            f'<span style="flex: 1"></span><div style="flex: none; display: flex; align-items: center">{right}</div></header>')
def LTITLEBAR(title, right=''):
    return f'<header style="flex: none; height: 88px; display: flex; align-items: center; gap: 8px; padding: 0 28px 0 56px"><h1 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.01em">{title}</h1><span style="flex: 1"></span>{right}</header>'
def SUBJECT(name, sub, size=40, align='left'):
    return f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px; text-align: {align}"><h1 style="margin: 0; font-size: {size}px; line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap">{name}</h1><p style="margin: 0; font-size: 15px; color: {SOFT}">{sub}</p></div>'
H2 = lambda t, right='': f'<div style="display: flex; align-items: baseline; justify-content: space-between; margin: 0 4px"><h2 style="margin: 0; font-size: 20px; font-weight: 700">{t}</h2>{right}</div>'
CAPS = lambda t: f'<h3 style="margin: 0 0 0 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{t}</h3>'

# ── controls ──
def SEGC(lst, h=32, fs=14):
    return f'<div role="radiogroup" style="flex: none; display: flex; gap: 2px; padding: 2px; border-radius: 11px; background: {FILL}"><sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="flex: 1; min-width: 0; height: 44px; padding: 0 10px; border: 0; border-radius: 9px; background: {{{{o.bg}}}}; box-shadow: {{{{o.sh}}}}; color: {INK}; font: inherit; font-size: {fs}px; font-weight: {{{{o.fw}}}}; white-space: nowrap">{{{{o.l}}}}</button></sc-for></div>'
def CHIPS(lst):
    return f'<div class="nos" role="radiogroup" style="flex: none; display: flex; gap: 6px; overflow-x: auto; margin: -5px -16px; padding: 0 16px"><sc-for list="{{{{{lst}}}}}" as="p" hint-placeholder-count="4"><button type="button" onClick="{{{{p.pick}}}}" style="flex: none; height: 44px; padding: 0 14px; border: solid transparent; border-width: 5px 0; background-clip: padding-box; border-radius: 22px; background-color: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 14px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div>'
KCHIPS = CHIPS
def STEPPER(val, dn, up, w=64):
    b = lambda a, s, l: f'<button type="button" aria-label="{l}" onClick="{{{{{a}}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 20px">{s}</button>'
    return f'<div style="flex: none; display: flex; align-items: center; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}">{b(dn, "−", "Less")}<span style="min-width: {w}px; text-align: center; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums">{{{{{val}}}}}</span>{b(up, "+", "More")}</div>'
def TOGGLE(on):
    return f'<span role="switch" aria-checked="{{{{{on}}}}}" style="flex: none; width: 51px; height: 31px; border-radius: 16px; background: {{{{{on}Bg}}}}; position: relative"><span style="position: absolute; top: 2px; left: {{{{{on}X}}}}px; width: 27px; height: 27px; border-radius: 14px; background: #FFF; box-shadow: 0 2px 4px rgba(0,0,0,.2)"></span></span>'
def GROUP(*rows, bg=FILL):
    out = []
    for i, r in enumerate(rows):
        sep = f'box-shadow: inset 0 -1px 0 {LINE};' if i < len(rows) - 1 else ''
        k = r[0]
        lab = f'<span style="flex: 1; min-width: 0; font-size: 16px">{r[1]}</span>'
        base = f'min-height: 48px; box-sizing: border-box; display: flex; align-items: center; gap: 10px; padding: 6px 12px 6px 16px; {sep}'
        if k == 'link':  # label, value, href or act
            val = f'<span style="font-size: 16px; color: {SOFT}; white-space: nowrap">{r[2]}</span>' if r[2] else ''
            tgt = r[3] if len(r) > 3 else ''
            if tgt.endswith('.html') or tgt == '#':
                out.append(f'<a href="{tgt}" style="{base} color: {INK}; text-decoration: none">{lab}{val}<span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>')
            else:
                out.append(f'<button type="button" {("onClick=\"{{" + tgt + "}}\"") if tgt else ""} style="{base} width: 100%; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left">{lab}{val}<span style="color: {SOFT}; display: flex">{CHEV_R}</span></button>')
        elif k == 'seg': out.append(f'<div style="{base.replace("align-items: center; gap: 10px; padding: 6px 12px 6px 16px", "flex-direction: column; align-items: stretch; gap: 8px; padding: 12px 12px 12px 16px")}"><span style="font-size: 16px">{r[1]}</span>{SEGC(r[2], 44, 14)}</div>')
        elif k == 'step': out.append(f'<div style="{base}">{lab}{STEPPER(*r[2:5])}</div>')
        elif k == 'toggle': out.append(f'<button type="button" onClick="{{{{{r[3]}}}}}" style="{base} width: 100%; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left">{lab}{TOGGLE(r[2])}</button>')
        elif k == 'val': out.append(f'<div style="{base}">{lab}<span style="font-size: 16px; color: {SOFT}; font-variant-numeric: tabular-nums">{r[2]}</span></div>')
        elif k == 'action': out.append(f'<button type="button" onClick="{{{{{r[2]}}}}}" style="{base} width: 100%; border: 0; background: transparent; color: {r[3] if len(r) > 3 else LINK}; font: inherit; font-size: 16px; text-align: left">{r[1]}</button>')
        elif k == 'raw': out.append(f'<div style="{sep}">{r[1]}</div>')
    return f'<div style="flex: none; border-radius: 12px; background: {bg}; overflow: hidden">{"".join(out)}</div>'
def BTN(label, act='', href='', kind='primary', h=50, grow=True):
    bg = {'primary': ACCENT, 'quiet': FILL, 'ink': INK}[kind]; fg = SHEET if kind == 'ink' else INK
    st = f'{"flex: 1;" if grow else "flex: none;"} min-width: 0; height: {h}px; padding: 0 20px; border: 0; border-radius: {h // 2}px; background: {bg}; color: {fg}; font: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; white-space: nowrap'
    return f'<a href="{href}" style="{st}">{label}</a>' if href else f'<button type="button" {("onClick=\"{{" + act + "}}\"") if act else ""} style="{st}">{label}</button>'
def PLAYBTN(size=52):
    return f'<button type="button" aria-label="{{{{playLabel}}}}" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="flex: none; width: {size}px; height: {size}px; border: 0; border-radius: {size // 2}px; background: {ACCENT}; color: {INK}; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOP}</sc-if><sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAY}</sc-if></button>'
def DOCK(inner, bottom=34, pad=8):
    """The floating glass bar at the foot of a phone page."""
    return f'<div role="toolbar" style="position: absolute; left: 16px; right: 16px; bottom: {bottom}px; z-index: 40; height: 68px; box-sizing: border-box; padding: 0 {pad}px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 8px">{inner}</div>'
def DOCK_L(inner, w=560):
    return f'<div style="flex: none; display: flex; justify-content: center"><div role="toolbar" style="width: {w}px; height: 68px; box-sizing: border-box; padding: 0 8px; border-radius: 34px; background: {GLASS}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 8px">{inner}</div></div>'
def CARD(inner, pad='14px 16px', extra=''):
    return f'<div style="border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: {pad}; {extra}">{inner}</div>'
def ROOTGRID(lst='roots'):
    def track(half):
        return (f'<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 2px; padding: 3px; border-radius: 14px; background: {FILL}">'
                f'<sc-for list="{{{{{lst}.{half}}}}}" as="r" hint-placeholder-count="6"><button type="button" role="radio" aria-checked="{{{{r.on}}}}" onClick="{{{{r.pick}}}}" '
                f'style="height: 44px; min-width: 0; padding: 0; border: 0; border-radius: 11px; background: {{{{r.bg}}}}; box-shadow: {{{{r.sh}}}}; color: {INK}; font: inherit; font-size: 18px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</button></sc-for></div>')
    return f'<div role="radiogroup" aria-label="Root" style="display: flex; flex-direction: column; gap: 6px">{track("a")}{track("b")}</div>'
def BSHEET(cond, title, body, done='Done'):
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><style>[role=dialog].nos > * {{ flex-shrink: 0 }}</style><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.28)"></div><section role="dialog" aria-label="{title}" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 14px" class="nos"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div><div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 36px"><span style="font-size: 17px; font-weight: 600">{title}</span><button type="button" onClick="{{{{closeSheet}}}}" style="position: absolute; right: 0; height: 44px; padding: 0 4px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 17px; font-weight: 600">{done}</button></div>{body}</section></sc-if>'
def POPOVER(cond, title, body, pos='right: 40px; top: 64px', w=380):
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><style>[role=dialog].nos > * {{ flex-shrink: 0 }}</style><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="{title}" style="position: absolute; {pos}; z-index: 61; width: {w}px; max-height: 760px; overflow-y: auto; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 14px 16px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px" class="nos"><span style="font-size: 17px; font-weight: 600">{title}</span>{body}</div></sc-if>'
TABBAR_PH = lambda cur: TABBAR(cur)

def js(body):
    return 'class Component extends DCLogic {\n  renderVals() {\n    const st = this.state || {}; const set = (o) => this.setState(o);\n' + R41PRE + '\n' + body + '\n  }\n}\n'
COMMON = "...common(st, set), setOn: st.sheet === 'set', openSet: () => set({ sheet: 'set' }),"

def detail(stem, title, script, phone_body, laptop_main, laptop_aside, sheets_phone='', pops_laptop='', section='Practice'):
    phone(stem, title + ', phone', phone_body, script, sheets_phone)
    laptop(stem + 'Laptop' if stem != 'Main' else 'Laptop', title + ', laptop', laptop_main, laptop_aside, script, pops_laptop, section)
def LTOP(back='', right='', title=''):
    b = f'<a href="{back}" aria-label="Back" style="width: 44px; height: 44px; margin-left: -10px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>' if back else ''
    t = f'<span style="font-size: 17px; font-weight: 600">{title}</span>' if title else ''
    return f'<header style="flex: none; height: 64px; display: flex; align-items: center; gap: 8px; padding: 0 28px 0 40px">{b}{t}<span style="flex: 1"></span>{right}</header>'

# the engraved melody (Amazing Grace), shared with R40
_s = open('/home/user/piano-trainer/.scratch/r39/canvas/calm_songs.py').read()
exec(_s[:_s.index('LINKPILL')])
PEACH, SKY, SAGE, HONEY, LILAC = '#F3D2C8', '#D3E5F2', '#DCE9D6', '#F6E7C8', '#E4DCF1'
# The app's tab bar, as Apple's HIG "Tab bars": "Include tab labels … single words"; icons "above tab labels in
# compact views"; "Prefer filled symbols or icons"; on iOS it "floats above content … on a Liquid Glass background that
# allows content beneath to peek through", softened by the scroll-edge effect; monochrome when the content is
# colourful. The app's own Lucide icons (AppNav.tsx), filled; the place you are in in ink on a lens, the others soft.
# 64 tall (radius 32), the lens 52 inside 6 (radius 26).
_TI = 'viewBox="0 0 24 24" width="25" height="25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
_BG = '#FBF8F4'
TAB_ICONS = {
    'Learn': '<path fill="currentColor" d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"></path><path fill="none" d="M22 10v6"></path><path fill="currentColor" d="M6 12.9V16a6 3 0 0 0 12 0v-3.1l-4.4 2a3.8 3.8 0 0 1-3.2 0z" stroke="none"></path>',
    'Songs': '<path fill="none" stroke-width="2" d="M9 18V5l12-2v13"></path><circle fill="currentColor" cx="6" cy="18" r="3"></circle><circle fill="currentColor" cx="18" cy="16" r="3"></circle>',
    'Practice': f'<path fill="currentColor" d="M9.17 5.01a3 3 0 0 1 5.66 0L19.58 19.7A1 1 0 0 1 18.62 21H5.37a1 1 0 0 1-.95-1.3z"></path><path fill="none" stroke="{_BG}" stroke-width="1.7" d="M12 17 15.5 13.5"></path><path fill="none" stroke-width="1.7" d="m15.5 13.5 3.1-3.1"></path><circle fill="currentColor" cx="20" cy="9" r="2.1" stroke="none"></circle><path fill="none" stroke="{_BG}" stroke-width="1.6" d="M8.2 18h7.6"></path>',
    'Profile': '<circle fill="currentColor" cx="12" cy="8" r="5" stroke="none"></circle><path fill="currentColor" stroke="none" d="M3.5 21a8.5 7.5 0 0 1 17 0z"></path>',
}
def TABBAR(cur):
    items = [('Learn', 'Learn.dc.html'), ('Songs', 'Songs.dc.html'), ('Practice', 'Main.dc.html'), ('Profile', 'Profile.dc.html')]
    def one(l, h):
        on = l == cur
        svg = f'<svg {_TI}>{TAB_ICONS[l]}</svg>'
        return (f'<a href="{h}" {("aria-current=\"page\"") if on else ""} style="flex: 1 1 0; min-width: 0; height: 52px; border-radius: 26px; '
                f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-decoration: none; '
                f'color: {INK if on else "#8A7F76"}; background: {FILL if on else "transparent"}">{svg}'
                f'<span style="font-size: 11px; font-weight: {700 if on else 550}; line-height: 1">{l}</span></a>')
    a = ''.join(one(l, h) for l, h in items)
    edge = f'<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 120px; z-index: 39; pointer-events: none; background: linear-gradient(to bottom, rgba(247,243,238,0), rgba(247,243,238,.7)); backdrop-filter: blur(2px); -webkit-mask-image: linear-gradient(to bottom, transparent, #000 60%); mask-image: linear-gradient(to bottom, transparent, #000 60%)"></div>'
    return edge + f'<nav aria-label="Main" style="position: absolute; left: 16px; right: 16px; bottom: 30px; z-index: 40; height: 64px; box-sizing: border-box; padding: 6px; border-radius: 32px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; gap: 2px">{a}</nav>'

# small pictures that show the content (Practice's rows and cards)
def pic(kind, s=44):
    bg = {'cards': LILAC, 'keys': PEACH, 'staff': SKY, 'arc': SAGE, 'roman': HONEY, 'roll': LILAC, 'chips': HONEY, 'drill': SAGE, 'quiz': PEACH, 'metro': FILL, 'needle': FILL, 'lens': FILL, 'circle': FILL, 'chart': HONEY, 'swing': SKY}[kind]
    g = {
      'cards': f'<rect x="9" y="9" width="20" height="26" rx="4" transform="rotate(-12 19 22)" fill="#FEFDFB" opacity=".7"></rect><rect x="16" y="10" width="20" height="26" rx="4" fill="#FEFDFB" stroke="{INK}" stroke-width=".8"></rect><text x="26" y="27" text-anchor="middle" font-family="Georgia, serif" font-size="10" font-weight="700" fill="{INK}">G7</text>',
      'keys': ''.join(f'<rect x="{6+i*5}" y="12" width="4.6" height="20" rx="1" fill="{"#E19E8C" if i in (1,3,5) else "#FEFDFB"}"></rect>' for i in range(7)) + ''.join(f'<rect x="{9.5+i*5}" y="12" width="3" height="12" fill="{INK}"></rect>' for i in (0,1,3,4,5)),
      'staff': ''.join(f'<path d="M6 {14+i*4}H38" stroke="{INK}" stroke-width=".7"></path>' for i in range(5)) + ''.join(f'<ellipse cx="{11+i*5}" cy="{32-i*2.2}" rx="2.2" ry="1.7" fill="{INK}"></ellipse>' for i in range(6)),
      'arc': f'<ellipse cx="13" cy="30" rx="3" ry="2.3" fill="{INK}"></ellipse><ellipse cx="31" cy="18" rx="3" ry="2.3" fill="{INK}"></ellipse><path d="M14 26Q22 6 30 14" fill="none" stroke="{INK}" stroke-width="1.4"></path>',
      'roman': f'<text x="22" y="27" text-anchor="middle" font-size="11" font-weight="700" fill="{INK}">I IV V</text>',
      'roll': ''.join(f'<rect x="{6+i*8}" y="{28 - (i%2)*8}" width="6" height="3.5" rx="1.5" fill="{INK}"></rect>' for i in range(4)) + f'<rect x="6" y="34" width="30" height="3.5" rx="1.5" fill="#8C7AB8"></rect>',
      'chips': ''.join(f'<rect x="{5+i*12}" y="15" width="10" height="14" rx="3" fill="#FEFDFB"></rect><text x="{10+i*12}" y="25.5" text-anchor="middle" font-size="7" font-weight="700" fill="{INK}">{c}</text>' for i, c in enumerate('CGF')),
      'drill': ''.join(f'<ellipse cx="{8+i*4.4}" cy="{30-[0,2,3,4,5,4,3,2][i]*2.4}" rx="1.8" ry="1.4" fill="{INK}"></ellipse>' for i in range(8)) + f'<path d="M9.6 30V17M40 30V17" stroke="{INK}" stroke-width=".6"></path>',
      'quiz': f'<text x="22" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="{INK}">Dm?</text>',
      'metro': f'<path d="M15 34 19 10h6l4 24z" fill="none" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M22 28 29 13" stroke="{INK}" stroke-width="1.6" stroke-linecap="round"></path>',
      'needle': f'<path d="M9 30A14 14 0 0 1 35 30" fill="none" stroke="{INK}" stroke-width="1.4"></path><path d="M22 31 25 15" stroke="#C26A2E" stroke-width="2" stroke-linecap="round"></path><circle cx="22" cy="31" r="2" fill="{INK}"></circle>',
      'lens': ''.join(f'<rect x="{7+i*5}" y="20" width="4.6" height="16" rx="1" fill="#FEFDFB"></rect>' for i in range(6)) + f'<circle cx="25" cy="17" r="7" fill="none" stroke="{INK}" stroke-width="1.6"></circle><path d="m30 22 5 5" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"></path>',
      'circle': f'<circle cx="22" cy="22" r="14" fill="#FEFDFB" stroke="{INK}" stroke-width="1.2"></circle><circle cx="22" cy="22" r="7" fill="none" stroke="{INK}" stroke-width=".8"></circle><path d="M22 8 29 9.9 22 15z" fill="{ACCENT}" stroke="{INK}" stroke-width=".6"></path>',
      'swing': ''.join(f'<ellipse cx="{x}" cy="{y}" rx="2.6" ry="2" transform="rotate(-20 {x} {y})" fill="{INK}"></ellipse><path d="M{x+2.4} {y}V{y-13}" stroke="{INK}" stroke-width="1"></path>' for x, y in ((9, 31), (17, 28), (27, 31), (35, 26))) + f'<path d="M11.4 18H19.4M29.4 18H37.4" stroke="{INK}" stroke-width="2.2"></path><text x="22" y="40.5" text-anchor="middle" font-size="6.5" font-weight="700" fill="{INK}">3</text>',
      'chart': ''.join(f'<rect x="{6+(i%3)*11}" y="{12+(i//3)*11}" width="10" height="10" rx="2" fill="#FEFDFB"></rect>' for i in range(6)),
    }[kind]
    return f'<svg viewBox="0 0 44 44" width="{s}" height="{s}" aria-hidden="true" style="flex: none; border-radius: {s*0.23:.0f}px; background: {bg}">{g}</svg>'

# the root picker every page shares (R42 v42, Scales v68): one row C to B, the chosen letter tapped again for its spelling
def _track(lst, n, label):
    return (f'<div role="radiogroup" aria-label="{label}" style="display: grid; grid-template-columns: repeat({n}, minmax(0, 1fr)); gap: 2px; padding: 3px; border-radius: 14px; background: {FILL}"><sc-for list="{{{{roots.{lst}}}}}" as="r" hint-placeholder-count="{n}"><button type="button" role="radio" aria-checked="{{{{r.on}}}}" aria-label="{{{{r.aria}}}}" onClick="{{{{r.pick}}}}" style="height: 48px; min-width: 0; padding: 0; border: 0; border-radius: 11px; background: {{{{r.bg}}}}; box-shadow: {{{{r.sh}}}}; color: {INK}; font: inherit; font-size: 19px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</button></sc-for></div>')
HINT = (f'<sc-if value="{{{{rootHint.on}}}}" hint-placeholder-val="{{{{true}}}}"><div aria-hidden="true" style="position: relative; height: 34px; margin-top: -4px">'
        f'<span style="position: absolute; top: 0; {{{{rootHint.tip}}}}; width: 12px; height: 12px; background: {INK}; transform: translateY(2px) rotate(45deg); border-radius: 2px"></span>'
        f'<span style="position: absolute; top: 6px; {{{{rootHint.box}}}}; height: 26px; padding: 0 10px; border-radius: 13px; background: {INK}; color: #FEFDFB; font-size: 13px; font-weight: 600; line-height: 26px; white-space: nowrap">{{{{rootHint.t}}}}</span></div></sc-if>')
NOTEPICK = '<div style="display: flex; flex-direction: column; gap: 4px">' + _track('a', 7, 'Root') + HINT + '</div>'
