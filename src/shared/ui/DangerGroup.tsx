import type { ReactNode } from 'react'
import { ActionRow } from './ActionRow'

/**
 * What ends or destroys (R25): a page's last group, alone, with room above it, its rows in red and
 * one footnote under its card saying what happens and whether it can be undone. Never on Settings'
 * list; never beside ordinary rows.
 */
export function DangerGroup({ footnote, children }: { footnote: string; children: ReactNode }) {
  return (
    <section data-group="danger" className="mt-6 flex flex-col gap-2">
      <div className="flex flex-col card p-1.5">{children}</div>
      <p className="px-3 text-sm text-muted-foreground">{footnote}</p>
    </section>
  )
}

/** A row that ends or destroys (R24): an `ActionRow` in red, in a `DangerGroup`; it asks first. */
export function DangerRow(props: Omit<Parameters<typeof ActionRow>[0], 'danger'>) {
  return <ActionRow {...props} danger />
}
