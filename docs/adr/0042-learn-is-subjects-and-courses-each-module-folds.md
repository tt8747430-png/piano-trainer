# ADR 0042 — Learn is Subjects and Courses, each module folds, and a lesson leads along its track

- **Status:** accepted · **Date:** 2026-10-13 · **Amends:** ADR 0029 (Learn's one list), ADR 0033 (Learn's
  modules)

## Context

Learn had grown to one page of five modules and thirty-three lessons. The owner asked for each course's lessons as
lessons of their own (Vasily Gorshkov's accompaniment course, Called to Play's level 1 workbook), for tabs and folds
on Learn, and for better navigation. A lesson ended on the next lesson as Learn listed them, so Gospel's last led
nowhere and a book's last would have led into another book.

## Decision

- **Learn has two tabs** (`?tab=subjects|courses`, remembered, ADR 0022): **Subjects** (Fundamentals,
  Accompaniment, Gospel) and **Courses** (each method book's module, then Gorshkov's). `LESSON_MODULES` lists the
  subjects, then the courses (`SUBJECT_MODULES`, `COURSE_MODULES`).
- **Each module folds** under a heading with its count learned and a bar; the URL holds the modules open
  (`?open=`, dot-separated, remembered with the tab). Without it, the module of the lesson to continue with opens,
  else the first not all learned.
- **A lesson's track** is what Previous and Next walk: the subjects' modules in turn, or one course alone. A lesson
  names its module (a link to it open on Learn) and its number in it.
- **A course is a module that follows one teacher's material in its order**, its lessons numbered as its sheets
  number them. A method book's module is a course; so is Gorshkov's (`gorshkov`), which is no method book (no
  pattern groups, no studies) and so adds no part to Practice's Accompaniment.

## Consequences

- Called to Play's lessons follow its workbook one to one; _Right-hand techniques_ is its lesson 5, and lessons 6–9
  are lessons of their own.
- _Thinking in degrees_, _The ii–V–I_ and _Jazz voicings_ move from Accompaniment to Gorshkov's course, ids kept.
- `nextLesson` no longer crosses from one course into another.
