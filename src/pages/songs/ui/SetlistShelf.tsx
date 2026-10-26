import { Link, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { piecesIn, selectSetlists, useLibrary } from '@/entities/library'
import { entryTitles, entryWords, useRepertoire } from '@/entities/piece'
import { NewSetlistRow } from '@/features/manage-library'
import { useLocale } from '@/shared/i18n'
import { matchesQuery } from '@/shared/lib'
import { RowLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'

/**
 * The Setlists tab (ADR 0103): each setlist a row to its page, its name over its songs counted and
 * its first songs' titles, found by its name or a song in it; then New setlist, named in place and
 * opened. None yet, it says how to fill it.
 */
export function SetlistShelf({ query, onClear }: { query: string; onClear: () => void }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const navigate = useNavigate()
  const setlists = useLibrary(selectSetlists)
  const repertoire = useRepertoire()
  const rows = useMemo(
    () =>
      setlists
        .map((setlist) => ({ setlist, pieces: piecesIn(setlist.pieces, repertoire) }))
        .filter(({ setlist, pieces }) =>
          matchesQuery([setlist.name, ...pieces.flatMap(entryWords)], query),
        ),
    [setlists, repertoire, query],
  )
  const make = (
    <NewSetlistRow
      onMade={(id) =>
        void navigate({ to: '/songs/setlists/$setlistId', params: { setlistId: id } })
      }
    />
  )
  if (setlists.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{t('setlistsEmpty.title')}</EmptyTitle>
          <EmptyDescription>{t('setlistsEmpty.description')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="text-left">
          <div className="card w-full">{make}</div>
        </EmptyContent>
      </Empty>
    )
  if (rows.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          {/* A long query breaks rather than run off the screen. */}
          <EmptyTitle className="break-words">
            {t('emptySetlists', { query: query.trim() })}
          </EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="soft" onClick={onClear}>
            {t('clearFilters')}
          </Button>
        </EmptyContent>
      </Empty>
    )
  return (
    <ul aria-label={t('setlists')} className="grid-cards gap-2 *:card">
      {rows.map(({ setlist, pieces }) => (
        <li key={setlist.id}>
          <RowLink
            title={setlist.name}
            detail={t('library.songCount', { count: pieces.length })}
            render={<Link to="/songs/setlists/$setlistId" params={{ setlistId: setlist.id }} />}
          >
            {pieces.length > 0 ? (
              <span className="block truncate text-sm text-muted-foreground">
                {pieces.map((piece) => entryTitles(piece, locale).primary).join(' · ')}
              </span>
            ) : null}
          </RowLink>
        </li>
      ))}
      <li>{make}</li>
    </ul>
  )
}
