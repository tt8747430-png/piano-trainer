# Practice: exercises and trainers (sub-project 7)

- **Status:** decided 2026-10-01 under the owner's standing instruction (decide, record, continue). The owner asked
  to skip sub-project 6 (the Path as a course) and build the next one: sub-project 7 of the roadmap
  (`2026-09-25-next-features-roadmap-design.md` §2, §3.3, §10.5, §10.6, §11.3). Sub-project 6 stays planned; nothing
  here depends on it, and nothing here blocks it (the Path's pages will link exercises and trainers like any lesson).
- **Builds on:** ADR 0013 (the Player plays a Performance, written by `notate`), ADR 0014 (a walk is a Performance
  handed to the Player), ADR 0015 (the chromatic walk, Practice's first exercise), ADR 0020 (a progression in any
  key), ADR 0022 (a screen opened plainly comes back as left), ADR 0023 (a walk of keys and an inversion), ADR 0006
  (gaps from quiz evidence only).
- **Built in two parts,** each its own commits: **7.1 Exercises** (§2–§4), then **7.2 Trainers** (§5–§7).

## 1. What the earlier changes mean for this plan

Checked against what shipped after the roadmap was written:

- **The chromatic walk, the walk of a scale's chords, the progression Player and walking the keys exist.** The
  catalogue's "Chords by semitones", "Chords in a scale" (walked in an inversion, any pattern, so broken chords are
  the walk with an arpeggio pattern) and "Progressions in every key" (§10.5) are those Players; Practice links to
  them with the exercise's own params. Nothing of theirs is rebuilt.
- **Remembered views (ADR 0022)** cover the new Player source the same way: an exercise opened plainly comes back as
  left; each exercise is its own pathname, so each remembers its own key and choices.
- **The Setup sheet is pattern-bound** (`PlayerSetup` owns the pattern and figure pages). An exercise has no pattern,
  so its Setup is the sheet alone: the kit's `Sheet` with the exercise's fields and `PlayingFields`.
- **MIDI in quizzes** (the last change) means every trainer that asks to play hears a MIDI keyboard through
  `useMidiKeyDown`, as the quiz does.
- **The Theory quiz** (Build chord, Name chord, Build scale, My gaps) becomes four of the trainers (§5): its machine
  grows, its screen becomes the trainer screen, and its stats move from one shared count to a record per trainer.

## 2. Exercises: what they are (7.1)

An **Exercise** is a line of notes generated from a rule in any key, opened in the Player: sheet music, Listen and
Wait mode, tempo and speed training, hands, the loop, swing. Each has a group, a level (1–4, the Path's names), a
"what it trains" line, its source, and the choices its rule takes. Generated, never copied (roadmap §4.4): Hanon's
first exercise is public domain and its rule is the exercise; the rest are written from the methods' ideas.

**Where it lives:**

- `shared/lib/exercise` (a new fenced kernel: imports `music` and `arrangement`'s types, no package): the generators,
  each `(choice) → Performance`, built on one helper that lays notes and harmony out as a Performance (bars of 4/4,
  four to a line, a chord per harmony segment, beat groups). Pure, tested.
- `entities/exercise`: the catalogue (ids, groups, levels, names and "trains" lines as `LocalText`, sources, each
  exercise's fields and own tempo and swing), and the choice's types and readers the URL uses (`exercise-choice.ts`,
  importable by the validators: no generator in it).
- `features/practice`: `arrangeExercise(id, choice)`: the catalogue's rule over the choice.
- `pages/player`: `ExercisePlayerPage` (`useExercisePlayer`, `exercise-search.ts`, `ExerciseSetup`), in `PlayerLayout`.
- Route `/play/exercise/$exerciseId` (full screen, remembered); an unknown exercise is not found.

**The choice** (each exercise declares which it uses; the rest stay out of its URL and its Setup): `root` (a note),
`kind` (a scale kind the exercise allows), `octaves` (1–4), `start` (Start on, a degree), `fingering` (From the thumb
· As the scale), `quality` (an arpeggio type), `inversion`, `figure` (a sequence's shape), `voicing` (Close · Drop 2),
`from` (the chord tone a line starts on), `minor` (major · minor, where the rule has both).

**Hands and register.** Every generator writes both hands (the left an octave below, or mirrored in contrary motion);
the Player's hands popover chooses which is practised, as it does for a piece. One or two octaves start the right
hand at the root at or above middle C; three or four start an octave lower, so the run stays on the keyboard.

**Fingering** is written where the method fingers it, and only there: a scale (its taught fingering over any number
of octaves, or from the thumb), contrary motion, an arpeggio (one rule, §3), the five-finger position, Hanon, PWJ's
inner voice and modes. A sequence, a Barry Harris line or a rapid switch shows no fingers: no method gives one rule.

## 3. The catalogue (7.1)

| Group | Exercise (id) | Level | Rule | Choices |
| --- | --- | --- | --- | --- |
| Scales | Scale (`scale`) | 1 | Up and down 1–4 octaves in 8ths, from any degree | root, kind, octaves, start, fingering |
| | In 3rds (`thirds`) | 2 | Broken 3rds up the scale (1-3, 2-4 …) and back (8-6, 7-5 …) | root, kind, octaves |
| | In 6ths (`sixths`) | 3 | Broken 6ths, the same way | root, kind, octaves |
| | In groups (`groups`) | 2 | A group restarted on each degree: 1-2-3-4 or 1-3-2-4, up and mirrored down | root, kind, octaves, figure |
| | Contrary motion (`contrary`) | 2 | Both hands from the same tonic, the right up while the left goes down, and back | root, kind, octaves |
| Arpeggios | Arpeggio (`arpeggio`) | 2 | A chord's tones up and down 1–4 octaves, from any inversion | root, quality (§10.4's thirteen), inversion, octaves |
| Chords in a scale | Chords of a scale | 2 | The walk (`/play/walk`) | (its Player) |
| | Chords by semitones | 2 | The chromatic walk (`/play/chromatic`) | (its Player) |
| Barry Harris | 6th-diminished scale (`sixth-diminished`) | 3 | Major (C D E F G G♯ A B) or minor (C D E♭ F G G♯ A B) up and down: the 6th chord's notes on the beats | root, minor, octaves |
| | Its chords (`sixth-diminished-chords`) | 4 | Each note of that scale harmonised: the 6th chord (C6 / Cm6) on its own notes, the diminished 7th a semitone under the root on the passing ones; close or drop 2 | root, minor, voicing |
| | Dominant scale down (`dominant-scale`) | 3 | V7's bebop scale down two octaves from a chord tone: the half step between root and ♭7 keeps every chord tone on a beat | root (the key), from |
| | Arpeggios from the 3rd (`from-third`) | 4 | ii–V–I: each chord's 3-5-7-9, then the scale down from the 9th's octave, into the next chord's 3rd | root (the key) |
| | Drop-2 7ths (`drop-two`) | 4 | The key's 7th chords up the scale and back, the second voice from the top dropped an octave into the left hand | root, inversion |
| Piano With Jonny | 2-5-1 scale (`two-five-one-scale`) | 1 | The major scale up over the ii's shell, down over the V's, home on the I's, swung | root (the key) |
| | Inner voice (`inner-voice`) | 2 | The key's 7th chords up the scale: the root below, the 3rd on top (5) and the 7th under it (2), the 7th stepping down to the 6th (1) | root |
| | Modes (`modes`) | 3 | The scale from each of its degrees, Ionian to Locrian, fingered as the parent scale | root |
| | Rapid switch (`rapid-switch`) | 4 | One line of 8ths round the circle of fifths: up a bar in one key, down the next bar in the next, never a break | root (the first key) |
| | Pattern shifting (`pattern-shifting`) | 4 | A figure (1-2-3-5, 1-3-5-3 or 3-2-1-2) restarted on each degree up and down: a melodic sequence | root, figure |
| Progressions in every key | ii–V–I · I–vi–ii–V · Round the circle (I IV vii° iii vi ii V I) | 2–3 | The progression Player through the keys (`/play/progression`, `walk`) | (its Player) |
| Technique | Five-finger position (`five-finger`) | 1 | 1-2-3-4-5-4-3-2 twice and home, major or minor | root, minor |
| | Hanon No. 1 (`hanon`) | 2 | The figure 1-3-4-5-6-5-4-3 a step higher each time for two octaves, the mirrored figure down, in any key | root |

**The arpeggio fingering rule** (`arpeggioFingering`, in `music/fingering.ts`): the thumb goes on one chord tone in
every octave, the first white key from the starting tone (the starting tone if all are black). The right hand counts
1, 2, 3 (4 in a 7th chord) up from each thumb, the third finger becoming 4 when it reaches over a 4th; its top note is
5 where a thumb would land. The left hand mirrors: 1 on each thumb, 2 below it, 4 (3 when the step from below is a
4th) below that, and 5 on its bottom note where a thumb would land. That is the taught fingering of every white-key
triad and 7th in every position (C: 1 2 3 1 2 3 5 and 5 4 2 1 4 2 1; C/G: 1 2 3 5 and 5 3 2 1).

**A scale over several octaves** (`scaleFingering` extended to `octaves`): the taught first and last fingers, the
continuing fingers between (B♭ major's middle B♭ is 4).

**A harmony segment** labels each passage with the chord it is over: a scale its tonic chord, the 6th-diminished
scale its 6th chord, a progression's line its chord. `spellPitchClass` (Wait mode's "Not C♯") reads its tones.

## 4. Practice's page (7.1)

Practice lists, in order: the trainers (§5, replacing "Theory quiz"), then **Exercises** by group, each group a
`RowGroup` of `RowLink`s (the exercise's name, its level as the detail, the group's tile), then the studies and
progressions. A row opens the exercise plainly (`OPEN_PLAINLY`), so it comes back as left. The links to the walk, the
chromatic walk and the progression Player open those Players with their exercise's params.

## 5. Trainers: what they are (7.2)

A **Trainer** asks a **round**, waits for an answer (keys tapped, typed or played on MIDI, or a choice), shows the
right answer beside the learner's, and moves on; a **run** is a fixed number of rounds. Every trainer has:

- **Levels** (its ladder, §6; each a fixed set of what it asks, so runs at a level compare) and, where it has choices,
  **Custom**. What a trainer asks is what the learner looks at, so it lives in the URL (`level`, Custom's own params)
  and the screen is remembered (ADR 0022); the Theory quiz's saved `QuizChoice` leaves the settings (`pt-settings`
  version 6 reads a version-5 save without it).
- **Rounds:** 10 (default), 20, or **until stopped** (`rounds=0`), in the URL.
- **Auto-next**, a saved switch in its sheet (`pt-settings` version 6, `trainer.autoNext`, off by default): a right
  answer moves on after a moment (`AUTO_NEXT_MS`, 900 ms); a wrong one waits, so the answer can be read.
- **A session summary** at the end of a run, or when the learner stops: accuracy, the average answer time (from
  the round shown to the answer given), the rounds missed (each with its answer), **Again** and **Done**.
- **Progress per trainer and level** in `pt-progress` (version 2): `trainers[trainerId:level]` = runs, the last and
  best accuracy, the best in-run streak. The quiz's one shared count (`quiz`: right, total, streak, best) has no
  trainer to belong to and is not carried over (version 1's answers, learned steps and practised pieces are). No
  daily streak, no points (PRODUCT.md).
- **Evidence:** Build chord, Name chord, Build scale and My gaps answer on a rated skill, as the quiz's did (ADR 0006);
  the ear, reading and key trainers rate nothing (a Skill stays a quiz-rated chord quality or scale kind).

**Where it lives:** `features/trainer` replaces `features/quiz`: the round machine (`round-machine.ts`, the quiz
machine grown by the new rounds), each trainer's draw and ladder (`trainers/*.ts`, with the trainer list in
`trainers.ts`), the run (`run.ts`: rounds, answers, times, streak, summary), `useTrainer` (audio, MIDI, evidence and
the clock), and the Check's plan (`check-plan.ts`, a fixed list of rounds). `widgets/trainer-board` replaces
`widgets/quiz-board` (one round: its prompt, keys, staff or sound, choices, and the answer) with the summary beside
it; `widgets/trainer-choice` replaces `widgets/quiz-choice` (Custom's fields). `pages/trainer` at
`/practice/trainers/$trainerId` replaces `pages/theory-quiz` and its `/practice/quiz/$quiz`; the Check keeps its
screen over the same board.

## 6. The trainers (7.2)

| Trainer (id) | Asks | Answer | Ladder |
| --- | --- | --- | --- |
| Build chord (`build-chord`) | A chord symbol | Keys | The chords ladder (§6.1) |
| Name chord (`name-chord`) | A chord heard (block or arpeggio) | One of four names | The chords ladder |
| Build scale (`build-scale`) | A scale named | Keys | Major → minors → modes → blues and pentatonics → all |
| My gaps (`gaps`) | Gap skills first | Keys | None (it is its own list) |
| Intervals by ear (`intervals-by-ear`) | An interval heard up, down or together | One of the intervals asked | m2/M2/m3/M3 → + P4 P5 → + tritone, 6ths → all twelve up → down → together → compound |
| Chords by ear (`chords-by-ear`) | A chord heard | Its quality | Major/minor → + dim/aug → 7ths → all eight → all eight arpeggiated |
| Scales by ear (`scales-by-ear`) | A scale heard up or down | Its kind | Major/natural minor → + harmonic → + the modes |
| Reading notes (`reading-notes`) | A note on the staff | Its key | The notes ladder (§6.2) |
| Key signatures (`key-signatures`) | A key, or a signature on the staff | The count of ♯/♭, or the key | Up to 2 → up to 4 → all, majors → minors → both |
| The degrees of a key (`key-degrees`) | A key | Its degrees in order on the keys | C G F → up to 3 → all |
| A chord's role (`chord-role`) | The tonic, then a chord of the key | Its numeral | I IV V → + vi → + ii iii → all seven, major → minor |

### 6.1 The chords ladder (The Ultimate Piano's, roadmap §10.6)

Sixteen levels: the three main chords of C; all chords of C; 1st inversion in C; 2nd inversion in C; all positions in
C; the 7ths of C; the main chords of A minor (i, iv, V7); all chords of A minor (harmonic); the main chords of G and
F; all chords of G and F; all positions in G and F; major triads, all roots; minor triads, all roots; major and minor
in all positions; the 7ths (maj7, m7, 7) on all roots; diminished and augmented. Name chord asks the same chords by
ear (no inversion asked by ear before level 3).

### 6.2 The notes ladder

Fifteen levels: the three anchors (bass F, middle C, treble G); anchors everywhere (C, F, G in octaves 3–5); treble
five-finger (C4–G4); treble lines (E G B D F); treble spaces (F A C E); the treble clef (C4–G5); bass five-finger
(C3–G3); bass lines (G B D F A); bass spaces (A C E G); the bass clef (F2–B3); both staves (F2–G5); both, wider
(C2–C6); with accidentals (C4–B4); ledger lines; the full range (A0–C8). Custom: a range and accidentals on or off.

## 7. Not built now, and why

| Item (roadmap §10.6) | Why not yet |
| --- | --- |
| Reading chords (Clefs' chord trainer) | Needs a staff that engraves a chord with its key signature in a trainer; Reading notes builds the staff round first |
| The degrees of a song (an eighth-note count grid over a piece) | Needs a piece's sections played as a question and a beat grid: its own design |
| Progressions and Arpeggios as trainers | The exercises already play them with Wait mode, which is that trainer: Wait mode checks every note |
| Rhythm training (roadmap §12) | Not for this app now: an accompanist practises to the Player's click; rhythm reading waits for the editor's notation input (sub-project 9) |

## 8. Product record

When each part ships: PRODUCT.md (Practice's exercises and trainers), the glossary (Exercise, Trainer, Level ladder,
Round, Run, Session summary, Sequence, 6th-diminished scale, Drop 2, Shell, Guide tones), ADR 0024 (an exercise is a
rule that writes a Performance) and ADR 0025 (a trainer is a round machine with a ladder; its progress is saved per
trainer), CLAUDE.md's architecture, DESIGN.md's Practice.
