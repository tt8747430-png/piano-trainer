import { useRender } from '@base-ui/react/use-render'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useSetSearch } from '@/shared/lib'
import { HeartToggle, menuOf, RowMore, SortHeading, TABLE_CELL } from '@/shared/ui'
import type {
  LibraryItem,
  PracticeLibraryView,
  PracticeSort,
  ShownSection,
} from '../model/library-view'
import { LevelMark } from './LevelMark'
import { LibraryTile } from './LibraryTile'

/** A library table's columns, named as its board names them (Exercise · Focus · Level). */
export interface TableColumns {
  /** The rows' own name (Exercise, Pattern, Name). */
  readonly name: string
  /** The second column: the row's line on a phone, split into a column (Focus, Hands, Numerals). */
  readonly second: string
  /** The third, where the library has no levels: its own (a progression's Key). */
  readonly third?: string
}

/** A row's name cell: its picture and its name, the link to its page. */
function NameCell({ item }: { item: LibraryItem }) {
  return useRender({
    render: item.link,
    props: {
      className:
        'flex min-h-10 min-w-0 items-center gap-4 rounded-control focus-visible:-outline-offset-3',
      children: (
        <>
          <LibraryTile small picture={item.picture} />
          <span className="min-w-0 truncate text-[0.9375rem] font-semibold text-foreground">
            {item.name}
          </span>
        </>
      ),
    },
  })
}

/** One book's (or style's) rows under its fold heading, as the phone's runs: its name and count. */
function SectionRows({
  section,
  levels,
  columns,
}: {
  section: ShownSection
  levels: boolean
  columns: TableColumns
}) {
  const { t } = useTranslation(['practice', 'common'])
  const [shut, setShut] = useState(false)
  const span = levels || columns.third ? 4 : 3
  return (
    <tbody>
      <tr>
        <th scope="colgroup" colSpan={span} className="pt-2 text-start">
          <button
            type="button"
            aria-expanded={!shut}
            onClick={() => setShut((was) => !was)}
            className="-mx-1 flex min-h-10 items-center gap-2 rounded-control px-1 text-base font-bold text-foreground transition-colors hover:text-foreground/80"
          >
            <ChevronDown
              aria-hidden
              className={cn(
                'size-4 text-muted-foreground transition-transform duration-200',
                shut && '-rotate-90',
              )}
            />
            {section.name}
            <span className="text-sm font-normal text-muted-foreground tabular-nums">
              {section.items.length}
            </span>
          </button>
        </th>
      </tr>
      {shut
        ? null
        : section.items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-hairline transition-colors hover:bg-muted/60"
            >
              <th scope="row" className={cn(TABLE_CELL, 'font-normal')}>
                <NameCell item={item} />
              </th>
              <td className={cn(TABLE_CELL, 'truncate text-sm text-muted-foreground')}>
                {item.extra ?? item.detail}
              </td>
              {levels ? (
                <td className={cn(TABLE_CELL, 'truncate')}>
                  {item.stage ? <LevelMark stage={item.stage} /> : null}
                </td>
              ) : columns.third ? (
                <td className={cn(TABLE_CELL, 'truncate text-sm text-muted-foreground')}>
                  {item.third}
                </td>
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
  )
}

/**
 * A practice library's rows as a table on a laptop (canvas v439, the lines' sweep), under the
 * place chips, one column from the sidebar: a heading row (its name, the row's line split into its
 * own column, its level or its own third), then each book's or style's rows under its fold heading,
 * as the phone's runs. The name and level headings sort; the sorted one again gives the books' own
 * order back.
 */
export function LibraryTable({
  sections,
  view,
  levels,
  columns,
}: {
  sections: readonly ShownSection[]
  view: PracticeLibraryView
  levels: boolean
  columns: TableColumns
}) {
  const { t } = useTranslation(['practice', 'common'])
  const set = useSetSearch<PracticeLibraryView>()
  const heading = (sort: PracticeSort, label: string, className?: string) => (
    <SortHeading
      label={label}
      className={className}
      on={view.sort === sort}
      onSort={() => set({ sort: view.sort === sort ? 'group' : sort })}
    />
  )
  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">{t('practice:library.rows')}</caption>
      <thead className="border-b border-border text-[0.8125rem] text-muted-foreground">
        <tr>
          {/* the board's shares (Name 2 · line 3 · level or key), the name's heading on its words' edge */}
          {heading('name', columns.name, 'w-[38%] ps-[4.25rem]')}
          <th scope="col" className={cn(TABLE_CELL, 'font-semibold')}>
            {columns.second}
          </th>
          {levels ? (
            heading('level', t('practice:library.table.level'), 'w-[14%]')
          ) : columns.third ? (
            <th scope="col" className={cn(TABLE_CELL, 'w-[10%] font-semibold')}>
              {columns.third}
            </th>
          ) : null}
          <th scope="col" className={cn(TABLE_CELL, 'w-24')}>
            <span className="sr-only">{t('practice:library.table.actions')}</span>
          </th>
        </tr>
      </thead>
      {sections.map((section) => (
        <SectionRows key={section.id} section={section} levels={levels} columns={columns} />
      ))}
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
