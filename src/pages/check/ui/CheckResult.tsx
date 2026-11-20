import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ratingOf, selectAllAnswers, selectIsLearned, useProgress } from '@/entities/progress'
import type { CheckPlan } from '@/features/trainer'
import { skillOf } from '@/shared/lib/music'
import { qualityParams } from '@/shared/lib'
import { GroupLink, SettingsGroup } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The Check's results (`r54_practice_more.py`'s `CKRES`): Results over the score, a card saying where the step
 * stands (marked learned, or what to practise first), the skills still to practise each a way to its explorer,
 * then Again beside the honey Done.
 */
export function CheckResult({
  plan,
  correct,
  title,
  newlyLearned,
  onAgain,
  onDone,
}: {
  plan: CheckPlan
  correct: number
  title: string
  newlyLearned: boolean
  onAgain: () => void
  onDone: () => void
}) {
  const { t } = useTranslation(['quiz', 'music'])
  const answers = useProgress(selectAllAnswers)
  const learned = useProgress(selectIsLearned(plan.of))
  const score = useRef<HTMLParagraphElement>(null)
  // The score replaces the question whose Next ended the check: it takes the focus, and is read.
  useEffect(() => score.current?.focus(), [])
  const gaps = plan.skills.filter((skillId) => ratingOf(answers, skillId) !== 'known')
  const scales = gaps.some((skillId) => skillOf(skillId).kind === 'scale')

  return (
    <section className="mx-auto -mt-1 flex w-full max-w-140 flex-col gap-4 lg:-mt-3">
      <div className="flex flex-col items-center gap-1 py-3">
        <span className="text-[0.8125rem] leading-[normal] font-bold tracking-[0.04em] text-muted-foreground uppercase">
          {t('results')}
        </span>
        <p
          ref={score}
          tabIndex={-1}
          className="text-[3.5rem] leading-[normal] font-bold tabular-nums outline-none"
        >
          {t('score', { correct, total: plan.length })}
        </p>
      </div>
      {learned && newlyLearned ? (
        <div className="flex items-center gap-3 card p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paint-grass text-on-paint-grass">
            <Check aria-hidden className="size-5" />
          </span>
          <p className="font-semibold">{t('marked', { title })}</p>
        </div>
      ) : null}
      {gaps.length > 0 ? (
        <>
          <p className="card p-4 leading-[1.45]">
            {scales ? t('scaleFirst') : t('chordsFirst', { count: gaps.length })}
          </p>
          <SettingsGroup title={t('skills')} flush>
            {gaps.map((skillId) => {
              const skill = skillOf(skillId)
              // A chord opens in Chords, a scale in Scales.
              return skill.kind === 'chord' ? (
                <GroupLink
                  key={skillId}
                  label={t(`music:quality.${skill.quality}`)}
                  value={t('openChords')}
                  render={<Link to="/practice/chords" search={qualityParams(skill.quality)} />}
                />
              ) : (
                <GroupLink
                  key={skillId}
                  label={t(`music:scaleKind.${skill.scale}`)}
                  value={t('openScales')}
                  render={<Link to="/practice/scales" search={{ kind: skill.scale }} />}
                />
              )
            })}
          </SettingsGroup>
        </>
      ) : null}
      <div className="flex gap-2">
        <Button variant="quiet" size="lg" className="flex-1" onClick={onAgain}>
          {t('again')}
        </Button>
        <Button size="lg" className="flex-1" onClick={onDone}>
          {t('done')}
        </Button>
      </div>
    </section>
  )
}
