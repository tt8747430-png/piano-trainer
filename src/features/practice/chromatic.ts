import { accompanimentOptions } from '@/entities/pattern'
import { fourToALine, wholeBar } from '@/entities/piece'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import {
  note,
  pitchClass,
  pitchClassOf,
  type ChordQuality,
  type SpelledNote,
} from '@/shared/lib/music'
import {
  chromaticRoot,
  inTableOrder,
  type ChromaticChoice,
  type ChromaticDirection,
} from './chromatic-choice'

/** Semitones from the root: up to its octave, down to the octave below, or up and back, the octave once. */
const STEPS: Readonly<Record<ChromaticDirection, readonly number[]>> = {
  up: Array.from({ length: 13 }, (_, i) => i),
  down: Array.from({ length: 13 }, (_, i) => -i),
  both: Array.from({ length: 25 }, (_, i) => 12 - Math.abs(12 - i)),
}
const C_MAJOR = { tonic: note('C'), minor: false }

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
  const bars = STEPS[direction].flatMap((step) =>
    qualities.map((quality) =>
      wholeBar({ root: chromaticRoot(pitchClass(from + step), quality), quality }),
    ),
  )
  return { key: C_MAJOR, meter: '4/4', sections: [{ lines: fourToALine(bars) }] }
}

/** The chromatic walk as the Player plays it: the learner's pattern and hands' figures. */
export function arrangeChromatic(choice: ChromaticChoice): Performance {
  const chart = chromaticChart(choice.root, choice.chords, choice.direction)
  return arrange(chart, { tonic: chart.key.tonic, ...accompanimentOptions(choice) })
}
