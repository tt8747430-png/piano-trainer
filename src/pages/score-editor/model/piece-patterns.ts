import {
  BUILT_IN_PATTERNS,
  PATTERN_GROUP_NAMES,
  PATTERN_GROUPS,
  PATTERN_IDS,
  patternNeed,
  type PatternFit,
  type PatternId,
} from '@/entities/pattern'
import { localText, type Locale } from '@/shared/i18n'

/**
 * The settings' patterns: the built-in ones the music can play, by group, and the one chosen though the
 * music no longer can (it plays its fallback until another is chosen).
 */
export function piecePatterns(fit: PatternFit, chosen: PatternId, locale: Locale) {
  return PATTERN_GROUPS.map((group) => ({
    label: localText(PATTERN_GROUP_NAMES[group], locale),
    options: PATTERN_IDS.flatMap((id) => {
      const entry = BUILT_IN_PATTERNS.get(id)
      return entry?.group === group && (id === chosen || patternNeed(entry, fit) === null)
        ? [{ value: id, label: localText(entry.name, locale) }]
        : []
    }),
  })).filter((group) => group.options.length > 0)
}
