import { Download, LoaderCircle, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppUpdate } from '@/shared/lib/app-update'
import { RowButton } from '@/shared/ui'

/**
 * About's Software update, as iOS's: where the next version stands as its value; a tap looks for one
 * ("Unavailable offline" without the network). A version waiting is installed from the row under it,
 * the banner's same install, so the banner put off with Later is never the only way to it.
 */
export function UpdateRows() {
  const { t } = useTranslation('settings')
  const { status, check, install } = useAppUpdate()
  const busy = status === 'checking' || status === 'downloading'
  return (
    <>
      <RowButton
        title={t('about.update.label')}
        icon={busy ? LoaderCircle : RefreshCw}
        paint="sky"
        value={t(`about.update.${status}`)}
        disabled={busy}
        onClick={check}
      />
      {status === 'ready' || status === 'installing' ? (
        <RowButton
          title={t(status === 'installing' ? 'about.update.installing' : 'about.update.install')}
          icon={status === 'installing' ? LoaderCircle : Download}
          paint="grass"
          disabled={status === 'installing'}
          onClick={install}
        />
      ) : null}
    </>
  )
}
