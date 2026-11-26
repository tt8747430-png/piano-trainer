import { Bookmark } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/** How often an item is saved: a bookmark and its number, said in words. */
export function SavesCount({ count }: { count: number }) {
  const { t } = useTranslation('songs')
  return (
    <span className="flex shrink-0 items-center gap-1 tabular-nums">
      <Bookmark aria-hidden className="size-4" />
      <span aria-hidden>{count}</span>
      <span className="sr-only">{t('explore.saves', { count })}</span>
    </span>
  )
}
