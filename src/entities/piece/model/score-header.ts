import { isRecord, plainText } from '@/shared/lib'

/** The names a score prints under its title (Flat's credits), in the order they are asked for. */
export const HEADER_FIELDS = ['subtitle', 'composer', 'lyricist', 'arranger'] as const
export type HeaderField = (typeof HEADER_FIELDS)[number]

/**
 * What a score prints under its title (Flat's credits, ADR 0114): its subtitle centred under it, the
 * composer and the arranger at the right, the lyricist at the left; each as the learner typed it.
 */
export type ScoreHeader = Readonly<Partial<Record<HeaderField, string>>>

/** The longest a header's line takes. */
export const HEADER_MAX = 80

/** A header's line as the score keeps it: plain, trimmed, 80 characters at most; none where none is left. */
export function headerLine(text: string): string | undefined {
  const line = plainText(text).slice(0, HEADER_MAX).trim()
  return line === '' ? undefined : line
}

/** A header with one line given anew: an empty one takes it away. */
export function withHeaderLine(header: ScoreHeader, field: HeaderField, text: string): ScoreHeader {
  const line = headerLine(text)
  const { [field]: _was, ...rest } = header
  return line === undefined ? rest : { ...rest, [field]: line }
}

/** A saved header, read line by line; none where none of its lines reads. */
export function savedHeader(saved: unknown): ScoreHeader | undefined {
  if (!isRecord(saved)) return undefined
  let header: ScoreHeader = {}
  for (const field of HEADER_FIELDS) {
    const text = saved[field]
    if (typeof text === 'string') header = withHeaderLine(header, field, text)
  }
  return Object.keys(header).length > 0 ? header : undefined
}

/** The staff sizes a score is drawn at, as a share of its own (Flat's staff size, Dorico's space size). */
export const STAFF_SIZES = [75, 90, 100, 115, 130] as const
export type StaffSize = (typeof STAFF_SIZES)[number]
export const isStaffSize = (value: unknown): value is StaffSize =>
  STAFF_SIZES.some((size) => size === value)

/** The most bars a line may be set to hold (Flat's measures per system). */
export const BARS_PER_LINE = { min: 1, max: 8 } as const
export const isBarsPerLine = (value: unknown): value is number =>
  Number.isInteger(value) &&
  (value as number) >= BARS_PER_LINE.min &&
  (value as number) <= BARS_PER_LINE.max

/**
 * How a score is laid out (Flat's Layout): its staff size, and the most bars a line holds; a line
 * holds fewer where they do not fit. Neither said, the score's own size and lines as written.
 */
export interface PieceLayout {
  readonly staffSize?: StaffSize
  readonly barsPerLine?: number
}

/** A saved layout, read field by field; none where neither reads. */
export function savedLayout(saved: unknown): PieceLayout | undefined {
  if (!isRecord(saved)) return undefined
  const layout: PieceLayout = {
    ...(isStaffSize(saved.staffSize) && saved.staffSize !== 100
      ? { staffSize: saved.staffSize }
      : {}),
    ...(isBarsPerLine(saved.barsPerLine) ? { barsPerLine: saved.barsPerLine } : {}),
  }
  return Object.keys(layout).length > 0 ? layout : undefined
}

/** The scale a layout draws its staff at: 1 for the score's own size. */
export const staffScale = (layout: PieceLayout | undefined): number =>
  (layout?.staffSize ?? 100) / 100
