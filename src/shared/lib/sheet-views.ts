/**
 * How a score is laid out (ADR 0064): lines down the screen, A4 pages as it will print, or one line
 * across, a panorama. The editor's and the Player's view, held in their URLs.
 */
export const SHEET_VIEWS = ['scroll', 'pages', 'horizontal'] as const
export type SheetView = (typeof SHEET_VIEWS)[number]
