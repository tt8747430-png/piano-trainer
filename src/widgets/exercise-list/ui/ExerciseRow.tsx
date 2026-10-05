import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { Exercise } from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import { OPEN_PLAINLY } from '@/shared/lib'
import { LevelMark, RowLink, type Paint } from '@/shared/ui'

/** An exercise's row: its name over what it trains, its level's mark, opening it in the Player as it was left; its group's tile. */
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
      trailing={<LevelMark level={exercise.level} />}
      render={
        <Link
          to="/play/exercise/$exerciseId"
          params={{ exerciseId: exercise.id }}
          state={OPEN_PLAINLY}
        />
      }
    />
  )
}
