import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useModuleName } from '@/entities/lesson'
import { PATTERN_IDS, usePatternBook } from '@/entities/pattern'
import { COLLECTIONS, useRepertoire } from '@/entities/piece'
import { usePageAbout } from '@/pages/practice'
import { useLocale } from '@/shared/i18n'
import { indexEntries, type IndexEntry, type IndexNames } from './index-entries'

/** The names the interface gives what content does not name itself, in the learner's language. */
export function useIndexNames(): IndexNames {
  const { t } = useTranslation(['practice', 'music', 'quiz'])
  const about = usePageAbout()
  const module = useModuleName()
  return useMemo(
    () => ({
      page: (page) => ({ title: t(`practice:pages.${page}`), about: about(page) }),
      quality: (quality) => t(`music:quality.${quality}`),
      scale: (kind) => t(`music:scaleKind.${kind}`),
      trainer: (trainer) => ({
        title: t(`quiz:trainers.${trainer}`),
        about: t(`quiz:about.${trainer}`),
      }),
      module,
    }),
    [t, about, module],
  )
}

/**
 * The index as this learner has it: every song in their version and their own, every pattern of
 * their book, in their language.
 */
export function useIndex(names: IndexNames): IndexEntry[] {
  const locale = useLocale()
  const repertoire = useRepertoire()
  const book = usePatternBook()
  return useMemo(
    () =>
      indexEntries({
        locale,
        names,
        pieces: [
          ...repertoire.ownSongs,
          ...COLLECTIONS.flatMap((collection) =>
            collection.entries.map((entry) => repertoire.entry(entry.id) ?? entry),
          ),
        ],
        patterns: [...book.own, ...PATTERN_IDS.map((id) => book.require(id))],
      }),
    [locale, names, repertoire, book],
  )
}
