import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { useScreenBar } from './screen-bar'

/**
 * Keeps its content at the top of the screen, clear of the notch, while the page scrolls under it:
 * edge to edge on a phone, the width of its column on a laptop. While the screen's bar shows, it sits
 * under the bar and moves with it.
 */
export function Pinned({ children, className }: { children: ReactNode; className?: string }) {
  const { offset } = useScreenBar()
  return (
    <div
      data-slot="pinned"
      style={{ top: offset }}
      className={cn(
        'sticky z-20 -mx-4 bg-background px-4 pt-safe pb-3 duration-200 ease-out motion-safe:transition-top lg:mx-0 lg:px-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
