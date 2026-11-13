import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { PracticeLibrary, useArrangeMode, useLibraryNew } from '@/widgets/practice-library'
import { useExerciseLibrary } from '../model/use-exercise-library'

/**
 * Exercises (R30-4): the drills that belong to no other page as a library, the Songs library's shape,
 * each book (Finger technique, Barry Harris, Piano With Jonny) a place, each row opening its page. A
 * scale's exercises open from Scales and a chord's arpeggio from Chords, on the scale or chord shown
 * there. The pencil in its bar arranges it (R32): its books and the learner's folders, its rows; New
 * makes a folder (canvas 169).
 */
export function ExercisesPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/exercises' })
  const { groups, items } = useExerciseLibrary()
  const { editing, edit } = useArrangeMode()
  const made = useLibraryNew('exercises', [])
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('pages.exercises')}
        back={<BackButton />}
        edit={edit}
        tools={editing ? undefined : made.menu}
      />
      <PracticeLibrary
        kind="exercises"
        view={view}
        items={items}
        groups={groups}
        groupWord="book"
        levels
        screen={t('pages.exercises')}
        editing={editing}
      />
      {editing ? null : made.dial}
    </div>
  )
}
