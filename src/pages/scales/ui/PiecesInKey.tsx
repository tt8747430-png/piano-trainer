import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { entriesInKey, shelfOf } from '@/entities/piece'
import type { Key } from '@/shared/lib/music'
import { PieceList } from '@/widgets/piece-list'

/** The songs written in a key, and the studies apart from them; one line where no song is. */
export function PiecesInKey({ musicKey }: { musicKey: Key }) {
  const { t } = useTranslation('learn')
  const songsId = useId()
  const inKey = entriesInKey(musicKey)
  const songs = inKey.filter((entry) => shelfOf(entry.kind) === 'songs')
  const groups = [
    { id: 'songs-in-key', heading: t('keys.songs'), entries: songs },
    {
      id: 'studies-in-key',
      heading: t('keys.studies'),
      entries: inKey.filter((entry) => entry.kind === 'study'),
    },
  ].filter((group) => group.entries.length > 0)
  return (
    <>
      {songs.length > 0 ? null : (
        <section aria-labelledby={songsId} className="flex flex-col gap-2">
          <h2 id={songsId} className="text-2xl">
            {t('keys.songs')}
          </h2>
          <p className="text-muted-foreground">{t('keys.noSongs')}</p>
        </section>
      )}
      {groups.length > 0 ? <PieceList groups={groups} /> : null}
    </>
  )
}
