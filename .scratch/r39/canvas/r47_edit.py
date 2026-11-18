# R47: the editors' Edit mode, in place (owner: "maybe the page enters the edit mode and not a new page … look the same
# like it looks in preview"; ADR 0116 r21, Obsidian's Live Preview). A lesson read by a learner, and the same page edited
# by an editor: the bar's Edit turns it into the document; English | Русский; the draft's status under the title;
# Publish with its menu; a formatting bar; Insert (and /) by group; an example's Edit sheet; the Publish page.
# Learn's level gets the same Edit mode: rows dragged, chapters renamed and added, Remove with Undo. Preview as learner
# hides all of it. Exact labels from src/shared/i18n/locales/en/learn.ts and editor.ts. Exec'd by r41.py.
_B = dict(globals()); exec(open('/home/user/piano-trainer/.scratch/r39/canvas/r47_blocks.py').read(), _B)  # its own namespace: its names never shadow the kit's
PKEYS, ADDED, INSLIST, INS_JS = _B['PKEYS'], _B['ADDED'], _B['INSLIST'], _B['INS_JS']
LESSON = {
  'place': 'Lesson 7 of 13', 'title': 'How major scales work', 'titleRu': 'Как устроены мажорные гаммы',
  'summary': 'Build a major scale on any key from one pattern of whole and half steps.',
  'summaryRu': 'Постройте мажорную гамму от любой клавиши по одной схеме тонов и полутонов.',
  'secs': [
    {'h': 'One pattern for every key', 'hRu': 'Одна схема для всех тональностей',
     'p': 'Every major scale climbs by the same pattern of whole and half steps. Start on C and only white keys fit it.',
     'pRu': 'Любая мажорная гамма поднимается одинаково: тон, тон, полутон, тон, тон, тон, полутон. От до схеме подходят только белые клавиши.',
     'ex': 'scale', 'take': 'W W H W W W H, from any key.'},
    {'h': 'Building D major', 'hRu': 'Строим ре мажор',
     'steps': ['Start on D.', 'Whole step to E, whole step to F♯.', 'Half step to G, then whole steps to A, B and C♯.', 'Half step home to D.'],
     'ex': 'question', 'take': 'D major has two sharps: F♯ and C♯.'}]}
INSERT = [('Text', ['Text', 'Steps', 'Note', 'Rule']), ('Music', ['Chords', 'One chord on every root', 'Scale', 'Interval', 'Notes', 'Voicings', 'Pattern', 'Progression', 'Versions']), ('Ask and link', ['Question', 'Link', 'Picture'])]
LESSON_JS = js('const LS = ' + json.dumps(LESSON, ensure_ascii=False) + ', INS = ' + json.dumps(INSERT) + ';\n' + r'''
    const editing = !!st.editing, ru = st.lang === 'RU', preview = !!st.preview, sheet = st.sheet ?? null, pub = st.pub ?? 'changed';
    const T = (o, k) => ru ? o[k + 'Ru'] || o[k] : o[k];
    const goSec = (k) => { const h = document.querySelectorAll('[data-sec]')[k]; const m = h && h.closest('main'); if (m) m.scrollTo({ top: m.scrollTop + h.getBoundingClientRect().top - m.getBoundingClientRect().top - 16, behavior: 'smooth' }); set({ secAt: k, sheet: null }); };
    const secs = LS.secs.map((s, i) => ({ n: String(i + 1), menu: () => set({ sheet: 'block', blk: i }), navBg: i === (st.secAt ?? 0) ? '#EEE9E2' : 'transparent', navFw: i === (st.secAt ?? 0) ? 600 : 400, navDot: i === (st.secAt ?? 0) ? '#FEFDFB' : '#EEE9E2', go: (e) => { e && e.preventDefault && e.preventDefault(); goSec(i); }, h: T(s, 'h'), p: T(s, 'p') || '', hasP: !!s.p, steps: (s.steps || []).map((x) => ({ x })), hasSteps: !!s.steps,
      isScale: s.ex === 'scale', isQ: s.ex === 'question', take: s.take, sel: st.sel === i, pick: () => editing && set({ sel: i }), ring: editing && st.sel === i ? '#C9932E' : 'transparent' }));
    const ver = st.ver ?? 'C major', VER = { 'C major': [60, ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']], 'G major': [55, ['G', 'A', 'B', 'C', 'D', 'E', 'F♯', 'G']], 'F major': [53, ['F', 'G', 'A', 'B♭', 'C', 'D', 'E', 'F']] }[ver];
    const D = [62, 64, 66, 67, 69, 71, 73, 74], root = VER[0], marks = {}, qm = {};
    [0, 2, 4, 5, 7, 9, 11, 12].forEach((o, i) => { marks[root + o] = [i === 2 || i === 6 ? '#E8C67D' : '#9BC093', VER[1][i]]; });
    (st.chosen || []).forEach((m) => { qm[m] = ['#85B8DC', '']; });
    const chosen = st.chosen || [], right = chosen.length === 8 && D.every((m) => chosen.includes(m));
    const states = [['Edited by an editor', editing, { editing: true, sel: 0, preview: false }, { editing: false }], ['The lesson’s Russian text', ru, { lang: 'RU' }, { lang: 'EN' }],
      ['Previewed as a learner', preview, { preview: true, editing: false }, { preview: false }], ['The question answered', right, { chosen: D }, { chosen: [] }]]
      .map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => { set(on ? off : o); if (!on && o.chosen) setTimeout(() => document.querySelector('[data-q]')?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 60); } }));
__INSJS__    return { ...common(st, set), added, states, editing, reading: !editing, canEdit: !preview, previewing: preview, exitPreview: () => set({ preview: false }),
      edit: () => set({ editing: true, sel: 0 }), done: () => set({ editing: false, sheet: null }), langs: seg(['EN', 'RU'], ru ? 'RU' : 'EN', (l) => set({ lang: l })),
      place: LS.place, title: T(LS, 'title'), summary: T(LS, 'summary'), secs, status: st.saving ? 'Saving…' : 'Saved · not published',
      kb: calmKeys(root, root + 16, marks, 370, 96), kbL: calmKeys(root - 12, root + 23, marks, 1382, 150), verName: ver, qkb: calmKeys(60, 76, qm, 370, 96), qkbL: calmKeys(48, 83, qm, 1382, 150),
      notRight: !right, qLine: right ? 'Correct' : (chosen.length + ' of 8 notes'), qInk: right ? '#2F5A35' : '#685E56', showAns: () => set({ chosen: D }), resetQ: () => set({ chosen: [] }),
      insOn: sheet === 'insert', openIns: () => set({ sheet: 'insert' }), ins: ins2, insOld: INS.map(([g, ks]) => ({ g, ks: ks.map((k) => ({ k, add: () => set({ sheet: null, toast: k + ' added' }) })) })),
      legendOn: !!st.legend, toggleLegend: () => set({ legend: !st.legend }), exOn: sheet === 'example', openEx: () => set({ sheet: 'example' }), tocOn: sheet === 'toc', openToc: () => set({ sheet: 'toc' }), menuOn: sheet === 'block', openBlock: () => set({ sheet: 'block' }), blkT: T(LS.secs[st.blk ?? 0], 'h'),
      pubOn: sheet === 'publish', openPub: () => set({ sheet: 'publish' }), moreOn: sheet === 'more', openMore: () => set({ sheet: 'more' }),
      isChanged: pub === 'changed', isPublished: pub === 'published', publish: () => set({ pub: 'published', sheet: null, toast: 'Published. Learners will receive it the next time they open the app.' }),
      unpublish: () => set({ pub: 'changed', sheet: null, toast: 'Unpublished' }), standing: pub === 'published' ? 'Published 8 November' : 'Changes not published', verN: '4',
      pubL: (st.pub ?? 'changed') === 'published' ? 'Published' : 'Publish', publishNow: () => (st.pub ?? 'changed') !== 'published' && set({ pub: 'published', sheet: null, toast: 'Published. Learners receive it the next time they open the app.' }), undoPub: () => set({ pub: 'changed', toast: null }), pubUndoOn: /^Published/.test(st.toast || ''), pmPos: st.pmPos ?? 'right: 16px; top: 112px', toastOn: !!st.toast, toastUndo: /deleted|removed|reset|learned|^Published/i.test(st.toast || ''), copyLink: () => set({ toast: 'Link copied' }), dupBlock: () => set({ sheet: null, toast: 'Section duplicated' }), turns: seg(['Text', 'Steps', 'Note', 'Rule'], st.turn ?? 'Text', (x) => set({ turn: x })), tBpmL: (st.tBpm ?? 96) + ' BPM', tSlower: () => set({ tBpm: Math.max(30, (st.tBpm ?? 96) - 1) }), tFaster: () => set({ tBpm: Math.min(240, (st.tBpm ?? 96) + 1) }), tOn: !!st.tPlay, tOff: !st.tPlay, tPlayL: st.tPlay ? 'Stop metronome' : 'Start metronome', tToggle: () => set({ tPlay: !st.tPlay }), exRoots: rootGrid(st.exRoot ?? 0, (i) => set({ exRoot: i })), exKinds: chipsOf(['Major', 'Natural minor', 'Harmonic minor', 'Melodic minor'], st.exKind ?? 'Major', (l) => set({ exKind: l })), clefs: seg(['Treble', 'Bass'], st.clef ?? 'Treble', (l) => set({ clef: l })), opens: chipsOf(['A lesson', 'A chord', 'A scale', 'A key', 'As written'], st.opens ?? 'A scale', (l) => set({ opens: l })), tipNOn: !!st.tipN, tipNotes: () => set({ tipN: !st.tipN }), looks: [['Plain', '#FEFDFB', '#332921'], ['Soft', '#F6E7C8', '#332921'], ['Bold', '#332921', '#FEFDFB'], ['Paper', '#F4EEE4', '#332921']].map(([n, bg, fg]) => ({ n, bg, fg, on: (st.look ?? 'Soft') === n, ring: (st.look ?? 'Soft') === n ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8', pick: () => set({ look: n }) })), resetLook: () => set({ look: 'Soft', sheet: null, toast: 'Style reset' }), lookV: st.look ?? 'Soft', toastT: st.toast || '', closeToast: () => set({ toast: null }), undoRemove: () => set(/^Published/.test(st.toast || '') ? { pub: 'changed', toast: null } : / learned$/.test(st.toast || '') ? { learned: false, toast: null } : { toast: null }),
      removeBlock: () => set({ sheet: null, toast: 'Scale deleted' }),
      nextLesson: () => set({ learned: true, toast: 'How major scales work learned' }), learned: !!st.learned, toggleLearned: () => set({ learned: !st.learned, toast: st.learned ? null : 'Marked learned' }),
      learnedBg: st.learned ? '#DCE9D6' : 'rgba(254,253,251,.86)', learnedLine: st.learned ? '#9BC093' : '#DAD1C8', learnedFg: st.learned ? '#2F5A35' : '#332921',
      page: st.page ?? null, onPage: !!st.page, isSet: st.page === 'settings', isPubPage: st.page === 'publish', openSettings: () => set({ page: 'settings', sheet: null }), openPubPage: () => set({ page: 'publish', sheet: null }), closePage: () => set({ page: null, sheet: null }),
      pageT: st.page === 'settings' ? 'Settings' : 'Publish',
      pmOn: sheet === 'pubmenu', openPm: (e) => set({ sheet: 'pubmenu', pmPos: ANCHOR(e, 150) }), verOn: sheet === 'versions', openVer: () => set({ sheet: 'versions' }),
      styleOn: sheet === 'style', openStyle: () => set({ sheet: 'style' }), discard: () => set({ sheet: null, toast: 'Changes discarded' }), restore: () => set({ sheet: null, pub: 'published', toast: 'Restored. Learners will receive it the next time they open the app.' }),
      resetOn: sheet === 'reset', askReset: () => set({ sheet: 'reset' }), doReset: () => set({ sheet: null, toast: 'Progress reset' }), delOn: sheet === 'delete', askDel: () => set({ sheet: 'delete' }),
      secAt: String((st.secAt ?? 0) + 1), prevSec: () => goSec(Math.max(0, (st.secAt ?? 0) - 1)), nextSec: () => goSec(Math.min(LS.secs.length - 1, (st.secAt ?? 0) + 1)),
      secName: T(LS.secs[st.secAt ?? 0], 'h'), nextBg: (st.secAt ?? 0) >= LS.secs.length - 1 ? '#EEE9E2' : '#EDC684', secScroll: (e) => { const m = e.currentTarget, top = m.getBoundingClientRect().top; let k = 0; m.querySelectorAll('[data-sec]').forEach((h, i) => { if (h.getBoundingClientRect().top - top < m.clientHeight * 0.4) k = i; }); if (m.scrollTop + m.clientHeight >= m.scrollHeight - 4) k = LS.secs.length - 1; if (k !== (st.secAt ?? 0)) set({ secAt: k }); },
      vChips: ['C major', 'G major', 'F major'].map((v) => ({ v, bg: v === (st.ver ?? 'C major') ? '#332921' : '#EEE9E2', fg: v === (st.ver ?? 'C major') ? '#FEFDFB' : '#332921', pick: () => set({ ver: v }) })) };''')
LESSON_JS = LESSON_JS.replace('__INSJS__', INS_JS)
PILL = lambda t, bg=ACCENT: f'<span style="flex: none; height: 26px; padding: 0 12px; border-radius: 13px; background: {bg}; font-size: 13px; font-weight: 700; display: flex; align-items: center">{t}</span>'
GRIP = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle><circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle><circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>'
DOTS = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
PLUS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>'
UNDO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"></path><path d="M4 9h11a5 5 0 0 1 0 10h-3"></path></svg>'
REDO = UNDO.replace('<path d="M9 14 4 9l5-5"></path><path d="M4 9h11a5 5 0 0 1 0 10h-3"></path>', '<path d="m15 14 5-5-5-5"></path><path d="M20 9H9a5 5 0 0 0 0 10h3"></path>')
def KEYSOF(lst, h):
    return PKEYS(lst, h)
_SHORT = (f'<aside style="align-self: flex-start; max-width: 65ch; box-sizing: border-box; padding: 12px 16px; border-radius: 12px; background: {HONEY}; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #8A5A1C">In short</span><span contenteditable="{{{{editing}}}}" style="font-size: 16px; font-weight: 600; outline: none">{{{{s.take}}}}</span></aside>')
def DOC(lap=False):
    kbn, qn, kh = ('kbL', 'qkbL', 150) if lap else ('kb', 'qkb', 96)
    handle = ''
    ex = (f'<sc-if value="{{{{s.isScale}}}}" hint-placeholder-val="{{{{true}}}}"><figure style="position: relative; margin: 8px 0 0; display: flex; flex-direction: column; gap: 12px">'
          f'<div style="display: flex; align-items: center; gap: 8px; margin-bottom: -8px"><span style="flex: 1; font-size: 17px; font-weight: 700">{{{{verName}}}}</span>'
          f'<button type="button" aria-label="The colours" aria-expanded="{{{{legendOn}}}}" data-tip="The colours" onClick="{{{{toggleLegend}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{INFOI.replace('22', '20')}</button>'
          f'<button type="button" aria-label="Play" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAY.replace('width="22" height="22"', 'width="20" height="20"')}</button>'
          f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{openEx}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {INK}; color: {SHEET}; font: inherit; font-size: 15px; font-weight: 700">Edit</button></sc-if></div>'
          f'{KEYSOF(kbn, kh)}<sc-if value="{{{{legendOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="dialog" aria-label="The colours" style="position: absolute; right: 8px; top: 60px; z-index: 20; width: 248px; box-sizing: border-box; padding: 12px 16px; border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}">'
          f'<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px"><li style="display: flex; align-items: center; gap: 12px"><span style="flex: none; width: 18px; height: 28px; border-radius: 0 0 4px 4px; background: #9BC093; box-shadow: inset 0 0 0 1px rgba(51,41,33,.12)"></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 15px; font-weight: 600">Whole step · W</span><span style="font-size: 13px; color: {SOFT}">two half steps: C–D</span></span></li><li style="display: flex; align-items: center; gap: 12px"><span style="flex: none; width: 18px; height: 28px; border-radius: 0 0 4px 4px; background: #E8C67D; box-shadow: inset 0 0 0 1px rgba(51,41,33,.12)"></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 15px; font-weight: 600">Half step · H</span><span style="font-size: 13px; color: {SOFT}">the very next key: E–F, B–C</span></span></li></ul></div></sc-if></figure></sc-if>'
          f'<sc-if value="{{{{s.isQ}}}}" hint-placeholder-val="{{{{false}}}}"><figure style="margin: 8px 0 0; display: flex; flex-direction: column; gap: 12px">'
          f'<div style="display: flex; align-items: center; gap: 8px; margin-bottom: -8px"><span data-q style="flex: 1; min-height: 44px; display: flex; align-items: center; font-size: 17px; font-weight: 700">Play the D major scale</span><sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{openEx}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {INK}; color: {SHEET}; font: inherit; font-size: 15px; font-weight: 700">Edit</button></sc-if></div>'
          f'<span style="font-size: 14px; color: {SOFT}">Choose on the keys</span>{KEYSOF(qn, kh)}<div style="display: flex; align-items: center; gap: 8px"><span style="flex: 1; font-size: 14px; font-weight: 600; color: {{{{qInk}}}}">{{{{qLine}}}}</span>'
          f'<button type="button" onClick="{{{{resetQ}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">Again</button><sc-if value="{{{{notRight}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{showAns}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 700">Show the answer</button></sc-if></div></figure></sc-if>')
    # on a laptop a section's keyboard runs the page's width under its words, three octaves at a real key's proportion, as the Player's (owner, 2026-11-17: "these keyboards dont make
    # any sense, make other layout for the keyboards"); on a phone they stack
    # In short follows its example on the column's edge, sized to its words, in the phone's order (owner, 2026-11-17:
    # "i dont like this alignment of these yellow explanations on the right side")
    secst = 'display: flex; flex-direction: column; gap: 12px'
    sec = (f'<sc-for list="{{{{secs}}}}" as="s" hint-placeholder-count="2"><section onClick="{{{{s.pick}}}}" style="position: relative; {secst}; border-radius: 8px; outline: 2px solid {{{{s.ring}}}}; outline-offset: 6px">' +
           f'<h2 data-sec contenteditable="{{{{editing}}}}" style="margin: 0; scroll-margin-top: 16px; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; outline: none">{{{{s.h}}}}</h2>'
           f'<sc-if value="{{{{s.hasP}}}}" hint-placeholder-val="{{{{true}}}}"><p contenteditable="{{{{editing}}}}" style="margin: 0; max-width: 65ch; font-size: 17px; line-height: 1.55; text-wrap: pretty; outline: none">{{{{s.p}}}}</p></sc-if>'
           f'<sc-if value="{{{{s.hasSteps}}}}" hint-placeholder-val="{{{{false}}}}"><style data-steps>.steps {{ list-style: none; padding: 0 !important; counter-reset: st }} .steps li {{ counter-increment: st; display: grid; grid-template-columns: 24px minmax(0, 1fr) }} .steps li::before {{ content: counter(st) "."; font-variant-numeric: tabular-nums }}</style><ol class="steps" style="margin: 0; padding-left: 24px; font-size: 17px; line-height: 1.55; display: flex; flex-direction: column; gap: 4px"><sc-for list="{{{{s.steps}}}}" as="x" hint-placeholder-count="4"><li contenteditable="{{{{editing}}}}" style="outline: none">{{{{x.x}}}}</li></sc-for></ol></sc-if>'
           + f'{ex}' + _SHORT + '</section></sc-for>')
    head = (f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; font-weight: 600; color: #A8551F">{{{{place}}}} · Foundations</span>'
            f'<h1 contenteditable="{{{{editing}}}}" style="margin: 0; font-family: {SERIF}; font-size: {36 if lap else 30}px; line-height: 1.15; font-weight: 600; outline: none; text-wrap: balance">{{{{title}}}}</h1>'
            f'<p contenteditable="{{{{editing}}}}" style="margin: 0; font-size: 17px; line-height: 1.5; color: {SOFT}; outline: none">{{{{summary}}}}</p>'
            f'<span style="font-size: 14px; color: {SOFT}">After: <a href="{'LessonLaptop' if lap else 'Lesson'}.dc.html" style="display: inline-flex; align-items: center; min-height: 44px; color: {LINK}; font-weight: 600; text-decoration: none">6 · Half steps, whole steps, sharps and flats</a></span>'
            + '</div>')
    end = (f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{openIns}}}}" style="height: 48px; border: 0; border-radius: 12px; background: transparent; box-shadow: inset 0 0 0 1.5px {LINE}; color: {SOFT}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 8px; padding: 0 16px">{PLUS}Type / to insert music, a note and more</button></sc-if>')
    return head + sec + ADDED + end
DSTATUS = f'<span style="font-size: 13px; color: {SOFT}; white-space: nowrap">{{{{status}}}}</span>'
LANGSEG = (f'<div role="radiogroup" aria-label="Written in" style="flex: none; display: flex; gap: 2px; padding: 2px; border-radius: 11px; background: {FILL}"><sc-for list="{{{{langs}}}}" as="o" hint-placeholder-count="2"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 9px; background: {{{{o.bg}}}}; box-shadow: {{{{o.sh}}}}; color: {INK}; font: inherit; font-size: 14px; font-weight: {{{{o.fw}}}}">{{{{o.l}}}}</button></sc-for></div>')
PUBBTN = f'<button type="button" onClick="{{{{openPub}}}}" style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Publish…</button>'
EDITBTN = f'<sc-if value="{{{{canEdit}}}}" hint-placeholder-val="{{{{true}}}}">' + TB('Edit', 'edit') + '</sc-if>'
DONEBTN = TB('Done', 'done')
FMT = (f'<div role="toolbar" aria-label="Formatting" style="display: flex; align-items: center; gap: 2px">'
       + ''.join(f'<button type="button" aria-label="{l}" style="width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center">{g}</button>'
                 for l, g in [('Bold', 'B'), ('Undo', UNDO), ('Redo', REDO)])
       + f'<span style="width: 1px; height: 24px; background: {LINE}; margin: 0 4px"></span><button type="button" aria-label="Move the block" data-tip="Move the block" style="width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: {INK}; cursor: grab; display: flex; align-items: center; justify-content: center">{GRIP}</button><button type="button" aria-label="The block" data-tip="The block" onClick="{{{{openBlock}}}}" style="width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: {INK}; display: flex; align-items: center; justify-content: center">{DOTS}</button><span style="width: 1px; height: 24px; background: {LINE}; margin: 0 4px"></span><button type="button" onClick="{{{{openIns}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {INK}; color: {SHEET}; font: inherit; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px">{PLUS}Insert</button></div>')
PREVBAR = PREVPILL('left: 50%; transform: translateX(-50%); bottom: 112px', 'previewing', 'exitPreview')
PREVBAR_L = PREVPILL('left: 50%; transform: translateX(-50%); bottom: 32px', 'previewing', 'exitPreview')
INSBODY = INSLIST(CAPS)
EXBODY = (CAPS('Root') + ROOTGRID('exRoots') + CAPS('Scale') + CHIPS('exKinds') + GROUP(('seg', 'Clef', 'clefs'), bg=SHEET)
          + f'<div style="position: relative; display: flex; align-items: center; justify-content: space-between; min-height: 28px; padding-right: 12px">{CAPS("Notes")}' + INFOB('About Notes', 'tipNotes', 'tipNOn')
          + INFOTIP('tipNOn', 'tipNotes', 'About Notes', 'Each note with its octave, its value after a slash (2 a half, 8 an eighth), r a rest: E4 G4/2 r.', 'right: 0; top: 32px') + '</div>'
          + f'<input {KB["code"]} value="C4 D4 E4 F4 G4 A4 B4 C5" aria-label="Notes" style="height: 48px; box-sizing: border-box; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font-family: ui-monospace, Menlo, monospace; font-size: 15px; color: {INK}">'
          + CAPS('Opens') + CHIPS('opens'))
BLOCKBODY = GROUP(('link', 'Add below', '', 'openIns'), ('seg', 'Turn into', 'turns'), ('action', 'Duplicate', 'dupBlock'), ('action', 'Delete', 'removeBlock', '#B3261E'), bg=SHEET)
PUBBODY = (f'<div style="display: flex; align-items: center; gap: 12px"><span style="width: 10px; height: 10px; border-radius: 5px; background: #C26A2E"></span><span style="font-size: 17px; font-weight: 700">{{{{standing}}}}</span></div>'
           f'<sc-if value="{{{{isChanged}}}}" hint-placeholder-val="{{{{true}}}}">{CAPS("What changed")}{GROUP(("val", "Title", "edited"), ("val", "Section 2", "a question added"), ("val", "Русский", "summary written"), bg=SHEET)}'
           f'{GROUP(("link", "Learner preview", "", "Lesson.dc.html"), bg=SHEET)}<div style="display: flex">{BTN("Publish", "publish", "", "primary", 50)}</div></sc-if>'
           f'<sc-if value="{{{{isPublished}}}}" hint-placeholder-val="{{{{false}}}}">{GROUP(("link", "View", "", "Lesson.dc.html"), ("link", "Versions", "4", "openVer"), bg=SHEET)}{GROUP(("action", "Unpublish", "unpublish", "#B3261E"), bg=SHEET)}</sc-if>')
MOREBODY = GROUP(('link', 'Settings', '', 'openSettings'), ('action', 'Share link', 'copyLink'), bg=SHEET) + GROUP(('action', 'Reset progress', 'doReset'), bg=SHEET)
TOASTE = (f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 16px; right: 16px; bottom: 112px; z-index: 50; min-height: 52px; border-radius: 14px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 8px; padding: 4px 4px 4px 16px; min-height: 52px; font-size: 15px">'
          f'<span style="flex: 1; padding: 12px 0">{{{{toastT}}}}</span><sc-if value="{{{{toastUndo}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{undoRemove}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {ACCENT}; font: inherit; font-size: 15px; font-weight: 700">Undo</button></sc-if></div></sc-if>')
lph = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{TOP("LearnLevel.dc.html", "", EDITBTN + IB("More", DOTS, "openMore"), "Lessons")}</sc-if>'
       f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{TOP("LearnLevel.dc.html", "", IB("Settings", GEARI, "openSettings") + EDITR(), "Lessons")}</sc-if>'
       f'{PREVBAR}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 140px; display: flex; flex-direction: column; gap: 32px">{DOC()}</main>'
       f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(FMT)}</sc-if>{TOASTE}')
lsh = (BSHEET('insOn', 'Insert', INSBODY) + BSHEET('exOn', 'Scale', EXBODY) + BSHEET('menuOn', '{{blkT}}', BLOCKBODY) + BSHEET('moreOn', 'How major scales work', MOREBODY))
CONTENTS = (f'<nav aria-label="In this lesson" style="position: sticky; top: 0; display: flex; flex-direction: column; gap: 4px">{CAPS("In this lesson")}'
            f'<sc-for list="{{{{secs}}}}" as="s" hint-placeholder-count="2"><a href="#" onClick="{{{{s.go}}}}" style="min-height: 44px; display: flex; align-items: center; gap: 12px; padding: 0 8px; border-radius: 10px; background: {{{{s.navBg}}}}; color: {INK}; text-decoration: none; font-size: 15px; font-weight: {{{{s.navFw}}}}"><span style="width: 24px; height: 24px; border-radius: 12px; background: {{{{s.navDot}}}}; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{s.n}}}}</span>{{{{s.h}}}}</a></sc-for></nav>')
llm = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{LTOP("LearnLevelLaptop.dc.html", EDITBTN + IB("More", DOTS, "openMore"))}</sc-if>'
       f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{LTOP("LearnLevelLaptop.dc.html", IB("Settings", GEARI, "openSettings") + EDITR())}</sc-if>'
       f'{PREVBAR_L}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 40px 140px; display: flex; flex-direction: column; gap: 32px">{DOC(True)}</main><sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(FMT, 32, w="auto")}</sc-if>{TOASTE.replace("bottom: 112px; z-index: 50", "bottom: 32px; left: auto; right: 40px; width: 420px; z-index: 50")}')
lpops = (POPOVER('insOn', 'Insert', INSBODY, 'right: 300px; top: 72px', 420) + POPOVER('exOn', 'Scale', EXBODY, 'right: 260px; top: 260px', 460) + POPOVER('menuOn', '{{blkT}}', BLOCKBODY, 'left: 600px; top: 180px', 320) + POPOVER('moreOn', 'How major scales work', MOREBODY, 'right: 28px; top: 64px', 320))
# canvas 164: Learned says itself (scan-first 3: an icon alone left the learner guessing): a pill, grass once learned
LEARNEDB = LEARNEDT
# owner, 2026-11-18: "i dotn like that the settigs and hte tools are united … what is the meaning and value for teh
# metronome or tuner or otehr tools in the lessons? where the user just learn. remove them": no Tools in a lesson;
# Share link is in Settings › Share, as on a course and a song (owner, 2026-11-18: not in the header)
RBAR = IB('Settings', GEARI, 'openSettings') + EDITBTN
PMBTN = IB('Publishing', DOTS, 'openPm')
PUBGO = TB('{{pubL}}', 'publishNow')
lph = lph.replace('EDITBTN_PLACEHOLDER', '')
lph = lph.replace(EDITBTN + IB("More", DOTS, "openMore"), RBAR).replace('{LANGSEG}{PUBBTN}', '').replace(LANGSEG + PUBBTN, PUBGO)
llm = llm.replace(EDITBTN + IB("More", DOTS, "openMore"), RBAR).replace(DSTATUS + LANGSEG + PUBBTN, PUBGO)
# owner, 2026-11-17: "i dont like this learned chip … in the header and i dont like that i need to scroll to the end to
# go to the next lesson": the foot's glass bar holds where the learner is (it opens the contents) and Next lesson, in
# reach from the first screen; going on marks the lesson learned, with Undo in its toast. No Learned in the bar, no
# Previous and Next at the lesson's end (the head's After: link is the way back).
SECBAR = DOCK(f'<button type="button" onClick="{{{{openToc}}}}" style="flex: 1; min-width: 0; height: 52px; border: 0; border-radius: 26px; background: transparent; font: inherit; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 0 12px; color: {INK}"><span style="font-size: 13px; color: {SOFT}">Section {{{{secAt}}}} of 2</span><span style="max-width: 100%; font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{secName}}}}</span></button>'
              f'<button type="button" onClick="{{{{nextLesson}}}}" style="flex: none; height: 52px; padding: 0 16px 0 20px; border: 0; border-radius: 26px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 4px">Next lesson{CHEV_R}</button>')
TOCBODY = GROUP(('raw', CONTENTS.split('</div>', 0)[0].split(CAPS("In this lesson"), 1)[1].replace('</nav>', '').replace('padding: 0 8px; border-radius: 10px', 'min-height: 52px; padding: 0 12px; border-radius: 0')), bg=SHEET)
lsh = lsh + BSHEET('tocOn', 'In this lesson', TOCBODY)
# on a laptop too the contents and Next lesson are the foot's glass bar, centred on the lesson; the contents open over it
# (owner, 2026-11-17: "these empty spaces on the left under the sections should not be"): no side column that runs out
SECBAR_L = SECBAR.replace('left: 16px; right: 16px; bottom: 34px', 'left: 50%; width: 520px; transform: translateX(-50%); bottom: 32px')
llm = llm.replace('</main>', '</main><sc-if value="{{reading}}" hint-placeholder-val="{{true}}">' + SECBAR_L + '</sc-if>', 1)
lpops = lpops + POPOVER('tocOn', 'In this lesson', TOCBODY, 'left: calc(50% - 260px); bottom: 112px', 520)
lph = lph.replace(f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(FMT)}</sc-if>', f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(FMT)}</sc-if><sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{SECBAR}</sc-if>')
# the example's versions
VCH = f'<div role="group" aria-label="Versions" style="display: flex; gap: 8px"><sc-for list="{{{{vChips}}}}" as="v" hint-placeholder-count="3"><button type="button" onClick="{{{{v.pick}}}}" style="height: 44px; padding: 0 16px; border: solid transparent; border-width: 2px 0; background-clip: padding-box; border-radius: 22px; background-color: {{{{v.bg}}}}; color: {{{{v.fg}}}}; font: inherit; font-size: 14px; font-weight: 600">{{{{v.v}}}}</button></sc-for></div>'
for nm in ('lph', 'llm'):
    assert '<div role="dialog" aria-label="The colours"' in globals()[nm]
    globals()[nm] = globals()[nm].replace('<sc-if value="{{legendOn}}" hint-placeholder-val="{{false}}"><div role="dialog" aria-label="The colours"', VCH + '<sc-if value="{{legendOn}}" hint-placeholder-val="{{false}}"><div role="dialog" aria-label="The colours"', 1)
# the pages: Settings and Publish, over the lesson, Back to it
# owner, 2026-11-18: "i dont like the structure of these settings": the lesson, then Publishing (its state a value,
# Versions; Publish changes and Discard changes only while there are changes), then the learner's progress, the loss of
# the whole lesson last and apart; Share link went to the bar
# owner, 2026-11-18: "refactor the courses settings like the lessons settings with better structure and also place the
# delete button apropriately … i dont want the share button to be in the header": a lesson's and a course's Settings are
# one shape, the learner's own settings' shape too: the thing at the head (its picture, its name, where it stands), its
# facts, Share (Share link, out of the bar), Publishing (the state a value, Versions; Publish and Discard only while
# there are changes), the learner's progress, and the loss of the whole thing alone at the foot, 24 below the rest
THINGSEC = lambda *parts: f'<section style="display: flex; flex-direction: column; gap: 8px">{"".join(parts)}</section>'
def THINGHEAD(pic, name, sub):
    return (f'<div style="display: flex; gap: 16px; align-items: center; padding: 4px 0">{pic}<div style="display: flex; flex-direction: column; gap: 2px; min-width: 0">'
            f'<span style="font-size: 20px; font-weight: 700; text-wrap: balance">{name}</span><span style="font-size: 14px; color: {SOFT}">{sub}</span></div></div>')
def THINGSET(head, facts, kind):
    return ('<div style="display: flex; flex-direction: column; gap: 24px">' + head + facts
            + THINGSEC(CAPS('Share'), GROUP(('action', 'Share link', 'copyLink'), bg=SHEET))
            + THINGSEC(CAPS('Publishing'), GROUP(('val', 'Status', '{{standing}}'), ('link', 'Versions', '{{verN}}', 'openVer'), bg=SHEET),
                       f'<sc-if value="{{{{isChanged}}}}" hint-placeholder-val="{{{{true}}}}">{GROUP(("action", "Publish changes", "publishNow"), ("action", "Discard changes", "discard", "#B3261E"), bg=SHEET)}</sc-if>')
            + THINGSEC(CAPS('Your progress'), GROUP(('action', 'Reset progress', 'doReset'), bg=SHEET))
            + '<div style="margin-top: 16px">' + GROUP(('action', f'Delete {kind}', 'askDel', '#B3261E'), bg=SHEET) + '</div></div>')
LESSONPIC = f'<span aria-hidden="true" style="flex: none; width: 64px; height: 64px; border-radius: 32px; background: {SHEET}; box-shadow: inset 0 0 0 1px {LINE}; color: {INK}; display: flex; align-items: center; justify-content: center">{BOOKI}</span>'
SETPAGE = THINGSET(THINGHEAD(LESSONPIC, 'How major scales work', 'Lesson 7 of 13 · Foundations'),
                   THINGSEC(CAPS('The lesson'), GROUP(('link', 'Place', 'Foundations · Chapter 3 · Lesson 7', 'LearnLevelLaptop.dc.html'), bg=SHEET)), 'lesson')
VERBODY = (f''
           + GROUP(*[('raw', f'<div style="min-height: 56px; display: flex; align-items: center; gap: 8px; padding: 6px 8px 6px 16px"><span style="flex: 1; font-size: 16px">Published {d}</span>{t}<button type="button" onClick="{{{{restore}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">Restore</button></div>') for d, t in [('8 November 2026', PILL('Newest', HONEY)), ('2 November 2026', ''), ('28 October 2026', ''), ('20 October 2026', '')]], bg=SHEET))
STYLEBODY = (CAPS('Look') + f'<div role="radiogroup" aria-label="Look" style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{looks}}}}" as="o" hint-placeholder-count="4"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 56px; border: 0; border-radius: 12px; background: {{{{o.bg}}}}; box-shadow: {{{{o.ring}}}}; color: {{{{o.fg}}}}; font: inherit; font-size: 15px; font-weight: 600">{{{{o.n}}}}</button></sc-for></div>'
             + GROUP(('action', 'Reset to default', 'resetLook'), bg=SHEET))
def ASK(cond, t, b, ok, go):
    return (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeSheet}}}}" style="position: absolute; inset: 0; z-index: 70; background: rgba(51,41,33,.32)"></div><div role="alertdialog" aria-label="{t}" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 71; width: 372px; max-width: calc(100% - 48px); box-sizing: border-box; border-radius: 22px; background: {PAGE}; padding: 20px; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column; gap: 8px">'
            f'<span style="font-size: 18px; font-weight: 700">{t}</span><span style="font-size: 15px; line-height: 1.45; color: {SOFT}">{b}</span><div style="display: flex; gap: 8px; margin-top: 8px"><button type="button" onClick="{{{{closeSheet}}}}" style="flex: 1; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Cancel</button>'
            f'<button type="button" onClick="{{{{{go}}}}}" style="flex: 1; height: 44px; border: 0; border-radius: 22px; background: #B3261E; color: #FFFFFF; font: inherit; font-size: 16px; font-weight: 700">{ok}</button></div></div></sc-if>')
ASKS = ASK('delOn', 'Delete How major scales work?', 'Learners lose it the next time the app starts, with its unpublished changes and every saved version.', 'Delete lesson', 'closeSheet')
def SPLIT2(page, first, second):
    a, b, c = page.index(first), page.index(second), len(page)
    col = '<div style="min-width: 0; display: flex; flex-direction: column; gap: 16px">'
    return page[:a] + '<div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 32px; align-items: start">' + col + page[a:b] + '</div>' + col + page[b:] + '</div></div>'
SETPAGE_L = SETPAGE  # one column on a laptop too, as the learner's own settings: the loss last, never top right
def PAGEOVER(lap):
    pad = 'padding: 24px 0 60px; align-items: center' if lap else 'padding: 8px 16px 40px'
    inner_w = 'width: min(1180px, 100%); ' if lap else ''
    return (f'<sc-if value="{{{{onPage}}}}" hint-placeholder-val="{{{{false}}}}"><div style="position: absolute; inset: 0; z-index: 45; background: {PAGE}; display: flex; flex-direction: column">'
            + (f'<div style="height: {54 if not lap else 0}px; flex: none"></div>' if not lap else '')
            + f'<header style="flex: none; min-height: 56px; display: flex; align-items: center; gap: 12px; padding: 0 16px{" 0 44px" if lap else ""}"><button type="button" aria-label="Back to the lesson" onClick="{{{{closePage}}}}" style="{GLASSST}; margin-left: -4px">{CHEV_L}</button><h1 style="margin: 0 0 0 {-4 if not lap else 0}px; font-size: {30 if lap else 17}px; font-weight: {700 if lap else 600}{"; letter-spacing: -0.01em" if lap else ""}">{{{{pageT}}}}</h1></header>'
            f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; {pad}"><div style="{inner_w}display: flex; flex-direction: column; gap: 16px">'
            f'<sc-if value="{{{{isSet}}}}" hint-placeholder-val="{{{{true}}}}">{SETPAGE_L if lap else SETPAGE}</sc-if></div></main></div></sc-if>')
lph = SHOWSTATES() + lph.replace('<main class="nos"', '<main class="nos" onScroll="{{secScroll}}"') + PAGEOVER(False) + ASKS
llm = SHOWSTATES() + llm.replace('<main class="nos"', '<main class="nos" onScroll="{{secScroll}}"') + PAGEOVER(True) + ASKS
lsh = lsh + BSHEET('verOn', 'Versions of How major scales work', VERBODY) + BSHEET('styleOn', 'Style: Scale', STYLEBODY)
lpops = lpops + POPOVER('verOn', 'Versions of How major scales work', VERBODY, 'right: 120px; top: 64px', 440) + POPOVER('styleOn', 'Style: Scale', STYLEBODY, 'right: 260px; top: 200px', 420)
BLOCKBODY2 = GROUP(('link', 'Add below', '', 'openIns'), ('seg', 'Turn into', 'turns'), ('link', 'Edit', '', 'openEx'), ('link', 'Style', '{{lookV}}', 'openStyle'), ('action', 'Duplicate', 'dupBlock'), ('action', 'Delete', 'removeBlock', '#B3261E'), bg=SHEET)
lsh = lsh.replace(BLOCKBODY, BLOCKBODY2); lpops = lpops.replace(BLOCKBODY, BLOCKBODY2)
detail('Lesson', 'How major scales work', LESSON_JS, lph, llm, '', lsh, lpops, 'Learn')

# ── Learn's level in Edit mode: the same page, rows dragged, chapters renamed, lessons and chapters added ──
print('r47 lesson ok')
