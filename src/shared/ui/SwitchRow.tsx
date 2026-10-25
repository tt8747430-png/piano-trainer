import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import { lastWord } from './last-word'
import { Switch } from './primitives/switch'

/**
 * On or off in its row of a list: its picture where it has one, the label, what it does in an
 * `InfoTip` after the label's last word where it says more than its name (ADR 0096, never a line
 * under it), and the switch, named by the label alone. A tap anywhere on the row turns it, but on
 * the ⓘ.
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
  /** What it does, opened from the ⓘ after the label. */
  info?: ReactNode
  checked: boolean
  disabled?: boolean
  onCheckedChange: (on: boolean) => void
  className?: string
}) {
  const id = useId()
  const { head, last } = lastWord(label)
  const headId = `${id}-head`
  const lastId = `${id}-last`
  return (
    <div
      data-slot="switch-row"
      className={cn(
        'relative isolate flex min-h-14 items-center justify-between gap-4 border-b border-border py-2 text-lg',
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
      {/* The label stretches over the row, so a tap anywhere on it turns the switch; the ⓘ, over it,
          goes with the label's last word, never alone at a line's start. */}
      <label
        htmlFor={id}
        className="min-w-0 flex-1 after:absolute after:inset-0 after:content-['']"
      >
        {head ? <span id={headId}>{head} </span> : null}
        <span className="whitespace-nowrap">
          <span id={lastId}>{last}</span>
          {info ? (
            <InfoTip name={label} className="z-10 ms-1.5 align-middle">
              {info}
            </InfoTip>
          ) : null}
        </span>
      </label>
      <Switch
        id={id}
        aria-labelledby={head ? `${headId} ${lastId}` : lastId}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}
