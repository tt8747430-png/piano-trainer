import type { ChartBar } from '@/shared/lib/arrangement'
import type { Chord } from '@/shared/lib/music'

const BARS_PER_LINE = 4

/** A chord held a whole bar of 4/4: how the app writes a chart of chords it works out. */
export const wholeBar = (chord: Chord): ChartBar => ({ chords: [{ ...chord, beats: 4 }], beats: 4 })

/** Bars four to a line: how the app lays out a chart it writes. */
export const fourToALine = (bars: readonly ChartBar[]): ChartBar[][] =>
  Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
