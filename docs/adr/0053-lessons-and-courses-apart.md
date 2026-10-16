# ADR 0053 — Lessons and Courses, apart

- **Status:** accepted · **Date:** 2026-10-15 · **Supersedes:** ADR 0051 (one curriculum of stages and courses)

## Context

ADR 0051 put the method books into one curriculum beside the subject lessons. Their material leaked: a theory
lesson on bass and chords played a Called to Play study and Боброва's hymn with the books' patterns, and a lesson
led into another book's. The owner found it misleading. They asked for two things kept apart, switched by a toggle in
Learn's header as the journey-app switches its map: the **Lessons**, laid out as the journey-app's journeys, and the
**Courses**, as the courses-app's shelves and course pages, our own courses made after that app's.

## Decision

- **Lessons** (`entities/lesson`): four journeys, one to a level (Foundations, Fluency, Musicianship, Mastery), each
  in chapters of lessons and then the chord families or scales the chapter's Check asks (`content/journeys.ts`). A
  journey's lesson plays no piece, shows no pattern, names no method book and links only Lessons and Practice.
- **Courses** (`entities/course`): self-contained, on five shelves (beginner, intermediate, technique, chords and
  improvising, method books). A course has a level, weeks, its **own lessons** (`content/<course>/<lesson>.ts`) and
  its **guided songs**. A course's lesson links no lesson, plays only its own course's songs and shows only its own
  book's patterns (level 2 of Called to Play also level 1's). A piece is a guided song of one course at most.
- **Steps** (`entities/step`): the learned marks, `lesson:<id>`, `course:<course>/<lesson>`, `piece:<id>`,
  `chords:<family>`, `scale:<kind>`; the levels (`Stage`) and their paint.
- **Learn** (`/?view=lessons|courses&journey=`, remembered): its header's toggle; the Lessons a journey at a time
  between arrows, its chapters as zigzags of nodes; the Courses shelf by shelf. Routes: `/lessons/$lessonId`,
  `/courses/$courseId`, `/courses/$courseId/$lessonId`.
- **Continue** follows the track last learned on: after a course's lesson or song, that course's next step;
  otherwise the journeys' next.
- `src/app/content/` tests every lesson of both kinds: the kernel reads it, the owner's prose checklist, and the
  rules above, which keep the two apart.

## Consequences

- `/learn/…` is gone, with no redirect (there are no users before release).
- A lesson's learned mark under `lesson:` never counts for a course, nor the reverse.
- Lines of notes write rests (`r/4`), ties (`~`) and 6/8 and 12/8, which the rhythm lessons need.
