import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMetronome } from '@/features/metronome'
import { cn, useMediaQuery } from '@/shared/lib'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { ToolsPanel } from './ToolsPanel'

/** From this width the Tools open as a popover under their button; narrower, a sheet. */
const POPOVER_WIDTH = '(min-width: 48rem)'

/**
 * The Tools button in a screen's bar (R29 B11, R32): a lesson's, each explorer's, the Chord
 * player's. It opens the Tools in place over the page, which stays as it was: a popover under the
 * button on a laptop, a sheet on a phone (`ToolsPanel`). The Metronome runs on with them closed,
 * until the page is left. Worded (Practice's bar, where it is the bar's one act) it says "Tools";
 * elsewhere a phone's bar keeps its room for the title with the icon alone, worded from 40rem.
 */
export function ToolsButton({ worded = false }: { worded?: boolean }) {
  const { t } = useTranslation('practice')
  const [open, setOpen] = useState(false)
  const metronome = useMetronome()
  const popover = useMediaQuery(POPOVER_WIDTH)
  const label = t('tools.sheet.open')
  const trigger = (
    <Button
      variant="bar"
      className={cn('h-11 min-w-11 gap-1.5 rounded-pill px-4', !worded && 'max-sm:px-0')}
      title={label}
    />
  )
  const face = (
    <>
      <LayoutGrid aria-hidden className={cn(worded ? 'hidden' : 'sm:hidden')} />
      <span className={cn(!worded && 'max-sm:sr-only')}>{label}</span>
    </>
  )
  const panel = <ToolsPanel metronome={metronome} close={() => setOpen(false)} />
  if (popover)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={trigger}>{face}</PopoverTrigger>
        <PopoverContent
          aria-label={label}
          align="end"
          className="max-h-(--available-height) w-[min(26rem,calc(100vw-2rem))] overflow-y-auto"
        >
          <h2 className="px-1 pb-2 font-sans text-xl font-bold">{label}</h2>
          {panel}
        </PopoverContent>
      </Popover>
    )
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger}>{face}</SheetTrigger>
      <SheetContent title={label}>{panel}</SheetContent>
    </Sheet>
  )
}
