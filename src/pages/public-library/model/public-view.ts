import type { PublicKind, PublicSort } from '@/shared/api/public-library'

/** What the Public library shows (its URL): songs or patterns, how they are sorted, what is searched. */
export interface PublicView {
  readonly kind: PublicKind
  readonly sort: PublicSort
  readonly q: string
}

export const PUBLIC_KINDS = ['song', 'pattern'] as const satisfies readonly PublicKind[]

export const PUBLIC_SORTS = ['new', 'saved'] as const satisfies readonly PublicSort[]
