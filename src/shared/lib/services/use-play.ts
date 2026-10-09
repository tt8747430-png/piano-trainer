import { useCallback } from 'react'
import { PLAY_DELAY, type PlayHandle } from '@/shared/api/audio'
import type { Sound } from '@/shared/lib/schedule'
import { useServices } from './use-services'

/** Sounds something now, cutting off what was sounding: a chord, a bar, a scale run. Returns its play. */
export function usePlay(): (sounds: readonly Sound[]) => PlayHandle {
  const { audio } = useServices()
  return useCallback(
    (sounds) => {
      void audio.unlock()
      audio.stop()
      return audio.play(sounds, audio.now() + PLAY_DELAY)
    },
    [audio],
  )
}
