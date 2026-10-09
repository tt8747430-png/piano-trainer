import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Rail buttons that belong together, set a little apart from the next group. */
export function RailGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex shrink-0 pl-1.5 empty:hidden', className)}>{children}</div>
}
