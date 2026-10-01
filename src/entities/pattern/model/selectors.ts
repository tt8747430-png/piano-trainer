import { PATTERNS } from '../content/patterns'
import { PATTERN_GROUPS, PATTERN_IDS, type PatternGroup, type PatternId } from './types'

const IDS_BY_GROUP = new Map(
  PATTERN_GROUPS.map((group) => [group, PATTERN_IDS.filter((id) => PATTERNS[id].group === group)]),
)

/** The group's patterns in catalog order; the same array on every call. */
export const patternsIn = (group: PatternGroup): readonly PatternId[] =>
  IDS_BY_GROUP.get(group) ?? []
