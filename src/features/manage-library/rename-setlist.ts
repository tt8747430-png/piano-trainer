import { setlistName, type LibraryStore } from '@/entities/library'

/** Names a setlist anew, trimmed; an empty name, or one too long, changes nothing. */
export function renameSetlist(store: LibraryStore, id: string, name: string): void {
  const kept = setlistName(name)
  if (!kept) return
  store.setState(({ setlists }) => ({
    setlists: setlists.map((setlist) => (setlist.id === id ? { ...setlist, name: kept } : setlist)),
  }))
}
