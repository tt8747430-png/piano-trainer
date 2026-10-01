import {
  accompanimentOptions,
  type Accompaniment,
  type PatternFit,
  type PatternId,
} from '@/entities/pattern'
import { fourToALine, wholeBar } from '@/entities/piece'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import {
  scaleChordAt,
  scaleKey,
  type ScaleKind,
  type SpelledNote,
  SIZE_NOTES,
  type ChordSize,
} from '@/shared/lib/music'

/**
 * The walk's own tempo, pattern and chord size: what the Player plays when its URL chooses none; and
 * what it has for a pattern: a key, no tune, no methods of its own.
 */
export const WALK = {
  tempo: 72,
  pattern: 'block',
  chordSize: 'triads',
  fit: { methodCodes: false, melody: false, key: true, simpleTime: true },
} as const satisfies {
  readonly tempo: number
  readonly pattern: PatternId
  readonly chordSize: ChordSize
  readonly fit: PatternFit
}

/** Up from the tonic to its octave and back down, a degree a bar. */
const WALK_DEGREES = [0, 1, 2, 3, 4, 5, 6, 0, 6, 5, 4, 3, 2, 1, 0]

/** What the learner walks a scale's chords with: the Player's URL, read. */
export interface WalkChoice extends Accompaniment {
  readonly root: SpelledNote
  readonly kind: ScaleKind
  readonly chordSize: ChordSize
}

/** A seven-note scale's chords up to the tonic's octave and back, a bar each of 4/4, four bars a line, in the scale's key. */
export function walkChart(root: SpelledNote, kind: ScaleKind, chordSize: ChordSize): Chart {
  const bars = WALK_DEGREES.map((degree) =>
    wholeBar(scaleChordAt(root, kind, degree, SIZE_NOTES[chordSize])),
  )
  return { key: scaleKey(root, kind), meter: '4/4', sections: [{ lines: fourToALine(bars) }] }
}

/** The walk as the Player plays it: the learner's pattern, hands' figures and chord size. */
export function arrangeWalk(choice: WalkChoice): Performance {
  const chart = walkChart(choice.root, choice.kind, choice.chordSize)
  return arrange(chart, { tonic: chart.key.tonic, ...accompanimentOptions(choice) })
}
