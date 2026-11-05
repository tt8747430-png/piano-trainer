import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StepId } from '@/entities/step'
import { cn } from '@/shared/lib'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { useLearned } from './use-learned'

/**
 * A step's or a lesson's Learned toggle: a check waiting in soft ink; pressed, it wears the one
 * chosen fill (R15) and its check sits on the learned grass. `round`, it is the check alone in a screen's bar,
 * named by its tooltip, on the bar's soft round fill as every bar action.
 */
export function LearnedButton({
  step,
  round = false,
  bar = false,
  className,
}: {
  step: StepId
  round?: boolean
  /**
   * In a song's bar (R30 S4): the check and the word on the bar's soft fill, grass once learned; on a
   * phone the check alone, so the title keeps its room.
   */
  bar?: boolean
  /** Its size beside a larger button (a song's Practise), as that button's. */
  className?: string
}) {
  const { t } = useTranslation('common')
  const { learned, toggle } = useLearned(step)
  if (bar)
    return (
      <Toggle
        pressed={learned}
        onPressedChange={toggle}
        title={t('learned.done')}
        className="h-11 min-w-11 gap-1.5 rounded-pill border-transparent bg-muted/70 px-3.5 font-semibold text-foreground hover:bg-muted aria-pressed:bg-learned aria-pressed:text-learned-foreground max-sm:px-0"
      >
        <Check aria-hidden className="size-4" strokeWidth={2.75} />
        {/* A phone's bar keeps its room for the title: the check alone, named still. */}
        <span className="max-sm:sr-only">{t('learned.done')}</span>
      </Toggle>
    )
  if (round)
    return (
      <Toggle
        pressed={learned}
        onPressedChange={toggle}
        aria-label={t('learned.done')}
        title={t('learned.done')}
        className="size-11 rounded-pill border-transparent bg-muted/70 px-0 text-foreground hover:bg-muted aria-pressed:bg-learned aria-pressed:text-learned-foreground"
      >
        <Check aria-hidden strokeWidth={2.5} />
      </Toggle>
    )
  return (
    <Toggle
      pressed={learned}
      onPressedChange={toggle}
      className={cn('gap-2 text-muted-foreground', className)}
    >
      <span
        aria-hidden
        className="grid size-5 place-items-center rounded-pill border border-current group-aria-pressed/toggle:border-transparent group-aria-pressed/toggle:bg-learned group-aria-pressed/toggle:text-learned-foreground"
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      {t('learned.done')}
    </Toggle>
  )
}
