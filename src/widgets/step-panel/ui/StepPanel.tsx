import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { stepOf, type StepId } from '@/entities/step'
import { LearnedButton } from '@/features/mark-learned'
import { ButtonLink } from '@/shared/ui'
import { useStepTitle } from '@/widgets/curriculum'

/** The step an explorer was opened from, a journey's chapter's check: its Check and its learned toggle. */
export function StepPanel({ step }: { step: StepId }) {
  const { t } = useTranslation('practice')
  const stepTitle = useStepTitle()
  const placed = stepOf(step)
  if (!placed) return null
  const title = stepTitle(placed).primary
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-3xl bg-secondary p-4 text-secondary-foreground">
      <h2 className="min-w-0 flex-1 text-lg">{title}</h2>
      <ButtonLink render={<Link to="/check" search={{ of: step }} />}>
        {t('checkYourself')}
      </ButtonLink>
      <LearnedButton step={step} />
    </section>
  )
}
