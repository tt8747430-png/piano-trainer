import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowDownUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicKind, PublicSort } from '@/shared/api/public-library'
import { BackButton, ChoiceChips, Dropdown, ScreenHeader, SearchField } from '@/shared/ui'
import { PUBLIC_KINDS, PUBLIC_SORTS, type PublicView } from '../model/public-view'
import { usePublicBrowse, type Browse } from '../model/use-public-browse'
import { PublicResults } from './PublicResults'
import { PublicShelf } from './PublicShelf'

/** The fewest items for shelves to stand over the list: fewer read best as the list alone. */
const SHELVED = 4

/** The list's id, where a shelf's See all goes. */
const ALL = 'public-all'

/**
 * The Public library (ADR 0116), as Noji's Library reads: its title and a line of what it is, the
 * search, Songs · Patterns as chips; then, while nothing is searched and enough is published, the
 * Newest and the Most saved as shelves of cards across, each with See all (the list in that order);
 * then the whole list, a card of rows, its sort at its head. Searched, the list alone. Every state
 * says itself: loading rows, nothing yet and how to publish the first, nothing found, offline.
 */
export function PublicLibraryPage() {
  const { t } = useTranslation('songs')
  const view = useSearch({ from: '/shell/songs/public' })
  const navigate = useNavigate({ from: '/songs/public' })
  const searching = view.q.trim() !== ''
  const newest = usePublicBrowse({ kind: view.kind, sort: 'new', q: '' })
  const loved = usePublicBrowse({ kind: view.kind, sort: 'saved', q: '' })
  const searched = usePublicBrowse(searching ? view : null)
  const all = searching ? searched : view.sort === 'saved' ? loved : newest
  const show = (next: Partial<PublicView>) =>
    void navigate({ search: (was) => ({ ...was, ...next }), replace: true })
  const seeAll = (sort: PublicSort) => {
    show({ sort })
    document.getElementById(ALL)?.scrollIntoView({ block: 'start' })
  }
  const shelved = !searching && songsOf(newest.browse).length >= SHELVED
  const savedOnes = songsOf(loved.browse).filter((entry) => entry.saves > 0)
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={t('public.title')}
        large
        back={<BackButton fallback={{ to: '/songs' }} />}
      />
      <p className="-mt-2 text-pretty text-muted-foreground">{t('public.line')}</p>
      <div className="flex flex-col gap-3 lg:max-w-2xl">
        <SearchField
          value={view.q}
          onChange={(q) => show({ q })}
          label={t('public.search')}
          hint={t('searchHint')}
          screen={t('public.title')}
        />
        <ChoiceChips
          label={t('public.kinds.label')}
          value={view.kind}
          options={PUBLIC_KINDS.map((kind: PublicKind) => ({
            value: kind,
            label: t(`public.kinds.${kind}`),
          }))}
          onChange={(kind) => show({ kind })}
        />
      </div>
      {shelved ? (
        <>
          <PublicShelf
            title={t('public.sort.new')}
            entries={songsOf(newest.browse)}
            onSeeAll={() => seeAll('new')}
          />
          {savedOnes.length >= 2 ? (
            <PublicShelf
              title={t('public.sort.saved')}
              entries={savedOnes}
              onSeeAll={() => seeAll('saved')}
            />
          ) : null}
        </>
      ) : null}
      <div id={ALL} className="flex scroll-mt-24 flex-col gap-2">
        <PublicResults
          view={view}
          browse={all.browse}
          onRetry={all.retry}
          onClear={() => show({ q: '' })}
          sort={<SortChoice value={view.sort} onChange={(sort) => show({ sort })} />}
        />
      </div>
    </div>
  )
}

/** What a browse found, none while it is asked or where it failed. */
const songsOf = (browse: Browse) => (browse.kind === 'songs' ? browse.songs : [])

/** The list's sort, at its head's end: its value in a word or two, both in its list. */
function SortChoice({
  value,
  onChange,
}: {
  value: PublicSort
  onChange: (sort: PublicSort) => void
}) {
  const { t } = useTranslation('songs')
  return (
    <Dropdown<PublicSort>
      label={t('public.sort.label')}
      value={value}
      onChange={onChange}
      options={PUBLIC_SORTS.map((sort) => ({ value: sort, label: t(`public.sort.${sort}`) }))}
      bare
      align="end"
      face={(sort) => (
        <span className="flex items-center gap-1.5">
          <ArrowDownUp aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">{t(`public.sort.${sort}`)}</span>
        </span>
      )}
      className="h-9 gap-1.5 rounded-full border-0 bg-transparent px-3 text-sm font-semibold text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
    />
  )
}
