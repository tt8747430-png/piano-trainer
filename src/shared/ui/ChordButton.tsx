import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { PlayToggle } from './PlayToggle'

/**
 * A chord to tap in a grid of chords: its symbol over its numeral (a chord symbol with a degree for a
 * root), both as the sheets print them (`C♯m7`, `V7♯9`), and a detail where it has them, pressed
 * while it sounds (a square: tap again to stop), ringed when it holds the note heard.
 */
export function ChordButton({
  symbol,
  numeral,
  detail,
  playing,
  holds = false,
  onClick,
}: {
  symbol: string
  numeral?: string | undefined
  /** A line under the numeral: how the chord is played (its inversion), or that it is out of the key. */
  detail?: string | undefined
  playing: boolean
  holds?: boolean
  onClick: () => void
}) {
  return (
    <PlayToggle
      playing={playing}
      data-holds={holds ? '' : undefined}
      className="h-auto min-h-16 flex-col gap-0 px-1 py-2 data-holds:ring-3 data-holds:ring-ring data-holds:ring-inset"
      onClick={onClick}
    >
      {/* A long symbol (G♭m6/B♭♭) a size or two down, so it stays in its square; it wraps at worst. */}
      <span
        className={cn(
          'max-w-full font-display leading-tight font-semibold whitespace-normal wrap-anywhere',
          symbol.length > 7 ? 'text-base' : symbol.length > 5 ? 'text-lg' : 'text-xl',
        )}
      >
        {printedSymbol(symbol)}
      </span>
      {numeral ? (
        <span className="text-sm text-muted-foreground">{printedSymbol(numeral)}</span>
      ) : null}
      {detail ? (
        <span data-detail="" className="text-xs text-muted-foreground">
          {detail}
        </span>
      ) : null}
    </PlayToggle>
  )
}
