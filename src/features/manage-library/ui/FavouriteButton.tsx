import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectIsFavourite, useLibrary, useLibraryStoreApi } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { RoundButton } from '@/shared/ui'
import { toggleFavourite } from '../toggle-favourite'

/**
 * The ♡ in a song page's bar (Chordify's): pressed while the song is a favourite, a sand fill and a
 * filled heart, as a pattern's star is; named by what a tap does.
 */
export function FavouriteButton({ piece }: { piece: PieceId }) {
  const { t } = useTranslation('songs')
  const store = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece))
  return (
    <RoundButton
      label={t(favourite ? 'library.unfavourite' : 'library.favourite')}
      icon={Heart}
      aria-pressed={favourite}
      onClick={() => toggleFavourite(store, piece)}
      className="aria-pressed:bg-muted aria-pressed:[&_svg]:fill-current"
    />
  )
}
