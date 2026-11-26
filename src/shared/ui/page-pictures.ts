import * as P from './PagePictures'
import type { PagePicture } from './PagePictures'

/**
 * The pictures Practice's rows and cards wear (the canvas's `pic`): each page shows what it holds,
 * the keys of a chord, a scale on a staff, a leap, the numerals, a bass pattern, a drill, swung
 * eighths, a chord sheet, the tools' faces.
 */
export const PAGE_PICTURES = {
  keys: P.KeysPicture,
  staff: P.StaffPicture,
  arc: P.ArcPicture,
  roman: P.RomanPicture,
  roll: P.RollPicture,
  drill: P.DrillPicture,
  swing: P.SwingPicture,
  sixdim: P.SixDimPicture,
  chart: P.ChartPicture,
  metro: P.MetroPicture,
  needle: P.NeedlePicture,
  lens: P.LensPicture,
  circle: P.CirclePicture,
} as const satisfies Readonly<Record<string, PagePicture>>
