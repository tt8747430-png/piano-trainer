import { LibraryTile } from './LibraryTile'
import { useRender } from '@base-ui/react/use-render'
import { useTranslation } from 'react-i18next'
import { cn, useSetSearch } from '@/shared/lib'
import { HeartToggle, menuOf, RowMore, SortHeading, TABLE_CELL } from '@/shared/ui'
import type {
  LibraryGroup,
  LibraryItem,
  PracticeLibraryView,
  PracticeSort,
} from '../model/library-view'
import type { GroupWord } from '../model/library-words'
import { LevelMark } from './LevelMark'

/** A row's name cell: its picture, its name over its line, the link to its page. */
function NameCell({ item }: { item: LibraryItem }) {
  return useRender({
    render: item.link,
    props: {
      className:
        'flex min-h-11 min-w-0 items-center gap-3 rounded-control py-1 focus-visible:-outline-offset-3',
      children: (
        <>
          <LibraryTile picture={item.picture} />
          <span className="min-w-0">
            <span className="block font-semibold text-foreground">{item.name}</span>
            <span className="block truncate text-sm text-muted-foreground">{item.detail}</span>
          </span>
        </>
      ),
    },
  })
}

/**
 * A practice library's rows as a table, the laptop's right pane (R30-4, Songs' table): Name (its
 * picture and line), its book or style, its level where the library has levels, the library's own
 * column (the hands, the numerals), and its More. A heading sorts by its column; the sorted one again
 * gives the books' own order back.
 */
export function LibraryTable({
  items,
  view,
  groups,
  groupWord,
  levels,
  extra,
  names,
}: {
  items: readonly LibraryItem[]
  view: PracticeLibraryView
  groups: readonly LibraryGroup[]
  groupWord: GroupWord
  levels: boolean
  extra?: string | undefined
  /** The names of Mine and Hidden, in the book column. */
  names: Readonly<Record<string, string>>
}) {
  const { t } = useTranslation(['practice', 'common'])
  const set = useSetSearch<PracticeLibraryView>()
  const heading = (sort: PracticeSort, label: string, className?: string) => (
    <SortHeading
      label={label}
      className={className}
      on={view.sort === sort}
      onSort={() => set({ sort: view.sort === sort && sort !== 'group' ? 'group' : sort })}
    />
  )
  const groupName = (id: string) => groups.find((group) => group.id === id)?.name ?? names[id] ?? ''
  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">{t('practice:library.rows')}</caption>
      <thead className="border-b border-border text-sm text-muted-foreground">
        <tr>
          {heading('name', t('practice:library.table.name'), 'w-2/5')}
          {heading('group', t(`practice:library.table.${groupWord}`))}
          {levels ? heading('level', t('practice:library.table.level'), 'w-28') : null}
          {extra ? (
            <th scope="col" className={cn(TABLE_CELL, 'font-semibold')}>
              {extra}
            </th>
          ) : null}
          <th scope="col" className={cn(TABLE_CELL, 'w-24')}>
            <span className="sr-only">{t('practice:library.table.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className="border-b border-hairline transition-colors hover:bg-muted/60"
          >
            <th scope="row" className={cn(TABLE_CELL, 'font-normal')}>
              <NameCell item={item} />
            </th>
            <td className={cn(TABLE_CELL, 'truncate text-muted-foreground')}>
              {groupName(item.group)}
            </td>
            {levels ? (
              <td className={TABLE_CELL}>{item.stage ? <LevelMark stage={item.stage} /> : null}</td>
            ) : null}
            {extra ? (
              <td className={cn(TABLE_CELL, 'truncate text-muted-foreground')}>{item.extra}</td>
            ) : null}
            <td className={cn(TABLE_CELL, 'pe-0')}>
              <span className="flex items-center justify-end gap-1">
                {item.trailing}
                <FavouriteHeart item={item} />
                <RowMore
                  label={t('common:library.moreOf', { name: item.name })}
                  actions={menuOf(item.actions)}
                />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** A row's ♡ in the table, as on its phone row: one tap to change it. */
function FavouriteHeart({ item }: { item: LibraryItem }) {
  const favourite = item.actions.find((action) => action.key === 'favourite')
  if (!favourite) return null
  return (
    <HeartToggle
      pressed={item.favourite}
      label={favourite.label}
      onToggle={() => favourite.onSelect()}
    />
  )
}
