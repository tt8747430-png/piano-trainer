import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LEVEL_NAME, LEVELS, pathSteps, type Level } from '@/entities/path'
import { selectAllAnswers, selectLearned, useProgress } from '@/entities/progress'
import { cn } from '@/shared/lib'
import { StepRow } from './StepRow'

/**
 * Levels 1–4 in order, each with its count learned and its steps; empty levels are not shown. Each
 * folds under its heading: the level the learner is at (the first not all learned) opens, the others
 * stay folded until opened.
 */
export function PathLevels() {
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
  return (
    <div className="flex flex-col gap-8">
      {levels.map(({ level, inLevel, done }) => {
        const name = `${t('common:level', { level })} · ${t(`common:levelName.${LEVEL_NAME[level]}`)}`
        const open = toggled.get(level) ?? level === current
        const listId = `path-level-${level}`
        return (
          <section key={level} aria-label={name} className="flex flex-col gap-2">
            <h2 className="text-2xl">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setToggled((before) => new Map(before).set(level, !open))}
                className="flex w-full items-baseline justify-between gap-3 rounded-lg text-left"
              >
                <span className="flex items-center gap-2">
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'size-5 self-center text-muted-foreground transition-transform duration-200 ease-out',
                      open ? '' : '-rotate-90',
                    )}
                  />
                  {name}
                </span>
                <span className="font-sans text-base text-muted-foreground tabular-nums">
                  {t('path:progress', { learned: done, total: inLevel.length })}
                </span>
              </button>
            </h2>
            <div aria-hidden className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${(done / inLevel.length) * 100}%` }}
              />
            </div>
            <ul
              id={listId}
              hidden={!open}
              className="flex flex-col divide-y divide-hairline card px-2 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:divide-y-0 lg:px-4 lg:py-2"
            >
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
