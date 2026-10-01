import { repertoire, type PiecesState } from '@/entities/piece'

export { shelfOf } from '@/entities/piece'

/** The entry an id names in the learner's repertoire: a catalog entry in its version, or an own song. */
export const entryIn = (state: PiecesState, id: string) => repertoire(state).entry(id)
export { PiecePage } from '@/pages/piece'
export { SongsPage } from '@/pages/songs'
