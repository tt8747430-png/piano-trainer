import { accompanimentOptions, type Accompaniment, type PatternId } from '@/entities/pattern'
import { fourToALine, wholeBar, type ChordSize } from '@/entities/piece'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
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
export interface ProgressionChoice extends Accompaniment {
  readonly numerals: readonly Numeral[]
  readonly key: Key
  readonly chordSize: ChordSize
}

/** Numerals in a key at a chord size, a chord a bar of 4/4, four bars a line. */
export function progressionChart(
  numerals: readonly Numeral[],
  key: Key,
  chordSize: ChordSize,
): Chart {
  const bars = numerals.map((numeral) => wholeBar(numeralChord(numeral, key, chordSize)))
  return { key, meter: '4/4', sections: [{ lines: fourToALine(bars) }] }
}

/** A progression as the Player plays it: the learner's pattern, hands' figures and chord size. */
export function arrangeProgression(choice: ProgressionChoice): Performance {
  const chart = progressionChart(choice.numerals, choice.key, choice.chordSize)
  return arrange(chart, { tonic: chart.key.tonic, ...accompanimentOptions(choice) })
}
