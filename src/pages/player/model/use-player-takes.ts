import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { PieceId } from '@/entities/piece'
import { selectRecorder, useSettingsStoreApi } from '@/entities/settings'
import {
  feedbackOf,
  selectRoomLeft,
  selectTakesOf,
  useTakes,
  useTakesStoreApi,
  type Feedback,
  type Take,
  type TakeId,
} from '@/entities/take'
import { useProgressStoreApi } from '@/entities/progress'
import { saveTake } from '@/features/manage-takes'
import { recordTakeAccuracy } from '@/features/record-practised'
import { useRecorder, type RecorderStage } from '@/features/record-take'
import type { Performance } from '@/shared/lib/arrangement'

/** The Player's takes (R29 B8): the Recorder over the music, the song's takes, and Feedback on one. */
export interface PlayerTakes {
  readonly stage: RecorderStage
  /** The song's takes, the newest first. */
  readonly list: readonly Take[]
  /** The take whose feedback the score shows; null for none. */
  readonly shown: Take | null
  /** Its feedback against the music. */
  readonly feedback: Feedback | null
  /** Records a take from the bar the cursor is in, to the music's tempo. */
  record(): void
  stop(): void
  /** Shows a take's feedback on the score, or none. */
  show(id: TakeId | null): void
}

/**
 * A song's takes in the Player (R29 B8): the Recorder as the score editor's records from the bar the
 * cursor is in, each take kept and its feedback shown on the score as it ends; a take of the list
 * opened shows its own. The Rhythm game judges on timing alone (`rhythm`).
 */
export function usePlayerTakes(
  pieceId: PieceId,
  performance: Performance,
  { bar, tempo, rhythm }: { bar: number; tempo: number; rhythm: boolean },
): PlayerTakes {
  const takes = useTakesStoreApi()
  const settings = useSettingsStoreApi()
  const list = useTakes(useShallow((state) => selectTakesOf(state, pieceId)))
  const [shownId, setShownId] = useState<TakeId | null>(null)
  const recorder = useRecorder((played, plan) => {
    if (played.notes.length === 0) return
    const saved: TakeId = saveTake(takes, {
      pieceId,
      made: Date.now(),
      tempo: plan.tempo,
      meter: plan.meter,
      fromBar: plan.from + 1,
      ...played,
    })
    setShownId(saved)
  })
  const shown = list.find((take) => take.id === shownId) ?? null
  const feedback = useMemo(
    () => (shown ? feedbackOf(performance, shown, { rhythm }) : null),
    [shown, performance, rhythm],
  )
  // How well it was played counts toward A perfect take (B1), the best kept.
  const progress = useProgressStoreApi()
  const percent = feedback?.percent
  useEffect(() => {
    if (percent !== undefined) recordTakeAccuracy(progress, percent)
  }, [percent, progress])
  return {
    stage: recorder.stage,
    list,
    shown,
    feedback,
    record: () =>
      recorder.start({
        bars: performance.bars.map(({ startTick, beats, meter }) => ({ startTick, beats, meter })),
        meter: performance.meter,
        from: bar,
        tempo,
        room: selectRoomLeft(takes.getState()),
        tune: [],
        along: selectRecorder(settings.getState()),
      }),
    stop: recorder.stop,
    show: setShownId,
  }
}
