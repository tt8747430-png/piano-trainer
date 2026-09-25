import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'
import { BackButton } from './BackButton'

export function PlayerPage() {
  const { t } = useTranslation('player')
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  return (
    <>
      <ScreenHeader title={t('title')} back={<BackButton pieceId={pieceId} />} />
      <p className="text-muted-foreground">{pieceId}</p>
    </>
  )
}
