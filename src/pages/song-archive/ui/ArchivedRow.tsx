import { ArchiveRestore } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useFolderName, type ShelvedEntry } from '@/entities/library'
import { entryTitles, PieceLink, useRepertoire, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { RowFace } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEntryFace } from '@/widgets/piece-list'
import { FolderFace } from '@/widgets/song-library'

/** An archived song's face, a link to its page (an archived song still opens). */
function SongFace({ entry }: { entry: Entry }) {
  const { face } = useEntryFace(entry)
  return (
    <PieceLink
      entry={entry}
      className="group/row flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-3xl py-2 pl-3 focus-visible:-outline-offset-3"
    >
      <RowFace {...face} />
    </PieceLink>
  )
}

/**
 * A row of the archive (Mindscape's): a folder on its tile with its songs counted, or a song as Songs
 * shows it; then Restore, and its More where it has one.
 */
export function ArchivedRow({
  entry,
  onRestore,
  more,
}: {
  entry: ShelvedEntry
  onRestore: () => void
  more: ReactNode
}) {
  const { t } = useTranslation('songs')
  const repertoire = useRepertoire()
  const nameOf = useFolderName()
  const locale = useLocale()
  const song = entry.kind === 'song' ? repertoire.entry(entry.id) : undefined
  const name = entry.kind === 'folder' ? nameOf(entry.folder) : (song ? entryTitles(song, locale).primary : '')
  if (entry.kind === 'song' && !song) return null
  return (
    <li className="card flex min-w-0 items-center gap-1 pr-2">
      {entry.kind === 'folder' ? (
        <div className="flex min-h-16 min-w-0 flex-1 items-center gap-3 py-2 pl-2">
          <FolderFace folder={entry.folder} />
        </div>
      ) : song ? (
        <SongFace entry={song} />
      ) : null}
      <Button
        variant="soft"
        aria-label={t('archive.restoreNamed', { name })}
        onClick={onRestore}
        className="shrink-0"
      >
        <ArchiveRestore data-icon="inline-start" aria-hidden />
        {t('library.restore')}
      </Button>
      {more}
    </li>
  )
}
