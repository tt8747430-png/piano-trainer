import { Navigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, ScreenHeader } from '@/shared/ui'
import { SettingsList } from '@/widgets/settings-screen'

/**
 * Settings (R20): on a phone its list alone, one column, Back to the Profile; on a laptop the list
 * beside its first page, General, opened in its place.
 */
export function SettingsPage() {
  const { t } = useTranslation('settings')
  const wide = useMediaQuery(LAPTOP)
  if (wide) return <Navigate to="/settings/general" replace />
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} back={<BackButton />} />
      <div className="mx-auto w-full max-w-2xl">
        <SettingsList />
      </div>
    </div>
  )
}
