# R58: the Chord player redrawn to its brief (.scratch/r39/plan/practice-chord-player.md, rulings of 2026-11-13):
# one icon, one meaning (ux-principles): layers is Versions' alone; a style is the drum (Lucide), saving to the
# learner's progressions list-plus, the Progressions place list-music; the chart (how it is written) a page of text,
# never the editor's Layout table; the sound panel is Audio, the Player's and the editor's word
DRUMP = '<path d="m2 2 8 8"></path><path d="m22 2-8 8"></path><ellipse cx="12" cy="9" rx="10" ry="5"></ellipse><path d="M7 13.4v7.9"></path><path d="M12 14v8"></path><path d="M17 13.4v7.9"></path><path d="M2 9v8a10 5 0 0 0 20 0V9"></path>'
LISTPLUSP = '<path d="M11 12H3"></path><path d="M16 6H3"></path><path d="M16 18H3"></path><path d="M18 9v6"></path><path d="M21 12h-6"></path>'
CHARTP = '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>'
LISTMUSP = '<path d="M21 15V6"></path><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M12 12H3"></path><path d="M16 6H3"></path><path d="M12 18H3"></path>'
# Musicca's chord sheet (Root, Chord, Bass note, Duration − n beats +, Suggested chords, Play from here, Duplicate,
# Delete, Done); each bar's beats as ticks, the sounding beat lit; a bar whose beats do not add up kept as it is and
# marked !; each section's Genos tag (Intro I–III, Main per pass, Fill in or Break into the next, Ending I–III) in its
# own sheet; the sheet's draft (Draft beside the name, Save and Discard draft in ···); Share (view only or can edit);
# and, with Follow a MIDI arranger on, the Genos's style strip as its panel names and lights it.
# Layered on r41_practice.py's ChordPlayer board: it keeps that board's piano, sheets and dock.
CP58 = CP.replace("    const SECS = [['A', 'Verse', 2, [['C'], ['G'], ['Am'], ['F'], ['C'], ['G'], ['F', 'G'], ['C']]], ['B', 'Chorus', 1, [['F'], ['G'], ['C', 'C/E'], ['F', 'G7'], ['Am'], ['F'], ['G7'], ['C']]], ['C', 'Bridge', 1, [['Dm7'], ['G7'], ['Em7', 'A7'], ['Dm7', 'G7']]]];",
r'''    // each bar's chords and their lengths in beats; the chorus's 4th bar holds 6 beats (F 4, G7 2), so it is marked !
    const SECS0 = [['A', 'Verse', 2, [['C'], ['G'], ['Am'], ['F'], ['C'], ['G'], ['F', 'G'], ['C']]], ['B', 'Chorus', 1, [['F'], ['G'], ['C', 'C/E'], ['F', 'G7'], ['Am'], ['F'], ['G7'], ['C']]], ['C', 'Bridge', 1, [['Dm7'], ['G7'], ['Em7', 'A7'], ['Dm7', 'G7']]]];
    const LEN0 = { '1:3': [4, 2] };
    const SECS = st.secs || SECS0, LEN = st.len || LEN0;
    const lens = (si, bi, cs) => LEN[si + ':' + bi] || (cs.length === 1 ? [4] : cs.map(() => 4 / cs.length));
    const TAGS0 = [{ intro: 'Intro I', mains: ['Main A', 'Main B'], into: 'Fill in' }, { mains: ['Main C'], into: 'Break' }, { mains: ['Main D'], ending: 'Ending I' }];
    const TAGS = st.tags || TAGS0, follow = st.follow ?? false;
    const tagLine = (t) => [t.intro, t.mains.join(', '), t.into, t.ending].filter((x) => x && x !== 'None').join(' · ');''', 1)
CP58 = CP58.replace("    const secs = SECS.map(([m, name, rep, bars], si) => ({ m, name, rep: '× ' + rep, bars: bars.map((cs, bi) => ({ cs: cs.map((c) => ({ c })), bg: play[0] === si && play[1] === bi ? '#EDC684' : !st.playing && (slot || {}).si === si && (slot || {}).bi === bi ? '#F6E7C8' : 'transparent', edge: bi % 4 === 3 ? '0' : '1px', pick: () => set({ sheet: 'chord', sel: [si, bi] }) })) }));",
r'''    const beatNow = st.playing ? ((st.pos ?? 4) % 2) * 2 : -1;
    const secs = SECS.map(([m, name, rep, bars], si) => ({ m, name, rep: '× ' + rep, tag: follow ? (tagLine(TAGS[si] || { mains: [] }) || 'Genos') : '', tagFg: tagLine(TAGS[si] || { mains: [] }) ? '#332921' : '#685E56', tagOn: follow, openTag: () => set({ sheet: 'tag', tagAt: si }),
      bars: bars.map((cs, bi) => { const ls = lens(si, bi, cs), sum = ls.reduce((a, b) => a + b, 0), wrong = sum !== 4, now = play[0] === si && play[1] === bi;
        return { cs: cs.map((c, ci) => ({ c, grow: String(ls[ci]), pick: () => set({ sheet: 'chord', sel: [si, bi], selC: ci }) })),
          ticks: Array.from({ length: Math.max(sum, 1) }, (_, k) => ({ bg: now && k === beatNow ? '#332921' : '#B9AEA3', w: k === 0 ? '10px' : '6px' })),
          wrong, wrongTip: 'Bar ' + (bi + 1) + ' holds ' + sum + ' beats, not 4: tap to set its chords’ lengths',
          bg: now ? '#EDC684' : !st.playing && (slot || {}).si === si && (slot || {}).bi === bi ? '#F6E7C8' : 'transparent', edge: bi % 4 === 3 ? '0' : '1px', pick: () => set({ sheet: 'chord', sel: [si, bi], selC: 0 }) }; }) }));
    const selB = (st.sel ? SECS[st.sel[0]][3][st.sel[1]] : SECS[0][3][0]) || ['C'], selCi = st.selC ?? 0, selSym = selB[selCi] || selB[0];
    const selLen = st.sel ? lens(st.sel[0], st.sel[1], selB)[selCi] : 4;
    const setLen = (d) => { if (!st.sel) return; const k = st.sel[0] + ':' + st.sel[1], cur = lens(st.sel[0], st.sel[1], selB).slice(); cur[selCi] = Math.max(1, Math.min(8, cur[selCi] + d)); set({ len: { ...LEN, [k]: cur } }); };
    const editSecs = (fn) => { const c = JSON.parse(JSON.stringify(SECS)); const l = JSON.parse(JSON.stringify(LEN)); fn(c, l); set({ secs: c, len: l, draft: true, hist: [...(st.hist || []), { secs: st.secs, len: st.len, tags: st.tags, draft: st.draft }] }); };
    const tagAt = st.tagAt ?? 0, tg = TAGS[tagAt] || { mains: [] };
    const setTag = (o) => set({ tags: TAGS.map((t, i) => (i === tagAt ? { ...t, ...o } : t)), draft: true, hist: [...(st.hist || []), { secs: st.secs, len: st.len, tags: st.tags, draft: st.draft }] });
    const SEGT = (opts, cur, pick) => opts.map((l) => ({ l, on: l === cur, bg: l === cur ? '#FEFDFB' : 'transparent', sh: l === cur ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: l === cur ? 600 : 500, pick: () => pick(l) }));
    // the Genos's panel, its lamps: on (chosen), flashing (next), available, off (no data)
    const ar = st.ar || { acmp: true, sync: false, syncStop: false, autoFill: true, ots: false, main: null, next: null, intro: null, ending: null, fade: false };
    const lamp = (on, next) => ({ bg: on ? '#EEE2CF' : '#FEFDFB', fg: '#332921', ring: on ? '0 0 0 1.5px #332921' : next ? '0 0 0 1.5px #B98A32' : '0 0 0 1px #DAD1C8' });
    const arSet = (o) => set({ ar: { ...ar, ...o } });''', 1)
CP58 = CP58.replace("    return { ...common(st, set),", r'''    return { ...common(st, set), draftOn: !!st.draft, addSec: () => { editSecs((c) => { const L = 'ABCDEFGH'[c.length] || 'X'; c.push([L, 'Section ' + L, 1, [['C'], ['F'], ['G'], ['C']]]); }); set({ tags: [...TAGS, JSON.parse(JSON.stringify(TAGS[TAGS.length - 1] || { mains: [] }))] }); }, copyL: st.copied ? 'Link copied' : 'Copy link', copyLink: () => set({ copied: true }), saveProg: () => set({ sheet: null, toastT: 'Saved to My progressions' }), importChart: () => set({ sheet: null }), exportMidi: () => set({ sheet: null }), exportChart: () => set({ sheet: null }), saveDraft: () => set({ draft: false, sheet: null }), discardDraft: () => set({ draft: false, secs: null, len: null, tags: null, sheet: null }),
      secOn: st.sheet === 'sec', secTitle: SECS[st.secAt ?? 0] ? SECS[st.secAt ?? 0][1] : '', secPos: st.secPos ?? 'left: 640px; top: 160px', tagPos: st.tagPos ?? 'left: 640px; top: 160px', secPopL: (SECS[st.secAt ?? 0] || [])[1] || '', openSecPop: () => set({ pop: st.pop === 'sec' ? null : 'sec' }), secPopOn: st.pop === 'sec',
      secChips: chipsOf(['Intro', 'Verse', 'Pre-chorus', 'Chorus', 'Bridge', 'Solo', 'Outro'], (SECS[st.secAt ?? 0] || [])[1], (l) => { editSecs((c) => { c[st.secAt ?? 0][1] = l; }); set({ pop: null }); }),
      secLoopSw: !!st.loop77 && (st.loopAt ?? 0) === (st.secAt ?? 0), secLoopSwBg: !!st.loop77 && (st.loopAt ?? 0) === (st.secAt ?? 0) ? '#44684A' : '#DAD1C8', secLoopSwX: !!st.loop77 && (st.loopAt ?? 0) === (st.secAt ?? 0) ? 22 : 2,
      toggleSecLoop: () => { const on = !!st.loop77 && (st.loopAt ?? 0) === (st.secAt ?? 0); set({ loop77: !on, loopAt: st.secAt ?? 0, toastT: on ? 'Loop off' : 'Looping the ' + ((SECS[st.secAt ?? 0] || [])[1] || 'section') }); },
      dupSec: () => { editSecs((c) => { c.splice((st.secAt ?? 0) + 1, 0, JSON.parse(JSON.stringify(c[st.secAt ?? 0]))); }); set({ sheet: null, pop: null, toastT: 'Section duplicated' }); },
      tagOnSheet: st.sheet === 'tag', tagTitle: SECS[tagAt] ? SECS[tagAt][1] + ' on the Genos' : '', tagIsFirst: tagAt === 0, tagIsLast: tagAt === SECS.length - 1,
      introSeg: SEGT(['None', 'Intro I', 'Intro II', 'Intro III'], tg.intro || 'None', (l) => setTag({ intro: l })),
      passes: (tg.mains.length ? tg.mains : ['None']).map((mv, pi) => ({ n: 'Main, ' + ['1st', '2nd', '3rd', '4th'][pi] + ' time', seg: SEGT(['None', 'A', 'B', 'C', 'D'], mv === 'None' ? 'None' : mv.slice(-1), (l) => setTag({ mains: tg.mains.map((x, i) => (i === pi ? (l === 'None' ? 'None' : 'Main ' + l) : x)) })) })),
      intoSeg: SEGT(['None', 'Fill in', 'Break'], tg.into || 'None', (l) => setTag({ into: l })),
      endingSeg: SEGT(['None', 'Ending I', 'Ending II', 'Ending III'], tg.ending || 'None', (l) => setTag({ ending: l })),
      chordOn58: st.sheet === 'chord', selSym, selTitle: 'Bar ' + ((st.sel ? st.sel[1] : 0) + 1) + ' · ' + selSym, selLen: selLen + (selLen === 1 ? ' beat' : ' beats'), lenDn: () => setLen(-1), lenUp: () => setLen(1),
      chordRoots: rootGrid(Math.max(0, ROOTS.indexOf((selSym.match(/^[A-G][♭♯]?/) || ['C'])[0].replace('D♭', 'C♯').replace('G♭', 'F♯'))), () => {}),
      qualChips: chipsOf(['maj', 'm', '7', 'maj7', 'm7', 'sus4', 'sus2', 'dim', 'add9', '6'], (() => { const q = selSym.split('/')[0].replace(/^[A-G][♭♯]?/, ''); return q === '' ? 'maj' : q === '°' ? 'dim' : q; })(), () => {}),
      duplicate: () => editSecs((s, l) => { const [si, bi] = st.sel || [0, 0]; s[si][3].splice(bi + 1, 0, s[si][3][bi].slice()); }),
      removeChord: () => editSecs((s) => { const [si, bi] = st.sel || [0, 0]; s[si][3].splice(bi, 1); }),
      playFrom: () => set({ sheet: null, playing: true, pos: 0 }),
      shareOn: st.sheet === 'share', openShare: () => set({ sheet: 'share' }), libOn: st.sheet === 'lib' || st.sheet === 'libRn', openLib: () => set({ sheet: 'lib' }), libOpen1: () => set({ sheet: null, toastT: 'Opened Isus s-a născut' }), libOpen2: () => set({ sheet: null, toastT: 'Opened Axis of Awesome' }), libOpen3: () => set({ sheet: null, toastT: 'Opened Let It Be' }), libOpen4: () => set({ sheet: null, toastT: 'Opened Yesterday' }), libOpen5: () => set({ sheet: null, toastT: 'Opened Clocks' }), libOpen6: () => set({ sheet: null, toastT: 'Opened 50s doo-wop' }), libOpen7: () => set({ sheet: null, toastT: 'Opened Alternative pop' }),
      libMine: (st.libL ?? ['My verse and chorus', 'Blues in F', 'Autumn Leaves sketch']).map((n) => ({ n, cur: n === sheetsL ? 'true' : 'false', fg: n === sheetsL ? '#356890' : '#332921', open: () => set({ sheet: null, hist: [], sheetName: n, toastT: n === sheetsL ? null : 'Opened ' + n }), more: (e) => set({ libRow: n, libPos: ANCHOR(e, 156) }) })),
      libNone: (st.libL ?? [1]).length === 0, libRowOn: st.sheet === 'lib' && !!st.libRow, libPos: st.libPos ?? '', libRowT: (st.libRow ?? '') + ': more', libRowOff: () => set({ libRow: null }),
      libRename: () => set({ sheet: 'libRn', rnName: st.libRow, rnWas: st.libRow, libRow: null }), renameOn: st.sheet === 'libRn', rnName: st.rnName ?? '', typeRn: (e) => set({ rnName: e.target.value }),
      rnBg: (st.rnName || '').trim() ? '#EDC684' : '#EEE9E2', rnFg: (st.rnName || '').trim() ? '#332921' : '#9C9086',
      doRename: () => { const n = (st.rnName || '').trim(); if (!n) return; const L = st.libL ?? ['My verse and chorus', 'Blues in F', 'Autumn Leaves sketch']; set({ sheet: 'lib', libL: L.map((x) => (x === st.rnWas ? n : x)), ...(st.rnWas === sheetsL ? { sheetName: n } : {}) }); },
      libDup: () => { const L = st.libL ?? ['My verse and chorus', 'Blues in F', 'Autumn Leaves sketch']; const at = L.indexOf(st.libRow); set({ libRow: null, libL: [...L.slice(0, at + 1), st.libRow + ' (copy)', ...L.slice(at + 1)] }); },
      libDel: () => { const L = st.libL ?? ['My verse and chorus', 'Blues in F', 'Autumn Leaves sketch']; set({ libRow: null, libL: L.filter((x) => x !== st.libRow), libWas: L, libWasHand: st.libRow === sheetsL, ...(st.libRow === sheetsL ? { fresh: true } : {}), toastT: '“' + st.libRow + '” deleted' }); }, libStyles: ['Pop', 'Rock', 'Jazz', 'Blues', 'Classical', 'R&B / Soul', 'Gospel', 'Modal', 'Theory'].map((l, i) => ({ l, bg: (st.libSty ?? 0) === i ? '#332921' : '#EEE9E2', fg: (st.libSty ?? 0) === i ? '#FEFDFB' : '#332921', pick: () => set({ libSty: i }) })), shareGuest: !!st.guest, shareFull: !st.guest, shareSeg: SEGT(['View only', 'Can edit'], st.shareMode ?? 'View only', (l) => set({ shareMode: l })),
      followSw: follow, followSwBg: follow ? '#44684A' : '#DAD1C8', followSwX: follow ? 22 : 2, followBg: follow ? '#44684A' : '#DAD1C8', followX: follow ? 22 : 2, toggleFollow: () => set({ follow: !follow }),
      states: [{ l: 'Following the Genos', bg: follow ? '#332921' : '#EEE9E2', pick: () => set({ follow: !follow }) }],
      arOn: follow, arStart: lamp(!!st.playing), arAcmp: lamp(ar.acmp), arSync: lamp(ar.sync), arSyncStop: lamp(ar.syncStop), arAuto: lamp(ar.autoFill), arOts: lamp(ar.ots), arFade: lamp(ar.fade), arBreak: lamp(false, ar.next === 'Break'),
      arIntros: ['I', 'II', 'III'].map((n) => ({ n, ...lamp(ar.intro === n), pick: () => arSet({ intro: ar.intro === n ? null : n }) })),
      arMains: ['A', 'B', 'C', 'D'].map((n) => ({ n, ...lamp(ar.main === n, ar.next === n), pick: () => arSet(ar.main === n ? { next: 'fill' } : { next: n, main: st.playing ? ar.main : n }) })),
      arEndings: ['I', 'II', 'III'].map((n) => ({ n, ...lamp(ar.ending === n), pick: () => arSet({ ending: ar.ending === n ? null : n }) })),
      tAcmp: () => arSet({ acmp: !ar.acmp }), tSync: () => arSet({ sync: !ar.sync }), tSyncStop: () => arSet({ syncStop: !ar.syncStop }), tAuto: () => arSet({ autoFill: !ar.autoFill }), tOts: () => arSet({ ots: !ar.ots }), tFade: () => arSet({ fade: !ar.fade }), tBreak: () => arSet({ next: 'Break' }),
      arTitle: st.playing ? 'Genos · playing Main ' + ar.main : 'Genos · waiting for Start',''', 1)
assert CP58.count('draftOn') == 1 and CP58.count('SECS0') == 2, 'CP58 patch missed'

# ── the chart: beats under each bar, the ! on a bar that does not add up, the section's Genos tag ──
BANG = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#C2412D"></circle><path d="M12 6.5v7M12 17.2v.3" stroke="#FEFDFB" stroke-width="2.6" stroke-linecap="round"></path></svg>'

# ── the chord's sheet, as Musicca's: Root, Chord, Bass note, Duration − n beats +, Suggested chords, the acts ──
CHIPROW = lambda lst: f'<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{{lst}}}}}" as="p" hint-placeholder-count="6"><button type="button" onClick="{{{{p.pick}}}}" style="height: 40px; min-width: 52px; padding: 0 12px; border: 0; border-radius: 10px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 15px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div>'
DUPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>'
TRASHI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path></svg>'
PLAYS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>'

# ── a section on the Genos: Intro (first section), Main per pass, into the next, Ending (last section) ──
_SECTG = lambda t, body: f'<section aria-label="{t}" style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">{t}</h3>{body}</section>'
CP_TAG = ('<div style="display: flex; flex-direction: column; gap: 24px">'
          + f'<sc-if value="{{{{tagIsFirst}}}}" hint-placeholder-val="{{{{true}}}}">' + _SECTG('Intro', SEGC('introSeg', 36, 14, True)) + '</sc-if>'
          + f'<sc-for list="{{{{passes}}}}" as="p" hint-placeholder-count="2"><section style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">{{{{p.n}}}}</h3>{SEGC("p.seg", 36, 14, True)}</section></sc-for>'
          + _SECTG('Into the next section', SEGC('intoSeg', 36, 14, True))
          + f'<sc-if value="{{{{tagIsLast}}}}" hint-placeholder-val="{{{{false}}}}">' + _SECTG('Ending', SEGC('endingSeg', 36, 14, True)) + '</sc-if>'
          + '</div>')

# signed out, Share says sharing needs an account and leads to Sign in (the app's `Said`, the kit's one empty state);
# the sheet stays on the device either way
_USERI = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>'
CP_SHARE = (f'<sc-if value="{{{{shareFull}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 24px">' + _SECTG('People with the link', SEGC('shareSeg', 36, 14, True))
            + BTN('{{copyL}}', 'copyLink', kind='primary', h=50) + '</div></sc-if>'
            + EMPTY('shareGuest', _USERI, 'Sharing needs an account', 'Sign in to share this sheet. It stays on this device too.', BTN('Sign in', href='SignIn.dc.html', kind='primary', h=50, grow=False)))

# All chord sheets (the app's LibrarySheet): My chord sheets (the one open in the link's blue, each row's ··· Rename,
# Duplicate, Delete), the songs the app holds as sheets, then the progressions by style; a tap opens one in place of
# the sheet in hand. A popover at the name on a laptop (320, as its menu), a page from the name's menu on a phone.
_LIBH = lambda t: f'<h2 style="margin: 0; padding: 0 4px; font-size: 14px; font-weight: 600; color: {SOFT}">{t}</h2>'
_LIBSEC = lambda t, body, gap=4: f'<section aria-label="{t}" style="display: flex; flex-direction: column; gap: {gap}px">{_LIBH(t)}{body}</section>'
_MOREI = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>'
_LIBMINE = (f'<sc-for list="{{{{libMine}}}}" as="p" hint-placeholder-count="3"><li style="display: flex; align-items: center; gap: 4px; min-height: 48px">'
            f'<button type="button" onClick="{{{{p.open}}}}" aria-current="{{{{p.cur}}}}" style="flex: 1; min-width: 0; min-height: 48px; padding: 0 8px; border: 0; border-radius: 12px; background: transparent; color: {{{{p.fg}}}}; font: inherit; font-size: 16px; font-weight: 600; text-align: left">{{{{p.n}}}}</button>'
            f'<button type="button" aria-label="{{{{p.n}}}}: more" data-tip="More" onClick="{{{{p.more}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">'
            + _MOREI + '</button></li></sc-for>')
_LIBTWO = lambda n, sub, act: (f'<li><button type="button" onClick="{{{{{act}}}}}" style="width: 100%; min-height: 48px; padding: 4px 8px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 16px; line-height: 24px; text-align: left; display: flex; flex-direction: column; justify-content: center">'
                               f'<span style="font-weight: 600">{n}</span><span style="color: {SOFT}">{sub}</span></button></li>')
_UL = lambda rows: '<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column">' + rows + '</ul>'
CP_LIB = ('<div style="display: flex; flex-direction: column; gap: 24px">'
          + _LIBSEC('My chord sheets', _UL(_LIBMINE) + f'<sc-if value="{{{{libNone}}}}" hint-placeholder-val="{{{{false}}}}"><p style="margin: 0; padding: 0 4px; font-size: 16px; line-height: 24px; color: {SOFT}; text-wrap: pretty">None saved yet. Save the sheet in hand from its name.</p></sc-if>')
          + _LIBSEC('Songs', _UL(_LIBTWO('Isus s-a născut', 'David Preuteasa Band', 'libOpen1')))
          + _LIBSEC('Progressions', CHIPS('libStyles', wrap=True) + _UL(_LIBTWO('Axis of Awesome', 'I – V – vi – IV', 'libOpen2') + _LIBTWO('Let It Be', 'I – V – vi – IV – I – V – IV – I', 'libOpen3')
                    + _LIBTWO('Yesterday', 'I – V/vi – vi – IV – V – I – vi – V/V – IV – I', 'libOpen4') + _LIBTWO('Clocks', 'I – v – v – ii', 'libOpen5') + _LIBTWO('50s doo-wop', 'I – vi – IV – V', 'libOpen6') + _LIBTWO('Alternative pop', 'I – IV – vi – V', 'libOpen7')), 12)
          + '</div>')


# ── R59 (owner, 2026-11-14, Musicca's chord player beside it: "make the ui of the chords like the musicca does";
# "one tap on the chord selects it and plays from there when I play and double click opens this chord settings";
# "the floating bar … doesnt stand above the content like pinned above the keyboard"): each chord a white box as
# wide as its beats, its beats ticked along its foot, its name large with the extension raised; a + box ends each
# section; the section's head Musicca's (name, × n, Variation n, delete, grip); one tap selects a chord, Play starts
# there, a tap on the chosen chord opens its sheet (no timed double tap: laws, every gesture has a visible twin), Musicca's dialog (Chord root ⌄ quality ⌄, Bass note ⌄, Duration, Suggested
# chords four across, Delete · Duplicate · Play from here); the dock floats pinned just above the keys.
CP58 = CP58.replace("    return { ...common(st, set), draftOn:", r"""    const SUP = (c) => { const m = c.match(/^([A-G][♭♯]?)((?:m(?!aj))?)([^/]*)(\/.*)?$/); return m ? { r: m[1] + m[2], x: m[3] || '', b: m[4] || '' } : { r: c, x: '', b: '' }; };
    const VARS = st.vars || [2, 2, 3], sb = st.selB59 || null;
    const sec59 = SECS.map(([m, name, rep, bars], si) => { const boxes = [];
      bars.forEach((cs, bi) => { const ls = lens(si, bi, cs), sum = ls.reduce((a, b) => a + b, 0), wrong = sum !== 4, nowBar = play[0] === si && play[1] === bi; let from = 0;
        cs.forEach((c, ci) => { const L = ls[ci], now = nowBar && beatNow >= from && beatNow < from + L, picked = !!sb && sb[0] === si && sb[1] === bi && sb[2] === ci, f0 = from;
          boxes.push({ ...SUP(c), span: 'span ' + L, label: c + ', ' + L + (L === 1 ? ' beat' : ' beats'),
            ticks: Array.from({ length: L }, (_, k) => ({ bg: now && f0 + k === beatNow ? '#332921' : '#C9BFB5', h: now && f0 + k === beatNow ? '10px' : '6px' })),
            picked, bg: now ? '#F6E7C8' : '#FEFDFB', ring: now || picked ? '0 0 0 2px #B98A32' : '0 0 0 1px #DAD1C8',
            wrong: wrong && ci === cs.length - 1, wrongTip: 'Bar ' + (bi + 1) + ' holds ' + sum + ' beats, not 4',
            tap: (e) => set(picked ? { sheet: 'chord', sel: [si, bi], selC: ci, selB59: [si, bi, ci], pop: null, chordPos: ANCHOR(e, 420) } : { sel: [si, bi], selC: ci, selB59: [si, bi, ci] }) });
          from += L; }); });
      return { m, name, rep: '× ' + rep, vari: 'Variation ' + (VARS[si] ?? 1), tag: follow ? (tagLine(TAGS[si] || { mains: [] }) || 'Genos') : '', tagFg: tagLine(TAGS[si] || { mains: [] }) ? '#332921' : '#685E56', tagOn: follow, openTag: (e) => set({ sheet: 'tag', tagAt: si, tagPos: ANCHOR({ currentTarget: e.currentTarget.firstElementChild }, 460) }), openSec: (e) => set({ sheet: 'sec', secAt: si, pop: null, secPos: ANCHOR(e, 380) }), boxes,
        repUp: () => editSecs((x) => { x[si][2] = (x[si][2] % 4) + 1; }), varUp: () => set({ vars: SECS.map((_, i) => (i === si ? ((VARS[i] ?? 1) % 4) + 1 : VARS[i] ?? 1)), draft: true }),
        del: () => editSecs((x) => { x.splice(si, 1); }), add: () => set({ sheet: 'chord', sel: [si, bars.length - 1], selC: 0, pop: null }) }; });
    const QN = { '': 'major', m: 'minor', '7': '7', maj7: 'maj7', m7: 'm7', sus4: 'sus4', sus2: 'sus2', dim: 'dim', add9: 'add9', '6': '6', '°': 'dim' };
    const selParts = SUP(selSym), selRoot = (selSym.match(/^[A-G][♭♯]?/) || ['C'])[0], selQ = selSym.split('/')[0].replace(/^[A-G][♭♯]?/, ''), selBass = selSym.includes('/') ? selSym.split('/')[1] : '';
    const pops = (k) => () => set({ pop: st.pop === k ? null : k });
    const ord = SLOTS.findIndex((x) => sb && x.si === sb[0] && x.bi === sb[1]);
    return { ...common(st, set), sec59, togglePlay: () => set(st.playing ? { playing: false } : { playing: true, pos: ord < 0 ? 0 : ord }),
      rootPopL: selRoot, qualPopL: QN[selQ] ?? selQ, bassPopL: selBass ? selBass : selRoot + ' (root)', openRootPop: pops('root'), openQualPop: pops('qual'), openBassPop: pops('bass'),
      rootPopOn: st.pop === 'root', qualPopOn: st.pop === 'qual', bassPopOn: st.pop === 'bass',
      bassChips: chipsOf(['Root', 'C', 'D', 'E', 'F', 'G', 'A', 'B'], selBass || 'Root', () => {}),
      suggest59: ['C/E', 'Dm', 'F/C', 'B♭', 'C', 'C7', 'Am', 'Gm'].map((c) => ({ ...SUP(c), pick: () => editSecs((x) => { x[st.sel ? st.sel[0] : 0][3][st.sel ? st.sel[1] : 0][selCi] = c; }) })), draftOn:""", 1)
assert CP58.count('sec59') == 2, 'R59 patch missed'

def CHART59(cols, gap, bh, bf, plus):
    sup = f'<sup style="font-size: max(12px, .6em); vertical-align: .6em; margin-left: 1px">{{{{b.x}}}}</sup>'
    box = (f'<sc-for list="{{{{x.boxes}}}}" as="b" hint-placeholder-count="8"><button type="button" onClick="{{{{b.tap}}}}" aria-label="{{{{b.label}}}}" style="grid-column: {{{{b.span}}}}; position: relative; min-width: 0; height: {bh}px; padding: 4px 8px 0; border: 0; border-radius: 8px; background: {{{{b.bg}}}}; box-shadow: {{{{b.ring}}}}; color: {INK}; font: inherit; text-align: left; display: flex; align-items: flex-start">'
           f'<span style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: {bf}px; font-weight: 500; line-height: 1.25">{{{{b.r}}}}{sup}{{{{b.b}}}}</span>'
           f'<span aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 10px; display: flex"><sc-for list="{{{{b.ticks}}}}" as="t" hint-placeholder-count="4"><span style="flex: 1; display: flex; justify-content: center; align-items: flex-end"><span style="width: 1.5px; height: {{{{t.h}}}}; background: {{{{t.bg}}}}"></span></span></sc-for></span>'
           f'<sc-if value="{{{{b.picked}}}}" hint-placeholder-val="{{{{false}}}}"><span role="separator" aria-orientation="vertical" aria-label="Drag to change its length" data-tip="Drag to change its length" style="position: absolute; top: 0; right: -10px; bottom: 0; width: 24px; display: flex; align-items: center; justify-content: center; cursor: ew-resize; z-index: 2"><span style="width: 4px; height: 55%; border-radius: 2px; background: {INK}"></span></span></sc-if><sc-if value="{{{{b.wrong}}}}" hint-placeholder-val="{{{{false}}}}"><span role="img" aria-label="{{{{b.wrongTip}}}}" data-tip="{{{{b.wrongTip}}}}" style="position: absolute; top: -7px; right: -7px; display: flex">{BANG}</span></sc-if></button></sc-for>')
    plusb = f'<button type="button" onClick="{{{{x.add}}}}" aria-label="Add a chord to {{{{x.name}}}}" style="grid-column: span {plus}; min-width: 0; height: {bh}px; border: 0; border-radius: 8px; background: transparent; box-shadow: 0 0 0 1px {LINE}; color: {SOFT}; display: grid; place-items: center"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5v14"></path></svg></button>'
    pill = lambda inner, act, label, extra='': f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{label}" style="flex: none; height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; {extra}"><span style="height: 36px; box-sizing: border-box; padding: 0 12px; border-radius: 8px; background: {FILL}; display: flex; align-items: center; font-size: 15px; white-space: nowrap; font-variant-numeric: tabular-nums">{inner}</span></button>'
    head = (f'<div style="display: flex; align-items: center; gap: 8px; min-height: 44px">'
            + pill('<span style="overflow: hidden; text-overflow: ellipsis; font-weight: 600">{{x.name}}</span>', 'x.openSec', 'Section: {{x.name}}', 'flex: 0 1 160px; min-width: 0').replace('height: 36px; box-sizing', 'width: 100%; height: 36px; box-sizing')
            + pill('{{x.rep}}', 'x.repUp', 'Plays {{x.rep}}') + pill('{{x.vari}}', 'x.varUp', '{{x.vari}}')
            + f'<button type="button" onClick="{{{{x.del}}}}" aria-label="Delete {{{{x.name}}}}" data-tip="Delete section" style="flex: none; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{TRASHI}</button>'
            + f'<span style="flex: 1"></span><span aria-label="Move {{{{x.name}}}}" style="flex: none; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: {SOFT}; cursor: grab">{GRIP}</span></div>')
    tag = f'<sc-if value="{{{{x.tagOn}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{x.openTag}}}}" aria-label="On the Genos: {{{{x.tag}}}}" style="align-self: flex-start; max-width: 100%; height: 44px; margin: -6px 0 -2px; padding: 0; border: 0; background: transparent; font: inherit; color: {INK}"><span style="height: 30px; padding: 0 12px; border-radius: 8px; box-shadow: inset 0 0 0 1px {LINE}; display: flex; align-items: center; font-size: 13px; font-weight: 600; color: {{{{x.tagFg}}}}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{x.tag}}}}</span></button></sc-if>'
    return (f'<div style="display: flex; flex-direction: column; gap: 16px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px"><span style="font-size: 22px; font-weight: 600">My verse and chorus</span><sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; font-weight: 600; color: #7A5418">Draft</span></sc-if><sc-if value="{{{{freshOn}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; font-weight: 600; color: {SOFT}">Not saved</span></sc-if><sc-if value="{{{{liveOn}}}}" hint-placeholder-val="{{{{true}}}}"><span style="display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13px; font-weight: 600; color: {SOFT}"><span style="width: 8px; height: 8px; border-radius: 4px; background: #44684A"></span>Live</span></sc-if></div>'
            f'<sc-for list="{{{{sec59}}}}" as="x" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 8px">{head}{tag}'
            f'<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: {gap}px">{box}{plusb}</div></section></sc-for>'
            + ADDCARD('Add section', 'addSec') + '</div>')

# a pop-up button wears the kit's up-down chevrons (its select, the app's Select; Apple's pop-up button)
POP59 = lambda lbl, act, w, name: f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{name}: {{{{{lbl}}}}}" style="flex: none; min-width: {w}px; height: 44px; padding: 0 12px 0 12px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px">{{{{{lbl}}}}}<span style="display: flex; color: {SOFT}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"></path></svg></span></button>'
ROW59 = lambda label, inner: ('raw', f'<div style="min-height: 56px; box-sizing: border-box; display: flex; align-items: center; gap: 8px; padding: 6px 12px 6px 16px"><span style="flex: 1; font-size: 16px">{label}</span>{inner}</div>')
SUGG59 = f'<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{suggest59}}}}" as="s" hint-placeholder-count="8"><button type="button" onClick="{{{{s.pick}}}}" style="height: 44px; min-width: 0; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 17px; font-weight: 500">{{{{s.r}}}}<sup style="font-size: max(12px, .6em); vertical-align: .55em">{{{{s.x}}}}</sup>{{{{s.b}}}}</button></sc-for></div>'
# an act's width starts at its words and the rest is shared (flex: 1 1 auto): split evenly, Play from here was cut
# at 393 while Duplicate kept room it did not need
QBTN = lambda svg, label, act: f'<button type="button" onClick="{{{{{act}}}}}" style="flex: 1 1 auto; min-width: 0; height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap">{svg}{label}</button>'
CP_CHORD59 = (GROUP(ROW59('Chord', POP59('rootPopL', 'openRootPop', 72, 'Root') + POP59('qualPopL', 'openQualPop', 120, 'Quality')),
                    ROW59('Bass note', POP59('bassPopL', 'openBassPop', 136, 'Bass note')), ('step', 'Duration', 'selLen', 'lenDn', 'lenUp'), bg=SHEET)
              + f'<sc-if value="{{{{rootPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{ROOTGRID("chordRoots")}</sc-if>'
              + f'<sc-if value="{{{{qualPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("qualChips")}</sc-if>'
              + f'<sc-if value="{{{{bassPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("bassChips")}</sc-if>'
              + f'<section aria-label="Suggested chords" style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">Suggested chords</h3>{SUGG59}</section>'
              + f'<div style="display: flex; gap: 8px"><button type="button" onClick="{{{{removeChord}}}}" aria-label="Delete chord" data-tip="Delete chord" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 12px; background: #F4DCD6; color: #B3261E; display: flex; align-items: center; justify-content: center">{TRASHI}</button>'
              + QBTN(DUPI, 'Duplicate', 'duplicate') + QBTN(PLAYS, 'Play from here', 'playFrom') + '</div>')

# the section's sheet: what its head cannot hold (its name, Loop this section, Duplicate section); Repeat, Variation
# and Delete stay on the head alone (one way to each act), the Genos marks on their chip
CP_SEC = (GROUP(ROW59('Section', POP59('secPopL', 'openSecPop', 136, 'Section')), ('toggle', 'Loop this section', 'secLoopSw', 'toggleSecLoop'), bg=SHEET)
          + f'<sc-if value="{{{{secPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("secChips")}</sc-if>'
          + '<div style="display: flex">' + QBTN(DUPI, 'Duplicate section', 'dupSec') + '</div>')

# R59 (owner, 2026-11-14: "improve the genos actions bar and make better … better ui"): the strip as a card that
# shows every control at once, none scrolled out of sight: its state and Start/Stop on its head; Main A–D and Break,
# then Intro I–III and Ending/rit. I–III (a phone's two rows; one row of groups on a laptop), each group named over it.
# Only what the Genos takes over MIDI (the brief: ACMP, Sync, Auto Fill, Fade and OTS Link have no message).
LAMP59 = lambda key, label, act, spoken='', size='min-width: 44px': f'<button type="button" onClick="{{{{{act}}}}}" aria-pressed="{{{{{key}.on}}}}" aria-label="{spoken or label}" style="{size}; height: 44px; padding: 0 6px; border: 0; border-radius: 10px; background: {{{{{key}.bg}}}}; color: {{{{{key}.fg}}}}; box-shadow: {{{{{key}.ring}}}}; font: inherit; font-size: 14px; font-weight: 700; white-space: nowrap">{label}</button>'
# Start/Stop one width in the full and the compact strip (it was 96 in one and 88 in the other)
START59 = LAMP59('arStart', 'Start/Stop', 'togglePlay', size='flex: none; min-width: 88px')
LAMPS59 = lambda lst, spoken: f'<sc-for list="{{{{{lst}}}}}" as="l" hint-placeholder-count="3"><button type="button" onClick="{{{{l.pick}}}}" aria-pressed="{{{{l.on}}}}" aria-label="{spoken} {{{{l.n}}}}" style="min-width: 44px; height: 44px; padding: 0 6px; border: 0; border-radius: 10px; background: {{{{l.bg}}}}; color: {{{{l.fg}}}}; box-shadow: {{{{l.ring}}}}; font: inherit; font-size: 14px; font-weight: 700">{{{{l.n}}}}</button></sc-for>'
# a lamp group's name in sentence case, as every head of the area (no caption in capitals: the section sheet's ruling)
CAP59 = lambda t: f'<span style="font-size: 12px; font-weight: 600; color: {SOFT}">{t}</span>'
GRP59 = lambda label, cols, inner, grow='1': f'<div role="group" aria-label="{label}" style="flex: {grow} 1 0; min-width: 0; display: flex; flex-direction: column; gap: 4px">{CAP59(label)}<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: 4px">{inner}</div></div>'
HEAD59 = (f'<div style="display: flex; align-items: center; gap: 8px; min-height: 40px"><span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>'
          f'<span aria-live="polite" style="flex: 1; min-width: 0; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{arTitle}}}}</span>'
          + START59 + '</div>')
MAINS59 = GRP59('Main', 5, LAMPS59('arMains', 'Main') + LAMP59('arBreak', 'Break', 'tBreak'), '5')
INTRO59 = GRP59('Intro', 3, LAMPS59('arIntros', 'Intro'), '3')
END59 = GRP59('Ending/rit.', 3, LAMPS59('arEndings', 'Ending'), '3')
CP58 = CP58.replace("arTitle: st.playing ?", "arDot: st.playing ? '#44684A' : '#9C9086', arTitle: st.playing ?", 1)
CP58 = CP58.replace("const lamp = (on, next) => ({", "const lamp = (on, next) => ({ on: !!on,", 1)
# the arranger's panel is a state (Follow a MIDI arranger, off by default): at rest the chart is the page (loop round 58,
# owner 2026-11-16: "the page has one focus")
# ── R76: the layout is the learner's (owner, 2026-11-18: "i want more user customizable ui like draggable resizable,
# hidible, minimizable toolbars dragging to the left and putting it there or draggind to the top … genos controls on
# phone … occupies too much space and is not hidable, resizable, minimizable, draggable … the layout should be saved and
# resetable in the app setitngs for teh individual page or for the whole app … it correctly opens the last opened or
# saved scores and teh settinsg should be refactored"). Apple HIG, Toolbars ("let people customize the toolbar");
# iPadOS's Customize Toolbar and Logic Pro's Customize Control Bar; Photoshop's and Dorico's workspaces, kept per window
# and reset from one place; WCAG 2.2, 2.5.7 Dragging movements: every drag has a single-tap way. The page's parts are
# panels: the chart is the page and stays; the Keys, the Controls (Style · Key · Tempo · Repeats · Play), the Genos
# and, on a laptop, the key's Chords each can be placed, sized, minimized and hidden. Edit layout (··· or the gear)
# outlines each panel with its tag: the grip drags it to a place, the tag's menu places, sizes and hides it by tap;
# hidden panels wait in the tray under the bar. Every change is saved at once for this page; the gear's Reset layout
# and Settings › General › Page layouts put it back. The Genos's own head minimizes it at any time, edit or not.
CP58 = CP58.replace("    return { ...common(st, set), sec59,", r"""    const LAY0 = { genos: { mode: 'compact' } };
    const LAY = st.lay || LAY0;
    const setP = (k, o) => set({ lay: { ...LAY, [k]: { ...LAY[k], ...o } }, sheet: st.sheet });
    const gP = LAY.genos;
    const sheetsL = st.sheetName || 'My verse and chorus';
    return { ...common(st, set), sec59,
      gFull: gP.mode === 'full', gCompact: gP.mode === 'compact', gMin: gP.mode === 'min', gMinT: () => setP('genos', { mode: 'min' }), gFullT: () => setP('genos', { mode: 'full' }), gCompactT: () => setP('genos', { mode: 'compact' }),
      arPillL: ar.main ? 'Genos · Main ' + ar.main : 'Genos',
      mk1: sheetsL === 'My verse and chorus', mk2: sheetsL === 'Blues in F', mk3: sheetsL === 'Autumn Leaves sketch',
      sheetsL, sheetsOn: st.sheet === 'sheets', openSheets: (e) => set({ sheet: 'sheets', menuPos: ANCHOR(e, 280), cpExp: false }), cpExpTog: () => set({ cpExp: !st.cpExp }), cpExpOn: st.sheet === 'sheets' && !!st.cpExp, cpExpX: st.cpExp ? 'true' : 'false', cpExpBg: st.cpExp ? 'rgba(51,41,33,.06)' : 'transparent',
      openS1: () => set({ sheet: null, hist: [], sheetName: 'My verse and chorus' }), openS2: () => set({ sheet: null, hist: [], sheetName: 'Blues in F', toastT: 'Opened Blues in F' }), openS3: () => set({ sheet: null, hist: [], sheetName: 'Autumn Leaves sketch', toastT: 'Opened Autumn Leaves sketch' }),
      freshOn: !!st.fresh, handOn: !['My verse and chorus', 'Blues in F', 'Autumn Leaves sketch'].includes(sheetsL), openSaveAs: () => set({ sheet: 'saveAs', saName: sheetsL, toastT: null }), saveAsOn: st.sheet === 'saveAs', saName: st.saName ?? '', typeSa: (e) => set({ saName: e.target.value }),
      saBg: (st.saName || '').trim() ? '#EDC684' : '#EEE9E2', saFg: (st.saName || '').trim() ? '#332921' : '#9C9086', saDis: !(st.saName || '').trim(),
      saveAs: () => { const n = (st.saName || '').trim(); if (!n) return; set({ sheet: null, hist: [], sheetName: n, fresh: false, toastT: 'Saved ' + n }); },
      newSheet: () => set({ sheet: null, hist: [], sheetName: 'New chord sheet', secs: [['A', 'Verse', 1, []]], len: {}, bpm: 100, reps: 0, vars: [1], fresh: true, draft: false, toastT: 'Started a new chord sheet', prevS: { sheetName: st.sheetName, secs: st.secs, len: st.len, bpm: st.bpm, reps: st.reps, vars: st.vars, fresh: st.fresh, draft: st.draft } }),
      liveOn: !st.fresh, undoOff: !(st.hist || []).length, bandUndo: () => { const h = st.hist || []; if (!h.length) return; set({ ...h[h.length - 1], hist: h.slice(0, -1) }); }, playOff: !!st.fresh && !(st.secs || []).some((x) => x[3].length),
      toastOn: !!st.toastT, toastPh: !!st.toastT && (st.toastS ?? null) === (st.sheet ?? null), toastT: st.toastT ?? '', toastUndo: (!!st.prevS && st.toastT === 'Started a new chord sheet') || (!!st.libWas && / deleted$/.test(st.toastT ?? '')), undo: () => set(st.libWas && / deleted$/.test(st.toastT ?? '') ? { libL: st.libWas, libWas: null, toastT: null, ...(st.libWasHand ? { fresh: false, libWasHand: false } : {}) } : st.prevS && st.toastT === 'Started a new chord sheet' ? { ...st.prevS, toastT: null, prevS: null } : { toastT: null }),""", 1)
assert 'const LAY0' in CP58, 'R76 JS patch missed'
CP58 = CP58.replace("states: [{ l: 'Following the Genos', bg: follow ? '#332921' : '#EEE9E2', pick: () => set({ follow: !follow }) }],",
  "states: [{ l: 'Following the Genos', bg: follow ? '#332921' : '#EEE9E2', pick: () => set({ follow: !follow }) }, { l: 'Genos minimized', bg: (st.lay && st.lay.genos.mode === 'min') ? '#332921' : '#EEE9E2', pick: () => set({ follow: true, lay: { ...(st.lay || {}), keys: (st.lay || {}).keys || { at: 'bottom', size: 'M', hid: false }, dock: (st.lay || {}).dock || { at: 'float', mode: 'full', hid: false }, chords: (st.lay || {}).chords || { at: 'right', size: 'Wide', hid: false }, genos: { at: 'right', hid: false, mode: (st.lay && st.lay.genos.mode === 'min') ? 'full' : 'min' } } }) }, { l: 'New sheet (first run)', bg: st.fresh ? '#332921' : '#EEE9E2', pick: () => set(st.fresh ? { fresh: false, secs: null, len: null, bpm: null, reps: null, vars: null, sheetName: null } : { sheet: null, sheetName: 'New chord sheet', secs: [['A', 'Verse', 1, []]], len: {}, bpm: 100, reps: 0, vars: [1], fresh: true, draft: false }) }],", 1)
assert 'Genos minimized' in CP58

# the sheet's name opens the sheets: the last opened first, as it opens on (a chart opens where it was left)
CHEVD20 = CHEV_D
TITLE76 = (f'<button type="button" data-menuroot-anchor onClick="{{{{openSheets}}}}" aria-label="Chord sheet: {{{{sheetsL}}}}. Open another" style="flex: 0 1 auto; min-width: 0; height: 44px; margin: -6px 0; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; gap: 4px">'
           f'<span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 22px; font-weight: 600">{{{{sheetsL}}}}</span><span style="flex: none; color: {SOFT}; display: flex">{CHEVD20}</span></button>')
_t0 = '<span style="font-size: 22px; font-weight: 600">My verse and chorus</span>'
assert _t0 in CHART59(8, 4, 60, 21, 2)
CHART76 = lambda *a: CHART59(*a).replace(_t0, TITLE76, 1)


# the Genos, three sizes: Full (every control), Compact (Start/Stop and Main A–D in a row), Minimized (a pill)
MINI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M5 12h14"></path></svg>'
EXPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m18 15-6-6-6 6"></path></svg>'
COLI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m6 9 6 6 6-6"></path></svg>'
ICB = lambda act, label, svg, margin='-2px -6px -2px 0': f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{label}" data-tip="{label}" style="flex: none; width: 44px; height: 44px; margin: {margin}; padding: 0; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{svg}</button>'
HEAD76 = HEAD59[:-len('</div>')] + ICB('gCompactT', 'Compact', COLI) + ICB('gMinT', 'Minimize', MINI) + '</div>'
CARDST = f'box-sizing: border-box; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}'
def GENOS76(pos, wide):
    full = (f'<sc-if value="{{{{gFull}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Genos style controls" style="position: relative; display: flex; flex-direction: column; gap: 8px; padding: 8px 12px 12px; {CARDST}">'
            + HEAD76 + (f'<div style="display: flex; gap: 16px">{INTRO59}{MAINS59}{END59}</div>' if wide else f'{MAINS59}<div style="display: flex; gap: 12px">{INTRO59}{END59}</div>') + '</div></sc-if>')
    comp = (f'<sc-if value="{{{{gCompact}}}}" hint-placeholder-val="{{{{false}}}}"><div role="toolbar" aria-label="Genos style controls" style="position: relative; height: 64px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 12px; {CARDST}">'
            f'<span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>'
            + START59
            + f'<div role="group" aria-label="Main" style="flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px">{LAMPS59("arMains", "Main")}</div>'
            + ICB('gFullT', 'Full', EXPI) + ICB('gMinT', 'Minimize', MINI) + '</div></sc-if>')
    pill = (f'<sc-if value="{{{{gMin}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{gFullT}}}}" aria-label="{{{{arPillL}}}}: show its controls" style="position: relative; height: 44px; box-sizing: border-box; padding: 0 12px 0 14px; border: 0; border-radius: 22px; {GLASSFX}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; white-space: nowrap">'
            f'<span style="width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span><span>{{{{arPillL}}}}</span>{ICON(EXPI, 18)}</button></sc-if>')
    return f'<div style="{pos}">{full}{comp}{pill}</div>'

def KEYS77(h, lap=False):
    # a phone shows F2 to A4 at the kit's 26 a white key, the 17 whites 40 wider than the screen, centred (the app's
    # fitInView over CHORD_PLAYER_KEYS): a part of F2 and of A4 at the edges; 112 tall on a phone, 170 on a laptop
    keys = CP_KEYS(h).replace('{{kbw}}', '{{kbwL}}').replace('{{kbb}}', '{{kbbL}}') if lap else CP_KEYS(h).replace('style="position: relative; height:', 'style="position: relative; margin-inline: calc(50% - 221px); height:')
    return f'<div style="position: relative; flex: none; {"" if lap else "margin-bottom: 34px; "}box-shadow: 0 -1px 0 {LINE}">{keys}</div>'

# Tempo, the Metronome's face (owner-way, one implementation): the tempo's word and BPM over its figures with −10 −1
# and +1 +10 beside them, then the slider between the sheet's ends, 40 and 240; a wheel hid all but five tempos
TEMPO77 = f'<div style="display: flex; flex-direction: column; gap: 12px; padding: 4px 0">{TEMPO(40, "cpT", 40, 240)}</div>'
SH58 = lambda B, P, D=None: (B('chordOn58', '{{selSym}}', CP_CHORD59) + B('tagOnSheet', '{{tagTitle}}', CP_TAG) + B('secOn', '{{secTitle}}', CP_SEC) + B('shareOn', 'Share', CP_SHARE) + (D or B)('styleOn', 'Style', STYLEROWS) + (D or B)('keyOn', 'Key', ROOTGRID('keyRoots')) + (D or B)('tempoOn', 'Tempo', TEMPO77) + (D or B)('repOn', 'Repeats', WHEEL([('wRep', 1)])) + P + '')
_MI = lambda l, a, col=INK: f'<button type="button" role="menuitem" onClick="{{{{{a}}}}}" style="width: 100%; height: 44px; box-sizing: border-box; border: 0; border-radius: 10px; background: transparent; padding: 0 12px; display: flex; align-items: center; color: {col}; font: inherit; font-size: 16px; text-align: left">{l}</button>'
# a phone's toast steps aside when a sheet rises over it (the app's Sheet closes it), and shows one raised from that sheet
# a phone's toast stands 12 over the foot: the keys (112 over the 34 home indicator) and the Genos row (64 and its
# 8) when shown, as the app's (`--docked`); it stood at 256 whatever stood under it
TOAST76 = TOAST('{{toastB}}', z=56, on='toastPh')

# ── R77 (owner, 2026-11-27: "now begin with the refactoring of the chords player the same way you did with the laptop
# and mobile layout and such things"): the Chord player in the Player's model, the one shape of a full-screen music
# screen (Flat's score page: its dark band, its rail of panels, its keyboard docked at the foot). Laptop: the band
# (✕, the sheet's name and its menu, the transport Go to start · Play ▾ · Metronome · Loop, the sheet's Key, Tempo and
# Style as the band's pills, MIDI; Undo and the keys at its end), a rail of panels at the left (Chords, Styles, Genos,
# Audio, Chart; Search and Shortcuts at its foot), the chart in the middle, the keys docked under it. Phone: Flat's
# phone header (←, the transport capsule, the keys, ☰), ☰ the rail's places and the sheet's file acts as rows. This
# supersedes R76's Edit layout: the floating dock, the gear and the layout's tags, zones and tray go (one place for each
# panel, as the Player's; the Genos keeps its own Full, Compact and Minimized).

# the Genos panel's head as the app says it (ArrangerStrip): who plays and whether it plays, then the connection as the
# MIDI keyboard's popover says it, Try again where no Genos answered
HEAD77 = HEAD59.replace('{{arTitle}}', '{{cpArTitle}}', 1)
ARLINE77 = (f'<div style="display: flex; align-items: center; gap: 12px; min-height: 44px; margin-top: -4px"><p aria-live="polite" style="flex: 1; min-width: 0; margin: 0; font-size: 14px; line-height: 1.35; color: {SOFT}; text-wrap: pretty">{{{{cpArLine}}}}</p>'
            f'<sc-if value="{{{{cpAlone}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{cpRetry}}}}" style="flex: none; height: 36px; padding: 0 14px; border: 0; border-radius: 18px; background: {FILL}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer">Try again</button></sc-if></div>')
START_G = LAMP59('arStart', '<span style="display: flex; justify-content: center"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="{{cpStartD}}"></path></svg></span>', 'togglePlay', 'Start/Stop', size='flex: none; width: 44px; min-width: 44px')
def GENOS77(pos, wide):
    g = GENOS76(pos, wide).replace('{{arTitle}}', '{{cpArTitle}}')
    if not wide:
        _c0 = g.index('{{gCompact}}'); _s0 = g.index(START59, _c0)
        g = g[:_s0] + START_G + g[_s0 + len(START59):]
    # the connection line under the full panel's head
    j = g.index(HEAD76.replace('{{arTitle}}', '{{cpArTitle}}')) + len(HEAD76.replace('{{arTitle}}', '{{cpArTitle}}'))
    g = g[:j] + ARLINE77 + g[j:]
    return g

# the band's pills after the transport: what the sheet plays in (Key, from the transport's own pill), at (Tempo) and
# how (Style), each opening its popover under it; MIDI last, as the Player's band
BPILL = lambda lab, val, act, x: (f'<button type="button" aria-label="{lab}: {val}" data-tip="{lab}" aria-haspopup="dialog" aria-expanded="{{{{{x}}}}}" onClick="{{{{{act}}}}}" style="flex: none; height: 40px; padding: 0 12px 0 16px; border: 0; border-radius: 20px; background: {ONB}; color: {BAND}; font: inherit; font-size: 14px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 4px; cursor: pointer">'
                                  f'{val}<span aria-hidden="true" style="display: flex">{CHEV_D}</span></button>')
_tr = HDRTRANSPORT(play_off='playOff')
_mi = _tr.index('<button type="button" aria-label="MIDI keyboard"')
TRANSPORT77 = (_tr[:_mi].replace('aria-label="Transpose: {{hdKeyL}}" data-tip="Transpose · T"', 'aria-label="Key: {{hdKeyL}}" data-tip="Key · T"', 1)
               + BPILL('Tempo', '{{bpmL}} BPM', 'openTempo', 'tempoX') + BPILL('Style', '{{styleL}}', 'openStyle', 'styleX') + _tr[_mi:])
assert 'Key: {{hdKeyL}}' in TRANSPORT77
NAME77 = (f'<button type="button" aria-haspopup="menu" aria-expanded="{{{{sheetsX}}}}" onClick="{{{{openSheets}}}}" data-tip="Chord sheets" style="flex: 0 1 auto; min-width: 120px; height: 48px; max-width: 320px; padding: 0 8px 0 12px; border: 0; border-radius: 12px; background: {{{{sheetsBg}}}}; color: {ONB}; font: inherit; text-align: left; display: flex; align-items: center; gap: 8px; cursor: pointer">'
          f'<span style="min-width: 0; display: flex; flex-direction: column"><h1 style="margin: 0; font-size: 17px; font-weight: 600; line-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{sheetsL}}}}</h1>'
          f'<span style="font-size: 13px; line-height: 16px; color: {ONB_SOFT}; white-space: nowrap">{{{{cpSubL}}}}</span></span><span aria-hidden="true" style="flex: none; display: flex; color: {ONB_SOFT}">{CHEV_D}</span></button>')
_bb = lambda lab, tip, svg, act, extra='': f'<button type="button" aria-label="{lab}" data-tip="{tip}" onClick="{{{{{act}}}}}"{extra} style="{_HB}; background: transparent; color: {ONB}">{svg}</button>'
BAND77 = (f'<header data-band style="flex: none; position: relative; z-index: 20; container: band / inline-size; height: 64px; box-sizing: border-box; padding: 0 16px 0 12px; display: flex; align-items: center; gap: 12px; background: {BAND}; color: {ONB}">'
          f'<a href="Main.dc.html" aria-label="Close" data-tip="Close · Esc" style="flex: none; width: 40px; height: 40px; border-radius: 20px; color: {ONB}; display: flex; align-items: center; justify-content: center">'
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg></a>'
          + NAME77 + TRANSPORT77 + '<span style="flex: 1"></span>'
          + _bb('Undo', 'Undo · ⌘Z', UNDO, 'bandUndo', ' class="ibd" disabled="{{undoOff}}"') + HDRKEYSBTN + '</header>')

# the rail, as the Player's and the editor's (76, each place a glyph over its word; Search and Shortcuts at its foot)
CHORDSI = _LI('<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>')
# the Genos wears Lucide's keyboard-music (an arranger's panel over its keys); the plain keyboard is Shortcuts'
GENOSI = _LI('<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 8h4M14 8h.01M18 8h.01M2 12h20M6 12v4M10 12v4M14 12v4M18 12v4"></path>')
RAIL77 = (f'<nav aria-label="Panels" style="flex: none; width: 76px; padding: 12px 0; box-shadow: inset -1px 0 0 {LINE}; display: flex; flex-direction: column; gap: 4px">'
          f'<div role="tablist" aria-orientation="vertical" aria-label="Panels" style="display: flex; flex-direction: column; gap: 4px">'
          + _RAILBTN('Chords', CHORDSI, 'Ch', 'Chords') + _RAILBTN('Styles', f'<svg viewBox="0 0 24 24" width="22" height="22" {I}>{DRUMP}</svg>', 'St', 'Styles') + _RAILBTN('Genos', GENOSI, 'Ge', 'Genos')
          + _RAILBTN('Audio', AUDIOI, 'So', 'Audio') + _RAILBTN('Chart', f'<svg viewBox="0 0 24 24" width="22" height="22" {I}>{CHARTP}</svg>', 'Ca', 'Chart') + '</div>'
          + '<span style="flex: 1"></span>' + _RAILBTN('Search', SEARCHI, 'Srch', 'Search · ⌘K', 'cpSearch') + _RAILBTN('Shortcuts', KBDI, 'Keys', 'Shortcuts · ?', 'cpKeysHelp') + '</nav>')
_DRAGB = DRAG[DRAG.index('<div style="display: grid'):]
# the styles as the app's catalogue, by family (scan-first 2: thirty-six rows in one card were a wall): each family a
# sentence-case head over its white card of rows, the chosen checked at 600; a style's feel quiet at the row's end only
# where it departs from straight 4/4 (swing, 3/4: scan-first 5, emphasis is the difference)
# a chosen row's mark is Lucide's check at 20, as the app's menus and the Styles list draw it (one icon set; a text ✓ was not)
_CK20 = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M20 6 9 17l-5-5"></path></svg>'
STYLEROWS = (f'<div role="radiogroup" aria-label="Style" style="display: flex; flex-direction: column; gap: 24px"><sc-for list="{{{{cpFams}}}}" as="f" hint-placeholder-count="3">'
             f'<section aria-label="{{{{f.n}}}}" style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">{{{{f.n}}}}</h3>'
             f'<div style="display: flex; flex-direction: column; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">'
             f'<sc-for list="{{{{f.styles}}}}" as="y" hint-placeholder-count="3"><button type="button" role="radio" aria-checked="{{{{y.on}}}}" onClick="{{{{y.pick}}}}" style="min-height: 48px; box-sizing: border-box; padding: 0 12px; border: 0; border-top: 1px solid {{{{y.line}}}}; background: transparent; color: {INK}; font: inherit; font-size: 15px; text-align: left; display: flex; align-items: center; gap: 12px; cursor: pointer">'
             f'<span aria-hidden="true" style="flex: none; width: 20px; display: flex"><sc-if value="{{{{y.sel}}}}" hint-placeholder-val="{{{{false}}}}">{_CK20}</sc-if></span><span style="flex: 1; font-weight: {{{{y.fw}}}}">{{{{y.n}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{y.feel}}}}</span></button></sc-for></div></section></sc-for></div>')
# the page or panel is titled Audio or Chart, so its first group stands bare under that title (no caption repeating it)
_SECT77 = lambda t, body: f'<section aria-label="{t}" style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 15px; font-weight: 600">{t}</h3>{body}</section>'
# the Player's Audio page shape on both sizes (AUDPANEL): the kit's white card, then a section's head over its segmented
# control, 24 apart (it was the grey group with an uppercase PLAYING caption, a second shape for one kind of page)
_COL77 = lambda *xs: '<div style="display: flex; flex-direction: column; gap: 24px">' + ''.join(xs) + '</div>'
# Volume in place (the loop, 2026-11-28): its own page stacked a second Back under the panel's head and said Volume
# twice, and the row opened nothing on the board; the levels stand under one Volume head, Master first, each its name
# and % over the slider (the app's Level: a 4 track, a 28 thumb), 16 apart
_LEV77 = lambda lab, v: (f'<div style="display: flex; flex-direction: column; gap: 8px"><div style="display: flex; justify-content: space-between; gap: 12px; font-size: 15px"><span>{lab}</span><span style="color: {SOFT}; font-variant-numeric: tabular-nums">{v}%</span></div>'
                         f'<input type="range" data-level min="0" max="100" step="5" value="{v}" aria-label="{lab}" style="--p: {v}%; width: 100%; height: 28px; margin: 0"></div>')
VOL77 = '<div style="display: flex; flex-direction: column; gap: 16px">' + _LEV77('Master', 80) + _LEV77('Piano', 80) + _LEV77('Bass', 70) + _LEV77('Drums', 70) + '</div>'
SOUND77 = _COL77(GROUP(('toggle', 'Piano', 'cpPiOn', 'cpPiT'), ('toggle', 'Bass', 'cpBaOn', 'cpBaT'), ('toggle', 'Drums', 'cpDrOn', 'cpDrT'), bg=SHEET),
                 _SECT77('Volume', VOL77), _SECT77('Voicing', SEGC('cpVSeg', 36, 14, True)))
# the chart's two settings, one shape: a sentence-case head over its segmented control (the Time signature row opened
# nothing; the app's five meters are one tap each, as Written as)
CHART77 = _COL77(_SECT77('Time signature', SEGC('cpMeterSeg', 36, 14, True)), _SECT77('Written as', SEGC('namesSeg', 36, 14, True)))
FOLLOW77 = GROUP(('toggle', 'Follow a MIDI arranger', 'followSw', 'toggleFollow'), bg=SHEET)
# MIDI complete where it opens, as the Player's MIDI keyboard popover (R74: the keyboard in use and, with none, how to
# connect one; nothing links away to Settings), then the Chord player's own Follow a MIDI arranger
MIDI77 = GROUP(('val', 'Keyboard', 'Not connected'), ('raw', f'<span style="display: block; padding: 0 16px; margin: 2px 0 10px; font-size: 15px; line-height: 1.4; color: {SOFT}">Plug in a keyboard by USB or pair it by Bluetooth, then press a key.</span>'),
               ('toggle', 'Follow a MIDI arranger', 'followSw', 'toggleFollow'), bg=SHEET)
# a panel's head is the kit's (the Player's and the editor's: 64, the title, « Fold the panel 44 round); only its act is
# the Chord player's
_PHEAD77 = lambda title: _PHEAD(title).replace('{{foldPanel}}', '{{cpRailNone}}')
_PBODY77 = lambda inner: f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 16px">{inner}</div>'
_PANEL = lambda k, title, inner: f'<sc-if value="{{{{rail{k}On}}}}" hint-placeholder-val="{{{{{"true" if k == "Ch" else "false"}}}}}"><section aria-label="{title}" style="flex: none; width: 352px; min-height: 0; display: flex; flex-direction: column; box-shadow: inset -1px 0 0 {LINE}">{_PHEAD77(title)}{_PBODY77(inner)}</section></sc-if>'
GENOSPANEL = (f'<sc-if value="{{{{arOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}">'
              + HEAD77 + ARLINE77 + f'{MAINS59}<div style="display: flex; gap: 12px">{INTRO59}{END59}</div></div></sc-if>' + FOLLOW77)
PANELS77 = (_PANEL('Ch', '{{keyHead}}', _DRAGB)
            + _PANEL('St', 'Styles', STYLEROWS) + _PANEL('Ge', 'Genos', GENOSPANEL) + _PANEL('So', 'Audio', SOUND77) + _PANEL('Ca', 'Chart', CHART77))

# the chart, its name in the band on a laptop (the chart starts on its first section); the phone keeps it over the chart
_c = CHART59(16, 8, 76, 28, 1)
_a = _c.index('<div style="display: flex; align-items: baseline; gap: 8px">'); _b = _c.index('<sc-for list="{{sec59}}"')
CHARTL77 = _c[:_a] + _c[_b:]
# the Genos docked over the keys while another panel is open: Start/Stop and Main A–D in its compact row, Full opens its panel
GDOCK77 = (f'<sc-if value="{{{{cpGDock}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: flex; justify-content: center; padding: 0 0 12px">'
           f'<div role="toolbar" aria-label="Genos style controls" style="width: 560px; height: 64px; box-sizing: border-box; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 12px; {CARDST}">'
           f'<span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>' + START59
           + f'<div role="group" aria-label="Main" style="flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px">{LAMPS59("arMains", "Main")}</div>'
           + ICB('pickGe', 'The Genos panel', EXPI, margin='0') + '</div></div></sc-if>')
lm77 = (f'<div data-menuroot style="position: absolute; inset: 0; display: flex; flex-direction: column">' + BAND77
        + '<div style="flex: 1; min-height: 0; display: flex">' + RAIL77 + PANELS77
        + '<div style="flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column">'
        # the chart's first section level with the panel's title: 22, the kit's head centring its 20 title in 64
        + '<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 22px 40px 24px">' + SHOWSTATES() + CHARTL77 + '</div>'
        + GDOCK77 + f'<sc-if value="{{{{cpKeysOn}}}}" hint-placeholder-val="{{{{true}}}}">{KEYS77(170, True)}</sc-if>'
        + '</div></div></div>')

# the phone: Flat's phone header (←, the transport, the keys, ☰), the chart under it with its name, the Genos over the keys
PHHDR77 = (f'<header data-band style="flex: none; position: relative; z-index: 20; box-sizing: border-box; padding: 0 8px; background: linear-gradient({LINE}, {LINE}) 8px 100% / calc(100% - 16px) 1px no-repeat, {SHEET}; color: {INK}">'
           f'<div style="height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 4px"><a href="Main.dc.html" aria-label="Back" data-tip="Back" style="{_PB}; text-decoration: none">{ARROWLI}</a>'
           + PHTRANSPORT('playOff') + PHKEYSBTN.replace('{{hdKeysPh}}', '{{cpKeysPh}}')
           + f'<button type="button" aria-label="Menu" data-tip="Menu" aria-haspopup="dialog" aria-expanded="{{{{phMenuX}}}}" onClick="{{{{phMenu}}}}" style="{_PB}; color: {{{{phMenuFg}}}}">{MENUI}</button></div></header>')
ph77 = (PHHDR77
        + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 16px">{SHOWSTATES()}{CHART76(8, 8, 60, 21, 2)}</main>'
        + f'<sc-if value="{{{{arOn}}}}" hint-placeholder-val="{{{{true}}}}">{GENOS77("position: relative; flex: none; margin: 8px 16px", False)}</sc-if>'
        + f'<sc-if value="{{{{cpKeysOn}}}}" hint-placeholder-val="{{{{true}}}}">{KEYS77(112)}</sc-if>')
# Lucide's shuffle: Randomize chords (the app's file acts)
SHUFFLEP = '<path d="m18 14 4 4-4 4"></path><path d="m18 2 4 4-4 4"></path><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"></path><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"></path>'
_sep = f'<div role="separator" style="flex: none; height: 1px; margin: 4px 12px; background: {LINE}"></div>'
PHNAV77 = (f'<sc-if value="{{{{phMenuOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60"></div>'
           f'<nav aria-label="{{{{sheetsL}}}}" class="nos" style="position: absolute; z-index: 61; top: 120px; right: 8px; left: 24px; max-height: calc(100% - 170px); overflow-y: auto; box-sizing: border-box; padding: 12px 8px; border-radius: 22px; background: {PAGE}; box-shadow: 0 0 0 1px rgba(51,41,33,.06), 0 18px 48px -12px rgba(51,41,33,.38); display: flex; flex-direction: column; gap: 8px">'
           f'<p style="margin: 0; padding: 4px 12px 0; text-align: center; font-size: 17px; font-weight: 600; line-height: 22px; color: {INK}">{{{{sheetsL}}}}</p>'
           + FROWS([(_FI('<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>'), 'Chords', '', 'cpPhChords'), (_FI(DRUMP), 'Style', '{{styleL}}', 'cpPhStyle'), ('Tr', 'Key', '{{keyL}} major', 'cpPhKey'), ('Speed', 'Tempo', '{{bpmL}} BPM', 'cpPhTempo'),
                    (_FI('<path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path>'), 'Repeats', '{{optRepL}}', 'cpPhRep'), ('Aud', 'Audio', '', 'cpPhSound'), (_FI(CHARTP), 'Chart', '{{namesL}}', 'cpPhChart'), ('Midi', 'MIDI', '{{cpMidiL}}', 'cpPhMidi')], lines=False, h=48)
           + _sep + FROWS([('Share', 'Share…', '', 'openShare', INK, False), ('Exp', 'Export', '', 'cpPhExp'), (FICONS['Imp'], 'Import chart…', '', 'importChart', INK, False), (_FI(SHUFFLEP), 'Randomize chords', '', 'randomize', INK, False)], lines=False, h=48)
           + _sep + FROWS([(_FI(LISTPLUSP), 'Save to my progressions', '', 'saveProg', INK, False), (_FI(LISTMUSP), 'Open in Progressions', '', 'Progressions.dc.html')], lines=False, h=48) + '</nav></sc-if>')
# Export, the Player's shape: one row, its formats on a page with ← on a phone and a submenu on a laptop
EXPROWS77 = GROUP(('action', 'MIDI', 'exportMidi', INK), ('action', 'Chart (.txt)', 'exportChart', INK), bg=SHEET)
PHPAGES77 = (FSHEET('cpPhExpOn', 'Export', EXPROWS77, back='phToMenu') + FSHEET('cpPhSoundOn', 'Audio', SOUND77, back='phToMenu') + FSHEET('cpPhChartOn', 'Chart', CHART77, back='phToMenu') + FSHEET('cpPhMidiOn', 'MIDI', MIDI77, back='phToMenu')
             + FSHEET('cpPhStyleOn', 'Style', STYLEROWS, back='phToMenu') + FSHEET('cpPhKeyOn', 'Key', ROOTGRID('keyRoots'), back='phToMenu') + FSHEET('cpPhTempoOn', 'Tempo', TEMPO77, back='phToMenu') + FSHEET('cpPhChordsOn', '{{keyHead}}', _DRAGB, back='phToMenu'))
# the band's popovers on a laptop: Playback options (Repeats, Count-in) under ▾, MIDI under its cable; Key, Tempo and Style
# open their wheels under their pills
# one card of rows: Repeats with its stepper at the row's end, Count-in under its name; on a phone the metronome's
# switch too (Flat's Playback options: the laptop has the metronome in the band)
_OPTS = GROUP(('step', 'Repeats', 'optRepL', 'optRepDn', 'optRepUp', None, True), ('seg', 'Count-in', 'cntSeg'), bg=SHEET)
_OPTSP = GROUP(('step', 'Repeats', 'optRepL', 'optRepDn', 'optRepUp', None, True), ('seg', 'Count-in', 'cntSeg'), ('toggle', 'Metronome', 'metSw', 'metTog'), bg=SHEET)
POPS77L = (POPOVER('hdOptsOn', 'Playback options', _OPTS, 'left: 373px; top: 72px', 320) + POPOVER('hdMidiOn', 'MIDI', MIDI77, 'left: 807px; top: 72px', 360))
# a new sheet (Not saved) is the sheet in hand: first in the list, checked, and saved from the menu's foot, as the app's
_handrow = '<sc-if value="{{handOn}}" hint-placeholder-val="{{false}}">' + _MI('{{sheetsL}}<span aria-hidden="true" style="margin-left: auto; display: flex">' + _CK20 + '</span>', 'closeSheet') + '</sc-if>'
NAMEMENU77 = ROWMENU('sheetsOn', 'Chord sheets', [('html', _handrow), ('action', 'My verse and chorus<sc-if value="{{mk1}}" hint-placeholder-val="{{false}}"><span aria-hidden="true" style="margin-left: auto; display: flex">' + _CK20 + '</span></sc-if>', 'openS1'), ('action', 'Blues in F<sc-if value="{{mk2}}" hint-placeholder-val="{{false}}"><span aria-hidden="true" style="margin-left: auto; display: flex">' + _CK20 + '</span></sc-if>', 'openS2'), ('action', 'Autumn Leaves sketch<sc-if value="{{mk3}}" hint-placeholder-val="{{false}}"><span aria-hidden="true" style="margin-left: auto; display: flex">' + _CK20 + '</span></sc-if>', 'openS3'), ('sep', ''), ('action', 'New sheet', 'newSheet'), ('action', 'All chord sheets', 'openLib')], 'menuPos', 280)
_fileacts = (MENUSEP + _MI('Share…', 'openShare')
             + '<div style="position: relative"><button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="{{cpExpX}}" onClick="{{cpExpTog}}" style="width: 100%; height: 44px; box-sizing: border-box; border: 0; border-radius: 10px; background: {{cpExpBg}}; padding: 0 8px 0 12px; display: flex; align-items: center; color: ' + INK + '; font: inherit; font-size: 16px; text-align: left"><span style="flex: 1">Export</span><span aria-hidden="true" style="display: flex; color: ' + SOFT + '">' + CHEV_R + '</span></button>'
             + '<sc-if value="{{cpExpOn}}" hint-placeholder-val="{{false}}"><div role="menu" aria-label="Export" style="position: absolute; z-index: 71; left: calc(100% + 14px); top: -6px; width: 200px; box-sizing: border-box; padding: 6px; border-radius: 16px; ' + GLASSFX + '">' + _MI('MIDI', 'exportMidi') + _MI('Chart (.txt)', 'exportChart') + '</div></sc-if></div>'
             + _MI('Import chart…', 'importChart') + _MI('Randomize chords', 'randomize') + _MI('Save to my progressions', 'saveProg')
             + '<a role="menuitem" href="ProgressionsLaptop.dc.html" style="width: 100%; height: 44px; box-sizing: border-box; border-radius: 10px; padding: 0 12px; display: flex; align-items: center; color: ' + INK + '; font-size: 16px; text-decoration: none">Open in Progressions</a>')
_draftacts = f'<sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}">{MENUSEP}' + _MI('Save', 'saveDraft') + _MI('Discard draft', 'discardDraft', RED) + '</sc-if>'
_saveasact = f'<sc-if value="{{{{freshOn}}}}" hint-placeholder-val="{{{{false}}}}">{MENUSEP}' + _MI('Save as my chord sheet…', 'openSaveAs') + '</sc-if>'
NAMEMENU77L = NAMEMENU77.replace('</div></sc-if>', _saveasact + _fileacts + _draftacts + '</div></sc-if>', 1).replace('Progressions.dc.html', 'ProgressionsLaptop.dc.html')
NAMEMENU77P = NAMEMENU77.replace('</div></sc-if>', _saveasact + _draftacts + '</div></sc-if>', 1)
LIBROW = ROWMENU('libRowOn', '{{libRowT}}', [('action', 'Rename', 'libRename'), ('action', 'Duplicate', 'libDup'), ('action', 'Delete', 'libDel', RED)], 'libPos', 200).replace('{{closeSheet}}', '{{libRowOff}}', 1)
RENAME77 = NEWNAME('renameOn', 'Rename chord sheet', 'Name', 'rnName', 'typeRn', 'doRename', 'rnBg', 'rnFg', 'Rename')
SAVEAS77 = NEWNAME('saveAsOn', 'Save as my chord sheet', 'Name', 'saName', 'typeSa', 'saveAs', 'saBg', 'saFg', 'Save')

# the state the new boards read, spread first into the board's state (no key of the old board is overridden)
CP77 = CP58.replace("states: [{ l: 'Following the Genos'", "states: [{ l: 'No Genos found', bg: st.alone ? '#332921' : '#EEE9E2', pick: () => set({ follow: true, alone: !st.alone }) }, { l: 'Following the Genos'", 1)
# Playing: the band lit, the chord sounding, the Genos's head saying it plays
CP77 = CP77.replace("states: [{ l: 'No Genos found'", "states: [{ l: 'Playing', bg: st.playing ? '#332921' : '#EEE9E2', pick: () => set({ playing: !st.playing }) }, { l: 'Signed out', bg: st.guest ? '#332921' : '#EEE9E2', pick: () => set({ guest: !st.guest, sheet: st.guest ? null : 'share' }) }, { l: 'No Genos found'", 1)
_j77 = r"""    const RAIL77 = st.rail77 ?? 'Ch', rp = (k) => ({ ['rail' + k + 'On']: RAIL77 === k, ['rail' + k + 'Bg']: RAIL77 === k ? '#EEE2CF' : 'transparent', ['rail' + k + 'W']: RAIL77 === k ? 600 : 500, ['pick' + k]: () => set({ rail77: RAIL77 === k ? 'none' : k, ...(k === 'Ge' ? { follow: true } : {}) }) });
    const dev = st.alone ? STY[s] : 'Genos', MAINL = (st.ar || {}).main;
    const cpKeys = st.cpKeys ?? true;
    const CP77K = { ...['Ch', 'St', 'Ge', 'So', 'Ca'].reduce((o, k) => ({ ...o, ...rp(k) }), {}), cpRailNone: () => set({ rail77: 'none' }), railSrchW: 500, railKeysW: 500, railSrchBg: 'transparent', railKeysBg: 'transparent', cpMeterSeg: seg(['2/4', '3/4', '4/4', '6/8', '12/8'], st.meter ?? '4/4', (l) => set({ meter: l, toastT: 'Laid out in ' + l })), cpSearch: () => set({ sheet: 'search' }), searchOn: st.sheet === 'search', cpKeysHelp: () => set({ sheet: 'keys' }), keysOn2: st.sheet === 'keys',
      cpFams: (() => { const CAT = [["Pop", [["Pop 1", ""], ["Pop 2", ""], ["Pop 3", ""], ["Pop 4", ""], ["Pop 5", ""]]], ["Rock", [["Rock 1", ""], ["Rock 2", ""]]], ["Ballad", [["Ballad 1", ""], ["Ballad 2", ""], ["Ballad 3", ""], ["Ballad 4", ""]]], ["Worship and gospel", [["Worship ballad 1", ""], ["Worship ballad 2", ""], ["Gospel 1", ""], ["Gospel 2", "swing"]]], ["Hymn", [["Hymn 1", ""], ["Hymn 2", ""]]], ["Hip hop", [["Hip hop 1", ""], ["Hip hop 2", "swing"]]], ["Disco", [["Disco 1", ""], ["Disco 2", ""]]], ["Funk", [["Funk 1", ""], ["Funk 2", ""]]], ["Reggae", [["Reggae 1", ""], ["Reggae 2", "swing"]]], ["Latin", [["Bossa nova", ""], ["Samba", ""]]], ["Jazz", [["Swing 1", "swing"], ["Swing 2", "swing"], ["Jazz ballad", "swing"], ["Jazz waltz", "3/4 swing"]]], ["Blues", [["Shuffle", "swing"], ["Slow blues", "swing"]]], ["Classical", [["Alberti", ""], ["Arpeggio", ""], ["Waltz", "3/4"]]]]; let at = 0; return CAT.map(([n, ss]) => ({ n, styles: ss.map(([y, feel], j) => { const i = at++; return { n: y, feel, on: i === s ? 'true' : 'false', fw: i === s ? 600 : 400, line: j ? '#E5DED6' : 'transparent', sel: i === s, pick: () => set({ style: i, toastT: 'Style: ' + y, ...(st.sheet === 'style' ? { sheet: null } : {}) }) }; }) })); })(),
      cpStartD: st.playing ? 'M7 5h10v14H7z' : 'M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z', cpArTitle: st.playing ? dev + (MAINL ? ' · playing Main ' + MAINL : ' · playing') : dev + ' · stopped', cpAlone: !!st.alone, cpArLine: st.alone ? 'No Genos found. The app’s band plays the style’s sections.' : 'Connected: Genos', cpRetry: () => set({ alone: false, toastT: 'Connected: Genos' }),
      cpMidiL: (st.follow ?? false) ? (st.alone ? 'No Genos found' : 'Genos') : 'Not connected', cpGDock: !!(st.follow ?? false) && RAIL77 !== 'Ge',
      cpSubL: st.draft ? 'Draft' : st.fresh ? 'Not saved' : 'Live', sheetsX: st.sheet === 'sheets' ? 'true' : 'false', sheetsBg: st.sheet === 'sheets' ? 'rgba(254,253,251,.14)' : 'transparent',
      tempoX: st.sheet === 'tempo' ? 'true' : 'false', styleX: st.sheet === 'style' ? 'true' : 'false', namesL: st.names ?? 'Chords', chordPos: st.chordPos ?? 'left: 640px; top: 160px',
      hdStart: () => set({ playing: false, at: [0, 0], toastT: 'From the top' }), hdPlay: () => set(st.playing ? { playing: false } : { playing: true }), hdPlayTip: st.playing ? 'Stop' : 'Play', hdPlayD: st.playing ? 'M7 5h10v14H7z' : 'M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z',
      hdOpts: () => set({ sheet: st.sheet === 'opts' ? null : 'opts' }), hdOptsOn: st.sheet === 'opts', hdOptsX: st.sheet === 'opts' ? 'true' : 'false', hdOptsBg: st.sheet === 'opts' ? 'rgba(254,253,251,.14)' : 'transparent',
      optRepL: (st.reps ?? 0) === 0 ? 'Until Stop' : (st.reps === 1 ? '1 time' : st.reps + ' times'), optRepDn: () => set({ reps: Math.max(0, (st.reps ?? 0) - 1) }), optRepUp: () => set({ reps: Math.min(8, (st.reps ?? 0) + 1) }), optRepDnDis: (st.reps ?? 0) === 0, toastB: 46 + ((st.cpKeys ?? true) ? 112 : 0) + ((st.follow ?? false) ? 72 : 0), toastX: (st.rail77 ?? 'Ch') === 'none' ? 'calc(50% + 38px)' : 'calc(50% + 214px)', optRepUpDis: (st.reps ?? 0) === 8,
      cntSeg: seg(['Off', '1 bar', '2 bars'], st.met77 === 'off' ? 'Off' : (st.cnt77 ?? '1 bar'), (l) => set({ cnt77: l, met77: l === 'Off' ? (st.met77 === 'on' ? 'on' : 'off') : (st.met77 === 'off' ? 'count' : st.met77) })),
      metSw: st.met77 === 'on' ? 'true' : 'false', metSwBg: st.met77 === 'on' ? '#44684A' : '#DAD1C8', metSwX: st.met77 === 'on' ? 22 : 2, metTog: () => set({ met77: st.met77 === 'on' ? 'count' : 'on' }),
      hdMet: () => { const n = { count: 'on', on: 'off', off: 'count' }[st.met77 ?? 'count']; set({ met77: n, toastT: { count: 'Metronome: count-in', on: 'Metronome: on', off: 'Metronome: off' }[n] }); }, hdMetTip: { count: 'Metronome: count-in', on: 'Metronome: on', off: 'Metronome: off' }[st.met77 ?? 'count'], hdMetOff: (st.met77 ?? 'count') === 'off',
      hdLoop: () => set({ loop77: !st.loop77, toastT: st.loop77 ? 'Loop off' : 'Looping the Verse' }), hdLoopOn: st.loop77 ? 'true' : 'false', hdLoopPh: st.loop77 ? '#A8551F' : '#332921', hdLoopTip: st.loop77 ? 'Stop looping the Verse' : 'Loop the Verse',
      // Key, the twelve in sight as the app's (the kit's ROOTGRID, a key one of the pickers): a key taken moves the chart
      keyRoots: rootGrid(k, (i) => set({ key: i, sheet: null, secs: SECS.map(([m, n, r, bars]) => [m, n, r, bars.map((cs) => cs.map((c) => trp(c, i - k)))]) })),
      randomize: () => set({ sheet: null, toastT: 'New chords in ' + KEYS[k] + ' major' }),
      hdTr: () => set({ sheet: st.sheet === 'key' ? null : 'key' }), hdTrX: st.sheet === 'key' ? 'true' : 'false', hdKeyL: KEYS[k] + ' major',
      hdMidi: () => set({ sheet: st.sheet === 'midi' ? null : 'midi' }), hdMidiOn: st.sheet === 'midi', hdMidiX: st.sheet === 'midi' ? 'true' : 'false', hdMidiBg: st.sheet === 'midi' ? 'rgba(254,253,251,.14)' : 'transparent',
      hdKeys: () => set({ cpKeys: !cpKeys }), hdKeysOn: cpKeys ? 'true' : 'false', hdKeysBg: cpKeys ? 'rgba(254,253,251,.14)' : 'transparent', cpKeysPh: cpKeys ? '#A8551F' : '#332921', cpKeysOn: cpKeys,
      phMenu: () => set({ sheet: st.sheet === 'menu77' ? null : 'menu77' }), phMenuOn: st.sheet === 'menu77', phMenuX: st.sheet === 'menu77' ? 'true' : 'false', phMenuFg: st.sheet === 'menu77' ? '#A8551F' : '#332921', phToMenu: () => set({ sheet: 'menu77' }), phClose: () => set({ sheet: null }),
      cpPhExp: () => set({ sheet: 'phExp' }), cpPhExpOn: st.sheet === 'phExp', cpPhSound: () => set({ sheet: 'phSound' }), cpPhSoundOn: st.sheet === 'phSound', cpPhChart: () => set({ sheet: 'phChart' }), cpPhStyle: () => set({ sheet: 'phStyle' }), cpPhKey: () => set({ sheet: 'phKey' }), cpPhKeyOn: st.sheet === 'phKey', cpPhTempo: () => set({ sheet: 'phTempo' }), cpPhTempoOn: st.sheet === 'phTempo', cpPhRep: () => set({ sheet: 'phRep' }), cpPhRepOn: st.sheet === 'phRep', ...(() => { const b = st.bpm ?? 96, to = (n) => set({ bpm: Math.max(40, Math.min(240, n)) }), MK = [[60, 'Largo'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [168, 'Allegro'], [999, 'Presto']]; return { cpTbpm: b, cpTmark: MK.find(([m]) => b < m)[1], cpTpos: ((b - 40) / 2) + '%', cpTd10: () => to(b - 10), cpTd1: () => to(b - 1), cpTu1: () => to(b + 1), cpTu10: () => to(b + 10) }; })(),  cpPhStyleOn: st.sheet === 'phStyle', cpPhChartOn: st.sheet === 'phChart', cpPhMidi: () => set({ sheet: 'phMidi' }), cpPhMidiOn: st.sheet === 'phMidi', cpPhChords: () => set({ sheet: 'phChords' }), cpPhChordsOn: st.sheet === 'phChords' };
"""
_r = "    return { ...common(st, set),"
assert CP77.count(_r) == 1, CP77.count(_r)
CP77 = CP77.replace(_r, _j77 + "    return { ...common(st, set), ...CP77K,", 1)
# the dock's place and the old bar's keys stay in the state, unread; the menus open at their buttons
_SHL = (lambda h: h.replace('href="SignIn.dc.html"', 'href="SignInLaptop.dc.html"'))(SH58(lambda c, t, b: POPOVER(c, t, b, '{{chordPos}}' if c == 'chordOn58' else '{{secPos}}' if c == 'secOn' else '{{tagPos}}' if c == 'tagOnSheet' else 'left: 64px; top: 60px', 380 if c == 'secOn' else 460), '', lambda c, t, b: POPOVER(c, t, b, {'styleOn': 'left: 717px; top: 72px', 'keyOn': 'left: 501px; top: 72px', 'tempoOn': 'left: 608px; top: 72px', 'repOn': 'left: 373px; top: 72px'}[c], 320)))
phone('ChordPlayer', 'Chord player, phone', ph77 + TOAST76, CP77, SH58(BSHEET, '') + PHNAV77 + PHPAGES77 + NAMEMENU77P + FSHEET('libOn', 'Chord sheets', CP_LIB, close='closeSheet') + LIBROW + RENAME77.replace('z-index: 60', 'z-index: 72').replace('z-index: 61', 'z-index: 73') + SAVEAS77 + FSHEET('hdOptsOn', 'Playback options', _OPTSP, close='closeSheet') + FSHEET('cpPhRepOn', 'Playback options', _OPTSP, back='phToMenu'), bar=SHEET)
# Shortcuts, the Player's and the editor's card (KEYSCARD_F) with the Chord player's own keys, as the app lists them
CPKEYS = KEYSCARD_F(((('Chord player', (('Play or stop', 'Space'), ('Undo', '⌘ Z'), ('Redo', '⇧ ⌘ Z'))),),
                     (('Piano keys', (('Play the keys', 'A – ’'), ('An octave down, up', 'Z X'))), ('Anywhere', (('Show the shortcuts', '?'),)))), 640)
# Search, the app's palette at rest (AppLayersLaptop's, as the rail's Search opens it in the app): the field, Suggestions
# (Continue, then Chords and the Metronome, each over where it lives), the keys under a hairline; 640 by 488 at 96
_KBDK = lambda k: f'<kbd style="min-width: 24px; height: 24px; padding: 0 6px; box-sizing: border-box; border-radius: 4px; background: {FILL}; box-shadow: inset 0 -1px 0 {LINE}; font: inherit; font-size: 12px; font-weight: 600; color: {INK}; display: flex; align-items: center; justify-content: center">{k}</kbd>'
_BOOK = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path></svg>'
_SUGP = lambda k: (f'<span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 22px; background: #FEFDFB; box-shadow: inset 0 0 0 1px rgba(51,41,33,.08); color: {INK}; display: flex; align-items: center; justify-content: center">{_BOOK}</span>' if k == 'lesson' else pic(k))
_SUGR = lambda t, sub, h, k, last: (f'<a href="{h}" style="min-height: 60px; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 8px 12px; color: {INK}; text-decoration: none{"" if last else f"; box-shadow: inset 0 -1px 0 {FILL}"}">{_SUGP(k)}'
                                    f'<span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{t}</span><span style="font-size: 13px; color: {SOFT}">{sub}</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a>')
_SUGS = (('Finding your way on the keys', 'Continue · Lesson 1 of 11', 'LessonLaptop.dc.html', 'lesson'), ('Chords', 'Practice · Theory', 'ChordsLaptop.dc.html', 'keys'), ('Metronome', 'Practice · Tools', 'MetronomeLaptop.dc.html', 'metro'))
CPSRCH = (f'<sc-if value="{{{{searchOn}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.32)"></div>'
          f'<div role="dialog" aria-modal="true" aria-label="Search" style="position: absolute; left: 50%; top: 96px; transform: translateX(-50%); z-index: 61; width: 640px; height: 488px; overflow: hidden; box-sizing: border-box; border-radius: 22px; background: {PAGE}; padding: 16px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 12px">'
          f'<label style="flex: none; height: 48px; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; align-items: center; gap: 8px; padding: 0 4px 0 12px; color: {SOFT}">{SEARCH}<input type="search" autofocus placeholder="Songs, chords, scales, lessons…" aria-label="Search everything" style="flex: 1; min-width: 0; height: 44px; border: 0; outline: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}"></label>'
          f'<div style="flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 8px">{CAPS("Suggestions")}<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">'
          + ''.join(_SUGR(*r, i == len(_SUGS) - 1) for i, r in enumerate(_SUGS)) + '</div></div>'
          f'<div aria-label="Keys" style="flex: none; display: flex; gap: 16px; margin: 0 -16px; padding: 12px 20px 0; box-shadow: inset 0 1px 0 {FILL}; font-size: 13px; color: {SOFT}">'
          + ''.join(f'<span style="display: flex; align-items: center; gap: 4px">{"".join(_KBDK(k) for k in ks)}<span style="margin-left: 2px">{w}</span></span>' for ks, w in ((('↑', '↓'), 'Move'), (('↵',), 'Open'), (('Esc',), 'Close'))) + '</div></div></sc-if>')
full_laptop('ChordPlayerLaptop', 'Chord player, laptop', lm77 + TOAST(296, z=56, laptop=True, left='{{toastX}}'), CP77, _SHL + POPS77L + NAMEMENU77L + POPOVER('libOn', 'Chord sheets', CP_LIB, 'left: 64px; top: 60px', 320) + LIBROW + LAPSHEET(RENAME77) + LAPSHEET(SAVEAS77) + CPKEYS + CPSRCH)
