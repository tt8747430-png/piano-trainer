import type { LibraryStore } from '@/entities/library'

/** Takes a setlist away for good; its number is never given again. */
export function deleteSetlist(store: LibraryStore, id: string): void {
  store.setState(({ setlists }) => ({ setlists: setlists.filter((setlist) => setlist.id !== id) }))
}
