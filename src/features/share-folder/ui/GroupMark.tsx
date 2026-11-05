import { groupTile } from './group-tile'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'

/** A group's or a shared folder's picture on its paint, at the head of its page. */
export function GroupMark({
  look,
  className,
}: {
  look: { readonly picture: string; readonly paint: string }
  className?: string
}) {
  const { icon: Icon, paint } = groupTile(look)
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-16 shrink-0 place-items-center rounded-card',
        PAINT[paint].fill,
        PAINT[paint].ink,
        className,
      )}
    >
      <Icon className="size-8" />
    </span>
  )
}
