import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { CREDITS_GAP, type SheetCreditLines } from './sheet-credits'
import { useCreditLine } from './use-credit-line'

/**
 * A score's credits printed under its title, as the canvas prints them (the Player's and the
 * editor's title block): its subtitle centred where it has one, then one quiet line naming who wrote
 * it, "Words: John Newton · Music: New Britain", centred over lines down the screen and at the right
 * over a page; nothing the learner did not write.
 */
export function SheetCredits({
  credits,
  align = 'end',
  className,
}: {
  credits: SheetCreditLines
  align?: 'center' | 'end'
  className?: string
}): ReactNode {
  const { subtitle } = credits
  const line = useCreditLine(credits)
  return (
    <div
      data-slot="sheet-credits"
      style={{ paddingTop: CREDITS_GAP }}
      className={cn('flex flex-col gap-0.5', className)}
    >
      {subtitle ? (
        <p className="text-center font-display text-lg leading-6 text-balance wrap-break-word">
          {subtitle}
        </p>
      ) : null}
      {line ? (
        <p
          // Centred over lines down the screen at the boards' 13, 15 from 640px; a page's at its print size.
          className={cn(
            'font-sans text-pretty wrap-break-word text-muted-foreground',
            align === 'center'
              ? 'text-center text-footnote/[normal] sm:text-subhead/[normal]'
              : 'text-end text-footnote leading-snug',
          )}
        >
          {line}
        </p>
      ) : null}
    </div>
  )
}
