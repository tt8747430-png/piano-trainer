import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

/**
 * A button in the keyboard's rail: a 44px target whose icon sits on a chip in the drawn rail at its
 * foot. The chip takes the hover, the pressed fill and the focus ring, so none reaches over a key or
 * is cut by the keys' scroller. `aria-pressed` makes it a toggle: its chip filled while it is on.
 */
export function RailButton({
  label,
  icon: Icon,
  className,
  ...props
}: { label: string; icon: LucideIcon } & Omit<ComponentProps<'button'>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'group/rail relative flex size-11 shrink-0 items-end justify-center text-on-key-rail outline-none',
        className,
      )}
      {...props}
    >
      <span className="grid h-7 w-9 place-items-center rounded-md transition-colors duration-200 ease-out group-hover/rail:bg-on-key-rail/10 group-focus-visible/rail:outline-3 group-focus-visible/rail:-outline-offset-3 group-focus-visible/rail:outline-ring group-aria-pressed/rail:bg-on-key-rail group-aria-pressed/rail:text-key-rail">
        <Icon aria-hidden className="size-5" />
      </span>
    </button>
  )
}
