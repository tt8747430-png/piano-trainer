import { Square } from 'lucide-react'
import { Button } from './primitives/button'

/**
 * A chord to tap in a grid of chords: its symbol over its numeral, pressed while it sounds (a square:
 * tap again to stop), ringed when it holds the note heard.
 */
export function ChordButton({
  symbol,
  numeral,
  playing,
  holds = false,
  onClick,
}: {
  symbol: string
  numeral: string
  playing: boolean
  holds?: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="outline"
      aria-pressed={playing}
      data-holds={holds ? '' : undefined}
      className="relative h-auto min-h-16 flex-col gap-0 px-1 py-2 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground data-holds:ring-3 data-holds:ring-ring data-holds:ring-inset"
      onClick={onClick}
    >
      {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
      <span className="max-w-full font-display text-xl leading-tight font-semibold wrap-anywhere">
        {symbol}
      </span>
      <span className="text-sm text-muted-foreground">{numeral}</span>
    </Button>
  )
}
