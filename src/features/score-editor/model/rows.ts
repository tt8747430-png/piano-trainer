import type { Draft, Layer } from './draft'

type Rows = Pick<Draft, 'melodyStaff' | 'leadSheet'>

/**
 * The rows the score holds and the caret writes, top down (ADR 0091, 0094): the chord symbols, the
 * tune's staff where the score has one, the right hand's and the left's unless the piano is hidden
 * (a lead sheet, ADR 0083). Which of them a reader sees is the View's.
 */
export function shownRows(draft: Rows): Layer[] {
  return [
    'chords',
    ...(draft.melodyStaff ? (['melody'] as const) : []),
    ...(draft.leadSheet ? [] : (['rh', 'lh'] as const)),
  ]
}

/** The first staff's row the caret writes in, top down: the tune's or the right hand's. */
export const topStaff = (draft: Rows): Layer =>
  shownRows(draft).find((row) => row !== 'chords') ?? 'rh'

/**
 * Where the caret goes from a row put out of sight or taken away: the right hand's, else (a lead
 * sheet) the top staff's.
 */
export const staffLeftFor = (draft: Rows): Layer => (draft.leadSheet ? topStaff(draft) : 'rh')
