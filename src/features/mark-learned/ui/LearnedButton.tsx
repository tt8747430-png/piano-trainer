import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StepId } from '@/entities/step'
import { cn } from '@/shared/lib'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { useLearned } from './use-learned'

/**
 * A step's or a lesson's Learned toggle: a check waiting in soft ink; pressed, its check sits on the
 * learned grass. In a screen's bar it says its word (canvas 164: a check alone left the learner
 * guessing), on the bar's glass while off, in the grass wash once learned, as the boards' LEARNEDT.
 */
export function LearnedButton({
  step,
  bar = false,
  worded = false,
  className,
}: {
  step: StepId
  /**
   * In a screen's bar (the board's LEARNEDT): the word on the bar's glass, the check and the grass wash once
   * learned; on a phone the check alone, so a title in the bar keeps its room, unless `worded`.
   */
  bar?: boolean
  /** The word on a phone too: a bar with no title in it (a lesson's). */
  worded?: boolean
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
        className={cn(
          // The board's LEARNEDT: the bar's glass word, a 44 capsule 16 in, the grass wash once learned.
          'glass h-11 min-w-11 gap-2 rounded-full border-0 px-4 text-subhead font-semibold text-foreground hover:brightness-97 aria-pressed:bg-paint-grass! aria-pressed:text-on-paint-grass!',
          !worded && 'max-sm:px-0',
        )}
      >
        {/* The tick is earned (loop round 46): off it says Learned alone, unless the check is all a
            phone's bar shows. */}
        <Check
          aria-hidden
          className={cn('size-4', !learned && (worded ? 'hidden' : 'sm:hidden'))}
          strokeWidth={2.75}
        />
        {/* A phone's bar keeps its room for the title: the check alone, named still. */}
        <span className={cn(!worded && 'max-sm:sr-only')}>{t('learned.done')}</span>
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
