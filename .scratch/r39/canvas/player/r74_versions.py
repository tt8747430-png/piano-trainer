# R74 (owner, 2026-11-26): the Player says plainly that it shows an accompaniment made from the chords, opens on it
# (almost every song has only that), offers the learner's own arrangement where the versions are chosen, and its bar
# holds the one version-and-mode control (MODESW). Run after r43_player.py, and by r41.py on the built boards; idempotent.
import re, pathlib, sys; sys.path.insert(0, "/home/user/piano-trainer/.scratch/r39/canvas")
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/calm_kit.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r41_kit.py').read())
OUT = pathlib.Path('/home/user/piano-trainer/.scratch/r39/canvas/practice/project')
OLDSW = re.compile(r'<div role="radiogroup" aria-label="Mode" style="display: flex; border-radius: 22px;.*?</div>', re.S)
CHEVR = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>'
for name, sfx in (('PlayerApp', '.dc.html'), ('PlayerDesk', 'Laptop.dc.html')):
    p = OUT / f'{name}.dc.html'; t = p.read_text()
    NEWSW = re.compile(r'<div role="group" aria-label="Version and mode".*?</a></div>', re.S)
    if 'aria-label="Version and mode"' in t:
        t, n = NEWSW.subn(lambda m: MODESW('play', 'Editor' + sfx), t, count=1)
    else:
        t, n = OLDSW.subn(lambda m: MODESW('play', 'Editor' + sfx), t, count=1)
    assert n == 1, name
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
    # its own line under the credits, as an engraver prints an arrangement's credit (on the tempo's line it ran into
    # "1 · Verse · ♩ = 80" at 393): the score under it moves down one line, its playhead and loop grips with it
    phone = name == 'PlayerApp'
    MARK = f'<p data-r74 style="position: absolute; left: 0; right: 0; top: {64 if phone else 90}px; margin: 0; text-align: center; font-size: 13px; line-height: 15px; font-style: italic; color: #685E56">Accompaniment from the chords</p>'
    if 'data-r74 ' not in t:
        a = t.index('margin-top: {{sheetTop}}px; padding: ')
        i = t.rindex('<div', 0, a); depth = 0
        for m in re.finditer(r'<(/?)div\b', t[i:]):
            depth += -1 if m.group(1) else 1
            if depth == 0: j = i + m.end(); break
        seg = t[i:j]
        pad = 75 if phone else 105
        seg = seg.replace(f'margin-top: {{{{sheetTop}}}}px; padding: {pad}px', f'margin-top: {{{{sheetTop}}}}px; padding: {pad + 18}px', 1)
        seg = re.sub(r'top: (\d+(?:\.\d+)?)px', lambda m: f'top: {float(m.group(1)) + 18:g}px' if float(m.group(1)) >= 70 else m.group(0), seg)
        seg = re.sub(r'top: \{\{((?:lb|sheetGA|sheetGB|cur)\.y)\}\}px', r'top: calc({{\1}}px + 18px)', seg)
        seg = seg.replace('Words: John Newton · Music: New Britain (American folk tune)</p>', 'Words: John Newton · Music: New Britain (American folk tune)</p>' + MARK, 1)
        t = t[:i] + seg + t[j:]
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
    p.write_text(t)
print('r74 versions ok')
