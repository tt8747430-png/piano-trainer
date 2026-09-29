# Learn's Fundamentals module — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Part 5.2's content: the Fundamentals module's fourteen lessons (thirteen new, and *How to read chord
symbols*), in the spec's order, each a worksheet whose examples play.

**Architecture:** One file per lesson in `src/entities/lesson/content/`, listed in `content/index.ts` in Learn's
order; the catalog test holds the order, and reads every symbol, line, answer and link.

**Tech Stack:** TypeScript content as code (ADR 0002), Vitest.

**Spec:** `docs/superpowers/specs/2026-09-29-learn-lessons-references-tools-design.md` (§4.3); the roadmap's §9.1,
§9.5, §9.8 and §10.7 for sources.

## Global Constraints

- Every text in English and Russian (`LocalText`); note and chord names international (B, `#`, `♭`); Russian
  terms as Russian theory writes them (тон, полутон, трезвучие, обращение, ключевые знаки, квинтовый круг).
- A lesson teaches music, never a button (CODE_STYLE §10); short paragraphs; no text copied from a source (roadmap
  §4.4): written for the app from standard theory.
- **How this plan fixes content:** every value the kernel reads (symbols, note lines, quiz answers, links, scales,
  intervals, grids) is written here exactly; the prose of each `text`, `note` and `steps` block is written from the
  points listed, in both languages, at execution. The catalog test gates the rest.
- Levels on the Path's scale (1 Beginner, 2 Elementary); categories as listed; module `fundamentals`.
- `npx prettier --write` on the files touched; `npm run typecheck && npm run lint && npm run test` before each
  commit; commit on `main` with the co-author line.

## Review Focus

- **A quiz whose answer the learner cannot tell from the question** (an inversion asked for, but any octave
  accepted): no quiz asks for a bass note or a register; each asks for notes or a chord.
- **A line of notes that runs off the staff into many ledger lines**: lines stay within two ledger lines of their
  staff.
- **A chord symbol a lesson writes that the kernel names otherwise** (C2, Cadd9): written as the lesson writes it,
  as the chord examples already allow.

---

### Task 1: Fundamentals in order, and its first four lessons

**Files:** Create `finding-home.ts`, `reading-notes.ts`, `rhythm-and-meter.ts`, `whole-and-half-steps.ts` in
`src/entities/lesson/content/`; modify `content/index.ts` and `content/catalog.test.ts`.

- [ ] **Step 1: Write the failing test** — replace the catalog test's last test with:

```ts
  it('teach the fundamentals in order, from finding home to key signatures', () => {
    expect(
      LESSONS.filter((lesson) => lesson.module === 'fundamentals').map((lesson) => lesson.id),
    ).toEqual([
      'finding-home',
      'reading-notes',
      'rhythm-and-meter',
      'whole-and-half-steps',
      'major-scales',
      'chromatic-scale',
      'intervals',
      'triads',
      'seventh-chords',
      'reading-chord-symbols',
      'inversions',
      'minor-scales',
      'chord-family',
      'key-signatures',
    ])
  })

  it('start at the beginning: every fundamentals lesson a Beginner’s or an Elementary one', () => {
    for (const lesson of LESSONS) expect([1, 2], lesson.id).toContain(lesson.level)
  })
```

- [ ] **Step 2: Run:** `npx vitest run src/entities/lesson` — FAIL (only one lesson).

- [ ] **Step 3: Write the four lessons** (and list them in `content/index.ts` before *How to read chord symbols*;
  the next tasks insert theirs in the order above):

**`finding-home`** — "Finding your way on the keys" / «Как найти себя на клавиатуре»; summary: the black keys'
groups, the seven letters, middle C, five fingers. Level 1, `theory`.
1. *Twos and threes* — the black keys come in groups of two and three all along the piano; C is the white key just
   left of every two, F just left of every three. `notes` treble `C4/2 C5/2`.
2. *Seven letters* — the white keys are named A to G and start again; after G comes A. `notes` treble
   `C4 D4 E4 F4 G4 A4 B4 C5`.
3. *Middle C and the octave* — middle C is the C nearest the piano's middle, written C4; the next C up is C5, an
   octave: eight letters, twelve keys. `interval` C, `P8`.
4. *Five fingers* — fingers are numbered from the thumb, 1 to 5 in each hand; a relaxed five-finger position puts
   one finger on each of five white keys, the right thumb on middle C, the left little finger on the C below.
   `notes` treble `C4 D4 E4 F4 G4/1`; `notes` bass `C3 D3 E3 F3 G3/1`.
5. *Try it* — `quiz` "Play any F." `{ notes: ['F'] }`; `quiz` "Play every white key from C up to G."
   `{ notes: ['C', 'D', 'E', 'F', 'G'] }`.

**`reading-notes`** — "The staff and reading notes" / «Нотный стан и чтение нот»; summary: lines and spaces, the
treble and bass clefs, ledger lines, sharps and flats. Level 1, `reading`.
1. *Five lines, four spaces* — notes sit on lines and in spaces; each step up is the next letter and the next white
   key; higher on the staff, higher on the piano.
2. *The treble clef* — the G clef's curl wraps the second line, G above middle C; the lines are E G B D F, the
   spaces F A C E. `notes` treble `E4 G4 B4 D5 F5/1` and `F4 A4 C5 E5`.
3. *The bass clef* — the F clef's dots sit either side of the fourth line, the F below middle C; the lines are G B D
   F A, the spaces A C E G. `notes` bass `G2 B2 D3 F3 A3/1` and `A2 C3 E3 G3`.
4. *Middle C and ledger lines* — notes beyond the staff get short ledger lines of their own; middle C is on one,
   below the treble staff and above the bass. `notes` treble `B3 C4 D4/2`; `notes` bass `B3 C4 D4/2`.
5. *Sharps, flats and naturals* — a sharp raises a note to the next key up, a flat lowers it to the next key down, a
   natural cancels either; an accidental holds to the end of its bar. `notes` treble `F4 F#4 F4/2 B4 B♭4 B4/2`.
6. *Try it* — `quiz` "Play the note on the treble staff's middle line." `{ notes: ['B'] }`; `quiz` "Play the note in
   the bass staff's top space." `{ notes: ['G'] }`.

**`rhythm-and-meter`** — "Rhythm and meter" / «Ритм и размер»; summary: the beat, note values, time signatures,
counting. Level 1, `rhythm`.
1. *The beat* — music moves on a steady pulse; its speed is the tempo, in beats per minute.
2. *Note values* — a whole note lasts four beats, a half note two, a quarter note one, an eighth note half a beat; a
   dot adds half the note's own length. `notes` treble `C5/1 C5/2 C5/2 C5 C5 C5 C5 C5/8 C5/8 C5/8 C5/8 C5/8 C5/8
   C5/8 C5/8`.
3. *Time signatures* — the top number says how many beats a bar holds, the bottom which note gets a beat: 4/4 four
   quarter notes (most songs), 3/4 three (a waltz, many hymns), 2/4 two (a march). `notes` treble, meter `3/4`,
   `C4 E4 G4 C5/2.`; `notes` treble, meter `2/4`, `G4 G4 A4/2`.
4. *Counting* — count the beats aloud, "1 2 3 4"; eighths as "1 and 2 and"; a dotted quarter and an eighth as "1,
   (2) and". `notes` treble `G4/4. A4/8 B4/2`.
5. *Compound meters* (a `note`) — in 6/8 the beat is a dotted quarter, two to a bar, each split in three.

**`whole-and-half-steps`** — "Whole and half steps" / «Тоны и полутоны»; summary: the smallest step on the piano,
two of them, and names that share a key. Level 1, `theory`.
1. *The half step* — from any key to the very next one, black or white; E–F and B–C are the two half steps between
   white keys. `interval` E, `m2`.
2. *The whole step* — two half steps, with one key between: C–D, E–F♯. `interval` C, `M2`.
3. *Two names, one key* — C♯ and D♭ are the same key; which name it takes depends on the letter the music needs.
   `notes` treble `C#4/2 D♭4/2`.
4. *Try it* — `quiz` "Play E and the note a whole step above it." `{ notes: ['E', 'F#'] }`; `quiz` "Play B and the
   note a half step above it." `{ notes: ['B', 'C'] }`.

- [ ] **Step 4: Run:** `npx vitest run src/entities/lesson` — the order test still fails (ten lessons missing),
  every other test passes; that stays so until Task 3. Commit: `git commit -m "Write the first four Fundamentals lessons: the keys, the staff, rhythm, whole and half steps"`.

### Task 2: Scales, the chromatic scale, intervals, triads

**Files:** Create `major-scales.ts`, `chromatic-scale.ts`, `intervals.ts`, `triads.ts`; modify `content/index.ts`.

**`major-scales`** — "How major scales work" / «Как устроена мажорная гамма»; summary: the pattern of whole and half
steps, the same from any note, and its fingering. Level 1, `scales`.
1. *Whole, whole, half, whole, whole, whole, half* — a major scale climbs by this pattern from any note; from C it
   lands on white keys only. `scale` C `major`.
2. *The same pattern from G and F* — from G the pattern needs F♯, from F it needs B♭: each note keeps its own
   letter. `scale` G `major`; `scale` F `major`.
3. *Fingering C major* — right hand 1 2 3, the thumb passes under, 1 2 3 4 5; left hand 5 4 3 2 1, the 3rd finger
   crosses over, 3 2 1.
4. *Try it* — `quiz` "Play the notes of D major." `{ notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] }`; `link` "C
   major in Scales" → `{ place: 'scales', root: note('C'), scale: 'major' }`.

**`chromatic-scale`** — "The chromatic scale" / «Хроматическая гамма»; summary: every key in turn, how it is spelled,
and why it has no key. Level 1, `scales`.
1. *Every key in turn* — twelve half steps to the octave. `notes` treble `C4/8 C#4/8 D4/8 D#4/8 E4/8 F4/8 F#4/8 G4/8
   G#4/8 A4/8 A#4/8 B4/8 C5/2`.
2. *Sharps going up, flats coming down* — how it is usually written. `notes` treble `C5/8 B4/8 B♭4/8 A4/8 A♭4/8
   G4/8 G♭4/8 F4/8 E4/8 E♭4/8 D4/8 D♭4/8 C4/2`.
3. *Starting on any note* — it has no tonic, so it is "a chromatic scale starting on E", never "in E".
4. *Fingering* — the 3rd finger on every black key, the thumb on every white key, and 1 2 where two white keys meet
   (E–F, B–C).
5. *Try it* — `quiz` "Play the chromatic scale from E up to A." `{ notes: ['E', 'F', 'F#', 'G', 'G#', 'A'] }`.

**`intervals`** — "Intervals" / «Интервалы»; summary: counting letters and half steps, perfect intervals, consonance.
Level 1, `theory`.
1. *Letters and half steps* — an interval's number counts letters (C to E is C D E, a 3rd), its quality counts half
   steps (a major 3rd four, a minor 3rd three). `interval` C `m3`; `interval` C `M3`.
2. *Perfect intervals* — the unison, 4th, 5th and octave are perfect: one size each in the major scale. `interval` C
   `P5`.
3. *Consonance and dissonance* — perfect intervals sound hollow and stable, 3rds and 6ths warm, 2nds and 7ths tense.
   `interval` C `M6`; `interval` C `m2`.
4. *Try it* — `quiz` "Play D and the perfect 5th above it." `{ notes: ['D', 'A'] }`; `quiz` "Play A and the minor 3rd
   above it." `{ notes: ['A', 'C'] }`; `link` "Every interval" → `{ place: 'intervals' }`.

**`triads`** — "Triads" / «Трезвучия»; summary: three notes in thirds, and the four kinds. Level 1, `chords`.
1. *Three notes in thirds* — a triad stacks a 3rd and another 3rd on a root: root, 3rd, 5th; on white keys, every
   other key. `chords` `C`.
2. *Major and minor* — a major 3rd under a minor 3rd is major (1 3 5), a minor 3rd under a major 3rd minor (1 ♭3 5).
   `chords` `C`, `Cm`; `grid` `maj`; `grid` `min`.
3. *Diminished and augmented* — two minor 3rds make a diminished triad (1 ♭3 ♭5), two major 3rds an augmented one (1
   3 ♯5). `chords` `C°`, `C+`.
4. *Try it* — `quiz` "Play E major." `{ chord: 'E' }`; `quiz` "Play B diminished." `{ chord: 'B°' }`; `quiz` "Play
   F augmented." `{ chord: 'F+' }`.

- [ ] Run `npx vitest run src/entities/lesson` (every test but the order test passes); commit: `git commit -m "Write
  the Fundamentals lessons on major scales, the chromatic scale, intervals and triads"`.

### Task 3: Sevenths, inversions, minor scales, the key's chords, signatures

**Files:** Create `seventh-chords.ts`, `inversions.ts`, `minor-scales.ts`, `chord-family.ts`, `key-signatures.ts`;
modify `content/index.ts`.

**`seventh-chords`** — "Seventh chords" / «Септаккорды»; summary: a triad and a 7th, the five common kinds, and the
chord that leads home. Level 2, `chords`.
1. *A triad and a 7th* — one more 3rd on top: major 7th (1 3 5 7), dominant 7th (1 3 5 ♭7), minor 7th (1 ♭3 5 ♭7),
   half-diminished (1 ♭3 ♭5 ♭7), diminished 7th (1 ♭3 ♭5 𝄫7). `chords` `CMaj7`, `C7`, `Cm7`, `Cm7♭5`, `C°7`.
2. *The dominant 7th leads home* — G7's B rises to C and its F falls to E. `chords` `G7`, `C`.
3. *On every root* — `grid` `d7`; `grid` `m7`.
4. *Try it* — `quiz` "Play D7." `{ chord: 'D7' }`; `quiz` "Play Am7." `{ chord: 'Am7' }`; `link` "What a 7th chord
   takes" → `{ place: 'tensions', chord: 'd7' }`.

**`inversions`** — "Inversions" / «Обращения»; summary: which note is lowest, how a slash chord names it, and why
accompanists use them. Level 2, `chords`.
1. *Root position* — the root lowest: C E G. `chords` `C`.
2. *First inversion* — the 3rd lowest, E G C, written C/E. `chords` `C/E`.
3. *Second inversion* — the 5th lowest, G C E, written C/G. `chords` `C/G`.
4. *Moving smoothly* — from C to F, keep the shared C and move the others by step: C E G to C F A; inversions keep a
   hand close to where it is. `chords` `C`, `F/C`, `G/B`, `C`.
5. *Try it* — `quiz` "Play the notes of F major, in any inversion." `{ chord: 'F' }`; `link` "Inversions in Chords"
   → `{ place: 'chords', chord: 'C' }`.

**`minor-scales`** — "The minor scales" / «Минорные гаммы»; summary: natural, harmonic and melodic minor, and the
major key each shares its notes with. Level 2, `scales`.
1. *Natural minor* — whole, half, whole, whole, half, whole, whole: A minor has only white keys. `scale` A `natural`.
2. *Harmonic minor* — its 7th raised a half step leads up to the tonic, and leaves a step and a half between the 6th
   and 7th. `scale` A `harmonic`.
3. *Melodic minor* — its 6th and 7th raised going up; classical music comes down in natural minor, jazz keeps the
   raised notes both ways. `scale` A `melodic`.
4. *Relative keys* — every major key shares its notes with the minor key a minor 3rd below: C major and A minor.
   `link` "A minor in Keys" → `{ place: 'keys', key: { tonic: note('A'), minor: true } }`.
5. *Try it* — `quiz` "Play the notes of E natural minor." `{ notes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] }`.

**`chord-family`** — "The chord family of a key" / «Аккорды тональности»; summary: one scale, seven chords, their
numerals, and the three that carry most songs. Level 2, `chords`.
1. *One scale, seven chords* — a triad on each note of the scale, from the scale's notes only. `chords` `C`, `Dm`,
   `Em`, `F`, `G`, `Am`, `B°`.
2. *Roman numerals* — upper case major (I, IV, V), lower case minor (ii, iii, vi), ° diminished (vii°): the same in
   every major key. `chords` `G`, `Am`, `Bm`, `C`, `D`, `Em`, `F#°`.
3. *The primary chords* — I, IV and V between them hold every note of the scale; many hymns use little else.
   `chords` `C`, `F`, `G`.
4. *The key's 7th chords* — `chords` `CMaj7`, `Dm7`, `Em7`, `FMaj7`, `G7`, `Am7`, `Bm7♭5`.
5. *Try it* — `quiz` "Play the V chord of G major." `{ chord: 'D' }`; `quiz` "Play the ii chord of F major."
   `{ chord: 'Gm' }`; `link` "C major's chords in Scales" → `{ place: 'scales', root: note('C'), scale: 'major',
   show: 'chords' }`.

**`key-signatures`** — "Key signatures and the circle of fifths" / «Ключевые знаки и квинтовый круг»; summary: a key's
sharps or flats written once, their order, and the circle that orders the keys. Level 2, `theory`.
1. *Sharps or flats, once* — a key signature at the start of each line holds for every note of that letter. `notes`
   treble, key `{ tonic: note('D'), minor: false }`, `D4 E4 F#4 G4 A4 B4 C#5 D5`.
2. *The order of sharps* — F C G D A E B; a sharp key's tonic is a half step above its last sharp (F♯ C♯: D major).
3. *The order of flats* — B E A D G C F, the sharps backwards; a flat key's tonic is its second-last flat (B♭ E♭
   A♭: E♭ major); F major has one flat, B♭.
4. *The circle of fifths* — a 5th up adds a sharp, a 5th down a flat; each major key's relative minor sits beside
   it. `link` "The circle of fifths in Keys" → `{ place: 'keys', key: { tonic: note('C'), minor: false } }`.
5. *Try it* — `quiz` "Play the sharps of A major's signature." `{ notes: ['F#', 'C#', 'G#'] }`.

- [ ] **Run and commit:** `npx vitest run src/entities/lesson` — PASS, the order test included. Then the whole gate
  and `git commit -m "Write the Fundamentals lessons on 7th chords, inversions, minor scales, the key's chords and key
  signatures"`.

### Task 4: See it, and record it

- [ ] **Screens:** `npm run build`, then `vite preview` and headless Chrome screenshots of `/learn`,
  `/learn/lessons/reading-notes` and `/learn/lessons/triads` at a laptop's width and in a 390px frame; fix what
  reads wrong (a test first for anything that is behaviour).
- [ ] **Record:** PRODUCT.md's Learn (lessons as worksheets, the Fundamentals module), the roadmap's Built line
  (part 5.2: ADR 0018), and the lesson test in `src/pages/lesson/ui/LessonPage.test.tsx` opening a Fundamentals
  lesson whose quiz is answered through the app. Commit.
