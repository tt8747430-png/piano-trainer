import { FolderInput, Plus } from 'lucide-react'
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
import type { LibraryPage } from '../model/use-library-page'

/**
 * A place of the library with nothing to list (Mindscape's `LibraryEmpty`): an empty folder offers
 * New song and Move songs here; an empty Home, New song; filters that keep nothing say what found
 * nothing, and Clear filters.
 */
export function LibraryEmpty({
  page,
  inFolder,
  filter,
  onClear,
}: {
  page: LibraryPage
  inFolder: boolean
  filter: SongsFilter
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  if (page.view.filtering) {
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
          : filter.favourites
            ? t('emptyFavourites')
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t(inFolder ? 'folder.emptyTitle' : 'homeEmpty.title')}</EmptyTitle>
        <EmptyDescription>
          {t(inFolder ? 'folder.emptyDescription' : 'homeEmpty.description')}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center">
        <Button variant="soft" onClick={() => page.open({ kind: 'new-song' })}>
          <Plus data-icon="inline-start" aria-hidden />
          {t('newSong')}
        </Button>
        {inFolder ? (
          <Button variant="soft" onClick={() => page.open({ kind: 'move-in' })}>
            <FolderInput data-icon="inline-start" aria-hidden />
            {t('folder.moveIn')}
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  )
}
