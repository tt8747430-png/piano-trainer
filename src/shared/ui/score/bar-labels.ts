/** A bar as its labels read it: the section it is in, and the tempo marked over it. */
export interface LabelledBar {
  readonly section: number
  readonly tempo?: number | undefined
}

/**
 * What the labels' row prints at a bar's start (ADR 0087, 0095), in this order: a line's first bar
 * its number, as a printed system numbers its start; a section's first bar the section's name, as a
 * score prints a rehearsal mark; a bar a tempo is marked over, its tempo.
 */
export interface BarLabel {
  /** The bar's number in the piece, from 1. */
  readonly number?: number
  /** The section it starts, by its index. */
  readonly section?: number
  /** Beats a minute. */
  readonly tempo?: number
}

/**
 * The labels of a line's bars: the piece's bars `from` up to `to`, of `bars` (the piece's, as they
 * are played). A section starts where a bar's section is not the bar before's, so where the repeats
 * play a section again its name is printed again.
 */
export function barLabels(bars: readonly LabelledBar[], from: number, to: number): BarLabel[] {
  return bars.slice(from, to).map((bar, index) => {
    const at = from + index
    const starts = at === 0 || bars[at - 1]?.section !== bar.section
    return {
      ...(index === 0 ? { number: at + 1 } : {}),
      ...(starts ? { section: bar.section } : {}),
      ...(bar.tempo === undefined ? {} : { tempo: bar.tempo }),
    }
  })
}
