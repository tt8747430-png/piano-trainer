# Learn (canvas 128)

Premium for Learn means it stands beside flowkey's course list and Duolingo's unit view: you see at once where you
are, what is next, and that every lesson can still be opened.

## The rulings as they stand

- **"A library, not a path"** (feedback log, Learn and the editors): the levels stay chips (Beginner, Intermediate,
  Advanced, Professional, Your lessons) and any lesson opens from any state. The word "journey" stays out of the
  interface.
- **The level's lessons drawn as a line of tiles** (canvas 128, the bold decision): one spine joins a level's lessons
  in order, chapter by chapter ("1 · The keyboard and the staff", with "3/3" learned). A learned lesson is a sage
  tile with a check, the next one has a honey ring, a book and a "Next" pill, and the rest show their number. A skill
  check (Scales check, Chords check) is a rounded square, not a circle, with "Scales · 5 of 12 known". The spine
  shows the order and what is learned at a glance (scan-first 3 and 7); it locks nothing.
- **Continue first:** "Continue · Foundations", the next lesson in the serif, "6 of 13 learned" and a meter, and one
  honey round button. No days practised here (that is Profile's).
- **Lessons | Courses as the title:** the large title is a two-word switch. Courses are shelves (Beginner courses,
  Intermediate courses, Chords and improvisation, Method books), each course one row with its line ("Rhythm Basics ·
  Count, clap and play in time"), then Your courses.
- **Laptop:** a level list on the left (each level with its book title and "6/13"), the line of lessons in the middle,
  and Continue with Your courses on the right.
- **Real content:** the four levels' chapters and lessons from `src/entities/lesson/content/journeys.ts`.

## History

- Canvas 128 (2026-11-11): Learn drawn for the first time on the one canvas: phone and laptop, Lessons and Courses.
