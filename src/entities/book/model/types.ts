import { isOneOf } from '@/shared/lib'

/** The printed songbooks and methods a Source cites. */
export const BOOK_IDS = ['bozhe-spasibo', 'called-to-play', 'seven-types'] as const
export type BookId = (typeof BOOK_IDS)[number]

export interface Book {
  /** As printed. */
  readonly title: string
  readonly author: string
}

/**
 * The books that teach accompaniment, in the order they are listed: each has its lessons on Learn, its
 * patterns and the pieces they are practised on.
 */
export const METHOD_BOOK_IDS = [
  'called-to-play',
  'seven-types',
] as const satisfies readonly BookId[]
export type MethodBookId = (typeof METHOD_BOOK_IDS)[number]
export const isMethodBookId = isOneOf(METHOD_BOOK_IDS)
