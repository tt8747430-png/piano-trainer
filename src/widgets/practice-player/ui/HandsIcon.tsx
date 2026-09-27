import { Hand } from 'lucide-react'
import type { Hands } from '@/shared/lib/schedule'

/** One hand, the other (mirrored), or both. */
export function HandsIcon({ hands }: { hands: Hands }) {
  if (hands === 'rh') return <Hand aria-hidden className="size-5" />
  if (hands === 'lh') return <Hand aria-hidden className="size-5 -scale-x-100" />
  return (
    <span aria-hidden className="flex">
      <Hand className="size-4 -scale-x-100" />
      <Hand className="size-4" />
    </span>
  )
}
