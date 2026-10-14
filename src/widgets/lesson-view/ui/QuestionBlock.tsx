import { Check, X } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
import type { QuestionState } from '../model/lesson-question'

/** The question's one button at each stage, so a keyboard user's focus stays on it. */
interface QuestionAction {
  readonly label: string
  onClick(): void
}

/**
 * A question answered on the lesson's keys (Pianote's pop quiz): Answer opens it, and the keys tapped
 * are judged as soon as they are as many notes as the answer's, counted as they are chosen; a wrong
 * answer can be fixed on the keys or shown. Its button stays one button through every stage, so a
 * keyboard user's focus stays on it; the verdict's region stays in the page, so its words are heard
 * when they come.
 */
export function QuestionBlock({
  ask,
  stage,
  count,
  onOpen,
  onReveal,
  onRetry,
}: {
  ask: LocalText
  /** This question's stage, or `closed` while another is open or none is. */
  stage: NonNullable<QuestionState>['stage'] | 'closed'
  /** The notes chosen, and how many the answer has. */
  count: { readonly chosen: number; readonly total: number }
  onOpen: () => void
  onReveal: () => void
  onRetry: () => void
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const action: QuestionAction =
    stage === 'closed'
      ? { label: t('question.answer'), onClick: onOpen }
      : stage === 'choosing' || stage === 'wrong'
        ? { label: t('question.show'), onClick: onReveal }
        : { label: t('question.again'), onClick: onRetry }
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
        ) : stage === 'choosing' ? (
          <span className="text-muted-foreground tabular-nums">{t('question.chosen', count)}</span>
        ) : null}
      </p>
      <Button variant="soft" className="self-start" onClick={action.onClick}>
        {action.label}
      </Button>
    </div>
  )
}
