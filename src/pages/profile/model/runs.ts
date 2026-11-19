import { useTranslation } from 'react-i18next'
import { dateOfDay, localDay, type PracticeRun } from '@/entities/progress'
import { useRunName } from '@/features/trainer'
import { useLocale } from '@/shared/i18n'

/** A run as Practice history shows it: its name, its time and count, its accuracy. */
export interface RunLine {
  readonly id: string
  readonly name: string
  readonly detail: string
  readonly accuracy: string
}

/** Each run as its row reads (canvas 160): a run played by its tempo; a quiz of a trainer the app no longer has left out. */
export function useRunLines(): (runs: readonly PracticeRun[]) => readonly RunLine[] {
  const { t } = useTranslation(['account', 'music'])
  const locale = useLocale()
  const runName = useRunName()
  const clock = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
  return (runs) =>
    runs.flatMap((run) => {
      const time = clock.format(new Date(run.at))
      const accuracy = t('profile.history.accuracy', { percent: run.accuracy })
      // A run played reads its tempo ("72 BPM · 14:20"), a quiz how many it answered.
      if (run.kind === 'played')
        return [
          {
            id: run.id,
            name: run.title,
            detail: `${t('music:bpm', { tempo: run.tempo })} · ${time}`,
            accuracy,
          },
        ]
      const name = runName(run.key)
      if (name === null) return []
      return [
        {
          id: run.id,
          name,
          detail: t('profile.history.row', { time, count: run.answered }),
          accuracy,
        },
      ]
    })
}

/** A day's name in the history: Today, Yesterday, then its weekday and date ("Monday, 9 November"). */
export function useHistoryDay(today: string): (day: string) => string {
  const { t } = useTranslation('account')
  const locale = useLocale()
  const format = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const yesterday = localDay(dateOfDay(today, -1))
  return (day) =>
    day === today
      ? t('profile.history.today')
      : day === yesterday
        ? t('profile.history.yesterday')
        : format.format(dateOfDay(day))
}

/** The runs by the day each was played on, newest first. */
export function byDay(
  runs: readonly PracticeRun[],
): readonly { readonly day: string; readonly runs: readonly PracticeRun[] }[] {
  const days = new Map<string, PracticeRun[]>()
  for (const run of runs) {
    const day = localDay(new Date(run.at))
    days.set(day, [...(days.get(day) ?? []), run])
  }
  return [...days].map(([day, kept]) => ({ day, runs: kept }))
}
