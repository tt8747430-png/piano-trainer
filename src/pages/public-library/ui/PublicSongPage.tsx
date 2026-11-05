import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { PageKeyboardTools } from '@/features/live-keyboard'
import { CloudOff, Flag, FolderOpen, Plus, SearchX, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LEFT_FIGURES,
  readSharedPattern,
  RIGHT_FIGURES,
  usePatterns,
  usePatternsStoreApi,
  type SharedPattern,
} from '@/entities/pattern'
import { readSharedSong, usePieces, usePiecesStoreApi, type SharedSong } from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { saveOwnPattern } from '@/features/manage-patterns'
import type { NetFailure } from '@/shared/api/network'
import type { PublicEntry, PublicRating } from '@/shared/api/public-library'
import { localText, useLocale } from '@/shared/i18n'
import { useAccount } from '@/shared/lib/account'
import { usePublicLibrary } from '@/shared/lib/public-library'
import {
  BackButton,
  ButtonLink,
  Fab,
  FloatingActions,
  RoundButton,
  Said,
  ScreenHeader,
} from '@/shared/ui'
import { SongPreview, useAuthorName } from '@/widgets/song-preview'
import { About, Byline, FactChips, ReadingItem } from './PublicItemParts'
import { RateStars } from './RateStars'
import { ReportDialog } from './ReportDialog'

type Reading =
  | { readonly kind: 'reading' }
  | { readonly kind: 'gone' }
  | { readonly kind: 'failed'; readonly reason: NetFailure }
  | { readonly kind: 'song'; readonly entry: PublicEntry; readonly song: SharedSong }
  | { readonly kind: 'pattern'; readonly entry: PublicEntry; readonly pattern: SharedPattern }

/** An item, read: as a song or a pattern, else gone or why it could not be read. */
function useItem(itemId: string) {
  const library = usePublicLibrary()
  const [reading, setReading] = useState<Reading>({ kind: 'reading' })
  useEffect(() => {
    let current = true
    void library.item(itemId).then((result) => {
      if (!current) return
      if (!result.ok)
        return setReading(
          result.reason === 'refused'
            ? { kind: 'gone' }
            : { kind: 'failed', reason: result.reason },
        )
      const found = result.value
      if (!found) return setReading({ kind: 'gone' })
      if (found.entry.kind === 'pattern') {
        const pattern = readSharedPattern(found.body)
        return setReading(
          pattern ? { kind: 'pattern', entry: found.entry, pattern } : { kind: 'gone' },
        )
      }
      const song = readSharedSong(found.body)
      setReading(song ? { kind: 'song', entry: found.entry, song } : { kind: 'gone' })
    })
    return () => {
      current = false
    }
  }, [library, itemId])
  /** Its rating as a learner's stars left it. */
  const rated = (rating: PublicRating) =>
    setReading((now) =>
      now.kind === 'song' || now.kind === 'pattern'
        ? { ...now, entry: { ...now.entry, rating } }
        : now,
    )
  return { reading, rated }
}

/**
 * An item of Explore (B3, Noji's deck page): its title in the bar with Report; a card that says it
 * is from Explore and not (or now) in the learner's library, who shared it, its stars to read and
 * give, and its saves; what its author wrote of it; its facts; a song's chart to hear on the keys, a
 * pattern's figures. Add to my library, at the foot, copies it in (counted once where they are
 * signed in), and then reads Open in my library.
 */
export function PublicSongPage() {
  const { t } = useTranslation('songs')
  const { itemId } = useParams({ from: '/shell/songs/public/$itemId' })
  const library = usePublicLibrary()
  const { account } = useAccount()
  const pieces = usePiecesStoreApi()
  const patterns = usePatternsStoreApi()
  const locale = useLocale()
  const navigate = useNavigate()
  const { reading, rated } = useItem(itemId)
  const [reporting, setReporting] = useState(false)
  const author = useAuthorName(
    reading.kind === 'song' || reading.kind === 'pattern' ? reading.entry : { authorName: '' },
  )
  // In the learner's library already: a song added from this item, a pattern of the same figures.
  const ownSong = usePieces((state) => state.songs.find((song) => song.publicId === itemId)?.id)
  const ownPattern = usePatterns((state) =>
    reading.kind === 'pattern'
      ? state.own.find(
          (pattern) => pattern.rh === reading.pattern.rh && pattern.lh === reading.pattern.lh,
        )?.id
      : undefined,
  )
  const add = () => {
    if (reading.kind === 'song' && !ownSong) addSong(pieces, reading.song, author, itemId)
    else if (
      reading.kind === 'pattern' &&
      !ownPattern &&
      !saveOwnPattern(patterns, reading.pattern)
    )
      return
    if (account) void library.save(itemId)
  }
  const open = () => {
    if (ownSong) void navigate({ to: '/songs/$pieceId', params: { pieceId: ownSong } })
    else if (ownPattern)
      void navigate({
        to: '/practice/accompaniment/patterns/$patternRef',
        params: { patternRef: ownPattern },
      })
  }
  const title =
    reading.kind === 'song'
      ? reading.song.title
      : reading.kind === 'pattern'
        ? reading.pattern.name
        : t('explore.views.explore')
  if (reading.kind !== 'song' && reading.kind !== 'pattern')
    return (
      <div className="flex flex-col gap-5">
        <ScreenHeader title={title} back={<BackButton />} />
        {reading.kind === 'reading' ? (
          <ReadingItem label={t('shared.reading')} />
        ) : (
          <Said
            icon={
              reading.kind === 'gone'
                ? SearchX
                : reading.reason === 'offline'
                  ? CloudOff
                  : TriangleAlert
            }
            paint="sand"
            title={
              reading.kind === 'gone'
                ? t('public.gone')
                : reading.reason === 'offline'
                  ? t('explore.offline')
                  : t('explore.failed')
            }
            action={
              <ButtonLink variant="soft" render={<Link to="/songs" search={{ view: 'explore' }} />}>
                {t('explore.views.explore')}
              </ButtonLink>
            }
          />
        )}
      </div>
    )
  const { entry } = reading
  const owned = reading.kind === 'song' ? ownSong : ownPattern
  const facts =
    reading.kind === 'pattern'
      ? [
          {
            name: t('public.rightHand'),
            value: localText(RIGHT_FIGURES[reading.pattern.rh].name, locale),
          },
          {
            name: t('public.leftHand'),
            value: localText(LEFT_FIGURES[reading.pattern.lh].name, locale),
          },
        ]
      : []
  return (
    <div className="flex flex-col gap-5 pb-24">
      <ScreenHeader
        title={title}
        back={<BackButton />}
        tools={
          <>
            {reading.kind === 'song' ? <PageKeyboardTools /> : null}
            <RoundButton
              label={t('public.report')}
              icon={Flag}
              onClick={() => setReporting(true)}
            />
          </>
        }
      />
      {/* Its overview card, as a song's page has (Noji's deck header): whose it is, its stars and saves. */}
      <section aria-label={title} className="card flex flex-col gap-4 p-4">
        <p className="text-sm font-semibold text-muted-foreground">
          {owned ? t('explore.yours') : t('explore.notYours')}
        </p>
        <Byline entry={entry} />
        <RateStars itemId={itemId} rating={entry.rating} onRated={rated} />
      </section>
      <About entry={entry} />
      {/* A song's key, time and tempo, then its chart to hear; a pattern's two figures. */}
      {reading.kind === 'song' ? <SongPreview song={reading.song} /> : <FactChips facts={facts} />}
      <FloatingActions>
        {owned ? (
          <Fab label={t('explore.open')} icon={FolderOpen} extended onClick={open} />
        ) : (
          <Fab label={t('explore.add')} icon={Plus} extended onClick={add} />
        )}
      </FloatingActions>
      <ReportDialog itemId={itemId} open={reporting} onOpenChange={setReporting} />
    </div>
  )
}
