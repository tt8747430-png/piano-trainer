import { useEffect } from 'react'
import { usePracticeLibraryStoreApi, type ArrangedLibrary } from '@/entities/practice-library'
import { markPracticeUsed } from '../mark-used'

/** A library row's page, as it opens, puts the row first in its library's Recently used. */
export function useMarkPracticeUsed(library: ArrangedLibrary, id: string): void {
  const store = usePracticeLibraryStoreApi()
  useEffect(() => markPracticeUsed(store, library, id), [store, library, id])
}
