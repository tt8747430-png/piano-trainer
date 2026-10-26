import { useMemo } from 'react'
import { useRepertoire } from '@/entities/piece'
import { arrangeLibrary, type LibraryLayout } from './arrangement'
import { libraryCatalog } from './catalog'
import { useLibrary } from './context'
import type { LibraryState } from './store'

const selectFolders = (state: LibraryState) => state.folders
const selectHome = (state: LibraryState) => state.home
const selectArchive = (state: LibraryState) => state.archive

/** The library as it stands over the learner's repertoire: a new one only when either changes. */
export function useLibraryLayout(): LibraryLayout {
  const folders = useLibrary(selectFolders)
  const home = useLibrary(selectHome)
  const archive = useLibrary(selectArchive)
  const repertoire = useRepertoire()
  return useMemo(
    () => arrangeLibrary({ folders, home, archive }, libraryCatalog(repertoire)),
    [folders, home, archive, repertoire],
  )
}
