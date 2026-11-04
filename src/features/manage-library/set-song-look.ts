import type { FolderLook, LibraryStore } from '@/entities/library'
import type { PieceId } from '@/entities/piece'

/** A song's colour and picture (B9, Appearance); none (`null`) puts its row back as the app draws it. */
export function setSongLook(store: LibraryStore, id: PieceId, look: FolderLook | null): void {
  const { [id]: _was, ...rest } = store.getState().songLooks
  store.setState({ songLooks: look ? { ...rest, [id]: look } : rest })
}
