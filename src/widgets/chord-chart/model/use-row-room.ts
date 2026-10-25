import { useMediaQuery } from '@/shared/lib'

/** A laptop's width, and a tablet's or a phone's on its side. */
const LAPTOP = '(min-width: 64rem)'
const TABLET = '(min-width: 40rem)'

/**
 * How many beats a row of the grid holds before a line wraps (ADR 0099): two 4-beat bars on a phone
 * held upright, four on a tablet or a phone on its side, eight on a laptop.
 */
export function useRowRoom(): number {
  const laptop = useMediaQuery(LAPTOP)
  const tablet = useMediaQuery(TABLET)
  return laptop ? 32 : tablet ? 16 : 8
}
