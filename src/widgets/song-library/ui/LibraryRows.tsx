import type { ReactNode } from 'react'
import { DEFAULT_CARD_LOOK, type CardLook } from '@/entities/library'
import { cn } from '@/shared/lib'
import { GROUPED_LIST } from '@/shared/ui'
import { cardLookProps } from './card-look'

/**
 * A place's rows in its look (canvas 133, R29 B9): in a List, one card with a hairline between its
 * rows, a grouped list; in Cards and Grid, each row its own card. The place's style (its corners,
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
  if ((look ?? DEFAULT_CARD_LOOK).style.layout !== 'list')
    return (
      <ul className={cn('grid-cards auto-rows-fr gap-2', className)} {...styled}>
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
