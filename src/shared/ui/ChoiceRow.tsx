import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Paint } from './paint'
import { cn } from '@/shared/lib'
import { RowFace } from './RowFace'
import { rowClass } from './row-class'

/**
 * A settings row whose value is chosen in place: its tile, its name, and at its end the choice (a
 * `bare` `Dropdown` showing the value), as a phone's settings show "Language  English ⌄".
 */
export function ChoiceRow({
  title,
  icon,
  paint,
  children,
}: {
  title: string
  icon: LucideIcon
  paint: Paint
  /** The choice: a `Dropdown`, `bare`. */
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        rowClass(true),
        'hover:bg-transparent',
        // The choice as a phone's settings show it: the value in soft ink and its chevron, no box,
        // the muted fill only under the pointer.
        '[&_[data-slot=select-trigger]]:max-w-[55%] [&_[data-slot=select-trigger]]:shrink [&_[data-slot=select-trigger]]:border-transparent [&_[data-slot=select-trigger]]:bg-transparent [&_[data-slot=select-trigger]]:px-2 [&_[data-slot=select-trigger]]:text-muted-foreground [&_[data-slot=select-trigger]:hover]:bg-muted [&_[data-slot=select-value]]:font-normal',
      )}
    >
      <RowFace title={title} icon={icon} paint={paint} end={children} />
    </div>
  )
}
