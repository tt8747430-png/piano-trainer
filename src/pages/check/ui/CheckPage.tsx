import { useCanGoBack, useRouter, useSearch } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pathSteps, useStepTitle } from '@/entities/path'
import { useProgressStoreApi } from '@/entities/progress'
import { checkPlan, useQuiz, type CheckPlan } from '@/features/quiz'
import { RoundButton } from '@/shared/ui'
import { Progress } from '@/shared/ui/primitives/progress'
import { QuizBoard } from '@/widgets/quiz-board'
import { CheckResult } from './CheckResult'

function CheckFlow({ plan }: { plan: CheckPlan }) {
  const { t } = useTranslation(['quiz', 'common'])
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const store = useProgressStoreApi()
  const stepTitle = useStepTitle()
  const step = pathSteps().find((s) => s.id === plan.of)
  const title = step ? stepTitle(step.step).primary : ''
  const quiz = useQuiz(plan.config)
  const [learnedBefore] = useState(
    () => plan.marks !== null && store.getState().learned[plan.marks] !== undefined,
  )
  const [done, setDone] = useState(false)
  const close = () => (canGoBack ? router.history.back() : void router.navigate({ to: '/' }))
  const answered = quiz.state.asked - (quiz.state.result ? 0 : 1)

  return (
    <div className="flex flex-1 flex-col gap-5 pt-2">
      <header className="flex items-center gap-3">
        <RoundButton label={t('common:close')} icon={X} onClick={close} />
        <Progress
          value={answered}
          max={plan.length}
          aria-label={t('quiz:progress', {
            n: Math.min(answered + 1, plan.length),
            total: plan.length,
          })}
          className="flex-1"
        />
      </header>
      <h1 className="text-xl font-bold">{t('quiz:checkTitle', { title })}</h1>
      {done ? (
        <CheckResult
          plan={plan}
          correct={quiz.state.correct}
          title={title}
          newlyLearned={!learnedBefore}
          onDone={close}
        />
      ) : (
        <QuizBoard quiz={quiz} onDone={() => setDone(true)} />
      )}
    </div>
  )
}

export function CheckPage() {
  const { of } = useSearch({ from: '/full-screen/check' })
  const plan = useMemo(() => (of ? checkPlan(of) : null), [of])
  return plan ? <CheckFlow key={plan.of} plan={plan} /> : null
}
