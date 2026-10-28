/**
 * How a score is laid out (ADR 0096, 0108), in the order it is offered: A4 pages as it will print;
 * lines one under the other, scrolled down; or one line, scrolled across. The sheet music's layout in
 * the Player's View and the editor's, saved for every piece.
 */
export const SHEET_VIEWS = ['page', 'vertical', 'panorama'] as const
export type SheetView = (typeof SHEET_VIEWS)[number]

/** An A4 page in CSS pixels at 96 dpi, and its margin (15 mm). */
export const PAGE = { width: 794, height: 1123, margin: 57 } as const

/**
 * The engraving's size on a page, as it prints (ADR 0096): a staff a 33rd of the page's width (24 px
 * of 794), as the hymnals in `piano-data/scores` print theirs (18 pt of 612). The page canvas zooms
 * it to the screen, so a page is never laid out again for a narrow one.
 */
export const PRINT_SCALE = 0.6

/**
 * The most a gap between systems grows by to fill a page (ADR 0087), in CSS px at print size: ten
 * staff spaces (6 px each at `PRINT_SCALE`). LilyPond spreads a page's systems over all of it
 * (`ragged-bottom` off, `system-system-spacing`'s stretchability) and MuseScore up to its Max. system
 * distance (15 spaces); a page of two systems spread over A4 reads as gaps, so a gap grows only so
 * far and what is left stays at the page's foot.
 */
export const PAGE_STRETCH = 60

/**
 * Items of known height dealt onto pages of `room`, in order: an item starts a new page where it does
 * not fit on the one begun, or where it breaks the page before it (a page break, ADR 0097); one
 * taller than a page has a page of its own. A heading never ends a page: it goes over with the item
 * after it.
 */
export function paginate<T>(
  items: readonly T[],
  heightOf: (item: T) => number,
  room: number,
  keepsWithNext: (item: T) => boolean = () => false,
  breaksBefore: (item: T) => boolean = () => false,
): T[][] {
  const pages: T[][] = []
  let page: T[] = []
  let used = 0
  items.forEach((item, index) => {
    const next = items[index + 1]
    const height = heightOf(item) + (keepsWithNext(item) && next !== undefined ? heightOf(next) : 0)
    if (page.length > 0 && (used + height > room || breaksBefore(item))) {
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
