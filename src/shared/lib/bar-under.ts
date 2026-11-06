/**
 * The bar under a point on the screen on a view that marks each bar `data-bar` (its number, from 0),
 * looking past the grip being dragged; none between bars.
 */
export function barUnder(x: number, y: number): number | null {
  for (const element of document.elementsFromPoint(x, y)) {
    const bar = element.closest('[data-bar]')
    if (bar) return Number(bar.getAttribute('data-bar'))
  }
  return null
}
