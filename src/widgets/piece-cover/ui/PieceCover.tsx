import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PICTURE_ICONS, useLibrary } from '@/entities/library'
import { isPiece, pieceKey, type Entry, type Piece } from '@/entities/piece'
import { cn, useElementSize } from '@/shared/lib'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { LazyScoreView, PAINT } from '@/shared/ui'
import { incipitScore } from '../model/incipit'

/** The engraving's scale per pixel of the cover's width: a 112 px cover draws at 0.47. */
const SCALE_PER_PX = 1 / 200

/**
 * A song's cover, wherever one is drawn (R34, Piano Forte's covers): the picture the learner chose on
 * its paint; else its opening bars engraved on the soft yellow, so a song is known by its music; a
 * song not yet written (a listing) its key letter. One implementation for the song page, its
 * Settings and Continue.
 */
export function PieceCover({
  entry,
  className,
  decorative = false,
}: {
  entry: Entry
  className?: string
  /** Inside a link or button that names the song: the cover adds nothing for a screen reader. */
  decorative?: boolean
}) {
  const { t } = useTranslation('piece')
  const look = useLibrary((state) => state.songLooks[entry.id])
  const Icon = look ? FOLDER_PICTURE_ICONS[look.picture] : null
  const paint = PAINT[look?.paint ?? 'yellow']
  return (
    <div
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': t('cover') })}
      className={cn(
        'grid aspect-square place-items-center overflow-hidden rounded-card font-display font-semibold',
        paint.fill,
        paint.ink,
        className,
      )}
    >
      {Icon ? (
        <Icon aria-hidden className="size-1/3" />
      ) : isPiece(entry) ? (
        <Incipit piece={entry} />
      ) : (
        <span aria-hidden className="text-[length:inherit]">
          {printedSymbol(keySymbol(pieceKey(entry)))}
        </span>
      )}
    </div>
  )
}

/** The song's opening bars, engraved to the cover's width once it is in sight. */
function Incipit({ piece }: { piece: Piece }) {
  const box = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(box)
  const score = useMemo(() => incipitScore(piece), [piece])
  // Inset from the cover's edge, as a printed incipit sits on its card.
  const inner = Math.round(width * 0.84)
  return (
    <div ref={box} aria-hidden className="grid w-full place-items-center">
      {inner > 0 ? <LazyScoreView score={score} scale={inner * SCALE_PER_PX} fill={inner} /> : null}
    </div>
  )
}
