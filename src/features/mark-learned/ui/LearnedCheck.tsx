import { useTranslation } from 'react-i18next'
import type { StepId } from '@/entities/path'
import { LearnedMark } from './LearnedMark'
import { useLearned } from './use-learned'

/** A step's row's round check: marks the step learned or unmarks it, named by the step. */
export function LearnedCheck({ step, title }: { step: StepId; title: string }) {
  const { t } = useTranslation('common')
  const { learned, toggle } = useLearned(step)
  return (
    <button
      type="button"
      aria-pressed={learned}
      aria-label={t('learned.toggle', { title })}
      onClick={toggle}
      className="grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ease-out hover:bg-muted"
    >
      <LearnedMark learned={learned} />
    </button>
  )
}
