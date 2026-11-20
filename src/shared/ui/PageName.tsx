import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A page's name as its serif heading (the LearnLevel, Lesson and Course boards' h1): 30 on a
 * phone and 36 on a laptop, 1.15 apart, semibold, tightened by 1% as a large heading is, balanced
 * over its lines. The bar's own title says it to a screen reader, so it is hidden from one.
 */
export function PageName({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      aria-hidden
      className={cn(
        'font-display text-[1.875rem]/[1.15] font-semibold tracking-[-0.01em] text-balance lg:text-[2.25rem]/[1.15]',
        className,
      )}
    >
      {children}
    </p>
  )
}
