import type { ComponentProps } from 'react'
import { SelectTrigger, SelectValue } from './primitives/select'

/**
 * A pop-up button's face: its label in soft ink, then the value (`children` writes it). `bare`, under
 * a name already printed, it shows the value alone and keeps its label for a screen reader.
 */
export function DropdownTrigger({
  label,
  bare = false,
  className,
  children,
}: {
  label: string
  bare?: boolean
  className?: string | undefined
  children?: ComponentProps<typeof SelectValue>['children']
}) {
  return (
    <SelectTrigger aria-label={label} className={className}>
      {bare ? null : (
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
      )}
      <SelectValue className="block min-w-0 flex-1 truncate text-left font-semibold">
        {children}
      </SelectValue>
    </SelectTrigger>
  )
}
