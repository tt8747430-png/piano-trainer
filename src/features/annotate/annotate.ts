import { samePlace, type Annotation, type PiecesStore } from '@/entities/piece'

/** A song's typed mark set (R29 B8): one of its kind at its place is replaced, never doubled. */
export function setAnnotation(store: PiecesStore, pieceId: string, mark: Annotation): void {
  store.setState((state) => {
    const kept = (state.annotations[pieceId] ?? []).filter((each) => !samePlace(each, mark))
    return { annotations: { ...state.annotations, [pieceId]: [...kept, mark] } }
  })
}

/** Every mark at a place of a song taken away: its tick on a staff. */
export function clearAnnotations(
  store: PiecesStore,
  pieceId: string,
  at: number,
  staff: Annotation['staff'],
): void {
  store.setState((state) => {
    const kept = (state.annotations[pieceId] ?? []).filter(
      (each) => each.at !== at || each.staff !== staff,
    )
    const { [pieceId]: _gone, ...others } = state.annotations
    return { annotations: kept.length > 0 ? { ...others, [pieceId]: kept } : others }
  })
}
