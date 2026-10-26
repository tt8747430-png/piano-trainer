import type { LibrarySort, LibraryStore } from '@/entities/library'

/** How the library's songs are listed, kept: Manual, Name or Recently played. */
export function setSort(store: LibraryStore, sort: LibrarySort): void {
  store.setState({ sort })
}
