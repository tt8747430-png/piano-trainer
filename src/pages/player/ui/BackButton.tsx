import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/** Back to wherever the learner came from; a Player opened directly goes back to its song. */
export function BackButton({ pieceId }: { pieceId: string }) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const goBack = () => {
    if (canGoBack) router.history.back()
    else void router.navigate({ to: '/songs/$pieceId', params: { pieceId } })
  }

  return (
    <Button variant="ghost" size="icon" className="-ml-3" aria-label={t('back')} onClick={goBack}>
      <ArrowLeft aria-hidden />
    </Button>
  )
}
