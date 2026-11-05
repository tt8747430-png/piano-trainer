import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * Keeps its content at the top of the screen, clear of the notch, while the page scrolls under it:
 * edge to edge on a phone, the width of its column on a laptop; under the screen's bar while it
 * shows, moving with the bar as it slides. The notch's room is its own only while the bar is away: under
 * the bar, or still in the page, it has none, so no band opens above it (R31-S).
 */
export function Pinned({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-slot="pinned"
      className={cn(
        'sticky top-screen-bar z-20 -mx-gutter bg-background px-gutter pt-pinned pb-3 duration-200 ease-out motion-safe:transition-[top,padding]',
        className,
      )}
    >
      {children}
    </div>
  )
}
