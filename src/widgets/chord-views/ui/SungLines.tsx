import type { CellBar } from '@/features/practice'
import { cn } from '@/shared/lib'
import { lineProgress, lineWords, type LyricLine } from '../model/lyric-lines'

/**
 * The words under the Diagrams view's strip (ADR 0099): the line being sung in the body face, bold,
 * with a thin bar under it that fills as the line goes, then the next line sung, muted; where the
 * music is between lines that sing, the next alone. A room too short for both shows the line the
 * music is in alone (`diagrams-view`); on a phone on its side, beside the chords, on one line.
 */
export function SungLines({
  sung,
  coming,
  bars,
  at,
  className,
}: {
  /** The line the music is in, where it sings. */
  sung: LyricLine | undefined
  /** The next line that sings. */
  coming: LyricLine | undefined
  /** The bars as written, in beats. */
  bars: readonly CellBar[]
  /** Where the music is: its bar as written and its beat. */
  at: { readonly written: number; readonly beat: number }
  className?: string
}) {
  if (!sung && !coming) return null
  return (
    <div
      data-area="words"
      className={cn(
        'flex flex-col gap-2 text-lg sm:text-xl landscape-phone:gap-1 landscape-phone:text-base landscape-phone:leading-snug',
        className,
      )}
    >
      {sung ? (
        <>
          <p className="font-semibold text-foreground landscape-phone:truncate">
            {lineWords(sung)}
          </p>
          <div aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full origin-left rounded-full bg-foreground transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${lineProgress(sung, bars, at)})` }}
            />
          </div>
        </>
      ) : null}
      {coming ? (
        <p data-slot="coming-line" className="text-muted-foreground landscape-phone:truncate">
          {lineWords(coming)}
        </p>
      ) : null}
    </div>
  )
}
