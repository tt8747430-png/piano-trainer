import type { CellBar } from '@/features/practice'

/**
 * The beat strip's pages (R29, Chordify's): each line of the chart a page of its own, a line wider
 * than the room (`room`, in beats) split into pages of whole bars; a bar wider than the room has a
 * page alone. Each page holds the indexes of its bars among `bars`.
 */
export function stripPages(bars: readonly CellBar[], room: number): number[][] {
  const pages: number[][] = []
  let page: number[] = []
  let beats = 0
  let line: number | null = null
  bars.forEach((bar, index) => {
    const width = bar.cells.length
    const turns = line !== bar.line || beats + width > room
    if (turns && page.length > 0) {
      pages.push(page)
      page = []
      beats = 0
    }
    page.push(index)
    beats += width
    line = bar.line
  })
  if (page.length > 0) pages.push(page)
  return pages
}

/** The page the bar at `bar` is on. */
export const pageOf = (pages: readonly (readonly number[])[], bar: number): number =>
  Math.max(
    0,
    pages.findIndex((page) => page.includes(bar)),
  )
