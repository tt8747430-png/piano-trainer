import { useCallback } from 'react'
import { PLAY_DELAY, type PlayHandle } from '@/shared/api/audio'
import type { Chord, Midi } from '@/shared/lib/music'
import { keySound, placedChordSounds, type ChordPlaying, type Sound } from '@/shared/lib/schedule'
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

/** Sounds one key now, on top of whatever sounds: a tap is one note, with nothing to schedule ahead. */
export function useSoundKey(): (key: Midi) => void {
  const { audio } = useServices()
  return useCallback(
    (key) => {
      void audio.unlock()
      audio.play([keySound(key)], audio.now())
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
