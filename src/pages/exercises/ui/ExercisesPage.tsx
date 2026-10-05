import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { ExerciseList } from '@/widgets/exercise-list'

/**
 * Exercises: the drills that belong to no other page, by group, each opening in the Player. A scale's
 * exercises open from Scales and a chord's arpeggio from Chords, on the scale or chord shown there.
 */
export function ExercisesPage() {
  const { t } = useTranslation('practice')
  return (
    <div className="flex flex-col gap-2">
      <ScreenHeader
        title={t('subjects.exercises')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <ExerciseList />
    </div>
  )
}
