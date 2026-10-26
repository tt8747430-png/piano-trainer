import { GripVertical, X } from 'lucide-react'
import type { Piece } from '@/entities/piece'
import { cn } from '@/shared/lib'
import { RowFace } from '@/shared/ui'
import { useEntryFace } from '@/widgets/piece-list'
import { SONG_BODY, SONG_CARD, SONG_CONTROL } from './song-row-class'

/**
 * The song in the hand, over the list (the drag's overlay): the row it came from, its card, its face
 * and its controls drawn as they are, lifted by a shade, never scaled (Mindscape's CODE_STYLE §10).
 * A picture of the row, which a screen reader hears of from the drag's announcements.
 */
export function SetlistSongInHand({ piece, place }: { piece: Piece; place: number }) {
  const { kind, ...face } = useEntryFace(piece)
  return (
    <div aria-hidden className={cn(SONG_CARD, 'cursor-grabbing elevation-3 hover:bg-card')}>
      <span className={SONG_CONTROL}>
        <GripVertical />
      </span>
      <div className={SONG_BODY}>
        <RowFace {...face} numeral={place} paint={kind.paint} />
      </div>
      <span className={SONG_CONTROL}>
        <X />
      </span>
    </div>
  )
}
