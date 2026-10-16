import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * What a heading folds away: open, its full height; folded, none, and out of reach of the keyboard
 * and a screen reader (`inert`). It slides between the two rather than jumping, so the page under it
 * moves as one; at once under reduced motion.
 */
export function FoldBody({
  id,
  open,
  className,
  children,
}: {
  id: string
  open: boolean
  /** The body's own layout, inside the part that slides. */
  className?: string
  children: ReactNode
}) {
  return (
    <div
      id={id}
      inert={!open}
      className={cn(
        'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      {/* Room at its sides for a focus ring the slide would cut. */}
      <div className={cn('-mx-1 min-h-0 overflow-hidden px-1', className)}>{children}</div>
    </div>
  )
}
