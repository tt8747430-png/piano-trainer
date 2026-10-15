# ADR 0048 — The Path reads the subjects' lessons, and Continue is one way on

- **Status:** superseded by ADR 0051 · **Date:** 2026-10-14 · **Amends:** ADR 0005 (the Path's levels), ADR 0042 (a lesson's
  track)

## Context

The Path and Learn were two curricula side by side: the Path's levels of chords, scales, studies and songs, with
Continue on its first step not learned, and Learn's lessons, with a Continue of their own. A learner reading
lessons found nothing of them on the screen that says what is next, and a new learner was sent to the Triads
explorer before reading _Finding your way on the keys_.

## Decision

- **A lesson is a Path step** (`{ kind: 'lesson', lessonId }`, id `lesson:<id>`). A step id is what a learned mark is
  kept under, so a lesson's mark is the same on Learn, its page and the Path; `LearnedId` is gone into `StepId`.
- **Each level opens with the subjects' lessons at that level** (Fundamentals, Accompaniment, Gospel, as taught),
  read before the level's practice. A lesson's place comes from its own `level`: nothing is listed twice. A course's
  lessons stay on their course.
- **Continue is one way on**: the first step not learned, so a lesson to read, a chord or scale to practise or a song
  to play; a lesson opens its page. `StepLink` is a step's way to where it is done (a piece's way is its caller's:
  its page, or the Player).
- **A lesson's end goes on along its track and learns it on the way** (Next, or a course's list after its last);
  Previous is gone: Back and the module's link lead there.

## Consequences

- A first run's Continue is _Finding your way on the keys_.
- The Path's level 1 holds the ten Beginner lessons before Triads; a lesson and a chord step may share a name
  (Triads), so a step's learned toggle is named with its kind.
