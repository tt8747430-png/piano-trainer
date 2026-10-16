import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { PlayHandle } from '@/shared/api/audio'
import type { Sound } from '@/shared/lib/schedule'
import { usePlay } from './use-play'
import { useServices } from './use-services'

/** A component's Play buttons, one id each, each turning into Stop while its sound plays. */
interface Playback<Id extends string | number> {
  /** The id last played, while it plays: until its last note ends, it is stopped, or another sound cuts it off. */
  readonly playing: Id | null
  /**
   * A Play button's tap: stops `id`'s sound while it plays; else cuts off what sounds and plays as
   * `id` the sounds `sounds` works out, only then: a Stop works nothing out.
   */
  toggle(id: Id, sounds: () => readonly Sound[]): void
  /** Cuts off what sounds and plays `sounds` as `id`, its button Stop while they sound. */
  start(id: Id, sounds: readonly Sound[]): void
  /** The play of the id playing, while it plays: where it started on the audio clock. */
  readonly handle: PlayHandle | null
}

/**
 * The state of a component's Play buttons, read from the audio port: nothing is shared between
 * components, because a sound started anywhere else cuts this one's play off and the port says so.
 */
export function usePlayback<Id extends string | number>(): Playback<Id> {
  const { audio } = useServices()
  const play = usePlay()
  const [started, setStarted] = useState<{ readonly id: Id; readonly play: PlayHandle } | null>(
    null,
  )
  const playing = useSyncExternalStore(audio.onSounding, () =>
    started !== null && audio.isPlaying(started.play) ? started.id : null,
  )
  // What this component started stops as it goes: leaving a page leaves no example sounding on.
  const latest = useRef<PlayHandle | null>(null)
  useEffect(
    () => () => {
      if (latest.current && audio.isPlaying(latest.current)) audio.stop()
    },
    [audio],
  )
  const start = useCallback(
    (id: Id, sounds: readonly Sound[]) => {
      const started = play(sounds)
      latest.current = started
      setStarted({ id, play: started })
    },
    [play],
  )
  const toggle = useCallback(
    (id: Id, sounds: () => readonly Sound[]) => {
      if (playing !== id) return start(id, sounds())
      audio.stop()
      latest.current = null
      setStarted(null)
    },
    [audio, start, playing],
  )
  return { playing, toggle, start, handle: playing === null ? null : (started?.play ?? null) }
}
