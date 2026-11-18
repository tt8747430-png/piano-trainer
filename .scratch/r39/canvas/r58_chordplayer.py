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
    const TAGS = st.tags || TAGS0, follow = st.follow ?? false;
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
CP58 = CP58.replace("    return { ...common(st, set),", r'''    return { ...common(st, set), draftOn: !!st.draft, addSec: () => { editSecs((c) => { const L = 'ABCDEFGH'[c.length] || 'X'; c.push([L, 'Section ' + L, 1, [['C'], ['F'], ['G'], ['C']]]); }); set({ tags: [...TAGS, JSON.parse(JSON.stringify(TAGS[TAGS.length - 1] || { mains: [] }))] }); }, copyL: st.copied ? 'Link copied' : 'Copy link', copyLink: () => set({ copied: true }), saveProg: () => set({ sheet: null, toast: 'Saved to My progressions' }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: false, saveDraft: () => set({ draft: false, sheet: null }), discardDraft: () => set({ draft: false, secs: null, len: null, tags: null, sheet: null }),
      tagOnSheet: st.sheet === 'tag', tagTitle: SECS[tagAt] ? SECS[tagAt][1] + ' on the Genos' : '', tagIsFirst: tagAt === 0, tagIsLast: tagAt === SECS.length - 1,
      introSeg: SEGT(['None', 'Intro I', 'Intro II', 'Intro III'], tg.intro || 'None', (l) => setTag({ intro: l })),
      passes: (tg.mains.length ? tg.mains : ['None']).map((mv, pi) => ({ n: 'Pass ' + (pi + 1), seg: SEGT(['None', 'A', 'B', 'C', 'D'], mv === 'None' ? 'None' : mv.slice(-1), (l) => setTag({ mains: tg.mains.map((x, i) => (i === pi ? (l === 'None' ? 'None' : 'Main ' + l) : x)) })) })),
      intoSeg: SEGT(['None', 'Fill in', 'Break'], tg.into || 'None', (l) => setTag({ into: l })),
      endingSeg: SEGT(['None', 'Ending I', 'Ending II', 'Ending III'], tg.ending || 'None', (l) => setTag({ ending: l })),
      chordOn58: st.sheet === 'chord', selSym, selTitle: 'Bar ' + ((st.sel ? st.sel[1] : 0) + 1) + ' · ' + selSym, selLen: selLen + (selLen === 1 ? ' beat' : ' beats'), lenDn: () => setLen(-1), lenUp: () => setLen(1),
      chordRoots: rootGrid(Math.max(0, ROOTS.indexOf((selSym.match(/^[A-G][♭♯]?/) || ['C'])[0].replace('D♭', 'C♯').replace('G♭', 'F♯'))), () => {}),
      qualChips: chipsOf(['maj', 'm', '7', 'maj7', 'm7', 'sus4', 'sus2', 'dim', 'add9', '6'], (() => { const q = selSym.split('/')[0].replace(/^[A-G][♭♯]?/, ''); return q === '' ? 'maj' : q === '°' ? 'dim' : q; })(), () => {}),
      duplicate: () => editSecs((s, l) => { const [si, bi] = st.sel || [0, 0]; s[si][3].splice(bi + 1, 0, s[si][3][bi].slice()); }),
      removeChord: () => editSecs((s) => { const [si, bi] = st.sel || [0, 0]; s[si][3].splice(bi, 1); }),
      playFrom: () => set({ sheet: null, playing: true, pos: 0 }),
      shareOn: st.sheet === 'share', openShare: () => set({ sheet: 'share' }), shareSeg: SEGT(['View only', 'Can edit'], st.shareMode ?? 'View only', (l) => set({ shareMode: l })),
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
ACTROW = lambda svg, label, act, color=INK: f'<button type="button" onClick="{{{{{act}}}}}" style="min-height: 48px; width: 100%; display: flex; align-items: center; gap: 12px; padding: 0 16px; border: 0; background: transparent; color: {color}; font: inherit; font-size: 16px; font-weight: 600; text-align: left">{svg}{label}</button>'
DUPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>'
TRASHI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path></svg>'
PLAYS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z"></path></svg>'

# ── a section on the Genos: Intro (first section), Main per pass, into the next, Ending (last section) ──
SEGROW = lambda label, lst: f'<div style="display: flex; flex-direction: column; gap: 8px; padding: 12px 12px 12px 16px"><span style="font-size: 16px">{label}</span>{SEGC(lst, 44, 14)}</div>'
CP_TAG = (f'<sc-if value="{{{{tagIsFirst}}}}" hint-placeholder-val="{{{{true}}}}"><div style="border-radius: 12px; background: {FILL}">' + SEGROW('Intro', 'introSeg') + '</div></sc-if>'
          + '<div style="display: flex; flex-direction: column; gap: 8px">' + CAPS('Main, each time through')
          + f'<div style="border-radius: 12px; background: {FILL}"><sc-for list="{{{{passes}}}}" as="p" hint-placeholder-count="2"><div style="display: flex; flex-direction: column; gap: 8px; padding: 12px 12px 12px 16px; box-shadow: inset 0 -1px 0 {LINE}"><span style="font-size: 16px">{{{{p.n}}}}</span>{SEGC("p.seg", 44, 14)}</div></sc-for></div></div>'
          + f'<sc-if value="{{{{tagIsLast}}}}" hint-placeholder-val="{{{{false}}}}"><div style="border-radius: 12px; background: {FILL}">' + SEGROW('Ending', 'endingSeg') + '</div></sc-if>'
          + f'<div style="border-radius: 12px; background: {FILL}">' + SEGROW('Into the next section', 'intoSeg') + '</div>'
          + f'<p style="margin: 0 4px; font-size: 14px; color: {SOFT}">None sends nothing: the Genos plays as its panel says.</p>')

# ── ··· : the draft, sharing, the sheets ──
CP_MORE58 = (f'<sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}"><div style="border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">'
             + ACTROW(ICON(CHECK, 20), 'Save', 'saveDraft', LINK) + f'<div style="height: 1px; margin-left: 48px; background: {LINE}"></div>' + ACTROW(UNDO, 'Discard draft', 'discardDraft', '#B3261E') + '</div></sc-if>'
             + GROUP(('link', 'Share', 'View only', 'openShare'), ('action', 'Save to my progressions', 'saveProg'), ('link', 'Open in Progressions', '', 'Progressions.dc.html'), bg=SHEET))
CP_SHARE = (f'<p style="margin: 0 4px; font-size: 15px; line-height: 1.4; color: {SOFT}; text-wrap: pretty">Everyone with the link sees each change as it is made, and the chord playing.</p>'
            + f'<div style="border-radius: 12px; background: {FILL}">' + SEGROW('People with the link', 'shareSeg') + '</div>'
            + BTN('{{copyL}}', 'copyLink', kind='primary', h=50))

# ── settings: Follow a MIDI arranger beside Connect a piano ──
# R76 (owner, 2026-11-18: "teh settinsg should be refactored"): by how often each is wanted (ux-principles, Order by
# relevance): what sounds, how it plays, how the chart is written, what it listens to, then the page's layout
CP_SET58 = (LABELLED('Sound', GROUP(('toggle', 'Piano', 'cpPiOn', 'cpPiT'), ('toggle', 'Bass', 'cpBaOn', 'cpBaT'), ('toggle', 'Drums', 'cpDrOn', 'cpDrT'), ('link', 'Volume', '80%', '')))
            + LABELLED('Playing', GROUP(('link', 'Count-in', '1 bar', ''), ('seg', 'Voicing', 'cpVSeg', 200)))
            + LABELLED('Chart', GROUP(('link', 'Time signature', '4/4', ''), ('seg', 'Written as', 'namesSeg', 200)))
            + LABELLED('MIDI', GROUP(('link', 'Connect a piano', 'Not connected', 'Settings.dc.html'), ('toggle', 'Follow a MIDI arranger', 'followSw', 'toggleFollow'), ('val', 'Arranger', 'Genos · USB')))
            + LABELLED('Layout', GROUP(('action', 'Edit layout', 'openLay'), ('action', 'Reset layout', 'resetLay'), ('link', 'Every page’s layout', '', 'Settings.dc.html'))))

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
            tap: () => set(picked ? { sheet: 'chord', sel: [si, bi], selC: ci, selB59: [si, bi, ci], pop: null } : { sel: [si, bi], selC: ci, selB59: [si, bi, ci] }) });
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
    sup = f'<sup style="font-size: max(12px, .6em); vertical-align: .6em; margin-left: 1px">{{{{b.x}}}}</sup>'
    box = (f'<sc-for list="{{{{x.boxes}}}}" as="b" hint-placeholder-count="8"><button type="button" onClick="{{{{b.tap}}}}" aria-label="{{{{b.label}}}}" style="grid-column: {{{{b.span}}}}; position: relative; min-width: 0; height: {bh}px; padding: 4px 8px 0; border: 0; border-radius: 6px; background: {{{{b.bg}}}}; box-shadow: {{{{b.ring}}}}; color: {INK}; font: inherit; text-align: left; display: flex; align-items: flex-start">'
           f'<span style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: {bf}px; font-weight: 500; line-height: 1.25">{{{{b.r}}}}{sup}{{{{b.b}}}}</span>'
           f'<span aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 10px; display: flex"><sc-for list="{{{{b.ticks}}}}" as="t" hint-placeholder-count="4"><span style="flex: 1; display: flex; justify-content: center; align-items: flex-end"><span style="width: 1.5px; height: {{{{t.h}}}}; background: {{{{t.bg}}}}"></span></span></sc-for></span>'
           f'<sc-if value="{{{{b.picked}}}}" hint-placeholder-val="{{{{false}}}}"><span role="separator" aria-orientation="vertical" aria-label="Drag to change its length" data-tip="Drag to change its length" style="position: absolute; top: 0; right: -10px; bottom: 0; width: 24px; display: flex; align-items: center; justify-content: center; cursor: ew-resize; z-index: 2"><span style="width: 4px; height: 55%; border-radius: 2px; background: {INK}"></span></span></sc-if><sc-if value="{{{{b.wrong}}}}" hint-placeholder-val="{{{{false}}}}"><span role="img" aria-label="{{{{b.wrongTip}}}}" data-tip="{{{{b.wrongTip}}}}" style="position: absolute; top: -7px; right: -7px; display: flex">{BANG}</span></sc-if></button></sc-for>')
    plusb = f'<button type="button" onClick="{{{{x.add}}}}" aria-label="Add a chord to {{{{x.name}}}}" style="grid-column: span {plus}; min-width: 0; height: {bh}px; border: 0; border-radius: 6px; background: transparent; box-shadow: 0 0 0 1px {LINE}; color: {SOFT}; font: inherit; font-size: 24px">+</button>'
    pill = lambda inner, act, label, extra='': f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{label}" style="flex: none; height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; {extra}"><span style="height: 36px; box-sizing: border-box; padding: 0 12px; border-radius: 8px; background: {FILL}; display: flex; align-items: center; font-size: 15px; white-space: nowrap; font-variant-numeric: tabular-nums">{inner}</span></button>'
    head = (f'<div style="display: flex; align-items: center; gap: 8px; min-height: 44px">'
            + pill('<span style="overflow: hidden; text-overflow: ellipsis; font-weight: 600">{{x.name}}</span>', 'x.openTag', 'Section: {{x.name}}', 'flex: 0 1 160px; min-width: 0').replace('height: 36px; box-sizing', 'width: 100%; height: 36px; box-sizing')
            + pill('{{x.rep}}', 'x.repUp', 'Plays {{x.rep}}') + pill('{{x.vari}}', 'x.varUp', '{{x.vari}}')
            + f'<button type="button" onClick="{{{{x.del}}}}" aria-label="Delete {{{{x.name}}}}" data-tip="Delete section" style="flex: none; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{TRASHI}</button>'
            + f'<span style="flex: 1"></span><span aria-label="Move {{{{x.name}}}}" style="flex: none; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: {SOFT}; cursor: grab">{GRIP}</span></div>')
    tag = f'<sc-if value="{{{{x.tagOn}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{x.openTag}}}}" aria-label="On the Genos: {{{{x.tag}}}}" style="align-self: flex-start; max-width: 100%; height: 44px; margin: -6px 0 -2px; padding: 0; border: 0; background: transparent; font: inherit; color: {INK}"><span style="height: 30px; padding: 0 12px; border-radius: 8px; box-shadow: inset 0 0 0 1px {LINE}; display: flex; align-items: center; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{x.tag}}}}</span></button></sc-if>'
    return (f'<div style="display: flex; flex-direction: column; gap: 16px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px"><span style="font-size: 22px; font-weight: 600">My verse and chorus</span><sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}"><span style="font-size: 13px; font-weight: 600; color: #7A5418">Draft</span></sc-if><span style="display: inline-flex; align-items: center; gap: 8px; align-self: center; font-size: 13px; font-weight: 600; color: {SOFT}"><span style="width: 8px; height: 8px; border-radius: 4px; background: #3F7A4A"></span>Live</span></div>'
            f'<sc-for list="{{{{sec59}}}}" as="x" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 8px">{head}{tag}'
            f'<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: {gap}px">{box}{plusb}</div></section></sc-for>'
            + ADDCARD('Add section', 'addSec') + '</div>')

POP59 = lambda lbl, act, w, name: f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{name}: {{{{{lbl}}}}}" style="flex: none; min-width: {w}px; height: 44px; padding: 0 12px 0 12px; border: 0; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px">{{{{{lbl}}}}}<span style="display: flex; color: {SOFT}">{CHEV_D}</span></button>'
ROW59 = lambda label, inner: ('raw', f'<div style="min-height: 56px; box-sizing: border-box; display: flex; align-items: center; gap: 8px; padding: 6px 12px 6px 16px"><span style="flex: 1; font-size: 16px">{label}</span>{inner}</div>')
SUGG59 = f'<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{suggest59}}}}" as="s" hint-placeholder-count="8"><button type="button" onClick="{{{{s.pick}}}}" style="height: 44px; min-width: 0; border: 0; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 17px; font-weight: 500">{{{{s.r}}}}<sup style="font-size: max(12px, .6em); vertical-align: .55em">{{{{s.x}}}}</sup>{{{{s.b}}}}</button></sc-for></div>'
QBTN = lambda svg, label, act: f'<button type="button" onClick="{{{{{act}}}}}" style="flex: 1; min-width: 0; height: 44px; padding: 0 12px; border: 0; border-radius: 10px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap">{svg}{label}</button>'
CP_CHORD59 = (GROUP(ROW59('Chord', POP59('rootPopL', 'openRootPop', 72, 'Root') + POP59('qualPopL', 'openQualPop', 120, 'Quality')),
                    ROW59('Bass note', POP59('bassPopL', 'openBassPop', 136, 'Bass note')), ('step', 'Duration', 'selLen', 'lenDn', 'lenUp'))
              + f'<sc-if value="{{{{rootPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{ROOTGRID("chordRoots")}</sc-if>'
              + f'<sc-if value="{{{{qualPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("qualChips")}</sc-if>'
              + f'<sc-if value="{{{{bassPopOn}}}}" hint-placeholder-val="{{{{false}}}}">{CHIPROW("bassChips")}</sc-if>'
              + LABELLED('Suggested chords', SUGG59)
              + f'<div style="display: flex; gap: 8px"><button type="button" onClick="{{{{removeChord}}}}" aria-label="Delete chord" data-tip="Delete chord" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 10px; background: #F4DCD6; color: #B3261E; display: flex; align-items: center; justify-content: center">{TRASHI}</button>'
              + QBTN(DUPI, 'Duplicate', 'duplicate') + QBTN(PLAYS, 'Play from here', 'playFrom') + '</div>')


# ── the Genos's style strip, over the dock while Follow a MIDI arranger is on ──
LAMP = lambda key, label, act, w='auto': f'<button type="button" onClick="{{{{{act}}}}}" style="flex: none; min-width: 44px; width: {w}; height: 36px; padding: 0 9px; border: 0; border-radius: 9px; background: {{{{{key}.bg}}}}; color: {{{{{key}.fg}}}}; box-shadow: {{{{{key}.ring}}}}; font: inherit; font-size: 13px; font-weight: 700; white-space: nowrap">{label}</button>'
LAMPS = lambda lst, pre: f'<sc-for list="{{{{{lst}}}}}" as="l" hint-placeholder-count="3"><button type="button" onClick="{{{{l.pick}}}}" style="flex: none; min-width: 44px; height: 36px; padding: 0 9px; border: 0; border-radius: 9px; background: {{{{l.bg}}}}; color: {{{{l.fg}}}}; box-shadow: {{{{l.ring}}}}; font: inherit; font-size: 13px; font-weight: 700; white-space: nowrap">{pre}{{{{l.n}}}}</button></sc-for>'
GRPL = lambda label, inner: f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: {SOFT}">{label}</span><div style="display: flex; gap: 4px">{inner}</div></div>'
STRIP = (f'<sc-if value="{{{{arOn}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Genos style controls" style="flex: none; display: flex; flex-direction: column; gap: 8px; padding: 8px 0 10px">'
         f'<div style="display: flex; align-items: center; gap: 8px; padding: 0 16px"><span style="width: 8px; height: 8px; border-radius: 4px; background: #44684A"></span><span style="font-size: 13px; font-weight: 600">{{{{arTitle}}}}</span></div>'
         f'<div class="nos" style="display: flex; gap: 16px; overflow-x: auto; padding: 0 16px">'
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
# Start/Stop one width in the full and the compact strip (it was 96 in one and 88 in the other)
START59 = LAMP59('arStart', 'Start/Stop', 'togglePlay').replace('min-width: 44px', 'flex: none; min-width: 88px', 1)
LAMPS59 = lambda lst, spoken: f'<sc-for list="{{{{{lst}}}}}" as="l" hint-placeholder-count="3"><button type="button" onClick="{{{{l.pick}}}}" aria-pressed="{{{{l.on}}}}" aria-label="{spoken} {{{{l.n}}}}" style="min-width: 44px; height: 40px; padding: 0 6px; border: 0; border-radius: 9px; background: {{{{l.bg}}}}; color: {{{{l.fg}}}}; box-shadow: {{{{l.ring}}}}; font: inherit; font-size: 14px; font-weight: 700">{{{{l.n}}}}</button></sc-for>'
CAP59 = lambda t: f'<span style="font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: {SOFT}">{t}</span>'
GRP59 = lambda label, cols, inner, grow='1': f'<div role="group" aria-label="{label}" style="flex: {grow} 1 0; min-width: 0; display: flex; flex-direction: column; gap: 4px">{CAP59(label)}<div style="display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); gap: 4px">{inner}</div></div>'
HEAD59 = (f'<div style="display: flex; align-items: center; gap: 8px; min-height: 40px"><span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>'
          f'<span aria-live="polite" style="flex: 1; min-width: 0; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{arTitle}}}}</span>'
          + START59 + '</div>')
MAINS59 = GRP59('Main', 5, LAMPS59('arMains', 'Main') + LAMP59('arBreak', 'Break', 'tBreak'), '5')
INTRO59 = GRP59('Intro', 3, LAMPS59('arIntros', 'Intro'), '3')
END59 = GRP59('Ending/rit.', 3, LAMPS59('arEndings', 'Ending'), '3')
STRIP59 = lambda pos, wide: (f'<sc-if value="{{{{arOn}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Genos style controls" style="{pos} z-index: 40; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; padding: 8px 12px 12px; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}">'
    + HEAD59 + (f'<div style="display: flex; gap: 16px">{INTRO59}{MAINS59}{END59}</div>' if wide else f'{MAINS59}<div style="display: flex; gap: 12px">{INTRO59}{END59}</div>') + '</div></sc-if>')
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
CP58 = CP58.replace("    return { ...common(st, set), sec59,", r"""    const LAY0 = { keys: { at: 'bottom', size: 'M', hid: false }, genos: { at: 'right', mode: 'compact', hid: false }, dock: { at: 'float', mode: 'full', hid: false }, chords: { at: 'right', size: 'Wide', hid: false } };
    const LAY = st.lay || LAY0, layEd = !!st.editLay, custom = JSON.stringify(LAY) !== JSON.stringify(LAY0);
    const setP = (k, o) => set({ lay: { ...LAY, [k]: { ...LAY[k], ...o } }, sheet: st.sheet === 'layMenu' ? 'layMenu' : st.sheet });
    const kP = LAY.keys, gP = LAY.genos, dP = LAY.dock, cP = LAY.chords, KH = { S: 72, M: 112, L: 168 }, KHL = { S: 110, M: 170, L: 240 };
    const cap1 = (w) => w.charAt(0).toUpperCase() + w.slice(1);
    const kOn = !kP.hid, gOn = follow && !gP.hid, base = 34 + (kOn && kP.at === 'bottom' ? KH[kP.size] : 0);
    const dFloat = !dP.hid && dP.at === 'float', dockB = base + 12, gFloatB = dockB + (dFloat && dP.mode === 'full' ? 76 : 0) + (layEd && dFloat ? 32 : 0);
    const gH = gP.mode === 'full' ? 196 : gP.mode === 'compact' ? 64 : 52;
    const NAMES = { keys: 'Keys', genos: 'Genos', dock: 'Controls', chords: 'Chords' };
    const lp = st.layP || 'keys', lpP = LAY[lp];
    const PLACES = { keys: ['Top', 'Bottom'], genos: ['Top', 'Float', 'Bottom', 'Left', 'Right'], dock: ['Top', 'Float'], chords: ['Left', 'Right'] };
    const SIZES = { keys: [['S', 'Small'], ['M', 'Medium'], ['L', 'Large']], genos: [['full', 'Full'], ['compact', 'Compact'], ['min', 'Minimized']], dock: [['full', 'Full'], ['min', 'Play only']], chords: [['Narrow', 'Narrow'], ['Wide', 'Wide']] };
    const sizeKey = { keys: 'size', genos: 'mode', dock: 'mode', chords: 'size' }[lp];
    const sheetsL = st.sheetName || 'My verse and chorus';
    const picked = st.dragP || null;
    const zone = (at) => () => { if (picked) set({ lay: { ...LAY, [picked]: { ...LAY[picked], at } }, dragP: null, toastT: NAMES[picked] + ' moved to the ' + at }); };
    return { ...common(st, set), sec59,
      layEdit: layEd, layNot: !layEd, layCustom: custom, layResetL: custom ? 'Customised' : 'As it came',
      openLay: () => set({ editLay: true, sheet: null }), doneLay: () => set({ editLay: false, dragP: null, sheet: null }),
      resetLay: () => set({ lay: LAY0, sheet: null, dragP: null, toastT: 'Layout reset', lastLay: LAY }), undoLay: () => set({ lay: st.lastLay || LAY0, toastT: null, lastLay: null }),
      kTop: kOn && kP.at === 'top', kBot: kOn && kP.at === 'bottom', kS: kP.size === 'S', kM: kP.size === 'M', kL: kP.size === 'L', kGrow: () => setP('keys', { size: { S: 'M', M: 'L', L: 'S' }[kP.size] }), kSizeL: { S: 'Small', M: 'Medium', L: 'Large' }[kP.size],
      gOnP: gOn, gTop: gOn && gP.at === 'top', gBot: gOn && gP.at === 'bottom', gFloat: gOn && (gP.at === 'float' || gP.at === 'left' || gP.at === 'right'),
      gTopL: gOn && gP.at === 'top', gLeft: gOn && gP.at === 'left', gRight: gOn && gP.at === 'right', gFloatL: gOn && gP.at === 'float', gBotL: gOn && gP.at === 'bottom',
      gFull: gP.mode === 'full', gCompact: gP.mode === 'compact', gMin: gP.mode === 'min', gMinT: () => setP('genos', { mode: 'min' }), gFullT: () => setP('genos', { mode: 'full' }), gCompactT: () => setP('genos', { mode: 'compact' }),
      gFloatPos: 'left: 16px; right: ' + (dP.mode === 'min' && dFloat ? '92px' : '16px') + '; bottom: ' + gFloatB + 'px', gMinPos: 'left: 16px; bottom: ' + gFloatB + 'px',
      arMainL: 'Main ' + ar.main,
      dFloatFull: dFloat && dP.mode === 'full', dFloatMin: dFloat && dP.mode === 'min', dTop: !dP.hid && dP.at === 'top', dockPos: 'bottom: ' + dockB + 'px',
      chartPad: (base + (dFloat ? 80 : 0) + (gOn && gP.at !== 'top' && gP.at !== 'bottom' ? gH + 8 : 0) + 16) + 'px',
      cOn: !cP.hid, cLeft: !cP.hid && cP.at === 'left', cRight: !cP.hid && cP.at === 'right',
      sideL: (!cP.hid && cP.at === 'left') || (gOn && gP.at === 'left'), sideR: (!cP.hid && cP.at === 'right') || (gOn && gP.at === 'right'), sideW: cP.size === 'Narrow' ? '320px' : '420px',
      kHL: KHL[kP.size] + 'px', chartCols: ((!cP.hid && cP.at === 'left') || (gOn && gP.at === 'left')) && ((!cP.hid && cP.at === 'right') || (gOn && gP.at === 'right')) ? 8 : 16,
      hiddenPanels: Object.keys(LAY).filter((k) => LAY[k].hid && (k !== 'genos' || follow)).map((k) => ({ l: NAMES[k], show: () => setP(k, { hid: false }) })),
      anyHidden: layEd && Object.keys(LAY).some((k) => LAY[k].hid && (k !== 'genos' || follow)),
      layMenuOn: st.sheet === 'layMenu', layMenuT: NAMES[lp], layMenuPos: st.layPos ?? 'left: 16px; top: 160px',
      openLayK: (e) => set({ sheet: 'layMenu', layP: 'keys', layPos: ANCHOR(e, 230) }), openLayG: (e) => set({ sheet: 'layMenu', layP: 'genos', layPos: ANCHOR(e, 230) }),
      openLayD: (e) => set({ sheet: 'layMenu', layP: 'dock', layPos: ANCHOR(e, 230) }), openLayC: (e) => set({ sheet: 'layMenu', layP: 'chords', layPos: ANCHOR(e, 230) }),
      placeSeg: SEGT(PLACES[lp].filter((w) => !(st.phoneLay && (w === 'Left' || w === 'Right'))), cap1(lpP.at), (l) => setP(lp, { at: l.toLowerCase() })),
      placeSegP: SEGT(PLACES[lp].filter((w) => w !== 'Left' && w !== 'Right'), lpP.at === 'left' || lpP.at === 'right' ? 'Float' : cap1(lpP.at), (l) => setP(lp, { at: l.toLowerCase() })),
      sizeSeg: SEGT(SIZES[lp].map((x) => x[1]), (SIZES[lp].find((x) => x[0] === lpP[sizeKey]) || SIZES[lp][0])[1], (l) => setP(lp, { [sizeKey]: SIZES[lp].find((x) => x[1] === l)[0] })),
      hideP: () => set({ lay: { ...LAY, [lp]: { ...lpP, hid: true } }, sheet: null, toastT: NAMES[lp] + ' hidden. Edit layout shows it again' }),
      pickK: () => set({ dragP: picked === 'keys' ? null : 'keys' }), pickG: () => set({ dragP: picked === 'genos' ? null : 'genos' }), pickD: () => set({ dragP: picked === 'dock' ? null : 'dock' }), pickC: () => set({ dragP: picked === 'chords' ? null : 'chords' }),
      dragOn: !!picked, dragT: picked ? 'Tap where ' + NAMES[picked] + ' goes' : '',
      zTop: picked && PLACES[picked].includes('Top'), zBot: picked && PLACES[picked].includes('Bottom'), zFloat: picked && PLACES[picked].includes('Float'), zLeft: picked && PLACES[picked].includes('Left'), zRight: picked && PLACES[picked].includes('Right'),
      toTop: zone('top'), toBot: zone('bottom'), toFloat: zone('float'), toLeft: zone('left'), toRight: zone('right'),
      mk1: sheetsL === 'My verse and chorus' ? '✓' : '', mk2: sheetsL === 'Blues in F' ? '✓' : '', mk3: sheetsL === 'Autumn Leaves sketch' ? '✓' : '',
      sheetsL, sheetsOn: st.sheet === 'sheets', openSheets: (e) => set({ sheet: 'sheets', menuPos: ANCHOR(e, 280) }),
      openS1: () => set({ sheet: null, sheetName: 'My verse and chorus' }), openS2: () => set({ sheet: null, sheetName: 'Blues in F', toastT: 'Opened Blues in F' }), openS3: () => set({ sheet: null, sheetName: 'Autumn Leaves sketch', toastT: 'Opened Autumn Leaves sketch' }),
      newSheet: () => set({ sheet: null, sheetName: 'Untitled sheet', toastT: 'New sheet' }),
      toastOn: !!st.toastT, toastT: st.toastT ?? '', toastUndo: !!st.lastLay, undo: () => set({ lay: st.lastLay || LAY0, toastT: null, lastLay: null }),""", 1)
assert CP58.count('LAY0') >= 4, 'R76 JS patch missed'
CP58 = CP58.replace("states: [{ l: 'Following the Genos', bg: follow ? '#332921' : '#EEE9E2', pick: () => set({ follow: !follow }) }],",
  "states: [{ l: 'Following the Genos', bg: follow ? '#332921' : '#EEE9E2', pick: () => set({ follow: !follow }) }, { l: 'Edit layout', bg: st.editLay ? '#332921' : '#EEE9E2', pick: () => set({ editLay: !st.editLay, dragP: null }) }, { l: 'Genos minimized', bg: (st.lay && st.lay.genos.mode === 'min') ? '#332921' : '#EEE9E2', pick: () => set({ follow: true, lay: { ...(st.lay || {}), keys: (st.lay || {}).keys || { at: 'bottom', size: 'M', hid: false }, dock: (st.lay || {}).dock || { at: 'float', mode: 'full', hid: false }, chords: (st.lay || {}).chords || { at: 'right', size: 'Wide', hid: false }, genos: { at: 'right', hid: false, mode: (st.lay && st.lay.genos.mode === 'min') ? 'full' : 'min' } } }) }],", 1)
assert 'Genos minimized' in CP58

# the sheet's name opens the sheets: the last opened first, as it opens on (a chart opens where it was left)
CHEVD20 = CHEV_D
TITLE76 = (f'<button type="button" data-menuroot-anchor onClick="{{{{openSheets}}}}" aria-label="Chord sheet: {{{{sheetsL}}}}. Open another" style="flex: 0 1 auto; min-width: 0; height: 44px; margin: -6px 0; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; gap: 4px">'
           f'<span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 22px; font-weight: 600">{{{{sheetsL}}}}</span><span style="flex: none; color: {SOFT}; display: flex">{CHEVD20}</span></button>')
_t0 = '<span style="font-size: 22px; font-weight: 600">My verse and chorus</span>'
assert _t0 in CHART59(8, 4, 60, 21, 2)
CHART76 = lambda *a: CHART59(*a).replace(_t0, TITLE76, 1)
SHEETS76 = ROWMENU('sheetsOn', 'Chord sheets', [('action', 'My verse and chorus<span style="margin-left: auto; font-weight: 700">{{mk1}}</span>', 'openS1'), ('action', 'Blues in F<span style="margin-left: auto; font-weight: 700">{{mk2}}</span>', 'openS2'), ('action', 'Autumn Leaves sketch<span style="margin-left: auto; font-weight: 700">{{mk3}}</span>', 'openS3'), ('action', 'New sheet', 'newSheet'), ('link', 'All chord sheets', '', 'Progressions.dc.html')], 'menuPos', 260)

# a panel's tag in Edit layout: the grip (drag it, or tap it and tap a place) and its name, opening its menu
GRIPB = lambda pick, name: f'<button type="button" onClick="{{{{{pick}}}}}" aria-label="Move {name}" data-tip="Drag, or tap then tap a place" style="flex: none; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; cursor: grab">{GRIP}</button>'
def PTAG(pick, menu, name, pos='left: 8px; top: 8px'):
    return (f'<sc-if value="{{{{layEdit}}}}" hint-placeholder-val="{{{{false}}}}"><div aria-hidden="true" style="position: absolute; inset: 2px; z-index: 44; border-radius: 12px; outline: 2px dashed #B98A32; outline-offset: -2px; pointer-events: none"></div>'
            f'<div data-menuroot-anchor style="position: absolute; {pos}; z-index: 45; height: 44px; box-sizing: border-box; padding: 0 4px 0 0; border-radius: 22px; {GLASSFX}; display: flex; align-items: center">'
            + GRIPB(pick, name) + f'<button type="button" onClick="{{{{{menu}}}}}" aria-label="{name}: place, size or hide" style="height: 44px; padding: 0 8px 0 0; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px">{name}{CHEV_D}</button></div></sc-if>')
LAYMENU = MENUSHELL('layMenuOn', '{{layMenuT}}',
    f'<div style="padding: 6px 8px 2px; font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: {SOFT}">Place</div><div style="display: grid; padding: 0 4px">{{PLACE}}</div>'
    f'<div style="padding: 10px 8px 2px; font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: {SOFT}">Size</div><div style="display: grid; padding: 0 4px 6px">{SEGC("sizeSeg", 40, 13)}</div>'
    f'<div role="separator" style="height: 1px; margin: 4px 12px; background: {LINE}"></div><button type="button" role="menuitem" onClick="{{{{hideP}}}}" style="width: 100%; height: 44px; border: 0; border-radius: 10px; background: transparent; padding: 0 12px; text-align: left; color: {INK}; font: inherit; font-size: 16px">Hide</button>',
    'layMenuPos', 300)
LAYMENU_P = LAYMENU.replace('{PLACE}', SEGC('placeSegP', 40, 13))
LAYMENU_L = LAYMENU.replace('{PLACE}', SEGC('placeSeg', 40, 13))
# while a panel is picked, the places it may go light up as honey zones; a tap there puts it there
ZONE = lambda cond, act, label, pos: f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{{act}}}}}" aria-label="Put it {label}" style="position: absolute; {pos}; z-index: 46; border: 2px dashed #B98A32; border-radius: 14px; background: rgba(237,198,132,.28); color: {INK}; font: inherit; font-size: 15px; font-weight: 700">{label}</button></sc-if>'
DRAGHINT = f'<sc-if value="{{{{dragOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 50%; top: 100px; transform: translateX(-50%); z-index: 47; height: 36px; padding: 0 14px; border-radius: 18px; background: {INK}; color: {SHEET}; display: flex; align-items: center; font-size: 14px; font-weight: 600; white-space: nowrap">{{{{dragT}}}}</div></sc-if>'
TRAY = (f'<sc-if value="{{{{anyHidden}}}}" hint-placeholder-val="{{{{false}}}}"><div style="flex: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 8px"><span style="font-size: 14px; color: {SOFT}">Hidden</span>'
        f'<sc-for list="{{{{hiddenPanels}}}}" as="h" hint-placeholder-count="1"><button type="button" onClick="{{{{h.show}}}}" style="height: 44px; padding: 0 14px; border: solid transparent; border-width: 4px 0; background-clip: padding-box; border-radius: 22px; background-color: {FILL}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600">+ {{{{h.l}}}}</button></sc-for></div></sc-if>')
BARR = (f'<sc-if value="{{{{layNot}}}}" hint-placeholder-val="{{{{true}}}}">' + UNDOB + GEAR() + DOTSB + '</sc-if>'
        + f'<sc-if value="{{{{layEdit}}}}" hint-placeholder-val="{{{{false}}}}">' + TB('Reset', 'resetLay') + TB('Done', 'doneLay') + '</sc-if>')

# the Genos, three sizes: Full (every control), Compact (Start/Stop and Main A–D in a row), Minimized (a pill)
MINI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M5 12h14"></path></svg>'
EXPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m18 15-6-6-6 6"></path></svg>'
ICB = lambda act, label, svg: f'<button type="button" onClick="{{{{{act}}}}}" aria-label="{label}" data-tip="{label}" style="flex: none; width: 44px; height: 44px; margin: -2px -6px -2px 0; padding: 0; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{svg}</button>'
HEAD76 = HEAD59[:-len('</div>')] + ICB('gCompactT', 'Compact', EXPI.replace('m18 15-6-6-6 6', 'm6 9 6 6 6-6')) + ICB('gMinT', 'Minimize', MINI) + '</div>'
CARDST = f'box-sizing: border-box; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}'
def GENOS76(pos, wide):
    full = (f'<sc-if value="{{{{gFull}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Genos style controls" style="position: relative; display: flex; flex-direction: column; gap: 8px; padding: 8px 12px 12px; {CARDST}">'
            + HEAD76 + (f'<div style="display: flex; gap: 16px">{INTRO59}{MAINS59}{END59}</div>' if wide else f'{MAINS59}<div style="display: flex; gap: 12px">{INTRO59}{END59}</div>') + PTAG('pickG', 'openLayG', 'Genos', 'right: 8px; top: -22px') + '</div></sc-if>')
    comp = (f'<sc-if value="{{{{gCompact}}}}" hint-placeholder-val="{{{{false}}}}"><div role="toolbar" aria-label="Genos style controls" style="position: relative; height: 64px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 12px; {CARDST}">'
            f'<span style="flex: none; width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>'
            + START59
            + f'<div role="group" aria-label="Main" style="flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px">{LAMPS59("arMains", "Main")}</div>'
            + ICB('gFullT', 'Full', EXPI) + ICB('gMinT', 'Minimize', MINI) + PTAG('pickG', 'openLayG', 'Genos', 'right: 8px; top: -22px') + '</div></sc-if>')
    pill = (f'<sc-if value="{{{{gMin}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{gFullT}}}}" aria-label="Genos, {{{{arMainL}}}}: show its controls" style="position: relative; height: 44px; box-sizing: border-box; padding: 0 12px 0 14px; border: 0; border-radius: 22px; {GLASSFX}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; white-space: nowrap">'
            f'<span style="width: 8px; height: 8px; border-radius: 4px; background: {{{{arDot}}}}"></span>Genos · {{{{arMainL}}}}{ICON(EXPI, 18)}</button></sc-if>')
    return f'<div style="{pos}">{full}{comp}{pill}</div>'

# the Controls: Full (Style · Key · Tempo · Repeats · Play) or Play only, floating or as a row under the bar
DOCKFULL = DOCK(CP_DOCK, '{{dockPos}}')
DOCKFULL = DOCKFULL[:-len('</div>')] + PTAG('pickD', 'openLayD', 'Controls', 'left: 8px; top: -26px') + '</div>'
PLAYONLY = f'<div style="position: absolute; right: 16px; {{{{dockPos}}}}; z-index: 40; width: 68px; height: 68px; border-radius: 34px; {GLASSFX}; display: flex; align-items: center; justify-content: center">{PLAYBTN()}' + PTAG('pickD', 'openLayD', 'Controls', 'right: 0; top: -50px') + '</div>'
DOCKTOP = f'<div role="toolbar" style="position: relative; flex: none; margin: 0 16px 8px; height: 68px; box-sizing: border-box; padding: 0 8px; border-radius: 34px; {GLASSFX}; display: flex; align-items: center; gap: 8px">{CP_DOCK}' + PTAG('pickD', 'openLayD', 'Controls', 'left: 8px; top: 12px') + '</div>'

def KEYS76(h3, top, lap=False):
    keys = lambda h: CP_KEYS(h).replace('{{kbw}}', '{{kbwL}}').replace('{{kbb}}', '{{kbbL}}') if lap else CP_KEYS(h)
    grab = f'<sc-if value="{{{{layEdit}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{kGrow}}}}" aria-label="Resize the keys: {{{{kSizeL}}}}" data-tip="Drag to resize" style="position: absolute; left: 50%; {"bottom: -22px" if top else "top: -22px"}; transform: translateX(-50%); z-index: 46; width: 88px; height: 44px; padding: 0; border: 0; background: transparent; display: flex; align-items: center; justify-content: center; cursor: ns-resize"><span style="width: 44px; height: 6px; border-radius: 3px; background: {INK}"></span></button></sc-if>'
    sized = ''.join(f'<sc-if value="{{{{k{z}}}}}" hint-placeholder-val="{{{{{"true" if z == "M" else "false"}}}}}">{keys(h)}</sc-if>' for z, h in zip('SML', h3))
    return f'<div style="position: relative; flex: none; {"margin-bottom: 34px; " if not top and not lap else ""}box-shadow: 0 {"1" if top else "-1"}px 0 {LINE}">{sized}{grab}{PTAG("pickK", "openLayK", "Keys", "left: 8px; " + ("bottom: 8px" if top else "top: 8px"))}</div>'

ph58 = (TOP('Main.dc.html', '', BARR) + TRAY
        + f'<sc-if value="{{{{kTop}}}}" hint-placeholder-val="{{{{false}}}}">{KEYS76((72, 112, 168), True)}</sc-if>'
        + f'<sc-if value="{{{{dTop}}}}" hint-placeholder-val="{{{{false}}}}">{DOCKTOP}</sc-if>'
        + f'<sc-if value="{{{{gTop}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("position: relative; flex: none; margin: 0 16px 8px", False)}</sc-if>'
        + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px {{{{chartPad}}}}; display: flex; flex-direction: column; gap: 16px">{SHOWSTATES()}{CHART76(8, 8, 60, 21, 2)}</main>'
        + f'<sc-if value="{{{{gBot}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("position: relative; flex: none; margin: 8px 16px", False)}</sc-if>'
        + f'<sc-if value="{{{{kBot}}}}" hint-placeholder-val="{{{{true}}}}">{KEYS76((72, 112, 168), False)}</sc-if>'
        + f'<sc-if value="{{{{gFloat}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("position: absolute; z-index: 41; {{gFloatPos}}", False)}</sc-if>'
        + f'<sc-if value="{{{{dFloatFull}}}}" hint-placeholder-val="{{{{true}}}}">{DOCKFULL}</sc-if>'
        + f'<sc-if value="{{{{dFloatMin}}}}" hint-placeholder-val="{{{{false}}}}">{PLAYONLY}</sc-if>'
        + ZONE('zTop', 'toTop', 'At the top', 'left: 16px; right: 16px; top: 112px; height: 96px')
        + ZONE('zFloat', 'toFloat', 'Floating', 'left: 16px; right: 16px; top: 380px; height: 96px')
        + ZONE('zBot', 'toBot', 'At the bottom', 'left: 16px; right: 16px; bottom: 120px; height: 96px') + DRAGHINT)
_sideCol = lambda side: (f'<sc-if value="{{{{side{side}}}}}" hint-placeholder-val="{{{{{"true" if side == "R" else "false"}}}}}"><div class="nos" style="position: relative; flex: none; width: {{{{sideW}}}}; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 4px 0 24px">'
    + f'<sc-if value="{{{{c{"Right" if side == "R" else "Left"}}}}}" hint-placeholder-val="{{{{{"true" if side == "R" else "false"}}}}}"><div style="position: relative; display: flex; flex-direction: column; gap: 16px; padding-top: 4px">{DRAG.replace("margin: 16px 0 -4px", "margin: 0 0 -4px", 1)}{PTAG("pickC", "openLayC", "Chords", "right: 0; top: -8px")}</div></sc-if>'
    + f'<sc-if value="{{{{g{"Right" if side == "R" else "Left"}}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("position: relative", False).replace(", " + SHADOW, "", 3)}</sc-if></div></sc-if>')
lm58 = (LTOP('Laptop.dc.html', BARR) + TRAY.replace('padding: 0 16px 8px', 'padding: 0 56px 8px', 1)
        + f'<sc-if value="{{{{kTop}}}}" hint-placeholder-val="{{{{false}}}}">{KEYS76((110, 170, 240), True, True)}</sc-if>'
        + '<div style="position: relative; flex: 1; min-height: 0; display: flex; gap: 40px; padding: 0 40px 0 56px">' + _sideCol('L')
        + '<div style="position: relative; flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column">'
        + f'<sc-if value="{{{{dTop}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; justify-content: center; padding: 0 0 8px">{DOCKTOP.replace("margin: 0 16px 8px", "width: 560px", 1)}</div></sc-if>'
        + f'<sc-if value="{{{{gTopL}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("position: relative; flex: none; margin: 0 0 12px", True)}</sc-if>'
        + '<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 4px 200px">' + SHOWSTATES() + CHART76('{{chartCols}}', 6, 76, 28, 1) + '</div>'
        + f'<div style="position: absolute; left: 0; right: 0; bottom: 12px; z-index: 40; display: flex; flex-direction: column; align-items: center; gap: 8px">'
        + f'<sc-if value="{{{{gFloatL}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("width: 760px", True)}</sc-if>'
        + f'<sc-if value="{{{{dFloatFull}}}}" hint-placeholder-val="{{{{true}}}}"><div style="position: relative">{DOCK_L(CP_DOCK)}{PTAG("pickD", "openLayD", "Controls", "left: 16px; top: -26px")}</div></sc-if>'
        + f'<sc-if value="{{{{dFloatMin}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: relative; align-self: flex-end; margin-right: 16px; width: 68px; height: 68px; border-radius: 34px; {GLASSFX}; display: flex; align-items: center; justify-content: center">{PLAYBTN()}{PTAG("pickD", "openLayD", "Controls", "right: 0; top: -50px")}</div></sc-if>'
        + '</div>'
        + f'<sc-if value="{{{{gBotL}}}}" hint-placeholder-val="{{{{false}}}}">{GENOS76("position: relative; flex: none; margin: 0 0 12px", True)}</sc-if>'
        + '</div>' + _sideCol('R') + '</div>'
        + f'<sc-if value="{{{{kBot}}}}" hint-placeholder-val="{{{{true}}}}">{KEYS76((110, 170, 240), False, True)}</sc-if>'
        + ZONE('zLeft', 'toLeft', 'On the left', 'left: 56px; top: 120px; bottom: 260px; width: 300px')
        + ZONE('zRight', 'toRight', 'On the right', 'right: 40px; top: 120px; bottom: 260px; width: 300px')
        + ZONE('zTop', 'toTop', 'At the top', 'left: 400px; right: 380px; top: 110px; height: 100px')
        + ZONE('zFloat', 'toFloat', 'Floating', 'left: 400px; right: 380px; bottom: 270px; height: 100px')
        + ZONE('zBot', 'toBot', 'At the bottom', 'left: 400px; right: 380px; bottom: 150px; height: 100px') + DRAGHINT)
SH58 = lambda B, P, D=None: (B('chordOn58', '{{selSym}}', CP_CHORD59) + B('tagOnSheet', '{{tagTitle}}', CP_TAG) + B('shareOn', 'Share', CP_SHARE) + (D or B)('styleOn', 'Style', WHEEL([('wStyle', 1)])) + (D or B)('keyOn', 'Key', WHEEL([('wKey', 1)])) + (D or B)('tempoOn', 'Tempo', WHEEL([('wTempo', 1)])) + (D or B)('repOn', 'Repeats', WHEEL([('wRep', 1)])) + B('setOn', 'Chord player settings', CP_SET58) + P + '')
_MI = lambda l, a, col=INK: f'<button type="button" role="menuitem" onClick="{{{{{a}}}}}" style="width: 100%; height: 44px; box-sizing: border-box; border: 0; border-radius: 10px; background: transparent; padding: 0 12px; display: flex; align-items: center; color: {col}; font: inherit; font-size: 16px; text-align: left">{l}</button>'
MORE76 = MENUSHELL('moreOn', 'Chord sheet', f'<sc-if value="{{{{draftOn}}}}" hint-placeholder-val="{{{{false}}}}">' + _MI('Save', 'saveDraft') + _MI('Discard draft', 'discardDraft', RED) + f'<div role="separator" style="height: 1px; margin: 6px 12px; background: {LINE}"></div></sc-if>'
                   + _MI('Share…', 'openShare') + _MI('Edit layout', 'openLay') + _MI('Save to my progressions', 'saveProg')
                   + '<a role="menuitem" href="Progressions.dc.html" style="width: 100%; height: 44px; box-sizing: border-box; border-radius: 10px; padding: 0 12px; display: flex; align-items: center; color: ' + INK + '; font-size: 16px; text-decoration: none">Open in Progressions</a>', 'menuPos', 260)
TOAST76 = TOASTS.replace('bottom: 40px', 'bottom: 256px')
detail('ChordPlayer', 'Chord player', CP58, ph58 + TOAST76, lm58 + TOASTL.replace('bottom: 28px', 'bottom: 296px'), '', SH58(BSHEET, CP_PSHEET) + MORE76 + SHEETS76 + LAYMENU_P,
       (SH58(lambda c, t, b: POPOVER(c, t, b, 'left: 140px; top: 160px', 460), CP_PPOP, lambda c, t, b: POPOVER(c, t, b, 'left: 580px; bottom: 300px', 320)) + MORE76 + SHEETS76 + LAYMENU_L).replace('Progressions.dc.html', 'ProgressionsLaptop.dc.html'))
