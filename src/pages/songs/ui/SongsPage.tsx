import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { SONG_COLLECTIONS, useRepertoire } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs'
import { PieceList } from '@/widgets/piece-list'
import type { SongsFilter, SongsShelf } from '../model/songs-filter'
import { songsView } from '../model/songs-view'
import { NewSongSheet } from './NewSongSheet'
import { SearchField } from './SearchField'

/**
 * Songs: a search, the collections as tabs (the learner's own songs first, All before them), and the
 * songs as cards in as many columns as the width holds, under their collection while All shows.
 */
export function SongsPage() {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const search = useSearch({ from: '/shell/songs' })
  const navigate = useNavigate({ from: '/songs' })
  const query = useDeferredValue(search.q)
  const set = useViewChange<SongsFilter>()
  // No search at all: the route fills its defaults.
  const clear = () => void navigate({ search: {}, replace: true })
  const pieces = useRepertoire()
  // The learner's songs first, then the songbooks', each entry in the learner's version.
  const shelves = [
    { id: 'mine' as const, name: t('yours'), entries: pieces.ownSongs },
    ...SONG_COLLECTIONS.map((collection) => ({
      id: collection.id,
      name: localText(collection.name, locale),
      entries: collection.entries.map((entry) => pieces.entry(entry.id) ?? entry),
    })),
  ]
  const tabs = shelves.filter((shelf) => shelf.entries.length > 0 || shelf.id === search.collection)
  const isShelf = (value: unknown): value is SongsShelf | 'all' =>
    value === 'all' || tabs.some((shelf) => shelf.id === value)
  const groups = songsView(shelves, { ...search, q: query }).map((g) => ({
    id: g.shelf.id,
    heading: search.collection === 'all' ? g.shelf.name : null,
    entries: g.entries,
  }))

  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader title={t('title')} actions={<NewSongSheet />} />
      <div className="lg:max-w-md">
        <SearchField value={search.q} onChange={(q) => set({ q })} />
      </div>
      <Tabs
        value={search.collection}
        onValueChange={(next: unknown) => {
          if (isShelf(next)) set({ collection: next })
        }}
      >
        <TabsList aria-label={t('collection')} className="-mx-gutter px-gutter">
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          {tabs.map((shelf) => (
            <TabsTrigger key={shelf.id} value={shelf.id}>
              {shelf.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.length > 0 ? (
          <PieceList groups={groups} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t('empty')}</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="soft" onClick={clear}>
                {t('clearFilters')}
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </Tabs>
    </div>
  )
}
