import { useTranslation } from 'react-i18next'
import { selectSort, useLibrary, type LibrarySort } from '@/entities/library'
import { PieceLink, pieceChords, type Entry } from '@/entities/piece'
import { FavouriteToggle } from '@/features/manage-library'
import { selectIsLearned, selectLearned, selectPractised, useProgress } from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { LearnedBadge, menuOf, RowMore, SortHeading, TABLE_CELL } from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useEntryFace } from '@/widgets/piece-list'
import { useCardLook } from '@/widgets/song-library'
import type { LibraryPage } from '../model/use-library-page'
import { songActions } from './row-actions'

/** A column a heading sorts by, and the library's sort it is. */
const SORTED_BY: Partial<Record<'title' | 'key' | 'played', LibrarySort>> = {
  title: 'name',
  key: 'key',
  played: 'recent',
}

const CELL = TABLE_CELL
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
}

function SongTableRow({ entry, page, held }: { entry: Entry; page: LibraryPage; held: Held }) {
  const { t } = useTranslation(['songs', 'common'])
  const { show } = useCardLook()
  const { face } = useEntryFace(entry, { ...show, progress: false })
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const at = useProgress((state) => selectPractised(state)[entry.id])
  return (
    <tr className="border-b border-hairline transition-colors hover:bg-muted/60">
      <th scope="row" className={cn(CELL, 'w-1/2 max-w-0 font-normal')}>
        <PieceLink
          entry={entry}
          className="flex min-w-0 items-center gap-3 rounded-control focus-visible:-outline-offset-3"
        >
          <PieceMark entry={entry} />
          <span className="truncate font-semibold text-foreground">{face.title}</span>
        </PieceLink>
      </th>
      <td className={cn(CELL, 'max-w-0 truncate text-sm text-muted-foreground')}>{face.detail}</td>
      {show.chords ? (
        <td
          className={cn(CHORDS, 'max-w-64 truncate font-display text-muted-foreground')}
          aria-hidden
        >
          {pieceChords(entry).map(printedSymbol).join('  ')}
        </td>
      ) : null}
      {show.progress && (held.learned || held.played) ? (
        <td className={cn(CELL, 'text-sm text-muted-foreground')}>
          {learned ? (
            <LearnedBadge label={t('common:learned.done')} />
          ) : at ? (
            t('songs:table.learning')
          ) : null}
        </td>
      ) : null}
      {held.played ? (
        <td className={cn(CELL, 'text-sm text-muted-foreground tabular-nums')}>
          <LastPlayed at={at} />
        </td>
      ) : null}
      <td className={cn(CELL, 'w-0 pe-0')}>
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

/**
 * A place's songs as a table, the laptop's right pane (canvas 133, Apple Music's songs list): each
 * song's small cover and title, its composer and key, its progress (Learning, Learned) where any song
 * has some, the day it was played last where any was, then its ♡ and More; its chords where its
 * place's Card style shows them. A heading sorts by its column; the sorted one again returns to the
 * learner's own order. Narrower than 48rem, the pane leaves the chords out.
 */
export function SongTable({ entries, page }: { entries: readonly Entry[]; page: LibraryPage }) {
  const { t } = useTranslation(['songs', 'common', 'music'])
  const { show } = useCardLook()
  const learnedSteps = useProgress(selectLearned)
  const practised = useProgress(selectPractised)
  const held: Held = {
    learned: entries.some((entry) => learnedSteps[pieceStepId(entry.id)] !== undefined),
    played: entries.some((entry) => practised[entry.id] !== undefined),
  }
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
            {show.progress && (held.learned || held.played) ? (
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
        <tbody>
          {entries.map((entry) => (
            <SongTableRow key={entry.id} entry={entry} page={page} held={held} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
