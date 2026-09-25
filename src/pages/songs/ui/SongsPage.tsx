import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { LEVELS, levelOf, pathSteps, pieceStepId, type Level } from '@/entities/path'
import { COLLECTIONS, type CollectionId, type Entry } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { ChipRow, ScreenHeader } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { PieceList } from '@/widgets/piece-list'
import type { SongsFilter } from '../model/songs-filter'
import { songsView } from '../model/songs-view'
import { SearchField } from './SearchField'

const levelOfEntry = (entry: Entry) =>
  entry.kind === 'listing' ? undefined : levelOf(pieceStepId(entry.id))
const LEVELS_ON_PATH = LEVELS.filter((level) => pathSteps().some((s) => s.level === level))

export function SongsPage() {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const search = useSearch({ from: '/shell/songs' })
  const navigate = useNavigate({ from: '/songs' })
  const query = useDeferredValue(search.q)
  const set = (change: Partial<SongsFilter>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  // No search at all: the route fills its defaults.
  const clear = () => void navigate({ search: {}, replace: true })
  const groups = songsView(COLLECTIONS, { ...search, q: query }, levelOfEntry).map((g) => ({
    id: g.collection.id,
    heading: search.collection === 'all' ? localText(g.collection.name, locale) : null,
    entries: g.entries,
  }))

  return (
    <div className="flex flex-col gap-5">
      <ScreenHeader title={t('songs:title')} />
      <SearchField value={search.q} onChange={(q) => set({ q })} />
      <ChipRow<CollectionId | 'all'>
        label={t('songs:collections')}
        value={search.collection}
        options={[
          { value: 'all', label: t('songs:all') },
          ...COLLECTIONS.map((c) => ({ value: c.id, label: localText(c.name, locale) })),
        ]}
        onChange={(collection) => set({ collection })}
      />
      {LEVELS_ON_PATH.length > 1 ? (
        <ChipRow<Level | 'any'>
          label={t('songs:levels')}
          value={search.level}
          options={[
            { value: 'any', label: t('songs:anyLevel') },
            ...LEVELS_ON_PATH.map((level) => ({
              value: level,
              label: t('common:level', { level }),
            })),
          ]}
          onChange={(level) => set({ level })}
        />
      ) : null}
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
  )
}
