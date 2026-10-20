/** An A4 page in CSS pixels at 96 dpi, and its margin (15 mm). */
export const PAGE = { width: 794, height: 1123, margin: 57 } as const

/**
 * Items of known height dealt onto pages of `room`, in order: an item starts a new page where it does
 * not fit on the one begun; one taller than a page has a page of its own. A heading never ends a page:
 * it goes over with the item after it.
 */
export function paginate<T>(
  items: readonly T[],
  heightOf: (item: T) => number,
  room: number,
  keepsWithNext: (item: T) => boolean = () => false,
): T[][] {
  const pages: T[][] = []
  let page: T[] = []
  let used = 0
  items.forEach((item, index) => {
    const next = items[index + 1]
    const height = heightOf(item) + (keepsWithNext(item) && next !== undefined ? heightOf(next) : 0)
    if (page.length > 0 && used + height > room) {
      pages.push(page)
      page = []
      used = 0
    }
    page.push(item)
    used += heightOf(item)
  })
  if (page.length > 0) pages.push(page)
  return pages
}
