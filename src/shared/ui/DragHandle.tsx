import { GripVertical } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib'

/**
 * The one thing a drag starts from, by mouse, held finger or keyboard: a 44 button at the row's edge
 * with the grip in Soft Ink, named for what it moves ("Move Verse"). The sortable's attributes,
 * listeners and activator ref are spread onto it.
 */
export function DragHandle({
  label,
  className,
  ...props
}: { label: string } & ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'grid size-11 shrink-0 cursor-grab touch-none place-items-center rounded-control text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted active:cursor-grabbing [&_svg]:size-5',
        className,
      )}
      {...props}
    >
      <GripVertical aria-hidden />
    </button>
  )
}
