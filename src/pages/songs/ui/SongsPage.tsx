import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { LEVEL_NAME, LEVELS, levelOf, pieceStepId, type Level } from '@/entities/path'
import { SONG_COLLECTIONS, useRepertoire, type Entry } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { Dropdown, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { PieceList } from '@/widgets/piece-list'
import type { SongsFilter, SongsShelf } from '../model/songs-filter'
import { songsView } from '../model/songs-view'
import { NewSongSheet } from './NewSongSheet'
import { SearchField } from './SearchField'

const levelOfEntry = (entry: Entry) =>
  entry.kind === 'listing' ? undefined : levelOf(pieceStepId(entry.id))
/** The levels Songs' songs are on: only those are worth choosing. */
const SONG_LEVELS = LEVELS.filter((level) =>
  SONG_COLLECTIONS.some((collection) =>
    collection.entries.some((entry) => levelOfEntry(entry) === level),
  ),
)

export function SongsPage() {
  const { t } = useTranslation(['songs', 'common'])
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
    { id: 'mine' as const, name: t('songs:yours'), entries: pieces.ownSongs },
    ...SONG_COLLECTIONS.map((collection) => ({
      id: collection.id,
      name: localText(collection.name, locale),
      entries: collection.entries.map((entry) => pieces.entry(entry.id) ?? entry),
    })),
  ]
  const groups = songsView(shelves, { ...search, q: query }, levelOfEntry).map((g) => ({
    id: g.shelf.id,
    heading: search.collection === 'all' ? g.shelf.name : null,
    entries: g.entries,
  }))

  return (
    <div className="flex flex-col">
      <ScreenHeader title={t('songs:title')} actions={<NewSongSheet />} />
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-x-10">
        {/* On a laptop the filters stay beside the list, under the screen's bar while it shows. */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-screen-bar-8">
          <SearchField value={search.q} onChange={(q) => set({ q })} />
          <div className="flex flex-wrap gap-2">
            <Dropdown<SongsShelf | 'all'>
              label={t('songs:collection')}
              value={search.collection}
              options={[
                { value: 'all', label: t('songs:all') },
                ...shelves
                  .filter((shelf) => shelf.entries.length > 0 || shelf.id === search.collection)
                  .map((shelf) => ({ value: shelf.id, label: shelf.name })),
              ]}
              onChange={(collection) => set({ collection })}
            />
            {SONG_LEVELS.length > 1 ? (
              <Dropdown<Level | 'any'>
                label={t('songs:level')}
                value={search.level}
                options={[
                  { value: 'any', label: t('songs:anyLevel') },
                  ...SONG_LEVELS.map((level) => ({
                    value: level,
                    label: t(`common:levelName.${LEVEL_NAME[level]}`),
                  })),
                ]}
                onChange={(level) => set({ level })}
              />
            ) : null}
          </div>
        </div>
        {groups.length > 0 ? (
          <PieceList groups={groups} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t('songs:empty')}</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="soft" onClick={clear}>
                {t('songs:clearFilters')}
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  )
}
