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
  info,
  trigger,
  children,
}: {
  label: string
  /** What its tools do, where their names alone do not say: the ⓘ beside its name (ADR 0096). */
  info?: ReactNode
  trigger: ReactElement
  children: ReactNode
}) {
  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      {/* As wide as a key's seven letters, on the narrowest phone the screen's width. */}
      <PopoverContent
        aria-label={label}
        align="start"
        className="w-92 max-w-[calc(100vw-1rem)] gap-3 p-3"
      >
        <MenuSection title={label} info={info} className="gap-3">
          {children}
        </MenuSection>
      </PopoverContent>
    </Popover>
  )
}
