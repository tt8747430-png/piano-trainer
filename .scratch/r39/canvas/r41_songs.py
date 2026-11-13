# R41 Songs: the library (Apple Music's Library and Mindscape, the library rulings), a song's page (Apple Music's album
# page and forScore's score info: the music is the cover, one next act), the score editor (Flat for iPhone: the page is
# the work, one quiet bar, a palette with named categories).

def cover(title, by, w=150, notes=(2, 4, 4, 3, 2, 0, -1)):
    st = ''.join(f'<path d="M8 {46 + i * 5}H{w - 8}" stroke="{INK}" stroke-width=".6"></path>' for i in range(5))
    n = ''.join(f'<ellipse cx="{30 + i * (w - 44) / len(notes):.1f}" cy="{66 - p * 2.5}" rx="3" ry="2.3" fill="{INK}"></ellipse>' for i, p in enumerate(notes))
    return (f'<svg viewBox="0 0 {w} 96" width="100%" aria-hidden="true" style="display: block; border-radius: 10px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 6px 14px -8px rgba(51,41,33,.25)">'
            f'<text x="{w / 2}" y="20" text-anchor="middle" font-family="{SERIF}" font-size="12" fill="{INK}">{title}</text><text x="{w / 2}" y="32" text-anchor="middle" font-size="7" fill="{SOFT}">{by}</text>'
            f'{st}<text x="9" y="70" font-family="Noto Music, serif" font-size="24" fill="{INK}">𝄞</text>{n}</svg>')
SHELF = [('Amazing Grace', 'John Newton', 'Bar 9 of 16', '56%'), ('Twinkle, Twinkle', 'Traditional', 'Bar 5 of 12', '40%'), ('Für Elise', 'Beethoven', 'Bar 3 of 24', '12%')]
def shelf(w, n=3):
    cards = ''.join(f'<a href="{{SONG}}" style="flex: none; width: {w}px; display: flex; flex-direction: column; gap: 6px; color: {INK}; text-decoration: none">{cover(t, b)}<span style="font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{t}</span><span style="height: 3px; border-radius: 2px; background: {FILL}"><span style="display: block; width: {p}; height: 3px; border-radius: 2px; background: #C26A2E"></span></span><span style="font-size: 13px; color: {SOFT}">{s}</span></a>' for t, b, s, p in SHELF[:n])
    return f'<section style="display: flex; flex-direction: column; gap: 8px">{H2("Continue")}<div class="nos" style="display: flex; gap: 12px; overflow-x: auto">{cards}</div></section>'

from urllib.parse import quote as _q
def INCIPIT(notes):
    st = ''.join(f'<path d="M5 {13 + i * 4.5}H39" stroke="#332921" stroke-width=".7" opacity=".55"/>' for i in range(5))
    n = ''.join(f'<ellipse cx="{11 + i * 26 / max(1, len(notes) - 1):.1f}" cy="{31 - p * 2.25}" rx="2.6" ry="2" fill="#332921" transform="rotate(-20 {11 + i * 26 / max(1, len(notes) - 1):.1f} {31 - p * 2.25})"/>' for i, p in enumerate(notes))
    return 'url("data:image/svg+xml,' + _q(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="#FFFFFF"/>{st}{n}</svg>') + '")'
def STACK(c):
    pg = lambda x, y, r: f'<g transform="rotate({r} {x + 12} {y + 15})"><rect x="{x}" y="{y}" width="24" height="30" rx="3" fill="#FFFFFF" stroke="#332921" stroke-opacity=".18"/>' + ''.join(f'<path d="M{x + 4} {y + 12 + i * 3}H{x + 20}" stroke="#332921" stroke-width=".6" opacity=".45"/>' for i in range(5)) + '</g>'
    return 'url("data:image/svg+xml,' + _q(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="{c}"/>{pg(6, 9, -10)}{pg(14, 7, 8)}</svg>') + '")'
INC = {'Amazing Grace': (0, 3, 5, 4, 5), 'Für Elise': (6, 5, 6, 5, 6, 3), 'Let It Be': (3, 3, 3, 4, 2), 'Clair de lune': (5, 5, 3, 2, 1), 'Twinkle, Twinkle, Little Star': (0, 0, 4, 4, 5, 5), 'Ode to Joy': (2, 2, 3, 4, 4, 3), 'Jingle Bells': (2, 2, 2, 2, 2, 2), 'My first song': (0, 2, 4, 2)}
def S(t, s, v, i, c, places=(), tags=(), href='Song.dc.html', ic=INK):
    pic = STACK(c) if href == '#' else INCIPIT(INC.get(t, (2, 4)))
    return {'folder': href == '#', 'pic': pic, 't': t, 's': s, 'v': v, 'i': '' , 'c': c, 'ic': ic, 'href': href, 'places': list(places), 'tags': list(tags)}
SONGS_D = {'places': ['All', 'Favourites', 'Recently played', 'Learning', 'Learned'], 'sorts': ['Last played', 'Title', 'Composer', 'Added'], 'favs': ['Amazing Grace', 'Clair de lune'],
  'open': {'Folders': True, 'Songs': True},
  'filters': [{'name': 'Key', 'opts': [['C major', 4], ['G major', 2], ['D major', 1], ['A minor', 1], ['D♭ major', 1]]}, {'name': 'Level', 'opts': [['Beginner', 6], ['Intermediate', 2], ['Advanced', 1]]}],
  'sections': [
    {'g': 'Folders', 'rows': [S('Songs to learn', '23 songs · 4 learned', '', '♪', HONEY, href='Folder.dc.html'), S('Hymns', '6 songs · 2 learned', '', '♪', SKY, href='Folder.dc.html'), S('Called to Play', '15 songs · Book 1', '', '♪', LILAC, href='Folder.dc.html'), S('Shared with me', "4 songs · From Maria's group", '', '♪', SAGE, href='Groups.dc.html')]},
    {'g': 'Songs', 'rows': [
      S('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'G', HONEY, ('Recently played', 'Learning'), ('G major', 'Beginner')),
      S('Für Elise', 'Beethoven · A minor', 'Learning', 'Am', PEACH, ('Recently played', 'Learning'), ('A minor', 'Intermediate')),
      S('Let It Be', 'The Beatles · C major', 'Learned', 'C', SAGE, ('Learned',), ('C major', 'Beginner')),
      S('Clair de lune', 'Debussy · D♭ major', '', 'D♭', SKY, (), ('D♭ major', 'Advanced')),
      S('Twinkle, Twinkle, Little Star', 'Traditional · C major', 'Learned', 'C', SAGE, ('Recently played', 'Learned'), ('C major', 'Beginner')),
      S('Ode to Joy', 'Beethoven · D major', '', 'D', LILAC, (), ('D major', 'Beginner')),
      S('Jingle Bells', 'James Lord Pierpont · G major', '', 'G', HONEY, (), ('G major', 'Beginner')),
      S('My first song', 'Written by you · C major', '', 'C', FILL, (), ('C major', 'Beginner'))]}]}
library('Songs', 'My songs', SONGS_D, soft='Explore', soft_href='Explore', right_extra=IB('Archive', ARCHIVE, href='Archive.dc.html'), root='Songs', section='Songs',
        shelf_phone=shelf(132).replace('{SONG}', 'Song.dc.html'), shelf_laptop=shelf(170).replace('{SONG}', 'SongLaptop.dc.html').replace(f'<section', '<section style="margin-bottom: 14px"', 1).replace('style="margin-bottom: 14px" style=', 'style='),
        table_cols=(('Title', 't', 3), ('Composer and key', 's', 3), ('Progress', 'v', 1.4)),
        add_items=(('New song', '#'), ('Record', '#'), ('New folder', '#'), ('Import', '#'), ('New group', 'Groups.dc.html')),
        more_rows=(('link', 'Select', ''), ('link', 'Export…', '')))

# ── a song's page ──
SG = js(r'''
    const learned = !!st.learned, fav = st.fav ?? true, hear = st.hear ?? -1;
    const CH = [['G', [55, 59, 62]], ['G7', [55, 59, 62, 65]], ['C', [60, 64, 67]], ['D', [62, 66, 69]], ['D7', [62, 66, 69, 72]], ['Em', [64, 67, 71]]];
    return { ...common(st, set), creditsOn: st.sheet === 'credits', openCredits: () => set({ sheet: 'credits' }),
      learned, notLearned: !learned, toggleLearned: () => set({ learned: !learned }), learnedBg: learned ? '#DCE9D6' : 'transparent', learnedRing: learned ? '#9BC093' : '#DAD1C8',
      fav, heartFill: fav ? '#B84A3E' : 'none', heartStroke: fav ? '#B84A3E' : '#332921', toggleFav: () => set({ fav: !fav }),
      chords: CH.map(([c, ns], i) => { const kb = calmKeys(53, 76, Object.fromEntries(ns.map((n) => [n, [i === hear ? '#EDC684' : '#E9C4B8', '']])), 104, 46); return { c, kb, ring: i === hear ? '0 0 0 2px #EDC684' : '0 0 0 1px #DAD1C8', hear: () => set({ hear: i }) }; }) };''')
MINIKEYS = f'<div style="position: relative; width: 104px; height: 46px; border-radius: 6px; overflow: hidden; background: {LINE}"><sc-for list="{{{{c.kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: 46px; box-sizing: border-box; border-right: 1px solid rgba(51,41,33,.14); background: {{{{k.bg}}}}"></span></sc-for><sc-for list="{{{{c.kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: 28px; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}"></span></sc-for></div>'
CHORDS_ROW = f'<div class="nos" style="display: flex; gap: 10px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px 4px"><sc-for list="{{{{chords}}}}" as="c" hint-placeholder-count="6"><button type="button" onClick="{{{{c.hear}}}}" aria-label="Hear {{{{c.c}}}}" style="flex: none; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: {{{{c.ring}}}}; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; color: {INK}">{MINIKEYS}<span style="font-size: 16px; font-weight: 700">{{{{c.c}}}}</span></button></sc-for></div>'
LEARNED = f'<button type="button" aria-pressed="{{{{learned}}}}" onClick="{{{{toggleLearned}}}}" style="height: 44px; padding: 0 12px; border: solid transparent; border-width: 5px 0; background-clip: padding-box; border-radius: 22px; background-color: {{{{learnedBg}}}}; box-shadow: inset 0 0 0 1.5px {{{{learnedRing}}}}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px">{CHECK} Learned</button>'
HEARTB = f'<button type="button" aria-label="Favourite" aria-pressed="{{{{fav}}}}" onClick="{{{{toggleFav}}}}" style="width: 44px; height: 44px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 24 24" width="22" height="22" fill="{{{{heartFill}}}}" stroke="{{{{heartStroke}}}}" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"></path></svg></button>'
FACTS = f'<div style="display: flex; padding: 4px 0">' + ''.join(f'<div style="flex: 1; display: flex; flex-direction: column; gap: 2px; {"box-shadow: inset 1px 0 0 " + LINE + "; padding-left: 14px" if i else ""}"><span style="font-size: 13px; color: {SOFT}">{a}</span><span style="font-size: 17px; font-weight: 600">{b}</span></div>' for i, (a, b) in enumerate([('Key', 'G major'), ('Time', '3/4'), ('Tempo', '80 BPM')])) + '</div>'
COVER_BIG = lambda w, sz: f'<div style="border-radius: 14px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 14px 30px -18px rgba(51,41,33,.45); padding: 16px 16px 6px; display: flex; flex-direction: column; gap: 4px"><div style="display: flex; align-items: baseline; justify-content: center; position: relative"><span style="font-family: {SERIF}; font-size: {sz}px">Amazing Grace</span><span style="position: absolute; right: 0; font-size: 11px; color: {SOFT}">John Newton</span></div>{score_svg(w, size=1.0, played=None).replace("aria-label=\"Amazing Grace, bars 1 to 7\"", "aria-label=\"Amazing Grace, the first bars\"")}</div>'
TITLE = f'<div style="display: flex; align-items: center; gap: 6px"><h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.01em">Amazing Grace</h1>{IB("Edit title and credits", PENCIL, "openCredits")}</div><p style="margin: -6px 0 0; font-size: 15px; color: {SOFT}">Words by John Newton · Music: New Britain, an American folk tune</p>'
ACTS_OF = lambda pl: f'<div style="display: flex; gap: 10px">{BTN(PLAY.replace("22", "18") + " Continue from bar 9", href=pl)}{BTN("From the start", href=pl, kind="quiet", grow=False)}</div>' + '<div role="img" aria-label="8 of 16 bars played; bar 9 is next" style="display: flex; flex-direction: column; gap: 6px"><div style="display: flex; gap: 3px">' + ''.join(f'<span title="Bar {i + 1}" style="flex: 1; height: 14px; border-radius: 3px; background: {("#C26A2E" if i < 8 else ("#FEFDFB" if i == 8 else FILL))}; box-shadow: {("inset 0 0 0 2px #C26A2E" if i == 8 else "none")}"></span>' for i in range(16)) + f'</div><div style="display: flex; justify-content: space-between; font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums"><span>Bar 1</span><span>Played 6 times · 42 minutes</span><span>Bar 16</span></div></div>'
ACTS, ACTS_L = ACTS_OF("Player.dc.html"), ACTS_OF("PlayerLaptop.dc.html")
SECTS = GROUP(('link', 'Verse', '2 × · bars 1–16', 'Section.dc.html'), ('link', 'Ending', 'bars 17–20', 'Section.dc.html'), bg=SHEET)
PROGS = GROUP(('link', 'Gospel hymn', '<span style="font-family: ' + SERIF + '">I – IV – I – V</span>', 'Progression.dc.html'), ('link', 'Authentic cadence', '<span style="font-family: ' + SERIF + '">I – V – I</span>', 'Progression.dc.html'), bg=SHEET)
DETAILS = GROUP(('link', 'Level', 'Beginner', ''), ('link', 'Genre', 'Hymn', ''), ('link', 'Language', 'English', ''), ('link', 'Tags', 'Add tags', ''), bg=SHEET)
SONG_MORE = GROUP(('link', 'Edit score', '', 'Editor.dc.html'), ('link', 'Edit the original', 'Editors', 'EditorDraft.dc.html'), ('link', 'Settings', '', 'SongSettings.dc.html'), ('link', 'Share', '', ''), ('link', 'Export…', 'MusicXML, MIDI, PDF', ''), ('action', 'Archive', 'closeSheet', '#B3261E'), bg=SHEET)
CREDITS = GROUP(('link', 'Title', 'Amazing Grace', ''), ('link', 'Words by', 'John Newton', ''), ('link', 'Music', 'New Britain', ''), bg=SHEET)
ph = f'''{TOP('Songs.dc.html', '', LEARNED + HEARTB + DOTS())}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 60px; display: flex; flex-direction: column; gap: 16px">
{COVER_BIG(330, 17)}{TITLE}{FACTS}{ACTS}
<section style="display: flex; flex-direction: column; gap: 10px">{H2('Chords')}{CHORDS_ROW}{PROGS}</section>
<section style="display: flex; flex-direction: column; gap: 10px">{H2('Sections')}{SECTS}</section>
<section style="display: flex; flex-direction: column; gap: 10px">{H2('Details')}{DETAILS}</section>
</main>'''
sh = BSHEET('moreOn', 'Amazing Grace', SONG_MORE) + BSHEET('creditsOn', 'Title and credits', CREDITS)
lm = f'''{LTOP('SongsLaptop.dc.html', LEARNED + HEARTB + DOTS())}
<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: grid; grid-template-columns: 520px minmax(0, 1fr); gap: 48px; padding: 4px 56px 40px; align-items: start">
<div style="display: flex; flex-direction: column; gap: 18px">{COVER_BIG(480, 22)}{TITLE}{FACTS}{ACTS_L}</div>
<div style="display: flex; flex-direction: column; gap: 24px; padding-top: 4px"><section style="display: flex; flex-direction: column; gap: 10px">{H2('Chords')}{CHORDS_ROW.replace('overflow-x: auto; margin: 0 -16px; padding: 2px 16px 4px', 'flex-wrap: wrap; padding: 2px')}{PROGS}</section>
<section style="display: flex; flex-direction: column; gap: 10px">{H2('Sections')}{SECTS.replace('Section.dc.html', 'SectionLaptop.dc.html')}</section>
<section style="display: flex; flex-direction: column; gap: 10px">{H2('Details')}{DETAILS}</section></div>
</div>'''
pl = POPOVER('moreOn', 'Amazing Grace', SONG_MORE.replace('EditorDraft.dc.html', 'EditorDraftLaptop.dc.html').replace('Editor.dc.html', 'EditorLaptop.dc.html').replace('SongSettings.dc.html', 'SongSettingsLaptop.dc.html')) + POPOVER('creditsOn', 'Title and credits', CREDITS, 'left: 120px; top: 520px', 420)
detail('Song', 'A song', SG, ph, lm, '', sh, pl, 'Songs')
s = open(OUT + 'SongLaptop.dc.html').read().replace('href="Progression.dc.html"', 'href="ProgressionLaptop.dc.html"'); open(OUT + 'SongLaptop.dc.html', 'w').write(s)

# ── the score editor ──
ED = js(r'''
    const CATS = ['Notes', 'Accidentals', 'Articulation', 'Dynamics', 'Bar', 'Text'];
    const T = { Notes: ['𝄽', '𝅝', '𝅗𝅥', '𝅘𝅥', '𝅘𝅥𝅮', '𝅘𝅥𝅯', '·', 'Tie', '3'], Accidentals: ['𝄫', '♭', '♮', '♯', '𝄪'], Articulation: ['Staccato', 'Accent', 'Tenuto', 'Marcato', 'Fermata', 'Slur'],
      Dynamics: ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff', 'cresc.', 'dim.'], Bar: ['3/4', 'Key', 'Clef', '𝄆', '𝄇', '𝄁', '+ Bar', '♩ ='], Text: ['Chord', 'Lyrics', 'Text', 'Roman', 'Mark'] };
    const cat = st.cat ?? 'Notes', tool = st.tool ?? '𝅗𝅥', keys = st.keys ?? true, full = !!st.full;
    const tiles = (c) => T[c].map((l) => ({ l, bg: l === tool ? '#332921' : '#FEFDFB', fg: l === tool ? '#FEFDFB' : '#332921', fs: l.length > 2 ? 13 : (/[a-z]/.test(l) ? 17 : 24), pick: () => set({ tool: l }) }));
    const marks = { 67: ['#85B8DC', ''] };
    return { ...common(st, set), cats: seg(CATS, cat, (l) => set({ cat: l })), tools: tiles(cat), all: CATS.map((c) => ({ c, tools: tiles(c) })),
      keysOn: keys, keysBg: keys ? '#332921' : 'transparent', keysFg: keys ? '#FEFDFB' : '#332921', toggleKeys: () => set({ keys: !keys }), full, folded: !full, toggleFull: () => set({ full: !full }),
      kb: calmKeys(48, 79, marks, 402, 150), kbL: calmKeys(36, 96, marks, 1462, 150) };''')
def EDTOP(done):
    return (f'<header style="flex: none; height: 44px; display: flex; align-items: center; gap: 2px; padding: 0 8px 0 16px"><a href="{done}" style="height: 44px; display: flex; align-items: center; color: {LINK}; text-decoration: none; font-size: 17px; font-weight: 600">Done</a><span style="flex: 1"></span>'
            f'{IB("Undo", UNDO)}{IB("Redo", REDO)}<span style="width: 1px; height: 22px; background: {LINE}; margin: 0 6px"></span>'
            f'<button type="button" aria-label="Piano keys" aria-pressed="{{{{keysOn}}}}" onClick="{{{{toggleKeys}}}}" style="width: 40px; height: 36px; border: 0; border-radius: 10px; background: {{{{keysBg}}}}; color: {{{{keysFg}}}}; display: flex; align-items: center; justify-content: center">{KEYSI}</button>'
            f'<span style="width: 4px"></span>{PLAYBTN(36).replace("22", "16").replace("20", "15")}{DOTS()}</header>')
def SCOREPAGE(w, size, pad):
    return (f'<div style="border-radius: 4px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 10px 24px -16px rgba(51,41,33,.4); padding: {pad}; display: flex; flex-direction: column; gap: 4px">'
            f'<div style="text-align: center; font-family: {SERIF}; font-size: {round(22 * size)}px">Amazing Grace</div><div style="display: flex; justify-content: space-between; font-size: {round(10 * size)}px; color: {SOFT}"><span>Verse · ♩ = 80</span><span>Words: John Newton · Music: New Britain</span></div>'
            + score_svg(w, sel=5, size=size).replace(ACCENT, '#85B8DC') + '</div>')
TILE = f'<button type="button" onClick="{{{{t.pick}}}}" style="flex: none; min-width: 46px; height: 46px; padding: 0 8px; border: 0; border-radius: 11px; background: {{{{t.bg}}}}; color: {{{{t.fg}}}}; box-shadow: 0 0 0 1px {LINE}; font-family: \'Noto Music\', {FONT}; font-size: {{{{t.fs}}}}px; font-weight: 600">{{{{t.l}}}}</button>'
PALETTE = (f'<div style="flex: none; border-radius: 18px 18px 0 0; background: {SHEET}; box-shadow: 0 -1px 0 {LINE}, 0 -10px 24px -18px rgba(51,41,33,.4); padding: 4px 0 6px; display: flex; flex-direction: column; gap: 8px">'
           f'<button type="button" aria-label="Open the palette" onClick="{{{{toggleFull}}}}" style="align-self: center; width: 60px; height: 18px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></span></button>'
           f'<sc-if value="{{{{folded}}}}" hint-placeholder-val="{{{{true}}}}"><div class="nos" style="display: flex; gap: 6px; overflow-x: auto; padding: 0 12px"><sc-for list="{{{{tools}}}}" as="t" hint-placeholder-count="9">{TILE}</sc-for></div><div class="nos" style="overflow-x: auto; padding: 0 12px"><div style="width: 560px">{SEGC("cats", 30, 13)}</div></div></sc-if>'
           f'<sc-if value="{{{{full}}}}" hint-placeholder-val="{{{{false}}}}"><div class="nos" style="max-height: 330px; overflow-y: auto; padding: 0 12px; display: flex; flex-direction: column; gap: 12px"><sc-for list="{{{{all}}}}" as="a" hint-placeholder-count="6">{CAPS("{{a.c}}")}<div style="display: flex; flex-wrap: wrap; gap: 6px"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="6">{TILE}</sc-for></div></sc-for></div></sc-if></div>')
PIANO = lambda k, h: f'<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; background: {SHEET}; padding: 0 0 26px">{KEYS(h).replace("kb.", k + ".").replace("border-radius: 14px;", "border-radius: 0;")}</div></sc-if>'
ED_MORE = GROUP(('link', 'Instruments and staves', 'Piano', ''), ('link', 'Page layout', '', ''), ('link', 'Playback sound', 'Grand piano', ''), ('link', 'MIDI keyboard', 'Not connected', ''), bg=SHEET)
eph = f'''{EDTOP('Song.dc.html')}
<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 6px 10px 12px">{SCOREPAGE(360, 0.95, '14px 12px 8px')}</div>
{PALETTE}{PIANO('kb', 130)}'''
elm = f'''<header style="flex: none; height: 64px; display: flex; align-items: center; gap: 2px; padding: 0 24px 0 40px"><a href="SongLaptop.dc.html" style="height: 44px; display: flex; align-items: center; color: {LINK}; text-decoration: none; font-size: 17px; font-weight: 600">Done</a><span style="flex: 1"></span>{EDTOP('SongLaptop.dc.html').split('<span style="flex: 1"></span>')[1].replace('</header>', '')}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 340px">
<div class="nos" style="min-height: 0; overflow-y: auto; padding: 8px 48px 24px; display: flex; justify-content: center"><div style="width: 760px">{SCOREPAGE(720, 1.25, '32px 40px 16px')}</div></div>
<aside class="nos" aria-label="Palette" style="min-height: 0; overflow-y: auto; background: {SHEET}; box-shadow: -1px 0 0 {LINE}; padding: 20px 18px; display: flex; flex-direction: column; gap: 12px"><sc-for list="{{{{all}}}}" as="a" hint-placeholder-count="6">{CAPS("{{a.c}}")}<div style="display: flex; flex-wrap: wrap; gap: 6px"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="6">{TILE}</sc-for></div></sc-for></aside>
</div>{PIANO('kbL', 150).replace('padding: 0 0 26px', 'padding: 0; box-shadow: 0 -1px 0 ' + LINE)}'''
detail('Editor', 'Score editor', ED, eph, elm, '', BSHEET('moreOn', 'Score settings', ED_MORE), POPOVER('moreOn', 'Score settings', ED_MORE), 'Songs')
print('songs ok')
