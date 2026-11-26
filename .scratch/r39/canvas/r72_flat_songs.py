# R72: Songs, new from Flat's library (owner, 2026-11-16: "look at the example apps and improve the design with no
# backwards compatibility … I want new completely new design"; piano-data/reference-apps/flat-score-editor 091–097).
#   Songs     — My songs as Flat's overview: Recently played (a shelf, See all), Folders as cards, Archive and Trash
#   AllSongs  — every song: Back · All pieces · Select; search; the count and a sort menu; rows as cards with ···;
#               Select with checkboxes and a selection bar; the floating New
# Exec'd by r41.py last, so it replaces the library() drawing of Songs.

SONGS_ALL = [  # title, composer · key, progress, last played, added order
    ('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'Today', 6),
    ('Für Elise', 'Beethoven · A minor', 'Bar 3 of 24', 'Yesterday', 4),
    ('Ode to Joy', 'Beethoven · D major', 'Bar 5 of 12', '2 days ago', 5),
    ('Twinkle, Twinkle, Little Star', 'Traditional · C major', 'Learned', '3 days ago', 1),
    ('Let It Be', 'The Beatles · C major', 'Learned', '12 Nov', 3),
    ('Clair de lune', 'Debussy · D♭ major', 'Not started', 'Added 4 Nov', 7),
    ('Jingle Bells', 'James Lord Pierpont · G major', 'Not started', 'Added 28 Oct', 2),
    ('My first song', 'Written by you · C major', 'Not started', 'Added 23 Oct', 8),
]
FOLDERS_ALL = [('Favourites', '2 pieces', PEACH, 'heart'), ('Songs to learn', '23 pieces · 4 learned', HONEY, ''), ('Hymns', '6 pieces · 2 learned', SKY, ''),
               ('Called to Play', '15 pieces', LILAC, '')]
_ROWS = [{'t': t, 's': s, 'v': v, 'when': w, 'add': a, 'pic': INCIPIT(INC.get(t, (2, 4)))} for t, s, v, w, a in SONGS_ALL]

FL_JS = r'''
    const S = (o) => set(o), q = (st.q ?? '').trim().toLowerCase(), sort = st.sort ?? 'Last played', dir = st.dir ?? 'Descending';
    const selOn = !!st.sel, picked = st.picked ?? [], demo = st.demo ?? null, bare = demo === 'bare', guestOn = demo === 'out';
    const order = { 'Last played': (r) => -ROWS.indexOf(r), 'Title': (r) => r.t, 'Composer': (r) => r.s, 'Added': (r) => r.add };
    let list = ROWS.filter((r) => !q || (r.t + ' ' + r.s).toLowerCase().includes(q));
    list = [...list].sort((a, b) => { const x = order[sort](a), y = order[sort](b); return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'Ascending' ? 1 : -1); });
    const rows = list.map((r) => { const on = picked.includes(r.t); return { ...r, on, ckBg: on ? '#332921' : 'transparent', ckLine: on ? '#332921' : '#BFB3A7', ckMark: on ? 1 : 0,
      tap: () => selOn ? S({ picked: on ? picked.filter((x) => x !== r.t) : [...picked, r.t] }) : null, more: (e) => S({ sheet: 'row', row: r.t, menuPos: ANCHOR(e, 300) }) }; });
    const menu = (L, cur, key) => L.map((l) => ({ l, on: l === cur, mark: l === cur ? 1 : 0, pick: () => S({ [key]: l, sheet: null }) }));
    return { ...common(st, set), rows, guestOn, notGuest: !guestOn, count: bare ? '0 pieces' : list.length + (list.length === 1 ? ' piece' : ' pieces'), sortL: sort,
      sortOn: st.sheet === 'sort', openSort: (e) => S({ sheet: 'sort', menuPos: ANCHOR(e, 280) }), sorts: ['Last played', 'Title', 'Composer', 'Added'].map((l) => ({ l, on: l === sort, mark: l === sort ? 1 : 0, pick: () => S({ sort: l, dir: l === 'Title' || l === 'Composer' ? 'Ascending' : 'Descending', sheet: null }) })), dirs: menu(['Ascending', 'Descending'], dir, 'dir'),
      rowOn: st.sheet === 'row', menuPos: st.menuPos ?? 'right: 16px; top: 120px', rowT: st.row ?? 'Amazing Grace', q: st.q ?? '', typed: (e) => S({ q: e.target.value }),
      none: list.length === 0 && !bare, noneT: 'No pieces match “' + (st.q ?? '') + '”', clear: () => S({ q: '' }), some: list.length > 0 && !bare, bare, notBare: !bare, canSel: !selOn && list.length > 0 && !bare,
      selOn, selOff: !selOn, toggleSel: () => S({ sel: !selOn, picked: [] }), selT: picked.length + ' selected', selNone: picked.length === 0, selSome: picked.length > 0,
      addOn: st.sheet === 'add', noAdd: st.sheet !== 'add', openAdd: (e) => S({ sheet: st.sheet === 'add' ? null : 'add', menuPos: ANCHOR(e, 240) }),
      folderOn: st.sheet === 'folder', openFolder: () => S({ sheet: 'folder' }), fname: st.fname ?? '', named: (e) => S({ fname: e.target.value }), createBg: (st.fname ?? '').trim() ? '#EDC684' : '#EEE9E2', createFg: (st.fname ?? '').trim() ? '#332921' : '#8A7F76', createDis: !(st.fname ?? '').trim(),
      recOn: st.sheet === 'rec', openRec: () => S({ sheet: 'rec' }), clickOn: st.click ?? true, clickOnBg: (st.click ?? true) ? '#44684A' : '#DAD1C8', clickOnX: (st.click ?? true) ? 22 : 2, clickT: () => S({ click: !(st.click ?? true) }),
      cins: seg(['None', '1 bar', '2 bars'], st.cin ?? '1 bar', (x) => S({ cin: x })),
      impOn: st.sheet === 'imp', openImp: () => S({ sheet: 'imp', imp: false }), impPick: () => { S({ imp: 'reading' }); setTimeout(() => set({ imp: 'done' }), 1600) }, impNot: !st.imp, impReading: st.imp === 'reading', impDone: st.imp === 'done',
      songOn: st.sheet === 'song', openSong: () => S({ sheet: 'song' }), sname: st.sname ?? '', snamed: (e) => S({ sname: e.target.value }), sReady: !!(st.sname ?? '').trim(),
      sBg: (st.sname ?? '').trim() ? '#EDC684' : '#EEE9E2', sFg: (st.sname ?? '').trim() ? '#332921' : '#8A7F76', sDis: !(st.sname ?? '').trim(),
      staves: [['Piano', 'Two staves'], ['Melody', 'One staff'], ['Voice and piano', 'Three staves']].map(([l, b]) => { const on = (st.stv ?? 'Piano') === l; return { l, b, on, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', sub: on ? 'rgba(254,253,251,.75)' : '#6F655D', pick: () => S({ stv: l }) }; }),
      tempoV: '♩ = ' + (st.bpm ?? 80), tDn: () => S({ bpm: Math.max(30, (st.bpm ?? 80) - 4) }), tUp: () => S({ bpm: Math.min(240, (st.bpm ?? 80) + 4) }),
      barsV: String(st.bars ?? 8), bDn: () => S({ bars: Math.max(1, (st.bars ?? 8) - 1) }), bUp: () => S({ bars: Math.min(200, (st.bars ?? 8) + 1) }),
      keyV: { C: 'C major', G: 'G major', D: 'D major', A: 'A major', E: 'E major', B: 'B major', 'F♯': 'F♯ major', 'C♯': 'C♯ major', F: 'F major', 'B♭': 'B♭ major', 'E♭': 'E♭ major', 'A♭': 'A♭ major', 'D♭': 'D♭ major', 'G♭': 'G♭ major', 'C♭': 'C♭ major' }[st.skey ?? 'C'] + ((st.skey ?? 'C') === 'C' ? ' · no sharps or flats' : ''),
      keysS: ['G', 'D', 'A', 'E', 'B', 'F♯', 'C♯'].map((l, i) => { const on = st.skey === l; return { a: (i + 1) + '♯', l, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', on, pick: () => S({ skey: on ? 'C' : l }) }; }),
      keysF: ['F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'].map((l, i) => { const on = st.skey === l; return { a: (i + 1) + '♭', l, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', on, pick: () => S({ skey: on ? 'C' : l }) }; }),
      times: [['2', '4'], ['3', '4'], ['4', '4'], ['6', '8'], ['3', '8'], ['12', '8']].map(([n, d]) => { const on = (st.tsig ?? '4/4') === n + '/' + d; return { n, d, on, bg: on ? '#332921' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', pick: () => S({ tsig: n + '/' + d }) }; }),
      hasQ: !!q && !bare, noQ: !q, fold: FOLD.filter(([t]) => q && t.toLowerCase().includes(q)).map(([t, n, c]) => ({ t, n, c })), anyFold: !!q && FOLD.some(([t]) => t.toLowerCase().includes(q)), someQ: !!q && list.length > 0,
      noneQ: !!q && list.length === 0 && !FOLD.some(([t]) => t.toLowerCase().includes(q)), exQ: 'Search Explore for “' + (st.q ?? '').trim() + '”',
      moreOn: st.sheet === 'more', openMore: (e) => S({ sheet: 'more', menuPos: ANCHOR(e, 200) }),
      states: (GUEST ? [['out', 'Signed out']] : [['bare', BARE_L], ['search', 'No results']]).map(([k, l]) => ({ l, bg: (k === 'search' ? q === 'chopin' : demo === k) ? '#332921' : '#EEE9E2', pick: () => k === 'search' ? S({ q: q === 'chopin' ? '' : 'Chopin' }) : S({ demo: demo === k ? null : k }) })) };'''
def FLJS(rows, bare_l='A new learner', guest=False):
    return js('    const GUEST = ' + ('true' if guest else 'false') + '; const ROWS = ' + json.dumps(rows, ensure_ascii=False) + '; const FOLD = ' + json.dumps([[t, n, c] for t, n, c, k in FOLDERS_ALL if k != 'shared'], ensure_ascii=False) + '; const BARE_L = ' + json.dumps(bare_l) + ';' + FL_JS)

HEART_T = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#B84A3E" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>'
SHARED_T = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#44684A" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"></circle><path d="M2.5 20a6.5 6 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"></path></svg>'

def TILE56(pic, w=56):
    return f'<span aria-hidden="true" style="flex: none; width: {w}px; height: {w}px; border-radius: 12px; background: {pic} center / cover; box-shadow: inset 0 0 0 1px rgba(51,41,33,.1)"></span>'
def FTILE(c, kind, w=56):
    if kind == 'heart': return f'<span aria-hidden="true" style="flex: none; width: {w}px; height: {w}px; border-radius: 12px; background: {c}; display: flex; align-items: center; justify-content: center">{HEART_T}</span>'
    if kind == 'shared': return f'<span aria-hidden="true" style="flex: none; width: {w}px; height: {w}px; border-radius: 12px; background: {c}; display: flex; align-items: center; justify-content: center">{SHARED_T}</span>'
    return TILE56(STACK(c).replace('url("', "url('").replace('")', "')"), w)
SEEALL = lambda href, n='': f'<a href="{href}" style="min-height: 44px; margin: -12px 0; display: flex; align-items: center; color: {LINK}; text-decoration: none; font-size: 15px; font-weight: 600">See all{n}</a>'
SECH = lambda t, right='': f'<div style="display: flex; align-items: center; justify-content: space-between"><h2 style="margin: 0; font-size: 20px; font-weight: 700">{t}</h2>{right}</div>'
CARDROW = f'border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}'

# ── My songs: the overview ──
def RECENT(w, n):
    out = ''
    for t, s, v, when, _ in SONGS_ALL[:n]:
        bar = ''
        if v.startswith('Bar'):
            a, b = [int(x) for x in v[4:].split(' of ')]
            bar = f'<span style="height: 3px; border-radius: 2px; background: {FILL}; overflow: hidden"><span style="display: block; width: {round(100 * a / b)}%; height: 3px; background: #C2662D"></span></span>'
        out += (f'<a href="{{SONG}}" style="flex: none; width: {w}px; display: flex; flex-direction: column; gap: 8px; color: {INK}; text-decoration: none">'
                f'<span style="width: {w}px">{cover(t, s.split(" · ")[0], notes=INC.get(t, (2, 4, 4, 3, 2, 0, -1)))}</span>'
                f'<span style="font-size: 15px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{t}</span>{bar}'
                f'<span style="font-size: 13px; color: {SOFT}; margin-top: -2px">{v}</span></a>')
    return out
# A folder is drawn as one (owner, 2026-11-17: "this still doesent look like folders … look at the example apps like flat
# and other best practices apps"; Apple Files' and Google Drive's grid): its paint as a folder with a tab, the pages
# of its songs showing over its back, the name under it and what it holds; Favourites the same folder with a heart.
def FOLDERSVG(c, heart=False):
    mark = ('<path d="M80 92s-13-8-13-18a7.5 7.5 0 0 1 13-5 7.5 7.5 0 0 1 13 5c0 10-13 18-13 18Z" fill="#B84A3E"/>' if heart else '')
    return (f'<svg viewBox="0 0 160 116" width="100%" aria-hidden="true" style="display: block">'
            f'<path d="M4 14a8 8 0 0 1 8-8h38a8 8 0 0 1 6 2.7L64 18h84a8 8 0 0 1 8 8v78a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8Z" fill="{c}"/>'
            f'<path d="M4 14a8 8 0 0 1 8-8h38a8 8 0 0 1 6 2.7L64 18h84a8 8 0 0 1 8 8v78a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8Z" fill="rgba(51,41,33,.10)"/>'
            f'<rect x="20" y="24" width="112" height="56" rx="4" fill="#FFFFFF" transform="rotate(-4 76 52)" stroke="rgba(51,41,33,.12)"/>'
            f'<rect x="28" y="26" width="112" height="56" rx="4" fill="#FFFFFF" stroke="rgba(51,41,33,.12)"/>'
            + ''.join(f'<path d="M38 {38 + i * 5}H130" stroke="#332921" stroke-width=".6" opacity=".45"/>' for i in range(5))
            + f'<rect x="4" y="44" width="152" height="68" rx="8" fill="{c}"/>{mark}</svg>')
def FOLDERCARDS(href):
    return ''.join(f'<a href="{href}" style="min-width: 0; display: flex; flex-direction: column; gap: 8px; color: {INK}; text-decoration: none">{FOLDERSVG(c, k == "heart")}'
                   f'<span style="display: flex; flex-direction: column; gap: 2px; padding: 0 2px"><span style="font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{t}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{s}</span></span></a>' for t, s, c, k in FOLDERS_ALL)
# Shared with me, apart from the learner's own and louder (Google Drive's own place; Flat's Collaborations): each
# folder a group shared, as a card with who shared it and the group's faces, so it is never taken for one's own.
SHAREDF = [('Choir hymns', 'St Mary’s choir', 'Shared by Maria Ionescu · 4 pieces', [('M', '#F3D2C8'), ('D', '#D3E5F2'), ('E', '#DCE9D6')], '+9'),
           ('Grade 3 pieces', 'Ms Rusu’s class', 'Shared by Daniel Rusu · 8 pieces', [('D', '#D3E5F2'), ('A', '#F3D2C8')], '+14')]
def SHAREDCARDS(href):
    face = lambda i, c, n: f'<span style="width: 32px; height: 32px; margin-left: {0 if n == 0 else -10}px; border-radius: 16px; background: {c}; box-shadow: 0 0 0 2px {SHEET}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">{i}</span>'
    return ''.join(f'<a href="{href}" style="{CARDROW}; min-width: 0; box-sizing: border-box; padding: 14px 12px 14px 14px; display: flex; align-items: center; gap: 16px; color: {INK}; text-decoration: none">'
                   f'<span style="flex: none; width: 64px">{FOLDERSVG(SAGE)}</span>'
                   f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 13px; font-weight: 600; color: #44684A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{g}</span><span style="font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{t}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{w}</span>'
                   f'<span style="display: flex; align-items: center; gap: 8px; margin-top: 6px"><span style="display: flex">{"".join(face(i, c, n) for n, (i, c) in enumerate(fs))}</span><span style="font-size: 13px; color: {SOFT}">{more}</span></span></span>'
                   f'<span style="flex: none; color: {SOFT}; display: flex">{CHEV_R}</span></a>' for t, g, w, fs, more in SHAREDF)

# Playlists (owner, 2026-11-17: "i dont like htis folders what about copiing the flat layout and its playlists, or come up
# with somethings better"; Flat's Playlists 091/095, Apple Music's and Spotify's covers): a playlist is a square of its
# paint holding its first four songs' openings as a 2×2 mosaic, so it shows the music inside, never a drawn folder;
# Favourites the rose square with its heart; one shared with the learner wears the sharer's face at its corner and says
# who, and opens itself, never Groups; New playlist is the last, dashed square.
PLAYLISTS = [('Favourites', '2 pieces', PEACH, 'heart', [], ''), ('Songs to learn', '23 pieces · 4 learned', HONEY, '', ['Clair de lune', 'Für Elise', 'Let It Be', 'Jingle Bells'], ''),
             ('Hymns', '6 pieces · 2 learned', SKY, '', ['Amazing Grace', 'Holy, Holy, Holy', 'Abide with Me', 'Be Thou My Vision'], ''),
             ('Called to Play', '15 pieces', LILAC, '', ['Twinkle, Twinkle, Little Star', 'Ode to Joy', 'Jingle Bells', 'My first song'], ''),
             ('Choir hymns', 'Maria Ionescu · 4 pieces', SAGE, '', ['It Is Well', 'Great Is Thy Faithfulness', 'Silent Night', 'Amazing Grace'], 'M'),
             ('Grade 3 pieces', 'Daniel Rusu · 8 pieces', '#EEE3D3', '', ['Für Elise', 'Clair de lune', 'Ode to Joy', 'Twinkle, Twinkle, Little Star'], 'D')]
def PLCOVER(c, heart, songs, face, w=64):
    inset, gap, r = (max(4, w // 12), max(2, w // 24), max(3, w // 16))
    if heart:
        body = f'<span style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">{HEART_T.replace("width=\"24\" height=\"24\"", f"width=\"{w // 2}\" height=\"{w // 2}\"")}</span>'
    elif songs:
        pic = lambda t: INCIPIT(INC.get(t, (2, 4))).replace('url("', "url('").replace('")', "')")
        body = (f'<span style="position: absolute; inset: {inset}px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: {gap}px">'
                + ''.join(f'<span style="border-radius: {r}px; background: {pic(t)} center / cover; box-shadow: 0 0 0 1px rgba(51,41,33,.1)"></span>' for t in songs[:4]) + '</span>')
    else:
        body = ''
    fs = max(20, w // 3)
    badge = (f'<span style="position: absolute; right: -4px; bottom: -4px; width: {fs}px; height: {fs}px; border-radius: 50%; background: #F3D2C8; box-shadow: 0 0 0 2px {SHEET}; display: flex; align-items: center; justify-content: center; font-size: {max(12, fs // 2)}px; font-weight: 700; color: {INK}">{face}</span>' if face else '')
    return f'<span aria-hidden="true" style="position: relative; flex: none; display: block; width: {w}px; height: {w}px; border-radius: {max(8, w // 6)}px; background: {c}">{body}{badge}</span>'
def PLAYLISTROWS(href, shared_href, w=64, card=True):
    listed = card == 'list'
    box = 'border-radius: 0; ' if listed else f'{CARDROW}; ' if card else 'border-radius: 12px; '
    out = ''
    for i, (t, sub, c, k, songs, face) in enumerate(PLAYLISTS):
        if listed:  # a hairline from the name's edge to the right, as an inset grouped list draws it
            box = f'border-radius: 0; background: linear-gradient({LINE}, {LINE}) no-repeat {w + 16}px 0 / calc(100% - {w + 16}px) {1 if i else 0}px; '
        out += (f'<a href="{shared_href if face else href}" style="{box}min-height: {w + 16}px; box-sizing: border-box; padding: {"8px 12px 8px 0" if listed else f"8px {12 if card else 8}px"}; display: flex; align-items: center; gap: {16 if card else 12}px; color: {INK}; text-decoration: none">{PLCOVER(c, k == "heart", songs, face, w)}'
                f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: {16 if card else 15}px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{t}</span><span style="font-size: {14 if card else 13}px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{sub}</span></span>'
                + (f'<span style="flex: none; color: {SOFT}; display: flex">{CHEV_R}</span>' if card else '') + '</a>')
    return out
# One New everywhere in Songs (owner, 2026-11-17: "the floating actions should also be consistent how they open"):
# the same four rows from the phone's dial and the laptop's New ▾, on the overview, All pieces and a playlist.
_NEW = (('New piece', 'openSong'), ('Record', 'openRec'), ('Import', 'openImp'), ('New playlist', 'openFolder'))
FOLDERSHEET = LFOLDERSHEET  # the library kit's one New folder sheet (r41_lib)

# ── Songs: one page (owner, 2026-11-17: "i dont like that the search leads to a whole new page … i dont like this tab
# layout of the my songs and explore. and i dont like the new where it sits. is is not very visible and the archive and
# trash shouldnt be like that"): the title Songs; the search in place, its results on this page (Apple Music's Library,
# Files: the field filters where you stand); the four ways to make a song as a strip at the top (Flat's and Google
# Drive's "New" row, always in sight); Recently played, Folders, then Explore as a shelf with See all, its own page;
# Archive and Trash in the bar's ··· with All pieces, out of the page.
CHECKBOX = (f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="flex: none; width: 24px; height: 24px; box-sizing: border-box; border-radius: 12px; border: 2px solid {{{{r.ckLine}}}}; background: {{{{r.ckBg}}}}; color: {SHEET}; display: flex; align-items: center; justify-content: center"><span style="display: flex; opacity: {{{{r.ckMark}}}}">{ICON(TICK, 14)}</span></span></sc-if>')
# A song is a row of one list, not a card of its own (edge-lines' laws, NN/g and M3: homogeneous items are a list; on a
# phone "consider swapping cards for lists"): the list is one card, each row's hairline from the title's edge (12 + the
# 56 tile + 16), the first row's clipped by the list's -1 (SONGLIST), as the playlists' inset list draws it.
SONGHAIR = f'background: linear-gradient({LINE}, {LINE}) no-repeat 84px 0 / calc(100% - 84px) 1px'
# in Select the title moves right by the checkbox (24 + 16), and its hairline with it
SONGLIST = lambda inner, grid='display: flex; flex-direction: column': (f'<style>[data-songlist]:has([role=checkbox]) [data-songrow] {{ background-position: 124px 0 !important; background-size: calc(100% - 124px) 1px !important }}</style>'
                                                                         f'<div data-songlist style="{CARDROW}; overflow: hidden"><div style="{grid}; gap: 0; margin-top: -1px">{inner}</div></div>')
def SONGROW(song):
    return (f'<div data-songrow style="{SONGHAIR}; min-height: 88px; box-sizing: border-box; display: flex; align-items: center; gap: 0; padding: 0 4px 0 12px">'
            f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" role="checkbox" aria-checked="{{{{r.on}}}}" onClick="{{{{r.tap}}}}" aria-label="{{{{r.t}}}}" style="position: absolute; inset: 0; z-index: 1; border: 0; background: transparent"></button></sc-if>'
            f'<a href="{song}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 16px; padding: 12px 0; color: {INK}; text-decoration: none">{CHECKBOX}<span aria-hidden="true" style="flex: none; width: 56px; height: 56px; border-radius: 12px; background-image: {{{{r.pic}}}}; background-size: cover; box-shadow: inset 0 0 0 1px rgba(51,41,33,.1)"></span>'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{{{{r.t}}}}</span>'
            f'<span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.s}}}}</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{r.v}}}} · {{{{r.when}}}}</span></span></a>'
            f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" aria-label="More for {{{{r.t}}}}" data-tip="More" onClick="{{{{r.more}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{MORE}</button></sc-if></div>')
SEARCHFIELD = (SEARCHBOX()
               + f'<input {KB["search"]} value="{{{{q}}}}" onInput="{{{{typed}}}}" placeholder="Search your library" aria-label="Search your library" style="flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>')
LIST = lambda song, grid: f'<sc-if value="{{{{some}}}}" hint-placeholder-val="{{{{true}}}}">' + SONGLIST(f'<sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="8"><div style="position: relative">{SONGROW(song)}</div></sc-for>') + '</sc-if>'
OVSEARCH = SEARCHFIELD  # the one search box (the kit's SEARCHBOX), on the overview as on every list
# What a search found, on the page: the songs as cards, the folders, then the same words in Explore
FOLDHIT = (f'<sc-for list="{{{{fold}}}}" as="f" hint-placeholder-count="1"><a href="{{FOLDER}}" style="{CARDROW}; min-height: 72px; box-sizing: border-box; padding: 8px 12px; display: flex; align-items: center; gap: 16px; color: {INK}; text-decoration: none">'
           f'<span aria-hidden="true" style="flex: none; width: 56px; height: 56px; border-radius: 12px; background: {{{{f.c}}}}"></span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{f.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{f.n}}}}</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a></sc-for>')
EXHIT = lambda href: (f'<a href="{href}" style="{CARDROW}; min-height: 56px; box-sizing: border-box; padding: 0 12px 0 16px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none">'
                      f'<span style="display: flex; color: {SOFT}">{SEARCH}</span><span style="flex: 1; min-width: 0; font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{exQ}}}}</span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>')
QNONE = (f'<sc-if value="{{{{noneQ}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 24px 24px; text-align: center">'
         f'<span style="font-size: 18px; font-weight: 700">{{{{noneT}}}}</span><span style="font-size: 15px; color: {SOFT}">Check the spelling, or look for it in Explore.</span>{BTN("Clear search", "clear", kind="quiet", h=44, grow=False)}</div></sc-if>')
def RESULTS(song, folder, explore, grid):
    return (f'<sc-if value="{{{{hasQ}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-direction: column; gap: 24px">{QNONE}'
            f'<sc-if value="{{{{someQ}}}}" hint-placeholder-val="{{{{true}}}}"><section style="display: flex; flex-direction: column; gap: 12px">{SECH("Pieces")}{LIST(song, grid)}</section></sc-if>'
            f'<sc-if value="{{{{anyFold}}}}" hint-placeholder-val="{{{{false}}}}"><section style="display: flex; flex-direction: column; gap: 12px">{SECH("Folders")}<div style="{grid}">{FOLDHIT.replace("{FOLDER}", folder)}</div></section></sc-if>'
            f'<section style="display: flex; flex-direction: column; gap: 12px">{SECH("In Explore")}{EXHIT(explore)}</section></div></sc-if>')
# Explore on Songs: what others share, newest first, as Explore's own covers; See all opens Explore
EXPUB = [('Gymnopédie No. 1', 'Satie', 'Elena Popa'), ('Canon in D', 'Pachelbel', 'Daniel Rusu'), ('Be Thou My Vision', 'Irish hymn', 'Maria Ionescu'), ('Scarborough Fair', 'Traditional', 'Elena Popa'), ('Let It Be', 'The Beatles', 'Ana Popescu'), ('Study in C, Op. 599 No. 1', 'Czerny', 'Daniel Rusu')]
def EXSHELF(w, n, href):
    return ''.join(f'<a href="{href}" style="flex: none; width: {w}px; min-width: 0; display: flex; flex-direction: column; gap: 8px; color: {INK}; text-decoration: none">'
                   f'<span style="width: {w}px">{cover(t, by, notes=INC.get(t, (2, 4, 3, 5, 4, 2, 0)))}</span>'
                   f'<span style="font-size: 15px; font-weight: 600; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{t}</span>'
                   f'<span style="font-size: 13px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{who}</span></a>' for t, by, who in EXPUB[:n])
BAREP = EMPTY('bare', '♪', 'Your pieces live here', 'Write one, record one at the piano, or import MusicXML or MIDI.', f'<a href="Explore.dc.html" style="min-height: 44px; display: inline-flex; align-items: center; padding: 0 8px; color: {LINK}; font-size: 16px; font-weight: 600; text-decoration: none">Find a piece in Explore</a>')  # the kit's one empty state, its next act a link
BAREP_PH = EMPTY('bare', '♪', 'Your pieces live here', 'Write one with +, record one at the piano, or import MusicXML or MIDI.')  # the phone's Explore shelf follows: no second way there
def SONGSEC(song, allh, grid):
    rows = ''.join(f'<div style="position: relative">' + SONGROW(song).replace('{{r.t}}', t).replace('{{r.s}}', sub).replace('{{r.v}}', v).replace('{{r.when}}', w).replace('{{r.pic}}', INCIPIT(INC.get(t, (2, 4))).replace('"', "'")) + '</div>' for t, sub, v, w, _ in SONGS_ALL[:5])
    return (f'<section style="display: flex; flex-direction: column; gap: 12px">{SECH("Pieces")}<div style="{grid}">{rows}</div>'
            f'<a href="{allh}" style="align-self: flex-start; min-height: 44px; display: flex; align-items: center; margin: 0 4px; color: {LINK}; text-decoration: none; font-size: 16px; font-weight: 600">All 8 pieces</a></section>')
_SHELFPH = 'display: flex; gap: 12px; overflow-x: auto; margin: 0 -16px; padding: 0 16px 2px'
COUNTROW = (f'<div style="flex: none; display: flex; align-items: center; justify-content: space-between; margin: 0"><span style="font-size: 15px; font-weight: 600; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{count}}}}</span>'
            f'<button type="button" aria-haspopup="menu" aria-expanded="{{{{sortOn}}}}" onClick="{{{{openSort}}}}" style="height: 44px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; gap: 8px; color: {LINK}; font: inherit; font-size: 16px; font-weight: 600">{{{{sortL}}}}{SORTI}</button></div>')
SORTMENU = lambda pos: (f'<sc-if value="{{{{sortOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div><div role="menu" aria-label="Sort" style="position: absolute; {pos}; z-index: 61; width: 230px; box-sizing: border-box; padding: 6px; border-radius: 16px; {GLASSFX}; transform-origin: top right">'
                        f'{MENUITEM("sorts")}<div style="height: 1px; margin: 6px 12px; background: {LINE}"></div>{MENUITEM("dirs")}</div></sc-if>')
ROWITEMS = lambda sfx: [('link', 'Practise', '', 'Player' + sfx), ('link', 'Edit score', '', 'Editor' + sfx), ('action', 'Add to a playlist', 'closeSheet', INK), ('action', 'Favourite', 'closeSheet', INK), ('link', 'Settings', '', 'SongSettings' + sfx), ('action', 'Archive', 'closeSheet', RED)]
# ── Songs as Flat's My scores (owner, 2026-11-17: "the mobile layout of the playlists is not the same as the flats
# editor … the archive and trash doenst make sense to be there … the recently played is not the same as teh flat editor:
# it has all scores"; Flat 091): the title; the floating + at the bottom right opening the ways to add (one New: _NEW);
# the search; All pieces, every song by when it was last played, with See all; Playlists; Archive and Trash as one card
# under them, as Flat's Trash; Explore's newest last.
ADDBTN = IB('New', PLUS, 'openAdd')
_ARCHCARD = lambda sfx: GROUP(('link', 'Archive', '3', 'Archive' + sfx), ('link', 'Trash', '2', 'Trash' + sfx), bg=SHEET)
ovph = f'''{TITLEBAR('Library')}
<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 176px; display: flex; flex-direction: column; gap: 32px">{SHOWSTATES()}
<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}">{OVSEARCH}</sc-if>{RESULTS('Player.dc.html', 'Folder.dc.html', 'Explore.dc.html', 'display: flex; flex-direction: column; gap: 12px').replace('SECH("Folders")', 'SECH("Playlists")').replace('>Folders<', '>Playlists<')}
<sc-if value="{{{{noQ}}}}" hint-placeholder-val="{{{{true}}}}">{BAREP_PH}
<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}"><section style="display: flex; flex-direction: column; gap: 12px">{SECH('All pieces', SEEALL('AllSongs.dc.html'))}<div class="nos" style="{_SHELFPH}">{RECENT(132, 8).replace('{SONG}', 'Player.dc.html')}</div></section>
<section style="display: flex; flex-direction: column; gap: 12px">{SECH('Playlists')}<div style="{CARDROW}; padding: 0 0 0 12px; display: flex; flex-direction: column">{PLAYLISTROWS('Folder.dc.html', 'SharedFolder.dc.html', 56, 'list')}</div></section>
{_ARCHCARD('.dc.html')}
</sc-if>
<section style="display: flex; flex-direction: column; gap: 12px">{SECH('Explore', SEEALL('Explore.dc.html'))}<div class="nos" style="{_SHELFPH}">{EXSHELF(132, 6, 'Explore.dc.html')}</div></section></sc-if>
</main>{NEWDIAL(list(_NEW)[::-1], 112, 'addOn', 'noAdd', 'openAdd', 'closeSheet')}{TABBAR('Songs')}'''
_LSEARCH = OVSEARCH.replace('flex: none; height: 44px', 'flex: none; width: 360px; height: 44px')
_PANEROW = lambda label, n, href: f'<a href="{href}" style="min-height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 8px; border-radius: 10px; color: {INK}; text-decoration: none; font-size: 15px; font-weight: 600">{label}<span style="font-weight: 400; color: {SOFT}; font-variant-numeric: tabular-nums">{n}</span></a>'
# The laptop is Flat's library (owner's screenshots of flat.io/library, 2026-11-17): a pane at the left, Playlists
# (each its mosaic, name and count; New playlist last) and, apart at its foot, Archive and Trash with counts; the
# songs at the right under their count and sort, two across; Explore's newest under them.
# The laptop is Flat's library (owner, 2026-11-17: "look how the layout bad is with the playlists and songs so bad
# aligned … the layout of the songs in this grid layout i dont like"; flat.io/library): one grid from the top, a pane
# at the left (All pieces, Favourites, Explore; Playlists with + beside the heading; Archive and Trash at its foot) and
# the list at the right under one header row (the title and its count, the search, Import · Record · New piece), one
# song a row of a table whose columns head it; every edge shared.
_TH = lambda l, w='', right=False: f'<span style="{w}font-size: 13px; font-weight: 600; color: {SOFT}{"; text-align: right" if right else ""}">{l}</span>'
_LCOLS = 'display: grid; grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.6fr) 140px 120px 44px; align-items: center; gap: 16px'
_LTHEAD = (f'<div style="{_LCOLS}; padding: 0 8px 0 12px; height: 40px; border-bottom: 1px solid {LINE}">' + _TH('Title') + _TH('Composer and key') + _TH('Progress') +
           f'<button type="button" aria-haspopup="menu" aria-expanded="{{{{sortOn}}}}" onClick="{{{{openSort}}}}" style="height: 40px; border: 0; background: transparent; padding: 0; display: flex; align-items: center; gap: 8px; color: {LINK}; font: inherit; font-size: 13px; font-weight: 600">{{{{sortL}}}}{SORTI}</button><span></span></div>')
LROW = (f'<div style="{_LCOLS}; position: relative; box-sizing: border-box; padding: 0 8px 0 12px; min-height: 60px; border-bottom: 1px solid {LINE}">'
        f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" role="checkbox" aria-checked="{{{{r.on}}}}" onClick="{{{{r.tap}}}}" aria-label="{{{{r.t}}}}" style="position: absolute; inset: 0; z-index: 1; border: 0; background: transparent"></button></sc-if>'
        f'<a href="PlayerLaptop.dc.html" style="min-width: 0; display: flex; align-items: center; gap: 16px; color: {INK}; text-decoration: none">{CHECKBOX}<span aria-hidden="true" style="flex: none; width: 40px; height: 40px; border-radius: 9px; background-image: {{{{r.pic}}}}; background-size: cover; box-shadow: inset 0 0 0 1px rgba(51,41,33,.1)"></span><span style="font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.t}}}}</span></a>'
        f'<span style="font-size: 15px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.s}}}}</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{r.v}}}}</span><span style="font-size: 15px; color: {SOFT}">{{{{r.when}}}}</span>'
        f'<button type="button" aria-label="More for {{{{r.t}}}}" data-tip="More" onClick="{{{{r.more}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{MORE}</button></div>')
LTABLE = f'<sc-if value="{{{{some}}}}" hint-placeholder-val="{{{{true}}}}"><div role="table" aria-label="All pieces" style="border-top: 1px solid {LINE}">{_LTHEAD}<sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="10">{LROW}</sc-for></div></sc-if>'
SELBAR = lambda bottom: (f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">' + DOCK(
    SELACT('Add to folder', 'closeSheet', ACTIC['Move']) + SELACT('Favourite', 'closeSheet', ACTIC['Favourite']) + SELACT('Archive', 'toggleSel', ACTIC['Archive'], RED), bottom) + '</sc-if>')
SELTB = f'<sc-if value="{{{{canSel}}}}" hint-placeholder-val="{{{{true}}}}">{TB("Select", "toggleSel")}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{TB("Cancel", "toggleSel")}</sc-if>'
# Songs' places on a laptop share one frame (LPLACEBAR) and the sidebar holds the places (SONGS_SUB): no pane card
# Select stands next to the search on every place, so it never moves between them; what a place adds goes before it
_PACTS = lambda more='': more + SELTB  # New floats at the bottom right (NEWPOP), as on a phone
_PTITLE = lambda t: f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{t}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{{{{selT}}}}</sc-if>'
_SELBAR_L = SELBAR(28).replace('left: 16px; right: 16px; bottom: 28px', 'left: 50%; transform: translateX(-50%); width: 520px; bottom: 28px')
ovlm = LPLACEBAR(_PTITLE('All pieces'), '{{count}}', _PACTS(), PSEARCH('Search your library', 'q', 'typed')) + f'''<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 120px; display: flex; flex-direction: column; gap: 24px">{SHOWSTATES()}
<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{RESULTS('PlayerLaptop.dc.html', 'FolderLaptop.dc.html', 'ExploreLaptop.dc.html', 'display: flex; flex-direction: column; gap: 8px').replace('SECH("Folders")', 'SECH("Playlists")').replace('>Folders<', '>Playlists<')}
<sc-if value="{{{{noQ}}}}" hint-placeholder-val="{{{{true}}}}">{BAREP}<sc-if value="{{{{bare}}}}" hint-placeholder-val="{{{{false}}}}"><style>nav[aria-label=Main] a > span[style*="tabular-nums"] {{ display: none }} nav[aria-label=Main] a:has(> span[style*="margin-left: -28px"]) ~ a:has(> span[style*="margin-left: -28px"]) {{ display: none !important }}</style></sc-if><sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}">{LTABLE}</sc-if></sc-if></div>
</main>{_SELBAR_L}'''
_SLAB = lambda t, v='': f'<div style="display: flex; align-items: baseline; justify-content: space-between; margin: 0 4px"><span style="font-size: 13px; font-weight: 600; color: {SOFT}">{t}</span>{v}</div>'
_TILE = 'border: 0; border-radius: 12px; background: {{o.bg}}; color: {{o.fg}}; box-shadow: 0 0 0 1px ' + LINE + '; font: inherit; padding: 0; min-width: 0'
_KROW = lambda lst: f'<div role="radiogroup" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px"><sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="7"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" aria-label="{{{{o.l}}}} major" onClick="{{{{o.pick}}}}" style="{_TILE}; height: 56px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-size: 16px; font-weight: 600; line-height: 1.1">{{{{o.l}}}}</span><span style="font-size: 12px; opacity: .7; line-height: 1">{{{{o.a}}}}</span></button></sc-for></div>'
SONGFORM = (f'<div style="display: flex; flex-direction: column; gap: 20px">'
    f'<label style="display: flex; flex-direction: column; gap: 8px">{_SLAB("Name")}<input {KB["title"]} value="{{{{sname}}}}" onInput="{{{{snamed}}}}" placeholder="Song name" style="height: 52px; box-sizing: border-box; padding: 0 16px; border: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>'
    f'<div style="display: flex; flex-direction: column; gap: 8px">{_SLAB("Staves")}<div role="radiogroup" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{staves}}}}" as="o" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="{_TILE}; min-height: 80px; box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; padding: 8px 12px; text-align: left"><span style="font-size: 15px; font-weight: 600">{{{{o.l}}}}</span><span style="font-size: 13px; color: {{{{o.sub}}}}">{{{{o.b}}}}</span></button></sc-for></div></div>'
    + GROUP(('step', 'Tempo', 'tempoV', 'tDn', 'tUp'), ('step', 'Bars', 'barsV', 'bDn', 'bUp'), bg=SHEET)
    + f'<div style="display: flex; flex-direction: column; gap: 8px">{_SLAB("Key", f"<span style=\"font-size: 13px; color: {INK}\">{{{{keyV}}}}</span>")}{_KROW("keysS")}{_KROW("keysF")}</div>'
    f'<div style="display: flex; flex-direction: column; gap: 8px">{_SLAB("Time")}<div role="radiogroup" style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px"><sc-for list="{{{{times}}}}" as="o" hint-placeholder-count="6"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="{_TILE}; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: {SERIF}; font-size: 19px; font-weight: 700; line-height: 0.95"><span>{{{{o.n}}}}</span><span>{{{{o.d}}}}</span></button></sc-for></div></div>'
    f'<a href="Editor.dc.html" aria-disabled="{{{{sDis}}}}" style="position: sticky; bottom: 0; height: 50px; border-radius: 25px; background: {{{{sBg}}}}; color: {{{{sFg}}}}; font-size: 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px {PAGE}">Create</a></div>')
IMPFORM = (IF('impNot', f'<div style="display: flex; flex-direction: column; gap: 16px"><button type="button" onClick="{{{{impPick}}}}" style="border: 0; border-radius: 16px; background: {SHEET}; box-shadow: inset 0 0 0 1.5px {LINE}; padding: 28px 16px; font: inherit; color: {INK}; display: flex; flex-direction: column; align-items: center; gap: 8px"><span style="width: 48px; height: 48px; border-radius: 24px; background: {FILL}; display: flex; align-items: center; justify-content: center">{NEWICON["Import"]}</span><span style="font-size: 16px; font-weight: 700">Choose a file</span><span style="font-size: 14px; color: {SOFT}">MusicXML (.musicxml, .mxl) or MIDI (.mid)</span></button></div>', 'true')
    + IF('impReading', f'<div role="status" aria-live="polite" style="display: flex; flex-direction: column; gap: 12px; padding: 8px 0"><div style="display: flex; gap: 16px; align-items: center">{COV("Fantaisie-Impromptu", HONEY, 56)}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">Reading Fantaisie-Impromptu.mxl</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">Bar 84 of 138 · about 2 seconds left</span></span></div><div style="height: 6px; border-radius: 3px; background: {FILL}; overflow: hidden"><div style="width: 61%; height: 100%; border-radius: 3px; background: {INK}"></div></div></div>')
    + IF('impDone', f'<div style="display: flex; flex-direction: column; gap: 16px"><div style="display: flex; gap: 16px; align-items: center">{COV("Fantaisie-Impromptu", HONEY, 56)}<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 17px; font-weight: 700">Fantaisie-Impromptu</span><span style="font-size: 14px; color: {SOFT}">Chopin · C♯ minor · 2 staves · 138 bars</span></span></div>'
      + GROUP(('val', 'Notes, tuplets and ties', 'All'), ('val', 'Tempo and metre changes', '6'), ('val', 'Pedal marks', '41'), bg=SHEET)
      + f'<div style="border-radius: 14px; background: #F6E7C8; padding: 12px 16px; font-size: 15px; line-height: 1.45"><b>Kept as text: 2 marks.</b> The ossia in bars 83–84 and a fingering for the left hand print as written, not as notes.</div>'
      + f'<a href="Player.dc.html" style="height: 50px; border-radius: 25px; background: {ACCENT}; color: {INK}; font-size: 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center">Open piece</a></div>'))
RECFORM = (f'<div style="display: flex; flex-direction: column; gap: 16px">'
    + GROUP(('link', 'Input', 'Yamaha P-125', 'Settings.dc.html'), bg=SHEET)
    + GROUP(('step', 'Tempo', 'tempoV', 'tDn', 'tUp'), ('toggle', 'Click', 'clickOn', 'clickT'), ('seg', 'Count-in', 'cins'), bg=SHEET)
    + f'<a href="Editor.dc.html" style="height: 56px; border-radius: 28px; background: {ACCENT}; color: {INK}; font-size: 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 12px"><span style="width: 14px; height: 14px; border-radius: 7px; background: #B84A3E"></span>Start recording</a></div>')
RECSHEET = BSHEET('recOn', 'Record', RECFORM, 'Cancel')
IMPSHEET = BSHEET('impOn', 'Import', IMPFORM, 'Close')
SONGSHEET = BSHEET('songOn', 'New piece', SONGFORM, 'Cancel')
_LAPSHEET = lambda h: LAPSHEET(h).replace('Editor.dc.html', 'EditorLaptop.dc.html')   # the library's one laptop sheet, links to the laptop editor
NEWPOP = f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">' + NEWDIAL(list(_NEW)[::-1], 32, 'addOn', 'noAdd', 'openAdd', 'closeSheet') + '</sc-if>'
PLAYSHEET_L = LFOLDERSHEET_L.replace('New folder', 'New playlist')
detail('Songs', 'Songs', FLJS(_ROWS), ovph, ovlm, '', FOLDERSHEET.replace('New folder', 'New playlist') + SONGSHEET + IMPSHEET + RECSHEET, SORTMENU('{{menuPos}}') + NEWPOP + ROWMENU('rowOn', '{{rowT}}', ROWITEMS('Laptop.dc.html')) + PLAYSHEET_L + _LAPSHEET(SONGSHEET) + _LAPSHEET(IMPSHEET).replace('Player.dc.html', 'PlayerLaptop.dc.html') + _LAPSHEET(RECSHEET).replace('Settings.dc.html', 'SettingsLaptop.dc.html'), 'Songs')

# ── All pieces ──
NOMATCH = EMPTY('none', '⌕', '{{noneT}}', 'Check the spelling, or try a composer’s name.', BTN('Clear search', 'clear', kind='quiet', h=48, grow=False))
FEMPTY = EMPTY('bare', '♪', 'Nothing in this playlist yet', 'The songs you put in this playlist show here.', f'<a href="{{ALL}}" style="min-height: 44px; display: inline-flex; align-items: center; padding: 0 8px; color: {LINK}; font-size: 16px; font-weight: 600; text-decoration: none">Add pieces from your library</a>')  # the kit's one empty state (r53's EMPTY): no box, 18 over 15
FOLDERITEMS = lambda sfx: [('action', 'Rename', 'closeSheet', INK), ('action', 'Colour', 'closeSheet', INK), ('link', 'Share', '', 'Groups' + sfx), ('action', 'Archive playlist', 'closeSheet', RED)]
def LISTPAGE(stem, title, rows, back, backlabel, folder=False):
    head = f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{title}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{{{{selT}}}}</sc-if>'
    more = IB('More', MORE, 'openMore') if folder else ''
    fe = lambda sfx: FEMPTY.replace('{ALL}', 'AllSongs' + sfx) if folder else ''
    ph = (TOP(back + '.dc.html', head, more + SELTB, backlabel, n=2 + folder)  # Select keeps the trailing place on every list, as the laptop's place bar (Jakob; edge-lines flows)
          + f'''<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 124px; display: flex; flex-direction: column; gap: 12px">{SHOWSTATES()}{SEARCHFIELD.replace('Search your library', 'Search this playlist') if folder else SEARCHFIELD}{COUNTROW}{NOMATCH}{fe('.dc.html')}{LIST('Player.dc.html', 'display: flex; flex-direction: column; gap: 12px')}</main>
<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{NEWDIAL([(l, g) for l, g in _NEW][::-1], 40, 'addOn', 'noAdd', 'openAdd', 'closeSheet')}</sc-if>{SELBAR(34)}{SORTMENU('{{menuPos}}')}''')
    lm = (LPLACEBAR(_PTITLE(title), '{{count}}', _PACTS(more), PSEARCH('Search ' + ('this playlist' if folder else 'your songs'), 'q', 'typed'))
          + f'''<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 120px; display: flex; flex-direction: column; gap: 20px">{SHOWSTATES()}{NOMATCH}{fe('Laptop.dc.html')}<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}">{LTABLE}</sc-if></main>{_SELBAR_L}''')
    pops = SORTMENU('{{menuPos}}') + NEWPOP + ROWMENU('rowOn', '{{rowT}}', ROWITEMS('Laptop.dc.html'))
    sheets = ROWMENU('rowOn', '{{rowT}}', ROWITEMS('.dc.html')) + FOLDERSHEET.replace('New folder', 'New playlist') + SONGSHEET + IMPSHEET + RECSHEET
    if folder:
        sheets += ROWMENU('moreOn', title, FOLDERITEMS('.dc.html')); pops += ROWMENU('moreOn', title, FOLDERITEMS('Laptop.dc.html'))
    detail(stem, title, FLJS(rows, 'An empty folder' if folder else 'A new learner'), ph, lm, '', sheets, pops + PLAYSHEET_L + _LAPSHEET(SONGSHEET) + _LAPSHEET(IMPSHEET).replace('Player.dc.html', 'PlayerLaptop.dc.html') + _LAPSHEET(RECSHEET).replace('Settings.dc.html', 'SettingsLaptop.dc.html'), 'Songs')
LISTPAGE('AllSongs', 'All pieces', _ROWS, 'Songs', 'Library')
HYMNS = [('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'Today', 6), ('Holy, Holy, Holy', 'John B. Dykes · D major', 'Learned', '9 Nov', 5), ('Abide with Me', 'William H. Monk · E♭ major', 'Bar 4 of 12', '6 Nov', 4),
         ('Be Thou My Vision', 'Irish melody · E♭ major', 'Not started', 'Added 30 Oct', 3), ('It Is Well', 'Philip P. Bliss · C major', 'Learned', '21 Oct', 2), ('Great Is Thy Faithfulness', 'William M. Runyan · D major', 'Not started', 'Added 12 Oct', 1)]
LISTPAGE('Folder', 'Hymns', [{'t': a, 's': b, 'v': c, 'when': d, 'add': e, 'pic': INCIPIT(INC.get(a, (2, 4)))} for a, b, c, d, e in HYMNS], 'Songs', 'Library', folder=True)

# A playlist shared with the learner opens itself (owner, 2026-11-17: "i dont want misleading links that lead to
# misleading pages"): its cover with the sharer's face, its name, who shared it in which group, View only, its songs.
# Nothing of the sharer's own acts (Stop sharing is theirs, on their playlist), so no ··· here.
CHOIR = [('It Is Well', 'Philip P. Bliss · C major', 'Not started', 'Added 2 Nov'), ('Great Is Thy Faithfulness', 'William M. Runyan · D major', 'Not started', 'Added 2 Nov'),
         ('Silent Night', 'Franz Gruber · B♭ major', 'Not started', 'Added 2 Nov'), ('Amazing Grace', 'John Newton · G major', 'Bar 9 of 16', 'Today')]
LOCK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>'
# In a playlist shared View only, a song's menu holds what a viewer can do: practise it, keep it in a playlist of
# their own, favourite it; never Edit score, Settings or Archive, which are the sharer's (no misleading acts)
VIEWITEMS = lambda sfx: [('link', 'Practise', '', 'Player' + sfx), ('action', 'Add to a playlist', 'closeSheet', INK), ('action', 'Favourite', 'closeSheet', INK)]
_SHHEAD = lambda w: (f'<div style="display: flex; align-items: center; gap: 16px"><span style="flex: none">{PLCOVER(SAGE, False, [t for t, *_ in CHOIR], "M", w)}</span>'
                     f'<span style="min-width: 0; display: flex; flex-direction: column; gap: 4px">'
                     f'<span style="font-size: 15px; color: {SOFT}">Shared by Maria Ionescu in Choir accompanists</span><span style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: {SOFT}">{LOCK}View only · 4 pieces</span></span></div>')
# The playlist's name stands in the bar, as every playlist's does (edge-lines 8: an empty bar is a hole); the head
# under it is the cover and who shared it.
_SHOUT = EMPTY('guestOn', '◎', 'Sign in to see this playlist', 'A playlist shared with you in a group opens once you sign in.', f'{BTN("Sign in", "", "SignIn.dc.html", "primary", 48, False)}')  # signed out: the kit's one empty state, the app's words
shph = (IF('guestOn', TOP('Songs.dc.html', 'Shared with me', '', 'Library') + NARROW(_SHOUT)) + IF('notGuest', f'{TOP("Songs.dc.html", "Choir hymns", "", "Library")}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 120px; display: flex; flex-direction: column; gap: 20px">'
        f'{_SHHEAD(112)}{SONGLIST(f'<sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="4"><div style="position: relative">{SONGROW("Player.dc.html")}</div></sc-for>')}</main>', 'true') + SHOWSTATES())  # a playlist is opened from Songs: no tab bar, as every page off the four places
shlm = (IF('guestOn', LTITLEBAR('Shared with me', '', 'SongsLaptop.dc.html') + LCOL(_SHOUT.replace('SignIn.dc.html', 'SignInLaptop.dc.html'), 880)) + IF('notGuest', f'{LPLACEBAR("Choir hymns", "4 pieces")}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 48px; display: flex; flex-direction: column; gap: 32px">'
        f'{_SHHEAD(160)}{LTABLE.replace('aria-label="All pieces"', 'aria-label="Choir hymns"', 1)}</main>', 'true') + SHOWSTATES())
detail('SharedFolder', 'Choir hymns', FLJS([{'t': a, 's': b, 'v': c, 'when': d, 'add': 0, 'pic': INCIPIT(INC.get(a, (2, 4)))} for a, b, c, d in CHOIR], guest=True), shph, shlm, '', ROWMENU('rowOn', '{{rowT}}', VIEWITEMS('.dc.html')), ROWMENU('rowOn', '{{rowT}}', VIEWITEMS('Laptop.dc.html')), 'Songs')
print('flat songs ok')
