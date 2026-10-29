import type { PublicSort } from '@/shared/api/public-library'

/** What the Public library shows (its URL): how it is sorted, and what is searched. */
export interface PublicView {
  readonly sort: PublicSort
  readonly q: string
}

export const PUBLIC_SORTS = ['new', 'saved'] as const satisfies readonly PublicSort[]
