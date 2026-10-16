import { Check, Eye, Piano, RotateCcw, X, type LucideIcon } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
import type { QuestionState } from '../model/lesson-question'

/** The question's one button at each stage, so a keyboard user's focus stays on it. */
interface QuestionAction {
  readonly label: string
  readonly icon: LucideIcon
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
      ? { label: t('question.answer'), icon: Piano, onClick: onOpen }
      : stage === 'choosing' || stage === 'wrong'
        ? { label: t('question.show'), icon: Eye, onClick: onReveal }
        : { label: t('question.again'), icon: RotateCcw, onClick: onRetry }
  const Icon = action.icon
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 card px-4 py-3 text-base"
    >
      <p id={id} className="min-w-0 flex-1 basis-64 font-semibold text-pretty">
        {localText(ask, locale)}
      </p>
      <div className="flex items-center gap-3">
        <p role="status" className="flex items-center gap-1.5 text-sm empty:sr-only">
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
            <span className="text-muted-foreground tabular-nums">
              {t('question.chosen', count)}
            </span>
          ) : null}
        </p>
        <Button variant="soft" className="rounded-full" onClick={action.onClick}>
          <Icon data-icon="inline-start" aria-hidden />
          {action.label}
        </Button>
      </div>
    </div>
  )
}
