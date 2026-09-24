import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'

export function PlayerPage() {
  const { t } = useTranslation('player')
  const { pieceId } = useParams({ strict: false })
  return (
    <>
      <ScreenTitle>{t('title')}</ScreenTitle>
      <p className="text-muted-foreground">{pieceId}</p>
    </>
  )
}
