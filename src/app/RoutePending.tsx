import { useTranslation } from 'react-i18next'
import { Spinner } from '@/shared/ui/primitives/spinner'

/** Shown while a screen's chunk loads, after 300ms; chunks are precached, so rarely seen. */
export function RoutePending() {
  const { t } = useTranslation('common')
  return (
    <div role="status" aria-label={t('loading')} className="grid min-h-96 place-items-center">
      <Spinner />
    </div>
  )
}
