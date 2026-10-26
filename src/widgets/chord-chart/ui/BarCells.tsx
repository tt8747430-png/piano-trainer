import { cn } from '@/shared/lib'
import { CellChords } from './CellChords'

/**
 * What a bar of a chart's line holds (ADR 0099), on the screen and in print: a cell a beat, the
 * chords starting in each, its number small in its first cell's corner, and under its cells its method
 * labels or short length. The beat sounding is filled (`sounding`); the bar sounding (`playing`) and
 * the loop's (`looped`) wear their washes; else a pointer over the bar washes it.
 */
export function BarCells({
  number,
  cells,
  notes,
  sounding = null,
  playing = false,
  looped = false,
}: {
  number: number
  /** Each beat's chords, those starting in it. */
  cells: readonly (readonly string[])[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  sounding?: number | null
  playing?: boolean
  looped?: boolean
}) {
  return (
    <>
      {cells.map((chords, beat) => (
        <span
          key={beat}
          aria-hidden
          data-beat={beat}
          data-sounding={sounding === beat ? '' : undefined}
          data-looped={looped ? '' : undefined}
          className={cn(
            '@container relative flex h-12 items-end overflow-visible border-l border-hairline px-1 pb-1.5 first:border-l-0 sm:h-14 landscape-phone:h-11',
            sounding === beat
              ? 'bg-foreground text-background'
              : playing
                ? 'bg-secondary text-secondary-foreground'
                : looped
                  ? 'bg-ring/15'
                  : 'group-hover/bar:bg-muted/60',
          )}
        >
          {beat === 0 ? (
            <span className="absolute top-1 left-1 text-xs leading-none tabular-nums opacity-60">
              {number}
            </span>
          ) : null}
          <CellChords symbols={chords} className="relative z-10" />
        </span>
      ))}
      {notes.length > 0 ? (
        // Ends in an ellipsis where a narrow bar cannot hold it all; its name holds it whole.
        <span
          aria-hidden
          className="col-span-full truncate px-1.5 pb-1 text-xs text-muted-foreground"
        >
          {notes.join(' · ')}
        </span>
      ) : null}
    </>
  )
}
