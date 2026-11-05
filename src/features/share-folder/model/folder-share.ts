import type { ShelvedFolder } from '@/entities/library'
import { readSharedSong, type Piece, type PieceId, type SharedSong } from '@/entities/piece'
import type { FolderShare } from '@/shared/api/groups'
import type { Json } from '@/shared/api/supabase'
import { isRecord } from '@/shared/lib'
import { songToShare } from '@/features/share-song'

/** A song as a shared folder holds it: one of the app's by its id, a learner's own whole. */
export type SharedEntry =
  | { readonly kind: 'built-in'; readonly id: PieceId }
  | { readonly kind: 'own'; readonly song: SharedSong }

/**
 * A folder as it is shared with a group (R30 S6): its name and look, and each of its songs, one of
 * the app's by its id (every member has it), a learner's own whole (its title and music). A song
 * that is no longer there, or written in degrees, is left out.
 */
export function folderShareOf(
  folder: ShelvedFolder,
  name: string,
  pieceOf: (id: PieceId) => Piece | undefined,
  titleOf: (piece: Piece) => string,
): FolderShare {
  const songs = folder.songs.flatMap((id): Json[] => {
    const piece = pieceOf(id)
    if (!piece) return []
    const shared = songToShare(piece, titleOf(piece), undefined)
    if (!shared) return []
    if (shared.kind === 'piece') return [{ kind: 'built-in', id }]
    return [
      JSON.parse(JSON.stringify({ kind: 'own', title: shared.song.title, ...shared.song.music })),
    ]
  })
  return { folderKey: folder.id, name, picture: folder.picture, paint: folder.paint, songs }
}

/** A shared folder's songs as they read: each that reads, in its order; one that does not, left out. */
export function readSharedEntries(songs: readonly Json[]): SharedEntry[] {
  return songs.flatMap((song): SharedEntry[] => {
    if (!isRecord(song)) return []
    if (song.kind === 'built-in' && typeof song.id === 'string')
      return [{ kind: 'built-in', id: song.id }]
    if (song.kind !== 'own') return []
    const { kind: _kind, ...rest } = song
    const read = readSharedSong(rest)
    return read ? [{ kind: 'own', song: read }] : []
  })
}
