import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

/** A button in the keyboard's rail: a 44px target whose icon sits in the drawn rail at its foot. */
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
        'relative flex size-11 shrink-0 items-end justify-center rounded-sm pb-1 text-on-key-black transition-opacity duration-80 ease-out outline-none hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  )
}
