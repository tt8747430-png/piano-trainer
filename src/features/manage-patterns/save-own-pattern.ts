import {
  ownName,
  ownPatternId,
  type OwnPattern,
  type OwnPatternId,
  type PatternsStore,
} from '@/entities/pattern'

/** What the editor hands over: a name as typed and a figure for each hand. */
export type OwnPatternDraft = Omit<OwnPattern, 'id'>

/**
 * Saves the learner's pattern: under `id` in its place, or as a new one under the next number. Hands
 * back its id; null, and nothing saved, where the name is empty once trimmed or too long.
 */
export function saveOwnPattern(
  store: PatternsStore,
  draft: OwnPatternDraft,
  id?: OwnPatternId,
): OwnPatternId | null {
  const name = ownName(draft.name)
  if (!name) return null
  const { own, nextOwn } = store.getState()
  if (id) {
    store.setState({
      own: own.map((pattern) => (pattern.id === id ? { ...draft, id, name } : pattern)),
    })
    return id
  }
  const made = ownPatternId(nextOwn)
  store.setState({ own: [...own, { ...draft, id: made, name }], nextOwn: nextOwn + 1 })
  return made
}
