import { showsAStaff, type HiddenRow } from '@/entities/piece'
import type { Draft, Layer } from './draft'

type Rows = Pick<Draft, 'melodyStaff' | 'hidden'>

/**
 * The rows the sheet shows and the caret writes, top down (ADR 0072, 0091, 0094): the chord names
 * unless the score hides them, the tune's staff where the score has one, the right hand's and the
 * left's unless the piano is hidden (a lead sheet, ADR 0083).
 */
export function shownRows(draft: Rows): Layer[] {
  return [
    ...(rowShown(draft, 'chords') ? (['chords'] as const) : []),
    ...(draft.melodyStaff ? (['melody'] as const) : []),
    ...(rowShown(draft, 'piano') ? (['rh', 'lh'] as const) : []),
  ]
}

/** Whether a row the score may hide is on the sheet. */
export const rowShown = (draft: Rows, row: HiddenRow): boolean => !draft.hidden.includes(row)

/** Whether a score with `hidden` out of sight still shows a staff: it never hides every one (ADR 0083). */
export const keepsAStaff = (draft: Rows, hidden: readonly HiddenRow[]): boolean =>
  showsAStaff(hidden, draft.melodyStaff)

/**
 * The hidden rows of a draft whose staves changed: the piano shown again where no other staff is in
 * sight (a lead sheet's tune taken away).
 */
export const withAStaff = (draft: Rows): HiddenRow[] =>
  keepsAStaff(draft, draft.hidden)
    ? [...draft.hidden]
    : draft.hidden.filter((row) => row !== 'piano')

/** The first staff's row the caret writes in, top down: the tune's or the right hand's. */
export const topStaff = (draft: Rows): Layer =>
  shownRows(draft).find((row) => row !== 'chords') ?? 'rh'

/**
 * Where the caret goes from a row put out of sight or taken away: the right hand's, else (a lead
 * sheet) the top staff's.
 */
export const staffLeftFor = (draft: Rows): Layer =>
  rowShown(draft, 'piano') ? 'rh' : topStaff(draft)
