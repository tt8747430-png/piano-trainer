import { Heart, ListOrdered } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  piecesIn,
  selectFavourites,
  selectSetlists,
  useLibrary,
  useLibraryStoreApi,
} from '@/entities/library'
import { useRepertoire, type PieceId } from '@/entities/piece'
import { RowCheck, Sheet, SheetContent } from '@/shared/ui'
import { addToSetlist } from '../add-to-setlist'
import { removeFromSetlist } from '../remove-from-setlist'
import { toggleFavourite } from '../toggle-favourite'
import { NewSetlistRow } from './NewSetlistRow'

/**
 * Add to setlist (Chordify's Save to setlists), a sheet over its page: Favourites first, then each
 * setlist, each a check that says whether the song is in it and a tap that puts it in or takes it
 * out, each counting its songs; then New setlist, named in place, the song put in it.
 */
export function AddToSetlistSheet({
  piece,
  open,
  onOpenChange,
}: {
  piece: PieceId
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const favourites = useLibrary(selectFavourites)
  const setlists = useLibrary(selectSetlists)
  const repertoire = useRepertoire()
  const count = (ids: readonly PieceId[]) =>
    t('library.songCount', { count: piecesIn(ids, repertoire).length })
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('library.addToSetlist')}>
        <ul aria-label={t('library.addToSetlist')} className="flex flex-col gap-1">
          <li>
            <RowCheck
              title={t('favourites')}
              detail={count(favourites)}
              icon={Heart}
              paint="yellow"
              checked={favourites.includes(piece)}
              onCheckedChange={() => toggleFavourite(store, piece)}
            />
          </li>
          {setlists.map((setlist) => (
            <li key={setlist.id}>
              <RowCheck
                title={setlist.name}
                detail={count(setlist.pieces)}
                icon={ListOrdered}
                paint="yellow"
                checked={setlist.pieces.includes(piece)}
                onCheckedChange={(on) =>
                  (on ? addToSetlist : removeFromSetlist)(store, setlist.id, piece)
                }
              />
            </li>
          ))}
          <li>
            <NewSetlistRow onMade={(id) => addToSetlist(store, id, piece)} />
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  )
}
