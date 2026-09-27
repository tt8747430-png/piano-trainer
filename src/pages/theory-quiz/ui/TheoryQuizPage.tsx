import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectQuizStats, useProgress, useProgressStoreApi } from '@/entities/progress'
import { selectQuizChoice, useSettings } from '@/entities/settings'
import {
  isTheoryQuiz,
  myGaps,
  theoryQuizConfig,
  useQuiz,
  type QuizConfig,
  type QuizMode,
  type TheoryQuiz,
} from '@/features/quiz'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { QuizBoard } from '@/widgets/quiz-board'
import { QuizChoiceSheet } from '@/widgets/quiz-choice'

function Quiz({ config }: { config: QuizConfig }) {
  return <QuizBoard quiz={useQuiz(config)} />
}

/** A mode over the chosen families or scales; a new choice starts it again. */
function ChoiceQuiz({ mode }: { mode: QuizMode }) {
  const choice = useSettings(selectQuizChoice)
  const config = theoryQuizConfig(mode, choice, [])
  return <Quiz key={config.scope.skills.join(',')} config={config} />
}

/**
 * My gaps, read once when the quiz opens: an answer that turns a gap known must not restart the
 * quiz under the learner.
 */
function GapsQuiz({ onWholeQuiz }: { onWholeQuiz: () => void }) {
  const { t } = useTranslation('quiz')
  const progress = useProgressStoreApi()
  const choice = useSettings(selectQuizChoice)
  const [gaps] = useState(() => {
    const { answers, practised } = progress.getState()
    return myGaps(answers, practised)
  })
  if (gaps.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-lg">{t('gaps.none')}</p>
        <Button variant="soft" onClick={onWholeQuiz}>
          {t('gaps.whole')}
        </Button>
      </div>
    )
  }
  return <Quiz config={theoryQuizConfig('gaps', choice, gaps)} />
}

/** A Theory quiz, named by the path: the quiz Practice opened. */
export function TheoryQuizPage() {
  const { quiz } = useParams({ from: '/shell/practice/quiz/$quiz' })
  return isTheoryQuiz(quiz) ? <QuizScreen key={quiz} quiz={quiz} /> : null
}

/** The quiz under its name, with a way back to Practice, its stats and its choice of chords and scales. */
function QuizScreen({ quiz }: { quiz: TheoryQuiz }) {
  const { t } = useTranslation(['quiz', 'common'])
  const navigate = useNavigate()
  const back = useGoBack({ to: '/practice' })
  const stats = useProgress(selectQuizStats)
  const toWholeQuiz = () =>
    void navigate({ to: '/practice/quiz/$quiz', params: { quiz: 'build-chord' }, replace: true })

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t(`quiz:modes.${quiz}`)}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      {quiz === 'gaps' ? <GapsQuiz onWholeQuiz={toWholeQuiz} /> : <ChoiceQuiz mode={quiz} />}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <dl className="flex gap-5 text-sm text-muted-foreground">
          <div>
            <dt className="inline">{t('quiz:stats.correct')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">
              {stats.correct} / {stats.total}
            </dd>
          </div>
          <div>
            <dt className="inline">{t('quiz:stats.streak')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">{stats.streak}</dd>
          </div>
          <div>
            <dt className="inline">{t('quiz:stats.best')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">{stats.best}</dd>
          </div>
        </dl>
        {quiz === 'gaps' ? null : <QuizChoiceSheet mode={quiz} />}
      </div>
    </div>
  )
}
