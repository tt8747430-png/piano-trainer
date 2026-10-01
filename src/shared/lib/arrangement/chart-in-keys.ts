import { note, type Key } from '@/shared/lib/music'
import { transposeChord } from './arrange'
import type { Chart } from './types'

const C_MAJOR: Key = { tonic: note('C'), minor: false }

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
        })),
      ),
    })),
  }
}
