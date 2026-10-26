import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Calls `frame` at every animation frame while `on` (ADR 0108: what moves with Listen's clock, read
 * frame by frame), the latest `frame` each time, rendering nothing.
 */
export function useEveryFrame(frame: () => void, on: boolean): void {
  const latest = useRef(frame)
  useLayoutEffect(() => {
    latest.current = frame
  })
  useEffect(() => {
    if (!on) return
    let id = requestAnimationFrame(function follow() {
      latest.current()
      id = requestAnimationFrame(follow)
    })
    return () => cancelAnimationFrame(id)
  }, [on])
}
