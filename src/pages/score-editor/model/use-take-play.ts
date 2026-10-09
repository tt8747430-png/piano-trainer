import { useMemo, useState, useSyncExternalStore } from 'react'
import { selectMidi, useSettings } from '@/entities/settings'
import { barMs, takeSoundsFrom, type Take } from '@/entities/take'
import { PLAY_DELAY, type PlayHandle } from '@/shared/api/audio'
import { useServices } from '@/shared/lib/services'

/** A take heard on its page: from a bar, as the Touch hears it, and where it is while it plays. */
export interface TakePlay {
  /** While it plays: when on the audio clock it started, and from where in the take (ms). */
  readonly playing: { readonly at: number; readonly fromMs: number } | null
  playFrom(bar: number): void
  stop(): void
}

export function useTakePlay(take: Take): TakePlay {
  const { audio } = useServices()
  const { touch } = useSettings(selectMidi)
  const [started, setStarted] = useState<{
    readonly handle: PlayHandle
    readonly at: number
    readonly fromMs: number
  } | null>(null)
  const sounding = useSyncExternalStore(
    audio.onSounding,
    () => started !== null && audio.isPlaying(started.handle),
  )
  const playing = useMemo(
    () => (sounding && started ? { at: started.at, fromMs: started.fromMs } : null),
    [sounding, started],
  )
  return {
    playing,
    playFrom(bar) {
      void audio.unlock()
      audio.stop()
      const fromMs = bar * barMs(take)
      const at = audio.now() + PLAY_DELAY
      setStarted({ handle: audio.play(takeSoundsFrom(take, touch, fromMs), at), at, fromMs })
    },
    stop() {
      audio.stop()
      setStarted(null)
    },
  }
}
