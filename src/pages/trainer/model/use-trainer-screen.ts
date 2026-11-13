import { useMemo } from 'react'
import { selectTrainerRecord, useProgress, type TrainerRecord } from '@/entities/progress'
import {
  drillOf,
  levelOf,
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
  /** What a run asks. */
  readonly asks: Asks
  readonly runKey: ReturnType<typeof runKeyOf>
  /** Changes whenever what the run asks does: a run starts again under a new one. */
  readonly runId: string
  readonly record: TrainerRecord | undefined
}

/** A trainer as its URL asks it. */
export function useTrainerScreen(id: TrainerId, view: TrainerView): TrainerScreen {
  const trainer = trainerOf(id)
  const level = levelOf(trainer, view)
  const drill = drillOf(trainer, view)
  const { rounds, show, chords, roots, inversions, scales, intervals, ways, arpeggio } = view
  const { kinds, descending, from, to, accidentals } = view
  const asks = useMemo(() => {
    const asked = { rounds, drill, show, chords, roots, inversions, scales, intervals, ways }
    const more = { arpeggio, kinds, descending, from, to, accidentals }
    return trainer.asks(level, { ...asked, ...more })
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
