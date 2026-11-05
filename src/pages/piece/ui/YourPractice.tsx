import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { selectPractised, useProgress } from '@/entities/progress'
import { useTakes } from '@/entities/take'
import { useLocale } from '@/shared/i18n'
import { SettingsGroup } from '@/shared/ui'

/**
 * What the app has kept of the learner's practice of a song (R30 S4): the day it was played last, and
 * the takes recorded of it. Nothing before the first time it is played.
 */
export function YourPractice({ id }: { id: PieceId }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const at = useProgress((state) => selectPractised(state)[id])
  const takes = useTakes((state) => state.takes.filter((take) => take.pieceId === id).length)
  if (!at && takes === 0) return null
  const day = at
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(new Date(at))
    : null
  return (
    <SettingsGroup title={t('practice.title')}>
      <dl className="flex flex-col">
        {day ? (
          <div className="flex min-h-12 items-center justify-between gap-4 px-4">
            <dt className="font-medium">{t('practice.last')}</dt>
            <dd className="text-muted-foreground">{day}</dd>
          </div>
        ) : null}
        {takes > 0 ? (
          <div className="flex min-h-12 items-center justify-between gap-4 border-t border-hairline px-4 first:border-t-0">
            <dt className="font-medium">{t('practice.takes')}</dt>
            <dd className="text-muted-foreground tabular-nums">
              {t('practice.takeCount', { count: takes })}
            </dd>
          </div>
        ) : null}
      </dl>
    </SettingsGroup>
  )
}
