# Called to Play, level 2: the same methods in 6/8 and 12/8

- **Date:** 2026-10-14 · **Source:** `piano-data/method-books/called-to-play/level-2-ru.pdf` (А. Савченко,
  «Призван играть для Него», рабочая тетрадь, уровень 2, 52 pages)

## What the book is

Level 1 (taught: ADR 0033 and its lessons) plays every song in 4/4 with numbered methods: the five ways `1`–`5`, the
right-hand techniques `t1`–`t5` (drawn as rhythm icons), `Invers.`, `3 chords`, `5.1`–`5.3` and the sixths. Level 2
keeps those methods and plays them in **6/8 and 12/8**; its song charts write the same codes over Russian hymns.

| Lesson | Teaches                                                          | In the app                                      |
| ------ | ---------------------------------------------------------------- | ----------------------------------------------- |
| 1      | Seventh chords: maj7 or 7 by the key's signature, the 7th below  | a lesson, «О молитва»                            |
| 2      | Octaves, as a scale and by the chord                             | a lesson, two songs                              |
| 3      | 6/8 and 12/8; the five ways in 6/8                               | the five ways' 6/8 figures; a lesson, two songs  |
| 4      | Right-hand ways 1–4 in 6/8 (= `t1`–`t4`)                         | their 6/8 figures; a lesson, three songs         |
| 5      | Ways 5–6 in 6/8 (= `t5`, `Invers.`)                              | their figures; a lesson, two songs               |
| 6      | Ways 7–10 in 12/8 (= `5.1`, `5.2`, `5.3`, `3 chords`)            | their figures; a lesson, two songs               |
| 7      | Sixths in 6/8 and 12/8 (`6↑`, `6↓`)                              | their figures; a lesson, three songs             |
| 8      | Joining I–IV–V by the nearest notes, three positions             | a lesson (voice-led rows)                        |
| 9      | Ten left-hand ways under a melody played from the notes          | a lesson                                         |
| —      | The table of right-hand ornaments                                | a lesson section                                 |
| 10     | The art of accompaniment: balance, «музыкальный торт»            | a lesson, four songs                             |
| Exam   | The final exam                                                   | a lesson                                         |

## Decisions

- **One set of methods.** A method code means the same way in any meter, as the book teaches it. A hand's figure
  carries a version for compound time (`inCompound`, and `inCompoundOnMajor` where a major chord plays less, as 5.2
  does), written in 16ths of compound time: a dotted-quarter beat is six, a 6/8 bar twelve, a 12/8 bar twenty-four.
  The arrangement plays it in 6/8 and 12/8 (a 6/8 bar plays its first half); a figure with no compound version plays
  its own events there, as before. A figure whose events fall on beats needs none: a compound beat is a beat
  (`5.1`–`5.3`, `3 chords` and the chord on every beat already play the book's 12/8).
- **A figure fits compound time** where what it plays there divides each beat in three: its compound version, or
  its own events. `splitsTheBeat` reads that.
- **Chord degrees reach three octaves** (1–22): `t4` in 6/8 runs 1–2–3–5 through three octaves in 16ths.
- **Lessons** are a module of their own, «Призван играть · уровень 2», after level 1's on Learn's Courses tab, in the
  book's order; each section is the book's, in the 35-word rule.
- **Songs** are Called to Play's, `source: { book: 'called-to-play', page }`, charted with the book's codes: a
  rhythm icon as its `t` code, `Invers.` as `inv`, `Октавы` and `(melody)` left to the pattern. Lyrics are not
  stored. Song ids are short transliterations (`molitva`, `zemlya`, `otchizna`, …).

## The figures in compound time (from lessons 3–7)

In 16ths of compound time, for a 12/8 bar (a 6/8 bar plays the first twelve).

| Figure (method)   | Book                                                    | Compound version                                            |
| ----------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| `b2` (2)          | upper notes ♩, lowest ♪, each beat                      | `U` 4, `v1` 2, per beat                                     |
| `b3` (3)          | the chord on beat 2 over the left's 1–5–8               | `3+5+8` at 6, 6 long, per half bar                          |
| `b4` (4)          | 3–5–8 in 8ths on beat 2                                 | `3 5 8` at 6, 8, 10, per half bar                           |
| `fig` (3, 4)      | 1–5–8 in 8ths on beat 1                                 | `L1 L5 L8` at 0, 2, 4, per half bar                         |
| `dot` (5, 5.1–5.3)| octave ♩. tied to ♩, then ♪                            | octave 10 long, octave 2 long, per half bar                 |
| `t1`              | chord ♩, 8th ♪, 15th ♩.                                 | `T` 4, `8` 2, `15` 6, per half bar                          |
| `t2`              | 1 3 5 8 10 12 in 8ths                                   | per half bar                                                |
| `t3`              | (9+12) 10 8, (2+5) 3 1 in 8ths                          | per half bar                                                |
| `t4`              | 1 2 3 5 through three octaves in 16ths                  | one per 16th, per half bar                                  |
| `t5`              | chord ♩, chord an octave up ♪, held ♩.                  | `T` 4, `T8` 2, `T8` 6, per half bar                         |
| `inv` (Invers.)   | root position ♩., 1st inversion ♩.                      | `T` 6, `T1` 6, per half bar                                 |
| `wide`, `climb`   | 1 5 8 10 12 10 / 1 5 8 10 12 15 in 8ths                 | per half bar                                                |
| `s6u`, `s6d`      | sixths ♩ ♪ ♩., rising or falling                        | per half bar                                                |

## Phases

1. The engine: `inCompound`, its fit, degrees to 22.
2. The figures above, each checked against the book in a test.
3. The lessons, as a module.
4. The songs, a lesson's songs with it.
