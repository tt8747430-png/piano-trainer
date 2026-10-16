import type { LucideIcon } from 'lucide-react'
import { Toggle } from './primitives/toggle'

/**
 * One of a staff's own options, inline on its card: a small round toggle drawn as what it shows (a
 * hand for the fingers, `C E` for the notes' names, `C7` for the chords'), named by its tooltip and
 * for a screen reader; pressed, it sits on sand in ink.
 */
export function SheetOption({
  label,
  pressed,
  onPressedChange,
  icon: Icon,
  glyph,
}: {
  label: string
  pressed: boolean
  onPressedChange: (on: boolean) => void
} & ({ icon: LucideIcon; glyph?: never } | { glyph: string; icon?: never })) {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      aria-label={label}
      title={label}
      className="size-11 rounded-full border-transparent bg-transparent px-0 text-muted-foreground hover:text-foreground aria-pressed:border-transparent aria-pressed:bg-muted aria-pressed:text-foreground"
    >
      {Icon ? (
        <Icon aria-hidden />
      ) : (
        <span aria-hidden className="font-display text-sm font-semibold whitespace-nowrap">
          {glyph}
        </span>
      )}
    </Toggle>
  )
}
