import type { ReferencePart } from '@/entities/pattern'

/** Accompaniment's URL: the page of it shown, a part of the patterns' reference. */
export interface AccompanimentView {
  readonly show: ReferencePart
}
