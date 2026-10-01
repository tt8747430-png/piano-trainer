import {
  BUILT_IN_PATTERNS,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERN_IDS,
  patternNeed,
  type PatternId,
} from '@/entities/pattern'
import type { Draft } from '@/features/score-editor'
import { localText, type Locale } from '@/shared/i18n'
import { isCompound } from '@/shared/lib/music'

/**
 * The song's settings' patterns: the built-in ones its music can play, by group, and the one it has
 * though its music no longer can (it plays its fallback until another is chosen).
 */
export function songPatterns(draft: Draft, locale: Locale) {
  const fit = {
    melody: draft.melody.length > 0,
    key: true,
    simpleTime: !isCompound(draft.meter),
    methodCodes: draft.sections.some((section) =>
      section.lines.some((line) => line.some((bar) => bar.chords.some((chord) => chord.method))),
    ),
  }
  const offered = (id: PatternId) => {
    const entry = BUILT_IN_PATTERNS.get(id)
    return entry !== undefined && (id === draft.pattern || patternNeed(entry, fit) === null)
  }
  return PATTERN_GROUPS.map((group) => ({
    label: localText(PATTERN_GROUP_NAMES[group], locale),
    options: PATTERN_IDS.flatMap((id) => {
      const entry = BUILT_IN_PATTERNS.get(id)
      return entry && entry.group === group && offered(id)
        ? [{ value: id, label: localText(entry.name, locale) }]
        : []
    }),
  })).filter((group) => group.options.length > 0)
}
