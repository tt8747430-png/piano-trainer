import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** The narrowest a card of each kind may be drawn: a chord's, a row's, a tile's (`theme.css`). */
type CardMin = 'chord' | 'row' | 'tile'

const COLUMNS: Readonly<Record<CardMin, string>> = {
  chord: 'grid-cols-[repeat(auto-fill,minmax(var(--card-min-chord),1fr))]',
  row: 'grid-cols-[repeat(auto-fill,minmax(var(--card-min-row),1fr))]',
  tile: 'grid-cols-[repeat(auto-fill,minmax(var(--card-min-tile),1fr))]',
}

/**
 * A list of cards in a grid (P11): as many columns as fit a card at its least, so the browser drops a
 * column rather than squeeze one card over its neighbour. Each child is a list item.
 */
export function CardGrid({
  min,
  label,
  className,
  children,
}: {
  min: CardMin
  /** What the list holds, for a screen reader, where no heading names it. */
  label?: string | undefined
  className?: string
  children: ReactNode
}) {
  return (
    <ul
      aria-label={label}
      data-card-grid={min}
      className={cn('grid gap-2', COLUMNS[min], className)}
    >
      {children}
    </ul>
  )
}
