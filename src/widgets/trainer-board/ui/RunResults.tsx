import { RotateCcw, Target } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { RunSummary } from '@/features/trainer'
import { formatDecimal, formatPercent, useLocale } from '@/shared/i18n'
import { Fab, FloatingActions, RowGroup, RowLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ReviewLink } from './ReviewLink'
import { reviewPage } from './review-page'
import { useRoundWords } from './use-round-words'

/**
 * A run summed up (Clefs' result, without points or pressure): right answers, the average answer
 * time and the best run; What to review, each missed round opening its thing on its page (a chord in
 * Chords, an interval in Intervals, a key in Scales, a cadence in Progressions); then Done, Again,
 * and Review the missed ones, a run of those alone, the capsule's primary. A run of cards: how many
 * and how long each took.
 */
export function RunResults({
  summary,
  onAgain,
  onReview,
  onDone,
}: {
  summary: RunSummary
  onAgain: () => void
  /** A new run of the rounds missed, alone. */
  onReview: () => void
  onDone: () => void
}) {
  const { t } = useTranslation('quiz')
  const words = useRoundWords()
  const locale = useLocale()
  const title = useRef<HTMLHeadingElement>(null)
  // The run ended under the learner's finger: the results take the focus.
  useEffect(() => title.current?.focus(), [])
  const time = {
    term: t('summary.averageTime'),
    value: t('summary.seconds', { seconds: formatDecimal(locale, summary.averageMs / 1000) }),
  }
  // A run of cards has no score: how many were turned over, and how long each took.
  const facts = summary.cards
    ? [{ term: t('summary.cards'), value: String(summary.answered) }, time]
    : [
        { term: t('summary.right'), value: formatPercent(locale, summary.accuracy) },
        time,
        { term: t('summary.bestStreak'), value: String(summary.bestStreak) },
      ]
  const missed = summary.cards ? [] : summary.missed
  // Each thing missed once in the list, however often it was missed.
  const toReview = missed.filter(
    (question, i) =>
      missed.findIndex((other) => words.answer(other) === words.answer(question)) === i,
  )
  return (
    <section aria-labelledby="run-results" className="flex flex-col gap-6">
      <h2 id="run-results" ref={title} tabIndex={-1} className="text-4xl outline-none">
        {t('summary.title')}
      </h2>
      <dl className={summary.cards ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-3 gap-3'}>
        {facts.map(({ term, value }) => (
          <div key={term} className="card flex flex-col gap-1 p-4">
            <dt className="text-sm text-muted-foreground">{term}</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      {summary.cards ? null : missed.length === 0 ? (
        <p className="text-muted-foreground">{t('summary.noneMissed')}</p>
      ) : (
        <RowGroup title={t('summary.review')}>
          {toReview.map((question, i) => {
            const page = reviewPage(question)
            return (
              <li key={i}>
                {page ? (
                  <RowLink
                    title={words.answer(question)}
                    detail={t(`summary.opens.${page}`)}
                    render={<ReviewLink question={question} />}
                  />
                ) : (
                  <p className="px-4 py-3">{words.answer(question)}</p>
                )}
              </li>
            )
          })}
        </RowGroup>
      )}
      <div className="flex flex-wrap gap-3">
        <Button variant="soft" size="pill" onClick={onDone}>
          {t('done')}
        </Button>
        {missed.length > 0 ? (
          <Button variant="soft" size="pill" onClick={onAgain}>
            <RotateCcw data-icon="inline-start" aria-hidden />
            {t('summary.again')}
          </Button>
        ) : null}
      </div>
      <FloatingActions>
        {missed.length > 0 ? (
          <Fab extended label={t('summary.reviewMissed')} icon={Target} onClick={onReview} />
        ) : (
          <Fab extended label={t('summary.again')} icon={RotateCcw} onClick={onAgain} />
        )}
      </FloatingActions>
    </section>
  )
}
