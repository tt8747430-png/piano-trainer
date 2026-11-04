import { useTranslation } from 'react-i18next'
import { dateOfDay } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'

/** Time practised as the Profile says it: "2 h 15 min", or "45 min" under an hour. */
export function usePracticeTime(): (seconds: number) => string {
  const { t } = useTranslation('account')
  return (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? t('profile.time.hm', { h, m }) : t('profile.time.m', { m })
  }
}

/** A day kept (`2026-11-03`) as the learner's language writes a date: "3 Nov 2026". */
export function useDayName(): (day: string) => string {
  const locale = useLocale()
  const format = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  return (day) => format.format(dateOfDay(day))
}
