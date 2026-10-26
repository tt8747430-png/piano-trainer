import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { beatAt, type PlayedBeat } from './beats'
import type { Practice } from './use-practice'

/**
 * The beat sounding now (ADR 0099), in the bar played. While Listen plays, where its clock is, looked
 * at every frame and new only as a beat begins, a few times a second at most; before its first
 * sounds, and otherwise, the beat of the beat group the cursor stands on (Wait mode's awaited, where
 * Play starts).
 */
export function useBeat(
  performance: Performance,
  practice: Pick<Practice, 'state' | 'clock'>,
): PlayedBeat {
  const { clock } = practice
  const cursor = performance.beatGroups[practice.state.beatGroup]?.tick ?? 0
  const everyFrame = useCallback(
    (look: () => void) => {
      if (!clock) return () => {}
      let frame = requestAnimationFrame(function follow() {
        look()
        frame = requestAnimationFrame(follow)
      })
      return () => cancelAnimationFrame(frame)
    },
    [clock],
  )
  // Where the beat starts: the same all through it, so a frame inside it renders nothing.
  const start = useSyncExternalStore(
    everyFrame,
    () => beatAt(performance, clock?.() ?? cursor).startTick,
  )
  return useMemo(() => beatAt(performance, start), [performance, start])
}
