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
import { numeralChord, type Key, type Numeral } from '@/shared/lib/music'

/** A progression's own numerals, tempo, pattern and chord size: what the Player plays when its URL chooses none. */
export const PROGRESSION = {
  numerals: 'I-V-vi-IV',
  tempo: 80,
  pattern: 'block',
  chordSize: 'triads',
} as const satisfies {
  readonly numerals: string
  readonly tempo: number
  readonly pattern: PatternId
  readonly chordSize: ChordSize
}

/** What the learner plays a progression with: the Player's URL, read. */
export interface ProgressionChoice {
  readonly numerals: readonly Numeral[]
  readonly key: Key
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
  readonly chordSize: ChordSize
}

const BARS_PER_LINE = 4

/** Numerals in a key at a chord size, a chord a bar of 4/4, four bars a line. */
export function progressionChart(
  numerals: readonly Numeral[],
  key: Key,
  chordSize: ChordSize,
): Chart {
  const bars: ChartBar[] = numerals.map((numeral) => ({
    chords: [{ ...numeralChord(numeral, key, chordSize), beats: 4 }],
    beats: 4,
  }))
  const lines = Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
  return { key, meter: '4/4', sections: [{ lines }] }
}

/** A progression as the Player plays it: the learner's pattern, hands' figures and chord size. */
export function arrangeProgression(choice: ProgressionChoice): Performance {
  const chart = progressionChart(choice.numerals, choice.key, choice.chordSize)
  return arrange(chart, {
    tonic: chart.key.tonic,
    pattern: PATTERNS[choice.pattern].pattern,
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
  })
}
