import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@/shared/ui'
import { PracticeLibrary, useArrangeMode, useLibraryNew } from '@/widgets/practice-library'
import { useExerciseLibrary } from '../model/use-exercise-library'

/**
 * A shelf of exercises (the canvas's FingerTechnique, JazzVocabulary): the drills that belong to no
 * other page as a library, the Songs library's shape, titled by its shelf, its sources folded (The
 * Virtuoso Pianist, Five-finger position; Barry Harris, Piano With Jonny), each row opening its page. A
 * scale's exercises open from Scales and a chord's arpeggio from Chords, on the scale or chord shown
 * there. The pencil in its bar arranges it (R32): its books and the learner's folders, its rows; New
 * makes a folder (canvas 169).
 */
export function ExercisesPage() {
  const { t } = useTranslation('practice')
  const { book: shelf, ...view } = useSearch({ from: '/shell/practice/exercises' })
  const { groups, items } = useExerciseLibrary(shelf)
  const title = t(`exercises.shelves.${shelf}`)
  const { editing, edit } = useArrangeMode()
  const newDial = useLibraryNew('exercises', [])
  return (
    <div className="flex flex-col gap-4 pb-4">
      <PracticeLibrary
        header={{
          large: true,
          title,
          back: <BackButton />,
          edit,
        }}
        kind="exercises"
        view={view}
        items={items}
        groups={groups}
        groupWord="book"
        levels
        columns={{ name: t('library.table.exercise'), second: t('library.table.focus') }}
        screen={title}
        editing={editing}
      />
      {editing ? null : newDial}
    </div>
  )
}
