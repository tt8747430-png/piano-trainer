# ADR 0051 — One curriculum: stages, courses, lessons and practice

- **Status:** superseded by ADR 0053 · **Date:** 2026-10-14 · **Supersedes:** ADR 0049 (a Journey and Courses), ADR 0048 (the
  Path reads the subjects' lessons), ADR 0042 (lesson modules and tracks), ADR 0005's levels

## Context

Learn drew one curriculum twice: the Path's four levels (a long list mixing lessons, chords, scales and songs) and
the lesson modules (subjects, then each method book) as cards, with a switch between them that meant nothing to
the learner. The lessons were thin. The owner asked for one path from beginner to professional after the reference
apps (a courses app's shelves by level, a theory app's four journeys).

## Decision

- **The curriculum** (`entities/course`) is four stages (Beginner, Intermediate, Advanced, Professional), each a
  run of courses. A course owns its lessons' order and its practice steps (pieces, a chord family, scales). The
  method books are courses placed in it.
- A step's id is unchanged (`lesson:…`, `piece:…`, `chords:…`, `scale:…`); a step's stage is its course's.
- **Continue** is the first step not learned, course by course, a course's lessons before its practice.
- **Learn** (`/`) is Continue, then the stages, each its courses as cards. A course is `/learn/$courseId`.
- `entities/path`, levels 1–4, lesson modules, tracks, `/?view=` and the Journey are removed.

## Consequences

- An exercise's and a piece's level is a stage.
- A lesson knows its course only by lookup; moving a lesson is one line in a course.
