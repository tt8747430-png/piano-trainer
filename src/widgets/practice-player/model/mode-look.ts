import { Ear, Eye, Hand, Waves, type LucideIcon } from 'lucide-react'
import type { PracticeMode } from '@/features/practice'
import type { Paint } from '@/shared/ui'

/** Each mode's picture and paint (R29 B8), as the Modes sheet's cards and the foot bar wear them. */
export const MODE_LOOK: Readonly<
  Record<PracticeMode, { readonly icon: LucideIcon; readonly paint: Paint }>
> = {
  listen: { icon: Ear, paint: 'sky' },
  wait: { icon: Eye, paint: 'grass' },
  practice: { icon: Hand, paint: 'yellow' },
  follow: { icon: Waves, paint: 'lilac' },
}
