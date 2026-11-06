import { useTranslation } from 'react-i18next'
import type { Badge } from '@/entities/progress'

/**
 * A badge's standing in words: its tier and how many of four, every tier, or its first tier's goal
 * ("3 days in a row"), whose count its meter says.
 */
export function useBadgeStanding(): (badge: Badge) => string {
  const { t } = useTranslation('account')
  return ({ id, tier, earned, next }) =>
    tier
      ? next === null
        ? t('profile.badges.all')
        : t('profile.badges.tier', { tier: t(`profile.badges.tiers.${tier}`), earned })
      : t(`profile.badges.goals.${id}`, { count: next ?? 0 })
}
