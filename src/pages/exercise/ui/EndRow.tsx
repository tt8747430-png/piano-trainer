import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { GroupField } from '@/shared/ui'

/** How wide the choice stands at the row's end on a laptop: the kit's `segr` 360, Rhythm's 400. */
const WIDTHS = {
  regular: 'lg:w-90',
  wide: 'lg:w-100',
} as const

/**
 * A row of a choice (canvas v440, v551, the kit's `segr`): on a phone its name over the segmented
 * control across the group's width; on a laptop its name, then the control at the row's end, sized
 * to its words, 4 of padding so the row stands 56 as the stepper rows beside it.
 */
export function EndRow({
  label,
  width = 'regular',
  children,
}: {
  label: string
  width?: keyof typeof WIDTHS
  children: ReactNode
}) {
  return (
    <GroupField
      label={label}
      className="lg:flex-row lg:items-center lg:gap-3 lg:py-1 lg:[&>span]:flex-1"
    >
      <div className={cn('w-full flex-none', WIDTHS[width])}>{children}</div>
    </GroupField>
  )
}
