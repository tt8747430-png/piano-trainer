import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { ActionRow } from './ActionRow'
import { SettingsGroup } from './SettingsGroup'

/**
 * What ends or destroys (R25): a page's last group, alone, with room above it, its rows in red and,
 * for a loss that cannot be undone, one footnote under its card saying what goes; one undone from its
 * toast (R38) needs none, the toast naming it. Never on Settings'
 * list; never beside ordinary rows.
 */
export function DangerGroup({
  footnote,
  className,
  children,
}: {
  footnote?: string
  /** Its room above, where a page sets the losses' rhythm itself (the Account's: Sign out, then Delete 16 further). */
  className?: string
  children: ReactNode
}) {
  return (
    <SettingsGroup danger flush footnote={footnote} className={cn('mt-6', className)}>
      {children}
    </SettingsGroup>
  )
}

/** A row that ends or destroys (R24): an `ActionRow` in red, in a `DangerGroup`; it asks first. */
export function DangerRow(props: Omit<Parameters<typeof ActionRow>[0], 'danger'>) {
  return <ActionRow {...props} danger />
}
