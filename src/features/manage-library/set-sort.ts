import {
  sortStarts,
  type LibrarySort,
  type LibraryStore,
  type SortDirection,
} from '@/entities/library'

/** How the library's songs are listed, kept: a sort chosen starts its own way (names from A, dates newest first). */
export function setSort(store: LibraryStore, sort: LibrarySort): void {
  store.setState({ sort, direction: sortStarts(sort) })
}

/** Which way the library's sort runs, kept. */
export function setSortDirection(store: LibraryStore, direction: SortDirection): void {
  store.setState({ direction })
}
