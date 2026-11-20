import { Check, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/**
 * A run's verdict at the head of its results (`PracticeResult`): a star in the yellow paint for a
 * perfect run, a check in the grass otherwise, the run's name under it and one line of how it went.
 */
export function RunHero({
  perfect,
  title,
  children,
}: {
  perfect: boolean
  title: string
  /** The line under the name: what was right, or nothing. */
  children?: ReactNode
}) {
  const Verdict = perfect ? Star : Check
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span
        aria-hidden
        className={cn(
          'grid size-24 place-items-center rounded-full [&_svg]:size-11',
          perfect ? 'bg-paint-yellow text-on-paint-yellow' : 'bg-paint-grass text-on-paint-grass',
        )}
      >
        <Verdict strokeWidth={2.4} className={perfect ? 'fill-current' : undefined} />
      </span>
      <h1 className="mt-2 font-sans text-[1.625rem] leading-[normal] font-bold tracking-[-0.01em] text-balance">
        {title}
      </h1>
      {children}
    </div>
  )
}
