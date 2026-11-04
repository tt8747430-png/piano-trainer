/**
 * One publishing model (R29 B6, ADR 0116's amendment): every item the app publishes, a song, a
 * pattern, a lesson, a course, a progression, has the same acts in the same places. The screens read
 * this table; its test holds every kind to it.
 */
export const PUBLISHED_KINDS = ['song', 'pattern', 'lesson', 'course', 'progression'] as const
export type PublishedKind = (typeof PUBLISHED_KINDS)[number]

/** What is done to an item. */
export const ITEM_ACTS = [
  'edit',
  'settings',
  'publish',
  'unpublish',
  'delete',
  'shareLink',
  'versions',
] as const
export type ItemAct = (typeof ITEM_ACTS)[number]

/**
 * Where an act lives: the item's bar (✎ and ⚙), a row of its Settings page, the last group of its
 * Settings (`DangerGroup`), on its Publish page, or the Publish page's foot (alone, in red).
 */
export type ActPlace = 'bar' | 'settings' | 'settings-danger' | 'publish-page' | 'publish-foot'

const PLACES: Readonly<Record<ItemAct, ActPlace>> = {
  edit: 'bar',
  settings: 'bar',
  publish: 'settings',
  unpublish: 'publish-foot',
  delete: 'settings-danger',
  shareLink: 'settings',
  versions: 'publish-page',
}

/** Where an act lives for a kind of item: the same for every kind. */
export const actPlace = (_kind: PublishedKind, act: ItemAct): ActPlace => PLACES[act]

/** The Settings page's publishing rows, in their order: Publish…, Share link, then Delete. */
export const SETTINGS_ROWS = [
  'publish',
  'shareLink',
  'delete',
] as const satisfies readonly ItemAct[]

/** Whether an act asks first (`ConfirmDialog`): what loses or hides work. */
export const ASKS_FIRST: ReadonlySet<ItemAct> = new Set(['unpublish', 'delete', 'versions'])

/**
 * Who publishes a kind, and where to: a learner their own song or pattern to Explore; an editor the
 * app's items to everyone (a lesson, a course, a progression is an editor's alone).
 */
export const PUBLISHERS: Readonly<
  Record<PublishedKind, { readonly learner: 'explore' | null; readonly editor: 'everyone' }>
> = {
  song: { learner: 'explore', editor: 'everyone' },
  pattern: { learner: 'explore', editor: 'everyone' },
  lesson: { learner: null, editor: 'everyone' },
  course: { learner: null, editor: 'everyone' },
  progression: { learner: null, editor: 'everyone' },
}
