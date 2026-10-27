import type { Entry } from './types'

/** The place an entry's page is on. */
type Shelf = 'songs' | 'practice'

/** Songs holds songs and listings; studies are practised (ADR 0052). */
export function shelfOf(kind: Entry['kind']): Shelf {
  switch (kind) {
    case 'song':
    case 'listing':
      return 'songs'
    case 'study':
      return 'practice'
  }
}
