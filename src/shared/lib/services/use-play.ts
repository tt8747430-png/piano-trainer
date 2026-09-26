import { useCallback } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import type { Chord, Midi } from '@/shared/lib/music'
import { keySound, placedChordSounds, type ChordPlaying, type Sound } from '@/shared/lib/schedule'
import { useServices } from './use-services'

/**
 * Sounds something now, cutting off what was sounding: a chord, a bar, a scale run. Returns when it
 * starts on the audio clock, so a caller can light keys in time.
 */
export function usePlay(): (sounds: readonly Sound[]) => number {
  const { audio } = useServices()
  return useCallback(
    (sounds) => {
      void audio.unlock()
      audio.stop()
      const at = audio.now() + PLAY_DELAY
      audio.play(sounds, at)
      return at
    },
    [audio],
  )
}

/** Sounds one key on top of whatever sounds: a tap on the keyboard never cuts anything off. */
export function useSoundKey(): (key: Midi) => void {
  const { audio } = useServices()
  return useCallback(
    (key) => {
      void audio.unlock()
      audio.play([keySound(key)])
    },
    [audio],
  )
}

/** Sounds a chord as the explorers place it (`placeChord`), struck at once or rolled upwards. */
export function usePlayChord(): (chord: Chord, options?: ChordPlaying) => void {
  const play = usePlay()
  return useCallback(
    (chord, options) => {
      play(placedChordSounds(chord, options))
    },
    [play],
  )
}
