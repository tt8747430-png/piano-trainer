import { singleStaff } from '@/shared/lib/notation'
import type { Layer } from './draft'

/** What a score's rows are read from: how many single staves it has, and whether the piano is hidden. */
type Rows = { readonly staves: readonly unknown[]; readonly leadSheet: boolean }

/**
 * The rows the score holds and the caret writes, top down (ADR 0114, 0097): the chord
 * symbols, each single staff by its place, the right hand's and the left's unless the piano is
 * hidden (a lead sheet, ADR 0114). Which of them a reader sees is the View's.
 */
export function shownRows(draft: Rows): Layer[] {
  return [
    'chords',
    ...draft.staves.map((_, place) => singleStaff(place)),
    ...(draft.leadSheet ? [] : (['rh', 'lh'] as const)),
  ]
}

/** The first staff's row the caret writes in, top down: the top single staff's or the right hand's. */
export const topStaff = (draft: Rows): Layer =>
  shownRows(draft).find((row) => row !== 'chords') ?? 'rh'

/**
 * Where the caret goes from a row put out of sight or taken away: the right hand's, else (a lead
 * sheet) the top staff's.
 */
export const staffLeftFor = (draft: Rows): Layer => (draft.leadSheet ? topStaff(draft) : 'rh')
