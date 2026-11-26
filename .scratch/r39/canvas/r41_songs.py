# R41 Songs: the library (Apple Music's Library and Mindscape, the library rulings), a song's page (Apple Music's album
# page and forScore's score info: the music is the cover, one next act), the score editor (Flat for iPhone: the page is
# the work, one quiet bar, a palette with named categories).

def cover(title, by, w=150, notes=(2, 4, 4, 3, 2, 0, -1)):
    st = ''.join(f'<path d="M8 {46 + i * 5}H{w - 8}" stroke="{INK}" stroke-width=".6"></path>' for i in range(5))
    n = ''.join(f'<ellipse cx="{30 + i * (w - 44) / len(notes):.1f}" cy="{66 - p * 2.5}" rx="3" ry="2.3" fill="{INK}"></ellipse>' for i, p in enumerate(notes))
    return (f'<svg viewBox="0 0 {w} 96" width="100%" aria-hidden="true" style="display: block; border-radius: 10px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 6px 14px -8px rgba(51,41,33,.25)">'
            f'<text x="{w / 2}" y="20" text-anchor="middle" font-family="{SERIF}" font-size="12" fill="{INK}">{title}</text><text x="{w / 2}" y="32" text-anchor="middle" font-size="7" fill="{SOFT}">{by}</text>'
            f'{st}<text x="9" y="66" font-family="Noto Music, serif" font-size="20" fill="{INK}">𝄞</text>{n}</svg>')
SHELF = [('Amazing Grace', 'John Newton', 'Bar 9 of 16', '56%'), ('Ode to Joy', 'Beethoven', 'Bar 5 of 12', '40%'), ('Für Elise', 'Beethoven', 'Bar 3 of 24', '12%')]
def shelf(w, n=3):
    cards = ''.join(f'<a href="{{SONG}}" style="flex: none; width: {w}px; display: flex; flex-direction: column; gap: 8px; color: {INK}; text-decoration: none">{cover(t, b, notes=INC.get(t, (2, 4, 4, 3, 2, 0, -1)))}<span style="font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{t}</span><span style="height: 3px; border-radius: 2px; background: {FILL}"><span style="display: block; width: {p}; height: 3px; border-radius: 2px; background: #C26A2E"></span></span><span style="font-size: 13px; color: {SOFT}">{s}</span></a>' for t, b, s, p in SHELF[:n])
    return f'<section style="display: flex; flex-direction: column; gap: 8px">{H2("Continue")}<div class="nos" style="display: flex; gap: 12px; overflow-x: auto">{cards}</div></section>'

from urllib.parse import quote as _q
def INCIPIT(notes):
    st = ''.join(f'<path d="M5 {13 + i * 4.5}H39" stroke="#332921" stroke-width=".7" opacity=".55"/>' for i in range(5))
    n = ''.join(f'<ellipse cx="{11 + i * 26 / max(1, len(notes) - 1):.1f}" cy="{31 - p * 2.25}" rx="2.6" ry="2" fill="#332921" transform="rotate(-20 {11 + i * 26 / max(1, len(notes) - 1):.1f} {31 - p * 2.25})"/>' for i, p in enumerate(notes))
    return 'url("data:image/svg+xml,' + _q(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="#FFFFFF"/>{st}{n}</svg>') + '")'
def STACK(c):
    pg = lambda x, y, r: f'<g transform="rotate({r} {x + 12} {y + 15})"><rect x="{x}" y="{y}" width="24" height="30" rx="3" fill="#FFFFFF" stroke="#332921" stroke-opacity=".18"/>' + ''.join(f'<path d="M{x + 4} {y + 12 + i * 3}H{x + 20}" stroke="#332921" stroke-width=".6" opacity=".45"/>' for i in range(5)) + '</g>'
    return 'url("data:image/svg+xml,' + _q(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" fill="{c}"/>{pg(6, 9, -10)}{pg(14, 7, 8)}</svg>') + '")'
INC = {'Holy, Holy, Holy': (2, 2, 4, 4, 5, 5), 'Abide with Me': (4, 4, 3, 2, 3), 'Be Thou My Vision': (2, 2, 3, 4, 3, 2), 'It Is Well': (4, 4, 3, 2, 2), 'Great Is Thy Faithfulness': (0, 2, 4, 4, 5), 'Silent Night': (4, 5, 4, 2), 'Amazing Grace': (0, 3, 5, 4, 5), 'Für Elise': (6, 5, 6, 5, 6, 3), 'Let It Be': (3, 3, 3, 4, 2), 'Clair de lune': (5, 5, 3, 2, 1), 'Twinkle, Twinkle, Little Star': (0, 0, 4, 4, 5, 5), 'Ode to Joy': (2, 2, 3, 4, 4, 3), 'Jingle Bells': (2, 2, 2, 2, 2, 2), 'My first song': (0, 2, 4, 2)}
def S(t, s, v, i, c, places=(), tags=(), href='Song.dc.html', ic=INK):
    folder = href in ('#', 'Folder.dc.html') or t == 'Shared with me'
    pic = STACK(c) if folder else INCIPIT(INC.get(t, (2, 4)))
    return {'folder': folder, 'pic': pic, 't': t, 's': s, 'v': v, 'i': '' , 'c': c, 'ic': ic, 'href': href, 'places': list(places), 'tags': list(tags)}
SONGS_D = {'emptyLib': {'t': 'Your library is empty', 'b': 'Create a song, or restore items from the archive.', 'btn': 'New song', 'arch': 'Archive.dc.html'}, 'places': ['All', 'Favourites', 'Learning', 'Learned'], 'sorts': ['Last played', 'Title', 'Composer', 'Added'], 'favs': ['Amazing Grace', 'Clair de lune'],
  'open': {'Folders': True, 'Songs': True},
  'filters': [{'name': 'Key', 'opts': [['C major', 4], ['G major', 2], ['D major', 1], ['A minor', 1], ['D♭ major', 1]]}, {'name': 'Level', 'opts': [['Beginner', 6], ['Intermediate', 2], ['Advanced', 1]]}],
  'sections': [
    {'g': 'Folders', 'rows': [S('Songs to learn', '23 songs · 4 learned', '', '♪', HONEY, href='Folder.dc.html'), S('Hymns', '6 songs · 2 learned', '', '♪', SKY, href='Folder.dc.html'), S('Called to Play', '15 songs · Book 1', '', '♪', LILAC, href='Folder.dc.html'), S('Shared with me', "4 songs · From Maria's group", '', '♪', SAGE, href='Groups.dc.html')]},
    {'g': 'Songs', 'rows': [
      S('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'G', HONEY, ('Recently played', 'Learning'), ('G major', 'Beginner')),
      S('Für Elise', 'Beethoven · A minor', 'Bar 3 of 24', 'Am', PEACH, ('Recently played', 'Learning'), ('A minor', 'Intermediate')),
      S('Let It Be', 'The Beatles · C major', 'Learned', 'C', SAGE, ('Learned',), ('C major', 'Beginner')),
      S('Clair de lune', 'Debussy · D♭ major', '', 'D♭', SKY, (), ('D♭ major', 'Advanced')),
      S('Twinkle, Twinkle, Little Star', 'Traditional · C major', 'Learned', 'C', SAGE, ('Recently played', 'Learned'), ('C major', 'Beginner')),
      S('Ode to Joy', 'Beethoven · D major', 'Bar 5 of 12', 'D', LILAC, ('Recently played', 'Learning'), ('D major', 'Beginner')),
      S('Jingle Bells', 'James Lord Pierpont · G major', '', 'G', HONEY, (), ('G major', 'Beginner')),
      S('My first song', 'Written by you · C major', '', 'C', FILL, (), ('C major', 'Beginner'))]}]}
library('Songs', 'My songs', SONGS_D, soft='Explore', soft_href='Explore', right_extra=IB('Archive', ARCHIVE, href='Archive.dc.html'), root='Songs', section='Songs',
        shelf_phone=shelf(132).replace('{SONG}', 'Song.dc.html'), shelf_laptop=shelf(170).replace('{SONG}', 'SongLaptop.dc.html').replace(f'<section', '<section style="margin-bottom: 14px"', 1).replace('style="margin-bottom: 14px" style=', 'style='),
        table_cols=(('Title', 't', 3), ('Composer and key', 's', 3), ('Progress', 'v', 1.4)),
        add_items=(('New song', '#'), ('Record', '#'), ('New folder', '#'), ('Import', '#'), ('New group', 'Groups.dc.html')),
        more_rows=(('link', 'Select', ''), ('link', 'Export…', ''), ('link', 'Trash', '', '')))

# ── a song's page ──
SG = js(r'''
    const learned = !!st.learned, fav = st.fav ?? true, hear = st.hear ?? -1;
    const CH = [['G', [55, 59, 62]], ['G7', [55, 59, 62, 65]], ['C', [60, 64, 67]], ['D', [62, 66, 69]], ['D7', [62, 66, 69, 72]], ['Em', [64, 67, 71]]];
    const demo = st.demo ?? null, fresh = demo === 'new', long = demo === 'long', bare = demo === 'nochords';
    const states = [['new', 'Never played'], ['long', 'A long title'], ['nochords', 'No chord symbols']].map(([k, l]) => ({ l, bg: demo === k ? '#332921' : '#EEE9E2', fg: demo === k ? '#FEFDFB' : '#332921', pick: () => set({ demo: demo === k ? null : k }) }));
    return { ...common(st, set), states, played: !fresh, fresh, hasChords: !bare, titleT: long ? 'Fantaisie-Impromptu in C♯ minor, Op. 66' : 'Amazing Grace', coverBy: long ? 'Frédéric Chopin' : 'Words: John Newton · Music: New Britain (American folk tune)', creditT: long ? 'Frédéric Chopin · published after his death, 1855' : 'Words: John Newton · Music: New Britain (American folk tune)', creditsOn: st.sheet === 'credits', openCredits: () => set({ sheet: 'credits' }),
      learned, notLearned: !learned, toggleLearned: () => set({ learned: !learned }), learnedBg: learned ? '#DCE9D6' : 'rgba(254,253,251,.86)', learnedLine: learned ? '#9BC093' : '#DAD1C8', learnedFg: learned ? '#44684A' : '#332921',
      fav, heartFill: fav ? '#B84A3E' : 'none', heartStroke: fav ? '#B84A3E' : '#332921', toggleFav: () => set({ fav: !fav }),
      chords: CH.map(([c, ns], i) => { const kb = calmKeys(53, 76, Object.fromEntries(ns.map((n) => [n, [i === hear ? '#EDC684' : '#E9C4B8', '']])), 104, 46); const m = c.match(/^([A-G][♭♯]?m?)(\d+)$/); return { c, r: m ? m[1] : c, x: m ? m[2] : '', kb, ring: i === hear ? '0 0 0 2px #EDC684' : '0 0 0 1px #DAD1C8', hear: () => set({ hear: i }) }; }) };''')
MINIKEYS = f'<div style="position: relative; width: 104px; height: 46px; border-radius: 6px; overflow: hidden; background: {LINE}"><sc-for list="{{{{c.kb.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}; top: 0; width: {{{{k.w}}}}; height: 46px; box-sizing: border-box; border-right: 1px solid rgba(51,41,33,.14); background: {{{{k.bg}}}}"></span></sc-for><sc-for list="{{{{c.kb.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}; top: 0; width: {{{{k.w}}}}; height: 28px; border-radius: 0 0 3px 3px; background: {{{{k.bg}}}}"></span></sc-for></div>'
CHORDS_ROW = f'<div class="nos" style="display: flex; gap: 8px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px 4px"><sc-for list="{{{{chords}}}}" as="c" hint-placeholder-count="6"><button type="button" onClick="{{{{c.hear}}}}" aria-label="Hear {{{{c.c}}}}" style="flex: none; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: {{{{c.ring}}}}; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: {INK}">{MINIKEYS}<span style="font-size: 16px; font-weight: 700">{{{{c.r}}}}<sup style="font-size: max(12px, .6em); vertical-align: .6em; margin-left: 1px">{{{{c.x}}}}</sup></span></button></sc-for></div>'
LEARNED = LEARNEDT
HEARTB = IB('Favourite', f'<svg viewBox="0 0 24 24" width="22" height="22" fill="{{{{heartFill}}}}" stroke="{{{{heartStroke}}}}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>', 'toggleFav', '', 'fav')
FACTS = f'<div style="display: flex; padding: 4px 0">' + ''.join(f'<div style="flex: 1; display: flex; flex-direction: column; gap: 2px; {"box-shadow: inset 1px 0 0 " + LINE + "; padding-left: 14px" if i else ""}"><span style="font-size: 13px; color: {SOFT}">{a}</span><span style="font-size: 17px; font-weight: 600">{b}</span></div>' for i, (a, b) in enumerate([('Key', 'G major'), ('Time', '3/4'), ('Tempo', '80 BPM')])) + '</div>'
COVER_BIG = lambda w, sz: f'<div style="border-radius: 14px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 14px 30px -18px rgba(51,41,33,.45); padding: 16px; display: flex; flex-direction: column; gap: 4px"><div style="display: flex; flex-direction: column; align-items: center; gap: 2px"><span style="max-width: 90%; font-family: {SERIF}; font-size: {sz}px; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{titleT}}}}</span><span style="align-self: flex-end; max-width: 100%; font-size: 12px; line-height: 16px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{coverBy}}}}</span></div>{score_svg(w, size=1.0, played=None, cover=True).replace("aria-label=\"Amazing Grace, bars 1 to 7\"", "aria-label=\"Amazing Grace, the first bars\"")}</div>'
TITLE = f'<div style="display: flex; flex-direction: column; gap: 4px"><div style="display: flex; align-items: center; gap: 8px"><h1 style="margin: 0; min-width: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.15; text-wrap: balance; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{{{{titleT}}}}</h1>{IB("Edit title and credits", PENCIL, "openCredits")}</div></div>'  # owner, 2026-11-26 ("remove all the thigns that i didnt asked for"): the credits print once, in the score's head
ACTS_OF = lambda pl: f'<div style="display: flex; gap: 8px">{BTN(ICON(PLAY, 18) + " Continue from bar 9", href=pl)}{BTN("From the start", href=pl, kind="quiet", grow=False)}</div>' + '<div role="img" aria-label="8 of 16 bars played; bar 9 is next" style="display: flex; flex-direction: column; gap: 8px"><div style="display: flex; gap: 3px">' + ''.join(f'<span title="Bar {i + 1}" style="flex: 1; height: 14px; border-radius: 3px; background: {("#C26A2E" if i < 8 else ("#FEFDFB" if i == 8 else FILL))}; box-shadow: {("inset 0 0 0 2px #C26A2E" if i == 8 else "none")}"></span>' for i in range(16)) + f'</div><div style="display: flex; justify-content: space-between; font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums"><span>Bar 1</span><span>Played 6 times · 42 minutes</span><span>Bar 16</span></div></div>'
FIRST_OF = lambda pl: f'<sc-if value="{{{{fresh}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex">{BTN(ICON(PLAY, 18) + " Practise", href=pl)}</div></sc-if>'  # before a first play: one honey Practise, the column's width
ACTS, ACTS_L = [f'<sc-if value="{{{{played}}}}" hint-placeholder-val="{{{{true}}}}">{ACTS_OF(p)}</sc-if>{FIRST_OF(p)}' for p in ('Player.dc.html', 'PlayerLaptop.dc.html')]
SGSTRIP = f'<div aria-label="Canvas: show a state" style="display: none"><sc-for list="{{{{states}}}}" as="p" hint-placeholder-count="3"><button type="button" onClick="{{{{p.pick}}}}" style="background: {{{{p.bg}}}}">{{{{p.l}}}}</button></sc-for></div>'
SECTS = GROUP(('link', 'Verse', 'bars 1–16', 'Section.dc.html'), bg=SHEET)  # the song's one section, as the app holds it
PROGS = GROUP(('link', 'Gospel hymn', 'I – IV – I – V', 'Progression.dc.html'), ('link', 'Authentic cadence', 'I – V – I', 'Progression.dc.html'), ('link', 'Plagal cadence', 'I – IV – I', 'Progression.dc.html'), bg=SHEET)
DETAILS = GROUP(('link', 'Level', 'Intermediate', ''), ('link', 'Genre', 'Not set', ''), ('link', 'Language', 'Not set', ''), ('link', 'Tags', 'Not set', ''), bg=SHEET)  # a built-in song's, as the app reads them: its course's level, the rest the learner's to set
SONG_MORE = ROWMENU('moreOn', 'Amazing Grace', [('link', 'Edit score', '', 'Editor.dc.html'), ('link', 'Edit the original', '', 'EditorDraft.dc.html'), ('link', 'Settings', '', 'SongSettings.dc.html')])
CREDITS = GROUP(('link', 'Title', 'Amazing Grace', ''), ('link', 'Words', 'John Newton', ''), ('link', 'Music', 'New Britain (American folk tune)', ''), bg=SHEET)
ph = f'''{TOP('Songs.dc.html', '', LEARNED + HEARTB + DOTS())}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 60px; display: flex; flex-direction: column; gap: 16px">
{COVER_BIG(330, 17)}{TITLE}{FACTS}{ACTS}
{SGSTRIP}<sc-if value="{{{{hasChords}}}}" hint-placeholder-val="{{{{true}}}}"><section style="display: flex; flex-direction: column; gap: 12px">{H2('Chords')}{CHORDS_ROW}{PROGS}</section></sc-if>
<section style="display: flex; flex-direction: column; gap: 12px">{H2('Sections')}{SECTS}</section>
<section style="display: flex; flex-direction: column; gap: 12px">{H2('Details')}{DETAILS}</section>
</main>'''
sh = SONG_MORE + BSHEET('creditsOn', 'Title and credits', CREDITS)
# one centred column (owner, 2026-11-16: "the page has one focus"): the song's cover beside its name and Continue as
# the column's head, then its chords, sections and details under it, never a rival column beside it
# the bar stands on the column's edges (scan-first 1): Back on its left edge, the acts ending on its right
_SGBAR = TOP('SongsLaptop.dc.html', '', LEARNED + HEARTB + DOTS(), pad='0')
lm = f'''<div style="flex: none; padding: 0 40px"><div style="width: min(880px, 100%); margin: 0 auto">{_SGBAR}</div></div>
<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 40px 48px">
<div style="width: min(880px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px">
<div style="display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 32px; align-items: end"><div>{COVER_BIG(348, 20)}</div><div style="display: flex; flex-direction: column; gap: 16px">{TITLE}{FACTS}{ACTS_L}</div></div>
{SGSTRIP}<sc-if value="{{{{hasChords}}}}" hint-placeholder-val="{{{{true}}}}"><section style="display: flex; flex-direction: column; gap: 12px">{H2('Chords')}{CHORDS_ROW.replace('display: flex; gap: 8px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px 4px', 'display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; padding: 2px')}{PROGS}</section></sc-if>
<section style="display: flex; flex-direction: column; gap: 12px">{H2('Sections')}{SECTS.replace('Section.dc.html', 'SectionLaptop.dc.html')}</section>
<section style="display: flex; flex-direction: column; gap: 12px">{H2('Details')}{DETAILS}</section>
</div>
</div>'''
pl = SONG_MORE.replace('EditorDraft.dc.html', 'EditorDraftLaptop.dc.html').replace('Editor.dc.html', 'EditorLaptop.dc.html').replace('SongSettings.dc.html', 'SongSettingsLaptop.dc.html') + POPOVER('creditsOn', 'Title and credits', CREDITS, 'left: 120px; top: 520px', 420)
detail('Song', 'A song', SG, ph, lm, '', sh, pl, 'Songs')
SONG_PH, SONG_LM, SONG_SG, SONG_SH, SONG_PL = ph, lm, SG, sh, pl  # a song's Settings opens over this page (r53, SETWIN)
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
            f'<span style="width: 4px"></span>{PLAYBTN(36, (16, 15))}{DOTS()}</header>')
# The score lies on the page as the Player's does, no sheet of paper under it: Play and Edit keep it in place (loop round 62).
def SCOREPAGE(w, size, pad):
    lap = size > 1.1  # the Player's heading, value for value: one heading on the score in Play and in Edit
    t, c, v, g = (36, 15, 14, 24) if lap else (24, 13, 12, 16)
    return (f'<div style="padding: {pad}; display: flex; flex-direction: column">'
            f'<h2 style="margin: 0; text-align: center; font-family: {SERIF}; font-size: {t}px; font-weight: 400; line-height: 1.1; color: {INK}">Amazing Grace</h2>'
            f'<p style="margin: 8px 0 0; text-align: center; font-size: {c}px; color: {SOFT}">Words: John Newton · Music: New Britain (American folk tune)</p>'
            f'<div style="margin: {g}px 0 4px; font-size: {v}px; font-variant-numeric: tabular-nums; color: {SOFT}">1 · Verse · <svg aria-hidden="true" width="8" height="13" viewBox="0 0 8 13" style="display: inline-block; vertical-align: -1px; margin: 0 2px"><ellipse cx="3.4" cy="10.6" rx="3.3" ry="2.3" transform="rotate(-20 3.4 10.6)" fill="currentColor"></ellipse><path d="M6.3 10V0.5" stroke="currentColor" stroke-width="1.2"></path></svg>= 80</div>'
            + score_grand(w, [[0, 1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]] if lap else [[0, 1], [2, 3], [4, 5]], sel=(3, 0), size=size).replace(ACCENT, '#85B8DC') + '</div>')
TILE = f'<button type="button" onClick="{{{{t.pick}}}}" style="flex: none; min-width: 46px; height: 46px; padding: 0 8px; border: 0; border-radius: 11px; background: {{{{t.bg}}}}; color: {{{{t.fg}}}}; box-shadow: 0 0 0 1px {LINE}; font-family: \'Noto Music\', {FONT}; font-size: {{{{t.fs}}}}px; font-weight: 600">{{{{t.l}}}}</button>'
PALETTE = (f'<div style="flex: none; border-radius: 18px 18px 0 0; background: {SHEET}; box-shadow: 0 -1px 0 {LINE}, 0 -10px 24px -18px rgba(51,41,33,.4); padding: 4px 0 6px; display: flex; flex-direction: column; gap: 8px">'
           f'<button type="button" aria-label="Open the palette" onClick="{{{{toggleFull}}}}" style="align-self: center; width: 60px; height: 18px; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></span></button>'
           f'<sc-if value="{{{{folded}}}}" hint-placeholder-val="{{{{true}}}}"><div class="nos" style="display: flex; gap: 8px; overflow-x: auto; padding: 0 12px"><sc-for list="{{{{tools}}}}" as="t" hint-placeholder-count="9">{TILE}</sc-for></div><div class="nos" style="overflow-x: auto; padding: 0 12px"><div style="width: 560px">{SEGC("cats", 44, 14)}</div></div></sc-if>'
           f'<sc-if value="{{{{full}}}}" hint-placeholder-val="{{{{false}}}}"><div class="nos" style="max-height: 330px; overflow-y: auto; padding: 0 12px; display: flex; flex-direction: column; gap: 12px"><sc-for list="{{{{all}}}}" as="a" hint-placeholder-count="6">{CAPS("{{a.c}}")}<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="6">{TILE}</sc-for></div></sc-for></div></sc-if></div>')
PIANO = lambda k, h: f'<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; background: {SHEET}; padding: 0 0 26px">{KEYS(h, k, edge=True)}</div></sc-if>'
ED_MORE = GROUP(('link', 'Instruments and staves', 'Piano', ''), ('link', 'Page layout', '', ''), ('link', 'Playback sound', 'Grand piano', ''), ('link', 'MIDI keyboard', 'Not connected', ''), bg=SHEET)
eph = f'''{EDTOP('Song.dc.html')}
<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 6px 10px 12px">{SCOREPAGE(360, 0.95, '14px 12px 8px')}</div>
{PALETTE}{PIANO('kb', 130)}'''
elm = f'''<header style="flex: none; height: 64px; display: flex; align-items: center; gap: 2px; padding: 0 24px 0 40px"><a href="SongLaptop.dc.html" style="height: 44px; display: flex; align-items: center; color: {LINK}; text-decoration: none; font-size: 17px; font-weight: 600">Done</a><span style="flex: 1"></span>{EDTOP('SongLaptop.dc.html').split('<span style="flex: 1"></span>')[1].replace('</header>', '')}</header>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 340px">
<div class="nos" style="min-height: 0; overflow-y: auto; padding: 8px 48px 24px; display: flex; justify-content: center"><div style="width: 760px">{SCOREPAGE(720, 1.25, '32px 40px 16px')}</div></div>
<aside class="nos" aria-label="Palette" style="min-height: 0; overflow-y: auto; background: {SHEET}; box-shadow: -1px 0 0 {LINE}; padding: 20px 18px; display: flex; flex-direction: column; gap: 12px"><sc-for list="{{{{all}}}}" as="a" hint-placeholder-count="6">{CAPS("{{a.c}}")}<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="6">{TILE}</sc-for></div></sc-for></aside>
</div>{PIANO('kbL', 150).replace('padding: 0 0 26px', 'padding: 0; box-shadow: 0 -1px 0 ' + LINE)}'''
detail('Editor', 'Score editor', ED, eph, elm, '', BSHEET('moreOn', 'Score settings', ED_MORE), POPOVER('moreOn', 'Score settings', ED_MORE), 'Songs')
print('songs ok')
