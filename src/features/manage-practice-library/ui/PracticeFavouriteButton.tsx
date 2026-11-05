import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectIsFavouriteOf,
  usePracticeLibrary,
  usePracticeLibraryStoreApi,
  type PracticeKind,
} from '@/entities/practice-library'
import { RoundButton } from '@/shared/ui'
import { togglePracticeFavourite } from '../toggle-favourite'

/**
 * The ♡ in an exercise's or a progression's bar (R30-4, as a song's): pressed while it is a
 * favourite, a sand fill and a filled heart; named by what a tap does.
 */
export function PracticeFavouriteButton({ kind, id }: { kind: PracticeKind; id: string }) {
  const { t } = useTranslation('common')
  const store = usePracticeLibraryStoreApi()
  const favourite = usePracticeLibrary(selectIsFavouriteOf(kind, id))
  return (
    <RoundButton
      label={t(favourite ? 'library.unfavourite' : 'library.favourite')}
      icon={Heart}
      aria-pressed={favourite}
      onClick={() => togglePracticeFavourite(store, kind, id)}
      className="aria-pressed:bg-chosen aria-pressed:[&_svg]:fill-current"
    />
  )
}
