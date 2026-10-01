import { useTranslation } from 'react-i18next'
import type { RunKey } from '@/entities/progress'
import { selectTrainer, useSettings } from '@/entities/settings'
import { useTrainer, type Asks } from '@/features/trainer'
import { Button } from '@/shared/ui/primitives/button'
import { RunResults, TrainerBoard } from '@/widgets/trainer-board'

/** A run of a trainer: which round it is, the board, and the results once it is over. */
export function TrainerRunView({
  asks,
  rounds,
  runKey,
  onDone,
}: {
  asks: Asks
  rounds: number
  runKey: RunKey
  onDone: () => void
}) {
  const { t } = useTranslation('quiz')
  const { autoNext } = useSettings(selectTrainer)
  const trainer = useTrainer(asks, { rounds, runKey, autoNext })
  if (trainer.summary) {
    return <RunResults summary={trainer.summary} onAgain={trainer.again} onDone={onDone} />
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
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
      <TrainerBoard trainer={trainer} asks={asks} />
    </div>
  )
}
