import { useTranslation } from 'react-i18next'
import { FOLDER_PICTURE_ICONS, useLibrary, useLibraryStoreApi } from '@/entities/library'
import { pieceKey, type Piece } from '@/entities/piece'
import { FavouriteButton, LookFields, setSongLook } from '@/features/manage-library'
import { cn } from '@/shared/lib'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { PAINT } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Picker } from './PropertyPicker'

/**
 * A song's cover (R30 S4, Apple Music's): its picture on its paint where the learner gave it one,
 * else its key on the soft yellow. What a head that names the song draws (its Settings).
 */
export function SongCover({ piece, className }: { piece: Piece; className?: string }) {
  const { t } = useTranslation('piece')
  const look = useLibrary((state) => state.songLooks[piece.id])
  const Icon = look ? FOLDER_PICTURE_ICONS[look.picture] : null
  const paint = PAINT[look?.paint ?? 'yellow']
  return (
    <div
      role="img"
      aria-label={t('cover')}
      className={cn(
        'grid aspect-square place-items-center rounded-card font-display font-semibold',
        paint.fill,
        paint.ink,
        className,
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
  )
}

/**
 * The song page's cover (R32-C): a tap on it changes its picture and paint (a popover on a laptop, a
 * sheet on a phone), each kept as it is chosen, Remove cover putting its key back; its Favourite on
 * its corner. A study is in no library: neither.
 */
export function SongCoverPicker({ piece, className }: { piece: Piece; className?: string }) {
  const { t } = useTranslation('piece')
  const store = useLibraryStoreApi()
  const saved = useLibrary((state) => state.songLooks[piece.id])
  if (piece.kind === 'study') return <SongCover piece={piece} className={className} />
  return (
    <div className={cn('relative w-fit shrink-0', className)}>
      <Picker
        title={t('cover')}
        trigger={(props) => (
          <button
            type="button"
            {...props}
            aria-label={t('changeCover')}
            title={t('changeCover')}
            className="block w-full rounded-card transition-transform duration-200 ease-out active:scale-[0.98] focus-visible:outline-offset-2"
          >
            <SongCover piece={piece} />
          </button>
        )}
      >
        {() => (
          <div className="flex flex-col items-start gap-4">
            <LookFields
              look={saved ?? { picture: 'music', paint: 'yellow' }}
              onChange={(next) => setSongLook(store, piece.id, next)}
            />
            {saved ? (
              <Button
                variant="link"
                className="h-auto min-h-11 px-0 text-destructive"
                onClick={() => setSongLook(store, piece.id, null)}
              >
                {t('removeCover')}
              </Button>
            ) : null}
          </div>
        )}
      </Picker>
      <FavouriteButton
        piece={piece.id}
        className="absolute -right-3 -bottom-3 bg-card shadow-sm hover:bg-card"
      />
    </div>
  )
}
