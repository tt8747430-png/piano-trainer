import { useTranslation } from 'react-i18next'
import type { TrainerRecord } from '@/entities/progress'

/** A level's record, in a line: its runs, the best and the last; nothing before its first run. */
export function TrainerRecordLine({ record }: { record: TrainerRecord | undefined }) {
  const { t } = useTranslation('quiz')
  if (!record) return null
  return (
    <p className="flex flex-wrap gap-x-5 text-sm text-muted-foreground tabular-nums">
      <span>{t('record.runs', { count: record.runs })}</span>
      <span>{t('record.best', { percent: record.best })}</span>
      <span>{t('record.last', { percent: record.last })}</span>
    </p>
  )
}
