import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { onFailedWrite } from '@/shared/lib'
import { ButtonLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

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
    <div role="alert" className="pointer-events-auto flex flex-col gap-3 card p-4 shadow-lg">
      <p className="font-medium">{t('storageFull.message')}</p>
      <p className="text-sm text-muted-foreground">{t('storageFull.help')}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setFull(false)}>
          {t('close')}
        </Button>
        <ButtonLink render={<Link to="/settings" />} onClick={() => setFull(false)}>
          {t('storageFull.settings')}
        </ButtonLink>
      </div>
    </div>
  )
}
