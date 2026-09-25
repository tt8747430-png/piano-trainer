import { CHORD_QUALITIES, qualityIntervals, type Chord, type ChordQuality } from './chord'
import { pitchClass } from './pitch'
import type { Tone } from './tone'

/** A chord built on one scale degree, with its Roman numeral (`ii`, `vii°`, `III+`). */
export interface DiatonicChord {
  readonly roman: string
  readonly chord: Chord
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
const NUMERAL_MARKS: Partial<Record<ChordQuality, string>> = {
  dim: '°',
  o7: '°',
  hd: 'ø',
  aug: '+',
  M7s5: '+',
}

/** The quality whose `size` tones lie these semitones above the root, first in table order. */
const qualityOf = (semitones: readonly number[]): ChordQuality | undefined =>
  CHORD_QUALITIES.find((quality) => {
    const intervals = qualityIntervals(quality)
    return (
      intervals.length === semitones.length &&
      intervals.every((interval, i) => interval.semitones % 12 === semitones[i])
    )
  })

/** Triads (3) or seventh chords (4) stacked in thirds on each degree of a 7-note scale. */
export function diatonicChords(scale: readonly Tone[], size: 3 | 4): DiatonicChord[] {
  if (scale.length !== 7) return []
  return scale.flatMap((root, degree) => {
    // Every other note from this degree on: root, 3rd, 5th, 7th.
    const fromDegree = [...scale.slice(degree), ...scale.slice(0, degree)]
    const stacked = fromDegree.filter((_, i) => i % 2 === 0).slice(0, size)
    const quality = qualityOf(stacked.map((tone) => pitchClass(tone.semitones - root.semitones)))
    if (!quality) return []
    const minorThird = qualityIntervals(quality)[1]?.semitones === 3
    const numeral = NUMERALS[degree] ?? ''
    return [
      {
        roman: (minorThird ? numeral.toLowerCase() : numeral) + (NUMERAL_MARKS[quality] ?? ''),
        chord: { root: root.note, quality },
      },
    ]
  })
}
