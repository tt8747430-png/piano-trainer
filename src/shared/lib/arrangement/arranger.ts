import { beatsToTicks, TICKS_PER_BEAT } from '@/shared/lib/music'
import { playOrder, type ChordSheet, type Main, type PlayedBar } from './chord-sheet'

/**
 * Yamaha's Section Control numbers (`ss` in F0 43 7E 00 ss dd F7, the Genos Data List's MIDI Data
 * Format): Intro I–III, Main A–D, Fill-in A–D, Break, Ending I–III.
 */
export const SECTION = {
  intro: { 1: 0x00, 2: 0x01, 3: 0x02 },
  main: { A: 0x08, B: 0x09, C: 0x0a, D: 0x0b },
  fill: { A: 0x10, B: 0x11, C: 0x12, D: 0x13 },
  break: 0x18,
  ending: { 1: 0x20, 2: 0x21, 3: 0x22 },
} as const

/** Section Control: the arranger's section `ss` switched on, as its panel button would. */
export const sectionControl = (ss: number): number[] => [0xf0, 0x43, 0x7e, 0x00, ss, 0x7f, 0xf7]
/** Yamaha's style Start and Stop (the Genos Data List's Rhythm Start and Rhythm Stop). */
export const RHYTHM_START: readonly number[] = [0xf0, 0x43, 0x60, 0x7a, 0xf7]
export const RHYTHM_STOP: readonly number[] = [0xf0, 0x43, 0x60, 0x7d, 0xf7]

const MAIN_OF = new Map<number, Main>(
  Object.entries(SECTION.main).map(([main, ss]) => [ss, main as Main]),
)
/** The Main a Section Control switches to, its Fill-in's too; null for any other section. */
export const mainOf = (ss: number): Main | null => MAIN_OF.get(ss) ?? MAIN_OF.get(ss - 8) ?? null
export const isIntro = (ss: number): boolean =>
  Object.values(SECTION.intro).some((each) => each === ss)

/**
 * What the sheet's marks send a followed arranger: the sections set before its Start (the first
 * pass's Main, then the Intro, so its panel holds them), and for each bar in play order the sections
 * sent as that bar begins, which the arranger takes at the next bar line: on a pass's last bar the
 * next pass's Main, or a Fill-in into it (the Fill-in of the Main it leads to), or a Break; on the
 * sheet's last bar its Ending, or, with none, the way into its first pass again. A Main already
 * playing is never sent again (that would play its Fill-in); what is unset sends nothing.
 */
export interface ArrangerCues {
  readonly start: readonly number[]
  readonly bars: readonly (readonly number[])[]
}

export function arrangerCues(sheet: ChordSheet): ArrangerCues {
  const order = playOrder(sheet)
  const mainOn = (bar: PlayedBar | undefined): Main | null =>
    bar ? (sheet.sections[bar.section]?.marks.mains[bar.repeat] ?? null) : null
  const first = order[0]
  const opening = mainOn(first)
  const intro = first ? sheet.sections[first.section]?.marks.intro : null
  const start = [
    ...(opening ? [SECTION.main[opening]] : []),
    ...(intro ? [SECTION.intro[intro]] : []),
  ]
  let playing = opening
  const bars = order.map((bar, at): number[] => {
    const next = order[at + 1]
    const passEnds = !next || next.section !== bar.section || next.repeat !== bar.repeat
    if (!passEnds) return []
    const marks = sheet.sections[bar.section]?.marks
    if (!next && marks?.ending) return [SECTION.ending[marks.ending]]
    const to = next ?? first
    const main = mainOn(to)
    const leaving = !next || next.section !== bar.section
    const into = leaving ? marks?.into : null
    if (into === 'break') {
      const cues = main && main !== playing ? [SECTION.main[main], SECTION.break] : [SECTION.break]
      playing = main ?? playing
      return cues
    }
    if (into === 'fill') {
      const lead = main ?? playing
      playing = lead
      return lead ? [SECTION.fill[lead]] : []
    }
    if (!main || main === playing) return []
    playing = main
    return [SECTION.main[main]]
  })
  return { start, bars }
}

/** MIDI clock's ticks a beat. */
export const CLOCKS_PER_BEAT = 24

/** Where the arranger's clock has the sheet: the bar in play order and the beat in it. */
export interface FollowedPlace {
  readonly at: number
  readonly beat: number
}

/**
 * The bar and beat `clocks` MIDI clock ticks after the sheet's first bar, the sheet going round
 * again after its last bar, as the arranger plays on. Null for a sheet with no bars.
 */
export function followedPlace(order: readonly PlayedBar[], clocks: number): FollowedPlace | null {
  const last = order.at(-1)
  if (!last) return null
  const length = last.startTick + beatsToTicks(last.beats)
  if (length <= 0) return null
  const tick = ((((clocks / CLOCKS_PER_BEAT) * TICKS_PER_BEAT) % length) + length) % length
  let at = order.length - 1
  while (at > 0 && (order[at]?.startTick ?? 0) > tick) at -= 1
  const start = order[at]?.startTick ?? 0
  return { at, beat: Math.floor((tick - start) / TICKS_PER_BEAT) }
}

/** The tempo in beats a minute from MIDI clock ticks `gap` milliseconds apart. */
export const clockTempo = (gap: number): number =>
  gap > 0 ? Math.round(60_000 / (gap * CLOCKS_PER_BEAT)) : 0
