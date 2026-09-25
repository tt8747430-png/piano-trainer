import { PATTERNS } from '../content/patterns'
import { PATTERN_GROUPS, PATTERN_IDS, type PatternGroup, type PatternId } from './types'

/** A pattern whose right hand plays the tune: it needs a piece with a melody (r5–r7). */
export const needsMelody = (id: PatternId): boolean => PATTERNS[id].pattern.rh.kind === 'melody'

const IDS_BY_GROUP = new Map(
  PATTERN_GROUPS.map((group) => [group, PATTERN_IDS.filter((id) => PATTERNS[id].group === group)]),
)

/** The group's patterns in catalog order; the same array on every call. */
export const patternsIn = (group: PatternGroup): readonly PatternId[] =>
  IDS_BY_GROUP.get(group) ?? []
