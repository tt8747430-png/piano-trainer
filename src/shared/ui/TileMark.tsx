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
}: {
  paint: Paint
  /** At a library row's head (a folder, a song with its own picture): 44px, as a song's small cover. */
  large?: boolean
} & ({ icon: LucideIcon; numeral?: undefined } | { icon?: undefined; numeral: number })) {
  return (
    <span
      data-slot="row-tile"
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center font-semibold text-white tabular-nums',
        large ? 'size-11 rounded-control text-lg' : 'size-7.5 rounded-tile text-base',
        PAINT[paint].tile,
      )}
    >
      {Icon ? <Icon className={large ? 'size-5.5' : 'size-4.5'} /> : numeral}
    </span>
  )
}
