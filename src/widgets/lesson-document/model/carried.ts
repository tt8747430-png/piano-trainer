import type { LessonBlock } from '@/entities/lesson'
import { isRecord } from '@/shared/lib'
import { sanitiseStyle, type BlockStyle } from '@/shared/lib/style'

/** Whether what a node carries is a lesson's block: an object of a kind, as `readAbout` reads one. */
export const isCarriedBlock = (value: unknown): value is LessonBlock =>
  isRecord(value) && typeof value['kind'] === 'string'

/** The block a node carries; none where it carries none. */
export const carriedBlockOf = (value: unknown): LessonBlock | null =>
  isCarriedBlock(value) ? value : null

/** The style a node carries, read through the one sanitiser; none where it carries none. */
export const carriedStyleOf = (value: unknown): BlockStyle | null =>
  isRecord(value) ? sanitiseStyle(value) : null

/** A block in a style (set in the document, over the one it was written with); unstyled, none. */
export function inStyle(block: LessonBlock, style: BlockStyle | null): LessonBlock {
  if (style) return { ...block, style }
  const { style: _written, ...plain } = block
  return plain
}
