import { Heart } from 'lucide-react'
import { cn } from '@/shared/lib'
import { ROW_CONTROL } from './library-row-class'

/**
 * The ♡ at a library row's end (canvas 133, Songs' and Practice's alike): an outline, filled in ink
 * while it is a favourite, one tap to change it; named by what the tap does.
 */
export function HeartToggle({
  pressed,
  label,
  onToggle,
  className,
}: {
  pressed: boolean
  /** What a tap does: Favourite, or Remove from favourites. */
  label: string
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        ROW_CONTROL,
        'aria-pressed:text-foreground aria-pressed:[&_svg]:fill-current',
        className,
      )}
    >
      <Heart aria-hidden />
    </button>
  )
}
