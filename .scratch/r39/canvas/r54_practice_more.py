# R54: Practice and editor routes still missing strings from src/shared/i18n/locales/en:
#   Trainer         — /practice/quiz/$trainerId: setup (Drill, Shown, Level or Custom with its selection sheet, Timing,
#                     Rounds, the record line), a Play it round on the piano (Check, Clear, Show answer), Results
#   Check           — /check?of=: a song's chords checked before it is marked learned, and its result
#   ProgressionEdit — EDITOR: /practice/progressions/$id/edit, /settings, /publish (the draft's Publish), others' gate
#   Pattern         — /practice/accompaniment/patterns/$ref (built-in or own), /new and /edit, /publish
#   Take            — /edit/$pieceId/takes/$takeId: name, play, piano roll, Keep bars, Download, Delete
#   PlayWalk, PlayChromatic, PlayProgression, PlayExercise — the Player's variants: their setup over the Player
# Exec'd by r41.py after r53_songs_more (uses its IF, NARROW, WIDE, PAGEHEAD_L, H1, TOASTS, TOAST_JS, STRIP, EMPTY).

LAPSHEET = lambda s, w=440: s.replace('left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%', f'left: 50%; bottom: auto; top: 50%; transform: translate(-50%, -50%); width: {w}px; z-index: 61; max-height: 86%').replace('border-radius: 22px 22px 0 0', 'border-radius: 20px')
WRAPCHIPS = lambda lst: KCHIPS(lst).replace('flex: none; display: flex; gap: 8px; overflow-x: auto; margin: -4px -16px; padding: 0 16px', 'display: flex; flex-wrap: wrap; gap: 0 6px; margin: -4px 0')
# A piano whose keys are buttons: k.tap marks or unmarks a key (the trainer's Play it, the Check)
def TAPKEYS(lst, h):
    return (f'<div style="position: relative; flex: none; width: 100%; height: {h}px; overflow: hidden; background: {LINE}">'
            f'<sc-for list="{{{{{lst}.whites}}}}" as="k" hint-placeholder-count="14"><button type="button" aria-label="{{{{k.name}}}}" aria-pressed="{{{{k.on}}}}" onClick="{{{{k.tap}}}}" style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {h}px; box-sizing: border-box; border: 0; border-right: 1px solid {LINE}; background: {{{{k.bg}}}}; padding: 0 0 8px; display: flex; align-items: flex-end; justify-content: center; font: inherit; font-size: 12px; font-weight: 700; color: {INK}">{{{{k.label}}}}</button></sc-for>'
            f'<sc-for list="{{{{{lst}.blacks}}}}" as="k" hint-placeholder-count="10"><button type="button" aria-label="{{{{k.name}}}}" aria-pressed="{{{{k.on}}}}" onClick="{{{{k.tap}}}}" style="position: absolute; left: {{{{k.left}}}}px; top: 0; width: {{{{k.w}}}}px; height: {round(h * 0.62)}px; border: 0; border-radius: 0 0 5px 5px; background: {{{{k.bg}}}}; padding: 0 0 6px; display: flex; align-items: flex-end; justify-content: center; font: inherit; font-size: 11px; font-weight: 700; color: {INK}"></button></sc-for></div>')
KEYS_JS = r'''
    const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], WHITE = [0, 2, 4, 5, 7, 9, 11];
    const tapKeys = (lo, hi, W, H, on, tap, paint) => {
      const ws = []; for (let m = lo; m <= hi; m++) if (WHITE.includes(m % 12)) ws.push(m);
      const w = W / ws.length, bw = w * 0.6, nm = (m) => NAMES[m % 12] + (Math.floor(m / 12) - 1);
      const whites = ws.map((m, i) => ({ name: nm(m), on: on.includes(m), left: (i * w).toFixed(1), w: w.toFixed(1), bg: paint[m] || (on.includes(m) ? '#F2B33D' : '#FEFDFB'), label: on.includes(m) || paint[m] ? NAMES[m % 12] : (m % 12 === 0 ? 'C' + (Math.floor(m / 12) - 1) : ''), tap: () => tap(m) }));
      const blacks = []; for (let m = lo; m <= hi; m++) { if (WHITE.includes(m % 12)) continue; const i = ws.indexOf(m - 1); blacks.push({ name: nm(m), on: on.includes(m), left: ((i + 1) * w - bw / 2).toFixed(1), w: bw.toFixed(1), bg: paint[m] || (on.includes(m) ? '#F2B33D' : '#332C28'), tap: () => tap(m) }); }
      return { whites, blacks };
    };'''

# ════ Trainer and Check ════
TR_SRC = r'''
    const S = (o) => set(o), MODE = __MODE__;''' + TOAST_JS + KEYS_JS + r'''
    const drill = st.drill ?? 'Play it', shown = st.shown ?? 'Name', level = st.level ?? 'The main chords of C', custom = level === 'Custom';
    const Q = ['major', 'minor', 'diminished', 'augmented', 'sus2', 'sus4', 'major 7th', 'dominant 7th', 'minor 7th', 'half-diminished 7th', 'diminished 7th', 'minor-major 7th', 'augmented 7th', '6th'];
    const REC = ['major', 'minor', 'diminished', 'augmented', 'major 7th', 'dominant 7th', 'minor 7th', 'half-diminished 7th', 'diminished 7th'];
    const inc = st.inc ?? REC, isRec = inc.length === REC.length && REC.every((q) => inc.includes(q));
    const tl = st.tl ?? 0, TL = ['Off', '5 s', '10 s', '20 s', '30 s'], rounds = st.rounds ?? 10, RN = (n) => n === 0 ? 'Until stopped' : String(n);
    const auto = st.auto ?? true;
    // the round: Build E♭m7 (E♭ G♭ B♭ D♭) or, for a Check, a song's chord
    const CK = [['Build G', [55, 59, 62], 'G B D'], ['Build C', [60, 64, 67], 'C E G'], ['Build D', [62, 66, 69], 'D F♯ A'], ['Build Em', [64, 67, 71], 'E G B'], ['Build D7', [62, 66, 69, 72], 'D F♯ A C'], ['Build Am', [57, 60, 64], 'A C E']];
    const TRQ = [['Build E♭m7', [63, 66, 70, 73], 'E♭ G♭ B♭ D♭'], ['Build A♭maj7', [56, 60, 63, 67], 'A♭ C E♭ G'], ['Build F♯°', [54, 57, 60], 'F♯ A C']];
    const SET = MODE === 'check' ? CK : TRQ, total = MODE === 'check' ? CK.length : (rounds || 10), n = st.n ?? (MODE === 'check' ? 2 : 3);
    const [prompt, want, notes] = SET[(n - 1) % SET.length];
    const on = st.on ?? [], verdict = st.verdict ?? null, right = st.right ?? (MODE === 'check' ? 1 : 2), wrong = st.wrong ?? 0;
    const tap = (m) => verdict ? null : S({ on: on.includes(m) ? on.filter((x) => x !== m) : [...on, m] });
    const pc = (a) => [...new Set(a.map((m) => m % 12))].sort().join();
    const check = () => { if (!on.length) return; const ok = pc(on) === pc(want); S({ verdict: ok ? 'right' : 'wrong', right: right + (ok ? 1 : 0), wrong: wrong + (ok ? 0 : 1) }); };
    const paint = {}; if (verdict === 'shown' || verdict === 'wrong') want.forEach((m) => { paint[m] = '#DCE9D6'; }); if (verdict === 'right') want.forEach((m) => { paint[m] = '#DCE9D6'; });
    const next = () => (n >= total ? S({ view: 'results', verdict: null, on: [] }) : S({ n: n + 1, verdict: null, on: [] }));
    const view = st.view ?? (MODE === 'check' ? 'run' : 'setup');
    const hint = !!st.hint;
    const states = [['Keys chosen', on.length > 0 && !verdict && view === 'run', { view: 'run', on: want.slice(0, 2), verdict: null }, { on: [] }],
      ['A wrong answer', verdict === 'wrong', { view: 'run', on: [want[0], want[1] + 1], verdict: 'wrong', wrong: 1 }, { on: [], verdict: null, wrong: 0 }],
      ['A right answer', verdict === 'right', { view: 'run', on: want, verdict: 'right', right: 2 }, { on: [], verdict: null, right: 1 }],
      ['The answer shown', verdict === 'shown', { view: 'run', on: [], verdict: 'shown' }, { verdict: null }],
      ['Results', view === 'results', { view: 'results', verdict: null, on: [] }, { view: 'run' }]]
      .map(([l, on2, o, off]) => ({ l, bg: on2 ? '#332921' : '#EEE9E2', pick: () => S(on2 ? off : o) }));
    return { ...common(st, set), states, isRun: view === 'run', isResults: view === 'results', isCheck: MODE === 'check',
      drills: seg(['Flashcards', 'Name it', 'Play it', 'By ear'], drill, (x) => S({ drill: x })), shownSeg: seg(['Name', 'Keys', 'Staff'], shown, (x) => S({ shown: x })),
      levelV: level, openLevel: () => S({ sheet: 'level' }), levelOn: st.sheet === 'level',
      levels: ['The main chords of C', 'Major and minor in every key', 'Diminished and augmented', 'Sevenths', 'Every quality', 'Custom'].map((l) => ({ l, mark: l === level ? '✓' : '', pick: () => S({ level: l, sheet: l === 'Custom' ? 'custom' : null }) })),
      isCustom: custom, incN: inc.length + ' of ' + Q.length + ' included', openCustom: () => S({ sheet: 'custom' }), customOn: st.sheet === 'custom', recT: isRec ? 'Recommended set' : 'Custom selection',
      quals: Q.map((q) => ({ l: q, bg: inc.includes(q) ? '#332921' : '#EEE9E2', fg: inc.includes(q) ? '#FEFDFB' : '#332921', pick: () => { if (inc.includes(q) && inc.length === 1) { toast('At least one stays included'); return; } S({ inc: inc.includes(q) ? inc.filter((x) => x !== q) : [...inc, q] }); } })),
      selAll: () => S({ inc: Q }), clearSel: () => S({ inc: [Q[0]] }), restore: () => S({ inc: REC }), notRec: !isRec,
      tlV: TL[tl], tlDn: () => S({ tl: Math.max(0, tl - 1) }), tlUp: () => S({ tl: Math.min(TL.length - 1, tl + 1) }), roundsV: RN(rounds), rDn: () => S({ rounds: Math.max(0, rounds - 5) }), rUp: () => S({ rounds: rounds + 5 }),
      autoOn: auto, autoOnBg: auto ? '#44684A' : '#DAD1C8', autoOnX: auto ? 22 : 2, autoT: () => S({ auto: !auto }),
      start: () => S({ view: 'run', n: 1, right: 0, wrong: 0, on: [], verdict: null }),
      roundT: 'Round ' + n + ' of ' + total, prog: Math.round(100 * (n - 1) / total) + '%', rightT: right + ' right', wrongT: wrong + ' wrong', prompt, notesT: notes, hint, notHint: !hint, toggleHint: () => S({ hint: !hint }),
      kb: tapKeys(48, 76, 402, 112, on, tap, paint), kbL: tapKeys(36, 96, 1462, 170, on, tap, paint), check, clear: () => S({ on: [] }), showAns: () => S({ verdict: 'shown', wrong: wrong + 1 }),
      checkBg: on.length ? '#F2B33D' : '#EEE9E2', checkInk: on.length ? '#332921' : '#9A9089', checkNot: !on.length, clearInk: on.length ? '#332921' : '#9A9089',
      waiting: !verdict, answered: !!verdict, vT: verdict === 'right' ? 'Right' : verdict === 'shown' ? 'The answer: ' + notes : 'Not quite: it’s ' + notes, vBg: verdict === 'right' ? '#DCE9D6' : '#F5D6D0', vInk: verdict === 'right' ? '#2F5A35' : '#8E2A20',
      next, nextT: n >= total ? 'Results' : 'Next', endRun: () => S({ view: 'results', verdict: null, on: [] }),
      resT: MODE === 'check' ? (right + ' of ' + total) : (right + ' of ' + (right + wrong)), checkDone: right >= total - 1, checkShort: right < total - 1,
      again: () => S({ view: MODE === 'check' ? 'run' : 'setup', n: 1, right: 0, wrong: 0, on: [], verdict: null }), review: () => S({ view: 'run', n: 1, on: [], verdict: null }),
      closeSheet: () => S({ sheet: null }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: false, undo: () => S({ toast: null }) };'''
TRRUN = (f'<div style="display: flex; align-items: center; gap: 12px"><div style="flex: 1; height: 8px; border-radius: 4px; background: {FILL}"><div style="width: {{{{prog}}}}; height: 8px; border-radius: 4px; background: #44684A"></div></div>'
         f'<span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{roundT}}}}</span></div>'
         f'<div style="display: flex; gap: 8px; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums"><span style="padding: 4px 12px; border-radius: 12px; background: #DCE9D6; color: #2F5A35">{{{{rightT}}}}</span><span style="padding: 4px 12px; border-radius: 12px; background: {FILL}; color: {SOFT}">{{{{wrongT}}}}</span></div>'
         f'<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 0 6px"><span style="font-family: {SERIF}; font-size: 44px; font-weight: 600">{{{{prompt}}}}</span>'
         f'<button type="button" onClick="{{{{toggleHint}}}}" style="height: 40px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">{IF("notHint", "Hint", "true")}{IF("hint", "Its notes: {{notesT}}")}</button></div>'
         f'<span style="text-align: center; font-size: 14px; color: {SOFT}">Choose the keys on the on-screen piano, then Check.</span>')
TRBTNS = (IF('waiting', f'<div style="display: flex; gap: 8px">{BTN("Show answer", "showAns", "", "quiet", 50)}{BTN("Clear", "clear", "", "quiet", 50).replace("color: " + INK, "color: {{clearInk}}", 1).replace("<button ", "<button aria-disabled=\"{{checkNot}}\" ", 1)}<button type="button" onClick="{{{{check}}}}" aria-disabled="{{{{checkNot}}}}" style="flex: 1.4; height: 50px; border: 0; border-radius: 25px; background: {{{{checkBg}}}}; color: {{{{checkInk}}}}; font: inherit; font-size: 16px; font-weight: 700">Check</button></div>', 'true')
          + IF('answered', f'<div role="status" style="border-radius: 16px; background: {{{{vBg}}}}; padding: 16px; display: flex; align-items: center; gap: 12px"><span style="flex: 1; font-size: 18px; font-weight: 700; color: {{{{vInk}}}}">{{{{vT}}}}</span>{BTN("{{nextT}}", "next", "", "primary", 48, False)}</div>'))
RES_T = (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 0"><span style="font-size: 13px; font-weight: 700; letter-spacing: .06em; color: {SOFT}">RESULTS</span><span style="font-size: 56px; font-weight: 700; font-variant-numeric: tabular-nums">{{{{resT}}}}</span></div>')
CKRES = (RES_T + IF('checkDone', CARD(f'<div style="display: flex; align-items: center; gap: 12px"><span style="width: 40px; height: 40px; border-radius: 20px; background: #DCE9D6; color: #2F5A35; display: flex; align-items: center; justify-content: center">{CHECK.replace("16", "20")}</span><span style="font-size: 16px; font-weight: 600">Amazing Grace is now marked learned.</span></div>'), 'true')
         + IF('checkShort', CARD('<span style="font-size: 16px; line-height: 1.45">Two chords to practise first, then check again.</span>'))
         + SEC(CAPS('Skills'), GROUP(('link', 'D major', 'Open in Chords', 'Chords.dc.html'), ('link', 'G major scale', 'Open in Scales', 'Scales.dc.html'), bg=SHEET))
         + f'<div style="display: flex; gap: 8px">{BTN("Again", "again", "", "quiet", 50)}{BTN("Done", "", "Song.dc.html", "primary", 50)}</div>')
TR_SHEETS = (BSHEET('levelOn', 'Level', f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{levels}}}}" as="l" hint-placeholder-count="6"><button type="button" onClick="{{{{l.pick}}}}" style="width: 100%; min-height: 52px; border: 0; background: transparent; box-shadow: inset 0 -1px 0 {FILL}; color: {INK}; font: inherit; font-size: 16px; text-align: left; display: flex; align-items: center; padding: 0 16px"><span style="flex: 1">{{{{l.l}}}}</span><span style="font-weight: 700">{{{{l.mark}}}}</span></button></sc-for></div>')
             + BSHEET('customOn', 'Chord qualities', f'<div style="display: flex; align-items: baseline; justify-content: space-between"><span style="font-size: 16px; font-weight: 600">{{{{recT}}}}</span><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{incN}}}}</span></div>{WRAPCHIPS("quals")}'
                      f'<div style="display: flex; gap: 8px; flex-wrap: wrap">{BTN("Select all", "selAll", "", "quiet", 44, False)}{BTN("Clear", "clearSel", "", "quiet", 44, False)}{IF("notRec", BTN("Restore recommended", "restore", "", "quiet", 44, False))}</div>'))
trph = (''  # the Quiz's Trainer and its setup removed (canvas 160); the Check starts at its run
        + IF('isRun', TOP('', 'Check: Amazing Grace', '', 'Close', CLOSEB('Song.dc.html'))
              + f'<main style="flex: 1; min-height: 0; padding: 4px 16px 40px; display: flex; flex-direction: column; gap: 12px">{TRRUN}<div style="flex: 1"></div><div style="flex: none; margin: 0 -16px">{TAPKEYS("kb", 112)}</div>{TRBTNS}</main>')
        + IF('isResults', TOP('', '', '', 'Back', '<span style="width: 44px"></span>') + NARROW(CKRES)) + TOASTS)
LTR = lambda s: s.replace('Chords.dc.html', 'ChordsLaptop.dc.html').replace('Scales.dc.html', 'ScalesLaptop.dc.html').replace('Song.dc.html', 'SongLaptop.dc.html').replace('"Settings.dc.html"', '"SettingsLaptop.dc.html"')
trlm = (''
        + IF('isRun', LPAD(TOP('', 'Check: Amazing Grace', '', 'Close', CLOSEB('Song.dc.html')))
              + f'<main style="flex: 1; min-height: 0; padding: 8px 0 16px; display: flex; flex-direction: column; align-items: center; gap: 16px"><div style="width: 760px; display: flex; flex-direction: column; gap: 16px">{TRRUN}</div><div style="flex: 1"></div><div style="width: 760px">{TRBTNS}</div></main>'
              + f'<div style="flex: none; box-shadow: 0 -1px 0 {LINE}">{TAPKEYS("kbL", 170)}</div>')
        + IF('isResults', LTOP('', '') + WIDE(LTR(CKRES), 560)) + TOASTL)
for stem, mode, ttl in (('Check', "'check'", 'Check a song before it is marked learned'),):  # the Quiz's Trainer removed (canvas 160)
    detail(stem, ttl, js(TR_SRC.replace('__MODE__', mode)), SHOWSTATES() + trph, SHOWSTATES() + LTR(trlm), '', TR_SHEETS, LAPSHEET(TR_SHEETS), 'Practice')
print('r54 trainer, check ok')

# ════ ProgressionEdit (EDITOR) ════
PE_SRC = r'''
    const S = (o) => set(o), page = st.page ?? 'edit', role = st.role ?? 'Editor';''' + TOAST_JS + r'''
    const style = st.style ?? 'Pop', draft = st.draft ?? 'Draft · 2 changes', name = st.name ?? 'Axis of Awesome';
    return { ...common(st, set), isEditor: role === 'Editor', isLearner: role !== 'Editor', isEdit: page === 'edit', isSet: page === 'settings', isPub: page === 'publish', notEdit: page !== 'edit',
      pageT: { edit: 'Edit progression', settings: 'Settings', publish: 'Publish' }[page], back: () => S({ page: page === 'publish' ? 'settings' : 'edit' }), backT: page === 'publish' ? 'Settings' : 'Edit progression',
      goSet: () => S({ page: 'settings', sheet: null }), goPub: () => S({ page: 'publish', sheet: null }), draftT: draft, styles: chipsOf(['Pop', 'Rock', 'Jazz', 'Blues', 'Classical', 'R&B / Soul', 'Gospel', 'Modal', 'Theory'], style, (x) => S({ style: x, draft: 'Draft · 3 changes' })),
      name, setName: (e) => S({ name: e.target.value, draft: 'Draft · 3 changes' }), openPublishing: () => S({ sheet: 'publishing' }), publishingOn: st.sheet === 'publishing',
      discard: () => { S({ sheet: 'discard' }); }, discardOn: st.sheet === 'discard', doDiscard: () => { S({ sheet: null, draft: 'Published · no changes' }); toast('Changes discarded'); },
      publish: () => { S({ draft: 'Published · no changes', page: 'edit', sheet: null }); toast('Published. Learners will receive it the next time they open the app.'); }, share: () => toast('Link copied'),
      tipOn_prog: st.tip === 'prog', tip_prog: () => S({ tip: st.tip === 'prog' ? null : 'prog' }), tipOn_lines: st.tip === 'lines', tip_lines: () => S({ tip: st.tip === 'lines' ? null : 'lines' }),
      demo: demoOf(['Editor', 'Learner'], role, 'role').map((d) => ({ ...d, pick: () => S({ role: d.l }) })),
      closeSheet: () => S({ sheet: null }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: false, undo: () => S({ toast: null }) };'''
INPUT = lambda label, val, act='': f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{label}</span><input value="{val}" {("onInput=\"{{" + act + "}}\" ") if act else ""}aria-label="{label}" style="height: 48px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>'
DRAFTPILL = f'<button type="button" onClick="{{{{openPublishing}}}}" style="height: 44px; padding: 0 12px; border: solid transparent; border-width: 6px 0; background-clip: padding-box; border-radius: 22px; background: {HONEY}; color: {INK}; font: inherit; font-size: 13px; font-weight: 600; white-space: nowrap; flex: none; display: flex; align-items: center; gap: 4px">{{{{draftT}}}}{CHEV_D}</button>'
_PEH = f'<div style="display: flex; align-items: center; gap: 8px">{DRAFTPILL}<span style="font-size: 13px; color: {SOFT}">Editors only · learners see the published version</span></div>'
_PEN = INPUT('Name', '{{name}}', 'setName') + INPUT('How it sounds', 'Bright and singable, the sound of a thousand hits')
_PEP = SEC(S9CAPS('The progression', 'prog'), TIPCARD('prog', 'Roman numerals, one per bar, separated by spaces: I V vi IV.'), f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 12px 16px; font-family: {SERIF}; font-size: 26px; letter-spacing: .04em">I – V – vi – IV</div>')
_PES = SEC(CAPS('Style'), WRAPCHIPS('styles'))
_PEL = SEC(S9CAPS('Lines', 'lines'), TIPCARD('lines', 'The same progression written for a major and a minor key; the learner hears the one that suits the key they choose.'), GROUP(('val', 'In a major key', '<span style="font-family: ' + SERIF + '">I V vi IV</span>'), ('val', 'In a minor key', '<span style="font-family: ' + SERIF + '">i v VI iv</span>'), bg=SHEET))
PEEDIT = _PEH + _PEN + _PEP + _PES + _PEL
# on a laptop what the progression is called stands left, the progression itself and its lines right
PEEDIT_L = PEEDIT  # one column on a laptop too, in the phone's order (loop round 58)
PESET = (SEC(CAPS('Share'), GROUP(('link', 'Publish…', '{{draftT}}', 'goPub'), ('action', 'Share link', 'share'), bg=SHEET))
         + SEC(GROUP(('action', 'Remove from the library', 'discard', RED), bg=SHEET)))
PEPUB = (CARD(f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; font-weight: 700; letter-spacing: .06em; color: {SOFT}">WHAT CHANGED</span><span style="font-size: 16px">Name, Style</span><span style="font-size: 14px; color: {SOFT}">Edited today by Ana Popescu</span></div>')
         + f'<div style="display: flex; gap: 8px">{BTN("Discard changes", "discard", "", "quiet", 50)}{BTN("Publish", "publish", "", "primary", 50)}</div>')
PEGATE = EMPTY('isLearner', '✎', 'Only an editor edits a progression.', 'Ask an editor, or use Make your own from it at the foot of the progression’s page.', f'<div style="display: flex; margin-top: 6px">{BTN("Back to Progressions", "", "Progressions.dc.html", "primary", 48, False)}</div>')
PESHEETS = (BSHEET('publishingOn', 'Publishing', GROUP(('link', 'Publish…', '', 'goPub'), ('action', 'Discard changes', 'discard', RED), bg=SHEET)) + ASK('discardOn', 'Discard your changes?', 'The draft goes back to the published version. This can’t be undone.', 'Discard', 'doDiscard'))
PEBODY = IF('isEdit', PEEDIT, 'true') + IF('isSet', PESET) + IF('isPub', PEPUB)
PEBODY_L = IF('isSet', PESET) + IF('isPub', PEPUB)
peph = (IF('isEditor', IF('isEdit', TOP('Progression.dc.html', 'Edit progression', IB('Settings', GEARI, 'goSet'), 'Axis of Awesome'), 'true') + IF('notEdit', TOP('', '{{pageT}}', '', 'Back', IB('{{backT}}', CHEV_L, 'back'))) + NARROW(PEBODY), 'true')
        + IF('isLearner', TOP('Progression.dc.html', '', '', 'Axis of Awesome') + NARROW(PEGATE)) + STRIP() + f'<div style="height: 26px; flex: none"></div>' + TOASTS)
LPE = lambda s: s.replace('Progressions.dc.html', 'ProgressionsLaptop.dc.html').replace('Progression.dc.html', 'ProgressionLaptop.dc.html')
pelm = (IF('isEditor', IF('isEdit', LTITLEBAR('{{pageT}}', IB('Settings', GEARI, 'goSet'), back='ProgressionLaptop.dc.html'), 'true') + IF('notEdit', LTITLEBAR('{{pageT}}', backact='back')) + IF('isEdit', LCOL(PEEDIT_L, 704), 'true') + IF('notEdit', LCOL(PEBODY_L, 640)), 'true')
        + IF('isLearner', LTOP('ProgressionLaptop.dc.html', '') + WIDE(LPE(PEGATE), 640)) + STRIP() + TOASTL)
detail('ProgressionEdit', 'Edit a progression (editors)', js(PE_SRC), peph, pelm, '', PESHEETS, LAPSHEET(PESHEETS), 'Practice')

# ════ Pattern: a pattern, built-in or own; New and Edit; Publish ════
PA_SRC = r'''
    const S = (o) => set(o), ROOT = __ROOT__, page = st.page ?? ROOT, own = st.own ?? (ROOT !== 'pattern');''' + TOAST_JS + r'''
    const fav = !!st.fav, hidden = !!st.hidden, rh = st.rh ?? 'Broken chords', lh = st.lh ?? 'Octaves';
    const RHG = [['Chords', ['Block chords', 'Off-beat chords']], ['Broken chords', ['Broken chords', 'Alberti']], ['Moving voices', ['Inner voice']], ['With the melody', ['Melody on top']], ['Styles', ['Ballad', 'Stride', 'Bossa nova']]];
    const LHG = [['Held', ['Whole notes', 'Half notes']], ['Octaves', ['Octaves', 'Broken octaves']], ['Arpeggios', ['Up the chord', 'Up and down']], ['Bass lines', ['Root and fifth', 'Walking']], ['Styles', ['Stride', 'Boogie']]];
    const grp = (G, cur, k) => G.map(([g, xs]) => ({ g, xs: xs.map((x) => ({ l: x, bg: x === cur ? '#332921' : '#EEE9E2', fg: x === cur ? '#FEFDFB' : '#332921', pick: () => S({ [k]: x }) })) }));
    const name = own ? (st.name ?? 'Broken chords (mine)') : 'Broken chords';
    return { ...common(st, set), isPattern: page === 'pattern', isEditor: page === 'new' || page === 'edit', notEditor: !(page === 'new' || page === 'edit'), isPublish: page === 'publish', notPattern: page !== 'pattern',
      pageT: { pattern: name, new: 'New pattern', edit: 'Edit pattern', publish: 'Publish' }[page], name, setName: (e) => S({ name: e.target.value }), own, builtIn: !own,
      favOn: fav, heartFill: fav ? '#B3261E' : 'none', heartInk: fav ? '#B3261E' : '#332921', toggleFav: () => { S({ fav: !fav }); toast(fav ? 'Removed from Favourites.' : 'Added to Favourites.'); },
      hidden, hideT: hidden ? 'Show in the Player' : 'Hide from the Player', toggleHide: () => S({ hidden: !hidden, sheet: null }),
      makeOwn: () => S({ page: 'new', sheet: null }), edit: () => S({ page: 'edit', sheet: null }), goPub: () => S({ page: 'publish', sheet: null }),
      del: () => { S({ sheet: null, deleted: true }); toast(name + ' deleted', true); }, deleted: !!st.deleted, notDeleted: !st.deleted,
      save: () => { S({ page: 'pattern', own: true }); toast('Saved to your patterns'); }, cancel: () => S({ page: ROOT === 'pattern' ? 'pattern' : 'pattern' }), back: () => S({ page: 'pattern' }),
      rhT: rh, lhT: lh, rhG: grp(RHG, rh, 'rh'), lhG: grp(LHG, lh, 'lh'), over: seg(['Over a bar of C major', 'Over Amazing Grace'], st.over ?? 'Over a bar of C major', (x) => S({ over: x })),
      published: !!st.pub, notPublished: !st.pub, doPub: () => { S({ pub: true }); toast('Published to the Public library'); },
      demo: demoOf(['Built-in', 'Your own'], own ? 'Your own' : 'Built-in', 'x').map((d) => ({ ...d, pick: () => S({ own: d.l === 'Your own', page: 'pattern' }) })),
      closeSheet: () => S({ sheet: null }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: !!st.toastUndo, undo: () => S({ toast: null, deleted: false }) };'''
def ROLL(w):
    """Two hands' rhythm in one bar of C major: the right hand broken, the left hand in octaves (a piano roll)."""
    cell = w / 8
    rh = ''.join(f'<rect x="{i * cell + 2:.1f}" y="{[22, 14, 6, 14][i % 4]}" width="{cell - 4:.1f}" height="7" rx="3" fill="#F2B33D"></rect>' for i in range(8))
    lh = ''.join(f'<rect x="{i * cell * 2 + 2:.1f}" y="{[54, 46][i % 2]}" width="{cell * 2 - 4:.1f}" height="7" rx="3" fill="#8FB3D9"></rect>' for i in range(4))
    grid = ''.join(f'<path d="M{i * cell:.1f} 0V68" stroke="{FILL}" stroke-width="{1.5 if i % 2 == 0 else .8}"></path>' for i in range(9))
    return f'<svg viewBox="0 0 {w} 68" width="100%" role="img" aria-label="The right hand plays the chord broken in eighths; the left hand plays octaves in quarters" style="display: block">{grid}{rh}{lh}<path d="M0 36H{w}" stroke="{LINE}"></path></svg>'
PATP = (IF('deleted', EMPTY('deleted', '♪', 'Pattern deleted', 'It left your patterns and the Player’s list. Undo brings it back.')) + IF('notDeleted',
        f'<div style="display: flex; align-items: center; gap: 8px"><span style="font-size: 14px; color: {SOFT}">{IF("builtIn", "Called to Play · Level 1", "true")}{IF("own", "Your pattern · from Broken chords")}</span></div>'
        + IF('hidden', CARD(f'<span style="font-size: 15px; line-height: 1.45">Hidden from the Player’s list and from its book. You can still find it under Hidden.</span>'))
        + CARD(f'<div style="display: flex; flex-direction: column; gap: 12px"><div style="display: grid">{SEGC("over", 40, 13)}</div>{ROLL(340)}<div style="display: flex; justify-content: space-between; font-size: 13px; color: {SOFT}"><span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 5px; background: #F2B33D"></span>Right hand</span><span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 5px; background: #8FB3D9"></span>Left hand</span></div></div>')
        + GROUP(('val', 'Right hand', '{{rhT}}'), ('val', 'Left hand', '{{lhT}}'), bg=SHEET)
        + SEC(CAPS('Used in'), GROUP(('link', 'Amazing Grace', 'Verse', 'Song.dc.html'), ('link', 'Called to Play, lesson 12', '', 'Lesson.dc.html'), bg=SHEET))
        + f'<div style="display: flex">{BTN(PLAY.replace("22", "18") + " Practise in the Player", "", "Player.dc.html", "primary", 50)}</div>', 'true'))
HANDGRP = lambda lst: f'<div style="display: flex; flex-direction: column; gap: 12px"><sc-for list="{{{{{lst}}}}}" as="g" hint-placeholder-count="5"><div style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{{{{g.g}}}}</span><div style="display: flex; flex-wrap: wrap; gap: 8px"><sc-for list="{{{{g.xs}}}}" as="p" hint-placeholder-count="2"><button type="button" onClick="{{{{p.pick}}}}" style="height: 40px; padding: 0 16px; border: 0; border-radius: 20px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 14px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div></div></sc-for></div>'
PATED = (INPUT('Name', '{{name}}', 'setName') + CARD(ROLL(340)) + SEC(CAPS('Right hand'), HANDGRP('rhG')) + SEC(CAPS('Left hand'), HANDGRP('lhG'))
         + f'<div style="display: flex; gap: 8px">{BTN("Cancel", "cancel", "", "quiet", 50)}{BTN("Save", "save", "", "primary", 50)}</div>')
# on a laptop the pattern being made stands large on the right, kept in sight while the hands are chosen on the left
PATED_L = (f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 40px; align-items: start"><div style="display: flex; flex-direction: column; gap: 16px">'
           + INPUT('Name', '{{name}}', 'setName') + SEC(CAPS('Right hand'), HANDGRP('rhG')) + SEC(CAPS('Left hand'), HANDGRP('lhG')) + '</div>'
           + f'<div style="position: sticky; top: 0; display: flex; flex-direction: column; gap: 16px">{CARD(f"<div style=\"display: flex; flex-direction: column; gap: 12px\"><span style=\"font-size: 13px; font-weight: 600; color: {SOFT}\">How it plays</span>{ROLL(280)}</div>")}'
           + f'<div style="display: flex; gap: 8px">{BTN("Cancel", "cancel", "", "quiet", 50)}{BTN("Save", "save", "", "primary", 50)}</div></div></div>')
PATPUB = (IF('notPublished', SEC(CAPS('As others will see it'), CARD(f'<div style="display: flex; gap: 12px; align-items: center">{COV("", SAGE, 56)}<span style="display: flex; flex-direction: column"><span style="font-size: 16px; font-weight: 700">{{{{name}}}}</span><span style="font-size: 13px; color: {SOFT}">A pattern by Ana Popescu · Save to my patterns</span></span></div>'))
                          + f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Description</span><textarea rows="3" aria-label="Description" placeholder="What the pattern is, its style, and what it suits" style="border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 12px; font: inherit; font-size: 16px; resize: none; outline: none; color: {INK}"></textarea></label>'
                          + f'<div style="display: flex">{BTN("Publish", "doPub", "", "primary", 50)}</div>', 'true')
          + IF('published', CARD(f'<div style="display: flex; align-items: center; gap: 12px">{DOT(GREEN)}<span style="flex: 1; font-size: 16px; font-weight: 600">In the Public library</span><span style="font-size: 14px; color: {SOFT}">Not saved yet</span></div>') + GROUP(('link', 'View in library', '', 'Explore.dc.html'), bg=SHEET)))
PA_MORE = (IF('builtIn', GROUP(('action', 'Make your own from it', 'makeOwn'), ('action', '{{hideT}}', 'toggleHide'), bg=SHEET), 'true')
           + IF('own', GROUP(('action', 'Edit', 'edit'), ('action', 'Publish…', 'goPub'), ('action', '{{hideT}}', 'toggleHide'), bg=SHEET) + GROUP(('action', 'Delete', 'del', RED), bg=SHEET)))
PAHEART = f'<button type="button" aria-label="Favourite" aria-pressed="{{{{favOn}}}}" onClick="{{{{toggleFav}}}}" style="{GLASSST}; color: {{{{heartInk}}}}"><svg viewBox="0 0 24 24" width="22" height="22" fill="{{{{heartFill}}}}" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg></button>'
PABODY = IF('isPattern', PATP, 'true') + IF('isEditor', PATED) + IF('isPublish', PATPUB)
paph = (IF('isPattern', TOP('Accompaniment.dc.html', '', PAHEART + IB('More', MORE, 'openMore'), 'Accompaniment') + f'<div style="flex: none; padding: 2px 16px 8px"><h1 style="margin: 0; font-size: 30px; font-weight: 700">{{{{pageT}}}}</h1></div>', 'true')
        + IF('notPattern', TOP('', '{{pageT}}', '', 'Back', IB('Back', CHEV_L, 'back'))) + NARROW(PABODY) + STRIP() + f'<div style="height: 26px; flex: none"></div>' + TOASTS)
LPA = lambda s: s.replace('Accompaniment.dc.html', 'AccompanimentLaptop.dc.html').replace('Song.dc.html', 'SongLaptop.dc.html').replace('Lesson.dc.html', 'LessonLaptop.dc.html').replace('Player.dc.html', 'PlayerLaptop.dc.html').replace('Explore.dc.html', 'ExploreLaptop.dc.html')
palm = (IF('isPattern', LTOP('AccompanimentLaptop.dc.html', PAHEART + IB('More', MORE, 'openMore')), 'true') + IF('notPattern', LTITLEBAR('{{pageT}}', backact='back')) + IF('notEditor', LCOL(LPA(PABODY), 640), 'true') + IF('isEditor', LCOL(LPA(IF('isEditor', PATED_L)), 1180)) + STRIP() + TOASTL)
for stem, root, ttl in (('Pattern', "'pattern'", 'A pattern, built-in or your own'), ('PatternNew', "'new'", 'A new pattern')):
    detail(stem, ttl, js(PA_SRC.replace('__ROOT__', root)), paph, palm, '', BSHEET('moreOn', '{{name}}', PA_MORE), POPOVER('moreOn', '{{name}}', LPA(PA_MORE), 'right: 40px; top: 64px', 320), 'Practice')
print('r54 progression edit, pattern ok')

# ════ Take ════
TK_SRC = r'''
    const S = (o) => set(o);''' + TOAST_JS + r'''
    const first = st.first ?? 3, last = st.last ?? 10, bars = 14, kept = !!st.kept, deleted = !!st.deleted;
    const cells = Array.from({ length: bars }, (_, i) => ({ n: i + 1, bg: i + 1 >= first && i + 1 <= last ? '#F6E7C8' : 'transparent', play: () => S({ from: i + 1, playing: true }) }));
    const states = [['playing', 'Playing from bar 4', !!st.playing, { playing: !st.playing, from: 4 }], ['kept', 'Bars 3–10 kept', kept, { kept: !kept }], ['deleted', 'Deleted', deleted, { deleted: !deleted }]]
      .map(([k, l, on, o]) => ({ l, bg: on ? '#332921' : '#EEE9E2', fg: on ? '#FEFDFB' : '#332921', pick: () => S(o) }));
    return { ...common(st, set), states, name: st.name ?? 'Take 3', setName: (e) => S({ name: e.target.value }), cells, fromT: st.playing ? 'Playing from bar ' + (st.from ?? 1) : '212 notes',
      firstV: String(first), lastV: String(last), keepL: 'Keep bars ' + first + '–' + last, fDn: () => S({ first: Math.max(1, first - 1) }), fUp: () => S({ first: Math.min(last, first + 1) }), lDn: () => S({ last: Math.max(first, last - 1) }), lUp: () => S({ last: Math.min(bars, last + 1) }),
      askKeep: () => S({ sheet: 'keep' }), keepOn: st.sheet === 'keep', keepT: 'Keep bars ' + first + '–' + last + '?', doKeep: () => { S({ sheet: null, kept: true }); toast('Kept bars ' + first + '–' + last); },
      download: () => toast('Take 3.mid saved'), del: () => { S({ deleted: true }); toast('Take 3 deleted', true); }, deleted, notDeleted: !deleted, lenT: kept ? '0:24 · 92 BPM' : '0:41 · 92 BPM',
      closeSheet: () => S({ sheet: null }), toastOn: !!st.toast, toastT: st.toast || '', toastUndo: !!st.toastUndo, undo: () => S({ toast: null, deleted: false }) };'''
def PROLL(w, h):
    import random
    rnd = random.Random(7); notes = []
    for b in range(14):
        for k in range(4):
            y = rnd.choice([10, 18, 26, 34, 42, 58, 66, 74]); notes.append(f'<rect x="{b * w / 14 + k * w / 56 + 1:.1f}" y="{y * h / 90:.1f}" width="{w / 56 * rnd.choice([1, 1, 2]) - 2:.1f}" height="{h / 18:.1f}" rx="2" fill="{"#F2B33D" if y < 50 else "#8FB3D9"}"></rect>')
    return f'<svg viewBox="0 0 {w} {h}" width="100%" role="img" aria-label="The take as a piano roll: 212 notes over 14 bars" style="display: block">' + ''.join(f'<path d="M{b * w / 14:.1f} 0V{h}" stroke="{FILL}"></path>' for b in range(15)) + ''.join(notes) + '</svg>'
_TKL = (f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="margin: 0 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Name</span><input value="{{{{name}}}}" onInput="{{{{setName}}}}" aria-label="Name" style="height: 52px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font: inherit; font-size: 20px; font-weight: 700; color: {INK}; outline: none"></label>'
          f'<div style="display: flex; align-items: center; gap: 12px">{PLAYBTN(52)}<span style="display: flex; flex-direction: column"><span style="font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums">{{{{lenT}}}}</span><span style="font-size: 14px; color: {SOFT}">Amazing Grace · recorded 9 November</span></span></div>'
          + CARD(f'<div style="display: flex; flex-direction: column; gap: 8px">{PROLL(340, 120)}<div role="slider" tabindex="0" aria-label="Play from bar" aria-valuemin="1" aria-valuemax="14" aria-valuetext="{{{{fromT}}}}" style="display: grid; grid-template-columns: repeat(14, minmax(0, 1fr)); cursor: pointer"><sc-for list="{{{{cells}}}}" as="c" hint-placeholder-count="14"><span onClick="{{{{c.play}}}}" style="height: 44px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border-top: 6px solid transparent !important; border-bottom: 6px solid transparent !important; background-clip: padding-box; border: 0; border-radius: 6px; background: {{{{c.bg}}}}; font: inherit; font-size: 12px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{c.n}}}}</span></sc-for></div><span style="font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{fromT}}}}</span></div>', '12px'))
_TKR = (SEC(CAPS('Keep bars'), GROUP(('step', 'First bar', 'firstV', 'fDn', 'fUp'), ('step', 'Last bar', 'lastV', 'lDn', 'lUp'), ('action', '{{keepL}}', 'askKeep'), bg=SHEET))
          + SEC(GROUP(('action', 'Download', 'download'), bg=SHEET)) + SEC(GROUP(('action', 'Delete', 'del', RED), bg=SHEET)))
TKBODY = (IF('notDeleted', _TKL + _TKR, 'true')
          + SHOWSTATES() + EMPTY('deleted', MUSICN, 'Take deleted', 'Undo brings it back.', f'<div style="display: flex; margin-top: 6px">{BTN("Go to the takes", "", "Editor.dc.html", "primary", 48, False)}</div>'))
# on a laptop the recording stands left, its roll large; what to do with it stands right
TKBODY_L = (IF('notDeleted', f'<div style="display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 40px; align-items: start"><div style="display: flex; flex-direction: column; gap: 16px">' + _TKL.replace('PROLL(340, 120)', 'PROLL(720, 220)') + f'</div><div style="display: flex; flex-direction: column; gap: 16px">' + _TKR + '</div></div>', 'true')
          + SHOWSTATES() + EMPTY('deleted', MUSICN, 'Take deleted', 'Undo brings it back.', f'<div style="display: flex; margin-top: 6px">{BTN("Go to the takes", "", "Editor.dc.html", "primary", 48, False)}</div>'))
TKASK = ASK('keepOn', '{{keepT}}', 'All other bars will be permanently deleted.', 'Keep', 'doKeep')
tkph = TOP('Editor.dc.html', 'Take', '', 'Amazing Grace') + NARROW(TKBODY) + TOASTS
tklm = LTITLEBAR('Take', back='EditorLaptop.dc.html') + LCOL(TKBODY_L.replace('Editor.dc.html', 'EditorLaptop.dc.html'), 1180) + TOASTL
detail('Take', 'A take', js(TK_SRC), tkph, tklm, '', TKASK, TKASK, 'Songs')

# ════ The Player's variants: Walk, Chromatic, Progression, Exercise — their setup over the Player ════
PV_SRC = r'''
    const S = (o) => set(o), V = __V__, open = st.open ?? true;
    const A = (k, opts, d) => seg(opts, st[k] ?? d, (x) => S({ [k]: x }));
    const root = st.root ?? 'C', size = st.size ?? 'Triads', walk = st.walk ?? 'One key';
    const T = { walk: 'Walk the chords in ' + root + ' major', chromatic: 'Chromatic walk: major and minor 7ths', progression: 'I – V – vi – IV in ' + root + (walk === 'One key' ? '' : ', up by semitones'), exercise: 'Hanon No. 1: in ' + root };
    return { ...common(st, set), title: T[V], isWalk: V === 'walk', isChrom: V === 'chromatic', isProg: V === 'progression', isEx: V === 'exercise', playing: !!st.playing, notPlaying: !st.playing, playLabel: st.playing ? 'Stop' : 'Play', togglePlay: () => S({ playing: !st.playing, open: false }), setupOn: open, openSetup: () => S({ open: true }), startIt: () => S({ open: false }),
      roots: chipsOf(['C', 'G', 'D', 'A', 'E', 'F', 'B♭', 'E♭'], root, (x) => S({ root: x })), sizes: A('size', ['Triads', 'Sevenths'], 'Triads'), dirs: A('dir', ['Up', 'Down', 'Up and down'], 'Up'),
      fams: chipsOf(['Major 7th', 'Dominant 7th', 'Minor 7th', 'Half-diminished'], st.fam ?? 'Minor 7th', (x) => S({ fam: x })), walks: chipsOf(['One key', 'Chromatically rising', 'By fifths', 'By fourths'], walk, (x) => S({ walk: x })),
      rhythms: A('rh', ['Even', 'Dotted', 'Reverse dotted'], 'Even'), hands: A('hands', ['Right hand', 'Left hand', 'Both'], 'Both'), nextKey: A('nk', ['Circle of fifths', 'Chromatic'], 'Circle of fifths'), voicings: A('vc', ['Close', 'Drop 2'], 'Close'),
      tempoV: (st.bpm ?? 72) + ' BPM', bDn: () => S({ bpm: (st.bpm ?? 72) - 4 }), bUp: () => S({ bpm: (st.bpm ?? 72) + 4 }), octV: String(st.oct ?? 2), oDn: () => S({ oct: Math.max(1, (st.oct ?? 2) - 1) }), oUp: () => S({ oct: Math.min(4, (st.oct ?? 2) + 1) }),
      ladOn: !!st.lad, ladOnBg: st.lad ? '#44684A' : '#DAD1C8', ladOnX: st.lad ? 22 : 2, ladT: () => S({ lad: !st.lad }), tipOn_lad: st.tip === 'lad', tip_lad: () => S({ tip: st.tip === 'lad' ? null : 'lad' }),
      closeSheet: () => S({ open: false }) };'''
PVSET = (IF('isWalk', SEC(CAPS('Root'), WRAPCHIPS('roots')) + SEC(CAPS('Chord size'), f'<div style="display: grid">{SEGC("sizes", 44, 14)}</div>'))
         + IF('isChrom', SEC(CAPS('Chord types'), WRAPCHIPS('fams')) + SEC(CAPS('Root'), WRAPCHIPS('roots')) + SEC(CAPS('Direction'), f'<div style="display: grid">{SEGC("dirs", 44, 14)}</div>'))
         + IF('isProg', SEC(CAPS('Chord size'), f'<div style="display: grid">{SEGC("sizes", 44, 14)}</div>') + SEC(CAPS('In all 12 keys'), WRAPCHIPS('walks')))
         + IF('isEx', GROUP(('link', 'Exercise', 'No. 1', ''), ('link', 'Key', '{{title}}'.replace('{{title}}', 'C major'), ''), bg=SHEET) + SEC(CAPS('Rhythm'), f'<div style="display: grid">{SEGC("rhythms", 44, 14)}</div>') + SEC(CAPS('Hands'), f'<div style="display: grid">{SEGC("hands", 44, 14)}</div>')
                      + SEC(CAPS('Next key'), f'<div style="display: grid">{SEGC("nextKey", 44, 14)}</div>') + GROUP(('step', 'Octaves', 'octV', 'oDn', 'oUp'), ('step', 'Tempo', 'tempoV', 'bDn', 'bUp', 92), bg=SHEET)
                      + SEC(S9CAPS('Tempo ladder', 'lad'), TIPCARD('lad', 'Each clean pass raises the tempo a little, up to the target.'), GROUP(('toggle', 'Tempo ladder', 'ladOn', 'ladT'), bg=SHEET)))
         + f'<div style="display: flex">{BTN("Start", "startIt", "", "primary", 52)}</div>')
PVBAR = TOP('', '{{title}}', IB('Player settings', GEARI, '', 'PlayerSettings.dc.html'), 'Close', CLOSEB('Practice.dc.html'))
# the four runs' Player is drawn in r56_results.py, from the run view's parts (round 41)
print('r54 take, player variants ok')
