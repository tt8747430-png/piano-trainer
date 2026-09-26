import { useCallback, useState, useSyncExternalStore } from 'react'
import type { PlayHandle } from '@/shared/api/audio'
import type { Sound } from '@/shared/lib/schedule'
import { usePlay } from './use-play'
import { useServices } from './use-services'

/** A component's Play buttons, one id each, each turning into Stop while its sound plays. */
export interface Playback<Id extends string | number> {
  /** The id last played, while it plays: until its last note ends, it is stopped, or another sound cuts it off. */
  readonly playing: Id | null
  /** A Play button's tap: stops `id`'s sound while it plays; else cuts off what sounds and plays `sounds` as `id`. */
  toggle(id: Id, sounds: readonly Sound[]): void
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
  const toggle = useCallback(
    (id: Id, sounds: readonly Sound[]) => {
      if (playing === id) {
        audio.stop()
        setStarted(null)
      } else {
        setStarted({ id, play: play(sounds) })
      }
    },
    [audio, play, playing],
  )
  return { playing, toggle }
}
