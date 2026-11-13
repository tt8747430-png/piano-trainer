import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Its gutters and foot: its content's own where it bleeds edge to edge (a page's keys, R34). */
const PADDING =
  'px-gutter pt-1 pb-2 landscape-phone:pr-gutter-safe landscape-phone:pb-safe-2 lg:pb-safe-4'

/**
 * Keeps its content at the foot of the screen, over the phone's tab bar, the screen's width beside a
 * rail or a sidebar, while the page scrolls above it. Its height is the page's `--docked`: the page
 * pads its foot clear of it (`pb-docked-*`), and what floats at the foot stands over it
 * (`bottom-docked`). One thing is docked at a time. Below it, down to the screen's edge (the home
 * indicator's strip, or under the tab bar), its own ground: nothing of the page shows there (R31-S).
 */
export function Docked({
  children,
  bleed = false,
  className,
}: {
  children: ReactNode
  /** Edge to edge, no border: its content draws its own edge (the keys' divider). */
  bleed?: boolean
  className?: string
}) {
  const docked = useRef<HTMLDivElement>(null)
  // Measured before the first paint, so what floats over it never starts at the foot and jumps (A31).
  useLayoutEffect(() => {
    const element = docked.current
    if (!element) return
    const root = document.documentElement
    root.style.setProperty('--docked', `${element.getBoundingClientRect().height}px`)
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
        "fixed inset-x-0 bottom-over-floating z-20 bg-background print:hidden after:absolute after:inset-x-0 after:top-full after:h-[calc(var(--nav-bar)+var(--floating-foot))] after:bg-background after:content-[''] landscape-phone:left-rail lg:left-sidebar lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed",
        bleed ? null : cn('border-t border-border', PADDING),
        className,
      )}
    >
      {children}
    </div>
  )
}
