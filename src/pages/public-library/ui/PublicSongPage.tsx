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
import {
  pieceKey,
  readSharedSong,
  usePieces,
  usePiecesStoreApi,
  type SharedSong,
} from '@/entities/piece'
import { addSong } from '@/features/edit-piece'
import { saveOwnPattern } from '@/features/manage-patterns'
import type { NetFailure } from '@/shared/api/network'
import type { PublicEntry, PublicRating } from '@/shared/api/public-library'
import { localText, useKeyName, useLocale } from '@/shared/i18n'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { usePublicLibrary } from '@/shared/lib/public-library'
import { BackButton, ButtonLink, Said, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ReportDialog, SongPreview, useAuthorName } from '@/widgets/song-preview'
import { About, Byline, Facts, ReadingItem } from './PublicItemParts'
import { RateStars } from './RateStars'

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
 * An item of Explore as Flat's public score page (owner, 2026-11-17): on a laptop an info pane at
 * the left (its title, who shared it, whether it is in the library and Add to my library, its
 * stars, what its author wrote, its facts and tags, Report) beside the music under its toolbar; on
 * a phone the same, the music after the head. Add to my library copies it in (counted once where
 * they are signed in), then reads Open in my library. Nothing floats.
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
  const { t: tm, i18n } = useTranslation(['music', 'piece'])
  const keyName = useKeyName()
  const laptop = useMediaQuery(LAPTOP)
  const keyLabel = tm('music:key.label')
  const timeLabel = tm('piece:time')
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
            title={
              reading.kind === 'gone'
                ? t('public.gone')
                : reading.reason === 'offline'
                  ? t('explore.offline')
                  : t('explore.failed')
            }
            {...(reading.kind === 'failed'
              ? {
                  description: t(
                    reading.reason === 'offline' ? 'explore.offlineLine' : 'explore.failedLine',
                  ),
                }
              : {})}
            action={
              reading.kind === 'failed' && reading.reason === 'offline' ? (
                <ButtonLink variant="soft" render={<Link to="/songs" search={{ view: 'mine' }} />}>
                  {t('explore.views.mine')}
                </ButtonLink>
              ) : (
                <ButtonLink
                  variant="soft"
                  render={<Link to="/songs" search={{ view: 'explore' }} />}
                >
                  {t('explore.views.explore')}
                </ButtonLink>
              )
            }
          />
        )}
      </div>
    )
  const { entry } = reading
  const owned = reading.kind === 'song' ? ownSong : ownPattern
  const keyFacts =
    reading.kind === 'song'
      ? [
          { name: t('public.composer'), value: entry.meta.composer ?? '' },
          {
            name: t('public.type'),
            value: entry.meta.type ? t(`public.types.${entry.meta.type}`) : '',
          },
          {
            name: keyLabel,
            value: keyName(pieceKey({ id: itemId, kind: 'song', title, ...reading.song.music })),
            phoneOnly: true,
          },
          { name: timeLabel, value: reading.song.music.meter, phoneOnly: true },
        ]
      : [
          {
            name: t('public.rightHand'),
            value: localText(RIGHT_FIGURES[reading.pattern.rh].name, locale),
          },
          {
            name: t('public.leftHand'),
            value: localText(LEFT_FIGURES[reading.pattern.lh].name, locale),
          },
        ]
  const facts = [
    ...keyFacts,
    {
      name: t('public.publishedOn'),
      value: new Date(entry.publishedAt).toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
  ].filter((fact) => fact.value !== '')
  const head = (
    <>
      <h1 className="text-[1.625rem] leading-tight font-bold text-balance">{title}</h1>
      <Byline entry={entry} />
      {/* Whether it is in the library, then the page's one act, in its head (owner, 2026-11-17: nothing floats). */}
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span aria-hidden className="size-2 rounded-full bg-learned" />
          {owned ? t('explore.yours') : t('explore.notYours')}
        </p>
        {owned ? (
          <Button size="lg" variant="soft" className="rounded-pill font-bold" onClick={open}>
            <FolderOpen data-icon="inline-start" />
            {t('explore.open')}
          </Button>
        ) : (
          <Button size="lg" className="rounded-pill font-bold" onClick={add}>
            <Plus data-icon="inline-start" />
            {t('explore.add')}
          </Button>
        )}
      </div>
    </>
  )
  const about = (
    <>
      <RateStars itemId={itemId} rating={entry.rating} onRated={rated} />
      <About entry={entry} />
      <Facts facts={facts} tags={entry.meta.tags ?? []} />
    </>
  )
  const report = (
    <button
      type="button"
      onClick={() => setReporting(true)}
      className="flex h-11 items-center gap-2.5 self-start rounded-control px-1 text-[0.9375rem] font-semibold text-muted-foreground hover:text-foreground"
    >
      <Flag aria-hidden className="size-5" />
      {t(reading.kind === 'song' ? 'public.reportSong' : 'public.reportPattern')}
    </button>
  )
  const music = reading.kind === 'song' ? <SongPreview song={reading.song} /> : null
  return (
    <div className="flex flex-col gap-5 pb-8">
      <ScreenHeader
        title={title}
        titleOnPage
        back={<BackButton />}
        tools={reading.kind === 'song' ? <PageKeyboardTools /> : undefined}
      />
      {laptop ? (
        // Flat's public score: the info pane at the left, the music beside it under its toolbar.
        <div className="grid grid-cols-[21.25rem_minmax(0,1fr)] items-start gap-8">
          <aside className="card sticky top-4 flex flex-col gap-4 p-5">
            {head}
            <hr className="border-border" />
            {about}
            <hr className="border-border" />
            {report}
          </aside>
          <div className="flex min-w-0 flex-col gap-5">{music}</div>
        </div>
      ) : (
        <>
          {head}
          {music}
          <section className="card flex flex-col gap-4 p-4">{about}</section>
          {report}
        </>
      )}
      <ReportDialog itemId={itemId} open={reporting} onOpenChange={setReporting} />
    </div>
  )
}
