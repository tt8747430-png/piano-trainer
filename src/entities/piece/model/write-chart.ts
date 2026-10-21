import type { ChartBar } from '@/shared/lib/arrangement'
import { ticksIn } from './beats'
import { JUMP_TOKENS } from './parse-chart'
import {
  beatsPerBar,
  beatsToTicks,
  chordSymbol,
  TICKS_PER_BEAT,
  type Barline,
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

/** The places a chord's beats need to read back as their ticks: a third of a beat's `.3333333333`. */
const CHART_PLACES = 10

/**
 * A chord's beats as the chart reads them back: `beatsText`, except that `@1:3` would read as a beat
 * and the method code `3`, so a third of a beat is the decimal that reads back as it.
 */
function chordBeatsText(ticks: Tick): string {
  const text = beatsText(ticks)
  if (!text.includes(':')) return text
  return String(Number((ticks / TICKS_PER_BEAT).toFixed(CHART_PLACES))).replace(/^0\./, '.')
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
  const chords = bar.chords
    .map((chord, i) => {
      const beats = sharing ? '' : `@${chordBeatsText(beatsToTicks(chord.beats))}`
      const method = chord.method && (!oneMethod || i === 0) ? `:${chord.method}` : ''
      return `${chordSymbol(chord)}${beats}${method}`
    })
    .join('-')
  return [
    ...(bar.segno ? ['Segno'] : []),
    ...(bar.coda ? ['Coda'] : []),
    ...(bar.repeatStart ? ['|:'] : []),
    ...(bar.ending ? [`[${bar.ending}`] : []),
    chords,
    ...(bar.barline ? [END_TOKEN[bar.barline]] : []),
    ...(bar.fine ? ['Fine'] : []),
    ...(bar.toCoda ? ['ToCoda'] : []),
    ...(bar.jump ? [JUMP_TOKENS[bar.jump]] : []),
  ].join(' ')
}

/** A bar's end as the chart writes it after the bar. */
const END_TOKEN: Readonly<Record<Barline, string>> = { repeat: ':|', double: '||', final: '|.' }
