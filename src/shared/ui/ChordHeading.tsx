import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'

/** The longest symbol the chord display holds on a phone's line: `Cm7♭5`. */
const LONGEST_AT_DISPLAY = 5

/**
 * A chord's symbol as what a page shows, printed as the sheets print it (`C♯m7`): in the chord
 * display, a longer symbol a size down so it stays on a phone's line, breaking only where nothing
 * shorter is left.
 */
export function ChordHeading({ symbol }: { symbol: string }) {
  return (
    <h2
      className={cn('wrap-anywhere', symbol.length > LONGEST_AT_DISPLAY ? 'text-5xl' : 'text-7xl')}
    >
      {printedSymbol(symbol)}
    </h2>
  )
}
