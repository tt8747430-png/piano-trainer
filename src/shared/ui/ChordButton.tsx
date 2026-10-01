import { PlayToggle } from './PlayToggle'

/**
 * A chord to tap in a grid of chords: its symbol over its numeral where it has one, pressed while it
 * sounds (a square: tap again to stop), ringed when it holds the note heard.
 */
export function ChordButton({
  symbol,
  numeral,
  playing,
  holds = false,
  onClick,
}: {
  symbol: string
  numeral?: string | undefined
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
      <span className="max-w-full font-display text-xl leading-tight font-semibold wrap-anywhere">
        {symbol}
      </span>
      {numeral ? <span className="text-sm text-muted-foreground">{numeral}</span> : null}
    </PlayToggle>
  )
}
