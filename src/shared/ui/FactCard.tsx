import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * One fact as a card in a list of facts (a `dl`): its icon over its name, then what it is, as a
 * song's key, time and tempo stand three across (Chordify's Capo · Tuning · BPM). What it is takes
 * its own face: a key names a chord, in the serif.
 */
export function FactCard({
  icon: Icon,
  name,
  children,
}: {
  icon: LucideIcon
  name: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 card px-2 py-3 text-center">
      <Icon aria-hidden className="size-5 text-muted-foreground" />
      <dt className="max-w-full text-sm text-muted-foreground hyphens-auto">{name}</dt>
      <dd className="max-w-full text-lg font-semibold text-balance tabular-nums">{children}</dd>
    </div>
  )
}
