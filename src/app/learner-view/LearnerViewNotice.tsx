import { useTranslation } from 'react-i18next'
import { useLearnerView } from '@/shared/lib/account'
import { Button } from '@/shared/ui/primitives/button'

/**
 * While an editor or admin views the app as a learner (R29 B5): a pill that stays over every screen,
 * saying so, with Exit. Learner view is for the session alone; Exit, a reload or signing out ends it.
 */
export function LearnerViewNotice() {
  const { t } = useTranslation('settings')
  const learner = useLearnerView()
  if (!learner.on) return null
  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center justify-between gap-3 self-center rounded-pill border border-border bg-raised py-1 pr-1 pl-4 elevation-2"
    >
      <span className="font-medium">{t('learnerView.on')}</span>
      <Button variant="soft" className="rounded-pill" onClick={() => learner.set(false)}>
        {t('learnerView.exit')}
      </Button>
    </div>
  )
}
