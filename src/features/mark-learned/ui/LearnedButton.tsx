import { useTranslation } from 'react-i18next'
import type { StepId } from '@/entities/path'
import { Button } from '@/shared/ui/primitives/button'
import { LearnedMark } from './LearnedMark'
import { useLearned } from './use-learned'

/** A step's screen's Learned button: marks the step learned or unmarks it. */
export function LearnedButton({ step }: { step: StepId }) {
  const { t } = useTranslation('common')
  const { learned, toggle } = useLearned(step)
  return (
    <Button variant="soft" aria-pressed={learned} onClick={toggle}>
      <LearnedMark learned={learned} />
      {t('learned.done')}
    </Button>
  )
}
