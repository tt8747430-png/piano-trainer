import { useSearch } from '@tanstack/react-router'
import { useDeferredValue, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useViewChange } from '@/shared/lib'
import { BackButton, RowGroup, ScreenHeader, SearchField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { EntryRow } from '@/widgets/piece-list'
import { searchIndex, typedEntry, type IndexGroup } from '../model/index-entries'
import type { SearchView } from '../model/search-view'
import { useIndex, useIndexNames } from '../model/use-index'
import { IndexRow } from './IndexRow'

/**
 * Search (ADR 0052): one field over every named thing the app has, by kind, each a row to its page.
 * With nothing typed it is the whole index; a chord symbol typed is read as the chord, a line of
 * chords as a song's to transpose. Each kind shows its nearest rows first, the rest on Show all.
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
            // A query of its own opens each group folded to its first rows again.
            <ResultGroup key={`${group.kind} ${query}`} group={group} />
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

/** A group shows this many rows, the nearest, until the learner asks for all. */
const FIRST_ROWS = 8

/** One kind of thing found: its nearest rows, and Show all for the rest. */
function ResultGroup({ group }: { group: IndexGroup }) {
  const { t } = useTranslation('search')
  const [all, setAll] = useState(false)
  const shown = all ? group.entries : group.entries.slice(0, FIRST_ROWS)
  const more = group.entries.length - shown.length
  return (
    <RowGroup
      title={t(`kinds.${group.kind}`)}
      footer={
        more > 0 ? (
          <Button variant="soft" className="self-start" onClick={() => setAll(true)}>
            {t('showAll', { count: group.entries.length })}
          </Button>
        ) : null
      }
    >
      {shown.map(({ id, title, detail, target }) =>
        // A song's row is the one Songs shows it in: its number, key, level and learned badge;
        // archived, it says so (ADR 0106).
        target.opens === 'piece' ? (
          <EntryRow
            key={id}
            entry={target.entry}
            status={target.archived ? t('archived') : undefined}
          />
        ) : (
          <li key={id}>
            <IndexRow title={title} detail={detail} target={target} />
          </li>
        ),
      )}
    </RowGroup>
  )
}
