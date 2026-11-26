import { useTranslation } from 'react-i18next'
import { TIERS, type Badge } from '@/entities/progress'

/**
 * A badge's standing in words, as the board's line under it: its tier and how near the next is in
 * the badge's own unit ("Silver · 2 more days to Gold"), every tier earned, or, not started, how
 * near its first tier is ("3 more days to Bronze").
 */
export function useBadgeStanding(): (badge: Badge) => string {
  const { t } = useTranslation('account')
  return ({ id, tier, earned, have, next }) => {
    const named = tier ? t(`profile.badges.tiers.${tier}`) : null
    if (next === null) return t('profile.badges.all', { tier: named ?? '' })
    const nextTier = TIERS[earned] ?? 'platinum'
    const toNext = t(`profile.badges.toNext.${id}`, {
      count: next - have,
      tier: t(`profile.badges.tiers.${nextTier}`),
    })
    return named ? t('profile.badges.tier', { tier: named, next: toNext }) : toNext
  }
}
