import { Check, X } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
import type { QuizState } from '../model/lesson-quiz'

/**
 * A question answered on the lesson's keys (Pianote's pop quiz): Answer opens it, the keys tapped are
 * the answer, Check judges it; a wrong answer can be fixed or shown.
 */
export function QuizBlock({
  ask,
  stage,
  canCheck,
  onOpen,
  onCheck,
  onReveal,
  onRetry,
}: {
  ask: LocalText
  /** This quiz's stage, or `closed` while another is open or none is. */
  stage: NonNullable<QuizState>['stage'] | 'closed'
  canCheck: boolean
  onOpen: () => void
  onCheck: () => void
  onReveal: () => void
  onRetry: () => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-3 card p-4">
      <p id={id} className="font-semibold">
        {localText(ask, locale)}
      </p>
      <p role="status" className="flex items-center gap-2 empty:hidden">
        {stage === 'right' ? (
          <>
            <Check aria-hidden className="size-5 text-learned" />
            {t('quiz.right')}
          </>
        ) : stage === 'wrong' ? (
          <>
            <X aria-hidden className="size-5 text-destructive" />
            {t('quiz.wrong')}
          </>
        ) : stage === 'answer' ? (
          t('quiz.shown')
        ) : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {stage === 'closed' ? (
          <Button variant="soft" onClick={onOpen}>
            {t('quiz.answer')}
          </Button>
        ) : stage === 'answer' ? (
          <Button variant="soft" onClick={onRetry}>
            {t('quiz.again')}
          </Button>
        ) : (
          <>
            <Button disabled={!canCheck} onClick={onCheck}>
              {t('quiz.check')}
            </Button>
            {stage === 'wrong' ? (
              <Button variant="soft" onClick={onReveal}>
                {t('quiz.show')}
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
