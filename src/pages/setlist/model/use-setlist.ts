import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  piecesIn,
  selectRoomForSetlist,
  useLibrary,
  useLibraryStoreApi,
  type Setlist,
} from '@/entities/library'
import { entryWords, useRepertoire, type PieceId } from '@/entities/piece'
import {
  deleteSetlist,
  duplicateSetlist,
  moveInSetlist,
  removeFromSetlist,
  renameSetlist,
} from '@/features/manage-library'
import { matchesQuery } from '@/shared/lib'

/**
 * A setlist's page's acts (ADR 0103): its songs as the learner has them, those its search keeps, and
 * what is done to it: renamed, copied (the copy opened), its songs taken out or moved, deleted (its
 * page left first, back to Songs' setlists).
 */
export function useSetlist(setlist: Setlist, query: string) {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const repertoire = useRepertoire()
  const navigate = useNavigate()
  const room = useLibrary(selectRoomForSetlist)
  const pieces = useMemo(() => piecesIn(setlist.pieces, repertoire), [setlist.pieces, repertoire])
  const shown = useMemo(
    () => pieces.filter((piece) => matchesQuery(entryWords(piece), query)),
    [pieces, query],
  )
  const { id } = setlist
  return {
    pieces,
    shown,
    /** Whether the library has room for its copy. */
    room,
    rename: (name: string) => renameSetlist(store, id, name),
    duplicate: () => {
      const copy = duplicateSetlist(store, id, (name) => t('library.copyName', { name }))
      if (copy) void navigate({ to: '/songs/setlists/$setlistId', params: { setlistId: copy } })
    },
    remove: (piece: PieceId) => removeFromSetlist(store, id, piece),
    move: (order: PieceId[]) => moveInSetlist(store, id, order),
    // Leave the page first: it has nothing to show once the setlist is gone.
    delete: () =>
      void navigate({ to: '/songs', search: { collection: 'setlists' }, replace: true }).then(() =>
        deleteSetlist(store, id),
      ),
  }
}
