import { note, type Key, type SpelledNote } from '@/shared/lib/music'
import { transposeChord, transposeNotes } from './arrange'
import type { Chart, WrittenHands } from './types'

const C_MAJOR: Key = { tonic: note('C'), minor: false }

/** A bar's written hands moved from one tonic to another. */
const handsIn = (hands: WrittenHands, from: SpelledNote, to: SpelledNote): WrittenHands => ({
  ...(hands.rh ? { rh: transposeNotes(hands.rh, from, to) } : {}),
  ...(hands.lh ? { lh: transposeNotes(hands.lh, from, to) } : {}),
})

/**
 * A chart played once in each key, a section per key, written in C so the sheet music writes each
 * chord's accidentals (as the chromatic walk does). Its own sections give way to the keys.
 */
export function chartInKeys(chart: Chart, keys: readonly Key[]): Chart {
  const lines = chart.sections.flatMap((section) => section.lines)
  return {
    key: C_MAJOR,
    meter: chart.meter,
    sections: keys.map((key) => ({
      lines: lines.map((line) =>
        line.map((bar) => ({
          ...bar,
          chords: bar.chords.map((chord) => ({
            ...chord,
            ...transposeChord(chord, chart.key.tonic, key.tonic),
          })),
          ...(bar.hands ? { hands: handsIn(bar.hands, chart.key.tonic, key.tonic) } : {}),
        })),
      ),
    })),
  }
}
