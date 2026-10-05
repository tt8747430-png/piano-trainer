import { useEffect, useRef, useState } from 'react'
import type { Played } from '@/entities/take'
import { useServices } from '@/shared/lib/services'
import { startRecorder, type RecorderPlan, type RecorderProgress } from './model/recorder'

/** Where the recorder is: no take, or a take in its count-in or recording. */
export type RecorderState = { readonly stage: 'idle' } | RecorderProgress

export interface Recorder {
  readonly state: RecorderState
  /** Records a take to `plan`; nothing where there is no MIDI keyboard or a take records already. */
  readonly start: (plan: RecorderPlan) => void
  readonly stop: () => void
}

const IDLE: RecorderState = { stage: 'idle' }

/**
 * The score editor's recorder (ADR 0028): a take from the MIDI keyboard to the click, handed on with
 * the plan it was recorded to when it stops past its count-in (by Stop, by itself, or by the screen
 * going), even with nothing played.
 */
export function useRecorder(onTake: (played: Played, plan: RecorderPlan) => void): Recorder {
  const { audio, midi } = useServices()
  const [state, setState] = useState<RecorderState>(IDLE)
  const session = useRef<(() => void) | null>(null)
  // The latest `onTake`: a take may end in a timer, a key's handler or the screen's cleanup.
  const latestOnTake = useRef(onTake)
  useEffect(() => {
    latestOnTake.current = onTake
  })
  useEffect(() => () => session.current?.(), [])

  const start = (plan: RecorderPlan) => {
    if (session.current || !midi) return
    setState({ stage: 'counting', beat: 1 })
    session.current = startRecorder(audio, midi, plan, {
      progress: setState,
      ended: (played) => {
        session.current = null
        setState(IDLE)
        if (played) latestOnTake.current(played, plan)
      },
    })
  }
  const stop = () => session.current?.()
  return { state, start, stop }
}
