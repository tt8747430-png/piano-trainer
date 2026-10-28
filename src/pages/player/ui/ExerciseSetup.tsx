import { useTranslation } from 'react-i18next'
import type { ExerciseChoice, Exercise } from '@/entities/exercise'
import { Sheet, SheetContent } from '@/shared/ui'
import { SetupTrigger } from '@/widgets/player-setup'
import { PlayingSection, type PracticePlayer } from '@/widgets/practice-player'
import type { ExerciseChange } from '../model/exercise-search'
import { ExerciseMusicFields } from './ExerciseMusicFields'
import { ExerciseWayFields } from './ExerciseWayFields'
import { ScalePracticeFields } from './ScalePracticeFields'
import type { Hands, SwingFeel } from '@/shared/lib/schedule'

/**
 * An exercise's Setup: its button, and the sheet of the choices its rule takes (each only where the
 * exercise has it), a scale run's practice (its hands, their octaves, tempo, metronome and the rest
 * between loops), then how the Player plays.
 */
export function ExerciseSetup({
  exercise,
  choice,
  player,
  hands,
  swing,
  onChange,
  onSwing,
}: {
  exercise: Exercise
  choice: ExerciseChoice
  player: PracticePlayer
  hands: Hands
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
          {exercise.fields.handOctaves ? (
            <ScalePracticeFields
              choice={choice}
              player={player}
              hands={hands}
              onChange={onChange}
            />
          ) : null}
          <PlayingSection swing={swing} onSwing={onSwing} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
