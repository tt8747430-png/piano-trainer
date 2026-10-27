import { useTranslation } from 'react-i18next'
import type { ExerciseChoice, Exercise } from '@/entities/exercise'
import { Sheet, SheetContent } from '@/shared/ui'
import { SetupTrigger } from '@/widgets/player-setup'
import { PlayingSection } from '@/widgets/practice-player'
import type { ExerciseChange } from '../model/exercise-search'
import { ExerciseMusicFields } from './ExerciseMusicFields'
import { ExerciseWayFields } from './ExerciseWayFields'
import type { SwingFeel } from '@/shared/lib/schedule'

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
  swing: SwingFeel
  onChange: (change: ExerciseChange) => void
  onSwing: (feel: SwingFeel) => void
}) {
  const { t } = useTranslation('player')
  return (
    <Sheet>
      <SetupTrigger />
      <SheetContent title={t('setup')}>
        <div className="flex flex-col gap-5">
          <ExerciseMusicFields exercise={exercise} choice={choice} onChange={onChange} />
          <ExerciseWayFields exercise={exercise} choice={choice} onChange={onChange} />
          <PlayingSection swing={swing} onSwing={onSwing} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
