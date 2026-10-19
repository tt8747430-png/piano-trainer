import { useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRepertoire } from '@/entities/piece'
import { stepOf, type StepId } from '@/entities/step'
import { selectAnswers, selectIsLearned, useProgressStoreApi } from '@/entities/progress'
import { MidiButton } from '@/features/connect-midi'
import { checkPlan, useTrainer, type CheckPlan } from '@/features/trainer'
import { useGoBack } from '@/shared/lib'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { Progress } from '@/shared/ui/primitives/progress'
import { useStepTitle } from '@/widgets/curriculum'
import { TrainerBoard } from '@/widgets/trainer-board'
import { CheckResult } from './CheckResult'

function CheckFlow({ plan }: { plan: CheckPlan }) {
  const { t } = useTranslation(['quiz', 'common'])
  const store = useProgressStoreApi()
  const stepTitle = useStepTitle()
  const step = stepOf(plan.of)
  const title = step ? stepTitle(step).primary : ''
  const trainer = useTrainer(plan.asks, { rounds: plan.length })
  const [learnedBefore] = useState(
    () => plan.marks !== null && selectIsLearned(plan.marks)(store.getState()),
  )
  const close = useGoBack({ to: '/' })
  const answered = trainer.run.answered.length
  const heading = usePageHeading<HTMLHeadingElement>(t('quiz:checkTitle', { title }))
  const progress = t('quiz:progress', { n: trainer.number, total: plan.length })

  return (
    <div className="flex flex-1 flex-col gap-5 pt-2 landscape-phone:gap-3">
      <header className="flex items-center gap-3">
        <RoundButton label={t('common:close')} icon={X} onClick={close} />
        <Progress
          value={answered}
          max={plan.length}
          aria-label={progress}
          getAriaValueText={() => progress}
          className="flex-1"
        />
        <MidiButton />
      </header>
      <h1 {...heading} className="text-2xl outline-none">
        {t('quiz:checkTitle', { title })}
      </h1>
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
  const pieces = useRepertoire()
  const [plan] = useState(() =>
    checkPlan(of, (skill) => selectAnswers(skill)(progress.getState()), pieces.piece),
  )
  return plan ? <CheckFlow plan={plan} /> : null
}

export function CheckPage() {
  const { of } = useSearch({ from: '/full-screen/check' })
  return of ? <CheckDraw key={of} of={of} /> : null
}
