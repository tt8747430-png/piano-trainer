/**
 * The keys' height docked under the chart (canvas R77, `KEYS76`'s medium): a phone's, a laptop's from
 * 64rem, and a phone's on its side, where 112 of 393 left the chart a row and a half.
 */
export const KEYS_PX: Readonly<Record<'phone' | 'side' | 'laptop', number>> = {
  phone: 112,
  side: 80,
  laptop: 170,
}
