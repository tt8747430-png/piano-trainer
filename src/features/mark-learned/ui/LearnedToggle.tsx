import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StepId } from '@/entities/path'
import { selectIsLearned, useProgress, useProgressStoreApi } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { markLearned } from '../mark-learned'
import { unmarkLearned } from '../unmark-learned'

/** Marks a step learned or unmarks it: a round check on rows, a labelled button on a screen. */
export function LearnedToggle({
  step,
  title,
  variant = 'icon',
}: {
  step: StepId
  title: string
  variant?: 'icon' | 'text'
}) {
  const { t } = useTranslation('common')
  const store = useProgressStoreApi()
  const learned = useProgress(selectIsLearned(step))
  const toggle = () => (learned ? unmarkLearned(store, step) : markLearned(store, step, new Date()))
  const check = (
    <span
      aria-hidden
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-full ring-2 transition-colors duration-200 ease-out ring-inset',
        learned ? 'bg-primary text-primary-foreground ring-primary' : 'ring-border',
      )}
    >
      {learned ? <Check className="size-4" strokeWidth={3} /> : null}
    </span>
  )
  if (variant === 'text') {
    return (
      <Button variant="soft" aria-pressed={learned} onClick={toggle}>
        {check}
        {t('learned.done')}
      </Button>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={learned}
      aria-label={t('learned.toggle', { title })}
      onClick={toggle}
      className="grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
    >
      {check}
    </button>
  )
}
