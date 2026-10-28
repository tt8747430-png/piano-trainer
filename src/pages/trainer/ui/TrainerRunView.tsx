import { useTranslation } from 'react-i18next'
import type { RunKey } from '@/entities/progress'
import { selectTrainer, useSettings } from '@/entities/settings'
import { useTrainer, type Asks } from '@/features/trainer'
import { Button } from '@/shared/ui/primitives/button'
import { Progress } from '@/shared/ui/primitives/progress'
import { RunResults, TrainerBoard } from '@/widgets/trainer-board'

/** A run of a trainer: which round it is and how far the run has come, the board, and the results once it is over. */
export function TrainerRunView({
  asks,
  rounds,
  limit,
  runKey,
  onDone,
}: {
  asks: Asks
  rounds: number
  /** Each round's time limit in seconds; none, no limit. */
  limit?: number | undefined
  runKey: RunKey
  onDone: () => void
}) {
  const { t } = useTranslation('quiz')
  const { autoNext } = useSettings(selectTrainer)
  const trainer = useTrainer(asks, { rounds, runKey, autoNext, ...(limit ? { limit } : {}) })
  if (trainer.summary) {
    return <RunResults summary={trainer.summary} onAgain={trainer.again} onDone={onDone} />
  }
  return (
    <div className="flex flex-col gap-4 landscape-phone:gap-2">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground tabular-nums">
          {rounds > 0
            ? t('roundOf', { n: trainer.number, total: rounds })
            : t('round', { n: trainer.number })}
        </p>
        {trainer.run.answered.length > 0 ? (
          <Button variant="link" className="px-0" onClick={trainer.stop}>
            {t('stop')}
          </Button>
        ) : null}
      </div>
      {/* How far the run is: the rounds answered of its rounds; a run until stopped has no end to show. */}
      {rounds > 0 ? (
        <Progress
          aria-label={t('progress', { n: trainer.number, total: rounds })}
          getAriaValueText={() => t('progress', { n: trainer.number, total: rounds })}
          value={trainer.run.answered.length}
          max={rounds}
          className="-mt-2"
        />
      ) : null}
      <TrainerBoard trainer={trainer} asks={asks} limit={limit} />
    </div>
  )
}
