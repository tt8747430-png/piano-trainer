import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMetronome } from '@/features/metronome'
import { useMediaQuery } from '@/shared/lib'
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
 * until the page is left.
 */
export function ToolsButton() {
  const { t } = useTranslation('practice')
  const [open, setOpen] = useState(false)
  const metronome = useMetronome()
  const popover = useMediaQuery(POPOVER_WIDTH)
  const label = t('tools.sheet.open')
  const trigger = (
    <Button variant="bar" size="icon" className="rounded-pill" aria-label={label} title={label} />
  )
  const panel = <ToolsPanel metronome={metronome} close={() => setOpen(false)} />
  if (popover)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={trigger}>
          <LayoutGrid aria-hidden />
        </PopoverTrigger>
        <PopoverContent
          aria-label={label}
          align="end"
          className="max-h-(--available-height) w-[min(26rem,calc(100vw-2rem))] overflow-y-auto"
        >
          <h2 className="px-1 pb-2 font-display text-xl font-semibold">{label}</h2>
          {panel}
        </PopoverContent>
      </Popover>
    )
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger}>
        <LayoutGrid aria-hidden />
      </SheetTrigger>
      <SheetContent title={label}>{panel}</SheetContent>
    </Sheet>
  )
}
