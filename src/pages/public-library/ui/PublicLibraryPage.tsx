import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowDownUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicKind, PublicSort } from '@/shared/api/public-library'
import { BackButton, Dropdown, ScreenHeader, SearchField, Segmented } from '@/shared/ui'
import { PUBLIC_KINDS, PUBLIC_SORTS, type PublicView } from '../model/public-view'
import { usePublicBrowse } from '../model/use-public-browse'
import { PublicResults } from './PublicResults'

/**
 * The Public library (ADR 0116), as a store's browse reads: the bar with Songs · Patterns as a small
 * switch under its title; the search, the sort joined to its end as Songs' library has it (Newest ·
 * Most saved); then what is published, a card of rows. Every state says itself: loading rows, nothing
 * yet and how to publish the first, nothing found, offline. It needs a connection and says so.
 */
export function PublicLibraryPage() {
  const { t } = useTranslation('songs')
  const view = useSearch({ from: '/shell/songs/public' })
  const navigate = useNavigate({ from: '/songs/public' })
  const { browse, retry } = usePublicBrowse(view)
  const show = (next: Partial<PublicView>) =>
    void navigate({ search: (was) => ({ ...was, ...next }), replace: true })
  return (
    <div className="flex flex-col gap-3">
      <ScreenHeader
        title={t('public.title')}
        back={<BackButton fallback={{ to: '/songs' }} />}
        tabs={
          <div className="pb-2 sm:max-w-xs">
            <Segmented
              compact
              label={t('public.kinds.label')}
              value={view.kind}
              options={PUBLIC_KINDS.map((kind: PublicKind) => ({
                value: kind,
                label: t(`public.kinds.${kind}`),
              }))}
              onChange={(kind) => show({ kind })}
            />
          </div>
        }
      />
      <div className="lg:max-w-2xl">
        <SearchField
          value={view.q}
          onChange={(q) => show({ q })}
          label={t('public.search')}
          hint={t('searchHint')}
          screen={t('public.title')}
          end={<SortChoice value={view.sort} onChange={(sort) => show({ sort })} />}
        />
      </div>
      <PublicResults view={view} browse={browse} onRetry={retry} onClear={() => show({ q: '' })} />
    </div>
  )
}

/** The sort, joined to the search's end: its value in a word or two, both in its list. */
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
      className="h-full gap-1.5 rounded-none rounded-r-2xl border-0 border-l border-input bg-muted px-3 text-sm shadow-none hover:bg-accent focus-visible:-outline-offset-3"
    />
  )
}
