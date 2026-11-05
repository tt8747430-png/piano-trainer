import { useCallback, useEffect, useRef } from 'react'

/** How long an edit rests before it is kept: a draft's, or a learner's own lesson's. */
export const REST_MS = 800

/**
 * What an editor writes, kept once the editor rests (`REST_MS`): `flush` keeps what waits at once
 * (Done), and what waits is kept on the way out too.
 */
export function useRestingSave<T>(write: (value: T) => void) {
  const pending = useRef<{ value: T; timer: number } | null>(null)
  const writer = useRef(write)
  useEffect(() => {
    writer.current = write
  })
  const flush = useCallback(() => {
    const waiting = pending.current
    if (!waiting) return
    window.clearTimeout(waiting.timer)
    pending.current = null
    writer.current(waiting.value)
  }, [])
  const save = useCallback(
    (value: T) => {
      if (pending.current) window.clearTimeout(pending.current.timer)
      pending.current = { value, timer: window.setTimeout(flush, REST_MS) }
    },
    [flush],
  )
  useEffect(() => flush, [flush])
  return { save, flush }
}
