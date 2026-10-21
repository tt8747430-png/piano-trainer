import type { BarRange } from '@/features/score-editor'
import type { ScoreLayout } from '@/shared/ui/score'

/** How far the bars chosen reach past their staves, and in from their barlines. */
const CHOSEN = { over: 6, inset: 3 } as const

export interface ChosenBox {
  readonly left: number
  readonly width: number
  readonly top: number
  readonly height: number
}

/**
 * The bars chosen on a line as one box (as a notation app draws a range, one box a system): from the
 * first chosen bar's barline to the last's, inset so the next line's or section's bars stay clear;
 * from the line's top staff to its foot, reaching up over the chord row (`row`) where the chords are
 * what is chosen. None where no bar of the line is chosen.
 */
export function chosenBox(
  layout: Pick<ScoreLayout, 'measures' | 'staves'>,
  bars: readonly number[],
  selection: BarRange | null,
  { chords = false, row = 0 }: { chords?: boolean; row?: number } = {},
): ChosenBox | null {
  if (!selection) return null
  const chosen = layout.measures.filter((_, index) => {
    const bar = bars[index] ?? -1
    return bar >= selection.from && bar <= selection.to
  })
  const first = chosen[0]
  const last = chosen.at(-1)
  const staves = Object.values(layout.staves)
  if (!first || !last || staves.length === 0) return null
  const top = chords ? -row : Math.min(...staves.map((box) => box.top)) - CHOSEN.over
  const bottom = Math.max(...staves.map((box) => box.bottom)) + CHOSEN.over
  return {
    left: first.x + CHOSEN.inset,
    width: last.x + last.width - first.x - 2 * CHOSEN.inset,
    top,
    height: bottom - top,
  }
}
