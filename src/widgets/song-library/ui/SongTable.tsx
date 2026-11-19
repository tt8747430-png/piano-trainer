import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PieceLink, type Entry } from '@/entities/piece'
import { menuOf, RowMore, type RowAction } from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useEntryFace } from '@/widgets/piece-list'
import { SelectCheck } from './SelectRow'
import { useSongStanding } from './use-song-status'

/**
 * The table's columns (the SongsLaptop board's _LCOLS): Title, Composer and key, Progress, When, ···.
 * Under 1536 wide the composer column goes (`COMPOSER`), so a title is never cut to a word.
 */
const COLUMNS =
  'grid grid-cols-[minmax(0,1fr)_8.75rem_7.5rem_2.75rem] items-center gap-4 pr-2 pl-3 2xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_8.75rem_7.5rem_2.75rem]'
const COMPOSER = 'hidden 2xl:block'

/** The table in Select: which rows are chosen, and a tap that chooses one or lets it go. */
export interface TableSelect {
  readonly chosen: (id: Entry['id']) => boolean
  readonly toggle: (id: Entry['id']) => void
}

function SongTableRow({
  entry,
  actions,
  select,
}: {
  entry: Entry
  actions: readonly RowAction[]
  select: TableSelect | undefined
}) {
  const { t } = useTranslation('common')
  const { face } = useEntryFace(entry, { key: true, chords: false, progress: false })
  const { status, when } = useSongStanding(entry)
  return (
    <div
      role="row"
      className={`${COLUMNS} min-h-15 border-b border-border has-[a:hover]:bg-muted/60`}
    >
      <span role="cell" className="min-w-0">
        {select ? (
          // In Select a tap chooses the row: its check leads it, the title moving right with it.
          <button
            type="button"
            role="checkbox"
            aria-checked={select.chosen(entry.id)}
            aria-label={face.title}
            onClick={() => select.toggle(entry.id)}
            className="flex min-h-11 w-full min-w-0 items-center gap-3.5 rounded-control text-left text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&_[data-slot=row-tile]]:size-10 [&_[data-slot=row-tile]]:rounded-[9px]"
          >
            <SelectCheck checked={select.chosen(entry.id)} />
            <PieceMark entry={entry} />
            <span className="truncate text-[0.9375rem] font-semibold">{face.title}</span>
          </button>
        ) : (
          <PieceLink
            entry={entry}
            className="flex min-h-11 min-w-0 items-center gap-3.5 rounded-control text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&_[data-slot=row-tile]]:size-10 [&_[data-slot=row-tile]]:rounded-[9px]"
          >
            <PieceMark entry={entry} />
            <span className="truncate text-[0.9375rem] font-semibold">{face.title}</span>
          </PieceLink>
        )}
      </span>
      <span role="cell" className={`${COMPOSER} truncate text-[0.9375rem] text-muted-foreground`}>
        {face.detail}
      </span>
      <span role="cell" className="truncate text-[0.9375rem] text-muted-foreground tabular-nums">
        {status}
      </span>
      <span role="cell" className="truncate text-[0.9375rem] text-muted-foreground">
        {when}
      </span>
      <span role="cell" className="flex justify-end">
        {select ? null : (
          <RowMore label={t('library.moreOf', { name: face.title })} actions={menuOf(actions)} />
        )}
      </span>
    </div>
  )
}

/**
 * Every song as a table (the SongsLaptop board's LTABLE, Flat's library on a laptop): on the paper, no
 * card round it, a hairline above; its head names the columns, Title, Composer and key, Progress, and
 * over the fourth the sort it is in (`sort`); one song a row 60 tall, its first notes and its title a
 * link to its page, ··· its acts.
 */
export function SongTable({
  label,
  entries,
  actionsOf,
  sort,
  select,
}: {
  /** What the table is: "All songs". */
  label: string
  entries: readonly Entry[]
  actionsOf: (entry: Entry) => readonly RowAction[]
  /** The list's `SortMenu`, heading the fourth column. */
  sort: ReactNode
  /** Select on: each row chosen by a tap, its ··· hidden. */
  select?: TableSelect | undefined
}) {
  const { t } = useTranslation('songs')
  const head = 'text-[0.8125rem] font-semibold text-muted-foreground'
  return (
    <div role="table" aria-label={label} className="border-t border-border">
      <div role="row" className={`${COLUMNS} h-10 border-b border-border`}>
        <span role="columnheader" className={head}>
          {t('table.title')}
        </span>
        <span role="columnheader" className={`${COMPOSER} ${head}`}>
          {t('table.composerKey')}
        </span>
        <span role="columnheader" className={head}>
          {t('table.progress')}
        </span>
        <span role="columnheader" className="flex">
          {sort}
        </span>
        <span role="columnheader" aria-hidden />
      </div>
      {entries.map((entry) => (
        <SongTableRow key={entry.id} entry={entry} actions={actionsOf(entry)} select={select} />
      ))}
    </div>
  )
}
