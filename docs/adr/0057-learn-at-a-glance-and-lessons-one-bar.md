# ADR 0057 — Learn at a glance; a lesson's one bar; nothing said of what is turned off

- **Status:** accepted · **Date:** 2026-10-16 · **Amends:** ADR 0053 (Learn's two views), ADR 0054 (the Chord
  finder), ADR 0055 (floating actions)

## Context

The owner found Learn hard to read: the journey map stepped between journeys by arrows under a kicker and a
paragraph, its chapters could not be folded, and Continue was a large card at the top of a phone's screen. The
Courses were tall cards of summaries, a course's page a two-line honey pill over cards of summaries. A lesson's
floating actions were a stack (a speed dial over a stepper) that covered the page, its contents took half a
laptop's width, its end was a pill beside a toggle, and Back was only in the screen's bar. A line of notes put all
its notes on the keys at once. On the Chord finder, a part turned off said "Hidden here", the staff was a full-width
card with a title, and its settings were switches with a line of text each. The keys' morph into their button
stretched one picture into the other.

## Decision

- **Learn:** the four journeys are tabs, each with how much of it is learned; a chapter's heading folds it
  (`useFold`, `journey.<journey>.<chapter>`), a check where it is all learned. **Continue floats** in the thumb's
  reach (`widgets/continue-action`, one honey button naming the step), on both views; the Continue card is gone.
- **Courses** are compact cards: the course's icon on its level's wash, its name, its weeks, lessons and songs as
  pictures with their numbers (`CourseFacts`), its progress once begun (`LearnedMeter`). A shelf says its name
  only. **A course's page** is its icon beside its summary, facts, progress and one honey button (Start course,
  Continue, Review), then its lessons as one card of numbered rows and its guided songs.
- **A lesson has one bar**, floating (`LessonBar`): ‹ the section before, the count opening the contents in a
  sheet with the ways out (the lesson before, the way on, what it is part of), › the next; before the first
  section ‹ is the lesson before, past the last › is the way on in honey, which learns it. The lesson's own tools
  end the bar (the fingers on its scales, a toggle). No contents column on a laptop. Its end is Learned over the
  lesson before and the way on, side by side (`LessonTrack`, `previousLessonId`, `previousCourseLesson`).
- **Examples say less:** Play is a round icon (`PlayButton`; an interval's Up, Down, Together its arrows), a
  question's one button an icon and a word, a line of notes a card as wide as its staff. **A line played shows the
  keys of the bar it is in** (`barOf`, `barShown`).
- **The speed dial's actions** are small round icons with their names in a quiet chip.
- **Chord finder:** what is turned off is gone, with nothing said where it was. The staff stands beside the name,
  as wide as its bars, with no title and nothing before a chord is played; its settings are toggle tiles.
- **The keys' morph** keeps each picture its own size in a frame growing from the corner they share, rounding into
  the button, the one leaving fading first (`morph`'s `way`, `data-morph`); the floating actions ride with it.

## Consequences

`ContinueCard`, `HiddenParts`, `SectionStepper`, `LessonOptions`, `nextJourney` and `previousJourney` are gone, with
their strings.
