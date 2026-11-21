import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Listbox } from './Listbox'
import { OpensMark } from './NavMarks'
import type { OptionValue } from './option'
import { Segmented } from './Segmented'
import { SwitchRow } from './SwitchRow'

/** A row's room, as the canvas's `GROUP` draws it: 48 high, its name in the body's size. */
const ROW = 'flex min-h-12 w-full items-center gap-3 py-1.5 ps-4 pe-3 text-base'

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
      // In the laptop's Settings dialog a group is rows on the pane, as every settings card there.
      data-slot="settings-card"
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

/**
 * On or off as a row of the group: the kit's `SwitchRow` (a tap anywhere on the row turns it, its ⓘ
 * after the label) in the group's row, the group drawing the hairline between rows.
 */
export function GroupSwitch(props: Omit<ComponentProps<typeof SwitchRow>, 'className' | 'icon'>) {
  return <SwitchRow {...props} className={ROW} />
}

/** A row whose control stands at its end: a stepper, a picker. */
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
        <span aria-hidden className="text-base leading-[normal]">
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
 * A row that opens what it names, its value in Soft Ink and a chevron at its end: a sheet by default,
 * or with `render` a link to a page (a progression's songs and its other ways, the board's GROUP link).
 */
export function GroupLink({
  label,
  value,
  mark,
  setting,
  className,
  render,
  ...button
}: {
  label: string
  value?: string | undefined
  /** The value's glyph before it, in Soft Ink (a swipe slot's act, the board's P_SWIPE). */
  mark?: ReactNode
  setting?: string
  /** The page it opens, a link in place of the button (the row is then no sheet's trigger, nor a setting's home). */
  render?: useRender.RenderProp
} & Omit<ComponentProps<'button'>, 'value' | 'children'>) {
  return useRender({
    defaultTagName: 'button',
    render: render ?? <button type="button" aria-haspopup="dialog" data-setting={setting} />,
    props: mergeProps<'button'>(
      {
        ...button,
        className: cn(
          ROW,
          'text-left text-foreground no-underline transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06] focus-visible:outline-none',
          className,
        ),
      },
      {
        children: (
          <>
            <span className="shrink-0">{label}</span>
            {mark ? (
              <span className="flex min-w-0 flex-1 items-center justify-end gap-3 text-muted-foreground">
                {mark}
                <span className="truncate">{value}</span>
              </span>
            ) : (
              <span className="min-w-0 flex-1 truncate text-end text-muted-foreground">
                {value}
              </span>
            )}
            <OpensMark />
          </>
        ),
      },
    ),
  })
}

/**
 * One choice of several in a sheet, as the canvas's lists draw them (its Subdivision): the kit's
 * `Listbox` as rows 48 high in one white card, a hairline between them, the chosen one ticked.
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
    <Listbox
      label={label}
      className="overflow-hidden rounded-xl bg-card *:rows-line"
      optionClassName="min-h-12 px-4 text-base"
      groups={[
        {
          options: options.map((option) => ({
            key: option.value,
            content: option.label,
            selected: option.value === value,
            onChoose: () => onChange(option.value),
          })),
        },
      ]}
    />
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
  disabled = false,
}: {
  label: string
  onClick: () => void
  destructive?: boolean
  /** Nothing to do yet (Reset layout on a page as it came). */
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        ROW,
        'text-left transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        destructive ? 'text-destructive' : 'text-link',
      )}
    >
      {label}
    </button>
  )
}

/**
 * A row of values under a quiet heading (Also read as, Played), as the canvas's `GROUP` raw rows and
 * its `CHIPL`: each value a 32 sand pill, 8 apart; one that acts reaches 44 by its `::before`.
 */
export function GroupChips({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section aria-label={label} className="flex flex-col gap-2 px-4 py-3">
      <h3 className="font-sans text-sm font-normal text-muted-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2 *:relative *:flex *:h-8 *:items-center *:rounded-pill *:bg-muted *:px-3 *:text-subhead *:font-semibold">
        {children}
      </div>
    </section>
  )
}
