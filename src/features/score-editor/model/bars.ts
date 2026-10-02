import { beatsPerBar, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import type { HandId } from '@/entities/piece'
import type { Draft, DraftBar, DraftNote } from './draft'
import { barsOf } from './timeline'
import { slotsOf, spliceAll, withSlots, type Slot } from './structure'

/** Bars chosen together, by their indexes, both ends kept. */
export interface BarRange {
  readonly from: number
  readonly to: number
}

/** Bars copied with their notes, which are timed from the first bar's start. */
export interface Clip {
  readonly bars: readonly DraftBar[]
  readonly melody: readonly DraftNote[]
  readonly hands: Readonly<Record<HandId, readonly DraftNote[]>>
}

const plain = (bar: DraftBar): Slot => ({ bar, newLine: false, newSection: null })

/** Where bar `index` ends on the timeline. */
const endOf = (draft: Draft, index: number): Tick => {
  const placed = barsOf(draft)[index]
  return placed ? placed.start + placed.bar.ticks : 0
}

/** Slots with new bars put in after `after`, and the notes from there moved on. */
function insertSlots(draft: Draft, after: number, bars: readonly DraftBar[]): Draft {
  const slots = slotsOf(draft)
  const ticks = bars.reduce((sum, bar) => sum + bar.ticks, 0)
  const at = endOf(draft, after)
  return spliceAll(
    withSlots(draft, [...slots.slice(0, after + 1), ...bars.map(plain), ...slots.slice(after + 1)]),
    at,
    0,
    ticks,
  )
}

/** A bar added after `after`: the meter's length, the chord before it again, both hands the pattern's. */
export function insertBar(draft: Draft, after: number): Draft {
  const chord = barsOf(draft)[after]?.bar.chords.at(-1)
  if (!chord) return draft
  const bar: DraftBar = {
    ticks: beatsPerBar(draft.meter) * TICKS_PER_BEAT,
    chords: [{ at: 0, chord: chord.chord, ...(chord.method ? { method: chord.method } : {}) }],
    rh: false,
    lh: false,
  }
  return insertSlots(draft, after, [bar])
}

/**
 * Bars taken with their notes, a note held into them cut, the rest moved back; a line or section left
 * empty goes, and what followed takes its start. The piece keeps one bar.
 */
export function deleteBars(draft: Draft, { from, to }: BarRange): Draft {
  const slots = slotsOf(draft)
  if (from < 0 || to >= slots.length || from > to || to - from + 1 >= slots.length) return draft
  const removed = slots.slice(from, to + 1)
  const startsLine = removed.some((slot) => slot.newLine)
  const section = removed.findLast((slot) => slot.newSection)?.newSection ?? null
  const after = slots
    .slice(to + 1)
    .map((slot, i) =>
      i === 0
        ? { ...slot, newLine: slot.newLine || startsLine, newSection: slot.newSection ?? section }
        : slot,
    )
  const start = barsOf(draft)[from]?.start ?? 0
  const ticks = removed.reduce((sum, slot) => sum + slot.bar.ticks, 0)
  return spliceAll(withSlots(draft, [...slots.slice(0, from), ...after]), start, ticks, 0)
}

/** Bars and the notes starting in them, each note kept inside them. */
export function copyBars(draft: Draft, { from, to }: BarRange): Clip {
  const bars = barsOf(draft).slice(from, to + 1)
  const start = bars[0]?.start ?? 0
  const end = start + bars.reduce((sum, placed) => sum + placed.bar.ticks, 0)
  const inside = (notes: readonly DraftNote[]) =>
    notes
      .filter((n) => n.startTick >= start && n.startTick < end)
      .map((n) => ({
        ...n,
        startTick: n.startTick - start,
        durationTicks: Math.min(n.durationTicks, end - n.startTick),
      }))
  return {
    bars: bars.map((placed) => placed.bar),
    melody: inside(draft.melody),
    hands: { rh: inside(draft.hands.rh), lh: inside(draft.hands.lh) },
  }
}

/** Copied bars put in after `after` with their notes. */
export function pasteBars(draft: Draft, after: number, clip: Clip): Draft {
  if (clip.bars.length === 0) return draft
  const at = endOf(draft, after)
  const moved = (notes: readonly DraftNote[]) =>
    notes.map((n) => ({ ...n, startTick: n.startTick + at }))
  const inserted = insertSlots(draft, after, clip.bars)
  const order = (notes: DraftNote[]) =>
    notes.sort((a, b) => a.startTick - b.startTick || a.midi - b.midi)
  return {
    ...inserted,
    melody: order([...inserted.melody, ...moved(clip.melody)]),
    hands: {
      rh: order([...inserted.hands.rh, ...moved(clip.hands.rh)]),
      lh: order([...inserted.hands.lh, ...moved(clip.hands.lh)]),
    },
  }
}

/** A bar's lengths to choose: an eighth at a time up to the meter's bar. */
export function barLengths(meter: Meter): Tick[] {
  const eighth = ticksOf({ value: 8, dots: 0, triplet: false }, meter)
  const full = beatsPerBar(meter) * TICKS_PER_BEAT
  return Array.from({ length: full / eighth }, (_, i) => (i + 1) * eighth)
}

/**
 * A bar made `ticks` long: shorter, its chords and notes past the new end taken; longer, its last chord
 * held on; the notes after it moved.
 */
export function setBarTicks(draft: Draft, index: number, ticks: Tick): Draft {
  const placed = barsOf(draft)[index]
  if (!placed || ticks <= 0 || ticks === placed.bar.ticks) return draft
  const slots = slotsOf(draft)
  const bar: DraftBar = {
    ...placed.bar,
    ticks,
    chords: placed.bar.chords.filter((chord, i) => i === 0 || chord.at < ticks),
  }
  const resized = withSlots(
    draft,
    slots.map((slot, i) => (i === index ? { ...slot, bar } : slot)),
  )
  const old = placed.bar.ticks
  return ticks < old
    ? spliceAll(resized, placed.start + ticks, old - ticks, 0)
    : spliceAll(resized, placed.start + old, 0, ticks - old)
}

/** A new line from bar `index`; a bar that starts one already changes nothing. */
export function newLine(draft: Draft, index: number): Draft {
  const slots = slotsOf(draft)
  const slot = slots[index]
  if (!slot || slot.newLine) return draft
  return withSlots(
    draft,
    slots.map((other, i) => (i === index ? { ...other, newLine: true } : other)),
  )
}

/** Bar `index`'s line joined with the next line of its section. */
export function joinLine(draft: Draft, index: number): Draft {
  const slots = slotsOf(draft)
  const next = slots.findIndex((slot, i) => i > index && slot.newLine)
  const slot = slots[next]
  if (!slot || slot.newSection) return draft
  return withSlots(
    draft,
    slots.map((other, i) => (i === next ? { ...other, newLine: false } : other)),
  )
}
