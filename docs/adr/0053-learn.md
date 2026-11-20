# ADR 0053 — Learn: the Lessons and the Courses, apart; a lesson is a worksheet

- **Status:** accepted · **Date:** 2026-09-29 · rewritten 2026-11-13

## Context

Learn drew its curriculum several ways in turn: a Path of four levels mixing lessons, chords, scales and songs;
lessons by module and subject; one curriculum of stages and courses. Each time the method books' material leaked into
the subject lessons (a theory lesson playing a Called to Play study, a lesson leading into another book's). The owner
asked for two things kept apart: lessons laid out as journeys, and courses on shelves with pages of their own, as the
reference courses app has them; then (2026-11-13) for Learn to be one overview with a page per level and one for all
the courses, its title in the bar.

## Decision

- **Learn** (`/`, the Learn boards) is an overview under its title in the bar, its sections 32 apart, each heading
  20 bold 12 over its content: **Continue**, one card naming its lesson, its level's progress (a track on the
  learned paint) and the ink Open button (on a laptop the track between the words and the button); the four
  **Levels**, one card of rows on a phone (each its number in a ring of how much is learned), four cards across on a
  laptop with no chevron; **Courses**, the covers with their progress in the eyebrow ("3 of 8 lessons", "Done") and
  See all; and **Made by you**, the learner's own, hidden while there are none. The honey floating + opens New
  lesson and New course (`NewDial`, `NewOwnSheet`), on Learn and on Made by you; Continue's button is ink, so the +
  is the one honey act. Continue follows the track last learned on: after a course's lesson or song, that course's
  next step; otherwise the journeys' next.
- **A level's page** (`/levels/$levelId`, Back to Learn): its name the page's serif heading on a phone (the laptop's
  bar names it), its goal, its count over its meter and its one way in (Start, Continue or Review and the lesson
  it opens, the honey 50), then its chapters 32 apart; its lessons on one timeline (a dot until reached, the book
  ringed in honey where Continue leads, a check once learned; the spine grass where passed), on a laptop three
  across with no spine. No side column.
  **The Courses' page** (`/courses`, Back to Learn): the shelves, each its name 14 semibold over its courses; a
  course is its row (the course's one glyph, Lucide's library, on its shelf's paint, a check once complete, its
  line, Next where Continue leads); on a laptop each course a card in a grid of three, the shelves stacked 40 apart.
  The Courses' About is the ⓘ beside the title. An editor's Edit is a glass word in the bar that becomes Done in its
  place.
- **The Lessons** (`entities/lesson`): four journeys, one to a level (Foundations, Fluency, Musicianship, Mastery),
  each on its page. A journey is chapters of lessons, then the chord families or
  scales its chapter's Check asks. A level's steps, like a course's lessons, are a **lesson line**
  (`LessonLine`): one spine through their tiles and no card round them; a tile is its number, a check's square, a
  learned one grass with a check, the next one its book ringed in honey with Next. A lesson's number is said once:
  on its tile, or under its title where the tile shows the book or a check; "After 4, 5" only where it asks for more
  than the lesson before it. It shows the order and locks
  nothing. A journey's lesson plays no piece,
  shows no pattern, names no method book and links only Lessons and Practice.
- **The Courses** (`entities/course`): self-contained, on five shelves (beginner, intermediate, technique, chords and
  improvising, method books). A course has a level, its weeks, its own lessons and its guided songs. A course's lesson
  links no other lesson, plays only its course's songs and shows only its own book's patterns (Called to Play 2 also
  level 1's). A piece is a guided song of one course at most, and its level is that course's stage, which Songs
  filters by. A course's page is its card (what it is, its facts, its meter) and About, then its lessons and guided
  songs; on a wide laptop (from 80rem) the card and About stand on the left, held in view, the lessons and songs on
  the right. The learner's own course has the same two columns.
- **Steps and learned marks** (`entities/step`): `lesson:<id>`, `course:<course>/<lesson>`, `piece:<id>`,
  `chords:<family>`, `scale:<kind>`. A mark on one track never counts for another. A whole piece's Learned is the
  learner's own; lessons never set it (ADR 0111).
- **The learner's own lessons and courses** (R30-5, `entities/own-lessons`, `pt-own-lessons`, version 1,
  synced as `own_lessons`): Learn's last group, **Your lessons and courses**, shows the newest four, the
  courses on their covers (a Songs folder's picture and paint) and the lessons as a level's are (learned,
  read so far); See all opens their page, `/your-lessons` (Made by you, `OwnLibrary`), the app's library shape:
  Select in the bar (Cancel while on, the title "n selected", a checkbox leading every row, the floating glass bar
  with Duplicate and Delete, all when nothing is picked, Delete with Undo); search with its sort (Recent, Name), All ·
  Lessons · Courses, each course a row that folds open to its own lessons under its tile, the lessons in no course on
  the course tiles' edge, every row's More (Open, Duplicate, Settings, Delete with Undo); on a laptop the search in
  the bar and the list the libraries' table (Name · Length · Progress). The floating + opens New lesson and New
  course. Each opens its own sheet (`NewOwnSheet`,
  New lesson or New course): the name, then the course a lesson goes in or a course's cover, and Create
  opens what was made in its editor. New course's **Start from** chips (Empty course, then the courses in
  `entities/own-lessons/content`, today the owner's two weeks in F major) fill the name and cover from the one
  chosen; Create copies its lessons whole into Your lessons under new ids and makes the course of them, all of
  it or nothing (`createOwnCourseFrom`). Those lessons are held to every rule the app's lessons are
  (`app/content/worksheets.test.ts`). They go up to their page, and it to Learn. An own lesson is
  the app's lesson document under `own-lesson-n`, read at `/lessons/own-lesson-n` as any lesson, its
  progress the same step (`lesson:<id>`), never part of a level's journey or of Continue; it is written
  once in the learner's language and reads the same in the other (`inBothLanguages`). An own course
  (`own-course-n`) is a title, a line, a cover and lessons in order: the learner's own, and the levels'
  added by reference, which stay the app's, their progress their own wherever they are read; a lesson
  read in it (`/lessons/$lessonId?course=own-course-n`) has the course over it and its lessons either
  side. The editors are the app's `LessonEditor` and `CourseEditor` on a local source (`LessonSource`,
  `CourseSource` `own`: no draft, no Publish, kept as the editor rests, Done keeping what waits; an
  example of notes is written as text, the score's Edit music being the app's lessons'). Their Settings:
  Name (its value, opening Rename), a lesson's In courses (the courses it is in, a
  checklist to put it in or take it out at once), Duplicate (the copy opened); Reset progress; and Delete last, what goes named
  under it (a lesson leaves every own course, its progress with it; a course's lessons stay). Reset and
  Delete happen at once, the toast's Undo putting back the progress, or the lesson in its place in Your
  lessons and in each course (R38); every lesson's and course's Reset progress works the same way. No Share link:
  sharing them is drawn later. Search finds them.
- **A lesson is a worksheet**: prose, steps and notes, and examples that play in place: chords
  as the lesson writes them (on a staff, each bar's band printing its chord's name, a lone chord's too), one quality on twelve roots, a scale, an interval, a line of notes on its staff,
  voicings written hand by hand, a progression's row, and a pattern heard over its piece's first line (a pattern is
  only ever heard on chords). A scale, an interval, a quality on twelve roots and voicings each show on their own
  keys under them (`ExampleKeys`: a tenth and more on a phone, 96 tall; three octaves on a laptop, 150 tall; the dark
  frame, 20 corners), a scale named key by key in the Scales page's colours, its tonic its own; the rest show on their
  staff or row and sound. A question stands open on its own keys: its ask, "Choose on the keys", the keys, then
  "n of 7 notes" or Correct with Again and Show the answer; a chord's notes count in any octave, and the section
  being read takes the MIDI keyboard's keys. Links name what they
  open (a chord, a scale, a key, a tool, a trainer, the Player), never a route. No card round an example or a
  question (the board's blocks, loop 63): each stands on the paper, its name 17 bold on a 44 row with its acts (ⓘ,
  Play) at its end, its music under it. No keyboard is shared by the page and none is pinned: the computer's letters
  play none of a lesson's keys.
- **A lesson's page** is a document, as its editor shows it: where it stands (its level or course, "Lesson 3 of 11"),
  its title in the serif (30, 36 on a laptop), what it teaches and After:, then its sections 32 apart, each its
  heading 22 bold, its words 17 on 1.55 at most 65ch, its steps a numbered list (indented 8, the muted numbers
  right-aligned in a 28 column, 6 apart), its examples and its In short under them on the honey wash. It reads in
  one column 760 wide at most, centred on a laptop (Obsidian's readable line), always as one page. The bar holds
  Back, Share link and the gear, with Edit where it may be edited; no Learned and no Tools. The foot's glass bar
  (on a laptop centred on the column) holds "Section n of N" with the section's name, opening the
  contents and what it is part of, and the honey Next lesson, which goes on and marks the lesson learned, Undo in
  its toast. No Previous and Next at the end: After: is the way back.
- **A lesson's and a course's Settings** (`/lessons/$lessonId/settings`, `/courses/$courseId/settings`,
  `/courses/$courseId/$lessonId/settings`; `pages/lesson`, `pages/course`) open from a gear in its bar, as a song's
  do, and are the same kind of page: one list of grouped rows from the settings kit. A learner's lesson: Share link (the share sheet, else copied), and apart its progress reset after asking (`resetSteps`: not
  learned, no section read; nothing else; Undo in its toast). A course: Share link and its lessons' and guided songs' progress reset.
  An editor's also say where it stands (a level and chapter, leading to Manage lessons; or its course), choose the
  lessons to read first (here only, not in the document: the document holds what the lesson shows), name the
  languages it is written in full, and hold its changes with Publish, Versions and Discard; a course's shelf leads
  to Manage courses. What a course is (its title, summary, level, length) is written on the course itself, in Edit.
  The lesson's ⋯ is gone: it held only the reading choice, a setting, not a command.
- **What a lesson shows of harmony:** a progression's row has a chip per chord, its numeral over its function
  (tonic, subdominant, dominant: T S D, the Riemann letters every lesson and the Russian theory use), or over its
  root's move (`show: 'motion'`, with the legend and Play the chain); the chip sounding follows the row, a tap plays
  it. **Variants** draw one example in versions (an A/B switch, or chips) and redraw it, its chips and its caption in
  place. A section may end on its **takeaway**, a note may be a **rule**, and a voicing in four voices names **S A T
  B** beside its first chord and on the keys, the key a voice left faint as the row plays on.
- **Progress through a lesson:** the sections read are saved (`pt-progress` `read`, as a page is shown or scrolled to
  the reading line) and fill a ring round the lesson in the journey map and a course's list. A lesson may name the
  lessons to read before it (`after`, earlier lessons of its own journey or course): its contents say them by number
  ("After 4, 5"), its page links them by title.
- **How a lesson reads** (`docs/CONTENT.md`, held by the content test): one idea a paragraph, the point first, a term
  defined where it is first used, the example directly under the sentence that names it, no prose repeating what the
  example shows. Mayer's multimedia principles (segmenting, contiguity, redundancy) and Nielsen Norman's findings on
  how people scan were its sources.
- **What the journeys and courses teach** grows with the reference pages each round, theory checked: r14 added slash
  chords (Fluency), modulation (Musicianship), rootless voicings and locked hands (Mastery), the perfect and
  imperfect authentic, Phrygian half and cadential 6/4 cadences, the 6/9, add9 and sus facts, and the **How to
  Practise** course (technique shelf: a daily plan, a scale routine with its tempo ladder, five days to speed,
  mistakes to avoid). Facts are taken from the pages, never their wording.
- `src/app/content/` tests every lesson of both kinds: the kernel reads it, the prose rules, and the rules above that
  keep the two apart.

## Consequences

A method book is taught by its own course (ADR 0047), never by a journey. Moving a lesson is one line in its journey or
course.
