import { useEffect, useRef, useState } from 'react'
import type { Played } from '@/entities/take'
import { useServices } from '@/shared/lib/services'
import { startRecorder, type RecorderPlan, type RecorderProgress } from './model/recorder'

/** Whether a take records: not, in its count-in, or recording. */
export type RecorderStage = 'idle' | RecorderProgress['stage']

/**
 * Where a take is, as it changes beat by beat and second by second: read by the one part that shows
 * it (`useSyncExternalStore`), so the screen around it does not render again each second.
 */
export interface RecorderProgressSource {
  readonly subscribe: (onChange: () => void) => () => void
  /** Where the take is now; null while none records. */
  readonly current: () => RecorderProgress | null
}

export interface Recorder {
  readonly stage: RecorderStage
  readonly progress: RecorderProgressSource
  /** Records a take to `plan`; nothing where there is no MIDI keyboard or a take records already. */
  readonly start: (plan: RecorderPlan) => void
  readonly stop: () => void
}

/** A progress source and the function that moves it. */
function createProgressSource(): RecorderProgressSource & {
  set: (progress: RecorderProgress | null) => void
} {
  const listeners = new Set<() => void>()
  let current: RecorderProgress | null = null
  return {
    subscribe: (onChange) => {
      listeners.add(onChange)
      return () => listeners.delete(onChange)
    },
    current: () => current,
    set: (progress) => {
      current = progress
      for (const listener of listeners) listener()
    },
  }
}

/**
 * The score editor's recorder (ADR 0028): a take from the MIDI keyboard to the click, handed on with
 * the plan it was recorded to when it stops past its count-in (by Stop, by itself, or by the screen
 * going), even with nothing played.
 */
export function useRecorder(onTake: (played: Played, plan: RecorderPlan) => void): Recorder {
  const { audio, midi } = useServices()
  const [stage, setStage] = useState<RecorderStage>('idle')
  const [progress] = useState(createProgressSource)
  const session = useRef<(() => void) | null>(null)
  // The latest `onTake`: a take may end in a timer, a key's handler or the screen's cleanup.
  const latestOnTake = useRef(onTake)
  useEffect(() => {
    latestOnTake.current = onTake
  })
  useEffect(() => () => session.current?.(), [])

  const start = (plan: RecorderPlan) => {
    if (session.current || !midi) return
    setStage('counting')
    progress.set({ stage: 'counting', beat: 1 })
    session.current = startRecorder(audio, midi, plan, {
      progress: (now) => {
        progress.set(now)
        setStage(now.stage)
      },
      ended: (played) => {
        session.current = null
        progress.set(null)
        setStage('idle')
        if (played) latestOnTake.current(played, plan)
      },
    })
  }
  const stop = () => session.current?.()
  return { stage, progress, start, stop }
}
