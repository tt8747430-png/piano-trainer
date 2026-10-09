import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

type Mark = 'answer' | 'chosen' | 'other'

/** Each option's line and ink once answered: the answer in the learned green, a wrong pick in red. */
const MARK: Record<Mark, string> = {
  answer: 'border-learned text-foreground',
  chosen: 'border-destructive text-destructive',
  other: 'border-input text-muted-foreground',
}

/**
 * A choice round's answers once one is chosen, where the buttons stood: the answer ticked and a wrong
 * pick crossed, so the learner sees both beside the rest; for a screen reader each says which it is.
 */
export function AnsweredChoices({
  choices,
  answer,
  chosen,
}: {
  choices: readonly { value: string; label: string }[]
  answer: string
  chosen: string
}) {
  const { t } = useTranslation('quiz')
  const markOf = (value: string): Mark =>
    value === answer ? 'answer' : value === chosen ? 'chosen' : 'other'
  return (
    <ul aria-label={t('answers')} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {choices.map(({ value, label }) => {
        const mark = markOf(value)
        return (
          <li
            key={value}
            className={cn(
              'flex h-12 items-center justify-center gap-2 rounded-2xl border bg-card px-5 text-base font-semibold',
              MARK[mark],
            )}
          >
            {mark === 'answer' ? <Check aria-hidden className="size-4 text-learned" /> : null}
            {mark === 'chosen' ? <X aria-hidden className="size-4" /> : null}
            {label}
            {mark === 'other' ? null : (
              <span className="sr-only">{t(mark === 'answer' ? 'theAnswer' : 'yourAnswer')}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
