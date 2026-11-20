import { useTranslation } from 'react-i18next'
import { useLibrary, useLibraryStoreApi } from '@/entities/library'
import type { Piece } from '@/entities/piece'
import { LookFields, setSongLook } from '@/features/manage-library'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { PieceCover, PieceMark } from '@/widgets/piece-cover'
import { Picker } from './PropertyPicker'

/**
 * A song's cover at the head of its Settings (R32-C), the library's tile at 64: a tap on it changes its picture and paint (a popover on a laptop, a
 * sheet on a phone), each kept as it is chosen, Remove cover putting its opening bars back (R34). Its
 * Favourite is the page's bar's, never over the cover (R34, D5). A study is in no library: no picker.
 */
export function SongCoverPicker({ piece, className }: { piece: Piece; className?: string }) {
  const { t } = useTranslation('piece')
  const store = useLibraryStoreApi()
  const saved = useLibrary((state) => state.songLooks[piece.id])
  if (piece.kind === 'study') return <PieceCover entry={piece} className={className} />
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
            className="block rounded-[10px] transition-transform duration-200 ease-out active:scale-[0.98] focus-visible:outline-offset-2 [&_[data-slot=row-tile]]:size-16 [&_[data-slot=row-tile]]:rounded-[10px]"
          >
            {/* The library's own tile, as every row wears it (THINGHEAD's COV, 64 with 10 corners). */}
            <PieceMark entry={piece} />
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
    </div>
  )
}
