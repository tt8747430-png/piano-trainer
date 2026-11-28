import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'

/**
 * A laptop's panel over what opened it, as the canvas's `POPOVER` draws every one (PlayerDesk's
 * Practice and Piano, Go to bar, MIDI keyboard, a song's properties): 16 round, 16 in, 12 between
 * its parts, its title in the sans at 17 over them, no Done (a click outside or Esc closes it).
 * `trigger` opens and closes it itself; without one, `anchor` places it. A phone shows the same
 * body as a bottom sheet.
 */
export function PanelPopover({
  title,
  open,
  onOpenChange,
  trigger,
  className,
  children,
  ...place
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The button that opens it, as an element or drawn from the props that make it do so. */
  trigger?: ComponentProps<typeof PopoverTrigger>['render']
  /** Its width (PlayerDesk's Practice 420, `w-105`; its Piano 380, `w-95`), and any type of its own. */
  className: string
  children: ReactNode
} & Pick<
  ComponentProps<typeof PopoverContent>,
  'side' | 'align' | 'sideOffset' | 'anchor' | 'initialFocus' | 'collisionAvoidance'
>) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {trigger ? <PopoverTrigger render={trigger} /> : null}
      {/* No taller than 760 nor the room below less 16, as the board's POPOVER: Base UI keeps 5 of it, the cap 11. */}
      <PopoverContent
        sideOffset={8}
        {...place}
        aria-label={title}
        className={cn(
          'max-h-[min(47.5rem,calc(var(--available-height)-11px))] gap-3 overflow-y-auto rounded-menu p-4',
          className,
        )}
      >
        <h2 className="font-sans text-lg/[normal] font-semibold">{title}</h2>
        {children}
      </PopoverContent>
    </Popover>
  )
}
