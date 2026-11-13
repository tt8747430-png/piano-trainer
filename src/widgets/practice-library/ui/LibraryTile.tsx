import { cn } from '@/shared/lib'
import { PAINT, TileMark } from '@/shared/ui'
import type { LibraryPicture } from '../model/library-view'

/**
 * A practice row's picture at its head (canvas, the Practice libraries): its icon on its paint, as a
 * Songs folder's; or its music's first words (a progression's "I V") in its paint's ink on its wash.
 */
export function LibraryTile({ picture }: { picture: LibraryPicture }) {
  if ('icon' in picture) return <TileMark large icon={picture.icon} paint={picture.paint} />
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
