# Lessons and Courses — design

Decision record: [ADR 0053](../../adr/0053-lessons-and-courses-apart.md). References: `piano-data/reference-apps/journey-app`
(the Lessons' layout), `piano-data/reference-apps/courses-app` (the Courses' shelves, course pages and course list).

## Learn

The header holds a two-way toggle, Lessons (a map) and Courses (a cap), beside Search and Settings on a phone; the
view shown is honey. Continue, the practice days and the songs played last stand beside the view (on the right of a
laptop, above and below it on a phone).

### Lessons — the journeys

| Journey      | Level        | Chapters                                                                                   |
| ------------ | ------------ | ------------------------------------------------------------------------------------------ |
| Foundations  | Beginner     | The keyboard and the staff · Rhythm and meter · Steps and the major scale · Intervals · Your first chords |
| Fluency      | Intermediate | Keys · The chords of a key · Accompanying a melody · Progressions and cadences · Compound time and swing · Sixths and sevenths |
| Musicianship | Advanced     | The chromatic, pentatonic and blues · Harmony in motion · Gospel · The modes                 |
| Mastery      | Professional | Jazz chords · The ii–V–I · Voicing and soloing                                               |

One journey shows at a time: ← its name and level, how much is learned, → ; its goal; then each chapter ("Chapter
1: …", learned of its nodes) as a zigzag of round nodes joined by a dashed path. A node is a lesson (a book) or a
chapter's Check (a chord family's keys or a scale's steps), in its level's paint, grass with a check once learned,
ringed in honey and larger where Continue leads.

### Courses — the shelves

| Shelf                    | Courses                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Beginner                 | Introduction to the Piano · Playing with Both Hands · Intro to Music Reading · Rhythm Basics |
| Intermediate             | Intermediate Piano Playing · The Sustain Pedal                                              |
| Technique and exercises  | First Exercises for Both Hands · Major Scales · Minor Scales · Music Reading Training · Major Arpeggios · Minor Arpeggios |
| Chords and improvisation | Mastering Chords · Improvising with Chords                                                  |
| Method books             | Called to Play · Called to Play 2 · Боброва · Горшков                                        |

A card: a cover in the level's paint with the course's icon, its name, what it teaches, its level (a dot) and weeks,
how much is learned once begun. Phones scroll a shelf across; laptops lay it in a grid.

A course's page: its cover, what it teaches, its facts (level, weeks, lessons, songs), how much is learned, one honey
Start course / Continue / Review; its lessons as numbered cards; its guided songs, "Strengthen your new skills with
these songs". The scale and arpeggio courses have one lesson per key, built from the kernel.

## Lessons of either kind

A lesson's page says where it is (its journey and chapter, or its course) and its number; it ends on Learned and the
one way on: the next lesson, else back to the journey or on to the course's songs. Its content follows the owner's
prose checklist (CONTENT.md §Lessons).
