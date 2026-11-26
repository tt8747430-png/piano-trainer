# R59: the takes (loop, 2026-11-15): the app's Takes sheet and its Review your recording page, never drawn.
#   Takes   — over the editor: the song's takes, each Play, its name (to its page), length and tempo, and ··· (Review,
#             Download, Delete at once with Undo, R38); none yet: the empty state
#   Review  — a page of the sheet, Back in its header: the take written as notes, the piano roll with the split point,
#             Quantize in one row of five, Hide raw notes, Into, then Discard (at once, Undo) and Save to score
# Exec'd by r41.py after r58_chordplayer (uses r53's IF, NARROW, WIDE, H1, TOASTS, TOASTL, TOAST_JS, EMPTY; r54's PROLL).

TKS_SRC = r'''
    const S = (o) => set(o);''' + TOAST_JS + r'''
    const ALL = [{ id: 3, n: 'Take 3', d: 'Nov 9, 2026, 6:41 PM · 0:41 · 92 BPM' }, { id: 2, n: 'Nov 9, 2026, 6:20 PM', d: '0:52 · 92 BPM' }, { id: 1, n: 'Nov 9, 2026, 6:02 PM', d: '0:38 · 88 BPM' }];
    const gone = st.gone || [], takes = ALL.filter((t) => !gone.includes(t.id)), at = ALL.find((t) => t.id === st.at) || ALL[0];
    const review = st.page === 'review', grid = st.grid || '1/8', raw = !!st.hideRaw, into = st.into || 'Both staves';
    const drop = (id) => S({ gone: gone.concat([id]), sheet: null, page: null, last: id, toast: 'Take deleted', toastUndo: true });
    const noneOn = takes.length === 0;
    const selOn = !!st.sel && !review, picked = (st.picked ?? []).filter((id) => takes.some((t) => t.id === id)), n = picked.length;
    const ck = (on) => ({ ckBg: on ? '#332921' : 'transparent', ckLine: on ? '#332921' : '#B5A99B', ckMark: on ? 1 : 0 });
    const dropMany = (ids) => S({ gone: gone.concat(ids), sel: false, picked: [], sheet: null, lastMany: ids, toast: ids.length === 1 ? 'Take deleted' : ids.length + ' takes deleted', toastUndo: true });
    const states = [{ l: 'No takes yet', bg: noneOn ? '#332921' : '#EEE9E2', fg: noneOn ? '#FEFDFB' : '#332921', pick: () => S({ gone: noneOn ? [] : [1, 2, 3], page: null }) }];
    return { ...common(st, set), states, closeSheet: () => S({ sheet: null }),
      isList: !review, isReview: review, pageT: review ? 'Review your recording' : selOn ? (n ? n + ' selected' : 'Select takes') : 'Takes',
      selOn, selOff: !selOn, canSel: !selOn && takes.length > 0, toggleSel: () => S({ sel: !selOn, picked: [] }),
      selDl: () => S({ sel: false, picked: [], toast: (n || takes.length) === 1 ? '1 take saved as MIDI' : (n || takes.length) + ' takes saved as MIDI', toastUndo: false }), selDel: () => dropMany(n ? picked : takes.map((t) => t.id)),
      selDlL: n ? 'Download' : 'Download all', selDelL: n ? 'Delete' : 'Delete all', toList: () => S({ page: null }),
      some: takes.length > 0, none: takes.length === 0,
      rows: takes.map((t) => ({ n: t.n, d: t.d, ...ck(picked.includes(t.id)), on2: picked.includes(t.id) ? 'true' : 'false', tap: () => S({ picked: picked.includes(t.id) ? picked.filter((x) => x !== t.id) : [...picked, t.id] }), on: st.playing === t.id, pick: () => S({ at: t.id }), bg: t.id === at.id && !selOn ? '#EEE9E2' : '#FEFDFB', pbg: '#EEE9E2', pbgL: t.id === at.id ? '#FEFDFB' : '#EEE9E2', cur: t.id === at.id ? 'true' : 'false', play: () => S({ playing: st.playing === t.id ? null : t.id }), more: (e) => S({ sheet: 'more', at: t.id, menuPos: ANCHOR(e, 170) }) })),
      moreOn: st.sheet === 'more', menuPos: st.menuPos ?? 'right: 16px; top: 120px', moreT: at.n,
      doReview: () => S({ sheet: null, page: 'review' }), download: () => S({ sheet: null, toast: at.n + '.mid saved', toastUndo: false }), del: () => drop(at.id),
      undo: () => S({ toast: null, gone: st.lastMany ? gone.filter((g) => !st.lastMany.includes(g)) : gone.filter((g) => g !== st.last), lastMany: null }),
      atN: at.n, atD: at.d,
      grids: seg(['1/4', '1/8', '1/16', '1/4t', '1/8t'], grid, (l) => S({ grid: l })),
      rawOn: raw, rawOnBg: raw ? '#7FB685' : '#DAD1C8', rawOnX: raw ? 22 : 2, toggleRaw: () => S({ hideRaw: !raw }),
      intoV: into, openInto: () => S({ sheet: 'into' }), intoOn: st.sheet === 'into',
      intoList: ['Both staves', 'Right hand', 'Left hand', 'Melody'].map((l) => ({ l, mark: l === into ? '✓' : '', pick: () => S({ into: l, sheet: null }) })),
      discard: () => drop(at.id), save: () => S({ page: null, toast: 'Written into bars 3–10', toastUndo: false }) };'''

PLAYMINI = (f'<button type="button" aria-label="Play" onClick="{{{{r.play}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: {{{{r.pbg}}}}; color: {INK}; display: flex; align-items: center; justify-content: center">'
            + PLAY.replace('width="22" height="22"', 'width="20" height="20"') + '</button>')
TKROW = (f'<div style="min-height: 64px; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 8px 4px 8px 12px; box-shadow: inset 0 -1px 0 {FILL}">{PLAYMINI}'
         f'<a href="Take.dc.html" style="flex: 1; min-width: 0; min-height: 44px; display: flex; flex-direction: column; justify-content: center; color: {INK}; text-decoration: none"><span style="font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{r.n}}}}</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{r.d}}}}</span></a>'
         f'<button type="button" aria-label="Take actions" onClick="{{{{r.more}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div>')
TKCHECK = (f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="flex: none; width: 24px; height: 24px; margin: 0 10px; box-sizing: border-box; border-radius: 12px; border: 2px solid {{{{r.ckLine}}}}; background: {{{{r.ckBg}}}}; color: {SHEET}; display: flex; align-items: center; justify-content: center"><span style="display: flex; opacity: {{{{r.ckMark}}}}">{ICON(TICK, 14)}</span></span></sc-if>')
TKHIT = f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" role="checkbox" aria-checked="{{{{r.on2}}}}" aria-label="{{{{r.n}}}}" onClick="{{{{r.tap}}}}" style="position: absolute; inset: 0; z-index: 1; border: 0; background: transparent"></button></sc-if>'
assert TKROW.count('{PLAYMINI}') == 0 and TKROW.count(PLAYMINI) == 1
_TKMORE = TKROW[TKROW.index('<button type="button" aria-label="Take actions"'):TKROW.index('</button></div>', TKROW.index('aria-label="Take actions"')) + len('</button>')]
TKROW = TKROW.replace(_TKMORE, f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{_TKMORE}</sc-if>', 1)
TKROW = TKROW.replace('<div style="min-height: 64px; box-sizing: border-box; display: flex;', '<div style="position: relative; min-height: 64px; box-sizing: border-box; display: flex;', 1).replace(PLAYMINI, TKHIT + TKCHECK + f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYMINI}</sc-if>', 1)
TKSEL = f'<sc-if value="{{{{canSel}}}}" hint-placeholder-val="{{{{true}}}}">{TB("Select", "toggleSel")}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{TB("Cancel", "toggleSel")}</sc-if>'
_TKSELIN = SELACT('{{selDlL}}', 'selDl', ACTIC['Export']) + SELACT('{{selDelL}}', 'selDel', ACTIC['Delete'], RED)
TKSELBAR = f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(_TKSELIN, 34)}</sc-if>'
TKSELBAR_L = f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">' + DOCK(_TKSELIN, 28, w=440) + '</sc-if>'
TKLIST = (IF('some', f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="3">{TKROW}</sc-for></div>', 'true')
          + SHOWSTATES() + EMPTY('none', MUSICN, 'No takes yet', 'Press Record beside Play in the editor, play, then Stop: each take is kept here.'))

def _HEADS(w):
    # bar 1 (and bar 2 when the staff is wide), each note spread across its bar as an engraver spaces them
    ys = [38, 26, 34, 30, 34, 38, 30, 26]
    n = 8 if w > 500 else 4
    x0, x1 = 70, w - 30
    return [(round(x0 + i * (x1 - x0) / n), ys[i]) for i in range(n)]
def RESULT(w):
    # the take written as notes, the grand staff the review writes into (Amazing Grace's first bar)
    ys = [10 + i * 8 for i in range(5)]; yb = [78 + i * 8 for i in range(5)]
    lines = ''.join(f'<path d="M8 {y}H{w - 8}" stroke="#685E56" stroke-width="1"></path>' for y in ys + yb)
    heads = ''.join(HEADG('black', x, y, 8) + f'<path d="M{x + 5} {y}V{y - 26}" stroke="{INK}" stroke-width="1.3"></path>' for x, y in _HEADS(w))
    return (f'<svg viewBox="0 0 {w} 120" width="100%" role="img" aria-label="The take written as notes: bar 1" style="display: block">{lines}'
            f'<path d="M8 10V110M{w - 8} 10V110" stroke="#685E56" stroke-width="1.2"></path><text x="16" y="42" font-family="Noto Music, serif" font-size="32" fill="{INK}">𝄞</text><text x="16" y="110" font-family="Noto Music, serif" font-size="36" fill="{INK}">𝄢</text>{heads}'
            f'<rect x="110" y="94" width="14" height="4" fill="{INK}"></rect>' + (f'<path d="M{(70 + w - 30) // 2 - 8} 10V110" stroke="#685E56" stroke-width="1"></path><rect x="{(70 + w - 30) // 2 + 40}" y="94" width="14" height="4" fill="{INK}"></rect>' if w > 500 else '') + '</svg>')
SPLIT = lambda w: f'<div style="position: relative">{PROLL(w, 90)}<div style="position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: #B3261E"></div><span style="position: absolute; left: 8px; top: calc(50% - 12px); height: 24px; padding: 0 8px; border-radius: 12px; background: #B3261E; color: #FFFFFF; font-size: 13px; font-weight: 600; display: flex; align-items: center">Split point: C4</span></div>'
# on a laptop the chosen take is the lit card in the row above, so the review names it only on a phone (clean, owner 2026-11-26)
REVIEW = lambda w, head=True: ((f'<div style="display: flex; flex-direction: column"><span style="font-size: 17px; font-weight: 700">{{{{atN}}}}</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{atD}}}}</span></div>' if head else '')
                    + CARD(RESULT(w), '8px 12px') + CARD(SPLIT(w), '8px 12px')
                    + f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Quantize</span><div style="display: grid">{SEGC("grids", 44, 14)}</div></div>'
                    + GROUP(('toggle', 'Hide raw notes', 'rawOn', 'toggleRaw'), ('link', 'Into', '{{intoV}}', 'openInto'), bg=SHEET)
                    + f'<div style="display: flex; gap: 12px; margin-top: 4px">{BTN("Discard", "discard", "", "quiet")}{BTN("Save to score", "save")}</div>')
BACKB = f'<button type="button" aria-label="Back" onClick="{{{{toList}}}}" data-tip="Back" style="{GLASSST}; margin-left: -4px">{CHEV_L}</button>'
TKS_MORE = ROWMENU('moreOn', '{{moreT}}', [('action', 'Review', 'doReview'), ('action', 'Download', 'download'), ('action', 'Delete', 'del', RED)])
TKS_INTO = f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{intoList}}}}" as="o" hint-placeholder-count="4"><button type="button" onClick="{{{{o.pick}}}}" style="width: 100%; min-height: 48px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {FILL}; color: {INK}; font: inherit; font-size: 16px; text-align: left; display: flex; align-items: center; padding: 0 16px"><span style="flex: 1">{{{{o.l}}}}</span><span style="color: {LINK}; font-weight: 700">{{{{o.mark}}}}</span></button></sc-for></div>'
tksph = (IF('isList', TOP('Editor.dc.html', '{{pageT}}', TKSEL, 'Amazing Grace'), 'true') + IF('isReview', TOP('', 'Review your recording', '', 'Takes', BACKB))
         + NARROW(IF('isList', TKLIST, 'true') + IF('isReview', REVIEW(340))) + TKSELBAR + TOASTS)
TKROWL = (TKROW.replace('<a href="Take.dc.html" style="flex: 1;', '<button type="button" aria-current="{{r.cur}}" onClick="{{r.pick}}" style="flex: 1; border: 0; background: transparent; padding: 0; font: inherit; text-align: left;', 1)
          .replace('</span></a>', '</span></button>', 1).replace('padding: 8px 4px 8px 12px;', 'padding: 8px 4px 8px 12px; background: {{r.bg}};', 1).replace('background: {{r.pbg}}', 'background: {{r.pbgL}}', 1))
assert TKROWL != TKROW and '</a>' not in TKROWL
# on a laptop the takes are a row of cards across the top, the chosen one filled, the review the page's width under
# them (the lines: a list column ending 355 above its neighbour left a bare band)
TKLISTL = (IF('some', f'<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(max(220px, calc((100% - 32px) / 3)), 1fr)); gap: 16px"><sc-for list="{{{{rows}}}}" as="r" hint-placeholder-count="3">{TKROWL.replace(f"box-shadow: inset 0 -1px 0 {FILL}", f"border-radius: 14px; overflow: hidden; box-shadow: 0 0 0 1px {LINE}", 1)}</sc-for></div>', 'true'))
tkslm = (LTITLEBAR('{{pageT}}', TKSEL, 'EditorLaptop.dc.html') + SHOWSTATES()  # Back and the title in one bar, as every laptop sub-page (loop round 60)
         + IF('some', f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 40px 32px 96px; display: flex; flex-direction: column; gap: 24px">'
              f'<div class="nos" style="display: flex; flex-direction: column; gap: 16px">{TKLISTL}</div>'
              # the review stands on the paper beside the list, never a card holding cards (scan-first 6; edge-lines 3)
              f'<section aria-label="Review your recording" style="display: flex; flex-direction: column; gap: 16px">'
              f'{REVIEW(900, False)}</section></main>', 'true')
         + IF('none', WIDE(EMPTY('none', MUSICN, 'No takes yet', 'Press Record beside Play in the editor, play, then Stop: each take is kept here.'), 720))
         + TKSELBAR_L + TOASTL)
TKS_MOREL = ROWMENU('moreOn', '{{moreT}}', [('action', 'Download', 'download'), ('action', 'Delete', 'del', RED)])
phone('Takes', 'The takes and Review your recording, phone', tksph, js(TKS_SRC), TKS_MORE + BSHEET('intoOn', 'Into', TKS_INTO))
# on a laptop the takes are a page over the full-screen editor, as the app's: the editor's frame, no sidebar
full_laptop('TakesLaptop', 'The takes and Review your recording, laptop', tkslm, js(TKS_SRC),
            TKS_MOREL + POPOVER('intoOn', 'Into', TKS_INTO, 'right: 520px; bottom: 140px', 300))
print('r59 takes ok')
