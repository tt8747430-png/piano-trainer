import { AudioWaveform, Music } from 'lucide-react'
import { LEFT_FIGURES, RIGHT_FIGURES, isLeftFigureId, isRightFigureId } from '@/entities/pattern'
import type { PublicEntry } from '@/shared/api/public-library'
import { localText, type Locale } from '@/shared/i18n'
import { keySymbol, parseKey, printedSymbol } from '@/shared/lib/music'
import { itemPaint } from '../model/item-paint'

/** A kind's tile: a song's note, a pattern's wave. */
const KIND_ICON = { song: Music, pattern: AudioWaveform } as const

/** A pattern's figures, the right hand's then the left's, by their names. */
function figuresOf({ meta }: Pick<PublicEntry, 'meta'>, locale: Locale): string[] {
  const rh =
    meta.rh && isRightFigureId(meta.rh) ? localText(RIGHT_FIGURES[meta.rh].name, locale) : ''
  const lh = meta.lh && isLeftFigureId(meta.lh) ? localText(LEFT_FIGURES[meta.lh].name, locale) : ''
  return [rh, lh].filter(Boolean)
}

/** A song's key, as printed, and its meter. */
function factsOf({ meta }: Pick<PublicEntry, 'meta'>): string[] {
  const key = meta.key ? parseKey(meta.key) : null
  return [key ? printedSymbol(keySymbol(key)) : '', meta.meter ?? ''].filter(Boolean)
}

/**
 * A published song's or pattern's face as the Public library's row shows it, and as Publish
 * previews it: its tile in a paint of its own (drawn from `id`), its title, who published it, and
 * what it is (a song's key and time, a pattern's figures) kept whole at the line's end.
 */
export function publicFace(
  entry: Pick<PublicEntry, 'id' | 'kind' | 'title' | 'authorName' | 'meta'>,
  locale: Locale,
) {
  const facts = entry.kind === 'pattern' ? figuresOf(entry, locale) : factsOf(entry)
  return {
    icon: KIND_ICON[entry.kind],
    paint: itemPaint(entry.id),
    title: entry.title,
    detail: entry.authorName,
    count: facts.length > 0 ? facts.join(' · ') : undefined,
  }
}
