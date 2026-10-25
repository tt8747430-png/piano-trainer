import type { StaffId } from '@/shared/lib/notation'
import type { Extent, Lyric } from '../layout'
import { textBox } from './svg-glyphs'

/**
 * Each syllable Verovio printed under its note (ADR 0093), in the line's px (`at` turns Verovio's
 * units into them): its note's staff and tick and its verse, as `scoreToMei` names it
 * (`v-<staff>-<tick>-<verse>`), and its text's box, as wide as its letters: where a tap on it opens
 * the Lyrics field there (ADR 0096).
 */
export function syllablesOf(svg: SVGSVGElement, at: (box: Extent) => Extent): Lyric[] {
  return [...svg.querySelectorAll('g.verse[id^="v-"]')].flatMap((verse) => {
    const [, staff, tick, n] = verse.id.split('-')
    const box = textBox(verse.querySelector('text'), 'start')
    if (!staff || !box) return []
    return [{ staff: staff as StaffId, tick: Number(tick), verse: Number(n), ...at(box) }]
  })
}
