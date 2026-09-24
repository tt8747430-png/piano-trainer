import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'
import { TheoryNav } from '@/widgets/theory-nav'

export function TheoryLayout() {
  const { t } = useTranslation('theory')
  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <TheoryNav />
      <Outlet />
    </>
  )
}
