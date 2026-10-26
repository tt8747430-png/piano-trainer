import { cn } from '@/shared/lib'
import type { BarWords } from '../model/bar-words'
import { CellChords } from './CellChords'

/** No words under a bar. */
const NO_WORDS: BarWords = []

/** The beats a cell's chords have room in: their own and the empty ones after it in its bar. */
function roomAfter(cells: readonly (readonly string[])[], beat: number): number {
  const next = cells.findIndex((chords, at) => at > beat && chords.length > 0)
  return (next < 0 ? cells.length : next) - beat
}

/**
 * What a bar of a chart's line holds (ADR 0099), on the screen and in print: a cell a beat, the
 * chords starting in each, its number small in its first cell's corner, and under its cells its method
 * labels or a changed meter. The beat sounding is filled (`sounding`); the bar sounding (`playing`)
 * and the loop's (`looped`) wear their washes; else a pointer over the bar washes it. Under its cells
 * the words sung in it (`words`, ADR 0108), small, each verse a row, a beat's from its cell to the next
 * sung beat's, wrapping there: never cut.
 */
export function BarCells({
  number,
  cells,
  notes,
  words = NO_WORDS,
  sounding = null,
  playing = false,
  looped = false,
}: {
  number: number
  /** Each beat's chords, those starting in it. */
  cells: readonly (readonly string[])[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  /** Its words, verse by verse, under the beats they are sung on. */
  words?: BarWords
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
          <CellChords symbols={chords} span={roomAfter(cells, beat)} className="relative z-10" />
        </span>
      ))}
      {words.map((verse, index) =>
        verse.length === 0 ? null : (
          <span
            key={index}
            aria-hidden
            data-verse={index}
            className={cn(
              'col-span-full grid px-1 pt-0.5 text-xs leading-tight hyphens-auto break-words last-of-type:pb-1',
              index > 0 && 'text-muted-foreground',
            )}
            style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
          >
            {verse.map(({ beat, text }, at) => (
              <span
                key={beat}
                className="min-w-0 pe-1"
                style={{ gridColumn: `${beat + 1} / ${(verse[at + 1]?.beat ?? -2) + 1}` }}
              >
                {text}
              </span>
            ))}
          </span>
        ),
      )}
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
