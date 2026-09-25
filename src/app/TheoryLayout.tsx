import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'
import { TheoryNav } from '@/widgets/theory-nav'

export function TheoryLayout() {
  const { t } = useTranslation('theory')
  return (
    <>
      <ScreenHeader title={t('title')} />
      <TheoryNav />
      <Outlet />
    </>
  )
}
