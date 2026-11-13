import type { ReactNode } from 'react'
import { ActionRow } from './ActionRow'

/**
 * What ends or destroys (R25): a page's last group, alone, with room above it, its rows in red and,
 * for a loss that cannot be undone, one footnote under its card saying what goes; one undone from its
 * toast (R38) needs none, the toast naming it. Never on Settings'
 * list; never beside ordinary rows.
 */
export function DangerGroup({ footnote, children }: { footnote?: string; children: ReactNode }) {
  return (
    <section data-group="danger" className="mt-6 flex flex-col gap-2">
      <div className="flex flex-col overflow-hidden card">{children}</div>
      {footnote ? <p className="px-3 text-sm text-muted-foreground">{footnote}</p> : null}
    </section>
  )
}

/** A row that ends or destroys (R24): an `ActionRow` in red, in a `DangerGroup`; it asks first. */
export function DangerRow(props: Omit<Parameters<typeof ActionRow>[0], 'danger'>) {
  return <ActionRow {...props} danger />
}
