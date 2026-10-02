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

/** Ticks as beats in the shortest decimal the content reads back as them: `2`, `1.5`, `.5`, `.3333333333`. */
export function beatsText(ticks: Tick): string {
  const beats = ticks / TICKS_PER_BEAT
  const places = Array.from({ length: 16 }, (_, n) => n)
  const digits = places.find((n) => ticksIn(Number(beats.toFixed(n))) === ticks) ?? 16
  return String(Number(beats.toFixed(digits))).replace(/^0\./, '.')
}

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
