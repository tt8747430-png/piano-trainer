import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import type { SongsFilter } from '../model/songs-filter'
import { NewSongSheet } from './NewSongSheet'

/**
 * A shelf of Songs with nothing to list: one that has no songs yet says how to fill it (Your songs,
 * with New song; the favourites, by the ♡); else what found nothing (the search, the level, the
 * chords known), and Clear filters.
 */
export function SongsEmpty({
  shelf,
  filter,
  onClear,
}: {
  /** Why the shelf is empty: it has no songs yet (`mine`, `favourites`), or the filters kept none. */
  shelf: 'mine' | 'favourites' | 'filtered'
  filter: SongsFilter
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  if (shelf === 'mine')
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{t('mineEmpty.title')}</EmptyTitle>
          <EmptyDescription>{t('mineEmpty.description')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <NewSongSheet
            trigger={
              <Button variant="soft">
                <Plus data-icon="inline-start" aria-hidden />
                {t('newSong')}
              </Button>
            }
          />
        </EmptyContent>
      </Empty>
    )
  if (shelf === 'favourites')
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{t('favouritesEmpty.title')}</EmptyTitle>
          <EmptyDescription>{t('favouritesEmpty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  const searched = filter.q.trim()
  const stage = filter.stage === 'any' ? null : common(`stage.${filter.stage}`)
  const said = searched
    ? stage
      ? t('emptyQueryStage', { query: searched, stage })
      : t('emptyQuery', { query: searched })
    : stage
      ? t('emptyStage', { stage })
      : filter.known
        ? t('emptyKnown')
        : t('empty')
  return (
    <Empty>
      <EmptyHeader>
        {/* A long query breaks rather than run off the screen. */}
        <EmptyTitle className="break-words">{said}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="soft" onClick={onClear}>
          {t('clearFilters')}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
