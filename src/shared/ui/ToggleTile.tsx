import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Toggle } from './primitives/toggle'

/**
 * On or off as a tile: its picture (an icon, or a glyph such as the keys' rail wears) over its name.
 * `tip`, what it does or why it is closed, is its tooltip and a screen reader's description, never
 * a line on it (ADR 0096): a closed tile keeps the pointer, so its tooltip still says why. Off, it is
 * drawn in soft ink; on, it wears the paint of what is on, its ink on it.
 */
export function ToggleTile({
  label,
  tip,
  pressed,
  disabled = false,
  onPressedChange,
  icon: Icon,
  glyph,
}: {
  label: string
  tip?: string | undefined
  pressed: boolean
  disabled?: boolean
  onPressedChange: (on: boolean) => void
} & ({ icon: LucideIcon; glyph?: never } | { glyph: ReactNode; icon?: never })) {
  return (
    <Toggle
      size="tile"
      title={tip}
      pressed={pressed}
      disabled={disabled}
      onPressedChange={onPressedChange}
      className="disabled:pointer-events-auto disabled:hover:bg-card aria-pressed:border-transparent aria-pressed:bg-paint-grass aria-pressed:text-on-paint-grass"
    >
      {Icon ? (
        <Icon aria-hidden className="size-6" />
      ) : (
        <span aria-hidden className="grid h-6 place-items-center text-sm font-bold">
          {glyph}
        </span>
      )}
      <span className="text-center">{label}</span>
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
