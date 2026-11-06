import { Heart } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { TileMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import { ALL, FAVOURITES, MINE, type PracticeLibraryView } from '../model/library-view'
import type { LibraryKind } from '../model/library-words'

/**
 * A place of a practice library with nothing to show (R30-4): Favourites before any, with the way
 * one is made and All; Mine before the learner made anything, with how to make one (`mine`); and a
 * search or a level that keeps nothing, saying what found nothing, with Clear.
 */
export function LibraryEmpty({
  kind,
  view,
  place,
  filtering,
  mine,
}: {
  kind: LibraryKind
  view: PracticeLibraryView
  /** The place open, read. */
  place: string
  filtering: boolean
  /** What an empty Mine offers: the way to make one. */
  mine?: ReactNode
}) {
  const { t } = useTranslation('practice')
  const set = useSetSearch<PracticeLibraryView>()
  if (filtering) {
    const searched = view.q.trim()
    return (
      <Empty>
        <EmptyHeader>
          {/* A long query breaks rather than run off the screen. */}
          <EmptyTitle className="break-words">
            {searched
              ? t(`library.kinds.${kind}.noMatch`, { query: searched })
              : t('library.noneFiltered')}
          </EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="soft" onClick={() => set({ q: '', stage: 'any' })}>
            {t('library.clear')}
          </Button>
        </EmptyContent>
      </Empty>
    )
  }
  if (place === FAVOURITES)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <TileMark icon={Heart} paint="sand" />
          </EmptyMedia>
          <EmptyTitle>{t('library.noFavourites')}</EmptyTitle>
          <EmptyDescription>{t(`library.kinds.${kind}.favouritesHint`)}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="soft" onClick={() => set({ place: ALL })}>
            {t(`library.kinds.${kind}.all`)}
          </Button>
        </EmptyContent>
      </Empty>
    )
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>
          {place === MINE ? t(`library.kinds.${kind}.mineEmpty`) : t('library.empty')}
        </EmptyTitle>
      </EmptyHeader>
      {place === MINE && mine ? <EmptyContent>{mine}</EmptyContent> : null}
    </Empty>
  )
}
