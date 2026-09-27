import type { Entry } from './types'

/** The place an entry's page is on. */
export type Shelf = 'songs' | 'practice'

/** Songs holds songs and listings; studies and progressions are practised (roadmap §3.9, ADR 0012). */
export function shelfOf(kind: Entry['kind']): Shelf {
  switch (kind) {
    case 'song':
    case 'listing':
      return 'songs'
    case 'study':
    case 'progression':
      return 'practice'
  }
}
