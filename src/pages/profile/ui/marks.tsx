import { Award } from 'lucide-react'
import type { BadgeId, MilestoneId, Tier } from '@/entities/progress'
import { BADGE_ICON, MILESTONE_ICON } from '../model/icons'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from '@/shared/ui'

/** Each tier's paint: bronze the sand, silver the sky, gold the yellow, platinum the lilac. */
const TIER_PAINT: Readonly<Record<Tier, Paint>> = {
  bronze: 'sand',
  silver: 'sky',
  gold: 'yellow',
  platinum: 'lilac',
}

/** The boards' medals: 44 in a list's row, 36 in a badge's tiers, 88 at the head of its page. */
const SIZE = {
  row: 'size-11 [&_svg]:size-5.5',
  tier: 'size-9 [&_svg]:size-4',
  hero: 'size-22 [&_svg]:size-10',
} as const

/** A milestone's tile is a rounded square (P9_MILE): 12 in a row, 24 at the head of its page. */
const TILE = { row: 'rounded-xl', tier: 'rounded-lg', hero: 'rounded-[1.5rem]' } as const

/** A badge's picture: its icon on its tier's paint, or greyed before its first (its meter says how far). */
export function BadgeMark({
  id,
  tier,
  size = 'row',
}: {
  id: BadgeId
  tier: Tier | null
  size?: keyof typeof SIZE
}) {
  const Icon = BADGE_ICON[id]
  return (
    <span
      aria-hidden
      data-tier={tier ?? undefined}
      className={cn(
        'grid shrink-0 place-items-center rounded-pill',
        SIZE[size],
        tier
          ? cn(PAINT[TIER_PAINT[tier]].fill, PAINT[TIER_PAINT[tier]].ink)
          : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon />
    </span>
  )
}

/** A milestone's picture: its icon on the grass once earned, greyed before. */
export function MilestoneMark({
  id,
  earned,
  size = 'row',
}: {
  id: MilestoneId
  earned: boolean
  size?: keyof typeof SIZE
}) {
  const Icon = earned ? MILESTONE_ICON[id] : Award
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center',
        SIZE[size],
        TILE[size],
        earned ? cn(PAINT.grass.fill, PAINT.grass.ink) : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon />
    </span>
  )
}
