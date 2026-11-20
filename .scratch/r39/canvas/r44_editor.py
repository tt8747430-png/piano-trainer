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
DELI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M21 5H9l-7 7 7 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"></path><path d="m17 9-6 6M11 9l6 6"></path></svg>'
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
    const REC = (st.recent ?? ['q', 'e', 'stacc', 'acc', 'slur', 'mf', 'p', 'chord']).filter((id) => ALLT[id]).slice(0, 8).map((id) => ALLT[id]);
    const PALR = [['Recent', REC], ...PAL];
    // each group folds by its heading, as Dorico's panels (dorico 142: Immediate Dynamics ⌄)
    const shut = st.shut ?? [];
    const sections = PALR.map(([c, ts]) => ({ c, tools: fill(ts.map(tile)), isOpen: !shut.includes(c), rot: shut.includes(c) ? '-90deg' : '0deg', fold: () => set({ shut: shut.includes(c) ? shut.filter((x) => x !== c) : [...shut, c] }) }));
    const NAME = Object.fromEntries(PAL.flatMap(([, ts]) => ts.map((t) => [t[0], t[3].toLowerCase()])));
    const noteL = rest ? DUR[dur].replace('note', 'rest') : 'G' + ACC[acc] + '4 · ' + DUR[dur].toLowerCase();
    return { ...common(st, set),
      cats: seg(PALR.map((p) => p[0]), cat, (l) => set({ cat: l })), catsI: PALR.map(([c]) => { const [g, f] = CATI[c]; return { c, g, ff: FF[f], fs: f === 'music' ? 22 : f === 'serif' ? 18 : 15, fst: f === 'serif' ? 'italic' : 'normal', fw: f === 'serif' ? 700 : 600, on: c === cat ? 'true' : 'false', bg: c === cat ? '#FEFDFB' : 'transparent', sh: c === cat ? '0 1px 2px rgba(51,41,33,.12)' : 'none', fg: c === cat ? '#332921' : '#685E56', pick: () => set({ cat: c }) }; }), tools: sections.find((s) => s.c === cat).tools, sections,
      open, folded: !open, toggleOpen: () => set({ open: !open }), openLabel: open ? 'Fold the palette' : 'Open the palette', openRot: open ? '180deg' : '0deg',
      noteL, whereL: 'Bar 4 · beat 1 · “sweet”' + (voice ? ' · voice 2' : '') + (marks.length ? ' · ' + marks.map((m) => NAME[m]).join(', ') : ''),
      keysOn: keys, keysPressed: keys ? 'true' : 'false', keysBg: keys ? '#332921' : 'transparent', keysFg: keys ? '#FEFDFB' : '#332921', toggleKeys: () => set({ keys: !keys }),
      undo: () => { if (marks.length) set({ marks: marks.slice(0, -1), undone: [...(st.undone ?? []), { m: marks[marks.length - 1] }] }); else if (rest) set({ rest: false, undone: [...(st.undone ?? []), { r: true }] }); },
      redo: () => { const u = st.undone ?? []; if (!u.length) return; const x = u[u.length - 1]; set(x.r ? { rest: true, undone: u.slice(0, -1) } : { marks: [...marks, x.m], undone: u.slice(0, -1) }); },
      delNote: () => set({ rest: true, undone: [] }),
      doneOn: !!st.done, doneL: st.done ? st.done + ': tap the score where it goes' : '', clearDone: () => set({ done: null }),
      moreOn: st.sheet === 'more', openMore: () => set({ sheet: 'more' }),
      states: [['The palette open', open, { open: true }, { open: false }], ['A rest chosen', rest, { rest: true }, { rest: false }], ['Crossed to the lower staff', marks.includes('xdn'), { marks: [...marks, 'xdn'] }, { marks: marks.filter((m) => m !== 'xdn') }], ['Voice 2 on', voice, { voice: true }, { voice: false }],
        ['A clef waiting for its place', st.done === 'Treble clef', { done: 'Treble clef' }, { done: null }], ['The piano hidden', !keys, { keys: false }, { keys: true }],
        ['The menu open', st.sheet === 'more', { sheet: 'more' }, { sheet: null }]].map(([l, on2, o, off]) => ({ l, bg: on2 ? '#332921' : '#EEE9E2', pick: () => set(on2 ? off : o) })),
      kb: calmKeys(50, 76, { 67: ['#85B8DC', ''] }, 402, 112), kbL: calmKeys(36, 96, { 67: ['#85B8DC', ''] }, 1330, 170) };''')

# the bar: ✕, the Play · Edit switch (the kit's MODESW), Undo · Redo · ··· (the Player's glass, CLAUDE.md "sharing its bar")
def GBTN(label, svg, act='', href='', tip=''):
    st = f'width: 44px; height: 44px; border: 0; padding: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none; position: relative'
    t = f' data-tip="{tip or label}"'
    if href: return f'<a href="{href}" aria-label="{label}"{t} style="{st}">{svg}</a>'
    return f'<button type="button" aria-label="{label}"{t} onClick="{{{{{act}}}}}" style="{st}">{svg}</button>'
def EBAR(close_href, play_href, title=False):
    left = f'<a href="{close_href}" aria-label="Close the editor" data-tip="Close · Esc" style="flex: none; width: 44px; height: 44px; border-radius: 22px; {GL}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{XI}</a>'
    if title:
        left += f'<div style="display: flex; align-items: center; min-width: 0"><span style="font-size: 13px; color: {SOFT}">Saved on this device</span></div>'
    right = f'<div style="flex: none; display: flex; border-radius: 22px; {GL}">{GBTN("Undo", UNDO, "undo", tip="Undo · ⌘Z")}{GBTN("Redo", REDO, "redo", tip="Redo · ⇧⌘Z")}{GBTN("More", MORE, "openMore")}</div>'
    return (f'<header style="flex: none; position: relative; z-index: 20; {MODEBAR_P}">'
            f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{left}</div>{MODESW("edit", play_href)}<div style="display: flex; justify-content: flex-end">{right}</div></header>')

# the selection strip: what is chosen, and what acts on it
def STRIP(play=True):
    # the editor's Record (the record-take feature): a take of what the learner plays, kept in Takes; beside Play
    pb = (f'<button type="button" aria-label="Play from here" data-tip="Play from here · Space" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{PLAY}</button>') if play else ''
    return (f'<div role="toolbar" aria-label="The chosen note" style="flex: none; min-height: 60px; box-sizing: border-box; padding: 8px 8px 8px 16px; display: flex; align-items: center; gap: 4px">'
            f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap">{{{{noteL}}}}</span>'
            f'<span style="font-size: 13px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{whereL}}}}</span></div>'
            f'{GBTN("Delete the note", DELI, "delNote", tip="Delete · ⌫")}'
            f'<button type="button" aria-label="Piano keys" data-tip="Piano keys · K" aria-pressed="{{{{keysPressed}}}}" onClick="{{{{toggleKeys}}}}" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: {{{{keysBg}}}}; color: {{{{keysFg}}}}; display: flex; align-items: center; justify-content: center; position: relative">{KEYSI}</button>'
            f'<button type="button" aria-label="Record a take" data-tip="Record a take" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: transparent; display: flex; align-items: center; justify-content: center; position: relative"><span aria-hidden="true" style="width: 16px; height: 16px; border-radius: 8px; background: #B84A3E; box-shadow: 0 0 0 3px #FEFDFB, 0 0 0 4.5px #B84A3E"></span></button>'
            f'{pb}</div>'
            f'<sc-if value="{{{{doneOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="flex: none; margin: 0 16px 8px; min-height: 44px; box-sizing: border-box; padding: 4px 4px 4px 12px; border-radius: 12px; background: #FBF1DD; display: flex; align-items: center; gap: 8px; font-size: 14px"><span style="flex: 1; min-width: 0">{{{{doneL}}}}</span><button type="button" onClick="{{{{clearDone}}}}" style="height: 36px; padding: 0 8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">Cancel</button></div></sc-if>')

TOOL = (f'<button type="button" aria-hidden="{{{{t.hid}}}}" tabindex="{{{{t.ti}}}}" aria-label="{{{{t.name}}}}" aria-pressed="{{{{t.on}}}}" data-tip="{{{{t.tip}}}}" onClick="{{{{t.pick}}}}" style="flex: none; position: relative; min-width: 48px; height: 48px; box-sizing: border-box; padding: 0 8px; border: 0; border-radius: 12px; '
        f'background: {{{{t.bg}}}}; color: {{{{t.fg}}}}; font-family: {{{{t.ff}}}}; font-size: {{{{t.fs}}}}px; font-style: {{{{t.fst}}}}; font-weight: {{{{t.fw}}}}; line-height: 1; white-space: nowrap; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{t.isSvg}}}}" hint-placeholder-val="{{{{false}}}}"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="{{{{t.hd}}}}" fill="{{{{t.hf}}}}" stroke="currentColor" stroke-width="1.6"></path><path d="{{{{t.sd}}}}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg></sc-if><sc-if value="{{{{t.isTxt}}}}" hint-placeholder-val="{{{{true}}}}"><span>{{{{t.g}}}}</span></sc-if></button>')
def ED_SECTIONS(gap=16):
    cell = TOOL.replace('min-width: 48px', 'min-width: 0; grid-column: span {{t.span}}').replace('border-radius: 12px; ', 'border-radius: 0; ').replace('background: {{t.bg}}', 'background: {{t.gbg}}; box-shadow: 1px 0 0 '+LINE+', 0 1px 0 '+LINE)
    return (f'<sc-for list="{{{{sections}}}}" as="a" hint-placeholder-count="7"><section style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0"><button type="button" aria-expanded="{{{{a.isOpen}}}}" onClick="{{{{a.fold}}}}" style="width: 100%; min-height: 44px; margin: -6px 0; padding: 0; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: space-between">{{{{a.c}}}}<span style="color: {SOFT}; display: flex; transform: rotate({{{{a.rot}}}}); transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1)">{CHEV_D}</span></button></h3>'
            f'<sc-if value="{{{{a.isOpen}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); background: {SHEET}; border: 1px solid {LINE}; border-radius: 12px; overflow: hidden"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="8">{cell}</sc-for></div></sc-if></section></sc-for>')
TIP_CSS = ('<style data-r44>[data-tip]:hover::after { content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 6px); z-index: 90; translate: -50% 0; padding: 4px 8px; border-radius: 8px; background: #332921; color: #FEFDFB; '
           "font: 500 12px/16px 'Instrument Sans', system-ui, sans-serif; white-space: nowrap; pointer-events: none } header [data-tip]:hover::after { top: calc(100% + 6px) } "
           '[aria-label="Palette"] [data-tip]:hover::after, [data-strip] [data-tip]:hover::after { top: auto; bottom: calc(100% + 6px) } [role=dialog] > * { flex: none } [data-tip=""]:hover::after { display: none } [aria-label="Categories"] > button::before { content: ""; position: absolute; inset: -2px 0 }</style>')

CATBAR = (f'<div style="flex: none; display: flex; align-items: center; gap: 8px; padding: 0 16px 8px"><div role="tablist" aria-label="Categories" class="nos" style="flex: 1; min-width: 0; display: flex; overflow-x: auto; padding: 2px; border-radius: 12px; background: {FILL}">'
          f'<sc-for list="{{{{catsI}}}}" as="c" hint-placeholder-count="12"><button type="button" role="tab" aria-label="{{{{c.c}}}}" aria-selected="{{{{c.on}}}}" data-tip="{{{{c.c}}}}" onClick="{{{{c.pick}}}}" style="flex: none; position: relative; min-width: 44px; height: 40px; padding: 0 6px; box-sizing: border-box; border: 0; border-radius: 10px; background: {{{{c.bg}}}}; box-shadow: {{{{c.sh}}}}; color: {{{{c.fg}}}}; font-family: {{{{c.ff}}}}; font-size: {{{{c.fs}}}}px; font-style: {{{{c.fst}}}}; font-weight: {{{{c.fw}}}}; line-height: 1; white-space: nowrap; display: flex; align-items: center; justify-content: center">{{{{c.g}}}}</button></sc-for></div>'
          f'<button type="button" aria-label="{{{{openLabel}}}}" data-tip="{{{{openLabel}}}}" onClick="{{{{toggleOpen}}}}" style="flex: none; position: relative; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center"><span style="display: flex; rotate: {{{{openRot}}}}">{EXPI}</span></button></div>')

# the phone: the bar over the score, then the sheet: grabber, strip, categories, the tools, the keys
SHEETP = (f'<section aria-label="Palette" data-strip style="flex: none; position: relative; z-index: 10; border-radius: 22px 22px 0 0; background: {SHEET}; box-shadow: 0 -1px 0 {LINE}, 0 -12px 28px -20px rgba(51,41,33,.5); display: flex; flex-direction: column">'
          f'<button type="button" class="edgrab" aria-label="{{{{openLabel}}}}" onClick="{{{{toggleOpen}}}}" style="align-self: center; width: 88px; height: 44px; margin: -12px 0; border: 0; padding: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></span></button>'
          + STRIP() +
          f'<sc-if value="{{{{folded}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Tools" class="nos" style="display: flex; gap: 4px; overflow-x: auto; padding: 0 16px 8px"><sc-for list="{{{{tools}}}}" as="t" hint-placeholder-count="12">{TOOL}</sc-for></div></sc-if>'
          f'<sc-if value="{{{{open}}}}" hint-placeholder-val="{{{{false}}}}"><div class="nos" style="max-height: 300px; overflow-y: auto; padding: 4px 16px 16px; display: flex; flex-direction: column; gap: 16px">{ED_SECTIONS()}</div></sc-if>'
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
eph4 = (TIP_CSS + EBAR('Song.dc.html', 'Player.dc.html')
        + '<div class="edlay" style="flex: 1; min-height: 0; display: flex; flex-direction: column">'
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 12px 16px">{SCOREPAGE(360, 0.95, "7px 12px 8px")}</div>' + SHEETP + '</div>' + EDLAY_CSS)

# the laptop: full screen as the Player; the score, the keys under it; the palette docked at the right
elm4 = (TIP_CSS + EBAR('SongLaptop.dc.html', 'PlayerLaptop.dc.html', title=True).replace(MODEBAR_P, MODEBAR_L)
        + f'<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 380px">'
        f'<div style="min-width: 0; min-height: 0; display: flex; flex-direction: column">'
        f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 48px 24px; display: flex; justify-content: center"><div style="width: 1000px">{SCOREPAGE(960, 1.3, "10px 40px 16px")}</div></div>'
        f'<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; box-shadow: 0 -1px 0 {LINE}">{KEYS(170, "kbL", edge=True)}</div></sc-if></div>'
        f'<aside aria-label="Palette" data-strip style="min-height: 0; display: flex; flex-direction: column; background: {SHEET}; box-shadow: -1px 0 0 {LINE}">'
        + STRIP() + f'<div style="height: 1px; margin: 0 16px; background: {LINE}"></div>'
        f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 20px">{ED_SECTIONS()}</div></aside></div>')

# ··· the score's menu, as Flat's ≡ (owner, 2026-11-16: "new completely new design"; flat-score-editor 083–090): what
# the score does not print, one row each, then Publish as its own card. Credits and Instruments open their sheets.
EYEI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
SOLOI = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"></circle><text x="12" y="16.4" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">S</text></svg>'
MENUCARD = lambda *rows: GROUP(*rows, bg=SHEET)
# The menu as the app holds it (loop round 61): the score's acts, then its settings each by name, then its files.
# Publishing is the song's Settings' (one way to each act), never a card in this menu.
# Versions only on an editor's draft of a built-in song (the published versions it restores), and Export only on the
# learner's own song or version, which it writes; a learner's song has no versions,
# and the on-screen piano has no settings page to open, so neither row is drawn where it would open nothing.
ED_MENU = lambda sfx, vh=None: (MENUCARD(('link', 'Title and credits', 'Amazing Grace', 'openCredits'), ('link', 'Score view', 'Pages', ''), ('link', 'Transpose', 'G major', ''), ('link', 'Takes', '3', 'Takes' + sfx), *((('link', 'Versions', '', vh),) if vh else ()))
                       + MENUCARD(('link', 'Instruments', '2', 'openInst'), ('link', 'Layout', '', ''), ('link', 'Note input', '', ''), ('link', 'Recording', '', ''), ('link', 'MIDI keyboard', 'None', ''), *((('link', 'Shortcuts', '?', ''),) if 'Laptop' in sfx else ()))
                       + MENUCARD(*(() if vh else (('link', 'Export…', 'MusicXML, MIDI', ''),)), ('action', 'Print', 'closeSheet', INK)))
FIELD = lambda label, val: (f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: {SOFT}">{label}</span>'
                            f'<input {KB["title"]} value="{val}" placeholder="{label}" style="height: 48px; box-sizing: border-box; padding: 0 16px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>')
ED_CREDITS = (FIELD('Title', 'Amazing Grace') + FIELD('Subtitle', '') + FIELD('Words', 'John Newton') + FIELD('Music', 'New Britain') + FIELD('Arranged by', 'Ana Popescu') + FIELD('Copyright', 'Public domain')
              + f'<div style="display: flex">{BTN("Save", "closeSheet", h=48)}</div>')
INSTROW = lambda name, staff, k: (f'<div style="min-height: 60px; display: flex; align-items: center; gap: 12px; padding: 0 6px 0 16px"><span style="flex: none; color: {INK}; display: flex">{KEYSI}</span>'
                               f'<span style="flex: 1; display: flex; flex-direction: column"><span style="font-size: 16px; font-weight: 600">{name}</span><span style="font-size: 13px; color: {SOFT}">{staff}</span></span>'
                               f'<button type="button" aria-label="Solo {name}" data-tip="Solo" aria-pressed="{{{{solo{k}On}}}}" onClick="{{{{toggleSolo{k}}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: {{{{solo{k}Bg}}}}; color: {{{{solo{k}Fg}}}}; display: flex; align-items: center; justify-content: center">{SOLOI}</button>'
                               f'<button type="button" aria-label="Show {name}" data-tip="Show" aria-pressed="{{{{show{k}On}}}}" onClick="{{{{toggleShow{k}}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {{{{show{k}Fg}}}}; display: flex; align-items: center; justify-content: center">{EYEI}</button></div>')
ED_PICK = GROUP(('action', 'Violin', 'addViolin'), ('action', 'Viola', 'addViola'), ('action', 'Cello', 'addCello'), ('action', 'Flute', 'addFlute'), ('action', 'Clarinet', 'addClarinet'), ('action', 'Guitar', 'addGuitar'), ('action', 'Organ', 'addOrgan'), bg=SHEET)
ED_INST = (f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">{INSTROW("Piano", "Treble and bass staves", "P")}<div style="height: 1px; margin-left: 52px; background: {FILL}"></div>{INSTROW("Voice", "Melody and words", "V")}<sc-if value="{{{{addedOn}}}}" hint-placeholder-val="{{{{false}}}}"><div style="height: 1px; margin-left: 52px; background: {FILL}"></div>{INSTROW("{{addedN}}", "{{addedS}}", "A")}</sc-if></div>'
           f'<div style="display: flex">{BTN("Add an instrument", "addInst", kind="quiet", h=48)}</div>')
ED4 = ED4.replace("moreOn: st.sheet === 'more',", "moreOn: st.sheet === 'more', creditsOn: st.sheet === 'credits', instOn: st.sheet === 'inst', openCredits: () => set({ sheet: 'credits' }), openInst: () => set({ sheet: 'inst' }), "
                  + "".join(f"solo{k}On: st.solo === '{n}', toggleSolo{k}: () => set({{ solo: st.solo === '{n}' ? null : '{n}' }}), solo{k}Bg: st.solo === '{n}' ? '#332921' : 'transparent', solo{k}Fg: st.solo === '{n}' ? '#FEFDFB' : '#332921', show{k}On: !(st.hide || []).includes('{n}'), toggleShow{k}: () => set({{ hide: (st.hide || []).includes('{n}') ? (st.hide || []).filter((x) => x !== '{n}') : [...(st.hide || []), '{n}'] }}), show{k}Fg: (st.hide || []).includes('{n}') ? '#BFB3A7' : '#332921', " for k, n in (('P', 'Piano'), ('V', 'Voice'), ('A', 'Added'))) + "addedOn: !!st.added, addedN: st.added || '', addedS: { Cello: 'Bass staff', Organ: 'Treble, bass and pedal staves', Viola: 'Alto staff' }[st.added] || 'Treble staff', addInst: () => set({ sheet: 'pickInst' }), pickInstOn: st.sheet === 'pickInst', " + "".join(f"add{n}: () => set({{ added: '{n}', sheet: 'inst' }}), " for n in ['Violin', 'Viola', 'Cello', 'Flute', 'Clarinet', 'Guitar', 'Organ']), 1)

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

phone('Editor', 'Score editor, phone', SHOWSTATES() + eph4, ED4, BSHEET('moreOn', 'Amazing Grace', ED_SAVED + ED_MENU('.dc.html'), maxh='calc(100% - 124px)') + BSHEET('creditsOn', 'Credits', ED_CREDITS, 'Cancel', maxh='calc(100% - 124px)') + BSHEET('instOn', 'Instruments', ED_INST, maxh='calc(100% - 124px)') + BSHEET('pickInstOn', 'Add an instrument', ED_PICK, 'Cancel', maxh='calc(100% - 124px)'))
# Go to bar (research F11, Flat's and Dorico's ⌘G): a small card over the sheet's head, the bar's number and its count
GOTO_FIELD = '<div style="display: flex; align-items: center; gap: 12px"><input value="9" aria-label="Bar" type="text" inputmode="numeric" enterkeyhint="go" style="width: 96px; height: 48px; box-sizing: border-box; padding: 0 16px; border: 0; border-radius: 12px; background: #FEFDFB; box-shadow: 0 0 0 2px #332921; font: inherit; font-size: 17px; font-variant-numeric: tabular-nums; color: #332921; outline: none"><span style="font-size: 15px; color: #7A6E64; font-variant-numeric: tabular-nums">of 16</span></div>'
ED4L = ED4.replace("['The menu open', st.sheet === 'more', { sheet: 'more' }, { sheet: null }]]", "['The menu open', st.sheet === 'more', { sheet: 'more' }, { sheet: null }], ['Go to bar (⌘G)', st.sheet === 'goto', { sheet: 'goto' }, { sheet: null }]]").replace("moreOn: st.sheet === 'more',", "moreOn: st.sheet === 'more', gotoOn: st.sheet === 'goto',", 1)
full_laptop('EditorLaptop', 'Score editor, laptop', SHOWSTATES() + elm4, ED4L, POPOVER('moreOn', 'Amazing Grace', ED_MENU('Laptop.dc.html'), 'right: 24px; top: 76px') + POPOVER('gotoOn', 'Go to bar', GOTO_FIELD, 'left: 665px; top: 76px; transform: translateX(-50%)', 260) + POPOVER('creditsOn', 'Credits', ED_CREDITS, 'right: 24px; top: 76px') + POPOVER('instOn', 'Instruments', ED_INST, 'right: 24px; top: 76px') + POPOVER('pickInstOn', 'Add an instrument', ED_PICK, 'right: 24px; top: 76px'))
print('r44 editor ok')
