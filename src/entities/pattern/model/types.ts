import type { MethodBookId } from '@/entities/book'
import type { LocalText } from '@/shared/i18n'
import { isOneOf } from '@/shared/lib'
import {
  parseFigure,
  type EventFigure,
  type Figure,
  type FigureEvent,
} from '@/shared/lib/arrangement'

/** Groups use the glossary's words; their displayed names keep the source's wording. */
export const PATTERN_GROUPS = [
  'five-ways',
  'techniques',
  'seven-types',
  'gorshkov',
  'genres',
] as const
export type PatternGroup = (typeof PATTERN_GROUPS)[number]
export const isPatternGroup = isOneOf(PATTERN_GROUPS)

export const RIGHT_FIGURE_IDS = [
  'b1',
  'b2',
  'b3',
  'b4',
  't1',
  't2',
  't3',
  't4',
  't5',
  'c3',
  'inv',
  'p51',
  'p52',
  'p53',
  's6u',
  's6d',
  'oc',
  'ocs',
  'chd',
  'r1',
  'r2',
  'r3',
  'r4',
  'r4b',
  'g1',
  'g2',
  'g3',
  'g4',
  'g5',
  'g6',
  'mel',
  'melE',
  'melH',
  'x1',
  'flow',
  'sync',
  'bal',
  'rock',
  'blu',
  'rnb',
  'jaz',
  'hip',
  'sal',
  'fun',
  'cty',
] as const
export type RightFigureId = (typeof RIGHT_FIGURE_IDS)[number]

export const LEFT_FIGURE_IDS = [
  'o',
  'r',
  'h',
  'dot',
  'wide',
  'climb',
  'q',
  'alt',
  'walk',
  'fig',
  'bro',
  'pop',
  'sync',
  'bal',
  'rock',
  'shuf',
  'rnb',
  'sal',
  'fun',
  'gos',
  'fifth',
  'tenth',
  'step',
  'wlk',
  'shell',
  'chs',
  'str',
] as const
export type LeftFigureId = (typeof LEFT_FIGURE_IDS)[number]

/** In catalog order, group by group. */
export const PATTERN_IDS = [
  'M1',
  'M2',
  'M3',
  'M4',
  'M5',
  't1',
  't2',
  't3',
  't4',
  't5',
  'c3',
  'inv',
  'p51',
  'p52',
  'p53',
  's6u',
  's6d',
  'oct',
  'octs',
  'chd',
  'r1',
  'r2',
  'r3',
  'r4',
  'r4b',
  'r5',
  'r6',
  'r7',
  'g1',
  'g2',
  'g3',
  'g4',
  'g5',
  'g6',
  'block',
  'flow',
  'pop8',
  'popSync',
  'ballad',
  'rock',
  'blues',
  'rnb',
  'jazz',
  'hiphop',
  'salsa',
  'funk',
  'gospel',
  'country',
] as const
export type PatternId = (typeof PATTERN_IDS)[number]

/** The playing techniques a chart may name after a chord (`C:t1`), from the source book. */
export const METHOD_CODES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  't1',
  't2',
  't3',
  't4',
  't5',
  '3ch',
  'inv',
  '5.1',
  '5.2',
  '5.3',
  '6u',
  '6d',
  'oct',
  'octs',
  'ch',
] as const
export type MethodCode = (typeof METHOD_CODES)[number]

export interface FigureEntry<F extends Figure> {
  readonly name: LocalText
  readonly figure: F
}

export interface PatternGroupEntry {
  /** Its own name, without its book's: a list that mixes the books says the book first. */
  readonly name: LocalText
  /** The method book that teaches it; the rhythm styles are no book's. */
  readonly book: MethodBookId | null
}

export interface PatternEntry {
  readonly group: PatternGroup
  readonly name: LocalText
  /** What it sounds like and what each hand does, in one line: the picker's line under its name. */
  readonly idea: LocalText
  /** The source's fuller explanation, where it gives one: the pattern's page. */
  readonly description?: LocalText
  readonly rh: RightFigureId
  readonly lh: LeftFigureId
}

export interface MethodEntry {
  readonly pattern: PatternId
  readonly label: LocalText
}

export const isPatternId = isOneOf(PATTERN_IDS)
export const isRightFigureId = isOneOf(RIGHT_FIGURE_IDS)
export const isLeftFigureId = isOneOf(LEFT_FIGURE_IDS)
export const isMethodCode = isOneOf(METHOD_CODES)

/**
 * A hand's figure in the figure notation: `events` for a 4/4 bar, `inThree` for 3/4, `onMajor` for
 * major chords, all in 16ths (in triplet 8ths with `triplets`, a shuffle); `inCompound` for a 12/8 bar
 * (a 6/8 bar plays its first half) and `inCompoundOnMajor` for major chords there, in 16ths of the
 * compound beat, six to a dotted quarter.
 */
export function eventFigure(
  events: string,
  options: {
    inThree?: string
    onMajor?: string
    triplets?: boolean
    inCompound?: string
    inCompoundOnMajor?: string
  } = {},
): EventFigure {
  const perBeat = options.triplets ? 3 : 4
  const read = (text: string): FigureEvent[] => parseFigure(text, { perBeat })
  const compound = (text: string): FigureEvent[] => parseFigure(text, { perBeat: 6 })
  return {
    kind: 'events',
    events: read(events),
    ...(options.inThree ? { inThree: read(options.inThree) } : {}),
    ...(options.onMajor ? { onMajor: read(options.onMajor) } : {}),
    ...(options.inCompound ? { inCompound: compound(options.inCompound) } : {}),
    ...(options.inCompoundOnMajor
      ? { inCompoundOnMajor: compound(options.inCompoundOnMajor) }
      : {}),
  }
}
