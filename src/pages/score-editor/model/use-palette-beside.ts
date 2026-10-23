import { LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'

/** A laptop's width: the palette a column beside the sheet. */
const LAPTOP = '(min-width: 64rem)'

/**
 * Whether the palette stands beside the sheet (ADR 0071): on a laptop and on a phone on its side; at
 * the foot otherwise, where it has no side to choose (ADR 0085).
 */
export function usePaletteBeside(): boolean {
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  return useMediaQuery(LAPTOP) || onSide
}
