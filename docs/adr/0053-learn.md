# ADR 0053 — Learn: the Lessons and the Courses, apart; a lesson is a worksheet

- **Status:** accepted · **Date:** 2026-09-29 · consolidated 2026-10-27

## Context

Learn drew its curriculum several ways in turn: a Path of four levels mixing lessons, chords, scales and songs;
lessons by module and subject; one curriculum of stages and courses. Each time the method books' material leaked into
the subject lessons (a theory lesson playing a Called to Play study, a lesson leading into another book's). The owner
asked for two things kept apart, switched in Learn's header as the reference journey app switches its map: lessons
laid out as journeys, and courses on shelves with pages of their own, as the reference courses app has them.

## Decision

- **Learn** (`/?view=lessons|courses&journey=`, remembered) is its header's toggle between the **Lessons** and the
  **Courses**, the days practised and the songs played last, and **Continue**, one honey button floating in the
  thumb's reach, naming its step. Continue follows the track last learned on: after a course's lesson or song, that
  course's next step; otherwise the journeys' next.
- **The Lessons** (`entities/lesson`): four journeys, one to a level (Foundations, Fluency, Musicianship, Mastery),
  shown as tabs with how much of each is learned. A journey is chapters of lessons, then the chord families or scales
  its chapter's Check asks; a chapter folds under its heading. A journey's lesson plays no piece, shows no pattern,
  names no method book and links only Lessons and Practice.
- **The Courses** (`entities/course`): self-contained, on five shelves (beginner, intermediate, technique, chords and
  improvising, method books). A course has a level, its weeks, its own lessons and its guided songs. A course's lesson
  links no other lesson, plays only its course's songs and shows only its own book's patterns (Called to Play 2 also
  level 1's). A piece is a guided song of one course at most, and its level is that course's stage, which Songs
  filters by.
- **Steps and learned marks** (`entities/step`): `lesson:<id>`, `course:<course>/<lesson>`, `piece:<id>`,
  `chords:<family>`, `scale:<kind>`. A mark on one track never counts for another. A whole piece's Learned is the
  learner's own; lessons never set it (ADR 0111).
- **A lesson is a worksheet**: prose, steps and notes, and examples that play in place on the lesson's keys: chords
  as the lesson writes them, one quality on twelve roots, a scale, an interval's card, a line of notes on its staff,
  voicings written hand by hand, a progression's row, and a pattern heard over its piece's first line (a pattern is
  only ever heard on chords). A question is answered on the keys, a chord's notes in any octave. Links name what they
  open (a chord, a scale, a key, a tool, a trainer, the Player), never a route.
- **A lesson's page** is one column in the middle under one floating bar (‹ the section before, the count opening its
  contents and what it is part of, › the next). Its end is the lesson before and the way on; going on learns it.
  **On a phone** (upright or on its side) it reads **a section a page**, as the reference theory book does: the bar
  holds ‹, the pages' dots (opening the contents) and Next, Done on the last page, which goes on and learns it. A
  laptop or a tablet keeps the scroll: there two or three sections fit a screen and the eye looks back over them,
  where on a phone one section fills it anyway.
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

## History

- 0005 — Levels live on the Path (2026-09-24); the Path gave way to the Courses.
- 0018, 0021 — A lesson is a worksheet; a pattern is heard over its piece (2026-09-29 to 09-30).
- 0042, 0048, 0049, 0051 — Subjects and courses with folding modules; the Path reads the lessons; a Journey and
  Courses; one curriculum of stages (2026-10-13 to 10-14), each superseded.
- 0053 — Lessons and Courses, apart (2026-10-15).
- 0057, 0058 — Learn at a glance, Continue floating, a lesson's one bar and one column (2026-10-16).
- r13 — Function and root-motion chips, variants, takeaways, rules, S A T B, a page a section on a phone,
  rings and prerequisites in the contents, after the reference theory book (2026-10-28).
- r14 — Slash chords, modulation, rootless voicings, locked hands, the cadences split, How to Practise (2026-10-28).
- The research note on clearer lessons (2026-10-12), deleted: its checklist is `docs/CONTENT.md`'s.
