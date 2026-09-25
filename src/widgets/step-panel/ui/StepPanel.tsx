import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { pathSteps, useStepTitle, type StepId } from '@/entities/path'
import { LearnedToggle } from '@/features/mark-learned'
import { ButtonLink } from '@/shared/ui'

/** The path step an explorer was opened from: its check and its learned toggle. */
export function StepPanel({ step }: { step: StepId }) {
  const { t } = useTranslation('theory')
  const stepTitle = useStepTitle()
  const placed = pathSteps().find((s) => s.id === step)
  if (!placed) return null
  const title = stepTitle(placed.step).primary
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-3xl bg-secondary p-4 text-secondary-foreground">
      <h2 className="min-w-0 flex-1 text-lg font-bold">{title}</h2>
      <ButtonLink render={<Link to="/check" search={{ of: step }} />}>
        {t('checkYourself')}
      </ButtonLink>
      <LearnedToggle step={step} title={title} variant="text" />
    </section>
  )
}
