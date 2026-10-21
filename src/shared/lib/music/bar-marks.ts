/** How a bar ends, besides a plain barline: a double barline, the final one, or a repeat back. */
export const BARLINES = ['double', 'final', 'repeat'] as const
export type Barline = (typeof BARLINES)[number]

/** The endings a repeated passage takes: the first time through, then the second. */
export const ENDINGS = [1, 2] as const
export type Ending = (typeof ENDINGS)[number]

/** What a bar's barlines say: a repeat starting at it, how it ends, the ending it belongs to. */
export interface BarMarks {
  readonly repeatStart?: true
  readonly barline?: Barline
  readonly ending?: Ending
}

/**
 * The bars in the order they are played, by their written index: back once from a repeat's end to
 * its start (the piece's, where none starts it), the 1st ending's bars left out the second time, the
 * 2nd ending's played then.
 */
export function playOrder(bars: readonly BarMarks[]): number[] {
  const order: number[] = []
  const taken = new Set<number>()
  let start = 0
  let second = false
  let i = 0
  while (i < bars.length) {
    const bar = bars[i] ?? {}
    if (bar.repeatStart && !second) start = i
    if (second && bar.ending === 1) {
      i += 1
      continue
    }
    order.push(i)
    if (bar.barline === 'repeat' && !taken.has(i)) {
      taken.add(i)
      second = true
      i = start
      continue
    }
    // Past the repeated passage: the next repeat starts after it, unless a bar says otherwise.
    if (second && (bar.barline === 'repeat' || bar.ending === 2 || bars[i + 1]?.repeatStart)) {
      second = bar.ending === 2 && bars[i + 1]?.ending === 2
      start = i + 1
    }
    i += 1
  }
  return order
}
