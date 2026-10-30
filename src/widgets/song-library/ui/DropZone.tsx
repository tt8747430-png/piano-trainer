import { useDroppable } from '@dnd-kit/core'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { ZONE } from '../model/library-dnd'

/**
 * A place on Select's bar that takes what a row's face carries (Archive, Move out), standing where
 * the bar's actions stood while the rows are carried: its icon over its name, lit while what is
 * carried is over it.
 */
export function DropZone({
  zone,
  label,
  icon: Icon,
  className,
}: {
  zone: string
  label: string
  icon: LucideIcon
  className?: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `${ZONE}${zone}` })
  return (
    <div
      ref={setNodeRef}
      data-drop={isOver ? '' : undefined}
      data-slot="drop-zone"
      className={cn(
        'flex h-14 min-w-24 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl border border-dashed border-input px-3 text-xs transition-colors duration-200 ease-out data-drop:border-solid data-drop:border-selected data-drop:bg-selected/15',
        className,
      )}
    >
      <Icon aria-hidden className="size-5" />
      <span className="max-w-40 truncate">{label}</span>
    </div>
  )
}
