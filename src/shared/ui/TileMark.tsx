import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/**
 * A row's tile on its paint's wash: its icon, or its number in a sequence (a lesson in its module, a
 * song in its book), in the paint's deep shade. A picture: hidden from a screen reader.
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
        'grid size-12 shrink-0 place-items-center rounded-2xl font-display text-xl font-semibold tabular-nums',
        PAINT[paint].fill,
        PAINT[paint].ink,
      )}
    >
      {Icon ? <Icon className="size-5" /> : numeral}
    </span>
  )
}
