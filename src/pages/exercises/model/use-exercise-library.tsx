import { Link } from '@tanstack/react-router'
import { Check, Heart, HeartOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  exercisesOnShelf,
  GROUP_PAINT,
  SHELF_GROUPS,
  type ExerciseShelf,
} from '@/entities/exercise'
import {
  selectFavouritesOf,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
} from '@/entities/practice-library'
import { localDay, selectExercised, useProgress } from '@/entities/progress'
import { togglePracticeFavourite } from '@/features/manage-practice-library'
import { localText, useLocale } from '@/shared/i18n'
import type { LibraryGroup, LibraryItem } from '@/widgets/practice-library'

/**
 * A shelf's library (the canvas's FingerTechnique, JazzVocabulary): its sources folded, each row its
 * mark on its source's paint, its line what it trains, its level its own, ticked the day it was played
 * through (A41); Favourite in its More.
 */
export function useExerciseLibrary(shelf: ExerciseShelf): {
  groups: readonly LibraryGroup[]
  items: readonly LibraryItem[]
} {
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const favourites = usePracticeLibrary(selectFavouritesOf('exercises'))
  const store = usePracticeLibraryStoreApi()
  const exercised = useProgress(selectExercised)
  const today = localDay(new Date())
  const groups = SHELF_GROUPS[shelf].map((group) => ({
    id: group,
    name: t(`practice:exercises.groups.${group}`),
  }))
  const items = exercisesOnShelf(shelf).map((exercise): LibraryItem => {
    const { group } = exercise
    const favourite = favourites.includes(exercise.id)
    return {
      id: exercise.id,
      name: localText(exercise.name, locale),
      detail: localText(exercise.focus ?? exercise.trains, locale),
      group,
      stage: exercise.stage,
      picture: { text: exercise.mark ?? '', paint: GROUP_PAINT[group] ?? 'sand' },
      link: <Link to="/practice/exercises/$exerciseId" params={{ exerciseId: exercise.id }} />,
      favourite,
      actions: [
        {
          key: 'favourite',
          label: t(favourite ? 'common:library.unfavourite' : 'common:library.favourite'),
          icon: favourite ? HeartOff : Heart,
          paint: 'sand',
          onSelect: () => togglePracticeFavourite(store, 'exercises', exercise.id),
        },
      ],
      ...(exercised[exercise.id] === today
        ? {
            trailing: (
              <span className="flex items-center gap-1 text-sm font-semibold text-learned">
                <Check aria-hidden className="size-4" strokeWidth={3} />
                {t('practice:exercisePage.doneToday')}
              </span>
            ),
          }
        : {}),
    }
  })
  return { groups, items }
}
