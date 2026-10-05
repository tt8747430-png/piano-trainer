import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Toggle } from './primitives/toggle'

/**
 * On or off as a tile: its icon over its name, and a line under it where it has one (why it is
 * closed). Off, it is drawn in soft ink; on, it wears the paint of what is on, its ink on it.
 */
export function ToggleTile({
  label,
  detail,
  icon: Icon,
  pressed,
  disabled = false,
  onPressedChange,
}: {
  label: string
  detail?: string | undefined
  icon: LucideIcon
  pressed: boolean
  disabled?: boolean
  onPressedChange: (on: boolean) => void
}) {
  return (
    <Toggle
      size="tile"
      pressed={pressed}
      disabled={disabled}
      onPressedChange={onPressedChange}
      className="aria-pressed:border-transparent aria-pressed:bg-paint-grass aria-pressed:text-on-paint-grass"
    >
      <Icon aria-hidden className="size-6" />
      <span className="text-center">{label}</span>
      {detail ? (
        <>
          {' '}
          <span className="text-center text-xs">{detail}</span>
        </>
      ) : null}
    </Toggle>
  )
}

/** Toggle tiles side by side, three across on a phone, more as the width allows. */
export function ToggleGrid({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {children}
    </div>
  )
}
