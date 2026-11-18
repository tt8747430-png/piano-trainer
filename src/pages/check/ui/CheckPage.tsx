import { useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { stepOf, type StepId } from '@/entities/step'
import { selectAnswers, selectIsLearned, useProgressStoreApi } from '@/entities/progress'
import { MidiButton } from '@/features/connect-midi'
import { checkPlan, useTrainer, type CheckPlan } from '@/features/trainer'
import { useUp } from '@/shared/lib'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { FloatingHost, RoundButton, usePageHeading } from '@/shared/ui'
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
  const [learnedBefore] = useState(() => selectIsLearned(plan.of)(store.getState()))
  const close = useUp()
  // Escape closes, as it closes the Player: the Check is full screen too.
  useShortcuts(t('quiz:shortcuts.group'), [
    { label: t('quiz:shortcuts.close'), combo: { key: 'Escape' }, run: close },
  ])
  const answered = trainer.run.answered.length
  const right = trainer.run.answered.filter((round) => round.correct).length
  const heading = usePageHeading<HTMLHeadingElement>(t('quiz:checkTitle', { title }))
  const progress = t('quiz:progress', { n: trainer.number, total: plan.length })

  // The round's one action floats in the capsule, as on a trainer's screen: this screen hosts it.
  return (
    <FloatingHost screen="check">
      <div className="flex flex-1 flex-col gap-5 pt-2 pb-safe-2 landscape-phone:gap-3">
        {/* As the Check board: Close and the check's name in the bar, then the rounds' bar and
            where it stands. */}
        <header className="flex items-center gap-2">
          <RoundButton label={t('common:close')} icon={X} onClick={close} />
          <h1
            {...heading}
            className="min-w-0 flex-1 truncate font-sans text-base font-semibold outline-none"
          >
            {t('quiz:checkTitle', { title })}
          </h1>
          <MidiButton />
        </header>
        <div className="mx-auto -mt-2 flex w-full max-w-190 items-center gap-3 px-1">
          <Progress
            value={answered}
            max={plan.length}
            aria-label={progress}
            getAriaValueText={() => progress}
            // The run's progress is grass, 8 tall, as the Check's board and every course's.
            className="flex-1 [&_[data-slot=progress-indicator]]:bg-learned [&_[data-slot=progress-track]]:h-2"
          />
          <span aria-hidden className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {progress}
          </span>
        </div>
        {/* What it has come to so far, as the Check board's two chips: right in grass, wrong quiet. */}
        {trainer.summary ? null : (
          <p className="mx-auto -mt-2 flex w-full max-w-190 gap-2 px-1 text-sm font-semibold tabular-nums">
            <span className="rounded-xl bg-learned/15 px-3 py-1 text-learned">
              {t('quiz:tally.right', { count: right })}
            </span>
            <span className="rounded-xl bg-muted px-3 py-1 text-muted-foreground">
              {t('quiz:tally.wrong', { count: answered - right })}
            </span>
          </p>
        )}
        {trainer.summary ? (
          <CheckResult
            plan={plan}
            correct={right}
            title={title}
            newlyLearned={!learnedBefore}
            onDone={close}
          />
        ) : (
          <TrainerBoard trainer={trainer} asks={plan.asks} />
        )}
      </div>
    </FloatingHost>
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
