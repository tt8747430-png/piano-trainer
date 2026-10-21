import { METHOD_BOOK_IDS } from '@/entities/book'
import { isOneOf } from '@/shared/lib'

/**
 * Accompaniment's parts, each a tab of its page: a method book's groups, the rhythm styles, and what
 * the learner starred, made and hid.
 */
export const ACCOMPANIMENT_PARTS = [...METHOD_BOOK_IDS, 'styles', 'yours'] as const
export type AccompanimentPart = (typeof ACCOMPANIMENT_PARTS)[number]
export const isAccompanimentPart = isOneOf(ACCOMPANIMENT_PARTS)
