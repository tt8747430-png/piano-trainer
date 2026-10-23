import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Switch } from './primitives/switch'

/**
 * On or off in its row of a list: its picture where it has one, the label, a note under it where
 * there is one, and the switch.
 */
export function SwitchRow({
  icon,
  label,
  detail,
  checked,
  disabled = false,
  onCheckedChange,
  className,
}: {
  /** What it turns on, drawn: an icon or a glyph. */
  icon?: ReactNode
  label: string
  detail?: string | undefined
  checked: boolean
  disabled?: boolean
  onCheckedChange: (on: boolean) => void
  className?: string
}) {
  return (
    <label
      className={cn(
        'flex min-h-14 items-center justify-between gap-4 border-b border-border py-2 text-lg',
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground [&_svg]:size-5"
        >
          {icon}
        </span>
      ) : null}
      <span className="flex flex-1 flex-col">
        {label}
        {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
      </span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </label>
  )
}
