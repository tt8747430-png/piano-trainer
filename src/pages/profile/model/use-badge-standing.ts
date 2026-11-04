import { useTranslation } from 'react-i18next'
import type { Badge } from '@/entities/progress'

/** A badge's standing in words: its tier and how many of four, every tier, or how far to its first. */
export function useBadgeStanding(): (badge: Badge) => string {
  const { t } = useTranslation('account')
  return ({ tier, earned, have, next }) =>
    tier
      ? next === null
        ? t('profile.badges.all')
        : t('profile.badges.tier', { tier: t(`profile.badges.tiers.${tier}`), earned })
      : t('profile.badges.locked', { have, goal: next ?? 0 })
}
