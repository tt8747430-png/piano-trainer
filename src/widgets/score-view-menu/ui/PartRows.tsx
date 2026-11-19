import type { ReactNode } from 'react'
import { GroupRows, Labelled, SwitchRow } from '@/shared/ui'

/**
 * One part the music shows, on or off: a switch row in its group's card, as the Player's view sheets
 * draw Show (R43: an on or off is a switch row, never a chip). Greyed where it cannot change, its
 * `reason` its tooltip and a screen reader's description.
 */
export function PartRow({
  label,
  info,
  on,
  reason,
  onChange,
}: {
  label: string
  /** What it does, where its name alone does not say: the ⓘ after its name. */
  info?: ReactNode
  on: boolean
  reason?: string | undefined
  onChange: (on: boolean) => void
}) {
  return (
    <SwitchRow
      label={label}
      info={info}
      checked={on}
      disabled={reason !== undefined}
      reason={reason}
      onCheckedChange={onChange}
      className="min-h-12 border-b-0 ps-4 pe-3"
    />
  )
}

/**
 * A view's group of rows on the sheet, one card as its board draws it, under its name where it has
 * one (Show); what its rows do, where their names alone do not say, the ⓘ beside it (ADR 0096).
 */
export function PartRows({
  label,
  info,
  children,
}: {
  label?: string
  info?: ReactNode
  children: ReactNode
}) {
  const rows = (
    <GroupRows label={label} surface="sheet">
      {children}
    </GroupRows>
  )
  return label ? (
    <Labelled label={label} info={info}>
      {rows}
    </Labelled>
  ) : (
    rows
  )
}
