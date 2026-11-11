# R44: the score editor as the Player in Edit mode (owner, 2026-11-11: "improve all the settings, all the pages … the
# most time on the editor and songs and practice pages"). CLAUDE.md: "the Player's score in Edit mode, sharing its bar
# and transport. A docked panel from 48rem, a bottom sheet on a phone." So the editor wears the Player's light glass
# bar with a Play · Edit switch, full screen on a laptop (no app sidebar, as the Player); under the score a selection
# strip says what is chosen and acts on it (Delete, the piano, Play from here); the palette is Flat's: named
# categories, folded to one row on a phone, every section in one scroll when opened or docked; each tool a real
# notation sign with its name and shortcut in the tooltip. Exec'd by r41.py after r41_songs.py (its kit is in scope).
import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as PS

GL = 'background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(20px) saturate(1.6); backdrop-filter: blur(20px) saturate(1.6); box-shadow: 0 0 0 1px rgba(51,41,33,.07), 0 4px 14px -6px rgba(51,41,33,.25)'
XI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M18 6 6 18M6 6l12 12"></path></svg>'
DELI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M21 5H9l-7 7 7 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"></path><path d="m17 9-6 6M11 9l6 6"></path></svg>'
EXPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m18 15-6-6-6 6"></path></svg>'

ED4 = js(r'''
    // the palette, Flat's categories; each tool: its sign, the font it is drawn in, its name and its shortcut
    const M = 'music', S = 'serif', T = 'text';
    const PAL = [
      ['Notes', [['rest', '𝄽', M, 'Rest', '0'], ['w', '𝅝', M, 'Whole note', '7'], ['h', '𝅗𝅥', M, 'Half note', '6'], ['q', '𝅘𝅥', M, 'Quarter note', '5'], ['e', '𝅘𝅥𝅮', M, 'Eighth note', '4'],
        ['s', '𝅘𝅥𝅯', M, '16th note', '3'], ['t', '𝅘𝅥𝅰', M, '32nd note', '2'], ['x', '𝅘𝅥𝅱', M, '64th note', '1'], ['dot', '𝅘𝅥 .', M, 'Dot', '.'], ['tie', '⁀', T, 'Tie', 'T'], ['tup', '3', S, 'Triplet', '⌘3'], ['grace', '𝆕', M, 'Grace note', 'G']]],
      ['Accidentals', [['bb', '𝄫', M, 'Double flat', '⇧-'], ['b', '♭', M, 'Flat', '-'], ['n', '♮', M, 'Natural', '='], ['sh', '♯', M, 'Sharp', '+'], ['x2', '𝄪', M, 'Double sharp', '⇧+']]],
      ['Articulations', [['stacc', '•', T, 'Staccato', 'S'], ['acc', '>', S, 'Accent', 'A'], ['ten', '–', S, 'Tenuto', 'N'], ['marc', '^', S, 'Marcato', '⇧A'], ['ferm', '𝄐', M, 'Fermata', 'F'], ['stiss', '▾', T, 'Staccatissimo', '⇧S']]],
      ['Dynamics', [['ppp', 'ppp', S, 'Pianississimo', ''], ['pp', 'pp', S, 'Pianissimo', ''], ['p', 'p', S, 'Piano', ''], ['mp', 'mp', S, 'Mezzo-piano', ''], ['mf', 'mf', S, 'Mezzo-forte', ''],
        ['f', 'f', S, 'Forte', ''], ['ff', 'ff', S, 'Fortissimo', ''], ['fff', 'fff', S, 'Fortississimo', ''], ['sfz', 'sfz', S, 'Sforzando', ''], ['cresc', '𝆒', M, 'Crescendo', '<'], ['dim', '𝆓', M, 'Diminuendo', '>']]],
      ['Lines', [['slur', '⌒', T, 'Slur', 'L'], ['8va', '8va', S, 'Octave higher', ''], ['8vb', '8vb', S, 'Octave lower', ''], ['ped', '𝆮', M, 'Pedal', 'P'], ['gliss', '⟋', T, 'Glissando', ''], ['trill', 'tr', S, 'Trill', '']]],
      ['Bar', [['time', '3/4', S, 'Time signature', ''], ['key', '♯', M, 'Key signature', ''], ['clef', '𝄞', M, 'Clef', ''], ['tempo', '♩=80', T, 'Tempo', ''], ['rs', '𝄆', M, 'Repeat start', ''], ['re', '𝄇', M, 'Repeat end', ''],
        ['end1', '1.', S, 'First ending', ''], ['dbl', '𝄁', M, 'Double barline', ''], ['fin', '𝄂', M, 'Final barline', ''], ['addbar', '+ Bar', T, 'Add a bar after', '⌘B']]],
      ['Text', [['chord', 'C⁷', S, 'Chord symbol', '⌘K'], ['lyr', 'la', S, 'Lyrics', '⌘L'], ['txt', 'Aa', T, 'Text', '⌘T'], ['rn', 'IV', S, 'Roman numeral', ''], ['reh', 'A', T, 'Rehearsal mark', '⌘M']]]];

    // the durations, rests and curves drawn as notation, not as a font's glyphs: a head, then the stem and flags
    const HEAD = 'M5.1 19.6c-.7-1.7 1-3.8 3.6-4.7s5.2-.4 5.9 1.3-1 3.8-3.6 4.7-5.2.4-5.9-1.3Z', ST = 'M14.3 17V3.5', FL = (n) => Array.from({ length: n }, (_, i) => 'M14.3 ' + (3.5 + i * 3.6) + 'c0 3.2 4.6 4 4.4 8.4').join('');
    const ICON = { w: ['M4.2 15.5c0-2 2.9-3.5 6.3-3.5s6.3 1.5 6.3 3.5-2.9 3.5-6.3 3.5-6.3-1.5-6.3-3.5Zm4.1-1.6c-.5 1 .6 2.6 2.4 3.4', 'none', ''],
      h: [HEAD, 'none', ST], q: [HEAD, 'currentColor', ST], e: [HEAD, 'currentColor', ST + FL(1)], s: [HEAD, 'currentColor', ST + FL(2)], t: [HEAD, 'currentColor', ST + FL(3)], x: [HEAD, 'currentColor', ST + FL(4)],
      dot: [HEAD, 'currentColor', ST + 'M19.5 18.5h.01'], rest: ['', 'none', 'M9.5 3.5l4.2 4.6-3.6 4 4.3 4.7c-3.2-1.3-5.6.3-3.3 4.6'],
      tie: ['', 'none', 'M3.5 13.5c4.5 5 12.5 5 17 0'], slur: ['', 'none', 'M3.5 16c3.5-8 13.5-8 17 0'], grace: ['M6.6 20.3c-.5-1.2.7-2.7 2.5-3.3s3.7-.3 4.2.9-.7 2.7-2.5 3.3-3.7.3-4.2-.9Z', 'currentColor', 'M13.6 18.6V6c0 2.4 3.4 3 3.2 6.2M9.5 15.5l7-6'] };
    const DUR = { w: 'Whole note', h: 'Half note', q: 'Quarter note', e: 'Eighth note', s: '16th note', t: '32nd note', x: '64th note' };
    const ACC = { bb: '𝄫', b: '♭', n: '', sh: '♯', x2: '𝄪' };
    const dur = st.dur ?? 'h', acc = st.acc ?? 'n', marks = st.marks ?? [], cat = st.cat ?? 'Notes', open = !!st.open, keys = st.keys ?? true, rest = !!st.rest;
    const on = (id) => id === dur || id === acc || (id === 'rest' && rest) || marks.includes(id);
    const FS = { music: 26, serif: 17, text: 17 }, FF = { music: "'Noto Music', serif", serif: "'Instrument Serif', Georgia, serif", text: "'Instrument Sans', system-ui, sans-serif" };
    const tile = ([id, g, f, name, key]) => ({ g, name, isSvg: !!ICON[id], isTxt: !ICON[id], hd: (ICON[id] || [''])[0], hf: (ICON[id] || ['', 'none'])[1], sd: (ICON[id] || ['', '', ''])[2], tip: key ? name + ' · ' + key : name, on: on(id), bg: on(id) ? '#332921' : '#EEE9E2', fg: on(id) ? '#FEFDFB' : '#332921',
      ff: FF[f], fs: g.length > 3 ? 14 : (f === 'music' ? FS.music : FS[f]), fst: f === 'serif' && /^[a-z]/.test(g) ? 'italic' : 'normal', fw: f === 'serif' ? 700 : 600,
      pick: () => { if (DUR[id]) set({ dur: id, rest: false }); else if (id in ACC) set({ acc: id }); else if (id === 'rest') set({ rest: !rest });
        else if (['addbar', 'time', 'key', 'clef', 'tempo', 'chord', 'lyr', 'txt', 'rn', 'reh'].includes(id)) set({ done: name });
        else set({ marks: marks.includes(id) ? marks.filter((m) => m !== id) : [...marks, id] }); } });
    const sections = PAL.map(([c, ts]) => ({ c, tools: ts.map(tile) }));
    const NAME = Object.fromEntries(PAL.flatMap(([, ts]) => ts.map((t) => [t[0], t[3].toLowerCase()])));
    const noteL = rest ? DUR[dur].replace('note', 'rest') : 'C' + ACC[acc] + '5 · ' + DUR[dur].toLowerCase();
    return { ...common(st, set),
      cats: seg(PAL.map((p) => p[0]), cat, (l) => set({ cat: l })), tools: sections.find((s) => s.c === cat).tools, sections,
      open, folded: !open, toggleOpen: () => set({ open: !open }), openLabel: open ? 'Fold the palette' : 'Open the palette', openRot: open ? '180deg' : '0deg',
      noteL, whereL: 'Bar 4 · beat 1 · “sweet”' + (marks.length ? ' · ' + marks.map((m) => NAME[m]).join(', ') : ''),
      keysOn: keys, keysPressed: keys ? 'true' : 'false', keysBg: keys ? '#332921' : 'transparent', keysFg: keys ? '#FEFDFB' : '#332921', toggleKeys: () => set({ keys: !keys }),
      doneOn: !!st.done, doneL: st.done ? st.done + ': tap the score where it goes' : '', clearDone: () => set({ done: null }),
      moreOn: st.sheet === 'more', openMore: () => set({ sheet: 'more' }),
      kb: calmKeys(48, 79, { 72: ['#85B8DC', ''] }, 402, 112), kbL: calmKeys(36, 96, { 72: ['#85B8DC', ''] }, 1330, 132) };''')

# the bar: ✕, the Play · Edit switch, Undo · Redo · ··· (the Player's glass, CLAUDE.md "sharing its bar")
def MODESW(play_href):
    seg_ = 'height: 44px; padding: 0 18px; border-radius: 22px; display: flex; align-items: center; font-size: 15px; text-decoration: none; border: 0; font-family: inherit'
    return (f'<div role="radiogroup" aria-label="Mode" style="display: flex; gap: 0; padding: 0; border-radius: 22px; {GL}">'
            f'<a href="{play_href}" role="radio" aria-checked="false" style="{seg_}; color: {SOFT}; font-weight: 500; background: transparent">Play</a>'
            f'<span role="radio" aria-checked="true" style="{seg_}; color: {SHEET}; font-weight: 600; background: {INK}">Edit</span></div>')
def GBTN(label, svg, act='', href='', tip=''):
    st = f'width: 44px; height: 44px; border: 0; padding: 0; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center; text-decoration: none; position: relative'
    t = f' data-tip="{tip or label}"'
    if href: return f'<a href="{href}" aria-label="{label}"{t} style="{st}">{svg}</a>'
    return f'<button type="button" aria-label="{label}"{t} onClick="{{{{{act}}}}}" style="{st}">{svg}</button>'
def EBAR(close_href, play_href, title=False):
    left = f'<a href="{close_href}" aria-label="Close the editor" data-tip="Close · Esc" style="flex: none; width: 44px; height: 44px; border-radius: 22px; {GL}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{XI}</a>'
    if title:
        left += f'<div style="display: flex; flex-direction: column; gap: 0; min-width: 0"><span style="font-size: 17px; font-weight: 600; white-space: nowrap">Amazing Grace</span><span style="font-size: 13px; color: {SOFT}">Saved on this device</span></div>'
    right = f'<div style="flex: none; display: flex; border-radius: 22px; {GL}">{GBTN("Undo", UNDO, tip="Undo · ⌘Z")}{GBTN("Redo", REDO, tip="Redo · ⇧⌘Z")}{GBTN("Score settings", MORE, "openMore")}</div>'
    return (f'<header style="flex: none; position: relative; z-index: 20; height: 60px; box-sizing: border-box; padding: 8px 16px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px">'
            f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{left}</div>{MODESW(play_href)}<div style="display: flex; justify-content: flex-end">{right}</div></header>')

# the selection strip: what is chosen, and what acts on it
def STRIP(play=True):
    pb = (f'<button type="button" aria-label="Play from here" data-tip="Play from here · Space" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; display: flex; align-items: center; justify-content: center; position: relative">{PLAY}</button>') if play else ''
    return (f'<div style="flex: none; min-height: 60px; box-sizing: border-box; padding: 8px 8px 8px 16px; display: flex; align-items: center; gap: 4px">'
            f'<div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px"><span style="font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap">{{{{noteL}}}}</span>'
            f'<span style="font-size: 13px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{whereL}}}}</span></div>'
            f'{GBTN("Delete the note", DELI, tip="Delete · ⌫")}'
            f'<button type="button" aria-label="Piano keys" data-tip="Piano keys · K" aria-pressed="{{{{keysPressed}}}}" onClick="{{{{toggleKeys}}}}" style="flex: none; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 22px; background: {{{{keysBg}}}}; color: {{{{keysFg}}}}; display: flex; align-items: center; justify-content: center; position: relative">{KEYSI}</button>'
            f'{pb}</div>'
            f'<sc-if value="{{{{doneOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="flex: none; margin: 0 16px 8px; min-height: 44px; box-sizing: border-box; padding: 4px 4px 4px 12px; border-radius: 12px; background: #FBF1DD; display: flex; align-items: center; gap: 8px; font-size: 14px"><span style="flex: 1; min-width: 0">{{{{doneL}}}}</span><button type="button" onClick="{{{{clearDone}}}}" style="height: 36px; padding: 0 8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">Cancel</button></div></sc-if>')

TOOL = (f'<button type="button" aria-label="{{{{t.name}}}}" aria-pressed="{{{{t.on}}}}" data-tip="{{{{t.tip}}}}" onClick="{{{{t.pick}}}}" style="flex: none; position: relative; min-width: 48px; height: 48px; box-sizing: border-box; padding: 0 8px; border: 0; border-radius: 12px; '
        f'background: {{{{t.bg}}}}; color: {{{{t.fg}}}}; font-family: {{{{t.ff}}}}; font-size: {{{{t.fs}}}}px; font-style: {{{{t.fst}}}}; font-weight: {{{{t.fw}}}}; line-height: 1; white-space: nowrap; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{t.isSvg}}}}" hint-placeholder-val="{{{{false}}}}"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="{{{{t.hd}}}}" fill="{{{{t.hf}}}}" stroke="currentColor" stroke-width="1.6"></path><path d="{{{{t.sd}}}}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg></sc-if><sc-if value="{{{{t.isTxt}}}}" hint-placeholder-val="{{{{true}}}}"><span>{{{{t.g}}}}</span></sc-if></button>')
def ED_SECTIONS(gap=16):
    return (f'<sc-for list="{{{{sections}}}}" as="a" hint-placeholder-count="7"><section style="display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 13px; font-weight: 600; color: {SOFT}">{{{{a.c}}}}</h3>'
            f'<div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{a.tools}}}}" as="t" hint-placeholder-count="8">{TOOL}</sc-for></div></section></sc-for>')
TIP_CSS = ('<style data-r44>[data-tip]:hover::after { content: attr(data-tip); position: absolute; left: 50%; top: calc(100% + 6px); z-index: 90; translate: -50% 0; padding: 4px 8px; border-radius: 8px; background: #332921; color: #FEFDFB; '
           "font: 500 12px/16px 'Instrument Sans', system-ui, sans-serif; white-space: nowrap; pointer-events: none } header [data-tip]:hover::after { top: calc(100% + 6px) } "
           '[aria-label="Palette"] [data-tip]:hover::after, [data-strip] [data-tip]:hover::after { top: auto; bottom: calc(100% + 6px) } [role=dialog] > * { flex: none }</style>')

# the phone: the bar over the score, then the sheet: grabber, strip, categories, the tools, the keys
SHEETP = (f'<section aria-label="Palette" data-strip style="flex: none; position: relative; z-index: 10; border-radius: 22px 22px 0 0; background: {SHEET}; box-shadow: 0 -1px 0 {LINE}, 0 -12px 28px -20px rgba(51,41,33,.5); display: flex; flex-direction: column">'
          f'<button type="button" aria-label="{{{{openLabel}}}}" onClick="{{{{toggleOpen}}}}" style="align-self: center; width: 88px; height: 44px; margin: -12px 0; border: 0; padding: 0; background: transparent; display: flex; align-items: center; justify-content: center"><span style="width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></span></button>'
          + STRIP() +
          f'<div class="nos" style="overflow-x: auto; padding: 0 16px 8px"><div style="width: 640px">{PS.SEG("cats", 7)}</div></div>'
          f'<sc-if value="{{{{folded}}}}" hint-placeholder-val="{{{{true}}}}"><div class="nos" style="display: flex; gap: 8px; overflow-x: auto; padding: 0 16px 12px"><sc-for list="{{{{tools}}}}" as="t" hint-placeholder-count="12">{TOOL}</sc-for></div></sc-if>'
          f'<sc-if value="{{{{open}}}}" hint-placeholder-val="{{{{false}}}}"><div class="nos" style="max-height: 300px; overflow-y: auto; padding: 4px 16px 16px; display: flex; flex-direction: column; gap: 16px">{ED_SECTIONS()}</div></sc-if>'
          f'<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="padding: 0 0 26px">{KEYS(112).replace("border-radius: 14px;", "border-radius: 0;")}</div></sc-if>'
          f'<sc-if value="{{{{notKeys}}}}" hint-placeholder-val="{{{{false}}}}"><div style="height: 26px"></div></sc-if></section>')
ED4 = ED4.replace("keysOn: keys,", "keysOn: keys, notKeys: !keys,", 1)
eph4 = (TIP_CSS + EBAR('Song.dc.html', 'Player.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 12px 16px">{SCOREPAGE(360, 0.95, "16px 12px 8px")}</div>' + SHEETP)

# the laptop: full screen as the Player; the score, the keys under it; the palette docked at the right
elm4 = (TIP_CSS + EBAR('SongLaptop.dc.html', 'PlayerLaptop.dc.html', title=True).replace('padding: 8px 16px;', 'padding: 12px 24px; height: 72px;')
        + f'<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) 380px">'
        f'<div style="min-width: 0; min-height: 0; display: flex; flex-direction: column">'
        f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 48px 24px; display: flex; justify-content: center"><div style="width: 800px">{SCOREPAGE(760, 1.3, "32px 40px 16px")}</div></div>'
        f'<sc-if value="{{{{keysOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="flex: none; box-shadow: 0 -1px 0 {LINE}">{KEYS(132).replace("kb.", "kbL.").replace("border-radius: 14px;", "border-radius: 0;")}</div></sc-if></div>'
        f'<aside aria-label="Palette" data-strip style="min-height: 0; display: flex; flex-direction: column; background: {SHEET}; box-shadow: -1px 0 0 {LINE}">'
        + STRIP() + f'<div style="height: 1px; margin: 0 16px; background: {LINE}"></div>'
        f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 20px">{ED_SECTIONS()}</div></aside></div>')

# ··· Score settings: what the score does not print (the printed things open from the score itself)
ED_MORE4 = (f'<div style="{PS.CARD}">' + PS.LINK('Instruments and staves', 'stv') + PS.LINK('Page layout', 'lay', PS.SEP) + PS.LINK('Playback sound', 'snd', PS.SEP) + PS.LINK('MIDI keyboard', 'midi', PS.SEP) + '</div>'
            f'<div style="{PS.CARD}">' + PS.LINK('Export', 'exp') + PS.LINK('Print', 'prn', PS.SEP) + '</div>'
            f'<div style="{PS.CARD}"><a href="Take.dc.html" style="min-height: 52px; display: flex; align-items: center; gap: 12px; padding: 0 16px; color: {INK}; text-decoration: none; font-size: 16px"><span style="flex: 1">Takes: 3</span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a></div>'
            f'<p style="margin: 0; padding: 0 16px; font-size: 13px; color: {SOFT}">Title, key, time signature and tempo are edited where they print: tap them on the score.</p>')
ED4 = ED4.replace("moreOn: st.sheet === 'more',", "moreOn: st.sheet === 'more', " + ", ".join(
    f"{k}: '', {k}On: false, {k}Val: '{v}', {k}ValC: '#685E56'" for k, v in (('stv', 'Piano'), ('lay', 'Pages'), ('snd', 'Grand piano'), ('midi', 'None'), ('exp', ''), ('prn', ''))) + ",", 1)

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

phone('Editor', 'Score editor, phone', eph4, ED4, BSHEET('moreOn', 'Score settings', ED_MORE4).replace('max-height: 86%', 'max-height: calc(100% - 124px)', 1))
full_laptop('EditorLaptop', 'Score editor, laptop', elm4, ED4, POPOVER('moreOn', 'Score settings', ED_MORE4.replace('Take.dc.html', 'TakeLaptop.dc.html'), 'right: 24px; top: 76px', 380))
print('r44 editor ok')
