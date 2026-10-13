# Learn by subject and by course: tabs, folds, a lesson's place, each course's own lessons

- **Date:** 2026-10-13 · **Follows:** ADR 0029 (Learn holds lessons), ADR 0033 (a method book's module)
- **Decided without a review gate:** the owner asks for decisions, not menus (memory: decide and continue).

## What the owner said

"Make the lessons of this course separate lessons in the Learn tab, and add foldings and tabs to Learn and better
navigation. The same for Called to Play level 1's lessons." The course is Vasily Gorshkov's accompaniment course
(`piano-data/Course`: five lessons of sheets, two extra sheets); Called to Play is its level 1 workbook (ten lessons,
song introductions, the table of embellishments, the final exam). Also: "read piano.org's learning order for an
information update".

## What was there

- Learn was one long page of five modules (33 lessons): Fundamentals, Accompaniment, Called to Play, Боброва, Gospel.
- Three of Gorshkov's sheets were lessons in Accompaniment, mixed with the subject's own: _Thinking in degrees_,
  _The ii–V–I_ (with «Как олень спешит к воде»'s ii–V–Is), _Jazz voicings_. His lessons 1, 2, 4 and 5 were not.
- Called to Play's ten lessons were two: _The five ways_ (lesson 3) and _Right-hand techniques_ (lessons 5–9 in one).
  Lessons 1, 2, 4 and 10, the introductions and the exam were not there; every song and study was.
- A lesson ended on the next lesson as Learn listed them, Gospel's last into nothing, and said nowhere where it was.

## Decisions

**Learn has two tabs, Subjects · Courses** (`?tab=`, remembered). Subjects teaches by subject: Fundamentals,
Accompaniment, Gospel. Courses holds each teacher's material in its own order: Called to Play, Боброва, Gorshkov.
Two tabs, not one a module: a phone shows both names, and a learner chooses between reading by subject and
following a course before choosing a module.

**Each module folds under its heading** (`?open=`, remembered with the tab): its name, a line on what it is (a
course's book and author), its count learned and a bar. The module the learner is at opens: the one of the lesson
to continue with, else the first not all learned. A fold opened or closed is the URL's, so Back from a lesson finds
Learn as it was left.

**Continue** heads each tab once something in it is learned: the first lesson not learned after the one learned
last, along its track.

**A lesson says where it is and leads along its track.** Under its title: its module, a link back to it on Learn
(its tab, it open), and "Lesson 3 of 11". At its end: Previous and Next. The subjects are one track (Fundamentals
into Accompaniment into Gospel); a course is a track of its own, so its last lesson leads back to its list, never
into another teacher's.

**Gorshkov's course is a module of Learn** (`gorshkov`), named by its author as Боброва's is. A follow-up made it a
method book (ADR 0043): its six textures are a pattern group, its three songs its pieces, and Practice's Accompaniment
gains its tab. Its lessons, in its order, numbered as its sheets are:

| #   | Lesson                    | Sheet                                                           |
| --- | ------------------------- | --------------------------------------------------------------- |
| 1   | Jazz chord symbols        | Урок 1, теоретический материал «Джазовые обозначения»           |
| 2   | Seventh chords in a song  | Урок 1, практика «Септаккорды» (Ромашковые поля, Упражнение 1)  |
| 3   | Ninth chords              | Урок 2 «Нонаккорды»                                             |
| 4   | Ninth chords in a song    | Урок 2, практика (Упражнение 2, the dominant 9th's resolution)  |
| 5   | Thinking in degrees       | Урок 3 «Мышление ступенями», moved from Accompaniment           |
| 6   | The ii–V–I                | Урок 3 «Оборот 2-5-1» and «Как олень спешит к воде», moved      |
| 7   | Chord pulse               | Урок 4 «Аранжировка аккомпанемента: аккордовая пульсация»       |
| 8   | Melodic figuration        | Урок 5 «Мелодическая фигурация»                                 |
| 9   | Jazz voicings             | «Джазовые расположения аккордов», moved                         |

**Called to Play is its workbook's lessons, one each:** 1 Introduction to chord playing, 2 Major and minor chords,
3 The five ways, 4 Songs by their plan, 5–9 the right hand's techniques one lesson each (1–2, 3–4, 5–7, 8–10, 11),
10 The art of accompaniment (with the song introductions and the table of embellishments, which the book prints
between lessons 9 and 10), then the final exam. Each plays its studies and opens its songs, as the book pairs them.

**piano.org's learning order is a lesson in Accompaniment**, _Progressions in the order to learn them_: its ten
steps, each a progression in C to hear and a walk through the keys to practise, and its advice (a week a step;
C, G, D and F for the first five, all twelve keys from the ii–V–I on). The library gains the two ideas it lacked:
the borrowed ♭VII (I–♭VII–IV–I, rock) and the tritone substitution (ii7–♭II7–Imaj7, jazz). Its half cadence and
secondary dominant stay out of the library (ADR 0041: a twin of the complete cadence, a lead-in's line); the
lesson plays them as blocks.

## Done after

- Gorshkov's course became a method book with its textures and songs (ADR 0043); «Как олень спешит к воде» and
  «Опять метель» are songs with their melodies.
- A lesson lists its sections at its top, each a link that lands its heading clear of the screen's bar and the
  pinned keys.
