import { useNavigate } from '@tanstack/react-router'
import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { libraryCatalog, useLibraryStoreApi } from '@/entities/library'
import { usePiecesStoreApi, type OwnSongId, type PieceId } from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { resetVersion } from '@/features/edit-piece'
import { deleteOwnSongs } from '@/features/manage-library'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'

/**
 * The learner's music's way back, asked first: their version reset to the book's, or their song
 * deleted. The page opens it (`open`) from its More actions; it has no trigger of its own, so it gives
 * the focus back to `returnTo` (More actions) as it closes: the action that opened it is gone.
 */
export function OwnMusicAsk({
  piece,
  open,
  onOpenChange,
  returnTo,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** What takes the focus as it closes: a part of the page holding the control that opened it. */
  returnTo: RefObject<HTMLElement | null>
  piece:
    | { readonly kind: 'version'; readonly id: PieceId; readonly title: string }
    | {
        readonly kind: 'song'
        readonly id: OwnSongId
        readonly title: string
      }
}) {
  const { t } = useTranslation('piece')
  const store = usePiecesStoreApi()
  const takes = useTakesStoreApi()
  const library = useLibraryStoreApi()
  const navigate = useNavigate()
  const words = piece.kind === 'version' ? 'resetting' : 'deleting'
  const act = () => {
    if (piece.kind === 'version') {
      resetVersion(store, piece.id)
      return
    }
    // Leave the page first: it has nothing to show once the song is gone.
    const { id } = piece
    // Deleted as the library deletes one: out of its folder and the favourites, with its takes.
    void navigate({ to: '/songs', replace: true }).then(() =>
      deleteOwnSongs(
        { library, pieces: store, takes },
        libraryCatalog({ ownSongs: store.getState().songs }),
        [id],
      ),
    )
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        finalFocus={() => returnTo.current?.querySelector<HTMLElement>('button') ?? true}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${words}.title`, { title: piece.title })}</AlertDialogTitle>
          <AlertDialogDescription>{t(`${words}.says`)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t(`${words}.cancel`)}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={act}>
            {t(`${words}.confirm`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
