# R72: Songs, new from Flat's library (owner, 2026-11-16: "look at the example apps and improve the design with no
# backwards compatibility … I want new completely new design"; piano-data/reference-apps/flat-score-editor 091–097).
#   Songs     — My songs as Flat's overview: Recently played (a shelf, See all), Folders as cards, Archive and Trash
#   AllSongs  — every song: Back · All songs · Select; search; the count and a sort menu; rows as cards with ···;
#               Select with checkboxes and a selection bar; the floating New
# Exec'd by r41.py last, so it replaces the library() drawing of Songs.

SONGS_ALL = [  # title, composer · key, progress, last played, added order
    ('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'Today', 6),
    ('Für Elise', 'Beethoven · A minor', 'Bar 3 of 24', 'Yesterday', 4),
    ('Ode to Joy', 'Beethoven · D major', 'Bar 5 of 12', '2 days ago', 5),
    ('Twinkle, Twinkle, Little Star', 'Traditional · C major', 'Learned', '3 days ago', 1),
    ('Let It Be', 'The Beatles · C major', 'Learned', '12 Nov', 3),
    ('Clair de lune', 'Debussy · D♭ major', 'Not started', '4 Nov', 7),
    ('Jingle Bells', 'James Lord Pierpont · G major', 'Not started', '28 Oct', 2),
    ('My first song', 'Written by you · C major', 'Not started', '23 Oct', 8),
]
FOLDERS_ALL = [('Favourites', '2 songs', PEACH, 'heart'), ('Songs to learn', '23 songs · 4 learned', HONEY, ''), ('Hymns', '6 songs · 2 learned', SKY, ''),
               ('Called to Play', '15 songs · Book 1', LILAC, ''), ('Shared with me', "4 songs · From Maria's group", SAGE, 'shared')]
_ROWS = [{'t': t, 's': s, 'v': v, 'when': w, 'add': a, 'pic': INCIPIT(INC.get(t, (2, 4)))} for t, s, v, w, a in SONGS_ALL]

FL_JS = r'''
    const S = (o) => set(o), q = (st.q ?? '').trim().toLowerCase(), sort = st.sort ?? 'Last played', dir = st.dir ?? 'Descending';
    const selOn = !!st.sel, picked = st.picked ?? [], demo = st.demo ?? null, bare = demo === 'bare';
    const order = { 'Last played': (r) => -ROWS.indexOf(r), 'Title': (r) => r.t, 'Composer': (r) => r.s, 'Added': (r) => r.add };
    let list = ROWS.filter((r) => !q || (r.t + ' ' + r.s).toLowerCase().includes(q));
    list = [...list].sort((a, b) => { const x = order[sort](a), y = order[sort](b); return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'Ascending' ? 1 : -1); });
    const rows = list.map((r) => { const on = picked.includes(r.t); return { ...r, on, ckBg: on ? '#332921' : 'transparent', ckLine: on ? '#332921' : '#BFB3A7', ckMark: on ? 1 : 0,
      tap: () => selOn ? S({ picked: on ? picked.filter((x) => x !== r.t) : [...picked, r.t] }) : null, more: () => S({ sheet: 'row', row: r.t }) }; });
    const menu = (L, cur, key) => L.map((l) => ({ l, on: l === cur, mark: l === cur ? 1 : 0, pick: () => S({ [key]: l, sheet: null }) }));
    return { ...common(st, set), rows, count: bare ? '0 songs' : list.length + (list.length === 1 ? ' song' : ' songs'), sortL: sort,
      sortOn: st.sheet === 'sort', openSort: () => S({ sheet: 'sort' }), sorts: ['Last played', 'Title', 'Composer', 'Added'].map((l) => ({ l, on: l === sort, mark: l === sort ? 1 : 0, pick: () => S({ sort: l, dir: l === 'Title' || l === 'Composer' ? 'Ascending' : 'Descending', sheet: null }) })), dirs: menu(['Ascending', 'Descending'], dir, 'dir'),
      rowOn: st.sheet === 'row', rowT: st.row ?? 'Amazing Grace', q: st.q ?? '', typed: (e) => S({ q: e.target.value }),
      none: list.length === 0 && !bare, noneT: 'No songs match “' + (st.q ?? '') + '”', clear: () => S({ q: '' }), some: list.length > 0 && !bare, bare, notBare: !bare, canSel: !selOn && list.length > 0 && !bare,
      selOn, selOff: !selOn, toggleSel: () => S({ sel: !selOn, picked: [] }), selT: picked.length + ' selected', selNone: picked.length === 0, selSome: picked.length > 0,
      addOn: st.sheet === 'add', noAdd: st.sheet !== 'add', openAdd: () => S({ sheet: st.sheet === 'add' ? null : 'add' }),
      folderOn: st.sheet === 'folder', openFolder: () => S({ sheet: 'folder' }), fname: st.fname ?? '', named: (e) => S({ fname: e.target.value }), createBg: (st.fname ?? '').trim() ? '#EDC684' : '#EEE9E2', createFg: (st.fname ?? '').trim() ? '#332921' : '#8A7F76',
      recOn: st.sheet === 'rec', openRec: () => S({ sheet: 'rec' }), clickOn: st.click ?? true, clickOnBg: (st.click ?? true) ? '#44684A' : '#DAD1C8', clickOnX: (st.click ?? true) ? 22 : 2, clickT: () => S({ click: !(st.click ?? true) }),
      cins: seg(['None', '1 bar', '2 bars'], st.cin ?? '1 bar', (x) => S({ cin: x })),
      impOn: st.sheet === 'imp', openImp: () => S({ sheet: 'imp', imp: false }), impPick: () => S({ imp: true }), impNot: !st.imp, impDone: !!st.imp,
      songOn: st.sheet === 'song', openSong: () => S({ sheet: 'song' }), sname: st.sname ?? '', snamed: (e) => S({ sname: e.target.value }), sReady: !!(st.sname ?? '').trim(),
      sBg: (st.sname ?? '').trim() ? '#EDC684' : '#EEE9E2', sFg: (st.sname ?? '').trim() ? '#332921' : '#8A7F76',
      staves: [['Piano', 'Two staves'], ['Melody', 'One staff'], ['Voice and piano', 'Three staves']].map(([l, b]) => { const on = (st.stv ?? 'Piano') === l; return { l, b, on, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', sub: on ? 'rgba(254,253,251,.75)' : '#6F655D', pick: () => S({ stv: l }) }; }),
      tempoV: '♩ = ' + (st.bpm ?? 80), tDn: () => S({ bpm: Math.max(30, (st.bpm ?? 80) - 4) }), tUp: () => S({ bpm: Math.min(240, (st.bpm ?? 80) + 4) }),
      barsV: String(st.bars ?? 8), bDn: () => S({ bars: Math.max(1, (st.bars ?? 8) - 1) }), bUp: () => S({ bars: Math.min(200, (st.bars ?? 8) + 1) }),
      keyV: { C: 'C major', G: 'G major', D: 'D major', A: 'A major', E: 'E major', B: 'B major', 'F♯': 'F♯ major', 'C♯': 'C♯ major', F: 'F major', 'B♭': 'B♭ major', 'E♭': 'E♭ major', 'A♭': 'A♭ major', 'D♭': 'D♭ major', 'G♭': 'G♭ major', 'C♭': 'C♭ major' }[st.skey ?? 'C'] + ((st.skey ?? 'C') === 'C' ? ' · no sharps or flats' : ''),
      keysS: ['G', 'D', 'A', 'E', 'B', 'F♯', 'C♯'].map((l, i) => { const on = st.skey === l; return { a: (i + 1) + '♯', l, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', on, pick: () => S({ skey: on ? 'C' : l }) }; }),
      keysF: ['F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'].map((l, i) => { const on = st.skey === l; return { a: (i + 1) + '♭', l, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', on, pick: () => S({ skey: on ? 'C' : l }) }; }),
      times: [['2', '4'], ['3', '4'], ['4', '4'], ['6', '8'], ['3', '8'], ['12', '8']].map(([n, d]) => { const on = (st.tsig ?? '4/4') === n + '/' + d; return { n, d, on, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', pick: () => S({ tsig: n + '/' + d }) }; }),
      states: [['bare', BARE_L], ['search', 'No results']].map(([k, l]) => ({ l, bg: (k === 'search' ? q === 'chopin' : demo === k) ? '#332921' : '#EEE9E2', pick: () => k === 'search' ? S({ q: q === 'chopin' ? '' : 'Chopin' }) : S({ demo: demo === k ? null : k }) })) };'''
def FLJS(rows, bare_l='A new learner'):
    return js('    const ROWS = ' + json.dumps(rows, ensure_ascii=False) + '; const BARE_L = ' + json.dumps(bare_l) + ';' + FL_JS)

TICK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"></path></svg>'
SORTI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8 4-4 4 4M7 4v16M21 16l-4 4-4-4M17 20V4"></path></svg>'
HEART_T = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#B84A3E" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"></path></svg>'
SHARED_T = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2F5A35" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"></circle><path d="M2.5 20a6.5 6 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"></path></svg>'

def TILE56(pic, w=56):
    return f'<span aria-hidden="true" style="flex: none; width: {w}px; height: {w}px; border-radius: 12px; background: {pic} center / cover; box-shadow: inset 0 0 0 1px rgba(51,41,33,.1)"></span>'
def FTILE(c, kind, w=56):
    if kind == 'heart': return f'<span aria-hidden="true" style="flex: none; width: {w}px; height: {w}px; border-radius: 12px; background: {c}; display: flex; align-items: center; justify-content: center">{HEART_T}</span>'
    if kind == 'shared': return f'<span aria-hidden="true" style="flex: none; width: {w}px; height: {w}px; border-radius: 12px; background: {c}; display: flex; align-items: center; justify-content: center">{SHARED_T}</span>'
    return TILE56(STACK(c).replace('url("', "url('").replace('")', "')"), w)
SEEALL = lambda href, n='': f'<a href="{href}" style="min-height: 44px; display: flex; align-items: center; color: {LINK}; text-decoration: none; font-size: 16px; font-weight: 600">See all{n}</a>'
SECH = lambda t, right='': f'<div style="display: flex; align-items: center; justify-content: space-between; margin: 0 4px"><h2 style="margin: 0; font-size: 20px; font-weight: 700">{t}</h2>{right}</div>'
CARDROW = f'border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}'

# ── My songs: the overview ──
def RECENT(w, n):
    out = ''
    for t, s, v, when, _ in SONGS_ALL[:n]:
        bar = ''
        if v.startswith('Bar'):
            a, b = [int(x) for x in v[4:].split(' of ')]
            bar = f'<span style="height: 3px; border-radius: 2px; background: {FILL}; overflow: hidden"><span style="display: block; width: {round(100 * a / b)}%; height: 3px; background: #C2662D"></span></span>'
        out += (f'<a href="{{SONG}}" style="flex: none; width: {w}px; display: flex; flex-direction: column; gap: 6px; color: {INK}; text-decoration: none">'
                f'<span style="width: {w}px">{cover(t, s.split(" · ")[0], notes=INC.get(t, (2, 4, 4, 3, 2, 0, -1)))}</span>'
                f'<span style="font-size: 15px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{t}</span>{bar}'
                f'<span style="font-size: 13px; color: {SOFT}; margin-top: -2px">{v}</span></a>')
    return out
def FOLDERCARDS(href):
    return ''.join(f'<a href="{href if k != "shared" else href.replace("Folder", "Groups")}" style="{CARDROW}; min-height: 80px; box-sizing: border-box; padding: 12px 12px 12px 12px; display: flex; align-items: center; gap: 14px; color: {INK}; text-decoration: none">{FTILE(c, k)}'
                   f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{t}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{s}</span></span>'
                   f'<span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>' for t, s, c, k in FOLDERS_ALL)
KEEPROWS = lambda href: GROUP(('link', 'Archive', '3', href), ('link', 'Trash', '2', href), bg=SHEET)
_NEW = (('New song', 'openSong'), ('Record', 'openRec'), ('New folder', 'openFolder'), ('Import', 'openImp'), ('New group', 'Groups.dc.html'))
FOLDERSHEET = LFOLDERSHEET  # the library kit's one New folder sheet (r41_lib)
BAREP = (f'<sc-if value="{{{{bare}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 64px 24px; text-align: center">'
         f'<span style="width: 72px; height: 72px; border-radius: 18px; background: {HONEY}; display: flex; align-items: center; justify-content: center; color: {INK}">{EMPTYICON["♪"]}</span>'
         f'<span style="font-size: 20px; font-weight: 700">Your songs live here</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}; max-width: 300px">Write one with +, import MusicXML or MIDI, or find one in Explore.</span>'
         f'<a href="Explore.dc.html" style="margin-top: 4px; min-height: 44px; display: inline-flex; align-items: center; padding: 0 8px; color: {LINK}; font-size: 16px; font-weight: 600; text-decoration: none">Find a song in Explore</a></div></sc-if>')
SEARCHB = lambda href: IB('Search your songs', SEARCH.replace('width="18" height="18"', 'width="22" height="22"'), href=href)
EXPLORE_SOFT = lambda href: f'<a href="{href}" style="color: inherit; text-decoration: none; display: inline-flex; align-items: center; min-height: 44px">Explore</a>'

ovph = f'''{TITLEBAR('My songs', SEARCHB('AllSongs.dc.html'), soft=EXPLORE_SOFT('Explore.dc.html'))}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 190px; display: flex; flex-direction: column; gap: 28px">{SHOWSTATES()}{BAREP.replace('{EXPL}', 'Explore.dc.html')}
<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}"><section style="display: flex; flex-direction: column; gap: 12px">{SECH('Recently played', SEEALL('AllSongs.dc.html'))}<div class="nos" style="display: flex; gap: 12px; overflow-x: auto; margin: 0 -16px; padding: 0 16px 2px">{RECENT(132, 5).replace('{SONG}', 'Song.dc.html')}</div></section>
<section style="display: flex; flex-direction: column; gap: 12px">{SECH('Folders')}<div style="display: flex; flex-direction: column; gap: 10px">{FOLDERCARDS('Folder.dc.html')}</div></section>
{KEEPROWS('Archive.dc.html')}</sc-if>
</main>{NEWDIAL([(l, g) for l, g in _NEW][::-1], 112, 'addOn', 'noAdd', 'openAdd', 'closeSheet')}{TABBAR('Songs')}'''
ovlm = f'''{LTITLEBAR(f'My songs<span style="margin-left: 14px; color: {LINE}">{EXPLORE_SOFT("ExploreLaptop.dc.html")}</span>', SEARCHB('AllSongsLaptop.dc.html') + NEWBTN('openAdd'))}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 48px; display: flex; flex-direction: column; gap: 36px">{SHOWSTATES()}{BAREP.replace('{EXPL}', 'ExploreLaptop.dc.html')}
<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}"><section style="display: flex; flex-direction: column; gap: 14px">{SECH('Recently played', SEEALL('AllSongsLaptop.dc.html', ' 8'))}<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px">{RECENT(0, 6).replace('{SONG}', 'SongLaptop.dc.html').replace('width: 0px; height: 0px;', 'width: 100%; aspect-ratio: 1;').replace('flex: none; width: 0px;', 'min-width: 0;').replace('<span style="width: 0px">', '<span style="width: 100%">')}</div></section>
<section style="display: flex; flex-direction: column; gap: 14px">{SECH('Folders')}<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px">{FOLDERCARDS('FolderLaptop.dc.html')}</div></section>
<div style="width: calc((100% - 24px) / 3)">{KEEPROWS('ArchiveLaptop.dc.html')}</div></sc-if>
</main>'''
_SLAB = lambda t, v='': f'<div style="display: flex; align-items: baseline; justify-content: space-between; margin: 0 4px"><span style="font-size: 13px; font-weight: 600; color: {SOFT}">{t}</span>{v}</div>'
_TILE = 'border: 0; border-radius: 12px; background: {{o.bg}}; color: {{o.fg}}; box-shadow: 0 0 0 1px ' + LINE + '; font: inherit; padding: 0; min-width: 0'
_KROW = lambda lst: f'<div role="radiogroup" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px"><sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="7"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" aria-label="{{{{o.l}}}} major" onClick="{{{{o.pick}}}}" style="{_TILE}; height: 56px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-size: 16px; font-weight: 600; line-height: 1.1">{{{{o.l}}}}</span><span style="font-size: 12px; opacity: .7; line-height: 1">{{{{o.a}}}}</span></button></sc-for></div>'
SONGFORM = (f'<div style="display: flex; flex-direction: column; gap: 20px">'
    f'<label style="display: flex; flex-direction: column; gap: 6px">{_SLAB("Name")}<input value="{{{{sname}}}}" onInput="{{{{snamed}}}}" placeholder="Song name" style="height: 52px; box-sizing: border-box; padding: 0 16px; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>'
    f'<div style="display: flex; flex-direction: column; gap: 6px">{_SLAB("Staves")}<div role="radiogroup" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{staves}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="{_TILE}; min-height: 64px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; padding: 8px 12px; text-align: left"><span style="font-size: 15px; font-weight: 600">{{{{o.l}}}}</span><span style="font-size: 13px; color: {{{{o.sub}}}}">{{{{o.b}}}}</span></button></sc-for></div></div>'
    + GROUP(('step', 'Tempo', 'tempoV', 'tDn', 'tUp'), ('step', 'Bars', 'barsV', 'bDn', 'bUp'), bg=SHEET)
    + f'<div style="display: flex; flex-direction: column; gap: 6px">{_SLAB("Key", f"<span style=\"font-size: 13px; color: {INK}\">{{{{keyV}}}}</span>")}{_KROW("keysS")}{_KROW("keysF")}</div>'
    f'<div style="display: flex; flex-direction: column; gap: 6px">{_SLAB("Time")}<div role="radiogroup" style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px"><sc-for list="{{{{times}}}}" as="o" hint-placeholder-count="6"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="{_TILE}; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 19px; font-weight: 700; line-height: 0.95"><span>{{{{o.n}}}}</span><span>{{{{o.d}}}}</span></button></sc-for></div></div>'
    f'<a href="Editor.dc.html" aria-disabled="{{{{sReady}}}}" style="position: sticky; bottom: 0; height: 50px; border-radius: 25px; background: {{{{sBg}}}}; color: {{{{sFg}}}}; font-size: 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px {PAGE}">Create</a></div>')
IMPFORM = (IF('impNot', f'<div style="display: flex; flex-direction: column; gap: 16px"><button type="button" onClick="{{{{impPick}}}}" style="border: 0; border-radius: 16px; background: {SHEET}; box-shadow: inset 0 0 0 1.5px {LINE}; padding: 28px 16px; font: inherit; color: {INK}; display: flex; flex-direction: column; align-items: center; gap: 8px"><span style="width: 48px; height: 48px; border-radius: 24px; background: {FILL}; display: flex; align-items: center; justify-content: center">{NEWICON["Import"]}</span><span style="font-size: 16px; font-weight: 700">Choose a file</span><span style="font-size: 14px; color: {SOFT}">MusicXML (.musicxml, .mxl) or MIDI (.mid)</span></button></div>', 'true')
    + IF('impDone', f'<div style="display: flex; flex-direction: column; gap: 16px"><div style="display: flex; gap: 14px; align-items: center">{COV("Fantaisie-Impromptu", HONEY, 56)}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">Fantaisie-Impromptu</span><span style="font-size: 14px; color: {SOFT}">Chopin · C♯ minor · 2 staves · 138 bars</span></span></div>'
      + GROUP(('val', 'Notes, tuplets and ties', 'All'), ('val', 'Tempo and metre changes', '6'), ('val', 'Pedal marks', '41'), bg=SHEET)
      + f'<div style="border-radius: 14px; background: #F6E7C8; padding: 12px 14px; font-size: 15px; line-height: 1.45"><b>Kept as text: 2 marks.</b> The ossia in bars 83–84 and a fingering for the left hand print as written, not as notes.</div>'
      + f'<a href="Song.dc.html" style="height: 50px; border-radius: 25px; background: {ACCENT}; color: {INK}; font-size: 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center">Open song</a></div>'))
RECFORM = (f'<div style="display: flex; flex-direction: column; gap: 16px">'
    + GROUP(('link', 'Input', 'Yamaha P-125', 'Settings.dc.html'), bg=SHEET)
    + GROUP(('step', 'Tempo', 'tempoV', 'tDn', 'tUp'), ('toggle', 'Click', 'clickOn', 'clickT'), ('seg', 'Count-in', 'cins'), bg=SHEET)
    + f'<a href="Editor.dc.html" style="height: 56px; border-radius: 28px; background: {ACCENT}; color: {INK}; font-size: 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px"><span style="width: 14px; height: 14px; border-radius: 7px; background: #B84A3E"></span>Start recording</a></div>')
RECSHEET = BSHEET('recOn', 'Record', RECFORM, 'Cancel')
IMPSHEET = BSHEET('impOn', 'Import', IMPFORM, 'Close')
SONGSHEET = BSHEET('songOn', 'New song', SONGFORM, 'Cancel')
_LAPSHEET = lambda h: h.replace('left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0', 'left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 61; width: 480px; max-height: 86%; overflow-y: auto; box-sizing: border-box; border-radius: 22px').replace('padding: 6px 16px 40px', 'padding: 6px 20px 24px').replace('Editor.dc.html', 'EditorLaptop.dc.html')
ovpops = POPOVER('addOn', 'New', NEWMENU([(l, g.replace('.dc.html', 'Laptop.dc.html')) for l, g in _NEW]), 'right: 40px; top: 72px', 300) + LFOLDERSHEET_L
detail('Songs', 'My songs', FLJS(_ROWS), ovph, ovlm, '', FOLDERSHEET + SONGSHEET + IMPSHEET + RECSHEET, ovpops + _LAPSHEET(SONGSHEET) + _LAPSHEET(IMPSHEET).replace('Song.dc.html', 'SongLaptop.dc.html') + _LAPSHEET(RECSHEET).replace('Settings.dc.html', 'SettingsLaptop.dc.html'), 'Songs')

# ── All songs ──
CHECKBOX = (f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="flex: none; width: 24px; height: 24px; box-sizing: border-box; border-radius: 12px; border: 2px solid {{{{r.ckLine}}}}; background: {{{{r.ckBg}}}}; color: {SHEET}; display: flex; align-items: center; justify-content: center"><span style="display: flex; opacity: {{{{r.ckMark}}}}">{TICK.replace("18", "14")}</span></span></sc-if>')
def SONGROW(song):
    return (f'<div style="{CARDROW}; min-height: 88px; box-sizing: border-box; display: flex; align-items: center; gap: 4px; padding: 0 4px 0 12px">'
            f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" role="checkbox" aria-checked="{{{{r.on}}}}" onClick="{{{{r.tap}}}}" aria-label="{{{{r.t}}}}" style="position: absolute; inset: 0; z-index: 1; border: 0; background: transparent"></button></sc-if>'
            f'<a href="{song}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 14px; padding: 12px 0; color: {INK}; text-decoration: none">{CHECKBOX}<span aria-hidden="true" style="flex: none; width: 56px; height: 56px; border-radius: 12px; background-image: {{{{r.pic}}}}; background-size: cover; box-shadow: inset 0 0 0 1px rgba(51,41,33,.1)"></span>'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{{{{r.t}}}}</span>'
            f'<span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.s}}}}</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{r.v}}}} · {{{{r.when}}}}</span></span></a>'
            f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" aria-label="More for {{{{r.t}}}}" data-tip="More" onClick="{{{{r.more}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{MORE}</button></sc-if></div>')
SEARCHFIELD = (f'<label style="flex: none; height: 44px; box-sizing: border-box; border-radius: 22px; background: {FILL}; display: flex; align-items: center; gap: 8px; padding: 0 16px; color: {SOFT}">{SEARCH}'
               f'<input value="{{{{q}}}}" onInput="{{{{typed}}}}" placeholder="Search your songs" aria-label="Search your songs" style="flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>')
COUNTROW = (f'<div style="flex: none; display: flex; align-items: center; justify-content: space-between; margin: 0 4px"><span style="font-size: 15px; font-weight: 600; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{count}}}}</span>'
            f'<button type="button" aria-haspopup="menu" aria-expanded="{{{{sortOn}}}}" onClick="{{{{openSort}}}}" style="height: 44px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; gap: 6px; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600">{{{{sortL}}}}{SORTI}</button></div>')
MENUITEM = lambda lst: (f'<sc-for list="{{{{{lst}}}}}" as="m" hint-placeholder-count="2"><button type="button" role="menuitemradio" aria-checked="{{{{m.on}}}}" onClick="{{{{m.pick}}}}" style="width: 100%; height: 44px; border: 0; border-radius: 10px; background: transparent; padding: 0 12px 0 8px; display: flex; align-items: center; gap: 8px; color: {INK}; font: inherit; font-size: 16px; text-align: left">'
                        f'<span style="width: 20px; display: flex; opacity: {{{{m.mark}}}}">{TICK}</span>{{{{m.l}}}}</button></sc-for>')
SORTMENU = lambda pos: (f'<sc-if value="{{{{sortOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" aria-label="Sort" style="position: absolute; {pos}; z-index: 61; width: 230px; box-sizing: border-box; padding: 6px; border-radius: 16px; {GLASSFX}; transform-origin: top right">'
                        f'{MENUITEM("sorts")}<div style="height: 1px; margin: 6px 12px; background: {LINE}"></div>{MENUITEM("dirs")}</div></sc-if>')
NOMATCH = (f'<sc-if value="{{{{none}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 56px 24px; text-align: center"><span style="width: 56px; height: 56px; border-radius: 28px; background: {FILL}; color: {SOFT}; display: flex; align-items: center; justify-content: center">{SEARCH.replace("width=\"18\" height=\"18\"", "width=\"24\" height=\"24\"")}</span>'
           f'<span style="font-size: 18px; font-weight: 700">{{{{noneT}}}}</span><span style="font-size: 15px; color: {SOFT}">Check the spelling, or try a composer’s name.</span>{BTN("Clear search", "clear", kind="quiet", h=44, grow=False)}</div></sc-if>')
SELBAR = lambda bottom: (f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">' + DOCK(
    f'<button type="button" onClick="{{{{closeSheet}}}}" style="flex: 1; height: 52px; border: 0; border-radius: 26px; background: transparent; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">Add to folder</button>'
    f'<button type="button" onClick="{{{{closeSheet}}}}" style="flex: 1; height: 52px; border: 0; border-radius: 26px; background: transparent; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">Favourite</button>'
    f'<button type="button" onClick="{{{{toggleSel}}}}" style="flex: 1; height: 52px; border: 0; border-radius: 26px; background: transparent; color: {RED}; font: inherit; font-size: 15px; font-weight: 600">Archive</button>', bottom) + '</sc-if>')
ROWSHEET = lambda sfx: GROUP(('link', 'Practise', '', 'Player' + sfx), ('link', 'Edit score', '', 'Editor' + sfx), ('action', 'Add to a folder', 'closeSheet', INK), ('action', 'Favourite', 'closeSheet', INK), ('link', 'Settings', '', 'SongSettings' + sfx), ('action', 'Archive', 'closeSheet', RED), bg=SHEET)
SELTB = f'<sc-if value="{{{{canSel}}}}" hint-placeholder-val="{{{{true}}}}">{TB("Select", "toggleSel")}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{TB("Cancel", "toggleSel")}</sc-if>'
LIST = lambda song, grid: f'<sc-if value="{{{{some}}}}" hint-placeholder-val="{{{{true}}}}"><div style="{grid}"><sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="8"><div style="position: relative">{SONGROW(song)}</div></sc-for></div></sc-if>'
FEMPTY = (f'<sc-if value="{{{{bare}}}}" hint-placeholder-val="{{{{false}}}}"><div style="{CARDROW}; flex: 1; min-height: 420px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 48px 24px; text-align: center">'
          f'<span style="width: 72px; height: 72px; border-radius: 18px; background: {SKY}; display: flex; align-items: center; justify-content: center; color: {INK}">{EMPTYICON["♪"]}</span>'
          f'<span style="font-size: 20px; font-weight: 700">Nothing in this folder yet</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}; max-width: 300px">The songs you put in this folder show here.</span>'
          f'<a href="{{ALL}}" style="margin-top: 4px; min-height: 44px; display: inline-flex; align-items: center; padding: 0 8px; color: {LINK}; font-size: 16px; font-weight: 600; text-decoration: none">Add songs from your library</a></div></sc-if>')
FOLDERMORE = lambda sfx: GROUP(('action', 'Rename', 'closeSheet', INK), ('action', 'Colour', 'closeSheet', INK), ('link', 'Share', '', 'Groups' + sfx), ('action', 'Archive folder', 'closeSheet', RED), bg=SHEET)
def LISTPAGE(stem, title, rows, back, backlabel, folder=False):
    head = f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{title}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{{{{selT}}}}</sc-if>'
    more = IB('More', MORE, 'openMore') if folder else ''
    fe = lambda sfx: FEMPTY.replace('{ALL}', 'AllSongs' + sfx) if folder else ''
    ph = (TOP(back + '.dc.html', head, SELTB + more, backlabel, n=2 + folder)
          + f'''<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 124px; display: flex; flex-direction: column; gap: 12px">{SHOWSTATES()}{SEARCHFIELD}{COUNTROW}{NOMATCH}{fe('.dc.html')}{LIST('Song.dc.html', 'display: flex; flex-direction: column; gap: 10px')}</main>
<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{NEWDIAL([(l, g) for l, g in _NEW][::-1], 40, 'addOn', 'noAdd', 'openAdd', 'closeSheet')}</sc-if>{SELBAR(34)}{SORTMENU('right: 16px; top: 176px')}''')
    lm = (LTOP(back + 'Laptop.dc.html', SELTB + more + NEWBTN('openAdd'), head)
          + f'''<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 56px 120px; display: flex; flex-direction: column; gap: 14px">{SHOWSTATES()}<div style="display: flex; align-items: center; gap: 24px"><div style="width: 520px; display: flex; flex-direction: column">{SEARCHFIELD}</div><div style="flex: 1">{COUNTROW}</div></div>{NOMATCH}{fe('Laptop.dc.html')}{LIST('SongLaptop.dc.html', 'display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px')}</main>
{SELBAR(28).replace('left: 16px; right: 16px; bottom: 28px', 'left: 50%; transform: translateX(-50%); width: 520px; bottom: 28px')}''')
    pops = SORTMENU('right: 56px; top: 124px') + POPOVER('addOn', 'New', NEWMENU([(l, g.replace('.dc.html', 'Laptop.dc.html')) for l, g in _NEW]), 'right: 40px; top: 72px', 300) + POPOVER('rowOn', '{{rowT}}', ROWSHEET('Laptop.dc.html'), 'right: 120px; top: 220px', 320)
    sheets = BSHEET('rowOn', '{{rowT}}', ROWSHEET('.dc.html')) + FOLDERSHEET + SONGSHEET + IMPSHEET + RECSHEET
    if folder:
        sheets += BSHEET('moreOn', title, FOLDERMORE('.dc.html')); pops += POPOVER('moreOn', title, FOLDERMORE('Laptop.dc.html'), 'right: 200px; top: 72px', 320)
    detail(stem, title, FLJS(rows, 'An empty folder' if folder else 'A new learner'), ph, lm, '', sheets, pops + ovpops.split('</sc-if>', 1)[1] + _LAPSHEET(SONGSHEET) + _LAPSHEET(IMPSHEET).replace('Song.dc.html', 'SongLaptop.dc.html') + _LAPSHEET(RECSHEET).replace('Settings.dc.html', 'SettingsLaptop.dc.html'), 'Songs')
LISTPAGE('AllSongs', 'All songs', _ROWS, 'Songs', 'My songs')
HYMNS = [('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'Today', 6), ('Holy, Holy, Holy', 'John B. Dykes · D major', 'Learned', '9 Nov', 5), ('Abide with Me', 'William H. Monk · E♭ major', 'Bar 4 of 12', '6 Nov', 4),
         ('Be Thou My Vision', 'Irish melody · E♭ major', 'Not started', '30 Oct', 3), ('It Is Well', 'Philip P. Bliss · C major', 'Learned', '21 Oct', 2), ('Great Is Thy Faithfulness', 'William M. Runyan · D major', 'Not started', '12 Oct', 1)]
LISTPAGE('Folder', 'Hymns', [{'t': a, 's': b, 'v': c, 'when': d, 'add': e, 'pic': INCIPIT(INC.get(a, (2, 4)))} for a, b, c, d, e in HYMNS], 'Songs', 'My songs', folder=True)
print('flat songs ok')
