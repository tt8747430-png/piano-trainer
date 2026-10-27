import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Labelled } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'

/**
 * One part the music shows, on or off (ADR 0115): a chip of its picture and its name, pressed while
 * it is shown, every one in sight with the others of its group. Greyed where it cannot change, its
 * `reason` its tooltip and a screen reader's description, keeping the pointer so the tooltip shows.
 */
export function PartChip({
  icon,
  label,
  pressed,
  reason,
  onPressedChange,
}: {
  icon: ReactNode
  label: string
  pressed: boolean
  reason?: string | undefined
  onPressedChange: (pressed: boolean) => void
}) {
  return (
    <Toggle
      pressed={pressed}
      disabled={reason !== undefined}
      title={reason ?? label}
      aria-description={reason}
      onPressedChange={onPressedChange}
      className={cn(
        'max-w-full justify-start gap-2 px-3 font-medium text-muted-foreground aria-pressed:text-foreground',
        reason !== undefined && 'disabled:pointer-events-auto',
      )}
    >
      <span aria-hidden className="grid size-5 shrink-0 place-items-center [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </Toggle>
  )
}

/**
 * Chips under their name, wrapping, one group: named for a screen reader by the name it prints;
 * what its chips do, where their names alone do not say, its ⓘ (ADR 0096).
 */
export function PartChips({
  label,
  info,
  children,
}: {
  label: string
  info?: ReactNode
  children: ReactNode
}) {
  return (
    <div role="group" aria-label={label}>
      <Labelled label={label} info={info}>
        <div className="flex flex-wrap gap-2">{children}</div>
      </Labelled>
    </div>
  )
}
