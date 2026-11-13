import { useTranslation } from 'react-i18next'
import { selectIsFavourite, useLibrary, useLibraryStoreApi } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { HeartToggle } from '@/shared/ui'
import { toggleFavourite } from '../toggle-favourite'

/** A song's ♡ at its row's end (canvas 133): the library's `HeartToggle` on its favourite. */
export function FavouriteToggle({ piece }: { piece: PieceId }) {
  const { t } = useTranslation('common')
  const store = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece))
  return (
    <HeartToggle
      pressed={favourite}
      label={t(favourite ? 'library.unfavourite' : 'library.favourite')}
      onToggle={() => toggleFavourite(store, piece)}
    />
  )
}
