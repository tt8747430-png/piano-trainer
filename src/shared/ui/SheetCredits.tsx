import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { CREDITS_GAP, type SheetCreditLines } from './sheet-credits'

/**
 * A score's credits printed under its title as a printed score has them (Flat's, MuseScore's): the
 * subtitle centred, the lyricist at the left, the composer over the arranger at the right; nothing
 * the learner did not write.
 */
export function SheetCredits({
  credits,
  className,
}: {
  credits: SheetCreditLines
  className?: string
}): ReactNode {
  const { subtitle, composer, lyricist, arranger } = credits
  const row = 'min-h-6 leading-6 wrap-break-word'
  return (
    <div
      data-slot="sheet-credits"
      style={{ paddingTop: CREDITS_GAP }}
      className={cn('flex flex-col font-display', className)}
    >
      {subtitle ? <p className={cn(row, 'text-center text-lg')}>{subtitle}</p> : null}
      {lyricist || composer || arranger ? (
        <div className="flex items-start justify-between gap-4 text-sm">
          <p className={cn(row, 'min-w-0 flex-1 text-start')}>{lyricist}</p>
          <div className="flex min-w-0 flex-1 flex-col items-end text-end">
            {composer ? <p className={row}>{composer}</p> : null}
            {arranger ? <p className={row}>{arranger}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
