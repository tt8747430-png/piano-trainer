# Notation and the Sheet-Music Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build sub-project 3: a notation kernel that writes any Performance as a Score, a VexFlow renderer, and the
Player rebuilt in Flowkey's shape around sheet music, with Wait mode, a loop, swing and speed training.

**Architecture:** Time and meter move into the music kernel; the arrangement engine keeps each note's written onset,
roll and spelling; a new pure kernel `shared/lib/notation` (fenced: imports only `music`) turns timed notes into a
Score; `shared/ui/score` engraves it with VexFlow 5 into SVG and hands its layout to HTML overlays; the widgets
`sheet-music` and `practice-player` build the Player's screen from any Performance; `pages/player` only turns a piece
into one.

**Tech Stack:** React 19, Vite 8, strict TypeScript 6, TanStack Router, Base UI via shadcn, Tailwind v4, zustand,
i18next, VexFlow 5 (`vexflow/core`), Bravura (`@vexflow-fonts/bravura`), Vitest 4 + Testing Library + jsdom 29.

**Spec:** `docs/superpowers/specs/2026-09-27-sheet-music-player-design.md` (read it first; this plan argues from it).

## Global Constraints

- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100. Format only touched files:
  `npx prettier --write <files>`; never `npm run format`.
- Strict TS: `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (`import type`), no `any`, no casts to silence types.
- Vitest `globals: false`: import `describe/it/expect/vi` from `vitest`.
- Every interface string in `en` and `ru`; Russian typed against English.
- FSD: import from your own layer or below; another slice only through its `index.ts`. `shared/lib/notation` imports
  only `shared/lib/music` and no package (lint, like `music` and `arrangement`).
- Semantic Tailwind utilities only, no arbitrary values; variants are lookup maps of full class strings; 44px targets.
- No saved store changes shape. No redirects or aliases for old names: `step` mode, `beatsPerBar`, the note grid and
  the chart strip are removed, not kept.
- Tempo range 20–160 BPM. Speed training: +5% of the piece's tempo per pass (at least 1 BPM), up to it. Swing: the
  off-beat 8th at two thirds of the beat, simple meters only.
- Dependencies: `vexflow` ^5.0.0 and `@vexflow-fonts/bravura` ^1.0.2 (latest stable). VexFlow loads only in the
  Player's chunk (`@/shared/ui/score`, never the kit barrel).
- Verify each task: `npm run typecheck && npm run lint && npm run test`; tasks that touch the router, dependencies,
  CSS or chunking also `npm run build`.
- Commit on `main` after each task, message ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A loop made for another arrangement** (`?loop=40-44` on a 12-bar piece, or a pattern change that keeps the URL's
   loop): no loop, no crash; a loop whose bars start no note is no loop. Pinned in Tasks 7 and 10.
2. **Changing the key, pattern, hands or loop while Listen plays with speed training:** the pass starts again from the
   cursor, inside the loop, at the chosen tempo. Pinned in Task 7.
3. **A hand with three overlapping lengths in one bar** (a held bass under a rolled chord and moving notes, or an
   off-grid tune): notation cuts or quantises in writing and never throws; every piece and every pattern in 4/4, 3/4
   and 12/8 notates and engraves. Pinned in Tasks 4 and 5.
4. **The music font fails to load** (offline before the precache): one line says so; Play, the keys and Wait mode still
   work. Pinned in Tasks 5 and 10.
5. **Wait mode with a MIDI keyboard around a loop:** a right answer at the loop's last beat group goes round to its
   first and keeps waiting; notes played while stopped only sound. Pinned in Task 7.

---

## File Structure

| File | Responsibility |
| ---- | -------------- |
| `src/shared/lib/music/time.ts` | `Tick`, `TICKS_PER_BEAT`, `METERS`, `Meter`, `beatsPerBar`, `isCompound`, `timeSignature`, `timeSignatureText` |
| `src/shared/lib/music/{note,key}.ts` | `writtenOctave`; `spellInKey` |
| `src/shared/lib/arrangement/{types,chord-context,arrange,figure,index}.ts` | `meter`; notes' `spelled` and `roll`; `tokenNotes` |
| `src/entities/piece/model/{types,beats,parse-chart,parse-progression,parse-melody}.ts` | meter from the kernel; the tune's spelling |
| `src/shared/lib/notation/{types,values,rhythm,voices,accidentals,notate,index}.ts` | the notation kernel |
| `src/shared/lib/schedule/{schedule,swing,loop,sounds}.ts` | roll, a pass's end, swing, the loop over a passage with per-pass tempo |
| `src/shared/ui/score/{ScoreView.tsx,engrave.ts,vexflow-notes.ts,music-font.ts,layout.ts,score.css,index.ts}` | the renderer |
| `src/shared/test/fonts.ts` | `stubFonts()` for jsdom |
| `src/features/practice/{practice-machine,use-practice,transport,loop,speed,note-names,marks}.ts` | Listen and Wait mode, the loop, speed training |
| `src/widgets/sheet-music/**` | `SheetMusic`: labels, cursor, bars, the loop's grips, following |
| `src/widgets/practice-player/**` | `PracticeView`, `usePracticePlayer`, `waitFeedback`, the screen and its controls |
| `src/widgets/player-setup/**` | the piece's setup: key, pattern, figures, chord size, melody |
| `src/pages/player/**` | a piece as a Performance, composed from the widgets |
| `src/app/routes/search.ts`, `src/styles/theme.css` | the Player's URL; the `player-screen` utility |
| `docs/**`, `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md` | the record |

---

### Task 1: Time and meter in the music kernel

**Files:**
- Create: `src/shared/lib/music/time.ts`, `src/shared/lib/music/time.test.ts`
- Modify: `src/shared/lib/music/index.ts`, `src/shared/lib/arrangement/{types,figure,arrange,index}.ts`,
  `src/shared/lib/arrangement/arrange.test.ts`, `src/shared/lib/schedule/schedule.ts`,
  `src/shared/lib/schedule/{schedule,loop,sounds}.test.ts`, `src/entities/piece/model/{types,beats,parse-chart,parse-progression}.ts`,
  `src/entities/piece/model/{types,beats,parse-chart,parse-progression}.test.ts`, `src/entities/piece/index.ts`,
  `src/features/practice/bar-columns.ts`, `src/features/practice/testing/performances.ts`,
  `src/widgets/chord-chart/ui/ChordChart.tsx`, `src/widgets/chord-chart/model/chart-sections.test.ts`,
  `src/pages/piece/ui/PieceView.tsx`, `src/pages/player/ui/PlayerPage.tsx`

**Interfaces:**
- Produces: from `@/shared/lib/music`: `type Tick = number`, `TICKS_PER_BEAT = 12`, `METERS`, `type Meter`,
  `beatsPerBar(meter): number`, `isCompound(meter): boolean`, `interface TimeSignature { count: number; unit: 4 | 8 | 16 }`,
  `timeSignature(beats, meter): TimeSignature`, `timeSignatureText(ts): string`. `Chart.meter: Meter` and
  `Performance.meter: Meter` replace `beatsPerBar`. `ChordChart` loses its `meter` prop.

- [ ] **Step 1: Write the failing test** — `src/shared/lib/music/time.test.ts`

```ts
import { describe, expect, it } from 'vitest'
import {
  beatsPerBar,
  isCompound,
  METERS,
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
} from './time'

describe('time', () => {
  it('counts twelve ticks a beat', () => {
    expect(TICKS_PER_BEAT).toBe(12)
  })

  it('counts compound meters in dotted quarters', () => {
    expect(METERS.map(beatsPerBar)).toEqual([2, 3, 4, 2, 4])
    expect(METERS.filter(isCompound)).toEqual(['6/8', '12/8'])
  })

  it('writes a bar as its time signature, in the meter’s own unit', () => {
    expect(timeSignature(4, '4/4')).toEqual({ count: 4, unit: 4 })
    expect(timeSignature(2, '4/4')).toEqual({ count: 2, unit: 4 })
    expect(timeSignature(1.5, '4/4')).toEqual({ count: 3, unit: 8 })
    expect(timeSignature(1.25, '3/4')).toEqual({ count: 5, unit: 16 })
    expect(timeSignature(4, '12/8')).toEqual({ count: 12, unit: 8 })
    expect(timeSignature(1, '6/8')).toEqual({ count: 3, unit: 8 })
    expect(timeSignatureText(timeSignature(3, '12/8'))).toBe('9/8')
  })

  it('refuses a bar no time signature writes', () => {
    expect(() => timeSignature(1 / 3, '4/4')).toThrow(RangeError)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/lib/music/time.test.ts`
Expected: FAIL, cannot resolve `./time`.

- [ ] **Step 3: Write `src/shared/lib/music/time.ts`**

```ts
/** The domain's unit of time: 12 per beat, so 16ths (3) and triplet 8ths (4) are whole. */
export type Tick = number
export const TICKS_PER_BEAT = 12

export const METERS = ['2/4', '3/4', '4/4', '6/8', '12/8'] as const
export type Meter = (typeof METERS)[number]

/** Compound meters count dotted quarters: 6/8 has two beats, 12/8 four. */
const BEATS_PER_BAR: Readonly<Record<Meter, number>> = {
  '2/4': 2,
  '3/4': 3,
  '4/4': 4,
  '6/8': 2,
  '12/8': 4,
}
export const beatsPerBar = (meter: Meter): number => BEATS_PER_BAR[meter]

/** A meter in eighths whose beat is a dotted quarter. */
export const isCompound = (meter: Meter): boolean => meter.endsWith('/8')

export interface TimeSignature {
  readonly count: number
  readonly unit: 4 | 8 | 16
}

const isWhole = (n: number) => Math.abs(n - Math.round(n)) < 1e-9

/** A bar of `beats` beats as a time signature writes it: quarters in x/4, eighths in x/8 or for half a beat. */
export function timeSignature(beats: number, meter: Meter): TimeSignature {
  if (!isCompound(meter) && Number.isInteger(beats)) return { count: beats, unit: 4 }
  const eighths = beats * (isCompound(meter) ? 3 : 2)
  if (isWhole(eighths)) return { count: Math.round(eighths), unit: 8 }
  if (isWhole(eighths * 2)) return { count: Math.round(eighths * 2), unit: 16 }
  throw new RangeError(`No time signature writes a bar of ${beats} beats in ${meter}`)
}

export const timeSignatureText = ({ count, unit }: TimeSignature): string => `${count}/${unit}`
```

Add to `src/shared/lib/music/index.ts`:

```ts
export {
  beatsPerBar,
  isCompound,
  METERS,
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
  type Meter,
  type Tick,
  type TimeSignature,
} from './time'
```

- [ ] **Step 4: Move every importer to the kernel's time**

- `src/shared/lib/arrangement/types.ts`: delete `export type Tick` and `export const TICKS_PER_BEAT`; import
  `type Meter, type Tick` from `@/shared/lib/music`. In `Chart`, replace `readonly beatsPerBar: number` with
  `readonly meter: Meter`; in `Performance`, the same.
- `src/shared/lib/arrangement/index.ts`: remove `TICKS_PER_BEAT` and `type Tick` from the re-export list.
- `src/shared/lib/arrangement/figure.ts`: `import { TICKS_PER_BEAT, type Finger } from '@/shared/lib/music'`.
- `src/shared/lib/arrangement/arrange.ts`: import `beatsPerBar, TICKS_PER_BEAT, type Tick` from `@/shared/lib/music`
  (drop them from `./types`). In `arrange`: `const barBeats = beatsPerBar(chart.meter)`, `const meterTicks = barBeats *
  TICKS_PER_BEAT`, pass `barBeats` where `chart.beatsPerBar` was passed to `playFigure`, and return `meter: chart.meter`
  in place of `beatsPerBar`.
- `src/shared/lib/arrangement/arrange.test.ts`: `chart(lines, { key = 'C', meter = '4/4' }: { key?: string; meter?: Meter } = {})`
  builds bars with `bar(text, beatsPerBar(meter))` and returns `{ key: parsedKey, meter, sections }`; the 3/4 and 2/4
  tests pass `{ meter: '3/4' }` and `{ meter: '2/4' }`.
- `src/shared/lib/schedule/schedule.ts`: import `beatsPerBar, TICKS_PER_BEAT, type Midi, type Tick` from
  `@/shared/lib/music` (and `type NoteHand, type Performance, type PerformanceNote` from arrangement); the count-in is
  `Array.from({ length: beatsPerBar(performance.meter) }, …)`.
- `src/shared/lib/schedule/{schedule,loop,sounds}.test.ts`: every test `Chart` literal says `meter: '4/4'` in place of
  `beatsPerBar: 4`.
- `src/entities/piece/model/types.ts`: delete `METERS`, `Meter`, `BEATS_PER_BAR` and `beatsPerBar`; import
  `type Meter` from `@/shared/lib/music` for `EntryCommon.meter`.
- `src/entities/piece/model/beats.ts`: delete `barLength`; `import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'`.
- `src/entities/piece/model/parse-chart.ts`: `import { beatsPerBar, … } from '@/shared/lib/music'`; the chart is
  `{ key: pieceKey(piece), meter: piece.meter, sections: … }`.
- `src/entities/piece/model/parse-progression.ts`: import `beatsPerBar, TICKS_PER_BEAT, type Tick` from
  `@/shared/lib/music`; return `{ key: pieceKey(piece), meter: piece.meter, sections: [{ lines }] }`.
- `src/entities/piece/index.ts`: remove `METERS`, `beatsPerBar`, `type Meter` and `barLength` from its exports.
- Tests: delete `describe('barLength')` from `beats.test.ts` and `describe('beatsPerBar')` from `types.test.ts` (both
  now in `time.test.ts`); in `parse-chart.test.ts` and `parse-progression.test.ts` expect `meter` where they expected
  `beatsPerBar`.
- `src/features/practice/bar-columns.ts`: `import { TICKS_PER_BEAT, type Finger } from '@/shared/lib/music'`.
- `src/features/practice/testing/performances.ts`: the chart says `meter: '4/4'`.
- `src/widgets/chord-chart/ui/ChordChart.tsx`: drop the `meter` prop; a bar's length note is
  `bar.beats === beatsPerBar(performance.meter) ? methods : [...methods, timeSignatureText(timeSignature(bar.beats, performance.meter))]`,
  imports from `@/shared/lib/music`. Remove `meter={piece.meter}` from `PieceView.tsx` and `PlayerPage.tsx`.
- `src/widgets/chord-chart/model/chart-sections.test.ts`: its Performance literal says `meter: '4/4'`.

- [ ] **Step 5: Verify**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS (`grep -rn "beatsPerBar:" src` finds only the table in `time.ts`). Note the entry chunk's
(`dist/assets/index-*.js`) size from the build's table: Task 10 holds the entry to it.

- [ ] **Step 6: Commit**

```bash
git add -A src
git commit -m "Keep time and meter in the music kernel, and say a chart's and a performance's meter

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: The Performance keeps its written onset, roll and spelling

**Files:**
- Modify: `src/shared/lib/music/{note,key,index}.ts`, `src/shared/lib/music/{note,key}.test.ts`,
  `src/shared/lib/arrangement/{types,chord-context,arrange}.ts`, `src/shared/lib/arrangement/arrange.test.ts`,
  `src/entities/piece/model/parse-melody.ts`, `src/entities/piece/model/parse-melody.test.ts`,
  `src/shared/lib/schedule/schedule.ts`, `src/shared/lib/schedule/schedule.test.ts`,
  `src/features/practice/{note-names,marks,bar-columns,index}.ts`, `src/features/practice/note-names.test.ts`

**Interfaces:**
- Consumes: Task 1's `Tick`, `Meter`.
- Produces: `writtenOctave(key: Midi, spelled: SpelledNote): number`; `spellInKey(pc: PitchClass, key: Key): SpelledNote`;
  `MelodyNote.spelled: SpelledNote`; `PerformanceNote.spelled: SpelledNote` and `PerformanceNote.roll: Tick` (written
  `startTick` and `durationTicks`); from `features/practice`: `playedNoteName(played: PerformanceNote): NoteName`
  (replaces `spellPerformedNote`), `spellPitchClass(performance, chord, pc): string`.

- [ ] **Step 1: Write the failing kernel tests**

Append to `src/shared/lib/music/note.test.ts`:

```ts
describe('writtenOctave', () => {
  it('writes a key in the octave of its letter', () => {
    expect(writtenOctave(midi(60), note('C'))).toBe(4)
    expect(writtenOctave(midi(60), note('B', 1))).toBe(3)
    expect(writtenOctave(midi(71), note('C', -1))).toBe(5)
    expect(writtenOctave(midi(62), note('C', 2))).toBe(4)
  })
})
```

Append to `src/shared/lib/music/key.test.ts`:

```ts
describe('spellInKey', () => {
  const major = (tonic: SpelledNote): Key => ({ tonic, minor: false })

  it('spells a note of the key as its scale does', () => {
    expect(spellInKey(6, major(note('D', -1)))).toEqual(note('G', -1))
    expect(spellInKey(10, major(note('F')))).toEqual(note('B', -1))
    expect(spellInKey(1, major(note('E')))).toEqual(note('C', 1))
  })

  it('spells a minor key’s raised 6th and 7th', () => {
    const aMinor: Key = { tonic: note('A'), minor: true }
    expect(spellInKey(8, aMinor)).toEqual(note('G', 1))
    expect(spellInKey(6, aMinor)).toEqual(note('F', 1))
  })

  it('spells a note outside the key plainly, in the key’s direction', () => {
    expect(spellInKey(6, major(note('C')))).toEqual(note('G', -1))
    expect(spellInKey(10, major(note('G')))).toEqual(note('A', 1))
  })
})
```

(Import `writtenOctave`, `spellInKey`, `type Key`, `type SpelledNote` where the files lack them.)

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/music/note.test.ts src/shared/lib/music/key.test.ts`
Expected: FAIL, `writtenOctave` and `spellInKey` are not exported.

- [ ] **Step 3: Implement them**

In `src/shared/lib/music/note.ts`, after `midiOf`:

```ts
/** The octave a key is written in under a spelling: B♯3 and C4 are both 60, C♭5 is 71. */
export const writtenOctave = (key: Midi, spelled: SpelledNote): number =>
  Math.floor((key - spelled.accidental) / 12) - 1
```

In `src/shared/lib/music/key.ts` (it may import `./scale`: `scale.ts` does not import `key.ts`):

```ts
import { spellScale } from './scale'

/**
 * A pitch class as a key spells it: the note of its scale (a minor key's raised 6th and 7th too),
 * else plainly, sharp in a sharp key and flat otherwise.
 */
export function spellInKey(pc: PitchClass, key: Key): SpelledNote {
  const tones = key.minor
    ? [...spellScale(key.tonic, 'natural'), ...spellScale(key.tonic, 'melodic')]
    : spellScale(key.tonic, 'major')
  return (
    tones.find((tone) => tone.pitchClass === pc)?.note ?? plainSpelling(pc, keyPrefersSharps(key))
  )
}
```

Export both from `src/shared/lib/music/index.ts` (`writtenOctave` with the note exports, `spellInKey` with the key
exports).

- [ ] **Step 4: Run the kernel tests**

Run: `npx vitest run src/shared/lib/music`
Expected: PASS.

- [ ] **Step 5: Write the failing arrangement tests**

In `src/shared/lib/arrangement/arrange.test.ts`:

- The `tune` helper spells what it is given: `const tune = (...notes: [number, number, number][]): Melody =>
  notes.map(([m, startTick, durationTicks]) => ({ midi: midi(m), spelled: plainSpelling(pitchClass(m), true),
  startTick, durationTicks }))` (import `plainSpelling`).
- In `plays a whole-note C over its root` every expected note gains `spelled` and `roll: 0`: the bass
  `{ midi: 36, spelled: C, hand: 'lh', startTick: 0, durationTicks: 48, roll: 0, velocity: 0.2, chord: 0 }`, the right
  hand's `spelled: C`, `note('E')`, `note('G')`.
- In `doubles the tune an octave up`, the expected notes are
  `{ midi: 76, spelled: note('E'), hand: 'melody', startTick: 0, durationTicks: 24, roll: 0, velocity: 0.15, chord: 0 }`
  and `{ midi: 74, spelled: note('D'), …, startTick: 24, … }`.
- Replace `rolls a chord one tick per note` with:

```ts
  it('rolls a chord: one written onset, each note sounding a tick after the one below', () => {
    const performance = arrange(chart([['C']]), {
      tonic: C,
      pattern: pattern('rolled', '0/16 T2~', '0/16 L1'),
    })
    expect(
      notesOf(performance, 'rh').map((n) => [n.startTick, n.durationTicks, n.roll]),
    ).toEqual([
      [0, 48, 0],
      [0, 48, 1],
      [0, 48, 2],
    ])
    expect(performance.beatGroups).toHaveLength(1)
  })

  it('spells chord tones as the chord, and other notes by letter steps from the root or bass', () => {
    const performance = arrange(chart([['G7']], { key: 'G' }), {
      tonic: note('G'),
      pattern: pattern('steps', '0/4 _7,4/4 _b7,8/4 _6,12/4 s1', '0/8 L3,8/8 L1'),
    })
    expect(notesOf(performance, 'rh').map((n) => n.spelled)).toEqual([
      note('F', 1),
      note('F'),
      note('E'),
      note('A'),
    ])
    expect(notesOf(performance, 'lh').map((n) => n.spelled)).toEqual([note('B'), note('G')])
  })

  it('spells the key’s triads from the key', () => {
    const performance = arrange(chart([['C']], { key: 'Ab' }), {
      tonic: note('A', -1),
      pattern: pattern('flow', '0/16 Kb', '0/16 L1'),
    })
    expect(new Set(notesOf(performance, 'rh').map((n) => n.spelled))).toEqual(
      new Set([note('D', -1), note('F'), note('A', -1)]),
    )
  })

  it('keeps the tune’s spelling, moved by the interval between the keys', () => {
    const sharp: Melody = [{ midi: midi(73), spelled: note('C', 1), startTick: 0, durationTicks: 48 }]
    const performance = arrange(chart([['A']], { key: 'D' }), {
      tonic: note('E', -1),
      pattern: BLOCK,
      melody: sharp,
      doubleMelody: true,
    })
    expect(notesOf(performance, 'melody')[0]).toMatchObject({ midi: 86, spelled: note('D') })
  })
```

(The last test: D to E♭ is a minor second up, so C♯5 becomes D5, sounding an octave up as the
doubled tune: 74 + 12.)

- [ ] **Step 6: Run them to see them fail**

Run: `npx vitest run src/shared/lib/arrangement`
Expected: FAIL (no `spelled`, `roll`; rolled notes at ticks 1 and 2).

- [ ] **Step 7: Give the Performance its written form**

`src/shared/lib/arrangement/types.ts`:

```ts
export interface MelodyNote {
  readonly midi: Midi
  /** As the melody writes it: C♯5 is C♯, never D♭. */
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
}
```

```ts
export interface PerformanceNote {
  readonly midi: Midi
  /** As it is written: a chord tone as its chord spells it, another note as its token or the key does. */
  readonly spelled: SpelledNote
  readonly hand: NoteHand
  readonly finger?: Finger
  /** Where it is written: a rolled chord's notes share their onset… */
  readonly startTick: Tick
  /** …and their written length. */
  readonly durationTicks: Tick
  /** How late it sounds after its onset: a rolled chord's notes a tick apart, 0 when struck. */
  readonly roll: Tick
  readonly velocity: number
  /** Index into Performance.chords: the chord this note was played for. */
  readonly chord: number
}
```

(Add `type SpelledNote` to its music import.)

`src/shared/lib/arrangement/chord-context.ts` — the context knows its spelled root, bass and tones, and a token
returns its keys with their spellings:

```ts
export interface ChordContext {
  // …the existing fields, and:
  /** The chord's tones as it spells them. */
  readonly tones: readonly Tone[]
  /** The root and the bass as the chord spells them. */
  readonly rootNote: SpelledNote
  readonly bassNote: SpelledNote
}

export interface ContextChord {
  readonly root: SpelledNote
  readonly bass: SpelledNote
  readonly tones: readonly Tone[]
}

export function chordContext(
  chord: ContextChord,
  previous: readonly Midi[] | null,
  key: Key,
): ChordContext {
  const rootPc = pitchClassOf(chord.root)
  const bassPc = pitchClassOf(chord.bass)
  const third = within(chord.tones[1]?.semitones, 4)
  const fifth = within(chord.tones[2]?.semitones, 7)
  const seventh = within(chord.tones.find((tone) => tone.role === '7th')?.semitones, 10)
  const root = midi(55 + pitchClass(rootPc - 7))
  const voiced = voiceLead(previous, rightHandPitchClasses(chord.tones))
  return {
    third,
    fifth,
    seventh,
    major: third === 4,
    minor: third === 3,
    pitchClasses: chord.tones.map((tone) => tone.pitchClass),
    root,
    bass: midi(bassPc + (bassPc >= 7 ? 24 : 36)),
    triad: [root, root + third, root + fifth].map(midi),
    voiced,
    key,
    tones: chord.tones,
    rootNote: chord.root,
    bassNote: chord.bass,
  }
}

/** A key a token plays, spelled as it is written. */
export interface TokenNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
}

/** Keys of the chord, each as the chord spells it (any other as the key does). */
export function spellInChord(context: ChordContext, keys: readonly number[]): TokenNote[] {
  return keys.map((key) => ({
    midi: midi(key),
    spelled:
      context.tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
      spellInKey(pitchClass(key), context.key),
  }))
}

/** A key some letters from a spelled note: its letter by the steps, its accidental by the key it is. */
const stepsFrom = (from: SpelledNote, steps: number, key: number): TokenNote => ({
  midi: midi(key),
  spelled: spellAbove(from, { steps, semitones: pitchClass(key - pitchClassOf(from)) }),
})

const KEY_TRIAD_ROOTS = {
  I: { steps: 0, semitones: 0 },
  IV: { steps: 3, semitones: 5 },
  V: { steps: 4, semitones: 7 },
} as const

/** The key's I, IV or V triad (minor I and IV in a minor key), voice-led from the chord, spelled from the key. */
function keyTriad(triad: keyof typeof KEY_TRIAD_ROOTS, context: ChordContext): TokenNote[] {
  const quality: ChordQuality = triad === 'V' || !context.key.minor ? 'maj' : 'min'
  const tones = spellChord(spellAbove(context.key.tonic, KEY_TRIAD_ROOTS[triad]), quality)
  return voiceLead(
    context.voiced,
    tones.map((tone) => tone.pitchClass),
  ).map((key) => ({
    midi: key,
    spelled:
      tones.find((tone) => tone.pitchClass === pitchClass(key))?.note ??
      spellInKey(pitchClass(key), context.key),
  }))
}

/** A figure token's keys against the chord being played, each spelled (§2.2). */
export function tokenNotes(token: FigureToken, context: ChordContext): TokenNote[] {
  switch (token.kind) {
    case 'chord':
      return spellInChord(context, context.voiced)
    case 'triad':
      return spellInChord(context, invert(context.triad, token.inversion))
    case 'triad-octave':
      return spellInChord(
        context,
        context.triad.map((m) => m + 12),
      )
    case 'upper-pair':
      return spellInChord(context, context.triad.slice(1))
    case 'voice': {
      const count = context.voiced.length
      const voice = context.voiced[token.index % count] ?? context.root
      return spellInChord(context, [voice + 12 * Math.floor(token.index / count)])
    }
    case 'key-triad':
      return keyTriad(token.triad, context)
    case 'bass-degree':
      return [
        stepsFrom(
          context.bassNote,
          token.degree - 1,
          context.bass + degreeAbove(token.degree, context),
        ),
      ]
    case 'scale-degree':
      return [
        stepsFrom(context.rootNote, token.degree, context.root + scaleStepAbove(token.degree, context)),
      ]
    case 'below-root':
      return [
        stepsFrom(context.rootNote, token.semitones === 3 ? -2 : -1, context.root - token.semitones),
      ]
    case 'chord-degree':
      return [
        stepsFrom(
          context.rootNote,
          token.degree - 1,
          context.root + degreeAbove(token.degree, context),
        ),
      ]
  }
}
```

Delete `tokenMidis` and the old `keyTriad`; the music imports gain `spellAbove`, `spellChord`, `spellInKey`,
`type SpelledNote` and lose `qualityIntervals`.

`src/shared/lib/arrangement/arrange.ts`:

- The context: `chordContext({ root: chord.root, bass: chord.bass ?? chord.root, tones }, previous, key)`.
- `playFigure`: `const played = event.tones.flatMap((tone) => tokenNotes(tone.token, context).map((sounded) => ({ ...sounded, finger: tone.finger })))`;
  each note is

```ts
      return {
        midi: p.midi,
        spelled: p.spelled,
        hand,
        ...(finger === undefined ? {} : { finger }),
        startTick: window.at + event.start - window.from,
        durationTicks: duration,
        roll: event.rolled ? i : 0,
        velocity: hand === 'lh' ? VELOCITY.left : event.accent ? VELOCITY.accent : VELOCITY.right,
        chord: window.chord,
      }
```

- `playTune`: the tune note is `{ midi: n.midi, spelled: n.spelled, hand: 'rh', roll: 0, velocity: VELOCITY.tune, ...at }`;
  the harmony under it is `spellInChord(context, harmonyUnder(n.midi, context)).map(({ midi: key, spelled }): PerformanceNote => ({ midi: key, spelled, hand: 'rh', roll: 0, velocity: VELOCITY.harmony, ...at }))`.
- The doubled tune: `{ midi: midi(n.midi + 12), spelled: n.spelled, hand: 'melody', startTick: n.startTick, durationTicks: n.durationTicks, roll: 0, velocity: VELOCITY.doubled, chord }`.
- `transposeMelody` keeps letters: `.map((n) => ({ ...n, midi: midi(n.midi + semitones), spelled: transposeNote(n.spelled, from, to) }))`.

`src/entities/piece/model/parse-melody.ts` keeps what it reads:

```ts
/** `C#5`: a note name and a one-digit octave, or null when that is no key on the keyboard. */
function readPitch(pitch: string): { midi: Midi; spelled: SpelledNote } | null {
  const written = /^(.+?)(\d)$/.exec(pitch)
  const spelled = written?.[1] ? parseNoteName(written[1]) : null
  if (!written || !spelled) return null
  try {
    return { midi: midiOf(spelled, Number(written[2])), spelled }
  } catch (error) {
    if (error instanceof RangeError) return null
    throw error
  }
}
```

and pushes `{ midi: pitch.midi, spelled: pitch.spelled, startTick: tick, durationTicks }` (with `const pitch =
token.startsWith('r/') ? null : readPitch(…)` as today's `midi`). Its test expects `spelled` on each note
(`C#5/1` → `note('C', 1)`).

- [ ] **Step 8: Sound the roll, and name notes by their spelling**

`src/shared/lib/schedule/schedule.ts`:

```ts
  const played: Sound[] = performance.notes
    .filter((n) => n.startTick >= fromTick && isAudible(n, hands))
    .map((n) => ({
      kind: 'note',
      midi: n.midi,
      at: at(n.startTick + n.roll),
      duration: Math.max(SHORTEST_NOTE, secondsFor(n.durationTicks - n.roll, tempo) * LEGATO),
      velocity: n.velocity,
    }))
```

and in `beatGroupSounds` each note is `{ kind: 'note', midi: n.midi, at: secondsFor(n.roll, tempo), duration:
Math.max(SHORTEST_ALONE, secondsFor(n.durationTicks - n.roll, tempo)), velocity: n.velocity }`. Add to
`schedule.test.ts`:

```ts
  it('sounds a rolled chord a tick apart from its written onset', () => {
    const rolled = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'rolled',
        rh: { kind: 'events', events: parseFigure('0/16 T~') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    const rh = notes(schedule(rolled, { tempo: 60, hands: audibleHands('rh') }).sounds)
    expect(rh.map((sound) => sound.at)).toEqual([0, 1 / 12, 2 / 12])
    expect(beatGroupSounds(rolled, 0, { tempo: 60, hands: audibleHands('rh') }).map((s) => s.at)).toEqual([
      0,
      1 / 12,
      2 / 12,
    ])
  })
```

(The `keeps a very short note audible` literal gains `spelled: note('C'), roll: 0`.)

`src/features/practice/note-names.ts`:

```ts
import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { noteName, spellInKey, writtenOctave, type PitchClass } from '@/shared/lib/music'

export interface NoteName {
  readonly name: string
  readonly octave: number
}

/** A played note's written name and octave: F♯4, B♯3. */
export const playedNoteName = (played: PerformanceNote): NoteName => ({
  name: noteName(played.spelled),
  octave: writtenOctave(played.midi, played.spelled),
})

export const noteLabel = ({ name, octave }: NoteName): string => `${name}${octave}`

/** A pitch class named as the chord it was played in spells it, else as the key does: Wait mode's "Not C#". */
export function spellPitchClass(performance: Performance, chord: number, pc: PitchClass): string {
  const tone = performance.chords[chord]?.tones.find((t) => t.pitchClass === pc)
  return noteName(tone?.note ?? spellInKey(pc, performance.key))
}
```

`marks.ts` labels with `playedNoteName(played).name`; `bar-columns.ts` with `noteLabel(playedNoteName(n))`;
`index.ts` exports `playedNoteName` in place of `spellPerformedNote`. `note-names.test.ts` tests `playedNoteName` on a
performance's notes (B♯3 from a C♯ major chord's 7th as written) and `spellPitchClass` inside and outside the chord.

- [ ] **Step 9: Verify**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add -A src
git commit -m "Keep each note's written onset, roll and spelling in the Performance, and sound the roll from it

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The notation kernel: the Score's types, note values and rhythm

**Files:**
- Create: `src/shared/lib/notation/{types,values,rhythm,index}.ts`, `src/shared/lib/notation/{values,rhythm}.test.ts`
- Modify: `eslint.config.js`, `src/app/architecture.test.ts`

**Interfaces:**
- Consumes: `Tick`, `TICKS_PER_BEAT`, `Meter`, `isCompound`, `TimeSignature` (Task 1).
- Produces (from `@/shared/lib/notation`): the spec §2.4 types (`NoteValue`, `Duration`, `TimedNote`, `TimedMusic`,
  `WrittenNote`, `NotesEvent`, `RestEvent`, `ScoreEvent`, `Stem`, `ScoreVoice`, `STAVES`, `StaffId`, `ChordMark`,
  `Measure`, `Score`); `ticksOf(duration, meter): number`; `valuesOf(meter, triplet): Duration[]`;
  `interface Span { start: Tick; end: Tick }`; `interface VoiceGrid { place(tick): Tick; isTriplet(tick): boolean }`;
  `voiceGrid(spans, meter): VoiceGrid`; `spellSpan(span, { meter, barTicks, grid }): { tick: Tick; duration: Duration }[]`.

- [ ] **Step 1: Fence the kernel** — `eslint.config.js`

```js
// The theory kernel, the notation kernel and the accompaniment engine sit inside shared, fenced tighter: every
// layer may use them, music imports only itself, notation only music, and arrangement only music.
const KERNEL = ['music', 'notation', 'arrangement']
```

with the rules

```js
  { from: { type: 'music' }, allow: [{ to: { type: 'music' } }] },
  { from: { type: 'notation' }, allow: [{ to: { type: 'music' } }, { to: { type: 'notation' } }] },
  { from: { type: 'arrangement' }, allow: [{ to: { type: 'music' } }, { to: { type: 'arrangement' } }] },
```

(arrangement no longer allowed notation: it never needed it), the element
`{ type: 'notation', pattern: 'src/shared/lib/notation' }` before `shared`, and the package ban's files
`'src/shared/lib/{music,notation,arrangement}/**/*.ts'` with the message "The music kernel, the notation kernel and
the arrangement engine import no package."

Append to `src/app/architecture.test.ts`:

```ts
describe('the notation kernel (eslint)', { timeout: 60_000 }, () => {
  it('lets notation import the music kernel', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/notation/example.ts',
      "import { TICKS_PER_BEAT } from '@/shared/lib/music'\nexport const example = TICKS_PER_BEAT\n",
    )
    expect(broken).not.toContain('boundaries/dependencies')
  })

  it.each(['@/shared/lib/arrangement', '@/shared/lib', '@/entities/piece'])(
    'refuses notation importing %s',
    async (source) => {
      const broken = await rulesBrokenBy(
        'src/shared/lib/notation/example.ts',
        `import * as outside from '${source}'\nexport const example = outside\n`,
      )
      expect(broken).toContain('boundaries/dependencies')
    },
  )

  it('refuses notation importing a package', async () => {
    const broken = await rulesBrokenBy(
      'src/shared/lib/notation/example.ts',
      "import { Stave } from 'vexflow/core'\nexport const example = Stave\n",
    )
    expect(broken).toContain('no-restricted-imports')
  })
})
```

- [ ] **Step 2: Write `src/shared/lib/notation/types.ts`**

```ts
import type {
  Accidental,
  Finger,
  Hand,
  Key,
  Meter,
  Midi,
  SpelledNote,
  Tick,
  TimeSignature,
} from '@/shared/lib/music'

/** A note value by its denominator: 1 a whole, 32 a 32nd. */
export type NoteValue = 1 | 2 | 4 | 8 | 16 | 32

export interface Duration {
  readonly value: NoteValue
  readonly dots: 0 | 1
  /** Three in the time of two: only in a triplet beat. */
  readonly triplet: boolean
}

/** A note on a timeline: what `notate` reads. A Performance's notes are these. */
export interface TimedNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly hand: Hand | 'melody'
  readonly startTick: Tick
  readonly durationTicks: Tick
  /** How late it sounds after its onset: a rolled chord's notes after the first. */
  readonly roll: Tick
  readonly finger?: Finger
}

/** Timed notes with their bars and chord symbols: a Performance is this. */
export interface TimedMusic {
  readonly key: Key
  readonly meter: Meter
  readonly bars: readonly { readonly startTick: Tick; readonly beats: number }[]
  readonly notes: readonly TimedNote[]
  readonly chords: readonly { readonly startTick: Tick; readonly symbol: string }[]
}

export interface WrittenNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  /** The octave it is written in: B♯3 is 60. */
  readonly octave: number
  /** The accidental printed before it; null when the key signature or the bar already says it. */
  readonly accidental: Accidental | null
  /** Tied to the same key's next note. */
  readonly tie: boolean
  readonly finger?: Finger
}

export interface NotesEvent {
  readonly kind: 'notes'
  readonly tick: Tick
  readonly duration: Duration
  readonly notes: readonly WrittenNote[]
  /** Rolled: a wavy line before it. */
  readonly rolled: boolean
}

export interface RestEvent {
  readonly kind: 'rest'
  readonly tick: Tick
  readonly duration: Duration
  /** A second voice's gap: it holds the time and is not printed. */
  readonly hidden: boolean
}

export type ScoreEvent = NotesEvent | RestEvent

export type Stem = 'auto' | 'up' | 'down'

/** A voice's events end to end across its bar. */
export interface ScoreVoice {
  readonly events: readonly ScoreEvent[]
  readonly stem: Stem
}

export const STAVES = ['treble', 'bass'] as const
export type StaffId = (typeof STAVES)[number]

export interface ChordMark {
  readonly tick: Tick
  readonly symbol: string
}

export interface Measure {
  readonly startTick: Tick
  readonly ticks: Tick
  readonly time: TimeSignature
  /** One or two voices on each staff. */
  readonly staves: Readonly<Record<StaffId, readonly ScoreVoice[]>>
  readonly chords: readonly ChordMark[]
}

/** Music as it is written: a grand staff's measures in a key and a meter. */
export interface Score {
  readonly key: Key
  readonly meter: Meter
  readonly measures: readonly Measure[]
}
```

- [ ] **Step 3: Write the failing tests**

`src/shared/lib/notation/values.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Meter } from '@/shared/lib/music'
import { ticksOf, valuesOf } from './values'

const ticks = (meter: Meter, triplet = false) =>
  valuesOf(meter, triplet).map((duration) => ticksOf(duration, meter))

describe('valuesOf', () => {
  it('writes x/4 from the dotted whole to the 16th', () => {
    expect(ticks('4/4')).toEqual([72, 48, 36, 24, 18, 12, 9, 6, 3])
  })

  it('writes a triplet beat in triplet values', () => {
    expect(ticks('3/4', true)).toEqual([32, 16, 8, 4, 2, 1])
  })

  it('writes x/8 from the dotted whole to the 32nd, and never in triplets', () => {
    expect(ticks('6/8')).toEqual([48, 32, 24, 16, 12, 8, 6, 4, 3, 2, 1])
    expect(valuesOf('12/8', true)).toEqual([])
  })
})

describe('ticksOf', () => {
  it('counts a value in the meter’s ticks', () => {
    expect(ticksOf({ value: 4, dots: 0, triplet: false }, '4/4')).toBe(12)
    expect(ticksOf({ value: 4, dots: 1, triplet: false }, '12/8')).toBe(12)
    expect(ticksOf({ value: 8, dots: 0, triplet: true }, '2/4')).toBe(4)
  })
})
```

`src/shared/lib/notation/rhythm.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Meter } from '@/shared/lib/music'
import { spellSpan, voiceGrid, type Span } from './rhythm'
import { ticksOf } from './values'

/** A span spelled among the voice's other spans: each piece's tick, length and whether it is a triplet. */
function spell(start: number, end: number, meter: Meter = '4/4', others: Span[] = [], barTicks = 48) {
  const grid = voiceGrid([{ start, end }, ...others], meter)
  return spellSpan({ start, end }, { meter, barTicks, grid }).map(({ tick, duration }) => [
    tick,
    ticksOf(duration, meter),
    duration.triplet,
  ])
}

describe('spellSpan in 4/4', () => {
  it('writes a whole bar as a whole note, and a dotted half from its start', () => {
    expect(spell(0, 48)).toEqual([[0, 48, false]])
    expect(spell(0, 36)).toEqual([[0, 36, false]])
  })

  it('shows the middle of the bar: a half from beat 2 is two tied quarters', () => {
    expect(spell(12, 36)).toEqual([
      [12, 12, false],
      [24, 12, false],
    ])
  })

  it('keeps a dotted quarter on a beat', () => {
    expect(spell(0, 18)).toEqual([[0, 18, false]])
  })

  it('shows the beat: an 8th across it is two tied 8ths', () => {
    expect(spell(6, 18)).toEqual([
      [6, 6, false],
      [12, 6, false],
    ])
  })

  it('keeps 16th-8th-16th inside a beat', () => {
    expect(spell(3, 9)).toEqual([[3, 6, false]])
  })

  it('ties a 16th into a dotted 8th across a beat', () => {
    expect(spell(9, 21)).toEqual([
      [9, 3, false],
      [12, 9, false],
    ])
  })
})

describe('spellSpan in 3/4 and in eighths', () => {
  it('writes a half from beat 2 of 3/4', () => {
    expect(spell(12, 36, '3/4', [], 36)).toEqual([[12, 24, false]])
  })

  it('writes 6/8 in dotted values, quarters and 8ths', () => {
    expect(spell(0, 24, '6/8', [], 24)).toEqual([[0, 24, false]])
    expect(spell(0, 8, '6/8', [], 24)).toEqual([[0, 8, false]])
    expect(spell(4, 12, '6/8', [], 24)).toEqual([[4, 8, false]])
  })

  it('writes a 16th-grid figure in 12/8 in dotted 8ths, and ties across the middle', () => {
    expect(spell(18, 24, '12/8')).toEqual([[18, 6, false]])
    expect(spell(12, 36, '12/8')).toEqual([
      [12, 12, false],
      [24, 12, false],
    ])
  })
})

describe('triplet beats', () => {
  it('writes a swung pair as a triplet quarter and a triplet 8th', () => {
    expect(spell(0, 8, '4/4', [{ start: 8, end: 12 }])).toEqual([[0, 8, true]])
    expect(spell(8, 12, '4/4', [{ start: 0, end: 8 }])).toEqual([[8, 4, true]])
  })

  it('ties a triplet 8th into the next beat', () => {
    expect(spell(8, 24, '4/4', [{ start: 0, end: 8 }])).toEqual([
      [8, 4, true],
      [12, 12, false],
    ])
  })
})

describe('voiceGrid', () => {
  it('finds a voice’s triplet beats', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: 8 },
        { start: 8, end: 24 },
      ],
      '4/4',
    )
    expect(grid.isTriplet(4)).toBe(true)
    expect(grid.isTriplet(12)).toBe(false)
  })

  it('moves a beat’s boundaries on neither grid to the nearest 3 ticks', () => {
    const grid = voiceGrid(
      [
        { start: 0, end: 5 },
        { start: 5, end: 12 },
      ],
      '4/4',
    )
    expect(grid.place(5)).toBe(6)
    expect(grid.place(12)).toBe(12)
    expect(grid.isTriplet(0)).toBe(false)
  })

  it('writes every tick of x/8 as it is', () => {
    const grid = voiceGrid([{ start: 0, end: 5 }], '6/8')
    expect(grid.place(5)).toBe(5)
    expect(grid.isTriplet(0)).toBe(false)
  })
})
```

- [ ] **Step 4: Run them to see them fail**

Run: `npx vitest run src/shared/lib/notation`
Expected: FAIL, cannot resolve `./values`, `./rhythm`.

- [ ] **Step 5: Write `src/shared/lib/notation/values.ts`**

```ts
import { isCompound, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { Duration, NoteValue } from './types'

const NOTE_VALUES: readonly NoteValue[] = [1, 2, 4, 8, 16, 32]

/** Ticks in an eighth: 6 when a quarter is the beat, 4 when a dotted quarter is (x/8). */
const eighthTicks = (meter: Meter): Tick =>
  isCompound(meter) ? TICKS_PER_BEAT / 3 : TICKS_PER_BEAT / 2

/** A value's length in the meter's ticks. */
export const ticksOf = (duration: Duration, meter: Meter): number =>
  (8 / duration.value) *
  eighthTicks(meter) *
  (duration.dots === 1 ? 1.5 : 1) *
  (duration.triplet ? 2 / 3 : 1)

/**
 * Every value the meter writes in whole ticks, longest first: plain and dotted; or, in a triplet
 * beat, the triplets (x/4 only).
 */
export function valuesOf(meter: Meter, triplet: boolean): Duration[] {
  if (triplet && isCompound(meter)) return []
  const durations: Duration[] = NOTE_VALUES.flatMap((value) =>
    triplet
      ? [{ value, dots: 0, triplet: true }]
      : [
          { value, dots: 1, triplet: false },
          { value, dots: 0, triplet: false },
        ],
  )
  return durations
    .filter((duration) => Number.isInteger(ticksOf(duration, meter)))
    .sort((a, b) => ticksOf(b, meter) - ticksOf(a, meter))
}
```

- [ ] **Step 6: Write `src/shared/lib/notation/rhythm.ts`**

```ts
import { isCompound, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { Duration } from './types'
import { ticksOf, valuesOf } from './values'

/** A stretch of a bar, in ticks from its start. */
export interface Span {
  readonly start: Tick
  readonly end: Tick
}

/** How a voice's beats are written: which are triplet beats, and where a boundary is written. */
export interface VoiceGrid {
  /** A boundary's written tick: itself, or the nearest 3 ticks in a beat on neither grid. */
  place(tick: Tick): Tick
  /** Whether the beat a tick lies in is written in triplets. */
  isTriplet(tick: Tick): boolean
}

const BEAT = TICKS_PER_BEAT
const beatOf = (tick: Tick) => Math.floor(tick / BEAT)

/**
 * A voice's grid from its spans: a beat whose inner boundaries all lie on the 3-tick grid is binary;
 * on the 2-tick grid, a triplet beat; on neither, its boundaries move to the nearest 3 ticks. In x/8
 * every tick is written as it is.
 */
export function voiceGrid(spans: readonly Span[], meter: Meter): VoiceGrid {
  if (isCompound(meter)) return { place: (tick) => tick, isTriplet: () => false }
  const inner = new Map<number, Tick[]>()
  for (const { start, end } of spans) {
    for (const tick of [start, end]) {
      if (tick % BEAT === 0) continue
      const beat = beatOf(tick)
      inner.set(beat, [...(inner.get(beat) ?? []), tick % BEAT])
    }
  }
  const triplets = new Set<number>()
  const offGrid = new Set<number>()
  for (const [beat, positions] of inner) {
    if (positions.every((at) => at % 3 === 0)) continue
    if (positions.every((at) => at % 2 === 0)) triplets.add(beat)
    else offGrid.add(beat)
  }
  return {
    place: (tick) => (offGrid.has(beatOf(tick)) ? Math.round(tick / 3) * 3 : tick),
    isTriplet: (tick) => triplets.has(beatOf(tick)),
  }
}

/**
 * Whether a value may be written at a tick (spec §2.4 step 5). A beat or longer starts on a beat and
 * ends on one, or half-way through one in x/4; in a four-beat bar it crosses the middle only from the
 * bar's start. Shorter lies inside one beat, starting on a multiple of half its undotted length.
 */
function allowed(
  at: Tick,
  duration: Duration,
  { meter, barTicks, end }: { meter: Meter; barTicks: Tick; end: Tick },
): boolean {
  const length = ticksOf(duration, meter)
  if (at + length > end) return false
  if (length >= BEAT) {
    const endsAt = (at + length) % BEAT
    const endsWell = endsAt === 0 || (!isCompound(meter) && endsAt === BEAT / 2)
    const middle = barTicks / 2
    const crossesMiddle =
      barTicks === 4 * BEAT && at !== 0 && at < middle && at + length > middle
    return at % BEAT === 0 && endsWell && !crossesMiddle
  }
  const beatStart = beatOf(at) * BEAT
  const undotted = duration.dots === 1 ? length / 1.5 : length
  return at + length <= beatStart + BEAT && (at - beatStart) % (undotted / 2) === 0
}

/** A span of a bar as values, longest first, each piece where it starts: a note's are tied, a gap's are rests. */
export function spellSpan(
  span: Span,
  { meter, barTicks, grid }: { meter: Meter; barTicks: Tick; grid: VoiceGrid },
): { tick: Tick; duration: Duration }[] {
  const pieces: { tick: Tick; duration: Duration }[] = []
  let at = span.start
  while (at < span.end) {
    const duration = valuesOf(meter, grid.isTriplet(at)).find((value) =>
      allowed(at, value, { meter, barTicks, end: span.end }),
    )
    if (!duration) throw new RangeError(`No value writes ${at}–${span.end} in ${meter}`)
    pieces.push({ tick: at, duration })
    at += ticksOf(duration, meter)
  }
  return pieces
}
```

(The `throw` is unreachable for spans on the grid `voiceGrid` places: the 16th, triplet 16th or 32nd always fits. It
guards a caller that skips the grid.)

`src/shared/lib/notation/index.ts` for now:

```ts
export { spellSpan, voiceGrid, type Span, type VoiceGrid } from './rhythm'
export {
  STAVES,
  type ChordMark,
  type Duration,
  type Measure,
  type NotesEvent,
  type NoteValue,
  type RestEvent,
  type Score,
  type ScoreEvent,
  type ScoreVoice,
  type StaffId,
  type Stem,
  type TimedMusic,
  type TimedNote,
  type WrittenNote,
} from './types'
export { ticksOf, valuesOf } from './values'
```

- [ ] **Step 7: Verify**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A src eslint.config.js
git commit -m "Start the notation kernel: the Score, a meter's note values, triplet beats and spelling a length

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The notation kernel: voices, accidentals and `notate`

**Files:**
- Create: `src/shared/lib/notation/{voices,accidentals,notate}.ts`, `src/shared/lib/notation/{voices,accidentals,notate}.test.ts`,
  `src/features/practice/notate-pieces.test.ts`
- Modify: `src/shared/lib/notation/index.ts`

**Interfaces:**
- Consumes: Task 3's rhythm; `writtenOctave`, `spellScale`, `timeSignature` (Tasks 1–2).
- Produces: `notate(music: TimedMusic): Score`; `interface BarNote`, `interface BarChord`, `interface VoiceChords`,
  `separateVoices(chords): VoiceChords[]`; `keyAccidentals(key)`, `printedAccidentals(notes, key)`.

- [ ] **Step 1: Write the failing tests**

`src/shared/lib/notation/voices.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { separateVoices, type BarChord } from './voices'

const chord = (hand: BarChord['hand'], start: number, end: number, ...keys: number[]): BarChord => ({
  hand,
  start,
  end,
  rolled: false,
  notes: keys.map((key) => ({
    midi: midi(key),
    spelled: note('C'),
    tiedFrom: false,
    tiedTo: false,
  })),
})
const starts = (voice: { chords: readonly BarChord[] }) => voice.chords.map((c) => [c.start, c.end])

describe('separateVoices', () => {
  it('keeps a hand’s chords that follow each other in one voice', () => {
    const voices = separateVoices([chord('rh', 0, 12, 60), chord('rh', 12, 48, 64)])
    expect(voices).toHaveLength(1)
    expect(voices[0]?.stem).toBe('auto')
  })

  it('opens a second voice for a held note, the higher voice’s stems up', () => {
    const voices = separateVoices([
      chord('lh', 0, 48, 36),
      chord('lh', 0, 12, 43),
      chord('lh', 12, 24, 43),
    ])
    expect(voices.map((v) => [v.stem, starts(v)])).toEqual([
      [
        'up',
        [
          [0, 12],
          [12, 24],
        ],
      ],
      ['down', [[0, 48]]],
    ])
  })

  it('puts the tune in the upper voice over the right hand', () => {
    const voices = separateVoices([chord('rh', 0, 48, 60, 64), chord('melody', 0, 24, 76)])
    expect(voices.map((v) => [v.stem, v.chords[0]?.hand])).toEqual([
      ['up', 'melody'],
      ['down', 'rh'],
    ])
  })

  it('cuts short the voice that frees first when a third would be needed', () => {
    const voices = separateVoices([
      chord('rh', 0, 48, 60),
      chord('rh', 0, 24, 67),
      chord('rh', 12, 36, 72),
    ])
    expect(voices).toHaveLength(2)
    expect(voices.flatMap(starts)).toEqual(
      expect.arrayContaining([
        [0, 12],
        [12, 36],
      ]),
    )
  })

  it('writes one hand’s chords of one onset and different lengths as one, the shorter', () => {
    const voices = separateVoices([
      chord('melody', 0, 48, 76),
      chord('rh', 0, 48, 60),
      chord('rh', 0, 12, 64),
    ])
    expect(voices[1]?.chords.map((c) => [c.start, c.end, c.notes.length])).toEqual([[0, 12, 2]])
  })
})
```

`src/shared/lib/notation/accidentals.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { note, type Key } from '@/shared/lib/music'
import { keyAccidentals, printedAccidentals } from './accidentals'

const G: Key = { tonic: note('G'), minor: false }
const at = (letter: 'F' | 'C', accidental: -1 | 0 | 1, continued = false) => ({
  spelled: note(letter, accidental),
  octave: 4,
  continued,
})

describe('keyAccidentals', () => {
  it('reads a key’s signature from its scale', () => {
    expect(keyAccidentals(G).get('F')).toBe(1)
    expect(keyAccidentals({ tonic: note('C'), minor: true }).get('E')).toBe(-1)
  })
})

describe('printedAccidentals', () => {
  it('prints what the signature and the bar do not say, a natural as 0', () => {
    expect(
      printedAccidentals([at('F', 1), at('F', 0), at('F', 0), at('F', 1), at('C', 1)], G),
    ).toEqual([null, 0, null, 1, 1])
  })

  it('prints nothing on a tied continuation, and lets it change nothing', () => {
    expect(printedAccidentals([at('F', 0, true), at('F', 0)], G)).toEqual([null, 0])
  })

  it('keeps each octave apart', () => {
    expect(
      printedAccidentals([at('C', 1), { spelled: note('C', 1), octave: 5, continued: false }], G),
    ).toEqual([1, 1])
  })
})
```

`src/shared/lib/notation/notate.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi, note, type SpelledNote } from '@/shared/lib/music'
import { notate } from './notate'
import type { NotesEvent, ScoreEvent, TimedMusic, TimedNote } from './types'
import { ticksOf } from './values'

const n = (
  key: number,
  spelled: SpelledNote,
  hand: TimedNote['hand'],
  startTick: number,
  durationTicks: number,
  extra: Partial<TimedNote> = {},
): TimedNote => ({ midi: midi(key), spelled, hand, startTick, durationTicks, roll: 0, ...extra })

const music = (notes: TimedNote[], extra: Partial<TimedMusic> = {}): TimedMusic => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  notes,
  chords: [{ startTick: 0, symbol: 'C' }],
  ...extra,
})

const shape = (events: readonly ScoreEvent[]) =>
  events.map((event) => [event.kind, event.tick, ticksOf(event.duration, '4/4')])
const notesOf = (event: ScoreEvent | undefined) => (event as NotesEvent | undefined)?.notes ?? []

describe('notate', () => {
  it('writes a bar of C on a grand staff, with its chord symbol and time signature', () => {
    const score = notate(
      music([
        n(60, note('C'), 'rh', 0, 48),
        n(64, note('E'), 'rh', 0, 48),
        n(48, note('C'), 'lh', 0, 48),
      ]),
    )
    const [measure] = score.measures
    expect(measure?.time).toEqual({ count: 4, unit: 4 })
    expect(measure?.chords).toEqual([{ tick: 0, symbol: 'C' }])
    expect(measure?.staves.treble.map((voice) => shape(voice.events))).toEqual([
      [['notes', 0, 48]],
    ])
    expect(notesOf(measure?.staves.treble[0]?.events[0]).map((w) => [w.octave, w.accidental])).toEqual([
      [4, null],
      [4, null],
    ])
    expect(measure?.staves.bass[0]?.events).toHaveLength(1)
  })

  it('rests where a voice is silent, and writes an empty staff as a whole-bar rest', () => {
    const score = notate(music([n(60, note('C'), 'rh', 12, 12)]))
    const [measure] = score.measures
    expect(shape(measure?.staves.treble[0]?.events ?? [])).toEqual([
      ['rest', 0, 12],
      ['notes', 12, 12],
      ['rest', 24, 24],
    ])
    expect(shape(measure?.staves.bass[0]?.events ?? [])).toEqual([['rest', 0, 48]])
  })

  it('ties a note across the barline', () => {
    const score = notate(
      music([n(48, note('C'), 'lh', 36, 24)], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 48, beats: 4 },
        ],
      }),
    )
    const [first, second] = score.measures
    const tied = first?.staves.bass[0]?.events.at(-1)
    expect(notesOf(tied)[0]?.tie).toBe(true)
    expect(notesOf(second?.staves.bass[0]?.events[0])[0]).toMatchObject({ tie: false, accidental: null })
  })

  it('prints the accidentals the key and the bar do not say', () => {
    const score = notate(
      music(
        [
          n(66, note('F', 1), 'rh', 0, 12),
          n(65, note('F'), 'rh', 12, 12),
          n(65, note('F'), 'rh', 24, 12),
          n(66, note('F', 1), 'rh', 36, 12),
        ],
        { key: { tonic: note('G'), minor: false } },
      ),
    )
    const events = score.measures[0]?.staves.treble[0]?.events ?? []
    expect(events.map((event) => notesOf(event)[0]?.accidental)).toEqual([null, 0, null, 1])
  })

  it('writes a hand’s tied pieces with one finger, and a rolled chord once', () => {
    const score = notate(
      music([
        n(60, note('C'), 'rh', 6, 12, { finger: 1 }),
        n(64, note('E'), 'rh', 6, 12, { finger: 3, roll: 1 }),
      ]),
    )
    const events = (score.measures[0]?.staves.treble[0]?.events ?? []).filter(
      (event): event is NotesEvent => event.kind === 'notes',
    )
    expect(events.map((event) => [event.tick, event.rolled, event.notes.map((w) => [w.tie, w.finger])])).toEqual([
      [
        6,
        true,
        [
          [true, 1],
          [true, 3],
        ],
      ],
      [
        12,
        false,
        [
          [false, undefined],
          [false, undefined],
        ],
      ],
    ])
  })

  it('writes each bar’s time signature', () => {
    const score = notate(
      music([], {
        bars: [
          { startTick: 0, beats: 4 },
          { startTick: 48, beats: 2 },
        ],
      }),
    )
    expect(score.measures.map((measure) => measure.time)).toEqual([
      { count: 4, unit: 4 },
      { count: 2, unit: 4 },
    ])
  })

  it('hides the second voice’s rests', () => {
    const score = notate(
      music([n(48, note('C'), 'lh', 0, 48), n(55, note('G'), 'lh', 0, 12)]),
    )
    const voices = score.measures[0]?.staves.bass ?? []
    expect(voices).toHaveLength(2)
    expect(voices[0]?.events.filter((event) => event.kind === 'rest')).toEqual([
      expect.objectContaining({ hidden: false }),
    ])
  })
})
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/notation`
Expected: FAIL, cannot resolve `./voices`, `./accidentals`, `./notate`.

- [ ] **Step 3: Write `src/shared/lib/notation/voices.ts`**

```ts
import type { Finger, Hand, Midi, SpelledNote, Tick } from '@/shared/lib/music'
import type { Stem } from './types'

/** A note of a chord in one bar: whether it goes on from the bar before, or into the next. */
export interface BarNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly finger?: Finger
  readonly tiedFrom: boolean
  readonly tiedTo: boolean
}

/** One hand's notes sounding together in a bar, from `start` to `end` (ticks from the bar's start). */
export interface BarChord {
  readonly hand: Hand | 'melody'
  readonly start: Tick
  readonly end: Tick
  readonly notes: readonly BarNote[]
  readonly rolled: boolean
}

/** A voice's chords in time order, not yet written in values, and its stem. */
export interface VoiceChords {
  readonly chords: readonly BarChord[]
  readonly stem: Stem
}

const MAX_VOICES = 2

const top = (chord: BarChord) => Math.max(...chord.notes.map((n) => n.midi))
const endOf = (voice: readonly BarChord[]) => voice.at(-1)?.end ?? 0
const meanPitch = (voice: readonly BarChord[]) => {
  const keys = voice.flatMap((chord) => chord.notes.map((n) => n.midi))
  return keys.reduce((sum, key) => sum + key, 0) / keys.length
}

/**
 * Adds a chord to a voice. A chord the voice still sounds at its onset is cut short to it (in
 * writing only: the sound is the Performance's); one that starts with it joins it, the shorter length
 * kept.
 */
function place(voice: BarChord[], chord: BarChord) {
  const last = voice.at(-1)
  if (!last || last.end <= chord.start) {
    voice.push(chord)
    return
  }
  if (last.start === chord.start) {
    const notes = [...last.notes, ...chord.notes].sort((a, b) => a.midi - b.midi)
    voice[voice.length - 1] = {
      ...last,
      end: Math.min(last.end, chord.end),
      notes: notes.map((n) => ({ ...n, tiedTo: n.tiedTo && Math.min(last.end, chord.end) === last.end })),
      rolled: last.rolled || chord.rolled,
    }
    return
  }
  voice[voice.length - 1] = {
    ...last,
    end: chord.start,
    notes: last.notes.map((n) => ({ ...n, tiedTo: false })),
  }
  voice.push(chord)
}

/**
 * A staff's chords in a bar as one or two voices (spec §2.4 step 3): the tune, when there is one,
 * over the right hand; otherwise each chord in the first voice free at its onset, or a second; with
 * two, the higher has its stems up.
 */
export function separateVoices(chords: readonly BarChord[]): VoiceChords[] {
  const ordered = [...chords].sort(
    (a, b) =>
      a.start - b.start ||
      Number(b.hand === 'melody') - Number(a.hand === 'melody') ||
      top(b) - top(a),
  )
  const withTune = ordered.some((chord) => chord.hand === 'melody')
  const tune: BarChord[] = []
  const accompaniment: BarChord[] = []
  const voices: BarChord[][] = withTune ? [tune, accompaniment] : []
  for (const chord of ordered) {
    if (withTune) {
      place(chord.hand === 'melody' ? tune : accompaniment, chord)
      continue
    }
    const free = voices.find((voice) => endOf(voice) <= chord.start)
    if (free) free.push(chord)
    else if (voices.length < MAX_VOICES) voices.push([chord])
    else {
      const first = voices.reduce((a, b) => (endOf(b) < endOf(a) ? b : a))
      place(first, chord)
    }
  }
  const kept = voices.filter((voice) => voice.length > 0)
  if (kept.length < 2) return kept.map((voice) => ({ chords: voice, stem: 'auto' }))
  const [high, low] = [...kept].sort((a, b) => meanPitch(b) - meanPitch(a))
  return [
    { chords: high ?? [], stem: 'up' },
    { chords: low ?? [], stem: 'down' },
  ]
}
```

- [ ] **Step 4: Write `src/shared/lib/notation/accidentals.ts`**

```ts
import { spellScale, type Accidental, type Key, type Letter, type SpelledNote } from '@/shared/lib/music'

/** Each letter's accidental in a key's signature: its major or natural minor scale. */
export function keyAccidentals(key: Key): ReadonlyMap<Letter, Accidental> {
  return new Map(
    spellScale(key.tonic, key.minor ? 'natural' : 'major').map((tone) => [
      tone.note.letter,
      tone.note.accidental,
    ]),
  )
}

/**
 * The accidental each note of a staff's bar prints, its notes in time order (spec §2.4 step 6): one
 * that differs from the signature or an earlier note of its letter and octave in the bar, a natural
 * as 0; none on a tied continuation, which changes nothing.
 */
export function printedAccidentals(
  notes: readonly { spelled: SpelledNote; octave: number; continued: boolean }[],
  key: Key,
): (Accidental | null)[] {
  const signature = keyAccidentals(key)
  const inBar = new Map<string, Accidental>()
  return notes.map(({ spelled, octave, continued }) => {
    if (continued) return null
    const place = `${spelled.letter}${octave}`
    const current = inBar.get(place) ?? signature.get(spelled.letter) ?? 0
    if (spelled.accidental === current) return null
    inBar.set(place, spelled.accidental)
    return spelled.accidental
  })
}
```

- [ ] **Step 5: Write `src/shared/lib/notation/notate.ts`**

```ts
import {
  TICKS_PER_BEAT,
  timeSignature,
  writtenOctave,
  type Key,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { printedAccidentals } from './accidentals'
import { spellSpan, voiceGrid, type Span, type VoiceGrid } from './rhythm'
import type {
  Measure,
  NotesEvent,
  RestEvent,
  Score,
  ScoreVoice,
  StaffId,
  TimedMusic,
  TimedNote,
  WrittenNote,
} from './types'
import { separateVoices, type BarChord, type BarNote, type VoiceChords } from './voices'

interface Bar {
  readonly start: Tick
  readonly ticks: Tick
  readonly meter: Meter
  readonly key: Key
}

/** A note written but not yet given its accidental: whether it continues a tie. */
type Draft = Omit<WrittenNote, 'accidental'> & { readonly continued: boolean }
type DraftEvent = Omit<NotesEvent, 'notes'> & { readonly notes: readonly Draft[] }
interface DraftVoice {
  readonly events: readonly (DraftEvent | RestEvent)[]
  readonly stem: ScoreVoice['stem']
}

const staffOf = (hand: TimedNote['hand']): StaffId => (hand === 'lh' ? 'bass' : 'treble')

/** The notes sounding in a bar, cut at its lines, as each staff's chords (spec §2.4 steps 1–2). */
function barChords(notes: readonly TimedNote[], bar: Bar): Record<StaffId, BarChord[]> {
  const end = bar.start + bar.ticks
  const groups = new Map<string, { staff: StaffId; chord: BarChord }>()
  for (const n of notes) {
    const noteEnd = n.startTick + n.durationTicks
    if (n.startTick >= end || noteEnd <= bar.start) continue
    const start = Math.max(n.startTick, bar.start) - bar.start
    const stop = Math.min(noteEnd, end) - bar.start
    const tiedFrom = n.startTick < bar.start
    const written: BarNote = {
      midi: n.midi,
      spelled: n.spelled,
      tiedFrom,
      tiedTo: noteEnd > end,
      ...(n.finger ? { finger: n.finger } : {}),
    }
    const id = `${n.hand} ${start} ${stop}`
    const group = groups.get(id)
    const rolled = n.roll > 0 && !tiedFrom
    if (!group) {
      groups.set(id, {
        staff: staffOf(n.hand),
        chord: { hand: n.hand, start, end: stop, notes: [written], rolled },
      })
    } else if (!group.chord.notes.some((other) => other.midi === n.midi)) {
      group.chord = {
        ...group.chord,
        notes: [...group.chord.notes, written].sort((a, b) => a.midi - b.midi),
        rolled: group.chord.rolled || rolled,
      }
    }
  }
  const staves: Record<StaffId, BarChord[]> = { treble: [], bass: [] }
  for (const { staff, chord } of groups.values()) staves[staff].push(chord)
  return staves
}

function rests(span: Span, bar: Bar, grid: VoiceGrid, hidden: boolean): RestEvent[] {
  return spellSpan(span, { meter: bar.meter, barTicks: bar.ticks, grid }).map((piece) => ({
    kind: 'rest',
    tick: bar.start + piece.tick,
    duration: piece.duration,
    hidden,
  }))
}

/** A voice's chords as values end to end: gaps as rests, a chord as tied pieces (spec §2.4 steps 4–5). */
function writeVoice(voice: VoiceChords, bar: Bar, second: boolean): DraftVoice {
  const grid = voiceGrid(voice.chords, bar.meter)
  const events: (DraftEvent | RestEvent)[] = []
  let at = 0
  for (const chord of voice.chords) {
    const start = grid.place(chord.start)
    const end = grid.place(chord.end)
    if (start >= end) continue
    if (start > at) events.push(...rests({ start: at, end: start }, bar, grid, second))
    const pieces = spellSpan({ start, end }, { meter: bar.meter, barTicks: bar.ticks, grid })
    pieces.forEach((piece, i) => {
      const last = i === pieces.length - 1
      events.push({
        kind: 'notes',
        tick: bar.start + piece.tick,
        duration: piece.duration,
        rolled: chord.rolled && i === 0,
        notes: chord.notes.map((n) => ({
          midi: n.midi,
          spelled: n.spelled,
          octave: writtenOctave(n.midi, n.spelled),
          tie: !last || n.tiedTo,
          continued: i > 0 || n.tiedFrom,
          ...(n.finger && i === 0 && !n.tiedFrom ? { finger: n.finger } : {}),
        })),
      })
    })
    at = end
  }
  if (at < bar.ticks) events.push(...rests({ start: at, end: bar.ticks }, bar, grid, second))
  return { events, stem: voice.stem }
}

/** A staff's voices with each note's accidental, across its voices in time order (spec §2.4 step 6). */
function withAccidentals(voices: readonly DraftVoice[], key: Key): ScoreVoice[] {
  const drafts = voices
    .flatMap((voice, v) =>
      voice.events.flatMap((event, e) =>
        event.kind === 'notes' ? event.notes.map((draft, i) => ({ v, e, i, tick: event.tick, draft })) : [],
      ),
    )
    .sort((a, b) => a.tick - b.tick)
  const printed = printedAccidentals(
    drafts.map(({ draft }) => draft),
    key,
  )
  const accidentalOf = new Map(drafts.map(({ v, e, i }, index) => [`${v} ${e} ${i}`, printed[index] ?? null]))
  return voices.map((voice, v) => ({
    stem: voice.stem,
    events: voice.events.map((event, e) =>
      event.kind === 'rest'
        ? event
        : {
            ...event,
            notes: event.notes.map(
              (draft, i): WrittenNote => ({
                midi: draft.midi,
                spelled: draft.spelled,
                octave: draft.octave,
                accidental: accidentalOf.get(`${v} ${e} ${i}`) ?? null,
                tie: draft.tie,
                ...(draft.finger ? { finger: draft.finger } : {}),
              }),
            ),
          },
    ),
  }))
}

function writeStaff(chords: readonly BarChord[], bar: Bar): ScoreVoice[] {
  const voices = separateVoices(chords)
  const drafts: DraftVoice[] =
    voices.length === 0
      ? [
          {
            events: rests({ start: 0, end: bar.ticks }, bar, voiceGrid([], bar.meter), false),
            stem: 'auto',
          },
        ]
      : voices.map((voice, index) => writeVoice(voice, bar, index > 0))
  return withAccidentals(drafts, bar.key)
}

/** Timed notes as a written score: bars, a grand staff, voices, values, ties and accidentals (spec §2.4). */
export function notate(music: TimedMusic): Score {
  const measures = music.bars.map((written): Measure => {
    const bar: Bar = {
      start: written.startTick,
      ticks: Math.round(written.beats * TICKS_PER_BEAT),
      meter: music.meter,
      key: music.key,
    }
    const chords = barChords(music.notes, bar)
    return {
      startTick: bar.start,
      ticks: bar.ticks,
      time: timeSignature(written.beats, music.meter),
      staves: { treble: writeStaff(chords.treble, bar), bass: writeStaff(chords.bass, bar) },
      chords: music.chords
        .filter((chord) => chord.startTick >= bar.start && chord.startTick < bar.start + bar.ticks)
        .map((chord) => ({ tick: chord.startTick, symbol: chord.symbol })),
    }
  })
  return { key: music.key, meter: music.meter, measures }
}
```

Add `export { notate } from './notate'` to `src/shared/lib/notation/index.ts`. The voices and accidentals stay
internal: nothing outside the kernel calls them.

- [ ] **Step 6: Run the kernel's tests**

Run: `npx vitest run src/shared/lib/notation`
Expected: PASS.

- [ ] **Step 7: Every piece and every pattern notates** — `src/features/practice/notate-pieces.test.ts`

```ts
import { describe, expect, it } from 'vitest'
import { PATTERN_IDS, PATTERNS } from '@/entities/pattern'
import { melodyOf, PIECES } from '@/entities/piece'
import { arrange, type Chart } from '@/shared/lib/arrangement'
import { beatsPerBar, note, parseChordSymbol, type Meter } from '@/shared/lib/music'
import { notate, ticksOf, type Score } from '@/shared/lib/notation'
import { arrangePiece, ownChoice } from './arrange-piece'

/** Every voice of every measure fills its bar, its events end to end; one or two voices a staff. */
function expectWritten(score: Score) {
  for (const measure of score.measures) {
    for (const voices of [measure.staves.treble, measure.staves.bass]) {
      expect(voices.length).toBeGreaterThanOrEqual(1)
      expect(voices.length).toBeLessThanOrEqual(2)
      for (const voice of voices) {
        let at = measure.startTick
        for (const event of voice.events) {
          expect(event.tick).toBe(at)
          at += ticksOf(event.duration, score.meter)
        }
        expect(at).toBe(measure.startTick + measure.ticks)
      }
    }
  }
}

const chartIn = (meter: Meter): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter,
  sections: [
    {
      lines: [
        ['C', 'Am', 'F', 'G7'].map((symbol) => ({
          chords: [{ ...parseChordSymbol(symbol), beats: beatsPerBar(meter) }],
          beats: beatsPerBar(meter),
        })),
      ],
    },
  ],
})

describe('notation of the content', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))('writes %s as it plays', (_id, piece) => {
    expectWritten(notate(arrangePiece(piece, ownChoice(piece))))
    if (melodyOf(piece)) expectWritten(notate(arrangePiece(piece, { ...ownChoice(piece), melody: true })))
  })

  it.each(
    PATTERN_IDS.flatMap((id) => (['4/4', '3/4', '12/8'] as const).map((meter) => [id, meter] as const)),
  )('writes the pattern %s in %s', (id, meter) => {
    expectWritten(notate(arrange(chartIn(meter), { tonic: note('C'), pattern: PATTERNS[id].pattern })))
  })
})
```

Run: `npx vitest run src/features/practice/notate-pieces.test.ts`
Expected: PASS. A failure names the piece or pattern; fix the rule in the kernel (with a unit test that pins it), never
the content.

- [ ] **Step 8: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test` (and `npm run test:cov`: `src/shared/lib/**` stays ≥ 90%).

```bash
git add -A src
git commit -m "Write any timed music as a Score: voices, values, ties and accidentals, for every piece and pattern

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: The renderer: `ScoreView` over VexFlow

**Files:**
- Create: `src/shared/ui/score/{ScoreView.tsx,engrave.ts,vexflow-notes.ts,music-font.ts,layout.ts,score.css,index.ts}`,
  `src/shared/ui/score/{ScoreView.test.tsx,engrave.test.ts,layout.test.ts}`, `src/shared/test/fonts.ts`
- Modify: `package.json` (dependencies), `src/shared/test/setup.ts`, `src/shared/i18n/locales/{en,ru}/music.ts`,
  `src/features/practice/notate-pieces.test.ts`

**Interfaces:**
- Consumes: `Score`, `ticksOf`, `StaffId` (Tasks 3–4).
- Produces (from `@/shared/ui/score`): `ScoreView({ score, scale, fingers, muted?, children? })` where
  `children: (layout: ScoreLayout) => ReactNode`; `interface ScoreLayout { width; height; staffTop; staffBottom;
  measures: { startTick; ticks; x; width }[]; onsets: { tick; x }[] }`; `engrave(score, host, { scale, fingers }):
  ScoreLayout`; `xAtTick(layout, tick): number`; `SCORE_HEIGHT` (210 units). From `src/shared/test/fonts.ts`:
  `stubFonts({ loads }?)`.

- [ ] **Step 1: Add the dependencies**

Run: `npm install vexflow@^5.0.0 @vexflow-fonts/bravura@^1.0.2`
Expected: both in `dependencies`; `node_modules/@vexflow-fonts/bravura/index.css` declares Bravura's woff2 with
`font-display: block`.

- [ ] **Step 2: Give jsdom fonts and text metrics** — `src/shared/test/fonts.ts`

```ts
/**
 * jsdom has no fonts and no canvas. `document.fonts.load` resolves at once (or fails, `loads: false`),
 * and every canvas's 2D context measures text as 0.6em a character, which VexFlow engraves by. Called
 * before every test by the setup; a test that needs the font to fail calls it again.
 */
export function stubFonts({ loads = true }: { loads?: boolean } = {}) {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: {
      load: () =>
        loads ? Promise.resolve([{ family: 'stub' }]) : Promise.reject(new Error('The font did not load')),
    },
  })
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: () => ({
      font: '10px sans-serif',
      measureText(this: { font: string }, text: string) {
        const size = Number.parseFloat(/(\d+(?:\.\d+)?)(?:px|pt)/.exec(this.font)?.[1] ?? '10')
        const width = text.length * size * 0.6
        return {
          width,
          actualBoundingBoxAscent: size * 0.8,
          actualBoundingBoxDescent: size * 0.2,
          actualBoundingBoxLeft: 0,
          actualBoundingBoxRight: width,
          fontBoundingBoxAscent: size,
          fontBoundingBoxDescent: size * 0.25,
        }
      },
    }),
  })
}
```

In `src/shared/test/setup.ts`: `import { stubFonts } from './fonts'` and call `stubFonts()` in `beforeEach` after the
service worker stub. (jsdom's own `getContext` only logs "not implemented": nothing is lost by replacing it.)

- [ ] **Step 3: The strings** — `src/shared/i18n/locales/en/music.ts` gains

```ts
  // The sheet music: the Player's staff.
  sheet: {
    label: 'Sheet music',
    loading: 'Loading the music',
    error: 'The music can’t be shown.',
    bar: 'Bar {{n}}',
    barChords: 'Bar {{n}}: {{chords}}',
    loopStart: 'Loop start',
    loopEnd: 'Loop end',
  },
```

and `ru/music.ts`:

```ts
  sheet: {
    label: 'Ноты',
    loading: 'Загрузка нот',
    error: 'Ноты не удаётся показать.',
    bar: 'Такт {{n}}',
    barChords: 'Такт {{n}}: {{chords}}',
    loopStart: 'Начало повтора',
    loopEnd: 'Конец повтора',
  },
```

- [ ] **Step 4: Write the failing tests**

`src/shared/ui/score/layout.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { xAtTick } from './layout'
import type { ScoreLayout } from './engrave'

const layout: ScoreLayout = {
  width: 400,
  height: 210,
  staffTop: 40,
  staffBottom: 170,
  measures: [
    { startTick: 0, ticks: 48, x: 0, width: 200 },
    { startTick: 48, ticks: 48, x: 200, width: 200 },
  ],
  onsets: [
    { tick: 0, x: 60 },
    { tick: 24, x: 130 },
    { tick: 48, x: 220 },
  ],
}

describe('xAtTick', () => {
  it('puts an onset at its own x', () => {
    expect(xAtTick(layout, 24)).toBe(130)
  })

  it('puts a tick between onsets in proportion', () => {
    expect(xAtTick(layout, 12)).toBe(95)
  })

  it('runs past a bar’s last onset toward its end', () => {
    expect(xAtTick(layout, 72)).toBe(310)
    expect(xAtTick(layout, 999)).toBe(400)
  })
})
```

`src/shared/ui/score/engrave.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate, type TimedNote } from '@/shared/lib/notation'
import { engrave } from './engrave'

const n = (key: number, letter: 'C' | 'E' | 'G' | 'F', start: number, length: number, extra: Partial<TimedNote> = {}): TimedNote => ({
  midi: midi(key),
  spelled: note(letter, letter === 'F' ? 1 : 0),
  hand: 'rh',
  startTick: start,
  durationTicks: length,
  roll: 0,
  ...extra,
})

/** Two bars: a rolled chord with fingers, a triplet beat, a tie across the barline, a held bass under moving notes. */
const score = notate({
  key: { tonic: note('G'), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 48, beats: 4 },
  ],
  notes: [
    n(60, 'C', 0, 12, { finger: 1 }),
    n(64, 'E', 0, 12, { finger: 3, roll: 1 }),
    n(67, 'G', 12, 8),
    n(66, 'F', 20, 4),
    n(67, 'G', 36, 24),
    { ...n(43, 'G', 0, 96), hand: 'lh' },
    { ...n(48, 'C', 0, 12), hand: 'lh' },
  ],
  chords: [
    { startTick: 0, symbol: 'C' },
    { startTick: 48, symbol: 'G' },
  ],
})

describe('engrave', () => {
  it('engraves a grand staff into the host and lays it out left to right', () => {
    const host = document.createElement('div')
    const layout = engrave(score, host, { scale: 1, fingers: true })
    expect(host.querySelector('svg')).not.toBeNull()
    expect(layout.measures.map((m) => m.startTick)).toEqual([0, 48])
    expect(layout.measures[1]?.x).toBe((layout.measures[0]?.x ?? 0) + (layout.measures[0]?.width ?? 0))
    const ticks = layout.onsets.map((onset) => onset.tick)
    expect(ticks).toEqual([...ticks].sort((a, b) => a - b))
    expect(ticks).toEqual(expect.arrayContaining([0, 12, 20, 24, 36, 48]))
    const xs = layout.onsets.map((onset) => onset.x)
    expect(xs).toEqual([...xs].sort((a, b) => a - b))
    expect(layout.staffTop).toBeLessThan(layout.staffBottom)
  })

  it('draws the staves in groups a stylesheet can mute', () => {
    const host = document.createElement('div')
    engrave(score, host, { scale: 1, fingers: false })
    expect(host.querySelector('.vf-staff-treble')).not.toBeNull()
    expect(host.querySelector('.vf-staff-bass')).not.toBeNull()
    expect(host.querySelector('svg')?.getAttribute('fill')).toBe('currentColor')
  })

  it('scales the layout', () => {
    const one = engrave(score, document.createElement('div'), { scale: 1, fingers: false })
    const small = engrave(score, document.createElement('div'), { scale: 0.5, fingers: false })
    expect(small.width).toBeCloseTo(one.width / 2)
    expect(small.onsets[1]?.x).toBeCloseTo((one.onsets[1]?.x ?? 0) / 2)
  })
})
```

`src/shared/ui/score/ScoreView.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { stubFonts } from '@/shared/test/fonts'
import { ScoreView } from './ScoreView'

const score = notate({
  key: { tonic: note('C'), minor: false },
  meter: '3/4',
  bars: [
    { startTick: 0, beats: 3 },
    { startTick: 36, beats: 3 },
  ],
  notes: [{ midi: midi(60), spelled: note('C'), hand: 'rh', startTick: 0, durationTicks: 72, roll: 0 }],
  chords: [{ startTick: 0, symbol: 'C' }],
})

describe('ScoreView', () => {
  it('engraves once the music font is in, and hands its layout to what lies over it', async () => {
    render(
      <ScoreView score={score} scale={1} fingers={false}>
        {(layout) => <p>Bars: {layout.measures.length}</p>}
      </ScoreView>,
    )
    expect(await screen.findByText('Bars: 2')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="score"] svg')).toBeInTheDocument()
  })

  it('names the staff it mutes', async () => {
    render(<ScoreView score={score} scale={1} fingers={false} muted="bass" />)
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'bass')
  })

  it('says so when the music font does not load', async () => {
    stubFonts({ loads: false })
    render(<ScoreView score={score} scale={1} fingers={false} />)
    expect(await screen.findByText('The music can’t be shown.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Run them to see them fail**

Run: `npx vitest run src/shared/ui/score`
Expected: FAIL, cannot resolve `./layout`, `./engrave`, `./ScoreView`.

- [ ] **Step 6: Write the font loader** — `src/shared/ui/score/music-font.ts`

```ts
/** The music font VexFlow engraves with (score.css's `@font-face`), and its face for text: fingering. */
export const MUSIC_FONT = 'Bravura'
export const TEXT_FONT = 'Onest Variable'

/**
 * Both faces, loaded: VexFlow measures every glyph with the canvas as it engraves, so it must not
 * engrave before them. Once loaded the browser answers at once, so nothing is kept here.
 */
export async function loadMusicFonts(): Promise<void> {
  const [music] = await Promise.all([
    document.fonts.load(`30px ${MUSIC_FONT}`),
    document.fonts.load(`12px "${TEXT_FONT}"`),
  ])
  if (music.length === 0) throw new Error(`${MUSIC_FONT} did not load`)
}
```

- [ ] **Step 7: Write the note builder** — `src/shared/ui/score/vexflow-notes.ts`

```ts
import {
  Accidental,
  Beam,
  Dot,
  Fraction,
  FretHandFinger,
  GhostNote,
  Modifier,
  StaveNote,
  Stem,
  Stroke,
  Tuplet,
  Voice,
  VoiceMode,
} from 'vexflow/core'
import { isCompound, TICKS_PER_BEAT, type Accidental as Sign, type Meter } from '@/shared/lib/music'
import {
  ticksOf,
  type Duration,
  type Measure,
  type ScoreEvent,
  type ScoreVoice,
  type StaffId,
  type WrittenNote,
} from '@/shared/lib/notation'

const VALUE_CODE = { 1: 'w', 2: 'h', 4: 'q', 8: '8', 16: '16', 32: '32' } as const
const SIGN: Readonly<Record<Sign, string>> = { [-2]: 'bb', [-1]: 'b', 0: 'n', 1: '#', 2: '##' }
/** Where a rest sits: in the middle of a staff alone, above or below it beside another voice. */
const REST_KEY: Readonly<Record<StaffId, Readonly<Record<ScoreVoice['stem'], string>>>> = {
  treble: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  bass: { auto: 'd/3', up: 'g/3', down: 'a/2' },
}

const code = (duration: Duration) => `${VALUE_CODE[duration.value]}${duration.dots ? 'd' : ''}`
const keyOf = (note: WrittenNote) => `${note.spelled.letter.toLowerCase()}/${note.octave}`

export type VexNote = StaveNote | GhostNote

/** One voice of one staff's measure, built for VexFlow: its notes (with the events they write), beams and tuplets. */
export interface BuiltVoice {
  readonly voice: Voice
  readonly notes: readonly { readonly event: ScoreEvent; readonly note: VexNote }[]
  readonly beams: readonly Beam[]
  /** Tuplets to draw: a triplet beat of a hidden rest keeps its time and draws no 3. */
  readonly tuplets: readonly Tuplet[]
}

function noteOf(
  event: ScoreEvent,
  { staff, stem, fingers, wholeBar }: { staff: StaffId; stem: ScoreVoice['stem']; fingers: boolean; wholeBar: boolean },
): VexNote {
  if (event.kind === 'rest') {
    if (event.hidden) return new GhostNote({ duration: code(event.duration) })
    const rest = new StaveNote({
      keys: [REST_KEY[staff][stem]],
      duration: wholeBar ? 'w' : code(event.duration),
      type: 'r',
      clef: staff,
      alignCenter: wholeBar,
    })
    if (!wholeBar && event.duration.dots) Dot.buildAndAttach([rest], { all: true })
    return rest
  }
  const note = new StaveNote({
    keys: event.notes.map(keyOf),
    duration: code(event.duration),
    clef: staff,
    ...(stem === 'auto' ? { autoStem: true } : { stemDirection: stem === 'up' ? Stem.UP : Stem.DOWN }),
  })
  event.notes.forEach((written, index) => {
    if (written.accidental !== null) note.addModifier(new Accidental(SIGN[written.accidental]), index)
    if (fingers && written.finger) {
      const finger = new FretHandFinger(String(written.finger))
      finger.setPosition(staff === 'treble' ? Modifier.Position.ABOVE : Modifier.Position.BELOW)
      note.addModifier(finger, index)
    }
  })
  if (event.rolled) note.addStroke(0, new Stroke(Stroke.Type.ARPEGGIO_DIRECTIONLESS))
  if (event.duration.dots) Dot.buildAndAttach([note], { all: true })
  return note
}

/** A measure's voice for VexFlow (spec §2.5): triplets bracketed per beat, beams by the beat. */
export function buildVoice(
  voice: ScoreVoice,
  { staff, measure, meter, fingers }: { staff: StaffId; measure: Measure; meter: Meter; fingers: boolean },
): BuiltVoice {
  const [only] = voice.events
  const wholeBar =
    voice.events.length === 1 &&
    only?.kind === 'rest' &&
    !only.hidden &&
    ticksOf(only.duration, meter) === measure.ticks
  const notes = voice.events.map((event) => ({
    event,
    note: noteOf(event, { staff, stem: voice.stem, fingers, wholeBar }),
  }))
  const byBeat = new Map<number, VexNote[]>()
  for (const { event, note } of notes) {
    if (!event.duration.triplet) continue
    const beat = Math.floor(event.tick / TICKS_PER_BEAT)
    byBeat.set(beat, [...(byBeat.get(beat) ?? []), note])
  }
  // A tuplet is made before its notes join a voice: it sets their ticks.
  const tuplets = [...byBeat.values()].map((group) => ({
    drawn: group.every((note) => note instanceof StaveNote),
    tuplet: new Tuplet(group, { numNotes: 3, notesOccupied: 2 }),
  }))
  const built = new Voice({ numBeats: measure.time.count, beatValue: measure.time.unit })
  if (wholeBar) built.setMode(VoiceMode.SOFT)
  built.addTickables(notes.map(({ note }) => note))
  const beams = Beam.generateBeams(
    notes.map(({ note }) => note).filter((note) => note instanceof StaveNote),
    {
      groups: [isCompound(meter) ? new Fraction(3, 8) : new Fraction(1, 4)],
      maintainStemDirections: voice.stem !== 'auto',
      beamRests: false,
    },
  )
  return {
    voice: built,
    notes,
    beams,
    tuplets: tuplets.filter(({ drawn }) => drawn).map(({ tuplet }) => tuplet),
  }
}
```

- [ ] **Step 8: Write the engraver** — `src/shared/ui/score/engrave.ts`

```ts
import {
  Formatter,
  MetricsDefaults,
  Renderer,
  Stave,
  StaveConnector,
  StaveNote,
  StaveTie,
  SVGContext,
  VexFlow,
  type RenderContext,
} from 'vexflow/core'
import { keySignature, timeSignatureText, type Key, type Tick } from '@/shared/lib/music'
import { STAVES, ticksOf, type Measure, type Score, type StaffId } from '@/shared/lib/notation'
import { MUSIC_FONT, TEXT_FONT } from './music-font'
import { buildVoice, type BuiltVoice, type VexNote } from './vexflow-notes'

export interface ScoreLayout {
  /** The engraving's size in CSS pixels. */
  readonly width: number
  readonly height: number
  /** The treble staff's top line and the bass staff's bottom line. */
  readonly staffTop: number
  readonly staffBottom: number
  readonly measures: readonly {
    readonly startTick: Tick
    readonly ticks: Tick
    readonly x: number
    readonly width: number
  }[]
  /** Each written onset left to right: its tick and its first notehead's or rest's x. */
  readonly onsets: readonly { readonly tick: Tick; readonly x: number }[]
}

/** The engraving's height in VexFlow units: the treble staff at 0 (lines 40–80), the bass at 90 (130–170). */
export const SCORE_HEIGHT = 210
const STAFF_Y: Readonly<Record<StaffId, number>> = { treble: 0, bass: 90 }
/** A measure's notes are never narrower than this, and are given this much more than their least. */
const LEAST_NOTES = 80
const SPACING = 1.4
const NOTE_PADDING = 20
/** A chord symbol's room: its letters at the 17px serif, and a gap. */
const CHORD_LETTER = 10
const CHORD_GAP = 16
const END_MARGIN = 8

let setUp = false
/** VexFlow's globals, once: our faces, and every colour `currentColor` so CSS colours the staff. */
function setUpVexFlow() {
  if (setUp) return
  MetricsDefaults.Stem.strokeStyle = 'currentColor'
  MetricsDefaults.Stave.strokeStyle = 'currentColor'
  VexFlow.setFonts(MUSIC_FONT, TEXT_FONT)
  setUp = true
}

/** A key signature as VexFlow names it: the major key with as many sharps or flats. */
const MAJOR_BY_SIGNATURE = ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#']
const signatureOf = (key: Key) => MAJOR_BY_SIGNATURE[keySignature(key) + 7] ?? 'C'

interface BuiltMeasure {
  readonly measure: Measure
  readonly staves: Readonly<Record<StaffId, readonly BuiltVoice[]>>
  readonly formatter: Formatter
  readonly clefs: boolean
  readonly time: boolean
  readonly width: number
}

function staveAt(staff: StaffId, x: number, width: number, built: BuiltMeasure, key: Key): Stave {
  const stave = new Stave(x, STAFF_Y[staff], width)
  if (built.clefs) stave.addClef(staff).addKeySignature(signatureOf(key))
  if (built.time) stave.addTimeSignature(timeSignatureText(built.measure.time))
  return stave
}

function buildMeasure(
  score: Score,
  measure: Measure,
  previous: Measure | undefined,
  fingers: boolean,
): BuiltMeasure {
  const build = (staff: StaffId) =>
    measure.staves[staff].map((voice) =>
      buildVoice(voice, { staff, measure, meter: score.meter, fingers }),
    )
  const staves = { treble: build('treble'), bass: build('bass') }
  const formatter = new Formatter()
  for (const staff of STAVES) formatter.joinVoices(staves[staff].map((built) => built.voice))
  const voices = STAVES.flatMap((staff) => staves[staff].map((built) => built.voice))
  const least = formatter.preCalculateMinTotalWidth(voices)
  const clefs = previous === undefined
  const time =
    !previous ||
    previous.time.count !== measure.time.count ||
    previous.time.unit !== measure.time.unit
  const probe = { measure, staves, formatter, clefs, time, width: 0 }
  const modifiers = Math.max(
    ...STAVES.map((staff) => {
      const stave = staveAt(staff, 0, LEAST_NOTES, probe, score.key)
      return stave.getNoteStartX() - stave.getX()
    }),
  )
  const chords = measure.chords.reduce(
    (sum, chord) => sum + chord.symbol.length * CHORD_LETTER + CHORD_GAP,
    0,
  )
  return {
    ...probe,
    width: modifiers + Math.max(LEAST_NOTES, least * SPACING + NOTE_PADDING, chords),
  }
}

/** Every tied note joined to the note of its key where its value ends, on its staff. */
function drawTies(context: RenderContext, built: readonly BuiltMeasure[], meter: Score['meter']) {
  for (const staff of STAVES) {
    const at = new Map<string, { note: VexNote; index: number }>()
    for (const measure of built) {
      for (const voice of measure.staves[staff]) {
        for (const { event, note } of voice.notes) {
          if (event.kind !== 'notes') continue
          event.notes.forEach((written, index) => at.set(`${event.tick} ${written.midi}`, { note, index }))
        }
      }
    }
    context.openGroup(`staff-${staff}`)
    for (const measure of built) {
      for (const voice of measure.staves[staff]) {
        for (const { event, note } of voice.notes) {
          if (event.kind !== 'notes') continue
          const end = event.tick + ticksOf(event.duration, meter)
          event.notes.forEach((written, index) => {
            const next = written.tie ? at.get(`${end} ${written.midi}`) : undefined
            if (!next) return
            new StaveTie({
              firstNote: note,
              lastNote: next.note,
              firstIndexes: [index],
              lastIndexes: [next.index],
            })
              .setContext(context)
              .draw()
          })
        }
      }
    }
    context.closeGroup()
  }
}

/**
 * Engraves a score into `host` as one system of measures left to right (spec §2.5), and says where
 * everything is, in CSS pixels at `scale`.
 */
export function engrave(
  score: Score,
  host: HTMLElement,
  { scale, fingers }: { scale: number; fingers: boolean },
): ScoreLayout {
  setUpVexFlow()
  host.replaceChildren()
  const built = score.measures.map((measure, index) =>
    buildMeasure(score, measure, score.measures[index - 1], fingers),
  )
  const width = built.reduce((sum, measure) => sum + measure.width, 0) + END_MARGIN
  const renderer = new Renderer(host, Renderer.Backends.SVG)
  renderer.resize(width * scale, SCORE_HEIGHT * scale)
  const context = renderer.getContext()
  context.scale(scale, scale)
  context.setFillStyle('currentColor')
  context.setStrokeStyle('currentColor')
  if (context instanceof SVGContext) {
    context.svg.setAttribute('fill', 'currentColor')
    context.svg.setAttribute('stroke', 'currentColor')
  }

  const measures: ScoreLayout['measures'][number][] = []
  const onsets = new Map<Tick, number>()
  let staffTop = 0
  let staffBottom = 0
  let x = 0
  for (const measure of built) {
    const staves = {
      treble: staveAt('treble', x, measure.width, measure, score.key),
      bass: staveAt('bass', x, measure.width, measure, score.key),
    }
    const start = Math.max(staves.treble.getNoteStartX(), staves.bass.getNoteStartX())
    for (const staff of STAVES) staves[staff].setNoteStartX(start).setContext(context).draw()
    if (measure.clefs) {
      for (const type of ['brace', 'singleLeft'] as const) {
        new StaveConnector(staves.treble, staves.bass).setType(type).setContext(context).draw()
      }
    }
    new StaveConnector(staves.treble, staves.bass).setType('singleRight').setContext(context).draw()
    measure.formatter.formatToStave(
      STAVES.flatMap((staff) => measure.staves[staff].map((voice) => voice.voice)),
      staves.treble,
    )
    for (const staff of STAVES) {
      context.openGroup(`staff-${staff}`)
      for (const voice of measure.staves[staff]) {
        voice.voice.draw(context, staves[staff])
        for (const beam of voice.beams) beam.setContext(context).draw()
        for (const tuplet of voice.tuplets) tuplet.setContext(context).draw()
        for (const { event, note } of voice.notes) {
          if (!(note instanceof StaveNote)) continue
          const at = note.getAbsoluteX() * scale
          onsets.set(event.tick, Math.min(onsets.get(event.tick) ?? at, at))
        }
      }
      context.closeGroup()
    }
    staffTop = staves.treble.getYForLine(0) * scale
    staffBottom = staves.bass.getYForLine(4) * scale
    measures.push({
      startTick: measure.measure.startTick,
      ticks: measure.measure.ticks,
      x: x * scale,
      width: measure.width * scale,
    })
    x += measure.width
  }
  drawTies(context, built, score.meter)

  return {
    width: width * scale,
    height: SCORE_HEIGHT * scale,
    staffTop,
    staffBottom,
    measures,
    onsets: [...onsets].map(([tick, at]) => ({ tick, x: at })).sort((a, b) => a.tick - b.tick),
  }
}
```

(VexFlow draws the clef, key and time signatures as siblings of the staff's lines, `.vf-clef` beside `.vf-stave`:
the scratch run printed its group tree, so the stylesheet below colours the lines alone.)

- [ ] **Step 9: Write `layout.ts`, `score.css`, `ScoreView.tsx`, `index.ts`**

`src/shared/ui/score/layout.ts`:

```ts
import type { Tick } from '@/shared/lib/music'
import type { ScoreLayout } from './engrave'

/** The x of any tick: an onset's own, or in proportion between the onsets around it and its bar's end. */
export function xAtTick(layout: ScoreLayout, tick: Tick): number {
  const measure =
    layout.measures.find((m) => tick < m.startTick + m.ticks) ?? layout.measures.at(-1)
  if (!measure) return 0
  const end = measure.startTick + measure.ticks
  const points = [
    ...layout.onsets.filter((onset) => onset.tick >= measure.startTick && onset.tick < end),
    { tick: end, x: measure.x + measure.width },
  ]
  const next = points.findIndex((point) => point.tick >= tick)
  const after = points[next]
  const before = points[next - 1]
  if (!after) return measure.x + measure.width
  if (!before || after.tick === tick) return after.x
  return before.x + ((after.x - before.x) * (tick - before.tick)) / (after.tick - before.tick)
}
```

`src/shared/ui/score/score.css`:

```css
@import '@vexflow-fonts/bravura/index.css';

/* VexFlow draws in currentColor (engrave.ts): the notes take the ink, the staff's lines and barlines
   the control line. */
[data-slot='score'] {
  color: var(--color-foreground);
}
[data-slot='score'] :is(.vf-stave, .vf-stavebarline, .vf-staveconnector) {
  color: var(--color-input);
}
/* The staff of the hand not heard or practised, in soft ink, without engraving again. */
[data-slot='score'][data-muted='treble'] .vf-staff-treble,
[data-slot='score'][data-muted='bass'] .vf-staff-bass {
  color: var(--color-muted-foreground);
}
```


`src/shared/ui/score/ScoreView.tsx`:

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Score, StaffId } from '@/shared/lib/notation'
import { engrave, SCORE_HEIGHT, type ScoreLayout } from './engrave'
import { loadMusicFonts } from './music-font'
import './score.css'

type Engraving =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly layout: ScoreLayout }
  | { readonly status: 'error' }

/**
 * A score engraved on one line of grand staff (spec §2.5), once the music font is in. What lies over
 * it (labels, a cursor, the loop) is its children, given the engraving's layout. The staff of `muted`
 * is soft ink.
 */
export function ScoreView({
  score,
  scale,
  fingers,
  muted,
  children,
}: {
  score: Score
  scale: number
  fingers: boolean
  muted?: StaffId | undefined
  children?: (layout: ScoreLayout) => ReactNode
}) {
  const { t } = useTranslation('music')
  const host = useRef<HTMLDivElement>(null)
  const [engraving, setEngraving] = useState<Engraving>({ status: 'loading' })

  // VexFlow draws into the DOM, outside React; the font must be in before it measures anything.
  useEffect(() => {
    let current = true
    const element = host.current
    if (!element) return
    loadMusicFonts()
      .then(() => {
        if (current) setEngraving({ status: 'ready', layout: engrave(score, element, { scale, fingers }) })
      })
      .catch(() => {
        if (current) setEngraving({ status: 'error' })
      })
    return () => {
      current = false
    }
  }, [score, scale, fingers])

  const size =
    engraving.status === 'ready'
      ? { width: engraving.layout.width, height: engraving.layout.height }
      : { height: SCORE_HEIGHT * scale }
  return (
    <div className="relative" style={size}>
      <div
        ref={host}
        data-slot="score"
        data-muted={muted}
        aria-hidden
        className="pointer-events-none relative z-10"
      />
      {engraving.status === 'loading' ? <p className="sr-only">{t('sheet.loading')}</p> : null}
      {engraving.status === 'error' ? (
        <p className="absolute inset-0 flex items-center text-muted-foreground">{t('sheet.error')}</p>
      ) : null}
      {engraving.status === 'ready' && children ? children(engraving.layout) : null}
    </div>
  )
}
```

`src/shared/ui/score/index.ts`:

```ts
export { SCORE_HEIGHT, type ScoreLayout } from './engrave'
export { xAtTick } from './layout'
export { ScoreView } from './ScoreView'
```

- [ ] **Step 10: Run the renderer's tests**

Run: `npx vitest run src/shared/ui/score`
Expected: PASS. If VexFlow throws "Too many ticks" or a stem error, the builder's order is wrong (tuplets before the
voice; dots before formatting); fix it there.

- [ ] **Step 11: Every piece engraves** — append to `src/features/practice/notate-pieces.test.ts`

```ts
import { engrave } from '@/shared/ui/score/engrave'

describe('engraving of the content', () => {
  it.each(PIECES.map((piece) => [piece.id, piece] as const))('engraves %s', (_id, piece) => {
    const layout = engrave(notate(arrangePiece(piece, ownChoice(piece))), document.createElement('div'), {
      scale: 1,
      fingers: true,
    })
    expect(layout.measures.length).toBeGreaterThan(0)
  })
})
```

(`engrave` is imported by path from a test; tests are outside the layer rules.)

Run: `npx vitest run src/features/practice/notate-pieces.test.ts`
Expected: PASS, in seconds.

- [ ] **Step 12: Verify, build, commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS; the build's chunks: `vexflow` code only in the chunk the Player's screen will load (nothing imports
`@/shared/ui/score` yet, so it is not in any chunk now: check that the main chunk's size did not grow).

```bash
git add -A package.json package-lock.json src
git commit -m "Engrave a Score with VexFlow on one line of grand staff, with the music font self-hosted

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The schedule: a pass's end, swing, and a loop over a passage with its own tempos

**Files:**
- Create: `src/shared/lib/schedule/swing.ts`, `src/shared/lib/schedule/swing.test.ts`
- Modify: `src/shared/lib/schedule/{schedule,loop,index}.ts`, `src/shared/lib/schedule/{schedule,loop}.test.ts`

**Interfaces:**
- Consumes: `Performance` with `meter`, `roll` (Tasks 1–2).
- Produces: `ScheduleOptions.toTick?: Tick`, `ScheduleOptions.swing?: boolean`; `swingTick(tick): number`;
  `TEMPO_RANGE = { min: 20, max: 160 }`; `interface SpeedUp { step: number; until: number }`;
  `interface LoopOptions { hands; tempo; range: { from: Tick; to: Tick }; fromTick: Tick; speedUp?; countIn?;
  metronome?; swing? }`; `Pass` gains `tempo`; `startLoop(performance, options: LoopOptions, start)`,
  `advanceLoop(loop, time)`, `beatGroupAt(loop, time)`, `tempoAt(loop, time): number | null`.

- [ ] **Step 1: Write the failing tests**

`src/shared/lib/schedule/swing.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { swingTick } from './swing'

describe('swingTick', () => {
  it('keeps the beats where they are', () => {
    expect([0, 12, 24].map(swingTick)).toEqual([0, 12, 24])
  })

  it('plays the off-beat 8th at two thirds of the beat', () => {
    expect(swingTick(6)).toBe(8)
    expect(swingTick(18)).toBe(20)
  })

  it('moves what lies between in proportion', () => {
    expect(swingTick(3)).toBe(4)
    expect(swingTick(9)).toBe(10)
  })
})
```

Append to `src/shared/lib/schedule/schedule.test.ts` (and change the `TEMPO_RANGE` test to `{ min: 20, max: 160 }`,
"runs from 20 to 160"):

```ts
describe('schedule: a passage and swing', () => {
  const performance = arrange(chart('C', 'F'), { tonic: note('C'), pattern: BEATS })

  it('ends a pass where it is told, cutting what would sound past it', () => {
    const { sounds, cues, end } = schedule(performance, { tempo: 60, hands: ALL, fromTick: 12, toTick: 36 })
    expect(cues.map((cue) => cue.beatGroup)).toEqual([1, 2])
    expect(end).toBe(2)
    const bass = notes(sounds).find((sound) => sound.midi < 48)
    expect(bass).toBeUndefined()
  })

  it('swings the off-beat 8th to two thirds of the beat, the beats kept', () => {
    const eighths = arrange(chart('C'), {
      tonic: note('C'),
      pattern: {
        id: 'eighths',
        rh: { kind: 'events', events: parseFigure('0/2 C,2/2 C,4/2 C,6/2 C') },
        lh: { kind: 'events', events: parseFigure('0/16 L1') },
      },
    })
    const rh = (swing: boolean) =>
      [...new Set(notes(schedule(eighths, { tempo: 60, hands: audibleHands('rh'), swing }).sounds).map((s) => s.at))]
    expect(rh(false)).toEqual([0, 0.5, 1, 1.5])
    expect(rh(true).map((at) => Number(at.toFixed(4)))).toEqual([0, 0.6667, 1, 1.6667])
  })

  it('never swings a compound meter', () => {
    const inEighths = arrange({ ...chart('C'), meter: '6/8' }, { tonic: note('C'), pattern: BEATS })
    expect(schedule(inEighths, { tempo: 60, hands: ALL, swing: true })).toEqual(
      schedule(inEighths, { tempo: 60, hands: ALL }),
    )
  })
})
```

Replace `src/shared/lib/schedule/loop.test.ts`'s cases with these (keep its fixtures; `OPTIONS` becomes
`{ tempo: 60, hands: audibleHands('both'), range: { from: 0, to: 48 }, fromTick: 0 }`):

```ts
describe('startLoop', () => {
  it('queues one pass from the cursor to the passage’s end, at the given time', () => {
    const loop = startLoop(ONE_BAR, { ...OPTIONS, fromTick: 24 }, 10)
    expect(loop.passes).toHaveLength(1)
    expect(loop.passes[0]).toMatchObject({ start: 10, end: 2, tempo: 60 })
    expect(beatGroupAt(loop, 10)).toBe(2)
  })
})

describe('beatGroupAt', () => {
  const loop = startLoop(ONE_BAR, { ...OPTIONS, countIn: true }, 10)

  it('has none during the count-in', () => {
    expect(beatGroupAt(loop, 9)).toBeNull()
    expect(beatGroupAt(loop, 13.9)).toBeNull()
  })

  it('follows the beat group sounding at a time on the clock', () => {
    expect(beatGroupAt(loop, 14)).toBe(0)
    expect(beatGroupAt(loop, 15.5)).toBe(1)
    expect(beatGroupAt(loop, 17.99)).toBe(3)
  })
})

describe('advanceLoop', () => {
  const counted = startLoop(ONE_BAR, { ...OPTIONS, countIn: true, metronome: true }, 10)

  it('keeps the loop as it is until the next pass is due', () => {
    expect(advanceLoop(counted, 17.4)).toBe(counted)
  })

  it('queues the next pass half a second before the last one ends', () => {
    expect(advanceLoop(counted, 17.5).passes.map((pass) => pass.start)).toEqual([10, 18])
  })

  it('plays the passage again from its start, with the metronome and without the count-in', () => {
    const late = startLoop(ONE_BAR, { ...OPTIONS, fromTick: 24, countIn: true, metronome: true }, 10)
    const again = advanceLoop(late, 15.5).passes[1]
    expect(again).toMatchObject({ start: 16, end: 4 })
    expect(again?.cues[0]).toEqual({ beatGroup: 0, at: 0 })
    expect(again?.sounds.filter((sound) => sound.kind === 'click')).toHaveLength(4)
  })

  it('loops only the passage', () => {
    const passage = startLoop(ONE_BAR, { ...OPTIONS, range: { from: 12, to: 36 }, fromTick: 24 }, 0)
    const again = advanceLoop(passage, 0.5).passes[1]
    expect(again?.cues.map((cue) => cue.beatGroup)).toEqual([1, 2])
    expect(again).toMatchObject({ start: 1, end: 2 })
  })

  it('drops a pass once it is over, and follows into the next', () => {
    const next = advanceLoop(advanceLoop(counted, 17.5), 18)
    expect(next.passes.map((pass) => pass.start)).toEqual([18])
    expect(beatGroupAt(next, 19)).toBe(1)
  })
})

describe('speed training', () => {
  it('plays each pass faster by the step, up to where it stops, and says the tempo sounding', () => {
    let loop = startLoop(ONE_BAR, { ...OPTIONS, tempo: 60, speedUp: { step: 30, until: 120 } }, 0)
    for (let time = 0; time < 12; time += 0.25) loop = advanceLoop(loop, time)
    expect(tempoAt(loop, 0.1)).toBeNull()
    const started = startLoop(ONE_BAR, { ...OPTIONS, tempo: 60, speedUp: { step: 30, until: 120 } }, 0)
    const second = advanceLoop(started, 3.5)
    expect(second.passes.map((pass) => [pass.start, pass.tempo, pass.end])).toEqual([
      [0, 60, 4],
      [4, 90, 48 / 18],
    ])
    expect(tempoAt(second, 1)).toBe(60)
    expect(tempoAt(second, 4.5)).toBe(90)
    const third = advanceLoop(advanceLoop(second, 4), 6.2)
    expect(third.passes.at(-1)?.tempo).toBe(120)
    const fourth = advanceLoop(third, 20)
    expect(fourth.passes.at(-1)?.tempo).toBe(120)
  })
})
```

(The first `speed training` loop drops every pass that is over by 12 s, so `tempoAt` at 0.1 s finds none: the passes
it answers from are the loop's queued ones.)

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/schedule`
Expected: FAIL (`swingTick`, `toTick`, `range`, `tempoAt` unknown).

- [ ] **Step 3: Write `src/shared/lib/schedule/swing.ts`**

```ts
import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'

const HALF = TICKS_PER_BEAT / 2
/** A swung 8th is two thirds of the beat. */
const LONG = (TICKS_PER_BEAT * 2) / 3

/**
 * Where a tick sounds swung: in each beat the off-beat 8th moves to two thirds of the beat, and what
 * lies between moves in proportion, so a 16th grid swings with it. The beats stay.
 */
export function swingTick(tick: Tick): number {
  const beat = Math.floor(tick / TICKS_PER_BEAT) * TICKS_PER_BEAT
  const into = tick - beat
  return beat + (into <= HALF ? (into * LONG) / HALF : LONG + ((into - HALF) * (TICKS_PER_BEAT - LONG)) / HALF)
}
```

- [ ] **Step 4: Rewrite `schedule` over a passage, with swing**

In `src/shared/lib/schedule/schedule.ts`:

```ts
/** The tempos a learner can choose, in beats per minute: 50% of the slowest piece (56) is 28. */
export const TEMPO_RANGE = { min: 20, max: 160 } as const
```

```ts
export interface ScheduleOptions {
  /** Beats per minute. */
  readonly tempo: number
  readonly hands: Audible
  /** Where in the piece the pass begins; 0 by default. */
  readonly fromTick?: Tick
  /** Where it ends: the piece's end by default. A note sounding past it is cut there. */
  readonly toTick?: Tick
  readonly countIn?: boolean
  readonly metronome?: boolean
  /** Off-beat 8ths late, long-short; a compound meter never swings. */
  readonly swing?: boolean
}
```

```ts
/** One pass through the piece from `fromTick` to `toTick`: its notes, clicks and cues in seconds from its start. */
export function schedule(performance: Performance, options: ScheduleOptions): Scheduled {
  const { hands, fromTick = 0, toTick = performance.totalTicks } = options
  const tempo = checkedTempo(options.tempo)
  const beat = secondsFor(TICKS_PER_BEAT, tempo)
  const countIn: Sound[] = options.countIn
    ? Array.from({ length: beatsPerBar(performance.meter) }, (_, k) => ({
        kind: 'click',
        at: k * beat,
        accent: k === 0,
      }))
    : []
  const musicStart = countIn.length * beat
  const place = options.swing && !isCompound(performance.meter) ? swingTick : (tick: Tick) => tick
  const at = (tick: Tick) => musicStart + secondsFor(place(tick) - place(fromTick), tempo)
  const inPass = (tick: Tick) => tick >= fromTick && tick < toTick

  const played: Sound[] = performance.notes
    .filter((n) => inPass(n.startTick) && isAudible(n, hands))
    .map((n) => {
      const start = n.startTick + n.roll
      const end = Math.min(n.startTick + n.durationTicks, toTick)
      return {
        kind: 'note',
        midi: n.midi,
        at: at(start),
        duration: Math.max(SHORTEST_NOTE, (at(end) - at(start)) * LEGATO),
        velocity: n.velocity,
      }
    })

  const metronome: Sound[] = options.metronome
    ? performance.bars.flatMap((bar) =>
        Array.from({ length: Math.ceil(bar.beats) }, (_, k) => k).flatMap((k): Sound[] => {
          const tick = bar.startTick + k * TICKS_PER_BEAT
          return inPass(tick) ? [{ kind: 'click', at: at(tick), accent: k === 0 }] : []
        }),
      )
    : []

  const cues = performance.beatGroups.flatMap((group, beatGroup) =>
    inPass(group.tick) ? [{ beatGroup, at: at(group.tick) }] : [],
  )

  return {
    sounds: [...countIn, ...played, ...metronome].sort((a, b) => a.at - b.at),
    cues,
    end: at(toTick),
  }
}
```

(Import `isCompound` from the kernel and `swingTick` from `./swing`.)

- [ ] **Step 5: Rewrite `src/shared/lib/schedule/loop.ts`**

```ts
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import { schedule, type Audible, type Scheduled } from './schedule'

/** Speed training: each pass `step` BPM faster, up to `until`. */
export interface SpeedUp {
  readonly step: number
  readonly until: number
}

/** How Listen loops: a passage (the loop, or the whole piece), the first pass from the cursor. */
export interface LoopOptions {
  readonly hands: Audible
  /** The first pass's tempo. */
  readonly tempo: number
  readonly range: { readonly from: Tick; readonly to: Tick }
  /** Where the first pass starts, inside the range. */
  readonly fromTick: Tick
  readonly speedUp?: SpeedUp | undefined
  readonly countIn?: boolean
  readonly metronome?: boolean
  readonly swing?: boolean
}

/** One pass queued on the audio clock: its sounds, cues and end count from `start`, at its tempo. */
export interface Pass extends Scheduled {
  readonly start: number
  readonly tempo: number
}

/** Listen's loop (spec §2.7): passes of the passage, each queued as the last one nears its end. */
export interface Loop {
  readonly performance: Performance
  readonly options: LoopOptions
  /** The passes queued and not yet over, in time order. */
  readonly passes: readonly Pass[]
  /** How many passes have been queued, the first counting 0. */
  readonly queued: number
}

/** The next pass is queued this long before the last one ends, so the loop never gaps. */
const LOOP_LEAD = 0.5

const endOf = (pass: Pass): number => pass.start + pass.end

function passAt(performance: Performance, options: LoopOptions, index: number, start: number): Pass {
  const first = index === 0
  const tempo = options.speedUp
    ? Math.min(options.speedUp.until, options.tempo + index * options.speedUp.step)
    : options.tempo
  return {
    ...schedule(performance, {
      tempo,
      hands: options.hands,
      fromTick: first ? options.fromTick : options.range.from,
      toTick: options.range.to,
      countIn: first && options.countIn === true,
      metronome: options.metronome === true,
      swing: options.swing === true,
    }),
    start,
    tempo,
  }
}

/** A loop whose first pass plays from `start` on the audio clock. */
export const startLoop = (performance: Performance, options: LoopOptions, start: number): Loop => ({
  performance,
  options,
  passes: [passAt(performance, options, 0, start)],
  queued: 1,
})

/**
 * The loop at `time` on the clock: passes that are over are dropped, and the next is queued once the
 * last is within LOOP_LEAD of its end. The same loop while nothing changes.
 */
export function advanceLoop(loop: Loop, time: number): Loop {
  const last = loop.passes.at(-1)
  const next =
    last && time >= endOf(last) - LOOP_LEAD
      ? [passAt(loop.performance, loop.options, loop.queued, endOf(last))]
      : []
  const passes = [...loop.passes.filter((pass) => endOf(pass) > time), ...next]
  return next.length === 0 && passes.length === loop.passes.length
    ? loop
    : { ...loop, passes, queued: loop.queued + next.length }
}

/** The beat group sounding at `time` on the clock, or null before the music starts. */
export function beatGroupAt(loop: Loop, time: number): number | null {
  let sounding: number | null = null
  for (const pass of loop.passes) {
    for (const cue of pass.cues) if (pass.start + cue.at <= time) sounding = cue.beatGroup
  }
  return sounding
}

/** The tempo of the pass sounding at `time`, or null before any has started. */
export function tempoAt(loop: Loop, time: number): number | null {
  return loop.passes.findLast((pass) => pass.start <= time)?.tempo ?? null
}
```

`src/shared/lib/schedule/index.ts` exports `tempoAt`, `type LoopOptions`, `type SpeedUp` beside the loop's other
names, and `swingTick` from `./swing`.

- [ ] **Step 6: Keep the transport compiling**

`src/features/practice/transport.ts` takes `LoopOptions` in place of `ScheduleOptions` (its callers pass
`range: { from: 0, to: performance.totalTicks }` and `fromTick`; Task 7 rewrites them):

```ts
export function startTransport(
  audio: AudioOutput,
  performance: Performance,
  options: LoopOptions,
  onReach: (beatGroup: number) => void,
): () => void
```

and `use-practice.ts` passes
`{ tempo, hands: audibleHands(state.hands), countIn, metronome, range: { from: 0, to: state.performance.totalTicks }, fromTick: from?.tick ?? 0 }`.

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: PASS.

```bash
git add -A src
git commit -m "Schedule a passage with swing, and loop it with each pass's own tempo for speed training

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: The practice core: Listen and Wait mode, the loop, speed training

**Files:**
- Create: `src/features/practice/{loop,speed}.ts`, `src/features/practice/{loop,speed}.test.ts`
- Modify: `src/features/practice/{practice-machine,use-practice,transport,index}.ts`,
  `src/features/practice/{practice-machine.test.ts,use-practice.test.tsx}`,
  `src/pages/player/ui/{Transport,NowPanel,PlayerPage}.tsx`, `src/pages/player/model/use-player.ts`,
  `src/pages/player/ui/PlayerPage.test.tsx`, `src/shared/i18n/locales/{en,ru}/player.ts`

**Interfaces:**
- Consumes: Task 6's loop.
- Produces (from `@/features/practice`): `PRACTICE_MODES = ['listen', 'wait']`; `interface BarRange { first; last }`;
  `type LoopParam`; `isLoopParam(value)`; `loopParam(bars)`; `readLoop(param, barCount): BarRange | null`;
  `loopBeatGroups(performance, bars)`; `loopTicks(performance, bars)`; `speedUp(tempo, ownTempo): SpeedUp | undefined`;
  `PracticeSetup { mode; hands; tempo; ownTempo; speedTraining; swing; loop: BarRange | null; metronome; countIn }`;
  `Practice { state; passTempo: number | null; play; stop; next; prev; jumpToBar; jumpToBeatGroup; press }`;
  `PracticeState.loop: BarRange | null` (its beat groups, first to last).

- [ ] **Step 1: Write the failing tests**

`src/features/practice/loop.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { isLoopParam, loopBeatGroups, loopParam, loopTicks, readLoop } from './loop'
import { TWO_BARS } from './testing/performances'

describe('the loop’s param', () => {
  it('writes bars as printed, and reads them back', () => {
    expect(loopParam({ first: 2, last: 5 })).toBe('3-6')
    expect(readLoop('3-6', 12)).toEqual({ first: 2, last: 5 })
  })

  it.each(['3', '6-3', '0-2', 'a-b', 3, null])('refuses %j', (value) => {
    expect(isLoopParam(value)).toBe(false)
  })

  it('has no loop past the piece’s last bar', () => {
    expect(readLoop('40-44', 12)).toBeNull()
    expect(readLoop(undefined, 12)).toBeNull()
  })
})

describe('a loop in a performance', () => {
  it('spans its bars’ beat groups and ticks', () => {
    expect(loopBeatGroups(TWO_BARS, { first: 1, last: 1 })).toEqual({ first: 4, last: 7 })
    expect(loopTicks(TWO_BARS, { first: 1, last: 1 })).toEqual({ from: 48, to: 96 })
  })
})
```

`src/features/practice/speed.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { speedUp } from './speed'

describe('speedUp', () => {
  it('adds 5% of the piece’s tempo each pass, up to it', () => {
    expect(speedUp(36, 72)).toEqual({ step: 4, until: 72 })
    expect(speedUp(10, 12)).toEqual({ step: 1, until: 12 })
  })

  it('has nothing to do at or above the piece’s tempo', () => {
    expect(speedUp(72, 72)).toBeUndefined()
    expect(speedUp(90, 72)).toBeUndefined()
  })
})
```

In `src/features/practice/practice-machine.test.ts`, replace the `Listen` and `Step` blocks and extend `Wait mode`
and `configure`:

```ts
  describe('Listen', () => {
    it('plays and stops', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, { type: 'play' }).playing).toBe(true)
      expect(run(state, { type: 'play' }, { type: 'stop' }).playing).toBe(false)
    })

    it('follows the music to the beat group it reached', () => {
      const state = run(initialPractice(ONE_BAR, 'listen', 'both'), { type: 'play' })
      expect(run(state, { type: 'reach', beatGroup: 2 }).beatGroup).toBe(2)
      expect(run(state, { type: 'reach', beatGroup: 0 })).toBe(state)
    })

    it('steps beat by beat, wrapping at both ends', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, { type: 'prev' }).beatGroup).toBe(3)
      expect(run(state, { type: 'next' }, { type: 'next' }).beatGroup).toBe(2)
      expect(run(state, ...Array(4).fill({ type: 'next' })).beatGroup).toBe(0)
    })

    it('jumps to a bar or a beat group', () => {
      const state = initialPractice(TWO_BARS, 'listen', 'both')
      expect(run(state, { type: 'jumpToBar', bar: 1 }).beatGroup).toBe(4)
      expect(run(state, { type: 'jumpToBeatGroup', beatGroup: 6 }).beatGroup).toBe(6)
      expect(run(state, { type: 'jumpToBeatGroup', beatGroup: 99 }).beatGroup).toBe(0)
    })

    it('ignores keys', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, ...press(60))).toBe(state)
    })
  })

  describe('a loop', () => {
    const looped = initialPractice(TWO_BARS, 'listen', 'both', { first: 4, last: 7 })

    it('keeps the cursor inside it', () => {
      expect(looped.beatGroup).toBe(4)
      expect(run(looped, { type: 'jumpToBeatGroup', beatGroup: 1 }).beatGroup).toBe(4)
      expect(run(looped, { type: 'prev' }).beatGroup).toBe(7)
      expect(run(looped, ...Array(4).fill({ type: 'next' })).beatGroup).toBe(4)
    })

    it('takes Wait mode round it instead of finishing', () => {
      const last = run(initialPractice(TWO_BARS, 'wait', 'rh', { first: 4, last: 7 }), { type: 'play' }, {
        type: 'jumpToBeatGroup',
        beatGroup: 7,
      })
      expect(run(last, { type: 'next' })).toMatchObject({ beatGroup: 4, outcome: 'waiting', playing: true })
    })
  })
```

In `Wait mode`, every test that presses keys first plays (`run(initialPractice(ONE_BAR, 'wait', 'rh'), { type: 'play' }, …)`),
and add:

```ts
    it('takes keys only while playing', () => {
      const stopped = initialPractice(ONE_BAR, 'wait', 'rh')
      expect(run(stopped, ...press(60, 64, 67))).toBe(stopped)
    })

    it('finishes after the last beat group, stopped, and plays again from the start', () => {
      const last = run(initialPractice(ONE_BAR, 'wait', 'rh'), { type: 'play' }, {
        type: 'jumpToBeatGroup',
        beatGroup: 3,
      })
      const finished = run(last, { type: 'next' })
      expect(finished).toMatchObject({ outcome: 'finished', beatGroup: 3, playing: false, expected: [] })
      expect(run(finished, { type: 'play' })).toMatchObject({ beatGroup: 0, playing: true, outcome: 'waiting' })
    })
```

(`finishes after the last beat group` and `starts over from the first beat group` go: `restart` is gone; Again is
Play.) In `configure`, the events carry `loop: null`, a mode change is between `listen` and `wait`, and add:

```ts
    it('moves the cursor into a new loop', () => {
      const state = initialPractice(TWO_BARS, 'listen', 'both')
      expect(
        run(state, { type: 'configure', performance: TWO_BARS, mode: 'listen', hands: 'both', loop: { first: 4, last: 7 } })
          .beatGroup,
      ).toBe(4)
    })
```

In `src/features/practice/use-practice.test.tsx`: `LISTEN` gains `ownTempo: 60, speedTraining: false, swing: false,
loop: null`; `usePractice: Step` becomes `usePractice: moving` ("sounds every beat group moved to, in the audible
hands", using `jumpToBar(1)` and `jumpToBeatGroup(2)` in `mode: 'listen'`, stopped); every Wait mode test first calls
`act(() => result.current.play())`; and add:

```ts
describe('usePractice: a loop and speed training', () => {
  it('loops the passage, and starts again inside it when the loop changes while playing', () => {
    const { result, rerender } = renderPractice(TWO_BARS)
    act(() => result.current.play())
    rerender({ performance: TWO_BARS, setup: { ...LISTEN, loop: { first: 1, last: 1 } } })
    expect(result.current.state.beatGroup).toBe(4)
    const pass = audio.played.at(-1)
    expect(new Set(notesOf(pass?.sounds ?? []).map((sound) => sound.midi % 12))).toEqual(new Set([7, 11, 2]))
  })

  it('says the tempo of the pass sounding while speed training plays', () => {
    const { result } = renderPractice(ONE_BAR, { tempo: 60, ownTempo: 120, speedTraining: true })
    act(() => result.current.play())
    clockTo(0.1 + 1)
    expect(result.current.passTempo).toBe(60)
    clockTo(0.1 + 3.5)
    clockTo(0.1 + 4.2)
    expect(result.current.passTempo).toBe(66)
    act(() => result.current.stop())
    expect(result.current.passTempo).toBeNull()
  })

  it('goes round a loop in Wait mode', () => {
    const { result } = renderPractice(TWO_BARS, { mode: 'wait', hands: 'lh', loop: { first: 1, last: 1 } })
    act(() => result.current.play())
    act(() => result.current.jumpToBeatGroup(7))
    wait(1000)
    expect(result.current.state).toMatchObject({ beatGroup: 4, playing: true })
  })
})
```

(`TWO_BARS`' second bar is G: G B D, pitch classes 7, 11, 2. At 120 BPM the step is 6.)

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/features/practice`
Expected: FAIL.

- [ ] **Step 3: Write `src/features/practice/loop.ts` and `speed.ts`**

```ts
import type { Performance } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'

/** The bars a loop goes round, first to last, counted from 0. */
export interface BarRange {
  readonly first: number
  readonly last: number
}

/** A loop in the URL: its bars as printed, `3-6`. */
export type LoopParam = `${number}-${number}`

const WRITTEN = /^([1-9]\d*)-([1-9]\d*)$/

export function isLoopParam(value: unknown): value is LoopParam {
  const match = typeof value === 'string' ? WRITTEN.exec(value) : null
  return match !== null && Number(match[1]) <= Number(match[2])
}

export const loopParam = ({ first, last }: BarRange): LoopParam => `${first + 1}-${last + 1}`

/** The bars a loop param names, or none: a param past the piece's last bar is another arrangement's. */
export function readLoop(param: LoopParam | undefined, bars: number): BarRange | null {
  const match = param === undefined ? null : WRITTEN.exec(param)
  if (!match) return null
  const first = Number(match[1]) - 1
  const last = Number(match[2]) - 1
  return first <= last && last < bars ? { first, last } : null
}

/** The loop's first and last beat groups; none when no note starts in its bars. */
export function loopBeatGroups(performance: Performance, bars: BarRange): BarRange | null {
  const inside = (bar: number) => bar >= bars.first && bar <= bars.last
  const first = performance.beatGroups.findIndex((group) => inside(group.bar))
  const last = performance.beatGroups.findLastIndex((group) => inside(group.bar))
  return first < 0 ? null : { first, last }
}

/** The ticks a loop spans, from its first bar's start to its last bar's end. */
export function loopTicks(performance: Performance, bars: BarRange): { from: Tick; to: Tick } {
  const first = performance.bars[bars.first]
  const last = performance.bars[bars.last]
  return {
    from: first?.startTick ?? 0,
    to: last ? last.startTick + Math.round(last.beats * TICKS_PER_BEAT) : performance.totalTicks,
  }
}
```

```ts
import type { SpeedUp } from '@/shared/lib/schedule'

/** Each pass of speed training adds this share of the piece's tempo. */
const STEP = 0.05

/** Speed training from a tempo: 5% of the piece's tempo each pass (1 BPM at least), up to it; nothing at or above it. */
export function speedUp(tempo: number, ownTempo: number): SpeedUp | undefined {
  return tempo < ownTempo
    ? { step: Math.max(1, Math.round(ownTempo * STEP)), until: ownTempo }
    : undefined
}
```

- [ ] **Step 4: Rewrite the machine** — `src/features/practice/practice-machine.ts`

```ts
import type { Performance } from '@/shared/lib/arrangement'
import { pitchClass, type Midi, type PitchClass } from '@/shared/lib/music'
import { audibleHands, type Audible, type Hands } from '@/shared/lib/schedule'
import type { BarRange } from './loop'

/** Listen: the app plays at a tempo. Wait mode: the app waits for your notes (spec §2.7). */
export const PRACTICE_MODES = ['listen', 'wait'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]
export type Outcome = 'waiting' | 'correct' | 'wrong' | 'finished'

export interface PracticeState {
  readonly performance: Performance
  readonly mode: PracticeMode
  readonly hands: Hands
  /** The loop's beat groups, first to last; null plays the whole piece. */
  readonly loop: BarRange | null
  /** Where the learner is. */
  readonly beatGroup: number
  /** Listen: the transport runs. Wait mode: the app waits for notes. */
  readonly playing: boolean
  /** Wait mode: the pitch classes the practised hands play here, lowest first. */
  readonly expected: readonly PitchClass[]
  readonly received: readonly PitchClass[]
  readonly outcome: Outcome
  /** The last wrong key, to show. */
  readonly wrong: Midi | null
}

export type PracticeEvent =
  | {
      readonly type: 'configure'
      readonly performance: Performance
      readonly mode: PracticeMode
      readonly hands: Hands
      readonly loop: BarRange | null
    }
  | { readonly type: 'play' }
  | { readonly type: 'stop' }
  /** The transport arrived at a beat group. */
  | { readonly type: 'reach'; readonly beatGroup: number }
  | { readonly type: 'next' }
  | { readonly type: 'prev' }
  | { readonly type: 'jumpToBar'; readonly bar: number }
  | { readonly type: 'jumpToBeatGroup'; readonly beatGroup: number }
  | { readonly type: 'noteOn'; readonly midi: Midi }

/** The hands Wait mode waits for: the audible ones, never the doubled tune. */
export const practisedHands = (hands: Hands): Audible => ({ ...audibleHands(hands), melody: false })

/** What the app plays in Wait mode: the hands not practised, and the tune. */
export function accompanyingHands(hands: Hands): Audible {
  const practised = practisedHands(hands)
  return { rh: !practised.rh, lh: !practised.lh, melody: true }
}

function expectedAt(performance: Performance, beatGroup: number, hands: Hands): PitchClass[] {
  const practised = practisedHands(hands)
  const pcs = new Set<PitchClass>()
  for (const index of performance.beatGroups[beatGroup]?.notes ?? []) {
    const played = performance.notes[index]
    if (played && practised[played.hand]) pcs.add(pitchClass(played.midi))
  }
  return [...pcs].sort((a, b) => a - b)
}

/** The beat groups the cursor may be on: the loop's, or the whole piece's. */
const bounds = (state: Pick<PracticeState, 'performance' | 'loop'>): BarRange =>
  state.loop ?? { first: 0, last: Math.max(0, state.performance.beatGroups.length - 1) }

const clamp = (state: PracticeState, beatGroup: number) => {
  const { first, last } = bounds(state)
  return Math.min(last, Math.max(first, beatGroup))
}

/** Arriving at a beat group: in Wait mode it sets what is expected and waits. */
function moveTo(state: PracticeState, beatGroup: number): PracticeState {
  return {
    ...state,
    beatGroup,
    expected: state.mode === 'wait' ? expectedAt(state.performance, beatGroup, state.hands) : [],
    received: [],
    outcome: 'waiting',
    wrong: null,
  }
}

export function initialPractice(
  performance: Performance,
  mode: PracticeMode,
  hands: Hands,
  loop: BarRange | null = null,
): PracticeState {
  const state: PracticeState = {
    performance,
    mode,
    hands,
    loop,
    beatGroup: 0,
    playing: false,
    expected: [],
    received: [],
    outcome: 'waiting',
    wrong: null,
  }
  return moveTo(state, bounds(state).first)
}

function next(state: PracticeState): PracticeState {
  if (state.performance.beatGroups.length === 0) return state
  const { first, last } = bounds(state)
  if (state.beatGroup < last) return moveTo(state, state.beatGroup + 1)
  if (state.mode === 'listen' || state.loop) return moveTo(state, first)
  return { ...state, playing: false, expected: [], received: [], outcome: 'finished', wrong: null }
}

function prev(state: PracticeState): PracticeState {
  if (state.performance.beatGroups.length === 0) return state
  const { first, last } = bounds(state)
  if (state.beatGroup > first) return moveTo(state, state.beatGroup - 1)
  return state.mode === 'wait' ? moveTo(state, first) : moveTo(state, last)
}

function noteOn(state: PracticeState, key: Midi): PracticeState {
  const done = state.outcome === 'correct' || state.outcome === 'finished'
  if (state.mode !== 'wait' || !state.playing || done || state.expected.length === 0) return state
  const pc = pitchClass(key)
  if (!state.expected.includes(pc)) return { ...state, outcome: 'wrong', wrong: key }
  const received = state.received.includes(pc) ? state.received : [...state.received, pc]
  const complete = state.expected.every((expected) => received.includes(expected))
  return { ...state, received, outcome: complete ? 'correct' : 'waiting', wrong: null }
}

/** Every rule of Listen and Wait mode; the practice hook connects it to time and sound. */
export function practiceReducer(state: PracticeState, event: PracticeEvent): PracticeState {
  switch (event.type) {
    case 'configure': {
      const configured: PracticeState = {
        ...state,
        performance: event.performance,
        mode: event.mode,
        hands: event.hands,
        loop: event.loop,
        playing: state.playing && event.mode === state.mode,
      }
      return moveTo(configured, clamp(configured, state.beatGroup))
    }
    case 'play':
      return state.outcome === 'finished'
        ? { ...moveTo(state, bounds(state).first), playing: true }
        : { ...state, playing: true }
    case 'stop':
      return state.playing ? { ...state, playing: false } : state
    case 'reach': {
      const moves =
        event.beatGroup !== state.beatGroup &&
        Number.isInteger(event.beatGroup) &&
        clamp(state, event.beatGroup) === event.beatGroup
      return state.mode === 'listen' && state.playing && moves
        ? { ...state, beatGroup: event.beatGroup }
        : state
    }
    case 'next':
      return next(state)
    case 'prev':
      return prev(state)
    case 'jumpToBar': {
      const target = state.performance.beatGroups.findIndex((group) => group.bar === event.bar)
      return target < 0 ? state : moveTo(state, clamp(state, target))
    }
    case 'jumpToBeatGroup':
      return event.beatGroup >= 0 && event.beatGroup < state.performance.beatGroups.length
        ? moveTo(state, clamp(state, event.beatGroup))
        : state
    case 'noteOn':
      return noteOn(state, event.midi)
  }
}
```

(The machine's `loop` holds beat groups; `BarRange` is only the shape `{ first, last }`.)

- [ ] **Step 5: Rewrite the hook and the transport**

`src/features/practice/transport.ts`:

```ts
import { PLAY_DELAY, type AudioOutput } from '@/shared/api/audio'
import type { Performance } from '@/shared/lib/arrangement'
import {
  advanceLoop,
  beatGroupAt,
  startLoop,
  tempoAt,
  type LoopOptions,
  type Pass,
} from '@/shared/lib/schedule'

/** How often the transport looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/**
 * Listen's transport: plays the loop's passes on the audio clock, and reports each beat group as it
 * sounds and each pass's tempo as it starts. Returns the function that stops it.
 */
export function startTransport(
  audio: AudioOutput,
  performance: Performance,
  options: LoopOptions,
  on: { readonly reach: (beatGroup: number) => void; readonly tempo: (tempo: number) => void },
): () => void {
  const play = (pass: Pass) => audio.play(pass.sounds, pass.start)
  let loop = startLoop(performance, options, audio.now() + PLAY_DELAY)
  loop.passes.forEach(play)

  let reached: number | null = null
  let tempo: number | null = null
  const follow = () => {
    const now = audio.now()
    const next = advanceLoop(loop, now)
    next.passes.filter((pass) => !loop.passes.includes(pass)).forEach(play)
    loop = next
    const beatGroup = beatGroupAt(loop, now)
    if (beatGroup !== null && beatGroup !== reached) {
      reached = beatGroup
      on.reach(beatGroup)
    }
    const sounding = tempoAt(loop, now)
    if (sounding !== null && sounding !== tempo) {
      tempo = sounding
      on.tempo(sounding)
    }
  }
  const timer = setInterval(follow, FOLLOW_INTERVAL_MS)

  return () => {
    clearInterval(timer)
    audio.stop()
  }
}
```

`src/features/practice/use-practice.ts`:

```ts
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import { audibleHands, beatGroupSounds, untilNextBeatGroup, type Hands } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'
import { loopBeatGroups, loopTicks, type BarRange } from './loop'
import {
  accompanyingHands,
  initialPractice,
  practiceReducer,
  type PracticeEvent,
  type PracticeMode,
  type PracticeState,
} from './practice-machine'
import { speedUp } from './speed'
import { startTransport } from './transport'

export interface PracticeSetup {
  readonly mode: PracticeMode
  readonly hands: Hands
  /** The chosen tempo; every Play starts at it. */
  readonly tempo: number
  /** The piece's own: speed training climbs to it. */
  readonly ownTempo: number
  readonly speedTraining: boolean
  readonly swing: boolean
  /** The bars looped; null plays the whole piece. */
  readonly loop: BarRange | null
  readonly metronome: boolean
  readonly countIn: boolean
}

export interface Practice {
  readonly state: PracticeState
  /** The tempo of the pass sounding while Listen plays; null otherwise. */
  readonly passTempo: number | null
  /** Plays, or in Wait mode starts waiting; after Finished, again from the start. */
  play(): void
  stop(): void
  next(): void
  prev(): void
  jumpToBar(bar: number): void
  jumpToBeatGroup(beatGroup: number): void
  /** An on-screen key: the same as a MIDI note-on. */
  press(midi: Midi): void
}

/** After a right answer in Wait mode, the app plays the other hand and moves on this much later. */
const CORRECT_PAUSE_MS = 150

const sameLoop = (a: BarRange | null, b: BarRange | null) =>
  a === b || (a !== null && b !== null && a.first === b.first && a.last === b.last)

/**
 * Connects the practice machine to time, audio and MIDI (spec §2.7). The machine decides; this hook
 * plays what it decides, follows the audio clock in Listen, and moves Wait mode on.
 *
 * A new `performance` object is a new piece to practise; hand in the same object while the
 * arrangement is unchanged (`useMemo` over `arrange`).
 */
export function usePractice(performance: Performance, setup: PracticeSetup): Practice {
  const { audio, midi } = useServices()
  const loopFirst = setup.loop?.first
  const loopLast = setup.loop?.last
  const bars = useMemo(
    () => (loopFirst === undefined || loopLast === undefined ? null : { first: loopFirst, last: loopLast }),
    [loopFirst, loopLast],
  )
  const loop = useMemo(() => (bars ? loopBeatGroups(performance, bars) : null), [performance, bars])
  const passage = useMemo(
    () => (bars && loop ? loopTicks(performance, bars) : { from: 0, to: performance.totalTicks }),
    [performance, bars, loop],
  )
  const [state, dispatch] = useReducer(practiceReducer, undefined, () =>
    initialPractice(performance, setup.mode, setup.hands, loop),
  )
  const [passTempo, setPassTempo] = useState<number | null>(null)
  // Bumped when the learner moves while Listen plays: the pass starts again from there.
  const [passRequest, setPassRequest] = useState(0)

  // A new performance, mode, hands or loop reconfigures the machine before anything renders from it.
  if (
    state.performance !== performance ||
    state.mode !== setup.mode ||
    state.hands !== setup.hands ||
    !sameLoop(state.loop, loop)
  ) {
    dispatch({ type: 'configure', performance, mode: setup.mode, hands: setup.hands, loop })
  }

  const latest = useRef({ state, setup })
  useEffect(() => {
    latest.current = { state, setup }
  })

  const { tempo, ownTempo, speedTraining, swing, metronome, countIn } = setup
  const up = speedTraining ? speedUp(tempo, ownTempo) : undefined
  const upStep = up?.step
  const upUntil = up?.until
  const listening = state.mode === 'listen' && state.playing

  // Listen: the transport runs while playing, from where the learner is, and starts again from the
  // current beat group whenever what it plays changes.
  useEffect(() => {
    if (!listening) return
    const from = state.performance.beatGroups[latest.current.state.beatGroup]
    return startTransport(
      audio,
      state.performance,
      {
        tempo,
        hands: audibleHands(state.hands),
        range: passage,
        fromTick: from?.tick ?? passage.from,
        speedUp: upStep === undefined || upUntil === undefined ? undefined : { step: upStep, until: upUntil },
        countIn,
        metronome,
        swing,
      },
      { reach: (beatGroup) => dispatch({ type: 'reach', beatGroup }), tempo: setPassTempo },
    )
  }, [
    audio,
    listening,
    state.performance,
    state.hands,
    passage,
    tempo,
    upStep,
    upUntil,
    swing,
    metronome,
    countIn,
    passRequest,
  ])

  // Wait mode, playing: once the practised hand has played (or has nothing to play), the app plays the
  // rest of the beat group and moves on.
  useEffect(() => {
    if (state.mode !== 'wait' || !state.playing) return
    const nothingToPlay = state.outcome === 'waiting' && state.expected.length === 0
    if (state.outcome !== 'correct' && !nothingToPlay) return
    const hands = accompanyingHands(state.hands)
    audio.play(beatGroupSounds(state.performance, state.beatGroup, { tempo, hands }))
    const delay =
      state.outcome === 'correct'
        ? CORRECT_PAUSE_MS
        : untilNextBeatGroup(state.performance, state.beatGroup, { tempo }) * 1000
    const timer = setTimeout(() => dispatch({ type: 'next' }), delay)
    return () => clearTimeout(timer)
  }, [audio, state, tempo])

  useEffect(
    () =>
      midi?.onNote((event) => {
        if (event.on) dispatch({ type: 'noteOn', midi: event.midi })
      }),
    [midi],
  )

  useEffect(() => () => audio.stop(), [audio])

  const actions = useMemo(() => {
    /** A move sounds where it lands, except while Listen plays, which starts a new pass there. */
    const move = (event: PracticeEvent) => {
      const { state: current, setup: now } = latest.current
      const moved = practiceReducer(current, event)
      dispatch(event)
      if (moved === current) return
      if (current.mode === 'listen' && current.playing) setPassRequest((request) => request + 1)
      else {
        const hands = audibleHands(moved.hands)
        audio.play(beatGroupSounds(moved.performance, moved.beatGroup, { tempo: now.tempo, hands }))
      }
    }
    return {
      play() {
        void audio.unlock()
        dispatch({ type: 'play' })
      },
      stop: () => dispatch({ type: 'stop' }),
      next: () => move({ type: 'next' }),
      prev: () => move({ type: 'prev' }),
      jumpToBar: (bar: number) => move({ type: 'jumpToBar', bar }),
      jumpToBeatGroup: (beatGroup: number) => move({ type: 'jumpToBeatGroup', beatGroup }),
      press: (key: Midi) => dispatch({ type: 'noteOn', midi: key }),
    }
  }, [audio])

  return { state, passTempo: listening ? passTempo : null, ...actions }
}
```

`src/features/practice/index.ts` exports `BarRange`, `LoopParam`, `isLoopParam`, `loopParam`, `readLoop`,
`loopBeatGroups`, `loopTicks` from `./loop`, `speedUp` from `./speed`; `PracticeState`'s export list drops nothing
else.

- [ ] **Step 6: Keep the old Player working until Task 10 replaces it**

- `src/pages/player/model/use-player.ts`: `usePractice(performance, { mode: search.mode, hands: search.hands, tempo,
  ownTempo: piece.tempo, speedTraining: false, swing: false, loop: null, metronome: toggles.metronome, countIn:
  toggles.countIn })`.
- `src/pages/player/ui/Transport.tsx`, one row for both modes:

```tsx
import { ChevronLeft, ChevronRight, Play, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Back, Play or Stop, Next; in Wait mode, Hear these notes (or Stop). */
export function Transport({
  practice,
  hearing,
  onHear,
}: {
  practice: Practice
  /** Hear these notes' sound is playing: the button stops it. */
  hearing: boolean
  onHear: () => void
}) {
  const { t } = useTranslation('player')
  const { mode, playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 pb-2 landscape-phone:pb-0">
      <RoundButton label={t('back')} icon={ChevronLeft} onClick={practice.prev} />
      <Button
        size="play"
        className="landscape-phone:size-14"
        aria-label={playing ? t('stop') : t('play')}
        onClick={playing ? practice.stop : practice.play}
      >
        {playing ? <Square aria-hidden /> : <Play aria-hidden />}
      </Button>
      <RoundButton label={t('next')} icon={ChevronRight} onClick={practice.next} />
      {mode === 'wait' ? (
        <Button variant="soft" onClick={onHear}>
          {hearing ? <Square data-icon="inline-start" /> : <Volume2 data-icon="inline-start" />}
          {hearing ? t('stop') : t('hear')}
        </Button>
      ) : null}
    </div>
  )
}
```

- `NowPanel.tsx`: Again calls `onAgain`, which `PlayerPage` wires to `practice.play`.
- `src/shared/i18n/locales/{en,ru}/player.ts`: `modes` loses `step`; `nextBar` and `restart` go.
- `PlayerPage.test.tsx`: "steps through beat by beat" clicks Next (no mode change); "waits for the notes in Wait
  mode" clicks Play before pressing keys.

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: PASS.

```bash
git add -A src
git commit -m "Practise in Listen or Wait mode with Play in both, round a loop, with speed training and swing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: The sheet: `SheetMusic`

**Files:**
- Create: `src/widgets/sheet-music/index.ts`, `src/widgets/sheet-music/model/{nearest-beat-group,follow,bar-at}.ts`,
  `src/widgets/sheet-music/model/{nearest-beat-group,follow,bar-at}.test.ts`,
  `src/widgets/sheet-music/ui/{SheetMusic,SheetOverlay,SheetLabels,SheetCursor,BarTargets,LoopBand,LoopGrip}.tsx`,
  `src/widgets/sheet-music/ui/use-follow.ts`, `src/widgets/sheet-music/ui/SheetMusic.test.tsx`

**Interfaces:**
- Consumes: `ScoreView`, `ScoreLayout`, `xAtTick` (Task 5); `notate` (Task 4); `BarRange` (Task 7).
- Produces (from `@/widgets/sheet-music`): `SheetMusic({ performance, headings, current, loop, fingers, muted,
  onJump, onLoopChange })`.

- [ ] **Step 1: Write the failing model tests**

`src/widgets/sheet-music/model/nearest-beat-group.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { nearestBeatGroup } from './nearest-beat-group'

/** Each tick at its own x: 10px a tick. */
const xOf = (tick: number) => tick * 10

describe('nearestBeatGroup', () => {
  it('finds the bar’s beat group nearest an x', () => {
    expect(nearestBeatGroup(TWO_BARS, 1, xOf, 480)).toBe(4)
    expect(nearestBeatGroup(TWO_BARS, 1, xOf, 700)).toBe(5)
    expect(nearestBeatGroup(TWO_BARS, 1, xOf, 9999)).toBe(7)
  })

  it('has none in a bar with no beat group', () => {
    expect(nearestBeatGroup(TWO_BARS, 9, xOf, 0)).toBeNull()
  })
})
```

`src/widgets/sheet-music/model/follow.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { followScroll } from './follow'

describe('followScroll', () => {
  it('leaves the view while the cursor is in its middle half', () => {
    expect(followScroll(300, { left: 0, width: 800 })).toBeNull()
  })

  it('scrolls to put the cursor a quarter in once it leaves', () => {
    expect(followScroll(700, { left: 0, width: 800 })).toBe(500)
    expect(followScroll(100, { left: 400, width: 800 })).toBe(0)
  })
})
```

`src/widgets/sheet-music/model/bar-at.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { barAt } from './bar-at'

const measures = [
  { x: 0, width: 200 },
  { x: 200, width: 150 },
  { x: 350, width: 150 },
]

describe('barAt', () => {
  it('finds the bar under an x, the ends for anything outside', () => {
    expect(barAt(measures, 250)).toBe(1)
    expect(barAt(measures, -40)).toBe(0)
    expect(barAt(measures, 9999)).toBe(2)
  })
})
```

- [ ] **Step 2: Write the model**

`src/widgets/sheet-music/model/nearest-beat-group.ts`:

```ts
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'

/** The beat group of a bar nearest an x on the sheet: where a tap on the bar lands. */
export function nearestBeatGroup(
  performance: Performance,
  bar: number,
  xOf: (tick: Tick) => number,
  x: number,
): number | null {
  let nearest: number | null = null
  let distance = Infinity
  performance.beatGroups.forEach((group, index) => {
    if (group.bar !== bar) return
    const away = Math.abs(xOf(group.tick) - x)
    if (away < distance) {
      nearest = index
      distance = away
    }
  })
  return nearest
}
```

`src/widgets/sheet-music/model/follow.ts`:

```ts
/**
 * Where the sheet scrolls to keep the cursor in sight: nowhere while it is in the view's middle half,
 * else so it stands a quarter in.
 */
export function followScroll(x: number, view: { left: number; width: number }): number | null {
  if (x >= view.left + view.width / 4 && x <= view.left + (view.width * 3) / 4) return null
  return Math.max(0, x - view.width / 4)
}
```

`src/widgets/sheet-music/model/bar-at.ts`:

```ts
/** The bar under an x on the sheet; the first or last for an x outside them. */
export function barAt(measures: readonly { x: number; width: number }[], x: number): number {
  const index = measures.findIndex((measure) => x < measure.x + measure.width)
  return index < 0 ? measures.length - 1 : index
}
```

- [ ] **Step 3: Write the failing component test** — `src/widgets/sheet-music/ui/SheetMusic.test.tsx`

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import type { BarRange } from '@/features/practice'
import { stubBox, stubScrolling } from '@/shared/test/layout'
import { SheetMusic } from './SheetMusic'

function renderSheet({ current = 0, loop = null }: { current?: number; loop?: BarRange | null } = {}) {
  const onJump = vi.fn()
  const onLoopChange = vi.fn()
  const view = render(
    <SheetMusic
      performance={TWO_BARS}
      headings={['Verse']}
      current={current}
      loop={loop}
      fingers={false}
      muted={undefined}
      onJump={onJump}
      onLoopChange={onLoopChange}
    />,
  )
  return { ...view, onJump, onLoopChange }
}

describe('SheetMusic', () => {
  it('names each bar by its chords, the cursor’s marked', async () => {
    renderSheet({ current: 5 })
    expect(await screen.findByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 1: C' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('button', { name: 'Bar 2: G' })).toHaveAttribute('aria-current', 'step')
  })

  it('jumps to a bar’s first beat group from the keyboard, and to the nearest one under a tap', async () => {
    const user = userEvent.setup()
    const { onJump } = renderSheet()
    const second = await screen.findByRole('button', { name: 'Bar 2: G' })
    second.focus()
    await user.keyboard('{Enter}')
    expect(onJump).toHaveBeenLastCalledWith(4)
    stubBox(second, { left: 0, width: 400, height: 200 })
    fireEvent.click(second, { detail: 1, clientX: 9999 })
    expect(onJump).toHaveBeenLastCalledWith(7)
  })

  it('moves the loop’s ends with the arrow keys, never past each other', async () => {
    const user = userEvent.setup()
    const { onLoopChange } = renderSheet({ loop: { first: 0, last: 0 } })
    const end = await screen.findByRole('slider', { name: 'Loop end' })
    expect(end).toHaveAttribute('aria-valuetext', 'Bar 1')
    end.focus()
    await user.keyboard('{ArrowRight}')
    expect(onLoopChange).toHaveBeenLastCalledWith({ first: 0, last: 1 })
    screen.getByRole('slider', { name: 'Loop start' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onLoopChange).toHaveBeenCalledTimes(1)
  })

  it('scrolls to keep the cursor in sight', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 100, scrollWidth: 2000 })
    const { rerender, onJump, onLoopChange } = renderSheet({ current: 0 })
    await screen.findByRole('button', { name: 'Bar 2: G' })
    act(() =>
      rerender(
        <SheetMusic
          performance={TWO_BARS}
          headings={['Verse']}
          current={7}
          loop={null}
          fingers={false}
          muted={undefined}
          onJump={onJump}
          onLoopChange={onLoopChange}
        />,
      ),
    )
    expect(scrolls.at(-1)).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 4: Write the components**

`src/widgets/sheet-music/ui/use-follow.ts`:

```ts
import { useEffect, type RefObject } from 'react'
import { useMediaQuery } from '@/shared/lib'
import { followScroll } from '../model/follow'

/**
 * Keeps the cursor in sight in the sheet's scroller. The cursor's x counts from the engraving's
 * box, which sits `offsetLeft` into the scroller.
 */
export function useFollow(
  scroller: RefObject<HTMLElement | null>,
  cursor: RefObject<HTMLElement | null>,
  x: number | null,
) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  useEffect(() => {
    const view = scroller.current
    const box = cursor.current?.offsetParent
    if (!view || x === null || view.scrollWidth <= view.clientWidth) return
    const origin = box instanceof HTMLElement ? box.offsetLeft : 0
    const left = followScroll(origin + x, { left: view.scrollLeft, width: view.clientWidth })
    if (left !== null) view.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [scroller, cursor, x, reduceMotion])
}
```

`src/widgets/sheet-music/ui/SheetCursor.tsx`:

```tsx
import type { Ref } from 'react'
import type { ScoreLayout } from '@/shared/ui/score'

/** How far left of a notehead's edge the cursor's band starts, and how far it reaches past the staff. */
const LEAD = 8
const REACH = 16

/** The cursor: a sky-mist band behind the notes of the beat group now, moved as they move. */
export function SheetCursor({ x, layout, ref }: { x: number; layout: ScoreLayout; ref: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute top-0 left-0 z-0 w-7 rounded-md bg-secondary transition-transform duration-200 ease-out"
      style={{
        top: layout.staffTop - REACH,
        height: layout.staffBottom - layout.staffTop + 2 * REACH,
        transform: `translateX(${x - LEAD}px)`,
      }}
    />
  )
}
```

`src/widgets/sheet-music/ui/SheetLabels.tsx`:

```tsx
import type { Performance } from '@/shared/lib/arrangement'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'

/**
 * Over the staff: each bar's number, a section's name at its first bar, and each chord symbol at its
 * onset (spec §2.6). The bars' buttons carry the same words for a screen reader.
 */
export function SheetLabels({
  layout,
  performance,
  headings,
}: {
  layout: ScoreLayout
  performance: Performance
  headings: readonly string[]
}) {
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-full h-11">
      {layout.measures.map((measure, index) => {
        const section = performance.bars[index]?.section
        const starts = section !== undefined && section !== performance.bars[index - 1]?.section
        return (
          <span
            key={index}
            className="absolute top-0 text-xs whitespace-nowrap text-muted-foreground tabular-nums"
            style={{ left: measure.x + 4 }}
          >
            {index + 1}
            {starts && headings[section] ? ` · ${headings[section]}` : null}
          </span>
        )
      })}
      {performance.chords.map((chord, index) => (
        <span
          key={index}
          className="absolute bottom-0.5 font-display text-lg font-semibold whitespace-nowrap"
          style={{ left: xAtTick(layout, chord.startTick) }}
        >
          {chord.symbol}
        </span>
      ))}
    </div>
  )
}
```

`src/widgets/sheet-music/ui/BarTargets.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { Performance } from '@/shared/lib/arrangement'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { nearestBeatGroup } from '../model/nearest-beat-group'

/**
 * Each bar as a button over the staff: a tap jumps to the beat group nearest it, Enter or Space to
 * the bar's first.
 */
export function BarTargets({
  layout,
  performance,
  current,
  onJump,
}: {
  layout: ScoreLayout
  performance: Performance
  /** The bar the cursor is in. */
  current: number | undefined
  onJump: (beatGroup: number) => void
}) {
  const { t } = useTranslation('music')
  return layout.measures.map((measure, bar) => {
    const chords = (performance.bars[bar]?.chords ?? []).flatMap(
      (index) => performance.chords[index]?.symbol ?? [],
    )
    return (
      <button
        key={bar}
        type="button"
        aria-label={t('sheet.barChords', { n: bar + 1, chords: chords.join(' ') })}
        aria-current={bar === current ? 'step' : undefined}
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect()
          const target =
            event.detail === 0
              ? performance.beatGroups.findIndex((group) => group.bar === bar)
              : nearestBeatGroup(
                  performance,
                  bar,
                  (tick) => xAtTick(layout, tick),
                  measure.x + event.clientX - box.left,
                )
          if (target !== null && target >= 0) onJump(target)
        }}
        className="absolute inset-y-0 z-20 cursor-pointer rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
        style={{ left: measure.x, width: measure.width }}
      />
    )
  })
}
```

`src/widgets/sheet-music/ui/LoopGrip.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { barAt } from '../model/bar-at'

const STEPS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
}

/** One end of the loop: a slider over the bars, dragged or moved by the arrow keys between `min` and `max`. */
export function LoopGrip({
  label,
  x,
  bar,
  min,
  max,
  measures,
  onMove,
}: {
  label: string
  x: number
  bar: number
  min: number
  max: number
  measures: readonly { x: number; width: number }[]
  onMove: (bar: number) => void
}) {
  const { t } = useTranslation('music')
  const move = (to: number) => {
    const next = Math.min(max, Math.max(min, to))
    if (next !== bar) onMove(next)
  }
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min + 1}
      aria-valuemax={max + 1}
      aria-valuenow={bar + 1}
      aria-valuetext={t('sheet.bar', { n: bar + 1 })}
      onKeyDown={(event) => {
        const step = STEPS[event.key]
        const to = event.key === 'Home' ? min : event.key === 'End' ? max : step === undefined ? null : bar + step
        if (to === null) return
        event.preventDefault()
        move(to)
      }}
      onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        const box = event.currentTarget.parentElement?.getBoundingClientRect()
        if (box) move(barAt(measures, event.clientX - box.left))
      }}
      className="absolute inset-y-0 z-30 flex w-11 -translate-x-1/2 cursor-ew-resize touch-none justify-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring"
      style={{ left: x }}
    >
      <span aria-hidden className="h-full w-1 rounded-full bg-selected" />
    </div>
  )
}
```

`src/widgets/sheet-music/ui/LoopBand.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { ScoreLayout } from '@/shared/ui/score'
import { LoopGrip } from './LoopGrip'

/** The loop: a muted band behind its bars, and a grip at each end (spec §2.6). */
export function LoopBand({
  layout,
  loop,
  onChange,
}: {
  layout: ScoreLayout
  loop: BarRange
  onChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const first = layout.measures[loop.first]
  const last = layout.measures[loop.last]
  if (!first || !last) return null
  const left = first.x
  const right = last.x + last.width
  return (
    <>
      <div aria-hidden className="absolute inset-y-0 z-0 bg-muted" style={{ left, width: right - left }} />
      <LoopGrip
        label={t('sheet.loopStart')}
        x={left}
        bar={loop.first}
        min={0}
        max={loop.last}
        measures={layout.measures}
        onMove={(bar) => onChange({ first: bar, last: loop.last })}
      />
      <LoopGrip
        label={t('sheet.loopEnd')}
        x={right}
        bar={loop.last}
        min={loop.first}
        max={layout.measures.length - 1}
        measures={layout.measures}
        onMove={(bar) => onChange({ first: loop.first, last: bar })}
      />
    </>
  )
}
```

`src/widgets/sheet-music/ui/SheetOverlay.tsx`:

```tsx
import { useRef, type RefObject } from 'react'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { xAtTick, type ScoreLayout } from '@/shared/ui/score'
import { BarTargets } from './BarTargets'
import { LoopBand } from './LoopBand'
import { SheetCursor } from './SheetCursor'
import { SheetLabels } from './SheetLabels'
import { useFollow } from './use-follow'

/** What lies over the engraving, placed by its layout: labels, the loop, the cursor, the bars. */
export function SheetOverlay({
  layout,
  scroller,
  performance,
  headings,
  current,
  loop,
  onJump,
  onLoopChange,
}: {
  layout: ScoreLayout
  scroller: RefObject<HTMLElement | null>
  performance: Performance
  headings: readonly string[]
  current: number
  loop: BarRange | null
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const cursor = useRef<HTMLDivElement>(null)
  const group = performance.beatGroups[current]
  const x = group ? xAtTick(layout, group.tick) : null
  useFollow(scroller, cursor, x)
  return (
    <>
      <SheetLabels layout={layout} performance={performance} headings={headings} />
      {loop ? <LoopBand layout={layout} loop={loop} onChange={onLoopChange} /> : null}
      {x === null ? null : <SheetCursor ref={cursor} x={x} layout={layout} />}
      <BarTargets layout={layout} performance={performance} current={group?.bar} onJump={onJump} />
    </>
  )
}
```

(The loop's grips come after the bars in the DOM and above them by `z-30`, so a drag starts on a grip, never on a
bar.)

`src/widgets/sheet-music/ui/SheetMusic.tsx`:

```tsx
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { useMediaQuery } from '@/shared/lib'
import { notate, type StaffId } from '@/shared/lib/notation'
import { ScoreView } from '@/shared/ui/score'
import { SheetOverlay } from './SheetOverlay'

/** A phone on its side: height is scarce, so the staff is engraved smaller (spec §2.8). */
const LANDSCAPE_PHONE = '(orientation: landscape) and (max-height: 500px)'
const SMALL = 0.7

/**
 * A Performance as sheet music on one scrolling line of grand staff (spec §2.6): chord symbols over
 * numbered bars, the cursor on the beat group now, the loop, bars to jump to.
 */
export function SheetMusic({
  performance,
  headings,
  current,
  loop,
  fingers,
  muted,
  onJump,
  onLoopChange,
}: {
  performance: Performance
  /** Each section's name, by section: shown at its first bar. */
  headings: readonly string[]
  /** The beat group the cursor is on. */
  current: number
  loop: BarRange | null
  fingers: boolean
  /** The staff of the hand not heard or practised. */
  muted: StaffId | undefined
  onJump: (beatGroup: number) => void
  onLoopChange: (loop: BarRange) => void
}) {
  const { t } = useTranslation('music')
  const score = useMemo(() => notate(performance), [performance])
  const scale = useMediaQuery(LANDSCAPE_PHONE) ? SMALL : 1
  const scroller = useRef<HTMLElement>(null)
  return (
    <section
      ref={scroller}
      aria-label={t('sheet.label')}
      className="relative -mx-4 overflow-x-auto overscroll-x-contain px-4 pt-11 pb-2 scrollbar-none landscape-phone:mx-0 landscape-phone:px-0"
    >
      <ScoreView score={score} scale={scale} fingers={fingers} muted={muted}>
        {(layout) => (
          <SheetOverlay
            layout={layout}
            scroller={scroller}
            performance={performance}
            headings={headings}
            current={current}
            loop={loop}
            onJump={onJump}
            onLoopChange={onLoopChange}
          />
        )}
      </ScoreView>
    </section>
  )
}
```

`src/widgets/sheet-music/index.ts`: `export { SheetMusic } from './ui/SheetMusic'`.

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run src/widgets/sheet-music && npm run typecheck && npm run lint && npm run test`
Expected: PASS.

```bash
git add -A src
git commit -m "Show a Performance as sheet music: chord symbols over numbered bars, a cursor, bars to jump to, a loop to drag

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: The Player's parts: `widgets/practice-player`

**Files:**
- Create: `src/widgets/practice-player/index.ts`,
  `src/widgets/practice-player/model/{practice-view,speeds,wait-feedback,use-practice-player}.ts(x)`,
  `src/widgets/practice-player/model/{speeds,wait-feedback}.test.ts`, `src/widgets/practice-player/model/use-practice-player.test.tsx`,
  `src/widgets/practice-player/ui/{PlayerScreen,PlayerArea,PlayerTitle,TempoButton,HandsButton,HandsIcon,LoopButton,PlayerTransport,WaitLine,PlayingFields,ChoiceRow}.tsx`,
  `src/widgets/practice-player/ui/{TempoButton,HandsButton}.test.tsx`
- Modify: `src/styles/theme.css` (the `player-screen` utility), `src/entities/settings/model/types.ts`
  (`PLAYING_TOGGLES`), `src/entities/settings/index.ts`, `src/shared/i18n/locales/{en,ru}/player.ts`

**Interfaces:**
- Consumes: `usePractice`, `readLoop`, `loopParam`, `practiceMarks`, `playerRange`, `practisedHands`,
  `spellPitchClass` (Task 7 and before).
- Produces (from `@/widgets/practice-player`): `type PracticeView = { mode; tempo?; speedTraining; hands; swing;
  loop? }`; `usePracticePlayer(performance, view, setView, ownTempo): PracticePlayer`; `PlayerScreen`, `PlayerArea`,
  `PlayerTitle`, `TempoButton`, `HandsButton`, `LoopButton`, `PlayerTransport`, `WaitLine`, `PlayingFields`.

- [ ] **Step 1: The strings** — `src/shared/i18n/locales/en/player.ts` becomes

```ts
export const player = {
  setup: 'Setup',
  key: 'Key',
  keyOf: { major: '{{tonic}} major', minor: '{{tonic}} minor' },
  tempo: 'Tempo',
  bpm: '{{tempo}} BPM',
  hands: 'Hands',
  handsOf: 'Hands: {{hands}}',
  pattern: 'Pattern',
  fromChart: 'From the chart',
  fromChartDescription: 'Each chord as the song’s method code says.',
  rh: 'Right hand',
  lh: 'Left hand',
  ownFigure: 'The pattern’s own',
  needsMelody: 'Needs a melody',
  chordSize: 'Chord size',
  chordSizes: { triads: 'Triads', sevenths: '7ths', ninths: '9ths' },
  toggles: {
    fingerNumbers: 'Finger numbers',
    melody: 'Melody',
    metronome: 'Metronome',
    countIn: 'Count-in',
    swing: 'Swing',
  },
  pace: {
    of: 'Tempo: {{value}}',
    ownPace: 'Learn at your own pace',
    wait: 'Wait mode',
    playAlong: 'Listen and play along',
    speed: '{{percent}}% speed',
    own: 'Original tempo',
    waitShort: 'Wait',
    percent: '{{percent}}%',
    speedTraining: 'Speed training',
    speedTrainingDetail: '5% faster each pass, up to 100%',
  },
  loop: 'Loop',
  back: 'Back',
  next: 'Next',
  play: 'Play',
  stop: 'Stop',
  playThese: 'Play {{notes}}',
  right: 'Right',
  notThat: 'Not {{note}}',
  finished: 'Finished',
  again: 'Again',
} as const
```

and `ru/player.ts`:

```ts
export const player: LocaleResources['player'] = {
  setup: 'Параметры',
  key: 'Тональность',
  keyOf: { major: '{{tonic}} мажор', minor: '{{tonic}} минор' },
  tempo: 'Темп',
  bpm: '{{tempo}} уд/мин',
  hands: 'Руки',
  handsOf: 'Руки: {{hands}}',
  pattern: 'Фактура',
  fromChart: 'Как в песне',
  fromChartDescription: 'Каждый аккорд так, как указано в песне.',
  rh: 'Правая рука',
  lh: 'Левая рука',
  ownFigure: 'Как в фактуре',
  needsMelody: 'Нужна мелодия',
  chordSize: 'Аккорды',
  chordSizes: { triads: 'Трезвучия', sevenths: 'Септаккорды', ninths: 'Нонаккорды' },
  toggles: {
    fingerNumbers: 'Аппликатура',
    melody: 'Мелодия',
    metronome: 'Метроном',
    countIn: 'Отсчёт',
    swing: 'Свинг',
  },
  pace: {
    of: 'Темп: {{value}}',
    ownPace: 'В своём темпе',
    wait: 'Ожидание',
    playAlong: 'Слушать и играть вместе',
    speed: 'Скорость {{percent}}%',
    own: 'Исходный темп',
    waitShort: 'Ждать',
    percent: '{{percent}}%',
    speedTraining: 'Разгон темпа',
    speedTrainingDetail: 'Каждый круг на 5% быстрее, до 100%',
  },
  loop: 'Повтор',
  back: 'Назад',
  next: 'Дальше',
  play: 'Играть',
  stop: 'Стоп',
  playThese: 'Сыграйте {{notes}}',
  right: 'Верно',
  notThat: 'Не {{note}}',
  finished: 'Конец',
  again: 'Ещё раз',
}
```

(Keys the old Player still reads until Task 10 — `summary`, `modes`, `nextChord`, `hear`, `grid` — stay in both files
until Task 10 deletes their last reader, then go with it.)

- [ ] **Step 2: The switches the Player's sheet keeps** — `src/entities/settings/model/types.ts`

```ts
/** The Setup's saved switches: how any piece plays (the melody is a piece's own: its setup shows it). */
export const PLAYING_TOGGLES = ['fingerNumbers', 'metronome', 'countIn'] as const satisfies readonly PracticeToggle[]
```

exported from `src/entities/settings/index.ts`.

- [ ] **Step 3: Write the failing tests**

`src/widgets/practice-player/model/speeds.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { percentOf, speedTempo } from './speeds'

describe('speeds', () => {
  it('takes a share of the piece’s tempo, rounded, within the range', () => {
    expect(speedTempo(72, 0.5)).toBe(36)
    expect(speedTempo(76, 0.75)).toBe(57)
    expect(speedTempo(30, 0.5)).toBe(20)
  })

  it('says a tempo as a share of the piece’s', () => {
    expect(percentOf(54, 72)).toBe(75)
    expect(percentOf(60, 72)).toBe(83)
  })
})
```

`src/widgets/practice-player/model/wait-feedback.test.ts`: the old `pages/player/model/wait-feedback.test.ts`
moved here, with the states playing (`{ type: 'play' }` first), plus:

```ts
  it('says nothing while Wait mode is stopped, except Finished', () => {
    const stopped = practiceReducer(initialPractice(performance, 'wait', 'rh'), {
      type: 'jumpToBeatGroup',
      beatGroup: firstRightHand,
    })
    expect(waitFeedback(performance, stopped)).toBeNull()
  })

  it('names the notes to play as they are written', () => {
    const feedback = waitFeedback(performance, waiting)
    if (feedback?.kind !== 'play') throw new Error('expected a note to play')
    const group = performance.beatGroups[waiting.beatGroup]
    const written = (group?.notes ?? []).map((i) => performance.notes[i]).filter((n) => n?.hand === 'rh')
    expect(new Set(feedback.notes)).toEqual(
      new Set(written.flatMap((n) => (n ? [noteName(n.spelled)] : []))),
    )
  })
```

(`waiting` is now built with `{ type: 'play' }` before the jump: `[{ type: 'play' }, { type: 'jumpToBeatGroup',
beatGroup: firstRightHand }].reduce(practiceReducer, initialPractice(performance, 'wait', 'rh'))`.)

`src/widgets/practice-player/model/use-practice-player.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { ServicesProvider } from '@/shared/lib/services'
import type { PracticeView } from './practice-view'
import { usePracticePlayer } from './use-practice-player'

const VIEW: PracticeView = { mode: 'listen', speedTraining: false, hands: 'both', swing: false }

function renderPlayer(view: Partial<PracticeView> = {}) {
  const setView = vi.fn()
  const settingsStore = createSettingsStore({ storage: createMemoryStorage(), languages: ['en'], finePointer: false })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>{children}</ServicesProvider>
    </SettingsStoreProvider>
  )
  const hook = renderHook(() => usePracticePlayer(TWO_BARS, { ...VIEW, ...view }, setView, 72), { wrapper })
  return { ...hook, setView }
}

describe('usePracticePlayer', () => {
  it('writes the piece’s own tempo as absent', () => {
    const { result, setView } = renderPlayer()
    act(() => result.current.setTempo(72))
    expect(setView).toHaveBeenLastCalledWith({ tempo: undefined })
    act(() => result.current.setTempo(36))
    expect(setView).toHaveBeenLastCalledWith({ tempo: 36 })
  })

  it('writes Listen and a tempo in one change', () => {
    const { result, setView } = renderPlayer({ mode: 'wait' })
    act(() => result.current.listenAt(36))
    expect(setView).toHaveBeenLastCalledWith({ mode: 'listen', tempo: 36 })
    expect(setView).toHaveBeenCalledTimes(1)
  })

  it('loops the bar the cursor is in, and removes the loop', () => {
    const { result, setView } = renderPlayer()
    act(() => result.current.practice.jumpToBeatGroup(5))
    act(() => result.current.toggleLoop())
    expect(setView).toHaveBeenLastCalledWith({ loop: '2-2' })
    const looped = renderPlayer({ loop: '2-2' })
    expect(looped.result.current.loop).toEqual({ first: 1, last: 1 })
    act(() => looped.result.current.toggleLoop())
    expect(looped.setView).toHaveBeenLastCalledWith({ loop: undefined })
  })

  it('reads a loop past the piece’s end as none', () => {
    expect(renderPlayer({ loop: '40-44' }).result.current.loop).toBeNull()
  })

  it('mutes the staff of the hand not played', () => {
    expect(renderPlayer({ hands: 'rh' }).result.current.muted).toBe('bass')
    expect(renderPlayer({ hands: 'lh' }).result.current.muted).toBe('treble')
    expect(renderPlayer().result.current.muted).toBeUndefined()
  })
})
```


`src/widgets/practice-player/ui/TempoButton.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { TempoButton } from './TempoButton'

function renderTempo(props: Partial<Parameters<typeof TempoButton>[0]> = {}) {
  const handlers = { onWait: vi.fn(), onTempo: vi.fn(), onSpeedTraining: vi.fn() }
  renderWithSettings(
    <TempoButton
      mode="listen"
      tempo={72}
      shownTempo={72}
      ownTempo={72}
      speedTraining={false}
      {...handlers}
      {...props}
    />,
  )
  return handlers
}

describe('TempoButton', () => {
  it('says the tempo as a share of the piece’s, or Wait', () => {
    renderTempo({ tempo: 54, shownTempo: 54 })
    expect(screen.getByRole('button', { name: 'Tempo: 75%' })).toBeInTheDocument()
  })

  it('chooses Wait mode or a speed', async () => {
    const user = userEvent.setup()
    const { onWait, onTempo } = renderTempo()
    await user.click(screen.getByRole('button', { name: 'Tempo: 100%' }))
    expect(await screen.findByRole('button', { name: 'Original tempo', pressed: true })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Wait mode' }))
    expect(onWait).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('button', { name: '50% speed' }))
    expect(onTempo).toHaveBeenLastCalledWith(36)
  })

  it('offers speed training only below the piece’s tempo, in Listen', async () => {
    const user = userEvent.setup()
    renderTempo({ tempo: 54, shownTempo: 54 })
    await user.click(screen.getByRole('button', { name: 'Tempo: 75%' }))
    expect(await screen.findByRole('switch', { name: /Speed training/ })).toBeInTheDocument()
  })
})
```

`src/widgets/practice-player/ui/HandsButton.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { HandsButton } from './HandsButton'

describe('HandsButton', () => {
  it('says the hands, and chooses another', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithSettings(<HandsButton hands="both" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Hands: Both hands' }))
    await user.click(await screen.findByRole('button', { name: 'Left hand' }))
    expect(onChange).toHaveBeenCalledWith('lh')
  })
})
```

- [ ] **Step 4: Write the model**

`src/widgets/practice-player/model/practice-view.ts`:

```ts
import type { LoopParam, PracticeMode } from '@/features/practice'
import type { Hands } from '@/shared/lib/schedule'

/** How the Player goes, as its URL holds it (spec §2.10): an absent tempo is the piece's own. */
export interface PracticeView {
  readonly mode: PracticeMode
  readonly tempo?: number
  readonly speedTraining: boolean
  readonly hands: Hands
  readonly swing: boolean
  readonly loop?: LoopParam
}
```

`src/widgets/practice-player/model/speeds.ts`:

```ts
import { TEMPO_RANGE } from '@/shared/lib/schedule'

/** The tempo popover's speeds: shares of the piece's tempo. */
export const SPEEDS = [0.5, 0.75, 1] as const

/** A share of the piece's tempo, rounded, within the tempos a learner can choose. */
export const speedTempo = (ownTempo: number, share: number): number =>
  Math.min(TEMPO_RANGE.max, Math.max(TEMPO_RANGE.min, Math.round(ownTempo * share)))

/** A tempo as a share of the piece's, in whole percent: the tempo button's label. */
export const percentOf = (tempo: number, ownTempo: number): number =>
  Math.round((tempo / ownTempo) * 100)
```

`src/widgets/practice-player/model/wait-feedback.ts`:

```ts
import { spellPitchClass, type PracticeState } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { noteName, pitchClass } from '@/shared/lib/music'

/** What Wait mode's line says (spec §2.7). */
export type WaitFeedback =
  | { readonly kind: 'play'; readonly notes: readonly string[] }
  | { readonly kind: 'right' }
  | { readonly kind: 'not'; readonly note: string }
  | { readonly kind: 'finished' }

/** Wait mode's line now: the notes to play as written, a wrong key, right, or finished; nothing while stopped. */
export function waitFeedback(performance: Performance, state: PracticeState): WaitFeedback | null {
  if (state.mode !== 'wait') return null
  if (state.outcome === 'finished') return { kind: 'finished' }
  if (!state.playing) return null
  if (state.outcome === 'correct') return { kind: 'right' }
  const group = performance.beatGroups[state.beatGroup]
  if (!group) return null
  if (state.outcome === 'wrong' && state.wrong !== null) {
    return { kind: 'not', note: spellPitchClass(performance, group.chord, pitchClass(state.wrong)) }
  }
  const played = group.notes.map((index) => performance.notes[index])
  const notes = state.expected.map((pc) => {
    const written = played.find((n) => n !== undefined && pitchClass(n.midi) === pc)
    return written ? noteName(written.spelled) : spellPitchClass(performance, group.chord, pc)
  })
  return notes.length > 0 ? { kind: 'play', notes } : null
}
```

`src/widgets/practice-player/model/use-practice-player.ts`:

```ts
import { useCallback, useMemo } from 'react'
import { selectPractice, useSettings } from '@/entities/settings'
import {
  loopParam,
  playerRange,
  practiceMarks,
  practisedHands,
  readLoop,
  usePractice,
  type BarRange,
  type Practice,
  type PracticeMode,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { audibleHands, type Hands } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { PracticeView } from './practice-view'
import { waitFeedback, type WaitFeedback } from './wait-feedback'

/** The staff of the hand not heard or practised. */
const MUTED: Readonly<Record<Hands, StaffId | undefined>> = {
  both: undefined,
  rh: 'bass',
  lh: 'treble',
}

export interface PracticePlayer {
  readonly practice: Practice
  /** The chosen tempo, and the piece's own. */
  readonly tempo: number
  readonly ownTempo: number
  /** The pass's tempo while speed training plays; else the chosen one. */
  readonly shownTempo: number
  readonly loop: BarRange | null
  /** The keys the Player's keyboard spans, marks and keeps in sight, and the wrong key it shows. */
  readonly range: KeyRange
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly inView: KeyRange | undefined
  readonly wrong: ReadonlySet<Midi> | undefined
  readonly feedback: WaitFeedback | null
  readonly muted: StaffId | undefined
  readonly fingers: boolean
  setMode(mode: PracticeMode): void
  setTempo(tempo: number): void
  /** Listen at a tempo: the mode and the tempo in one change of the URL. */
  listenAt(tempo: number): void
  setSpeedTraining(on: boolean): void
  setHands(hands: Hands): void
  setSwing(on: boolean): void
  /** Loops the bar the cursor is in, or removes the loop. */
  toggleLoop(): void
  setLoop(loop: BarRange): void
  /** A key tapped on the screen: an answer in Wait mode. The keyboard sounds every tap itself. */
  tapKey(key: Midi): void
}

/**
 * The Player's one hook over any Performance (spec §2.7): the URL's view and the saved switches in,
 * everything the screen shows out. A page turns its source (a piece, an exercise) into the Performance.
 */
export function usePracticePlayer(
  performance: Performance,
  view: PracticeView,
  setView: (patch: Partial<PracticeView>) => void,
  ownTempo: number,
): PracticePlayer {
  const toggles = useSettings(selectPractice)
  const tempo = view.tempo ?? ownTempo
  const loop = useMemo(
    () => readLoop(view.loop, performance.bars.length),
    [view.loop, performance.bars.length],
  )
  const practice = usePractice(performance, {
    mode: view.mode,
    hands: view.hands,
    tempo,
    ownTempo,
    speedTraining: view.speedTraining,
    swing: view.swing,
    loop,
    metronome: toggles.metronome,
    countIn: toggles.countIn,
  })
  const { state, press } = practice
  const waiting = state.mode === 'wait'
  const received = waiting ? state.received : undefined
  const hands = useMemo(
    () => (waiting ? practisedHands(view.hands) : audibleHands(view.hands)),
    [waiting, view.hands],
  )
  const range = useMemo(() => playerRange(performance), [performance])
  // Stable while the beat group is, so the keyboard's memoised keys re-render only when theirs change.
  const marks = useMemo(
    () =>
      practiceMarks(performance, state.beatGroup, {
        hands,
        fingers: toggles.fingerNumbers,
        ...(received ? { received } : {}),
      }),
    [performance, state.beatGroup, hands, toggles.fingerNumbers, received],
  )
  const inView = useMemo(() => rangeOf([...marks.keys()]), [marks])
  const wrong = useMemo(() => (state.wrong === null ? undefined : new Set([state.wrong])), [state.wrong])
  const tapKey = useCallback(
    (key: Midi) => {
      if (waiting) press(key)
    },
    [waiting, press],
  )
  const bar = performance.beatGroups[state.beatGroup]?.bar ?? 0

  return {
    practice,
    tempo,
    ownTempo,
    shownTempo: practice.passTempo ?? tempo,
    loop,
    range,
    marks,
    inView,
    wrong,
    feedback: waitFeedback(performance, state),
    muted: MUTED[view.hands],
    fingers: toggles.fingerNumbers,
    setMode: (mode) => setView({ mode }),
    setTempo: (next) => setView({ tempo: next === ownTempo ? undefined : next }),
    listenAt: (next) => setView({ mode: 'listen', tempo: next === ownTempo ? undefined : next }),
    setSpeedTraining: (on) => setView({ speedTraining: on }),
    setHands: (next) => setView({ hands: next }),
    setSwing: (on) => setView({ swing: on }),
    toggleLoop: () => setView({ loop: loop ? undefined : loopParam({ first: bar, last: bar }) }),
    setLoop: (next) => setView({ loop: loopParam(next) }),
    tapKey,
  }
}
```

- [ ] **Step 5: Write the screen's layout** — `src/styles/theme.css`, after the safe-area utilities

```css
/* The Player's screen (widgets/practice-player; spec §2.8): its parts placed by `data-area`. Upright,
   the tempo and hands flank the transport at the bottom, in the thumb's reach; from 640px they join
   the toolbar and the transport sits under the sheet; on a phone on its side the transport stands
   right of the sheet, where the right thumb is. */
@utility player-screen {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-rows: auto minmax(12rem, 20rem) auto auto 1fr;
  grid-template-areas:
    'lead lead actions'
    'keys keys keys'
    'sheet sheet sheet'
    'status status status'
    'tempo transport hands';
  & > [data-area='lead'] {
    grid-area: lead;
  }
  & > [data-area='tempo'] {
    grid-area: tempo;
  }
  & > [data-area='hands'] {
    grid-area: hands;
  }
  & > [data-area='actions'] {
    grid-area: actions;
  }
  & > [data-area='keys'] {
    grid-area: keys;
  }
  & > [data-area='sheet'] {
    grid-area: sheet;
  }
  & > [data-area='status'] {
    grid-area: status;
  }
  & > [data-area='transport'] {
    grid-area: transport;
  }
  @variant sm {
    grid-template-columns: minmax(0, 1fr) auto auto auto;
    grid-template-rows: auto minmax(14rem, 24rem) auto auto 1fr;
    grid-template-areas:
      'lead tempo hands actions'
      'keys keys keys keys'
      'sheet sheet sheet sheet'
      'status status status status'
      'transport transport transport transport';
  }
  @variant landscape-phone {
    grid-template-columns: minmax(0, 1fr) auto auto auto;
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    grid-template-areas:
      'lead tempo hands actions'
      'keys keys keys keys'
      'sheet sheet sheet status'
      'sheet sheet sheet transport';
  }
}
```

(Tailwind compiles `@variant` inside `@utility` to the variants' media queries, in this order: checked with
`@tailwindcss/node`'s `compile` before this plan.)

- [ ] **Step 6: Write the components**

`src/widgets/practice-player/ui/PlayerScreen.tsx`:

```tsx
import type { ReactNode } from 'react'

/** The Player's screen: its areas (`PlayerArea`) placed by the `player-screen` utility (spec §2.8). */
export function PlayerScreen({ children }: { children: ReactNode }) {
  return (
    <div className="player-screen flex-1 gap-3 pt-2 landscape-phone:min-h-0 landscape-phone:gap-2 landscape-phone:pt-1">
      {children}
    </div>
  )
}
```

`src/widgets/practice-player/ui/PlayerArea.tsx`:

```tsx
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

export type PlayerAreaName =
  | 'lead'
  | 'tempo'
  | 'hands'
  | 'actions'
  | 'keys'
  | 'sheet'
  | 'status'
  | 'transport'

/** One part of the Player's screen, placed by its name. */
export function PlayerArea({
  area,
  className,
  children,
}: {
  area: PlayerAreaName
  className?: string
  children?: ReactNode
}) {
  return (
    <div data-area={area} className={cn('min-w-0', className)}>
      {children}
    </div>
  )
}
```

`src/widgets/practice-player/ui/PlayerTitle.tsx`:

```tsx
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundButton } from '@/shared/ui'

/** Close, and the piece's title: the toolbar's lead. */
export function PlayerTitle({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div className="flex min-w-0 items-center gap-3">
      <RoundButton label={t('close')} icon={X} onClick={onClose} />
      <h1 className="min-w-0 flex-1 truncate text-lg">{title}</h1>
    </div>
  )
}
```

`src/widgets/practice-player/ui/ChoiceRow.tsx`:

```tsx
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

/** A choice in a popover's list: its label, pressed and checked in umber when chosen. */
export function ChoiceRow({
  chosen,
  onChoose,
  children,
}: {
  chosen: boolean
  onChoose: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={chosen}
      onClick={onChoose}
      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-base transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">{children}</span>
      {chosen ? <Check aria-hidden className="size-5 text-selected" /> : null}
    </button>
  )
}
```

`src/widgets/practice-player/ui/TempoButton.tsx`:

```tsx
import { Gauge } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticeMode } from '@/features/practice'
import { TEMPO_RANGE } from '@/shared/lib/schedule'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { Switch } from '@/shared/ui/primitives/switch'
import { percentOf, SPEEDS, speedTempo } from '../model/speeds'
import { ChoiceRow } from './ChoiceRow'

/**
 * The tempo button and its popover (spec §2.7): Wait mode, or a speed of the piece's tempo, or any
 * tempo; speed training below the piece's tempo. The button says the pass's tempo while it plays.
 */
export function TempoButton({
  mode,
  tempo,
  shownTempo,
  ownTempo,
  speedTraining,
  onWait,
  onTempo,
  onSpeedTraining,
}: {
  mode: PracticeMode
  tempo: number
  shownTempo: number
  ownTempo: number
  speedTraining: boolean
  /** Wait mode chosen. */
  onWait: () => void
  /** Listen at this tempo. */
  onTempo: (tempo: number) => void
  onSpeedTraining: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const [open, setOpen] = useState(false)
  const value =
    mode === 'wait' ? t('pace.waitShort') : t('pace.percent', { percent: percentOf(shownTempo, ownTempo) })
  const choose = (act: () => void) => {
    act()
    setOpen(false)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="soft" aria-label={t('pace.of', { value })} />}>
        <Gauge data-icon="inline-start" />
        <span className="tabular-nums">{value}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 gap-4 p-4">
        <section className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-muted-foreground">{t('pace.ownPace')}</h2>
          <ChoiceRow chosen={mode === 'wait'} onChoose={() => choose(onWait)}>
            {t('pace.wait')}
          </ChoiceRow>
        </section>
        <section className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-muted-foreground">{t('pace.playAlong')}</h2>
          {SPEEDS.map((share) => {
            const speed = speedTempo(ownTempo, share)
            return (
              <ChoiceRow
                key={share}
                chosen={mode === 'listen' && tempo === speed}
                onChoose={() => choose(() => onTempo(speed))}
              >
                {share === 1 ? t('pace.own') : t('pace.speed', { percent: share * 100 })}
              </ChoiceRow>
            )
          })}
        </section>
        <Slider
          min={TEMPO_RANGE.min}
          max={TEMPO_RANGE.max}
          step={1}
          value={tempo}
          onValueChange={onTempo}
          className="flex flex-col gap-3"
        >
          <div className="flex justify-between">
            <SliderLabel>{t('tempo')}</SliderLabel>
            <span className="font-semibold tabular-nums">{t('bpm', { tempo })}</span>
          </div>
        </Slider>
        {mode === 'listen' && tempo < ownTempo ? (
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="flex flex-col">
              <span>{t('pace.speedTraining')}</span>
              <span className="text-sm text-muted-foreground">{t('pace.speedTrainingDetail')}</span>
            </span>
            <Switch checked={speedTraining} onCheckedChange={onSpeedTraining} />
          </label>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
```

`src/widgets/practice-player/ui/HandsIcon.tsx`:

```tsx
import { Hand } from 'lucide-react'
import type { Hands } from '@/shared/lib/schedule'

/** One hand, the other (mirrored), or both. */
export function HandsIcon({ hands }: { hands: Hands }) {
  if (hands === 'rh') return <Hand aria-hidden className="size-5" />
  if (hands === 'lh') return <Hand aria-hidden className="size-5 -scale-x-100" />
  return (
    <span aria-hidden className="flex">
      <Hand className="size-4 -scale-x-100" />
      <Hand className="size-4" />
    </span>
  )
}
```

`src/widgets/practice-player/ui/HandsButton.tsx`:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Hands } from '@/shared/lib/schedule'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { ChoiceRow } from './ChoiceRow'
import { HandsIcon } from './HandsIcon'

/** The popover's order: one hand, the other, both. */
const CHOICES: readonly Hands[] = ['rh', 'lh', 'both']

/** The hands button and its popover: right, left or both (spec §2.8). */
export function HandsButton({ hands, onChange }: { hands: Hands; onChange: (hands: Hands) => void }) {
  const { t } = useTranslation(['player', 'common'])
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('player:handsOf', { hands: t(`common:hands.${hands}`) })}
          />
        }
      >
        <HandsIcon hands={hands} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-1 p-2">
        {CHOICES.map((choice) => (
          <ChoiceRow
            key={choice}
            chosen={choice === hands}
            onChoose={() => {
              onChange(choice)
              setOpen(false)
            }}
          >
            <HandsIcon hands={choice} />
            {t(`common:hands.${choice}`)}
          </ChoiceRow>
        ))}
      </PopoverContent>
    </Popover>
  )
}
```


`src/widgets/practice-player/ui/LoopButton.tsx`:

```tsx
import { Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/** Loops the bar the cursor is in, or removes the loop: pressed, in neutrals, while a loop is set. */
export function LoopButton({ looped, onToggle }: { looped: boolean; onToggle: () => void }) {
  const { t } = useTranslation('player')
  return (
    <Button
      variant="surface"
      size="icon"
      aria-label={t('loop')}
      aria-pressed={looped}
      onClick={onToggle}
      className="aria-pressed:bg-muted"
    >
      <Repeat aria-hidden />
    </Button>
  )
}
```

`src/widgets/practice-player/ui/PlayerTransport.tsx`:

```tsx
import { ChevronLeft, ChevronRight, Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** ‹ Play or Stop ›: the Player's one honey action between the steps (spec §2.7). */
export function PlayerTransport({ practice }: { practice: Practice }) {
  const { t } = useTranslation('player')
  const { playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 landscape-phone:gap-2">
      <RoundButton label={t('back')} icon={ChevronLeft} onClick={practice.prev} />
      <Button
        size="play"
        className="landscape-phone:size-14"
        aria-label={playing ? t('stop') : t('play')}
        onClick={playing ? practice.stop : practice.play}
      >
        {playing ? <Square aria-hidden /> : <Play aria-hidden />}
      </Button>
      <RoundButton label={t('next')} icon={ChevronRight} onClick={practice.next} />
    </div>
  )
}
```

`src/widgets/practice-player/ui/WaitLine.tsx`:

```tsx
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import type { WaitFeedback } from '../model/wait-feedback'

function lineOf(feedback: WaitFeedback, t: TFunction<'player'>): string {
  switch (feedback.kind) {
    case 'play':
      return t('playThese', { notes: feedback.notes.join(' ') })
    case 'not':
      return t('notThat', { note: feedback.note })
    case 'right':
      return t('right')
    case 'finished':
      return t('finished')
  }
}

/** Wait mode's one line: what to play, a wrong key, Right, or Finished with Again (spec §2.7). */
export function WaitLine({ feedback, onAgain }: { feedback: WaitFeedback | null; onAgain: () => void }) {
  const { t } = useTranslation('player')
  return (
    <div className="flex min-h-11 items-center justify-center gap-3">
      <p
        aria-live="polite"
        className={cn('text-lg font-semibold', feedback?.kind === 'not' && 'text-destructive')}
      >
        {feedback ? lineOf(feedback, t) : null}
      </p>
      {feedback?.kind === 'finished' ? (
        <Button variant="soft" onClick={onAgain}>
          {t('again')}
        </Button>
      ) : null}
    </div>
  )
}
```

`src/widgets/practice-player/ui/PlayingFields.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { PLAYING_TOGGLES, selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { Switch } from '@/shared/ui/primitives/switch'

const ROW = 'flex min-h-14 items-center justify-between border-b border-border text-lg'

/** How the Player plays, in the Setup sheet: swing (null where the meter cannot swing), and the saved switches. */
export function PlayingFields({ swing, onSwing }: { swing: boolean | null; onSwing: (on: boolean) => void }) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const toggles = useSettings(selectPractice)
  return (
    <div>
      {swing === null ? null : (
        <label className={ROW}>
          {t('toggles.swing')}
          <Switch checked={swing} onCheckedChange={onSwing} />
        </label>
      )}
      {PLAYING_TOGGLES.map((toggle) => (
        <label key={toggle} className={ROW}>
          {t(`toggles.${toggle}`)}
          <Switch
            checked={toggles[toggle]}
            onCheckedChange={(on) => setPracticeToggle(settings, toggle, on)}
          />
        </label>
      ))}
    </div>
  )
}
```

`src/widgets/practice-player/index.ts`:

```ts
export type { PracticeView } from './model/practice-view'
export { usePracticePlayer, type PracticePlayer } from './model/use-practice-player'
export { HandsButton } from './ui/HandsButton'
export { LoopButton } from './ui/LoopButton'
export { PlayerArea } from './ui/PlayerArea'
export { PlayerScreen } from './ui/PlayerScreen'
export { PlayerTitle } from './ui/PlayerTitle'
export { PlayerTransport } from './ui/PlayerTransport'
export { PlayingFields } from './ui/PlayingFields'
export { TempoButton } from './ui/TempoButton'
export { WaitLine } from './ui/WaitLine'
```

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS; the build accepts the `player-screen` utility.

```bash
git add -A src
git commit -m "Build the Player's parts for any Performance: its hook, screen, tempo and hands popovers, loop, transport

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: The Player in Flowkey's shape

**Files:**
- Modify: `src/pages/player/{index.ts,model/player-search.ts,model/use-player.ts,ui/PlayerPage.tsx}`,
  `src/pages/player/model/player-search.test.ts`, `src/pages/player/ui/PlayerPage.test.tsx`,
  `src/widgets/player-setup/{model/setup-params.ts,ui/PlayerSetup.tsx,ui/SetupMain.tsx,ui/PlayerSetup.test.tsx}`,
  `src/app/routes/search.ts`, `src/app/routes/search.test.ts`, `src/widgets/chord-chart/ui/{ChordChart,BarButton}.tsx`,
  `src/widgets/chord-chart/ui/ChordChart.test.tsx`, `src/pages/piece/ui/PieceView.tsx`,
  `src/features/practice/{index,note-names}.ts`, `src/shared/i18n/locales/{en,ru}/player.ts`
- Create: `src/pages/player/model/use-close.ts`
- Delete: `src/pages/player/ui/{NoteGrid,NowPanel,Transport,PlayerTopBar}.tsx`,
  `src/pages/player/model/{wait-feedback,wait-feedback.test,use-player.test}.ts(x)` (its cases move to
  `usePracticePlayer`'s test and the page's), `src/features/practice/{bar-columns,bar-columns.test}.ts`

**Interfaces:**
- Consumes: everything above.
- Produces: `PlayerSearch = PracticeView & SetupParams`; `SetupParams { key?; pattern?; rh?; lh?; chordSize? }`;
  `PlayerSetup({ open, onOpenChange, piece, choice, onChange, children })`; `PLAYER_DEFAULTS` and
  `validatePlayerSearch` for the new params; `ChordChart({ performance, headings, playing?, onBar })` (lines only).

- [ ] **Step 1: Write the failing screen test** — replace `src/pages/player/ui/PlayerPage.test.tsx`

```tsx
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { setPracticeToggle } from '@/features/set-preference'
import { midi, parseNoteName, pitchClassOf } from '@/shared/lib/music'
import { stubFonts } from '@/shared/test/fonts'

describe('Player', () => {
  it('opens a song with its title, tempo, hands and sheet music, and records it as practised', async () => {
    const { progressStore } = await renderApp('/play/bz5')
    expect(await screen.findByRole('heading', { name: 'Still, my soul, be still' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tempo: 100%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hands: Both hands' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: G' })).toBeInTheDocument()
    expect(progressStore.getState().practised.bz5).toBeDefined()
  })

  it('reads a stale URL as the piece’s own setup', async () => {
    const { router } = await renderApp('/play/bz5?key=H&tempo=999&mode=step&loop=9-3&swing=yes')
    expect(await screen.findByRole('button', { name: 'Tempo: 100%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Loop' })).toHaveAttribute('aria-pressed', 'false')
    expect(router.state.location.search).toEqual({})
  })

  it('plays in Listen and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('steps with Back and Next, sounding each beat group', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(audio.played).toHaveLength(2)
  })

  it('chooses Wait mode and a speed from the tempo popover', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('button', { name: 'Wait mode' }))
    expect(router.state.location.search).toMatchObject({ mode: 'wait' })
    await user.click(screen.getByRole('button', { name: 'Tempo: Wait' }))
    await user.click(await screen.findByRole('button', { name: '50% speed' }))
    expect(router.state.location.search).toEqual({ tempo: 36 })
  })

  it('waits for the notes in Wait mode once playing, says a wrong key, and takes the right ones from MIDI', async () => {
    const user = userEvent.setup()
    // The song's pattern opens with the left hand alone, so the left hand has notes to play at once.
    const { midi: midiKeyboard } = await renderApp('/play/bz5?mode=wait&hands=lh')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const prompt = await screen.findByText(/^Play /)
    const notes = prompt.textContent?.replace(/^Play /, '').split(' ') ?? []
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // C sharp is outside G major's first chord (G B D).
    await user.click(within(keyboard).getByRole('button', { name: 'C sharp 4' }))
    expect(await screen.findByText(/^Not C/)).toBeInTheDocument()
    act(() => {
      for (const name of notes) {
        const spelled = parseNoteName(name)
        if (!spelled) throw new Error(name)
        midiKeyboard.press(midi(60 + pitchClassOf(spelled)))
      }
    })
    expect(await screen.findByText('Right')).toBeInTheDocument()
  })

  it('chooses a hand, muting the other staff', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Hands: Both hands' }))
    await user.click(await screen.findByRole('button', { name: 'Left hand' }))
    expect(router.state.location.search).toMatchObject({ hands: 'lh' })
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'treble')
  })

  it('loops the bar the cursor is in, and removes the loop', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Loop' }))
    expect(router.state.location.search).toMatchObject({ loop: '1-1' })
    expect(await screen.findByRole('slider', { name: 'Loop end' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Loop' }))
    expect(router.state.location.search).not.toHaveProperty('loop')
  })

  it('changes the key and swing in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('combobox', { name: 'Key' }))
    await user.click(await screen.findByRole('option', { name: 'A major' }))
    expect(router.state.location.search).toMatchObject({ key: 'A' })
    await user.click(screen.getByRole('switch', { name: 'Swing' }))
    expect(router.state.location.search).toMatchObject({ key: 'A', swing: true })
  })

  it('puts the fingers under the keys with Finger numbers', async () => {
    const { settingsStore } = await renderApp('/play/bz5')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(document.querySelector('[data-slot="finger-row"]')).not.toBeInTheDocument()
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    expect(document.querySelector('[data-slot="finger-row"]')).toBeInTheDocument()
  })

  it('still plays when the music font does not load', async () => {
    stubFonts({ loads: false })
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    expect(await screen.findByText('The music can’t be shown.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/pages/player`
Expected: FAIL (no tempo button, no sheet).

- [ ] **Step 3: The URL** — `src/widgets/player-setup/model/setup-params.ts`

```ts
import type { LeftFigureId, PatternId, RightFigureId } from '@/entities/pattern'
import type { ChordSize } from '@/entities/piece'
import type { NoteParam } from '@/shared/lib/music'

/** The piece's own choices as the Player's URL holds them: an absent one is the piece's own. */
export interface SetupParams {
  readonly key?: NoteParam
  readonly pattern?: PatternId | 'chart'
  readonly rh?: RightFigureId
  readonly lh?: LeftFigureId
  readonly chordSize?: ChordSize
}

/** What one control in the sheet changes; a field set to `undefined` goes back to the piece's own. */
export type SetupChange = Partial<SetupParams>
```

`src/app/routes/search.ts`:

```ts
// Player: key, tempo, pattern and chord size default to the piece's own, so their absence is the default.
export const PLAYER_DEFAULTS: PlayerSearch = {
  mode: 'listen',
  speedTraining: false,
  hands: 'both',
  swing: false,
}
export function validatePlayerSearch(input: Input<PlayerSearch>): PlayerSearch {
  const raw: Raw = input
  const key = readNote(raw.key)
  return {
    mode: valueOr(isOneOf(PRACTICE_MODES), raw.mode, PLAYER_DEFAULTS.mode),
    tempo: wholeIn(raw.tempo, TEMPO_RANGE.min, TEMPO_RANGE.max, undefined),
    speedTraining: raw.speedTraining === true,
    hands: valueOr(isHands, raw.hands, PLAYER_DEFAULTS.hands),
    swing: raw.swing === true,
    loop: isLoopParam(raw.loop) ? raw.loop : undefined,
    key: key ? noteParam(key) : undefined,
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
    chordSize: isChordSize(raw.chordSize) ? raw.chordSize : undefined,
  }
}
```

(`isLoopParam` from `@/features/practice`, which the file already reads `PRACTICE_MODES` from.) `search.test.ts`'s
player cases: a valid URL keeps every param; `mode=step`, `loop=6-3`, `loop=x`, `swing=yes`, `tempo=10` each take the
default.

`src/pages/player/model/player-search.ts`:

```ts
import { hasMethodCodes, pieceKey, type Piece } from '@/entities/piece'
import { ownChoice, type PracticeChoice } from '@/features/practice'
import { noteFromParam, noteParam, pitchClassOf, tonicSpelling } from '@/shared/lib/music'
import type { SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'

/** The Player's URL: how it goes, and the piece's own choices (spec §2.10). */
export type PlayerSearch = PracticeView & SetupParams

/** The Player's URL read against its piece: what the URL leaves out is the piece's own. */
export function resolveChoice(piece: Piece, search: SetupParams, melody: boolean): PracticeChoice {
  const own = ownChoice(piece)
  const { minor } = pieceKey(piece)
  const chartWithoutMethods = search.pattern === 'chart' && !hasMethodCodes(piece)
  return {
    tonic: search.key ? tonicSpelling(pitchClassOf(noteFromParam(search.key)), minor) : own.tonic,
    pattern: search.pattern === undefined || chartWithoutMethods ? own.pattern : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    chordSize:
      piece.kind === 'progression' && piece.chordSize.choosable ? (search.chordSize ?? null) : null,
    melody,
  }
}

/** A Setup change as the URL writes it: a key, pattern or chord size equal to the piece's own is left out. */
export function searchPatch(piece: Piece, change: SetupChange): SetupChange {
  const own = ownChoice(piece)
  const ownChordSize = piece.kind === 'progression' ? piece.chordSize.default : undefined
  const unlessOwn = <V>(value: V, ownValue: V): V | undefined =>
    value === ownValue ? undefined : value
  return {
    ...change,
    ...('key' in change ? { key: unlessOwn(change.key, noteParam(own.tonic)) } : {}),
    ...('pattern' in change ? { pattern: unlessOwn(change.pattern, own.pattern) } : {}),
    ...('chordSize' in change ? { chordSize: unlessOwn(change.chordSize, ownChordSize) } : {}),
  }
}
```

(Its test drops the tempo and hands cases: the tempo's own-is-absent rule is `usePracticePlayer`'s, tested there.)

- [ ] **Step 4: The page** — `src/pages/player/model/use-close.ts`

```ts
import type { Piece } from '@/entities/piece'
import { useGoBack } from '@/shared/lib'

/** Close: back where the learner came from, or to the piece's page on its shelf when opened directly. */
export function useClose(piece: Piece): () => void {
  const params = { pieceId: piece.id }
  const closeTo = {
    song: useGoBack({ to: '/songs/$pieceId', params }),
    study: useGoBack({ to: '/practice/studies/$pieceId', params }),
    progression: useGoBack({ to: '/practice/progressions/$pieceId', params }),
  }
  return closeTo[piece.kind]
}
```

`src/pages/player/model/use-player.ts`:

```ts
import { useEffect, useMemo } from 'react'
import type { Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import { arrangePiece, type PracticeChoice } from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { Performance } from '@/shared/lib/arrangement'
import type { SetupChange } from '@/widgets/player-setup'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'

export interface Player {
  readonly choice: PracticeChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: SetupChange): void
}

/** The piece as the Player plays it (spec §2.1): its URL's choices arranged, practised from the widget's hook. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): Player {
  const { melody } = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const { key, pattern, rh, lh, chordSize } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, chordSize }, melody),
    [piece, key, pattern, rh, lh, chordSize, melody],
  )
  const performance = useMemo(() => arrangePiece(piece, choice), [piece, choice])
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])
  const player = usePracticePlayer(performance, search, setSearch, piece.tempo)
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(searchPatch(piece, change)),
  }
}
```

`src/pages/player/ui/PlayerPage.tsx`:

```tsx
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceById, usePieceHeadings, type Piece } from '@/entities/piece'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import { useLocale } from '@/shared/i18n'
import { isCompound } from '@/shared/lib/music'
import { RoundButton } from '@/shared/ui'
import { PlayerSetup } from '@/widgets/player-setup'
import {
  HandsButton,
  LoopButton,
  PlayerArea,
  PlayerScreen,
  PlayerTitle,
  PlayerTransport,
  PlayingFields,
  TempoButton,
  WaitLine,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'
import { useClose } from '../model/use-close'
import { usePlayer } from '../model/use-player'

function Player({ piece }: { piece: Piece }) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useClose(piece)
  const headings = usePieceHeadings(piece)
  const { choice, performance, player, changeSetup } = usePlayer(
    piece,
    search,
    (patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  const { practice } = player
  return (
    <>
      <PlayerScreen>
        <PlayerArea area="lead">
          <PlayerTitle title={entryTitles(piece, locale).primary} onClose={close} />
        </PlayerArea>
        <PlayerArea area="tempo" className="flex items-center">
          <TempoButton
            mode={search.mode}
            tempo={player.tempo}
            shownTempo={player.shownTempo}
            ownTempo={player.ownTempo}
            speedTraining={search.speedTraining}
            onWait={() => player.setMode('wait')}
            onTempo={player.listenAt}
            onSpeedTraining={player.setSpeedTraining}
          />
        </PlayerArea>
        <PlayerArea area="hands" className="flex items-center justify-end">
          <HandsButton hands={search.hands} onChange={player.setHands} />
        </PlayerArea>
        <PlayerArea area="actions" className="flex items-center justify-end gap-2">
          <LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />
          <MidiButton />
          <RoundButton label={t('setup')} icon={SlidersHorizontal} onClick={() => setSetupOpen(true)} />
        </PlayerArea>
        <PlayerArea area="keys" className="flex">
          <LiveKeyboard
            range={player.range}
            inView={player.inView}
            marks={player.marks}
            wrong={player.wrong}
            onKeyPress={player.tapKey}
            height="fill"
            className="min-h-0 flex-1"
          />
        </PlayerArea>
        <PlayerArea area="sheet">
          <SheetMusic
            performance={performance}
            headings={headings}
            current={practice.state.beatGroup}
            loop={player.loop}
            fingers={player.fingers}
            muted={player.muted}
            onJump={practice.jumpToBeatGroup}
            onLoopChange={player.setLoop}
          />
        </PlayerArea>
        <PlayerArea area="status" className="landscape-phone:self-end">
          {search.mode === 'wait' ? <WaitLine feedback={player.feedback} onAgain={practice.play} /> : null}
        </PlayerArea>
        <PlayerArea area="transport" className="self-end pb-2 landscape-phone:self-start landscape-phone:pb-0">
          <PlayerTransport practice={practice} />
        </PlayerArea>
      </PlayerScreen>
      <PlayerSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={choice}
        onChange={changeSetup}
      >
        <PlayingFields swing={isCompound(piece.meter) ? null : search.swing} onSwing={player.setSwing} />
      </PlayerSetup>
    </>
  )
}

export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <Player key={piece.id} piece={piece} /> : null
}
```


- [ ] **Step 5: The piece's setup sheet**

- `PlayerSetup.tsx`: drop `tempo` and `hands`; add `children: ReactNode`, rendered after `<SetupMain … />` on the main
  page.
- `SetupMain.tsx`: drop the tempo slider, the hands segmented control and the loop over `PRACTICE_TOGGLES`; below the
  chord size, when the piece has a melody, one row:

```tsx
      {hasMelody ? (
        <label className="flex min-h-14 items-center justify-between border-b border-border text-lg">
          {t('player:toggles.melody')}
          <Switch
            checked={toggles.melody}
            onCheckedChange={(on) => setPracticeToggle(settings, 'melody', on)}
          />
        </label>
      ) : null}
```

  (its imports lose `Slider`, `SliderLabel`, `HANDS`, `TEMPO_RANGE`, `PRACTICE_TOGGLES`, `type Hands`).
- `PlayerSetup.test.tsx`: drop the tempo and hands cases; the melody switch shows only for a piece with a melody;
  children render on the main page.

- [ ] **Step 6: Remove what the Player no longer uses**

- Delete `NoteGrid.tsx`, `NowPanel.tsx`, `Transport.tsx`, `PlayerTopBar.tsx`, `model/wait-feedback(.test).ts`,
  `model/use-player.test.tsx`, `features/practice/bar-columns(.test).ts`; `features/practice/index.ts` drops
  `barColumns`, `beatInBar`, `beatLabel`, `NoteColumn`, `PlayedNote` and `noteLabel` (and `note-names.ts` drops
  `noteLabel` and its test case).
- `ChordChart.tsx`: only the lines layout: drop `layout`, `current`, the strip's refs and scroll effect, and
  `useMediaQuery`; `BarButton.tsx`: drop `current`, `fill` and `ref` (every bar is a line's cell,
  `min-w-0 overflow-hidden`, sky mist while it plays). `PieceView.tsx` drops `layout="lines"`. `ChordChart.test.tsx`
  drops its strip cases.
- `player.ts` (en, ru): delete `summary`, `modes`, `nextChord`, `hear`, `grid`.

- [ ] **Step 7: Verify, build, commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS. In the build's size table, VexFlow's code sits in the chunk `player-screens` loads and the Bravura
woff2 is an asset of its CSS; the entry chunk (`index-*.js`) is within a kilobyte of its size at Task 1's build (note
that number when Task 1 builds).

```bash
git add -A src
git commit -m "Rebuild the Player in Flowkey's shape around sheet music: tempo and hands popovers, loop, ‹ Play ›

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: The record, and the check on a real screen

**Files:**
- Create: `docs/adr/0013-sheet-music-is-our-score-engraved-by-vexflow.md`
- Modify: `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`, `docs/CODE_STYLE.md`, `docs/UBIQUITOUS_LANGUAGE.md`,
  `docs/CONTENT.md` (the melody's spelling is kept), `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md`
  (§5's Player row, §6's player params), `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`
  (sub-project 3 built; §12's four items decided; lyrics in §5)

- [ ] **Step 1: ADR 0013** — context (sheet music asked for, the roadmap's §4.1), decision (the Performance stays the
  playable truth and `notate` writes it; the notation kernel's fence; VexFlow 5 core over one horizontal system;
  Bravura self-hosted via `@font-face`; chord symbols, numbers and names as HTML; `currentColor` and CSS classes;
  `stubFonts` in tests), consequences (the editor adds `perform(score)`; lessons and the scale reuse `ScoreView`;
  what §12 decided).
- [ ] **Step 2: DESIGN.md** — the Player's layout by form factor; the sheet (staff lines and barlines in the control
  line, notes in ink, the cursor's sky-mist band, the loop's muted band and umber grips, chord symbols Literata 600
  17px, bar numbers 12px soft ink tabular, a muted staff in soft ink); the Choosing Rule's popovers (the keyboard's
  settings, the Player's tempo and hands); the Chord Display and Title 1 lose the Player's chord now and next; the
  Player's Play is 56px on a phone on its side.
- [ ] **Step 3: CODE_STYLE, the glossary, CLAUDE.md, PRODUCT.md, CONTENT.md, the master spec and the roadmap** as
  the spec's §5 lists: `shared/lib/notation` and its fence; `shared/ui/score` imported by path; `stubFonts`; time in
  the kernel; the Performance's written onset, roll and spelling; Score, Sheet, Cursor, Loop, Speed training, Swing,
  Roll in the glossary, Listen and Wait mode (Step is ‹ ›), the Note grid gone, Setup without tempo and hands.
- [ ] **Step 4: Look at it** — `npm run build && npm run preview`, open `/play/bz5` at 390×844 upright, 844×390 on its
  side and 1280×800; check with the browser's dev tools: the toolbar fits in English and Russian; the staff's lines
  and notes take the tokens by day and night; the cursor follows Play; a loop's grips drag; Wait mode waits. Fix what
  is wrong in the task that owns it.
- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`

```bash
git add -A docs DESIGN.md PRODUCT.md CLAUDE.md
git commit -m "Record sub-project 3: sheet music in the Player, the notation kernel, ADR 0013

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
