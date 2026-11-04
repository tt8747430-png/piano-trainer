import { isRecord } from '@/shared/lib'

/** A range a number of the layout is kept in, its step, and what it is where the score says none. */
interface Range {
  readonly min: number
  readonly max: number
  readonly step: number
  readonly standard: number
}

/** The page sizes a score is printed on (Flat's Pages). */
export const PAGE_SIZES = ['a4', 'a3', 'letter'] as const
export type PageSize = (typeof PAGE_SIZES)[number]
/** Each page size's width and height in millimetres, upright. */
export const PAGE_MM: Readonly<Record<PageSize, { width: number; height: number }>> = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  letter: { width: 215.9, height: 279.4 },
}
export const ORIENTATIONS = ['portrait', 'landscape'] as const
export type Orientation = (typeof ORIENTATIONS)[number]

/** A page's four margins (Flat's, in centimetres). */
export const MARGIN_SIDES = ['top', 'bottom', 'left', 'right'] as const
export type MarginSide = (typeof MARGIN_SIDES)[number]
export type PageMargins = Readonly<Record<MarginSide, number>>

/** When a staff with nothing in a system is left out (Flat's Hide empty staves). */
export const HIDE_EMPTY = ['never', 'afterFirst', 'always'] as const
export type HideEmpty = (typeof HIDE_EMPTY)[number]
/** Where the bars' numbers print (Flat's Measure numbers). */
export const MEASURE_NUMBERS = ['every', 'system', 'none'] as const
export type MeasureNumbers = (typeof MEASURE_NUMBERS)[number]
/** The music fonts the engraver ships (SMuFL's): Bravura, Petaluma's handwriting, Leland. */
export const MUSIC_FONTS = ['Bravura', 'Petaluma', 'Leland'] as const
export type MusicFont = (typeof MUSIC_FONTS)[number]

/** The staff's height, line to line, in millimetres (Flat's Staff size). */
export const STAFF_MM: Range = { min: 5, max: 9, step: 0.1, standard: 7 }
/** A margin in centimetres. */
export const MARGIN_CM: Range = { min: 0, max: 5, step: 0.1, standard: 1.5 }
/** The room between the staves of a system, and between systems, in staff spaces. */
export const STAFF_SPACE: Range = { min: 2, max: 16, step: 0.5, standard: 6 }
export const SYSTEM_SPACE: Range = { min: 2, max: 16, step: 0.5, standard: 6 }
/** How far apart the notes are set, Compact (0) to Wide (100). */
export const NOTE_SPACING: Range = { min: 0, max: 100, step: 5, standard: 50 }
/** The most bars a system may be set to hold (Flat's Measures per system); none is Auto. */
export const BARS_PER_LINE = { min: 1, max: 8 } as const

/**
 * How a score is laid out (Flat's Layout, A40): its pages, staff size, spacing, bars a system, the
 * bars' numbers, the staves left out where empty and its music font. A field the score does not say
 * is its standard one; a layout of none is the score's own.
 */
export interface PieceLayout {
  readonly pageSize?: PageSize
  readonly orientation?: Orientation
  readonly margins?: PageMargins
  /** Millimetres, 5.0 to 9.0. */
  readonly staffSize?: number
  readonly staffSpace?: number
  readonly systemSpace?: number
  readonly noteSpacing?: number
  /** Measures per system; none is Auto. */
  readonly barsPerLine?: number
  readonly measureNumbers?: MeasureNumbers
  readonly hideEmpty?: HideEmpty
  readonly font?: MusicFont
}

/** Every field of a layout, standard where the score says none. */
export type FullLayout = Required<Omit<PieceLayout, 'barsPerLine'>> & {
  readonly barsPerLine: number | null
}

const STANDARD_MARGINS: PageMargins = { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 }

export const STANDARD_LAYOUT: FullLayout = {
  pageSize: 'a4',
  orientation: 'portrait',
  margins: STANDARD_MARGINS,
  staffSize: STAFF_MM.standard,
  staffSpace: STAFF_SPACE.standard,
  systemSpace: SYSTEM_SPACE.standard,
  noteSpacing: NOTE_SPACING.standard,
  barsPerLine: null,
  measureNumbers: 'system',
  hideEmpty: 'never',
  font: 'Bravura',
}

/** A number kept in its range, on its step; none where it is no number. */
function inRange(value: unknown, range: Range): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined
  const stepped = Math.round(value / range.step) * range.step
  return Math.round(Math.min(range.max, Math.max(range.min, stepped)) * 100) / 100
}

const oneOf = <T extends string>(choices: readonly T[], value: unknown): T | undefined =>
  choices.find((choice) => choice === value)

export const isBarsPerLine = (value: unknown): value is number =>
  Number.isInteger(value) &&
  (value as number) >= BARS_PER_LINE.min &&
  (value as number) <= BARS_PER_LINE.max

/**
 * A layout as the score keeps it, read field by field (a field that does not read, or reads as the
 * standard, is left out); none where nothing is left.
 */
export function savedLayout(saved: unknown): PieceLayout | undefined {
  if (!isRecord(saved)) return undefined
  const kept: Record<string, unknown> = {}
  const keep = <K extends keyof PieceLayout>(key: K, value: PieceLayout[K] | undefined) => {
    const standard = STANDARD_LAYOUT[key as keyof FullLayout]
    if (value !== undefined && JSON.stringify(value) !== JSON.stringify(standard)) kept[key] = value
  }
  keep('pageSize', oneOf(PAGE_SIZES, saved.pageSize))
  keep('orientation', oneOf(ORIENTATIONS, saved.orientation))
  if (isRecord(saved.margins)) {
    const margins = saved.margins
    const read = MARGIN_SIDES.map((side) => inRange(margins[side], MARGIN_CM))
    if (read.every((each) => each !== undefined))
      keep(
        'margins',
        Object.fromEntries(MARGIN_SIDES.map((side, i) => [side, read[i]])) as PageMargins,
      )
  }
  keep('staffSize', inRange(saved.staffSize, STAFF_MM))
  keep('staffSpace', inRange(saved.staffSpace, STAFF_SPACE))
  keep('systemSpace', inRange(saved.systemSpace, SYSTEM_SPACE))
  keep('noteSpacing', inRange(saved.noteSpacing, NOTE_SPACING))
  if (isBarsPerLine(saved.barsPerLine)) kept.barsPerLine = saved.barsPerLine
  keep('measureNumbers', oneOf(MEASURE_NUMBERS, saved.measureNumbers))
  keep('hideEmpty', oneOf(HIDE_EMPTY, saved.hideEmpty))
  keep('font', oneOf(MUSIC_FONTS, saved.font))
  return Object.keys(kept).length > 0 ? (kept as PieceLayout) : undefined
}

/** Every field of a score's layout, its own where it says one, else the standard. */
export const fullLayout = (layout: PieceLayout | undefined): FullLayout => ({
  ...STANDARD_LAYOUT,
  ...layout,
  barsPerLine: layout?.barsPerLine ?? null,
})

/** The page's width and height in millimetres, as it is turned. */
export function pageMm(layout: PieceLayout | undefined): { width: number; height: number } {
  const { pageSize, orientation } = fullLayout(layout)
  const { width, height } = PAGE_MM[pageSize]
  return orientation === 'landscape' ? { width: height, height: width } : { width, height }
}

/** The scale a layout draws its staff at on the screen's sheet: 1 for the standard 7 mm. */
export const staffScale = (layout: PieceLayout | undefined): number =>
  (layout?.staffSize ?? STAFF_MM.standard) / STAFF_MM.standard
