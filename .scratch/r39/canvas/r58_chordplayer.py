# R58: the Chord player redrawn to its brief (.scratch/r39/plan/practice-chord-player.md, rulings of 2026-11-13):
DOTSB = IB('More', MORE, 'openMore')
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
    const TAGS = st.tags || TAGS0, follow = st.follow ?? true;
    const tagLine = (t) => [t.intro, t.mains.join(', '), t.into, t.ending].filter((x) => x && x !== 'None').join(' · ');''', 1)
CP58 = CP58.replace("    const secs = SECS.map(([m, name, rep, bars], si) => ({ m, name, rep: '× ' + rep, bars: bars.map((cs, bi) => ({ cs: cs.map((c) => ({ c })), bg: play[0] === si && play[1] === bi ? '#EDC684' : !st.playing && slot.si === si && slot.bi === bi ? '#F6E7C8' : 'transparent', edge: bi % 4 === 3 ? '0' : '1px', pick: () => set({ sheet: 'chord', sel: [si, bi] }) })) }));",
r'''    const beatNow = st.playing ? ((st.pos ?? 4) % 2) * 2 : -1;
    const secs = SECS.map(([m, name, rep, bars], si) => ({ m, name, rep: '× ' + rep, tag: follow ? tagLine(TAGS[si] || { mains: [] }) : '', tagOn: follow, openTag: () => set({ sheet: 'tag', tagAt: si }),
      bars: bars.map((cs, bi) => { const ls = lens(si, bi, cs), sum = ls.reduce((a, b) => a + b, 0), wrong = sum !== 4, now = play[0] === si && play[1] === bi;
        return { cs: cs.map((c, ci) => ({ c, grow: String(ls[ci]), pick: () => set({ sheet: 'chord', sel: [si, bi], selC: ci }) })),
          ticks: Array.from({ length: Math.max(sum, 1) }, (_, k) => ({ bg: now && k === beatNow ? '#332921' : '#B9AEA3', w: k === 0 ? '10px' : '6px' })),
          wrong, wrongTip: 'Bar ' + (bi + 1) + ' holds ' + sum + ' beats, not 4: tap to set its chords’ lengths',
          bg: now ? '#EDC684' : !st.playing && slot.si === si && slot.bi === bi ? '#F6E7C8' : 'transparent', edge: bi % 4 === 3 ? '0' : '1px', pick: () => set({ sheet: 'chord', sel: [si, bi], selC: 0 }) }; }) }));
    const selB = st.sel ? SECS[st.sel[0]][3][st.sel[1]] : SECS[0][3][0], selCi = st.selC ?? 0, selSym = selB[selCi] || selB[0];
    const selLen = st.sel ? lens(st.sel[0], st.sel[1], selB)[selCi] : 4;
    const setLen = (d) => { if (!st.sel) return; const k = st.sel[0] + ':' + st.sel[1], cur = lens(st.sel[0], st.sel[1], selB).slice(); cur[selCi] = Math.max(1, Math.min(8, cur[selCi] + d)); set({ len: { ...LEN, [k]: cur } }); };
    const editSecs = (fn) => { const c = JSON.parse(JSON.stringify(SECS)); const l = JSON.parse(JSON.stringify(LEN)); fn(c, l); set({ secs: c, len: l, draft: true }); };
    const tagAt = st.tagAt ?? 0, tg = TAGS[tagAt] || { mains: [] };
    const setTag = (o) => set({ tags: TAGS.map((t, i) => (i === tagAt ? { ...t, ...o } : t)), draft: true });
    const SEGT = (opts, cur, pick) => opts.map((l) => ({ l, on: l === cur, bg: l === cur ? '#FEFDFB' : 'transparent', sh: l === cur ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: l === cur ? 600 : 500, pick: () => pick(l) }));
    // the Genos's panel, its lamps: on (chosen), flashing (next), available, off (no data)
    const ar = st.ar || { acmp: true, sync: false, syncStop: false, autoFill: true, ots: false, main: 'A', next: null, intro: null, ending: null, fade: false };
    const lamp = (on, next) => ({ bg: on ? '#C2412D' : next ? '#E8A090' : '#FEFDFB', fg: on ? '#FEFDFB' : '#332921', ring: on ? 'none' : '0 0 0 1px #DAD1C8' });
    const arSet = (o) => set({ ar: { ...ar, ...o } });''', 1)
CP58 = CP58.replace("    return { ...common(st, set),", r'''    return { ...common(st, set), draftOn: !!st.draft, saveDraft: () => set({ draft: false, sheet: null }), discardDraft: () => set({ draft: false, secs: null, len: null, tags: null, sheet: null }),
      tagOnSheet: st.sheet === 'tag', tagTitle: SECS[tagAt] ? SECS[tagAt][1] + ' on the Genos' : '', tagIsFirst: tagAt === 0, tagIsLast: tagAt === SECS.length - 1,
      introSeg: SEGT(['None', 'Intro I', 'Intro II', 'Intro III'], tg.intro || 'None', (l) => setTag({ intro: l })),
      passes: (tg.mains.length ? tg.mains : ['None']).map((mv, pi) => ({ n: 'Pass ' + (pi + 1), seg: SEGT(['None', 'A', 'B', 'C', 'D'], mv === 'None' ? 'None' : mv.slice(-1), (l) => setTag({ mains: tg.mains.map((x, i) => (i === pi ? (l === 'None' ? 'None' : 'Main ' + l) : x)) })) })),
      intoSeg: SEGT(['None', 'Fill in', 'Break'], tg.into || 'None', (l) => setTag({ into: l })),
      endingSeg: SEGT(['None', 'Ending I', 'Ending II', 'Ending III'], tg.ending || 'None', (l) => setTag({ ending: l })),
      chordOn58: st.sheet === 'chord', selSym, selTitle: 'Bar ' + ((st.sel ? st.sel[1] : 0) + 1) + ' · ' + selSym, selLen: selLen + (selLen === 1 ? ' beat' : ' beats'), lenDn: () => setLen(-1), lenUp: () => setLen(1),
      suggest: ['Am', 'F', 'G', 'Em', 'Dm', 'G7'].map((c) => ({ c, pick: () => editSecs((s) => { s[st.sel ? st.sel[0] : 0][3][st.sel ? st.sel[1] : 0][selCi] = c; }) })),
      chordRoots: rootGrid(Math.max(0, ROOTS.indexOf((selSym.match(/^[A-G][♭♯]?/) || ['C'])[0].replace('D♭', 'C♯').replace('G♭', 'F♯'))), () => {}),
      qualChips: chipsOf(['maj', 'm', '7', 'maj7', 'm7', 'sus4', 'sus2', 'dim', 'add9', '6'], (() => { const q = selSym.split('/')[0].replace(/^[A-G][♭♯]?/, ''); return q === '' ? 'maj' : q === '°' ? 'dim' : q; })(), () => {}),
      duplicate: () => editSecs((s, l) => { const [si, bi] = st.sel || [0, 0]; s[si][3].splice(bi + 1, 0, s[si][3][bi].slice()); }),
      removeChord: () => editSecs((s) => { const [si, bi] = st.sel || [0, 0]; s[si][3].splice(bi, 1); }),
      playFrom: () => set({ sheet: null, playing: true, pos: 0 }),
      shareOn: st.sheet === 'share', openShare: () => set({ sheet: 'share' }), shareSeg: SEGT(['View only', 'Can edit'], st.shareMode ?? 'View only', (l) => set({ shareMode: l })),
      followSw: follow, followBg: follow ? '#44684A' : '#DAD1C8', followX: follow ? 22 : 2, toggleFollow: () => set({ follow: !follow }),
      arOn: follow, arStart: lamp(!!st.playing), arAcmp: lamp(ar.acmp), arSync: lamp(ar.sync), arSyncStop: lamp(ar.syncStop), arAuto: lamp(ar.autoFill), arOts: lamp(ar.ots), arFade: lamp(ar.fade), arBreak: lamp(false, ar.next === 'Break'),
      arIntros: ['I', 'II', 'III'].map((n) => ({ n, ...lamp(ar.intro === n), pick: () => arSet({ intro: ar.intro === n ? null : n }) })),
      arMains: ['A', 'B', 'C', 'D'].map((n) => ({ n, ...lamp(ar.main === n, ar.next === n), pick: () => arSet(ar.main === n ? { next: 'fill' } : { next: n, main: st.playing ? ar.main : n }) })),
      arEndings: ['I', 'II', 'III'].map((n) => ({ n, ...lamp(ar.ending === n), pick: () => arSet({ ending: ar.ending === n ? null : n }) })),
      tAcmp: () => arSet({ acmp: !ar.acmp }), tSync: () => arSet({ sync: !ar.sync }), tSyncStop: () => arSet({ syncStop: !ar.syncStop }), tAuto: () => arSet({ autoFill: !ar.autoFill }), tOts: () => arSet({ ots: !ar.ots }), tFade: () => arSet({ fade: !ar.fade }), tBreak: () => arSet({ next: 'Break' }),
      arTitle: st.playing ? 'Genos · playing Main ' + ar.main : 'Genos · waiting for Start',''', 1)
assert CP58.count('draftOn') == 1 and CP58.count('SECS0') == 2, 'CP58 patch missed'

# ── the chart: beats under each bar, the ! on a bar that does not add up, the section's Genos tag ──
BANG = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#C2412D"></circle><path d="M12 6.5v7M12 17.2v.3" stroke="#FEFDFB" stroke-width="2.6" stroke-linecap="round"></path></svg>'
CHART58 = (f'<div style="border-radius: 6px; background: #FFFFFF; box-shadow: 0 0 0 1px {LINE}, 0 10px 24px -18px rgba(51,41,33,.45); padding: 16px 14px 18px; display: flex; flex-direction: column; gap: 16px">'
           f'<div style="display: flex; align-items: baseline; justify-content: center; gap: 8px"><span style="font-family: {SERIF}; font-size: 20px">My verse and chorus</span><sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; font-weight: 600; color: #7A5418">Draft</span></sc-if><span style="display: inline-flex; align-items: center; gap: 6px; align-self: center; font-size: 13px; font-weight: 600; color: {SOFT}"><span style="width: 8px; height: 8px; border-radius: 4px; background: #3F7A4A"></span>Live</span></div>'
           f'<sc-for list="{{{{secs}}}}" as="x" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 4px">'
           f'<div style="display: flex; align-items: center; gap: 8px; min-height: 44px"><span style="display: flex; color: {SOFT}; cursor: grab" aria-label="Move the section">{GRIP}</span><span style="width: 22px; height: 22px; box-sizing: border-box; border: 1.5px solid {INK}; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700">{{{{x.m}}}}</span><span style="font-size: 15px; font-weight: 600">{{{{x.name}}}}</span><span style="font-size: 13px; color: {SOFT}">{{{{x.rep}}}}</span>{SPACER}'
           f'<sc-if value="{{{{x.tagOn}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{x.openTag}}}}" aria-label="On the Genos: {{{{x.tag}}}}" style="min-width: 0; max-width: 62%; height: 32px; margin: 6px 0; padding: 0 10px; border: 0; border-radius: 8px; background: {FILL}; color: {INK}; font: inherit; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{x.tag}}}}</button></sc-if></div>'
           f'<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-left: 2px solid {INK}; border-right: 2px solid {INK}"><sc-for list="{{{{x.bars}}}}" as="b" hint-placeholder-count="8">'
           f'<div style="position: relative; height: {{{{CH}}}}px; border-right: {{{{b.edge}}}} solid {INK}; background: {{{{b.bg}}}}; display: flex; flex-direction: column">'
           f'<div style="flex: 1; display: flex; align-items: stretch"><sc-for list="{{{{b.cs}}}}" as="c" hint-placeholder-count="1"><button type="button" onClick="{{{{c.pick}}}}" style="flex: {{{{c.grow}}}} 1 0; min-width: 40px; border: 0; background: transparent; padding: 0 2px; color: {INK}; font-family: {SERIF}; font-size: {{{{CF}}}}px; font-weight: 700; white-space: nowrap">{{{{c.c}}}}</button></sc-for></div>'
           f'<div aria-hidden="true" style="flex: none; height: 9px; padding: 0 6px; display: flex; align-items: center; gap: 3px"><sc-for list="{{{{b.ticks}}}}" as="t" hint-placeholder-count="4"><span style="flex: 1; height: 3px; border-radius: 2px; background: {{{{t.bg}}}}"></span></sc-for></div>'
           f'<sc-if value="{{{{b.wrong}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" aria-label="{{{{b.wrongTip}}}}" data-tip="{{{{b.wrongTip}}}}" onClick="{{{{b.pick}}}}" style="position: absolute; top: -18px; right: -22px; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; z-index: 2">{BANG}</button></sc-if></div></sc-for></div></section></sc-for>'
           f'<button type="button" style="align-self: flex-start; height: 44px; padding: 0 8px; margin: -4px 0 -4px -8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">+ Add section</button></div>')

# ── the chord's sheet, as Musicca's: Root, Chord, Bass note, Duration − n beats +, Suggested chords, the acts ──
CHIPROW = lambda lst: f'<div style="display: flex; flex-wrap: wrap; gap: 6px"><sc-for list="{{{{{lst}}}}}" as="p" hint-placeholder-count="6"><button type="button" onClick="{{{{p.pick}}}}" style="height: 40px; min-width: 52px; padding: 0 12px; border: 0; border-radius: 10px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 15px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div>'
SUGG = f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{suggest}}}}" as="s" hint-placeholder-count="6"><button type="button" onClick="{{{{s.pick}}}}" style="height: 52px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font-family: {SERIF}; font-size: 20px; font-weight: 700">{{{{s.c}}}}</button></sc-for></div>'
ACTROW = lambda svg, label, act, color=INK: f'<button type="button" onClick="{{{{{act}}}}}" style="min-height: 48px; width: 100%; display: flex; align-items: center; gap: 12px; padding: 0 16px; border: 0; background: transparent; color: {color}; font: inherit; font-size: 16px; font-weight: 600; text-align: left">{svg}{label}</button>'
DUPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>'
TRASHI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path></svg>'
PLAYS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>'
CP_CHORD58 = (CAPS('Root') + ROOTGRID('chordRoots') + CAPS('Chord') + CHIPROW('qualChips')
              + GROUP(('link', 'Bass note', 'Root', ''), ('step', 'Duration', 'selLen', 'lenDn', 'lenUp'))
              + CAPS('Suggested chords') + SUGG
              + f'<div style="border-radius: 12px; background: {FILL}; overflow: hidden">' + ACTROW(PLAYS, 'Play from here', 'playFrom') + f'<div style="height: 1px; margin-left: 48px; background: {LINE}"></div>' + ACTROW(DUPI, 'Duplicate', 'duplicate') + '</div>'
              + f'<div style="border-radius: 12px; background: {FILL}; overflow: hidden">' + ACTROW(TRASHI, 'Delete chord', 'removeChord', '#B3261E') + '</div>')

# ── a section on the Genos: Intro (first section), Main per pass, into the next, Ending (last section) ──
SEGROW = lambda label, lst: f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 12px 12px 12px 16px"><span style="font-size: 16px">{label}</span>{SEGC(lst, 44, 14)}</div>'
CP_TAG = (f'<sc-if value="{{{{tagIsFirst}}}}" hint-placeholder-val="{{{{true}}}}"><div style="border-radius: 12px; background: {FILL}">' + SEGROW('Intro', 'introSeg') + '</div></sc-if>'
          + CAPS('Main, each time through')
          + f'<div style="border-radius: 12px; background: {FILL}"><sc-for list="{{{{passes}}}}" as="p" hint-placeholder-count="2"><div style="display: flex; flex-direction: column; gap: 8px; padding: 12px 12px 12px 16px; box-shadow: inset 0 -1px 0 {LINE}"><span style="font-size: 16px">{{{{p.n}}}}</span>{SEGC("p.seg", 44, 14)}</div></sc-for></div>'
          + f'<sc-if value="{{{{tagIsLast}}}}" hint-placeholder-val="{{{{false}}}}"><div style="border-radius: 12px; background: {FILL}">' + SEGROW('Ending', 'endingSeg') + '</div></sc-if>'
          + f'<div style="border-radius: 12px; background: {FILL}">' + SEGROW('Into the next section', 'intoSeg') + '</div>'
          + f'<p style="margin: 0 4px; font-size: 14px; color: {SOFT}">None sends nothing: the Genos plays as its panel says.</p>')

# ── ··· : the draft, sharing, the sheets ──
CP_MORE58 = (f'<sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}"><div style="border-radius: 12px; background: {FILL}; overflow: hidden">'
             + ACTROW(CHECK.replace('16', '20'), 'Save', 'saveDraft', LINK) + f'<div style="height: 1px; margin-left: 48px; background: {LINE}"></div>' + ACTROW(UNDO, 'Discard draft', 'discardDraft', '#B3261E') + '</div></sc-if>'
             + GROUP(('link', 'Share', 'View only', 'openShare'), ('link', 'Chord sheets', '', ''), ('link', 'Save as my chord sheet', '', ''), ('link', 'Open in Progressions', '', 'Progressions.dc.html')))
CP_SHARE = (f'<p style="margin: 0 4px; font-size: 15px; color: {SOFT}">Everyone with the link sees each change as it is made, and the chord playing.</p>'
            + f'<div style="border-radius: 12px; background: {FILL}">' + SEGROW('People with the link', 'shareSeg') + '</div>'
            + BTN('Copy link', kind='primary', h=50))

# ── settings: Follow a MIDI arranger beside Connect a piano ──
CP_SET58 = CP_SET + GROUP(('toggle', 'Follow a MIDI arranger', 'followSw', 'toggleFollow'), ('val', 'Arranger', 'Genos · USB'))

# ── R59 (owner, 2026-11-14, Musicca's chord player beside it: "make the ui of the chords like the musicca does";
# "one tap on the chord selects it and plays from there when I play and double click opens this chord settings";
# "the floating bar … doesnt stand above the content like pinned above the keyboard"): each chord a white box as
# wide as its beats, its beats ticked along its foot, its name large with the extension raised; a + box ends each
# section; the section's head Musicca's (name, × n, Variation n, delete, grip); one tap selects a chord, Play starts
# there, a double tap opens its sheet, Musicca's dialog (Chord root ⌄ quality ⌄, Bass note ⌄, Duration, Suggested
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
            tap: () => { const t = Date.now(), k = si + ':' + bi + ':' + ci, l = this._tap59;
              if (l && l.k === k && t - l.t < 400) { this._tap59 = null; set({ sheet: 'chord', sel: [si, bi], selC: ci, selB59: [si, bi, ci], pop: null }); }
              else { this._tap59 = { k, t }; set({ sel: [si, bi], selC: ci, selB59: [si, bi, ci] }); } } });
          from += L; }); });
      return { m, name, rep: '× ' + rep, vari: 'Variation ' + (VARS[si] ?? 1), tag: follow ? tagLine(TAGS[si] || { mains: [] }) : '', tagOn: follow, openTag: () => set({ sheet: 'tag', tagAt: si }), boxes,
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
    sup = f'<sup style="font-size: .58em; vertical-align: .6em; margin-left: 1px">{{{{b.x}}}}</sup>'
    box = (f'<sc-for list="{{{{x.boxes}}}}" as="b" hint-placeholder-count="8"><button type="button" onClick="{{{{b.tap}}}}" aria-label="{{{{b.label}}}}" style="grid-column: {{{{b.span}}}}; position: relative; min-width: 0; height: {bh}px; padding: 4px 8px 0; border: 0; border-radius: 6px; background: {{{{b.bg}}}}; box-shadow: {{{{b.ring}}}}; color: {INK}; font: inherit; text-align: left; display: flex; align-items: flex-start">'
           f'<span style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: {bf}px; font-weight: 500; line-height: 1.25">{{{{b.r}}}}{sup}{{{{b.b}}}}</span>'
           f'<span aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 10px; display: flex"><sc-for list="{{{{b.ticks}}}}" as="t" hint-placeholder-count="4"><span style="flex: 1; display: flex; justify-content: center; align-items: flex-end"><span style="width: 1.5px; height: {{{{t.h}}}}; background: {{{{t.bg}}}}"></span></span></sc-for></span>'
           f'<sc-if value="{{{{b.picked}}}}" hint-placeholder-val="{{{{false}}}}"><span role="separator" aria-orientation="vertical" aria-label="Drag to change its length" data-tip="Drag to change its length" style="position: absolute; top: 0; right: -10px; bottom: 0; width: 24px; display: flex; align-items: center; justify-content: center; cursor: ew-resize; z-index: 2"><span style="width: 4px; height: 55%; border-radius: 2px; background: {INK}"></span></span></sc-if><sc-if value="{{{{b.wrong}}}}" hint-placeholder-val="{{{{false}}}}"><span role="img" aria-label="{{{{b.wrongTip}}}}" data-tip="{{{{b.wrongTip}}}}" style="position: absolute; top: -7px; right: -7px; display: flex">{BANG}</span></sc-if></button></sc-for>')
    plusb = f'<button type="button" onClick="{{{{x.add}}}}" aria-label="Add a chord to {{{{x.name}}}}" style="grid-column: span {plus}; min-width: 0; height: {bh}px; border: 0; border-radius: 6px; background: transparent; box-shadow: 0 0 0 1px {LINE}; color: {SOFT}; font: inherit; font-size: 24px">+</button>'
    pill = lambda inner, act, label, extra='': f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{label}" style="flex: none; height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; {extra}"><span style="height: 36px; box-sizing: border-box; padding: 0 12px; border-radius: 8px; background: {FILL}; display: flex; align-items: center; font-size: 15px; white-space: nowrap; font-variant-numeric: tabular-nums">{inner}</span></button>'
    head = (f'<div style="display: flex; align-items: center; gap: 6px; min-height: 44px">'
            + pill('<span style="overflow: hidden; text-overflow: ellipsis; font-weight: 600">{{x.name}}</span>', 'x.openTag', 'Section: {{x.name}}', 'flex: 0 1 160px; min-width: 0').replace('height: 36px; box-sizing', 'width: 100%; height: 36px; box-sizing')
            + pill('{{x.rep}}', 'x.repUp', 'Plays {{x.rep}}') + pill('{{x.vari}}', 'x.varUp', '{{x.vari}}')
            + f'<button type="button" onClick="{{{{x.del}}}}" aria-label="Delete {{{{x.name}}}}" data-tip="Delete section" style="flex: none; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{TRASHI}</button>'
            + f'<span style="flex: 1"></span><span aria-label="Move {{{{x.name}}}}" style="flex: none; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: {SOFT}; cursor: grab">{GRIP}</span></div>')
    tag = f'<sc-if value="{{{{x.tagOn}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{x.openTag}}}}" aria-label="On the Genos: {{{{x.tag}}}}" style="align-self: flex-start; max-width: 100%; height: 44px; margin: -6px 0 -2px; padding: 0; border: 0; background: transparent; font: inherit; color: {INK}"><span style="height: 30px; padding: 0 10px; border-radius: 8px; box-shadow: inset 0 0 0 1px {LINE}; display: flex; align-items: center; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{x.tag}}}}</span></button></sc-if>'
    return (f'<div style="display: flex; flex-direction: column; gap: 18px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px"><span style="font-size: 22px; font-weight: 600">My verse and chorus</span><sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; font-weight: 600; color: #7A5418">Draft</span></sc-if><span style="display: inline-flex; align-items: center; gap: 6px; align-self: center; font-size: 13px; font-weight: 600; color: {SOFT}"><span style="width: 8px; height: 8px; border-radius: 4px; background: #3F7A4A"></span>Live</span></div>'
            f'<sc-for list="{{{{sec59}}}}" as="x" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 8px">{head}{tag}'
            f'<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: {gap}px">{box}{plusb}</div></section></sc-for>'
            f'<button type="button" style="align-self: flex-start; height: 44px; padding: 0 8px; margin: -4px 0 -4px -8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">+ Add section</button></div>')

POP59 = lambda lbl, act, w, name: f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{name}: {{{{{lbl}}}}}" style="flex: none; min-width: {w}px; height: 44px; padding: 0 10px 0 12px; border: 0; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px">{{{{{lbl}}}}}<span style="display: flex; color: {SOFT}">{CHEV_D}</span></button>'
ROW59 = lambda label, inner: ('raw', f'<div style="min-height: 56px; box-sizing: border-box; display: flex; align-items: center; gap: 8px; padding: 6px 12px 6px 16px"><span style="flex: 1; font-size: 16px">{label}</span>{inner}</div>')
SUGG59 = f'<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{suggest59}}}}" as="s" hint-placeholder-count="8"><button type="button" onClick="{{{{s.pick}}}}" style="height: 44px; min-width: 0; border: 0; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 17px; font-weight: 500">{{{{s.r}}}}<sup style="font-size: .6em; vertical-align: .55em">{{{{s.x}}}}</sup>{{{{s.b}}}}</button></sc-for></div>'
QBTN = lambda svg, label, act: f'<button type="button" onClick="{{{{{act}}}}}" style="flex: 1; min-width: 0; height: 44px; padding: 0 12px; border: 0; border-radius: 10px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap">{svg}{label}</button>'
CP_CHORD59 = (GROUP(ROW59('Chord', POP59('rootPopL', 'openRootPop', 72, 'Root') + POP59('qualPopL', 'openQualPop', 120, 'Quality')),
                    ROW59('Bass note', POP59('bassPopL', 'openBassPop', 136, 'Bass note')), ('step', 'Duration', 'selLen', 'lenDn', 'lenUp'))
              + f'<sc-if value="{{{{rootPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{ROOTGRID("chordRoots")}</sc-if>'
              + f'<sc-if value="{{{{qualPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("qualChips")}</sc-if>'
              + f'<sc-if value="{{{{bassPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("bassChips")}</sc-if>'
              + CAPS('Suggested chords') + SUGG59
              + f'<div style="display: flex; gap: 8px"><button type="button" onClick="{{{{removeChord}}}}" aria-label="Delete chord" data-tip="Delete chord" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 10px; background: #F4DCD6; color: #B3261E; display: flex; align-items: center; justify-content: center">{TRASHI}</button>'
              + QBTN(DUPI, 'Duplicate', 'duplicate') + QBTN(PLAYS, 'Play from here', 'playFrom') + '</div>')


# ── the Genos's style strip, over the dock while Follow a MIDI arranger is on ──
LAMP = lambda key, label, act, w='auto': f'<button type="button" onClick="{{{{{act}}}}}" style="flex: none; min-width: 44px; width: {w}; height: 36px; padding: 0 9px; border: 0; border-radius: 9px; background: {{{{{key}.bg}}}}; color: {{{{{key}.fg}}}}; box-shadow: {{{{{key}.ring}}}}; font: inherit; font-size: 13px; font-weight: 700; white-space: nowrap">{label}</button>'
LAMPS = lambda lst, pre: f'<sc-for list="{{{{{lst}}}}}" as="l" hint-placeholder-count="3"><button type="button" onClick="{{{{l.pick}}}}" style="flex: none; min-width: 44px; height: 36px; padding: 0 9px; border: 0; border-radius: 9px; background: {{{{l.bg}}}}; color: {{{{l.fg}}}}; box-shadow: {{{{l.ring}}}}; font: inherit; font-size: 13px; font-weight: 700; white-space: nowrap">{pre}{{{{l.n}}}}</button></sc-for>'
GRPL = lambda label, inner: f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: {SOFT}">{label}</span><div style="display: flex; gap: 4px">{inner}</div></div>'
STRIP = (f'<sc-if value="{{{{arOn}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Genos style controls" style="flex: none; display: flex; flex-direction: column; gap: 6px; padding: 8px 0 10px">'
         f'<div style="display: flex; align-items: center; gap: 8px; padding: 0 16px"><span style="width: 8px; height: 8px; border-radius: 4px; background: #44684A"></span><span style="font-size: 13px; font-weight: 600">{{{{arTitle}}}}</span></div>'
         f'<div class="nos" style="display: flex; gap: 14px; overflow-x: auto; padding: 0 16px">'
         + GRPL('Style', LAMP('arStart', 'Start/Stop', 'togglePlay') + LAMP('arAcmp', 'ACMP', 'tAcmp') + LAMP('arSync', 'Sync Start', 'tSync') + LAMP('arSyncStop', 'Sync Stop', 'tSyncStop'))
         + GRPL('Intro', LAMPS('arIntros', ''))
         + GRPL('Main', LAMPS('arMains', '') + LAMP('arAuto', 'Auto Fill', 'tAuto') + LAMP('arBreak', 'Break', 'tBreak'))
         + GRPL('Ending/rit.', LAMPS('arEndings', ''))
         + GRPL('More', LAMP('arFade', 'Fade', 'tFade') + LAMP('arOts', 'OTS Link', 'tOts'))
         + '</div></div></sc-if>')

# R59 (owner, 2026-11-14: "improve the genos actions bar and make better … better ui"): the strip as a card that
# shows every control at once, none scrolled out of sight: its state and Start/Stop on its head; Main A–D and Break,
# then Intro I–III and Ending/rit. I–III (a phone's two rows; one row of groups on a laptop), each group named over it.
# Only what the Genos takes over MIDI (the brief: ACMP, Sync, Auto Fill, Fade and OTS Link have no message).
LAMP59 = lambda key, label, act, spoken='': f'<button type="button" onClick="{{{{{act}}}}}" aria-pressed="{{{{{key}.on}}}}" aria-label="{spoken or label}" style="min-width: 44px; height: 40px; padding: 0 6px; border: 0; border-radius: 9px; background: {{{{{key}.bg}}}}; color: {{{{{key}.fg}}}}; box-shadow: {{{{{key}.ring}}}}; font: inherit; font-size: 14px; font-weight: 700; white-space: nowrap">{label}</button>'
LAMPS59 = lambda lst, spoken: f'<sc-for list="{{{{{lst}}}}}" as="l" hint-placeholder-count="3"><button type="button" onClick="{{{{l.pick}}}}" aria-pressed="{{{{l.on}}}}" aria-label="{spoken} {{{{l.n}}}}" style="min-width: 44px; height: 40px; padding: 0 6px; border: 0; border-radius: 9px; background: {{{{l.bg}}}}; color: {{{{l.fg}}}}; box-shadow: {{{{l.ring}}}}; font: inherit; font-size: 14px; font-weight: 700">{{{{l.n}}}}</button></sc-for>'
CAP59 = lambda t: f'<span style="font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: {SOFT}">{t}</span>'
GRP59 = lambda label, cols, inner, grow='1': f'<div role="group" aria-label="{label}" style="flex: {grow} 1 0; min-width: 0; display: flex; flex-direction: column; gap: 4px">{CAP59(label)}<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: 4px">{inner}</div></div>'
HEAD59 = (f'<div style="display: flex; align-items: center; gap: 8px; min-height: 40px"><span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>'
          f'<span aria-live="polite" style="flex: 1; min-width: 0; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{arTitle}}}}</span>'
          + LAMP59('arStart', 'Start/Stop', 'togglePlay').replace('min-width: 44px', 'flex: none; min-width: 96px') + '</div>')
MAINS59 = GRP59('Main', 5, LAMPS59('arMains', 'Main') + LAMP59('arBreak', 'Break', 'tBreak'), '5')
INTRO59 = GRP59('Intro', 3, LAMPS59('arIntros', 'Intro'), '3')
END59 = GRP59('Ending/rit.', 3, LAMPS59('arEndings', 'Ending'), '3')
STRIP59 = lambda pos, wide: (f'<sc-if value="{{{{arOn}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Genos style controls" style="{pos} z-index: 40; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; padding: 8px 12px 12px; border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}">'
    + HEAD59 + (f'<div style="display: flex; gap: 16px">{INTRO59}{MAINS59}{END59}</div>' if wide else f'{MAINS59}<div style="display: flex; gap: 12px">{INTRO59}{END59}</div>') + '</div></sc-if>')
CP58 = CP58.replace("arTitle: st.playing ?", "arDot: st.playing ? '#44684A' : '#9C9086', arTitle: st.playing ?", 1)
CP58 = CP58.replace("const lamp = (on, next) => ({", "const lamp = (on, next) => ({ on: !!on,", 1)
# R59: the keys pinned at the foot; the dock floats just above them, over the chart, and the Genos strip over the dock
STRIP_CARD = lambda pos: STRIP.replace('style="flex: none; display: flex; flex-direction: column; gap: 6px; padding: 8px 0 10px"', f'style="{pos} z-index: 40; display: flex; flex-direction: column; gap: 6px; padding: 8px 0 10px; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}"', 1)
ph58 = (body(TOP('Main.dc.html', 'Chord player', UNDOB + GEAR() + DOTSB), CHART59(8, 4, 60, 21, 2), '', 300)
        .replace('</main>', '</main><sc-if value="{{cpKb}}" hint-placeholder-val="{{true}}"><div style="flex: none; margin-bottom: 34px; box-shadow: 0 -1px 0 ' + LINE + '">' + CP_KEYS(112) + '</div></sc-if>'
                 + STRIP59('position: absolute; left: 16px; right: 16px; bottom: 234px;', False) + DOCK(CP_DOCK, 158), 1))
lm58 = lapbody(LTOP('Laptop.dc.html', UNDOB + GEAR() + DOTSB, 'Chord player'),
               '<div style="position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column"><div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 4px 200px">' + CHART59(16, 6, 76, 28, 1) + '</div>'
               + '<div style="position: absolute; left: 0; right: 0; bottom: 12px; z-index: 40; display: flex; flex-direction: column; align-items: center; gap: 8px">' + STRIP59('position: relative; width: 100%; max-width: 760px;', True) + DOCK_L(CP_DOCK) + '</div></div>'
               + '<sc-if value="{{cpKb}}" hint-placeholder-val="{{true}}"><div style="flex: none; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px ' + LINE + '">' + CP_KEYS(160) + '</div></sc-if>', DRAG + H2('Style') + WHEEL([('wStyle', 1)]))
SH58 = lambda B, P: (B('chordOn58', '{{selSym}}', CP_CHORD59) + B('tagOnSheet', '{{tagTitle}}', CP_TAG) + B('shareOn', 'Share', CP_SHARE) + B('styleOn', 'Style', WHEEL([('wStyle', 1)])) + B('setOn', 'Chord player settings', CP_SET58) + P + B('moreOn', 'Chord sheet', CP_MORE58))
detail('ChordPlayer', 'Chord player', CP58, ph58, lm58, '', SH58(BSHEET, CP_PSHEET),
       SH58(lambda c, t, b: POPOVER(c, t, b, 'left: 140px; top: 160px', 460), CP_PPOP).replace('Progressions.dc.html', 'ProgressionsLaptop.dc.html'))
