import { useMemo, useState } from 'react'
import {
  selectTrainerRecord,
  useProgress,
  useProgressStoreApi,
  type TrainerRecord,
} from '@/entities/progress'
import {
  drillOf,
  levelOf,
  myGaps,
  runKeyOf,
  trainerOf,
  type Asks,
  type Drill,
  type Trainer,
  type TrainerId,
  type TrainerView,
} from '@/features/trainer'

/** A trainer's screen: the trainer, its level and drill, what a run asks, and its record there. */
interface TrainerScreen {
  readonly trainer: Trainer
  readonly level: string
  /** How a drill asks; none for a trainer of one way. */
  readonly drill: Drill | undefined
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
  const drill = drillOf(trainer, view)
  const { rounds, show, chords, roots, inversions, scales, intervals, ways, arpeggio } = view
  const { kinds, descending, from, to, accidentals } = view
  const asks = useMemo(() => {
    if (trainer.id === 'gaps' && gaps.length === 0) return null
    const asked = { rounds, drill, show, chords, roots, inversions, scales, intervals, ways }
    const more = { arpeggio, kinds, descending, from, to, accidentals }
    return trainer.asks(level, { ...asked, ...more }, gaps)
  }, [
    trainer,
    level,
    rounds,
    drill,
    show,
    chords,
    roots,
    inversions,
    scales,
    intervals,
    ways,
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
    drill,
    show,
    chords,
    roots,
    inversions,
    scales,
    intervals,
    ways,
    arpeggio,
    kinds,
    descending,
    from,
    to,
    accidentals,
  ].join('|')
  const runKey = runKeyOf(trainer, level, drill)
  const record = useProgress(selectTrainerRecord(runKey))
  return { trainer, level, drill, asks, runKey, runId, record }
}
