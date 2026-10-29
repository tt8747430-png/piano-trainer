import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { PublicEntry, PublicSort } from '@/shared/api/public-library'
import { keySymbol, parseKey, printedSymbol } from '@/shared/lib/music'
import { BackButton, RowLink, ScreenHeader, SearchField, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { PUBLIC_SORTS } from '../model/public-view'
import { usePublicBrowse } from '../model/use-public-browse'

/** A song's key, as printed, and its meter: what its row says at its end. */
function factsOf({ meta }: PublicEntry): string | undefined {
  const key = meta.key ? parseKey(meta.key) : null
  return (
    [key ? printedSymbol(keySymbol(key)) : undefined, meta.meter].filter(Boolean).join(' · ') ||
    undefined
  )
}

/**
 * The Public library (ADR 0116): the songs learners published, the newest or the most saved first,
 * searched by title; each opens its page to hear and save. It needs a connection and says so.
 */
export function PublicLibraryPage() {
  const { t } = useTranslation('songs')
  const view = useSearch({ from: '/shell/songs/public' })
  const navigate = useNavigate({ from: '/songs/public' })
  const { browse, retry } = usePublicBrowse(view)
  const show = (next: Partial<typeof view>) =>
    void navigate({ search: (was) => ({ ...was, ...next }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('public.title')} back={<BackButton fallback={{ to: '/songs' }} />} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <SearchField
            value={view.q}
            onChange={(q) => show({ q })}
            label={t('public.search')}
            screen={t('public.title')}
          />
        </div>
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
      ) : browse.songs.length === 0 ? (
        <p role="status" className="text-muted-foreground">
          {view.q.trim() ? t('public.noMatch', { query: view.q.trim() }) : t('public.empty')}
        </p>
      ) : (
        <ul aria-label={t('public.title')} className="grid-cards gap-2 *:card">
          {browse.songs.map((song) => (
            <li key={song.id}>
              <RowLink
                title={song.title}
                detail={`${t('public.by', { name: song.authorName })} · ${t('public.saves', { count: song.saves })}`}
                value={factsOf(song)}
                render={<Link to="/songs/public/$itemId" params={{ itemId: song.id }} />}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
