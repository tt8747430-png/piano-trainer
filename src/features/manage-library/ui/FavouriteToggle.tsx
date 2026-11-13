import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectIsFavourite, useLibrary, useLibraryStoreApi } from '@/entities/library'
import type { PieceId } from '@/entities/piece'
import { ROW_CONTROL } from '@/shared/ui'
import { toggleFavourite } from '../toggle-favourite'

/**
 * The ♡ at a song's row's end (canvas 133): an outline, filled in ink while the song is a favourite,
 * one tap to change it; named by what the tap does.
 */
export function FavouriteToggle({ piece }: { piece: PieceId }) {
  const { t } = useTranslation('common')
  const store = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece))
  const label = t(favourite ? 'library.unfavourite' : 'library.favourite')
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={favourite}
      onClick={() => toggleFavourite(store, piece)}
      className={`${ROW_CONTROL} aria-pressed:text-foreground aria-pressed:[&_svg]:fill-current`}
    >
      <Heart aria-hidden />
    </button>
  )
}
