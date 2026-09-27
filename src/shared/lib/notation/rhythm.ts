import { isCompound, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { Duration } from './types'
import { ticksOf, valuesOf } from './values'

/** A stretch of a bar, in ticks from its start. */
export interface Span {
  readonly start: Tick
  readonly end: Tick
}

/** How a voice's beats are written: which are triplet beats, and where a boundary is written. */
export interface VoiceGrid {
  /** A boundary's written tick: itself, or the nearest 3 ticks in a beat on neither grid. */
  place(tick: Tick): Tick
  /** Whether the beat a tick lies in is written in triplets. */
  isTriplet(tick: Tick): boolean
}

const BEAT = TICKS_PER_BEAT
const beatOf = (tick: Tick) => Math.floor(tick / BEAT)

/**
 * A voice's grid from its spans: a beat whose inner boundaries all lie on the 3-tick grid is binary;
 * on the 2-tick grid, a triplet beat; on neither, its boundaries move to the nearest 3 ticks. In x/8
 * every tick is written as it is.
 */
export function voiceGrid(spans: readonly Span[], meter: Meter): VoiceGrid {
  if (isCompound(meter)) return { place: (tick) => tick, isTriplet: () => false }
  const inner = new Map<number, Tick[]>()
  for (const { start, end } of spans) {
    for (const tick of [start, end]) {
      if (tick % BEAT === 0) continue
      const beat = beatOf(tick)
      inner.set(beat, [...(inner.get(beat) ?? []), tick % BEAT])
    }
  }
  const triplets = new Set<number>()
  const offGrid = new Set<number>()
  for (const [beat, positions] of inner) {
    if (positions.every((at) => at % 3 === 0)) continue
    if (positions.every((at) => at % 2 === 0)) triplets.add(beat)
    else offGrid.add(beat)
  }
  return {
    place: (tick) => (offGrid.has(beatOf(tick)) ? Math.round(tick / 3) * 3 : tick),
    isTriplet: (tick) => triplets.has(beatOf(tick)),
  }
}

/**
 * Whether a value may be written at a tick (spec §2.4 step 5). A beat or longer starts on a beat and
 * ends on one, or half-way through one in x/4; in a four-beat bar it crosses the middle only from the
 * bar's start. Shorter lies inside one beat, starting on a multiple of half its undotted length.
 */
function allowed(
  at: Tick,
  duration: Duration,
  { meter, barTicks, end }: { meter: Meter; barTicks: Tick; end: Tick },
): boolean {
  const length = ticksOf(duration, meter)
  if (at + length > end) return false
  if (length >= BEAT) {
    const endsAt = (at + length) % BEAT
    const endsWell = endsAt === 0 || (!isCompound(meter) && endsAt === BEAT / 2)
    const middle = barTicks / 2
    const crossesMiddle = barTicks === 4 * BEAT && at !== 0 && at < middle && at + length > middle
    return at % BEAT === 0 && endsWell && !crossesMiddle
  }
  const beatStart = beatOf(at) * BEAT
  const undotted = duration.dots === 1 ? (length * 2) / 3 : length
  return at + length <= beatStart + BEAT && (at - beatStart) % (undotted / 2) === 0
}

/** A span of a bar as values, longest first, each piece where it starts: a note's are tied, a gap's are rests. */
export function spellSpan(
  span: Span,
  { meter, barTicks, grid }: { meter: Meter; barTicks: Tick; grid: VoiceGrid },
): { tick: Tick; duration: Duration }[] {
  const pieces: { tick: Tick; duration: Duration }[] = []
  let at = span.start
  while (at < span.end) {
    const duration = valuesOf(meter, grid.isTriplet(at)).find((value) =>
      allowed(at, value, { meter, barTicks, end: span.end }),
    )
    if (!duration) throw new RangeError(`No value writes ${at}–${span.end} in ${meter}`)
    pieces.push({ tick: at, duration })
    at += ticksOf(duration, meter)
  }
  return pieces
}
