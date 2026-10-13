import { Check, X } from 'lucide-react'
import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
import type { QuestionState } from '../model/lesson-question'

/** The question's first button at each stage: one button, so a keyboard user's focus stays on it. */
interface QuestionAction {
  readonly variant: 'soft' | 'default'
  readonly label: string
  readonly disabled: boolean
  onClick(): void
}

/**
 * A question answered on the lesson's keys (Pianote's pop quiz): Answer opens it, the keys tapped are
 * the answer, Check judges it; a wrong answer can be fixed or shown. Its first button stays one
 * button through every stage, so a keyboard user's focus stays on it; the verdict's region stays in
 * the page, empty, so its words are heard when they come.
 */
export function QuestionBlock({
  ask,
  stage,
  canCheck,
  onOpen,
  onCheck,
  onReveal,
  onRetry,
}: {
  ask: LocalText
  /** This question's stage, or `closed` while another is open or none is. */
  stage: NonNullable<QuestionState>['stage'] | 'closed'
  canCheck: boolean
  onOpen: () => void
  onCheck: () => void
  onReveal: () => void
  onRetry: () => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const first = useRef<HTMLButtonElement>(null)
  const action: QuestionAction =
    stage === 'closed'
      ? { variant: 'soft', label: t('question.answer'), disabled: false, onClick: onOpen }
      : stage === 'answer'
        ? { variant: 'soft', label: t('question.again'), disabled: false, onClick: onRetry }
        : { variant: 'default', label: t('question.check'), disabled: !canCheck, onClick: onCheck }
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-3 card p-4">
      <p id={id} className="font-semibold">
        {localText(ask, locale)}
      </p>
      <p role="status" className="flex items-center gap-2 empty:sr-only">
        {stage === 'right' ? (
          <>
            <Check aria-hidden className="size-5 text-learned" />
            {t('question.right')}
          </>
        ) : stage === 'wrong' ? (
          <>
            <X aria-hidden className="size-5 text-destructive" />
            {t('question.wrong')}
          </>
        ) : stage === 'answer' ? (
          t('question.shown')
        ) : null}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          ref={first}
          variant={action.variant}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
        {stage === 'wrong' ? (
          <Button
            variant="soft"
            onClick={() => {
              onReveal()
              // Show the answer goes as the answer shows: the focus goes back to the first button.
              first.current?.focus()
            }}
          >
            {t('question.show')}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
