import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FolderTile,
  selectSort,
  useFolderName,
  useLibrary,
  type LibrarySort,
} from '@/entities/library'
import { PieceLink, pieceChords, type Entry } from '@/entities/piece'
import { FavouriteToggle } from '@/features/manage-library'
import {
  selectIsLearned,
  selectLearned,
  selectPractised,
  selectSongPlay,
  useProgress,
  type SongPlay,
} from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { LearnedBadge, menuOf, RowMore, SortHeading, TABLE_CELL } from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useEntryFace } from '@/widgets/piece-list'
import { useCardLook, useHoldsLine } from '@/widgets/song-library'
import type { FolderView } from '../model/library-view'
import type { LibraryPage } from '../model/use-library-page'
import { folderActions, songActions } from './row-actions'

/** A column a heading sorts by, and the library's sort it is. */
const SORTED_BY: Partial<Record<'title' | 'key' | 'played', LibrarySort>> = {
  title: 'name',
  key: 'key',
  played: 'recent',
}

const CELL = TABLE_CELL
/** A row's cell (the SongsLaptop board's rows): 56 tall around a 44px More. */
const ROWCELL = cn(CELL, 'py-1.5')
/** A row's face: its 40px picture (corners 9) 16 from its name, the board's. */
const FACE =
  'flex min-w-0 items-center gap-4 rounded-control focus-visible:-outline-offset-3 [&>:first-child]:size-10 [&>:first-child]:rounded-[9px]'
/** The chords stand only where the pane has room for them beside the rest (48rem). */
const CHORDS = cn(CELL, 'hidden @3xl:table-cell')

/** A heading of a column the library sorts by: tapped while sorted, back to the learner's own order. */
function SongSortHeading({
  column,
  label,
  page,
}: {
  column: 'title' | 'key' | 'played'
  label: string
  page: LibraryPage
}) {
  const sort = useLibrary(selectSort)
  const by = SORTED_BY[column] ?? 'manual'
  const on = sort === by
  return <SortHeading label={label} on={on} onSort={() => page.setSort(on ? 'manual' : by)} />
}

/** The date a song was played last, as the learner's language writes a day. */
function LastPlayed({ at }: { at: string | undefined }) {
  const locale = useLocale()
  if (!at) return <span aria-hidden>—</span>
  return (
    <time dateTime={at}>
      {new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(at))}
    </time>
  )
}

/** Which of the optional columns hold something for these songs (canvas R39-1): an empty one is left out. */
interface Held {
  readonly learned: boolean
  readonly played: boolean
  /** Some song stopped part way, the bar it stopped at to show. */
  readonly underway: boolean
}

/** Where a song stopped part way through, as Continue says it; none where it has not or is done. */
const stoppedAt = (play: SongPlay | undefined) =>
  play && play.at > 0 && play.at < play.bars ? play : undefined

function SongTableRow({ entry, page, held }: { entry: Entry; page: LibraryPage; held: Held }) {
  const { t } = useTranslation(['songs', 'common'])
  const { show } = useCardLook()
  const { face } = useEntryFace(entry, { ...show, progress: false })
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const at = useProgress((state) => selectPractised(state)[entry.id])
  const stopped = stoppedAt(useProgress(selectSongPlay(entry.id)))
  return (
    <tr className="border-b border-hairline transition-colors hover:bg-muted/60">
      <th scope="row" className={cn(ROWCELL, 'w-1/2 max-w-0 font-normal')}>
        <PieceLink entry={entry} className={FACE}>
          <PieceMark entry={entry} />
          <span className="truncate font-semibold text-foreground">{face.title}</span>
        </PieceLink>
      </th>
      {/* A long credit wraps to a second line rather than cut the key off its end. */}
      <td className={cn(ROWCELL, 'max-w-0 text-sm text-muted-foreground')}>
        <span className="line-clamp-2 text-pretty">{face.detail}</span>
      </td>
      {show.chords ? (
        <td
          className={cn(CHORDS, 'py-1.5', 'max-w-64 truncate font-display text-muted-foreground')}
          aria-hidden
        >
          {pieceChords(entry).map(printedSymbol).join('  ')}
        </td>
      ) : null}
      {show.progress && (held.learned || held.played || held.underway) ? (
        <td className={cn(ROWCELL, 'text-sm whitespace-nowrap text-muted-foreground tabular-nums')}>
          {learned ? (
            <LearnedBadge label={t('common:learned.done')} />
          ) : stopped ? (
            t('songs:continue.bar', { bar: stopped.at + 1, total: stopped.bars })
          ) : at ? (
            t('songs:table.learning')
          ) : null}
        </td>
      ) : null}
      {held.played ? (
        <td className={cn(ROWCELL, 'text-sm text-muted-foreground tabular-nums')}>
          <LastPlayed at={at} />
        </td>
      ) : null}
      <td className={cn(ROWCELL, 'w-0 pe-0')}>
        <span className="flex items-center justify-end">
          <FavouriteToggle piece={entry.id} />
          <RowMore
            label={t('common:library.moreOf', { name: face.title })}
            actions={menuOf(songActions(entry, page, t))}
          />
        </span>
      </td>
    </tr>
  )
}

/** A folder as a row of the table (the SongsLaptop board): its tile and name, what it holds where the composer stands. */
function FolderTableRow({
  view,
  page,
  span,
}: {
  view: FolderView
  page: LibraryPage
  /** The cells between its name and its More: the table's other columns. */
  span: number
}) {
  const { t } = useTranslation(['songs', 'common'])
  const nameOf = useFolderName()
  const { folder, ...holds } = view
  const name = nameOf(folder)
  return (
    <tr className="border-b border-hairline transition-colors hover:bg-muted/60">
      <th scope="row" className={cn(ROWCELL, 'w-1/2 max-w-0 font-normal')}>
        <Link to="/songs/folders/$folderId" params={{ folderId: folder.id }} className={FACE}>
          <FolderTile look={folder} large />
          <span className="truncate font-semibold text-foreground">{name}</span>
        </Link>
      </th>
      <td colSpan={span} className={cn(ROWCELL, 'max-w-0 truncate text-sm text-muted-foreground')}>
        {useHoldsLine(holds)}
      </td>
      <td className={cn(ROWCELL, 'w-0 pe-0')}>
        <span className="flex items-center justify-end">
          <RowMore
            label={t('common:library.moreOf', { name })}
            actions={menuOf(folderActions(folder, name, page, t))}
          />
        </span>
      </td>
    </tr>
  )
}

/** A group's head in the table, folding what follows: its name in 16 bold, its count soft (the board's). */
function GroupHead({
  title,
  count,
  open,
  onToggle,
  span,
}: {
  title: string
  count: number
  open: boolean
  onToggle: () => void
  span: number
}) {
  return (
    <tr>
      <th scope="colgroup" colSpan={span} className="pt-2 text-start font-normal">
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex h-11 items-center gap-1.5 rounded-control px-1 text-foreground hover:bg-muted"
        >
          <ChevronDown
            aria-hidden
            className={cn(
              'size-4 text-muted-foreground transition-transform duration-200',
              !open && '-rotate-90',
            )}
          />
          <span className="text-base font-bold">{title}</span>
          <span className="text-sm text-muted-foreground">{count}</span>
        </button>
      </th>
    </tr>
  )
}

/**
 * A place's songs as a table, the laptop's right pane (canvas 133, Apple Music's songs list): each
 * song's small cover and title, its composer and key, its progress where any song
 * has some (the bar it stopped at, Learning, Learned), the day it was played last where any was, then its ♡ and More; its chords where its
 * place's Card style shows them. A heading sorts by its column; the sorted one again returns to the
 * learner's own order. Narrower than 48rem, the pane leaves the chords out.
 */
export function SongTable({
  entries,
  page,
  folders = [],
}: {
  entries: readonly Entry[]
  page: LibraryPage
  /** The place's folders, a folding group of the table's rows over its songs' (the SongsLaptop board). */
  folders?: readonly FolderView[]
}) {
  const { t } = useTranslation(['songs', 'common', 'music'])
  const [shut, setShut] = useState<ReadonlySet<'folders' | 'songs'>>(new Set())
  const toggle = (key: 'folders' | 'songs') =>
    setShut((was) => {
      const next = new Set(was)
      if (!next.delete(key)) next.add(key)
      return next
    })
  const { show } = useCardLook()
  const learnedSteps = useProgress(selectLearned)
  const practised = useProgress(selectPractised)
  const plays = useProgress((state) => state.songs)
  const held: Held = {
    learned: entries.some((entry) => learnedSteps[pieceStepId(entry.id)] !== undefined),
    played: entries.some((entry) => practised[entry.id] !== undefined),
    underway: entries.some((entry) => stoppedAt(plays[entry.id]) !== undefined),
  }
  const progress = show.progress && (held.learned || held.played || held.underway)
  // Title, composer and key, then the optional ones, then the actions.
  const columns = 3 + (show.chords ? 1 : 0) + (progress ? 1 : 0) + (held.played ? 1 : 0)
  return (
    <div className="@container">
      <table className="w-full border-collapse">
        <caption className="sr-only">{t('songs:title')}</caption>
        <thead className="border-b border-border text-sm text-muted-foreground">
          <tr>
            <SongSortHeading column="title" label={t('songs:table.title')} page={page} />
            <SongSortHeading column="key" label={t('songs:table.composerKey')} page={page} />
            {show.chords ? (
              <th scope="col" className={cn(CHORDS, 'font-semibold')}>
                {t('songs:table.chords')}
              </th>
            ) : null}
            {show.progress && (held.learned || held.played || held.underway) ? (
              <th scope="col" className={cn(CELL, 'font-semibold')}>
                {t('songs:table.progress')}
              </th>
            ) : null}
            {held.played ? (
              <SongSortHeading column="played" label={t('songs:table.played')} page={page} />
            ) : null}
            <th scope="col" className={CELL}>
              <span className="sr-only">{t('songs:table.actions')}</span>
            </th>
          </tr>
        </thead>
        {folders.length > 0 ? (
          <tbody>
            <GroupHead
              title={t('songs:folder.list')}
              count={folders.length}
              open={!shut.has('folders')}
              onToggle={() => toggle('folders')}
              span={columns}
            />
            {shut.has('folders')
              ? null
              : folders.map((view) => (
                  <FolderTableRow key={view.folder.id} view={view} page={page} span={columns - 2} />
                ))}
          </tbody>
        ) : null}
        <tbody>
          {folders.length > 0 ? (
            <GroupHead
              title={t('songs:table.songs')}
              count={entries.length}
              open={!shut.has('songs')}
              onToggle={() => toggle('songs')}
              span={columns}
            />
          ) : null}
          {shut.has('songs')
            ? null
            : entries.map((entry) => (
                <SongTableRow key={entry.id} entry={entry} page={page} held={held} />
              ))}
        </tbody>
      </table>
    </div>
  )
}
