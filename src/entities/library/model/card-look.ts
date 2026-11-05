import { isRecord } from '@/shared/lib'
import { DEFAULT_STYLE, sanitiseStyle, type BlockStyle } from '@/shared/lib/style'

/** What a song's row shows beside its title. */
export const CARD_SHOWS = ['key', 'chords', 'progress'] as const
export type CardShow = (typeof CARD_SHOWS)[number]

/**
 * How a place of the library draws its rows (R29 B9, R32-C; memory-palaces' deck card style): their
 * style (its spacing is also how tall they stand) and what a song's row shows. Saved per place (a
 * folder, or Home).
 */
export interface CardLook {
  readonly style: BlockStyle
  readonly show: Readonly<Record<CardShow, boolean>>
}

export const DEFAULT_CARD_LOOK: CardLook = {
  style: DEFAULT_STYLE,
  show: { key: true, chords: true, progress: true },
}

/** Any value read as a card look: what it says that is valid, the default for the rest. */
export function sanitiseCardLook(value: unknown): CardLook {
  const saved = isRecord(value) ? value : {}
  const show = isRecord(saved.show) ? saved.show : {}
  return {
    style: sanitiseStyle(saved.style),
    show: {
      key: typeof show.key === 'boolean' ? show.key : DEFAULT_CARD_LOOK.show.key,
      chords: typeof show.chords === 'boolean' ? show.chords : DEFAULT_CARD_LOOK.show.chords,
      progress:
        typeof show.progress === 'boolean' ? show.progress : DEFAULT_CARD_LOOK.show.progress,
    },
  }
}

/** A saved map of looks: each place `isPlace` names, its look read. */
export function sanitiseCardLooks<P extends string>(
  value: unknown,
  isPlace: (place: string) => place is P,
): Partial<Record<P, CardLook>> {
  if (!isRecord(value)) return {}
  const looks: Partial<Record<P, CardLook>> = {}
  for (const [place, look] of Object.entries(value))
    if (isPlace(place)) looks[place] = sanitiseCardLook(look)
  return looks
}
