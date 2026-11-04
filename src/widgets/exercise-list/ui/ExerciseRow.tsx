import { StageMark } from '@/entities/step'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { Exercise } from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { localDay, selectExercised, useProgress } from '@/entities/progress'
import { RowLink, type Paint } from '@/shared/ui'

/**
 * An exercise's row: its name over what it trains, its stage's mark, opening its page (A41); its
 * group's tile; ticked the day it was played through (the day's routine done).
 */
export function ExerciseRow({
  exercise,
  icon,
  paint,
}: {
  exercise: Exercise
  icon: LucideIcon
  paint: Paint
}) {
  const locale = useLocale()
  const { t } = useTranslation('practice')
  const done = useProgress(selectExercised)[exercise.id] === localDay(new Date())
  return (
    <RowLink
      title={localText(exercise.name, locale)}
      detail={localText(exercise.trains, locale)}
      icon={icon}
      paint={paint}
      trailing={
        <span className="flex items-center gap-2">
          {done ? (
            <span className="flex items-center gap-1 text-sm font-semibold text-learned">
              <Check aria-hidden className="size-4" strokeWidth={3} />
              {t('exercisePage.doneToday')}
            </span>
          ) : null}
          <StageMark stage={exercise.stage} />
        </span>
      }
      render={<Link to="/practice/exercises/$exerciseId" params={{ exerciseId: exercise.id }} />}
    />
  )
}
