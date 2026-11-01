import type { Lesson, LessonBlock } from '@/entities/lesson'
import {
  keyText,
  readMusic,
  writeBar,
  writeHand,
  writeStaff,
  type PieceMusic,
} from '@/entities/piece'
import {
  beatsPerBar,
  beatsToTicks,
  C_MAJOR,
  isCompound,
  TICKS_PER_BEAT,
  writtenName,
  type Midi,
  type SpelledNote,
  type Tick,
} from '@/shared/lib/music'
import { noteLine, type NoteLineMeter } from '@/shared/lib/schedule'

/** A lesson's example of notes (ADR 0053): one line, or a tune over a bass line. */
export type NotesBlock = Extract<LessonBlock, { kind: 'notes' }>

/** The meters a lesson's line of notes is written in (`noteLine`'s). */
const LINE_METERS: readonly string[] = ['2/4', '3/4', '4/4', '6/8', '12/8']
const isLineMeter = (meter: string): meter is NoteLineMeter => LINE_METERS.includes(meter)

/** A note of a line, on the line's timeline. */
interface LineNote {
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
}

/** The bars a line of `count` bars spans, end to end. */
const spans = (count: number, ticks: Tick) =>
  Array.from({ length: count }, (_, bar) => ({ startTick: bar * ticks, ticks }))

/**
 * An example's notes as the score editor opens them (round 27): a line alone a single staff in its
 * clef, the piano hidden (a lead sheet); a tune over a bass line the grand staff, each hand its own.
 * Its bars as many as its longer line fills, none with a chord symbol (ADR 0094 C), in its key and
 * time.
 */
export function exampleMusic(block: NotesBlock): PieceMusic {
  const key = block.key ?? C_MAJOR
  const meter = block.meter ?? '4/4'
  const upper = noteLine(block.notes, { hand: block.clef === 'bass' ? 'lh' : 'rh', meter, key })
  const lower = block.bass === undefined ? null : noteLine(block.bass, { hand: 'lh', meter, key })
  const beats = beatsPerBar(meter)
  const ticks = beatsToTicks(beats)
  const count = Math.max(upper.bars.length, lower?.bars.length ?? 0)
  const bars = spans(count, ticks)
  const barTicks = bars.map(() => ticks)
  const bar = writeBar({ chords: [], beats }, meter)
  /** A line's notes bar by bar, each from its bar's start, as a hand is written. */
  const byBar = (notes: readonly LineNote[]) =>
    bars.map(({ startTick }) =>
      notes
        .filter((each) => each.startTick >= startTick && each.startTick < startTick + ticks)
        .map((each) => ({ ...each, startTick: each.startTick - startTick })),
    )
  const silent = writeHand(
    bars.map(() => []),
    barTicks,
  )
  return {
    key: keyText(key),
    meter,
    tempo: 72,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: [bars.map(() => bar).join(' ')] }],
    ...(lower === null
      ? {
          staves: [
            {
              ...(block.clef === 'bass' ? { clef: 'bass' as const } : {}),
              notes: writeStaff(upper.notes, bars),
            },
          ],
          leadSheet: true,
          hands: { rh: silent, lh: silent },
        }
      : {
          hands: {
            rh: writeHand(byBar(upper.notes), barTicks),
            lh: writeHand(byBar(lower.notes), barTicks),
          },
        }),
  }
}

/** What an example cannot hold of what the score editor wrote. */
export type ExampleRefusal = 'marks' | 'chords' | 'staves' | 'rhythm' | 'meter'

/** A value a lesson writes, by its length in quarter notes, longest first: `2.` a dotted half. */
const VALUES: readonly (readonly [number, string])[] = [
  [4, '1'],
  [3, '2.'],
  [2, '2'],
  [1.5, '4.'],
  [1, '4'],
  [0.75, '8.'],
  [0.5, '8'],
  [0.375, '16.'],
  [0.25, '16'],
]

/** A length cut into the values that write it, longest first; null where none does. */
function valuesOf(ticks: Tick, perQuarter: number): string[] | null {
  const out: string[] = []
  let left = ticks
  for (const [quarters, value] of VALUES) {
    const length = quarters * perQuarter
    while (left >= length - 0.5) {
      out.push(value)
      left -= length
    }
  }
  return Math.abs(left) < 0.5 ? out : null
}

/** A token as a lesson writes it: a quarter note its name alone, a rest always with its value. */
const token = (name: string, value: string) =>
  value === '4' && name !== 'r' ? name : `${name}/${value}`

/** A line of notes as a lesson writes it (`noteLine`'s text), or why it cannot be. */
function lineText(
  notes: readonly (LineNote & { readonly marked: boolean })[],
  meter: NoteLineMeter,
): string | ExampleRefusal {
  const perQuarter = isCompound(meter) ? (TICKS_PER_BEAT * 2) / 3 : TICKS_PER_BEAT
  const sorted = [...notes].sort((a, b) => a.startTick - b.startTick)
  const tokens: string[] = []
  let running: Tick = 0
  for (const each of sorted) {
    if (each.marked) return 'marks'
    if (each.startTick < running) return 'chords'
    if (each.startTick > running) {
      const rests = valuesOf(each.startTick - running, perQuarter)
      if (!rests) return 'rhythm'
      tokens.push(...rests.map((value) => token('r', value)))
    }
    const parts = valuesOf(each.durationTicks, perQuarter)
    if (!parts) return 'rhythm'
    const name = writtenName(each.midi, each.spelled)
    tokens.push(
      ...parts.map((value, at) => `${token(name, value)}${at < parts.length - 1 ? '~' : ''}`),
    )
    running = each.startTick + each.durationTicks
  }
  return tokens.join(' ')
}

/**
 * The example the score editor's music writes back (round 27), in the key and time it gave it, or
 * why it cannot: a mark on a note, notes struck together, staves past its one or two, a rhythm no
 * value writes (a tuplet), a time a lesson's line is not written in.
 */
export function exampleBlock(
  music: PieceMusic,
  block: NotesBlock,
): { ok: true; block: NotesBlock } | { ok: false; why: ExampleRefusal } {
  const { chart, staves } = readMusic(music)
  if (!isLineMeter(chart.meter)) return { ok: false, why: 'meter' }
  if (chart.sections.some((section) => section.key || section.meter))
    return { ok: false, why: 'meter' }
  const meter = chart.meter
  const ticks = beatsToTicks(beatsPerBar(meter))
  const marked = (each: { marks?: unknown; finger?: unknown; lyrics?: unknown }) =>
    each.marks !== undefined || each.finger !== undefined || each.lyrics !== undefined
  let upper: string | ExampleRefusal
  let lower: string | ExampleRefusal | undefined
  let clef = block.clef
  if (staves.length > 1) return { ok: false, why: 'staves' }
  const [staff] = staves
  if (staff) {
    upper = lineText(
      staff.notes.map((each) => ({ ...each, marked: marked(each) })),
      meter,
    )
    clef = staff.clef === 'bass' ? 'bass' : 'treble'
  } else {
    const bars = chart.sections.flatMap((section) => section.lines.flat())
    const hand = (side: 'rh' | 'lh') =>
      bars.flatMap((bar, at) =>
        (bar.hands?.[side] ?? []).map((each) => ({
          ...each,
          startTick: each.startTick + at * ticks,
          marked: marked(each),
        })),
      )
    upper = lineText(hand('rh'), meter)
    lower = lineText(hand('lh'), meter)
  }
  for (const line of [upper, lower]) {
    if (line === 'marks' || line === 'chords' || line === 'rhythm') return { ok: false, why: line }
  }
  const { bass: _bass, key: _key, meter: _meter, ...rest } = block
  const sameKey = keyText(chart.key) === keyText(C_MAJOR)
  return {
    ok: true,
    block: {
      ...rest,
      clef,
      notes: upper as string,
      ...(lower !== undefined ? { bass: lower as string } : {}),
      ...(meter === '4/4' ? {} : { meter }),
      ...(sameKey ? {} : { key: chart.key }),
    },
  }
}

/** A lesson's examples of notes in the order it reads them: how its editor and the score's name one. */
export const notesBlocks = (lesson: Lesson): NotesBlock[] =>
  lesson.sections.flatMap((section) =>
    section.blocks.filter((each): each is NotesBlock => each.kind === 'notes'),
  )

/** The lesson with its example of notes at `at` (among them) replaced; the lesson as it is without one. */
export function withNotesBlock(lesson: Lesson, at: number, block: NotesBlock): Lesson {
  let seen = -1
  let found = false
  const sections = lesson.sections.map((section) => ({
    ...section,
    blocks: section.blocks.map((each) => {
      if (each.kind !== 'notes') return each
      seen += 1
      if (seen !== at) return each
      found = true
      return block
    }),
  }))
  return found ? { ...lesson, sections } : lesson
}
