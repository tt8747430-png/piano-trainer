import type { ReactNode } from 'react'
import { DEFAULT_CARD_LOOK, type CardLook } from '@/entities/library'
import { cn } from '@/shared/lib'
import { GROUPED_LIST } from '@/shared/ui'
import { cardLookProps } from './card-look'

/**
 * A place's rows in its look (R72, R29 B9): in Cards, the default, each song its own card, two across
 * on a laptop; in a List, one card with a hairline between its rows; in Grid, as many across as fit. The place's style (its corners,
 * border, shadow, surface) is the card's or each row's.
 */
export function LibraryRows({
  look,
  className,
  children,
}: {
  /** The place's look; none keeps the default. */
  look: CardLook | undefined
  className?: string
  children: ReactNode
}) {
  const styled = cardLookProps(look)
  const { layout } = (look ?? DEFAULT_CARD_LOOK).style
  // Cards (the R72 board's list): each song its own card, 12 apart, two across on a laptop.
  if (layout !== 'list')
    return (
      <ul
        className={cn(
          'grid gap-3',
          layout === 'grid' ? 'grid-cards auto-rows-fr' : 'lg:grid-cols-2',
          className,
        )}
        {...styled}
      >
        {children}
      </ul>
    )
  // The style's card is the list's own, read from the look round it.
  return (
    <div {...styled}>
      <ul className={cn(GROUPED_LIST, className)}>{children}</ul>
    </div>
  )
}
