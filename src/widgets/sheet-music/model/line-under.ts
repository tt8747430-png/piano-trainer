/**
 * The bar under a point on the screen, whichever line of the score holds it: each line marks its
 * sheet (`data-loop-line`) with its first bar and its measures' right edges in layout px, so a loop's
 * grip dragged off its own line (a phone lays one bar to a line) keeps finding bars. Above every line
 * is the first bar, below every line the last; between two lines, the nearer.
 */
export function barUnderPoint(x: number, y: number): number | null {
  const lines = [...document.querySelectorAll<HTMLElement>('[data-loop-line]')]
  if (lines.length === 0) return null
  let best: HTMLElement | undefined
  let distance = Number.POSITIVE_INFINITY
  for (const line of lines) {
    const box = line.getBoundingClientRect()
    const off = y < box.top ? box.top - y : y > box.bottom ? y - box.bottom : 0
    if (off < distance) {
      distance = off
      best = line
    }
  }
  if (!best) return null
  const first = Number(best.dataset.first)
  const ends = (best.dataset.ends ?? '').split(',').map(Number)
  const box = best.getBoundingClientRect()
  const zoom = best.offsetWidth > 0 && box.width > 0 ? box.width / best.offsetWidth : 1
  const at = (x - box.left) / zoom
  const index = ends.findIndex((end) => at < end)
  return first + (index < 0 ? ends.length - 1 : index)
}
