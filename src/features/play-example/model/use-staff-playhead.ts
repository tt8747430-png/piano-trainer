import { useMemo } from 'react'
import type { PlayHandle } from '@/shared/api/audio'
import type { Tick } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { usePlayhead } from '@/shared/lib/services'
import { onsetsOf } from './staff-taps'

/**
 * The onset of `music` sounding now in `play` (music played from its own first tick at `tempo`), as a
 * tick of the staff it is written on, `from` its first; null while it does not play.
 */
export function useStaffPlayhead(
  play: PlayHandle | null,
  music: TimedMusic,
  tempo: number,
  from: Tick = 0,
): Tick | null {
  const onsets = useMemo(() => onsetsOf(music, tempo), [music, tempo])
  const at = usePlayhead(play, onsets.seconds)
  const tick = at === null ? undefined : onsets.ticks[at]
  return tick === undefined ? null : from + tick
}
