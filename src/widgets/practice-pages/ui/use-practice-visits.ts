import { useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSettingsStoreApi } from '@/entities/settings'
import { notePracticeOpened } from '@/features/set-preference'
import { practicePageAt } from '../model/practice-pages'

/**
 * Notes each Practice page the learner opens, however it was reached (R32: a page from Search, a
 * link or Back counts, not only a row on Practice), for Practice's Up next. Called once, in the shell.
 */
export function usePracticeVisits(): void {
  const store = useSettingsStoreApi()
  const page = useRouterState({ select: (state) => practicePageAt(state.location.pathname) })
  useEffect(() => {
    if (page) notePracticeOpened(store, page)
  }, [page, store])
}
