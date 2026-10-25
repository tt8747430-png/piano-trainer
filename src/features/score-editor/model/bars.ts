import { beatsPerBar, TICKS_PER_BEAT, type Meter, type Tick } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import type { BarsClip } from './clip'
import type { Draft, DraftBar, DraftNote } from './draft'
import { versesInOrder } from './sections'
import { barsOf, sectionMeter } from './timeline'
import { slotsOf, spliceAll, withSlots, type Slot } from './structure'

/** Bars chosen together, by their indexes, both ends kept. */
export interface BarRange {
  readonly from: number
  readonly to: number
}

const plain = (bar: DraftBar): Slot => ({ bar, newLine: false, newSection: null })

/** Where bar `index` ends on the timeline. */
const endOf = (draft: Draft, index: number): Tick => {
  const placed = barsOf(draft)[index]
  return placed ? placed.start + placed.bar.ticks : 0
}

/**
 * Slots with new bars put in after `after`, and the notes from there moved on. Each bar goes in as a
 * bar of its own: an edit finds its bar by identity, so a pasted bar shared with the one it was copied
 * from would take every edit of either.
 */
function insertSlots(draft: Draft, after: number, bars: readonly DraftBar[]): Draft {
  const slots = slotsOf(draft)
  const ticks = bars.reduce((sum, bar) => sum + bar.ticks, 0)
  const at = endOf(draft, after)
  return spliceAll(
    withSlots(draft, [
      ...slots.slice(0, after + 1),
      ...bars.map((bar) => plain({ ...bar, chords: bar.chords.map((chord) => ({ ...chord })) })),
      ...slots.slice(after + 1),
    ]),
    at,
    0,
    ticks,
  )
}

/**
 * A new bar in a section, as notation software adds one: its meter's length (ADR 0095), no chord
 * (ADR 0094).
 */
const newBar = (draft: Draft, section: number): DraftBar => ({
  ticks: beatsPerBar(sectionMeter(draft, section)) * TICKS_PER_BEAT,
  chords: [],
})

/** A new bar added after `after`, in its section, both hands silent, the notes after it moved on. */
export function insertBar(draft: Draft, after: number): Draft {
  const placed = barsOf(draft)[after]
  if (!placed) return draft
  return insertSlots(draft, after, [newBar(draft, placed.section)])
}

/**
 * A new bar added before bar `index`, in its place: starting its line or section where it did, the
 * notes from there moved on.
 */
export function insertBarBefore(draft: Draft, index: number): Draft {
  const placed = barsOf(draft)[index]
  const slots = slotsOf(draft)
  const slot = slots[index]
  if (!placed || !slot) return draft
  const bar = newBar(draft, placed.section)
  return spliceAll(
    withSlots(draft, [
      ...slots.slice(0, index),
      { ...slot, bar },
      { bar: slot.bar, newLine: false, newSection: null },
      ...slots.slice(index + 1),
    ]),
    placed.start,
    0,
    bar.ticks,
  )
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
  return versesInOrder(
    spliceAll(withSlots(draft, [...slots.slice(0, from), ...after]), start, ticks, 0),
  )
}

/** Bars and the notes starting in them, each note kept inside them. */
export function copyBars(draft: Draft, { from, to }: BarRange): BarsClip {
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
    kind: 'bars',
    bars: bars.map((placed) => placed.bar),
    melody: inside(draft.melody),
    hands: { rh: inside(draft.hands.rh), lh: inside(draft.hands.lh) },
  }
}

/** Copied bars put in after `after` with their notes. */
export function pasteBars(draft: Draft, after: number, clip: BarsClip): Draft {
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

/** A bar of the first section's meter, its own or the song's (ADR 0095): what a pickup is short of. */
const firstBar = (draft: Draft): Tick => beatsPerBar(sectionMeter(draft, 0)) * TICKS_PER_BEAT

/** Whether bar `index` is a pickup: the first bar, shorter than its meter's. */
const isPickup = (draft: Draft, index: number, ticks: Tick): boolean =>
  index === 0 && ticks < firstBar(draft)

/**
 * A pickup made `ticks` long from its start, as it leads into the downbeat: shorter, its first beats
 * and the notes in them taken, the chord sounding where it now starts kept; longer, room before it,
 * its first chord held back to the start. Its chords keep their places from its end.
 */
function setPickupTicks(draft: Draft, ticks: Tick): Draft {
  const placed = barsOf(draft)[0]
  if (!placed) return draft
  const shift = ticks - placed.bar.ticks
  const moved = placed.bar.chords.map((chord, i) => ({
    ...chord,
    at: i === 0 && shift > 0 ? 0 : chord.at + shift,
  }))
  const sounding = moved.findLast((chord) => chord.at <= 0)
  const chords = moved
    .filter((chord) => chord.at > 0 || chord === sounding)
    .map((chord) => (chord === sounding ? { ...chord, at: 0 } : chord))
  const bar: DraftBar = { ...placed.bar, ticks, chords }
  const slots = slotsOf(draft)
  const resized = withSlots(
    draft,
    slots.map((slot, i) => (i === 0 ? { ...slot, bar } : slot)),
  )
  return shift < 0
    ? spliceAll(resized, placed.start, -shift, 0)
    : spliceAll(resized, placed.start, 0, shift)
}

/**
 * A bar made `ticks` long: shorter, its chords and notes past the new end taken; longer, its last chord
 * held on; the notes after it moved. A pickup changes at its start instead (`setPickupTicks`).
 */
export function setBarTicks(draft: Draft, index: number, ticks: Tick): Draft {
  const placed = barsOf(draft)[index]
  if (!placed || ticks <= 0 || ticks === placed.bar.ticks) return draft
  if (isPickup(draft, index, placed.bar.ticks) && ticks < firstBar(draft))
    return setPickupTicks(draft, ticks)
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
