import {
  barTicks,
  beatUnit,
  eighthTicks,
  isCompound,
  TICKS_PER_BEAT,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { setBarTicks, setPickup, setPickupTicks } from './bars'
import type { Draft, DraftNote } from './draft'
import { barsOf, sectionMeter } from './timeline'

/**
 * Whether two meters count their ticks alike (ADR 0114): a beat of 24 ticks a quarter (every meter
 * but 3/8, 6/8, 9/8 and 12/8) or a dotted quarter (those four).
 */
export const sameKind = (a: Meter, b: Meter): boolean => isCompound(a) === isCompound(b)

/**
 * Why a meter cannot be the time at section `section` (ADR 0114), or null where it can:
 * `otherKind`, a meter counted in another beat (a dotted quarter for a quarter) past the song's
 * head, where the sections before it are counted in the song's; `between`, the song's notes, at its
 * head, falling between the other kind's ticks (a triplet in 6/8). Any meter of the song's kind may
 * be any section's.
 */
export function meterBar(
  draft: Draft,
  section: number,
  meter: Meter,
): 'otherKind' | 'between' | null {
  if (sameKind(meter, draft.meter)) return null
  if (section > 0) return 'otherKind'
  return rescaled(draft, kindFactor(draft.meter, meter)) ? null : 'between'
}

/** How a tick of one kind's is written in the other's, a note keeping its length: 2/3 into compound. */
const kindFactor = (from: Meter, to: Meter): number =>
  sameKind(from, to) ? 1 : isCompound(to) ? 2 / 3 : 3 / 2

/**
 * The music with every tick scaled by `factor` (a quarter of 24 ticks in 4/4 is 16 in 6/8), its
 * tempo with them, so each note keeps its length and its speed, and its tempo mark as printed: null
 * where a tick falls between the new ones (a triplet's eighth in compound time).
 */
function rescaled(draft: Draft, factor: number): Draft | null {
  if (factor === 1) return draft
  let whole = true
  const scale = (tick: Tick): Tick => {
    const scaled = tick * factor
    if (Math.abs(scaled - Math.round(scaled)) > 1e-9) whole = false
    return Math.round(scaled)
  }
  const notes = (each: readonly DraftNote[]) =>
    each.map((n) => ({
      ...n,
      startTick: scale(n.startTick),
      durationTicks: scale(n.durationTicks),
    }))
  const next: Draft = {
    ...draft,
    // A beat of the new kind lasts 1/factor of the old one: as many of them a minute, times factor;
    // the mark as it was, in the note it counted (a quarter's ♩ = 120 in 4/4 is ♩ = 120 in 6/8).
    tempo: draft.tempo * factor,
    tempoUnit: draft.tempoUnit ?? beatUnit(draft.meter),
    sections: draft.sections.map((section) => ({
      ...section,
      lines: section.lines.map((line) =>
        line.map((bar) => ({
          ...bar,
          ticks: scale(bar.ticks),
          chords: bar.chords.map((chord) => ({ ...chord, at: scale(chord.at) })),
        })),
      ),
    })),
    staves: draft.staves.map((staff) => ({ ...staff, notes: notes(staff.notes) })),
    hands: { rh: notes(draft.hands.rh), lh: notes(draft.hands.lh) },
  }
  return whole ? next : null
}

/**
 * A pickup's length in a bar of `to` ticks: as long as it was, a beat short of the bar at most (an
 * eighth where the bar is a beat or less), so it stays one.
 */
const pickupIn = (ticks: Tick, to: Tick, meter: Meter): Tick => {
  const short = to > TICKS_PER_BEAT ? TICKS_PER_BEAT : eighthTicks(meter)
  return to > short ? Math.min(ticks, to - short) : to
}

/**
 * The music with each section counted in its meter of `meters` (ADR 0097), the song's the first
 * section's: in a section whose bar's length changes, each full bar is made the new meter's (shorter,
 * its notes and chords past the new end taken; longer, its last chord held on), a shorter bar kept
 * as it is unless it outruns the new bar. A pickup stays one, cut from its start. A section says its
 * meter only where it is not the song's. `was`, each section's whole bar as the draft has it.
 */
function inMeters(draft: Draft, meters: readonly Meter[], was: readonly Tick[]): Draft {
  const song = meters[0] ?? draft.meter
  // Counted in the new meters first, so each bar resized is measured against its new whole bar.
  const counted: Draft = {
    ...draft,
    meter: song,
    sections: draft.sections.map((section, index) => {
      const { meter: _own, ...heading } = section.heading
      const meter = meters[index] ?? song
      return { ...section, heading: meter === song ? heading : { ...heading, meter } }
    }),
  }
  // From the last bar back, so each bar's start is still where it was when it is resized.
  return barsOf(counted).reduceRight((music, { bar, section }, index) => {
    const meter = meters[section] ?? song
    const from = was[section] ?? barTicks(song)
    const to = barTicks(meter)
    if (from === to) return music
    if (index === 0 && bar.ticks < from) {
      const pickup = pickupIn(bar.ticks, to, meter)
      return pickup === bar.ticks ? music : setPickupTicks(music, pickup)
    }
    return setBarTicks(music, index, bar.ticks === from || bar.ticks > to ? to : bar.ticks)
  }, counted)
}

/** Each section's whole bar as the draft counts it. */
const wholeBars = (draft: Draft): Tick[] =>
  draft.sections.map((_, section) => barTicks(sectionMeter(draft, section)))

/**
 * The whole song in another meter (ADR 0097, 0114): every section counted in it, none in its own.
 * In a meter of the other kind every tick is written anew so each note keeps its length (and the
 * tempo its speed); where a note falls between the new ticks nothing changes (`meterBar`).
 */
export function setMeter(draft: Draft, meter: Meter): Draft {
  const was = wholeBars(draft)
  const meters = draft.sections.map(() => meter)
  if (meters.every((each, section) => each === sectionMeter(draft, section))) return draft
  const factor = kindFactor(draft.meter, meter)
  const scaled = rescaled(draft, factor)
  if (!scaled) return draft
  return inMeters(
    scaled,
    meters,
    was.map((ticks) => Math.round(ticks * factor)),
  )
}

/**
 * A change of time at section `index` (ADR 0097), as Flat changes time from a measure "until the next
 * time signature": that section and those after it in the same meter, up to the next change, counted
 * in `meter`, of the song's kind; a section in the song's meter writes none. At the first section, it
 * is the song's meter, the sections past the change keeping theirs.
 */
export function setSectionMeter(draft: Draft, index: number, meter: Meter): Draft {
  if (!draft.sections[index] || !sameKind(meter, draft.meter)) return draft
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
  if (meters.every((each, section) => each === sectionMeter(draft, section))) return draft
  return inMeters(draft, meters, wholeBars(draft))
}

/** A time signature as its picker applies it (ADR 0114). */
export interface TimeChoice {
  readonly meter: Meter
  /** 4/4 printed as common time's C, 2/2 as cut time's ¢, the song's whole; as it is where not said. */
  readonly timeSymbol?: boolean
  /** The first bar's length at the song's head, in the new meter's ticks: a pickup, or a whole bar. */
  readonly pickup?: Tick
}

/**
 * A time signature applied at section `section` in one step (ADR 0114): its meter, the whole song's at
 * its first section (`setMeter`), else from that section on (`setSectionMeter`), only where it
 * changes; the song's C or ¢; and at its head, the pickup.
 */
export function setTime(draft: Draft, section: number, choice: TimeChoice): Draft {
  if (meterBar(draft, section, choice.meter)) return draft
  let next = draft
  if (choice.meter !== sectionMeter(draft, section))
    next =
      section === 0 ? setMeter(next, choice.meter) : setSectionMeter(next, section, choice.meter)
  if (choice.timeSymbol !== undefined && choice.timeSymbol !== (next.timeSymbol ?? false)) {
    const { timeSymbol: _was, ...rest } = next
    next = choice.timeSymbol ? { ...rest, timeSymbol: true } : rest
  }
  if (section === 0 && choice.pickup !== undefined) next = setPickup(next, choice.pickup)
  return next
}
