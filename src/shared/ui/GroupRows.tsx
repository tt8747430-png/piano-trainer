import { Check, ChevronRight } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import type { OptionValue } from './option'
import { Segmented } from './Segmented'

/** A row's room, as the canvas's `GROUP` draws it: 48 high, its name in the body's size. */
const ROW = 'flex min-h-12 w-full items-center gap-2.5 py-1.5 ps-4 pe-3 text-base'

/**
 * A group of settings' rows on the muted fill, as the canvas's `GROUP` draws them (canvas 179): one
 * rounded card, a hairline between its rows, nothing round each row. On the sheet's white where the
 * board passes `bg=SHEET` (figures read off a page, Profile's Streak).
 */
export function GroupRows({
  label,
  surface = 'fill',
  className,
  children,
}: {
  /** What a screen reader calls the group, where no heading names it. */
  label?: string
  /** The board's `bg`: the muted `FILL` for settings, the white `SHEET` for figures. */
  surface?: 'fill' | 'sheet'
  className?: string
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'flex flex-col rows-line overflow-hidden',
        // On the page's paper a group is the card (14 corners, the hairline ring), as the kit's GROUP
        // draws `bg=SHEET`; a filled group keeps its fill alone, 12 round.
        surface === 'sheet' ? 'card' : 'rounded-xl bg-muted',
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
 * A row whose control stands under its name, across the group's width, as the canvas's `GROUP` seg
 * rows draw it (canvas 127): a segmented choice, a slider that names itself (no `label` then).
 */
export function GroupField({
  label,
  setting,
  className,
  children,
}: {
  /** Its name over the control, hidden from a screen reader where the control says it. */
  label?: string
  setting?: string
  /** A wide control (the tempo's steps) takes more of the row. */
  className?: string
  children: ReactNode
}) {
  return (
    <div data-setting={setting} className={cn('flex flex-col gap-2 py-3 ps-4 pe-3', className)}>
      {label ? (
        <span aria-hidden className="text-base">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  )
}

/** A row of two or three choices: its name over the segmented control, heard once, from the control. */
export function GroupSegmented<V extends OptionValue>({
  setting,
  ...props
}: ComponentProps<typeof Segmented<V>> & { setting?: string }) {
  return (
    <GroupField label={props.label} setting={setting}>
      <Segmented {...props} />
    </GroupField>
  )
}

/**
 * A row that opens its choice (a sheet of options, a page, a picker's list): its name, its value in
 * Soft Ink, and a chevron. Given as a picker's `trigger`, the picker opens it.
 */
export function GroupLink({
  label,
  value,
  setting,
  className,
  ...button
}: {
  label: string
  value?: string | undefined
  setting?: string
} & Omit<ComponentProps<'button'>, 'value' | 'children'>) {
  return (
    <button
      type="button"
      data-setting={setting}
      aria-haspopup="dialog"
      {...button}
      className={cn(
        ROW,
        'text-left transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06] focus-visible:outline-none',
        className,
      )}
    >
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 flex-1 truncate text-end text-muted-foreground">{value}</span>
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
      className="flex flex-col rows-line overflow-hidden rounded-xl bg-card"
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

/**
 * A row that does something at once, in the link's colour, as the canvas's `GROUP` action rows; a
 * loss (Unpublish, Delete) in crimson, in a group of its own.
 */
export function GroupAction({
  label,
  onClick,
  destructive = false,
}: {
  label: string
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        ROW,
        'text-left transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06] focus-visible:outline-none',
        destructive ? 'text-destructive' : 'text-link',
      )}
    >
      {label}
    </button>
  )
}

/** A row of values under a quiet heading (Also read as, Played), as the canvas's `GROUP` raw rows. */
export function GroupChips({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section aria-label={label} className="flex flex-col gap-2 px-4 py-2.5">
      <h3 className="font-sans text-sm font-normal text-muted-foreground">{label}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </section>
  )
}
