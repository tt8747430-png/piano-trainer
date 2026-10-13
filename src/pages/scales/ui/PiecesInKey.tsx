import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { entriesInKey, shelfOf } from '@/entities/piece'
import type { Key } from '@/shared/lib/music'
import { PieceList } from '@/widgets/piece-list'

/** The songs written in a key, and the studies apart from them; one line where no song is. */
export function PiecesInKey({ musicKey }: { musicKey: Key }) {
  const { t } = useTranslation('practice')
  const songsId = useId()
  const inKey = entriesInKey(musicKey)
  const songs = inKey.filter((entry) => shelfOf(entry.kind) === 'songs')
  const groups = [
    { id: 'songs-in-key', heading: t('scales.key.songs'), entries: songs },
    {
      id: 'studies-in-key',
      heading: t('scales.key.studies'),
      entries: inKey.filter((entry) => entry.kind === 'study'),
    },
  ].filter((group) => group.entries.length > 0)
  return (
    <>
      {songs.length > 0 ? null : (
        <section aria-labelledby={songsId} className="flex flex-col gap-2">
          <h2 id={songsId} className="text-2xl">
            {t('scales.key.songs')}
          </h2>
          <p className="text-muted-foreground">{t('scales.key.noSongs')}</p>
        </section>
      )}
      {groups.length > 0 ? <PieceList groups={groups} /> : null}
    </>
  )
}
