import { useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { stepById, useStepTitle, type StepId } from '@/entities/path'
import { selectAnswers, selectIsLearned, useProgressStoreApi } from '@/entities/progress'
import { MidiButton } from '@/features/connect-midi'
import { checkPlan, useTrainer, type CheckPlan } from '@/features/trainer'
import { useGoBack } from '@/shared/lib'
import { RoundButton } from '@/shared/ui'
import { Progress } from '@/shared/ui/primitives/progress'
import { TrainerBoard } from '@/widgets/trainer-board'
import { CheckResult } from './CheckResult'

function CheckFlow({ plan }: { plan: CheckPlan }) {
  const { t } = useTranslation(['quiz', 'common'])
  const store = useProgressStoreApi()
  const stepTitle = useStepTitle()
  const step = stepById(plan.of)
  const title = step ? stepTitle(step.step).primary : ''
  const trainer = useTrainer(plan.asks, { rounds: plan.length })
  const [learnedBefore] = useState(
    () => plan.marks !== null && selectIsLearned(plan.marks)(store.getState()),
  )
  const close = useGoBack({ to: '/' })
  const answered = trainer.run.answered.length

  return (
    <div className="flex flex-1 flex-col gap-5 pt-2">
      <header className="flex items-center gap-3">
        <RoundButton label={t('common:close')} icon={X} onClick={close} />
        <Progress
          value={answered}
          max={plan.length}
          aria-label={t('quiz:progress', { n: trainer.number, total: plan.length })}
          className="flex-1"
        />
        <MidiButton />
      </header>
      <h1 className="text-2xl">{t('quiz:checkTitle', { title })}</h1>
      {trainer.summary ? (
        <CheckResult
          plan={plan}
          correct={trainer.run.answered.filter((round) => round.correct).length}
          title={title}
          newlyLearned={!learnedBefore}
          onDone={close}
        />
      ) : (
        <TrainerBoard trainer={trainer} asks={plan.asks} />
      )}
    </div>
  )
}

/** The check's questions, drawn once from the evidence as it opens: each skill as often as it still needs. */
function CheckDraw({ of }: { of: StepId }) {
  const progress = useProgressStoreApi()
  const [plan] = useState(() => checkPlan(of, (skill) => selectAnswers(skill)(progress.getState())))
  return plan ? <CheckFlow plan={plan} /> : null
}

export function CheckPage() {
  const { of } = useSearch({ from: '/full-screen/check' })
  return of ? <CheckDraw key={of} of={of} /> : null
}
