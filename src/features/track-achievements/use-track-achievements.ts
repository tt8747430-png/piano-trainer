import { useEffect, useRef } from 'react'
import { useNotificationsStoreApi, withNotices } from '@/entities/notification'
import {
  localDay,
  noticesOf,
  useProgressStoreApi,
  withEarned,
  type ProfileFigures,
} from '@/entities/progress'
import { useProfileFigures } from './use-profile-figures'

/**
 * Keeps the learner's achievements (B1), once for the whole app: the day each badge tier and
 * milestone is first reached written into the progress, and a notification for each crossing seen
 * while the app is open (what was reached before it opened is earned without a notice).
 */
export function useTrackAchievements(): void {
  const figures = useProfileFigures()
  const progress = useProgressStoreApi()
  const notifications = useNotificationsStoreApi()
  const seen = useRef<ProfileFigures | null>(null)
  useEffect(() => {
    const at = new Date()
    const before = seen.current
    seen.current = figures
    const state = progress.getState()
    const earned = withEarned(state, figures, localDay(at))
    if (earned !== state) progress.setState({ earned: earned.earned })
    if (!before) return
    const added = noticesOf(before, figures, at.toISOString())
    if (added.length > 0)
      notifications.setState((held) => ({ notices: withNotices(held.notices, added) }))
  }, [figures, progress, notifications])
}
