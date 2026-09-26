import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * Keeps its content at the top of the screen, clear of the notch, while the page scrolls under it:
 * edge to edge on a phone, the width of its column on a laptop.
 */
export function Pinned({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 -mx-4 bg-background px-4 pt-safe pb-3 lg:mx-0 lg:px-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
