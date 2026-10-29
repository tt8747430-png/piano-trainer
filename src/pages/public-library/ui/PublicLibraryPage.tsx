import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, RIGHT_FIGURES, isLeftFigureId, isRightFigureId } from '@/entities/pattern'
import type { PublicEntry, PublicKind, PublicSort } from '@/shared/api/public-library'
import { localText, useLocale, type Locale } from '@/shared/i18n'
import { keySymbol, parseKey, printedSymbol } from '@/shared/lib/music'
import {
  BackButton,
  ButtonLink,
  NavTab,
  NavTabs,
  RowLink,
  ScreenHeader,
  SearchField,
  Segmented,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { PUBLIC_KINDS, PUBLIC_SORTS } from '../model/public-view'
import { usePublicBrowse } from '../model/use-public-browse'

/** A pattern's figures, the right hand's then the left's, by their names. */
function figuresOf({ meta }: PublicEntry, locale: Locale): string | undefined {
  const rh =
    meta.rh && isRightFigureId(meta.rh) ? localText(RIGHT_FIGURES[meta.rh].name, locale) : ''
  const lh = meta.lh && isLeftFigureId(meta.lh) ? localText(LEFT_FIGURES[meta.lh].name, locale) : ''
  return [rh, lh].filter(Boolean).join(' · ') || undefined
}

/** A song's key, as printed, and its meter: what its row says at its end. */
function factsOf({ meta }: PublicEntry): string | undefined {
  const key = meta.key ? parseKey(meta.key) : null
  return (
    [key ? printedSymbol(keySymbol(key)) : undefined, meta.meter].filter(Boolean).join(' · ') ||
    undefined
  )
}

/**
 * The Public library (ADR 0116): the songs and the patterns learners published, a kind at a time, the
 * newest or the most saved first, searched by title; each opens its page to hear or read and save. It
 * needs a connection and says so.
 */
export function PublicLibraryPage() {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const view = useSearch({ from: '/shell/songs/public' })
  const navigate = useNavigate({ from: '/songs/public' })
  const { browse, retry } = usePublicBrowse(view)
  const show = (next: Partial<typeof view>) =>
    void navigate({ search: (was) => ({ ...was, ...next }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('public.title')}
        back={<BackButton fallback={{ to: '/songs' }} />}
        tabs={
          <NavTabs label={t('public.kinds.label')}>
            {PUBLIC_KINDS.map((kind: PublicKind) => (
              <NavTab
                key={kind}
                to="/songs/public"
                search={{ ...view, kind }}
                replace
                current={kind === view.kind}
              >
                {t(`public.kinds.${kind}`)}
              </NavTab>
            ))}
          </NavTabs>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <SearchField
            value={view.q}
            onChange={(q) => show({ q })}
            label={t('public.search')}
            screen={t('public.title')}
          />
        </div>
        <div className="shrink-0 sm:w-64">
          <Segmented
            label={t('public.sort.label')}
            value={view.sort}
            options={PUBLIC_SORTS.map((value: PublicSort) => ({
              value,
              label: t(`public.sort.${value}`),
            }))}
            onChange={(sort) => show({ sort })}
          />
        </div>
      </div>
      {browse.kind === 'loading' ? (
        <p role="status" className="text-muted-foreground">
          {t('public.loading')}
        </p>
      ) : browse.kind === 'failed' ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              {browse.reason === 'offline' ? t('public.offline') : t('public.failed')}
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={retry}>
              {t('public.again')}
            </Button>
          </EmptyContent>
        </Empty>
      ) : browse.songs.length === 0 && view.q.trim() ? (
        <p role="status" className="text-muted-foreground">
          {t(view.kind === 'pattern' ? 'public.noMatchPattern' : 'public.noMatch', {
            query: view.q.trim(),
          })}
        </p>
      ) : browse.songs.length === 0 ? (
        // Nothing published yet: say so, and the way to publish the first (an empty state that teaches).
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              <p role="status">
                {t(view.kind === 'pattern' ? 'public.emptyPatterns' : 'public.empty')}
              </p>
            </EmptyTitle>
            <p className="text-muted-foreground">
              {t(view.kind === 'pattern' ? 'public.firstPattern' : 'public.firstSong')}
            </p>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink
              variant="outline"
              render={
                view.kind === 'pattern' ? (
                  <Link to="/practice/accompaniment" />
                ) : (
                  <Link to="/songs" />
                )
              }
            >
              {t(view.kind === 'pattern' ? 'public.toPatterns' : 'public.toSongs')}
            </ButtonLink>
          </EmptyContent>
        </Empty>
      ) : (
        <ul aria-label={t('public.title')} className="grid-cards gap-2 *:card">
          {browse.songs.map((song) => (
            <li key={song.id}>
              <RowLink
                title={song.title}
                detail={`${t('public.by', { name: song.authorName })} · ${t('public.saves', { count: song.saves })}`}
                value={song.kind === 'pattern' ? figuresOf(song, locale) : factsOf(song)}
                render={<Link to="/songs/public/$itemId" params={{ itemId: song.id }} />}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
