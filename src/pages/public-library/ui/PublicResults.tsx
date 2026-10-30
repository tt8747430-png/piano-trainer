import { Link } from '@tanstack/react-router'
import {
  AudioWaveform,
  Bookmark,
  CloudOff,
  Globe,
  Music,
  SearchX,
  TriangleAlert,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, RIGHT_FIGURES, isLeftFigureId, isRightFigureId } from '@/entities/pattern'
import type { PublicEntry } from '@/shared/api/public-library'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { keySymbol, parseKey, printedSymbol } from '@/shared/lib/music'
import { ButtonLink, RowLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { itemPaint } from '../model/item-paint'
import type { PublicView } from '../model/public-view'
import type { Browse } from '../model/use-public-browse'
import { Said } from './Said'

/** A kind's tile: a song's note, a pattern's wave. */
const KIND_ICON = { song: Music, pattern: AudioWaveform } as const

/** A pattern's figures, the right hand's then the left's, by their names. */
function figuresOf({ meta }: PublicEntry, locale: Locale): string[] {
  const rh =
    meta.rh && isRightFigureId(meta.rh) ? localText(RIGHT_FIGURES[meta.rh].name, locale) : ''
  const lh = meta.lh && isLeftFigureId(meta.lh) ? localText(LEFT_FIGURES[meta.lh].name, locale) : ''
  return [rh, lh].filter(Boolean)
}

/** A song's key, as printed, and its meter. */
function factsOf({ meta }: PublicEntry): string[] {
  const key = meta.key ? parseKey(meta.key) : null
  return [key ? printedSymbol(keySymbol(key)) : '', meta.meter ?? ''].filter(Boolean)
}

/**
 * What the Public library found for its view: while asked, rows of grey; then a count over a card of
 * rows; or, with none, why: offline or failed (Try again), nothing matching the search (Show all),
 * or nothing published yet, with the way to publish the first.
 */
export function PublicResults({
  view,
  browse,
  onRetry,
  onClear,
}: {
  view: PublicView
  browse: Browse
  onRetry: () => void
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const pattern = view.kind === 'pattern'
  if (browse.kind === 'loading') return <LoadingRows label={t('public.loading')} />
  if (browse.kind === 'failed') {
    const offline = browse.reason === 'offline'
    return (
      <Said
        icon={offline ? CloudOff : TriangleAlert}
        paint="sand"
        title={offline ? t('public.offline') : t('public.failed')}
        action={
          <Button variant="soft" onClick={onRetry}>
            {t('public.again')}
          </Button>
        }
      />
    )
  }
  const query = view.q.trim()
  if (browse.songs.length === 0 && query)
    return (
      <Said
        icon={SearchX}
        paint="sky"
        title={t(pattern ? 'public.noMatchPattern' : 'public.noMatch', { query })}
        action={
          <Button variant="soft" onClick={onClear}>
            {t('public.clear')}
          </Button>
        }
      />
    )
  if (browse.songs.length === 0)
    // Nothing published yet: say so, and the way to publish the first (an empty state that teaches).
    return (
      <Said
        icon={Globe}
        paint="grass"
        title={t(pattern ? 'public.emptyPatterns' : 'public.empty')}
        description={t(pattern ? 'public.firstPattern' : 'public.firstSong')}
        action={
          <ButtonLink
            variant="soft"
            render={pattern ? <Link to="/practice/accompaniment" /> : <Link to="/songs" />}
          >
            {t(pattern ? 'public.toPatterns' : 'public.toSongs')}
          </ButtonLink>
        }
      />
    )
  return (
    <section className="flex flex-col gap-2">
      <p className="px-3 text-sm font-semibold text-muted-foreground tabular-nums">
        {t(pattern ? 'public.patternCount' : 'public.songCount', { count: browse.songs.length })}
      </p>
      <ul aria-label={t('public.title')} className="grid-cards gap-x-2 card p-1.5">
        {browse.songs.map((entry) => (
          <PublicRow key={entry.id} entry={entry} />
        ))}
      </ul>
    </section>
  )
}

/**
 * A published song or pattern as a library's row: its tile in a paint of its own, its title, who
 * published it and what it is (a song's key and time, a pattern's figures), how often it is saved.
 */
function PublicRow({ entry }: { entry: PublicEntry }) {
  const locale = useLocale()
  const facts = entry.kind === 'pattern' ? figuresOf(entry, locale) : factsOf(entry)
  return (
    <li>
      <RowLink
        icon={KIND_ICON[entry.kind]}
        paint={itemPaint(entry.id)}
        title={entry.title}
        detail={entry.authorName}
        // What it is, kept whole at the line's end; a long name is cut short before it.
        count={facts.length > 0 ? facts.join(' · ') : undefined}
        trailing={entry.saves > 0 ? <Saves count={entry.saves} /> : undefined}
        render={<Link to="/songs/public/$itemId" params={{ itemId: entry.id }} />}
      />
    </li>
  )
}

/** How often an item is saved: a bookmark and its number, said in words. */
function Saves({ count }: { count: number }) {
  const { t } = useTranslation('songs')
  return (
    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground tabular-nums">
      <Bookmark aria-hidden className="size-4" />
      <span aria-hidden>{count}</span>
      <span className="sr-only">{t('public.saves', { count })}</span>
    </span>
  )
}

/** Rows of grey where the list will be, while the library is asked; said once, to a screen reader. */
function LoadingRows({ label }: { label: string }) {
  return (
    <section aria-busy className="flex flex-col gap-2">
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden className="mx-3 h-4 w-20 rounded-full bg-muted motion-safe:animate-pulse" />
      <ul aria-hidden className="grid-cards gap-x-2 card p-1.5">
        {[0.7, 0.45, 0.6, 0.5, 0.65].map((width, i) => (
          <li key={i} className="flex min-h-16 items-center gap-3 py-2 pr-3 pl-2">
            <span className="size-12 shrink-0 rounded-2xl bg-muted motion-safe:animate-pulse" />
            <span className="flex min-w-0 flex-1 flex-col gap-2">
              <span
                className="h-4 rounded-full bg-muted motion-safe:animate-pulse"
                style={{ width: `${width * 100}%` }}
              />
              <span className="h-3 w-1/3 rounded-full bg-muted motion-safe:animate-pulse" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
