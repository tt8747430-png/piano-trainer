import { Square } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useBarName } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { CellChords } from './CellChords'

/**
 * What a tap on a chart's bar does: plays it, a toggle pressed while it sounds (a song's chart); or
 * takes the Player there, to the beat tapped, its bar current while the cursor is in it (ADR 0098,
 * 0099).
 */
export type BarTap = 'play' | 'go'

/** The beat of a bar a tap landed on: its cell's, else its first (a key pressed on the bar). */
const beatTapped = (target: EventTarget): number => {
  const cell = target instanceof Element ? target.closest('[data-beat]') : null
  return Number(cell?.getAttribute('data-beat') ?? 0)
}

/**
 * One bar of a chart's line in its beats (ADR 0099): a cell a beat, the chords starting in each, its
 * number small in its first cell's corner, a barline before it, and under its cells its method labels
 * or short length; a bar of no chord its number alone (ADR 0094). `marked` while it plays: the bar
 * sounding, with a square to stop it, or the bar the Player is in, a pointer's target only, as the
 * sheet's bars are (the arrows move the cursor), its beat sounding filled (`sounding`). The loop's
 * bars (`looped`) lie on its band.
 */
export function BarButton({
  tap,
  number,
  symbols,
  cells,
  notes,
  marked,
  sounding,
  looped,
  onTap,
  style,
}: {
  tap: BarTap
  number: number
  /** Its chords, for its name. */
  symbols: readonly string[]
  /** Each beat's chords, those starting in it. */
  cells: readonly (readonly string[])[]
  /** Method labels and a short bar's length, under the chords. */
  notes: readonly string[]
  marked: boolean
  /** The beat sounding, filled: the Player's, in the bar it is in. */
  sounding: number | null
  looped: boolean
  /** A tap, on the beat it landed on. */
  onTap: (beat: number) => void
  style?: CSSProperties
}) {
  const barName = useBarName()
  const playing = marked && tap === 'play'
  return (
    <button
      type="button"
      // Named by all it prints, as it prints it: its number, its chords, and the notes under them.
      aria-label={barName(
        number,
        [symbols.map(printedSymbol).join(' '), ...notes].filter((said) => said !== '').join(' · '),
      )}
      {...(tap === 'play'
        ? { 'aria-pressed': marked }
        : { 'aria-current': marked ? ('step' as const) : undefined, tabIndex: -1 })}
      onClick={(event) => onTap(beatTapped(event.target))}
      className="group/bar relative grid min-w-0 auto-rows-min border-l-2 border-foreground text-left transition-colors duration-200 ease-out focus-visible:-outline-offset-3"
      style={{ ...style, gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
    >
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
      {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
      {notes.length > 0 ? (
        // Ends in an ellipsis where a narrow bar cannot hold it all; its name holds it whole.
        <span
          aria-hidden
          className="col-span-full truncate px-1.5 pb-1 text-xs text-muted-foreground"
        >
          {notes.join(' · ')}
        </span>
      ) : null}
    </button>
  )
}
