import {
  ownProgressionId,
  ownProgressionName,
  type OwnProgression,
  type OwnProgressionId,
  type PracticeLibraryStore,
} from '@/entities/practice-library'
import { parseNumerals } from '@/shared/lib/music'

/** What New progression and a progression's Edit hand over: a name as typed, its line and how it is read. */
export type OwnProgressionDraft = Omit<OwnProgression, 'id'>

/**
 * Keeps the learner's progression in Mine: under `id` in its place, or as a new one under the next
 * number (as is one deleted in another tab while it was changed). Hands back its id; null, and nothing
 * kept, where the name is empty once trimmed or too long, or the line does not read.
 */
export function saveProgression(
  store: PracticeLibraryStore,
  draft: OwnProgressionDraft,
  id?: OwnProgressionId,
): OwnProgressionId | null {
  const name = ownProgressionName(draft.name)
  if (!name || (parseNumerals(draft.line)?.length ?? 0) === 0) return null
  const { progressions, nextOwn } = store.getState()
  if (id && progressions.some((each) => each.id === id)) {
    store.setState({
      progressions: progressions.map((each) => (each.id === id ? { ...draft, id, name } : each)),
    })
    return id
  }
  const made = ownProgressionId(nextOwn)
  store.setState({
    progressions: [...progressions, { ...draft, id: made, name }],
    nextOwn: nextOwn + 1,
  })
  return made
}
