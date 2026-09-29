import type { KeyParam, NumeralSize } from '@/shared/lib/music'

/** What the Progressions tool shows: numerals (`I-V-vi-IV`) in a key, at a chord size. */
export interface ProgressionsView {
  readonly key: KeyParam
  readonly p: string
  readonly size: NumeralSize
}
