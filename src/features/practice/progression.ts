import { accompanimentOptions, type PatternBook } from '@/entities/pattern'
import { fourToALine, wholeBar } from '@/entities/piece'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import {
  note,
  numeralChord,
  walkKeys,
  type ChordSize,
  type Key,
  type Numeral,
} from '@/shared/lib/music'
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
 * A progression walked through the keys, a section per key, each key's chords as the key alone names
 * them (E♭'s ♭VI7 is B7, as it is shown in E♭, never C♭7), written in C so the sheet music writes
 * each chord's accidentals.
 */
function walkedChart(keys: readonly Key[], inKey: (key: Key) => Chart): Chart {
  return {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    sections: keys.flatMap((key) => inKey(key).sections),
  }
}

/**
 * A progression as the Player plays it: the learner's pattern, hands' figures and chord size, in its
 * key or walked through the keys.
 */
export function arrangeProgression(choice: ProgressionChoice, book: PatternBook): Performance {
  const inKey = (key: Key) => progressionChart(choice.numerals, key, choice.chordSize)
  const chart = choice.walk
    ? walkedChart(walkKeys(choice.key, choice.walk), inKey)
    : inKey(choice.key)
  return arrange(chart, { tonic: chart.key.tonic, ...accompanimentOptions(book, choice) })
}
