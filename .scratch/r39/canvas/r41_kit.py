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
# the song's name (what is on the stand: Accompaniment, Arrangement where one is written, Your arrangement), and Edit is
# its own glass button at the bar's trailing end (Apple HIG: Edit trails; Flat's Edit stands apart from the title), the
# same place in Play and in Edit, pressed on the sand wash while editing; a tap there goes back to playing. A choice of
# what to read and a mode switch are two acts, so they are two controls. The menu is a native disclosure.
PENI = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="M21.17 6.81a1 1 0 0 0-3.99-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"></path></svg>'
VERSIONS = (('Accompaniment', 'From the chords · Bass + chords', 'Player'), ('Arrangement', 'None written for this song yet', ''), ('Your arrangement', 'Write your own, from this accompaniment', 'Editor'))
def VERSW(on, other_href, label=None):
    sfx = 'Laptop.dc.html' if 'Laptop' in other_href else '.dc.html'
    shown = label or ('Accompaniment' if on == 'play' else 'Your arrangement')
    rows = []
    for name, sub, board in VERSIONS:
        cur = name == shown
        st = f'width: 100%; min-height: 56px; box-sizing: border-box; padding: 8px 12px; border-radius: 10px; display: flex; align-items: center; gap: 12px; text-decoration: none; color: {INK if board or cur else SOFT}'
        body = (f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: {600 if cur else 500}">{name}</span>'
                f'<span style="font-size: 13px; color: {SOFT}">{sub}</span></span><span style="flex: none; width: 16px; display: flex; color: {INK}">{CHECK if cur else ""}</span>')
        if cur or not board:
            rows.append(f'<span role="menuitemradio" aria-checked="{"true" if cur else "false"}" aria-disabled="{"false" if cur else "true"}" style="{st}">{body}</span>')
        else:
            rows.append(f'<a role="menuitemradio" aria-checked="false" href="{board}{sfx}" style="{st}">{body}</a>')
    menu = (f'<div role="menu" aria-label="Versions" style="position: absolute; z-index: 61; top: 52px; left: 0; width: 320px; box-sizing: border-box; padding: 6px; border-radius: 16px; background: {PAGE}; box-shadow: 0 0 0 1px {LINE}, {FLOAT}; display: flex; flex-direction: column; text-align: left; font-weight: 400">{"".join(rows)}</div>')
    summary = (f'<summary aria-label="Version: {shown}" data-tip="Versions" style="list-style: none; height: 44px; box-sizing: border-box; padding: 0 12px 0 16px; display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 15px; font-weight: 600; color: {INK}; white-space: nowrap">'
               f'{shown}<span aria-hidden="true" style="display: flex; color: {SOFT}">{CHEV_D}</span></summary>')
    return (f'<div role="group" aria-label="Version" style="flex: none; position: relative; border-radius: 22px; {GLASSFX}; pointer-events: auto">'
            f'<style>details.vsw > summary::-webkit-details-marker {{ display: none }}</style><details class="vsw" style="position: relative">{summary}{menu}</details></div>')
def EDITB(on, other_href):
    edit = on == 'edit'
    tip = 'Stop editing · E' if edit else 'Edit · E'
    look = 'background: #E8DFD3; box-shadow: 0 0 0 1px ' + LINE if edit else GLASSFX
    st = f'flex: none; height: 44px; box-sizing: border-box; border-radius: 22px; {look}; color: {INK}; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 15px; font-weight: 500; text-decoration: none; white-space: nowrap; position: relative; pointer-events: auto'
    # a phone's bar has no room for the word: the pencil alone, named in its tip
    if 'Laptop' in other_href:
        return f'<a href="{other_href}" aria-label="Edit" aria-pressed="{"true" if edit else "false"}" data-tip="{tip}" style="{st}; padding: 0 16px 0 12px">{PENI}Edit</a>'
    return f'<a href="{other_href}" aria-label="Edit" aria-pressed="{"true" if edit else "false"}" data-tip="{tip}" style="{st}; width: 44px">{PENI}</a>'
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
def _BSHEET(cond, title, body, done='Done'):
    return f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><style>[role=dialog].nos > * {{ flex-shrink: 0 }}</style><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.32)"></div><section role="dialog" aria-modal="true" aria-label="{title}" style="position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0; background: {PAGE}; padding: 6px 16px 40px; display: flex; flex-direction: column; gap: 16px" class="nos"><div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div><div style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 36px"><span style="font-size: 17px; font-weight: 600">{title}</span><button type="button" onClick="{{{{closeSheet}}}}" style="position: absolute; right: 0; height: 44px; padding: 0 4px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 17px; font-weight: 600">{done}</button></div>{body}</section></sc-if>'
def BSHEET(cond, title, body, done='Done', tall=False, back='', maxh=''):
    # back: a sub-page's Back before its title; maxh: a cap other than 86% (a sheet over a bar that stays in reach)
    # done=None: a sheet whose foot closes it (Sort and filter's Show n) carries no second way out in its head;
    # tall: a sheet that keeps its full height while its list changes (Search, a chord type's list)
    t = _BSHEET(cond, title, body, done or '')
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
def A4PAGE(credit='', sel=(3, 0)):
    cw = PG_W - 2 * PG_M
    return (f'<article aria-label="Page 1" style="flex: none; position: relative; width: {PG_W}px; height: {PG_H}px; box-sizing: border-box; padding: {PG_M}px {PG_M}px 0; background: {SHEET}; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 2px 4px rgba(51,41,33,.06), 0 12px 32px -16px rgba(51,41,33,.28); display: flex; flex-direction: column">'
            f'<h2 style="margin: 0; text-align: center; font-family: {SERIF}; font-size: 30px; font-weight: 400; line-height: 1.1; color: {INK}">Amazing Grace</h2>'
            f'<div style="margin: 20px 0 0; display: flex; justify-content: space-between; gap: 24px; font-family: {SERIF}; font-size: 13px; color: {INK}"><span>Words: John Newton</span><span style="text-align: right">Music: New Britain (American folk tune)' + (f'<br><i style="color: {SOFT}">{credit}</i>' if credit else '') + f'</span></div>'
            f'<div style="margin: 16px 0 0; font-family: {SERIF}; font-size: 13px; font-weight: 700; color: {INK}">Verse <span style="font-weight: 400"><svg role="img" aria-label="quarter note" viewBox="0 0 8 16" width="7" height="14" style="vertical-align: -2px"><ellipse cx="3.4" cy="13" rx="3.3" ry="2.3" transform="rotate(-20 3.4 13)" fill="{INK}"/><rect x="5.8" y="0" width="1" height="12.6" fill="{INK}"/></svg> = 80</span></div>'
            f'<div style="margin: -8px 0 0">' + score_grand(cw / PG_K, [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], sel=sel, size=1.0).replace(ACCENT, '#85B8DC') + '</div>'
            f'<p style="position: absolute; left: 0; right: 0; bottom: 32px; margin: 0; text-align: center; font-family: {SERIF}; font-size: 11px; color: {SOFT}">Public domain</p></article>')

# A page over a full-screen screen (the editor's Credits; owner, 2026-11-26: "it should open properly on a proper page
# this credits like in the flat"; "why the credits are still a popup and not a proper page"): the whole screen, its
# own bar (Back, the title), the form in one centred column; never a popover, a sheet or a window (Flat's Credits, 087)
def THINGPAGE(on, close, title, body, lap):
    pad = '24px' if lap else '16px'
    return (f'<sc-if value="{{{{{on}}}}}" hint-placeholder-val="{{{{false}}}}"><section role="dialog" aria-modal="true" aria-label="{title}" style="position: absolute; inset: 0; z-index: 61; background: {PAGE}; color: {INK}; display: flex; flex-direction: column">'
            f'<header style="flex: none; height: {72 if lap else 60}px; margin-top: {0 if lap else 62}px; box-sizing: border-box; padding: 8px {pad}; display: grid; grid-template-columns: minmax(44px, 1fr) auto minmax(44px, 1fr); align-items: center">'
            f'<button type="button" onClick="{{{{{close}}}}}" aria-label="Back" data-tip="Back · Esc" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; cursor: pointer">{CHEV_L}</button>'
            f'<h1 style="margin: 0; font-size: 17px; font-weight: 600">{title}</h1><span></span></header>'
            f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px {pad} 48px"><div style="width: min(560px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 16px">{body}</div></main></section></sc-if>')
