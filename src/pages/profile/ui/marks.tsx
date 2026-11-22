import { Check, Lock, Star } from 'lucide-react'
import type { Tier } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

/** Each tier's metal (the board's MEDC); before the first, the plain medal. */
const MEDAL: Readonly<Record<Tier, string>> = {
  bronze: 'bg-medal-bronze',
  silver: 'bg-medal-silver',
  gold: 'bg-medal-gold',
  platinum: 'bg-medal-platinum',
}

/**
 * The boards' medals (MEDAL, MEDSM, MEDBIG): a white star on its tier's metal in a 45% white ring, 44
 * in a list's row, 36 in a badge's tiers, 88 at the head of its page.
 */
const SIZE = {
  row: 'size-11 shadow-[inset_0_0_0_3px_rgb(255_255_255/0.45)] [&_svg]:size-5',
  tier: 'size-9 shadow-[inset_0_0_0_3px_rgb(255_255_255/0.45)] [&_svg]:size-4',
  hero: 'size-22 shadow-[inset_0_0_0_5px_rgb(255_255_255/0.45)] [&_svg]:size-10',
} as const

/** A milestone's tile is a rounded square (AROW, P9_MILE): 12 in a row, 24 at the head of its page. */
const TILE = {
  row: 'size-11 rounded-control [&_svg]:size-5',
  hero: 'size-22 rounded-sheet [&_svg]:size-10',
} as const

/**
 * A badge's medal: the star on its tier's metal, or the plain medal before its first (its line says
 * how far); `locked` dims a tier not reached yet, as the board's tiers list.
 */
export function BadgeMark({
  tier,
  locked = false,
  size = 'row',
}: {
  tier: Tier | null
  locked?: boolean
  size?: keyof typeof SIZE
}) {
  return (
    <span
      aria-hidden
      data-tier={tier ?? undefined}
      className={cn(
        'grid shrink-0 place-items-center rounded-pill text-white',
        SIZE[size],
        tier ? MEDAL[tier] : 'bg-medal-none',
        locked && 'opacity-45',
      )}
    >
      <Star className="fill-current stroke-0" />
    </span>
  )
}

/** A milestone's picture: a check on the grass once earned, a lock in soft ink before. */
export function MilestoneMark({
  earned,
  size = 'row',
}: {
  earned: boolean
  size?: keyof typeof TILE
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center',
        TILE[size],
        earned
          ? cn(PAINT.grass.fill, PAINT.grass.ink)
          : cn(
              'bg-muted text-muted-foreground',
              size === 'hero' && 'ring-2 ring-border ring-inset',
            ),
      )}
    >
      {earned ? <Check strokeWidth={2.6} /> : <Lock />}
    </span>
  )
}
