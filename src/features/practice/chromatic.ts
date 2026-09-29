import {
  LEFT_FIGURES,
  PATTERNS,
  RIGHT_FIGURES,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import { isOneOf } from '@/shared/lib'
import { arrange, type Chart, type ChartBar, type Performance } from '@/shared/lib/arrangement'
import {
  CHORD_QUALITIES,
  chordRootSpelling,
  note,
  pitchClass,
  pitchClassOf,
  qualityIntervals,
  type ChordQuality,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

export const CHROMATIC_DIRECTIONS = ['up', 'down', 'both'] as const
export type ChromaticDirection = (typeof CHROMATIC_DIRECTIONS)[number]

/** At least one chord quality: a chromatic walk always walks a chord. */
export type ChromaticChords = readonly [ChordQuality, ...ChordQuality[]]

/** The walk's own chords, direction, tempo and pattern: what the Player plays when its URL chooses none. */
export const CHROMATIC = {
  chords: ['maj'],
  direction: 'up',
  tempo: 72,
  pattern: 'block',
} as const satisfies {
  readonly chords: ChromaticChords
  readonly direction: ChromaticDirection
  readonly tempo: number
  readonly pattern: PatternId
}

/** What the learner walks: the Player's URL, read. */
export interface ChromaticChoice {
  readonly root: SpelledNote
  readonly chords: ChromaticChords
  readonly direction: ChromaticDirection
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
}

/** Semitones from the root: up to its octave, down to the octave below, or up and back, the octave once. */
const STEPS: Readonly<Record<ChromaticDirection, readonly number[]>> = {
  up: Array.from({ length: 13 }, (_, i) => i),
  down: Array.from({ length: 13 }, (_, i) => -i),
  both: Array.from({ length: 25 }, (_, i) => 12 - Math.abs(12 - i)),
}
const BARS_PER_LINE = 4
const C_MAJOR = { tonic: note('C'), minor: false }

const isQuality = isOneOf(CHORD_QUALITIES)

/** The chosen qualities in the table's order, each once. */
const inTableOrder = (chords: readonly ChordQuality[]): ChordQuality[] =>
  CHORD_QUALITIES.filter((quality) => chords.includes(quality))

/** A chord's root on this pitch class, spelled by the one rule over its intervals: G♯m9, A♭Maj9. */
export const chromaticRoot = (pc: PitchClass, quality: ChordQuality): SpelledNote =>
  chordRootSpelling(pc, qualityIntervals(quality))

/** The URL's chords (`m9.maj9.n9`) read: known qualities, each once, in the table's order; none is the walk's own. */
export function readChords(value: unknown): ChromaticChords {
  const [first, ...rest] =
    typeof value === 'string' ? inTableOrder(value.split('.').filter(isQuality)) : []
  return first ? [first, ...rest] : CHROMATIC.chords
}

/** Chords as the URL writes them: the table's order, joined by `.`. */
export const chordsParam = (chords: readonly ChordQuality[]): string =>
  inTableOrder(chords).join('.')

/**
 * The chosen qualities root by root, a semitone at a time from `root`, a bar of 4/4 each, four bars
 * a line; in C, so the sheet music writes each chord's accidentals.
 */
export function chromaticChart(
  root: SpelledNote,
  chords: readonly ChordQuality[],
  direction: ChromaticDirection,
): Chart {
  const from = pitchClassOf(root)
  const qualities = inTableOrder(chords)
  const bars: ChartBar[] = STEPS[direction].flatMap((step) =>
    qualities.map((quality) => ({
      chords: [{ root: chromaticRoot(pitchClass(from + step), quality), quality, beats: 4 }],
      beats: 4,
    })),
  )
  const lines = Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
  return { key: C_MAJOR, meter: '4/4', sections: [{ lines }] }
}

/** The chromatic walk as the Player plays it: the learner's pattern and hands' figures. */
export function arrangeChromatic(choice: ChromaticChoice): Performance {
  const chart = chromaticChart(choice.root, choice.chords, choice.direction)
  return arrange(chart, {
    tonic: chart.key.tonic,
    pattern: PATTERNS[choice.pattern].pattern,
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
  })
}
