import { StageMark } from '@/entities/step'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { Exercise } from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import { RowLink, type Paint } from '@/shared/ui'

/** An exercise's row: its name over what it trains, its stage's mark, opening its page (A41); its group's tile. */
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
  return (
    <RowLink
      title={localText(exercise.name, locale)}
      detail={localText(exercise.trains, locale)}
      icon={icon}
      paint={paint}
      trailing={<StageMark stage={exercise.stage} />}
      render={<Link to="/practice/exercises/$exerciseId" params={{ exerciseId: exercise.id }} />}
    />
  )
}
