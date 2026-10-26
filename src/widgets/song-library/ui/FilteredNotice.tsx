import { ListFilter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * What the filters are doing to the list (Mindscape's `FilteredNotice`): how many songs they keep of
 * how many, and Clear filters, which shows them all again. Nothing while they hide none.
 */
export function FilteredNotice({
  shown,
  hidden,
  onClear,
}: {
  shown: number
  hidden: number
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  if (hidden <= 0) return null
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p role="status" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ListFilter aria-hidden className="size-4 shrink-0" />
        {t('filtered', { shown, total: shown + hidden })}
      </p>
      <Button variant="link" className="h-11 px-0" onClick={onClear}>
        {t('clearFilters')}
      </Button>
    </div>
  )
}
