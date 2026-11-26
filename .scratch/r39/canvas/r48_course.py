import re
# R48: a course (pages/course, the course editor): its page for a learner, the same page in an editor's Edit mode
# (title and summary in place, Properties: Shelf, Level, Length; Lessons dragged, removed, "Or add one back", Add
# lesson), its Settings page and Publish. Labels from learn.ts (course, own, edit.course, settings). Exec'd by r41.py.
CRS = {'t': 'Intro to Music Reading', 's': 'Learn to read notes, starting at the keyboard. You meet pitch and the octave, then the staff, the treble and bass clefs, ledger lines, and sharps, flats and naturals.',
       'lessons': [['Pitch and the piano', 'learned'], ['The staff', 'learned'], ['The treble clef', 'learned'], ['Notes above the treble staff', 'next'], ['The bass clef', ''], ['Notes below the bass staff', ''], ['Accidentals', 'unpub']],
       'songs': [['Yankee Doodle', 'Traditional · C major'], ['Oh! Susanna', 'Stephen Foster · C major']]}
CRPICS = {t: INCIPIT(INC.get(t, (2, 4))) for t, _ in CRS['songs']}
COURSE_JS = js('const CR = ' + json.dumps(CRS, ensure_ascii=False) + ', CRPICS = ' + json.dumps(CRPICS) + ';\n' + r'''
    const editing = !!st.editing, sheet = st.sheet ?? null, gone = st.gone ?? {}, weeks = st.weeks ?? 4, shelf = st.shelf ?? 'Beginner', level = st.level ?? 'Beginner';
    const lessons = CR.lessons.filter(([t]) => !gone[t]).map(([t, k], i) => ({ t, n: '', learned: k === 'learned', next: k === 'next', unpub: k === 'unpub', todo: k !== 'learned' && k !== 'next',
      num: String(i + 1), tileBg: k === 'learned' ? '#DCE9D6' : '#FEFDFB', ring: k === 'next' ? '0 0 0 2.5px #EDC684' : (k === 'learned' ? 'none' : '0 0 0 1px #DAD1C8'),
      remove: (e) => { e && e.preventDefault && e.preventDefault(); set({ gone: { ...gone, [t]: true }, toast: t + ' removed from the course' }); } }));
    const removed = CR.lessons.filter(([t]) => gone[t]).map(([t]) => ({ t, back: () => { const g = { ...gone }; delete g[t]; set({ gone: g }); } }));
    const lost = CR.lessons[1][0], states = [['Edited by an editor', editing, { editing: true }, { editing: false }],
      ['A lesson removed, with Undo', !!gone[lost], { editing: true, gone: { [lost]: true }, toast: lost + ' removed from the course' }, { gone: {}, toast: null }]]
      .map(([l, on, o, off]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => set(on ? off : o) }));
    return { ...common(st, set), states, editing, reading: !editing, edit: () => set({ editing: true }), done: () => set({ editing: false, sheet: null }), status: 'Saved · not published',
      t: CR.t, s: CR.s, lessons, songs: CR.songs.map(([t, d]) => ({ t, d, pic: CRPICS[t] })), removed, hasRemoved: removed.length > 0,
      shelves: chipsOf(['Beginner', 'Intermediate', 'Technique and exercises', 'Chords and improvisation', 'Method books'], shelf, (x) => set({ shelf: x })),
      levels: chipsOf(['Beginner', 'Intermediate', 'Advanced', 'Professional'], level, (x) => set({ level: x })), shelfV: shelf, levelV: level,
      weeksL: weeks + ' weeks', fewer: () => set({ weeks: Math.max(1, weeks - 1) }), more: () => set({ weeks: Math.min(52, weeks + 1) }),
      newOn: sheet === 'new', openNew: () => set({ sheet: 'new' }), create: () => set({ sheet: null, toast: 'New lesson added' }),
      verOn: sheet === 'versions', openVer: () => set({ sheet: 'versions' }), restore: () => set({ sheet: null, toast: 'Version restored' }), propOn: sheet === 'props', openProps: () => set({ sheet: 'props' }),
      page: st.page ?? null, onPage: !!st.page, isSet: st.page === 'settings', isPub: st.page === 'publish', openSettings: () => set({ page: 'settings', sheet: null }), openPub: () => set({ page: 'publish', sheet: null }), closePage: () => set({ page: null }),
      pageT: st.page === 'settings' ? 'Settings' : 'Publish', resetOn: sheet === 'reset', askReset: () => set({ sheet: 'reset' }), doReset: () => set({ sheet: null, toast: 'Progress reset' }), delOn: sheet === 'delete', askDel: () => set({ sheet: 'delete' }),
      publish: () => set({ page: null, toast: 'Published. Learners will receive it the next time they open the app.' }),
      standing: (st.pub ?? 'changed') === 'published' ? 'Published 8 November' : 'Changes not published', isChanged: (st.pub ?? 'changed') !== 'published', verN: '3', discard: () => set({ pub: 'published', toast: 'Changes discarded' }),
      pubL: (st.pub ?? 'changed') === 'published' ? 'Published' : 'Publish', publishNow: () => (st.pub ?? 'changed') !== 'published' && set({ pub: 'published', sheet: null, toast: 'Published. Learners receive it the next time they open the app.' }), undoPub: () => set({ pub: 'changed', toast: null }), pubUndoOn: /^Published/.test(st.toast || ''), pmPos: st.pmPos ?? 'right: 16px; top: 112px', toastOn: !!st.toast, toastUndo: /deleted|removed|reset|^Published/i.test(st.toast || ''), copyLink: () => set({ toast: 'Link copied' }), toastT: st.toast || '', undo: () => set({ gone: {}, toast: null }), undoRemove: () => set(/^Published/.test(st.toast || '') ? { pub: 'changed', toast: null } : { gone: {}, toast: null }) };''')
COVER = (f'<div aria-hidden="true" style="flex: none; height: 132px; margin-bottom: 8px; border-radius: 14px; background: {SAGE}; position: relative; overflow: hidden">'
         f'<svg viewBox="0 0 400 132" preserveAspectRatio="xMidYMid slice" width="100%" height="100%"><g stroke="#9DBA92" stroke-width="1.6">' + ''.join(f'<line x1="0" x2="400" y1="{44 + i * 11}" y2="{44 + i * 11}"></line>' for i in range(5)) + '</g>'
         + ''.join(f'<ellipse cx="{70 + i * 46}" cy="{88 - (i % 4) * 5.5}" rx="7.5" ry="5.6" fill="#3F6B45" transform="rotate(-20 {70 + i * 46} {88 - (i % 4) * 5.5})"></ellipse><line x1="{77 + i * 46}" x2="{77 + i * 46}" y1="{86 - (i % 4) * 5.5}" y2="{52 - (i % 4) * 5.5}" stroke="#3F6B45" stroke-width="1.6"></line>' for i in range(7)) + '</svg></div>')
# the course's facts are a line, not chips: a chip is a value you change in place (scan-first 4; loop round 63)
FACTS = f'<p style="margin: 0; font-size: 14px; color: {SOFT}">Beginner · 2 songs · 7 weeks</p>'
GRIPS = '<span role="button" aria-label="Move: {{l.t}}" style="flex: none; width: 44px; height: 44px; color: #685E56; display: flex; align-items: center; justify-content: center; cursor: grab">' + GRIP + '</span>'
# canvas 164: a course's lessons are the line a level's are (one spine through the tiles, no card round them)
LROWS = (f'<div style="position: relative; margin-top: -12px"><span aria-hidden="true" style="position: absolute; left: 21px; top: 32px; bottom: 32px; width: 2px; background: #B9CDB3"></span><sc-for list="{{{{lessons}}}}" as="l" hint-placeholder-count="8"><a href="Lesson.dc.html" style="position: relative; min-height: 68px; display: flex; align-items: center; gap: 16px; padding: 0 8px 0 0; border-radius: 12px; color: {INK}; text-decoration: none">'
         f'<span style="flex: none; width: 44px; height: 44px; border-radius: 22px; background: {{{{l.tileBg}}}}; box-shadow: {{{{l.ring}}}}; color: #44684A; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center"><sc-if value="{{{{l.learned}}}}" hint-placeholder-val="{{{{false}}}}">{CHECKI}</sc-if><sc-if value="{{{{l.todo}}}}" hint-placeholder-val="{{{{true}}}}"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 4px; background: {LINE}"></span></sc-if><sc-if value="{{{{l.next}}}}" hint-placeholder-val="{{{{false}}}}"><span style="color: {INK}; display: flex">{ICON(BOOKI, 20)}</span></sc-if></span>'
         f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{l.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{l.n}}}}<sc-if value="{{{{l.unpub}}}}" hint-placeholder-val="{{{{false}}}}"><sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><span style="color: #A8551F; font-weight: 600">Not published yet</span></sc-if></sc-if></span></span>'
         f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}"><sc-if value="{{{{l.next}}}}" hint-placeholder-val="{{{{false}}}}"><span style="flex: none; height: 26px; padding: 0 12px; border-radius: 13px; background: transparent; box-shadow: inset 0 0 0 1.5px {ACCENT}; color: #7A5418; font-size: 13px; font-weight: 700; display: flex; align-items: center">Next</span></sc-if></sc-if>'
         f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}"><span style="color: {SOFT}; display: flex; padding-right: 4px">{CHEV_R}</span></sc-if>'
         f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><button type="button" aria-label="Remove {{{{l.t}}}}" data-tip="Remove" onClick="{{{{l.remove}}}}" style="flex: none; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; display: flex; align-items: center; justify-content: center"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#B3261E"></circle><path d="M7 12h10" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"></path></svg></button>{GRIPS}</sc-if></a></sc-for></div>'
         f'<sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}"><sc-if value="{{{{hasRemoved}}}}" hint-placeholder-val="{{{{false}}}}"><div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Or add one back</span><sc-for list="{{{{removed}}}}" as="r" hint-placeholder-count="1"><button type="button" onClick="{{{{r.back}}}}" style="height: 36px; padding: 0 12px; border: 0; border-radius: 18px; background: {FILL}; color: {INK}; font: inherit; font-size: 14px; font-weight: 600">+ {{{{r.t}}}}</button></sc-for></div></sc-if>'
         + ADDROW('Add lesson', 'openNew', node=44, pad='0 0 0 10px') + '</sc-if>')
SONGROWS = (f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{songs}}}}" as="g" hint-placeholder-count="3"><a href="Song.dc.html" style="min-height: 76px; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 8px 12px; box-shadow: inset 0 -1px 0 {FILL}; color: {INK}; text-decoration: none">'
            f'<span aria-hidden="true" style="flex: none; width: 40px; height: 40px; border-radius: 8px; background: {{{{g.pic}}}} center / cover; box-shadow: inset 0 0 0 1px rgba(51,41,33,.1)"></span><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{g.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{g.d}}}}</span></span><span style="color: {SOFT}; display: flex">{CHEV_R}</span></a></sc-for></div>')
def CBODY(lap):
    h1 = f'<h1 contenteditable="{{{{editing}}}}" style="margin: 0; font-family: {SERIF}; font-size: {36 if lap else 30}px; font-weight: 600; line-height: 1.15; letter-spacing: -0.01em; outline: none; text-wrap: balance">{{{{t}}}}</h1>'
    # the course's name is the page's heading, under its cover, on a phone and a laptop alike, in both modes (a lesson's
    # shape): Edit moves nothing
    head = (f'<div style="display: flex; flex-direction: column; gap: 8px">' + h1 +
            f'<p contenteditable="{{{{editing}}}}" style="margin: 0; font-size: 16px; line-height: 1.5; color: {SOFT}; outline: none">{{{{s}}}}</p>'
            f'{FACTS}</div>')
    go = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}"><div style="display: flex; flex-direction: column; gap: 8px"><div style="display: flex; justify-content: space-between; font-size: 14px; color: {SOFT}"><span>3 of 7 learned</span></div>{METER.replace("{{meter}}", "43%")}'
          f'<div style="display: flex; margin-top: 4px">{BTN("Continue: Notes above the treble staff", "", "Lesson.dc.html", "primary", 52)}</div></div></sc-if>')
    # loop round 59: no About: what the course teaches is said once, in the summary under its name, as a level's goal
    if lap:  # owner, 2026-11-17: "these empty spaces on the left under the sections should not be … the same for the
        # courses and lessons": the course's head is a band across the top (cover, then its name, goal, progress and
        # Continue), its lessons flow in two balanced columns under it and its songs in a row of three; no side
        # column that runs out (lines.mjs: a bare band under a column)
        lrows = (LROWS.replace('<span aria-hidden="true" style="position: absolute; left: 21px; top: 32px; bottom: 32px; width: 2px; background: #B9CDB3"></span>', '', 1)
                 .replace('<div style="position: relative; margin-top: -12px">', '<div style="margin-top: -12px; display: grid; grid-template-columns: repeat(auto-fill, minmax(max(304px, calc((100% - 72px) / 4)), 1fr)); column-gap: 24px">', 1)
                 .replace('<a href="Lesson.dc.html" style="position: relative;', '<a href="Lesson.dc.html" style="break-inside: avoid; position: relative;', 1)
                 # a row ends where its words end (owner, 2026-11-17, the rows marked: "why don't you flag such
                 # things"): the title takes its own width, Next stands beside it, and the far chevron goes; the whole
                 # row is the link, its hover the sign
                 .replace('<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{l.t}}</span>', '<span style="flex: 0 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{l.t}}</span>', 1)
                 .replace(f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}"><span style="color: {SOFT}; display: flex; padding-right: 4px">{CHEV_R}</span></sc-if>', '', 1))
        # loop round 67: the songs stand bare on the lessons' grid, as the lessons do (one kind of list, one shape;
        # a box round a homogeneous list is common region overused, NN/g)
        songs = (SONGROWS.replace(f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">', '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(max(304px, calc((100% - 72px) / 4)), 1fr)); column-gap: 24px">', 1)
                 .replace(f'padding: 8px 12px; box-shadow: inset 0 -1px 0 {FILL};', 'padding: 8px 0;', 1)
                 .replace('width: 40px; height: 40px; border-radius: 8px;', 'width: 44px; height: 44px; border-radius: 8px;', 1))
        songs = re.sub(r'<span style="color: [^"]*; display: flex[^"]*">' + re.escape(CHEV_R) + '</span>', '', songs)
        return (f'<div style="display: grid; grid-template-columns: 360px minmax(0, 640px); gap: 40px; align-items: stretch">{COVER.replace("height: 132px;", "min-height: 132px; height: 100%;", 1)}<div style="display: flex; flex-direction: column; gap: 16px">{head}{go}</div></div>'
                f'{H2("Lessons")}{lrows}{H2("Guided songs")}{songs}')
    return COVER + head + go + H2('Lessons') + LROWS + H2('Guided songs') + SONGROWS
CBAR_R = IB('Settings', GEARI, 'openSettings') + TB('Edit', 'edit')
CEDIT_R = IB('Settings', GEARI, 'openSettings') + EDITR()  # Edit becomes Done in its place
COURSEPIC = f'<span aria-hidden="true" style="flex: none; width: 64px; height: 64px; border-radius: 14px; background: {SAGE}; box-shadow: inset 0 0 0 1px rgba(51,41,33,.08); color: {INK}; display: flex; align-items: center; justify-content: center">{FOLDI.replace('width="20" height="20"', 'width="26" height="26"')}</span>'
CSET = THINGSET(THINGHEAD(COURSEPIC, 'Intro to Music Reading', 'Course · 7 lessons · Beginner'),
                THINGSEC(CAPS('The course'), GROUP(('link', 'Shelf', 'Beginner', 'LearnCoursesLaptop.dc.html'), bg=SHEET)), 'course')
CNEW = (f'{NAMEFIELD('Lesson name')}'
        f'<div style="display: flex">{BTN("Create", "create", "", "primary", 50)}</div>')
# its Settings a window over the course (THINGWIN), never a page of its own (owner, 2026-11-20)
CPAGE = lambda lap: THINGWIN(lap, 'onPage', 'closePage', '{{pageT}}', '<sc-if value="{{isSet}}" hint-placeholder-val="{{true}}">' + (CSET) + '</sc-if>', shown='false')
CASKS = (ASK('delOn', 'Delete Intro to Music Reading?', 'Learners lose it the next time the app starts, with its unpublished changes and every saved version.', 'Delete course', 'closeSheet'))
cph = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{TOP("LearnCourses.dc.html", "", CBAR_R, "Back to Courses")}</sc-if><sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{TOP("LearnCourses.dc.html", "", CEDIT_R, "Back to Courses")}</sc-if>'
       f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 60px; display: flex; flex-direction: column; gap: 16px">{CBODY(False)}</main>{TOAST(40, 'undoRemove')}{CPAGE(False)}{CASKS}')
csh = BSHEET('newOn', 'New lesson', CNEW, 'Cancel') + BSHEET('verOn', 'Versions of Intro to Music Reading', VERBODY)
clm = (f'<sc-if value="{{{{reading}}}}" hint-placeholder-val="{{{{true}}}}">{LTOP("LearnCoursesLaptop.dc.html", CBAR_R)}</sc-if><sc-if value="{{{{editing}}}}" hint-placeholder-val="{{{{false}}}}">{LTOP("LearnCoursesLaptop.dc.html", CEDIT_R)}</sc-if>'
       f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 56px 60px; display: flex; flex-direction: column; gap: 16px">{CBODY(True)}</main>'
       f'{TOAST(28, 'undoRemove', laptop=True)}{CPAGE(True)}{CASKS}')
cpops = LAPSHEET(BSHEET('newOn', 'New lesson', CNEW, 'Cancel'), 440) + POPOVER('verOn', 'Versions of Intro to Music Reading', VERBODY, 'right: 140px; top: 244px', 440)
detail('Course', 'Intro to Music Reading', COURSE_JS, SHOWSTATES() + cph, SHOWSTATES() + clm, '', csh, cpops, 'Learn')
print('r48 course ok')
