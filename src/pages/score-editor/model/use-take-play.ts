import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { selectMidi, useSettingsStoreApi } from '@/entities/settings'
import { takeBarStart, takeSoundsFrom, type Take } from '@/entities/take'
import { PLAY_DELAY, type PlayHandle } from '@/shared/api/audio'
import { useServices } from '@/shared/lib/services'

/** A take heard on its page: from a bar, as the Touch hears it, and where it is while it plays. */
interface TakePlay {
  /** While it plays: when on the audio clock it started, and from where in the take (ms). */
  readonly playing: { readonly at: number; readonly fromMs: number } | null
  playFrom(bar: number): void
  stop(): void
}

export function useTakePlay(take: Take): TakePlay {
  const { audio } = useServices()
  const settings = useSettingsStoreApi()
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
  // A take left while it plays stops: no Stop on the editor would reach it.
  const latest = useRef<PlayHandle | null>(null)
  useEffect(
    () => () => {
      if (latest.current && audio.isPlaying(latest.current)) audio.stop()
    },
    [audio],
  )
  return {
    playing,
    playFrom(bar) {
      void audio.unlock()
      audio.stop()
      const fromMs = takeBarStart(take, bar)
      const at = audio.now() + PLAY_DELAY
      const { touch } = selectMidi(settings.getState())
      const handle = audio.play(takeSoundsFrom(take, touch, fromMs), at)
      latest.current = handle
      setStarted({ handle, at, fromMs })
    },
    stop() {
      audio.stop()
      latest.current = null
      setStarted(null)
    },
  }
}
