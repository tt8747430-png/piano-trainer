# R74 (owner, 2026-11-26): the Player says plainly that it shows an accompaniment made from the chords, opens on it
# (almost every song has only that), and its bar holds the version (VERSW: Accompaniment or Score) beside the name,
# and Edit (EDITB) beside it only while the version is the Score (owner: "the edit button belongs only to the score view"). Its one input is player/base (the Player pair as built before R74);
# it writes practice/project, so it runs any number of times. The Player's earlier builders are gone.
import re, pathlib, sys; sys.path.insert(0, "/home/user/piano-trainer/.scratch/r39/canvas")
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/calm_kit.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_kit.py').read())
OUT = pathlib.Path('/home/user/piano-trainer/.scratch/r39/canvas/practice/project')
BASE = pathlib.Path('/home/user/piano-trainer/.scratch/r39/canvas/player/base')  # the Player pair as built before R74; the one input
OLDSW = re.compile(r'<div role="radiogroup" aria-label="Mode" style="display: flex; border-radius: 22px;.*?</div>', re.S)
CHEVR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'

# The laptop Player as the editor: a rail and one panel (owner, 2026-11-26: "i dont like that all that we have in the
# player is hidden in the settings. like make the player like the editor with its sidebard"; "we added a easier way to
# switch between the versions … and we stil have this in the settings"; "concentrate on the laptop version"). The rail's
# entries are the song's own settings (Song: the accompaniment's Pattern, inversion and voicing, Transpose, Sections) and
# the view's (View: what the Sheet, Diagrams, Grid or Lyrics show); each opens its panel at the left, beside the music,
# open on Song when the song opens; the active entry again folds it, as the editor's. The version is the bar's alone
# (no Arrangement here); the song's acts (Settings, Print, Export, Share link)
# are the name's menu, as the editor's title; the gear is gone, its jobs the rail's.
PANEL = 'position: absolute; z-index: 30; left: 76px; top: 64px; bottom: 0; width: 352px; padding: 0 16px 24px; border-radius: 0; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #FEFDFB; box-shadow: inset -1px 0 0 ' + LINE
def _sect(t, label):
    d = t.index(f'role="dialog" aria-label="{label}"'); a = t.rindex('<section', 0, d); depth = 0
    for m in re.finditer(r'<(/?)section\b', t[a:]):
        depth += -1 if m.group(1) else 1
        if depth == 0: return a, a + m.end()
_NAMES = {}
def _dock(t, label, head=None, name=None):
    # a docked panel is the editor's: an aside, a tabpanel named for the panel on show (one implementation)
    a, b = _sect(t, label); h = t[a:b]
    h = re.sub(r'style="[^"]*"', f'style="{PANEL}"', h, count=1).replace('role="dialog"', 'role="tabpanel"', 1)
    _NAMES[label] = name
    h = '<aside' + h[len('<section'):-len('</section')] + '</aside'
    h = re.sub(r'<div aria-hidden="true" style="display: \{\{sheetGrab\}\};[^"]*"></div>', '', h, count=1)
    if head: h = h.replace('>', '>' + head, 1)
    return t[:a] + h + t[b:]
def player_rail(t):
    head = lambda name: _PHEAD(name).replace('padding: 0 8px 0 16px', 'margin: 0 -16px; padding: 0 8px 0 16px')
    # Song: the Settings card docked; its header row's acts go to the name's menu; the version choice goes
    a, b = _sect(t, 'Settings'); h = t[a:b]
    acts = re.search(r'<sc-if value="\{\{songActsShow\}\}".*?</sc-if>', h, re.S).group(0)
    r0 = h.index('<div style="flex: none; position: relative; display: flex; flex-wrap: wrap;'); r1 = h.index('<div role="radiogroup" aria-label="Score"')
    h = h[:r0] + h[r1:]
    # the accompaniment leaves the Player for the editor's Notation (owner, 2026-11-26: "remove the accompaniment settings
    # from the player and move to only to the notation. only there will they be"): the Song panel holds the versions
    # alone; the cut runs from the old Score choice through the old Transpose and Sections card
    g0 = h.index('<div role="radiogroup" aria-label="Score"')
    g1 = h.index('</div>', h.index('<a href="SectionLaptop.dc.html"', g0)) + len('</div>')
    h = h[:g0] + h[g1:]
    t = t[:a] + h + t[b:]
    t = _dock(t, 'Settings', head('Versions'), 'Versions')
    # the versions head the Song panel: the sidebar holds the switch and the new versions; the title, the song's acts
    i = t.index('</header>', t.index('>Versions</h2>')) + len('</header>')
    t = t[:i] + '<div style="padding-top: 12px">' + VERPANEL() + '</div>' + t[i:]
    t = t.replace('<sc-if value="{{isMore}}"', '<sc-if value="{{panelSong}}"', 1)
    # the Song panel's own pages dock in its place, each with its Back
    # its Pattern page and Sort and filter go with it: they are the editor's Notation panel's now
    for lab in ('Pattern', 'Sort and filter'):
        a, b = _sect(t, lab); t = t[:a] + t[b:]
    # View: the view's settings docked, headed by the view's name
    a, b = _sect(t, '{{viewName}} settings'); h = t[a:b]
    h = re.sub(r'<h2[^>]*>\{\{viewName\}\}</h2>', '', h, count=1); t = t[:a] + h + t[b:]
    t = _dock(t, '{{viewName}} settings', head('View'), 'View')
    # the view choice leaves the bar's end for the View panel's head, as Chordify's "Pick your view" (chordify 002): the
    # views as cards, the chosen one's settings under them (owner, 2026-11-26: "the switch between the view sheet or
    # diagramms … in the right … doesnt make so much sense"); the bar keeps the song and its version alone
    n0 = t.index('<nav aria-label="View"'); n1 = t.index('</nav>', n0) + 6; nav = t[n0:n1]
    wait = re.search(r'<sc-if value="\{\{waitNoPiano\}\}".*?</sc-if>', nav, re.S).group(0)
    t = t[:n0] + wait + t[n1:]
    cards = ('<div role="radiogroup" aria-label="View" style="flex: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 4px 0 4px">'
             '<sc-for list="{{views}}" as="v" hint-placeholder-count="4"><button type="button" role="radio" aria-checked="{{v.on}}" title="{{v.hint}}" onClick="{{v.pick}}" '
             'style="height: 56px; box-sizing: border-box; border: 0; border-radius: 12px; background: {{v.bg}}; color: {{v.fg}}; box-shadow: 0 0 0 1px rgba(51,41,33,.07); font: inherit; font-size: 15px; font-weight: {{v.fw}}; cursor: pointer">{{v.label}}</button></sc-for></div>')
    i = t.index('aria-label="{{viewName}} settings"'); h = t.index('</header>', i) + len('</header>')
    # the whole View panel rebuilt from the kit (owner, 2026-11-26: "improve and refactor the song and view tabs
    # completely"): the views as picture cards, then the chosen view's options as rows, each section a fold
    e = t.index('</aside>', h); t = t[:h] + VIEWPANEL(links=True, inset=False) + t[e:]
    t = t.replace('aria-label="{{viewName}} settings"', 'aria-label="View"', 1)
    vk = ("viewCards: VIEWS.map(([id, name]) => { const on = id === view; return { label: name, on: on ? 'true' : 'false', ring: on ? 'inset 0 0 0 2px #332921' : 'inset 0 0 0 1px #DAD1C8', fw: on ? 600 : 500, "
          "isSheet: id === 'sheet', isDia: id === 'diagrams', isGrid: id === 'grid', isLyr: id === 'lyrics', ...viewPress(id) }; }), "
          + FOLDKEYS('s', '(o) => this.setState(o)', ['Ver', 'Acc', 'View', 'Opts', 'Room', 'Vol', 'Parts']) + ' '
          + SELFROM('s', '(o) => this.setState(o)', 'selLayout', "lopt('layout', layout, [['page', 'Page'], ['panorama', 'Panorama']])") + ' '
          + SELFROM('s', '(o) => this.setState(o)', 'selPerRow', "lopt('perRow', perRow, [4, 8].map((n) => [n, n + ' bars']))") + ' '
          + SELFROM('s', '(o) => this.setState(o)', 'selText', "lopt('text', s.text ?? 'm', [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']])") + ' ')
    assert t.count('views: VIEWS.map(') == 1
    t = t.replace('views: VIEWS.map(', vk + 'views: VIEWS.map(', 1)
    i = t.index('<aside role="tabpanel" aria-label="View"'); j = t.rindex('<sc-if value="{{isView}}"', 0, i)
    t = t[:j] + '<sc-if value="{{panelView}}"' + t[j + len('<sc-if value="{{isView}}"'):]
    # the keys centred in the room beside the panel (their left was set for the whole window)
    assert t.count('kbLeft: 305,') == 1
    t = t.replace('kbLeft: 305,', "kbLeft: ((s.rail ?? 'song') === 'none' ? 76 : 428) + Math.round((1710 - ((s.rail ?? 'song') === 'none' ? 76 : 428) - KB.w) / 2),", 1)
    # a view's music ends 16 above the keys when they show (it ended at the transport's line, under the keys' band)
    assert t.count('const KB_VALS = {\nareaTop: 0,') == 1
    t = t.replace('const KB_VALS = {\nareaTop: 0,', 'const KB_VALS = {\nareaTop: 0, viewBottom: keys ? 904 - (800 - bandH) + 16 : DEV.bottom,', 1)
    # the rail, under the bar, at the window's left edge
    rail = (f'<nav aria-label="Panels" style="position: absolute; z-index: 31; left: 0; top: 64px; bottom: 0; width: 76px; padding: 0 0 12px; box-sizing: border-box; background: #F7F3EE; box-shadow: inset -1px 0 0 {LINE}; display: flex; flex-direction: column; gap: 4px">'
            f'<div role="tablist" aria-orientation="vertical" aria-label="Panels" onKeyDown="{{{{railKeys}}}}" style="display: flex; flex-direction: column; gap: 4px">' + _RAILBTN('Versions', LAYERSI, 'Song', 'Versions') + _RAILBTN('View', VIEWI, 'View', 'View') + _RAILBTN('Audio', AUDIOI, 'Aud', 'Audio') + '</div>'
            # Flat's rail actions at its foot, the editor's too (FLAT_UI_SHELL_AND_MOTION §1.2): the Player's acts and keys
            + '<span style="flex: 1"></span>' + _RAILBTN('Search', SEARCHI, 'Srch', 'Search for an act · ⌘K', 'openSearch') + _RAILBTN('Shortcuts', KBDI, 'Keys', 'Shortcuts · ?', 'openKeys') + '</nav>')
    rail = rail + SEARCHCARD_F(((PLAY.replace('width="22" height="22"', 'width="20" height="20"'), 'Play', 'Space'), (LOOP, 'Loop', 'L'), (FICONS['Tr'], 'Transpose', 'T'), (FICONS['Mode'], 'Mode', ''), (FICONS['Hands'], 'Hands', '')))
    rail = rail + KEYSCARD_F(((('Playback', (('Play or stop', 'Space'), ('Go to start', '⌃Space'), ('Loop', 'L'))),), (('View', (('Practice or Edit', 'P E'), ('Piano keys', 'K'), ('Transpose', 'T'))),), (('Panels', (('Search', '⌘K'), ('Shortcuts', '?'))),)), 840)
    # Audio, Flat's panel (the kit's AUDPANEL, the editor's too): the room and each part's level, the mixer's home
    # after the rail in the tree, as the Song and View panels sit beside it (before it, the band read as the group it closed)
    rail = rail + (f'<sc-if value="{{{{panelAud}}}}" hint-placeholder-val="{{{{false}}}}"><aside role="tabpanel" aria-label="Audio" style="{PANEL}">' + head('Audio') + AUDPANEL() + '</aside></sc-if>')
    e = t.index('</header>', t.index('aria-label="Mode"')) + len('</header>')
    t = t[:e] + rail + t[e:]
    # the bar: the name is the song's menu (its acts), the gear goes
    gear = re.search(r'<div[^>]*><button type="button" aria-label="Settings" data-tip="Settings" aria-expanded="\{\{isMore\}\}".*?</button></div>', t, re.S)
    t = t.replace(gear.group(0), '', 1)
    t = t.replace('</main>', TOAST(104, 'songUndo', z=60, laptop=True) + '</main>', 1)
    # the bar's title is the kit's SONGMENU, the same in Practice and Edit (set where the bar is built)
    # the music and the transport stand beside the panel
    t = t.replace('<main style="position: absolute; left: 0; right: 0; top: {{areaTop}}px;', '<main style="position: absolute; left: {{panelPad}}px; right: 0; top: {{areaTop}}px;', 1)
    t = t.replace('<div role="toolbar" aria-label="Transport" style="position: absolute; z-index: 40; left: 0;', '<div role="toolbar" aria-label="Transport" style="position: absolute; z-index: 40; left: {{panelPad}}px;', 1)
    # the script: the rail's state, apart from the popovers' (Play closes a popover, never the panel)
    keys = ("isMore: open === 'settings', rail: s.rail ?? 'song', "
            "searchOn: s.sheet === 'search', keysOn2: s.sheet === 'keys', openSearch: () => this.setState({ sheet: 'search', open: 'none' }), openKeys: () => this.setState({ sheet: 'keys', open: 'none' }), closeSheet: () => this.setState({ sheet: null }), railSrchBg: 'transparent', railSrchW: 500, railKeysBg: 'transparent', railKeysW: 500, "
            "panelSong: (s.rail ?? 'song') === 'song' && !['pattern', 'patfilter', 'key'].includes(open), panelView: (s.rail ?? 'song') === 'view', "
            "panelPad: (s.rail ?? 'song') === 'none' ? 76 : 428, "
                        "toastOn: !!s.sTo, toastT: s.sTo || '', toastUndo: !!s.sUndo, songUndo: () => this.setState({ sTo: '', sUndo: false, ...(s.undoVer || {}), undoVer: null }), "
            "foldPanel: () => this.setState({ rail: 'none', open: 'none' }), "
            "pickSong: () => this.setState({ rail: (s.rail ?? 'song') === 'song' ? 'none' : 'song', open: 'none' }), pickView: () => this.setState({ rail: (s.rail ?? 'song') === 'view' ? 'none' : 'view', open: 'none' }), "
            "railSongOn: (s.rail ?? 'song') === 'song' ? 'true' : 'false', railSongBg: (s.rail ?? 'song') === 'song' ? '#F6E7C8' : 'transparent', railSongW: (s.rail ?? 'song') === 'song' ? 600 : 500, "
            "panelAud: (s.rail ?? 'song') === 'audio', pickAud: () => this.setState({ rail: (s.rail ?? 'song') === 'audio' ? 'none' : 'audio', open: 'none' }), railAudOn: (s.rail ?? 'song') === 'audio' ? 'true' : 'false', railAudBg: (s.rail ?? 'song') === 'audio' ? '#F6E7C8' : 'transparent', railAudW: (s.rail ?? 'song') === 'audio' ? 600 : 500, "
            "railViewOn: (s.rail ?? 'song') === 'view' ? 'true' : 'false', railViewBg: (s.rail ?? 'song') === 'view' ? '#F6E7C8' : 'transparent', railViewW: (s.rail ?? 'song') === 'view' ? 600 : 500,")
    assert t.count("isMore: open === 'settings',") == 1
    t = t.replace("isMore: open === 'settings',", keys, 1)
    for old, new in _NAMES.items(): t = t.replace(f'role="tabpanel" aria-label="{old}"', f'role="tabpanel" aria-label="{new}"', 1)
    return t

# The transport in the header on a laptop (owner, 2026-11-26: "the floating actions there on the laptop doesnt make
# sense … doesnt follow the flat editor header and toolbars"): Flat's header carries the song's name, then the transport,
# then the mode (the owner's Flat 26.11 band, the new header); the three capsules floating over the music go, their buttons move into one
# header pill after the title (‹ Play › | the pace, the loop | the hands, the keys), their popovers hang under it. The
# pace says what it does: Listen (at a speed) or Wait. The phone keeps its floating capsules (owner: "dont change the
# mobile version floating actions").
def _cut_el(t, start, tag):
    # removes the element that opens at start, by its depth
    depth = 0
    for m in re.finditer(r'<(/?)' + tag + r'\b[^>]*>', t[start:]):
        depth += -1 if m.group(1) else 1
        if depth == 0: return t[:start] + t[start + m.end():]
    raise ValueError(tag)

def header_transport(t):
    # Flat's header, built new from the kit (owner, 2026-11-26: "refactor properly … just moved the location but didnt
    # refactor them properly"; "dont use old kits or builders at all"): the floating capsules and their three old
    # dialogs (Practice, Parts, Piano) are deleted, not moved; the kit's HDRTRANSPORT, HDRPOPS and HDRKEYS draw the
    # transport, its popovers and their state, one implementation with the editor
    t = _cut_el(t, t.rindex('<div', 0, t.index('aria-label="Transport"')), 'div')
    for cond in ('isPace', 'isHands', 'isKeys'):
        t = _cut_el(t, t.index(f'<sc-if value="{{{{{cond}}}}}"'), 'sc-if')
    assert 'aria-label="Practice" style' not in t and 'aria-label="Parts"' not in t
    # the band replaces the glass bar whole (owner, 2026-11-26, Flat 26.11: "the header … should follow the new styles"):
    # one dark band over the screen's top, 64 high, holding its own transport; the music, rail and panels start under it
    h0 = t.index('<header'); h1 = t.index('</header>', h0) + len('</header>')
    wait = re.search(r'<sc-if value="\{\{waitNoPiano\}\}".*?</sc-if>', t[h0:h1], re.S).group(0).replace('color: #685E56', 'color: ' + ONB_SOFT)
    t = t[:h0] + BANDHDR('SongsLaptop.dc.html', 'play', 'PlayerLaptop.dc.html', 'EditorLaptop.dc.html', right=wait + HDRKEYSBTN, over=True) + t[h1:]
    assert t.count('sheetTop: 76') == 1; t = t.replace('sheetTop: 76', 'sheetTop: 64', 1)
    # History in the band, before the keys (Flat's "Last save … ago" before its acts); its view over the whole screen
    t = t.replace(wait + HDRKEYSBTN, wait + HISTBTN + HDRKEYSBTN, 1)
    t = t.replace('</main>', '</main>' + HISTVIEW(), 1)
    # the page's picking and the card's scope, worked out before the state object reads them
    r = t.index('const s = this.state || {};\n') + len('const s = this.state || {};\n')
    t = t[:r] + PICKJS('s', 'this.setState', lambda m: 'sTo: ' + m + ', sUndo: true') + '\n' + t[r:]
    for a, b in (("patternName: (PAT_LIB.find((x) => x.id === (s.patId ?? 'M1')) || {}).name", "patternName: (PAT_LIB.find((x) => x.id === acc('pat', s.patId ?? 'M1')) || {}).name"),
                 ("const cur = s.patId ?? 'M1';", "const cur = acc('pat', s.patId ?? 'M1');"),
                 ("pick: () => this.setState({ patId: x.id, music: 'chords', open: 'settings', patRecent: [x.id, ...recent.filter((r) => r !== x.id)].slice(0, 3) })", "pick: () => setAcc('pat', x.id, x.name, { music: 'chords', open: 'settings', patRecent: [x.id, ...recent.filter((r) => r !== x.id)].slice(0, 3) })"),
                 ("songUndo: () => this.setState({ sTo: '', sUndo: false, ...(s.undoVer || {}), undoVer: null })", "songUndo: () => this.setState({ sTo: '', sUndo: false, ...(s.undoVer || {}), undoVer: null, ...(s.undoOv ? { ovr: s.undoOv, hist: s.undoHist } : {}), undoOv: null })")):
        assert t.count(a) == 1, a[:60]; t = t.replace(a, b, 1)
    # the keys docked at the foot, the editor's strip (owner, 2026-11-26: "the piano should also be the same as the flat
    # and should be the same in the editor and also in the player: but keep the 3d version"): the whole width beside the
    # panel, square to the window's edges, a hairline above; 2D resized by its grip (96–260, as the editor's), 3D as tall
    # as its picture at that width; the music ends 16 above it
    r = t.index('const s = this.state || {};\n') + len('const s = this.state || {};\n')
    t = t[:r] + "const DOCKL = (s.rail ?? 'song') === 'none' ? 76 : 428;\n" + t[r:]
    # the strip's size once the board's KB is made (it is declared later in renderVals)
    k = t.index('const KB = { top: 0,'); k = t.index('};\n', k) + 3
    t = t[:k] + "KB.w = 1710 - DOCKL; KB.h = Math.max(96, Math.min(260, s.kh ?? 150));\n" + t[k:]
    t, n = re.subn(r"kbTop: 800 - bandH, kbLeft: .*?, kbW: KB\.w,", "kbTop: 904 - bandH, kbLeft: DOCKL, kbW: KB.w,", t, count=1); assert n == 1
    t = t.replace('viewBottom: keys ? 904 - (800 - bandH) + 16 : DEV.bottom,', 'viewBottom: keys ? bandH + 16 : DEV.bottom,', 1)
    fl = 'border-radius: 20px; box-shadow: 0 0 0 1px rgba(51,41,33,.10), 0 2px 6px rgba(51,41,33,.14), 0 18px 40px -12px rgba(51,41,33,.40)'
    assert t.count(fl) == 2; t = t.replace(fl, 'border-radius: 0; box-shadow: 0 -1px 0 #DAD1C8; z-index: 20')  # over the page, under the grip (21)
    grip = ('<sc-if value="{{kb2d}}" hint-placeholder-val="{{false}}"><div role="separator" aria-orientation="horizontal" aria-label="Keyboard height" aria-valuenow="{{kbH}}" aria-valuemin="96" aria-valuemax="260" tabindex="0" data-tip="Drag to resize" onPointerDown="{{dragKeys}}" onPointerMove="{{dragKeys}}" onKeyDown="{{keyKeys}}" '
            'style="position: absolute; z-index: 21; left: {{kbLeft}}px; width: {{kbW}}px; top: {{gripTop}}px; height: 13px; cursor: row-resize; touch-action: none; display: flex; align-items: center; justify-content: center">'
            '<span aria-hidden="true" style="width: 36px; height: 5px; border-radius: 3px; background: #FEFDFB; box-shadow: 0 0 0 1px #DAD1C8"></span></div></sc-if>')
    i = t.index('<sc-if value="{{kb2d}}" hint-placeholder-val="{{false}}">'); t = t[:i] + grip + t[i:]
    dk = ("gripTop: 904 - bandH - 6, dragKeys: (e) => { if (e.type === 'pointermove' && !e.buttons) return; if (e.type === 'pointerdown') { if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); return; } "
          "const g = e.currentTarget.parentElement; const rr = g.getBoundingClientRect(), k = rr.width / g.offsetWidth; this.setState({ kh: Math.round(Math.max(96, Math.min(260, (rr.bottom - e.clientY) / k))) }); }, "
          "railKeys: (e) => { const d = { ArrowDown: 1, ArrowUp: -1 }[e.key]; const t = [...e.currentTarget.querySelectorAll('[role=tab]')]; const i = t.indexOf(document.activeElement); if (!d || i < 0) return; e.preventDefault(); const n = t[(i + d + t.length) % t.length]; n.focus(); n.click(); }, keyKeys: (e) => { const d = { ArrowUp: 16, ArrowDown: -16 }[e.key]; if (d) this.setState({ kh: Math.max(96, Math.min(260, (s.kh ?? 150) + d)) }); }, ")
    t = t.replace('togglePlay: togglePlayNow,', 'togglePlay: togglePlayNow, ' + dk, 1)
    # a laptop keeps its band, rail and panel while playing (owner, 2026-11-26: "on laptop doesnt make sense to hide all
    # controls while playing"): the transport, the mode and the panel are what the learner reaches for mid-play, as in
    # Flat's player; the phone keeps its auto-hide for its small screen
    assert t.count('showControls: !playing,') == 1; t = t.replace('showControls: !playing,', 'showControls: true,', 1)
    t = t.replace('togglePlay: togglePlayNow,', 'togglePlay: togglePlayNow, ' + HISTKEYS('s', 'this.setState', lambda m: 'sTo: ' + m + ', sUndo: true', restore="(h) => ({ undoOv: OV, ovr: h.ov })"), 1)
    t = t.replace('</main>', '</main>' + HDRPOPS(True, *POPX['play']), 1)
    loop = "() => { if (loop) { this.setState({ loop: false, hdPop: null }); return; } const a = Math.floor((bar - 1) / 4) * 4 + 1; this.setState({ loop: true, loopA: a, loopB: Math.min(16, a + 3), hdPop: null }); }"
    keys = HDRKEYS('s', '(o) => this.setState(o)', lambda m: 'sTo: ' + m + ', sUndo: false', 'togglePlayNow', 'playing', loop, 'loop',
                   "loop ? 'Stop looping bars ' + loopA + '–' + loopB : 'Loop bars ' + (Math.floor((bar - 1) / 4) * 4 + 1) + '–' + Math.min(16, Math.floor((bar - 1) / 4) * 4 + 4)",
                   [('R', 'Right hand'), ('L', 'Left hand')])
    assert t.count('togglePlay: togglePlayNow,') >= 1
    return t.replace('togglePlay: togglePlayNow,', 'togglePlay: togglePlayNow, ' + PLAYHEAD_KEYS + ' ' + keys)

def phone_band(t):
    # the phone as the laptop and Flat's phone editor (owner, 2026-11-26: "refactor the mobile version the same way and
    # to be like the flat editor the same"): the glass bar and the floating capsule over the music go, with their old
    # sheets (Practice, Hands, Piano, Settings, View, Views, Key); the kit's phone band (PHBAND) takes the top in two
    # rows (✕, the song's menu, Practice | Edit, ☰; the transport and Piano keys), the band's popovers rise as sheets
    # (HDRPOPS, phone), ☰ holds the laptop rail's places (Song, View, Transpose, Audio's levels are the Practice sheet's
    # Hands), one implementation with the editor
    t = _cut_el(t, t.rindex('<div', 0, t.index('aria-label="Transport"')), 'div')
    for cond in ('isPace', 'isHands', 'isKeys', 'isMore', 'isView', 'isViews', 'isKey'):
        t = _cut_el(t, t.index(f'<sc-if value="{{{{{cond}}}}}"'), 'sc-if')
    h0 = t.index('<header'); h1 = t.index('</header>', h0) + len('</header>')
    t = t[:h0] + PHBAND('Songs.dc.html', PHKEYSBTN, over=True) + t[h1:]
    # the status bar over the header
    st = 'height: 54px; z-index: 5; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 6px 34px 0 50px; color: {{statusFg}};'
    assert t.count(st) == 1; t = t.replace(st, st.replace('z-index: 5', 'z-index: 49'), 1)
    # the music starts under the header (62 + 60); the band stays while playing, as the laptop's
    assert t.count('sheetTop: 124') == 1; t = t.replace('sheetTop: 124', 'sheetTop: 122', 1)
    assert t.count('showControls: !playing,') == 1; t = t.replace('showControls: !playing,', 'showControls: true,', 1)
    places = (('Song', 'Song', '{{verName}}', f'<div style="display: flex; flex-direction: column">{VERPANEL()}</div>', None),
              ('View', 'View', '{{viewName}}', VIEWPANEL(links=True, inset=False), None),
              ('Tr', 'Transpose', '{{hdKeyL}}', TRROWS(True), None),
              ('Midi', 'MIDI keyboard', '', '', 'phMidiGo'))
    # Edit is a mode of the song, not of the Sheet (owner, 2026-11-26: "why from the view options in the edit mode i go to
    # for example to the diagrams view and it doesn't work … when i switch back to the sheet view it is still in edit
    # mode"): the board takes mode (play | edit) and, in Edit, the editor it came from; the mode tabs keep the view (the
    # Player's Grid ↔ the editor's Grid), Edit's row of acts stands under the header as in the editor's Sheet, and the
    # Sheet card goes back to the editor; Flat keeps its mode as its view changes
    modes = (f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">' + PHMODE('edit', '{{modePlayHref}}', '{{modeEditHref}}') + '</sc-if>'
             f'<sc-if value="{{{{notEditing}}}}" hint-placeholder-val="{{{{true}}}}">' + PHMODE('play', '{{modePlayHref}}', '{{modeEditHref}}') + '</sc-if>')
    t = t.replace('</main>', '</main>' + f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; z-index: 30; left: 0; right: 0; top: 122px">{ACTS_P}</div></sc-if>'
                  + HDRPOPS(True, 0, 0, 0, keys_right=0, phone=True) + PHMENU(places, 'Takes.dc.html', modes, song=(('Tr', 'Transpose', '{{hdKeyL}}', 'phTr'),)), 1)
    assert t.count("const view = s.view ?? p.view ?? 'sheet';") == 1
    t = t.replace("const view = s.view ?? p.view ?? 'sheet';", "const view = s.view ?? p.view ?? 'sheet';\nconst editing = p.mode === 'edit';", 1)
    # the grid's section heads on the 20 edge the ☰ panel's rows start on (they sat 2 further in)
    assert t.count('gridIndent: DEV.gutter + 6,') == 1; t = t.replace('gridIndent: DEV.gutter + 6,', 'gridIndent: DEV.gutter + 4,', 1)
    assert t.count('areaTop: keys ? 260 : 0,') == 1; t = t.replace('areaTop: keys ? 260 : 0,', 'areaTop: (keys ? 260 : 0) + (editing ? 56 : 0),', 1)
    ed = "{ sheet: p.editor ?? 'Editor.dc.html', diagrams: (p.editor === 'EditorDraft.dc.html' ? 'EditorDraft' : 'Editor') + 'Diagrams.dc.html', grid: (p.editor === 'EditorDraft.dc.html' ? 'EditorDraft' : 'Editor') + 'Grid.dc.html', lyrics: (p.editor === 'EditorDraft.dc.html' ? 'EditorDraft' : 'Editor') + 'Lyrics.dc.html' }"
    mk = ("editing, notEditing: !editing, modePlayHref: { sheet: 'Player.dc.html', diagrams: 'PlayerDiagrams.dc.html', grid: 'PlayerViewGrid.dc.html', lyrics: 'PlayerViewLyrics.dc.html' }[view], "
          f"modeEditHref: ({ed})[view], "
          "delNote: () => this.setState({ sTo: 'Chord deleted', sUndo: true, edN: (s.edN ?? 0) + 1, unN: 0 }), undo: () => { if (!(s.edN ?? 0)) return; this.setState({ sTo: 'Undone', sUndo: false, edN: s.edN - 1, unN: (s.unN ?? 0) + 1 }); }, redo: () => { if (!(s.unN ?? 0)) return; this.setState({ sTo: 'Redone', sUndo: false, edN: (s.edN ?? 0) + 1, unN: s.unN - 1 }); }, "
          "undoDis: (s.edN ?? 0) ? 'false' : 'true', redoDis: (s.unN ?? 0) ? 'false' : 'true', "
          "copied: () => this.setState({ sTo: 'Copied', sUndo: false }), cut: () => this.setState({ sTo: 'Cut', sUndo: true }), pasted: () => this.setState({ sTo: 'Pasted', sUndo: true }), ")

    st_ = '(o) => this.setState(o)'
    vk = ("viewCards: VIEWS.map(([id, name]) => { const on = id === view; return { label: name, on: on ? 'true' : 'false', ring: on ? 'inset 0 0 0 2px #332921' : 'inset 0 0 0 1px #DAD1C8', fw: on ? 600 : 500, "
          "isSheet: id === 'sheet', isDia: id === 'diagrams', isGrid: id === 'grid', isLyr: id === 'lyrics', isHere: !(editing && id === 'sheet'), isAway: editing && id === 'sheet', href: p.editor ?? 'Editor.dc.html', ...viewPress(id) }; }), " + mk
          + FOLDKEYS('s', st_, ['Ver', 'View', 'Opts', 'Parts']) + ' '
          + SELFROM('s', st_, 'selLayout', "lopt('layout', layout, [['page', 'Page'], ['panorama', 'Panorama']])") + ' '
          + SELFROM('s', st_, 'selPerRow', "lopt('perRow', perRow, [4, 8].map((n) => [n, n + ' bars']))") + ' '
          + SELFROM('s', st_, 'selText', "lopt('text', s.text ?? 'm', [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']])") + ' ')
    assert t.count('views: VIEWS.map(') == 1; t = t.replace('views: VIEWS.map(', vk + 'views: VIEWS.map(', 1)
    loop = "() => { if (loop) { this.setState({ loop: false, hdPop: null }); return; } const a = Math.floor((bar - 1) / 4) * 4 + 1; this.setState({ loop: true, loopA: a, loopB: Math.min(16, a + 3), hdPop: null }); }"
    keys = HDRKEYS('s', st_, lambda m: 'sTo: ' + m + ', sUndo: false', 'togglePlayNow', 'playing', loop, 'loop',
                   "loop ? 'Stop looping bars ' + loopA + '–' + loopB : 'Loop bars ' + (Math.floor((bar - 1) / 4) * 4 + 1) + '–' + Math.min(16, Math.floor((bar - 1) / 4) * 4 + 4)",
                   [('R', 'Right hand'), ('L', 'Left hand')])
    keys += ' ' + SONGMENU_KEYS('s', 'this.setState', lambda m, u: f"sTo: {m}, sUndo: {'true' if u else 'false'}", close_others=', ph: null') + ' ' + PHKEYS('s', st_, ['Song', 'View', 'Tr'], lambda m, u: f"sTo: {m}, sUndo: {'true' if u else 'false'}") + ' ' + PARTKEYS('s', st_, [('M', 'Melody'), ('P', 'Piano')], 'pSolo')
    # Played through's Transpose opens the band's Transpose, the one implementation
    assert t.count("openKey: pick({ open: 'key' })") == 1; t = t.replace("openKey: pick({ open: 'key' })", "openKey: () => this.setState({ open: 'none', ph: 'Tr' })", 1)
    a = 'togglePlay: togglePlayNow,'; i = t.index(a)
    return t[:i] + a + ' ' + PLAYHEAD_KEYS + ' ' + keys + t[i + len(a):]

def desk_edit(t):
    # the laptop's views in Edit (owner, 2026-11-26: "why from the view options in the edit mode i go to for example to
    # the diagrams view and it doesn't work"): the board takes mode and the editor it came from, as the phone's; the band's
    # Practice | Edit keeps the view, Edit's toolbar holds the acts on what is chosen (the editor's Delete | Undo Redo |
    # Copy Cut Paste, at its place at the toolbar's end), and the Sheet card goes back to the editor
    assert t.count("const view = s.view ?? p.view ?? 'sheet';") == 1
    t = t.replace("const view = s.view ?? p.view ?? 'sheet';", "const view = s.view ?? p.view ?? 'sheet';\nconst editing = p.mode === 'edit';", 1)
    sw = MODESW("play", "PlayerLaptop.dc.html", "EditorLaptop.dc.html")
    assert t.count(sw) == 1
    t = t.replace(sw, '<sc-if value="{{editing}}" hint-placeholder-val="{{false}}">' + MODESW("edit", "{{modePlayHref}}", "{{modeEditHref}}") + '</sc-if>'
                  '<sc-if value="{{notEditing}}" hint-placeholder-val="{{true}}">' + MODESW("play", "{{modePlayHref}}", "{{modeEditHref}}") + '</sc-if>', 1)
    n = t.count('top: 64px; bottom: 0; width: ')
    assert n == 4, n  # the rail and its three panels (Song, View, Audio)
    t = t.replace('top: 64px; bottom: 0; width: ', 'top: {{edTop}}px; bottom: 0; width: ')
    assert t.count('const areaTop = keys ? 288 : 0;') == 1 and t.count('areaTop: 0, viewBottom') == 1
    t = t.replace('const areaTop = keys ? 288 : 0;', 'const areaTop = (keys ? 288 : 0) + (editing ? 56 : 0);', 1).replace('areaTop: 0, viewBottom', 'areaTop: editing ? 56 : 0, viewBottom', 1)
    bar = (f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><div role="toolbar" aria-label="Edit" style="position: absolute; z-index: 30; left: 0; right: 0; top: 64px; height: 56px; box-sizing: border-box; '
           f'padding: 0 24px; display: flex; align-items: center; justify-content: flex-end; gap: 8px; background: {PAGE}; box-shadow: inset 0 -1px 0 {LINE}">{CLIP}</div>{DISABLED_CSS}</sc-if>')
    t = t.replace('</main>', '</main>' + bar, 1)
    ed = "{ sheet: p.editor ?? 'EditorLaptop.dc.html', diagrams: (p.editor ?? 'EditorLaptop.dc.html').replace('.dc.html', 'Diagrams.dc.html'), grid: (p.editor ?? 'EditorLaptop.dc.html').replace('.dc.html', 'Grid.dc.html'), lyrics: (p.editor ?? 'EditorLaptop.dc.html').replace('.dc.html', 'Lyrics.dc.html') }"
    mk = ("editing, notEditing: !editing, edTop: editing ? 120 : 64, modePlayHref: { sheet: 'PlayerLaptop.dc.html', diagrams: 'PlayerLaptopDiagrams.dc.html', grid: 'PlayerLaptopGrid.dc.html', lyrics: 'PlayerLaptopLyrics.dc.html' }[view], "
          f"modeEditHref: ({ed})[view], "
          "delNote: () => this.setState({ sTo: 'Chord deleted', sUndo: true, edN: (s.edN ?? 0) + 1, unN: 0 }), undo: () => { if (!(s.edN ?? 0)) return; this.setState({ sTo: 'Undone', sUndo: false, edN: s.edN - 1, unN: (s.unN ?? 0) + 1 }); }, redo: () => { if (!(s.unN ?? 0)) return; this.setState({ sTo: 'Redone', sUndo: false, edN: (s.edN ?? 0) + 1, unN: s.unN - 1 }); }, "
          "undoDis: (s.edN ?? 0) ? 'false' : 'true', redoDis: (s.unN ?? 0) ? 'false' : 'true', "
          "copied: () => this.setState({ sTo: 'Copied', sUndo: false }), cut: () => this.setState({ sTo: 'Cut', sUndo: true }), pasted: () => this.setState({ sTo: 'Pasted', sUndo: true }), ")
    old = "isLyr: id === 'lyrics', ...viewPress(id) }; }), "
    assert t.count(old) == 1
    t = t.replace(old, "isLyr: id === 'lyrics', isHere: !(editing && id === 'sheet'), isAway: editing && id === 'sheet', href: p.editor ?? 'EditorLaptop.dc.html', ...viewPress(id) }; }), " + mk, 1)
    return t

def desk_views(t):
    # the laptop's Diagrams, Grid and Lyrics on the panel's lines (the lines tool, 2026-11-26): the song's name on the
    # panel head's top (it sat 6 above "Song"), the credits 4 under it (6 was off the scale), the grid's first section head
    # on the panel's first fold head, each head 8 over its rows and 24 under the last section (10 and 22 were off the scale)
    for a, b in (('align-items: center; gap: 6px; pointer-events: none"><h2', 'align-items: center; gap: 4px; pointer-events: none"><h2'),
                 ("viewTop: (keys ? DEV.topKeys : DEV.top) + 72, viewHeadTop: keys ? DEV.topKeys : DEV.top,", "viewTop: (keys ? DEV.topKeys : DEV.top) + 78, viewHeadTop: (keys ? DEV.topKeys : DEV.top) + 6,"),
                 ('margin: {{g.mt}}px 0 6px {{gridIndent}}px', 'margin: {{g.mt}}px 0 4px {{gridIndent}}px'),
                 ("mt: v === 1 ? 0 : 18,", "mt: v === 1 ? 0 : 20,")):
        assert t.count(a) == 1, a
        t = t.replace(a, b, 1)
    return t

def open_layers(t, phone):
    # a layer board opens the layer that holds its thing today (the canvas's open= names the R37 sheets, gone): Practice
    # opens Playback options, Song settings ☰, Transpose its page, Parts and the view's settings the View page; on a
    # laptop Parts opens the Audio panel (each part's level) and the view's settings the View panel
    m = ("{ pace: { hdPop: 'opts' }, settings: { ph: 'menu' }, key: { ph: 'Tr' }, hands: { ph: 'View' }, view: { ph: 'View' } }" if phone
         else "{ hands: { rail: 'audio' }, view: { rail: 'view' } }")
    assert t.count('const s = this.state || {};') == 1
    return t.replace('const s = this.state || {};', f"const s = {{ ...({m}[(this.props || {{}}).open] || {{}}), ...(this.state || {{}}) }};", 1)

# where each popover hangs (left of Playback options, left of Volume, right of Piano keys), measured from the header
POPX = {'play': (294, 470, 576, 24), 'edit': (294, 470, 576)}

for name, sfx in (('PlayerApp', '.dc.html'), ('PlayerDesk', 'Laptop.dc.html')):
    p = OUT / f'{name}.dc.html'; t = (BASE / f'{name}.dc.html').read_text()
    NEWSW = re.compile(r'<div (?:data-sw )?role="group" aria-label="Version and mode".*?</a></div>', re.S)
    sw = VERSW('play', 'Editor' + sfx, live=True)
    if 'aria-label="Version and mode"' in t:
        t, n = NEWSW.subn(lambda m: sw, t, count=1)
    else:
        t, n = OLDSW.subn(lambda m: sw, t, count=1)
    assert n == 1, name
    if name == 'PlayerDesk':
        # the version beside the song's name, at the editor's place (owner, 2026-11-26: "I dont like how this arrangement
        # is centered"; ui-and-mockups: every element answers why here): the name says which song, the version which music
        t = t.replace(sw, '<span></span>', 1)
        close = re.search(r'<a href="Songs?Laptop.dc.html" aria-label="Close".*?</a>', t, re.S).group(0)
        t = t.replace(close, close + f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{SONGMENU("TakesLaptop.dc.html")}{MODESW("play", "PlayerLaptop.dc.html", "EditorLaptop.dc.html")}</div>', 1)
    # Edit its own button beside the version, as Flat's "✎ Edit ▾" after the name and transport (the owner's Flat
    # screenshots; owner, 2026-11-26: "i dont like this edit button with this accompaniment … inside this control")
    if name == 'PlayerApp': t = t.replace(sw, f'<div style="display: flex; align-items: center; gap: 8px; min-width: 0; pointer-events: auto">{sw}{EDITB("play", "Editor" + sfx)}</div>', 1)
    if name == 'PlayerApp':
        t = t.replace('padding: 8px 16px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px; pointer-events: none', MODEBAR_P + '; pointer-events: none', 1)
    # Close goes back to the library the song was opened from (the song's own page is gone, R74)
    t = t.replace('href="Song.dc.html" aria-label="Close"', 'href="Songs.dc.html" aria-label="Close"').replace('href="SongLaptop.dc.html" aria-label="Close"', 'href="SongsLaptop.dc.html" aria-label="Close"')
    # the Section page is gone (owner, 2026-11-26: "remove the section page completely"): its row goes from the song's card
    t = re.sub(r'<a href="Song\.dc\.html" style[^>]*>.*?</a>', '', t, count=1, flags=re.S)
    t = t.replace('<a href="SongLaptop.dc.html" style', '<a href="SectionLaptop.dc.html" style')  # the laptop's card is replaced whole below
    # the accompaniment first: it is what the song has; the arrangement only where one is written
    t = t.replace("(s.music !== 'chords'), acc:", "(s.music === 'written'), acc:").replace("}))(s.music === 'chords'), levelOpts", "}))(s.music !== 'written'), levelOpts")
    t = t.replace("music ?? 'written'", "music ?? 'chords'")
    # printed under the credits, as an engraver credits an arrangement: what the learner reads is not the composer's score
    # its own line under the credits, centred as they are (on the tempo's line it ran into "1 · Verse · ♩ = 80" at 393)
    # the score as an engraver prints it (owner, 2026-11-26: "this accompaniment sheet doesnt look like a professioanal
    # score we talked about"): the kit's one engraving (Dorico's spacing, calm_parts.score_grand); on a laptop the
    # editor's A4 page on its desk (A4PAGE), as Flat's player shows the page; on a phone the same engraving at the
    # phone's width, the credits as the page prints them; the accompaniment credited under the music, as "Arr."
    phone = name == 'PlayerApp'
    if phone:
        # the accompaniment leaves the phone Player too (owner, 2026-11-26: "remove the accompaniment settings from the player
        # and move to only to the notation"): its Arrangement · Accompaniment cards, Pattern, inversion and voicing go from
        # the Settings sheet, which keeps Transpose; the Pattern and Sort and filter sheets go with them; the floating
        # actions are untouched
        i = t.index('<div role="radiogroup" aria-label="Score"')
        k = t.index('<div style="border-radius: 12px; background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px rgba(51,41,33,.07)">\n<button type="button" onClick="{{openKey}}"', i)
        t = t[:i] + t[k:]
        for lab in ('Pattern', 'Sort and filter'):
            a0, b0 = _sect(t, lab); t = t[:a0] + t[b0:]
    if 'data-r74 ' not in t:
        a = t.index('margin-top: {{sheetTop}}px; padding: ')
        i = t.rindex('<div', 0, a); depth = 0
        for m in re.finditer(r'<(/?)div\b', t[i:]):
            depth += -1 if m.group(1) else 1
            if depth == 0: j = i + m.end(); break
        if phone:
            head = (f'<h2 style="margin: 0; text-align: center; font-family: {SERIF}; font-size: 24px; font-weight: 400; line-height: 1.1">Amazing Grace</h2>'
                    f'<div style="margin: 12px 0 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; font-family: {SERIF}; font-size: 12px; line-height: 16px"><span>Words: John Newton</span>'
                    f'<span style="text-align: right">Music: New Britain</span></div>'
                    f'<div style="margin: 12px 0 0; font-family: {SERIF}; font-size: 12px; font-weight: 700">Verse <span style="font-weight: 400"><svg role="img" aria-label="quarter note" viewBox="0 0 8 16" width="6" height="12" style="vertical-align: -2px"><ellipse cx="3.4" cy="13" rx="3.3" ry="2.3" transform="rotate(-20 3.4 13)" fill="{INK}"/><rect x="5.8" y="0" width="1" height="12.6" fill="{INK}"/></svg> = 80</span></div>')
            # the page as paper on the grey desk, as Flat's phone shows the page (flat-score-editor 021, 023): white,
            # its margins, its shadow; three bars a line so the staff stays a readable size
            # the open version's music: with its piano accompaniment, or the melody alone (a lead sheet)
            sg = lambda pn: '<div style="position: relative; margin: -4px 0 0">' + score_grand(470, [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11, 12]], sel=None, size=1.0, piano=pn) + PLAYHEAD(GEO['last']) + '</div>'
            # the Parts sheet's Piano switch: hidden, the page prints the melody alone
            body = head + ('<sc-if value="{{isPiano}}" hint-placeholder-val="{{true}}"><sc-if value="{{pianoShown}}" hint-placeholder-val="{{true}}">' + sg(True) + '</sc-if><sc-if value="{{pianoHidden}}" hint-placeholder-val="{{false}}">' + sg(False) + '</sc-if></sc-if>'
                           + '<sc-if value="{{isLead}}" hint-placeholder-val="{{false}}">' + sg(False) + '</sc-if>')
            body += f'<p style="margin: 24px 0 0; text-align: center; font-family: {SERIF}; font-size: 12px; color: {SOFT}">Public domain</p>'
            new = (f'<div data-r74 style="margin-top: {{{{sheetTop}}}}px; box-sizing: border-box; min-height: calc(100% - {{{{sheetTop}}}}px); padding: 4px 8px 140px; background: {FILL}">'
                   f'<article aria-label="Page 1" style="box-sizing: border-box; padding: 24px 16px 32px; background: {SHEET}; color: {INK}; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 2px 4px rgba(51,41,33,.06), 0 12px 32px -16px rgba(51,41,33,.28)">{body}</article></div>')
        else:
            # the page at the editor's size (1.5, its fit beside the 352 panel is 1.52), so Practice and Edit print one page
            new = (f'<div data-r74 style="margin-top: {{{{sheetTop}}}}px; box-sizing: border-box; min-height: calc(100% - {{{{sheetTop}}}}px); padding: 24px 0 160px; background: {FILL}; display: flex; justify-content: center">'
                   f'<div style="zoom: 1.5"><sc-if value="{{{{isPiano}}}}" hint-placeholder-val="{{{{true}}}}">{A4PAGE("", None, head=True)}</sc-if><sc-if value="{{{{isLead}}}}" hint-placeholder-val="{{{{false}}}}">{A4PAGE("", None, piano=False, head=True)}</sc-if></div></div>' + PICKCSS)
        t = t[:i] + new + t[j:]
    # the settings' Arrangement says it is not written for this song
    if 'data-r74y' not in t and 'aria-label="Score"' in t:
        a = t.index('<span style="flex: 1; min-width: 0">Arrangement</span>')
        lv0 = t.index('<span>Level</span>', a); lv0 = t.rindex('<div ', 0, lv0)
        acc = t.index('<span style="flex: 1; min-width: 0">Accompaniment</span>', a); acc = t.rindex('<div style="border-radius: 12px; background: {{acc.bg}}', 0, acc)
        lvend = t.rindex('</div>', lv0, acc)  # the Arrangement card's close
        none = f'<div style="padding: 0 16px 12px; margin-top: -4px; font-size: 14px; color: {SOFT}">None written for this song yet</div>'
        t = t[:lv0] + none + t[lvend:]
        # no arrangement to choose: the card reads as absent, not as a choice
        t = t.replace('<button type="button" role="radio" aria-checked="{{arr.on}}" onClick="{{arr.pick}}"', '<button type="button" role="radio" aria-checked="false" aria-disabled="true"', 1)
        t = t.replace('<span style="flex: 1; min-width: 0">Arrangement</span>', f'<span style="flex: 1; min-width: 0; color: {SOFT}">Arrangement</span>', 1)
        rg = t.index('role="radiogroup" aria-label="Score"'); acc = t.index('{{acc.bg}}', rg)
        # the radiogroup's end: the first '</div>\n</div>' after the accompaniment card's Voicing row
        vo = t.index('aria-label="Voicing"', acc); close = t.index('</sc-for>', vo); close = t.index('</div>', close); close = t.index('</div>', close + 6); close = t.index('</div>', close + 6) + 6
        t = t.replace('<div style="padding: 0 16px 12px; margin-top: -4px;', '<div data-r74y style="padding: 0 16px 12px; margin-top: -4px;', 1)
    # the song's page is gone: its Settings joins the song's menu, before Print and Export (Edit is the Score's, beside it)
    if 'data-r74m' not in t:
        i = t.index('<span>Print</span>'); j = t.rindex('<button type="button" role="menuitem"', 0, i)
        st = 'min-height: 44px; box-sizing: border-box; padding: 0 16px; display: flex; align-items: center; gap: 12px; width: 100%; color: #332921; font-size: 15px; text-decoration: none'
        GEAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
        PEN = PENI.replace('width="18" height="18"', 'width="20" height="20"')
        items = (f'<a data-r74m role="menuitem" href="SongSettings{sfx}" style="{st}">{GEAR}<span>Settings</span></a>')
        t = t[:j] + items + t[j:].replace('border-top: 0"', 'border-top: 1px solid ' + LINE + '"', 1)
    # a song's versions (kit VERSW): the open one, the default, each one's name; New version copies the open one
    VERJS2 = ("verName: VC.name, isPiano: !!VC.piano, isLead: !VC.piano, "
              "verRows: VS.map((v) => ({ name: v.name, sub: v.sub, isDef: v.id === VD, cur: v.id === VCID, on: v.id === VCID ? 'true' : 'false', pick: () => { if (this._ver) this._ver.open = false; this.setState({ verCur: v.id }); } })), "
              "verRef: (el) => { this._ver = el; }, setDefFg: VCID === VD ? '#685E56' : '#332921', delVerFg: VS.length < 2 ? '#685E56' : '#B3261E', "
              "actNewVer: () => { if (this._ver) this._ver.open = false; const id = 'v' + VS.length + Date.now(); this.setState({ vers: [...VS, { ...VC, id, name: VC.name + ' 2' }], verCur: id, sTo: 'New version from ' + VC.name, sUndo: false }); }, "
              "actRename: () => { if (this._ver) this._ver.open = false; this.setState({ ren: true }); }, "
              "actSetDef: () => { if (this._ver) this._ver.open = false; if (VCID !== VD) this.setState({ verDef: VCID, sTo: VC.name + ' opens first now', sUndo: false }); }, "
              "actDelVer: () => { if (VS.length < 2) return; if (this._ver) this._ver.open = false; const rest = VS.filter((v) => v.id !== VCID); const nd = VD === VCID ? rest[0].id : VD; this.setState({ undoVer: { vers: VS, verCur: VCID, verDef: VD }, vers: rest, verDef: nd, verCur: nd, sTo: VC.name + ' deleted', sUndo: true }); }, "
              "renOn: !!s.ren, renVal: VC.name, renRef: (el) => { this._rn = el; }, renCancel: () => this.setState({ ren: false }), "
              "renSave: () => { const n = ((this._rn && this._rn.value) || '').trim(); if (!n) return; this.setState({ vers: VS.map((v) => (v.id === VCID ? { ...v, name: n } : v)), ren: false, sTo: 'Renamed to ' + n, sUndo: false }); }, ")
    if name == 'PlayerDesk':
        t = t.replace("isMore: open === 'settings',", "isMore: open === 'settings', " + SONGMENU_KEYS('s', 'this.setState', lambda m, u: f"sTo: {m}, sUndo: {'true' if u else 'false'}") + (' ' + SELKEYS('s', '((o) => this.setState(o))', [('selInv', [('Root', 'Root position'), ('1st', '1st inversion'), ('2nd', '2nd inversion'), ('3rd', '3rd inversion')], "acc('inv', 'Root')", "(id) => setAcc('inv', id, id === 'Root' ? 'root position' : id + ' inversion')"), ('selVoice', [('Voice-led', 'Voice-led'), ('Block', 'Block')], "acc('voice', 'Voice-led')", "(id) => setAcc('voice', id, id + ' voicing')")]) if name == 'PlayerDesk' else ''), 1)

    t = t.replace('</main>', '</main>' + RENAMEDLG(), 1)
    # the States box beside the frame, as every board's (owner, 2026-11-15): the Player's own moments, each one tap
    # (states_tool lifts these out of the screen into the dashed States menu)
    # the page follows the playhead as each beat sounds
    a = 'engine.setState({ start: false, bar: b, beat: bt, verse });'; assert t.count(a) == 1
    t = t.replace(a, a + ' ' + PHFOLLOW, 1)
    sts = (('playing', 'hdPlay'), ('looping', 'hdLoop'), ('recording from the keyboard', 'hdRec'), ('transposed up a semitone', 'hdTrUp'), ('Playback options open', 'hdOpts'))
    sts += (('the menu open', 'phMenu'),) if name == 'PlayerApp' else (('Version history open', 'openHist'),)
    t = t.replace('</main>', '</main>' + ''.join(f'<button type="button" onClick="{{{{{a}}}}}" style="display: none">CANVAS · {l}</button>' for l, a in sts), 1)
    t = open_layers(desk_views(desk_edit(header_transport(player_rail(t)))), False) if name == 'PlayerDesk' else open_layers(phone_band(t), True)
    p.write_text(t)
print('r74 versions ok')
