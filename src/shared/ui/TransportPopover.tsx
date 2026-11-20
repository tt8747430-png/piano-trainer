import type { ReactElement, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'

/**
 * A laptop's settings over the transport button that opens them, as PlayerDesk draws Practice and
 * Piano: 12 over the button, 16 round, 12 in, its title in the sans at its start and no Done (a
 * click outside or Esc closes it). The button opens and closes it itself. A phone shows the same
 * body as a bottom sheet.
 */
export function TransportPopover({
  title,
  open,
  onOpenChange,
  trigger,
  className,
  children,
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactElement
  /** Its width: PlayerDesk's Practice 420 (`w-105`), its Piano 380 (`w-95`). */
  className: string
  children: ReactNode
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        side="top"
        sideOffset={12}
        aria-label={title}
        className={cn(
          'max-h-(--available-height) gap-3 overflow-y-auto rounded-2xl p-3',
          className,
        )}
      >
        <h2 className="px-1 font-sans text-[1.0625rem]/[normal] font-semibold">{title}</h2>
        {children}
      </PopoverContent>
    </Popover>
  )
}
