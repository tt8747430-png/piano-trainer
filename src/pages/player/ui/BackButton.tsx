import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundButton } from '@/shared/ui'

/** Back to wherever the learner came from; a Player opened directly goes back to its song. */
export function BackButton({ pieceId }: { pieceId: string }) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const goBack = () => {
    if (canGoBack) router.history.back()
    else void router.navigate({ to: '/songs/$pieceId', params: { pieceId } })
  }

  return <RoundButton label={t('back')} icon={ArrowLeft} onClick={goBack} />
}
