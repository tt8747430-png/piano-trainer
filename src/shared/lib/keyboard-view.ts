import type { KeyRange } from '@/shared/lib/music'
import type { KeyGeometry } from './keyboard-layout'

/** What a scroller shows: where it is scrolled to, the width it shows, and the width of all it holds. */
export interface ScrollMetrics {
  readonly scrollLeft: number
  readonly clientWidth: number
  readonly scrollWidth: number
}

/** The stretch in view, in fractions (0–1) of the whole keyboard. */
interface ViewFrame {
  readonly left: number
  readonly width: number
}

/** A key's edge a hair outside the view still counts as in it: percentages do not add up exactly. */
const EDGE = 1e-6

/** The stretch in view; all of the keyboard where nothing scrolls. */
export function viewFrame({ scrollLeft, clientWidth, scrollWidth }: ScrollMetrics): ViewFrame {
  if (scrollWidth <= clientWidth) return { left: 0, width: 1 }
  return { left: scrollLeft / scrollWidth, width: clientWidth / scrollWidth }
}

const within = ({ clientWidth, scrollWidth }: ScrollMetrics, left: number) =>
  Math.min(Math.max(0, scrollWidth - clientWidth), Math.max(0, left))

/** The scroll position that centres the view on a point of the keyboard (a fraction of its width). */
export const scrollToCentre = (metrics: ScrollMetrics, point: number): number =>
  within(metrics, point * metrics.scrollWidth - metrics.clientWidth / 2)

/** The scroll position an octave (seven of the keyboard's `whites` white keys) down or up. */
export const scrollByOctave = (metrics: ScrollMetrics, whites: number, by: -1 | 1): number =>
  within(metrics, metrics.scrollLeft + (by * 7 * metrics.scrollWidth) / whites)

/** The first and last white keys wholly in view; none where the view is narrower than a key. */
export function keysInView(keys: readonly KeyGeometry[], frame: ViewFrame): KeyRange | null {
  const from = frame.left * 100 - EDGE
  const to = (frame.left + frame.width) * 100 + EDGE
  const whites = keys.filter((key) => !key.black && key.left >= from && key.left + key.width <= to)
  const first = whites[0]
  const last = whites.at(-1)
  return first && last ? { from: first.midi, to: last.midi } : null
}

/** How far clear of the view's edge keys brought into it stand: a percent of the keyboard. */
const MARGIN = 1

/**
 * Where to scroll so a stretch of keys (`span`, in percent of the keyboard) is in view, moving no
 * further than that, a little clear of the edge it comes in at; null where it is in view already. A
 * stretch wider than the view stays where part of it shows, and is centred only where none does.
 */
export function scrollToReveal(
  metrics: ScrollMetrics,
  span: { readonly left: number; readonly right: number },
): number | null {
  const { scrollLeft, clientWidth, scrollWidth } = metrics
  if (scrollWidth <= clientWidth) return null
  const left = (span.left / 100) * scrollWidth
  const right = (span.right / 100) * scrollWidth
  const margin = (MARGIN / 100) * scrollWidth
  const viewRight = scrollLeft + clientWidth
  if (right - left > clientWidth) {
    const shows = right > scrollLeft && left < viewRight
    return shows ? null : scrollToCentre(metrics, (span.left + span.right) / 200)
  }
  if (left >= scrollLeft && right <= viewRight) return null
  return within(metrics, left < scrollLeft ? left - margin : right + margin - clientWidth)
}

/** Where to scroll once the keyboard is `scrollWidth` wide, so the point in the middle stays there. */
export function keepCentre(
  { scrollLeft, clientWidth, scrollWidth }: ScrollMetrics,
  nextWidth: number,
): number {
  const middle = (scrollLeft + clientWidth / 2) / scrollWidth
  return within(
    { scrollLeft, clientWidth, scrollWidth: nextWidth },
    middle * nextWidth - clientWidth / 2,
  )
}
