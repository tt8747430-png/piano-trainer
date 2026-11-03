import { Download, Info, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { APP_BUILD } from '@/shared/config'
import { useAppUpdate } from '@/shared/lib/app-update'
import { RowButton } from '@/shared/ui'

/**
 * Settings' Version, as iOS's Software Update: the build and where the next version stands; a tap
 * looks for one ("Can't check while offline" without the network). A version waiting is installed
 * from the row under it, the banner's same install, so the banner put off with Later is never the
 * only way to it.
 */
export function UpdateRows() {
  const { t } = useTranslation('settings')
  const { status, check, install } = useAppUpdate()
  return (
    <>
      <RowButton
        title={t('about.version')}
        icon={status === 'checking' ? LoaderCircle : Info}
        paint="lilac"
        value={`${APP_BUILD} · ${t(`about.update.${status}`)}`}
        disabled={status === 'checking'}
        onClick={check}
      />
      {status === 'ready' ? (
        <RowButton
          title={t('about.update.install')}
          icon={Download}
          paint="grass"
          onClick={install}
        />
      ) : null}
    </>
  )
}
