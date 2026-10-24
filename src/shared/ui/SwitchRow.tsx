import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import { Switch } from './primitives/switch'

/**
 * On or off in its row of a list: its picture where it has one, the label, what it does in an
 * `InfoTip` beside the label where it says more than its name (ADR 0096, never a line under it), and
 * the switch. A tap anywhere on the row turns it, but on the ⓘ.
 */
export function SwitchRow({
  icon,
  label,
  info,
  checked,
  disabled = false,
  onCheckedChange,
  className,
}: {
  /** What it turns on, drawn: an icon or a glyph. */
  icon?: ReactNode
  label: string
  /** What it does, opened from the ⓘ beside the label. */
  info?: ReactNode
  checked: boolean
  disabled?: boolean
  onCheckedChange: (on: boolean) => void
  className?: string
}) {
  const id = useId()
  return (
    <div
      data-slot="switch-row"
      className={cn(
        'relative flex min-h-14 items-center justify-between gap-4 border-b border-border py-2 text-lg',
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
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        {/* The label stretches over the row, so a tap anywhere on it turns the switch. */}
        <label htmlFor={id} className="min-w-0 after:absolute after:inset-0 after:content-['']">
          {label}
        </label>
        {info ? <InfoTip name={label}>{info}</InfoTip> : null}
      </span>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  )
}
