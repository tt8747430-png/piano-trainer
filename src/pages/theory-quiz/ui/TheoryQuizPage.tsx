import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectQuizStats, useProgress, useProgressStoreApi } from '@/entities/progress'
import { selectQuizChoice, useSettings } from '@/entities/settings'
import {
  myGaps,
  THEORY_QUIZZES,
  theoryQuizConfig,
  useQuiz,
  type QuizConfig,
  type QuizMode,
  type TheoryQuiz,
} from '@/features/quiz'
import { Segmented } from '@/shared/ui'
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
 * My gaps, read once when the tab opens: an answer that turns a gap known must not restart the
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

export function TheoryQuizPage() {
  const { t } = useTranslation('quiz')
  const { mode } = useSearch({ from: '/shell/theory/quiz' })
  const navigate = useNavigate({ from: '/theory/quiz' })
  const stats = useProgress(selectQuizStats)
  const setMode = (next: TheoryQuiz) => void navigate({ search: { mode: next }, replace: true })

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label={t('modes.label')}
        value={mode}
        options={THEORY_QUIZZES.map((quiz) => ({ value: quiz, label: t(`modes.${quiz}`) }))}
        onChange={setMode}
      />
      {mode === 'gaps' ? (
        <GapsQuiz onWholeQuiz={() => setMode('build-chord')} />
      ) : (
        <ChoiceQuiz key={mode} mode={mode} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <dl className="flex gap-5 text-sm text-muted-foreground">
          <div>
            <dt className="inline">{t('stats.correct')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">
              {stats.correct} / {stats.total}
            </dd>
          </div>
          <div>
            <dt className="inline">{t('stats.streak')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">{stats.streak}</dd>
          </div>
          <div>
            <dt className="inline">{t('stats.best')} </dt>
            <dd className="inline font-semibold text-foreground tabular-nums">{stats.best}</dd>
          </div>
        </dl>
        {mode === 'gaps' ? null : <QuizChoiceSheet mode={mode} />}
      </div>
    </div>
  )
}
