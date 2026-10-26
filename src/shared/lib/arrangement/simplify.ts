import { isSimpleChord, simplifyChord } from '@/shared/lib/music'
import type { Chart, ChartChord } from './types'

/** A chart's chord as its plain triad, lasting as long and played by the same method. */
const simplified = ({ beats, method, ...chord }: ChartChord): ChartChord => ({
  ...simplifyChord(chord),
  beats,
  ...(method === undefined ? {} : { method }),
})

/**
 * A chart as Simplify plays it (ADR 0104): every chord its plain triad on its root (`simplifyChord`),
 * as long as it was; a bar of no chord, and every bar's written hands and barlines, as they are.
 */
export const simplifyChart = (chart: Chart): Chart => ({
  ...chart,
  sections: chart.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) =>
      line.map((bar) => ({ ...bar, chords: bar.chords.map(simplified) })),
    ),
  })),
})

/** Whether Simplify would change nothing in a chart: every chord of it is a plain triad already. */
export const isSimpleChart = (chart: Chart): boolean =>
  chart.sections.every((section) =>
    section.lines.every((line) => line.every((bar) => bar.chords.every(isSimpleChord))),
  )
