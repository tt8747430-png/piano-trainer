import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LiveKeyboard } from '@/features/live-keyboard'
import { answerKeys, quizKeyboardRange, targetKeys, type Quiz } from '@/features/quiz'
import { useScaleName } from '@/shared/i18n'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * One question at a time: the prompt, the keyboard, the answer, and one action. After the last
 * question of a bounded quiz, Next calls `onFinish`.
 */
export function QuizBoard({ quiz, onFinish }: { quiz: Quiz; onFinish?: () => void }) {
  const { t } = useTranslation(['quiz', 'theory', 'common'])
  const nameScale = useScaleName()
  const { question, selected, result } = quiz.state
  if (!question) return null

  const building = question.mode !== 'name-chord'
  // Building a chord or scale: keys are chosen until the answer is checked.
  const choosing = building && !result
  const next = quiz.finished ? onFinish : quiz.next
  const scaleName = question.mode === 'build-scale' ? nameScale(question.root, question.kind) : ''
  const answerName =
    question.mode === 'build-scale'
      ? scaleName
      : `${question.symbol} · ${t(`theory:quality.${question.quality}`)}`
  const prompt =
    question.mode === 'build-chord'
      ? t('quiz:prompt.buildChord', { symbol: question.symbol })
      : question.mode === 'name-chord'
        ? t('quiz:prompt.nameChord')
        : t('quiz:prompt.buildScale', { scale: scaleName })
  // Building shows the chosen keys, then the answer on them; naming shows the chord it plays.
  const answer = result && building ? answerKeys(question, selected) : null

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <h2 className="min-w-0 flex-1 text-4xl font-bold tracking-tight text-balance">{prompt}</h2>
        {question.mode === 'name-chord' ? (
          <RoundButton label={t('quiz:playAgain')} icon={Volume2} onClick={quiz.hear} />
        ) : null}
      </div>

      <LiveKeyboard
        label={t('common:keyboard')}
        range={quizKeyboardRange(question)}
        className="h-44"
        selectable={choosing}
        selected={choosing ? new Set(selected) : undefined}
        lit={building ? undefined : new Set(targetKeys(question))}
        marks={answer?.marks}
        outlined={answer?.outlined}
        wrong={answer?.wrong}
        onKeyPress={choosing ? quiz.toggleKey : undefined}
      />

      <p aria-live="polite" className="min-h-7 text-lg font-semibold">
        {result
          ? result.correct
            ? t('quiz:right')
            : t('quiz:itWas', { answer: answerName })
          : null}
      </p>

      {question.mode === 'name-chord' && !result ? (
        <div role="group" aria-label={t('quiz:answers')} className="grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <Button key={option} variant="outline" size="lg" onClick={() => quiz.choose(option)}>
              {option}
            </Button>
          ))}
        </div>
      ) : null}

      {choosing ? (
        <div className="flex gap-3">
          {selected.length > 0 ? (
            <Button variant="soft" size="pill" onClick={quiz.clear}>
              {t('quiz:clear')}
            </Button>
          ) : null}
          <Button
            size="pill"
            className="flex-1"
            disabled={selected.length === 0}
            onClick={quiz.check}
          >
            {t('quiz:check')}
          </Button>
        </div>
      ) : null}

      {result && next ? (
        <Button size="pill" onClick={next}>
          {t('quiz:next')}
        </Button>
      ) : null}
    </section>
  )
}
