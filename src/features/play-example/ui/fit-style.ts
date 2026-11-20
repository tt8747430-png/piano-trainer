import type { CSSProperties } from 'react'

/**
 * A row's style at `zoom`, shrunk to fit where it is under 1: its zoom, and the same as `--fit`, so a
 * reach drawn inside it (a bar's band) holds 44px on screen. None at full size.
 */
export const fitStyle = (zoom: number): (CSSProperties & { '--fit': number }) | undefined =>
  zoom < 1 ? { zoom, '--fit': zoom } : undefined
