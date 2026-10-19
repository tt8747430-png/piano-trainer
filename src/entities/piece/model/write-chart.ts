import type { ChartBar } from '@/shared/lib/arrangement'
import { ticksIn } from './beats'
import {
  beatsPerBar,
  beatsToTicks,
  chordSymbol,
  TICKS_PER_BEAT,
  type Meter,
  type Tick,
} from '@/shared/lib/music'

/** The longest decimal written before a fraction is: a 32nd's `.125`. */
const MOST_PLACES = 3

/**
 * Ticks as beats the content reads back as them: the shortest decimal (`2`, `1.5`, `.5`, `.125`), or
 * where one would run on, a fraction in its lowest terms (`1:3`, `5:6`).
 */
export function beatsText(ticks: Tick): string {
  const beats = ticks / TICKS_PER_BEAT
  const places = Array.from({ length: MOST_PLACES + 1 }, (_, n) => n)
  const digits = places.find((n) => ticksIn(Number(beats.toFixed(n))) === ticks)
  if (digits !== undefined) return String(Number(beats.toFixed(digits))).replace(/^0\./, '.')
  const divisor = gcd(ticks, TICKS_PER_BEAT)
  return `${ticks / divisor}:${TICKS_PER_BEAT / divisor}`
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/**
 * A bar as the chart writes it: its chords joined by `-`, without beats where they share the meter's
 * bar equally, else each with its own; a method code once when every chord shares it.
 */
export function writeBar(bar: ChartBar, meter: Meter): string {
  const [first] = bar.chords
  const sharing =
    beatsToTicks(bar.beats) === beatsToTicks(beatsPerBar(meter)) &&
    bar.chords.every((chord) => beatsToTicks(chord.beats) === beatsToTicks(first?.beats ?? 0))
  const oneMethod = bar.chords.every((chord) => chord.method === first?.method)
  return bar.chords
    .map((chord, i) => {
      const beats = sharing ? '' : `@${beatsText(beatsToTicks(chord.beats))}`
      const method = chord.method && (!oneMethod || i === 0) ? `:${chord.method}` : ''
      return `${chordSymbol(chord)}${beats}${method}`
    })
    .join('-')
}
