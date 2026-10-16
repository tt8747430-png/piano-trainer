import { Check, CircleHelp, Eye, Piano, RotateCcw, X, type LucideIcon } from 'lucide-react'
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
 * A question answered on the lesson's keys (Pianote's pop quiz), marked with a question's sign: Answer
 * opens it (ringed while open), and the keys tapped are judged as soon as they are as many notes as
 * the answer's, each chosen filling one of its dots; a wrong
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
  const open = stage !== 'closed'
  return (
    <div
      role="group"
      aria-labelledby={id}
      data-open={open || undefined}
      className="flex flex-col gap-3 card p-4 text-base transition-shadow duration-200 ease-out data-open:ring-2 data-open:ring-ring"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-paint-lilac text-on-paint-lilac"
        >
          <CircleHelp className="size-5" />
        </span>
        <p id={id} className="min-w-0 flex-1 pt-2 font-semibold text-pretty">
          {localText(ask, locale)}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pl-13">
        <p role="status" className="flex min-h-6 items-center gap-2 text-sm empty:sr-only">
          {stage === 'right' ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-learned">
              <Check aria-hidden className="size-5" strokeWidth={3} />
              {t('question.right')}
            </span>
          ) : stage === 'wrong' ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-destructive">
              <X aria-hidden className="size-5" strokeWidth={3} />
              {t('question.wrong')}
            </span>
          ) : stage === 'answer' ? (
            t('question.shown')
          ) : stage === 'choosing' ? (
            <>
              <Piano aria-hidden className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t('question.onKeys')}</span>
              <span aria-hidden className="flex gap-1">
                {Array.from({ length: count.total }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < count.chosen
                        ? 'size-2.5 rounded-full bg-primary'
                        : 'size-2.5 rounded-full border border-input'
                    }
                  />
                ))}
              </span>
              <span className="sr-only">{t('question.chosen', count)}</span>
            </>
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
