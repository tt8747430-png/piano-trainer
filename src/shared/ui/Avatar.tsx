import { UserRound } from 'lucide-react'
import { cn } from '@/shared/lib'

const SIZE = {
  /** The tab bar's and sidebar's: an icon's size. */
  icon: 'size-6 text-sm lg:size-5 lg:text-xs',
  /** A row's: its tile's size. */
  row: 'size-12 text-xl',
  /** The Profile's and the Account's, at their top. */
  hero: 'size-24 text-5xl',
} as const

/**
 * The learner's picture: the first letter of their name on the yellow paint (memory-palaces',
 * Noji's), or for a guest the figure of a person. A picture: hidden from a screen reader, whatever
 * stands beside it names the learner.
 */
export function Avatar({
  name,
  size,
  className,
}: {
  /** The learner's name (or email); none for a guest. */
  name: string | null
  size: keyof typeof SIZE
  className?: string
}) {
  const initial = name ? (Array.from(name.trim())[0] ?? '').toLocaleUpperCase() : ''
  return (
    <span
      aria-hidden
      data-slot="avatar"
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-paint-yellow font-display leading-none font-semibold text-on-paint-yellow',
        SIZE[size],
        className,
      )}
    >
      {initial || <UserRound className="size-[55%]" />}
    </span>
  )
}
