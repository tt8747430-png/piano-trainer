import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenTitle } from '@/shared/ui'
import { BackButton } from './BackButton'

export function PlayerPage() {
  const { t } = useTranslation('player')
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  return (
    <>
      <div className="flex items-start gap-1">
        <BackButton pieceId={pieceId} />
        <ScreenTitle>{t('title')}</ScreenTitle>
      </div>
      <p className="text-muted-foreground">{pieceId}</p>
    </>
  )
}
