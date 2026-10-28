import { isCompound, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import type { Duration, Tuplet } from './types'
import { NOTE_VALUES, sixtyFourth, ticksOf, tupletOf, valuesOf } from './values'

/** A stretch of a bar, in ticks from its start. */
export interface Span {
  readonly start: Tick
  readonly end: Tick
}

/** A stretch of a bar written as a tuplet: its notes `num` in the time of `numbase`. */
export interface TupletSpan extends Span {
  readonly tuplet: Tuplet
}

/** How a voice's bar is written: where its tuplets lie, and where a boundary is written. */
export interface VoiceGrid {
  /** A boundary's written tick: itself, or the nearest 64th where no value or tuplet writes it. */
  place(tick: Tick): Tick
  /** The tuplet a tick lies in, or null. */
  tupletAt(tick: Tick): TupletSpan | null
  /** Where the first tuplet after a tick starts, or null. */
  nextTuplet(tick: Tick): Tick | null
}

const BEAT = TICKS_PER_BEAT
/** The lengths a tuplet may span, shortest first: a quarter of a beat to a bar of four. */
const WINDOWS = [BEAT / 4, BEAT / 2, BEAT, 2 * BEAT, 4 * BEAT]
/** The tuplets looked for, by meter kind, fewest notes first. */
const COUNTS = { simple: [3, 5, 6, 7, 9], compound: [2, 4, 5, 7, 8, 9] } as const

/** Whether a length is one of the values written plainly (whole to 64th, undotted). */
const isPlainValue = (ticks: number, meter: Meter) =>
  NOTE_VALUES.some((value) => ticksOf({ value, dots: 0 }, meter) === ticks)

/** How a window of a voice writes as one tuplet: its grid (finer is worse) and whether every piece is one note of it. */
interface Fit {
  readonly tuplet: Tuplet
  readonly grid: Tick
  readonly whole: boolean
}

/**
 * The tuplet that writes a window's inner boundaries, the coarsest grid first (a triplet's 8ths
 * before its 16ths); between a tuplet and one of twice its notes on the same grid (a triplet's 16ths
 * and a sextuplet), the larger where every piece is one of its notes, else the smaller.
 */
function fitOf(
  window: Span,
  inner: readonly Tick[],
  pieces: readonly Tick[],
  meter: Meter,
): Fit | null {
  const length = window.end - window.start
  const fits: Fit[] = []
  for (const num of COUNTS[isCompound(meter) ? 'compound' : 'simple']) {
    const tuplet = tupletOf(num, meter)
    if (!tuplet || !isPlainValue(length / tuplet.numbase, meter)) continue
    const unit = length / num
    // The tuplet's notes halved while they stay a 64th of it at least.
    for (let grid = unit; grid >= unit / 2 ** 6; grid /= 2) {
      if (!Number.isInteger(grid) || (grid * num) / tuplet.numbase < sixtyFourth(meter)) break
      if (inner.every((at) => (at - window.start) % grid === 0)) {
        fits.push({ tuplet, grid, whole: pieces.every((piece) => piece === unit) })
        break
      }
    }
  }
  return (
    fits.sort(
      (a, b) => b.grid - a.grid || Number(b.whole) - Number(a.whole) || a.tuplet.num - b.tuplet.num,
    )[0] ?? null
  )
}

/** A window's place among those that fit equally well: the beat first, then longer, then shorter. */
const rank = (length: Tick) =>
  length >= BEAT ? Math.log2(length / BEAT) : 3 + Math.log2(BEAT / length)

/** The marks a window's notes and rests fall between: its boundaries inside, and its pieces' lengths. */
function inside(window: Span, boundaries: readonly Tick[]) {
  const inner = boundaries.filter((each) => each > window.start && each < window.end)
  const marks = [window.start, ...inner, window.end]
  return { inner, pieces: marks.slice(1).map((mark, i) => mark - (marks[i] ?? 0)) }
}

/**
 * The beats of a compound bar split evenly in two, four or eight (a duplet, a quadruplet, an
 * octuplet), which dotted values could write as well: written as their tuplet, as Flat does.
 */
function evenBeats(spans: readonly Span[], meter: Meter, barTicks: Tick): TupletSpan[] {
  if (!isCompound(meter)) return []
  const boundaries = spans.flatMap(({ start, end }) => [start, end])
  const found: TupletSpan[] = []
  for (let start = 0; start + BEAT <= barTicks; start += BEAT) {
    const window = { start, end: start + BEAT }
    const { inner, pieces } = inside(
      window,
      [...new Set(boundaries)].sort((a, b) => a - b),
    )
    const num = pieces.length
    const tuplet = tupletOf(num, meter)
    // Every piece a note's, not a rest's: a note on a beat's second half alone is a dotted value.
    const struck = [start, ...inner].every((at) => spans.some((span) => span.start === at))
    if (tuplet && num % 2 === 0 && struck && pieces.every((piece) => piece === BEAT / num))
      found.push({ ...window, tuplet })
  }
  return found
}

/**
 * A voice's grid from its spans in a bar of `barTicks` (ADR 0087, 0097): a boundary on the meter's
 * 64ths is written as it is; one off them lies in a tuplet, its window the stretch (a quarter of a
 * beat to four beats, from a multiple of its length) whose tuplet writes it on the coarsest grid,
 * then one no note crosses the ends of, then the beat before longer and longer before shorter. A compound beat split evenly in two or four is a duplet or a quadruplet. A
 * boundary no tuplet writes moves to the nearest 64th.
 */
export function voiceGrid(spans: readonly Span[], meter: Meter, barTicks: Tick): VoiceGrid {
  const grid = sixtyFourth(meter)
  const boundaries = [...new Set(spans.flatMap(({ start, end }) => [start, end]))].sort(
    (a, b) => a - b,
  )
  const tuplets: TupletSpan[] = evenBeats(spans, meter, barTicks)
  const overlaps = (window: Span) =>
    tuplets.some((each) => each.start < window.end && window.start < each.end)
  const crossed = (window: Span) =>
    spans.some(
      (span) =>
        (span.start < window.start && window.start < span.end) ||
        (span.start < window.end && window.end < span.end),
    )
  const off = boundaries.filter((at) => at > 0 && at < barTicks && at % grid !== 0)
  for (const at of off) {
    if (tuplets.some((each) => each.start < at && at < each.end)) continue
    const candidates = WINDOWS.flatMap((length) => {
      const start = Math.floor(at / length) * length
      const window = { start, end: start + length }
      if (window.end > barTicks || overlaps(window)) return []
      const { inner, pieces } = inside(window, boundaries)
      const fit = fitOf(window, inner, pieces, meter)
      return fit ? [{ window, fit, clean: !crossed(window) }] : []
    })
    const best = candidates.sort(
      (a, b) =>
        b.fit.grid - a.fit.grid ||
        Number(b.clean) - Number(a.clean) ||
        rank(a.window.end - a.window.start) - rank(b.window.end - b.window.start),
    )[0]
    if (best) tuplets.push({ ...best.window, tuplet: best.fit.tuplet })
  }
  tuplets.sort((a, b) => a.start - b.start)
  const within = (tick: Tick) => tuplets.some((each) => each.start < tick && tick < each.end)
  return {
    place: (tick) => (tick % grid === 0 || within(tick) ? tick : Math.round(tick / grid) * grid),
    tupletAt: (tick) => tuplets.find((each) => each.start <= tick && tick < each.end) ?? null,
    nextTuplet: (tick) => tuplets.find((each) => each.start > tick)?.start ?? null,
  }
}

const beatOf = (tick: Tick) => Math.floor(tick / BEAT)

/**
 * Whether a plain value may be written at a tick. A beat or longer starts on a beat and ends on
 * one, or half-way through one in x/4; in a four-beat bar it crosses the middle only from the bar's
 * start. Shorter lies inside one beat, starting on a multiple of half its undotted length.
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
  const undotted = ticksOf({ ...duration, dots: 0 }, meter)
  return at + length <= beatStart + BEAT && (at - beatStart) % (undotted / 2) === 0
}

/** Whether a tuplet's value may be written at a tick of its window: on a multiple of half its undotted length. */
function allowedIn(at: Tick, duration: Duration, window: TupletSpan, end: Tick, meter: Meter) {
  const length = ticksOf(duration, meter)
  const undotted = ticksOf({ ...duration, dots: 0 }, meter)
  return at + length <= end && (at - window.start) % (undotted / 2) === 0
}

/**
 * A span of a bar as values, longest first, each piece where it starts: a note's are tied, a gap's
 * are rests. Inside a tuplet the tuplet's values, cut at its ends.
 */
export function spellSpan(
  span: Span,
  { meter, barTicks, grid }: { meter: Meter; barTicks: Tick; grid: VoiceGrid },
): { tick: Tick; duration: Duration }[] {
  const pieces: { tick: Tick; duration: Duration }[] = []
  let at = span.start
  while (at < span.end) {
    const window = grid.tupletAt(at)
    const next = grid.nextTuplet(at)
    const end = window ? Math.min(span.end, window.end) : Math.min(span.end, next ?? span.end)
    const duration = window
      ? valuesOf(meter, window.tuplet).find((value) => allowedIn(at, value, window, end, meter))
      : valuesOf(meter).find((value) => allowed(at, value, { meter, barTicks, end }))
    if (!duration) throw new RangeError(`No value writes ${at}–${span.end} in ${meter}`)
    pieces.push({ tick: at, duration })
    at += ticksOf(duration, meter)
  }
  return pieces
}
