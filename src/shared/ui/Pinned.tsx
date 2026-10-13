import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { useScreenBar } from './screen-bar'

/**
 * Keeps its content at the top of the screen, clear of the notch, while the page scrolls under it:
 * edge to edge on a phone, the width of its column on a laptop; under the screen's bar while it
 * shows, moving with the bar as it slides. It reports its height, which a jump to a heading clears.
 */
export function Pinned({ children, className }: { children: ReactNode; className?: string }) {
  const { pin } = useScreenBar()
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = box.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => pin(entry?.borderBoxSize[0]?.blockSize ?? 0))
    observer.observe(element)
    return () => {
      observer.disconnect()
      pin(0)
    }
  }, [pin])
  return (
    <div
      ref={box}
      data-slot="pinned"
      className={cn(
        'sticky top-screen-bar z-20 -mx-gutter bg-background px-gutter pt-safe pb-3 duration-200 ease-out motion-safe:transition-[top]',
        className,
      )}
    >
      {children}
    </div>
  )
}
