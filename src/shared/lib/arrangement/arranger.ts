import { beatsToTicks } from '@/shared/lib/music'
import {
  MAINS,
  playOrder,
  type ArrangerNumber,
  type ChordSheet,
  type Main,
  type PlayedBar,
} from './chord-sheet'

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
const MAIN_OF = new Map<number, Main>(MAINS.map((main) => [SECTION.main[main], main]))
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

const INTRO_OF = new Map<number, ArrangerNumber>([
  [SECTION.intro[1], 1],
  [SECTION.intro[2], 2],
  [SECTION.intro[3], 3],
])
const ENDINGS: readonly number[] = Object.values(SECTION.ending)
const FILLS: readonly number[] = Object.values(SECTION.fill)

/** A section pressed on the panel while the band stood in for the arranger: bar `bar` in play order was the first it could still change. */
export interface ArrangerPress {
  readonly bar: number
  readonly section: number
}

/**
 * What the app's band plays in a bar standing in for the arranger: its Main (unset, the section's own
 * variation), whether the bar is a Fill-in, a Break or the Ending, and the panel's section lit for it
 * (Section Control's number; none while no Main is set).
 */
export interface ImitatedBar {
  readonly main: Main | null
  readonly fill: boolean
  readonly break: boolean
  readonly ending: boolean
  readonly lamp: number | null
}

/** The band standing in for the arranger over a sheet: the Intro before it (its number, or none), the Main it starts on, and each bar in play order. */
export interface ImitatedPlay {
  readonly intro: ArrangerNumber | null
  readonly opening: Main | null
  readonly bars: readonly ImitatedBar[]
}

/** The bars an Intro takes from the sheet's end, as a band plays the last line in: I two, II four, III eight. */
export const INTRO_BARS: Readonly<Record<ArrangerNumber, number>> = { 1: 2, 2: 4, 3: 8 }

/**
 * The sheet as the app's band plays it with no arranger connected, standing in for one: the sections
 * the sheet's marks send (`arrangerCues`) and those pressed on the panel, each taken as the arranger
 * would. Before the start (`start`, pressed while stopped, after the sheet's own): a Main is the one
 * it starts on, an Intro the one it starts with. In a bar: a Fill-in plays that bar's fill and its
 * Main from the next bar; a Main plays from the next bar; a Break makes that bar a break; an Ending
 * makes it the last, struck and held. Where a section sets no way into the next, the band fills its
 * last bar as it always does.
 */
export function imitatedPlay(
  sheet: ChordSheet,
  start: readonly number[] = [],
  presses: readonly ArrangerPress[] = [],
): ImitatedPlay {
  const cues = arrangerCues(sheet)
  const order = playOrder(sheet)
  let main: Main | null = null
  let intro: ArrangerNumber | null = null
  for (const ss of [...cues.start, ...start]) {
    main = (FILLS.includes(ss) ? null : mainOf(ss)) ?? main
    intro = INTRO_OF.get(ss) ?? intro
  }
  const opening = main
  const bars = order.map((bar, at): ImitatedBar => {
    const pressed = presses.filter((press) => press.bar === at).map((press) => press.section)
    const sections = [...(cues.bars[at] ?? []), ...pressed]
    const into = sheet.sections[bar.section]?.marks.into ?? null
    const played: { -readonly [K in keyof ImitatedBar]: ImitatedBar[K] } = {
      main,
      fill: into === null && bar.fill,
      break: false,
      ending: false,
      lamp: main ? SECTION.main[main] : null,
    }
    for (const ss of sections) {
      const next = mainOf(ss)
      if (next) {
        if (FILLS.includes(ss)) {
          played.fill = true
          played.lamp = ss
        }
        main = next
      }
      if (ss === SECTION.break) played.break = true
      if (ENDINGS.includes(ss)) played.ending = true
      if (ss === SECTION.break || ENDINGS.includes(ss)) played.lamp = ss
    }
    // A Break or the Ending takes the bar a Fill-in would.
    return played.break || played.ending ? { ...played, fill: false } : played
  })
  return { intro, opening, bars }
}

/** The bars the band plays standing in for the arranger, each with what it plays there, and how many of them are the Intro's. */
export interface ImitatedOrder {
  readonly bars: readonly PlayedBar[]
  readonly marks: readonly ImitatedBar[]
  readonly intro: number
}

/**
 * The sheet's bars in play order as the band standing in for the arranger plays them: an Intro first
 * where one is set, the sheet's last bars played in before its first (a pass numbered -1, on the
 * opening Main, its last bar filled), every bar after it later by the Intro's length.
 */
export function imitatedOrder(sheet: ChordSheet, play: ImitatedPlay): ImitatedOrder {
  const order = playOrder(sheet)
  const count = play.intro ? Math.min(INTRO_BARS[play.intro], order.length) : 0
  const opening: ImitatedBar = {
    main: play.opening,
    fill: false,
    break: false,
    ending: false,
    lamp: play.intro ? SECTION.intro[play.intro] : null,
  }
  let tick = 0
  const intro = order.slice(order.length - count).map((bar): PlayedBar => {
    const played = { ...bar, repeat: -1, startTick: tick, sectionStart: false, fill: false }
    tick += beatsToTicks(bar.beats)
    return played
  })
  return {
    bars: [...intro, ...order.map((bar) => ({ ...bar, startTick: bar.startTick + tick }))],
    marks: [...intro.map((_, at) => ({ ...opening, fill: at === count - 1 })), ...play.bars],
    intro: count,
  }
}
