# R44: the score editor as the Player in Edit mode (owner, 2026-11-11: "improve all the settings, all the pages … the
# most time on the editor and songs and practice pages"). CLAUDE.md: "the Player's score in Edit mode, sharing its bar
# and transport. A docked panel from 48rem, a bottom sheet on a phone." So the editor wears the Player's light glass
# bar with a Play · Edit switch, full screen on a laptop (no app sidebar, as the Player); under the score a selection
# strip says what is chosen and acts on it (Delete, the piano, Play from here); the palette is Flat's: named
# categories, folded to one row on a phone, every section in one scroll when opened or docked; each tool a real
# notation sign with its name and shortcut in the tooltip. Exec'd by r41.py after r41_songs.py (its kit is in scope).
import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as PS

GL = GLASSFX
XI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M18 6 6 18M6 6l12 12"></path></svg>'
EXPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m18 15-6-6-6 6"></path></svg>'

ED4 = js(r'''
    // the palette, Flat's categories; each tool: its sign, the font it is drawn in, its name and its shortcut
    const M = 'music', S = 'serif', T = 'text';
    const PAL = [
      ['Notes', [['mrep', 'Replace', T, 'Replace', 'I'], ['mins', 'Insert', T, 'Insert', 'I'], ['mchd', 'Chord', T, 'Chord', 'I'], ['v2', 'Voice 2', T, 'Voice 2', '⇧V'], ['rest', '𝄽', M, 'Rest', '8'], ['w', '𝅝', M, 'Whole note', '1'], ['h', '𝅗𝅥', M, 'Half note', '2'], ['q', '𝅘𝅥', M, 'Quarter note', '3'], ['e', '𝅘𝅥𝅮', M, 'Eighth note', '4'],
        ['s', '𝅘𝅥𝅯', M, '16th note', '5'], ['t', '𝅘𝅥𝅰', M, '32nd note', '6'], ['x', '𝅘𝅥𝅱', M, '64th note', '7'], ['dot', '𝅘𝅥 .', M, 'Dotted', '.'], ['ddot', '𝅘𝅥 ..', M, 'Double dotted', '⌥.'], ['tie', '⁀', T, 'Tie', ','], ['tup', '3', S, 'Triplet', '⇧3'], ['grace', '𝆕', M, 'Grace note', '9'], ['rpt', '𝄎', M, 'Repeat', '⇧R']]],
      ['Pitch', [['bb', '𝄫', M, 'Double flat', '⇧-'], ['b', '♭', M, 'Flat', '−'], ['n', '♮', M, 'Natural', '0'], ['sh', '♯', M, 'Sharp', '='], ['x2', '𝄪', M, 'Double sharp', '⇧+'], ['8va', '8va', S, 'Octave higher', '⌘⇧8'], ['8vb', '8vb', S, 'Octave lower', '⌘⇧9'], ['xup', 'up', T, 'Cross to upper staff', '⌘⇧↑'], ['xdn', 'down', T, 'Cross to lower staff', '⌘⇧↓']]],
      ['Articulations', [['stacc', '•', T, 'Staccato', 'S'], ['acc', '>', S, 'Accent', 'A'], ['ten', '–', S, 'Tenuto', 'N'], ['marc', '^', S, 'Marcato', '⇧A'], ['ferm', '𝄐', M, 'Fermata', 'F'], ['stiss', '▾', T, 'Staccatissimo', '⇧S'], ['slur', '⌒', T, 'Slur', '⇧S'], ['fing', '1', S, 'Fingering', '']]],
      ['Ornaments', [['trill', 'tr', S, 'Trill', '⇧T'], ['mord', '𝆝', M, 'Mordent', ''], ['turn', '𝆗', M, 'Turn', ''], ['gliss', '⟋', T, 'Glissando', ''], ['trem', '𝄏', M, 'Tremolo', '']]],
      ['Dynamics', [['ppp', 'ppp', S, 'Pianississimo', ''], ['pp', 'pp', S, 'Pianissimo', ''], ['p', 'p', S, 'Piano', ''], ['mp', 'mp', S, 'Mezzo-piano', ''], ['mf', 'mf', S, 'Mezzo-forte', ''],
        ['f', 'f', S, 'Forte', ''], ['ff', 'ff', S, 'Fortissimo', ''], ['fff', 'fff', S, 'Fortississimo', ''], ['sfz', 'sfz', S, 'Sforzando', ''], ['cresc', '𝆒', M, 'Crescendo', '⇧<'], ['dim', '𝆓', M, 'Diminuendo', '⇧>'], ['ped', '𝆮', M, 'Pedal', '⇧P']]],
      ['Bars', [['addbar', '+ Bar', T, 'Add bar after', '⌥Enter'], ['brk', '↵', T, 'System break', '⌘Enter'], ['tempo', '♩ = 80', T, 'Tempo', ''], ['dbl', '𝄁', M, 'Double barline', ''], ['fin', '𝄂', M, 'Final barline', '']]],
      ['Clef', [['clef', '𝄞', M, 'Treble clef', ''], ['bclef', '𝄢', M, 'Bass clef', ''], ['aclef', '𝄡', M, 'Alto clef', '']]],
      ['Key', [['key', '♯', M, 'Key signature', '']]],
      ['Time', [['time', '3/4', S, 'Three four', ''], ['time44', '4/4', S, 'Four four', ''], ['time68', '6/8', S, 'Six eight', '']]],
      ['Repeats', [['rs', '𝄆', M, 'Repeat start', ''], ['re', '𝄇', M, 'Repeat end', ''], ['end1', '1.', S, 'First ending', ''], ['segno', '𝄋', M, 'Segno', ''], ['coda', '𝄌', M, 'Coda', '']]],
      ['Text', [['chord', 'C⁷', S, 'Chord symbol', '⌘K'], ['lyr', 'la', S, 'Lyrics', '⌘L'], ['txt', 'Aa', T, 'Text', '⌘E'], ['rn', 'IV', S, 'Roman numeral', '⌘⇧K'], ['reh', 'A', T, 'Rehearsal mark', '⌘M']]]];

    // the durations, rests and curves drawn as notation, not as a font's glyphs: a head, then the stem and flags
    const HEAD = 'M5.1 19.6c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', ST = 'M14.3 17V3.5', FL = (n) => Array.from({ length: n }, (_, i) => 'M14.3 ' + (3.5 + i * 3.6) + 'c0 3.2 4.6 4 4.4 8.4').join('');
    const ICON = { xup: ['M3.25 19.5c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', 'currentColor', 'M2 3.5h20M12.45 17V9M18 15V6m-2.5 2.5L18 6l2.5 2.5'], xdn: ['M3.25 11.5c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', 'currentColor', 'M2 20.5h20M12.45 9V2.5M18 9v9m-2.5-2.5L18 18l2.5-2.5'], mrep: ['M8.25 17.5c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', 'currentColor', 'M5 3v18M17.45 15V3'], mins: ['M3.25 18c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', 'currentColor', 'M12.45 15.5V3M15 16h6m-2.5-2.5L21 16l-2.5 2.5'], mchd: ['M4.25 20c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3ZM4.25 14.5c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3ZM4.25 9c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', 'currentColor', 'M13.45 17.5V2'], v2: ['M5.25 10.5c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3ZM9.25 17.5c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', 'currentColor', 'M14.45 8V1.5M9.55 16v7'], w: ['M4.2 15.5c0-2 2.9-3.5 6.3-3.5s6.3 1.5 6.3 3.5-2.9 3.5-6.3 3.5-6.3-1.5-6.3-3.5Zm4.1-1.6c-.5 1 .6 2.6 2.4 3.4', 'none', ''],
      h: [HEAD, 'none', ST], q: [HEAD, 'currentColor', ST], e: [HEAD, 'currentColor', ST + FL(1)], s: [HEAD, 'currentColor', ST + FL(2)], t: [HEAD, 'currentColor', ST + FL(3)], x: [HEAD, 'currentColor', ST + FL(4)],
      dot: [HEAD, 'currentColor', ST + 'M19.5 18.5h.01'], rest: ['', 'none', 'M9.5 3.5l4.2 4.6-3.6 4 4.3 4.7c-3.2-1.3-5.6.3-3.3 4.6'],
      tie: ['', 'none', 'M3.5 13.5c4.5 5 12.5 5 17 0'], slur: ['', 'none', 'M3.5 16c3.5-8 13.5-8 17 0'], grace: ['M6.6 20.3c-.5-1.2.7-2.7 2.5-3.3s3.7-.3 4.2.9-.7 2.7-2.5 3.3-3.7.3-4.2-.9Z', 'currentColor', 'M13.6 18.6V6c0 2.4 3.4 3 3.2 6.2M9.5 15.5l7-6'] };
    const DUR = { w: 'Whole note', h: 'Half note', q: 'Quarter note', e: 'Eighth note', s: '16th note', t: '32nd note', x: '64th note' };
    const ACC = { bb: '𝄫', b: '♭', n: '', sh: '♯', x2: '𝄪' };
    const dur = st.dur ?? 'h', acc = st.acc ?? 'n', marks = st.marks ?? [], cat = st.cat ?? 'Recent', open = !!st.open, keys = st.keys ?? true, rest = !!st.rest, mode = st.mode ?? 'mrep', voice = !!st.voice;
    const on = (id) => id === mode || (id === 'v2' && voice) || id === dur || id === acc || (id === 'rest' && rest) || marks.includes(id);
    const FS = { music: 26, serif: 17, text: 17 }, FF = { music: "'Noto Music', serif", serif: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", text: "'Instrument Sans', system-ui, sans-serif" };
    const tile = ([id, g, f, name, key]) => ({ g, name, isSvg: !!ICON[id], isTxt: !ICON[id], hd: (ICON[id] || [''])[0], hf: (ICON[id] || ['', 'none'])[1], sd: (ICON[id] || ['', '', ''])[2], tip: key ? name + ' · ' + key : name, on: on(id), bg: on(id) ? '#EEE9E2' : 'transparent', gbg: on(id) ? '#EEE9E2' : '#FEFDFB', fg: on(id) ? '#332921' : '#685E56', span: !ICON[id] && g.length > 3 ? 2 : 1, hid: 'false', ti: '0',
      ff: FF[f], fs: g.length > 3 ? 14 : (f === 'music' ? FS.music : FS[f]), fst: f === 'serif' && /^[a-z]/.test(g) ? 'italic' : 'normal', fw: f === 'serif' ? 700 : 600,
      pick: () => { if (['mrep', 'mins', 'mchd'].includes(id)) set({ mode: id }); else if (id === 'v2') set({ voice: !voice }); else if (DUR[id]) set({ dur: id, rest: false }); else if (id in ACC) set({ acc: id }); else if (id === 'rest') set({ rest: !rest });
        else if (['addbar', 'time', 'key', 'clef', 'tempo', 'chord', 'lyr', 'txt', 'rn', 'reh'].includes(id)) set({ done: name });
        else set({ marks: marks.includes(id) ? marks.filter((m) => m !== id) : [...marks, id] }); } });
    const CATI = { Recent: ['◷', 'text'], Notes: ['♩', 'music'], Pitch: ['♭♯', 'music'], Articulations: ['>', 'serif'], Ornaments: ['tr', 'serif'], Dynamics: ['ppp', 'serif'], Bars: ['𝄁', 'music'], Clef: ['𝄞', 'music'], Key: ['♯♯', 'music'], Time: ['4/4', 'serif'], Repeats: ['𝄆', 'music'], Text: ['Aa', 'text'] };
    const fill = (ts) => { const n = ts.reduce((a, t) => a + t.span, 0) % 8; return n ? ts.concat(Array.from({ length: 8 - n }, () => ({ g: '', name: '', isSvg: false, isTxt: true, tip: '', on: 'false', gbg: '#FEFDFB', bg: 'transparent', fg: '#685E56', span: 1, hid: 'true', ti: '-1' }))) : ts; };
    // Recent first, as Flat's palette (flat-score-editor 017): the marks used last, each where it lives too
    const ALLT = Object.fromEntries(PAL.flatMap(([, ts]) => ts.map((t) => [t[0], t])));
    const TBIDS = ['rest', 'w', 'h', 'q', 'e', 's', 'dot', 'tie', 'tup', 'n', 'sh', 'b'];
    const REC = (st.recent ?? ['stacc', 'acc', 'slur', 'mf', 'p', 'chord', 'ped', '8va']).filter((id) => ALLT[id]).slice(0, 8).map((id) => ALLT[id]);
    const PALR = [['Recent', REC], ...PAL.map(([c, ts]) => [c, ts.filter((t) => !TBIDS.includes(t[0]))])];
    // each section titled by Flat's name, as the app (Flat's laptop panel, flat-score-editor 099, 121–125)
    const TITLE = { Notes: 'Note', Pitch: 'Pitch and representation', Key: 'Key signature', Time: 'Time signature', Repeats: 'Barlines and repeats' };
    // each group folds by its heading, as Dorico's panels (dorico 142: Immediate Dynamics ⌄)
    const shut = st.shut ?? [];
    const sections = PALR.map(([c, ts]) => ({ c, t: TITLE[c] ?? c, tools: fill(ts.map(tile)), isOpen: !shut.includes(c), rot: shut.includes(c) ? '-90deg' : '0deg', fold: () => set({ shut: shut.includes(c) ? shut.filter((x) => x !== c) : [...shut, c] }) }));
    const NAME = Object.fromEntries(PAL.flatMap(([, ts]) => ts.map((t) => [t[0], t[3].toLowerCase()])));
    const noteL = rest ? DUR[dur].replace('note', 'rest') : 'G' + ACC[acc] + '4 · ' + DUR[dur].toLowerCase();
    const rail = st.rail ?? 'notation', view = st.view ?? VIEW0, zoom = st.zoom ?? 100, pw = st.pw ?? 352, kh = st.kh ?? 150, pal = st.pal ?? true;
    const ZS = [50, 75, 100, 125, 150, 200], zi = ZS.indexOf(zoom);
    const drag = (fn) => (e) => { if (e.type === 'pointermove' && !e.buttons) return; if (e.type === 'pointerdown') { if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); return; }
      const g = e.currentTarget.closest('[data-edgrid]'); if (!g) return; const r = g.getBoundingClientRect(), k = r.width / g.offsetWidth; fn(r, k, e); };
    const tb = (ids) => ids.map((id) => tile(ALLT[id]));
    return { ...common(st, set),
      tbDur: tb(['rest', 'w', 'h', 'q', 'e', 's', 'dot', 'tie', 'tup']), tbAcc: tb(['n', 'sh', 'b']),
      pageOn: view === 'page', panoOn: view === 'pano', viewL: view === 'page' ? 'Panorama' : 'Page view', toggleView: () => set({ view: view === 'page' ? 'pano' : 'page' }),
      views: seg(['Page', 'Panorama'], view === 'page' ? 'Page' : 'Panorama', (l) => set({ view: l === 'Page' ? 'page' : 'pano' })),
      zoomL: zoom + '%', zf: (view === 'page' ? (typeof FIT === 'function' ? FIT(pal, pw) : FIT) : 1) * zoom / 100, zoomIn: () => set({ zoom: ZS[Math.min(ZS.length - 1, zi + 1)] }), zoomOut: () => set({ zoom: ZS[Math.max(0, zi - 1)] }), zoomReset: () => set({ zoom: 100 }),
      zinDis: zi === ZS.length - 1 ? 'true' : 'false', zoutDis: zi === 0 ? 'true' : 'false',
      pw, kh, palOn: pal, foldPanel: () => set({ pal: false }), railNotOn: rail === 'notation', railNotBg: rail === 'notation' && pal ? '#F6E7C8' : 'transparent', railNotW: rail === 'notation' ? 600 : 500, pickNot: () => set(rail === 'notation' && pal ? { pal: false } : { rail: 'notation', pal: true }), railViewOn: rail === 'view', railViewBg: rail === 'view' && pal ? '#F6E7C8' : 'transparent', railViewW: rail === 'view' ? 600 : 500, pickView: () => set(rail === 'view' && pal ? { pal: false } : { rail: 'view', pal: true }), railSongOn: rail === 'song', railSongBg: rail === 'song' && pal ? '#F6E7C8' : 'transparent', railSongW: rail === 'song' ? 600 : 500, pickSong: () => set(rail === 'song' && pal ? { pal: false } : { rail: 'song', pal: true }), railInstOn: rail === 'instruments', railInstBg: rail === 'instruments' && pal ? '#F6E7C8' : 'transparent', railInstW: rail === 'instruments' ? 600 : 500, pickInst: () => set(rail === 'instruments' && pal ? { pal: false } : { rail: 'instruments', pal: true }), railLayOn: rail === 'layout', railLayBg: rail === 'layout' && pal ? '#F6E7C8' : 'transparent', railLayW: rail === 'layout' ? 600 : 500, pickLay: () => set(rail === 'layout' && pal ? { pal: false } : { rail: 'layout', pal: true }), railAudOn: rail === 'audio', railAudBg: rail === 'audio' && pal ? '#F6E7C8' : 'transparent', railAudW: rail === 'audio' ? 600 : 500, pickAud: () => set(rail === 'audio' && pal ? { pal: false } : { rail: 'audio', pal: true }), railSrchBg: 'transparent', railSrchW: 500, railKeysBg: 'transparent', railKeysW: 500, panelL: { song: 'Song', view: 'View', notation: 'Notation', instruments: 'Instruments', layout: 'Layout', audio: 'Audio' }[rail], layView: rail === 'layout' && pal, notLayView: !(rail === 'layout' && pal), searchOn: st.sheet === 'search', openSearch: () => set({ sheet: 'search' }), keysOn2: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }), exportOn: st.sheet === 'export', openExport: () => set({ sheet: 'export' }), titleBg: ['more', 'export'].includes(st.sheet) ? '#E8DFD3' : 'transparent', notPick: st.sheet !== 'pickInst', backInst: () => set({ sheet: null }), rooms: seg(['Off', 'Studio', 'Hall', 'Cathedral'], st.room ?? 'Off', (l) => set({ room: l })), mutePOn: (st.mute || []).includes('Piano'), toggleMuteP: () => set({ mute: (st.mute || []).includes('Piano') ? st.mute.filter((x) => x !== 'Piano') : [...(st.mute || []), 'Piano'] }), mutePBg: (st.mute || []).includes('Piano') ? '#332921' : 'transparent', mutePFg: (st.mute || []).includes('Piano') ? '#FEFDFB' : '#332921', muteVOn: (st.mute || []).includes('Voice'), toggleMuteV: () => set({ mute: (st.mute || []).includes('Voice') ? st.mute.filter((x) => x !== 'Voice') : [...(st.mute || []), 'Voice'] }), muteVBg: (st.mute || []).includes('Voice') ? '#332921' : 'transparent', muteVFg: (st.mute || []).includes('Voice') ? '#FEFDFB' : '#332921', 
      dragPanel: drag((r, k, e) => set({ pw: Math.round(Math.max(280, Math.min(520, (e.clientX - r.left) / k))) })),
      keyPanel: (e) => { const d = { ArrowLeft: -16, ArrowRight: 16 }[e.key]; if (d) set({ pw: Math.max(280, Math.min(520, pw + d)) }); },
      dragKeys: drag((r, k, e) => set({ kh: Math.round(Math.max(96, Math.min(260, (r.bottom - e.clientY) / k))) })),
      keyKeys: (e) => { const d = { ArrowUp: 16, ArrowDown: -16 }[e.key]; if (d) set({ kh: Math.max(96, Math.min(260, kh + d)) }); },
      copied: () => set({ toast: 'Copied' }), cut: () => set({ toast: 'Cut · Undo' }), pasted: () => set({ toast: 'Pasted' }),
      cats: seg(PALR.map((p) => p[0]), cat, (l) => set({ cat: l })), catsI: PALR.map(([c]) => { const [g, f] = CATI[c]; return { c, t: TITLE[c] ?? c, g, ff: FF[f], fs: f === 'music' ? 22 : f === 'serif' ? 18 : 15, fst: f === 'serif' ? 'italic' : 'normal', fw: f === 'serif' ? 700 : 600, on: c === cat ? 'true' : 'false', bg: c === cat ? '#FEFDFB' : 'transparent', sh: c === cat ? '0 1px 2px rgba(51,41,33,.12)' : 'none', fg: c === cat ? '#332921' : '#685E56', pick: () => set({ cat: c }) }; }), tools: sections.find((s) => s.c === cat).tools, sections,
      open, folded: !open, toggleOpen: () => set({ open: !open }), openLabel: open ? 'Fold the palette' : 'Open the palette', openRot: open ? '180deg' : '0deg',
      noteL, whereL: 'Bar 4 · beat 1 · “sweet”' + (voice ? ' · voice 2' : '') + (marks.length ? ' · ' + marks.map((m) => NAME[m]).join(', ') : ''),
      keysOn: keys, keysPressed: keys ? 'true' : 'false', keysBg: keys ? '#332921' : 'transparent', keysPh: keys ? '#A8551F' : '#332921', keysFg: keys ? '#FEFDFB' : '#332921', toggleKeys: () => set({ keys: !keys }),
      undo: () => { if (marks.length) set({ marks: marks.slice(0, -1), undone: [...(st.undone ?? []), { m: marks[marks.length - 1] }] }); else if (rest) set({ rest: false, undone: [...(st.undone ?? []), { r: true }] }); },
      redo: () => { const u = st.undone ?? []; if (!u.length) return; const x = u[u.length - 1]; set(x.r ? { rest: true, undone: u.slice(0, -1) } : { marks: [...marks, x.m], undone: u.slice(0, -1) }); },
      delNote: () => set({ rest: true, undone: [] }),
      doneOn: !!st.done, doneL: st.done ? st.done + ': tap the score where it goes' : '', clearDone: () => set({ done: null }),
      moreOn: ['more', 'export'].includes(st.sheet), openMore: () => set({ sheet: 'more' }),
      states: [['The palette open', open, { open: true }, { open: false }], ['A rest chosen', rest, { rest: true }, { rest: false }], ['Crossed to the lower staff', marks.includes('xdn'), { marks: [...marks, 'xdn'] }, { marks: marks.filter((m) => m !== 'xdn') }], ['Voice 2 on', voice, { voice: true }, { voice: false }],
        ['A clef waiting for its place', st.done === 'Treble clef', { done: 'Treble clef' }, { done: null }], ['The piano hidden', !keys, { keys: false }, { keys: true }], [VIEW0 === 'page' ? 'Panorama' : 'Page view', view !== VIEW0, { view: VIEW0 === 'page' ? 'pano' : 'page' }, { view: VIEW0 }], ['Zoom 150%', zoom === 150, { zoom: 150 }, { zoom: 100 }],
        ['The menu open', st.sheet === 'more', { sheet: 'more' }, { sheet: null }]].map(([l, on2, o, off]) => ({ l, bg: on2 ? '#332921' : '#EEE9E2', pick: () => set(on2 ? off : o) })),
      kb: calmKeys(50, 76, { 67: ['#85B8DC', ''] }, 402, 112), kbL: calmKeys(36, 96, { 67: ['#85B8DC', ''] }, 1330, kh) };''')

# the bar: ✕, the version (the kit's VERSW) and Edit beside it, pressed (the kit's EDITB), as the Player's bar
def GBTN(label, svg, act='', href='', tip=''):
    st = f'width: 44px; height: 44px; border: 0; padding: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none; position: relative'
    t = f' data-tip="{tip or label}"'
    if href: return f'<a href="{href}" aria-label="{label}"{t} style="{st}">{svg}</a>'
    return f'<button type="button" aria-label="{label}"{t} onClick="{{{{{act}}}}}" style="{st}">{svg}</button>'
def EBAR(close_href, play_href, title=False):
    left = f'<a href="{close_href}" aria-label="Close the editor" data-tip="Close · Esc" style="flex: none; width: 44px; height: 44px; border-radius: 22px; {GL}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{XI}</a>'
    saved = ''
    if title:
        # Flat's top bar (flat-score-editor 099, 126): the score's name after the way out, and the pen beside it opens
        # its Credits (title, subtitle, words, music, arranged by, copyright; 087), as the printed title does
        # Flat's new top bar (owner's screenshots, 2026-11-26): the score's name with its chevron is the score's menu
        # (its name and save state, Credits, Export ›, Print, Keyboard shortcuts); no pen, no ···, no status in the bar
        left += (f'<button type="button" aria-haspopup="menu" aria-expanded="{{{{moreOn}}}}" onClick="{{{{openMore}}}}" data-tip="The score’s menu" style="min-width: 0; height: 44px; padding: 0 8px 0 12px; border: 0; border-radius: 12px; background: {{{{titleBg}}}}; color: {INK}; font: inherit; display: flex; align-items: center; gap: 4px; cursor: pointer">'
                 f'<h1 style="margin: 0; font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">Amazing Grace</h1><span style="flex: none; display: flex; color: {SOFT}">{CHEV_D}</span></button>')
    # Undo and Redo are the toolbar's (Flat's actions: delete, history, clipboard); the bar keeps the score's menu
    # Edit its own button right after the version, as Flat's "✎ Edit ▾" after the name and transport (the owner's Flat
    # screenshots, 2026-11-26), pressed while editing; the phone's ··· (no room for the title's menu) at the end
    right = '' if title else f'<div style="flex: none; display: flex; border-radius: 22px; {GL}">{GBTN("More", MORE, "openMore")}</div>'
    if title:
        # Edit is a mode of the Player's screen (owner, 2026-11-26: "i want it to be a mode like read only or edit
        # mode"): the same ✕ (back to the library), the same song menu, the same Practice · Edit switch in the same
        # place; what Edit adds is the toolbar, the panel and, at the bar's end, where the work is kept and the editor's
        # own Record and Play (Flat's play in its top bar), which stood in the Notation panel beside the chosen note
        left = (f'<a href="{close_href}" aria-label="Close" data-tip="Close · Esc" style="flex: none; width: 44px; height: 44px; border-radius: 22px; {GL}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{XI}</a>'
                + f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{SONGMENU("TakesLaptop.dc.html")}{MODESW("edit", play_href, "EditorLaptop.dc.html")}</div>')
        # Flat's header transport, the kit's one implementation with the Player (HDRTRANSPORT)
        # the band, the kit's one header with the Player's (BANDHDR); at its end the History clock (Flat's "Last save
        # … ago", which opens Document History), where the save state stood
        return BANDHDR(close_href, 'edit', play_href, 'EditorLaptop.dc.html', right=HISTBTN)
    vers = f'<div style="display: flex; align-items: center; gap: 8px; min-width: 0">{VERSW("edit", play_href)}{EDITB("edit", play_href)}</div>'
    return (f'<header style="flex: none; position: relative; z-index: 20; {MODEBAR_P}">'
            f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{left}{vers if title else ""}</div>{"<span></span>" if title else vers}<div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px">{right}</div></header>')

# the selection strip: what is chosen, and what acts on it
def STRIP(play=True):
    # the editor's Record (the record-take feature): a take of what the learner plays, kept in Takes; beside Play
    pb = (f'<button type="button" aria-label="Play from here" data-tip="Play from here · Space" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{PLAY}</button>') if play else ''
    return (f'<div role="toolbar" aria-label="The chosen note" style="flex: none; min-height: 60px; box-sizing: border-box; padding: 8px 8px 8px 16px; display: flex; align-items: center; gap: 4px">'
            f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap">{{{{noteL}}}}</span>'
            f'<span style="font-size: 13px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{whereL}}}}</span></div>'
            f'<button type="button" aria-label="Record" data-tip="Record (R)" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: transparent; display: flex; align-items: center; justify-content: center; position: relative"><span aria-hidden="true" style="width: 16px; height: 16px; border-radius: 8px; background: #B84A3E; box-shadow: 0 0 0 3px #FEFDFB, 0 0 0 4.5px #B84A3E"></span></button>'
            f'{pb}</div>'
            f'<sc-if value="{{{{doneOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="flex: none; margin: 0 16px 8px; min-height: 44px; box-sizing: border-box; padding: 4px 4px 4px 12px; border-radius: 12px; background: #FBF1DD; display: flex; align-items: center; gap: 8px; font-size: 14px"><span style="flex: 1; min-width: 0">{{{{doneL}}}}</span><button type="button" onClick="{{{{clearDone}}}}" style="height: 36px; padding: 0 8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">Cancel</button></div></sc-if>')

TOOL = (f'<button type="button" aria-hidden="{{{{t.hid}}}}" tabindex="{{{{t.ti}}}}" aria-label="{{{{t.name}}}}" aria-pressed="{{{{t.on}}}}" data-tip="{{{{t.tip}}}}" onClick="{{{{t.pick}}}}" style="flex: none; position: relative; min-width: 48px; height: 48px; box-sizing: border-box; padding: 0 8px; border: 0; border-radius: 12px; '
        f'background: {{{{t.bg}}}}; color: {{{{t.fg}}}}; font-family: {{{{t.ff}}}}; font-size: {{{{t.fs}}}}px; font-style: {{{{t.fst}}}}; font-weight: {{{{t.fw}}}}; line-height: 1; white-space: nowrap; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{t.isSvg}}}}" hint-placeholder-val="{{{{false}}}}"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="{{{{t.hd}}}}" fill="{{{{t.hf}}}}" stroke="currentColor" stroke-width="1.6"></path><path d="{{{{t.sd}}}}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg></sc-if><sc-if value="{{{{t.isTxt}}}}" hint-placeholder-val="{{{{true}}}}"><span>{{{{t.g}}}}</span></sc-if></button>')
def ED_SECTIONS(gap=16):
    cell = TOOL.replace('min-width: 48px', 'min-width: 0; grid-column: span {{t.span}}').replace('border-radius: 12px; ', 'border-radius: 0; ').replace('background: {{t.bg}}', 'background: {{t.gbg}}; box-shadow: 1px 0 0 '+LINE+', 0 1px 0 '+LINE)
    return (f'<sc-for list="{{{{sections}}}}" as="a" hint-placeholder-count="7"><section style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0"><button type="button" aria-expanded="{{{{a.isOpen}}}}" onClick="{{{{a.fold}}}}" style="width: 100%; min-height: 44px; margin: -6px 0; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: space-between">{{{{a.t}}}}<span style="color: {SOFT}; display: flex; transform: rotate({{{{a.rot}}}}); transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1)">{CHEV_D}</span></button></h3>'
            f'<sc-if value="{{{{a.isOpen}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); background: {SHEET}; border: 1px solid {LINE}; border-radius: 12px; overflow: hidden"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="8">{cell}</sc-for></div></sc-if></section></sc-for>')
TIP_CSS = ('<style data-r44>[data-tip]:hover::after { content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 6px); z-index: 90; translate: -50% 0; padding: 4px 8px; border-radius: 8px; background: #332921; color: #FEFDFB; '
           "font: 500 12px/16px 'Instrument Sans', system-ui, sans-serif; white-space: nowrap; pointer-events: none } header [data-tip]:hover::after { top: calc(100% + 6px) } "
           '[aria-label="Palette"] [data-tip]:hover::after, [data-strip] [data-tip]:hover::after { top: auto; bottom: calc(100% + 6px) } [role=dialog] > * { flex: none } [data-tip=""]:hover::after { display: none } [aria-label="Categories"] > button::before { content: ""; position: absolute; inset: -2px 0 }</style>')

CATBAR = (f'<div style="flex: none; display: flex; align-items: center; gap: 8px; padding: 0 16px 8px"><div role="tablist" aria-label="Categories" class="nos" style="flex: 1; min-width: 0; display: flex; overflow-x: auto; padding: 2px; border-radius: 12px; background: {FILL}">'
          f'<sc-for list="{{{{catsI}}}}" as="c" hint-placeholder-count="12"><button type="button" role="tab" aria-label="{{{{c.t}}}}" aria-selected="{{{{c.on}}}}" data-tip="{{{{c.t}}}}" onClick="{{{{c.pick}}}}" style="flex: none; position: relative; min-width: 44px; height: 40px; padding: 0 6px; box-sizing: border-box; border: 0; border-radius: 10px; background: {{{{c.bg}}}}; box-shadow: {{{{c.sh}}}}; color: {{{{c.fg}}}}; font-family: {{{{c.ff}}}}; font-size: {{{{c.fs}}}}px; font-style: {{{{c.fst}}}}; font-weight: {{{{c.fw}}}}; line-height: 1; white-space: nowrap; display: flex; align-items: center; justify-content: center">{{{{c.g}}}}</button></sc-for></div>'
          f'<button type="button" aria-label="{{{{openLabel}}}}" data-tip="{{{{openLabel}}}}" onClick="{{{{toggleOpen}}}}" style="flex: none; position: relative; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center"><span style="display: flex; rotate: {{{{openRot}}}}">{EXPI}</span></button></div>')

# The accompaniment's Pattern page and its Sort and filter, the Player's own (base PlayerDesk), one implementation now
# that the accompaniment lives in Notation alone: the library's shape (search, Sort and filter with its count, the
# books as folds, Recently used and Favourites first, each pattern's hands drawn, Listen and the heart); here it takes
# the panel's place with Back (the laptop) or the open palette's (the phone), as the Player's docked page did
import re as _re
_PD = open('/home/user/piano-trainer/.scratch/r39/canvas/player/base/PlayerDesk.dc.html').read()
def _pd_sect(label):
    d = _PD.index(f'role="dialog" aria-label="{label}"'); a = _PD.rindex('<section', 0, d); depth = 0
    for m in _re.finditer(r'<(/?)section\b', _PD[a:]):
        depth += -1 if m.group(1) else 1
        if depth == 0: return _PD[a:a + m.end()]
def _pd_page(label):
    h = _pd_sect(label)
    h = _re.sub(r'style="[^"]*"', 'style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 24px; display: flex; flex-direction: column; gap: 12px; background: #FEFDFB"', h, count=1).replace('role="dialog"', 'role="region"', 1)
    h = _re.sub(r'<div aria-hidden="true" style="display: \{\{sheetGrab\}\};[^"]*"></div>', '', h, count=1)
    return h.replace('{{backToSong}}', '{{patBack}}')
PATPAGE, FILTPAGE = _pd_page('Pattern'), _pd_page('Sort and filter')
_i = _PD.index('const PAT_SHELVES = '); _j = _PD.index('const PAT_LIB = ', _i); _k = _PD.index('}];', _j) + 3
PATCONSTS = _PD[_i:_k].strip() + '\n'
_a = _PD.index('const audio = () => {'); _b = _PD.index('};', _PD.index('return w.__ptAudio', _a)) + 2
PATCONSTS += _PD[_a:_b].replace('const audio = ', 'const patAudio = ') + '\n'
_x = _PD.index('patItems:'); _s = _PD.rindex('...(() =>', 0, _x); _e = _PD.index("})) }; })()", _x) + len("})) }; })()")
PATIIFE = _PD[_s:_e]
for _a, _b in (("const cur = s.patId ?? 'M1';", "const cur = ACCV('pat', 'M1');"),
               ("pick: () => this.setState({ patId: x.id, music: 'chords', open: 'settings', patRecent: [x.id, ...recent.filter((r) => r !== x.id)].slice(0, 3) })",
                "pick: () => setAcc('pat', x.id, x.name.replace(/^[^A-Za-z]+/, ''), { dock: null, patRecent: [x.id, ...recent.filter((r) => r !== x.id)].slice(0, 3) })"),
               ("pick({ open: 'patfilter' })", "pick({ dock: 'patfilter' })"), ("pick({ open: 'pattern' })", "pick({ dock: 'pattern' })"),
               ("audio()", "patAudio()"), ("this.setState(", "set("), ("s[foldKey]", "st[foldKey]")):
    assert _a in PATIIFE, _a[:50]; PATIIFE = PATIIFE.replace(_a, _b)
PATIIFE = _re.sub(r'(?<![\w.])s\.(pat\w+)', r'st.\1', PATIIFE)
assert 'this.' not in PATIIFE and not _re.search(r'(?<![\w.])s\.', PATIIFE)
# the scope (the bar chosen on the score, its phrase, the whole song), each scope's own settings, and the card's keys
ACCJS = r"""
    const ASC = st.accSc ?? 'bar'; const AOV = st.accOv ?? {}; const ACHAIN = ASC === 'bar' ? ['bar', 'phrase', 'song'] : ASC === 'phrase' ? ['phrase', 'song'] : ['song'];
    const ACCV = (f, d) => { for (const c of ACHAIN) if (AOV[c] && AOV[c][f] !== undefined) return AOV[c][f]; return d; };
    const ASCN = { bar: 'bar 4', phrase: 'phrase 1', song: 'the whole song' }[ASC];
    const setAcc = (f, v, label, more) => set({ accOv: { ...AOV, [ASC]: { ...(AOV[ASC] || {}), [f]: v } }, accUndo: AOV, toast: label + ' in ' + ASCN + ' · Undo', ...(more || {}) });
    const pick = (patch) => () => set(patch);
"""
ACCKEYS = (" accScopes: [['bar', 'Bar 4'], ['phrase', 'Phrase 1'], ['song', 'Whole song']].map(([id, l]) => ({ l, on: ASC === id ? 'true' : 'false', bg: ASC === id ? '#FEFDFB' : 'transparent', sh: ASC === id ? '0 1px 2px rgba(51,41,33,.18), 0 0 0 0.5px rgba(51,41,33,.08)' : 'none', fw: ASC === id ? 600 : 500, pick: () => set({ accSc: id }) })),"
           " patternName: ((PAT_LIB.find((x) => x.id === ACCV('pat', 'M1')) || {}).name || '').replace(/^[^A-Za-z]+/, ''), openPattern: () => set({ dock: 'pattern' }), patBack: () => set({ dock: null }),"
           " notDock: !st.dock, dockPat: st.dock === 'pattern', dockFilt: st.dock === 'patfilter',"
           " accOwn: ASC !== 'song' && !!AOV[ASC], accResetL: ASC === 'bar' ? 'Use the phrase’s accompaniment' : 'Use the song’s accompaniment',"
           " accReset: () => { const nv = { ...AOV }; delete nv[ASC]; set({ accOv: nv, accUndo: AOV, toast: (ASC === 'bar' ? 'Bar 4 follows its phrase' : 'Phrase 1 follows the song') + ' · Undo' }); }, "
           + SELKEYS('st', 'set', [('selInv', [('Root', 'Root position'), ('1st', '1st inversion'), ('2nd', '2nd inversion'), ('3rd', '3rd inversion')], "ACCV('inv', 'Root')", "(id) => setAcc('inv', id, 'First chord: ' + ({ Root: 'root position', '1st': '1st inversion', '2nd': '2nd inversion', '3rd': '3rd inversion' })[id])"),
                                   ('selVoice', [('Voice-led', 'Voice-led'), ('Block', 'Block')], "ACCV('voice', 'Voice-led')", "(id) => setAcc('voice', id, 'Voicing: ' + id.toLowerCase())")]))
ACCBODY = ('<sc-if value="{{notDock}}" hint-placeholder-val="{{true}}">{0}</sc-if>'
           '<sc-if value="{{dockPat}}" hint-placeholder-val="{{false}}">' + PATPAGE + '</sc-if>'
           '<sc-if value="{{dockFilt}}" hint-placeholder-val="{{false}}">' + FILTPAGE + '</sc-if>')
# the phone: the bar over the score, then the sheet: grabber, strip, categories, the tools, the keys
SHEETP = (f'<section aria-label="Palette" data-strip style="flex: none; position: relative; z-index: 10; border-radius: 22px 22px 0 0; background: {SHEET}; box-shadow: 0 -1px 0 {LINE}, 0 -12px 28px -20px rgba(51,41,33,.5); display: flex; flex-direction: column">'
          f'<button type="button" class="edgrab" aria-label="{{{{openLabel}}}}" onClick="{{{{toggleOpen}}}}" style="align-self: center; width: 88px; height: 44px; margin: -12px 0; border: 0; padding: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></span></button>'
          + STRIP()[STRIP().index('<sc-if value="{{doneOn}}"'):] +
          f'<sc-if value="{{{{folded}}}}" hint-placeholder-val="{{{{true}}}}"><div class="nos" style="display: flex; overflow-x: auto; padding: 8px 16px"><!--ESS--></div></sc-if>'
          f'<sc-if value="{{{{open}}}}" hint-placeholder-val="{{{{false}}}}"><div class="nos" style="max-height: 420px; overflow-y: auto; padding: 4px 16px 16px; display: flex; flex-direction: column; gap: 16px">' + ACCBODY.replace('{0}', ACCPANEL() + ED_SECTIONS()).replace('padding: 8px 16px 24px;', 'padding: 0;') + '</div></sc-if>'
          + CATBAR +
          f'<sc-if value="{{{{keysShown}}}}" hint-placeholder-val="{{{{true}}}}"><div style="padding: 0 0 26px">{KEYS(112, edge=True)}</div></sc-if>'
          f'<sc-if value="{{{{notKeys}}}}" hint-placeholder-val="{{{{false}}}}"><div style="height: 26px"></div></sc-if></section>')
# the phone's bar has no room for the save status the laptop shows beside Close: it heads the ··· sheet (a status goes in the bar or its menu)
ED_SAVED = f'<p role="status" style="margin: -8px 0 0; text-align: center; font-size: 13px; color: {SOFT}">Saved on this device</p>'
ED4 = ED4.replace("keysOn: keys,", "keysOn: keys, keysShown: keys && !open, notKeys: !keys || open,", 1)
# From 48rem (an iPad, a phone on its side) the palette docks at the right of the score, as the laptop's, never a sheet
# over it (CLAUDE.md, the score editor; round 66: at 852×393 the sheet and keys left no score at all).
EDLAY_CSS = ('<style data-edlay>[data-menuroot] { container-type: size } @container (min-width: 768px) { .edlay { display: grid !important; grid-template-columns: minmax(0, 1fr) 380px } '
             '.edlay > section[data-strip] { min-height: 0; overflow-y: auto; border-radius: 0 !important; box-shadow: -1px 0 0 ' + LINE + ' !important } .edlay .edgrab { display: none !important } .edlay > section[data-strip] > * { flex-shrink: 0 } }</style>')
# ── R74 (owner, 2026-11-26: "we need real toolbar like on the laptop, real resizable interactions … remove the
# vertical scroll and leave only the page and panorama view and make proper layout for the sheet"). Flat's editor
# (piano-data/research/flat/FLAT_UI_SHELL_AND_MOTION.md §1.4): a 56 toolbar under the bar, the note-entry essentials
# in a pill at its start (durations, dot, tie, triplet, rest; ♮ ♯ ♭), the acts flat at its end (delete; copy, cut,
# paste; zoom; the display mode); the palette a 352 panel at the left that collapses and here also resizes; the
# keys' height dragged. Two views only, as Flat's Page and Horizontal and Dorico's Page and Galley: Page lays the song
# on A4 as an engraver does (17.2 mm margins, Flat's default; a 7 mm staff, rastral 3; title centred, Words left and
# Music right over the first system; Public domain at the foot; no number on page 1), Panorama runs one system on.
ZOUTI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M5 12h14"></path></svg>'
ZINI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M5 12h14M12 5v14"></path></svg>'
PANELI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 3v18"></path></svg>'
PAGEI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"></path><path d="M8 11h8M8 14h8M8 17h8"></path></svg>'
PANOI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M2 8h20M2 11h20M2 14h20M2 17h20"></path></svg>'
# a toolbar tool: the palette's TOOL, 44 square, in the essentials pill
TTOOL = TOOL.replace('min-width: 48px; height: 48px; box-sizing: border-box; padding: 0 8px', 'min-width: 44px; height: 44px; box-sizing: border-box; padding: 0 6px')
# ground: the laptop toolbar's pill; on a phone the folded palette's row is bare glyphs on the sheet, as Flat's (017,
# 018: the durations over the category pill, no ground behind them)
ESS = lambda ground=True: (f'<div role="group" aria-label="Note input" style="flex: none; display: flex; align-items: center; padding: 2px; border-radius: 14px; background: {FILL if ground else "transparent"}">'
              f'<sc-for list="{{{{tbDur}}}}" as="t" hint-placeholder-count="9">{TTOOL}</sc-for>{TSEP}<sc-for list="{{{{tbAcc}}}}" as="t" hint-placeholder-count="3">{TTOOL}</sc-for></div>')
ESSENTIALS = ESS()
SHEETP = SHEETP.replace('<!--ESS-->', ESS(False), 1)
KEYSBTN = (f'<button type="button" aria-label="Piano keys" data-tip="Piano keys · K" aria-pressed="{{{{keysPressed}}}}" onClick="{{{{toggleKeys}}}}" style="flex: none; position: relative; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 12px; background: {{{{keysBg}}}}; color: {{{{keysFg}}}}; display: flex; align-items: center; justify-content: center">{KEYSI}</button>')
ZOOMG = (TBTN('Zoom out', ZOUTI, 'zoomOut', 'Zoom out · ⌘−', 'zoutDis') + f'<button type="button" aria-label="Reset the zoom" data-tip="Actual size · ⌘0" onClick="{{{{zoomReset}}}}" style="flex: none; position: relative; min-width: 56px; height: 44px; border: 0; padding: 0 4px; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums">{{{{zoomL}}}}</button>'
         + TBTN('Zoom in', ZINI, 'zoomIn', 'Zoom in · ⌘=', 'zinDis'))
TOOLBAR_L = (f'<div role="toolbar" aria-label="Notation" style="flex: none; height: 56px; box-sizing: border-box; padding: 0 24px; display: flex; align-items: center; gap: 8px; box-shadow: inset 0 -1px 0 {LINE}">'

             + ESSENTIALS + '<span style="flex: 1"></span>' + CLIP + TSEP + ZOOMG + TSEP
             # Page · Panorama left the toolbar for the View panel (owner, 2026-11-26: "move the page panorama switch to the sidebar")
             + KEYSBTN + TSEP
             # Flat's toolbar ends with its files: download and print (the owner's Flat 26.11 screenshots)
             + TBTN('Export', f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M12 15V3M7 10l5 5 5-5M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>', 'openExport', 'Export')
             + TBTN('Print', f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>', 'actPrint', 'Print · ⌘P') + '</div>')
# the phone's toolbar, as Flat's second row (flat-score-editor 017): the essentials scroll sideways; the keys and the view stay at its end
TOOLBAR_P = (f'<div role="toolbar" aria-label="Notation" style="flex: none; height: 52px; display: flex; align-items: center; gap: 4px; padding: 0 8px 0 0">'
             f'<div class="nos" style="flex: 1; min-width: 0; overflow-x: auto; display: flex; align-items: center; gap: 4px; padding: 0 0 0 16px">{ESSENTIALS}{CLIP}</div>'
             + TSEP + KEYSBTN + f'<button type="button" aria-label="{{{{viewL}}}}" data-tip="{{{{viewL}}}}" onClick="{{{{toggleView}}}}" style="flex: none; position: relative; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 12px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{pageOn}}}}" hint-placeholder-val="{{{{false}}}}">{PANOI}</sc-if><sc-if value="{{{{panoOn}}}}" hint-placeholder-val="{{{{true}}}}">{PAGEI}</sc-if></button></div>')

# the desk the page lies on, as Flat's and Dorico's: a grey ground; the page scaled by the zoom (fit to the width on a phone)
DESK = lambda pad: (f'<sc-if value="{{{{pageOn}}}}" hint-placeholder-val="{{{{true}}}}"><div class="nos" aria-label="Page view" style="position: absolute; inset: 0; overflow: auto; background: {FILL}"><div style="min-width: min-content; box-sizing: border-box; padding: {pad}; display: flex; justify-content: center">'
                    f'<div style="zoom: {{{{zf}}}}; display: flex; flex-direction: column; gap: 24px">{A4PAGE()}</div></div></div></sc-if>')
# Panorama (Dorico's galley, Flat's horizontal): one system as long as the song, its natural spacing, never justified
PANO = lambda sc, pad: (f'<sc-if value="{{{{panoOn}}}}" hint-placeholder-val="{{{{false}}}}"><div class="nos" aria-label="Panorama" style="position: absolute; inset: 0; overflow-x: auto; overflow-y: hidden; background: {PAGE}; display: flex; align-items: center">'
                        f'<div style="flex: none; padding: {pad}; zoom: {{{{zf}}}}">' + score_grand(0, [list(range(13))], sel=(3, 0), size=1.0, natural=sc).replace(ACCENT, '#85B8DC') + '</div></div></sc-if>')
SCOREAREA = lambda inner: f'<div data-score style="flex: 1; min-height: 0; position: relative">{inner}</div>'
# the grips: a hairline with a pill, the whole band draggable and focusable (Arrow keys), as Flat's and Dorico's panes
VGRIP = (f'<div role="separator" aria-orientation="vertical" aria-label="Palette width" aria-valuenow="{{{{pw}}}}" aria-valuemin="280" aria-valuemax="520" tabindex="0" data-tip="Drag to resize" onPointerDown="{{{{dragPanel}}}}" onPointerMove="{{{{dragPanel}}}}" onKeyDown="{{{{keyPanel}}}}" '
         f'style="flex: none; position: relative; z-index: 5; width: 9px; margin: 0 -4px; cursor: col-resize; touch-action: none; display: flex; align-items: center; justify-content: center"><span aria-hidden="true" style="position: absolute; top: 0; bottom: 0; left: 4px; width: 1px; background: {LINE}"></span><span aria-hidden="true" style="position: relative; width: 5px; height: 36px; border-radius: 3px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}"></span></div>')
HGRIP = (f'<div role="separator" aria-orientation="horizontal" aria-label="Keyboard height" aria-valuenow="{{{{kh}}}}" aria-valuemin="96" aria-valuemax="260" tabindex="0" data-tip="Drag to resize" onPointerDown="{{{{dragKeys}}}}" onPointerMove="{{{{dragKeys}}}}" onKeyDown="{{{{keyKeys}}}}" '
         f'style="flex: none; position: relative; z-index: 5; height: 13px; margin: -6px 0; cursor: row-resize; touch-action: none; display: flex; align-items: center; justify-content: center"><span aria-hidden="true" style="position: absolute; left: 0; right: 0; top: 6px; height: 1px; background: {LINE}"></span><span aria-hidden="true" style="position: relative; width: 36px; height: 5px; border-radius: 3px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}"></span></div>')

_PANELOLD = '<!--panel-->'
# R74 on a phone (owner, 2026-11-26: "refactor the mobile version the same way and to be like the flat editor the
# same"): the laptop's band in Flat's phone shape (flat-score-editor 017, 018; help.flat.io, Copy, cut and paste: "the
# three buttons sit … after Undo and Redo", "the toolbar under the transport"): the dark band's two rows (PHBAND), then
# the acts row as Flat's second row: Delete | Undo, Redo | Copy, Cut, Paste, the keys at its end. The note input moved
# to the palette's folded row (Flat's palette sheet opens on the durations, 018); the view toggle went to ☰ › View.
# Flat's second row, its acts as bare glyphs spread across the width, no separators (help.flat.io, copy, cut and paste:
# "the three buttons sit … after Undo and Redo", "in the toolbar under the transport"); Flat's voice, measure and comment
# buttons have nothing to act on here (one voice a staff, no comments), so they are not drawn
# its glyphs soft ink as Flat's second row is quieter than its header, a soft shadow under it over the page (018)
# the keys' switch in the header, as Flat's piano glyph: bare, a sand wash while the keys show
PHKEYSED = KEYSBTN.replace('border-radius: 12px; background: {{keysBg}}; color: {{keysFg}}', 'border-radius: 22px; background: transparent; color: {{keysPh}}').replace('width="22" height="22"', 'width="24" height="24"')
assert PHKEYSED != KEYSBTN
eph4 = (TIP_CSS + PHBAND('Songs.dc.html', PHKEYSED) + ACTS_P
        + '<div class="edlay" style="flex: 1; min-height: 0; display: flex; flex-direction: column">'
        + SCOREAREA(DESK('12px') + PANO(0.95, '16px 16px 16px 12px')) + SHEETP + '</div>' + EDLAY_CSS)

# the laptop: the bar, the toolbar, then the palette at the left (resizable, collapsible), the score, the keys under it
elm4 = (TIP_CSS + EBAR('SongsLaptop.dc.html', 'PlayerLaptop.dc.html', title=True).replace(MODEBAR_P, MODEBAR_L) + TOOLBAR_L
        + f'<div data-edgrid style="flex: 1; min-height: 0; display: flex">' + _PANELOLD
        + f'<div style="flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column">'
        + SCOREAREA(DESK('32px') + PANO(1.15, '24px 32px'))
        + f'<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{true}}}}">{HGRIP}<div style="flex: none">{KEYS("{{kh}}", "kbL", edge=True, ring=False)}</div></sc-if></div></div>')


# ··· the score's menu, as Flat's ≡ (owner, 2026-11-16: "new completely new design"; flat-score-editor 083–090): what
# the score does not print, one row each, then Publish as its own card. Credits and Instruments open their sheets.
EYEI22 = EYEI.replace('width="20" height="20"', 'width="22" height="22"')
SOLOI = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"></circle><text x="12" y="16.4" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">S</text></svg>'
EXPORTMENU = GROUP(('action', 'Printable PDF (.pdf)', 'closeSheet', INK), ('action', 'MusicXML (.mxl)', 'closeSheet', INK), ('action', 'MusicXML (.musicxml)', 'closeSheet', INK), ('action', 'MIDI (.mid)', 'closeSheet', INK), bg=SHEET)
FIELD = lambda label, val: (f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{label}</span>'
                            f'<input {KB["title"]} value="{val}" placeholder="{label}" style="height: 48px; box-sizing: border-box; padding: 0 16px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>')
ED_PICK = GROUP(('action', 'Violin', 'addViolin'), ('action', 'Viola', 'addViola'), ('action', 'Cello', 'addCello'), ('action', 'Flute', 'addFlute'), ('action', 'Clarinet', 'addClarinet'), ('action', 'Guitar', 'addGuitar'), ('action', 'Organ', 'addOrgan'), bg=SHEET)
# Credits, as Flat's Credits (flat-score-editor 087, 088; the owner's Document settings screenshot): Title, Subtitle,
# Lyricist and Composer, Arranger, Licence text, Save at the foot's end. Creation type, tags, description and the
# licence are the Publish page's (one home: r53's _SPL), as Flat keeps them for publishing
_LAB = lambda t: f'<span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{t}</span>'
_IN = lambda label, val, ph: (f'<label style="min-width: 0; display: flex; flex-direction: column; gap: 6px">{_LAB(label)}'
                              f'<input value="{val}" placeholder="{ph}" style="height: 44px; box-sizing: border-box; padding: 0 12px; border: 0; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}"></label>')
_TXT = lambda label, ph: (f'<label style="display: flex; flex-direction: column; gap: 6px">{_LAB(label)}'
                          f'<textarea rows="3" placeholder="{ph}" style="box-sizing: border-box; padding: 10px 12px; border: 0; border-radius: 10px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}; resize: vertical"></textarea></label>')
def _CRED(two):
    return (_IN('Title', 'Amazing Grace', 'Title') + _IN('Subtitle', '', 'Subtitle')
            + f'<div style="display: grid; grid-template-columns: repeat({2 if two else 1}, minmax(0, 1fr)); gap: 16px 24px">' + _IN('Lyricist', 'John Newton', 'Lyricist') + _IN('Composer', 'New Britain (American folk tune)', 'Composer') + '</div>'
            + _IN('Arranger', 'Ana Popescu', 'Arranger') + _TXT('Licence text', 'Public domain')
            + f'<div style="display: flex; justify-content: flex-end">{BTN("Save", "closeSheet", h=44, grow=False)}</div>')
ED_CREDITS = _CRED(False)
# Layout, as Flat's Layout and styles (the owner's screenshot): one folding section a kind, its name, what it holds,
# its value; each opens in place (a details element), never a popover
_LROW = lambda k, v: f'<div style="min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: inset 0 1px 0 {FILL}"><span style="font-size: 15px">{k}</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{v}</span></div>'
# The laptop editor as Flat's new editor (owner, 2026-11-26: "this now are the new settings … we dont need legacy settings";
# FLAT_UI_SHELL_AND_MOTION §1.1–1.2: a 64 rail beside one 352 panel; Notation, Instruments, Layout, Audio, and Search and
# Shortcuts at its foot as acts; the active entry clicked again folds the panel; Layout hides the toolbar and shows the
# page whole, "Preview of your score"). Flat's Document settings dialog is its legacy and is not drawn.
# the Song entry: the song's versions, as the Player's Song panel heads with them (one implementation, VERPANEL)
SONGI_R = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15V6"></path><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M12 12H3"></path><path d="M16 6H3"></path><path d="M12 18H3"></path></svg>'
PANEL_SONG = _PHEAD('Song') + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 12px 16px 24px; display: flex; flex-direction: column">{VERPANEL()}</div>'
RAIL = (f'<nav aria-label="Panels" style="flex: none; width: 76px; padding: 0 0 12px; box-shadow: inset -1px 0 0 {LINE}; display: flex; flex-direction: column; gap: 4px">'
        f'<div role="tablist" aria-orientation="vertical" style="display: flex; flex-direction: column; gap: 4px">'
        + _RAILBTN('Song', SONGI_R, 'Song', 'Song and its versions') + _RAILBTN('View', VIEWI, 'View', 'View') + _RAILBTN('Notation', NOTATIONI, 'Not', 'Notation') + _RAILBTN('Instruments', KEYSI, 'Inst', 'Instruments') + _RAILBTN('Layout', LAYOUTI, 'Lay', 'Layout') + _RAILBTN('Audio', AUDIOI, 'Aud', 'Audio') + '</div>'
        + '<span style="flex: 1"></span>' + _RAILBTN('Search', SEARCHI, 'Srch', 'Search for an act · ⌘K', 'openSearch') + _RAILBTN('Shortcuts', KBDI, 'Keys', 'Shortcuts · ?', 'openKeys') + '</nav>')
_PBODY = lambda inner, gap=16: f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 24px; display: flex; flex-direction: column; gap: {gap}px">{inner}</div>'
_PIF = lambda c, inner, h='false': f'<sc-if value="{{{{{c}}}}}" hint-placeholder-val="{{{{{h}}}}}">{inner}</sc-if>'
# Instruments, as Flat's panel: All, then each instrument's row (its handle, name, Solo, Show, ···), New instrument
_IROW = lambda name, k: (f'<div style="display: flex; align-items: center; gap: 4px"><span aria-hidden="true" style="flex: none; width: 20px; color: {SOFT}; display: flex; justify-content: center; cursor: grab">{GRIPI}</span>'
                         f'<div style="flex: 1; min-width: 0; min-height: 48px; padding: 0 4px 0 12px; border-radius: 12px; background: {FILL}; display: flex; align-items: center; gap: 8px"><span style="flex: none; display: flex">{KEYSI}</span><span style="flex: 1; min-width: 0; font-size: 15px; font-weight: 600">{name}</span>'
                         f'<button type="button" aria-label="Solo {name}" data-tip="Solo" aria-pressed="{{{{solo{k}On}}}}" onClick="{{{{toggleSolo{k}}}}}" style="width: 40px; height: 40px; border: 0; border-radius: 20px; background: {{{{solo{k}Bg}}}}; color: {{{{solo{k}Fg}}}}; display: flex; align-items: center; justify-content: center">{SOLOI}</button>'
                         f'<button type="button" aria-label="Show {name}" data-tip="Show" aria-pressed="{{{{show{k}On}}}}" onClick="{{{{toggleShow{k}}}}}" style="width: 40px; height: 40px; border: 0; border-radius: 20px; background: transparent; color: {{{{show{k}Fg}}}}; display: flex; align-items: center; justify-content: center">{EYEI22}</button></div>'
                         f'<button type="button" aria-label="{name}: more" data-tip="More" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{MORE}</button></div>')
INST_BODY = (
                  f'<div style="display: flex; flex-direction: column; gap: 8px">' + _IROW('Voice', 'V') + _IROW('Piano', 'P') + _PIF('addedOn', _IROW('{{addedN}}', 'A')) + '</div>'
                  + f'<button type="button" onClick="{{{{addInst}}}}" style="align-self: flex-start; height: 44px; margin-left: 24px; padding: 0 14px; border: 0; border-radius: 22px; background: transparent; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 8px; cursor: pointer">{STEP_PLUS}New instrument</button>')
PANEL_INST = (_PIF('notPick', _PHEAD('Instruments') + _PBODY(INST_BODY), 'true')
              + _PIF('pickInstOn', f'<header style="flex: none; height: 64px; box-sizing: border-box; padding: 0 16px 0 8px; display: flex; align-items: center; gap: 4px; box-shadow: inset 0 -1px 0 {LINE}"><button type="button" onClick="{{{{backInst}}}}" aria-label="Back to Instruments" data-tip="Back" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{CHEV_L}</button><h2 style="margin: 0; font-size: 17px; font-weight: 600">New instrument</h2></header>' + _PBODY(ED_PICK)))
# Layout, as Flat's Layout panel: the sections fold in the panel, each its icon, name and value; the page is the preview
_LSEC = lambda name, val, body: (f'<details style="box-shadow: inset 0 -1px 0 {LINE}"><summary style="list-style: none; min-height: 48px; display: flex; align-items: center; gap: 12px; cursor: pointer">'
                                 f'<span style="flex: 1; min-width: 0; font-size: 15px; font-weight: 600">{name}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap">{val}</span><span style="color: {SOFT}; display: flex">{CHEV_D}</span></summary>'
                                 f'<div style="padding: 0 0 12px; display: flex; flex-direction: column">{body}</div></details>')
LAY_BODY = (
    _LSEC('Pages', 'A4', _LROW('Size', 'A4') + _LROW('Orientation', 'Portrait') + _LROW('Margins', '17.2 mm') + _LROW('Page numbers', 'From page 2'))
    + _LSEC('Staves', '7 mm', _LROW('Staff size', '7 mm') + _LROW('Between staves', '8 spaces') + _LROW('Between systems', '12 spaces'))
    + _LSEC('Hide empty staves', 'Never', _LROW('Hide', 'Never'))
    + _LSEC('Measures', '4 a line', _LROW('Measures a line', '4, the first 5') + _LROW('Note spacing', 'Normal'))
    + _LSEC('Measure numbers', 'Each line', _LROW('Show', 'At each line’s start') + _LROW('Pickup', 'Not counted'))
    + _LSEC('Chord symbols', 'G7, Cmaj7', _LROW('Major seventh', 'maj7') + _LROW('Minor', 'm') + _LROW('Diminished', 'dim'))
    + _LSEC('Text styles', 'Iowan Old Style', _LROW('Title', 'Iowan Old Style, 30') + _LROW('Credits', 'Iowan Old Style, 13') + _LROW('Words', 'Iowan Old Style, 13')))
PANEL_LAY = _PHEAD('Layout') + _PBODY(LAY_BODY, 0)
PANEL_AUD = _PHEAD('Audio') + _PBODY(AUDPANEL(), 20)
# View, the Player's panel: the views as cards (the Sheet chosen; the others open in Practice), the Sheet's options: Layout is
# Page · Panorama here alone (it left the toolbar), On the page the same switches as the Player's
PANEL_VIEW = _PHEAD('View') + VIEWPANEL(links=True)
PANEL_NOT = ACCBODY.replace('{0}', _PHEAD('Notation') + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 24px; display: flex; flex-direction: column; gap: 20px">{ACCPANEL()}{ED_SECTIONS()}</div>')
# Search, as Flat's: a field over the score, the suggested acts under it, the keys to move and close at its foot
_SACT = lambda icon, t, k: f'<button type="button" onClick="{{{{closeSheet}}}}" style="min-height: 48px; padding: 0 12px; border: 0; border-radius: 10px; background: transparent; color: {INK}; font: inherit; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer"><span style="display: flex; color: {SOFT}">{icon}</span><span style="flex: 1; font-size: 15px">{t}</span><kbd style="font: inherit; font-size: 13px; color: {SOFT}">{k}</kbd></button>'
SEARCHCARD = (_PIF('searchOn', f'<div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.18)"></div>'
              f'<section role="dialog" aria-modal="true" aria-label="Search for an act" style="position: absolute; z-index: 61; left: 50%; top: 200px; width: 584px; transform: translateX(-50%); border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, 0 24px 48px -12px rgba(51,41,33,.35); display: flex; flex-direction: column">'
              f'<label style="height: 60px; padding: 0 20px; display: flex; align-items: center; gap: 12px; box-shadow: inset 0 -1px 0 {LINE}"><span style="display: flex; color: {SOFT}">{SEARCHI}</span><input autofocus placeholder="Search for an act or a tool" style="flex: 1; min-width: 0; height: 44px; border: 0; background: transparent; font: inherit; font-size: 17px; color: {INK}; outline: none"></label>'
              f'<div style="padding: 8px 8px 12px; display: flex; flex-direction: column"><span style="padding: 8px 12px; font-size: 13px; font-weight: 600; color: {SOFT}">Suggested</span>'
              + _SACT(UNDO, 'Undo', '⌘Z') + _SACT(REDO, 'Redo', '⇧⌘Z') + _SACT(COPYI, 'Copy', '⌘C') + _SACT(PASTEI, 'Paste', '⌘V') + _SACT(LAYOUTI, 'Layout', '') + '</div>'
              f'<div style="height: 44px; padding: 0 20px; display: flex; align-items: center; gap: 16px; font-size: 13px; color: {SOFT}; box-shadow: inset 0 1px 0 {LINE}"><span>↑↓ to choose</span><span>Enter to do</span><span>Esc to close</span></div></section>'))
_KROW = lambda t, k: f'<div style="min-height: 40px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: inset 0 -1px 0 {FILL}"><span style="font-size: 15px">{t}</span><kbd style="font: inherit; font-size: 14px; color: {SOFT}">{k}</kbd></div>'
KEYSCARD = (_PIF('keysOn2', f'<div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 60; background: rgba(51,41,33,.18)"></div>'
            f'<section role="dialog" aria-modal="true" aria-label="Shortcuts" style="position: absolute; z-index: 61; left: 50%; top: 120px; width: 720px; transform: translateX(-50%); border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, 0 24px 48px -12px rgba(51,41,33,.35); display: flex; flex-direction: column">'
            f'<header style="height: 64px; padding: 0 8px 0 24px; display: flex; align-items: center; box-shadow: inset 0 -1px 0 {LINE}"><h2 style="flex: 1; margin: 0; font-size: 17px; font-weight: 600">Shortcuts</h2><button type="button" aria-label="Close" data-tip="Close · Esc" onClick="{{{{closeSheet}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{XI}</button></header>'
            f'<div style="padding: 16px 24px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px">'
            + _KROW('Play or stop', 'Space') + _KROW('Note input', 'N') + _KROW('Whole to sixteenth', '7 6 5 4 3') + _KROW('Rest', '0') + _KROW('Dot', '.') + _KROW('Tie', ',') + _KROW('Sharp, flat, natural', '+ − =') + _KROW('Next or previous bar', '⌘→ ⌘←')
            + _KROW('Undo', '⌘Z') + _KROW('Redo', '⇧⌘Z') + _KROW('Copy, cut, paste', '⌘C ⌘X ⌘V') + _KROW('Go to bar', '⌘G') + _KROW('Add a bar', '⌥Enter') + _KROW('Search', '⌘K') + _KROW('Fold the panel', '⌘\\') + _KROW('Zoom in or out', '⌘+ ⌘−') + '</div></section>'))
ED4 = ED4.replace('    return { ...common(st, set),', "    return { ...common(st, set), " + HDRKEYS('st', 'set', lambda m: 'toast: ' + m, "() => set({ edPlaying: !st.edPlaying, hdPop: null, toast: st.edPlaying ? 'Stopped' : 'Playing from bar 4' })", 'st.edPlaying', "() => set({ edLoop: !st.edLoop, hdPop: null, toast: st.edLoop ? 'Loop off' : 'Looping bar 4' })", 'st.edLoop', "st.edLoop ? 'Stop looping' : 'Loop the selection'", [('V', 'Voice'), ('P', 'Piano')]) + " " + HISTKEYS('st', 'set', lambda m: 'toast: ' + m, HIST="(st.hist ?? [{ id: 'h5', t: 'Today at 13:42', what: ['+4 notes'], bars: [5, 6] }, { id: 'h4', t: '7 November at 15:11', what: ['Pattern in bars 9–12'], bars: [9, 10, 11, 12] }, { id: 'h3', t: '4 November at 17:16', what: ['+49 notes', '−37 notes'], bars: [1, 2, 3, 4, 9, 10, 11, 12] }, { id: 'h2', t: '3 November at 17:45', what: ['Created'], bars: [] }])", restore="(h) => ({})") + "", 1)
# the Song panel's folds, the Player's (Versions, Accompaniment)
ED4 = ED4.replace('    return { ...common(st, set),', '    return { ...common(st, set), ' + FOLDKEYS('st', 'set', ['Ver', 'Acc', 'View', 'Opts']) + ' ' + "viewCards: [['sheet', 'Sheet'], ['diagrams', 'Diagrams'], ['grid', 'Grid'], ['lyrics', 'Lyrics']].map(([id, label]) => { const here = id === 'sheet'; return { label, on: here ? 'true' : 'false', ring: here ? 'inset 0 0 0 2px #332921' : 'inset 0 0 0 1px #DAD1C8', fw: here ? 600 : 500, isSheet: id === 'sheet', isDia: id === 'diagrams', isGrid: id === 'grid', isLyr: id === 'lyrics', isHere: here, isAway: !here, href: 'EditorLaptop' + label + '.dc.html', pick: () => {} }; }), viewName: 'Sheet', isSheet: true, isDiagrams: false, isGrid: false, isLyrics: false, showChips: [['chords', 'Chord symbols', true], ['positions', 'Chord positions', false], ['lyrics', 'Lyrics', true], ['fingers', 'Finger numbers', false], ['names', 'Note names', false], ['annotations', 'Your annotations', true]].map(([id, name, d]) => { const on = (st.show ?? {})[id] ?? d; return { name, on: on ? 'true' : 'false', track: on ? '#7FB685' : '#DAD1C8', knob: on ? 22 : 2, sep: id === 'chords' ? '0' : '1px solid #E9E2D8', pick: () => set({ show: { ...(st.show ?? {}), [id]: !on } }) }; }), " + SELFROM('st', 'set', 'selLayout', "[['page', 'Page'], ['pano', 'Panorama']].map(([id, name]) => ({ name, on: (st.view ?? VIEW0) === id ? 'true' : 'false', pick: () => set({ view: id }) }))") + ' ', 1)
ED4 = ED4.replace('    return { ...common(st, set),', PATCONSTS + ACCJS + '    return { ...common(st, set), ' + ACCKEYS + ' ' + PATIIFE + ',', 1)
ED4 = ED4.replace('    return { ...common(st, set),', '    return { ...common(st, set), ' + SONGMENU_KEYS('st', 'set', lambda m, u: 'toast: ' + m + (" + ' · Undo'" if u else ''), close_others=', sheet: null'), 1)
ED4 = ED4.replace("moreOn: ['more', 'export'].includes(st.sheet),", "moreOn: ['more', 'export'].includes(st.sheet), creditsOn: st.sheet === 'credits', layoutOn: st.sheet === 'layout', trSheetOn: st.sheet === 'tr', openTr: () => set({ sheet: 'tr' }), openLayout: () => set({ sheet: 'layout' }), instOn: st.sheet === 'inst', openCredits: () => set({ sheet: 'credits' }), openInst: () => set({ sheet: 'inst' }), "
                  + "".join(f"solo{k}On: st.solo === '{n}', toggleSolo{k}: () => set({{ solo: st.solo === '{n}' ? null : '{n}' }}), solo{k}Bg: st.solo === '{n}' ? '#332921' : 'transparent', solo{k}Fg: st.solo === '{n}' ? '#FEFDFB' : '#332921', show{k}On: !(st.hide || []).includes('{n}'), toggleShow{k}: () => set({{ hide: (st.hide || []).includes('{n}') ? (st.hide || []).filter((x) => x !== '{n}') : [...(st.hide || []), '{n}'] }}), show{k}Fg: (st.hide || []).includes('{n}') ? '#BFB3A7' : '#332921', " for k, n in (('P', 'Piano'), ('V', 'Voice'), ('A', 'Added'))) + "addedOn: !!st.added, addedN: st.added || '', addedS: { Cello: 'Bass staff', Organ: 'Treble, bass and pedal staves', Viola: 'Alto staff' }[st.added] || 'Treble staff', addInst: () => set({ sheet: 'pickInst' }), pickInstOn: st.sheet === 'pickInst', " + "".join(f"add{n}: () => set({{ added: '{n}', sheet: 'inst' }}), " for n in ['Violin', 'Viola', 'Cello', 'Flute', 'Clarinet', 'Guitar', 'Organ']), 1)

# the printed title and credits open Credits, where they print (Flat's and Dorico's: everything printed is edited there)
_CREDRE = re.compile(r'(<h2 style="margin: 0; text-align: center; font-family: [^"]*; font-size: 30px[^>]*>Amazing Grace</h2><div style="margin: 20px 0 0;.*?</span></div>)', re.S)
CREDBTN = lambda h: _CREDRE.sub(lambda m: '<button type="button" onClick="{{openCredits}}" aria-label="Title and credits" data-tip="Edit the title and credits" style="display: block; width: calc(100% + 16px); margin: -4px -8px; padding: 4px 8px; border: 0; border-radius: 8px; background: transparent; font: inherit; color: inherit; text-align: inherit; cursor: text">' + m.group(1) + '</button>', h)
def full_laptop(fname, title, main, js_, pops=''):
    html = HEAD % title + LAPFRAME_TOP + f"""<div style="position: absolute; left: 217.7px; top: 124.6px; width: 1710px; height: 904px; overflow: hidden; border-radius: 0 0 16px 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); background: {PAGE}; color: {INK}; font-family: {FONT}; display: flex; flex-direction: column">
{main}
{pops}
</div>
<img src="{LAPTOP_FRAME}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 2143px; height: 1299px; pointer-events: none">
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":2143,"height":1299}}}}'>
{PRE}
{js_}
</script>
</body>
</html>
"""
    open(OUT + fname + '.dc.html', 'w').write(html)

# The phone's layers: the laptop title menu's rows and the rail's places in one sheet, each place a sheet over the
# score with the laptop panel's own body (one implementation), its controls at 44 for a finger
_MH = 'calc(100% - 124px)'
_P44 = lambda h: h.replace('width: 40px; height: 40px; border: 0; border-radius: 20px', 'width: 44px; height: 44px; border: 0; border-radius: 22px')
# ☰ as Flat's phone menu (help.flat.io's mobile menu: Credits, Manage instruments, Version history, Layout, Export):
# the laptop rail's places, each a sheet with the laptop panel's own body; the song's acts are its name's menu, as on
# the laptop; the band's popovers rise as sheets
PH_PLACES = (('Song', 'Song', '{{verName}}', f'<div style="display: flex; flex-direction: column">{VERPANEL()}</div>', None),
             ('View', 'View', '{{viewName}}', VIEWPANEL(links=True, inset=False), None),
             ('Tr', 'Transpose', '{{hdKeyL}}', '', 'openTr'), ('Inst', 'Instruments', '2', '', 'openInst'),
             ('Lay', 'Layout', 'A4', '', 'openLayout'), ('Cred', 'Credits', '', '', 'openCredits'),
             ('Midi', 'MIDI keyboard', '', '', 'phMidiGo'))
PHLAYERS = lambda saved, rows=(), foot='', edit_href='Editor.dc.html': (PHMENU(PH_PLACES, 'Takes.dc.html', PHMODE('edit', 'Player.dc.html', edit_href), head=saved, rows=(('Hist', 'Version history', '{{histAgo}}', 'phHist'),) + tuple(rows), foot=foot, inst='openInst', song=(('Tr', 'Transpose', '{{hdKeyL}}', 'openTr'), ('Cred', 'Credits', '', 'openCredits'))) + PHHIST() + HDRPOPS(False, 0, 0, 0, phone=True) + THINGPAGE('creditsOn', 'phToSong', 'Credits', ED_CREDITS, False)
                          + FSHEET('instOn', 'Instruments', _P44(INST_BODY), back='phToMenu') + FSHEET('pickInstOn', 'New instrument', ED_PICK, back='openInst')
                          + FSHEET('layoutOn', 'Layout', LAY_BODY, back='phToMenu') + FSHEET('trSheetOn', 'Transpose', TRROWS(True), back='phToSong'))
# the ☰'s keys on the editor's own sheet state: the menu is the 'more' sheet, Song and View two more
PHEDKEYS = ("phMenu: () => set({ sheet: st.sheet === 'more' ? null : 'more', hdPop: null, sm: false, exp: false }), phMenuOn: st.sheet === 'more', phMenuX: st.sheet === 'more' ? 'true' : 'false', "
            "phMenuFg: st.sheet === 'more' ? '#A8551F' : '#332921', phClose: () => set({ sheet: null }), phSongOn: st.sheet === 'song', phSong: () => set({ sheet: 'song' }), phViewOn: st.sheet === 'view', phView: () => set({ sheet: st.sheet === 'view' ? null : 'view', hdPop: null }), phExpOn: st.sheet === 'phexp', phExp: () => set({ sheet: 'phexp' }), phHist: () => set({ sheet: null, hist_on: true, histSel: null, hdPop: null }), phViewX: st.sheet === 'view' ? 'true' : 'false', phViewFg: st.sheet === 'view' ? '#A8551F' : '#332921', phHistBack: () => set({ hist_on: false, sheet: 'more' }), "
            + PARTKEYS('st', 'set', [('V', 'Voice'), ('P', 'Piano')]) + " "
            + PHACTS('set', 'sheet: null', lambda m, u: 'toast: ' + m + (" + ' · Undo'" if u else ''), "sheet: 'more'", "sheet: 'song'"))
PHJS = lambda j: (j.replace("const M = 'music'", "const VIEW0 = 'pano', FIT = 378 / 794; const M = 'music'", 1).replace("moreOn: ['more', 'export'].includes(st.sheet),", "moreOn: st.sheet === 'more', " + PHEDKEYS, 1)
                   .replace("href: 'EditorLaptop' + label + '.dc.html', pick", "href: 'Editor' + label + '.dc.html', pick", 1))
# the page prints the open version: with its piano accompaniment, or the melody alone (Original), in Edit as in Practice
def VERPAGE(h, ph=False):
    # ph: on a phone the Parts sheet can hide the Piano, and the page then prints the melody alone
    n = 0
    pia = (lambda a, b: '<sc-if value="{{pianoShown}}" hint-placeholder-val="{{true}}">' + a + '</sc-if><sc-if value="{{pianoHidden}}" hint-placeholder-val="{{false}}">' + b + '</sc-if>') if ph else (lambda a, b: a)
    for a, b in ((A4PAGE(), A4PAGE(piano=False)), (A4PAGE(sel=None), A4PAGE(sel=None, piano=False))) + tuple(
            (score_grand(0, [list(range(13))], sel=(3, 0), size=1.0, natural=sc).replace(ACCENT, '#85B8DC'),
             score_grand(0, [list(range(13))], sel=(3, 0), size=1.0, natural=sc, piano=False).replace(ACCENT, '#85B8DC')) for sc in (0.95, 1.15)):
        n += h.count(a); h = h.replace(a, '<sc-if value="{{isPiano}}" hint-placeholder-val="{{true}}">' + pia(a, b) + '</sc-if><sc-if value="{{isLead}}" hint-placeholder-val="{{false}}">' + b + '</sc-if>')
    assert n
    return h
eph4, elm4 = VERPAGE(eph4, ph=True), VERPAGE(elm4)
phone('Editor', 'Score editor, phone', SHOWSTATES() + eph4, PHJS(ED4), PHLAYERS(ED_SAVED), bar=SHEET)
# Go to bar (research F11, Flat's and Dorico's ⌘G): a small card over the sheet's head, the bar's number and its count
GOTO_FIELD = '<div style="display: flex; align-items: center; gap: 12px"><input value="9" aria-label="Bar" type="text" inputmode="numeric" enterkeyhint="go" style="width: 96px; height: 48px; box-sizing: border-box; padding: 0 16px; border: 0; border-radius: 12px; background: #FEFDFB; box-shadow: 0 0 0 2px #332921; font: inherit; font-size: 17px; font-variant-numeric: tabular-nums; color: #332921; outline: none"><span style="font-size: 15px; color: #7A6E64; font-variant-numeric: tabular-nums">of 16</span></div>'
ED4L = ED4.replace("['The menu open', st.sheet === 'more', { sheet: 'more' }, { sheet: null }]]", "['The menu open', st.sheet === 'more', { sheet: 'more' }, { sheet: null }], ['Go to bar (⌘G)', st.sheet === 'goto', { sheet: 'goto' }, { sheet: null }]]").replace("moreOn: ['more', 'export'].includes(st.sheet),", "moreOn: ['more', 'export'].includes(st.sheet), gotoOn: st.sheet === 'goto',", 1)
_PANEL = (RAIL + f'<sc-if value="{{{{palOn}}}}" hint-placeholder-val="{{{{true}}}}"><aside aria-label="{{{{panelL}}}}" role="tabpanel" data-strip style="flex: none; width: {{{{pw}}}}px; min-height: 0; display: flex; flex-direction: column; background: {SHEET}">'
          + _PIF('railSongOn', PANEL_SONG) + _PIF('railViewOn', PANEL_VIEW) + _PIF('railNotOn', PANEL_NOT, 'true') + _PIF('railInstOn', PANEL_INST) + _PIF('railLayOn', PANEL_LAY) + _PIF('railAudOn', PANEL_AUD) + f'</aside>{VGRIP}</sc-if>')
# Layout's view, as Flat's: the toolbar and keys give way, "Preview of your score" over the page, zoom at its corner
PREVIEW = (f'<div class="nos" style="flex: 1; min-height: 0; overflow: auto; position: relative; background: {FILL}; display: flex; flex-direction: column; align-items: center; padding: 16px 32px 48px">'
           f'<p style="margin: 0 0 24px; font-size: 14px; font-weight: 600; color: {SOFT}">Preview of your score</p>'
           f'<div style="position: absolute; top: 12px; right: 24px; display: flex; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}">' + TBTN('Zoom in', ZINI, 'zoomIn', 'Zoom in · ⌘+') + TBTN('Zoom out', ZOUTI, 'zoomOut', 'Zoom out · ⌘−') + '</div>'
           f'<div style="zoom: 0.8">{A4PAGE(sel=None)}</div></div>')
PREVIEW = VERPAGE(PREVIEW)
elm4 = (elm4.replace(TOOLBAR_L, f'<sc-if value="{{{{notLayView}}}}" hint-placeholder-val="{{{{true}}}}">{TOOLBAR_L}</sc-if>', 1)
        .replace(_PANELOLD, _PANEL, 1)
        .replace(f'<div style="flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column">', f'<sc-if value="{{{{layView}}}}" hint-placeholder-val="{{{{false}}}}">{PREVIEW}</sc-if><sc-if value="{{{{notLayView}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column">', 1)
        .replace('</sc-if></div></div>', '</sc-if></div></sc-if></div>', 1))
LAPLAYERS = lambda sfx: (RENAMEDLG() + HISTVIEW() + HDRPOPS(False, 294, 470, 576)
                                     + POPOVER('exportOn', 'Export', EXPORTMENU, 'left: 400px; top: 300px', 300) + SEARCHCARD + KEYSCARD + THINGPAGE('creditsOn', 'closeSheet', 'Credits', _CRED(True), True))
full_laptop('EditorLaptop', 'Score editor, laptop', SHOWSTATES() + CREDBTN(elm4), ED4L.replace("const M = 'music'", "const VIEW0 = 'page', FIT = (pal, pw) => (pal ? 1710 - 76 - pw - 76 : 1710 - 76 - 64) / 794; const M = 'music'", 1), LAPLAYERS('Laptop.dc.html') + POPOVER('gotoOn', 'Go to bar', GOTO_FIELD, 'left: 665px; top: 76px; transform: translateX(-50%)', 260) )
print('r44 editor ok')
