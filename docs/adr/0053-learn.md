# ADR 0053 — Learn: the Lessons and the Courses, apart; a lesson is a worksheet

- **Status:** accepted · **Date:** 2026-09-29 · consolidated 2026-10-27

## Context

Learn drew its curriculum several ways in turn: a Path of four levels mixing lessons, chords, scales and songs;
lessons by module and subject; one curriculum of stages and courses. Each time the method books' material leaked into
the subject lessons (a theory lesson playing a Called to Play study, a lesson leading into another book's). The owner
asked for two things kept apart, switched in Learn's header as the reference journey app switches its map: lessons
laid out as journeys, and courses on shelves with pages of their own, as the reference courses app has them.

## Decision

- **Learn** (`/?view=lessons|courses&journey=`, remembered) is its header's toggle, in the title's place, between the
  **Lessons** and the **Courses**, with **Continue**: one card naming its step, "6 of 13 learned" and its meter.
  Continue follows the track last learned on: after a course's lesson or song, that course's next step; otherwise the
  journeys' next. On a phone it follows the level's chips; on a laptop (`lg`) the page is three columns: the levels
  as a list (each with its book's title and count, then Your lessons), the level, and Continue with Your courses. The
  Courses span the first two columns, two shelves to a row.
- **The Lessons** (`entities/lesson`): four journeys, one to a level (Foundations, Fluency, Musicianship, Mastery),
  chosen from the chips (a phone) or the list (a laptop). A journey is chapters of lessons, then the chord families or
  scales its chapter's Check asks. A level's steps, like a course's lessons, are a **lesson line**
  (`LessonLine`): one spine through their tiles and no card round them; a tile is its number, a check's square, a
  learned one grass with a check, the next one its book ringed in honey with Next. It shows the order and locks
  nothing. A journey's lesson plays no piece,
  shows no pattern, names no method book and links only Lessons and Practice.
- **The Courses** (`entities/course`): self-contained, on five shelves (beginner, intermediate, technique, chords and
  improvising, method books). A course has a level, its weeks, its own lessons and its guided songs. A course's lesson
  links no other lesson, plays only its course's songs and shows only its own book's patterns (Called to Play 2 also
  level 1's). A piece is a guided song of one course at most, and its level is that course's stage, which Songs
  filters by.
- **Steps and learned marks** (`entities/step`): `lesson:<id>`, `course:<course>/<lesson>`, `piece:<id>`,
  `chords:<family>`, `scale:<kind>`. A mark on one track never counts for another. A whole piece's Learned is the
  learner's own; lessons never set it (ADR 0111).
- **The learner's own lessons and courses** (R30-5, `entities/own-lessons`, `pt-own-lessons`, version 1,
  synced as `own_lessons`): the Lessons' fifth chip after the levels, **Your lessons** (`?journey=own`),
  lists the lessons the learner wrote, each a row as a level's lesson is (learned, read so far), then New
  lesson (a name, then the lesson editor). The Courses end on **Your courses**, each on its cover (a
  Songs folder's picture and paint), then New course (a name, then the course editor). An own lesson is
  the app's lesson document under `own-lesson-n`, read at `/lessons/own-lesson-n` as any lesson, its
  progress the same step (`lesson:<id>`), never part of a level's journey or of Continue; it is written
  once in the learner's language and reads the same in the other (`inBothLanguages`). An own course
  (`own-course-n`) is a title, a line, a cover and lessons in order: the learner's own, and the levels'
  added by reference, which stay the app's, their progress their own wherever they are read; a lesson
  read in it (`/lessons/$lessonId?course=own-course-n`) has the course over it and its lessons either
  side. The editors are the app's `LessonEditor` and `CourseEditor` on a local source (`LessonSource`,
  `CourseSource` `own`: no draft, no Publish, kept as the editor rests, Done keeping what waits; an
  example of notes is written as text, the score's Edit music being the app's lessons'). Their Settings:
  how lessons read, Rename, Duplicate (the copy opened), Reset progress, and Delete last, asked first
  (a lesson leaves every own course, its progress with it; a course's lessons stay). No Share link:
  sharing them is drawn later. Search finds them.
- **A lesson is a worksheet**: prose, steps and notes, and examples that play in place on the lesson's keys: chords
  as the lesson writes them, one quality on twelve roots, a scale, an interval's card, a line of notes on its staff,
  voicings written hand by hand, a progression's row, and a pattern heard over its piece's first line (a pattern is
  only ever heard on chords). A question is answered on the keys, a chord's notes in any octave. Links name what they
  open (a chord, a scale, a key, a tool, a trainer, the Player), never a route.
- **A lesson's page** is a document, as its editor shows it: where it stands (its level or course, its chapter, "Lesson
  3 of 11"), then its title large on the page and only there (the bar keeps its room for Learned, the keys and the
  gear), as the lesson editor shows it. It is one column in the middle under one floating bar (‹ the section before, the count opening its
  contents and what it is part of, › the next). Its end is the lesson before and the way on; going on learns it.
  It reads as **one page of its sections** for everyone, on every screen. A learner who wants it **a section at a time**
  chooses so (the lesson's Settings, Lessons read as: One page · A section at a time, `pt-settings` `lessonReading`, its
  one home): then the bar holds ‹, the pages' dots (opening the contents) and Next, Done on the last page, which goes on
  and learns it.
- **A lesson's and a course's Settings** (`/lessons/$lessonId/settings`, `/courses/$courseId/settings`,
  `/courses/$courseId/$lessonId/settings`; `pages/lesson`, `pages/course`) open from a gear in its bar, as a song's
  do, and are the same kind of page: one list of grouped rows from the settings kit. A learner's lesson: how lessons
  read, Share link (the share sheet, else copied), and apart its progress reset after asking (`resetSteps`: not
  learned, no section read; nothing else). A course: Share link and its lessons' and guided songs' progress reset.
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
