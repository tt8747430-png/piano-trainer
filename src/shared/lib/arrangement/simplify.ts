import { chordSymbol, isSimpleChord, simplifyChord } from '@/shared/lib/music'
import type { Chart, ChartChord } from './types'

/** A chart's chord as its plain triad, lasting as long and played by the same method. */
const simplified = ({ beats, method, ...chord }: ChartChord): ChartChord => ({
  ...simplifyChord(chord),
  beats,
  ...(method === undefined ? {} : { method }),
})

/**
 * A bar's chords simplified, each written otherwise than the one before it held on where it plays
 * the same as that one (C then C/E is C for both), as a lead sheet writes a chord once; a chord
 * written twice stays twice, and so do two played by different methods.
 */
function simplifiedBar(chords: readonly ChartChord[]): ChartChord[] {
  const played: ChartChord[] = []
  chords.forEach((chord, index) => {
    const plain = simplified(chord)
    const last = played.at(-1)
    const before = chords[index - 1]
    const holds =
      last !== undefined &&
      before !== undefined &&
      chordSymbol(before) !== chordSymbol(chord) &&
      chordSymbol(last) === chordSymbol(plain) &&
      last.method === plain.method
    if (holds) played[played.length - 1] = { ...last, beats: last.beats + plain.beats }
    else played.push(plain)
  })
  return played
}

/**
 * A chart as Simplify plays it (ADR 0105): every chord its plain triad on its root (`simplifyChord`),
 * a bar's chord held on where the next simplifies to it; a bar of no chord, and every bar's written
 * hands and barlines, as they are.
 */
export const simplifyChart = (chart: Chart): Chart => ({
  ...chart,
  sections: chart.sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) =>
      line.map((bar) => ({ ...bar, chords: simplifiedBar(bar.chords) })),
    ),
  })),
})

/** Whether Simplify would change nothing in a chart: every chord of it is a plain triad already. */
export const isSimpleChart = (chart: Chart): boolean =>
  chart.sections.every((section) =>
    section.lines.every((line) => line.every((bar) => bar.chords.every(isSimpleChord))),
  )
