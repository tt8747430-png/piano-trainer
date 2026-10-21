import { useNavigate, useSearch } from '@tanstack/react-router'
import { ListMusic, Plus } from 'lucide-react'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { SONG_COLLECTIONS, useRepertoire } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { STAGES } from '@/entities/step'
import { Dropdown, FloatingActions, ScreenHeader, SearchField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Toggle } from '@/shared/ui/primitives/toggle'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs'
import { PieceList } from '@/widgets/piece-list'
import type { SongsFilter, SongsShelf } from '../model/songs-filter'
import { songsView, stagesIn } from '../model/songs-view'
import { NewSongSheet } from './NewSongSheet'

/**
 * Songs: the collections as tabs in its bar (the learner's own songs first, All before them), a
 * search, Stage (a song's course's, ADR 0005; only the stages its shelves hold) and With chords (no song whose chart is still to come),
 * and the songs as cards in as many
 * columns as the width holds, under their collection while All shows; New song floats.
 */
export function SongsPage() {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const locale = useLocale()
  const search = useSearch({ from: '/shell/songs' })
  const navigate = useNavigate({ from: '/songs' })
  const query = useDeferredValue(search.q)
  const set = useViewChange<SongsFilter>()
  // No search, stage or With chords: the route fills its defaults; the shelf chosen stays.
  const clear = () => void navigate({ search: { collection: search.collection }, replace: true })
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
  const searched = search.q.trim()
  // Only the stages these shelves hold are offered (a choice that shows nothing is not), and the
  // one chosen, which a link may carry.
  const held = stagesIn(shelves, search)
  const stages = STAGES.filter((stage) => held.includes(stage) || stage === search.stage)
  const groups = songsView(shelves, { ...search, q: query }).map((g) => ({
    id: g.shelf.id,
    heading: search.collection === 'all' ? g.shelf.name : null,
    entries: g.entries,
  }))

  return (
    <Tabs
      value={search.collection}
      onValueChange={(next: unknown) => {
        if (isShelf(next)) set({ collection: next })
      }}
      className="gap-4"
    >
      <ScreenHeader
        title={t('title')}
        tabs={
          <TabsList aria-label={t('collection')} className="-mx-gutter px-gutter">
            <TabsTrigger value="all">{t('all')}</TabsTrigger>
            {tabs.map((shelf) => (
              <TabsTrigger key={shelf.id} value={shelf.id}>
                {shelf.name}
              </TabsTrigger>
            ))}
          </TabsList>
        }
      />
      {/* The search its own row on a phone, the filters under it, each whole: where both do not fit
          (a chosen stage in Russian at 360px) they wrap, never cut. One row from a tablet. */}
      <div className="flex flex-wrap items-center gap-2 lg:max-w-3xl">
        <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
          <SearchField
            value={search.q}
            onChange={(q) => set({ q })}
            label={t('search')}
            screen={t('title')}
          />
        </div>
        {stages.length > 0 ? (
          <Dropdown
            label={t('stage')}
            value={search.stage}
            onChange={(stage) => set({ stage })}
            options={[
              { value: 'any', label: t('anyStage') },
              ...stages.map((stage) => ({ value: stage, label: common(`stage.${stage}`) })),
            ]}
            className="flex-auto sm:flex-none"
          />
        ) : null}
        <Toggle
          pressed={search.withChords}
          onPressedChange={(withChords) => set({ withChords })}
          className="flex-auto sm:flex-none"
        >
          <ListMusic aria-hidden />
          {t('withChords')}
        </Toggle>
      </div>
      {groups.length > 0 ? (
        <PieceList groups={groups} />
      ) : search.collection === 'mine' && pieces.ownSongs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('mineEmpty.title')}</EmptyTitle>
            <EmptyDescription>{t('mineEmpty.description')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <NewSongSheet
              trigger={
                <Button variant="soft">
                  <Plus data-icon="inline-start" aria-hidden />
                  {t('newSong')}
                </Button>
              }
            />
          </EmptyContent>
        </Empty>
      ) : (
        <Empty>
          <EmptyHeader>
            {/* A long query breaks rather than run off the screen. */}
            <EmptyTitle className="break-words">
              {search.stage === 'any'
                ? searched
                  ? t('emptyQuery', { query: searched })
                  : t('empty')
                : searched
                  ? t('emptyQueryStage', {
                      query: searched,
                      stage: common(`stage.${search.stage}`),
                    })
                  : t('emptyStage', { stage: common(`stage.${search.stage}`) })}
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="soft" onClick={clear}>
              {t('clearFilters')}
            </Button>
          </EmptyContent>
        </Empty>
      )}
      <FloatingActions>
        <NewSongSheet />
      </FloatingActions>
    </Tabs>
  )
}
