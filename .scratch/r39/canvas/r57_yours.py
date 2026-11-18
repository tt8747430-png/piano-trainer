import re
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
    const q = st.q ?? '', bare = !!st.bare, ql = q.trim().toLowerCase(), hit = (t) => !ql || t.toLowerCase().includes(ql);
    const rowOf = (t, d, k, inCourse) => ({ t, d: 'Lesson · ' + d, kind: 'Lesson', len: d, prog: k === 'learned' ? 'Learned' : '—', learned: k === 'learned', todo: k !== 'learned', inCourse, tileBg: k === 'learned' ? '#DCE9D6' : '#FEFDFB', tileRing: k === 'learned' ? 'none' : 'inset 0 0 0 1px #DAD1C8', tileFg: k === 'learned' ? '#2F5A35' : '#332921',
      more: (e) => set({ sheet: 'row', row: t, rowC: false, menuPos: ANCHOR(e, 230) }), remove: () => set({ gone: { ...gone, [t]: true }, sheet: null, toast: t + ' deleted' }) });
    const courses = (kind === 'Lessons' || bare ? [] : Y.courses).filter((c) => !gone[c.t] && (hit(c.t) || c.lessons.some(([t]) => hit(t)))).map((c) => {
      const ls = c.lessons.filter(([t]) => !gone[t] && (hit(c.t) || hit(t))).map(([t, d, k]) => rowOf(t, d, k, true));
      const isOpen = !!open[c.t] && kind !== 'Courses';
      return { t: c.t, paint: c.paint, d: 'Course · ' + ls.length + ' lessons' + (ls.some((l) => l.learned) ? ' · 1 learned' : ''), kind: 'Course', len: ls.length + ' lessons', prog: ls.filter((l) => l.learned).length + ' of ' + ls.length + ' learned', lessons: ls, isOpen, shut: !isOpen,
        toggle: () => set({ open: { ...open, [c.t]: !open[c.t] } }), more: (e) => set({ sheet: 'row', row: c.t, rowC: true, menuPos: ANCHOR(e, 230) }), chev: isOpen ? 'rotate(90deg)' : 'none' };
    });
    const loose = (kind === 'Courses' || bare ? [] : Y.loose).filter(([t]) => !gone[t] && hit(t)).map(([t, d, k]) => rowOf(t, d, k, false));
    const any = courses.length + loose.length > 0;
    // Select (owner, 2026-11-17: every list of the learner's things has Select): a checkbox leads each row, the bar's
    // title counts what is picked, the floating bar acts on it, or on all when nothing is picked
    const all = courses.flatMap((c) => [c.t, ...c.lessons.map((l) => l.t)]).concat(loose.map((l) => l.t));
    const selOn = !!st.sel && any, picked = (st.picked ?? []).filter((t) => all.includes(t)), n = picked.length;
    const ck = (t) => { const on = picked.includes(t); return { ckBg: on ? '#332921' : 'transparent', ckLine: on ? '#332921' : '#B5A99B', ckMark: on ? 1 : 0, on2: on ? 'true' : 'false',
      tap: () => set({ picked: on ? picked.filter((x) => x !== t) : [...picked, t] }) }; };
    courses.forEach((c) => { Object.assign(c, ck(c.t)); c.lessons.forEach((l) => Object.assign(l, ck(l.t))); });
    loose.forEach((l) => Object.assign(l, ck(l.t)));
    const dropMany = (ts) => set({ gone: { ...gone, ...Object.fromEntries(ts.map((t) => [t, true])) }, sel: false, picked: [], sheet: null, toast: ts.length === 1 ? ts[0] + ' deleted' : named(ts) + ' deleted' });
    const named = (ts) => { const nc = ts.filter((t) => Y.courses.some((c) => c.t === t)).length, nl = ts.length - nc, w = (k, one, many) => k + ' ' + (k === 1 ? one : many);
      return [nl ? w(nl, 'lesson', 'lessons') : '', nc ? w(nc, 'course', 'courses') : ''].filter(Boolean).join(' and '); };
    const states = [['Nothing made yet', bare, { bare: true, q: '' }, { bare: false }], ['Search finds nothing', !bare && ql === 'chopin', { q: 'Chopin', bare: false }, { q: '' }],
      ['Select, two picked', selOn && n === 2, { sel: true, picked: ['Warm-up before church', 'Pedalling in slow hymns'], toast: null }, { sel: false, picked: [] }],
      ['A lesson deleted, with Undo', !!st.toast, { gone: { 'Notes from my teacher': true }, toast: 'Notes from my teacher deleted' }, { gone: {}, toast: null }]]
      .map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => set(on ? off : o) }));
    const sheetOpen = (n) => () => set({ sheet: n });
    return { ...common(st, set), closeSheet: () => set({ sheet: null }),
      kinds: chipsOf(['All', 'Lessons', 'Courses'], kind, (x) => set({ kind: x })), sortL: sort, sortOn: sheet === 'sort', openSort: sheetOpen('sort'),
      sorts: seg(['Recent', 'Name'], sort, (x) => set({ sort: x, sheet: null })),
      selOn, selOff: !selOn, canSel: !selOn && any, toggleSel: () => set({ sel: !selOn, picked: [], sheet: null }),
      pageT: selOn ? (n ? n + ' selected' : 'Select') : 'Made by you', headPad: selOn ? '164px' : '108px',
      selDup: () => set({ sel: false, picked: [], toast: (n || all.length) === 1 ? 'Copy made' : named(n ? picked : all) + ' copied' }), selDel: () => dropMany(n ? picked : all),
      selDupL: n ? 'Duplicate' : 'Duplicate all', selDelL: n ? 'Delete' : 'Delete all',
      courses, loose, hasLoose: loose.length > 0, looseHead: kind === 'All', states, listOn: any, bareOn: bare || (!any && !ql), notBare: !(bare || (!any && !ql)), noneOn: !bare && !any && !!ql,
      noneT: 'No results for “' + q.trim() + '”', clearQ: () => set({ q: '' }),
      rowOn: sheet === 'row', menuPos: st.menuPos ?? 'right: 16px; top: 120px', rowT: st.row || '', rowCourse: !!st.rowC, rowLesson: !st.rowC, rowOpen: st.rowC ? 'Course.dc.html' : 'Lesson.dc.html', rowSet: st.rowC ? 'YourCourseSettings.dc.html' : 'YourLessonSettings.dc.html', rowOpenL: st.rowC ? 'CourseLaptop.dc.html' : 'LessonLaptop.dc.html', rowSetL: st.rowC ? 'YourCourseSettingsLaptop.dc.html' : 'YourLessonSettingsLaptop.dc.html', rowIsLesson: !Y.courses.some((c) => c.t === st.row),
      removeRow: () => set({ gone: { ...gone, [st.row]: true }, sheet: null, toast: st.row + ' deleted' }),
      ''' + NEWJS + r'''
      q, typed: (e) => set({ q: e.target.value }),
      toastOn: !!st.toast, toastT: st.toast || '', undo: () => set({ gone: {}, toast: null }) };''')

BOOKT = BOOKI.replace('22', '20')
DUPSEL = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>'
# Select's parts, as Takes' (r59): the checkbox leading a row, a hit over the whole row, the row's ··· gone meanwhile
YCHECK = lambda v: (f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="flex: none; width: 24px; height: 24px; margin: 0 10px; box-sizing: border-box; border-radius: 12px; border: 2px solid {{{{{v}.ckLine}}}}; background: {{{{{v}.ckBg}}}}; color: {SHEET}; display: flex; align-items: center; justify-content: center"><span style="display: flex; opacity: {{{{{v}.ckMark}}}}">{TICK.replace("18", "14")}</span></span></sc-if>')
YHIT = lambda v: f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" role="checkbox" aria-checked="{{{{{v}.on2}}}}" aria-label="{{{{{v}.t}}}}" onClick="{{{{{v}.tap}}}}" style="position: absolute; inset: 0; z-index: 1; border: 0; background: transparent"></button></sc-if>'
OFFSEL = lambda x: f'<sc-if value="{{{{selOff}}}}" hint-placeholder-val="{{{{true}}}}">{x}</sc-if>'
TILE = lambda bg, inner: f'<span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 11px; background: {bg}; display: flex; align-items: center; justify-content: center">{inner}</span>'
ROWMORE = lambda act, label: f'<button type="button" aria-label="More for {label}" onClick="{{{{{act}}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{MORE}</button>'
LTILE = (f'<span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 22px; display: flex; align-items: center; justify-content: center; '
         f'background: {{{{l.tileBg}}}}; box-shadow: {{{{l.tileRing}}}}; color: {{{{l.tileFg}}}}">'
         f'<sc-if value="{{{{l.learned}}}}" hint-placeholder-val="{{{{false}}}}">{CHECKI}</sc-if><sc-if value="{{{{l.todo}}}}" hint-placeholder-val="{{{{true}}}}">{BOOKT}</sc-if></span>')
def LROW(href, indent):
    # one column of checkboxes down the list (Mail, Files): a course's lesson keeps its indent after the box
    sp = f'<span aria-hidden="true" style="flex: none; width: {indent - 16}px"></span>' if indent > 4 else ''
    return (f'<div style="position: relative; min-height: 60px; display: flex; align-items: center; gap: 12px; padding: 6px 4px 6px 4px; box-shadow: inset 0 -1px 0 {FILL}">{YHIT("l")}{YCHECK("l")}{sp}'
            f'<a href="{href}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none">{LTILE}'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{l.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{l.d}}}}</span></span></a>'
            f'{OFFSEL(ROWMORE("l.more", "{{l.t}}"))}</div>')
def LIST(lap):
    lh, ch = ('LessonLaptop.dc.html', 'CourseLaptop.dc.html') if lap else ('Lesson.dc.html', 'Course.dc.html')
    course = (f'<div style="position: relative; display: flex; align-items: center; gap: 0; min-height: 60px; padding: 6px 4px 6px 0; box-shadow: inset 0 -1px 0 {FILL}">{YHIT("c")}{YCHECK("c").replace("margin: 0 10px", "margin: 0 18px 0 10px")}'
              f'<button type="button" aria-label="Show its lessons" aria-expanded="{{{{c.isOpen}}}}" onClick="{{{{c.toggle}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center"><span style="display: flex; transform: {{{{c.chev}}}}; transition: transform .2s cubic-bezier(.22,1,.36,1)">{CHEV_R}</span></button>'
              f'<a href="{ch}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none"><span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 11px; background: {{{{c.paint}}}}; display: flex; align-items: center; justify-content: center">{FOLDI}</span>'
              f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{c.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{c.d}}}}</span></span></a>{OFFSEL(ROWMORE("c.more", "{{c.t}}"))}</div>'
              f'<sc-if value="{{{{c.isOpen}}}}" hint-placeholder-val="{{{{true}}}}"><sc-for list="{{{{c.lessons}}}}" as="l" hint-placeholder-count="3">{LROW(lh, 60)}</sc-for></sc-if>')
    return (f'<sc-if value="{{{{listOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden; padding: 0 0 0 8px"><sc-for list="{{{{courses}}}}" as="c" hint-placeholder-count="2">{course}</sc-for>'
            f'<sc-for list="{{{{loose}}}}" as="l" hint-placeholder-count="2">{LROW(lh, 44)}</sc-for></div></sc-if>'
            + LEMPTY('noneOn', SEARCH.replace('width="18" height="18"', 'width="26" height="26"'), '{{noneT}}', 'Check the spelling, or search for a word from a lesson’s name.', BTN('Clear search', 'clearQ', kind='quiet', h=48, grow=False))
            + LEMPTY('bareOn', BOOKI.replace('22', '26'), 'No lessons or courses yet', 'Write a lesson in your own words with +, then gather lessons into a course.', f'<a href="LearnCourses.dc.html" style="min-height: 44px; display: inline-flex; align-items: center; padding: 0 8px; color: {LINK}; font-size: 16px; font-weight: 600; text-decoration: none">Browse the courses</a>'))
# The laptop draws the list as the libraries' table (Songs, Accompaniment; owner, 2026-11-15: "the empty space should be
# properly used"): a heading row, then rows on the page, the description line split into Length and Progress (the kind is the tile and the chips)
_COLS = lambda v: (f'<span style="flex: 1; min-width: 0; font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{{v}.len}}}}</span>'
                   f'<span style="flex: 1.2; min-width: 0; font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{{v}.prog}}}}</span>')
def TROW_L(href, indent):
    sp = f'<span aria-hidden="true" style="flex: none; width: {indent}px"></span>' if indent else ''
    return (f'<div style="position: relative; min-height: 60px; display: flex; align-items: center; gap: 16px; padding: 6px 0; box-shadow: inset 0 -1px 0 {FILL}">'
            f'<div style="flex: 2.4; min-width: 0; display: flex; align-items: center; gap: 12px">{YHIT("l")}{YCHECK("l")}{sp}'
            f'<a href="{href}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none">{LTILE}<span style="font-size: 16px; font-weight: 600">{{{{l.t}}}}</span></a></div>'
            f'{_COLS("l")}<span style="flex: none; width: 44px">{OFFSEL(ROWMORE("l.more", "{{l.t}}"))}</span></div>')
def TABLE_L():
    lh, ch = 'LessonLaptop.dc.html', 'CourseLaptop.dc.html'
    head = (f'<div style="display: flex; gap: 16px; padding: 0 0 8px; box-shadow: inset 0 -1px 0 {LINE}">'
            + ''.join(f'<span style="flex: {f}; min-width: 0; font-size: 13px; font-weight: 600; color: {SOFT}"><span style="padding-left: {pl}">{t}</span></span>' for t, f, pl in (('Name', 2.4, '{{headPad}}'), ('Length', 1, '0'), ('Progress', 1.2, '0')))
            + '<span style="flex: none; width: 44px"></span></div>')
    course = (f'<div style="position: relative; min-height: 64px; display: flex; align-items: center; gap: 16px; padding: 6px 0; box-shadow: inset 0 -1px 0 {FILL}">'
              f'<div style="flex: 2.4; min-width: 0; display: flex; align-items: center; gap: 4px">{YHIT("c")}{YCHECK("c").replace("margin: 0 10px", "margin: 0 18px 0 10px")}'
              f'<button type="button" aria-label="Show its lessons" aria-expanded="{{{{c.isOpen}}}}" onClick="{{{{c.toggle}}}}" style="flex: none; width: 44px; height: 44px; border: 0; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center"><span style="display: flex; transform: {{{{c.chev}}}}; transition: transform .2s cubic-bezier(.22,1,.36,1)">{CHEV_R}</span></button>'
              f'<a href="{ch}" style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; margin-left: 4px; color: {INK}; text-decoration: none"><span aria-hidden="true" style="flex: none; width: 44px; height: 44px; border-radius: 11px; background: {{{{c.paint}}}}; display: flex; align-items: center; justify-content: center">{FOLDI}</span>'
              f'<span style="font-size: 16px; font-weight: 600">{{{{c.t}}}}</span></a></div>{_COLS("c")}<span style="flex: none; width: 44px">{OFFSEL(ROWMORE("c.more", "{{c.t}}"))}</span></div>'
              f'<sc-if value="{{{{c.isOpen}}}}" hint-placeholder-val="{{{{true}}}}"><sc-for list="{{{{c.lessons}}}}" as="l" hint-placeholder-count="3">{TROW_L(lh, 56)}</sc-for></sc-if>')
    rest = LIST(True)[LIST(True).index('</div></sc-if>') + len('</div></sc-if>'):]
    return (f'<sc-if value="{{{{listOn}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column">{head}<sc-for list="{{{{courses}}}}" as="c" hint-placeholder-count="2">{course}</sc-for>'
            f'<sc-for list="{{{{loose}}}}" as="l" hint-placeholder-count="2">{TROW_L(lh, 40)}</sc-for></div></sc-if>' + rest)
SORTB = (f'<button type="button" onClick="{{{{openSort}}}}" style="flex: none; height: 44px; padding: 0 12px; border: 0; border-radius: 22px; background: transparent; color: {INK}; font: inherit; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 4px">'
         f'{{{{sortL}}}}{CHEV_D}</button>')
SEARCHF = (f'<label style="flex: none; height: 44px; display: flex; align-items: center; gap: 8px; padding: 0 0 0 12px; border-radius: 12px; background: {FILL}; color: {SOFT}">{SEARCH}'
           f'<input {KB["search"]} aria-label="Search your lessons and courses" placeholder="Search lessons and courses" value="{{{{q}}}}" onInput="{{{{typed}}}}" style="flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 16px; color: {INK}; outline: none">{SORTB}</label>')
# canvas 167: the + is New's dial, as Songs' (the app's SpeedDial): it turns to a close, the page dims, and New lesson
# and New course come up over it named in words, the nearest the thumb first; one chosen opens its own short sheet
# canvas 169: the + is the kit's one New dial (NEWDIAL), as Songs' and the Practice libraries'
FAB = lambda bottom: OFFSEL(NEWDIAL([('New course', 'newCourse'), ('New lesson', 'newLesson')], bottom))
YSEL = f'<sc-if value="{{{{canSel}}}}" hint-placeholder-val="{{{{true}}}}">{TB("Select", "toggleSel")}</sc-if><sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{TB("Cancel", "toggleSel")}</sc-if>'
_YSELIN = SELACT('{{selDupL}}', 'selDup', DUPSEL) + SELACT('{{selDelL}}', 'selDel', ACTIC['Delete'], RED)
YSELBAR = f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">{DOCK(_YSELIN, 34)}</sc-if>'
YSELBAR_L = f'<sc-if value="{{{{selOn}}}}" hint-placeholder-val="{{{{false}}}}">' + DOCK(_YSELIN, 28, w=440) + '</sc-if>'  # centred on the table, which keeps 56 at each side of the pane
SORTBODY = f'{SEGC("sorts", 44, 15)}'
# a row's ··· is a menu at its button (owner, 2026-11-17), never a sheet with Done
ROWBODY = (ROWMENU('rowOn', '{{rowT}}', [('link', 'Open', '', '{{rowOpen}}'), ('action', 'Duplicate', 'closeSheet'), ('link', 'Settings', '', '{{rowSet}}'), ('action', 'Delete', 'removeRow', RED)]))
YTOAST = (f'<sc-if value="{{{{toastOn}}}}" hint-placeholder-val="{{{{false}}}}"><div role="status" style="position: absolute; left: 16px; right: 16px; bottom: 112px; z-index: 50; min-height: 52px; border-radius: 14px; background: {INK}; color: {SHEET}; display: flex; align-items: center; gap: 8px; padding: 4px 4px 4px 16px; font-size: 15px">'
          f'<span style="flex: 1">{{{{toastT}}}}</span><button type="button" onClick="{{{{undo}}}}" style="height: 44px; padding: 0 12px; border: 0; background: transparent; color: {ACCENT}; font: inherit; font-size: 15px; font-weight: 700">Undo</button></div></sc-if>')
TOOLROW = f'<div style="display: flex; align-items: center; gap: 8px">{CHIPS("kinds")}</div>'
yph = (f'{TITLEBAR("{{pageT}}", YSEL, "Learn.dc.html", "Back to Learn")}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 4px 16px 130px; display: flex; flex-direction: column; gap: 12px">'
       f'{SHOWSTATES()}<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}">{SEARCHF}{TOOLROW.replace("margin: -4px -16px; padding: 0 16px", "margin: -4px 0; padding: 0")}</sc-if>{LIST(False)}</main>{FAB(40)}{YSELBAR}{YTOAST}')
ylm = (f'{LTITLEBAR("{{pageT}}", f"<sc-if value=\"{{{{notBare}}}}\" hint-placeholder-val=\"{{{{true}}}}\"><div style=\"width: 420px\">{SEARCHF}</div></sc-if>" + YSEL, "LearnLaptop.dc.html")}' + LCOL(f'{SHOWSTATES()}<sc-if value="{{{{notBare}}}}" hint-placeholder-val="{{{{true}}}}">{TOOLROW.replace("margin: -4px -16px; padding: 0 16px", "margin: -4px 0; padding: 0")}</sc-if>{TABLE_L()}', 2000) + YSELBAR_L + FAB(32) + f'{YTOAST.replace("left: 16px; right: 16px; bottom: 112px", "left: 50%; transform: translateX(-50%); width: 460px; bottom: 28px")}')
detail('LearnYours', 'Made by you', YOURS_JS, yph, ylm, '',
       BSHEET('newOn', '{{newT}}', NEWBODY, 'Cancel') + BSHEET('sortOn', 'Sort', SORTBODY) + ROWBODY,
       POPOVER('pickOn', 'New', NEWMENU([('New lesson', 'newLesson'), ('New course', 'newCourse')]), 'right: 28px; top: 76px', 300) + LAPSHEET(BSHEET('newOn', '{{newT}}', NEWBODY, 'Cancel'), 440) + POPOVER('sortOn', 'Sort', SORTBODY, 'right: 149px; top: 76px', 360) + ROWBODY.replace('{{rowOpen}}', '{{rowOpenL}}').replace('{{rowSet}}', '{{rowSetL}}'), 'Learn')

# ── Settings of the learner's own lesson and course: rows that say their value and open in place ──
OSET_JS = js(r'''
    const sheet = st.sheet ?? null, mode = st.mode ?? 'One page', ins = st.ins ?? { 'Sunday service set': true };
    const cs = ['Sunday service set', 'Jazz on the side'];
    return { ...common(st, set), closeSheet: () => set({ sheet: null }), cover: st.cover ?? 'Sage', coverBg: { Sage: '#DCE9D6', Sky: '#D3E5F2', Honey: '#F6E7C8', Lilac: '#E4DCF1', Peach: '#F3D2C8' }[st.cover ?? 'Sage'], covers: ['Sage', 'Sky', 'Honey', 'Lilac', 'Peach'].map((c, i) => ({ c, bg: ['#DCE9D6', '#D3E5F2', '#F6E7C8', '#E4DCF1', '#F3D2C8'][i], on: c === (st.cover ?? 'Sage'), ring: c === (st.cover ?? 'Sage') ? '0 0 0 2.5px #332921' : 'inset 0 0 0 1px rgba(51,41,33,.08)', pick: () => set({ cover: c }) })), nameOn: sheet === 'name', openName: () => set({ sheet: 'name' }), insOn: sheet === 'ins', openIns: () => set({ sheet: 'ins' }),
      insL: cs.filter((c) => ins[c]).join(', ') || 'None', inCourses: cs.map((c) => ({ c, on: !!ins[c], mark: ins[c] ? '✓' : '', pick: () => set({ ins: { ...ins, [c]: !ins[c] } }) })),
      rename: () => set({ sheet: null, toast: 'Renamed' }), dup: () => set({ toast: 'Copy made' }), reset: () => set({ toast: 'Progress reset' }), del: () => set({ toast: isLesson ? 'Lesson deleted' : 'Course deleted' }),
      toastOn: !!st.toast, toastT: st.toast || '', undo: () => set({ toast: null }),
      states: [['Rename, open', sheet === 'name', { sheet: 'name' }, { sheet: null }]]
        .concat(isLesson ? [['In courses, open', sheet === 'ins', { sheet: 'ins' }, { sheet: null }]] : [])
        .concat([['Deleted, with Undo', /deleted$/.test(st.toast || ''), { toast: isLesson ? 'Lesson deleted' : 'Course deleted' }, { toast: null }], ['Progress reset, with Undo', st.toast === 'Progress reset', { toast: 'Progress reset' }, { toast: null }]])
        .map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => set(on ? off : o) })) };''')
NAMEBODY = lambda v, label: (f'<div style="display: flex; flex-direction: column; gap: 8px">{CAPS("Name")}<input {KB["title"]} aria-label="Name" value="{v}" style="height: 48px; box-sizing: border-box; border: 0; border-radius: 12px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 0 12px; font: inherit; font-size: 16px; color: {INK}"></div>'
                             f'<div style="display: flex">{BTN(label, "rename", "", "primary", 50)}</div>')
INSBODY = GROUP(('raw', f'<sc-for list="{{{{inCourses}}}}" as="k" hint-placeholder-count="2"><button type="button" role="checkbox" aria-checked="{{{{k.on}}}}" onClick="{{{{k.pick}}}}" style="width: 100%; min-height: 52px; display: flex; align-items: center; gap: 12px; padding: 4px 16px; border: 0; background: transparent; color: {INK}; font: inherit; font-size: 16px; text-align: left; box-shadow: inset 0 -1px 0 {LINE}"><span style="flex: 1">{{{{k.c}}}}</span><span style="font-weight: 700; color: #2F5A35">{{{{k.mark}}}}</span></button></sc-for>'), bg=SHEET)
def SETTINGS(lesson, lap):
    name = 'Warm-up before church' if lesson else 'Sunday service set'
    head = LTITLEBAR('Settings', '', ("LessonLaptop" if lesson else "CourseLaptop") + ".dc.html") if lap else TOP(("Lesson" if lesson else "Course") + ".dc.html", 'Settings')
    if lesson:
        rows = (SEC(CAPS('The lesson'), GROUP(('link', 'Name', name, 'openName'), ('link', 'In courses', '{{insL}}', 'openIns'), ('action', 'Duplicate', 'dup'), bg=SHEET)))
    else:
        rows = SEC(CAPS('The course'), GROUP(('link', 'Name', name, 'openName'), ('action', 'Duplicate', 'dup'), bg=SHEET))
    # the head names what these settings are for, as a song's Settings does (HEADCARD): its picture, its name, its kind;
    # a lesson wears Learn's lesson picture, a course its cover (picked below, as on the New course sheet)
    pic = (f'<span aria-hidden="true" style="flex: none; width: 64px; height: 64px; border-radius: 32px; background: {SHEET}; box-shadow: inset 0 0 0 1px {LINE}; color: {INK}; display: flex; align-items: center; justify-content: center">{BOOKI}</span>' if lesson else
           f'<span aria-hidden="true" style="flex: none; width: 64px; height: 64px; border-radius: 14px; background: {{{{coverBg}}}}; box-shadow: inset 0 0 0 1px rgba(51,41,33,.08); color: {INK}; display: flex; align-items: center; justify-content: center">{FOLDI.replace('width="20" height="20"', 'width="26" height="26"')}</span>')
    sub = (f'<div style="display: flex; gap: 16px; align-items: center; padding: 4px 0">{pic}<div style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><span style="font-size: 20px; font-weight: 700">{name}</span>'
           f'<span style="font-size: 14px; color: {SOFT}">{"Your lesson · 2 sections" if lesson else "Your course · 4 lessons"}</span></div></div>')
    if not lesson:
        rows += SEC(f'<div style="display: flex; flex-direction: column; gap: 8px">{CAPS("Cover")}<div role="radiogroup" aria-label="Cover" style="display: flex; gap: 12px"><sc-for list="{{{{covers}}}}" as="v" hint-placeholder-count="5">'
                 f'<button type="button" role="radio" aria-label="{{{{v.c}}}}" aria-checked="{{{{v.on}}}}" onClick="{{{{v.pick}}}}" style="width: 52px; height: 52px; border: 0; border-radius: 13px; background: {{{{v.bg}}}}; box-shadow: {{{{v.ring}}}}; color: {INK}; display: flex; align-items: center; justify-content: center">{FOLDI}</button></sc-for></div></div>')
    rest = SEC(CAPS("Your progress"), GROUP(("action", "Reset progress", "reset"), bg=SHEET)) + '<div style="margin-top: 16px">' + GROUP(("action", "Delete lesson" if lesson else "Delete course", "del", "#B3261E"), bg=SHEET) + '</div>'
    # one column on both sizes, in the phone's order: what it is, then its progress, the loss last and apart (loop round 63:
    # in two columns Delete stood at the laptop's top right, the first thing seen)
    body = sub + rows + rest
    pad = 'padding: 4px 56px 60px' if lap else 'padding: 4px 16px 40px'
    return (f'{head}<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; {pad}; display: flex; flex-direction: column"><div style="{"max-width: 704px; " if lap else ""}display: flex; flex-direction: column; gap: 24px">{body}</div></main>'
            + (YTOAST.replace("left: 16px; right: 16px; bottom: 112px", "left: 50%; transform: translateX(-50%); width: 460px; bottom: 28px") if lap else YTOAST.replace('bottom: 112px', 'bottom: 40px')))
for lesson in (True, False):
    stem, nm = ('YourLessonSettings', 'Warm-up before church') if lesson else ('YourCourseSettings', 'Sunday service set')
    sh = BSHEET('nameOn', 'Rename', NAMEBODY(nm, 'Rename')) + (BSHEET('insOn', 'In courses', INSBODY) if lesson else '')
    pp = sh.replace('<div style="align-self: center; width: 36px; height: 5px; border-radius: 3px; background: {LINE}"></div>'.replace('{LINE}', LINE), '').replace('position: absolute; left: 0; right: 0; bottom: 0; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px 22px 0 0', 'position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 440px; z-index: 61; max-height: 86%; overflow-y: auto; border-radius: 22px; box-shadow: 0 0 0 1px #DAD1C8, 0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)').replace('padding: 6px 16px 40px', 'padding: 20px')
    detail(stem, 'Settings · ' + nm, OSET_JS.replace('const cs =', 'const isLesson = %s, cs =' % ('true' if lesson else 'false'), 1), SHOWSTATES() + SETTINGS(lesson, False), SHOWSTATES() + SETTINGS(lesson, True), '', sh, pp, 'Learn')
print('r57 yours ok')
