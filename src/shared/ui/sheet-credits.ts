/** What a score prints under its title (Flat's credits), each line as the learner typed it. */
export interface SheetCreditLines {
  readonly subtitle?: string
  readonly composer?: string
  readonly lyricist?: string
  readonly arranger?: string
}

/** A credits row's height, in CSS px at print size: the subtitle's and each name's. */
const ROW = 24
/** The room between the title and its credits, in CSS px. */
export const CREDITS_GAP = 4

/** Whether a score prints any credits under its title. */
export const hasCredits = (credits: SheetCreditLines | undefined): credits is SheetCreditLines =>
  credits !== undefined && Object.values(credits).some((line) => line !== undefined)

/**
 * The room a score's credits take under its title (a page's, dealing its lines): the subtitle's row,
 * then as many rows as the taller side holds (the lyricist at the left, the composer and the arranger
 * at the right); none without credits.
 */
export function creditsRoom(credits: SheetCreditLines | undefined): number {
  if (!hasCredits(credits)) return 0
  const left = Number(credits.lyricist !== undefined)
  const right = Number(credits.composer !== undefined) + Number(credits.arranger !== undefined)
  return CREDITS_GAP + ROW * (Number(credits.subtitle !== undefined) + Math.max(left, right))
}
