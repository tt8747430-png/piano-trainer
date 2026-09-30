import { parseNumerals, type Key, type Numeral, type ChordSize } from '@/shared/lib/music'
import type { LessonProgression } from './types'

/** A lesson's progression as the Progressions tool's row plays it: its numerals read, its size chosen. */
export interface ProgressionInKey {
  readonly numerals: readonly Numeral[]
  readonly key: Key
  readonly size: ChordSize
}

/** Reads a lesson's progression; numerals it cannot read are a content error, which the catalog test catches. */
export function readProgression({
  numerals,
  key,
  size = 'triads',
}: LessonProgression): ProgressionInKey {
  const read = parseNumerals(numerals)
  if (!read) throw new RangeError(`A lesson's progression "${numerals}" cannot be read`)
  return { numerals: read, key, size }
}
