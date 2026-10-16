# One curriculum, beginner to professional, and Practice merged

- **Date:** 2026-10-14 · **Owner's ask:** the lessons' overview and Practice still read badly. Rewrite the lessons'
  content and structure from beginner to professional after the reference apps; drop the Journey · Courses switch
  and the old levels; merge Practice's tools properly instead of moving them, with no duplicates and no jumping
  between pages. No backwards compatibility.
- **Supersedes:** the spec `2026-10-14-unified-learn-and-workspaces-design.md` (ADRs 0049, 0050).
- **References read:** `piano-data/reference-apps/courses-app` (courses on shelves by level, each course a page:
  level, length, Start Course, numbered lessons, guided songs), `journey-app` (four journeys, Foundations →
  Fluency → Musicianship → Mastery, each a run of chapters; its tools Key Explorer, Chord Builder and Progression
  Lab each one screen that holds everything about its subject), `flowkey` (home: Continue learning, then courses by
  level and by topic), `clefs` (a chapter: theory first, then numbered lessons), `ultimate-piano` (one workspace
  per subject; passing chords as a relationship explorer between two chords), `theory-trainer`, `duolingo-music`
  (sections, each one skill).

## The curriculum (ADR 0051)

The Path's four levels, the lesson modules (Fundamentals, Accompaniment, Gospel and each method book's), the
Journey and the Courses shelves are one thing now: **the curriculum**, four **stages**, each a run of **courses**,
each course its **lessons** in order and what to **practise** after them (songs, studies, a chord family, scales).
The method books are courses in it, placed where their material is learned, so there is one order to follow and
one Continue.

| Stage            | Goal                                              | Courses                                                                                 |
| ---------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Beginner**     | Find your way, read, play your first chords       | First steps · Reading music · Scales and keys · Chords · _Called to Play_               |
| **Intermediate** | Accompany a song from its chord chart             | Accompaniment · Sixths and sevenths · _Called to Play 2_ · Боброва's seven types        |
| **Advanced**     | Colour and movement: progressions, 9ths, gospel   | Progressions · Gorshkov's course · Gospel · Modes                                       |
| **Professional** | Jazz harmony and improvisation                    | Jazz harmony · Improvisation                                                            |

- A **course** has an id, its stage, its paint and icon, its lessons by id (it owns the order; a lesson does not
  name its course) and its practice steps. A lesson's course and number are looked up.
- A **step** is still a lesson, a piece, a chord family or a scale (`StepId` unchanged: `lesson:…`, `piece:…`).
  Its stage is its course's.
- **Continue** is the first step not learned, course by course, lessons before practice.
- An exercise's and a piece's level become a stage (`LevelMark` names a stage).

## The lessons

Every subject lesson is rewritten as a worksheet that teaches: what the thing is, how it is built on the keys,
how it sounds (examples that play), how to practise it (numbered steps and a link into the Player or an explorer
on what it showed), and a check (questions answered on the keys). New lessons fill the gaps the reference
curricula cover and ours did not: hands and fingers, both hands, the sustain pedal, the bass clef and the grand
staff, pentatonic and blues scales, cadences, 6th and suspended chords, the modes, available tensions, altered
dominants, and three lessons of improvisation. The method books' lessons keep their books' content.

## Learn (`/`)

- **Continue**: the next step, its course and number, one honey button.
- **The curriculum**: four stage sections in order, each its name, goal and count learned, its courses as cards (a
  row that scrolls sideways on a phone, a grid from 1024px): number, paint, title, line, count learned with a bar;
  the course Continue is in is marked. No switch, no levels.
- Practice days and the songs played last close the page.
- **A course's page** (`/learn/$courseId`): its stage and number, title, line, bar, one honey Start or Continue;
  **Lessons** numbered with their learned marks; **Practise**: its songs, studies, chords and scales, each with its
  mark; the next course at its foot.
- **A lesson** says its course (a link) and its number; its last row is the next lesson in the course, or the
  course's practice.

## Practice, merged (ADR 0052)

Each page is one subject with everything about it on it, as the reference tools are; a tool that worked on the
same thing is folded into that page, not a tab beside it.

- **Chords**: one page, the builder, the chord's tensions and its practice. Find is gone from it.
- **Free play** names what is played: the live score, and for the keys held or tapped the Chord finder's names and
  the keys that hold it. The Chord finder's page is gone.
- **Progressions**: one page. A typed line of chords is read in its key (what Transpose did) and plays in any key;
  between any two chords of the row, **Between** shows the passing chords (what Passing chords did). Transpose's
  and Passing chords' pages are gone.
- **Scales and keys**: Scale · Chords · Key. The Key view harmonises a melody note in the key (what Reharmonise
  did). Reharmonise's page is gone.
- **Accompaniment**: patterns and the studies they are practised on; the method books' lessons are on Learn only.
- Practice lists: Chords, Scales and keys, Intervals, Progressions, Accompaniment; Free play; Exercises, Quiz.
- Lessons link to the page that now holds what they open.
