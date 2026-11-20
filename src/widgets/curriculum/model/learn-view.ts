/**
 * A level's page and the Courses' page (canvas 163): whether an editor has it in Edit mode (R29 B4),
 * the level's lessons or the shelves edited in place.
 */
export interface LearnEdit {
  readonly edit: boolean
}

/** What Your lessons shows (canvas 165): its search, which kind, and their order. */
export type OwnShown = 'all' | 'lessons' | 'courses'
export type OwnSort = 'recent' | 'name'
export interface OwnLibraryView {
  readonly q: string
  readonly kind: OwnShown
  readonly sort: OwnSort
}
