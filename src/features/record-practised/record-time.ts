import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  localDay,
  SILENCE_COUNTED_S,
  useProgressStoreApi,
  withBestTake,
  withFirst,
  withKeyPractised,
  withPracticeTime,
  type FirstId,
  type ProgressStore,
} from '@/entities/progress'

/** Records `seconds` practised, on the day of `now` (B1). */
export function recordPracticeTime(store: ProgressStore, seconds: number, now: Date): void {
  const state = store.getState()
  const next = withPracticeTime(state, seconds, localDay(now))
  if (next !== state) store.setState({ seconds: next.seconds })
}

/** Records that a key was practised (a scale or a key's chords played in it), on its first day. */
export function recordKeyPractised(store: ProgressStore, key: string, now: Date): void {
  const state = store.getState()
  const next = withKeyPractised(state, key, localDay(now))
  if (next !== state) store.setState({ keys: next.keys })
}

/** Records how well a take was played (B8's Feedback), kept where it beats the best (A perfect take). */
export function recordTakeAccuracy(store: ProgressStore, percent: number): void {
  const state = store.getState()
  const next = withBestTake(state, percent)
  if (next !== state) store.setState({ bestTake: next.bestTake })
}

/** Records a first (a song published, a minute on a connected piano), once. */
export function recordFirst(store: ProgressStore, first: FirstId, now: Date): void {
  const state = store.getState()
  const next = withFirst(state, first, localDay(now))
  if (next !== state) store.setState({ firsts: next.firsts })
}

/** How often a running clock writes what it counted: a save every so often, not every second. */
const WRITE_EVERY_MS = 15_000

/**
 * Counts the time practised (B1) while `playing` (the transport runs) and up to
 * `SILENCE_COUNTED_S` after each `touch` (a key pressed, an answer given); a longer pause is a
 * break, not practice. Written every 15 seconds and when the screen closes.
 */
export function usePracticeClock(playing: boolean): { touch: () => void } {
  const store = useProgressStoreApi()
  // Since when time counts, and until when silence still counts.
  const since = useRef<number | null>(null)
  const until = useRef(0)
  const playingNow = useRef(playing)
  const flush = useCallback(() => {
    const now = Date.now()
    const start = since.current
    if (start === null) return
    const end = playingNow.current ? now : Math.min(now, until.current)
    if (end > start) recordPracticeTime(store, (end - start) / 1000, new Date(now))
    since.current = playingNow.current || now < until.current ? now : null
  }, [store])
  useEffect(() => {
    if (playing) {
      playingNow.current = true
      if (since.current === null) since.current = Date.now()
      return
    }
    // Stopped: the time it ran is written; then only silence after a touch counts on.
    if (playingNow.current) flush()
    playingNow.current = false
    if (since.current !== null && until.current <= Date.now()) since.current = null
  }, [playing, flush])
  useEffect(() => {
    const timer = setInterval(flush, WRITE_EVERY_MS)
    return () => {
      clearInterval(timer)
      flush()
    }
  }, [flush])
  const touch = useCallback(() => {
    const now = Date.now()
    if (since.current === null) since.current = now
    else if (!playingNow.current && now > until.current) {
      // The silence ran past what counts: what came before is written, and a new stretch starts.
      flush()
      since.current = now
    }
    until.current = now + SILENCE_COUNTED_S * 1000
  }, [flush])
  return useMemo(() => ({ touch }), [touch])
}
