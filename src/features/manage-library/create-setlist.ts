import {
  selectRoomForSetlist,
  setlistId,
  setlistName,
  type LibraryStore,
  type SetlistId,
} from '@/entities/library'

/**
 * Makes an empty setlist at the end of the library under the next number, its name trimmed, and hands
 * back its id; none without a name, or once the library holds as many as it keeps.
 */
export function createSetlist(store: LibraryStore, name: string): SetlistId | null {
  const kept = setlistName(name)
  const state = store.getState()
  if (!kept || !selectRoomForSetlist(state)) return null
  const id = setlistId(state.nextSetlist)
  store.setState({
    setlists: [...state.setlists, { id, name: kept, pieces: [] }],
    nextSetlist: state.nextSetlist + 1,
  })
  return id
}
