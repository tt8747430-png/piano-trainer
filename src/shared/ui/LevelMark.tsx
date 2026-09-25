import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** Four pips rising in height, 6 to 12px. */
const PIPS = [
  { pip: 1, height: 'h-1.5' },
  { pip: 2, height: 'h-2' },
  { pip: 3, height: 'h-2.5' },
  { pip: 4, height: 'h-3' },
] as const

/** A level as four pips, the first `level` filled. */
export function LevelMark({ level }: { level: 1 | 2 | 3 | 4 }) {
  const { t } = useTranslation('common')
  return (
    <span role="img" aria-label={t('level', { level })} className="inline-flex items-end gap-0.5">
      {PIPS.map(({ pip, height }) => (
        <span
          key={pip}
          className={cn('w-1 rounded-full', height, pip <= level ? 'bg-primary' : 'bg-border')}
        />
      ))}
    </span>
  )
}
