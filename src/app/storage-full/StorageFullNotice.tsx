import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { onFailedWrite } from '@/shared/lib'
import { ButtonLink, Notice } from '@/shared/ui'

/**
 * Says so when a save could not be written, the device out of room: a take or a song saved then would
 * be gone after a reload. It leads to Settings, where a backup is downloaded, until closed.
 */
export function StorageFullNotice() {
  const { t } = useTranslation('common')
  const [full, setFull] = useState(false)
  useEffect(() => onFailedWrite(() => setFull(true)), [])
  if (!full) return null
  return (
    <Notice
      line={t('storageFull.message')}
      detail={t('storageFull.help')}
      onClose={() => setFull(false)}
    >
      <ButtonLink render={<Link to="/settings/data" />} onClick={() => setFull(false)}>
        {t('storageFull.settings')}
      </ButtonLink>
    </Notice>
  )
}
