import type { BarRange } from '@/features/score-editor'
import type { ScoreLayout } from '@/shared/ui/score'

/**
 * How far the bars chosen reach past their staves (a staff space, as Sibelius's and Flat's boxes do),
 * in from their barlines, and before the first note where a line starts with its clef and key.
 */
const CHOSEN = { over: 10, inset: 4, lead: 8 } as const

export interface ChosenBox {
  readonly left: number
  readonly width: number
  readonly top: number
  readonly height: number
}

/**
 * The bars chosen on a line as one box (as a notation app draws a range, one box a system): from the
 * first chosen bar's first note (its clef and key left out) to the last's barline, inset so the next
 * line's or section's bars stay clear;
 * over the staff of the row they are chosen in (`staff`), else from the line's top staff to its
 * foot, reaching up over the chord row (`row`) where the chords are what is chosen. None where no bar of the line is chosen.
 */
export function chosenBox(
  layout: Pick<ScoreLayout, 'measures' | 'staves'>,
  bars: readonly number[],
  selection: BarRange | null,
  {
    chords = false,
    row = 0,
    staff,
  }: {
    chords?: boolean
    row?: number
    /** The staff of the row the bars are chosen in: the box covers it alone. */
    staff?: { readonly top: number; readonly bottom: number } | undefined
  } = {},
): ChosenBox | null {
  if (!selection) return null
  const chosen = layout.measures.filter((_, index) => {
    const bar = bars[index] ?? -1
    return bar >= selection.from && bar <= selection.to
  })
  const first = chosen[0]
  const last = chosen.at(-1)
  const staves = staff ? [staff] : Object.values(layout.staves)
  if (!first || !last || staves.length === 0) return null
  const top = chords ? -row : Math.min(...staves.map((box) => box.top)) - CHOSEN.over
  const bottom = Math.max(...staves.map((box) => box.bottom)) + CHOSEN.over
  const left = Math.max(first.x + CHOSEN.inset, first.notes - CHOSEN.lead)
  return {
    left,
    width: last.x + last.width - CHOSEN.inset - left,
    top,
    height: bottom - top,
  }
}
