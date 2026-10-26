import type { ReactNode } from 'react'
import { cn, useMediaQuery } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/primitives/tooltip'

/** A device whose pointer rests on what it points at: a mouse or a trackpad, as the theme's hover. */
const HOVERS = '(hover: hover) and (pointer: fine)'

/**
 * A chord as a chip over the words (ADR 0099): its symbol in the display face as the sheet prints it
 * (`C♯m7`), at its line's text size (ADR 0108: every length in `em`), filled with the ink while it
 * sounds, a muted wash in its line's ink otherwise. A tap opens its sheet; its target reaches past
 * the chip to a finger's size, the line round it tight. Where the device hovers, a pointer resting on
 * it shows its diagram (`diagram`, drawn only then) in a small popover over it, as Chordify's does on
 * a computer; a touch only opens the sheet.
 */
export function ChordChip({
  symbol,
  sounding,
  diagram,
  onOpen,
}: {
  symbol: string
  sounding: boolean
  /** Its diagram, drawn as its piece draws it, with its symbol. */
  diagram: () => ReactNode
  onOpen: () => void
}) {
  const hovers = useMediaQuery(HOVERS)
  const chip = (
    <button
      type="button"
      data-sounding={sounding ? '' : undefined}
      onClick={onOpen}
      className={cn(
        'pointer-events-auto relative min-w-[2em] rounded-md px-[0.375em] py-[0.125em] text-center font-display text-[1em] leading-tight font-semibold whitespace-nowrap transition-colors duration-200 ease-out before:absolute before:-inset-x-1.5 before:-inset-y-2.5',
        // Its line's ink otherwise: the line playing's, else the others' muted one.
        sounding ? 'bg-foreground text-background' : 'bg-muted hover:bg-hairline',
      )}
    >
      {printedSymbol(symbol)}
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
