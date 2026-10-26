import { Heart, HeartOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectIsFavourite, useLibrary, useLibraryStoreApi } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import type { MenuAction } from '@/shared/ui'
import { toggleFavourite } from '../toggle-favourite'

/** A song's favourite as a menu's action (the Player's More): named by what it does now. */
export function useFavouriteAction(piece: PieceId): MenuAction {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece))
  return {
    key: 'favourite',
    label: t(favourite ? 'library.unfavourite' : 'library.favourite'),
    icon: favourite ? HeartOff : Heart,
    onSelect: () => toggleFavourite(store, piece),
  }
}
