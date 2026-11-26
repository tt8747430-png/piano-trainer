# R74 (owner, 2026-11-26): the Player says plainly that it shows an accompaniment made from the chords, opens on it
# (almost every song has only that), offers the learner's own arrangement where the versions are chosen, and its bar
# holds the version (VERSW) beside the name and Edit (EDITB) beside it. Its one input is player/base (the Player pair as built before R74);
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
# (no Arrangement or Your arrangement here); the song's acts (Settings, Edit the original, Print, Export, Share link)
# are the name's menu, as the editor's title; the gear is gone, its jobs the rail's.
SONGI = _LI('<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>')
VIEWI = _LI('<rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18M8 13h8M8 16h5"></path>')
PANEL = 'position: absolute; z-index: 30; left: 76px; top: 72px; bottom: 0; width: 352px; padding: 0 16px 24px; border-radius: 0; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #FEFDFB; box-shadow: inset -1px 0 0 ' + LINE
def _sect(t, label):
    d = t.index(f'role="dialog" aria-label="{label}"'); a = t.rindex('<section', 0, d); depth = 0
    for m in re.finditer(r'<(/?)section\b', t[a:]):
        depth += -1 if m.group(1) else 1
        if depth == 0: return a, a + m.end()
def _dock(t, label, head=None):
    a, b = _sect(t, label); h = t[a:b]
    h = re.sub(r'style="[^"]*"', f'style="{PANEL}"', h, count=1).replace('role="dialog"', 'role="region"', 1)
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
    c0 = h.index('<div role="radiogroup" aria-label="Score"'); c1 = h.index('<div style="border-radius: 12px; background: {{acc.bg}}', c0)
    h = h[:c0] + '<div role="group" aria-label="Accompaniment" style="display: flex; flex-direction: column; gap: 8px">' + h[c1:]
    rb = re.search(r'<button type="button" role="radio" aria-checked="\{\{acc.on\}\}".*?</button>', h, re.S).group(0)
    h = h.replace(rb, f'<h3 style="margin: 0; padding: 12px 16px 4px; font-size: 15px; font-weight: 600">Accompaniment</h3>', 1)
    h = h.replace('background: {{acc.bg}}; overflow: hidden; box-shadow: inset 0 0 0 2px {{acc.line}}, 0 0 0 1px rgba(51,41,33,.07)', 'background: #FEFDFB; overflow: hidden; box-shadow: 0 0 0 1px rgba(51,41,33,.07)', 1)
    y = re.search(r'<a data-r74y href="[^"]*".*?</a>', h, re.S).group(0); h = h.replace(y, '', 1)
    t = t[:a] + h + t[b:]
    t = _dock(t, 'Settings', head('Song'))
    t = t.replace('<sc-if value="{{isMore}}"', '<sc-if value="{{panelSong}}"', 1)
    # the Song panel's own pages dock in its place, each with its Back
    for lab in ('Pattern', 'Transpose', 'Sort and filter'): t = _dock(t, lab)
    # View: the view's settings docked, headed by the view's name
    a, b = _sect(t, '{{viewName}} settings'); h = t[a:b]
    h = re.sub(r'<h2[^>]*>\{\{viewName\}\}</h2>', '', h, count=1); t = t[:a] + h + t[b:]
    t = _dock(t, '{{viewName}} settings', head('{{viewName}}'))
    i = t.index('<section role="region" aria-label="{{viewName}} settings"'); j = t.rindex('<sc-if value="{{isView}}"', 0, i)
    t = t[:j] + '<sc-if value="{{panelView}}"' + t[j + len('<sc-if value="{{isView}}"'):]
    # the rail, under the bar, at the window's left edge
    rail = (f'<nav aria-label="Panels" style="position: absolute; z-index: 31; left: 0; top: 72px; bottom: 0; width: 76px; padding: 0 0 12px; box-sizing: border-box; background: #F7F3EE; box-shadow: inset -1px 0 0 {LINE}; display: flex; flex-direction: column; gap: 4px">'
            f'<div role="tablist" aria-orientation="vertical" style="display: flex; flex-direction: column; gap: 4px">' + _RAILBTN('Song', SONGI, 'Song', 'Song') + _RAILBTN('View', VIEWI, 'View', 'View') + '</div></nav>')
    e = t.index('</header>', t.index('aria-label="Version"')) + len('</header>')
    t = t[:e] + rail + t[e:]
    # the bar: the name is the song's menu (its acts), the gear goes
    gear = re.search(r'<div[^>]*><button type="button" aria-label="Settings" data-tip="Settings" aria-expanded="\{\{isMore\}\}".*?</button></div>', t, re.S)
    t = t.replace(gear.group(0), '', 1)
    h1 = re.search(r'<h1 style="margin: 0 30px 0 12px;[^"]*">Amazing Grace</h1>', t).group(0)
    menu = acts.replace('right: 0; top: 54px;', 'left: 12px; top: 52px;', 1)
    share = '<button type="button" role="menuitem" onClick="{{toggleSongActs}}" style="min-height: 44px; box-sizing: border-box; padding: 0 16px; display: flex; align-items: center; gap: 12px; width: 100%; border: 0; border-top: 1px solid #EFE9E1; background: transparent; color: #332921; font-size: 15px; text-align: left"><span style="width: 20px"></span><span>Share link</span></button>'
    menu = menu.replace('</div></sc-if>', share + '</div></sc-if>', 1)
    t = t.replace(h1, f'<div style="position: relative; margin: 0 18px 0 0; pointer-events: auto"><button type="button" aria-haspopup="menu" aria-expanded="{{{{songActsOn}}}}" onClick="{{{{toggleSongActs}}}}" data-tip="The song’s menu" style="height: 44px; padding: 0 8px 0 12px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; gap: 4px; cursor: pointer"><h1 style="margin: 0; font-size: 17px; font-weight: 600; white-space: nowrap">Amazing Grace</h1><span style="display: flex; color: {SOFT}">{CHEV_D}</span></button>{menu}</div>', 1)
    # the music and the transport stand beside the panel
    t = t.replace('padding: 24px 0 160px; background:', 'padding: 24px 0 160px {{panelPad}}px; background:', 1)
    t = t.replace('<div role="toolbar" aria-label="Transport" style="position: absolute; z-index: 40; left: 0;', '<div role="toolbar" aria-label="Transport" style="position: absolute; z-index: 40; left: {{panelPad}}px;', 1)
    # the script: the rail's state, apart from the popovers' (Play closes a popover, never the panel)
    keys = ("isMore: open === 'settings', rail: s.rail ?? 'song', "
            "panelSong: (s.rail ?? 'song') === 'song' && !['pattern', 'patfilter', 'key'].includes(open), panelView: (s.rail ?? 'song') === 'view', "
            "panelPad: (s.rail ?? 'song') === 'none' ? 76 : 428, foldPanel: () => this.setState({ rail: 'none', open: 'none' }), "
            "pickSong: () => this.setState({ rail: (s.rail ?? 'song') === 'song' ? 'none' : 'song', open: 'none' }), pickView: () => this.setState({ rail: (s.rail ?? 'song') === 'view' ? 'none' : 'view', open: 'none' }), "
            "railSongOn: (s.rail ?? 'song') === 'song' ? 'true' : 'false', railSongBg: (s.rail ?? 'song') === 'song' ? '#E8DFD3' : 'transparent', railSongW: (s.rail ?? 'song') === 'song' ? 600 : 500, "
            "railViewOn: (s.rail ?? 'song') === 'view' ? 'true' : 'false', railViewBg: (s.rail ?? 'song') === 'view' ? '#E8DFD3' : 'transparent', railViewW: (s.rail ?? 'song') === 'view' ? 600 : 500,")
    assert t.count("isMore: open === 'settings',") == 1
    t = t.replace("isMore: open === 'settings',", keys, 1)
    return t

for name, sfx in (('PlayerApp', '.dc.html'), ('PlayerDesk', 'Laptop.dc.html')):
    p = OUT / f'{name}.dc.html'; t = (BASE / f'{name}.dc.html').read_text()
    NEWSW = re.compile(r'<div (?:data-sw )?role="group" aria-label="Version and mode".*?</a></div>', re.S)
    sw = VERSW('play', 'Editor' + sfx)
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
        t = t.replace(close, close + f'<h1 style="margin: 0 30px 0 12px; padding: 0; font-size: 17px; font-weight: 600; white-space: nowrap; pointer-events: auto">Amazing Grace</h1>' + sw, 1)
    # Edit its own button beside the version, as Flat's "✎ Edit ▾" after the name and transport (the owner's Flat
    # screenshots; owner, 2026-11-26: "i dont like this edit button with this accompaniment … inside this control")
    t = t.replace(sw, f'<div style="display: flex; align-items: center; gap: 8px; min-width: 0; pointer-events: auto">{sw}{EDITB("play", "Editor" + sfx)}</div>', 1)
    if name == 'PlayerApp':
        t = t.replace('padding: 8px 16px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px; pointer-events: none', MODEBAR_P + '; pointer-events: none', 1)
    # Close goes back to the library the song was opened from (the song's own page is gone, R74)
    t = t.replace('href="Song.dc.html" aria-label="Close"', 'href="Songs.dc.html" aria-label="Close"').replace('href="SongLaptop.dc.html" aria-label="Close"', 'href="SongsLaptop.dc.html" aria-label="Close"')
    t = t.replace('<a href="Song.dc.html" style', '<a href="Section.dc.html" style').replace('<a href="SongLaptop.dc.html" style', '<a href="SectionLaptop.dc.html" style')
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
    CREDIT = 'Accompaniment from the chords'
    if 'data-r74 ' not in t:
        a = t.index('margin-top: {{sheetTop}}px; padding: ')
        i = t.rindex('<div', 0, a); depth = 0
        for m in re.finditer(r'<(/?)div\b', t[i:]):
            depth += -1 if m.group(1) else 1
            if depth == 0: j = i + m.end(); break
        if phone:
            head = (f'<h2 style="margin: 0; text-align: center; font-family: {SERIF}; font-size: 24px; font-weight: 400; line-height: 1.1">Amazing Grace</h2>'
                    f'<div style="margin: 12px 0 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; font-family: {SERIF}; font-size: 12px; line-height: 16px"><span>Words: John Newton</span>'
                    f'<span style="text-align: right">Music: New Britain<br><i style="color: {SOFT}">{CREDIT}</i></span></div>'
                    f'<div style="margin: 12px 0 0; font-family: {SERIF}; font-size: 12px; font-weight: 700">Verse <span style="font-weight: 400"><svg role="img" aria-label="quarter note" viewBox="0 0 8 16" width="6" height="12" style="vertical-align: -2px"><ellipse cx="3.4" cy="13" rx="3.3" ry="2.3" transform="rotate(-20 3.4 13)" fill="{INK}"/><rect x="5.8" y="0" width="1" height="12.6" fill="{INK}"/></svg> = 80</span></div>')
            # the page as paper on the grey desk, as Flat's phone shows the page (flat-score-editor 021, 023): white,
            # its margins, its shadow; three bars a line so the staff stays a readable size
            body = head + '<div style="margin: -4px 0 0">' + score_grand(470, [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11, 12]], sel=None, size=1.0) + '</div>'
            body += f'<p style="margin: 24px 0 0; text-align: center; font-family: {SERIF}; font-size: 12px; color: {SOFT}">Public domain</p>'
            new = (f'<div data-r74 style="margin-top: {{{{sheetTop}}}}px; box-sizing: border-box; min-height: calc(100% - {{{{sheetTop}}}}px); padding: 4px 8px 140px; background: {FILL}">'
                   f'<article aria-label="Page 1" style="box-sizing: border-box; padding: 24px 16px 32px; background: {SHEET}; color: {INK}; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 2px 4px rgba(51,41,33,.06), 0 12px 32px -16px rgba(51,41,33,.28)">{body}</article></div>')
        else:
            new = (f'<div data-r74 style="margin-top: {{{{sheetTop}}}}px; box-sizing: border-box; min-height: calc(100% - {{{{sheetTop}}}}px); padding: 24px 0 160px; background: {FILL}; display: flex; justify-content: center">'
                   f'<div style="zoom: 1.4">{A4PAGE(CREDIT, None)}</div></div>')
        t = t[:i] + new + t[j:]
    # the settings' Arrangement says it is not written for this song; Your arrangement is offered after the accompaniment
    if 'data-r74y' not in t:
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
        yours = (f'<a data-r74y href="Editor{sfx}" style="border-radius: 12px; background: #FEFDFB; box-shadow: 0 0 0 1px rgba(51,41,33,.07); min-height: 60px; box-sizing: border-box; padding: 8px 12px 8px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none">'
                 f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">Your arrangement</span><span style="font-size: 14px; color: {SOFT}">Write your own, from this accompaniment</span></span><span aria-hidden="true" style="display: flex; color: {SOFT}">{CHEVR}</span></a>')
        t = t[:close] + yours + t[close:]
    # the song's page is gone: its Settings and an editor's Edit the original join the song's menu, before Print and Export
    if 'data-r74m' not in t:
        i = t.index('<span>Print</span>'); j = t.rindex('<button type="button" role="menuitem"', 0, i)
        st = 'min-height: 44px; box-sizing: border-box; padding: 0 16px; display: flex; align-items: center; gap: 12px; width: 100%; color: #332921; font-size: 15px; text-decoration: none'
        GEAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
        PEN = PENI.replace('width="18" height="18"', 'width="20" height="20"')
        items = (f'<a data-r74m role="menuitem" href="SongSettings{sfx}" style="{st}">{GEAR}<span>Settings</span></a>'
                 f'<a role="menuitem" href="EditorDraft{sfx}" style="{st}; box-shadow: inset 0 1px 0 #EFE9E1">{PEN}<span>Edit the original</span></a>')
        t = t[:j] + items + t[j:].replace('border-top: 0"', 'border-top: 1px solid #EFE9E1"', 1)
    if name == 'PlayerDesk': t = player_rail(t)
    p.write_text(t)
print('r74 versions ok')
