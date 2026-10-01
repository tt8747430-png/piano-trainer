import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { IN_PLACE } from './in-place'

/**
 * Changes the screen's view in place: the URL's params `change` names, the rest kept, the history
 * entry replaced (Back leaves the screen) and the scroll kept.
 */
export function useViewChange<View extends object>(): (change: Partial<View>) => void {
  const navigate = useNavigate()
  return useCallback(
    (change) => void navigate({ to: '.', search: (prev) => ({ ...prev, ...change }), ...IN_PLACE }),
    [navigate],
  )
}
