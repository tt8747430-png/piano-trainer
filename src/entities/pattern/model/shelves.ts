import { METHOD_BOOK_IDS } from '@/entities/book'
import { isOneOf } from '@/shared/lib'
import { PATTERN_GROUP_ENTRIES } from '../content/patterns'
import type { PatternChoice } from './accompaniment'
import type { BookPattern, PatternBook } from './book'
import type { PatternRef } from './own'
import type { PatternsState } from './store'
import {
  isPatternGroup,
  isPatternId,
  PATTERN_GROUPS,
  type PatternGroup,
  type PatternId,
} from './types'
import { patternsIn } from './selectors'

/** A titled run of patterns in a list: the learner's favourites or own, a built-in group, the hidden. */
export interface PatternShelf {
  readonly shelf: 'favourites' | 'own' | PatternGroup | 'hidden'
  readonly patterns: readonly BookPattern[]
}

/**
 * The reference's parts, each a page of Accompaniment: a method book's groups, the rhythm styles, and
 * what the learner starred, made and hid.
 */
export const REFERENCE_PARTS = [...METHOD_BOOK_IDS, 'styles', 'yours'] as const
export type ReferencePart = (typeof REFERENCE_PARTS)[number]
export const isReferencePart = isOneOf(REFERENCE_PARTS)

/** The part a shelf is on: a group's book's, Styles for a group of no book, Yours for the learner's. */
export const partOfShelf = (shelf: PatternShelf['shelf']): ReferencePart =>
  isPatternGroup(shelf) ? (PATTERN_GROUP_ENTRIES[shelf].book ?? 'styles') : 'yours'

type Choices = Pick<PatternsState, 'favourites' | 'hidden'>

const inBook = (book: PatternBook, refs: readonly PatternRef[]): BookPattern[] =>
  refs.flatMap((ref) => {
    const entry = book.get(ref)
    return entry ? [entry] : []
  })

/**
 * Favourites, the learner's own, then each built-in group, each without what `leftOut` leaves out (a
 * built-in only: an own pattern is never hidden); none empty.
 */
function shelves(
  book: PatternBook,
  { favourites }: Choices,
  leftOut: (id: PatternId) => boolean,
): PatternShelf[] {
  const kept = (ref: PatternRef) => !(isPatternId(ref) && leftOut(ref))
  return [
    { shelf: 'favourites' as const, patterns: inBook(book, favourites.filter(kept)) },
    { shelf: 'own' as const, patterns: book.own },
    ...PATTERN_GROUPS.map((group) => ({
      shelf: group,
      patterns: inBook(
        book,
        patternsIn(group).filter((id) => !leftOut(id)),
      ),
    })),
  ].filter((shelf) => shelf.patterns.length > 0)
}

/**
 * One part of the reference, Accompaniment's list: a book's groups or the rhythm styles without the
 * hidden; on Yours the favourites, the learner's own, and the hidden at the end, so one can be found
 * and shown again.
 */
export function referenceShelves(
  book: PatternBook,
  choices: Choices,
  part: ReferencePart,
): PatternShelf[] {
  const hidden = new Set(choices.hidden)
  const shown = shelves(book, choices, (id) => hidden.has(id))
  const away = inBook(book, choices.hidden)
  const all: PatternShelf[] =
    away.length > 0 ? [...shown, { shelf: 'hidden', patterns: away }] : shown
  return all.filter(({ shelf }) => partOfShelf(shelf) === part)
}

/** The Setup's picker: as the reference, but the hidden are left out, all but the one playing now. */
export function pickerShelves(
  book: PatternBook,
  choices: Choices,
  chosen: PatternChoice,
): PatternShelf[] {
  const hidden = new Set(choices.hidden)
  return shelves(book, choices, (id) => hidden.has(id) && id !== chosen)
}
