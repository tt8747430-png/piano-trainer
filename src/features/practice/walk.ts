import {
  LEFT_FIGURES,
  PATTERNS,
  RIGHT_FIGURES,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import type { ChordSize } from '@/entities/piece'
import { arrange, type Chart, type ChartBar, type Performance } from '@/shared/lib/arrangement'
import { scaleChordAt, scaleKey, type ScaleKind, type SpelledNote } from '@/shared/lib/music'

/** The walk's own tempo, pattern and chord size: what the Player plays when its URL chooses none. */
export const WALK = { tempo: 72, pattern: 'block', chordSize: 'triads' } as const satisfies {
  readonly tempo: number
  readonly pattern: PatternId
  readonly chordSize: ChordSize
}

/** Up from the tonic to its octave and back down, a degree a bar. */
const WALK_DEGREES = [0, 1, 2, 3, 4, 5, 6, 0, 6, 5, 4, 3, 2, 1, 0]
const BARS_PER_LINE = 4
const NOTES: Readonly<Record<ChordSize, 3 | 4 | 5>> = { triads: 3, sevenths: 4, ninths: 5 }

/** What the learner walks a scale's chords with: the Player's URL, read. */
export interface WalkChoice {
  readonly root: SpelledNote
  readonly kind: ScaleKind
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  readonly chordSize: ChordSize
}

/** A seven-note scale's chords up to the tonic's octave and back, a bar each of 4/4, four bars a line, in the scale's key. */
export function walkChart(root: SpelledNote, kind: ScaleKind, chordSize: ChordSize): Chart {
  const bars: ChartBar[] = WALK_DEGREES.map((degree) => ({
    chords: [{ ...scaleChordAt(root, kind, degree, NOTES[chordSize]), beats: 4 }],
    beats: 4,
  }))
  const lines = Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
  return { key: scaleKey(root, kind), meter: '4/4', sections: [{ lines }] }
}

/** The walk as the Player plays it: the learner's pattern, hands' figures and chord size. */
export function arrangeWalk(choice: WalkChoice): Performance {
  const chart = walkChart(choice.root, choice.kind, choice.chordSize)
  return arrange(chart, {
    tonic: chart.key.tonic,
    pattern: PATTERNS[choice.pattern].pattern,
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
  })
}
