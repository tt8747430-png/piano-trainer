import { useCallback } from 'react'
import { PLAY_DELAY, type PlayHandle } from '@/shared/api/audio'
import type { Midi } from '@/shared/lib/music'
import { keySound, type Sound } from '@/shared/lib/schedule'
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

/**
 * Sounds one key now, on top of whatever sounds: a tap is one note, with nothing to schedule ahead.
 * It is a hand's play: the keyboard shows the key while the finger or the typed key holds it.
 */
export function useSoundKey(): (key: Midi) => void {
  const { audio } = useServices()
  return useCallback(
    (key) => {
      void audio.unlock()
      audio.play([keySound(key)], audio.now(), { byHand: true })
    },
    [audio],
  )
}
