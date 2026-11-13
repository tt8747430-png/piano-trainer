import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedEntry } from '@/entities/library'
import { entryTitles, PieceLink, useRepertoire, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { ROW_BODY, ROW_FLAT, ROW_LIBRARY_FACE, RowFace } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEntryFace } from '@/widgets/piece-list'
import { PieceMark } from '@/widgets/piece-cover'
import { FolderFace } from '@/widgets/song-library'

/** An archived song's face, a link to its page (an archived song still opens). */
function SongFace({ entry }: { entry: Entry }) {
  const { face } = useEntryFace(entry)
  return (
    <PieceLink entry={entry} className={cn(ROW_BODY, ROW_LIBRARY_FACE, 'pl-4')}>
      <PieceMark entry={entry} />
      <RowFace {...face} />
    </PieceLink>
  )
}

/**
 * A row of the archive (Mindscape's; canvas 133), in its list's one card: a folder on its tile with its
 * songs counted, or a song on its small cover as Songs shows it; then Restore as a soft pill, and its
 * More where it has one.
 */
export function ArchivedRow({
  entry,
  restore,
  onRestore,
  more,
}: {
  entry: ShelvedEntry
  /** Restore's word: a folder's Archived says Unarchive. */
  restore?: string
  onRestore: () => void
  more: ReactNode
}) {
  const { t } = useTranslation('songs')
  const repertoire = useRepertoire()
  const nameOf = useFolderName()
  const locale = useLocale()
  const song = entry.kind === 'song' ? repertoire.entry(entry.id) : undefined
  const name =
    entry.kind === 'folder' ? nameOf(entry.folder) : song ? entryTitles(song, locale).primary : ''
  if (entry.kind === 'song' && !song) return null
  return (
    <li className={cn(ROW_FLAT, more ? 'pr-1' : 'pr-3')}>
      {entry.kind === 'folder' ? (
        <div className={cn(ROW_BODY, ROW_LIBRARY_FACE, 'pl-4')}>
          <FolderFace
            folder={entry.folder}
            holds={{
              folders: entry.subfolders.filter((each) => each.parent === entry.folder.id).length,
              songs: entry.folder.songs.length,
            }}
          />
        </div>
      ) : song ? (
        <SongFace entry={song} />
      ) : null}
      <Button
        variant="bar"
        aria-label={
          restore ? t('folder.unarchiveNamed', { name }) : t('archive.restoreNamed', { name })
        }
        onClick={onRestore}
        className="shrink-0 px-3 text-[0.9375rem]"
      >
        {restore ?? t('library.restore')}
      </Button>
      {more}
    </li>
  )
}
