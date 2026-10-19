import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  usePieceHeadings,
  usePiecesStoreApi,
  type ChartPiece,
  type SharedSong,
} from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { readSongLink } from '@/features/share-song'
import { BackButton, ButtonLink, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'none' }
  | { readonly kind: 'song'; readonly song: SharedSong }

/** A shared song's chart as it reads: each section under its heading, its lines of chords. */
function SharedChart({ song }: { song: SharedSong }) {
  const piece = useMemo<ChartPiece>(
    () => ({ id: 'shared', kind: 'song', title: song.title, ...song.music }),
    [song],
  )
  const headings = usePieceHeadings(piece)
  return (
    <div className="flex flex-col gap-5">
      {piece.sections.map((section, i) => (
        <section key={i} className="flex flex-col gap-1">
          <h2 className="text-xl">{headings[i]}</h2>
          {section.lines.map((line, j) => (
            <p key={j} className="font-display text-lg tracking-wide">
              {line}
            </p>
          ))}
        </section>
      ))}
    </div>
  )
}

/**
 * A song someone shared (spec 2026-10-11-share-a-song): read from its link, shown as its chart, and
 * made one of the learner's own songs only when they say so.
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
          <p className="-mt-3 text-lg text-muted-foreground">
            {t('shared.facts', {
              key: reading.song.music.key,
              meter: reading.song.music.meter,
              tempo: reading.song.music.tempo,
            })}
          </p>
          <Button
            size="pill"
            className="self-start"
            disabled={adding}
            onClick={() => add(reading.song)}
          >
            <Plus data-icon="inline-start" aria-hidden />
            {t('shared.add')}
          </Button>
          <SharedChart song={reading.song} />
        </>
      )}
    </div>
  )
}
