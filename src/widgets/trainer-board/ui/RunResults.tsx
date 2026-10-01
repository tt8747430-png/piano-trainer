import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { RunSummary } from '@/features/trainer'
import { Button } from '@/shared/ui/primitives/button'
import { useRoundWords } from './use-round-words'

/**
 * A run summed up (Clefs' result, without points or pressure): right answers, the average answer
 * time and the best streak, the rounds missed with their answers, and Again or Done.
 */
export function RunResults({
  summary,
  onAgain,
  onDone,
}: {
  summary: RunSummary
  onAgain: () => void
  onDone: () => void
}) {
  const { t } = useTranslation('quiz')
  const words = useRoundWords()
  const title = useRef<HTMLHeadingElement>(null)
  // The run ended under the learner's finger: the results take the focus.
  useEffect(() => title.current?.focus(), [])
  const facts = [
    { term: t('summary.right'), value: t('summary.percent', { percent: summary.accuracy }) },
    {
      term: t('summary.averageTime'),
      value: t('summary.seconds', { seconds: (summary.averageMs / 1000).toFixed(1) }),
    },
    { term: t('summary.bestStreak'), value: String(summary.bestStreak) },
  ]
  return (
    <section aria-labelledby="run-results" className="flex flex-col gap-6">
      <h2 id="run-results" ref={title} tabIndex={-1} className="text-4xl outline-none">
        {t('summary.title')}
      </h2>
      <dl className="grid grid-cols-3 gap-3">
        {facts.map(({ term, value }) => (
          <div key={term} className="card flex flex-col gap-1 p-4">
            <dt className="text-sm text-muted-foreground">{term}</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl">{t('summary.missed')}</h3>
        {summary.missed.length === 0 ? (
          <p className="text-muted-foreground">{t('summary.noneMissed')}</p>
        ) : (
          <ul className="card divide-y divide-hairline">
            {summary.missed.map((question, i) => (
              <li key={i} className="px-4 py-3">
                {words.answer(question)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="soft" size="pill" onClick={onDone}>
          {t('done')}
        </Button>
        <Button size="pill" className="flex-1" onClick={onAgain}>
          {t('summary.again')}
        </Button>
      </div>
    </section>
  )
}
