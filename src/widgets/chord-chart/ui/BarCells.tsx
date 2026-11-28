import { cn } from '@/shared/lib'
import type { BarWords } from '../model/bar-words'
import { CellChords, type ChordFace } from './CellChords'

/** No words under a bar. */
const NO_WORDS: BarWords = []

/** The beats a cell's chords have room in: their own and the empty ones after it in its bar. */
function roomAfter(cells: readonly (readonly string[])[], beat: number): number {
  const next = cells.findIndex((chords, at) => at > beat && chords.length > 0)
  return (next < 0 ? cells.length : next) - beat
}

/** The beat whose chord a beat holds: the last beat at or before it that starts chords, else its own. */
function heldBy(cells: readonly (readonly string[])[], beat: number): number {
  for (let at = beat; at >= 0; at--) if ((cells[at]?.length ?? 0) > 0) return at
  return beat
}

/**
 * What a bar of a chart's line holds (ADR 0108), on the screen and in print: a cell a beat, the
 * chords starting in each, its number small in its first cell's corner, and under its cells its method
 * labels or a changed meter. The chord sounding is filled over the beats it holds, its beat (`sounding`) marked; the bar sounding (`playing`)
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
  face,
}: {
  /** Its number as printed (`printedBar`): none for a pickup. */
  number: number | null
  /** Each beat's chords, those starting in it. */
  cells: readonly (readonly string[])[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  /** Its words, verse by verse, under the beats they are sung on. */
  words?: BarWords
  sounding?: number | null
  playing?: boolean
  looped?: boolean
  /** Its chords' face: the Player's Grid or a song's chart. */
  face: ChordFace
}) {
  // The chord sounding is filled over all the beats it holds, so its name, run on over them, sits on
  // one ground; the beat sounding is marked under it.
  const held = sounding === null ? null : heldBy(cells, sounding)
  return (
    <>
      {cells.map((_, beat) => (
        <span
          key={beat}
          aria-hidden
          data-beat={beat}
          data-sounding={sounding === beat ? '' : undefined}
          data-looped={looped ? '' : undefined}
          style={{ gridColumn: beat + 1 }}
          className={cn(
            'relative row-start-1',
            face === 'grid'
              ? 'h-11 rounded-mark first:border-l-3 first:border-foreground sm:h-[66px]'
              : 'h-12 border-l border-hairline first:border-l-0 sm:h-14 landscape-phone:h-11',
            held !== null && heldBy(cells, beat) === held
              ? 'bg-foreground'
              : playing
                ? 'bg-secondary'
                : looped
                  ? 'bg-paint-yellow'
                  : face === 'grid'
                    ? 'bg-card group-hover/bar:bg-muted'
                    : 'group-hover/bar:bg-muted/60',
          )}
        >
          {sounding === beat ? (
            <span className="absolute inset-x-1.5 bottom-1 h-0.5 rounded-full bg-background/70" />
          ) : null}
          {beat === 0 && face === 'chart' ? (
            <span className="absolute top-1 left-1 text-xs leading-none tabular-nums opacity-60">
              {number}
            </span>
          ) : null}
        </span>
      ))}
      {cells.map((chords, beat) =>
        chords.length === 0 ? null : (
          // A beat's chords over all the beats they hold, sized by that room, in the ink of its ground.
          <span
            key={`chords-${beat}`}
            aria-hidden
            className={cn(
              '@container pointer-events-none relative z-10 row-start-1 flex min-w-0',
              face === 'grid'
                ? cn('items-center ps-2 sm:ps-3.5', beat === 0 && 'ms-[3px]')
                : 'items-end px-1 pb-1.5',
              held === beat ? 'text-background' : playing ? 'text-secondary-foreground' : undefined,
            )}
            style={{ gridColumn: `${beat + 1} / span ${roomAfter(cells, beat)}` }}
          >
            <CellChords symbols={chords} face={face} />
          </span>
        ),
      )}
      {words.map((verse, index) =>
        verse.length === 0 ? null : (
          <span
            key={index}
            aria-hidden
            data-song-text
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
