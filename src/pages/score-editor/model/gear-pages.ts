/**
 * The pages of the editor's one gear (R32-B, Flat's document menu): its first page (`main`) with the
 * score's acts and its Settings, each a row to its page; Title and credits, opened from the title
 * printed on the score alone (Flat's credits). The gear holds nothing the score prints and sets
 * where it prints it: no key, time, tempo or bars.
 */
export const GEAR_PAGES = [
  'main',
  'view',
  'transpose',
  'record',
  'credits',
  'instruments',
  'layout',
  'input',
  'recording',
] as const
export type GearPage = (typeof GEAR_PAGES)[number]

/**
 * Where Back goes from a page: the first page, or the sheet shut from the first page and from Title
 * and credits, which the score's title opens on its own.
 */
export const gearBack = (page: GearPage): GearPage | null =>
  page === 'main' || page === 'credits' ? null : 'main'
