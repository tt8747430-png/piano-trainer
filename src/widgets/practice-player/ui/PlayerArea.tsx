import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

export type PlayerAreaName =
  'lead' | 'tempo' | 'hands' | 'actions' | 'keys' | 'sheet' | 'status' | 'transport'

/** One part of the Player's screen, placed by its name. */
export function PlayerArea({
  area,
  className,
  children,
}: {
  area: PlayerAreaName
  className?: string
  children?: ReactNode
}) {
  return (
    <div data-area={area} className={cn('min-w-0', className)}>
      {children}
    </div>
  )
}
