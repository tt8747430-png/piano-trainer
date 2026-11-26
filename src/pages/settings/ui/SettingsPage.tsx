import { Navigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useMediaQuery, WIDE } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { SettingsList } from '@/widgets/settings-screen'

/**
 * Settings (R20): on a phone its list alone, one column, Back to the Profile; on a laptop the list
 * beside its first page, General, opened in its place.
 */
export function SettingsPage() {
  const { t } = useTranslation('settings')
  const wide = useMediaQuery(WIDE)
  if (wide) return <Navigate to="/settings/general" replace />
  return (
    <div className="flex flex-col gap-1">
      <ScreenHeader column title={t('title')} back={<BackButton />} />
      <div className="page-column">
        <SettingsList />
      </div>
    </div>
  )
}
