import { useCallback, useMemo } from 'react'
import type { Tick } from '@/shared/lib/music'
import { passTickAt } from '@/shared/lib/schedule'
import { usePlayhead, useServices } from '@/shared/lib/services'
import type { Heard } from './editor-context'

/** The playhead as the sheet draws it: where it stands, and the clock it follows while it plays. */
export interface SheetPlayhead {
  readonly tick: Tick
  readonly clock: () => Tick | null
}

/**
 * Where Play is while it plays (ADR 0096): the onset it reached (looked at again as each sounds) and
 * the clock the playhead follows between them, on the piece's ticks; none while it does not play.
 */
export function useHeardPlayhead(heard: Heard | null): SheetPlayhead | null {
  const { audio } = useServices()
  const seconds = useMemo(() => heard?.pass.cues.map((cue) => cue.at) ?? [], [heard])
  const reached = usePlayhead(heard?.handle ?? null, seconds)
  const clock = useCallback(
    () => (heard ? passTickAt(heard.pass, audio.now() - heard.handle.from) : null),
    [audio, heard],
  )
  const tick = heard ? (heard.pass.cues[reached ?? 0]?.tick ?? heard.pass.fromTick) : null
  return useMemo(() => (tick === null ? null : { tick, clock }), [tick, clock])
}
