import type { ReactElement, ReactNode } from 'react'
import { MenuSection } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/**
 * What a thing printed on the sheet opens, anchored to it (ADR 0094, Dorico's popovers): its button
 * on the sheet the trigger, the popover named by what it changes, as the palette names the section
 * holding the same tools.
 */
export function SignPopover({
  label,
  trigger,
  children,
}: {
  label: string
  trigger: ReactElement
  children: ReactNode
}) {
  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent aria-label={label} align="start" className="w-80 gap-3 p-4">
        <MenuSection title={label} className="gap-3">
          {children}
        </MenuSection>
      </PopoverContent>
    </Popover>
  )
}
