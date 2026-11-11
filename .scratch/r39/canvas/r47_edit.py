# R47: the editors' Edit mode, in place (owner: "maybe the page enters the edit mode and not a new page … look the same
# like it looks in preview"; ADR 0116 r21, Obsidian's Live Preview). A lesson read by a learner, and the same page edited
# by an editor: the bar's Edit turns it into the document; English | Русский; the draft's status under the title;
# Publish with its menu; a formatting bar; Insert (and /) by group; an example's Edit sheet; the Publish page.
# Learn's level gets the same Edit mode: rows dragged, chapters renamed and added, Remove with Undo. Preview as learner
# hides all of it. Exact labels from src/shared/i18n/locales/en/learn.ts and editor.ts. Exec'd by r41.py.
LESSON = {
  'place': 'Lesson 7 of 13', 'title': 'How major scales work', 'titleRu': 'Как устроены мажорные гаммы',
  'summary': 'Build a major scale on any key from one pattern of whole and half steps.',
  'summaryRu': 'Постройте мажорную гамму от любой клавиши по одной схеме тонов и полутонов.',
  'secs': [
    {'h': 'One pattern for every key', 'hRu': 'Одна схема для всех тональностей',
     'p': 'Every major scale climbs by the same steps: whole, whole, half, whole, whole, whole, half. Start on C and only white keys fit the pattern.',
     'pRu': 'Любая мажорная гамма поднимается одинаково: тон, тон, полутон, тон, тон, тон, полутон. От до схеме подходят только белые клавиши.',
     'ex': 'scale', 'take': 'W W H W W W H, from any key.'},
    {'h': 'Building D major', 'hRu': 'Строим ре мажор',
     'steps': ['Start on D.', 'Whole step to E, whole step to F♯.', 'Half step to G, then whole steps to A, B and C♯.', 'Half step home to D.'],
     'ex': 'question', 'take': 'D major has two sharps: F♯ and C♯.'}]}
INSERT = [('Text', ['Text', 'Steps', 'Note', 'Rule']), ('Music', ['Chords', 'One chord on every root', 'Scale', 'Interval', 'Notes', 'Voicings', 'Pattern', 'Progression', 'Versions']), ('Ask and link', ['Question', 'Link', 'Picture'])]
LESSON_JS = js('const LS = ' + json.dumps(LESSON, ensure_ascii=False) + ', INS = ' + json.dumps(INSERT) + ';\n' + r'''
    const editing = !!st.editing, ru = st.lang === 'RU', preview = !!st.preview, sheet = st.sheet ?? null, pub = st.pub ?? 'changed';
    const T = (o, k) => ru ? o[k + 'Ru'] || o[k] : o[k];
    const secs = LS.secs.map((s, i) => ({ n: String(i + 1), h: T(s, 'h'), p: T(s, 'p') || '', hasP: !!s.p, steps: (s.steps || []).map((x) => ({ x })), hasSteps: !!s.steps,
      isScale: s.ex === 'scale', isQ: s.ex === 'question', take: s.take, sel: st.sel === i, pick: () => set({ sel: i }) }));
    const D = [62, 64, 66, 67, 69, 71, 73, 74], Cm = [60, 62, 64, 65, 67, 69, 71, 72], marks = {}, qm = {};
    Cm.forEach((m, i) => { marks[m] = [i === 2 || i === 6 ? '#E8C67D' : '#9BC093', ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'][i]]; });
    (st.chosen || []).forEach((m) => { qm[m] = ['#85B8DC', '']; });
    const chosen = st.chosen || [], right = chosen.length === 8 && D.every((m) => chosen.includes(m));
    return { ...common(st, set), editing, reading: !editing, canEdit: !preview, previewing: preview, exitPreview: () => set({ preview: false }),
      edit: () => set({ editing: true, sel: 0 }), done: () => set({ editing: false, sheet: null }), langs: seg(['EN', 'RU'], ru ? 'RU' : 'EN', (l) => set({ lang: l })),
      place: LS.place, title: T(LS, 'title'), summary: T(LS, 'summary'), secs, status: st.saving ? 'Saving…' : 'Saved · not published',
      kb: calmKeys(60, 76, marks, 362, 96), kbL: calmKeys(60, 76, marks, 680, 120), qkb: calmKeys(60, 76, qm, 362, 96), qkbL: calmKeys(60, 76, qm, 680, 120),
      qLine: right ? 'Correct' : (chosen.length + ' of 8 notes'), qInk: right ? '#2F5A35' : '#685E56', showAns: () => set({ chosen: D }), resetQ: () => set({ chosen: [] }),
      insOn: sheet === 'insert', openIns: () => set({ sheet: 'insert' }), ins: INS.map(([g, ks]) => ({ g, ks: ks.map((k) => ({ k, add: () => set({ sheet: null, toast: 'Added: ' + k }) })) })),
      exOn: sheet === 'example', openEx: () => set({ sheet: 'example' }), menuOn: sheet === 'block', openBlock: () => set({ sheet: 'block' }),
      pubOn: sheet === 'publish', openPub: () => set({ sheet: 'publish' }), moreOn: sheet === 'more', openMore: () => set({ sheet: 'more' }),
      isChanged: pub === 'changed', isPublished: pub === 'published', publish: () => set({ pub: 'published', sheet: null, toast: 'Published. Learners will receive it the next time they open the app.' }),
      unpublish: () => set({ pub: 'changed', sheet: null, toast: 'Unpublished' }), standing: pub === 'published' ? 'Published' : 'Has changes',
      toastOn: !!st.toast, toastT: st.toast || '', closeToast: () => set({ toast: null }), undoRemove: () => set({ toast: null }),
      removeBlock: () => set({ sheet: null, toast: 'Deleted: Scale' }) };''')
PILL = lambda t, bg=ACCENT: f'<span style="flex: none; height: 26px; padding: 0 10px; border-radius: 13px; background: {bg}; font-size: 13px; font-weight: 700; display: flex; align-items: center">{t}</span>'
GRIP = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"></circle><circle cx="15" cy="6" r="1.6"></circle><circle cx="9" cy="12" r="1.6"></circle><circle cx="15" cy="12" r="1.6"></circle><circle cx="9" cy="18" r="1.6"></circle><circle cx="15" cy="18" r="1.6"></circle></svg>'
DOTS = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>'
PLUS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>'
UNDO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"></path><path d="M4 9h11a5 5 0 0 1 0 10h-3"></path></svg>'
REDO = UNDO.replace('<path d="M9 14 4 9l5-5"></path><path d="M4 9h11a5 5 0 0 1 0 10h-3"></path>', '<path d="m15 14 5-5-5-5"></path><path d="M20 9H9a5 5 0 0 0 0 10h3"></path>')
def KEYSOF(lst, h):
    return KEYS(h).replace('kb.', lst + '.')
EDITABLE = 'border-radius: 6px; box-shadow: {{editRing}}'
def DOC(lap=False):
    kbn, qn, kh = ('kbL', 'qkbL', 120) if lap else ('kb', 'qkb', 96)
    handle = (f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><span style="position: absolute; left: -44px; top: 0; display: flex; flex-direction: column">'
              f'<button type="button" aria-label="Move: {{{{s.h}}}}" style="width: 40px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center; cursor: grab">{GRIP}</button>'
              f'<button type="button" aria-label="More: {{{{s.h}}}}" onClick="{{{{openBlock}}}}" style="width: 40px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{DOTS}</button></span></sc-if>')
    ex = (f'<sc-if value="{{{{s.isScale}}}}" hint-placeholder-val="{{{{true}}}}"><figure style="position: relative; margin: 0; padding: 12px; border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; gap: 10px">'
          f'<div style="display: flex; align-items: center; gap: 8px"><span style="flex: 1; font-size: 15px; font-weight: 700">C major · <span style="font-weight: 500; color: {SOFT}">W W H W W W H</span></span>'
          f'<button type="button" aria-label="Play" style="width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAY.replace('width="22" height="22"', 'width="20" height="20"')}</button>'
          f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{openEx}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 22px; background: {INK}; color: {SHEET}; font: inherit; font-size: 15px; font-weight: 700">Edit</button></sc-if></div>'
          f'{KEYSOF(kbn, kh)}<figcaption style="font-size: 13px; color: {SOFT}">Green: whole steps · Gold: the half steps, E–F and B–C</figcaption></figure></sc-if>'
          f'<sc-if value="{{{{s.isQ}}}}" hint-placeholder-val="{{{{false}}}}"><figure style="margin: 0; padding: 12px; border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; display: flex; flex-direction: column; gap: 10px">'
          f'<div style="display: flex; align-items: center; gap: 8px"><span style="flex: 1; font-size: 16px; font-weight: 700">Play the D major scale</span><sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{openEx}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 22px; background: {INK}; color: {SHEET}; font: inherit; font-size: 15px; font-weight: 700">Edit</button></sc-if></div>'
          f'<span style="font-size: 14px; color: {SOFT}">Choose on the keys</span>{KEYSOF(qn, kh)}<div style="display: flex; align-items: center; gap: 8px"><span style="flex: 1; font-size: 14px; font-weight: 600; color: {{{{qInk}}}}">{{{{qLine}}}}</span>'
          f'<button type="button" onClick="{{{{resetQ}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 15px; font-weight: 600">Again</button><button type="button" onClick="{{{{showAns}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 700">Show the answer</button></div></figure></sc-if>')
    sec = (f'<sc-for list="{{{{secs}}}}" as="s" hint-placeholder-count="2"><section style="position: relative; display: flex; flex-direction: column; gap: 12px">{handle}'
           f'<h2 contenteditable="{{{{editing}}}}" style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; outline: none">{{{{s.h}}}}</h2>'
           f'<sc-if value="{{{{s.hasP}}}}" hint-placeholder-val="{{{{true}}}}"><p contenteditable="{{{{editing}}}}" style="margin: 0; font-size: 17px; line-height: 1.55; text-wrap: pretty; outline: none">{{{{s.p}}}}</p></sc-if>'
           f'<sc-if value="{{{{s.hasSteps}}}}" hint-placeholder-val="{{{{false}}}}"><ol style="margin: 0; padding-left: 24px; font-size: 17px; line-height: 1.55; display: flex; flex-direction: column; gap: 4px"><sc-for list="{{{{s.steps}}}}" as="x" hint-placeholder-count="4"><li contenteditable="{{{{editing}}}}" style="outline: none">{{{{x.x}}}}</li></sc-for></ol></sc-if>'
           f'{ex}<aside style="padding: 10px 14px; border-radius: 12px; background: {HONEY}; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #8A5A1C">In short</span><span contenteditable="{{{{editing}}}}" style="font-size: 16px; font-weight: 600; outline: none">{{{{s.take}}}}</span></aside></section></sc-for>')
    head = (f'<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 14px; font-weight: 600; color: #A8551F">{{{{place}}}} · Foundations</span>'
            f'<h1 contenteditable="{{{{editing}}}}" style="margin: 0; font-family: {SERIF}; font-size: {36 if lap else 30}px; line-height: 1.15; font-weight: 600; outline: none; text-wrap: balance">{{{{title}}}}</h1>'
            f'<p contenteditable="{{{{editing}}}}" style="margin: 0; font-size: 17px; line-height: 1.5; color: {SOFT}; outline: none">{{{{summary}}}}</p>'
            f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}"><span style="font-size: 14px; color: {SOFT}">After: <a href="#" style="display: inline-flex; align-items: center; min-height: 44px; color: {LINK}; font-weight: 600; text-decoration: none">6 · Half steps, whole steps, sharps and flats</a></span></sc-if>'
            f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><div aria-label="Properties" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px">'
            + ''.join(f'<button type="button" style="height: 36px; padding: 0 12px; border: 0; border-radius: 18px; background: {FILL}; color: {INK}; font: inherit; font-size: 14px"><span style="color: {SOFT}">{k}</span> {v}</button>' for k, v in [('Written in', 'English, Русский'), ('Read first', 'Lesson 6'), ('Level', 'Beginner'), ('Chapter', '3')])
            + '</div></sc-if></div>')
    end = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}"><nav style="display: flex; gap: 8px; padding-top: 8px">{BTN("Previous lesson", "", "#", "quiet", 50)}{BTN("Next lesson", "", "#", "primary", 50)}</nav></sc-if>'
           f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" onClick="{{{{openIns}}}}" style="height: 48px; border: 0; border-radius: 12px; background: transparent; box-shadow: inset 0 0 0 1.5px {LINE}; color: {SOFT}; font: inherit; font-size: 15px; display: flex; align-items: center; gap: 8px; padding: 0 14px">{PLUS}Type / to insert music, a note and more</button></sc-if>')
    return head + sec + end
DSTATUS = f'<span style="font-size: 13px; color: {SOFT}; white-space: nowrap">{{{{status}}}}</span>'
LANGSEG = (f'<div role="radiogroup" aria-label="Written in" style="flex: none; display: flex; gap: 2px; padding: 2px; border-radius: 11px; background: {FILL}"><sc-for list="{{{{langs}}}}" as="o" hint-placeholder-count="2"><button type="button" role="radio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="width: 44px; height: 40px; border: 0; border-radius: 9px; background: {{{{o.bg}}}}; box-shadow: {{{{o.sh}}}}; color: {INK}; font: inherit; font-size: 14px; font-weight: {{{{o.fw}}}}">{{{{o.l}}}}</button></sc-for></div>')
PUBBTN = f'<button type="button" onClick="{{{{openPub}}}}" style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {ACCENT}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Publish…</button>'
EDITBTN = f'<sc-if value="{{{{canEdit}}}}" hint-placeholder-val="{{{{true}}}}"><button type="button" onClick="{{{{edit}}}}" style="flex: none; height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 16px; font-weight: 700">Edit</button></sc-if>'
DONEBTN = f'<button type="button" onClick="{{{{done}}}}" style="flex: none; height: 44px; padding: 0 8px; border: 0; background: transparent; color: {LINK}; font: inherit; font-size: 17px; font-weight: 700">Done</button>'
FMT = (f'<div role="toolbar" aria-label="Formatting" style="display: flex; align-items: center; gap: 2px">'
       + ''.join(f'<button type="button" aria-label="{l}" style="width: 44px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center">{g}</button>'
                 for l, g in [('Bold', 'B'), ('Lead in bold', '<span style="font-size: 13px">B…</span>'), ('Undo', UNDO), ('Redo', REDO)])
       + f'<span style="width: 1px; height: 24px; background: {LINE}; margin: 0 4px"></span><button type="button" onClick="{{{{openIns}}}}" style="height: 44px; padding: 0 14px; border: 0; border-radius: 22px; background: {INK}; color: {SHEET}; font: inherit; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 6px">{PLUS}Insert</button></div>')
PREVBAR = (f'<sc-if value="{{{{previewing}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="flex: none; margin: 0 16px 8px; min-height: 44px; border-radius: 12px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 8px; padding: 0 4px 0 14px; font-size: 15px; font-weight: 600"><span style="flex: 1">Previewing as learner</span>'
           f'<button type="button" onClick="{{{{exitPreview}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {ACCENT}; font: inherit; font-size: 15px; font-weight: 700">Exit</button></div></sc-if>')
INSBODY = (f'<label style="height: 44px; border-radius: 12px; background: {FILL}; display: flex; align-items: center; gap: 8px; padding: 0 12px; color: {SOFT}">{SEARCH}<input placeholder="Insert" aria-label="Insert" style="flex: 1; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none"></label>'
           f'<sc-for list="{{{{ins}}}}" as="g" hint-placeholder-count="3"><section style="display: flex; flex-direction: column; gap: 6px">{CAPS("{{g.g}}")}<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px"><sc-for list="{{{{g.ks}}}}" as="k" hint-placeholder-count="4">'
           f'<button type="button" onClick="{{{{k.add}}}}" style="min-height: 48px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600; text-align: left; padding: 8px 12px">{{{{k.k}}}}</button></sc-for></div></section></sc-for>')
EXBODY = (GROUP(('seg', 'Clef', 'clefSeg'), bg=SHEET).replace('{{clefSeg}}', '') if False else '') + (
          f'{CAPS("Scale")}<div style="display: flex; gap: 8px">' + ''.join(f'<button type="button" style="flex: 1; height: 48px; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; color: {INK}; font: inherit; font-size: 15px; text-align: left; padding: 0 12px"><span style="color: {SOFT}">{k}</span> <b>{v}</b></button>' for k, v in [('Root', 'C'), ('Scale', 'Major'), ('Clef', 'Treble')])
          + f'</div>{CAPS("Notes")}<input value="C4 D4 E4 F4 G4 A4 B4 C5" aria-label="Notes" style="height: 48px; box-sizing: border-box; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font-family: ui-monospace, Menlo, monospace; font-size: 15px; color: {INK}">'
          f'<span style="font-size: 13px; color: {SOFT}">Each note with its octave, its value after a slash (2 a half, 8 an eighth), r a rest: E4 G4/2 r.</span>'
          f'{CAPS("Opens")}<div style="display: flex; flex-wrap: wrap; gap: 6px">' + ''.join(f'<span style="height: 40px; padding: 0 14px; border-radius: 20px; background: {INK if o == "A scale" else FILL}; color: {SHEET if o == "A scale" else INK}; font-size: 14px; font-weight: 600; display: flex; align-items: center">{o}</span>' for o in ['A lesson', 'A chord', 'A scale', 'A key', 'As written']) + '</div>')
BLOCKBODY = GROUP(('link', 'Add below', '', 'openIns'), ('link', 'Turn into', 'Text', '#'), ('link', 'Duplicate', '', '#'), ('action', 'Delete', 'removeBlock', '#B3261E'), bg=SHEET)
PUBBODY = (f'<div style="display: flex; align-items: center; gap: 10px"><span style="width: 10px; height: 10px; border-radius: 5px; background: #C26A2E"></span><span style="font-size: 17px; font-weight: 700">{{{{standing}}}}</span></div>'
           f'<sc-if value="{{{{isChanged}}}}" hint-placeholder-val="{{{{true}}}}">{CAPS("What changed")}{GROUP(("val", "Title", "edited"), ("val", "Section 2", "a question added"), ("val", "Русский", "summary written"), bg=SHEET)}'
           f'{GROUP(("link", "Learner preview", "", "#"), bg=SHEET)}<div style="display: flex">{BTN("Publish", "publish", "", "primary", 50)}</div><span style="font-size: 13px; color: {SOFT}">Every learner gets this version the next time the app starts. Each version is kept.</span></sc-if>'
           f'<sc-if value="{{{{isPublished}}}}" hint-placeholder-val="{{{{false}}}}">{GROUP(("link", "Link", "pianotrainer.app/lessons/major-scales", "#"), ("link", "View", "", "#"), ("link", "Versions", "4", "#"), bg=SHEET)}{GROUP(("action", "Unpublish", "unpublish", "#B3261E"), bg=SHEET)}</sc-if>')
MOREBODY = GROUP(('link', 'Settings', '', '#'), ('link', 'Lessons read as', 'One page', '#'), ('link', 'Share link', '', '#'), bg=SHEET) + GROUP(('action', 'Reset progress', 'closeSheet', '#B3261E'), bg=SHEET)
TOASTE = (f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 16px; right: 16px; bottom: 112px; z-index: 50; min-height: 52px; border-radius: 14px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 8px; padding: 4px 4px 4px 16px; font-size: 15px">'
          f'<span style="flex: 1">{{{{toastT}}}}</span><button type="button" onClick="{{{{undoRemove}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {ACCENT}; font: inherit; font-size: 15px; font-weight: 700">Undo</button></div></sc-if>')
lph = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{TOP("LearnLaptop.dc.html".replace("Laptop", ""), "", EDITBTN + IB("More", DOTS, "openMore"), "Lessons")}</sc-if>'
       f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><header style="flex: none; display: flex; flex-direction: column; gap: 2px; padding: 0 16px 6px"><div style="min-height: 52px; display: flex; align-items: center; gap: 8px">{DONEBTN}<span style="flex: 1"></span>{LANGSEG}{PUBBTN}</div><div style="display: flex; justify-content: center">{DSTATUS}</div></header></sc-if>'
       f'{PREVBAR}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 140px 48px; display: flex; flex-direction: column; gap: 28px">{DOC()}</main>'
       f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(FMT)}</sc-if>{TOASTE}')
lsh = (BSHEET('insOn', 'Insert', INSBODY) + BSHEET('exOn', 'Scale', EXBODY) + BSHEET('menuOn', 'One pattern for every key', BLOCKBODY) + BSHEET('pubOn', 'Publish', PUBBODY) + BSHEET('moreOn', 'How major scales work', MOREBODY))
CONTENTS = (f'<nav aria-label="In this lesson" style="position: sticky; top: 0; display: flex; flex-direction: column; gap: 4px">{CAPS("In this lesson")}'
            f'<sc-for list="{{{{secs}}}}" as="s" hint-placeholder-count="2"><a href="#" style="min-height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 8px; border-radius: 10px; color: {INK}; text-decoration: none; font-size: 15px"><span style="width: 24px; height: 24px; border-radius: 12px; background: {FILL}; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center">{{{{s.n}}}}</span>{{{{s.h}}}}</a></sc-for></nav>')
llm = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{LTOP("LearnLaptop.dc.html", EDITBTN + IB("More", DOTS, "openMore"), "Foundations")}</sc-if>'
       f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><header style="flex: none; height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 28px 0 32px; box-shadow: inset 0 -1px 0 {LINE}">{DONEBTN}<span style="width: 1px; height: 24px; background: {LINE}"></span>{FMT}<span style="flex: 1"></span>{DSTATUS}{LANGSEG}{PUBBTN}</header></sc-if>'
       f'{PREVBAR}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 40px 60px; display: grid; grid-template-columns: 260px 704px; justify-content: center; gap: 72px; align-items: start">{CONTENTS}<div style="display: flex; flex-direction: column; gap: 32px">{DOC(True)}</div></main>{TOASTE.replace("bottom: 112px; z-index: 50", "bottom: 32px; left: auto; right: 40px; width: 420px; z-index: 50")}')
lpops = (POPOVER('insOn', 'Insert', INSBODY, 'right: 300px; top: 72px', 420) + POPOVER('exOn', 'Scale', EXBODY, 'right: 260px; top: 260px', 460) + POPOVER('menuOn', 'One pattern for every key', BLOCKBODY, 'left: 600px; top: 180px', 320)
         + POPOVER('pubOn', 'Publish', PUBBODY, 'right: 28px; top: 72px', 400) + POPOVER('moreOn', 'How major scales work', MOREBODY, 'right: 28px; top: 64px', 320))
detail('Lesson', 'How major scales work', LESSON_JS, lph, llm, '', lsh, lpops, 'Learn')

# ── Learn's level in Edit mode: the same page, rows dragged, chapters renamed, lessons and chapters added ──
print('r47 lesson ok')
