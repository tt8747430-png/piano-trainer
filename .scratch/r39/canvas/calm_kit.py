# The calm kit: tokens, pieces and the phone and laptop frames, for r41.py.
# R40: every Songs and Practice page in the calm language of the Chords page (the other session's "Calm Chords page"):
# a bare bar, the subject large, one big picture, a quiet switcher, two or three rows, one floating bar with the main
# action and Play; changes in a wheel; nothing to scroll. Built only through r41.py.
import json, re, shutil
# the frames and the page head, read from the Main and Laptop boards
OUT = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
src = open(OUT + 'Main.dc.html').read()
lap = open(OUT + 'Laptop.dc.html').read()
# the status bar as the owner's iPhone 17 Pro has it: 62 tall (testing.md, the device's safe area; the app's
# inset), the board's bar under it as the app's
STATUS = re.sub(r'height: \d+px;', 'height: 62px;', re.search(r'(<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 402px; height: \d+px;.*?</span></div>)', src, re.S).group(1), count=1)
SIDE = re.search(r'(<nav aria-label="Main" style="background: #FBF8F3.*?</nav>)', lap, re.S).group(1)
# the sidebar as drawn, before index.py's lapwin.py gives it the rail and Focus buttons
SIDE = re.sub(r'<div data-sidehead.*?</button></div></div>', '<div style="height: 44px; display: flex; align-items: center; padding: 0 12px; font-family: \'Instrument Serif\', Georgia, serif; font-size: 27px">Piano Trainer</div>', SIDE, count=1, flags=re.S)
LAPFRAME_TOP = lap.split('<div style="position: absolute; left: 217.7px; top: 124.6px;')[0].split('</helmet>', 1)[1].lstrip('\n')
# the frame alone: the Practice overview's States box (states_tool.py puts it after the root) is that board's, never every laptop board's
if '<div data-canvas-tool' in LAPFRAME_TOP:
    _i = LAPFRAME_TOP.index('<div data-canvas-tool'); _j = LAPFRAME_TOP.index('</sc-if></div>', _i) + len('</sc-if></div>')
    LAPFRAME_TOP = LAPFRAME_TOP[:_i] + LAPFRAME_TOP[_j:]
PHONE_FRAME, LAPTOP_FRAME = '/_blob/2fd798458923e267dd22b7a996a98294', '/_blob/0526d4830b1e952a0ab4ba3ffc2765fc'

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>%s</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&amp;family=Instrument+Serif&amp;family=Noto+Music&amp;display=swap">
<style>
body{margin:0}
button{font:inherit;cursor:pointer}
.nos{scrollbar-width:none}.nos::-webkit-scrollbar{display:none}
main>*{flex:none}
.stp:disabled{color:rgba(104,94,86,.5)!important;cursor:default}
.ibd:disabled{opacity:.5;cursor:default}
</style>
</helmet>
'''



# ── tokens (the calm Chords page's, light) ──
PAGE, SHEET, INK, SOFT, FILL, LINE, LINK, ACCENT = '#F7F3EE', '#FEFDFB', '#332921', '#685E56', '#EEE9E2', '#DAD1C8', '#356890', '#EDC684'
GLASS = 'rgba(254,253,251,.86)'
# What floats over the page (bars, the tab bar, the floating actions): a tight lift, no pooled dim under it (owner, 2026-11-19).
FLOAT = '0 1px 2px rgba(51,41,33,.10), 0 2px 6px -2px rgba(51,41,33,.10)'
SHADOW = '0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)'
FONT = "'Instrument Sans', -apple-system, 'Helvetica Neue', sans-serif"
I = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
# an icon at another size: its width and height only, never a number inside its path
ICON = lambda svg, px: re.sub(r'width="\d+" height="\d+"', f'width="{px}" height="{px}"', svg, count=1)
CHEV_L = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="m15 18-6-6 6-6"></path></svg>'
CHEV_R = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><path d="m9 18 6-6-6-6"></path></svg>'
MORE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
# Play is Lucide's play, filled, as the app draws it (one glyph for every Play on every board)
PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg>'
STOP = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5"></rect></svg>'
SEARCH = f'<svg viewBox="0 0 24 24" width="18" height="18" {I}><circle cx="11" cy="11" r="6.5"></circle><path d="m20 20-4-4"></path></svg>'
PLUS = f'<svg viewBox="0 0 24 24" width="24" height="24" {I}><path d="M12 5v14M5 12h14"></path></svg>'
UNDO = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M9 14 4 9l5-5"></path><path d="M4 9h11a5 5 0 0 1 0 10h-3"></path></svg>'
REDO = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="m15 14 5-5-5-5"></path><path d="M20 9H9a5 5 0 0 0 0 10h3"></path></svg>'
LOOP = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M17 2l3 3-3 3"></path><path d="M4 11V9a4 4 0 0 1 4-4h12"></path><path d="M7 22l-3-3 3-3"></path><path d="M20 13v2a4 4 0 0 1-4 4H4"></path></svg>'

PRE = r'''
// a root as its letter, the spelling stepped by tapping the letter again; ok(l, a) says which spellings exist (R42)
function letterPick(rl, ra, ok, tapUsed, pick) {
  const L7 = 'CDEFGAB', A7 = { '0': '', '1': '♯', '-1': '♭' }, NM = { '0': '', '1': ' sharp', '-1': ' flat' };
  const waysOf = (l) => [0, 1, -1].filter((a) => ok(l, a));
  const w0 = waysOf(rl); let rootHint = { on: false, t: '', box: '', tip: '' };
  if (w0.length > 1 && !tapUsed) { const nx = w0[(w0.indexOf(ra) + 1) % w0.length], c = ((rl + 0.5) / 7 * 100).toFixed(2);
    rootHint = { on: true, t: 'Tap again for ' + L7[rl] + A7[String(nx)], box: rl < 2 ? 'left: 0' : (rl > 4 ? 'right: 0' : 'left: ' + c + '%; transform: translateX(-50%)'), tip: 'left: calc(' + c + '% - 6px)' }; }
  const a = [0, 1, 2, 3, 4, 5, 6].map((l) => { const on = l === rl, ws = waysOf(l), cur = on ? ra : 0, next = on ? ws[(ws.indexOf(ra) + 1) % ws.length] : 0, more = on && ws.length > 1;
    return { l: L7[l] + A7[String(cur)], on, aria: L7[l] + NM[String(cur)] + (more ? '. Tap again for ' + L7[l] + NM[String(next)] : ''), bg: on ? '#FEFDFB' : 'transparent', sh: on ? '0 1px 3px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.12)' : 'none', fw: on ? 700 : 500, pick: () => pick(l, next, more) }; });
  return { roots: { a }, rootHint };
}
const C = { page: '#F7F3EE', sheet: '#FEFDFB', ink: '#332921', soft: '#685E56', fill: '#EEE9E2', line: '#DAD1C8', link: '#356890', accent: '#EDC684' };
const ROLE = { 1: '#E19E8C', 3: '#85B8DC', 5: '#9BC093', 7: '#E8C67D', 2: '#B8A8D8', 9: '#B8A8D8', 4: '#D3AC8A', 11: '#D3AC8A', 6: '#82C2C1', 13: '#82C2C1' };
const NAT = [0, 2, 4, 5, 7, 9, 11];
const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
// a keyboard from lo to hi, W×H px; marks: midi -> [colour, label]
function calmKeys(lo, hi, marks, W, H) {
  const ws = []; for (let m = lo; m <= hi; m++) if (NAT.includes(m % 12)) ws.push(m);
  const w = W / ws.length, bw = w * 0.6;
  const whites = ws.map((m, i) => { const k = marks[m]; return { left: (i * w / W * 100).toFixed(3) + '%', w: (w / W * 100).toFixed(3) + '%', h: H, bg: k ? k[0] : '#FEFDFA', label: k ? k[1] : (m % 12 === 0 ? 'C' + (Math.floor(m / 12) - 1) : ''), ink: k ? '#332921' : '#685E56', fw: k ? 700 : 500 }; });
  const blacks = []; for (let m = lo; m <= hi; m++) { if (NAT.includes(m % 12)) continue; const i = ws.indexOf(m - 1); const k = marks[m]; blacks.push({ left: (((i + 1) * w - bw / 2) / W * 100).toFixed(3) + '%', w: (bw / W * 100).toFixed(3) + '%', h: Math.round(H * 0.62), bg: k ? k[0] : '#332C28', label: k ? k[1] : '' }); }
  return { whites, blacks };
}
// a wheel column: seven rows around the chosen one
function wheel(items, sel, pick) {
  const out = []; for (let d = -3; d <= 3; d++) { const i = sel + d; const it = items[i]; out.push({ l: it === undefined ? '' : it, on: d === 0, op: [0.22, 0.42, 0.7, 1, 0.7, 0.42, 0.22][d + 3], fw: d === 0 ? 700 : 450, pick: () => it !== undefined && pick(i) }); }
  return out;
}
const tabsOf = (list, cur, set) => list.map((t) => ({ l: t, ink: t === cur ? C.ink : C.soft, fw: t === cur ? 700 : 500, line: t === cur ? C.ink : 'transparent', pick: () => set({ tab: t }) }));
// a row's ··· menu opens at its button (owner, 2026-11-17: "what kind of nonsense is to put this delete in this
// cnetered popup with doen button"): its right edge on the button's, below it, or above when the screen ends first
const ANCHOR = (e, h) => { const t = e && e.currentTarget, p = t && t.closest && t.closest('[data-menuroot]'); if (!p) return 'right: 16px; top: 120px'; const b = t.getBoundingClientRect(), r = p.getBoundingClientRect(), k = (r.width / p.offsetWidth) || 1, onLeft = (b.left + b.right) / 2 - r.left < r.width / 2, side = onLeft ? 'left: ' + Math.max(8, Math.round((b.left - r.left) / k)) + 'px' : 'right: ' + Math.max(8, Math.round((r.right - b.right) / k)) + 'px', below = Math.round((b.bottom - r.top) / k) + 4; return below + (h || 160) > p.offsetHeight - 24 ? side + '; bottom: ' + (Math.round((r.bottom - b.top) / k) + 4) + 'px' : side + '; top: ' + below + 'px'; };
const common = (st, set) => ({ sheetOn: !!st.sheet, closeSheet: () => set({ sheet: null }), changeOn: st.sheet === 'change', moreOn: st.sheet === 'more', openChange: () => set({ sheet: 'change' }), openMore: (e) => set({ sheet: 'more', menuPos: ANCHOR(e, 200) }), menuPos: st.menuPos ?? 'right: 16px; top: 120px',
  playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), playLabel: st.playing ? 'Stop' : 'Play' });
'''

# ── pieces ──
def BAR(back, right='', backlabel='Back'):
    b = f'<a href="{back}" aria-label="{backlabel}" style="width: 44px; height: 44px; margin-left: -6px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>' if back else '<span style="width: 44px"></span>'
    return f'<header style="flex: none; height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px">{b}<div style="display: flex; align-items: center; gap: 4px">{right}<button type="button" aria-label="More" onClick="{{{{openMore}}}}" style="width: 44px; height: 44px; margin-right: -6px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div></header>'
def KEYS(h, kb='kb', edge=False, ring=True):
    """kb: the state key holding the keys (kbL for a laptop's wider keyboard); edge: the one instrument, square to the
    screen's edges; ring: its 1px line (off where a hairline above it draws the edge)."""
    return (f'<div style="position: relative; flex: none; width: 100%; height: {h}px; border-radius: {"0" if edge else "14px"}; overflow: hidden; background: {LINE}; box-shadow: {"0 0 0 1px " + LINE if ring else "none"}"><sc-for list="{{{{{kb}.whites}}}}" as="k" hint-placeholder-count="14"><span style="position: absolute; left: {{{{k.left}}}}; top: 0; width: {{{{k.w}}}}; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 10px; border-right: 1px solid rgba(51,41,33,.16); background: {{{{k.bg}}}}; color: {{{{k.ink}}}}; font-size: 12px; font-weight: {{{{k.fw}}}}; display: flex; align-items: flex-end; justify-content: center">{{{{k.label}}}}</span></sc-for><sc-for list="{{{{{kb}.blacks}}}}" as="k" hint-placeholder-count="10"><span style="position: absolute; left: {{{{k.left}}}}; top: 0; width: {{{{k.w}}}}; height: {{{{k.h}}}}px; box-sizing: border-box; padding-bottom: 6px; border-radius: 0 0 5px 5px; background: {{{{k.bg}}}}; color: {INK}; font-size: 12px; font-weight: 700; display: flex; align-items: flex-end; justify-content: center">{{{{k.label}}}}</span></sc-for><div style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: #7C302C"></div></div>')
def ROWS(*rows):
    out = []
    for i, r in enumerate(rows):
        sep = f'box-shadow: inset 0 -1px 0 {FILL};' if i < len(rows) - 1 else ''
        kind, label = r[0], r[1]
        if kind == 'step':
            out.append(f'<div style="min-height: 48px; display: flex; align-items: center; padding: 0 6px 0 16px; {sep}"><span style="flex: 1; font-size: 16px; color: {INK}">{label}</span><button type="button" aria-label="{label}: before" onClick="{{{{{r[3]}}}}}" style="width: 40px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{ICON(CHEV_L, 20)}</button><span style="min-width: 70px; text-align: center; font-size: 16px; font-weight: 600; color: {INK}; font-variant-numeric: tabular-nums">{{{{{r[2]}}}}}</span><button type="button" aria-label="{label}: after" onClick="{{{{{r[4]}}}}}" style="width: 40px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{ICON(CHEV_R, 20)}</button></div>')
        elif kind == 'link':
            val = f'<span style="font-size: 16px; color: {SOFT}">{r[2]}</span>' if len(r) > 2 and r[2] else ''
            href = r[3] if len(r) > 3 else ''
            tag, close = (f'<a href="{href}"', '</a>') if href else ('<button type="button"' + (f' onClick="{{{{{r[4]}}}}}"' if len(r) > 4 else ''), '</button>')
            out.append(f'{tag} style="width: 100%; min-height: 48px; box-sizing: border-box; border: 0; background: transparent; display: flex; align-items: center; gap: 8px; padding: 0 12px 0 16px; color: {INK}; text-decoration: none; font: inherit; text-align: left; {sep}"><span style="flex: 1; font-size: 16px">{label}</span>{val}<span style="color: {SOFT}; display: flex">{CHEV_R}</span>{close}')
        elif kind == 'val':
            out.append(f'<div style="min-height: 48px; display: flex; align-items: center; gap: 8px; padding: 0 16px; {sep}"><span style="flex: 1; font-size: 16px; color: {INK}">{label}</span><span style="font-size: 16px; color: {SOFT}; font-variant-numeric: tabular-nums">{r[2]}</span></div>')
        elif kind == 'raw':
            out.append(label)
    return f'<div style="flex: none; border-radius: 12px; background: {FILL}; overflow: hidden">{"".join(out)}</div>'
PILL = lambda label, act, on='': f'<button type="button" onClick="{{{{{act}}}}}" {("aria-pressed=\"{{" + on + "}}\"") if on else ""} style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {{{{{(on + "Bg") if on else "pillBg"}}}}}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; white-space: nowrap">{label}</button>'
def WHEEL(cols):
    colsh = ''.join(f'<div style="flex: {flex}; min-width: 0; display: flex; flex-direction: column"><sc-for list="{{{{{lst}}}}}" as="w" hint-placeholder-count="7"><button type="button" onClick="{{{{w.pick}}}}" style="height: 44px; border: 0; background: transparent; color: {INK}; opacity: {{{{w.op}}}}; font: inherit; font-size: 18px; font-weight: {{{{w.fw}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{w.l}}}}</button></sc-for></div>' for lst, flex in cols)
    return f'<div style="position: relative; display: flex; gap: 4px"><div aria-hidden="true" style="position: absolute; left: 0; right: 0; top: 132px; height: 44px; border-radius: 10px; background: {FILL}"></div><div style="position: relative; flex: 1; display: flex; gap: 4px">{colsh}</div></div>'

def phone(fname, title, body, js, sheets='', bg=PAGE, bar=None):
    # bar: the status bar's ground when the screen's own bar continues it (the editor's light header, as Flat's)
    html = HEAD % title + f"""<div style="width: 450px; height: 920px; position: relative; font-family: {FONT}">
<div data-menuroot style="position: absolute; left: 24px; top: 23px; width: 402px; height: 874px; overflow: hidden; border-radius: 62px; background: {bg}; color: {INK}; display: flex; flex-direction: column">
<div style="flex: none; height: 62px; position: relative">{STATUS.replace('background: #F7F3EE;', f'background: {bar};', 1) if bar else STATUS}</div>
{body}
{sheets}
<div aria-hidden="true" style="position: absolute; left: 134px; bottom: 8px; width: 134px; height: 5px; border-radius: 9999px; background: {INK}; z-index: 90"></div>
</div>
<img src="{PHONE_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 450px; height: 920px; pointer-events: none; z-index: 100">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":450,"height":920}}}}'>
{PRE}
{js}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)

# The laptop sidebar (owner, 2026-11-26: "I dont like that teh option is called songs because a song actually is a
# score with words but it can also be just a musical piece without words … and I dont like very much the all these
# options are now hidden just under this option"): Learn and Practice, then the Library as its own section, always in
# sight on every board, as Apple Music's and forScore's sidebars list the library's places and the playlists under
# their heads (HIG Sidebars: a section head, items one level deep). Library: All pieces, Explore; Playlists with +;
# then Archive and Trash apart under a hairline. Every item a 24 glyph slot at 12 and its name at 44, as Learn's.
_SUBCUR = {'SongsLaptop': 'All pieces', 'AllSongsLaptop': 'All pieces', 'ExploreLaptop': 'Explore', 'FolderLaptop': 'Hymns', 'SharedFolderLaptop': 'Choir hymns', 'ArchiveLaptop': 'Archive', 'TrashLaptop': 'Trash'}
_SUBPL = (('Favourites', '#F3D2C8', 'FolderLaptop.dc.html'), ('Songs to learn', '#F6E7C8', 'FolderLaptop.dc.html'), ('Hymns', '#D3E5F2', 'FolderLaptop.dc.html'), ('Called to Play', '#E4DCF1', 'FolderLaptop.dc.html'), ('Choir hymns', '#DCE9D6', 'SharedFolderLaptop.dc.html'), ('Grade 3 pieces', '#EEE3D3', 'SharedFolderLaptop.dc.html'))
_G = lambda d: f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg>'
_GLYPH = {
    'All pieces': '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
    'Explore': '<circle cx="12" cy="12" r="10"></circle><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"></path>',
    'Archive': '<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path>',
    'Trash': '<path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>'}
def _PLACE(label, href, cur, n='', sq='', top=False):
    on = label == cur
    lead = (f'<span aria-hidden="true" style="flex: none; width: 20px; height: 20px; border-radius: 5px; background: {sq}; box-shadow: inset 0 0 0 1px rgba(51,41,33,.08)"></span>' if sq else _G(_GLYPH[label]))
    h = 44
    return (f'<a href="{href}"' + (' aria-current="page"' if on else '') + f' style="height: {h}px; flex: none; border-radius: 10px; display: flex; align-items: center; gap: 12px; padding: 0 12px; text-decoration: none; font-size: {16 if top else 15}px; '
            + ('background: #EAE2D7; color: #1A1612; font-weight: 600' if on else 'background: transparent; color: #4A433C; font-weight: 500') + f'"><span style="flex: none; width: 20px; display: flex; justify-content: center">{lead}</span><span style="flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{label}</span>'
            + (f'<span style="color: #685E56; font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums">{n}</span>' if n else '') + '</a>')
def _HEAD(label, plus=False):
    btn = ('<button type="button" aria-label="New playlist" data-tip="New playlist" onClick="{{openFolder}}" style="position: relative; width: 40px; height: 40px; border: 0; border-radius: 20px; background: transparent; color: #4A433C; display: flex; align-items: center; justify-content: center">'
           '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button>') if plus else ''
    return f'<div style="flex: none; height: 40px; display: flex; align-items: center; padding: 0 2px 0 12px; margin-top: 6px"><span role="heading" aria-level="2" style="flex: 1; font-size: 13px; font-weight: 600; color: #685E56">{label}</span>{btn}</div>'
def LIBRARY_SIDE(fname=''):
    cur = _SUBCUR.get(fname or '', '')
    rows = (_HEAD('Library') + _PLACE('All pieces', 'SongsLaptop.dc.html', cur, '8') + _PLACE('Explore', 'ExploreLaptop.dc.html', cur)
            + _HEAD('Playlists', True) + ''.join(_PLACE(t, h, cur, '', c) for t, c, h in _SUBPL)
            + '<div role="separator" style="flex: none; height: 1px; margin: 6px 12px; background: #E9E2D8"></div>'
            + _PLACE('Archive', 'ArchiveLaptop.dc.html', cur, '3') + _PLACE('Trash', 'TrashLaptop.dc.html', cur, '2'))
    return f'<div data-libside role="group" aria-label="Library" style="display: flex; flex-direction: column; gap: 2px">{rows}</div>'
def SIDEBAR(section, fname=''):
    """The app's laptop sidebar with its place current: one drawing for every laptop board."""
    side = re.sub(r'<div data-libside.*?</div>(?=\s*<span style="flex: 1"></span>)', '', SIDE, count=1, flags=re.S)
    tops = {}
    for word, href in (('Learn', 'LearnLaptop'), ('Songs', 'SongsLaptop'), ('Practice', 'Laptop')):
        m = re.search(r'<a href="' + href + r'\.dc\.html"[^>]*>((?:(?!</a>).)*?)</a>', side, re.S)
        if m: tops[word] = m
    def top(word, href):
        on = word == section
        st = ('background: #EAE2D7; color: #1A1612; text-decoration: none; font-size: 16px; font-weight: 600' if on else 'background: transparent; color: #4A433C; text-decoration: none; font-size: 16px; font-weight: 500')
        svg = re.search(r'<svg.*?</svg>', tops[word].group(1), re.S).group(0)
        return f'<a href="{href}.dc.html"' + (' aria-current="page"' if on else '') + f' style="height: 44px; flex: none; border-radius: 10px; display: flex; align-items: center; gap: 12px; padding: 0 12px; {st}">{svg}{word}</a>'
    start = tops['Learn'].start(); end = max(m.end() for m in tops.values())
    return side[:start] + top('Learn', 'LearnLaptop') + top('Practice', 'Laptop') + LIBRARY_SIDE(fname if section == 'Songs' else '') + side[end:]

def laptop(fname, title, main, aside, js, pops='', section='Practice'):
    side = SIDEBAR(section, fname)
    asidehtml = f'<aside class="nos" style="min-height: 0; overflow-y: auto; background: {SHEET}; box-shadow: -1px 0 0 {LINE}; padding: 28px 28px 28px; display: flex; flex-direction: column; gap: 16px">{aside}</aside>' if aside else ''
    cols = 'minmax(0, 1fr) 440px' if aside else 'minmax(0, 1fr)'
    html = HEAD % title + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: {PAGE}; color: {INK}; font-family: {FONT}; display: grid; grid-template-columns: 248px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)">
{side}
<div data-menuroot style="position: relative; min-width: 0; display: grid; grid-template-columns: {cols}; grid-template-rows: minmax(0, 1fr)">
<div style="position: relative; min-width: 0; min-height: 0; display: flex; flex-direction: column">{main}</div>
{asidehtml}
{pops}
</div>
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
{PRE}
{js}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)


# A page in the calm shape: phone and laptop from one description


