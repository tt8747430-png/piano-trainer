/** The libraries of Practice (R30-4), each its own words for the same shape. */
export const LIBRARY_KINDS = ['exercises', 'accompaniment', 'progressions'] as const
export type LibraryKind = (typeof LIBRARY_KINDS)[number]

/** What a library's places are, in its tree's heading, its sort and its table: books or styles. */
export type GroupWord = 'book' | 'style'
