import { useCallback, useSyncExternalStore } from 'react'
import type { PlayHandle } from '@/shared/api/audio'
import { useServices } from './use-services'

/**
 * Where a play is: the latest of `onsets` (seconds from its start, earliest first) reached on the
 * audio clock, by its index, looked at again each time the keys sounding change; null before the
 * first and once it no longer plays. What a staff marks as its notes sound.
 */
export function usePlayhead(play: PlayHandle | null, onsets: readonly number[]): number | null {
  const { audio } = useServices()
  // The index moves only at an onset, where a key starts sounding: it is the same between changes.
  const at = useCallback(() => {
    if (!play || !audio.isPlaying(play)) return null
    // A note struck a hair early on the clock still counts as reached.
    const elapsed = audio.now() - play.from + 0.01
    let reached: number | null = null
    for (const [index, onset] of onsets.entries()) if (onset <= elapsed) reached = index
    return reached
  }, [audio, play, onsets])
  return useSyncExternalStore(audio.onSounding, at)
}
