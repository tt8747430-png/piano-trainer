import { Link, useSearch } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { LEARN_TABS, lessonsIn, useModuleName, type Lesson } from '@/entities/lesson'
import { lessonLearnedId, selectLearned, useProgress } from '@/entities/progress'
import { localText, useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import {
  FoldGroup,
  LearnedBadge,
  LevelMark,
  NavTab,
  NavTabs,
  PAGE_TILES,
  RowLink,
  ScreenHeader,
} from '@/shared/ui'
import { lessonToContinue, openModules, withToggled, type LearnView } from '../model/learn-view'
import { lessonGroups } from '../model/lesson-groups'

/**
 * Learn (ADR 0042): its two tabs, the subjects and the courses; under the tab, the lesson to continue
 * with once something in it is learned, then its modules, each folding under its name, what it is and
 * its count learned, its lessons numbered in the order they are taught, each with its level.
 */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  const view = useSearch({ from: '/shell/learn' })
  const set = useViewChange<LearnView>()
  const learned = useProgress(selectLearned)
  const moduleName = useModuleName()
  const isLearned = (lesson: Lesson) => learned[lessonLearnedId(lesson.id)] !== undefined
  const open = openModules(view, learned)
  const next = lessonToContinue(view.tab, learned)
  return (
    <div className="flex flex-col gap-8">
      <ScreenHeader
        title={t('learn:title')}
        tabs={
          <NavTabs label={t('learn:tabs.label')}>
            {LEARN_TABS.map((tab) => (
              <NavTab key={tab} to="/learn" search={{ tab }} replace current={tab === view.tab}>
                {t(`learn:tabs.${tab}`)}
              </NavTab>
            ))}
          </NavTabs>
        }
      />
      {next ? <ContinueRow lesson={next} /> : null}
      {lessonGroups(view.tab).map(({ module, lessons }) => {
        const done = lessons.filter(isLearned).length
        return (
          <FoldGroup
            key={module}
            title={moduleName(module)}
            detail={t(`learn:moduleAbout.${module}`)}
            count={t('learn:progress', { learned: done, total: lessons.length })}
            progress={done / lessons.length}
            open={open.has(module)}
            onToggle={() => set({ open: withToggled(open, module) })}
          >
            {lessons.map((lesson, i) => {
              const learnedIt = isLearned(lesson)
              return (
                <li key={lesson.id}>
                  <RowLink
                    title={localText(lesson.title, locale)}
                    numeral={i + 1}
                    // Grass is learned: a lesson wears it once it is, its page's tile before.
                    paint={learnedIt ? 'grass' : PAGE_TILES.lesson.paint}
                    trailing={
                      <>
                        <LevelMark level={lesson.level} />
                        {learnedIt ? <LearnedBadge label={t('common:learned.done')} /> : null}
                      </>
                    }
                    render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
                  />
                </li>
              )
            })}
          </FoldGroup>
        )
      })}
    </div>
  )
}

/** The lesson to continue with: its title, its module and its number in it. */
function ContinueRow({ lesson }: { lesson: Lesson }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const moduleName = useModuleName()
  const id = useId()
  const inModule = lessonsIn(lesson.module)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {t('continue')}
      </h2>
      <div className="card">
        <RowLink
          title={localText(lesson.title, locale)}
          detail={`${moduleName(lesson.module)} · ${t('place', {
            n: inModule.indexOf(lesson) + 1,
            total: inModule.length,
          })}`}
          icon={PAGE_TILES.lesson.icon}
          paint={PAGE_TILES.lesson.paint}
          render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
        />
      </div>
    </section>
  )
}
