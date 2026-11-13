import { accompanimentOptions, type PatternBook } from '@/entities/pattern'
import { fourToALine, wholeBar } from '@/entities/piece'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import {
  C_MAJOR,
  chordSymbol,
  type ChordQuality,
  printedSymbol,
  pitchClass,
  pitchClassOf,
  qualityRootSpelling,
  type SpelledNote,
} from '@/shared/lib/music'
import { inTableOrder, type ChromaticChoice, type ChromaticDirection } from './chromatic-choice'

/**
 * Semitones from the root: up to its octave, down to the octave below, up and back with the octave
 * once, or round the circle of fifths a 4th up each time (C F B♭ …, the way a ii–V–I resolves) home.
 */
const STEPS: Readonly<Record<ChromaticDirection, readonly number[]>> = {
  up: Array.from({ length: 13 }, (_, i) => i),
  down: Array.from({ length: 13 }, (_, i) => -i),
  both: Array.from({ length: 25 }, (_, i) => 12 - Math.abs(12 - i)),
  fifths: Array.from({ length: 13 }, (_, i) => i * 5),
}
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
      wholeBar({ root: qualityRootSpelling(pitchClass(from + step), quality), quality }),
    ),
  )
  return { key: C_MAJOR, meter: '4/4', sections: [{ lines: fourToALine(bars) }] }
}

/** The chromatic walk as the Player plays it: the learner's pattern and hands' figures. */
export function arrangeChromatic(choice: ChromaticChoice, book: PatternBook): Performance {
  const chart = chromaticChart(choice.root, choice.chords, choice.direction)
  return arrange(chart, { tonic: chart.key.tonic, ...accompanimentOptions(book, choice) })
}

/** A walk's first chords as a row shows its music: `C°7 · C♯°7 · D°7 · D♯°7 …`. */
export function walkOpening(
  root: SpelledNote,
  quality: ChordQuality,
  direction: ChromaticDirection,
): string {
  const from = pitchClassOf(root)
  const symbols = STEPS[direction]
    .slice(0, 4)
    .map((step) =>
      printedSymbol(
        chordSymbol({ root: qualityRootSpelling(pitchClass(from + step), quality), quality }),
      ),
    )
  return `${symbols.join(' · ')} …`
}
