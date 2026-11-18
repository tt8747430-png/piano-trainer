import type { ReactNode } from 'react'
import { DEFAULT_CARD_LOOK, type CardLook } from '@/entities/library'
import { cn } from '@/shared/lib'
import { cardLookProps } from './card-look'

/**
 * One card holding the rows, a hairline between them from the title's edge (84: 12, the 56 tile, 16),
 * as an inset grouped list draws it (the boards' SONGLIST, 2026-11-18: "a song list on a phone is one
 * list, not a card per song").
 */
const INSET_LIST =
  "card flex flex-col overflow-hidden [&>li+li]:relative [&>li+li]:before:absolute [&>li+li]:before:top-0 [&>li+li]:before:right-0 [&>li+li]:before:left-21 [&>li+li]:before:h-px [&>li+li]:before:bg-border [&>li+li]:before:content-['']"

/**
 * A place's rows in its look (R72, R29 B9): in Cards each song its own card, two across
 * on a laptop; in a List, the default, one card holding its rows (`INSET_LIST`); in Grid, as many across as fit. The place's style (its corners,
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
      <ul className={cn(INSET_LIST, className)}>{children}</ul>
    </div>
  )
}
