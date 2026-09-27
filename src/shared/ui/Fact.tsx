import type { ReactNode } from 'react'

/** One fact in a list of facts (`dl`): its term, then what it is. */
export function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="w-28 shrink-0 text-muted-foreground">{term}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  )
}
