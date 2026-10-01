import { cn } from '@/shared/lib'
import { Switch } from './primitives/switch'

/** On or off in its row of a list: the label, a note under it where there is one, and the switch. */
export function SwitchRow({
  label,
  detail,
  checked,
  disabled = false,
  onCheckedChange,
  className,
}: {
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
        'flex min-h-14 items-center justify-between gap-4 border-b border-border text-lg',
        className,
      )}
    >
      <span className="flex flex-col">
        {label}
        {detail ? <span className="text-sm text-muted-foreground">{detail}</span> : null}
      </span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </label>
  )
}
