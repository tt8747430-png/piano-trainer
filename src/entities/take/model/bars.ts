import { beatsPerBar } from '@/shared/lib/music'
import { LONGEST_TAKE_MS, type Take } from './types'

/** A full bar of the take's meter at its tempo, in milliseconds: the scale a roll draws a bar to. */
export const barMs = (take: Pick<Take, 'meter' | 'tempo'>): number =>
  (beatsPerBar(take.meter) * 60_000) / take.tempo

/** The bars the take spans, a bar begun counting whole: at least one. */
export const takeBarCount = (take: Pick<Take, 'bars'>): number => Math.max(1, take.bars.length - 1)

/** Where bar `bar` (from 0) of the take starts, in milliseconds from its downbeat. */
export const takeBarStart = (take: Pick<Take, 'bars'>, bar: number): number => take.bars[bar] ?? 0

/**
 * The take cut to its bars `first`…`last` (from 0) in place: notes and presses
 * before the first dropped, the rest moved back by the bars cut, a note or press held past the last
 * bar's end cut there (a pedal held over the first bar's start held from it), the length whole bars,
 * so the take stays on the click's beats; it starts that much later in the piece.
 */
export function keepBars(take: Take, first: number, last: number): Take {
  const count = takeBarCount(take)
  if (!(
    Number.isInteger(first) &&
    Number.isInteger(last) &&
    0 <= first &&
    first <= last &&
    last < count
  ))
    throw new RangeError(`Bars ${first}–${last} are not in a take of ${count}`)
  const start = takeBarStart(take, first)
  const end = Math.min(take.bars[last + 1] ?? take.length, LONGEST_TAKE_MS)
  return {
    ...take,
    notes: take.notes
      .filter((note) => note.at >= start && note.at < end)
      .map((note) => ({ ...note, at: note.at - start, held: Math.min(note.held, end - note.at) })),
    pedals: take.pedals
      .filter((press) => press.up > start && press.down < end)
      .map((press) => ({
        ...press,
        down: Math.max(press.down, start) - start,
        up: Math.min(press.up, end) - start,
      })),
    length: end - start,
    bars: take.bars.slice(first, last + 2).map((at) => at - start),
    fromBar: take.fromBar + first,
  }
}
