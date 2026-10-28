import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { PracticePageId } from '../model/practice-pages'

/** A page of Practice in words: its name, and what it says of itself in a line. */
export interface PageWords {
  readonly title: string
  readonly about: string
}

/** The words of a page of Practice: its name and one short line, the same on Practice and in Search. */
export function usePageWords(): (page: PracticePageId) => PageWords {
  const { t } = useTranslation('practice')
  return useCallback((page) => ({ title: t(`pages.${page}`), about: t(`about.${page}`) }), [t])
}
