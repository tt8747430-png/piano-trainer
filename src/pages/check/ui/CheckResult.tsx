import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ratingOf, selectAllAnswers, selectIsLearned, useProgress } from '@/entities/progress'
import type { CheckPlan } from '@/features/quiz'
import { skillOf } from '@/shared/lib/music'
import { ButtonLink, RatingMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The score, each skill's rating with a way to the explorer for a gap, and whether the step is now learned. */
export function CheckResult({
  plan,
  correct,
  title,
  newlyLearned,
  onDone,
}: {
  plan: CheckPlan
  correct: number
  title: string
  newlyLearned: boolean
  onDone: () => void
}) {
  const { t } = useTranslation(['quiz', 'theory'])
  const answers = useProgress(selectAllAnswers)
  const learned = useProgress(selectIsLearned(plan.marks ?? plan.of))

  return (
    <section className="flex flex-1 flex-col gap-6">
      <p className="text-6xl font-extrabold tracking-tight tabular-nums">
        {t('score', { correct, total: plan.length })}
      </p>
      {plan.marks && learned && newlyLearned ? (
        <p className="text-lg font-semibold text-primary">{t('marked', { title })}</p>
      ) : null}
      <ul className="flex flex-col divide-y divide-border rounded-3xl bg-card ring-1 ring-border">
        {plan.skills.map((skillId) => {
          const skill = skillOf(skillId)
          const rating = ratingOf(answers, skillId)
          // A chord opens in Chords, a scale in Scales.
          const { name, explorer, open } =
            skill.kind === 'chord'
              ? {
                  name: t(`theory:quality.${skill.quality}`),
                  explorer: <Link to="/theory/chords" search={{ quality: skill.quality }} />,
                  open: t('openChords'),
                }
              : {
                  name: t(`theory:scaleKind.${skill.scale}`),
                  explorer: <Link to="/theory/scales" search={{ kind: skill.scale }} />,
                  open: t('openScales'),
                }
          return (
            <li key={skillId} className="flex min-h-14 items-center gap-3 px-4">
              <RatingMark rating={rating} />
              <span className="flex-1">{name}</span>
              {rating === 'known' ? null : (
                <ButtonLink variant="link" className="px-0" render={explorer}>
                  {open}
                </ButtonLink>
              )}
            </li>
          )
        })}
      </ul>
      <Button size="pill" className="mt-auto" onClick={onDone}>
        {t('done')}
      </Button>
    </section>
  )
}
