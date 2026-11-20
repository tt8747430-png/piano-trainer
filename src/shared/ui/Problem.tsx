import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * Why an act failed, said beside it in crimson at the small size and read out at once: a field's
 * check, a save that did not go, a sheet's Create that the server turned down. Its place (an inset in
 * a card, a gap under a field) is the caller's.
 */
export function Problem({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <p id={id} role="alert" className={cn('text-sm text-pretty text-destructive', className)}>
      {children}
    </p>
  )
}
