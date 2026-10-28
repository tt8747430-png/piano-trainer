import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import {
  pieceKey,
  usePieceHeadings,
  useTempoText,
  usePiecesStoreApi,
  type ChartPiece,
  type SharedSong,
} from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { readSongLink } from '@/features/share-song'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { BackButton, ButtonLink, Fab, FloatingActions, NO_KEYS, ScreenHeader } from '@/shared/ui'
import { ChordChart, useChartPlayback } from '@/widgets/chord-chart'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'none' }
  | { readonly kind: 'song'; readonly song: SharedSong }

/**
 * A shared song as every song reads: its key, meter and tempo in a line, then its chart, its bars
 * under their sections' headings, each to tap and hear on the keys, so the learner hears the song
 * before adding it.
 */
function SharedChart({ song }: { song: SharedSong }) {
  const { t } = useTranslation(['songs', 'music'])
  const piece = useMemo<ChartPiece>(
    () => ({ id: 'shared', kind: 'song', title: song.title, ...song.music }),
    [song],
  )
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const tempo = useTempoText(piece)
  const { playing, toggleBar } = useChartPlayback(performance, piece.tempo)
  return (
    <>
      <p className="-mt-3 text-lg text-muted-foreground">
        {t('shared.facts', {
          key: printedSymbol(keySymbol(pieceKey(piece))),
          meter: piece.meter,
          bpm: tempo,
        })}
      </p>
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} />
      <ChordChart
        performance={performance}
        headings={headings}
        playing={playing}
        onBar={toggleBar}
      />
    </>
  )
}

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
          <SharedChart song={reading.song} />
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
