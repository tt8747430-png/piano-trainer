import { playsKeyTriads, splitsTheBeat } from '@/shared/lib/arrangement'
import { PATTERNS } from '../content/patterns'
import { PATTERN_GROUPS, PATTERN_IDS, type PatternGroup, type PatternId } from './types'

/** A pattern whose right hand plays the tune: it needs a piece with a melody (r5–r7). */
export const needsMelody = (id: PatternId): boolean => PATTERNS[id].pattern.rh.kind === 'melody'

/** A pattern that plays inside a beat: it cannot play in 6/8 or 12/8, whose beat divides in three. */
export const splitsBeat = (id: PatternId): boolean =>
  splitsTheBeat(PATTERNS[id].pattern.rh) || splitsTheBeat(PATTERNS[id].pattern.lh)

/** A pattern that plays the key's triads (the Chord flow): it needs a source in a key. */
export const needsKey = (id: PatternId): boolean =>
  playsKeyTriads(PATTERNS[id].pattern.rh) || playsKeyTriads(PATTERNS[id].pattern.lh)

const IDS_BY_GROUP = new Map(
  PATTERN_GROUPS.map((group) => [group, PATTERN_IDS.filter((id) => PATTERNS[id].group === group)]),
)

/** The group's patterns in catalog order; the same array on every call. */
export const patternsIn = (group: PatternGroup): readonly PatternId[] =>
  IDS_BY_GROUP.get(group) ?? []
