import { useState, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { MenuSection } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/**
 * What a sign opens, anchored to what was tapped (ADR 0094, 0114, Dorico's popovers): its button on
 * the sheet, or its key in the palette, the trigger; the popover named by what it changes, as the
 * palette names the section holding the same tools. Its picker is given `close` where it has its own
 * Cancel and Apply. As tall as the room beside its trigger, scrolling past it.
 */
export function SignPopover({
  label,
  info,
  wide = false,
  trigger,
  children,
}: {
  label: string
  /** What its tools do, where their names alone do not say: the ⓘ beside its name (ADR 0096). */
  info?: ReactNode
  /** As wide as seven key signatures in a row, where the screen has room. */
  wide?: boolean
  trigger: ReactElement
  children: ReactNode | ((close: () => void) => ReactNode)
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        aria-label={label}
        align="start"
        className={cn(
          'max-h-(--available-height) max-w-[calc(100vw-1rem)] gap-3 overflow-y-auto overscroll-contain p-3',
          wide ? 'w-[29rem]' : 'w-92',
        )}
      >
        <MenuSection title={label} info={info} className="gap-3">
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </MenuSection>
      </PopoverContent>
    </Popover>
  )
}
