import {
  RECENT_MAX,
  type ArrangedLibrary,
  type PracticeLibraryStore,
} from '@/entities/practice-library'

/** Puts a library's row first in its Recently used, as its page opens; the oldest past eight goes. */
export function markPracticeUsed(
  store: PracticeLibraryStore,
  library: ArrangedLibrary,
  id: string,
): void {
  store.setState((state) => {
    const list = state.recent[library]
    if (list[0] === id) return state
    return {
      recent: {
        ...state.recent,
        [library]: [id, ...list.filter((each) => each !== id)].slice(0, RECENT_MAX),
      },
    }
  })
}
