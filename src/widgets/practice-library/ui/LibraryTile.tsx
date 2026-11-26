import { cn } from '@/shared/lib'
import { chordRole } from '@/shared/lib/music'
import { PAINT, ROLE_PAINT, TileMark } from '@/shared/ui'
import type { LibraryPicture } from '../model/library-view'

/**
 * A practice row's picture at its head (canvas, the Practice libraries): its icon on its paint, as a
 * Songs folder's; its mark (its music's first words) in ink on its paint's wash; or a progression's chords as
 * columns on the card's paper, each in its role's paint (tonic, predominant, dominant), 28 tall, 2 apart.
 */
export function LibraryTile({
  picture,
  small = false,
}: {
  picture: LibraryPicture
  /** In a laptop's table: 40 with a 9 corner, as the board's rows (r41_lib's table). */
  small?: boolean
}) {
  const size = small ? 'size-10 rounded-thumb' : 'size-11'
  if ('icon' in picture)
    return (
      <TileMark
        large
        icon={picture.icon}
        paint={picture.paint}
        className={small ? size : undefined}
      />
    )
  if ('drawn' in picture)
    return small ? (
      // a drawn picture (a pattern's roll) at the table's 40 too, its 44 viewBox scaled
      <span className="contents [&>[data-slot=row-tile]]:size-10 [&>[data-slot=row-tile]]:rounded-thumb">
        {picture.drawn}
      </span>
    ) : (
      picture.drawn
    )
  if ('chords' in picture)
    return (
      <span
        data-slot="row-tile"
        aria-hidden
        className={cn(
          'flex shrink-0 gap-0.5 overflow-hidden rounded-thumb bg-card px-1 py-2 ring-1 ring-border',
          size,
        )}
      >
        {picture.chords.map((numeral, i) => (
          <span
            key={i}
            className={cn(
              'min-w-0 flex-1 rounded-mark picture-edge',
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
        // its mark in ink at 700 on its paint's wash (the boards' rows: 14, 13 on a laptop's 40)
        'grid shrink-0 place-items-center rounded-control px-1 text-center leading-none font-bold whitespace-nowrap text-foreground',
        small ? 'text-footnote' : 'text-sm',
        size,
        PAINT[picture.paint].fill,
      )}
    >
      {picture.text}
    </span>
  )
}
