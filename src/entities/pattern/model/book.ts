import type { LocalText } from '@/shared/i18n'
import type { Pattern } from '@/shared/lib/arrangement'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import { figurePattern, PATTERNS } from '../content/patterns'
import type { OwnPattern, PatternRef } from './own'
import { PATTERN_IDS, type LeftFigureId, type PatternGroup, type RightFigureId } from './types'

/** A pattern as the book holds it: built-in or the learner's, read alike. */
export interface BookPattern {
  readonly ref: PatternRef
  /** A built-in group, or `own`. */
  readonly group: PatternGroup | 'own'
  readonly name: LocalText
  /** What it sounds like in a line: a built-in's own; an own pattern's, its two figures. */
  readonly idea: LocalText
  readonly description?: LocalText
  readonly rh: RightFigureId
  readonly lh: LeftFigureId
  /** What `arrange` plays: `pattern.id` is the ref. */
  readonly pattern: Pattern
}

/** The built-in patterns and the learner's own, looked up by ref (ADR 0026). */
export interface PatternBook {
  /** The pattern a ref names; undefined where the book holds none (an own pattern since deleted). */
  get(ref: PatternRef): BookPattern | undefined
  /**
   * The pattern a ref already read against the book names (`playablePattern` keeps only refs the
   * book holds): one it does not hold is a mistake in the caller, and throws.
   */
  require(ref: PatternRef): BookPattern
  /** The learner's own, in the order made. */
  readonly own: readonly BookPattern[]
}

const BUILT_IN = new Map<PatternRef, BookPattern>(
  PATTERN_IDS.map((id) => [id, { ...PATTERNS[id], ref: id }]),
)

/** Both languages say an own pattern by its name, and its idea by its two figures. */
function ownEntry({ id, name, rh, lh }: OwnPattern): BookPattern {
  const right = RIGHT_FIGURES[rh].name
  const left = LEFT_FIGURES[lh].name
  return {
    ref: id,
    group: 'own',
    name: { en: name, ru: name },
    idea: { en: `${right.en} · ${left.en}`, ru: `${right.ru} · ${left.ru}` },
    rh,
    lh,
    pattern: figurePattern(id, rh, lh),
  }
}

/** The pattern book over the learner's own patterns. */
export function patternBook(own: readonly OwnPattern[]): PatternBook {
  const entries = own.map(ownEntry)
  const byRef = new Map(entries.map((entry) => [entry.ref, entry]))
  const get = (ref: PatternRef) => BUILT_IN.get(ref) ?? byRef.get(ref)
  return {
    get,
    require(ref) {
      const entry = get(ref)
      if (!entry) throw new RangeError(`Pattern ${ref} is not in the book`)
      return entry
    },
    own: entries,
  }
}

/** The book with the built-in patterns alone: content (pieces, lessons, methods) names only these. */
export const BUILT_IN_PATTERNS: PatternBook = patternBook([])
