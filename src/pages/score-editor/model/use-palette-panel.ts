import { LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'

/** A laptop's width: the palette a column beside the sheet. */
const LAPTOP = '(min-width: 64rem)'

/**
 * Whether the palette stands beside the sheet, at its right (ADR 0114): on a laptop and on a
 * phone on its side; at the foot otherwise.
 */
export function usePaletteBeside(): boolean {
  const onSide = useMediaQuery(LANDSCAPE_PHONE)
  return useMediaQuery(LAPTOP) || onSide
}
