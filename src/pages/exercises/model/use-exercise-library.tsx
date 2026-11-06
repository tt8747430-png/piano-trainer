import { Link } from '@tanstack/react-router'
import { BookOpen, Check, Hand, Heart, HeartOff, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EXERCISES, type ExerciseGroup } from '@/entities/exercise'
import {
  selectFavouritesOf,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
} from '@/entities/practice-library'
import { localDay, selectExercised, useProgress } from '@/entities/progress'
import { togglePracticeFavourite } from '@/features/manage-practice-library'
import { localText, useLocale } from '@/shared/i18n'
import type { Paint } from '@/shared/ui'
import type { LibraryGroup, LibraryItem } from '@/widgets/practice-library'

/**
 * The books the Exercises library lists, in its order (R30-4): a scale's and a chord's exercises
 * open from their own pages. Each book's tile: technique the hand, the masters' books a book.
 */
const BOOKS = {
  technique: { icon: Hand, paint: 'yellow' },
  barryHarris: { icon: BookOpen, paint: 'lilac' },
  jonny: { icon: BookOpen, paint: 'sky' },
} as const satisfies Partial<Record<ExerciseGroup, { icon: LucideIcon; paint: Paint }>>
type ListedBook = keyof typeof BOOKS
const LISTED: readonly ListedBook[] = ['technique', 'barryHarris', 'jonny']
const isListed = (group: ExerciseGroup): group is ListedBook =>
  LISTED.some((book) => book === group)

/**
 * The Exercises library's books and rows (R30-4): each listed exercise its book's, its line what it
 * trains, its level its own, ticked the day it was played through (A41); Favourite in its More.
 */
export function useExerciseLibrary(): {
  groups: readonly LibraryGroup[]
  items: readonly LibraryItem[]
} {
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const favourites = usePracticeLibrary(selectFavouritesOf('exercises'))
  const store = usePracticeLibraryStoreApi()
  const exercised = useProgress(selectExercised)
  const today = localDay(new Date())
  const groups = LISTED.map((book) => ({ id: book, name: t(`practice:exercises.groups.${book}`) }))
  const items = EXERCISES.flatMap((exercise): LibraryItem[] => {
    const { group } = exercise
    if (!isListed(group)) return []
    const favourite = favourites.includes(exercise.id)
    return [
      {
        id: exercise.id,
        name: localText(exercise.name, locale),
        detail: localText(exercise.trains, locale),
        group,
        stage: exercise.stage,
        ...BOOKS[group],
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
      },
    ]
  })
  return { groups, items }
}
