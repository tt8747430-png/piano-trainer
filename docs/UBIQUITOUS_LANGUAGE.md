# Ubiquitous Language

Canonical terms for code, UI copy, commits and discussion. Code uses the **Term**; where the interface says it
differently, the UI column says how.

## Content

| Term            | Means                                                                                      | UI                            | Avoid                      |
| --------------- | ------------------------------------------------------------------------------------------ | ----------------------------- | -------------------------- |
| **Piece**       | Anything that opens in the Player: a song, an exercise or a progression (`kind`)           | Song / Exercise / Progression | item, track, tune          |
| **Listing**     | A songbook entry with no chart yet; shown in Songs, never opened in the Player             | Song, "no chart yet"          | stub, placeholder          |
| **Collection**  | An ordered group of Pieces and Listings from one source («Боже, спасибо», Called to Play…) | Collection                    | book, category             |
| **Book**        | A printed songbook or method that a Source cites; not a Collection                         | the book's title              | collection                 |
| **Source**      | Where a Piece is printed: its Book, number and page                                        | Source                        | origin, reference          |
| **Credit**      | A role (words, music, harmony…) and the names printed for it                               | "Words: …", "Music: …"        | author string, by          |
| **Chart**       | A song's or exercise's chords by section, line and bar, in the chart format                | Chords                        | sheet, score, lead sheet   |
| **Progression** | A Piece written as degrees + functions, whose chords grow with the chosen Voicing          | Progression                   | chord flow, sequence       |
| **Section**     | A labelled part of a Chart: intro, verse, chorus, ending, practice, hymn, part             | Verse, Chorus, …              | block, segment             |
| **Bar**         | One measure of a Chart                                                                     | Bar                           | measure (in code), segment |
| **Method code** | A per-chord playing technique from the source book (`:t1`, `:3ch`)                         | —                             | style code                 |
| **LocalText**   | Content text in both languages, `{ en, ru }`                                               | —                             | translation, i18n string   |

## Music

| Term                       | Means                                                                                                     | Avoid                |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------- |
| **Pitch class**            | One of the 12 notes, whatever the octave (0–11)                                                           | note number          |
| **Spelled note**           | A note with its letter and accidental (E♭, not D♯)                                                        | note-name string     |
| **Chord quality**          | The kind of chord: `maj`, `m7`, `hd`, … (33)                                                              | chord type (in code) |
| **Chord family**           | A group of qualities: triads; 6th & add; 7ths; 9ths & more; altered 7ths                                  | chord group          |
| **Chord symbol**           | The written name, `F#m7b5/C`                                                                              | chord name           |
| **Chord tone**             | One note of a chord, with its **Role** (root, 3rd, 5th, 7th, 9th, 11th, 13th) and **Degree** label (`♭3`) | chord note           |
| **Tone**                   | A spelled note measured from a root, with its Role and Degree label: a Chord tone, or one note of a scale | scale note           |
| **Key**                    | A tonic and a mode (G major, G♯ minor)                                                                    | tonality (in code)   |
| **Transpose**              | Move to another tonic by the interval between tonics, letters kept                                        | shift                |
| **Voicing**                | How much of each chord a Progression plays: triads, sevenths or ninths                                    | colour               |
| **Inversion**              | Which chord tone is lowest                                                                                | position             |
| **Scale kind**             | major; natural, harmonic or melodic minor; major or minor pentatonic; blues                               | scale type, mode     |
| **Degree** (progression)   | A Roman numeral from the tonic on the major scale (`ii`, `♭VII`)                                          | step                 |
| **Function** (progression) | How a degree's chord grows with the Voicing: `maj`, `min`, `dom`, `domb9`, `hd`, or fixed `=quality`      | chord role           |

## Practice

| Term                          | Means                                                                                  | Avoid                   |
| ----------------------------- | -------------------------------------------------------------------------------------- | ----------------------- |
| **Pattern**                   | A named accompaniment style for the right and left hand                                | rhythm, style (in code) |
| **Figure**                    | One hand's part of a Pattern: fixed events, or a right hand playing the tune           | part, RHP/LHP           |
| **Practice toggle**           | One of the Setup's saved switches: finger numbers, melody, metronome, count-in         | option, flag            |
| **Performance**               | Everything `arrange` produces for a Piece: bars, beats, notes on a timeline            | playback, song data     |
| **Tick**                      | The domain's unit of time: 12 per beat                                                 | step (as time)          |
| **Beat group**                | Notes sharing an onset: what Step mode walks through                                   | chord (as time), group  |
| **Pass**                      | One play-through from a beat group to the end; Listen loops passes                     | run, cycle              |
| **Transport**                 | Listen's playback: passes queued ahead of the audio clock and followed as they sound   | player loop, engine     |
| **Listen / Step / Your turn** | The Player's modes: the app plays / you move through it / the app waits for your notes | auto, manual            |
| **Setup**                     | The Player's sheet: key, tempo, hands, pattern, voicing and toggles                    | options, settings       |

## Path and progress

| Term         | Means                                                                                      | Avoid                     |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------- |
| **Level**    | 1 Beginner · 2 Elementary · 3 Intermediate · 4 Advanced: a Step's place on the Path        | difficulty, grade         |
| **Path**     | Every Step in order, level by level; the one source of levels                              | course, curriculum        |
| **Step**     | One entry on the Path: a Piece, a chord family or a scale kind (`piece:bz5`, `chords:sev`) | lesson, item, task        |
| **Learned**  | A Step the learner marked, or a chord or scale Step marked once every Skill in it is Known | done, completed, mastered |
| **Continue** | The one suggestion on the Path screen: what to do next                                     | resume, next up           |

## Theory gaps

| Term                      | Means                                                                                         | Avoid               |
| ------------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| **Skill**                 | Something rated from quiz answers: one chord quality or one scale kind (`chord:m7`)           | ability, topic      |
| **Evidence**              | The last 5 quiz answers on a Skill                                                            | history, attempts   |
| **Known / Gap / Unknown** | A Skill's rating: 4 of the last 5 right including the latest / tried, not known / never tried | mastered, weak, new |
| **Check**                 | A short quiz scoped to some Skills (a Piece's chords, a Step's family)                        | test, exam          |
| **Build chord**           | The quiz mode that names a chord for the learner to play                                      | exercise, drill     |
| **Name chord**            | The quiz mode that plays a chord for the learner to name                                      | exercise, drill     |
| **Build scale**           | The quiz mode that names a scale for the learner to play                                      | exercise, drill     |
| **My gaps**               | The quiz scope that asks Gap Skills first, then Unknown Skills from Pieces the learner opened | review, weak spots  |

## Settings and app

| Term         | Means                                                         | Avoid               |
| ------------ | ------------------------------------------------------------- | ------------------- |
| **Theme**    | `system`, `light` or `dark`; `system` follows the OS          | mode, appearance    |
| **Locale**   | The interface language, `en` or `ru`                          | language code, lang |
| **Services** | The audio and MIDI ports the app hands down (`useServices()`) | engine, context     |
