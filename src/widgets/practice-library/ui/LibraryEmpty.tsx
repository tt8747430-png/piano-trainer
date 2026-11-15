import { Heart, History, Inbox, ListFilter, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetSearch } from '@/shared/lib'
import { Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ALL, FAVOURITES, MINE, RECENT, type PracticeLibraryView } from '../model/library-view'
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
      <Said
        icon={searched ? SearchX : ListFilter}
        title={
          searched
            ? t(`library.kinds.${kind}.noMatch`, { query: searched })
            : t('library.noneFiltered')
        }
        action={
          <Button variant="ghost" onClick={() => set({ q: '', stage: 'any' })}>
            {t('library.clear')}
          </Button>
        }
      />
    )
  }
  if (place === RECENT)
    return (
      <Said
        icon={History}
        title={t('library.noRecent')}
        description={t('library.noRecentHint')}
        action={
          <Button variant="ghost" onClick={() => set({ place: ALL })}>
            {t(`library.kinds.${kind}.all`)}
          </Button>
        }
      />
    )
  if (place === FAVOURITES)
    return (
      <Said
        icon={Heart}
        title={t('library.noFavourites')}
        description={t(`library.kinds.${kind}.favouritesHint`)}
        action={
          <Button variant="ghost" onClick={() => set({ place: ALL })}>
            {t(`library.kinds.${kind}.all`)}
          </Button>
        }
      />
    )
  return (
    <Said
      icon={Inbox}
      title={place === MINE ? t(`library.kinds.${kind}.mineEmpty`) : t('library.empty')}
      action={place === MINE ? mine : undefined}
    />
  )
}
