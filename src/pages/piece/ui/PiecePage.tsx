import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScreenHeader } from '@/shared/ui'

export function PiecePage() {
  const { t } = useTranslation('piece')
  const { pieceId } = useParams({ from: '/shell/songs/$pieceId' })
  return (
    <>
      <ScreenHeader title={t('title')} />
      <p className="text-muted-foreground">{pieceId}</p>
    </>
  )
}
