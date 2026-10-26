import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { archivedSongs, useFolderName, useLibraryLayout } from '@/entities/library'
import { PATTERN_IDS, usePatternBook } from '@/entities/pattern'
import { COLLECTIONS, useRepertoire } from '@/entities/piece'
import { useKeyName, useLocale } from '@/shared/i18n'
import { usePageWords } from '@/widgets/practice-pages'
import { indexEntries, type IndexEntry, type IndexNames } from './index-entries'

/** The names the interface gives what content does not name itself, in the learner's language. */
export function useIndexNames(): IndexNames {
  const { t } = useTranslation(['music', 'quiz', 'songs'])
  const page = usePageWords()
  const key = useKeyName()
  return useMemo(
    () => ({
      page,
      quality: (quality) => t(`music:quality.${quality}`),
      scale: (kind) => t(`music:scaleKind.${kind}`),
      trainer: (trainer) => ({
        title: t(`quiz:trainers.${trainer}`),
        about: t(`quiz:about.${trainer}`),
      }),
      key,
      songCount: (count) => t('songs:folder.songCount', { count }),
    }),
    [t, page, key],
  )
}

/**
 * The index as this learner has it: every song in their version and their own (those archived said
 * so), the library's folders, every pattern of their book, in their language.
 */
export function useIndex(names: IndexNames): IndexEntry[] {
  const locale = useLocale()
  const repertoire = useRepertoire()
  const book = usePatternBook()
  const library = useLibraryLayout()
  const folderName = useFolderName()
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
        folders: library.folders.map((folder) => ({
          id: folder.id,
          name: folderName(folder),
          count: folder.songs.length,
        })),
        archived: new Set(
          library.archive.flatMap((entry) =>
            entry.kind === 'song' ? [entry.id] : archivedSongs(entry),
          ),
        ),
        patterns: [...book.own, ...PATTERN_IDS.map((id) => book.require(id))],
      }),
    [locale, names, repertoire, library, folderName, book],
  )
}
