import type { LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderTile, useFolderName, type ShelvedEntry } from '@/entities/library'
import { entryTitles, PieceLink, useRepertoire, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { cn, daySaid, flipped, matchesQuery, useMediaQuery, useNow, LAPTOP } from '@/shared/lib'
import {
  BackButton,
  CheckMark,
  MoreMenu,
  RowFace,
  ScreenHeader,
  SearchField,
  SelectAct,
  SelectDock,
  type MenuAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PieceMark } from '@/widgets/piece-cover'
import { useEntryFace } from '@/widgets/piece-list'
import { PLACE_COLUMN, PlaceBar } from '@/widgets/song-library'

/** One row of the Archive or the Trash: what it is, when it went there, and its ··· acts. */
export interface ShelfItem {
  readonly key: string
  readonly entry: ShelvedEntry
  /** When it was archived or deleted (ms); 0 when that is not known. */
  readonly at: number
  readonly actions: readonly MenuAction[]
}

/** The laptop table's columns (the ArchiveLaptop board): Title, Composer and key, when, ···. */
const COLUMNS =
  'grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_7.5rem_2.75rem] items-center gap-4 pr-2 pl-3'

/** What a row shows: its mark, its title and its line. */
interface Face {
  readonly mark: ReactNode
  readonly title: string
  readonly line: string
}

/** A song's face: its first notes, its title over its composer and key. */
function SongShelfRow({ song, ...row }: RowProps & { song: Entry }) {
  const { face } = useEntryFace(song, { key: true, chords: false, progress: false })
  return (
    <ShelfRow
      {...row}
      song={song}
      face={{ mark: <PieceMark entry={song} />, title: face.title, line: face.detail ?? '' }}
    />
  )
}

/** A playlist's face: its tile, its name over what it held. */
function FolderShelfRow({
  folder,
  ...row
}: RowProps & { folder: Extract<ShelvedEntry, { kind: 'folder' }>['folder'] }) {
  const { t } = useTranslation('songs')
  const nameOf = useFolderName()
  return (
    <ShelfRow
      {...row}
      song={undefined}
      face={{
        mark: <FolderTile look={folder} large />,
        title: nameOf(folder),
        line: t('shelf.playlistLine', {
          songs: t('folder.songCount', { count: folder.songs.length }),
        }),
      }}
    />
  )
}

interface RowProps {
  readonly item: ShelfItem
  readonly laptop: boolean
  /** Select on: whether it is chosen. */
  readonly chosen: boolean | null
  readonly onToggle: () => void
}

/** A row as the item's kind draws it; a song the repertoire no longer knows, none. */
function ShelfItemRow(props: RowProps) {
  const repertoire = useRepertoire()
  const { entry } = props.item
  if (entry.kind === 'folder') return <FolderShelfRow {...props} folder={entry.folder} />
  const song = repertoire.entry(entry.id)
  return song ? <SongShelfRow {...props} song={song} /> : null
}

/** The day it went there: "12 November". */
function useDay(at: number): string {
  const locale = useLocale()
  const now = useNow()
  return at > 0 ? daySaid(at, locale, now) : ''
}

function ShelfRow({
  item,
  laptop,
  chosen,
  onToggle,
  song,
  face: { mark, title, line },
}: RowProps & { song: Entry | undefined; face: Face }) {
  const { t } = useTranslation('common')
  const day = useDay(item.at)
  const face = laptop ? (
    <>
      {mark}
      <span className="truncate text-subhead font-semibold">{title}</span>
    </>
  ) : (
    <>
      {mark}
      <RowFace title={title} detail={line} />
    </>
  )
  const lead = cn(
    'flex min-w-0 flex-1 items-center rounded-control text-left text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
    // The boards' ATABLE on a laptop (a 40 cover 16 from its title) and ARCHROW on a phone (a 44 cover
    // with 8 corners, 12 from its title over its line, each at its normal height).
    laptop
      ? 'gap-4 [&_[data-slot=row-tile]]:size-10 [&_[data-slot=row-tile]]:rounded-thumb'
      : 'min-h-12 gap-3 py-2 [&_[data-slot=row-tile]]:size-11 [&_[data-slot=row-tile]]:rounded-lg **:data-[slot=row-detail]:leading-[normal] **:data-[slot=row-title]:leading-[normal]',
  )
  // In Select a tap chooses the row, its check leading it; else a song opens, a playlist is a face.
  const body =
    chosen !== null ? (
      <button
        type="button"
        role="checkbox"
        aria-checked={chosen}
        aria-label={title}
        onClick={onToggle}
        className={lead}
      >
        <CheckMark checked={chosen} />
        {face}
      </button>
    ) : song ? (
      <PieceLink entry={song} className={lead}>
        {face}
      </PieceLink>
    ) : (
      <div className={lead}>{face}</div>
    )
  const more =
    chosen !== null ? null : (
      <MoreMenu on="row" label={t('library.moreOf', { name: title })} actions={item.actions} />
    )
  if (laptop)
    return (
      <div role="row" className={`${COLUMNS} min-h-15 border-b border-border`}>
        <span role="cell" className="min-w-0">
          {body}
        </span>
        <span role="cell" className="truncate text-subhead text-muted-foreground">
          {line}
        </span>
        <span role="cell" className="truncate text-subhead text-muted-foreground tabular-nums">
          {day}
        </span>
        <span role="cell" className="flex justify-end">
          {more}
        </span>
      </div>
    )
  return (
    <li className="flex min-h-16 min-w-0 items-center gap-1 pr-1 pl-4">
      {body}
      {more}
    </li>
  )
}

/** Select's two acts: on what is picked, or on all while nothing is (Apple Photos' Recently Deleted). */
interface ShelfActs {
  readonly restore: (keys: readonly string[]) => void
  /** The second act, its loss in crimson: Move to Trash, or Delete; none where nothing can be lost. */
  readonly loss?: {
    readonly label: string
    readonly allLabel: string
    readonly icon: LucideIcon
    /** Whether it can act on these keys (a built-in song never goes to the Trash). */
    readonly can: (keys: readonly string[]) => boolean
    readonly run: (keys: readonly string[]) => void
  }
  readonly restoreIcon: LucideIcon
}

/**
 * The Archive or the Trash (the Archive and Trash boards; owner, 2026-11-17: "why dont we have a
 * select mode in such pages as trash and archive"): a place of its own, Select in its bar (Cancel
 * while on, the title "n selected" or "Select songs"), every row a song or a playlist with its ···
 * (a menu at its button); in Select a check leads each row and the selection bar floats at the foot,
 * Restore and the place's loss on what is picked, or on all while nothing is. No Restore on each
 * row, nothing more in the bar. On a laptop the place bar and the library's table (Title, Composer
 * and key, when it went), its search at the bar's trailing edge.
 */
export function ShelfList({
  title,
  when,
  search,
  items,
  count,
  acts,
  empty,
  back,
}: {
  /** Back on a phone, named for where it goes. */
  back?: ReactNode
  title: string
  /** The table's third column: Archived, Deleted. */
  when: string
  /** What its search says: "Search the Archive". */
  search: string
  items: readonly ShelfItem[]
  /** How many it holds, beside its name on a laptop: "3 items", "2 songs". */
  count: string
  acts: ShelfActs
  empty: ReactNode
}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const nameOf = useFolderName()
  const laptop = useMediaQuery(LAPTOP)
  const [selecting, setSelecting] = useState(false)
  const [chosen, setChosen] = useState<ReadonlySet<string>>(new Set())
  const [query, setQuery] = useState('')
  const nameOfEntry = (entry: ShelvedEntry) => {
    if (entry.kind === 'folder') return nameOf(entry.folder)
    const song = repertoire.entry(entry.id)
    return song ? entryTitles(song, locale).primary : ''
  }
  const shown = items.filter((item) => matchesQuery([nameOfEntry(item.entry)], query))
  const picked = [...chosen].filter((key) => items.some((item) => item.key === key))
  const target = picked.length > 0 ? picked : items.map((item) => item.key)
  const stop = () => {
    setSelecting(false)
    setChosen(new Set())
  }
  const toggle = (key: string) => setChosen((was) => flipped(was, key))
  const heading = selecting
    ? picked.length > 0
      ? t('select.count', { count: picked.length })
      : t('shelf.selectTitle')
    : title
  const selectButton =
    items.length === 0 ? null : (
      <Button variant="bar" onClick={selecting ? stop : () => setSelecting(true)}>
        {t(selecting ? 'select.cancel' : 'select.start')}
      </Button>
    )
  const field =
    items.length === 0 ? null : (
      <SearchField value={query} onChange={setQuery} label={search} hint={search} screen={title} />
    )
  const rows = shown.map((item) => (
    <ShelfItemRow
      key={item.key}
      item={item}
      laptop={laptop}
      chosen={selecting ? chosen.has(item.key) : null}
      onToggle={() => toggle(item.key)}
    />
  ))
  const Restore = acts.restoreIcon
  const few = picked.length > 0
  const { loss } = acts
  return (
    <div className={cn('flex flex-col gap-4 pb-28', laptop && PLACE_COLUMN)}>
      {laptop ? (
        <PlaceBar
          title={heading}
          count={selecting ? undefined : count}
          acts={selectButton}
          search={field}
        />
      ) : (
        <ScreenHeader title={heading} back={back ?? <BackButton />} tools={selectButton} />
      )}
      {items.length === 0 ? (
        // 8 under the bar on a phone, as the boards' NARROW column
        <div className={cn(!laptop && '-mt-2')}>{empty}</div>
      ) : laptop ? (
        <div role="table" aria-label={title}>
          <div role="row" className={`${COLUMNS} h-10 border-b border-border`}>
            {[t('table.title'), t('table.composerKind'), when].map((name, index) => (
              <span
                key={name}
                role="columnheader"
                className={cn(
                  'text-footnote font-semibold text-muted-foreground',
                  index === 0 && selecting && 'pl-10',
                )}
              >
                {name}
              </span>
            ))}
            <span role="columnheader" aria-hidden />
          </div>
          {rows}
        </div>
      ) : (
        // One card holding the rows, the hairline from the title's edge, moving right with it in Select.
        <ul
          aria-label={title}
          className={cn(
            "card flex flex-col overflow-hidden [&>li+li]:relative [&>li+li]:before:absolute [&>li+li]:before:top-0 [&>li+li]:before:right-0 [&>li+li]:before:h-px [&>li+li]:before:bg-border [&>li+li]:before:content-['']",
            selecting ? '[&>li+li]:before:left-29' : '[&>li+li]:before:left-19',
            '-mt-2',
          )}
        >
          {rows}
        </ul>
      )}
      {selecting && items.length > 0 ? (
        <SelectDock label={t('select.actions')}>
          <SelectAct
            label={few ? t('shelf.restore') : t('shelf.restoreAll')}
            icon={Restore}
            onClick={() => {
              acts.restore(target)
              stop()
            }}
          />
          {loss ? (
            <SelectAct
              label={few ? loss.label : loss.allLabel}
              icon={loss.icon}
              destructive
              disabled={!loss.can(target)}
              onClick={() => {
                loss.run(target)
                stop()
              }}
            />
          ) : null}
        </SelectDock>
      ) : null}
    </div>
  )
}
