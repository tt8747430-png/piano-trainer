import {
  isLeftFigureId,
  isPatternId,
  isRightFigureId,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from './types'

/** An own pattern's id: `my-` and its number, never reused. */
export type OwnPatternId = `my-${number}`

/** A pattern the learner made: a name of their own over a figure for each hand from the catalog. */
export interface OwnPattern {
  readonly id: OwnPatternId
  readonly name: string
  readonly rh: RightFigureId
  readonly lh: LeftFigureId
}

/** A pattern as the Player's URL and the learner's lists name it: built-in or their own. */
export type PatternRef = PatternId | OwnPatternId

/** The longest name an own pattern takes. */
export const OWN_NAME_MAX = 40

const OWN_ID = /^my-[1-9]\d*$/

export const isOwnPatternId = (value: unknown): value is OwnPatternId =>
  typeof value === 'string' && OWN_ID.test(value)

/** A ref by its shape, before any book is read (a URL's validator): a built-in id or an own id. */
export const isPatternRef = (value: unknown): value is PatternRef =>
  isPatternId(value) || isOwnPatternId(value)

export const ownPatternId = (number: number): OwnPatternId => `my-${number}`

/** The number an own id carries. */
export const ownNumber = (id: OwnPatternId): number => Number(id.slice(3))

/** A name as an own pattern keeps it: trimmed, 1 to 40 characters; null where none is left. */
export function ownName(text: string): string | null {
  const name = text.trim()
  return name.length > 0 && name.length <= OWN_NAME_MAX ? name : null
}

/** A pattern from outside this device (the Public library) as it is saved: a name and two figures. */
export type SharedPattern = Omit<OwnPattern, 'id'>

/** A body read as a shared pattern: a name an own pattern takes and a catalog figure for each hand. */
export function readSharedPattern(body: unknown): SharedPattern | null {
  if (typeof body !== 'object' || body === null) return null
  const { name, rh, lh } = body as Record<string, unknown>
  const named = typeof name === 'string' ? ownName(name) : null
  return named && isRightFigureId(rh) && isLeftFigureId(lh) ? { name: named, rh, lh } : null
}
