import { Heart } from 'lucide-react'

/**
 * The ♡ beside a page's name (the boards' Favourite on a progression, a pattern, an exercise): bare, a 44
 * target, its 22 heart in soft ink, filled crimson once a favourite; no glass, which is the bar's. Named by
 * what a tap does.
 */
export function NameHeart({
  pressed,
  label,
  onToggle,
}: {
  pressed: boolean
  /** What a tap does: Favourite, or Remove from Favourites. */
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onToggle}
      className="flex size-11 shrink-0 items-center justify-center rounded-pill text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted aria-pressed:text-heart [&_svg]:size-5.5 aria-pressed:[&_svg]:fill-current"
    >
      <Heart aria-hidden />
    </button>
  )
}
