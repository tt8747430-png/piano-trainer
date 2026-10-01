import { accompanimentOptions, type PatternBook } from '@/entities/pattern'
import { fourToALine, wholeBar } from '@/entities/piece'
import { arrange, chartInKeys, type Chart, type Performance } from '@/shared/lib/arrangement'
import { numeralChord, walkKeys, type ChordSize, type Key, type Numeral } from '@/shared/lib/music'
import type { ProgressionChoice } from './progression-choice'

/** Numerals in a key at a chord size, a chord a bar of 4/4, four bars a line. */
export function progressionChart(
  numerals: readonly Numeral[],
  key: Key,
  chordSize: ChordSize,
): Chart {
  const bars = numerals.map((numeral) => wholeBar(numeralChord(numeral, key, chordSize)))
  return { key, meter: '4/4', sections: [{ lines: fourToALine(bars) }] }
}

/**
 * A progression as the Player plays it: the learner's pattern, hands' figures and chord size, in its
 * key or walked through the keys.
 */
export function arrangeProgression(choice: ProgressionChoice, book: PatternBook): Performance {
  const inKey = progressionChart(choice.numerals, choice.key, choice.chordSize)
  const chart = choice.walk ? chartInKeys(inKey, walkKeys(choice.key, choice.walk)) : inKey
  return arrange(chart, { tonic: chart.key.tonic, ...accompanimentOptions(book, choice) })
}
