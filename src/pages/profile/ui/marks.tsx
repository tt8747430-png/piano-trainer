import { Award, Lock } from 'lucide-react'
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

const SIZE = { row: 'size-12 [&_svg]:size-6', hero: 'size-24 [&_svg]:size-11' } as const

/** A badge's picture: its icon on its tier's paint, or greyed and locked before its first. */
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
      {tier ? <Icon /> : <Lock />}
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
        'grid shrink-0 place-items-center rounded-pill',
        SIZE[size],
        earned ? cn(PAINT.grass.fill, PAINT.grass.ink) : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon />
    </span>
  )
}
