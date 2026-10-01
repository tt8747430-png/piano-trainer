import type { ComponentProps } from 'react'
import { SelectTrigger, SelectValue } from './primitives/select'

/** A pop-up button's face: its label in soft ink, then the value (`children` writes it). */
export function DropdownTrigger({
  label,
  className,
  children,
}: {
  label: string
  className?: string | undefined
  children?: ComponentProps<typeof SelectValue>['children']
}) {
  return (
    <SelectTrigger aria-label={label} className={className}>
      <span aria-hidden className="text-muted-foreground">
        {label}
      </span>
      <SelectValue className="block min-w-0 flex-1 truncate text-left font-semibold">
        {children}
      </SelectValue>
    </SelectTrigger>
  )
}
