import { useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { stepOf, type StepId } from '@/entities/step'
import { selectAnswers, selectIsLearned, useProgressStoreApi } from '@/entities/progress'
import { checkPlan, useTrainer, type CheckPlan } from '@/features/trainer'
import { useUp } from '@/shared/lib'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { ProgressBar, RoundButton, ScreenHeader } from '@/shared/ui'
import { useStepTitle } from '@/widgets/curriculum'
import { TrainerBoard } from '@/widgets/trainer-board'
import { CheckResult } from './CheckResult'

function CheckFlow({ plan, again }: { plan: CheckPlan; again: () => void }) {
  const { t } = useTranslation(['quiz', 'common'])
  const store = useProgressStoreApi()
  const stepTitle = useStepTitle()
  const step = stepOf(plan.of)
  const title = step ? stepTitle(step).primary : ''
  const trainer = useTrainer(plan.asks, { rounds: plan.length })
  const [learnedBefore] = useState(() => selectIsLearned(plan.of)(store.getState()))
  const close = useUp()
  // Escape closes, as it closes the Player.
  useShortcuts(t('quiz:shortcuts.group'), [
    { label: t('quiz:shortcuts.close'), combo: { key: 'Escape' }, run: close },
  ])
  const answered = trainer.run.answered.length
  const right = trainer.run.answered.filter((round) => round.correct).length
  const progress = t('quiz:progress', { n: trainer.number, total: plan.length })

  // The screen the shell's main leaves, beside the sidebar on a laptop (CheckLaptop): its acts 6 over
  // the home indicator on a phone (main's foot padding less 18), the keys down to a laptop window's foot.
  return (
    <div className="flex min-h-screen-free flex-col gap-3 [--foot-pad:--spacing(1.5)]! -mb-4.5 landscape-phone:gap-3 lg:gap-4 lg:[--foot-pad:0px]! lg:-mb-12">
      {/* As the Check board: the kit's bar, Close and the check's name (the laptop's 30 bold),
          then the rounds' bar and where it stands. */}
      <ScreenHeader
        title={t('quiz:checkTitle', { title })}
        back={<RoundButton label={t('common:close')} icon={X} onClick={close} />}
      />
      {/* The results keep the bar alone, as the board's. */}
      {trainer.summary ? null : (
        <div className="mx-auto -mt-2 flex w-full max-w-190 items-center gap-3">
          {/* The run's progress is grass, 8 tall, as the Check's board and every course's. */}
          <ProgressBar
            done={answered}
            total={plan.length}
            label={progress}
            said={progress}
            className="h-2 min-h-2"
          />
          <span
            aria-hidden
            className="shrink-0 text-sm/[normal] text-muted-foreground tabular-nums"
          >
            {progress}
          </span>
        </div>
      )}
      {/* What it has come to so far, as the Check board's two chips: right in grass, wrong quiet. */}
      {trainer.summary ? null : (
        <p className="mx-auto flex w-full max-w-190 gap-2 text-sm/[normal] font-semibold tabular-nums">
          <span className="rounded-xl bg-paint-grass px-3 py-1 text-on-paint-grass">
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
          onAgain={again}
          onDone={close}
        />
      ) : (
        <TrainerBoard trainer={trainer} asks={plan.asks} />
      )}
    </div>
  )
}

/** The check's questions, drawn once from the evidence as it opens: each skill as often as it still needs. */
function CheckDraw({ of, again }: { of: StepId; again: () => void }) {
  const progress = useProgressStoreApi()
  const [plan] = useState(() => checkPlan(of, (skill) => selectAnswers(skill)(progress.getState())))
  return plan ? <CheckFlow plan={plan} again={again} /> : null
}

export function CheckPage() {
  const { of } = useSearch({ from: '/shell/check' })
  // Again draws the check afresh from the evidence as it now stands.
  const [attempt, setAttempt] = useState(0)
  return of ? (
    <CheckDraw key={`${of}:${attempt}`} of={of} again={() => setAttempt((n) => n + 1)} />
  ) : null
}
