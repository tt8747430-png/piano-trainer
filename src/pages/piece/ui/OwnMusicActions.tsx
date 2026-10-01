import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePiecesStoreApi, type OwnSongId, type PieceId } from '@/entities/piece'
import { deleteSong, resetVersion } from '@/features/edit-piece'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'

/** The learner's music's way back: their version reset to the book's, or their song deleted; each asks first. */
export function OwnMusicActions({
  piece,
}: {
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
  const navigate = useNavigate()
  const [asking, setAsking] = useState(false)
  const words = piece.kind === 'version' ? 'resetting' : 'deleting'
  const act = () => {
    if (piece.kind === 'version') {
      resetVersion(store, piece.id)
      return
    }
    // Leave the page first: it has nothing to show once the song is gone.
    const { id } = piece
    void navigate({ to: '/songs', replace: true }).then(() => deleteSong(store, id))
  }
  return (
    <AlertDialog open={asking} onOpenChange={setAsking}>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        {t(piece.kind === 'version' ? 'reset' : 'delete')}
      </AlertDialogTrigger>
      <AlertDialogContent>
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
