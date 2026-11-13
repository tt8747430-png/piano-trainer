import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/**
 * A row's tile, its paint solid (canvas 128, iOS Settings' squares): its icon, or its number in a
 * sequence (a lesson in its module, a song in its book), in white. A picture: hidden from a screen
 * reader.
 */
export function TileMark({
  icon: Icon,
  numeral,
  paint,
  large = false,
  className,
}: {
  /** A larger head's own size (a folder's page, canvas 133), over `large`'s. */
  className?: string
  paint: Paint
  /** At a library row's head (a folder, a practice place, a song with its own picture): 44px, a wash, as a song's small cover. */
  large?: boolean
} & ({ icon: LucideIcon; numeral?: undefined } | { icon?: undefined; numeral: number })) {
  return (
    <span
      data-slot="row-tile"
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center font-semibold tabular-nums',
        // At a library row's head, its paint's wash under its ink (canvas 133); a settings row's solid.
        large
          ? cn('size-11 rounded-control text-lg', PAINT[paint].fill, PAINT[paint].ink)
          : cn('size-7.5 rounded-tile text-base text-white', PAINT[paint].tile),
        className,
      )}
    >
      {Icon ? <Icon className={large ? 'size-6' : 'size-4.5'} /> : numeral}
    </span>
  )
}
