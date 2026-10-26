import {
  SETLIST_NAME_MAX,
  selectRoomForSetlist,
  selectSetlist,
  setlistId,
  type LibraryStore,
  type SetlistId,
} from '@/entities/library'
import { nameFrom } from '@/shared/lib'

/**
 * Copies a setlist, its songs in order, to stand after it under the next number, named as `copyOf`
 * words a copy ("Sunday (copy)") within the longest name a setlist takes; hands back the copy's id,
 * none for a setlist not there or a library holding as many as it keeps.
 */
export function duplicateSetlist(
  store: LibraryStore,
  id: string,
  copyOf: (name: string) => string,
): SetlistId | null {
  const state = store.getState()
  const original = selectSetlist(id)(state)
  if (!original || !selectRoomForSetlist(state)) return null
  const copy = {
    id: setlistId(state.nextSetlist),
    name: nameFrom(original.name, copyOf, SETLIST_NAME_MAX),
    pieces: original.pieces,
  }
  const at = state.setlists.indexOf(original) + 1
  store.setState({
    setlists: [...state.setlists.slice(0, at), copy, ...state.setlists.slice(at)],
    nextSetlist: state.nextSetlist + 1,
  })
  return copy.id
}
