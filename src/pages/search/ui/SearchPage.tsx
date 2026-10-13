import { useSearch } from '@tanstack/react-router'
import { useDeferredValue, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, RowGroup, ScreenHeader, SearchField } from '@/shared/ui'
import { Empty, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { EntryRow } from '@/widgets/piece-list'
import { searchIndex, typedEntry } from '../model/index-entries'
import type { SearchView } from '../model/search-view'
import { useIndex, useIndexNames } from '../model/use-index'
import { IndexRow } from './IndexRow'

/**
 * Search (ADR 0044): one field over every named thing the app has, by kind, each a row to its page.
 * With nothing typed it is the whole index; a chord symbol typed is read as the chord, a line of
 * chords as a song's to transpose.
 */
export function SearchPage() {
  const { t } = useTranslation('search')
  const { q } = useSearch({ from: '/shell/search' })
  const set = useViewChange<SearchView>()
  const query = useDeferredValue(q)
  const names = useIndexNames()
  const index = useIndex(names)
  const groups = useMemo(
    () => searchIndex(index, query, typedEntry(query, names)),
    [index, query, names],
  )
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} back={<BackButton fallback={{ to: '/' }} />} />
      <div className="lg:max-w-xl">
        <SearchField
          value={q}
          onChange={(next) => set({ q: next })}
          label={t('title')}
          screen={t('title')}
          autoFocus
        />
      </div>
      {groups.length > 0 ? (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <RowGroup key={group.kind} title={t(`kinds.${group.kind}`)}>
              {group.entries.map(({ id, title, detail, target }) =>
                // A song's row is the one Songs shows it in: its number, key, level and learned badge.
                target.opens === 'piece' ? (
                  <EntryRow key={id} entry={target.entry} />
                ) : (
                  <li key={id}>
                    <IndexRow title={title} detail={detail} target={target} />
                  </li>
                ),
              )}
            </RowGroup>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('none')}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}
