import { useTranslation } from 'react-i18next'
import { dateOfDay } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'

/** From this many hours a time is told in hours alone ("12 h"): its minutes say little, and a tile holds it. */
const WHOLE_HOURS = 10

/**
 * Time practised as the Profile says it: "2 h 15 min", "45 min" under an hour, "12 h" from ten; a
 * tile, a third of a phone, tells it in hours alone from the first (`wholeFrom` 1: "2 h").
 */
export function usePracticeTime(): (seconds: number, wholeFrom?: number) => string {
  const { t } = useTranslation('account')
  return (seconds, wholeFrom = WHOLE_HOURS) => {
    const minutes = Math.floor(seconds / 60)
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h >= wholeFrom) return t('profile.time.h', { h })
    return h > 0 ? t('profile.time.hm', { h, m }) : t('profile.time.m', { m })
  }
}

/** A day kept (`2026-11-03`) as the learner's language writes a date: "3 Nov 2026". */
export function useDayName(): (day: string) => string {
  const locale = useLocale()
  const format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  return (day) => format.format(dateOfDay(day))
}
