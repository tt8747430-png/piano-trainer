import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId, METHOD_BOOK_NAMES } from '@/entities/book'
import type { LessonModule } from '../model/types'

/** What Learn calls a module: a method book's by its book's name, any other by its own. */
export function useModuleName(): (module: LessonModule) => string {
  const { t } = useTranslation('learn')
  return useCallback(
    (module) => (isMethodBookId(module) ? METHOD_BOOK_NAMES[module] : t(`module.${module}`)),
    [t],
  )
}
