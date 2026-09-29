# Learn's lessons as worksheets — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Part 5.2 of sub-project 5, its engine: a lesson becomes a worksheet (a chord grid, a scale, an interval,
a line of notes on a staff, a quiz answered on the keys, links into the references), lessons are grouped by module
with Level and Category pop-ups on Learn, and a lesson page says its level and category. The Fundamentals module's
lessons are the next plan's (`2026-09-29-learn-fundamentals.md`).

**Architecture:** The lesson entity's blocks grow typed kinds whose notes are kernel values (`SpelledNote`, `Key`,
`ScaleKind`, `ChordQuality`), and whose symbols and note lines the catalog test reads. `shared/lib/schedule` gains
`noteLine` (a written line of notes in ticks) beside `scaleRun`; the kernel gains `parseNoteInOctave`.
`features/play-example` gains the scale and notes examples; `widgets/lesson-view` renders every block, keeps the one
open quiz in a pure reducer, and maps a lesson's link to its route. Learn's page groups lessons by module and filters
them from its URL.

**Tech Stack:** React 19, TypeScript 6 (strict), TanStack Router, i18next, VexFlow 5, Vitest 4 + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-29-learn-lessons-references-tools-design.md` (§4).

## Global Constraints

- FSD layers, lint-enforced: `app → pages → widgets → features → entities → shared`; `shared/lib/music` imports
  only itself; no package in the kernels.
- Strict TS, no `any`, no casts beyond `as const`; `import type` for types. `Midi` is branded: tests build keys with
  `midi(60)`.
- Every UI string in `en` and `ru`; a count after a colon; never `{{count}}` as a variable.
- Tests colocated, `globals: false`, Testing Library by role and name, a screen's test through `renderApp`.
- Semantic Tailwind only; one exported component per file; every Play turns into Stop (`usePlayback`); a lesson
  explains music, never a button (CODE_STYLE §10).
- `npx prettier --write <files touched>` only; verify with `npm run typecheck && npm run lint && npm run test`, and
  `npm run build` after routes change.
- Commit on `main`, each message ending `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- **Toggling a key after a verdict** in a lesson quiz: the learner fixes the answer and checks again; the verdict
  must clear. Pinned in Task 4's reducer test.
- **Opening a second quiz while one is open**: the first closes, its chosen keys leave the keyboard. Pinned in Task
  4's reducer test and Task 5's view test.
- **A quiz answer in another octave** (E minor played as E3 G3 B3): right, since a chord's notes are its pitch
  classes. Pinned in Task 4's `isRight` test.
- **A note line whose last bar is short** (`C4 D4 E4` in 4/4): the bar is written whole, the rest a rest, and it
  plays three notes. Pinned in Task 2's test.
- **A filter that leaves no lesson**: one line and a way back, never an empty page. Pinned in Task 6's page test.

---

### Task 1: A note with its octave, in the kernel

**Files:**
- Modify: `src/shared/lib/music/note.ts`, `src/shared/lib/music/note.test.ts`, `src/shared/lib/music/index.ts`

**Interfaces:**
- Produces: `parseNoteInOctave(text: string): { readonly note: SpelledNote; readonly midi: Midi } | null`.

- [ ] **Step 1: Write the failing test** — append to `src/shared/lib/music/note.test.ts` (import
  `parseNoteInOctave` from `'./note'`):

```ts
describe('parseNoteInOctave', () => {
  it('reads a note and its octave as scientific pitch writes them, middle C C4', () => {
    expect(parseNoteInOctave('C4')).toEqual({ note: note('C'), midi: 60 })
    expect(parseNoteInOctave('B♭3')).toEqual({ note: note('B', -1), midi: 58 })
    expect(parseNoteInOctave('F#5')).toEqual({ note: note('F', 1), midi: 78 })
    expect(parseNoteInOctave('Cb4')).toEqual({ note: note('C', -1), midi: 59 })
  })

  it('reads nothing without an octave or a note', () => {
    expect(parseNoteInOctave('E')).toBeNull()
    expect(parseNoteInOctave('H4')).toBeNull()
    expect(parseNoteInOctave('4')).toBeNull()
  })
})
```

- [ ] **Step 2: Run it:** `npx vitest run src/shared/lib/music/note.test.ts` — FAIL (`parseNoteInOctave` is not a
  function).

- [ ] **Step 3: Write it** — in `note.ts`, after `midiOf`:

```ts
/** A note with its octave, as scientific pitch writes it: `C4` is middle C, `B♭3` the key below A3's. */
export function parseNoteInOctave(
  text: string,
): { readonly note: SpelledNote; readonly midi: Midi } | null {
  const match = /^(.+?)(-?\d)$/.exec(text)
  const spelled = match?.[1] === undefined ? null : parseNoteName(match[1])
  if (!match || !spelled) return null
  return { note: spelled, midi: midiOf(spelled, Number(match[2])) }
}
```

and export it from `index.ts` beside `parseNoteName`.

- [ ] **Step 4: Run:** `npx vitest run src/shared/lib/music` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "Read a note with its octave, as scientific pitch writes it"`.

---

### Task 2: A line of notes in ticks

**Files:**
- Create: `src/shared/lib/schedule/note-line.ts`, `src/shared/lib/schedule/note-line.test.ts`
- Modify: `src/shared/lib/schedule/index.ts`

**Interfaces:**
- Consumes: `parseNoteInOctave` (Task 1).
- Produces: `NOTE_LINE_METERS` (`['2/4','3/4','4/4']`), `type NoteLineMeter`,
  `noteLine(text: string, options: { hand: Hand; meter: NoteLineMeter; key: Key }): TimedMusic` (throws a
  `RangeError` naming the token it cannot read).

- [ ] **Step 1: Write the failing test** — `src/shared/lib/schedule/note-line.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { noteLine } from './note-line'

const C_MAJOR = { tonic: note('C'), minor: false }
const timed = (text: string, meter: '2/4' | '3/4' | '4/4' = '4/4') =>
  noteLine(text, { hand: 'rh', meter, key: C_MAJOR }).notes.map((n) => [
    n.midi,
    n.startTick,
    n.durationTicks,
  ])

describe('noteLine', () => {
  it('writes each note a quarter note unless its value says otherwise', () => {
    expect(timed('C4 D4 E4 F4')).toEqual([
      [60, 0, 12],
      [62, 12, 12],
      [64, 24, 12],
      [65, 36, 12],
    ])
    expect(timed('G4/2 C5/8 C5/8 D5/4')).toEqual([
      [67, 0, 24],
      [72, 24, 6],
      [72, 30, 6],
      [74, 36, 12],
    ])
  })

  it('makes a dotted note half as long again', () => {
    expect(timed('C4/4. D4/8 E4/2')).toEqual([
      [60, 0, 18],
      [62, 18, 6],
      [64, 24, 24],
    ])
  })

  it('writes whole bars of its meter, a short last bar filled out', () => {
    const line = noteLine('C4 D4 E4', { hand: 'rh', meter: '4/4', key: C_MAJOR })
    expect(line.bars).toEqual([{ startTick: 0, beats: 4 }])
    const waltz = noteLine('C4 E4 G4 C5', { hand: 'rh', meter: '3/4', key: C_MAJOR })
    expect(waltz.bars).toEqual([
      { startTick: 0, beats: 3 },
      { startTick: 36, beats: 3 },
    ])
    expect(waltz.meter).toBe('3/4')
  })

  it('keeps each note’s spelling and hand, in the key it is written in', () => {
    const line = noteLine('F#3 B♭2/2', {
      hand: 'lh',
      meter: '4/4',
      key: { tonic: note('G'), minor: false },
    })
    expect(line.notes.map((n) => [n.spelled, n.hand])).toEqual([
      [note('F', 1), 'lh'],
      [note('B', -1), 'lh'],
    ])
    expect(line.key.tonic).toEqual(note('G'))
  })

  it('refuses what it cannot read', () => {
    expect(() => timed('X4')).toThrow(/X4/)
    expect(() => timed('C4/3')).toThrow(/C4\/3/)
    expect(() => timed('')).toThrow(RangeError)
  })
})
```

- [ ] **Step 2: Run:** `npx vitest run src/shared/lib/schedule/note-line.test.ts` — FAIL (cannot resolve).

- [ ] **Step 3: Write it** — `src/shared/lib/schedule/note-line.ts`:

```ts
import {
  beatsPerBar,
  parseNoteInOctave,
  TICKS_PER_BEAT,
  type Hand,
  type Key,
} from '@/shared/lib/music'
import type { TimedMusic, TimedNote } from '@/shared/lib/notation'

/** The meters a line of notes is written in: simple ones, whose beat is a quarter note. */
export const NOTE_LINE_METERS = ['2/4', '3/4', '4/4'] as const
export type NoteLineMeter = (typeof NOTE_LINE_METERS)[number]

/** A value's length in quarter notes: 1 a whole note, 8 an eighth. */
const QUARTERS = new Map([
  ['1', 4],
  ['2', 2],
  ['4', 1],
  ['8', 0.5],
])
const TOKEN = /^([^/]+)(?:\/(\d+)(\.?))?$/

/**
 * A line of notes as a lesson writes it, `E4 G4/2 B4/8.`: each note with its octave, then its value
 * after a slash (1 whole, 2 half, 4 quarter, 8 eighth; a quarter when left out) and a dot for half as
 * long again; in whole bars of its meter, one hand's, in a key.
 */
export function noteLine(
  text: string,
  options: { readonly hand: Hand; readonly meter: NoteLineMeter; readonly key: Key },
): TimedMusic {
  const tokens = text.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) throw new RangeError('A line of notes needs a note')
  const notes: TimedNote[] = []
  let tick = 0
  for (const token of tokens) {
    const [, name = '', value = '4', dot = ''] = TOKEN.exec(token) ?? []
    const read = parseNoteInOctave(name)
    const quarters = QUARTERS.get(value)
    if (!read || quarters === undefined) throw new RangeError(`Cannot read "${token}" as a note`)
    const length = quarters * TICKS_PER_BEAT * (dot ? 1.5 : 1)
    notes.push({
      midi: read.midi,
      spelled: read.note,
      hand: options.hand,
      startTick: tick,
      durationTicks: length,
      roll: 0,
    })
    tick += length
  }
  const beats = beatsPerBar(options.meter)
  const barTicks = beats * TICKS_PER_BEAT
  return {
    key: options.key,
    meter: options.meter,
    bars: Array.from({ length: Math.ceil(tick / barTicks) }, (_, bar) => ({
      startTick: bar * barTicks,
      beats,
    })),
    notes,
    chords: [],
  }
}
```

Export `NOTE_LINE_METERS`, `noteLine` and `type NoteLineMeter` from `src/shared/lib/schedule/index.ts`.

- [ ] **Step 4: Run:** `npx vitest run src/shared/lib/schedule` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "Write a lesson's line of notes in ticks: each note's octave, value and dot, in whole bars of its meter"`.

---

### Task 3: The scale and notes examples

**Files:**
- Create: `src/features/play-example/model/scale-example.ts`, `…/scale-example.test.ts`,
  `…/model/notes-example.ts`, `…/notes-example.test.ts`, `…/ui/ScaleExample.tsx`, `…/ui/NotesExample.tsx`
- Modify: `src/features/play-example/index.ts`, `src/shared/i18n/locales/{en,ru}/learn.ts`

**Interfaces:**
- Consumes: `noteLine`, `NoteLineMeter` (Task 2); `ShownKeys` (5.1).
- Produces: `scaleExample(root: SpelledNote, kind: ScaleKind): { shown: ShownKeys; music: TimedMusic }`,
  `notesShown(line: TimedMusic): ShownKeys`; `ScaleExample({ root: NoteParam, kind: ScaleKind, onShow })`,
  `NotesExample({ notes: string, clef: StaffId, meter: NoteLineMeter, keyParam: KeyParam, onShow })`. Strings:
  `learn:example.play`.

- [ ] **Step 1: Write the failing tests**

`src/features/play-example/model/scale-example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { scaleExample } from './scale-example'

describe('scaleExample', () => {
  it('shows the scale up an octave from its root, the tonic in its own colour', () => {
    const { shown } = scaleExample(note('D'), 'dorian')
    expect(shown.keys).toEqual([62, 64, 65, 67, 69, 71, 72, 74])
    expect(shown.marks.get(midi(62))).toEqual({ tone: 'tonic', label: '1' })
    expect(shown.marks.get(midi(65))).toEqual({ tone: 'scale', label: '♭3' })
    expect(shown.marks.get(midi(74))).toEqual({ tone: 'tonic', label: '1' })
  })

  it('runs it up and back in the scale’s key, one hand', () => {
    const { music } = scaleExample(note('D'), 'dorian')
    expect(music.notes.map((n) => n.midi)).toEqual([
      62, 64, 65, 67, 69, 71, 72, 74, 72, 71, 69, 67, 65, 64, 62,
    ])
    expect(music.key).toEqual({ tonic: note('C'), minor: false })
    expect(new Set(music.notes.map((n) => n.hand))).toEqual(new Set(['rh']))
  })
})
```

`src/features/play-example/model/notes-example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import { notesShown } from './notes-example'

describe('notesShown', () => {
  it('marks each key a line plays with its note’s name, once', () => {
    const line = noteLine('E4 G4 E4 B♭4', {
      hand: 'rh',
      meter: '4/4',
      key: { tonic: note('C'), minor: false },
    })
    const shown = notesShown(line)
    expect(shown.keys).toEqual([64, 67, 70])
    expect(shown.marks.get(midi(70))).toEqual({ tone: 'scale', label: 'B♭' })
  })
})
```

- [ ] **Step 2: Run:** `npx vitest run src/features/play-example` — FAIL (cannot resolve the two modules).

- [ ] **Step 3: Write the models, the examples and their word**

`src/features/play-example/model/scale-example.ts`:

```ts
import { placeScale, scaleKey, type ScaleKind, type SpelledNote } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import type { ShownKeys } from './shown'

/**
 * A scale as a lesson shows it: its keys up an octave from the root, each with its degree, the tonic
 * in its own colour; and its run up and back in even 8ths, one hand, in the key it is written in.
 */
export function scaleExample(
  root: SpelledNote,
  kind: ScaleKind,
): { readonly shown: ShownKeys; readonly music: TimedMusic } {
  const placed = placeScale(root, kind)
  return {
    shown: {
      keys: placed.map((key) => key.midi),
      marks: new Map(
        placed.map((key) => [
          key.midi,
          { tone: key.tone.role === 'root' ? 'tonic' : 'scale', label: key.tone.degree },
        ]),
      ),
    },
    music: scaleRun(placed, { rhythm: 'even', hands: 'rh', key: scaleKey(root, kind) }),
  }
}
```

`src/features/play-example/model/notes-example.ts`:

```ts
import { noteName, type Midi } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { KeyMark } from '@/shared/ui'
import type { ShownKeys } from './shown'

/** The keys a line of notes plays, each once, marked with its note's name as written. */
export function notesShown(line: TimedMusic): ShownKeys {
  const marks = new Map<Midi, KeyMark>()
  for (const n of line.notes) marks.set(n.midi, { tone: 'scale', label: noteName(n.spelled) })
  return { keys: [...marks.keys()].sort((a, b) => a - b), marks }
}
```

`src/features/play-example/ui/ScaleExample.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { noteFromParam, noteName, spellScale, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { scaleExample } from '../model/scale-example'
import type { ShownKeys } from '../model/shown'

/** The tempo a lesson's scale runs at, in quarter notes. */
const RUN_TEMPO = 96

/**
 * A scale in a lesson: its name, its notes with their degrees, its run up and back on one staff, and
 * Play, which runs it on the page's keys.
 */
export function ScaleExample({
  root,
  kind,
  onShow,
}: {
  root: NoteParam
  kind: ScaleKind
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const scaleName = useScaleName()
  const playback = usePlayback<'run'>()
  const tonic = useMemo(() => noteFromParam(root), [root])
  const example = useMemo(() => scaleExample(tonic, kind), [tonic, kind])
  const score = useMemo(() => notate(example.music), [example])
  return (
    <figure className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
      <figcaption className="font-display text-xl font-semibold">{scaleName(tonic, kind)}</figcaption>
      <ol className="flex flex-wrap gap-2">
        {spellScale(tonic, kind).map((tone) => (
          <li
            key={tone.degree}
            className="flex items-center gap-2 rounded-xl border border-border py-1 pr-3 pl-1"
          >
            <span
              className={cn(
                'grid size-7 place-items-center rounded-lg text-sm font-bold',
                tone.role === 'root' ? 'bg-key-tonic text-on-key-tonic' : 'bg-key-scale text-on-key-scale',
              )}
            >
              {tone.degree}
            </span>
            <span className="font-semibold">{noteName(tone.note)}</span>
          </li>
        ))}
      </ol>
      <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-none">
        <LazyScoreView score={score} scale={1} fingers={false} staff="treble" />
      </div>
      <Button
        variant="soft"
        className="self-start"
        onClick={() => {
          onShow(example.shown)
          playback.toggle('run', runSounds(example.music, RUN_TEMPO))
        }}
      >
        {playback.playing === 'run' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:example.play')
        )}
      </Button>
    </figure>
  )
}
```

`src/features/play-example/ui/NotesExample.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { notate, type StaffId } from '@/shared/lib/notation'
import { noteLine, runSounds, type NoteLineMeter } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { notesShown } from '../model/notes-example'
import type { ShownKeys } from '../model/shown'

/** The tempo a lesson's line of notes plays at: slow enough to read along. */
const LINE_TEMPO = 72
const HAND_OF: Readonly<Record<StaffId, 'rh' | 'lh'>> = { treble: 'rh', bass: 'lh' }

/** A line of notes to read, on the staff it is read on, and Play, which plays it on the page's keys. */
export function NotesExample({
  notes,
  clef,
  meter,
  keyParam,
  onShow,
}: {
  notes: string
  clef: StaffId
  meter: NoteLineMeter
  keyParam: KeyParam
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<'line'>()
  const line = useMemo(
    () => noteLine(notes, { hand: HAND_OF[clef], meter, key: keyFromParam(keyParam) }),
    [notes, clef, meter, keyParam],
  )
  const score = useMemo(() => notate(line), [line])
  return (
    <figure className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
      <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 scrollbar-none">
        <LazyScoreView score={score} scale={1} fingers={false} staff={clef} />
      </div>
      <Button
        variant="soft"
        className="self-start"
        onClick={() => {
          onShow(notesShown(line))
          playback.toggle('line', runSounds(line, LINE_TEMPO))
        }}
      >
        {playback.playing === 'line' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:example.play')
        )}
      </Button>
    </figure>
  )
}
```

`src/features/play-example/index.ts` adds `export { ScaleExample } from './ui/ScaleExample'` and
`export { NotesExample } from './ui/NotesExample'`.

`learn.ts` (en) adds `example: { play: 'Play' },`; (ru) `example: { play: 'Сыграть' },`.

- [ ] **Step 4: Run:** `npx vitest run src/features/play-example && npm run typecheck` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "Show a scale and a line of notes in a lesson: on a staff, played on the page's keys"`.

---

### Task 4: A lesson's blocks, quiz and links, as data and logic

**Files:**
- Modify: `src/entities/lesson/model/types.ts`, `src/entities/lesson/index.ts`,
  `src/entities/lesson/content/reading-chord-symbols.ts` (its module), `src/entities/lesson/content/catalog.test.ts`
- Modify: `src/widgets/lesson-view/model/chord-example.ts` (returns `ShownKeys`)
- Create: `src/widgets/lesson-view/model/chord-grid.ts`, `…/chord-grid.test.ts`, `…/model/lesson-quiz.ts`,
  `…/lesson-quiz.test.ts`

**Interfaces:**
- Produces (entity): `LESSON_MODULES` (`['fundamentals']`), `type LessonModule`, `LESSON_CATEGORIES` (adds
  `reading`, `rhythm`), `type QuizAnswer = { chord: string } | { notes: readonly string[] }`, `type LessonLink`
  (by `place`: `chords` + `chord`; `scales` + `root: SpelledNote`, `scale: ScaleKind`, `show?`; `keys` + `key:
  Key`; `intervals` + `root?`; `tensions` + `chord: TensionChord`, `root?`; `lesson` + `lesson: string`), the new
  `LessonBlock` kinds (`grid`, `scale`, `interval`, `notes`, `quiz`, `link`), `Lesson.module`.
- Produces (lesson-view model): `gridSymbols(quality): string[]`; `quizAnswer(answer): ShownKeys`,
  `isRight(chosen, answer): boolean`, `checkedKeys(chosen, answer)`, `quizReducer`, `type QuizState`,
  `type QuizEvent` (`open`, `toggle`, `check`, `reveal`, `retry`, `close`), `quizKeys(state, answer)`.

- [ ] **Step 1: Write the failing tests**

`src/widgets/lesson-view/model/chord-grid.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { gridSymbols } from './chord-grid'

describe('gridSymbols', () => {
  it('writes a quality on all twelve roots, each spelled by the kernel’s one rule', () => {
    expect(gridSymbols('maj')).toEqual(['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F#', 'G', 'A♭', 'A', 'B♭', 'B'])
    expect(gridSymbols('min')).toEqual([
      'Cm',
      'C#m',
      'Dm',
      'E♭m',
      'Em',
      'Fm',
      'F#m',
      'Gm',
      'G#m',
      'Am',
      'B♭m',
      'Bm',
    ])
  })
})
```

`src/widgets/lesson-view/model/lesson-quiz.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { checkedKeys, isRight, quizAnswer, quizKeys, quizReducer, type QuizState } from './lesson-quiz'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))
const E_MINOR = quizAnswer({ chord: 'Em' })

describe('quizAnswer', () => {
  it('places a chord answer as the Chords reference does, each tone by role', () => {
    expect(E_MINOR.keys).toEqual([64, 67, 71])
    expect(E_MINOR.marks.get(midi(67))).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('places notes from middle C up, each with its name', () => {
    const third = quizAnswer({ notes: ['F', 'A'] })
    expect(third.keys).toEqual([65, 69])
    expect(third.marks.get(midi(69))).toEqual({ tone: 'scale', label: 'A' })
  })
})

describe('isRight', () => {
  it('takes the answer’s notes in any octave, each at least once, and nothing else', () => {
    expect(isRight(keys(64, 67, 71), E_MINOR)).toBe(true)
    expect(isRight(keys(52, 55, 59, 64), E_MINOR)).toBe(true)
    expect(isRight(keys(64, 67), E_MINOR)).toBe(false)
    expect(isRight(keys(64, 67, 71, 74), E_MINOR)).toBe(false)
    expect(isRight([], E_MINOR)).toBe(false)
  })
})

describe('checkedKeys', () => {
  it('marks the right keys by role, the extra ones wrong, and rings the missing ones', () => {
    const checked = checkedKeys(keys(64, 68), E_MINOR)
    expect(checked.marks.get(midi(64))).toEqual({ tone: 'root', label: '1' })
    expect([...checked.wrong]).toEqual([68])
    expect([...checked.outlined]).toEqual([67, 71])
  })
})

describe('quizReducer', () => {
  const open = quizReducer(null, { type: 'open', id: '0.2' })

  it('opens one quiz at a time, with nothing chosen', () => {
    expect(open).toEqual({ id: '0.2', chosen: [], stage: 'choosing' })
    const moved = quizReducer(
      { id: '0.2', chosen: keys(64), stage: 'wrong' },
      { type: 'open', id: '1.0' },
    )
    expect(moved).toEqual({ id: '1.0', chosen: [], stage: 'choosing' })
  })

  it('toggles a key, and a change after a verdict clears it', () => {
    const one = quizReducer(open, { type: 'toggle', key: midi(64) })
    expect(one?.chosen).toEqual([64])
    expect(quizReducer(one, { type: 'toggle', key: midi(64) })?.chosen).toEqual([])
    const judged: QuizState = { id: '0.2', chosen: keys(64), stage: 'wrong' }
    expect(quizReducer(judged, { type: 'toggle', key: midi(67) })).toEqual({
      id: '0.2',
      chosen: [64, 67],
      stage: 'choosing',
    })
  })

  it('judges a check, shows the answer, and starts again', () => {
    const chosen: QuizState = { id: '0.2', chosen: keys(64), stage: 'choosing' }
    expect(quizReducer(chosen, { type: 'check', right: false })?.stage).toBe('wrong')
    expect(quizReducer(chosen, { type: 'check', right: true })?.stage).toBe('right')
    expect(quizReducer(chosen, { type: 'reveal' })?.stage).toBe('answer')
    expect(quizReducer({ id: '0.2', chosen: keys(64), stage: 'answer' }, { type: 'retry' })).toEqual(
      { id: '0.2', chosen: [], stage: 'choosing' },
    )
  })

  it('closes, when an example plays', () => {
    expect(quizReducer(open, { type: 'close' })).toBeNull()
  })

  it('ignores a key while the answer is shown, and anything when no quiz is open', () => {
    const shown: QuizState = { id: '0.2', chosen: [], stage: 'answer' }
    expect(quizReducer(shown, { type: 'toggle', key: midi(60) })).toBe(shown)
    expect(quizReducer(null, { type: 'check', right: true })).toBeNull()
  })
})

describe('quizKeys', () => {
  it('shows the chosen keys while choosing, the verdict after a check, the answer when shown', () => {
    expect(quizKeys({ id: 'q', chosen: keys(64), stage: 'choosing' }, E_MINOR).selected).toEqual(
      new Set([64]),
    )
    const wrong = quizKeys({ id: 'q', chosen: keys(64, 68), stage: 'wrong' }, E_MINOR)
    expect(wrong.wrong).toEqual(new Set([68]))
    expect(wrong.outlined).toEqual(new Set([67, 71]))
    expect(quizKeys({ id: 'q', chosen: [], stage: 'answer' }, E_MINOR).keys).toEqual([64, 67, 71])
  })
})
```

In `src/entities/lesson/content/catalog.test.ts`, replace the `texts` helper and the symbol test with checks over
every kind (import `parseChordSymbol`, `parseKey`, `parseNoteName` from `@/shared/lib/music` and `noteLine` from
`@/shared/lib/schedule`):

```ts
/** Every text a learner reads in a lesson. */
const texts = (lesson: Lesson) => [
  lesson.title,
  lesson.summary,
  ...lesson.sections.flatMap((section) => [
    section.heading,
    ...section.blocks.flatMap((block) => {
      switch (block.kind) {
        case 'text':
          return block.lead ? [block.lead, block.text] : [block.text]
        case 'note':
          return [block.text]
        case 'steps':
          return block.steps
        case 'quiz':
          return [block.ask]
        case 'link':
          return [block.title]
        default:
          return []
      }
    }),
  ]),
]

/** What in a block the kernel cannot read, or a link that leads nowhere. */
function problemsOf(block: LessonBlock): string[] {
  const unread = (read: () => unknown, what: string) => {
    try {
      return read() === null ? [what] : []
    } catch {
      return [what]
    }
  }
  switch (block.kind) {
    case 'chords':
      return block.symbols.flatMap((symbol) => unread(() => parseChordSymbol(symbol), symbol))
    case 'notes':
      return unread(
        () => noteLine(block.notes, { hand: 'rh', meter: block.meter ?? '4/4', key: block.key ?? C_MAJOR }),
        block.notes,
      )
    case 'quiz':
      return 'chord' in block.answer
        ? unread(() => parseChordSymbol(block.answer.chord), block.answer.chord)
        : block.answer.notes.flatMap((name) => unread(() => parseNoteName(name), name))
    case 'link':
      switch (block.target.place) {
        case 'chords':
          return unread(() => parseChordSymbol(block.target.chord), block.target.chord)
        case 'lesson':
          return lessonById(block.target.lesson) ? [] : [block.target.lesson]
        default:
          return []
      }
    default:
      return []
  }
}
```

with `const C_MAJOR = { tonic: note('C'), minor: false }` (import `note`) and the tests:

```ts
  it('give only examples, quizzes and links the kernel reads', () => {
    for (const lesson of LESSONS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) expect(problemsOf(block), lesson.id).toEqual([])
      }
    }
  })

  it('catch a symbol, a note line, an answer or a link they cannot read', () => {
    expect(problemsOf({ kind: 'chords', symbols: ['Cm', 'Cq'] })).toEqual(['Cq'])
    expect(problemsOf({ kind: 'notes', clef: 'treble', notes: 'C4 X9' })).toEqual(['C4 X9'])
    expect(
      problemsOf({ kind: 'quiz', ask: { en: 'a', ru: 'а' }, answer: { notes: ['F', 'H'] } }),
    ).toEqual(['H'])
    expect(
      problemsOf({
        kind: 'link',
        title: { en: 'a', ru: 'а' },
        target: { place: 'lesson', lesson: 'nowhere' },
      }),
    ).toEqual(['nowhere'])
  })

  it('each belong to a module, every module with a lesson', () => {
    for (const module of LESSON_MODULES) {
      expect(LESSONS.some((lesson) => lesson.module === module), module).toBe(true)
    }
  })
```

(Remove the old "give only chord examples the kernel reads" test; the new one covers it. `parseKey` is unused and
not imported: a `Key` in content is a value, already typed.)

- [ ] **Step 2: Run:** `npx vitest run src/widgets/lesson-view src/entities/lesson` — FAIL (the new modules are
  missing; the catalog test's `LESSON_MODULES` and block kinds do not exist).

- [ ] **Step 3: Write the types and the logic**

`src/entities/lesson/model/types.ts`:

```ts
import type { Level } from '@/entities/path'
import type { LocalText } from '@/shared/i18n'
import type {
  ChordQuality,
  Key,
  ReferenceInterval,
  ScaleKind,
  SpelledNote,
  TensionChord,
} from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import type { NoteLineMeter } from '@/shared/lib/schedule'

/** What a lesson teaches, as Learn filters lessons (roadmap §3.4, §10.7). */
export const LESSON_CATEGORIES = [
  'chords',
  'scales',
  'theory',
  'reading',
  'rhythm',
  'accompaniment',
  'jazz',
  'gospel',
] as const
export type LessonCategory = (typeof LESSON_CATEGORIES)[number]

/** Learn's groups of lessons, in the order they are listed (TJPS's shape, roadmap §10.7). */
export const LESSON_MODULES = ['fundamentals'] as const
export type LessonModule = (typeof LESSON_MODULES)[number]

/** What a lesson's quiz asks to be played: a chord's notes, or notes, in any octave. */
export type QuizAnswer = { readonly chord: string } | { readonly notes: readonly string[] }

/** Where a lesson's link leads, by what it names; the lesson view makes it a route and its search. */
export type LessonLink =
  | { readonly place: 'chords'; readonly chord: string }
  | {
      readonly place: 'scales'
      readonly root: SpelledNote
      readonly scale: ScaleKind
      readonly show?: 'scale' | 'chords'
    }
  | { readonly place: 'keys'; readonly key: Key }
  | { readonly place: 'intervals'; readonly root?: SpelledNote }
  | { readonly place: 'tensions'; readonly chord: TensionChord; readonly root?: SpelledNote }
  | { readonly place: 'lesson'; readonly lesson: string }

/**
 * One part of a lesson's section: prose, numbered steps, a note to read; or an example that plays in
 * place (chords, one chord on all twelve roots, a scale, an interval, a line of notes on a staff); a
 * quiz answered on the keys; a link into a reference.
 */
export type LessonBlock =
  | { readonly kind: 'text'; readonly lead?: LocalText; readonly text: LocalText }
  | { readonly kind: 'steps'; readonly steps: readonly LocalText[] }
  | { readonly kind: 'note'; readonly text: LocalText }
  | { readonly kind: 'chords'; readonly symbols: readonly string[] }
  | { readonly kind: 'grid'; readonly quality: ChordQuality }
  | { readonly kind: 'scale'; readonly root: SpelledNote; readonly scale: ScaleKind }
  | { readonly kind: 'interval'; readonly root: SpelledNote; readonly interval: ReferenceInterval }
  | {
      readonly kind: 'notes'
      readonly clef: StaffId
      /** `E4 G4/2 B4/8.`: `noteLine`'s format. */
      readonly notes: string
      readonly meter?: NoteLineMeter
      /** The key its signature writes; C major (none) when left out. */
      readonly key?: Key
    }
  | { readonly kind: 'quiz'; readonly ask: LocalText; readonly answer: QuizAnswer }
  | { readonly kind: 'link'; readonly title: LocalText; readonly target: LessonLink }

export interface LessonSection {
  readonly heading: LocalText
  readonly blocks: readonly LessonBlock[]
}

/** A Learn page that teaches music, in both languages, with examples that play (content as code, ADR 0002). */
export interface Lesson {
  readonly id: string
  readonly title: LocalText
  readonly summary: LocalText
  /** On the Path's scale, so a lesson and a step say "Beginner" alike. */
  readonly level: Level
  readonly category: LessonCategory
  readonly module: LessonModule
  readonly sections: readonly LessonSection[]
}
```

`src/entities/lesson/index.ts` exports `LESSON_MODULES`, `type LessonLink`, `type LessonModule`,
`type QuizAnswer` beside the rest. `reading-chord-symbols.ts` gains `module: 'fundamentals',` after `category`.

`src/widgets/lesson-view/model/chord-example.ts`: import `type ShownKeys` from `@/features/play-example`, drop the
`ChordExample` interface, and declare `placeExample(symbol: string): ShownKeys`.

`src/widgets/lesson-view/model/chord-grid.ts`:

```ts
import {
  chordRootSpelling,
  noteName,
  PITCH_CLASSES,
  qualityIntervals,
  qualitySuffix,
  type ChordQuality,
} from '@/shared/lib/music'

/** One quality on all twelve roots from C (Pianote's grid), each root spelled by the kernel's one rule. */
export const gridSymbols = (quality: ChordQuality): string[] =>
  PITCH_CLASSES.map(
    (pc) => noteName(chordRootSpelling(pc, qualityIntervals(quality))) + qualitySuffix(quality),
  )
```

`src/widgets/lesson-view/model/lesson-quiz.ts`:

```ts
import type { ShownKeys } from '@/features/play-example'
import type { QuizAnswer } from '@/entities/lesson'
import {
  MIDDLE_C,
  midi,
  noteName,
  parseNoteName,
  pitchClass,
  pitchClassOf,
  type Midi,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'
import { placeExample } from './chord-example'

/** A quiz's answer on the keys: a chord as the Chords reference places it, notes from middle C up. */
export function quizAnswer(answer: QuizAnswer): ShownKeys {
  if ('chord' in answer) return placeExample(answer.chord)
  const marks = new Map<Midi, KeyMark>()
  for (const name of answer.notes) {
    const spelled = parseNoteName(name)
    if (!spelled) throw new RangeError(`A quiz answers with "${name}", which is not a note`)
    marks.set(midi(MIDDLE_C + pitchClassOf(spelled)), { tone: 'scale', label: noteName(spelled) })
  }
  return { keys: [...marks.keys()].sort((a, b) => a - b), marks }
}

const pitchClasses = (keys: readonly Midi[]) => new Set(keys.map((key) => pitchClass(key)))

/** Right: every note of the answer chosen in some octave, and nothing else. */
export function isRight(chosen: readonly Midi[], answer: ShownKeys): boolean {
  const played = pitchClasses(chosen)
  const wanted = pitchClasses(answer.keys)
  return played.size === wanted.size && [...wanted].every((pc) => played.has(pc))
}

/** After Check: each right key marked as the answer marks its note, the extras wrong, the missing ringed. */
export function checkedKeys(
  chosen: readonly Midi[],
  answer: ShownKeys,
): { marks: Map<Midi, KeyMark>; wrong: Set<Midi>; outlined: Set<Midi> } {
  const byNote = new Map(answer.keys.map((key) => [pitchClass(key), answer.marks.get(key)]))
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  for (const key of chosen) {
    const mark = byNote.get(pitchClass(key))
    if (mark) marks.set(key, mark)
    else wrong.add(key)
  }
  const played = pitchClasses(chosen)
  return {
    marks,
    wrong,
    outlined: new Set(answer.keys.filter((key) => !played.has(pitchClass(key)))),
  }
}

/** The one open quiz of a lesson: its keys chosen, and where it stands. */
export type QuizState = {
  readonly id: string
  readonly chosen: readonly Midi[]
  readonly stage: 'choosing' | 'right' | 'wrong' | 'answer'
} | null

export type QuizEvent =
  | { readonly type: 'open'; readonly id: string }
  | { readonly type: 'toggle'; readonly key: Midi }
  | { readonly type: 'check'; readonly right: boolean }
  | { readonly type: 'reveal' }
  | { readonly type: 'retry' }
  | { readonly type: 'close' }

/** One quiz open at a time; a key chosen after a verdict takes the learner back to choosing. */
export function quizReducer(state: QuizState, event: QuizEvent): QuizState {
  if (event.type === 'open') return { id: event.id, chosen: [], stage: 'choosing' }
  if (event.type === 'close' || !state) return null
  switch (event.type) {
    case 'toggle':
      if (state.stage === 'answer') return state
      return {
        ...state,
        stage: 'choosing',
        chosen: state.chosen.includes(event.key)
          ? state.chosen.filter((key) => key !== event.key)
          : [...state.chosen, event.key],
      }
    case 'check':
      return { ...state, stage: event.right ? 'right' : 'wrong' }
    case 'reveal':
      return { ...state, stage: 'answer' }
    case 'retry':
      return { ...state, chosen: [], stage: 'choosing' }
  }
}

/** What the lesson's keyboard shows for its open quiz. */
export interface QuizKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly selected?: ReadonlySet<Midi>
  readonly wrong?: ReadonlySet<Midi>
  readonly outlined?: ReadonlySet<Midi>
}

/** Choosing: the chosen keys. After Check: the verdict on them. The answer shown: the answer. */
export function quizKeys(state: NonNullable<QuizState>, answer: ShownKeys): QuizKeys {
  switch (state.stage) {
    case 'choosing':
      return { keys: state.chosen, marks: new Map(), selected: new Set(state.chosen) }
    case 'right':
    case 'wrong': {
      const checked = checkedKeys(state.chosen, answer)
      return { keys: [...state.chosen, ...checked.outlined], ...checked }
    }
    case 'answer':
      return { keys: answer.keys, marks: answer.marks }
  }
}
```

- [ ] **Step 4: Run:** `npx vitest run src/widgets/lesson-view src/entities/lesson && npm run typecheck` — PASS (the
  old `LessonView` still compiles against `placeExample`'s new type: it reads `.keys` and `.marks`).

- [ ] **Step 5: Commit** — `git commit -m "Give a lesson its worksheet blocks, a quiz answered on the keys and links by name, all read by the catalog test"`.

---

### Task 5: The lesson view renders every block

**Files:**
- Modify: `src/features/live-keyboard/ui/ExplorerKeyboard.tsx` (`selected`, `wrong`)
- Modify: `src/widgets/lesson-view/ui/LessonView.tsx`, `…/ui/LessonBlock.tsx`, `…/ui/ChordExamples.tsx`
- Create: `src/widgets/lesson-view/ui/QuizBlock.tsx`, `…/ui/LessonLinkRow.tsx`
- Modify: `src/widgets/lesson-view/ui/LessonView.test.tsx`, `src/shared/i18n/locales/{en,ru}/learn.ts`

**Interfaces:**
- Consumes: Tasks 3 and 4.
- Produces: `ExplorerKeyboard` takes `selected?: ReadonlySet<Midi>` and `wrong?: ReadonlySet<Midi>` (and is
  `selectable` while `selected` is given). Strings `learn:quiz.*`.

- [ ] **Step 1: Write the failing test** — in `LessonView.test.tsx`, keep the four tests and add, with a fixture
  lesson that uses every new kind (import `note` from `@/shared/lib/music`, `type Lesson` from
  `@/entities/lesson`, and build `renderLesson(lesson)` from the file's helper by giving it a `lesson` parameter):

```tsx
const WORKSHEET: Lesson = {
  id: 'worksheet',
  title: { en: 'A worksheet', ru: 'Листок' },
  summary: { en: 'Every block.', ru: 'Каждый блок.' },
  level: 1,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'Examples', ru: 'Примеры' },
      blocks: [
        { kind: 'grid', quality: 'min' },
        { kind: 'scale', root: note('D'), scale: 'dorian' },
        { kind: 'interval', root: note('C'), interval: 'M3' },
        { kind: 'notes', clef: 'bass', notes: 'G2 B2 D3 F3 A3' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        { kind: 'quiz', ask: { en: 'Play E minor.', ru: 'Сыграйте ми минор.' }, answer: { chord: 'Em' } },
        { kind: 'quiz', ask: { en: 'Play a major third above F.', ru: 'Большая терция от фа.' }, answer: { notes: ['F', 'A'] } },
        {
          kind: 'link',
          title: { en: 'D Dorian in Scales', ru: 'Ре дорийский в гаммах' },
          target: { place: 'scales', root: note('D'), scale: 'dorian' },
        },
        {
          kind: 'link',
          title: { en: 'Cm7 in Chords', ru: 'Cm7 в аккордах' },
          target: { place: 'chords', chord: 'Cm7' },
        },
      ],
    },
  ],
}

describe('LessonView’s worksheet', () => {
  it('plays a grid of one chord on all twelve roots', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    await user.click(screen.getByRole('button', { name: 'G#m' }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([68, 71, 75])
  })

  it('runs a scale and a line of notes on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    const dorian = screen.getByRole('figure', { name: 'D Dorian' })
    await user.click(within(dorian).getByRole('button', { name: 'Play' }))
    expect(notes(audio.played.at(-1)?.sounds ?? []).slice(0, 3)).toEqual([62, 64, 65])
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('♭3')
    const figures = screen.getAllByRole('figure')
    await user.click(within(figures.at(-1) ?? document.body).getByRole('button', { name: 'Play' }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([43, 47, 50, 53, 57])
  })

  it('answers a quiz on the keys: chosen, checked, fixed and right', async () => {
    const user = userEvent.setup()
    const { audio } = await renderLesson(WORKSHEET)
    const quiz = screen.getByRole('group', { name: 'Play E minor.' })
    await user.click(within(quiz).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'E4' }))
    await user.click(within(keyboard).getByRole('button', { name: 'G sharp 4' }))
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Not quite')
    await user.click(within(keyboard).getByRole('button', { name: 'G sharp 4' }))
    await user.click(within(keyboard).getByRole('button', { name: 'G4' }))
    await user.click(within(keyboard).getByRole('button', { name: 'B4' }))
    await user.click(within(quiz).getByRole('button', { name: 'Check' }))
    expect(within(quiz).getByRole('status')).toHaveTextContent('Right')
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([64, 67, 71])
  })

  it('shows a quiz’s answer, and opening another quiz closes the first', async () => {
    const user = userEvent.setup()
    await renderLesson(WORKSHEET)
    const first = screen.getByRole('group', { name: 'Play E minor.' })
    await user.click(within(first).getByRole('button', { name: 'Answer on the keys' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'C4' }))
    await user.click(within(first).getByRole('button', { name: 'Check' }))
    await user.click(within(first).getByRole('button', { name: 'Show the answer' }))
    expect(within(keyboard).getByRole('button', { name: 'G4' })).toHaveTextContent('♭3')
    const second = screen.getByRole('group', { name: 'Play a major third above F.' })
    await user.click(within(second).getByRole('button', { name: 'Answer on the keys' }))
    expect(within(first).getByRole('button', { name: 'Answer on the keys' })).toBeInTheDocument()
    expect(within(keyboard).getByRole('button', { name: 'G4' })).not.toHaveTextContent('♭3')
  })

})
```

The links need a router to build their `href`. Replace the file's `renderLesson()` with one that takes the lesson
and renders it as the one route of a memory router (the app's registered route types still check each `Link`):

```tsx
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'

async function renderLesson(lesson: Lesson = READING_CHORD_SYMBOLS) {
  const audio = createFakeAudio()
  const store = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <LessonView lesson={lesson} /> }),
    history: createMemoryHistory(),
  })
  render(
    <SettingsStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: createFakeMidi() }}>
        <RouterProvider router={router} />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  await screen.findByRole('group', { name: 'Keyboard' })
  return { audio }
}
```

with `const READING_CHORD_SYMBOLS = lessonById('reading-chord-symbols')` checked once at the top of the file (throw
if missing, as the helper does today), and every existing test awaiting it (`const { audio } = await
renderLesson()`); the worksheet tests call `await renderLesson(WORKSHEET)` in place of `renderLesson(WORKSHEET)`.
The links test checks each `href` loosely, since this router strips no default:

```tsx
  it('links into the references on what it names', async () => {
    await renderLesson(WORKSHEET)
    expect(screen.getByRole('link', { name: 'D Dorian in Scales' }).getAttribute('href')).toBe(
      '/learn/scales?root=D&kind=dorian',
    )
    const chords = screen.getByRole('link', { name: 'Cm7 in Chords' }).getAttribute('href') ?? ''
    expect(chords).toMatch(/^\/learn\/chords\?/)
    expect(chords).toMatch(/[?&]triad=min(&|$)/)
    expect(chords).toMatch(/[?&]size=7(&|$)/)
  })
```

(this replaces the sync links test in the block above).

- [ ] **Step 2: Run:** `npx vitest run src/widgets/lesson-view` — FAIL (the new blocks render nothing; no quiz
  group, no links).

- [ ] **Step 3: Write the view**

`ExplorerKeyboard.tsx`: add the props

```ts
  /** A lesson quiz's chosen keys: the keys become toggles. */
  selected?: ReadonlySet<Midi> | undefined
  /** A quiz answer's extra keys. */
  wrong?: ReadonlySet<Midi> | undefined
```

and pass `selectable={selected !== undefined}`, `selected={selected}` and `wrong={wrong}` to `LiveKeyboard`.

`ChordExamples.tsx`: its `onShow` takes `ShownKeys`; the button calls `onShow(example)` (the placed example).

`src/widgets/lesson-view/ui/LessonLinkRow.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  KeyboardMusic,
  Layers,
  Ruler,
} from 'lucide-react'
import type { LessonLink } from '@/entities/lesson'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { keyParam, noteParam, parseChordSymbol, qualityParams } from '@/shared/lib/music'
import { RowLink } from '@/shared/ui'

/** A row leading to what a lesson names, in the reference that shows it, with that reference's tile. */
export function LessonLinkRow({ title, target }: { title: LocalText; target: LessonLink }) {
  const locale = useLocale()
  const text = localText(title, locale)
  switch (target.place) {
    case 'chords': {
      const chord = parseChordSymbol(target.chord)
      return (
        <RowLink
          title={text}
          icon={KeyboardMusic}
          paint="sand"
          render={
            <Link
              to="/learn/chords"
              search={{ root: noteParam(chord.root), ...qualityParams(chord.quality) }}
            />
          }
        />
      )
    }
    case 'scales':
      return (
        <RowLink
          title={text}
          icon={ChartNoAxesColumnIncreasing}
          paint="sky"
          render={
            <Link
              to="/learn/scales"
              search={{
                root: noteParam(target.root),
                kind: target.scale,
                ...(target.show ? { show: target.show } : {}),
              }}
            />
          }
        />
      )
    case 'keys':
      return (
        <RowLink
          title={text}
          icon={CircleDot}
          paint="lilac"
          render={<Link to="/learn/keys" search={{ key: keyParam(target.key) }} />}
        />
      )
    case 'intervals':
      return (
        <RowLink
          title={text}
          icon={Ruler}
          paint="yellow"
          render={
            <Link
              to="/learn/intervals"
              search={target.root ? { root: noteParam(target.root) } : {}}
            />
          }
        />
      )
    case 'tensions':
      return (
        <RowLink
          title={text}
          icon={Layers}
          paint="grass"
          render={
            <Link
              to="/learn/tensions"
              search={{
                chord: target.chord,
                ...(target.root ? { root: noteParam(target.root) } : {}),
              }}
            />
          }
        />
      )
    case 'lesson':
      return (
        <RowLink
          title={text}
          icon={BookOpenText}
          paint="grass"
          render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: target.lesson }} />}
        />
      )
  }
}
```

`src/widgets/lesson-view/ui/QuizBlock.tsx`:

```tsx
import { Check, X } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
import type { QuizState } from '../model/lesson-quiz'

/**
 * A question answered on the lesson's keys (Pianote's pop quiz): Answer opens it, the keys tapped are
 * the answer, Check judges it; a wrong answer can be fixed or shown.
 */
export function QuizBlock({
  ask,
  stage,
  canCheck,
  onOpen,
  onCheck,
  onReveal,
  onRetry,
}: {
  ask: LocalText
  /** This quiz's stage, or `closed` while another is open or none is. */
  stage: NonNullable<QuizState>['stage'] | 'closed'
  canCheck: boolean
  onOpen: () => void
  onCheck: () => void
  onReveal: () => void
  onRetry: () => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4"
    >
      <p id={id} className="font-semibold">
        {localText(ask, locale)}
      </p>
      <p role="status" className="flex items-center gap-2 empty:hidden">
        {stage === 'right' ? (
          <>
            <Check aria-hidden className="size-5 text-learned" />
            {t('quiz.right')}
          </>
        ) : stage === 'wrong' ? (
          <>
            <X aria-hidden className="size-5 text-destructive" />
            {t('quiz.wrong')}
          </>
        ) : stage === 'answer' ? (
          t('quiz.shown')
        ) : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {stage === 'closed' ? (
          <Button variant="soft" onClick={onOpen}>
            {t('quiz.answer')}
          </Button>
        ) : stage === 'answer' ? (
          <Button variant="soft" onClick={onRetry}>
            {t('quiz.again')}
          </Button>
        ) : (
          <>
            <Button disabled={!canCheck} onClick={onCheck}>
              {t('quiz.check')}
            </Button>
            {stage === 'wrong' ? (
              <Button variant="soft" onClick={onReveal}>
                {t('quiz.show')}
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
```

`src/widgets/lesson-view/ui/LessonBlock.tsx` renders every kind that needs nothing from the view; `LessonView`
renders the quiz itself, since it owns the quiz's state. `LessonBlock`:

```tsx
import type { LessonBlock as Block } from '@/entities/lesson'
import { IntervalCard, NotesExample, ScaleExample, type ShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyParam, note, noteParam } from '@/shared/lib/music'
import { gridSymbols } from '../model/chord-grid'
import { ChordExamples } from './ChordExamples'
import { LessonLinkRow } from './LessonLinkRow'

const C_MAJOR = { tonic: note('C'), minor: false }

/**
 * One block of a lesson: prose with its bold lead, numbered steps, a note on sand, or an example that
 * plays on the lesson's keys, or a link into a reference. A quiz is the view's, which keeps its state.
 */
export function LessonBlock({
  block,
  onShow,
}: {
  block: Exclude<Block, { kind: 'quiz' }>
  onShow: (shown: ShownKeys) => void
}) {
  const locale = useLocale()
  switch (block.kind) {
    case 'text':
      return (
        <p>
          {block.lead ? <strong>{localText(block.lead, locale)} </strong> : null}
          {localText(block.text, locale)}
        </p>
      )
    case 'steps':
      return (
        <ol className="flex list-decimal flex-col gap-1 pl-5">
          {block.steps.map((step) => (
            <li key={step.en}>{localText(step, locale)}</li>
          ))}
        </ol>
      )
    case 'note':
      return <p className="rounded-3xl bg-muted p-4">{localText(block.text, locale)}</p>
    case 'chords':
      return <ChordExamples symbols={block.symbols} onShow={onShow} />
    case 'grid':
      return <ChordExamples symbols={gridSymbols(block.quality)} onShow={onShow} />
    case 'scale':
      return <ScaleExample root={noteParam(block.root)} kind={block.scale} onShow={onShow} />
    case 'interval':
      return <IntervalCard root={noteParam(block.root)} name={block.interval} onShow={onShow} />
    case 'notes':
      return (
        <NotesExample
          notes={block.notes}
          clef={block.clef}
          meter={block.meter ?? '4/4'}
          keyParam={keyParam(block.key ?? C_MAJOR)}
          onShow={onShow}
        />
      )
    case 'link':
      return (
        <ul className="rounded-3xl border border-border bg-card px-2">
          <li>
            <LessonLinkRow title={block.title} target={block.target} />
          </li>
        </ul>
      )
  }
}
```

`src/widgets/lesson-view/ui/LessonView.tsx`:

```tsx
import { useMemo, useReducer, useState } from 'react'
import type { Lesson } from '@/entities/lesson'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import type { ShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { isRight, quizAnswer, quizKeys, quizReducer } from '../model/lesson-quiz'
import { LessonBlock } from './LessonBlock'
import { QuizBlock } from './QuizBlock'

const NOTHING: ShownKeys = { keys: [], marks: new Map() }

/** Each quiz of a lesson by its place, `section.block`, with its answer on the keys. */
const answersOf = (lesson: Lesson): ReadonlyMap<string, ShownKeys> =>
  new Map(
    lesson.sections.flatMap((section, s) =>
      section.blocks.flatMap((block, b) =>
        block.kind === 'quiz' ? [[`${s}.${b}`, quizAnswer(block.answer)] as const] : [],
      ),
    ),
  )

/**
 * A lesson read top to bottom under a pinned keyboard: it shows the example played last, or the open
 * quiz, whose answer the learner chooses on it.
 */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const locale = useLocale()
  const play = usePlay()
  const [shown, setShown] = useState<ShownKeys>(NOTHING)
  const [quiz, dispatch] = useReducer(quizReducer, null)
  const answers = useMemo(() => answersOf(lesson), [lesson])
  const answer = quiz ? answers.get(quiz.id) : undefined
  const keys = quiz && answer ? quizKeys(quiz, answer) : shown
  const choosing = quiz !== null && quiz.stage !== 'answer'
  // An example played closes the open quiz: the keys show the example.
  const show = (next: ShownKeys) => {
    dispatch({ type: 'close' })
    setShown(next)
  }
  return (
    <div className="flex flex-col gap-8">
      <ExplorerKeyboard
        keys={keys.keys}
        marks={keys.marks}
        selected={'selected' in keys ? keys.selected : undefined}
        wrong={'wrong' in keys ? keys.wrong : undefined}
        outlined={'outlined' in keys ? keys.outlined : undefined}
        onKeyPress={choosing ? (key) => dispatch({ type: 'toggle', key }) : undefined}
      />
      {lesson.sections.map((section, s) => (
        <section
          key={section.heading.en}
          className="flex max-w-prose flex-col gap-3 text-lg leading-relaxed"
        >
          <h2 className="text-2xl">{localText(section.heading, locale)}</h2>
          {section.blocks.map((block, b) => {
            const id = `${s}.${b}`
            if (block.kind !== 'quiz') return <LessonBlock key={id} block={block} onShow={show} />
            const open = quiz?.id === id ? quiz : null
            return (
              <QuizBlock
                key={id}
                ask={block.ask}
                stage={open ? open.stage : 'closed'}
                canCheck={(open?.chosen.length ?? 0) > 0}
                onOpen={() => dispatch({ type: 'open', id })}
                onCheck={() => {
                  const right = open !== null && isRight(open.chosen, quizAnswer(block.answer))
                  dispatch({ type: 'check', right })
                  if (right) play(chordSounds(open.chosen, { arpeggio: false }))
                }}
                onReveal={() => {
                  dispatch({ type: 'reveal' })
                  play(chordSounds(quizAnswer(block.answer).keys, { arpeggio: false }))
                }}
                onRetry={() => dispatch({ type: 'retry' })}
              />
            )
          })}
        </section>
      ))}
    </div>
  )
}
```

`learn.ts` (en) adds:

```ts
  quiz: {
    answer: 'Answer on the keys',
    check: 'Check',
    right: 'Right',
    wrong: 'Not quite',
    show: 'Show the answer',
    shown: 'The answer is on the keys',
    again: 'Try again',
  },
```

(ru):

```ts
  quiz: {
    answer: 'Ответить на клавишах',
    check: 'Проверить',
    right: 'Верно',
    wrong: 'Не совсем',
    show: 'Показать ответ',
    shown: 'Ответ на клавишах',
    again: 'Ещё раз',
  },
```

- [ ] **Step 4: Run:** `npx vitest run src/widgets/lesson-view src/features/live-keyboard && npm run typecheck && npm run lint` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "Render every block of a worksheet: grids, scales, intervals and lines of notes that play, quizzes answered on the keys, links into the references"`.

---

### Task 6: Learn lists lessons by module, filtered by level and category

**Files:**
- Create: `src/pages/learn/model/learn-filter.ts`, `src/pages/learn/model/lesson-groups.ts`,
  `src/pages/learn/model/lesson-groups.test.ts`, `src/pages/learn/index.ts` (adds the filter type)
- Modify: `src/pages/learn/ui/LearnPage.tsx`, `src/pages/learn/ui/LearnPage.test.tsx`
- Modify: `src/pages/lesson/ui/LessonPage.tsx`, `src/pages/lesson/ui/LessonPage.test.tsx`
- Modify: `src/app/routes/search.ts`, `src/app/routes/search.test.ts`, `src/app/router.tsx`
- Modify: `src/shared/i18n/locales/{en,ru}/learn.ts`

**Interfaces:**
- Produces: `LearnFilter { level: Level | 'any'; category: LessonCategory | 'any' }`,
  `lessonGroups(filter, lessons?): { module: LessonModule; lessons: Lesson[] }[]`, `LEARN_DEFAULTS`,
  `validateLearnSearch`.

- [ ] **Step 1: Write the failing tests**

`src/pages/learn/model/lesson-groups.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Lesson } from '@/entities/lesson'
import { lessonGroups } from './lesson-groups'

const lesson = (id: string, level: Lesson['level'], category: Lesson['category']): Lesson => ({
  id,
  title: { en: id, ru: id },
  summary: { en: id, ru: id },
  level,
  category,
  module: 'fundamentals',
  sections: [],
})
const LESSONS = [lesson('a', 1, 'chords'), lesson('b', 2, 'scales'), lesson('c', 1, 'scales')]

describe('lessonGroups', () => {
  it('groups every lesson under its module, in order, with no filter', () => {
    expect(
      lessonGroups({ level: 'any', category: 'any' }, LESSONS).map((group) => [
        group.module,
        group.lessons.map((each) => each.id),
      ]),
    ).toEqual([['fundamentals', ['a', 'b', 'c']]])
  })

  it('keeps the lessons of a level and a category', () => {
    expect(
      lessonGroups({ level: 1, category: 'scales' }, LESSONS).flatMap((group) =>
        group.lessons.map((each) => each.id),
      ),
    ).toEqual(['c'])
  })

  it('leaves out a module the filter empties', () => {
    expect(lessonGroups({ level: 4, category: 'any' }, LESSONS)).toEqual([])
  })
})
```

`LearnPage.test.tsx` — replace the first test's lessons check with the module group, and add:

```tsx
  it('lists the lessons under their module', async () => {
    await renderApp('/learn')
    const fundamentals = await screen.findByRole('region', { name: 'Fundamentals' })
    expect(
      within(fundamentals).getByRole('link', { name: 'How to read chord symbols Beginner · Chords' }),
    ).toHaveAttribute('href', '/learn/lessons/reading-chord-symbols')
  })

  it('filters the lessons by level and category, kept in the URL, and says when none match', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    await user.click(await screen.findByRole('combobox', { name: 'Category' }))
    await user.click(await screen.findByRole('option', { name: 'Chords' }))
    expect(router.state.location.search).toEqual({ category: 'chords' })
    expect(screen.getByRole('link', { name: /How to read chord symbols/ })).toBeInTheDocument()
    await router.navigate({ to: '/learn', search: { level: 4, category: 'chords' } })
    expect(await screen.findByText('No lessons match.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show every lesson' }))
    expect(router.state.location.search).toEqual({})
  })
```

(The first test's `region` named 'Lessons' becomes the check above; its references part stays.) `LessonPage.test.tsx`
adds `expect(screen.getByText('Beginner · Chords')).toBeInTheDocument()` to its first test. `search.test.ts` imports
`LEARN_DEFAULTS`, adds `expect(await searchAt('/learn')).toEqual(LEARN_DEFAULTS)` to the defaults test, and:

```ts
  it('keep a lesson filter’s level and category, and drop what no lesson has', async () => {
    expect(await searchAt('/learn?level=2&category=scales')).toEqual({ level: 2, category: 'scales' })
    expect(await searchAt('/learn?level=9&category=cooking')).toEqual(LEARN_DEFAULTS)
  })
```

- [ ] **Step 2: Run:** `npx vitest run src/pages/learn src/pages/lesson src/app/routes/search.test.ts` — FAIL.

- [ ] **Step 3: Write it**

`src/pages/learn/model/learn-filter.ts`:

```ts
import type { LessonCategory } from '@/entities/lesson'
import type { Level } from '@/entities/path'

/** What narrows Learn's lessons: a level, a category. */
export interface LearnFilter {
  readonly level: Level | 'any'
  readonly category: LessonCategory | 'any'
}
```

`src/pages/learn/model/lesson-groups.ts`:

```ts
import { LESSON_MODULES, LESSONS, type Lesson, type LessonModule } from '@/entities/lesson'
import type { LearnFilter } from './learn-filter'

/** The lessons a filter keeps, under their modules in order; a module it empties is left out. */
export function lessonGroups(
  filter: LearnFilter,
  lessons: readonly Lesson[] = LESSONS,
): { readonly module: LessonModule; readonly lessons: readonly Lesson[] }[] {
  const kept = lessons.filter(
    (lesson) =>
      (filter.level === 'any' || lesson.level === filter.level) &&
      (filter.category === 'any' || lesson.category === filter.category),
  )
  return LESSON_MODULES.map((module) => ({
    module,
    lessons: kept.filter((lesson) => lesson.module === module),
  })).filter((group) => group.lessons.length > 0)
}
```

`src/pages/learn/index.ts`:

```ts
export type { LearnFilter } from './model/learn-filter'
export { LearnPage } from './ui/LearnPage'
```

`search.ts` (import `type LearnFilter` from `@/pages/learn`, `LESSON_CATEGORIES` and `type LessonCategory` from
`@/entities/lesson`):

```ts
// Learn: its lessons' filter.
const isLessonCategory = isOneOf<LessonCategory | 'any'>([...LESSON_CATEGORIES, 'any'])
export const LEARN_DEFAULTS: LearnFilter = { level: 'any', category: 'any' }
export function validateLearnSearch(input: Input<LearnFilter>): LearnFilter {
  const raw: Raw = input
  return {
    level: valueOr(isLevel, raw.level, LEARN_DEFAULTS.level),
    category: valueOr(isLessonCategory, raw.category, LEARN_DEFAULTS.category),
  }
}
```

`router.tsx`: `learnRoute` gains `validateSearch: validateLearnSearch` and
`search: { middlewares: [stripSearchParams(LEARN_DEFAULTS)] }`.

`LearnPage.tsx` — the lessons column becomes the pop-ups over the module groups:

```tsx
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import {
  BookOpenText,
  ChartNoAxesColumnIncreasing,
  CircleDot,
  KeyboardMusic,
  Layers,
  Ruler,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LESSON_CATEGORIES, LESSONS, type LessonCategory } from '@/entities/lesson'
import { LEVEL_NAME, LEVELS, type Level } from '@/entities/path'
import { localText, useLocale } from '@/shared/i18n'
import { Dropdown, RowGroup, RowLink, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import type { LearnFilter } from '../model/learn-filter'
import { lessonGroups } from '../model/lesson-groups'

/** The levels and categories Learn's lessons have: only those are worth choosing. */
const LESSON_LEVELS = LEVELS.filter((level) => LESSONS.some((lesson) => lesson.level === level))
const CATEGORIES = LESSON_CATEGORIES.filter((category) =>
  LESSONS.some((lesson) => lesson.category === category),
)

/** Learn: the lessons by module, filtered by level and category; the references to look things up in. */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const filter = useSearch({ from: '/shell/learn' })
  const navigate = useNavigate({ from: '/learn' })
  const set = (change: Partial<LearnFilter>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  const groups = lessonGroups(filter)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('learn:title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <Dropdown<Level | 'any'>
              label={t('learn:level')}
              value={filter.level}
              options={[
                { value: 'any', label: t('learn:any') },
                ...LESSON_LEVELS.map((level) => ({
                  value: level,
                  label: t(`common:levelName.${LEVEL_NAME[level]}`),
                })),
              ]}
              onChange={(level) => set({ level })}
            />
            <Dropdown<LessonCategory | 'any'>
              label={t('learn:categoryLabel')}
              value={filter.category}
              options={[
                { value: 'any', label: t('learn:any') },
                ...CATEGORIES.map((category) => ({
                  value: category,
                  label: t(`learn:category.${category}`),
                })),
              ]}
              onChange={(category) => set({ category })}
            />
          </div>
          {groups.length > 0 ? (
            groups.map((group) => (
              <RowGroup key={group.module} title={t(`learn:module.${group.module}`)}>
                {group.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <RowLink
                      title={localText(lesson.title, locale)}
                      detail={`${t(`common:levelName.${LEVEL_NAME[lesson.level]}`)} · ${t(`learn:category.${lesson.category}`)}`}
                      icon={BookOpenText}
                      paint="grass"
                      render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
                    />
                  </li>
                ))}
              </RowGroup>
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{t('learn:noLessons')}</EmptyTitle>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="soft" onClick={() => set({ level: 'any', category: 'any' })}>
                  {t('learn:everyLesson')}
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
        <RowGroup title={t('learn:references')}>{/* the five reference rows, as today */}</RowGroup>
      </div>
    </div>
  )
}
```

(Keep the five reference `<li>` rows exactly as they are today inside the References `RowGroup`.)

`LessonPage.tsx` — under the summary:

```tsx
      <p className="-mt-2 text-muted-foreground">
        {t(`common:levelName.${LEVEL_NAME[lesson.level]}`)} ·{' '}
        {t(`learn:category.${lesson.category}`)}
      </p>
```

(with `useTranslation(['common', 'learn'])` and `LEVEL_NAME` from `@/entities/path`; the text reads
"Beginner · Chords").

`learn.ts` (en) adds `level: 'Level', categoryLabel: 'Category', any: 'Any', module: { fundamentals: 'Fundamentals' },
noLessons: 'No lessons match.', everyLesson: 'Show every lesson',` and the categories `reading: 'Reading',
rhythm: 'Rhythm',`; (ru) `level: 'Уровень', categoryLabel: 'Раздел', any: 'Любой', module: { fundamentals:
'Основы' }, noLessons: 'Нет подходящих уроков.', everyLesson: 'Показать все уроки',` and `reading: 'Чтение нот',
rhythm: 'Ритм',`. The `lessons: 'Lessons'` string goes (nothing shows it any more).

- [ ] **Step 4: Run:** `npm run typecheck && npm run lint && npm run test && npm run build` — PASS.

- [ ] **Step 5: Commit** — `git commit -m "List Learn's lessons by module, filtered by level and category from the URL, and say each lesson's level and category"`.

---

### Task 7: Record the worksheet

**Files:**
- Create: `docs/adr/0018-a-lesson-is-a-worksheet.md`
- Modify: `docs/CONTENT.md` (a Lessons section), `docs/UBIQUITOUS_LANGUAGE.md` (Module; Lesson's blocks),
  `DESIGN.md` (the quiz block, a scale and a line of notes in a lesson), `CLAUDE.md` (lesson entity, lesson-view,
  play-example, `noteLine`, `parseNoteInOctave`)

- [ ] **Step 1: Write ADR 0018** — "A lesson is a worksheet": the blocks (kinds, what each shows and plays), links
  by name (never a route in content), one quiz open at a time answered on the keys with the Theory quiz's key faces,
  lessons by module with Level and Category from the URL, the Path's four levels kept for lessons, and what was
  decided against (a staff per chord example; a contents list).
- [ ] **Step 2: Write CONTENT.md's Lessons section** — a lesson file's shape (`Lesson`), each block kind with an
  example line of content, `noteLine`'s format (`E4 G4/2 B4/8.`), that notes are kernel values (`note('D')`, a `Key`
  object), a quiz's answer (a chord symbol or notes), a link's `place`, and that the catalog test reads every symbol,
  line, answer and link.
- [ ] **Step 3: Glossary, DESIGN.md, CLAUDE.md** — the glossary's **Lesson** row names its blocks; a **Module** row
  ("a group of lessons on Learn: Fundamentals; later Accompaniment, Gospel, Jazz"); **Quiz** (a lesson's) as "a
  question in a lesson answered on its keys; not the Theory quiz". DESIGN.md's Cards list gains **Quiz block** (card
  paper, its question in Onest 600, Answer on the keys as a soft button, then Check in honey, the verdict with a check
  in grass or a cross in crimson) and **Scale example / Line of notes** (a card with its staff, Play soft). CLAUDE.md
  names the new pieces where the architecture lists their slices.
- [ ] **Step 4: Check and commit** — `npx prettier --check docs CLAUDE.md DESIGN.md` then
  `git commit -m "Record the lesson as a worksheet: ADR 0018, CONTENT's lessons, the glossary, DESIGN and CLAUDE.md"`.
