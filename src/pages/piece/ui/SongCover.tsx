import { useTranslation } from 'react-i18next'
import { FOLDER_PICTURE_ICONS, useLibrary } from '@/entities/library'
import { pieceKey, type Piece } from '@/entities/piece'
import { FavouriteButton } from '@/features/manage-library'
import { cn } from '@/shared/lib'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { PAINT } from '@/shared/ui'

/**
 * A song's cover (R30 S4, Apple Music's): its picture on its paint where the learner gave it one
 * (its Edit), else its key on the soft yellow; its Favourite on the cover's corner. A study is in no
 * library: no favourite.
 */
export function SongCover({
  piece,
  className,
  favourite = true,
}: {
  piece: Piece
  className?: string
  /** Its ♡ on its corner: the song page's; a head that names the song (its Settings) has none. */
  favourite?: boolean
}) {
  const { t } = useTranslation('piece')
  const look = useLibrary((state) => state.songLooks[piece.id])
  const Icon = look ? FOLDER_PICTURE_ICONS[look.picture] : null
  const paint = PAINT[look?.paint ?? 'yellow']
  return (
    <div className={cn('relative w-fit', className)}>
      <div
        role="img"
        aria-label={t('cover')}
        className={cn(
          'grid aspect-square place-items-center rounded-card font-display font-semibold',
          paint.fill,
          paint.ink,
        )}
      >
        {Icon ? (
          <Icon aria-hidden className="size-1/3" />
        ) : (
          <span aria-hidden className="text-[length:inherit]">
            {printedSymbol(keySymbol(pieceKey(piece)))}
          </span>
        )}
      </div>
      {piece.kind === 'study' || !favourite ? null : (
        <FavouriteButton
          piece={piece.id}
          className="absolute -right-3 -bottom-3 bg-card shadow-sm hover:bg-card"
        />
      )}
    </div>
  )
}
