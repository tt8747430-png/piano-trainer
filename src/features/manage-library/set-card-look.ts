import type { CardLook, CardPlace, LibraryStore } from '@/entities/library'

/** A card look kept for each of `places` (Apply to…, R29 B9). */
export function setCardLook(
  store: LibraryStore,
  places: readonly CardPlace[],
  look: CardLook,
): void {
  const cardLooks = { ...store.getState().cardLooks }
  for (const place of places) cardLooks[place] = look
  store.setState({ cardLooks })
}

/** A place back to the default look: its own look forgotten. */
export function resetCardLook(store: LibraryStore, place: CardPlace): void {
  const { [place]: _gone, ...cardLooks } = store.getState().cardLooks
  store.setState({ cardLooks })
}
