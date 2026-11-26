import re
# R41 kit: the calm tokens (calm_kit.py) plus the pieces every R41 page draws with. Each page keeps its own layout,
# taken from its reference app and its rulings; the kit only makes them speak one quiet language.
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/calm_kit.py').read())

# One gear for Settings on every board (loop round 32): the Practice pages' cog; the two sliders it replaces read as a filter.
# Sort and filter: two sliders (never Settings, which is the gear).
RED = '#B3261E'  # crimson: a loss, a wrong note (one token, every board)
FILTERI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M4 7h10M18 7h2M4 17h4M12 17h8"></path><circle cx="16" cy="7" r="2"></circle><circle cx="10" cy="17" r="2"></circle></svg>'
GEARI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
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
# one glass for every control that floats over the page (bars, floating actions, the transport): DESIGN.md, Placement
GLASSFX = f'background: {GLASS}; -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {FLOAT}'
GLASSST = f'flex: none; width: 44px; height: 44px; box-sizing: border-box; border-radius: 22px; border: 0; {GLASSFX}; color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none; padding: 0'
# The one switch between the Player and the editor (owner, 2026-11-16: "proper way to switch from the player to editor not
# like this two different controls in the editor and in the player"): Play · Edit in one glass capsule at the centre of
# both bars, the same pixels in each; each half 65 wide so nothing moves when the mode changes; the mode shown is ink.
# MODEBAR is the bar both screens share: Close leading, the switch, the screen's own glass group trailing (its column
# held to the editor's three buttons, so the switch stands where the editor's does).
# R74, the version and Edit as two controls (owner, 2026-11-26: "make it more visible to the user that its an
# accompaniment … easier to switch between the score and the accompaniment"; then "i dont like this edit button with this
# accompaniment: dont you see how awful it look inside this control"): the version is its own glass menu button beside
# the song's name (what is on the stand: the Accompaniment or the Score), and Edit is
# its own glass button right beside it, as Flat's "✎ Edit ▾" stands in the title's group after the transport (the owner's
# Flat screenshots), the same place in Play and in Edit, pressed on the sand wash while editing; a tap goes back to playing. A choice of
# what to read and a mode switch are two acts, so they are two controls. The version button is as wide as its longest
# name, so Edit beside it holds its place between Play and Edit. The menu is a native disclosure.
PENI = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="M21.17 6.81a1 1 0 0 0-3.99-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"></path></svg>'
VERSIONS = (('Original', 'Melody, chords and words'), ('My version', 'With a piano accompaniment'))
VER_DEFAULT = 'My version'
# R74, a song's versions (owner, 2026-11-26: "now we have a song and a song can have multiple versions of itself like
# just a score or my own version of this score with accompaniment: and when opening a songs now it open the default
# version. this versions can be edited as the user wants and the title of this versions"): the menu beside the name
# lists them (the default marked, the open one checked), then acts on the open one: New version (a copy of it),
# Rename…, Set as default, Delete version (crimson, last, with Undo). Edit beside it edits whichever is open. In the
# Player the list is live (`live`: rows from {{verRows}}, the summary {{verName}}); in the editor it switches by link.
def VERSW(on, other_href, label=None, live=False):
    sfx = 'Laptop.dc.html' if 'Laptop' in other_href else '.dc.html'
    shown = label or VER_DEFAULT
    st = f'width: 100%; min-height: 56px; box-sizing: border-box; padding: 8px 12px; border: 0; background: transparent; font: inherit; text-align: left; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 12px; text-decoration: none; color: {INK}'
    chip = f'<span style="flex: none; height: 20px; padding: 0 6px; border-radius: 6px; background: #EEE9E2; color: {SOFT}; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center">Default</span>'
    body = lambda name, sub, d, chk: (f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600">{name}{d}</span>'
                                      f'<span style="font-size: 13px; color: {SOFT}">{sub}</span></span><span style="flex: none; width: 16px; display: flex; color: {INK}">{chk}</span>')
    act = f'min-height: 40px; box-sizing: border-box; padding: 0 12px; border: 0; background: transparent; font: inherit; font-size: 15px; text-align: left; cursor: pointer; border-radius: 10px; display: flex; align-items: center; width: 100%; color: {INK}'
    if live:
        rows = ('<sc-for list="{{verRows}}" as="v" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{v.on}}" onClick="{{v.pick}}" style="' + st + '">'
                + body('{{v.name}}', '{{v.sub}}', f'<sc-if value="{{{{v.isDef}}}}" hint-placeholder-val="{{{{false}}}}">{chip}</sc-if>', f'<sc-if value="{{{{v.cur}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if>') + '</button></sc-for>')
        acts = (f'<div role="separator" style="height: 1px; margin: 6px 6px; background: {LINE}"></div>'
                + ''.join(f'<button type="button" role="menuitem" onClick="{{{{{h}}}}}" style="{act}{c}">{l}</button>' for l, h, c in (
                    ('New version', 'actNewVer', ''), ('Rename…', 'actRename', ''), ('Set as default', 'actSetDef', '; color: {{setDefFg}}'), ('Delete version', 'actDelVer', '; color: {{delVerFg}}'))))
        txt = '{{verName}}'
    else:
        rows = ''.join((f'<span role="menuitemradio" aria-checked="true" style="{st}">' if n == shown else f'<a role="menuitemradio" aria-checked="false" href="{other_href.replace("Player", "Editor") if on == "edit" else other_href}" style="{st}">')
                       + body(n, sub, chip if n == VER_DEFAULT else '', CHECK if n == shown else '') + ('</span>' if n == shown else '</a>') for n, sub in VERSIONS)
        acts = ''
        txt = shown
    menu = (f'<div role="menu" aria-label="Versions" style="position: absolute; z-index: 61; top: 52px; left: 0; width: 320px; box-sizing: border-box; padding: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, {FLOAT}; display: flex; flex-direction: column; text-align: left; font-weight: 400">{rows}{acts}</div>')
    summary = (f'<summary aria-label="Version: {txt}" data-tip="Versions" style="list-style: none; height: 44px; box-sizing: border-box; min-width: 148px; padding: 0 12px 0 16px; display: flex; align-items: center; justify-content: space-between; gap: 6px; cursor: pointer; font-size: 15px; font-weight: 600; color: {INK}; white-space: nowrap">'
               f'{txt}<span aria-hidden="true" style="display: flex; color: {SOFT}">{CHEV_D}</span></summary>')
    det = '<details class="vsw" ref="{{verRef}}" style="position: relative">' if live else '<details class="vsw" style="position: relative">'
    return (f'<div role="group" aria-label="Version" style="flex: none; position: relative; border-radius: 22px; {GLASSFX}; pointer-events: auto">'
            f'<style>details.vsw > summary::-webkit-details-marker {{ display: none }}</style>{det}{summary}{menu}</details></div>')
def EDITB(on, other_href):
    edit = on == 'edit'
    tip = 'Stop editing · E' if edit else 'Edit · E'
    look = 'background: #E8DFD3; box-shadow: 0 0 0 1px ' + LINE if edit else GLASSFX
    st = f'flex: none; height: 44px; box-sizing: border-box; border-radius: 22px; {look}; color: {INK}; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 15px; font-weight: 500; text-decoration: none; white-space: nowrap; position: relative; pointer-events: auto'
    # a phone's bar has no room for the word: the pencil alone, named in its tip
    if 'Laptop' in other_href:
        return f'<a href="{other_href}" aria-label="Edit" aria-pressed="{"true" if edit else "false"}" data-tip="{tip}" style="{st}; padding: 0 16px 0 12px">{PENI}Edit</a>'
    return f'<a href="{other_href}" aria-label="Edit" aria-pressed="{"true" if edit else "false"}" data-tip="{tip}" style="{st}; width: 44px">{PENI}</a>'
# The rail and its panel, Flat's new shell (FLAT_UI_SHELL_AND_MOTION §1.1–1.2), one implementation for the editor and the
# Player (owner, 2026-11-26: "make the player like the editor with its sidebar"): a 76 rail of entries (icon box 40×32,
# a 12 label), each opening one 352 panel headed by its name and a Fold.
_LI = lambda d: f'<svg viewBox="0 0 24 24" width="22" height="22" {I}>{d}</svg>'
NOTATIONI = _LI('<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>')
LAYOUTI = _LI('<rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18M9 21V9"></path>')
WAVESI = _LI('<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>')
AUDIOI = _LI('<path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path>')
SEARCHI = _LI('<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>')
KBDI = _LI('<rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"></path>')
HEADPHI = _LI('<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>')
MUTEI = _LI('<path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="m22 9-6 6M16 9l6 6"></path>')
GRIPI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.5"></circle><circle cx="15" cy="6" r="1.5"></circle><circle cx="9" cy="12" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="9" cy="18" r="1.5"></circle><circle cx="15" cy="18" r="1.5"></circle></svg>'
FOLDI = _LI('<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"></path>')
def _RAILBTN(label, icon, k, tip, act=None):
    sel = '' if act else f' role="tab" aria-selected="{{{{rail{k}On}}}}"'
    return (f'<button type="button"{sel} data-tip="{tip}" onClick="{{{{{act or "pick" + k}}}}}" style="width: 76px; min-height: 64px; border: 0; padding: 6px 0; background: transparent; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer">'
            f'<span style="width: 40px; height: 32px; border-radius: 10px; background: {{{{rail{k}Bg}}}}; display: flex; align-items: center; justify-content: center">{icon}</span>'
            f'<span style="font-size: 12px; font-weight: {{{{rail{k}W}}}}; line-height: 1.2">{label}</span></button>')
_PHEAD = lambda t: (f'<header style="flex: none; height: 64px; box-sizing: border-box; padding: 0 8px 0 16px; display: flex; align-items: center; gap: 8px; box-shadow: inset 0 -1px 0 {LINE}">'
                    f'<h2 style="flex: 1; margin: 0; font-size: 17px; font-weight: 600">{t}</h2>'
                    f'<button type="button" aria-label="Fold the panel" data-tip="Fold" onClick="{{{{foldPanel}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center; cursor: pointer">{FOLDI}</button></header>')
# a phone's bar: Close, then the version-and-mode capsule at the start (it is wider than a centred column leaves), the screen's group at the end
MODEBAR_P = 'height: 60px; box-sizing: border-box; padding: 8px 16px; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; justify-items: start; align-items: center; gap: 8px'
MODEBAR_L = 'height: 72px; box-sizing: border-box; padding: 12px 24px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px'
# The one bar (owner, 2026-11-15: "the headers" inconsistent; Apple HIG, Toolbars: "Use the standard Back and Close
# buttons … consistently implement it throughout your app"; iOS 26 draws bar items as glass): every bar's buttons
# are 44 glass circles 8 apart (IB), Back the same glass circle at the leading edge. A page under a page: 56 tall,
# its title 17 semibold centred; a place: TITLEBAR, its large title at the leading edge.
def TOP(back='', title='', right='', backlabel='Back', left='', n=0, pad='0 12px'):
    b = left or (f'<a href="{back}" aria-label="{backlabel}" data-tip="{backlabel}" style="{GLASSST}">{CHEV_L}</a>' if back else '')
    # bars.md: a title sits after Back or Close, 8 from its glass, never centred between the bar's sides (Apple,
    # Toolbars: "keep the title under 15 characters"; a long one ends in an ellipsis)
    t = f'<span data-bar-title style="flex: 0 1 auto; min-width: 0; margin-left: {8 if b else 4}px; font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{title}</span>' if title else ''
    return f'<header data-float style="position: relative; flex: none; height: 56px; display: flex; align-items: center; padding: {pad}">{b}{t}<span style="flex: 1"></span><div style="display: flex; align-items: center; gap: 8px">{right}</div></header>'
def LPAD(h):
    """The same bar on a laptop: 40 at its leading edge, 28 at its trailing, its title the laptop's 30 bold."""
    h = h.replace('padding: 0 12px', 'padding: 0 28px 0 40px', 1)
    # a laptop page's title is its 30 bold, as every laptop page's (Takes, Archive, a song's Settings)
    h = h.replace('margin-left: 8px; font-size: 17px; font-weight: 600;', 'margin-left: 12px; font-size: 30px; font-weight: 700; letter-spacing: -0.01em;', 1).replace('margin-left: 4px; font-size: 17px; font-weight: 600;', 'margin-left: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.01em;', 1)
    return h
def IB(label, svg, act='', href='', pressed=''):
    if href: return f'<a href="{href}" aria-label="{label}" data-tip="{label}" style="{GLASSST}">{svg}</a>'
    return f'<button type="button" aria-label="{label}" data-tip="{label}" {("onClick=\"{{" + act + "}}\"") if act else ""} {("aria-pressed=\"{{" + pressed + "}}\"") if pressed else ""} style="{GLASSST}">{svg}</button>'
# A word in the bar (Edit, Learned): the same glass, as a capsule 44 tall.
TBST = f'flex: none; height: 44px; box-sizing: border-box; padding: 0 16px; border-radius: 22px; border: 0; {GLASSFX}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; white-space: nowrap'
def TB(label, act):
    return f'<button type="button" onClick="{{{{{act}}}}}" style="{TBST}">{label}</button>'
# Learned, on a song and a lesson: the glass capsule, a grass wash once learned (JS gives learnedBg, learnedLine, learnedFg).
LEARNEDT = f'<button type="button" aria-pressed="{{{{learned}}}}" onClick="{{{{toggleLearned}}}}" style="{TBST}; background: {{{{learnedBg}}}}; border-color: {{{{learnedLine}}}}; color: {{{{learnedFg}}}}"><sc-if value="{{{{learned}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if>Learned</button>'
# A modal task (a run, sign-in) leaves by the standard Close (HIG): the same glass circle, a ✕, at the leading edge.
def CLOSEB(href='', act='', label='Close'):
    return IB(label, CLOSE, act, href)
GEAR = lambda: IB('Settings', GEARI, 'openSet')
DOTS = lambda: IB('More', MORE, 'openMore')

# A place's bar (owner, 2026-11-13: "I dont like that the header is occupied only by these two buttons no the right and the
# rest is just empty"): the title sits in the bar itself, at its left, the actions at its right; never an empty bar
# over a title on its own line. Back, where there is one, before the title.
def TITLEBAR(title, right='', back='', backlabel='Back', soft='', wrap=False):
    b = f'<a href="{back}" aria-label="{backlabel}" data-tip="{backlabel}" style="{GLASSST}; margin-left: -4px">{CHEV_L}</a>' if back else ''
    fs = 26 if soft else 24 if wrap else 28  # two titles side by side (My songs · Explore) take a step down so neither is cut
    # a page's own name (a course's, a lesson's Settings') takes a second line before it is ever cut
    s = f'<span style="flex: none; font-size: {fs}px; font-weight: 700; letter-spacing: -0.01em; color: {LINE}; white-space: nowrap">{soft}</span>' if soft else ''
    return (f'<header data-float style="flex: none; min-height: 60px; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 0 12px 4px 16px">{b}'
            f'<h1 data-bar-title style="margin: 0; min-width: 0; flex: {"none" if soft else "0 1 auto"}; font-size: {fs}px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.15; ' + ('display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-wrap: balance' if wrap else 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis') + f'">{title}</h1>{s}'
            f'<span style="flex: 1"></span><div style="flex: none; display: flex; align-items: center; gap: 8px">{right}</div></header>')
def LTITLEBAR(title, right='', back='', backact=''):
    b = (f'<a href="{back}" aria-label="Back" data-tip="Back" style="{GLASSST}">{CHEV_L}</a>' if back else
         f'<button type="button" onClick="{{{{{backact}}}}}" aria-label="Back" data-tip="Back" style="{GLASSST}; border: 0; cursor: pointer">{CHEV_L}</button>' if backact else '')
    # one laptop sub-page bar (2026-11-19): LPAD's 56, Back 40 in and the title 12 after it, as the app's ScreenHeader,
    # the content 24 under it as every laptop page's
    return f'<header style="flex: none; height: 56px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; padding: 0 28px 0 {40 if (back or backact) else 56}px">{b}<h1 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.01em">{title}</h1><span style="flex: 1"></span>{right}</header>'
# a place's own page (Learn, Practice) on a laptop: the 88 bar, its name 56 in at 30 bold, as Practice's board and the app's
LPLACEBAR = lambda title, right='': f'<header style="flex: none; height: 88px; display: flex; align-items: center; gap: 8px; padding: 0 28px 0 56px"><h1 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.01em">{title}</h1><span style="flex: 1"></span>{right}</header>'
# One frame for every place of an area on a laptop (owner, 2026-11-17: "the pages change to much from the all songs to
# explore … the user doesnt understand where it goes"; Jakob's law, NN/g consistency): an 88 bar, the place's name at
# 56 in 30 bold with its count beside it, the place's acts, then the search pinned at the trailing edge (Finder, Apple
# Music), so moving between sibling places changes the content and never the frame.
# both ends on the place's 56 column, so its last act ends where the content ends (edges meet; owner's lines, 2026-11-18)
def LPLACEBAR(title, count='', acts='', search=''):
    c = f'<span style="flex: none; font-size: 17px; color: {SOFT}; font-variant-numeric: tabular-nums">{count}</span>' if count else ''
    return (f'<header data-placebar style="flex: none; height: 88px; display: flex; align-items: center; gap: 12px; padding: 0 56px">'
            f'<h1 style="margin: 0; min-width: 0; font-size: 30px; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{title}</h1>{c}<span style="flex: 1"></span>'
            f'<div style="flex: none; display: flex; align-items: center; gap: 8px">{acts}</div>{search}</header>')
# The keyboard each kind of field asks for (laws, A phone is not a small laptop 5): every <input> names its kind, so a
# phone opens the right keys and the port carries them. A password keeps its type from its eye and adds its autocomplete.
KB = {'search': 'type="search" enterkeyhint="search" autocapitalize="off"',
      'title': 'type="text" autocapitalize="words" enterkeyhint="done"',
      'text': 'type="text" autocapitalize="sentences" enterkeyhint="done"',
      'name': 'type="text" autocomplete="name" autocapitalize="words"',
      'username': 'type="text" autocomplete="username" autocapitalize="off" spellcheck="false"',
      'email': 'type="email" autocomplete="email" autocapitalize="off" spellcheck="false"',
      'person': 'type="text" autocapitalize="off" spellcheck="false" enterkeyhint="done"',
      'url': 'type="url" autocapitalize="off" spellcheck="false" enterkeyhint="go"',
      'code': 'type="text" autocapitalize="characters" autocorrect="off" spellcheck="false"',
      'current-password': 'autocomplete="current-password"', 'new-password': 'autocomplete="new-password"'}
# the one search box (SEARCHBOX) of a place, 320 wide, at the bar's trailing edge
def PSEARCH(ph, val='q', act='setQ'):
    return (SEARCHBOX().replace('flex: none;', 'flex: none; width: 320px;', 1)
            + f'<input {KB["search"]} value="{{{{{val}}}}}" onInput="{{{{{act}}}}}" placeholder="{ph}" aria-label="{ph}" style="flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}"></label>')
# A laptop sub-page's column: it starts on the bar title's edge (scan-first 1), never centred under a title at the left.
LCOL = lambda inner, w: f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 48px; display: flex"><div style="width: min({w}px, 100%); display: flex; flex-direction: column; gap: 16px">{inner}</div></main>'
# The ⓘ: one glyph for every explanation behind a tap.
INFOI = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>'
# The ⓘ's one shape (owner: explanations go in ⓘ popups; Material 3's rich tooltip, HIG's popover): a 20 glyph in a
# 44 target; tapped, a small card anchored under it, paper, 16 corners, a ring and the float's shadow, closed by a tap
# outside. Its parent is position: relative; pos places the card (left or right edge, top).
def INFOB(label, act, on):
    return f'<button type="button" aria-label="{label}" data-tip="{label}" aria-expanded="{{{{{on}}}}}" onClick="{{{{{act}}}}}" style="flex: none; width: 44px; height: 44px; margin: -12px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{ICON(INFOI, 20)}</button>'
def INFOTIP(on, close, label, body, pos='left: 0; top: 32px'):
    return (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{{close}}}}}" style="position: fixed; inset: 0; z-index: 60"></div>'
            f'<div role="dialog" aria-label="{label}" style="position: absolute; {pos}; z-index: 61; width: 300px; max-width: calc(100vw - 32px); box-sizing: border-box; padding: 16px; border-radius: 16px; background: {SHEET}; color: {INK}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; font-size: 15px; line-height: 1.45; text-wrap: pretty; display: flex; flex-direction: column; gap: 12px">{body}</div></sc-if>')
def SUBJECT(name, sub, size=40, align='left'):
    return f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px; text-align: {align}"><h1 style="margin: 0; font-size: {size}px; line-height: 1.05; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap">{name}</h1><p style="margin: 0; font-size: 15px; color: {SOFT}">{sub}</p></div>'
H2 = lambda t, right='': f'<div style="display: flex; align-items: baseline; justify-content: space-between; margin: 16px 0 -4px"><h2 style="margin: 0; font-family: {FONT}; font-size: 20px; font-weight: 700">{t}</h2>{right}</div>'
# a group's caption stands on its rows' text (16 in); over tiles or chips that start on the column, inset=0
# a screen's search box, as the app's SearchField: 44 tall, the control's 12 corners, sand, 12 in, the magnifier 8 before
# the words; grow=True where it shares its row (a sort or a filter beside it)
SEARCHBOX = lambda grow=False: f'<label style="{"flex: 1; min-width: 0" if grow else "flex: none"}; height: 44px; box-sizing: border-box; border-radius: 12px; background: {FILL}; display: flex; align-items: center; gap: 8px; padding: 0 12px; color: {SOFT}">{SEARCH}'
CAPS = lambda t, inset=16: f'<h3 style="margin: 0 0 0 {inset}px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{t}</h3>'

# ── controls ──
def SEGC(lst, h=32, fs=14, fill=False):
    """A segmented choice; fill=True when it takes its row's width (a mode switch across a bar)."""
    return f'<div role="radiogroup" style="flex: {'1' if fill else 'none'}; display: flex; gap: 2px; padding: 2px; border-radius: 11px; background: {FILL}"><sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="flex: 1; min-width: 0; height: 44px; padding: 0 12px; border: 0; border-radius: 9px; background: {{{{o.bg}}}}; box-shadow: {{{{o.sh}}}}; color: {INK}; font: inherit; font-size: {fs}px; font-weight: {{{{o.fw}}}}; white-space: nowrap">{{{{o.l}}}}</button></sc-for></div>'
def CHIPS(lst, wrap=False, bleed=True):
    # a row of chips scrolls to the screen's edges (bleed); in a sheet or beside a control the row wraps, never cut at its edge
    lay = 'flex-wrap: wrap; row-gap: 0; margin: -4px 0' if wrap else 'overflow-x: auto; margin: -4px -16px; padding: 0 16px' if bleed else 'overflow-x: auto; margin: -4px 0; padding: 0'
    return f'<div class="nos" role="radiogroup" style="flex: none; display: flex; gap: 8px; {lay}"><sc-for list="{{{{{lst}}}}}" as="p" hint-placeholder-count="4"><button type="button" onClick="{{{{p.pick}}}}" style="flex: none; min-width: 44px; height: 44px; padding: 0 16px; border: solid transparent; border-width: 4px 0; background-clip: padding-box; border-radius: 22px; background-color: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 14px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div>'
KCHIPS = CHIPS
# In a sheet the choices wrap, never cut at its edge ("nothing is cut")
# A caption and the control it names, 8 apart, so the sheet's 16 falls between fields, not inside one (proximity)
LABELLED = lambda t, ctrl: f'<div style="display: flex; flex-direction: column; gap: 8px">{CAPS(t)}{ctrl}</div>'
WCHIPS = lambda lst: CHIPS(lst, wrap=True)
# Lucide's minus and plus at 20, stroke 2, as the app's Stepper draws them (they were the font's − and + at 20)
STEP_MINUS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path></svg>'
STEP_PLUS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5v14"></path></svg>'
def STEPPER(val, dn, up, w=64, dis=False):
    # dis: the board sets {dn}Dis and {up}Dis, and a − or + at its bound dims as the app's Stepper (muted at 50%)
    b = lambda a, s, l: f'<button type="button" class="stp" aria-label="{l}" onClick="{{{{{a}}}}}"{f' disabled="{{{{{a}Dis}}}}"' if dis else ''} style="width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; font: inherit; display: inline-flex; align-items: center; justify-content: center">{s}</button>'
    return f'<div style="flex: none; display: flex; align-items: center; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}">{b(dn, STEP_MINUS, "Less")}<span style="min-width: {w}px; text-align: center; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums">{{{{{val}}}}}</span>{b(up, STEP_PLUS, "More")}</div>'
def TOGGLE(on, face=False):  # face: the switch's picture inside a row that is itself the switch, hidden from readers
    return f'<span {"aria-hidden=\"true\"" if face else f"role=\"switch\" aria-checked=\"{{{{{on}}}}}\""} style="flex: none; width: 51px; height: 31px; border-radius: 16px; background: {{{{{on}Bg}}}}; box-shadow: inset 0 0 0 1px rgba(51,41,33,.12); position: relative"><span style="position: absolute; top: 2px; left: {{{{{on}X}}}}px; width: 27px; height: 27px; border-radius: 14px; background: {SHEET}; box-shadow: 0 2px 4px rgba(51,41,33,.2)"></span></span>'
def GROUP(*rows, bg=FILL):
    out = []
    for i, r in enumerate(rows):
        sep = f'box-shadow: inset 0 -1px 0 {FILL};' if i < len(rows) - 1 else ''
        k = r[0]
        lab = f'<span style="flex: 1; min-width: 0; font-size: 16px">{r[1]}</span>'
        base = f'min-height: 48px; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 6px 12px 6px 16px; {sep}'
        if k == 'link':  # label, value, href or act
            # the label whole, the value taking the rest and cut with an ellipsis at its end, as the app's GroupLink
            lab = f'<span style="flex: none; font-size: 16px">{r[1]}</span>'
            val = f'<span style="flex: 1; min-width: 0; font-size: 16px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right">{r[2]}</span>' if r[2] else '<span style="flex: 1"></span>'
            tgt = r[3] if len(r) > 3 else ''
            if tgt.endswith('.html') or tgt == '#':
                out.append(f'<a href="{tgt}" style="{base} color: {INK}; text-decoration: none">{lab}{val}<span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>')
            else:
                out.append(f'<button type="button" {("onClick=\"{{" + tgt + "}}\"") if tgt else ""} style="{base} width: 100%; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left">{lab}{val}<span style="color: {SOFT}; display: flex">{CHEV_R}</span></button>')
        elif k == 'seg': out.append(f'<div style="{base.replace("align-items: center; gap: 12px; padding: 6px 12px 6px 16px", "flex-direction: column; align-items: stretch; gap: 8px; padding: 12px 12px 12px 16px")}"><span style="font-size: 16px">{r[1]}</span>{SEGC(r[2], 44, 14)}</div>')
        elif k == 'step': out.append(f'<div style="{base}">{lab}{STEPPER(*r[2:5], dis=len(r) > 6 and r[6])}</div>')
        elif k == 'segr': out.append(f'<div style="{base.replace("padding: 6px 12px 6px 16px", "padding: 4px 12px 4px 16px")}">{lab}<div style="flex: none; width: {r[3] if len(r) > 3 else 360}px">{SEGC(r[2], 44, 14)}</div></div>')  # a laptop row: the choice at the row's end, as a stepper; its 48 control takes 4 of padding so the row is 56, the stepper row's height (similarity)
        # a switch row is one control: the row is the switch and carries its name; the drawn switch is its picture
        elif k == 'toggle': out.append(f'<button type="button" role="switch" aria-checked="{{{{{r[2]}}}}}" onClick="{{{{{r[3]}}}}}" style="{base} width: 100%; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left">{lab}{TOGGLE(r[2], face=True)}</button>')
        elif k == 'val': out.append(f'<div style="{base}">{lab}<span style="font-size: 16px; color: {SOFT}; font-variant-numeric: tabular-nums">{r[2]}</span></div>')
        elif k == 'action': out.append(f'<button type="button" onClick="{{{{{r[2]}}}}}" style="{base} width: 100%; border: 0; background: transparent; color: {r[3] if len(r) > 3 else LINK}; font: inherit; font-size: 16px; text-align: left">{r[1]}</button>')
        elif k == 'raw': out.append(f'<div style="{sep}">{r[1]}</div>')
    # round 41: one card of rows. On the card paper a group is BOXG's card, 14 corners and the hairline ring, so a page
    # never draws its groups two ways; a filled group (on a sheet) keeps its fill alone.
    if bg == SHEET:
        return f'<div data-group style="flex: none; border-radius: 14px; background: {bg}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">{"".join(out)}</div>'
    return f'<div data-group style="flex: none; border-radius: 12px; background: {bg}; overflow: hidden">{"".join(out)}</div>'
def BTN(label, act='', href='', kind='primary', h=50, grow=True, fg=INK, attrs=''):
    """A text button: honey for the screen's one act, quiet beside it. Two heights only (laws, similarity: near-miss
    heights read as a mistake): 50 for a page's or sheet's act, 44 compact in a row; 48 and 52 are 50."""
    h = 44 if h < 47 else 50
    bg = {'primary': ACCENT, 'quiet': FILL, 'plain': 'transparent'}[kind]  # fg: a state's ink (a disabled Clear); attrs: extra attributes, first; plain: on glass beside the honey act (one fill per dock)
    # min-height: in a column, flex: 1's zero basis squashed it to its text when the column was full (Copy link, 20 tall)
    st = f'{"flex: 1;" if grow else "flex: none;"} min-width: 0; height: {h}px; min-height: {h}px; padding: 0 20px; border: 0; border-radius: {h // 2}px; background: {bg}; color: {fg}; font: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; white-space: nowrap'
    return f'<a href="{href}" style="{st}">{label}</a>' if href else f'<button {attrs}type="button" {("onClick=\"{{" + act + "}}\"") if act else ""} style="{st}">{label}</button>'
def PLAYBTN(size=52, glyph=(22, 20)):  # glyph: the play and stop marks' sizes, smaller in a small button
    return f'<button type="button" aria-label="{{{{playLabel}}}}" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="flex: none; width: {size}px; height: {size}px; border: 0; border-radius: {size // 2}px; background: {ACCENT}; color: {INK}; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOP.replace('"20"', f'"{glyph[1]}"')}</sc-if><sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAY.replace('"22"', f'"{glyph[0]}"')}</sc-if></button>'
def DOCK(inner, bottom=34, pad=8, w=None):  # bottom: px, or a state's placement ('{{dockPos}}') given whole
    """The floating glass bar at the foot of a page: the phone's full width, or w wide and centred (a laptop's
    selection bar, 'auto' to hug its acts); not for the laptop's dock in the flow, which is DOCK_L."""
    place = 'left: 16px; right: 16px;' if w is None else 'left: 50%; transform: translateX(-50%);' + ('' if w == 'auto' else f' width: {w}px;')
    return f'<div role="toolbar" style="position: absolute; {place} {bottom if isinstance(bottom, str) else f'bottom: {bottom}px'}; z-index: 40; height: 68px; box-sizing: border-box; padding: 0 {pad}px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {FLOAT}; display: flex; align-items: center; gap: 8px">{inner}</div>'
def DOCK_L(inner, w=560):
    return f'<div style="flex: none; display: flex; justify-content: center"><div role="toolbar" style="width: {w}px; height: 68px; box-sizing: border-box; padding: 0 8px; border-radius: 34px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {FLOAT}; display: flex; align-items: center; gap: 8px">{inner}</div></div>'
def CARD(inner, pad='16px', extra=''):
    return f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: {pad}; {extra}">{inner}</div>'
def ROOTGRID(lst='roots'):
    def track(half):
        return (f'<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 2px; padding: 3px; border-radius: 14px; background: {FILL}">'
                f'<sc-for list="{{{{{lst}.{half}}}}}" as="r" hint-placeholder-count="6"><button type="button" role="radio" aria-checked="{{{{r.on}}}}" onClick="{{{{r.pick}}}}" '
                f'style="height: 44px; min-width: 0; padding: 0; border: 0; border-radius: 11px; background: {{{{r.bg}}}}; box-shadow: {{{{r.sh}}}}; color: {INK}; font: inherit; font-size: 18px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</button></sc-for></div>')
    return f'<div role="radiogroup" aria-label="Root" style="display: flex; flex-direction: column; gap: 8px">{track("a")}{track("b")}</div>'
def _BSHEET(cond, title, body, done='Done', close='closeSheet'):
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><style>[role=dialog].nos > * {{ flex-shrink: 0 }}</style><div onClick="{{{{{close}}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.32)"></div><section role="dialog" aria-modal="true" aria-label="{title}" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 16px" class="nos"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div><div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 36px"><span style="font-size: 17px; font-weight: 600">{title}</span><button type="button" onClick="{{{{{close}}}}}" style="position: absolute; right: 0; height: 44px; padding: 0 4px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 17px; font-weight: 600">{done}</button></div>{body}</section></sc-if>'
def BSHEET(cond, title, body, done='Done', tall=False, back='', maxh='', close='closeSheet'):
    # back: a sub-page's Back before its title; maxh: a cap other than 86% (a sheet over a bar that stays in reach)
    # done=None: a sheet whose foot closes it (Sort and filter's Show n) carries no second way out in its head;
    # tall: a sheet that keeps its full height while its list changes (Search, a chord type's list)
    t = _BSHEET(cond, title, body, done or '', close)
    if back:
        t = t.replace(f'<span style="font-size: 17px; font-weight: 600">{title}</span>', back + f'<span style="font-size: 17px; font-weight: 600">{title}</span>', 1)
    if maxh:
        t = t.replace('max-height: 86%', 'max-height: ' + maxh, 1)
    if tall:
        t = t.replace('max-height: 86%;', 'height: 86%; box-sizing: border-box;', 1)
    return re.sub(r'<button[^>]*>' + '</button>', '', t, count=1) if done is None else t
# A thing's Settings over its page, never a page of its own (owner, 2026-11-20: "why dont we do such things like the
# app settings in such popup window"): on a laptop the app Settings' window (centred on the window, 720 wide, 48 under
# its top, 22 round, the page dimmed, a 56 bar with Back on a page inside, the title and ×, one column scrolling under
# it); on a phone a tall sheet (BSHEET's 86%, the grabber, Back, the title, Done). on/close: the state's names; title:
# its markup's text ({{pageT}}); back: the Back of a page inside, shown by its own condition, or ''.
_WXI = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>'
def THINGWIN(lap, on, close, title, body, back='', pad='32', shown='true', side=248):  # side: the sidebar's width beside the page (0 on a full-screen page: the editor, the Player)
    if not lap:
        return (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{{shown}}}}}"><div onClick="{{{{{close}}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.32)"></div>'
                f'<section role="dialog" aria-modal="true" aria-label="{title}" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; height: 86%; box-sizing: border-box; border-radius: 22px 22px 0 0; background: {PAGE}; display: flex; flex-direction: column">'
                f'<div style="flex: none; padding: 6px 16px 8px; display: flex; flex-direction: column; gap: 10px"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>'
                f'<div style="display: grid; grid-template-columns: minmax(56px, 1fr) auto minmax(56px, 1fr); align-items: center; min-height: 44px"><div>{back}</div><span style="font-size: 17px; font-weight: 600">{title}</span><button type="button" onClick="{{{{{close}}}}}" style="justify-self: end; height: 44px; padding: 0 4px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 17px; font-weight: 600">Done</button></div></div>'
                f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 40px; display: flex; flex-direction: column; gap: 16px">{body}</div></section></sc-if>')
    return (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{{shown}}}}}"><div onClick="{{{{{close}}}}}" style="position: absolute; top: 0; bottom: 0; left: -{side}px; right: 0; z-index: 60; background: rgba(51, 41, 33, 0.32)"></div>'
            f'<div role="dialog" aria-modal="true" aria-label="{title}" style="position: absolute; z-index: 61; left: 50%; top: 50%; transform: translate(calc(-50% - {side // 2}px), -50%); width: 720px; height: min(720px, calc(100% - 96px)); border-radius: 22px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, 0 24px 64px rgba(51, 41, 33, 0.28); display: flex; flex-direction: column; overflow: hidden">'
            f'<header style="flex: none; height: 56px; display: flex; align-items: center; gap: 4px; padding: 0 8px 0 {pad}px; box-shadow: inset 0 -1px 0 {LINE}">{back}<h1 style="flex: 1; margin: 0; font-size: 17px; font-weight: 600">{title}</h1>'
            f'<button type="button" onClick="{{{{{close}}}}}" aria-label="Close" data-tip="Close" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; display: flex; align-items: center; justify-content: center; color: {INK}">{_WXI}</button></header>'
            f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 20px 32px 32px; display: flex; flex-direction: column; gap: 16px">{body}</main></div></sc-if>')
# A row's ··· menu (owner, 2026-11-17: "what kind of nonsense is to put this delete in this cnetered popup with doen
# button"; Apple HIG, Pull-down buttons and Menus; Material 3, Menus): a ··· opens a menu at its button, on a phone as
# on a laptop, never a sheet or a dialog centred on the screen, never a title over it and never Done in it. Glass, 6
# in, items 44 tall in the menu's 16; what loses something last, after a hairline, in crimson. Items are GROUP's
# tuples: ('link', label, '', href) or ('action', label, act[, colour]). The JS sets {posvar} from ANCHOR(e, h).
def ROWMENU(cond, label, items, posvar='menuPos', w=240):
    out, seen_red = [], False
    for t in items:
        kind, l = t[0], t[1]
        col = t[3] if kind == 'action' and len(t) > 3 and t[3] else INK
        if col == RED and not seen_red and out:
            out.append(f'<div role="separator" style="height: 1px; margin: 6px 12px; background: {LINE}"></div>')
            seen_red = seen_red or col == RED
        st = f'width: 100%; height: 44px; box-sizing: border-box; border: 0; border-radius: 10px; background: transparent; padding: 0 12px; display: flex; align-items: center; color: {col}; font: inherit; font-size: 16px; text-align: left; text-decoration: none'
        out.append(f'<a role="menuitem" href="{t[3]}" style="{st}">{l}</a>' if kind == 'link' else f'<button type="button" role="menuitem" onClick="{{{{{t[2]}}}}}" style="{st}">{l}</button>')
    return MENUSHELL(cond, label, ''.join(out), posvar, w)
# the menu's glass shell, for a menu whose items are drawn elsewhere (New's rows with their icons)
def MENUSHELL(cond, label, body, posvar='menuPos', w=240):
    return (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
            f'<div role="menu" aria-label="{label}" style="position: absolute; {{{{{posvar}}}}}; z-index: 61; width: {w}px; box-sizing: border-box; padding: 6px; border-radius: 16px; {GLASSFX}; display: flex; flex-direction: column; transform-origin: top right">{body}</div></sc-if>')
def POPOVER(cond, title, body, pos='right: 40px; top: 64px', w=380, back='', h=''):  # back: a sub-page's Back, left of its centred title; h: a fixed height for a list that changes
    # never past the screen: its height is capped by the room left from its top or bottom on the 904-tall laptop screen
    m = re.search(r'(?:top|bottom): (\d+)px', pos)
    mh = min(760, 904 - int(m.group(1)) - 16) if m else 760
    out = (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><style>[role=dialog].nos > * {{ flex-shrink: 0 }}</style><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="dialog" aria-label="{title}" style="position: absolute; {pos}; z-index: 61; width: {w}px; {('height: ' + h) if h else f'max-height: {mh}px'}; overflow-y: auto; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 16px 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px" class="nos"><span style="font-size: 17px; font-weight: 600">{title}</span>{body}</div></sc-if>')
    return out.replace(f'<span style="font-size: 17px; font-weight: 600">{title}</span>', f'<div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 44px">{back}<span style="font-size: 17px; font-weight: 600">{title}</span></div>', 1) if back else out


def js(body):
    return 'class Component extends DCLogic {\n  renderVals() {\n    const st = this.state || {}; const set = (o) => this.setState(o);\n' + R41PRE + '\n' + body + '\n  }\n}\n'

def detail(stem, title, script, phone_body, laptop_main, laptop_aside, sheets_phone='', pops_laptop='', section='Practice'):
    phone(stem, title + ', phone', phone_body, script, sheets_phone)
    laptop(stem + 'Laptop' if stem != 'Main' else 'Laptop', title + ', laptop', laptop_main, laptop_aside, script, pops_laptop, section)
# Edit morphs into Done in its own place (owner, 2026-11-17: "the edit should morf into the done and not into the
# publish"): entering Edit keeps the bar (Back, the title, the gear); Edit's glass word becomes Done, and Publish, a
# glass word that publishes in one tap with Undo in its toast, stands before it. Apple HIG, Edit buttons.
EDITR = lambda: TB('{{pubL}}', 'publishNow') + TB('Done', 'done')
def LTOP(back='', right='', title=''):
    return LPAD(TOP(back, title, right))  # a laptop page's bar is the phone's, its title centred

# the engraved melody (Amazing Grace), shared with R40
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/calm_parts.py').read())
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
                f'color: {INK if on else "#685E56"}; background: {FILL if on else "transparent"}">{svg}'
                f'<span style="font-size: 12px; font-weight: {700 if on else 500}; line-height: 1">{l}</span></a>')
    a = ''.join(one(l, h) for l, h in items)
    edge = ''  # nothing behind what floats (owner, 2026-11-15: floating buttons with a background make no sense)
    # a phone on its side (under 520 high): a compact capsule, centred, each icon beside its word, as iOS's tab bar in
    # compact height (Apple HIG, Tab bars), so the places stay together and the page keeps its room (round 66)
    short = ('<style data-tabshort>[data-menuroot] { container-type: size } @container (max-height: 520px) { nav[aria-label="Main"] { left: 50% !important; right: auto !important; '
             'translate: -50% 0; width: 440px; height: 52px !important; bottom: 24px !important } nav[aria-label="Main"] > a { flex-direction: row !important; height: 40px !important; gap: 6px !important } '
             'button[aria-label="New"][aria-haspopup] { bottom: 22px !important } ul[role="menu"][aria-label="New"] { bottom: 94px !important } }</style>')
    return edge + short + f'<nav aria-label="Main" style="position: absolute; left: 16px; right: 16px; bottom: 30px; z-index: 40; height: 64px; box-sizing: border-box; padding: 6px; border-radius: 32px; background: {GLASS}; backdrop-filter: blur(24px) saturate(1.8); box-shadow: 0 0 0 1px {LINE}, {FLOAT}; display: flex; gap: 2px">{a}</nav>'

# small pictures that show the content (Practice's rows and cards)
def pic(kind, s=44):
    bg = {'cards': LILAC, 'keys': PEACH, 'staff': SKY, 'arc': SAGE, 'roman': HONEY, 'roll': LILAC, 'chips': HONEY, 'drill': SAGE, 'quiz': PEACH, 'metro': FILL, 'needle': FILL, 'lens': FILL, 'circle': FILL, 'chart': HONEY, 'swing': SKY, 'sixdim': LILAC}[kind]
    g = {
      'cards': f'<rect x="9" y="9" width="20" height="26" rx="4" transform="rotate(-12 19 22)" fill="#FEFDFB" opacity=".7"></rect><rect x="16" y="10" width="20" height="26" rx="4" fill="#FEFDFB" stroke="{INK}" stroke-width=".8"></rect><text x="26" y="27" text-anchor="middle" font-family="Georgia, serif" font-size="10" font-weight="700" fill="{INK}">G7</text>',
      'keys': ''.join(f'<rect x="{6+i*5}" y="12" width="4.6" height="20" rx="1" fill="{"#E19E8C" if i in (1,3,5) else "#FEFDFB"}"></rect>' for i in range(7)) + ''.join(f'<rect x="{9.5+i*5}" y="12" width="3" height="12" fill="{INK}"></rect>' for i in (0,1,3,4,5)),
      'staff': ''.join(f'<path d="M6 {14+i*4}H38" stroke="{INK}" stroke-width=".7"></path>' for i in range(5)) + ''.join(f'<ellipse cx="{11+i*5}" cy="{32-i*2.2}" rx="2.2" ry="1.7" fill="{INK}"></ellipse>' for i in range(6)),
      'arc': f'<ellipse cx="13" cy="30" rx="3" ry="2.3" fill="{INK}"></ellipse><ellipse cx="31" cy="18" rx="3" ry="2.3" fill="{INK}"></ellipse><path d="M14 26Q22 6 30 14" fill="none" stroke="{INK}" stroke-width="1.4"></path>',
      'roman': f'<text x="22" y="27" text-anchor="middle" font-size="10.5" font-weight="700" word-spacing="2.5" fill="{INK}">I IV V</text>',
      'roll': ''.join(f'<rect x="{6+i*8}" y="{28 - (i%2)*8}" width="6" height="3.5" rx="1.5" fill="{INK}"></rect>' for i in range(4)) + f'<rect x="6" y="34" width="30" height="3.5" rx="1.5" fill="#8C7AB8"></rect>',
      'chips': ''.join(f'<rect x="{5+i*12}" y="15" width="10" height="14" rx="3" fill="#FEFDFB"></rect><text x="{10+i*12}" y="25.5" text-anchor="middle" font-size="7" font-weight="700" fill="{INK}">{c}</text>' for i, c in enumerate('CGF')),
      'drill': ''.join(f'<ellipse cx="{8+i*4.4}" cy="{30-[0,2,3,4,5,4,3,2][i]*2.4}" rx="1.8" ry="1.4" fill="{INK}"></ellipse>' for i in range(8)) + f'<path d="M9.6 30V17M40 30V17" stroke="{INK}" stroke-width=".6"></path>',
      'quiz': f'<text x="22" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="{INK}">Dm?</text>',
      'metro': f'<path d="M15 34 19 10h6l4 24z" fill="none" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"></path><path d="M22 28 29 13" stroke="{INK}" stroke-width="1.6" stroke-linecap="round"></path>',
      'needle': f'<path d="M9 30A14 14 0 0 1 35 30" fill="none" stroke="{INK}" stroke-width="1.4"></path><path d="M22 31 25 15" stroke="#C26A2E" stroke-width="2" stroke-linecap="round"></path><circle cx="22" cy="31" r="2" fill="{INK}"></circle>',
      'lens': ''.join(f'<rect x="{7+i*5}" y="20" width="4.6" height="16" rx="1" fill="#FEFDFB"></rect>' for i in range(6)) + f'<circle cx="25" cy="17" r="7" fill="none" stroke="{INK}" stroke-width="1.6"></circle><path d="m30 22 5 5" stroke="{INK}" stroke-width="1.8" stroke-linecap="round"></path>',
      'circle': f'<circle cx="22" cy="22" r="14" fill="#FEFDFB" stroke="{INK}" stroke-width="1.2"></circle><circle cx="22" cy="22" r="7" fill="none" stroke="{INK}" stroke-width=".8"></circle><path d="M22 8 29 9.9 22 15z" fill="{ACCENT}" stroke="{INK}" stroke-width=".6"></path>',
      'swing': ''.join(f'<ellipse cx="{x}" cy="{y}" rx="2.6" ry="2" transform="rotate(-20 {x} {y})" fill="{INK}"></ellipse><path d="M{x+2.4} {y}V{y-13}" stroke="{INK}" stroke-width="1"></path>' for x, y in ((9, 31), (17, 28), (27, 31), (35, 26))) + f'<path d="M11.4 18H19.4M29.4 18H37.4" stroke="{INK}" stroke-width="2.2"></path><text x="22" y="40.5" text-anchor="middle" font-size="6.5" font-weight="700" fill="{INK}">3</text>',
      'sixdim': f'<text x="22" y="28.5" text-anchor="middle" font-size="15" font-weight="700" fill="{INK}">6°</text>',
      'chart': ''.join(f'<rect x="{6+(i%3)*11}" y="{12+(i//3)*11}" width="10" height="10" rx="2" fill="#FEFDFB"></rect>' for i in range(6)),
    }[kind]
    return f'<svg viewBox="0 0 44 44" width="{s}" height="{s}" aria-hidden="true" style="flex: none; border-radius: {s*0.23:.0f}px; background: {bg}">{g}</svg>'

# the root picker every page shares (R42 v42, Scales v68): one row C to B, the chosen letter tapped again for its spelling
def _track(lst, n, label):
    return (f'<div role="radiogroup" aria-label="{label}" style="display: grid; grid-template-columns: repeat({n}, minmax(0, 1fr)); gap: 2px; padding: 3px; border-radius: 14px; background: {FILL}"><sc-for list="{{{{roots.{lst}}}}}" as="r" hint-placeholder-count="{n}"><button type="button" role="radio" aria-checked="{{{{r.on}}}}" aria-label="{{{{r.aria}}}}" onClick="{{{{r.pick}}}}" style="height: 48px; min-width: 0; padding: 0; border: 0; border-radius: 11px; background: {{{{r.bg}}}}; box-shadow: {{{{r.sh}}}}; color: {INK}; font: inherit; font-size: 19px; font-weight: {{{{r.fw}}}}">{{{{r.l}}}}</button></sc-for></div>')
HINT = (f'<sc-if value="{{{{rootHint.on}}}}" hint-placeholder-val="{{{{true}}}}"><div aria-hidden="true" style="position: relative; height: 34px; margin-top: -4px">'
        f'<span style="position: absolute; top: 0; {{{{rootHint.tip}}}}; width: 12px; height: 12px; background: {INK}; transform: translateY(2px) rotate(45deg); border-radius: 2px"></span>'
        f'<span style="position: absolute; top: 6px; {{{{rootHint.box}}}}; height: 26px; padding: 0 12px; border-radius: 13px; background: {INK}; color: #FEFDFB; font-size: 13px; font-weight: 600; line-height: 26px; white-space: nowrap">{{{{rootHint.t}}}}</span></div></sc-if>')
NOTEPICK = '<div style="display: flex; flex-direction: column; gap: 4px">' + _track('a', 7, 'Root') + HINT + '</div>'

# ── New: one dial on a phone's floating +, one menu from a laptop's New ▾ (canvas 169) ──
# The app's SpeedDial and ActionMenu (src/shared/ui/FloatingActions.tsx, ActionMenu.tsx): the + is centred over the
# tab bar, it turns to a close, the page dims, a card of the actions grows from it with the nearest the thumb last.
_LI = lambda d: f'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
NEWICON = {
  'New song': _LI('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
  'Record': _LI('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>'),
  'New folder': _LI('<path d="M12 10v6M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'),
  'Import': _LI('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 12v6M15 15l-3-3-3 3"/>'),
  'New playlist': _LI('<path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>'),
  'New group': _LI('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  'New lesson': _LI('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
  'New course': _LI('<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>'),
}
_NEWPLUS = _LI('<path d="M5 12h14M12 5v14"/>').replace('width="20" height="20"', 'width="26" height="26"')
_NEWX = _LI('<path d="M18 6 6 18M6 6l12 12"/>').replace('width="20" height="20"', 'width="24" height="24"')
def _newitem(label, go):
    # go: an act's name, or an href ending .dc.html ('#' for a page not drawn)
    face = (f'<span style="flex: none; width: 36px; height: 36px; border-radius: 10px; background: {FILL}; display: flex; align-items: center; justify-content: center">{NEWICON.get(label, _NEWPLUS.replace("26", "20"))}</span>{label}')
    st = f'width: 100%; min-height: 48px; box-sizing: border-box; padding: 0 16px 0 8px; border: 0; border-radius: 10px; background: transparent; display: flex; align-items: center; gap: 12px; font: inherit; font-size: 16px; font-weight: 500; color: {INK}; text-align: left; text-decoration: none'
    if go.endswith('.dc.html') or go == '#':
        return f'<li><a role="menuitem" href="{go}" style="{st}">{face}</a></li>'
    return f'<li><button type="button" role="menuitem" onClick="{{{{{go}}}}}" style="{st}">{face}</button></li>'
def NEWDIAL(items, bottom, on='dialOn', off='noDial', toggle='openDial', close='closeSheet', bg=None, ring=''):
    """The phone's floating New, at the bottom right (owner, 2026-11-15; Material 3's FAB: "the lower right corner …
    easy to reach and less likely to cover important content"), 16 in: items as (label, act or href), nearest the thumb last.
    `bg` and `ring` bind its paint where the screen's honey act is elsewhere for a state (Learn's first visit: Start)."""
    card = (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{{close}}}}}" style="position: absolute; inset: 0; z-index: 29; background: rgba(247,243,238,.6)"></div>'
            f'<ul role="menu" aria-label="New" style="position: absolute; right: 16px; bottom: {bottom + 72}px; transform-origin: bottom right; z-index: 31; min-width: 200px; margin: 0; box-sizing: border-box; list-style: none; display: flex; flex-direction: column; gap: 2px; padding: 6px; border-radius: 16px; {GLASSFX}">'
            + ''.join(_newitem(l, g) for l, g in items) + '</ul></sc-if>')
    return card + (f'<button type="button" aria-label="New" data-tip="New" aria-haspopup="menu" aria-expanded="{{{{{on}}}}}" onClick="{{{{{toggle}}}}}" style="position: absolute; right: 16px; bottom: {bottom}px; z-index: 31; width: 56px; height: 56px; border: 0; border-radius: 28px; background: {bg or ACCENT}; color: {INK}; box-shadow: {FLOAT}{ring}; display: flex; align-items: center; justify-content: center">'
                   f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}">{_NEWX}</sc-if><sc-if value="{{{{{off}}}}}" hint-placeholder-val="{{{{true}}}}">{_NEWPLUS}</sc-if></button>')
def NEWFAB(label, act, bottom):
    """A floating New with one thing to make: the same 56 honey + as NEWDIAL, at the bottom right, its name in its tip."""
    return (f'<button type="button" aria-label="{label}" data-tip="{label}" onClick="{{{{{act}}}}}" style="position: absolute; right: 16px; bottom: {bottom}px; z-index: 31; width: 56px; height: 56px; border: 0; border-radius: 28px; background: {ACCENT}; color: {INK}; box-shadow: {FLOAT}; display: flex; align-items: center; justify-content: center">{_NEWPLUS}</button>')
def NEWMENU(items):
    """The same New as a menu, the floating +'s list (NEWDIAL)."""
    return f'<ul role="menu" aria-label="New" style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px">' + ''.join(_newitem(l, g) for l, g in items) + '</ul>'
# A board's states for the canvas's States box: a hidden list states_tool.py lifts out of the screen (each row's
# {l, bg, pick}; bg ink marks the one shown). The board draws each state itself.
def SHOWSTATES(lst='states'):
    return f'<div aria-label="Canvas: show a state" style="display: none"><sc-for list="{{{{{lst}}}}}" as="p" hint-placeholder-count="3"><button type="button" onClick="{{{{p.pick}}}}" style="background: {{{{p.bg}}}}">{{{{p.l}}}}</button></sc-for></div>'

# An empty or said state's mark: a Lucide icon for each glyph the boards used to write as text (one icon set, app-wide)
_EI = lambda d: f'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
EMPTYICON = {
    '⌁': _EI('<path d="M12 20h.01"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><path d="m2 2 20 20"/>'),
    '!': _EI('<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>'),
    '♪': _EI('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
    '?': _EI('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'),
    '◎': _EI('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    '⌫': _EI('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>'),
    '✎': _EI('<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'),
    '…': _EI('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'),
    '⌕': _EI('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>'),
}
EMPTY_T = lambda t: t[:-1] if t.endswith('.') and not t.endswith('..') else t   # a said state's title takes no full stop
# One empty state, every board: the honey tile with its picture, the title (18 bold), one line why (15 soft), and the
# way out 16 below (owner-way: every empty state has one clear next action). EMPTYICON names the pictures.
def EMPTY(cond, icon, t, b, btns=''):
    acts = f'<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 8px">{btns}</div>' if btns else ''
    return (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 56px 20px; text-align: center">'
            f'<span style="width: 72px; height: 72px; border-radius: 18px; background: {HONEY}; color: {INK}; display: flex; align-items: center; justify-content: center">{EMPTYICON.get(icon, icon)}</span>'
            f'<span style="font-size: 18px; font-weight: 700; text-wrap: balance">{EMPTY_T(t)}</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}; max-width: 340px; text-wrap: pretty">{b}</span>{acts}</div></sc-if>')

# Previewing as learner: one floating pill, never a band under the bar (ui-and-mockups: nothing hangs under a bar)
# One toast, every board (owner-way, Undo instead of asking): ink capsule 52 tall, the text, then Undo at its end.
# A phone toast spans the 16 gutters; a laptop's is 460 wide, centred. `undo` names the handler; `always` shows Undo
# with no toastUndo condition; `hint` is the placeholder the condition shows while drawing.
def TOAST(bottom, undo='undo', z=50, laptop=False, always=False, hint='false'):
    pos = (f'left: 50%; transform: translateX(-50%); width: 460px; bottom: {bottom}px' if laptop
           else f'left: 16px; right: 16px; bottom: {bottom}px')
    btn = (f'<button type="button" onClick="{{{{{undo}}}}}" style="height: 44px; padding: 0 12px; border: 0; '
           f'background: transparent; color: {ACCENT}; font: inherit; font-size: 15px; font-weight: 700">Undo</button>')
    if not always:
        btn = f'<sc-if value="{{{{toastUndo}}}}" hint-placeholder-val="{{{{{hint}}}}}">{btn}</sc-if>'
    return (f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; '
            f'{pos}; z-index: {z}; min-height: 52px; box-sizing: border-box; border-radius: 14px; background: {INK}; '
            f'color: {SHEET}; display: flex; align-items: center; gap: 8px; padding: 4px 4px 4px 16px; font-size: 15px">'
            f'<span style="flex: 1">{{{{toastT}}}}</span>{btn}</div></sc-if>')

# One centred form or note over a scrim (a laptop's New song, Report, the welcome): a 22-round card, 20 in, 12 between
# its parts, at most 48 narrower than the screen. ASK is its question form.
DIALOGBOX = lambda inner, w=372, close='closeSheet', label='': (f'<div onClick="{{{{{close}}}}}" style="position: absolute; inset: 0; z-index: 70; background: rgba(51,41,33,.32)"></div><div role="dialog" aria-modal="true"' + (f' aria-label="{label}"' if label else '') + f' style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 71; width: {w}px; max-width: calc(100% - 48px); box-sizing: border-box; border-radius: 22px; background: {PAGE}; padding: 20px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">{inner}</div>')
# One question before a loss that cannot be undone, or an act that reaches other people (CLAUDE.md, ConfirmDialog):
# a scrim, a 372 card centred, the question (18 bold), what is lost (15 soft), an optional field, then Keep and the act
# side by side. The act is crimson for a loss, ink when it only reaches others (Publish); `ok_bg`/`ok_ink` bind it to state.
def ASK(cond, t, b, ok, go, danger=True, cancel='closeSheet', keep='Cancel', field='', ok_bg=None, ok_ink='#FFFFFF', ok_attrs=''):
    bg = ok_bg or ('#B3261E' if danger else INK)
    return (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{{cancel}}}}}" style="position: absolute; inset: 0; z-index: 70; background: rgba(51,41,33,.32)"></div><div role="alertdialog" aria-label="{t}" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 71; width: 372px; max-width: calc(100% - 48px); box-sizing: border-box; border-radius: 22px; background: {PAGE}; padding: 20px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 8px">'
            f'<span style="font-size: 18px; font-weight: 700; text-wrap: balance">{t}</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}">{b}</span>{field}<div style="display: flex; gap: 8px; margin-top: 8px"><button type="button" onClick="{{{{{cancel}}}}}" style="flex: 1; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">{keep}</button>'
            f'<button type="button" onClick="{{{{{go}}}}}"{ok_attrs} style="flex: 1; height: 44px; border: 0; border-radius: 22px; background: {bg}; color: {ok_ink}; font: inherit; font-size: 16px; font-weight: 700; white-space: nowrap">{ok}</button></div></div></sc-if>')
PREVPILL = lambda pos, on='prevOn', ex='exitPrev': (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; {pos}; z-index: 55; height: 52px; box-sizing: border-box; padding: 0 4px 0 18px; border-radius: 26px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 12px; white-space: nowrap; font-size: 15px; font-weight: 600; box-shadow: {SHADOW}">'
                        f'Previewing as learner<button type="button" onClick="{{{{{ex}}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 15px; font-weight: 700">Exit</button></div></sc-if>')

# A phone on its side (852×393): a page's pinned keys scroll with the page, so the page keeps its room (round 66).
KBPAGE_CSS = '''<style data-kbpage>[data-menuroot] { container-type: size } @container (max-height: 520px) { .kbpage { overflow-y: auto } .kbpage > main { flex: none !important; overflow: visible !important } }</style>'''
KBPAGE_OPEN = '<div class="kbpage" style="flex: 1; min-height: 0; display: flex; flex-direction: column">'

# the link glyph: one icon for a link, on every board (Groups' Join with a link, a lesson's Share link)
LINKI = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"></path></svg>'

# One printed page for every score the app shows (R74: the editor's Page view and the Player's sheet, owner 2026-11-26:
# "this accompaniment sheet doesnt look like a professioanal score"); an arrangement is credited under the music's, as
# an engraver prints "Arr." at the right
# the page: A4 at 96 dpi (794 × 1123), 17.2 mm margins (65), a 7 mm staff (26.5 px: the kit's 32 units × 0.828)
PG_W, PG_H, PG_M, PG_K = 794, 1123, 65, 26.5 / 32
def A4PAGE(credit='', sel=(3, 0), piano=True, pick=None):
    cw = PG_W - 2 * PG_M
    return (f'<article aria-label="Page 1" style="flex: none; position: relative; width: {PG_W}px; height: {PG_H}px; box-sizing: border-box; padding: {PG_M}px {PG_M}px 0; background: {SHEET}; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 2px 4px rgba(51,41,33,.06), 0 12px 32px -16px rgba(51,41,33,.28); display: flex; flex-direction: column">'
            f'<h2 style="margin: 0; text-align: center; font-family: {SERIF}; font-size: 30px; font-weight: 400; line-height: 1.1; color: {INK}">Amazing Grace</h2>'
            f'<div style="margin: 16px 0 0; display: flex; justify-content: space-between; gap: 24px; font-family: {SERIF}; font-size: 13px; color: {INK}"><span>Words: John Newton</span><span style="text-align: right">Music: New Britain (American folk tune)' + (f'<br><i style="color: {SOFT}">{credit}</i>' if credit else '') + f'</span></div>'
            f'<div style="margin: 16px 0 0; font-family: {SERIF}; font-size: 13px; font-weight: 700; color: {INK}">Verse <span style="font-weight: 400"><svg role="img" aria-label="quarter note" viewBox="0 0 8 16" width="7" height="14" style="vertical-align: -2px"><ellipse cx="3.4" cy="13" rx="3.3" ry="2.3" transform="rotate(-20 3.4 13)" fill="{INK}"/><rect x="5.8" y="0" width="1" height="12.6" fill="{INK}"/></svg> = 80</span></div>'
            f'<div style="position: relative; margin: -8px 0 0">' + score_grand(cw / PG_K, [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], sel=sel, size=1.0, piano=piano).replace(ACCENT, '#85B8DC') + (PICKLAYER(GEO['last'], pick) if pick else '') + '</div>'
            f'<p style="position: absolute; left: 0; right: 0; bottom: 32px; margin: 0; text-align: center; font-family: {SERIF}; font-size: 11px; color: {SOFT}">Public domain</p></article>')


# the header band's colours (below, BANDHDR): the brand's dark, paper on it
BAND = '#332921'
ONB = '#FEFDFB'
ONB_SOFT = 'rgba(254,253,251,.72)'
ONB_RING = 'inset 0 0 0 1.5px rgba(254,253,251,.55)'
# The page you can pick from (owner, 2026-11-26: "in the player you should give possibility also to change each separate
# section of the song and for each chord … the sheet is interactive. like the user selects a section or a chord and he
# can change this only to these sections"): over the engraved page, each chord symbol is a button and each bar a target
# for its phrase (a hymn verse's four lines of four bars, as the singer breathes); what is picked turns sky (the score's
# selection colour), and the Song panel's Accompaniment then changes that chord or phrase alone (Band-in-a-Box's style
# per bar range; Flat's selection then the panel). A chord or phrase with its own accompaniment carries a honey dot.
# mode 'pick' (the Player), 'hist' (History: the bars a saved version changed, in honey, nothing to press)
PHRASE = lambda b: max(1, (b - 1) // 4 + 1)
def PICKLAYER(geo, mode='pick'):
    W, H = geo['w'], geo['h']; pc = lambda v, d: f'{v / d * 100:.3f}%'; out = []
    for b, x0, x1, y0, y1 in geo['bars']:
        box = f'left: {pc(x0, W)}; top: {pc(y0, H)}; width: {pc(x1 - x0, W)}; height: {pc(y1 - y0, H)}'
        if mode == 'hist':
            out.append(f'<span aria-hidden="true" style="position: absolute; {box}; border-radius: 4px; background: {{{{hb{b}}}}}; pointer-events: none"></span>')
            continue
        p = PHRASE(b)
        out.append(f'<button type="button" data-pk aria-label="Phrase {p}, bar {b}" onClick="{{{{pickP{p}}}}}" style="position: absolute; {box}; padding: 0; border: 0; border-radius: 4px; background: {{{{bandP{p}}}}}; box-shadow: {{{{bandC{b}}}}}; cursor: pointer"></button>')
    if mode == 'pick':
        for b, ch, x, y in geo['chords']:
            w = 18 + 9 * len(ch)
            box = f'left: calc({pc(x, W)} - 6px); top: calc({pc(y, H)} - 24px); width: {w}px; height: 32px'
            out.append(f'<button type="button" data-pk aria-label="Chord {ch}, bar {b}" aria-pressed="{{{{chOn{b}}}}}" data-tip="{ch} · bar {b}" onClick="{{{{pickC{b}}}}}" style="position: absolute; {box}; padding: 0; border: 0; border-radius: 8px; background: {{{{chBg{b}}}}}; cursor: pointer">'
                       f'<sc-if value="{{{{own{b}}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="position: absolute; left: 50%; bottom: -4px; width: 6px; height: 6px; margin-left: -3px; border-radius: 3px; background: #C98A1E"></span></sc-if></button>')
        for p in sorted({PHRASE(b) for b, *_ in geo['bars']}):
            b0 = next(g for g in geo['bars'] if PHRASE(g[0]) == p and g[0] > 0)
            out.append(f'<sc-if value="{{{{ownP{p}}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" data-tip="Phrase {p} has its own accompaniment" style="position: absolute; left: calc({pc(b0[1], W)} + 4px); top: calc({pc(b0[3], H)} + 2px); width: 6px; height: 6px; border-radius: 3px; background: #C98A1E"></span></sc-if>')
    return f'<div class="pick" style="position: absolute; inset: 0">{"".join(out)}</div>'
PICKCSS = '<style data-pick>.pick [data-pk]:hover { outline: 2px solid rgba(133,184,220,.55); outline-offset: -2px } .pick [data-pk]:focus-visible { outline: 3px solid #356890; outline-offset: 1px }</style>'
CHORDS_AT = {b: ch for b, (ch, _m, _p) in enumerate(GBARS) if ch}
# the scope's script, the Player's (S and SET its state): the selection (selK: 'p2', 'c6'), the level the card edits
# (scLv: chord, phrase or song), each scope's own settings (ovr) and their history (hist); acc(f, d) is what the card
# shows, setAcc(f, v, label) what a change writes
def PICKJS(S, SET, TOAST):
    CH = repr({str(k): v for k, v in CHORDS_AT.items()})
    return (f"const CHN = {CH}; const PH = (b) => 'p' + Math.max(1, Math.floor((b - 1) / 4) + 1); const SELK = {S}.selK ?? null; const OV = {S}.ovr ?? {{}};"
            " const CB = SELK && SELK[0] === 'c' ? +SELK.slice(1) : null; const PK = CB !== null ? PH(CB) : (SELK && SELK[0] === 'p' ? SELK : null);"
            f" const LV = {S}.scLv && (({S}.scLv === 'chord' && CB !== null) || ({S}.scLv === 'phrase' && PK) || {S}.scLv === 'song') ? {S}.scLv : (CB !== null ? 'chord' : PK ? 'phrase' : 'song');"
            " const SCK = LV === 'chord' ? 'c' + CB : LV === 'phrase' ? PK : 'song';"
            " const SCN = SCK === 'song' ? 'Whole song' : SCK[0] === 'p' ? 'Phrase ' + SCK.slice(1) : 'Bar ' + CB + ' · ' + CHN[CB];"
            " const CHAIN = (k) => k[0] === 'c' ? [k, PH(+k.slice(1)), 'song'] : k[0] === 'p' ? [k, 'song'] : ['song'];"
            " const acc = (f, d) => { for (const c of CHAIN(SCK)) if (OV[c] && OV[c][f] !== undefined) return OV[c][f]; return d; };"
            f" const HIST0 = [{{ id: 'h4', t: 'Today at 13:42', what: ['+4 notes'], bars: [5, 6], ov: {{}} }}, {{ id: 'h3', t: '7 Nov 2026, 15:11', what: ['Voicing: Block'], bars: [], ov: {{ song: {{ voice: 'Block' }} }} }}, {{ id: 'h2', t: '4 Nov 2026, 17:16', what: ['+49 notes', '−37 notes'], bars: [1, 2, 3, 4, 9, 10, 11, 12], ov: {{}} }}, {{ id: 'h1', t: '3 Nov 2026, 17:45', what: ['Created'], bars: [], ov: {{}} }}];"
            f" const HIST = {S}.hist ?? HIST0;"
            f" const setAcc = (f, v, label, more) => {{ const nv = {{ ...OV, [SCK]: {{ ...(OV[SCK] || {{}}), [f]: v }} }}; const bars = SCK === 'song' ? [] : SCK[0] === 'c' ? [CB] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((b) => PH(b) === SCK); {SET}({{ ...(more || {{}}), ovr: nv, undoOv: OV, undoHist: HIST, hist: [{{ id: 'h' + Date.now(), t: 'Just now', what: [SCN + ': ' + label], bars, ov: nv }}, ...HIST], " + TOAST("SCN + ': ' + label") + " }); };")
def PICKKEYS(S, SET):
    bars = range(0, 13); ph = sorted({PHRASE(b) for b in bars})
    k = []
    for p in ph:
        k.append(f"pickP{p}: () => {SET}({{ selK: SELK === 'p{p}' ? null : 'p{p}', scLv: null, open: 'none', rail: 'song' }}), bandP{p}: (PK === 'p{p}' && LV !== 'song') ? 'rgba(133,184,220,.16)' : 'transparent', ownP{p}: !!OV['p{p}'],")
    for b in bars:
        k.append(f"bandC{b}: CB === {b} && LV === 'chord' ? 'inset 0 0 0 2px rgba(133,184,220,.55)' : 'none',")
    for b in CHORDS_AT:
        k.append(f"pickC{b}: (e) => {{ e && e.stopPropagation && e.stopPropagation(); {SET}({{ selK: SELK === 'c{b}' ? null : 'c{b}', scLv: null, open: 'none', rail: 'song' }}); }}, chOn{b}: SELK === 'c{b}' ? 'true' : 'false', chBg{b}: SELK === 'c{b}' ? 'rgba(133,184,220,.45)' : 'transparent', own{b}: !!OV['c{b}'],")
    k.append("accScopes: [['chord', CB !== null ? 'Bar ' + CB + ' · ' + CHN[CB] : null], ['phrase', PK ? 'Phrase ' + PK.slice(1) : null], ['song', 'Whole song']].filter((x) => x[1]).map(([id, l]) => ({ l, on: LV === id ? 'true' : 'false', bg: LV === id ? '#FEFDFB' : 'transparent', sh: LV === id ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: LV === id ? 600 : 500, pick: () => " + SET + "({ scLv: id }) })),")
    k.append("accPicked: SELK !== null, accWhole: SELK === null, accOwn: SCK !== 'song' && !!OV[SCK], accResetL: SCK[0] === 'c' ? 'Use the phrase’s accompaniment' : 'Use the song’s accompaniment',")
    k.append(f"accReset: () => {{ const nv = {{ ...OV }}; delete nv[SCK]; {SET}({{ ovr: nv, undoOv: OV, undoHist: HIST, hist: [{{ id: 'h' + Date.now(), t: 'Just now', what: [SCN + ': as before'], bars: [], ov: nv }}, ...HIST], sTo: SCN + ' follows ' + (SCK[0] === 'c' ? 'its phrase' : 'the song') + ' again', sUndo: true }}); }}, clearPick: () => {SET}({{ selK: null, scLv: null }}),")
    return ' '.join(k)

# History (owner, 2026-11-26: "make a proper version history also like the flat does and not only the undo and redo
# actions"; Flat's "Last save about 2 hours ago" in its top bar, "Document History", opening the History view: the
# band says "Close History View" and the saved moment, the page as it was, a Versions list at the right, each with its
# time, who and what changed, +4 notes). Ours is named History (a song's Versions are its arrangements, R74): the band's
# clock opens it in both modes; a row shows that moment's page with the bars it changed in honey; Restore this version
# brings it back with Undo in its toast (a loss that can be undone happens at once, CLAUDE.md), Close history leaves.
CLOCKI = _LI('<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>')
HISTBTN = (f'<button type="button" aria-label="History: saved {{{{histAgo}}}}" data-tip="History" onClick="{{{{openHist}}}}" style="flex: none; height: 40px; box-sizing: border-box; padding: 0 14px 0 10px; border: 0; border-radius: 20px; background: transparent; box-shadow: {ONB_RING}; color: {ONB}; font: inherit; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; white-space: nowrap; cursor: pointer">'
           f'{CLOCKI.replace("width=\"20\" height=\"20\"", "width=\"18\" height=\"18\"")}<span>Saved {{{{histAgo}}}}</span></button>')
def HISTVIEW():
    row = (f'<button type="button" role="option" aria-selected="{{{{h.on}}}}" onClick="{{{{h.pick}}}}" style="width: 100%; box-sizing: border-box; padding: 12px 16px; border: 0; border-bottom: 1px solid {LINE}; background: {{{{h.bg}}}}; color: {INK}; font: inherit; text-align: left; display: flex; flex-direction: column; gap: 6px; cursor: pointer">'
           f'<span style="display: flex; align-items: baseline; gap: 8px"><span style="flex: 1; font-size: 15px; font-weight: 600">{{{{h.t}}}}</span><sc-if value="{{{{h.cur}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; color: {SOFT}">Current</span></sc-if></span>'
           f'<span style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: {SOFT}"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 4px; background: #356890"></span>You</span>'
           f'<span style="display: flex; flex-wrap: wrap; gap: 4px"><sc-for list="{{{{h.what}}}}" as="w" hint-placeholder-count="1"><span style="height: 24px; padding: 0 8px; border-radius: 12px; background: {FILL}; font-size: 13px; display: flex; align-items: center; font-variant-numeric: tabular-nums">{{{{w}}}}</span></sc-for></span></button>')
    band = (f'<header data-band style="flex: none; height: 64px; box-sizing: border-box; padding: 0 16px 0 12px; display: flex; align-items: center; gap: 12px; background: {BAND}; color: {ONB}">'
            f'<button type="button" onClick="{{{{closeHist}}}}" data-tip="Close history · Esc" style="flex: none; height: 40px; padding: 0 16px 0 12px; border: 0; border-radius: 20px; background: {ONB}; color: {BAND}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>Close history</button>'
            f'<h1 style="margin: 0 0 0 4px; font-size: 17px; font-weight: 600; white-space: nowrap">{{{{histT}}}}</h1>'
            f'<span style="flex: 1"></span>'
            f'<sc-if value="{{{{histOld}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{histRestore}}}}" style="flex: none; height: 40px; padding: 0 16px; border: 0; border-radius: 20px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer">Restore this version</button></sc-if></header>')
    page = (f'<main class="nos" style="flex: 1; min-width: 0; overflow-y: auto; background: {FILL}; display: flex; justify-content: center; padding: 24px 0 48px">'
            f'<div style="zoom: 1.2">{A4PAGE("", None, pick="hist")}</div></main>')
    side = (f'<aside aria-label="History" style="flex: none; width: 352px; display: flex; flex-direction: column; background: {SHEET}; box-shadow: inset 1px 0 0 {LINE}">'
            f'<h2 style="flex: none; margin: 0; height: 64px; box-sizing: border-box; padding: 0 16px; display: flex; align-items: center; font-size: 17px; font-weight: 600; box-shadow: inset 0 -1px 0 {LINE}">History</h2>'
            f'<div role="listbox" aria-label="Saved moments" class="nos" style="flex: 1; min-height: 0; overflow-y: auto"><sc-for list="{{{{histRows}}}}" as="h" hint-placeholder-count="4">{row}</sc-for></div></aside>')
    return (f'<sc-if value="{{{{histOn}}}}" hint-placeholder-val="{{{{false}}}}"><section role="dialog" aria-modal="true" aria-label="History" style="position: absolute; inset: 0; z-index: 66; display: flex; flex-direction: column; background: {PAGE}">'
            f'{band}<div style="flex: 1; min-height: 0; display: flex">{page}{side}</div></section></sc-if>')
def HISTKEYS(S, SET, TOAST, HIST='HIST', restore='{}'):
    """HIST: the board's list of saved moments, newest first ({id, t, what, bars, ov}); restore(h): what Restore sets."""
    hb = ' '.join(f"hb{b}: HSEL.bars.includes({b}) ? 'rgba(237,198,132,.38)' : 'transparent'," for b in range(13))
    return ("...(() => { const H = " + HIST + "; const HSEL = H.find((h) => h.id === " + S + ".histSel) ?? H[0]; return { histOn: !!" + S + ".hist_on, openHist: () => " + SET + "({ hist_on: true, histSel: H[0].id, hdPop: null }), closeHist: () => " + SET + "({ hist_on: false }), "
            "histAgo: H[0].t === 'Just now' ? 'just now' : 'today at 13:42', histT: HSEL.t, histOld: HSEL.id !== H[0].id, "
            "histRows: H.map((h, i) => ({ t: h.t, what: h.what, cur: i === 0, on: h.id === HSEL.id ? 'true' : 'false', bg: h.id === HSEL.id ? '#F6E7C8' : 'transparent', pick: () => " + SET + "({ histSel: h.id }) })), "
            + hb + " histRestore: () => " + SET + "({ ...(" + restore + ")(HSEL), hist_on: false, undoHist: H, hist: [{ id: 'h' + Date.now(), t: 'Just now', what: ['Restored ' + HSEL.t], bars: HSEL.bars, ov: HSEL.ov }, ...H], " + TOAST("'Restored the version of ' + HSEL.t") + " }) }; })(),")
# A page over a full-screen screen (the editor's Credits; owner, 2026-11-26: "it should open properly on a proper page
# this credits like in the flat"; "why the credits are still a popup and not a proper page"): the whole screen, its
# own bar (Back, the title), the form in one centred column; never a popover, a sheet or a window (Flat's Credits, 087)
def THINGPAGE(on, close, title, body, lap):
    pad = '24px' if lap else '16px'
    return (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}"><section role="dialog" aria-modal="true" aria-label="{title}" style="position: absolute; inset: {0 if lap else 62}px 0 0; z-index: 61; background: {PAGE}; color: {INK}; display: flex; flex-direction: column">'
            f'<header style="flex: none; height: {72 if lap else 60}px; box-sizing: border-box; padding: 8px {pad}; display: grid; grid-template-columns: minmax(44px, 1fr) auto minmax(44px, 1fr); align-items: center">'
            f'<button type="button" onClick="{{{{{close}}}}}" aria-label="Back" data-tip="Back · Esc" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; cursor: pointer">{CHEV_L}</button>'
            f'<h1 style="margin: 0; font-size: 17px; font-weight: 600">{title}</h1><span></span></header>'
            f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px {pad} 48px"><div style="width: min(560px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 16px">{body}</div></main></section></sc-if>')

# R74, one song menu in Play and in Edit (owner, 2026-11-26: "i dont like how this clicking on the title has diferent
# options when switching the edit or non edit mode. i want the same options"; "i dont like this switch between the
# songs version how it looks"): the bar's title is the song's name with the open version under it, one button, as a
# document app's name and its state (Google Docs, Notion's page title; Flat's title menu, the owner's screenshots). Its
# menu, the same rows wherever the song is open: the versions first (pick one; the default says so; New version), the
# open version's acts, then the song's (Recordings, Share link, Export ›, Print), then Duplicate and Archive last.
# Credits are not here: the editor edits them where they print (a tap on the printed title), the Player reads them.
_SMROW = 'min-height: 40px; box-sizing: border-box; padding: 0 16px 0 12px; display: flex; align-items: center; gap: 8px; width: 100%; border: 0; background: transparent; color: #332921; font: inherit; font-size: 15px; text-align: left; text-decoration: none; cursor: pointer'
_SMBOX = 'position: absolute; z-index: 70; width: 288px; border-radius: 14px; background: #FEFDFB; box-shadow: 0 0 0 1px rgba(26,22,18,0.08), 0 2px 4px rgba(26,22,18,0.10), 0 18px 40px -12px rgba(26,22,18,0.35); padding: 6px 0'
_SMSEP = '<div role="separator" style="height: 1px; margin: 6px 0; background: #EFE9E1"></div>'
_SMSLOT = lambda inner='': f'<span aria-hidden="true" style="flex: none; width: 20px; display: flex; justify-content: center; color: #332921">{inner}</span>'
PLUSI_S = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="M12 5v14M5 12h14"></path></svg>'
# Flat's header band (owner, 2026-11-26, Flat 26.11 screenshots: "the header and the sidebars should follow the new
# styles"): one solid band across the window in the brand's dark, the title and the transport in paper on it; Go to
# start and Play filled circles (Play the honey one), the metronome and the loop outlined circles that fill when on,
# the mixer a bare icon, MIDI and the mode outlined pills; the toolbar a light row under it
def SONGMENU(takes_href, extra=(), phone=False):
    it = lambda lab, act, fg='#332921', tail='': f'<button type="button" role="menuitem" onClick="{{{{{act}}}}}" style="{_SMROW}; color: {fg}">{_SMSLOT()}<span style="flex: 1">{lab}</span>{tail}</button>'
    vrow = (f'<sc-for list="{{{{verRows}}}}" as="v" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="{_SMROW}">'
            + _SMSLOT(f'<sc-if value="{{{{v.cur}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if>')
            + f'<span style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: {{{{v.fw}}}}">{{{{v.name}}}}</span>'
            + f'<sc-if value="{{{{v.isDef}}}}" hint-placeholder-val="{{{{false}}}}"><span style="flex: none; font-size: 13px; color: {SOFT}">Default</span></sc-if></button></sc-for>')
    exp = (f'<sc-if value="{{{{expOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="menu" aria-label="Export" style="{_SMBOX}; ' + ('left: 24px; top: calc({{expTop}}px + 92px)' if phone else 'left: calc(100% + 4px); top: {{expTop}}px') + '; width: 252px">'
           + ''.join(f'<button type="button" role="menuitem" onClick="{{{{{a}}}}}" style="{_SMROW}; padding-left: 16px">{l}</button>' for l, a in (('MusicXML', 'expXml'), ('Compressed MusicXML (.mxl)', 'expMxl'), ('MIDI', 'expMidi'))) + '</div></sc-if>')
    rows = (''
            + f'<a role="menuitem" href="{takes_href}" style="{_SMROW}">{_SMSLOT()}<span style="flex: 1">Recordings</span><span style="color: {SOFT}; font-variant-numeric: tabular-nums">3</span></a>'
            + it('Share link', 'actShare') + it('Export', 'toggleExp', '#332921; background: {{expBg}}', f'<span aria-hidden="true" style="display: flex; color: {SOFT}">{CHEV_R}</span>') + it('Print', 'actPrint')
            + ''.join(_SMSEP + ''.join(it(*r) for r in grp) for grp in extra))
    return (f'<div style="position: relative; flex: none; min-width: 0; pointer-events: auto">'
            f'<button type="button" aria-haspopup="menu" aria-expanded="{{{{smOn}}}}" onClick="{{{{toggleSm}}}}" data-tip="The song’s menu" style="height: 48px; max-width: {"100%" if phone else "320px"}; padding: 0 10px 0 12px; border: 0; border-radius: 12px; background: {{{{smBg}}}}; color: {ONB}; font: inherit; text-align: left; display: flex; align-items: center; gap: 8px; cursor: pointer">'
            f'<span style="min-width: 0; display: flex; flex-direction: column"><h1 style="margin: 0; font-size: 17px; font-weight: 600; line-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">Amazing Grace</h1>'
            f'<span style="font-size: 13px; line-height: 16px; color: {ONB_SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{verName}}}}</span></span>'
            f'<span aria-hidden="true" style="flex: none; display: flex; color: {ONB_SOFT}">{CHEV_D}</span></button>'
            f'<sc-if value="{{{{smOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="menu" aria-label="Amazing Grace" style="{_SMBOX}; left: 0; top: 52px">{rows}{exp}</div></sc-if></div>')

# its state, the same script in both: a spread of the keys it needs; S is the state's name, SET how it is set, TOAST
# what a toast adds to that set (the Player's sTo and sUndo, the editor's toast), DEF the version that opens first
def SONGMENU_KEYS(S, SET, TOAST, DEF='mine', close_others=''):
    t = lambda m, u=False: TOAST(m, u)
    mA = t("'New version with accompaniment'")
    m0 = t("'New version from ' + VC.name")
    m1 = t("TG.name + ' opens first now'")
    m2 = t("TG.name + ' deleted'", True)
    m3 = t("'Renamed to ' + n")
    m4 = t("'Link copied'")
    m7 = t("'Exported as MusicXML'")
    m8 = t("'Exported as compressed MusicXML'")
    m9 = t("'Exported as MIDI'")
    return (f"...(() => {{ const VS = {S}.vers ?? [{{ id: 'orig', name: 'Original', piano: false }}, {{ id: 'mine', name: 'My version', piano: true }}]; "
            f"const VD = {S}.verDef ?? '{DEF}'; const VCID = VS.some((v) => v.id === {S}.verCur) ? {S}.verCur : VD; const VC = VS.find((v) => v.id === VCID) ?? VS[0]; const TG = VS.find((v) => v.id === ({S}.verMenu ?? {S}.renId)) ?? VC; const shut = {{ sm: false, exp: false, verMenu: null{close_others} }}; "
            f"return {{ smOn: !!{S}.sm, smBg: {S}.sm ? 'rgba(254,253,251,.16)' : 'transparent', toggleSm: () => {SET}({{ sm: !{S}.sm, exp: false }}), "
            f"verName: VC.name, isPiano: !!VC.piano, isLead: !VC.piano, expOn: !!{S}.exp, expBg: {S}.exp ? '#F3EEE8' : 'transparent', expTop: 86, toggleExp: () => {SET}({{ exp: !{S}.exp }}), "
            f"verRows: VS.map((v, i) => ({{ name: v.name, sub: v.piano ? 'With accompaniment' : 'Melody, chords and words', line: i ? '{LINE}' : 'transparent', isDef: v.id === VD, cur: v.id === VCID, fw: v.id === VCID ? 600 : 400, on: v.id === VCID ? 'true' : 'false', pick: () => {SET}({{ ...shut, verCur: v.id, pat: v.piano ? 'p1' : 'none' }}), menuOn: {S}.verMenu === v.id, menuX: {S}.verMenu === v.id ? 'true' : 'false', menu: () => {SET}({{ verMenu: {S}.verMenu === v.id ? null : v.id }}), canDef: v.id !== VD, canDel: VS.length > 1 }})), "
            f"canSetDef: VCID !== VD, canDelVer: VS.length > 1, "
            f"actNewVer: () => {{ const id = 'v' + Date.now(); {SET}({{ ...shut, vers: [...VS, {{ ...VC, id, name: VC.name + ' 2' }}], verCur: id, {m0} }}); }}, "
            f"actNewAcc: () => {{ const id = 'a' + Date.now(); {SET}({{ ...shut, vers: [...VS, {{ id, name: VC.name + ' with accompaniment', piano: true }}], verCur: id, pat: 'p1', {mA} }}); }}, "
            f"actRename: () => {SET}({{ ...shut, ren: true, renId: TG.id }}), "
            f"actSetDef: () => {{ if (TG.id !== VD) {SET}({{ ...shut, verDef: TG.id, {m1} }}); }}, "
            f"actDelVer: () => {{ if (VS.length < 2) return; const rest = VS.filter((v) => v.id !== TG.id); const nd = VD === TG.id ? rest[0].id : VD; {SET}({{ ...shut, undoVer: {{ vers: VS, verCur: VCID, verDef: VD }}, vers: rest, verDef: nd, verCur: TG.id === VCID ? nd : VCID, {m2} }}); }}, "
            f"renOn: !!{S}.ren, renVal: TG.name, renRef: (el) => {{ window.__rn = el; }}, renCancel: () => {SET}({{ ren: false, renId: null }}), "
            f"renSave: () => {{ const n = ((window.__rn && window.__rn.value) || '').trim(); if (!n) return; {SET}({{ vers: VS.map((v) => (v.id === TG.id ? {{ ...v, name: n }} : v)), ren: false, renId: null, {m3} }}); }}, "
            f"actShare: () => {SET}({{ ...shut, {m4} }}), actPrint: () => {SET}({{ ...shut }}), "
            f"expXml: () => {SET}({{ ...shut, {m7} }}), expMxl: () => {SET}({{ ...shut, {m8} }}), expMidi: () => {SET}({{ ...shut, {m9} }}) }}; }})(),")

# The phone's header as Flat's phone editor draws it (owner, 2026-11-26: "the header and the toolbar doesnt look like
# flat, and the play edit switch not it the header but in the setting or in the menu"): a light bar, never a dark band
# (Flat's mobile editor, help.flat.io's mobile screenshots: paste, addvoice): ← at the start; the transport in one
# outlined pill of bare glyphs (Go to start, Play, Loop and, ours, the metronome; Flat's "loop button in the header");
# the piano-keys glyph that shows the keys notes are typed on (Flat's phone: "the only way to add notes is … the keys of
# the piano"); ☰ at the end, its menu holding the rest, Practice | Edit at its top. A hairline under it; in Edit
# Flat's second row follows (the board's acts row). keys: the board's own keys button. over: laid over the screen
# from its top, the status bar's 62 inside it (the Player's absolute layers)
MENUI = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="M4 7h16M4 12h16M4 17h16"></path></svg>'
ARROWLI = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>'
_PB = 'flex: none; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 22px; background: transparent; color: ' + INK + '; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer'
def PHTRANSPORT():
    b = lambda lab, tip, inner, act, extra='', look='': f'<button type="button" aria-label="{lab}" data-tip="{tip}" onClick="{{{{{act}}}}}"{extra} style="{_PB}{look}">{inner}</button>'
    start = b('Go to start', 'Go to start', '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="2.5" height="14" rx="1"></rect><path d="M19 6.3v11.4a1 1 0 0 1-1.5.86L9.4 13.3a1.5 1.5 0 0 1 0-2.6l8.1-5.26A1 1 0 0 1 19 6.3z"></path></svg>', 'hdStart')
    play = b('{{hdPlayTip}}', '{{hdPlayTip}}', '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="{{hdPlayD}}"></path></svg>', 'hdPlay')
    loop = b('Loop', '{{hdLoopTip}}', '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>', 'hdLoop', '', '; color: {{hdLoopPh}}')
    # Flat's fourth glyph is the speaker: Playback options (its sheet: Audio playback, Metronome, Playback speed); the
    # metronome is a row there, as Flat's
    spk = b('Playback options', 'Playback options', '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path></svg>', 'hdOpts', ' aria-haspopup="dialog" aria-expanded="{{hdOptsX}}"', '; color: {{hdOptsPh}}')
    return (f'<div role="toolbar" aria-label="Transport" style="flex: none; height: 46px; box-sizing: border-box; padding: 0 1px; border-radius: 23px; box-shadow: inset 0 0 0 1px {LINE}; display: flex; align-items: center">'
            f'{start}{play}{loop}{spk}</div>')
# Parts, beside ← as Flat's instrument glyph there (owner, 2026-11-26: "what about the button to show or not the parts
# beside the back button"): a sheet of the song's parts, each with its switch; a hidden part leaves the page (Piano off:
# the page prints the melody alone); the last part shown stays (a page of nothing reads nothing)
# The song's parts on the View page, as Flat's instruments sheet (flat-score-editor 004, 022, 084): "All" with its switch first; each part a filled card with its glyph, its name, S (solo:
# only this part sounds, the Audio panel's one state) and the eye (shown or hidden on the page: Piano hidden prints the
# melody alone; the last part shown keeps its eye); "Edit instruments" at the foot's right where the board has an
# Instruments sheet (inst: its opener), as Flat's
EYEOFFI = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.7 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2M2 2l20 20"></path></svg>'
def PARTSECTION(inst=None):
    eye = EYEI.replace('width="20" height="20"', 'width="24" height="24"')
    sb = (f'<button type="button" aria-label="Solo {{{{c.name}}}}" data-tip="Solo" aria-pressed="{{{{c.solo}}}}" onClick="{{{{c.doSolo}}}}" style="{_PB}; color: {{{{c.soloFg}}}}">'
          '<span aria-hidden="true" style="width: 24px; height: 24px; box-sizing: border-box; border-radius: 12px; border: 2px solid currentColor; background: {{c.soloBg}}; color: {{c.soloTx}}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; line-height: 1">S</span></button>')
    vb = (f'<button type="button" aria-label="{{{{c.eyeL}}}}" data-tip="{{{{c.eyeL}}}}" aria-pressed="{{{{c.on}}}}" aria-disabled="{{{{c.last}}}}" onClick="{{{{c.pick}}}}" style="{_PB}; color: {{{{c.eyeFg}}}}">'
          f'<sc-if value="{{{{c.shown}}}}" hint-placeholder-val="{{{{true}}}}">{eye}</sc-if><sc-if value="{{{{c.hidden}}}}" hint-placeholder-val="{{{{false}}}}">{EYEOFFI}</sc-if></button>')
    glyph = (f'<span aria-hidden="true" style="flex: none; width: 24px; display: flex; color: {{{{c.nameFg}}}}"><sc-if value="{{{{c.isVoice}}}}" hint-placeholder-val="{{{{false}}}}">{MICI.replace('width="20" height="20"', 'width="24" height="24"')}</sc-if>'
             f'<sc-if value="{{{{c.isKeys}}}}" hint-placeholder-val="{{{{true}}}}">{KEYSI.replace('width="22" height="22"', 'width="24" height="24"')}</sc-if></span>')
    card = (f'<div style="min-height: 60px; box-sizing: border-box; padding: 0 6px 0 16px; {_CARD}; display: flex; align-items: center; gap: 12px">{glyph}'
            f'<span style="flex: 1; min-width: 0; font-size: 16px; color: {{{{c.nameFg}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{c.name}}}}</span>{sb}{vb}</div>')
    # the kit's switch at the row's end, as every switch row (TOGGLE, GROUP's 'toggle'), not a smaller one of its own
    allrow = (f'<button type="button" role="switch" aria-checked="{{{{phAllOn}}}}" onClick="{{{{phAll}}}}" style="width: 100%; min-height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left; display: flex; align-items: center; gap: 12px; cursor: pointer">'
              f'<span style="flex: 1; min-width: 0; font-size: 16px">All parts</span>{TOGGLE("phAllOn", face=True)}</button>')
    foot = FROW('Inst', 'Edit instruments', '', inst) if inst else ''
    # a fold as the page's Views and options (Flat's panels), headed by the Instruments glyph (Flat's instruments sheet,
    # the editor's rail); each part a filled card on the paper, as Flat's instruments sheet (004, 084)
    body = (f'{allrow}<div style="display: flex; flex-direction: column; gap: 8px"><sc-for list="{{{{phPartRows}}}}" as="c" hint-placeholder-count="2">{card}</sc-for></div>'
            + (f'<div style="{_CARD}; overflow: hidden">{foot}</div>' if foot else ''))
    return FOLD('Parts', KEYSI.replace('width="22" height="22"', 'width="20" height="20"'), 'Parts', body)
def PARTKEYS(S, SET, parts, solo='solo'):
    """the Parts sheet's rows over the board's hidden parts (S.hide, the Instruments panel's own) and its solo (S[solo],
    the Audio panel's own); parts: [(id, name)]; whether the Piano prints"""
    P = repr([list(x) for x in parts]); N = repr([n for _, n in parts])
    return (f"...((H, SO) => {{ const shownN = {N}.filter((m) => !H.includes(m)).length; return {{ phPartRows: {P}.map(([id, n]) => {{ const on = !H.includes(n); const last = on && shownN === 1; const so = SO === id; "
            f"return {{ name: n, isVoice: n !== 'Piano', isKeys: n === 'Piano', on: on ? 'true' : 'false', shown: on, hidden: !on, last: last ? 'true' : 'false', eyeL: on ? 'Hide ' + n : 'Show ' + n, eyeFg: last ? '#B4AAA0' : on ? '#332921' : '#685E56', nameFg: on ? '#332921' : '#685E56', "
            f"solo: so ? 'true' : 'false', soloFg: '#332921', soloBg: so ? '#332921' : 'transparent', soloTx: so ? '#FEFDFB' : '#332921', doSolo: () => ({SET})({{ {solo}: so ? null : id }}), "
            f"pick: () => {{ if (last) return; ({SET})({{ hide: on ? [...H, n] : H.filter((m) => m !== n) }}); }} }}; }}), "
            f"phAllOn: H.length ? 'false' : 'true', phAllOnBg: H.length ? '#DAD1C8' : '#44684A', phAllOnX: H.length ? 2 : 22, phAll: () => ({SET})({{ hide: H.length ? [] : {N}.slice(1) }}), "
            f"pianoShown: !H.includes('Piano'), pianoHidden: H.includes('Piano') }}; }})({S}.hide || [], {S}.{solo} ?? null),")
def PHBAND(back_href, keys, over=False):
    # beside ← the View button (owner, 2026-11-26: "can we merge this parts button beside the back button with the view
    # option"): the page of the views, their options and the song's parts, the one way to it on a phone
    x = (f'<a href="{back_href}" aria-label="Back" data-tip="Back · Esc" style="{_PB}; text-decoration: none">{ARROWLI}</a>'
         f'<button type="button" aria-label="View" data-tip="View" aria-haspopup="dialog" aria-expanded="{{{{phViewX}}}}" onClick="{{{{phView}}}}" style="{_PB}; color: {{{{phViewFg}}}}">{VIEWI.replace('width="20" height="20"', 'width="24" height="24"')}</button>')
    m = f'<button type="button" aria-label="Menu" data-tip="Menu" aria-haspopup="dialog" aria-expanded="{{{{phMenuX}}}}" onClick="{{{{phMenu}}}}" style="{_PB}; color: {{{{phMenuFg}}}}">{MENUI}</button>'
    pos = 'position: absolute; z-index: 48; left: 0; right: 0; top: 0; padding-top: 62px' if over else 'flex: none; position: relative; z-index: 20'
    return (f'<header data-band style="box-sizing: border-box; padding: 0 8px; {pos}; background: linear-gradient({LINE}, {LINE}) 8px 100% / calc(100% - 16px) 1px no-repeat, {SHEET}; color: {INK}">'
            f'<div style="height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 4px">{x}{PHTRANSPORT()}{keys}{m}</div></header>')
PHKEYSBTN = (f'<button type="button" aria-label="Piano keys" data-tip="Piano keys" aria-haspopup="dialog" aria-expanded="{{{{hdKeysOn}}}}" onClick="{{{{hdKeys}}}}" style="{_PB}; color: {{{{hdKeysPh}}}}">'
             + KEYSI.replace('width="22" height="22"', 'width="24" height="24"') + '</button>')
# Practice | Edit at the top of ☰ (the owner: "not in the header but in the setting or in the menu"), as Flat's menu
# opens on its editor switch: one segmented control, the whole width, each a glyph and its word, the current one white
def PHMODE(mode, practice_href, edit_href):
    seg = lambda lab, ic, href, sel: (f'<a href="{href}" role="tab" aria-selected="{"true" if sel else "false"}" style="flex: 1; height: 40px; border-radius: 10px; background: {SHEET if sel else "transparent"}; '
                                      f'box-shadow: {"0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)" if sel else "none"}; color: {INK}; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; font-weight: {600 if sel else 500}">{ic}{lab}</a>')
    return (f'<div role="tablist" aria-label="Mode" style="display: flex; gap: 2px; padding: 2px; border-radius: 12px; background: {FILL}">'
            + seg('Practice', MUSICI, practice_href, mode == 'play') + seg('Edit', PENI, edit_href, mode == 'edit') + '</div>')
# ☰ on a phone, as Flat's menu (flat-score-editor 083; owner, 2026-11-26: "and also the settings pages, and also remove
# the duplicate and archive the song"): a panel dropping from ☰ under the header, never a bottom sheet; Practice | Edit
# at its top as Flat's top card; then a row per place and act, its glyph, its name and an arrow (Flat: Credits, Manage
# instruments, Version history, Layout, MIDI Options, Export Score), no groups and no lines; the draft's Publish as
# Flat's Publish card at its foot. Each row opens its settings page: a sheet with ✕ at the left and the title centred
# (Flat's Playback options, 005), no Done. Duplicate and Archive are gone (the song's library row keeps them).
# places: (id, label, value, body, act): act, when given, is the board's own opener; PHKEYS (or the board's own keys)
# give phMenu, phMenuOn, phMenuX, phMenuFg, phClose, ph{id}On, ph{id}, phShare, phPrint, phMidiGo, phKeysGo, phOptsGo;
# head: what stands over the rows (the save state); rows: more (icon, label, value, target[, colour]) after the acts;
# foot: what closes the panel (the draft's Publish card)
_FI = lambda d: f'<svg viewBox="0 0 24 24" width="24" height="24" {I}>{d}</svg>'
FICONS = {
    'Song': _FI('<path d="m12 2 10 5-10 5L2 7l10-5Z"></path><path d="m2 12 10 5 10-5"></path><path d="m2 17 10 5 10-5"></path>'),
    'View': _FI('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>'),
    'Tr': _FI('<path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"></path>'),
    'Inst': _FI('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 5v8M12 5v14M16 5v8"></path>'),
    'Lay': _FI('<path d="M21.17 6.81a1 1 0 0 0-3.99-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"></path>'),
    'Aud': _FI('<path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path>'),
    'Cred': _FI('<circle cx="12" cy="12" r="10"></circle><path d="m12 7 1.5 3 3.3.5-2.4 2.3.6 3.3L12 14.5l-3 1.6.6-3.3-2.4-2.3 3.3-.5z"></path>'),
    'Midi': _FI('<path d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z"></path><path d="M3 5V3M7 5V3M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9"></path><path d="M18 21v-2M22 21v-2M20 15a2 2 0 0 1 2 2v2h-6v-2a2 2 0 0 1 2-2Z"></path>'),
    'Rec': _FI('<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"></path><path d="M19 11a7 7 0 0 1-14 0M12 18v3"></path>'),
    'Share': _FI('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"></path>'),
    'Exp': _FI('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"></path>'),
    'Print': _FI('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect>'),
    'Hist': _FI('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5M12 7v5l4 2"></path>'),
    'Disc': _FI('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"></path>'),
    'Mode': _FI('<path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"></path>'),
    'Hands': _FI('<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>'),
    'Met': _FI('<path d="M9 3h6l4 18H5z"></path><path d="M7.5 15h9"></path><path d="m12 15 5-9"></path>'),
    'Speed': _FI('<path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path>'),
    'Kb': _FI('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 5v8M12 5v14M16 5v8"></path>'),
    'Lab': _FI('<path d="M4 7V4h16v3M9 20h6M12 4v16"></path>'),
}
_ARROWR = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M5 12h14M12 5l7 7-7 7"></path></svg>'
def FROW(icon, label, value, target, colour=INK, line=False):
    """a settings row as Flat's: the glyph, the name, the value soft, the arrow; target a page (…html) or an act"""
    inner = (f'<span aria-hidden="true" style="flex: none; display: flex; color: {colour}">{FICONS.get(icon, icon)}</span><span style="flex: 1; min-width: 0; font-size: 17px; color: {colour}">{label}</span>'
             + (f'<span style="flex: none; font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{value}</span>' if value else '')
             + f'<span aria-hidden="true" style="flex: none; display: flex; color: {colour}">{_ARROWR}</span>')
    st = f'min-height: 56px; box-sizing: border-box; width: 100%; padding: 0 12px; border: 0;{" border-top: 1px solid " + LINE + ";" if line else ""} border-radius: 0; background: transparent; font: inherit; text-align: left; text-decoration: none; display: flex; align-items: center; gap: 16px; cursor: pointer'
    if target.endswith('.html'):
        return f'<a href="{target}" style="{st}">{inner}</a>'
    return f'<button type="button" onClick="{{{{{target}}}}}" style="{st}">{inner}</button>'
def FROWS(items, lines=True):
    return '<div style="display: flex; flex-direction: column">' + ''.join(FROW(*it[:5], line=lines and i > 0) for i, it in enumerate(items)) + '</div>'
def FSHEET(cond, title, body, close='closeSheet', back=None, **_):
    """a settings page on a phone (owner, 2026-11-26: "i don't like that all these options and settings have these
    drawers with x button and not back button. fix all such inconsistencies"): the whole screen under the status bar,
    ← Back at the left and the title centred, as Credits and every page of the app; Back goes where the page came from
    (back: ☰, the Song page, the page above it), else closes it; never a drawer with ✕"""
    return THINGPAGE(cond, back or close, title, body, False)
def FRADIO(name):
    """a page's choices as rows, the current one checked (Flat's pages, iOS Settings); a pick stays on the page"""
    return (f'<div role="radiogroup" style="display: flex; flex-direction: column; overflow: hidden; {_CARD}"><sc-for list="{{{{{name}Opts}}}}" as="o" hint-placeholder-count="3">'
            f'<button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="min-height: 52px; box-sizing: border-box; width: 100%; padding: 0 16px; border: 0; box-shadow: inset 0 1px 0 {LINE}; background: transparent; color: {INK}; font: inherit; font-size: 17px; text-align: left; display: flex; align-items: center; gap: 12px; cursor: pointer">'
            f'<span style="flex: 1">{{{{o.l}}}}</span><span aria-hidden="true" style="display: flex; color: {INK}"><sc-if value="{{{{o.cur}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK.replace("width=\"16\" height=\"16\"", "width=\"22\" height=\"22\"")}</sc-if></span></button></sc-for></div>')
EXPROWS = lambda: GROUP(*(('action', l, a, INK) for l, a in (('MusicXML', 'expXml'), ('Compressed MusicXML (.mxl)', 'expMxl'), ('MIDI', 'expMidi'))), bg=SHEET)
def PHMENU(places, takes_href, mode_html='', head='', rows=(), foot='', inst=None, title='Amazing Grace', song=(), hide=('Tr', 'Cred', 'View')):
    """song: the song's rows ☰ lists after its places (Transpose, Credits); hide: places ☰ lists through song, or the
    header's View button opens"""
    # ☰ lists every act in its own row (owner, 2026-11-26: "I dont like that the option is called songs … and I dont
    # like very much the all these options are now hidden just under this option"), as Flat's ☰ lists Credits, Manage
    # instruments, Version history, Layout, Export and Print each in its own row (flat-score-editor 083): the versions
    # are a row named Versions with their own page; the song's key, credits and recordings follow; sharing, exporting
    # and printing the file close the menu after a hairline, as Flat's Export and Print stand apart
    # Song is the song's own page (owner, 2026-11-26: "the song option really has only the versions and no the other
    # things"): its versions (the laptop rail's Song panel), then the song's things as rows: the key it sounds in, its
    # credits, its recordings, and sharing, exporting and printing it (the laptop's name menu); ☰ keeps the places
    acts = list(song) + [('Rec', 'Recordings', '3', takes_href), ('Share', 'Share link', '', 'phShare'), ('Exp', 'Export', '', 'phExp'), ('Print', 'Print', '', 'phPrint')]
    places = [(pid, 'Versions' if pid == 'Song' else lab, val, (body + PARTSECTION(inst)) if pid == 'View' else body, act) for pid, lab, val, body, act in places]
    items = [(pid, lab, val, act or f'ph{pid}') for pid, lab, val, body, act in places if pid not in hide] + acts[:-3] + list(rows)
    panel = (f'<sc-if value="{{{{phMenuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{phClose}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
             f'<nav aria-label="{title}" class="nos" style="position: absolute; z-index: 61; top: 120px; right: 8px; left: 24px; max-height: calc(100% - 170px); overflow-y: auto; box-sizing: border-box; padding: 12px 8px; border-radius: 22px; background: {PAGE}; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 18px 48px -12px rgba(51,41,33,.38); display: flex; flex-direction: column; gap: 8px">'
             + head + (f'<div style="padding: 0 4px 4px">{mode_html}</div>' if mode_html else '') + FROWS(items, lines=False) + f'<div role="separator" style="height: 1px; margin: 0 12px; background: {LINE}"></div>' + FROWS(acts[-3:], lines=False) + foot + '</nav></sc-if>')
    out = panel
    for pid, lab, val, body, act in places:
        if not act:
            out += FSHEET(f'ph{pid}On', lab, body, close='phClose', back={'View': None}.get(pid, 'phToMenu'))
    return out + FSHEET('phExpOn', 'Export', EXPROWS(), close='phClose', back='phToMenu')
# the version history on a phone (Flat's menu: Version history): a page of the saved moments, the chosen one's Restore
# at its foot; the laptop's History view's rows and state (HISTKEYS), one implementation
def PHHIST():
    row = (f'<button type="button" role="option" aria-selected="{{{{h.on}}}}" onClick="{{{{h.pick}}}}" style="width: 100%; box-sizing: border-box; padding: 12px 16px; border: 0; box-shadow: inset 0 1px 0 {LINE}; background: {{{{h.bg}}}}; color: {INK}; font: inherit; text-align: left; display: flex; flex-direction: column; gap: 6px; cursor: pointer">'
           f'<span style="display: flex; align-items: baseline; gap: 8px"><span style="flex: 1; font-size: 16px; font-weight: 600">{{{{h.t}}}}</span><sc-if value="{{{{h.cur}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; color: {SOFT}">Current</span></sc-if></span>'
           f'<span style="display: flex; flex-wrap: wrap; gap: 4px"><sc-for list="{{{{h.what}}}}" as="w" hint-placeholder-count="1"><span style="height: 24px; padding: 0 8px; border-radius: 12px; background: {FILL}; font-size: 13px; display: flex; align-items: center; font-variant-numeric: tabular-nums">{{{{w}}}}</span></sc-for></span></button>')
    body = (f'<div role="listbox" aria-label="Saved moments" style="display: flex; flex-direction: column; overflow: hidden; {_CARD}"><sc-for list="{{{{histRows}}}}" as="h" hint-placeholder-count="4">{row}</sc-for></div>'
            f'<sc-if value="{{{{histOld}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{histRestore}}}}" style="height: 48px; border: 0; border-radius: 24px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer">Restore this version</button></sc-if>')
    return FSHEET('histOn', 'Version history', body, close='closeHist', back='phHistBack')
# the act rows close the menu and do what the title menu's rows do; SET a setter expression, shut what closes the menu
def PHACTS(SET, shut, TOAST, menu):
    """menu: what reopens ☰, for its pages' Back"""
    t = lambda m, u=False: TOAST(m, u)
    return (f"phToMenu: () => ({SET})({{ {menu}, hdPop: null }}), hdMidiBack: () => ({SET})({{ hdPop: null, {menu} }}), phShare: () => ({SET})({{ {shut}, {t("'Link copied'")} }}), phPrint: () => ({SET})({{ {shut} }}), "
            f"phMidiGo: () => ({SET})({{ {shut}, hdPop: 'midi' }}), phKeysGo: () => ({SET})({{ {shut}, hdPop: 'keys' }}), phOptsGo: () => ({SET})({{ {shut}, hdPop: 'opts' }}), ")
def PHKEYS(S, SET, ids, TOAST):
    return ("...(() => { const P = " + S + ".ph ?? null; const o = { phMenu: () => (" + SET + ")({ ph: P === 'menu' ? null : 'menu', hdPop: null }), phMenuOn: P === 'menu', phMenuX: P === 'menu' ? 'true' : 'false', "
            "phMenuFg: P === 'menu' ? '#A8551F' : '#332921', phClose: () => (" + SET + ")({ ph: null }), " + PHACTS(SET, 'ph: null', TOAST, "ph: 'menu'") + "}; for (const id of " + repr(list(ids) + ['Exp']) + ") { o['ph' + id + 'On'] = P === id; o['ph' + id] = () => (" + SET + ")({ ph: P === id ? null : id, hdPop: null }); } o.phViewX = P === 'View' ? 'true' : 'false'; o.phViewFg = P === 'View' ? '#A8551F' : '#332921'; return o; })(),")

# Rename version…: a small form, the one thing a laptop centres (ui-and-mockups)
def RENAMEDLG():
    b = lambda l, h, bg: f'<button type="button" onClick="{{{{{h}}}}}" style="height: 44px; padding: 0 18px; border: 0; border-radius: 22px; background: {bg}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer">{l}</button>'
    return ('<sc-if value="{{renOn}}" hint-placeholder-val="{{false}}">' + DIALOGBOX(
        f'<h2 style="margin: 0; font-size: 17px; font-weight: 600">Rename version</h2>'
        f'<input ref="{{{{renRef}}}}" aria-label="Version name" value="{{{{renVal}}}}" style="height: 44px; box-sizing: border-box; padding: 0 12px; border: 0; border-radius: 12px; background: #FEFDFB; box-shadow: inset 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}">'
        f'<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px">' + b('Cancel', 'renCancel', 'transparent') + b('Save', 'renSave', ACCENT) + '</div>',
        close='renCancel', label='Rename version') + '</sc-if>')

# Practice · Edit: two modes of the one screen, never a separate page (owner, 2026-11-26: "i dont want the edit score to
# be a separate workspace: i want it to be a mode like read only or edit mode"; "our app goal and main is not the editor
# but practice"): a two-segment switch right after the title, as Flat's mode beside its name (the owner's Flat
# screenshots) and Apple's segmented control for two exclusive modes; Practice first and the default, the chosen one
# filled; the same place in both modes so nothing moves; the toolbars and panels are what Edit adds
_MSEG = 'height: 40px; box-sizing: border-box; padding: 0 14px 0 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600; text-decoration: none; white-space: nowrap'
MUSICI = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
def MODESW(on, practice_href, edit_href, compact=False):
    # Practice | Edit, two tabs side by side (owner, 2026-11-26: "make the switch between the player and the editor a tab
    # switch, not a combobox"): two exclusive modes of one screen are a segmented control, both always in sight (Apple
    # HIG, Segmented controls; Flat's Read-only | Edit pair in its band), never a menu that hides the other; the current
    # one filled white on the dark band, the other bare, each its glyph and word, P and E their keys; each tab the pill's
    # full 40 height, a dense laptop bar's least target (craft-details, Hit area), the ring round both
    # compact (a phone's band, no room for the words beside the song's name): the two glyphs, each a 44 tab named by its
    # word (aria-label and tip), as Flat's phone band carries its modes as glyphs
    seg = lambda lab, ic, href, sel, key: (f'<a href="{href}" role="tab" aria-selected="{"true" if sel else "false"}"' + (f' aria-label="{lab}"' if compact else '') + f' data-tip="{lab} · {key}" style="flex: none; height: {44 if compact else 40}px; box-sizing: border-box; padding: 0 {13 if compact else 14}px; border-radius: {22 if compact else 20}px; '
                                          f'background: {ONB if sel else "transparent"}; color: {BAND if sel else ONB}; text-decoration: none; display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600">{ic}' + ('' if compact else f'<span>{lab}</span>') + '</a>')
    return (f'<div role="tablist" aria-label="Mode" style="flex: none; height: {44 if compact else 40}px; box-sizing: border-box; padding: 0; border-radius: {22 if compact else 20}px; box-shadow: {ONB_RING}; display: flex; align-items: center; gap: 2px; pointer-events: auto">'
            + seg('Practice', MUSICI, practice_href, on == 'play', 'P') + seg('Edit', PENI, edit_href, on == 'edit', 'E') + '</div>')

# The transport in the header, as Flat's (the owner's Flat 26.11 band, the new header: the title, then go to start, Play with its options,
# metronome, loop, volume, MIDI, then the mode): one glass pill after the title in both modes, nothing floating over the
# music on a laptop; Play the one honey circle; the buttons 40 high, a dense laptop bar's size
HDRPILL = f'flex: none; height: 48px; box-sizing: border-box; padding: 4px; border-radius: 24px; {GLASSFX}; display: flex; align-items: center; gap: 2px; pointer-events: auto'
HDRSEP = f'<span aria-hidden="true" style="flex: none; width: 1px; height: 20px; margin: 0 4px; background: {LINE}"></span>'

# Flat's header transport, refactored rather than moved (owner, 2026-11-26: "refactor properly: why did you put them
# there and just moved the location but didnt refactor them properly?"): Flat's new band (the owner's Flat 26.11 screenshots;
# FLAT_PLAYER_AND_PIANO.md §1.1) is a row of single round buttons, each one act: Go to start (Ctrl+Space), Play with its
# options under ▾ (Flat's "Audio options": playback speed), the metronome (one press cycles Count-in, On, Off: Flat's
# "Change metronome mode"), Loop (L), then MIDI, a bare cable glyph (its popover: the keyboard, Sound from
# the app, Record); Volume lives in the Audio panel alone. Ours are the same acts with the same keys in Practice and in Edit; the old capsule's ‹ › steps
# (Go to start replaces them), its Listen/Wait label (Play's options) and its Hands and Keys labels (the Audio panel holds the
# parts; the keys are the view's, at the bar's end as Flat's keyboard toggle) are gone. Each 44 round glass, Play
# the one honey circle. The keys every board supplies: hdStart, hdPlay, hdPlayTip, hdPlayD, hdOpts, hdOptsX, hdMet,
# hdMetTip, hdMetOff, hdLoop, hdLoopPh, hdLoopTip, hdMidi, hdMidiX, hdMidiBg.
METI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M9 3h6l4 18H5z"></path><path d="M7.5 15h9"></path><path d="m12 15 5-9"></path></svg>'
_HB = 'flex: none; width: 40px; height: 40px; padding: 0; border: 0; border-radius: 20px; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer'
CABLEI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"></path><path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"></path><path d="M21 21v-2h-4"></path><path d="M3 5h4V3"></path><path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"></path></svg>'
MIXI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"></path></svg>'
def HDRTRANSPORT(phone=False):
    hb = _HB.replace('width: 40px; height: 40px; padding: 0; border: 0; border-radius: 20px', 'width: 44px; height: 44px; padding: 0; border: 0; border-radius: 22px') if phone else _HB
    b = lambda lab, tip, inner, act, look, extra='': f'<button type="button" aria-label="{lab}" data-tip="{tip}" onClick="{{{{{act}}}}}"{extra} style="{hb}; {look}">{inner}</button>'
    filled = f'background: {ONB}; color: {BAND}'
    # filled white as Flat's; Loop's glyph honey-deep while it loops (the one sign it is on; Play keeps the one honey fill,
    # as the phone's lit glyphs), the metronome crossed while off
    lit = lambda k: f'background: {ONB}; color: {{{{{k}Ph}}}}'
    start = b('Go to start', 'Go to start · ⌃Space', '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="2.5" height="14" rx="1"></rect><path d="M19 6.3v11.4a1 1 0 0 1-1.5.86L9.4 13.3a1.5 1.5 0 0 1 0-2.6l8.1-5.26A1 1 0 0 1 19 6.3z"></path></svg>', 'hdStart', filled)
    play = (f'<div role="group" aria-label="Play" style="flex: none; display: flex; align-items: center; gap: 2px">'
            + b('{{hdPlayTip}}', '{{hdPlayTip}} · Space', '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="{{hdPlayD}}"></path></svg>', 'hdPlay', f'background: #EDC684; color: {BAND}')
            + f'<button type="button" aria-label="Playback options" data-tip="Playback options" aria-haspopup="dialog" aria-expanded="{{{{hdOptsX}}}}" onClick="{{{{hdOpts}}}}" style="flex: none; width: 24px; height: 40px; padding: 0; border: 0; border-radius: 12px; background: {{{{hdOptsBg}}}}; color: {ONB}; display: flex; align-items: center; justify-content: center; cursor: pointer">{CHEV_D}</button></div>')
    met = b('{{hdMetTip}}', '{{hdMetTip}} · press to change', METI.replace('width="20" height="20"', 'width="18" height="18"') + '<sc-if value="{{hdMetOff}}" hint-placeholder-val="{{true}}"><span aria-hidden="true" style="position: absolute; width: 22px; height: 1.5px; border-radius: 1px; background: currentColor; transform: rotate(-45deg)"></span></sc-if>', 'hdMet', filled)
    loop = b('Loop', '{{hdLoopTip}} · L', '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>', 'hdLoop', lit('hdLoop'), ' aria-pressed="{{hdLoopOn}}"')
    # MIDI as Flat's new band draws it (the owner's Flat 26.11 screenshots): a bare cable glyph after Loop, no ring, no
    # word; it opens its own popover under it (the keyboard in use, Sound from the app, Record), never a jump to Settings
    # (owner, 2026-11-26: "it doesnt make sense with these midi button goes to the settings popup"). Volume left the band
    # for the Audio panel, Record for this popover: Flat's band has neither
    # Transpose after Loop: what the whole song sounds in, named on the pill (the key), its popover under it
    tr = (f'<button type="button" aria-label="Transpose: {{{{hdKeyL}}}}" data-tip="Transpose · T" aria-haspopup="dialog" aria-expanded="{{{{hdTrX}}}}" onClick="{{{{hdTr}}}}" style="flex: none; height: 40px; padding: 0 10px 0 14px; border: 0; border-radius: 20px; background: {ONB}; color: {BAND}; font: inherit; font-size: 14px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 4px; cursor: pointer">'
          f'{{{{hdKeyL}}}}<span aria-hidden="true" style="display: flex">{CHEV_D}</span></button>')
    midi = b('MIDI keyboard', 'MIDI keyboard', CABLEI, 'hdMidi', f'background: {{{{hdMidiBg}}}}; color: {ONB}', ' aria-haspopup="dialog" aria-expanded="{{hdMidiX}}"')
    if phone:
        # Flat's phone header (flat-score-editor 017; help.flat.io's mobile screenshots): one row, the transport its
        # acts alone (Go to start, Play, the metronome, Loop); Playback options and MIDI are rows of its ☰ (Flat's
        # "MIDI input"), the row having no room for a ▾ beside a finger's 44
        play1 = b('{{hdPlayTip}}', '{{hdPlayTip}} · Space', '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="{{hdPlayD}}"></path></svg>', 'hdPlay', f'background: #EDC684; color: {BAND}')
        return f'<div role="toolbar" aria-label="Transport" style="flex: none; display: flex; align-items: center; gap: 2px">{start}{play1}{met}{loop}</div>'
    return f'<div role="toolbar" aria-label="Transport" style="flex: none; display: flex; align-items: center; gap: 10px">{start}{play}{met}{loop}{tr}{midi}</div>'

def BANDHDR(close_href, mode, practice_href, edit_href, right='', over=False):
    """The one header of the Player's screen, Practice and Edit alike: ✕, the song's menu, the transport, the mode.
    over: laid over the screen at its top (the Player's absolute layers), else in the column's flow (the editor)."""
    x = (f'<a href="{close_href}" aria-label="Close" data-tip="Close · Esc" style="flex: none; width: 40px; height: 40px; border-radius: 20px; color: {ONB}; display: flex; align-items: center; justify-content: center">'
         '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg></a>')
    return (f'<header data-band style="{"position: absolute; z-index: 48; left: 0; right: 0; top: 0" if over else "flex: none; position: relative; z-index: 20"}; height: 64px; box-sizing: border-box; padding: 0 16px 0 12px; display: flex; align-items: center; gap: 12px; background: {BAND}; color: {ONB}">'
            f'{x}{SONGMENU("TakesLaptop.dc.html")}{HDRTRANSPORT()}{MODESW(mode, practice_href, edit_href)}<span style="flex: 1"></span>{right}</header>')

# The header's popovers, new and the same in both modes: each a card hung 8 under its button, a tap outside closing it
# (the kit's popover card: 16 round, the page's paper, the hairline and the float shadow). Playback options holds what
# Flat's ▾ holds, Playback speed (0.2× to 2.0×, by 0.1), and in Practice how you practise: Listen or Wait, and the
# hands you play (flowkey's and Simply Piano's choice before a run). MIDI keyboard holds the keyboard in use, Sound from
# the app and Record, complete there; no Volume popover: Flat's band has no Volume, its Audio panel is the one home of the levels. Piano keys (Practice;
# the editor's toolbar has its own) is the keys' view: 3D, 2D or Off, and their labels.
_HPOP = f'position: absolute; z-index: 61; box-sizing: border-box; border-radius: 16px; background: {PAGE}; padding: 12px 12px 8px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 4px'
_HCAP = lambda t: f'<h3 style="margin: 0; font-size: 15px; font-weight: 600">{t}</h3>'
def _HPOPOVER(cond, title, body, pos, w, phone=False, back=None):
    if phone:
        # on a phone the band's popovers are sheets rising from the foot (a choice made in context), the same rows in one card
        body = body.replace('width: 40px; height: 40px; border: 0; border-radius: 20px', 'width: 44px; height: 44px; border: 0; border-radius: 22px')
        return FSHEET(cond, title, f'<div style="display: flex; flex-direction: column; overflow: hidden; padding: 0 12px; {_CARD}">{body}</div>', close='hdClose', back=back)
    return (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{hdClose}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
            f'<section role="dialog" aria-label="{title}" style="{_HPOP}; {pos}; width: {w}px"><h2 style="margin: 0; padding: 4px 0 4px; font-size: 15px; font-weight: 600">{title}</h2>{body}</section></sc-if>')
def _HVOLROW(i):
    ib = lambda lab, act, on, svg: f'<button type="button" aria-label="{lab} {{{{p.name}}}}" data-tip="{lab}" aria-pressed="{{{{p.{on}}}}}" onClick="{{{{p.{act}}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: {{{{p.{on}Bg}}}}; color: {{{{p.{on}Fg}}}}; display: flex; align-items: center; justify-content: center; cursor: pointer">{svg}</button>'
    return (f'<div style="display: flex; flex-direction: column"><div style="min-height: 44px; display: flex; align-items: center; gap: 4px"><span style="flex: 1; font-size: 15px; font-weight: 600">{{{{p.name}}}}</span>'
            + ib('Solo', 'doSolo', 'solo', '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>')
            + ib('Mute', 'doMute', 'mute', '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="m22 9-6 6M16 9l6 6"></path></svg>') + '</div>'
            + f'<div style="display: flex; align-items: center; gap: 12px"><input type="range" min="0" max="100" step="5" value="{{{{p.v}}}}" onChange="{{{{p.setV}}}}" aria-label="{{{{p.name}}}} volume" style="flex: 1; min-width: 0; height: 44px; margin: 0; accent-color: {INK}"><span style="width: 40px; text-align: right; font-size: 14px; font-variant-numeric: tabular-nums">{{{{p.v}}}}%</span></div></div>')
# Transpose's rows (Semitones with − and +, the Key it lands in, Back to G major once moved): one implementation, in
# the band's popover on a laptop and in the phone editor's sheet (the hdTr* keys of HDRKEYS); `big` for a finger
def TRROWS(big=False):
    qb2 = lambda lab, act, svg: f'<button type="button" aria-label="{lab}" onClick="{{{{{act}}}}}" disabled="{{{{{act}Dis}}}}" style="flex: none; width: 40px; height: 40px; border: 0; border-radius: 20px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; cursor: pointer">{svg}</button>'
    semis = (f'<div style="min-height: 44px; display: flex; align-items: center; gap: 4px; padding: 0 4px 0 12px"><span style="flex: 1; font-size: 15px">Semitones</span>' + qb2('Down a semitone', 'hdTrDown', STEP_MINUS)
             + f'<span style="min-width: 44px; text-align: center; font-size: 15px; font-variant-numeric: tabular-nums">{{{{hdTrL}}}}</span>' + qb2('Up a semitone', 'hdTrUp', STEP_PLUS) + '</div>')
    keyrow = f'<div style="min-height: 44px; display: flex; align-items: center; gap: 12px; padding: 0 12px; border-top: 1px solid {LINE}"><span style="flex: 1; font-size: 15px">Key</span><span style="font-size: 15px; color: {SOFT}">{{{{hdKeyL}}}}</span></div>'
    back = (f'<sc-if value="{{{{hdTrMoved}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{hdTrReset}}}}" style="width: 100%; min-height: 44px; box-sizing: border-box; padding: 0 12px; border: 0; border-top: 1px solid {LINE}; background: transparent; color: #356A8C; font: inherit; font-size: 15px; text-align: left; cursor: pointer">Back to G major</button></sc-if>')
    if not big:
        return f'<div style="display: flex; flex-direction: column; margin: 0 -12px">{semis}{keyrow}{back}</div>'
    # on a phone: one card as the sheet's other groups, the rows on its 16 inset, the − and + at 44 for a finger
    h = (semis + keyrow + back).replace('width: 40px; height: 40px; border: 0; border-radius: 20px', 'width: 44px; height: 44px; border: 0; border-radius: 22px').replace('padding: 0 4px 0 12px', 'padding: 0 6px 0 16px').replace('padding: 0 12px', 'padding: 0 16px')
    return f'<div style="display: flex; flex-direction: column; overflow: hidden; {_CARD}">{h}</div>'
def HDRPOPS(practice, opts_left, tr_left, midi_left, keys_right=None, phone=False):
    # rows, as every card's (VERPANEL, ACCPANEL): a value with its pop-up, a level with its slider; no segmented strip
    rows = lambda *r: f'<div style="display: flex; flex-direction: column; margin: 0 -12px">{"".join(r)}</div>'
    qb = lambda lab, act, svg: f'<button type="button" aria-label="{lab}" onClick="{{{{{act}}}}}" disabled="{{{{{act}Dis}}}}" style="flex: none; width: 40px; height: 40px; border: 0; border-radius: 20px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; cursor: pointer">{svg}</button>'
    speed = (f'<div style="min-height: 44px; display: flex; align-items: center; gap: 4px; padding: 0 4px 0 12px;' + (f' border-top: 1px solid {LINE}' if practice else '') + '">'
             f'<span style="flex: 1; font-size: 15px">Playback speed</span>' + qb('Slower', 'hdSlower', STEP_MINUS)
             + f'<span style="min-width: 44px; text-align: center; font-size: 15px; font-variant-numeric: tabular-nums">{{{{hdSpeedL}}}}</span>' + qb('Faster', 'hdFaster', STEP_PLUS) + '</div>')
    # on a phone the metronome is a row here, as in Flat's Playback options (Audio playback, Metronome, Playback speed):
    # the header's fourth glyph is this sheet's speaker
    met = SELROW('Metronome', 'selMet', practice) if phone else ''
    if phone and not practice:
        speed = speed.replace('padding: 0 4px 0 12px;', f'padding: 0 4px 0 12px; border-top: 1px solid {LINE}', 1)
    # the laptop's card in the phone page's order (Flat's 005: Playback speed, then in Practice Mode and Hands); its
    # Audio and Metronome have their own buttons in the band
    if phone:
        opts = rows(*((SELROW('Mode', 'selMode', False), SELROW('Hands', 'selHands')) if practice else ()), met, speed)
    else:
        opts = rows(speed.replace(f' border-top: 1px solid {LINE}', '', 1), *((SELROW('Mode', 'selMode'), SELROW('Hands', 'selHands')) if practice else ()))
    if phone:
        # Flat's Playback options (005; owner, 2026-11-26: "refactor the hands setting and the metronome and other
        # settings"): a page of rows, each its glyph, name, value and arrow, each opening its own page of choices with ←
        # (iOS Settings, Flat's Audio playback, Metronome, Playback speed); a pick shows at once and stays on the page
        # Flat's three first, in its order (005; the R74 ruling "its first row as Flat's"), then Practice's own two
        items = [('Aud', 'Audio playback', '{{hdRoomL}}', 'hdGoAud'), ('Met', 'Metronome', '{{selMetV}}', 'hdGoMet'), ('Speed', 'Playback speed', '{{hdSpeedL}}', 'hdGoSpeed')] + ([('Mode', 'Mode', '{{selModeV}}', 'hdGoMode'), ('Hands', 'Hands', '{{selHandsV}}', 'hdGoHands')] if practice else [])
        out = FSHEET('hdOptsMain', 'Playback options', FROWS(items), close='hdClose')
        sp = speed.replace(f' border-top: 1px solid {LINE}', '').replace('width: 40px; height: 40px; border: 0; border-radius: 20px', 'width: 44px; height: 44px; border: 0; border-radius: 22px').replace('padding: 0 4px 0 12px', 'padding: 0 6px 0 16px').replace('Playback speed', 'Speed')
        if practice:
            out += FSHEET('hdSubModeOn', 'Mode', FRADIO('selMode'), close='hdClose', back='hdSubBack')
            out += FSHEET('hdSubHandsOn', 'Hands', FRADIO('selHands'), close='hdClose', back='hdSubBack')
        # Audio playback is the first of Flat's Playback options (005): the room and the levels, the laptop's Audio panel
        # (one implementation); never a row of ☰ (owner, 2026-11-26: "i dont like that we have the audio in the menu and
        # not in the playback options")
        out += FSHEET('hdSubAudOn', 'Audio playback', AUDPANEL(phone=True), close='hdClose', back='hdSubBack')
        out += FSHEET('hdSubMetOn', 'Metronome', FRADIO('selMet'), close='hdClose', back='hdSubBack')
        out += FSHEET('hdSubSpeedOn', 'Playback speed', f'<div style="display: flex; flex-direction: column; overflow: hidden; {_CARD}">{sp}</div>' + FRADIO('selSpeed'), close='hdClose', back='hdSubBack')
    else:
        out = _HPOPOVER('hdOptsOn', 'Playback options', opts, f'left: {opts_left}px; top: 65px', 320, phone)
    # MIDI keyboard, complete in its popover (owner, 2026-11-26: "the midi settings still go to the wrong settings page
    # … remove all the unneeded midi settings … i dont like this showing one settings and then things like all settings"):
    # as Flat's MIDI Settings popover in its band (FLAT_PLAYER_AND_PIANO §2.5: the input's device select with None, and
    # "No MIDI device plugged in"), what a learner at a piano needs and nothing after it: the Keyboard listened to; Sound
    # from the app, off by default because a digital piano sounds itself (tiny-instrument's muteExternalMIDIAudio); Record.
    # With no keyboard, the way to connect one instead. No link to Settings; output, octave shift, touch, latency and the
    # log are gone (a piano needs none of them to play along)
    snd = SWITCHROW('Sound from the app', 'hdSndOn', 'hdSnd', 'hdSndTr', 'hdSndKn')
    none = (f'<div style="padding: 10px 12px 12px; border-top: 1px solid {LINE}; font-size: 15px; line-height: 1.4; color: {SOFT}">'
            'Plug in a keyboard by USB or pair it by Bluetooth, then press a key.</div>')
    rec = (f'<button type="button" aria-pressed="{{{{hdRecOn}}}}" onClick="{{{{hdRec}}}}" style="width: 100%; min-height: 44px; box-sizing: border-box; padding: 0 8px 0 12px; border: 0; border-top: 1px solid {LINE}; background: transparent; color: {INK}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 10px; text-align: left; cursor: pointer">'
           f'<span aria-hidden="true" style="flex: none; width: 12px; height: 12px; border-radius: {{{{hdRecR}}}}; background: #D2483A"></span><span style="flex: 1">{{{{hdRecL}}}}</span><span style="font-size: 13px; color: {SOFT}">R</span></button>')
    # Transpose: the semitones with − and + (a stepper for a frequent, precise value), the key it lands in, and the way
    # back to the written key when it moved; it changes the playback and the page at once (no Apply)
    out += _HPOPOVER('hdTrOn', 'Transpose', TRROWS(), f'left: {tr_left}px; top: 65px', 300, phone)
    out += _HPOPOVER('hdMidiOn', 'MIDI keyboard', rows(SELROW('Keyboard', 'selMidi', False),
        f'<sc-if value="{{{{hdMidiAny}}}}" hint-placeholder-val="{{{{true}}}}">' + snd + rec + '</sc-if>',
        f'<sc-if value="{{{{hdMidiNone}}}}" hint-placeholder-val="{{{{false}}}}">' + none + '</sc-if>'), f'left: {midi_left}px; top: 65px', 320, phone, back='hdMidiBack')
    if keys_right is not None:
        if phone:
            out += FSHEET('hdKeysMain', 'Piano keys', FROWS([('Kb', 'Piano', '{{selKbV}}', 'hdGoKb'), ('Lab', 'Labels', '{{selLabV}}', 'hdGoLab')]), close='hdClose')
            out += FSHEET('hdSubKbOn', 'Piano', FRADIO('selKb'), close='hdClose', back='hdSubBack') + FSHEET('hdSubLabOn', 'Labels', FRADIO('selLab'), close='hdClose', back='hdSubBack')
        else:
            out += _HPOPOVER('hdKeysOn', 'Piano keys', rows(SELROW('Piano', 'selKb', False), SELROW('Labels', 'selLab')), f'right: {keys_right}px; top: 65px', 320, phone)
    return out
# The Audio panel, Flat's (owner's Flat 26.11 screenshot of Audio: "Room", then Volume: a "Master volume" card, then a card per
# instrument with its headphones (solo), its mute and its level), one implementation for Practice and Edit, opened from
# the rail's Audio; the band has no Volume (one home). Each part a card because it is
# a thing with its own acts among its siblings (edge-lines: a card is a thing among siblings); the room a segmented
# control, four exclusive values side by side (Apple HIG, Segmented controls). The state is HDRKEYS's (hdRooms,
# hdVolM, hdParts), so both modes read one model.
MICI = _LI('<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"></path><path d="M19 11a7 7 0 0 1-14 0M12 18v3"></path>')
_ACARD = f'box-sizing: border-box; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 4px 8px 4px 16px; display: flex; flex-direction: column'
def _ALEVEL(lab, val, setv):
    return (f'<div style="display: flex; align-items: center; gap: 12px; padding-right: 8px"><input type="range" min="0" max="100" step="5" value="{{{{{val}}}}}" onChange="{{{{{setv}}}}}" aria-label="{lab} volume" style="flex: 1; min-width: 0; height: 40px; margin: 0; accent-color: {INK}">'
            f'<span style="flex: none; width: 40px; text-align: right; font-size: 14px; font-variant-numeric: tabular-nums">{{{{{val}}}}}%</span></div>')
def AUDPANEL(phone=False):
    # phone: a finger's 44 for solo and mute, the page's own 4 under its head
    d = 44 if phone else 40
    ib = lambda lab, act, on, svg: f'<button type="button" aria-label="{lab} {{{{p.name}}}}" data-tip="{lab}" aria-pressed="{{{{p.{on}}}}}" onClick="{{{{p.{act}}}}}" style="flex: none; width: {d}px; height: {d}px; border: 0; border-radius: {d // 2}px; background: {{{{p.{on}Bg}}}}; color: {{{{p.{on}Fg}}}}; display: flex; align-items: center; justify-content: center; cursor: pointer">{svg}</button>'
    room = f'<section aria-label="Room" style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">Room</h3>{SEGC("hdRooms", 36, 14, True)}</section>'
    master = (f'<div style="{_ACARD}"><div style="min-height: 44px; display: flex; align-items: center"><span style="flex: 1; font-size: 15px; font-weight: 600">Master volume</span></div>'
              + _ALEVEL('Master', 'hdVolM', 'hdSetVolM') + '</div>')
    part = (f'<div style="{_ACARD}"><div style="min-height: 44px; display: flex; align-items: center; gap: 4px"><span aria-hidden="true" style="flex: none; display: flex; margin-right: 8px; color: {SOFT}"><sc-if value="{{{{p.isVoice}}}}" hint-placeholder-val="{{{{false}}}}">{MICI}</sc-if><sc-if value="{{{{p.isKeys}}}}" hint-placeholder-val="{{{{true}}}}">{KEYSI.replace('width="22" height="22"', 'width="20" height="20"')}</sc-if></span>'
            f'<span style="flex: 1; min-width: 0; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{p.name}}}}</span>'
            + ib('Solo', 'doSolo', 'solo', HEADPHI) + ib('Mute', 'doMute', 'mute', MUTEI) + '</div>' + _ALEVEL('{{p.name}}', 'p.v', 'p.setV') + '</div>')
    parts = f'<section aria-label="Volume" style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">Volume</h3>{master}<sc-for list="{{{{hdParts}}}}" as="p" hint-placeholder-count="2">{part}</sc-for></section>'
    if phone:
        return f'<div style="display: flex; flex-direction: column; gap: 24px; padding: 4px 0 0">{room}{parts}</div>'
    # a laptop panel's sections are folds, as Song, View and Notation (owner, 2026-11-26: every section of a panel a fold;
    # Flat's Audio panel in the owner's 26.11 screenshots): Room (the reverb's waves), then Volume (the master, each part)
    return ('<div style="display: flex; flex-direction: column">' + FOLD('Room', WAVESI, 'Room', SEGC('hdRooms', 36, 14, True), first=True)
            + FOLD('Vol', AUDIOI, 'Volume', master + f'<sc-for list="{{{{hdParts}}}}" as="p" hint-placeholder-count="2">{part}</sc-for>') + '</div>')
HDRKEYSBTN = (f'<button type="button" aria-label="Piano keys" data-tip="Piano keys · K" aria-haspopup="dialog" aria-expanded="{{{{hdKeysOn}}}}" onClick="{{{{hdKeys}}}}" style="{_HB}">'
              + KEYSI.replace('width="22" height="22"', 'width="20" height="20"') + '</button>').replace(f'style="{_HB}"', f'style="{_HB}; background: {{{{hdKeysBg}}}}; color: {ONB}"', 1)
def HDRKEYS(S, SET, TOAST, play, playing, loop, loop_on, loop_tip, parts):
    """The header's state, one for both modes. S, SET: the board's state and setter; TOAST(msg) its toast fields;
    play, loop: the board's own acts; playing, loop_on, loop_tip: its expressions; parts: [(id, name)]."""
    P = repr([list(x) for x in parts])
    return ('...(() => { const S = ' + S + ', SET = ' + SET + '; const pop = S.hdPop ?? null; const sub = pop ? (S.hdSub ?? null) : null; const shut = { hdPop: null, hdSub: null };'
            " const tg = (k) => () => SET({ hdPop: pop === k ? null : k, hdSub: null }); const SUBS = {}; for (const k of ['Mode', 'Hands', 'Aud', 'Met', 'Speed', 'Kb', 'Lab']) { SUBS['hdSub' + k + 'On'] = sub === k; SUBS['hdGo' + k] = () => SET({ hdSub: k }); }"
            " const sg = (list, cur, pick) => list.map(([id, l]) => ({ l, on: id === cur ? 'true' : 'false', bg: id === cur ? '#FEFDFB' : 'transparent', sh: id === cur ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: id === cur ? 600 : 500, pick: () => pick(id) }));"
            " const sp = S.speed ?? 100; const met = S.metro ? 'on' : (S.countBars ?? 1) ? 'count' : 'off'; const NEXT = { count: 'on', on: 'off', off: 'count' }; const MN = { count: 'Metronome: count-in', on: 'Metronome: on', off: 'Metronome: off' };"
            " const hands = (S.showR ?? 'show') === 'hide' ? 'lh' : (S.showL ?? 'show') === 'hide' ? 'rh' : 'both'; const rec = !!S.rec; const solo = S.solo ?? null; const mute = S.mute ?? [];"
            " const kb = S.keys === false ? 'off' : (S.kbStyle ?? '3d'); const tr = S.trans ?? 0; const KEYS = ['G major', 'A♭ major', 'A major', 'B♭ major', 'B major', 'C major', 'D♭ major', 'D major', 'E♭ major', 'E major', 'F major', 'F♯ major'];"
            " return { ...SUBS, hdSubBack: () => SET({ hdSub: null }), hdOptsMain: pop === 'opts' && !sub, hdKeysMain: pop === 'keys' && !sub, hdClose: () => SET(shut), hdStart: () => SET({ bar: 1, beat: 1, ...shut }), hdPlay: " + play + ", hdPlayTip: (" + playing + ") ? 'Pause' : 'Play',"
            " hdPlayD: (" + playing + ") ? 'M7 4h4v16H7zM13 4h4v16h-4z' : 'M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z',"
            " hdOpts: tg('opts'), hdOptsOn: pop === 'opts', hdOptsX: pop === 'opts' ? 'true' : 'false',"
            " hdMet: () => { const n = NEXT[met]; SET({ metro: n === 'on', countBars: n === 'off' ? 0 : 1, " + TOAST("MN[n]") + " }); }, hdMetTip: MN[met], hdMetOff: met === 'off', "
            " hdLoop: " + loop + ", hdLoopOn: (" + loop_on + ") ? 'true' : 'false', hdLoopPh: (" + loop_on + ") ? '#A8551F' : '#332921', hdLoopTip: " + loop_tip + ","
            " hdTr: tg('tr'), hdTrOn: pop === 'tr', hdTrX: pop === 'tr' ? 'true' : 'false', hdTrL: (tr > 0 ? '+' : tr < 0 ? '−' : '') + Math.abs(tr), hdKeyL: KEYS[((tr % 12) + 12) % 12], hdTrUp: () => SET({ trans: Math.min(11, tr + 1) }), hdTrDown: () => SET({ trans: Math.max(-11, tr - 1) }), hdTrUpDis: tr >= 11, hdTrDownDis: tr <= -11, hdTrMoved: tr !== 0, hdTrReset: () => SET({ trans: 0 }), hdMidi: tg('midi'), hdMidiAny: (S.midiDev ?? 'fp30') !== 'none', hdMidiNone: (S.midiDev ?? 'fp30') === 'none', hdSnd: () => SET({ midiSnd: !S.midiSnd }), hdSndOn: S.midiSnd ? 'true' : 'false', hdSndTr: S.midiSnd ? '#44684A' : '#DAD1C8', hdSndKn: S.midiSnd ? 22 : 2, hdMidiOn: pop === 'midi', hdMidiX: pop === 'midi' ? 'true' : 'false', hdMidiBg: pop === 'midi' ? 'rgba(254,253,251,.16)' : 'transparent', hdOptsBg: pop === 'opts' ? 'rgba(254,253,251,.16)' : 'transparent', hdKeys: tg('keys'), hdKeysOn: pop === 'keys', hdKeysBg: pop === 'keys' ? 'rgba(254,253,251,.16)' : 'transparent', hdKeysPh: pop === 'keys' ? '#A8551F' : '#332921', hdOptsPh: pop === 'opts' ? '#A8551F' : '#332921',"
            " hdRooms: ['Off', 'Studio', 'Hall', 'Cathedral'].map((l) => { const on = (S.room ?? 'Off') === l; return { l, on: on ? 'true' : 'false', bg: on ? '#FEFDFB' : 'transparent', sh: on ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: on ? 600 : 500, pick: () => SET({ room: l }) }; }),"
            " hdRec: () => SET({ rec: !rec, " + TOAST("rec ? 'Recording stopped · Recording 4 kept' : 'Recording · play on your keyboard'") + " }), hdRecOn: rec ? 'true' : 'false', hdRecL: rec ? 'Stop recording' : 'Record', hdRecR: rec ? '2px' : '6px',"
            " hdSpeedL: (sp / 100).toFixed(1) + '×', hdSlower: () => SET({ speed: Math.max(20, sp - 10) }), hdFaster: () => SET({ speed: Math.min(200, sp + 10) }), hdSlowerDis: sp <= 20, hdFasterDis: sp >= 200,"
            " hdVolM: S.volM ?? 100, hdRoomL: (S.volM ?? 100) + '%', hdSetVolM: (e) => SET({ volM: Number(e.target.value) }),"
            " hdParts: " + P + ".map(([id, name]) => { const so = solo === id, mu = mute.includes(id); const v = S['vol' + id] ?? 100; return { name, isVoice: id === 'V', isKeys: id !== 'V', v, setV: (e) => SET({ ['vol' + id]: Number(e.target.value) }),"
            " solo: so ? 'true' : 'false', soloBg: so ? '#332921' : 'transparent', soloFg: so ? '#FEFDFB' : '#332921', mute: mu ? 'true' : 'false', muteBg: mu ? '#332921' : 'transparent', muteFg: mu ? '#FEFDFB' : '#332921',"
            " doSolo: () => SET({ solo: so ? null : id }), doMute: () => SET({ mute: mu ? mute.filter((m) => m !== id) : [...mute, id] }) }; }) }; })(), "
            + SELKEYS(S, '(' + SET + ')', [('selMode', [('play', 'Listen'), ('wait', 'Wait')], f"({S}.mode === 'wait' ? 'wait' : 'play')", f"(id) => ({SET})({{ mode: id }})"),
                                       ('selHands', [('both', 'Both hands'), ('rh', 'Right hand'), ('lh', 'Left hand')], f"(({S}.showR ?? 'show') === 'hide' ? 'lh' : ({S}.showL ?? 'show') === 'hide' ? 'rh' : 'both')", f"(id) => ({SET})({{ showR: id === 'lh' ? 'hide' : 'show', showL: id === 'rh' ? 'hide' : 'show' }})"),
                                       ('selKb', [('3d', '3D'), ('2d', '2D'), ('off', 'Off')], f"({S}.keys === false ? 'off' : ({S}.kbStyle ?? '3d'))", f"(id) => ({SET})(id === 'off' ? {{ keys: false }} : {{ keys: true, kbStyle: id }})"),
                                       ('selLab', [('none', 'None'), ('c', 'C only'), ('all', 'All notes')], f"({S}.kbLabels ?? 'c')", f"(id) => ({SET})({{ kbLabels: id }})"),
                                       ('selMidi', [('fp30', 'Roland FP-30X'), ('none', 'None')], f"({S}.midiDev ?? 'fp30')", f"(id) => ({SET})({{ midiDev: id }})"),
                                       ('selSpeed', [(50, '0.5×'), (75, '0.75×'), (100, '1.0×')], f"({S}.speed ?? 100)", f"(id) => ({SET})({{ speed: id }})"),
                                       ('selMet', [('count', 'Count-in'), ('on', 'On'), ('off', 'Off')], f"({S}.metro ? 'on' : ({S}.countBars ?? 1) ? 'count' : 'off')", f"(id) => ({SET})({{ metro: id === 'on', countBars: id === 'off' ? 0 : 1 }})")]))

# The song's versions in the sidebar (owner, 2026-11-26: "in the title are general options and in the sidebar there will
# be the switch like change the versions or add a new version … add a version with this accompaniment. and in such
# version i can just change the accompaniment … for the whole song like we did before"): the versions as rows (the open
# one checked, the default says so), then New version and New version with accompaniment, then the open version's
# acts; one card as the panel's other groups, rows 44
# a version row's text on the column of a settings row (FROW: 12 in, a 24 glyph, 16 apart), so the Versions card and the
# song's acts under it read as one list
_VSLOT = lambda inner='': f'<span aria-hidden="true" style="flex: none; width: 24px; display: flex; justify-content: center; color: {INK}">{inner}</span>'
_VPROW = f'min-height: 52px; box-sizing: border-box; padding: 4px 4px 4px 12px; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 16px; width: 100%; text-align: left; cursor: pointer'
# Inside a card, every control is a row (owner, 2026-11-26: "i dont like these buttons in these cards very much.
# refactor this also"): no loose text buttons under the card and no grey segmented strip inside it. A version's own
# acts sit behind its row's ··· (ui-and-mockups: "a row's own acts sit behind its ···"; Apple HIG, Pull-down buttons;
# Flat's version list), the loss last in red after a hairline; a choice among a few values is the row's value with a
# pop-up of the values (Apple HIG, Pop-up buttons: "a setting in a list, the current value shown"; iOS Settings,
# Flat's Layout panel), never a strip of equal buttons
def VERPANEL():
    mi = lambda lab, act, fg=INK: f'<button type="button" role="menuitem" onClick="{{{{{act}}}}}" style="{_SMROW}; color: {fg}">{_SMSLOT("")}<span style="flex: 1">{lab}</span></button>'
    menu = (f'<sc-if value="{{{{v.menuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{v.menu}}}}" style="position: fixed; inset: 0; z-index: 69"></div>'
            f'<div role="menu" aria-label="{{{{v.name}}}}" style="{_SMBOX}; right: 4px; top: 48px; width: 220px">' + mi('Rename…', 'actRename')
            + '<sc-if value="{{v.canDef}}" hint-placeholder-val="{{true}}">' + mi('Set as default', 'actSetDef') + '</sc-if>'
            + '<sc-if value="{{v.canDel}}" hint-placeholder-val="{{true}}">' + _SMSEP + mi('Delete version', 'actDelVer', RED) + '</sc-if></div></sc-if>')
    vrow = (f'<sc-for list="{{{{verRows}}}}" as="v" hint-placeholder-count="2"><div style="position: relative; display: flex; align-items: center; border-top: 1px solid {{{{v.line}}}}">'
            f'<button type="button" role="radio" aria-checked="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="{_VPROW}; flex: 1; min-width: 0; padding-right: 0">'
            + _VSLOT(f'<sc-if value="{{{{v.cur}}}}" hint-placeholder-val="{{{{false}}}}">{CHECK}</sc-if>')
            + f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column"><span style="font-weight: {{{{v.fw}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{v.name}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{v.sub}}}}</span></span>'
            + f'<sc-if value="{{{{v.isDef}}}}" hint-placeholder-val="{{{{false}}}}"><span style="flex: none; font-size: 13px; color: {SOFT}">Default</span></sc-if></button>'
            + f'<button type="button" aria-label="{{{{v.name}}}}: more" aria-haspopup="menu" aria-expanded="{{{{v.menuX}}}}" onClick="{{{{v.menu}}}}" style="flex: none; width: 44px; height: 44px; margin-right: 4px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center; cursor: pointer">{MORE.replace('width="24" height="24"', 'width="20" height="20"')}</button>'
            + menu + '</div></sc-for>')
    add = lambda lab, act: f'<button type="button" onClick="{{{{{act}}}}}" style="{_VPROW}; min-height: 44px; border-top: 1px solid {LINE}">{_VSLOT(PLUSI_S)}<span style="flex: 1">{lab}</span></button>'
    body = (f'<div role="radiogroup" aria-label="Versions" style="border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}">{vrow}'
            + add('New version', 'actNewVer') + '<sc-if value="{{isLead}}" hint-placeholder-val="{{false}}">' + add('New version with accompaniment', 'actNewAcc') + '</sc-if></div>')
    # the Versions page or panel is titled Versions, so its body stands bare under that title, no fold head repeating it
    return body

# A panel's sections as Flat's (the owner's Flat 26.11 screenshots: Layout's Templates, Pages, Staves, Measures; Audio's
# Room, Playback, Volume): each a fold, its head a 56 row with the section's glyph, its name and a chevron at the right,
# the body under it, a hairline between sections; open by default, the fold remembered per section (state fold). One
# shape for the Song and View panels in Practice and Edit (owner, 2026-11-26: "improve and refactor the song and view
# tabs completely: use best practices and examples")
LAYERSI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m12 2 10 5-10 5L2 7l10-5Z"></path><path d="m2 12 10 5 10-5"></path><path d="m2 17 10 5 10-5"></path></svg>'
PIANOI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M8 4v9M12 4v9M16 4v9M8 13v7M12 13v7M16 13v7"></path></svg>'
EYEI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
SLIDERSI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"></path></svg>'
def FOLD(fid, icon, title, body, extra='', first=False):
    chev = f'<span aria-hidden="true" style="display: flex; color: {SOFT}; transform: rotate({{{{f{fid}R}}}}); transition: transform .2s cubic-bezier(0.22, 1, 0.36, 1)">{CHEV_D}</span>'
    return (f'<section aria-label="{title}" style="flex: none; display: flex; flex-direction: column;' + ('' if first else f' border-top: 1px solid {LINE}') + '">'
            f'<div style="min-height: 56px; display: flex; align-items: center; gap: 4px">'
            f'<button type="button" aria-expanded="{{{{f{fid}X}}}}" onClick="{{{{f{fid}Tg}}}}" style="flex: 1; min-width: 0; height: 56px; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer">'
            f'<span aria-hidden="true" style="flex: none; display: flex; color: {SOFT}">{icon}</span><h3 style="flex: 1; min-width: 0; margin: 0; font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{title}</h3></button>'
            f'{extra}<button type="button" tabindex="-1" aria-hidden="true" onClick="{{{{f{fid}Tg}}}}" style="flex: none; width: 32px; height: 40px; padding: 0; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer">{chev}</button></div>'
            f'<sc-if value="{{{{f{fid}On}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 12px; padding: 0 0 24px">{body}</div></sc-if></section>')
def FOLDKEYS(S, SET, ids):
    """the folds' state for the sections named in ids: f{id}On, f{id}X, f{id}R, f{id}Tg"""
    # the chevron as a disclosure's (Apple HIG, Disclosure controls) and the palette's sections: down while open, right while shut
    return ("...(() => { const F = " + S + ".fold ?? {}; const o = {}; for (const id of " + repr(list(ids)) + ") { const on = F[id] ?? true;"
            " o['f' + id + 'On'] = on; o['f' + id + 'X'] = on ? 'true' : 'false'; o['f' + id + 'R'] = on ? '0deg' : '-90deg';"
            " o['f' + id + 'Tg'] = () => (" + SET + ")({ fold: { ...F, [id]: !on } }); } return o; })(),")
_CARD = f'border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}'
def SWITCHROW(lab, on, act, track, knob, line=True):
    """a switch row as every card's: the label, the switch at the right; the row is the switch"""
    return (f'<button type="button" role="switch" aria-checked="{{{{{on}}}}}" onClick="{{{{{act}}}}}" style="width: 100%; min-height: 44px; box-sizing: border-box; padding: 0 12px; border: 0;'
            + (f' border-top: 1px solid {LINE};' if line else '') + f' background: transparent; color: {INK}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer">'
            f'<span style="flex: 1; min-width: 0">{lab}</span><span aria-hidden="true" style="flex: none; width: 44px; height: 26px; border-radius: 13px; background: {{{{{track}}}}}; position: relative">'
            f'<span style="position: absolute; top: 2px; left: {{{{{knob}}}}}px; width: 22px; height: 22px; border-radius: 11px; background: {SHEET}; box-shadow: 0 1px 3px rgba(51,41,33,.25)"></span></span></button>')
# The View panel (owner, 2026-11-26: "improve and refactor the song and view tabs completely"): the four ways to read
# the song as picture cards (Chordify's "Pick your view", chordify 002, each view with its picture; Flat's Layout
# templates, the chosen one ringed), the chosen one ringed in ink (not filled: one honey act per screen, Play); then
# the chosen view's own options, each a row, a choice of a few values a pop-up (Apple HIG, Pop-up buttons), what shows
# on the page switches in one card. Its state is the board's (views, layout, perRow, text, show, the strips)
_TH = lambda inner: f'<svg viewBox="0 0 120 52" width="100%" height="52" aria-hidden="true" style="display: block; color: {SOFT}">{inner}</svg>'
_THUMBS = {
    'isSheet': _TH(''.join(f'<path d="M10 {y}h100" stroke="currentColor" stroke-width="1" opacity=".55"></path>' for y in (12, 18, 24, 30, 36))
                   + '<ellipse cx="34" cy="27" rx="4" ry="3" fill="currentColor"></ellipse><path d="M38 27V9" stroke="currentColor" stroke-width="1.4"></path>'
                   + '<ellipse cx="58" cy="21" rx="4" ry="3" fill="currentColor"></ellipse><path d="M62 21V5" stroke="currentColor" stroke-width="1.4"></path>'
                   + '<ellipse cx="82" cy="30" rx="4" ry="3" fill="currentColor"></ellipse><path d="M86 30V13" stroke="currentColor" stroke-width="1.4"></path><path d="M100 12v24" stroke="currentColor" stroke-width="1.2"></path>'),
    'isDia': _TH('<rect x="12" y="8" width="44" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.2"></rect>'
                 + ''.join(f'<rect x="{17 + i * 7}" y="8" width="4" height="17" fill="currentColor"></rect>' for i in (0, 1, 3, 4, 5))
                 + '<rect x="64" y="8" width="44" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.2"></rect>'
                 + ''.join(f'<rect x="{69 + i * 7}" y="8" width="4" height="17" fill="currentColor"></rect>' for i in (0, 1, 3, 4, 5))
                 + '<text x="34" y="50" font-size="10" font-weight="600" text-anchor="middle" fill="currentColor">G</text><text x="86" y="50" font-size="10" font-weight="600" text-anchor="middle" fill="currentColor">C</text>'),
    'isGrid': _TH(''.join(f'<rect x="{10 + c * 26}" y="{6 + r * 22}" width="22" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.1"></rect>' for r in (0, 1) for c in range(4))
                  + ''.join(f'<text x="{21 + c * 26}" y="{19 + r * 22}" font-size="9" font-weight="600" text-anchor="middle" fill="currentColor">{ch}</text>' for (r, c), ch in zip([(0, 0), (0, 1), (0, 2), (0, 3), (1, 0), (1, 1), (1, 2), (1, 3)], 'GGCGGGDD')) ),
    'isLyr': _TH(''.join(f'<text x="{x}" y="{y}" font-size="8" font-weight="700" fill="currentColor">{ch}</text>' for x, y, ch in ((12, 12, 'G'), (52, 12, 'C'), (88, 12, 'G'), (20, 34, 'D'), (70, 34, 'G')))
                 + '<rect x="12" y="16" width="96" height="5" rx="2.5" fill="currentColor" opacity=".55"></rect><rect x="12" y="38" width="76" height="5" rx="2.5" fill="currentColor" opacity=".55"></rect>'),
}
VIEWI = _LI('<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 13h8M8 16h5"></path>')
# links=True: a card that is another board (v.isAway) is a link to v.href, the view kept in the same mode
# inset=False where the panel's own section already holds the 16 gutter (the Player's), so the body sits on the head's edge
def VIEWPANEL(links=False, inset=True):
    thumbs = ''.join(f'<sc-if value="{{{{v.{k}}}}}" hint-placeholder-val="{{{{false}}}}">{svg}</sc-if>' for k, svg in _THUMBS.items())
    cards = (f'<div role="radiogroup" aria-label="View" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">'
             f'<sc-for list="{{{{viewCards}}}}" as="v" hint-placeholder-count="4"><button type="button" role="radio" aria-checked="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" '
             f'style="min-height: 96px; box-sizing: border-box; padding: 10px 10px 8px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: {{{{v.ring}}}}; color: {INK}; font: inherit; display: flex; flex-direction: column; gap: 6px; cursor: pointer">'
             f'{thumbs}<span style="font-size: 15px; font-weight: {{{{v.fw}}}}; text-align: left">{{{{v.label}}}}</span></button></sc-for></div>')
    if links:
        # a card that leaves the board is a link to the board of that view in the same mode (the editor's Diagrams, Grid,
        # Lyrics; from those, the editor's Sheet)
        b0 = cards.index('<button type="button" role="radio"'); b1 = cards.index('</button>', b0) + len('</button>'); btn = cards[b0:b1]
        a = (btn.replace('<button type="button" role="radio" aria-checked="{{v.on}}" onClick="{{v.pick}}"', '<a href="{{v.href}}"', 1)[:-len('</button>')] + '</a>').replace('border: 0;', 'border: 0; text-decoration: none;', 1)
        cards = cards[:b0] + '<sc-if value="{{v.isHere}}" hint-placeholder-val="{{true}}">' + btn + '</sc-if><sc-if value="{{v.isAway}}" hint-placeholder-val="{{false}}">' + a + '</sc-if>' + cards[b1:]
    segh = lambda lab, name: (f'<div style="display: flex; flex-direction: column; gap: 8px"><h4 style="margin: 0; font-size: 13px; font-weight: 600; color: {SOFT}">{lab}</h4>'
                              + SEGC(name + 'Seg', 36, 14, True) + '</div>')
    sheet = (segh('Layout', 'selLayout') +
             f'<div style="display: flex; flex-direction: column; gap: 8px"><h4 style="margin: 0; font-size: 13px; font-weight: 600; color: {SOFT}">On the page</h4><div style="{_CARD}">'
             f'<sc-for list="{{{{showChips}}}}" as="c" hint-placeholder-count="6">' + SWITCHROW('{{c.name}}', 'c.on', 'c.pick', 'c.track', 'c.knob').replace(f'border-top: 1px solid {LINE};', 'border-top: {{c.sep}};') + '</sc-for></div></div>')
    dia = f'<div style="{_CARD}">' + SWITCHROW('Beat strip', 'dStripSw.on', 'dStripSw.flip', 'dStripSw.track', 'dStripSw.knob', False) + SWITCHROW('Lyrics line', 'dLineSw.on', 'dLineSw.flip', 'dLineSw.track', 'dLineSw.knob') + '</div>'
    grid = segh('Bars per row', 'selPerRow')
    lyr = (segh('Text size', 'selText') + f'<div style="{_CARD}">' + SWITCHROW('Chord diagrams', 'lSumSw.on', 'lSumSw.flip', 'lSumSw.track', 'lSumSw.knob', False)
           + SWITCHROW('Beat strip', 'lStripSw.on', 'lStripSw.flip', 'lStripSw.track', 'lStripSw.knob') + '</div>')
    opts = ''.join(f'<sc-if value="{{{{{k}}}}}" hint-placeholder-val="{{{{{d}}}}}">{b}</sc-if>' for k, d, b in (('isSheet', 'true', sheet), ('isDiagrams', 'false', dia), ('isGrid', 'false', grid), ('isLyrics', 'false', lyr)))
    return (f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 {16 if inset else 0}px; display: flex; flex-direction: column">'
            + FOLD('View', EYEI, 'Views', cards, first=True) + FOLD('Opts', SLIDERSI, '{{viewName}} options', opts) + '</div>')
def SELFROM(S, SET, name, expr):
    """a pop-up row's keys (SELROW) from a list of {name, on, pick}, the board's own choices"""
    return (f"...((L) => ({{ {name}V: (L.find((o) => o.on === 'true') || {{ name: '' }}).name, {name}On: {S}.selPop === '{name}', {name}X: {S}.selPop === '{name}' ? 'true' : 'false', {name}Bg: {S}.selPop === '{name}' ? '#EEE9E2' : 'transparent', "
            f"{name}Seg: L.map((o) => ({{ l: o.name, on: o.on, bg: o.on === 'true' ? '#FEFDFB' : 'transparent', sh: o.on === 'true' ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: o.on === 'true' ? 600 : 500, pick: o.pick }})), "
            f"{name}Tg: () => ({SET})({{ selPop: {S}.selPop === '{name}' ? null : '{name}' }}), {name}Opts: L.map((o) => ({{ l: o.name, cur: o.on === 'true', on: o.on, pick: () => {{ o.pick(); ({SET})({{ selPop: null }}); }} }})) }}))({expr}),")

# a setting's row with its value and a pop-up of the values (Apple HIG, Pop-up buttons): the label at the left, the
# value and ⌃⌄ at the right, the list of values under it with the current one checked; keys {name}V, {name}On,
# {name}Tg and {name}Opts (each l, on, pick), from SELKEYS
CHEV_UD = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m7 15 5 5 5-5M7 9l5-5 5 5"></path></svg>'
def SELROW(label, name, line=True):
    return (f'<div style="position: relative; min-height: 44px; display: flex; align-items: center; gap: 12px; padding: 0 4px 0 12px;' + (f' border-top: 1px solid {LINE}' if line else '') + '">'
            f'<span style="flex: 1; min-width: 0; font-size: 15px">{label}</span>'
            f'<button type="button" aria-haspopup="listbox" aria-expanded="{{{{{name}X}}}}" aria-label="{label}: {{{{{name}V}}}}" onClick="{{{{{name}Tg}}}}" style="flex: none; height: 40px; padding: 0 8px 0 10px; border: 0; border-radius: 8px; background: {{{{{name}Bg}}}}; color: {INK}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 4px; cursor: pointer">{{{{{name}V}}}}<span aria-hidden="true" style="display: flex; color: {SOFT}">{CHEV_UD}</span></button>'
            f'<sc-if value="{{{{{name}On}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{{name}Tg}}}}" style="position: fixed; inset: 0; z-index: 69"></div><div role="listbox" aria-label="{label}" style="{_SMBOX}; right: 4px; top: 42px; width: 200px">'
            f'<sc-for list="{{{{{name}Opts}}}}" as="o" hint-placeholder-count="3"><button type="button" role="option" aria-selected="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="{_SMROW}">{_SMSLOT(f"<sc-if value=\"{{{{o.cur}}}}\" hint-placeholder-val=\"{{{{false}}}}\">{CHECK}</sc-if>")}<span style="flex: 1">{{{{o.l}}}}</span></button></sc-for></div></sc-if></div>')
def SELKEYS(S, SET, specs):
    """specs: (name, [(id, label)], current expr, pick expr taking id): one pop-up open at a time (state selPop)."""
    out = []
    for name, opts, cur, pick in specs:
        L = repr([list(x) for x in opts])
        out.append(f"...((c) => ({{ {name}V: ({L}.find((o) => o[0] === c) || [0, ''])[1], {name}On: {S}.selPop === '{name}', {name}X: {S}.selPop === '{name}' ? 'true' : 'false', {name}Bg: {S}.selPop === '{name}' ? '#EEE9E2' : 'transparent', "
                   f"{name}Tg: () => {SET}({{ selPop: {S}.selPop === '{name}' ? null : '{name}' }}), {name}Opts: {L}.map(([id, l]) => ({{ l, cur: id === c, on: id === c ? 'true' : 'false', pick: () => {{ ({pick})(id); {SET}({{ selPop: null }}); }} }})) }}))({cur}),")
    return ' '.join(out)

# the whole-song accompaniment as the editor shows it (owner, 2026-11-26: "the accompaniment version should be shown as
# disabled and said that this can only be changed in the player"): the same card, its rows read-only at half strength
# (disabled: 50%, craft-details 6), and the head says where it is changed, a link to Practice; the editor writes a
# pattern into chosen bars from its Notation panel instead
# The accompaniment, one control, in the editor's Notation alone (owner, 2026-11-26: "i dont like that we have two
# different controls to add a accompaniment: they should be the same … remove the accompaniment settings from the player
# and move to only to the notation. only there will they be. and they should be like the players ones"): the Player's
# rows, not the editor's old list of patterns. Where it writes heads it (the bar chosen on the score, its phrase, or the
# whole song: Band-in-a-Box's style per bar range; Flat and Dorico select on the score, then the panel acts), then one
# card: Pattern › with the pattern's name (its library docks in the panel's place with Back, as Flat's panel pages),
# First chord's inversion and Voicing as pop-ups, and, once the scope has its own, the way back to the wider one's.
# Keys: isPiano, accScopes, patternName, openPattern, selInv, selVoice, accOwn, accResetL, accReset, the fold's (Acc)
def ACCPANEL(first=True):
    link = (f'<button type="button" onClick="{{{{openPattern}}}}" style="min-height: 44px; box-sizing: border-box; padding: 0 12px; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; cursor: pointer">'
            f'<span style="flex: 1">Pattern</span><span style="display: flex; align-items: center; gap: 4px; min-width: 0; color: {SOFT}"><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{patternName}}}}</span><span style="display: flex">{CHEV_R}</span></span></button>')
    reset = (f'<sc-if value="{{{{accOwn}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{accReset}}}}" style="min-height: 44px; box-sizing: border-box; padding: 0 12px; border: 0; border-top: 1px solid {LINE}; background: transparent; color: #356890; font: inherit; font-size: 15px; width: 100%; text-align: left; cursor: pointer">{{{{accResetL}}}}</button></sc-if>')
    body = SEGC('accScopes', 36, 14, True) + f'<div style="{_CARD}">' + link + SELROW('First chord’s inversion', 'selInv') + SELROW('Voicing', 'selVoice') + reset + '</div>'
    return '<sc-if value="{{isPiano}}" hint-placeholder-val="{{true}}">' + FOLD('Acc', PIANOI, 'Accompaniment', body, first=first) + '</sc-if>'

# the editor's Edit row on a phone (Flat's second row, 018): Delete, Undo, Redo, Copy, Cut, Paste as soft-ink glyphs spread
# across the width, a soft shadow under it; one implementation for the editor and the Player's views in Edit
DELI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M21 5H9l-7 7 7 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"></path><path d="m17 9-6 6M11 9l6 6"></path></svg>'
COPYI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><rect x="8" y="8" width="13" height="13" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>'
CUTI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"></path></svg>'
PASTEI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><rect x="8" y="2" width="8" height="4" rx="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>'
TBTN = lambda lab, svg, act, tip, dis=None, col=INK: (f'<button type="button" aria-label="{lab}" data-tip="{tip}"' + (f' aria-disabled="{{{{{dis}}}}}"' if dis else '') +
    f' onClick="{{{{{act}}}}}" style="flex: none; position: relative; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 12px; background: transparent; color: {col}; display: flex; align-items: center; justify-content: center">{svg}</button>')
# a disabled act at half strength, no pointer (craft-details, Instructions 6): Undo with nothing done, Redo with nothing undone
DISABLED_CSS = '<style data-dis>[aria-disabled="true"] { opacity: .5; cursor: default; pointer-events: none }</style>'
ACTS_P = (DISABLED_CSS + f'<div role="toolbar" aria-label="Edit" style="flex: none; position: relative; z-index: 19; height: 56px; box-sizing: border-box; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; background: {SHEET}; color: {SOFT}; box-shadow: 0 2px 6px rgba(51,41,33,.08)">'
          + TBTN('Delete', DELI, 'delNote', 'Delete', col=SOFT) + TBTN('Undo', UNDO, 'undo', 'Undo', 'undoDis', col=SOFT) + TBTN('Redo', REDO, 'redo', 'Redo', 'redoDis', col=SOFT) + TBTN('Copy', COPYI, 'copied', 'Copy', col=SOFT) + TBTN('Cut', CUTI, 'cut', 'Cut', col=SOFT) + TBTN('Paste', PASTEI, 'pasted', 'Paste', col=SOFT) + '</div>')
# the laptop toolbar's acts on what is chosen (the editor's, and the Player's views in Edit): Delete | Undo Redo | Copy Cut Paste
TSEP = f'<span aria-hidden="true" style="flex: none; width: 1px; height: 24px; margin: 0 4px; background: {LINE}"></span>'
CLIP = TBTN('Delete', DELI, 'delNote', 'Delete · ⌫') + TSEP + TBTN('Undo', UNDO, 'undo', 'Undo · ⌘Z', 'undoDis') + TBTN('Redo', REDO, 'redo', 'Redo · ⇧⌘Z', 'redoDis') + TSEP + TBTN('Copy', COPYI, 'copied', 'Copy · ⌘C') + TBTN('Cut', CUTI, 'cut', 'Cut · ⌘X') + TBTN('Paste', PASTEI, 'pasted', 'Paste · ⌘V')
