import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { IN_PLACE } from './in-place'

/**
 * Writes the screen's search params in place: those `change` names, the rest kept, the history
 * entry always replaced and the scroll kept. A view, a tab, a filter, a sort or a step of a flow is
 * never a place, so it never pushes an entry Back would retrace (rule 26).
 */
export function useSetSearch<View extends object>(): (change: Partial<View>) => void {
  const navigate = useNavigate()
  return useCallback(
    (change) => void navigate({ to: '.', search: (prev) => ({ ...prev, ...change }), ...IN_PLACE }),
    [navigate],
  )
}
