import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ACCOMPANIMENT_PARTS, usePartName } from '@/entities/pattern'
import { LISTED_GROUPS } from '@/widgets/exercise-list'
import { SCALE_SHOWS } from '@/widgets/scale-explorer'
import { QUIZ_GROUPS } from '@/widgets/trainer-list'
import type { PracticePageId } from '../model/practice-pages'

/** What is inside a page, its parts by name, as a row's line. */
const listed = (names: readonly string[]) => names.join(' · ')

/** A page of Practice in words: its name, and what it says of itself in a line. */
export interface PageWords {
  readonly title: string
  readonly about: string
}

/**
 * The words of a page of Practice. A page of tabs or of groups says those in its line, in the words
 * its own page uses, so the row never promises what the page does not show; the others have a line
 * of their own.
 */
export function usePageWords(): (page: PracticePageId) => PageWords {
  const { t } = useTranslation('practice')
  const partName = usePartName()
  return useCallback(
    (page) => {
      const about = () => {
        switch (page) {
          case 'scales':
            return listed(SCALE_SHOWS.map((show) => t(`scales.show.${show}`)))
          case 'accompaniment':
            return listed(ACCOMPANIMENT_PARTS.map(partName))
          case 'exercises':
            return listed(LISTED_GROUPS.map((group) => t(`exercises.groups.${group}`)))
          case 'quiz':
            return listed(QUIZ_GROUPS.map((group) => t(`quiz.groups.${group}`)))
          default:
            return t(`about.${page}`)
        }
      }
      return { title: t(`pages.${page}`), about: about() }
    },
    [t, partName],
  )
}
