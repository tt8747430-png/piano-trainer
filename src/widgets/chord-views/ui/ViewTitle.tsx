import type { ScoreHeader } from '@/entities/piece'
import { hasCredits, SheetCredits, SheetTitle } from '@/shared/ui'

/**
 * The head of a view that is not the sheet (loop round 61, the Player's boards): the score's title
 * and, under it, its credits as the sheet prints them (Words: John Newton · Music: New Britain).
 */
export function ViewTitle({
  title,
  credits,
}: {
  title: string
  credits?: ScoreHeader | undefined
}) {
  return (
    <div data-area="title" className="flex flex-col items-center gap-1.5">
      <SheetTitle title={title} place="lines" />
      {credits && hasCredits(credits) ? <SheetCredits credits={credits} align="center" /> : null}
    </div>
  )
}
