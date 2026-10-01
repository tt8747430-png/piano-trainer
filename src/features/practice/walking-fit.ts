import type { PatternFit } from '@/entities/pattern'
import type { KeyWalk } from '@/shared/lib/music'

/** What music has for its patterns while it walks the keys: no one key, so no key's triads. */
export const walkingFit = (fit: PatternFit, walk: KeyWalk | null): PatternFit =>
  walk ? { ...fit, key: false } : fit
