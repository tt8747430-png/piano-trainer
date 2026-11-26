/** What a score prints under its title (Flat's credits), each line as the learner typed it. */
export interface SheetCreditLines {
  readonly subtitle?: string
  readonly composer?: string
  readonly lyricist?: string
  readonly arranger?: string
  readonly translator?: string
  /** A hymn tune's own name, printed under the subtitle in capitals. */
  readonly tune?: string
}

/** The lines a score prints under its title: its source, year and copyright are not among them. */
const PRINTED = ['subtitle', 'composer', 'lyricist', 'arranger', 'translator', 'tune'] as const

/** A credits row's height, in CSS px at print size: the subtitle's and each name's. */
const ROW = 24
/** The room between the title and its credits, in CSS px. */
export const CREDITS_GAP = 4

/** Whether a score prints any credits under its title. */
export const hasCredits = (credits: SheetCreditLines | undefined): credits is SheetCreditLines =>
  credits !== undefined && PRINTED.some((field) => credits[field] !== undefined)

/**
 * The room a score's credits take under its title (a page's, dealing its lines): the subtitle's row,
 * then the one line naming who wrote it; none without credits.
 */
export function creditsRoom(credits: SheetCreditLines | undefined): number {
  if (!hasCredits(credits)) return 0
  const subtitle = Number(credits.subtitle !== undefined)
  const named = PRINTED.some((field) => field !== 'subtitle' && credits[field] !== undefined)
  return CREDITS_GAP + ROW * (subtitle + Number(named))
}
