import { useEffect } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import { useServices } from '@/shared/lib/services'
import { metronomeBar } from './metronome'

/** How often the metronome looks ahead, and how far: a bar is always queued before it is due. */
const LOOK_EVERY_MS = 100
const AHEAD = 0.5

/**
 * Clicks a bar of `beats` at `tempo` over and over while `on`, a bar at a time on the audio clock so
 * its time never drifts; a change of tempo or beats starts it again on a downbeat. Off, what it
 * queued is silenced (the live voice plays on).
 */
export function useMetronome({ on, tempo, beats }: { on: boolean; tempo: number; beats: number }) {
  const { audio } = useServices()
  useEffect(() => {
    if (!on) return
    const bar = metronomeBar(beats, tempo)
    const length = (beats * 60) / tempo
    let next = audio.now() + PLAY_DELAY
    const fill = () => {
      while (next < audio.now() + length + AHEAD) {
        audio.play(bar, next)
        next += length
      }
    }
    fill()
    const timer = setInterval(fill, LOOK_EVERY_MS)
    return () => {
      clearInterval(timer)
      audio.stop()
    }
  }, [audio, on, tempo, beats])
}
