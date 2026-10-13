import {
  chordSymbol,
  numeralChord,
  walkKeys,
  type ChordSize,
  type Key,
  type KeyWalk,
  type Numeral,
} from '@/shared/lib/music'

/**
 * What a walk through the keys plays first, to read on its row: the progression's chords in its first
 * two keys, so the course's Шаг 2 reads as the sheet writes it (Dm7 G7 CMaj7 · Cm7 F7 B♭Maj7 …).
 */
export function walkPreview(
  numerals: readonly Numeral[],
  key: Key,
  walk: KeyWalk,
  size: ChordSize,
): string {
  const keys = walkKeys(key, walk).slice(0, 2)
  const lines = keys.map((each) =>
    numerals.map((numeral) => chordSymbol(numeralChord(numeral, each, size))).join(' '),
  )
  return `${lines.join(' · ')} …`
}
