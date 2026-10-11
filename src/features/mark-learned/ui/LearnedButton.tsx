import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LearnedId } from '@/entities/progress'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { useLearned } from './use-learned'

/**
 * A step's or a lesson's Learned toggle: a check waiting in soft ink; pressed, it wears the learned
 * paint's wash and its check sits on the paint.
 */
export function LearnedButton({ step }: { step: LearnedId }) {
  const { t } = useTranslation('common')
  const { learned, toggle } = useLearned(step)
  return (
    <Toggle
      pressed={learned}
      onPressedChange={toggle}
      className="gap-2 text-muted-foreground aria-pressed:border-transparent aria-pressed:bg-paint-grass aria-pressed:text-on-paint-grass"
    >
      <span
        aria-hidden
        className="grid size-5 place-items-center rounded-full border border-current group-aria-pressed/toggle:border-transparent group-aria-pressed/toggle:bg-learned group-aria-pressed/toggle:text-learned-foreground"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      {t('learned.done')}
    </Toggle>
  )
}
