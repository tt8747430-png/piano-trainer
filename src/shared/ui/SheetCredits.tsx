import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { CREDITS_GAP, type SheetCreditLines } from './sheet-credits'

/**
 * A score's credits printed under its title as a printed score has them (Flat's, MuseScore's): the
 * subtitle centred with the hymn tune's name under it in capitals, the lyricist over the translator
 * at the left, the composer over the arranger at the right; nothing the learner did not write.
 */
export function SheetCredits({
  credits,
  className,
}: {
  credits: SheetCreditLines
  className?: string
}): ReactNode {
  const { subtitle, composer, lyricist, arranger, translator, tune } = credits
  const row = 'min-h-6 leading-6 wrap-break-word'
  return (
    <div
      data-slot="sheet-credits"
      style={{ paddingTop: CREDITS_GAP }}
      className={cn('flex flex-col font-display', className)}
    >
      {subtitle ? <p className={cn(row, 'text-center text-lg')}>{subtitle}</p> : null}
      {tune ? (
        <p className={cn(row, 'text-center text-sm uppercase tracking-wide')}>{tune}</p>
      ) : null}
      {lyricist || translator || composer || arranger ? (
        <div className="flex items-start justify-between gap-4 text-sm">
          <div className="flex min-w-0 flex-1 flex-col items-start text-start">
            {lyricist ? <p className={row}>{lyricist}</p> : null}
            {translator ? <p className={row}>{translator}</p> : null}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-end text-end">
            {composer ? <p className={row}>{composer}</p> : null}
            {arranger ? <p className={row}>{arranger}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
