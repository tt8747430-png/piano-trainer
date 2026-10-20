import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import {
  usePieceHeadings,
  usePiecesStoreApi,
  type ChartPiece,
  type SharedSong,
} from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { readSongLink } from '@/features/share-song'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { BackButton, ButtonLink, FloatingActions, NO_KEYS, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChordChart } from '@/widgets/chord-chart'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'none' }
  | { readonly kind: 'song'; readonly song: SharedSong }

/**
 * A shared song's chart as every chart reads: its bars under their sections' headings, each to tap
 * and hear on the keys, so the learner hears the song before adding it.
 */
function SharedChart({ song }: { song: SharedSong }) {
  const playback = usePlayback<number>()
  const piece = useMemo<ChartPiece>(
    () => ({ id: 'shared', kind: 'song', title: song.title, ...song.music }),
    [song],
  )
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  return (
    <>
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} />
      <ChordChart
        performance={performance}
        headings={headings}
        playing={playback.playing}
        onBar={(bar) =>
          playback.toggle(bar, () =>
            barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }),
          )
        }
      />
    </>
  )
}

/**
 * A song someone shared (spec 2026-10-11-share-a-song): read from its link, shown as its chart, and
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
          <p className="-mt-3 text-lg text-muted-foreground">
            {t('shared.facts', {
              key: reading.song.music.key,
              meter: reading.song.music.meter,
              tempo: reading.song.music.tempo,
            })}
          </p>
          <p>{t('shared.says')}</p>
          <SharedChart song={reading.song} />
          <FloatingActions>
            {/* The page's one action, named in words: a lone + would not say what it adds to. */}
            <Button
              size="lg"
              disabled={adding}
              onClick={() => add(reading.song)}
              className="h-14 rounded-full px-5 shadow-lg shadow-foreground/15"
            >
              <Plus data-icon="inline-start" aria-hidden />
              {t('shared.add')}
            </Button>
          </FloatingActions>
        </>
      )}
    </div>
  )
}
