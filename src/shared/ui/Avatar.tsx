import { UserRound } from 'lucide-react'
import { cn } from '@/shared/lib'

const SIZE = {
  /** The tab bar's and sidebar's: an icon's size. */
  icon: 'size-6 text-sm lg:size-5 lg:text-xs',
  /** A byline's: beside a name. */
  byline: 'size-11 text-lg',
  /** A row's: its tile's size. */
  row: 'size-12 text-xl',
  /** The Profile's and the Account's, at their top. */
  hero: 'size-24 text-5xl',
} as const

/** Whether a picture is an uploaded one's address, which an image shows. */
const isAddress = (picture: string) => /^(https?:|blob:|data:)/.test(picture)

/**
 * The learner's picture: the one they uploaded, else the first letter of their name on the yellow
 * paint (memory-palaces', Noji's), or for a guest the figure of a person. A picture: hidden from a
 * screen reader, whatever stands beside it names the learner.
 */
export function Avatar({
  name,
  size,
  picture,
  className,
}: {
  /** The learner's name (or email); none for a guest. */
  name: string | null
  size: keyof typeof SIZE
  /** An uploaded picture's address; none, their initial. */
  picture?: string | null
  className?: string
}) {
  const initial = name ? (Array.from(name.trim())[0] ?? '').toLocaleUpperCase() : ''
  return (
    <span
      aria-hidden
      data-slot="avatar"
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-pill bg-paint-yellow font-display leading-none font-semibold text-on-paint-yellow',
        SIZE[size],
        className,
      )}
    >
      {picture && isAddress(picture) ? (
        <img src={picture} alt="" className="size-full object-cover" />
      ) : (
        initial || <UserRound className="size-[55%]" />
      )}
    </span>
  )
}
