import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * Keeps its content at the foot of the screen, over the phone's tab bar, the screen's width beside a
 * rail or a sidebar, while the page scrolls above it. Its height is the page's `--docked`: the page
 * pads its foot clear of it (`pb-docked-*`), and what floats at the foot stands over it
 * (`bottom-docked`). One thing is docked at a time.
 */
export function Docked({ children, className }: { children: ReactNode; className?: string }) {
  const docked = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = docked.current
    if (!element) return
    const root = document.documentElement
    const observer = new ResizeObserver(([entry]) =>
      root.style.setProperty('--docked', `${entry?.borderBoxSize[0]?.blockSize ?? 0}px`),
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--docked')
    }
  }, [])
  return (
    <div
      ref={docked}
      data-slot="docked"
      className={cn(
        'fixed inset-x-0 bottom-nav-bar z-20 border-t border-border bg-background px-gutter pt-1 pb-2 print:hidden landscape-phone:left-rail landscape-phone:pr-gutter-safe landscape-phone:pb-safe-4 lg:left-sidebar lg:pb-safe-4 lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed',
        className,
      )}
    >
      {children}
    </div>
  )
}
