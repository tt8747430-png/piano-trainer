import type { PieceId } from '@/entities/piece'
import {
  barsLessonKey,
  chordLessonKey,
  type ChordLessonKey,
  type LessonKey,
} from '@/entities/progress'
import type { BarRange } from '@/features/practice'
import type { PerformedChord, Performance } from '@/shared/lib/arrangement'

// A section learned step by step (ADR 0111): each chord, each chord sequence in time,
// each change between two chords, each pattern it is played with. All of it is read from the
// piece as the Player plays it, its repeats taken, so a lesson's bars are the bars the Player loops.

/** A lesson the Player loops: its bars as played, and the key it is kept under once done. */
interface Looped {
  readonly bars: BarRange
  readonly key: LessonKey
}
/** A chord of the section, learned by playing it in its sheet. */
export interface ChordLesson {
  readonly kind: 'chord'
  /** As the performance writes it (`PerformedChord.symbol`): what its sheet shows and its key holds. */
  readonly symbol: string
  /** Where it first sounds in the section: its index among the performance's chords, as voiced there. */
  readonly chord: number
  readonly key: ChordLessonKey
}
/** A chord sequence played in time: its chords as they come, the same chord held over a barline once. */
export interface SequenceLesson extends Looped {
  readonly kind: 'sequence'
  readonly symbols: readonly string[]
}
/** One change from a chord to the next, looped where it first comes: the bar or two it spans. */
export interface ChangeLesson extends Looped {
  readonly kind: 'change'
  readonly from: string
  readonly to: string
}
/** A pattern the section's chords are played by, looped in a bar of it on one chord (ADR 0111). */
export interface PatternLesson extends Looped {
  readonly kind: 'pattern'
  readonly pattern: string
  readonly symbol: string
}
export type SongLesson = ChordLesson | SequenceLesson | ChangeLesson | PatternLesson

/** A section's lessons, in the order its page teaches them. */
export interface SectionLessons {
  /** Its bars as played, every pass of a repeat inside it: what its Practise loops. */
  readonly bars: BarRange
  /** Its chords in the order they first sound, each once. */
  readonly chords: readonly ChordLesson[]
  /** How many times its chords go round whole: more than 1 where it is one shorter run played round. */
  readonly rounds: number
  readonly sequences: readonly SequenceLesson[]
  readonly changes: readonly ChangeLesson[]
  /** None for a section written out note by note: no pattern plays it. */
  readonly patterns: readonly PatternLesson[]
}

/** A chord as a run holds it: its symbol, and the first and last bars it sounds in. */
interface RunChord {
  readonly symbol: string
  readonly first: number
  readonly last: number
}

/**
 * A section's bars as played: from the first bar of it the Player plays, on while the bars played
 * are its own, so a repeat inside it is every pass of it. None for a section the piece has not.
 */
export function sectionBarsPlayed(performance: Performance, section: number): BarRange | null {
  const first = performance.bars.findIndex((bar) => bar.section === section)
  if (first < 0) return null
  let last = first
  while (performance.bars[last + 1]?.section === section) last++
  return { first, last }
}

/** The chords sounding in some bars as played, in order, the same chord held over a barline once. */
function chordRun(performance: Performance, bars: BarRange): RunChord[] {
  const run: RunChord[] = []
  for (const chord of performance.chords) {
    if (chord.bar < bars.first || chord.bar > bars.last) continue
    const before = run.at(-1)
    if (before?.symbol === chord.symbol) run[run.length - 1] = { ...before, last: chord.bar }
    else run.push({ symbol: chord.symbol, first: chord.bar, last: chord.bar })
  }
  return run
}

const barsOf = ({ first, last }: BarRange): number[] =>
  Array.from({ length: last - first + 1 }, (_, i) => first + i)

/** What a bar holds, to tell two bars alike: its length, and each chord's symbol, start and length. */
function barShape(performance: Performance, played: number): string {
  const bar = performance.bars[played]
  if (!bar) return ''
  const chords = bar.chords.flatMap((index) => performance.chords[index] ?? [])
  return [
    bar.beats,
    ...chords.map(
      (chord) => `${chord.symbol}@${chord.startTick - bar.startTick}+${chord.durationTicks}`,
    ),
  ].join(' ')
}

/**
 * Where a section is one shorter run of chords played round whole, at least twice: how many times,
 * and one round's bars. Its bars falling alike round by round first, so a run that ends on the chord
 * it starts with (`G C D G | G C D G`, its Gs held over as one) still goes round; else its chords
 * alone, where they come back alike in bars of another rhythm.
 */
function roundsOf(
  performance: Performance,
  bars: BarRange,
  run: readonly RunChord[],
): { readonly rounds: number; readonly bars: BarRange } | null {
  const shapes = barsOf(bars).map((bar) => barShape(performance, bar))
  for (let size = 1; size <= shapes.length / 2; size++) {
    if (shapes.length % size !== 0) continue
    if (!shapes.every((shape, i) => shape === shapes[i % size])) continue
    const round = { first: bars.first, last: bars.first + size - 1 }
    if (chordRun(performance, round).length > 1)
      return { rounds: shapes.length / size, bars: round }
  }
  for (let size = 2; size <= run.length / 2; size++) {
    if (run.length % size !== 0) continue
    if (!run.every((chord, i) => chord.symbol === run[i % size]?.symbol)) continue
    const [first, last] = [run[0], run[size - 1]]
    if (first && last)
      return { rounds: run.length / size, bars: { first: first.first, last: last.last } }
  }
  return null
}

/**
 * A line's bars as played: from the first bar of it the Player plays, on while they are its own
 * (a repeat inside it every pass).
 */
function linesOf(performance: Performance, bars: BarRange): BarRange[] {
  const lines = new Map<number, BarRange>()
  const ended = new Set<number>()
  for (const played of barsOf(bars)) {
    const line = performance.bars[played]?.line ?? 0
    const sofar = lines.get(line)
    if (!sofar) lines.set(line, { first: played, last: played })
    else if (!ended.has(line) && sofar.last === played - 1)
      lines.set(line, { ...sofar, last: played })
    else ended.add(line)
  }
  return [...lines.values()]
}

const symbolsOf = (run: readonly RunChord[]) => run.map((chord) => chord.symbol)

/**
 * A section's chord sequences: the one round of a section played round, else its lines as written
 * whose chords differ (a line whose run of chords a line before it has is the same sequence), each
 * its first line's bars.
 */
function sequencesOf(
  performance: Performance,
  pieceId: PieceId,
  bars: BarRange,
  round: BarRange | null,
): SequenceLesson[] {
  const lines = round ? [round] : linesOf(performance, bars)
  const seen = new Set<string>()
  return lines.flatMap((line) => {
    const symbols = symbolsOf(chordRun(performance, line))
    const run = symbols.join(' ')
    if (symbols.length === 0 || seen.has(run)) return []
    seen.add(run)
    return [{ kind: 'sequence', symbols, bars: line, key: barsLessonKey(pieceId, line) }]
  })
}

/**
 * Each change from a chord to the next in the order they first come, each once: from the bar the
 * chord ends in to the bar the next starts in. A section played round has its last chord back to its
 * first among them, where one round meets the next.
 */
function changesOf(pieceId: PieceId, run: readonly RunChord[]): ChangeLesson[] {
  const seen = new Set<string>()
  return run.slice(1).flatMap((to, i) => {
    const from = run[i]
    const change = `${from?.symbol} ${to.symbol}`
    if (!from || seen.has(change)) return []
    seen.add(change)
    const bars = { first: from.last, last: to.first }
    return [
      { kind: 'change', from: from.symbol, to: to.symbol, bars, key: barsLessonKey(pieceId, bars) },
    ]
  })
}

/**
 * Each pattern the section's chords are played by, looped in a bar on one chord (ADR 0111): the
 * first bar it plays the section's first chord alone in, else the first it plays any chord alone in,
 * else the first bar it plays.
 */
function patternsOf(performance: Performance, pieceId: PieceId, bars: BarRange): PatternLesson[] {
  const within = performance.chords.filter(({ bar }) => bar >= bars.first && bar <= bars.last)
  const opening = within[0]?.symbol
  const alone = (bar: number) => performance.bars[bar]?.chords.length === 1
  const played = new Map<string, PerformedChord[]>()
  for (const chord of within) {
    if (chord.pattern === undefined) continue
    played.set(chord.pattern, [...(played.get(chord.pattern) ?? []), chord])
  }
  return [...played].flatMap(([pattern, chords]) => {
    const chord =
      chords.find((each) => each.symbol === opening && alone(each.bar)) ??
      chords.find((each) => alone(each.bar)) ??
      chords[0]
    if (!chord) return []
    const looped = { first: chord.bar, last: chord.bar }
    return [
      {
        kind: 'pattern',
        pattern,
        symbol: chord.symbol,
        bars: looped,
        key: barsLessonKey(pieceId, looped),
      },
    ]
  })
}

/** The section's chords in the order they first sound, each once, where it first sounds. */
function chordsOf(performance: Performance, pieceId: PieceId, bars: BarRange): ChordLesson[] {
  const firsts = new Map<string, number>()
  performance.chords.forEach(({ symbol, bar }, chord) => {
    if (bar >= bars.first && bar <= bars.last && !firsts.has(symbol)) firsts.set(symbol, chord)
  })
  return [...firsts].map(([symbol, chord]) => ({
    kind: 'chord',
    symbol,
    chord,
    key: chordLessonKey(pieceId, symbol),
  }))
}

/**
 * A section's lessons, from the piece as the Player plays it (its repeats taken) and the
 * section's index: none for a section the piece has not.
 */
export function sectionLessons(
  performance: Performance,
  pieceId: PieceId,
  section: number,
): SectionLessons | null {
  const bars = sectionBarsPlayed(performance, section)
  if (!bars) return null
  const run = chordRun(performance, bars)
  const round = roundsOf(performance, bars, run)
  return {
    bars,
    chords: chordsOf(performance, pieceId, bars),
    rounds: round?.rounds ?? 1,
    sequences: sequencesOf(performance, pieceId, bars, round?.bars ?? null),
    changes: changesOf(pieceId, run),
    patterns: patternsOf(performance, pieceId, bars),
  }
}

/** Every lesson of a section, in the order its page teaches them: its chords, sequences, changes, patterns. */
export const lessonsOf = (lessons: SectionLessons): readonly SongLesson[] => [
  ...lessons.chords,
  ...lessons.sequences,
  ...lessons.changes,
  ...lessons.patterns,
]

/** The keys a section's lessons are kept under, each once: a sequence may loop a change's bars. */
export const lessonKeys = (lessons: SectionLessons): readonly LessonKey[] => [
  ...new Set(lessonsOf(lessons).map((lesson) => lesson.key)),
]
