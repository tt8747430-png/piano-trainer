import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePiecesStoreApi, type SharedSong } from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { readSongLink } from '@/features/share-song'
import { BackButton, ButtonLink, Fab, FloatingActions, ScreenHeader } from '@/shared/ui'
import { SongPreview } from '@/widgets/song-preview'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'none' }
  | { readonly kind: 'song'; readonly song: SharedSong }

/**
 * A song someone shared: read from its link, shown as its chart, and
 * played on its keys, and made one of the learner's own songs only when they say so (Add floats).
 */
export function SharedSongPage() {
  const { t } = useTranslation('songs')
  const { song: data } = useSearch({ from: '/shell/songs/shared' })
  const pieces = usePiecesStoreApi()
  const navigate = useNavigate()
  const [reading, setReading] = useState<Reading>({ kind: 'reading' })
  useEffect(() => {
    let current = true
    void readSongLink(data).then((song) => {
      if (current) setReading(song ? { kind: 'song', song } : { kind: 'none' })
    })
    return () => {
      current = false
    }
  }, [data])
  // Added once: a second press before the song's page opens adds nothing.
  const added = useRef(false)
  const [adding, setAdding] = useState(false)
  const add = (song: SharedSong) => {
    if (added.current) return
    added.current = true
    setAdding(true)
    const id = addSong(pieces, song)
    void navigate({ to: '/songs/$pieceId', params: { pieceId: id }, replace: true })
  }
  const title = reading.kind === 'song' ? reading.song.title : t('shared.title')
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={title} back={<BackButton fallback={{ to: '/songs' }} />} />
      {reading.kind === 'reading' ? (
        <p role="status" className="text-muted-foreground">
          {t('shared.reading')}
        </p>
      ) : reading.kind === 'none' ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('shared.none')}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink variant="outline" render={<Link to="/songs" />}>
              {t('shared.toSongs')}
            </ButtonLink>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <SongPreview song={reading.song} />
          <FloatingActions>
            {/* The page's one action, named in words: a lone + would not say what it adds to. */}
            <Fab
              label={t('shared.add')}
              icon={Plus}
              extended
              disabled={adding}
              onClick={() => add(reading.song)}
            />
          </FloatingActions>
        </>
      )}
    </div>
  )
}
