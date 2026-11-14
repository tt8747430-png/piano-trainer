import { Check, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** A row's room, as the canvas's `GROUP` draws it: 48 high, its name in the body's size. */
const ROW = 'flex min-h-12 w-full items-center gap-2.5 py-1.5 ps-4 pe-3 text-base'

/**
 * A group of settings' rows on the muted fill, as the canvas's `GROUP` draws them (canvas 179): one
 * rounded card, a hairline between its rows, nothing round each row.
 */
export function GroupRows({
  label,
  className,
  children,
}: {
  /** What a screen reader calls the group, where no heading names it. */
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex flex-col divide-y divide-border overflow-hidden rounded-xl bg-muted',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** A row whose control stands at its end: a stepper, a switch. */
export function GroupRow({
  label,
  setting,
  children,
}: {
  label: ReactNode
  /** The preference it sets (`data-setting`): the one page drawing it is its home (R18). */
  setting?: string
  children: ReactNode
}) {
  return (
    <div data-setting={setting} className={ROW}>
      <span className="min-w-0 flex-1">{label}</span>
      {children}
    </div>
  )
}

/**
 * A row that opens its choice (a sheet of options, a page): its name, its value in Soft Ink, and a
 * chevron.
 */
export function GroupLink({
  label,
  value,
  setting,
  onClick,
}: {
  label: string
  value?: string | undefined
  setting?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      data-setting={setting}
      aria-haspopup="dialog"
      onClick={onClick}
      className={cn(
        ROW,
        'text-left transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06] focus-visible:outline-none',
      )}
    >
      <span className="min-w-0 flex-1">{label}</span>
      {value ? <span className="max-w-[55%] truncate text-muted-foreground">{value}</span> : null}
      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}

/**
 * One choice of several in a sheet, as the canvas's lists draw them (its Subdivision): rows 48 high
 * in one white card, a hairline between them, the chosen one ticked in the link's colour.
 */
export function ChoiceList<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { readonly value: T; readonly label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-col divide-y divide-border overflow-hidden rounded-xl bg-card"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className="flex min-h-12 items-center px-4 text-left text-base transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
        >
          <span className="min-w-0 flex-1">{option.label}</span>
          {option.value === value ? (
            <Check aria-hidden className="size-5 shrink-0 text-link" strokeWidth={2.5} />
          ) : null}
        </button>
      ))}
    </div>
  )
}
