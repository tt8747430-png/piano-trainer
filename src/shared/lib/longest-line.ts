/**
 * The Equal Columns Rule (DESIGN.md) for lines of bars, a chart's or a score's: the longest line's
 * bars (at least one), and a line's share of its width, so bars line up down the page.
 */
export function longestLine(lengths: readonly number[]): {
  longest: number
  shareOf: (length: number) => number
} {
  const longest = Math.max(1, ...lengths)
  return { longest, shareOf: (length) => length / longest }
}
