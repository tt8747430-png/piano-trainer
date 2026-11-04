import { describe, expect, it } from 'vitest'
import { can, LIBRARY_ACTS, type LibraryAct, type LibraryRole } from './permissions'

const BUILT_IN = { builtIn: true }
const OWN = { builtIn: false }

/** D8's table: in a built-in folder, what each role may do. */
const ALLOWED: Readonly<Record<LibraryRole, readonly LibraryAct[]>> = {
  learner: ['open', 'sort', 'favourite', 'editScore', 'archiveSong'],
  editor: [
    'open',
    'sort',
    'favourite',
    'editScore',
    'archiveSong',
    'addSong',
    'importSong',
    'moveIn',
    'moveOut',
  ],
  admin: [
    'open',
    'sort',
    'favourite',
    'editScore',
    'archiveSong',
    'addSong',
    'importSong',
    'moveIn',
    'moveOut',
  ],
}

describe('the library’s permissions (R29 B4, D8)', () => {
  it.each(Object.entries(ALLOWED))(
    'lets a %s do in a built-in folder what D8 says, and no more',
    (role, allowed) => {
      for (const act of LIBRARY_ACTS) {
        expect([act, can({ role: role as LibraryRole }, act, BUILT_IN)]).toEqual([
          act,
          allowed.includes(act),
        ])
      }
    },
  )

  it('lets anyone do anything in their own folders', () => {
    for (const role of ['learner', 'editor', 'admin'] as const) {
      for (const act of LIBRARY_ACTS) expect(can({ role }, act, OWN)).toBe(true)
    }
  })

  it('leaves a built-in folder itself to the catalog: no one renames, archives or deletes it', () => {
    for (const act of [
      'renameFolder',
      'recolourFolder',
      'archiveFolder',
      'deleteFolder',
    ] as const) {
      expect(can({ role: 'admin' }, act, BUILT_IN)).toBe(false)
    }
  })
})
