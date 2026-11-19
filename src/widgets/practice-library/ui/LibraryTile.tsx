import { cn } from '@/shared/lib'
import { chordRole } from '@/shared/lib/music'
import { PAINT, ROLE_PAINT, TileMark } from '@/shared/ui'
import type { LibraryPicture } from '../model/library-view'

/**
 * A practice row's picture at its head (canvas, the Practice libraries): its icon on its paint, as a
 * Songs folder's; its music's first words in its paint's ink on its wash; or a progression's chords as
 * columns on the card's paper, each in its role's paint (tonic, predominant, dominant), 28 tall, 2 apart.
 */
export function LibraryTile({ picture }: { picture: LibraryPicture }) {
  if ('icon' in picture) return <TileMark large icon={picture.icon} paint={picture.paint} />
  if ('chords' in picture)
    return (
      <span
        data-slot="row-tile"
        aria-hidden
        className="flex size-11 shrink-0 gap-0.5 overflow-hidden rounded-[10px] bg-card px-1 py-2 ring-1 ring-border"
      >
        {picture.chords.map((numeral, i) => (
          <span
            key={i}
            className={cn(
              'min-w-0 flex-1 rounded-[3px] ring-1 ring-foreground/15 ring-inset',
              PAINT[ROLE_PAINT[chordRole(numeral, picture.minor).role]].fill,
            )}
          />
        ))}
      </span>
    )
  return (
    <span
      data-slot="row-tile"
      aria-hidden
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-control px-1 text-center text-sm leading-none font-semibold whitespace-nowrap',
        PAINT[picture.paint].fill,
        PAINT[picture.paint].ink,
      )}
    >
      {picture.text}
    </span>
  )
}
