import { ChevronsUpDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
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
  'inline-flex h-11 min-w-0 max-w-full items-center gap-2 rounded-control border border-input bg-card px-3 text-base whitespace-nowrap transition-colors duration-200 ease-out select-none hover:bg-muted data-popup-open:bg-muted'

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
      {bare ? null : (
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
      )}
      <span aria-hidden className="min-w-0 truncate font-semibold">
        {value}
      </span>
      <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
    </>
  )
  const trigger = (
    <button
      type="button"
      aria-label={`${label}: ${spoken}`}
      aria-haspopup="dialog"
      className={cn(PICKER_TRIGGER, className)}
    />
  )
  if (sheet) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={trigger}>{face}</SheetTrigger>
        <SheetContent title={label} initialFocus={focus}>
          {open ? children(panel) : null}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger}>{face}</PopoverTrigger>
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
