import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ExerciseChoice, Exercise } from '@/entities/exercise'
import { RoundButton, Sheet, SheetContent, SheetTrigger, ToggleGrid } from '@/shared/ui'
import { PlayingToggles } from '@/widgets/practice-player'
import type { ExerciseChange } from '../model/exercise-search'
import { ExerciseMusicFields } from './ExerciseMusicFields'
import { ExerciseWayFields } from './ExerciseWayFields'

/**
 * An exercise's Setup: its button, and the sheet of the choices its rule takes (each only where the
 * exercise has it), then how the Player plays.
 */
export function ExerciseSetup({
  exercise,
  choice,
  swing,
  onChange,
  onSwing,
}: {
  exercise: Exercise
  choice: ExerciseChoice
  swing: boolean
  onChange: (change: ExerciseChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Sheet>
      <SheetTrigger render={<RoundButton label={t('setup')} icon={SlidersHorizontal} />} />
      <SheetContent title={t('setup')}>
        <div className="flex flex-col gap-5">
          <ExerciseMusicFields exercise={exercise} choice={choice} onChange={onChange} />
          <ExerciseWayFields exercise={exercise} choice={choice} onChange={onChange} />
          <ToggleGrid label={t('playing')}>
            <PlayingToggles swing={swing} onSwing={onSwing} />
          </ToggleGrid>
        </div>
      </SheetContent>
    </Sheet>
  )
}
