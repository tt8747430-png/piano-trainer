import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LEVEL_NAME, LEVELS, pathSteps, type Level } from '@/entities/path'
import {
  selectAllAnswers,
  selectLearned,
  selectSuggestedStep,
  useProgress,
} from '@/entities/progress'
import { FoldGroup } from '@/shared/ui'
import { JourneyNode, type NodePlace } from './JourneyNode'

const placeOf = (i: number, count: number): NodePlace =>
  count === 1 ? 'alone' : i === 0 ? 'first' : i === count - 1 ? 'last' : 'between'

/**
 * The Path's levels drawn as a journey (ADR 0049): each level a chapter with its count learned and its
 * bar, its steps nodes on one line, the one Continue opens lit. The level the learner is at (the first
 * not all learned) is open; the others fold until opened.
 */
export function Journey() {
  const { t } = useTranslation(['path', 'common'])
  const learned = useProgress(selectLearned)
  const answers = useProgress(selectAllAnswers)
  const next = useProgress(selectSuggestedStep)?.id
  const steps = pathSteps()
  const levels = LEVELS.map((level) => {
    const inLevel = steps.filter((s) => s.level === level)
    const done = inLevel.filter((s) => learned[s.id] !== undefined).length
    return { level, inLevel, done }
  }).filter(({ inLevel }) => inLevel.length > 0)
  const current = (levels.find(({ inLevel, done }) => done < inLevel.length) ?? levels[0])?.level
  const [toggled, setToggled] = useState<ReadonlyMap<Level, boolean>>(new Map())
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      {levels.map(({ level, inLevel, done }) => {
        const open = toggled.get(level) ?? level === current
        return (
          <FoldGroup
            key={level}
            title={`${t('common:level', { level })} · ${t(`common:levelName.${LEVEL_NAME[level]}`)}`}
            count={t('path:progress', { learned: done, total: inLevel.length })}
            progress={done / inLevel.length}
            open={open}
            onToggle={() => setToggled((before) => new Map(before).set(level, !open))}
            listClassName="flex flex-col gap-2"
          >
            {inLevel.map((placed, i) => (
              <JourneyNode
                key={placed.id}
                placed={placed}
                answers={answers}
                learned={learned[placed.id] !== undefined}
                next={placed.id === next}
                place={placeOf(i, inLevel.length)}
              />
            ))}
          </FoldGroup>
        )
      })}
    </div>
  )
}
