import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** A favourite's small filled ♡ at its row's end in a library (Songs', Practice's), read and chosen alike. */
export function FavouriteMark() {
  const { t } = useTranslation('common')
  return (
    <Heart
      role="img"
      aria-label={t('library.favourites')}
      className="size-4 shrink-0 fill-current text-muted-foreground"
    />
  )
}
