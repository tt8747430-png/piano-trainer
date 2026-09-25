import type { LocalText } from '@/shared/i18n'
import {
  parseFigure,
  type EventFigure,
  type Figure,
  type FigureEvent,
  type Pattern,
} from '@/shared/lib/arrangement'

/** Groups use the glossary's words; their displayed names keep the source's wording. */
export const PATTERN_GROUPS = ['lesson-3', 'techniques', 'seven-types', 'genres'] as const
export type PatternGroup = (typeof PATTERN_GROUPS)[number]

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
  'r1',
  'r2',
  'r3',
  'r4',
  'r4b',
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
  'arp',
  'wide',
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
  'r1',
  'r2',
  'r3',
  'r4',
  'r4b',
  'r5',
  'r6',
  'r7',
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
] as const
export type MethodCode = (typeof METHOD_CODES)[number]

export interface FigureEntry<F extends Figure> {
  readonly name: LocalText
  readonly figure: F
}

export interface PatternEntry {
  readonly group: PatternGroup
  readonly name: LocalText
  readonly description?: LocalText
  readonly rh: RightFigureId
  readonly lh: LeftFigureId
  /** `pattern.id` is this entry's id. */
  readonly pattern: Pattern
}

export interface MethodEntry {
  readonly pattern: PatternId
  readonly label: LocalText
}

const isOneOf =
  <T extends string>(ids: readonly T[]) =>
  (value: unknown): value is T =>
    typeof value === 'string' && (ids as readonly string[]).includes(value)

export const isPatternId = isOneOf(PATTERN_IDS)
export const isRightFigureId = isOneOf(RIGHT_FIGURE_IDS)
export const isLeftFigureId = isOneOf(LEFT_FIGURE_IDS)
export const isMethodCode = isOneOf(METHOD_CODES)

/**
 * A hand's figure in the figure notation: `events` for a 4/4 bar, `inThree` for 3/4, `onMajor` for
 * major chords; `triplets` counts positions in triplet 8ths instead of 16ths.
 */
export function eventFigure(
  events: string,
  options: { inThree?: string; onMajor?: string; triplets?: boolean } = {},
): EventFigure {
  const read = (text: string): FigureEvent[] => parseFigure(text, { triplets: options.triplets })
  return {
    kind: 'events',
    events: read(events),
    ...(options.inThree ? { inThree: read(options.inThree) } : {}),
    ...(options.onMajor ? { onMajor: read(options.onMajor) } : {}),
  }
}
