import type { AccompanimentPart } from '@/entities/pattern'

/** Accompaniment's URL: the part of it shown. */
export interface AccompanimentView {
  readonly show: AccompanimentPart
}
