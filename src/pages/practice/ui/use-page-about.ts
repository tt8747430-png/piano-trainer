import { useTranslation } from 'react-i18next'
import { ACCOMPANIMENT_PARTS, usePartName } from '@/entities/pattern'
import { QUIZ_GROUPS } from '@/pages/quiz'
import { LISTED_GROUPS } from '@/widgets/exercise-list'
import { SCALE_SHOWS } from '@/widgets/scale-explorer'
import type { PracticePageId } from '../model/practice-pages'

/** What is inside a page, its parts by name, as a row's line. */
const listed = (names: readonly string[]) => names.join(' · ')

/**
 * What a page of Practice says of itself in a line. A page of tabs or of groups says those, in the
 * words its own page uses, so the row never promises what the page does not show; the others have a
 * line of their own.
 */
export function usePageAbout(): (page: PracticePageId) => string {
  const { t } = useTranslation('practice')
  const partName = usePartName()
  return (page) => {
    switch (page) {
      case 'scales':
        return listed(SCALE_SHOWS.map((show) => t(`show.${show}`)))
      case 'accompaniment':
        return listed(ACCOMPANIMENT_PARTS.map(partName))
      case 'exercises':
        return listed(LISTED_GROUPS.map((group) => t(`exerciseGroups.${group}`)))
      case 'quiz':
        return listed(QUIZ_GROUPS.map((group) => t(`quizGroups.${group}`)))
      default:
        return t(`about.${page}`)
    }
  }
}
