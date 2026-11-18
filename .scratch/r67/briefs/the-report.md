# R67 agent A report: the kit, Learn, Profile, Settings

State: done = already in the app; built = built this round; theirs = in agent B's or C's files; canvas = a canvas or process rule with no app act.

| # | Area | Ruling | App file | State |
|---|---|---|---|---|
| 1 | Actions and menus | One menu shell on every board | shared/ui/primitives/dropdown-menu.tsx, ActionMenu, FloatingActions dial | built |
| 2 | Actions and menus | The account menu says only what is true | widgets/app-nav/ui/SidebarAccount.tsx | built |
| 3 | Actions and menus | One dialog shape and one popover shape on every board | shared/ui/primitives/{dialog,alert-dialog,popover}.tsx, theme.css radius-sheet/menu, layer-shadow | built |
| 4 | Actions and menus | Every form on a laptop is the centred dialog | shared/ui/MakeSheet.tsx, NewSheet | built (New sheets centred on a laptop) |
| 5 | Actions and menus | Every popup's captions held to their controls | shared/ui/FormField, Labelled, NameField (caps 8 over) | built |
| 6 | Actions and menus | The whole popup walk |  | left: not reached this round (time) |
| 7 | Actions and menus | Every icon-only control names itself on hover |  | left: not reached this round (time) |
| 8 | Actions and menus | One list row on every board |  | left: not reached this round (time) |
| 9 | Actions and menus | Legal's section headings at the group heading's 20 | pages/legal | left: not reached this round (time) |
| 10 | Actions and menus | The Settings dialog on a laptop wears the dialog's 22 | widgets/settings-screen | left: not reached this round (time) |
| 11 | Actions and menus | The laptop Player's views wear the Play · Edit switch's shape |  | theirs (B: the Player) |
| 12 | Actions and menus | Every sheet, dialog and the search palette is `aria-modal` | shared/ui/primitives/dialog (Base UI sets aria-modal on modal popups) | left: not verified in the browser |
| 13 | Actions and menus | On a laptop, Profile's place shows in the sidebar | widgets/app-nav/ui/SidebarAccount.tsx (aria-current on Profile) | built |
| 14 | Actions and menus | Signed out, the sidebar says so | widgets/app-nav/ui/SidebarAccount.tsx ("Sign in", "Not signed in") | built |
| 15 | Actions and menus | A song list on a phone is one list, not a card per song |  | theirs (B: Songs) |
| 16 | Actions and menus | A shared playlist is All songs' table on a laptop, and its songs' menu is a viewer's |  | theirs (B: Songs) |
| 17 | Actions and menus | An empty list has one shape, and a new learner's sidebar is empty too | shared/ui/Said.tsx (one EMPTY) | built; B drops LibraryEmpty's invite/card at the merge |
| 18 | Actions and menus | The kit's gallery shows the kit as it is |  | left: not reached this round (time) |
| 19 | Actions and menus | Your lessons on a phone: siblings on one edge, a course's lessons indented | widgets/curriculum/ui/OwnLibrary.tsx | built |
| 20 | Actions and menus | Continue shows the level's progress on a phone too | widgets/continue-action/ui/ContinueAction.tsx | built |
| 21 | Actions and menus | The laptop Profile's stats stand beside the name, on the right column | pages/profile | left: not reached this round (time) |
| 22 | Actions and menus | Every Search opens the search palette | widgets/app-nav/ui/SidebarSearch.tsx | done (already opens the palette) |
| 23 | Actions and menus | A course's Versions opens its versions, as a lesson's | pages/course | left: not reached this round (time) |
| 24 | Actions and menus | Continue opens its lesson; Archive and Trash lose a dead folder | widgets/continue-action | built (Continue opens its lesson); Archive/Trash theirs (B) |
| 25 | Actions and menus | A person in Explore has a page |  | theirs (B: Explore) |
| 26 | Actions and menus | A public song's chart is its own |  | theirs (B) |
| 27 | Actions and menus | Sign in's name is in its bar | pages/account* | left: not reached this round (time) |
| 28 | Actions and menus | Learn holds at 1024 | pages/learn, widgets/curriculum (grids minmax) | built |
| 29 | Actions and menus | Grids keep their count and wrap below a least width | widgets/curriculum grids (auto-fill minmax) | built on Learn, Courses, a level, a course |
| 30 | Actions and menus | The practice runs hold at 1024 |  | theirs (C: Practice) |
| 31 | Actions and menus | Explore's table holds at 1024 |  | theirs (B: Explore) |
| 32 | Actions and menus | The phone layout holds at 744, an iPad upright |  | left: 744 not shot this round |
| 33 | Actions and menus | The learner's own lessons and courses are "Made by you" | i18n learn own.title "Made by you" | built |
| 34 | Actions and menus | The phone's bar stays while the page scrolls | shared/ui/ScreenHeader.tsx, screen-bar.ts (no hiding) | built |
| 35 | Actions and menus | The Metronome's last row clears its floating Start on a laptop |  | theirs (C) |
| 36 | Actions and menus | Played through holds its column and its gaps |  | theirs (B) |
| 37 | Actions and menus | Sibling pages wear one title size | shared/ui/ScreenHeader.tsx | built on Learn's pages |
| 38 | Actions and menus | The Theory pages pin their keys, as Chords |  | theirs (C) |
| 39 | Actions and menus | On its side, the keys scroll with the page |  | theirs (B/C) |
| 40 | Actions and menus | The editor docks its palette from 48rem, a phone on its side too |  | theirs (B: editor) |
| 41 | Actions and menus | The Player's keys and transport hang from the foot |  | theirs (B: Player) |
| 42 | Actions and menus | A chord run on its side keeps its music, keys and Play |  | theirs (C) |
| 43 | Actions and menus | On its side, the tab bar is a compact capsule | widgets/app-nav/ui/AppNav.tsx, theme.css (landscape-phone 520, nav-bar tokens) | built |
| 44 | Actions and menus | The Chord finder names its chord in the serif, at its phone's size |  | theirs (C) |
| 45 | Actions and menus | The Profile's tiles wear one ink, the streak alone its flame | pages/profile | left: not reached this round (time) |
| 46 | Actions and menus | A list ends on its last row | shared/ui rows-hairline | left: Profile's last row not checked |
| 47 | Actions and menus | A course's songs stand on its lessons' grid | widgets/curriculum/ui/GuidedSongs.tsx | built |
| 48 | Actions and menus | A lesson's steps stand on its column | widgets/lesson-view/ui/LessonBlock.tsx (steps) | built |
| 49 | Actions and menus | A section's own name stands on the paper | widgets/lesson-view/ui/SectionParts.tsx | built (heading on the paper, 22) |
| 50 | Navigation and bars | A laptop place's bar ends on its column | shared/ui/ScreenHeader.tsx | built |
| 51 | Navigation and bars | A lesson's example and its Tools work | pages/lesson/ui/LessonLayout.tsx | built (no Tools in a lesson) |
| 52 | Navigation and bars | Practice's bar drops Tools; a tool's line says its state |  | theirs (C) |
| 53 | Navigation and bars | Replaced 2026-11-18 by craft-details' "Bars stay, quietly" |  | canvas |
| 54 | Navigation and bars | The app's layers lie over the real Learn |  | canvas |
| 55 | Process | A publish refused as "changed since you last saw it" is checked, never believed |  | canvas (process) |
| 56 | Process | Targets side by side stand 8 apart or join |  | left: not reached this round (time) |
| 57 | Process | A text button is 50, or 44 in a row | shared/ui/primitives/button.tsx (lg 50, sm 44) | built; `pill` kept for B/C files, fold into lg at the merge |
| 58 | Process | Every field names its keyboard | shared/ui/FormField, SearchField (inputMode, enterKeyHint) | built |
| 59 | Process | Patched helpers folded into the kit |  | canvas |
| 60 | Process | Design in four phases |  | canvas (process) |
| 61 | Process | Spacing by ratio, researched with numbers |  | canvas (process) |
| 62 | Process | One section gap, whatever the head holds | pages/learn (gap-8 between sections) | built |
| 63 | Process | Songs' sections 32 apart, as Learn's and Profile's |  | theirs (B) |
| 64 | Process | A lesson's example is named on its keys | features/play-example | left: the examples' cards and keys are shared with C's Practice pages |
| 65 | Process | The Uxcel lessons as exact rules |  | canvas (process) |
| 66 | Process | The song page's laptop sections 20 apart |  | theirs (B) |
| 67 | Process | The landing-page screenshots' pairs, as checks |  | canvas (process) |
| 68 | Process | Which component for which job, as checks |  | canvas (process) |
| 69 | Process | Profile's streak names its reward | pages/profile | left: not reached this round (time) |
| 70 | Process | Predictions and suggestions, as checks |  | canvas (process) |
| 71 | Process | Cognitive biases, as checks |  | canvas (process) |
| 72 | Process | More component rules |  | canvas (process) |
| 73 | Process | Import reads before it shows |  | theirs (B: import) |
| 74 | Process | Canvas v541 |  | canvas |
| 75 | Process | Canvas |  | canvas |
| 76 | Process | Rules |  | canvas |
| 77 | Process | Canvas |  | canvas |
| 78 | Process | Rules |  | canvas |
| 79 | Process | Canvas v543 |  | canvas |
| 80 | Process | Canvas |  | canvas |
| 81 | Process | Canvas |  | canvas |
| 82 | Learn and the editors | Lessons, courses and levels, and Learn's structure | widgets/curriculum/ui/CourseCovers.tsx (progress eyebrow) | built |
| 83 | Learn and the editors | Course cards on a laptop carry no chevron | widgets/curriculum/ui/CourseCard.tsx | built |
| 84 | Learn and the editors | Continue reads as one row on a laptop | widgets/continue-action/ui/ContinueAction.tsx | built |
| 85 | Learn and the editors | The lesson's icon is Lucide's book | shared/ui LessonIcon = Lucide Book | built; User guide's circle-help left (Settings) |
| 86 | Learn and the editors | A lesson's In short under its example | widgets/lesson-view/ui/SectionParts.tsx (Takeaway) | built |
| 87 | Learn and the editors | Learn and a level on one laptop screen, no rows cut in two | widgets/curriculum (LevelRows, LevelLessons) | built |
| 88 | Learn and the editors | A take's labels as every field's |  | theirs (B: takes) |
| 89 | Learn and the editors | Your lessons and courses get Select | widgets/curriculum/ui/OwnLibrary.tsx | built |
| 90 | Learn and the editors | The Next lesson is ringed in honey, not filled | widgets/curriculum/ui/NextMark.tsx | built |
| 91 | Learn and the editors | A level and a course share one edge and one lesson timeline | widgets/curriculum/ui/LessonRow.tsx (LessonStop, LessonLine) | built |
| 92 | Learn and the editors | A course's facts are a line, not chips | widgets/curriculum/ui/CourseOverview.tsx | built |
| 93 | Learn and the editors | Your lesson's and course's Settings in one column on a laptop | pages/lesson/ui/OwnLessonSettings, pages/course/ui/OwnCourseSettings | left: not reached this round (time) |
| 94 | Learn and the editors | Courses on a laptop: shelves one under another, their courses in rows of three | widgets/curriculum/ui/CourseShelves.tsx | built |
| 95 | Learn and the editors | Your own lesson's and course's Settings group by space | pages/lesson, pages/course settings | left: not reached this round (time) |
| 96 | Learn and the editors | Learn's two columns meet | pages/learn/ui/LearnPage.tsx | built |
| 97 | Learn and the editors | A course's head on one top | widgets/curriculum/ui/CourseOverview.tsx | built |
| 98 | Learn and the editors | A lesson on the page's gutter, nothing kept for what is not shown | widgets/lesson-view/ui/LessonView.tsx | built (reading); the editor's grip not checked |
| 99 | Learn and the editors | A lesson's keys are the Player's | features/play-example | left: shared with C's pages |
| 100 | Learn and the editors | Every Insert kind is drawn | widgets/lesson-document | left: not reached this round (time) |
| 101 | Learn and the editors | A course's name under its cover | pages/course/ui/CoursePage.tsx (CourseTitle) | built |
| 102 | Learn and the editors | Learned leaves the bar; Next lesson in reach | pages/lesson/ui/LessonLayout.tsx, widgets/lesson-view LessonBar | built |
| 103 | Learn and the editors | No "Lessons read as" | entities/settings, pages/lesson settings | built (tests that name it wait for the owner's run) |
| 104 | Learn and the editors | Publish is one tap | shared/ui/ScreenHeader EditAction.publish | left: the lesson and course editors' Publish not wired; Publish pages kept |
| 105 | Learn and the editors | Edit's bar is Done and Publish | shared/ui/ScreenHeader (EditWord) | built in the kit; the lesson editor's bar not rewired |
| 106 | Learn and the editors | No language control on a lesson | widgets/lesson-document | left: not reached this round (time) |
| 107 | Learn and the editors | Edit becomes Done in its place, on every Learn page | shared/ui/ScreenHeader (Edit becomes Done in place) | built |
| 108 | Learn and the editors | A lesson's place is where it sits | pages/lesson settings | left: not reached this round (time) |
| 109 | Learn and the editors | No side column that runs out on a laptop | widgets/lesson-view/ui/LessonView.tsx, CourseOverview | built |
| 110 | Learn and the editors | What the lines missed, now flagged |  | canvas (lines tool) |
| 111 | Learn and the editors | A lesson's keyboard runs the width | features/play-example | left: shared with C's pages |
| 112 | Learn and the editors | Legal is one document a page | pages/legal | left: not reached this round (time) |
| 113 | Learn and the editors | Chords back to its own design; the old canvas gone |  | canvas |
| 114 | Learn and the editors | Learn and Your lessons get the floating + | pages/learn/ui/LearnPage.tsx, OwnLibrary (NewDial) | built |
| 115 | Learn and the editors | Your lessons on a laptop is the libraries' table | widgets/curriculum/ui/OwnLibrary.tsx | built |
| 116 | Learn and the editors | A lesson reads in one centred column on a laptop | widgets/lesson-view/ui/LessonView.tsx | built |
| 117 | Learn and the editors | A lesson's steps are a numbered list set as a writing app sets one | widgets/lesson-view/ui/LessonBlock.tsx | built |
| 118 | Profile and Settings | Sign in's laptop bar carries its name | pages/account* | left: not reached this round (time) |
| 119 | Profile and Settings | Profile on a laptop without rows cut in two | pages/profile | left: not reached this round (time) |
| 120 | Profile and Settings | Profile's week under its own heading on the phone | pages/profile | left: not reached this round (time) |
| 121 | Profile and Settings | Administration's Back on the items' edge | widgets/settings-screen | left: not reached this round (time) |
| 122 | Profile and Settings | Settings' footers and free-text fields on the rows' inset | shared/ui/FormField, SettingsGroup (16 inset) | built in the kit; Settings footers not checked |
| 123 | Profile and Settings | Sign in's fields wear the app's one field shape | pages/account* | left: the kit's field is the board's; Sign in not shot |
| 124 | Profile and Settings | The Admin overview says each fact once | pages/admin | left: not reached this round (time) |
| 125 | Profile and Settings | Every field wears one label | shared/ui/FormField (caps 16 in) | built |
| 126 | Profile and Settings | Profile's two columns share their edges | pages/profile | left: not reached this round (time) |
| 127 | Profile and Settings | Administration's pane is a Settings pane | pages/admin | left: not reached this round (time) |
| 128 | Profile and Settings | Check for updates on the Settings rows' edge | widgets/settings-screen | left: not reached this round (time) |
| 129 | Profile and Settings | Sign in, Legal and the app's layers through the lines | pages/account*, pages/legal | left: not reached this round (time) |
| 130 | Profile and Settings | A run's result names its run in the bar | pages/profile | left: not reached this round (time) |
| 131 | Profile and Settings | Settings placed where Apple places them | widgets/settings-screen | left: not reached this round (time) |
| 132 | Profile and Settings | Administration opens inside the Settings dialog | widgets/settings-screen | left: not reached this round (time) |
| 133 | Profile and Settings | Swipe actions show each act's icon | widgets/settings-screen | left: not reached this round (time) |
| 134 | Profile and Settings | The selection toolbar's settings show each act's icon | widgets/settings-screen | left: not reached this round (time) |
| 135 | Profile and Settings | Settings on a laptop is a dialog, as claude.ai's | widgets/settings-screen | left: not reached this round (time) |
| 136 | Profile and Settings | Profile on a laptop in rows that meet | pages/profile | left: not reached this round (time) |
| 137 | Profile and Settings | Settings on a laptop as Claude's | widgets/settings-screen | left: not reached this round (time) |
| 138 | Profile and Settings | Every Settings page in one structure | widgets/settings-screen | left: not reached this round (time) |
| 139 | Profile and Settings | General by use, Language one control | widgets/settings-screen | left: not reached this round (time) |
| 140 | Profile and Settings | Search's Recent searches belongs to its chips | widgets/search-palette/ui/SearchPalette.tsx | built |
| 141 | Profile and Settings | Settings on a laptop carries only its own panes | widgets/settings-screen | left: not reached this round (time) |
| 142 | Profile and Settings | The week's chart fills its box on a laptop | pages/profile | left: not reached this round (time) |
