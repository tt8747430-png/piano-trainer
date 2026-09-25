import { useCallback } from 'react'
import { PLAY_DELAY } from '@/shared/api/audio'
import { placeChord, type Chord } from '@/shared/lib/music'
import { chordSounds, type Sound } from '@/shared/lib/schedule'
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

export interface ChordPlaying {
  readonly inversion?: number
  readonly bothHands?: boolean
  readonly arpeggio?: boolean
}

/** Sounds a chord as the explorers place it (`placeChord`), struck at once or rolled upwards. */
export function usePlayChord(): (chord: Chord, options?: ChordPlaying) => void {
  const play = usePlay()
  return useCallback(
    (chord, { inversion = 0, bothHands = false, arpeggio = false } = {}) => {
      const placed = placeChord(chord.root, chord.quality, { inversion, bothHands })
      play(
        chordSounds(
          [...placed.lh, ...placed.rh].map((tone) => tone.midi),
          { arpeggio },
        ),
      )
    },
    [play],
  )
}
