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
}: { paint: Paint } & (
  { icon: LucideIcon; numeral?: undefined } | { icon?: undefined; numeral: number }
)) {
  return (
    <span
      data-slot="row-tile"
      aria-hidden
      className={cn(
        'grid size-7.5 shrink-0 place-items-center rounded-tile text-base font-semibold text-white tabular-nums',
        PAINT[paint].tile,
      )}
    >
      {Icon ? <Icon className="size-4.5" /> : numeral}
    </span>
  )
}
