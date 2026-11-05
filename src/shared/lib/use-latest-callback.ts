import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * A handler held for good that always calls the latest `callback`: a memoised child given it renders
 * again only for what it shows, never because its parent made a fresh handler (R32: the Player's lines
 * and keys on every beat).
 */
export function useLatestCallback<Args extends readonly unknown[], Result>(
  callback: (...args: Args) => Result,
): (...args: Args) => Result {
  const latest = useRef(callback)
  useLayoutEffect(() => {
    latest.current = callback
  })
  return useCallback((...args: Args) => latest.current(...args), [])
}
