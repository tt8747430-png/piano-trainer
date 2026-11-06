import { useEffect, useRef, useState } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import {
  calibratedLatency,
  CALIBRATION_BPM,
  CALIBRATION_CLICKS,
  CALIBRATION_COUNT_IN,
} from '@/shared/lib'
import type { ClickSound } from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'

/** How often the calibration looks at the audio clock. */
const FOLLOW_INTERVAL_MS = 25

/**
 * Where Calibrate timing is: ready, counting in (the beat, from 1), on a click to tap with (from 0)
 * with the taps heard so far, measured (the piano's lateness, in milliseconds), or unclear where too
 * few taps came with a click.
 */
export type Calibration =
  | { readonly stage: 'ready' }
  | { readonly stage: 'counting'; readonly beat: number }
  | { readonly stage: 'tapping'; readonly click: number; readonly taps: number }
  | { readonly stage: 'measured'; readonly latency: number }
  | { readonly stage: 'unclear' }

function sameCalibration(a: Calibration, b: Calibration): boolean {
  if (a.stage === 'counting' && b.stage === 'counting') return a.beat === b.beat
  if (a.stage === 'tapping' && b.stage === 'tapping')
    return a.click === b.click && a.taps === b.taps
  return false
}

/**
 * Calibrate timing (R34): a count-in, then clicks at a slow tempo, each tapped with any key on the
 * MIDI keyboard; the piano's lateness is the median of how late the taps came, handed to `measured`.
 * Start runs it, Stop leaves it; nothing without a MIDI keyboard.
 */
export function useTimingCalibration(measured: (latency: number) => void) {
  const { audio, midi } = useServices()
  const [calibration, setCalibration] = useState<Calibration>({ stage: 'ready' })
  const running = useRef<(() => void) | null>(null)
  const latestMeasured = useRef(measured)
  useEffect(() => {
    latestMeasured.current = measured
  })
  useEffect(() => () => running.current?.(), [])

  const start = () => {
    if (!midi || running.current) return
    void audio.unlock()
    audio.stop()
    const beat = 60 / CALIBRATION_BPM
    const count = CALIBRATION_COUNT_IN + CALIBRATION_CLICKS
    const from = audio.now() + PLAY_DELAY
    const clicks: ClickSound[] = Array.from({ length: count }, (_, at) => ({
      kind: 'click',
      at: at * beat,
      accent: at === 0 || at === CALIBRATION_COUNT_IN,
    }))
    audio.play(clicks, from)
    const tapped = clicks.slice(CALIBRATION_COUNT_IN).map((click) => from + click.at)
    const taps: number[] = []
    const stopNotes = midi.onNote((event) => {
      if (event.on) taps.push(audio.audioTimeAt(event.time))
    })
    let shown: Calibration = { stage: 'counting', beat: 1 }
    setCalibration(shown)
    const end = () => {
      clearInterval(timer)
      stopNotes()
      running.current = null
    }
    const follow = () => {
      const now = audio.audioTimeAt(performance.now())
      const at = Math.floor((now - from) / beat)
      if (at >= count) {
        end()
        const latency = calibratedLatency(tapped, taps)
        setCalibration(latency === null ? { stage: 'unclear' } : { stage: 'measured', latency })
        if (latency !== null) latestMeasured.current(latency)
        return
      }
      const next: Calibration =
        at < CALIBRATION_COUNT_IN
          ? { stage: 'counting', beat: Math.max(0, at) + 1 }
          : { stage: 'tapping', click: at - CALIBRATION_COUNT_IN, taps: taps.length }
      if (sameCalibration(shown, next)) return
      shown = next
      setCalibration(next)
    }
    const timer = setInterval(follow, FOLLOW_INTERVAL_MS)
    running.current = () => {
      end()
      audio.stop()
    }
  }

  const stop = () => {
    running.current?.()
    setCalibration({ stage: 'ready' })
  }

  return { calibration, start, stop, ready: midi !== null }
}
