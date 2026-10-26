import { beatsPerBar, isCompound, METERS, TICKS_PER_BEAT, type Meter } from '@/shared/lib/music'
import { setBarTicks } from './bars'
import type { Draft } from './draft'
import { barsOf, sectionMeter } from './timeline'

/**
 * The meters a piece may change to: those of its own kind, where a written value keeps its length (a
 * quarter in 2/4, 3/4 and 4/4; an eighth in 6/8 and 12/8). Across kinds every note would be another.
 */
export const metersFor = (meter: Meter): Meter[] =>
  METERS.filter((each) => isCompound(each) === isCompound(meter))

/** A bar's length in a meter: its beats in ticks. */
const fullBar = (meter: Meter) => beatsPerBar(meter) * TICKS_PER_BEAT

/**
 * The music with each section counted in its meter of `meters` (ADR 0095), the song's the first
 * section's: in a section whose meter changes, each full bar is made the new meter's (shorter, its
 * notes and chords past the new end taken; longer, its last chord held on), a shorter bar kept as it
 * is unless it outruns the new bar. A pickup stays one: a beat short of the new bar at most, cut from
 * its start. A section says its meter only where it is not the song's.
 */
function inMeters(draft: Draft, meters: readonly Meter[]): Draft {
  const was = draft.sections.map((_, section) => sectionMeter(draft, section))
  if (meters.every((meter, section) => meter === was[section])) return draft
  // From the last bar back, so each bar's start is still where it was when it is resized.
  const resized = barsOf(draft).reduceRight((music, { bar, section }, index) => {
    const from = fullBar(was[section] ?? draft.meter)
    const to = fullBar(meters[section] ?? draft.meter)
    if (from === to) return music
    if (index === 0 && bar.ticks < from)
      return setBarTicks(music, 0, Math.min(bar.ticks, to - TICKS_PER_BEAT))
    return setBarTicks(music, index, bar.ticks === from || bar.ticks > to ? to : bar.ticks)
  }, draft)
  const song = meters[0] ?? draft.meter
  return {
    ...resized,
    meter: song,
    sections: resized.sections.map((section, index) => {
      const { meter: _own, ...heading } = section.heading
      const meter = meters[index] ?? song
      return { ...section, heading: meter === song ? heading : { ...heading, meter } }
    }),
  }
}

/** The whole song in another meter of its kind: every section counted in it, none in its own. */
export function setMeter(draft: Draft, meter: Meter): Draft {
  if (!metersFor(draft.meter).includes(meter)) return draft
  return inMeters(
    draft,
    draft.sections.map(() => meter),
  )
}

/**
 * A change of time at section `index` (ADR 0095), as Flat changes time from a measure "until the next
 * time signature": that section and those after it in the same meter, up to the next change, counted
 * in `meter`, of the song's kind; a section in the song's meter writes none. At the first section, it
 * is the song's meter, the sections past the change keeping theirs.
 */
export function setSectionMeter(draft: Draft, index: number, meter: Meter): Draft {
  if (!draft.sections[index] || !metersFor(draft.meter).includes(meter)) return draft
  const was = sectionMeter(draft, index)
  let running = true
  const meters = draft.sections.map((_, section) => {
    const own = sectionMeter(draft, section)
    if (section < index || !running) return own
    if (own !== was) {
      running = false
      return own
    }
    return meter
  })
  return inMeters(draft, meters)
}
