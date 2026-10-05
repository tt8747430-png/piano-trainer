import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * Keeps its content at the top of the screen, clear of the notch, while the page scrolls under it:
 * edge to edge on a phone, the width of its column on a laptop; under the screen's bar while it shows.
 */
export function Pinned({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-slot="pinned"
      className={cn(
        'sticky top-screen-bar z-20 -mx-gutter bg-background px-gutter pt-safe pb-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
