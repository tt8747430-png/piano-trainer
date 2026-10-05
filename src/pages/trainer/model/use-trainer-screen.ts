import { useMemo, useState } from 'react'
import {
  selectTrainerRecord,
  useProgress,
  useProgressStoreApi,
  type TrainerRecord,
} from '@/entities/progress'
import {
  levelOf,
  myGaps,
  runKeyOf,
  trainerOf,
  type Asks,
  type Trainer,
  type TrainerId,
  type TrainerView,
} from '@/features/trainer'

/** A trainer's screen: the trainer, its level, what a run asks, and its record at that level. */
export interface TrainerScreen {
  readonly trainer: Trainer
  readonly level: string
  /** What a run asks; null for My gaps with no gaps to ask. */
  readonly asks: Asks | null
  readonly runKey: ReturnType<typeof runKeyOf>
  /** Changes whenever what the run asks does: a run starts again under a new one. */
  readonly runId: string
  readonly record: TrainerRecord | undefined
}

/**
 * A trainer as its URL asks it. My gaps reads the learner's gaps once, as the screen opens: an answer
 * that turns a gap known must not restart the run under the learner.
 */
export function useTrainerScreen(id: TrainerId, view: TrainerView): TrainerScreen {
  const trainer = trainerOf(id)
  const progress = useProgressStoreApi()
  const [gaps] = useState(() => {
    const { answers, practised } = progress.getState()
    return myGaps(answers, practised)
  })
  const level = levelOf(trainer, view)
  const { sizes, suspended, added, altered, scales, intervals, ways, qualities, arpeggio } = view
  const { kinds, descending } = view
  const { from, to, accidentals, rounds } = view
  const asks = useMemo(() => {
    if (trainer.id === 'gaps' && gaps.length === 0) return null
    const custom = { rounds, sizes, suspended, added, altered, scales, intervals, ways }
    const more = { qualities, arpeggio, kinds, descending, from, to, accidentals }
    return trainer.asks(level, { ...custom, ...more }, gaps)
  }, [
    trainer,
    level,
    rounds,
    sizes,
    suspended,
    added,
    altered,
    scales,
    intervals,
    ways,
    qualities,
    arpeggio,
    kinds,
    descending,
    from,
    to,
    accidentals,
    gaps,
  ])
  // A new run under each new ask, or a new number of rounds.
  const runId = [
    level,
    rounds,
    sizes,
    suspended,
    added,
    altered,
    scales,
    intervals,
    ways,
    qualities,
    arpeggio,
    kinds,
    descending,
    from,
    to,
    accidentals,
  ].join('|')
  const runKey = runKeyOf(trainer, level)
  const record = useProgress(selectTrainerRecord(runKey))
  return { trainer, level, asks, runKey, runId, record }
}
