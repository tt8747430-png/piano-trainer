import type { PanelSize } from '@/entities/page-layout'

/** The keys' three heights, Small, Medium and Large (canvas R76's KH and KHL): a phone's, and a laptop's from 64rem. */
export const KEYS_PX: Readonly<
  Record<'phone' | 'laptop', Readonly<Partial<Record<PanelSize, number>>>>
> = {
  phone: { small: 72, medium: 112, large: 168 },
  laptop: { small: 110, medium: 170, large: 240 },
}
