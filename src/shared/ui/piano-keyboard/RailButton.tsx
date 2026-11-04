import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

/**
 * A button in the keyboard's rail: a 44px target whose picture (an `icon`, or the glyph it is given
 * as children) sits on a chip inside the drawn rail at its foot, clear of the rail's edges and of
 * the next chip. The chip takes the hover, the pressed fill and the focus ring, so none reaches over
 * a key or is cut by the keys' scroller. It is named by its label, which a pointer resting on it
 * reads; `aria-pressed` makes it a toggle, its chip filled while it is on.
 */
export function RailButton({
  label,
  name,
  icon: Icon,
  title = label,
  className,
  children,
  ...props
}: {
  label: string
  /** Its name in sight under its picture (R29 A26), where the picture alone would not say it. */
  name?: string | undefined
  icon?: LucideIcon
} & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      className={cn(
        'group/rail relative flex min-w-11 shrink-0 flex-col items-center justify-end px-0.5 pb-1 text-on-key-rail outline-none disabled:opacity-40',
        name === undefined ? 'h-11' : 'h-14',
        className,
      )}
      {...props}
    >
      <span className="grid h-7 min-w-9 place-items-center rounded-control px-1.5 text-xs font-bold tracking-wide transition-colors duration-200 ease-out group-hover/rail:bg-on-key-rail/10 group-focus-visible/rail:outline-3 group-focus-visible/rail:-outline-offset-3 group-focus-visible/rail:outline-ring group-disabled/rail:bg-transparent group-aria-pressed/rail:bg-on-key-rail group-aria-pressed/rail:text-key-rail">
        {Icon ? <Icon aria-hidden className="size-5" /> : children}
      </span>
      {name === undefined ? null : (
        <span aria-hidden className="text-[11px] leading-tight whitespace-nowrap">
          {name}
        </span>
      )}
    </button>
  )
}
