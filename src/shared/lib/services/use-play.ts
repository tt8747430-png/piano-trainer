import { useCallback } from 'react'
import { PLAY_DELAY, type PlayHandle } from '@/shared/api/audio'
import type { Midi } from '@/shared/lib/music'
import { keySounds, type Sound } from '@/shared/lib/schedule'
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
 * Sounds the keys a hand plays now, on top of whatever sounds: a tap is one key, or the chord a key
 * stands for, with nothing to schedule ahead. The keyboard shows them while the hand holds its key.
 */
export function useSoundKeys(): (keys: readonly Midi[]) => void {
  const { audio } = useServices()
  return useCallback(
    (keys) => {
      void audio.unlock()
      audio.play(keySounds(keys), audio.now(), { byHand: true })
    },
    [audio],
  )
}
