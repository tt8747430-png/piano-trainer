import { useTranslation } from 'react-i18next'
import {
  selectIsFavouriteOf,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
  type PracticeKind,
} from '@/entities/practice-library'
import { NameHeart } from '@/shared/ui'
import { togglePracticeFavourite } from '../toggle-favourite'

/**
 * The ♡ beside an exercise's, a progression's or a pattern's name (R30-4): pressed while it is a
 * favourite, its heart filled red; named by what a tap does.
 */
export function PracticeFavouriteButton({ kind, id }: { kind: PracticeKind; id: string }) {
  const { t } = useTranslation('common')
  const store = usePracticeLibraryStoreApi()
  const favourite = usePracticeLibrary(selectIsFavouriteOf(kind, id))
  return (
    <NameHeart
      pressed={favourite}
      label={t(favourite ? 'library.unfavourite' : 'library.favourite')}
      onToggle={() => togglePracticeFavourite(store, kind, id)}
    />
  )
}
