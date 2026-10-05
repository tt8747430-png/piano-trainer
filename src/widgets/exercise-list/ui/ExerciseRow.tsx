import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { isRuleExercise, type Exercise } from '@/entities/exercise'
import { localText, useLocale } from '@/shared/i18n'
import { OPEN_PLAINLY } from '@/shared/lib'
import { numeralsParam, parseNumerals } from '@/shared/lib/music'
import { LevelMark, RowLink, type Paint } from '@/shared/ui'

/** Where an exercise opens: its own rule's Player, or the Player that already plays it. */
function exerciseLink(exercise: Exercise) {
  if (isRuleExercise(exercise))
    return (
      <Link
        to="/play/exercise/$exerciseId"
        params={{ exerciseId: exercise.id }}
        state={OPEN_PLAINLY}
      />
    )
  const { opens } = exercise
  switch (opens.player) {
    case 'walk':
      return <Link to="/play/walk" state={OPEN_PLAINLY} />
    case 'chromatic':
      return <Link to="/play/chromatic" state={OPEN_PLAINLY} />
    case 'progression':
      return (
        <Link
          to="/play/progression"
          search={{ p: numeralsParam(parseNumerals(opens.numerals) ?? []), walk: opens.walk }}
        />
      )
  }
}

/** An exercise's row: its name over what it trains, its level's mark, opening it in the Player; its group's tile. */
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
      render={exerciseLink(exercise)}
    />
  )
}
