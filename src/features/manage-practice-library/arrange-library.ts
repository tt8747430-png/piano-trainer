import {
  addFolder,
  arrangedName,
  libraryFolderId,
  type ArrangedLibrary,
  type Arrangement,
  type LibraryFolderId,
  type PracticeLibraryStore,
} from '@/entities/practice-library'

/**
 * Changes how the learner arranges a Practice library (R32), by one of the entity's own changes
 * (`renamePlace`, `setPlaceHidden`, `orderPlaces`, `deleteFolder`, `moveItem`, `renameItem`,
 * `setItemHidden`, `orderItems`), saved and synced with the rest of `pt-practice-library`.
 */
export function arrangeLibrary(
  store: PracticeLibraryStore,
  library: ArrangedLibrary,
  change: (arrangement: Arrangement) => Arrangement,
): void {
  store.setState((state) => ({
    arrangements: { ...state.arrangements, [library]: change(state.arrangements[library]) },
  }))
}

/**
 * A folder of the learner's own made in a library, last among its places, under a number never used
 * before; its id, or null for a name that does not keep.
 */
export function makeLibraryFolder(
  store: PracticeLibraryStore,
  library: ArrangedLibrary,
  name: string,
): LibraryFolderId | null {
  if (!arrangedName(name)) return null
  const id = libraryFolderId(store.getState().nextFolder)
  store.setState((state) => ({
    nextFolder: state.nextFolder + 1,
    arrangements: {
      ...state.arrangements,
      [library]: addFolder(state.arrangements[library], id, name),
    },
  }))
  return id
}
