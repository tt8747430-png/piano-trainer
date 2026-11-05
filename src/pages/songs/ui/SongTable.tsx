import { ArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { selectSort, useLibrary, type LibrarySort } from '@/entities/library'
import { entryTitles, PieceLink, pieceChords, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, selectPractised, useProgress } from '@/entities/progress'
import { pieceStepId, StageMark } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { LearnedBadge } from '@/shared/ui'
import { FavouriteMark, menuOf, RowMore, useCardLook } from '@/widgets/song-library'
import type { LibraryPage } from '../model/use-library-page'
import { songActions } from './row-actions'

/** A column a heading sorts by, and the library's sort it is. */
const SORTED_BY: Partial<Record<'title' | 'key' | 'played', LibrarySort>> = {
  title: 'name',
  key: 'key',
  played: 'recent',
}

const CELL = 'px-3 py-2 text-start align-middle'

function SortHeading({
  column,
  label,
  page,
  className,
}: {
  column: 'title' | 'key' | 'played'
  label: string
  page: LibraryPage
  className?: string
}) {
  const sort = useLibrary(selectSort)
  const by = SORTED_BY[column]
  const on = sort === by
  return (
    <th scope="col" aria-sort={on ? 'ascending' : 'none'} className={cn(CELL, className)}>
      <button
        type="button"
        onClick={() => page.setSort(on ? 'manual' : (by ?? 'manual'))}
        className="-mx-2 inline-flex min-h-9 items-center gap-1 rounded-control px-2 font-semibold hover:bg-muted"
      >
        {label}
        {on ? <ArrowDown aria-hidden className="size-3.5" /> : null}
      </button>
    </th>
  )
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

function SongTableRow({ entry, page }: { entry: Entry; page: LibraryPage }) {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const { show } = useCardLook()
  const { primary, secondary } = entryTitles(entry, locale)
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const at = useProgress((state) => selectPractised(state)[entry.id])
  const stage = pieceStage(entry.id)
  const chart = entry.kind !== 'listing'
  const favourite = page.favourites.includes(entry.id)
  return (
    <tr className="border-b border-hairline transition-colors hover:bg-muted/60">
      <th scope="row" className={cn(CELL, 'font-normal')}>
        <PieceLink
          entry={entry}
          className="block min-w-0 rounded-control focus-visible:-outline-offset-3"
        >
          <span className="block font-semibold text-foreground">{primary}</span>
          {secondary ? (
            <span className="block truncate text-sm text-muted-foreground">{secondary}</span>
          ) : null}
        </PieceLink>
      </th>
      {show.key ? (
        <td className={cn(CELL, 'font-display font-semibold tabular-nums')}>
          {chart ? printedSymbol(keySymbol(pieceKey(entry))) : null}
        </td>
      ) : null}
      {show.chords ? (
        <td
          className={cn(CELL, 'max-w-64 truncate font-display text-muted-foreground')}
          aria-hidden
        >
          {pieceChords(entry).join('  ')}
        </td>
      ) : null}
      {show.progress ? (
        <td className={CELL}>
          {stage ? (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <StageMark stage={stage} />
              {t(`common:stage.${stage}`)}
            </span>
          ) : null}
        </td>
      ) : null}
      {show.progress ? (
        <td className={CELL}>
          {learned ? <LearnedBadge label={t('common:learned.done')} /> : null}
        </td>
      ) : null}
      <td className={cn(CELL, 'text-sm text-muted-foreground tabular-nums')}>
        <LastPlayed at={at} />
      </td>
      <td className={cn(CELL, 'w-0 pe-0')}>
        <span className="flex items-center justify-end gap-1">
          {favourite ? <FavouriteMark /> : null}
          <RowMore
            label={t('songs:library.moreOf', { name: primary })}
            actions={menuOf(songActions(entry, page, t))}
          />
        </span>
      </td>
    </tr>
  )
}

/**
 * A place's songs as a table, the laptop's right pane (R30 S2, Apple Music's songs list): the title
 * and its line, then the columns the place's Card style shows (key, chords, level and Learned), the
 * day it was played last, and its More. A heading sorts by its column; the sorted one again returns
 * to the learner's own order.
 */
export function SongTable({ entries, page }: { entries: readonly Entry[]; page: LibraryPage }) {
  const { t } = useTranslation(['songs', 'common', 'music'])
  const { show } = useCardLook()
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">{t('songs:title')}</caption>
      <thead className="border-b border-border text-sm text-muted-foreground">
        <tr>
          <SortHeading column="title" label={t('songs:table.title')} page={page} />
          {show.key ? <SortHeading column="key" label={t('music:key.label')} page={page} /> : null}
          {show.chords ? (
            <th scope="col" className={cn(CELL, 'font-semibold')}>
              {t('songs:table.chords')}
            </th>
          ) : null}
          {show.progress ? (
            <th scope="col" className={cn(CELL, 'font-semibold')}>
              {t('songs:table.level')}
            </th>
          ) : null}
          {show.progress ? (
            <th scope="col" className={cn(CELL, 'font-semibold')}>
              {t('common:learned.done')}
            </th>
          ) : null}
          <SortHeading column="played" label={t('songs:table.played')} page={page} />
          <th scope="col" className={CELL}>
            <span className="sr-only">{t('songs:table.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <SongTableRow key={entry.id} entry={entry} page={page} />
        ))}
      </tbody>
    </table>
  )
}
