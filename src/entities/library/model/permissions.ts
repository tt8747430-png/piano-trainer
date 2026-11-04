/**
 * Who may do what in the library (R29 B4, D8): one table every screen asks, never a check of its
 * own. A learner's own folders and songs are theirs to do anything with; in a built-in folder
 * (the app's collections) a learner opens, sorts, favourites, edits a song's score (their own
 * version) and archives a song for themselves, and an editor also adds songs and moves them in and
 * out. A built-in folder itself is renamed, recoloured, archived or deleted by no one from the
 * library: it is the catalog's. Learner view asks with a learner's role (B5).
 */
export type LibraryRole = 'learner' | 'editor' | 'admin'

export const LIBRARY_ACTS = [
  'open',
  'sort',
  'favourite',
  'editScore',
  'archiveSong',
  'addSong',
  'importSong',
  'moveIn',
  'moveOut',
  'renameFolder',
  'recolourFolder',
  'archiveFolder',
  'deleteFolder',
  'deleteSong',
] as const
export type LibraryAct = (typeof LIBRARY_ACTS)[number]

/** Where an act is done: a folder (the learner's own or built-in), or the library's top. */
export interface LibraryTarget {
  /** Whether it is one of the app's collections (or a song in one), not the learner's own. */
  readonly builtIn: boolean
}

/** What anyone may do in a built-in folder, for themselves. */
const EVERYONE_BUILT_IN: ReadonlySet<LibraryAct> = new Set([
  'open',
  'sort',
  'favourite',
  'editScore',
  'archiveSong',
])

/** What an editor may do there besides: the collection's songs are theirs to keep. */
const EDITOR_BUILT_IN: ReadonlySet<LibraryAct> = new Set([
  'addSong',
  'importSong',
  'moveIn',
  'moveOut',
])

const editsContent = (role: LibraryRole) => role === 'editor' || role === 'admin'

/** Whether `actor` may do `act` on `target` (D8's table). */
export function can(
  actor: { readonly role: LibraryRole },
  act: LibraryAct,
  target: LibraryTarget,
): boolean {
  if (!target.builtIn) return true
  if (EVERYONE_BUILT_IN.has(act)) return true
  return editsContent(actor.role) && EDITOR_BUILT_IN.has(act)
}
