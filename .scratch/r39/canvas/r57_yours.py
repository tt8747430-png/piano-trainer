# R57 (canvas 165, owner 2026-11-13: "refactor further the settings and what about the new lessons or new courses
# actions and such things and organizing my lessons and courses. and refactor the courses settings and lessons settings
# and their overviews pages properly"). The learner's own lessons and courses get a library of their own in the app's
# library shape (search, kind chips, sort, a course folding open to its lessons, a row's ⋯, the floating +), one New
# sheet for a lesson or a course, and Settings pages built as every Settings page: the name and what it is in rows that
# open in place, Progress, Delete apart. Exec'd by r41.py after r48.
YOURS = {
    'courses': [
        {'t': 'Sunday service set', 'paint': SAGE, 'pic': 'cross', 'line': 'What I play on Sunday mornings',
         'lessons': [['The ii–V–I in my hymns', '3 sections', 'learned'], ['Warm-up before church', '2 sections', ''], ['Reharmonising Amazing Grace', '4 sections', ''], ['Intros and endings', '2 sections', '']]},
        {'t': 'Jazz on the side', 'paint': LILAC, 'pic': 'note', 'line': 'Shells, rootless voicings, a blues a week',
         'lessons': [['Shell voicings in every key', '3 sections', ''], ['A blues in F', '2 sections', '']]},
    ],
    'loose': [['Pedalling in slow hymns', '2 sections', ''], ['Notes from my teacher', '1 section', '']],
}
YOURS_JS = js('const Y = ' + json.dumps(YOURS, ensure_ascii=False) + ';\n' + r'''
    const kind = st.kind ?? 'All', sort = st.sort ?? 'Recent', open = st.open ?? { 'Sunday service set': true }, gone = st.gone ?? {}, sheet = st.sheet ?? null;
    const q = st.q ?? '';
    const rowOf = (t, d, k, inCourse) => ({ t, d: 'Lesson · ' + d + (k === 'learned' ? ' · learned' : ''), learned: k === 'learned', todo: k !== 'learned', inCourse, tileBg: k === 'learned' ? '#DCE9D6' : '#FEFDFB', tileRing: k === 'learned' ? 'none' : 'inset 0 0 0 1px #DAD1C8', tileFg: k === 'learned' ? '#2F5A35' : '#332921',
      more: () => set({ sheet: 'row', row: t }), remove: () => set({ gone: { ...gone, [t]: true }, sheet: null, toast: '“' + t + '” deleted' }) });
    const courses = (kind === 'Lessons' ? [] : Y.courses).filter((c) => !gone[c.t]).map((c) => {
      const ls = c.lessons.filter(([t]) => !gone[t]).map(([t, d, k]) => rowOf(t, d, k, true));
      const isOpen = !!open[c.t] && kind !== 'Courses';
      return { t: c.t, paint: c.paint, d: 'Course · ' + ls.length + ' lessons' + (ls.some((l) => l.learned) ? ' · 1 learned' : ''), lessons: ls, isOpen, shut: !isOpen,
        toggle: () => set({ open: { ...open, [c.t]: !open[c.t] } }), more: () => set({ sheet: 'row', row: c.t }), chev: isOpen ? 'rotate(90deg)' : 'none' };
    });
    const loose = (kind === 'Courses' ? [] : Y.loose).filter(([t]) => !gone[t]).map(([t, d, k]) => rowOf(t, d, k, false));
    const sheetOpen = (n) => () => set({ sheet: n });
    return { ...common(st, set), closeSheet: () => set({ sheet: null }),
      kinds: chipsOf(['All', 'Lessons', 'Courses'], kind, (x) => set({ kind: x })), sortL: sort, sortOn: sheet === 'sort', openSort: sheetOpen('sort'),
      sorts: seg(['Recent', 'Name'], sort, (x) => set({ sort: x, sheet: null })),
      courses, loose, hasLoose: loose.length > 0, looseHead: kind === 'All',
      rowOn: sheet === 'row', rowT: st.row || '', rowIsLesson: !Y.courses.some((c) => c.t === st.row),
      removeRow: () => set({ gone: { ...gone, [st.row]: true }, sheet: null, toast: '“' + st.row + '” deleted' }),
      ''' + NEWJS + r'''
      q, typed: (e) => set({ q: e.target.value }),
      toastOn: !!st.toast, toastT: st.toast || '', undo: () => set({ gone: {}, toast: null }) };''')

BOOKT = BOOKI.replace('22', '20')
TILE = lambda bg, inner: f'<span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 11px; background: {bg}; display: flex; align-items: center; justify-content: center">{inner}</span>'
ROWMORE = lambda act, label: f'<button type="button" aria-label="More for {label}" onClick="{{{{{act}}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{MORE}</button>'
LTILE = (f'<span aria-hidden="true" style="flex: none; width: 40px; height: 40px; border-radius: 20px; display: flex; align-items: center; justify-content: center; '
         f'background: {{{{l.tileBg}}}}; box-shadow: {{{{l.tileRing}}}}; color: {{{{l.tileFg}}}}">'
         f'<sc-if value="{{{{l.learned}}}}" hint-placeholder-val="{{{{false}}}}">{CHECKI}</sc-if><sc-if value="{{{{l.todo}}}}" hint-placeholder-val="{{{{true}}}}">{BOOKT}</sc-if></span>')
def LROW(href, indent):
    return (f'<div style="min-height: 60px; display: flex; align-items: center; gap: 12px; padding: 6px 4px 6px {indent}px; box-shadow: inset 0 -1px 0 {FILL}">'
            f'<a href="{href}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none">{LTILE}'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{l.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{l.d}}}}</span></span></a>'
            f'{ROWMORE("l.more", "{{l.t}}")}</div>')
def LIST(lap):
    lh, ch = ('LessonLaptop.dc.html', 'CourseLaptop.dc.html') if lap else ('Lesson.dc.html', 'Course.dc.html')
    course = (f'<div style="display: flex; align-items: center; gap: 4px; min-height: 64px; padding: 6px 4px 6px 4px; box-shadow: inset 0 -1px 0 {FILL}">'
              f'<button type="button" aria-label="Show its lessons" aria-expanded="{{{{c.isOpen}}}}" onClick="{{{{c.toggle}}}}" style="flex: none; width: 36px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center"><span style="display: flex; transform: {{{{c.chev}}}}; transition: transform .2s cubic-bezier(.22,1,.36,1)">{CHEV_R}</span></button>'
              f'<a href="{ch}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none"><span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 11px; background: {{{{c.paint}}}}; display: flex; align-items: center; justify-content: center">{FOLDI}</span>'
              f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{c.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{c.d}}}}</span></span></a>{ROWMORE("c.more", "{{c.t}}")}</div>'
              f'<sc-if value="{{{{c.isOpen}}}}" hint-placeholder-val="{{{{true}}}}"><sc-for list="{{{{c.lessons}}}}" as="l" hint-placeholder-count="3">{LROW(lh, 52)}</sc-for></sc-if>')
    return (f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden; padding: 0 0 0 8px"><sc-for list="{{{{courses}}}}" as="c" hint-placeholder-count="2">{course}</sc-for>'
            f'<sc-for list="{{{{loose}}}}" as="l" hint-placeholder-count="2">{LROW(lh, 4)}</sc-for></div>')
SORTB = (f'<button type="button" onClick="{{{{openSort}}}}" style="flex: none; height: 44px; padding: 0 12px; border: 0; border-radius: 22px; background: transparent; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px">'
         f'{{{{sortL}}}}{CHEV_D}</button>')
SEARCHF = (f'<label style="flex: none; height: 44px; display: flex; align-items: center; gap: 8px; padding: 0 0 0 12px; border-radius: 12px; background: {FILL}; color: {SOFT}">{SEARCH}'
           f'<input aria-label="Search your lessons and courses" placeholder="Search your lessons and courses" value="{{{{q}}}}" onInput="{{{{typed}}}}" style="flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none">{SORTB}</label>')
FAB = lambda bottom: (f'<button type="button" aria-label="New lesson or course" onClick="{{{{openNew}}}}" style="position: absolute; right: 20px; bottom: {bottom}px; z-index: 30; width: 60px; height: 60px; border: 0; border-radius: 30px; background: {ACCENT}; color: {INK}; '
                      f'box-shadow: {SHADOW}; display: flex; align-items: center; justify-content: center">{PLUSI.replace("20", "26")}</button>')
SORTBODY = f'{SEGC("sorts", 44, 15)}'
ROWBODY = (GROUP(('link', 'Open', '', '#'), ('action', 'Duplicate', 'closeSheet'), bg=SHEET)
           + GROUP(('link', 'Settings', '', '#'), bg=SHEET) + GROUP(('action', 'Delete', 'removeRow', '#B3261E'), bg=SHEET))
YTOAST = (f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 16px; right: 16px; bottom: 112px; z-index: 50; min-height: 52px; border-radius: 14px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 8px; padding: 4px 4px 4px 16px; font-size: 15px">'
          f'<span style="flex: 1">{{{{toastT}}}}</span><button type="button" onClick="{{{{undo}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {ACCENT}; font: inherit; font-size: 15px; font-weight: 700">Undo</button></div></sc-if>')
TOOLROW = f'<div style="display: flex; align-items: center; gap: 8px">{CHIPS("kinds")}</div>'
yph = (f'{TITLEBAR("Your lessons and courses", "", "Learn.dc.html", "Back to Learn", wrap=True)}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 130px; display: flex; flex-direction: column; gap: 12px">'
       f'{SEARCHF}{TOOLROW.replace("margin: -5px -16px; padding: 0 16px", "margin: -5px 0; padding: 0")}{LIST(False)}</main>{FAB(40)}{YTOAST.replace("bottom: 112px", "bottom: 112px")}')
ylm = (f'{LTITLEBAR("Your lessons and courses", "", "LearnLaptop.dc.html")}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 56px 60px; display: flex; flex-direction: column; gap: 14px"><div style="max-width: 900px; display: flex; flex-direction: column; gap: 14px">'
       f'<div style="display: flex; gap: 12px; align-items: center"><div style="flex: 1">{SEARCHF}</div>{BTN(PLUSI + "New", "openNew", "", "primary", 44, False)}</div>{TOOLROW.replace("margin: -5px -16px; padding: 0 16px", "margin: -5px 0; padding: 0")}{LIST(True)}</div></main>'
       f'{YTOAST.replace("left: 16px; right: 16px; bottom: 112px", "right: 40px; bottom: 32px; width: 420px")}')
detail('LearnYours', 'Your lessons and courses', YOURS_JS, yph, ylm, '',
       BSHEET('newOn', 'New', NEWBODY, 'Cancel') + BSHEET('sortOn', 'Sort', SORTBODY) + BSHEET('rowOn', '{{rowT}}', ROWBODY),
       POPOVER('newOn', 'New', NEWBODY, 'right: 56px; top: 150px', 440) + POPOVER('sortOn', 'Sort', SORTBODY, 'right: 300px; top: 210px', 360) + POPOVER('rowOn', '{{rowT}}', ROWBODY, 'right: 300px; top: 280px', 320), 'Learn')

# ── Settings of the learner's own lesson and course: rows that say their value and open in place ──
OSET_JS = js(r'''
    const sheet = st.sheet ?? null, mode = st.mode ?? 'One page', ins = st.ins ?? { 'Sunday service set': true };
    const cs = ['Sunday service set', 'Jazz on the side'];
    return { ...common(st, set), closeSheet: () => set({ sheet: null }), readCards: ['One page', 'A section at a time'].map((r) => ({ r, on: r === mode, ring: r === mode ? '0 0 0 2.5px #332921' : '0 0 0 1px #DAD1C8', pick: () => set({ mode: r }) })),
      nameOn: sheet === 'name', openName: () => set({ sheet: 'name' }), insOn: sheet === 'ins', openIns: () => set({ sheet: 'ins' }),
      insL: cs.filter((c) => ins[c]).join(', ') || 'None', inCourses: cs.map((c) => ({ c, on: !!ins[c], mark: ins[c] ? '✓' : '', pick: () => set({ ins: { ...ins, [c]: !ins[c] } }) })),
      rename: () => set({ sheet: null, toast: 'Renamed' }), dup: () => set({ toast: 'Copy made' }), reset: () => set({ toast: 'Progress reset' }), del: () => set({ toast: 'Deleted' }),
      toastOn: !!st.toast, toastT: st.toast || '', undo: () => set({ toast: null }) };''')
READCARDS = (f'{CAPS("Read as")}<div role="radiogroup" aria-label="Read as" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px"><sc-for list="{{{{readCards}}}}" as="c" hint-placeholder-count="2">'
             f'<button type="button" role="radio" aria-checked="{{{{c.on}}}}" onClick="{{{{c.pick}}}}" style="border: 0; border-radius: 14px; background: {SHEET}; box-shadow: {{{{c.ring}}}}; padding: 12px; font: inherit; color: {INK}; display: flex; flex-direction: column; gap: 8px; align-items: stretch">'
             f'<span aria-hidden="true" style="height: 56px; border-radius: 8px; background: repeating-linear-gradient(180deg, {FILL} 0 6px, transparent 6px 12px)"></span><span style="font-size: 15px; font-weight: 600">{{{{c.r}}}}</span></button></sc-for></div>')
NAMEBODY = lambda v, label: (f'{CAPS("Name")}<input aria-label="Name" value="{v}" style="height: 48px; box-sizing: border-box; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font: inherit; font-size: 16px; color: {INK}">'
                             f'<div style="display: flex">{BTN(label, "rename", "", "primary", 50)}</div>')
INSBODY = GROUP(('raw', f'<sc-for list="{{{{inCourses}}}}" as="k" hint-placeholder-count="2"><button type="button" role="checkbox" aria-checked="{{{{k.on}}}}" onClick="{{{{k.pick}}}}" style="width: 100%; min-height: 52px; display: flex; align-items: center; gap: 12px; padding: 4px 16px; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 16px; text-align: left; box-shadow: inset 0 -1px 0 {LINE}"><span style="flex: 1">{{{{k.c}}}}</span><span style="font-weight: 700; color: #2F5A35">{{{{k.mark}}}}</span></button></sc-for>'), bg=SHEET)
def SETTINGS(lesson, lap):
    name = 'Warm-up before church' if lesson else 'Sunday service set'
    head = LTITLEBAR('Settings', '', ("LessonLaptop" if lesson else "CourseLaptop") + ".dc.html") if lap else (f'<header style="flex: none; min-height: 56px; display: flex; align-items: center; gap: 10px; padding: 0 16px{" 0 44px" if lap else ""}"><a href="{("LessonLaptop" if lap else "Lesson") if lesson else ("CourseLaptop" if lap else "Course")}.dc.html" aria-label="Back" style="flex: none; width: 44px; height: 44px; margin-left: -10px; display: flex; align-items: center; justify-content: center; color: {INK}; text-decoration: none">{CHEV_L}</a>'
            f'<h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.01em">Settings</h1></header>')
    if lesson:
        rows = (READCARDS + CAPS('The lesson') + GROUP(('link', 'Name', name, 'openName'), ('link', 'In courses', '{{insL}}', 'openIns'), ('action', 'Duplicate', 'dup'), bg=SHEET))
    else:
        rows = (CAPS('The course') + GROUP(('link', 'Name', name, 'openName'), ('action', 'Duplicate', 'dup'), bg=SHEET))
    body = (f'<span style="margin: -8px 4px 0; font-size: 15px; color: {SOFT}">{name}</span>{rows}'
            f'{CAPS("Progress")}{GROUP(("action", "Reset progress", "reset"), bg=SHEET)}<div style="height: 8px"></div>{GROUP(("action", "Delete lesson" if lesson else "Delete course", "del", "#B3261E"), bg=SHEET)}')
    pad = 'padding: 4px 56px 60px' if lap else 'padding: 4px 16px 40px'
    return (f'{head}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; {pad}; display: flex; flex-direction: column"><div style="{"max-width: 704px; " if lap else ""}display: flex; flex-direction: column; gap: 14px">{body}</div></main>'
            + (YTOAST.replace("left: 16px; right: 16px; bottom: 112px", "right: 40px; bottom: 32px; width: 420px") if lap else YTOAST.replace('bottom: 112px', 'bottom: 40px')))
for lesson in (True, False):
    stem, nm = ('YourLessonSettings', 'Warm-up before church') if lesson else ('YourCourseSettings', 'Sunday service set')
    sh = BSHEET('nameOn', 'Rename', NAMEBODY(nm, 'Rename')) + (BSHEET('insOn', 'In courses', INSBODY) if lesson else '')
    pp = sh.replace('<div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>'.replace('{LINE}', LINE), '').replace('position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0', 'position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 440px; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px')
    detail(stem, 'Settings · ' + nm, OSET_JS, SETTINGS(lesson, False), SETTINGS(lesson, True), '', sh, pp, 'Learn')
print('r57 yours ok')
for _f in ('LearnYours', 'LearnYoursLaptop'):
    open(OUT + _f + 'Night.dc.html', 'w').write(night(open(OUT + _f + '.dc.html').read()))
