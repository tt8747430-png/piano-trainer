import { useTranslation } from 'react-i18next'
import { LEVEL_NAME, LEVELS, pathSteps } from '@/entities/path'
import { selectAllAnswers, selectLearned, useProgress } from '@/entities/progress'
import { StepRow } from './StepRow'

/** Levels 1–4 in order, each with its count learned and its steps; empty levels are not shown. */
export function PathLevels() {
  const { t } = useTranslation(['path', 'common'])
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const steps = pathSteps()
  return (
    <div className="flex flex-col gap-8">
      {LEVELS.map((level) => {
        const inLevel = steps.filter((s) => s.level === level)
        if (inLevel.length === 0) return null
        const done = inLevel.filter((s) => learned[s.id] !== undefined).length
        const name = `${t('common:level', { level })} · ${t(`common:levelName.${LEVEL_NAME[level]}`)}`
        return (
          <section key={level} aria-label={name} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-2xl">{name}</h2>
              <span className="text-muted-foreground tabular-nums">
                {t('path:progress', { learned: done, total: inLevel.length })}
              </span>
            </div>
            <ul className="flex flex-col divide-y divide-hairline card px-2 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:divide-y-0 lg:px-4 lg:py-2">
              {inLevel.map((placed) => (
                <StepRow key={placed.id} placed={placed} answers={answers} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
