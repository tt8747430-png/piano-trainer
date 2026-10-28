import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A round mark with how much of it is done drawn as an arc round its edge, from the top clockwise
 * (a lesson's sections read round its node): nothing at none, a hairline track under the arc
 * otherwise. The arc takes the colour `className` gives it; the mark inside is its children.
 */
export function ProgressRing({
  share,
  className,
  children,
}: {
  /** How much is done, 0 to 1. */
  share: number
  className?: string
  children: ReactNode
}) {
  const done = Math.min(Math.max(share, 0), 1)
  return (
    <span className="relative inline-grid place-items-center">
      {children}
      {done > 0 ? (
        <svg
          aria-hidden
          viewBox="0 0 40 40"
          className={cn(
            'pointer-events-none absolute -top-1.5 -left-1.5 size-[calc(100%+0.75rem)] -rotate-90',
            className,
          )}
        >
          <circle
            cx="20"
            cy="20"
            r="18.5"
            fill="none"
            strokeWidth="2.5"
            className="stroke-hairline"
          />
          <circle
            cx="20"
            cy="20"
            r="18.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${done * 100} 100`}
          />
        </svg>
      ) : null}
    </span>
  )
}
