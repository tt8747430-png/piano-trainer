import type { ReactNode } from 'react'
import { cn, useMediaQuery } from '@/shared/lib'
import { RaisedSymbol } from '@/shared/ui'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'

/** A device whose pointer rests on what it points at: a mouse or a trackpad, as the theme's hover. */
const HOVERS = '(hover: hover) and (pointer: fine)'

/**
 * A chord as a chip over the words (ADR 0108), as the Lyrics board draws it: its symbol in the sans
 * at 700, 13 to the words' 16, its extensions raised (`G⁷`), on a 21 tall chip 5 round and 7 in, at
 * its line's text size (ADR 0108: every length in `em`), filled with the ink while it sounds, the
 * muted wash otherwise. A tap takes the cursor to it (`onGo`, ADR 0108);
 * its target reaches past the chip sideways to a finger's size, up and down no further than the
 * room between lines, so it never takes a tap meant for the line over or under it. Where the device
 * hovers, a pointer resting on it shows its diagram (`diagram`, drawn only then) in a small popover
 * over it, as Chordify's does on a computer.
 */
export function ChordChip({
  symbol,
  sounding,
  diagram,
  onGo,
}: {
  symbol: string
  sounding: boolean
  /** Its diagram, drawn as its piece draws it, with its symbol. */
  diagram: () => ReactNode
  onGo: () => void
}) {
  const hovers = useMediaQuery(HOVERS)
  const chip = (
    <button
      type="button"
      data-sounding={sounding ? '' : undefined}
      onClick={onGo}
      className={cn(
        'pointer-events-auto relative h-[1.3125em] rounded-[0.3125em] px-[0.4375em] text-[0.8125em] leading-none font-bold whitespace-nowrap transition-colors duration-200 ease-out before:absolute before:-inset-x-1.5 before:-inset-y-[0.25em]',
        // Its line's ink otherwise: the line playing's, else the others' muted one.
        sounding ? 'bg-foreground text-background' : 'bg-muted hover:bg-hairline',
      )}
    >
      <RaisedSymbol symbol={symbol} />
    </button>
  )
  if (!hovers) return chip
  return (
    <Tooltip>
      <TooltipTrigger render={chip} />
      <TooltipContent className="flex-col gap-1 bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-foreground/10">
        {diagram()}
      </TooltipContent>
    </Tooltip>
  )
}
