import { ChevronsUpDown } from 'lucide-react'
import { useId, useState, type ReactElement, type ReactNode } from 'react'
import { cn, useMediaQuery } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover'
import { Sheet, SheetContent, SheetTrigger } from '../Sheet'

/** Narrower than this, a picker opens as a bottom sheet; wider, as a popover under its value. */
const SHEET_WIDTH = '(max-width: 29.99rem)'

/** What a picker's panel is handed: how to close it, and where the focus lands as it opens. */
export interface PickerPanel {
  close(): void
  /** Spread on what takes the focus as the panel opens: the value chosen. */
  start: { readonly 'data-picker-start': string }
}

/** The one look of a picker's value (A5, Apple's pop-up button): its name, the value, ⌃⌄. */
const PICKER_TRIGGER =
  'inline-flex h-11 min-w-0 max-w-full items-center gap-2 rounded-control border border-border bg-card px-3 text-base whitespace-nowrap transition-colors duration-200 ease-out select-none hover:bg-muted data-popup-open:bg-muted'

/**
 * A picker's value with ⌃⌄ (ChevronsUpDown), opening what chooses it: a popover under the value, or
 * a bottom sheet on a phone below 30rem. Its name in soft ink before the value, kept for a screen
 * reader where `bare` leaves it off; Esc closes it, and the panel closes it on a choice.
 */
export function PickerShell({
  label,
  value,
  spoken,
  bare = false,
  wide = false,
  title = false,
  trigger: ownTrigger,
  className,
  children,
}: {
  label: string
  /** The value as the button shows it. */
  value: ReactNode
  /** The value in words, where the button's face is a picture or a short name. */
  spoken: string
  /** Under a name already printed: the value alone. */
  bare?: boolean
  /** A panel that holds a picture (the circle of fifths): a wider popover. */
  wide?: boolean
  /** A part of a name made of its pickers (a chord's root, type and bass; a scale's tonic and kind):
   * the value alone, in the name's serif on its fill, with the name's taller ⌃⌄. */
  title?: boolean
  /** A trigger that carries its own face (a floating bar's piece), in place of the picker's value. */
  trigger?: ReactElement
  className?: string
  children: (panel: PickerPanel) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const sheet = useMediaQuery(SHEET_WIDTH)
  // The value chosen takes the focus, so the arrows move from it at once.
  const focus = () => {
    const start = document.querySelector<HTMLElement>(`[data-picker-start="${id}"]`)
    // A list marks itself: its own tab stop, the option chosen, takes the focus.
    return (
      (start?.hasAttribute('tabindex')
        ? start
        : start?.querySelector<HTMLElement>('[tabindex="0"]')) ?? true
    )
  }
  const panel = { close: () => setOpen(false), start: { 'data-picker-start': id } }
  const face = (
    <>
      {bare || title ? null : (
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
      )}
      {/* The value bold, as the boards set a picker field (a progression's Key, the finder's Spelled in). */}
      <span aria-hidden className="min-w-0 truncate font-bold">
        {value}
      </span>
      {title ? (
        <TitleChevrons />
      ) : (
        <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  )
  const trigger = ownTrigger ?? (
    <button
      type="button"
      aria-label={`${label}: ${spoken}`}
      aria-haspopup="dialog"
      className={cn(PICKER_TRIGGER, title && TITLE_PART, className)}
    />
  )
  if (sheet) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={trigger}>{ownTrigger ? undefined : face}</SheetTrigger>
        <SheetContent title={label} initialFocus={focus}>
          {open ? children(panel) : null}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger}>{ownTrigger ? undefined : face}</PopoverTrigger>
      <PopoverContent
        aria-label={label}
        align="start"
        initialFocus={focus}
        className={cn(
          'max-h-(--available-height) overflow-y-auto',
          wide ? 'w-[min(24rem,calc(100vw-2rem))]' : 'w-[min(20rem,calc(100vw-2rem))]',
        )}
      >
        {children(panel)}
      </PopoverContent>
    </Popover>
  )
}

/**
 * One part of a name made of its pickers, the Chords canvas's PART value for value: the serif at 44
 * (56 on a laptop) and bold, on the fill, 14 round, 48 high at least, 2 8 4 12 inside; a long name
 * (half-whole diminished) wraps within the screen rather than running past it.
 */
const TITLE_PART =
  'h-auto min-h-12 max-w-full items-center gap-2 whitespace-normal [&>span]:min-w-0 [&>span]:text-left [&>span]:text-balance rounded-[14px] [&>span]:flex [&>span]:items-center border-0 bg-muted pt-0.5 pe-2 pb-1 ps-3 font-display text-[2.75rem] leading-[1.1] font-bold hover:bg-muted md:text-[3.5rem] [&>span]:font-bold'

/**
 * The name's ⌃⌄, the canvas's CHEV_UD: two chevrons 7 by 3.5 of a 12 by 18 box drawn at 10 by 15,
 * a 1.8 line, in ink at 55%; taller than a field's, as the name it sits beside.
 */
function TitleChevrons() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 18"
      width={10}
      height={15}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 self-center text-foreground opacity-55"
    >
      <path d="m2.5 6.5 3.5-3.5 3.5 3.5M2.5 11.5l3.5 3.5 3.5-3.5" />
    </svg>
  )
}
