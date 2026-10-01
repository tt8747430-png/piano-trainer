import type { ChartBar } from '@/shared/lib/arrangement'
import { beatsPerBar, chordSymbol, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'

/** Ticks as beats in the shortest decimal the content reads back exactly: `2`, `1.5`, `.5`. */
export const beatsText = (ticks: Tick): string =>
  String(ticks / TICKS_PER_BEAT).replace(/^0\./, '.')

const ticksOf = (beats: number): Tick => Math.round(beats * TICKS_PER_BEAT)

/**
 * A bar as the chart writes it: its chords joined by `-`, without beats where they share the meter's
 * bar equally, else each with its own; a method code once when every chord shares it.
 */
export function writeBar(bar: ChartBar, meter: Meter): string {
  const [first] = bar.chords
  const sharing =
    ticksOf(bar.beats) === ticksOf(beatsPerBar(meter)) &&
    bar.chords.every((chord) => ticksOf(chord.beats) === ticksOf(first?.beats ?? 0))
  const oneMethod = bar.chords.every((chord) => chord.method === first?.method)
  return bar.chords
    .map((chord, i) => {
      const beats = sharing ? '' : `@${beatsText(ticksOf(chord.beats))}`
      const method = chord.method && (!oneMethod || i === 0) ? `:${chord.method}` : ''
      return `${chordSymbol(chord)}${beats}${method}`
    })
    .join('-')
}
