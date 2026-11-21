import { useRender } from '@base-ui/react/use-render'
import { ChevronDown } from 'lucide-react'
import { useFold } from '@/features/fold-section'
import { useRef, type CSSProperties, type ReactNode, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, useElementSize } from '@/shared/lib'
import { HeartToggle, menuOf, RowMore } from '@/shared/ui'
import type { LibraryItem, ShownSection } from '../model/library-view'
import { libraryFoldId, type LibraryKind } from '../model/library-words'
import { LevelMark } from './LevelMark'
import { LibraryTile } from './LibraryTile'
import { spanOf } from './span-of'

/** A library table's columns, named as its board names them (Exercise · Focus · Level). */
export interface TableColumns {
  /** The rows' own name (Exercise, Pattern, Name). */
  readonly name: string
  /** The second column: the row's line on a phone, split into a column (Focus, Hands, Numerals). */
  readonly second: string
  /** The third, where the library has no levels: its own (a progression's Key). */
  readonly third?: string
  /** The board's shares of the three columns' room (`table_cols`: Name 2 · Numerals 3 · Key .6). */
  readonly shares: readonly [number, number, number]
}

/**
 * The board's row: 12 in, the 40 picture, 16 to the name, its three cells 16 apart, 16 to its 92
 * acts (the ♡ and its More); what is left (the width less these 208) is shared by `shares`. A column runs from its
 * cell's 12 padding to the next one's, so the words stand where the board's do. (A table's
 * columns take no `calc()` of a percentage, so the widths are worked out from the table's own.)
 */
function widths(shares: TableColumns['shares'], width: number) {
  const total = shares[0] + shares[1] + shares[2]
  const part = (share: number) => ((width - 208) * share) / total
  return width > 0 ? { name: 72 + part(shares[0]), third: 28 + part(shares[2]) } : undefined
}

/** A row's cell: 12 a side, its row 56 tall (the board's). */
const CELL = 'px-3 text-start align-middle'
/** A heading's cell: its words 26 under the head's top, 8 over its line (the board's header). */
const HEAD_CELL =
  'px-3 pt-[1.625rem] pb-2 text-start align-bottom leading-4 font-semibold shadow-[inset_0_-1px_0_var(--color-border)]'

/** A row's name cell: its picture and its name, the link to its page. */
function NameCell({ item, still }: { item: LibraryItem; still: boolean }) {
  return useRender({
    render: still ? <div /> : item.link,
    props: {
      className:
        'flex min-h-10 min-w-0 items-center gap-4 rounded-control focus-visible:-outline-offset-3',
      children: (
        <>
          <LibraryTile small picture={item.picture} />
          <span className="min-w-0 truncate text-subhead font-semibold text-foreground">
            {item.name}
          </span>
        </>
      ),
    },
  })
}

/** A book's (or style's) fold head across the table: its chevron, name and count; in Edit its acts. */
export function FoldHeadRow({
  span,
  name,
  count,
  mark,
  shut,
  onToggle,
  action,
}: {
  span: number
  name: string
  count: number
  mark?: string | undefined
  shut: boolean
  onToggle: () => void
  action?: ReactNode
}) {
  return (
    <tr>
      <th scope="colgroup" colSpan={span} className="pt-2 text-start">
        <span className="flex items-center">
          <button
            type="button"
            aria-expanded={!shut}
            onClick={onToggle}
            className="-mx-1 flex min-h-10 items-center gap-2 rounded-control px-1 text-base font-bold text-foreground transition-colors hover:text-foreground/80"
          >
            <ChevronDown
              aria-hidden
              className={cn(
                'size-4 text-muted-foreground transition-transform duration-200',
                shut && '-rotate-90',
              )}
            />
            {name}
            <span className="text-sm font-normal text-muted-foreground tabular-nums">{count}</span>
            {mark ? (
              <span className="text-sm font-normal text-muted-foreground">· {mark}</span>
            ) : null}
          </button>
          {action ? <span className="ms-auto flex items-center">{action}</span> : null}
        </span>
      </th>
    </tr>
  )
}

/** A row of the table: its name cell, its line, its level or third, then its own acts. */
export function ItemRow({
  item,
  levels,
  columns,
  trailing,
  arrange,
}: {
  item: LibraryItem
  levels: boolean
  columns: TableColumns
  trailing: ReactNode
  /** In Edit: no link, the row moving as it is dragged. */
  arrange?: { node: Ref<HTMLTableRowElement>; style: CSSProperties; lifted: boolean }
}) {
  return (
    <tr
      ref={arrange?.node}
      style={arrange?.style}
      // the board's row is 56, its hairline inside it
      className={cn(
        'h-14 shadow-[inset_0_-1px_0_var(--color-hairline)] transition-colors',
        arrange ? 'bg-background' : 'hover:bg-muted/60',
        arrange?.lifted && 'opacity-0',
      )}
    >
      <th scope="row" className={cn(CELL, 'font-normal')}>
        <NameCell item={item} still={arrange !== undefined} />
      </th>
      <td className={cn(CELL, 'truncate text-sm text-muted-foreground')}>
        {item.extra ?? item.detail}
      </td>
      {levels ? (
        <td className={cn(CELL, 'truncate')}>
          {item.stage ? <LevelMark stage={item.stage} /> : null}
        </td>
      ) : columns.third ? (
        <td className={cn(CELL, 'truncate text-sm text-muted-foreground')}>{item.third}</td>
      ) : null}
      <td className={cn(CELL, 'px-0')}>
        <span className="flex items-center justify-end gap-1">{trailing}</span>
      </td>
    </tr>
  )
}

/** One book's (or style's) rows under its fold heading, as the phone's runs: its name and count. */
function SectionRows({
  section,
  levels,
  columns,
  foldId,
}: {
  section: ShownSection
  levels: boolean
  columns: TableColumns
  /** Its fold's place in Settings, the phone's run's too: folded on one size, folded on both. */
  foldId: string
}) {
  const { t } = useTranslation(['practice', 'common'])
  const fold = useFold(foldId)
  const shut = !fold.open
  return (
    <tbody>
      <FoldHeadRow
        span={spanOf(levels, columns)}
        name={section.name}
        count={section.items.length}
        shut={shut}
        onToggle={fold.toggle}
      />
      {shut
        ? null
        : section.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              levels={levels}
              columns={columns}
              trailing={
                <>
                  {item.trailing}
                  <FavouriteHeart item={item} />
                  <RowMore
                    label={t('common:library.moreOf', { name: item.name })}
                    actions={menuOf(item.actions)}
                  />
                </>
              }
            />
          ))}
    </tbody>
  )
}

/**
 * A practice library's rows as a table on a laptop (canvas v439, the lines' sweep), under the
 * place chips, one column from the sidebar: a heading row (its name, the row's line split into its
 * own column, its level or its own third), then each book's or style's rows under its fold heading,
 * as the phone's runs. It sorts by its Sort and filter sheet alone, as its board: its headings are
 * words, not a second way to sort.
 */
export function LibraryTable({
  kind,
  sections,
  levels,
  columns,
}: {
  kind: LibraryKind
  sections: readonly ShownSection[]
  levels: boolean
  columns: TableColumns
}) {
  return (
    <TableFrame levels={levels} columns={columns}>
      {sections.map((section) => (
        <SectionRows
          key={section.id}
          section={section}
          levels={levels}
          columns={columns}
          foldId={libraryFoldId(kind, section.id)}
        />
      ))}
    </TableFrame>
  )
}

/** The table, its columns at the board's shares and its header row; its books' bodies inside. */
export function TableFrame({
  levels,
  columns,
  children,
}: {
  levels: boolean
  columns: TableColumns
  children: ReactNode
}) {
  const { t } = useTranslation(['practice', 'common'])
  const table = useRef<HTMLTableElement>(null)
  const width = widths(columns.shares, useElementSize(table).width)
  return (
    <table ref={table} className="w-full table-fixed border-collapse">
      <caption className="sr-only">{t('practice:library.rows')}</caption>
      <colgroup>
        <col style={{ width: width?.name }} />
        <col />
        {levels || columns.third ? <col style={{ width: width?.third }} /> : null}
        {/* the ♡ and the ··· (44, 4, 44) */}
        <col className="w-23" />
      </colgroup>
      <thead className="text-footnote text-muted-foreground">
        <tr>
          {/* the board's header: its words 13/600, 8 over its line, the name's on its words' edge */}
          <th scope="col" className={cn(HEAD_CELL, 'ps-[4.25rem]')}>
            {columns.name}
          </th>
          <th scope="col" className={HEAD_CELL}>
            {columns.second}
          </th>
          {levels || columns.third ? (
            <th scope="col" className={HEAD_CELL}>
              {levels ? t('practice:library.table.level') : columns.third}
            </th>
          ) : null}
          <th scope="col" className={HEAD_CELL}>
            <span className="sr-only">{t('practice:library.table.actions')}</span>
          </th>
        </tr>
      </thead>
      {children}
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
