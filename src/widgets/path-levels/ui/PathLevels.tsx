import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LEVEL_NAME, LEVELS, pathSteps, type Level } from '@/entities/path'
import { selectAllAnswers, selectLearned, useProgress } from '@/entities/progress'
import { FoldGroup } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import type { PathView } from '../model/path-view'
import { StepRow } from './StepRow'

/**
 * Levels 1–4 in order, each with its count learned and its steps; empty levels are not shown. Each
 * folds under its heading: the level the learner is at (the first not all learned) opens, the others
 * stay folded until opened. Hide learned leaves the learned steps out, each level's count kept.
 */
export function PathLevels({
  view,
  onChange,
}: {
  view: PathView
  onChange: (change: Partial<PathView>) => void
}) {
  const { t } = useTranslation(['path', 'common'])
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const steps = pathSteps()
  const levels = LEVELS.map((level) => {
    const inLevel = steps.filter((s) => s.level === level)
    const done = inLevel.filter((s) => learned[s.id] !== undefined).length
    return { level, inLevel, done }
  }).filter(({ inLevel }) => inLevel.length > 0)
  // The first level not all learned; with every one learned, the first.
  const current = (levels.find(({ inLevel, done }) => done < inLevel.length) ?? levels[0])?.level
  // What the learner opened or folded; any other level is open when it is the one they are at.
  const [toggled, setToggled] = useState<ReadonlyMap<Level, boolean>>(new Map())
  const anyLearned = levels.some(({ done }) => done > 0)
  return (
    <div className="flex flex-col gap-8">
      {anyLearned ? (
        <Toggle
          className="-mb-4 self-end"
          pressed={view.hideLearned}
          onPressedChange={(hideLearned) => onChange({ hideLearned })}
        >
          {t('path:hideLearned')}
        </Toggle>
      ) : null}
      {levels.map(({ level, inLevel, done }) => {
        const name = `${t('common:level', { level })} · ${t(`common:levelName.${LEVEL_NAME[level]}`)}`
        const open = toggled.get(level) ?? level === current
        return (
          <FoldGroup
            key={level}
            title={name}
            count={t('path:progress', { learned: done, total: inLevel.length })}
            progress={done / inLevel.length}
            open={open}
            onToggle={() => setToggled((before) => new Map(before).set(level, !open))}
            listClassName="flex flex-col divide-y divide-hairline card px-2 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:divide-y-0 lg:px-4 lg:py-2"
          >
            {inLevel
              .filter((placed) => !view.hideLearned || learned[placed.id] === undefined)
              .map((placed) => (
                <StepRow key={placed.id} placed={placed} answers={answers} />
              ))}
          </FoldGroup>
        )
      })}
    </div>
  )
}
