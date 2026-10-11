import { useEffect, useLayoutEffect, useRef } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import { useServices } from '@/shared/lib/services'
import { metronomeBar } from './metronome'

/** How often the metronome looks ahead, and how far: a bar is always queued before it is due. */
const LOOK_EVERY_MS = 100
const AHEAD = 0.5

/**
 * Clicks a bar of `beats` at `tempo` over and over while `on`, a bar at a time on the audio clock so
 * its time never drifts. A new tempo or beats is taken up by the next bar queued, so a slider dragged
 * while it clicks never stutters, and one back from a sleep skips the bars it missed. Off, what it queued is silenced (the live voice plays on).
 */
export function useMetronome({ on, tempo, beats }: { on: boolean; tempo: number; beats: number }) {
  const { audio } = useServices()
  const latest = useRef({ tempo, beats })
  useLayoutEffect(() => {
    latest.current = { tempo, beats }
  })
  useEffect(() => {
    if (!on) return
    let next = audio.now() + PLAY_DELAY
    const fill = () => {
      for (;;) {
        const { tempo: now, beats: count } = latest.current
        const length = (count * 60) / now
        // Back from a sleep (a hidden tab's timers slowed): the bars missed are skipped, on the beat
        // the clicks keep, never all queued at once in the past.
        if (next < audio.now()) next += Math.ceil((audio.now() - next) / length) * length
        if (next >= audio.now() + length + AHEAD) return
        audio.play(metronomeBar(count, now), next)
        next += length
      }
    }
    fill()
    const timer = setInterval(fill, LOOK_EVERY_MS)
    return () => {
      clearInterval(timer)
      audio.stop()
    }
  }, [audio, on])
}
