import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PracticeLibrary } from '@/widgets/practice-library'
import { SettingsGear } from '@/widgets/practice-pages'
import { useExerciseLibrary } from '../model/use-exercise-library'

/**
 * Exercises (R30-4): the drills that belong to no other page as a library, the Songs library's shape,
 * each book (Finger technique, Barry Harris, Piano With Jonny) a place, each row opening its page. A
 * scale's exercises open from Scales and a chord's arpeggio from Chords, on the scale or chord shown
 * there.
 */
export function ExercisesPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/exercises' })
  const { groups, items } = useExerciseLibrary()
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('pages.exercises')}
        back={<BackButton />}
        settings={<SettingsGear page="exercises" />}
      />
      <PracticeLibrary
        kind="exercises"
        view={view}
        items={items}
        groups={groups}
        groupWord="book"
        levels
        screen={t('pages.exercises')}
      />
    </div>
  )
}
