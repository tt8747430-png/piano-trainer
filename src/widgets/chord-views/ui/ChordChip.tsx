import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'

/**
 * A chord as a chip over the words (ADR 0099): its symbol in the display face as the sheet prints it
 * (`C♯m7`), filled with the ink while it sounds, a muted wash otherwise. A tap opens its sheet; its
 * target reaches past the chip to a finger's size, the line round it staying tight.
 */
export function ChordChip({
  symbol,
  sounding,
  onOpen,
}: {
  symbol: string
  sounding: boolean
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      data-sounding={sounding ? '' : undefined}
      onClick={onOpen}
      className={cn(
        'pointer-events-auto relative rounded-md px-1.5 py-0.5 font-display text-base leading-tight font-semibold whitespace-nowrap transition-colors duration-200 ease-out before:absolute before:-inset-x-1 before:-inset-y-2.5 sm:text-lg',
        sounding ? 'bg-foreground text-background' : 'bg-muted text-foreground hover:bg-hairline',
      )}
    >
      {printedSymbol(symbol)}
    </button>
  )
}
